'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const engine=require('./course-engine.cjs');
const legacyEngine=require('../product-2028-draft/course-engine.cjs');
const pack=require('./course.json');
const legacyPack=require('../product-2028-svo-c1/course.json');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const {createLearningController}=require('../product-2028-draft/learning-controller.cjs');
const {createRepository}=require('../product-2028-draft/profile-repository.cjs');
const fake=require('../audit-2028/test-indexeddb.cjs');

const unit=pack.units[0],old=legacyPack.units[0];
const now='2026-11-11T00:00:00.000Z';
const objective=(correct,at=now)=>({at,type:'single',questionId:'q-objective',method:'objective',correct,answerVisible:false});
const subjective=(at=now)=>({at,type:'subjective',questionId:'q-subjective',method:'reference-only',correct:null,score:null,answerVisible:false});

test('one isolated course, five untouched original questions, independent delayed subjective',()=>{
  assert.deepEqual(engine.validate(pack),[]);
  assert.deepEqual(validateObjectives(pack),[]);
  assert.equal(unit.id,old.id);
  assert.notEqual(unit.version,old.version);
  assert.deepEqual(unit.basicQuestions,old.basicQuestions);
  assert.deepEqual(unit.applicationQuestions,old.applicationQuestions);
  assert.deepEqual(unit.delayedQuestions.slice(0,2),old.delayedQuestions);
  assert.equal(unit.delayedQuestions.length,3);
  const added=unit.delayedQuestions[2];
  assert.equal(added.type,'subjective');
  assert.equal(added.id,'en-svo-delay-3');
  assert(added.stem.includes('in the clinic')&&added.stem.includes('every morning'));
  assert(added.rubric.length===4);
  assert(unit.learningObjectives[1].questionIds.includes(added.id));
  assert.equal(unit.reviewRecord.expertApproved,false);
  assert.equal(unit.distribution,'held-pending-review');
});

test('reference-only subjective is never assigned an automatic grade',()=>{
  const q=unit.delayedQuestions[2];
  assert.deepEqual(engine.grade(q,'nurses — check — records'),{
    method:'reference-only',correct:null,score:null,rubric:q.rubric,reference:q.answer
  });
  assert.equal(engine.grade(unit.delayedQuestions[0],1).correct,true);
  assert.equal(engine.grade(unit.delayedQuestions[1],[0,1,2]).correct,false);
});

test('objective-only evidence stays byte-for-byte equivalent to current engine',()=>{
  for(const sample of [[],[objective(true)],[objective(false)],[objective(false),objective(true)]]){
    assert.deepEqual(engine.evidence(sample,now),legacyEngine.evidence(sample,now));
  }
});

test('pending subjective does not impersonate an incorrect answer or inflate mastery',()=>{
  const rows=[objective(true),subjective()];
  const result=engine.evidence(rows,now);
  assert.equal(legacyEngine.evidence(rows,now).state,'needs-review');
  assert.equal(result.state,'subjective-pending');
  assert.equal(result.subjectivePending,true);
  assert.equal(result.scoreEstimate,null);
  assert.equal(result.due,'2026-11-12T00:00:00.000Z');
  assert.equal(engine.evidence([subjective()],now).state,'subjective-pending');
  const mistake=engine.evidence([objective(false),subjective()],now);
  assert.equal(mistake.state,'needs-review');
  assert.equal(mistake.subjectivePending,true);
});

test('full synthetic first lesson, delayed answer, feedback, scheduling and backup restoration',async()=>{
  const repository=createRepository(new fake.IDBFactory(),fake.IDBKeyRange);
  let time=Date.parse(now),eventNo=0;
  const profile=await repository.createProfile('synthetic-svo-delay');
  const controller=createLearningController(engine,profile,pack.units,()=>new Date(time).toISOString(),()=> 'synthetic-event-'+(++eventNo));
  let s=await controller.load(unit.id);
  s=await controller.learned(s);
  s=await controller.recall(s,'S是主语，V是动词，O是直接宾语；Birds fly没有直接宾语');
  const first=[1,2,'children — water — the flowers; in the garden地点; every morning时间'];
  for(let i=0;i<first.length;i++){
    s=await controller.answer(s,first[i]);
    if(i===2){assert.equal(s.feedback.grade.correct,null);assert.equal(s.feedback.grade.score,null);}
    s=await controller.next(s,i===2?{cause:'unclassified',selfRubric:[0,1,2,3],note:'自己对照过要点'}:{});
  }
  assert.equal(s.stage,'scheduled');
  let backup=await profile.exportBackup();
  let review=backup.sessions.find(x=>x.id==='review:'+unit.id);
  assert.equal(review.state,'subjective-pending');
  assert.equal(review.subjectivePending,true);
  assert(!backup.events.some(x=>x.payload?.grade?.method==='reference-only'&&x.payload.grade.score!==null));
  time+=2*86400000;
  s=await controller.review(s);
  s=await controller.recall(s,'读新句先找check，nurses做动作，records承受动作');
  const answers=[1,[0,1],'  The nurses in the clinic — check — the records; clinic是地点; every morning是时间。  '];
  for(let i=0;i<answers.length;i++){
    s=await controller.answer(s,answers[i]);
    if(i===2){
      assert.equal(s.feedback.answer,answers[i]);
      assert.equal(s.feedback.grade.score,null);
      assert.equal(s.feedback.questionSnapshot.id,'en-svo-delay-3');
    }
    s=await controller.next(s,i===2?{cause:'unclassified',selfRubric:[0,1,2,3],note:'自评不等于正式评分'}:{});
  }
  assert.equal(s.stage,'scheduled');
  backup=await profile.exportBackup();
  review=backup.sessions.find(x=>x.id==='review:'+unit.id);
  assert.equal(review.state,'subjective-pending');
  assert.equal(review.scoreEstimate,null);
  assert(backup.events.some(x=>x.action==='answered'&&x.payload?.questionId==='en-svo-delay-3'));
  assert(backup.events.some(x=>x.action==='scheduled'&&x.payload?.reflection?.selfRubric?.length===4));
  const clone=await repository.restoreAsNewProfile('synthetic-svo-delay-clone',backup);
  const restored=await clone.exportBackup();
  assert.notEqual(restored.profileId,backup.profileId);
  const strip=rows=>rows.map(({profileId,...v})=>v);
  assert.deepEqual(strip(restored.events),strip(backup.events));
  assert.deepEqual(strip(restored.sessions),strip(backup.sessions));
  assert.deepEqual(await profile.exportBackup(),backup);
  await repository.close();
});

test('existing profile version is blocked without resetting its saved data',async()=>{
  const repository=createRepository(new fake.IDBFactory(),fake.IDBKeyRange);
  const profile=await repository.createProfile('synthetic-legacy');
  const c=createLearningController(legacyEngine,profile,legacyPack.units,()=>now,()=> 'legacy-event-1');
  let s=await c.load(old.id);
  s=await c.learned(s);
  const saved=await profile.exportBackup();
  await assert.rejects(createLearningController(engine,profile,pack.units).load(unit.id),/版本|答案/);
  assert.deepEqual(await profile.exportBackup(),saved);
  await repository.close();
});
