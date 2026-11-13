'use strict';
// Non-destructive cross-version smoke test: V9 LOCAL backup -> V10 NEW local profile.
// No production learner data, no external APIs, no automatic migration, no overwrite.
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const pw=require('../product-2028-ci/node_modules/playwright');
const past=require('../product-2028-radiotherapy-51/build-receipt.json');
const latest=require('./build-receipt.json');
const dirs={previous:path.join(__dirname,'../product-2028-radiotherapy-51/.build'),next:path.join(__dirname,'.build')};
const allowed={previous:new Set(past.files.map(x=>x.path)),next:new Set(latest.files.map(x=>x.path))};
const mime=n=>n.endsWith('.js')?'application/javascript':n.endsWith('.json')?'application/json':n.endsWith('.css')?'text/css':n.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8';
const output=[];
async function run(which){
 let server,browser,context,page;
 const result={browser:which,pass:false,simulationOnly:true,realIPhone:false,automatedRealProfileImport:false};
 try{
  server=http.createServer((req,res)=>{
   const pathname=new URL(req.url,'http://localhost').pathname;
   const found=/^\/(previous|next)\/([^/]+)?$/.exec(pathname);
   if(!found){res.writeHead(403);res.end('Forbidden');return;}
   const edition=found[1],file=found[2]||'index.html';
   if(!allowed[edition].has(file)){res.writeHead(403);res.end('Forbidden');return;}
   res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});
   res.end(fs.readFileSync(path.join(dirs[edition],file)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  browser=await pw[which].launch();
  context=await browser.newContext({...pw.devices['iPhone 13']});
  page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/previous/');
  assert.match(await page.locator('body').innerText(),/放疗物理内测 V9/);
  await page.locator('#name').fill('V9转V10虚拟验收');
  await page.locator('#create').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const completedId=await page.evaluate(async()=>{
   const unit=pack.units.find(u=>u.subject==='353'&&!(u.prerequisites||[]).length&&u.basicQuestions[0]?.type==='single');
   if(!unit)throw Error('No standalone fixture unit for cross-version migration');
   let state=await controller.load(unit.id);
   state=await controller.learned(state);
   state=await controller.recall(state,'跨版本虚拟测试：统计数据的来源与解释边界是研究设计的重要部分。');
   const q=controller.questions(state)[0];
   state=await controller.answer(state,q.answer);
   if(state.feedback?.grade?.correct!==true)throw Error('Fixture course evidence failed');
   await overview();
   return unit.id;
  });
  const before=await page.evaluate(()=>profile.exportBackup());
  assert(before.events.length>=3,'No actual previous-version learning evidence');
  assert(before.sessions.some(s=>s.id==='unit:'+completedId));
  assert.equal(before.profile.settings.displayName,'V9转V10虚拟验收');
  await page.goto(origin+'/next/');
  assert.match(await page.locator('body').innerText(),/统计推断内测 V10/);
  assert.equal(await page.locator('[data-profile]').count(),0,'V10 wrongly auto-imported earlier local records');
  const bad={...before,events:before.events.map((e,i)=>i===0?{...e,profileId:'other-person'}:e)};
  await page.locator('#restore').setInputFiles({name:'corrupt-v9-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
  try{
    await page.waitForFunction(()=>document.querySelector('#message')?.textContent?.startsWith('尚未完成保存或读取'),null,{timeout:8000});
    await page.waitForFunction(()=>document.querySelector('#restore')&&!document.querySelector('#restore').disabled,null,{timeout:8000});
  }catch(e){
    throw Error('Mixed profile rejection UI state: '+JSON.stringify(await page.locator('#message').innerText())+
      ', restoreDisabled='+await page.locator('#restore').isDisabled()+', '+e.message);
  }
  assert.match(await page.locator('#message').innerText(),/Mixed-profile backup rejected/);
  assert.equal(await page.evaluate(()=>repository.listProfiles().then(x=>x.length)),0,'Invalid profile must not be created');
  await page.locator('#restore').setInputFiles({name:'safe-v9-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(before))});
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const after=await page.evaluate(()=>profile.exportBackup());
  assert.notEqual(after.profileId,before.profileId,'Recovery must create a NEW profile rather than overwrite old');
  assert.equal(after.profile.restoredFrom,before.profileId);
  assert.equal(after.profile.settings.displayName,before.profile.settings.displayName);
  assert.equal(after.events.length,before.events.length);
  assert.equal(after.sessions.length,before.sessions.length);
  for(const key of ['events','sessions']){
   const toOriginal=rows=>rows.map(({profileId,...row})=>row).sort((a,b)=>a.id.localeCompare(b.id));
   assert.deepEqual(toOriginal(after[key]),toOriginal(before[key]),'Previous learner history changed: '+key);
  }
  assert(after.sessions.some(s=>s.id==='unit:'+completedId),'Existing learning progress lost after migration');
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),52);
  assert.equal(await page.locator('[data-unit="353-inference-ci-hypothesis-foundation"]').count(),1);
  assert.equal(await page.locator('[data-unit="353-inference-ci-hypothesis-foundation"]').isDisabled(),true,
    'Fresh prerequisite-protected course must not be unlocked by unrelated old lessons');
  await page.reload();
  await page.getByRole('button',{name:/^继续 V9转V10虚拟验收/}).click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),after,'Reload changed imported learner evidence');
  assert.deepEqual(errors,[],'Browser Javascript errors');
  Object.assign(result,{pass:true,previousCourses:51,newCourses:52,eventsPreserved:after.events.length,
    sessionsPreserved:after.sessions.length,oldLessonEvidencePreserved:true,
    restoreCreatesNewProfile:true,malformedArchiveRejected:true,sourceDataUntouched:true,
    originalVersionNotAutoImported:true,unrelatedPrerequisiteStillBlocked:true});
 }catch(error){result.error=error.stack||String(error);}
 finally{
  output.push(result);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
 }
}
(async()=>{
 for(const name of ['chromium','webkit'])await run(name);
 const receipt={passed:output.every(x=>x.pass),results:output,realIPhoneApproved:false,automaticMigration:false,
  formalReleaseApproved:false,independentExpertApprovals:0};
 fs.writeFileSync(path.join(__dirname,'migration-browser-results.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify(receipt));
 if(!receipt.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
