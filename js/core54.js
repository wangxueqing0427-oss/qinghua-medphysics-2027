/* V54: retain the legacy storage key, task ids and learning routes. */
const Core54 = (() => {
  const budgets = {normal:[60,40,20], busy:[25,15,5], trip:[8,5,2], dinner:[8,5,2]};
  function schedule(tasks, s, date) {
    const yesterday = Store.addDays(date,-1);
    const history = s.dailyHistory || [];
    const prev = history.find(x=>x.date===yesterday);
    const recovery = !!prev && !Object.values(prev.done||{}).some(Boolean);
    const mode = recovery ? 'trip' : (budgets[s.mode] ? s.mode : 'normal');
    const ranked = tasks.map((t,i)=>{
      let boost = t.core==='353'?20:0;
      const reasons=[];
      if(prev && !(prev.done||{})[t.id]) {boost+=25;reasons.push('昨日未完成，今天优先恢复');}
      if(t.core==='en' && [1,2,3].every(n=>{
        const row=history.find(x=>x.date===Store.addDays(date,-n));
        return row && !(row.done||{})[t.id];
      })) {boost+=60;reasons.push('英语连续三个记录日未完成');}
      if(prev && ['review','redo'].includes(((prev.quality||{})[t.id]||{}).grade)) {boost+=30;reasons.push('昨日掌握不稳，优先巩固');}
      return {...t, mins:budgets[mode][['353','en','pol'].indexOf(t.core)], why:t.why+(reasons.length?' '+reasons.join('；')+'。':''), rank:boost-i};
    }).sort((a,b)=>b.rank-a.rank);
    return {tasks:ranked, recovery, mode};
  }
  return {schedule};
})();

const legacyStudyEngine54 = studyEngine;
studyEngine = function () {
  const base=legacyStudyEngine54(), s=Store.get(), date=Store.todayStr();
  let plan=s.core54Plan;
  if(!plan || plan.date!==date || !Array.isArray(plan.tasks) || plan.tasks.length!==3) {
    plan={date, ...Core54.schedule(base.tasks,s,date)};
    Store.update(state=>{state.core54Plan=plan;});
  } else {
    // Mode changes alter budget only: keep task identity, targets and ordering.
    const timed=Core54.schedule(plan.tasks,s,date);
    plan={...plan, mode:timed.mode, recovery:timed.recovery, tasks:plan.tasks.map(t=>({...t,mins:timed.tasks.find(x=>x.id===t.id).mins}))};
  }
  return {...base,tasks:plan.tasks,recovery:plan.recovery};
};

todayTasks = function () {
  const s=Store.get();
  return studyEngine().tasks.map(t=>({...t,text:t.title})).concat((s.today.extra||[]).map(x=>({...x,tag:'临时',href:'#/',why:'你添加的任务'})));
};

function setBattleMode(mode) { Store.setMode(mode); viewHome(); }
function speakWord54() {
  const word=window._en && window._en.words[window._en.i];
  if(!word) return;
  if(!('speechSynthesis' in window)) {alert('当前浏览器不支持朗读，请继续释义与例句训练。');return;}
  const utterance=new SpeechSynthesisUtterance(word[0]);
  utterance.lang='en-US'; utterance.rate=0.8;
  utterance.onerror=()=>alert('朗读暂不可用，请检查设备语音与网络设置。');
  window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);
}
viewHome = function () {
  const plan=studyEngine(), s=Store.get(), tasks=todayTasks();
  const done=tasks.filter(t=>s.today.done[t.id]).length;
  const next=tasks.find(t=>!s.today.done[t.id]);
  app.innerHTML=header('今日作战','V54.0 · 上岸核心版')+`<main class="wrap battle54">
    <section class="card"><div class="row"><b>${escapeHtml(s.today.date)}</b><span class="tag green">${done}/${tasks.length} 项完成</span></div>
    <p class="small">距已保存的备考锚点 ${Store.daysLeft()} 天 · ${escapeHtml(s.examDate)}（非官方考试日期）</p>
    <div class="battle-modes">${[['normal','正常 · 120分钟'],['busy','忙碌 · 45分钟'],['trip','极限 · 15分钟']].map(([id,label])=>`<button class="btn ${s.mode===id||(id==='trip'&&s.mode==='dinner')?'':'ghost'}" aria-pressed="${s.mode===id||(id==='trip'&&s.mode==='dinner')}" onclick="setBattleMode('${id}')">${label}</button>`).join('')}</div>
    ${plan.recovery?'<p class="box">昨天没有完成记录，今天先恢复15分钟最低任务。</p>':''}
    <p>今天核心任务约 ${plan.tasks.reduce((n,t)=>n+t.mins,0)} 分钟${s.today.extra.length?'，另有自选临时任务':''}。</p>
    <button class="btn block" onclick="go('/execute')">${next?'开始作战 · '+escapeHtml(next.tag):'今日已完成 · 查看总结'}</button></section>
    ${tasks.map((t,i)=>`<section class="card"><div class="row"><span class="tag">${s.today.done[t.id]?'已完成':i+1+' · '+escapeHtml(t.tag)}</span><span>${t.mins}分钟</span></div><h3>${escapeHtml(t.text)}</h3><p class="small">${escapeHtml(t.why)}</p><button class="btn ghost block" onclick="Store.startTask('${t.id}');go('${t.href.replace(/^#/,'')}')">${s.today.done[t.id]?'再次学习':s.today.started[t.id]?'继续学习':'进入学习'}</button>${s.today.started[t.id]&&!s.today.done[t.id]?`<button class="btn forest block" onclick="finishExecutionTask('${t.id}')">完成并判断掌握质量</button>`:''}</section>`).join('')}
    <section class="card"><h3>学习与记录</h3><div class="battle-links">${[['/score353','353主战场'],['/english','英语突破'],['/politics','政治学习'],['/review','到期复习 · '+Store.dueIds().length],['/wrong','错误中心'],['/backup','数据保险箱'],['/command','上岸仪表盘'],['/learn','全部课程']].map(([path,label])=>`<button class="btn ghost" onclick="go('${path}')">${label}</button>`).join('')}</div></section>
    <p class="small">当日学习内容固定，切换状态只调整时间。做完后按掌握情况评级，明天再安排复习。</p>
  </main>`+tabbar('/');
};
