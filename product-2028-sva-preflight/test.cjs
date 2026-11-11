'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {checkSvaPrerequisite}=require('./guard.cjs');
const engine=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const Learning=require('../product-2028-draft/learning-controller.cjs');
const Repository=require('../product-2028-draft/profile-repository.cjs');
const fake=require('../audit-2028/test-indexeddb.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const svo=require('../product-2028-svo-subjective-candidate/course.json').units[0];
const sva=require('../product-2028-draft/course-drafts/en-subject-verb-agreement/unit.json').units[0];
const clone=x=>structuredClone(x);
function isBlocked(x){assert.equal(x.ready,false);assert.equal(x.mastered,false);assert.equal(typeof x.reason,'string');}
test('source SVA draft is a held, unapproved 4-objective 12-question prerequisite course',()=>{
  const pack={schemaVersion:1,units:[svo,sva]};
  assert.deepEqual(engine.validate(pack),[]);
  assert.deepEqual(validateObjectives(pack),[]);
  assert.equal(sva.reviewRecord.expertApproved,false);
  assert.equal(sva.distribution,'held-pending-review');
  assert.deepEqual(sva.prerequisites,[svo.id]);
  assert.equal(sva.learningObjectives.length,4);
  const all=['basicQuestions','applicationQuestions','delayedQuestions'].flatMap(k=>sva[k]);
  assert.equal(all.length,12);
  assert.equal(all.filter(q=>q.type==='subjective').length,3);
  for(const o of sva.learningObjectives){
    assert.equal(o.questionIds.length,3);
    assert.equal(o.recallIndexes.length,1);
    assert.equal(o.teachingSectionIds.length,1);
  }
  assert.equal(svo.delayedQuestions.length,3);
});
test('empty, malformed or forged state cannot unlock the next course',()=>{
  isBlocked(checkSvaPrerequisite({},svo,sva));
  isBlocked(checkSvaPrerequisite({events:[],sessions:[]},svo,sva));
  isBlocked(checkSvaPrerequisite({events:[],sessions:[{id:'unit:'+svo.id,stage:'scheduled',unitVersion:svo.version}]},svo,sva));
  isBlocked(checkSvaPrerequisite({events:[],sessions:[]},{...svo,id:'wrong-course'},sva));
  isBlocked(checkSvaPrerequisite({events:[],sessions:[]},svo,{...sva,reviewRecord:{expertApproved:true}}));
});
test('exact synthetic training path blocks premature unlock and accepts ONLY completed delayed practice',async()=>{
  const repo=Repository.createRepository(new fake.IDBFactory(),fake.IDBKeyRange);
  const profile=await repo.createProfile('sva-gate-synthetic-profile');
  let clock=Date.parse('2026-11-11T00:00:00Z'),n=0;
  const c=Learning.createLearningController(engine,profile,[svo,sva],()=>new Date(clock).toISOString(),()=> 'sva-gate-'+(++n));
  let s=await c.load(svo.id);
  s=await c.learned(s);
  s=await c.recall(s,'S主语 V动作 O宾语，Birds fly 无宾语');
  // Existing controller considered a lone correct objective + recall enough for SVA.
  s=await c.answer(s,1);
  let b=await profile.exportBackup();
  assert.equal(Learning.prerequisiteStatus(sva,b).ready,true,'reproduce old weak prerequisite condition');
  isBlocked(checkSvaPrerequisite(b,svo,sva));
  s=await c.next(s);
  s=await c.answer(s,2);s=await c.next(s);
  s=await c.answer(s,'children water flowers, garden place, morning time');
  assert.equal(s.feedback.grade.score,null);assert.equal(s.feedback.grade.correct,null);
  s=await c.next(s,{selfRubric:[0,1,2,3],note:'reviewed'});
  assert.equal(s.stage,'scheduled');
  b=await profile.exportBackup();
  isBlocked(checkSvaPrerequisite(b,svo,sva)); // Full first cycle is insufficient.
  clock+=2*86400000;
  s=await c.review(s);
  s=await c.recall(s,'新的句子也先找主语谓语动词再找宾语');
  s=await c.answer(s,1);s=await c.next(s);
  s=await c.answer(s,[0,1]);s=await c.next(s);
  b=await profile.exportBackup();
  isBlocked(checkSvaPrerequisite(b,svo,sva)); // Two delayed objectives alone are insufficient.
  s=await c.answer(s,'nurses check records, clinic location, morning frequency');
  b=await profile.exportBackup();
  isBlocked(checkSvaPrerequisite(b,svo,sva)); // Feedback must be finished and saved.
  s=await c.next(s,{selfRubric:[0,1,2,3],note:'自评只代表核对，不代表已掌握',cause:'unclassified'});
  b=await profile.exportBackup();
  const snapshot=JSON.stringify(b);
  const result=checkSvaPrerequisite(b,svo,sva);
  assert.deepEqual(result,{ready:true,mastered:false,reason:'full-delayed-practice-completed-ungraded-subjective'});
  assert.equal(JSON.stringify(b),snapshot,'gate must be read-only');
  assert.equal(b.sessions.find(x=>x.id==='review:'+svo.id).state,'subjective-pending');
  const old=clone(b);
  function reject(mutator,label){
    const changed=clone(old);
    mutator(changed);
    const actual=checkSvaPrerequisite(changed,svo,sva);
    isBlocked(actual);
    return label;
  }
  reject(x=>{x.events=x.events.filter(e=>e.payload?.questionId!=='en-svo-delay-3')},'missing subjective');
  reject(x=>{x.events.find(e=>e.payload?.questionId==='en-svo-delay-1').payload.grade.correct=false},'wrong objective');
  reject(x=>{x.events.find(e=>e.payload?.questionId==='en-svo-delay-2').payload.questionSnapshot.answer=[0,2]},'tampered snapshot');
  reject(x=>{x.events.find(e=>e.payload?.questionId==='en-svo-delay-3').payload.grade.score=1},'invented subjective score');
  reject(x=>{x.events=x.events.filter(e=>e.action!=='scheduled'||e.revision<x.events.find(q=>q.action==='review-start').revision)},'missing final reflection');
  reject(x=>{x.events.find(e=>e.action==='review-start').unitVersion='legacy'},'legacy-only review');
  reject(x=>{x.sessions.find(e=>e.id==='unit:'+svo.id).stage='practice'},'unfinished unit');
  reject(x=>{x.sessions.find(e=>e.id==='review:'+svo.id).state='delayed-evidence'},'false mastery');
  assert.deepEqual(await profile.exportBackup(),old,'original synthetic learning data unchanged by gate');
  await repo.close();
});
