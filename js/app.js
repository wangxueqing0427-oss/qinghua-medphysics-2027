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

function todayTasks() {
  const s = Store.get();
  const mode = s.mode;
  const wd = weekdayFocus(new Date());
  const due = dueChapters();
  const focusSub = ["epi", "stats", "mp", "ph"].includes(wd.focus) ? wd.focus : "epi";
  const dueOne = due.find((c) => c.subject === focusSub) || due[0] || nextChapter(focusSub);
  const tasks = [];

  if (mode === "dinner") {
    tasks.push({ id: "t-en", text: "英语：10个核心词（饭局后最低）", tag: "英语", mins: 10, href: "#/english" });
    tasks.push({ id: "t-353", text: "闭卷：" + dueOne.no + " " + dueOne.title, tag: "353", mins: 10, href: "#/recite/" + dueOne.id });
  } else if (mode === "busy" || mode === "trip") {
    tasks.push({ id: "t-en", text: "英语：10词 + 1句", tag: "英语", mins: 10, href: "#/english" });
    tasks.push({ id: "t-353", text: wd.label + "：" + dueOne.title, tag: "353", mins: 20, href: "#/learn/" + dueOne.subject + "/" + dueOne.id });
    if (mode === "busy") {
      tasks.push({ id: "t-mp", text: "医学物理：抽1章闭卷", tag: "353", mins: 10, href: "#/recite/" + (due.find((c) => c.subject === "mp") || nextChapter("mp")).id });
    }
  } else {
    tasks.push({ id: "t-en", text: "英语：10个核心词 + 1段阅读", tag: "英语", mins: 35, href: "#/english" });
    tasks.push({ id: "t-353", text: "353主线（" + wd.label + "）：" + dueOne.title, tag: "353", mins: 50, href: "#/learn/" + dueOne.subject + "/" + dueOne.id });
    if (wd.focus === "weekly") {
      tasks.push({ id: "t-week", text: "周日：随机20个知识点闭卷检查", tag: "复习", mins: 30, href: "#/review?weekly=1" });
    } else if (wd.focus === "mock") {
      tasks.push({ id: "t-mock", text: "错题重做或一套353小模考", tag: "模拟", mins: 40, href: "#/wrong" });
    } else {
      const third = wd.focus === "mp" ? nextChapter("pol") : (due.find((c) => c.subject === "mp") || nextChapter("mp"));
      tasks.push({ id: "t-3", text: (third.subject === "pol" ? "政治框架：" : "医学物理：") + third.title, tag: third.subject === "pol" ? "政治" : "353", mins: 25, href: "#/learn/" + third.subject + "/" + third.id });
    }
  }
  return tasks.concat(s.today.extra.map((x) => ({ id: x.id, text: x.text, tag: "临时", mins: x.mins, href: "#/" })));
}

function header(title, sub, back) {
  return `<header class="app-header">
    ${back ? `<button class="back" onclick="history.back()">← 返回</button>` : ""}
    <h1>${escapeHtml(title)}</h1>
    <div class="sub">${escapeHtml(sub || "")}</div>
  </header>`;
}

function tabbar(active) {
  const items = [
    ["/", "日", "今日"],
    ["/learn", "学", "学习"],
    ["/practice", "练", "练习"],
    ["/wrong", "错", "错题"],
    ["/mock", "考", "模拟"],
  ];
  return `<nav class="tabbar">${items.map((x) =>
    `<button class="${active === x[0] ? "on" : ""}" onclick="go('${x[0]}')"><i>${x[1]}</i>${x[2]}</button>`
  ).join("")}</nav>`;
}

