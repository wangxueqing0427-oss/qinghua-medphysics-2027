'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const original=require('../product-2028-screening-48/.build/representative-courses.json');
const draft=require('./unit.json');
const unit=draft.units[0];
const groups=['basicQuestions','applicationQuestions','delayedQuestions'];
const all=groups.flatMap(k=>unit[k]);
const sha=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const originalHash=sha(original);
const combined={...original,units:[...original.units,unit]};
const get=id=>all.find(q=>q.id==='353-radiation-protection-foundation-'+id);
test('new original unit preserves complete 48-course V6 and follows frozen schema and revision protection',()=>{
 assert.equal(original.units.length,48);
 assert.equal(original.units.reduce((n,u)=>n+groups.reduce((a,k)=>a+u[k].length,0),0),536);
 assert.equal(combined.units.length,49);
 assert.equal(combined.units.filter(u=>u.subject==='353').length,20);
 assert.equal(combined.units.reduce((n,u)=>n+groups.reduce((a,k)=>a+u[k].length,0),0),548);
 assert.equal(unit.id,'353-radiation-protection-foundation');
 assert.equal(unit.mapping[0],'MP02');
 assert.equal(unit.distribution,'held-pending-review');
 assert.equal(unit.reviewRecord.expertApproved,false);
 assert.equal(unit.reviewRecord.publicRelease,false);
 assert.equal(unit.scopeStatus,'provisional-2027-outline-partial');
 assert.equal(sha(original),originalHash);
 assert.deepEqual(E.validate(combined),[]);
 assert.deepEqual(validateObjectives(combined),[]);
 assert(E.validate(combined,true).includes('release-blocked'));
 assert.equal(new Set(all.map(x=>x.id)).size,12);
});
test('4 concepts have 4 complete teaching paragraphs, closed-book recall and all 12 question links',()=>{
 assert.equal(unit.explanation.split('\n\n').length,4);
 assert.equal(unit.teachingSections.length,4);
 assert.equal(unit.learningObjectives.length,4);
 assert.equal(unit.recall.length,4);
 assert.equal(unit.rubric.length,4);
 assert(unit.prerequisites.every(id=>original.units.some(u=>u.id===id)));
 assert(unit.sources.length>=5);
 for(const g of groups)assert.equal(unit[g].length,4);
 for(let i=0;i<4;i++){
  const o=unit.learningObjectives[i];
  assert.equal(o.questionIds.length,3);
  assert.deepEqual(o.recallIndexes,[i]);
  assert.deepEqual(o.teachingSectionIds,['section-'+(i+1)]);
  assert(o.questionIds.every(id=>all.some(q=>q.id===id)));
 }
});
test('four independently calculated numeric teaching models match author answers and grading',()=>{
 const samples=[
  ['a2',0.012/0.006,'Gy'], // J/kg
  ['a3',0.8*(1/2)**2,'μSv/h'], // ideal inverse square
  ['d2',0.12*2.5,'μSv'], // constant rate times time
  ['d3',8*(1/2)**2,'μGy/h'] // two ideal HVLs
 ];
 assert.equal(all.filter(x=>x.type==='number').length,4);
 for(const [id,expected,unitName] of samples){
  const question=get(id);
  assert(question&&question.type==='number');
  assert.equal(question.unit,unitName);
  assert(Math.abs(question.answer-expected)<1e-12);
  assert.equal(E.grade(question,{value:expected,unit:unitName}).correct,true);
  assert.equal(E.grade(question,{value:expected+0.05,unit:unitName}).correct,false);
  assert.equal(E.grade(question,{value:expected,unit:'无量纲'}).correct,false);
  assert.equal(E.grade(question,{value:NaN,unit:unitName}).correct,false);
 }
});
test('objective keys and written-answer machine grading remain safe',()=>{
 assert.equal(all.filter(q=>q.type==='subjective').length,2);
 for(const question of all){
  assert(typeof question.stem==='string'&&question.stem.length>12);
  assert(typeof question.explanation==='string'&&question.explanation.length>20);
  const answer=E.grade(question,question.type==='number'?{value:question.answer,unit:question.unit}:question.answer);
  if(question.type==='subjective'){
   assert.equal(answer.method,'reference-only');
   assert.equal(answer.correct,null);
   assert.equal(answer.score,null);
   assert(question.rubric.length>=4);
  }else{
   assert.equal(answer.method,'objective');
   assert.equal(answer.correct,true);
   assert.equal(answer.score,1);
   if(question.options)assert.equal(new Set(question.options.map(s=>s.trim())).size,question.options.length);
  }
 }
});
test('safety-sensitive medical and operational claims remain explicit draft limitations',()=>{
 assert(unit.conditions.includes('不用于实际医院辐射安全'));
 assert(unit.conditions.includes('尚不覆盖'));
 assert(unit.authorship.includes('非临床规程'));
 assert(unit.explanation.includes('患者为医学目的'));
 assert(unit.explanation.includes('真实放射设备'));
 assert(unit.explanation.includes('不能直接套用'));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('2028')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('中国辐射安全法律合规')));
 assert(unit.sources.some(x=>x.includes('icrp.org')));
 assert(unit.sources.some(x=>x.includes('nrc.gov')));
});
