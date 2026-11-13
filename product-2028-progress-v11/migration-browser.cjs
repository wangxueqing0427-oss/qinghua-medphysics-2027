'use strict';
// Real UI clicks in synthetic iPhone Chromium and WebKit sessions, never a real profile.
// Explicit two-step V10 -> V11 opt-in and byte-stable lesson contract.
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const pw=require('../product-2028-ci/node_modules/playwright');
const source=require('../product-2028-stat-inference-52/build-receipt.json');
const target=require('./build-receipt.json');
const folders={source:path.join(__dirname,'../product-2028-stat-inference-52/.build'),target:path.join(__dirname,'.build')};
const allowed={source:new Set(source.files.map(x=>x.path)),target:new Set(target.files.map(x=>x.path))};
const mime=f=>f.endsWith('.js')?'application/javascript':f.endsWith('.json')?'application/json':f.endsWith('.css')?'text/css':f.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8';
const results=[];
async function check(browserName){
 let server,browser,context,page;
 const report={browser:browserName,passed:false,syntheticOnly:true,physicalIPhone:false,noAutomaticMigration:true};
 try{
  server=http.createServer((req,res)=>{
   const match=/^\/(source|target)\/([^/]+)?$/.exec(new URL(req.url,'http://localhost').pathname);
   if(!match||!allowed[match[1]].has(match[2]||'index.html')){res.writeHead(403);res.end('Forbidden');return;}
   const version=match[1],file=match[2]||'index.html';
   res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});
   res.end(fs.readFileSync(path.join(folders[version],file)));
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const root='http://127.0.0.1:'+server.address().port;
  browser=await pw[browserName].launch();
  context=await browser.newContext({...pw.devices['iPhone 13']});
  page=await context.newPage();
  const browserErrors=[];page.on('pageerror',e=>browserErrors.push(e.message));
  await page.goto(root+'/source/');
  assert.match(await page.locator('body').innerText(),/统计推断内测 V10/);
  await page.locator('#name').fill('模拟V10历史数据');
  await page.locator('#create').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const oldUnitId=await page.evaluate(async()=>{
   const u=pack.units.find(x=>x.subject==='353'&&!(x.prerequisites||[]).length&&x.basicQuestions[0]?.type==='single');
   if(!u)throw Error('No suitable standalone course');
   let s=await controller.load(u.id);
   s=await controller.learned(s);
   s=await controller.recall(s,'本机模拟闭卷回答：区分描述统计与推断统计并说明研究假设。');
   s=await controller.answer(s,controller.questions(s)[0].answer);
   if(s.feedback?.grade.correct!==true)throw Error('Learning evidence not generated');
   await overview();
   return u.id;
  });
  const oldBackup=await page.evaluate(()=>profile.exportBackup());
  assert.equal(oldBackup.profile.settings.candidateEdition,source.edition);
  assert(oldBackup.events.length>=3);
  assert(oldBackup.sessions.some(s=>s.id==='unit:'+oldUnitId));
  await page.goto(root+'/target/');
  assert.match(await page.locator('body').innerText(),/进度迁移内测 V11/);
  assert.equal(await page.locator('[data-profile]').count(),0,'V10 imported without consent');
  assert.equal(await page.evaluate(()=>ProfileRepository.DRAFT_DB),target.db);
  assert.equal(await page.locator('#confirm-migration').count(),0);
  // Corrupted answer must be rejected before any actionable preview is displayed.
  const poisoned=structuredClone(oldBackup);
  const answered=poisoned.events.find(x=>x.action==='answered');
  answered.payload.questionSnapshot.stem+='恶意修改';
  await page.locator('#migrate-v10').setInputFiles({name:'altered-v10.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(poisoned))});
  try{
    await page.waitForFunction(()=>document.querySelector('#message')?.textContent?.includes('跨版本迁移已安全停止')&&
      document.querySelector('#migrate-v10')&&!document.querySelector('#migrate-v10').disabled,
      null,{timeout:9000});
  }catch(e){
    const state=await page.evaluate(()=>({message:document.querySelector('#message')?.textContent,
      inputDisabled:document.querySelector('#migrate-v10')?.disabled,
      appError:document.querySelector('#app')?.textContent?.slice(0,500),
      cryptoAvailable:!!crypto?.subtle,migrationBridge:typeof MigrationBridge}));
    throw Error('Corrupted backup rejection UI diagnostic: '+JSON.stringify(state)+' / '+e.message);
  }
  assert.equal(await page.locator('#confirm-migration').count(),0,'Corrupt snapshot produced migration consent button');
  assert.equal(await page.evaluate(()=>repository.listProfiles().then(x=>x.length)),0);
  // Exact same exported JSON can be previewed without writing any target records.
  await page.locator('#migrate-v10').setInputFiles({name:'valid-v10.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(oldBackup))});
  await page.locator('#confirm-migration').waitFor({timeout:15000});
  assert.match(await page.locator('#migration-preview').innerText(),/已核验/);
  assert.match(await page.locator('#confirm-migration').innerText(),/我确认/);
  assert.equal(await page.evaluate(()=>repository.listProfiles().then(x=>x.length)),0,
    'Preview secretly created a profile before user clicked');
  await page.locator('#confirm-migration').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const newBackup=await page.evaluate(()=>profile.exportBackup());
  assert.notEqual(newBackup.profileId,oldBackup.profileId);
  assert.equal(newBackup.profile.restoredFrom,oldBackup.profileId);
  assert.equal(newBackup.profile.settings.candidateEdition,target.edition);
  assert.equal(newBackup.profile.settings.optInMigration.sourceEdition,source.edition);
  assert.equal(newBackup.profile.settings.optInMigration.oldSourcePreserved,true);
  for(const key of ['events','sessions']){
   const unscoped=items=>items.map(({profileId,...fields})=>fields).sort((a,b)=>a.id.localeCompare(b.id));
   assert.deepEqual(unscoped(newBackup[key]),unscoped(oldBackup[key]),'Evidence changed during copy: '+key);
  }
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),52);
  assert.equal(await page.evaluate(async id=>(await controller.load(id)).stage,oldUnitId),'feedback',
    'Frozen session did not resume');
  await page.reload();
  await page.locator('[data-profile="'+newBackup.profileId+'"]').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),newBackup,'V11 local record drifted on reload');
  await page.goto(root+'/source/');
  await page.locator('[data-profile="'+oldBackup.profileId+'"]').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),oldBackup,'Original V10 source was modified');
  assert.deepEqual(browserErrors,[],'Browser JS exceptions');
  Object.assign(report,{passed:true,sourceEventsUnchanged:oldBackup.events.length,
   targetEventsPreserved:newBackup.events.length,targetSessionsPreserved:newBackup.sessions.length,
   corruptArchiveRejected:true,manualConsentRequired:true,previewWritesNothing:true,
   existingProfilesUntouched:true,frozenSessionResumed:true,refreshPersistence:true});
 }catch(error){report.error=error.stack||String(error);}
 finally{
  results.push(report);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(ok=>server.close(ok));}
 }
}
(async()=>{
 for(const n of ['chromium','webkit'])await check(n);
 const receipt={passed:results.every(x=>x.passed),results,formalReleaseApproved:false,
  physicalIPhoneTest:false,expertApprovals:0,onlyV10ToV11:true};
 fs.writeFileSync(path.join(__dirname,'migration-browser-results.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify(receipt));
 if(!receipt.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
