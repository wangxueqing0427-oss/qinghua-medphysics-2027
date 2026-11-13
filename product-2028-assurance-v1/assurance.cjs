'use strict';
// Automated, source-aware STRUCTURE and RISK triage. It cannot certify scientific correctness.
// This module never changes the 47 courses, 524 questions or learners' data.
const crypto=require('crypto');
const CourseEngine=require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const {validateObjectives}=require('../product-2028-draft/content/objective-quality.cjs');
const SUBJECTS={en:'英语（一）',pol:'思想政治理论','353':'卫生综合'};
const GROUPS=['basicQuestions','applicationQuestions','delayedQuestions'];
const NORMALIZE=x=>String(x||'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
const SHA=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function audit(pack,register){
 const fatal=[],flags=[],units=[],questions=[],stems=new Map(),duplicates=[];
 if(pack?.schemaVersion!==1||!Array.isArray(pack.units)||pack.units.length===0)
  throw Error('Missing auditable course pack');
 if(register?.schemaVersion!==1||register?.formal2028SyllabusAvailable!==false||
    register?.hasIndependentExpert!==false||register?.fullEnglishAndPoliticsOutlineVerified!==false)
  throw Error('Misleading or incomplete evidence register');
 const refs=register.references;
 if(!Array.isArray(refs)||!refs.find(r=>r.id==='tsinghua-2027-353-syllabus'&&r.year===2027)||
    refs.some(r=>r.year>2027||r.evidenceLevel==='expert-approved'))
  throw Error('Official source register not bounded to prior-year evidence');
 fatal.push(...CourseEngine.validate(pack).map(x=>'engine:'+x));
 fatal.push(...validateObjectives(pack).map(x=>'objectives:'+x));
 const subjectCounts={en:{units:0,questions:0},pol:{units:0,questions:0},'353':{units:0,questions:0}};
 const questionIds=new Set();
 const priorityReasons=[
  {tag:'medical-physics-technical',pattern:/辐射|放疗|剂量|核医学|核素|射线|电子束|光子|加速器|影像|磁共振|测量不确定度|屏蔽|防护|医学物理|量纲/i},
  {tag:'epidemiology-and-statistics',pattern:/流行病|筛检|敏感度|特异度|病例对照|队列|偏倚|区间估计|假设检验|方差分析|回归|抽样|统计|因果/i},
  {tag:'public-health-policy',pattern:/公共卫生|健康|应急|政策|法律|医保|全球|伦理|卫生经济/i}
 ];
 for(const u of pack.units){
  if(!SUBJECTS[u.subject]){fatal.push('unknown-subject:'+u.id);continue;}
  subjectCounts[u.subject].units++;
  const all=GROUPS.flatMap(group=>(u[group]||[]).map(q=>({group,q})));
  subjectCounts[u.subject].questions+=all.length;
  const urls=Array.isArray(u.sources)?u.sources:[];
  if(!urls.length||urls.some(url=>typeof url!=='string'||!/^https:\/\//.test(url)))
   fatal.push('invalid-source-url:'+u.id);
  if(u.reviewRecord?.expertApproved===true||u.reviewStatus==='approved'||u.distribution==='allowed')
   fatal.push('unverified-approval:'+u.id);
  const mapped=Array.isArray(u.learningObjectives)&&u.learningObjectives.length>=2;
  const riskText=[u.title,...(u.learningObjectives||[]).map(x=>x.description)].join(' ');
  const matching=u.subject==='353'?priorityReasons.filter(x=>x.pattern.test(riskText)).map(x=>x.tag):[];
  const riskLevel=u.subject==='353'?'high':u.subject==='pol'?'medium':'source-check-needed';
  const unitRow={
   id:u.id,subject:u.subject,title:u.title,version:u.version||null,
   questionCount:all.length,objectiveCount:(u.learningObjectives||[]).length,
   sourcesDeclared:urls.length,sourceUrls:urls,
   sourcePagesActuallyInspectedByThisGate:false,
   mappedToOfficial2028Outline:false,
   official2028ScopeConfirmed:false,
   reviewRecordPresent:!!u.reviewRecord,
   machineStructureChecked:true,
   calculationContentIndependentlyVerifiedByThisGate:false,
   expertApproved:false,publicReleaseApproved:false,
   riskLevel,reviewFocus:matching,
   nextAction:u.subject==='353'?'逐项比对清华2027年353大纲与权威教材，复核技术事实与公式':u.subject==='pol'?
     '核对当年度政治大纲、时政和对应教材；不得将旧版知识当作当年度命题事实':
     '补齐英语（一）完整考试大纲、阅读和语法权威依据，核对词义与解析',
   limitations:['来源网址存在不表示原文已人工核实或内容正确','本课程未取得2028年度完整范围认证或专家审定']
  };
  units.push(unitRow);
  flags.push({unitId:u.id,severity:riskLevel,kind:'unverified-source-and-exam-alignment',reason:unitRow.nextAction});
  for(const {group,q} of all){
   if(questionIds.has(q.id))fatal.push('duplicate-question-id:'+q.id);
   questionIds.add(q.id);
   const normalized=NORMALIZE(q.stem);
   if(stems.has(normalized))duplicates.push({first:stems.get(normalized),second:q.id,unitId:u.id});
   else stems.set(normalized,q.id);
   const result=CourseEngine.grade(q,q.type==='single'?q.answer:
      q.type==='multi'?q.answer:
      q.type==='number'?{value:q.answer,unit:q.unit}:
      q.answer);
   if(q.type==='subjective'){
     if(result.method!=='reference-only'||result.correct!==null||result.score!==null)
       fatal.push('subjective-auto-score:'+q.id);
   }else if(result.method!=='objective'||result.correct!==true||result.score!==1)
     fatal.push('objective-answer-contract:'+q.id);
   if(q.type==='number'&&(!Number.isFinite(q.answer)||!Number.isFinite(q.tolerance)||q.tolerance<0))
     fatal.push('number-contract:'+q.id);
   questions.push({
     id:q.id,unitId:u.id,subject:u.subject,group,type:q.type,hasExplanation:!!q.explanation,
     answerFormVerified:result.method==='objective'?'engine-expected-answer-contract':'reference-only-no-auto-score',
     numericalComputationIndependentlyReperformed:false,
     contentEvidenceCheckedAgainstSource:false,
     officialExamQuestion:false,
     needsSourceReview:true
   });
  }
 }
 if(duplicates.length)fatal.push('exact-duplicate-stems:'+duplicates.length);
 if(!CourseEngine.validate(pack,true).includes('release-blocked'))
   fatal.push('formal-release-not-blocked');
 if(pack.units.some(u=>u.reviewRecord?.expertApproved===true))
   fatal.push('unexpected-expert-approval');
 const sampleCount={all:questions.length,subjective:questions.filter(q=>q.type==='subjective').length,
  numeric:questions.filter(q=>q.type==='number').length,
  objective:questions.filter(q=>q.type!=='subjective').length};
 const p={
  kind:'prior-year-evidence-and-automatic-structure-review',
  target:'2028-entry',priorOfficialEvidenceYear:2027,
  packFingerprint:SHA(pack),evidenceFingerprint:SHA(register),
  subjects:subjectCounts,totals:{courses:pack.units.length,...sampleCount},
  confirmedFullExamCoverage:null,expertApprovals:0,
  sourceRelevanceValidatedAutomatically:false,independentProfessionalSignoff:false,
  machineContentCorrectnessCertified:false,verified2028Syllabus:false,
  safePersonalStudyPilot: fatal.length===0,
  formalReleaseApproved:false,
  passedAutomaticContracts:fatal.length===0,
  knownLimitations:[
   'Static question correctness tests are not independent textbook fact-checking',
   'Numeric grading contract validation is not independent formula recalculation',
   'Existing course URLs are declared sources, not proof each explanation follows the source',
   'Question difficulty, real-exam score and 2028 syllabus coverage cannot be inferred from question counts',
   'No AI pass, quality threshold or consensus constitutes an independent accredited subject expert approval'
  ],
  fatal,exactDuplicateStems:duplicates,flags,units,questions
 };
 return p;
}
module.exports={audit};
