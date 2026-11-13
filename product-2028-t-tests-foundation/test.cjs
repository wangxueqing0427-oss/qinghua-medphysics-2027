'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const oldPack=require('../product-2028-progress-v11/.build/representative-courses.json');
const lesson=require('./unit.json').units[0];
const keys=['basicQuestions','applicationQuestions','delayedQuestions'];
const all=keys.flatMap(k=>lesson[k]);
const next={...oldPack,contentVersion:'qh2028-t-tests-53-v12-internal-draft',units:[...oldPack.units,lesson]};
test('append one draft t-course and exactly 12 new questions; old 52 unchanged',()=>{
 assert.equal(oldPack.units.length,52);
 assert.equal(oldPack.units.reduce((n,u)=>n+keys.reduce((m,k)=>m+u[k].length,0),0),584);
 assert.equal(next.units.length,53);
 assert.equal(next.units.filter(u=>u.subject==='353').length,24);
 assert.equal(next.units.reduce((n,u)=>n+keys.reduce((m,k)=>m+u[k].length,0),0),596);
 assert.deepEqual(next.units.slice(0,52),oldPack.units);
 assert.deepEqual(E.validate(next),[]);
 assert.deepEqual(validateObjectives(next),[]);
 assert(E.validate(next,true).includes('release-blocked'));
 assert.equal(lesson.distribution,'held-pending-review');
 assert.equal(lesson.reviewRecord.expertApproved,false);
 assert.equal(lesson.reviewRecord.publicRelease,false);
 assert(lesson.prerequisites.every(id=>oldPack.units.some(u=>u.id===id)));
});
test('four teaching objectives and 12 unique questions have three links per objective',()=>{
 assert.equal(lesson.explanation.split('\n\n').length,4);
 assert.equal(lesson.learningObjectives.length,4);
 assert.equal(lesson.teachingSections.length,4);
 assert.equal(lesson.recall.length,4);
 for(const k of keys)assert.equal(lesson[k].length,4);
 assert.equal(new Set(all.map(q=>q.id)).size,12);
 for(const [i,o] of lesson.learningObjectives.entries()){
  assert.deepEqual(o.teachingSectionIds,['section-'+(i+1)]);
  assert.deepEqual(o.recallIndexes,[i]);
  assert.equal(o.questionIds.length,3);
  assert(o.questionIds.every(qid=>all.some(q=>q.id===qid)));
 }
});
test('all four numerical answers independently recomputed with units and distractors rejected',()=>{
 const cases=[['a2',(14-12)/(3/Math.sqrt(9)),'无量纲'],
  ['a3',(4-0)/(8/Math.sqrt(16)),'无量纲'],
  ['d2',10/Math.sqrt(25),'分'],
  ['d3',8+12-2,'无量纲']];
 assert.equal(all.filter(q=>q.type==='number').length,4);
 for(const [suffix,expected,unit] of cases){
  const q=all.find(x=>x.id===lesson.id+'-'+suffix);
  assert.equal(q.type,'number');
  assert.equal(q.unit,unit);
  assert(Math.abs(q.answer-expected)<1e-10);
  assert.equal(E.grade(q,{value:expected,unit}).correct,true);
  assert.equal(E.grade(q,{value:expected+.3,unit}).correct,false);
  assert.equal(E.grade(q,{value:expected,unit:'错误单位'}).correct,false);
 }
});
test('all subjective grades reference-only and safety/learning source disclaimers explicit',()=>{
 assert.equal(all.filter(x=>x.type==='subjective').length,2);
 for(const q of all){
  assert(q.stem.length>=16,q.id);
  assert(q.explanation.length>16,q.id);
  const result=E.grade(q,q.type==='number'?{value:q.answer,unit:q.unit}:q.answer);
  if(q.type==='subjective'){
   assert.equal(result.method,'reference-only');
   assert.equal(result.correct,null);
   assert.equal(result.score,null);
   assert(q.rubric.length>=4);
  }else{
   assert.equal(result.method,'objective');
   assert.equal(result.correct,true);
   if(q.options)assert.equal(new Set(q.options).size,q.options.length);
  }
 }
 assert(lesson.conditions.includes('所有数据虚构'));
 assert(lesson.conditions.includes('2028官方考纲'));
 assert(lesson.sources.some(u=>u.includes('stat.psu.edu')));
 assert(lesson.sources.some(u=>u.includes('nist.gov')));
});
