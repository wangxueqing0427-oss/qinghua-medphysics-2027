'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-v15-additive/.build/representative-courses.json');
const clone=x=>structuredClone(x);
test('V15 current 56-course evidence map includes EPI11 without pretending 2028 complete',()=>{
 const r=audit(pack);
 assert.equal(r.passed,true,r.errors.join(','));
 assert.equal(r.currentCourseCount,56);
 assert.equal(r.currentQuestionCount,632);
 assert.deepEqual(r.subjectCourseCounts,{en:15,pol:14,'353':27});
 assert.equal(r.medical353QuestionCount,312);
 assert.equal(r.medical353NumericQuestionCount,75);
 assert.equal(r.coarse2027InternalTeachingThemes,27);
 assert.equal(r.themesWithSomeDraftAssociation,18);
 assert.equal(r.themesWithoutDirectDraftAssociation,9);
 assert.equal(r.verifiedCompleteThemes,0);
 assert.equal(r.verifiedOfficial2028Percent,null);
 assert.equal(r.independentExpertApprovals,0);
 assert.equal(r.formalReleaseApproved,false);
 assert.equal(r.realIPhoneApproved,false);
 for(const [topic,unit] of [
  ['EPI08','353-screening-test-foundation'],
  ['EPI09','353-outbreak-investigation-foundation'],
  ['EPI11','353-evidence-systematic-review-meta-foundation'],
  ['STAT02','353-inference-ci-hypothesis-foundation'],
  ['STAT02','353-t-tests-paired-independent-foundation'],
  ['STAT03','353-anova-chi-regression-foundation'],
  ['MP02','353-radiation-protection-foundation'],
  ['MP03','353-nuclear-imaging-foundation'],
  ['MP04','353-radiotherapy-physics-foundation']
 ]){
  const t=r.topics.find(x=>x.id===topic);
  assert(t?.draftAssociatedCourseIds.includes(unit),topic+':'+unit);
  assert.equal(t.completeTeachingCoverageVerified,false);
  assert.equal(t.fullyVerifiedAgainst2028OfficialOutline,false);
  assert.equal(t.independentExpertApproved,false);
 }
 assert(!r.urgentMissingInternalThemes.some(x=>x.id==='EPI11'));
 assert(r.urgentMissingInternalThemes.some(x=>x.id==='PH03'));
 assert(r.urgentMissingInternalThemes.some(x=>x.id==='PH04'));
});
test('missing EPI11 link, missing sources, fake professional signoff or numeric drift fails',()=>{
 const shorter=clone(pack);shorter.units.pop();
 assert.throws(()=>audit(shorter),/56-course/);
 const approved=clone(pack);approved.units[55].reviewRecord.expertApproved=true;
 assert(audit(approved).errors.some(e=>e.startsWith('invalid approval/source')));
 const released=clone(pack);released.units[55].reviewRecord.publicRelease=true;
 assert(audit(released).errors.some(e=>e.startsWith('invalid approval/source')));
 const noSource=clone(pack);noSource.units[55].sources=[];
 assert(audit(noSource).errors.some(e=>e.startsWith('invalid approval/source')));
 const wrongMapping=clone(pack);wrongMapping.units[55].mapping=[];
 assert(audit(wrongMapping).errors.some(e=>e.includes('wrong outline theme')));
 const numericDrift=clone(pack);numericDrift.units[55].applicationQuestions[1].type='subjective';
 assert.throws(()=>audit(numericDrift),/75 numeric/);
});
