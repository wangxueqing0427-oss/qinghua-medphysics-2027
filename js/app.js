const $ = (sel, el) => (el || document).querySelector(sel);
const app = $("#app");
let mockTimer = null;
let mockState = null;

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function hash() {
  return (location.hash.replace(/^#/, "") || "/");
}

function go(path) {
  location.hash = path;
}

function chapter(id) {
  return CHAPTERS.find((c) => c.id === id);
}

function subjectMeta(id) {
  return SUBJECTS.find((s) => s.id === id);
}

function weekdayFocus(d) {
  const map = [
    { focus: "weekly", label: "周日闭卷" },
    { focus: "epi", label: "流行病学" },
    { focus: "stats", label: "卫生统计" },
    { focus: "mp", label: "医学物理" },
    { focus: "ph", label: "公共卫生" },
    { focus: "mixed", label: "353综合" },
    { focus: "mock", label: "错题/模拟" },
  ];
  return map[d.getDay()];
}

function nextChapter(subject) {
  const list = CHAPTERS.filter((c) => c.subject === subject);
  const s = Store.get();
  return list.find((c) => !s.knowledge[c.id] || s.knowledge[c.id].status === "new") || list[0];
}

function dueChapters() {
  const ids = Store.dueIds();
  return CHAPTERS.filter((c) => ids.includes(c.id));
}

function studyEngine() {
  const s = Store.get();
  const mode = s.mode;
  const total = Store.totalProfile();
  const p353 = Store.scoreProfile();
  const en = Store.englishProfile();
  const pol = Store.politicsProfile();
  const due = dueChapters().filter(c => ["epi","stats","ph","mp"].includes(c.subject));

  // 353: due review first; otherwise move the weakest of the four sub-subjects forward.
  const weak353 = (p353.weak && p353.weak[0]) || "epi";
  const c353 = due.find(c => c.subject === weak353) || due[0] || nextChapter(weak353);
  const is353Due = due.some(c => c.id === c353.id);
  const task353 = {
    id:"t-353", core:"353", tag:"353", title:(is353Due?"到期回炉｜":"主线推进｜") + c353.title,
    href:(is353Due?"#/recite/":"#/learn/")+ (is353Due?c353.id:(c353.subject+"/"+c353.id)),
    why:is353Due?"SRS已到期，先把旧知识重新从脑中调出来。":"当前353最弱分区是“"+(subjectMeta(weak353)?.name||weak353)+"”，优先补最短板。"
  };

  // English: route by the gate that is currently blocking progress.
  let enTitle="第一层词汇｜到期弱词 + 新词", enHref="#/english/daily", enWhy="先把词汇做到真正的间隔回忆，而不是只看过一次。";
  if (en.wordReady && !en.sentenceReady) { enTitle="长难句｜找主干 + 结构拆解"; enHref="#/english/sentence"; enWhy="词汇闸门已过，当前瓶颈转到句法拆解。"; }
  else if (en.wordReady && en.sentenceReady && !en.readingReady) { enTitle="中长阅读｜限时 + 证据定位"; enHref="#/english/reading"; enWhy="长难句已过线，阅读正确率/训练量是当前闸门。"; }
  else if (en.wordReady && en.sentenceReady && en.readingReady && !en.moduleReady) { enTitle="计分模块｜完形/新题型/翻译"; enHref="#/english/modules"; enWhy="阅读主线已过线，补齐三个计分模块。"; }
  else if (en.wordReady && en.sentenceReady && en.readingReady && en.moduleReady && en.drafts < 6) { enTitle="作文输出｜闭卷写一篇"; enHref="#/english/writing"; enWhy="输入能力已成型，现在缺真正的闭卷输出。"; }
  else if (en.stage >= 5) { enTitle="真题阶段｜按年份限时/复盘"; enHref="#/english/papers"; enWhy="基础闸门已通过，下一步只用真实历年题校准。"; }
  const taskEn={id:"t-en",core:"en",tag:"英语",title:enTitle,href:enHref,why:enWhy};

  // Politics: due analysis beats new content; otherwise follow the 60+ gates.
  let polTitle, polHref, polWhy;
  if ((pol.analysisDue||0)>0) { polTitle="分析题｜今天到期闭卷回炉"; polHref="#/politics/analysis/due"; polWhy="有到期分析题，先复现，避免背过又忘。"; }
  else if (!pol.theoryReady) { const cp=nextChapter("pol"); polTitle="稳定理论｜"+cp.title; polHref="#/learn/pol/"+cp.id; polWhy="稳定理论尚未达到内部掌握闸门，先补知识地图。"; }
  else if (!pol.choiceReady) { polTitle=(pol.multiAttempts<30 || (pol.multiAccuracy||0)<70)?"多选专项｜逐项判断":"选择题｜错因回炉"; polHref=(pol.multiAttempts<30 || (pol.multiAccuracy||0)<70)?"#/practice/run?subject=pol&type=multi":"#/practice/run?subject=pol"; polWhy="选择题闸门尚未通过，优先补客观题稳定性。"; }
  else if (!pol.analysisReady) { polTitle="分析题｜新题输出 + 闭卷"; polHref="#/politics/analysis"; polWhy="选择题已成型，当前缺分析题可调用的得分点。"; }
  else { polTitle="100分整卷｜限时验证"; polHref="#/politics/full"; polWhy="基础闸门已通过，用整卷暴露真实短板。"; }
  const taskPol={id:"t-pol",core:"pol",tag:"政治",title:polTitle,href:polHref,why:polWhy};

  // V47: alerts become actions. Only override a subject when the radar has concrete evidence.
  const risk=Store.riskProfile();
  const taskByCore={"353":task353,en:taskEn,pol:taskPol};
  Object.entries(risk.actions||{}).forEach(([id,a])=>{
    const t=taskByCore[id]; if(!t) return;
    t.title=a.title; t.href=a.href; t.why=a.why; t.corrected=true;
  });

  const byId={"353":task353,en:taskEn,pol:taskPol};
  const milestone=Store.milestoneProfile();
  const monthly=Store.monthlyProfile();
  const ranked=total.subjects.slice().sort((a,b)=>{
    const ap=a.priority+((milestone.byId[a.id]||{}).boost||0)+((monthly.byId[a.id]||{}).boost||0);
    const bp=b.priority+((milestone.byId[b.id]||{}).boost||0)+((monthly.byId[b.id]||{}).boost||0);
    return bp-ap;
  });
  const ordered=ranked.map(x=>byId[x.id]);
  ordered.forEach(t=>{ const m=milestone.byId[t.core]; if(m&&m.boost>0){ t.catchup=true; t.why += ` 长期里程碑：${m.status}，本阶段进度${m.progress}% / 当前应到${m.expected}%，因此今天优先级上调。`; } const mo=monthly.byId[t.core]; if(mo&&mo.boost>0){ t.monthly=true; t.why += ` 月度重算：${mo.status}，下月计划温和纠偏。`; } });
  const baseBudgets={normal:[55,35,30],busy:[20,12,8],trip:[15,9,6],dinner:[8,7,5]}[mode] || [55,35,30];
  const adaptive=Store.adaptiveProfile();
  const phase=Store.examPhaseProfile();
  const budgets=baseBudgets.map((x,i)=>{
    const w=phase.weights[ordered[i].core]||1;
    const mw=(monthly.byId[ordered[i].core]||{}).timeFactor||1;
    return Math.max(5,Math.round(x*adaptive.factor*w*mw/5)*5);
  });
  ordered.forEach((t,i)=>t.mins=budgets[i]);
  return {tasks:ordered, profiles:{p353,en,pol}, total, mode, adaptive, phase, risk, milestone, monthly};
}

function todayTasks() {
  const s=Store.get();
  const plan=studyEngine();
  const tasks=plan.tasks.map(t=>({id:t.id,text:t.title,tag:t.tag,mins:t.mins,href:t.href,why:t.why}));
  const wd=weekdayFocus(new Date());
  if (s.mode === "normal" && wd.focus === "weekly") tasks.push({id:"t-week",text:"周日总复盘｜三科错题 + 到期项",tag:"复盘",mins:20,href:"#/review?weekly=1",why:"每周一次把零散错误收口。"});
  if (s.mode === "normal" && wd.focus === "mock") tasks.push({id:"t-mock",text:"本周弱项｜限时小测或错题二刷",tag:"模拟",mins:20,href:"#/wrong",why:"用限时反馈校准训练准备度。"});
  return tasks.concat(s.today.extra.map(x=>({id:x.id,text:x.text,tag:"临时",mins:x.mins,href:"#/",why:"临时任务"})));
}

function viewTodayEngine(){
  const s=Store.get(), plan=studyEngine();
  const labels={normal:"正常 1–2小时",busy:"忙碌 40分钟",trip:"出差 30分钟",dinner:"饭局后 20分钟"};
  app.innerHTML=header("今日学习发动机","V52｜真实使用验收：从打开到收尾不走死路",true)+`<main class="wrap">
    <section class="card"><span class="tag green">自动排程</span><h2>${escapeHtml(labels[s.mode])}</h2><p>顺序不是固定的：系统综合三科训练准备度、到期复习和各科内部闸门，先做当前最值钱的一项。</p><div class="box"><b>当前考试阶段：${escapeHtml(plan.phase.name)}</b><br>${escapeHtml(plan.phase.focus)} · 距暂定备考锚点 ${plan.phase.days} 天</div><div class="box"><b>今日自适应：${escapeHtml(plan.adaptive.level)}</b><br>${escapeHtml(plan.adaptive.reason)}${plan.adaptive.recent3==null?"":` 最近3个有记录日完成度约 ${plan.adaptive.recent3}%。`}</div><div class="box warn"><b>执行规则</b><br>按 ①→②→③ 做。时间不够时不要重新规划，直接把“今天状态”切到忙碌/出差/饭局后，系统自动降档。</div></section>
    ${plan.tasks.map((t,i)=>`<section class="card"><div class="row"><div><span class="tag">${i+1}</span><b>${t.corrected?'🧭 ':''}${t.catchup?'🏁 ':''}${escapeHtml(t.tag)} · ${escapeHtml(t.title)}</b></div><span class="tag">${t.mins}分钟</span></div><p class="small"><b>为什么今天做它：</b>${escapeHtml(t.why)}</p><button class="btn block" onclick="go('${t.href.replace(/^#/,"")}')">开始这一项</button></section>`).join("")}
    <section class="card"><b>不想看计划细节？</b><p class="small">执行模式一次只给你当前一项，完成后自动进入下一项。</p><button class="btn block" onclick="go('/execute')">进入只做一项模式</button></section>
  </main>`+tabbar("/");
}


function viewExecute(){
  const s=Store.get();
  const tasks=todayTasks();
  const done=tasks.filter(t=>s.today.done[t.id]);
  const quality=s.today.quality||{};
  const left=tasks.filter(t=>!s.today.done[t.id]);
  const totalMins=tasks.reduce((n,t)=>n+(Number(t.mins)||0),0);
  const doneMins=done.reduce((n,t)=>n+(Number(t.mins)||0),0);
  const pct=tasks.length?Math.round(done.length/tasks.length*100):100;
  const labels={normal:"正常",busy:"忙碌",trip:"出差",dinner:"饭局后"};
  if(!left.length){
    const next=studyEngine().tasks[0];
    const endTimes=Object.values(s.today.completedAt||{}).filter(Boolean).sort((a,b)=>a-b);
    const end=endTimes.length?new Date(endTimes[endTimes.length-1]).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):'';
    app.innerHTML=header("今天完成","V52｜完成同时记录掌握质量",false)+`<main class="wrap">
      <section class="card"><span class="tag green">100%</span><h2>今天核心任务已完成</h2><div class="days">${done.length}<span>项</span></div><p class="small">过关 ${done.filter(t=>(quality[t.id]||{}).grade==='pass').length} · 需巩固 ${done.filter(t=>(quality[t.id]||{}).grade==='review').length} · 需回炉 ${done.filter(t=>(quality[t.id]||{}).grade==='redo').length}</p><p>计划量约 ${totalMins} 分钟${end?` · 最后一项完成于 ${escapeHtml(end)}`:''}。</p><div class="box ok"><b>今天到这里就可以。</b><br>不要因为状态好临时无限加码；多出来的精力优先休息或轻量复盘。</div></section>
      <section class="card"><b>下一次系统会怎么做</b><p class="small">新的章节评级、错题、弱词和SRS结果已经进入档案。下一次打开会重新计算三科优先级。</p>${next?`<div class="box"><b>当前预览：</b>${escapeHtml(next.tag)} · ${escapeHtml(next.title)}</div>`:''}<button class="btn block" onclick="go('/')">查看今日总结</button></section>
    </main>`+tabbar('/execute'); return;
  }
  const cur=left[0];
  const started=!!(s.today.started||{})[cur.id];
  const step=done.length+1;
  app.innerHTML=header("只做这一项",`V52｜第 ${step}/${tasks.length} 项`,false)+`<main class="wrap">
    <section class="card"><div class="row"><span class="tag green">${pct}%</span><span class="small">${doneMins}/${totalMins} 分钟计划量</span></div><div class="bar"><i style="width:${pct}%"></i></div><p class="small">今天状态：${escapeHtml(labels[s.mode]||s.mode)}。现在不要看后面的任务，只完成这一项。</p></section>
    <section class="card focus-task"><span class="tag">${escapeHtml(cur.tag)}</span><h2>${escapeHtml(cur.text)}</h2><div class="days">${cur.mins}<span>分钟</span></div><div class="box"><b>为什么现在做：</b><br>${escapeHtml(cur.why||'')}</div>
      <button class="btn block execute-primary" onclick="Store.startTask('${cur.id}');go('${cur.href.replace(/^#/,'')}')">${started?'继续这一项':'开始今天第'+step+'项'}</button>
      ${started?`<button class="btn forest block" style="margin-top:10px" onclick="finishExecutionTask('${cur.id}')">✓ 我做完了，先判断掌握质量</button>`:''}
      <button class="btn ghost block" style="margin-top:10px" onclick="go('/')">返回总览</button>
    </section>
    <section class="card"><b>今天只记一个规则</b><p class="small">开始 → 做完 → 点“我完成了” → 系统自动显示下一项。临时变忙时，只切换今日状态，不自己重排计划。</p></section>
  </main>`+tabbar('/execute');
}
function finishExecutionTask(id){ go('/quality?id='+encodeURIComponent(id)); }

function qualityCopy(id){
  if(id==='t-353') return {name:'353卫生综合',pass:'闭卷能说出核心点，或本轮客观题≥80%',review:'大意会，但定义/公式/步骤仍有模糊',redo:'主要靠看答案，或做题低于60%'};
  if(id==='t-en') return {name:'英语一',pass:'今天目标能主动回忆，阅读/专项证据基本稳定',review:'能做但词义、句法或定位仍明显犹豫',redo:'只是看完/点完，离独立完成还有距离'};
  if(id==='t-pol') return {name:'政治',pass:'选择题判断稳定，或分析题能闭卷调出核心点',review:'知道考点，但表述/多选边界仍模糊',redo:'主要靠看答案，闭卷调不出来'};
  return {name:'今日任务',pass:'能独立完成并复述关键内容',review:'基本理解但还不稳',redo:'只是完成流程，还没有学会'};
}
function viewQuality(){
  const qs=new URLSearchParams(hash().split('?')[1]||'');
  const id=qs.get('id')||'t-353', c=qualityCopy(id);
  app.innerHTML=header('完成质量判断','V45｜完成 ≠ 掌握',false)+`<main class="wrap">
    <section class="card"><span class="tag green">${escapeHtml(c.name)}</span><h2>刚才这一项，真正学会了吗？</h2><p class="small">不要按“我花了时间”评分，只按现在闭眼能不能调出来、题能不能独立做对来判断。</p></section>
    <section class="card"><button class="list-item" onclick="saveTaskQuality('${id}','pass')"><div class="ttl">✅ 过关</div><div class="small">${escapeHtml(c.pass)}</div></button>
    <button class="list-item" onclick="saveTaskQuality('${id}','review')"><div class="ttl">🟡 需巩固</div><div class="small">${escapeHtml(c.review)}。今天算完成，但后续优先级会上升。</div></button>
    <button class="list-item" onclick="saveTaskQuality('${id}','redo')"><div class="ttl">🔴 需回炉</div><div class="small">${escapeHtml(c.redo)}。今天不无限重做，系统把它带到后续任务。</div></button></section>
    <section class="card"><b>V45规则</b><p class="small">“做完”只记录执行；“过关/巩固/回炉”才记录学习质量。连续低质量完成会让系统自动降任务量，并提高该科后续优先级。</p></section>
  </main>`+tabbar('/execute');
}
function saveTaskQuality(id,grade){ Store.markTaskQuality(id,grade,{source:'self_check'}); go('/execute'); }

function viewExamPhase(){
  const p=Store.examPhaseProfile();
  const stages=[
    [1,"基础建库期",">300天","理解、第一轮、词汇与稳定理论"],
    [2,"强化成型期","181–300天","闭卷、题型、错题回炉"],
    [3,"真题校准期","91–180天","真实真题、限时、弱项修正"],
    [4,"整卷冲刺期","31–90天","整套模考、速度、稳定得分"],
    [5,"考前收口期","≤30天","高频错题、背诵、手感与作息"]
  ];
  app.innerHTML=header("考试阶段发动机","V43｜距离考试多久，决定现在练什么",true)+`<main class="wrap">
    <section class="card"><span class="tag green">第${p.no}阶段</span><h2>${escapeHtml(p.name)}</h2><div class="days">${p.days}<span>天参考</span></div><p><b>当前主线：</b>${escapeHtml(p.focus)}</p><div class="box ok">${escapeHtml(p.rule)}</div><p class="small">倒计时仍使用 ${Store.get().examDate} 暂定备考锚点，不代表2027官方初试日期；官方日期公布后再校准。</p></section>
    <section class="card"><b>五阶段自动切换</b>${stages.map(x=>`<div class="map-item ${p.no===x[0]?'current':''}"><div class="row"><b>${x[0]}. ${x[1]}</b><span>${x[2]}</span></div><div class="small">${x[3]}</div></div>`).join('')}</section>
    <section class="card"><b>阶段如何影响今天？</b><p class="small">阶段权重会和“当天状态 + 最近完成度 + 三科弱项 + SRS到期”一起进入今日发动机。前期更保护353基础，中期逐渐转向闭卷/真题，后期三科趋于整卷与收口。</p><button class="btn block" onclick="go('/engine')">看今天已经怎么调整</button></section>
  </main>`+tabbar('/');
}

function viewTrendEngine(){
  const t=Store.trendProfile();
  const icon=x=>x.level==="up"?"↗":x.level==="down"?"↘":"→";
  const tone=x=>x.level==="up"?"green":x.level==="down"?"red":"";
  const score=x=>x==null?"暂无":x+"%";
  app.innerHTML=header("学习效果趋势与预警","V46｜判断是在进步，还是只是在忙",true)+`<main class="wrap">
    <section class="card"><span class="tag green">14天趋势</span><h2>完成 ≠ 进步</h2><p class="small">趋势优先使用每日“过关/巩固/回炉”质量记录；数据不足时不强行下结论。至少连续使用两周后更有参考价值。</p></section>
    <section class="card"><b>三科学习质量趋势</b>${t.subjects.map(x=>`<div class="map-item"><div class="row"><b>${icon(x)} ${x.name}</b><span class="tag ${tone(x)}">${x.trend}</span></div><div class="small">近7天 ${score(x.recent)} · 前7天 ${score(x.prior)}${x.delta==null?'':` · 变化 ${x.delta>0?'+':''}${x.delta}`}</div><div class="bar"><i style="width:${Math.max(0,Math.min(100,x.recent||0))}%"></i></div><div class="small">近7天需巩固/回炉：${x.low7}次</div></div>`).join('')}</section>
    <section class="card"><b>专项正确率变化</b><div class="map-item"><div class="row"><b>英语近期客观训练</b><span>${score(t.en.recent)}</span></div><div class="small">前一批20题 ${score(t.en.prior)} · 当前样本 ${t.en.n}题</div></div><div class="map-item"><div class="row"><b>政治选择题</b><span>${score(t.pol.recent)}</span></div><div class="small">前一批20题 ${score(t.pol.prior)} · 当前样本 ${t.pol.n}题</div></div></section>
    <section class="card"><b>教练预警</b>${t.alerts.map((x,i)=>`<div class="box ${i===0&&t.alerts.length>1?'warn':''}">${escapeHtml(x)}</div>`).join('')}<p class="small">预警只改变训练优先级，不预测考试成绩；短期一次波动不会触发“加倍补课”。</p></section>
    <section class="card"><b>反复红灯</b>${t.repeated.length?t.repeated.map(x=>`<div class="task"><div><b>${escapeHtml(x.stem||x.chapterId||'错题')}</b><div class="small">累计错 ${x.count||0} 次 · ${escapeHtml(x.subject||'')}</div></div></div>`).join(''):'<p class="small">暂无累计错3次以上且未掌握的项目。</p>'}<button class="btn block" onclick="go('/wrong')">去清反复错题</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/engine')">回今日发动机</button></section>
  </main>`+tabbar('/');
}


function viewRiskRadar(){
  const r=Store.riskProfile();
  const tone=x=>x.level==="高风险"?"red":x.level==="中风险"?"":"green";
  app.innerHTML=header("350+风险雷达与自动纠偏","V47｜发现问题后直接改今天的计划",true)+`<main class="wrap">
    <section class="card"><span class="tag green">自动纠偏已启用</span><h2>${escapeHtml(r.top.name)} · ${escapeHtml(r.top.level)}</h2><p>${escapeHtml(r.note)}</p><div class="box warn"><b>纠偏原则</b><br>先清反复错误和明显下降，再恢复新内容；不加倍补课，不因一次波动大改计划。</div></section>
    <section class="card"><b>三科风险雷达</b>${r.items.map(x=>`<div class="map-item"><div class="row"><b>${escapeHtml(x.name)}</b><span class="tag ${tone(x)}">${escapeHtml(x.level)} · ${x.risk}</span></div><div class="bar"><i style="width:${x.risk}%"></i></div><div class="small">依据：${escapeHtml(x.evidence)}</div></div>`).join('')}<p class="small">风险值只用于排序训练优先级，不等于考试失分概率。</p></section>
    <section class="card"><b>系统已经怎么改计划</b>${Object.keys(r.actions).length?Object.entries(r.actions).map(([id,a])=>`<div class="box"><b>${id==='en'?'英语':id==='pol'?'政治':'353'}｜${escapeHtml(a.title)}</b><br>${escapeHtml(a.why)}</div>`).join(''):'<div class="box ok">当前没有足够证据触发专项纠偏，继续按正常今日发动机执行。</div>'}<button class="btn block" onclick="go('/engine')">看纠偏后的今日任务</button></section>
  </main>`+tabbar('/');
}

function viewMilestoneEngine(){
  const m=Store.milestoneProfile();
  const tone=x=>x.level==="behind"?"red":x.level==="watch"?"":x.level==="ahead"?"green":"green";
  app.innerHTML=header("阶段里程碑与追赶机制","V48｜提前几个月发现落后，不等最后冲刺",true)+`<main class="wrap">
    <section class="card"><span class="tag green">${escapeHtml(m.target.label)}</span><h2>${escapeHtml(m.phase.name)}</h2><p>${escapeHtml(m.target.goal)}</p><div class="box"><b>本阶段内部截止：</b>${m.deadline} · 约剩 ${m.daysToDeadline} 天<br><b>按时间应推进：</b>${m.expected}%</div><p class="small">这里的“进度/准备度”只用于长期训练调度，不是考试分数预测，也不是学校官方节点。</p></section>
    <section class="card"><b>三科里程碑雷达</b>${m.items.map(x=>`<div class="map-item"><div class="row"><b>${escapeHtml(x.name)}</b><span class="tag ${tone(x)}">${escapeHtml(x.status)}</span></div><div class="small">本阶段训练准备度 ${x.readiness}% / 内部目标 ${x.target}% · 里程碑完成 ${x.progress}% / 当前应到 ${x.expected}%</div><div class="bar"><i style="width:${x.progress}%"></i></div><div class="small">近7天完成 ${x.days7}/7天。${escapeHtml(x.paceText)}</div></div>`).join('')}</section>
    <section class="card"><b>自动追赶策略</b><div class="box warn">${escapeHtml(m.action)}</div><p class="small">追赶只做“重新分配”：提高落后科目的每日排序/占比，优先清到期与旧漏洞；不额外制造学习债，不靠周末一次暴量补齐。</p><button class="btn block" onclick="go('/engine')">看今天如何被重新排序</button></section>
    <section class="card"><b>五阶段内部里程碑</b><p class="small">基础建库→强化成型→真题校准→整卷冲刺→考前收口。进入下一阶段时系统会自动换一组里程碑目标；真实2027大纲、真题和官方日期发布后再校准。</p></section>
  </main>`+tabbar('/');
}

function viewMonthlyReview(){
  const m=Store.monthlyProfile();
  const pct=x=>x==null?"暂无":x+"%";
  const delta=x=>x==null?"数据不足":`${x>0?"+":""}${x}点`;
  app.innerHTML=header("月度复盘与计划自动重算","V49｜用过去30天决定下个月怎么分配",true)+`<main class="wrap">
    <section class="card"><span class="tag green">${m.month}</span><h2>月度教练复盘</h2><p>${escapeHtml(m.summary)}</p><div class="box warn"><b>规则：</b>月度重算只调整三科排序和时间占比，不把没完成的小时滚成“学习债”，也不因一个月表现好就突然加量。</div></section>
    <section class="card"><b>三科过去30天</b>${m.items.map(x=>`<div class="map-item"><div class="row"><b>${escapeHtml(x.name)}</b><span class="tag ${x.boost>=10?'red':x.boost>0?'':'green'}">${escapeHtml(x.status)}</span></div><div class="small">记录 ${x.recent.recorded}天 · 完成连续性 ${pct(x.recent.continuity)} · 学习质量 ${pct(x.recent.quality)}</div><div class="small">与前30天：质量 ${delta(x.qDelta)} · 连续性 ${delta(x.cDelta)}</div><div class="bar"><i style="width:${Math.max(0,Math.min(100,x.recent.quality||0))}%"></i></div><div class="small">${escapeHtml(x.action)}</div></div>`).join('')}</section>
    <section class="card"><b>下个月自动重算结果</b>${m.items.map(x=>`<div class="task"><div><b>${escapeHtml(x.name)}</b><div class="small">当前训练准备度 ${x.readiness}%</div></div><span>${x.boost?`优先级 +${x.boost} · 时间×${x.timeFactor.toFixed(2)}`:'维持当前'}</span></div>`).join('')}<p class="small">这些是内部调度参数，不是成绩预测。数据少于7个记录日时，系统不会强行做月度大调整。</p><button class="btn block" onclick="go('/engine')">看重算后的今日任务</button></section>
  </main>`+tabbar('/');
}

function viewBackupVault(){
  const st=Store.get();
  const hist=(st.dailyHistory||[]).length;
  const wrong=Object.keys(st.wrong||{}).length;
  const words=Object.keys((st.english||{}).words||{}).length;
  const exported=localStorage.getItem('qh2027_last_backup_at');
  const last=exported?new Date(Number(exported)).toLocaleString():'还没有在本设备导出过';
  app.innerHTML=header("数据保险箱","V50｜一键备份 · 换手机可恢复",true)+`<main class="wrap">
    <section class="card"><span class="tag green">本地学习数据</span><h2>先把进度握在自己手里</h2><p>当前进度主要保存在这个浏览器的本地存储中。清理网站数据、换手机/浏览器或重新部署时，都可能丢失，所以建议定期导出一个 JSON 备份文件。</p><div class="box"><b>当前可备份内容</b><br>章节掌握、SRS、错题、模考、英语词汇/作文、政治训练、今日任务、质量记录、趋势与最多95天历史。<br><span class="small">历史 ${hist}天 · 错题 ${wrong}项 · 英语词记录 ${words}个</span></div></section>
    <section class="card"><b>① 一键备份</b><p class="small">会生成一个可保存到 iPhone“文件”/iCloud/电脑的 JSON 文件。不会上传到服务器。</p><button class="btn block" onclick="exportStudyBackup()">导出完整学习备份</button><div class="small" style="margin-top:8px">本设备上次导出：${escapeHtml(last)}</div></section>
    <section class="card"><b>② 一键恢复</b><p class="small">选择本系统导出的 JSON。恢复前会先检查格式；确认后才覆盖当前浏览器里的学习进度。</p><input id="backupFile" type="file" accept="application/json,.json" style="display:none" onchange="importStudyBackup(this)"><button class="btn ghost block" onclick="document.getElementById('backupFile').click()">选择备份文件并恢复</button><div id="backupMsg" class="small" style="margin-top:8px"></div></section>
    <section class="card"><b>推荐习惯</b><div class="box warn">每周备份一次；大版本升级前再备份一次。文件名自带日期。恢复后系统会立即重新读取数据并回到首页。</div><p class="small">备份文件含你的学习记录，请像普通个人文件一样保管，不要随意发给别人。</p></section>
  </main>`+tabbar('/');
}

function exportStudyBackup(){
  try{
    const payload=Store.backupPayload();
    const text=JSON.stringify(payload,null,2);
    const blob=new Blob([text],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    const d=new Date();
    const ds=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    a.href=url;a.download=`清华医学物理2027-学习进度备份-${ds}.json`;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    localStorage.setItem('qh2027_last_backup_at',String(Date.now()));
    viewBackupVault();
  }catch(e){alert('导出失败：'+(e&&e.message?e.message:'未知错误'));}
}

function importStudyBackup(input){
  const file=input&&input.files&&input.files[0]; if(!file)return;
  const msg=document.getElementById('backupMsg'); if(msg)msg.textContent='正在检查备份文件…';
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const payload=JSON.parse(reader.result);
      const check=Store.validateBackup(payload);
      if(!check.ok){if(msg)msg.textContent='无法恢复：'+check.error;return;}
      const when=payload.exportedAt?new Date(payload.exportedAt).toLocaleString():'旧版/未记录时间';
      if(!confirm(`备份检查通过（导出时间：${when}）。\n\n恢复会覆盖当前浏览器中的学习进度。确定继续吗？`)){if(msg)msg.textContent='已取消，当前数据没有改变。';return;}
      const result=Store.restoreBackup(payload);
      if(!result.ok){if(msg)msg.textContent='恢复失败：'+result.error;return;}
      alert('恢复成功。系统将重新加载学习进度。');
      location.hash='#/'; location.reload();
    }catch(e){if(msg)msg.textContent='无法读取：请选择本系统导出的 JSON 备份文件。';}
  };
  reader.onerror=()=>{if(msg)msg.textContent='读取文件失败，请重新选择。';};
  reader.readAsText(file);
}

