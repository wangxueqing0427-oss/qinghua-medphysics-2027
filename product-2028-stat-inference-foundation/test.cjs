'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const oldPack=require('../product-2028-radiotherapy-51/.build/representative-courses.json');
const draft=require('./unit.json'),unit=draft.units[0];
const stages=['basicQuestions','applicationQuestions','delayedQuestions'],all=stages.flatMap(g=>unit[g]);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const originalDigest=digest(oldPack),combined={...oldPack,units:[...oldPack.units,unit]};
const get=s=>all.find(x=>x.id==='353-inference-ci-hypothesis-foundation-'+s);
test('52nd statistics lesson preserves 51 courses and 572 questions, with independent unapproved new draft',()=>{
 assert.equal(oldPack.units.length,51);
 assert.equal(oldPack.units.reduce((n,u)=>n+stages.reduce((a,k)=>a+u[k].length,0),0),572);
 assert.equal(combined.units.length,52);
 assert.equal(combined.units.filter(u=>u.subject==='353').length,23);
 assert.equal(combined.units.reduce((n,u)=>n+stages.reduce((a,k)=>a+u[k].length,0),0),584);
 assert.equal(digest(oldPack),originalDigest);
 assert.equal(unit.id,'353-inference-ci-hypothesis-foundation');
 assert.equal(unit.mapping[0],'STAT02');
 assert.equal(unit.reviewRecord.expertApproved,false);
 assert.equal(unit.reviewRecord.publicRelease,false);
 assert.equal(unit.distribution,'held-pending-review');
 assert.deepEqual(E.validate(combined),[]);
 assert.deepEqual(validateObjectives(combined),[]);
 assert(E.validate(combined,true).includes('release-blocked'));
 assert.equal(new Set(all.map(q=>q.id)).size,12);
});
test('complete from-zero four-section, recall and assessment pipeline is preserved',()=>{
 assert.equal(unit.explanation.split('\n\n').length,4);
 assert.equal(unit.learningObjectives.length,4);
 assert.equal(unit.teachingSections.length,4);
 assert.equal(unit.recall.length,4);
 assert.equal(unit.rubric.length,4);
 for(const g of stages)assert.equal(unit[g].length,4);
 for(const prereq of unit.prerequisites)assert(oldPack.units.some(u=>u.id===prereq),'Missing prerequisite '+prereq);
 for(const [i,o] of unit.learningObjectives.entries()){
  assert.deepEqual(o.teachingSectionIds,['section-'+(i+1)]);
  assert.deepEqual(o.recallIndexes,[i]);
  assert.equal(o.questionIds.length,3);
  assert(o.questionIds.every(id=>all.some(q=>q.id===id)));
 }
});
test('recalculate four interval and z-statistic values without using authored answers',()=>{
 const rows=[['a2',1.96*(4/Math.sqrt(16)),'分钟'],
  ['a3',20-1.96*4/Math.sqrt(16),'分钟'],
  ['d2',(20-18)/(4/Math.sqrt(16)),'无量纲'],
  ['d3',20+1.96*4/Math.sqrt(16),'分钟']];
 assert.equal(all.filter(x=>x.type==='number').length,4);
 for(const [id,result,u] of rows){
  const q=get(id);
  assert(q&&q.type==='number');
  assert.equal(q.unit,u);
  assert(Math.abs(q.answer-result)<1e-12,id);
  assert.equal(E.grade(q,{value:result,unit:u}).correct,true);
  assert.equal(E.grade(q,{value:result+0.05,unit:u}).correct,false);
  assert.equal(E.grade(q,{value:result,unit:'错误单位'}).correct,false);
  assert.equal(E.grade(q,{value:NaN,unit:u}).correct,false);
 }
});
test('single choice keys valid, no duplicate options, subjective remains reference-only',()=>{
 assert.equal(all.filter(x=>x.type==='subjective').length,2);
 for(const q of all){
  assert(q.stem.length>=16,q.id);
  assert(q.explanation.length>=20,q.id);
  const grade=E.grade(q,q.type==='number'?{value:q.answer,unit:q.unit}:q.answer);
  if(q.type==='subjective'){
   assert.equal(grade.method,'reference-only');assert.equal(grade.correct,null);assert.equal(grade.score,null);
   assert(q.rubric.length>=4);
  }else{
   assert.equal(grade.method,'objective');assert.equal(grade.correct,true);assert.equal(grade.score,1);
   if(q.options)assert.equal(new Set(q.options.map(x=>x.normalize('NFKC').trim())).size,q.options.length);
  }
 }
});
test('scientific interpretation caveats and unresolved exam-year boundaries are preserved',()=>{
 assert.equal(unit.scopeStatus,'provisional-2027-outline-partial');
 assert(unit.conditions.includes('σ未知'));
 assert(unit.conditions.includes('非真实医学统计建议'));
 assert(unit.definition.includes('p值'));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('2028')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('虚构')));
 assert(unit.sources.some(x=>x.includes('stat.psu.edu')));
 assert(unit.sources.some(x=>x.includes('nist.gov')));
});
