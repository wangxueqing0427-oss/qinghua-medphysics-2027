'use strict';
const {test}=require('node:test'),assert=require('assert/strict');
const {audit}=require('./qualitative.cjs');
const pack=require('../product-2028-diagnostic-v5/.build/representative-courses.json');
const refs=require('./source-spotchecks.json');
const clone=x=>structuredClone(x);
function question(p,id){
 for(const u of p.units)for(const group of ['basicQuestions','applicationQuestions','delayedQuestions']){
  const q=u[group].find(x=>x.id===id);
  if(q)return q;
 }
 throw Error('Missing question '+id);
}
test('353 all 165 nonnumeric questions: graded distractors and subjective rubrics have structural integrity',()=>{
 const result=audit(pack,refs);
 assert.equal(result.unitCount,18);
 assert.equal(result.questionCount,204);
 assert.equal(result.coveredNonnumericQuestionCount,165);
 assert.equal(result.distinctQuestionIds,165);
 assert.equal(result.rows.length,165);
 assert.equal(result.objectiveQuestionCount+result.subjectiveQuestionCount,165);
 assert.equal(result.pinnedNumericQuestionsManagedSeparately,39);
 assert.equal(result.blockers.length,0,JSON.stringify(result.blockers));
 assert.equal(result.structuralGatePassed,true);
 assert.equal(result.readyForPersonalUnapprovedPractice,true);
 assert.equal(result.fullQuestionContentApproved,false);
 assert.equal(result.independentExpertApprovals,0);
 assert.equal(result.formalReleaseApproved,false);
 assert(result.rows.some(x=>x.id==='wi-b4'&&x.priority==='P0-physics'));
 assert(result.rows.some(x=>x.id==='unc-a2'&&x.kind==='subjective'));
 assert(result.rows.every(x=>x.exactSourceParagraphForFullQuestionChecked===false));
 assert(result.rows.every(x=>x.fullAnswerCorrectnessVerified===false));
});
test('NIST focused cross-checks are attached to their specific question IDs, without certifying whole content',()=>{
 const result=audit(pack,refs);
 assert.equal(refs.checks.length,5);
 assert.equal(result.specificConceptSpotcheckQuestionCount,7);
 for(const row of result.rows.filter(x=>x.limitedSourceConceptCrosschecks>0)){
   assert(row.spotcheckedTechnicalConcepts.every(x=>x.boundedStatus==='specific-concept-only'&&x.fullQuestionApproved===false));
   assert.equal(row.status,'limited-concept-spotcheck-only');
   assert.equal(row.fullAnswerCorrectnessVerified,false);
 }
 const altered=clone(refs);altered.checks[0].source='https://unknown.example.com';
 assert.throws(()=>audit(pack,altered),/Source outside approved/);
 const invented=clone(refs);invented.checks[0].questionIds=['fake-q-id'];
 assert.throws(()=>audit(pack,invented),/Orphan source comparison/);
});
test('distractor corruption, answer-index tampering and missing subjective rubrics cause hard blockers',()=>{
 const dup=clone(pack);
 const a=question(dup,'wi-b4');a.options[1]=a.options[0];
 assert(audit(dup,refs).blockers.some(x=>x.id==='wi-b4'&&x.kind==='invalid-or-identical-distractor'));
 const invalid=clone(pack);question(invalid,'wi-b4').answer=99;
 assert(audit(invalid,refs).blockers.some(x=>x.id==='wi-b4'&&x.kind==='invalid-single-answer-key'));
 const noRubric=clone(pack);question(noRubric,'unc-a2').rubric=[];
 assert(audit(noRubric,refs).blockers.some(x=>x.id==='unc-a2'&&x.kind==='missing-or-duplicate-subjective-rubric'));
 const duplicate=clone(pack);
 question(duplicate,'wi-a4').answer=[0,0];
 assert(audit(duplicate,refs).blockers.some(x=>x.id==='wi-a4'&&x.kind==='invalid-multi-answer-key'));
});
test('no machine-grade for written work, no false 2028 or independent expert approval',()=>{
 const result=audit(pack,refs);
 assert.equal(refs.expertApprovals,0);
 assert.equal(refs.verifiedFullExamCoverage,null);
 assert.equal(result.official2028SyllabusFullyVerified,false);
 assert.equal(result.independentExpertApprovals,0);
 assert.equal(result.formalReleaseApproved,false);
 assert.equal(result.fullQuestionContentApproved,false);
 for(const row of result.rows.filter(x=>x.kind==='subjective'))assert.equal(row.humanOrEvidenceReviewNeeded,true);
 const fake=clone(refs);fake.expertApprovals=1;
 assert.throws(()=>audit(pack,fake),/Misleading review register/);
});