function viewHome() {
  const s = Store.get();
  const tasks = todayTasks();
  const doneN = tasks.filter((t) => s.today.done[t.id]).length;
  const pct = tasks.length ? Math.round(doneN / tasks.length * 100) : 0;
  const top = Store.topWrong(4);
  const dueN = Store.dueIds().length;
  const maps = [
    ["epi", "流行病学"], ["stats", "卫生统计"], ["ph", "公共卫生"],
    ["mp", "医学物理"], ["en", "英语一"], ["pol", "政治"],
  ];
  app.innerHTML = header("清华医学物理 2027", "一部手机走完学习、闭卷、错题、复盘") + `
  <main class="wrap">
    <section class="card hero">
      <div>
        <div class="muted">距离预计初试 ${s.examDate}（倒计时参考）</div>
        <div class="days">${Store.daysLeft()}<span>天</span></div>
      </div>
      <button class="btn ghost" onclick="Store.resetToday(); render()">今日重置</button>
    </section>
    <section class="card">
      <div class="row"><b>今日必做</b><span class="muted">${pct}%</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="small" style="margin-top:8px">状态：${{ normal: "正常 1–2小时", busy: "忙碌 40分钟", trip: "出差 30分钟", dinner: "饭局后 20分钟" }[s.mode]} · 今日到期复习 ${dueN} 项</div>
      ${tasks.map((t) => `<div class="task ${s.today.done[t.id] ? "done" : ""}">
        <input type="checkbox" ${s.today.done[t.id] ? "checked" : ""} onchange="Store.toggleTask('${t.id}'); render()">
        <div><b>${escapeHtml(t.text)}</b><span class="tag">${t.tag}</span><span class="tag">${t.mins}分钟</span>
        <div><button class="btn tiny ghost" onclick="go('${t.href.replace(/^#/, "")}')">去做</button></div></div>
      </div>`).join("")}
    </section>
    <section class="card">
      <b>选择今天的状态</b>
      <p class="muted">只改今天任务量，不会把没做的勾成已完成。</p>
      <div class="grid2">
        <button class="btn ${s.mode === "normal" ? "" : "ghost"}" onclick="Store.setMode('normal');render()">正常</button>
        <button class="btn ${s.mode === "busy" ? "" : "ghost"}" onclick="Store.setMode('busy');render()">忙碌</button>
        <button class="btn ${s.mode === "trip" ? "" : "ghost"}" onclick="Store.setMode('trip');render()">出差</button>
        <button class="btn ${s.mode === "dinner" ? "" : "ghost"}" onclick="Store.setMode('dinner');render()">饭局后</button>
      </div>
    </section>
    <section class="card">
      <b>战情地图</b>
      <p class="muted">按闭卷评级计算：绿100%，黄60%，红25%，未学0%。</p>
      ${maps.map(([id, name]) => {
        const p = Store.mastery(id);
        return `<div class="map-item"><div class="row"><b>${name}</b><span>${p}%</span></div><div class="bar"><i style="width:${p}%"></i></div></div>`;
      }).join("")}
    </section>
    <section class="card">
      <b>本周反复错</b>
      ${top.length ? top.map((w) => {
        const q = QUESTIONS.find((x) => x.id === w.id);
        const ch = q && chapter(q.chapterId);
        return `<div class="task"><div>🔴</div><div><b>${escapeHtml(q ? q.stem : w.id)}</b><span class="small">${ch ? ch.title : ""} · 错${w.count}次</span></div></div>`;
      }).join("") : `<p class="muted">还没有错题。做完练习后，系统会把薄弱点排到这里。</p>`}
      <button class="btn ghost block" onclick="go('/review')">去间隔复习</button>
    </section>
    <section class="card">
      <b>临时任务</b>
      <input id="newTask" type="text" placeholder="例如：把OR四格表再算两遍">
      <button class="btn" style="margin-top:8px" onclick="addExtra()">加入今日</button>
    </section>
  </main>` + tabbar("/");
}

