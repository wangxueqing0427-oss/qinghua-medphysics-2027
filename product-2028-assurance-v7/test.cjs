'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const {audit}=require('./current-gap-audit.cjs');
const pack=require('../product-2028-v14-additive/.build/representative-courses.json');
const copy=x=>structuredClone(x);
test('V14 reflects 55/620/26x353 and 2027 planning links without falsely granting 2028 coverage',()=>{
 const report=audit(pack);
 assert.equal(report.passed,true,report.errors.join(','));
 assert.equal(report.currentCourseCount,55);
 assert.equal(report.currentQuestionCount,620);
 assert.deepEqual(report.subjectCourseCounts,{en:15,pol:14,'353':26});
 assert.equal(report.medical353QuestionCount,300);
 assert.equal(report.medical353NumericQuestionCount,71);
 assert.equal(report.coarse2027InternalTeachingThemes,27);
 assert.equal(report.themesWithSomeDraftAssociation,17);
 assert.equal(report.themesWithoutDirectDraftAssociation,10);
 assert.equal(report.verifiedCompleteThemes,0);
 assert.equal(report.verifiedOfficial2028Percent,null);
 assert.equal(report.independentExpertApprovals,0);
 assert.equal(report.formalReleaseApproved,false);
 assert.equal(report.realIPhoneApproved,false);
 for(const [topic,unit] of [
  ['EPI08','353-screening-test-foundation'],
  ['EPI09','353-outbreak-investigation-foundation'],
  ['STAT02','353-inference-ci-hypothesis-foundation'],
  ['STAT02','353-t-tests-paired-independent-foundation'],
  ['STAT03','353-anova-chi-regression-foundation'],
  ['MP02','353-radiation-protection-foundation'],
  ['MP03','353-nuclear-imaging-foundation'],
  ['MP04','353-radiotherapy-physics-foundation']
 ]){
  const item=report.topics.find(x=>x.id===topic);
  assert(item?.draftAssociatedCourseIds.includes(unit),topic+':'+unit);
  assert.equal(item.completeTeachingCoverageVerified,false);
  assert.equal(item.fullyVerifiedAgainst2028OfficialOutline,false);
  assert.equal(item.independentExpertApproved,false);
 }
 assert(report.urgentMissingInternalThemes.some(x=>x.id==='EPI11'));
 assert(report.urgentMissingInternalThemes.some(x=>x.id==='PH03'));
 assert(report.urgentMissingInternalThemes.some(x=>x.id==='PH04'));
 assert(!report.urgentMissingInternalThemes.some(x=>x.id==='STAT03'));
});
test('missing sources, fake expert approval, wrong map or numeric drift fail gate',()=>{
 const short=copy(pack);short.units.pop();
 assert.throws(()=>audit(short),/55-course/);
 const approved=copy(pack);
 approved.units[54].reviewRecord.expertApproved=true;
 assert(audit(approved).errors.some(x=>x.startsWith('invalid approval/source')));
 const noSource=copy(pack);
 noSource.units[54].sources=[];
 assert(audit(noSource).errors.some(x=>x.startsWith('invalid approval/source')));
 const wrongMap=copy(pack);wrongMap.units[54].mapping=[];
 assert(audit(wrongMap).errors.some(x=>x.includes('new course mapped to wrong outline theme')));
 const altered=copy(pack);altered.units[54].applicationQuestions[1].type='subjective';
 assert.throws(()=>audit(altered),/71 numeric/);
});
