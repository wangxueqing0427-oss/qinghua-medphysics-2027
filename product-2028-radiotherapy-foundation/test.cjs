'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const oldPack=require('../product-2028-nuclear-50/.build/representative-courses.json');
const draft=require('./unit.json'),unit=draft.units[0];
const stages=['basicQuestions','applicationQuestions','delayedQuestions'],all=stages.flatMap(g=>unit[g]);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const originalDigest=digest(oldPack),combined={...oldPack,units:[...oldPack.units,unit]};
const get=s=>all.find(x=>x.id==='353-radiotherapy-physics-foundation-'+s);
test('51st original radiotherapy lesson retains all 50 prior courses/560 questions unchanged',()=>{
 assert.equal(oldPack.units.length,50);
 assert.equal(oldPack.units.reduce((n,u)=>n+stages.reduce((a,k)=>a+u[k].length,0),0),560);
 assert.equal(combined.units.length,51);
 assert.equal(combined.units.filter(u=>u.subject==='353').length,22);
 assert.equal(combined.units.reduce((n,u)=>n+stages.reduce((a,k)=>a+u[k].length,0),0),572);
 assert.equal(digest(oldPack),originalDigest);
 assert.equal(unit.id,'353-radiotherapy-physics-foundation');
 assert.equal(unit.mapping[0],'MP04');
 assert.equal(unit.reviewRecord.expertApproved,false);
 assert.equal(unit.reviewRecord.publicRelease,false);
 assert.equal(unit.distribution,'held-pending-review');
 assert.deepEqual(E.validate(combined),[]);
 assert.deepEqual(validateObjectives(combined),[]);
 assert(E.validate(combined,true).includes('release-blocked'));
 assert.equal(new Set(all.map(q=>q.id)).size,12);
});
test('four from-zero sections, four recall targets and 12 unique objective links remain valid',()=>{
 assert.equal(unit.explanation.split('\n\n').length,4);
 assert.equal(unit.learningObjectives.length,4);
 assert.equal(unit.teachingSections.length,4);
 assert.equal(unit.recall.length,4);
 assert.equal(unit.rubric.length,4);
 for(const g of stages)assert.equal(unit[g].length,4);
 for(const prereq of unit.prerequisites)assert(oldPack.units.some(u=>u.id===prereq));
 for(const [i,o] of unit.learningObjectives.entries()){
  assert.deepEqual(o.teachingSectionIds,['section-'+(i+1)]);
  assert.deepEqual(o.recallIndexes,[i]);
  assert.equal(o.questionIds.length,3);
  assert(o.questionIds.every(id=>all.some(q=>q.id===id)));
 }
});
test('four independent arithmetic questions: fractions, DVH volume, cGy conversion, cumulative dose',()=>{
 const rows=[['a2',18/9,'Gy/分次'],['a3',25/100*100,'%'],['d2',150/100,'Gy'],['d3',1.5*8,'Gy']];
 assert.equal(all.filter(x=>x.type==='number').length,4);
 for(const [id,result,unitName] of rows){
  const q=get(id);assert(q&&q.type==='number',id);
  assert.equal(q.unit,unitName);
  assert(Math.abs(q.answer-result)<1e-12);
  assert.equal(E.grade(q,{value:result,unit:unitName}).correct,true);
  assert.equal(E.grade(q,{value:result+.05,unit:unitName}).correct,false);
  assert.equal(E.grade(q,{value:result,unit:'Sv'}).correct,false);
  assert.equal(E.grade(q,{value:NaN,unit:unitName}).correct,false);
 }
});
test('all graded answer keys are valid; subjective answers always remain unscored',()=>{
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
test('no clinical dose planning, medical certification or fabricated syllabus coverage',()=>{
 assert.equal(unit.scopeStatus,'provisional-2027-outline-partial');
 assert(unit.conditions.includes('不用于患者靶区勾画'));
 assert(unit.conditions.includes('MU计算'));
 assert(unit.conditions.includes('剂量约束判断'));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('2028')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('虚构数据')));
 assert(unit.sources.some(x=>x.includes('cancer.gov')));
 assert(unit.sources.some(x=>x.includes('pmc.ncbi.nlm.nih.gov')));
});
