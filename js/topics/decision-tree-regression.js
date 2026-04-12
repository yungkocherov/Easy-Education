/* ==========================================================================
   Дерево решений для регрессии
   ========================================================================== */
App.registerTopic({
  id: 'decision-tree-reg',
  category: 'ml-reg',
  title: 'Дерево решений для регрессии',
  summary: 'Разбиваем пространство на прямоугольники, в каждом предсказываем среднее.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты оценщик недвижимости. Тебя просят назвать цену квартиры. Ты рассуждаешь: «Площадь больше 80 м²? Да — скорее всего дорогая. Больше 120 м²? Да — элитная.» Ты делишь весь рынок на несколько <b>ценовых сегментов</b> через последовательные вопросы.</p>
        <p>Дерево регрессии делает то же самое: рекурсивно делит пространство признаков на прямоугольные <b>регионы</b>. В каждом регионе предсказывает <b>среднее значение y</b> всех обучающих примеров, попавших в этот регион.</p>
        <p>Критически: дерево регрессии <b>не рисует прямую линию</b>. Оно строит ступенчатую, кусочно-постоянную аппроксимацию. Это мощно для нелинейных зависимостей, но плохо для экстраполяции — за пределами обучающих данных дерево просто «застывает».</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 235" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <text x="260" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Дерево регрессии: разбиение пространства</text>
          <!-- Left panel: tree structure -->
          <rect x="10" y="25" width="250" height="185" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="135" y="42" text-anchor="middle" font-size="10" font-weight="600" fill="#475569">Структура дерева</text>
          <!-- Root node -->
          <rect x="60" y="50" width="130" height="28" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="125" y="68" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">Площадь ≤ 70 м²?</text>
          <!-- Branches -->
          <line x1="95" y1="78" x2="60" y2="105" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="68" y="96" font-size="9" fill="#10b981">да</text>
          <line x1="155" y1="78" x2="190" y2="105" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="175" y="96" font-size="9" fill="#ef4444">нет</text>
          <!-- Left subtree -->
          <rect x="20" y="105" width="90" height="28" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="65" y="123" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">Этаж ≤ 5?</text>
          <line x1="45" y1="133" x2="30" y2="155" stroke="#94a3b8" stroke-width="1.3"/>
          <text x="30" y="148" font-size="9" fill="#10b981">да</text>
          <line x1="85" y1="133" x2="100" y2="155" stroke="#94a3b8" stroke-width="1.3"/>
          <text x="93" y="148" font-size="9" fill="#ef4444">нет</text>
          <rect x="8" y="155" width="55" height="24" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="35" y="171" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">7.2 млн</text>
          <rect x="73" y="155" width="55" height="24" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="100" y="171" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">8.8 млн</text>
          <!-- Right subtree -->
          <rect x="148" y="105" width="90" height="28" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="193" y="123" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">Пл. ≤ 100?</text>
          <line x1="168" y1="133" x2="153" y2="155" stroke="#94a3b8" stroke-width="1.3"/>
          <text x="152" y="148" font-size="9" fill="#10b981">да</text>
          <line x1="218" y1="133" x2="228" y2="155" stroke="#94a3b8" stroke-width="1.3"/>
          <text x="220" y="148" font-size="9" fill="#ef4444">нет</text>
          <rect x="128" y="155" width="55" height="24" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="155" y="171" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">12.4 млн</text>
          <rect x="203" y="155" width="55" height="24" rx="5" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="230" y="171" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">18.1 млн</text>
          <text x="125" y="205" text-anchor="middle" font-size="9" fill="#64748b">Листья = среднее y в регионе</text>
          <!-- Right panel: scatter + steps -->
          <rect x="265" y="25" width="245" height="185" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="387" y="42" text-anchor="middle" font-size="10" font-weight="600" fill="#475569">Ступенчатая аппроксимация</text>
          <!-- Axes -->
          <line x1="280" y1="50" x2="280" y2="190" stroke="#64748b" stroke-width="1.2"/>
          <line x1="280" y1="190" x2="500" y2="190" stroke="#64748b" stroke-width="1.2"/>
          <text x="390" y="205" text-anchor="middle" font-size="9" fill="#64748b">Площадь (м²)</text>
          <text x="270" y="120" text-anchor="middle" font-size="9" fill="#64748b" transform="rotate(-90,270,120)">Цена</text>
          <!-- Points scattered -->
          <circle cx="295" cy="175" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="305" cy="168" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="315" cy="160" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="330" cy="155" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="345" cy="145" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="360" cy="138" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="375" cy="118" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="390" cy="108" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="405" cy="95" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="420" cy="82" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="440" cy="68" r="4" fill="#6366f1" opacity="0.8"/>
          <circle cx="460" cy="58" r="4" fill="#6366f1" opacity="0.8"/>
          <!-- Step function (tree predictions) -->
          <line x1="280" y1="168" x2="350" y2="168" stroke="#ef4444" stroke-width="2"/>
          <line x1="350" y1="168" x2="350" y2="142" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
          <line x1="350" y1="142" x2="395" y2="142" stroke="#ef4444" stroke-width="2"/>
          <line x1="395" y1="142" x2="395" y2="92" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,3"/>
          <line x1="395" y1="92" x2="500" y2="92" stroke="#ef4444" stroke-width="2"/>
          <!-- X labels -->
          <text x="350" y="200" text-anchor="middle" font-size="8" fill="#94a3b8">70</text>
          <text x="395" y="200" text-anchor="middle" font-size="8" fill="#94a3b8">100</text>
          <!-- Split lines -->
          <line x1="350" y1="50" x2="350" y2="190" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4,4" opacity="0.6"/>
          <line x1="395" y1="50" x2="395" y2="190" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4,4" opacity="0.6"/>
          <!-- Legend -->
          <circle cx="292" cy="210" r="4" fill="#6366f1"/>
          <text x="300" y="213" font-size="9" fill="#334155">данные</text>
          <line x1="345" y1="210" x2="360" y2="210" stroke="#ef4444" stroke-width="2"/>
          <text x="365" y="213" font-size="9" fill="#334155">предсказание дерева</text>
        </svg>
        <div class="caption">Дерево регрессии делит ось площади на 3 региона (до 70, 70-100, после 100 м²). В каждом предсказывает среднее — получается ступенчатая аппроксимация. За пределами обучения кривая «застывает» на константе.</div>
      </div>

      <h3>💡 Идея алгоритма</h3>
      <p>Дерево регрессии рекурсивно делит пространство признаков на прямоугольные регионы $R_1, R_2, \\ldots, R_J$. В каждом регионе предсказывает <b>среднее значение</b> y всех обучающих примеров в этом регионе:</p>

      <div class="math-block">$$\\hat{y}(x) = \\bar{y}_{R_j}, \\quad \\text{если } x \\in R_j$$</div>

      <div class="key-concept">
        <div class="kc-label">Ключевое отличие регрессии от классификации</div>
        <p>В классификации лист предсказывает <b>моду</b> (самый частый класс). В регрессии лист предсказывает <b>среднее</b> значения целевой переменной. Критерий разбиения тоже меняется: не <a class="glossary-link" onclick="App.selectTopic('glossary-entropy')">Gini</a> / Entropy, а <b><a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a></b> (среднеквадратичная ошибка).</p>
      </div>

      <h3>🔪 Критерий разбиения: MSE</h3>
      <p>На каждом шаге алгоритм перебирает все признаки j и все пороги t, выбирая то разбиение, которое <b>максимально снижает MSE</b>:</p>

      <div class="math-block">$$\\text{MSE}_{split} = \\frac{n_L}{n} \\cdot \\text{MSE}_L + \\frac{n_R}{n} \\cdot \\text{MSE}_R$$</div>

      <p>где MSE левого и правого поддеревьев:</p>
      <div class="math-block">$$\\text{MSE}_L = \\frac{1}{n_L} \\sum_{i \\in L} (y_i - \\bar{y}_L)^2, \\quad \\text{MSE}_R = \\frac{1}{n_R} \\sum_{i \\in R} (y_i - \\bar{y}_R)^2$$</div>

      <p>Выбираем $(j^*, t^*) = \\arg\\min_{j, t} \\text{MSE}_{split}(j, t)$.</p>

      <h3>⚠️ Экстраполяция: главная слабость</h3>
      <p>Дерево регрессии <b>не умеет экстраполировать</b>. За пределами диапазона обучающих данных оно всегда предсказывает то же значение, что и в крайнем листе. Это принципиальное ограничение: дерево — кусочно-постоянная функция.</p>

      <p><b>Пример:</b> если дерево обучено на квартирах 30-150 м², для 300 м² оно вернёт значение крайнего правого листа — то же, что для 150 м².</p>

      <h3>🛡️ Регуляризация через параметры</h3>
      <ul>
        <li><b>max_depth</b> — максимальная глубина. Обычно 3-6 для регрессии.</li>
        <li><b>min_samples_split</b> — минимальное число точек для разбиения узла.</li>
        <li><b>min_samples_leaf</b> — минимальное число точек в листе.</li>
        <li><b>min_impurity_decrease</b> — разбиваем только если снижение MSE больше порога.</li>
      </ul>

      <h3>🌿 <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MAE</a> вместо MSE</h3>
      <p>Можно использовать MAE как критерий разбиения (<code>criterion='absolute_error'</code>). В этом случае лист предсказывает <b>медиану</b> вместо среднего — более устойчиво к выбросам.</p>

      <div class="deep-dive">
        <summary>Подробнее: как именно считается оптимальное разбиение</summary>
        <div class="deep-dive-body">
          <p>Для каждого признака j алгоритм сортирует точки по j-му признаку и перебирает все возможные пороги t (обычно — серединные значения между соседними уникальными значениями признака). Для каждого t считает MSE разбиения.</p>
          <p>Сложность: O(n·p·log n) на уровень. Sklearn использует оптимизированный алгоритм на Cython.</p>
          <p>При <b>criterion='friedman_mse'</b> используется улучшенная версия Фридмана (1984), которая лучше находит разбиения в высокой размерности.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: почему дерево не может экстраполировать</summary>
        <div class="deep-dive-body">
          <p>Дерево делит входное пространство на конечное число прямоугольников. В каждом прямоугольнике — константа. За пределами наблюдаемых значений признаков дерево может только вернуть значение крайнего листа — оно понятия не имеет, что «за границей».</p>
          <p>Это принципиально отличает дерево от линейной регрессии, которая спокойно экстраполирует (хотя и линейно). Для задач, где нужна экстраполяция, деревья не подходят.</p>
          <p>Random Forest и <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting страдают от той же проблемы — они тоже ансамбли деревьев.</p>
        </div>
      </div>

      <h3>🔗 Связи с другими темами</h3>
      <ul>
        <li><b>Random Forest регрессия</b> — ансамбль деревьев, усредняет предсказания.</li>
        <li><b>Gradient Boosting регрессия</b> — последовательный ансамбль, учится на остатках.</li>
        <li><b>Линейная регрессия</b> — умеет экстраполировать, но только линейно.</li>
        <li><b>Bias-Variance</b> — глубокое дерево: высокая дисперсия. Мелкое: высокое смещение.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Цена от площади: строим дерево',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>8 квартир с ценами. Вручную найти первое оптимальное разбиение по площади (MSE-критерий), построить дерево глубины 2.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>№</th><th>Площадь (м²)</th><th>Цена (млн руб.)</th></tr>
              <tr><td>1</td><td>38</td><td>5.0</td></tr>
              <tr><td>2</td><td>45</td><td>6.2</td></tr>
              <tr><td>3</td><td>52</td><td>7.5</td></tr>
              <tr><td>4</td><td>65</td><td>9.0</td></tr>
              <tr><td>5</td><td>72</td><td>10.5</td></tr>
              <tr><td>6</td><td>85</td><td>12.0</td></tr>
              <tr><td>7</td><td>98</td><td>14.5</td></tr>
              <tr><td>8</td><td>115</td><td>17.0</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: общий MSE до разбиения</h4>
            <div class="calc">
              ȳ = (5.0+6.2+7.5+9.0+10.5+12.0+14.5+17.0)/8 = 81.7/8 = <b>10.21</b><br><br>
              MSE₀ = [(5−10.21)²+(6.2−10.21)²+(7.5−10.21)²+(9−10.21)²<br>
                    +(10.5−10.21)²+(12−10.21)²+(14.5−10.21)²+(17−10.21)²] / 8<br>
              = [27.14+16.08+7.34+1.46+0.08+3.20+18.40+46.08] / 8<br>
              = 119.78 / 8 = <b>14.97</b>
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: перебираем пороги для разбиения</h4>
            <div class="calc">
              Порог t=58.5 (между 52 и 65): L={38,45,52}, R={65,72,85,98,115}<br>
              ȳ_L = (5+6.2+7.5)/3 = 6.23, ȳ_R = (9+10.5+12+14.5+17)/5 = 12.6<br>
              MSE_L = [(5−6.23)²+(6.2−6.23)²+(7.5−6.23)²]/3 = [1.513+0.001+1.613]/3 = 1.042<br>
              MSE_R = [(9−12.6)²+(10.5−12.6)²+(12−12.6)²+(14.5−12.6)²+(17−12.6)²]/5<br>
              = [12.96+4.41+0.36+3.61+19.36]/5 = 40.70/5 = 8.14<br>
              MSE_split(58.5) = (3/8)·1.042 + (5/8)·8.14 = 0.391 + 5.088 = <b>5.48</b><br>
              <br>
              Порог t=78.5 (между 72 и 85): L={38,45,52,65,72}, R={85,98,115}<br>
              ȳ_L = (5+6.2+7.5+9+10.5)/5 = 7.64, ȳ_R = (12+14.5+17)/3 = 14.5<br>
              MSE_L = [(5−7.64)²+(6.2−7.64)²+(7.5−7.64)²+(9−7.64)²+(10.5−7.64)²]/5<br>
              = [6.970+2.074+0.020+1.850+8.180]/5 = 19.092/5 = 3.818<br>
              MSE_R = [(12−14.5)²+(14.5−14.5)²+(17−14.5)²]/3 = [6.25+0+6.25]/3 = 4.167<br>
              MSE_split(78.5) = (5/8)·3.818 + (3/8)·4.167 = 2.386 + 1.563 = <b>3.95</b> ← лучше!
            </div>
            <div class="why">MSE 3.95 &lt; 5.48 — разбиение в t=78.5 лучше. Перебирая все пороги (t=41.5, 48.5, 58.5, 68.5, 78.5, 91.5, 106.5), находим, что t=78.5 даёт минимальный взвешенный MSE ≈ 3.95.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: строим дерево глубины 2</h4>
            <div class="calc">
              Корень: Площадь ≤ 78.5?<br>
              ├─ Да (1-5): {38,45,52,65,72} → лучшее разбиение в t=58.5<br>
              │   ├─ Да (38,45,52): ȳ = (5+6.2+7.5)/3 ≈ <b>6.23 млн</b><br>
              │   └─ Нет (65,72): ȳ = (9+10.5)/2 = <b>9.75 млн</b><br>
              └─ Нет (6-8): {85,98,115} → разбиение в t=91.5<br>
                  ├─ Да (85): ȳ = <b>12.0 млн</b><br>
                  └─ Нет (98,115): ȳ = (14.5+17)/2 = <b>15.75 млн</b>
            </div>
            <div class="why">После 2 уровней разбиений имеем 4 листа — 4 ценовых сегмента. Дерево будет переобучено на таком маленьком датасете.</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: предсказание для новой квартиры 75 м²</h4>
            <div class="calc">
              Площадь 75 м²: 75 ≤ 78.5 → левая ветка<br>
              Площадь 75 м²: 75 > 58.5 → правый лист левой ветки (65, 72)<br>
              ŷ = <b>9.75 млн руб.</b>
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимальное первое разбиение: площадь ≤ 78.5 м² (MSE_split ≈ 3.95 vs 14.97 изначально — снижение на 74%). Для 75 м² предсказание: <b>9.75 млн руб.</b></p>
          </div>
          <div class="lesson-box">
            Алгоритм жадный: каждое разбиение локально оптимально, но глобальный оптимум не гарантирован. Для 8 точек и глубины 2 — очень высокий риск <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a>. На практике используют min_samples_leaf ≥ 5-20.
          </div>
        `,
      },
      {
        title: 'MSE vs MAE критерий',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить MSE и MAE критерии разбиения на датасете с выбросом. Показать, что MAE устойчивее к выбросам.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>x</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
              <tr><th>y</th><td>10</td><td>12</td><td>11</td><td>14</td><td>13</td><td><b>50</b></td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: оба критерия до разбиения</h4>
            <div class="calc">
              ȳ = (10+12+11+14+13+50)/6 = 110/6 ≈ 18.33 (среднее сильно смещено выбросом)<br>
              медиана = (12+13)/2 = 12.5 (устойчива к выбросу)<br><br>
              MSE₀ = [(10−18.33)²+...+(50−18.33)²]/6 ≈ 202.2<br>
              MAE₀ = |10−12.5|+|12−12.5|+|11−12.5|+|14−12.5|+|13−12.5|+|50−12.5| /6<br>
                   = (2.5+0.5+1.5+1.5+0.5+37.5)/6 = 44/6 ≈ 7.33
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: разбиение в t=4.5 (отделяем выброс)</h4>
            <div class="calc">
              L = {x=1,2,3,4,5}: y = {10,12,11,14,13}<br>
              R = {x=6}: y = {50}<br><br>
              MSE-критерий:<br>
              ȳ_L = 12, MSE_L = [(10−12)²+(12−12)²+(11−12)²+(14−12)²+(13−12)²]/5 = [4+0+1+4+1]/5 = 2.0<br>
              MSE_R = 0 (одна точка)<br>
              MSE_split = (5/6)·2.0 + (1/6)·0 = <b>1.67</b> — огромное снижение с 172.9!<br><br>
              MAE-критерий:<br>
              медиана_L = 12, MAE_L = (2+0+1+2+1)/5 = 1.2<br>
              MAE_R = 0<br>
              MAE_split = (5/6)·1.2 + (1/6)·0 = <b>1.0</b>
            </div>
            <div class="why">Оба критерия выбирают это разбиение как оптимальное. Но значения разные: MSE 1.67 vs MAE 1.0. MAE менее чувствителен к выбросу, но вычислительно сложнее.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: что предсказывает лист при MSE vs MAE</h4>
            <div class="calc">
              Левый лист L = {10,12,11,14,13}:<br>
              MSE → предсказание = среднее = <b>12.0</b><br>
              MAE → предсказание = медиана = <b>12.0</b> (совпадает здесь)<br><br>
              Теперь добавим ещё один выброс: L = {10,12,11,14,13,<b>40</b>}:<br>
              MSE → среднее = (10+12+11+14+13+40)/6 = <b>16.67</b> — смещено<br>
              MAE → медиана = (12+13)/2 = <b>12.5</b> — устойчива
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>MSE-критерий: лист предсказывает <b>среднее</b>, чувствителен к выбросам. MAE-критерий: лист предсказывает <b>медиану</b>, устойчив. При наличии выбросов в таргете используйте <code>criterion='absolute_error'</code>.</p>
          </div>
          <div class="lesson-box">
            В sklearn DecisionTreeRegressor: <code>criterion='squared_error'</code> (MSE, по умолчанию) или <code>criterion='absolute_error'</code> (MAE). Для данных с выбросами в y — предпочтите MAE или <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">Huber-loss</a> в Gradient Boosting.
          </div>
        `,
      },
      {
        title: 'Экстраполяция: почему дерево не может',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Наглядно показать проблему экстраполяции дерева регрессии: предсказания за пределами обучающего диапазона не меняются. Сравнить с линейной регрессией.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>x (год)</th><th>2018</th><th>2019</th><th>2020</th><th>2021</th><th>2022</th></tr>
              <tr><th>y (тыс. пользователей)</th><td>100</td><td>150</td><td>220</td><td>310</td><td>420</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: дерево с глубиной 2</h4>
            <div class="calc">
              Обучение: x ∈ [2018, 2022]<br>
              Разбиение 1: x ≤ 2019.5<br>
                └─ Да: L = {100, 150} → ȳ_L = 125<br>
                └─ Нет: R = {220, 310, 420}<br>
              Разбиение 2 (в правой части): x ≤ 2020.5<br>
                └─ Да: {220} → 220<br>
                └─ Нет: {310, 420} → ȳ = 365<br><br>
              Предсказания на обучении: 2018→125, 2019→125, 2020→220, 2021→365, 2022→365
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: экстраполяция в 2023-2025</h4>
            <div class="calc">
              Дерево для x=2023: 2023 > 2019.5 и 2023 > 2020.5 → лист {310, 420}: ŷ = <b>365</b><br>
              Дерево для x=2024: то же → ŷ = <b>365</b><br>
              Дерево для x=2025: то же → ŷ = <b>365</b><br><br>
              Линейная регрессия (slope=80/год) для x=2023: продолжает тренд → ŷ ≈ <b>480</b><br>
              Линейная для x=2024: ŷ ≈ <b>560</b><br>
              Линейная для x=2025: ŷ ≈ <b>640</b>
            </div>
            <div class="why">Дерево «застывает» на значении крайнего правого листа (365) для любого x > 2020.5. Это математически неизбежно: дерево — кусочно-постоянная функция.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: сравнение методов по качеству экстраполяции</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Модель</th><th>2023 (факт≈500)</th><th>2024 (факт≈580)</th><th>2025 (факт≈660)</th></tr>
                <tr><td>Дерево (depth=2)</td><td>365 (−27%)</td><td>365 (−37%)</td><td>365 (−45%)</td></tr>
                <tr><td>Линейная регрессия</td><td>480 (−4%)</td><td>560 (−3%)</td><td>640 (−3%)</td></tr>
                <tr><td>Random Forest</td><td>365 (−27%)</td><td>365 (−37%)</td><td>365 (−45%)</td></tr>
              </table>
            </div>
            <div class="why">Random Forest тоже не умеет экстраполировать — он ансамбль деревьев. Для временных рядов с трендом используйте линейную/полиномиальную регрессию или специальные методы (Prophet, ARIMA).</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Дерево регрессии <b>не может экстраполировать</b>: для x за пределами обучающего диапазона возвращает константу (значение крайнего листа). Линейная регрессия экстраполирует линейно. Random Forest — та же проблема, что у дерева.</p>
          </div>
          <div class="lesson-box">
            Деревья (и их ансамбли) идеальны для интерполяции в обучающем диапазоне, но категорически не подходят для экстраполяции. Для задач прогнозирования с выходом за диапазон обучения — используйте регрессионные модели.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: дерево регрессии — глубина</h3>
        <p>Меняй глубину дерева и шум. Наблюдай переобучение при большой глубине.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dtr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dtr-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="dtr-chart"></canvas></div>
            <div class="sim-stats" id="dtr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dtr-controls');
        const cDepth = App.makeControl('range', 'dtr-depth', 'Макс. глубина', { min: 1, max: 10, step: 1, value: 3 });
        const cNoise = App.makeControl('range', 'dtr-noise', 'Шум σ', { min: 0.1, max: 2, step: 0.1, value: 0.5 });
        [cDepth, cNoise].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let dataX = [], dataY = [];
        const N = 100;

        function generate() {
          const sigma = +cNoise.input.value;
          dataX = []; dataY = [];
          for (let i = 0; i < N; i++) {
            const x = Math.random() * 2 * Math.PI;
            dataX.push(x);
            dataY.push(Math.sin(x) + App.Util.randn(0, sigma));
          }
          update();
        }

        // Simple 1D regression tree
        function buildTree(xs, ys, depth, maxDepth) {
          if (depth >= maxDepth || xs.length < 4) {
            return { val: App.Util.mean(ys) };
          }
          let bestMSE = Infinity, bestThr = 0;
          const sorted = xs.map((x, i) => ({ x, y: ys[i] })).sort((a, b) => a.x - b.x);
          for (let i = 1; i < sorted.length; i++) {
            const thr = (sorted[i - 1].x + sorted[i].x) / 2;
            const leftY = [], rightY = [];
            for (let j = 0; j < sorted.length; j++) {
              if (sorted[j].x <= thr) leftY.push(sorted[j].y);
              else rightY.push(sorted[j].y);
            }
            if (leftY.length === 0 || rightY.length === 0) continue;
            const mL = App.Util.mean(leftY), mR = App.Util.mean(rightY);
            let mse = 0;
            for (const v of leftY) mse += (v - mL) ** 2;
            for (const v of rightY) mse += (v - mR) ** 2;
            if (mse < bestMSE) { bestMSE = mse; bestThr = thr; }
          }
          const lxs = [], lys = [], rxs = [], rys = [];
          for (let i = 0; i < xs.length; i++) {
            if (xs[i] <= bestThr) { lxs.push(xs[i]); lys.push(ys[i]); }
            else { rxs.push(xs[i]); rys.push(ys[i]); }
          }
          if (lxs.length === 0 || rxs.length === 0) return { val: App.Util.mean(ys) };
          return {
            thr: bestThr,
            left: buildTree(lxs, lys, depth + 1, maxDepth),
            right: buildTree(rxs, rys, depth + 1, maxDepth),
          };
        }

        function predict(tree, x) {
          if (tree.val !== undefined) return tree.val;
          return x <= tree.thr ? predict(tree.left, x) : predict(tree.right, x);
        }

        function countLeaves(tree) {
          if (tree.val !== undefined) return 1;
          return countLeaves(tree.left) + countLeaves(tree.right);
        }

        function update() {
          const maxDepth = +cDepth.input.value;
          const tree = buildTree(dataX, dataY, 0, maxDepth);
          const gridX = App.Util.linspace(0, 2 * Math.PI, 400);
          const predY = gridX.map(x => predict(tree, x));

          let mse = 0;
          for (let i = 0; i < dataX.length; i++) {
            mse += (dataY[i] - predict(tree, dataX[i])) ** 2;
          }
          mse /= dataX.length;

          const scatter = dataX.map((x, i) => ({ x, y: dataY[i] }));
          const curve = gridX.map((x, i) => ({ x, y: predY[i] }));
          const trueCurve = gridX.map(x => ({ x, y: Math.sin(x) }));

          const ctx = container.querySelector('#dtr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Данные', data: scatter, backgroundColor: 'rgba(99,102,241,0.4)', pointRadius: 4 },
                { label: 'Дерево', data: curve, type: 'line', borderColor: 'rgba(239,68,68,0.9)', borderWidth: 2, pointRadius: 0, fill: false, showLine: true, stepped: true },
                { label: 'sin(x)', data: trueCurve, type: 'line', borderColor: 'rgba(16,185,129,0.6)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, showLine: true },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Дерево регрессии' } },
              scales: { x: { type: 'linear', min: 0, max: 6.5 }, y: { suggestedMin: -2.5, suggestedMax: 2.5 } },
            },
          });
          App.registerChart(chart);

          const leaves = countLeaves(tree);
          container.querySelector('#dtr-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Глубина</div><div class="stat-value">${maxDepth}</div></div>
            <div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${mse.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">Листьев</div><div class="stat-value">${leaves}</div></div>
          `;
        }

        cDepth.input.addEventListener('input', update);
        cNoise.input.addEventListener('input', generate);
        container.querySelector('#dtr-regen').onclick = generate;
        generate();
      },
    },

    python: `
      <h4>1. Базовый DecisionTreeRegressor</h4>
      <pre><code>from sklearn.tree import DecisionTreeRegressor, export_text
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Данные: цены квартир
X = np.array([[38],[45],[52],[65],[72],[85],[98],[115]])
y = np.array([5.0, 6.2, 7.5, 9.0, 10.5, 12.0, 14.5, 17.0])

# Дерево с ограничением глубины
tree = DecisionTreeRegressor(max_depth=2, random_state=42)
tree.fit(X, y)

print(export_text(tree, feature_names=['площадь']))
print(f"Для 78 м²: {tree.predict([[78]])[0]:.2f} млн")</code></pre>

      <h4>2. Подбор глубины через кросс-валидацию</h4>
      <pre><code>from sklearn.model_selection import cross_val_score
from sklearn.datasets import fetch_california_housing

data = fetch_california_housing()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

results = []
for depth in range(1, 15):
    tree = DecisionTreeRegressor(max_depth=depth, random_state=42)
    scores = cross_val_score(tree, X_train, y_train,
                             cv=5, scoring='neg_mean_squared_error')
    results.append({'depth': depth, 'val_mse': -scores.mean()})

best = min(results, key=lambda r: r['val_mse'])
print(f"Лучшая глубина: {best['depth']}, Val MSE: {best['val_mse']:.4f}")

# Финальная модель
tree = DecisionTreeRegressor(max_depth=best['depth'], random_state=42)
tree.fit(X_train, y_train)
y_pred = tree.predict(X_test)
print(f"Test R²: {r2_score(y_test, y_pred):.4f}")
print(f"Test RMSE: {mean_squared_error(y_test, y_pred)**0.5:.4f}")</code></pre>

      <h4>3. MSE vs MAE критерий + визуализация ступенчатой функции</h4>
      <pre><code>import matplotlib.pyplot as plt

X_1d = np.linspace(0, 10, 50).reshape(-1, 1)
y_1d = np.sin(X_1d.ravel()) * 3 + X_1d.ravel() + np.random.randn(50) * 0.5

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
X_plot = np.linspace(-1, 11, 200).reshape(-1, 1)

for ax, criterion in zip(axes, ['squared_error', 'absolute_error']):
    tree = DecisionTreeRegressor(max_depth=3, criterion=criterion, random_state=42)
    tree.fit(X_1d, y_1d)
    ax.scatter(X_1d, y_1d, alpha=0.6, label='данные')
    ax.plot(X_plot, tree.predict(X_plot), 'r-', linewidth=2, label='дерево')
    ax.axvline(0, color='gray', linestyle='--', alpha=0.5, label='граница данных')
    ax.axvline(10, color='gray', linestyle='--', alpha=0.5)
    ax.set_title(f'criterion={criterion}')
    ax.legend()

plt.tight_layout()
plt.show()
# Обратите внимание: за x=10 линия "застывает" — это экстраполяция</code></pre>
    `,

    applications: `
      <h3>Где применяется Decision Tree Regression</h3>
      <table>
        <tr><th>Область</th><th>Задача</th></tr>
        <tr><td><b>Недвижимость</b></td><td>Оценка стоимости по площади, району, этажу — интерпретируемые правила</td></tr>
        <tr><td><b>Финансы</b></td><td>Предсказание дохода, расходов сегмента клиентов</td></tr>
        <tr><td><b>Промышленность</b></td><td>Предсказание расхода материалов, времени производства</td></tr>
        <tr><td><b>Исследовательский анализ</b></td><td>Быстрая визуализация нелинейных зависимостей в данных</td></tr>
        <tr><td><b>Как компонент</b></td><td>Базовый блок для Random Forest и Gradient Boosting</td></tr>
        <tr><td><b>Объяснение моделей</b></td><td>Surrogate model — имитирует поведение чёрного ящика интерпретируемыми правилами</td></tr>
      </table>
        `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Интерпретируемо: можно прочитать как набор правил</li>
            <li>Нелинейная регрессия без feature engineering</li>
            <li>Устойчиво к масштабу признаков (не нужна нормировка)</li>
            <li>Быстро обучается и предсказывает</li>
            <li>Выдаёт feature importance</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li><b>Не умеет экстраполировать</b> — главная слабость!</li>
            <li>Высокая дисперсия — маленькое изменение данных = другое дерево</li>
            <li>Ступенчатая, не гладкая аппроксимация</li>
            <li>Склонно к переобучению без ограничений глубины</li>
            <li>Слабее RF и GB по точности</li>
          </ul>
        </div>
      </div>
      <h4>Дерево vs Линейная регрессия</h4>
      <table>
        <tr><th>Критерий</th><th>Дерево регрессии</th><th>Линейная регрессия</th></tr>
        <tr><td>Тип зависимости</td><td>Нелинейная (кусочно-постоянная)</td><td>Линейная</td></tr>
        <tr><td>Экстраполяция</td><td>Нет (застывает)</td><td>Да (линейно)</td></tr>
        <tr><td>Масштабирование</td><td>Не нужно</td><td>Нужно</td></tr>
        <tr><td>Интерпретируемость</td><td>Высокая (правила)</td><td>Высокая (коэффициенты)</td></tr>
        <tr><td>Выбросы в y</td><td>Чувствительно (MSE) / нет (MAE)</td><td>Чувствительно</td></tr>
        <tr><td>Взаимодействия признаков</td><td>Автоматически</td><td>Надо добавлять вручную</td></tr>
      </table>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=g9c66TUylZ4" target="_blank">StatQuest: Regression Trees</a> — деревья решений для регрессии, MSE-критерий разбиения</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%20%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B9%20%D1%80%D0%B5%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D1%8F" target="_blank">Деревья решений на Habr</a> — разбор CART для классификации и регрессии</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeRegressor.html" target="_blank">sklearn: DecisionTreeRegressor</a> — документация дерева регрессии в sklearn</li>
      </ul>
    `,
  },
});