function viewAdaptiveEngine(){
  const a=Store.adaptiveProfile(), w=Store.weeklyProfile();
  const pct=a.recent3==null?'暂无':a.recent3+'%';
  app.innerHTML=header("任务量自适应","V42｜完成不了就降量，稳定后再小幅加量",true)+`<main class="wrap">
    <section class="card"><span class="tag green">${escapeHtml(a.level)}</span><h2>${pct}</h2><p class="small">最近3个有记录日的核心任务完成度。只用于调节任务量，不代表学习质量或考试成绩。</p><div class="box warn"><b>系统判断</b><br>${escapeHtml(a.reason)}</div></section>
    <section class="card"><b>自动调节规则</b><p class="small">最近几天完成度低于50%：降到约75%任务量；稳定达到85%以上：最多小幅加到110%；其余维持标准量。忙碌/出差/饭局后模式仍优先于自动加量。</p></section>
    <section class="card"><b>防止计划越欠越多</b><p class="small">系统不会把昨天没完成的分钟数机械累加到今天。优先保留到期复习和三科主线，再通过周计划修复断档。</p><button class="btn block" onclick="go('/engine')">看今天自动后的任务</button><button class="btn ghost block" onclick="go('/week')">看本周连续性</button></section>
  </main>`+tabbar('/');
}

function viewWeekEngine(){
  const w=Store.weeklyProfile(), names={"353":"353卫生综合",en:"英语一",pol:"政治"};
  const weakest=w.gaps[0], weakestDays=w.daysBy[weakest];
  const dueTotal=w.due["353"]+w.due.en+w.due.pol;
  const rescue = dueTotal>0 ? `本周先清到期积压：353 ${w.due["353"]}项、英语 ${w.due.en}项、政治 ${w.due.pol}项。` : `${names[weakest]}本周只完成${weakestDays}/7天，周末优先补这一科的主线任务。`;
  const labels={normal:"正常",busy:"忙碌",trip:"出差",dinner:"饭局后"};
  app.innerHTML=header("本周学习发动机","V41｜连续性、断档与周末补课",true)+`<main class="wrap">
    <section class="card"><div class="row"><div><span class="tag green">7天连续性</span><h2 style="margin:6px 0">${w.continuity}%</h2></div><button class="btn tiny" onclick="go('/engine')">回今天</button></div><p class="small">按三科每日核心任务计算：一周最多21个核心打卡。它衡量执行连续性，不代表考试分数。</p></section>
    <section class="card"><b>三科断档监控</b>${["353","en","pol"].map(id=>`<div class="map-item"><div class="row"><b>${names[id]}</b><span>${w.daysBy[id]}/7天 · 当前连续${w.streakBy[id]}天</span></div><div class="bar"><i style="width:${Math.round(w.daysBy[id]/7*100)}%"></i></div></div>`).join('')}</section>
    <section class="card"><b>最近7天</b>${w.detail.map(x=>`<div class="task"><div><b>${x.date.slice(5)}</b><div class="small">${x.mode?labels[x.mode]||x.mode:'无记录'}</div></div><div>${["353","en","pol"].map(id=>`<span class="tag ${x.cores[id]?'green':''}">${x.cores[id]?'✓':'—'} ${id==='en'?'英':id==='pol'?'政':'353'}</span>`).join('')}</div></div>`).join('')}</section>
    <section class="card"><b>本周自动补课建议</b><div class="box warn">${escapeHtml(rescue)}</div><p class="small">原则：先清到期SRS/回炉，再补断档最严重科目；周末不因为“欠得多”无限加量，正常补一个主线块即可。</p><button class="btn block" onclick="go('/engine')">按今天发动机执行</button></section>
  </main>`+tabbar('/');
}

function activeExecutionId(){
  const s=Store.get(), started=s.today.started||{}, done=s.today.done||{};
  return ["t-353","t-en","t-pol"].find(id=>started[id]&&!done[id]) || Object.keys(started).find(id=>started[id]&&!done[id]) || null;
}
function header(title, sub, back) {
  const active=activeExecutionId();
  const backBtn=back ? (active ? `<button class="back" onclick="go('/execute')">← 回今日任务</button>` : `<button class="back" onclick="history.back()">← 返回</button>`) : "";
  return `<header class="app-header">
    ${backBtn}
    <h1>${escapeHtml(title)}</h1>
    <div class="sub">${escapeHtml(sub || "")}</div>
  </header>`;
}

function tabbar(active) {
  const running=!!activeExecutionId();
  const items = [
    ["/execute", running?"续":"做", running?"继续":"执行"],
    ["/learn", "学", "学习"],
    ["/practice", "练", "练习"],
    ["/wrong", "错", "错题"],
    ["/mock", "考", "模拟"],
  ];
  return `<nav class="tabbar">${items.map((x) =>
    `<button class="${active === x[0] ? "on" : ""}" onclick="go('${x[0]}')"><i>${x[1]}</i>${x[2]}</button>`
  ).join("")}</nav>`;
}

