/* ==========================================================================
   Random Forest
   ========================================================================== */
App.registerTopic({
  id: 'random-forest',
  category: 'ml',
  title: 'Random Forest',
  summary: 'Ансамбль разнообразных деревьев, голосующих большинством.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты просишь нескольких экспертов оценить стоимость картины. Один коллекционер скажет 100, другой 120, третий 80, четвёртый 110. Каждый может ошибиться, но <b>среднее</b> обычно ближе к правде, чем любое отдельное мнение.</p>
        <p>Важное условие: эксперты должны быть <b>разные</b>. Если вы позвали пять друзей, которые одинаково думают, среднее не поможет — все ошибутся одинаково. Нужно, чтобы у них были разные точки зрения, разные источники информации, разные слабые места.</p>
        <p>Random Forest делает именно это: строит <b>много деревьев</b>, специально делая их непохожими друг на друга (каждое учится на разных данных и смотрит на разные признаки), а потом усредняет предсказания. Это почти всегда лучше, чем одно дерево.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <text x="270" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Random Forest: ансамблирование деревьев</text>
          <!-- Tree 1 -->
          <rect x="30" y="30" width="130" height="110" rx="6" fill="#eff6ff" stroke="#6366f1" stroke-width="1.5"/>
          <text x="95" y="48" text-anchor="middle" font-size="10" font-weight="600" fill="#6366f1">Дерево 1</text>
          <line x1="95" y1="55" x2="70" y2="75" stroke="#818cf8" stroke-width="1.2"/>
          <line x1="95" y1="55" x2="120" y2="75" stroke="#818cf8" stroke-width="1.2"/>
          <rect x="52" y="75" width="36" height="18" rx="3" fill="#ddd6fe" stroke="#6366f1" stroke-width="1"/>
          <text x="70" y="88" text-anchor="middle" font-size="8" fill="#4c1d95">x₁>5?</text>
          <rect x="102" y="75" width="36" height="18" rx="3" fill="#ddd6fe" stroke="#6366f1" stroke-width="1"/>
          <text x="120" y="88" text-anchor="middle" font-size="8" fill="#4c1d95">x₃>2?</text>
          <line x1="70" y1="93" x2="55" y2="110" stroke="#818cf8" stroke-width="1"/>
          <line x1="70" y1="93" x2="85" y2="110" stroke="#818cf8" stroke-width="1"/>
          <rect x="42" y="110" width="26" height="16" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1"/>
          <text x="55" y="122" text-anchor="middle" font-size="8" fill="#065f46">да</text>
          <rect x="72" y="110" width="26" height="16" rx="3" fill="#fca5a5" stroke="#ef4444" stroke-width="1"/>
          <text x="85" y="122" text-anchor="middle" font-size="8" fill="#991b1b">нет</text>
          <text x="95" y="155" text-anchor="middle" font-size="9" fill="#64748b">выборка: bootstrap A</text>
          <!-- Tree 2 -->
          <rect x="200" y="30" width="130" height="110" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="265" y="48" text-anchor="middle" font-size="10" font-weight="600" fill="#10b981">Дерево 2</text>
          <line x1="265" y1="55" x2="240" y2="75" stroke="#6ee7b7" stroke-width="1.2"/>
          <line x1="265" y1="55" x2="290" y2="75" stroke="#6ee7b7" stroke-width="1.2"/>
          <rect x="222" y="75" width="36" height="18" rx="3" fill="#a7f3d0" stroke="#10b981" stroke-width="1"/>
          <text x="240" y="88" text-anchor="middle" font-size="8" fill="#065f46">x₂>8?</text>
          <rect x="272" y="75" width="36" height="18" rx="3" fill="#a7f3d0" stroke="#10b981" stroke-width="1"/>
          <text x="290" y="88" text-anchor="middle" font-size="8" fill="#065f46">x₁>3?</text>
          <line x1="240" y1="93" x2="225" y2="110" stroke="#6ee7b7" stroke-width="1"/>
          <line x1="240" y1="93" x2="255" y2="110" stroke="#6ee7b7" stroke-width="1"/>
          <rect x="212" y="110" width="26" height="16" rx="3" fill="#fca5a5" stroke="#ef4444" stroke-width="1"/>
          <text x="225" y="122" text-anchor="middle" font-size="8" fill="#991b1b">нет</text>
          <rect x="242" y="110" width="26" height="16" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1"/>
          <text x="255" y="122" text-anchor="middle" font-size="8" fill="#065f46">да</text>
          <text x="265" y="155" text-anchor="middle" font-size="9" fill="#64748b">выборка: bootstrap B</text>
          <!-- Tree 3 -->
          <rect x="370" y="30" width="130" height="110" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="435" y="48" text-anchor="middle" font-size="10" font-weight="600" fill="#d97706">Дерево 3</text>
          <line x1="435" y1="55" x2="410" y2="75" stroke="#fcd34d" stroke-width="1.2"/>
          <line x1="435" y1="55" x2="460" y2="75" stroke="#fcd34d" stroke-width="1.2"/>
          <rect x="392" y="75" width="36" height="18" rx="3" fill="#fde68a" stroke="#f59e0b" stroke-width="1"/>
          <text x="410" y="88" text-anchor="middle" font-size="8" fill="#92400e">x₄>1?</text>
          <rect x="442" y="75" width="36" height="18" rx="3" fill="#fde68a" stroke="#f59e0b" stroke-width="1"/>
          <text x="460" y="88" text-anchor="middle" font-size="8" fill="#92400e">x₂>6?</text>
          <line x1="410" y1="93" x2="395" y2="110" stroke="#fcd34d" stroke-width="1"/>
          <line x1="410" y1="93" x2="425" y2="110" stroke="#fcd34d" stroke-width="1"/>
          <rect x="382" y="110" width="26" height="16" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1"/>
          <text x="395" y="122" text-anchor="middle" font-size="8" fill="#065f46">да</text>
          <rect x="412" y="110" width="26" height="16" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1"/>
          <text x="425" y="122" text-anchor="middle" font-size="8" fill="#065f46">да</text>
          <text x="435" y="155" text-anchor="middle" font-size="9" fill="#64748b">выборка: bootstrap C</text>
          <!-- Arrows down to vote box -->
          <line x1="95" y1="165" x2="200" y2="192" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
          <line x1="265" y1="165" x2="265" y2="190" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
          <line x1="435" y1="165" x2="330" y2="192" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
          <!-- Vote box -->
          <rect x="165" y="188" width="200" height="20" rx="5" fill="#6366f1"/>
          <text x="265" y="202" text-anchor="middle" font-size="10" font-weight="600" fill="#fff">ГОЛОСОВАНИЕ / УСРЕДНЕНИЕ</text>
          <!-- Arrow markers -->
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">Random Forest: три дерева обучаются на разных bootstrap-выборках и смотрят на разные признаки. Затем их предсказания объединяются голосованием (классификация) или усреднением (регрессия).</div>
      </div>

      <h3>⚠️ Проблема одного дерева</h3>
      <p>Одиночное решающее дерево имеет серьёзный недостаток — <span class="term" data-tip="High variance. Высокая чувствительность к обучающим данным: разные выборки дают сильно разные деревья.">высокую variance</span>. Чуть-чуть изменил данные → совершенно другое дерево. Оно либо переобучается, либо слишком упрощённое.</p>
      <p>Как решить? Закон больших чисел: <b>усреднение многих шумных оценок</b> даёт более стабильную и точную оценку. Если построить 100 разных деревьев и усреднить — ошибки разных деревьев скомпенсируются.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Random Forest строит большое число деревьев так, чтобы они были <b>максимально непохожими друг на друга</b>, а потом усредняет их предсказания. Ключ — в «разнообразии» деревьев.</p>
      </div>

      <h3>🔀 Как создаётся разнообразие деревьев</h3>
      <p>Random Forest использует <b>два</b> источника разнообразия:</p>

      <h4>1. Bagging (Bootstrap Aggregation)</h4>
      <p>Каждое дерево обучается на <b>своей</b> случайной выборке данных:</p>
      <ul>
        <li>Берём исходный датасет размера $n$.</li>
        <li>Создаём новую выборку такого же размера $n$, <b>семплируя с возвращением</b>.</li>
        <li>Некоторые примеры попадут несколько раз, некоторые — ни разу.</li>
        <li>Обучаем дерево на этой выборке.</li>
      </ul>
      <p>Это называется <span class="term" data-tip="Bootstrap sample. Выборка того же размера, полученная случайным семплированием с возвращением. Содержит примерно 63% уникальных примеров исходной выборки.">bootstrap-выборкой</span>. В среднем содержит ~63% уникальных примеров.</p>

      <h4>2. Random Feature Selection</h4>
      <p>На каждом split в дереве рассматривается <b>не все признаки</b>, а только случайное подмножество:</p>
      <ul>
        <li>Для классификации: обычно $\\sqrt{p}$ признаков.</li>
        <li>Для регрессии: обычно $p/3$ признаков.</li>
      </ul>
      <p>Это заставляет деревья смотреть на разные признаки и находить разные закономерности. Без этого все деревья бы построили почти одинаковые splits на самом сильном признаке.</p>

      <h3>🗳️ Как делается предсказание</h3>
      <p>Для новой точки каждое из $T$ деревьев выдаёт своё предсказание, а финальный ответ формируется голосованием:</p>

      <ul>
        <li><b>Классификация:</b> большинство голосов деревьев.</li>
        <li><b>Регрессия:</b> среднее предсказаний деревьев.</li>
        <li><b>Вероятности:</b> доля деревьев, проголосовавших за класс.</li>
      </ul>

      <h3>🧮 Математика ансамбля</h3>
      <p>Почему усреднение помогает? Формула дисперсии ансамбля:</p>
      <div class="math-block">$$\\text{Var}(\\bar{h}) = \\rho \\sigma^2 + \\frac{1-\\rho}{T}\\sigma^2$$</div>

      <p>Где:</p>
      <ul>
        <li>$\\sigma^2$ — дисперсия одного дерева.</li>
        <li>$\\rho$ — корреляция предсказаний между деревьями.</li>
        <li>$T$ — число деревьев.</li>
      </ul>

      <p><b>Вывод:</b> увеличивая $T$, мы убираем второе слагаемое — ошибка падает. Но первое остаётся: оно зависит от $\\rho$ — корреляции деревьев. Именно поэтому RF специально добавляет случайность — чтобы $\\rho$ было маленьким.</p>

      <h3>📊 OOB оценка (Out-of-Bag)</h3>
      <p>Бонус bagging: для каждого примера есть деревья, которые <b>не видели</b> его в обучении (~37% деревьев). Можно усреднить предсказания только этих деревьев — получится <b>честная</b> оценка качества без отдельной валидационной выборки.</p>
      <p><span class="term" data-tip="Out-of-Bag score. Оценка качества ансамбля, основанная на предсказаниях только тех деревьев, которые не видели данный пример. Бесплатная валидация.">OOB score</span> — встроенный инструмент RF для оценки без CV. В sklearn: <code>oob_score=True</code>.</p>

      <h3>⚙️ Важные гиперпараметры</h3>
      <table>
        <tr><th>Параметр</th><th>Эффект</th><th>Типичное значение</th></tr>
        <tr><td>n_estimators</td><td>Число деревьев. Больше → лучше, но медленнее.</td><td>100-500</td></tr>
        <tr><td>max_depth</td><td>Глубина деревьев. None → максимум.</td><td>None или 10-20</td></tr>
        <tr><td>max_features</td><td>Признаков на split. Меньше → больше разнообразия.</td><td>sqrt(p) для cls, p/3 для reg</td></tr>
        <tr><td>min_samples_leaf</td><td>Минимум примеров в листе.</td><td>1-10</td></tr>
        <tr><td>max_samples</td><td>Размер bootstrap. Меньше → больше разнообразия.</td><td>1.0 (=n)</td></tr>
      </table>

      <h3>🔍 Feature Importance</h3>
      <p>Random Forest автоматически выдаёт <b>важность признаков</b>. Для каждого признака суммируется уменьшение impurity во всех splits, где он использовался.</p>
      <p>Это очень полезный «побочный эффект»: RF не только предсказывает, но и показывает, какие признаки важны.</p>

      <p><b>Ограничения:</b> встроенная важность смещена в пользу признаков с большим числом уникальных значений. Более надёжная альтернатива — <span class="term" data-tip="Permutation Importance. Измерение важности признака через то, насколько падает качество модели при случайной перестановке его значений. Более честная оценка.">permutation importance</span>.</p>

      <h3>🏆 Почему Random Forest так популярен</h3>
      <ul>
        <li><b>Работает «из коробки»</b> — почти не требует настройки.</li>
        <li><b>Сложно сделать хуже</b> — даже плохая настройка даёт приличный результат.</li>
        <li><b>Устойчив к переобучению</b> — с ростом числа деревьев ошибка не растёт.</li>
        <li><b>Хорошо работает с табличными данными</b> — часто побеждает нейросети.</li>
        <li><b>Параллелится</b> — каждое дерево независимо от других.</li>
      </ul>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Почти не требует настройки.</li>
        <li>Устойчив к переобучению.</li>
        <li>Обрабатывает пропуски и выбросы.</li>
        <li>Даёт feature importance.</li>
        <li>OOB score — бесплатная валидация.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Медленный инференс</b> (100+ деревьев — много вычислений).</li>
        <li>Большой размер модели в памяти.</li>
        <li>Теряет интерпретируемость одного дерева.</li>
        <li>На соревнованиях Kaggle обычно уступает бустингу.</li>
        <li>Не лучший выбор для экстраполяции в регрессии.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Random Forest не переобучается»</b> — не совсем. Не переобучается с ростом T, но может при слишком глубоких деревьях.</li>
        <li><b>«Больше деревьев всегда лучше»</b> — после 300-500 эффект насыщается, только замедляет.</li>
        <li><b>«RF лучше бустинга»</b> — обычно наоборот: бустинг сильнее, но RF проще в настройке.</li>
        <li><b>«RF не требует препроцессинга»</b> — в основном да, но пропуски нужно обрабатывать (в sklearn).</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: Extra Trees — кузен RF</summary>
        <div class="deep-dive-body">
          <p><span class="term" data-tip="Extremely Randomized Trees. Вариант Random Forest, где вместо оптимального порога для split выбирается случайный. Ещё больше разнообразия, часто быстрее.">Extra Trees</span> (Extremely Randomized Trees) — усиленная версия RF:</p>
          <ul>
            <li>Вместо оптимального порога split — случайный порог.</li>
            <li>Ещё больше разнообразия → ниже variance.</li>
            <li>Обучается быстрее.</li>
            <li>Не использует bootstrap (обучается на всей выборке).</li>
          </ul>
          <p>Часто показывает результаты не хуже RF, а иногда лучше.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: RF vs Gradient Boosting</summary>
        <div class="deep-dive-body">
          <p>Два главных ансамбля деревьев имеют ключевое различие:</p>
          <ul>
            <li><b>RF (bagging):</b> деревья строятся <b>параллельно</b>, независимо, потом усредняются. Снижает variance.</li>
            <li><b>Boosting:</b> деревья строятся <b>последовательно</b>, каждое исправляет ошибки предыдущих. Снижает bias.</li>
          </ul>
          <p>RF проще настраивать, устойчивее к переобучению. Boosting даёт лучшее качество при правильной настройке, но сложнее. На Kaggle boosting чаще выигрывает.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: proximity matrix</summary>
        <div class="deep-dive-body">
          <p>RF может измерять «похожесть» объектов: два объекта «похожи», если часто попадают в один лист.</p>
          <p>Это даёт:</p>
          <ul>
            <li>Альтернативу расстоянию для kNN.</li>
            <li>Основу для кластеризации.</li>
            <li>Детекцию аномалий (далёкие от всех).</li>
            <li>Импутацию пропусков.</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Decision Tree</b> — базовый блок Random Forest.</li>
        <li><b>Gradient Boosting</b> — альтернативный ансамбль деревьев.</li>
        <li><b>Isolation Forest</b> — использует ту же идею рандомизации для поиска аномалий.</li>
        <li><b>Bias-variance</b> — RF снижает variance через усреднение.</li>
        <li><b>Feature Importance</b> — важный инструмент интерпретации модели.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Bootstrap выборка: пошагово',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как bootstrap-выборки создают разнообразные деревья, и что такое OOB (out-of-bag) примеры.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Индекс</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
              <tr><th>Метка</th><td>A</td><td>B</td><td>A</td><td>B</td><td>A</td><td>A</td><td>B</td><td>A</td><td>B</td><td>A</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: создать bootstrap-выборку для дерева 1</h4>
            <div class="calc">
              n=10 → тянем 10 раз с возвращением (равновероятно)<br>
              Выборка: [3, 7, 3, 1, 9, 2, 5, 3, 8, 1]<br>
              Уникальные: {1,2,3,5,7,8,9} — 7 из 10<br>
              OOB для дерева 1: {4, 6, 10} — 3 примера не попали
            </div>
            <div class="why">В среднем bootstrap оставляет за бортом ≈ 36.8% = (1−1/n)ⁿ → e⁻¹ ≈ 0.368 примеров.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: bootstrap-выборки для 5 деревьев</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Дерево</th><th>Bootstrap индексы</th><th>OOB индексы</th></tr>
                <tr><td>1</td><td>3,7,3,1,9,2,5,3,8,1</td><td>4,6,10</td></tr>
                <tr><td>2</td><td>5,2,8,4,1,5,9,6,2,4</td><td>3,7,10</td></tr>
                <tr><td>3</td><td>10,4,7,1,6,3,10,2,5,8</td><td>9 (и др.)</td></tr>
                <tr><td>4</td><td>6,9,3,7,2,4,8,1,6,9</td><td>5,10 (и др.)</td></tr>
                <tr><td>5</td><td>1,3,5,2,7,9,4,6,3,1</td><td>8,10 (и др.)</td></tr>
              </table>
            </div>
            <div class="why">Каждое дерево видит разные данные → деревья разнообразны → ансамбль лучше одного дерева.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: случайный выбор признаков (max_features)</h4>
            <div class="calc">
              Датасет: 16 признаков<br>
              Классификация: max_features = √16 = 4<br>
              В каждом узле случайно выбираем 4 признака из 16<br>
              Ищем лучшее разбиение только среди этих 4<br>
              → Деревья видят разные признаки в каждом узле<br>
              → Корреляция деревьев снижается → ансамбль лучше
            </div>
            <div class="why">Если не ограничивать признаки — доминирующий признак попадёт в корень всех деревьев, и они станут похожими. Разнообразие ключевое для Random Forest.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Bootstrap + random features = два уровня рандомизации. Вместе они гарантируют разнообразие деревьев и снижают variance ансамбля по сравнению с одним деревом.</p>
          </div>
          <div class="lesson-box">
            Теорема: ошибка случайного леса ≤ ρ̄·σ²/s², где ρ̄ — средняя корреляция между деревьями, σ² — дисперсия отдельного дерева, s — точность дерева. Чем меньше ρ̄ и чем точнее деревья — тем лучше лес.
          </div>
        `,
      },
      {
        title: 'Голосование 5 деревьев',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>5 деревьев предсказывают класс нового объекта. Сравнить majority voting и probability averaging.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Дерево</th><th>Предсказание</th><th>P(класс A)</th><th>P(класс B)</th></tr>
              <tr><td>Дерево 1</td><td>A</td><td>0.80</td><td>0.20</td></tr>
              <tr><td>Дерево 2</td><td>B</td><td>0.35</td><td>0.65</td></tr>
              <tr><td>Дерево 3</td><td>A</td><td>0.70</td><td>0.30</td></tr>
              <tr><td>Дерево 4</td><td>A</td><td>0.55</td><td>0.45</td></tr>
              <tr><td>Дерево 5</td><td>B</td><td>0.40</td><td>0.60</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: majority voting (hard voting)</h4>
            <div class="calc">
              A: 3 голоса (Деревья 1, 3, 4)<br>
              B: 2 голоса (Деревья 2, 5)<br>
              Результат: <b>класс A</b> (большинством 3:2)
            </div>
            <div class="why">Простое голосование: каждое дерево имеет 1 голос. Стандарт для классификации.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: probability averaging (soft voting)</h4>
            <div class="calc">
              P̄(A) = (0.80 + 0.35 + 0.70 + 0.55 + 0.40) / 5<br>
                    = 2.80 / 5 = <b>0.560</b><br>
              P̄(B) = (0.20 + 0.65 + 0.30 + 0.45 + 0.60) / 5<br>
                    = 2.20 / 5 = <b>0.440</b><br>
              Результат: <b>класс A</b> (P=0.56 > 0.5)
            </div>
            <div class="why">Soft voting учитывает уверенность дерева. Лучше когда деревья хорошо откалиброваны. Обычно soft voting точнее.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: когда они расходятся?</h4>
            <div class="calc">
              Пример: Дерево 2 даёт P(B)=0.95 (очень уверено)<br>
              Дерево 3 даёт P(A)=0.51 (едва за A)<br>
              Hard: A побеждает голосованием<br>
              Soft: P̄(B) может победить, если дерево 2 очень уверено<br><br>
              Если P(A) = [0.51, 0.51, 0.51, 0.35, 0.35]:<br>
              Hard: 3:2 → A<br>
              Soft: P̄(A) = 2.23/5 = 0.446 → B!
            </div>
            <div class="why">Soft voting может отличаться от hard voting, когда меньшинство деревьев очень уверено.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оба метода предсказывают класс A. Soft voting (P=0.56) предпочтительнее: учитывает неопределённость каждого дерева. В sklearn: voting='soft' требует predict_proba у каждой модели.</p>
          </div>
          <div class="lesson-box">
            Feature importance в Random Forest: важность признака = суммарное снижение Gini при разбиениях по этому признаку, усреднённое по всем деревьям. Это MDI (mean decrease in impurity).
          </div>
        `,
      },
      {
        title: 'OOB оценка качества',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как out-of-bag примеры позволяют оценить качество случайного леса без отдельного валидационного набора.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Пример</th><th>Факт</th><th>OOB дерево 1</th><th>OOB дерево 2</th><th>OOB дерево 4</th><th>OOB голос</th><th>Правильно?</th></tr>
              <tr><td>№4</td><td>B</td><td>B (0.65)</td><td>—</td><td>B (0.70)</td><td>B</td><td>Да</td></tr>
              <tr><td>№6</td><td>A</td><td>—</td><td>A (0.80)</td><td>—</td><td>A</td><td>Да</td></tr>
              <tr><td>№10</td><td>A</td><td>B (0.55)</td><td>B (0.60)</td><td>A (0.52)</td><td>B</td><td>Нет</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: принцип OOB оценки</h4>
            <div class="calc">
              Каждый пример xᵢ пропущен ≈ 37% деревьев (OOB деревья)<br>
              Для xᵢ: собираем предсказания только OOB деревьев<br>
              Голосование среди этих деревьев → OOB предсказание<br>
              Сравниваем с истинной меткой → OOB ошибка
            </div>
            <div class="why">OOB деревья «не видели» этот пример при обучении → честная оценка без data leakage.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить OOB accuracy</h4>
            <div class="calc">
              Всего примеров: 10<br>
              OOB предсказания:<br>
              №1: A ✓, №2: B ✓, №3: A ✓, №4: B ✓<br>
              №5: A ✓, №6: A ✓, №7: B ✓, №8: A ✓<br>
              №9: B ✓, №10: B (факт A) ✗<br><br>
              OOB Accuracy = 9/10 = <b>90%</b>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: сравнение с CV</h4>
            <div class="calc">
              5-fold CV Accuracy: 88.5%<br>
              OOB Accuracy: 90%<br>
              Test Accuracy (hold-out 20%): 89%<br><br>
              OOB ≈ CV при большом числе деревьев (≥100)<br>
              OOB быстрее: не нужно переобучать n_folds раз
            </div>
            <div class="why">OOB — «бесплатная» оценка: вычисляется вместе с обучением леса. При n_estimators=100+ очень надёжна.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>OOB Score = 90%. Преимущество: не тратим данные на validation set и не нужна кросс-валидация. В sklearn: RandomForestClassifier(oob_score=True) → model.oob_score_</p>
          </div>
          <div class="lesson-box">
            При малом числе деревьев OOB нестабилен: каждый пример оценивается мало деревьями. При n_estimators ≥ 100 OOB Score практически совпадает с Leave-One-Out CV и обычно достаточен для выбора гиперпараметров.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: один vs много деревьев</h3>
        <p>Сравни границу одного дерева с лесом. Меняй число деревьев и глубину.</p>
        <div class="sim-container">
          <div class="sim-controls" id="rf-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="rf-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="rf-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="rf-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#rf-controls');
        const cTrees = App.makeControl('range', 'rf-trees', 'Число деревьев', { min: 1, max: 100, step: 1, value: 20 });
        const cDepth = App.makeControl('range', 'rf-depth', 'Max depth', { min: 1, max: 10, step: 1, value: 5 });
        const cFeat = App.makeControl('range', 'rf-feat', 'Признаков на split', { min: 1, max: 2, step: 1, value: 1 });
        const cN = App.makeControl('range', 'rf-n', 'Точек', { min: 40, max: 300, step: 10, value: 120 });
        const cShape = App.makeControl('select', 'rf-shape', 'Форма', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'circle', label: 'Круг' }, { value: 'xor', label: 'XOR' }],
          value: 'moons',
        });
        [cTrees, cDepth, cFeat, cN, cShape].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#rf-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let forest = [];

        function genData() {
          const shape = cShape.input.value;
          const n = +cN.input.value;
          points = [];
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) {
                x = 0.3 + 0.25 * Math.cos(t) + App.Util.randn(0, 0.04);
                y = 0.45 + 0.25 * Math.sin(t) + App.Util.randn(0, 0.04);
                cls = 0;
              } else {
                x = 0.55 + 0.25 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.04);
                y = 0.55 - 0.25 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.04);
                cls = 1;
              }
            } else if (shape === 'circle') {
              x = Math.random(); y = Math.random();
              const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
              cls = r < 0.25 + App.Util.randn(0, 0.03) ? 0 : 1;
            } else {
              x = Math.random(); y = Math.random();
              cls = ((x > 0.5) ^ (y > 0.5)) ? 1 : 0;
              if (Math.random() < 0.08) cls = 1 - cls; // шум
            }
            points.push({ x, y, cls });
          }
        }

        function gini(items) {
          if (items.length === 0) return 0;
          let c0 = 0, c1 = 0;
          items.forEach(p => p.cls === 0 ? c0++ : c1++);
          const p0 = c0 / items.length, p1 = c1 / items.length;
          return 1 - p0 * p0 - p1 * p1;
        }

        function majority(items) { let c0 = 0; items.forEach(p => p.cls === 0 && c0++); return c0 >= items.length - c0 ? 0 : 1; }

        function buildTree(items, depth, maxDepth, maxFeatures) {
          if (depth >= maxDepth || items.length < 2 || gini(items) < 1e-9) {
            return { leaf: true, cls: majority(items) };
          }
          const feats = ['x', 'y'];
          const shuffled = App.Util.shuffle(feats).slice(0, maxFeatures);
          let best = null;
          const base = gini(items);
          shuffled.forEach(feat => {
            const vals = items.map(p => p[feat]).sort((a, b) => a - b);
            // пробуем несколько случайных порогов для скорости
            const tryN = Math.min(vals.length - 1, 20);
            for (let k = 0; k < tryN; k++) {
              const i = 1 + Math.floor(Math.random() * (vals.length - 1));
              const thr = (vals[i - 1] + vals[i]) / 2;
              const L = items.filter(p => p[feat] < thr);
              const R = items.filter(p => p[feat] >= thr);
              if (L.length === 0 || R.length === 0) continue;
              const w = (L.length * gini(L) + R.length * gini(R)) / items.length;
              const gain = base - w;
              if (!best || gain > best.gain) best = { feat, thr, gain, L, R };
            }
          });
          if (!best || best.gain < 1e-6) return { leaf: true, cls: majority(items) };
          return {
            leaf: false, feat: best.feat, thr: best.thr,
            left: buildTree(best.L, depth + 1, maxDepth, maxFeatures),
            right: buildTree(best.R, depth + 1, maxDepth, maxFeatures),
          };
        }

        function predict(tree, x, y) {
          if (tree.leaf) return tree.cls;
          const v = tree.feat === 'x' ? x : y;
          return v < tree.thr ? predict(tree.left, x, y) : predict(tree.right, x, y);
        }

        function predictForest(x, y) {
          let votes = 0;
          forest.forEach(t => { votes += predict(t, x, y); });
          return votes / forest.length;
        }

        function buildForest() {
          const nTrees = +cTrees.input.value;
          const depth = +cDepth.input.value;
          const maxFeat = +cFeat.input.value;
          forest = [];
          for (let t = 0; t < nTrees; t++) {
            // bootstrap
            const sample = [];
            for (let i = 0; i < points.length; i++) {
              sample.push(points[Math.floor(Math.random() * points.length)]);
            }
            forest.push(buildTree(sample, 0, depth, maxFeat));
          }
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const step = 8;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const p = predictForest(px / W, py / H);
              // интерполяция между красным и синим
              const alpha = 0.25;
              ctx.fillStyle = `rgba(${Math.round(239 * (1 - p) + 59 * p)},${Math.round(68 * (1 - p) + 130 * p)},${Math.round(68 * (1 - p) + 246 * p)},${alpha})`;
              ctx.fillRect(px, py, step, step);
            }
          }
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 4, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          let correct = 0;
          points.forEach(p => { if (Math.round(predictForest(p.x, p.y)) === p.cls) correct++; });
          const acc = correct / points.length;

          container.querySelector('#rf-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Деревьев</div><div class="stat-value">${forest.length}</div></div>
            <div class="stat-card"><div class="stat-label">Max depth</div><div class="stat-value">${cDepth.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">Признаков/split</div><div class="stat-value">${cFeat.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">Train accuracy</div><div class="stat-value">${(acc * 100).toFixed(1)}%</div></div>
          `;
        }

        function rebuild() { buildForest(); draw(); }

        [cTrees, cDepth, cFeat].forEach(c => c.input.addEventListener('input', rebuild));
        [cN, cShape].forEach(c => c.input.addEventListener('change', () => { genData(); rebuild(); }));
        container.querySelector('#rf-regen').onclick = () => { genData(); rebuild(); };

        setTimeout(() => { genData(); resize(); buildForest(); draw(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Tabular данные</b> — часто побеждает нейросети на табличках.</li>
        <li><b>Feature importance</b> — какие признаки важны.</li>
        <li><b>Baseline для ML</b> — быстро даёт сильный результат.</li>
        <li><b>Медицина и биология</b> — микрочипы, генетические маркеры.</li>
        <li><b>Финансы</b> — скоринг, антифрод.</li>
        <li><b>Вычисление similarity</b> — два объекта «похожи», если часто попадают в один лист.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Почти не требует настройки</li>
            <li>Устойчив к переобучению (с ростом деревьев)</li>
            <li>Работает с пропусками, выбросами</li>
            <li>Дает feature importance</li>
            <li>Параллелится — каждое дерево независимо</li>
            <li>OOB error без отдельной валидации</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Медленный инференс (много деревьев)</li>
            <li>Большой размер модели</li>
            <li>Теряет интерпретируемость одного дерева</li>
            <li>Часто уступает бустингу на соревнованиях</li>
            <li>Не лучший выбор для экстраполяции</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Алгоритм</h3>
      <ol>
        <li>Для $t = 1, \\dots, T$:
          <ol>
            <li>Bootstrap sample $D_t$ размера n с возвращением.</li>
            <li>Построить дерево $h_t$ на $D_t$, на каждом разбиении используя случайные m признаков из p.</li>
          </ol>
        </li>
        <li>Классификация: $\\hat{y} = \\text{mode}\\{h_1(x), \\dots, h_T(x)\\}$</li>
        <li>Регрессия: $\\hat{y} = \\frac{1}{T}\\sum_t h_t(x)$</li>
      </ol>

      <h3>Дисперсия ансамбля</h3>
      <div class="math-block">$$\\text{Var}(\\bar{h}) = \\rho \\sigma^2 + \\frac{1-\\rho}{T}\\sigma^2$$</div>
      <p>где ρ — корреляция между деревьями, σ² — их дисперсия. При $\\rho = 0$ дисперсия падает в T раз.</p>

      <h3>OOB error</h3>
      <p>Для каждого примера усредняем предсказания только тех деревьев, для которых этот пример не попал в bootstrap. Получаем несмещённую оценку ошибки.</p>

      <h3>Feature Importance</h3>
      <div class="math-block">$$\\text{Imp}(j) = \\frac{1}{T}\\sum_{t=1}^{T}\\sum_{\\text{split на } x_j} \\Delta\\text{Impurity}$$</div>
    `,

    extra: `
      <h3>Параметры и их влияние</h3>
      <table>
        <tr><th>Параметр</th><th>Эффект</th></tr>
        <tr><td>n_estimators</td><td>Больше → лучше, но медленнее. Плато ~300-500.</td></tr>
        <tr><td>max_depth</td><td>None → деревья глубокие. Можно ограничить.</td></tr>
        <tr><td>max_features</td><td>Меньше → больше разнообразия.</td></tr>
        <tr><td>min_samples_leaf</td><td>Больше → меньше переобучения.</td></tr>
      </table>

      <h3>Extra Trees (Extremely Randomized)</h3>
      <p>Вместо оптимального порога — случайный порог. Ещё больше разнообразия, быстрее, часто не хуже.</p>

      <h3>Permutation Importance</h3>
      <p>Альтернатива feature importance: перемешать столбец и посмотреть, насколько упало качество. Более честная оценка.</p>

      <h3>Почему RF не переобучается с ростом T</h3>
      <p>С ростом T ошибка сходится к пределу (закон больших чисел). Переобучение ограничено глубиной и разнообразием отдельных деревьев.</p>

      <h3>Isolation Forest</h3>
      <p>Родственник RF для поиска аномалий: чем быстрее точка изолируется случайными разбиениями — тем вероятнее, что это выброс.</p>
    `,
  },
});
