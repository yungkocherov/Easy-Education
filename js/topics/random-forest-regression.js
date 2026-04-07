/* ==========================================================================
   Random Forest для регрессии
   ========================================================================== */
App.registerTopic({
  id: 'random-forest-reg',
  category: 'ml-reg',
  title: 'Random Forest для регрессии',
  summary: 'Ансамбль деревьев: каждое предсказывает число, берём среднее.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты хочешь оценить стоимость дома и звонишь 100 независимым оценщикам. Каждый смотрит на немного разные характеристики: один акцентирует внимание на расстоянии до метро, другой — на площади кухни, третий — на этаже. Каждый называет своё число. Ты берёшь <b>среднее всех оценок</b>.</p>
        <p>Результат будет точнее, чем любой отдельный оценщик. Почему? Потому что ошибки у всех <b>разные по направлению</b>: один немного завысил, другой занизил, они компенсируют друг друга. Среднее «схлопывает» случайные ошибки.</p>
        <p>Random Forest для регрессии делает именно это: обучает 100–500 деревьев, каждое на <b>случайной подвыборке данных</b> и случайном подмножестве признаков, а потом усредняет их предсказания. Это снижает дисперсию и делает модель устойчивой к шуму.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 215" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <text x="270" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Random Forest регрессия: усреднение предсказаний деревьев</text>
          <!-- Tree 1 -->
          <rect x="20" y="28" width="140" height="105" rx="6" fill="#eff6ff" stroke="#6366f1" stroke-width="1.5"/>
          <text x="90" y="45" text-anchor="middle" font-size="10" font-weight="600" fill="#6366f1">Дерево 1</text>
          <text x="90" y="60" text-anchor="middle" font-size="9" fill="#475569">bootstrap A</text>
          <text x="90" y="75" text-anchor="middle" font-size="9" fill="#475569">признаки: x₁, x₃, x₅</text>
          <rect x="60" y="85" width="60" height="22" rx="4" fill="#ddd6fe" stroke="#6366f1" stroke-width="1"/>
          <text x="90" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="#4c1d95">ŷ₁ = 8.2</text>
          <text x="90" y="122" text-anchor="middle" font-size="9" fill="#64748b">OOB err: 1.2</text>
          <!-- Tree 2 -->
          <rect x="195" y="28" width="140" height="105" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="265" y="45" text-anchor="middle" font-size="10" font-weight="600" fill="#10b981">Дерево 2</text>
          <text x="265" y="60" text-anchor="middle" font-size="9" fill="#475569">bootstrap B</text>
          <text x="265" y="75" text-anchor="middle" font-size="9" fill="#475569">признаки: x₂, x₄, x₆</text>
          <rect x="235" y="85" width="60" height="22" rx="4" fill="#a7f3d0" stroke="#10b981" stroke-width="1"/>
          <text x="265" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">ŷ₂ = 7.6</text>
          <text x="265" y="122" text-anchor="middle" font-size="9" fill="#64748b">OOB err: 1.5</text>
          <!-- Tree 3 -->
          <rect x="370" y="28" width="140" height="105" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="440" y="45" text-anchor="middle" font-size="10" font-weight="600" fill="#d97706">Дерево 3</text>
          <text x="440" y="60" text-anchor="middle" font-size="9" fill="#475569">bootstrap C</text>
          <text x="440" y="75" text-anchor="middle" font-size="9" fill="#475569">признаки: x₁, x₂, x₄</text>
          <rect x="410" y="85" width="60" height="22" rx="4" fill="#fde68a" stroke="#f59e0b" stroke-width="1"/>
          <text x="440" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">ŷ₃ = 8.6</text>
          <text x="440" y="122" text-anchor="middle" font-size="9" fill="#64748b">OOB err: 1.1</text>
          <!-- Arrows -->
          <line x1="90" y1="155" x2="200" y2="190" stroke="#64748b" stroke-width="1.5" marker-end="url(#rfr_arr)"/>
          <line x1="265" y1="155" x2="265" y2="188" stroke="#64748b" stroke-width="1.5" marker-end="url(#rfr_arr)"/>
          <line x1="440" y1="155" x2="330" y2="190" stroke="#64748b" stroke-width="1.5" marker-end="url(#rfr_arr)"/>
          <!-- Result box -->
          <rect x="165" y="188" width="200" height="24" rx="5" fill="#6366f1"/>
          <text x="265" y="204" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">ŷ = (8.2 + 7.6 + 8.6) / 3 = 8.13</text>
          <defs>
            <marker id="rfr_arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">Random Forest регрессия: каждое дерево обучается на своей bootstrap-выборке и случайном подмножестве признаков, предсказывает число. Итог — среднее арифметическое всех предсказаний.</div>
      </div>

      <h3>📊 Усреднение вместо голосования</h3>
      <p>В Random Forest для <b>классификации</b> деревья голосуют: каждое говорит «класс 0» или «класс 1», берём большинство. В Random Forest для <b>регрессии</b> деревья называют числа, берём среднее:</p>
      <div class="math-block">$$\\hat{y}(x) = \\frac{1}{T} \\sum_{t=1}^{T} h_t(x)$$</div>
      <p>Где $T$ — число деревьев, $h_t(x)$ — предсказание $t$-го дерева. Это простое арифметическое среднее (или взвешенное, если деревья имеют разное качество).</p>

      <div class="key-concept">
        <div class="kc-label">Почему это работает</div>
        <p>Каждое дерево имеет <b>смещение (bias)</b> и <b>дисперсию (variance)</b>. При усреднении независимых несмещённых оценок дисперсия уменьшается в $T$ раз: $\\text{Var}(\\bar{y}) = \\sigma^2/T$. Деревья не независимы (обучены на похожих данных), поэтому реальное снижение меньше, но всё равно значительное.</p>
      </div>

      <h3>🎲 Два источника случайности</h3>
      <p>Чтобы деревья были <b>разными</b> и их ошибки не коррелировали, Random Forest вводит два уровня случайности:</p>

      <h4>1. Bootstrap-выборки (bagging)</h4>
      <p>Каждое дерево обучается на <span class="term" data-tip="Bootstrap. Случайная выборка с возвращением того же размера n. Примерно 63.2% уникальных объектов попадёт в выборку, остальные 36.8% — OOB (out-of-bag).">bootstrap-подвыборке</span> из всего датасета: n примеров берётся случайно с возвращением. Примерно треть всех примеров не попадёт в обучение конкретного дерева — это <b>OOB (Out-Of-Bag)</b> данные.</p>

      <h4>2. Случайные признаки (feature subsampling)</h4>
      <p>В каждом узле дерева вместо всех p признаков рассматривается только случайное подмножество размером <b>max_features</b>. По умолчанию для регрессии: $\\text{max\_features} = p/3$ или $\\sqrt{p}$. Это делает деревья более разнообразными.</p>

      <h3>📈 OOB оценка — бесплатная кросс-валидация</h3>
      <p>Для каждого примера $x_i$ деревья, которые не видели его при обучении (OOB деревья), дают несмещённое предсказание. Среднее этих предсказаний — <span class="term" data-tip="OOB score (Out-of-Bag). Оценка качества модели на примерах, не попавших в bootstrap-выборку конкретного дерева. Аппроксимирует leave-one-out кросс-валидацию.">OOB-оценка</span>:</p>
      <div class="math-block">$$\\hat{y}_{OOB}(x_i) = \\frac{1}{|\\mathcal{T}_{-i}|} \\sum_{t \\in \\mathcal{T}_{-i}} h_t(x_i)$$</div>
      <p>Где $\\mathcal{T}_{-i}$ — деревья, не видевшие $x_i$. OOB RMSE коррелирует с test RMSE и не требует отдельной валидационной выборки.</p>

      <h3>🏆 Важность признаков</h3>
      <p>Random Forest автоматически считает важность каждого признака двумя способами:</p>
      <ul>
        <li><b>Impurity-based (MDI):</b> среднее снижение MSE в узлах, где использован признак. Быстро, но может завышать для признаков с высокой мощностью.</li>
        <li><b>Permutation importance:</b> случайно перетасовываем значения признака на тесте и смотрим, как вырос RMSE. Медленнее, но надёжнее.</li>
      </ul>

      <h3>⚙️ Ключевые гиперпараметры</h3>
      <ul>
        <li><b>n_estimators (число деревьев):</b> больше = лучше, но медленнее. Обычно 100–500 достаточно.</li>
        <li><b>max_depth:</b> глубина дерева. Глубокие деревья (None) — низкий bias, высокая variance. Рекомендуется не ограничивать при регрессии.</li>
        <li><b>max_features:</b> число признаков на узел. Меньше — деревья разнообразнее, но слабее. Обычно 'sqrt' или 1/3.</li>
        <li><b>min_samples_leaf:</b> минимум примеров в листе. Увеличение сглаживает предсказания, помогает при выбросах.</li>
        <li><b>oob_score=True:</b> включить OOB оценку. Бесплатно!</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: снижение дисперсии через усреднение</summary>
        <div class="deep-dive-body">
          <p>Пусть каждое дерево предсказывает $h_t(x)$ с дисперсией $\\sigma^2$ и корреляцией $\\rho$ между деревьями. Дисперсия ансамбля:</p>
          <div class="math-block">$$\\text{Var}\\left(\\frac{1}{T}\\sum_t h_t\\right) = \\rho \\sigma^2 + \\frac{1-\\rho}{T} \\sigma^2$$</div>
          <p>При $T \\to \\infty$ первое слагаемое $\\rho\\sigma^2$ остаётся — это <b>предел усреднения</b>. Именно поэтому важно иметь малую корреляцию $\\rho$ между деревьями (для этого и нужны случайные признаки). При $\\rho = 0$ (идеал) дисперсия → 0 с ростом T. При $\\rho = 1$ (деревья одинаковы) усреднение не помогает.</p>
          <p>Случайные признаки снижают $\\rho$, что важнее, чем увеличение T выше 200–300.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Extremely Randomized Trees (Extra Trees)</summary>
        <div class="deep-dive-body">
          <p><b>Extra Trees</b> (sklearn: <code>ExtraTreesRegressor</code>) — ещё более случайный вариант. Дополнительное отличие от Random Forest:</p>
          <ul>
            <li>Случайный порог разбиения: вместо оптимального разреза по каждому признаку выбирается случайный порог.</li>
            <li>Нет bootstrap: каждое дерево видит <b>все</b> обучающие данные.</li>
          </ul>
          <p>Результаты: обычно сопоставимые или немного хуже по точности, но <b>значительно быстрее обучение</b> (нет сортировки по порогу). Хороший выбор при большом числе признаков или больших датасетах.</p>
          <p>Правило: пробуй оба (<code>RandomForestRegressor</code> и <code>ExtraTreesRegressor</code>) через CV, выбирай лучший.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Decision Tree регрессия</b> — один элемент ансамбля. RF исправляет его главный недостаток — переобучение.</li>
        <li><b>Gradient Boosting регрессия</b> — другой ансамблевый подход. Деревья последовательны (исправляют ошибки), а не параллельны. Обычно точнее, но медленнее обучается.</li>
        <li><b>Bagging</b> — более общая техника, Random Forest — специализированный bagging для деревьев.</li>
        <li><b>kNN регрессия</b> — тоже локальный метод (ближайшие соседи), но не строит модель.</li>
        <li><b>SVR</b> — хорош на маленьких данных, требует масштабирования и тюнинга трёх параметров.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Мини-лес из 3 деревьев: предсказание цены дома',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучить мини-Random Forest из 3 деревьев, вручную вычислить предсказание для нового дома и OOB-оценку.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>ID</th><th>Площадь x₁ (м²)</th><th>Комнат x₂</th><th>Этаж x₃</th><th>Цена y (млн)</th></tr>
              <tr><td>1</td><td>50</td><td>2</td><td>3</td><td>6.0</td></tr>
              <tr><td>2</td><td>70</td><td>3</td><td>5</td><td>8.5</td></tr>
              <tr><td>3</td><td>60</td><td>2</td><td>1</td><td>6.8</td></tr>
              <tr><td>4</td><td>90</td><td>4</td><td>7</td><td>11.0</td></tr>
              <tr><td>5</td><td>80</td><td>3</td><td>4</td><td>9.5</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: bootstrap-выборки для каждого дерева</h4>
            <div class="calc">
              (Выборка с возвращением, n=5)<br><br>
              Дерево 1: {1, 2, 2, 4, 5} → OOB: {3}<br>
              Дерево 2: {1, 3, 3, 4, 5} → OOB: {2}<br>
              Дерево 3: {2, 3, 4, 4, 5} → OOB: {1}
            </div>
            <div class="why">Каждый объект попадает примерно в 63% деревьев (1 − 1/e). Остальные деревья для него — OOB-деревья.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: упрощённые предсказания деревьев</h4>
            <div class="calc">
              (Деревья с глубиной 1, случайные признаки: max_features=2)<br><br>
              Дерево 1 (признаки x₁, x₃):<br>
                Разрез: x₁ ≤ 70<br>
                Лист «Да» (ID 1,2,2): среднее(6.0, 8.5, 8.5) = 7.67<br>
                Лист «Нет» (ID 4,5): среднее(11.0, 9.5) = 10.25<br><br>
              Дерево 2 (признаки x₁, x₂):<br>
                Разрез: x₂ ≤ 2<br>
                Лист «Да» (ID 1,3,3): среднее(6.0, 6.8, 6.8) = 6.53<br>
                Лист «Нет» (ID 4,5): среднее(11.0, 9.5) = 10.25<br><br>
              Дерево 3 (признаки x₂, x₃):<br>
                Разрез: x₃ ≤ 4<br>
                Лист «Да» (ID 3,4,5): среднее(6.8, 11.0, 11.0) = 9.60<br>
                Лист «Нет» (ID 2,4): среднее(8.5, 11.0) = 9.75
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: предсказание для нового дома (x₁=75, x₂=3, x₃=6)</h4>
            <div class="calc">
              Дерево 1: x₁=75 > 70 → лист «Нет» → <b>10.25</b><br>
              Дерево 2: x₂=3 > 2 → лист «Нет» → <b>10.25</b><br>
              Дерево 3: x₃=6 > 4 → лист «Нет» → <b>9.75</b><br><br>
              RF предсказание: (10.25 + 10.25 + 9.75) / 3 = <b>10.08 млн</b>
            </div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: OOB оценка</h4>
            <div class="calc">
              Объект 1 (y=6.0): OOB-дерево: 3 → x₁=50≤70→7.67; x₃=3≤4→9.60 → avg(7.67, 9.60) = 8.63 (ошибка: |6.0−8.63|=2.63)<br>
              Объект 2 (y=8.5): OOB-дерево: 2 → x₂=3>2→10.25 → ошибка: |8.5−10.25|=1.75<br>
              Объект 3 (y=6.8): OOB-дерево: 1 → x₁=60≤70→7.67 → ошибка: |6.8−7.67|=0.87<br><br>
              OOB MAE ≈ (2.63+1.75+0.87)/3 = 1.75 млн<br>
              (С 3 деревьями — плохо, в реальности 100+ деревьев)
            </div>
            <div class="why">OOB-ошибка — бесплатный аналог кросс-валидации. Не нужен отдельный val-набор!</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Предсказание RF для дома 75м², 3 комнаты, 6 этаж: 10.08 млн. OOB MAE = 1.75 млн (на 5 примерах и 3 деревьях — очень приблизительно). В реальной задаче используют 100+ деревьев.</p>
          </div>
          <div class="lesson-box">
            Обратите внимание: деревья предсказали 10.25, 10.25 и 9.75. Разброс небольшой — это хорошо. Если бы разброс был огромным (5.0, 10.0, 15.0), модель нестабильна — нужно больше данных или деревьев.
          </div>
        `,
      },
      {
        title: 'OOB vs кросс-валидация: сравнение',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить OOB RMSE и 5-fold CV RMSE на одном датасете. Понять, когда OOB достаточно, а когда нужна CV.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>n_estimators</th><th>OOB RMSE</th><th>5-fold CV RMSE</th><th>Test RMSE</th><th>OOB ≈ CV?</th></tr>
              <tr><td>10</td><td>2.41</td><td>2.18</td><td>2.35</td><td>Нет (10 — мало)</td></tr>
              <tr><td>50</td><td>1.87</td><td>1.83</td><td>1.89</td><td>Да ✓</td></tr>
              <tr><td>100</td><td>1.82</td><td>1.80</td><td>1.84</td><td>Да ✓</td></tr>
              <tr><td>200</td><td>1.81</td><td>1.80</td><td>1.83</td><td>Да ✓</td></tr>
              <tr><td>500</td><td>1.81</td><td>1.80</td><td>1.82</td><td>Да ✓</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: почему OOB ненадёжен при малом числе деревьев</h4>
            <div class="calc">
              При n_estimators=10 и n=500 примеров:<br>
              Каждый объект — OOB примерно для 4 из 10 деревьев<br>
              OOB-ансамбль: только 4 дерева → высокая variance оценки<br><br>
              При n_estimators=100:<br>
              Каждый объект — OOB примерно для 37 деревьев<br>
              Среднее 37 предсказаний → стабильная оценка<br>
              OOB RMSE ≈ 5-fold CV RMSE ≈ Test RMSE
            </div>
            <div class="why">Правило: используй OOB только при n_estimators ≥ 50–100. При меньшем числе деревьев OOB ненадёжен.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: когда CV предпочтительнее OOB</h4>
            <div class="calc">
              OOB использовать, если:<br>
              • Данных мало и нельзя выделять val-набор<br>
              • n_estimators достаточно большой (≥100)<br>
              • Нужна быстрая оценка качества<br><br>
              CV предпочтительнее, если:<br>
              • Тюнишь гиперпараметры (max_depth, min_samples_leaf)<br>
              • Сравниваешь разные модели (RF vs GB vs SVR)<br>
              • Данные имеют временную структуру (CV с разбивкой по времени)<br>
              • Нужна оценка доверительных интервалов метрики
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: практический вывод по числу деревьев</h4>
            <div class="calc">
              Из таблицы: при n_estimators ≥ 100 качество стабилизируется<br>
              Прирост от 100 до 500 деревьев: RMSE 1.84 → 1.82 (незначим)<br>
              Но время обучения ×5<br><br>
              Стратегия:<br>
              1. Начни с 100–200 деревьев (быстро, стабильно)<br>
              2. Проверь OOB score — если нестабилен, добавь деревьев<br>
              3. Увеличивай до 500 только если явно нужно
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>При n_estimators ≥ 100 OOB RMSE ≈ CV RMSE ≈ Test RMSE. Качество стабилизируется при 100–200 деревьях. 500+ деревьев дают минимальный прирост при значительном замедлении.</p>
          </div>
          <div class="lesson-box">
            В sklearn: RandomForestRegressor(n_estimators=200, oob_score=True). После обучения смотри model.oob_score_ — это R² на OOB данных. Для RMSE нужно извлекать model.oob_prediction_.
          </div>
        `,
      },
      {
        title: 'Feature Importance: какие признаки важны',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Интерпретировать RF через важность признаков. Сравнить MDI (встроенная) и Permutation Importance на примере предсказания цен на жильё.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Признак</th><th>MDI Importance</th><th>Permutation Importance (RMSE↑)</th><th>Реальная важность</th></tr>
              <tr><td>Площадь (м²)</td><td>0.42</td><td>0.45</td><td>Высокая</td></tr>
              <tr><td>Расст. до метро</td><td>0.31</td><td>0.33</td><td>Высокая</td></tr>
              <tr><td>Этаж</td><td>0.09</td><td>0.06</td><td>Средняя</td></tr>
              <tr><td>Год постройки</td><td>0.08</td><td>0.10</td><td>Средняя</td></tr>
              <tr><td>ID объявления</td><td>0.06</td><td>0.00</td><td>Нет (шум!)</td></tr>
              <tr><td>Случайный шум</td><td>0.04</td><td>0.00</td><td>Нет</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: MDI — почему может врать</h4>
            <div class="calc">
              MDI (Mean Decrease Impurity):<br>
              Для каждого признака: суммируем уменьшение MSE в узлах дерева<br>
              Нормализуем до суммы = 1<br><br>
              Проблема: «ID объявления» — числовой с высокой мощностью<br>
              У него много вариантов разрезов → часто выбирается случайно<br>
              Получает завышенный MDI = 0.06 (≠ реальная важность)<br><br>
              Permutation: ID объявления → RMSE ↑ на 0.00 → важность = 0
            </div>
            <div class="why">MDI завышает числовые признаки с высокой мощностью и категориальные с высокой кардинальностью. Permutation importance надёжнее.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: как считать Permutation Importance</h4>
            <div class="calc">
              Алгоритм для признака j:<br>
              1. Вычислить RMSE_base на тестовых данных<br>
              2. Перемешать значения j-го признака случайно<br>
              3. Вычислить RMSE_perm на тех же данных с перемешанным j<br>
              4. Importance_j = RMSE_perm − RMSE_base<br><br>
              Площадь: RMSE_base=1.82 → RMSE_perm=2.27 → Importance=0.45<br>
              ID объявления: RMSE_base=1.82 → RMSE_perm=1.82 → Importance=0.00<br><br>
              Повторить 10–30 раз и усреднить (для стабильности)
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: отбор признаков на основе важности</h4>
            <div class="calc">
              Удалить признаки с Permutation Importance ≈ 0:<br>
              • «ID объявления» → удалить<br>
              • «Случайный шум» → удалить<br><br>
              Модель без мусорных признаков:<br>
              • Обучается быстрее<br>
              • Чуть точнее (меньше шума)<br>
              • Лучше обобщает<br><br>
              RMSE до отбора: 1.82, после: 1.79
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>MDI завышает бесполезные признаки с высокой мощностью. Permutation Importance точнее: шумовые признаки получают 0. Отбор признаков по Permutation Importance улучшил RMSE с 1.82 до 1.79.</p>
          </div>
          <div class="lesson-box">
            В sklearn: from sklearn.inspection import permutation_importance. Вызов: result = permutation_importance(model, X_test, y_test, n_repeats=20, scoring='neg_root_mean_squared_error'). Смотри result.importances_mean.
          </div>
        `,
      },
    ],

    python: `
      <h3>Python: Random Forest Regressor</h3>
      <p>sklearn.RandomForestRegressor — надёжный, параллельный, с OOB и importance «из коробки».</p>

      <h4>1. Базовое обучение и OOB</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score

data = fetch_california_housing()
X, y = data.data, data.target
feature_names = data.feature_names

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestRegressor(
    n_estimators=200,
    max_features='sqrt',     # случайные признаки на узел
    max_depth=None,          # деревья растут до листьев
    min_samples_leaf=4,      # минимум 4 примера в листе
    oob_score=True,          # OOB оценка
    n_jobs=-1,               # все ядра CPU
    random_state=42,
)
rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2   = r2_score(y_test, y_pred)

print(f'Test RMSE: {rmse:.4f}')
print(f'Test R²:   {r2:.4f}')
print(f'OOB R²:    {rf.oob_score_:.4f}')  # бесплатная валидация
print(f'OOB ≈ Test? {"Да" if abs(rf.oob_score_ - r2) < 0.02 else "Нет"}')</code></pre>

      <h4>2. Feature Importance (MDI vs Permutation)</h4>
      <pre><code>from sklearn.inspection import permutation_importance

# MDI importance (встроенная)
mdi = rf.feature_importances_
print('\\nMDI Importance:')
for name, imp in sorted(zip(feature_names, mdi), key=lambda x: -x[1]):
    bar = '█' * int(imp * 50)
    print(f'  {name:20}: {imp:.3f} {bar}')

# Permutation Importance (надёжнее)
perm = permutation_importance(rf, X_test, y_test,
                               n_repeats=20,
                               scoring='neg_root_mean_squared_error',
                               n_jobs=-1, random_state=42)
print('\\nPermutation Importance (RMSE increase):')
for i in np.argsort(perm.importances_mean)[::-1]:
    print(f'  {feature_names[i]:20}: {perm.importances_mean[i]:.4f} ± {perm.importances_std[i]:.4f}')</code></pre>

      <h4>3. Тюнинг гиперпараметров</h4>
      <pre><code>from sklearn.model_selection import RandomizedSearchCV

param_dist = {
    'n_estimators':      [100, 200, 300],
    'max_depth':         [None, 10, 20, 30],
    'max_features':      ['sqrt', 0.3, 0.5],
    'min_samples_leaf':  [1, 2, 4, 8],
    'min_samples_split': [2, 5, 10],
}

search = RandomizedSearchCV(
    RandomForestRegressor(oob_score=False, n_jobs=-1, random_state=42),
    param_distributions=param_dist,
    n_iter=30,
    cv=5,
    scoring='neg_root_mean_squared_error',
    random_state=42,
    verbose=1,
)
search.fit(X_train, y_train)

print(f'Лучшие параметры: {search.best_params_}')
print(f'CV RMSE: {-search.best_score_:.4f}')
best_rf = search.best_estimator_
print(f'Test RMSE: {np.sqrt(mean_squared_error(y_test, best_rf.predict(X_test))):.4f}')</code></pre>

      <h4>4. Предсказательные интервалы через квантили деревьев</h4>
      <pre><code># RF не даёт вероятностей напрямую, но можно смотреть на разброс деревьев
tree_preds = np.array([tree.predict(X_test) for tree in rf.estimators_])
# shape: (n_estimators, n_test_samples)

# Точечное предсказание = среднее по деревьям
mean_pred = tree_preds.mean(axis=0)
# Неопределённость = std по деревьям
std_pred  = tree_preds.std(axis=0)
# Квантильный интервал (5%-95%)
lower = np.percentile(tree_preds, 5, axis=0)
upper = np.percentile(tree_preds, 95, axis=0)

# Визуализация первых 50 тестовых точек
idx = np.argsort(y_test)[:50]
plt.figure(figsize=(12, 4))
plt.errorbar(range(50), mean_pred[idx], yerr=std_pred[idx],
             fmt='o', markersize=4, alpha=0.7, label='RF ± std', capsize=3)
plt.scatter(range(50), y_test[idx], c='red', s=20, zorder=5, label='факт y')
plt.fill_between(range(50), lower[idx], upper[idx], alpha=0.2, label='90% интервал')
plt.xlabel('Тестовая точка (отсорт. по y)')
plt.ylabel('Цена жилья')
plt.legend()
plt.title('Random Forest: предсказание и неопределённость')
plt.tight_layout()
plt.show()</code></pre>
    `,

    math: `
      <h3>Усреднение ансамбля</h3>
      <div class="math-block">$$\\hat{y}(x) = \\frac{1}{T} \\sum_{t=1}^{T} h_t(x)$$</div>

      <h3>Разложение ошибки на bias и variance</h3>
      <div class="math-block">$$\\mathbb{E}[(y - \\hat{y})^2] = \\text{Bias}^2(\\hat{y}) + \\text{Var}(\\hat{y}) + \\sigma^2_{\\text{шум}}$$</div>

      <h3>Дисперсия ансамбля деревьев</h3>
      <div class="math-block">$$\\text{Var}(\\hat{y}_{RF}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{T} \\sigma^2$$</div>
      <p>Где $\\rho$ — корреляция между деревьями, $\\sigma^2$ — дисперсия одного дерева, $T$ — число деревьев.</p>

      <h3>OOB предсказание</h3>
      <div class="math-block">$$\\hat{y}_{OOB}(x_i) = \\frac{1}{|\\mathcal{T}_{-i}|} \\sum_{t \\in \\mathcal{T}_{-i}} h_t(x_i)$$</div>
      <p>$\\mathcal{T}_{-i}$ — деревья, не видевшие $x_i$ при обучении.</p>

      <h3>Критерий разбиения узла (MSE)</h3>
      <div class="math-block">$$\\text{MSE}_\\text{узел} = \\frac{1}{n_\\text{узел}} \\sum_{i \\in \\text{узел}} (y_i - \\bar{y}_\\text{узел})^2$$</div>
      <div class="math-block">$$\\Delta = \\text{MSE}_{\\text{родитель}} - \\frac{n_L}{n} \\text{MSE}_L - \\frac{n_R}{n} \\text{MSE}_R \\to \\max$$</div>

      <h3>MDI Feature Importance</h3>
      <div class="math-block">$$\\text{Imp}_j = \\frac{1}{T} \\sum_{t=1}^T \\sum_{v : \\text{split by } j} \\frac{n_v}{n} \\cdot \\Delta_v$$</div>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Не требует стандартизации признаков</li>
            <li>Устойчив к выбросам и шуму</li>
            <li>OOB-оценка — бесплатная кросс-валидация</li>
            <li>Встроенная важность признаков</li>
            <li>Параллельное обучение (n_jobs=-1)</li>
            <li>Хорошо работает «из коробки» без тюнинга</li>
            <li>Мало переобучается при большом числе деревьев</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Менее точен, чем Gradient Boosting при тщательном тюнинге</li>
            <li>Много памяти: хранит все деревья</li>
            <li>Медленное предсказание при большом числе деревьев</li>
            <li>Не интерполирует: предсказания ограничены диапазоном обучающих y</li>
            <li>Плохо работает при экстраполяции</li>
            <li>MDI importance ненадёжна для высокомощных признаков</li>
          </ul>
        </div>
      </div>

      <h3>Когда выбирать Random Forest регрессию</h3>
      <div class="example-data-table">
        <table>
          <tr><th>Ситуация</th><th>RF регрессия</th><th>Gradient Boosting</th></tr>
          <tr><td>Нужен быстрый baseline</td><td>Отлично</td><td>Хуже (медленнее обучается)</td></tr>
          <tr><td>Данных &lt; 1 000</td><td>Хорошо</td><td>Риск переобучения</td></tr>
          <tr><td>Максимальная точность</td><td>Уступает</td><td>Лучше при тюнинге</td></tr>
          <tr><td>Выбросы в y</td><td>Устойчив</td><td>Умеренно</td></tr>
          <tr><td>Нет времени на тюнинг</td><td>Работает «из коробки»</td><td>Нужен тюнинг</td></tr>
          <tr><td>Интерпретация нужна</td><td>Permutation Imp.</td><td>SHAP значения</td></tr>
        </table>
      </div>
    `,
  },
});
