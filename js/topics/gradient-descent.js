/* ==========================================================================
   <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Descent (основа обучения)
   ========================================================================== */
App.registerTopic({
  id: 'gradient-descent',
  category: 'dl',
  title: 'Градиентный спуск',
  summary: 'Как модели учатся: шагаем против <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">градиента</a> <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">функции потерь</a>.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('intro-ml')">Что такое ML</a> ·
        <a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a>
        (понимание функции потерь и параметров модели)
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты в тумане на горе и хочешь спуститься в долину. Ты не видишь далеко, но под ногами чувствуешь <b>наклон</b>. Логичный способ: идти в сторону, куда склон уходит вниз сильнее всего. Сделал шаг — посмотрел снова где наклон — сделал следующий шаг. Постепенно спустишься в долину.</p>
        <p>Это и есть градиентный спуск. Функция потерь модели — «рельеф». Веса — твои координаты. На каждом шаге считаешь <b>градиент</b> (направление самого быстрого подъёма) и идёшь в <b>противоположную сторону</b> — туда, где функция убывает быстрее всего. Шаг за шагом приходишь к минимуму — оптимальным весам.</p>
        <p>Длина шага — <b>learning rate</b>. Большой шаг — быстро, но можешь перелететь долину. Маленький — безопасно, но долго. Выбор η — главное искусство обучения нейросетей.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <!-- Contour ellipses (loss surface) -->
          <ellipse cx="260" cy="105" rx="220" ry="80" fill="none" stroke="#818cf8" stroke-width="1.5" opacity="0.4"/>
          <ellipse cx="260" cy="105" rx="145" ry="52" fill="none" stroke="#6366f1" stroke-width="1.8" opacity="0.6"/>
          <ellipse cx="260" cy="105" rx="70" ry="26" fill="none" stroke="#6366f1" stroke-width="2" opacity="0.85"/>
          <!-- Minimum marker -->
          <circle cx="260" cy="105" r="5" fill="#10b981"/>
          <text x="270" y="103" font-size="10" fill="#059669" font-weight="600">min</text>
          <!-- Zigzag descent path from outside toward center -->
          <polyline points="80,55 155,125 185,78 225,112 242,90 255,103" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-dasharray="none" marker-end="url(#arr)"/>
          <!-- Arrow marker -->
          <defs>
            <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#ef4444"/>
            </marker>
          </defs>
          <!-- Step labels η -->
          <text x="100" y="78" font-size="9" fill="#dc2626">η·∇L</text>
          <text x="163" y="105" font-size="9" fill="#dc2626">η·∇L</text>
          <text x="195" y="100" font-size="9" fill="#dc2626">η·∇L</text>
          <!-- Axis labels -->
          <text x="30" y="180" font-size="10" fill="#64748b">w₁</text>
          <text x="490" y="180" font-size="10" fill="#64748b">w₂</text>
          <text x="82" y="52" font-size="10" fill="#ef4444" font-weight="600">старт</text>
        </svg>
        <div class="caption">Контурный график функции потерь: зигзагообразный путь градиентного спуска ведёт от начальной точки к минимуму. Каждый шаг = η · ∇L.</div>
      </div>

      <h3>🎯 Зачем нужен градиентный спуск</h3>
      <p>Обучение модели — это <b>оптимизация</b>. Мы хотим найти веса $w$, которые минимизируют ошибку на данных:</p>
      <div class="math-block">$$w^* = \\arg\\min_w L(w)$$</div>

      <p>Для некоторых задач решение находится аналитически (линейная регрессия). Для большинства — нет. Особенно для нейросетей с миллионами параметров.</p>

      <p>Градиентный спуск — <b>универсальный</b> итеративный метод оптимизации, который работает для <b>любой</b> дифференцируемой функции. Он обучает почти все современные модели ML и DL.</p>

      <h3>💡 Градиент — указатель направления</h3>
      <p><span class="term" data-tip="Gradient. Вектор частных производных функции по всем параметрам. Показывает направление максимального роста функции.">Градиент</span> функции $L(w)$ — это вектор её частных производных:</p>
      <div class="math-block">$$\\nabla L = \\left(\\frac{\\partial L}{\\partial w_1}, \\frac{\\partial L}{\\partial w_2}, \\ldots, \\frac{\\partial L}{\\partial w_p}\\right)$$</div>

      <p>Важные свойства:</p>
      <ul>
        <li>Градиент указывает в сторону <b>максимального роста</b> функции.</li>
        <li>Его длина показывает, насколько быстро функция растёт.</li>
        <li>Если $\\nabla L = 0$ — мы в минимуме (или максимуме, или седловой точке).</li>
      </ul>

      <h3>📐 Правило обновления</h3>
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

      <h3>🏗️ Три варианта градиентного спуска</h3>
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

      <h3>🎓 Learning rate — главный параметр</h3>
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

      <h3>⚠️ Проблемы градиентного спуска</h3>

      <h4>1. Локальные минимумы</h4>
      <p>Невыпуклые функции (нейросети) имеют много минимумов. GD гарантирует только <b>локальный</b> оптимум. Хорошая новость: в высоких размерностях локальные минимумы часто не хуже глобального.</p>

      <h4>2. Седловые точки и плато</h4>
      <p>В точках, где $\\nabla L \\approx 0$, но это не минимум, GD <b>застревает</b>. Решается через momentum и адаптивные методы.</p>

      <h4>3. Плохая обусловленность</h4>
      <p>Если функция «овраг» — вытянутая, GD медленно зигзагами идёт к минимуму. Решается через нормализацию признаков и адаптивные методы.</p>

      <h4>4. Гиперпараметр η</h4>
      <p>Один η на всё обучение — компромисс. В начале нужны большие шаги, в конце — маленькие.</p>

      <h3>🚀 Улучшения: momentum, Adam</h3>

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

      <h3>📅 Learning rate schedules</h3>
      <p>Часто полезно <b>уменьшать</b> η во время обучения:</p>
      <ul>
        <li><b>Step decay</b> — уменьшаем в k раз каждые N эпох.</li>
        <li><b>Exponential decay</b> — $\\eta_t = \\eta_0 \\cdot \\gamma^t$.</li>
        <li><b>Cosine annealing</b> — плавное снижение по косинусу.</li>
        <li><b>Warmup</b> — начинаем с маленького η, увеличиваем → снижаем.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
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

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Нейронные сети</b> — обучаются градиентным спуском.</li>
        <li><b>Логистическая регрессия</b> — обучается GD.</li>
        <li><b>Gradient Boosting</b> — использует GD в функциональном пространстве.</li>
        <li><b>SVM</b> — обучается через SGD (линейная версия).</li>
        <li><b>Регуляризация</b> — добавляется в loss-функцию.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Сходимость: η = 0.3',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Минимизируем $L(w) = w^2$ градиентным спуском. Градиент: $\\nabla L = 2w$. Начальная точка $w_0 = 5$, learning rate $\\eta = 0{,}3$. Найти минимум.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <marker id="gd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0,6 3,0 6" fill="#10b981"/>
                </marker>
              </defs>
              <!-- Axes -->
              <line x1="30" y1="140" x2="440" y2="140" stroke="#64748b" stroke-width="1.5"/>
              <line x1="30" y1="10" x2="30" y2="145" stroke="#64748b" stroke-width="1.5"/>
              <text x="445" y="144" font-size="10" fill="#64748b">w</text>
              <text x="32" y="10" font-size="10" fill="#64748b">L</text>
              <!-- Parabola L=w^2: map w in [-0.5..5.2] to x in [30..440], L in [0..27] to y in [140..10] -->
              <!-- x = 30 + (w+0.5)/5.7 * 410, y = 140 - L/27*130 -->
              <polyline fill="none" stroke="#64748b" stroke-width="1.8"
                points="30,137 47,128 66,111 87,88 110,59 136,28 164,5"/>
              <!-- points at w=5,2,0.8,0.32 -->
              <!-- w=5: x=30+(5.5/5.7)*410=426, y=140-(25/27)*130=20 -->
              <!-- w=2: x=30+(2.5/5.7)*410=210, y=140-(4/27)*130=121 -->
              <!-- w=0.8: x=30+(1.3/5.7)*410=124, y=140-(0.64/27)*130=137 -->
              <!-- w=0.32: x=30+(0.82/5.7)*410=89, y=140-(0.10/27)*130=139.5 -->
              <circle cx="426" cy="20" r="6" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
              <text x="430" y="17" font-size="9" fill="#ef4444">w₀=5</text>
              <circle cx="210" cy="121" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="214" y="118" font-size="9" fill="#f59e0b">w₁=2</text>
              <circle cx="124" cy="137" r="6" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="96" y="133" font-size="9" fill="#3b82f6">w₂=0.8</text>
              <circle cx="89" cy="140" r="5" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <text x="96" y="150" font-size="9" fill="#10b981">w₃=0.32</text>
              <!-- Arrows between points -->
              <line x1="420" y1="23" x2="216" y2="119" stroke="#10b981" stroke-width="1.8" marker-end="url(#gd-arr)"/>
              <line x1="204" y1="122" x2="130" y2="136" stroke="#10b981" stroke-width="1.8" marker-end="url(#gd-arr)"/>
              <line x1="118" y1="138" x2="95" y2="140" stroke="#10b981" stroke-width="1.8" marker-end="url(#gd-arr)"/>
              <!-- Min label -->
              <text x="32" y="152" font-size="9" fill="#10b981" font-weight="600">min(w*=0)</text>
            </svg>
            <div class="caption">Сходимость: точки w=5→2→0.8→0.32 движутся к минимуму w*=0 вдоль параболы L=w². Каждый шаг в 2.5 раза ближе к нулю.</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Шаг $t$</th><th>$w_t$</th><th>Градиент $2w_t$</th><th>Шаг $\\eta \\cdot 2w_t$</th><th>$L(w_t) = w_t^2$</th></tr>
              <tr><td>0</td><td>5,0000</td><td>10,000</td><td>3,000</td><td>25,0000</td></tr>
              <tr><td>1</td><td>2,0000</td><td>4,000</td><td>1,200</td><td>4,0000</td></tr>
              <tr><td>2</td><td>0,8000</td><td>1,600</td><td>0,480</td><td>0,6400</td></tr>
              <tr><td>3</td><td>0,3200</td><td>0,640</td><td>0,192</td><td>0,1024</td></tr>
              <tr><td>4</td><td>0,1280</td><td>0,256</td><td>0,077</td><td>0,0164</td></tr>
              <tr><td>5</td><td>0,0512</td><td>0,102</td><td>0,031</td><td>0,0026</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Правило обновления</h4>
            <p>На каждом шаге вычитаем из текущего $w$ градиент, умноженный на $\\eta$:</p>
            <div class="math-block">$$w_{t+1} = w_t - \\eta \\cdot \\nabla L(w_t) = w_t - 0{,}3 \\cdot 2w_t = w_t \\cdot (1 - 0{,}6) = 0{,}4 \\cdot w_t$$</div>
            <div class="why">Каждый шаг умножает $w$ на коэффициент $0{,}4 < 1$ — последовательность геометрически убывает к нулю.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 0 → 1: первое обновление</h4>
            <div class="calc">$w_1 = 5{,}0 - 0{,}3 \\times 2 \\times 5{,}0 = 5{,}0 - 3{,}0 = 2{,}0$</div>
            <div class="why">Функция потерь упала с 25 до 4 — в 6 раз за один шаг. Больший градиент в начале ≡ более быстрое начальное движение.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаги 1–5: убывание по геометрической прогрессии</h4>
            <div class="calc">$w_t = 5 \\cdot 0{,}4^t$, поэтому $L(w_t) = 25 \\cdot 0{,}16^t$</div>
            <div class="why">После 5 шагов $L = 0{,}0026$ — уже меньше 0{,}01% от начального. Это сходимость! Критерий: $\\eta < 1/L_{\\text{Lips}} = 1/(2) = 0{,}5$. Наше $\\eta=0{,}3$ — в пределах нормы.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>При $\\eta = 0{,}3$ алгоритм <b>сходится</b> к минимуму $w^* = 0$. После 5 итераций $L \\approx 0{,}003$, после 10 — $L \\approx 10^{-7}$. Скорость сходимости линейная с коэффициентом $0{,}4$ за шаг.</p>
          </div>

          <div class="lesson-box">
            <b>Вывод:</b> при хорошем $\\eta$ функция потерь убывает монотонно — каждый шаг делает модель лучше. На графике: плавная кривая loss, стремящаяся к нулю. Это идеальная картинка обучения.
          </div>
        `
      },
      {
        title: 'Расходимость: η = 1.1',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Та же функция $L(w) = w^2$, тот же старт $w_0 = 5$, но $\\eta = 1{,}1$. Что произойдёт с обучением?</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <marker id="div-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0,6 3,0 6" fill="#ef4444"/>
                </marker>
              </defs>
              <!-- Axes: center at x=230 (w=0), y=155 (L=0) -->
              <!-- x = 230 + w*18, y = 155 - L*1.2 (clipped) -->
              <line x1="20" y1="155" x2="450" y2="155" stroke="#64748b" stroke-width="1.5"/>
              <line x1="230" y1="8" x2="230" y2="158" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
              <text x="452" y="158" font-size="10" fill="#64748b">w</text>
              <text x="232" y="10" font-size="10" fill="#64748b">L</text>
              <text x="227" y="163" font-size="9" fill="#10b981">0</text>
              <!-- Parabola L=w^2: for w=-13 to 13 step 1 -->
              <!-- x=230+w*16, y=155-w^2*0.9 (for w=13: y=155-152=3; for w=0: y=155) -->
              <polyline fill="none" stroke="#64748b" stroke-width="1.8"
                points="22,3 46,22 70,46 94,75 118,107 142,132 166,150 230,155 294,150 318,132 342,107 366,75 390,46 414,22 438,3"/>
              <!-- Points: w=5 (x=310,y=155-25*0.9=132.5), w=-6 (x=134,y=155-36*0.9=122.6), w=7.2 (x=345,y=155-51.84*0.9=108.3), w=-8.64 (x=91,y=155-74.65*0.9=88) -->
              <circle cx="310" cy="133" r="6" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="314" y="130" font-size="9" fill="#3b82f6">w₀=5</text>
              <circle cx="134" cy="123" r="6" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
              <text x="90" y="120" font-size="9" fill="#ef4444">w₁=−6</text>
              <circle cx="345" cy="109" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="349" y="106" font-size="9" fill="#f59e0b">w₂=7.2</text>
              <circle cx="91" cy="89" r="6" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
              <text x="48" y="86" font-size="9" fill="#ef4444">w₃=−8.64</text>
              <!-- Zigzag arrows showing bouncing away -->
              <line x1="304" y1="130" x2="140" y2="124" stroke="#ef4444" stroke-width="1.8" marker-end="url(#div-arr)"/>
              <line x1="140" y1="120" x2="339" y2="110" stroke="#ef4444" stroke-width="1.8" marker-end="url(#div-arr)"/>
              <line x1="339" y1="106" x2="97" y2="90" stroke="#ef4444" stroke-width="1.8" marker-end="url(#div-arr)"/>
              <text x="195" y="148" font-size="9" fill="#ef4444" font-weight="600">расходимость!</text>
            </svg>
            <div class="caption">Расходимость (η=1.1): точки прыгают по параболе с нарастающей амплитудой — 5→−6→7.2→−8.64. Каждый «перелёт» через минимум дальше предыдущего.</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Шаг $t$</th><th>$w_t$</th><th>Градиент $2w_t$</th><th>Шаг $\\eta \\cdot 2w_t$</th><th>$L(w_t) = w_t^2$</th></tr>
              <tr><td>0</td><td>5,00</td><td>10,00</td><td>11,00</td><td>25,00</td></tr>
              <tr><td>1</td><td>−6,00</td><td>−12,00</td><td>−13,20</td><td>36,00</td></tr>
              <tr><td>2</td><td>7,20</td><td>14,40</td><td>15,84</td><td>51,84</td></tr>
              <tr><td>3</td><td>−8,64</td><td>−17,28</td><td>−19,01</td><td>74,65</td></tr>
              <tr><td>4</td><td>10,37</td><td>20,74</td><td>22,81</td><td>107,5</td></tr>
              <tr><td>5</td><td>−12,44</td><td>−24,89</td><td>−27,38</td><td>154,8</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Почему происходит расходимость?</h4>
            <p>Вычислим коэффициент умножения за один шаг:</p>
            <div class="calc">$w_{t+1} = w_t - 1{,}1 \\cdot 2w_t = w_t(1 - 2{,}2) = -1{,}2 \\cdot w_t$</div>
            <div class="why">Коэффициент $|-1{,}2| = 1{,}2 > 1$. Каждый шаг <b>увеличивает</b> $|w|$ в 1,2 раза! И меняет знак — алгоритм «перелетает» через минимум.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Первый шаг: перелёт через минимум</h4>
            <div class="calc">$w_1 = 5 - 1{,}1 \\times 10 = 5 - 11 = -6{,}0$</div>
            <div class="why">Мы «перешагнули» через минимум $w^*=0$ и оказались с другой стороны, причём ещё дальше! $|w_0|=5$, $|w_1|=6$ — уже хуже.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Рост по геометрической прогрессии</h4>
            <div class="calc">$|w_t| = 5 \\cdot 1{,}2^t$, поэтому $L(w_t) = 25 \\cdot 1{,}44^t$</div>
            <div class="why">Через 10 шагов $|w| \\approx 5 \\cdot 1{,}2^{10} \\approx 31$, $L \\approx 960$. Через 50 шагов $L \\approx 10^8$. Это и есть расходимость — loss уходит в бесконечность.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Условие сходимости для $L(w) = w^2$</h4>
            <p>Функция $L$-гладкая с $L_{\\text{Lips}}=2$ (максимальное собственное значение гессиана). Условие сходимости GD:</p>
            <div class="calc">$\\eta < \\dfrac{2}{L_{\\text{Lips}}} = \\dfrac{2}{2} = 1{,}0$</div>
            <div class="why">При $\\eta = 1{,}1 > 1{,}0$ условие нарушено → расходимость. При $\\eta = 1{,}0$ алгоритм зависает: $w_{t+1} = w_t(1-2) = -w_t$, осциллирует без сходимости.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>При $\\eta = 1{,}1$ алгоритм <b>расходится</b>: $w$ меняет знак на каждом шаге и растёт по модулю как $5 \\cdot 1{,}2^t$. Loss не убывает, а взрывается. В практике DL это проявляется как: loss = NaN, веса = ±inf.</p>
          </div>

          <div class="lesson-box">
            <b>Практический вывод:</b> если на графике loss растёт или скачет с нарастающей амплитудой — уменьши $\\eta$ в 3–10 раз. Правило безопасного начала: $\\eta_{\\text{old}} / 10$.
          </div>
        `
      },
      {
        title: 'SGD vs Batch GD',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Есть 4 точки данных: $(1, 2),\\,(2, 4),\\,(3, 5),\\,(4, 8)$. Обучаем модель $\\hat{y} = w \\cdot x$ (без bias). Loss = <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a>. Сравниваем Batch GD и SGD при $\\eta = 0{,}05$, $w_0 = 0$.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Точка $(x_i, y_i)$</th><th>$\\hat{y}_i = w \\cdot x_i$ при $w=0$</th><th>Ошибка $e_i$</th><th>Вклад в градиент</th></tr>
              <tr><td>(1, 2)</td><td>0</td><td>−2</td><td>$-2 \\cdot 1 = -2$</td></tr>
              <tr><td>(2, 4)</td><td>0</td><td>−4</td><td>$-4 \\cdot 2 = -8$</td></tr>
              <tr><td>(3, 5)</td><td>0</td><td>−5</td><td>$-5 \\cdot 3 = -15$</td></tr>
              <tr><td>(4, 8)</td><td>0</td><td>−8</td><td>$-8 \\cdot 4 = -32$</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Batch GD: точный градиент по всем данным</h4>
            <p>Градиент MSE: $\\nabla_w L = -\\frac{2}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i) x_i$</p>
            <div class="calc">$\\nabla_w L = -\\dfrac{2}{4}(2 + 8 + 15 + 32) = -\\dfrac{2}{4} \\cdot 57 = -28{,}5$</div>
            <div class="calc">$w_1 = 0 - 0{,}05 \\cdot (-28{,}5) = +1{,}425$</div>
            <div class="why">Один шаг Batch GD использует все 4 точки и делает точный шаг. Но для 1 млн точек — нужно обработать всё до первого обновления.</div>
          </div>

          <div class="step" data-step="2">
            <h4>SGD: обновление по одной точке за раз</h4>
            <p>Берём точки по порядку: $(1,2)$, $(2,4)$, $(3,5)$, $(4,8)$. Это один «проход» (epoch).</p>
            <div class="calc">
              $w_0 = 0$, точка $(1,2)$: $\\nabla = -2(2-0) \\cdot 1 = -4$, $w_1 = 0 + 0{,}05 \\cdot 4 = 0{,}20$<br>
              Точка $(2,4)$: $\\nabla = -2(4-0{,}20 \\cdot 2) \\cdot 2 = -2(4-0{,}4) \\cdot 2 = -14{,}4$, $w_2 = 0{,}20 + 0{,}05 \\cdot 14{,}4 = 0{,}92$<br>
              Точка $(3,5)$: $\\nabla = -2(5 - 0{,}92 \\cdot 3) \\cdot 3 = -2(5-2{,}76) \\cdot 3 = -13{,}44$, $w_3 = 0{,}92 + 0{,}672 = 1{,}59$<br>
              Точка $(4,8)$: $\\nabla = -2(8 - 1{,}59 \\cdot 4) \\cdot 4 = -2(8-6{,}36) \\cdot 4 = -13{,}12$, $w_4 = 1{,}59 + 0{,}656 = 2{,}25$
            </div>
            <div class="why">После одной эпохи SGD: $w = 2{,}25$. Batch GD за те же 4 вычисления: $w = 1{,}425$. SGD «зашёл дальше», но путь был шумным — каждый шаг в разном направлении.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Сравнение путей</h4>
            <p>Истинный оптимум (МНК): $w^* = \\frac{\\sum x_i y_i}{\\sum x_i^2} = \\frac{1 \\cdot 2 + 2 \\cdot 4 + 3 \\cdot 5 + 4 \\cdot 8}{1+4+9+16} = \\frac{57}{30} = 1{,}9$</p>
            <div class="calc">Batch GD: $0 \\to 1{,}425 \\to 1{,}761 \\to 1{,}854 \\to \\ldots$ — гладко, монотонно к 1,9</div>
            <div class="calc">SGD: $0 \\to 0{,}20 \\to 0{,}92 \\to 1{,}59 \\to 2{,}25 \\to \\ldots$ — скачет, но быстрее движется в нужном направлении</div>
            <div class="why">SGD быстро даёт «хорошее» решение, но осциллирует около оптимума. На больших данных это не проблема — используют уменьшающийся $\\eta$ (learning rate schedule).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Batch GD: 1 обновление = 4 вычисления, путь гладкий. SGD: 4 обновления = 4 вычисления, путь шумный, но быстрее сходится за эпоху. На больших датасетах (1M точек) SGD делает 1M обновлений за то время, когда Batch GD — одно.</p>
          </div>

          <div class="lesson-box">
            <b>Стандарт в DL:</b> Mini-batch SGD с батчем 32–256 — компромисс. Каждый батч даёт «зашумлённый, но не совсем случайный» градиент. Плюс: параллельность на GPU при матричных операциях.
          </div>
        `
      },
    ],

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
              options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Loss' } }, scales: { y: { type: 'logarithmic', min: 1e-6 } } },
            });
            App.registerChart(window._gdLossChart);
          }
          window._gdLossChart.data.labels = lossHistory.map((_, i) => i);
          window._gdLossChart.data.datasets[0].data = lossHistory.map(v => Math.max(1e-6, v));
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

    python: `
      <h3>Градиентный спуск на Python</h3>
      <p>Реализуем GD вручную через numpy, затем используем оптимизаторы PyTorch — SGD и Adam.</p>

      <h4>1. Ручной градиентный спуск на numpy (функция y = x²)</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt

# Функция и её производная
def f(x):
    return x ** 2

def grad_f(x):
    return 2 * x

# Параметры обучения
x = 10.0          # начальная точка
lr = 0.1          # скорость обучения (learning rate)
n_steps = 30      # количество шагов

history = [x]

for step in range(n_steps):
    g = grad_f(x)          # вычисляем градиент
    x = x - lr * g         # шаг в сторону антиградиента
    history.append(x)
    if step % 5 == 0:
        print(f"Шаг {step:3d}: x={x:.4f}, f(x)={f(x):.6f}")

print(f"Минимум найден: x={x:.6f}, f(x)={f(x):.2e}")

# Визуализация сходимости
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
xs = np.linspace(-11, 11, 300)
plt.plot(xs, xs**2, 'b-', label='f(x)=x²')
plt.scatter(history, [f(h) for h in history], c='red', s=30, zorder=5)
plt.title('Траектория спуска'); plt.legend()

plt.subplot(1, 2, 2)
plt.plot([f(h) for h in history], 'r-o', markersize=4)
plt.xlabel('Шаг'); plt.ylabel('f(x)'); plt.title('Сходимость')
plt.tight_layout(); plt.show()
</code></pre>

      <h4>2. Сравнение SGD и Adam через PyTorch</h4>
      <pre><code>import torch
import torch.optim as optim
import matplotlib.pyplot as plt

def run_optimizer(opt_class, **kwargs):
    """Запускаем оптимизатор и возвращаем историю потерь."""
    x = torch.tensor([10.0], requires_grad=True)  # параметр
    opt = opt_class([x], **kwargs)
    losses = []

    for _ in range(50):
        opt.zero_grad()           # обнуляем градиенты
        loss = x ** 2             # f(x) = x² — наша функция потерь
        loss.backward()           # автодифференцирование
        opt.step()                # обновляем x
        losses.append(loss.item())

    return losses

# Запускаем оба оптимизатора
losses_sgd  = run_optimizer(optim.SGD,  lr=0.1)
losses_adam = run_optimizer(optim.Adam, lr=0.5)

# Сравниваем сходимость
plt.plot(losses_sgd,  label='SGD  lr=0.1')
plt.plot(losses_adam, label='Adam lr=0.5')
plt.xlabel('Шаг'); plt.ylabel('Потеря f(x)')
plt.title('SGD vs Adam на f(x)=x²')
plt.legend(); plt.yscale('log'); plt.show()
</code></pre>

      <h4>3. Мини-батчевый SGD на линейной регрессии</h4>
      <pre><code>import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader

# Генерируем данные: y = 3x + 2 + шум
torch.manual_seed(42)
X = torch.randn(200, 1)
y = 3 * X + 2 + 0.5 * torch.randn(200, 1)

# DataLoader для мини-батчей
dataset = TensorDataset(X, y)
loader  = DataLoader(dataset, batch_size=32, shuffle=True)

# Линейная модель и оптимизатор
model   = nn.Linear(1, 1)
opt     = optim.SGD(model.parameters(), lr=0.05, momentum=0.9)
loss_fn = nn.MSELoss()

# Цикл обучения
for epoch in range(20):
    total_loss = 0
    for xb, yb in loader:           # итерируем по мини-батчам
        opt.zero_grad()
        pred = model(xb)
        loss = loss_fn(pred, yb)
        loss.backward()
        opt.step()
        total_loss += loss.item()
    if epoch % 5 == 0:
        print(f"Epoch {epoch:2d}: loss={total_loss/len(loader):.4f}")

w, b = model.weight.item(), model.bias.item()
print(f"Найдены: w={w:.3f} (истинное 3), b={b:.3f} (истинное 2)")
</code></pre>
    `,

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
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=IHZwWFHWa-w" target="_blank">3Blue1Brown: Gradient Descent, как обучаются нейросети</a> — интуиция с визуализацией ландшафта потерь</li>
        <li><a href="https://www.youtube.com/watch?v=sDv4f4s2SB8" target="_blank">StatQuest: Gradient Descent</a> — пошаговое объяснение с числовыми примерами</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BF%D1%83%D1%81%D0%BA%20%D0%BE%D0%BF%D1%82%D0%B8%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F" target="_blank">Habr: Градиентный спуск</a> — SGD, Mini-batch, Adam и их сравнение с кодом</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://pytorch.org/docs/stable/optim.html" target="_blank">PyTorch torch.optim</a> — документация оптимизаторов SGD, Adam, AdamW и других</li>
      </ul>
    `,
  },
});
