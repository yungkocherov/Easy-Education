/* ==========================================================================
   DBSCAN
   ========================================================================== */
App.registerTopic({
  id: 'dbscan',
  category: 'ml',
  title: 'DBSCAN',
  summary: 'Плотностная кластеризация — находит кластеры любой формы и шум.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь ночной город сверху. Видишь скопления огней — это жилые районы. Между ними — тёмные пустоши и случайные одинокие фонари вдоль дорог. Как определить «район»? Район — это <b>густое</b> скопление огней, отделённое пустотой от других скоплений.</p>
        <p>DBSCAN работает именно так. Он не знает заранее, сколько районов (кластеров) в городе. Он ищет области <b>высокой плотности</b> точек и говорит: «это район 1, это район 2, а эта точка — просто одинокий фонарь вдали — шум».</p>
        <p>Это принципиально другой подход, чем у K-Means. Там кластеры — круглые «горки» вокруг центров, и число кластеров задаётся заранее. У DBSCAN — любая форма, а количество определяется по данным.</p>
      </div>

      <h3>Что такое DBSCAN</h3>
      <p>DBSCAN = <b>D</b>ensity-<b>B</b>ased <b>S</b>patial <b>C</b>lustering of <b>A</b>pplications with <b>N</b>oise. «Плотностная кластеризация с шумом».</p>
      <p>Главные идеи:</p>
      <ul>
        <li><b>Кластер = область высокой плотности</b> точек.</li>
        <li>Разделены <b>областями низкой плотности</b>.</li>
        <li>Точки вне любого кластера — <b>шум</b>.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>DBSCAN не нужно знать число кластеров заранее — он сам их найдёт. Он может находить кластеры <b>любой формы</b> (не только круглые) и автоматически <b>выделяет шум</b>. Это делает его мощным инструментом, где K-Means бессилен.</p>
      </div>

      <h3>Два параметра</h3>
      <p>У DBSCAN всего два параметра, но их правильный выбор критически важен:</p>

      <ul>
        <li><b>eps (ε)</b> — радиус окрестности. «Насколько близко надо быть, чтобы считаться соседом».</li>
        <li><b>min_samples</b> — сколько соседей нужно, чтобы считать точку «плотной». Минимум точек в ε-окрестности.</li>
      </ul>

      <p>Эти параметры вместе определяют <b>порог плотности</b>: «плотная область» = место, где в радиусе ε есть как минимум min_samples точек.</p>

      <h3>Три типа точек</h3>
      <p>Алгоритм классифицирует каждую точку в один из трёх типов:</p>

      <h4>Core point (ядровая точка)</h4>
      <p>В её ε-окрестности <b>не меньше</b> min_samples точек (включая её). Это «сердцевина» кластера — плотная область.</p>

      <h4>Border point (граничная точка)</h4>
      <p>Сама не core (меньше соседей), но попадает в ε-окрестность какой-то core-точки. Это «край» кластера.</p>

      <h4>Noise point (шум)</h4>
      <p>Не core и не border. Изолированная точка. Это выброс или просто одиночка.</p>

      <h3>Алгоритм</h3>
      <ol>
        <li>Для каждой точки находим соседей в радиусе ε.</li>
        <li>Если соседей ≥ min_samples → она <b>core</b>. Создаём новый кластер (если она ещё не в кластере).</li>
        <li><b>Расширяем кластер:</b> все соседи core-точки добавляются в этот же кластер. Если новая точка — тоже core, её соседи тоже включаются. Идём рекурсивно, пока кластер не перестанет расти.</li>
        <li>Точки, не попавшие ни в один кластер — <b>шум</b>.</li>
      </ol>

      <p>Результат: каждая точка помечена как принадлежащая кластеру #1, #2, ..., или помечена как шум (−1).</p>

      <h3>Как выбрать параметры</h3>

      <h4>min_samples</h4>
      <p>Эвристика: <b>2 × размерность</b>. Для 2D данных — 4. Для 10D — 20.</p>
      <p>Большие значения → модель игнорирует мелкие кластеры, больше точек помечено шумом. Маленькие → чувствительнее, но может делить кластеры.</p>

      <h4>eps — через k-distance plot</h4>
      <p>Стандартный подход:</p>
      <ol>
        <li>Для каждой точки считаем расстояние до её k-го ближайшего соседа (k = min_samples).</li>
        <li>Сортируем эти расстояния по возрастанию.</li>
        <li>Рисуем график → ищем <b>«колено»</b> (резкий изгиб вверх).</li>
        <li>Значение в колене — хороший кандидат для ε.</li>
      </ol>

      <p>Идея: точки на «полке» графика — внутри кластеров (близкие соседи). Точки на «стене» — шум или граница. Колено разделяет их.</p>

      <h3>Сравнение с K-Means</h3>
      <table>
        <tr><th>Критерий</th><th>K-Means</th><th>DBSCAN</th></tr>
        <tr><td>Форма кластеров</td><td>Только сферические</td><td>Любая</td></tr>
        <tr><td>Число кластеров</td><td>Задаётся заранее</td><td>Определяется автоматически</td></tr>
        <tr><td>Обработка шума</td><td>Все точки в кластеры</td><td>Явно выделяет выбросы</td></tr>
        <tr><td>Разные размеры</td><td>Обычно нормально</td><td>Нормально</td></tr>
        <tr><td>Разная плотность</td><td>Нормально</td><td>Плохо</td></tr>
        <tr><td>Скорость</td><td>Очень быстро</td><td>Средне</td></tr>
      </table>

      <h3>Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Не нужно</b> знать число кластеров.</li>
        <li>Находит кластеры <b>любой формы</b>.</li>
        <li><b>Автоматически</b> выделяет шум.</li>
        <li>Устойчив к выбросам.</li>
        <li>Один проход по данным.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Плохо с разной плотностью</b> кластеров — один ε не подходит всем.</li>
        <li>Чувствителен к выбору ε.</li>
        <li><b>Не работает в высоких размерностях</b> (p > 20) из-за проклятия размерности.</li>
        <li>Граничные точки могут быть отнесены к разным кластерам (недетерминированность).</li>
      </ul>

      <h3>Применения</h3>
      <ul>
        <li><b>Geospatial</b> — кластеры такси, магазинов, пожаров.</li>
        <li><b>Anomaly detection</b> — точки, помеченные как шум.</li>
        <li><b>Сегментация изображений</b> — группировка похожих пикселей.</li>
        <li><b>Анализ логов</b> — группировка событий.</li>
        <li><b>Астрономия</b> — поиск звёздных скоплений.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«DBSCAN универсальный»</b> — плохо с разной плотностью и в высоких размерностях.</li>
        <li><b>«DBSCAN не требует настройки»</b> — всё равно нужно выбрать ε и min_samples.</li>
        <li><b>«Шум — это плохо»</b> — наоборот, способность его находить — фича DBSCAN.</li>
        <li><b>«DBSCAN детерминирован»</b> — почти да, но граничные точки могут попасть в разные кластеры в зависимости от порядка обхода.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: формальные определения</summary>
        <div class="deep-dive-body">
          <p>Теоретические концепции DBSCAN:</p>
          <ul>
            <li><b>ε-окрестность:</b> $N_\\epsilon(p) = \\{q : d(p, q) \\leq \\epsilon\\}$</li>
            <li><b>Direct density-reachable:</b> q напрямую достижима из p, если p core и $q \\in N_\\epsilon(p)$.</li>
            <li><b>Density-reachable:</b> есть цепочка $p_1, p_2, \\ldots, p_n$, где каждая следующая достижима напрямую.</li>
            <li><b>Density-connected:</b> p и q density-connected, если существует точка o, из которой достижимы и p, и q.</li>
          </ul>
          <p>Кластер — максимальный набор density-connected точек. Math красивая, реализация простая.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: HDBSCAN и OPTICS</summary>
        <div class="deep-dive-body">
          <p>Эволюция DBSCAN, решающая его проблемы:</p>
          <ul>
            <li><b>HDBSCAN</b> — иерархический DBSCAN, автоматически определяет кластеры разной плотности. Не требует ε! Нужно только min_samples.</li>
            <li><b>OPTICS</b> — создаёт упорядочивание точек, из которого можно извлечь кластеризацию для любого ε. Удобно для исследования.</li>
          </ul>
          <p>Оба доступны в sklearn. HDBSCAN часто работает лучше DBSCAN «из коробки».</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: сложность и масштабирование</summary>
        <div class="deep-dive-body">
          <p>Наивная реализация: O(n²) — для каждой точки ищем соседей среди всех.</p>
          <p>С пространственным индексом (KD-Tree, R-Tree, Ball Tree): <b>O(n log n)</b>.</p>
          <p>Память: O(n) — не хранит матрицу расстояний.</p>
          <p>Для очень больших данных существуют распределённые версии.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>K-Means</b> — альтернатива для сферических кластеров.</li>
        <li><b>Isolation Forest</b> — специализированный метод для anomaly detection.</li>
        <li><b>HDBSCAN</b> — современное улучшение DBSCAN.</li>
        <li><b>kNN</b> — DBSCAN использует k ближайших соседей внутри себя.</li>
        <li><b>t-SNE / UMAP</b> — часто применяются перед DBSCAN для визуализации.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: выбор параметров</h3>
      <div class="example-card">
        <p><b>Эвристика для min_samples</b>: 2 · dim (2D → min_samples=4).</p>
        <p><b>Эвристика для ε</b>: построить k-distance график (расстояние до k-го соседа, отсортировать). Искать «колено».</p>
      </div>

      <h3>Пример 2: разбор точек</h3>
      <div class="example-card">
        <p>min_samples=3, ε=1:</p>
        <ul>
          <li>Точка A в окрестности 5 точек → core.</li>
          <li>Точка B в окрестности 2 точек, но одна из них core A → border (принадлежит кластеру A).</li>
          <li>Точка C в окрестности 0 точек → noise.</li>
        </ul>
      </div>

      <h3>Пример 3: DBSCAN на двух лунах</h3>
      <div class="example-card">
        <p>K-Means проведёт прямую границу между лунами и разрежет их. DBSCAN найдёт обе луны, следуя форме плотности.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: DBSCAN в действии</h3>
        <p>Меняй eps и min_samples. Чёрные точки — шум.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dbs-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dbs-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="dbs-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="dbs-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dbs-controls');
        const cEps = App.makeControl('range', 'dbs-eps', 'eps', { min: 0.02, max: 0.25, step: 0.005, value: 0.07 });
        const cMin = App.makeControl('range', 'dbs-min', 'min_samples', { min: 2, max: 15, step: 1, value: 4 });
        const cShape = App.makeControl('select', 'dbs-shape', 'Форма', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'circles', label: 'Круги' }, { value: 'blobs', label: 'Кластеры' }, { value: 'spiral', label: 'Спирали' }],
          value: 'moons',
        });
        const cNoise = App.makeControl('range', 'dbs-noise', 'Шум', { min: 0, max: 50, step: 5, value: 15 });
        [cEps, cMin, cShape, cNoise].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#dbs-canvas');
        const ctx = canvas.getContext('2d');
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];
        let points = [];
        let labels = [];

        function genData() {
          const shape = cShape.input.value;
          const nn = +cNoise.input.value;
          points = [];
          if (shape === 'moons') {
            for (let i = 0; i < 100; i++) {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) points.push({ x: 0.3 + 0.2 * Math.cos(t) + App.Util.randn(0, 0.02), y: 0.4 + 0.2 * Math.sin(t) + App.Util.randn(0, 0.02) });
              else points.push({ x: 0.5 + 0.2 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.02), y: 0.5 - 0.2 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.02) });
            }
          } else if (shape === 'circles') {
            for (let i = 0; i < 100; i++) {
              const t = Math.random() * 2 * Math.PI;
              const r = Math.random() < 0.5 ? 0.15 : 0.35;
              points.push({ x: 0.5 + r * Math.cos(t) + App.Util.randn(0, 0.015), y: 0.5 + r * Math.sin(t) + App.Util.randn(0, 0.015) });
            }
          } else if (shape === 'blobs') {
            const centers = [[0.25, 0.3], [0.7, 0.35], [0.5, 0.75]];
            centers.forEach(c => { for (let i = 0; i < 40; i++) points.push({ x: c[0] + App.Util.randn(0, 0.05), y: c[1] + App.Util.randn(0, 0.05) }); });
          } else {
            for (let i = 0; i < 100; i++) {
              const t = i / 50 * 2 * Math.PI;
              const r = 0.05 + i / 250;
              if (i < 50) points.push({ x: 0.5 + r * Math.cos(t) + App.Util.randn(0, 0.015), y: 0.5 + r * Math.sin(t) + App.Util.randn(0, 0.015) });
              else points.push({ x: 0.5 - r * Math.cos(t) + App.Util.randn(0, 0.015), y: 0.5 - r * Math.sin(t) + App.Util.randn(0, 0.015) });
            }
          }
          for (let i = 0; i < nn; i++) points.push({ x: Math.random(), y: Math.random() });
          run();
        }

        function run() {
          const eps = +cEps.input.value, minS = +cMin.input.value;
          labels = new Array(points.length).fill(-1); // -1 = unvisited
          let cluster = 0;
          const UNCLASSIFIED = -1, NOISE = -2;
          for (let i = 0; i < points.length; i++) labels[i] = UNCLASSIFIED;

          function neighbors(i) {
            const out = [];
            for (let j = 0; j < points.length; j++) {
              const d = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2);
              if (d <= eps) out.push(j);
            }
            return out;
          }

          for (let i = 0; i < points.length; i++) {
            if (labels[i] !== UNCLASSIFIED) continue;
            const N = neighbors(i);
            if (N.length < minS) { labels[i] = NOISE; continue; }
            labels[i] = cluster;
            const queue = [...N];
            while (queue.length) {
              const q = queue.shift();
              if (labels[q] === NOISE) labels[q] = cluster;
              if (labels[q] !== UNCLASSIFIED) continue;
              labels[q] = cluster;
              const Nq = neighbors(q);
              if (Nq.length >= minS) Nq.forEach(x => { if (labels[x] === UNCLASSIFIED || labels[x] === NOISE) queue.push(x); });
            }
            cluster++;
          }
          draw();
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const eps = +cEps.input.value;
          // eps-радиусы для первых нескольких core-точек (для иллюстрации)
          ctx.strokeStyle = 'rgba(148,163,184,0.25)';
          ctx.lineWidth = 1;
          const shown = new Set();
          points.forEach((p, i) => {
            if (labels[i] >= 0 && shown.size < 5 && !shown.has(labels[i])) {
              shown.add(labels[i]);
              ctx.beginPath();
              ctx.arc(p.x * W, p.y * H, eps * W, 0, 2 * Math.PI);
              ctx.stroke();
            }
          });
          points.forEach((p, i) => {
            const lab = labels[i];
            ctx.fillStyle = lab === -2 ? '#0f172a' : colors[lab % colors.length];
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, lab === -2 ? 3 : 5, 0, 2 * Math.PI);
            ctx.fill();
            if (lab !== -2) ctx.stroke();
          });

          const nClusters = new Set(labels.filter(l => l >= 0)).size;
          const nNoise = labels.filter(l => l === -2).length;
          container.querySelector('#dbs-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Кластеров</div><div class="stat-value">${nClusters}</div></div>
            <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${points.length}</div></div>
            <div class="stat-card"><div class="stat-label">Шум</div><div class="stat-value">${nNoise}</div></div>
            <div class="stat-card"><div class="stat-label">eps</div><div class="stat-value">${eps.toFixed(3)}</div></div>
          `;
        }

        [cEps, cMin].forEach(c => c.input.addEventListener('input', run));
        [cShape, cNoise].forEach(c => c.input.addEventListener('change', genData));
        container.querySelector('#dbs-regen').onclick = genData;

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Geospatial</b> — кластеры такси, торговых точек.</li>
        <li><b>Anomaly detection</b> — точки, помеченные как шум.</li>
        <li><b>Сегментация изображений</b> — похожие пиксели.</li>
        <li><b>Микроархитектура</b> — группировка событий в логах.</li>
        <li><b>Астрономия</b> — поиск звёздных скоплений.</li>
        <li><b>Биология</b> — группировка экспрессии генов.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Не нужно знать число кластеров</li>
            <li>Находит кластеры любой формы</li>
            <li>Автоматически выделяет шум</li>
            <li>Устойчив к выбросам</li>
            <li>Один проход по данным</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Плохо работает при разной плотности кластеров</li>
            <li>Чувствителен к eps</li>
            <li>Не работает в высоких размерностях</li>
            <li>Требует выбора eps и min_samples</li>
            <li>Граничные точки могут быть в разных кластерах</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Определения</h3>
      <ul>
        <li><b>ε-окрестность</b>: $N_\\epsilon(p) = \\{q \\in D : d(p, q) \\leq \\epsilon\\}$</li>
        <li><b>Core point</b>: $|N_\\epsilon(p)| \\geq \\text{minPts}$</li>
        <li><b>Directly density-reachable</b>: q достижима из p напрямую, если p core и $q \\in N_\\epsilon(p)$.</li>
        <li><b>Density-reachable</b>: есть цепочка $p = p_1, p_2, \\dots, p_n = q$ из direct достижений.</li>
        <li><b>Density-connected</b>: существует o, из которого density-reachable и p, и q.</li>
      </ul>

      <h3>Формальное определение кластера</h3>
      <p>Кластер C ⊆ D удовлетворяет:</p>
      <ol>
        <li><b>Maximality</b>: если $p \\in C$ и q density-reachable из p, то $q \\in C$.</li>
        <li><b>Connectivity</b>: $\\forall p, q \\in C$, они density-connected.</li>
      </ol>

      <h3>Сложность</h3>
      <ul>
        <li>Наивно: $O(n^2)$.</li>
        <li>С KD-tree / R-tree: $O(n \\log n)$.</li>
      </ul>

      <h3>Выбор ε через k-distance plot</h3>
      <p>Для каждой точки найти расстояние до k-го ближайшего соседа (k = min_samples). Отсортировать. «Колено» графика — хорошее значение ε.</p>
    `,

    extra: `
      <h3>HDBSCAN — эволюция DBSCAN</h3>
      <p>Автоматически определяет разные плотности, не требует eps. Строит иерархию кластеров и выбирает стабильные.</p>

      <h3>OPTICS</h3>
      <p>Расширение DBSCAN: создаёт упорядочивание точек, из которого можно извлечь кластеризацию для любого ε.</p>

      <h3>Сравнение с K-Means</h3>
      <table>
        <tr><th></th><th>K-Means</th><th>DBSCAN</th></tr>
        <tr><td>Форма кластеров</td><td>Сферические</td><td>Любая</td></tr>
        <tr><td>Число кластеров</td><td>Задаётся</td><td>Определяется</td></tr>
        <tr><td>Шум</td><td>Все точки в кластерах</td><td>Явно выделяется</td></tr>
        <tr><td>Разные плотности</td><td>Нормально</td><td>Плохо</td></tr>
        <tr><td>Масштабируемость</td><td>Хорошая</td><td>Средняя</td></tr>
      </table>

      <h3>Настройка параметров</h3>
      <ul>
        <li>min_samples = 4 как дефолт для 2D.</li>
        <li>min_samples = 2·dim для высоких размерностей.</li>
        <li>ε выбирать по k-distance plot.</li>
        <li>Масштабировать признаки перед DBSCAN!</li>
      </ul>

      <h3>Границы применимости</h3>
      <ul>
        <li>Плохо при dim > 10-20 — проклятие размерности.</li>
        <li>Плохо при сильно разной плотности кластеров.</li>
        <li>Нужно искать компромиссный ε.</li>
      </ul>
    `,
  },
});
