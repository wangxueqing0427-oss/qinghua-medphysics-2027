'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const oldPack=require('../product-2028-v14-additive/.build/representative-courses.json');
const unit=require('./unit.json').units[0],groups=['basicQuestions','applicationQuestions','delayedQuestions'];
const questions=groups.flatMap(k=>unit[k]);
const pack={...oldPack,contentVersion:'qh2028-evidence-meta-56-v15-internal-draft',units:[...oldPack.units,unit]};
const q=id=>questions.find(x=>x.id===unit.id+'-'+id);
test('append exactly one EPI11 lesson and preserve 55 earlier units and full release block',()=>{
 assert.equal(oldPack.units.length,55);
 assert.equal(oldPack.units.reduce((n,u)=>n+groups.reduce((x,k)=>x+u[k].length,0),0),620);
 assert.equal(pack.units.length,56);
 assert.equal(pack.units.filter(x=>x.subject==='353').length,27);
 assert.equal(pack.units.reduce((n,u)=>n+groups.reduce((x,k)=>x+u[k].length,0),0),632);
 assert.deepEqual(pack.units.slice(0,55),oldPack.units);
 assert.deepEqual(E.validate(pack),[]);
 assert.deepEqual(validateObjectives(pack),[]);
 assert(E.validate(pack,true).includes('release-blocked'),'Unapproved lesson cannot be released');
 assert.equal(unit.mapping[0],'EPI11');
 assert.equal(unit.reviewRecord.expertApproved,false);
 assert.equal(unit.reviewRecord.publicRelease,false);
 assert.equal(unit.distribution,'held-pending-review');
});
test('prior concepts and PICO, bias, meta methods form complete standalone four-stage curriculum',()=>{
 assert.equal(unit.explanation.split('\n\n').length,4);
 assert.equal(unit.learningObjectives.length,4);
 assert.equal(unit.teachingSections.length,4);
 assert.equal(unit.recall.length,4);
 assert.equal(unit.rubric.length,4);
 for(const k of groups)assert.equal(unit[k].length,4);
 assert.equal(new Set(questions.map(x=>x.id)).size,12);
 assert(unit.prerequisites.every(x=>oldPack.units.some(u=>u.id===x)),'Unresolved prerequisite');
 for(const [i,o] of unit.learningObjectives.entries()){
  assert.deepEqual(o.teachingSectionIds,['section-'+(i+1)]);
  assert.deepEqual(o.recallIndexes,[i]);
  assert.equal(o.questionIds.length,3);
  assert(o.questionIds.every(x=>questions.some(q=>q.id===x)));
 }
});
test('independently recompute four original inverse-variance, Q and I-squared exercises',()=>{
 const weights=[1/(0.5**2),1/(1**2)], pooled=(weights[0]*1+weights[1]*3)/(weights[0]+weights[1]);
 const Q=weights[0]*(1-pooled)**2+weights[1]*(3-pooled)**2;
 const I2=Math.max(0,(Q-(2-1))/Q)*100;
 const cases=[['a2',weights[0],'无量纲'],['a3',pooled,'无量纲'],['d2',Q,'无量纲'],['d3',I2,'%']];
 assert.equal(questions.filter(x=>x.type==='number').length,4);
 for(const [suffix,v,units] of cases){
  const x=q(suffix);assert(x&&x.type==='number',suffix);
  assert.equal(x.unit,units);
  assert(Math.abs(x.answer-v)<1e-8,suffix);
  assert.equal(E.grade(x,{value:v,unit:units}).correct,true);
  assert.equal(E.grade(x,{value:v+0.5,unit:units}).correct,false);
  assert.equal(E.grade(x,{value:v,unit:'错误单位'}).correct,false);
  assert.equal(E.grade(x,{value:NaN,unit:units}).correct,false);
 }
});
test('two explanatory subjective tasks remain reference-only and the other ten are objectively graded',()=>{
 assert.equal(questions.filter(x=>x.type==='subjective').length,2);
 for(const x of questions){
  assert(x.stem.length>=16,x.id);
  assert(x.explanation.length>=20,x.id);
  const grade=E.grade(x,x.type==='number'?{value:x.answer,unit:x.unit}:x.answer);
  if(x.type==='subjective'){
   assert.equal(grade.method,'reference-only');
   assert.equal(grade.correct,null);
   assert.equal(grade.score,null);
   assert(x.rubric.length>=4);
  }else{
   assert.equal(grade.method,'objective');
   assert.equal(grade.correct,true);
   assert.equal(grade.score,1);
   if(x.options)assert.equal(new Set(x.options.map(t=>t.normalize('NFKC').trim())).size,x.options.length);
  }
 }
});
test('Cochrane and 2027 syllabus references, clinical boundaries and absent 2028/expert approval stay explicit',()=>{
 assert(unit.sources.some(x=>x.includes('cochrane.org')));
 assert(unit.sources.some(x=>x.includes('prisma-statement.org')));
 assert(unit.sources.some(x=>x.includes('vsph.tsinghua.edu.cn')));
 assert(unit.conditions.includes('完全虚构'));
 assert(unit.conditions.includes('不得用于真实医学'));
 assert(unit.conditions.includes('两项研究时I²'));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('2028')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('专家')));
 assert(unit.explanation.includes('PRISMA'));
 assert(unit.explanation.includes('PICO'));
 assert(unit.explanation.includes('发表偏倚'));
 assert.equal(unit.scopeStatus,'provisional-2027-outline-partial');
});
