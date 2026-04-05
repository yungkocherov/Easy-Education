/* ==========================================================================
   Isolation Forest
   ========================================================================== */
App.registerTopic({
  id: 'isolation-forest',
  category: 'ml',
  title: 'Isolation Forest',
  summary: 'Аномалии изолируются быстрее нормальных точек случайными разбиениями.',

  tabs: {
    theory: `
      <h3>Основная идея</h3>
      <p>Обычно для поиска аномалий считают «плотность» вокруг точки. Isolation Forest идёт с другого конца: <b>аномалии мало, они «далеко» → их легко изолировать</b> от всех остальных случайными разбиениями.</p>

      <h3>Как строится дерево (iTree)</h3>
      <ol>
        <li>Взять подвыборку данных (обычно 256 точек).</li>
        <li>Выбрать случайный признак и случайный порог в его диапазоне.</li>
        <li>Разбить данные.</li>
        <li>Повторять рекурсивно, пока каждая точка не окажется в своём листе или не достигнута макс. глубина.</li>
      </ol>

      <h3>Оценка аномальности</h3>
      <p>Глубина, на которой точка изолировалась = path length.</p>
      <ul>
        <li>Малая глубина → точка аномальна</li>
        <li>Большая глубина → точка нормальна</li>
      </ul>
      <p>Усредняем по лесу и нормируем: получаем score в [0, 1].</p>
      <ul>
        <li>score близко к 1 — точка аномалия</li>
        <li>score близко к 0.5 — нормальная</li>
        <li>score близко к 0 — точно нормальная</li>
      </ul>

      <h3>Почему работает</h3>
      <p>Случайный сплит с большей вероятностью отделит изолированную (далёкую) точку, чем точку в плотном кластере. Чем реже точка — тем меньше шагов до её изоляции.</p>

      <div class="callout tip">💡 Один из самых эффективных алгоритмов детекции аномалий для tabular данных. Fast, parallel, unsupervised.</div>
    `,

    examples: `
      <h3>Пример 1: одномерные данные</h3>
      <div class="example-card">
        <div class="example-data">[1, 2, 3, 4, 5, 6, 7, 8, 9, 100]</div>
        <p>Если мы случайно выберем порог в диапазоне [1, 100]:</p>
        <ul>
          <li>Есть высокая вероятность выбрать порог > 9 — тогда 100 изолируется сразу.</li>
          <li>Для точки из группы [1..9] потребуется больше разбиений.</li>
        </ul>
        <p>В среднем глубина 100 будет 1-2, а нормальных — 4-5.</p>
      </div>

      <h3>Пример 2: score из path length</h3>
      <div class="example-card">
        <p>Средняя глубина точки в лесу $\\bar{h}(x) = 3$. Ожидаемая глубина для случайного BST при n=256: $c(n) = 2H(n-1) - 2(n-1)/n \\approx 9.5$.</p>
        <div class="math-block">$$s(x) = 2^{-\\bar{h}(x)/c(n)} = 2^{-3/9.5} \\approx 0.80$$</div>
        <p>Высокий score → аномалия.</p>
      </div>

      <h3>Пример 3: контамин ация</h3>
      <div class="example-card">
        <p>Параметр <b>contamination</b> — ожидаемая доля аномалий (например, 0.05). Алгоритм считает score для всех, потом устанавливает порог: верхние 5% по score — аномалии.</p>
        <p>Если не знаешь долю аномалий, можно смотреть на распределение score и выбирать порог вручную.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: поиск аномалий</h3>
        <p>Нормальные точки в двух кластерах + случайные выбросы. Цвет показывает score — красное = аномалия.</p>
        <div class="sim-container">
          <div class="sim-controls" id="if-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="if-regen">🔄 Новые данные</button>
            <button class="btn secondary" id="if-rebuild">🌲 Пересчитать лес</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="if-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="if-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#if-controls');
        const cTrees = App.makeControl('range', 'if-trees', 'Число деревьев', { min: 10, max: 200, step: 10, value: 50 });
        const cDepth = App.makeControl('range', 'if-depth', 'Макс. глубина', { min: 4, max: 15, step: 1, value: 8 });
        const cN = App.makeControl('range', 'if-n', 'Нормальных точек', { min: 50, max: 300, step: 10, value: 150 });
        const cOut = App.makeControl('range', 'if-out', 'Выбросов', { min: 0, max: 30, step: 1, value: 10 });
        const cCont = App.makeControl('range', 'if-cont', 'contamination', { min: 0.01, max: 0.3, step: 0.01, value: 0.08 });
        [cTrees, cDepth, cN, cOut, cCont].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#if-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let scores = [];

        function genData() {
          const n = +cN.input.value;
          const nOut = +cOut.input.value;
          points = [];
          for (let i = 0; i < n / 2; i++) {
            points.push({ x: 0.3 + App.Util.randn(0, 0.07), y: 0.35 + App.Util.randn(0, 0.07), truth: 0 });
          }
          for (let i = 0; i < n / 2; i++) {
            points.push({ x: 0.7 + App.Util.randn(0, 0.07), y: 0.65 + App.Util.randn(0, 0.07), truth: 0 });
          }
          for (let i = 0; i < nOut; i++) {
            points.push({ x: 0.05 + 0.9 * Math.random(), y: 0.05 + 0.9 * Math.random(), truth: 1 });
          }
        }

        function buildITree(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length <= 1) {
            return { leaf: true, size: items.length, depth };
          }
          // выбираем случайный признак и случайный порог
          const feat = Math.random() < 0.5 ? 'x' : 'y';
          const vals = items.map(p => p[feat]);
          const lo = Math.min(...vals), hi = Math.max(...vals);
          if (lo === hi) return { leaf: true, size: items.length, depth };
          const thr = lo + Math.random() * (hi - lo);
          const L = items.filter(p => p[feat] < thr);
          const R = items.filter(p => p[feat] >= thr);
          return {
            leaf: false, feat, thr, depth,
            left: buildITree(L, depth + 1, maxDepth),
            right: buildITree(R, depth + 1, maxDepth),
          };
        }

        function c(n) { if (n <= 1) return 0; return 2 * (Math.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n; }

        function pathLength(tree, p, depth) {
          if (tree.leaf) return depth + c(tree.size);
          const v = tree.feat === 'x' ? p.x : p.y;
          return v < tree.thr ? pathLength(tree.left, p, depth + 1) : pathLength(tree.right, p, depth + 1);
        }

        function computeScores() {
          const nTrees = +cTrees.input.value;
          const maxDepth = +cDepth.input.value;
          const sampleSize = Math.min(256, points.length);
          const norm = c(sampleSize);

          const forest = [];
          for (let t = 0; t < nTrees; t++) {
            const sample = [];
            for (let i = 0; i < sampleSize; i++) sample.push(points[Math.floor(Math.random() * points.length)]);
            forest.push(buildITree(sample, 0, maxDepth));
          }

          scores = points.map(p => {
            let sum = 0;
            forest.forEach(t => sum += pathLength(t, p, 0));
            const avg = sum / nTrees;
            return Math.pow(2, -avg / norm);
          });
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          // определяем порог по contamination
          const cont = +cCont.input.value;
          const sorted = [...scores].sort((a, b) => b - a);
          const threshold = sorted[Math.floor(cont * scores.length)];

          // считаем anomaly detection metrics
          let tp = 0, fp = 0, fn = 0, tn = 0;
          points.forEach((p, i) => {
            const pred = scores[i] >= threshold ? 1 : 0;
            if (pred === 1 && p.truth === 1) tp++;
            else if (pred === 1 && p.truth === 0) fp++;
            else if (pred === 0 && p.truth === 1) fn++;
            else tn++;
          });

          // рисуем точки по score (от синего до красного)
          points.forEach((p, i) => {
            const s = scores[i];
            const t = Math.max(0, Math.min(1, (s - 0.4) / 0.35));
            const r = Math.round(59 + (239 - 59) * t);
            const g = Math.round(130 + (68 - 130) * t);
            const b = Math.round(246 + (68 - 246) * t);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            const isAnom = scores[i] >= threshold;
            ctx.strokeStyle = isAnom ? '#0f172a' : '#fff';
            ctx.lineWidth = isAnom ? 2 : 1;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, isAnom ? 6 : 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          });

          const precision = tp / (tp + fp) || 0;
          const recall = tp / (tp + fn) || 0;

          container.querySelector('#if-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Threshold</div><div class="stat-value">${App.Util.round(threshold, 3)}</div></div>
            <div class="stat-card"><div class="stat-label">Обнаружено аномалий</div><div class="stat-value">${tp + fp}</div></div>
            <div class="stat-card"><div class="stat-label">TP / FP / FN</div><div class="stat-value">${tp}/${fp}/${fn}</div></div>
            <div class="stat-card"><div class="stat-label">Precision</div><div class="stat-value">${(precision * 100).toFixed(0)}%</div></div>
            <div class="stat-card"><div class="stat-label">Recall</div><div class="stat-value">${(recall * 100).toFixed(0)}%</div></div>
          `;
        }

        function rebuild() { computeScores(); draw(); }

        [cTrees, cDepth].forEach(c => c.input.addEventListener('input', rebuild));
        [cN, cOut].forEach(c => c.input.addEventListener('change', () => { genData(); rebuild(); }));
        cCont.input.addEventListener('input', draw);
        container.querySelector('#if-regen').onclick = () => { genData(); rebuild(); };
        container.querySelector('#if-rebuild').onclick = rebuild;

        setTimeout(() => { genData(); resize(); rebuild(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Fraud detection</b> — аномальные банковские транзакции.</li>
        <li><b>Сетевая безопасность</b> — аномальный трафик, вторжения.</li>
        <li><b>Мониторинг систем</b> — аномальные метрики серверов.</li>
        <li><b>Manufacturing</b> — дефекты производства.</li>
        <li><b>Medical</b> — аномальные показатели в анализах.</li>
        <li><b>Data cleaning</b> — обнаружение выбросов перед ML.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Линейная сложность O(n log n)</li>
            <li>Масштабируется на большие данные</li>
            <li>Не требует вычисления расстояний</li>
            <li>Хорошо работает в высоких размерностях</li>
            <li>Параллелится</li>
            <li>Мало гиперпараметров</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Случайный — результаты могут варьироваться</li>
            <li>Axis-parallel splits — плохо с «косыми» аномалиями</li>
            <li>Нужно знать contamination или порог</li>
            <li>Плохо работает при кластерных аномалиях (много рядом стоящих)</li>
            <li>Может принять плотные кластеры за аномалии в разреженных данных</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Построение iTree</h3>
      <p>Рекурсивно разбиваем случайно, пока не достигли глубины или единичного узла.</p>

      <h3>Path length</h3>
      <p>$h(x)$ — глубина, на которой изолируется x. Если лист содержит >1 точку (из-за ограничения глубины), добавляем поправку:</p>
      <div class="math-block">$$h(x) = e + c(T.size)$$</div>

      <h3>Нормировочная константа</h3>
      <p>Ожидаемая глубина в случайном BST:</p>
      <div class="math-block">$$c(n) = 2H(n-1) - \\frac{2(n-1)}{n}, \\quad H(i) = \\ln(i) + \\gamma$$</div>

      <h3>Anomaly score</h3>
      <div class="math-block">$$s(x, n) = 2^{-\\frac{E[h(x)]}{c(n)}}$$</div>
      <ul>
        <li>$s \\to 1$ при $E[h(x)] \\to 0$ — аномалия</li>
        <li>$s \\to 0$ при $E[h(x)] \\to n-1$ — норма</li>
        <li>$s \\approx 0.5$ — нельзя сказать</li>
      </ul>

      <h3>Параметры</h3>
      <ul>
        <li>$t$ — число деревьев (обычно 100)</li>
        <li>$\\psi$ — размер подвыборки (обычно 256)</li>
        <li>max_depth = $\\lceil \\log_2(\\psi) \\rceil$</li>
      </ul>
    `,

    extra: `
      <h3>Extended Isolation Forest</h3>
      <p>Обычный iForest делает axis-parallel разбиения, что создаёт артефакты. EIF использует случайные гиперплоскости с произвольными наклонами — более точные score.</p>

      <h3>Альтернативы для аномалий</h3>
      <table>
        <tr><th>Метод</th><th>Идея</th><th>Когда использовать</th></tr>
        <tr><td>Isolation Forest</td><td>Изолировать</td><td>Большие tabular данные</td></tr>
        <tr><td>LOF</td><td>Локальная плотность</td><td>Когда кластеры разной плотности</td></tr>
        <tr><td>One-Class SVM</td><td>Граница нормы</td><td>Небольшие данные, известна норма</td></tr>
        <tr><td>Autoencoder</td><td>Reconstruction error</td><td>Изображения, сигналы</td></tr>
        <tr><td>Z-score</td><td>σ от среднего</td><td>1D, нормальные данные</td></tr>
      </table>

      <h3>Как выбрать contamination</h3>
      <ul>
        <li>Если знаешь историческую долю аномалий — используй её.</li>
        <li>Если нет разметки — смотри на распределение score и выбирай руками.</li>
        <li>В проде часто контролируют через precision@k — фиксируем количество алёртов.</li>
      </ul>

      <h3>Интерпретация score</h3>
      <p>Score сам по себе не вероятность аномалии — это относительный ранг. Для калибровки используй calibration plots или percentile rank.</p>

      <h3>Multi-variate anomalies</h3>
      <p>Isolation Forest хорошо ловит отдельные сильные аномалии, но плохо — точечные малые отклонения в контексте. Для временных рядов нужны специальные адаптации (например, детекция изменений).</p>
    `,
  },
});
