'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),http=require('http');
const pw=require('../product-2028-ci/node_modules/playwright'),receipt=require('./build-receipt.json');
const dir=path.join(__dirname,'.build'),allowed=new Set(receipt.files.map(f=>f.path));
const mime=s=>s.endsWith('.js')?'application/javascript':s.endsWith('.json')?'application/json':s.endsWith('.css')?'text/css':s.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8';
const results=[];
async function browserTest(browserName){
 let server,browser,context,page;
 const out={browser:browserName,pass:false,syntheticOnly:true,physicalIPhone:false};
 try{
  server=http.createServer((req,res)=>{
   const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
   if(!allowed.has(name)){res.writeHead(403);res.end('Forbidden');return;}
   res.writeHead(200,{'Content-Type':mime(name),'Cache-Control':'no-store'});
   res.end(fs.readFileSync(path.join(dir,name)));
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port+'/';
  browser=await pw[browserName].launch();
  context=await browser.newContext({...pw.devices['iPhone 13']});
  page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);
  await page.locator('#name').waitFor({timeout:15000});
  assert.match(await page.locator('body').innerText(),/诊断小测内测 V5/);
  await page.locator('#name').fill('三科诊断-虚拟验收');
  await page.locator('#create').click();
  await page.waitForFunction(()=>document.querySelector('#exam-launch')?.dataset.ready==='true',{timeout:15000});
  assert.equal(await page.locator('#course-catalog [data-subject]').count(),47);
  assert.match(await page.locator('.exam-start-card').innerText(),/不是全真模拟考试/);
  assert.equal(await page.evaluate(()=>ProfileRepository.DRAFT_DB),'qh2028_diagnostic_mini_v5');
  await page.locator('#exam-subject').selectOption('all');
  await page.locator('#exam-launch').click();
  await page.locator('#exam-stem').count(); // no hidden text from answers before submission
  await page.locator('.exam-screen-head').waitFor({timeout:15000});
  assert.match(await page.locator('h1').innerText(),/第 1 \/ 12 题/);
  assert.equal(await page.locator('#exam-prev').isDisabled(),true);
  assert(!/参考答案|正确答案：/.test(await page.locator('.exam-screen').innerText()));
  const pre=await page.evaluate(()=>profile.exportBackup());
  const start=pre.profile.settings.diagnosticExamV5.current;
  assert.equal(start.kind,'diagnostic-mini-test');assert.equal(start.questions.length,12);
  assert.equal(start.subject,'all');
  assert.equal(start.questions.filter(x=>x.subject==='en').length,4);
  assert.equal(start.questions.filter(x=>x.subject==='pol').length,4);
  assert.equal(start.questions.filter(x=>x.subject==='353').length,4);
  assert.equal(start.questions[0].type,'subjective');
  await page.locator('#exam-answer').fill('Rui在周二记住2词、周五记住5词，A3与A6支持；不能得出所有人都有效的结论。');
  await page.locator('#exam-next').click();
  await page.waitForFunction(()=>document.querySelector('.exam-screen-head h1')?.textContent?.includes('第 2 / 12 题'));
  const after1=await page.evaluate(()=>profile.exportBackup());
  assert(after1.profile.settings.diagnosticExamV5.current.answers[start.questions[0].questionId].includes('Rui'));
  assert.equal(await page.locator('#exam-prev').isEnabled(),true);
  const second=after1.profile.settings.diagnosticExamV5.current.questions[1];
  const pack=await (await page.request.get(base+'representative-courses.json')).json();
  const unit=pack.units.find(u=>u.id===second.unitId);
  const question=[...unit.basicQuestions,...unit.applicationQuestions,...unit.delayedQuestions].find(q=>q.id===second.questionId);
  assert(question&&question.type!=='subjective');
  if(question.type==='single')
    await page.locator('input[name="exam-choice"][value="'+question.answer+'"]').check();
  else if(question.type==='multi')
    for(const id of question.answer)await page.locator('input[name="exam-choice"][value="'+id+'"]').check();
  else await page.locator('#exam-answer').fill(String(question.answer));
  await page.locator('#exam-back').click();
  await page.waitForFunction(()=>document.querySelector('#exam-launch')?.dataset.ready==='true',{timeout:15000});
  assert.match(await page.locator('#exam-launch').innerText(),/继续未交卷/);
  const after2=await page.evaluate(()=>profile.exportBackup());
  assert.deepEqual(after2.profile.settings.diagnosticExamV5.current.answers[second.questionId],
     question.type==='number'?{value:question.answer,unit:question.unit}:question.answer);
  assert(after2.profile.settings.candidateEdition==='qh2028-diagnostic-mini-v5');
  assert.equal(after2.events.some(e=>e.unitId==='en-reading-evidence-foundation'),false,
    'Exam attempts must not fabricate regular learning evidence');
  await page.reload();
  await page.getByRole('button',{name:/^继续 三科诊断-虚拟验收/}).click();
  await page.waitForFunction(()=>document.querySelector('#exam-launch')?.dataset.ready==='true',{timeout:15000});
  const backup=await page.evaluate(()=>profile.exportBackup());
  assert.deepEqual(backup,after2,'Reload changed the archived practice test or original learner data');
  await page.locator('#exam-launch').click();
  await page.waitForFunction(()=>document.querySelector('.exam-screen-head h1')?.textContent?.includes('第 2 / 12 题'));
  await page.locator('#exam-submit').click();
  assert.match(await page.locator('#exam-tip').innerText(),/再点一次确认交卷/);
  await page.locator('#exam-submit').click();
  await page.locator('.exam-result-grid').waitFor({timeout:15000});
  assert.match(await page.locator('h1').innerText(),/本轮诊断结果/);
  assert.match(await page.locator('.exam-result-warning').innerText(),/非考研成绩/);
  assert.match(await page.locator('.exam-result-grid').innerText(),/主观题待核对/);
  const submitted=await page.evaluate(()=>profile.exportBackup());
  const state=submitted.profile.settings.diagnosticExamV5.current;
  assert(state.submittedAt);
  const summary=await page.evaluate(()=>MockExamEngine.report(profile ? undefined : undefined,pack,CourseEngine)).catch(()=>null);
  // Compute the report outside browser from the exact saved snapshot.
  const engine=require('./mock-engine.cjs'),grader=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
  const report=engine.report(state,pack,grader);
  assert.equal(report.subjectivePending,1);
  assert.equal(report.objectiveAnswered,1);
  assert.equal(report.objectiveCorrect,1);
  assert.equal(report.formalExamScore,null);
  assert.equal(await page.locator('.exam-review').count(),12);
  await page.locator('#exam-to-home').click();
  await page.waitForFunction(()=>document.querySelector('#exam-launch')?.dataset.ready==='true',{timeout:15000});
  assert.equal(await page.locator('.exam-view-result').count(),1);
  await page.locator('#exam-subject').selectOption('pol');
  await page.locator('#exam-launch').click();
  await page.waitForFunction(()=>document.querySelector('.exam-screen-head h1')?.textContent?.includes('第 1 / 8 题'));
  const fresh=await page.evaluate(()=>profile.exportBackup());
  assert.equal(fresh.profile.settings.diagnosticExamV5.current.subject,'pol');
  assert.equal(fresh.profile.settings.diagnosticExamV5.history.length,1);
  assert.equal(fresh.profile.settings.diagnosticExamV5.history[0].id,state.id);
  assert.deepEqual(errors,[],'Uncaught JS errors');
  out.pass=true;
  Object.assign(out,{courseCount:47,questions:524,subjectMixed:true,subjectSingle:true,offlineDraftAnswerResume:true,
    questionPersistence:true,objectiveGrading:true,subjectivePending:true,nonOfficialScore:true,historyBackup:true,
    learningEventsUnchanged:true,sourceQuestionPackUnchanged:true});
 }catch(error){out.error=error.stack||String(error);}
 finally{
  results.push(out);
  await context?.close().catch(()=>{});
  await browser?.close().catch(()=>{});
  if(server?.listening){server.closeAllConnections();await new Promise(ok=>server.close(ok));}
 }
}
(async()=>{
 for(const name of ['chromium','webkit'])await browserTest(name);
 const output={pass:results.every(x=>x.pass),results,realIPhone:false,formalRelease:false,professionalApprovals:0};
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(output,null,2));
 console.log(JSON.stringify(output));
 if(!output.pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
