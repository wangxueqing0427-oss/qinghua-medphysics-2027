'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const base=require('../product-2028-v12-additive/.build/representative-courses.json');
const unit=require('./unit.json').units[0];
const groups=['basicQuestions','applicationQuestions','delayedQuestions'];
const questions=groups.flatMap(k=>unit[k]);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const baseHash=digest(base);
const pack={...base,contentVersion:'qh2028-outbreak-54-v13-internal-draft',units:[...base.units,unit]};
const get=suffix=>questions.find(q=>q.id===unit.id+'-'+suffix);
test('append outbreak fundamentals without rewriting any of 53 previous courses',()=>{
 assert.equal(base.units.length,53);
 assert.equal(base.units.reduce((n,u)=>n+groups.reduce((m,k)=>m+u[k].length,0),0),596);
 assert.equal(pack.units.length,54);
 assert.equal(pack.units.filter(u=>u.subject==='353').length,25);
 assert.equal(pack.units.reduce((n,u)=>n+groups.reduce((m,k)=>m+u[k].length,0),0),608);
 assert.deepEqual(pack.units.slice(0,53),base.units);
 assert.equal(digest(base),baseHash);
 assert.deepEqual(E.validate(pack),[]);
 assert.deepEqual(validateObjectives(pack),[]);
 assert(E.validate(pack,true).includes('release-blocked'));
 assert.equal(unit.mapping[0],'EPI09');
 assert.equal(unit.distribution,'held-pending-review');
 assert.equal(unit.reviewRecord.expertApproved,false);
 assert.equal(unit.reviewRecord.publicRelease,false);
});
test('4 complete conceptual sections, learning objectives, recall prompts and 12 unique questions',()=>{
 assert.equal(unit.explanation.split('\n\n').length,4);
 assert.equal(unit.teachingSections.length,4);
 assert.equal(unit.recall.length,4);
 assert.equal(unit.learningObjectives.length,4);
 assert.equal(unit.rubric.length,4);
 for(const k of groups)assert.equal(unit[k].length,4);
 assert.equal(new Set(questions.map(x=>x.id)).size,12);
 assert(unit.prerequisites.every(id=>base.units.some(x=>x.id===id)));
 for(const [i,g] of unit.learningObjectives.entries()){
  assert.deepEqual(g.teachingSectionIds,['section-'+(i+1)]);
  assert.deepEqual(g.recallIndexes,[i]);
  assert.equal(g.questionIds.length,3);
  assert(g.questionIds.every(id=>questions.some(x=>x.id===id)));
 }
});
test('independently recompute each attack proportion, secondary proportion and risk ratio with strict units',()=>{
 const rows=[['a2',24/120*100,'%'],['a3',18/60*100,'%'],
  ['d2',9/(45-9)*100,'%'],['d3',(12/40)/(4/40),'倍']];
 assert.equal(questions.filter(q=>q.type==='number').length,4);
 for(const [suffix,v,unitName] of rows){
  const q=get(suffix);
  assert(q&&q.type==='number',suffix);
  assert.equal(q.unit,unitName);
  assert(Math.abs(q.answer-v)<1e-11,suffix);
  assert.equal(E.grade(q,{value:v,unit:unitName}).correct,true);
  assert.equal(E.grade(q,{value:v+1,unit:unitName}).correct,false);
  assert.equal(E.grade(q,{value:v,unit:'错误单位'}).correct,false);
  assert.equal(E.grade(q,{value:Number.NaN,unit:unitName}).correct,false);
 }
});
test('objective keys grade correctly, subjective answers never pretend to be auto-graded',()=>{
 assert.equal(questions.filter(q=>q.type==='subjective').length,2);
 for(const q of questions){
  assert(q.stem.length>=16,q.id);
  assert(q.explanation.length>=16,q.id);
  const grade=E.grade(q,q.type==='number'?{value:q.answer,unit:q.unit}:q.answer);
  if(q.type==='subjective'){
   assert.equal(grade.method,'reference-only');
   assert.equal(grade.correct,null);
   assert.equal(grade.score,null);
   assert(q.rubric.length>=4);
  }else{
   assert.equal(grade.method,'objective');
   assert.equal(grade.correct,true);
   if(q.options)assert.equal(new Set(q.options.map(x=>x.trim())).size,q.options.length);
  }
 }
});
test('protect clinical privacy, real-world outbreak decision boundaries and no fake 2028 approval',()=>{
 assert(unit.conditions.includes('不用于实际疫情判定'));
 assert(unit.conditions.includes('不用于')||unit.conditions.includes('不能'));
 assert(unit.explanation.includes('个人资料'));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('2028')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('虚构')));
 assert(unit.reviewRecord.limitations.some(x=>x.includes('中国')));
 assert(unit.sources.some(x=>x.includes('cdc.gov')));
 assert(unit.sources.some(x=>x.includes('vsph.tsinghua.edu.cn')));
 assert.equal(unit.scopeStatus,'provisional-2027-outline-partial');
});
