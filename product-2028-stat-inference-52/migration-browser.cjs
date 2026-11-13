'use strict';
// Fail-closed, end-to-end local data safety test.
// V9 -> V10 import is deliberately REJECTED; V10 -> V10 import as NEW profile is allowed.
// No user data, no automatic import, no overwrites, no production changes.
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const pw=require('../product-2028-ci/node_modules/playwright');
const receipts={
 previous:require('../product-2028-radiotherapy-51/build-receipt.json'),
 next:require('./build-receipt.json')
};
const folders={
 previous:path.join(__dirname,'../product-2028-radiotherapy-51/.build'),
 next:path.join(__dirname,'.build')
};
const files=Object.fromEntries(Object.entries(receipts).map(([k,v])=>[k,new Set(v.files.map(x=>x.path))]));
const mime=s=>s.endsWith('.js')?'application/javascript':s.endsWith('.json')?'application/json':s.endsWith('.css')?'text/css':s.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8';
const rows=[];
async function run(browserName){
 let server,browser,context,page;
 const row={browser:browserName,pass:false,syntheticOnly:true,realIPhone:false,automaticMigration:false};
 try{
  server=http.createServer((req,res)=>{
   const pathname=new URL(req.url,'http://localhost').pathname;
   const match=/^\/(previous|next)\/([^/]+)?$/.exec(pathname);
   if(!match){res.writeHead(403);res.end('Forbidden');return;}
   const version=match[1],filename=match[2]||'index.html';
   if(!files[version].has(filename)){res.writeHead(403);res.end('Forbidden');return;}
   res.writeHead(200,{'Content-Type':mime(filename),'Cache-Control':'no-store'});
   res.end(fs.readFileSync(path.join(folders[version],filename)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  browser=await pw[browserName].launch();
  context=await browser.newContext({...pw.devices['iPhone 13']});
  page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function syntheticEvidence(){
   return page.evaluate(async()=>{
    const unit=pack.units.find(u=>u.subject==='353'&&!(u.prerequisites||[]).length&&u.basicQuestions[0]?.type==='single');
    if(!unit)throw Error('No independent sample lesson available');
    let state=await controller.load(unit.id);
    state=await controller.learned(state);
    state=await controller.recall(state,'仅用于虚拟迁移验收：应检查定义、假设条件和来源。');
    const q=controller.questions(state)[0];
    state=await controller.answer(state,q.answer);
    if(state.feedback?.grade.correct!==true)throw Error('Synthetic practice did not record evidence');
    await overview();
    return unit.id;
   });
  }
  const withoutScope=rows=>rows.map(({profileId,...fields})=>fields).sort((a,b)=>a.id.localeCompare(b.id));
  const waitRejected=async(pattern)=>{
   await page.waitForFunction(
    s=>(document.querySelector('#message')?.textContent||'').includes(s)&&
       !!document.querySelector('#restore')&&!document.querySelector('#restore').disabled,
    pattern,{timeout:15000});
   assert.match(await page.locator('#message').innerText(),new RegExp(pattern));
  };
  await page.goto(origin+'/previous/');
  assert.match(await page.locator('body').innerText(),/放疗物理内测 V9/);
  await page.locator('#name').fill('V9历史虚拟档案');
  await page.locator('#create').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const oldUnit=await syntheticEvidence();
  const oldBackup=await page.evaluate(()=>profile.exportBackup());
  assert(oldBackup.events.length>=3);
  assert(oldBackup.sessions.some(s=>s.id==='unit:'+oldUnit));
  assert(oldBackup.profile.settings.candidateEdition==='qh2028-radiotherapy-51-v9');
  await page.goto(origin+'/next/');
  assert.match(await page.locator('body').innerText(),/统计推断内测 V10/);
  assert.equal(await page.locator('[data-profile]').count(),0,'No auto-transfer across separate local stores');
  await page.locator('#restore').setInputFiles({name:'old-v9-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(oldBackup))});
  await waitRejected('只能恢复本隔离候选的备份');
  assert.equal(await page.evaluate(()=>repository.listProfiles().then(a=>a.length)),0,
    'Rejected V9 backup unexpectedly created a V10 user');
  await page.locator('#name').fill('V10同版本备份验收');
  await page.locator('#create').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const newUnit=await syntheticEvidence();
  const newBackup=await page.evaluate(()=>profile.exportBackup());
  assert(newBackup.events.length>=3);
  assert(newBackup.sessions.some(s=>s.id==='unit:'+newUnit));
  assert(newBackup.profile.settings.candidateEdition==='qh2028-stat-inference-52-v10');
  await page.locator('#logout').click();
  await page.locator('#restore').waitFor({timeout:15000});
  const badBackup={...newBackup,events:newBackup.events.map((e,i)=>i===0?{...e,profileId:'other-person'}:e)};
  await page.locator('#restore').setInputFiles({name:'invalid-v10-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(badBackup))});
  await waitRejected('Mixed-profile backup rejected');
  assert.equal(await page.evaluate(()=>repository.listProfiles().then(a=>a.length)),1,
   'Invalid backup changed the existing V10 profile list');
  await page.locator('#restore').setInputFiles({name:'valid-v10-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(newBackup))});
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  const restored=await page.evaluate(()=>profile.exportBackup());
  assert.notEqual(restored.profileId,newBackup.profileId,'Must create a new profile for same-edition restore');
  assert.equal(restored.profile.restoredFrom,newBackup.profileId);
  assert.equal(restored.profile.settings.displayName,newBackup.profile.settings.displayName);
  for(const key of ['events','sessions'])
   assert.deepEqual(withoutScope(restored[key]),withoutScope(newBackup[key]),'Saved learning history drift: '+key);
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),52);
  assert.equal(await page.locator('[data-unit="353-inference-ci-hypothesis-foundation"]').count(),1);
  assert.equal(await page.locator('[data-unit="353-inference-ci-hypothesis-foundation"]').isDisabled(),true,
   'Unmet prerequisites must remain locked in restored V10 profile');
  await page.reload();
  await page.locator('[data-profile="'+restored.profileId+'"]').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),restored,'Reload modified restored V10 evidence');
  await page.goto(origin+'/previous/');
  await page.getByRole('button',{name:/^继续 V9历史虚拟档案/}).click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),oldBackup,
   'V9 source learning evidence changed as a result of working in V10');
  assert.deepEqual(errors,[]);
  Object.assign(row,{
   pass:true,oldV9BackupRejected:true,noAutomaticMigration:true,
   malformedV10BackupRejected:true,sameEditionRestoredToNewProfile:true,
   eventsPreserved:restored.events.length,sessionsPreserved:restored.sessions.length,
   oldV9ProfileUnaffected:true,prerequisiteGatePreserved:true
  });
 }catch(error){row.error=error.stack||String(error);}
 finally{
  rows.push(row);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
 }
}
(async()=>{
 for(const name of ['chromium','webkit'])await run(name);
 const report={pass:rows.every(x=>x.pass),results:rows,formalReleaseApproved:false,realIPhoneApproved:false,
  crossVersionImportCompatible:false,expertApprovals:0};
 fs.writeFileSync(path.join(__dirname,'migration-browser-results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
 if(!report.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
