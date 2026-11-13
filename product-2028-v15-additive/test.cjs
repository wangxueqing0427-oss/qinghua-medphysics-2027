'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
globalThis.CourseEngine=E;
const Bridge=require('./.build/migration-bridge.js');
const pack=require('./.build/representative-courses.json');
const prior=require('../product-2028-v14-additive/.build/representative-courses.json');
const clone=x=>structuredClone(x);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const oldDigest=digest(prior.units);
const u=pack.units.find(x=>x.subject==='353'&&!(x.prerequisites||[]).length&&x.basicQuestions[0]?.type==='single');
if(!u)throw Error('No historic standalone fixture unit');
const q=u.basicQuestions[0],profileId='v14-synthetic-historic-student';
function sample(){
 const response={answer:q.answer,questionId:q.id,questionVersion:u.version,
  questionSnapshot:clone(q),grade:E.grade(q,q.answer),answerVisible:false};
 const contract=JSON.stringify({version:u.version,explanation:u.explanation,recall:u.recall,
  questions:[...u.basicQuestions,...u.applicationQuestions,...u.delayedQuestions]});
 return {schemaVersion:1,scope:'local-draft',profileId,
  profile:{id:profileId,mode:'local',createdAt:'2026-11-13T08:00:00.000Z',
   settings:{target:'tsinghua-medphysics-2028',candidateEdition:Bridge.SOURCE,displayName:'虚构V14旧学习记录'}},
  events:[
   {id:'event-old-1',profileId,unitId:u.id,unitVersion:u.version,action:'learned',payload:{},revision:1,at:'2026-11-13T08:01:00Z'},
   {id:'event-old-2',profileId,unitId:u.id,unitVersion:u.version,action:'recalled',
    payload:{answer:'用于测试的独立闭卷解释：符合研究设计与模型前提',answerVisible:false},revision:2,at:'2026-11-13T08:02:00Z'},
   {id:'event-old-3',profileId,unitId:u.id,unitVersion:u.version,action:'answered',
    payload:response,revision:3,at:'2026-11-13T08:03:00Z'}
  ],
  sessions:[{id:'unit:'+u.id,profileId,unitId:u.id,unitVersion:u.version,
    contentContract:contract,stage:'feedback',index:0,mode:'new',revision:3,feedback:clone(response)}]
 };
}
test('V15 has 56 courses, 632 questions, original 55 courses identical and only one new EPI11 unit',async()=>{
 assert.equal(prior.units.length,55);
 assert.equal(pack.units.length,56);
 assert.equal(pack.units.filter(x=>x.subject==='353').length,27);
 assert.equal(pack.units.reduce((n,x)=>n+x.basicQuestions.length+x.applicationQuestions.length+x.delayedQuestions.length,0),632);
 assert.equal(pack.units[55].id,'353-evidence-systematic-review-meta-foundation');
 assert.equal(digest(pack.units.slice(0,55)),oldDigest);
 const original=sample(),before=digest(original);
 const inspected=await Bridge.inspect(original,pack);
 assert.equal(inspected.sourceEdition,'qh2028-stat03-55-v14');
 assert.equal(inspected.targetEdition,'qh2028-evidence-meta-56-v15');
 assert.equal(inspected.previous55CourseContentIdenticalRequired,true);
 assert.equal(inspected.preservedOriginalCourses,55);
 assert.equal(inspected.newCourses,1);
 assert.equal(inspected.answered,1);
 assert.equal(inspected.recalls,1);
 assert.equal(inspected.createsProfile,false);
 const safe=await Bridge.prepare(original,pack);
 assert.equal(safe.profile.settings.candidateEdition,Bridge.TARGET);
 assert.equal(safe.profile.settings.optInMigration.previous55CoursesIdentical,true);
 assert.equal(safe.profile.settings.optInMigration.sourceProfileId,profileId);
 assert.equal(safe.profile.settings.optInMigration.oldSourcePreserved,true);
 assert.deepEqual(safe.events,original.events);
 assert.deepEqual(safe.sessions,original.sessions);
 assert.equal(digest(original),before,'Source must be immutable');
});
test('any old question, new answer, or altered EPI11 material breaks cryptographic approval',async()=>{
 const oldText=clone(pack);oldText.units[0].explanation+='changed';
 await assert.rejects(()=>Bridge.inspect(sample(),oldText),/原55门课程内容指纹不一致/);
 const oldKey=clone(pack);oldKey.units[32].basicQuestions[0].answer=777;
 await assert.rejects(()=>Bridge.inspect(sample(),oldKey),/原55门课程内容指纹不一致/);
 const newText=clone(pack);newText.units[55].explanation+='modified';
 await assert.rejects(()=>Bridge.inspect(sample(),newText),/完整V15课程包指纹不一致/);
 const newKey=clone(pack);newKey.units[55].applicationQuestions[1].answer=99;
 await assert.rejects(()=>Bridge.inspect(sample(),newKey),/完整V15课程包指纹不一致/);
 const missing=clone(pack);missing.units.pop();
 await assert.rejects(()=>Bridge.inspect(sample(),missing),/56课V15/);
 const extra=clone(pack);extra.units.push(pack.units[55]);
 await assert.rejects(()=>Bridge.inspect(sample(),extra),/56课V15/);
});
test('wrong version, forged grades, mixed profiles and future evidence are refused before saving',async()=>{
 const wrong=sample();wrong.profile.settings.candidateEdition='qh2028-outbreak-54-v13';
 await assert.rejects(()=>Bridge.inspect(wrong,pack),/只支持上一版V14/);
 const target=sample();target.profile.settings.candidateEdition=Bridge.TARGET;
 await assert.rejects(()=>Bridge.inspect(target,pack),/只支持上一版V14/);
 const future=sample();future.events[0].unitId='353-evidence-systematic-review-meta-foundation';
 await assert.rejects(()=>Bridge.inspect(future,pack),/不存在或已改变/);
 const mixed=sample();mixed.events[0].profileId='different-profile';
 await assert.rejects(()=>Bridge.inspect(mixed,pack),/其他档案/);
 const dup=sample();dup.events[2].id=dup.events[0].id;
 await assert.rejects(()=>Bridge.inspect(dup,pack),/重复/);
 const score=sample();score.events[2].payload.grade.correct=false;
 await assert.rejects(()=>Bridge.inspect(score,pack),/评分记录/);
 const snapshot=sample();snapshot.events[2].payload.questionSnapshot.answer=888;
 await assert.rejects(()=>Bridge.inspect(snapshot,pack),/已答题目/);
});
test('historical session content, stage and profile ownership remain validated',async()=>{
 const contract=sample();contract.sessions[0].contentContract='{}';
 await assert.rejects(()=>Bridge.inspect(contract,pack),/讲解、题干或答案/);
 const stage=sample();stage.sessions[0].stage='unknown';
 await assert.rejects(()=>Bridge.inspect(stage,pack),/会话阶段/);
 const version=sample();version.sessions[0].unitVersion='999';
 await assert.rejects(()=>Bridge.inspect(version,pack),/不存在/);
 const mixed=sample();mixed.sessions[0].profileId='other-person';
 await assert.rejects(()=>Bridge.inspect(mixed,pack),/其他档案/);
});
