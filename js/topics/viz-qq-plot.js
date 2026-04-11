/* ==========================================================================
   Глоссарий: Q-Q Plot
   ========================================================================== */
App.registerTopic({
  id: 'viz-qq-plot',
  category: 'viz',
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
            <!-- S-curve below diagonal then above -->
            <circle cx="60"  cy="195" r="3" fill="#0284c7"/>
            <circle cx="80"  cy="188" r="3" fill="#0284c7"/>
            <circle cx="100" cy="183" r="3" fill="#0284c7"/>
            <circle cx="120" cy="177" r="3" fill="#0284c7"/>
            <circle cx="140" cy="165" r="3" fill="#0284c7"/>
            <circle cx="160" cy="148" r="3" fill="#0284c7"/>
            <circle cx="180" cy="132" r="3" fill="#0284c7"/>
            <circle cx="200" cy="120" r="3" fill="#0284c7"/>
            <circle cx="220" cy="112" r="3" fill="#0284c7"/>
            <circle cx="240" cy="107" r="3" fill="#0284c7"/>
            <circle cx="260" cy="102" r="3" fill="#0284c7"/>
            <circle cx="280" cy="95" r="3" fill="#0284c7"/>
            <circle cx="300" cy="85" r="3" fill="#0284c7"/>
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
            <circle cx="400" cy="180" r="3" fill="#0284c7"/>
            <circle cx="420" cy="170" r="3" fill="#0284c7"/>
            <circle cx="440" cy="158" r="3" fill="#0284c7"/>
            <circle cx="460" cy="150" r="3" fill="#0284c7"/>
            <circle cx="480" cy="140" r="3" fill="#0284c7"/>
            <circle cx="500" cy="133" r="3" fill="#0284c7"/>
            <circle cx="520" cy="125" r="3" fill="#0284c7"/>
            <circle cx="540" cy="120" r="3" fill="#0284c7"/>
            <circle cx="560" cy="115" r="3" fill="#0284c7"/>
            <circle cx="580" cy="108" r="3" fill="#0284c7"/>
            <circle cx="600" cy="100" r="3" fill="#0284c7"/>
            <circle cx="620" cy="98" r="3" fill="#0284c7"/>
            <circle cx="640" cy="95" r="3" fill="#0284c7"/>
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
            <!-- Curve above diagonal on right -->
            <circle cx="60"  cy="388" r="3" fill="#0284c7"/>
            <circle cx="80"  cy="380" r="3" fill="#0284c7"/>
            <circle cx="100" cy="372" r="3" fill="#0284c7"/>
            <circle cx="120" cy="362" r="3" fill="#0284c7"/>
            <circle cx="140" cy="350" r="3" fill="#0284c7"/>
            <circle cx="160" cy="340" r="3" fill="#0284c7"/>
            <circle cx="180" cy="327" r="3" fill="#0284c7"/>
            <circle cx="200" cy="317" r="3" fill="#0284c7"/>
            <circle cx="220" cy="305" r="3" fill="#0284c7"/>
            <circle cx="240" cy="290" r="3" fill="#0284c7"/>
            <circle cx="260" cy="275" r="3" fill="#0284c7"/>
            <circle cx="280" cy="260" r="3" fill="#0284c7"/>
            <circle cx="300" cy="240" r="3" fill="#0284c7"/>
          </g>
          <!-- LEFT SKEW -->
          <g>
            <rect x="370" y="280" width="300" height="130" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
            <text x="520" y="297" text-anchor="middle" font-size="11" font-weight="600" fill="#7c3aed">Левый скос (хвост вниз)</text>
            <line x1="390" y1="390" x2="650" y2="390" stroke="#94a3b8"/>
            <line x1="390" y1="305" x2="390" y2="390" stroke="#94a3b8"/>
            <line x1="390" y1="390" x2="650" y2="305" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.7"/>
            <circle cx="400" cy="370" r="3" fill="#0284c7"/>
            <circle cx="420" cy="358" r="3" fill="#0284c7"/>
            <circle cx="440" cy="345" r="3" fill="#0284c7"/>
            <circle cx="460" cy="335" r="3" fill="#0284c7"/>
            <circle cx="480" cy="332" r="3" fill="#0284c7"/>
            <circle cx="500" cy="325" r="3" fill="#0284c7"/>
            <circle cx="520" cy="320" r="3" fill="#0284c7"/>
            <circle cx="540" cy="318" r="3" fill="#0284c7"/>
            <circle cx="560" cy="315" r="3" fill="#0284c7"/>
            <circle cx="580" cy="313" r="3" fill="#0284c7"/>
            <circle cx="600" cy="312" r="3" fill="#0284c7"/>
            <circle cx="620" cy="310" r="3" fill="#0284c7"/>
            <circle cx="640" cy="308" r="3" fill="#0284c7"/>
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
      <h3>Где используется Q-Q plot</h3>
      <table>
        <tr><th>Область</th><th>Применение</th></tr>
        <tr><td><b>Регрессионный анализ</b></td><td>Проверка нормальности остатков (одно из ключевых допущений)</td></tr>
        <tr><td><b>Финансы и риск</b></td><td>Обнаружение тяжёлых хвостов в доходностях — критично для VaR и риск-моделей</td></tr>
        <tr><td><b>Контроль качества</b></td><td>Проверка соответствия параметров продукции нормальному распределению</td></tr>
        <tr><td><b>Медицинские исследования</b></td><td>Проверка применимости параметрических тестов (t-test, ANOVA)</td></tr>
        <tr><td><b>A/B тестирование</b></td><td>Проверка предпосылок для выбора t-теста vs непараметрических</td></tr>
        <tr><td><b>Машинное обучение</b></td><td>Проверка распределения ошибок моделей, features engineering</td></tr>
        <tr><td><b>Геология, метеорология</b></td><td>Анализ экстремальных событий (землетрясения, осадки) — часто тяжёлые хвосты</td></tr>
      </table>
    `,

    proscons: `
      <h3>Плюсы Q-Q plot</h3>
      <ul>
        <li><b>Мощный визуальный тест</b> — один взгляд заменяет длинную таблицу статистик</li>
        <li><b>Работает на малых выборках</b> (от ~20 точек), где гистограмма бесполезна</li>
        <li><b>Показывает ГДЕ именно отличие</b> — в хвостах, в центре, справа или слева</li>
        <li><b>Универсальный</b> — можно сравнивать с любым распределением</li>
        <li><b>Не зависит от выбора бинов</b> как гистограмма</li>
      </ul>

      <h3>Минусы и ограничения</h3>
      <ul>
        <li><b>Субъективность</b> — «точки близки к диагонали» или «нет»? Не формальный критерий.</li>
        <li><b>Одномерный</b> — смотрит только на распределение одной переменной</li>
        <li><b>Маленькие выборки могут обманывать</b> — на 10-20 точках любой тест ненадёжен</li>
        <li><b>Требует знания эталонного распределения</b> — надо заранее решить, что с чем сравнивать</li>
      </ul>

      <h3>🧭 Когда использовать vs альтернативы</h3>
      <table>
        <tr><th>Задача</th><th>Лучший инструмент</th></tr>
        <tr><td>Быстрый визуальный чек нормальности</td><td><b>Q-Q plot</b></td></tr>
        <tr><td>Формальное заключение (да/нет)</td><td>Shapiro-Wilk test (n &lt; 5000), Anderson-Darling</td></tr>
        <tr><td>Общее впечатление о форме</td><td>Histogram + KDE</td></tr>
        <tr><td>Сравнение двух групп</td><td>Two-sample Q-Q plot или Kolmogorov-Smirnov test</td></tr>
      </table>
      <p><b>Практика:</b> всегда смотри на Q-Q plot + гистограмму <b>до</b> применения параметрических тестов.</p>
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
