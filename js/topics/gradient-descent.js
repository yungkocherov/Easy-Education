/* ==========================================================================
   Gradient Descent (основа обучения)
   ========================================================================== */
App.registerTopic({
  id: 'gradient-descent',
  category: 'dl',
  title: 'Градиентный спуск',
  summary: 'Как модели учатся: шагаем против градиента функции потерь.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты в тумане на горе и хочешь спуститься в долину. Ты не видишь далеко, но под ногами чувствуешь <b>наклон</b>. Логичный способ: идти в сторону, куда склон уходит вниз сильнее всего. Сделал шаг — посмотрел снова где наклон — сделал следующий шаг. Постепенно спустишься в долину.</p>
        <p>Это и есть градиентный спуск. Функция потерь модели — «рельеф». Веса — твои координаты. На каждом шаге считаешь <b>градиент</b> (направление самого быстрого подъёма) и идёшь в <b>противоположную сторону</b> — туда, где функция убывает быстрее всего. Шаг за шагом приходишь к минимуму — оптимальным весам.</p>
        <p>Длина шага — <b>learning rate</b>. Большой шаг — быстро, но можешь перелететь долину. Маленький — безопасно, но долго. Выбор η — главное искусство обучения нейросетей.</p>
      </div>

      <h3>Зачем нужен градиентный спуск</h3>
      <p>Обучение модели — это <b>оптимизация</b>. Мы хотим найти веса $w$, которые минимизируют ошибку на данных:</p>
      <div class="math-block">$$w^* = \\arg\\min_w L(w)$$</div>

      <p>Для некоторых задач решение находится аналитически (линейная регрессия). Для большинства — нет. Особенно для нейросетей с миллионами параметров.</p>

      <p>Градиентный спуск — <b>универсальный</b> итеративный метод оптимизации, который работает для <b>любой</b> дифференцируемой функции. Он обучает почти все современные модели ML и DL.</p>

      <h3>Градиент — указатель направления</h3>
      <p><span class="term" data-tip="Gradient. Вектор частных производных функции по всем параметрам. Показывает направление максимального роста функции.">Градиент</span> функции $L(w)$ — это вектор её частных производных:</p>
      <div class="math-block">$$\\nabla L = \\left(\\frac{\\partial L}{\\partial w_1}, \\frac{\\partial L}{\\partial w_2}, \\ldots, \\frac{\\partial L}{\\partial w_p}\\right)$$</div>

      <p>Важные свойства:</p>
      <ul>
        <li>Градиент указывает в сторону <b>максимального роста</b> функции.</li>
        <li>Его длина показывает, насколько быстро функция растёт.</li>
        <li>Если $\\nabla L = 0$ — мы в минимуме (или максимуме, или седловой точке).</li>
      </ul>

      <h3>Правило обновления</h3>
      <p>Хотим <b>минимизировать</b> $L$ → движемся против градиента:</p>
      <div class="math-block">$$w_{t+1} = w_t - \\eta \\cdot \\nabla L(w_t)$$</div>

      <p>Где:</p>
      <ul>
        <li>$w_t$ — текущие веса.</li>
        <li>$w_{t+1}$ — обновлённые веса.</li>
        <li>$\\eta$ (эта) — <span class="term" data-tip="Learning rate. Размер шага оптимизации. Главный гиперпараметр градиентного спуска: управляет скоростью и стабильностью обучения.">learning rate</span> — размер шага.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>На каждом шаге мы делаем <b>маленький шаг</b> в сторону убывания функции потерь. Это локальная информация (мы видим только наклон в текущей точке), но при достаточно маленьких шагах мы гарантированно движемся к минимуму.</p>
      </div>

      <h3>Три варианта градиентного спуска</h3>
      <p>Различаются тем, сколько данных используется для подсчёта одного градиента:</p>

      <h4>Batch Gradient Descent</h4>
      <p>Градиент считается по <b>всему</b> датасету на каждом шаге:</p>
      <ul>
        <li>✓ Точный градиент.</li>
        <li>✓ Гладкая сходимость.</li>
        <li>✗ Очень медленный для больших данных.</li>
        <li>✗ Не влезает в память.</li>
      </ul>

      <h4>Stochastic Gradient Descent (SGD)</h4>
      <p>Градиент считается по <b>одному</b> примеру:</p>
      <ul>
        <li>✓ Очень быстрый.</li>
        <li>✓ Может сбегать от плохих локальных минимумов.</li>
        <li>✗ Очень шумные обновления.</li>
        <li>✗ Может «скакать» вокруг минимума.</li>
      </ul>

      <h4>Mini-batch SGD (стандарт DL)</h4>
      <p>Компромисс: градиент по <b>небольшой группе</b> (батчу) — обычно 32, 64, 128, 256 примеров.</p>
      <ul>
        <li>✓ Баланс скорости и стабильности.</li>
        <li>✓ Эффективно на GPU (матричные операции).</li>
        <li>✓ Стандарт для нейросетей.</li>
      </ul>

      <h3>Learning rate — главный параметр</h3>
      <p>Выбор η — критически важен:</p>
      <ul>
        <li><b>Слишком маленький</b> (0.0001): обучение очень медленное, застревает в локальных минимумах.</li>
        <li><b>Хороший</b> (0.01-0.1): плавное убывание loss.</li>
        <li><b>Слишком большой</b> (10.0): модель <b>расходится</b> — loss растёт, становится NaN.</li>
      </ul>

      <p><b>Как выбирать:</b></p>
      <ul>
        <li>Log-grid search: попробуй 0.0001, 0.001, 0.01, 0.1, 1.0.</li>
        <li>Посмотри на кривую loss: плавное падение → хороший, скачки → слишком большой.</li>
        <li>Learning rate finder: постепенно увеличивать η и искать точку перед расходимостью.</li>
      </ul>

      <h3>Проблемы градиентного спуска</h3>

      <h4>1. Локальные минимумы</h4>
      <p>Невыпуклые функции (нейросети) имеют много минимумов. GD гарантирует только <b>локальный</b> оптимум. Хорошая новость: в высоких размерностях локальные минимумы часто не хуже глобального.</p>

      <h4>2. Седловые точки и плато</h4>
      <p>В точках, где $\\nabla L \\approx 0$, но это не минимум, GD <b>застревает</b>. Решается через momentum и адаптивные методы.</p>

      <h4>3. Плохая обусловленность</h4>
      <p>Если функция «овраг» — вытянутая, GD медленно зигзагами идёт к минимуму. Решается через нормализацию признаков и адаптивные методы.</p>

      <h4>4. Гиперпараметр η</h4>
      <p>Один η на всё обучение — компромисс. В начале нужны большие шаги, в конце — маленькие.</p>

      <h3>Улучшения: momentum, Adam</h3>

      <h4>SGD with Momentum</h4>
      <p>Накапливаем «скорость» в направлении движения:</p>
      <div class="math-block">$$v_{t+1} = \\beta v_t + \\nabla L, \\quad w_{t+1} = w_t - \\eta v_{t+1}$$</div>
      <p>Помогает:</p>
      <ul>
        <li>Быстрее проходить плато.</li>
        <li>Гасить колебания.</li>
        <li>Выбираться из мелких локальных минимумов.</li>
      </ul>

      <h4>Adam (Adaptive Moment Estimation)</h4>
      <p>Адаптирует <b>индивидуальный</b> learning rate для каждого параметра на основе истории градиентов:</p>
      <div class="math-block">$$w_{t+1} = w_t - \\eta \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}$$</div>
      <p>Где $m$ — средний градиент, $v$ — средний квадрат градиента.</p>
      <p><b>Adam — дефолт в большинстве современных DL-фреймворков</b>. Обычно работает «из коробки».</p>

      <h3>Learning rate schedules</h3>
      <p>Часто полезно <b>уменьшать</b> η во время обучения:</p>
      <ul>
        <li><b>Step decay</b> — уменьшаем в k раз каждые N эпох.</li>
        <li><b>Exponential decay</b> — $\\eta_t = \\eta_0 \\cdot \\gamma^t$.</li>
        <li><b>Cosine annealing</b> — плавное снижение по косинусу.</li>
        <li><b>Warmup</b> — начинаем с маленького η, увеличиваем → снижаем.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Градиентный спуск найдёт глобальный минимум»</b> — только для выпуклых функций.</li>
        <li><b>«Adam всегда лучше SGD»</b> — SGD с momentum часто лучше обобщает.</li>
        <li><b>«Маленький η — безопасный выбор»</b> — медленно, застревание в локальных минимумах.</li>
        <li><b>«Loss должен монотонно падать»</b> — для mini-batch SGD нормальны небольшие колебания.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: математическая сходимость</summary>
        <div class="deep-dive-body">
          <p>Для выпуклой $L$ с $L$-Lipschitz градиентом при $\\eta < 2/L$:</p>
          <div class="math-block">$$L(w_T) - L^* \\leq \\frac{\\|w_0 - w^*\\|^2}{2\\eta T}$$</div>
          <p>То есть сходимость $O(1/T)$ для обычного GD, $O(1/T^2)$ с momentum (Nesterov).</p>
          <p>Для невыпуклой $L$ гарантий нет, но эмпирически работает хорошо — одно из чудес deep learning.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: другие оптимизаторы</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>RMSprop</b> — адаптивный η по скользящему среднему квадратов градиентов.</li>
            <li><b>Adagrad</b> — аккумулирует квадраты градиентов, η только падает.</li>
            <li><b>AdamW</b> — Adam с правильным weight decay (не эквивалентен L2).</li>
            <li><b>Lion</b> — простой, использует знак градиента и momentum.</li>
            <li><b>L-BFGS</b> — квази-ньютоновский метод, хорош для выпуклых задач.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: диагностика обучения</summary>
        <div class="deep-dive-body">
          <p>По графику loss можно понять многое:</p>
          <ul>
            <li><b>Loss растёт или NaN</b> → η слишком большой, уменьши.</li>
            <li><b>Loss падает очень медленно</b> → η слишком маленький, увеличь.</li>
            <li><b>Loss скачет</b> → batch слишком маленький или η слишком большой.</li>
            <li><b>Loss застрял</b> → локальный минимум, плато или неправильная модель.</li>
            <li><b>Loss падает плавно</b> → всё отлично.</li>
          </ul>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Нейронные сети</b> — обучаются градиентным спуском.</li>
        <li><b>Логистическая регрессия</b> — обучается GD.</li>
        <li><b>Gradient Boosting</b> — использует GD в функциональном пространстве.</li>
        <li><b>SVM</b> — обучается через SGD (линейная версия).</li>
        <li><b>Регуляризация</b> — добавляется в loss-функцию.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: минимизация $L(w) = w^2$</h3>
      <div class="example-card">
        <p>$\\nabla L = 2w$. Начнём с $w_0 = 5$, $\\eta = 0.3$.</p>
        <div class="example-data">w₀ = 5
w₁ = 5 - 0.3·10 = 2.0
w₂ = 2.0 - 0.3·4 = 0.8
w₃ = 0.8 - 0.3·1.6 = 0.32
w₄ = 0.32 - 0.3·0.64 = 0.128
...</div>
        <p>Сходится к минимуму 0.</p>
      </div>

      <h3>Пример 2: расходимость при большом η</h3>
      <div class="example-card">
        <p>То же $L(w) = w^2$, но $\\eta = 1.1$:</p>
        <div class="example-data">w₀ = 5
w₁ = 5 - 1.1·10 = -6.0
w₂ = -6.0 - 1.1·(-12) = 7.2
w₃ = 7.2 - 1.1·14.4 = -8.64
...</div>
        <p>Расхождение — шаги становятся всё больше.</p>
      </div>

      <h3>Пример 3: оптимальный η для квадратичной функции</h3>
      <div class="example-card">
        <p>Для $L(w) = \\frac{1}{2}w^T A w$ оптимальный шаг $\\eta^* = \\frac{2}{\\lambda_{max} + \\lambda_{min}}$.</p>
        <p>При $\\eta < 2/\\lambda_{max}$ алгоритм сходится; при $\\eta > 2/\\lambda_{max}$ — расходится.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: GD по ландшафту функции</h3>
        <p>Наблюдай, как меняется траектория при разных η. Функция: $L(x,y) = x^2 + 5y^2$ (эллиптическая чаша).</p>
        <div class="sim-container">
          <div class="sim-controls" id="gd-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="gd-run">▶ Запустить (100 шагов)</button>
            <button class="btn secondary" id="gd-step">+1 шаг</button>
            <button class="btn secondary" id="gd-reset">↺ Сбросить</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="gd-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-chart-wrap" style="height:180px;"><canvas id="gd-loss"></canvas></div>
            <div class="sim-stats" id="gd-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#gd-controls');
        const cLR = App.makeControl('range', 'gd-lr', 'Learning rate η', { min: 0.01, max: 0.25, step: 0.005, value: 0.1 });
        const cStartX = App.makeControl('range', 'gd-sx', 'Старт x', { min: -5, max: 5, step: 0.1, value: 4 });
        const cStartY = App.makeControl('range', 'gd-sy', 'Старт y', { min: -2, max: 2, step: 0.05, value: 1.5 });
        const cMom = App.makeControl('range', 'gd-mom', 'Momentum β', { min: 0, max: 0.95, step: 0.05, value: 0 });
        [cLR, cStartX, cStartY, cMom].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#gd-canvas');
        const ctx = canvas.getContext('2d');
        let trajectory = [];
        let lossHistory = [];
        let vx = 0, vy = 0; // momentum

        function loss(x, y) { return x * x + 5 * y * y; }
        function grad(x, y) { return [2 * x, 10 * y]; }

        function reset() {
          trajectory = [[+cStartX.input.value, +cStartY.input.value]];
          lossHistory = [loss(trajectory[0][0], trajectory[0][1])];
          vx = 0; vy = 0;
          draw();
        }

        function step() {
          const lr = +cLR.input.value;
          const mom = +cMom.input.value;
          const [x, y] = trajectory[trajectory.length - 1];
          const [gx, gy] = grad(x, y);
          vx = mom * vx + gx;
          vy = mom * vy + gy;
          const nx = x - lr * vx;
          const ny = y - lr * vy;
          trajectory.push([nx, ny]);
          lossHistory.push(loss(nx, ny));
          draw();
        }

        function run(nSteps) { for (let i = 0; i < nSteps; i++) step(); }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          // контуры
          const xMin = -6, xMax = 6, yMin = -3, yMax = 3;
          const toCanvas = (x, y) => [((x - xMin) / (xMax - xMin)) * W, ((yMax - y) / (yMax - yMin)) * H];
          const levels = [0.5, 2, 5, 10, 20, 40, 80, 160];
          levels.forEach(L => {
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            // x² + 5y² = L — эллипс
            for (let t = 0; t <= 2 * Math.PI + 0.1; t += 0.05) {
              const x = Math.sqrt(L) * Math.cos(t);
              const y = Math.sqrt(L / 5) * Math.sin(t);
              const [cx, cy] = toCanvas(x, y);
              if (t === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
            }
            ctx.stroke();
          });
          // центр
          const [ox, oy] = toCanvas(0, 0);
          ctx.fillStyle = '#dc2626';
          ctx.beginPath(); ctx.arc(ox, oy, 5, 0, 2 * Math.PI); ctx.fill();

          // траектория
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          trajectory.forEach(([x, y], i) => {
            const [cx, cy] = toCanvas(x, y);
            if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
          });
          ctx.stroke();
          // точки
          trajectory.forEach(([x, y], i) => {
            const [cx, cy] = toCanvas(x, y);
            ctx.fillStyle = i === trajectory.length - 1 ? '#1e40af' : 'rgba(59,130,246,0.5)';
            ctx.beginPath(); ctx.arc(cx, cy, i === trajectory.length - 1 ? 6 : 3, 0, 2 * Math.PI); ctx.fill();
          });

          // loss chart
          const lossCanvas = container.querySelector('#gd-loss');
          const lossCtx = lossCanvas.getContext('2d');
          if (!window._gdLossChart) {
            window._gdLossChart = new Chart(lossCtx, {
              type: 'line',
              data: { labels: [], datasets: [{ label: 'Loss', data: [], borderColor: '#16a34a', borderWidth: 2, pointRadius: 0, fill: false }] },
              options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Loss' } }, scales: { y: { type: 'logarithmic' } } },
            });
            App.registerChart(window._gdLossChart);
          }
          window._gdLossChart.data.labels = lossHistory.map((_, i) => i);
          window._gdLossChart.data.datasets[0].data = lossHistory.map(v => Math.max(1e-9, v));
          window._gdLossChart.update('none');

          const last = trajectory[trajectory.length - 1];
          container.querySelector('#gd-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Шаг</div><div class="stat-value">${trajectory.length - 1}</div></div>
            <div class="stat-card"><div class="stat-label">Loss</div><div class="stat-value">${App.Util.round(loss(last[0], last[1]), 4)}</div></div>
            <div class="stat-card"><div class="stat-label">x</div><div class="stat-value">${App.Util.round(last[0], 3)}</div></div>
            <div class="stat-card"><div class="stat-label">y</div><div class="stat-value">${App.Util.round(last[1], 3)}</div></div>
          `;
        }

        [cStartX, cStartY].forEach(c => c.input.addEventListener('input', reset));
        container.querySelector('#gd-run').onclick = () => run(100);
        container.querySelector('#gd-step').onclick = step;
        container.querySelector('#gd-reset').onclick = reset;

        setTimeout(() => { resize(); reset(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Обучение всех дифференцируемых моделей</b> — линейная, логистическая регрессия, нейросети.</li>
        <li><b>Нейронные сети</b> — backprop + SGD/Adam.</li>
        <li><b>Матричные факторизации</b> — recommender systems.</li>
        <li><b>Оптимизация гиперпараметров</b> — Bayesian optimization поверх.</li>
        <li><b>Обучение с подкреплением</b> — policy gradient методы.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Простой, универсальный</li>
            <li>Работает для любой дифференцируемой функции</li>
            <li>Масштабируется на огромные модели</li>
            <li>Хорошо параллелится (mini-batch)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Сильно зависит от learning rate</li>
            <li>Может застрять в локальных минимумах</li>
            <li>Медленный около плато</li>
            <li>Требует много итераций для высокой точности</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Базовое обновление</h3>
      <div class="math-block">$$\\mathbf{w}_{t+1} = \\mathbf{w}_t - \\eta \\nabla L(\\mathbf{w}_t)$$</div>

      <h3>SGD с momentum</h3>
      <div class="math-block">$$v_{t+1} = \\beta v_t + \\nabla L(\\mathbf{w}_t), \\quad \\mathbf{w}_{t+1} = \\mathbf{w}_t - \\eta v_{t+1}$$</div>
      <p>Накапливаем направление — помогает проходить плато и гасит колебания.</p>

      <h3>Adam</h3>
      <div class="math-block">$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t$$</div>
      <div class="math-block">$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2$$</div>
      <div class="math-block">$$\\mathbf{w}_{t+1} = \\mathbf{w}_t - \\eta \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}$$</div>
      <p>Адаптивный learning rate для каждого параметра. Дефолт в большинстве DL-фреймворков.</p>

      <h3>Сходимость (выпуклая L)</h3>
      <p>Для выпуклой L с L-Lipschitz градиентом при $\\eta < 2/L$:</p>
      <div class="math-block">$$L(\\mathbf{w}_T) - L^* \\leq \\frac{\\|\\mathbf{w}_0 - \\mathbf{w}^*\\|^2}{2\\eta T}$$</div>
      <p>Сходимость $O(1/T)$.</p>
    `,

    extra: `
      <h3>Learning rate schedules</h3>
      <ul>
        <li><b>Step decay</b> — уменьшаем η в фиксированные эпохи.</li>
        <li><b>Exponential decay</b> — $\\eta_t = \\eta_0 \\cdot \\gamma^t$.</li>
        <li><b>Cosine annealing</b> — плавное снижение по косинусу.</li>
        <li><b>Warmup</b> — начать с маленького η, постепенно увеличить.</li>
        <li><b>One-cycle</b> — warmup → пик → спад.</li>
      </ul>

      <h3>Продвинутые оптимизаторы</h3>
      <ul>
        <li><b>RMSprop</b> — адаптивный η по скользящему среднему квадратов градиентов.</li>
        <li><b>Adagrad</b> — аккумулирует квадраты градиентов, η падает со временем.</li>
        <li><b>AdamW</b> — Adam с правильной weight decay.</li>
        <li><b>Lion</b> — простой, с моментумом и знаком градиента.</li>
      </ul>

      <h3>Диагностика обучения</h3>
      <ul>
        <li>Loss растёт → η слишком большой.</li>
        <li>Loss падает плавно → η разумный.</li>
        <li>Loss падает очень медленно → η слишком маленький или модель неправильна.</li>
        <li>Loss взрывается → gradient explosion, нужен gradient clipping.</li>
      </ul>

      <h3>Second-order методы</h3>
      <p><b>Newton's method</b> использует гессиан, быстрее сходится, но $O(p^3)$ на итерацию. <b>L-BFGS</b> — квази-ньютоновский метод, хороший выбор для небольших моделей.</p>
    `,
  },
});
