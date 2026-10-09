const PLAN2028 = {
  intake:2028, examMonth:'2027-12', planningDate:'2027-12-18', goal:350, stretch:360,
  officialStatus:'2028级招生目录与考试大纲待发布或核实；暂参考2027级353大纲。',
  source:'https://vsph.tsinghua.edu.cn/info/1025/2775.htm', verified:'2026-10-09',
  phases:[
    {from:'2026-10-01',to:'2027-02-28',name:'基础与习惯',allocation:'英语45% / 353 45% / 政治10%',exit:'用诊断题定位弱项；词义回忆与句子主干同步，353完成理解和首次闭卷。'},
    {from:'2027-03-01',to:'2027-06-30',name:'第一轮完成与强化',allocation:'英语40% / 353 45% / 政治15%',exit:'353逐章闭卷和题型训练，英语持续阅读；每月一次同难度阶段测评。'},
    {from:'2027-07-01',to:'2027-09-30',name:'真题与专项',allocation:'英语35% / 353 45% / 政治20%',exit:'合法来源真题限时复盘；按错误证据分配时间，核实2028级招生要求。'},
    {from:'2027-10-01',to:'2027-11-30',name:'整合与模拟',allocation:'英语30% / 353 45% / 政治25%',exit:'限时测试和书面表达，时政使用对应考试年度权威材料；按真实模拟成绩修正计划。'},
    {from:'2027-12-01',to:'2027-12-31',name:'考前收口',allocation:'按薄弱项微调',exit:'保留错题、主干和作息，不追求堆新资料；具体考试日期以官方公告为准。'}
  ]
};
function preparationGap60(){
  const s=Store.get();
  const dates=[{date:s.today.date,done:s.today.done},...(s.dailyHistory||[])].filter(r=>r&&r.date&&Object.values(r.done||{}).some(Boolean)).map(r=>r.date).sort().reverse();
  if(!dates.length)return 0;
  return Math.max(0,Math.round((new Date(Store.todayStr()+'T12:00:00')-new Date(dates[0]+'T12:00:00'))/86400000));
}
function fitDailyBudget60(tasks,budgets,mode){
  const weekend=[0,6].includes(new Date().getDay()),gap=preparationGap60();
  const limit=mode==='busy'||mode==='dinner'?15:mode==='trip'?30:gap>=3?30:weekend?120:90;
  const weights=tasks.map((t,i)=>Math.max(1,budgets[i])*(Store.daysLeft()>300?(t.core==='en'?1.5:t.core==='353'?1.15:0.55):1));
  const result=tasks.map(()=>5);let units=Math.max(0,Math.floor((limit-result.length*5)/5));
  const sum=weights.reduce((a,b)=>a+b,0),shares=weights.map(x=>units*x/sum),whole=shares.map(Math.floor);
  whole.forEach((n,i)=>result[i]+=5*n);
  let remaining=units-whole.reduce((a,b)=>a+b,0);
  const order=shares.map((x,i)=>({i,remainder:x-whole[i]})).sort((a,b)=>b.remainder-a.remainder);
  for(let i=0;i<remaining;i++)result[order[i%order.length].i]+=5;
  return result;
}
function stableTasks60(tasks,mode){
  const s=Store.get(),old=s.plan60;
  if(old&&old.date===Store.todayStr()&&Array.isArray(old.tasks)&&old.tasks.length===tasks.length){
    return old.tasks.map(t=>({...t,mins:tasks.find(x=>x.id===t.id)?.mins||5}));
  }
  const gap=preparationGap60();
  const selected=coreReviewTasks60(tasks,mode).map(t=>({...t,why:(gap>=3?'中断后恢复：只处理今天的小任务，不补积压任务。 ':'')+t.why}));
  Store.update(x=>{x.plan60={date:Store.todayStr(),tasks:selected};});return selected;
}
function coreReviewTasks60(tasks,mode){
  const state=Store.get(),today=Store.todayStr(),limit=mode==='busy'||mode==='dinner'?2:6;
  return tasks.map(t=>{const subjects=t.core==='353'?['epi','stats','ph','mp']:[t.core];const due=Object.values(state.wrong).filter(w=>(!w.mastered||(w.due&&w.due<=today))&&(!w.due||w.due<=today)&&subjects.includes(w.subject)&&QUESTIONS.some(q=>q.id===w.id));if(!due.length)return t;const filter=t.core==='353'?'core=353':'subject='+t.core;return {...t,title:'到期错题｜先复习'+Math.min(limit,due.length)+'题',href:'#/practice/run?wrong=1&due=1&'+filter+'&limit='+limit,why:'系统按错题到期日安排；今天只做少量，不把积压题全塞进来。',corrected:true};});
}
function viewPlan2028(){
  const today=Store.todayStr();
  app.innerHTML=header('2028级备考计划','350+目标 · 360冲刺 · 预计2027年12月初试',true)+`<main class="wrap"><section class="card"><b>${escapeHtml(PLAN2028.officialStatus)}</b><p>方向：医学物理与健康；英语、政治、353卫生综合。2027-12-18只是内部倒计时锚点，不能当作正式考试日期。</p><p><a href="${PLAN2028.source}" target="_blank" rel="noopener">查看2027级官方353参考大纲</a> · 核对日期 ${PLAN2028.verified}</p></section><section class="card"><b>今天的可持续学习量</b><p>正常工作日90分钟；忙碌/饭局后15分钟；出差30分钟；周末最多120分钟。连续中断≥3天后，正常日先恢复到30分钟，不累积任务债务。</p><p>基础期优先保护英语词句和353理解。分钟分配会按掌握、到期复习和答题结果调整；低基础也可早做简单句与短阅读，不必等所有词学完。</p><button class="btn block" onclick="go('/execute')">现在只做这一项</button></section>${PLAN2028.phases.map(p=>`<section class="card"><span class="tag ${p.from<=today&&today<=p.to?'green':''}">${p.from}—${p.to}</span><h3>${p.name}</h3><p>${p.allocation}</p><p>${p.exit}</p></section>`).join('')}<section class="card"><b>如何衡量进步</b><p>每月比较同难度阶段测试、闭卷表达和间隔回忆。掌握颜色与自评不等于考试分数。350+与360需要真实限时成绩校准，任何系统都不能保证录取。</p><p>353参考大纲包括公卫、流病与统计、基础与交叉。医学物理方向也需要测量评价、辐射防护、核医学与放疗原理，以及AI、健康数据和环境健康的分析应用。</p></section></main>`+tabbar('/execute');
}
function render(){
  try{return renderUnsafe60();}catch(e){
    console.error(e);
    app.innerHTML='<main class="wrap"><section class="card"><h2>已停止本次操作，保护原学习记录</h2><p>请勿清除网站数据。先导出原始记录，再联系维护者检查。</p><button class="btn" onclick="exportRaw60()">导出原始记录</button></section></main>';
  }
}
function exportRaw60(){
  try{const keys=['qh2028_test_os_v1','qh2028_test_os_v1_before_v60'];const payload={format:'qh-raw-recovery-v1',exportedAt:new Date().toISOString(),records:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]))};const u=URL.createObjectURL(new Blob([JSON.stringify(payload)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='清华备考-原始记录-请保留.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),60000);}catch(e){alert('导出失败，请停止操作并保留浏览器数据：'+e.message);}
}
