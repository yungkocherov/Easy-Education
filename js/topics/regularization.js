/* ==========================================================================
   Регуляризация (L1, L2, Elastic Net)
   ========================================================================== */
App.registerTopic({
  id: 'regularization',
  category: 'ml-basics',
  title: 'Регуляризация',
  summary: 'L1, L2, ElasticNet — контроль сложности модели через штрафы.',

  tabs: {
    theory: `
      <h3>Проблема</h3>
      <p>Когда модель слишком гибкая или данных мало, она подгоняет шум. Веса становятся огромными, между признаками — диким взаимодействием. Решение: штрафовать большие веса.</p>

      <h3>Новая функция потерь</h3>
      <p>К обычному loss добавляем штраф за веса:</p>
      <div class="math-block">$$L_{\\text{reg}}(\\mathbf{w}) = L_{\\text{data}}(\\mathbf{w}) + \\lambda \\cdot R(\\mathbf{w})$$</div>
      <p>λ — сила регуляризации. Большой λ → сильный штраф → веса ближе к нулю.</p>

      <h3>L2 (Ridge)</h3>
      <div class="math-block">$$R(\\mathbf{w}) = \\|\\mathbf{w}\\|_2^2 = \\sum_j w_j^2$$</div>
      <ul>
        <li>Сжимает все веса пропорционально.</li>
        <li>Не зануляет (все признаки остаются).</li>
        <li>Гладкая, легко оптимизируется.</li>
        <li>Хорошо при мультиколлинеарности.</li>
      </ul>

      <h3>L1 (Lasso)</h3>
      <div class="math-block">$$R(\\mathbf{w}) = \\|\\mathbf{w}\\|_1 = \\sum_j |w_j|$$</div>
      <ul>
        <li>Зануляет часть весов — автоматический <b>feature selection</b>.</li>
        <li>Делает модель разреженной.</li>
        <li>Не дифференцируема в нуле — сложнее оптимизация.</li>
      </ul>

      <h3>Elastic Net</h3>
      <div class="math-block">$$R(\\mathbf{w}) = \\alpha \\|\\mathbf{w}\\|_1 + (1-\\alpha) \\|\\mathbf{w}\\|_2^2$$</div>
      <p>Комбинация. Разреженность от L1 + устойчивость L2.</p>

      <div class="callout tip">💡 Геометрическая интуиция: L2 — круг в пространстве весов, L1 — ромб с углами на осях. В углах происходит зануление.</div>
    `,

    examples: `
      <h3>Пример 1: игрушечные веса</h3>
      <div class="example-card">
        <p>Без регуляризации: $w = [3.2, -0.01, 5.7, 0.05, -2.1]$</p>
        <p>L2 (λ=1): $w = [1.8, -0.005, 3.1, 0.02, -1.2]$ — все меньше, но все остались.</p>
        <p>L1 (λ=1): $w = [1.5, 0, 2.8, 0, -0.9]$ — два признака занулены.</p>
      </div>

      <h3>Пример 2: сколько настроек гипер-параметра λ</h3>
      <div class="example-card">
        <p>λ обычно подбирается по сетке: [0.001, 0.01, 0.1, 1, 10, 100] через CV. В sklearn часто используется C = 1/λ: большой C → слабая регуляризация.</p>
      </div>

      <h3>Пример 3: эффект в регрессии</h3>
      <div class="example-card">
        <p>У нас 100 признаков, но влияют только 10. Без регуляризации модель «выдумает» связи в 90 остальных → переобучение.</p>
        <p>L1 найдёт разреженное решение — подавит шумовые признаки.</p>
        <p>L2 просто ослабит все веса — тоже поможет, но менее выразительно.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: как λ влияет на веса</h3>
        <p>Полиномиальная регрессия с регуляризацией. Увеличивай λ и смотри, как сжимаются веса.</p>
        <div class="sim-container">
          <div class="sim-controls" id="reg-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="reg-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="reg-fit"></canvas></div>
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="reg-weights"></canvas></div>
            </div>
            <div class="sim-stats" id="reg-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#reg-controls');
        const cLam = App.makeControl('range', 'reg-lam', 'log₁₀(λ)', { min: -5, max: 3, step: 0.1, value: -2 });
        const cType = App.makeControl('select', 'reg-type', 'Тип', {
          options: [{ value: 'l2', label: 'L2 (Ridge)' }, { value: 'l1', label: 'L1 (Lasso)' }, { value: 'none', label: 'Без регуляризации' }],
          value: 'l2',
        });
        const cDeg = App.makeControl('range', 'reg-deg', 'Степень полинома', { min: 3, max: 15, step: 1, value: 10 });
        const cNoise = App.makeControl('range', 'reg-noise', 'Шум', { min: 0, max: 0.8, step: 0.05, value: 0.3 });
        const cN = App.makeControl('range', 'reg-n', 'Точек', { min: 10, max: 80, step: 5, value: 20 });
        [cLam, cType, cDeg, cNoise, cN].forEach(c => controls.appendChild(c.wrap));

        let fitChart = null, wChart = null;
        let xTrain = [], yTrain = [];

        function truefn(x) { return Math.sin(1.5 * x); }

        function regen() {
          const n = +cN.input.value, noise = +cNoise.input.value;
          xTrain = []; yTrain = [];
          for (let i = 0; i < n; i++) {
            const x = -3 + 6 * Math.random();
            xTrain.push(x); yTrain.push(truefn(x) + App.Util.randn(0, noise));
          }
          update();
        }

        // Решение ridge: (X^T X + λI) w = X^T y
        function fitRidge(xs, ys, deg, lam) {
          const n = xs.length, p = deg + 1;
          const X = xs.map(x => { const row = []; for (let d = 0; d <= deg; d++) row.push(Math.pow(x, d)); return row; });
          const A = Array.from({ length: p }, () => new Array(p).fill(0));
          const b = new Array(p).fill(0);
          for (let i = 0; i < n; i++) {
            for (let r = 0; r < p; r++) {
              for (let c = 0; c < p; c++) A[r][c] += X[i][r] * X[i][c];
              b[r] += X[i][r] * ys[i];
            }
          }
          for (let r = 0; r < p; r++) A[r][r] += lam;
          // Gauss elim
          for (let i = 0; i < p; i++) {
            let mx = i;
            for (let k = i + 1; k < p; k++) if (Math.abs(A[k][i]) > Math.abs(A[mx][i])) mx = k;
            [A[i], A[mx]] = [A[mx], A[i]]; [b[i], b[mx]] = [b[mx], b[i]];
            for (let k = i + 1; k < p; k++) {
              const f = A[k][i] / A[i][i];
              for (let j = i; j < p; j++) A[k][j] -= f * A[i][j];
              b[k] -= f * b[i];
            }
          }
          const w = new Array(p).fill(0);
          for (let i = p - 1; i >= 0; i--) {
            let s = b[i];
            for (let j = i + 1; j < p; j++) s -= A[i][j] * w[j];
            w[i] = s / A[i][i];
          }
          return w;
        }

        // Coordinate descent для Lasso
        function fitLasso(xs, ys, deg, lam) {
          const n = xs.length, p = deg + 1;
          const X = xs.map(x => { const row = []; for (let d = 0; d <= deg; d++) row.push(Math.pow(x, d)); return row; });
          // нормализация колонок
          const scales = new Array(p).fill(0);
          for (let j = 0; j < p; j++) {
            let s = 0; for (let i = 0; i < n; i++) s += X[i][j] * X[i][j];
            scales[j] = Math.sqrt(s / n) || 1;
            for (let i = 0; i < n; i++) X[i][j] /= scales[j];
          }
          const w = new Array(p).fill(0);
          const r = [...ys];
          for (let it = 0; it < 500; it++) {
            let maxDiff = 0;
            for (let j = 0; j < p; j++) {
              let num = 0, den = 0;
              for (let i = 0; i < n; i++) {
                const rij = r[i] + w[j] * X[i][j];
                num += X[i][j] * rij;
                den += X[i][j] * X[i][j];
              }
              num /= n; den /= n;
              const wj_old = w[j];
              // soft threshold
              const thr = lam;
              let wj_new;
              if (num > thr) wj_new = (num - thr) / den;
              else if (num < -thr) wj_new = (num + thr) / den;
              else wj_new = 0;
              if (j === 0) wj_new = num / den; // не штрафуем intercept
              const d = wj_new - wj_old;
              if (Math.abs(d) > maxDiff) maxDiff = Math.abs(d);
              for (let i = 0; i < n; i++) r[i] -= d * X[i][j];
              w[j] = wj_new;
            }
            if (maxDiff < 1e-6) break;
          }
          // деномализуем
          return w.map((v, j) => v / scales[j]);
        }

        function predict(w, x) { let s = 0; for (let d = 0; d < w.length; d++) s += w[d] * Math.pow(x, d); return s; }

        function update() {
          const type = cType.input.value;
          const deg = +cDeg.input.value;
          const lam = Math.pow(10, +cLam.input.value);
          let w;
          if (type === 'none') w = fitRidge(xTrain, yTrain, deg, 1e-8);
          else if (type === 'l2') w = fitRidge(xTrain, yTrain, deg, lam);
          else w = fitLasso(xTrain, yTrain, deg, lam);

          const gridX = App.Util.linspace(-3, 3, 200);
          const ctx = container.querySelector('#reg-fit').getContext('2d');
          if (fitChart) fitChart.destroy();
          fitChart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Train', data: xTrain.map((x, i) => ({ x, y: yTrain[i] })), backgroundColor: 'rgba(59,130,246,0.5)', pointRadius: 3 },
                { type: 'line', label: 'True', data: gridX.map(x => ({ x, y: truefn(x) })), borderColor: '#94a3b8', borderWidth: 2, pointRadius: 0, fill: false, borderDash: [5, 5] },
                { type: 'line', label: 'Модель', data: gridX.map(x => ({ x, y: predict(w, x) })), borderColor: '#dc2626', borderWidth: 2.5, pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: { x: { type: 'linear', min: -3.5, max: 3.5 }, y: { min: -3, max: 3 } },
            },
          });
          App.registerChart(fitChart);

          const ctx2 = container.querySelector('#reg-weights').getContext('2d');
          if (wChart) wChart.destroy();
          wChart = new Chart(ctx2, {
            type: 'bar',
            data: {
              labels: w.map((_, i) => `w${i}`),
              datasets: [{ data: w, backgroundColor: w.map(v => Math.abs(v) < 1e-5 ? 'rgba(148,163,184,0.3)' : 'rgba(99,102,241,0.7)') }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'Веса модели' } },
              scales: { y: { title: { display: true, text: 'Значение' } } },
            },
          });
          App.registerChart(wChart);

          let trainErr = 0; xTrain.forEach((x, i) => { trainErr += (yTrain[i] - predict(w, x)) ** 2; }); trainErr /= xTrain.length;
          const nonZero = w.filter(v => Math.abs(v) > 1e-5).length;
          const norm = Math.sqrt(w.reduce((s, v) => s + v * v, 0));

          container.querySelector('#reg-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">λ</div><div class="stat-value">${lam.toExponential(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Train MSE</div><div class="stat-value">${trainErr.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">‖w‖₂</div><div class="stat-value">${norm.toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Ненулевых весов</div><div class="stat-value">${nonZero}/${w.length}</div></div>
          `;
        }

        [cLam, cDeg, cType].forEach(c => c.input.addEventListener('input', update));
        [cN, cNoise].forEach(c => c.input.addEventListener('change', regen));
        container.querySelector('#reg-regen').onclick = regen;
        regen();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Линейная регрессия с многими признаками</b> — борьба с overfit.</li>
        <li><b>Feature selection</b> — L1 сам выбирает важные.</li>
        <li><b>Логистическая регрессия</b> — встроенная регуляризация.</li>
        <li><b>SVM</b> — параметр C управляет регуляризацией.</li>
        <li><b>Нейросети</b> — L2 (weight decay), dropout.</li>
        <li><b>Градиентный бустинг</b> — λ, α для листьев в XGBoost.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Борется с overfitting</li>
            <li>Улучшает обобщение</li>
            <li>L1 даёт feature selection</li>
            <li>L2 стабилизирует мультиколлинеарность</li>
            <li>Уменьшает чувствительность к шуму</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Требует настройки λ</li>
            <li>Слишком сильная регуляризация → underfit</li>
            <li>L1 нестабилен при коррелированных признаках</li>
            <li>Нужна стандартизация признаков</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Ridge (L2)</h3>
      <div class="math-block">$$\\mathbf{w}^* = \\arg\\min_\\mathbf{w} \\|y - X\\mathbf{w}\\|^2 + \\lambda \\|\\mathbf{w}\\|_2^2$$</div>
      <p>Аналитическое решение:</p>
      <div class="math-block">$$\\mathbf{w}^* = (X^T X + \\lambda I)^{-1} X^T y$$</div>

      <h3>Lasso (L1)</h3>
      <div class="math-block">$$\\mathbf{w}^* = \\arg\\min_\\mathbf{w} \\|y - X\\mathbf{w}\\|^2 + \\lambda \\|\\mathbf{w}\\|_1$$</div>
      <p>Нет closed-form. Решается координатным спуском или проксимальными методами.</p>

      <h3>Soft-thresholding (для Lasso)</h3>
      <div class="math-block">$$S_\\lambda(z) = \\text{sign}(z) \\cdot \\max(|z| - \\lambda, 0)$$</div>

      <h3>Elastic Net</h3>
      <div class="math-block">$$\\mathbf{w}^* = \\arg\\min \\|y - X\\mathbf{w}\\|^2 + \\lambda_1 \\|\\mathbf{w}\\|_1 + \\lambda_2 \\|\\mathbf{w}\\|_2^2$$</div>

      <h3>Байесовская интерпретация</h3>
      <ul>
        <li><b>L2 = Gaussian prior</b> на веса: $w_j \\sim N(0, 1/\\lambda)$.</li>
        <li><b>L1 = Laplace prior</b>: $w_j \\sim \\text{Laplace}(0, 1/\\lambda)$.</li>
        <li>MAP оценка → регуляризованная задача.</li>
      </ul>
    `,

    extra: `
      <h3>Геометрия L1 vs L2</h3>
      <p>Контур L2 — окружность/сфера. Контур L1 — ромб с углами на осях координат. Оптимум при пересечении контура loss с контуром штрафа. L1 с большей вероятностью попадает в угол (зануляет компоненты).</p>

      <h3>Стандартизация обязательна</h3>
      <p>Регуляризация штрафует все веса одинаково. Если признаки разного масштаба — будет несправедливость. <b>Всегда StandardScaler</b> перед регуляризированной моделью.</p>

      <h3>Регуляризация в нейросетях</h3>
      <ul>
        <li><b>Weight decay</b> = L2 на веса.</li>
        <li><b>Dropout</b> — случайно занулять активации.</li>
        <li><b>Batch Normalization</b> — имеет регуляризующий эффект.</li>
        <li><b>Early stopping</b> — остановка до переобучения.</li>
        <li><b>Data augmentation</b> — регуляризация через данные.</li>
        <li><b>Label smoothing</b> — мягкие цели.</li>
      </ul>

      <h3>Подбор λ</h3>
      <ul>
        <li><b>CV</b> — стандарт.</li>
        <li><b>LARS path</b> — даёт весь путь решений Lasso.</li>
        <li><b>AIC/BIC</b> — теоретические критерии.</li>
        <li><b>1-SE rule</b>: взять наибольший λ, который в пределах 1 SE от минимума CV.</li>
      </ul>

      <h3>Когда что</h3>
      <table>
        <tr><th>Ситуация</th><th>Что использовать</th></tr>
        <tr><td>Много признаков, мало важных</td><td>L1</td></tr>
        <tr><td>Все признаки могут быть важны</td><td>L2</td></tr>
        <tr><td>Коррелированные признаки</td><td>L2 или Elastic Net</td></tr>
        <tr><td>Нужна интерпретация</td><td>L1</td></tr>
      </table>
    `,
  },
});
