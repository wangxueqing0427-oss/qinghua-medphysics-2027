'use strict';
// Read-only English passage study aid; all text is lifted verbatim from existing internal draft stems.
// Never edits questions, answers, grading, saved learning progress, or local storage.
(function (global) {
  let active = null;
  function extractPassage(stem) {
    const head = String(stem ?? '').split(/\r?\n\s*\r?\n/)[0];
    const rows = head.split(/\r?\n/);
    const parsed = rows.map(row => /^([A-Z])([1-9]\d*) (.+)$/.exec(row));
    if (parsed.length < 3 || parsed.some(row => !row)) return [];
    const group = parsed[0][1];
    if (parsed.some((row, i) => row[1] !== group || Number(row[2]) !== i + 1 || !/[.!?]$/.test(row[3])))
      return [];
    return parsed.map(row => ({ id: row[1] + row[2], text: row[3] }));
  }
  function stopSpeech() {
    if (!active) return;
    const old = active;
    active = null;
    try { global.speechSynthesis?.cancel(); } catch (_) {}
    old.mark?.classList.remove('passage-speaking');
    if (old.status?.isConnected) old.status.textContent = '朗读已停止。';
  }
  function speak(text, mark, status, rate) {
    stopSpeech();
    if (!('speechSynthesis' in global) || !('SpeechSynthesisUtterance' in global)) {
      status.textContent = '设备不支持系统语音朗读，可继续查看英文原文。';
      return;
    }
    try {
      const u = new global.SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate;
      active = { mark, status };
      mark.classList.add('passage-speaking');
      u.onend = () => {
        if (active?.mark !== mark) return;
        mark.classList.remove('passage-speaking');
        active = null;
        status.textContent = '朗读结束，可再次播放。';
      };
      u.onerror = () => {
        if (active?.mark !== mark) return;
        mark.classList.remove('passage-speaking');
        active = null;
        status.textContent = '设备朗读失败，请检查音量和系统语音设置。';
      };
      global.speechSynthesis.cancel();
      global.speechSynthesis.speak(u);
      status.textContent = '使用本机系统语音播放，音色与离线可用性取决于设备。';
    } catch (_) {
      active = null;
      mark.classList.remove('passage-speaking');
      status.textContent = '设备未能启动语音朗读，仍可阅读原文。';
    }
  }
  function enhance({ app, unit, session, question }) {
    stopSpeech();
    if (unit.id !== 'en-reading-evidence-foundation' || unit.subject !== 'en') return;
    let stem;
    if (session.stage === 'learn') stem = unit.basicQuestions?.[0]?.stem;
    else if (session.stage === 'practice') stem = question?.stem;
    else if (session.stage === 'feedback') stem = session.feedback?.questionSnapshot?.stem;
    else return;
    const lines = extractPassage(stem);
    if (!lines.length) return; // No passage = no invented speech content.
    const sourceIds = lines.map(l => l.id);
    const wrapper = document.createElement('details');
    wrapper.className = 'english-passage-reader';
    wrapper.dataset.passage = lines[0].id.charAt(0);
    wrapper.open = session.stage === 'learn';
    const title = document.createElement('summary');
    title.textContent = '英文阅读原文 · ' + lines.length + ' 句（可逐句听或整篇听）';
    const box = document.createElement('div');
    box.className = 'passage-reader-body';
    const intro = document.createElement('p');
    intro.className = 'passage-caption';
    intro.textContent = '原创内部教学短文，不是考研真题。句子编号用于答题定位，朗读不会改变成绩或学习记录。';
    const controls = document.createElement('div');
    controls.className = 'passage-controls';
    const rateLabel = document.createElement('label');
    rateLabel.textContent = '朗读速度 ';
    const rateSelect = document.createElement('select');
    rateSelect.className = 'passage-rate';
    rateSelect.setAttribute('aria-label', '英文朗读速度');
    for (const [value,label] of [['0.75','慢速'],['0.85','跟读'],['1','正常']]) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      option.selected = value === '0.85';
      rateSelect.append(option);
    }
    rateLabel.append(rateSelect);
    const full = document.createElement('button');
    full.className = 'btn passage-play-all';
    full.type = 'button';
    full.textContent = '朗读全文';
    const stop = document.createElement('button');
    stop.className = 'btn ghost passage-stop';
    stop.type = 'button';
    stop.textContent = '停止朗读';
    controls.append(rateLabel,full,stop);
    const status = document.createElement('p');
    status.className = 'passage-audio-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = '朗读使用设备语音；离线时可能需要已安装的英文语音包。';
    const list = document.createElement('ol');
    list.className = 'passage-lines';
    for (const [i, line] of lines.entries()) {
      const li = document.createElement('li');
      li.dataset.passageId = line.id;
      const id = document.createElement('span');
      id.className = 'passage-line-id';
      id.textContent = line.id;
      const sentence = document.createElement('span');
      sentence.className = 'passage-line-text';
      sentence.textContent = line.text;
      const listen = document.createElement('button');
      listen.type = 'button';
      listen.className = 'btn ghost passage-play-line';
      listen.textContent = '听';
      listen.setAttribute('aria-label', '朗读第 ' + (i + 1) + ' 句：' + line.id);
      li.append(id,sentence,listen);
      listen.addEventListener('click', () => speak(line.text,li,status,Number(rateSelect.value)));
      list.append(li);
    }
    full.addEventListener('click', () => speak(lines.map(line => line.text).join(' '),list,status,Number(rateSelect.value)));
    stop.addEventListener('click', stopSpeech);
    box.append(intro,controls,status,list);
    wrapper.append(title,box);
    const card = app.querySelector('section.card');
    if (!card) throw Error('Reading passage container missing');
    if (session.stage === 'learn') {
      const primary = card.querySelector('#learned');
      if (!primary) throw Error('Lesson study action missing');
      card.insertBefore(wrapper, primary);
    } else {
      card.before(wrapper); // Existing question stem and answer inputs remain unmodified.
    }
    if (sourceIds.some((id,i)=>id !== lines[i].id)) throw Error('Reading source identity drift');
  }
  global.ReadingPassage = Object.freeze({ extractPassage, enhance, stopSpeech });
})(window);
