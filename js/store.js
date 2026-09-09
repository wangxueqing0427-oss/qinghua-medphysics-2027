const Store = (() => {
  const KEY = "qh2027_os_v1";

  function todayStr(d) {
    const x = d || new Date();
    const z = new Date(x.getTime() - x.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  }

  function addDays(dateStr, n) {
    const d = new Date(dateStr + "T12:00:00");
    d.setDate(d.getDate() + n);
    return todayStr(d);
  }

  function defaultState() {
    return {
      created: Date.now(),
      mode: "normal",
      examDate: "2027-12-18",
      knowledge: {},
      wrong: {},
      mocks: [],
      today: { date: todayStr(), done: {}, extra: [], started: {}, completedAt: {}, quality: {} },
      dailyHistory: [],
      english: { words: {}, lastDate: "", attempts: [], reasons: {}, drafts: {}, paperChecks: [] },
      politics: { attempts: [], reasons: {}, analysis: [], currentAffairs: [], fullMocks: [] },
      lastWeekly: "",
      target: { total: 350, score353: 225, english: 65, politics: 60 },
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const s = Object.assign(defaultState(), JSON.parse(raw));
      // V53.1 hotfix: retire every legacy pre-2027 countdown placeholder.
      // 2027-12-18 is a planning anchor only, NOT the official 2027 exam date.
      let hotfixChanged = false;
      const examYear = Number(String(s.examDate || "").slice(0, 4));
      if (!s.examDate || !Number.isFinite(examYear) || examYear < 2027) {
        s.examDate = "2027-12-18";
        hotfixChanged = true;
      }
      if (!Array.isArray(s.dailyHistory)) s.dailyHistory = [];
      if (!s.today.started) s.today.started = {};
      if (!s.today.completedAt) s.today.completedAt = {};
      if (!s.today.quality) s.today.quality = {};
      if (s.today.date !== todayStr()) {
        const oldDone = s.today.done || {};
        s.dailyHistory = s.dailyHistory.filter(x => x.date !== s.today.date);
        s.dailyHistory.unshift({ date:s.today.date, mode:s.mode || "normal", done:oldDone, quality:s.today.quality||{}, savedAt:Date.now() });
        s.dailyHistory = s.dailyHistory.slice(0, 95);
        s.today = { date: todayStr(), done: {}, extra: s.today.extra || [], started: {}, completedAt: {}, quality: {} };
      }
      if (hotfixChanged) localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    } catch (e) {
      return defaultState();
    }
  }

  function save(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  // V50: portable local backup. The payload is intentionally plain JSON so the
  // learner can keep it in iCloud/Files and restore it on another browser/device.
  function backupPayload() {
    const state = load();
    return {
      app: "qinghua-medphysics-2027",
      schema: 1,
      exportedAt: new Date().toISOString(),
      storageKey: KEY,
      state
    };
  }

  function validateBackup(payload) {
    if (!payload || typeof payload !== "object") return { ok:false, error:"备份文件不是有效对象" };
    const state = payload.state || payload; // also accept a raw legacy state object
    if (!state || typeof state !== "object" || Array.isArray(state)) return { ok:false, error:"找不到学习进度数据" };
    const anchors = ["knowledge","wrong","today","english","politics","target"];
    const hits = anchors.filter(k => Object.prototype.hasOwnProperty.call(state,k)).length;
    if (hits < 3) return { ok:false, error:"这不像本备考系统生成的进度备份" };
    if (state.dailyHistory != null && !Array.isArray(state.dailyHistory)) return { ok:false, error:"历史记录格式异常" };
    return { ok:true, state };
  }

  function restoreBackup(payload) {
    const checked = validateBackup(payload);
    if (!checked.ok) return checked;
    // Merge through the current defaults so older backups gain new fields safely.
    const restored = Object.assign(defaultState(), checked.state);
    if (!restored.today || typeof restored.today !== "object") restored.today = defaultState().today;
    if (!Array.isArray(restored.dailyHistory)) restored.dailyHistory = [];
    restored.dailyHistory = restored.dailyHistory.slice(0,95);
    restored.today.started = restored.today.started || {};
    restored.today.completedAt = restored.today.completedAt || {};
    restored.today.quality = restored.today.quality || {};
    save(restored);
    return { ok:true, state:restored };
  }

  function get() { return load(); }

  function update(fn) {
    const s = load();
    fn(s);
    save(s);
    return s;
  }

  function setMode(mode) {
    return update((s) => { s.mode = mode; });
  }

  function toggleTask(id) {
    return update((s) => {
      const next = !s.today.done[id];
      s.today.done[id] = next;
      if (next) s.today.completedAt[id] = Date.now();
      else delete s.today.completedAt[id];
    });
  }

  function markTask(id) {
    return update((s) => {
      s.today.done[id] = true;
      s.today.completedAt[id] = s.today.completedAt[id] || Date.now();
    });
  }

  function markTaskQuality(id, grade, meta) {
    return update((s) => {
      const g = ["pass","review","redo"].includes(grade) ? grade : "review";
      s.today.done[id] = true;
      s.today.completedAt[id] = s.today.completedAt[id] || Date.now();
      if (!s.today.quality) s.today.quality = {};
      s.today.quality[id] = { grade:g, at:Date.now(), meta:meta||{} };
    });
  }

  function latestCoreQuality(core) {
    const id = core === "353" ? "t-353" : core === "en" ? "t-en" : "t-pol";
    const s = load();
    const rows = [{date:s.today.date, quality:s.today.quality||{}}].concat(s.dailyHistory||[]);
    for (const r of rows) {
      const q = (r.quality||{})[id];
      if (q && q.grade) return {grade:q.grade,date:r.date,meta:q.meta||{}};
    }
    return null;
  }

  function startTask(id) {
    return update((s) => {
      s.today.started[id] = s.today.started[id] || Date.now();
    });
  }

  function addExtra(text) {
    return update((s) => {
      s.today.extra.push({ id: "x" + Date.now(), text: text, mins: 15 });
    });
  }

  function kp(s, id) {
    if (!s.knowledge[id]) {
      s.knowledge[id] = {
        status: "new",
        reps: 0,
        due: todayStr(),
        last: 0,
        interval: 0,
      };
    }
    return s.knowledge[id];
  }

  function rateKnowledge(id, grade) {
    return update((s) => {
      const k = kp(s, id);
      k.last = Date.now();
      k.reps += 1;
      if (grade === "red") {
        k.status = "red";
        k.interval = 1;
        k.due = addDays(todayStr(), 1);
      } else if (grade === "yellow") {
        k.status = "yellow";
        k.interval = Math.max(2, Math.round((k.interval || 2) * 1.4));
        k.due = addDays(todayStr(), k.interval);
      } else {
        k.status = "green";
        const ladder = [1, 3, 7, 14, 30, 60];
        const i = Math.min(k.reps - 1, ladder.length - 1);
        k.interval = ladder[Math.max(0, i)];
        k.due = addDays(todayStr(), k.interval);
      }
    });
  }

  function dueIds() {
    const s = load();
    const today = todayStr();
    return Object.keys(s.knowledge).filter((id) => s.knowledge[id].due <= today);
  }

  function mastery(subject) {
    const chapters = CHAPTERS.filter((c) => c.subject === subject);
    if (!chapters.length) return 0;
    const s = load();
    let score = 0;
    chapters.forEach((c) => {
      const k = s.knowledge[c.id];
      if (!k || k.status === "new") score += 0;
      else if (k.status === "red") score += 0.25;
      else if (k.status === "yellow") score += 0.6;
      else score += 1;
    });
    return Math.round((score / chapters.length) * 100);
  }

  function recordWrong(q, reason) {
    return update((s) => {
      const prev = s.wrong[q.id] || {
        id: q.id,
        count: 0,
        first: Date.now(),
        last: 0,
        reason: "",
        mastered: false,
        streak: 0,
      };
      prev.count += 1;
      prev.last = Date.now();
      prev.reason = reason || prev.reason;
      prev.mastered = false;
      prev.streak = 0;
      prev.subject = q.subject;
      prev.chapterId = q.chapterId;
      s.wrong[q.id] = prev;
    });
  }

  function recordRight(q) {
    return update((s) => {
      const prev = s.wrong[q.id];
      if (!prev) return;
      prev.streak = (prev.streak || 0) + 1;
      prev.last = Date.now();
      if (prev.streak >= 2) prev.mastered = true;
    });
  }

  function setWrongReason(id, reason) {
    return update((s) => {
      if (s.wrong[id]) s.wrong[id].reason = reason;
    });
  }

  function topWrong(n) {
    const s = load();
    return Object.values(s.wrong)
      .filter((x) => !x.mastered)
      .sort((a, b) => b.count - a.count || b.last - a.last)
      .slice(0, n || 5);
  }

  function saveMock(rec) {
    return update((s) => {
      s.mocks.unshift(rec);
      s.mocks = s.mocks.slice(0, 20);
    });
  }

  function markWord(id, ok) {
    return update((s) => {
      const prev = s.english.words[id] || {};
      s.english.words[id] = {
        ok: !!ok,
        last: Date.now(),
        count: (prev.count || 0) + 1,
        weakCount: (prev.weakCount || 0) + (ok ? 0 : 1),
        rightStreak: ok ? (prev.rightStreak || 0) + 1 : 0,
        nextDue: Date.now() + (ok ? ([1,3,7,14,30][Math.min((prev.rightStreak||0),4)] * 86400000) : 86400000),
      };
      s.english.lastDate = todayStr();
    });
  }

  function recordEnglishAttempt(kind, ok, reason) {
    return update((s) => {
      if (!s.english.attempts) s.english.attempts = [];
      if (!s.english.reasons) s.english.reasons = {};
      s.english.attempts.unshift({ kind: kind || "practice", ok: !!ok, reason: reason || "", at: Date.now() });
      s.english.attempts = s.english.attempts.slice(0, 300);
      if (!ok && reason) s.english.reasons[reason] = (s.english.reasons[reason] || 0) + 1;
    });
  }

  function saveEnglishDraft(id, text) {
    return update((s) => {
      if (!s.english.drafts) s.english.drafts = {};
      s.english.drafts[id] = { text: text || "", at: Date.now() };
    });
  }

  function recordEnglishPaperCheck(rec) {
    return update((s) => {
      if (!s.english.paperChecks) s.english.paperChecks = [];
      s.english.paperChecks.unshift(Object.assign({at:Date.now()}, rec));
      s.english.paperChecks = s.english.paperChecks.slice(0, 30);
    });
  }

  function recordPoliticsAttempt(kind, ok, reason) {
    return update((s) => {
      if (!s.politics) s.politics = { attempts: [], reasons: {}, analysis: [], currentAffairs: [], fullMocks: [] };
      s.politics.attempts.unshift({ kind: kind || "choice", ok: !!ok, reason: reason || "", at: Date.now() });
      s.politics.attempts = s.politics.attempts.slice(0, 300);
      if (!ok && reason) s.politics.reasons[reason] = (s.politics.reasons[reason] || 0) + 1;
    });
  }

  function politicsAnalysisInterval(reps) { return [1,3,7,14,30][Math.min(Math.max(0,reps-1),4)]; }

  function savePoliticsAnalysis(id, payload) {
    return update((s) => {
      if (!s.politics) s.politics = { attempts: [], reasons: {}, analysis: [], currentAffairs: [], fullMocks: [] };
      if (!Array.isArray(s.politics.analysis)) s.politics.analysis = [];
      const old = s.politics.analysis.find(x => x.id === id);
      const now = Date.now();
      const row = Object.assign({ id, at: now }, payload || {});
      if (payload && Object.prototype.hasOwnProperty.call(payload, "recall")) {
        const prevReps = old && old.reps ? old.reps : 0;
        row.reps = payload.recall ? prevReps + 1 : 0;
        const days = payload.recall ? politicsAnalysisInterval(row.reps) : 1;
        row.interval = days;
        row.due = addDays(todayStr(), days);
        row.lastRecallAt = now;
      }
      if (old) Object.assign(old, row); else s.politics.analysis.unshift(row);
      s.politics.analysis = s.politics.analysis.slice(0, 100);
    });
  }

  function savePoliticsCurrentAffairs(id, status) {
    return update((s) => {
      if (!s.politics) s.politics = { attempts: [], reasons: {}, analysis: [], currentAffairs: [], fullMocks: [] };
      if (!Array.isArray(s.politics.currentAffairs)) s.politics.currentAffairs = [];
      const old=s.politics.currentAffairs.find(x=>x.id===id);
      const row={id,status:status||"seen",at:Date.now()};
      if(old) Object.assign(old,row); else s.politics.currentAffairs.unshift(row);
    });
  }

  function savePoliticsFullMock(rec) {
    return update((s) => {
      if (!s.politics) s.politics = { attempts: [], reasons: {}, analysis: [], currentAffairs: [], fullMocks: [] };
      if (!Array.isArray(s.politics.fullMocks)) s.politics.fullMocks = [];
      s.politics.fullMocks.unshift(Object.assign({at:Date.now()},rec||{}));
      s.politics.fullMocks=s.politics.fullMocks.slice(0,20);
    });
  }

  function politicsProfile() {
    const s = load();
    const p = s.politics || { attempts: [], reasons: {}, analysis: [], currentAffairs: [], fullMocks: [] };
    const chapters = CHAPTERS.filter(c => c.subject === "pol");
    const learned = chapters.filter(c => s.knowledge[c.id] && s.knowledge[c.id].status !== "new").length;
    const green = chapters.filter(c => s.knowledge[c.id] && s.knowledge[c.id].status === "green").length;
    const recent = (p.attempts || []).slice(0,100);
    const acc = recent.length ? Math.round(recent.filter(x=>x.ok).length/recent.length*100) : 0;
    const multi = (p.attempts || []).filter(x=>x.kind === "multi").slice(0,80);
    const multiAccuracy = multi.length ? Math.round(multi.filter(x=>x.ok).length/multi.length*100) : null;
    const polMocks = (s.mocks||[]).filter(m => String(m.kind||"").includes("政治")).slice(0,5);
    const mockAvg = polMocks.length ? Math.round(polMocks.reduce((a,m)=>a+(m.pct||0),0)/polMocks.length) : null;
    const openWrong = Object.values(s.wrong||{}).filter(w=>w.subject==="pol" && !w.mastered).length;
    const analysis = (p.analysis || []);
    const analysisDone = analysis.filter(x=>x.done).length;
    const analysisRecall = analysis.filter(x=>x.done && x.recall).length;
    const today = todayStr();
    const analysisDue = analysis.filter(x=>x.done && (!x.due || x.due <= today || !x.recall)).length;
    const analysisMastered = analysis.filter(x=>(x.reps||0) >= 3).length;
    const fullMocks=(p.fullMocks||[]).slice(0,5);
    const fullMockAvg=fullMocks.length?Math.round(fullMocks.reduce((a,m)=>a+(m.totalScore||0),0)/fullMocks.length):null;
    const currentAffairsSeen=(p.currentAffairs||[]).length;
    const choiceReady=recent.length>=80 && acc>=80 && multi.length>=30 && (multiAccuracy||0)>=70;
    const analysisReady=analysisMastered>=10;
    const theoryReady=green>=24;
    const gatePassed=[theoryReady,choiceReady,analysisReady,fullMockAvg!=null&&fullMockAvg>=60].filter(Boolean).length;
    const readiness = Math.round((learned/Math.max(1,chapters.length))*35 + (green/Math.max(1,chapters.length))*25 + (recent.length?acc:0)*0.25 + (mockAvg==null?0:mockAvg)*0.15);
    let stage = "1｜知识地图"; let next = "从未学章节开始，先学懂再闭卷。";
    if (learned >= 20) { stage = "2｜选择题稳定"; next = "章节选择题 + 错因回炉，优先处理多次错题。"; }
    if (green >= 24 && recent.length >= 40 && acc >= 75) { stage = "3｜分析题输出"; next = "练原理→材料→结论，同时等待年度时政校准。"; }
    if (green >= 26 && recent.length >= 80 && acc >= 80) { stage = "4｜真题/时政校准前"; next = "基础已成型；后续用2027官方大纲、年度时政和真实历年题校准。"; }
    return { total:chapters.length, learned, green, attempts:recent.length, accuracy:acc, multiAttempts:multi.length, multiAccuracy, mockAvg, openWrong, readiness, stage, next, reasons:p.reasons||{}, analysisDone, analysisRecall, analysisDue, analysisMastered, fullMockAvg, fullMocks:fullMocks.length, currentAffairsSeen, theoryReady, choiceReady, analysisReady, gatePassed };
  }

  function englishProfile() {
    const s = load();
    const words = s.english.words || {};
    const entries = Object.entries(words);
    const weak = entries.filter(([_,x]) => x && !x.ok).sort((a,b)=>(b[1].weakCount||0)-(a[1].weakCount||0));
    const attempts = s.english.attempts || [];
    const recent = attempts.slice(0, 100);
    const acc = recent.length ? Math.round(recent.filter(x=>x.ok).length/recent.length*100) : null;
    const reasons = Object.entries(s.english.reasons || {}).sort((a,b)=>b[1]-a[1]);
    const reading = attempts.filter(x=>x.kind === "long-reading").slice(0,64);
    const readingAccuracy = reading.length ? Math.round(reading.filter(x=>x.ok).length/reading.length*100) : null;
    const readingReady = reading.length >= 32 && readingAccuracy >= 75;
    const kinds = ["practice","long-reading","cloze","newtype","translation","writing","sentence"];
    const byKind = {};
    kinds.forEach(k => {
      const xs = attempts.filter(x=>x.kind===k).slice(0,80);
      byKind[k] = { n:xs.length, accuracy:xs.length ? Math.round(xs.filter(x=>x.ok).length/xs.length*100) : null };
    });
    const enMastery = mastery("en");
    // V32 audit fix: distinguish "seen once" from "actually recalled repeatedly".
    const coreTarget = 1000;
    const seenCore = Math.min(coreTarget, entries.length);
    const mastered = entries.filter(([_,x]) => x && x.ok && (x.rightStreak||0) >= 2);
    const masteredCore = Math.min(coreTarget, mastered.length);
    const wordCoverage = Math.min(100, Math.round(seenCore / coreTarget * 100));
    const wordMastery = Math.min(100, Math.round(masteredCore / coreTarget * 100));
    const dueWeak = weak.filter(([_,x]) => !x.nextDue || x.nextDue <= Date.now()).length;
    const englishWordCount = (txt) => ((String(txt||'').match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)||[]).length);
    const draftEntries = Object.entries(s.english.drafts || {});
    const validDraftIds = draftEntries.filter(([id,d]) => {
      const wc = englishWordCount(d && d.text);
      const n = parseInt(String(id).replace(/\D/g,''),10) || 0;
      return n >= 6 ? wc >= 140 : wc >= 80;
    }).map(([id])=>id);
    const drafts = validDraftIds.length;
    const paperChecks = s.english.paperChecks || [];
    const weakRate = entries.length ? Math.round(weak.length / entries.length * 100) : 100;
    const wordReady = seenCore >= 950 && masteredCore >= 850 && weakRate <= 20;
    const sentenceReady = byKind.sentence.n >= 20 && byKind.sentence.accuracy >= 75;
    const moduleNs = [byKind.cloze.n,byKind.newtype.n,byKind.translation.n];
    const moduleAccs = [byKind.cloze.accuracy,byKind.newtype.accuracy,byKind.translation.accuracy].filter(x=>x!=null);
    const moduleReady = moduleNs.every(n=>n>=12) && moduleAccs.length===3 && moduleAccs.every(x=>x>=70);
    let stage = 1, next = "先把第一层核心词做到“见过≠掌握”：优先复习到期弱词，并把至少850个词做到两次间隔回忆正确。";
    if (wordReady) { stage=2; next="主攻长难句：闭卷找主干、判断修饰关系，累计至少20次且正确率≥75%。"; }
    if (wordReady && sentenceReady) { stage=3; next="主攻中长阅读：累计至少32题且近期正确率≥75%，重点复盘定位与干扰项。"; }
    if (wordReady && sentenceReady && readingReady) { stage=4; next="补齐完形、新题型、翻译：每项至少12次训练且正确率≥70%，同步开始作文输出。"; }
    if (wordReady && sentenceReady && readingReady && moduleReady && drafts >= 6) { stage=5; next="训练基础闸门已通过。进入真题阶段：只导入合法可用或你提供的真实历年题，按年份限时、复盘、二刷。"; }
    const readinessParts = [Math.min(wordMastery,100), Math.round(enMastery*100)];
    if (byKind.long-reading.accuracy!=null) readinessParts.push(byKind.long-reading.accuracy);
    if (moduleAccs.length) readinessParts.push(Math.round(moduleAccs.reduce((a,b)=>a+b,0)/moduleAccs.length));
    const readiness = Math.round(readinessParts.reduce((a,b)=>a+b,0)/readinessParts.length);
    return { seen:entries.length, seenCore, mastered:mastered.length, masteredCore, weak:weak.length, weakIds:weak.map(x=>x[0]), weakRate, dueWeak, attempts:recent.length, accuracy:acc, reasons, readingAttempts:reading.length, readingAccuracy, readingReady, byKind, enMastery, wordCoverage, wordMastery, wordReady, sentenceReady, moduleReady, stage, next, readiness, drafts, validDraftIds, paperChecks };
  }

  function daysLeft() {
    const s = load();
    const d = new Date(s.examDate + "T09:00:00");
    return Math.max(0, Math.ceil((d - new Date()) / 86400000));
  }


  function scoreProfile() {
    const s = load();
    const subs = ["epi", "stats", "ph", "mp"];
    const masteryBy = {};
    subs.forEach(id => masteryBy[id] = mastery(id));
    const mastery353 = Math.round(subs.reduce((a,id)=>a+masteryBy[id],0)/subs.length);
    const recent353 = s.mocks.filter(m => String(m.kind).includes("353")).slice(0,5);
    const mockAvg = recent353.length ? Math.round(recent353.reduce((a,m)=>a+(m.pct||0),0)/recent353.length) : null;
    const readiness = mockAvg == null ? mastery353 : Math.round(mastery353*0.45 + mockAvg*0.55);
    const openWrong = Object.values(s.wrong).filter(x => !x.mastered && subs.includes(x.subject));
    const wrongBy = {}; subs.forEach(id=>wrongBy[id]=0); openWrong.forEach(x=>wrongBy[x.subject]=(wrongBy[x.subject]||0)+1);
    const weak = subs.slice().sort((a,b)=>(masteryBy[a]-masteryBy[b]) || (wrongBy[b]-wrongBy[a]));
    return { target:s.target||{total:350,score353:225,english:65,politics:60}, masteryBy, mastery353, mockAvg, readiness, openWrong:openWrong.length, wrongBy, weak };
  }

  function totalProfile() {
    const s = load();
    const p353 = scoreProfile();
    const en = englishProfile();
    const pol = politicsProfile();
    const subjects = [
      { id:"353", name:"353卫生综合", target:(s.target||{}).score353||225, readiness:p353.readiness, due:dueIds().filter(id=>{ const c=CHAPTERS.find(x=>x.id===id); return c && ["epi","stats","ph","mp"].includes(c.subject); }).length, href:"#/score353" },
      { id:"en", name:"英语一", target:(s.target||{}).english||65, readiness:en.readiness||0, due:en.dueWeak||0, href:"#/english/plan" },
      { id:"pol", name:"政治", target:(s.target||{}).politics||60, readiness:pol.readiness||0, due:pol.analysisDue||0, href:"#/politics" }
    ];
    subjects.forEach(x=>{ const q=latestCoreQuality(x.id); const qb=q?(q.grade==="redo"?20:q.grade==="review"?10:0):0; x.lastQuality=q; x.priority=Math.max(0,100-x.readiness)+Math.min(20,x.due*2)+qb; });
    subjects.sort((a,b)=>b.priority-a.priority);
    return { target:s.target||{total:350,score353:225,english:65,politics:60}, subjects, weakest:subjects[0], days:daysLeft() };
  }

  function weeklyProfile() {
    const s = load();
    const rows = [{date:s.today.date, mode:s.mode, done:s.today.done||{}}].concat(s.dailyHistory||[]);
    const days = [];
    for (let i=0;i<7;i++) days.push(addDays(todayStr(), -i));
    const map = {}; rows.forEach(r=>{ if(!map[r.date]) map[r.date]=r; });
    const detail = days.map(date=>{
      const r=map[date]||{date,mode:null,done:{}};
      const d=r.done||{};
      const cores={"353":!!d["t-353"], en:!!d["t-en"], pol:!!d["t-pol"]};
      return {date,mode:r.mode,cores,doneCount:Object.values(cores).filter(Boolean).length};
    });
    const streakBy={"353":0,en:0,pol:0}, daysBy={"353":0,en:0,pol:0};
    ["353","en","pol"].forEach(id=>{
      detail.forEach(x=>{if(x.cores[id]) daysBy[id]++;});
      for (const x of detail){ if(x.cores[id]) streakBy[id]++; else break; }
    });
    const totalDone=detail.reduce((a,x)=>a+x.doneCount,0), totalPossible=21;
    const continuity=Math.round(totalDone/totalPossible*100);
    const gaps=Object.entries(daysBy).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
    const due353=dueIds().filter(id=>{const c=CHAPTERS.find(x=>x.id===id);return c&&["epi","stats","ph","mp"].includes(c.subject)}).length;
    const en=englishProfile(), pol=politicsProfile();
    return {detail,daysBy,streakBy,continuity,gaps,due:{"353":due353,en:en.dueWeak||0,pol:pol.analysisDue||0}};
  }

  function adaptiveProfile() {
    const s=load();
    const rows=(s.dailyHistory||[]).slice(0,7);
    const usable=rows.filter(r=>r && r.done);
    const rates=usable.map(r=>{
      const d=r.done||{}, q=r.quality||{};
      const ids=["t-353","t-en","t-pol"];
      const score=ids.reduce((sum,id)=>{
        if(!d[id]) return sum;
        const g=(q[id]||{}).grade;
        return sum + (g==="redo"?0.4:g==="review"?0.75:1);
      },0);
      return score/3;
    });
    const recent3=rates.slice(0,3);
    const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
    const r3=avg(recent3), r7=avg(rates);
    let factor=1, level="标准量", reason="近期记录不足，先按标准任务量执行。";
    if (recent3.length>=2 && r3<0.5) { factor=0.75; level="恢复量"; reason="最近几天核心任务完成偏低，自动降量25%，先恢复连续性。"; }
    else if (recent3.length>=3 && r3>=0.85 && (r7==null || r7>=0.75)) { factor=1.10; level="进阶量"; reason="近期完成稳定，自动小幅加量10%，不突然堆任务。"; }
    else if (recent3.length>=2) { reason="近期完成度处于可持续区间，维持标准任务量。"; }
    return {factor,level,reason,recent3:r3==null?null:Math.round(r3*100),recent7:r7==null?null:Math.round(r7*100),days:usable.length};
  }

  function trendProfile() {
    const s = load();
    const ids = ["353","en","pol"];
    const taskId = {"353":"t-353", en:"t-en", pol:"t-pol"};
    const names = {"353":"353卫生综合", en:"英语一", pol:"政治"};
    const rows = [{date:s.today.date, done:s.today.done||{}, quality:s.today.quality||{}}].concat(s.dailyHistory||[]);
    const byDate = {}; rows.forEach(r=>{ if(r && r.date && !byDate[r.date]) byDate[r.date]=r; });
    const days=[]; for(let i=0;i<14;i++) days.push(addDays(todayStr(),-i));
    function qScore(g){ return g==="pass"?100:g==="review"?65:g==="redo"?30:null; }
    function blockScore(id, start, end){
      const vals=[];
      for(let i=start;i<end;i++){
        const r=byDate[days[i]]; if(!r) continue;
        const tid=taskId[id], q=(r.quality||{})[tid];
        if(q && q.grade){ vals.push(qScore(q.grade)); continue; }
        if((r.done||{})[tid]) vals.push(80);
      }
      return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length) : null;
    }
    const subjects=ids.map(id=>{
      const recent=blockScore(id,0,7), prior=blockScore(id,7,14);
      let delta=null, trend="数据不足", level="flat";
      if(recent!=null && prior!=null){ delta=recent-prior; trend=delta>=8?"上升":delta<=-8?"下降":"稳定"; level=delta>=8?"up":delta<=-8?"down":"flat"; }
      const low7=days.slice(0,7).filter(d=>{ const r=byDate[d], q=r&&((r.quality||{})[taskId[id]]); return q && (q.grade==="redo"||q.grade==="review"); }).length;
      return {id,name:names[id],recent,prior,delta,trend,level,low7};
    });
    function attemptTrend(list, filter){
      const a=(list||[]).filter(filter||(()=>true)).slice(0,40);
      const calc=x=>x.length?Math.round(x.filter(v=>v.ok).length/x.length*100):null;
      const recent=calc(a.slice(0,20)), prior=calc(a.slice(20,40));
      return {recent,prior,delta:(recent!=null&&prior!=null)?recent-prior:null,n:a.length};
    }
    const en=attemptTrend((s.english||{}).attempts||[], x=>["long-reading","practice","cloze","newtype","sentence"].includes(x.kind));
    const pol=attemptTrend((s.politics||{}).attempts||[], x=>x.kind==="multi"||x.kind==="choice");
    const repeated=Object.values(s.wrong||{}).filter(x=>!x.mastered && (x.count||0)>=3).sort((a,b)=>(b.count||0)-(a.count||0)).slice(0,5);
    const alerts=[];
    subjects.forEach(x=>{ if(x.low7>=3) alerts.push(`${x.name}最近7天有${x.low7}次“需巩固/回炉”，优先降新内容、加复现。`); if(x.level==="down") alerts.push(`${x.name}近7天质量较前7天下降${Math.abs(x.delta)}点，先查错因再加量。`); });
    if(en.delta!=null && en.delta<=-10) alerts.push(`英语近期客观训练正确率下降${Math.abs(en.delta)}点，优先回到最高频错因专项。`);
    if(pol.delta!=null && pol.delta<=-10) alerts.push(`政治近期选择题正确率下降${Math.abs(pol.delta)}点，优先清概念混淆和多选陷阱。`);
    if(repeated.length) alerts.push(`当前有${repeated.length}个知识点/题目累计错≥3次，属于反复红灯。`);
    if(!alerts.length) alerts.push("暂未触发明显预警。继续按今日发动机执行，积累至少两周数据后趋势会更可靠。");
    return {subjects,en,pol,repeated,alerts,daysWithData:Object.keys(byDate).length};
  }


  function riskProfile() {
    const s = load();
    const t = trendProfile();
    const p353 = scoreProfile(), en = englishProfile(), pol = politicsProfile();
    const tmap = Object.fromEntries(t.subjects.map(x=>[x.id,x]));
    const repeated = t.repeated || [];
    const rep353 = repeated.filter(x=>["epi","stats","ph","mp"].includes(x.subject));
    const repEn = repeated.filter(x=>x.subject==="en");
    const repPol = repeated.filter(x=>x.subject==="pol");
    function base(id, readiness, due, reps){
      const tr=tmap[id]||{}; let score=Math.max(0,100-(readiness||0))*0.45;
      score += Math.min(20,(due||0)*2.5) + Math.min(20,(tr.low7||0)*5) + Math.min(15,reps.length*5);
      if(tr.level==="down") score += 12;
      return Math.max(0,Math.min(100,Math.round(score)));
    }
    const r353=base("353",p353.readiness, totalProfile().subjects.find(x=>x.id==="353")?.due||0,rep353);
    let rEn=base("en",en.readiness,en.dueWeak||0,repEn); if(t.en.delta!=null&&t.en.delta<=-10) rEn=Math.min(100,rEn+12);
    let rPol=base("pol",pol.readiness,pol.analysisDue||0,repPol); if(t.pol.delta!=null&&t.pol.delta<=-10) rPol=Math.min(100,rPol+12); if(pol.multiAttempts>=20&&(pol.multiAccuracy||0)<70) rPol=Math.min(100,rPol+10);
    const level=x=>x>=70?"高风险":x>=45?"中风险":"可控";
    const items=[
      {id:"353",name:"353卫生综合",risk:r353,level:level(r353),evidence:rep353.length?`有${rep353.length}个反复红灯`:((tmap["353"]||{}).level==="down"?"近7天质量下降":"按当前准备度/到期量评估")},
      {id:"en",name:"英语一",risk:rEn,level:level(rEn),evidence:(t.en.delta!=null&&t.en.delta<=-10)?`近期客观正确率下降${Math.abs(t.en.delta)}点`:((tmap.en||{}).low7>=3?`近7天${tmap.en.low7}次低质量完成`:"按词汇/阅读/模块闸门评估")},
      {id:"pol",name:"政治",risk:rPol,level:level(rPol),evidence:(pol.multiAttempts>=20&&(pol.multiAccuracy||0)<70)?`多选正确率${pol.multiAccuracy}%`:((tmap.pol||{}).low7>=3?`近7天${tmap.pol.low7}次低质量完成`:"按选择题/分析题闸门评估")}
    ].sort((a,b)=>b.risk-a.risk);
    const actions={};
    if(rep353.length){ const top=rep353.sort((a,b)=>(b.count||0)-(a.count||0))[0]; actions["353"]={title:"自动纠偏｜先清353反复红灯",href:"#/wrong",why:`${top.subject||"353"}存在累计错${top.count||3}次项目；今天减少新内容，先把反复错误做对。`}; }
    else if((tmap["353"]||{}).low7>=3 || (tmap["353"]||{}).level==="down") actions["353"]={title:"自动纠偏｜353旧知识回炉",href:"#/review",why:"近期353质量偏低，今天降低新章节优先级，先复现旧知识和错题。"};
    const topReason=(en.reasons&&en.reasons[0]&&en.reasons[0][0])||"";
    if((t.en.delta!=null&&t.en.delta<=-10)||(tmap.en||{}).low7>=3){
      const map={"词汇":"#/english/daily","句法":"#/english/sentence","定位":"#/english/reading","逻辑":"#/english/reading","干扰项":"#/english/reading","主旨":"#/english/reading","推断":"#/english/reading"};
      actions.en={title:`自动纠偏｜英语${topReason||"弱项"}专项`,href:map[topReason]||"#/english/reading",why:`英语近期出现下降/低质量，优先处理最高频错因“${topReason||"阅读理解"}”，暂不盲目增加新内容。`};
    }
    if((pol.multiAttempts>=20&&(pol.multiAccuracy||0)<70)||(t.pol.delta!=null&&t.pol.delta<=-10)) actions.pol={title:"自动纠偏｜政治多选专项",href:"#/practice/run?subject=pol&type=multi",why:`政治多选/选择题稳定性不足，今天优先逐项判断和错因回炉，不用新章节掩盖失分点。`};
    else if((tmap.pol||{}).low7>=3) actions.pol={title:"自动纠偏｜政治分析题回炉",href:"#/politics/analysis/due",why:"政治近期低质量完成偏多，先做已到期分析题闭卷复现。"};
    const hasEnough=(t.daysWithData||0)>=5 || repeated.length>0 || (en.attempts||0)>=20 || (pol.attempts||0)>=20;
    return {items,actions,hasEnough,top:items[0],note:hasEnough?"风险用于自动纠偏，不是分数预测。":"当前数据较少，风险雷达只做轻量提示，不会激进改计划。"};
  }

  function examPhaseProfile() {
    const days = daysLeft();
    let no=1, name="基础建库期", focus="理解 + 第一轮 + 记忆启动", weights={"353":1.10,en:1.00,pol:0.80};
    let rule="先把三科稳定基础搭牢：353主线优先，英语持续不断线，政治以稳定理论和选择题基础为主。";
    if (days <= 300) { no=2; name="强化成型期"; focus="闭卷 + 题型 + 错题回炉"; weights={"353":1.08,en:1.00,pol:0.92}; rule="减少只看不练：三科都要进入闭卷、题型训练和错题二刷。"; }
    if (days <= 180) { no=3; name="真题校准期"; focus="真实真题 + 限时 + 弱项修正"; weights={"353":1.05,en:1.00,pol:0.95}; rule="真实历年题优先于继续堆原创题；没有真实真题的模块继续用现有训练维持，不伪造真题。"; }
    if (days <= 90) { no=4; name="整卷冲刺期"; focus="整套模考 + 速度 + 稳定得分"; weights={"353":1.00,en:1.00,pol:1.00}; rule="主线转为整卷和复盘；新知识只补明确漏洞，不再无边界扩张。"; }
    if (days <= 30) { no=5; name="考前收口期"; focus="高频错题 + 背诵 + 作息与手感", weights={"353":1.00,en:0.95,pol:1.05}; rule="只保留最值钱的复现、错题、背诵和套卷手感；避免临考前大规模开新内容。"; }
    return {no,name,focus,rule,weights,days};
  }


  function milestoneProfile() {
    const s = load();
    const phase = examPhaseProfile();
    const p353 = scoreProfile(), en = englishProfile(), pol = politicsProfile();
    const weekly = weeklyProfile();
    const targets = {
      1:{"353":65,en:35,pol:30,label:"基础建库里程碑",goal:"三科形成可持续第一轮底盘，不追求提前刷完所有内容。"},
      2:{"353":75,en:55,pol:50,label:"强化成型里程碑",goal:"闭卷、题型和错题回炉成为主训练方式。"},
      3:{"353":78,en:70,pol:65,label:"真题校准里程碑",goal:"真实历年题开始主导校准，原创训练退到补漏洞位置。"},
      4:{"353":82,en:78,pol:72,label:"整卷冲刺里程碑",goal:"三科进入限时整卷与稳定得分训练。"},
      5:{"353":85,en:82,pol:78,label:"考前收口里程碑",goal:"只保留高价值错题、背诵、到期复现与套卷手感。"}
    };
    const t = targets[phase.no];
    const exam=s.examDate;
    const phaseRanges={1:[480,300],2:[300,180],3:[180,90],4:[90,30],5:[30,0]};
    const [startDays,endDays]=phaseRanges[phase.no];
    const deadline=addDays(exam,-endDays);
    const span=Math.max(1,startDays-endDays);
    const elapsed=Math.max(0,Math.min(span,startDays-phase.days));
    const expected=Math.round(elapsed/span*100);
    const vals={"353":p353.readiness||0,en:en.readiness||0,pol:pol.readiness||0};
    const names={"353":"353卫生综合",en:"英语一",pol:"政治"};
    const targetVals={"353":t["353"],en:t.en,pol:t.pol};
    const items=["353","en","pol"].map(id=>{
      const readiness=vals[id];
      const target=targetVals[id];
      const progress=Math.max(0,Math.min(100,Math.round(readiness/Math.max(1,target)*100)));
      const gap=progress-expected;
      let status="按节奏", level="ok", boost=0;
      if(expected<10 && progress<10){ status="刚起步"; level="start"; }
      else if(gap<=-25){ status="明显落后"; level="behind"; boost=18; }
      else if(gap<=-12){ status="需要追赶"; level="watch"; boost=10; }
      else if(gap>=20){ status="阶段领先"; level="ahead"; }
      const days7=(weekly.daysBy||{})[id]||0;
      let paceText=days7>=5?"最近7天连续性足够，保持当前节奏。":days7>=3?"最近7天连续性一般，优先守住主线不断档。":"最近7天有效天数偏少，追赶先靠恢复连续性，不靠单日暴量。";
      return {id,name:names[id],readiness,target,progress,expected,gap,status,level,boost,days7,paceText};
    });
    const byId=Object.fromEntries(items.map(x=>[x.id,x]));
    const behind=items.filter(x=>x.boost>0).sort((a,b)=>b.boost-a.boost || a.gap-b.gap);
    let action="当前没有需要提前加速的长期科目，继续按今日发动机执行。";
    if(behind.length){ const x=behind[0]; action=`${x.name}当前低于本阶段内部进度线，系统会在不增加总学习时长的前提下，提高它的每日排序和时间占比。`; }
    return {phase,deadline,expected,target:t,items,byId,behind,action,daysToDeadline:Math.max(0,Math.ceil((new Date(deadline+"T23:59:59")-new Date())/86400000))};
  }


  function monthlyProfile() {
    const s = load();
    const taskId = {"353":"t-353", en:"t-en", pol:"t-pol"};
    const names = {"353":"353卫生综合", en:"英语一", pol:"政治"};
    const rows = [{date:s.today.date, done:s.today.done||{}, quality:s.today.quality||{}}].concat(s.dailyHistory||[]);
    const byDate={}; rows.forEach(r=>{ if(r&&r.date&&!byDate[r.date]) byDate[r.date]=r; });
    const days=[]; for(let i=0;i<60;i++) days.push(addDays(todayStr(),-i));
    const qScore=g=>g==="pass"?100:g==="review"?65:g==="redo"?30:null;
    function block(id,start,end){
      let planned=0, done=0, quality=[];
      for(let i=start;i<end;i++){ const r=byDate[days[i]]; if(!r) continue; planned++; const tid=taskId[id]; if((r.done||{})[tid]) done++; const q=(r.quality||{})[tid]; const v=q&&q.grade?qScore(q.grade):null; if(v!=null) quality.push(v); }
      return {recorded:planned,done,continuity:planned?Math.round(done/planned*100):null,quality:quality.length?Math.round(quality.reduce((a,b)=>a+b,0)/quality.length):null,qualityN:quality.length};
    }
    const milestone=milestoneProfile();
    const readiness={"353":scoreProfile().readiness||0,en:englishProfile().readiness||0,pol:politicsProfile().readiness||0};
    const items=["353","en","pol"].map(id=>{
      const recent=block(id,0,30), prior=block(id,30,60);
      const qDelta=(recent.quality!=null&&prior.quality!=null)?recent.quality-prior.quality:null;
      const cDelta=(recent.continuity!=null&&prior.continuity!=null)?recent.continuity-prior.continuity:null;
      const ms=milestone.byId[id]||{};
      let status="数据积累中", boost=0, timeFactor=1, action="继续按当前日计划积累有效学习记录。";
      if(recent.recorded>=7){
        status="按月稳定";
        if((ms.boost||0)>=18 || (recent.quality!=null&&recent.quality<55)){ status="下月重点追赶"; boost=10; timeFactor=1.08; action="下月在不增加总时长的前提下，优先分配更多主线时间，并减少低价值新内容。"; }
        else if((ms.boost||0)>0 || (recent.continuity!=null&&recent.continuity<55) || (qDelta!=null&&qDelta<=-10)){ status="下月温和纠偏"; boost=5; timeFactor=1.04; action="下月小幅提高优先级，先修连续性和旧漏洞，不制造补课债。"; }
        else if(qDelta!=null&&qDelta>=8 && recent.continuity>=70){ status="本月进步"; action="保持当前节奏，不因短期进步突然加量。"; }
      }
      return {id,name:names[id],readiness,recent,prior,qDelta,cDelta,status,boost,timeFactor,action};
    });
    const byId=Object.fromEntries(items.map(x=>[x.id,x]));
    const focus=items.slice().sort((a,b)=>b.boost-a.boost || a.readiness-b.readiness)[0];
    const recorded=Math.max(...items.map(x=>x.recent.recorded));
    const month=todayStr().slice(0,7);
    let summary=recorded<7?"本月记录还少，先执行，不急着重算大计划。":`${focus.name}是下月最需要关注的科目；系统只做温和重分配，不额外增加学习债。`;
    return {month,items,byId,focus,recorded,summary};
  }

  function resetToday() {
    return update((s) => {
      s.today.done = {};
      s.today.started = {};
      s.today.completedAt = {};
      s.today.quality = {};
    });
  }

  return {
    todayStr,
    addDays,
    get,
    update,
    setMode,
    toggleTask,
    markTask,
    markTaskQuality,
    latestCoreQuality,
    startTask,
    addExtra,
    rateKnowledge,
    dueIds,
    mastery,
    recordWrong,
    recordRight,
    setWrongReason,
    topWrong,
    saveMock,
    markWord,
    recordEnglishAttempt,
    saveEnglishDraft,
    recordEnglishPaperCheck,
    recordPoliticsAttempt,
    savePoliticsAnalysis,
    savePoliticsCurrentAffairs,
    savePoliticsFullMock,
    politicsProfile,
    englishProfile,
    daysLeft,
    resetToday,
    scoreProfile,
    totalProfile,
    weeklyProfile,
    adaptiveProfile,
    trendProfile,
    riskProfile,
    examPhaseProfile,
    milestoneProfile,
    monthlyProfile,
    backupPayload,
    validateBackup,
    restoreBackup,
    kp: (id) => kp(load(), id),
  };
})();
