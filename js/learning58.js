// UI preferences live inside the existing backup-compatible study state.
function speechRate58() {
  const n = Number((Store.get().preferences || {}).speechRate);
  return [0.55, 0.7, 0.85, 1].includes(n) ? n : 0.55;
}
function setSpeechRate58(value) {
  const n = Number(value);
  if (![0.55, 0.7, 0.85, 1].includes(n)) return;
  stopSpeech58();
  Store.update(s => { s.preferences = {...s.preferences, speechRate:n}; });
}
function stopSpeech58() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
function speechControls58() {
  const rate = speechRate58();
  return `<div class="speech-tools"><label>朗读速度 <select aria-label="朗读速度" onchange="setSpeechRate58(this.value)">${[[0.55,'很慢'],[0.7,'慢速'],[0.85,'适中'],[1,'正常']].map(([n,t])=>`<option value="${n}" ${rate===n?'selected':''}>${t}</option>`).join('')}</select></label><button class="btn ghost" onclick="stopSpeech58()">停止朗读</button><span class="small">自动记住；手机声音以实际听感为准</span></div>`;
}
function sentenceListen58(text) {
  const rows = String(text || '').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  return `<details class="sentence-list"><summary>逐句听读 · 听一句，停下来复述</summary>${rows.map((s,i)=>`<div class="sentence-pair"><button class="btn ghost" data-speech="${escapeHtml(s.trim())}" onclick="speakEnglish(this.dataset.speech)">听第${i+1}句</button><p>${escapeHtml(s.trim())}</p></div>`).join('')}</details>`;
}
function pickDailyPass58() {
  const s = Store.get();
  const index = Number(s.english.readingRotation58) || 0;
  const categories = ['社会','经济','教育','科技','文化','环境','医学'];
  const topic = categories[index % categories.length];
  const pool = ENGLISH_PASSAGES.filter(p => (p.topic58 || (passageHelp(p) ? '医学' : '')) === topic && passageHelp(p));
  const seen = s.english.readingSeen58 || [];
  const candidates = pool.filter(p => !seen.includes(p.id));
  const choice = (candidates.length ? candidates : pool)[Math.floor(index/categories.length) % Math.max(1,(candidates.length ? candidates : pool).length)];
  if (!choice) return ENGLISH_PASSAGES[0];
  Store.update(x => { x.english.readingRotation58=index+1; x.english.readingSeen58=[...seen,choice.id].slice(-100); });
  return choice;
}
function readingNote58(pass) {
  return `<p class="small">题材：${escapeHtml(pass.topic58 || '医学与科学')} · 原创基础短文，非历年真题。英语一不按353专业命题；这里先练理解，后续需用陌生真题检验。</p>`;
}
function scoreReality58() {
  return `<section class="card"><details><summary><b>学完能到350分吗？查看能力缺口</b></summary><p>目前不能据此判断。记熟站内题说明熟悉这些材料，还需证明能独立解决没见过的题。</p><p>350 = 353卫生综合225 + 英语一65 + 政治60，是训练目标，不是预测分。</p><ul><li>353：按报考年度官方大纲与参考书逐条核对，补计算、案例和跨学科应用。</li><li>英语：1012个基础训练词只是起点；还需陌生阅读、完整真题、作文与翻译批改。</li><li>政治：补考试年度时政，练未见过的多选和材料分析。</li></ul><p>建议用最近3次未做过的、按正式时限完成且认真批改的整套测试观察稳定性。重复背熟的题、自评偏宽的分数都不能替代这一步。</p><p><a href="https://vsph.tsinghua.edu.cn/info/1025/2643.htm" target="_blank" rel="noopener">清华2026年353官方大纲（参考，报考年度需重新核对）</a></p><button class="btn ghost block" onclick="go('/content-audit')">查看三科内容缺口</button></details></section>`;
}
window.addEventListener('hashchange', stopSpeech58);
window.addEventListener('pagehide', stopSpeech58);
