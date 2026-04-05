/* ==========================================================================
   Decision Tree
   ========================================================================== */
App.registerTopic({
  id: 'decision-tree',
  category: 'ml',
  title: 'Решающее дерево',
  summary: 'Иерархия if-else вопросов, которая делит данные на однородные группы.',

  tabs: {
    theory: `
      <h3>Идея</h3>
      <p>Дерево задаёт серию вопросов о признаках и разбивает данные, пока каждая группа не станет максимально однородной.</p>
      <p>Пример: «Возраст > 30?» → «Доход > 50k?» → «Кредит > 100k?» → «Одобрить»</p>

      <h3>Как выбрать разбиение</h3>
      <p>В каждом узле перебираем все признаки и все пороги, выбираем тот, который даёт максимальное «уменьшение неопределённости»:</p>
      <ul>
        <li><b>Gini impurity</b> (классификация): $\\text{Gini} = 1 - \\sum p_c^2$</li>
        <li><b>Энтропия</b> (классификация): $H = -\\sum p_c \\log_2 p_c$</li>
        <li><b>MSE</b> (регрессия): дисперсия таргета в узле</li>
      </ul>
      <p>Чем ниже impurity — тем «чище» узел.</p>

      <h3>Когда остановиться</h3>
      <p>Иначе дерево будет расти до одного примера на лист (переобучение). Критерии остановки:</p>
      <ul>
        <li><b>max_depth</b> — максимальная глубина</li>
        <li><b>min_samples_split</b> — минимум примеров для разбиения</li>
        <li><b>min_samples_leaf</b> — минимум в листе</li>
        <li><b>max_leaf_nodes</b> — максимум листьев</li>
      </ul>

      <div class="callout tip">💡 Дерево — жадный алгоритм. Оно строится сверху вниз, на каждом шаге делая локально оптимальный выбор. Это быстро, но не всегда глобально оптимально.</div>
    `,

    examples: `
      <h3>Пример 1: классификация на 4 точках</h3>
      <div class="example-card">
        <div class="example-data">x=1,y=1 → 0
x=1,y=5 → 1
x=5,y=1 → 1
x=5,y=5 → 0</div>
        <p>Это XOR. Одно разбиение не поможет. Нужны два уровня:</p>
        <pre>if x < 3:
    if y < 3: class 0
    else: class 1
else:
    if y < 3: class 1
    else: class 0</pre>
      </div>

      <h3>Пример 2: расчёт Gini для разбиения</h3>
      <div class="example-card">
        <p>В узле 10 примеров: 7 класса A, 3 класса B.</p>
        <div class="math-block">$$\\text{Gini} = 1 - (0.7^2 + 0.3^2) = 1 - 0.58 = 0.42$$</div>
        <p>Разбили на две группы: [4A, 1B] и [3A, 2B]:</p>
        <ul>
          <li>Левая: Gini = 1 − (0.8² + 0.2²) = 0.32</li>
          <li>Правая: Gini = 1 − (0.6² + 0.4²) = 0.48</li>
          <li>Взвешенный Gini = 5/10 · 0.32 + 5/10 · 0.48 = 0.40</li>
        </ul>
        <p><b>Выигрыш:</b> 0.42 − 0.40 = 0.02. Разбиение слабое.</p>
      </div>

      <h3>Пример 3: предсказание</h3>
      <div class="example-card">
        <p>Новый пример проходит по дереву от корня к листу, отвечая на вопросы. В листе:</p>
        <ul>
          <li><b>Классификация</b>: мажоритарный класс.</li>
          <li><b>Регрессия</b>: среднее таргетов в листе.</li>
          <li><b>Вероятности</b>: распределение классов в листе.</li>
        </ul>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: построение дерева</h3>
        <p>Меняй глубину и посмотри, как дерево разбивает пространство.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dt-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dt-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="dt-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="dt-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dt-controls');
        const cDepth = App.makeControl('range', 'dt-depth', 'Max depth', { min: 1, max: 10, step: 1, value: 3 });
        const cMinSplit = App.makeControl('range', 'dt-min', 'Min samples split', { min: 2, max: 30, step: 1, value: 2 });
        const cShape = App.makeControl('select', 'dt-shape', 'Форма данных', {
          options: [{ value: 'blobs', label: 'Кластеры' }, { value: 'xor', label: 'XOR' }, { value: 'moons', label: 'Две луны' }, { value: 'circle', label: 'Круг' }],
          value: 'moons',
        });
        const cN = App.makeControl('range', 'dt-n', 'Точек', { min: 20, max: 300, step: 10, value: 100 });
        [cDepth, cMinSplit, cShape, cN].forEach((c) => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#dt-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];

        function genData() {
          const shape = cShape.input.value;
          const n = +cN.input.value;
          points = [];
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'blobs') {
              cls = Math.random() < 0.5 ? 0 : 1;
              const c = cls === 0 ? [0.3, 0.3] : [0.7, 0.7];
              x = c[0] + App.Util.randn(0, 0.08);
              y = c[1] + App.Util.randn(0, 0.08);
            } else if (shape === 'xor') {
              x = Math.random(); y = Math.random();
              cls = ((x > 0.5) ^ (y > 0.5)) ? 1 : 0;
            } else if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) {
                x = 0.3 + 0.25 * Math.cos(t) + App.Util.randn(0, 0.03);
                y = 0.45 + 0.25 * Math.sin(t) + App.Util.randn(0, 0.03);
                cls = 0;
              } else {
                x = 0.55 + 0.25 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.03);
                y = 0.55 - 0.25 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.03);
                cls = 1;
              }
            } else {
              x = Math.random(); y = Math.random();
              const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
              cls = r < 0.25 ? 0 : 1;
            }
            points.push({ x, y, cls });
          }
        }

        function gini(items) {
          if (items.length === 0) return 0;
          const counts = [0, 0];
          items.forEach(p => counts[p.cls]++);
          const p0 = counts[0] / items.length, p1 = counts[1] / items.length;
          return 1 - p0 * p0 - p1 * p1;
        }

        function majority(items) {
          const counts = [0, 0];
          items.forEach(p => counts[p.cls]++);
          return counts[0] >= counts[1] ? 0 : 1;
        }

        function buildTree(items, depth, maxDepth, minSplit) {
          if (depth >= maxDepth || items.length < minSplit || gini(items) < 1e-9) {
            return { leaf: true, cls: majority(items), n: items.length };
          }
          // перебор
          let best = null;
          const baseGini = gini(items);
          ['x', 'y'].forEach(feat => {
            const vals = items.map(p => p[feat]).sort((a, b) => a - b);
            for (let i = 1; i < vals.length; i++) {
              const thr = (vals[i - 1] + vals[i]) / 2;
              const L = items.filter(p => p[feat] < thr);
              const R = items.filter(p => p[feat] >= thr);
              if (L.length === 0 || R.length === 0) continue;
              const w = (L.length * gini(L) + R.length * gini(R)) / items.length;
              const gain = baseGini - w;
              if (!best || gain > best.gain) best = { feat, thr, gain, L, R };
            }
          });
          if (!best || best.gain < 1e-6) return { leaf: true, cls: majority(items), n: items.length };
          return {
            leaf: false, feat: best.feat, thr: best.thr,
            left: buildTree(best.L, depth + 1, maxDepth, minSplit),
            right: buildTree(best.R, depth + 1, maxDepth, minSplit),
            n: items.length,
          };
        }

        function countLeaves(t) { return t.leaf ? 1 : countLeaves(t.left) + countLeaves(t.right); }

        function predict(tree, x, y) {
          if (tree.leaf) return tree.cls;
          const v = tree.feat === 'x' ? x : y;
          return v < tree.thr ? predict(tree.left, x, y) : predict(tree.right, x, y);
        }

        function resize() {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          draw();
        }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          const maxDepth = +cDepth.input.value;
          const minSplit = +cMinSplit.input.value;
          const tree = buildTree(points, 0, maxDepth, minSplit);

          ctx.clearRect(0, 0, W, H);
          const step = 6;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const cls = predict(tree, px / W, py / H);
              ctx.fillStyle = cls === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)';
              ctx.fillRect(px, py, step, step);
            }
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 4, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          // accuracy
          let correct = 0;
          points.forEach(p => { if (predict(tree, p.x, p.y) === p.cls) correct++; });
          const acc = correct / points.length;

          container.querySelector('#dt-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Max depth</div><div class="stat-value">${maxDepth}</div></div>
            <div class="stat-card"><div class="stat-label">Листьев</div><div class="stat-value">${countLeaves(tree)}</div></div>
            <div class="stat-card"><div class="stat-label">Train accuracy</div><div class="stat-value">${(acc * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${points.length}</div></div>
          `;
        }

        [cDepth, cMinSplit].forEach(c => c.input.addEventListener('input', draw));
        [cShape, cN].forEach(c => c.input.addEventListener('change', () => { genData(); draw(); }));
        container.querySelector('#dt-regen').onclick = () => { genData(); draw(); };

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Бизнес-правила</b> — когда важна интерпретируемость.</li>
        <li><b>Кредитный скоринг</b> — регуляторы требуют прозрачности.</li>
        <li><b>Медицина</b> — диагностические деревья.</li>
        <li><b>Компонент ансамблей</b> — Random Forest, Gradient Boosting, XGBoost.</li>
        <li><b>Feature importance</b> — какие признаки важны для модели.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Интерпретируемость — можно нарисовать и объяснить</li>
            <li>Не требует масштабирования признаков</li>
            <li>Работает и с числовыми, и с категориальными признаками</li>
            <li>Ловит нелинейные зависимости и взаимодействия</li>
            <li>Устойчиво к выбросам</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Легко переобучается</li>
            <li>Нестабильно — небольшой шум меняет структуру</li>
            <li>Смещение к признакам с многими уровнями</li>
            <li>Плохо в экстраполяции (регрессия)</li>
            <li>Не находит косых границ</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Меры неопределённости</h3>

      <h4>Gini impurity</h4>
      <div class="math-block">$$\\text{Gini}(S) = 1 - \\sum_{c=1}^{C} p_c^2$$</div>
      <p>$p_c$ — доля класса c в узле S.</p>

      <h4>Энтропия</h4>
      <div class="math-block">$$H(S) = -\\sum_{c=1}^{C} p_c \\log_2 p_c$$</div>

      <h4>Information Gain</h4>
      <div class="math-block">$$IG(S, A) = H(S) - \\sum_{v \\in \\text{vals}(A)} \\frac{|S_v|}{|S|} H(S_v)$$</div>

      <h4>Для регрессии (MSE)</h4>
      <div class="math-block">$$\\text{MSE}(S) = \\frac{1}{|S|} \\sum_{i \\in S} (y_i - \\bar{y}_S)^2$$</div>

      <h3>Алгоритм CART</h3>
      <ol>
        <li>Для каждого признака и порога вычислить impurity после разбиения.</li>
        <li>Выбрать разбиение с максимальным снижением impurity.</li>
        <li>Рекурсивно применить к детям, пока не достигнут стоп-критерий.</li>
      </ol>

      <h3>Prepruning vs Postpruning</h3>
      <ul>
        <li><b>Pre-pruning</b>: остановка роста по критериям (max_depth, min_samples).</li>
        <li><b>Post-pruning</b>: построить большое дерево, потом обрезать (cost-complexity pruning, параметр α).</li>
      </ul>
    `,

    extra: `
      <h3>Cost-Complexity Pruning</h3>
      <p>Минимизируем $R(T) + \\alpha |T|$, где R(T) — ошибка, |T| — число листьев. Параметр α ищется через CV.</p>

      <h3>Feature Importance</h3>
      <p>Для каждого признака суммируется уменьшение impurity, которое он принёс во всех узлах, где использовался. Нормализуется до 1.</p>

      <h3>Oblique trees</h3>
      <p>Обычные деревья разбивают параллельно осям ($x_j < t$). Oblique trees используют линейные комбинации признаков — ловят косые границы, но теряют интерпретируемость.</p>

      <h3>Почему деревья → лес</h3>
      <p>Отдельное дерево нестабильно и переобучается. Решение: много деревьев с рандомизацией = Random Forest. Или последовательное улучшение = Gradient Boosting.</p>

      <h3>Категориальные признаки</h3>
      <ul>
        <li>CART: группирует категории в 2 подмножества.</li>
        <li>LightGBM: оптимальное разбиение по среднему таргету.</li>
        <li>XGBoost: либо one-hot, либо target encoding.</li>
      </ul>
    `,
  },
});