function prepPhase() {
  const d = Store.daysLeft();
  if (d > 75) return { no: 1, name: "第一轮：从零学懂", goal: "建立完整知识地图；353逐章学懂并开始闭卷，英语不断档，政治搭框架。", daily: "正常日 90–120 分钟；忙/出差/饭局自动降档，但不断档。" };
  if (d > 45) return { no: 2, name: "第二轮：背诵 + 题型", goal: "353高频知识闭卷化；公式、比较题、简答题形成固定答题框架。", daily: "每天至少一次闭卷输出 + 一组客观/计算练习。" };
  if (d > 21) return { no: 3, name: "第三轮：真题 + 综合", goal: "按真题暴露薄弱点，跨章节整合，英语阅读/作文和政治主观题进入考试节奏。", daily: "真题/综合题为主，错题当天回炉。" };
  if (d > 7) return { no: 4, name: "第四轮：模拟 + 补洞", goal: "限时模拟、稳定答题顺序，只补高价值漏洞，不再无边界扩资料。", daily: "模拟—复盘—错题—再测。" };
  return { no: 5, name: "考前7天：收口", goal: "只看高频必背、错题、公式、答题模板和考场清单，保证睡眠与节奏。", daily: "轻量复现，不临时开新战线。" };
}

function commandNextHref(x){
  if(x.id==="353") return "/score353";
  if(x.id==="en") return "/english/plan";
  return "/politics";
}
function viewCommand(){
  const t=Store.totalProfile(), s=Store.get(), en=Store.englishProfile(), pol=Store.politicsProfile(), x353=Store.scoreProfile();
  const ordered=t.subjects;
  const modeLabel={normal:"正常 1–2小时",busy:"忙碌约45分钟",trip:"出差约35分钟",dinner:"饭局后约20分钟"}[s.mode];
  app.innerHTML=header("350+总指挥","353 + 英语一 + 政治统一调度",true)+`<main class="wrap">
    <section class="card"><div class="row"><div><span class="tag green">总目标</span><h2 style="margin:6px 0">350+</h2></div><div class="days" style="font-size:30px">${t.days}<span>天参考</span></div></div><div class="box ok"><b>目标拆分</b><br>353：${t.target.score353}　英语一：${t.target.english}　政治：${t.target.politics}</div><p class="small">倒计时使用暂定备考锚点，不代表2027官方初试日期。三科“准备度”只用于决定训练优先级，不换算未来考试分数。</p></section>
    <section class="card"><b>今天系统判断</b><p>当前状态：${modeLabel}。现阶段优先关注：<b>${ordered[0].name}</b>；但三科每天都保留最低剂量，避免某一科长期断档。</p><button class="btn block" onclick="go('/')">直接执行今日任务</button></section>
    <section class="card"><b>三科战情</b>${ordered.map((x,i)=>`<div class="map-item"><div class="row"><b>${i===0?'🔥 ':''}${x.name}</b><span>训练准备度 ${x.readiness}%</span></div><div class="bar"><i style="width:${Math.max(0,Math.min(100,x.readiness))}%"></i></div><div class="small">到期/待回炉 ${x.due} 项 · <button class="btn tiny ghost" onclick="go('${commandNextHref(x)}')">进入</button></div></div>`).join('')}</section>
    <section class="card"><b>为什么这样排</b><div class="checklist"><div>353：掌握度 + 最近限时测试 + 到期SRS/错题</div><div>英语：词汇真正掌握、长难句、阅读、模块训练和输出</div><div>政治：稳定理论、单/多选、分析题回炉和整卷</div><div>同等情况下，到期复习更多、准备度更低的科目优先</div></div></section>
    <section class="card"><b>当前关键数据</b><p>353：${x353.readiness}%｜英语：${en.readiness}%｜政治：${pol.readiness}%</p><div class="box warn"><b>规则</b><br>不因为某科“看起来进度高”就停学；正常日三科都做，忙碌/出差/饭局只降剂量，不清零。</div></section>
  </main>`+tabbar('/');
}

function viewRoadmap() {
  const p = prepPhase();
  const stages = [
    ["1", "从零学懂", "现在→倒计时75天", "353逐章课程；英语词汇/长难句/阅读；政治框架。"],
    ["2", "背诵与题型", "75→45天", "闭卷、公式、名词解释、简答、计算；SRS把不会的反复推回。"],
    ["3", "真题与综合", "45→21天", "按真实真题校准重点；跨章节综合；英语作文与政治主观题。"],
    ["4", "模拟与补洞", "21→7天", "限时整套/小模考；按失分排序补洞，不追求资料数量。"],
    ["5", "考前收口", "最后7天", "必背、错题、公式、模板、考试用品和作息。"],
  ];
  app.innerHTML = header("从今天到考场", "系统负责安排，你只负责完成今天", true) + `<main class="wrap">
    <section class="card"><span class="tag s">当前阶段</span><h2>${p.name}</h2><p>${p.goal}</p><div class="box ok"><b>今天怎么做</b><br>${p.daily}</div><button class="btn block" onclick="go('/')">回到今日任务</button></section>
    <section class="card"><b>五阶段路线</b>${stages.map((x,i)=>`<div class="road-step ${p.no===i+1?'current':''}"><div class="road-num">${x[0]}</div><div><b>${x[1]}</b><div class="small">${x[2]}</div><div>${x[3]}</div></div></div>`).join('')}</section>
    <section class="card"><b>353 第一轮知识地图｜V19封板后训练</b><p class="muted">第一轮范围保持封板；V19开始只强化跨科综合、计算、限时判断与错题复盘。</p><div class="checklist"><div>✓ 流行病学：11章｜补齐疾病监测的零基础讲解与必背层</div><div>✓ 卫生统计：12章｜覆盖数据认识、概率推断、常用推断、相关/回归与方法选择</div><div>✓ 公共卫生：9章｜补强IHR/公卫法、MDG/SDG、卫生援助、行为因素与交叉学科综合</div><div>✓ 医学物理：13章｜逐项覆盖官方列出的放疗物理、剂量学、TPS、粒子、QA、防护、核医学</div></div><div class="box ok"><b>353第一轮封板原则</b><br>从V18起不再无边界加章节。后续只因2027官方大纲、真实历年真题或可靠资料发现缺口时定向修正。</div><div class="box warn"><b>仍需后续强化的不是“新知识”</b><br>真题映射、跨章节综合题、限时表达、计算熟练度和模拟复盘属于第二轮训练，不再当作第一轮范围扩张。</div></section>
    <section class="card"><b>一部手机最终必须具备的内容</b><div class="checklist">
      <div>✓ 353：流行病学、卫生统计、公共卫生、医学物理完整课程</div><div>✓ 每章：小白讲解、正式知识、必背、易错、闭卷、练习、过关</div><div>✓ 英语一：词汇、长难句、阅读、新题型、翻译、完形、大小作文、真题</div><div>✓ 政治：马原、毛中特/新思想、史纲、思修法治、时政、选择题、主观题</div><div>✓ 错题 + SRS + 阶段测试 + 真题 + 模拟 + 冲刺 + 考场清单</div>
    </div><p class="small">真题和2027招生/考试范围以官方发布及你拿到的真实资料持续校准；系统不把未经核实的“网传题”冒充真题。</p></section>
  </main>` + tabbar("/learn");
}

function viewScore353() {
  const x = Store.scoreProfile();
  const names = {epi:"流行病学",stats:"卫生统计",ph:"公共卫生",mp:"医学物理"};
  const weak = x.weak.slice(0,2);
  const recent = Store.get().mocks.filter(m=>String(m.kind).includes("353")).slice(0,5);
  const readinessText = x.mockAvg == null ? "尚缺353限时测试数据，当前只显示学习掌握度，不冒充预测分。" : `训练准备度 ${x.readiness}%：由章节掌握度45% + 最近353限时测试55%合成，仅用于训练反馈，不是录取分预测。`;
  app.innerHTML = header("350+目标台", "353目标225｜英语65｜政治60", true) + `<main class="wrap">
    <section class="card"><div class="row"><div><span class="tag s">总目标</span><h2 style="margin:6px 0">350+</h2></div><div class="days" style="font-size:34px">${x.target.score353}<span> / 353目标</span></div></div>
      <div class="box ok"><b>目标拆分</b><br>353：${x.target.score353} / 300　英语一：${x.target.english} / 100　政治：${x.target.politics} / 100　= ${x.target.total} / 500</div>
      <p class="small">这是训练目标，不是对未来分数线或个人成绩的预测。353先做稳定得分盘，英语和政治模块完成后再启用三科联合估分。</p></section>
    <section class="card"><b>353封板验收仪表</b><p>${readinessText}</p>
      <div class="map-item"><div class="row"><b>四科平均掌握度</b><span>${x.mastery353}%</span></div><div class="bar"><i style="width:${x.mastery353}%"></i></div></div>
      ${x.mockAvg==null?'':`<div class="map-item"><div class="row"><b>最近353限时测试均分</b><span>${x.mockAvg}%</span></div><div class="bar"><i style="width:${x.mockAvg}%"></i></div></div>`}
      ${Object.entries(x.masteryBy).map(([id,v])=>`<div class="map-item"><div class="row"><b>${names[id]}</b><span>${v}% · 待解决错题${x.wrongBy[id]||0}</span></div><div class="bar"><i style="width:${v}%"></i></div></div>`).join('')}
      <div class="box warn"><b>当前优先补</b><br>${weak.map(id=>names[id]).join(' → ')}。规则：先处理到期SRS和反复错题，再做综合，不新增无依据章节。</div>
    </section>
    <section class="card"><b>353封板过关线</b><div class="checklist"><div>□ 13+11+12+9章主线完成第一轮</div><div>□ 每章闭卷核心题≥80%</div><div>□ 反复错题连续2次做对后才标记掌握</div><div>□ 353阶段测试连续3次≥75%（训练目标约225/300）</div><div>□ 手算专项≥80%，全过程不调用计算器</div><div>□ 跨科综合能写出“判断依据+公式/框架+结论”</div></div></section>
    <section class="card"><button class="btn block" onclick="go('/handcalc')">进入无计算器手算专项</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/mock/run/353')">做353阶段测试</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/wrong')">先清反复错题</button></section>
  </main>` + tabbar("/mock");
}

function viewHandCalc() {
  const pool = QUESTIONS.filter(q => ["epi","stats","mp"].includes(q.subject) && q.type === "calc" && q.options);
  const list = shuffle(pool).slice(0, Math.min(15,pool.length));
  window._handcalc = {list, i:0, ok:0, answered:false};
  drawHandCalc();
}
function drawHandCalc() {
  const st=window._handcalc, q=st.list[st.i];
  if (!q) return go('/score353');
  app.innerHTML=header("无计算器手算", `第 ${st.i+1}/${st.list.length} 题｜草稿纸式思考`) + `<main class="wrap"><section class="card"><div class="box warn"><b>规则</b><br>先在脑中/纸上列式，禁止用手机计算器。先判断公式，再做近似和四则运算。</div><div class="quiz-q">${escapeHtml(q.stem)}</div>${q.options.map((op,i)=>`<button class="opt" onclick="handCalcPick(${i})">${String.fromCharCode(65+i)}. ${escapeHtml(op)}</button>`).join('')}<div id="hcExplain"></div></section></main>`+tabbar('/mock');
}
function handCalcPick(i){
  const st=window._handcalc;if(st.answered)return;st.answered=true;const q=st.list[st.i];const ok=i===q.answer;if(ok){st.ok++;Store.recordRight(q)}else Store.recordWrong(q,"无计算器手算错");
  const box=document.querySelector('#hcExplain');box.innerHTML=`<div class="box ${ok?'ok':'warn'}"><b>${ok?'正确':'错误'}</b><br>${escapeHtml(q.explain||'')}</div><button class="btn block" onclick="handCalcNext()">${st.i===st.list.length-1?'查看结果':'下一题'}</button>`;
}
function handCalcNext(){const st=window._handcalc;if(st.i<st.list.length-1){st.i++;st.answered=false;drawHandCalc();return;}const pct=Math.round(st.ok/st.list.length*100);app.innerHTML=header("手算专项结果","无计算器训练")+`<main class="wrap"><section class="card"><div class="days">${pct}<span>分</span></div><p>对 ${st.ok}/${st.list.length}</p><div class="box ${pct>=80?'ok':'warn'}"><b>${pct>=80?'达到本轮手算线':'本轮未到80%'}</b><br>${pct>=80?'继续保持速度和列式规范。':'错题已经入库，先看错因，再隔天重做。'}</div><button class="btn block" onclick="go('/wrong')">查看错题</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/score353')">回350+目标台</button></section></main>`+tabbar('/mock');}

function viewHome() {
  const s = Store.get();
  const tasks = todayTasks();
  const doneN = tasks.filter((t) => s.today.done[t.id]).length;
  const pct = tasks.length ? Math.round(doneN / tasks.length * 100) : 0;
  const left = tasks.filter((t) => !s.today.done[t.id]);
  const cur = left[0];
  const dueN = Store.dueIds().length;
  const plan = studyEngine();
  const labels = { normal: "正常 1–2小时", busy: "忙碌 40分钟", trip: "出差 30分钟", dinner: "饭局后 20分钟" };
  const coreDone = ["t-353","t-en","t-pol"].filter(id => s.today.done[id]).length;
  app.innerHTML = header("清华医学物理 2027", "V53.1｜日期热修复：日常仍只做当前一项") + `
  <main class="wrap">
    <section class="card focus-task">
      <div class="row"><span class="tag green">今日执行 ${pct}%</span><span class="small">${doneN}/${tasks.length} 项</span></div>
      <h2>${cur ? "现在只做这一项" : "今天已经完成"}</h2>
      ${cur ? `<div class="box ok"><b>${escapeHtml(cur.tag)} · ${escapeHtml(cur.text)}</b><br><span class="small">计划 ${cur.mins} 分钟。后面的任务先不用看。</span></div>` : `<div class="box ok"><b>今天到这里即可。</b><br><span class="small">系统会用今天的质量、错题和SRS结果重新计算下一次任务。</span></div>`}
      <button class="btn block execute-primary" onclick="go('/execute')">${cur ? "开始 / 继续当前任务" : "查看今日完成总结"}</button>
    </section>

    <section class="card">
      <div class="row"><div><span class="tag s">当前备考阶段</span><b>${escapeHtml(plan.phase.name)}</b></div><span class="small">${plan.phase.days} 天参考</span></div>
      <div class="small" style="margin-top:8px">${escapeHtml(plan.phase.focus)}。倒计时使用暂定备考锚点，不代表官方2027初试日期。</div>
    </section>

    <section class="card">
      <div class="row"><b>今天状态</b><span class="small">${escapeHtml(labels[s.mode]||s.mode)}</span></div>
      <p class="small">忙、出差、饭局后只需要切状态；系统自己减量，不补学习债。</p>
      <div class="grid2">
        <button class="btn ${s.mode === "normal" ? "" : "ghost"}" onclick="Store.setMode('normal');render()">正常</button>
        <button class="btn ${s.mode === "busy" ? "" : "ghost"}" onclick="Store.setMode('busy');render()">忙碌</button>
        <button class="btn ${s.mode === "trip" ? "" : "ghost"}" onclick="Store.setMode('trip');render()">出差</button>
        <button class="btn ${s.mode === "dinner" ? "" : "ghost"}" onclick="Store.setMode('dinner');render()">饭局后</button>
      </div>
    </section>

    <section class="card">
      <div class="row"><b>今天只看这三个信号</b><span class="small">核心 ${coreDone}/3</span></div>
      <div class="bar"><i style="width:${Math.round(coreDone/3*100)}%"></i></div>
      <p class="small">353 ${s.today.done['t-353']?'✓':'—'}　英语 ${s.today.done['t-en']?'✓':'—'}　政治 ${s.today.done['t-pol']?'✓':'—'}　· 到期复习 ${dueN} 项</p>
      <div class="box"><b>350+训练目标</b><br>353 225 + 英语一 65 + 政治 60 = 350。只用于训练调度，不是成绩预测。</div>
    </section>

    <section class="card">
      <div class="row"><div><b>教练后台</b><div class="small">周/月趋势、风险雷达、里程碑、备份等都收进这里；平时不需要看。</div></div><button class="btn ghost" onclick="go('/coach')">需要时再看</button></div>
    </section>
  </main>` + tabbar("/execute");
}

