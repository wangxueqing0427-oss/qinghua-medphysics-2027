'use strict';
// Pure presentation enhancement; no writes to any learner profile or other storage.
// Requires the existing original overview to finish creating/binding its 47 course cards.
(function (global) {
  const state = { subject: 'all', search: '', expanded: false };
  const names = { all: '全部', en: '英语', pol: '政治', '353': '353卫生综合' };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  function enhance({ app, pack, plan, act, openUnit }) {
    const cards = [...app.querySelectorAll('[data-subject]')];
    const legacySubject = app.querySelector('#subject-filter');
    if (!cards.length || !legacySubject) throw Error('Mobile course catalog is unavailable');
    const byId = new Map(pack.units.map(u => [u.id, u]));
    if (cards.length !== pack.units.length) throw Error('Mobile catalog/course count mismatch');
    const container = document.createElement('section');
    container.className = 'mobile-course-catalog';
    container.id = 'course-catalog';
    container.setAttribute('aria-label', '全部课程目录');
    cards[0].before(container);
    cards.forEach(card => {
      const button = card.querySelector('[data-unit]');
      const unit = byId.get(button?.dataset.unit);
      if (!unit || unit.subject !== card.dataset.subject) throw Error('Mobile course ownership mismatch');
      card.dataset.search = [unit.title, unit.definition, ...(unit.learningObjectives || []).map(o => o.description)]
        .join(' ').toLocaleLowerCase();
      container.append(card); // Moving live buttons preserves original click handlers.
    });

    const controls = document.createElement('section');
    controls.className = 'mobile-catalog-controls';
    controls.setAttribute('aria-label', '查找与筛选课程');
    controls.innerHTML = '<h2 id="course-heading">课程目录</h2>' +
      '<label class="mobile-course-search">查找课程或知识点' +
      '<input id="course-search" type="search" autocomplete="off" spellcheck="false" ' +
      'placeholder="例如：主谓一致、统计、放射" aria-controls="course-catalog"></label>' +
      '<div class="mobile-subject-tabs" role="group" aria-label="科目筛选">' +
      Object.entries(names).map(([value, name]) =>
        '<button type="button" data-filter="' + value + '" aria-pressed="false">' + name + '</button>'
      ).join('') + '</div>' +
      '<p id="mobile-course-count" class="mobile-course-count" role="status" aria-live="polite"></p>' +
      '<button type="button" id="mobile-toggle-all" class="btn ghost block" hidden>查看全部课程</button>';
    container.before(controls);
    const legacyLabel = legacySubject.closest('label');
    // Keep the native selector available for keyboard and previously tested flows.
    legacyLabel.classList.add('mobile-legacy-filter');
    controls.append(legacyLabel);
    const searchInput = controls.querySelector('#course-search');
    const tabs = [...controls.querySelectorAll('[data-filter]')];
    const count = controls.querySelector('#mobile-course-count');
    const toggle = controls.querySelector('#mobile-toggle-all');
    const maxInitial = 8;
    const refresh = () => {
      const text = state.search.toLocaleLowerCase().trim();
      const eligible = cards.filter(card =>
        (state.subject === 'all' || card.dataset.subject === state.subject) &&
        (!text || card.dataset.search.includes(text))
      );
      const visible = state.expanded ? eligible.length : Math.min(maxInitial, eligible.length);
      const shown = new Set(eligible.slice(0, visible));
      cards.forEach(card => { card.hidden = !shown.has(card); });
      count.textContent = eligible.length ?
        '显示 ' + visible + ' / ' + eligible.length + ' 门匹配课程。课程仍属于内部草稿，非正式考纲覆盖。' :
        '没有找到匹配课程，请更换关键词或科目。';
      toggle.hidden = eligible.length <= maxInitial;
      toggle.textContent = state.expanded ? '收起课程列表' : '查看全部 ' + eligible.length + ' 门课程';
      legacySubject.value = state.subject;
      tabs.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === state.subject)));
    };
    tabs.forEach(button => button.addEventListener('click', () => {
      state.subject = button.dataset.filter;
      state.expanded = false;
      refresh();
    }));
    legacySubject.onchange = () => {
      state.subject = legacySubject.value;
      state.expanded = false;
      refresh();
    };
    searchInput.value = state.search;
    searchInput.addEventListener('input', () => {
      state.search = searchInput.value;
      state.expanded = false;
      refresh();
    });
    toggle.addEventListener('click', () => {
      state.expanded = !state.expanded;
      refresh();
    });
    refresh();

    const first = plan.tasks.find(task => byId.has(task.unitId));
    const hero = document.createElement('section');
    hero.className = 'mobile-next-task';
    hero.setAttribute('aria-label', '今日学习重点');
    const label = first?.kind === 'review' ? '到期复习' :
      first?.kind === 'continue' ? '继续上次进度' : '从这里开始';
    hero.innerHTML = '<div class="mobile-next-eyebrow">今日学习重点 · 只安排一项</div>' +
      (first ?
        '<h2>' + escape(first.title) + '</h2>' +
        '<p>建议学习段：' + escape(first.allottedMinutes) + ' 分钟。' +
        (first.kind === 'review' ? '这是一项已到期复习。' :
          first.kind === 'continue' ? '从本机保存的位置继续。' : '先理解，再闭卷练习。') + '</p>' +
        '<button type="button" class="btn block mobile-primary" id="mobile-resume">' +
        escape(label) + '</button>' :
        '<h2>今天没有待完成的课程任务</h2>' +
        '<p>可在下方查看课程目录，或等待已有延迟复习到期。不虚构掌握成绩。</p>');
    const title = app.querySelector('h1');
    title.after(hero);
    if (first) hero.querySelector('#mobile-resume').addEventListener('click', () =>
      act(async () => openUnit(first.unitId)));
  }

  global.MobileUX = Object.freeze({ enhance });
})(window);
