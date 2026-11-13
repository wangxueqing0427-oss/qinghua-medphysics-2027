'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const original=require('../product-2028-radiation-49/.build/representative-courses.json');
const course=require('./unit.json'),unit=course.units[0];
const stages=['basicQuestions','applicationQuestions','delayedQuestions'],items=stages.flatMap(g=>unit[g]);
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const old=digest(original);
const combined={...original,units:[...original.units,unit]};
const get=id=>items.find(q=>q.id===unit.id+'-'+id);
test('new nuclear imaging lesson is a 50th isolated course without changing previous 49-course content',()=>{
 assert.equal(original.units.length,49);
 assert.equal(original.units.reduce((n,u)=>n+stages.reduce((a,g)=>a+u[g].length,0),0),548);
 assert.equal(unit.id,'353-nuclear-imaging-foundation');
 assert.equal(unit.mapping[0],'MP03');
 assert.equal(combined.units.length,50);
 assert.equal(combined.units.filter(u=>u.subject==='353').length,21);
 assert.equal(combined.units.reduce((n,u)=>n+stages.reduce((a,g)=>a+u[g].length,0),0),560);
 assert.equal(digest(original),old);
 assert.deepEqual(E.validate(combined),[]);
 assert.deepEqual(validateObjectives(combined),[]);
 assert(E.validate(combined,true).includes('release-blocked'));
 assert.equal(new Set(items.map(q=>q.id)).size,12);
 assert.equal(unit.reviewRecord.expertApproved,false);
 assert.equal(unit.reviewRecord.publicRelease,false);
 assert.equal(unit.distribution,'held-pending-review');
});
test('lesson has full from-zero progression and real prerequisites, four teaching sections and all twelve question mappings',()=>{
 assert.equal(unit.explanation.split('\n\n').length,4);
 assert.equal(unit.teachingSections.length,4);
 assert.equal(unit.learningObjectives.length,4);
 assert.equal(unit.recall.length,4);
 assert.equal(unit.rubric.length,4);
 for(const s of stages)assert.equal(unit[s].length,4);
 for(const req of unit.prerequisites)assert(original.units.some(u=>u.id===req));
 for(const [i,obj] of unit.learningObjectives.entries()){
   assert.deepEqual(obj.teachingSectionIds,['section-'+(i+1)]);
   assert.deepEqual(obj.recallIndexes,[i]);
   assert.equal(obj.questionIds.length,3);
   assert(obj.questionIds.every(id=>items.some(q=>q.id===id)));
 }
 assert(unit.definition.includes('SPECT'));
 assert(unit.definition.includes('PET'));
});
test('calculate four distinct nuclear-imaging teaching values independently of stored answers',()=>{
 const cases=[
   ['a2',64*Math.pow(.5,6/3),'MBq'],
   ['a3',511+511,'keV'],
   ['d2',800/40,'次/s'],
   ['d3',.75*1e6,'Bq']
 ];
 assert.equal(items.filter(q=>q.type==='number').length,4);
 for(const [id,v,u] of cases){
   const question=get(id);
   assert(question&&question.type==='number');
   assert.equal(question.unit,u);
   assert(Math.abs(question.answer-v)<1e-10,id);
   assert.equal(E.grade(question,{value:v,unit:u}).correct,true);
   assert.equal(E.grade(question,{value:v+Math.max(.05,Math.abs(v)*.01),unit:u}).correct,false);
   assert.equal(E.grade(question,{value:v,unit:'错误单位'}).correct,false);
   assert.equal(E.grade(question,{value:NaN,unit:u}).correct,false);
 }
});
test('objective and subjective questions have safe grading boundaries and nonduplicate distractors',()=>{
 assert.equal(items.filter(q=>q.type==='subjective').length,2);
 for(const q of items){
   assert(q.stem.length>=16);
   assert(q.explanation.length>=20);
   const result=E.grade(q,q.type==='number'?{value:q.answer,unit:q.unit}:q.answer);
   if(q.type==='subjective'){
     assert.equal(result.method,'reference-only');
     assert.equal(result.correct,null);
     assert.equal(result.score,null);
     assert(q.rubric.length>=4);
   }else{
     assert.equal(result.method,'objective');
     assert.equal(result.correct,true);
     assert.equal(result.score,1);
     if(q.options)assert.equal(new Set(q.options.map(x=>x.normalize('NFKC').trim())).size,q.options.length);
   }
 }
});
test('explicitly refuses to claim diagnosis, expert approval, real isotope selection or full 2028 syllabus coverage',()=>{
 assert.equal(unit.scopeStatus,'provisional-2027-outline-partial');
 assert(unit.conditions.includes('不用于药物选择'));
 assert(unit.conditions.includes('不用于')||unit.conditions.includes('不用'));
 assert(unit.conditions.includes('不等于体内有效清除'));
 assert(unit.reviewRecord.limitations.some(s=>s.includes('2028')));
 assert(unit.sources.some(s=>s.includes('iaea.org')));
 assert(unit.sources.some(s=>s.includes('nibib.nih.gov')));
 assert(unit.sources.some(s=>s.includes('health.nih.gov')));
});
