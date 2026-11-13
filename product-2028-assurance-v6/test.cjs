'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-v13-additive/.build/representative-courses.json');
const copy=x=>structuredClone(x);
test('V13 report uses real 54-course data and refuses to invent 2028 exam coverage',()=>{
 const r=audit(pack);
 assert.equal(r.passed,true,r.errors.join(','));
 assert.equal(r.currentCourseCount,54);
 assert.equal(r.currentQuestionCount,608);
 assert.deepEqual(r.subjectCourseCounts,{en:15,pol:14,'353':25});
 assert.equal(r.medical353QuestionCount,288);
 assert.equal(r.medical353NumericQuestionCount,67);
 assert.equal(r.coarse2027InternalTeachingThemes,27);
 assert.equal(r.themesWithSomeDraftAssociation,16);
 assert.equal(r.themesWithoutDirectDraftAssociation,11);
 assert.equal(r.verifiedCompleteThemes,0);
 assert.equal(r.verifiedOfficial2028Percent,null);
 assert.equal(r.independentExpertApprovals,0);
 assert.equal(r.formalReleaseApproved,false);
 assert.equal(r.realIPhoneApproved,false);
 for(const [topic,unit] of [
  ['EPI08','353-screening-test-foundation'],
  ['EPI09','353-outbreak-investigation-foundation'],
  ['STAT02','353-inference-ci-hypothesis-foundation'],
  ['STAT02','353-t-tests-paired-independent-foundation'],
  ['MP02','353-radiation-protection-foundation'],
  ['MP03','353-nuclear-imaging-foundation'],
  ['MP04','353-radiotherapy-physics-foundation']
 ]){
  const t=r.topics.find(t=>t.id===topic);
  assert(t.draftAssociatedCourseIds.includes(unit),topic+'/'+unit);
  assert.equal(t.fullyVerifiedAgainst2028OfficialOutline,false);
  assert.equal(t.completeTeachingCoverageVerified,false);
  assert.equal(t.independentExpertApproved,false);
 }
 for(const t of r.topics)assert.equal(t.accuracyAndBibliographyReviewedPerQuestion,false);
 assert(r.urgentMissingInternalThemes.some(t=>t.id==='STAT03'));
 assert(r.urgentMissingInternalThemes.some(t=>t.id==='EPI11'));
 assert(r.urgentMissingInternalThemes.some(t=>t.id==='PH04'));
});
test('missing 353 draft, inflated approval, missing sources or incorrect links must fail closed',()=>{
 const shorter=copy(pack);shorter.units.pop();
 assert.throws(()=>audit(shorter),/54-course/);
 const approved=copy(pack);
 approved.units.find(x=>x.id==='353-outbreak-investigation-foundation').reviewRecord.expertApproved=true;
 assert(audit(approved).errors.some(e=>e.includes('invalid approval/source')));
 const noSource=copy(pack);
 noSource.units.find(x=>x.id==='353-screening-test-foundation').sources=[];
 assert(audit(noSource).errors.some(e=>e.includes('invalid approval/source')));
 const invalidMap=copy(pack);
 invalidMap.units.find(x=>x.id==='353-outbreak-investigation-foundation').mapping=[];
 assert(audit(invalidMap).errors.some(e=>e.includes('wrong outline theme')));
 const different=copy(pack);
 different.units.find(x=>x.id==='353-outbreak-investigation-foundation').delayedQuestions[1].type='subjective';
 assert.throws(()=>audit(different),/67 numeric/);
});
