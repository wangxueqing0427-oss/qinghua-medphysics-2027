'use strict';
// Diagnostic mini-exam only. NOT official syllabus coverage, exam score, or a full-length mock.
// Works with existing unreviewed draft questions and the original reference-only grading contract.
(function(global){
  const SUBJECTS=['en','pol','353'];
  const SUBJECT_NAMES={en:'英语原创整卷',pol:'政治原创整卷','353':'353原创综合卷'};
  const questionLists=['basicQuestions','applicationQuestions','delayedQuestions'];
  const allowedTypes=['single','multi','number','subjective'];
  function invariant(test,reason){if(!test)throw Error(reason);}
  function lookup(pack,ref){
    if(ref.paperId){const paper=pack.examPapers.find(p=>p.id===ref.paperId);invariant(paper&&paper.version===ref.unitVersion,'试卷版本已变化，保留原卷并停止混合判分');const section=paper.sections.find(s=>s.questions.some(q=>q.id===ref.questionId));const q=section?.questions.find(q=>q.id===ref.questionId);invariant(q&&q.type===ref.type,'试卷题目不存在或题型变化');return {unit:{id:paper.id+':'+section.id,title:paper.title+' · '+section.title,subject:paper.subject,version:paper.version},question:q};}
    const unit=pack.units.find(u=>u.id===ref.unitId);invariant(unit&&unit.version===ref.unitVersion,'课程版本已变化，旧答案保留');const q=questionLists.flatMap(k=>unit[k]||[]).find(q=>q.id===ref.questionId);invariant(q,'Question not found');return {unit,question:q};
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
  function buildRefs(pack,subject){const paper=pack.examPapers.find(p=>p.subject===subject);invariant(paper,'请选择一科独立试卷');return paper.sections.flatMap(s=>s.questions.map(q=>({paperId:paper.id,unitId:paper.id+':'+s.id,unitVersion:paper.version,questionId:q.id,questionVersion:q.version||null,subject,type:q.type,points:q.points,sectionId:s.id})));}
  function create(pack,subject,now,id){const paper=pack.examPapers.find(p=>p.subject===subject),started=Date.parse(now);invariant(paper&&Number.isFinite(started)&&typeof id==='string'&&id.length>=8,'Invalid paper start');return {schemaVersion:1,id,kind:'original-composite-paper',version:'issue10-paper-v1',subject,paperId:paper.id,paperHash:paper.contentHash,startedAt:new Date(started).toISOString(),deadlineAt:new Date(started+paper.minutes*60000).toISOString(),limitMinutes:paper.minutes,questions:buildRefs(pack,subject),answers:{},currentIndex:0,submittedAt:null,endReason:null};}
  function check(state,pack){invariant(state?.schemaVersion===1&&state.kind==='original-composite-paper'&&state.version==='issue10-paper-v1','试卷状态无效，原记录保留');const paper=pack.examPapers.find(p=>p.id===state.paperId&&p.subject===state.subject);invariant(paper&&typeof paper.contentHash==='string'&&state.paperHash===paper.contentHash,'试卷正文哈希变化，保留旧答卷并停止重新评分');invariant(JSON.stringify(state.questions)===JSON.stringify(buildRefs(pack,state.subject)),'试卷题目或分值版本已变化');invariant(Number.isInteger(state.currentIndex)&&state.currentIndex>=0&&state.currentIndex<state.questions.length,'Invalid cursor');invariant(Number.isFinite(Date.parse(state.startedAt))&&Date.parse(state.deadlineAt)-Date.parse(state.startedAt)===paper.minutes*60000,'Invalid deadline');invariant(state.answers&&Object.keys(state.answers).every(id=>state.questions.some(q=>q.questionId===id)),'Invalid answers');for(const ref of state.questions)lookup(pack,ref);return true;}
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
    let objectivePoints=0,objectivePossiblePoints=0,subjectivePossiblePoints=0;let objectiveTotal=0,objectiveAnswered=0,objectiveCorrect=0,subjectivePending=0,unanswered=0;
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
      if(question.type!=='subjective'){objectiveTotal++;objectivePossiblePoints+=question.points;if(grade?.correct)objectivePoints+=question.points;}else subjectivePossiblePoints+=question.points;
      return {ref,unitTitle:unit.title,stem:question.stem,type:question.type,answer,grade,
        reference:state.submittedAt?question.answer:null,
        rubric:question.type==='subjective'?question.rubric:[],explanation:question.explanation};
    });
    return {
      objectivePoints,objectivePossiblePoints,subjectivePossiblePoints,paperTotal:objectivePossiblePoints+subjectivePossiblePoints,kind:'original-composite-paper',formalExamScore:null,officialSyllabusCoverage:null,predictedScore:null,provisional:true,officialPaperEquivalent:false,
      objectiveTotal,objectiveAnswered,objectiveCorrect,subjectivePending,unanswered,
      questionCount:rows.length,rows
    };
  }
  function selfAssess(state,pack,questionId,points,note,now,learnerPoints=null){
    check(state,pack);invariant(state.submittedAt,'Submit before self assessment');
    const ref=state.questions.find(q=>q.questionId===questionId);invariant(ref,'Question outside exam');const {question:q}=lookup(pack,ref);
    invariant(q.type==='subjective'&&Object.hasOwn(state.answers,questionId),'Only an answered subjective question may be self reviewed');
    invariant(Array.isArray(points)&&new Set(points).size===points.length&&points.every(n=>Number.isInteger(n)&&n>=0&&n<q.rubric.length),'Invalid rubric points');invariant(typeof note==='string'&&note.length<=10000&&Number.isFinite(Date.parse(now)),'Invalid self assessment');
    invariant(learnerPoints===null||(Number.isFinite(learnerPoints)&&learnerPoints>=0&&learnerPoints<=q.points),'本人自评分值超出本题范围');const next=structuredClone(state);next.selfAssessments={...next.selfAssessments,[questionId]:{points:[...points],note,at:now,method:'learner-self-check',learnerPoints,score:null,expertApproved:false}};return next;
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
