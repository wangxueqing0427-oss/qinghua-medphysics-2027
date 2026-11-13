'use strict';
// Internal syllabus-gap evidence for 2027 official 353 direction, not a 2028 coverage percentage.
// Course links are partial and do not imply exam mastery, complete chapter coverage or expert signoff.
const original=require('../product-2028-assurance-v4/2027-353-topic-map.json');
const groups=['basicQuestions','applicationQuestions','delayedQuestions'];
const links={
 EPI08:['353-screening-test-foundation'],
 EPI09:['353-outbreak-investigation-foundation'],
 STAT02:['353-inference-ci-hypothesis-foundation','353-t-tests-paired-independent-foundation'],
 MP02:['353-radiation-protection-foundation'],
 MP03:['353-nuclear-imaging-foundation'],
 MP04:['353-radiotherapy-physics-foundation']
};
function audit(pack){
 if(!pack||!Array.isArray(pack.units)||pack.units.length!==54)throw Error('Expected current V13 54-course candidate only');
 if(original.officialYear!==2027||original.provisionalForTargetYear!==2028||
    original.target2028OutlineObtained!==false||original.expertApprovals!==0||
    original.fullCoverageVerified!==0||original.topicCount!==27||original.topics.length!==27)
  throw Error('2027 source/outcome guard changed');
 const total=pack.units.reduce((n,u)=>n+groups.reduce((x,k)=>x+(u[k]?.length||0),0),0);
 if(total!==608)throw Error('Expected 608 authored questions');
 const perSubject=Object.fromEntries(['en','pol','353'].map(id=>[id,pack.units.filter(u=>u.subject===id).length]));
 if(perSubject.en!==15||perSubject.pol!==14||perSubject['353']!==25)
  throw Error('Subject counts changed');
 const health=pack.units.filter(u=>u.subject==='353');
 const healthQs=health.reduce((n,u)=>n+groups.reduce((x,k)=>x+u[k].length,0),0);
 if(healthQs!==288)throw Error('353 expected 288 questions');
 const numbers=health.flatMap(u=>groups.flatMap(k=>u[k])).filter(q=>q.type==='number').length;
 if(numbers!==67)throw Error('353 expected 67 numeric models');
 const byId=new Map(health.map(u=>[u.id,u]));
 if(byId.size!==25)throw Error('Duplicate 353 unit IDs');
 const errors=[],items=[];
 for(const t of original.topics){
  if(t.confirmedFor2028!==false||t.completeCoverageVerified!==false||
     t.expertApproved!==false||t.examScoreWeightKnown!==false)
   errors.push('baseline false expert/syllabus claim:'+t.id);
  const added=links[t.id]||[];
  const candidates=[...new Set([...(t.courseIds||[]),...added])];
  for(const id of candidates){
   const unit=byId.get(id);
   if(!unit){errors.push('missing referenced unit:'+t.id+':'+id);continue;}
   if(!unit.sources?.length||unit.reviewRecord?.expertApproved===true||
      unit.reviewRecord?.publicRelease===true||unit.distribution!=='held-pending-review')
    errors.push('invalid approval/source:'+id);
   if(added.includes(id)&&!(unit.mapping||[]).includes(t.id))
    errors.push('new course mapped to wrong outline theme:'+id+':'+t.id);
  }
  items.push({
   id:t.id,title:t.title,area:t.area,internalPriority:t.priority,
   sourceYear:2027,sourceUrl:original.sourceUrl,
   draftAssociatedCourseIds:candidates,
   associationStatus:candidates.length?'partial-draft-association-unverified':'no-direct-course-candidate',
   fullyVerifiedAgainst2028OfficialOutline:false,
   completeTeachingCoverageVerified:false,
   independentExpertApproved:false,examScoreWeightKnown:false,
   accuracyAndBibliographyReviewedPerQuestion:false
  });
 }
 const withPartial=items.filter(x=>x.draftAssociatedCourseIds.length);
 const without=items.filter(x=>!x.draftAssociatedCourseIds.length);
 return {
  kind:'internal-2027-provisional-353-topic-gap-evidence-v13',
  generatedForCandidate:'qh2028-outbreak-54-v13',
  sourceYear:2027,examTargetYear:2028,sourceUrl:original.sourceUrl,
  currentCourseCount:54,currentQuestionCount:608,subjectCourseCounts:perSubject,
  medical353CourseCount:25,medical353QuestionCount:288,medical353NumericQuestionCount:67,
  coarse2027InternalTeachingThemes:27,
  themesWithSomeDraftAssociation:withPartial.length,
  themesWithoutDirectDraftAssociation:without.length,
  verifiedCompleteThemes:0,verifiedOfficial2028Percent:null,
  independentExpertApprovals:0,formalReleaseApproved:false,realIPhoneApproved:false,
  passed:errors.length===0,errors,topics:items,
  urgentMissingInternalThemes:without.filter(x=>
   original.topics.some(t=>t.id===x.id&&t.priority==='P0')).map(x=>({id:x.id,title:x.title})),
  safeguards:[
   '2027 syllabus is official for the 2027 public-health masters 353 exam, not proven complete for target 2028',
   '27 topics are internal planning groups and may overlap; their counts are NOT exam score or complete syllabus coverage',
   'Association means a related draft lesson exists, not that the whole exam topic is adequately taught',
   'Teaching accuracy and independent specialist audit remain incomplete; no inferred external expert approval',
   'Future releases must update the source-year and revision audit rather than simply increase course counts'
  ]
 };
}
module.exports={audit};
