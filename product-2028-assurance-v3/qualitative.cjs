'use strict';
// 353 qualitative question triage: checks question/review contracts and source provenance.
// Only explicit limited NIST comparisons can be marked cross-checked.
// It does NOT certify textbook correctness, copyright, or 2028 syllabus coverage.
const crypto=require('crypto'),CourseEngine=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const GROUPS=['basicQuestions','applicationQuestions','delayedQuestions'];
const riskPhysics=/^353-(?:waves-interactions|uncertainty-foundation|quantity-measurement|energy-power)$/;
const suspect=/必然|一定|永远|所有|100%|完全正确|直接证明|无条件/;
const norm=t=>String(t).normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,'').trim();
function requireValid(v,msg){if(!v)throw Error(msg);}
function audit(pack,register){
 requireValid(pack?.units?.length===47,'Expected frozen 47-course content');
 requireValid(register?.schemaVersion===1&&register.expertApprovals===0&&register.contentApproval===false,'Misleading review register');
 const units=pack.units.filter(u=>u.subject==='353');
 requireValid(units.length===18,'Expected 18 353 courses');
 const rows=[],issues=[],seen=new Set(),sourceChecks=new Map();
 const byId=new Map();
 for(const u of units)for(const group of GROUPS)for(const q of u[group]||[]){
  if(byId.has(q.id))issues.push({id:q.id,kind:'duplicate-id',severity:'blocker'});
  byId.set(q.id,{q,u,group});
 }
 for(const check of register.checks){
  requireValid(/^https:\/\/(www\.)?(nist\.gov|physics\.nist\.gov)\//.test(check.source),'Source outside approved technical authority: '+check.id);
  requireValid(check.status==='specific-claim-supported-by-primary-technical-source'||check.status==='formula-and-specific-inputs-crosschecked','Misleading source status');
  for(const id of check.questionIds){
   requireValid(byId.has(id),'Orphan source comparison: '+id);
   requireValid(byId.get(id).q.type!=='number','Spotcheck belongs to numeric audit: '+id);
   if(!sourceChecks.has(id))sourceChecks.set(id,[]);
   sourceChecks.get(id).push({id:check.id,source:check.source,concept:check.claim,
    boundedStatus:'specific-concept-only',fullQuestionApproved:false});
  }
 }
 for(const u of units){
  const qItems=GROUPS.flatMap(group=>(u[group]||[]).map(q=>({group,q})));
  const sourceCount=(u.sources||[]).length;
  if(!sourceCount||u.sources.some(s=>!/^https:\/\//.test(s)))
   issues.push({id:u.id,kind:'missing-or-nonhttps-declared-source',severity:'blocker'});
  if(u.reviewRecord?.expertApproved===true||u.distribution!=='held-pending-review')
   issues.push({id:u.id,kind:'unearned-expert-or-release-status',severity:'blocker'});
  for(const {group,q} of qItems){
   if(q.type==='number')continue;
   if(seen.has(q.id))issues.push({id:q.id,kind:'repeated-nonnumeric-id',severity:'blocker'});
   seen.add(q.id);
   const subjective=q.type==='subjective';
   if(!['single','multi','subjective'].includes(q.type))
    issues.push({id:q.id,kind:'unhandled-question-type',severity:'blocker'});
   if(typeof q.stem!=='string'||q.stem.trim().length<5)
    issues.push({id:q.id,kind:'missing-or-short-question',severity:'blocker'});
   if(typeof q.explanation!=='string'||q.explanation.trim().length<12)
    issues.push({id:q.id,kind:'missing-or-short-explanation',severity:'blocker'});
   if(subjective){
    if(typeof q.answer!=='string'||q.answer.trim().length<4)
     issues.push({id:q.id,kind:'missing-subjective-reference-answer',severity:'blocker'});
    if(!Array.isArray(q.rubric)||q.rubric.length<2||
       q.rubric.some(x=>typeof x!=='string'||x.trim().length<2)||
       new Set((q.rubric||[]).map(norm)).size!==(q.rubric||[]).length)
     issues.push({id:q.id,kind:'missing-or-duplicate-subjective-rubric',severity:'blocker'});
   } else {
    if(!Array.isArray(q.options)||q.options.length<2||
       q.options.some(x=>typeof x!=='string'||x.trim().length===0)||
       new Set((q.options||[]).map(norm)).size!==(q.options||[]).length)
      issues.push({id:q.id,kind:'invalid-or-identical-distractor',severity:'blocker'});
    if(q.type==='single'&&(!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length))
      issues.push({id:q.id,kind:'invalid-single-answer-key',severity:'blocker'});
    if(q.type==='multi'&&(!Array.isArray(q.answer)||!q.answer.length||
       new Set(q.answer).size!==q.answer.length||
       q.answer.some(i=>!Number.isInteger(i)||i<0||i>=q.options.length)))
      issues.push({id:q.id,kind:'invalid-multi-answer-key',severity:'blocker'});
   }
   let result;
   try{result=CourseEngine.grade(q,q.answer);}catch(e){issues.push({id:q.id,kind:'grading-exception:'+e.message,severity:'blocker'});}
   if(result&&(subjective?
      (result.method!=='reference-only'||result.score!==null||result.correct!==null):
      (result.method!=='objective'||result.correct!==true)))
      issues.push({id:q.id,kind:'grading-contract-discrepancy',severity:'blocker'});
   const flagged=suspect.test([q.stem,q.explanation,q.answer].join(' '));
   const spot=sourceChecks.get(q.id)||[];
   const physics=riskPhysics.test(u.id);
   rows.push({
    id:q.id,unitId:u.id,unitTitle:u.title,stage:group,kind:q.type,
    questionDigest:crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex'),
    sourceCountDeclared:sourceCount,
    exactSourceParagraphForFullQuestionChecked:false,
    spotcheckedTechnicalConcepts:spot,
    limitedSourceConceptCrosschecks:spot.length,
    fullAnswerCorrectnessVerified:false,
    scientificExpertApproval:false,
    official2028SyllabusMapped:false,
    priority:physics?'P0-physics':q.type==='subjective'?'P1-written-answer':'P2-epidemiology-or-public-health',
    humanOrEvidenceReviewNeeded:true,
    reviewQuestions:physics?
      ['核对物理定义与近似条件','核对单位、数值与能量守恒边界','核对解析与干扰项是否有歧义']:
      subjective?['核对评分点是否充分且可操作','核对参考答案与权威来源是否一致']:
        ['核对每个选项科学真伪及适用条件','核对解析和题干是否有误导或歧义'],
    absoluteClaimCandidate:flagged,
    status:spot.length?'limited-concept-spotcheck-only':'awaiting-source-and-answer-factcheck'
   });
  }
 }
 const objective=rows.filter(x=>x.kind!=='subjective').length,subjective=rows.length-objective;
 const blockers=issues.filter(x=>x.severity==='blocker');
 const output={
  kind:'353-nonnumeric-risk-triage',target:'2028-entry',
  subject:'353',unitCount:18,questionCount:204,
  coveredNonnumericQuestionCount:rows.length,
  expectedNonnumericCount:165,
  objectiveQuestionCount:objective,subjectiveQuestionCount:subjective,
  pinnedNumericQuestionsManagedSeparately:39,
  distinctQuestionIds:seen.size,
  specificConceptSpotcheckQuestionCount:rows.filter(x=>x.limitedSourceConceptCrosschecks>0).length,
  absoluteClaimCandidates:rows.filter(x=>x.absoluteClaimCandidate).map(x=>x.id),
  flaggedProfessionalScope:rows.filter(x=>x.priority==='P0-physics').length,
  blockers,issues,rows,
  structuralGatePassed:blockers.length===0&&rows.length===165&&seen.size===165,
  readyForPersonalUnapprovedPractice:blockers.length===0&&rows.length===165,
  fullQuestionContentApproved:false,official2028SyllabusFullyVerified:false,
  independentExpertApprovals:0,formalReleaseApproved:false,
  limitations:[
   'Exam syllabus published in 2027 is only a provisional prior-year guide for 2028',
   'A question may be structurally valid yet factually wrong or ambiguous',
   'Unit source URLs are declarations, not proof that each option follows the source',
   'Focused NIST comparisons concern limited technical statements and not complete question review',
   'No graded subjective response is deemed an authoritative examination score'
  ]
 };
 return output;
}
module.exports={audit};
