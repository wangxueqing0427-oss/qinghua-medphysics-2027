'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const {audit,compute,ensureCases}=require('./recompute.cjs');
const cases=require('./numeric-cases.json');
const pack=require('../product-2028-diagnostic-v5/.build/representative-courses.json');
const clone=x=>structuredClone(x);
function firstMatching(p,id){
 for(const u of p.units)for(const group of ['basicQuestions','applicationQuestions','delayedQuestions']){
  const q=u[group].find(x=>x.id===id);
  if(q)return q;
 }
 throw Error('Missing test item '+id);
}
test('all 39 numerical answers are independently recomputed, including early catalog cases',()=>{
 ensureCases(cases);
 const r=audit(pack);
 assert.equal(r.passed,true,'Errors: '+r.errors.join(','));
 assert.equal(r.numericTotal,39);
 assert.equal(r.verified,39);
 assert.equal(r.rows.length,39);
 assert.equal(r.nonNumeric353QuestionsAwaitingFactReview,165);
 assert.equal(r.independentExpertSignoffs,0);
 assert.equal(r.generalScientificCorrectnessApproved,false);
 assert.equal(r.formalReleaseApproved,false);
 assert.equal(r.formal2028SyllabusVerified,false);
 assert.equal(new Set(r.rows.map(x=>x.id)).size,39);
 assert(r.rows.every(x=>x.independentlyRecomputed===true&&x.subjectMatterCertified===false));
 assert(r.rows.some(x=>x.id==='risk-delay-1'));
 assert(r.rows.some(x=>x.id==='epi-pt-d1'));
 assert(r.rows.some(x=>x.id==='353-probability-binomial-foundation-d1'));
 const src=new Set(r.rows.map(x=>x.sourceRef));
 assert.equal(src.size,7);
 for(const row of r.rows)assert(/^https:\/\//.test(row.sourceUrl));
});
test('independent operand evaluator covers every curated arithmetic family without reading answer field',()=>{
 const families=new Set(cases.numericQuestions.map(x=>x.kind));
 assert.equal(families.size,17);
 for(const row of cases.numericQuestions){
  const expected=compute(row),q=firstMatching(pack,row.id);
  assert(Number.isFinite(expected));
  assert(Math.abs(expected-q.answer)<Math.max(1e-12,Math.abs(expected)*1e-12),row.id);
 }
 assert.equal(compute(cases.numericQuestions.find(x=>x.id==='epi-pt-4')),500);
 assert.equal(compute(cases.numericQuestions.find(x=>x.id==='353-probability-binomial-foundation-d1')),2/6);
 assert.equal(compute(cases.numericQuestions.find(x=>x.id==='353-normal-distribution-foundation-d3')),.0228);
 assert.equal(compute(cases.numericQuestions.find(x=>x.id==='353-mean-median-d2')),7);
 assert.equal(compute(cases.numericQuestions.find(x=>x.id==='353-dispersion-foundation-d2')),9);
});
test('incorrect authored answer, altered unit and excessive accepted tolerance fail audit',()=>{
 const a=clone(pack),b=clone(pack),c=clone(pack);
 firstMatching(a,'epi-pt-2').answer=21;
 firstMatching(b,'353-mean-median-a1').unit='小时';
 firstMatching(c,'353-probability-binomial-foundation-a1').tolerance=.5;
 assert(audit(a).errors.includes('numerical-answer-mismatch:epi-pt-2'));
 assert(audit(b).errors.includes('unit-mismatch:353-mean-median-a1'));
 assert(audit(c).errors.includes('grading-tolerance-unreasonable:353-probability-binomial-foundation-a1'));
});
test('stem operand changes, missing case fixtures and fabricated expert approvals fail closed',()=>{
 const stem=clone(pack);
 firstMatching(stem,'353-sampling-distribution-se-b2').stem='给独立同分布且总体SD=10分钟，n=16。求均数SE。';
 assert(audit(stem).errors.includes('stem-input-drift:353-sampling-distribution-se-b2'));
 const unknown=clone(cases);
 unknown.numericQuestions.splice(0,1);
 assert.throws(()=>audit(pack,unknown),/Curated 39-case manifest required/);
 const approved=clone(pack);
 approved.units.find(x=>x.subject==='353').reviewRecord.expertApproved=true;
 assert(audit(approved).errors.includes('fabricated-professional-approval'));
 const malformed=clone(cases);
 malformed.numericQuestions[0].source='NOT_REAL';
 assert.throws(()=>audit(pack,malformed),/Missing formula reference/);
});
test('existing learner pack still has 47 courses and 524 items; 353 subpool is 18 courses and 204 items',()=>{
 assert.equal(pack.units.length,47);
 const total=pack.units.reduce((n,u)=>n+u.basicQuestions.length+u.applicationQuestions.length+u.delayedQuestions.length,0);
 assert.equal(total,524);
 const u=pack.units.filter(x=>x.subject==='353');
 assert.equal(u.length,18);
 assert.equal(u.reduce((n,x)=>n+x.basicQuestions.length+x.applicationQuestions.length+x.delayedQuestions.length,0),204);
});