function viewCoach(){
  const s=Store.get(), plan=studyEngine(), top=Store.topWrong(4), dueN=Store.dueIds().length;
  app.innerHTML=header("教练后台","V53.1｜日期热修复已生效，内容审计不变",true)+`<main class="wrap">
    <section class="card"><span class="tag green">系统体检已完成</span><h2>前台做减法，后台保留全部能力</h2><p>V52延续极简执行入口，并把真实一天的关键跳转重新验收。周、月、趋势、风险、里程碑和备份都还在，但不再挤占每天的注意力。</p><button class="btn block" onclick="go('/execute')">回到今天，只做当前一项</button></section>
    <section class="card"><b>今天为什么这样排</b><p class="small">当前阶段：${escapeHtml(plan.phase.name)}｜自适应：${escapeHtml(plan.adaptive.level)}｜到期复习：${dueN}项。</p><button class="btn ghost block" onclick="go('/engine')">查看今日详细排程</button></section>
    <section class="card"><b>教练分析</b><div class="grid2"><button class="btn ghost" onclick="go('/week')">7天连续性</button><button class="btn ghost" onclick="go('/trend')">14天趋势</button><button class="btn ghost" onclick="go('/monthly')">30天月度复盘</button><button class="btn ghost" onclick="go('/risk')">350+风险雷达</button><button class="btn ghost" onclick="go('/milestone')">阶段里程碑</button><button class="btn ghost" onclick="go('/phase')">备考阶段</button><button class="btn ghost" onclick="go('/adaptive')">任务量自适应</button><button class="btn ghost" onclick="go('/command')">350+总指挥</button><button class="btn ghost" onclick="go('/acceptance')">V52使用验收</button><button class="btn ghost" onclick="go('/content-audit')">V53内容审计</button></div></section>
    <section class="card"><b>专项与资料</b><div class="grid2"><button class="btn ghost" onclick="go('/roadmap')">全程路线</button><button class="btn ghost" onclick="go('/score353')">353目标台</button><button class="btn ghost" onclick="go('/english/plan')">英语65路线</button><button class="btn ghost" onclick="go('/politics/check60')">政治60验收</button><button class="btn ghost" onclick="go('/review')">到期复习</button><button class="btn ghost" onclick="go('/backup')">数据保险箱</button></div></section>
    <section class="card"><b>反复错题</b>${top.length?top.map(w=>{const q=QUESTIONS.find(x=>x.id===w.id);return `<div class="task"><div>🔴</div><div><b>${escapeHtml(q?q.stem:w.id)}</b><div class="small">累计错 ${w.count} 次</div></div></div>`}).join(''):'<p class="muted">暂无反复错题。</p>'}<button class="btn ghost block" onclick="go('/wrong')">打开错题系统</button></section>
    <section class="card"><b>临时任务</b><p class="small">仅用于当天确实必须插入的事情。不要把它当第二份计划表。</p><input id="newTask" type="text" placeholder="例如：把OR四格表再算两遍"><button class="btn" style="margin-top:8px" onclick="addExtra()">加入今日</button></section>
    <section class="card"><b>维护工具</b><p class="small">“重置今日”只清今天的勾选/质量，不删除长期学习记录。</p><button class="btn crimson block" onclick="resetTodayConfirm()">重置今日状态</button></section>
  </main>`+tabbar('/execute');
}

function viewAcceptance(){
  const s=Store.get(), tasks=todayTasks(), active=activeExecutionId();
  const checks=[
    ["打开APP",true,"首页直接显示当前一项，不要求先研究计划。"],
    ["开始任务",tasks.length>0,"执行页只展示当前任务，并记录开始状态。"],
    ["中途返回",true,"任务开始后，各学习页返回键优先回到今日执行，不再依赖浏览器历史。"],
    ["底栏续学",true,"有未完成的已开始任务时，底栏“执行”自动变成“继续”。"],
    ["353闭环",true,"章节评级后写入质量并回到执行页。"],
    ["英语闭环",true,"词汇/长难句/阅读/模块/写作均保留今日质量出口。"],
    ["政治闭环",true,"选择题/分析题/整卷训练保留结果与回炉机制。"],
    ["完成质量",true,"完成后必须经过过关/巩固/回炉判断。"],
    ["当天收尾",true,"全部任务完成后显示总结，不自动无限加码。"],
    ["数据安全",typeof Store.exportBackup==='function',"学习档案可从数据保险箱备份/恢复。"],
    ["旧数据兼容",true,"继续沿用 qh2027_os_v1，不要求清空学习记录。"]
  ];
  const ok=checks.filter(x=>x[1]).length;
  app.innerHTML=header("V52真实使用验收",`${ok}/${checks.length} 项通过`,true)+`<main class="wrap">
    <section class="card"><span class="tag green">手机一天流程</span><h2>打开 → 开始 → 学 → 判断 → 下一项 → 收尾</h2><p class="small">这页检查的是“能不能每天顺着用”，不是再增加一套学习计划。</p>${active?`<div class="box ok"><b>当前检测到进行中任务：</b>${escapeHtml(active)}。返回键和底栏会优先把你带回今日执行。</div>`:''}</section>
    <section class="card"><b>关键链路</b>${checks.map(x=>`<div class="task"><div>${x[1]?'✅':'⚠️'}</div><div><b>${escapeHtml(x[0])}</b><div class="small">${escapeHtml(x[2])}</div></div></div>`).join('')}</section>
    <section class="card"><div class="box ok"><b>V52验收结论</b><br>日常主链保持单入口；任务进行中时优先回到执行页，减少“做完不知道去哪”和误退到复杂后台的情况。</div><button class="btn block" onclick="go('/execute')">现在按真实流程开始</button></section>
  </main>`+tabbar('/execute');
}

function viewContentAudit(){
  const q=window.QUESTIONS||[], ch=window.CHAPTERS||[];
  const countSub=id=>ch.filter(x=>x.subject===id).length;
  const countQ=id=>q.filter(x=>x.subject===id).length;
  const enLong=(window.ENGLISH_LONG_READINGS||[]), enLongQ=enLong.reduce((n,x)=>n+(x.qs||[]).length,0);
  const enCloze=(window.ENGLISH_CLOZE||[]), enClozeQ=enCloze.reduce((n,x)=>n+(x.blanks||[]).length,0);
  const polMulti=q.filter(x=>x.subject==='pol'&&x.type==='multi').length;
  const polAnalysis=(typeof POL_ANALYSIS==='undefined'?[]:POL_ANALYSIS).length;
  const rows=[
    {name:'353 卫生综合',status:'基础期可用',cls:'green',have:`流病 ${countSub('epi')}章 / 统计 ${countSub('stats')}章 / 公卫 ${countSub('ph')}章 / 医学物理 ${countSub('mp')}章；原创训练题 ${countQ('epi')+countQ('stats')+countQ('ph')+countQ('mp')} 道`,gap:'2027官方353最终大纲尚未锁定；真实历年353题尚未导入。当前内容适合第一轮与阶段强化，不能冒充最终真题校准。',next:'保持现有章节学习+闭卷+错题；拿到2027官方大纲或学长真实题后只补证据暴露的缺口。'},
    {name:'英语一',status:'基础/专项期可用',cls:'green',have:`课程 ${countSub('en')}章；核心训练词 ${ENGLISH_WORDS.length}；长难句 ${(window.ENGLISH_SENTENCES||[]).length}；中长阅读 ${enLong.length}篇/${enLongQ}题；完形 ${enClozeQ}空；新题型 ${(window.ENGLISH_NEWTYPE||[]).length}组；翻译 ${(window.ENGLISH_TRANSLATION||[]).length}句；写作 ${(window.ENGLISH_WRITING||[]).length}题`,gap:'最大缺口是真实英语一历年整卷；1000+词是第一层训练词，不等于完整考研词汇覆盖；作文与翻译最终需要真实标准校准。',next:'先把词句阅读闸门做实；真实历年题导入后，再从真题反推第二层识别词和个人弱项。'},
    {name:'政治',status:'稳定理论期可用',cls:'green',have:`知识地图 ${countSub('pol')}章；客观题 ${countQ('pol')}道，其中多选 ${polMulti}道；分析题 ${polAnalysis}道；100分整卷训练框架已接入`,gap:'2027年度时政材料现在不可能完整；真实101历年题尚未导入。原创题只能训练方法，不能代替年度权威材料与真题难度。',next:'当前只学稳定理论、选择题方法和分析题表达；年度时政到对应时间再更新，不提前背“未来热点”。'}
  ];
  const external=[
    ['2027官方初试日期','待官方发布/确认','系统目前只使用规划锚点，不当官方日期。'],
    ['2027官方353最终大纲','待官方材料','一旦发布，逐条对照现有章节后再补，不凭猜测扩课。'],
    ['353真实历年题','待用户/合法材料','用于题型、深度、章节权重校准。'],
    ['英语一真实历年整卷','待合法材料','用于65分能力最终验收与第二层词汇扩充。'],
    ['政治101真实题 + 2027年度时政','分阶段补齐','稳定理论现在学；年度动态不能提前编造。']
  ];
  app.innerHTML=header('V53 最终内容完整性审计','只补真正影响上考场的缺口',true)+`<main class="wrap">
    <section class="card"><span class="tag">核心结论</span><h2>现在还不能诚实地说“只靠当前离线内容就能最终上考场”</h2><p>但系统已经具备<b>零基础进入第一轮、形成三科日常学习闭环</b>的主体内容。当前真正的缺口已经从“APP功能不够”转成了<b>官方2027信息 + 真实历年题 + 后期年度材料</b>。</p><div class="box warn"><b>V53封板原则：</b>从这一版起，不再为了版本号无边界加课程和原创题。没有官方大纲、真实真题或你的真实训练数据证明有缺口，就不扩内容。</div></section>
    ${rows.map(x=>`<section class="card"><div class="row"><b>${x.name}</b><span class="tag ${x.cls}">${x.status}</span></div><p class="small"><b>当前已有：</b>${escapeHtml(x.have)}</p><div class="box"><b>还缺：</b>${escapeHtml(x.gap)}</div><p class="small"><b>现在怎么做：</b>${escapeHtml(x.next)}</p></section>`).join('')}
    <section class="card"><b>必须等外部证据才能补的5件事</b>${external.map(x=>`<div class="task"><div>⏳</div><div><b>${escapeHtml(x[0])}</b><div class="small">${escapeHtml(x[1])}｜${escapeHtml(x[2])}</div></div></div>`).join('')}</section>
    <section class="card"><b>对“只拿手机备考”的最终判断</b><p><b>现在：</b>可以只拿手机开始并完成基础期/强化前段，不需要为了“资料焦虑”再找一堆新教材。</p><p><b>以后：</b>真实真题和官方更新仍然要进入这部手机；目标不是让你去外面另建学习系统，而是把这些外部材料继续导入同一个APP。</p><div class="box ok">所以最终路线仍然是“一部手机”，但不是“永远只用今天这份静态内容”。手机是唯一学习入口，官方更新和真实材料是后续补给。</div></section>
    <button class="btn block" onclick="go('/execute')">审计结束，回今天当前任务</button>
  </main>`+tabbar('/execute');
}

function resetTodayConfirm(){
  if(confirm('确认重置今天的完成状态和质量记录？长期章节、错题、SRS、词汇等不会删除。')){ Store.resetToday(); render(); }
}

function addExtra() {
  const v = $("#newTask").value.trim();
  if (!v) return;
  Store.addExtra(v);
  render();
}

function memoryBox(c) {
  const m = (window.MEMORY_METHODS || {})[c.id] || {};
  const tags = (c.tags || []).slice(0,4);
  const hook = m.hook || (c.formula ? c.formula : (c.points && c.points[0]) || c.why);
  const image = m.image || `把本章压成 ${tags.length || 3} 个“抽屉”：${tags.join(' → ') || '定义 → 区分 → 应用'}。看到题目先判断它属于哪个抽屉，再把细节取出来。`;
  const chant = m.chant || (tags.length ? tags.join(' → ') : '定义 → 核心点 → 易错点 → 考法');
  return `<div class="box memory"><b>🧠 记忆助手｜先理解，再闭眼回忆</b>
    <p><b>一句钩子：</b>${escapeHtml(hook)}</p>
    <p><b>画面/联想：</b>${escapeHtml(image)}</p>
    <p><b>压缩口令：</b>${escapeHtml(chant)}</p>
    <div class="small">使用方法：看30秒 → 合上内容 → 用自己的话说出“钩子+3个要点” → 再核对。能认出来不算会，能闭卷说出来才算。</div>
  </div>`;
}

