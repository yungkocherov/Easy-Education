/* ==========================================================================
   Логистическая регрессия
   ========================================================================== */
App.registerTopic({
  id: 'logistic-regression',
  category: 'ml-cls',
  title: 'Логистическая регрессия',
  summary: `Классификация через <a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">сигмоиду</a>: предсказываем вероятность класса.`,

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> ·
        <a onclick="App.selectTopic('probability-basics')">Теория вероятности</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты врач и оцениваешь риск болезни. Чем больше неблагоприятных факторов — возраст, курение, давление — тем выше риск. Но ответить нужно <b>вероятностью</b>: не «точно болен», а «80% вероятность».</p>
        <p>Линейная формула «риск = −3 + 0.05·возраст + 1.5·курение + 0.02·давление» даёт любое число: может быть −5, может быть +15. Но вероятность должна быть между 0 и 1. Как связать?</p>
        <p>Решение: пропустить линейный результат через «сплющивающую» функцию — <b>сигмоиду</b>. Она превращает любое число в вероятность: большое положительное → близко к 1, большое отрицательное → близко к 0, ноль → ровно 0.5. Это и есть логистическая регрессия.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 195" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <!-- Axes -->
          <line x1="55" y1="20" x2="55" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <line x1="55" y1="97" x2="470" y2="97" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
          <line x1="55" y1="175" x2="470" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <!-- Axis labels -->
          <text x="460" y="188" font-size="10" fill="#64748b">z</text>
          <text x="32" y="24" font-size="10" fill="#64748b">P(y=1)</text>
          <!-- Y-axis ticks -->
          <text x="50" y="178" text-anchor="end" font-size="9" fill="#64748b">0</text>
          <text x="50" y="100" text-anchor="end" font-size="9" fill="#64748b">0.5</text>
          <text x="50" y="24" text-anchor="end" font-size="9" fill="#64748b">1</text>
          <!-- Sigmoid curve -->
          <path d="M55,170 C80,168 110,162 150,148 C185,135 205,115 240,97 C270,80 295,62 335,48 C365,37 395,28 465,24" fill="none" stroke="#6366f1" stroke-width="2.8"/>
          <!-- Threshold line at 0.5 -->
          <line x1="240" y1="25" x2="240" y2="175" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4"/>
          <text x="242" y="40" font-size="9" fill="#f59e0b" font-weight="600">порог 0.5</text>
          <!-- Class labels -->
          <text x="120" y="190" text-anchor="middle" font-size="10" fill="#10b981" font-weight="600">→ класс 0</text>
          <text x="360" y="190" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="600">→ класс 1</text>
          <!-- Horizontal threshold line label -->
          <text x="62" y="94" font-size="8" fill="#64748b">─ ─ ─</text>
          <!-- Arrow annotation -->
          <text x="390" y="130" font-size="9" fill="#6366f1">σ(z) = 1/(1+e⁻ᶻ)</text>
        </svg>
        <div class="caption">Сигмоидная функция: превращает любое число z в вероятность от 0 до 1. Жёлтая пунктирная линия — порог 0.5 для принятия решения о классе.</div>
      </div>

      <h3>🎯 Зачем нужна логистическая регрессия</h3>
      <p>Классификация — одна из главных задач ML: определить, к какому классу относится объект. Спам или нет? Заболеет или нет? Уйдёт клиент или нет?</p>
      <p>Мы <b>могли бы</b> применить линейную регрессию: <code>0 или 1</code> как таргет, потом круглить. Но это плохо работает:</p>
      <ul>
        <li>Предсказания вылетают за [0, 1] — бессмысленные вероятности.</li>
        <li>Линейная модель пытается подогнать прямую через 0 и 1 — плохо описывает реальность.</li>
        <li>Ошибки распределены не нормально, предположения линейной регрессии нарушены.</li>
      </ul>
      <p>Логистическая регрессия решает эту проблему: <b>выдаёт настоящую вероятность</b> и правильно моделирует бинарный таргет.</p>

      <h3>📈 Сигмоидная функция</h3>
      <div class="math-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>

      <p>Это <span class="term" data-tip="Sigmoid function. S-образная функция, преобразующая любое число в интервал (0, 1). Используется в логистической регрессии и нейросетях.">сигмоида</span> — S-образная кривая. Её свойства:</p>
      <ul>
        <li>При $z \\to -\\infty$: $\\sigma(z) \\to 0$.</li>
        <li>При $z = 0$: $\\sigma(z) = 0.5$.</li>
        <li>При $z \\to +\\infty$: $\\sigma(z) \\to 1$.</li>
        <li>Гладкая, дифференцируемая.</li>
        <li>Симметрична относительно (0, 0.5).</li>
      </ul>

      <p>Красивое свойство производной: $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$. Это упрощает вычисления <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">градиентов</a>.</p>

      <h3>🧮 Модель логистической регрессии</h3>
      <p>Берём линейную комбинацию признаков и пропускаем через сигмоиду:</p>
      <div class="math-block">$$P(y = 1 \\mid x) = \\sigma(w_0 + w_1 x_1 + \\ldots + w_p x_p)$$</div>

      <p>Результат — вероятность того, что объект относится к классу 1. Вероятность класса 0: $1 - P(y = 1 \\mid x)$.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Логистическая регрессия строит <b>линейную</b> границу между классами, но выражает неопределённость около границы через вероятности. Далеко от границы модель «уверена» (p близко к 0 или 1), близко к границе — сомневается (p близко к 0.5).</p>
      </div>

      <h3>🔍 От вероятности к классу</h3>
      <p>Чтобы получить класс, нужно применить <b>порог</b>:</p>
      <div class="math-block">$$\\hat{y} = \\begin{cases} 1, & P(y=1 \\mid x) \\geq 0.5 \\\\ 0, & \\text{иначе} \\end{cases}$$</div>

      <p>Порог 0.5 — по умолчанию, но его можно (и нужно) менять под задачу:</p>
      <ul>
        <li><b>Низкий порог (0.3)</b>: ловим больше положительных, но больше ложных тревог.</li>
        <li><b>Высокий порог (0.7)</b>: меньше ложных тревог, но больше пропусков.</li>
      </ul>

      <h3>📉 <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">Функция потерь</a>: log-loss</h3>
      <p>Для линейной регрессии мы использовали <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a>. Для классификации — нет, потому что она плохо работает с вероятностями. Используем <span class="term" data-tip="Cross-entropy loss / Log-loss. Функция потерь для классификации. Сильно наказывает уверенные неправильные предсказания (p → 0 для верного класса).">cross-entropy loss</span> (log-loss):</p>
      <div class="math-block">$$L = -\\frac{1}{n} \\sum_{i=1}^{n} [y_i \\log(\\hat{p}_i) + (1-y_i) \\log(1 - \\hat{p}_i)]$$</div>

      <p><b>Интуиция:</b> для каждого примера штраф = $-\\log(\\text{вероятность правильного класса})$.</p>
      <ul>
        <li>Правильный класс с вероятностью 0.99 → штраф ≈ 0.01 (маленький).</li>
        <li>Правильный класс с вероятностью 0.01 → штраф ≈ 4.6 (огромный).</li>
        <li>Правильный класс с вероятностью 0 → штраф = ∞.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Откуда берётся cross-entropy: вывод из Maximum Likelihood</div>
        <p>Модель говорит: вероятность $y_i = 1$ равна $\\hat{p}_i$. Значит вероятность одного наблюдения: $P(y_i \\mid x_i) = \\hat{p}_i^{y_i} (1 - \\hat{p}_i)^{1-y_i}$.</p>
        <p>Для всего датасета (наблюдения независимы): $\\mathcal{L} = \\prod_{i=1}^n \\hat{p}_i^{y_i} (1-\\hat{p}_i)^{1-y_i}$.</p>
        <p>Логарифмируем (log не меняет максимум): $\\log \\mathcal{L} = \\sum [y_i \\log \\hat{p}_i + (1-y_i) \\log(1-\\hat{p}_i)]$.</p>
        <p>Максимизировать $\\log \\mathcal{L}$ = минимизировать $-\\log \\mathcal{L}$ = <b>cross-entropy loss</b>. Не магия, а логичное следствие из вероятностной модели.</p>
      </div>

      <p><b>Почему именно log:</b></p>
      <ul>
        <li>Это <span class="term" data-tip="Maximum Likelihood Estimation. Метод поиска параметров, максимизирующий вероятность наблюдать реальные данные при модели.">MLE</span> для Бернуллиевского распределения (доказано выше).</li>
        <li>Функция <b>выпуклая</b> — гарантируется глобальный минимум.</li>
        <li>Гладкая, легко оптимизируется градиентным спуском.</li>
        <li>Сильно наказывает <b>уверенные неправильные</b> предсказания.</li>
      </ul>

      <h3>⚙️ Обучение: градиентный спуск</h3>
      <p>В отличие от линейной регрессии, у логистической <b>нет</b> аналитического решения. Веса ищут итеративно:</p>
      <ol>
        <li>Инициализируем веса нулями (или малыми случайными).</li>
        <li>Считаем градиент log-loss по весам.</li>
        <li>Делаем шаг против градиента: $w \\leftarrow w - \\eta \\cdot \\nabla L$.</li>
        <li>Повторяем до сходимости.</li>
      </ol>

      <p>Градиент красиво упрощается: $\\nabla L = \\frac{1}{n} X^T (\\hat{p} - y)$. Это очень похоже на линейную регрессию!</p>

      <h3>📖 Интерпретация коэффициентов через odds ratio</h3>
      <p>Коэффициенты в линейной регрессии интерпретируются напрямую. В логистической — через <span class="term" data-tip="Odds ratio. Отношение шансов: P / (1-P). Логистическая регрессия линейна в log(odds).">шансы (odds)</span>.</p>
      <p><b>Шансы:</b> $\\text{odds} = \\frac{P}{1-P}$. Если P = 0.75, то odds = 3 (шансы 3 к 1).</p>
      <p>Логистическая регрессия делает линейными именно <b>log(odds)</b>:</p>
      <div class="math-block">$$\\log\\frac{P}{1-P} = w_0 + w_1 x_1 + \\ldots + w_p x_p$$</div>

      <p><b>Интерпретация:</b> если $w_i = 0.7$, то при увеличении признака на 1, шансы умножаются на $e^{0.7} \\approx 2.0$. То есть шансы удваиваются.</p>

      <h3>📊 Многоклассовая классификация (<a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">Softmax</a>)</h3>
      <p>Для более чем 2 классов используют <span class="term" data-tip="Softmax function. Обобщение сигмоиды на несколько классов. Превращает вектор чисел в распределение вероятностей (сумма = 1)."><a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">softmax</a></span> — обобщение сигмоиды:</p>
      <div class="math-block">$$P(y = k \\mid x) = \\frac{e^{z_k}}{\\sum_{j=1}^{K} e^{z_j}}$$</div>

      <p>Для каждого класса свой набор весов и своя линейная комбинация $z_k = w_k^T x + b_k$. Softmax превращает все $z_k$ в распределение вероятностей (сумма = 1). Модель предсказывает класс с наибольшей вероятностью.</p>
      <p><b>Пример:</b> 3 класса, $z = [2.0, 1.0, 0.5]$:</p>
      <ul>
        <li>$e^{2.0} = 7.39$, $e^{1.0} = 2.72$, $e^{0.5} = 1.65$ → сумма = 11.76</li>
        <li>$P = [0.63, 0.23, 0.14]$ → класс 1 (63%)</li>
      </ul>
      <p>Функция потерь для многоклассовой задачи — <b>categorical cross-entropy</b>: $L = -\\sum_k y_k \\log P(y=k)$, где $y_k$ — <a class="glossary-link" onclick="App.selectTopic('glossary-one-hot')">one-hot</a> вектор (1 для правильного класса, 0 для остальных). В sklearn: <code>LogisticRegression(multi_class='multinomial')</code>.</p>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Логистическая регрессия — это регрессия»</b> — нет, это <b>классификация</b>. Название историческое.</li>
        <li><b>«Она линейная, поэтому простая»</b> — формула линейная, но граница — тоже линейная. Для сложных форм нужны feature engineering или ядра.</li>
        <li><b>«Порог 0.5 всегда оптимальный»</b> — нет. При дисбалансе классов или разной цене ошибок порог нужно настраивать.</li>
        <li><b>«Вероятности логрега всегда калиброваны»</b> — обычно хорошо, но при регуляризации или дисбалансе могут быть искажены.</li>
      </ul>

      <h3>⚖️ Плюсы и ограничения</h3>
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

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Линейная регрессия</b> — родственница, только для регрессии.</li>
        <li><b>Регуляризация</b> — L1/L2 встроены в логрег.</li>
        <li><b>ROC-AUC</b> — анализирует вероятности, которые выдаёт логрег.</li>
        <li><b>Нейросети</b> — логрег это простейшая нейросеть.</li>
        <li><b>SVM</b> — тоже ищет линейную границу, но с другим критерием.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Вероятность сдачи экзамена',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучить логистическую регрессию по данным «часы подготовки → сдал/не сдал» и интерпретировать вероятности.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Студент</th><th>Часов занятий</th><th>Результат</th></tr>
              <tr><td>Аня</td><td>1</td><td>Не сдала (0)</td></tr>
              <tr><td>Борис</td><td>2</td><td>Не сдал (0)</td></tr>
              <tr><td>Вера</td><td>3</td><td>Не сдала (0)</td></tr>
              <tr><td>Гриша</td><td>4</td><td>Сдал (1)</td></tr>
              <tr><td>Даша</td><td>5</td><td>Сдала (1)</td></tr>
              <tr><td>Егор</td><td>8</td><td>Сдал (1)</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: модель логистической регрессии</h4>
            <div class="calc">
              P(сдал | часы) = σ(w₀ + w₁·часы)<br>
              После обучения: w₀ = −4, w₁ = 1.0<br>
              z = −4 + 1.0 · часы<br>
              σ(z) = 1 / (1 + e^(−z))
            </div>
            <div class="why">Логит z — линейная функция от признаков. Сигмоида давит его в диапазон (0, 1) — интерпретируем как вероятность.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить вероятности</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Часов</th><th>z = −4 + 1·x</th><th>e^(−z)</th><th>P(сдал)</th></tr>
                <tr><td>1</td><td>−3</td><td>20.09</td><td>1/(1+20.09) = <b>0.047</b></td></tr>
                <tr><td>2</td><td>−2</td><td>7.39</td><td>1/(1+7.39) = <b>0.119</b></td></tr>
                <tr><td>3</td><td>−1</td><td>2.72</td><td>1/(1+2.72) = <b>0.269</b></td></tr>
                <tr><td>4</td><td>0</td><td>1.00</td><td>1/(1+1) = <b>0.500</b></td></tr>
                <tr><td>5</td><td>+1</td><td>0.37</td><td>1/(1+0.37) = <b>0.731</b></td></tr>
                <tr><td>8</td><td>+4</td><td>0.018</td><td>1/(1+0.018) = <b>0.982</b></td></tr>
              </table>
            </div>
            <div class="why">При 4 часах — вероятность 50%: это точка безразличия. Меньше 4 часов — скорее не сдаст, больше — скорее сдаст.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: применить порог 0.5</h4>
            <div class="calc">
              P ≥ 0.5 → предсказываем «сдал» (1)<br>
              1 час: 0.047 → 0 ✓, 3 часа: 0.269 → 0 ✓<br>
              4 часа: 0.500 → 1 ✓, 5 часов: 0.731 → 1 ✓<br>
              Accuracy = 6/6 = 100% (на обучении)
            </div>
            <div class="why">На маленькой выборке идеальное разделение. В реальности данные с шумом, и модель не будет идеальной.</div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 430 165" xmlns="http://www.w3.org/2000/svg" style="max-width:430px;">
              <text x="215" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Сигмоида: P(сдал) = σ(−4 + x)</text>
              <!-- Axes -->
              <line x1="50" y1="20" x2="50" y2="140" stroke="#64748b" stroke-width="1.5"/>
              <line x1="50" y1="140" x2="410" y2="140" stroke="#64748b" stroke-width="1.5"/>
              <text x="228" y="158" text-anchor="middle" font-size="10" fill="#64748b">Часов подготовки</text>
              <text x="18" y="82" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,18,82)">P(сдал)</text>
              <!-- X ticks: 1..8 → x=50 + h*45, h=1→95, 2→140, 3→185, 4→230, 5→275, 6→320, 7→365, 8→410 -->
              <text x="95" y="152" text-anchor="middle" font-size="9" fill="#64748b">1</text>
              <text x="140" y="152" text-anchor="middle" font-size="9" fill="#64748b">2</text>
              <text x="185" y="152" text-anchor="middle" font-size="9" fill="#64748b">3</text>
              <text x="230" y="152" text-anchor="middle" font-size="9" fill="#64748b">4</text>
              <text x="275" y="152" text-anchor="middle" font-size="9" fill="#64748b">5</text>
              <text x="320" y="152" text-anchor="middle" font-size="9" fill="#64748b">6</text>
              <text x="365" y="152" text-anchor="middle" font-size="9" fill="#64748b">7</text>
              <text x="408" y="152" text-anchor="middle" font-size="9" fill="#64748b">8</text>
              <!-- Y ticks: 0, 0.5, 1.0 → y=140, 80, 20 -->
              <text x="45" y="143" text-anchor="end" font-size="9" fill="#64748b">0</text>
              <text x="45" y="83" text-anchor="end" font-size="9" fill="#64748b">0.5</text>
              <text x="45" y="23" text-anchor="end" font-size="9" fill="#64748b">1.0</text>
              <line x1="50" y1="80" x2="410" y2="80" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,3"/>
              <!-- Sigmoid curve: P values → y = 140 - P*120 -->
              <!-- x=1: P=0.047 → y=134, x=2: P=0.119→y=126, x=3: P=0.269→y=108, x=4: P=0.5→y=80, x=5: P=0.731→y=52, x=8: P=0.982→y=22 -->
              <path d="M60,137 C80,135 100,130 140,126 C165,123 180,118 185,108 C200,92 215,85 230,80 C255,72 265,56 275,52 C300,38 340,26 410,22" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- Decision boundary at x=4 -->
              <line x1="230" y1="20" x2="230" y2="140" stroke="#64748b" stroke-width="1" stroke-dasharray="5,3"/>
              <text x="232" y="36" font-size="9" fill="#64748b">граница</text>
              <text x="232" y="47" font-size="9" fill="#64748b">x=4ч</text>
              <!-- Data dots: (1,0),(2,0),(3,0) → red; (4,1),(5,1),(8,1) → green -->
              <circle cx="95" cy="140" r="6" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
              <circle cx="140" cy="140" r="6" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
              <circle cx="185" cy="140" r="6" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
              <circle cx="230" cy="20" r="6" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <circle cx="275" cy="20" r="6" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <circle cx="408" cy="20" r="6" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <!-- Labels on points -->
              <text x="95" y="156" text-anchor="middle" font-size="8" fill="#ef4444">не сдал</text>
              <text x="275" y="13" text-anchor="middle" font-size="8" fill="#10b981">сдал</text>
            </svg>
            <div class="caption">Сигмоида плавно переходит от 0 к 1. Красные точки — не сдали, зелёные — сдали. Вертикальная пунктирная линия — граница решения (4 часа, P=0.5).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Модель P = σ(−4 + x) показывает: при 4 часах занятий — 50% шанс, при 6 часах — σ(2) ≈ 88%, при 2 часах — лишь 12%. Граница решения: 4 часа.</p>
          </div>
          <div class="lesson-box">
            Граница решения (decision boundary) — это где z = 0, т.е. w₀ + w₁·x = 0. Здесь x* = 4/1 = 4 часа. В 2D это прямая; в nD — гиперплоскость.
          </div>
        `,
      },
      {
        title: 'Odds Ratio: факторы риска',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Интерпретировать коэффициенты логрегрессии через odds ratio для модели риска сердечного заболевания.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Признак</th><th>Коэффициент w</th><th>OR = e^w</th><th>Интерпретация</th></tr>
              <tr><td>Intercept</td><td>−5.2</td><td>—</td><td>базовый уровень</td></tr>
              <tr><td>Возраст (+1 год)</td><td>+0.05</td><td>1.051</td><td>риск ↑ на 5.1%</td></tr>
              <tr><td>Курение (да/нет)</td><td>+1.50</td><td>4.48</td><td>риск в 4.5 раза выше</td></tr>
              <tr><td>Давление (+10 ед.)</td><td>+0.30</td><td>1.35</td><td>риск ↑ на 35%</td></tr>
              <tr><td>Спорт (да/нет)</td><td>−0.80</td><td>0.45</td><td>риск в 2.2 раза ниже</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что такое odds?</h4>
            <div class="calc">
              P = 0.2 → odds = P/(1−P) = 0.2/0.8 = 0.25 (1:4 против события)<br>
              P = 0.5 → odds = 1.0 (равновероятно)<br>
              P = 0.8 → odds = 4.0 (в 4 раза вероятнее да, чем нет)
            </div>
            <div class="why">Odds (шансы) — удобный способ сравнивать вероятности. Логрег моделирует log(odds) как линейную функцию.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: пример расчёта для пациента</h4>
            <div class="calc">
              Пациент: возраст 50, курит, давление 140, не занимается спортом<br>
              z = −5.2 + 0.05·50 + 1.5·1 + 0.30·14 + (−0.80)·0<br>
              z = −5.2 + 2.5 + 1.5 + 4.2 + 0 = <b>3.0</b><br>
              P(заболевание) = σ(3.0) = 1/(1+e^(−3)) = 1/(1+0.05) ≈ <b>0.952</b>
            </div>
            <div class="why">Давление ÷ 10, т.к. коэффициент задан на каждые 10 единиц. 95% риск — высокий!</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: эффект отказа от курения</h4>
            <div class="calc">
              Тот же пациент, но бросил курить: w_курение = 1.5 → убираем<br>
              z = −5.2 + 2.5 + 0 + 4.2 + 0 = 1.5<br>
              P = σ(1.5) = 1/(1+e^(−1.5)) ≈ <b>0.818</b><br>
              Снижение риска: 95.2% → 81.8%, разница ≈ 13.4 п.п.
            </div>
            <div class="why">Odds Ratio курения = e^1.5 ≈ 4.48: у курящих шансы в 4.5 раза выше, чем у некурящих при прочих равных.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>OR > 1 — фактор риска увеличивает вероятность события. OR &lt; 1 — защищает. Курение с OR=4.48 — самый сильный фактор риска в этой модели.</p>
          </div>
          <div class="lesson-box">
            95% <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">доверительный интервал</a> для OR: exp(w ± 1.96·SE). Если ЦИ включает 1 — эффект статистически незначим. Логрег — стандарт в медицинских исследованиях именно из-за интерпретируемости через OR.
          </div>
        `,
      },
      {
        title: 'Порог и Precision/Recall',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Как выбор порога классификации влияет на Precision и Recall? Разобрать на примере детектора мошенничества.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Транзакция</th><th>P(мошенничество)</th><th>Факт</th></tr>
              <tr><td>T1</td><td>0.92</td><td>Мошенничество (1)</td></tr>
              <tr><td>T2</td><td>0.78</td><td>Мошенничество (1)</td></tr>
              <tr><td>T3</td><td>0.61</td><td>Мошенничество (1)</td></tr>
              <tr><td>T4</td><td>0.55</td><td>Нормальная (0)</td></tr>
              <tr><td>T5</td><td>0.38</td><td>Нормальная (0)</td></tr>
              <tr><td>T6</td><td>0.22</td><td>Мошенничество (1)</td></tr>
              <tr><td>T7</td><td>0.11</td><td>Нормальная (0)</td></tr>
              <tr><td>T8</td><td>0.04</td><td>Нормальная (0)</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: порог 0.5 — стандартный</h4>
            <div class="calc">
              Предсказываем «мошенничество» если P ≥ 0.5<br>
              Положительные (TP+FP): T1, T2, T3, T4<br>
              TP = 3 (T1, T2, T3 — реально мошенничество)<br>
              FP = 1 (T4 — нормальная, но предсказали мошенничество)<br>
              FN = 1 (T6 — мошенничество, но пропустили)<br>
              Precision = TP/(TP+FP) = 3/4 = <b>0.75</b><br>
              Recall = TP/(TP+FN) = 3/4 = <b>0.75</b>
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: понизить порог до 0.2 — больше recall</h4>
            <div class="calc">
              Предсказываем «мошенничество» если P ≥ 0.2<br>
              Положительные: T1, T2, T3, T4, T5, T6<br>
              TP = 4 (T1, T2, T3, T6), FP = 2 (T4, T5), FN = 0<br>
              Precision = 4/6 = <b>0.667</b><br>
              Recall = 4/4 = <b>1.00</b> (все мошенничества пойманы!)
            </div>
            <div class="why">Низкий порог: не пропустим ни одного мошенника, но будем чаще ошибочно блокировать честные транзакции.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: повысить порог до 0.7 — больше precision</h4>
            <div class="calc">
              Предсказываем «мошенничество» если P ≥ 0.7<br>
              Положительные: T1, T2<br>
              TP = 2, FP = 0, FN = 2 (T3, T6 пропущены)<br>
              Precision = 2/2 = <b>1.00</b> (нет ложных тревог!)<br>
              Recall = 2/4 = <b>0.50</b>
            </div>
            <div class="why">Высокий порог: только самые уверенные срабатывания, но половину мошенников пропустим.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Нет универсального порога: при мошенничестве важнее Recall (не пропустить преступника) → порог 0.2–0.3. При медицинском скрининге — аналогично. При спам-фильтрации — Precision (не потерять важные письма) → порог 0.7–0.8.</p>
          </div>
          <div class="lesson-box">
            F1-score = 2·P·R/(P+R) — баланс между Precision и Recall. Для поиска оптимального порога строят PR-curve и выбирают точку с максимальным F1.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: логистическая регрессия в 2D</h3>
        <p>Два признака, два класса. Поставь большую разделимость, λ=0 и жми «Обучить» несколько раз — увидишь, как $\\|w\\|$ уходит в бесконечность (классы разделимы → MLE не определён). Добавь L2 — и норма весов стабилизируется.</p>
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
        const cL2 = App.makeControl('range', 'logr-l2', 'L2 регуляризация λ', { min: 0, max: 1, step: 0.01, value: 0 });
        [cSep, cN, cLR, cL2].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;
        let X = [], y = [];
        let w = [0.01, 0.01, 0.01]; // w0 (bias), w1, w2
        let iterations = 0;

        function sigmoid(z) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z)))); }

        function regenerate() {
          const sep = +cSep.input.value;
          const n = +cN.input.value;
          X = []; y = [];
          for (let i = 0; i < n; i++) {
            X.push([App.Util.randn(-sep, 1), App.Util.randn(-sep, 1)]); y.push(0);
            X.push([App.Util.randn(sep, 1), App.Util.randn(sep, 1)]); y.push(1);
          }
          w = [0.01, 0.01, 0.01];
          iterations = 0;
          update();
        }

        function trainStep() {
          const lr = +cLR.input.value;
          const lam = +cL2.input.value;
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
          // L2 регуляризация: штраф не применяется к bias
          w[0] -= lr * (g0 / n);
          w[1] -= lr * (g1 / n + lam * w[1]);
          w[2] -= lr * (g2 / n + lam * w[2]);
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

          const wNorm = Math.sqrt(w[1] * w[1] + w[2] * w[2]);
          const statsEl = container.querySelector('#logr-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Итераций', iterations],
            ['Log-loss', App.Util.round(loss, 4)],
            ['Accuracy', (correct / n * 100).toFixed(1) + '%'],
            ['||w|| (без bias)', App.Util.round(wNorm, 2)],
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

    python: `
      <h3>Python: логистическая регрессия</h3>
      <p>sklearn.LogisticRegression поддерживает мультикласс, регуляризацию и выдачу вероятностей через predict_proba.</p>

      <h4>1. Бинарная классификация и predict_proba</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score

# Датасет рак молочной железы: 569 наблюдений, 30 признаков
data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                       stratify=y, random_state=42)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

model = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
model.fit(X_train_s, y_train)

# predict_proba возвращает [P(класс=0), P(класс=1)]
y_proba = model.predict_proba(X_test_s)[:, 1]
y_pred = model.predict(X_test_s)

print(f'ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}')
print(classification_report(y_test, y_pred,
      target_names=data.target_names))</code></pre>

      <h4>2. Анализ коэффициентов</h4>
      <pre><code>import pandas as pd

# Коэффициенты показывают вклад каждого признака в log-odds
coef_df = pd.DataFrame({
    'признак': data.feature_names,
    'коэффициент': model.coef_[0],
}).sort_values('коэффициент')

plt.figure(figsize=(8, 8))
plt.barh(coef_df['признак'], coef_df['коэффициент'])
plt.axvline(0, color='black', linewidth=0.8)
plt.xlabel('Коэффициент (log-odds)')
plt.title('Логистическая регрессия: важность признаков')
plt.tight_layout()
plt.show()

# Интерпретация через odds ratio
odds_ratio = np.exp(model.coef_[0])
top5 = pd.Series(odds_ratio, index=data.feature_names).sort_values(ascending=False).head(5)
print('Top-5 признаков (odds ratio):')
print(top5.round(3))</code></pre>

      <h4>3. Мультиклассовая классификация</h4>
      <pre><code>from sklearn.datasets import load_iris
from sklearn.metrics import ConfusionMatrixDisplay

iris = load_iris()
X_i, y_i = iris.data, iris.target
X_tr, X_te, y_tr, y_te = train_test_split(X_i, y_i, test_size=0.25, random_state=42)

# multi_class='multinomial' — softmax вместо one-vs-rest
model_multi = LogisticRegression(multi_class='multinomial', solver='lbfgs',
                                   C=1.0, max_iter=500)
model_multi.fit(X_tr, y_tr)
print(f'Accuracy: {model_multi.score(X_te, y_te):.4f}')

# Вероятности для каждого класса
proba = model_multi.predict_proba(X_te[:5])
print('Вероятности первых 5 примеров (3 класса):')
print(proba.round(3))

ConfusionMatrixDisplay.from_estimator(model_multi, X_te, y_te,
                                       display_labels=iris.target_names)
plt.title('<a class="glossary-link" onclick="App.selectTopic('glossary-confusion-matrix')">Матрица ошибок</a>: Iris (3 класса)')
plt.show()</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Кредитный скоринг.</b> Банки десятилетиями используют логистическую регрессию для предсказания вероятности дефолта (PD). Basel II/III и внутренние модели банков требуют объяснимой модели, а odds ratio по возрасту, доходу и кредитной истории — ровно то, что хочет видеть риск-комитет и регулятор.</li>
        <li><b>Медицинская диагностика.</b> «Вероятность наличия болезни по симптомам и анализам» — классика биостатистики. Клинические протоколы и диагностические шкалы (APACHE, Framingham risk score) построены на логистической регрессии, потому что врач должен понимать вклад каждого фактора.</li>
        <li><b>CTR prediction в рекламе.</b> На огромных разреженных признаках (one-hot от user_id × ad_id × context) логистическая регрессия с SGD и L1/L2 масштабируется до миллиардов параметров. Google, Yahoo, Meta годами крутили продакшен-рекламу именно на логрегах и FTRL-оптимизаторе.</li>
        <li><b>Антифрод и churn-прогноз.</b> Вероятность мошеннической транзакции или оттока клиента — задачи, где важна не только метка, но и порог. LR выдаёт калиброванные вероятности, по которым можно строить бизнес-правила: «&gt; 0.7 → блокировать, 0.3–0.7 → отправить на ручную проверку».</li>
        <li><b>Фильтрация спама и классификация текстов.</b> На bag-of-words / TF-IDF логрег с L2 — быстрый и сильный baseline. Обучается за секунды, легко обновляется, предсказание — один скалярный продукт.</li>
        <li><b>Baseline для любой бинарной классификации.</b> Первое, что запускает data scientist, чтобы понять «есть ли сигнал». Если логистическая регрессия уже даёт AUC 0.85, часто не нужен XGBoost.</li>
        <li><b>A/B-тесты с бинарным исходом.</b> Для оценки влияния фич на конверсию с контролем за ковариатами (пол, устройство, регион) — стандартный инструмент в experimentation-платформах.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Выдаёт калиброванные вероятности по определению.</b> В отличие от SVM или деревьев, $\\hat{p}$ из логистической регрессии — это не «score», а реальная оценка $P(y=1|x)$, подобранная через максимизацию правдоподобия. Можно напрямую выставлять бизнес-пороги, рисовать ROC/PR-кривые, считать Expected Value действий.</p>
      <p><b>Интерпретация через odds ratio.</b> $e^{\\beta_j}$ — во сколько раз меняется отношение шансов при росте $x_j$ на 1 единицу. Кредитный аналитик может сказать: «каждый +1 год работы на текущем месте уменьшает шанс дефолта в 1.15 раза». Это язык, который понимают бизнес и регулятор.</p>
      <p><b>Выпуклая функция потерь — гарантированный глобальный минимум.</b> Log-loss строго выпукла, любой градиентный метод сходится в одну и ту же оптимальную точку. Никаких локальных минимумов, как у нейросетей. Воспроизводимость обучения — важное свойство для регулируемых сред.</p>
      <p><b>Масштабируется до миллиардов признаков.</b> SGD + L1 регуляризация дают разреженные модели. Vowpal Wabbit, FTRL, online learning — всё это построено на логрегах. Ни одна другая модель не тренируется на таких объёмах настолько эффективно.</p>
      <p><b>Быстрое обучение и инференс.</b> На миллионе строк с 100 признаками — секунды обучения и микросекунды на прогноз. Критично для real-time систем: биржа, ad-бид, антифрод, где задержка &gt; 10 мс недопустима.</p>
      <p><b>Регуляризация встроена тривиально.</b> L2 (Ridge) спасает от мультиколлинеарности, L1 (Lasso) зануляет нерелевантные признаки, Elastic Net — гибрид. Одна строка кода в sklearn.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Только линейная граница в пространстве признаков.</b> Если истинная граница классов — окружность, спираль или XOR, логрег её не увидит. Придётся руками добавлять полиномы, взаимодействия или логарифмы. На сложных данных (изображения, сложные табличные с нелинейностями) это тупик — нужны деревья или нейросети.</p>
      <p><b>Чувствительна к выбросам и масштабу признаков.</b> Один экстремум с $x = 10^6$ сдвинет веса. Перед обучением обязательно StandardScaler или MinMaxScaler, иначе сходимость медленная, а регуляризация давит признаки неравномерно.</p>
      <p><b>Страдает от мультиколлинеарности.</b> Как и линейная регрессия: два сильно скоррелированных признака делают коэффициенты нестабильными и их невозможно интерпретировать по отдельности. Решение — Ridge или VIF-анализ и удаление дублей.</p>
      <p><b>Не работает с категориями «из коробки».</b> High-cardinality признаки (user_id, zip_code) превращаются в тысячи дамми-колонок, нужен target encoding или hashing. CatBoost/LightGBM справляются без возни.</p>
      <p><b>Полная разделимость ломает MLE.</b> Если классы линейно разделимы полностью, оптимальные веса уходят в бесконечность, коэффициенты растут, ошибка 0 — но модель неустойчива. Лечится только регуляризацией (L2 по умолчанию в sklearn именно поэтому).</p>
      <p><b>Несбалансированные классы без перевзвешивания дают смещение.</b> При ratio 1:1000 модель будет предсказывать почти всегда «нет». Нужно <code>class_weight='balanced'</code>, undersampling или смещение порога — иначе recall по редкому классу будет близок к нулю.</p>

      <h3>🧭 Когда брать логистическую регрессию — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери логрег когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Нужна интерпретация: какие факторы и насколько влияют на вероятность</td>
          <td>Граница классов явно нелинейна (XOR, кольца, спирали) и нет возможности ручного feature engineering</td>
        </tr>
        <tr>
          <td>Нужны откалиброванные вероятности для бизнес-порогов и ожидаемой ценности</td>
          <td>Данные — изображения, аудио, тексты длинной структурой: CNN, RNN, Transformer</td>
        </tr>
        <tr>
          <td>Регуляторика требует объяснимой модели (банки, медицина, страхование)</td>
          <td>У вас уже работает XGBoost/LightGBM и интерпретация не нужна — они обычно лучше по AUC</td>
        </tr>
        <tr>
          <td>Огромные разреженные данные (CTR, NLP на TF-IDF) — миллионы признаков</td>
          <td>Сильная мультиколлинеарность без возможности применить регуляризацию или очистить признаки</td>
        </tr>
        <tr>
          <td>Нужен быстрый baseline, обучающийся за секунды</td>
          <td>Смесь числовых и высокоразмерных категориальных признаков — деревья справятся без preprocessing</td>
        </tr>
        <tr>
          <td>Real-time инференс с требованием &lt; 1 мс (антифрод, биржа, ad-бид)</td>
          <td>Данных очень много (100M+) и нужна максимальная точность — нейросеть с эмбеддингами выжмет больше</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('random-forest')">Random Forest</a> или <a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a></b> — если зависимость нелинейна, есть взаимодействия признаков и интерпретация не обязательна. На табличных данных XGBoost/LightGBM почти всегда побеждают логрег по AUC на 3–10%.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('svm')">SVM</a> с RBF-ядром</b> — если граница классов сложная, но данных мало (до 10к). Даёт лучшие границы на small datasets, но теряет калибровку вероятностей и масштабируемость.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('naive-bayes')">Naive Bayes</a></b> — для задач классификации текстов с очень ограниченными данными. Быстрее логрега, работает даже на 100 примерах, хотя предположение о независимости признаков наивно.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('neural-network')">Нейросеть</a> (MLP)</b> — если данных много ($n &gt; 10^5$), признаки сложные и допустим blackbox. На табличных данных это обычно избыточно, но для эмбеддингов пользователей/товаров — лучший выбор.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('decision-tree')">Дерево решений</a></b> — если нужна абсолютно прозрачная модель «если → то» для бизнеса, которую можно перенести в if/else. Теряешь калиброванные вероятности, но выигрываешь в наглядности.</li>
      </ul>
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

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=yIYKR4sgzI8" target="_blank">StatQuest: Logistic Regression</a> — интуитивное объяснение логистической регрессии</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BB%D0%BE%D0%B3%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D1%80%D0%B5%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D1%8F%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F" target="_blank">Логистическая регрессия на Habr</a> — теория, реализация и примеры на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html" target="_blank">sklearn: LogisticRegression</a> — документация по логистической регрессии в sklearn</li>
      </ul>
    `,
  },
});
