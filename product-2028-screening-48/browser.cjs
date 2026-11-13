'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const pw=require('../product-2028-ci/node_modules/playwright');
const receipt=require('./build-receipt.json');
const dir=path.join(__dirname,'.build'),allow=new Set(receipt.files.map(x=>x.path));
const mime=n=>n.endsWith('.js')?'application/javascript':n.endsWith('.json')?'application/json':n.endsWith('.css')?'text/css':n.endsWith('.svg')?'image/svg+xml':'text/html;charset=utf-8';
const results=[];
async function testBrowser(which){
 let server,browser,context,page;
 const row={browser:which,pass:false,syntheticOnly:true,realIPhone:false,formalRelease:false};
 try{
  server=http.createServer((req,res)=>{
   const file=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   if(!allow.has(file)){res.writeHead(403);res.end('Forbidden');return;}
   res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store'});
   res.end(fs.readFileSync(path.join(dir,file)));
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port+'/';
  browser=await pw[which].launch();
  context=await browser.newContext({...pw.devices['iPhone 13']});
  page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  assert.match(await page.locator('body').innerText(),/筛检补课内测 V6/);
  await page.locator('#name').fill('V6筛检课虚拟验收');
  await page.locator('#create').click();
  await page.locator('.mobile-next-task').waitFor({timeout:15000});
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),48);
  assert.equal(await page.evaluate(()=>ProfileRepository.DRAFT_DB),'qh2028_screening_48_v6_local');
  const pack=await (await page.request.get(base+'representative-courses.json')).json();
  assert.equal(pack.units.length,48);
  assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),536);
  assert.equal(pack.units.filter(u=>u.subject==='en').length,15);
  assert.equal(pack.units.filter(u=>u.subject==='pol').length,14);
  assert.equal(pack.units.filter(u=>u.subject==='353').length,19);
  assert(pack.units.every(u=>u.reviewRecord?.expertApproved!==true));
  const newUnit=pack.units.find(u=>u.id==='353-screening-test-foundation');
  assert(newUnit&&newUnit.basicQuestions.length===4&&newUnit.applicationQuestions.length===4&&newUnit.delayedQuestions.length===4);
  assert(newUnit.explanation.includes('Se=TP/(TP+FN)'));
  await page.locator('#course-search').fill('筛检与诊断试验');
  await page.waitForFunction(()=>document.querySelector('#mobile-course-count')?.textContent?.includes('1 / 1'));
  const button=page.locator('#course-catalog [data-unit="353-screening-test-foundation"]');
  assert.equal(await button.isDisabled(),true,'Unfinished prerequisites must block a new learner');
  // Use the real controller to create valid learning evidence in this SYNTHETIC profile.
  // No production prerequisite is bypassed and no genuine learner data is imported.
  const completed=await page.evaluate(async()=>{
    const done=new Set(),ordered=[];
    async function earn(id){
      if(done.has(id))return;
      const unit=pack.units.find(u=>u.id===id);
      if(!unit)throw Error('Synthetic prerequisite unit not found: '+id);
      for(const before of unit.prerequisites||[])await earn(before);
      let state=await controller.load(id);
      if(state.stage!=='learn')throw Error('Unexpected existing synthetic unit session');
      state=await controller.learned(state);
      state=await controller.recall(state,'自动验收的独立闭卷回答：定义、条件、举例和局限。');
      const q=controller.questions(state)[0];
      if(q.type!=='single')throw Error('Expected first prerequisite question to be single');
      state=await controller.answer(state,q.answer);
      if(state.feedback.grade.correct!==true)throw Error('Synthetic objective evidence not correct');
      done.add(id);ordered.push(id);
    }
    const target=pack.units.find(u=>u.id==='353-screening-test-foundation');
    for(const id of target.prerequisites||[])await earn(id);
    await overview();
    return ordered;
  });
  assert(completed.length>=3,'Not all prerequisite lessons were really completed');
  await page.locator('#course-search').fill('筛检与诊断试验');
  await page.waitForFunction(()=>document.querySelector('#mobile-course-count')?.textContent?.includes('1 / 1'));
  assert.equal(await button.isEnabled(),true,'Valid synthetic prerequisite evidence should unlock the new course');
  await button.click();
  await page.locator('.mobile-reading').waitFor({timeout:15000});
  assert.equal(await page.locator('.mobile-reading').textContent(),newUnit.explanation);
  assert.match(await page.locator('#app').innerText(),/假阳性/);
  const before=await page.evaluate(()=>profile.exportBackup());
  await page.locator('#learned').click();
  await page.waitForFunction(()=>document.querySelector('.current-stage')?.textContent==='现在：闭卷');
  await page.locator('#answer').fill('筛检阳性不是确诊，按参考标准写出TP、FP、FN、TN，关注进一步评价。');
  await page.locator('#recall').click();
  await page.locator('.practice-progress').waitFor({timeout:12000});
  const saved=await page.evaluate(()=>profile.exportBackup());
  assert(saved.events.length>before.events.length);
  assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'0');
  await page.locator('#back').click();
  await page.locator('.mobile-next-task').waitFor({timeout:12000});
  await page.reload();
  await page.getByRole('button',{name:/^继续 V6筛检课虚拟验收/}).click();
  await page.locator('.mobile-next-task').waitFor({timeout:12000});
  assert.deepEqual(await page.evaluate(()=>profile.exportBackup()),saved,'Reload damaged learner backup');
  await page.locator('#exam-subject').selectOption('353');
  await page.waitForFunction(()=>document.querySelector('#exam-launch')?.dataset.ready==='true',{timeout:12000});
  await page.locator('#exam-launch').click();
  await page.locator('.exam-screen-head').waitFor({timeout:12000});
  assert.match(await page.locator('.exam-screen-head h1').innerText(),/第 1 \/ 8 题/);
  assert(!/正确答案|参考答案/.test(await page.locator('.exam-screen').innerText()));
  const afterExam=await page.evaluate(()=>profile.exportBackup());
  assert.equal(afterExam.profile.settings.diagnosticExamV5.current.questions.length,8);
  assert.equal(afterExam.profile.settings.diagnosticExamV5.current.subject,'353');
  assert(afterExam.profile.settings.diagnosticExamV5.current.questions.every(q=>pack.units.some(u=>u.id===q.unitId)));
  assert.deepEqual(errors,[],'Unexpected client exceptions');
  row.pass=true;
  Object.assign(row,{courses:48,questions:536,newCourseVisible:true,originalLearningUntouched:true,lessonExactText:true,
    localLearningResume:true,diagnostic353:true,newDataNamespace:true});
 }catch(error){row.error=error.stack||String(error);}
 finally{
  results.push(row);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(ok=>server.close(ok));}
 }
}
(async()=>{
 for(const n of ['chromium','webkit'])await testBrowser(n);
 const o={pass:results.every(x=>x.pass),results,physicalIPhoneTest:false,expertApprovals:0,formalRelease:false};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(o,null,2));
 console.log(JSON.stringify(o));
 if(!o.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