function addExtra() {
  const v = $("#newTask").value.trim();
  if (!v) return;
  Store.addExtra(v);
  render();
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
      <div class="box"><b>为什么重要</b><br>${escapeHtml(c.why)}</div>
      <ol class="points">${c.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
      ${c.formula ? `<div class="box"><b>公式/口诀</b><br>${escapeHtml(c.formula)}</div>` : ""}
      <div class="box"><b>对比</b><br>${escapeHtml(c.compare)}</div>
      <div class="box warn"><b>易错</b><br>${escapeHtml(c.trap)}</div>
      <div class="box"><b>清华可能怎么问</b><br>${escapeHtml(c.exam)}</div>
    </div>
    <div class="card">
      <b>学完先评级，再闭卷</b>
      <p class="muted">当前：${{ new: "未学", red: "不会", yellow: "模糊", green: "会" }[k.status]}</p>
      <div class="rate">
        <button class="btn crimson" onclick="rateKp('${c.id}','red')">不会</button>
        <button class="btn gold" onclick="rateKp('${c.id}','yellow')">模糊</button>
        <button class="btn forest" onclick="rateKp('${c.id}','green')">会了</button>
      </div>
      <button class="btn block" style="margin-top:10px" onclick="go('/recite/${c.id}')">开始本章闭卷</button>
      <button class="btn ghost block" style="margin-top:8px" onclick="go('/practice/run?chapter=${c.id}')">做本章练习题</button>
    </div>
  </main>` + tabbar("/learn");
}

function rateKp(id, g) {
  Store.rateKnowledge(id, g);
  Store.markTask("t-353");
  Store.markTask("t-3");
  render();
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
  app.innerHTML = header("练习 " + (st.i + 1) + "/" + st.list.length, (TYPE_LABEL[q.type] || q.type) + " · " + (ch ? ch.title : ""), true) + `<main class="wrap">
    <div class="card">
      <div class="quiz-q">${escapeHtml(q.stem)}</div>
      ${textTypes
        ? `<textarea id="textAns" rows="4" placeholder="先自己写，再对答案"></textarea>
           <button class="btn block" style="margin-top:8px" onclick="judgeText()">对照答案</button>
           <div id="fb"></div>`
        : q.options.map((op, i) => `<button class="opt" id="op${i}" onclick="pickOpt(${i})">${String.fromCharCode(65 + i)}. ${escapeHtml(op)}</button>`).join("")}
    </div>
  </main>` + tabbar("/practice");
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
  q.options.forEach((_, idx) => {
    const el = $("#op" + idx);
    if (idx === q.answer) el.classList.add("right");
    if (idx === i && !ok) el.classList.add("wrong");
  });
  const box = document.createElement("div");
  box.className = "box " + (ok ? "ok" : "warn");
  box.innerHTML = `<b>${ok ? "对" : "错"}</b><br>${escapeHtml(q.explain || "")}
    ${ok ? "" : `<p class="small">这道错题已入错题本。可选填原因：</p><input id="reason" type="text" placeholder="例如：把OR和RR记反了">`}
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
  if (r && r.value.trim()) Store.setWrongReason(q.id, r.value.trim());
  if (st.i < st.list.length - 1) {
    st.i += 1;
    st.judged = false;
    drawQuiz();
  } else {
    const pct = st.n ? Math.round(st.score / st.n * 100) : 0;
    Store.markTask("t-353");
    app.innerHTML = header("本轮结束", "对" + st.score + " / " + st.n) + `<main class="wrap"><div class="card">
      <div class="days">${pct}<span>分</span></div>
      <p class="muted">错题已进入错题本，系统会把反复错的章节顶到首页。</p>
      <button class="btn block" onclick="go('/wrong')">看错题</button>
      <button class="btn ghost block" style="margin-top:8px" onclick="go('/practice')">再练一轮</button>
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
        <button class="btn block" onclick="go('/mock/run/353')">353 卫生综合 · 30题 / 45分钟</button>
        <button class="btn ghost block" style="margin-top:8px" onclick="go('/mock/run/en')">英语一小模 · 10题 / 20分钟</button>
        <button class="btn ghost block" style="margin-top:8px" onclick="go('/mock/run/pol')">政治小模 · 10题 / 15分钟</button>
        <button class="btn crimson block" style="margin-top:8px" onclick="go('/mock/run/full')">全套串联（先353）</button>
      </div>
      <div class="card"><b>最近模拟</b>
        ${hist.length ? hist.map((m) => `<div class="task"><div>📋</div><div><b>${escapeHtml(m.kind)} · ${m.score}/${m.total}（${m.pct}分）</b><div class="small">${new Date(m.at).toLocaleString("zh-CN")} · 弱项：${escapeHtml(m.weak || "无")}</div></div></div>`).join("") : "<p class='muted'>还没有模拟记录。</p>"}
      </div>
    </main>` + tabbar("/mock");
    return;
  }
  const conf = {
    "353": { subjects: ["epi", "stats", "ph", "mp"], n: 30, mins: 45, name: "353卫生综合" },
    en: { subjects: ["en"], n: 10, mins: 20, name: "英语一" },
    pol: { subjects: ["pol"], n: 10, mins: 15, name: "政治" },
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

function viewEnglish() {
  const words = shuffle(ENGLISH_WORDS).slice(0, 10);
  const pass = ENGLISH_PASSAGES[Math.floor(Math.random() * ENGLISH_PASSAGES.length)];
  window._en = { words, i: 0, pass, shown: false };
  drawEnglish();
}

function drawEnglish() {
  const st = window._en;
  const w = st.words[st.i];
  app.innerHTML = header("英语一", "10词 + 1段阅读，不断档") + `<main class="wrap">
    <div class="card">
      <div class="small">单词 ${st.i + 1}/10</div>
      <div class="quiz-q">${escapeHtml(w[0])}</div>
      ${st.shown ? `<div class="box">${escapeHtml(w[1])}<br><span class="small">${escapeHtml(w[2])}</span></div>` : `<button class="btn ghost block" onclick="window._en.shown=true;drawEnglish()">先自己想，再看释义</button>`}
      <div class="rate">
        <button class="btn crimson" onclick="enWord(false)">不熟</button>
        <button class="btn forest" onclick="enWord(true)">记住了</button>
      </div>
    </div>
    <div class="card">
      <b>${escapeHtml(st.pass.title)}</b>
      <p>${escapeHtml(st.pass.text)}</p>
      ${st.pass.qs.map((q, qi) => `<div class="small">${escapeHtml(q.q)}</div>${q.opts.map((op, oi) =>
        `<button class="opt" onclick="this.className='opt '+(oi===q.a?'right':'wrong')">${escapeHtml(op)}</button>`).join("")}`).join("")}
    </div>
    <p class="muted">句子复现比狂背词表重要。做完勾掉今日英语任务。</p>
    <button class="btn block" onclick="Store.markTask('t-en');go('/')">今日英语完成</button>
  </main>` + tabbar("/learn");
}

function enWord(ok) {
  const w = window._en.words[window._en.i];
  Store.markWord(w[0], ok);
  if (window._en.i < window._en.words.length - 1) {
    window._en.i += 1;
    window._en.shown = false;
    drawEnglish();
  } else {
    Store.markTask("t-en");
    go("/english");
  }
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
  if (parts[0] === "learn") return viewLearn(parts[1], parts[2]);
  if (parts[0] === "recite") return viewRecite(parts[1]);
  if (parts[0] === "practice") return viewPractice(parts[1] === "run", query);
  if (parts[0] === "wrong") return viewWrong();
  if (parts[0] === "review") return viewReview(query);
  if (parts[0] === "mock") return viewMock(parts[1] === "run", parts[2]);
  if (parts[0] === "english") return viewEnglish();
  if (parts[0] === "politics") return viewLearn("pol");
  viewHome();
}

window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  render();
});
