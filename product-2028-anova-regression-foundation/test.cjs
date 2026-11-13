'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const oldPack=require('../product-2028-v13-additive/.build/representative-courses.json');
const unit=require('./unit.json').units[0],groups=['basicQuestions','applicationQuestions','delayedQuestions'];
const questions=groups.flatMap(k=>unit[k]);
const pack={...oldPack,contentVersion:'qh2028-stat03-55-v14-internal-draft',units:[...oldPack.units,unit]};
const q=id=>questions.find(x=>x.id===unit.id+'-'+id);
test('append exactly one STAT03 lesson, 12 original exercises and preserve 54 earlier units',()=>{
 assert.equal(oldPack.units.length,54);
 assert.equal(oldPack.units.reduce((n,u)=>n+groups.reduce((x,k)=>x+u[k].length,0),0),608);
 assert.equal(pack.units.length,55);
 assert.equal(pack.units.filter(x=>x.subject==='353').length,26);
 assert.equal(pack.units.reduce((n,u)=>n+groups.reduce((x,k)=>x+u[k].length,0),0),620);
 assert.deepEqual(pack.units.slice(0,54),oldPack.units);
 assert.deepEqual(E.validate(pack),[]);
 assert.deepEqual(validateObjectives(pack),[]);
 assert(E.validate(pack,true).includes('release-blocked'),'Public release cannot be auto-approved');
 assert.equal(unit.mapping[0],'STAT03');
 assert.equal(unit.reviewRecord.expertApproved,false);
 assert.equal(unit.reviewRecord.publicRelease,false);
 assert.equal(unit.distribution,'held-pending-review');
});
test('all prerequisite IDs, four teaching passages, four recalls and 12 uniquely mapped assessments',()=>{
 assert.equal(unit.explanation.split('\n\n').length,4);
 assert.equal(unit.learningObjectives.length,4);
 assert.equal(unit.teachingSections.length,4);
 assert.equal(unit.recall.length,4);
 assert.equal(unit.rubric.length,4);
 for(const k of groups)assert.equal(unit[k].length,4);
 assert.equal(new Set(questions.map(x=>x.id)).size,12);
 assert(unit.prerequisites.every(x=>oldPack.units.some(u=>u.id===x)));
 for(const [i,o] of unit.learningObjectives.entries()){
  assert.deepEqual(o.teachingSectionIds,['section-'+(i+1)]);
  assert.deepEqual(o.recallIndexes,[i]);
  assert.equal(o.questionIds.length,3);
  assert(o.questionIds.every(x=>questions.some(q=>q.id===x)));
 }
});
test('recompute four unrelated formulas from raw inputs with strict answer units',()=>{
 const rows=[['a2',12/3,'无量纲'],['a3',40*30/100,'人'],
  ['d2',5+2*3,'分'],['d3',Math.exp(Math.log(2)),'倍']];
 assert.equal(questions.filter(q=>q.type==='number').length,4);
 for(const [id,v,unitName] of rows){
  const item=q(id);assert(item&&item.type==='number',id);
  assert.equal(item.unit,unitName);
  assert(Math.abs(item.answer-v)<1e-10,id);
  assert.equal(E.grade(item,{value:v,unit:unitName}).correct,true);
  assert.equal(E.grade(item,{value:v+1,unit:unitName}).correct,false);
  assert.equal(E.grade(item,{value:v,unit:'错误单位'}).correct,false);
  assert.equal(E.grade(item,{value:NaN,unit:unitName}).correct,false);
 }
});
test('subjective questions cannot auto-score; objective answers and distractors valid',()=>{
 assert.equal(questions.filter(x=>x.type==='subjective').length,2);
 for(const item of questions){
  assert(item.stem.length>=16,item.id);
  assert(item.explanation.length>=20,item.id);
  const grade=E.grade(item,item.type==='number'?{value:item.answer,unit:item.unit}:item.answer);
  if(item.type==='subjective'){
   assert.equal(grade.method,'reference-only');
   assert.equal(grade.correct,null);
   assert.equal(grade.score,null);
   assert(item.rubric.length>=4);
  }else{
   assert.equal(grade.method,'objective');
   assert.equal(grade.correct,true);
   assert.equal(grade.score,1);
   if(item.options)assert.equal(new Set(item.options.map(x=>x.normalize('NFKC').trim())).size,item.options.length);
  }
 }
});
test('source citations, 2028 uncertainty, medical application boundaries remain explicit',()=>{
 assert(unit.sources.some(x=>x.includes('stat.psu.edu')));
 assert(unit.sources.some(x=>x.includes('ucla.edu')));
 assert(unit.sources.some(x=>x.includes('vsph.tsinghua.edu.cn')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('2028')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('专家')));
 assert(unit.conditions.includes('不是真实')||unit.conditions.includes('不是真实')||unit.conditions.includes('不是真实')||unit.conditions.includes('不是独立专业统计审稿'));
 assert(unit.explanation.includes('OR'));
 assert(unit.explanation.includes('R²'));
 assert.equal(unit.scopeStatus,'provisional-2027-outline-partial');
});
