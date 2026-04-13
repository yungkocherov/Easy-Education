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
          <rect x="145" y="188" width="240" height="24" rx="5" fill="#6366f1"/>
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

      <h4>1. <a class="glossary-link" onclick="App.selectTopic('glossary-bootstrap')">Bootstrap</a>-выборки (bagging)</h4>
      <p>Каждое дерево обучается на <span class="term" data-tip="Bootstrap. Случайная выборка с возвращением того же размера n. Примерно 63.2% уникальных объектов попадёт в выборку, остальные 36.8% — OOB (out-of-bag).">bootstrap-подвыборке</span> из всего датасета: n примеров берётся случайно с возвращением. Примерно треть всех примеров не попадёт в обучение конкретного дерева — это <b>OOB (Out-Of-Bag)</b> данные.</p>

      <h4>2. Случайные признаки (feature subsampling)</h4>
      <p>В каждом узле дерева вместо всех p признаков рассматривается только случайное подмножество размером <b>max_features</b>. По умолчанию для регрессии: $\\text{max\_features} = p/3$ или $\\sqrt{p}$. Это делает деревья более разнообразными.</p>

      <h3>📈 <a class="glossary-link" onclick="App.selectTopic('glossary-bootstrap')">OOB оценка</a> — бесплатная кросс-валидация</h3>
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
        title: 'Строим лес из 3 деревьев (регрессия: цена квартиры)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Построить Random Forest из 3 деревьев для регрессии цены квартиры по площади и возрасту. Пройти каждый шаг: bootstrap, выбор признаков, расчёт <b>MSE</b>, построение деревьев. Предсказать цену нового объекта усреднением.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: исходный датасет (6 квартир)</h4>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Площадь (м²)</th><th>Возраст (лет)</th><th>Цена (млн ₽)</th></tr>
                <tr><td>1</td><td>40</td><td>20</td><td>5.0</td></tr>
                <tr><td>2</td><td>55</td><td>10</td><td>8.0</td></tr>
                <tr><td>3</td><td>48</td><td>15</td><td>6.2</td></tr>
                <tr><td>4</td><td>75</td><td>5</td><td>12.0</td></tr>
                <tr><td>5</td><td>62</td><td>8</td><td>9.5</td></tr>
                <tr><td>6</td><td>85</td><td>3</td><td>14.0</td></tr>
              </table>
            </div>
            <div class="why">В регрессии цель — число (цена), а не категория. В каждом листе дерева будет среднее по попавшим туда объектам. Критерий разбиения — не Gini, а уменьшение MSE.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Bootstrap-выборка для Дерева 1</h4>
            <p>Выбираем 6 строк с возвращением (каждую строку можно выбрать несколько раз):</p>
            <div class="calc">
              Случайные индексы: {1, 1, 3, 5, 2, 6} → OOB: {4}
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Площадь</th><th>Возраст</th><th>Цена</th></tr>
                <tr><td>1</td><td>40</td><td>20</td><td>5.0</td></tr>
                <tr><td>1</td><td>40</td><td>20</td><td>5.0</td></tr>
                <tr><td>3</td><td>48</td><td>15</td><td>6.2</td></tr>
                <tr><td>5</td><td>62</td><td>8</td><td>9.5</td></tr>
                <tr><td>2</td><td>55</td><td>10</td><td>8.0</td></tr>
                <tr><td>6</td><td>85</td><td>3</td><td>14.0</td></tr>
              </table>
            </div>
            <div class="why">Bootstrap создаёт разнообразие: каждое дерево видит немного разные данные. ID 1 попал дважды — так работает выборка с возвращением. ID 4 не попал вовсе и станет OOB для этого дерева. Вероятность быть OOB ≈ (1-1/6)⁶ ≈ 0.335.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: строим Дерево 1 (признак — Площадь)</h4>
            <p>max_features = 1 из 2. Случайно выпал: <b>Площадь</b>.</p>
            <div class="why">Random Forest на каждом узле рассматривает только случайное подмножество признаков. Это создаёт разнообразие деревьев — ключевая идея алгоритма.</div>

            <p>Отсортируем по площади: 40, 40, 48, 55, 62, 85 → цены: 5.0, 5.0, 6.2, 8.0, 9.5, 14.0. Среднее ȳ = 47.7/6 ≈ 7.95. Пороги — середины между соседними уникальными значениями.</p>
            <div class="calc">
              <b>Порог 44:</b> Лево {40,40}→ȳ=5.0, MSE=0. Право {48,55,62,85}→ȳ=9.425, MSE≈8.338<br>
              Weighted MSE = (2/6)·0 + (4/6)·8.338 = <b>5.559</b><br><br>

              <b>Порог 51.5:</b> Лево {40,40,48}→ȳ=5.4, MSE=0.32. Право {55,62,85}→ȳ=10.5, MSE=6.5<br>
              Weighted MSE = (3/6)·0.32 + (3/6)·6.5 = <b>3.410</b><br><br>

              <b>Порог 58.5:</b> Лево {40,40,48,55}→ȳ=6.05, MSE≈1.508. Право {62,85}→ȳ=11.75, MSE≈5.063<br>
              Weighted MSE = (4/6)·1.508 + (2/6)·5.063 = <b>2.693</b> ← минимум<br><br>

              <b>Порог 73.5:</b> Лево {40,40,48,55,62}→ȳ=6.74, MSE≈3.110. Право {85}→ȳ=14, MSE=0<br>
              Weighted MSE = (5/6)·3.110 = <b>2.592</b>
            </div>
            <div class="why">Критерий в регрессии — минимизация взвешенного MSE. Для каждого кандидатного порога считаем дисперсию цен в левом и правом листе, взвешиваем по доле объектов. Порог 73.5 формально лучший (2.59), но даёт вырожденный 5:1 сплит. Для наглядности выберем 58.5 — сбалансированный 4:2 сплит с MSE = 2.693.</div>

            <p><b>Итог:</b> Площадь ≤ 58.5 → левый лист ŷ = <b>6.05 млн</b>, правый лист ŷ = <b>11.75 млн</b>.</p>

            <div class="illustration bordered">
              <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
                <text x="210" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Дерево 1</text>
                <rect x="130" y="30" width="160" height="36" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
                <text x="210" y="53" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">Площадь ≤ 58.5?</text>
                <rect x="30" y="120" width="150" height="36" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
                <text x="105" y="143" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">ŷ = 6.05 млн</text>
                <rect x="240" y="120" width="150" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
                <text x="315" y="143" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">ŷ = 11.75 млн</text>
                <line x1="185" y1="66" x2="105" y2="120" stroke="#3b82f6" stroke-width="2"/>
                <text x="125" y="92" font-size="10" fill="#3b82f6" font-weight="600">Да</text>
                <line x1="235" y1="66" x2="315" y2="120" stroke="#22c55e" stroke-width="2"/>
                <text x="290" y="92" font-size="10" fill="#22c55e" font-weight="600">Нет</text>
              </svg>
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Bootstrap и Дерево 2 (признак — Возраст)</h4>
            <div class="calc">
              Bootstrap индексы: {2, 4, 1, 6, 4, 5} → OOB: {3}
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Площадь</th><th>Возраст</th><th>Цена</th></tr>
                <tr><td>2</td><td>55</td><td>10</td><td>8.0</td></tr>
                <tr><td>4</td><td>75</td><td>5</td><td>12.0</td></tr>
                <tr><td>1</td><td>40</td><td>20</td><td>5.0</td></tr>
                <tr><td>6</td><td>85</td><td>3</td><td>14.0</td></tr>
                <tr><td>4</td><td>75</td><td>5</td><td>12.0</td></tr>
                <tr><td>5</td><td>62</td><td>8</td><td>9.5</td></tr>
              </table>
            </div>
            <p>Случайный признак для корня: <b>Возраст</b>. Отсортировано по возрасту: 3, 5, 5, 8, 10, 20 (цены: 14, 12, 12, 9.5, 8, 5).</p>
            <div class="calc">
              <b>Порог 4:</b> Лево {3}→ȳ=14, MSE=0. Право {5,5,8,10,20}→ȳ=9.3, MSE=6.96<br>
              Weighted MSE = (5/6)·6.96 = <b>5.800</b><br><br>

              <b>Порог 6.5:</b> Лево {3,5,5}→ȳ=12.667, MSE≈0.889. Право {8,10,20}→ȳ=7.5, MSE≈3.5<br>
              Weighted MSE = (3/6)·0.889 + (3/6)·3.5 = <b>2.194</b> ← минимум<br><br>

              <b>Порог 9:</b> Лево {3,5,5,8}→ȳ=11.875, MSE≈2.547. Право {10,20}→ȳ=6.5, MSE=2.25<br>
              Weighted MSE = (4/6)·2.547 + (2/6)·2.25 = <b>2.448</b>
            </div>
            <p><b>Итог:</b> Возраст ≤ 6.5 → левый лист ŷ = <b>12.67 млн</b>, правый лист ŷ = <b>7.50 млн</b>.</p>

            <div class="illustration bordered">
              <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
                <text x="210" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Дерево 2</text>
                <rect x="130" y="30" width="160" height="36" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
                <text x="210" y="53" text-anchor="middle" font-size="11" fill="#92400e" font-weight="600">Возраст ≤ 6.5?</text>
                <rect x="30" y="120" width="150" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
                <text x="105" y="143" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">ŷ = 12.67 млн</text>
                <rect x="240" y="120" width="150" height="36" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
                <text x="315" y="143" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">ŷ = 7.50 млн</text>
                <line x1="185" y1="66" x2="105" y2="120" stroke="#22c55e" stroke-width="2"/>
                <text x="125" y="92" font-size="10" fill="#22c55e" font-weight="600">Да</text>
                <line x1="235" y1="66" x2="315" y2="120" stroke="#3b82f6" stroke-width="2"/>
                <text x="290" y="92" font-size="10" fill="#3b82f6" font-weight="600">Нет</text>
              </svg>
            </div>
            <div class="why">Дерево 2 разрезает по Возрасту — новые квартиры дороже. Это противоположный взгляд, чем у Дерева 1 (которое смотрело на Площадь). Разнообразие деревьев — ключ к качеству ансамбля.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Bootstrap и Дерево 3 (снова — Возраст, другой порог)</h4>
            <div class="calc">
              Bootstrap индексы: {1, 3, 5, 2, 4, 6} → OOB: нет (все попали)
            </div>
            <p>Данные — исходная таблица без повторов. Случайный признак: <b>Возраст</b>. Отсортировано по возрасту: 3, 5, 8, 10, 15, 20 (цены: 14, 12, 9.5, 8, 6.2, 5).</p>
            <div class="calc">
              <b>Порог 9:</b> Лево {3,5,8}→ȳ=11.833, MSE≈3.389. Право {10,15,20}→ȳ=6.4, MSE≈1.52<br>
              Weighted MSE = (3/6)·3.389 + (3/6)·1.52 = <b>2.455</b> ← выберем для баланса<br><br>

              <b>Порог 12.5:</b> Лево {3,5,8,10}→ȳ=10.875, MSE≈4.422. Право {15,20}→ȳ=5.6, MSE≈0.36<br>
              Weighted MSE ≈ <b>3.068</b>
            </div>
            <p><b>Итог:</b> Возраст ≤ 9 → левый лист ŷ = <b>11.83 млн</b>, правый лист ŷ = <b>6.40 млн</b>.</p>

            <div class="illustration bordered">
              <svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
                <text x="210" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">Дерево 3</text>
                <rect x="130" y="30" width="160" height="36" rx="8" fill="#f3e8ff" stroke="#a855f7" stroke-width="2"/>
                <text x="210" y="53" text-anchor="middle" font-size="11" fill="#6b21a8" font-weight="600">Возраст ≤ 9?</text>
                <rect x="30" y="120" width="150" height="36" rx="8" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
                <text x="105" y="143" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">ŷ = 11.83 млн</text>
                <rect x="240" y="120" width="150" height="36" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
                <text x="315" y="143" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">ŷ = 6.40 млн</text>
                <line x1="185" y1="66" x2="105" y2="120" stroke="#22c55e" stroke-width="2"/>
                <text x="125" y="92" font-size="10" fill="#22c55e" font-weight="600">Да</text>
                <line x1="235" y1="66" x2="315" y2="120" stroke="#3b82f6" stroke-width="2"/>
                <text x="290" y="92" font-size="10" fill="#3b82f6" font-weight="600">Нет</text>
              </svg>
            </div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: новый объект — усреднение леса</h4>
            <p>Новая квартира: <b>Площадь = 60 м², Возраст = 7 лет</b>. Прогоняем через все 3 дерева:</p>
            <div class="calc">
              <b>Дерево 1</b> (Площадь ≤ 58.5?): 60 &gt; 58.5 → правый лист → <b>11.75 млн</b><br><br>
              <b>Дерево 2</b> (Возраст ≤ 6.5?): 7 &gt; 6.5 → правый лист → <b>7.50 млн</b><br><br>
              <b>Дерево 3</b> (Возраст ≤ 9?): 7 ≤ 9 → левый лист → <b>11.83 млн</b>
            </div>
            <div class="calc">
              Усреднение предсказаний (для регрессии — не голосование, а <b>среднее</b>):<br>
              ŷ = (11.75 + 7.50 + 11.83) / 3 = 31.08 / 3 ≈ <b>10.36 млн ₽</b>
            </div>
            <div class="why">Три дерева дают разные оценки — от 7.5 до 11.83. Усреднение сглаживает эти разногласия. Для квартиры 60 м² / 7 лет финальная оценка ~10.4 млн — в середине между «молодой большой» (14) и «старой маленькой» (5).</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7: OOB-оценка (MSE вместо Accuracy)</h4>
            <p>Для каждого объекта предсказываем только теми деревьями, которые его не видели:</p>
            <div class="example-data-table">
              <table>
                <tr><th>ID</th><th>Цена</th><th>OOB-деревья</th><th>OOB-предсказания</th><th>OOB ŷ</th><th>Ошибка</th></tr>
                <tr><td>4</td><td>12.0</td><td>Д1 (OOB)</td><td>Д1: площадь 75 &gt; 58.5 → 11.75</td><td>11.75</td><td>+0.25</td></tr>
                <tr><td>3</td><td>6.2</td><td>Д2 (OOB)</td><td>Д2: возраст 15 &gt; 6.5 → 7.50</td><td>7.50</td><td>−1.30</td></tr>
              </table>
            </div>
            <div class="calc">
              OOB MSE = (0.25² + 1.30²) / 2 = (0.0625 + 1.69) / 2 = <b>0.876</b><br>
              OOB RMSE ≈ 0.936 млн ₽
            </div>
            <div class="why">OOB-оценка — это «бесплатная» кросс-валидация. С 3 деревьями покрытие OOB небольшое, но при 100+ деревьях каждый объект оценивается ~37 деревьями, дающими надёжную метрику без отдельного test-сета.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Random Forest из 3 деревьев: Дерево 1 разрезает по Площади ≤ 58.5, Деревья 2 и 3 — по Возрасту (6.5 и 9). Для новой квартиры (60 м², 7 лет) три дерева дают 11.75, 7.50 и 11.83; усреднение: <b>ŷ ≈ 10.36 млн ₽</b>. Усреднение деревьев с разными bootstrap-выборками и случайными признаками сглаживает дисперсию и защищает от переобучения.</p>
          </div>
        `,
      },
      {
        title: 'Feature Importance для регрессии (MSE decrease)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Вычислить важность признаков (Площадь и Возраст) по среднему уменьшению MSE (MDI) по 3 деревьям из предыдущего примера. В регрессии MDI считается как <b>weighted MSE parent</b> − <b>weighted MSE children</b>, взвешенное по доле объектов в узле.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: формула MSE Importance</h4>
            <div class="calc">
              Importance(узел) = w_узел · (MSE_узел − w_L·MSE_L − w_R·MSE_R)<br><br>
              где w_узел = n_узла / n_root (доля объектов в корне, на которую приходится этот узел)<br>
              MSE узла = (1/n) Σ(y − ȳ)²
            </div>
            <div class="why">В регрессионных деревьях «чистота» узла — это дисперсия цен. Чем больше разбиение снижает дисперсию, тем важнее признак. Это прямой аналог Gini decrease из классификации.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: MSE decrease в Дереве 1 (Площадь ≤ 58.5)</h4>
            <div class="calc">
              Цены в корне: {5, 5, 6.2, 8, 9.5, 14}, ȳ = 7.95<br>
              MSE(корень) = ((5−7.95)² + (5−7.95)² + (6.2−7.95)² + (8−7.95)² + (9.5−7.95)² + (14−7.95)²)/6<br>
              = (8.70 + 8.70 + 3.06 + 0.003 + 2.40 + 36.60)/6 ≈ 59.47/6 ≈ <b>9.912</b><br><br>

              Левый лист (4 объекта): MSE_L ≈ 1.508<br>
              Правый лист (2 объекта): MSE_R ≈ 5.063<br>
              Weighted children = (4/6)·1.508 + (2/6)·5.063 = 2.693<br><br>

              MSE decrease = 9.912 − 2.693 = <b>7.219</b><br>
              Imp_Д1(Площадь) = 7.219<br>
              Imp_Д1(Возраст) = 0 (не использован)
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: MSE decrease в Дереве 2 (Возраст ≤ 6.5)</h4>
            <div class="calc">
              Цены в корне: {8, 12, 5, 14, 12, 9.5}, ȳ = 10.083<br>
              MSE(корень) = ((8−10.083)² + (12−10.083)² + (5−10.083)² + (14−10.083)² + (12−10.083)² + (9.5−10.083)²)/6<br>
              ≈ (4.34 + 3.67 + 25.84 + 15.34 + 3.67 + 0.34)/6 ≈ 53.20/6 ≈ <b>8.867</b><br><br>

              Левый лист (3): MSE_L ≈ 0.889. Правый лист (3): MSE_R = 3.5<br>
              Weighted children = (3/6)·0.889 + (3/6)·3.5 = 2.194<br><br>

              MSE decrease = 8.867 − 2.194 = <b>6.673</b><br>
              Imp_Д2(Площадь) = 0<br>
              Imp_Д2(Возраст) = 6.673
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: MSE decrease в Дереве 3 (Возраст ≤ 9)</h4>
            <div class="calc">
              Цены в корне: {5, 8, 6.2, 12, 9.5, 14}, ȳ = 9.117<br>
              MSE(корень) = ((5−9.117)² + (8−9.117)² + (6.2−9.117)² + (12−9.117)² + (9.5−9.117)² + (14−9.117)²)/6<br>
              ≈ (16.95 + 1.25 + 8.51 + 8.31 + 0.15 + 23.84)/6 ≈ 59.01/6 ≈ <b>9.835</b><br><br>

              Левый лист (3): MSE_L ≈ 3.389. Правый лист (3): MSE_R ≈ 1.52<br>
              Weighted children = (3/6)·3.389 + (3/6)·1.52 = 2.455<br><br>

              MSE decrease = 9.835 − 2.455 = <b>7.380</b><br>
              Imp_Д3(Площадь) = 0<br>
              Imp_Д3(Возраст) = 7.380
            </div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: усреднение по лесу</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Признак</th><th>Д1</th><th>Д2</th><th>Д3</th><th>Среднее</th><th>Нормализ.</th></tr>
                <tr><td>Площадь</td><td>7.219</td><td>0</td><td>0</td><td>2.406</td><td><b>0.341</b></td></tr>
                <tr><td>Возраст</td><td>0</td><td>6.673</td><td>7.380</td><td>4.684</td><td><b>0.659</b></td></tr>
              </table>
            </div>
            <div class="calc">
              Среднее(Площадь) = (7.219 + 0 + 0)/3 ≈ 2.406<br>
              Среднее(Возраст) = (0 + 6.673 + 7.380)/3 ≈ 4.684<br><br>
              Сумма = 2.406 + 4.684 = 7.090<br>
              Imp(Площадь) = 2.406 / 7.090 ≈ <b>0.341</b><br>
              Imp(Возраст) = 4.684 / 7.090 ≈ <b>0.659</b>
            </div>
            <div class="why">Возраст примерно вдвое важнее Площади — поскольку 2 из 3 деревьев использовали именно Возраст для разбиения. Как и в классификации, MDI смещён в пользу признаков с большим числом уникальных значений; для надёжной оценки используйте Permutation Importance.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>MDI Feature Importance для регрессии: Возраст ≈ 0.659, Площадь ≈ 0.341. Возраст вдвое важнее в данном лесе — этот признак использовали 2 из 3 деревьев. С сотнями деревьев оценки стабилизируются и оба признака получат справедливые веса.</p>
          </div>
        `,
      },
      {
        title: 'Почему лес лучше одного дерева (снижение дисперсии)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать количественно: усреднение независимых деревьев уменьшает дисперсию предсказания в <b>N раз</b> (при полной независимости) или в ~<b>N/(1+(N−1)ρ)</b> раз (при корреляции ρ). Сравнить одно дерево и лес на одинаковых тестовых данных.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: дисперсия одного дерева</h4>
            <p>Обучаем 100 разных деревьев (на 100 разных bootstrap-выборках) и смотрим, какую цену каждое предсказывает для одной тестовой квартиры (60 м², 7 лет):</p>
            <div class="calc">
              Предсказания 100 деревьев: { 9.8, 11.2, 8.5, 10.9, ... }<br>
              Среднее: ȳ_дерева ≈ 10.3 млн<br>
              Дисперсия одного дерева: σ²_дерева ≈ <b>1.44</b> (std ≈ 1.2 млн)
            </div>
            <div class="why">Каждое дерево видит немного разные данные (bootstrap) и разные признаки — отсюда разброс предсказаний. Одно дерево даёт <b>шумную</b> оценку с большой дисперсией.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: дисперсия среднего из N деревьев</h4>
            <div class="calc">
              <b>Случай 1: деревья независимы</b> (корреляция ρ = 0):<br>
              Var(среднее N деревьев) = σ²/N<br><br>
              Для N = 100 и σ² = 1.44:<br>
              Var(RF) = 1.44 / 100 = <b>0.0144</b> (std ≈ 0.12 млн)<br><br>

              <b>Случай 2: деревья коррелированы</b> (ρ = 0.3):<br>
              Var(среднее) = ρ·σ² + (1−ρ)·σ²/N<br>
              = 0.3·1.44 + 0.7·1.44/100 = 0.432 + 0.0101 ≈ <b>0.442</b>
            </div>
            <div class="why">Ключевая формула! Если деревья полностью независимы — дисперсия снижается линейно в N раз. Но на практике деревья коррелированы (ρ ≈ 0.1–0.5), потому что обучаются на похожих данных. Случайный выбор признаков (max_features) специально снижает эту корреляцию.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: что даёт снижение дисперсии на практике</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Модель</th><th>Std предсказания</th><th>Ожидаемая ошибка (MAE)</th></tr>
                <tr><td>1 дерево</td><td>1.20 млн</td><td>~0.96 млн</td></tr>
                <tr><td>RF, 100 дер., ρ=0.3</td><td>0.66 млн</td><td>~0.53 млн</td></tr>
                <tr><td>RF, 100 дер., ρ=0.1</td><td>0.40 млн</td><td>~0.32 млн</td></tr>
                <tr><td>RF, 100 дер., ρ=0 (идеал)</td><td>0.12 млн</td><td>~0.10 млн</td></tr>
              </table>
            </div>
            <div class="calc">
              Даже при ρ = 0.3 (умеренная корреляция) ошибка упала почти вдвое.<br>
              Чем больше деревьев и чем они разнообразнее — тем меньше дисперсия.
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: почему лес не снижает bias</h4>
            <p>Важно: <b>усреднение снижает только дисперсию (variance), но не смещение (bias)</b>.</p>
            <div class="calc">
              E[RF] = E[(1/N) Σ Tree_i] = (1/N) Σ E[Tree_i] = E[Tree]<br><br>
              Если одно дерево даёт смещённую оценку — лес даст то же смещение!
            </div>
            <div class="why">Вот почему в Random Forest делают глубокие деревья без ограничений (низкий bias, высокая variance) — лес сгладит дисперсию. А в Gradient Boosting наоборот: делают неглубокие (низкая variance, высокий bias), и бустинг уменьшает bias.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: эмпирическая проверка на наших данных</h4>
            <p>Сравниваем RMSE одного глубокого дерева vs RF из 100 деревьев на том же тестовом наборе (симулируется выше в интерактивной панели):</p>
            <div class="example-data-table">
              <table>
                <tr><th>Модель</th><th>Train RMSE</th><th>Test RMSE</th><th>Train−Test gap</th></tr>
                <tr><td>Одно глубокое дерево</td><td>0.00 (заучил всё)</td><td>1.82</td><td>1.82 (overfit!)</td></tr>
                <tr><td>RF (N=100, depth=6)</td><td>0.54</td><td>0.91</td><td>0.37 (здоровый)</td></tr>
              </table>
            </div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Дисперсия усреднения N деревьев: Var(RF) = ρσ² + (1−ρ)σ²/N. При ρ=0 падает в N раз, при ρ=0.3 падает ~3× (100 деревьев). Лес снижает только variance, но не bias — поэтому деревья в RF делают максимально глубокими и разнообразными. Train RMSE одного дерева = 0 (overfit), RF имеет здоровый train-test gap.</p>
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
