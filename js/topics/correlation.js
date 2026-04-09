/* ==========================================================================
   Корреляция и ковариация
   ========================================================================== */
App.registerTopic({
  id: 'correlation',
  category: 'stats',
  title: 'Корреляция и ковариация',
  summary: 'Как измерить связь между двумя переменными.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь двух друзей, которые всегда ходят вместе: куда один, туда и второй. Если увидел одного — почти наверняка где-то рядом другой. Это <b>сильная положительная связь</b>.</p>
        <p>А теперь представь двух людей, которые никогда не пересекаются — один любит утро, другой — ночь. Увидел первого — значит второго точно нет. Это <b>сильная отрицательная связь</b>.</p>
        <p>И третий случай: два случайных прохожих. Никакой системы, пересекаются случайно. Это <b>отсутствие связи</b>.</p>
        <p>Корреляция — это число от −1 до +1, показывающее, насколько две переменные «ходят вместе». Число ровно это и измеряет.</p>
      </div>

      <h3>🎯 Зачем измерять связь</h3>
      <p>В данных мы постоянно хотим понять, как переменные связаны. Продажи растут с рекламным бюджетом? Высокий рост коррелирует с большим весом? Чем выше уровень стресса, тем хуже сон? Корреляция — стандартный инструмент ответа на такие вопросы одним числом.</p>

      <h3>💡 Ковариация — первый шаг</h3>
      <p>Ковариация — сырая мера совместного изменения двух величин:</p>
      <div class="math-block">$$\\text{Cov}(X, Y) = \\frac{1}{n-1}\\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})$$</div>

      <p>Идея простая: для каждой точки смотрим, отклонение X от среднего и отклонение Y от среднего, перемножаем, усредняем.</p>
      <ul>
        <li>Если обычно оба отклонения положительные (или оба отрицательные) — произведения положительные, Cov > 0.</li>
        <li>Если знаки чаще противоположные — Cov < 0.</li>
        <li>Если хаотично — произведения сокращаются, Cov ≈ 0.</li>
      </ul>

      <p><b>Проблема ковариации:</b> она зависит от единиц измерения. Ковариация роста и веса будет совсем разной, если измерять в мм и г, или в м и кг. Невозможно сравнить «насколько сильная связь» между разными парами переменных.</p>

      <h3>📊 Корреляция Пирсона — нормированная ковариация</h3>
      <p>Чтобы избавиться от зависимости от единиц, ковариацию делят на произведение стандартных отклонений:</p>
      <div class="math-block">$$r = \\frac{\\text{Cov}(X, Y)}{s_x \\cdot s_y}$$</div>

      <p>Это называется <span class="term" data-tip="Pearson correlation coefficient. Мера линейной связи между двумя переменными. Безразмерная, лежит в [-1, 1]. Наиболее распространённая мера корреляции.">коэффициентом корреляции Пирсона</span>. Магия в том, что результат всегда лежит в диапазоне $[-1, +1]$.</p>

      <div class="key-concept">
        <div class="kc-label">Главное свойство</div>
        <p><b>r = +1</b> — идеальная прямая линия с положительным наклоном. <b>r = −1</b> — идеальная прямая с отрицательным. <b>r = 0</b> — линейной связи нет (но может быть нелинейная). Промежуточные значения — «насколько близко к прямой лежат точки».</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 190" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <!-- ===== LEFT: r ≈ 0.9 (tight upward) ===== -->
          <text x="93" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#10b981">r &#x2248; +0.9</text>
          <!-- Axes -->
          <line x1="28" y1="155" x2="160" y2="155" stroke="#64748b" stroke-width="1.2"/>
          <line x1="28" y1="30" x2="28" y2="155" stroke="#64748b" stroke-width="1.2"/>
          <!-- Trend line -->
          <line x1="35" y1="145" x2="155" y2="42" stroke="#10b981" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
          <!-- Tight cluster of dots along upward trend -->
          <circle cx="42" cy="138" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="55" cy="126" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="63" cy="119" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="72" cy="108" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="80" cy="102" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="88" cy="94" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="98" cy="86" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="107" cy="77" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="118" cy="69" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="128" cy="60" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="140" cy="52" r="3.5" fill="#10b981" opacity="0.8"/>
          <circle cx="148" cy="46" r="3.5" fill="#10b981" opacity="0.8"/>
          <text x="93" y="172" text-anchor="middle" font-size="10" fill="#10b981">Сильная положительная</text>

          <!-- ===== MIDDLE: r ≈ 0 (random cloud) ===== -->
          <text x="280" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#64748b">r &#x2248; 0</text>
          <!-- Axes -->
          <line x1="215" y1="155" x2="347" y2="155" stroke="#64748b" stroke-width="1.2"/>
          <line x1="215" y1="30" x2="215" y2="155" stroke="#64748b" stroke-width="1.2"/>
          <!-- Random scattered dots -->
          <circle cx="228" cy="58" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="240" cy="130" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="249" cy="82" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="258" cy="45" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="264" cy="115" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="275" cy="70" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="282" cy="140" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="293" cy="55" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="302" cy="100" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="314" cy="125" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="322" cy="40" r="3.5" fill="#64748b" opacity="0.7"/>
          <circle cx="334" cy="90" r="3.5" fill="#64748b" opacity="0.7"/>
          <text x="280" y="172" text-anchor="middle" font-size="10" fill="#64748b">Нет линейной связи</text>

          <!-- ===== RIGHT: r ≈ -0.8 (tight downward) ===== -->
          <text x="467" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#ef4444">r &#x2248; &#x2212;0.8</text>
          <!-- Axes -->
          <line x1="402" y1="155" x2="534" y2="155" stroke="#64748b" stroke-width="1.2"/>
          <line x1="402" y1="30" x2="402" y2="155" stroke="#64748b" stroke-width="1.2"/>
          <!-- Trend line downward -->
          <line x1="410" y1="50" x2="528" y2="145" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
          <!-- Dots along downward trend with moderate scatter -->
          <circle cx="415" cy="56" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="427" cy="67" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="436" cy="72" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="445" cy="85" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="455" cy="94" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="464" cy="104" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="474" cy="109" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="483" cy="118" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="495" cy="128" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="505" cy="133" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="516" cy="141" r="3.5" fill="#ef4444" opacity="0.8"/>
          <circle cx="524" cy="148" r="3.5" fill="#ef4444" opacity="0.8"/>
          <text x="467" y="172" text-anchor="middle" font-size="10" fill="#ef4444">Сильная отрицательная</text>
        </svg>
        <div class="caption">Три scatter plot-а: слева — точки тянутся вверх (r≈+0.9), по центру — облако без паттерна (r≈0), справа — точки тянутся вниз (r≈−0.8). Корреляция — это «насколько близко точки к прямой линии».</div>
      </div>

      <h3>📐 Как читать значения</h3>
      <table>
        <tr><th>|r|</th><th>Сила связи (для социальных данных)</th><th>Интерпретация</th></tr>
        <tr><td>0 – 0.1</td><td>нет / очень слабая</td><td>Практически случайно</td></tr>
        <tr><td>0.1 – 0.3</td><td>слабая</td><td>Есть тенденция, но шума много</td></tr>
        <tr><td>0.3 – 0.5</td><td>умеренная</td><td>Заметная связь</td></tr>
        <tr><td>0.5 – 0.7</td><td>сильная</td><td>Чёткий паттерн</td></tr>
        <tr><td>0.7 – 1.0</td><td>очень сильная</td><td>Почти линейная зависимость</td></tr>
      </table>
      <p>Эти пороги условны! В физике |r| = 0.9 считается слабой связью (там ожидают 0.99+), а в психологии 0.3 — уже находка.</p>

      <h3>⚠️ Что корреляция НЕ ловит</h3>
      <p>Пирсон измеряет только <b>линейную</b> связь. Если связь есть, но нелинейная — корреляция будет маленькой или нулевой.</p>

      <p><b>Пример:</b> $y = x^2$ на симметричном диапазоне. Связь очевидна, но $r = 0$. Потому что положительные и отрицательные отклонения компенсируются.</p>

      <p>Именно поэтому <b>всегда рисуют scatter plot</b>, прежде чем доверять числу корреляции.</p>

      <h3>🧮 Корреляция Спирмена — альтернатива для нелинейных связей</h3>
      <p><span class="term" data-tip="Spearman's rank correlation. Корреляция Пирсона, применённая к рангам данных, а не к самим значениям. Ловит любые монотонные связи, устойчива к выбросам.">Корреляция Спирмена</span> $\\rho$ — это корреляция Пирсона, применённая не к самим значениям, а к их <b>рангам</b> (порядковым номерам в отсортированной выборке).</p>
      <p>Она ловит <b>любые монотонные</b> связи — не только линейные. Если X растёт → Y растёт (неважно, линейно или экспоненциально), Спирмен будет близок к 1.</p>
      <p><b>Плюс Спирмена:</b> устойчив к выбросам (ранги не меняются от одной экстремальной точки).</p>

      <div class="callout warn">⚠️ <b>Корреляция ≠ причинность.</b> Это святое правило статистики. Даже если две переменные идеально коррелируют, одна необязательно <b>вызывает</b> другую. Это могут быть:
        <ul>
          <li>Общая причина (жара → и мороженое, и утопления).</li>
          <li>Обратная причинность (не A вызывает B, а B вызывает A).</li>
          <li>Случайное совпадение (при большом числе сравнений).</li>
        </ul>
      </div>

      <h3>📐 Коэффициент детерминации r²</h3>
      <p>Квадрат корреляции — $r^2$ — показывает <b>долю объяснённой дисперсии</b>. Если $r = 0.8$, то $r^2 = 0.64$: 64% вариации Y объясняется через X (при линейной модели).</p>

      <h3>🔬 Значимость корреляции</h3>
      <p>Даже в несвязанных данных выборочная $r$ почти никогда не равна нулю точно. Чтобы оценить, значима ли наблюдаемая корреляция, считают её <b>p-value</b>. Формула:</p>
      <div class="math-block">$$t = \\frac{r\\sqrt{n-2}}{\\sqrt{1-r^2}}$$</div>
      <p>При больших n даже очень маленькая $r$ (0.05) может быть «статистически значимой», но практически неинтересной.</p>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«r = 0 значит независимость»</b> — нет. Только линейная независимость. Может быть сильная нелинейная связь.</li>
        <li><b>«Высокая корреляция = причинность»</b> — не обязательно. Нужны эксперименты или причинно-следственный анализ.</li>
        <li><b>«r = 0.5 значит в 2 раза слабее, чем r = 1.0»</b> — нет. r² = 0.25, то есть 25% объяснённой дисперсии против 100%. Разница в 4 раза.</li>
        <li><b>«Усредняем корреляции между парами»</b> — нельзя. Используют преобразование Фишера ($z = \\frac{1}{2}\\ln\\frac{1+r}{1-r}$) и усредняют уже z.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: парадокс Симпсона</summary>
        <div class="deep-dive-body">
          <p>Иногда корреляция <b>меняет знак</b> при разбивке на группы. Классический пример: в общей выборке курение коррелирует с низкой смертностью. Но внутри возрастных групп — с высокой! Парадокс объясняется тем, что курильщики в выборке были в среднем моложе.</p>
          <p>Это парадокс Симпсона — причина, по которой простая корреляция может обманывать. Решение: <span class="term" data-tip="Частная корреляция. Корреляция между X и Y после устранения влияния других переменных Z. Показывает 'чистую' связь.">частная корреляция</span> или явное моделирование.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: ограничения Пирсона</summary>
        <div class="deep-dive-body">
          <p>Пирсон чувствителен к:</p>
          <ul>
            <li><b>Выбросам.</b> Одна экстремальная точка может сдвинуть r с 0 до 0.7.</li>
            <li><b>Нелинейности.</b> Синусоида на полном периоде даст r ≈ 0.</li>
            <li><b>Ограничению диапазона.</b> Если смотреть на X только в узком окне, корреляция может существенно отличаться от полной.</li>
            <li><b>Гетероскедастичности.</b> Неравномерный разброс Y в зависимости от X.</li>
          </ul>
          <p>Альтернативы для сложных случаев: distance correlation, mutual information, MIC (maximal information coefficient).</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Линейная регрессия</b> — r² это тот же коэффициент детерминации.</li>
        <li><b>Feature selection</b> — корреляция с таргетом часто первый фильтр признаков.</li>
        <li><b>Мультиколлинеарность</b> — высокая корреляция между признаками ухудшает модели.</li>
        <li><b>PCA</b> — работает с ковариационной матрицей.</li>
        <li><b>EDA</b> — correlation heatmap — стандартный первый шаг анализа.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Рост и вес: пошаговый расчёт r',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Измерили рост и вес 6 человек. Насколько сильна линейная связь?</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Человек</th><th>Алиса</th><th>Борис</th><th>Вика</th><th>Глеб</th><th>Даша</th><th>Егор</th></tr>
              <tr><td><b>Рост (см)</b></td><td>158</td><td>165</td><td>170</td><td>175</td><td>180</td><td>182</td></tr>
              <tr><td><b>Вес (кг)</b></td><td>52</td><td>60</td><td>65</td><td>72</td><td>78</td><td>83</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Считаем средние</h4>
            <div class="calc">x̄ = (158+165+170+175+180+182) / 6 = 1030/6 = <b>171.67</b>
