/* ==========================================================================
   Support Vector Regression (SVR)
   ========================================================================== */
App.registerTopic({
  id: 'svr',
  category: 'ml-reg',
  title: 'SVR (Support Vector Regression)',
  summary: 'Регрессия через ε-трубу: игнорируем маленькие ошибки, штрафуем большие.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты прокладываешь трубу вдоль облака точек — так, чтобы как можно больше точек оказалось <b>внутри трубы</b>. Если точка попала в трубу — отлично, ты не считаешь это ошибкой. Если выбилась за край — штрафуешь, но только за то, <b>насколько далеко</b> она вышла.</p>
        <p>Именно это делает SVR (Support Vector Regression): обучает «жирную трубу» шириной 2ε вдоль данных. Точки внутри трубы не вносят ошибку вообще — это <b>ε-нечувствительная зона</b>. Те, что снаружи, штрафуются пропорционально расстоянию до края трубы.</p>
        <p>Это принципиально отличается от обычной регрессии, которая штрафует каждое отклонение, даже крошечное. SVR говорит: «если ошибка мала — мне всё равно, я занят более важными вещами».</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 215" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <text x="260" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">SVR: ε-труба вдоль данных</text>
          <!-- Axes -->
          <line x1="50" y1="25" x2="50" y2="180" stroke="#64748b" stroke-width="1.5"/>
          <line x1="50" y1="180" x2="490" y2="180" stroke="#64748b" stroke-width="1.5"/>
          <text x="482" y="193" font-size="10" fill="#64748b">x</text>
          <text x="36" y="21" font-size="10" fill="#64748b">y</text>
          <!-- Epsilon tube -->
          <polygon points="60,155 480,55 480,85 60,185" fill="#6366f1" fill-opacity="0.10"/>
          <!-- Upper tube boundary -->
          <line x1="60" y1="155" x2="480" y2="55" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="7,4"/>
          <!-- Lower tube boundary -->
          <line x1="60" y1="185" x2="480" y2="85" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="7,4"/>
          <!-- Regression line (center) -->
          <line x1="60" y1="170" x2="480" y2="70" stroke="#6366f1" stroke-width="2.5"/>
          <text x="395" y="58" font-size="10" font-weight="600" fill="#6366f1">f(x)</text>
          <!-- ε label -->
          <line x1="490" y1="70" x2="490" y2="85" stroke="#6366f1" stroke-width="1.5" marker-end="url(#svr_arr)"/>
          <line x1="490" y1="70" x2="490" y2="55" stroke="#6366f1" stroke-width="1.5" marker-end="url(#svr_arr)"/>
          <text x="495" y="72" font-size="10" fill="#6366f1">ε</text>
          <!-- Points inside tube (green) — no penalty -->
          <circle cx="120" cy="155" r="7" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
          <circle cx="200" cy="138" r="7" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
          <circle cx="280" cy="120" r="7" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
          <circle cx="350" cy="103" r="7" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
          <!-- Point above tube (red) — penalized, ξ shown -->
          <circle cx="160" cy="115" r="7" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
          <line x1="160" y1="115" x2="160" y2="143" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <text x="163" y="128" font-size="9" fill="#ef4444">ξ*</text>
          <!-- Point below tube (red) — penalized, ξ shown -->
          <circle cx="410" cy="108" r="7" fill="#ef4444" stroke="#fff" stroke-width="1.5"/>
          <line x1="410" y1="97" x2="410" y2="108" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <text x="413" y="105" font-size="9" fill="#ef4444">ξ</text>
          <!-- Legend -->
          <circle cx="60" cy="204" r="5" fill="#10b981"/>
          <text x="70" y="208" font-size="9" fill="#334155">внутри трубы (нет штрафа)</text>
          <circle cx="220" cy="204" r="5" fill="#ef4444"/>
          <text x="230" y="208" font-size="9" fill="#334155">снаружи (штраф ξ)</text>
          <line x1="340" y1="204" x2="360" y2="204" stroke="#6366f1" stroke-width="2.5"/>
          <text x="365" y="208" font-size="9" fill="#334155">f(x) — SVR</text>
          <defs>
            <marker id="svr_arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#6366f1"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">SVR строит ε-трубу вокруг регрессионной прямой. Зелёные точки внутри трубы — ошибка равна нулю. Красные точки снаружи — штрафуются на ξ (расстояние до края трубы).</div>
      </div>

      <h3>🎯 ε-нечувствительная <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">функция потерь</a></h3>
      <p>В обычной регрессии любое отклонение от прямой — это ошибка. SVR использует принципиально другую функцию потерь:</p>
      <div class="math-block">$$L_\\varepsilon(y, f(x)) = \\max(0,\\; |y - f(x)| - \\varepsilon)$$</div>
      <p>Это <span class="term" data-tip="ε-insensitive loss. Функция потерь, равная нулю если |y − f(x)| ≤ ε, и |y − f(x)| − ε иначе. Похожа на «мёртвую зону» вокруг предсказания.">ε-нечувствительные потери</span>: если отклонение ≤ ε — штраф равен нулю. Если больше — штраф линейный, как в <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MAE</a>, но только сверх порога ε.</p>
      <p>Это даёт два преимущества: <b>устойчивость к шуму</b> (маленькие погрешности измерений не влияют) и <b>разреженность</b> (только точки снаружи трубы определяют модель).</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея SVR</div>
        <p>SVR ищет функцию $f(x)$, которая отклоняется от истинных $y_i$ не более чем на $\\varepsilon$ — и при этом <b>максимально «плоская»</b> (минимальный $\\|w\\|^2$). Точки, попавшие точно на границу трубы или снаружи, называются <span class="term" data-tip="Support vectors в SVR. Точки, лежащие на границе ε-трубы или за её пределами. Только они определяют параметры модели.">опорными векторами</span> — только они влияют на итоговую модель.</p>
      </div>

      <h3>⚙️ Задача оптимизации SVR</h3>
      <p>Задача записывается с переменными $\\xi_i \\geq 0$ (нарушения снизу) и $\\xi_i^* \\geq 0$ (нарушения сверху):</p>
      <div class="math-block">$$\\min_{w,b,\\xi,\\xi^*} \\frac{1}{2}\\|w\\|^2 + C\\sum_{i=1}^n (\\xi_i + \\xi_i^*)$$</div>
      <p>при условиях:</p>
      <div class="math-block">$$y_i - w^T x_i - b \\leq \\varepsilon + \\xi_i^*, \\quad w^T x_i + b - y_i \\leq \\varepsilon + \\xi_i$$</div>
      <p>Первое слагаемое $\\frac{1}{2}\\|w\\|^2$ — регуляризация (гладкость модели). Второе — суммарный штраф за точки снаружи трубы.</p>

      <h3>🔧 Параметры SVR</h3>
      <p>SVR управляется двумя ключевыми параметрами, которые действуют в разных «измерениях»:</p>

      <h4>Параметр C — баланс регуляризации и ошибок</h4>
      <ul>
        <li><b>Большой C (≥ 10):</b> модель старается вместить в трубу как можно больше точек. Труба «гнётся» и становится сложной. Риск <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a>.</li>
        <li><b>Маленький C (≤ 0.1):</b> модель предпочитает простоту, допускает выбросы снаружи трубы. Более гладкая кривая. Риск <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">недообучения</a>.</li>
      </ul>

      <h4>Параметр ε — ширина трубы</h4>
      <ul>
        <li><b>Большой ε:</b> широкая труба, много точек внутри, меньше опорных векторов, более простая модель.</li>
        <li><b>Маленький ε:</b> узкая труба, меньше точек внутри, больше опорных векторов, модель точнее следует данным.</li>
      </ul>
      <p>Правило: ε примерно равен уровню ожидаемого шума в данных.</p>

      <h3>🌀 <a class="glossary-link" onclick="App.selectTopic('glossary-kernel-trick')">Ядерный трюк</a> в SVR</h3>
      <p>Как и в SVM, SVR может работать с нелинейными зависимостями через <span class="term" data-tip="Kernel trick в SVR. Замена скалярных произведений на функции ядра K(x, x'), что позволяет строить нелинейные регрессии без явного вычисления признаков.">ядерный трюк</span>. Линейная SVR строит плоскость, RBF-SVR — изогнутую поверхность.</p>

      <h4>Популярные ядра</h4>
      <div class="math-block">$$\\text{Linear:}\\; K(x,x') = x^T x'$$</div>
      <div class="math-block">$$\\text{RBF:}\\; K(x,x') = \\exp(-\\gamma\\|x-x'\\|^2)$$</div>
      <div class="math-block">$$\\text{Poly:}\\; K(x,x') = (\\gamma x^T x' + r)^d$$</div>
      <p>На практике RBF-ядро работает лучше всего в большинстве задач. Перед SVR с любым ядром <b>обязательно стандартизировать</b> признаки.</p>

      <h3>⚠️ Обязательная стандартизация</h3>
      <p>SVR использует расстояния между точками, и если признаки имеют разные масштабы (один в граммах, другой в километрах) — модель будет полностью игнорировать первый. <b>Всегда</b> делайте <code>StandardScaler()</code> или <code>MinMaxScaler()</code> перед SVR.</p>

      <div class="deep-dive">
        <summary>Подробнее: двойственная задача и опорные векторы</summary>
        <div class="deep-dive-body">
          <p>Как и SVM, SVR решается через двойственную задачу (dual problem). Вводятся множители Лагранжа $\\alpha_i, \\alpha_i^* \\geq 0$:</p>
          <div class="math-block">$$f(x) = \\sum_{i=1}^n (\\alpha_i^* - \\alpha_i) K(x_i, x) + b$$</div>
          <p>Большинство точек будут иметь $\\alpha_i = \\alpha_i^* = 0$ (внутри трубы). Только точки на границе или снаружи имеют $\\alpha_i > 0$ или $\\alpha_i^* > 0$ — это и есть опорные векторы.</p>
          <p>Ключевой вывод: если у вас 1000 точек, но только 50 снаружи трубы — модель определяется лишь этими 50 точками. Это делает SVR памятно-эффективным при правильно подобранном ε.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: сравнение с Ridge регрессией и Lasso</summary>
        <div class="deep-dive-body">
          <p>SVR, Ridge и Lasso — три разных способа регуляризации регрессии:</p>
          <ul>
            <li><b>Ridge (L2):</b> $\\min \\sum(y_i - f_i)^2 + \\lambda\\|w\\|^2$. Штрафует квадрат каждой ошибки. Веса малы, но не ноль.</li>
            <li><b>Lasso (L1):</b> $\\min \\sum|y_i - f_i| + \\lambda\\|w\\|_1$. Штрафует сумму абсолютных ошибок. Веса могут быть точно ноль (отбор признаков).</li>
            <li><b>SVR:</b> $\\min \\frac{1}{2}\\|w\\|^2 + C\\sum L_\\varepsilon(y_i, f_i)$. Не штрафует ошибки внутри трубы вообще. Разреженность в пространстве обучающих примеров.</li>
          </ul>
          <p>SVR — единственный из трёх, кто явно моделирует «зону безразличия» к ошибкам. Это полезно когда шум в данных имеет известный порядок (например, погрешность датчика ±0.5).</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>SVM (классификация)</b> — SVR это прямое расширение SVM на задачи регрессии. Те же принципы: margin, опорные векторы, ядро.</li>
        <li><b>Ridge регрессия</b> — тоже регуляризует $\\|w\\|^2$, но штрафует все ошибки.</li>
        <li><b>Линейная регрессия</b> — частный случай SVR при $\\varepsilon = 0$ и без регуляризации (теоретически).</li>
        <li><b>Random Forest регрессия</b> — не требует масштабирования, лучше на больших данных, менее интерпретируем.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting регрессия</b> — сильнее на табличных данных, но медленнее обучается.</li>
      </ul>
    `,

    examples: [
      {
        title: 'SVR вручную: 5 точек, линейное ядро',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По 5 точкам понять, какие попали в ε-трубу, какие стали опорными векторами, и вычислить штрафы ξ.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x</th><th>y (факт)</th><th>f(x) = 2x + 1</th><th>|y − f(x)|</th><th>В трубе (ε=1)?</th></tr>
              <tr><td>A</td><td>1</td><td>3.5</td><td>3.0</td><td>0.5</td><td>Да ✓</td></tr>
              <tr><td>B</td><td>2</td><td>5.8</td><td>5.0</td><td>0.8</td><td>Да ✓</td></tr>
              <tr><td>C</td><td>3</td><td>9.2</td><td>7.0</td><td>2.2</td><td>Нет ✗</td></tr>
              <tr><td>D</td><td>4</td><td>8.5</td><td>9.0</td><td>0.5</td><td>Да ✓</td></tr>
              <tr><td>E</td><td>5</td><td>9.8</td><td>11.0</td><td>1.2</td><td>Нет ✗</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить отклонения</h4>
            <div class="calc">
              Модель: f(x) = 2x + 1, ε = 1<br><br>
              A: f(1) = 3.0 → |3.5 − 3.0| = 0.5 ≤ 1 → внутри трубы<br>
              B: f(2) = 5.0 → |5.8 − 5.0| = 0.8 ≤ 1 → внутри трубы<br>
              C: f(3) = 7.0 → |9.2 − 7.0| = 2.2 > 1 → снаружи (выше)<br>
              D: f(4) = 9.0 → |8.5 − 9.0| = 0.5 ≤ 1 → внутри трубы<br>
              E: f(5) = 11.0 → |9.8 − 11.0| = 1.2 > 1 → снаружи (ниже)
            </div>
            <div class="why">ε-труба: [f(x) − 1, f(x) + 1]. Точки A, B, D попали внутрь — они не влияют на модель.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить штрафы ξ</h4>
            <div class="calc">
              ξᵢ = max(0, |yᵢ − f(xᵢ)| − ε)<br><br>
              A: ξ = max(0, 0.5 − 1) = max(0, −0.5) = <b>0</b><br>
              B: ξ = max(0, 0.8 − 1) = max(0, −0.2) = <b>0</b><br>
              C: ξ* = max(0, 2.2 − 1) = max(0, 1.2) = <b>1.2</b><br>
              D: ξ = max(0, 0.5 − 1) = max(0, −0.5) = <b>0</b><br>
              E: ξ = max(0, 1.2 − 1) = max(0, 0.2) = <b>0.2</b>
            </div>
            <div class="why">Итого штраф = C·(ξ_C + ξ_E) = C·1.4. Для C=1 штраф = 1.4. Сравни с <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a>: (0.25+0.64+4.84+0.25+1.44)/5 = 1.48 — SVR игнорирует маленькие ошибки!</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: определить опорные векторы</h4>
            <div class="calc">
              Опорные векторы в SVR — точки, лежащие:<br>
              • На верхней границе трубы: yᵢ − f(xᵢ) = +ε<br>
              • На нижней границе трубы: f(xᵢ) − yᵢ = +ε<br>
              • Снаружи трубы: ξᵢ > 0<br><br>
              В нашем примере C и E — опорные векторы (снаружи трубы)<br>
              A, B, D — НЕ опорные векторы (внутри трубы, ξ = 0)
            </div>
            <div class="why">Если бы C и E убрали из датасета — параметры w и b модели изменились бы. Если убрать A, B или D — ничего не изменится. Только опорные векторы «держат» трубу.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>В трубе (без штрафа): A, B, D. Опорные векторы: C (ξ*=1.2) и E (ξ=0.2). Суммарный штраф при C=1: 1.4. Обычная MSE на тех же данных: 1.48 — SVR не трогает «нормальный» шум.</p>
          </div>
          <div class="lesson-box">
            ε задаёт ожидаемый уровень шума. Если датчик даёт погрешность ±0.5 — установи ε = 0.5. Тогда SVR «не удивляется» обычному шуму и фокусируется на настоящих отклонениях.
          </div>
        `,
      },
      {
        title: 'Влияние ε: узкая vs широкая труба',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить SVR с ε=0.1 и ε=2.0 на одних данных. Понять, как ε влияет на сложность модели и число опорных векторов.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Параметр</th><th>ε = 0.1 (узкая труба)</th><th>ε = 2.0 (широкая труба)</th></tr>
              <tr><td>Точек внутри трубы</td><td>~20%</td><td>~85%</td></tr>
              <tr><td>Опорных векторов</td><td>много (80%)</td><td>мало (15%)</td></tr>
              <tr><td>Сложность модели</td><td>высокая</td><td>низкая</td></tr>
              <tr><td>Train RMSE</td><td>0.08</td><td>0.95</td></tr>
              <tr><td>Test RMSE</td><td>0.18</td><td>0.92</td></tr>
              <tr><td>Риск</td><td>Переобучение</td><td>Недообучение</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что происходит при малом ε</h4>
            <div class="calc">
              ε = 0.1: труба почти не оставляет места для ошибок<br>
              Большинство точек выходит за края трубы<br>
              Каждая точка-нарушитель — опорный вектор<br>
              Модель «помнит» почти каждую точку<br>
              f(x) пытается пройти вплотную к данным → переобучение
            </div>
            <div class="why">Малый ε ≈ обычная регрессия с малым шумом. Если данные шумные — это плохо.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: что происходит при большом ε</h4>
            <div class="calc">
              ε = 2.0: труба поглощает большинство точек<br>
              Почти все точки внутри → штраф = 0 → мало опорных векторов<br>
              Функция потерь почти не работает<br>
              Модель стремится к максимально плоской f(x)<br>
              → При RBF ядре: f(x) ≈ константа
            </div>
            <div class="why">Большой ε = «мне всё равно, главное — гладко». Если реальная зависимость не плоская — недообучение.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: оптимальный ε</h4>
            <div class="calc">
              Правило большого пальца: ε ≈ σ (std ошибок измерения)<br>
              Если измерения с точностью ±0.5 → ε = 0.5<br><br>
              Или через CV: пробуем ε ∈ [0.01, 0.05, 0.1, 0.5, 1.0, 2.0]<br>
              + одновременно C ∈ [0.1, 1, 10, 100]<br>
              Выбираем по минимальному val RMSE
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>ε=0.1: много опорных векторов, точная модель, переобучение. ε=2.0: мало опорных векторов, грубая модель, недообучение. Оптимально: ε ≈ σ шума, подобрать через CV вместе с C.</p>
          </div>
          <div class="lesson-box">
            В sklearn SVR: параметр epsilon (по умолчанию 0.1). Слишком мал — модель запомнила шум. Слишком велик — модель ничему не научилась. Всегда тюнить вместе с C через GridSearchCV.
          </div>
        `,
      },
      {
        title: 'SVR vs Linear Regression: предсказание цен',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить SVR (RBF) и линейную регрессию на данных о ценах квартир с нелинейной зависимостью и несколькими выбросами.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Площадь (м²)</th><th>40</th><th>55</th><th>60</th><th>70</th><th>80</th><th>90</th><th>95*</th><th>110</th></tr>
              <tr><th>Цена (млн)</th><td>4.0</td><td>5.5</td><td>6.2</td><td>7.8</td><td>9.5</td><td>11.2</td><td>2.0</td><td>14.0</td></tr>
              <tr><th>Выброс?</th><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>Да!</td><td>—</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: Linear Regression страдает от выброса</h4>
            <div class="calc">
              Без выброса (7 точек): ŷ = 0.12·x − 0.6, RMSE = 0.31<br>
              С выбросом (95м², 2.0млн):<br>
              ŷ = 0.09·x + 0.3, RMSE = 1.23<br><br>
              Выброс «потянул» прямую вниз:<br>
              ŷ(90) = 8.4 (факт 11.2, ошибка −2.8млн!)<br>
              Линейная регрессия чувствительна к выбросам — каждый штрафуется квадратично.
            </div>
            <div class="why">Квадратичный штраф: выброс (9.2)² = 84.6. Обычная точка (0.3)² = 0.09. Выброс «весит» в 940 раз больше!</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: SVR с RBF ядром</h4>
            <div class="calc">
              SVR(kernel='rbf', C=10, epsilon=0.5):<br>
              После стандартизации признаков...<br><br>
              Выброс (95, 2.0): |2.0 − f(95)| ≈ 8.2 >> ε<br>
              SVR назначает штраф: ξ = 8.2 − 0.5 = 7.7<br>
              Но при C=10, этот единственный выброс ≠ все остальные точки<br>
              Остальные 7 точек внутри трубы (без штрафа)<br><br>
              Результат: SVR RMSE = 0.48 (с выбросом)<br>
              vs Линейная RMSE = 1.23 — SVR в 2.5× точнее!
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: нелинейная зависимость — RBF побеждает</h4>
            <div class="calc">
              Настоящие данные часто нелинейны:<br>
              Небольшие квартиры: каждый м² добавляет ~0.1 млн<br>
              Большие (>80м²): каждый м² добавляет ~0.18 млн (премиум)<br><br>
              Линейная регрессия: одна прямая для всего → систематическая ошибка<br>
              SVR с RBF: труба изгибается → ловит нелинейность<br><br>
              SVR RMSE = 0.31, Linear RMSE = 0.51 (без выброса, нелинейные данные)
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>SVR превосходит линейную регрессию при: (1) наличии выбросов — ε-труба их «поглощает», (2) нелинейных зависимостях — RBF ядро их ловит. Цена: нужна стандартизация и подбор C, ε, γ.</p>
          </div>
          <div class="lesson-box">
            SVR — хороший выбор для небольших датасетов (до ~10 000 точек) с шумными измерениями. На больших данных Random Forest и Gradient Boosting быстрее и часто точнее.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: SVR с ε-трубой</h3>
        <p>Меняй ε и C. Наблюдай, какие точки попадают внутрь трубы, а какие — снаружи.</p>
        <div class="sim-container">
          <div class="sim-controls" id="svr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="svr-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="svr-chart"></canvas></div>
            <div class="sim-stats" id="svr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#svr-controls');
        const cEps = App.makeControl('range', 'svr-eps', 'ε (ширина трубы)', { min: 0.1, max: 3, step: 0.1, value: 0.5 });
        const cC = App.makeControl('range', 'svr-c', 'C (регуляризация, log)', { min: -1, max: 2, step: 0.1, value: 0.5 });
        [cEps, cC].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let dataX = [], dataY = [];
        const N = 80;

        function generate() {
          dataX = []; dataY = [];
          for (let i = 0; i < N; i++) {
            const x = Math.random() * 2 * Math.PI;
            dataX.push(x);
            dataY.push(Math.sin(x) + App.Util.randn(0, 0.6));
          }
          update();
        }

        function update() {
          const eps = +cEps.input.value;
          const logC = +cC.input.value;
          const C = Math.pow(10, logC);

          // Simple linear regression as base line
          const mx = App.Util.mean(dataX), my = App.Util.mean(dataY);
          let num = 0, den = 0;
          for (let i = 0; i < dataX.length; i++) {
            num += (dataX[i] - mx) * (dataY[i] - my);
            den += (dataX[i] - mx) ** 2;
          }
          const w = num / (den || 1);
          const b = my - w * mx;

          const gridX = App.Util.linspace(0, 2 * Math.PI, 200);
          const lineY = gridX.map(x => w * x + b);
          const upperY = gridX.map(x => w * x + b + eps);
          const lowerY = gridX.map(x => w * x + b - eps);

          let outside = 0;
          for (let i = 0; i < dataX.length; i++) {
            const pred = w * dataX[i] + b;
            if (Math.abs(dataY[i] - pred) > eps) outside++;
          }

          const insideData = [], outsideData = [];
          for (let i = 0; i < dataX.length; i++) {
            const pred = w * dataX[i] + b;
            const pt = { x: dataX[i], y: dataY[i] };
            if (Math.abs(dataY[i] - pred) > eps) outsideData.push(pt);
            else insideData.push(pt);
          }

          const lineData = gridX.map((x, i) => ({ x, y: lineY[i] }));
          const upperData = gridX.map((x, i) => ({ x, y: upperY[i] }));
          const lowerData = gridX.map((x, i) => ({ x, y: lowerY[i] }));

          const ctx = container.querySelector('#svr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Внутри трубы', data: insideData, backgroundColor: 'rgba(59,130,246,0.5)', pointRadius: 5 },
                { label: 'Вне трубы', data: outsideData, backgroundColor: 'rgba(239,68,68,0.7)', pointRadius: 6 },
                { label: 'Регрессия', data: lineData, type: 'line', borderColor: 'rgba(16,185,129,0.9)', borderWidth: 2, pointRadius: 0, fill: false, showLine: true },
                { label: '+ε', data: upperData, type: 'line', borderColor: 'rgba(16,185,129,0.5)', borderWidth: 1.5, borderDash: [6, 4], pointRadius: 0, fill: false, showLine: true },
                { label: '-ε', data: lowerData, type: 'line', borderColor: 'rgba(16,185,129,0.5)', borderWidth: 1.5, borderDash: [6, 4], pointRadius: 0, fill: false, showLine: true },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'SVR: ε-труба' } },
              scales: { x: { type: 'linear', min: 0, max: 6.5 }, y: { suggestedMin: -3, suggestedMax: 3 } },
            },
          });
          App.registerChart(chart);

          container.querySelector('#svr-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">ε</div><div class="stat-value">${eps.toFixed(1)}</div></div>
            <div class="stat-card"><div class="stat-label">C</div><div class="stat-value">${C.toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Вне трубы</div><div class="stat-value">${outside} / ${dataX.length}</div></div>
          `;
        }

        [cEps, cC].forEach(c => c.input.addEventListener('input', update));
        container.querySelector('#svr-regen').onclick = generate;
        generate();
      },
    },

    python: `
      <h3>Python: SVR через sklearn</h3>
      <p>sklearn.SVR — основной класс. Поддерживает ядра 'rbf', 'linear', 'poly', '<a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">sigmoid</a>'. <b>Перед SVR всегда StandardScaler!</b></p>

      <h4>1. Базовый SVR с RBF ядром</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Нелинейные данные с шумом
np.random.seed(42)
X = np.sort(np.random.uniform(0, 6, 80))[:, np.newaxis]
y = np.sin(X.ravel()) + 0.5 * X.ravel() + np.random.normal(0, 0.2, 80)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# ВАЖНО: стандартизация обязательна!
scaler_X = StandardScaler()
scaler_y = StandardScaler()
X_train_s = scaler_X.fit_transform(X_train)
X_test_s  = scaler_X.transform(X_test)
y_train_s = scaler_y.fit_transform(y_train.reshape(-1, 1)).ravel()
y_test_s  = scaler_y.transform(y_test.reshape(-1, 1)).ravel()

# SVR с RBF ядром
svr = SVR(kernel='rbf', C=10, epsilon=0.1, gamma='scale')
svr.fit(X_train_s, y_train_s)

y_pred_s = svr.predict(X_test_s)
y_pred = scaler_y.inverse_transform(y_pred_s.reshape(-1, 1)).ravel()

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2   = r2_score(y_test, y_pred)
print(f'RMSE: {rmse:.4f}')
print(f'R²: {r2:.4f}')
print(f'Число опорных векторов: {svr.n_support_[0]}')

# Визуализация с трубой
X_plot = np.linspace(0, 6, 300)[:, np.newaxis]
X_plot_s = scaler_X.transform(X_plot)
y_pred_plot = scaler_y.inverse_transform(svr.predict(X_plot_s).reshape(-1, 1)).ravel()
epsilon_orig = svr.epsilon * scaler_y.scale_[0]  # перевести ε обратно

plt.figure(figsize=(10, 5))
plt.scatter(X_train, y_train, c='steelblue', s=20, alpha=0.6, label='train')
plt.scatter(X_test, y_test, c='orange', s=30, alpha=0.8, label='test')
plt.plot(X_plot, y_pred_plot, 'r-', linewidth=2, label='SVR f(x)')
plt.fill_between(X_plot.ravel(),
                 y_pred_plot - epsilon_orig,
                 y_pred_plot + epsilon_orig,
                 alpha=0.2, color='red', label=f'ε-труба (ε≈{epsilon_orig:.2f})')
plt.title(f'SVR (RBF): RMSE={rmse:.3f}, R²={r2:.3f}')
plt.legend()
plt.tight_layout()
plt.show()</code></pre>

      <h4>2. GridSearchCV: подбор C, epsilon, gamma</h4>
      <pre><code>from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import Pipeline

# Pipeline: масштабирование + SVR (лучшая практика)
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('svr', SVR(kernel='rbf')),
])

param_grid = {
    'svr__C':       [0.1, 1, 10, 100],
    'svr__epsilon': [0.01, 0.05, 0.1, 0.5, 1.0],
    'svr__gamma':   ['scale', 'auto', 0.01, 0.1],
}

grid = GridSearchCV(pipe, param_grid, cv=5,
                    scoring='neg_root_mean_squared_error',
                    n_jobs=-1, verbose=0)
grid.fit(X_train, y_train)

print(f'Лучшие параметры: {grid.best_params_}')
print(f'CV RMSE: {-grid.best_score_:.4f}')
print(f'Test RMSE: {np.sqrt(mean_squared_error(y_test, grid.predict(X_test))):.4f}')</code></pre>

      <h4>3. Сравнение ядер</h4>
      <pre><code>from sklearn.datasets import fetch_california_housing
from sklearn.linear_model import Ridge

# Реальный датасет: цены на жильё
data = fetch_california_housing()
X_all, y_all = data.data[:2000], data.target[:2000]  # первые 2000 для скорости
X_tr, X_te, y_tr, y_te = train_test_split(X_all, y_all, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_tr_s = scaler.fit_transform(X_tr)
X_te_s = scaler.transform(X_te)

models = {
    'SVR (RBF)':    SVR(kernel='rbf',    C=10, epsilon=0.1, gamma='scale'),
    'SVR (Linear)': SVR(kernel='linear', C=10, epsilon=0.1),
    'Ridge':        Ridge(alpha=1.0),
}

for name, model in models.items():
    model.fit(X_tr_s, y_tr)
    pred = model.predict(X_te_s)
    rmse = np.sqrt(mean_squared_error(y_te, pred))
    r2   = r2_score(y_te, pred)
    nsv  = model.n_support_[0] if hasattr(model, 'n_support_') else '—'
    print(f'{name:20}: RMSE={rmse:.4f}, R²={r2:.4f}, SV={nsv}')</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Финансовые прогнозы на малых выборках.</b> Прогноз волатильности, спредов, цен деривативов — задачи, где шум огромный, данных мало, а зависимость нелинейна. $\\varepsilon$-труба явно моделирует «уровень шума, который не надо объяснять», чего нет ни у линейной регрессии, ни у бустинга.</li>
        <li><b>QSAR-модели в химии и материаловедении.</b> Предсказание свойств молекул (токсичность, растворимость, biological activity) по дескрипторам. Типичная выборка — сотни молекул с тысячами фич. SVR с RBF или custom kernel устойчив именно в таком «$p \\gg n$» режиме, где RF и нейросети переобучаются.</li>
        <li><b>Биоинформатика.</b> Предсказание affinity связывания белок–лиганд, экспрессии генов, drug response. Здесь важны и высокая размерность, и устойчивость к шумным измерениям — $\\varepsilon$-труба поглощает экспериментальную погрешность.</li>
        <li><b>Геофизика и интерполяция измерений.</b> Интерполяция поля проницаемости между скважинами, восстановление сейсмических атрибутов по редким точкам. SVR с геопространственными ядрами даёт гладкий прогноз с контролируемой жёсткостью.</li>
        <li><b>Soft sensors в промышленности.</b> Предсказание сложно измеримых параметров (концентрация, качество, вязкость) по показаниям простых датчиков. В process control часто есть всего несколько сотен исторических измерений — SVR обучается стабильно там, где нейросети требуют тысяч.</li>
        <li><b>Прогноз энергопотребления и нагрузки.</b> Для зданий или небольших объектов с ограниченной историей, где RNN/LSTM избыточны, SVR с RBF даёт устойчивый краткосрочный прогноз.</li>
        <li><b>Калибровка научных приборов.</b> Построение калибровочной кривой по ограниченному набору эталонных точек с известной систематической погрешностью — $\\varepsilon$-трубa формализует «не переобучайся на шум измерений».</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>$\\varepsilon$-нечувствительная функция потерь — встроенная устойчивость к шуму.</b> Точки внутри трубы $|y - \\hat{y}| &lt; \\varepsilon$ вообще не штрафуются. Модель не тратит capacity на объяснение шума, концентрируясь только на систематической структуре. Это единственный популярный регрессор, где «допустимый уровень ошибки» задаётся явно как параметр.</p>
      <p><b>Ядерный трюк даёт произвольно сложные границы.</b> RBF, polynomial, sigmoid, custom — всё, что применимо к SVM, применимо и к SVR. Нелинейные зависимости моделируются без ручного feature engineering и без явного расширения пространства признаков.</p>
      <p><b>Работает на «широких и коротких» данных.</b> Когда $p \\gg n$ (геномы, QSAR, fMRI), линейные модели шатаются, деревья переобучаются, нейросети требуют регуляризации и много данных. SVR с правильным $C$ и ядром — один из немногих вариантов, который стабилен в этом режиме.</p>
      <p><b>Экономичен по памяти в инференсе.</b> Хранятся только опорные векторы — обычно малая доля обучающей выборки. Прогноз на новой точке — сумма ядер $K(x, x_i)$ по этим $x_i$. По сравнению с kNN, хранящим весь датасет, — серьёзная экономия.</p>
      <p><b>Устойчив к выбросам в $y$.</b> В отличие от OLS, где один экстремум тянет всю прямую, SVR с linear или Huber-подобной функцией потерь ограничивает влияние каждой точки параметром $C$. Плюс $\\varepsilon$-труба даёт естественную зону безразличия.</p>
      <p><b>Сильная теоретическая база.</b> Как и SVM, SVR опирается на теорию Вапника — бounds на generalization error зависят от margin, а не от размерности. Для регулируемых задач (валидация модели в медицине, финансах) это аргумент перед аудитом.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Кубическая сложность обучения.</b> $O(n^2)$–$O(n^3)$ по времени, $O(n^2)$ по памяти на матрицу Грама. На $10^4$ точках — минуты, на $10^5$ — часы, на $10^6$ — нереально. Бустинг и линейные модели масштабируются в сотни раз лучше.</p>
      <p><b>Три гиперпараметра вместо одного.</b> $C$ (баланс margin vs ошибка), $\\varepsilon$ (ширина трубы), $\\gamma$ (масштаб ядра для RBF). Полный GridSearch — 3D-решётка с CV, каждая точка — полное обучение. Тюнинг стоит на порядок дороже, чем у RF или линейной регрессии.</p>
      <p><b>Обязательная стандартизация признаков И целевой переменной.</b> RBF-ядро чувствительно к масштабу $x$; $\\varepsilon$-труба определена в единицах $y$. Забыл масштабировать — получил либо нулевую модель, либо переобучение. В sklearn это не делается автоматически.</p>
      <p><b>Нет вероятностной интерпретации.</b> SVR выдаёт точку, а не распределение. Никаких доверительных интервалов, prediction intervals или квантилей «из коробки». Для задач, где нужна оценка неопределённости (scientific modeling, risk management), нужны обёртки типа conformal prediction или quantile regression отдельно.</p>
      <p><b>Чёрный ящик при RBF-ядре.</b> Линейный SVR ещё интерпретируем через веса, но RBF — произвольная нелинейная поверхность. Нет ни feature importance, ни коэффициентов. Для регулируемой отчётности (медицина, финансы) — минус.</p>
      <p><b>Чувствителен к выбору $\\varepsilon$.</b> Слишком маленький $\\varepsilon$ — модель переобучается на шум. Слишком большой — почти все точки попадают в трубу, и модель становится плоской. Без понимания уровня шума в данных подобрать $\\varepsilon$ сложно.</p>

      <h3>🧭 Когда брать SVR — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери SVR когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Данных мало ($n &lt; 10^4$) и зависимость нелинейна — RBF SVR часто точнее RF</td>
          <td>Данных много ($n &gt; 10^5$) — обучение упрётся в $O(n^2)$ память</td>
        </tr>
        <tr>
          <td>$p \\gg n$: широкие данные (геномы, QSAR, спектры), где линейные модели шатаются</td>
          <td>Нужны prediction intervals или квантильные прогнозы «из коробки»</td>
        </tr>
        <tr>
          <td>Уровень шума в $y$ известен и можно задать осмысленный $\\varepsilon$</td>
          <td>Нужна интерпретация через коэффициенты или feature importance (особенно для RBF)</td>
        </tr>
        <tr>
          <td>Есть domain kernel (string/graph/spectral), в который можно вложить знание</td>
          <td>Данные — смесь числовых и high-cardinality категориальных; деревья обработают лучше</td>
        </tr>
        <tr>
          <td>Устойчивость к выбросам критична, а Huber/quantile regression не подходят</td>
          <td>Нужна экстраполяция далеко за пределы train — SVR с RBF вне support возвращается к нулю</td>
        </tr>
        <tr>
          <td>Допустимо потратить время на дорогой GridSearch по $C, \\varepsilon, \\gamma$</td>
          <td>Нужен быстрый инференс на миллионах запросов — бустинг/линейные модели в разы быстрее</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> (и её робастные варианты)</b> — если зависимость близка к линейной. Быстрее, интерпретируемее, масштабируется на миллионы строк. Для устойчивости к выбросам — Huber или RANSAC.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('random-forest-regression')">Random Forest Regression</a></b> — если данных больше $10^4$ и нелинейность существенна. Устойчив к выбросам, не требует масштабирования, работает с категориями, даёт feature importance. Дефолт для табличной регрессии среднего размера.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a> (XGBoost/LightGBM/CatBoost)</b> — если нужна максимальная точность на табличных данных и есть $&gt; 10^4$ строк. Почти всегда побеждает SVR по RMSE и обучается быстрее на больших выборках.</li>
        <li><b>Gaussian Process Regression</b> — если нужны именно prediction intervals и оценка неопределённости. Похож на SVR идеей ядер, но даёт полное предиктивное распределение. Цена — ещё большие вычислительные затраты ($O(n^3)$).</li>
        <li><b>Quantile regression (в том числе на базе GBM)</b> — если нужны квантили $y$, а не только среднее. Для risk management, supply chain, медицины.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('neural-network')">Нейросеть</a></b> — если данных много ($n &gt; 10^5$) и признаки сложные. SVR в таких условиях не скейлится, нейросеть — да.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=efR1C6CvhmE" target="_blank">StatQuest: Support Vector Machines</a> — основы SVM, применимые к SVR</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=SVR%20%D1%80%D0%B5%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D1%8F%20%D0%BE%D0%BF%D0%BE%D1%80%D0%BD%D1%8B%D0%B5%20%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%B0" target="_blank">SVM/SVR на Habr</a> — разбор метода опорных векторов для регрессии на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html" target="_blank">sklearn: SVR</a> — документация Support Vector Regressor в sklearn</li>
      </ul>
    `,
  },
});
