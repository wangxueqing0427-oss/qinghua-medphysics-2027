'use strict';
const REQUIRED={ 'public-health':6,'epidemiology':11,'statistics':3,'cross-disciplinary':1,'medical-physics':6 };
const SOURCE='https://vsph.tsinghua.edu.cn/info/1025/2775.htm';
function map(pack,outline){
 if(!Array.isArray(pack?.units)||pack.units.length!==47)throw Error('Wrong frozen 47-course candidate');
 if(outline?.schemaVersion!==1||outline.officialYear!==2027||outline.provisionalForTargetYear!==2028||
   outline.target2028OutlineObtained!==false||outline.expertApprovals!==0||
   outline.fullCoverageVerified!==0||outline.sourceUrl!==SOURCE)
   throw Error('Unreliable or misleading 2028 syllabus map');
 const units=new Map(pack.units.filter(u=>u.subject==='353').map(u=>[u.id,u]));
 if(units.size!==18)throw Error('Expected 18 353 candidate lessons');
 if(!Array.isArray(outline.topics)||outline.topics.length!==27||outline.topicCount!==27)
   throw Error('Expected 27 coarse human-authored teaching-topic groups');
 const seen=new Set(),groups={},issues=[],enriched=[];
 for(const t of outline.topics){
  if(!t.id||seen.has(t.id))issues.push('duplicate-topic:'+t.id);
  seen.add(t.id);
  if(!Object.hasOwn(REQUIRED,t.area))issues.push('invalid-area:'+t.id);
  groups[t.area]=(groups[t.area]||0)+1;
  if(t.sourceYear!==2027||t.sourceUrl!==SOURCE||t.confirmedFor2028!==false||
    t.completeCoverageVerified!==false||t.examScoreWeightKnown!==false||t.expertApproved!==false)
     issues.push('unearned-exam-certification:'+t.id);
  if(!['partial-candidate-not-verified','no-direct-course-candidate'].includes(t.mappingStatus)||
    t.mappingStatus!==(t.courseIds.length?'partial-candidate-not-verified':'no-direct-course-candidate'))
     issues.push('unearned-full-mapping:'+t.id);
  if(!Array.isArray(t.courseIds)||new Set(t.courseIds).size!==t.courseIds.length)
     issues.push('duplicate-candidate-course:'+t.id);
  for(const id of t.courseIds||[])if(!units.has(id))issues.push('unknown-candidate-course:'+t.id+':'+id);
  enriched.push({...t,linksOnlyUnverifiedCandidates:t.courseIds.length>0,
    final2028ExamCoverageConfirmed:false,fullCourseTeachingValidated:false});
 }
 for(const [area,n] of Object.entries(REQUIRED))if(groups[area]!==n)issues.push('area-topic-count:'+area);
 const noDirect=enriched.filter(t=>t.courseIds.length===0);
 const partial=enriched.filter(t=>t.courseIds.length>0);
 return {
  kind:'2027-official-syllabus-coarse-partial-candidate-map',
  officialReferenceYear:2027,targetStudyYear:2028,officialSource:SOURCE,
  areas:groups,teachingTopicGroups:enriched.length,
  groupsWithOnlyUnverifiedCandidateCourseLinks:partial.length,
  groupsWithoutDirectCandidateCourseLinks:noDirect.length,
  actual2028SyllabusCoveragePercent:null,finalVerifiedTopicGroups:0,expertApproved:0,
  problems:issues,passed:issues.length===0,formalReleaseApproved:false,
  suggestedPriority:noDirect.concat(partial).sort((a,b)=>
    (a.priority==='P0'?0:1)-(b.priority==='P0'?0:1)||a.id.localeCompare(b.id)),
  items:enriched,
  warning:'This uses human-defined coarse groups from the 2027 syllabus for prioritization, not 27 official independent scoring units or a 2028 coverage percentage.'
 };
}
module.exports={map};
