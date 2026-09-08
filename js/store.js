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
      examDate: "2026-12-19",
      knowledge: {},
      wrong: {},
      mocks: [],
      today: { date: todayStr(), done: {}, extra: [] },
      english: { words: {}, lastDate: "" },
      lastWeekly: "",
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const s = Object.assign(defaultState(), JSON.parse(raw));
      if (s.today.date !== todayStr()) {
        s.today = { date: todayStr(), done: {}, extra: s.today.extra || [] };
      }
      return s;
    } catch (e) {
      return defaultState();
    }
  }

  function save(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
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
      s.today.done[id] = !s.today.done[id];
    });
  }

  function markTask(id) {
    return update((s) => { s.today.done[id] = true; });
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
      s.english.words[id] = {
        ok: !!ok,
        last: Date.now(),
        count: ((s.english.words[id] && s.english.words[id].count) || 0) + 1,
      };
      s.english.lastDate = todayStr();
    });
  }

  function daysLeft() {
    const s = load();
    const d = new Date(s.examDate + "T09:00:00");
    return Math.max(0, Math.ceil((d - new Date()) / 86400000));
  }

  function resetToday() {
    return update((s) => {
      s.today.done = {};
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
    daysLeft,
    resetToday,
    kp: (id) => kp(load(), id),
  };
})();
