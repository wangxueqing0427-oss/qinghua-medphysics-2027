'use strict';
// Independent numerical recomputation of frozen 353 questions.
// NO use of authored q.answer or q.explanation in expected-value formulae.
// The fixtures explicitly transcribe operands from the question stems.
// This does NOT constitute independent professional review or verify nonnumerical content.
const cases = require('./numeric-cases.json');
const ENGINE = require('../product-2028-svo-subjective-candidate/course-engine.cjs');
const GROUPS=['basicQuestions','applicationQuestions','delayedQuestions'];
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const requireValue=(test,msg)=>{if(!test)throw Error(msg);};
const total=a=>{requireValue(Array.isArray(a)&&a.length>0&&a.every(finite),'Invalid numeric operands');return a.reduce((n,x)=>n+x,0);};
const fraction=(a,b)=>{requireValue(finite(a)&&finite(b)&&b>0,'Invalid probability denominator');return a/b;};
const mean=a=>fraction(total(a),a.length);
const sorted=a=>{total(a);return [...a].sort((x,y)=>x-y);};
const median=a=>{const x=sorted(a),i=Math.floor(x.length/2);return x.length%2?x[i]:(x[i-1]+x[i])/2;};
const sampleVariance=a=>{requireValue(Array.isArray(a)&&a.length>1,'Variance requires >=2 observations');const m=mean(a);return total(a.map(x=>(x-m)**2))/(a.length-1);};
function compute(row){
 const x=row.input;
 switch(row.kind){
  case 'incidencePct':return fraction(x.cases,x.risk)*100;
  case 'incidenceRate':return fraction(x.cases,Array.isArray(x.personYears)?total(x.personYears):x.personYears)*1000;
  case 'ratioPct':return fraction(x.cases,x.denominator)*100;
  case 'mean':return mean(x.values);
  case 'median':return median(x.values);
  case 'sampleVariance':return sampleVariance(x.values);
  case 'range':{const s=sorted(x.values);return s.at(-1)-s[0];}
  case 'sampleSD':return Math.sqrt(sampleVariance(x.values));
  case 'zscore':return fraction(x.x-x.mu,x.sd);
  case 'cdfBetween':return x.upper-x.lower;
  case 'cdfTail':return 1-x.cdf;
  case 'complement':return 1-x.p;
  case 'equallyLikely':return fraction(x.favorable,x.total);
  case 'exactOneTwoTrials':return x.p*(1-x.p)+(1-x.p)*x.p;
  case 'srsInclusion':return fraction(x.n,x.N);
  case 'ratio':return fraction(Array.isArray(x.cases)?total(x.cases):x.cases,x.denominator);
  case 'sem':return fraction(x.sd,Math.sqrt(x.n));
  default:throw Error('Unknown computation family: '+row.kind);
 }
}
function ensureCases(registry=cases){
 requireValue(registry?.schemaVersion===1&&registry.numericQuestions?.length===39,'Curated 39-case manifest required');
 requireValue(registry.sourceDefinitions&&typeof registry.sourceDefinitions==='object','Missing source registry');
 const ids=new Set();
 for(const row of registry.numericQuestions){
  requireValue(typeof row.id==='string'&&!ids.has(row.id),'Duplicate or invalid case ID');
  ids.add(row.id);
  requireValue(Array.isArray(row.clues)&&row.clues.length>=2&&row.clues.every(x=>typeof x==='string'&&x.trim()),'Missing stem anchors: '+row.id);
  requireValue(typeof row.unit==='string'&&row.unit.trim(),'Missing unit: '+row.id);
  const s=registry.sourceDefinitions[row.source];
  requireValue(s&&/^https:\/\//.test(s.url)&&s.boundary,'Missing formula reference: '+row.id);
  requireValue(finite(compute(row)),'Nonfinite formula result: '+row.id);
 }
}
function audit(pack,registry=cases){
 ensureCases(registry);
 requireValue(pack?.units?.length===47,'Expected frozen 47-course pack');
 const groups={};
 const seen=new Map(),errors=[],rows=[];
 const stats={numericTotal:0,verified:0,mismatch:0,stemDrift:0,missing:0,wrongUnit:0,unsafeTolerance:0};
 for(const u of pack.units.filter(u=>u.subject==='353')){
  for(const group of GROUPS)for(const q of u[group]||[]){
   if(q.type!=='number')continue;
   stats.numericTotal++;
   if(seen.has(q.id))errors.push('duplicate:'+q.id);
   seen.set(q.id,{u,q,group});
  }
 }
 const fixtures=new Map(registry.numericQuestions.map(x=>[x.id,x]));
 for(const [id,row] of seen){
  const fixture=fixtures.get(id);
  if(!fixture){stats.missing++;errors.push('missing-fixture:'+id);continue;}
  if(!fixture.clues.every(s=>row.q.stem.includes(s))){
   stats.stemDrift++;errors.push('stem-input-drift:'+id);continue;
  }
  const calc=compute(fixture);
  const exactTolerance=Math.max(1e-12,Math.abs(calc)*1e-12);
  const diff=Math.abs(calc-row.q.answer);
  const unitMatches=row.q.unit===fixture.unit;
  if(!unitMatches){stats.wrongUnit++;errors.push('unit-mismatch:'+id);}
  if(!finite(row.q.answer)||diff>exactTolerance){
   stats.mismatch++;errors.push('numerical-answer-mismatch:'+id);
  }
  const gradeBoundary=finite(row.q.tolerance)&&row.q.tolerance>=0&&
   row.q.tolerance<=Math.max(0.02,Math.abs(calc)*0.001);
  if(!gradeBoundary){
   stats.unsafeTolerance++;errors.push('grading-tolerance-unreasonable:'+id);
  }
  const engineGrade=ENGINE.grade(row.q,{value:calc,unit:fixture.unit});
  if(engineGrade.method!=='objective'||engineGrade.correct!==true)
   errors.push('grading-contract-mismatch:'+id);
  const valid=unitMatches&&diff<=exactTolerance&&gradeBoundary&&engineGrade.correct===true;
  if(valid)stats.verified++;
  rows.push({id,unitId:row.u.id,group:row.group,kind:fixture.kind,parameters:fixture.input,
   sourceRef:fixture.source,sourceUrl:registry.sourceDefinitions[fixture.source].url,
   boundary:registry.sourceDefinitions[fixture.source].boundary,
   stemTokensConfirmed:true,authorAnswer:row.q.answer,independentCalculatedValue:calc,
   absoluteDifference:diff,unit:fixture.unit,authorTolerance:row.q.tolerance,
   independentlyRecomputed:valid,subjectMatterCertified:false,professionallyApproved:false});
 }
 for(const fixture of registry.numericQuestions)if(!seen.has(fixture.id)){
  stats.missing++;errors.push('orphan-fixture:'+fixture.id);
 }
 if(stats.numericTotal!==39)errors.push('current-pack-numeric-count:'+stats.numericTotal);
 if(pack.units.filter(u=>u.subject==='353').length!==18)errors.push('current-pack-353-course-count');
 if(pack.units.filter(u=>u.subject==='353').reduce((n,u)=>n+GROUPS.reduce((v,g)=>v+(u[g]||[]).length,0),0)!==204)
  errors.push('current-pack-353-question-count');
 if(pack.units.some(u=>u.reviewRecord?.expertApproved===true))errors.push('fabricated-professional-approval');
 const report={
  kind:'independent-operand-recomputation-not-expert-review',target:'2028-entry',
  353ProvisionalSourceYear:2027,
  scope:'353 current 18-course/204-question draft; 39 numerical items checked independently',
  ...stats,errors,passed:errors.length===0,rows,
  numericalCorrectnessForTheseStemsVerifiedByFormula:errors.length===0&&stats.verified===39,
  nonNumeric353QuestionsAwaitingFactReview:204-stats.numericTotal,
  generalScientificCorrectnessApproved:false,
  perQuestionSourceParagraphAudited:false,
  formal2028SyllabusVerified:false,
  independentExpertSignoffs:0,
  formalReleaseApproved:false,
  limitation:'Formula and stem-input/answer checks only. Authority references describe calculation families; no claim of expert approval, complete exam coverage or medical/clinical correctness.'
 };
 return report;
}
module.exports={audit,compute,ensureCases};