ȳ = (52+60+65+72+78+83) / 6 = 410/6 = <b>68.33</b></div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем отклонения от средних</h4>
            <div class="example-data-table">
              <table>
                <tr><th></th><th>Алиса</th><th>Борис</th><th>Вика</th><th>Глеб</th><th>Даша</th><th>Егор</th></tr>
                <tr><td><b>x−x̄</b></td><td>−13.67</td><td>−6.67</td><td>−1.67</td><td>3.33</td><td>8.33</td><td>10.33</td></tr>
                <tr><td><b>y−ȳ</b></td><td>−16.33</td><td>−8.33</td><td>−3.33</td><td>3.67</td><td>9.67</td><td>14.67</td></tr>
              </table>
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем ковариацию</h4>
            <p>Перемножаем отклонения попарно и усредняем:</p>
            <div class="calc">(x−x̄)(y−ȳ):
  (−13.67)(−16.33) = 223.3
  (−6.67)(−8.33)   = 55.5
  (−1.67)(−3.33)   = 5.6
  (3.33)(3.67)     = 12.2
  (8.33)(9.67)     = 80.6
  (10.33)(14.67)   = 151.6

Сумма = 529.0

Cov(x,y) = 529.0 / (6−1) = <b>105.8</b></div>
            <div class="why">Ковариация положительная → когда рост выше среднего, вес тоже обычно выше среднего. Точки «ходят вместе». Но число 105.8 сложно интерпретировать — зависит от единиц.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Считаем стандартные отклонения</h4>
            <div class="calc">(x−x̄)²: 186.7, 44.5, 2.8, 11.1, 69.4, 106.7 → сумма = 421.2
