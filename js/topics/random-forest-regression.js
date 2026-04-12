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
        <li><b>Impurity-based (MDI):</b> среднее снижение <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a> в узлах, где использован признак. Быстро, но может завышать для признаков с высокой мощностью.</li>
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
        <li><b>Decision Tree регрессия</b> — один элемент ансамбля. RF исправляет его главный недостаток — <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучение</a>.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting регрессия</b> — другой ансамблевый подход. Деревья последовательны (исправляют ошибки), а не параллельны. Обычно точнее, но медленнее обучается.</li>
        <li><b>Bagging</b> — более общая техника, Random Forest — специализированный bagging для деревьев.</li>
        <li><b>kNN регрессия</b> — тоже локальный метод (ближайшие соседи), но не строит модель.</li>
        <li><b>SVR</b> — хорош на маленьких данных, требует масштабирования и тюнинга трёх параметров.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Строим лес из 3 деревьев (классификация фруктов)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Построить Random Forest из 3 деревьев для классификации фруктов (яблоко / апельсин) по весу и цвету. Пройти каждый шаг: bootstrap, выбор признаков, расчёт <a class="glossary-link" onclick="App.selectTopic('glossary-entropy')">Gini</a>, построение деревьев. Предсказать класс нового фрукта голосованием.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: исходный датасет (6 фруктов)</h4>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Вес (г)</th><th>Цвет (1-10, 1=зелёный, 10=оранж.)</th><th>Класс</th></tr>
                <tr><td>1</td><td>130</td><td>3</td><td>Яблоко</td></tr>
                <tr><td>2</td><td>170</td><td>7</td><td>Апельсин</td></tr>
                <tr><td>3</td><td>150</td><td>5</td><td>Яблоко</td></tr>
                <tr><td>4</td><td>180</td><td>8</td><td>Апельсин</td></tr>
                <tr><td>5</td><td>140</td><td>6</td><td>Яблоко</td></tr>
                <tr><td>6</td><td>160</td><td>9</td><td>Апельсин</td></tr>
              </table>
            </div>
            <div class="why">Мы берём маленький датасет, чтобы проследить КАЖДЫЙ шаг вручную. В реальности RF работает на тысячах объектов — принцип тот же.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Bootstrap-выборка для Дерева 1</h4>
            <p>Выбираем 6 строк с возвращением (каждую строку можно выбрать несколько раз):</p>
            <div class="calc">
              Случайные индексы: {1, 3, 3, 5, 6, 2}<br><br>
              Bootstrap-выборка Дерева 1:
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Вес</th><th>Цвет</th><th>Класс</th></tr>
                <tr><td>1</td><td>130</td><td>3</td><td>Яблоко</td></tr>
                <tr><td>3</td><td>150</td><td>5</td><td>Яблоко</td></tr>
                <tr><td>3</td><td>150</td><td>5</td><td>Яблоко</td></tr>
                <tr><td>5</td><td>140</td><td>6</td><td>Яблоко</td></tr>
                <tr><td>6</td><td>160</td><td>9</td><td>Апельсин</td></tr>
                <tr><td>2</td><td>170</td><td>7</td><td>Апельсин</td></tr>
              </table>
            </div>
            <div class="calc">
              OOB (не попавшие): ID 4 — эти объекты НЕ участвовали в обучении Дерева 1.<br>
              Вероятность попасть в OOB = (1 - 1/6)^6 ≈ 0.335 ≈ 33.5% (теория: 1/e ≈ 36.8%)
            </div>
            <div class="why">Bootstrap создаёт разнообразие: каждое дерево видит немного разные данные. ID 3 попал дважды — это нормально, так работает выборка с возвращением. ID 4 вообще не попал — он станет OOB для этого дерева.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: строим Дерево 1</h4>
            <p><b>3a. Выбор случайного подмножества признаков для корня.</b></p>
            <p>max_features = 1 (из 2 признаков выбираем 1). Случайно выпал: <b>Вес</b>.</p>
            <div class="why">Random Forest на каждом узле рассматривает только случайное подмножество признаков. Это создаёт разнообразие деревьев — ключевая идея алгоритма.</div>

            <p><b>3b. Ищем лучший порог разбиения по Весу.</b></p>
            <p>Отсортируем по весу: 130, 140, 150, 150, 160, 170. Пороги — середины между соседними значениями:</p>
            <div class="calc">
              Порог 135: Лево {130} → [1 Яб, 0 Ап]. Право {140,150,150,160,170} → [3 Яб, 2 Ап]<br>
              Gini(лево) = 1 - (1/1)² - (0/1)² = 1 - 1 - 0 = 0<br>
              Gini(право) = 1 - (3/5)² - (2/5)² = 1 - 0.36 - 0.16 = 0.48<br>
              Gini_split = (1/6)·0 + (5/6)·0.48 = <b>0.400</b><br><br>

              Порог 145: Лево {130,140} → [2 Яб, 0 Ап]. Право {150,150,160,170} → [2 Яб, 2 Ап]<br>
              Gini(лево) = 1 - (2/2)² - (0/2)² = 0<br>
              Gini(право) = 1 - (2/4)² - (2/4)² = 1 - 0.25 - 0.25 = 0.50<br>
              Gini_split = (2/6)·0 + (4/6)·0.50 = <b>0.333</b><br><br>

              Порог 155: Лево {130,140,150,150} → [4 Яб, 0 Ап]. Право {160,170} → [0 Яб, 2 Ап]<br>
              Gini(лево) = 0, Gini(право) = 0<br>
              Gini_split = (4/6)·0 + (2/6)·0 = <b>0.000</b> ← идеальное разбиение!<br><br>

              Порог 165: Лево {130,140,150,150,160} → [4 Яб, 1 Ап]. Право {170} → [0 Яб, 1 Ап]<br>
              Gini(лево) = 1 - (4/5)² - (1/5)² = 1 - 0.64 - 0.04 = 0.32<br>
              Gini_split = (5/6)·0.32 + (1/6)·0 = <b>0.267</b>
            </div>
            <div class="why">Gini impurity измеряет «загрязнённость» узла. 0 = идеально чистый (один класс). 0.5 = максимально смешанный (50/50). Мы ищем порог, минимизирующий взвешенный Gini по обоим потомкам.</div>

            <p><b>3c. Лучший порог: Вес ≤ 155 (Gini = 0.000).</b> Оба листа чистые — дерево готово!</p>

            <div class="illustration bordered">
              <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;">
                <text x="200" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Дерево 1</text>
                <!-- Root -->
                <rect x="120" y="30" width="160" height="36" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
                <text x="200" y="53" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">Вес ≤ 155?</text>
                <!-- Left leaf -->
                <rect x="30" y="120" width="140" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
                <text x="100" y="143" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">Яблоко (4/4)</text>
                <!-- Right leaf -->
                <rect x="230" y="120" width="140" height="36" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
                <text x="300" y="143" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="600">Апельсин (2/2)</text>
                <!-- Edges -->
                <line x1="175" y1="66" x2="100" y2="120" stroke="#22c55e" stroke-width="2"/>
                <text x="120" y="92" font-size="10" fill="#22c55e" font-weight="600">Да</text>
                <line x1="225" y1="66" x2="300" y2="120" stroke="#ef4444" stroke-width="2"/>
                <text x="275" y="92" font-size="10" fill="#ef4444" font-weight="600">Нет</text>
              </svg>
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Bootstrap и построение Дерева 2</h4>
            <div class="calc">
              Bootstrap индексы: {2, 4, 1, 6, 4, 5}<br>
              OOB: {3}
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Вес</th><th>Цвет</th><th>Класс</th></tr>
                <tr><td>2</td><td>170</td><td>7</td><td>Апельсин</td></tr>
                <tr><td>4</td><td>180</td><td>8</td><td>Апельсин</td></tr>
                <tr><td>1</td><td>130</td><td>3</td><td>Яблоко</td></tr>
                <tr><td>6</td><td>160</td><td>9</td><td>Апельсин</td></tr>
                <tr><td>4</td><td>180</td><td>8</td><td>Апельсин</td></tr>
                <tr><td>5</td><td>140</td><td>6</td><td>Яблоко</td></tr>
              </table>
            </div>
            <p>Случайный признак для корня: <b>Цвет</b> (max_features=1).</p>
            <div class="calc">
              Пороги по цвету (3,6,7,8,9):<br><br>
              Порог 4.5: Лево {3} → [1 Яб, 0 Ап]. Право {6,7,8,8,9} → [1 Яб, 3 Ап]<br>
              Gini(право) = 1 - (1/5)² - (4/5)² = 1 - 0.04 - 0.64 = 0.32 (обратите внимание: ID4 дважды → 4 апельсина)<br>
              Gini_split = (1/6)·0 + (5/6)·0.32 = <b>0.267</b><br><br>

              Порог 6.5: Лево {3,6} → [2 Яб, 0 Ап]. Право {7,8,8,9} → [0 Яб, 4 Ап]<br>
              Gini(лево) = 0, Gini(право) = 0<br>
              Gini_split = <b>0.000</b> ← снова идеально!
            </div>

            <div class="illustration bordered">
              <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;">
                <text x="200" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Дерево 2</text>
                <rect x="120" y="30" width="160" height="36" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
                <text x="200" y="53" text-anchor="middle" font-size="11" fill="#92400e" font-weight="600">Цвет ≤ 6.5?</text>
                <rect x="30" y="120" width="140" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
                <text x="100" y="143" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">Яблоко (2/2)</text>
                <rect x="230" y="120" width="140" height="36" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
                <text x="300" y="143" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="600">Апельсин (4/4)</text>
                <line x1="175" y1="66" x2="100" y2="120" stroke="#22c55e" stroke-width="2"/>
                <text x="120" y="92" font-size="10" fill="#22c55e" font-weight="600">Да</text>
                <line x1="225" y1="66" x2="300" y2="120" stroke="#ef4444" stroke-width="2"/>
                <text x="275" y="92" font-size="10" fill="#ef4444" font-weight="600">Нет</text>
              </svg>
            </div>
            <div class="why">Дерево 2 использовало другой признак (Цвет вместо Веса) и другие данные. Это — ключ к разнообразию леса: деревья смотрят на задачу под разным углом.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Bootstrap и построение Дерева 3</h4>
            <div class="calc">
              Bootstrap индексы: {3, 5, 2, 1, 6, 3}<br>
              OOB: {4}
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Вес</th><th>Цвет</th><th>Класс</th></tr>
                <tr><td>3</td><td>150</td><td>5</td><td>Яблоко</td></tr>
                <tr><td>5</td><td>140</td><td>6</td><td>Яблоко</td></tr>
                <tr><td>2</td><td>170</td><td>7</td><td>Апельсин</td></tr>
                <tr><td>1</td><td>130</td><td>3</td><td>Яблоко</td></tr>
                <tr><td>6</td><td>160</td><td>9</td><td>Апельсин</td></tr>
                <tr><td>3</td><td>150</td><td>5</td><td>Яблоко</td></tr>
              </table>
            </div>
            <p>Случайный признак для корня: <b>Вес</b>. Лучший порог:</p>
            <div class="calc">
              Отсортировано по весу: 130, 140, 150, 150, 160, 170 → [Яб, Яб, Яб, Яб, Ап, Ап]<br><br>
              Порог 155: Лево {130,140,150,150} → [4 Яб, 0 Ап]. Право {160,170} → [0 Яб, 2 Ап]<br>
              Gini_split = <b>0.000</b>
            </div>
            <p>Второй уровень не нужен — листья уже чистые.</p>
            <div class="calc">
              Но допустим max_features=1 и на корне выпал <b>Цвет</b>:<br><br>
              Порог 6.5: Лево {3,5,5,6} → [4 Яб, 0 Ап]. Право {7,9} → [0 Яб, 2 Ап]<br>
              Gini_split = <b>0.000</b>
            </div>

            <div class="illustration bordered">
              <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;">
                <text x="200" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Дерево 3</text>
                <rect x="120" y="30" width="160" height="36" rx="8" fill="#f3e8ff" stroke="#a855f7" stroke-width="2"/>
                <text x="200" y="53" text-anchor="middle" font-size="11" fill="#6b21a8" font-weight="600">Цвет ≤ 6.5?</text>
                <rect x="30" y="120" width="140" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
                <text x="100" y="143" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">Яблоко (4/4)</text>
                <rect x="230" y="120" width="140" height="36" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
                <text x="300" y="143" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="600">Апельсин (2/2)</text>
                <line x1="175" y1="66" x2="100" y2="120" stroke="#22c55e" stroke-width="2"/>
                <text x="120" y="92" font-size="10" fill="#22c55e" font-weight="600">Да</text>
                <line x1="225" y1="66" x2="300" y2="120" stroke="#ef4444" stroke-width="2"/>
                <text x="275" y="92" font-size="10" fill="#ef4444" font-weight="600">Нет</text>
              </svg>
            </div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: новый фрукт — голосование леса</h4>
            <p>Новый объект: <b>Вес = 160, Цвет = 5</b>. Прогоняем через все 3 дерева:</p>
            <div class="calc">
              <b>Дерево 1</b> (Вес ≤ 155?): 160 > 155 → ПРАВЫЙ лист → <b>Апельсин</b><br><br>
              <b>Дерево 2</b> (Цвет ≤ 6.5?): 5 ≤ 6.5 → ЛЕВЫЙ лист → <b>Яблоко</b><br><br>
              <b>Дерево 3</b> (Цвет ≤ 6.5?): 5 ≤ 6.5 → ЛЕВЫЙ лист → <b>Яблоко</b>
            </div>
            <div class="calc">
              Голосование:<br>
              Яблоко: 2 голоса (Дерево 2, Дерево 3)<br>
              Апельсин: 1 голос (Дерево 1)<br><br>
              Итого: <b>Яблоко</b> побеждает 2:1
            </div>
            <div class="why">Деревья «не согласны» — это нормально и полезно! Дерево 1 смотрит только на Вес (160 — тяжеловат для яблока), а Деревья 2 и 3 — на Цвет (5 — типичный для яблока). Большинство побеждает, и разнообразие мнений повышает качество.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7: OOB-оценка качества</h4>
            <p>Для каждого объекта предсказываем только теми деревьями, которые его НЕ видели:</p>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Истинный класс</th><th>OOB-деревья</th><th>OOB-предсказания</th><th>OOB-результат</th><th>Верно?</th></tr>
                <tr><td>4</td><td>Апельсин</td><td>Дерево 1, Дерево 3</td><td>Д1: Вес 180>155→Ап; Д3: Цвет 8>6.5→Ап</td><td>Апельсин (2:0)</td><td>Да</td></tr>
                <tr><td>3</td><td>Яблоко</td><td>Дерево 2</td><td>Д2: Цвет 5≤6.5→Яб</td><td>Яблоко (1:0)</td><td>Да</td></tr>
              </table>
            </div>
            <div class="calc">
              OOB Accuracy = 2/2 = 100% (на тех объектах, которые имеют OOB-деревья)<br>
              Примечание: с 3 деревьями OOB покрывает не все объекты. С 100+ деревьями каждый объект будет OOB примерно для 37 деревьев.
            </div>
            <div class="why">OOB-оценка — это «бесплатная» кросс-валидация. Каждый объект оценивается деревьями, которые его не видели при обучении. Не нужно выделять отдельный тестовый набор!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Random Forest из 3 деревьев: Дерево 1 разрезает по Весу ≤ 155, Деревья 2 и 3 — по Цвету ≤ 6.5. Новый фрукт (160 г, цвет 5) классифицирован как Яблоко (2:1). Каждое дерево обучено на своём bootstrap, с случайным подмножеством признаков — это создаёт разнообразие и устойчивость.</p>
          </div>
        `,
      },
      {
        title: 'Feature Importance пошагово (Gini decrease)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Вычислить важность каждого признака (Вес и Цвет) по среднему уменьшению Gini (MDI) по всем 3 деревьям из предыдущего примера. Показать расчёт для каждого дерева отдельно, затем усреднить.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: формула Gini Importance для одного узла</h4>
            <div class="calc">
              Importance(узел) = w_узел · Gini_узел − w_лево · Gini_лево − w_право · Gini_право<br><br>
              где w = (число объектов в узле) / (общее число объектов в дереве)
            </div>
            <div class="why">Gini Importance показывает, насколько данное разбиение «очистило» узлы. Чем больше уменьшение Gini, тем важнее признак, по которому было сделано разбиение.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Gini decrease в Дереве 1 (разрез по Весу ≤ 155)</h4>
            <div class="calc">
              Корень: 6 объектов, 4 Яблока, 2 Апельсина<br>
              Gini(корень) = 1 - (4/6)² - (2/6)² = 1 - 0.444 - 0.111 = <b>0.444</b><br><br>
              Левый лист: 4 объекта, все Яблоко → Gini = 0<br>
              Правый лист: 2 объекта, все Апельсин → Gini = 0<br><br>
              Gini decrease = 0.444 - (4/6)·0 - (2/6)·0 = <b>0.444</b><br><br>
              Весь этот decrease приписывается признаку <b>Вес</b>:<br>
              Imp_Дерево1(Вес) = 0.444<br>
              Imp_Дерево1(Цвет) = 0 (не использован)
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Gini decrease в Дереве 2 (разрез по Цвету ≤ 6.5)</h4>
            <div class="calc">
              Корень: 6 объектов, 2 Яблока, 4 Апельсина<br>
              Gini(корень) = 1 - (2/6)² - (4/6)² = 1 - 0.111 - 0.444 = <b>0.444</b><br><br>
              Левый лист: 2 Яблока → Gini = 0. Правый лист: 4 Апельсина → Gini = 0<br><br>
              Gini decrease = 0.444 - 0 - 0 = <b>0.444</b><br><br>
              Imp_Дерево2(Вес) = 0<br>
              Imp_Дерево2(Цвет) = 0.444
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Gini decrease в Дереве 3 (разрез по Цвету ≤ 6.5)</h4>
            <div class="calc">
              Корень: 6 объектов, 4 Яблока, 2 Апельсина<br>
              Gini(корень) = 1 - (4/6)² - (2/6)² = <b>0.444</b><br><br>
              Gini decrease = 0.444<br><br>
              Imp_Дерево3(Вес) = 0<br>
              Imp_Дерево3(Цвет) = 0.444
            </div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: усреднение по всем деревьям</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Признак</th><th>Дерево 1</th><th>Дерево 2</th><th>Дерево 3</th><th>Среднее</th><th>Нормализ.</th></tr>
                <tr><td>Вес</td><td>0.444</td><td>0</td><td>0</td><td>0.148</td><td><b>0.333</b></td></tr>
                <tr><td>Цвет</td><td>0</td><td>0.444</td><td>0.444</td><td>0.296</td><td><b>0.667</b></td></tr>
              </table>
            </div>
            <div class="calc">
              Среднее(Вес) = (0.444 + 0 + 0) / 3 = 0.148<br>
              Среднее(Цвет) = (0 + 0.444 + 0.444) / 3 = 0.296<br><br>
              Нормализация (чтобы сумма = 1):<br>
              Imp(Вес) = 0.148 / (0.148 + 0.296) = 0.148 / 0.444 = <b>0.333</b><br>
              Imp(Цвет) = 0.296 / 0.444 = <b>0.667</b>
            </div>
            <div class="why">Цвет оказался в 2 раза важнее Веса (0.667 vs 0.333). Это логично: Цвет использовали 2 из 3 деревьев. Но MDI может быть ненадёжен — признак может казаться важным просто потому, что у него много уникальных значений (больше возможных порогов). Permutation Importance надёжнее.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>MDI Feature Importance: Цвет = 0.667 (использован 2 деревьями), Вес = 0.333 (использован 1 деревом). Цвет в 2 раза важнее в данном лесе. В реальности с сотнями деревьев оба признака будут использованы многократно, и оценки стабилизируются.</p>
          </div>
        `,
      },
      {
        title: 'Почему лес лучше одного дерева (overfit vs stable)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить одно глубокое дерево с лесом из 3 деревьев на тех же данных. Показать, как одно дерево переобучается, а лес остаётся устойчивым при добавлении шумного объекта.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: исходные данные + шумный объект</h4>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Вес</th><th>Цвет</th><th>Класс</th><th>Примечание</th></tr>
                <tr><td>1</td><td>130</td><td>3</td><td>Яблоко</td><td></td></tr>
                <tr><td>2</td><td>170</td><td>7</td><td>Апельсин</td><td></td></tr>
                <tr><td>3</td><td>150</td><td>5</td><td>Яблоко</td><td></td></tr>
                <tr><td>4</td><td>180</td><td>8</td><td>Апельсин</td><td></td></tr>
                <tr><td>5</td><td>140</td><td>6</td><td>Яблоко</td><td></td></tr>
                <tr><td>6</td><td>160</td><td>9</td><td>Апельсин</td><td></td></tr>
                <tr><td style="color:#ef4444">7</td><td style="color:#ef4444">155</td><td style="color:#ef4444">8</td><td style="color:#ef4444">Яблоко</td><td style="color:#ef4444">ШУМ (ошибка разметки!)</td></tr>
              </table>
            </div>
            <div class="why">Объект 7 — аномалия: вес 155 и цвет 8 типичны для апельсина, но размечен как яблоко (например, ошибка оператора). Как модели справятся с этим шумом?</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: одно глубокое дерево (без ограничений)</h4>
            <p>Строим дерево на ВСЕХ данных, без ограничения глубины:</p>
            <div class="illustration bordered">
              <svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
                <text x="260" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Одно глубокое дерево (переобучение)</text>
                <!-- Root -->
                <rect x="180" y="30" width="160" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
                <text x="260" y="50" text-anchor="middle" font-size="10" fill="#1e40af" font-weight="600">Цвет ≤ 6.5?</text>
                <!-- Left: pure apple -->
                <rect x="30" y="100" width="120" height="28" rx="6" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5"/>
                <text x="90" y="118" text-anchor="middle" font-size="10" fill="#166534">Яблоко (3/3)</text>
                <!-- Right subtree -->
                <rect x="320" y="100" width="160" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
                <text x="400" y="120" text-anchor="middle" font-size="10" fill="#1e40af" font-weight="600">Вес ≤ 157?</text>
                <!-- Right-Left: the noisy split -->
                <rect x="260" y="180" width="110" height="28" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                <text x="315" y="198" text-anchor="middle" font-size="9" fill="#92400e" font-weight="600">Яблоко (1/1) !</text>
                <!-- Right-Right -->
                <rect x="400" y="180" width="110" height="28" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
                <text x="455" y="198" text-anchor="middle" font-size="10" fill="#991b1b">Апельсин (3/3)</text>
                <!-- Edges -->
                <line x1="220" y1="60" x2="90" y2="100" stroke="#22c55e" stroke-width="1.5"/>
                <line x1="300" y1="60" x2="400" y2="100" stroke="#ef4444" stroke-width="1.5"/>
                <line x1="360" y1="130" x2="315" y2="180" stroke="#f59e0b" stroke-width="1.5"/>
                <line x1="440" y1="130" x2="455" y2="180" stroke="#ef4444" stroke-width="1.5"/>
                <!-- Noise annotation -->
                <text x="315" y="230" text-anchor="middle" font-size="9" fill="#ef4444">← отдельный лист для шума!</text>
              </svg>
            </div>
            <div class="calc">
              Дерево создало специальный лист для объекта 7 (Вес ≤ 157, Цвет > 6.5 → Яблоко).<br>
              Это чистый overfit: модель «запомнила» шумный объект вместо обобщения.
            </div>
            <div class="why">Глубокое дерево без ограничений стремится к 100% accuracy на обучающих данных. Каждый объект получает свой лист — дерево «заучивает» шум. На новых данных это приведёт к ошибкам.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: лес из 3 деревьев на тех же данных</h4>
            <div class="calc">
              Bootstrap 1: {1,3,5,2,6,4,7} → объект 7 попал в выборку<br>
              Bootstrap 2: {2,4,1,6,3,5,2} → объект 7 НЕ попал (OOB)<br>
              Bootstrap 3: {3,5,6,4,2,1,5} → объект 7 НЕ попал (OOB)<br><br>
              Деревья 2 и 3 вообще не видели шумный объект!<br>
              Дерево 1 видело его, но среди 7 объектов один шумный — менее влиятельно.
            </div>
            <div class="why">Bootstrap автоматически защищает от шума: каждый конкретный шумный объект попадает только в ~63% деревьев. Остальные ~37% деревьев его не видели — они «чистые».</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: предсказание для объекта, похожего на шумный</h4>
            <p>Тест: <b>Вес = 156, Цвет = 8</b> (похож на шумный объект 7).</p>
            <div class="calc">
              <b>Одно глубокое дерево</b>:<br>
              Цвет 8 > 6.5 → правый. Вес 156 ≤ 157 → <b>Яблоко</b> (НЕВЕРНО! Это типичный апельсин)<br><br>

              <b>Лес:</b><br>
              Дерево 1 (допустим разрез по Весу ≤ 155): 156 > 155 → Апельсин<br>
              Дерево 2 (разрез по Цвету ≤ 6.5): 8 > 6.5 → Апельсин<br>
              Дерево 3 (разрез по Цвету ≤ 6.5): 8 > 6.5 → Апельсин<br><br>
              Голосование: <b>Апельсин</b> 3:0 (ВЕРНО!)
            </div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: количественное сравнение</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Метрика</th><th>Одно дерево</th><th>Лес (3 дерева)</th></tr>
                <tr><td>Train Accuracy</td><td>100% (заучил всё)</td><td>~95% (здоровое обобщение)</td></tr>
                <tr><td>Test на объект (156, 8)</td><td>Яблоко (ОШИБКА)</td><td>Апельсин (ВЕРНО)</td></tr>
                <tr><td>Устойчивость к шуму</td><td>Нет</td><td>Да</td></tr>
                <tr><td>Дисперсия предсказаний</td><td>Высокая</td><td>Низкая</td></tr>
              </table>
            </div>
            <div class="why">Лес побеждает за счёт двух механизмов: (1) Bootstrap — разные деревья видят разные подмножества шума; (2) Случайные признаки — деревья «смотрят» на задачу под разным углом. Усреднение «гасит» индивидуальные ошибки. Математически: Var(среднее) = Var(одного) / n при независимых деревьях.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Одно глубокое дерево создаёт отдельный лист для шумного объекта (overfit). Лес из 3 деревьев: 2 из 3 деревьев вообще не видели шумный объект, все 3 правильно классифицируют похожий тестовый объект как Апельсин. Лес снижает дисперсию через усреднение независимых ошибок.</p>
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: RF регрессия</h3>
        <p>Увеличивай число деревьев и глубину. Наблюдай, как усреднение сглаживает предсказание.</p>
        <div class="sim-container">
          <div class="sim-controls" id="rfr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="rfr-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="rfr-chart"></canvas></div>
            <div class="sim-stats" id="rfr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#rfr-controls');
        const cTrees = App.makeControl('range', 'rfr-trees', 'Число деревьев', { min: 1, max: 50, step: 1, value: 10 });
        const cDepth = App.makeControl('range', 'rfr-depth', 'Макс. глубина', { min: 1, max: 8, step: 1, value: 4 });
        [cTrees, cDepth].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let dataX = [], dataY = [];
        const N = 100;

        function generate() {
          dataX = []; dataY = [];
          for (let i = 0; i < N; i++) {
            const x = Math.random() * 2 * Math.PI;
            dataX.push(x);
            dataY.push(Math.sin(x) + App.Util.randn(0, 0.5));
          }
          update();
        }

        function buildTree(xs, ys, depth, maxDepth) {
          if (depth >= maxDepth || xs.length < 4) return { val: App.Util.mean(ys) };
          let bestMSE = Infinity, bestThr = 0;
          // random feature subset: pick random subset of split candidates
          const indices = xs.map((_, i) => i);
          const nCand = Math.max(4, Math.floor(xs.length * 0.6));
          for (let t = 0; t < nCand; t++) {
            const idx = indices[Math.floor(Math.random() * indices.length)];
            const thr = xs[idx];
            const lY = [], rY = [];
            for (let j = 0; j < xs.length; j++) {
              if (xs[j] <= thr) lY.push(ys[j]); else rY.push(ys[j]);
            }
            if (lY.length === 0 || rY.length === 0) continue;
            const mL = App.Util.mean(lY), mR = App.Util.mean(rY);
            let mse = 0;
            for (const v of lY) mse += (v - mL) ** 2;
            for (const v of rY) mse += (v - mR) ** 2;
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

        function predictTree(tree, x) {
          if (tree.val !== undefined) return tree.val;
          return x <= tree.thr ? predictTree(tree.left, x) : predictTree(tree.right, x);
        }

        function update() {
          const nTrees = +cTrees.input.value;
          const maxDepth = +cDepth.input.value;

          // bootstrap + build trees
          const trees = [];
          for (let t = 0; t < nTrees; t++) {
            const bx = [], by = [];
            for (let i = 0; i < dataX.length; i++) {
              const idx = Math.floor(Math.random() * dataX.length);
              bx.push(dataX[idx]);
              by.push(dataY[idx]);
            }
            trees.push(buildTree(bx, by, 0, maxDepth));
          }

          const gridX = App.Util.linspace(0, 2 * Math.PI, 300);
          const predY = gridX.map(gx => {
            let s = 0;
            for (const tree of trees) s += predictTree(tree, gx);
            return s / nTrees;
          });

          let mse = 0;
          for (let i = 0; i < dataX.length; i++) {
            let s = 0;
            for (const tree of trees) s += predictTree(tree, dataX[i]);
            const pred = s / nTrees;
            mse += (dataY[i] - pred) ** 2;
          }
          mse /= dataX.length;

          const scatter = dataX.map((x, i) => ({ x, y: dataY[i] }));
          const curve = gridX.map((x, i) => ({ x, y: predY[i] }));
          const trueCurve = gridX.map(x => ({ x, y: Math.sin(x) }));

          const ctx = container.querySelector('#rfr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Данные', data: scatter, backgroundColor: 'rgba(99,102,241,0.4)', pointRadius: 4 },
                { label: 'RF предсказание', data: curve, type: 'line', borderColor: 'rgba(239,68,68,0.9)', borderWidth: 2, pointRadius: 0, fill: false, showLine: true },
                { label: 'sin(x)', data: trueCurve, type: 'line', borderColor: 'rgba(16,185,129,0.6)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, showLine: true },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Random Forest регрессия' } },
              scales: { x: { type: 'linear', min: 0, max: 6.5 }, y: { suggestedMin: -2.5, suggestedMax: 2.5 } },
            },
          });
          App.registerChart(chart);

          container.querySelector('#rfr-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Деревьев</div><div class="stat-value">${nTrees}</div></div>
            <div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${mse.toFixed(4)}</div></div>
          `;
        }

        [cTrees, cDepth].forEach(c => c.input.addEventListener('input', update));
        container.querySelector('#rfr-regen').onclick = generate;
        generate();
      },
    },

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

    applications: `
      <h3>Где применяется Random Forest Regression</h3>
      <table>
        <tr><th>Область</th><th>Задача</th></tr>
        <tr><td><b>Недвижимость</b></td><td>Оценка стоимости квартир/домов (Zillow Zestimate частично RF)</td></tr>
        <tr><td><b>Финансы</b></td><td>Прогноз доходности, дефолтов, оценка рисков</td></tr>
        <tr><td><b>Медицина</b></td><td>Прогноз длительности лечения, дозировок, риска осложнений</td></tr>
        <tr><td><b>Биоинформатика</b></td><td>Предсказание свойств белков, активности молекул</td></tr>
        <tr><td><b>Экология</b></td><td>Моделирование распределения видов, прогноз урожайности</td></tr>
        <tr><td><b>Feature importance</b></td><td>Быстрый способ узнать, какие признаки важны (EDA этап)</td></tr>
        <tr><td><b>Бейзлайн для табличных данных</b></td><td>Работает из коробки, почти не требует настройки</td></tr>
      </table>
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

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=J4Wdy0Wc_xQ" target="_blank">StatQuest: Random Forests</a> — принцип работы случайного леса для регрессии и классификации</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=random%20forest%20%D1%80%D0%B5%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D1%8F" target="_blank">Random Forest на Habr</a> — разбор алгоритма и параметров на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html" target="_blank">sklearn: RandomForestRegressor</a> — документация случайного леса для регрессии</li>
      </ul>
    `,
  },
});
