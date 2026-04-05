/* ==========================================================================
   Random Forest
   ========================================================================== */
App.registerTopic({
  id: 'random-forest',
  category: 'ml',
  title: 'Random Forest',
  summary: 'Ансамбль разнообразных деревьев, голосующих большинством.',

  tabs: {
    theory: `
      <h3>Идея</h3>
      <p>Одно дерево нестабильно. Но если построить много <b>разнообразных</b> деревьев и усреднить их предсказания — ошибки скомпенсируются.</p>

      <h3>Два источника разнообразия</h3>
      <ol>
        <li><b>Bagging (bootstrap aggregation)</b> — каждое дерево обучается на своей случайной подвыборке с возвращением. Размер = размеру датасета, но ≈63% уникальных примеров.</li>
        <li><b>Random feature selection</b> — при каждом разбиении рассматривается только случайное подмножество признаков (обычно √p для классификации, p/3 для регрессии).</li>
      </ol>

      <h3>Предсказание</h3>
      <ul>
        <li><b>Классификация</b>: большинство голосов всех деревьев.</li>
        <li><b>Регрессия</b>: среднее предсказаний.</li>
        <li><b>Вероятности</b>: доля деревьев, проголосовавших за класс.</li>
      </ul>

      <h3>Магия ансамбля</h3>
      <p>Если ошибки деревьев <b>некоррелированы</b>, то усреднение снижает дисперсию в ~k раз (где k — число деревьев). Random Forest специально повышает разнообразие деревьев для этого.</p>

      <div class="callout tip">💡 Random Forest — «рабочая лошадка». Редко лучший, но почти всегда приличный результат с минимальной настройкой.</div>
    `,

    examples: `
      <h3>Пример 1: как работает голосование</h3>
      <div class="example-card">
        <p>5 деревьев предсказывают класс для новой точки:</p>
        <div class="example-data">Tree 1: класс A
Tree 2: класс B
Tree 3: класс A
Tree 4: класс A
Tree 5: класс B</div>
        <p>Голоса: A=3, B=2 → ансамбль предсказывает <b>A</b>.</p>
        <p>Вероятность A: 3/5 = 0.6, вероятность B: 0.4.</p>
      </div>

      <h3>Пример 2: bootstrap sample</h3>
      <div class="example-card">
        <p>Исходный датасет: [1, 2, 3, 4, 5].</p>
        <p>Bootstrap sample того же размера с возвращением:</p>
        <div class="example-data">[3, 1, 3, 5, 2]  — дерево 1
[4, 4, 2, 1, 5]  — дерево 2
[1, 3, 2, 4, 2]  — дерево 3</div>
        <p>Не попавшие в bootstrap — <b>out-of-bag (OOB)</b> примеры, используются для оценки качества без отдельного валидационного набора.</p>
      </div>

      <h3>Пример 3: выбор признаков</h3>
      <div class="example-card">
        <p>Датасет имеет 16 признаков. Для классификации √16 = 4.</p>
        <p>В каждом узле случайно выбираются 4 признака из 16, и только среди них ищется лучшее разбиение. Это делает деревья разнообразнее.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: один vs много деревьев</h3>
        <p>Сравни границу одного дерева с лесом. Меняй число деревьев и глубину.</p>
        <div class="sim-container">
          <div class="sim-controls" id="rf-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="rf-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="rf-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="rf-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#rf-controls');
        const cTrees = App.makeControl('range', 'rf-trees', 'Число деревьев', { min: 1, max: 100, step: 1, value: 20 });
        const cDepth = App.makeControl('range', 'rf-depth', 'Max depth', { min: 1, max: 10, step: 1, value: 5 });
        const cFeat = App.makeControl('range', 'rf-feat', 'Признаков на split', { min: 1, max: 2, step: 1, value: 1 });
        const cN = App.makeControl('range', 'rf-n', 'Точек', { min: 40, max: 300, step: 10, value: 120 });
        const cShape = App.makeControl('select', 'rf-shape', 'Форма', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'circle', label: 'Круг' }, { value: 'xor', label: 'XOR' }],
          value: 'moons',
        });
        [cTrees, cDepth, cFeat, cN, cShape].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#rf-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let forest = [];

        function genData() {
          const shape = cShape.input.value;
          const n = +cN.input.value;
          points = [];
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) {
                x = 0.3 + 0.25 * Math.cos(t) + App.Util.randn(0, 0.04);
                y = 0.45 + 0.25 * Math.sin(t) + App.Util.randn(0, 0.04);
                cls = 0;
              } else {
                x = 0.55 + 0.25 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.04);
                y = 0.55 - 0.25 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.04);
                cls = 1;
              }
            } else if (shape === 'circle') {
              x = Math.random(); y = Math.random();
              const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
              cls = r < 0.25 + App.Util.randn(0, 0.03) ? 0 : 1;
            } else {
              x = Math.random(); y = Math.random();
              cls = ((x > 0.5) ^ (y > 0.5)) ? 1 : 0;
              if (Math.random() < 0.08) cls = 1 - cls; // шум
            }
            points.push({ x, y, cls });
          }
        }

        function gini(items) {
          if (items.length === 0) return 0;
          let c0 = 0, c1 = 0;
          items.forEach(p => p.cls === 0 ? c0++ : c1++);
          const p0 = c0 / items.length, p1 = c1 / items.length;
          return 1 - p0 * p0 - p1 * p1;
        }

        function majority(items) { let c0 = 0; items.forEach(p => p.cls === 0 && c0++); return c0 >= items.length - c0 ? 0 : 1; }

        function buildTree(items, depth, maxDepth, maxFeatures) {
          if (depth >= maxDepth || items.length < 2 || gini(items) < 1e-9) {
            return { leaf: true, cls: majority(items) };
          }
          const feats = ['x', 'y'];
          const shuffled = App.Util.shuffle(feats).slice(0, maxFeatures);
          let best = null;
          const base = gini(items);
          shuffled.forEach(feat => {
            const vals = items.map(p => p[feat]).sort((a, b) => a - b);
            // пробуем несколько случайных порогов для скорости
            const tryN = Math.min(vals.length - 1, 20);
            for (let k = 0; k < tryN; k++) {
              const i = 1 + Math.floor(Math.random() * (vals.length - 1));
              const thr = (vals[i - 1] + vals[i]) / 2;
              const L = items.filter(p => p[feat] < thr);
              const R = items.filter(p => p[feat] >= thr);
              if (L.length === 0 || R.length === 0) continue;
              const w = (L.length * gini(L) + R.length * gini(R)) / items.length;
              const gain = base - w;
              if (!best || gain > best.gain) best = { feat, thr, gain, L, R };
            }
          });
          if (!best || best.gain < 1e-6) return { leaf: true, cls: majority(items) };
          return {
            leaf: false, feat: best.feat, thr: best.thr,
            left: buildTree(best.L, depth + 1, maxDepth, maxFeatures),
            right: buildTree(best.R, depth + 1, maxDepth, maxFeatures),
          };
        }

        function predict(tree, x, y) {
          if (tree.leaf) return tree.cls;
          const v = tree.feat === 'x' ? x : y;
          return v < tree.thr ? predict(tree.left, x, y) : predict(tree.right, x, y);
        }

        function predictForest(x, y) {
          let votes = 0;
          forest.forEach(t => { votes += predict(t, x, y); });
          return votes / forest.length;
        }

        function buildForest() {
          const nTrees = +cTrees.input.value;
          const depth = +cDepth.input.value;
          const maxFeat = +cFeat.input.value;
          forest = [];
          for (let t = 0; t < nTrees; t++) {
            // bootstrap
            const sample = [];
            for (let i = 0; i < points.length; i++) {
              sample.push(points[Math.floor(Math.random() * points.length)]);
            }
            forest.push(buildTree(sample, 0, depth, maxFeat));
          }
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const step = 8;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const p = predictForest(px / W, py / H);
              // интерполяция между красным и синим
              const alpha = 0.25;
              ctx.fillStyle = `rgba(${Math.round(239 * (1 - p) + 59 * p)},${Math.round(68 * (1 - p) + 130 * p)},${Math.round(68 * (1 - p) + 246 * p)},${alpha})`;
              ctx.fillRect(px, py, step, step);
            }
          }
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 4, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          let correct = 0;
          points.forEach(p => { if (Math.round(predictForest(p.x, p.y)) === p.cls) correct++; });
          const acc = correct / points.length;

          container.querySelector('#rf-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Деревьев</div><div class="stat-value">${forest.length}</div></div>
            <div class="stat-card"><div class="stat-label">Max depth</div><div class="stat-value">${cDepth.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">Признаков/split</div><div class="stat-value">${cFeat.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">Train accuracy</div><div class="stat-value">${(acc * 100).toFixed(1)}%</div></div>
          `;
        }

        function rebuild() { buildForest(); draw(); }

        [cTrees, cDepth, cFeat].forEach(c => c.input.addEventListener('input', rebuild));
        [cN, cShape].forEach(c => c.input.addEventListener('change', () => { genData(); rebuild(); }));
        container.querySelector('#rf-regen').onclick = () => { genData(); rebuild(); };

        setTimeout(() => { genData(); resize(); buildForest(); draw(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Tabular данные</b> — часто побеждает нейросети на табличках.</li>
        <li><b>Feature importance</b> — какие признаки важны.</li>
        <li><b>Baseline для ML</b> — быстро даёт сильный результат.</li>
        <li><b>Медицина и биология</b> — микрочипы, генетические маркеры.</li>
        <li><b>Финансы</b> — скоринг, антифрод.</li>
        <li><b>Вычисление similarity</b> — два объекта «похожи», если часто попадают в один лист.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Почти не требует настройки</li>
            <li>Устойчив к переобучению (с ростом деревьев)</li>
            <li>Работает с пропусками, выбросами</li>
            <li>Дает feature importance</li>
            <li>Параллелится — каждое дерево независимо</li>
            <li>OOB error без отдельной валидации</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Медленный инференс (много деревьев)</li>
            <li>Большой размер модели</li>
            <li>Теряет интерпретируемость одного дерева</li>
            <li>Часто уступает бустингу на соревнованиях</li>
            <li>Не лучший выбор для экстраполяции</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Алгоритм</h3>
      <ol>
        <li>Для $t = 1, \\dots, T$:
          <ol>
            <li>Bootstrap sample $D_t$ размера n с возвращением.</li>
            <li>Построить дерево $h_t$ на $D_t$, на каждом разбиении используя случайные m признаков из p.</li>
          </ol>
        </li>
        <li>Классификация: $\\hat{y} = \\text{mode}\\{h_1(x), \\dots, h_T(x)\\}$</li>
        <li>Регрессия: $\\hat{y} = \\frac{1}{T}\\sum_t h_t(x)$</li>
      </ol>

      <h3>Дисперсия ансамбля</h3>
      <div class="math-block">$$\\text{Var}(\\bar{h}) = \\rho \\sigma^2 + \\frac{1-\\rho}{T}\\sigma^2$$</div>
      <p>где ρ — корреляция между деревьями, σ² — их дисперсия. При $\\rho = 0$ дисперсия падает в T раз.</p>

      <h3>OOB error</h3>
      <p>Для каждого примера усредняем предсказания только тех деревьев, для которых этот пример не попал в bootstrap. Получаем несмещённую оценку ошибки.</p>

      <h3>Feature Importance</h3>
      <div class="math-block">$$\\text{Imp}(j) = \\frac{1}{T}\\sum_{t=1}^{T}\\sum_{\\text{split на } x_j} \\Delta\\text{Impurity}$$</div>
    `,

    extra: `
      <h3>Параметры и их влияние</h3>
      <table>
        <tr><th>Параметр</th><th>Эффект</th></tr>
        <tr><td>n_estimators</td><td>Больше → лучше, но медленнее. Плато ~300-500.</td></tr>
        <tr><td>max_depth</td><td>None → деревья глубокие. Можно ограничить.</td></tr>
        <tr><td>max_features</td><td>Меньше → больше разнообразия.</td></tr>
        <tr><td>min_samples_leaf</td><td>Больше → меньше переобучения.</td></tr>
      </table>

      <h3>Extra Trees (Extremely Randomized)</h3>
      <p>Вместо оптимального порога — случайный порог. Ещё больше разнообразия, быстрее, часто не хуже.</p>

      <h3>Permutation Importance</h3>
      <p>Альтернатива feature importance: перемешать столбец и посмотреть, насколько упало качество. Более честная оценка.</p>

      <h3>Почему RF не переобучается с ростом T</h3>
      <p>С ростом T ошибка сходится к пределу (закон больших чисел). Переобучение ограничено глубиной и разнообразием отдельных деревьев.</p>

      <h3>Isolation Forest</h3>
      <p>Родственник RF для поиска аномалий: чем быстрее точка изолируется случайными разбиениями — тем вероятнее, что это выброс.</p>
    `,
  },
});