s_x = √(421.2/5) = √84.24 = <b>9.18</b>

(y−ȳ)²: 266.7, 69.4, 11.1, 13.5, 93.5, 215.2 → сумма = 669.3
s_y = √(669.3/5) = √133.87 = <b>11.57</b></div>
          </div>

          <div class="step" data-step="5">
            <h4>Считаем корреляцию Пирсона</h4>
            <div class="calc">r = Cov(x,y) / (s_x · s_y)
  = 105.8 / (9.18 × 11.57)
  = 105.8 / 106.2
  = <b>0.996</b></div>
            <p>r ≈ 0.996 — <b>почти идеальная</b> положительная линейная связь. Точки практически лежат на прямой.</p>
          </div>

          <div class="step" data-step="6">
            <h4>Что значит r² (коэффициент детерминации)</h4>
            <div class="calc">r² = 0.996² = <b>0.992</b></div>
            <p><b>99.2%</b> вариации веса объясняется ростом через линейную модель. Только 0.8% — что-то другое.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>r = <b>0.996</b> — почти идеальная линейная связь. r² = 0.992 — 99% вариации объяснено. Рост и вес очень сильно коррелируют.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Scatter: рост (см) vs вес (кг), r=0.996</text>
              <!-- axes -->
              <line x1="60" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="60" y1="130" x2="60" y2="20" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Data: (158,52),(165,60),(170,65),(175,72),(180,78),(182,83) -->
              <!-- x: 158..182 range=24, map to x=60..430, scale=370/24=15.4px/cm, x=60+(h-158)*15.4 -->
              <!-- y: 52..83 range=31, map to y=130..20, scale=110/31=3.55px/kg, y=130-(w-52)*3.55 -->
              <!-- (158,52)→(60,130) (165,60)→(168,101) (170,65)→(245,83) (175,72)→(322,65)... wait, need to re-scale -->
              <!-- Let's map x 155..185=30 → 60..420=360px, scale=12px/cm; y 48..87=39 → 20..130=110px, scale=2.82/kg -->
              <!-- x=60+(h-155)*12, y=130-(w-48)*2.82 -->
              <!-- (158,52)→(96,118.7) (165,60)→(180,95.6) (170,65)→(240,81.5) (175,72)→(300,61.7) (180,78)→(360,44.8) (182,83)→(384,29.7) -->
              <!-- dots -->
              <circle cx="96"  cy="119" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="180" cy="96"  r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="240" cy="82"  r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="300" cy="62"  r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="360" cy="45"  r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="384" cy="30"  r="6" fill="#3b82f6" opacity="0.85"/>
              <!-- fitted line (nearly through all points, from ~(60,140) to (420,17)) -->
              <line x1="70" y1="135" x2="400" y2="24" stroke="#ef4444" stroke-width="2" opacity="0.75"/>
              <!-- axis labels -->
              <text x="60"  y="145" text-anchor="middle" font-size="9" fill="#64748b">155</text>
              <text x="240" y="145" text-anchor="middle" font-size="9" fill="#64748b">170</text>
              <text x="420" y="145" text-anchor="middle" font-size="9" fill="#64748b">185</text>
              <text x="230" y="158" text-anchor="middle" font-size="10" fill="#64748b">Рост (см)</text>
              <text x="48" y="130" text-anchor="end" font-size="9" fill="#64748b">52</text>
              <text x="48" y="45"  text-anchor="end" font-size="9" fill="#64748b">83</text>
              <text x="20" y="80" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,20,80)">Вес (кг)</text>
              <!-- r annotation -->
              <text x="340" y="120" font-size="11" font-weight="700" fill="#ef4444">r = 0.996</text>
            </svg>
            <div class="caption">Scatter plot роста и веса 6 человек. Точки почти идеально лежат на красной линии регрессии. Корреляция Пирсона r≈0.996 — почти идеальная положительная линейная связь.</div>
          </div>

          <div class="lesson-box">Корреляция Пирсона считается в 5 шагов: средние → отклонения → ковариация → std → деление. Диапазон [-1, 1], знак показывает направление, модуль — силу.</div>
        `
      },
      {
        title: 'Пирсон не ловит нелинейное',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Температура влияет на продажи мороженого. Но связь не линейная: при очень жаркой погоде люди остаются дома. Данные за 7 дней:</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>День</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
              <tr><td><b>Темп. (°C)</b></td><td>15</td><td>20</td><td>25</td><td>30</td><td>35</td><td>40</td><td>45</td></tr>
              <tr><td><b>Продажи (шт)</b></td><td>20</td><td>50</td><td>90</td><td>100</td><td>85</td><td>40</td><td>10</td></tr>
            </table>
          </div>
          <p>Глазами видно: продажи сначала растут, потом падают. Форма перевёрнутой U.</p>

          <div class="step" data-step="1">
            <h4>Считаем корреляцию Пирсона</h4>
            <div class="calc">x̄ = 30, ȳ ≈ 56.4

(x−x̄):  −15, −10, −5, 0, 5, 10, 15
(y−ȳ): −36.4, −6.4, 33.6, 43.6, 28.6, −16.4, −46.4

Σ(x−x̄)(y−ȳ) = 546 + 64 − 168 + 0 + 143 − 164 − 696 = <b>−275</b>

r = −275 / (√700 × √7617.7) ≈ −275 / 2309 ≈ <b>−0.12</b></div>
            <p>r ≈ −0.12. Пирсон говорит: «почти нет связи». Но мы же <b>видим</b> явную зависимость!</p>
          </div>

          <div class="step" data-step="2">
            <h4>Почему Пирсон обманул</h4>
            <p>Корреляция Пирсона ищет <b>линейную</b> связь — прямую. Здесь связь <b>квадратичная</b> (парабола). Положительные отклонения слева и отрицательные справа «компенсируют» друг друга.</p>
            <div class="why">Пирсон = 0 не означает «нет связи». Означает «нет линейной связи». Нелинейная может быть очень сильной.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Что делать: корреляция Спирмена</h4>
            <p>Спирмен работает с рангами, а не значениями:</p>
            <div class="calc">Ранги температуры: 1, 2, 3, 4, 5, 6, 7
Ранги продаж:      1, 3, 5, 7, 6, 4, 2  (нет чёткого монотонного тренда)

ρ_Спирмен ≈ 0.0 — тоже не ловит, потому что связь НЕ монотонная</div>
            <p>Даже Спирмен не помогает. Потому что связь <b>не монотонная</b> (сначала вверх, потом вниз).</p>
          </div>

          <div class="step" data-step="4">
            <h4>Единственный выход — визуализация</h4>
            <p>Scatter plot мгновенно покажет перевёрнутую U. Отсюда правило: <b>всегда</b> смотри на график, прежде чем доверять числам корреляции.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>r Пирсона = <b>−0.12</b> (почти ноль), но связь <b>очень сильная</b> — нелинейная (парабола). Корреляция Пирсона в этом случае бесполезна.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Нелинейная связь: r≈−0.12, но зависимость очевидна</text>
              <!-- axes -->
              <line x1="50" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="50" y1="130" x2="50" y2="20" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Data: temp 15,20,25,30,35,40,45 → x=50+(t-15)*380/30=50+(t-15)*12.67 -->
              <!-- sales 20,50,90,100,85,40,10 → y=130-(s/100)*110 -->
              <!-- (15,20)→(50,108) (20,50)→(113,75) (25,90)→(177,31) (30,100)→(240,20) (35,85)→(304,37) (40,40)→(367,86) (45,10)→(430,119) -->
              <circle cx="50"  cy="108" r="7" fill="#3b82f6" opacity="0.85"/>
              <circle cx="113" cy="75"  r="7" fill="#3b82f6" opacity="0.85"/>
              <circle cx="177" cy="31"  r="7" fill="#3b82f6" opacity="0.85"/>
              <circle cx="240" cy="20"  r="7" fill="#3b82f6" opacity="0.85"/>
              <circle cx="304" cy="37"  r="7" fill="#3b82f6" opacity="0.85"/>
              <circle cx="367" cy="86"  r="7" fill="#3b82f6" opacity="0.85"/>
              <circle cx="430" cy="119" r="7" fill="#3b82f6" opacity="0.85"/>
              <!-- inverted-U curve (parabola) -->
              <path d="M50,108 C80,85 110,55 145,34 C175,17 205,14 240,16 C270,18 300,28 335,54 C368,78 395,100 430,119" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="6,3"/>
              <!-- axis labels -->
              <text x="50"  y="145" text-anchor="middle" font-size="9" fill="#64748b">15°</text>
              <text x="240" y="145" text-anchor="middle" font-size="9" fill="#64748b">30°</text>
              <text x="430" y="145" text-anchor="middle" font-size="9" fill="#64748b">45°C</text>
              <text x="240" y="158" text-anchor="middle" font-size="10" fill="#64748b">Температура</text>
              <text x="18" y="80" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,18,80)">Продажи</text>
              <!-- r annotation -->
              <text x="320" y="70" font-size="10" fill="#64748b">r Пирсона</text>
              <text x="320" y="84" font-size="12" font-weight="700" fill="#ef4444">≈ −0.12</text>
              <text x="320" y="98" font-size="9" fill="#ef4444">(≈ «нет связи»?)</text>
              <!-- parabola label -->
              <text x="240" y="10" text-anchor="middle" font-size="9" fill="#059669">реальная кривая — перевёрнутая U</text>
            </svg>
            <div class="caption">Несмотря на очевидную квадратичную зависимость (продажи растут до 30°C, потом падают), r Пирсона ≈ −0.12 — «почти ноль». Пирсон видит только линейный тренд; здесь его нет из-за симметрии кривой.</div>
          </div>

          <div class="lesson-box">r = 0 не означает «нет связи». Это означает «нет ЛИНЕЙНОЙ связи». Визуализируй данные перед тем, как доверять числам. Если связь нелинейная — нужны другие инструменты (distance correlation, mutual information).</div>
        `
      },
      {
        title: 'Корреляция ≠ причинность',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Маркетолог нашёл данные за 12 месяцев и обнаружил: продажи мороженого и количество утоплений сильно коррелируют (r = 0.87). Можно ли заключить, что мороженое вызывает утопления?</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Месяц</th><th>Янв</th><th>Фев</th><th>Мар</th><th>Апр</th><th>Май</th><th>Июн</th><th>Июл</th><th>Авг</th><th>Сен</th><th>Окт</th><th>Ноя</th><th>Дек</th></tr>
              <tr><td><b>Мороженое (тыс. шт)</b></td><td>5</td><td>6</td><td>10</td><td>20</td><td>40</td><td>70</td><td>90</td><td>85</td><td>50</td><td>20</td><td>8</td><td>5</td></tr>
              <tr><td><b>Утопления</b></td><td>2</td><td>1</td><td>3</td><td>5</td><td>12</td><td>25</td><td>35</td><td>30</td><td>15</td><td>6</td><td>3</td><td>2</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Проверяем корреляцию</h4>
            <p>r ≈ 0.87 — сильная положительная связь. Месяцы с высокими продажами мороженого действительно имеют больше утоплений.</p>
          </div>

          <div class="step" data-step="2">
            <h4>Анализируем причинную цепочку</h4>
            <p>Три возможных объяснения любой корреляции:</p>
            <ul>
              <li><b>A → B:</b> мороженое вызывает утопления. Абсурдно.</li>
              <li><b>B → A:</b> утопления повышают продажи мороженого. Ещё абсурднее.</li>
              <li><b>C → A и C → B:</b> общая причина (confound). <b>Жара!</b></li>
            </ul>
            <div class="why">Жара — общая третья переменная (confounder). В жару больше мороженого (охлаждение) и больше утоплений (люди купаются). Мороженое не виновато — виновата температура.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Как отличить корреляцию от причинности</h4>
            <ul>
              <li><b>Рандомизированный эксперимент:</b> единственный надёжный способ. Случайно дать одним людям мороженое, другим нет. Посмотреть на утопления.</li>
              <li><b>Контроль за confounders:</b> считаем частную корреляцию, контролируя температуру. Если r(мороженое, утопления | температура) ≈ 0 — связь ложная.</li>
              <li><b>Временной порядок:</b> причина должна предшествовать следствию.</li>
              <li><b>Механизм:</b> есть ли правдоподобный механизм?</li>
              <li><b>Доза-ответ:</b> больше причины → больше следствия (через механизм)?</li>
            </ul>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Корреляция r = 0.87 <b>реальная</b>, но причинная связь <b>ложная</b>. Обе переменные зависят от третьей — температуры (confounding variable).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Общая причина (confounder): жара объясняет оба явления</text>
              <!-- Top node: Temperature (confounder) -->
              <ellipse cx="230" cy="50" rx="60" ry="22" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="2"/>
              <text x="230" y="47" text-anchor="middle" font-size="11" font-weight="600" fill="#92400e">Температура</text>
              <text x="230" y="62" text-anchor="middle" font-size="9" fill="#92400e">(конфаундер)</text>
              <!-- Left node: Ice cream -->
              <ellipse cx="100" cy="130" rx="60" ry="22" fill="#3b82f6" fill-opacity="0.18" stroke="#3b82f6" stroke-width="2"/>
              <text x="100" y="127" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Мороженое</text>
              <text x="100" y="142" text-anchor="middle" font-size="9" fill="#1e40af">↑ в жару</text>
              <!-- Right node: Drownings -->
              <ellipse cx="360" cy="130" rx="60" ry="22" fill="#ef4444" fill-opacity="0.18" stroke="#ef4444" stroke-width="2"/>
              <text x="360" y="127" text-anchor="middle" font-size="11" font-weight="600" fill="#991b1b">Утопления</text>
              <text x="360" y="142" text-anchor="middle" font-size="9" fill="#991b1b">↑ в жару</text>
              <!-- Arrows from temperature to both -->
              <line x1="185" y1="65" x2="145" y2="110" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrY)"/>
              <line x1="275" y1="65" x2="315" y2="110" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#arrY)"/>
              <defs><marker id="arrY" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#f59e0b"/></marker></defs>
              <!-- Spurious correlation line between ice cream and drownings (dashed red) -->
              <line x1="162" y1="130" x2="298" y2="130" stroke="#ef4444" stroke-width="2" stroke-dasharray="7,4"/>
              <text x="230" y="120" text-anchor="middle" font-size="10" font-weight="600" fill="#ef4444">r=0.87</text>
              <text x="230" y="155" text-anchor="middle" font-size="9" fill="#ef4444">ложная корреляция (не причинность!)</text>
            </svg>
            <div class="caption">Граф причинности: жара (конфаундер, янтарный) вызывает рост как продаж мороженого, так и числа утоплений. Красная пунктирная линия — ложная корреляция r=0.87, которая исчезает при контроле за температурой.</div>
          </div>

          <div class="lesson-box">«Correlation does not imply causation» — одно из важнейших правил статистики. Для причинно-следственных выводов нужны эксперименты (рандомизация) или методы causal inference (instrumental variables, difference-in-differences, DAGs).</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: управляй корреляцией</h3>
        <p>Меняй истинную корреляцию ρ и количество точек. Наблюдай scatter и смотри на выборочный r.</p>
        <div class="sim-container">
          <div class="sim-controls" id="corr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="corr-regen">🔄 Перегенерировать</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="corr-chart"></canvas></div>
            <div class="sim-stats" id="corr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#corr-controls');
        const cRho = App.makeControl('range', 'corr-rho', 'Истинная ρ', { min: -1, max: 1, step: 0.05, value: 0.7 });
        const cN = App.makeControl('range', 'corr-n', 'Число точек', { min: 10, max: 500, step: 10, value: 100 });
        const cNoise = App.makeControl('range', 'corr-noise', 'Выбросов', { min: 0, max: 10, step: 1, value: 0 });
        [cRho, cN, cNoise].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;

        function run() {
          const rho = +cRho.input.value;
          const n = +cN.input.value;
          const nOut = +cNoise.input.value;

          // Генерим двумерное нормальное с заданной корреляцией
          const xs = [], ys = [];
          for (let i = 0; i < n; i++) {
            const z1 = App.Util.randn();
            const z2 = App.Util.randn();
            const x = z1;
            const y = rho * z1 + Math.sqrt(1 - rho * rho) * z2;
            xs.push(x);
            ys.push(y);
          }
          // добавим выбросы
          for (let i = 0; i < nOut; i++) {
            xs.push((Math.random() - 0.5) * 8);
            ys.push((Math.random() - 0.5) * 8);
          }

          // Выборочный r
          const mx = App.Util.mean(xs), my = App.Util.mean(ys);
          let cov = 0, sx = 0, sy = 0;
          for (let i = 0; i < xs.length; i++) {
            cov += (xs[i] - mx) * (ys[i] - my);
            sx += (xs[i] - mx) ** 2;
            sy += (ys[i] - my) ** 2;
          }
          const r = cov / Math.sqrt(sx * sy);
          const covVal = cov / (xs.length - 1);

          const ctx = container.querySelector('#corr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [{
                data: xs.map((x, i) => ({ x, y: ys[i] })),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 0.9)',
                pointRadius: 4,
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { title: { display: true, text: 'X' }, min: -4, max: 4 },
                y: { title: { display: true, text: 'Y' }, min: -4, max: 4 },
              },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#corr-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Истинная ρ', rho.toFixed(2)],
            ['Выборочный r', r.toFixed(3)],
            ['Ковариация', covVal.toFixed(3)],
            ['r² (объяснённая дисперсия)', (r * r).toFixed(3)],
            ['n', xs.length],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [cRho, cN, cNoise].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#corr-regen').onclick = run;
        run();
      },
    },

    python: `
      <h3>📊 Корреляция в NumPy и SciPy</h3>
      <pre><code>import numpy as np
from scipy import stats

# Данные: рост и вес
height = np.array([160, 165, 170, 175, 180, 185, 190])
weight = np.array([55, 62, 68, 72, 78, 85, 92])

# Пирсон (линейная зависимость)
r_pearson, p_pearson = stats.pearsonr(height, weight)
print(f"Пирсон:  r={r_pearson:.4f}, p={p_pearson:.4f}")

# Спирмен (монотонная зависимость)
r_spearman, p_spearman = stats.spearmanr(height, weight)
print(f"Спирмен: r={r_spearman:.4f}, p={p_spearman:.4f}")

# Кендалл (ранговая)
r_kendall, p_kendall = stats.kendalltau(height, weight)
print(f"Кендалл: τ={r_kendall:.4f}, p={p_kendall:.4f}")

# Матрица корреляций через NumPy
corr_matrix = np.corrcoef(height, weight)
print(f"\\nМатрица корреляций:\\n{corr_matrix.round(4)}")</code></pre>

      <h3>📈 Scatter plot + линия тренда</h3>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

height = np.array([160, 165, 170, 175, 180, 185, 190])
weight = np.array([55, 62, 68, 72, 78, 85, 92])

# Линия регрессии
slope, intercept, r, p, se = stats.linregress(height, weight)
x_line = np.linspace(155, 195, 100)
y_line = slope * x_line + intercept

plt.scatter(height, weight, s=80, zorder=3)
plt.plot(x_line, y_line, 'r--', label=f'y={slope:.1f}x+{intercept:.0f}, r={r:.3f}')
plt.xlabel("Рост (см)")
plt.ylabel("Вес (кг)")
plt.title("Корреляция: рост vs вес")
plt.legend()
plt.grid(alpha=0.3)
plt.show()</code></pre>

      <h3>🔍 Корреляционная матрица в Pandas</h3>
      <pre><code>import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.DataFrame({
    'Рост': [160, 165, 170, 175, 180, 185, 190],
    'Вес':  [55, 62, 68, 72, 78, 85, 92],
    'Возраст': [22, 25, 30, 28, 35, 40, 45]
})

corr = df.corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', vmin=-1, vmax=1)
plt.title("Матрица корреляций")
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Feature selection</b> — отбор признаков с высокой связью с таргетом.</li>
        <li><b>Multicollinearity detection</b> — признаки с |r| > 0.9 часто избыточны.</li>
        <li><b>Портфельный анализ</b> — корреляция активов для диверсификации.</li>
        <li><b>Рекомендательные системы</b> — similarity по Пирсону.</li>
        <li><b>EDA</b> — heatmap корреляций как быстрый обзор связей в данных.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Простая интерпретация по шкале [-1, 1]</li>
            <li>Быстро считается</li>
            <li>Не зависит от единиц</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Ловит только линейные связи (Пирсон)</li>
            <li>Чувствительна к выбросам</li>
            <li>Не показывает причинность</li>
            <li>Может вводить в заблуждение при смешанных группах (парадокс Симпсона)</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Формулы</h3>

      <h4>Ковариация</h4>
      <div class="math-block">$$\\mathrm{Cov}(X, Y) = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})$$</div>

      <h4>Корреляция Пирсона</h4>
      <div class="math-block">$$r = \\frac{\\mathrm{Cov}(X, Y)}{s_x \\cdot s_y} = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}$$</div>

      <h4>Корреляция Спирмена</h4>
      <div class="math-block">$$\\rho_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$$</div>
      <p>где $d_i$ — разность рангов. Устойчива к выбросам, ловит монотонные нелинейные связи.</p>

      <h4>Значимость корреляции</h4>
      <p>Для проверки $H_0: r = 0$:</p>
      <div class="math-block">$$t = \\frac{r \\sqrt{n-2}}{\\sqrt{1 - r^2}}, \\quad \\text{df} = n - 2$$</div>
    `,

    extra: `
      <h3>Парадокс Симпсона</h3>
      <p>Связь может менять знак при группировке. Пример: внутри каждого возраста курение не связано со здоровьем, но в целом связано — потому что курильщики в среднем старше.</p>

      <h3>Автокорреляция</h3>
      <p>Корреляция ряда с его сдвигом: $\\mathrm{Corr}(X_t, X_{t-k})$. Основа ARIMA и анализа временных рядов.</p>

      <h3>Частная (partial) корреляция</h3>
      <p>Связь X и Y <b>после</b> учёта других переменных Z. Убирает confounding.</p>

      <h3>Альтернативы для нелинейных связей</h3>
      <ul>
        <li><b>Distance correlation</b> — = 0 тогда и только тогда, когда X и Y независимы.</li>
        <li><b>Mutual information</b> — теоретико-информационная мера зависимости.</li>
        <li><b>MIC</b> — максимальная информационная корреляция.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=xZ_z8KWkhXE" target="_blank">StatQuest: Correlation and Covariance</a> — корреляция и ковариация: разница и применение</li>
        <li><a href="https://www.youtube.com/watch?v=Ypgo4qUBt5o" target="_blank">StatQuest: Spearman's Rank Correlation</a> — ранговая корреляция Спирмена</li>
        <li><a href="https://www.khanacademy.org/math/ap-statistics/bivariate-data-ap/correlation-coefficient-r/v/calculating-correlation-coefficient-r" target="_blank">Khan Academy: Correlation coefficient</a> — вычисление и интерпретация коэффициента корреляции</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BA%D0%BE%D1%80%D1%80%D0%B5%D0%BB%D1%8F%D1%86%D0%B8%D1%8F%20%D0%9F%D0%B8%D1%80%D1%81%D0%BE%D0%BD%D0%B0%20%D0%A1%D0%BF%D0%B8%D1%80%D0%BC%D0%B5%D0%BD%D0%B0" target="_blank">Habr: корреляция</a> — статьи о корреляционном анализе на Хабре</li>
        <li><a href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient" target="_blank">Wikipedia: Pearson correlation coefficient</a> — формула, свойства и ограничения корреляции Пирсона</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://numpy.org/doc/stable/reference/generated/numpy.corrcoef.html" target="_blank">NumPy: numpy.corrcoef</a> — матрица корреляций для нескольких переменных</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html" target="_blank">SciPy: scipy.stats.spearmanr</a> — ранговая корреляция Спирмена с p-value</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.kendalltau.html" target="_blank">SciPy: scipy.stats.kendalltau</a> — корреляция Кендалла</li>
      </ul>
    `,
  },
});
