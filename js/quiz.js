/* ==========================================================================
   Easy Education — движок тестов
   Регистрация: App.registerQuiz(topicId, { questions: [...] })
   Схема вопроса:
   {
     id?: string,                // авто: "<topicId>-q<N>"
     prompt: string (HTML),      // текст вопроса
     figure?: string (HTML/SVG), // опциональная иллюстрация (сверху опций)
     render?: (container) => {}, // альтернатива figure: динамический рендер
     options: [
       { text: string (HTML), correct?: boolean, explain?: string (HTML) },
       ... (2-6 вариантов)
     ],
     explain?: string (HTML),    // общее пояснение, показывается после ответа
   }
   ========================================================================== */

(function () {
  if (typeof App === 'undefined') {
    console.error('Quiz: App не найден, quiz.js должен грузиться после app.js');
    return;
  }

  const quizzes = new Map(); // topicId → { questions: [...] }
  const MAX_DEFAULT = 10;
  let state = null;          // текущее прохождение

  /* ---------- Регистрация ---------- */
  function register(topicId, data) {
    if (!topicId || !data || !Array.isArray(data.questions)) {
      console.warn('registerQuiz: bad data for', topicId);
      return;
    }
    data.questions.forEach((q, i) => {
      if (!q.id) q.id = `${topicId}-q${i + 1}`;
      q.topicId = topicId;
      if (!Array.isArray(q.options) || q.options.length < 2) {
        console.warn(`quiz ${q.id}: need at least 2 options`);
      }
      if (!q.options.some((o) => o.correct)) {
        console.warn(`quiz ${q.id}: no correct option marked`);
      }
    });
    quizzes.set(topicId, data);
  }

  /* ---------- Выборка вопросов по области ---------- */
  function poolAll() {
    const pool = [];
    for (const data of quizzes.values()) pool.push(...data.questions);
    return pool;
  }
  function poolByCategory(catId) {
    const topicIds = App.listTopics().filter((t) => t.category === catId).map((t) => t.id);
    const pool = [];
    for (const tid of topicIds) {
      const data = quizzes.get(tid);
      if (data) pool.push(...data.questions);
    }
    return pool;
  }
  function poolByTopic(tid) {
    const data = quizzes.get(tid);
    return data ? [...data.questions] : [];
  }

  /* ---------- Утилиты ---------- */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function categoryName(catId) {
    const c = App.listCategories().find((x) => x.id === catId);
    return c ? c.name : catId;
  }
  function topicTitle(tid) {
    const t = App.listTopics().find((x) => x.id === tid);
    return t ? t.title : tid;
  }

  /* ---------- DOM: overlay ---------- */
  function ensureOverlay() {
    let el = document.getElementById('quiz-overlay');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'quiz-overlay';
    el.className = 'quiz-overlay hidden';
    el.innerHTML = `
      <div class="quiz-card" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
        <header class="quiz-header">
          <div class="quiz-crumb" id="quiz-crumb"></div>
          <h3 id="quiz-title">Проверь себя</h3>
          <button class="quiz-close" id="quiz-close" aria-label="Закрыть">×</button>
        </header>
        <div class="quiz-progress" id="quiz-progress"><div class="quiz-progress-bar" id="quiz-progress-bar"></div></div>
        <div class="quiz-body" id="quiz-body"></div>
        <footer class="quiz-footer" id="quiz-footer"></footer>
      </div>
    `;
    document.body.appendChild(el);
    el.addEventListener('click', (e) => { if (e.target === el) close(); });
    el.querySelector('#quiz-close').addEventListener('click', close);
    return el;
  }
  function show() { ensureOverlay().classList.remove('hidden'); document.body.classList.add('quiz-open'); }
  function hide() {
    const el = document.getElementById('quiz-overlay');
    if (el) el.classList.add('hidden');
    document.body.classList.remove('quiz-open');
  }

  /* ---------- Экран выбора ---------- */
  function open() {
    ensureOverlay();
    state = null;
    renderSelect();
    show();
  }
  function close() { state = null; hide(); }

  function renderSelect() {
    const body = document.getElementById('quiz-body');
    const footer = document.getElementById('quiz-footer');
    const crumb = document.getElementById('quiz-crumb');
    const title = document.getElementById('quiz-title');
    const bar = document.getElementById('quiz-progress-bar');

    crumb.textContent = '';
    title.textContent = 'Проверь себя';
    bar.style.width = '0%';

    const categoriesWithQuiz = App.listCategories()
      .map((c) => ({ ...c, count: poolByCategory(c.id).length }))
      .filter((c) => c.count > 0);
    const topicsWithQuiz = App.listTopics()
      .filter((t) => quizzes.has(t.id))
      .map((t) => ({ id: t.id, title: t.title, count: poolByTopic(t.id).length, category: t.category }));

    const totalAll = poolAll().length;

    // Блок: все темы
    const allBlock = `
      <label class="quiz-scope">
        <input type="radio" name="quiz-scope" value="all" checked>
        <span class="quiz-scope-main">Все темы</span>
        <span class="quiz-scope-meta">${totalAll} вопр.</span>
      </label>
    `;

    // Блок: категории
    const catBlock = categoriesWithQuiz.map((c) => `
      <label class="quiz-scope">
        <input type="radio" name="quiz-scope" value="cat:${c.id}">
        <span class="quiz-scope-main">${escapeHtml(c.name)}</span>
        <span class="quiz-scope-meta">${c.count} вопр.</span>
      </label>
    `).join('');

    // Блок: по теме (dropdown)
    const topicOptions = topicsWithQuiz.map((t) =>
      `<option value="${t.id}">${escapeHtml(t.title)} (${t.count})</option>`
    ).join('');
    const topicBlock = topicsWithQuiz.length ? `
      <label class="quiz-scope quiz-scope-topic">
        <input type="radio" name="quiz-scope" value="topic">
        <span class="quiz-scope-main">Конкретная тема</span>
        <select id="quiz-topic-select" ${topicsWithQuiz.length === 0 ? 'disabled' : ''}>${topicOptions}</select>
      </label>
    ` : '';

    body.innerHTML = `
      <p class="quiz-hint">Вопросы на понимание, а не на память формул. Некоторые — с графиками: смотри и думай, как всё работает.</p>
      <div class="quiz-scope-group">
        ${allBlock}
        ${catBlock}
        ${topicBlock}
      </div>
      <div class="quiz-count-row">
        <label for="quiz-count-select">Сколько вопросов:</label>
        <select id="quiz-count-select">
          <option value="5">5</option>
          <option value="10" selected>10</option>
          <option value="15">15</option>
          <option value="0">все</option>
        </select>
        <span class="quiz-hint-inline" id="quiz-avail"></span>
      </div>
    `;

    footer.innerHTML = `
      <button class="quiz-btn quiz-btn-primary" id="quiz-start">Начать</button>
    `;

    // Автофокус на количестве при выборе темы
    const topicSelect = body.querySelector('#quiz-topic-select');
    if (topicSelect) {
      topicSelect.addEventListener('focus', () => {
        const r = body.querySelector('input[value="topic"]');
        if (r) r.checked = true;
        updateAvailable();
      });
      topicSelect.addEventListener('change', updateAvailable);
    }
    body.querySelectorAll('input[name="quiz-scope"]').forEach((r) => {
      r.addEventListener('change', updateAvailable);
    });

    function updateAvailable() {
      const scope = readScope();
      const pool = scopePool(scope);
      body.querySelector('#quiz-avail').textContent = `Доступно: ${pool.length}`;
    }
    updateAvailable();

    footer.querySelector('#quiz-start').addEventListener('click', () => {
      const scope = readScope();
      const pool = scopePool(scope);
      if (pool.length === 0) return;
      const nRaw = parseInt(body.querySelector('#quiz-count-select').value, 10);
      const n = nRaw === 0 ? pool.length : Math.min(nRaw, pool.length);
      startRun(scope, shuffle(pool).slice(0, n));
    });
  }

  function readScope() {
    const root = document.getElementById('quiz-body');
    const checked = root.querySelector('input[name="quiz-scope"]:checked');
    if (!checked) return { type: 'all' };
    if (checked.value === 'all') return { type: 'all' };
    if (checked.value.startsWith('cat:')) return { type: 'category', id: checked.value.slice(4) };
    if (checked.value === 'topic') {
      const sel = root.querySelector('#quiz-topic-select');
      return { type: 'topic', id: sel ? sel.value : null };
    }
    return { type: 'all' };
  }
  function scopePool(scope) {
    if (scope.type === 'all') return poolAll();
    if (scope.type === 'category') return poolByCategory(scope.id);
    if (scope.type === 'topic') return poolByTopic(scope.id);
    return [];
  }
  function scopeLabel(scope) {
    if (scope.type === 'all') return 'Все темы';
    if (scope.type === 'category') return categoryName(scope.id);
    if (scope.type === 'topic') return topicTitle(scope.id);
    return '';
  }

  /* ---------- Прохождение ---------- */
  function startRun(scope, questions) {
    state = {
      scope,
      questions,
      idx: 0,
      answers: [],  // [{ q, selectedIdx, correct }]
    };
    renderQuestion();
  }

  function renderQuestion() {
    const s = state;
    const q = s.questions[s.idx];
    const body = document.getElementById('quiz-body');
    const footer = document.getElementById('quiz-footer');
    const crumb = document.getElementById('quiz-crumb');
    const title = document.getElementById('quiz-title');
    const bar = document.getElementById('quiz-progress-bar');

    crumb.textContent = `${scopeLabel(s.scope)} · ${topicTitle(q.topicId)}`;
    title.textContent = `Вопрос ${s.idx + 1} из ${s.questions.length}`;
    bar.style.width = `${(s.idx / s.questions.length) * 100}%`;

    // Перемешиваем варианты, но сохраняем соответствие
    const optsShuffled = shuffle(q.options.map((o, origIdx) => ({ ...o, origIdx })));

    body.innerHTML = `
      <div class="quiz-prompt">${q.prompt}</div>
      <div class="quiz-figure" id="quiz-figure"></div>
      <div class="quiz-options" id="quiz-options"></div>
      <div class="quiz-explain hidden" id="quiz-explain"></div>
    `;

    const fig = body.querySelector('#quiz-figure');
    if (q.figure) { fig.innerHTML = q.figure; }
    else if (typeof q.render === 'function') { q.render(fig); }
    else { fig.classList.add('hidden'); }

    const optsEl = body.querySelector('#quiz-options');
    let selectedIdx = -1;
    optsShuffled.forEach((o, i) => {
      const el = document.createElement('button');
      el.className = 'quiz-option';
      el.type = 'button';
      el.dataset.idx = i;
      el.innerHTML = `<span class="quiz-option-marker"></span><span class="quiz-option-text">${o.text}</span>`;
      el.addEventListener('click', () => {
        if (el.parentElement.dataset.locked === '1') return;
        optsEl.querySelectorAll('.quiz-option').forEach((x) => x.classList.remove('selected'));
        el.classList.add('selected');
        selectedIdx = i;
        checkBtn.disabled = false;
      });
      optsEl.appendChild(el);
    });

    footer.innerHTML = `
      <button class="quiz-btn quiz-btn-ghost" id="quiz-abort">Выйти</button>
      <button class="quiz-btn quiz-btn-primary" id="quiz-check" disabled>Проверить</button>
    `;
    const checkBtn = footer.querySelector('#quiz-check');
    footer.querySelector('#quiz-abort').addEventListener('click', () => {
      if (confirm('Прервать тест? Прогресс не сохранится.')) renderSelect();
    });
    checkBtn.addEventListener('click', () => {
      if (selectedIdx < 0) return;
      optsEl.dataset.locked = '1';
      const chosen = optsShuffled[selectedIdx];
      const correct = !!chosen.correct;
      optsEl.querySelectorAll('.quiz-option').forEach((el, i) => {
        const o = optsShuffled[i];
        if (o.correct) el.classList.add('correct');
        if (i === selectedIdx && !correct) el.classList.add('wrong');
      });
      // Пояснение: вариант-специфичное + общее
      const parts = [];
      if (chosen.explain) parts.push(`<div class="quiz-explain-opt">${chosen.explain}</div>`);
      if (q.explain) parts.push(`<div class="quiz-explain-general">${q.explain}</div>`);
      const exEl = body.querySelector('#quiz-explain');
      if (parts.length) {
        exEl.innerHTML = parts.join('');
        exEl.classList.remove('hidden');
      }
      s.answers.push({ q, selectedIdx: chosen.origIdx, correct });
      const last = s.idx === s.questions.length - 1;
      checkBtn.textContent = last ? 'Итоги' : 'Далее →';
      checkBtn.disabled = false;
      checkBtn.onclick = () => {
        if (last) renderResult();
        else { s.idx++; renderQuestion(); }
      };
    });

    // KaTeX если есть формулы
    if (window.renderMathInElement) {
      window.renderMathInElement(body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    }
  }

  function renderResult() {
    const s = state;
    const body = document.getElementById('quiz-body');
    const footer = document.getElementById('quiz-footer');
    const crumb = document.getElementById('quiz-crumb');
    const title = document.getElementById('quiz-title');
    const bar = document.getElementById('quiz-progress-bar');

    const score = s.answers.filter((a) => a.correct).length;
    const total = s.answers.length;
    const pct = Math.round((score / total) * 100);
    let verdict = 'Есть над чем поработать';
    if (pct >= 90) verdict = 'Почти идеально 🎯';
    else if (pct >= 70) verdict = 'Хорошо, но можно лучше';
    else if (pct >= 50) verdict = 'Неплохо — но есть пробелы';

    crumb.textContent = scopeLabel(s.scope);
    title.textContent = 'Результат';
    bar.style.width = '100%';

    const wrong = s.answers.filter((a) => !a.correct);
    const wrongList = wrong.length
      ? `<div class="quiz-wrong-list"><div class="quiz-wrong-title">Неверные ответы — посмотри темы ещё раз:</div>${
          wrong.map((a) => {
            const tid = a.q.topicId;
            const tt = topicTitle(tid);
            const promptText = (a.q.prompt || '').replace(/<[^>]+>/g, '').slice(0, 90);
            return `<div class="quiz-wrong-item">
              <div class="quiz-wrong-q">${escapeHtml(promptText)}${promptText.length >= 90 ? '…' : ''}</div>
              <a class="quiz-wrong-link" data-topic="${tid}">→ ${escapeHtml(tt)}</a>
            </div>`;
          }).join('')
        }</div>`
      : '<div class="quiz-all-correct">Все ответы верны 🎉</div>';

    body.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-score-big">${score} <span class="quiz-score-of">из ${total}</span></div>
        <div class="quiz-score-verdict">${verdict}</div>
        <div class="quiz-score-donut" aria-hidden="true">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" stroke-width="12"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="${pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444'}" stroke-width="12"
              stroke-dasharray="${(2 * Math.PI * 52).toFixed(1)}"
              stroke-dashoffset="${(2 * Math.PI * 52 * (1 - pct / 100)).toFixed(1)}"
              transform="rotate(-90 60 60)" stroke-linecap="round"/>
            <text x="60" y="66" text-anchor="middle" font-size="22" font-weight="700" fill="#0f172a">${pct}%</text>
          </svg>
        </div>
      </div>
      ${wrongList}
    `;
    body.querySelectorAll('.quiz-wrong-link').forEach((el) => {
      el.addEventListener('click', () => {
        const tid = el.dataset.topic;
        close();
        App.selectTopic(tid);
      });
    });

    footer.innerHTML = `
      <button class="quiz-btn quiz-btn-ghost" id="quiz-back">← Выбрать другой тест</button>
      <button class="quiz-btn quiz-btn-primary" id="quiz-retry">Пройти ещё раз</button>
    `;
    footer.querySelector('#quiz-back').addEventListener('click', renderSelect);
    footer.querySelector('#quiz-retry').addEventListener('click', () => {
      const pool = scopePool(s.scope);
      const n = s.questions.length;
      startRun(s.scope, shuffle(pool).slice(0, n));
    });
  }

  /* ---------- Кнопка в сайдбаре ---------- */
  function mountButton() {
    const btn = document.getElementById('quiz-btn');
    if (btn) btn.addEventListener('click', open);
  }

  /* ---------- ESC для закрытия ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const el = document.getElementById('quiz-overlay');
      if (el && !el.classList.contains('hidden')) close();
    }
  });

  /* ---------- Экспорт ---------- */
  App.registerQuiz = register;
  App.openQuiz = open;

  /* ---------- Общие SVG-хелперы для вопросов ---------- */
  App.QuizUtil = {
    // Scatter: pts = [{x, y, c}], c ∈ {'a','b','c','q'} (q — query/неизвестный)
    // bounds = {xMin, xMax, yMin, yMax}
    scatter(pts, bounds, opts = {}) {
      const W = opts.w || 320, H = opts.h || 240, PAD = 24;
      const x2px = (x) => PAD + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * (W - 2 * PAD);
      const y2px = (y) => H - PAD - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * (H - 2 * PAD);
      const colors = { a: '#6366f1', b: '#f59e0b', c: '#10b981', q: '#10b981' };
      const dots = pts.map((p) => {
        const cx = x2px(p.x), cy = y2px(p.y);
        if (p.c === 'q') {
          return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="9" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
                  <text x="${cx.toFixed(1)}" y="${(cy + 3.5).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">?</text>`;
        }
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${p.r || 6}" fill="${colors[p.c] || '#94a3b8'}" opacity="0.85"/>`;
      }).join('');
      const title = opts.title ? `<text x="${W/2}" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">${opts.title}</text>` : '';
      const extra = opts.extraSVG || '';
      return `<svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px;width:100%;">
        ${title}
        <rect x="${PAD-4}" y="${PAD-4}" width="${W-2*PAD+8}" height="${H-2*PAD+8}" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
        ${extra}
        ${dots}
      </svg>`;
    },
    // Confusion matrix 2x2
    confusion({ TP, FP, FN, TN, labels = ['Negative', 'Positive'], title }) {
      const t = title ? `<div class="qm-title">${title}</div>` : '';
      return `<div class="quiz-confusion">
        ${t}
        <table>
          <tr><th></th><th colspan="2">Предсказано</th></tr>
          <tr><th></th><th>${labels[0]}</th><th>${labels[1]}</th></tr>
          <tr><th>Факт ${labels[0]}</th><td class="qm-tn">${TN}</td><td class="qm-fp">${FP}</td></tr>
          <tr><th>Факт ${labels[1]}</th><td class="qm-fn">${FN}</td><td class="qm-tp">${TP}</td></tr>
        </table>
      </div>`;
    },
  };

  /* Привязываем кнопку после загрузки DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountButton);
  } else {
    mountButton();
  }
})();
