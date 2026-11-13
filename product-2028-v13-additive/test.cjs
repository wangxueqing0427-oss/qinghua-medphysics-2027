'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
globalThis.CourseEngine=E;
const Bridge=require('./.build/migration-bridge.js');
const pack=require('./.build/representative-courses.json');
const prior=require('../product-2028-v12-additive/.build/representative-courses.json');
const clone=x=>structuredClone(x);
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const oldHash=sha(prior.units);
const original=pack.units.find(u=>u.subject==='353'&&!(u.prerequisites||[]).length&&u.basicQuestions[0]?.type==='single');
if(!original)throw Error('No standalone original course test fixture');
const q=original.basicQuestions[0],oldId='synthetic-v12-student';
function backup(){
 const response={answer:q.answer,questionId:q.id,questionVersion:original.version,
  questionSnapshot:clone(q),grade:E.grade(q,q.answer),answerVisible:false};
 const contract=JSON.stringify({version:original.version,explanation:original.explanation,
  recall:original.recall,questions:[...original.basicQuestions,...original.applicationQuestions,...original.delayedQuestions]});
 return {
  schemaVersion:1,scope:'local-draft',profileId:oldId,
  profile:{id:oldId,mode:'local',createdAt:'2026-11-13T09:00:00.000Z',
   settings:{target:'tsinghua-medphysics-2028',candidateEdition:Bridge.SOURCE,displayName:'旧版虚拟测试档案'}},
  events:[
   {id:'event-1',profileId:oldId,unitId:original.id,unitVersion:original.version,
    action:'learned',payload:{},revision:1,at:'2026-11-13T09:00:01Z'},
   {id:'event-2',profileId:oldId,unitId:original.id,unitVersion:original.version,
    action:'recalled',payload:{answer:'用于测试的独立闭卷回忆证据',answerVisible:false},
    revision:2,at:'2026-11-13T09:00:02Z'},
   {id:'event-3',profileId:oldId,unitId:original.id,unitVersion:original.version,
    action:'answered',payload:response,revision:3,at:'2026-11-13T09:00:03Z'}
  ],
  sessions:[{id:'unit:'+original.id,profileId:oldId,unitId:original.id,
   unitVersion:original.version,contentContract:contract,stage:'feedback',
   index:0,mode:'new',revision:3,feedback:clone(response)}]
 };
}
test('V13 adds only outbreak theory; 53 old units remain structurally and byte equivalent',async()=>{
 assert.equal(prior.units.length,53);
 assert.equal(pack.units.length,54);
 assert.equal(pack.units.filter(u=>u.subject==='353').length,25);
 assert.equal(pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0),608);
 assert.equal(pack.units[53].id,'353-outbreak-investigation-foundation');
 assert.deepEqual(pack.units.slice(0,53),prior.units);
 assert.equal(sha(pack.units.slice(0,53)),oldHash);
 const previous=backup(),originalHash=sha(previous);
 const result=await Bridge.inspect(previous,pack);
 assert.equal(result.preservedOriginalCourses,53);
 assert.equal(result.previous53CourseContentIdenticalRequired,true);
 assert.equal(result.newCourses,1);
 assert.equal(result.answered,1);
 assert.equal(result.recalls,1);
 assert.equal(result.createsProfile,false);
 const prepared=await Bridge.prepare(previous,pack);
 assert.equal(prepared.profile.settings.candidateEdition,Bridge.TARGET);
 assert.equal(prepared.profile.settings.optInMigration.previous53CoursesIdentical,true);
 assert.equal(prepared.profile.settings.optInMigration.sourceProfileId,oldId);
 assert.equal(prepared.profile.settings.optInMigration.oldSourcePreserved,true);
 assert.deepEqual(prepared.events,previous.events);
 assert.deepEqual(prepared.sessions,previous.sessions);
 assert.equal(sha(previous),originalHash,'Historical exported JSON must remain unchanged');
});
test('altering any old lesson OR any new lesson fails cryptographic course audit',async()=>{
 const changed=clone(pack);changed.units[0].explanation+='X';
 await assert.rejects(()=>Bridge.inspect(backup(),changed),/原53门课程内容指纹不一致/);
 const key=clone(pack);key.units[32].basicQuestions[0].answer=999;
 await assert.rejects(()=>Bridge.inspect(backup(),key),/原53门课程内容指纹不一致/);
 const newKey=clone(pack);newKey.units[53].applicationQuestions[1].answer=99;
 await assert.rejects(()=>Bridge.inspect(backup(),newKey),/完整V13课程包指纹不一致/);
 const newTitle=clone(pack);newTitle.units[53].title='替换课程';
 await assert.rejects(()=>Bridge.inspect(backup(),newTitle),/完整V13课程包指纹不一致/);
 const tooFew=clone(pack);tooFew.units.pop();
 await assert.rejects(()=>Bridge.inspect(backup(),tooFew),/54课V13/);
 const extra=clone(pack);extra.units.push(pack.units[53]);
 await assert.rejects(()=>Bridge.inspect(backup(),extra),/54课V13/);
});
test('wrong source edition, mixed historical learner data, forged answer and fabricated new-unit history are rejected',async()=>{
 const wrong=backup();wrong.profile.settings.candidateEdition='qh2028-progress-safe-v11';
 await assert.rejects(()=>Bridge.inspect(wrong,pack),/只支持上一版V12/);
 const same=backup();same.profile.settings.candidateEdition=Bridge.TARGET;
 await assert.rejects(()=>Bridge.inspect(same,pack),/只支持上一版V12/);
 const future=backup();future.events[0].unitId='353-outbreak-investigation-foundation';
 await assert.rejects(()=>Bridge.inspect(future,pack),/不存在或已改变/);
 const mixed=backup();mixed.events[0].profileId='different-profile';
 await assert.rejects(()=>Bridge.inspect(mixed,pack),/其他档案/);
 const duplicate=backup();duplicate.events[1].id=duplicate.events[0].id;
 await assert.rejects(()=>Bridge.inspect(duplicate,pack),/重复/);
 const forged=backup();forged.events[2].payload.grade.correct=false;
 await assert.rejects(()=>Bridge.inspect(forged,pack),/评分记录/);
 const modified=backup();modified.events[2].payload.questionSnapshot.stem+='M';
 await assert.rejects(()=>Bridge.inspect(modified,pack),/已答题目/);
});
test('old unit sessions cannot silently shift to another version or assessment stage',async()=>{
 const bad=backup();bad.sessions[0].contentContract='{}';
 await assert.rejects(()=>Bridge.inspect(bad,pack),/讲解、题干或答案/);
 const wrong=backup();wrong.sessions[0].unitVersion='999';
 await assert.rejects(()=>Bridge.inspect(wrong,pack),/不存在/);
 const mixed=backup();mixed.sessions[0].profileId='different';
 await assert.rejects(()=>Bridge.inspect(mixed,pack),/其他档案/);
 const stage=backup();stage.sessions[0].stage='unknown';
 await assert.rejects(()=>Bridge.inspect(stage,pack),/会话阶段/);
});
