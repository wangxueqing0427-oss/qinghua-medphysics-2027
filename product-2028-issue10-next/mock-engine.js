'use strict';
// Diagnostic mini-exam only. NOT official syllabus coverage, exam score, or a full-length mock.
// Works with existing unreviewed draft questions and the original reference-only grading contract.
(function(global){
  const SUBJECTS=['en','pol','353'];
  const SUBJECT_NAMES={en:'英语',pol:'政治','353':'353卫生综合',all:'三科混合'};
  const questionLists=['basicQuestions','applicationQuestions','delayedQuestions'];
  const allowedTypes=['single','multi','number','subjective'];
  function invariant(test,reason){if(!test)throw Error(reason);}
  function lookup(pack,ref){
    const unit=pack.units.find(u=>u.id===ref.unitId);
    invariant(unit&&unit.version===ref.unitVersion,'课程版本发生变化，请保留原记录并检查版本');
    const q=questionLists.flatMap(k=>unit[k]||[]).find(q=>q.id===ref.questionId);
    invariant(q&&(!ref.questionVersion||q.version===ref.questionVersion),'题目版本发生变化，停止评分');
    invariant(allowedTypes.includes(q.type),'Unsupported question type');
    return {unit,question:q};
  }
  function eligible(pack,subject){
    return pack.units.filter(u=>u.subject===subject).flatMap(unit=>
      questionLists.flatMap(key=>(unit[key]||[]).filter(q=>allowedTypes.includes(q.type)).map(q=>({unit,q}))));
  }
  function choose(pairs,count,used){
    const selected=[];
    for(const enforceUniqueUnit of [true,false]){
      for(const row of pairs){
        if(selected.length>=count)break;
        if(selected.some(x=>x.q.id===row.q.id))continue;
        if(enforceUniqueUnit&&(used.has(row.unit.id)||selected.some(x=>x.unit.id===row.unit.id)))continue;
        selected.push(row);
      }
    }
    invariant(selected.length===count,'题库不足，无法建立本组诊断题');
    selected.forEach(x=>used.add(x.unit.id));
    return selected;
  }
  function buildRefs(pack,subject){
    invariant(pack?.units?.length>=71,'This candidate requires the frozen 71-course internal draft');
    invariant(subject==='all'||SUBJECTS.includes(subject),'无效测评科目');
    const subjects=subject==='all'?SUBJECTS:[subject];
    const result=[];
    for(const s of subjects){
      const pool=eligible(pack,s),used=new Set(),size=subject==='all'?12:24;
      const subjective=pool.filter(r=>r.q.type==='subjective');
      const objective=pool.filter(r=>r.q.type!=='subjective');
      // Always include one human-review answer where available; never invent a score for it.
      const selected=subjective.length?choose(subjective,Math.min(4,subjective.length),used):[];
      selected.push(...choose(objective,size-selected.length,used));
      result.push(...selected.map(({unit,q})=>({
        unitId:unit.id,unitVersion:unit.version,questionId:q.id,
        questionVersion:q.version||null,subject:s,type:q.type
      })));
    }
    invariant(result.length===(subject==='all'?36:24),'Unexpected miniature exam size');
    invariant(new Set(result.map(x=>x.questionId)).size===result.length,'Duplicate sampled question');
    return result;
  }
  function create(pack,subject,now,id){
    const started=Date.parse(now),limitMinutes=subject==='all'?180:180;
    invariant(Number.isFinite(started),'Invalid exam start');
    invariant(typeof id==='string'&&id.length>=8,'Invalid exam identity');
    return {
      schemaVersion:1,id,kind:'provisional-long-training',version:'issue10-examloop-2',
      subject,startedAt:new Date(started).toISOString(),
      deadlineAt:new Date(started+limitMinutes*60000).toISOString(),
      limitMinutes,questions:buildRefs(pack,subject),answers:{},currentIndex:0,
      submittedAt:null,endReason:null
    };
  }
  function check(state,pack){
    invariant(state?.schemaVersion===1&&state.kind==='provisional-long-training'&&state.version==='issue10-examloop-2','Invalid practice exam');
    invariant(state.subject==='all'||SUBJECTS.includes(state.subject),'Invalid subject');
    invariant(Array.isArray(state.questions)&&state.questions.length===(state.subject==='all'?36:24),'Exam question list mismatch');
    invariant(new Set(state.questions.map(x=>x.questionId)).size===state.questions.length,'Duplicate exam question');
    invariant(Number.isInteger(state.currentIndex)&&state.currentIndex>=0&&state.currentIndex<state.questions.length,'Invalid exam cursor');
    invariant(Number.isFinite(Date.parse(state.startedAt))&&Number.isFinite(Date.parse(state.deadlineAt)),'Invalid time');
    invariant(Date.parse(state.deadlineAt)-Date.parse(state.startedAt)===(state.subject==='all'?180:180)*60000,'Invalid duration');
    invariant(state.answers&&typeof state.answers==='object'&&!Array.isArray(state.answers),'Invalid answers');
    for(const ref of state.questions)lookup(pack,ref);
    invariant(Object.keys(state.answers).every(id=>state.questions.some(q=>q.questionId===id)),'Answer does not belong to this exam');
    return true;
  }
  function normalize(q,answer){
    if(answer===null||answer===undefined||answer==='')return null;
    if(q.type==='single'){
      invariant(Number.isInteger(answer)&&answer>=0&&answer<q.options.length,'请选择一个有效选项');return answer;
    }
    if(q.type==='multi'){
      invariant(Array.isArray(answer)&&answer.length>0&&answer.every(x=>Number.isInteger(x)&&x>=0&&x<q.options.length)&&new Set(answer).size===answer.length,'请选择有效选项');
      return [...answer].sort((a,b)=>a-b);
    }
    if(q.type==='number'){
      invariant(typeof answer==='object'&&Number.isFinite(answer.value)&&answer.unit===q.unit,'请输入有效数字');
      return {value:answer.value,unit:q.unit};
    }
    invariant(typeof answer==='string'&&answer.trim().length>0&&answer.length<=10000,'请填写文字答案');
    return answer;
  }
  function setAnswer(state,pack,index,answer,now){
    check(state,pack);
    invariant(!state.submittedAt,'Already submitted');
    invariant(Date.parse(now)<Date.parse(state.deadlineAt),'考试已到时间，请先交卷');
    invariant(Number.isInteger(index)&&index>=0&&index<state.questions.length,'Invalid question index');
    const ref=state.questions[index],{question}=lookup(pack,ref);
    const value=normalize(question,answer);
    const next=structuredClone(state);
    if(value===null)delete next.answers[ref.questionId];
    else next.answers[ref.questionId]=value;
    return next;
  }
  function setCursor(state,pack,index){
    check(state,pack);
    invariant(!state.submittedAt,'Cannot navigate submitted exam');
    invariant(Number.isInteger(index)&&index>=0&&index<state.questions.length,'Invalid cursor');
    return {...state,currentIndex:index};
  }
  function submit(state,pack,now,reason){
    check(state,pack);
    invariant(!state.submittedAt,'Already submitted');
    invariant(Number.isFinite(Date.parse(now)),'Invalid submission time');
    invariant(['manual','timeout'].includes(reason),'Invalid submission reason');
    const next=structuredClone(state);
    next.submittedAt=new Date(now).toISOString();
    next.endReason=Date.parse(now)>=Date.parse(next.deadlineAt)?'timeout':reason;
    return next;
  }
  function report(state,pack,engine){
    check(state,pack);
    invariant(state.submittedAt,'Not yet submitted');
    let objectiveTotal=0,objectiveAnswered=0,objectiveCorrect=0,subjectivePending=0,unanswered=0;
    const rows=state.questions.map(ref=>{
      const {question,unit}=lookup(pack,ref),answer=Object.hasOwn(state.answers,ref.questionId)?state.answers[ref.questionId]:null;
      let grade=null;
      if(answer===null)unanswered++;
      else{
        grade=engine.grade(question,answer);
        if(question.type==='subjective'){
          invariant(grade.score===null&&grade.correct===null,'No machine scoring of subjective answers');
          subjectivePending++;
        }else{
          invariant(grade.method==='objective'&&(grade.correct===true||grade.correct===false),'Objective grade contract mismatch');
          objectiveAnswered++;
          if(grade.correct)objectiveCorrect++;
        }
      }
      if(question.type!=='subjective')objectiveTotal++;
      return {ref,unitTitle:unit.title,stem:question.stem,type:question.type,answer,grade,
        reference:state.submittedAt?question.answer:null,
        rubric:question.type==='subjective'?question.rubric:[],explanation:question.explanation};
    });
    return {
      kind:'provisional-long-training',formalExamScore:null,officialSyllabusCoverage:null,predictedScore:null,provisional:true,officialPaperEquivalent:false,
      objectiveTotal,objectiveAnswered,objectiveCorrect,subjectivePending,unanswered,
      questionCount:rows.length,rows
    };
  }
  function selfAssess(state,pack,questionId,points,note,now){
    check(state,pack);invariant(state.submittedAt,'Submit before self assessment');
    const ref=state.questions.find(q=>q.questionId===questionId);invariant(ref,'Question outside exam');const {question:q}=lookup(pack,ref);
    invariant(q.type==='subjective'&&Object.hasOwn(state.answers,questionId),'Only an answered subjective question may be self reviewed');
    invariant(Array.isArray(points)&&new Set(points).size===points.length&&points.every(n=>Number.isInteger(n)&&n>=0&&n<q.rubric.length),'Invalid rubric points');invariant(typeof note==='string'&&note.length<=10000&&Number.isFinite(Date.parse(now)),'Invalid self assessment');
    const next=structuredClone(state);next.selfAssessments={...next.selfAssessments,[questionId]:{points:[...points],note,at:now,method:'learner-self-check',score:null,expertApproved:false}};return next;
  }
  function reviewQueue(state,pack,engine,existing,now){
    const r=report(state,pack,engine),rows=new Map(existing.map(x=>[x.id,x]));
    for(const row of r.rows){if(row.answer===null||row.grade?.correct===true)continue;const id=state.id+':'+row.ref.questionId;if(rows.has(id))continue;
      rows.set(id,{id,examId:state.id,ref:row.ref,kind:row.type==='subjective'?'subjective-pending':'objective-wrong',originalAnswer:row.answer,history:[],due:new Date(Date.parse(now)+86400000).toISOString(),successes:0});}
    return [...rows.values()];
  }
  function answerReview(queue,id,pack,engine,answer,now,cause='unclassified'){
    const time=Date.parse(now);invariant(Number.isFinite(time),'Invalid review time');const row=queue.find(x=>x.id===id);invariant(row,'Review not found');invariant(time>=Date.parse(row.due),'Review not due; keep delayed test independent');
    const {question:q}=lookup(pack,row.ref),value=normalize(q,answer);invariant(value!==null,'Independent answer required');const grade=engine.grade(q,value),next=structuredClone(queue),target=next.find(x=>x.id===id);
    invariant(!row.history.some(h=>h.at===now),'Duplicate review submission');target.history.push({answer:value,at:now,grade,cause});target.successes=grade.correct===true?row.successes+1:0;
    const days=grade.correct===true?[1,3,7,14,30][Math.min(target.successes-1,4)]:1;target.due=new Date(time+days*86400000).toISOString();target.kind=grade.correct===null?'subjective-pending':grade.correct?'objective-retested':'objective-wrong';return next;
  }
  function diagnose(state,pack,engine){
    const r=report(state,pack,engine),groups=new Map();for(const row of r.rows){let g=groups.get(row.ref.unitId);if(!g){g={unitId:row.ref.unitId,title:row.unitTitle,objective:0,correct:0,pending:0,unanswered:0};groups.set(row.ref.unitId,g);}if(row.answer===null)g.unanswered++;else if(row.type==='subjective')g.pending++;if(row.type!=='subjective'){g.objective++;if(row.grade?.correct)g.correct++;}}
    return [...groups.values()].map(g=>({...g,next:g.correct<g.objective?'重学本课概念，完成错题到期独立重答。':g.pending?'对照评分要点自评，主观题仍待专业核对。':g.unanswered?'补做未答题。':'后续延迟测试验证，不等同持续掌握。'}));
  }

  const API=Object.freeze({selfAssess,reviewQueue,answerReview,diagnose,SUBJECTS,SUBJECT_NAMES,create,check,lookup,setAnswer,setCursor,submit,report});
  if(typeof module!=='undefined')module.exports=API;
  else global.MockExamEngine=API;
})(typeof window!=='undefined'?window:undefined);
