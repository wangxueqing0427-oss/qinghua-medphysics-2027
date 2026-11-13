'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
globalThis.CourseEngine=E;
const Bridge=require('./.build/migration-bridge.js');
const pack=require('../product-2028-stat-inference-52/.build/representative-courses.json');
const copy=x=>structuredClone(x);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const oldHash=digest(pack);
const unit=pack.units.find(u=>u.subject==='353'&&!(u.prerequisites||[]).length&&u.basicQuestions[0]?.type==='single');
assert(unit,'Expected prerequisite-free sample course');
const q=unit.basicQuestions[0];
const id='sample-legacy-profile';
function fixture(){
 const payload={answer:q.answer,questionId:q.id,questionVersion:unit.version,questionSnapshot:copy(q),
  grade:E.grade(q,q.answer),answerVisible:false};
 const contract=JSON.stringify({version:unit.version,explanation:unit.explanation,recall:unit.recall,
  questions:[...unit.basicQuestions,...unit.applicationQuestions,...(unit.delayedQuestions||[])]});
 return {
  schemaVersion:1,profileId:id,scope:'local-draft',
  profile:{id,mode:'local',createdAt:'2026-11-13T00:00:00.000Z',
   settings:{target:'tsinghua-medphysics-2028',candidateEdition:Bridge.SOURCE,displayName:'虚构旧档案'}},
  events:[
   {id:'e-1',profileId:id,unitId:unit.id,unitVersion:unit.version,
    action:'learned',payload:{},revision:1,at:'2026-11-13T00:01:00Z'},
   {id:'e-2',profileId:id,unitId:unit.id,unitVersion:unit.version,
    action:'recalled',payload:{answer:'这是独立虚构的闭卷回忆',answerVisible:false},revision:2,at:'2026-11-13T00:02:00Z'},
   {id:'e-3',profileId:id,unitId:unit.id,unitVersion:unit.version,
    action:'answered',payload,revision:3,at:'2026-11-13T00:03:00Z'}
  ],
  sessions:[{id:'unit:'+unit.id,profileId:id,unitId:unit.id,unitVersion:unit.version,
   contentContract:contract,stage:'feedback',index:0,mode:'new',revision:3,feedback:copy(payload)}]
 };
}
test('opt-in migration is strictly one hop with IDENTICAL V10 content and new profile only',async()=>{
 const from=fixture(),before=digest(from);
 const result=await Bridge.inspect(from,pack);
 assert.equal(result.sourceEdition,'qh2028-stat-inference-52-v10');
 assert.equal(result.targetEdition,'qh2028-progress-safe-v11');
 assert.equal(result.events,3);assert.equal(result.sessions,1);
 assert.equal(result.answered,1);assert.equal(result.recalls,1);
 assert.equal(result.createsProfile,false);
 const staged=await Bridge.prepare(from,pack);
 assert.equal(staged.profile.settings.candidateEdition,Bridge.TARGET);
 assert.equal(staged.profile.settings.optInMigration.sourceProfileId,id);
 assert.equal(staged.profileId,id,'Repository will allocate different ID during atomic restore');
 assert.equal(digest(from),before,'Source backup must be immutable');
 assert.deepEqual(staged.events,from.events);
 assert.deepEqual(staged.sessions,from.sessions);
 assert.equal(digest(pack),oldHash,'Course pack must remain untouched');
});
test('mismatched source editions, course content and question inventory always stop',async()=>{
 const wrong=fixture();wrong.profile.settings.candidateEdition='qh2028-radiotherapy-51-v9';
 await assert.rejects(()=>Bridge.inspect(wrong,pack),/只支持上一版V10/);
 const future=fixture();future.profile.settings.candidateEdition=Bridge.TARGET;
 await assert.rejects(()=>Bridge.inspect(future,pack),/只支持上一版V10/);
 const changed=copy(pack);changed.units[0].explanation+='变化';
 await assert.rejects(()=>Bridge.inspect(fixture(),changed),/课程包不符合V10|课程|题目/);
 const shorter=copy(pack);shorter.units.pop();
 await assert.rejects(()=>Bridge.inspect(fixture(),shorter),/当前课程包/);
});
test('reject forged or mixed-profile learning events, score and answer changes',async()=>{
 const bad=fixture();bad.events[0].profileId='other-person';
 await assert.rejects(()=>Bridge.inspect(bad,pack),/其他档案/);
 const duplicate=fixture();duplicate.events[1].id='e-1';
 await assert.rejects(()=>Bridge.inspect(duplicate,pack),/重复/);
 const qDrift=fixture();qDrift.events[2].payload.questionSnapshot.stem+='篡改';
 await assert.rejects(()=>Bridge.inspect(qDrift,pack),/已答题目/);
 const answerDrift=fixture();answerDrift.events[2].payload.answer=(q.answer+1)%q.options.length;
 await assert.rejects(()=>Bridge.inspect(answerDrift,pack),/评分记录/);
 const fakeGrade=fixture();fakeGrade.events[2].payload.grade.correct=false;
 await assert.rejects(()=>Bridge.inspect(fakeGrade,pack),/评分记录/);
 const extra=fixture();extra.events[0].unitId='fake-course';
 await assert.rejects(()=>Bridge.inspect(extra,pack),/不存在/);
});
test('incomplete or modified unit session contracts cannot be silently resumed',async()=>{
 const changed=fixture();changed.sessions[0].contentContract='{}';
 await assert.rejects(()=>Bridge.inspect(changed,pack),/讲解、题干或答案/);
 const wrong=fixture();wrong.sessions[0].unitVersion='99';
 await assert.rejects(()=>Bridge.inspect(wrong,pack),/不存在/);
 const mixed=fixture();mixed.sessions[0].profileId='someone-else';
 await assert.rejects(()=>Bridge.inspect(mixed,pack),/其他档案/);
 const invalid=fixture();invalid.sessions[0].feedback.questionSnapshot.answer=99;
 await assert.rejects(()=>Bridge.inspect(invalid,pack),/题目快照/);
 const unknown=fixture();unknown.sessions[0].id='unknown-session';
 await assert.rejects(()=>Bridge.inspect(unknown,pack),/未知学习会话/);
});
test('no import performs actual writing; V10 and V11 versions remain explicitly distinguishable',async()=>{
 const source=fixture();
 assert.equal(Bridge.SOURCE,'qh2028-stat-inference-52-v10');
 assert.equal(Bridge.TARGET,'qh2028-progress-safe-v11');
 assert.equal((await Bridge.inspect(source,pack)).newProfileOnly,true);
 const copy=await Bridge.prepare(source,pack);
 assert.notEqual(copy,source);
 assert.equal(source.profile.settings.candidateEdition,Bridge.SOURCE);
 assert.equal(copy.profile.settings.candidateEdition,Bridge.TARGET);
});
