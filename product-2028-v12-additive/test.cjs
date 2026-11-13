'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
globalThis.CourseEngine=E;
const Bridge=require('./.build/migration-bridge.js');
const pack=require('./.build/representative-courses.json');
const prior=require('../product-2028-progress-v11/.build/representative-courses.json');
const clone=x=>structuredClone(x);
const h=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const oldHash=h(prior.units);
const original=pack.units.find(x=>x.subject==='353'&&!(x.prerequisites||[]).length&&x.basicQuestions[0]?.type==='single');
if(!original)throw Error('No standalone prior-unit fixture');
const q=original.basicQuestions[0],id='old-v11-synthetic-student';
function backup(){
 const answer={answer:q.answer,questionId:q.id,questionVersion:original.version,questionSnapshot:clone(q),grade:E.grade(q,q.answer),answerVisible:false};
 const contract=JSON.stringify({version:original.version,explanation:original.explanation,recall:original.recall,questions:[...original.basicQuestions,...original.applicationQuestions,...original.delayedQuestions]});
 return {schemaVersion:1,scope:'local-draft',profileId:id,
  profile:{id,mode:'local',createdAt:'2026-11-13T08:00:00.000Z',
   settings:{target:'tsinghua-medphysics-2028',candidateEdition:Bridge.SOURCE,displayName:'历史虚拟学习记录'}},
  events:[
   {id:'event-old-1',profileId:id,unitId:original.id,unitVersion:original.version,action:'learned',payload:{},revision:1,at:'2026-11-13T08:01:00Z'},
   {id:'event-old-2',profileId:id,unitId:original.id,unitVersion:original.version,action:'recalled',payload:{answer:'这是一条仅用于验证的独立闭卷记录',answerVisible:false},revision:2,at:'2026-11-13T08:02:00Z'},
   {id:'event-old-3',profileId:id,unitId:original.id,unitVersion:original.version,action:'answered',payload:answer,revision:3,at:'2026-11-13T08:03:00Z'}],
  sessions:[{id:'unit:'+original.id,profileId:id,unitId:original.id,unitVersion:original.version,
   stage:'feedback',index:0,mode:'new',revision:3,contentContract:contract,feedback:clone(answer)}]
 };
}
test('V12 appends exactly one new 353 course; old 52 course objects are byte-identical',async()=>{
 assert.equal(prior.units.length,52);
 assert.equal(pack.units.length,53);
 assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),596);
 assert.equal(h(pack.units.slice(0,52)),oldHash);
 assert.equal(pack.units[52].id,'353-t-tests-paired-independent-foundation');
 assert.equal(pack.units[52].prerequisites[0],'353-inference-ci-hypothesis-foundation');
 const old=backup(),before=h(old);
 const inspection=await Bridge.inspect(old,pack);
 assert.equal(inspection.previous52CourseContentIdenticalRequired,true);
 assert.equal(inspection.newCourses,1);
 assert.equal(inspection.preservedOriginalCourses,52);
 assert.equal(inspection.answered,1);
 assert.equal(inspection.recalls,1);
 const prepared=await Bridge.prepare(old,pack);
 assert.equal(prepared.profile.settings.candidateEdition,'qh2028-t-additive-v12');
 assert.equal(prepared.profile.settings.optInMigration.previous52CoursesIdentical,true);
 assert.equal(prepared.profile.settings.optInMigration.newCourseCount,1);
 assert.equal(prepared.profile.settings.optInMigration.oldSourcePreserved,true);
 assert.deepEqual(prepared.events,old.events);
 assert.deepEqual(prepared.sessions,old.sessions);
 assert.equal(h(old),before);
});
test('modified old lesson or answer is never silently migrated even though new course exists',async()=>{
 const changed=clone(pack);changed.units[0].explanation+='恶意改变讲解';
 await assert.rejects(()=>Bridge.inspect(backup(),changed),/原52门课程的内容指纹不一致/);
 const wrong=clone(pack);wrong.units[32].basicQuestions[0].answer=999;
 await assert.rejects(()=>Bridge.inspect(backup(),wrong),/原52门课程的内容指纹不一致/);
 const tooMany=clone(pack);tooMany.units.push(pack.units[52]);
 await assert.rejects(()=>Bridge.inspect(backup(),tooMany),/53课/);
 const none=clone(pack);none.units.pop();
 await assert.rejects(()=>Bridge.inspect(backup(),none),/53课/);
 const newShape=clone(pack);newShape.units[52].id='invalid-new-unit';
 await assert.rejects(()=>Bridge.inspect(backup(),newShape),/新增加的统计t检验课程结构/);
});
test('reject incorrect source version, introduced future-lesson evidence and mixed profiles',async()=>{
 const wrong=backup();wrong.profile.settings.candidateEdition='qh2028-stat-inference-52-v10';
 await assert.rejects(()=>Bridge.inspect(wrong,pack),/只支持上一版V11/);
 const future=backup();future.events[0].unitId='353-t-tests-paired-independent-foundation';
 await assert.rejects(()=>Bridge.inspect(future,pack),/不存在或已改变/);
 const fake=backup();fake.events[1].profileId='different-person';
 await assert.rejects(()=>Bridge.inspect(fake,pack),/其他档案/);
 const dup=backup();dup.events[2].id=dup.events[1].id;
 await assert.rejects(()=>Bridge.inspect(dup,pack),/重复/);
 const altered=backup();altered.events[2].payload.grade.correct=false;
 await assert.rejects(()=>Bridge.inspect(altered,pack),/评分记录/);
 const snapshot=backup();snapshot.events[2].payload.questionSnapshot.stem+='变更';
 await assert.rejects(()=>Bridge.inspect(snapshot,pack),/已答题目/);
});
test('old learning-session contract is checked; invalid stage or old lesson version blocked',async()=>{
 const noContract=backup();noContract.sessions[0].contentContract='{}';
 await assert.rejects(()=>Bridge.inspect(noContract,pack),/讲解、题干或答案/);
 const changed=backup();changed.sessions[0].unitVersion='88';
 await assert.rejects(()=>Bridge.inspect(changed,pack),/不存在/);
 const bad=backup();bad.sessions[0].stage='unknown';
 await assert.rejects(()=>Bridge.inspect(bad,pack),/会话阶段/);
 const qdrift=backup();qdrift.sessions[0].feedback.questionSnapshot.answer=99;
 await assert.rejects(()=>Bridge.inspect(qdrift,pack),/题目快照/);
});
