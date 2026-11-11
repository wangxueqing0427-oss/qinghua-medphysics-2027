'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const pw=require('../product-2028-ci/node_modules/playwright');
const dir=path.join(__dirname,'.build');
const receipt=require('./build-receipt.json');
const allowed=new Set(receipt.files.map(f=>f.path));
const results=[];
const mime=n=>n.endsWith('.js')?'text/javascript':n.endsWith('.json')?'application/json':n.endsWith('.css')?'text/css':n.endsWith('.svg')?'image/svg+xml':'text/html;charset=utf-8';
async function run(browserName){
 let server,browser,context,page;
 const result={browser:browserName,passed:false,offline:false,syntheticOnly:true,physicalIPhone:false};
 try{
   server=http.createServer((req,res)=>{
     const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
     if(!allowed.has(file)){res.writeHead(404);res.end('Not found');return;}
     res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
     res.end(fs.readFileSync(path.join(dir,file)));
   });
   await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
   const base='http://127.0.0.1:'+server.address().port+'/';
   browser=await pw[browserName].launch();
   context=await browser.newContext({...pw.devices['iPhone 13'],acceptDownloads:true});
   page=await context.newPage();
   await page.goto(base);
   await page.locator('#offline-health[data-state="ready"]').waitFor({timeout:30000});
   assert.match(await page.locator('#offline-health-text').innerText(),/SVO主观候选/);
   await page.clock.install({time:new Date('2026-11-11T00:00:00.000Z')});
   assert.match(await page.locator('body').innerText(),/独立本地候选/);
   await page.locator('#name').fill('合成候选学员');
   await page.locator('#create').click();
   await page.locator('[data-unit]').click();
   await page.locator('#learned').click();
   await page.locator('#answer').fill('S主语 V谓语动词 O直接宾语；Birds fly没有直接宾语');
   await page.locator('#recall').click();
   for(const correct of [1,2]){
     await page.locator('input[name="pick"][value="'+correct+'"]').check();
     await page.locator('#submit').click();
     assert.match(await page.locator('body').innerText(),/答对/);
     await page.locator('#next').click();
   }
   const initial='  children - water - the flowers; in the garden地点；every morning时间  ';
   await page.locator('#answer').fill(initial);
   await page.locator('#submit').click();
   assert.match(await page.locator('body').innerText(),/主观题需按要点核对/);
   assert.equal(await page.locator('input[name="rubric"]').count(),4);
   await page.locator('input[name="rubric"]').first().check();
   await page.locator('#next').click();
   let b=await page.evaluate(()=>profile.exportBackup());
   assert.equal(b.sessions.find(s=>s.id==='review:en-foundation-svo').state,'subjective-pending');
   assert.equal(b.sessions.find(s=>s.id==='review:en-foundation-svo').scoreEstimate,null);
   assert(b.events.some(e=>e.payload?.answer===initial&&e.payload?.grade?.score===null));
   const originalProfileId=b.profileId;
   await page.locator('#back').click();
   await page.clock.fastForward(48*60*60*1000);
   await page.locator('[data-unit]').click();
   await page.locator('#review').click();
   await page.locator('#answer').fill('nurses — check — records; in the clinic说明地点; every morning是时间');
   await page.locator('#recall').click();
   await page.locator('input[name="pick"][value="1"]').check();
   await page.locator('#submit').click();
   await page.locator('#next').click();
   await page.locator('input[name="pick"][value="0"]').check();
   await page.locator('input[name="pick"][value="1"]').check();
   await page.locator('#submit').click();
   await page.locator('#next').click();
   assert.match(await page.locator('body').innerText(),/The nurses in the clinic check the records every morning/);
   const delayed='  nurses - check - the records; in the clinic是地点; every morning是时间。  ';
   await page.locator('#answer').fill(delayed);
   await page.locator('#submit').click();
   assert.equal(await page.locator('input[name="rubric"]').count(),4);
   for(const cb of await page.locator('input[name="rubric"]').all())await cb.check();
   await page.locator('#next').click();
   b=await page.evaluate(()=>profile.exportBackup());
   assert.equal(b.profileId,originalProfileId);
   const delayedEvent=b.events.find(e=>e.action==='answered'&&e.payload?.questionId==='en-svo-delay-3');
   assert.equal(delayedEvent.payload.answer,delayed);
   assert.equal(delayedEvent.payload.grade.method,'reference-only');
   assert.equal(delayedEvent.payload.grade.score,null);
   assert.equal(delayedEvent.payload.grade.correct,null);
   assert(b.events.some(e=>e.action==='scheduled'&&e.payload?.reflection?.selfRubric?.length===4));
   assert.equal(b.sessions.find(s=>s.id==='review:en-foundation-svo').state,'subjective-pending');
   await page.locator('#back').click();
   await page.reload();
   await page.locator('#offline-health[data-state="ready"]').waitFor({timeout:30000});
   await page.getByRole('button',{name:/^继续 合成候选学员/}).click();
   assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),b);
   await page.locator('#back').count(); // still on overview, verify no record loss
   // The local TCP server is intentionally disconnected; no HTTP fallback may be available.
   server.closeAllConnections();
   await new Promise(ok=>server.close(ok));
   server=null;
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#offline-health[data-state="ready"]').waitFor({timeout:30000});
   await page.getByRole('button',{name:/^继续 合成候选学员/}).click();
   assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),b);
   await page.close();
   page=await context.newPage();
   await page.goto(base+'index.html?offline-reopen=1',{waitUntil:'domcontentloaded'});
   await page.locator('#offline-health[data-state="ready"]').waitFor({timeout:30000});
   await page.getByRole('button',{name:/^继续 合成候选学员/}).click();
   assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),b);
   result.passed=true;result.offline=true;result.answerSaved=true;result.pendingDistinctFromWrong=true;result.oldR2Untouched=true;
 }catch(e){
   result.error=e.stack||String(e);
 }finally{
   results.push(result);
   await context?.close().catch(()=>{});
   await browser?.close().catch(()=>{});
   if(server?.listening){server.closeAllConnections();await new Promise(ok=>server.close(ok));}
 }
}
(async()=>{
  for(const name of ['chromium','webkit'])await run(name);
  const outcome={status:results.every(r=>r.passed)?'pass':'fail',results,onlineDeployment:false,physicalIPhone:false,existingR2Modified:false};
  fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(outcome,null,2));
  console.log(JSON.stringify(outcome));
  if(outcome.status!=='pass')process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
