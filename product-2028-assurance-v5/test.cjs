'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-radiotherapy-51/.build/representative-courses.json');
const clone=x=>structuredClone(x);
test('full 51-course/572-question current build remaps 2027 coarse teaching groups without coverage claims',()=>{
 const r=audit(pack);
 assert.equal(r.passed,true,r.problems.join(','));
 assert.equal(r.currentCourses,51);
 assert.equal(r.currentQuestions,572);
 assert.deepEqual(r.subjectCounts,{en:15,pol:14,'353':22});
 assert.equal(r.current353Questions,252);
 assert.equal(r.current353NumericalQuestions,55);
 assert.equal(r.priorBase353NumericalQuestionsIndependentlyChecked,39);
 assert.equal(r.new353NumericalQuestionsModelRecalculated,16);
 assert.equal(r.coarse2027TeachingGroups,27);
 assert.equal(r.groupsWithSomeUnverifiedDraftRelated,14);
 assert.equal(r.groupsWithoutDirectDraftRelated,13);
 assert.equal(r.verifiedCompleteGroups,0);
 assert.equal(r.official2028CoveragePercent,null);
 assert.equal(r.actual2028SyllabusVerified,false);
 assert.equal(r.expertApprovals,0);
 assert.equal(r.formalReleaseApproved,false);
 for(const [topic,id] of [['MP02','353-radiation-protection-foundation'],['MP03','353-nuclear-imaging-foundation'],['MP04','353-radiotherapy-physics-foundation']]){
  const item=r.items.find(x=>x.id===topic);
  assert(item.courseIds.includes(id));
  assert.equal(item.completeCoverageVerified,false);
  assert.equal(item.linkedQuestionAccuracyCertified,false);
 }
});
test('false expert approval, missing curriculum link and mismatched numerical counts do not pass',()=>{
 const fake=clone(pack);
 fake.units.find(x=>x.id==='353-radiotherapy-physics-foundation').reviewRecord.expertApproved=true;
 assert(audit(fake).problems.some(x=>x.startsWith('unapproved-or-unsourced-content:')));
 const link=clone(pack);
 link.units.find(x=>x.id==='353-nuclear-imaging-foundation').mapping=[];
 assert(audit(link).problems.some(x=>x.startsWith('new-course-topic-link-mismatch:MP03')));
 const changed=clone(pack);
 changed.units.find(x=>x.id==='353-nuclear-imaging-foundation').applicationQuestions[1].type='subjective';
 assert(audit(changed).problems.some(x=>x.startsWith('current-353-numeric-count-drift:')));
 const missing=clone(pack);
 missing.units.pop();
 assert.throws(()=>audit(missing),/51-course V9/);
});
