/* ==========================================================================
   Линейная регрессия
   ========================================================================== */
App.registerTopic({
  id: 'linear-regression',
  category: 'ml',
  title: 'Линейная регрессия',
  summary: 'Предсказание непрерывной переменной прямой линией через облако точек.',

  tabs: {
    theory: `
      <h3>Задача</h3>
      <p>У нас есть признаки $X$ и числовой таргет $y$. Хотим найти такую прямую (или гиперплоскость), которая наилучшим образом приближает данные:</p>
      <div class="math-block">$$\\hat{y} = w_0 + w_1 x_1 + w_2 x_2 + \\dots + w_p x_p$$</div>

      <h3>Что значит «наилучшим образом»</h3>
      <p>Минимизируем <b>сумму квадратов ошибок</b> (MSE):</p>
      <div class="math-block">$$L(\\mathbf{w}) = \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 \\to \\min$$</div>

      <h3>Почему квадраты</h3>
      <ul>
        <li>Большие ошибки наказываются сильнее — модель «боится» промахиваться сильно.</li>
        <li>Функция гладкая, легко дифференцируется.</li>
        <li>При нормально распределённом шуме MSE = максимум правдоподобия.</li>
      </ul>

      <h3>Геометрия</h3>
      <p>Ищем проекцию вектора $y$ на подпространство, натянутое на столбцы $X$. Предсказания $\\hat{y} = Xw$ — это ближайшая к $y$ точка в этом подпространстве по евклидовой норме.</p>

      <div class="callout tip">💡 Линейная регрессия — самая прозрачная модель. Коэффициенты напрямую говорят: «при росте признака на 1 целевая растёт на $w_i$».</div>
    `,

    examples: `
      <h3>Пример 1: цена квартиры от площади</h3>
      <div class="example-card">
        <div class="example-data">Площадь (м²): 30, 40, 50, 60, 70
Цена (к):      90, 120, 140, 170, 200</div>
        <p>Ищем $y = w_0 + w_1 x$.</p>
        <p>Формулы:</p>
        <div class="math-block">$$w_1 = \\frac{\\mathrm{Cov}(x, y)}{\\mathrm{Var}(x)}, \\quad w_0 = \\bar{y} - w_1 \\bar{x}$$</div>
        <p>$\\bar{x} = 50$, $\\bar{y} = 144$. Cov(x,y) = 675, Var(x) = 250.</p>
        <p>$w_1 = 675/250 = 2.7$, $w_0 = 144 - 2.7 \\cdot 50 = 9$.</p>
        <p><b>Модель:</b> цена = 9 + 2.7 · площадь. За каждый м² цена растёт на 2.7к.</p>
      </div>

      <h3>Пример 2: предсказание для новой квартиры</h3>
      <div class="example-card">
        <p>Квартира 55 м²: $\\hat{y} = 9 + 2.7 \\cdot 55 = 157.5$ (к).</p>
        <p>Квартира 100 м²: $\\hat{y} = 9 + 2.7 \\cdot 100 = 279$ (к) — но это экстраполяция, вне обучающего диапазона, доверяй осторожно.</p>
      </div>

      <h3>Пример 3: оценка качества (R²)</h3>
      <div class="example-card">
        <p>R² = 1 − SSres/SStot — доля объяснённой дисперсии.</p>
        <ul>
          <li>R² = 1 — идеальная подгонка</li>
          <li>R² = 0.7 — модель объясняет 70% разброса y</li>
          <li>R² = 0 — модель не лучше, чем просто предсказывать среднее</li>
          <li>R² < 0 — модель хуже константы (это плохо!)</li>
        </ul>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: подбор прямой</h3>
        <p>Управляй углом, сдвигом, шумом и количеством точек. Наблюдай, как меняется MSE и R².</p>
        <div class="sim-container">
          <div class="sim-controls" id="lr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="lr-regen">🔄 Новые данные</button>
            <button class="btn secondary" id="lr-fit">✓ Подогнать оптимально</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="lr-chart"></canvas></div>
            <div class="sim-stats" id="lr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#lr-controls');
        const cTrueW = App.makeControl('range', 'lr-true-w', 'Истинный наклон', { min: -3, max: 3, step: 0.1, value: 1.5 });
        const cTrueB = App.makeControl('range', 'lr-true-b', 'Истинный сдвиг', { min: -5, max: 5, step: 0.5, value: 2 });
        const cNoise = App.makeControl('range', 'lr-noise', 'Шум σ', { min: 0, max: 5, step: 0.1, value: 1.5 });
        const cN = App.makeControl('range', 'lr-n', 'Число точек', { min: 10, max: 200, step: 5, value: 50 });
        const cGuessW = App.makeControl('range', 'lr-guess-w', 'Наш наклон $\\hat{w}$', { min: -3, max: 3, step: 0.05, value: 1 });
        const cGuessB = App.makeControl('range', 'lr-guess-b', 'Наш сдвиг $\\hat{b}$', { min: -5, max: 5, step: 0.1, value: 0 });
        [cTrueW, cTrueB, cNoise, cN, cGuessW, cGuessB].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;
        let dataX = [], dataY = [];

        function regenerate() {
          const w = +cTrueW.input.value;
          const b = +cTrueB.input.value;
          const sigma = +cNoise.input.value;
          const n = +cN.input.value;
          dataX = []; dataY = [];
          for (let i = 0; i < n; i++) {
            const x = Math.random() * 10 - 5;
            const y = w * x + b + App.Util.randn(0, sigma);
            dataX.push(x);
            dataY.push(y);
          }
          update();
        }

        function fitOptimal() {
          // Аналитическое решение
          const mx = App.Util.mean(dataX), my = App.Util.mean(dataY);
          let num = 0, den = 0;
          for (let i = 0; i < dataX.length; i++) {
            num += (dataX[i] - mx) * (dataY[i] - my);
            den += (dataX[i] - mx) ** 2;
          }
          const w = num / den;
          const b = my - w * mx;
          cGuessW.input.value = w.toFixed(2);
          cGuessB.input.value = b.toFixed(2);
          cGuessW.wrap.querySelector('.value-display').textContent = w.toFixed(2);
          cGuessB.wrap.querySelector('.value-display').textContent = b.toFixed(2);
          update();
        }

        function update() {
          const gw = +cGuessW.input.value;
          const gb = +cGuessB.input.value;

          // предсказания + ошибки
          const preds = dataX.map((x) => gw * x + gb);
          let mse = 0, ssRes = 0, ssTot = 0;
          const my = App.Util.mean(dataY);
          for (let i = 0; i < dataX.length; i++) {
            const e = dataY[i] - preds[i];
            mse += e * e;
            ssRes += e * e;
            ssTot += (dataY[i] - my) ** 2;
          }
          mse /= dataX.length;
          const r2 = 1 - ssRes / ssTot;

          const lineXs = [-5, 5];
          const lineYs = lineXs.map((x) => gw * x + gb);

          const ctx = container.querySelector('#lr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                {
                  label: 'Данные',
                  data: dataX.map((x, i) => ({ x, y: dataY[i] })),
                  backgroundColor: 'rgba(59, 130, 246, 0.55)',
                  pointRadius: 4,
                },
                {
                  type: 'line',
                  label: 'Наша прямая',
                  data: lineXs.map((x, i) => ({ x, y: lineYs[i] })),
                  borderColor: '#dc2626',
                  borderWidth: 2.5,
                  pointRadius: 0,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: {
                x: { type: 'linear', title: { display: true, text: 'X' }, min: -5, max: 5 },
                y: { title: { display: true, text: 'Y' } },
              },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#lr-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['MSE', App.Util.round(mse, 3)],
            ['RMSE', App.Util.round(Math.sqrt(mse), 3)],
            ['R²', App.Util.round(r2, 3)],
            ['Истинный w', cTrueW.input.value],
            ['Наш ŵ', gw.toFixed(2)],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [cTrueW, cTrueB, cNoise, cN].forEach((c) => c.input.addEventListener('input', regenerate));
        [cGuessW, cGuessB].forEach((c) => c.input.addEventListener('input', update));
        container.querySelector('#lr-regen').onclick = regenerate;
        container.querySelector('#lr-fit').onclick = fitOptimal;
        regenerate();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Прогноз цен</b> — недвижимость, товары, акции (как базовая модель).</li>
        <li><b>Экономика и эконометрика</b> — влияние факторов на ВВП, инфляцию.</li>
        <li><b>Биостатистика</b> — зависимости показателей здоровья от возраста, веса.</li>
        <li><b>Маркетинг</b> — влияние бюджета рекламы на продажи.</li>
        <li><b>Baseline в ML</b> — всегда начинают с неё, чтоб понять, нужна ли сложная модель.</li>
        <li><b>Intrepretability</b> — когда важно объяснить, почему модель выдаёт прогноз.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Максимально интерпретируема</li>
            <li>Аналитическое решение (не нужна итерация)</li>
            <li>Быстро обучается, быстро предсказывает</li>
            <li>Мало данных достаточно</li>
            <li>Легко добавлять регуляризацию (Ridge, Lasso)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Ловит только линейные зависимости</li>
            <li>Чувствительна к выбросам</li>
            <li>Требует отсутствия мультиколлинеарности</li>
            <li>Предполагает константную дисперсию ошибок (гомоскедастичность)</li>
            <li>Предполагает независимость ошибок</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Матричная форма</h3>
      <div class="math-block">$$\\hat{\\mathbf{y}} = X \\mathbf{w}$$</div>

      <h4>Функция потерь</h4>
      <div class="math-block">$$L(\\mathbf{w}) = \\|y - X\\mathbf{w}\\|^2 = (y - Xw)^T(y - Xw)$$</div>

      <h4>Аналитическое решение (нормальное уравнение)</h4>
      <div class="math-block">$$\\nabla_\\mathbf{w} L = -2 X^T(y - X\\mathbf{w}) = 0 \\implies \\mathbf{w}^* = (X^T X)^{-1} X^T y$$</div>

      <h4>Градиентный спуск</h4>
      <div class="math-block">$$\\mathbf{w}_{t+1} = \\mathbf{w}_t - \\eta \\cdot \\frac{2}{n} X^T (X\\mathbf{w}_t - y)$$</div>

      <h4>Регуляризованные варианты</h4>
      <p><b>Ridge (L2):</b></p>
      <div class="math-block">$$L(\\mathbf{w}) = \\|y - X\\mathbf{w}\\|^2 + \\lambda \\|\\mathbf{w}\\|_2^2$$</div>
      <p><b>Lasso (L1):</b></p>
      <div class="math-block">$$L(\\mathbf{w}) = \\|y - X\\mathbf{w}\\|^2 + \\lambda \\|\\mathbf{w}\\|_1$$</div>

      <h4>Метрики качества</h4>
      <ul>
        <li>MSE: $\\frac{1}{n}\\sum(y_i - \\hat{y}_i)^2$</li>
        <li>RMSE: $\\sqrt{MSE}$</li>
        <li>MAE: $\\frac{1}{n}\\sum|y_i - \\hat{y}_i|$</li>
        <li>R²: $1 - \\frac{SS_{res}}{SS_{tot}}$</li>
      </ul>
    `,

    extra: `
      <h3>Предположения линейной регрессии (LINE)</h3>
      <ul>
        <li><b>L</b>inearity — связь между X и y линейна.</li>
        <li><b>I</b>ndependence — ошибки независимы.</li>
        <li><b>N</b>ormality — ошибки распределены нормально (важно для CI и p-value).</li>
        <li><b>E</b>qual variance — гомоскедастичность.</li>
      </ul>

      <h3>Диагностика</h3>
      <ul>
        <li><b>Residual plot</b> — ошибки должны быть случайным облаком без паттернов.</li>
        <li><b>Q-Q plot ошибок</b> — для проверки нормальности.</li>
        <li><b>VIF</b> — для детекции мультиколлинеарности (VIF > 10 — плохо).</li>
      </ul>

      <h3>Когда линейной недостаточно</h3>
      <ul>
        <li><b>Полиномиальная регрессия</b> — добавить $x^2, x^3$, остаётся линейной по параметрам.</li>
        <li><b>Сплайны</b> — кусочно-полиномиальные.</li>
        <li><b>GAM</b> — обобщённые аддитивные модели.</li>
        <li><b>Нелинейные модели</b> — деревья, ядра, нейросети.</li>
      </ul>

      <h3>Ridge vs Lasso</h3>
      <ul>
        <li><b>Ridge</b> — сжимает все коэффициенты, но не зануляет. Хорошо при мультиколлинеарности.</li>
        <li><b>Lasso</b> — зануляет некоторые коэффициенты → feature selection.</li>
        <li><b>ElasticNet</b> — комбинация обоих.</li>
      </ul>
    `,
  },
});