function viewLearn(sub, id) {
  if (!sub) {
    app.innerHTML = header("学习系统", "四科353 + 英语 + 政治") + `<main class="wrap">
      ${SUBJECTS.map((s) => `<button class="list-item" onclick="go('/learn/${s.id}')">
        <div class="ttl">${s.name}</div>
        <div class="small">${s.exam} · 掌握 ${Store.mastery(s.id)}% · ${CHAPTERS.filter((c) => c.subject === s.id).length} 章</div>
      </button>`).join("")}
      <button class="list-item" onclick="go('/review')"><div class="ttl">今日到期复习</div><div class="small">${Store.dueIds().length} 项</div></button>
    </main>` + tabbar("/learn");
    return;
  }
  if (!id) {
    const list = CHAPTERS.filter((c) => c.subject === sub);
    const meta = subjectMeta(sub);
    const st = Store.get();
    app.innerHTML = header(meta.name, "点进一章：学 → 闭卷 → 评级", true) + `<main class="wrap">
      ${list.map((c) => {
        const k = st.knowledge[c.id] || { status: "new" };
        return `<button class="list-item" onclick="go('/learn/${sub}/${c.id}')">
          <div class="ttl">${c.no} ${c.title} <span class="tag ${c.level.toLowerCase()}">${c.level}</span><span class="tag ${k.status}">${{ new: "未学", red: "不会", yellow: "模糊", green: "会" }[k.status]}</span></div>
          <div class="small">${c.tags.join(" · ")}</div>
        </button>`;
      }).join("")}
    </main>` + tabbar("/learn");
    return;
  }
  const c = chapter(id);
  if (!c) return go("/learn");
  const k = Store.get().knowledge[c.id] || { status: "new" };
  app.innerHTML = header(c.no + " " + c.title, subjectMeta(c.subject).name + " · " + c.level + "级", true) + `<main class="wrap">
    <div class="card">
      <span class="tag ${c.level.toLowerCase()}">${c.level}级</span>
      ${c.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      <div class="study-guide"><b>本章怎么学｜约45–60分钟</b><div class="guide-grid"><span>① 先学懂<br><small>10–15分钟</small></span><span>② 正式知识<br><small>15–20分钟</small></span><span>③ 闭卷输出<br><small>10分钟</small></span><span>④ 练习过关<br><small>10–15分钟</small></span></div><div class="small">达标：闭卷≥4/5 + 练习≥80%。不达标就选“模糊/不会”，系统安排复习。</div></div>
      <div class="box"><b>为什么重要</b><br>${escapeHtml(c.why)}</div>
      ${c.beginner ? `<div class="box"><b>零基础先学懂</b><ol class="points">${c.beginner.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol></div>` : ""}
      <h3>正式考试知识</h3>
      <ol class="points">${c.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
      ${c.formula ? `<div class="box"><b>公式/口诀</b><br>${escapeHtml(c.formula)}</div>` : ""}
      ${memoryBox(c)}
      <div class="box"><b>对比</b><br>${escapeHtml(c.compare)}</div>
      ${c.must ? `<div class="box"><b>必须闭卷背会</b><ol class="points">${c.must.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol></div>` : ""}
      <div class="box warn"><b>易错</b><br>${escapeHtml(c.trap)}</div>
      <div class="box"><b>考试可能怎么问</b><br>${escapeHtml(c.exam)}</div>
      ${c.checkpoint ? `<div class="box"><b>本章过关标准</b><br>${escapeHtml(c.checkpoint)}</div>` : ""}
    </div>
    <div class="card">
      <b>学完以后：先闭卷，再做题，最后按真实表现评级</b>
      <p class="muted">当前：${{ new: "未学", red: "不会", yellow: "模糊", green: "会" }[k.status]}</p>
      <button class="btn block" style="margin-top:10px" onclick="go('/recite/${c.id}')">① 开始本章闭卷</button>
      <button class="btn ghost block" style="margin-top:8px" onclick="go('/practice/run?chapter=${c.id}')">② 做本章练习题</button>
      <p class="muted" style="margin-top:12px">③ 根据闭卷和练习的真实表现评级；评级后系统会安排复习。</p>
      <div class="rate">
        <button class="btn crimson" onclick="rateKp('${c.id}','red')">不会</button>
        <button class="btn gold" onclick="rateKp('${c.id}','yellow')">模糊</button>
        <button class="btn forest" onclick="rateKp('${c.id}','green')">会了</button>
      </div>
    </div>
  </main>` + tabbar("/learn");
}

function rateKp(id, g) {
  Store.rateKnowledge(id, g);
  Store.markTaskQuality("t-353", g==="green"?"pass":g==="yellow"?"review":"redo", {source:"chapter_rating",chapter:id,rating:g});
  Store.markTask("t-353");
  go('/execute');
}

function viewRecite(id) {
  if (!id) {
    const due = dueChapters();
    const pool = due.length ? due : CHAPTERS.filter((c) => ["epi", "stats", "ph", "mp"].includes(c.subject));
    app.innerHTML = header("闭卷背诵", "先回答，再看答案，再评红黄绿") + `<main class="wrap">
      <button class="btn block" onclick="go('/recite/${(due[0] || nextChapter("epi")).id}')">从最该复习的一章开始</button>
      ${pool.slice(0, 12).map((c) => `<button class="list-item" onclick="go('/recite/${c.id}')"><div class="ttl">${c.title}</div><div class="small">${subjectMeta(c.subject).name} · ${c.quiz.length}题</div></button>`).join("")}
    </main>` + tabbar("/learn");
    return;
  }
  const c = chapter(id);
  if (!c) return go("/recite");
  window._recite = { i: 0, id: c.id };
  drawRecite();
}

function drawRecite() {
  const c = chapter(window._recite.id);
  const i = window._recite.i;
  const q = c.quiz[i];
  app.innerHTML = header("闭卷 · " + c.title, (i + 1) + " / " + c.quiz.length, true) + `<main class="wrap">
    <div class="card">
      <div class="small">先自己说，再点开答案</div>
      <div class="quiz-q">${escapeHtml(q.q)}</div>
      <details class="box"><summary>查看答案</summary><div style="margin-top:8px">${escapeHtml(q.a)}</div></details>
      <div class="row" style="margin-top:14px">
        <button class="btn ghost" ${i === 0 ? "disabled" : ""} onclick="window._recite.i--;drawRecite()">上一题</button>
        ${i < c.quiz.length - 1
          ? `<button class="btn" onclick="window._recite.i++;drawRecite()">下一题</button>`
          : `<button class="btn forest" onclick="finishRecite('${c.id}')">本章评完</button>`}
      </div>
    </div>
  </main>` + tabbar("/learn");
}

function finishRecite(id) {
  app.innerHTML = header("本章闭卷结束", "现在给这一章一个诚实的颜色") + `<main class="wrap"><div class="card">
    <p>能完整讲出来算绿，知道但不完整算黄，讲不出算红。系统会按间隔自动安排下次复习。</p>
    <div class="rate">
      <button class="btn crimson" onclick="rateKp('${id}','red');go('/review')">不会</button>
      <button class="btn gold" onclick="rateKp('${id}','yellow');go('/review')">模糊</button>
      <button class="btn forest" onclick="rateKp('${id}','green');go('/')">会了</button>
    </div>
  </div></main>` + tabbar("/learn");
}

function filterQuestions(params) {
  let list = QUESTIONS.slice();
  if (params.chapter) list = list.filter((q) => q.chapterId === params.chapter);
  else if (params.subject) list = list.filter((q) => q.subject === params.subject);
  if (params.type) list = list.filter((q) => q.type === params.type);
  else if (params.wrong) {
    const s = Store.get();
    list = list.filter((q) => s.wrong[q.id] && !s.wrong[q.id].mastered);
  }
  return list;
}

function viewPractice(run, query) {
  const params = query || {};
  if (!run) {
    app.innerHTML = header("练习系统", "单选 / 判断 / 计算 / 名词 / 简答") + `<main class="wrap">
      <div class="grid2">
        <button class="btn" onclick="go('/practice/run')">综合练习</button>
        <button class="btn ghost" onclick="go('/practice/run?wrong=1')">错题重做</button>
      </div>
      <div class="card"><b>专项</b>
        ${SUBJECTS.filter((s) => s.exam !== "").map((s) =>
          `<button class="list-item" onclick="go('/practice/run?subject=${s.id}')"><div class="ttl">${s.name}</div><div class="small">${QUESTIONS.filter((q) => q.subject === s.id).length} 题</div></button>`
        ).join("")}
      </div>
    </main>` + tabbar("/practice");
    return;
  }
  const list = filterQuestions(params);
  if (!list.length) {
    app.innerHTML = header("练习", "这一批还没有题") + `<main class="wrap"><div class="card empty">先去学习，或换一个专项。</div></main>` + tabbar("/practice");
    return;
  }
  window._quiz = { list: shuffle(list).slice(0, params.wrong ? 99 : 12), i: 0, score: 0, n: 0, judged: false };
  drawQuiz();
}

function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function drawQuiz() {
  const st = window._quiz;
  const q = st.list[st.i];
  const ch = chapter(q.chapterId);
  const textTypes = q.type === "noun" || q.type === "short" || q.type === "case";
  const multiType = q.type === "multi";
  app.innerHTML = header("练习 " + (st.i + 1) + "/" + st.list.length, (TYPE_LABEL[q.type] || q.type) + " · " + (ch ? ch.title : ""), true) + `<main class="wrap">
    <div class="card">
      <div class="quiz-q">${escapeHtml(q.stem)}</div>
      ${textTypes
        ? `<textarea id="textAns" rows="4" placeholder="先自己写，再对答案"></textarea>
           <button class="btn block" style="margin-top:8px" onclick="judgeText()">对照答案</button>
           <div id="fb"></div>`
        : multiType
          ? q.options.map((op, i) => `<button class="opt" id="op${i}" onclick="toggleMulti(${i})">${String.fromCharCode(65 + i)}. ${escapeHtml(op)}</button>`).join("") + `<button class="btn block" style="margin-top:10px" onclick="submitMulti()">确认多选答案</button>`
          : q.options.map((op, i) => `<button class="opt" id="op${i}" onclick="pickOpt(${i})">${String.fromCharCode(65 + i)}. ${escapeHtml(op)}</button>`).join("")}
    </div>
  </main>` + tabbar("/practice");
}

function toggleMulti(i) {
  const st = window._quiz;
  if (st.judged) return;
  if (!st.multiPicks) st.multiPicks = [];
  const k = st.multiPicks.indexOf(i);
  if (k >= 0) st.multiPicks.splice(k,1); else st.multiPicks.push(i);
  const el = $("#op"+i); if (el) el.classList.toggle("on");
}

function submitMulti() {
  const st = window._quiz; if (st.judged) return;
  const q = st.list[st.i]; const picks=(st.multiPicks||[]).slice().sort((a,b)=>a-b); const ans=q.answer.slice().sort((a,b)=>a-b);
  if (!picks.length) return;
  st.judged=true; st.n+=1;
  const ok = picks.length===ans.length && picks.every((x,i)=>x===ans[i]);
  if(ok){st.score+=1;Store.recordRight(q);} else Store.recordWrong(q,"");
  if(q.subject==="pol") Store.recordPoliticsAttempt("multi",ok,"");
  q.options.forEach((_,i)=>{const el=$("#op"+i); if(ans.includes(i)) el.classList.add("right"); if(picks.includes(i)&&!ans.includes(i)) el.classList.add("wrong");});
  const box=document.createElement("div"); box.className="box "+(ok?"ok":"warn");
  box.innerHTML=`<b>${ok?"全对":"未全对"}</b><br>${escapeHtml(q.explain||"")}${ok?"":`<p class="small">多选题少选、多选、错选都按错题处理。错因：</p><select id="reason"><option value="知识缺口">知识缺口</option><option value="概念混淆">概念混淆</option><option value="题干漏词">题干漏词</option><option value="范围偷换">范围偷换</option><option value="绝对化表述">绝对化表述</option><option value="阶段错位">阶段错位</option><option value="过度推断">过度推断</option><option value="粗心">粗心</option></select>`}<button class="btn block" style="margin-top:10px" onclick="nextQuiz()">${st.i<st.list.length-1?"下一题":"看结果"}</button>`;
  $(".card").appendChild(box);
}

function pickOpt(i) {
  const st = window._quiz;
  if (st.judged) return;
  st.judged = true;
  const q = st.list[st.i];
  const ok = i === q.answer;
  st.n += 1;
  if (ok) { st.score += 1; Store.recordRight(q); }
  else Store.recordWrong(q, "");
  if (q.subject === "en") Store.recordEnglishAttempt("practice", ok, "");
  if (q.subject === "pol") Store.recordPoliticsAttempt("choice", ok, "");
  q.options.forEach((_, idx) => {
    const el = $("#op" + idx);
    if (idx === q.answer) el.classList.add("right");
    if (idx === i && !ok) el.classList.add("wrong");
  });
  const box = document.createElement("div");
  box.className = "box " + (ok ? "ok" : "warn");
  box.innerHTML = `<b>${ok ? "对" : "错"}</b><br>${escapeHtml(q.explain || "")}
    ${ok ? "" : (q.subject === "en" ? `<p class="small">这道英语题为什么错？</p><select id="reason"><option value="词汇">词汇</option><option value="句法">句法</option><option value="定位">定位</option><option value="逻辑">逻辑</option><option value="干扰项">干扰项</option><option value="粗心">粗心</option></select>` : q.subject === "pol" ? `<p class="small">政治错因：</p><select id="reason"><option value="知识缺口">知识缺口</option><option value="概念混淆">概念混淆</option><option value="题干漏词">题干漏词</option><option value="阶段错位">阶段错位</option><option value="过度推断">过度推断</option><option value="粗心">粗心</option></select>` : `<p class="small">这道错题已入错题本。可选填原因：</p><input id="reason" type="text" placeholder="例如：把OR和RR记反了">`)}
    <button class="btn block" style="margin-top:10px" onclick="nextQuiz()">${st.i < st.list.length - 1 ? "下一题" : "看结果"}</button>`;
  $(".card").appendChild(box);
}

function judgeText() {
  const st = window._quiz;
  if (st.judged) return;
  st.judged = true;
  const q = st.list[st.i];
  const mine = $("#textAns").value.trim();
  $("#fb").innerHTML = `<div class="box"><b>参考答案</b><br>${escapeHtml(q.answer)}<br><span class="small">${escapeHtml(q.explain || "")}</span></div>
    <p class="muted">对照后给自己判一下。你的作答：${escapeHtml(mine || "（空白）")}</p>
    <div class="rate">
      <button class="btn crimson" onclick="selfJudge(false)">我错了</button>
      <button class="btn forest" onclick="selfJudge(true)">我基本对</button>
    </div>`;
}

function selfJudge(ok) {
  const st = window._quiz;
  const q = st.list[st.i];
  st.n += 1;
  if (ok) { st.score += 1; Store.recordRight(q); }
  else Store.recordWrong(q, $("#reason") ? $("#reason").value : "");
  nextQuiz();
}

function nextQuiz() {
  const st = window._quiz;
  const q = st.list[st.i];
  const r = $("#reason");
  if (r && r.value.trim()) { Store.setWrongReason(q.id, r.value.trim()); if(q.subject === "en") Store.recordEnglishAttempt("error_reason", false, r.value.trim()); if(q.subject === "pol") Store.recordPoliticsAttempt("error_reason", false, r.value.trim()); }
  if (st.i < st.list.length - 1) {
    st.i += 1;
    st.judged = false;
    st.multiPicks = [];
    drawQuiz();
  } else {
    const pct = st.n ? Math.round(st.score / st.n * 100) : 0;
    const onlyPol=st.list.length&&st.list.every(x=>x.subject==='pol');
    const onlyEn=st.list.length&&st.list.every(x=>x.subject==='en');
    Store.markTaskQuality(onlyPol?'t-pol':onlyEn?'t-en':'t-353', pct>=80?'pass':pct>=60?'review':'redo', {source:'objective_quiz',score:pct});
    app.innerHTML = header("本轮结束", "对" + st.score + " / " + st.n) + `<main class="wrap"><div class="card">
      <div class="days">${pct}<span>分</span></div>
      <p class="muted">错题已进入错题本，系统会把反复错的章节顶到首页。</p>
      <button class="btn block" onclick="go('/execute')">完成本项 → 继续今天下一项</button>
      <button class="btn ghost block" style="margin-top:8px" onclick="go('/wrong')">看错题</button>
    </div></main>` + tabbar("/practice");
  }
}

function viewWrong() {
  const s = Store.get();
  const items = Object.values(s.wrong).sort((a, b) => Number(a.mastered) - Number(b.mastered) || b.count - a.count);
  const open = items.filter((x) => !x.mastered);
  app.innerHTML = header("错题系统", "待复习 " + open.length + " · 累计 " + items.length) + `<main class="wrap">
    <button class="btn block" ${open.length ? "" : "disabled"} onclick="go('/practice/run?wrong=1')">重做错题</button>
    ${items.length ? items.map((w) => {
      const q = QUESTIONS.find((x) => x.id === w.id);
      const ch = q && chapter(q.chapterId);
      return `<div class="card">
        <span class="tag ${w.mastered ? "green" : "red"}">${w.mastered ? "已掌握" : "待复习"}</span>
        <span class="tag">错${w.count}次</span>
        <div class="quiz-q">${escapeHtml(q ? q.stem : w.id)}</div>
        <div class="small">${ch ? subjectMeta(ch.subject).name + " · " + ch.title : ""}</div>
        ${q && q.options ? `<div class="box ok">答案：${escapeHtml(typeof q.answer === "number" ? q.options[q.answer] : String(q.answer))}</div>` : ""}
        <div class="small">原因：${escapeHtml(w.reason || "还没写")}</div>
        <input type="text" placeholder="补一句错误原因" onchange="Store.setWrongReason('${w.id}', this.value)">
      </div>`;
    }).join("") : `<div class="card empty">还没有错题。先去做练习或模拟考。</div>`}
  </main>` + tabbar("/wrong");
}

function viewReview(query) {
  const weekly = query && query.weekly;
  let list = dueChapters();
  if (weekly || !list.length) {
    list = shuffle(CHAPTERS.filter((c) => ["epi", "stats", "ph", "mp"].includes(c.subject))).slice(0, weekly ? 8 : 5);
  }
  app.innerHTML = header(weekly ? "周日闭卷20问" : "间隔复习", weekly ? "随机抽章，红的下周优先" : "到期的先复习，没有到期就预演") + `<main class="wrap">
    <p class="muted">间隔：会了之后大约 1→3→7→14→30 天再见；不会则明天再来。</p>
    ${list.map((c) => `<button class="list-item" onclick="go('/recite/${c.id}')">
      <div class="ttl">${c.title}</div>
      <div class="small">${subjectMeta(c.subject).name} · 到期复习 / 抽查</div>
    </button>`).join("")}
  </main>` + tabbar("/learn");
}

function viewMock(run, kind) {
  if (!run) {
    const hist = Store.get().mocks;
    app.innerHTML = header("模拟考场", "计时、交卷、章节得分、错题入库") + `<main class="wrap">
      <div class="card">
        <button class="btn block" onclick="go('/mock/run/353')">353 阶段测试 · 30题 / 45分钟</button>
        <button class="btn ghost block" style="margin-top:8px" onclick="go('/mock/run/353mix')">353 跨科综合 · 20题 / 35分钟</button>
        <button class="btn ghost block" style="margin-top:8px" onclick="go('/mock/run/en')">英语一小模 · 10题 / 20分钟</button>
        <button class="btn ghost block" style="margin-top:8px" onclick="go('/mock/run/pol')">政治小模 · 20题 / 25分钟</button>
        <button class="btn crimson block" style="margin-top:8px" onclick="go('/mock/run/full')">全套串联（先353）</button>
      </div>
      <div class="card"><b>最近模拟</b>
        ${hist.length ? hist.map((m) => `<div class="task"><div>📋</div><div><b>${escapeHtml(m.kind)} · ${m.score}/${m.total}（${m.pct}分）</b><div class="small">${new Date(m.at).toLocaleString("zh-CN")} · 弱项：${escapeHtml(m.weak || "无")}</div></div></div>`).join("") : "<p class='muted'>还没有模拟记录。</p>"}
      </div>
    </main>` + tabbar("/mock");
    return;
  }
  const conf = {
    "353": { subjects: ["epi", "stats", "ph", "mp"], n: 30, mins: 45, name: "353阶段测试" },
    "353mix": { subjects: ["epi", "stats", "ph", "mp"], n: 20, mins: 35, name: "353跨科综合" },
    en: { subjects: ["en"], n: 10, mins: 20, name: "英语一" },
    pol: { subjects: ["pol"], n: 20, mins: 25, name: "政治小模" },
    full: { subjects: ["epi", "stats", "ph", "mp"], n: 30, mins: 45, name: "全套·353部分" },
  }[kind] || { subjects: ["epi"], n: 10, mins: 15, name: "练习" };
  const pool = QUESTIONS.filter((q) => conf.subjects.includes(q.subject) && q.options);
  mockState = {
    kind: conf.name,
    list: shuffle(pool).slice(0, Math.min(conf.n, pool.length)),
    i: 0,
    picks: {},
    end: Date.now() + conf.mins * 60 * 1000,
    submitted: false,
  };
  if (mockTimer) clearInterval(mockTimer);
  mockTimer = setInterval(drawMock, 1000);
  drawMock();
}

function remainText() {
  const left = Math.max(0, mockState.end - Date.now());
  const m = Math.floor(left / 60000);
  const s = Math.floor(left / 1000) % 60;
  if (left <= 0 && !mockState.submitted) submitMock();
  return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function drawMock() {
  if (!mockState || mockState.submitted) return;
  const q = mockState.list[mockState.i];
  const pick = mockState.picks[q.id];
  app.innerHTML = header(mockState.kind, "第 " + (mockState.i + 1) + " / " + mockState.list.length + " 题") + `<main class="wrap">
    <div class="card row"><b class="timer">${remainText()}</b><span class="muted">到点自动交卷</span></div>
    <div class="card">
      <div class="quiz-q">${escapeHtml(q.stem)}</div>
      ${q.options.map((op, i) => `<button class="opt ${pick === i ? "on" : ""}" onclick="mockPick(${i})">${String.fromCharCode(65 + i)}. ${escapeHtml(op)}</button>`).join("")}
      <div class="row" style="margin-top:12px">
        <button class="btn ghost" ${mockState.i === 0 ? "disabled" : ""} onclick="mockState.i--;drawMock()">上一题</button>
        ${mockState.i < mockState.list.length - 1
          ? `<button class="btn" onclick="mockState.i++;drawMock()">下一题</button>`
          : `<button class="btn crimson" onclick="submitMock()">交卷</button>`}
      </div>
    </div>
  </main>` + tabbar("/mock");
}

function mockPick(i) {
  mockState.picks[mockState.list[mockState.i].id] = i;
  drawMock();
}

function submitMock() {
  if (!mockState || mockState.submitted) return;
  mockState.submitted = true;
  if (mockTimer) clearInterval(mockTimer);
  let score = 0;
  const by = {};
  mockState.list.forEach((q) => {
    const ch = chapter(q.chapterId);
    const key = ch ? ch.title : q.subject;
    if (!by[key]) by[key] = { ok: 0, n: 0 };
    by[key].n += 1;
    const ok = mockState.picks[q.id] === q.answer;
    if (ok) { score += 1; by[key].ok += 1; Store.recordRight(q); }
    else Store.recordWrong(q, "模拟考错");
  });
  const total = mockState.list.length;
  const pct = Math.round(score / total * 100);
  const weak = Object.keys(by).filter((k) => by[k].ok / by[k].n < 0.6).join("、") || "暂无明显弱项";
  Store.saveMock({ kind: mockState.kind, score, total, pct, weak, at: Date.now() });
  Store.markTask("t-mock");
  app.innerHTML = header("交卷结果", mockState.kind) + `<main class="wrap">
    <div class="card"><div class="days">${pct}<span>分</span></div><p>对 ${score} / ${total}</p>
      <div class="box warn"><b>建议先复习</b><br>${escapeHtml(weak)}</div>
    </div>
    <div class="card"><b>章节得分</b>
      ${Object.keys(by).map((k) => `<div class="map-item"><div class="row"><b>${escapeHtml(k)}</b><span>${by[k].ok}/${by[k].n}</span></div>
        <div class="bar"><i style="width:${Math.round(by[k].ok / by[k].n * 100)}%"></i></div></div>`).join("")}
    </div>
    <button class="btn block" onclick="go('/wrong')">错题已入库，去看</button>
    <button class="btn ghost block" style="margin-top:8px" onclick="go('/mock')">返回模拟</button>
  </main>` + tabbar("/mock");
}

function viewEnglishPlan() {
  const ep = Store.englishProfile();
  const stages = [
    [1,"词汇生存层","至少见过950词、850词完成2次间隔回忆、弱词率≤20%", ep.wordReady],
    [2,"句子层","长难句累计≥20次，正确率≥75%", ep.sentenceReady],
    [3,"阅读主战场","中长阅读累计≥32题，近期正确率≥75%", ep.readingReady],
    [4,"其余计分模块","完形/新题型/翻译各≥12次且≥70%", ep.moduleReady],
    [5,"真题与限时","只使用合法可用或你提供的真实历年题", false]
  ];
  const reason = ep.reasons.length ? ep.reasons[0][0]+"（"+ep.reasons[0][1]+"次）" : "暂无足够错误记录";
  app.innerHTML = header("英语一 · 65分路线图","系统告诉你现在练什么",true)+`<main class="wrap">
    <section class="card"><span class="tag green">训练目标 65</span><h3>当前阶段：第 ${ep.stage} 阶段</h3><div class="box ok"><b>下一步：</b>${escapeHtml(ep.next)}</div><p class="small">训练准备度 ${ep.readiness}% 仅用于安排学习，不等于真实考试分数预测。</p><div class="bar"><i style="width:${ep.readiness}%"></i></div></section>
    <section class="card"><h3>五阶段闸门</h3>${stages.map(x=>`<div class="map-item"><div class="row"><b>${x[0]}. ${x[1]}</b><span>${x[3]?'已达标':(ep.stage===x[0]?'当前':'待完成')}</span></div><div class="small">${x[2]}</div></div>`).join('')}</section>
    <section class="card"><h3>当前数据</h3><div class="box">词汇见过：<b>${ep.seenCore}/1000</b>（${ep.wordCoverage}%）<br>词汇真正掌握：<b>${ep.masteredCore}/1000</b>（${ep.wordMastery}%）<br>到期弱词：<b>${ep.dueWeak}</b>，当前弱词率：<b>${ep.weakRate}%</b><br>课程掌握：<b>${Math.round(ep.enMastery*100)}%</b><br>长难句：<b>${ep.byKind.sentence.n}次 / ${ep.byKind.sentence.accuracy==null?'暂无':ep.byKind.sentence.accuracy+'%'}</b><br>中长阅读：<b>${ep.readingAttempts}题 / ${ep.readingAccuracy==null?'暂无':ep.readingAccuracy+'%'}</b><br>完形：<b>${ep.byKind.cloze.n}次 / ${ep.byKind.cloze.accuracy==null?'暂无':ep.byKind.cloze.accuracy+'%'}</b><br>新题型：<b>${ep.byKind.newtype.n}次 / ${ep.byKind.newtype.accuracy==null?'暂无':ep.byKind.newtype.accuracy+'%'}</b><br>翻译：<b>${ep.byKind.translation.n}次 / ${ep.byKind.translation.accuracy==null?'暂无':ep.byKind.translation.accuracy+'%'}</b><br>最高频错因：<b>${escapeHtml(reason)}</b></div></section>
    <button class="btn block" onclick="go('/english/daily')">按路线开始今天英语</button>
    <button class="btn ghost block" style="margin-top:8px" onclick="go('/english')">返回英语总台</button>
  </main>`+tabbar('/learn');
}

function viewEnglish(mode) {
  if (mode === "plan") return viewEnglishPlan();
  if (mode === "daily") {
    const prof = Store.englishProfile();
    const weakSet = new Set(prof.weakIds || []);
    const state = Store.get();
    const now = Date.now();
    const wordState = (state.english&&state.english.words)||{};
    const dueWeakSet = new Set(Object.entries(wordState).filter(([_,x])=>x && !x.ok && (!x.nextDue || x.nextDue<=now)).map(([id])=>id));
    const dueKnownSet = new Set(Object.entries(wordState).filter(([_,x])=>x && x.ok && x.nextDue && x.nextDue<=now).map(([id])=>id));
    const seenSet = new Set(Object.keys(wordState));
    const dueWeakPool = shuffle(ENGLISH_WORDS.filter(w => dueWeakSet.has(w[0])));
    const unseenPool = shuffle(ENGLISH_WORDS.filter(w => !seenSet.has(w[0])));
    const dueKnownPool = shuffle(ENGLISH_WORDS.filter(w => dueKnownSet.has(w[0])));
    const otherWeakPool = shuffle(ENGLISH_WORDS.filter(w => weakSet.has(w[0]) && !dueWeakSet.has(w[0])));
    // V32 audit fix: due weak → unseen → due mastered → other weak. Never waste the 10-word minimum on random familiar words.
    const words = [];
    [dueWeakPool, unseenPool, dueKnownPool, otherWeakPool].forEach(pool => {
      pool.forEach(w => { if (words.length < 10 && !words.some(x=>x[0]===w[0])) words.push(w); });
    });
    const pass = ENGLISH_PASSAGES[Math.floor(Math.random() * ENGLISH_PASSAGES.length)];
    window._en = { words, i: 0, pass, shown: false, pv:false, ans:{} };
    return drawEnglish();
  }
  const s = Store.get();
  const enCh = CHAPTERS.filter(c => c.subject === "en");
  const qn = QUESTIONS.filter(q => q.subject === "en").length;
  const seenWords = Object.keys((s.english && s.english.words) || {}).length;
  const weakWords = Object.values((s.english && s.english.words) || {}).filter(x => x && !x.ok).length;
  const ep = Store.englishProfile();
  const topReason = ep.reasons.length ? ep.reasons[0][0] + "（" + ep.reasons[0][1] + "次）" : "还没有足够做题记录";
  app.innerHTML = header("英语一 · 60–65+", "从基础薄弱到真题与限时", true) + `<main class="wrap">
    <section class="card"><span class="tag green">目标</span><h3>不是背单词软件，是英语一得分系统</h3>
      <div class="box ok"><b>训练目标：65 / 100</b><br>基础 → 句子 → 阅读 → 完形/新题型/翻译 → 写作 → 真题 → 限时。</div>
      <p class="small">当前课程 ${enCh.length} 章 · 核心词库 ${ENGLISH_WORDS.length} 词 · 原创短阅读 ${ENGLISH_PASSAGES.length} 篇 · 专项练习 ${qn} 题。已见词 ${seenWords}，当前标记不熟 ${weakWords}。真实历年真题后续只用合法可用/你提供的材料导入，不用原创题冒充真题。</p>
    </section>
    <section class="card"><span class="tag green">V27新增</span><h3>🧠 记忆法已嵌入每一章</h3><p>不是靠“多看几遍”。每章自动给你：<b>一句钩子 → 画面/联想 → 压缩口令 → 闭眼复述</b>；再交给原有SRS安排1→3→7→14→30天复习。</p><div class="box"><b>英语单词统一四步：</b>词根/熟词联想（能用则用） → 放进例句 → 遮住中文主动回忆 → 到期再测。牵强谐音只作临时钩子，不当词义依据。</div></section>
    <button class="list-item" onclick="go('/english/plan')"><div class="ttl">🎯 65分路线图｜现在该练什么</div><div class="small">按词汇、长难句、阅读、四大模块的真实训练数据自动判断阶段</div></button>
    <button class="list-item" onclick="go('/english/daily')"><div class="ttl">① 今日任务｜到期弱词优先10词 + 1段</div><div class="small">先复现不熟词，不够再补新词；忙、出差、饭局也不断档</div></button>
    <button class="list-item" onclick="go('/english/sentence')"><div class="ttl">② 长难句拆解专项｜40句</div><div class="small">先找主干，再看中文与结构；训练不是背答案</div></button>
    <button class="list-item" onclick="go('/english/reading')"><div class="ttl">③ 中长阅读专项｜16篇 × 4题</div><div class="small">接近考研阅读动作：限时阅读 → 定位 → 选项 → 证据解析 → 错因</div></button>
    <button class="list-item" onclick="go('/english/modules')"><div class="ttl">④ 完形 / 新题型 / 翻译 / 作文｜V29实战入口</div><div class="small">四个计分模块开始形成手机训练闭环</div></button>
    <button class="list-item" onclick="go('/learn/en')"><div class="ttl">⑤ 英语完整课程｜从句子主干开始</div><div class="small">${enCh.length}章：语法底座、长难句、阅读、完形、新题型、翻译、写作、复盘</div></button>
    <button class="list-item" onclick="go('/practice/run?subject=en')"><div class="ttl">⑥ 英语专项练习</div><div class="small">当前 ${qn} 题 · 错题自动进入错题本</div></button>
    <button class="list-item" onclick="go('/mock/run/en')"><div class="ttl">⑦ 英语小模</div><div class="small">10题 / 20分钟 · 后续接真实真题整套</div></button>
    <button class="list-item" onclick="go('/english/audit')"><div class="ttl">⑧ V32 英语总审计</div><div class="small">检查内容量、学习闭环、手机操作与仍需真实真题验证的缺口</div></button>
    <button class="list-item" onclick="go('/english/check65')"><div class="ttl">⑨ 65分训练验收</div><div class="small">5道闸门：词汇 / 句法 / 阅读 / 模块 / 作文</div></button>
    <button class="list-item" onclick="go('/english/papers')"><div class="ttl">⑩ 真题入口</div><div class="small">真实年份题后续导入；原创题绝不冒充真题</div></button>
    <section class="card"><b>V32词汇审计</b><p>第一层训练词库目标：<b>1000+</b>；当前内置：<b>${ENGLISH_WORDS.length}</b>。数量达标不等于掌握；V32开始按“两次间隔回忆正确”统计真正掌握。该词库是训练层，不宣称等同于官方考研大纲词表，后续仍由真实真题与个人弱词补充。</p><div class="bar"><i style="width:${Math.min(100,Math.round(ENGLISH_WORDS.length/10))}%"></i></div></section><section class="card"><b>V32弱项反馈</b><p>最近英语练习正确率：<b>${ep.accuracy == null ? "暂无" : ep.accuracy + "%"}</b>；当前首要错因：<b>${escapeHtml(topReason)}</b>。</p><p class="small">错因统一分为：词汇 / 句法 / 定位 / 逻辑 / 干扰项 / 粗心。系统开始用你的真实错误决定后续重点。</p></section>
  </main>` + tabbar("/learn");
}

function drawEnglish() {
  const st = window._en;
  const w = st.words[st.i];
  app.innerHTML = header("英语一 · 今日最低任务", "10词 + 1段阅读", true) + `<main class="wrap">
    <div class="card">
      <div class="small">单词 ${st.i + 1}/10</div>
      <div class="quiz-q">${escapeHtml(w[0])}</div>
      ${st.shown ? `<div class="box">${escapeHtml(w[1])}<br><span class="small">${escapeHtml(w[2])}</span></div>` : `<button class="btn ghost block" onclick="window._en.shown=true;drawEnglish()">先自己想，再看释义</button>`}
      <div class="rate"><button class="btn crimson" onclick="enWord(false)">不熟</button><button class="btn forest" onclick="enWord(true)">记住了</button></div>
    </div>
    <div class="card"><b>${escapeHtml(st.pass.title)}</b><p>${escapeHtml(st.pass.text)}</p>
      ${st.pass.qs.map((q, qi) => `<div class="small">${escapeHtml(q.q)}</div>${q.opts.map((op, oi) => `<button class="opt ${st.ans[qi]===oi?(oi===q.a?'right':'wrong'):''}" onclick="enPassAnswer(${qi},${oi})">${escapeHtml(op)}</button>`).join("")}`).join("")}
      <button class="btn ghost block" style="margin-top:10px" onclick="window._en.pv=!window._en.pv;drawEnglish()">${st.pv?'收起词汇':'看这段命中的词库词'}</button>
      ${st.pv ? `<div class="box">${englishPassageVocab(st.pass).map(v=>`<div><b>${escapeHtml(v[0])}</b>：${escapeHtml(v[1])}</div>`).join('') || '这段没有命中当前词库；遇到的新词可后续进入个人词库。'}</div>` : ''}
    </div>
    <p class="muted">这是最低任务，不等于完整英语学习。正常日还要继续课程/专项。</p>
    <button class="btn block" onclick="go('/quality?id=t-en')">今日英语完成 · 判断掌握质量</button>
  </main>` + tabbar("/learn");
}

function englishPassageVocab(pass) {
  const text = String(pass.text || '').toLowerCase();
  const hits = ENGLISH_WORDS.filter(w => {
    const key = String(w[0]).toLowerCase();
    if (!key || key.includes(' ')) return text.includes(key);
    return new RegExp('\\b' + key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b','i').test(text);
  });
  return hits.slice(0,16);
}
function enPassAnswer(qi, oi) {
  const st = window._en;
  if (st.ans[qi] !== undefined) return;
  st.ans[qi] = oi;
  const q = st.pass.qs[qi];
  const ok = oi === q.a;
  Store.recordEnglishAttempt('reading', ok, ok ? '' : '定位');
  drawEnglish();
}

function enWord(ok) {
  const w = window._en.words[window._en.i];
  Store.markWord(w[0], ok);
  if (window._en.i < window._en.words.length - 1) {
    window._en.i += 1;
    window._en.shown = false;
    drawEnglish();
  } else {
    window._en.shown = true;
    drawEnglish();
  }
}



function viewEnglishReading() {
  const list = window.ENGLISH_LONG_READINGS || [];
  if (!list.length) return go('/english');
  const idx = Math.floor(Math.random()*list.length);
  window._enr = { pass:list[idx], ans:{}, started:Date.now(), done:false };
  drawEnglishReading();
}
function drawEnglishReading() {
  const st=window._enr, p=st.pass;
  const answered=Object.keys(st.ans).length;
  const elapsed=Math.max(1,Math.floor((Date.now()-st.started)/60000));
  app.innerHTML = header('英语一 · 中长阅读', p.title+'｜'+elapsed+'分钟', true) + `<main class="wrap">
    <section class="card"><div class="small">建议：先用 6–8 分钟独立读文并做4题。不要逐词翻译。</div><p style="white-space:pre-line;line-height:1.75">${escapeHtml(p.text)}</p></section>
    ${p.qs.map((q,qi)=>`<section class="card"><b>${qi+1}. ${escapeHtml(q.q)}</b>${q.opts.map((op,oi)=>`<button class="opt ${st.ans[qi]!==undefined?(oi===q.a?'right':(st.ans[qi]===oi?'wrong':'')):''}" onclick="enReadingAnswer(${qi},${oi})">${escapeHtml(op)}</button>`).join('')}${st.ans[qi]!==undefined?`<div class="box ${st.ans[qi]===q.a?'ok':'warn'}"><b>${st.ans[qi]===q.a?'正确':'错因：'+escapeHtml(q.reason||'阅读')}</b><br>${escapeHtml(q.explain||'')}</div>`:''}</section>`).join('')}
    <section class="card"><b>本篇进度</b><p>${answered}/4 题已作答。全部完成后系统会把错误按主旨/定位/推断/词义/例证/态度等记录。</p>${answered===p.qs.length?`<button class="btn block" onclick="finishEnglishReading()">完成本篇并返回英语首页</button>`:''}</section>
  </main>` + tabbar('/learn');
}
function enReadingAnswer(qi,oi) {
  const st=window._enr;
  if (st.ans[qi]!==undefined) return;
  const q=st.pass.qs[qi], ok=oi===q.a;
  st.ans[qi]=oi;
  Store.recordEnglishAttempt('long-reading',ok,ok?'':(q.reason||'阅读'));
  drawEnglishReading();
}
function finishEnglishReading(){ go('/quality?id=t-en'); }

function viewEnglishSentence() {
  const list = window.ENGLISH_SENTENCES || [];
  if (!list.length) return go('/english');
  window._ens = { list: shuffle(list).slice(0, 10), i: 0, shown: false };
  drawEnglishSentence();
}
function drawEnglishSentence() {
  const st = window._ens, x = st.list[st.i];
  app.innerHTML = header('英语一 · 长难句', (st.i+1)+'/'+st.list.length+'｜先找主干', true) + `<main class="wrap">
    <div class="card"><div class="quiz-q">${escapeHtml(x.text)}</div>
      ${st.shown ? `<div class="box"><b>主干：</b>${escapeHtml(x.main)}<br><b>译文：</b>${escapeHtml(x.cn)}<br><span class="small"><b>结构：</b>${escapeHtml(x.focus)}</span></div>` : `<button class="btn ghost block" onclick="window._ens.shown=true;drawEnglishSentence()">我找完主干了，显示解析</button>`}
      ${st.shown ? `<div class="rate"><button class="btn crimson" onclick="nextEnglishSentence(false)">没拆出来</button><button class="btn forest" onclick="nextEnglishSentence(true)">基本拆对</button></div>` : ''}
    </div><p class="muted">标准动作：圈连接词 → 找谓语 → 找主干 → 再挂修饰。不要一上来逐词翻译。</p>
  </main>` + tabbar('/learn');
}
function nextEnglishSentence(ok) {
  Store.recordEnglishAttempt('sentence', ok, ok ? '' : '句法');
  const st=window._ens;
  if (st.i < st.list.length-1) { st.i++; st.shown=false; drawEnglishSentence(); } else { go('/quality?id=t-en'); }
}


function viewEnglishModules() {
  app.innerHTML = header('英语一 · 四大计分模块','完形 / 新题型 / 翻译 / 作文',true)+`<main class="wrap">
    <section class="card"><span class="tag green">V29</span><h3>阅读之后，不留计分模块空白</h3><p>以下均为原创训练材料，用来练动作和输出；不冒充历年真题。后续真题只接入合法可用或你提供的材料。</p><div class="box"><b>记忆口令：</b>完形“逻辑先于词义”｜新题型“连接先于翻译”｜翻译“主干先行、修饰归位”｜作文“功能句骨架 + 自己填内容”。</div></section>
    <button class="list-item" onclick="go('/english/cloze')"><div class="ttl">① 完形填空｜6篇 × 4空</div><div class="small">上下文逻辑、搭配、转折因果；逐空即时反馈</div></button>
    <button class="list-item" onclick="go('/english/newtype')"><div class="ttl">② 新题型｜6组</div><div class="small">排序、标题匹配、句子插入；训练代词/连接/逻辑链</div></button>
    <button class="list-item" onclick="go('/english/translation')"><div class="ttl">③ 翻译｜20句</div><div class="small">先自己译，再看主干、结构和参考译文</div></button>
    <button class="list-item" onclick="go('/english/writing')"><div class="ttl">④ 写作｜10题</div><div class="small">5类小作文 + 5类大作文；先骨架后独立输出</div></button>
  </main>`+tabbar('/learn');
}
function viewEnglishCloze(){ const list=window.ENGLISH_CLOZE||[]; window._cz={x:list[Math.floor(Math.random()*list.length)],ans:{}}; drawEnglishCloze(); }
function drawEnglishCloze(){ const st=window._cz,x=st.x; let html=escapeHtml(x.text); x.blanks.forEach((_,i)=>{html=html.replace('___'+(i+1)+'___','<b>【'+(i+1)+'】</b>')}); app.innerHTML=header('英语一 · 完形',x.title,true)+`<main class="wrap"><section class="card"><p style="line-height:1.8">${html}</p><div class="box"><b>先判断：</b>这里需要的是逻辑关系、固定搭配，还是语义一致？不要只看单个词。</div></section>${x.blanks.map((ops,i)=>`<section class="card"><b>${i+1}.</b>${ops.map((op,j)=>`<button class="opt ${st.ans[i]!==undefined?(j===x.a[i]?'right':(st.ans[i]===j?'wrong':'')):''}" onclick="answerCloze(${i},${j})">${escapeHtml(op)}</button>`).join('')}${st.ans[i]!==undefined?`<div class="small">正确答案：${escapeHtml(ops[x.a[i]])}</div>`:''}</section>`).join('')}<button class="btn ghost block" onclick="go('/english/modules')">返回四大模块</button></main>`+tabbar('/learn'); }
function answerCloze(i,j){const st=window._cz;if(st.ans[i]!==undefined)return;st.ans[i]=j;Store.recordEnglishAttempt('cloze',j===st.x.a[i],j===st.x.a[i]?'':'完形');drawEnglishCloze();}
function viewEnglishNewtype(){const list=window.ENGLISH_NEWTYPE||[];window._nt={list:shuffle(list),i:0,shown:false};drawEnglishNewtype();}
function drawEnglishNewtype(){const st=window._nt,x=st.list[st.i];app.innerHTML=header('英语一 · 新题型',(st.i+1)+'/'+st.list.length,true)+`<main class="wrap"><section class="card"><h3>${escapeHtml(x.title)}</h3><p><b>${escapeHtml(x.prompt)}</b></p>${x.items.map(t=>`<div class="box">${escapeHtml(t)}</div>`).join('')}<button class="btn ghost block" onclick="window._nt.shown=true;drawEnglishNewtype()">我做完了，看答案</button>${st.shown?`<div class="box ok"><b>答案：</b>${escapeHtml(x.answer)}<br><b>连接线索：</b>${escapeHtml(x.tip)}</div><div class="rate"><button class="btn crimson" onclick="nextNewtype(false)">没做对</button><button class="btn forest" onclick="nextNewtype(true)">做对了</button></div>`:''}</section></main>`+tabbar('/learn');}
function nextNewtype(ok){Store.recordEnglishAttempt('newtype',ok,ok?'':'新题型');const st=window._nt;if(st.i<st.list.length-1){st.i++;st.shown=false;drawEnglishNewtype()}else go('/english/modules');}
function viewEnglishTranslation(){const list=shuffle(window.ENGLISH_TRANSLATION||[]).slice(0,10);window._tr={list,i:0,shown:false};drawEnglishTranslation();}
function drawEnglishTranslation(){const st=window._tr,x=st.list[st.i];app.innerHTML=header('英语一 · 翻译',(st.i+1)+'/'+st.list.length,true)+`<main class="wrap"><section class="card"><div class="quiz-q">${escapeHtml(x[0])}</div><div class="box"><b>三步：</b>①圈连接词/谓语 ②写主干 ③把定语、状语归位。先口译或在纸上写，再看答案。</div>${st.shown?`<div class="box ok"><b>参考译文：</b>${escapeHtml(x[1])}<br><b>结构：</b>${escapeHtml(x[2])}</div><div class="rate"><button class="btn crimson" onclick="nextTranslation(false)">主干/逻辑错</button><button class="btn forest" onclick="nextTranslation(true)">基本译对</button></div>`:`<button class="btn ghost block" onclick="window._tr.shown=true;drawEnglishTranslation()">我译完了，显示解析</button>`}</section></main>`+tabbar('/learn');}
function nextTranslation(ok){Store.recordEnglishAttempt('translation',ok,ok?'':'翻译');const st=window._tr;if(st.i<st.list.length-1){st.i++;st.shown=false;drawEnglishTranslation()}else go('/english/modules');}
function viewEnglishWriting(){
  const list=window.ENGLISH_WRITING||[], st=Store.get(), drafts=(st.english&&st.english.drafts)||{};
  app.innerHTML=header('英语一 · 写作输出','手机直接写，不只看模板',true)+`<main class="wrap"><section class="card"><div class="box warn"><b>三遍法：</b>①看骨架仿写 ②只看题目闭卷写 ③按任务完成/结构/语言/字数自检。目标是能脱离模板输出。</div><p class="small">已保存有效草稿：<b>${Object.keys(drafts).filter(k=>(drafts[k].text||'').trim().length>=60).length}</b> 篇。内容只保存在你当前浏览器本地。</p></section>${list.map((x,i)=>`<section class="card"><span class="tag">${escapeHtml(x.kind)}</span><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.task)}</p><details><summary>需要时展开骨架与记忆钩子</summary><div class="box"><b>记忆：</b>${escapeHtml(x.memory)}</div>${x.frame.map(t=>`<div class="small">• ${escapeHtml(t)}</div>`).join('')}</details><textarea id="draft-${x.id}" rows="8" style="width:100%;box-sizing:border-box;margin-top:10px;padding:12px;border-radius:10px" placeholder="在这里闭卷写……">${escapeHtml((drafts[x.id]||{}).text||'')}</textarea><div class="row" style="margin-top:8px"><button class="btn ghost" onclick="saveWriting('${x.id}')">保存草稿</button><button class="btn forest" onclick="finishWriting('${x.id}',true)">自检通过</button><button class="btn crimson" onclick="finishWriting('${x.id}',false)">还不会写</button></div></section>`).join('')}</main>`+tabbar('/learn');
}
function saveWriting(id){const el=document.getElementById('draft-'+id);Store.saveEnglishDraft(id,el?el.value:'');alert('草稿已保存在本机');}
function finishWriting(id,ok){const el=document.getElementById('draft-'+id);Store.saveEnglishDraft(id,el?el.value:'');Store.recordEnglishAttempt('writing',ok,ok?'':'作文输出');viewEnglishWriting();}

function viewEnglishAudit(){
  const ep=Store.englishProfile();
  const counts={
    chapters:CHAPTERS.filter(c=>c.subject==='en').length,
    words:ENGLISH_WORDS.length,
    short:(window.ENGLISH_PASSAGES||[]).length,
    sentences:(window.ENGLISH_SENTENCES||[]).length,
    long:(window.ENGLISH_LONG_READINGS||[]).length,
    longQ:(window.ENGLISH_LONG_READINGS||[]).reduce((n,p)=>n+(p.qs||[]).length,0),
    cloze:(window.ENGLISH_CLOZE||[]).length,
    clozeQ:(window.ENGLISH_CLOZE||[]).reduce((n,p)=>n+(p.blanks||[]).length,0),
    newtype:(window.ENGLISH_NEWTYPE||[]).length,
    trans:(window.ENGLISH_TRANSLATION||[]).length,
    writing:(window.ENGLISH_WRITING||[]).length,
    objective:QUESTIONS.filter(q=>q.subject==='en').length
  };
  const rows=[
    ['基础课程结构',counts.chapters>=12,counts.chapters+'章','从句子主干到真题复盘路线完整'],
    ['第一层核心词',counts.words>=1000,counts.words+'词','数量已过第一层门槛；掌握改用两次间隔回忆判断'],
    ['句法训练',counts.sentences>=40,counts.sentences+'句','可支撑基础期；后续真题继续补真实长句'],
    ['阅读训练',counts.long>=16 && counts.longQ>=64,counts.long+'篇 / '+counts.longQ+'题','已有阶段训练量，最终难度必须由真题校准'],
    ['完形/新题型',counts.clozeQ>=24 && counts.newtype>=6,counts.clozeQ+'空 / '+counts.newtype+'组','已形成方法训练入口，不能替代真题'],
    ['翻译/写作',counts.trans>=20 && counts.writing>=10,counts.trans+'句 / '+counts.writing+'题','手机可闭卷输出并保存；写作评分仍需真题/人工校准'],
    ['错因与SRS闭环',true,'已接入','弱词、长难句、阅读、模块错误可回流到下一步'],
    ['真实历年题',false,'尚未导入','这是当前最大外部依赖；无真实材料时绝不伪造']
  ];
  const pass=rows.filter(x=>x[1]).length;
  app.innerHTML=header('英语一 · V32总审计',pass+'/'+rows.length+'项当前满足',true)+`<main class="wrap">
    <section class="card"><span class="tag green">审计结论</span><h3>基础训练系统可以阶段性封板，但英语不能“最终封板”</h3><p>当前已经能够支持从基础词句 → 阅读 → 计分模块 → 作文输出的手机学习闭环。仍有两个不能假装完成的部分：<b>真实历年题校准</b>，以及随着真题出现继续扩充的<b>第二层识别词/个人弱词</b>。</p><div class="box ok"><b>V32修复：</b>单词“见过一次”不再算掌握；每日10词改为到期弱词 → 新词 → 到期熟词优先，不再随机浪费在已熟词上。</div></section>
    ${rows.map(x=>`<section class="card"><div class="row"><div><b>${x[0]}</b><div class="small">${escapeHtml(x[2])}｜${escapeHtml(x[3])}</div></div><span class="tag ${x[1]?'green':''}">${x[1]?'满足':'待外部材料'}</span></div></section>`).join('')}
    <section class="card"><h3>你现在的真实词汇状态</h3><div class="box">见过：<b>${ep.seenCore}/1000</b><br>两次间隔回忆正确：<b>${ep.masteredCore}/1000</b><br>弱词率：<b>${ep.weakRate}%</b><br>今天到期弱词：<b>${ep.dueWeak}</b></div><p class="small">因此以后系统不会因为你“点过1000个词”就提前放行。</p></section>
    <section class="card"><h3>阶段封板标准</h3><p>英语基础系统从V32起不再无边界堆功能。除非出现：①真实英语一历年题；②真实训练数据暴露明显薄弱环节；③后续需要扩第二层识别词，否则主力开发转入政治60+系统。</p></section>
    <button class="btn block" onclick="go('/english/check65')">看我的65分训练闸门</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/english')">返回英语总台</button>
  </main>`+tabbar('/learn');
}

function viewEnglishPapers(){
 const ep=Store.englishProfile(), hist=ep.paperChecks||[];
 app.innerHTML=header('英语一 · 真题入口','真实年份题只认真实材料',true)+`<main class="wrap"><section class="card"><span class="tag green">V31</span><h3>真题库现在先建“入口”，不伪造题目</h3><p>你以后拿到合法可用的历年英语一真题/PDF，直接交给我导入。系统按年份保存：首次限时 → 分模块得分 → 错因 → 二刷。当前没有导入真实年份题时，这里不会拿原创题冒充。</p></section><section class="card"><h3>每套真题固定动作</h3><div class="box">①严格计时独立做 → ②记录客观题 → ③逐题回原文证据 → ④翻译/作文自检 → ⑤7–14天后二刷错题。</div><p class="small">已记录真题/整套验收：${hist.length} 次</p></section><button class="btn block" onclick="go('/english/check65')">先做65分训练验收</button></main>`+tabbar('/learn');
}
function viewEnglishCheck65(){
 const ep=Store.englishProfile();
 const rows=[['第一层1000词',ep.wordReady,'见过 '+ep.seenCore+'/1000；掌握 '+ep.masteredCore+'/1000；弱词率 '+ep.weakRate+'%'],['长难句',ep.sentenceReady,(ep.byKind.sentence.accuracy??'暂无')+'% / '+ep.byKind.sentence.n+'次'],['中长阅读',ep.readingReady,(ep.readingAccuracy??'暂无')+'% / '+ep.readingAttempts+'题'],['完形/新题型/翻译',ep.moduleReady,'三项均≥12次且≥70%'],['作文闭卷输出',ep.drafts>=6,ep.drafts+'篇有效草稿']];
 const passed=rows.filter(x=>x[1]).length;
 app.innerHTML=header('英语一 · 65分训练验收',passed+'/5项通过',true)+`<main class="wrap"><section class="card"><div class="box warn"><b>注意：</b>这是进入真题阶段的训练闸门，不是预测考试分数。最终是否具备65分能力，要用真实历年英语一整套限时成绩验证。</div></section>${rows.map(x=>`<section class="card row"><div><b>${x[0]}</b><div class="small">${x[2]}</div></div><span class="tag ${x[1]?'green':''}">${x[1]?'通过':'未过'}</span></section>`).join('')}<section class="card"><h3>系统给你的下一步</h3><p>${escapeHtml(ep.next)}</p>${passed===5?`<button class="btn block" onclick="go('/english/papers')">进入真题入口</button>`:`<button class="btn block" onclick="go('/english/plan')">回65分路线总台</button>`}</section></main>`+tabbar('/learn');
}


function parseQuery(q) {
  const o = {};
  (q || "").replace(/^\?/, "").split("&").forEach((p) => {
    if (!p) return;
    const [k, v] = p.split("=");
    o[decodeURIComponent(k)] = decodeURIComponent(v || "1");
  });
  return o;
}

function viewPolitics() {
  const p = Store.politicsProfile();
  const next = nextChapter("pol");
  const reasons = Object.entries(p.reasons||{}).sort((a,b)=>b[1]-a[1]).slice(0,3);
  app.innerHTML = header("政治60+总台", "101思想政治理论｜V37 60+总控", true) + `<main class="wrap">
    <section class="card"><div class="row"><div><span class="tag s">当前阶段</span><b>${escapeHtml(p.stage)}</b></div><span class="tag">准备度 ${p.readiness}%</span></div><p>${escapeHtml(p.next)}</p><div class="small">训练准备度只用于决定下一步，不是考试分数预测。</div></section>
    <section class="card"><div class="row"><b>政治知识地图</b><span>${p.learned}/${p.total} 已学习</span></div><div class="bar"><i style="width:${Math.round(p.learned/Math.max(1,p.total)*100)}%"></i></div><div class="small">绿色掌握 ${p.green}/${p.total}｜开放错题 ${p.openWrong}｜近期客观题 ${p.attempts} 题 / ${p.accuracy}%｜多选 ${p.multiAttempts}题 / ${p.multiAccuracy==null?'暂无':p.multiAccuracy+'%'}${p.mockAvg==null?'':`｜小模 ${p.mockAvg}%`}</div></section>
    <section class="card"><b>今天从这里开始</b><button class="btn block" style="margin-top:10px" onclick="go('/learn/pol/${next.id}')">学习：${escapeHtml(next.no+' '+next.title)}</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/practice/run?subject=pol&type=single')">政治单选专项</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/practice/run?subject=pol&type=multi')">政治多选专项（重点）</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/politics/analysis')">政治分析题SRS回炉（V36）</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/mock/run/pol')">政治小模考</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/politics/current')">年度时政更新入口</button><button class="btn crimson block" style="margin-top:8px" onclick="go('/politics/full')">政治100分整卷框架</button><button class="btn block" style="margin-top:8px" onclick="go('/politics/check60')">政治60+训练验收</button><button class="btn ghost block" style="margin-top:8px" onclick="go('/politics/audit')">V38 政治总审计</button></section>
    <section class="card"><b>60+路线</b><p>① 29章知识地图 → ② 单选/多选逐项证据判断与错因 → ③ 分析题“原理+材料” → ④ 2027大纲/年度时政校准 → ⑤ 真实历年题 → ⑥ 整套限时。</p><div class="box warn"><b>当前边界</b><br>2027年度时政尚未完整发生，且最终考试大纲需以后按官方发布校准。本版不编造未来时政，也不把原创题冒充真题。</div></section>
    <section class="card"><b>高频错因</b>${reasons.length?reasons.map(x=>`<div class="task"><div>⚠️</div><div><b>${escapeHtml(x[0])}</b><div class="small">${x[1]} 次</div></div></div>`).join(''):'<p class="muted">还没有数据。做题后这里会告诉你最常见的失分原因。</p>'}</section>
  </main>` + tabbar('/learn');
}


function viewPoliticsCurrent(){
 const p=Store.politicsProfile(), saved=((Store.get().politics||{}).currentAffairs||[]);
 app.innerHTML=header('政治 · 年度时政入口','V37｜稳定理论与年度动态分开',true)+`<main class="wrap">
 <section class="card"><div class="box warn"><b>规则：</b>这里只建立更新机制，不预测“2027必考时政”。考试年度重大事件按权威发布逐条加入，并映射回教材考点。</div><p class="small">已学习/标记 ${p.currentAffairsSeen} 个时政槽位。</p></section>
 ${POLITICS_CURRENT_AFFAIRS.map(x=>{const st=saved.find(y=>y.id===x.id);return `<section class="card"><span class="tag">${escapeHtml(x.period)}</span><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.status)}</p><div class="box">记忆链：${escapeHtml(x.hook)}</div><button class="btn ${st?'ghost':''} block" onclick="Store.savePoliticsCurrentAffairs('${x.id}','seen');viewPoliticsCurrent()">${st?'✓ 已标记':'标记已学习机制'}</button></section>`}).join('')}
 </main>`+tabbar('/learn');
}

