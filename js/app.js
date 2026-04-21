/* ==========================================================================
   Easy Education — ядро приложения
   Топики регистрируются через App.registerTopic(obj)
   ========================================================================== */

const App = (function () {
  const topics = [];
  const categories = [
    { id: 'stats', name: 'Статистика' },
    { id: 'ab', name: 'Эксперименты и аналитика' },
    { id: 'ml-basics', name: 'Основы ML' },
    { id: 'ml-reg', name: 'Регрессия' },
    { id: 'ml-cls', name: 'Классификация' },
    { id: 'ml-unsup', name: 'Кластеризация и снижение размерности' },
    { id: 'dl', name: 'Нейронные сети' },
    { id: 'glossary', name: '📚 Глоссарий' },
  ];
  let currentTopicId = null;
  let currentTabKey = null;
  const activeCharts = []; // для destroy при смене темы

  /* ---------- API регистрации ---------- */
  function registerTopic(topic) {
    // topic: { id, title, category, summary, tabs: {theory, examples, simulation, applications, proscons, math, extra} }
    topics.push(topic);
  }

  /* ---------- Навигация ---------- */
  function renderNav(filter = '') {
    const nav = document.getElementById('nav');
    nav.innerHTML = '';
    const q = filter.trim().toLowerCase();

    categories.forEach((cat) => {
      const catTopics = topics.filter(
        (t) => t.category === cat.id && (!q || t.title.toLowerCase().includes(q))
      );
      if (catTopics.length === 0) return;

      const catEl = document.createElement('div');
      catEl.className = 'nav-category';
      catEl.textContent = cat.name;
      nav.appendChild(catEl);

      catTopics.forEach((t) => {
        const item = document.createElement('a');
        item.className = 'nav-item' + (t.id === currentTopicId ? ' active' : '');
        item.textContent = t.title;
        item.href = '#/topic/' + t.id;
        item.addEventListener('click', (e) => {
          e.preventDefault();
          selectTopic(t.id);
          closeDrawer();
        });
        nav.appendChild(item);
      });
    });
  }

  /* ---------- Выбор темы ---------- */
  function selectTopic(id, opts = {}) {
    const topic = topics.find((t) => t.id === id);
    if (!topic) return;
    destroyCharts();
    currentTopicId = id;
    currentTabKey = 'theory';
    currentSubTabIdx = 0;

    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('topic-view').classList.remove('hidden');

    const category = categories.find((c) => c.id === topic.category);
    document.getElementById('breadcrumb').textContent = category ? category.name : '';
    document.getElementById('topic-title').textContent = topic.title;
    document.getElementById('topic-summary').innerHTML = topic.summary || '';

    renderTabs(topic);
    renderNav(document.getElementById('search').value);

    try { localStorage.setItem('ee:lastTopic', id); } catch (e) {}
    if (!opts.fromHistory) {
      const newHash = '#/topic/' + id;
      if (location.hash !== newHash) {
        history.pushState({ topicId: id }, '', newHash);
      }
    }
    document.getElementById('content').scrollTop = 0;
  }

  /* ---------- Вкладки ---------- */
  const tabLabels = {
    theory: 'Теория',
    examples: 'Примеры',
    simulation: 'Симуляция',
    python: 'Python',
    applications: 'Применение',
    extra: 'Дополнительно',
    links: 'Ссылки',
  };

  function renderTabs(topic) {
    const tabsEl = document.getElementById('tabs');
    tabsEl.innerHTML = '';
    const keys = Object.keys(tabLabels).filter((k) => topic.tabs && topic.tabs[k]);
    if (!currentTabKey || !keys.includes(currentTabKey)) currentTabKey = keys[0];

    keys.forEach((k) => {
      const el = document.createElement('div');
      el.className = 'tab' + (k === currentTabKey ? ' active' : '');
      el.textContent = tabLabels[k];
      el.onclick = () => {
        currentTabKey = k;
        currentSubTabIdx = 0;
        renderTabs(topic);
      };
      tabsEl.appendChild(el);
    });

    renderTabContent(topic);
  }

  let currentSubTabIdx = 0;

  // Выполняет inline <script> теги внутри элемента.
  // innerHTML не запускает скрипты — приходится делать это вручную.
  function executeInlineScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      // Копируем атрибуты (src, type и т.д.)
      for (const attr of oldScript.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

  function renderTabContent(topic) {
    destroyCharts();
    const el = document.getElementById('tab-content');
    el.innerHTML = '';
    // Скроллим контент-область к началу при смене вкладки
    document.getElementById('content').scrollTop = 0;
    const tabData = topic.tabs[currentTabKey];
    const pane = document.createElement('div');
    pane.className = 'tab-pane';

    // Подвкладки: если tabData это массив — рендерим подвкладки
    if (Array.isArray(tabData)) {
      currentSubTabIdx = Math.max(0, Math.min(currentSubTabIdx, tabData.length - 1));
      const subtabsNav = document.createElement('div');
      subtabsNav.className = 'subtabs';
      tabData.forEach((st, i) => {
        const btn = document.createElement('div');
        btn.className = 'subtab' + (i === currentSubTabIdx ? ' active' : '');
        btn.textContent = st.title || `Пример ${i + 1}`;
        btn.onclick = () => { currentSubTabIdx = i; renderTabContent(topic); };
        subtabsNav.appendChild(btn);
      });
      pane.appendChild(subtabsNav);

      const body = document.createElement('div');
      body.className = 'subtab-content';
      const st = tabData[currentSubTabIdx];
      if (typeof st.content === 'string') {
        body.innerHTML = st.content;
      } else if (st.html) {
        body.innerHTML = st.html;
      }
      pane.appendChild(body);
      el.appendChild(pane);
      executeInlineScripts(body);
      if (st && typeof st.init === 'function') st.init(body);
    } else if (typeof tabData === 'string') {
      pane.innerHTML = tabData;
      el.appendChild(pane);
      executeInlineScripts(pane);
    } else if (typeof tabData === 'function') {
      el.appendChild(pane);
      tabData(pane);
    } else if (tabData && typeof tabData === 'object' && tabData.html) {
      pane.innerHTML = tabData.html;
      el.appendChild(pane);
      executeInlineScripts(pane);
      if (typeof tabData.init === 'function') tabData.init(pane);
    }

    renderPrevNext(topic, el);

    // KaTeX рендеринг
    if (window.renderMathInElement) {
      window.renderMathInElement(pane, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
        ],
        throwOnError: false,
      });
    }
  }

  /* ---------- Prev/Next навигация ---------- */
  function renderPrevNext(topic, container) {
    const sameCat = topics.filter((t) => t.category === topic.category);
    const idx = sameCat.findIndex((t) => t.id === topic.id);
    const prev = idx > 0 ? sameCat[idx - 1] : null;
    const next = idx >= 0 && idx < sameCat.length - 1 ? sameCat[idx + 1] : null;
    if (!prev && !next) return;

    const nav = document.createElement('div');
    nav.className = 'topic-prevnext';

    if (prev) {
      const a = document.createElement('a');
      a.className = 'prevnext-btn prev';
      a.href = '#/topic/' + prev.id;
      a.innerHTML = '<span class="prevnext-label">← Предыдущая</span><span class="prevnext-title">' + escapeHtml(prev.title) + '</span>';
      a.addEventListener('click', (e) => { e.preventDefault(); selectTopic(prev.id); });
      nav.appendChild(a);
    } else {
      nav.appendChild(document.createElement('span'));
    }

    if (next) {
      const a = document.createElement('a');
      a.className = 'prevnext-btn next';
      a.href = '#/topic/' + next.id;
      a.innerHTML = '<span class="prevnext-label">Следующая →</span><span class="prevnext-title">' + escapeHtml(next.title) + '</span>';
      a.addEventListener('click', (e) => { e.preventDefault(); selectTopic(next.id); });
      nav.appendChild(a);
    }

    container.appendChild(nav);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---------- Мобильный drawer ---------- */
  function toggleDrawer() {
    document.getElementById('sidebar').classList.toggle('open');
    document.body.classList.toggle('drawer-open');
  }
  function closeDrawer() {
    document.getElementById('sidebar').classList.remove('open');
    document.body.classList.remove('drawer-open');
  }

  /* ---------- Управление графиками ---------- */
  function registerChart(chart) { activeCharts.push(chart); }
  function destroyCharts() {
    while (activeCharts.length) {
      const c = activeCharts.pop();
      try { c.destroy(); } catch (e) {}
    }
  }

  /* ---------- Утилиты (доступны в топиках) ---------- */
  const Util = {
    // Линейное пространство
    linspace(a, b, n) {
      const arr = new Array(n);
      const step = (b - a) / (n - 1);
      for (let i = 0; i < n; i++) arr[i] = a + step * i;
      return arr;
    },
    // Случайное из нормального распределения (Box-Muller)
    randn(mu = 0, sigma = 1) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return mu + sigma * z;
    },
    // Генерация выборки из нормального
    normalSample(n, mu = 0, sigma = 1) {
      const s = new Array(n);
      for (let i = 0; i < n; i++) s[i] = Util.randn(mu, sigma);
      return s;
    },
    // Униформное
    uniformSample(n, a = 0, b = 1) {
      const s = new Array(n);
      for (let i = 0; i < n; i++) s[i] = a + (b - a) * Math.random();
      return s;
    },
    // Экспоненциальное
    expSample(n, lambda = 1) {
      const s = new Array(n);
      for (let i = 0; i < n; i++) s[i] = -Math.log(1 - Math.random()) / lambda;
      return s;
    },
    // Биномиальное
    binomialSample(n, trials = 10, p = 0.5) {
      const s = new Array(n);
      for (let i = 0; i < n; i++) {
        let k = 0;
        for (let j = 0; j < trials; j++) if (Math.random() < p) k++;
        s[i] = k;
      }
      return s;
    },
    // Пуассон
    poissonSample(n, lambda = 3) {
      const s = new Array(n);
      for (let i = 0; i < n; i++) {
        const L = Math.exp(-lambda);
        let k = 0, p = 1;
        do { k++; p *= Math.random(); } while (p > L);
        s[i] = k - 1;
      }
      return s;
    },
    mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; },
    variance(arr, sample = true) {
      const m = Util.mean(arr);
      const sq = arr.reduce((s, x) => s + (x - m) * (x - m), 0);
      return sq / (sample ? arr.length - 1 : arr.length);
    },
    std(arr, sample = true) { return Math.sqrt(Util.variance(arr, sample)); },
    median(arr) {
      const s = [...arr].sort((a, b) => a - b);
      const n = s.length;
      return n % 2 === 0 ? (s[n / 2 - 1] + s[n / 2]) / 2 : s[(n - 1) / 2];
    },
    quantile(arr, q) {
      const s = [...arr].sort((a, b) => a - b);
      const pos = (s.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      return s[base + 1] !== undefined ? s[base] + rest * (s[base + 1] - s[base]) : s[base];
    },
    min(arr) { return Math.min(...arr); },
    max(arr) { return Math.max(...arr); },
    // Гистограмма
    histogram(arr, bins = 20, range) {
      const lo = range ? range[0] : Util.min(arr);
      const hi = range ? range[1] : Util.max(arr);
      const width = (hi - lo) / bins;
      const counts = new Array(bins).fill(0);
      const centers = new Array(bins);
      for (let i = 0; i < bins; i++) centers[i] = lo + width * (i + 0.5);
      for (const x of arr) {
        let idx = Math.floor((x - lo) / width);
        if (idx === bins) idx = bins - 1;
        if (idx >= 0 && idx < bins) counts[idx]++;
      }
      return { centers, counts, width };
    },
    // Округление до n знаков
    round(x, d = 3) { const k = Math.pow(10, d); return Math.round(x * k) / k; },
    // Shuffle
    shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    // Нормальное PDF
    normalPDF(x, mu = 0, sigma = 1) {
      return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
    },

    /* ---------- Генераторы SVG path для распределений ---------- */
    // Возвращает path для замкнутой области под нормальной кривой.
    // cx — пиксельная координата центра (μ)
    // baselineY — y оси
    // peakY — y верхушки кривой (peakY < baselineY)
    // halfWidth — пикселей на ±sigmaUnits сигм
    normalAreaPath(cx, baselineY, peakY, halfWidth, sigmaUnits = 3, n = 120) {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const t = -sigmaUnits + (2 * sigmaUnits * i) / n;
        const x = cx + (t / sigmaUnits) * halfWidth;
        const pdf = Math.exp(-0.5 * t * t);
        const y = baselineY - pdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${baselineY}`;
      for (const [x, y] of pts) d += ` L${x},${y}`;
      d += ` L${pts[pts.length - 1][0]},${baselineY} Z`;
      return d;
    },

    // Открытая полилиния (только контур, без заливки)
    normalOutlinePath(cx, baselineY, peakY, halfWidth, sigmaUnits = 3, n = 120) {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const t = -sigmaUnits + (2 * sigmaUnits * i) / n;
        const x = cx + (t / sigmaUnits) * halfWidth;
        const pdf = Math.exp(-0.5 * t * t);
        const y = baselineY - pdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
      return d;
    },

    // Сегмент площади между [lo, hi] (в σ единицах)
    normalSegmentPath(cx, baselineY, peakY, halfWidth, lo, hi, sigmaUnits = 3, n = 80) {
      const aLo = Math.max(lo, -sigmaUnits);
      const aHi = Math.min(hi, sigmaUnits);
      const xLo = cx + (aLo / sigmaUnits) * halfWidth;
      const xHi = cx + (aHi / sigmaUnits) * halfWidth;
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const t = aLo + ((aHi - aLo) * i) / n;
        const x = cx + (t / sigmaUnits) * halfWidth;
        const pdf = Math.exp(-0.5 * t * t);
        const y = baselineY - pdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${Math.round(xLo * 10) / 10},${baselineY}`;
      for (const [x, y] of pts) d += ` L${x},${y}`;
      d += ` L${Math.round(xHi * 10) / 10},${baselineY} Z`;
      return d;
    },

    // Экспоненциальное распределение PDF: f(x) = λe^(-λx)
    // x0 — пиксельная координата x = 0
    // length — пикселей на 6/λ единиц по оси x (покрывает 99.75%)
    exponentialPath(x0, baselineY, peakY, length, lambda = 1, n = 120) {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const xData = (6 * i) / n;
        const x = x0 + (xData / 6) * length;
        const pdf = Math.exp(-lambda * xData);
        const y = baselineY - pdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${baselineY}`;
      for (const [x, y] of pts) d += ` L${x},${y}`;
      d += ` L${pts[pts.length - 1][0]},${baselineY} Z`;
      return d;
    },

    exponentialOutline(x0, baselineY, peakY, length, lambda = 1, n = 120) {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const xData = (6 * i) / n;
        const x = x0 + (xData / 6) * length;
        const pdf = Math.exp(-lambda * xData);
        const y = baselineY - pdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
      return d;
    },

    // Log-normal PDF — гладкая правосторонне скошенная кривая.
    // x0 — пиксель, соответствующий x=0 (начало оси)
    // x1 — правый край
    // mu, sigma — параметры log-normal (не средние!)
    // Мода = exp(mu - sigma^2), пик нормализуется до peakY.
    logNormalOutline(x0, x1, baselineY, peakY, mu, sigma, xMax, n = 200) {
      const mode = Math.exp(mu - sigma * sigma);
      const peakPdf = (1 / (mode * sigma * Math.sqrt(2 * Math.PI))) *
                       Math.exp(-Math.pow(Math.log(mode) - mu, 2) / (2 * sigma * sigma));
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const xData = (xMax * i) / n;
        const x = x0 + ((x1 - x0) * i) / n;
        if (xData <= 0.001) { pts.push([Math.round(x), baselineY]); continue; }
        const pdf = (1 / (xData * sigma * Math.sqrt(2 * Math.PI))) *
                     Math.exp(-Math.pow(Math.log(xData) - mu, 2) / (2 * sigma * sigma));
        const normPdf = Math.min(1, pdf / peakPdf);
        const y = baselineY - normPdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
      return d;
    },

    logNormalArea(x0, x1, baselineY, peakY, mu, sigma, xMax, n = 200) {
      const mode = Math.exp(mu - sigma * sigma);
      const peakPdf = (1 / (mode * sigma * Math.sqrt(2 * Math.PI))) *
                       Math.exp(-Math.pow(Math.log(mode) - mu, 2) / (2 * sigma * sigma));
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const xData = (xMax * i) / n;
        const x = x0 + ((x1 - x0) * i) / n;
        if (xData <= 0.001) { pts.push([Math.round(x), baselineY]); continue; }
        const pdf = (1 / (xData * sigma * Math.sqrt(2 * Math.PI))) *
                     Math.exp(-Math.pow(Math.log(xData) - mu, 2) / (2 * sigma * sigma));
        const normPdf = Math.min(1, pdf / peakPdf);
        const y = baselineY - normPdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${baselineY}`;
      for (const [x, y] of pts) d += ` L${x},${y}`;
      d += ` L${pts[pts.length - 1][0]},${baselineY} Z`;
      return d;
    },

    // Утилита: вставить path в SVG с указанным id (внутри container)
    setPath(container, id, d) {
      const el = container.querySelector(`#${id}`);
      if (el) el.setAttribute('d', d);
    },

    // Student's t PDF (unnormalised for plotting).
    // f(t; ν) = (1 + t²/ν)^(−(ν+1)/2)
    // Возвращает открытую полилинию
    tDistOutline(cx, baselineY, peakY, halfWidth, df = 5, sigmaUnits = 4, n = 150) {
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const t = -sigmaUnits + (2 * sigmaUnits * i) / n;
        const x = cx + (t / sigmaUnits) * halfWidth;
        const pdf = Math.pow(1 + (t * t) / df, -(df + 1) / 2);
        const y = baselineY - pdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
      return d;
    },

    // Beta distribution PDF (unnormalised, scaled so peak at mode = 1)
    // Используется для байесовских постериоров: Beta(α, β)
    // x0..x1 — пиксельный диапазон для [0, 1]
    betaOutline(x0, x1, baselineY, peakY, alpha, beta, n = 200) {
      // Find the mode to normalise peak height
      let mode = (alpha - 1) / (alpha + beta - 2);
      if (alpha < 1 || beta < 1) mode = 0.5;
      mode = Math.max(0.001, Math.min(0.999, mode));
      const peakPdf = Math.pow(mode, alpha - 1) * Math.pow(1 - mode, beta - 1);
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const u = i / n;  // parameter in [0, 1]
        // Skip pathological endpoints
        const uu = Math.max(0.0001, Math.min(0.9999, u));
        const pdf = Math.pow(uu, alpha - 1) * Math.pow(1 - uu, beta - 1);
        const normPdf = Math.min(1, pdf / peakPdf);
        const x = x0 + (x1 - x0) * u;
        const y = baselineY - normPdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
      return d;
    },

    betaAreaPath(x0, x1, baselineY, peakY, alpha, beta, n = 200) {
      let mode = (alpha - 1) / (alpha + beta - 2);
      if (alpha < 1 || beta < 1) mode = 0.5;
      mode = Math.max(0.001, Math.min(0.999, mode));
      const peakPdf = Math.pow(mode, alpha - 1) * Math.pow(1 - mode, beta - 1);
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const uu = Math.max(0.0001, Math.min(0.9999, u));
        const pdf = Math.pow(uu, alpha - 1) * Math.pow(1 - uu, beta - 1);
        const normPdf = Math.min(1, pdf / peakPdf);
        const x = x0 + (x1 - x0) * u;
        const y = baselineY - normPdf * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${baselineY}`;
      for (const [x, y] of pts) d += ` L${x},${y}`;
      d += ` L${pts[pts.length - 1][0]},${baselineY} Z`;
      return d;
    },

    // Chi-square PDF (unnormalised, peak at mode = 1)
    // f(x; k) = x^(k/2 - 1) * exp(-x/2)
    // xMax — максимум по оси x (в единицах распределения)
    chiSquareOutline(x0, x1, baselineY, peakY, k, xMax = 15, n = 200) {
      // Mode is at (k-2) for k >= 2, else 0
      const mode = Math.max(0.01, k - 2);
      const peakPdf = Math.pow(mode, k / 2 - 1) * Math.exp(-mode / 2);
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const xData = (xMax * i) / n;
        const x = x0 + ((x1 - x0) * i) / n;
        // Avoid x^0 issues; at xData=0 and k=2, f=0.5
        const xx = Math.max(0.001, xData);
        const pdf = Math.pow(xx, k / 2 - 1) * Math.exp(-xx / 2);
        const normPdf = Math.min(1.05, pdf / peakPdf);
        const y = baselineY - Math.max(0, normPdf) * (baselineY - peakY);
        pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
      }
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) d += ` L${pts[i][0]},${pts[i][1]}`;
      return d;
    },
    // Нормальное CDF (приближение)
    normalCDF(x, mu = 0, sigma = 1) {
      const z = (x - mu) / (sigma * Math.sqrt(2));
      // erf approximation (Abramowitz & Stegun)
      const t = 1 / (1 + 0.3275911 * Math.abs(z));
      const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
      const erf = z >= 0 ? y : -y;
      return 0.5 * (1 + erf);
    },
  };

  /* ---------- Построение контрола симуляции ---------- */
  function makeControl(type, id, label, opts = {}) {
    // type: 'range', 'number', 'select'
    const wrap = document.createElement('div');
    wrap.className = 'sim-control';
    const lab = document.createElement('label');
    lab.htmlFor = id;
    const labTxt = document.createElement('span');
    labTxt.textContent = label;
    const labVal = document.createElement('span');
    labVal.className = 'value-display';
    lab.appendChild(labTxt);
    lab.appendChild(labVal);

    let input;
    if (type === 'select') {
      input = document.createElement('select');
      (opts.options || []).forEach((o) => {
        const oe = document.createElement('option');
        oe.value = o.value;
        oe.textContent = o.label;
        input.appendChild(oe);
      });
      if (opts.value !== undefined) input.value = opts.value;
      labVal.textContent = '';
    } else {
      input = document.createElement('input');
      input.type = type;
      if (opts.min !== undefined) input.min = opts.min;
      if (opts.max !== undefined) input.max = opts.max;
      if (opts.step !== undefined) input.step = opts.step;
      if (opts.value !== undefined) input.value = opts.value;
      labVal.textContent = opts.value !== undefined ? opts.value : '';
      if (type === 'range') {
        input.addEventListener('input', () => { labVal.textContent = input.value; });
      }
    }
    input.id = id;
    wrap.appendChild(lab);
    wrap.appendChild(input);
    return { wrap, input };
  }

  /* ---------- Init ---------- */
  function goHome(opts = {}) {
    destroyCharts();
    currentTopicId = null;
    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('topic-view').classList.add('hidden');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById('content').scrollTop = 0;
    closeDrawer();
    if (!opts.fromHistory && location.hash && location.hash !== '#/') {
      history.pushState({}, '', '#/');
    }
  }

  function parseHash() {
    const h = location.hash || '';
    const m = h.match(/^#\/topic\/([a-z0-9-]+)/i);
    return m ? m[1] : null;
  }

  function routeFromHash(fromHistory) {
    const id = parseHash();
    if (id && topics.find((t) => t.id === id)) {
      selectTopic(id, { fromHistory: true });
    } else {
      goHome({ fromHistory: true });
    }
  }

  function init() {
    renderNav();
    const countEl = document.getElementById('topic-count');
    if (countEl) countEl.textContent = topics.length;

    let searchTimer = null;
    document.getElementById('search').addEventListener('input', (e) => {
      const val = e.target.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => renderNav(val), 120);
    });

    const brand = document.getElementById('brand');
    brand.addEventListener('click', () => goHome());
    brand.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }
    });

    const burger = document.getElementById('burger');
    if (burger) burger.addEventListener('click', toggleDrawer);
    const scrim = document.getElementById('scrim');
    if (scrim) scrim.addEventListener('click', closeDrawer);

    window.addEventListener('popstate', () => routeFromHash(true));

    if (parseHash()) {
      routeFromHash(true);
    } else {
      renderResumeBanner();
    }
  }

  function renderResumeBanner() {
    let lastId = null;
    try { lastId = localStorage.getItem('ee:lastTopic'); } catch (e) {}
    if (!lastId) return;
    const topic = topics.find((t) => t.id === lastId);
    if (!topic) return;
    const welcome = document.getElementById('welcome');
    if (!welcome || document.getElementById('resume-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'resume-banner';
    banner.className = 'resume-banner';
    banner.innerHTML = '<span>📖 Продолжить: <b></b></span>';
    banner.querySelector('b').textContent = topic.title;
    const btn = document.createElement('a');
    btn.className = 'resume-btn';
    btn.textContent = 'Открыть →';
    btn.href = '#/topic/' + topic.id;
    btn.addEventListener('click', (e) => { e.preventDefault(); selectTopic(topic.id); });
    banner.appendChild(btn);
    const close = document.createElement('button');
    close.className = 'resume-close';
    close.setAttribute('aria-label', 'Закрыть');
    close.textContent = '×';
    close.addEventListener('click', () => {
      banner.remove();
      try { localStorage.removeItem('ee:lastTopic'); } catch (e) {}
    });
    banner.appendChild(close);
    welcome.insertBefore(banner, welcome.firstChild);
  }

  return {
    init,
    registerTopic,
    selectTopic,
    registerChart,
    destroyCharts,
    Util,
    makeControl,
  };
})();
