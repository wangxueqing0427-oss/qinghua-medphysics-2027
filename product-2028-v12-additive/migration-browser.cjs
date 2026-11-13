'use strict';
// Real UI clicks in synthetic iPhone Chromium and WebKit sessions, never a real profile.
// Explicit two-step V11 -> V12 opt-in with ONE additional course and byte-stable lesson contract.
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const pw=require('../product-2028-ci/node_modules/playwright');
const source=require('../product-2028-progress-v11/build-receipt.json');
const target=require('./build-receipt.json');
const folders={source:path.join(__dirname,'../product-2028-progress-v11/.build'),target:path.join(__dirname,'.build')};
const allowed={source:new Set(source.files.map(x=>x.path)),target:new Set(target.files.map(x=>x.path))};
const mime=f=>f.endsWith('.js')?'application/javascript':f.endsWith('.json')?'application/json':f.endsWith('.css')?'text/css':f.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8';
const results=[];
async function check(browserName){
 let server,browser,context,page;
 const report={browser:browserName,passed:false,syntheticOnly:true,physicalIPhone:false,noAutomaticMigration:true,additiveLesson:true};
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
  assert.match(await page.locator('body').innerText(),/进度迁移内测 V11/);
  await page.locator('#name').fill('模拟V11历史数据');
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
  assert.match(await page.locator('body').innerText(),/增量迁移内测 V12/);
  assert.equal(await page.locator('[data-profile]').count(),0,'V11 imported without consent');
  assert.equal(await page.evaluate(()=>ProfileRepository.DRAFT_DB),target.db);
  assert.equal(await page.locator('#confirm-migration').count(),0);
  // Corrupted answer must be rejected before any actionable preview is displayed.
  const poisoned=structuredClone(oldBackup);
  const answered=poisoned.events.find(x=>x.action==='answered');
  answered.payload.questionSnapshot.stem+='恶意修改';
  await page.locator('#migrate-v11').setInputFiles({name:'altered-v11.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(poisoned))});
  try{
    await page.waitForFunction(()=>document.querySelector('#message')?.textContent?.includes('跨版本迁移已安全停止')&&
      document.querySelector('#migrate-v11')&&!document.querySelector('#migrate-v11').disabled,
      null,{timeout:9000});
  }catch(e){
    const state=await page.evaluate(()=>({message:document.querySelector('#message')?.textContent,
      inputDisabled:document.querySelector('#migrate-v11')?.disabled,
      appError:document.querySelector('#app')?.textContent?.slice(0,500),
      cryptoAvailable:!!crypto?.subtle,migrationBridge:typeof MigrationBridge}));
    throw Error('Corrupted backup rejection UI diagnostic: '+JSON.stringify(state)+' / '+e.message);
  }
  assert.equal(await page.locator('#confirm-migration').count(),0,'Corrupt snapshot produced migration consent button');
  assert.equal(await page.evaluate(()=>repository.listProfiles().then(x=>x.length)),0);
  // Exact same exported JSON can be previewed without writing any target records.
  await page.locator('#migrate-v11').setInputFiles({name:'valid-v11.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(oldBackup))});
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
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),53);
  assert.equal(await page.locator('[data-unit="353-t-tests-paired-independent-foundation"]').count(),1);
  assert.equal(await page.locator('[data-unit="353-t-tests-paired-independent-foundation"]').isDisabled(),true,
    'New course must still require old statistics prerequisite evidence');
  assert.equal(await page.evaluate(async id=>(await controller.load(id)).stage,oldUnitId),'feedback',
    'Frozen session did not resume');
  await page.reload();
  await page.locator('[data-profile="'+newBackup.profileId+'"]').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),newBackup,'V11 local record drifted on reload');
  await page.goto(root+'/source/');
  await page.locator('[data-profile="'+oldBackup.profileId+'"]').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),oldBackup,'Original V11 source was modified');
  // Prove the new course remains locked until prerequisite recall AND objective evidence really exist.
  await page.goto(root+'/target/');
  await page.locator('[data-profile="'+newBackup.profileId+'"]').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const prerequisites=await page.evaluate(async()=>{
    const target=pack.units.find(u=>u.id==='353-t-tests-paired-independent-foundation');
    const passed=new Set(),completed=[];
    async function earn(id){
      if(passed.has(id))return;
      const unit=pack.units.find(u=>u.id===id);
      if(!unit)throw Error('Prerequisite absent: '+id);
      for(const preceding of unit.prerequisites||[])await earn(preceding);
      const before=await profile.exportBackup();
      if(!LearningController.prerequisiteStatus(unit,before).ready)
        throw Error('Prerequisite chain cannot unlock: '+id);
      let st=await controller.load(id);
      if(st.stage==='learn'){
        st=await controller.learned(st);
        st=await controller.recall(st,'自动验收的虚拟闭卷回答：解释假设条件和数据结构。');
        const q=controller.questions(st)[0];
        if(q.type!=='single')throw Error('Expected first single-choice question: '+id);
        st=await controller.answer(st,q.answer);
        if(st.feedback?.grade?.correct!==true)throw Error('Objective prerequisite evidence failed: '+id);
        completed.push(id);
      }else{
        const evidence=await profile.exportBackup();
        const okay=evidence.events.some(e=>e.unitId===id&&e.action==='recalled')&&
          evidence.events.some(e=>e.unitId===id&&e.action==='answered'&&e.payload?.grade?.correct===true);
        if(!okay)throw Error('Incomplete previously saved prerequisite evidence: '+id);
      }
      passed.add(id);
    }
    for(const id of target.prerequisites||[])await earn(id);
    await overview();
    return completed;
  });
  assert(prerequisites.length>=1,'Prerequisite chain must have real simulated learning events');
  const targetButton=page.locator('[data-unit="353-t-tests-paired-independent-foundation"]');
  assert.equal(await targetButton.isEnabled(),true,
    'New t-test lesson must unlock when required objective and closed-book evidence is present');
  await targetButton.click();
  assert.match(await page.locator('#app').innerText(),/单样本|配对|t检验/);
  const newEvidence=await page.evaluate(()=>profile.exportBackup());
  assert(newEvidence.events.length>newBackup.events.length,'Prior learning events were not added to the migrated new profile');
  assert.deepEqual(browserErrors,[],'Browser JS exceptions');
  Object.assign(report,{passed:true,sourceEventsUnchanged:oldBackup.events.length,
   targetEventsPreserved:newBackup.events.length,targetSessionsPreserved:newBackup.sessions.length,
   corruptArchiveRejected:true,manualConsentRequired:true,previewWritesNothing:true,
   existingProfilesUntouched:true,frozenSessionResumed:true,refreshPersistence:true,newCourseUnlockedOnlyAfterEvidence:true});
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
  physicalIPhoneTest:false,expertApprovals:0,onlyV11ToV12:true};
 fs.writeFileSync(path.join(__dirname,'migration-browser-results.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify(receipt));
 if(!receipt.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
