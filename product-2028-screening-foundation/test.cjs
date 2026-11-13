'use strict';
const {test}=require('node:test'),assert=require('assert/strict'),crypto=require('crypto');
const E=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const original=require('../product-2028-diagnostic-v5/.build/representative-courses.json');
const pending=require('./unit.json');
const u=pending.units[0],combined={...structuredClone(original),units:[...original.units,u]};
const GROUPS=['basicQuestions','applicationQuestions','delayedQuestions'];
const all=GROUPS.flatMap(g=>u[g]||[]);
const fingerprint=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const originalDigest=fingerprint(original);
function byId(id){const q=all.find(q=>q.id===id);assert(q,'Question not found: '+id);return q;}
test('one original 353 source-grounded lesson exists as isolated 12-question draft without altering 47 courses',()=>{
 assert.equal(pending.units.length,1);
 assert.equal(u.id,'353-screening-test-foundation');
 assert.equal(u.subject,'353');
 assert.equal(u.reviewRecord.expertApproved,false);
 assert.equal(u.reviewRecord.publicRelease,false);
 assert.equal(u.distribution,'held-pending-review');
 assert.equal(u.scopeStatus,'provisional-2027-outline-partial');
 assert.equal(u.sources.length,4);
 assert.equal(combined.units.length,48);
 assert.equal(combined.units.filter(x=>x.subject==='353').length,19);
 assert.equal(all.length,12);
 assert.equal(combined.units.reduce((n,x)=>n+GROUPS.reduce((k,g)=>k+x[g].length,0),0),536);
 assert.equal(fingerprint(original),originalDigest,'Original 47-unit pack was altered');
 assert.deepEqual(E.validate(combined),[]);
 assert.deepEqual(validateObjectives(combined),[]);
 assert(E.validate(combined,true).includes('release-blocked'));
 assert.equal(new Set(all.map(q=>q.id)).size,12);
});
test('lesson explanation has structured teaching sections, explicit prerequisites and staged objective links',()=>{
 assert.equal(u.explanation.split('\n\n').length,4);
 assert.equal(u.teachingSections.length,4);
 assert.equal(u.learningObjectives.length,4);
 assert.equal(u.recall.length,4);
 for(const id of u.prerequisites)assert(original.units.some(x=>x.id===id),'Missing frozen prerequisite '+id);
 for(const [i,obj] of u.learningObjectives.entries()){
  assert.equal(obj.questionIds.length,3);
  assert(obj.questionIds.every(id=>all.some(q=>q.id===id)));
  assert.deepEqual(obj.recallIndexes,[i]);
  assert.deepEqual(obj.teachingSectionIds,['section-'+(i+1)]);
 }
 for(const g of GROUPS)assert.equal(u[g].length,4);
 assert(!/确诊所有|必能确诊|能够完全保证/.test(u.definition));
});
test('independent 2x2 table recomputes 4 authored numerical answers and verifies unit grading',()=>{
 const cases=[
  {id:'a2',expected:90/(90+10),label:'sensitivity'},
  {id:'a3',expected:90/(90+45),label:'positive predictive value'},
  {id:'d2',expected:152/(152+8),label:'specificity'},
  {id:'d3',expected:36/(36+8),label:'positive predictive value delayed'}
 ];
 for(const x of cases){
  const q=byId('353-screening-test-foundation-'+x.id);
  assert.equal(q.type,'number');
  assert.equal(q.unit,'无量纲');
  assert(Math.abs(q.answer-x.expected)<1e-12,x.label);
  assert.equal(E.grade(q,{value:x.expected,unit:q.unit}).correct,true);
  assert.equal(E.grade(q,{value:x.expected+.05,unit:q.unit}).correct,false);
  assert.equal(E.grade(q,{value:x.expected,unit:'%'}).correct,false);
  assert.equal(E.grade(q,{value:NaN,unit:q.unit}).correct,false);
 }
});
test('all categorical keys are unambiguous; subjective reference is never machine-scored',()=>{
 for(const q of all){
  assert(typeof q.stem==='string'&&q.stem.length>12);
  assert(typeof q.explanation==='string'&&q.explanation.length>20);
  const ans=E.grade(q,q.type==='number'?{value:q.answer,unit:q.unit}:q.answer);
  if(q.type==='subjective'){
   assert.equal(ans.method,'reference-only');assert.equal(ans.correct,null);assert.equal(ans.score,null);
   assert(q.rubric.length>=4);
  } else{
   assert.equal(ans.method,'objective');assert.equal(ans.correct,true);assert.equal(ans.score,1);
   if(q.type==='single')assert.equal(new Set(q.options.map(x=>x.trim())).size,q.options.length);
  }
 }
 assert.equal(all.filter(q=>q.type==='subjective').length,2);
 assert.equal(all.filter(q=>q.type==='number').length,4);
});
test('lesson cannot be silently promoted as official, expert approved or a complete EPI08 chapter',()=>{
 assert(u.reviewRecord.limitations.some(x=>x.includes('2028')));
 assert(u.reviewRecord.limitations.some(x=>x.includes('ROC')));
 assert(u.conditions.includes('不等于覆盖2027'));
 assert(u.authorship.includes('自编练习'));
 assert.equal(u.mapping.length,1);
 assert.equal(u.mapping[0],'EPI08');
 assert.equal(u.sources[0],'https://vsph.tsinghua.edu.cn/info/1025/2775.htm');
});
