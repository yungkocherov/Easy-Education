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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты продаёшь квартиры и хочешь оценивать их цену. Ты замечаешь: чем больше площадь, тем дороже квартира. Но <b>насколько</b> дороже? Можно провести простое правило: «каждый квадратный метр стоит 3 тысячи». Это и есть линейная регрессия в простейшем виде.</p>
        <p>Дальше можно добавить этажей, комнат, расстояния до метро, и твоя формула станет: «цена = базовая + 3·метры + 100·удобство метро − 5·удалённость». Ты научился связывать признаки с целевой величиной простой формулой.</p>
        <p>Линейная регрессия рисует <b>прямую линию</b> (или плоскость) через облако точек, которая лучше всего описывает зависимость. «Лучше всего» значит «точки в среднем ближе всего к этой прямой».</p>
      </div>

      <h3>Задача линейной регрессии</h3>
      <p>У нас есть набор наблюдений: каждое — это пара (признаки, целевая величина). Признаки — это характеристики объекта (площадь квартиры, возраст клиента, температура). Целевая — число, которое мы хотим предсказать (цена, доход, продажи).</p>
      <p>Цель: найти <b>формулу</b>, которая связывает признаки с целевой:</p>
      <div class="math-block">$$\\hat{y} = w_0 + w_1 x_1 + w_2 x_2 + \\ldots + w_p x_p$$</div>

      <p>Где:</p>
      <ul>
        <li>$\\hat{y}$ — предсказание (шляпка означает «оценка»).</li>
        <li>$x_1, x_2, \\ldots, x_p$ — признаки объекта.</li>
        <li>$w_0$ — <span class="term" data-tip="Intercept / bias. Свободный член — значение y при всех x = 0. Геометрически — где прямая пересекает ось y.">intercept (свободный член)</span>.</li>
        <li>$w_1, \\ldots, w_p$ — веса признаков (насколько каждый признак влияет на y).</li>
      </ul>

      <p>Задача обучения — <b>найти веса</b> $w_0, w_1, \\ldots, w_p$, которые делают предсказания как можно ближе к истинным значениям.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Линейная регрессия предполагает, что целевая величина — это <b>взвешенная сумма</b> признаков плюс константа. Это сильное упрощение, но для многих задач оно работает удивительно хорошо и даёт очень интерпретируемую модель.</p>
      </div>

      <h3>Что значит «наилучшая прямая»</h3>
      <p>Для каждого наблюдения мы можем посчитать <b>ошибку</b>: разницу между истинным $y_i$ и предсказанием $\\hat{y}_i$. Эта ошибка называется <span class="term" data-tip="Residual. Остаток — разница между фактическим значением и предсказанием модели: r_i = y_i - ŷ_i. Показывает, как сильно модель ошиблась на этом примере.">остатком</span>: $r_i = y_i - \\hat{y}_i$.</p>
      <p>Наша цель — подобрать веса так, чтобы остатки были <b>в среднем</b> как можно меньше. Но просто «минимизировать остатки» не работает: положительные и отрицательные компенсируют друг друга.</p>
      <p>Решение: минимизировать <b>сумму квадратов</b> остатков (OLS — Ordinary Least Squares):</p>
      <div class="math-block">$$L(\\mathbf{w}) = \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 \\to \\min$$</div>

      <h3>Почему именно квадраты?</h3>
      <ul>
        <li><b>Положительность:</b> квадрат всегда ≥ 0, положительные и отрицательные ошибки не сокращаются.</li>
        <li><b>Большие ошибки штрафуются сильнее:</b> ошибка 10 даёт штраф 100, ошибка 1 — штраф 1. Модель «боится» больших промахов.</li>
        <li><b>Гладкость:</b> квадрат легко дифференцировать — удобно для оптимизации.</li>
        <li><b>Статистический смысл:</b> при нормально распределённом шуме минимизация квадратов даёт <span class="term" data-tip="Maximum Likelihood Estimation. Метод оценки параметров, максимизирующий вероятность наблюдаемых данных. Для нормального шума MLE совпадает с МНК.">максимум правдоподобия</span>.</li>
        <li><b>Аналитическое решение:</b> существует точная формула для оптимальных весов.</li>
      </ul>

      <h3>Аналитическое решение</h3>
      <p>В отличие от большинства ML-моделей, линейная регрессия имеет <b>точное</b> решение. Используя матричную запись:</p>
      <div class="math-block">$$\\mathbf{w}^* = (X^T X)^{-1} X^T y$$</div>

      <p>Это называется <span class="term" data-tip="Normal equations. Система линейных уравнений, решение которой даёт оптимальные веса линейной регрессии. Получается из условия ∇L = 0.">нормальным уравнением</span>. Одна матричная операция — и мы получаем оптимальные веса.</p>

      <p>На практике для больших данных или многих признаков используют <span class="term" data-tip="Gradient Descent. Итеративный метод оптимизации: на каждом шаге двигаемся в направлении против градиента функции потерь.">градиентный спуск</span> — дешевле по памяти.</p>

      <h3>Интерпретация коэффициентов</h3>
      <p>Главное достоинство линейной регрессии — её <b>прозрачность</b>. Каждый коэффициент $w_i$ напрямую говорит: «при увеличении признака $x_i$ на 1 единицу (при прочих равных) целевая увеличится на $w_i$ единиц».</p>
      <p>Пример: если в модели цены квартир $w_{площадь} = 3$, то каждый дополнительный м² добавляет 3 тыс к цене.</p>
      <p><b>Важно:</b> «при прочих равных» — критическая оговорка. Она верна только если признаки <b>не коррелируют</b> между собой.</p>

      <h3>Оценка качества модели</h3>

      <h4>MSE (Mean Squared Error) и RMSE</h4>
      <p>Среднеквадратичная ошибка: $\\text{MSE} = \\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2$. RMSE = √MSE, в единицах таргета.</p>

      <h4>MAE (Mean Absolute Error)</h4>
      <p>$\\text{MAE} = \\frac{1}{n}\\sum |y_i - \\hat{y}_i|$. Устойчивее к выбросам, в единицах таргета.</p>

      <h4>R² — коэффициент детерминации</h4>
      <div class="math-block">$$R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$$</div>

      <p>Доля дисперсии, <b>объяснённая</b> моделью:</p>
      <ul>
        <li><b>R² = 1</b> — идеальная модель.</li>
        <li><b>R² = 0.8</b> — модель объясняет 80% вариации y.</li>
        <li><b>R² = 0</b> — модель не лучше, чем просто предсказывать среднее.</li>
        <li><b>R² < 0</b> — модель <b>хуже</b>, чем константа. Плохой знак!</li>
      </ul>

      <h3>Предположения линейной регрессии (LINE)</h3>
      <p>Чтобы линейная регрессия давала корректные результаты (особенно доверительные интервалы и тесты), нужны 4 предположения:</p>

      <ul>
        <li><b>L — Linearity</b>: связь между X и y должна быть линейной. Если на самом деле квадратичная — линейная модель будет систематически ошибаться.</li>
        <li><b>I — Independence</b>: ошибки независимы друг от друга. Нарушается, например, во временных рядах.</li>
        <li><b>N — Normality</b>: ошибки распределены нормально. Нужно для p-value и доверительных интервалов, но не для самих предсказаний.</li>
        <li><b>E — Equal variance (гомоскедастичность)</b>: дисперсия ошибок одинакова во всех точках. <span class="term" data-tip="Heteroscedasticity. Ситуация, когда разброс ошибок зависит от значения x. Например, больший разброс для больших x. Нарушает стандартные формулы для стандартных ошибок.">Гетероскедастичность</span> — нарушение этого.</li>
      </ul>

      <h3>Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Максимальная интерпретируемость.</li>
        <li>Аналитическое решение.</li>
        <li>Быстрое обучение.</li>
        <li>Мало данных достаточно.</li>
        <li>Легко добавить регуляризацию (Ridge, Lasso).</li>
        <li>Часто хороший baseline.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li>Только линейные зависимости (без feature engineering).</li>
        <li>Чувствительна к выбросам.</li>
        <li>Проблемы с <span class="term" data-tip="Multicollinearity. Ситуация, когда признаки сильно коррелируют. Делает веса нестабильными и трудными в интерпретации.">мультиколлинеарностью</span>.</li>
        <li>Плохо экстраполирует (вне обучающего диапазона).</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Линейная регрессия работает только с линейными связями»</b> — можно включить $x^2$, $\\log(x)$, взаимодействия как новые признаки. Модель «линейна по параметрам», а не по признакам.</li>
        <li><b>«Низкий R² = плохая модель»</b> — не всегда. В социальных науках R² = 0.3 может быть отличным результатом.</li>
        <li><b>«Высокий R² = модель хорошая»</b> — может быть переобученной. Смотри на test R².</li>
        <li><b>«Большой коэффициент = важный признак»</b> — зависит от масштаба признака. Сравнивай стандартизированные коэффициенты.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: полиномиальная и нелинейные расширения</summary>
        <div class="deep-dive-body">
          <p>Линейная регрессия не обязана быть линейной в признаках! Можно добавить:</p>
          <ul>
            <li><b>Полиномиальные признаки:</b> $y = w_0 + w_1 x + w_2 x^2 + w_3 x^3$. Ловит кривые зависимости.</li>
            <li><b>Логарифмы:</b> $y = w_0 + w_1 \\log(x)$. Для экспоненциальных зависимостей.</li>
            <li><b>Взаимодействия:</b> $y = w_0 + w_1 x_1 + w_2 x_2 + w_3 x_1 x_2$. Когда эффект одного признака зависит от другого.</li>
            <li><b>Сплайны, GAM</b> — ещё более гибкие расширения.</li>
          </ul>
          <p>Главное — модель остаётся <b>линейной по параметрам</b> $w$, что сохраняет все удобства (аналитическое решение, интерпретация).</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: диагностика модели</summary>
        <div class="deep-dive-body">
          <p>Проверки, которые нужно делать перед доверием к модели:</p>
          <ul>
            <li><b>Residual plot</b> — график остатков vs предсказаний. Должно быть случайное облако. Если видишь паттерн — модель что-то не ловит.</li>
            <li><b>Q-Q plot остатков</b> — проверка нормальности.</li>
            <li><b>VIF (Variance Inflation Factor)</b> — диагностика мультиколлинеарности. VIF > 10 — проблема.</li>
            <li><b>Outlier detection</b> — Cook's distance, leverage.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: геометрическая интуиция</summary>
        <div class="deep-dive-body">
          <p>С точки зрения линейной алгебры, линейная регрессия — это <b>проекция</b> вектора $y$ на подпространство, натянутое на столбцы матрицы $X$. Предсказание $\\hat{y} = Xw$ — это ближайшая к $y$ точка в этом подпространстве.</p>
          <p>Остатки $r = y - \\hat{y}$ <b>ортогональны</b> подпространству $X$. Это геометрическая причина, почему OLS работает: мы выбираем такое $\\hat{y}$, что $y - \\hat{y}$ перпендикулярен всем признакам.</p>
          <p>Именно из этой ортогональности выводится нормальное уравнение $X^T(y - Xw) = 0$.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Логистическая регрессия</b> — обобщение для классификации.</li>
        <li><b>Регуляризация (Ridge, Lasso)</b> — борется с переобучением и мультиколлинеарностью.</li>
        <li><b>Градиентный спуск</b> — альтернативный способ поиска весов.</li>
        <li><b>Нейронные сети</b> — один «нейрон» это и есть линейная регрессия.</li>
        <li><b>Bias-variance</b> — линейная регрессия имеет высокий bias, низкую variance.</li>
      </ul>
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
