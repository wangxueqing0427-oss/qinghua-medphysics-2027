'use strict';
// Read-only presentation overlay. No course answer, rubric, grading or student data writes.
(function (global) {
  let readerSize = 'normal';
  let speaking = false;
  const sizes = {small: '标准', normal: '舒适', large: '大字'};
  const STOPS = new Set(['。', '！', '？', '；']);
  function splitExactly(text) {
    const chunks = [];
    let buffer = '';
    for (const char of text) {
      buffer += char;
      if (char === '\n' || (buffer.length >= 155 && STOPS.has(char))) {
        chunks.push(buffer);
        buffer = '';
      }
    }
    if (buffer) chunks.push(buffer);
    return chunks;
  }
  function firstEnglishSentence(example) {
    // Only speak a visible, verbatim original-English example (never LLM-generated audio text).
    const found = [...String(example || '').matchAll(/\b[A-Za-z][A-Za-z'’ ,\-]{7,}[.!?]/g)]
      .map(match => match[0].trim())
      .find(text => text.split(/\s+/).length >= 3 && text.length <= 180);
    return found || '';
  }
  function stopSpeech() {
    if (speaking && 'speechSynthesis' in global) {
      try { global.speechSynthesis.cancel(); } catch (_) {}
    }
    speaking = false;
  }
  function enhance({app, unit, session, questionTotal}) {
    stopSpeech();
    if (session.stage === 'learn') {
      const card = app.querySelector('section.card');
      const title = card?.querySelector('h2');
      const paragraph = title?.nextElementSibling;
      if (!title || title.textContent !== '先理解' || paragraph?.tagName !== 'P')
        throw Error('Expected original lesson body is unavailable');
      const original = paragraph.textContent;
      const fragments = splitExactly(original);
      const block = document.createElement('div');
      block.className = 'mobile-reading';
      block.dataset.readerSize = readerSize;
      block.setAttribute('aria-label', '课程讲解正文');
      for (const [index, text] of fragments.entries()) {
        const p = document.createElement('p');
        p.className = 'reading-paragraph';
        p.dataset.block = String(index + 1);
        p.textContent = text;
        block.append(p);
      }
      if (block.textContent !== original) throw Error('Lesson text integrity mismatch');
      paragraph.replaceWith(block);

      const toolbar = document.createElement('div');
      toolbar.className = 'reading-toolbar';
      toolbar.setAttribute('role', 'group');
      toolbar.setAttribute('aria-label', '阅读字号');
      toolbar.innerHTML = '<span>阅读字号</span>' +
        Object.entries(sizes).map(([value, label]) =>
          '<button type="button" data-reading-size="' + value + '" aria-pressed="' +
          String(value === readerSize) + '">' + label + '</button>'
        ).join('');
      title.after(toolbar);
      for (const button of toolbar.querySelectorAll('button[data-reading-size]')) {
        button.addEventListener('click', () => {
          readerSize = button.dataset.readingSize;
          block.dataset.readerSize = readerSize;
          for (const child of toolbar.querySelectorAll('button[data-reading-size]'))
            child.setAttribute('aria-pressed', String(child.dataset.readingSize === readerSize));
        });
      }
      if (unit.subject === 'en') {
        const excerpt = firstEnglishSentence(unit.example);
        if (excerpt) {
          const audio = document.createElement('aside');
          audio.className = 'english-speech';
          const label = document.createElement('p');
          label.className = 'speech-phrase';
          label.textContent = excerpt;
          const play = document.createElement('button');
          play.className = 'btn speech-play';
          play.type = 'button';
          play.textContent = '朗读上方英文例句';
          const stop = document.createElement('button');
          stop.className = 'btn ghost speech-stop';
          stop.type = 'button';
          stop.textContent = '停止';
          const info = document.createElement('p');
          info.className = 'speech-hint';
          info.setAttribute('role', 'status');
          info.setAttribute('aria-live', 'polite');
          info.textContent = '使用设备语音，离线可用性取决于本机已安装的语音包。';
          const heading = document.createElement('h3');
          heading.textContent = '英文例句跟读';
          audio.append(heading,label,play,stop,info);
          card.insertBefore(audio,card.querySelector('#learned'));
          play.addEventListener('click', () => {
            if (!('speechSynthesis' in global) || !('SpeechSynthesisUtterance' in global)) {
              info.textContent = '当前浏览器不支持系统朗读，请直接阅读上方英文例句。';
              return;
            }
            try {
              global.speechSynthesis.cancel();
              const voice = new global.SpeechSynthesisUtterance(excerpt);
              voice.lang = 'en-US';
              voice.rate = 0.85;
              voice.onend = () => { speaking = false; info.textContent = '朗读结束，可以再听一遍。'; };
              voice.onerror = () => { speaking = false; info.textContent = '系统朗读失败，请检查音量或本机语音设置。'; };
              global.speechSynthesis.speak(voice);
              speaking = true;
              info.textContent = '正在使用设备语音朗读。发音音色取决于本机语音包。';
            } catch (_) {
              speaking = false;
              info.textContent = '设备未能启动朗读，请检查语音设置。';
            }
          });
          stop.addEventListener('click', () => {
            stopSpeech();
            info.textContent = '朗读已停止。';
          });
        }
      }
      return;
    }
    if (session.stage === 'practice' || session.stage === 'feedback') {
      const total = questionTotal;
      if (!Number.isInteger(total) || total < 1) throw Error('Invalid question count');
      const done = Math.min(total, session.index + (session.stage === 'feedback' ? 1 : 0));
      const panel = document.createElement('div');
      panel.className = 'practice-progress';
      const label = document.createElement('p');
      label.textContent = '本轮练题进度：已完成 ' + done + ' / ' + total + ' 题';
      const meter = document.createElement('div');
      meter.className = 'practice-meter';
      meter.setAttribute('role', 'progressbar');
      meter.setAttribute('aria-label', '本轮练题完成进度');
      meter.setAttribute('aria-valuemin', '0');
      meter.setAttribute('aria-valuemax', String(total));
      meter.setAttribute('aria-valuenow', String(done));
      const fill = document.createElement('div');
      fill.className = 'practice-meter-fill';
      fill.style.width = (done / total * 100) + '%';
      meter.append(fill);
      panel.append(label,meter);
      const card = app.querySelector('section.card');
      if (!card) throw Error('Question form unavailable');
      card.before(panel);
    }
  }
  global.MobileReading = Object.freeze({enhance, splitExactly, firstEnglishSentence});
})(window);
