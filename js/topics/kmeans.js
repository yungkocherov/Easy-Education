/* ==========================================================================
   K-Means
   ========================================================================== */
App.registerTopic({
  id: 'kmeans',
  category: 'ml',
  title: 'K-Means кластеризация',
  summary: 'Разбивает данные на k кластеров итеративным перемещением центроидов.',

  tabs: {
    theory: `
      <h3>Задача</h3>
      <p>Дано облако точек. Разделить их на k групп так, чтобы точки внутри одной группы были похожи, а между группами — разные. Без разметки (unsupervised).</p>

      <h3>Алгоритм Ллойда</h3>
      <ol>
        <li>Выбрать k случайных центров (центроидов).</li>
        <li><b>Assign:</b> отнести каждую точку к ближайшему центру.</li>
        <li><b>Update:</b> пересчитать центр как среднее точек в кластере.</li>
        <li>Повторять 2-3, пока центры не перестанут меняться.</li>
      </ol>

      <h3>Что минимизирует</h3>
      <div class="math-block">$$J = \\sum_{i=1}^{n} \\|x_i - \\mu_{c(i)}\\|^2$$</div>
      <p>Сумму квадратов расстояний от точек до их центроидов (<b>inertia</b>, WCSS).</p>

      <h3>Как выбрать k</h3>
      <ul>
        <li><b>Elbow method</b> — строим inertia от k, ищем «локоть» на кривой.</li>
        <li><b>Silhouette score</b> — мера, насколько точка ближе к своему кластеру, чем к чужому.</li>
        <li><b>Gap statistic</b> — сравнение с случайными данными.</li>
      </ul>

      <div class="callout warn">⚠️ K-Means ищет <b>сферические</b> кластеры примерно одного размера. Для кластеров сложной формы используй DBSCAN или GMM.</div>
    `,

    examples: `
      <h3>Пример 1: одна итерация</h3>
      <div class="example-card">
        <div class="example-data">Точки: (1,1), (2,1), (4,3), (5,4)
Начальные центры: μ₁=(1,1), μ₂=(5,5)</div>
        <p><b>Assign:</b></p>
        <ul>
          <li>(1,1): ближе к μ₁ → кластер 1</li>
          <li>(2,1): ближе к μ₁ → кластер 1</li>
          <li>(4,3): ближе к μ₂ → кластер 2</li>
          <li>(5,4): ближе к μ₂ → кластер 2</li>
        </ul>
        <p><b>Update:</b></p>
        <ul>
          <li>μ₁ = среднее (1,1) и (2,1) = (1.5, 1)</li>
          <li>μ₂ = среднее (4,3) и (5,4) = (4.5, 3.5)</li>
        </ul>
        <p>Центры сдвинулись → следующая итерация.</p>
      </div>

      <h3>Пример 2: K-Means++ инициализация</h3>
      <div class="example-card">
        <p>Плохая случайная инициализация может привести к плохому локальному минимуму. K-Means++:</p>
        <ol>
          <li>Первый центр — случайная точка.</li>
          <li>Следующий центр — с вероятностью, пропорциональной квадрату расстояния до ближайшего уже выбранного центра.</li>
          <li>Так центры получаются «далеко друг от друга».</li>
        </ol>
        <p>Это стандартная инициализация в sklearn.</p>
      </div>

      <h3>Пример 3: elbow method</h3>
      <div class="example-card">
        <p>Считаем inertia для k = 1, 2, 3, ..., 10. Получаем убывающую кривую.</p>
        <p>«Локоть» — точка резкого замедления убывания. Обычно именно в ней оптимальный k.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: шаги K-Means</h3>
        <p>Нажимай "Шаг" и смотри, как центроиды двигаются. Меняй k и перегенерируй.</p>
        <div class="sim-container">
          <div class="sim-controls" id="km-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="km-step">▶ Шаг</button>
            <button class="btn" id="km-run">⏩ До сходимости</button>
            <button class="btn secondary" id="km-reset">↺ Сбросить центры</button>
            <button class="btn secondary" id="km-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="km-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="km-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#km-controls');
        const cK = App.makeControl('range', 'km-k', 'k (кластеров)', { min: 2, max: 8, step: 1, value: 3 });
        const cNclusters = App.makeControl('range', 'km-nc', 'Истинных кластеров', { min: 2, max: 6, step: 1, value: 3 });
        const cN = App.makeControl('range', 'km-n', 'Точек на кластер', { min: 20, max: 100, step: 5, value: 40 });
        const cSpread = App.makeControl('range', 'km-spread', 'Разброс', { min: 0.02, max: 0.15, step: 0.01, value: 0.07 });
        [cK, cNclusters, cN, cSpread].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#km-canvas');
        const ctx = canvas.getContext('2d');
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
        let points = [];
        let centroids = [];
        let iter = 0;

        function regen() {
          const nc = +cNclusters.input.value;
          const nPer = +cN.input.value;
          const spread = +cSpread.input.value;
          points = [];
          const centers = [];
          for (let c = 0; c < nc; c++) {
            centers.push([0.2 + 0.6 * Math.random(), 0.2 + 0.6 * Math.random()]);
          }
          centers.forEach(ctr => {
            for (let i = 0; i < nPer; i++) {
              points.push({ x: ctr[0] + App.Util.randn(0, spread), y: ctr[1] + App.Util.randn(0, spread), cls: -1 });
            }
          });
          resetCentroids();
        }

        function resetCentroids() {
          const k = +cK.input.value;
          centroids = [];
          // K-Means++
          centroids.push({ ...points[Math.floor(Math.random() * points.length)] });
          for (let c = 1; c < k; c++) {
            const dists = points.map(p => {
              let m = Infinity;
              centroids.forEach(ctr => {
                const d = (p.x - ctr.x) ** 2 + (p.y - ctr.y) ** 2;
                if (d < m) m = d;
              });
              return m;
            });
            const sum = dists.reduce((a, b) => a + b, 0);
            let r = Math.random() * sum;
            for (let i = 0; i < dists.length; i++) {
              r -= dists[i];
              if (r <= 0) { centroids.push({ x: points[i].x, y: points[i].y }); break; }
            }
          }
          iter = 0;
          assign();
          draw();
        }

        function assign() {
          points.forEach(p => {
            let best = 0, bestD = Infinity;
            centroids.forEach((c, i) => {
              const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
              if (d < bestD) { bestD = d; best = i; }
            });
            p.cls = best;
          });
        }

        function update() {
          let moved = 0;
          centroids.forEach((c, i) => {
            const cluster = points.filter(p => p.cls === i);
            if (cluster.length === 0) return;
            const nx = App.Util.mean(cluster.map(p => p.x));
            const ny = App.Util.mean(cluster.map(p => p.y));
            moved += Math.abs(nx - c.x) + Math.abs(ny - c.y);
            c.x = nx; c.y = ny;
          });
          return moved;
        }

        function step() {
          update();
          assign();
          iter++;
          draw();
        }

        function runToConverge() {
          for (let i = 0; i < 50; i++) {
            const m = update();
            assign();
            iter++;
            if (m < 1e-5) break;
          }
          draw();
        }

        function computeInertia() {
          let sum = 0;
          points.forEach(p => {
            const c = centroids[p.cls];
            sum += (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
          });
          return sum;
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          // фон — заливка по центрам (Voronoi-like)
          const step = 10;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              let best = 0, bestD = Infinity;
              centroids.forEach((c, i) => {
                const d = (px / W - c.x) ** 2 + (py / H - c.y) ** 2;
                if (d < bestD) { bestD = d; best = i; }
              });
              ctx.fillStyle = colors[best] + '22';
              ctx.fillRect(px, py, step, step);
            }
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = colors[p.cls] || '#94a3b8';
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 3.5, 0, 2 * Math.PI);
            ctx.fill();
          });
          // центроиды
          centroids.forEach((c, i) => {
            ctx.fillStyle = colors[i];
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(c.x * W, c.y * H, 11, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i + 1, c.x * W, c.y * H);
          });

          container.querySelector('#km-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Итераций</div><div class="stat-value">${iter}</div></div>
            <div class="stat-card"><div class="stat-label">k</div><div class="stat-value">${centroids.length}</div></div>
            <div class="stat-card"><div class="stat-label">Inertia</div><div class="stat-value">${App.Util.round(computeInertia(), 3)}</div></div>
            <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${points.length}</div></div>
          `;
        }

        cK.input.addEventListener('input', resetCentroids);
        [cNclusters, cN, cSpread].forEach(c => c.input.addEventListener('change', regen));
        container.querySelector('#km-step').onclick = step;
        container.querySelector('#km-run').onclick = runToConverge;
        container.querySelector('#km-reset').onclick = resetCentroids;
        container.querySelector('#km-regen').onclick = regen;

        setTimeout(() => { regen(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Сегментация клиентов</b> — RFM-анализ, маркетинг.</li>
        <li><b>Сжатие изображений</b> — квантизация цветов.</li>
        <li><b>Анализ документов</b> — тематическая группировка.</li>
        <li><b>Anomaly detection</b> — точки далеко от всех центроидов.</li>
        <li><b>Preprocessing</b> — кластер-фичи как признаки для supervised.</li>
        <li><b>Vector quantization</b> — в speech и image processing.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Простой и быстрый O(n·k·d·T)</li>
            <li>Масштабируется на большие данные</li>
            <li>Хорошо работает на сферических кластерах</li>
            <li>Интерпретируемые центроиды</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Нужно знать k заранее</li>
            <li>Чувствителен к инициализации</li>
            <li>Плохо для некруглых кластеров</li>
            <li>Чувствителен к выбросам и масштабу</li>
            <li>Кластеры должны быть похожего размера</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Оптимизация</h3>
      <p>Минимизируем:</p>
      <div class="math-block">$$J(C, \\mu) = \\sum_{i=1}^{n} \\|x_i - \\mu_{c(i)}\\|^2$$</div>

      <h3>Итеративные обновления</h3>
      <p><b>Assignment step:</b></p>
      <div class="math-block">$$c(i) = \\arg\\min_{k} \\|x_i - \\mu_k\\|^2$$</div>

      <p><b>Update step:</b></p>
      <div class="math-block">$$\\mu_k = \\frac{1}{|C_k|} \\sum_{i \\in C_k} x_i$$</div>

      <h3>Сходимость</h3>
      <p>Каждый шаг не увеличивает J, J ≥ 0 → алгоритм сходится за конечное число итераций. Но может сойтись к локальному минимуму.</p>

      <h3>Silhouette score</h3>
      <div class="math-block">$$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$$</div>
      <p>где $a(i)$ — среднее расстояние до точек своего кластера, $b(i)$ — до ближайшего чужого. $s \\in [-1, 1]$, чем выше — тем лучше.</p>

      <h3>Связь с EM для GMM</h3>
      <p>K-Means — это hard version EM для гауссовой смеси с единичной ковариацией и одинаковыми весами.</p>
    `,

    extra: `
      <h3>Варианты K-Means</h3>
      <ul>
        <li><b>Mini-batch K-Means</b> — для очень больших данных, обновление по мини-батчам.</li>
        <li><b>K-Medoids (PAM)</b> — центроид = реальная точка, устойчив к выбросам.</li>
        <li><b>K-Modes</b> — для категориальных данных, использует моду.</li>
        <li><b>Fuzzy C-Means</b> — мягкая принадлежность к кластерам.</li>
        <li><b>Spherical K-Means</b> — для текстов (косинусное расстояние).</li>
      </ul>

      <h3>Альтернативы</h3>
      <ul>
        <li><b>DBSCAN</b> — плотностная, находит кластеры любой формы, автоматически определяет k, отмечает шум.</li>
        <li><b>Hierarchical (Agglomerative)</b> — строит дендрограмму, не нужен k.</li>
        <li><b>GMM</b> — гибче (эллипсы), выдаёт вероятности.</li>
        <li><b>Spectral clustering</b> — для кластеров сложной топологии.</li>
      </ul>

      <h3>Когда что использовать</h3>
      <table>
        <tr><th>Данные</th><th>Алгоритм</th></tr>
        <tr><td>Круглые кластеры, известно k</td><td>K-Means</td></tr>
        <tr><td>Шум, сложные формы</td><td>DBSCAN</td></tr>
        <tr><td>Иерархия важна</td><td>Agglomerative</td></tr>
        <tr><td>Эллиптические, вероятности</td><td>GMM</td></tr>
      </table>

      <h3>Масштабирование</h3>
      <p>K-Means использует евклидово расстояние — признаки с большим диапазоном доминируют. <b>Всегда скейли признаки</b> (StandardScaler).</p>
    `,
  },
});
