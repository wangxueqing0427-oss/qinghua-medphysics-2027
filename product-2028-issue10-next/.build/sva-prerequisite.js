'use strict';
// Isolated preflight policy only. Nothing in deployed R2 or the running SVO Pages site imports this module.
// Passing this gate means "may START the draft SVA lesson", not "English foundation mastered".
const SVO_ID='en-foundation-svo';
const SVA_ID='en-subject-verb-agreement';
const fail=reason=>({ready:false,mastered:false,reason});

function checkSvaPrerequisite(backup,svoUnit,svaUnit){
  if(!backup||!Array.isArray(backup.events)||!Array.isArray(backup.sessions))
    return fail('missing-or-invalid-learning-history');
  if(svoUnit?.id!==SVO_ID||svaUnit?.id!==SVA_ID)
    return fail('course-identity-mismatch');
  if(!svaUnit.prerequisites?.includes(SVO_ID))
    return fail('sva-prerequisite-not-declared');
  if(svaUnit.distribution!=='held-pending-review'||svaUnit.reviewRecord?.expertApproved!==false)
    return fail('unverified-course-release-boundary');
  const expected=(svoUnit.delayedQuestions||[]);
  if(expected.length!==3||expected.filter(q=>q.type==='subjective').length!==1||
      expected.filter(q=>['single','multi'].includes(q.type)).length!==2)
    return fail('unexpected-svo-delayed-question-contract');
  const study=backup.sessions.find(s=>s.id==='unit:'+SVO_ID);
  const review=backup.sessions.find(s=>s.id==='review:'+SVO_ID);
  if(!study||study.unitVersion!==svoUnit.version||study.stage!=='scheduled')
    return fail('svo-full-session-not-finished');
  if(!review||review.unitId!==SVO_ID||review.state!=='subjective-pending'||
      review.subjectivePending!==true||review.scoreEstimate!==null)
    return fail('svo-review-status-not-confirmed');
  const rows=backup.events.filter(e=>e.unitId===SVO_ID&&e.unitVersion===svoUnit.version&&
      Number.isSafeInteger(e.revision)&&e.revision>0).sort((a,b)=>a.revision-b.revision);
  const starts=rows.filter(e=>e.action==='review-start');
  if(!starts.length)return fail('no-actual-delayed-review');
  const latest=starts.at(-1);
  const after=rows.filter(e=>e.revision>latest.revision);
  const completed=after.filter(e=>e.action==='scheduled');
  if(completed.length!==1||completed[0].revision!==after.at(-1)?.revision)
    return fail('delayed-review-not-finalized');
  const answered=after.filter(e=>e.action==='answered');
  if(answered.length!==expected.length)return fail('delayed-review-question-count-mismatch');
  for(const q of expected){
    const hits=answered.filter(e=>e.payload?.questionId===q.id);
    if(hits.length!==1)return fail('missing-delayed-answer:'+q.id);
    const row=hits[0],p=row.payload;
    if(p.questionVersion!==svoUnit.version||p.questionSnapshot?.id!==q.id||
        JSON.stringify(p.questionSnapshot)!==JSON.stringify(q)||p.answerVisible!==false)
      return fail('untrusted-answer-snapshot:'+q.id);
    if(q.type==='subjective'){
      if(p.grade?.method!=='reference-only'||p.grade.correct!==null||p.grade.score!==null||
          typeof p.answer!=='string'||!p.answer.trim())
        return fail('unverified-subjective-answer:'+q.id);
    }else if(p.grade?.method!=='objective'||p.grade.correct!==true||p.grade.score!==1)
      return fail('delayed-objective-not-correct:'+q.id);
  }
  const subjective=expected.find(q=>q.type==='subjective');
  const final=completed[0].payload;
  if(final?.reflection?.questionId!==subjective.id||
      final?.reflection?.automaticCategory!=='subjective-pending'||
      final?.reflection?.selfRubricSource!=='user-checklist-not-score'||
      final?.subjectivePending!==true||final?.scoreEstimate!==null)
    return fail('subjective-feedback-not-persisted');
  return {ready:true,mastered:false,reason:'full-delayed-practice-completed-ungraded-subjective'};
}
const SvaPrerequisite={checkSvaPrerequisite,SVO_ID,SVA_ID};
if(typeof module!=='undefined')module.exports=SvaPrerequisite;else window.SvaPrerequisite=SvaPrerequisite;
