/* ==========================================================================
   Логистическая регрессия
   ========================================================================== */
App.registerTopic({
  id: 'logistic-regression',
  category: 'ml',
  title: 'Логистическая регрессия',
  summary: 'Классификация через сигмоиду: предсказываем вероятность класса.',

  tabs: {
    theory: `
      <h3>От линейной к логистической</h3>
      <p>Линейная модель выдаёт число от −∞ до +∞. Для бинарной классификации нужно число от 0 до 1 — вероятность. Решение: пропустить линейную комбинацию через <b>сигмоиду</b>:</p>
      <div class="math-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>

      <h3>Модель</h3>
      <div class="math-block">$$P(y=1 \\mid x) = \\sigma(w_0 + w_1 x_1 + \\dots + w_p x_p)$$</div>

      <h3>Правило классификации</h3>
      <p>Если $P(y=1 \\mid x) > 0.5$ → предсказываем класс 1, иначе 0. Порог можно менять под задачу (precision vs recall).</p>

      <h3>Почему не MSE</h3>
      <p>Для классификации используется <b>log-loss</b> (binary cross-entropy):</p>
      <div class="math-block">$$L = -\\frac{1}{n} \\sum_{i=1}^{n} [y_i \\log(\\hat{p}_i) + (1-y_i) \\log(1-\\hat{p}_i)]$$</div>
      <p>Это максимум правдоподобия для бернуллиевского распределения. Функция выпуклая, легко оптимизируется.</p>

      <div class="callout tip">💡 Несмотря на слово «регрессия», это алгоритм классификации. Слово осталось от «регрессии к вероятности».</div>
    `,

    examples: `
      <h3>Пример 1: вероятность сдачи экзамена</h3>
      <div class="example-card">
        <p>Признак: часы подготовки. Модель:</p>
        <div class="math-block">$$P(\\text{сдал}) = \\sigma(-4 + 1 \\cdot \\text{часы})$$</div>
        <ul>
          <li>0 часов: σ(−4) ≈ 0.018 — 2% шанс</li>
          <li>3 часа: σ(−1) ≈ 0.27 — 27%</li>
          <li>4 часа: σ(0) = 0.5 — точка неопределённости</li>
          <li>5 часов: σ(1) ≈ 0.73</li>
          <li>8 часов: σ(4) ≈ 0.98</li>
        </ul>
      </div>

      <h3>Пример 2: интерпретация коэффициентов (odds ratio)</h3>
      <div class="example-card">
        <p>Если $w_1 = 1.5$, то при росте признака на 1:</p>
        <div class="math-block">$$\\text{odds} \\times e^{1.5} \\approx 4.48$$</div>
        <p>Шансы события увеличиваются в 4.48 раза.</p>
      </div>

      <h3>Пример 3: логиты</h3>
      <div class="example-card">
        <p>Логит $z$ = линейная комбинация признаков. Сигмоида переводит его в вероятность:</p>
        <table>
          <tr><th>z</th><th>σ(z)</th></tr>
          <tr><td>−3</td><td>0.047</td></tr>
          <tr><td>−1</td><td>0.269</td></tr>
          <tr><td>0</td><td>0.5</td></tr>
          <tr><td>1</td><td>0.731</td></tr>
          <tr><td>3</td><td>0.953</td></tr>
        </table>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: логистическая регрессия в 2D</h3>
        <p>Два признака, два класса. Смотри, как меняется граница и вероятности при обучении.</p>
        <div class="sim-container">
          <div class="sim-controls" id="logr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="logr-regen">🔄 Новые данные</button>
            <button class="btn" id="logr-train">🎯 Обучить (100 шагов)</button>
            <button class="btn secondary" id="logr-step">▶ 10 шагов</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:380px;"><canvas id="logr-chart"></canvas></div>
            <div class="sim-stats" id="logr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#logr-controls');
        const cSep = App.makeControl('range', 'logr-sep', 'Разделимость классов', { min: 0.5, max: 5, step: 0.1, value: 2 });
        const cN = App.makeControl('range', 'logr-n', 'Точек на класс', { min: 20, max: 200, step: 10, value: 60 });
        const cLR = App.makeControl('range', 'logr-lr', 'Learning rate', { min: 0.01, max: 1, step: 0.01, value: 0.1 });
        [cSep, cN, cLR].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;
        let X = [], y = [];
        let w = [0, 0, 0]; // w0 (bias), w1, w2
        let iterations = 0;

        function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

        function regenerate() {
          const sep = +cSep.input.value;
          const n = +cN.input.value;
          X = []; y = [];
          for (let i = 0; i < n; i++) {
            X.push([App.Util.randn(-sep, 1), App.Util.randn(-sep, 1)]); y.push(0);
            X.push([App.Util.randn(sep, 1), App.Util.randn(sep, 1)]); y.push(1);
          }
          w = [0, 0, 0];
          iterations = 0;
          update();
        }

        function trainStep() {
          const lr = +cLR.input.value;
          const n = X.length;
          let g0 = 0, g1 = 0, g2 = 0;
          for (let i = 0; i < n; i++) {
            const z = w[0] + w[1] * X[i][0] + w[2] * X[i][1];
            const p = sigmoid(z);
            const err = p - y[i];
            g0 += err;
            g1 += err * X[i][0];
            g2 += err * X[i][1];
          }
          w[0] -= lr * g0 / n;
          w[1] -= lr * g1 / n;
          w[2] -= lr * g2 / n;
          iterations++;
        }

        function train(nSteps) {
          for (let i = 0; i < nSteps; i++) trainStep();
          update();
        }

        function update() {
          const n = X.length;
          // loss + accuracy
          let loss = 0, correct = 0;
          for (let i = 0; i < n; i++) {
            const z = w[0] + w[1] * X[i][0] + w[2] * X[i][1];
            const p = Math.max(1e-9, Math.min(1 - 1e-9, sigmoid(z)));
            loss += -(y[i] * Math.log(p) + (1 - y[i]) * Math.log(1 - p));
            if ((p >= 0.5 ? 1 : 0) === y[i]) correct++;
          }
          loss /= n;

          // граница: w0 + w1*x + w2*y = 0 → y = -(w0 + w1*x)/w2
          const boundary = [];
          const xRange = [-6, 6];
          if (Math.abs(w[2]) > 1e-6) {
            boundary.push({ x: xRange[0], y: -(w[0] + w[1] * xRange[0]) / w[2] });
            boundary.push({ x: xRange[1], y: -(w[0] + w[1] * xRange[1]) / w[2] });
          }

          const ctx = container.querySelector('#logr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Класс 0', data: X.filter((_, i) => y[i] === 0).map(([a, b]) => ({ x: a, y: b })), backgroundColor: 'rgba(239, 68, 68, 0.6)', pointRadius: 4 },
                { label: 'Класс 1', data: X.filter((_, i) => y[i] === 1).map(([a, b]) => ({ x: a, y: b })), backgroundColor: 'rgba(59, 130, 246, 0.6)', pointRadius: 4 },
                { type: 'line', label: 'Граница', data: boundary, borderColor: '#16a34a', borderWidth: 2.5, pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: { x: { type: 'linear', min: -6, max: 6, title: { display: true, text: 'x₁' } }, y: { min: -6, max: 6, title: { display: true, text: 'x₂' } } },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#logr-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Итераций', iterations],
            ['Log-loss', App.Util.round(loss, 4)],
            ['Accuracy', (correct / n * 100).toFixed(1) + '%'],
            ['w₀ (bias)', App.Util.round(w[0], 3)],
            ['w₁', App.Util.round(w[1], 3)],
            ['w₂', App.Util.round(w[2], 3)],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [cSep, cN].forEach((c) => c.input.addEventListener('change', regenerate));
        container.querySelector('#logr-regen').onclick = regenerate;
        container.querySelector('#logr-train').onclick = () => train(100);
        container.querySelector('#logr-step').onclick = () => train(10);
        regenerate();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Скоринг клиентов</b> — вероятность дефолта по кредиту.</li>
        <li><b>Медицинская диагностика</b> — наличие/отсутствие болезни.</li>
        <li><b>Фильтрация спама</b> — вероятность, что письмо спам.</li>
        <li><b>Маркетинг</b> — вероятность отклика клиента на предложение.</li>
        <li><b>CTR prediction</b> — клик или не клик.</li>
        <li><b>Baseline для классификации</b> — первая модель для сравнения.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Выдаёт калиброванные вероятности</li>
            <li>Хорошо интерпретируется через odds ratio</li>
            <li>Быстрое обучение</li>
            <li>Легко добавлять регуляризацию</li>
            <li>Устойчива к небольшим наборам данных</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Линейная граница — не ловит сложные зависимости</li>
            <li>Плохо работает с коррелированными признаками</li>
            <li>Требует предобработки (масштабирование)</li>
            <li>Плохо с выбросами</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Модель</h3>
      <div class="math-block">$$P(y=1 \\mid x) = \\sigma(\\mathbf{w}^T \\mathbf{x}) = \\frac{1}{1 + e^{-\\mathbf{w}^T \\mathbf{x}}}$$</div>

      <h4>Log-odds (логит)</h4>
      <div class="math-block">$$\\text{logit}(p) = \\log\\frac{p}{1-p} = \\mathbf{w}^T \\mathbf{x}$$</div>

      <h4>Правдоподобие</h4>
      <div class="math-block">$$L(\\mathbf{w}) = \\prod_{i=1}^{n} \\hat{p}_i^{y_i} (1-\\hat{p}_i)^{1-y_i}$$</div>

      <h4>Log-loss (отрицательный логарифм правдоподобия)</h4>
      <div class="math-block">$$\\mathcal{L}(\\mathbf{w}) = -\\frac{1}{n}\\sum_{i=1}^{n}[y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)]$$</div>

      <h4>Градиент</h4>
      <div class="math-block">$$\\nabla_\\mathbf{w} \\mathcal{L} = \\frac{1}{n} X^T (\\hat{p} - y)$$</div>

      <h4>Обновление</h4>
      <div class="math-block">$$\\mathbf{w} \\gets \\mathbf{w} - \\eta \\nabla_\\mathbf{w} \\mathcal{L}$$</div>

      <h4>Многоклассовая (softmax)</h4>
      <div class="math-block">$$P(y=k \\mid x) = \\frac{e^{\\mathbf{w}_k^T \\mathbf{x}}}{\\sum_{j=1}^{K} e^{\\mathbf{w}_j^T \\mathbf{x}}}$$</div>
    `,

    extra: `
      <h3>Выбор порога</h3>
      <p>Порог 0.5 оптимален, только если ошибки FP и FN одинаково плохи. В медицине/fraud detection порог сильно смещают. Используй ROC-кривую и AUC.</p>

      <h3>Регуляризация</h3>
      <ul>
        <li><b>L2 (Ridge)</b>: $+ \\lambda \\|w\\|_2^2$ — сжимает веса.</li>
        <li><b>L1 (Lasso)</b>: $+ \\lambda \\|w\\|_1$ — зануляет.</li>
        <li>В sklearn: параметр C = 1/λ.</li>
      </ul>

      <h3>Калибровка вероятностей</h3>
      <p>Логрег обычно хорошо откалиброван «из коробки». Проверять: reliability diagram, Brier score.</p>

      <h3>Дисбаланс классов</h3>
      <ul>
        <li><b>class_weight='balanced'</b> — штраф за ошибки в редком классе.</li>
        <li>Oversampling/SMOTE.</li>
        <li>Изменение порога.</li>
      </ul>

      <h3>Связь с другими моделями</h3>
      <ul>
        <li>Логрег = 1-слойная нейросеть с сигмоидой.</li>
        <li>Softmax регрессия = многоклассовое обобщение.</li>
        <li>SVM с ядром ≈ логрег в признаковом пространстве.</li>
      </ul>
    `,
  },
});
