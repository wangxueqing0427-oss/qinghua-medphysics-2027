'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const pw=require('../product-2028-ci/node_modules/playwright');
const receipt=require('./build-receipt.json');
const dir=path.join(__dirname,'.build'),files=new Set(receipt.files.map(f=>f.path));
const results=[];
const mime=s=>s.endsWith('.js')?'application/javascript':s.endsWith('.json')?'application/json':s.endsWith('.css')?'text/css':s.endsWith('.svg')?'image/svg+xml':'text/html;charset=utf-8';
async function one(browserName){
 let server,browser,context,page;
 const row={browser:browserName,pass:false,offline:false,physicalIPhone:false,productionDeployment:false};
 try{
  server=http.createServer((req,res)=>{
   const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   if(!files.has(name)){res.writeHead(404);res.end('Not found');return;}
   res.writeHead(200,{'Content-Type':mime(name),'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
   res.end(fs.readFileSync(path.join(dir,name)));
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port+'/';
  browser=await pw[browserName].launch();
  context=await browser.newContext({...pw.devices['iPhone 13']});
  page=await context.newPage();
  const stage=async expected=>page.waitForFunction(v=>document.querySelector('.current-stage')?.textContent?.trim()==='现在：'+v,expected,{timeout:15000});
  const next=async expected=>{await page.locator('#next').click();await stage(expected);};
  const submit=async expected=>{await page.locator('#submit').click();await stage('反馈');assert.match(await page.locator('body').innerText(),expected);};
  const pick=async (values,pattern)=>{
   for(const n of values)await page.locator('input[name="pick"][value="'+n+'"]').check();
   await submit(pattern);
  };
  await page.goto(base);
  await page.locator('#offline-health[data-state="ready"]').waitFor({timeout:30000});
  await page.clock.install({time:new Date('2026-11-11T00:00:00.000Z')});
  assert.match(await page.locator('body').innerText(),/两课内部预检/);
  await page.locator('#name').fill('合成主谓一致验收');
  await page.locator('#create').click();
  const svo=page.locator('[data-unit="en-foundation-svo"]');
  const sva=page.locator('[data-unit="en-subject-verb-agreement"]');
  assert.equal(await sva.isDisabled(),true,'SVA must be locked before SVO');
  await svo.click();await stage('学习');await page.locator('#learned').click();await stage('闭卷');
  await page.locator('#answer').fill('S主语 V谓语 O直接宾语，Birds fly不带直接宾语');
  await page.locator('#recall').click();await stage('练题');
  await pick([1],/答对/);await next('练题');
  await pick([2],/答对/);await next('练题');
  await page.locator('#answer').fill('children water flowers; in the garden地点; every morning时间');
  await submit(/主观题需按要点核对/);await next('复习');
  await page.locator('#back').click();
  await sva.waitFor();
  assert.equal(await sva.isDisabled(),true,'One initial cycle cannot unlock SVA');
  assert.equal(await page.evaluate(async()=>LearningController.prerequisiteStatus(pack.units[1],await profile.exportBackup()).ready),false);
  await page.clock.fastForward(48*60*60*1000);
  await svo.click();await stage('复习');await page.locator('#review').click();await stage('闭卷');
  await page.locator('#answer').fill('新句先找动作、主语与宾语，再分清介词短语');
  await page.locator('#recall').click();await stage('练题');
  await pick([1],/答对/);await next('练题');
  await pick([0,1],/答对/);await next('练题');
  await page.locator('#answer').fill('nurses—check—the records; in the clinic地点; every morning频率');
  await submit(/主观题需按要点核对/);
  assert.equal(await page.locator('input[name="rubric"]').count(),4);
  await next('复习');
  await page.locator('#back').click();
  await sva.waitFor();
  assert.equal(await sva.isEnabled(),true,'SVA unlocked only after finished delayed review');
  const gate=await page.evaluate(async()=>LearningController.prerequisiteStatus(pack.units[1],await profile.exportBackup()));
  assert.equal(gate.ready,true);assert.equal(gate.mastered,false);
  await sva.click();await stage('学习');
  assert.match(await page.locator('body').innerText(),/A pupil opens the gate/);
  await page.locator('#learned').click();await stage('闭卷');
  await page.locator('#answer').fill('I am, you are, one pupil opens, two pupils open; labels主语决定are');
  await page.locator('#recall').click();await stage('练题');
  await pick([1],/答对/);await next('练题');
  const saved=await page.evaluate(()=>profile.exportBackup());
  assert(saved.events.some(e=>e.unitId==='en-subject-verb-agreement'&&e.action==='answered'));
  await page.reload();
  await page.locator('#offline-health[data-state="ready"]').waitFor({timeout:30000});
  await page.getByRole('button',{name:/^继续 合成主谓一致验收/}).click();
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),saved);
  // Check the new 11th asset and both-course data survive an actual TCP outage.
  server.closeAllConnections();await new Promise(ok=>server.close(ok));server=null;
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#offline-health[data-state="ready"]').waitFor({timeout:30000});
  await page.getByRole('button',{name:/^继续 合成主谓一致验收/}).click();
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),saved);
  assert.equal(await page.evaluate(()=>typeof SvaPrerequisite),'object');
  row.pass=true;row.offline=true;row.strictUnlock=true;row.svaLessonStarted=true;
 }catch(e){row.error=e.stack||String(e);}
 finally{
  results.push(row);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(ok=>server.close(ok));}
 }
}
(async()=>{
 for(const browserName of ['chromium','webkit'])await one(browserName);
 const out={results,pass:results.every(x=>x.pass),notAnExpertReview:true,physicalIPhone:false,deployed:false,activeSVOChanged:false};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(out,null,2));
 console.log(JSON.stringify(out));
 if(!out.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
