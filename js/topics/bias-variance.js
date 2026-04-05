/* ==========================================================================
   Bias-Variance Tradeoff
   ========================================================================== */
App.registerTopic({
  id: 'bias-variance',
  category: 'ml-basics',
  title: 'Bias-Variance Tradeoff',
  summary: 'Главный компромисс в ML: простота vs гибкость модели.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты стреляешь в мишень. У тебя два типа ошибок:</p>
        <p><b>Смещение (bias)</b> — твой прицел сбит. Все выстрелы ложатся кучно, но не в центр, а где-то в стороне. Ты стреляешь <b>систематически</b> неправильно. Простая модель «стреляет не туда».</p>
        <p><b>Разброс (variance)</b> — у тебя дрожат руки. Выстрелы в среднем в центре, но летят куда попало — раскиданы по всей мишени. Ты стреляешь <b>непредсказуемо</b>. Сложная модель «трясётся» от выборки к выборке.</p>
        <p>Идеал — целиться в центр и не дрожать (низкий bias + низкая variance). Но в ML есть фундаментальный компромисс: уменьшая одно, часто увеличиваешь другое. Выбираем «золотую середину».</p>
      </div>

      <h3>Зачем знать про bias-variance</h3>
      <p>Это главный компромисс в машинном обучении. Он объясняет:</p>
      <ul>
        <li>Почему простые модели плохо работают (высокий bias).</li>
        <li>Почему сложные модели переобучаются (высокая variance).</li>
        <li>Когда помогают регуляризация, больше данных, ансамблирование.</li>
        <li>Как диагностировать проблемы с моделью.</li>
      </ul>

      <h3>Три источника ошибки</h3>
      <p>Любая ошибка предсказания модели раскладывается на три <b>несократимые</b> части:</p>

      <div class="math-block">$$\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Noise}$$</div>

      <h4>1. Bias (смещение) — «модель слишком простая»</h4>
      <p>Насколько модель <b>систематически</b> промахивается мимо истины, <b>в среднем по всем возможным выборкам</b>. Это следствие упрощений, заложенных в модель.</p>
      <p>Пример: пытаемся предсказать синусоиду прямой линией. Как ни обучай — прямая не сможет её ухватить. Модель <b>недостаточно гибкая</b> для реальности данных. Это высокий bias.</p>
      <p><b>Симптомы высокого bias:</b></p>
      <ul>
        <li>Train error и validation error оба высокие.</li>
        <li>Train error и validation error близки друг к другу.</li>
        <li>Модель систематически ошибается в определённых зонах.</li>
      </ul>
      <p>Это называется <span class="term" data-tip="Underfitting. Недообучение. Модель слишком проста, чтобы уловить закономерности в данных. Симптомы: высокая ошибка на обучении и тесте.">недообучением (underfitting)</span>.</p>

      <h4>2. Variance (дисперсия) — «модель слишком чувствительная»</h4>
      <p>Насколько сильно предсказания модели <b>меняются</b> при разных обучающих выборках. Высокая variance означает: возьми другую случайную выборку того же размера — получишь совсем другую модель.</p>
      <p>Пример: полином 20-й степени на 30 точках. Он идеально проходит через все точки, но между ними выдумывает дикие колебания. Уберёшь одну точку — кривая изменится до неузнаваемости. Модель запоминает не только сигнал, но и <b>шум</b>.</p>
      <p><b>Симптомы высокой variance:</b></p>
      <ul>
        <li>Train error низкий, validation error высокий.</li>
        <li>Большой разрыв между train и validation.</li>
        <li>При разных фолдах CV — большой разброс качества.</li>
      </ul>
      <p>Это называется <span class="term" data-tip="Overfitting. Переобучение. Модель запоминает особенности обучающей выборки, включая шум, и плохо работает на новых данных.">переобучением (overfitting)</span>.</p>

      <h4>3. Noise (шум) — «данные сами по себе неточны»</h4>
      <p>Неустранимая часть ошибки, присущая данным. Реальные измерения всегда содержат случайность: даже совершенная модель не предскажет цены на бирже идеально — там есть истинная случайность.</p>
      <p>Шум мы не можем уменьшить, его можно только <b>не добавить</b> своими ошибками.</p>

      <div class="key-concept">
        <div class="kc-label">Главный компромисс</div>
        <p>Усложняя модель: <b>уменьшаем bias</b>, но <b>увеличиваем variance</b>. Упрощая: наоборот. Цель — найти такую сложность, при которой сумма bias² + variance минимальна. Это и есть оптимум для данной задачи и данного объёма данных.</p>
      </div>

      <h3>U-образная кривая ошибки</h3>
      <p>Если построить график «ошибка на test vs сложность модели», получается характерная U-образная форма:</p>
      <ul>
        <li><b>Слева (простые модели):</b> высокая ошибка из-за bias. Увеличивая сложность, мы её снижаем.</li>
        <li><b>Минимум:</b> оптимальная сложность, где bias и variance сбалансированы.</li>
        <li><b>Справа (сложные модели):</b> ошибка снова растёт — из-за variance.</li>
      </ul>

      <p>А ошибка на <b>train</b> монотонно падает с ростом сложности — она обманчива и не показывает реального качества.</p>

      <h3>Как диагностировать проблему</h3>
      <p>Всегда сравнивай train и validation ошибки:</p>

      <table>
        <tr><th>Train error</th><th>Val error</th><th>Диагноз</th><th>Что делать</th></tr>
        <tr><td>Высокий</td><td>Высокий, близко к train</td><td>High bias (underfit)</td><td>Усложнить модель, добавить признаки, ослабить регуляризацию</td></tr>
        <tr><td>Низкий</td><td>Высокий, большой разрыв</td><td>High variance (overfit)</td><td>Больше данных, регуляризация, проще модель</td></tr>
        <tr><td>Низкий</td><td>Низкий, близко к train</td><td>Всё хорошо!</td><td>Ничего не делать</td></tr>
        <tr><td>Высокий</td><td>Низкий</td><td>Невозможно</td><td>Проверить data leakage</td></tr>
      </table>

      <h3>Как управлять bias и variance</h3>

      <h4>Снижение bias (от недообучения)</h4>
      <ul>
        <li>Более сложная модель (больше параметров, глубже деревья, больше слоёв).</li>
        <li>Больше признаков / feature engineering.</li>
        <li>Ослабить регуляризацию (уменьшить λ).</li>
        <li>Обучать дольше (больше эпох в нейросети).</li>
        <li>Нелинейные модели вместо линейных.</li>
      </ul>

      <h4>Снижение variance (от переобучения)</h4>
      <ul>
        <li><b>Больше данных</b> — самое надёжное средство.</li>
        <li>Регуляризация (L1, L2, dropout).</li>
        <li>Упростить модель (меньше параметров).</li>
        <li>Ансамблирование (bagging, Random Forest).</li>
        <li>Early stopping.</li>
        <li>Data augmentation.</li>
      </ul>

      <h3>Связь с ансамблями</h3>
      <ul>
        <li><b>Bagging (Random Forest)</b> — снижает variance, усредняя много моделей с высокой variance. Bias остаётся таким же, как у одного дерева.</li>
        <li><b>Boosting (XGBoost)</b> — снижает bias, последовательно улучшая слабые модели. Может увеличить variance, нужна регуляризация.</li>
        <li><b>Stacking</b> — может снизить и то, и другое.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Больше данных всегда помогает»</b> — снижает variance, но не bias. Если модель принципиально слишком проста — данные не спасут.</li>
        <li><b>«Регуляризация всегда хороша»</b> — слишком сильная регуляризация даёт underfit.</li>
        <li><b>«Глубокие сети не переобучаются»</b> — переобучаются, особенно на маленьких данных. Нужны dropout, augmentation, early stopping.</li>
        <li><b>«Сложная модель = лучше»</b> — только при достаточных данных. На маленьком датасете простая модель часто обгоняет сложную.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: формальное разложение</summary>
        <div class="deep-dive-body">
          <p>Для регрессии с квадратичной функцией потерь, при истинной функции $f$ и шуме $\\epsilon$:</p>
          <div class="math-block">$$E\\left[(y - \\hat{f}(x))^2\\right] = \\underbrace{(E[\\hat{f}(x)] - f(x))^2}_{\\text{Bias}^2} + \\underbrace{E\\left[(\\hat{f}(x) - E[\\hat{f}(x)])^2\\right]}_{\\text{Variance}} + \\underbrace{\\sigma^2}_{\\text{Noise}}$$</div>
          <p>Здесь ожидание берётся по всем возможным обучающим выборкам.</p>
          <p>Важное допущение: разложение существует для MSE. Для других функций потерь (log-loss, hinge loss) аналогичные разложения тоже есть, но выглядят иначе.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: double descent в глубоких сетях</summary>
        <div class="deep-dive-body">
          <p>В классической теории bias-variance ошибка на test строго U-образная. Но в современных <b>over-parameterized</b> нейросетях (где параметров больше, чем примеров) наблюдается <b>двойной спуск</b>:</p>
          <ol>
            <li>Сначала ошибка падает (обычный bias→0).</li>
            <li>Потом растёт (variance растёт, классический overfit).</li>
            <li>Потом <b>снова падает</b> и становится меньше начального минимума.</li>
          </ol>
          <p>Это феномен современного DL, который активно исследуется. Он показывает, что классическая теория bias-variance — упрощение, работающее в классическом режиме, но не всегда в режиме огромных моделей.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: learning curves</summary>
        <div class="deep-dive-body">
          <p><b>Learning curve</b> — график train/val error в зависимости от размера выборки. Читается так:</p>
          <ul>
            <li>Обе кривые высокие и сходятся → high bias. Больше данных <b>не поможет</b>.</li>
            <li>Train низкая, val высокая, большой разрыв → high variance. Больше данных <b>поможет</b>.</li>
            <li>Обе кривые низкие и сошлись → идеально.</li>
          </ul>
          <p>Learning curve — практический инструмент диагностики: построй её и сразу увидишь, что нужно делать дальше.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Cross-validation</b> — основной инструмент измерения bias и variance.</li>
        <li><b>Регуляризация</b> — главный инструмент снижения variance.</li>
        <li><b>Ансамблирование</b> — снижает variance (bagging) или bias (boosting).</li>
        <li><b>Все ML-модели</b> — выбор сложности всегда упирается в bias-variance.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: полиномиальная регрессия</h3>
      <div class="example-card">
        <p>Истинная функция: y = sin(x). Подгоняем полином разных степеней:</p>
        <ul>
          <li><b>Степень 1</b> (линейная): сильный bias, не похоже на синус. Underfit.</li>
          <li><b>Степень 3</b>: нормально приближает, низкие bias и variance. Хорошо.</li>
          <li><b>Степень 15</b>: проходит через все точки, но между ними — дикие колебания. Overfit. Высокая variance.</li>
        </ul>
      </div>

      <h3>Пример 2: дерево решений</h3>
      <div class="example-card">
        <ul>
          <li><b>depth=1</b>: одно разбиение, высокий bias.</li>
          <li><b>depth=5</b>: хороший баланс.</li>
          <li><b>depth=∞</b>: каждый лист — один пример. Нулевая train-ошибка, но чудовищная variance.</li>
        </ul>
        <p>Ансамбль (Random Forest) — берёт много deep trees и усредняет → снижает variance без увеличения bias.</p>
      </div>

      <h3>Пример 3: диагностика</h3>
      <div class="example-card">
        <table>
          <tr><th>Train error</th><th>Val error</th><th>Диагноз</th></tr>
          <tr><td>Высокий</td><td>Высокий</td><td>Underfit (bias)</td></tr>
          <tr><td>Низкий</td><td>Высокий</td><td>Overfit (variance)</td></tr>
          <tr><td>Низкий</td><td>Низкий</td><td>Хорошо!</td></tr>
          <tr><td>Высокий</td><td>Низкий</td><td>Невозможно / data leak</td></tr>
        </table>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: полиномиальная регрессия</h3>
        <p>Меняй степень полинома и смотри, как меняются train и test ошибки.</p>
        <div class="sim-container">
          <div class="sim-controls" id="bv-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="bv-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="bv-fit"></canvas></div>
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="bv-err"></canvas></div>
            </div>
            <div class="sim-stats" id="bv-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#bv-controls');
        const cDeg = App.makeControl('range', 'bv-deg', 'Степень полинома', { min: 1, max: 15, step: 1, value: 3 });
        const cN = App.makeControl('range', 'bv-n', 'Примеров', { min: 10, max: 100, step: 5, value: 20 });
        const cNoise = App.makeControl('range', 'bv-noise', 'Шум σ', { min: 0, max: 1, step: 0.05, value: 0.3 });
        [cDeg, cN, cNoise].forEach(c => controls.appendChild(c.wrap));

        let fitChart = null, errChart = null;
        let xTrain = [], yTrain = [], xTest = [], yTest = [];

        function truefn(x) { return Math.sin(1.5 * x); }

        function regen() {
          const n = +cN.input.value, noise = +cNoise.input.value;
          xTrain = []; yTrain = []; xTest = []; yTest = [];
          for (let i = 0; i < n; i++) {
            const x = -3 + 6 * Math.random();
            xTrain.push(x); yTrain.push(truefn(x) + App.Util.randn(0, noise));
          }
          for (let i = 0; i < 100; i++) {
            const x = -3 + 6 * (i / 99);
            xTest.push(x); yTest.push(truefn(x) + App.Util.randn(0, noise));
          }
          update();
        }

        // Решение полиномиальной регрессии через normal equation
        function fitPoly(xs, ys, deg) {
          const n = xs.length;
          const X = xs.map(x => { const row = []; for (let d = 0; d <= deg; d++) row.push(Math.pow(x, d)); return row; });
          // X^T X
          const p = deg + 1;
          const XtX = Array.from({ length: p }, () => new Array(p).fill(0));
          const Xty = new Array(p).fill(0);
          for (let i = 0; i < n; i++) {
            for (let r = 0; r < p; r++) {
              for (let c = 0; c < p; c++) XtX[r][c] += X[i][r] * X[i][c];
              Xty[r] += X[i][r] * ys[i];
            }
          }
          // Gauss elimination + small regularization
          for (let r = 0; r < p; r++) XtX[r][r] += 1e-8;
          for (let i = 0; i < p; i++) {
            // pivot
            let maxR = i;
            for (let k = i + 1; k < p; k++) if (Math.abs(XtX[k][i]) > Math.abs(XtX[maxR][i])) maxR = k;
            [XtX[i], XtX[maxR]] = [XtX[maxR], XtX[i]];
            [Xty[i], Xty[maxR]] = [Xty[maxR], Xty[i]];
            for (let k = i + 1; k < p; k++) {
              const f = XtX[k][i] / XtX[i][i];
              for (let j = i; j < p; j++) XtX[k][j] -= f * XtX[i][j];
              Xty[k] -= f * Xty[i];
            }
          }
          const w = new Array(p).fill(0);
          for (let i = p - 1; i >= 0; i--) {
            let s = Xty[i];
            for (let j = i + 1; j < p; j++) s -= XtX[i][j] * w[j];
            w[i] = s / XtX[i][i];
          }
          return w;
        }

        function predict(w, x) { let s = 0; for (let d = 0; d < w.length; d++) s += w[d] * Math.pow(x, d); return s; }

        function update() {
          const deg = +cDeg.input.value;
          const w = fitPoly(xTrain, yTrain, deg);
          let trainErr = 0; xTrain.forEach((x, i) => { trainErr += (yTrain[i] - predict(w, x)) ** 2; }); trainErr /= xTrain.length;
          let testErr = 0; xTest.forEach((x, i) => { testErr += (yTest[i] - predict(w, x)) ** 2; }); testErr /= xTest.length;

          // fit chart
          const gridX = App.Util.linspace(-3, 3, 200);
          const ctx = container.querySelector('#bv-fit').getContext('2d');
          if (fitChart) fitChart.destroy();
          fitChart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Train', data: xTrain.map((x, i) => ({ x, y: yTrain[i] })), backgroundColor: 'rgba(59,130,246,0.5)', pointRadius: 3 },
                { type: 'line', label: 'True', data: gridX.map(x => ({ x, y: truefn(x) })), borderColor: '#94a3b8', borderWidth: 2, pointRadius: 0, fill: false, borderDash: [5, 5] },
                { type: 'line', label: 'Предсказание', data: gridX.map(x => ({ x, y: predict(w, x) })), borderColor: '#dc2626', borderWidth: 2.5, pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' }, title: { display: true, text: `Полином степени ${deg}` } },
              scales: { x: { type: 'linear', min: -3.5, max: 3.5 }, y: { min: -3, max: 3 } },
            },
          });
          App.registerChart(fitChart);

          // error curve: train vs test по степеням
          const errs = [];
          for (let d = 1; d <= 15; d++) {
            const ww = fitPoly(xTrain, yTrain, d);
            let te = 0; xTrain.forEach((x, i) => { te += (yTrain[i] - predict(ww, x)) ** 2; }); te /= xTrain.length;
            let ve = 0; xTest.forEach((x, i) => { ve += (yTest[i] - predict(ww, x)) ** 2; }); ve /= xTest.length;
            errs.push({ d, train: te, test: ve });
          }

          const ctx2 = container.querySelector('#bv-err').getContext('2d');
          if (errChart) errChart.destroy();
          errChart = new Chart(ctx2, {
            type: 'line',
            data: {
              labels: errs.map(e => e.d),
              datasets: [
                { label: 'Train MSE', data: errs.map(e => e.train), borderColor: '#3b82f6', borderWidth: 2, pointRadius: 2, fill: false },
                { label: 'Test MSE', data: errs.map(e => e.test), borderColor: '#dc2626', borderWidth: 2, pointRadius: 2, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' }, title: { display: true, text: 'Bias-Variance кривая' } },
              scales: { x: { title: { display: true, text: 'Степень полинома' } }, y: { type: 'logarithmic', title: { display: true, text: 'MSE' } } },
            },
          });
          App.registerChart(errChart);

          container.querySelector('#bv-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Степень</div><div class="stat-value">${deg}</div></div>
            <div class="stat-card"><div class="stat-label">Train MSE</div><div class="stat-value">${trainErr.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">Test MSE</div><div class="stat-value">${testErr.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">Параметров</div><div class="stat-value">${deg + 1}</div></div>
          `;
        }

        cDeg.input.addEventListener('input', update);
        [cN, cNoise].forEach(c => c.input.addEventListener('change', regen));
        container.querySelector('#bv-regen').onclick = regen;
        regen();
      },
    },

    applications: `
      <h3>Где применяется идея</h3>
      <ul>
        <li><b>Выбор модели</b> — простая или сложная?</li>
        <li><b>Регуляризация</b> — ручка для управления variance.</li>
        <li><b>Ансамблирование</b> — bagging снижает variance, boosting снижает bias.</li>
        <li><b>Early stopping</b> — остановка до того как variance начнёт расти.</li>
        <li><b>Learning curves</b> — диагностика через размер выборки.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Как реагировать</h4>
          <ul>
            <li><b>High bias</b>: усложнить модель, добавить признаки, слабее регуляризация</li>
            <li><b>High variance</b>: больше данных, сильнее регуляризация, проще модель</li>
            <li><b>Оба низкие</b>: хорошо!</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ В DL нарушение классики</h4>
          <ul>
            <li>Double descent: при очень больших моделях test error может снова падать</li>
            <li>Over-parameterized сети хорошо обобщают</li>
            <li>Классическая U-кривая — упрощение</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Вывод разложения</h3>
      <p>Пусть $y = f(x) + \\epsilon$, $E[\\epsilon] = 0$, $\\text{Var}(\\epsilon) = \\sigma^2$. Обозначим $\\hat{f}$ — модель, обученная на случайной выборке.</p>
      <div class="math-block">$$E[(y - \\hat{f}(x_0))^2] = E[(f(x_0) + \\epsilon - \\hat{f}(x_0))^2]$$</div>
      <div class="math-block">$$= E[(f - \\hat{f})^2] + \\sigma^2$$</div>
      <div class="math-block">$$= (f - E[\\hat{f}])^2 + E[(\\hat{f} - E[\\hat{f}])^2] + \\sigma^2$$</div>
      <div class="math-block">$$= \\text{Bias}^2 + \\text{Variance} + \\text{Noise}$$</div>

      <h3>Bias и Variance отдельно</h3>
      <div class="math-block">$$\\text{Bias}[\\hat{f}(x_0)] = E[\\hat{f}(x_0)] - f(x_0)$$</div>
      <div class="math-block">$$\\text{Var}[\\hat{f}(x_0)] = E[(\\hat{f}(x_0) - E[\\hat{f}(x_0)])^2]$$</div>

      <h3>Как оценить эмпирически</h3>
      <p>Bootstrap:</p>
      <ol>
        <li>Сгенерировать много выборок (или bootstrap samples).</li>
        <li>Обучить модель на каждой.</li>
        <li>Получить много предсказаний $\\hat{f}_i(x_0)$.</li>
        <li>Среднее — оценка $E[\\hat{f}]$, дисперсия — оценка variance.</li>
      </ol>
    `,

    extra: `
      <h3>Learning curves</h3>
      <p>График: train/val ошибка vs размер выборки.</p>
      <ul>
        <li><b>Обе ошибки высокие и сходятся</b> → High bias, больше данных не поможет.</li>
        <li><b>Train низкая, val высокая, разрыв</b> → High variance, больше данных поможет.</li>
      </ul>

      <h3>Double descent</h3>
      <p>В современных нейросетях наблюдается феномен: при увеличении числа параметров test error сначала падает, потом растёт (классика), потом <b>снова</b> падает. Это противоречит классическому bias-variance и до сих пор активно исследуется.</p>

      <h3>Bagging vs Boosting в терминах bias-variance</h3>
      <ul>
        <li><b>Bagging (Random Forest)</b> — снижает variance, оставляет bias базовых моделей.</li>
        <li><b>Boosting</b> — снижает bias, может поднять variance (нужна регуляризация).</li>
      </ul>

      <h3>Практические выводы</h3>
      <ul>
        <li>Смотри на train/val — это главный диагностический сигнал.</li>
        <li>Если разрыв большой → overfit → больше данных или регуляризация.</li>
        <li>Если обе ошибки высоки → underfit → сложнее модель или больше фичей.</li>
        <li>Baseline всегда: с чем сравнивать?</li>
      </ul>
    `,
  },
});
