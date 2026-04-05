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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты врач и оцениваешь риск болезни. Чем больше неблагоприятных факторов — возраст, курение, давление — тем выше риск. Но ответить нужно <b>вероятностью</b>: не «точно болен», а «80% вероятность».</p>
        <p>Линейная формула «риск = −3 + 0.05·возраст + 1.5·курение + 0.02·давление» даёт любое число: может быть −5, может быть +15. Но вероятность должна быть между 0 и 1. Как связать?</p>
        <p>Решение: пропустить линейный результат через «сплющивающую» функцию — <b>сигмоиду</b>. Она превращает любое число в вероятность: большое положительное → близко к 1, большое отрицательное → близко к 0, ноль → ровно 0.5. Это и есть логистическая регрессия.</p>
      </div>

      <h3>Зачем нужна логистическая регрессия</h3>
      <p>Классификация — одна из главных задач ML: определить, к какому классу относится объект. Спам или нет? Заболеет или нет? Уйдёт клиент или нет?</p>
      <p>Мы <b>могли бы</b> применить линейную регрессию: <code>0 или 1</code> как таргет, потом круглить. Но это плохо работает:</p>
      <ul>
        <li>Предсказания вылетают за [0, 1] — бессмысленные вероятности.</li>
        <li>Линейная модель пытается подогнать прямую через 0 и 1 — плохо описывает реальность.</li>
        <li>Ошибки распределены не нормально, предположения линейной регрессии нарушены.</li>
      </ul>
      <p>Логистическая регрессия решает эту проблему: <b>выдаёт настоящую вероятность</b> и правильно моделирует бинарный таргет.</p>

      <h3>Сигмоидная функция</h3>
      <div class="math-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>

      <p>Это <span class="term" data-tip="Sigmoid function. S-образная функция, преобразующая любое число в интервал (0, 1). Используется в логистической регрессии и нейросетях.">сигмоида</span> — S-образная кривая. Её свойства:</p>
      <ul>
        <li>При $z \\to -\\infty$: $\\sigma(z) \\to 0$.</li>
        <li>При $z = 0$: $\\sigma(z) = 0.5$.</li>
        <li>При $z \\to +\\infty$: $\\sigma(z) \\to 1$.</li>
        <li>Гладкая, дифференцируемая.</li>
        <li>Симметрична относительно (0, 0.5).</li>
      </ul>

      <p>Красивое свойство производной: $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$. Это упрощает вычисления градиентов.</p>

      <h3>Модель логистической регрессии</h3>
      <p>Берём линейную комбинацию признаков и пропускаем через сигмоиду:</p>
      <div class="math-block">$$P(y = 1 \\mid x) = \\sigma(w_0 + w_1 x_1 + \\ldots + w_p x_p)$$</div>

      <p>Результат — вероятность того, что объект относится к классу 1. Вероятность класса 0: $1 - P(y = 1 \\mid x)$.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Логистическая регрессия строит <b>линейную</b> границу между классами, но выражает неопределённость около границы через вероятности. Далеко от границы модель «уверена» (p близко к 0 или 1), близко к границе — сомневается (p близко к 0.5).</p>
      </div>

      <h3>От вероятности к классу</h3>
      <p>Чтобы получить класс, нужно применить <b>порог</b>:</p>
      <div class="math-block">$$\\hat{y} = \\begin{cases} 1, & P(y=1 \\mid x) \\geq 0.5 \\\\ 0, & \\text{иначе} \\end{cases}$$</div>

      <p>Порог 0.5 — по умолчанию, но его можно (и нужно) менять под задачу:</p>
      <ul>
        <li><b>Низкий порог (0.3)</b>: ловим больше положительных, но больше ложных тревог.</li>
        <li><b>Высокий порог (0.7)</b>: меньше ложных тревог, но больше пропусков.</li>
      </ul>

      <h3>Функция потерь: log-loss</h3>
      <p>Для линейной регрессии мы использовали MSE. Для классификации — нет, потому что она плохо работает с вероятностями. Используем <span class="term" data-tip="Cross-entropy loss / Log-loss. Функция потерь для классификации. Сильно наказывает уверенные неправильные предсказания (p → 0 для верного класса).">cross-entropy loss</span> (log-loss):</p>
      <div class="math-block">$$L = -\\frac{1}{n} \\sum_{i=1}^{n} [y_i \\log(\\hat{p}_i) + (1-y_i) \\log(1 - \\hat{p}_i)]$$</div>

      <p><b>Интуиция:</b> для каждого примера штраф = $-\\log(\\text{вероятность правильного класса})$.</p>
      <ul>
        <li>Правильный класс с вероятностью 0.99 → штраф ≈ 0.01 (маленький).</li>
        <li>Правильный класс с вероятностью 0.01 → штраф ≈ 4.6 (огромный).</li>
        <li>Правильный класс с вероятностью 0 → штраф = ∞.</li>
      </ul>

      <p><b>Почему именно log:</b></p>
      <ul>
        <li>Это <span class="term" data-tip="Maximum Likelihood Estimation. Метод поиска параметров, максимизирующий вероятность наблюдать реальные данные при модели.">MLE</span> для Бернуллиевского распределения.</li>
        <li>Функция <b>выпуклая</b> — гарантируется глобальный минимум.</li>
        <li>Гладкая, легко оптимизируется градиентным спуском.</li>
        <li>Сильно наказывает <b>уверенные неправильные</b> предсказания.</li>
      </ul>

      <h3>Обучение: градиентный спуск</h3>
      <p>В отличие от линейной регрессии, у логистической <b>нет</b> аналитического решения. Веса ищут итеративно:</p>
      <ol>
        <li>Инициализируем веса нулями (или малыми случайными).</li>
        <li>Считаем градиент log-loss по весам.</li>
        <li>Делаем шаг против градиента: $w \\leftarrow w - \\eta \\cdot \\nabla L$.</li>
        <li>Повторяем до сходимости.</li>
      </ol>

      <p>Градиент красиво упрощается: $\\nabla L = \\frac{1}{n} X^T (\\hat{p} - y)$. Это очень похоже на линейную регрессию!</p>

      <h3>Интерпретация коэффициентов через odds ratio</h3>
      <p>Коэффициенты в линейной регрессии интерпретируются напрямую. В логистической — через <span class="term" data-tip="Odds ratio. Отношение шансов: P / (1-P). Логистическая регрессия линейна в log(odds).">шансы (odds)</span>.</p>
      <p><b>Шансы:</b> $\\text{odds} = \\frac{P}{1-P}$. Если P = 0.75, то odds = 3 (шансы 3 к 1).</p>
      <p>Логистическая регрессия делает линейными именно <b>log(odds)</b>:</p>
      <div class="math-block">$$\\log\\frac{P}{1-P} = w_0 + w_1 x_1 + \\ldots + w_p x_p$$</div>

      <p><b>Интерпретация:</b> если $w_i = 0.7$, то при увеличении признака на 1, шансы умножаются на $e^{0.7} \\approx 2.0$. То есть шансы удваиваются.</p>

      <h3>Многоклассовая классификация (Softmax)</h3>
      <p>Для более чем 2 классов используют <span class="term" data-tip="Softmax function. Обобщение сигмоиды на несколько классов. Превращает вектор чисел в распределение вероятностей (сумма = 1).">softmax</span> — обобщение сигмоиды:</p>
      <div class="math-block">$$P(y = k \\mid x) = \\frac{e^{z_k}}{\\sum_{j=1}^{K} e^{z_j}}$$</div>

      <p>Для каждого класса своя линейная комбинация $z_k$. Softmax превращает их в распределение вероятностей (сумма = 1). Модель предсказывает класс с наибольшей вероятностью.</p>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Логистическая регрессия — это регрессия»</b> — нет, это <b>классификация</b>. Название историческое.</li>
        <li><b>«Она линейная, поэтому простая»</b> — формула линейная, но граница — тоже линейная. Для сложных форм нужны feature engineering или ядра.</li>
        <li><b>«Порог 0.5 всегда оптимальный»</b> — нет. При дисбалансе классов или разной цене ошибок порог нужно настраивать.</li>
        <li><b>«Вероятности логрега всегда калиброваны»</b> — обычно хорошо, но при регуляризации или дисбалансе могут быть искажены.</li>
      </ul>

      <h3>Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Выдаёт <b>калиброванные</b> вероятности.</li>
        <li>Интерпретируется через odds ratio.</li>
        <li>Быстро обучается.</li>
        <li>Хорошо работает на маленьких датасетах.</li>
        <li>Легко регуляризуется (L1, L2).</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li>Только <b>линейные</b> границы между классами.</li>
        <li>Чувствительна к мультиколлинеарности.</li>
        <li>Требует масштабирования признаков (для регуляризации).</li>
        <li>Плохо работает при сильно нелинейных зависимостях без feature engineering.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: почему log-loss, а не MSE?</summary>
        <div class="deep-dive-body">
          <p>MSE для классификации плохо работает по двум причинам:</p>
          <ol>
            <li><b>Не выпуклая.</b> MSE с сигмоидой даёт невыпуклую функцию — градиентный спуск может застрять в локальном минимуме.</li>
            <li><b>Слабые градиенты.</b> Когда модель уверенно ошибается ($\\hat{p} \\to 0$ при $y = 1$), MSE даёт очень маленький градиент — модель медленно учится.</li>
          </ol>
          <p>Log-loss, наоборот, выпуклая и даёт <b>большой</b> градиент при уверенных ошибках — модель быстро исправляется.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: регуляризация логрега</summary>
        <div class="deep-dive-body">
          <p>Без регуляризации веса могут неограниченно расти (особенно при линейно разделимых данных). Регуляризация почти всегда нужна:</p>
          <ul>
            <li><b>L2:</b> $L + \\lambda \\|w\\|_2^2$. Сжимает веса, устойчив.</li>
            <li><b>L1:</b> $L + \\lambda \\|w\\|_1$. Зануляет малозначимые веса.</li>
          </ul>
          <p>В sklearn параметр <code>C = 1/λ</code>: большой C = слабая регуляризация. По умолчанию C = 1.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: связь с нейросетями</summary>
        <div class="deep-dive-body">
          <p>Логистическая регрессия — это <b>однослойная нейросеть</b>:</p>
          <ul>
            <li>Вход: признаки $x$.</li>
            <li>Один выходной нейрон с сигмоидальной активацией.</li>
            <li>Loss: binary cross-entropy.</li>
          </ul>
          <p>Многослойный перцептрон (MLP) с последним слоем = softmax и cross-entropy — это по сути многоклассовая логистическая регрессия поверх выученных признаков. Идея та же.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Линейная регрессия</b> — родственница, только для регрессии.</li>
        <li><b>Регуляризация</b> — L1/L2 встроены в логрег.</li>
        <li><b>ROC-AUC</b> — анализирует вероятности, которые выдаёт логрег.</li>
        <li><b>Нейросети</b> — логрег это простейшая нейросеть.</li>
        <li><b>SVM</b> — тоже ищет линейную границу, но с другим критерием.</li>
      </ul>
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
