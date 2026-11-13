'use strict';
// Regenerate a descriptive 2027-outline candidate map from the actual 51-course V9 catalog.
// Intentionally no release percentage, no 2028 official guarantee, no expert badge.
const prior=require('../product-2028-assurance-v4/2027-353-topic-map.json');
const links={
 MP02:['353-radiation-protection-foundation'],
 MP03:['353-nuclear-imaging-foundation'],
 MP04:['353-radiotherapy-physics-foundation']
};
const groups=['basicQuestions','applicationQuestions','delayedQuestions'];
function audit(pack){
 if(pack?.units?.length!==51)throw Error('Expected 51-course V9 draft, not stale baseline');
 const all=pack.units.reduce((n,u)=>n+groups.reduce((x,g)=>x+u[g].length,0),0);
 if(all!==572)throw Error('Expected 572 authored questions');
 const relevant=pack.units.filter(u=>u.subject==='353');
 if(relevant.length!==22)throw Error('Expected 22 current 353 courses');
 if(relevant.reduce((n,u)=>n+groups.reduce((x,g)=>x+u[g].length,0),0)!==252)
  throw Error('Expected 252 current 353 questions');
 const byId=new Map(relevant.map(u=>[u.id,u]));
 if(byId.size!==22)throw Error('Duplicate 353 course');
 if(prior.officialYear!==2027||prior.provisionalForTargetYear!==2028||prior.target2028OutlineObtained!==false||
  prior.expertApprovals!==0||prior.fullCoverageVerified!==0||prior.topics.length!==27)
  throw Error('Official outline evidence mismatch');
 const problems=[],items=[];
 for(const t of prior.topics){
  const add=links[t.id]||[];
  const existing=t.courseIds||[];
  if(t.completeCoverageVerified!==false||t.confirmedFor2028!==false||t.expertApproved!==false)
   problems.push('false-syllabus-or-expert-label:'+t.id);
  const related=[...new Set([...existing,...add])];
  for(const id of related){
   const u=byId.get(id);
   if(!u){problems.push('unknown-course:'+t.id+':'+id);continue;}
   if(!u.sources?.length||u.reviewRecord?.expertApproved===true||u.distribution!=='held-pending-review')
    problems.push('unapproved-or-unsourced-content:'+id);
   if(add.includes(id)&&!(u.mapping||[]).includes(t.id))
    problems.push('new-course-topic-link-mismatch:'+t.id+':'+id);
  }
  items.push({...t,courseIds:related,
   mappingStatus:related.length?'partial-candidate-not-verified':'no-direct-course-candidate',
   completeCoverageVerified:false,confirmedFor2028:false,examScoreWeightKnown:false,expertApproved:false,
   sourcePassagesCheckedPerTeachingUnit:false,
   linkedQuestionAccuracyCertified:false});
 }
 const withLinks=items.filter(t=>t.courseIds.length>0);
 const without=items.filter(t=>t.courseIds.length===0);
 const nr=relevant.flatMap(u=>groups.flatMap(g=>u[g])).filter(q=>q.type==='number').length;
 if(nr!==55)problems.push('current-353-numeric-count-drift:'+nr);
 const latest=[
  ['MP02','353-radiation-protection-foundation'],
  ['MP03','353-nuclear-imaging-foundation'],
  ['MP04','353-radiotherapy-physics-foundation']
 ];
 for(const [topic,id] of latest)if(!items.find(t=>t.id===topic)?.courseIds.includes(id))
   problems.push('missing-new-topic-link:'+topic);
 return {
  kind:'2027-official-syllabus-partial-topic-candidate-map',
  target2028:true,actual2028SyllabusVerified:false,expertApprovals:0,
  currentCourses:51,currentQuestions:572,subjectCounts:{en:15,pol:14,'353':22},
  current353Questions:252,current353NumericalQuestions:55,
  priorBase353NumericalQuestionsIndependentlyChecked:39,
  new353NumericalQuestionsModelRecalculated:16,
  coarse2027TeachingGroups:27,
  groupsWithSomeUnverifiedDraftRelated:withLinks.length,
  groupsWithoutDirectDraftRelated:without.length,
  verifiedCompleteGroups:0,
  official2028CoveragePercent:null,
  formalReleaseApproved:false,passed:problems.length===0,problems,
  source:prior.sourceUrl,items,
  limitations:[
   '27 coarse groups are internal teaching/planning categories, NOT the official independent scoring units',
   'Candidate course links do not mean complete teaching and not an exam-weight or percentage estimate',
   'Content/fact accuracy and professional approval remain incomplete; no fake expert sign-offs',
   'The 2028 official full syllabus is not independently verified; 2027 source is provisional'
  ]
 };
}
module.exports={audit};