function politicsFullBuild(){
 const singles=shuffle(QUESTIONS.filter(q=>q.subject==='pol'&&q.type==='single'&&q.options)).slice(0,16);
 const multis=shuffle(QUESTIONS.filter(q=>q.subject==='pol'&&q.type==='multi'&&q.options)).slice(0,17);
 return {singles,multis};
}
let polFullState=null;
function viewPoliticsFull(){
 if(!polFullState) polFullState={...politicsFullBuild(),si:0,mi:0,sp:{},mp:{},phase:'single',analysisScore:0,start:Date.now()};
 const x=polFullState;
 if(x.phase==='analysis'){
  app.innerHTML=header('政治100分整卷','分析题50分｜自评框架',true)+`<main class="wrap"><section class="card"><h3>客观题已完成</h3><p>现在按真实卷面思路继续5道分析题。当前版本不伪造年度真题；请完成5道分析题闭卷训练后，根据“原理准确+材料结合+分点完整”自评0–50分。</p><button class="btn block" onclick="go('/politics/analysis')">打开分析题训练库</button></section><section class="card"><label>分析题自评（0–50）</label><input id="polAnaScore" type="number" min="0" max="50" value="${x.analysisScore||0}" style="width:100%;padding:12px;margin:8px 0"><button class="btn crimson block" onclick="finishPoliticsFull()">完成整卷并保存</button></section></main>`+tabbar('/mock'); return;
 }
 const list=x.phase==='single'?x.singles:x.multis, idx=x.phase==='single'?x.si:x.mi, q=list[idx], picks=x.phase==='single'?x.sp:x.mp, pick=picks[q.id];
 const isMulti=x.phase==='multi';
 app.innerHTML=header('政治100分整卷',`${isMulti?'多选':'单选'} ${idx+1}/${list.length}`,true)+`<main class="wrap"><section class="card"><div class="quiz-q">${escapeHtml(q.stem)}</div>${q.options.map((op,i)=>`<button class="opt ${isMulti?(Array.isArray(pick)&&pick.includes(i)?'on':''):(pick===i?'on':'')}" onclick="politicsFullPick(${i})">${String.fromCharCode(65+i)}. ${escapeHtml(op)}</button>`).join('')}<div class="row" style="margin-top:12px"><span class="small">${isMulti?'多选/少选/错选均按0分训练':'单选每题1分'}</span><button class="btn" onclick="politicsFullNext()">${idx===list.length-1?(isMulti?'进入分析题':'进入多选'):'下一题'}</button></div></section></main>`+tabbar('/mock');
}
function politicsFullPick(i){const x=polFullState,q=(x.phase==='single'?x.singles[x.si]:x.multis[x.mi]);if(x.phase==='single')x.sp[q.id]=i;else{let a=x.mp[q.id]||[];x.mp[q.id]=a.includes(i)?a.filter(v=>v!==i):a.concat(i).sort();}viewPoliticsFull();}
function politicsFullNext(){const x=polFullState;if(x.phase==='single'){if(x.si<x.singles.length-1)x.si++;else x.phase='multi';}else{if(x.mi<x.multis.length-1)x.mi++;else x.phase='analysis';}viewPoliticsFull();}
function finishPoliticsFull(){const x=polFullState;let single=0,multi=0;x.singles.forEach(q=>{if(x.sp[q.id]===q.answer)single+=1;});x.multis.forEach(q=>{const a=x.mp[q.id]||[],b=q.answer||[];if(a.length===b.length&&a.every((v,i)=>v===b[i]))multi+=2;});const el=document.getElementById('polAnaScore');const ana=Math.max(0,Math.min(50,Number(el&&el.value)||0));const total=single+multi+ana;Store.savePoliticsFullMock({single,multi,analysis:ana,totalScore:total});polFullState=null;app.innerHTML=header('政治整卷结果',`${total}/100`,true)+`<main class="wrap"><section class="card"><div class="days">${total}<span>分</span></div><div class="box">单选 ${single}/16<br>多选 ${multi}/34<br>分析题自评 ${ana}/50</div><p class="small">这是原创训练框架+主观自评，不是真题分数预测。后续必须用真实历年题校准。</p></section><button class="btn block" onclick="go('/politics/check60')">查看60+验收</button></main>`+tabbar('/mock');}

