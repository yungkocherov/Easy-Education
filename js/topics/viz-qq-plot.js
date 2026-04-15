/* ==========================================================================
   Глоссарий: Q-Q Plot
   ========================================================================== */
App.registerTopic({
  id: 'viz-qq-plot',
  category: 'glossary',
  title: 'Q-Q Plot',
  summary: 'Quantile-Quantile plot: сравнивает квантили выборки с теоретическим распределением.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты измерил рост 100 человек и хочешь понять: распределены ли они нормально? Можно построить гистограмму и «на глаз» сравнить с колоколом, но глаз обманчив. Q-Q plot — это <b>строгий визуальный тест</b>: если точки лежат на прямой линии, значит выборка соответствует теоретическому распределению.</p>
        <p>По сути, Q-Q plot сравнивает <b>квантили</b> (например, 10%, 25%, 50%, 75%, 90%) твоих данных с квантилями эталонного распределения (обычно нормального). Если совпадают — точки на диагонали. Если нет — точки отклоняются, и по характеру отклонения можно понять, в чём отличие.</p>
      </div>

      <h3>🎯 Что такое Q-Q plot</h3>
      <p><b>Q-Q plot</b> (Quantile-Quantile plot) — график, где по оси X откладываются теоретические квантили эталонного распределения, а по оси Y — фактические квантили твоих данных.</p>
      <p>Если распределения совпадают, точки ложатся на прямую $y = x$ (или близко к ней).</p>

      <h4>Как он строится — по шагам</h4>
      <ol>
        <li>Отсортируй свою выборку: $x_{(1)} \\leq x_{(2)} \\leq \\ldots \\leq x_{(n)}$.</li>
        <li>Для каждой точки i вычисли её «позицию»: $p_i = (i - 0.5) / n$ (это эмпирический квантиль).</li>
        <li>Найди теоретический квантиль для этой же позиции из эталонного распределения: $q_i = F^{-1}(p_i)$, где $F^{-1}$ — обратная функция распределения (например, для нормального — это функция Probit).</li>
        <li>Нанеси точку $(q_i, x_{(i)})$ на график.</li>
        <li>Проведи идеальную линию $y = x$.</li>
      </ol>

      <div class="illustration bordered">
        <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:600px;">
          <text x="300" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Q-Q plot: нормальная выборка (точки на диагонали)</text>
          <!-- Axes -->
          <line x1="60" y1="270" x2="560" y2="270" stroke="#475569" stroke-width="1.5"/>
          <line x1="60" y1="40" x2="60" y2="270" stroke="#475569" stroke-width="1.5"/>
          <!-- Grid -->
          <g stroke="#e5e7eb" stroke-width="0.5">
            <line x1="60" y1="100" x2="560" y2="100"/>
            <line x1="60" y1="155" x2="560" y2="155"/>
            <line x1="60" y1="213" x2="560" y2="213"/>
            <line x1="185" y1="40" x2="185" y2="270"/>
            <line x1="310" y1="40" x2="310" y2="270"/>
            <line x1="435" y1="40" x2="435" y2="270"/>
          </g>
          <!-- Ideal reference line (45°) -->
          <line x1="60" y1="270" x2="560" y2="40" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="6,4" opacity="0.7"/>
          <text x="530" y="50" font-size="10" fill="#dc2626">y = x</text>
          <!-- Points (close to line = normal data) -->
          <circle cx="80"  cy="255" r="3.5" fill="#0284c7"/>
          <circle cx="105" cy="243" r="3.5" fill="#0284c7"/>
          <circle cx="130" cy="230" r="3.5" fill="#0284c7"/>
          <circle cx="155" cy="215" r="3.5" fill="#0284c7"/>
          <circle cx="180" cy="203" r="3.5" fill="#0284c7"/>
          <circle cx="205" cy="190" r="3.5" fill="#0284c7"/>
          <circle cx="230" cy="177" r="3.5" fill="#0284c7"/>
          <circle cx="255" cy="165" r="3.5" fill="#0284c7"/>
          <circle cx="280" cy="152" r="3.5" fill="#0284c7"/>
          <circle cx="305" cy="140" r="3.5" fill="#0284c7"/>
          <circle cx="330" cy="127" r="3.5" fill="#0284c7"/>
          <circle cx="355" cy="115" r="3.5" fill="#0284c7"/>
          <circle cx="380" cy="102" r="3.5" fill="#0284c7"/>
          <circle cx="405" cy="88" r="3.5" fill="#0284c7"/>
          <circle cx="430" cy="77" r="3.5" fill="#0284c7"/>
          <circle cx="455" cy="65" r="3.5" fill="#0284c7"/>
          <circle cx="480" cy="53" r="3.5" fill="#0284c7"/>
          <circle cx="510" cy="45" r="3.5" fill="#0284c7"/>
          <!-- Axis labels -->
          <text x="300" y="290" text-anchor="middle" font-size="11" fill="#64748b">Теоретические квантили N(0,1)</text>
          <text x="25" y="155" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 25 155)">Квантили выборки</text>
          <g font-size="9" fill="#94a3b8" text-anchor="middle">
            <text x="60" y="284">−3</text>
            <text x="185" y="284">−1.5</text>
            <text x="310" y="284">0</text>
            <text x="435" y="284">1.5</text>
            <text x="560" y="284">3</text>
          </g>
        </svg>
        <div class="caption">Нормальная выборка: точки практически ложатся на диагональ y = x (красная линия). Небольшие отклонения на концах — нормально для конечных выборок.</div>
      </div>

      <h3>📖 Как читать Q-Q plot</h3>
      <p>Разные паттерны отклонений говорят о разных свойствах распределения:</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">4 типичных паттерна Q-Q plot</text>
          <!-- HEAVY TAILS -->
          <g>
            <rect x="30" y="45" width="300" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <text x="180" y="62" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">Тяжёлые хвосты (S-образно)</text>
            <line x1="50" y1="200" x2="310" y2="200" stroke="#94a3b8"/>
            <line x1="50" y1="75" x2="50" y2="200" stroke="#94a3b8"/>
            <line x1="50" y1="200" x2="310" y2="75" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.7"/>
            <!-- Heavy-tails S-curve: left end far below diagonal, crosses in middle, right end far above -->
            <circle cx="60"  cy="208" r="3" fill="#0284c7"/>
            <circle cx="80"  cy="200" r="3" fill="#0284c7"/>
            <circle cx="100" cy="188" r="3" fill="#0284c7"/>
            <circle cx="120" cy="175" r="3" fill="#0284c7"/>
            <circle cx="140" cy="162" r="3" fill="#0284c7"/>
            <circle cx="160" cy="150" r="3" fill="#0284c7"/>
            <circle cx="180" cy="137" r="3" fill="#0284c7"/>
            <circle cx="200" cy="123" r="3" fill="#0284c7"/>
            <circle cx="220" cy="108" r="3" fill="#0284c7"/>
            <circle cx="240" cy="92"  r="3" fill="#0284c7"/>
            <circle cx="260" cy="78"  r="3" fill="#0284c7"/>
            <circle cx="280" cy="68"  r="3" fill="#0284c7"/>
            <circle cx="300" cy="62"  r="3" fill="#0284c7"/>
            <text x="180" y="235" text-anchor="middle" font-size="10" fill="#475569">Нижние квантили ниже, верхние выше.</text>
            <text x="180" y="250" text-anchor="middle" font-size="10" fill="#475569">Больше экстремумов, чем у нормального.</text>
            <text x="180" y="265" text-anchor="middle" font-size="9" fill="#64748b">(Student-t, Cauchy, финансовые ряды)</text>
          </g>
          <!-- LIGHT TAILS -->
          <g>
            <rect x="370" y="45" width="300" height="170" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <text x="520" y="62" text-anchor="middle" font-size="11" font-weight="600" fill="#059669">Лёгкие хвосты</text>
            <line x1="390" y1="200" x2="650" y2="200" stroke="#94a3b8"/>
            <line x1="390" y1="75" x2="390" y2="200" stroke="#94a3b8"/>
            <line x1="390" y1="200" x2="650" y2="75" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.7"/>
            <!-- Points converge to diagonal in middle, pull toward x-axis at ends -->
            <circle cx="400" cy="192" r="3" fill="#0284c7"/>
            <circle cx="420" cy="178" r="3" fill="#0284c7"/>
            <circle cx="440" cy="164" r="3" fill="#0284c7"/>
            <circle cx="460" cy="152" r="3" fill="#0284c7"/>
            <circle cx="480" cy="142" r="3" fill="#0284c7"/>
            <circle cx="500" cy="135" r="3" fill="#0284c7"/>
            <circle cx="520" cy="128" r="3" fill="#0284c7"/>
            <circle cx="540" cy="122" r="3" fill="#0284c7"/>
            <circle cx="560" cy="116" r="3" fill="#0284c7"/>
            <circle cx="580" cy="112" r="3" fill="#0284c7"/>
            <circle cx="600" cy="108" r="3" fill="#0284c7"/>
            <circle cx="620" cy="102" r="3" fill="#0284c7"/>
            <circle cx="640" cy="88" r="3" fill="#0284c7"/>
            <text x="520" y="235" text-anchor="middle" font-size="10" fill="#475569">Крайние значения ближе к центру.</text>
            <text x="520" y="250" text-anchor="middle" font-size="10" fill="#475569">Меньше экстремумов, чем у нормального.</text>
            <text x="520" y="265" text-anchor="middle" font-size="9" fill="#64748b">(Равномерное, ограниченные данные)</text>
          </g>
          <!-- RIGHT SKEW -->
          <g>
            <rect x="30" y="280" width="300" height="130" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <text x="180" y="297" text-anchor="middle" font-size="11" font-weight="600" fill="#b45309">Правый скос (хвост вверх)</text>
            <line x1="50" y1="390" x2="310" y2="390" stroke="#94a3b8"/>
            <line x1="50" y1="305" x2="50" y2="390" stroke="#94a3b8"/>
            <line x1="50" y1="390" x2="310" y2="305" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.7"/>
            <!-- Curve above diagonal on right (right skew: upper tail stretches up) -->
            <circle cx="60"  cy="388" r="3" fill="#0284c7"/>
            <circle cx="80"  cy="382" r="3" fill="#0284c7"/>
            <circle cx="100" cy="375" r="3" fill="#0284c7"/>
            <circle cx="120" cy="367" r="3" fill="#0284c7"/>
            <circle cx="140" cy="358" r="3" fill="#0284c7"/>
            <circle cx="160" cy="348" r="3" fill="#0284c7"/>
            <circle cx="180" cy="340" r="3" fill="#0284c7"/>
            <circle cx="200" cy="333" r="3" fill="#0284c7"/>
            <circle cx="220" cy="325" r="3" fill="#0284c7"/>
            <circle cx="240" cy="318" r="3" fill="#0284c7"/>
            <circle cx="260" cy="312" r="3" fill="#0284c7"/>
            <circle cx="280" cy="307" r="3" fill="#0284c7"/>
            <circle cx="300" cy="303" r="3" fill="#0284c7"/>
          </g>
          <!-- LEFT SKEW -->
          <g>
            <rect x="370" y="280" width="300" height="130" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <text x="520" y="297" text-anchor="middle" font-size="11" font-weight="600" fill="#7c3aed">Левый скос (хвост вниз)</text>
            <line x1="390" y1="390" x2="650" y2="390" stroke="#94a3b8"/>
            <line x1="390" y1="305" x2="390" y2="390" stroke="#94a3b8"/>
            <line x1="390" y1="390" x2="650" y2="305" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.7"/>
            <!-- Left skew: points curve BELOW diagonal (sample quantiles smaller than theoretical) -->
            <circle cx="400" cy="398" r="3" fill="#0284c7"/>
            <circle cx="420" cy="395" r="3" fill="#0284c7"/>
            <circle cx="440" cy="388" r="3" fill="#0284c7"/>
            <circle cx="460" cy="380" r="3" fill="#0284c7"/>
            <circle cx="480" cy="370" r="3" fill="#0284c7"/>
            <circle cx="500" cy="362" r="3" fill="#0284c7"/>
            <circle cx="520" cy="352" r="3" fill="#0284c7"/>
            <circle cx="540" cy="342" r="3" fill="#0284c7"/>
            <circle cx="560" cy="337" r="3" fill="#0284c7"/>
            <circle cx="580" cy="330" r="3" fill="#0284c7"/>
            <circle cx="600" cy="325" r="3" fill="#0284c7"/>
            <circle cx="620" cy="318" r="3" fill="#0284c7"/>
            <circle cx="640" cy="312" r="3" fill="#0284c7"/>
          </g>
        </svg>
        <div class="caption">Как читать отклонения от диагонали: S-образная форма — тяжёлые хвосты, «зажатая» — лёгкие, кривизна вверх справа — правый скос, кривизна вниз слева — левый скос.</div>
      </div>

      <div class="key-concept">
        <div class="kc-label">Правила чтения Q-Q plot</div>
        <ul>
          <li><b>Точки на диагонали</b> → распределение соответствует теоретическому.</li>
          <li><b>S-образная кривая</b> → тяжёлые хвосты (в данных больше экстремумов).</li>
          <li><b>Выпуклая вверх кривая</b> → правый скос (положительная асимметрия).</li>
          <li><b>Выпуклая вниз кривая</b> → левый скос (отрицательная асимметрия).</li>
          <li><b>«Ступеньки»</b> → дискретные данные, округления, повторяющиеся значения.</li>
          <li><b>Отдельные точки на краях</b> → возможные выбросы.</li>
        </ul>
      </div>

      <h3>🎯 Зачем использовать Q-Q plot</h3>
      <ul>
        <li><b>Проверка нормальности</b> — прежде чем применять t-тест, ANOVA, линейную регрессию, надо убедиться, что данные (или остатки) нормальны.</li>
        <li><b>Сравнение выборки с любым распределением</b> — не только нормальным. Можно строить Q-Q plot относительно экспоненциального, Weibull, log-normal и т.д.</li>
        <li><b>Сравнение двух выборок</b> — по оси X квантили одной выборки, по оси Y — другой. Если распределения одинаковы — диагональ.</li>
        <li><b>Обнаружение выбросов</b> — сильно отклоняющиеся точки на краях.</li>
      </ul>

      <h3>📊 Q-Q plot vs гистограмма</h3>
      <table>
        <tr><th></th><th>Гистограмма</th><th>Q-Q plot</th></tr>
        <tr><td>Что показывает</td><td>Частоту значений в бинах</td><td>Квантили vs теоретические квантили</td></tr>
        <tr><td>Проверка нормальности</td><td>Приблизительно, на глаз</td><td>Более точно</td></tr>
        <tr><td>Чувствительность к бинам</td><td>Результат зависит от выбора ширины</td><td>Не зависит от бинов</td></tr>
        <tr><td>Маленькие выборки (n&lt;50)</td><td>Почти бесполезна</td><td>Работает даже на 20-30 точках</td></tr>
        <tr><td>Интерпретация формы хвостов</td><td>Трудно</td><td>Очень наглядно</td></tr>
      </table>
      <p><b>Вывод:</b> гистограмма даёт общее впечатление, Q-Q plot — точный диагноз. Используют оба вместе.</p>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Если точки немного отклоняются — распределение не нормальное»</b> — нет. Идеальной прямой не бывает, особенно при малых n. Небольшие отклонения на концах нормальны.</li>
        <li><b>«Q-Q plot — только для нормального распределения»</b> — его можно строить для любого эталонного распределения.</li>
        <li><b>«Q-Q plot заменяет статистический тест»</b> — дополняет. На маленьких n Q-Q plot может быть информативнее теста Шапиро-Уилка, на больших — наоборот.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('distributions')">Распределения</a> — что такое квантили теоретического распределения.</li>
        <li><a onclick="App.selectTopic('hypothesis-testing')">Проверка гипотез</a> — формальные тесты нормальности (Шапиро-Уилка).</li>
        <li><a onclick="App.selectTopic('viz-histogram')">Гистограмма</a> — альтернативный визуальный тест.</li>
        <li><a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> — Q-Q plot остатков проверяет нормальность ошибок.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Как построить Q-Q plot вручную',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>У нас 10 измерений. Проверим, похожи ли они на нормальное распределение N(0, 1).</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Отсортируем данные</h4>
            <div class="calc">Исходные: [0.5, -1.2, 0.1, 2.3, -0.8, 1.1, -0.3, 0.7, -1.5, 1.8]
Сортируем: [-1.5, -1.2, -0.8, -0.3, 0.1, 0.5, 0.7, 1.1, 1.8, 2.3]</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Вычислим эмпирические вероятности</h4>
            <p>Для i-го отсортированного значения: $p_i = (i - 0.5) / n$</p>
            <table>
              <tr><th>i</th><th>x_(i)</th><th>p_i = (i−0.5)/10</th></tr>
              <tr><td>1</td><td>−1.5</td><td>0.05</td></tr>
              <tr><td>2</td><td>−1.2</td><td>0.15</td></tr>
              <tr><td>3</td><td>−0.8</td><td>0.25</td></tr>
              <tr><td>4</td><td>−0.3</td><td>0.35</td></tr>
              <tr><td>5</td><td>0.1</td><td>0.45</td></tr>
              <tr><td>6</td><td>0.5</td><td>0.55</td></tr>
              <tr><td>7</td><td>0.7</td><td>0.65</td></tr>
              <tr><td>8</td><td>1.1</td><td>0.75</td></tr>
              <tr><td>9</td><td>1.8</td><td>0.85</td></tr>
              <tr><td>10</td><td>2.3</td><td>0.95</td></tr>
            </table>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Найдём теоретические квантили для N(0, 1)</h4>
            <p>Для каждой $p_i$ находим $q_i = \\Phi^{-1}(p_i)$ — обратная функция распределения (probit).</p>
            <table>
              <tr><th>p_i</th><th>Теоретический q_i</th><th>Фактический x_(i)</th></tr>
              <tr><td>0.05</td><td>−1.64</td><td>−1.5</td></tr>
              <tr><td>0.15</td><td>−1.04</td><td>−1.2</td></tr>
              <tr><td>0.25</td><td>−0.67</td><td>−0.8</td></tr>
              <tr><td>0.35</td><td>−0.39</td><td>−0.3</td></tr>
              <tr><td>0.45</td><td>−0.13</td><td>0.1</td></tr>
              <tr><td>0.55</td><td>0.13</td><td>0.5</td></tr>
              <tr><td>0.65</td><td>0.39</td><td>0.7</td></tr>
              <tr><td>0.75</td><td>0.67</td><td>1.1</td></tr>
              <tr><td>0.85</td><td>1.04</td><td>1.8</td></tr>
              <tr><td>0.95</td><td>1.64</td><td>2.3</td></tr>
            </table>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Строим график и делаем вывод</h4>
            <p>Наносим пары (q_i, x_(i)) на график и проводим линию y = x.</p>
            <div class="why">Видно, что точки достаточно близки к диагонали, с небольшим наклоном вверх на правом хвосте. Это может указывать на лёгкий правый скос или просто на случайные отклонения при малой выборке. При n=10 большое отклонение не должно смущать — нужно больше данных.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Вывод</div>
            <p>Выборка приближённо нормальна с небольшим правым скосом. При n = 10 это может быть просто случайность — для серьёзных выводов нужно хотя бы n = 50.</p>
          </div>
        `
      },
      {
        title: 'Обнаружение тяжёлых хвостов',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Аналитик строит Q-Q plot доходностей акций и видит S-образный паттерн — точки на левом хвосте сильно ниже диагонали, а на правом — сильно выше. Что это значит и какие последствия?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Интерпретация формы</h4>
            <p>S-образная кривая означает, что в данных <b>больше экстремальных значений</b>, чем предсказывает нормальное распределение. Это <b>тяжёлые хвосты</b>.</p>
            <p>Для финансовых данных это классическая картина: нормальное распределение предсказывает, что «крах» 10% за день невозможен (вероятность &lt; $10^{-100}$), а в реальности такое происходит раз в несколько лет.</p>
          </div>

          <div class="step" data-step="2">
            <h4>Почему это важно</h4>
            <ul>
              <li><b>Нельзя применять методы, основанные на нормальности</b>: Value at Risk по нормальному сильно занижает реальный риск.</li>
              <li><b>Выбросы не случайны</b> — это системное свойство данных, их нельзя «отфильтровать» как шум.</li>
              <li><b>Среднее и std обманчивы</b> — если хвосты действительно тяжёлые (как у Коши), теоретическая дисперсия бесконечна.</li>
            </ul>
          </div>

          <div class="step" data-step="3">
            <h4>Что делать</h4>
            <ul>
              <li>Использовать распределения с тяжёлыми хвостами: Student-t (с малым df), Cauchy, стабильные распределения Парето.</li>
              <li>Применять робастные методы: медиана вместо среднего, MAD вместо std.</li>
              <li>Для риск-менеджмента использовать Expected Shortfall (CVaR), а не VaR.</li>
            </ul>
          </div>

          <div class="answer-box">
            <div class="answer-label">Вывод</div>
            <p>S-образный Q-Q plot — сильный сигнал: не доверяй предположению о нормальности. Перейди на модели с тяжёлыми хвостами и робастные статистики.</p>
          </div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Читаем Q-Q plot глазами</h3>
        <p>На оси X — теоретические квантили нормального распределения, на оси Y — эмпирические из твоей выборки. Нормальная выборка → точки ложатся на прямую. Тяжёлые хвосты → S-образный изгиб (концы «убегают» вверх/вниз). Правый скос → прогиб вниз слева, вверх справа. Переключай распределение — запомни характерные паттерны.</p>
        <div class="sim-container">
          <div class="sim-controls" id="viz-qq-ctrl"></div>
          <div class="sim-buttons"><button class="btn" id="viz-qq-run">🔄 Новая выборка</button></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="viz-qq-chart"></canvas></div>
            <div class="sim-stats" id="viz-qq-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const ctrl = container.querySelector('#viz-qq-ctrl');
        const cN = App.makeControl('range', 'viz-qq-n', 'Размер выборки', { min: 20, max: 2000, step: 10, value: 200 });
        const cDist = App.makeControl('select', 'viz-qq-dist', 'Распределение', {
          options: [
            { value: 'normal', label: 'Нормальное (эталон)' },
            { value: 'heavy', label: 'Тяжёлые хвосты (Student t₃)' },
            { value: 'skew-right', label: 'Правый скос (log-normal)' },
            { value: 'skew-left', label: 'Левый скос' },
            { value: 'uniform', label: 'Равномерное (лёгкие хвосты)' },
            { value: 'bimodal', label: 'Бимодальное' },
          ],
          value: 'heavy',
        });
        [cN, cDist].forEach(c => ctrl.appendChild(c.wrap));
        let chart = null;
        // Inverse normal (Beasley-Springer-like)
        function normInv(p) {
          const a = [2.515517, 0.802853, 0.010328];
          const b = [1.432788, 0.189269, 0.001308];
          const q = p > 0.5 ? 1 - p : p;
          if (q <= 0) return p > 0.5 ? 5 : -5;
          const t = Math.sqrt(-2 * Math.log(q));
          const num = a[0] + a[1] * t + a[2] * t * t;
          const den = 1 + b[0] * t + b[1] * t * t + b[2] * t * t * t;
          const x = t - num / den;
          return p > 0.5 ? x : -x;
        }
        function sample(n, dist) {
          const s = [];
          if (dist === 'normal') for (let i = 0; i < n; i++) s.push(App.Util.randn());
          else if (dist === 'heavy') {
            for (let i = 0; i < n; i++) {
              const z = App.Util.randn();
              let chi = 0;
              for (let j = 0; j < 3; j++) chi += App.Util.randn() ** 2;
              s.push(z / Math.sqrt(chi / 3));
            }
          } else if (dist === 'skew-right') {
            for (let i = 0; i < n; i++) s.push(Math.exp(App.Util.randn(0, 0.7)) - 1.3);
          } else if (dist === 'skew-left') {
            for (let i = 0; i < n; i++) s.push(-(Math.exp(App.Util.randn(0, 0.7)) - 1.3));
          } else if (dist === 'uniform') {
            for (let i = 0; i < n; i++) s.push((Math.random() - 0.5) * 3.4);
          } else if (dist === 'bimodal') {
            for (let i = 0; i < n; i++) s.push(Math.random() < 0.5 ? App.Util.randn(-2, 0.4) : App.Util.randn(2, 0.4));
          }
          return s;
        }
        function run() {
          const n = +cN.input.value;
          const dist = cDist.input.value;
          const data = sample(n, dist).sort((a, b) => a - b);
          // Standardize for comparison
          const mu = App.Util.mean(data);
          const sd = App.Util.std(data);
          const z = data.map(v => (v - mu) / sd);
          // Theoretical quantiles
          const theor = [];
          for (let i = 0; i < n; i++) {
            const p = (i + 0.5) / n;
            theor.push(normInv(p));
          }
          const points = theor.map((t, i) => ({ x: t, y: z[i] }));
          const lineEnds = [Math.min(...theor), Math.max(...theor)];
          const idealLine = lineEnds.map(v => ({ x: v, y: v }));
          // Shapiro-Wilk approx hardcore; use simple correlation on QQ as proxy
          const meanT = App.Util.mean(theor);
          const meanZ = App.Util.mean(z);
          let num = 0, dt = 0, dz = 0;
          for (let i = 0; i < n; i++) {
            num += (theor[i] - meanT) * (z[i] - meanZ);
            dt += (theor[i] - meanT) ** 2;
            dz += (z[i] - meanZ) ** 2;
          }
          const r = num / Math.sqrt(dt * dz);
          const ctx = container.querySelector('#viz-qq-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Q-Q точки', data: points, backgroundColor: 'rgba(59,130,246,0.7)', pointRadius: 3 },
                { label: 'y = x (если нормальное)', data: idealLine, type: 'line', borderColor: '#ef4444', borderWidth: 2, borderDash: [6, 4], pointRadius: 0, fill: false, showLine: true },
              ],
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Q-Q plot: ' + dist + ', n=' + n } }, scales: { x: { type: 'linear', title: { display: true, text: 'Теоретические квантили N(0,1)' } }, y: { title: { display: true, text: 'Эмпирические (стандартизованные)' } } } },
          });
          App.registerChart(chart);
          const verdict = r > 0.995 ? 'Очень близко к нормальному' : r > 0.98 ? 'Слегка отклоняется' : r > 0.95 ? 'Заметное отклонение' : 'Сильное отклонение';
          container.querySelector('#viz-qq-stats').innerHTML =
            '<div class="stat-card"><div class="stat-label">QQ-корреляция</div><div class="stat-value">' + r.toFixed(4) + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Вердикт</div><div class="stat-value" style="font-size:0.85em">' + verdict + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Mean</div><div class="stat-value">' + mu.toFixed(2) + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Std</div><div class="stat-value">' + sd.toFixed(2) + '</div></div>';
        }
        cN.input.addEventListener('change', run);
        cDist.input.addEventListener('change', run);
        container.querySelector('#viz-qq-run').onclick = run;
        run();
      },
    },

    python: `
<h3>Q-Q plot в Python</h3>

<h4>scipy + matplotlib</h4>
<pre><code>import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# Сгенерируем выборку
np.random.seed(42)
data = np.random.normal(loc=0, scale=1, size=200)

# Простейший Q-Q plot против нормального распределения
fig, ax = plt.subplots(figsize=(6, 6))
stats.probplot(data, dist="norm", plot=ax)
ax.set_title("Q-Q plot: normal data vs N(0,1)")
ax.grid(True)
plt.show()
</code></pre>

<h4>Проверка на разные распределения</h4>
<pre><code># Для t-распределения с 3 degrees of freedom
heavy_tails = np.random.standard_t(df=3, size=200)
stats.probplot(heavy_tails, dist="norm", plot=plt)
plt.title("Тяжёлые хвосты: t(3) против N(0,1)")
plt.show()
# Ожидание: S-образная форма

# Сравнение с правильным распределением
stats.probplot(heavy_tails, dist="t", sparams=(3,), plot=plt)
plt.title("t(3) против t(3) — должно быть на диагонали")
plt.show()
</code></pre>

<h4>Q-Q plot для остатков регрессии</h4>
<pre><code>from sklearn.linear_model import LinearRegression

X = np.random.randn(100, 1)
y = 2 * X.squeeze() + 1 + np.random.randn(100) * 0.5

model = LinearRegression().fit(X, y)
residuals = y - model.predict(X)

# Нормальны ли остатки?
fig, ax = plt.subplots()
stats.probplot(residuals, dist="norm", plot=ax)
ax.set_title("Q-Q plot остатков регрессии")
plt.show()
# Должны лежать на диагонали для валидной регрессии
</code></pre>

<h4>Две выборки (two-sample Q-Q plot)</h4>
<pre><code>sample1 = np.random.normal(0, 1, 200)
sample2 = np.random.normal(0.5, 1.2, 200)

q1 = np.quantile(sample1, np.linspace(0.01, 0.99, 100))
q2 = np.quantile(sample2, np.linspace(0.01, 0.99, 100))

plt.scatter(q1, q2)
plt.plot([q1.min(), q1.max()], [q1.min(), q1.max()], 'r--')
plt.xlabel('Квантили выборки 1')
plt.ylabel('Квантили выборки 2')
plt.title('Two-sample Q-Q plot')
plt.show()
# Смещение диагонали = разное среднее
# Наклон ≠ 1 = разная дисперсия
</code></pre>

<h4>statsmodels: подробный Q-Q plot</h4>
<pre><code>import statsmodels.api as sm

fig = sm.qqplot(data, line='45', fit=True)
# line='45' — идеальная диагональ
# fit=True — подгоняет параметры нормального к данным (μ, σ)
plt.show()
</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Диагностика остатков линейной регрессии.</b> Нормальность остатков — одно из ключевых допущений OLS, от которого зависят доверительные интервалы и p-value коэффициентов. Q-Q plot остатков — обязательный пункт диагностики, наравне с residuals-vs-fitted. Отклонения от диагонали = нельзя доверять стандартным ошибкам.</li>
        <li><b>Выбор между параметрическим и непараметрическим тестом.</b> Перед t-тестом, ANOVA или дисперсионным анализом принято проверить нормальность данных. Q-Q plot решает: диагональ — бери t-test, хвосты ушли вверх-вниз — переключайся на Mann-Whitney или Wilcoxon.</li>
        <li><b>Риск-менеджмент в финансах.</b> Предположение «доходности ~ нормальные» — основа классических риск-моделей (VaR, CAPM). На Q-Q plot дневные доходности акций образуют характерный S-образный изгиб: хвосты толще, чем у нормального. Это главный визуальный аргумент за переход к t-распределению или EVT.</li>
        <li><b>Контроль качества на производстве.</b> Параметры детали должны распределяться нормально вокруг номинала — это предположение для контрольных карт и расчёта Cpk. Q-Q plot показывает отклонения (бимодальность из-за двух станков, сдвиг из-за износа).</li>
        <li><b>Extreme value analysis в геологии и метеорологии.</b> Максимальные осадки, магнитуды землетрясений, амплитуды штормов — Q-Q plot против Weibull/Gumbel/GEV помогает выбрать правильное распределение для прогнозирования редких событий.</li>
        <li><b>Анализ ошибок ML-моделей.</b> Распределение ошибок регрессионной модели должно быть симметричным и «почти нормальным» — если на Q-Q plot сильные хвосты, значит модель систематически промахивается на подгруппах, и стоит искать feature interactions.</li>
        <li><b>Проверка применимости z-критериев и доверительных интервалов.</b> Многие стандартные процедуры опираются на нормальность. Q-Q plot — самый быстрый способ понять, держится ли это предположение до того, как публиковать выводы.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Показывает ГДЕ именно отличие от эталона.</b> Это главное преимущество перед формальными тестами. Shapiro-Wilk выдаёт одно p-value и молчит о природе отклонения. Q-Q plot показывает: верхний хвост ушёл вверх = есть тяжёлый правый хвост; точки в центре изгибаются = асимметрия; S-образный изгиб = тяжелее нормального с обеих сторон. Это диагностика, а не просто «да/нет».</p>
      <p><b>Работает на малых выборках, где гистограмма бесполезна.</b> При $n = 20$ гистограмма — это 20 точек, раскиданных по бинам, никакой формы не видно. Q-Q plot на тех же 20 точках даёт вменяемую картину: если точки лежат на прямой — нормальность правдоподобна, если уходят дугой — нет.</p>
      <p><b>Не зависит от бинов.</b> В отличие от гистограммы, Q-Q plot не имеет параметров сглаживания. Результат воспроизводим: две аналитики построят одну и ту же картинку и придут к одному выводу.</p>
      <p><b>Универсальность.</b> Можно сравнивать не только с нормальным, а с любым теоретическим распределением — экспоненциальным, логнормальным, Weibull, Gumbel. Это стандартный инструмент survival analysis и extreme value theory.</p>
      <p><b>Дополняет формальные тесты, а не конкурирует.</b> Лучшая практика: Q-Q plot для интуиции + Shapiro-Wilk для формального вывода. Q-Q показывает смысл, тест даёт p-value для отчёта. Вместе они закрывают и «что именно не так», и «насколько это статистически значимо».</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Субъективность интерпретации.</b> «Точки достаточно близки к диагонали?» — ответ зависит от глаз. Разные аналитики на одном графике могут сделать противоположные выводы. Для отчёта или публикации одного Q-Q plot недостаточно — нужен формальный тест рядом.</p>
      <p><b>Маленькие выборки всё равно обманывают.</b> При $n &lt; 15$ даже выборка из нормального распределения на Q-Q plot выглядит «с хвостами» — просто из-за случайности. Не стоит делать выводы о нормальности на 10 точках, никакой инструмент не поможет.</p>
      <p><b>Большие выборки, наоборот, показывают всё как «не нормальное».</b> При $n = 100000$ даже мельчайшие отклонения от нормальности видны, и формальные тесты почти всегда отвергают $H_0$. Парадокс: данные «слишком нормальные для практики, но недостаточно для теста». Здесь важно смотреть на Q-Q plot — если визуально близко, этого достаточно.</p>
      <p><b>Одномерный.</b> Проверяет только одну переменную за раз. Для многомерной нормальности (например, остатки в многомерной регрессии) нужны chi-square Q-Q plot или формальные тесты Mardia.</p>
      <p><b>Требует выбора эталона.</b> Надо заранее решить: сравниваем с нормальным, логнормальным, экспоненциальным? Если не знаешь распределения-кандидата, Q-Q plot не поможет — нужен сначала EDA через гистограмму, чтобы выдвинуть гипотезу.</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Бери Q-Q plot когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Проверяешь нормальность остатков регрессии перед доверием к p-value</td>
          <td>Выборка меньше 15 точек — любой вывод будет артефактом случайности</td>
        </tr>
        <tr>
          <td>Надо понять, в хвостах или в центре расходится распределение с эталоном</td>
          <td>Нужно формальное заключение «да/нет» для отчёта — бери Shapiro-Wilk или Anderson-Darling</td>
        </tr>
        <tr>
          <td>Выбираешь между параметрическим и непараметрическим тестом (t-test vs Wilcoxon)</td>
          <td>Не знаешь, с каким распределением сравнивать — сначала гистограмма для гипотезы</td>
        </tr>
        <tr>
          <td>Анализ финансовых доходностей на тяжесть хвостов</td>
          <td>Цель — общее впечатление о форме данных, а не сравнение с эталоном — гистограмма понятнее</td>
        </tr>
        <tr>
          <td>$n$ между 20 и 10000 — зона, где Q-Q plot даёт самую ценную информацию</td>
          <td>Задача многомерная (нормальность остатков в N&gt;1 переменных) — нужны Mardia-тесты</td>
        </tr>
        <tr>
          <td>Нужна воспроизводимая проверка без параметров сглаживания</td>
          <td>Аудитория нетехническая — Q-Q plot требует объяснения, гистограмма нет</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b>Shapiro-Wilk test</b> — формальный тест на нормальность, даёт p-value. Лучший выбор при $n &lt; 5000$. Используй вместе с Q-Q plot: тест — для отчёта, график — для понимания.</li>
        <li><b>Anderson-Darling / Kolmogorov-Smirnov</b> — более общие тесты соответствия распределению. AD чувствителен к хвостам и поэтому ценен в финансах и риск-аналитике.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-histogram')">Гистограмма</a> + KDE с наложенной теоретической плотностью</b> — для общего впечатления о форме и нетехнической аудитории. Меньше диагностики, больше эстетики.</li>
        <li><b>P-P plot (probability-probability plot)</b> — родственник Q-Q plot, сравнивает кумулятивные вероятности. Менее чувствителен в хвостах, но более чувствителен в центре. Иногда даёт более стабильную картину.</li>
        <li><b>Two-sample Q-Q plot + Kolmogorov-Smirnov</b> — если сравниваешь две эмпирические выборки между собой, а не с теоретическим распределением.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=okjYjClSjOg" target="_blank">StatQuest: Q-Q plots, clearly explained</a> — отличное визуальное объяснение</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Q%E2%80%93Q_plot" target="_blank">Wikipedia: Q-Q plot</a></li>
        <li><a href="https://habr.com/ru/search/?q=Q-Q%20plot%20%D0%BD%D0%BE%D1%80%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D1%8C" target="_blank">Habr: Q-Q plot и проверка нормальности</a></li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.probplot.html" target="_blank">scipy.stats.probplot</a></li>
        <li><a href="https://www.statsmodels.org/stable/generated/statsmodels.graphics.gofplots.qqplot.html" target="_blank">statsmodels.qqplot</a></li>
      </ul>
    `
  }
});
