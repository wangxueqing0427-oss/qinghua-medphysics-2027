'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const engine=require('./mock-engine.cjs');
const grader=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const pack=require('./.build/representative-courses.json');
const at='2026-11-13T02:00:00.000Z';
function answerFor(q){
 if(q.type==='single'||q.type==='multi')return Array.isArray(q.answer)?q.answer:q.answer;
 if(q.type==='number')return {value:q.answer,unit:q.unit};
 return '独立回答：列出观察结果、证据与适用边界。';
}
test('frozen authored 47 courses, 524 original questions and three-subject diagnostic plans',()=>{
 assert.equal(pack.units.length,47);
 assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),524);
 assert.deepEqual(grader.validate(pack),[]);
 assert(pack.units.every(u=>u.reviewRecord?.expertApproved!==true));
 for(const subj of ['en','pol','353','all']){
   const e=engine.create(pack,subj,at,'test-record-'+subj);
   assert.equal(e.questions.length,subj==='all'?12:8);
   assert.equal(e.limitMinutes,subj==='all'?30:20);
   assert.equal(e.subject,subj);
   assert(engine.check(e,pack));
   assert.equal(e.questions.some(ref=>ref.type==='subjective'),true,'subjective grading safety sample: '+subj);
   if(subj==='all'){
      assert.equal(e.questions.filter(q=>q.subject==='en').length,4);
      assert.equal(e.questions.filter(q=>q.subject==='pol').length,4);
      assert.equal(e.questions.filter(q=>q.subject==='353').length,4);
   }
 }
});
test('all objective types reuse original grade contract; subjective is null, never an official score',()=>{
 let e=engine.create(pack,'all',at,'v5-pure-engine-test');
 assert.equal(e.questions.length,12);
 const subj=e.questions.findIndex(x=>x.type==='subjective');
 assert(subj>=0);
 const ref=e.questions[subj],q=engine.lookup(pack,ref).question;
 e=engine.setAnswer(e,pack,subj,answerFor(q),'2026-11-13T02:01:00Z');
 const obj=e.questions.findIndex(x=>x.type!=='subjective');
 const o=engine.lookup(pack,e.questions[obj]).question;
 e=engine.setAnswer(e,pack,obj,answerFor(o),'2026-11-13T02:01:01Z');
 assert.equal(e.submittedAt,null);
 const submitted=engine.submit(e,pack,'2026-11-13T02:05:00Z','manual');
 const report=engine.report(submitted,pack,grader);
 assert.equal(report.formalExamScore,null);
 assert.equal(report.officialSyllabusCoverage,null);
 assert.equal(report.questionCount,12);
 assert.equal(report.subjectivePending,1);
 assert.equal(report.objectiveAnswered,1);
 assert.equal(report.objectiveCorrect,1);
 assert.equal(report.unanswered,10);
 assert.equal(report.rows.find(r=>r.ref.questionId===ref.questionId).grade.correct,null);
 assert.equal(report.rows.find(r=>r.ref.questionId===ref.questionId).grade.score,null);
 assert.throws(()=>engine.setAnswer(submitted,pack,obj,answerFor(o),'2026-11-13T02:07:00Z'),/Already submitted/);
 assert.throws(()=>engine.submit(submitted,pack,'2026-11-13T02:07:00Z','manual'),/Already submitted/);
 assert.throws(()=>engine.report(e,pack,grader),/Not yet submitted/);
});
test('skip, time limit and validation fail closed on tampered attempts',()=>{
 let e=engine.create(pack,'en',at,'skip-timer-test');
 const q=engine.lookup(pack,e.questions[0]).question;
 e=engine.setAnswer(e,pack,0,answerFor(q),'2026-11-13T02:00:03Z');
 assert(Object.keys(e.answers).length===1);
 e=engine.setAnswer(e,pack,0,null,'2026-11-13T02:00:04Z');
 assert.equal(Object.keys(e.answers).length,0);
 assert.throws(()=>engine.setAnswer(e,pack,0,answerFor(q),'2026-11-13T02:21:00Z'),/考试已到时间/);
 const timeout=engine.submit(e,pack,'2026-11-13T02:21:00Z','timeout');
 assert.equal(timeout.endReason,'timeout');
 assert.equal(engine.report(timeout,pack,grader).unanswered,8);
 const tampered=structuredClone(e);
 tampered.questions[0].unitVersion='unknown-version';
 assert.throws(()=>engine.check(tampered,pack),/版本发生变化/);
 const foreign=structuredClone(e);
 foreign.answers['outside-question']=0;
 assert.throws(()=>engine.check(foreign,pack),/Answer does not belong/);
});
test('mixed exam cannot claim mastery or smuggle answers from another question',()=>{
 const e=engine.create(pack,'all',at,'scope-check');
 assert.equal(e.kind,'diagnostic-mini-test');
 assert.equal(e.version,'v5-internal-only');
 assert.equal(e.questions.length,12);
 const wrong=engine.lookup(pack,e.questions[0]).question;
 assert.throws(()=>engine.setAnswer(e,pack,0,{bad:'payload'},'2026-11-13T02:02:00Z'));
 assert.equal(wrong.type,'subjective');
 const before=structuredClone(e);
 assert.deepEqual(e,before);
 assert.throws(()=>engine.setCursor(e,pack,99),/Invalid cursor/);
});