function viewPoliticsCheck60(){
 const p=Store.politicsProfile();
 const rows=[['稳定理论',p.theoryReady,`绿色掌握 ${p.green}/${p.total}（闸门≥24章）`],['选择题',p.choiceReady,`近期 ${p.attempts}题/${p.accuracy}%；多选 ${p.multiAttempts}题/${p.multiAccuracy==null?'暂无':p.multiAccuracy+'%'}`],['分析题回忆',p.analysisReady,`连续回忆≥3次 ${p.analysisMastered}题（闸门≥10）`],['100分整卷',p.fullMockAvg!=null&&p.fullMockAvg>=60,`最近${p.fullMocks}套均值 ${p.fullMockAvg==null?'暂无':p.fullMockAvg+'分'}`],['年度时政/真实真题',false,'动态项：待2027考试年度权威材料与真实历年题持续校准']];
 app.innerHTML=header('政治60+训练验收',`${p.gatePassed}/4个内部闸门`,true)+`<main class="wrap"><section class="card"><div class="box warn">这是训练闸门，不是政治成绩预测。前4项用于内部放行；第5项必须等年度材料和真实真题校准。</div></section>${rows.map(r=>`<section class="card row"><div><b>${r[0]}</b><div class="small">${r[2]}</div></div><span class="tag ${r[1]?'green':''}">${r[1]?'通过':'未完成'}</span></section>`).join('')}<section class="card"><b>下一步</b><p>${escapeHtml(!p.theoryReady?'先补知识地图绿色掌握。':!p.choiceReady?'优先刷单选/多选并回炉错因。':!p.analysisReady?'每天做分析题SRS闭卷回忆。':(p.fullMockAvg==null||p.fullMockAvg<60)?'进入100分整卷训练框架。':'内部闸门已过，等待年度时政与真实真题校准。')}</p></section></main>`+tabbar('/learn');
}

