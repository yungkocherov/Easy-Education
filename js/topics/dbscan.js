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
      <h3>Идея</h3>
      <p>Density-Based Spatial Clustering of Applications with Noise. Кластер — это область высокой плотности, отделённая областью низкой плотности. Всё остальное — шум.</p>

      <h3>Два параметра</h3>
      <ul>
        <li><b>eps (ε)</b> — радиус окрестности.</li>
        <li><b>min_samples</b> — минимум точек в окрестности, чтобы считать её плотной.</li>
      </ul>

      <h3>Типы точек</h3>
      <ul>
        <li><b>Core point</b> — в её ε-окрестности ≥ min_samples точек.</li>
        <li><b>Border point</b> — не core, но лежит в ε-окрестности core.</li>
        <li><b>Noise point</b> — не core и не border.</li>
      </ul>

      <h3>Алгоритм</h3>
      <ol>
        <li>Для каждой точки найти соседей в радиусе ε.</li>
        <li>Если соседей ≥ min_samples → это core point, запускаем новый кластер.</li>
        <li>Расширяем кластер: все точки в ε-окрестности core добавляем в кластер. Если новая точка — тоже core, продолжаем рекурсивно.</li>
        <li>Точки, не попавшие ни в один кластер — шум.</li>
      </ol>

      <div class="callout tip">💡 DBSCAN не нужно знать число кластеров! Он сам определит их по плотности.</div>

      <h3>Когда DBSCAN лучше K-Means</h3>
      <ul>
        <li>Кластеры сложной формы (не сферические).</li>
        <li>Есть шум и выбросы.</li>
        <li>Неизвестно количество кластеров.</li>
        <li>Кластеры разного размера.</li>
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
