'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const pw=require('../product-2028-ci/node_modules/playwright');
const receipt=require('./build-receipt.json');
const dir=path.join(__dirname,'.build'),files=new Set(receipt.files.map(f=>f.path));
const results=[];
const mime=s=>s.endsWith('.js')?'application/javascript':s.endsWith('.json')?'application/json':s.endsWith('.css')?'text/css':s.endsWith('.svg')?'image/svg+xml':'text/html;charset=utf-8';
async function one(browserName){
 let server,browser,context,page;
 const row={browser:browserName,pass:false,syntheticOnly:true,physicalIPhone:false,remoteDeployment:false};
 try{
  server=http.createServer((req,res)=>{
   const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   if(!files.has(name)){res.writeHead(403);res.end('Forbidden');return;}
   res.writeHead(200,{'Content-Type':mime(name),'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
   res.end(fs.readFileSync(path.join(dir,name)));
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port+'/';
  browser=await pw[browserName].launch();
  context=await browser.newContext({...pw.devices['iPhone 13']});
  page=await context.newPage();
  const stage=async expected=>page.waitForFunction(v=>document.querySelector('.current-stage')?.textContent?.trim()==='现在：'+v,expected,{timeout:15000});
  const next=async expected=>{await page.locator('#next').click();await stage(expected);};
  const submit=async expected=>{await page.locator('#submit').click();await stage('反馈');assert.match(await page.locator('#app').innerText(),expected);};
  const pick=async (values,pattern)=>{
   for(const n of values)await page.locator('input[name="pick"][value="'+n+'"]').check();
   await submit(pattern);
  };
  await page.goto(base);
  await page.locator('#name').waitFor({timeout:15000});
  await page.clock.install({time:new Date('2026-11-12T00:00:00.000Z')});
  assert.match(await page.locator('body').innerText(),/SET47-SVO6/);
  await page.locator('#name').fill('47课合成验收学员');
  await page.locator('#create').click();
  await page.locator('[data-unit]').first().waitFor({timeout:15000});
  assert.equal(await page.locator('[data-unit]').count(),47);
  assert.equal(await page.locator('[data-subject="en"]').count(),15);
  assert.equal(await page.locator('[data-subject="pol"]').count(),14);
  assert.equal(await page.locator('[data-subject="353"]').count(),18);
  await page.locator('#subject-filter').selectOption('353');
  assert.equal(await page.locator('[data-subject="en"]:visible').count(),0);
  assert.equal(await page.locator('[data-subject="353"]:visible').count(),18);
  await page.locator('#subject-filter').selectOption('all');
  const svo=page.locator('[data-unit="en-foundation-svo"]');
  const sva=page.locator('[data-unit="en-subject-verb-agreement"]');
  assert.equal(await sva.isDisabled(),true,'SVA locked at start');
  await svo.click();await stage('学习');await page.locator('#learned').click();await stage('闭卷');
  await page.locator('#answer').fill('S主语、V动作、O宾语；Birds fly没有宾语');
  await page.locator('#recall').click();await stage('练题');
  await pick([1],/答对/);await next('练题');
  await pick([2],/答对/);await next('练题');
  await page.locator('#answer').fill('children water flowers; garden place; morning time');
  await submit(/主观题需按要点核对/);await next('复习');
  await page.locator('#back').click();
  assert.equal(await sva.isDisabled(),true,'cannot unlock after only initial SVO round');
  await page.clock.fastForward(48*60*60*1000);
  await svo.click();await stage('复习');await page.locator('#review').click();await stage('闭卷');
  await page.locator('#answer').fill('新句先看主语、动词和宾语');
  await page.locator('#recall').click();await stage('练题');
  await pick([1],/答对/);await next('练题');
  await pick([0,1],/答对/);await next('练题');
  assert.match(await page.locator('#app').innerText(),/The nurses in the clinic check the records/);
  await page.locator('#answer').fill('nurses check the records; clinic是地点，every morning是时间');
  await submit(/主观题需按要点核对/);
  assert.equal(await page.locator('input[name="rubric"]').count(),4);
  await next('复习');
  await page.locator('#back').click();
  assert.equal(await sva.isEnabled(),true,'SVA becomes accessible only after full delayed round');
  await sva.click();await stage('学习');
  assert.match(await page.locator('#app').innerText(),/A pupil opens the gate/);
  await page.locator('#learned').click();await stage('闭卷');
  await page.locator('#answer').fill('a pupil opens, two pupils open, I am, you are');
  await page.locator('#recall').click();await stage('练题');
  await pick([1],/答对/);await next('练题');
  const before=await page.evaluate(()=>profile.exportBackup());
  assert.equal(before.profile.settings.candidateEdition,'qh2028-set47-svo6-research-1');
  assert(before.events.some(e=>e.unitId==='en-subject-verb-agreement'&&e.action==='answered'));
  await page.reload();await page.getByRole('button',{name:/^继续 47课合成验收学员/}).click();
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),before);
  row.pass=true;row.strictGate=true;row.subjectFilters=true;row.profilePreservedOnReload=true;
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
 const report={results,pass:results.every(x=>x.pass),expertApproved:0,physicalIPhone:false,remoteDeployment:false};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
 if(!report.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
