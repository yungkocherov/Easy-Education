/* ==========================================================================
   Gradient Boosting
   ========================================================================== */
App.registerTopic({
  id: 'gradient-boosting',
  category: 'ml',
  title: 'Gradient Boosting',
  summary: 'Каждое новое дерево исправляет ошибки всех предыдущих.',

  tabs: {
    theory: `
      <h3>Идея</h3>
      <p>Random Forest строит деревья <b>параллельно</b> и независимо. Gradient Boosting строит <b>последовательно</b>: каждое следующее дерево учится исправлять ошибки предыдущих.</p>

      <h3>Общая схема</h3>
      <ol>
        <li>Начинаем с простого предсказания (например, среднего).</li>
        <li>Вычисляем ошибку (residual) для каждого примера.</li>
        <li>Обучаем новое дерево предсказывать эти ошибки.</li>
        <li>Добавляем предсказания дерева к модели (с learning rate).</li>
        <li>Повторяем M раз.</li>
      </ol>

      <h3>Почему «градиентный»</h3>
      <p>На самом деле каждое дерево фитирует не residuals, а <b>отрицательный градиент функции потерь</b>. Для MSE это и есть residual. Для log-loss — градиент другой.</p>

      <h3>Популярные реализации</h3>
      <ul>
        <li><b>XGBoost</b> — самая известная, с регуляризацией и аппроксимацией второго порядка.</li>
        <li><b>LightGBM</b> — быстрый, leaf-wise рост, оптимизации для категориальных признаков.</li>
        <li><b>CatBoost</b> — из коробки работает с категориальными, ordered boosting.</li>
      </ul>

      <div class="callout tip">💡 Gradient Boosting — чемпион Kaggle на табличных данных. Дольше учить, но обычно даёт лучший результат.</div>
    `,

    examples: `
      <h3>Пример 1: регрессия с деревьями</h3>
      <div class="example-card">
        <div class="example-data">Данные: x=[1,2,3,4,5], y=[2,5,6,9,11]
Шаг 0: F₀(x) = среднее(y) = 6.6
Шаг 1: residuals r = [-4.6, -1.6, -0.6, 2.4, 4.4]
        Дерево h₁ предсказывает r:
            x<3 → среднее[-4.6,-1.6] = -3.1
            x≥3 → среднее[-0.6,2.4,4.4] = 2.07
Шаг 2: F₁(x) = 6.6 + 0.3·h₁(x)  (с η=0.3)
        новые y_pred = [5.67, 5.67, 7.22, 7.22, 7.22]
        новые residuals = [-3.67, -0.67, -1.22, 1.78, 3.78]
Шаг 3: обучаем h₂ на новых residuals
...и так далее</div>
        <p>С каждым деревом ошибка падает, но понемногу (из-за η).</p>
      </div>

      <h3>Пример 2: learning rate</h3>
      <div class="example-card">
        <p><b>η = 0.1, M = 1000</b>: медленный, осторожный рост. Обычно лучшая генерализация.</p>
        <p><b>η = 1.0, M = 100</b>: агрессивный. Быстро переобучается.</p>
        <p>Правило: меньше η → больше M. Типично η ∈ [0.01, 0.1].</p>
      </div>

      <h3>Пример 3: предсказание</h3>
      <div class="example-card">
        <div class="math-block">$$\\hat{y}(x) = F_0 + \\eta \\sum_{m=1}^{M} h_m(x)$$</div>
        <p>Предсказание — сумма предсказаний всех деревьев (умноженных на η) плюс базовое предсказание.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: бустинг для регрессии</h3>
        <p>Смотри, как каждое новое дерево исправляет остатки. Меняй глубину, η и число итераций.</p>
        <div class="sim-container">
          <div class="sim-controls" id="gb-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="gb-step">➕ 1 итерация</button>
            <button class="btn" id="gb-step10">+10 итераций</button>
            <button class="btn secondary" id="gb-reset">↺ Сброс</button>
            <button class="btn secondary" id="gb-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:340px;"><canvas id="gb-chart"></canvas></div>
            <div class="sim-chart-wrap" style="height:180px;"><canvas id="gb-loss"></canvas></div>
            <div class="sim-stats" id="gb-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#gb-controls');
        const cLR = App.makeControl('range', 'gb-lr', 'Learning rate η', { min: 0.01, max: 1, step: 0.01, value: 0.3 });
        const cDepth = App.makeControl('range', 'gb-depth', 'Глубина дерева', { min: 1, max: 6, step: 1, value: 2 });
        const cNoise = App.makeControl('range', 'gb-noise', 'Шум', { min: 0, max: 1, step: 0.05, value: 0.3 });
        [cLR, cDepth, cNoise].forEach(c => controls.appendChild(c.wrap));

        let chart = null, lossChart = null;
        let xs = [], ys = [];
        let preds = [];
        let residuals = [];
        let lossHistory = [];
        let iter = 0;
        let F0 = 0;
        let trees = [];

        function genData() {
          xs = []; ys = [];
          const noise = +cNoise.input.value;
          for (let i = 0; i < 40; i++) {
            const x = i / 40 * 10;
            const y = Math.sin(x) + 0.3 * x + App.Util.randn(0, noise);
            xs.push(x); ys.push(y);
          }
          reset();
        }

        function reset() {
          F0 = App.Util.mean(ys);
          preds = new Array(xs.length).fill(F0);
          residuals = ys.map((y, i) => y - preds[i]);
          trees = [];
          iter = 0;
          lossHistory = [computeLoss()];
          draw();
        }

        function computeLoss() {
          let sum = 0;
          for (let i = 0; i < ys.length; i++) sum += (ys[i] - preds[i]) ** 2;
          return sum / ys.length;
        }

        // очень простое дерево для регрессии (1D, только x)
        function buildTree(targets, depth, maxDepth) {
          const items = xs.map((x, i) => ({ x, t: targets[i] }));
          return grow(items, depth, maxDepth);
        }

        function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

        function grow(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length < 2) {
            return { leaf: true, val: mean(items.map(p => p.t)) };
          }
          // найдём лучший split по x (MSE)
          const sorted = [...items].sort((a, b) => a.x - b.x);
          let bestGain = -Infinity, bestThr = null, bestL = null, bestR = null;
          const totalMean = mean(sorted.map(p => p.t));
          const totalVar = sorted.reduce((s, p) => s + (p.t - totalMean) ** 2, 0);
          for (let i = 1; i < sorted.length; i++) {
            const thr = (sorted[i - 1].x + sorted[i].x) / 2;
            const L = sorted.slice(0, i), R = sorted.slice(i);
            const mL = mean(L.map(p => p.t)), mR = mean(R.map(p => p.t));
            const vL = L.reduce((s, p) => s + (p.t - mL) ** 2, 0);
            const vR = R.reduce((s, p) => s + (p.t - mR) ** 2, 0);
            const gain = totalVar - (vL + vR);
            if (gain > bestGain) { bestGain = gain; bestThr = thr; bestL = L; bestR = R; }
          }
          if (bestGain <= 0) return { leaf: true, val: totalMean };
          return {
            leaf: false, thr: bestThr,
            left: grow(bestL, depth + 1, maxDepth),
            right: grow(bestR, depth + 1, maxDepth),
          };
        }

        function predictTree(tree, x) {
          if (tree.leaf) return tree.val;
          return x < tree.thr ? predictTree(tree.left, x) : predictTree(tree.right, x);
        }

        function doStep() {
          const lr = +cLR.input.value;
          const depth = +cDepth.input.value;
          const tree = buildTree(residuals, 0, depth);
          trees.push({ tree, lr });
          for (let i = 0; i < xs.length; i++) {
            preds[i] += lr * predictTree(tree, xs[i]);
            residuals[i] = ys[i] - preds[i];
          }
          iter++;
          lossHistory.push(computeLoss());
          draw();
        }

        function draw() {
          // сетка x для кривой
          const gridX = App.Util.linspace(0, 10, 200);
          const gridY = gridX.map(x => {
            let v = F0;
            trees.forEach(({ tree, lr }) => v += lr * predictTree(tree, x));
            return v;
          });

          const ctx = container.querySelector('#gb-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Данные', data: xs.map((x, i) => ({ x, y: ys[i] })), backgroundColor: 'rgba(59,130,246,0.5)', pointRadius: 4 },
                { type: 'line', label: 'Предсказание', data: gridX.map((x, i) => ({ x, y: gridY[i] })), borderColor: '#dc2626', borderWidth: 2.5, pointRadius: 0, fill: false, tension: 0 },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: { x: { type: 'linear', title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'y' } } },
            },
          });
          App.registerChart(chart);

          const ctx2 = container.querySelector('#gb-loss').getContext('2d');
          if (lossChart) lossChart.destroy();
          lossChart = new Chart(ctx2, {
            type: 'line',
            data: {
              labels: lossHistory.map((_, i) => i),
              datasets: [{ label: 'MSE', data: lossHistory, borderColor: '#16a34a', borderWidth: 2, pointRadius: 0, fill: false }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'MSE по итерациям' } },
              scales: { x: { title: { display: true, text: 'Итерация' } }, y: { title: { display: true, text: 'MSE' }, beginAtZero: true } },
            },
          });
          App.registerChart(lossChart);

          container.querySelector('#gb-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Итераций</div><div class="stat-value">${iter}</div></div>
            <div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${App.Util.round(computeLoss(), 4)}</div></div>
            <div class="stat-card"><div class="stat-label">η</div><div class="stat-value">${cLR.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">Глубина дерева</div><div class="stat-value">${cDepth.input.value}</div></div>
          `;
        }

        container.querySelector('#gb-step').onclick = doStep;
        container.querySelector('#gb-step10').onclick = () => { for (let i = 0; i < 10; i++) doStep(); };
        container.querySelector('#gb-reset').onclick = reset;
        container.querySelector('#gb-regen').onclick = genData;
        cNoise.input.addEventListener('change', genData);

        genData();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Kaggle</b> — чемпион на табличных данных.</li>
        <li><b>Ранжирование</b> — LambdaMART в поисковых системах.</li>
        <li><b>Скоринг</b> — банки, страхование, сегментация клиентов.</li>
        <li><b>CTR-prediction</b> — рекламные системы.</li>
        <li><b>Прогнозирование временных рядов</b> — продажи, спрос.</li>
        <li><b>Tabular Deep Learning competitors</b> — часто побеждает нейросети.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Как правило, наилучшее качество на табличных данных</li>
            <li>Работает с разными функциями потерь</li>
            <li>Feature importance</li>
            <li>Обрабатывает пропуски (в XGBoost/LightGBM)</li>
            <li>Хорошо калиброванные вероятности</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Склонен к переобучению при плохой настройке</li>
            <li>Много гиперпараметров</li>
            <li>Медленное обучение (последовательное)</li>
            <li>Чувствителен к шуму</li>
            <li>Плохо параллелится (в отличие от RF)</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Постановка</h3>
      <p>Строим аддитивную модель:</p>
      <div class="math-block">$$F_M(x) = F_0 + \\sum_{m=1}^{M} \\eta \\cdot h_m(x)$$</div>

      <h3>Алгоритм (для функции потерь L)</h3>
      <ol>
        <li>$F_0(x) = \\arg\\min_c \\sum_i L(y_i, c)$</li>
        <li>Для $m = 1, \\dots, M$:
          <ol>
            <li>Вычислить псевдо-residuals: $r_i^{(m)} = -\\left[\\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}}$</li>
            <li>Обучить дерево $h_m$ на $\\{(x_i, r_i^{(m)})\\}$.</li>
            <li>Для каждого листа $j$ найти оптимальное значение $\\gamma_j$.</li>
            <li>$F_m(x) = F_{m-1}(x) + \\eta \\sum_j \\gamma_j \\mathbb{1}[x \\in R_j]$</li>
          </ol>
        </li>
      </ol>

      <h3>Функции потерь и их градиенты</h3>
      <ul>
        <li><b>MSE</b>: $L = (y - F)^2/2$, $-\\nabla = y - F$ (residuals).</li>
        <li><b>MAE</b>: $L = |y - F|$, $-\\nabla = \\text{sign}(y - F)$.</li>
        <li><b>Log-loss</b>: $L = \\log(1 + e^{-yF})$, $-\\nabla = y/(1 + e^{yF})$.</li>
      </ul>

      <h3>XGBoost: второй порядок</h3>
      <p>XGBoost использует разложение функции потерь до второго порядка (Tейлор) и регуляризацию:</p>
      <div class="math-block">$$\\text{Obj} = \\sum_i L(y_i, F(x_i)) + \\sum_k \\Omega(h_k), \\quad \\Omega(h) = \\gamma T + \\frac{1}{2}\\lambda \\|w\\|^2$$</div>
    `,

    extra: `
      <h3>Регуляризация в бустинге</h3>
      <ul>
        <li><b>Learning rate (shrinkage)</b> — самая важная.</li>
        <li><b>Subsample</b> — обучение на случайной подвыборке (stochastic GB).</li>
        <li><b>Colsample</b> — случайный выбор признаков для каждого дерева.</li>
        <li><b>Early stopping</b> — остановка по валидации.</li>
        <li><b>L1/L2 на листьях</b> (в XGBoost/LightGBM).</li>
      </ul>

      <h3>XGBoost vs LightGBM vs CatBoost</h3>
      <table>
        <tr><th>Критерий</th><th>XGBoost</th><th>LightGBM</th><th>CatBoost</th></tr>
        <tr><td>Рост</td><td>Level-wise</td><td>Leaf-wise</td><td>Симметричный</td></tr>
        <tr><td>Скорость</td><td>Средняя</td><td>Быстрая</td><td>Средняя</td></tr>
        <tr><td>Категориальные</td><td>Нет (OHE)</td><td>Есть</td><td>Отлично</td></tr>
        <tr><td>GPU</td><td>Да</td><td>Да</td><td>Да</td></tr>
      </table>

      <h3>Тонкости настройки</h3>
      <ol>
        <li>Начать с небольшого η (0.1), большого числа деревьев и early stopping.</li>
        <li>Настроить глубину (3-8) и min_child_weight.</li>
        <li>Добавить регуляризацию (λ, α, γ).</li>
        <li>Уменьшить η до 0.01-0.03, увеличить n_estimators.</li>
        <li>Subsample, colsample для разнообразия.</li>
      </ol>

      <h3>Практические советы</h3>
      <ul>
        <li>Не забыть early_stopping_rounds.</li>
        <li>На маленьких данных может переобучаться — используй CV.</li>
        <li>Feature importance → SHAP values (лучше для интерпретации).</li>
      </ul>
    `,
  },
});
