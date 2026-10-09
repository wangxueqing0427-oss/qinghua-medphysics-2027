function objectiveCorrect60(q,pick){
  if(q.type==='multi'){if(!Array.isArray(pick)||!Array.isArray(q.answer))return false;const a=[...new Set(pick)].sort((a,b)=>a-b),b=q.answer.slice().sort((a,b)=>a-b);return a.length===b.length&&a.every((x,i)=>x===b[i]);}
  return pick===q.answer;
}
// Connect the existing daily reading questions to the common wrong/review loop.
const readingChapter60=CHAPTERS.find(c=>c.subject==='en'&&c.title.includes('阅读'))||CHAPTERS.find(c=>c.subject==='en');
ENGLISH_PASSAGES.forEach(p=>(p.qs||[]).forEach((q,i)=>{const id='q60-en-reading-'+p.id+'-'+i;if(!QUESTIONS.some(x=>x.id===id))QUESTIONS.push({id,subject:'en',chapterId:readingChapter60.id,type:'single',stem:p.title+'\n'+p.text+'\n\n'+q.q,options:q.opts,answer:q.a,explain:q.explain||'回原文定位并核对正确选项；不要只记选项字母。',source:'existing_daily_reading'});}));
const enPassAnswerBase60=enPassAnswer;
enPassAnswer=function(qi,oi){const st=window._en;if(!st||st.ans[qi]!==undefined)return;enPassAnswerBase60(qi,oi);const q=QUESTIONS.find(x=>x.id==='q60-en-reading-'+st.pass.id+'-'+qi);if(q){if(oi===q.answer)Store.recordRight(q);else Store.recordWrong(q,'阅读定位');}};
function quizKey60(params){const p=params||{};return 'quiz:'+JSON.stringify(Object.fromEntries(Object.keys(p).sort().map(k=>[k,p[k]])));}
function session60(kind){return (Store.get().sessions60||{})[kind]||null;}
function saveSession60(kind,value){Store.update(s=>{if(!s.sessions60)s.sessions60={};s.sessions60[kind]=value;});}
function clearSession60(kind){const key=kind==='quiz'?quizKey60(window._quiz?.params):kind==='mock'?'mock:'+(mockState?.routeKind||'353'):kind;Store.update(s=>{if(s.sessions60)delete s.sessions60[key];});}
function persistQuiz60(){const q=window._quiz;if(!q)return;const {list,...rest}=q;saveSession60(quizKey60(q.params),{...rest,ids:list.map(x=>x.id)});}
function restoreQuiz60(params){const row=session60(quizKey60(params));if(!row)return null;const list=(row.ids||[]).map(id=>QUESTIONS.find(q=>q.id===id));if(!list.length||list.some(x=>!x)||!Number.isInteger(row.i)||row.i<0||row.i>=list.length)return null;return {...row,list};}
function drawQuiz(){
  drawQuizBase60();const st=window._quiz;if(!st)return;
  if(st.judged){
    const q=st.list[st.i];const text=['noun','short','case'].includes(q.type);
    const buttons=Array.from(document.querySelectorAll('.opt'));buttons.forEach(b=>b.disabled=true);
    const card=$('.card');if(!card)return;
    const box=document.createElement('div');box.className='box';
    box.innerHTML=`<b>${st.textPending?'对照参考答案后自评':'本题已判分，结果已保存'}</b><p>${escapeHtml(Array.isArray(q.answer)?q.answer.map(x=>String.fromCharCode(65+x)).join('、'):text?q.answer:'参考答案：'+String.fromCharCode(65+q.answer))}</p><p>${escapeHtml(q.explain||'')}</p>${st.textPending?'<button class="btn" onclick="selfJudge(false)">我错了</button><button class="btn forest" onclick="selfJudge(true)">我基本对</button>':'<button class="btn block" onclick="nextQuiz()">下一题 / 看结果</button>'}`;
    card.appendChild(box);if(text&&$('#textAns'))$('#textAns').value=st.draft||'';
  }else if(st.multiPicks){st.multiPicks.forEach(i=>$('#op'+i)?.classList.add('on'));}
  const draft=$('#textAns');if(draft){draft.value=st.draft||'';draft.oninput=()=>{st.draft=draft.value;persistQuiz60();};}
}
const pickOptBase60=pickOpt,submitMultiBase60=submitMulti,toggleMultiBase60=toggleMulti;
pickOpt=function(i){pickOptBase60(i);persistQuiz60();};
submitMulti=function(){submitMultiBase60();persistQuiz60();};
toggleMulti=function(i){toggleMultiBase60(i);persistQuiz60();};
function persistMock60(){if(!mockState||mockState.submitted)return;const {list,...rest}=mockState;saveSession60('mock:'+(mockState.routeKind||'353'),{...rest,ids:list.map(q=>q.id)});}
function restoreMock60(kind){const row=session60('mock:'+kind);if(!row||row.routeKind!==kind||row.submitted)return null;const list=(row.ids||[]).map(id=>QUESTIONS.find(q=>q.id===id));if(!list.length||list.some(x=>!x)||!Number.isInteger(row.i)||row.i<0||row.i>=list.length||!Number.isFinite(row.end))return null;return {...row,list};}
function moveMock60(delta){if(!mockState||mockState.submitted)return;mockState.i=Math.max(0,Math.min(mockState.list.length-1,mockState.i+delta));persistMock60();drawMock();}
// Keep in-progress full politics mock without changing its old fields.
const fullViewBase60=viewPoliticsFull,fullPickBase60=politicsFullPick,fullNextBase60=politicsFullNext,fullFinishBase60=finishPoliticsFull;
viewPoliticsFull=function(){if(!polFullState)polFullState=session60('politicsFull');fullViewBase60();if(polFullState)saveSession60('politicsFull',polFullState);};
politicsFullPick=function(i){fullPickBase60(i);if(polFullState)saveSession60('politicsFull',polFullState);};
politicsFullNext=function(){fullNextBase60();if(polFullState)saveSession60('politicsFull',polFullState);};
finishPoliticsFull=function(){fullFinishBase60();clearSession60('politicsFull');};