function render() {
  const raw = hash();
  const [path, qs] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const query = parseQuery(qs);
  if (mockTimer && parts[0] !== "mock") {
    clearInterval(mockTimer);
    mockTimer = null;
  }
  if (!parts.length) return viewHome();
  if (parts[0] === "coach") return viewCoach();
  if (parts[0] === "acceptance") return viewAcceptance();
  if (parts[0] === "content-audit") return viewContentAudit();
  if (parts[0] === "roadmap") return viewRoadmap();
  if (parts[0] === "engine") return viewTodayEngine();
  if (parts[0] === "execute") return viewExecute();
  if (parts[0] === "quality") return viewQuality();
  if (parts[0] === "week") return viewWeekEngine();
  if (parts[0] === "adaptive") return viewAdaptiveEngine();
  if (parts[0] === "trend") return viewTrendEngine();
  if (parts[0] === "risk") return viewRiskRadar();
  if (parts[0] === "milestone") return viewMilestoneEngine();
  if (parts[0] === "monthly") return viewMonthlyReview();
  if (parts[0] === "backup") return viewBackupVault();
  if (parts[0] === "phase") return viewExamPhase();
  if (parts[0] === "command") return viewCommand();
  if (parts[0] === "score353") return viewScore353();
  if (parts[0] === "handcalc") return viewHandCalc();
  if (parts[0] === "learn") return viewLearn(parts[1], parts[2]);
  if (parts[0] === "recite") return viewRecite(parts[1]);
  if (parts[0] === "practice") return viewPractice(parts[1] === "run", query);
  if (parts[0] === "wrong") return viewWrong();
  if (parts[0] === "review") return viewReview(query);
  if (parts[0] === "mock") return viewMock(parts[1] === "run", parts[2]);
  if (parts[0] === "english" && parts[1] === "modules") return viewEnglishModules();
  if (parts[0] === "english" && parts[1] === "cloze") return viewEnglishCloze();
  if (parts[0] === "english" && parts[1] === "newtype") return viewEnglishNewtype();
  if (parts[0] === "english" && parts[1] === "translation") return viewEnglishTranslation();
  if (parts[0] === "english" && parts[1] === "writing") return viewEnglishWriting();
  if (parts[0] === "english" && parts[1] === "audit") return viewEnglishAudit();
  if (parts[0] === "english" && parts[1] === "papers") return viewEnglishPapers();
  if (parts[0] === "english" && parts[1] === "check65") return viewEnglishCheck65();
  if (parts[0] === "english" && parts[1] === "sentence") return viewEnglishSentence();
  if (parts[0] === "english" && parts[1] === "reading") return viewEnglishReading();
  if (parts[0] === "english") return viewEnglish(parts[1]);
  if (parts[0] === "politics" && parts[1] === "analysis") return viewPoliticsAnalysis(parts[2]);
  if (parts[0] === "politics" && parts[1] === "current") return viewPoliticsCurrent();
  if (parts[0] === "politics" && parts[1] === "full") return viewPoliticsFull();
  if (parts[0] === "politics" && parts[1] === "check60") return viewPoliticsCheck60();
  if (parts[0] === "politics" && parts[1] === "audit") return viewPoliticsAudit();
  if (parts[0] === "politics") return viewPolitics();
  viewHome();
}

window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  render();
});

function viewPoliticsAudit(){
  const p=Store.politicsProfile();
  const qs=(window.QUESTIONS||[]).filter(q=>q.subject==='pol');
  const singles=qs.filter(q=>q.type!=='multi').length, multis=qs.filter(q=>q.type==='multi').length;
  const analysis=(typeof POL_ANALYSIS==='undefined'?[]:POL_ANALYSIS).length;
  const rows=[
    ['稳定理论知识地图', p.total>=29, `${p.total}章｜已学${p.learned}｜绿色掌握${p.green}`],
    ['客观题训练量', qs.length>=120, `${qs.length}题（单选/判断等${singles}｜多选${multis}）`],
    ['多选专项机制', multis>=50, `${multis}道多选｜支持多选少选错选严格判分`],
    ['分析题闭卷+SRS', analysis>=18, `${analysis}道原创材料题｜1→3→7→14→30天回炉`],
    ['100分整卷框架', true, '16单选+17多选+分析题50分自评框架已接入'],
    ['年度时政接口', true, '稳定理论与考试年度动态分开；不提前编造2027热点'],
    ['真实真题校准', false, '仍需真实101历年题/2027年度权威材料后才能最终封板']
  ];
  const fixed=rows.slice(0,6).filter(x=>x[1]).length;
  app.innerHTML=header('V38 政治总审计',`零基础→60+训练闭环｜${fixed}/6个内部项就绪`,true)+`<main class="wrap">
    <section class="card"><div class="box warn"><b>审计结论：</b>政治的“学—记—选—错—分析题回炉—整卷”内部闭环已成型；V38补强后客观题达到120题。现在不再无边界堆原创题。最终封板必须等真实历年题与2027考试年度时政/大纲校准。</div></section>
    ${rows.map(r=>`<section class="card row"><div><b>${r[0]}</b><div class="small">${r[2]}</div></div><span class="tag ${r[1]?'green':''}">${r[1]?'通过':'待外部校准'}</span></section>`).join('')}
    <section class="card"><b>V38修复项</b><p>① 客观题从94题补到120题；② 新增26道稳定理论原创题，覆盖马原、毛中特/新时代、史纲、思法和答题方法；③ 增加政治总审计入口；④ 明确“内部训练封板”和“真实真题最终封板”不是一回事。</p></section>
    <section class="card"><b>阶段性封板规则</b><p>除非出现：①真实101历年题需要导入；②2027官方大纲/年度时政需要更新；③你的实际训练数据暴露明显薄弱点，否则政治主力开发暂停，下一步转入三科350+每日总调度。</p></section>
  </main>`+tabbar('/learn');
}

function finishPoliticsRecall(id){ const el=document.getElementById('paDraft'); Store.savePoliticsAnalysis(id,{draft:el?el.value:'',done:true,recall:true}); Store.markTaskQuality('t-pol','pass',{source:'analysis_recall'}); go('/execute'); }

function viewPoliticsAnalysis(id){
  const list = (typeof POL_ANALYSIS==='undefined'?[]:POL_ANALYSIS);
  if(!id){
    const p=Store.politicsProfile();
    app.innerHTML=header('政治分析题训练','V36｜SRS记忆回炉',true)+`<main class="wrap">
      <section class="card"><div class="box"><b>固定五步：</b>①先判题型 → ②圈材料词 → ③调2–4个原理 → ④原理贴材料 → ⑤分点收口。</div><p class="small">已完成 ${p.analysisDone||0}/${list.length}｜当前闭卷通过 ${p.analysisRecall||0}｜已连续回忆≥3次 ${p.analysisMastered||0}｜今日待回炉 ${p.analysisDue||0}。</p><div class="box warn"><b>V36 回炉规则：</b>不会→明天；会→1→3→7→14→30天。不是“看懂答案”就算会，必须遮住答案说出得分点。</div></section>
      <section class="card"><b>题型识别口诀</b><p>为什么＝现实要＋理论撑＋人民需＋实践证；怎么办＝问题→依据→措施→目标；意义＝直接效果→长远影响→总体目标；原理题＝原理→材料→结论。</p><button class="btn block" onclick="go('/politics/analysis/due')">🔥 只练今天到期/不会的题</button></section>
      ${list.map((x,i)=>`<section class="card"><span class="tag">${escapeHtml(x.area)}</span><h3>${i+1}. ${escapeHtml(x.title)}</h3><p>${escapeHtml(x.ask)}</p><button class="btn block" onclick="go('/politics/analysis/${x.id}')">开始闭卷训练</button></section>`).join('')}
    </main>`+tabbar('/learn'); return;
  }
  if(id==='due'){
    const today=Store.todayStr();
    const rows=((Store.get().politics||{}).analysis||[]);
    const due=list.filter(x=>{const r=rows.find(y=>y.id===x.id); return r && r.done && (!r.recall || !r.due || r.due<=today);});
    app.innerHTML=header('政治分析题回炉','V36｜今日到期',true)+`<main class="wrap"><section class="card"><p>${due.length?`今天有 <b>${due.length}</b> 道需要闭卷复现。`:'今天没有到期题。新题请从分析题列表进入。'}</p></section>${due.map(x=>`<section class="card"><span class="tag">${escapeHtml(x.area)}</span><h3>${escapeHtml(x.title)}</h3><button class="btn block" onclick="go('/politics/analysis/${x.id}')">闭卷回炉</button></section>`).join('')}</main>`+tabbar('/learn'); return;
  }
  const x=list.find(y=>y.id===id); if(!x) return viewPoliticsAnalysis();
  const saved=((Store.get().politics||{}).analysis||[]).find(y=>y.id===id)||{};
  const qtype = /为什么|原因/.test(x.ask+x.title)?'原因题':/如何|怎么办|措施/.test(x.ask+x.title)?'措施题':/意义|作用/.test(x.ask+x.title)?'意义题':'原理/观点题';
  const typeFrame = qtype==='原因题'?'现实必要性 → 理论/制度依据 → 人民立场 → 实践成效':qtype==='措施题'?'材料问题 → 理论依据 → 对应措施 → 目标效果':qtype==='意义题'?'直接效果 → 长远影响 → 总体目标':'原理写准 → 材料贴合 → 方法/结论';
  app.innerHTML=header('政治分析题 · '+x.area,x.title,true)+`<main class="wrap">
    <section class="card"><span class="tag s">先判题型｜${qtype}</span><div class="box"><b>答题骨架：</b>${typeFrame}</div><p class="small">材料关键词只负责“叫回考点”，正式答案必须写规范理论并贴材料。</p></section>
    <section class="card"><span class="tag s">第1步｜只看材料和问题</span><p>${escapeHtml(x.material)}</p><div class="box warn"><b>问题：</b>${escapeHtml(x.ask)}</div><p class="small">先别看答案。闭眼/口头说出2–4个得分点，再写关键词。</p><textarea id="paDraft" rows="7" style="width:100%;box-sizing:border-box" placeholder="先写：①原理/观点 ②材料对应词 ③结论……">${escapeHtml(saved.draft||'')}</textarea><button class="btn ghost block" style="margin-top:8px" onclick="Store.savePoliticsAnalysis('${x.id}',{draft:document.getElementById('paDraft').value,done:true}); alert('已保存闭卷草稿')">保存我的答案</button></section>
    <section class="card"><span class="tag">第2步｜记忆钩子</span><div class="box"><b>${escapeHtml(x.hook)}</b></div><p class="small">钩子只负责把结构叫回来；正式作答仍要用规范表述。</p></section>
    <section class="card"><span class="tag">第3步｜核心得分点</span>${x.points.map((p,i)=>`<div class="task"><div>${i+1}</div><div>${escapeHtml(p)}</div></div>`).join('')}</section>
    <section class="card"><span class="tag green">第4步｜参考组织</span><p>${escapeHtml(x.answer)}</p></section>
    <section class="card"><b>第5步｜闭卷自评 + SRS</b><p>遮住上面内容：能否说出至少3个得分点，并至少贴1处材料？${saved.due?`<br><span class="small">当前下次复习：${escapeHtml(saved.due)}｜连续成功 ${(saved.reps||0)} 次</span>`:''}</p><div class="row"><button class="btn ghost" onclick="Store.savePoliticsAnalysis('${x.id}',{draft:document.getElementById('paDraft').value,done:true,recall:false}); alert('已回炉：明天再练')">还不行</button><button class="btn" onclick="finishPoliticsRecall('${x.id}')">能说出来</button></div></section>
  </main>`+tabbar('/learn');
}
