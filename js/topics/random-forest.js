/* ==========================================================================
   Random Forest
   ========================================================================== */
App.registerTopic({
  id: 'random-forest',
  category: 'ml-cls',
  title: 'Random Forest',
  summary: 'Ансамбль разнообразных деревьев, голосующих большинством.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('decision-tree')">Решающее дерево</a> ·
        <a onclick="App.selectTopic('bias-variance')">Bias-Variance</a> ·
        <a onclick="App.selectTopic('cross-validation')">Кросс-валидация</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты просишь нескольких экспертов оценить стоимость картины. Один коллекционер скажет 100, другой 120, третий 80, четвёртый 110. Каждый может ошибиться, но <b>среднее</b> обычно ближе к правде, чем любое отдельное мнение.</p>
        <p>Важное условие: эксперты должны быть <b>разные</b>. Если вы позвали пять друзей, которые одинаково думают, среднее не поможет — все ошибутся одинаково. Нужно, чтобы у них были разные точки зрения, разные источники информации, разные слабые места.</p>
        <p>Random Forest делает именно это: строит <b>много деревьев</b>, специально делая их непохожими друг на друга (каждое учится на разных данных и смотрит на разные признаки), а потом усредняет предсказания. Это почти всегда лучше, чем одно дерево.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
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
          <!-- Arrows down to vote box (end just above box top y=200) -->
          <line x1="95" y1="167" x2="195" y2="196" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
          <line x1="265" y1="167" x2="265" y2="196" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
          <line x1="435" y1="167" x2="335" y2="196" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr)"/>
          <!-- Vote box -->
          <rect x="165" y="202" width="200" height="22" rx="5" fill="#6366f1"/>
          <text x="265" y="217" text-anchor="middle" font-size="10" font-weight="600" fill="#fff">ГОЛОСОВАНИЕ / УСРЕДНЕНИЕ</text>
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

      <h4>1. Bagging (<a class="glossary-link" onclick="App.selectTopic('glossary-bootstrap')">Bootstrap</a> Aggregation)</h4>
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

      <h3>📊 <a class="glossary-link" onclick="App.selectTopic('glossary-bootstrap')">OOB оценка (Out-of-Bag)</a></h3>
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
        <li><b>Устойчив к <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучению</a></b> — с ростом числа деревьев ошибка не растёт.</li>
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
        <summary>Подробнее: RF vs <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting</summary>
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
        title: 'Строим Random Forest из 3 деревьев',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Построить Random Forest из 3 деревьев на датасете из 6 фруктов. Проследить каждый шаг: bootstrap-выборки, построение деревьев, голосование и OOB-оценку.</p>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: исходный датасет</h4>
            <p>6 фруктов, 2 признака: Вес (г) и Цвет (1=бледный, 10=насыщенный).</p>
            <div class="example-data-table">
              <table>
                <tr><th>#</th><th>Вес (г)</th><th>Цвет (1–10)</th><th>Класс</th></tr>
                <tr><td>1</td><td>150</td><td>3</td><td style="color:#16a34a;font-weight:600">Яблоко</td></tr>
                <tr><td>2</td><td>170</td><td>4</td><td style="color:#16a34a;font-weight:600">Яблоко</td></tr>
                <tr><td>3</td><td>130</td><td>2</td><td style="color:#16a34a;font-weight:600">Яблоко</td></tr>
                <tr><td>4</td><td>200</td><td>8</td><td style="color:#ea580c;font-weight:600">Апельсин</td></tr>
                <tr><td>5</td><td>190</td><td>7</td><td style="color:#ea580c;font-weight:600">Апельсин</td></tr>
                <tr><td>6</td><td>210</td><td>9</td><td style="color:#ea580c;font-weight:600">Апельсин</td></tr>
              </table>
            </div>
            <div class="why">Датасет намеренно маленький — 6 объектов — чтобы можно было проследить каждый шаг вручную. В реальности датасет может быть миллионы строк.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: bootstrap-выборка для Дерева 1</h4>
            <div class="calc">
              n = 6. Тянем 6 раз с возвращением (каждый раз — случайный индекс 1..6).<br>
              Результат: [1, 3, 3, 4, 5, 6]<br>
              &nbsp;&nbsp;индекс 1 — 1 раз, индекс 2 — 0 раз, индекс 3 — 2 раза,<br>
              &nbsp;&nbsp;индекс 4 — 1 раз, индекс 5 — 1 раз, индекс 6 — 1 раз.<br>
              OOB (не попали ни разу): {2}
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Позиция в bootstrap</th><th>Индекс</th><th>Вес</th><th>Цвет</th><th>Класс</th></tr>
                <tr><td>1</td><td>1</td><td>150</td><td>3</td><td style="color:#16a34a">Яблоко</td></tr>
                <tr><td>2</td><td>3</td><td>130</td><td>2</td><td style="color:#16a34a">Яблоко</td></tr>
                <tr><td>3</td><td>3</td><td>130</td><td>2</td><td style="color:#16a34a">Яблоко (дубль)</td></tr>
                <tr><td>4</td><td>4</td><td>200</td><td>8</td><td style="color:#ea580c">Апельсин</td></tr>
                <tr><td>5</td><td>5</td><td>190</td><td>7</td><td style="color:#ea580c">Апельсин</td></tr>
                <tr><td>6</td><td>6</td><td>210</td><td>9</td><td style="color:#ea580c">Апельсин</td></tr>
              </table>
            </div>
            <div class="why">Индекс 3 встречается дважды — это нормально: bootstrap тянет с возвращением. Индекс 2 пропущен — он OOB для Дерева 1.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: строим Дерево 1 (max_features = 1)</h4>
            <p>При каждом разбиении случайно выбираем 1 признак из 2. Для корня выпало: <b>Вес</b>.</p>
            <div class="calc">
              Данные в корне: {1,3,3,4,5,6} → 3 яблока, 3 апельсина<br>
              <a class="glossary-link" onclick="App.selectTopic('glossary-entropy')">Gini</a> корня = 1 − (3/6)² − (3/6)² = 1 − 0.25 − 0.25 = <b>0.5</b><br><br>
              Пробуем пороги для Вес (сортируем значения: 130,130,150,190,200,210):<br>
              Пороги между соседними уникальными: 140, 160, 185, 195, 205<br><br>
              <b>Порог Вес &lt; 140:</b><br>
              &nbsp;&nbsp;Левое (Вес&lt;140): {3,3} = 2 яблока, 0 апельс. → Gini = 1−(2/2)²−(0/2)² = 0<br>
              &nbsp;&nbsp;Правое (Вес≥140): {1,4,5,6} = 1 яблоко, 3 апельс. → Gini = 1−(1/4)²−(3/4)² = 1−0.0625−0.5625 = 0.375<br>
              &nbsp;&nbsp;Взвешенный Gini = (2/6)·0 + (4/6)·0.375 = 0 + 0.25 = 0.25<br><br>
              <b>Порог Вес &lt; 160:</b><br>
              &nbsp;&nbsp;Левое (Вес&lt;160): {1,3,3} = 3 яблока, 0 апельс. → Gini = 1−(3/3)²−0 = 0<br>
              &nbsp;&nbsp;Правое (Вес≥160): {4,5,6} = 0 яблок, 3 апельс. → Gini = 0<br>
              &nbsp;&nbsp;Взвешенный Gini = (3/6)·0 + (3/6)·0 = <b>0.0 ← минимум!</b><br><br>
              <b>Порог Вес &lt; 185:</b><br>
              &nbsp;&nbsp;(тот же результат: Вес{130,130,150}&lt;185=яблоки; Вес{190,200,210}≥185=апельсины)<br>
              &nbsp;&nbsp;Взвешенный Gini = 0 + 0 = <b>0.0</b><br><br>
              Снижение нечистоты = 0.5 − 0.0 = <b>0.5</b> (максимально возможное)<br>
              Выбираем порог Вес &lt; 185 (оба порога 160 и 185 дают Gini=0; берём 185 как середину между 150 и 190).
            </div>
            <div class="why">Gini = 0 означает абсолютно чистые листья. Лучше быть не может. Дерево 1 — идеальный классификатор на своих данных.</div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="15" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Дерево 1: Вес &lt; 185?</text>
              <!-- Root node -->
              <rect x="145" y="25" width="130" height="44" rx="8" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
              <text x="210" y="43" text-anchor="middle" font-size="11" font-weight="700" fill="#3730a3">Вес &lt; 185?</text>
              <text x="210" y="59" text-anchor="middle" font-size="9" fill="#4338ca">Gini корня = 0.5</text>
              <!-- Left branch -->
              <line x1="175" y1="69" x2="100" y2="110" stroke="#16a34a" stroke-width="2"/>
              <text x="120" y="98" font-size="9" fill="#16a34a" font-weight="600">Да (≤184г)</text>
              <!-- Right branch -->
              <line x1="245" y1="69" x2="320" y2="110" stroke="#ea580c" stroke-width="2"/>
              <text x="265" y="98" font-size="9" fill="#ea580c" font-weight="600">Нет (≥185г)</text>
              <!-- Left leaf -->
              <rect x="40" y="110" width="120" height="48" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
              <text x="100" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">Яблоко</text>
              <text x="100" y="146" text-anchor="middle" font-size="9" fill="#166534">3 яблока / 0 апельс.</text>
              <text x="100" y="159" text-anchor="middle" font-size="9" fill="#166534">Gini = 0 (чистый)</text>
              <!-- Right leaf -->
              <rect x="260" y="110" width="120" height="48" rx="8" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
              <text x="320" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">Апельсин</text>
              <text x="320" y="146" text-anchor="middle" font-size="9" fill="#9a3412">0 яблок / 3 апельс.</text>
              <text x="320" y="159" text-anchor="middle" font-size="9" fill="#9a3412">Gini = 0 (чистый)</text>
            </svg>
            <div class="caption">Дерево 1 разделяет фрукты идеально по весу: объекты с Вес&lt;185г — яблоки, с Вес≥185г — апельсины. Оба листа абсолютно чисты (Gini=0).</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: bootstrap-выборка для Дерева 2</h4>
            <div class="calc">
              Тянем 6 раз с возвращением: [2, 2, 4, 5, 6, 6]<br>
              &nbsp;&nbsp;индекс 1 — 0 раз, индекс 2 — 2 раза, индекс 3 — 0 раз,<br>
              &nbsp;&nbsp;индекс 4 — 1 раз, индекс 5 — 1 раз, индекс 6 — 2 раза.<br>
              OOB (не попали): {1, 3}
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Позиция</th><th>Индекс</th><th>Вес</th><th>Цвет</th><th>Класс</th></tr>
                <tr><td>1</td><td>2</td><td>170</td><td>4</td><td style="color:#16a34a">Яблоко</td></tr>
                <tr><td>2</td><td>2</td><td>170</td><td>4</td><td style="color:#16a34a">Яблоко (дубль)</td></tr>
                <tr><td>3</td><td>4</td><td>200</td><td>8</td><td style="color:#ea580c">Апельсин</td></tr>
                <tr><td>4</td><td>5</td><td>190</td><td>7</td><td style="color:#ea580c">Апельсин</td></tr>
                <tr><td>5</td><td>6</td><td>210</td><td>9</td><td style="color:#ea580c">Апельсин</td></tr>
                <tr><td>6</td><td>6</td><td>210</td><td>9</td><td style="color:#ea580c">Апельсин (дубль)</td></tr>
              </table>
            </div>
            <p>Для корня Дерева 2 случайно выпал признак: <b>Цвет</b>.</p>
            <div class="calc">
              Данные: {2,2,4,5,6,6} → 2 яблока (цвет=4,4), 4 апельсина (цвет=8,7,9,9)<br>
              Gini корня = 1 − (2/6)² − (4/6)² = 1 − 0.111 − 0.444 = <b>0.444</b><br><br>
              Уникальные значения Цвета: 4, 7, 8, 9. Пороги: 5.5, 7.5, 8.5<br><br>
              <b>Порог Цвет &lt; 5.5:</b><br>
              &nbsp;&nbsp;Левое (Цвет&lt;5.5): {2,2} → цвет=4,4 → 2 яблока, 0 апельс. → Gini = 0<br>
              &nbsp;&nbsp;Правое (Цвет≥5.5): {4,5,6,6} → цвет=8,7,9,9 → 0 яблок, 4 апельс. → Gini = 0<br>
              &nbsp;&nbsp;Взвешенный Gini = (2/6)·0 + (4/6)·0 = <b>0.0 ← лучший!</b><br><br>
              Снижение нечистоты = 0.444 − 0.0 = <b>0.444</b>
            </div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="15" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Дерево 2: Цвет &lt; 5.5?</text>
              <!-- Root node -->
              <rect x="135" y="25" width="150" height="44" rx="8" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
              <text x="210" y="43" text-anchor="middle" font-size="11" font-weight="700" fill="#78350f">Цвет &lt; 5.5?</text>
              <text x="210" y="59" text-anchor="middle" font-size="9" fill="#92400e">Gini корня = 0.444</text>
              <!-- Left branch -->
              <line x1="175" y1="69" x2="100" y2="110" stroke="#16a34a" stroke-width="2"/>
              <text x="105" y="98" font-size="9" fill="#16a34a" font-weight="600">Да (цвет ≤5)</text>
              <!-- Right branch -->
              <line x1="245" y1="69" x2="320" y2="110" stroke="#ea580c" stroke-width="2"/>
              <text x="258" y="98" font-size="9" fill="#ea580c" font-weight="600">Нет (цвет ≥6)</text>
              <!-- Left leaf -->
              <rect x="40" y="110" width="120" height="48" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
              <text x="100" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">Яблоко</text>
              <text x="100" y="146" text-anchor="middle" font-size="9" fill="#166534">2 яблока / 0 апельс.</text>
              <text x="100" y="159" text-anchor="middle" font-size="9" fill="#166534">Gini = 0</text>
              <!-- Right leaf -->
              <rect x="260" y="110" width="120" height="48" rx="8" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
              <text x="320" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">Апельсин</text>
              <text x="320" y="146" text-anchor="middle" font-size="9" fill="#9a3412">0 яблок / 4 апельс.</text>
              <text x="320" y="159" text-anchor="middle" font-size="9" fill="#9a3412">Gini = 0</text>
            </svg>
            <div class="caption">Дерево 2 использует признак Цвет: объекты с Цветом &lt; 5.5 — яблоки (бледные), с Цветом ≥ 5.5 — апельсины (насыщенные). Снова идеальное разделение.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: bootstrap-выборка для Дерева 3</h4>
            <div class="calc">
              Тянем 6 раз с возвращением: [1, 2, 3, 5, 5, 6]<br>
              &nbsp;&nbsp;индекс 1 — 1 раз, индекс 2 — 1 раз, индекс 3 — 1 раз,<br>
              &nbsp;&nbsp;индекс 4 — 0 раз, индекс 5 — 2 раза, индекс 6 — 1 раз.<br>
              OOB (не попали): {4}
            </div>
            <p>Для корня Дерева 3 случайно выпал признак: <b>Вес</b>.</p>
            <div class="calc">
              Данные: {1,2,3,5,5,6} → 3 яблока (150,170,130), 3 апельс. (190,190,210)<br>
              Gini корня = 1 − (3/6)² − (3/6)² = <b>0.5</b><br><br>
              Порог Вес &lt; 185:<br>
              &nbsp;&nbsp;Левое: {1,2,3} → 150,170,130 → 3 яблока, 0 апельс. → Gini = 0<br>
              &nbsp;&nbsp;Правое: {5,5,6} → 190,190,210 → 0 яблок, 3 апельс. → Gini = 0<br>
              &nbsp;&nbsp;Взвешенный Gini = 0. Снижение = 0.5 − 0 = <b>0.5</b>
            </div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="15" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Дерево 3: Вес &lt; 185?</text>
              <!-- Root node -->
              <rect x="135" y="25" width="150" height="44" rx="8" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
              <text x="210" y="43" text-anchor="middle" font-size="11" font-weight="700" fill="#3730a3">Вес &lt; 185?</text>
              <text x="210" y="59" text-anchor="middle" font-size="9" fill="#4338ca">Gini корня = 0.5</text>
              <!-- Left branch -->
              <line x1="175" y1="69" x2="100" y2="110" stroke="#16a34a" stroke-width="2"/>
              <text x="100" y="98" font-size="9" fill="#16a34a" font-weight="600">Да</text>
              <!-- Right branch -->
              <line x1="245" y1="69" x2="320" y2="110" stroke="#ea580c" stroke-width="2"/>
              <text x="300" y="98" font-size="9" fill="#ea580c" font-weight="600">Нет</text>
              <!-- Left leaf -->
              <rect x="40" y="110" width="120" height="48" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
              <text x="100" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">Яблоко</text>
              <text x="100" y="146" text-anchor="middle" font-size="9" fill="#166534">3 яблока / 0 апельс.</text>
              <text x="100" y="159" text-anchor="middle" font-size="9" fill="#166534">Gini = 0</text>
              <!-- Right leaf -->
              <rect x="260" y="110" width="120" height="48" rx="8" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
              <text x="320" y="129" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c">Апельсин</text>
              <text x="320" y="146" text-anchor="middle" font-size="9" fill="#9a3412">0 яблок / 3 апельс.</text>
              <text x="320" y="159" text-anchor="middle" font-size="9" fill="#9a3412">Gini = 0</text>
            </svg>
            <div class="caption">Дерево 3 аналогично Дереву 1 использует порог по Весу. Они похожи структурой, но обучались на разных bootstrap-выборках.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: классифицируем новый фрукт (Вес=160г, Цвет=5)</h4>
            <div class="calc">
              <b>Дерево 1</b> (Вес &lt; 185?):<br>
              &nbsp;&nbsp;160 &lt; 185? → Да → лист «Яблоко». Предсказание: <b>Яблоко</b><br><br>
              <b>Дерево 2</b> (Цвет &lt; 5.5?):<br>
              &nbsp;&nbsp;5 &lt; 5.5? → Да → лист «Яблоко». Предсказание: <b>Яблоко</b><br><br>
              <b>Дерево 3</b> (Вес &lt; 185?):<br>
              &nbsp;&nbsp;160 &lt; 185? → Да → лист «Яблоко». Предсказание: <b>Яблоко</b><br><br>
              Голосование: Яблоко=3, Апельсин=0<br>
              Итог: <b>Яблоко</b> (единогласно, 3:0)
            </div>
            <div class="why">Все три дерева согласны. Это сильный сигнал — высокая уверенность леса. Если бы деревья расходились (2:1), уверенность была бы ниже.</div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
              <text x="250" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Голосование: Вес=160г, Цвет=5</text>
              <!-- New fruit box -->
              <rect x="10" y="25" width="90" height="50" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
              <text x="55" y="46" text-anchor="middle" font-size="9" font-weight="600" fill="#334155">Новый фрукт</text>
              <text x="55" y="59" text-anchor="middle" font-size="9" fill="#64748b">Вес=160г</text>
              <text x="55" y="72" text-anchor="middle" font-size="9" fill="#64748b">Цвет=5</text>
              <!-- Arrow -->
              <line x1="100" y1="50" x2="130" y2="50" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#arr)"/>
              <!-- Tree 1 -->
              <rect x="130" y="25" width="80" height="50" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
              <text x="170" y="44" text-anchor="middle" font-size="9" font-weight="600" fill="#3730a3">Дерево 1</text>
              <text x="170" y="57" text-anchor="middle" font-size="9" fill="#4338ca">Вес&lt;185?</text>
              <text x="170" y="69" text-anchor="middle" font-size="10" font-weight="700" fill="#16a34a">→ Яблоко</text>
              <!-- Tree 2 -->
              <rect x="220" y="25" width="80" height="50" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
              <text x="260" y="44" text-anchor="middle" font-size="9" font-weight="600" fill="#78350f">Дерево 2</text>
              <text x="260" y="57" text-anchor="middle" font-size="9" fill="#92400e">Цвет&lt;5.5?</text>
              <text x="260" y="69" text-anchor="middle" font-size="10" font-weight="700" fill="#16a34a">→ Яблоко</text>
              <!-- Tree 3 -->
              <rect x="310" y="25" width="80" height="50" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
              <text x="350" y="44" text-anchor="middle" font-size="9" font-weight="600" fill="#3730a3">Дерево 3</text>
              <text x="350" y="57" text-anchor="middle" font-size="9" fill="#4338ca">Вес&lt;185?</text>
              <text x="350" y="69" text-anchor="middle" font-size="10" font-weight="700" fill="#16a34a">→ Яблоко</text>
              <!-- Vote result -->
              <rect x="405" y="20" width="85" height="60" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
              <text x="447" y="41" text-anchor="middle" font-size="9" font-weight="600" fill="#166534">Голосование</text>
              <text x="447" y="54" text-anchor="middle" font-size="10" font-weight="700" fill="#15803d">Яблоко</text>
              <text x="447" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#16a34a">3 : 0</text>
            </svg>
            <div class="caption">Все три дерева единогласно предсказывают «Яблоко». Лес уверен на 100%.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7: OOB-оценка качества</h4>
            <p>Для каждого объекта собираем предсказания только тех деревьев, в чьих bootstrap-выборках этот объект <b>отсутствовал</b> (OOB-деревья).</p>
            <div class="calc">
              <b>Объект 2</b> (Вес=170, Цвет=4, класс=Яблоко): OOB для Дерева 1.<br>
              &nbsp;&nbsp;Дерево 1: Вес 170 &lt; 185? → Да → Яблоко ✓<br><br>
              <b>Объект 1</b> (Вес=150, Цвет=3, класс=Яблоко): OOB для Дерева 2.<br>
              &nbsp;&nbsp;Дерево 2: Цвет 3 &lt; 5.5? → Да → Яблоко ✓<br><br>
              <b>Объект 3</b> (Вес=130, Цвет=2, класс=Яблоко): OOB для Дерева 2.<br>
              &nbsp;&nbsp;Дерево 2: Цвет 2 &lt; 5.5? → Да → Яблоко ✓<br><br>
              <b>Объект 4</b> (Вес=200, Цвет=8, класс=Апельсин): OOB для Дерева 3.<br>
              &nbsp;&nbsp;Дерево 3: Вес 200 &lt; 185? → Нет → Апельсин ✓<br><br>
              Итог: 4 из 4 правильно. <b>OOB Accuracy = 4/4 = 100%</b>
            </div>
            <div class="why">OOB — бесплатная кросс-валидация: каждый объект проверяется деревьями, которые его «не видели» при обучении. Нет data leakage, не нужен отдельный test set.</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Объект</th><th>Класс</th><th>OOB-дерево</th><th>Предсказание OOB</th><th>Верно?</th></tr>
              <tr><td>2 (Яблоко)</td><td style="color:#16a34a">Яблоко</td><td>Дерево 1</td><td style="color:#16a34a">Яблоко</td><td>✓</td></tr>
              <tr><td>1 (Яблоко)</td><td style="color:#16a34a">Яблоко</td><td>Дерево 2</td><td style="color:#16a34a">Яблоко</td><td>✓</td></tr>
              <tr><td>3 (Яблоко)</td><td style="color:#16a34a">Яблоко</td><td>Дерево 2</td><td style="color:#16a34a">Яблоко</td><td>✓</td></tr>
              <tr><td>4 (Апельс.)</td><td style="color:#ea580c">Апельсин</td><td>Дерево 3</td><td style="color:#ea580c">Апельсин</td><td>✓</td></tr>
            </table>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p><b>Новый фрукт (Вес=160г, Цвет=5):</b> все 3 дерева предсказывают Яблоко (3:0).<br>
            <b>OOB Accuracy = 100%</b> (4 из 4 OOB-объектов распознаны верно).<br>
            Лес из 3 деревьев = два уровня разнообразия: разные bootstrap-выборки + разные случайные признаки в каждом узле.</p>
          </div>
          <div class="lesson-box">
            Ключевой принцип Random Forest: чем <b>менее коррелированы</b> деревья, тем больше выигрыш от ансамбля. bootstrap + max_features — два механизма снижения корреляции. В среднем bootstrap пропускает ≈ 36.8% объектов: lim(1−1/n)ⁿ = e⁻¹ ≈ 0.368.
          </div>
        `,
      },
      {
        title: 'Feature Importance пошагово',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Вычислить важность признаков для леса из 3 деревьев (из Примера 1). Использовать MDI (Mean Decrease in Impurity) и показать Permutation Importance как альтернативу.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: снижение нечистоты в каждом дереве</h4>
            <p>MDI-важность признака = суммарное снижение Gini по всем разбиениям по этому признаку в дереве, взвешенное на долю объектов в узле.</p>
            <div class="calc">
              <b>Формула:</b> ΔGini(узел) = n_узла/n_всего × (Gini_родителя − Gini_взвешенный_детей)<br><br>
              <b>Дерево 1</b> (обучалось на 6 объектах, использовало признак Вес):<br>
              &nbsp;&nbsp;Корень: n=6, Gini_до=0.5, Gini_после=0<br>
              &nbsp;&nbsp;ΔGini(Вес) = (6/6) × (0.5 − 0) = <b>0.500</b><br>
              &nbsp;&nbsp;ΔGini(Цвет) = 0 (признак не использован)<br><br>
              <b>Дерево 2</b> (6 объектов, использовало признак Цвет):<br>
              &nbsp;&nbsp;Корень: n=6, Gini_до=0.444, Gini_после=0<br>
              &nbsp;&nbsp;ΔGini(Цвет) = (6/6) × (0.444 − 0) = <b>0.444</b><br>
              &nbsp;&nbsp;ΔGini(Вес) = 0 (признак не использован)<br><br>
              <b>Дерево 3</b> (6 объектов, использовало признак Вес):<br>
              &nbsp;&nbsp;Корень: n=6, Gini_до=0.5, Gini_после=0<br>
              &nbsp;&nbsp;ΔGini(Вес) = (6/6) × (0.5 − 0) = <b>0.500</b><br>
              &nbsp;&nbsp;ΔGini(Цвет) = 0 (признак не использован)
            </div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: усредняем по всем деревьям</h4>
            <div class="calc">
              <b>Важность Вес:</b><br>
              &nbsp;&nbsp;= (ΔGini_дерево1 + ΔGini_дерево2 + ΔGini_дерево3) / 3<br>
              &nbsp;&nbsp;= (0.500 + 0.000 + 0.500) / 3<br>
              &nbsp;&nbsp;= 1.000 / 3 = <b>0.333</b><br><br>
              <b>Важность Цвет:</b><br>
              &nbsp;&nbsp;= (0.000 + 0.444 + 0.000) / 3<br>
              &nbsp;&nbsp;= 0.444 / 3 = <b>0.148</b>
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: нормализация (сумма = 1)</h4>
            <div class="calc">
              Сумма сырых важностей = 0.333 + 0.148 = <b>0.481</b><br><br>
              Нормализованная важность Вес:<br>
              &nbsp;&nbsp;= 0.333 / 0.481 = <b>0.693 ≈ 69.3%</b><br><br>
              Нормализованная важность Цвет:<br>
              &nbsp;&nbsp;= 0.148 / 0.481 = <b>0.308 ≈ 30.7%</b><br><br>
              Проверка: 69.3% + 30.7% = 100% ✓
            </div>
            <div class="why">Признак Вес важнее: он использовался в 2 деревьях из 3 и давал большое снижение Gini. Цвет использован только в 1 дереве — меньший вклад.</div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 400 135" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;">
              <text x="200" y="15" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">MDI Feature Importance</text>
              <!-- Bar background -->
              <rect x="90" y="30" width="270" height="30" rx="4" fill="#f1f5f9"/>
              <rect x="90" y="30" width="187" height="30" rx="4" fill="#6366f1"/>
              <text x="80" y="51" text-anchor="end" font-size="10" font-weight="600" fill="#334155">Вес (г)</text>
              <text x="285" y="51" font-size="10" font-weight="700" fill="#fff">69.3%</text>
              <!-- Цвет bar -->
              <rect x="90" y="75" width="270" height="30" rx="4" fill="#f1f5f9"/>
              <rect x="90" y="75" width="83" height="30" rx="4" fill="#f59e0b"/>
              <text x="80" y="96" text-anchor="end" font-size="10" font-weight="600" fill="#334155">Цвет</text>
              <text x="100" y="96" font-size="10" font-weight="700" fill="#fff">30.7%</text>
              <!-- Axis -->
              <line x1="90" y1="120" x2="360" y2="120" stroke="#94a3b8" stroke-width="1"/>
              <text x="90" y="130" text-anchor="middle" font-size="8" fill="#94a3b8">0%</text>
              <text x="225" y="130" text-anchor="middle" font-size="8" fill="#94a3b8">50%</text>
              <text x="360" y="130" text-anchor="middle" font-size="8" fill="#94a3b8">100%</text>
            </svg>
            <div class="caption">MDI Feature Importance: Вес (69.3%) важнее Цвета (30.7%), потому что 2 дерева из 3 выбрали его для первого разбиения.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Permutation Importance — альтернативный метод</h4>
            <p>Идея: если признак важен, то перемешивание его значений ухудшит качество модели. Если нет — качество останется прежним.</p>
            <div class="calc">
              Базовая точность леса на тренировочных данных: 6/6 = 1.00<br><br>
              <b>Шаг A: перемешиваем Вес</b><br>
              &nbsp;&nbsp;Исходные Вес: [150,170,130,200,190,210]<br>
              &nbsp;&nbsp;После shuffle (пример): [200,130,210,150,170,190]<br>
              &nbsp;&nbsp;Теперь объект №1 имеет Вес=200 (апельсиновый вес) с классом Яблоко<br>
              &nbsp;&nbsp;Дерево 1 (Вес&lt;185): предсказывает Апельсин для №1 → ошибка!<br>
              &nbsp;&nbsp;Точность после shuffle Вес ≈ 3/6 = 0.50<br>
              &nbsp;&nbsp;Permutation Importance(Вес) = 1.00 − 0.50 = <b>0.50</b><br><br>
              <b>Шаг B: перемешиваем Цвет</b><br>
              &nbsp;&nbsp;Дерево 2 (Цвет&lt;5.5) теряет разделяющую силу при shuffle Цвета<br>
              &nbsp;&nbsp;Деревья 1 и 3 не используют Цвет → не страдают<br>
              &nbsp;&nbsp;Точность после shuffle Цвет ≈ 4/6 = 0.67 (2 дерева из 3 работают правильно)<br>
              &nbsp;&nbsp;Permutation Importance(Цвет) = 1.00 − 0.67 = <b>0.33</b><br><br>
              Нормализация: Вес=0.50/(0.50+0.33)=<b>60.2%</b>, Цвет=0.33/(0.50+0.33)=<b>39.8%</b>
            </div>
            <div class="why">MDI и Permutation Importance дают похожие результаты (Вес важнее), но не идентичные. Permutation Importance надёжнее при высококардинальных числовых признаках, MDI — быстрее.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p><b>MDI:</b> Вес = 69.3%, Цвет = 30.7%.<br>
            <b>Permutation Importance:</b> Вес ≈ 60%, Цвет ≈ 40%.<br>
            Оба метода согласны: Вес — более важный признак. В sklearn: <code>model.feature_importances_</code> даёт MDI, <code>permutation_importance(model, X, y)</code> — permutation-метод.</p>
          </div>
          <div class="lesson-box">
            MDI имеет известный недостаток: он завышает важность признаков с большим количеством уникальных значений (bias towards high cardinality). Permutation Importance лишён этого bias, но требует отдельного evaluation dataset — иначе даст optimistically biased оценку.
          </div>
        `,
      },
      {
        title: 'Почему лес лучше одного дерева',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Объяснить математически и через числа, почему Random Forest превосходит одно дерево. Показать связь между корреляцией деревьев, их дисперсией и дисперсией леса.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: проблема одного дерева — высокий variance</h4>
            <div class="calc">
              Одно дерево без ограничений глубины:<br>
              &nbsp;&nbsp;Train accuracy = 100% (идеально запоминает обучающие данные)<br>
              &nbsp;&nbsp;Test accuracy = 83% (не обобщает новые примеры)<br>
              &nbsp;&nbsp;Bias = ~0 (дерево очень гибкое)<br>
              &nbsp;&nbsp;Variance = высокий: маленькое изменение данных → другое дерево<br><br>
              Если заменить 2 объекта из 100 — дерево может измениться кардинально.<br>
              Это overfit: дерево учит «шум» в данных.
            </div>
            <div class="why">Глубокое дерево — unstable learner: высокая дисперсия предсказаний между разными выборками. Именно это исправляет Random Forest.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: теорема об ошибке леса</h4>
            <p>Пусть каждое дерево — случайная величина с дисперсией σ² и средней парной корреляцией ρ между предсказаниями.</p>
            <div class="calc">
              <b>Дисперсия среднего T деревьев:</b><br>
              Var(среднего T деревьев) = ρ·σ² + (1−ρ)/T · σ²<br><br>
              Разберём формулу по частям:<br>
              &nbsp;&nbsp;ρ·σ² — «неустранимый» шум: коррелированная часть ошибки,<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;не исчезает даже при T→∞<br>
              &nbsp;&nbsp;(1−ρ)/T · σ² — «устранимый» шум: при увеличении T→∞ стремится к 0<br><br>
              При T→∞: Var → ρ·σ² (нижняя граница)
            </div>
            <div class="why">Поэтому нужно снижать ρ (корреляцию между деревьями). Именно это делает Random Feature Selection: деревья используют разные признаки → меньше похожи → меньше коррелируют.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: числовой пример</h4>
            <div class="calc">
              Параметры одного дерева:<br>
              &nbsp;&nbsp;σ² = 0.10 (дисперсия предсказания одного дерева)<br>
              &nbsp;&nbsp;ρ = 0.30 (средняя корреляция между парами деревьев)<br><br>
              <b>Одно дерево (T=1):</b><br>
              &nbsp;&nbsp;Var = ρ·σ² + (1−ρ)/1 · σ²<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0.30·0.10 + (1−0.30)/1 · 0.10<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0.030 + 0.70·0.10<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0.030 + 0.070 = <b>0.100</b> (= σ², как и ожидалось)<br><br>
              <b>Лес из T=10 деревьев:</b><br>
              &nbsp;&nbsp;Var = 0.30·0.10 + (1−0.30)/10 · 0.10<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0.030 + 0.70/10 · 0.10<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0.030 + 0.007 = <b>0.037</b><br>
              &nbsp;&nbsp;Снижение: 0.100 → 0.037 = в <b>2.7 раза</b> меньше<br><br>
              <b>Лес из T=100 деревьев:</b><br>
              &nbsp;&nbsp;Var = 0.30·0.10 + (1−0.30)/100 · 0.10<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0.030 + 0.70/100 · 0.10<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 0.030 + 0.0007 = <b>0.0307</b><br>
              &nbsp;&nbsp;Снижение: 0.100 → 0.031 = в <b>3.2 раза</b> меньше<br><br>
              <b>Лес из T=∞ деревьев (предел):</b><br>
              &nbsp;&nbsp;Var = ρ·σ² = 0.30·0.10 = <b>0.030</b><br>
              &nbsp;&nbsp;Снижение: 0.100 → 0.030 = в <b>3.3 раза</b> меньше<br><br>
              Вывод: от 10 деревьев до ∞ деревьев выигрыш всего 0.037→0.030.<br>
              Большинство пользы — уже в первых ~100 деревьях!
            </div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <text x="240" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Variance леса vs число деревьев (ρ=0.3, σ²=0.1)</text>
              <!-- Y axis -->
              <line x1="55" y1="25" x2="55" y2="145" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- X axis -->
              <line x1="55" y1="145" x2="445" y2="145" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Y labels -->
              <text x="50" y="29" text-anchor="end" font-size="8" fill="#64748b">0.10</text>
              <text x="50" y="69" text-anchor="end" font-size="8" fill="#64748b">0.07</text>
              <text x="50" y="109" text-anchor="end" font-size="8" fill="#64748b">0.04</text>
              <text x="50" y="148" text-anchor="end" font-size="8" fill="#64748b">0.03</text>
              <!-- Horizontal dashed line at ρσ²=0.030 (asymptote) -->
              <line x1="55" y1="140" x2="445" y2="140" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3"/>
              <text x="445" y="143" text-anchor="end" font-size="8" fill="#ef4444">ρσ²=0.03</text>
              <!-- Single tree bar T=1 -->
              <rect x="70" y="25" width="50" height="120" rx="3" fill="#f87171" opacity="0.85"/>
              <text x="95" y="21" text-anchor="middle" font-size="8" font-weight="600" fill="#dc2626">0.100</text>
              <text x="95" y="160" text-anchor="middle" font-size="8" fill="#64748b">T=1</text>
              <!-- T=5 -->
              <rect x="145" y="76" width="50" height="69" rx="3" fill="#fb923c" opacity="0.85"/>
              <text x="170" y="72" text-anchor="middle" font-size="8" font-weight="600" fill="#c2410c">0.044</text>
              <text x="170" y="160" text-anchor="middle" font-size="8" fill="#64748b">T=5</text>
              <!-- T=10 -->
              <rect x="220" y="95" width="50" height="50" rx="3" fill="#fbbf24" opacity="0.85"/>
              <text x="245" y="91" text-anchor="middle" font-size="8" font-weight="600" fill="#78350f">0.037</text>
              <text x="245" y="160" text-anchor="middle" font-size="8" fill="#64748b">T=10</text>
              <!-- T=50 -->
              <rect x="295" y="104" width="50" height="41" rx="3" fill="#4ade80" opacity="0.85"/>
              <text x="320" y="100" text-anchor="middle" font-size="8" font-weight="600" fill="#15803d">0.031</text>
              <text x="320" y="160" text-anchor="middle" font-size="8" fill="#64748b">T=50</text>
              <!-- T=100 -->
              <rect x="370" y="106" width="50" height="39" rx="3" fill="#34d399" opacity="0.85"/>
              <text x="395" y="102" text-anchor="middle" font-size="8" font-weight="600" fill="#065f46">0.031</text>
              <text x="395" y="160" text-anchor="middle" font-size="8" fill="#64748b">T=100</text>
              <!-- Legend -->
              <line x1="70" y1="170" x2="90" y2="170" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3"/>
              <text x="94" y="173" font-size="8" fill="#64748b">предел при T→∞: Var = ρ·σ² = 0.030</text>
            </svg>
            <div class="caption">Variance быстро падает с первыми деревьями (T=1→10: в 2.7 раза), затем замедляется. При T≥100 дальнейшее добавление деревьев даёт минимальный прирост — ограничением становится ρσ².</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: практические последствия</h4>
            <div class="calc">
              <b>Одно глубокое дерево:</b><br>
              &nbsp;&nbsp;Train accuracy = 100%, Test accuracy = 83%<br>
              &nbsp;&nbsp;Разрыв = 17% → явный overfit (высокий variance)<br><br>
              <b>Random Forest (100 деревьев, ρ=0.3):</b><br>
              &nbsp;&nbsp;Train accuracy = 100%, Test accuracy = 95%<br>
              &nbsp;&nbsp;Разрыв = 5% → overfit значительно меньше<br><br>
              Улучшение test accuracy: 83% → 95% (+12%)<br>
              Причина: variance снизился в ~3 раза (0.10 → 0.031)<br><br>
              <b>Что если снизить ρ с 0.3 до 0.1?</b><br>
              &nbsp;&nbsp;(Меньше коррелированные деревья — эффективнее forest)<br>
              &nbsp;&nbsp;При ρ=0.1, T=100: Var = 0.1·0.1 + 0.9/100·0.1 = 0.010 + 0.001 = 0.011<br>
              &nbsp;&nbsp;Снижение vs одного дерева: в 0.1/0.011 ≈ <b>9 раз!</b>
            </div>
            <div class="why">Чтобы снизить ρ: (1) уменьшить max_features — деревья используют разные признаки; (2) добавить случайность в пороги (Extra Trees). Баланс: слишком маленький max_features → слабые деревья (высокий bias).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p><b>Формула:</b> Var(лес из T деревьев) = ρ·σ² + (1−ρ)/T · σ²<br>
            При ρ=0.3, σ²=0.1, T=100: Var = 0.030 + 0.001 = <b>0.031</b> против 0.100 у одного дерева — <b>в 3.2 раза меньше</b>.<br>
            Практически: Test accuracy 83% (1 дерево) → 95% (100 деревьев). Ключ — снижение корреляции через random features.</p>
          </div>
          <div class="lesson-box">
            Два предельных случая формулы: (1) ρ=0 (независимые деревья) → Var = σ²/T → при T→∞ ошибка исчезает; (2) ρ=1 (идентичные деревья) → Var = σ² → лес = одно дерево, никакой пользы. Реальный RF: 0 &lt; ρ &lt; 1, поэтому он всегда лучше одного дерева, но есть предел улучшения.
          </div>
        `,
      },
    ],

    simulation: [
    {
      title: 'Граница решений',
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
    {
      title: 'OOB vs Test: кривые ошибки',
      html: `
        <h3>Снижение ошибки по мере роста числа деревьев</h3>
        <p>Строим лес и по ходу считаем <b>OOB accuracy</b> (оценка по bag-out объектам — бесплатный валидационный набор) и <b>Test accuracy</b>. Видно, что обе кривые сходятся к одному значению: OOB — честная оценка без отдельной тест-выборки. Прирост быстро насыщается после ~30-50 деревьев — добавлять 1000 бессмысленно.</p>
        <div class="sim-container">
          <div class="sim-controls" id="rf2-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="rf2-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="rf2-chart"></canvas></div>
            <div class="sim-stats" id="rf2-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#rf2-controls');
        const cShape = App.makeControl('select', 'rf2-shape', 'Форма данных', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'xor', label: 'XOR' }, { value: 'circle', label: 'Круг' }],
          value: 'moons',
        });
        const cDepth = App.makeControl('range', 'rf2-depth', 'Max depth', { min: 1, max: 12, step: 1, value: 6 });
        const cNoise = App.makeControl('range', 'rf2-noise', 'Шум (% меток)', { min: 0, max: 30, step: 1, value: 10 });
        const cN = App.makeControl('range', 'rf2-n', 'Точек (train)', { min: 50, max: 400, step: 25, value: 150 });
        [cShape, cDepth, cNoise, cN].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let train = [], test = [];

        function genPoint(shape, noise) {
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
          } else if (shape === 'xor') {
            x = Math.random(); y = Math.random();
            cls = ((x > 0.5) ^ (y > 0.5)) ? 1 : 0;
          } else {
            x = Math.random(); y = Math.random();
            const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
            cls = r < 0.25 ? 0 : 1;
          }
          if (Math.random() < noise) cls = 1 - cls;
          return { x, y, cls };
        }

        function genData() {
          const shape = cShape.input.value;
          const noise = +cNoise.input.value / 100;
          const n = +cN.input.value;
          train = []; test = [];
          for (let i = 0; i < n; i++) train.push(genPoint(shape, noise));
          for (let i = 0; i < 400; i++) test.push(genPoint(shape, 0));
          update();
        }

        function gini(items) {
          if (items.length === 0) return 0;
          let c0 = 0, c1 = 0;
          items.forEach(p => p.cls === 0 ? c0++ : c1++);
          const p0 = c0 / items.length, p1 = c1 / items.length;
          return 1 - p0 * p0 - p1 * p1;
        }
        function majority(items) { let c0 = 0; items.forEach(p => p.cls === 0 && c0++); return c0 >= items.length - c0 ? 0 : 1; }

        function buildTree(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length < 2 || gini(items) < 1e-9) {
            return { leaf: true, cls: majority(items) };
          }
          const feats = ['x', 'y'];
          const chosen = [feats[Math.floor(Math.random() * 2)]];
          let best = null;
          const base = gini(items);
          chosen.forEach(feat => {
            const vals = items.map(p => p[feat]).sort((a, b) => a - b);
            const tryN = Math.min(vals.length - 1, 15);
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
            left: buildTree(best.L, depth + 1, maxDepth),
            right: buildTree(best.R, depth + 1, maxDepth),
          };
        }

        function predictTree(tree, x, y) {
          if (tree.leaf) return tree.cls;
          const v = tree.feat === 'x' ? x : y;
          return v < tree.thr ? predictTree(tree.left, x, y) : predictTree(tree.right, x, y);
        }

        function update() {
          const maxDepth = +cDepth.input.value;
          const nTreesMax = 60;

          // Один "эталонный" deep tree для сравнения
          const singleTree = buildTree(train, 0, maxDepth);
          let singleCorrect = 0;
          test.forEach(p => { if (predictTree(singleTree, p.x, p.y) === p.cls) singleCorrect++; });
          const singleAcc = singleCorrect / test.length;

          // Накопительные голоса
          const oobVotes = train.map(() => [0, 0]);
          const testVotes = test.map(() => [0, 0]);
          const oobSeen = train.map(() => false);
          const oobCurve = [];
          const testCurve = [];
          const xs = [];

          for (let t = 0; t < nTreesMax; t++) {
            const sample = [];
            const inBag = new Set();
            for (let i = 0; i < train.length; i++) {
              const idx = Math.floor(Math.random() * train.length);
              sample.push(train[idx]);
              inBag.add(idx);
            }
            const tree = buildTree(sample, 0, maxDepth);
            // OOB predictions
            for (let i = 0; i < train.length; i++) {
              if (!inBag.has(i)) {
                const p = predictTree(tree, train[i].x, train[i].y);
                oobVotes[i][p]++;
                oobSeen[i] = true;
              }
            }
            // Test votes
            for (let i = 0; i < test.length; i++) {
              const p = predictTree(tree, test[i].x, test[i].y);
              testVotes[i][p]++;
            }
            // точки для графика
            if ((t + 1) % 3 === 0 || t === 0) {
              let oC = 0, oT = 0;
              for (let i = 0; i < train.length; i++) {
                if (oobSeen[i]) {
                  oT++;
                  const pred = oobVotes[i][1] > oobVotes[i][0] ? 1 : 0;
                  if (pred === train[i].cls) oC++;
                }
              }
              let tC = 0;
              for (let i = 0; i < test.length; i++) {
                const pred = testVotes[i][1] > testVotes[i][0] ? 1 : 0;
                if (pred === test[i].cls) tC++;
              }
              xs.push(t + 1);
              oobCurve.push(oT > 0 ? oC / oT : 0);
              testCurve.push(tC / test.length);
            }
          }

          const singleLine = xs.map(() => singleAcc);

          const ctx = container.querySelector('#rf2-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xs,
              datasets: [
                { label: 'OOB accuracy', data: oobCurve, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 2.5, pointRadius: 2, fill: false, tension: 0.2 },
                { label: 'Test accuracy', data: testCurve, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', borderWidth: 2.5, pointRadius: 2, fill: false, tension: 0.2 },
                { label: 'Одно дерево (test)', data: singleLine, borderColor: '#ef4444', borderWidth: 1.8, borderDash: [5, 4], pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Accuracy vs число деревьев' }, legend: { position: 'top' } },
              scales: {
                x: { title: { display: true, text: 'n_trees' } },
                y: { suggestedMin: 0.5, suggestedMax: 1.02, title: { display: true, text: 'Accuracy' } },
              },
            },
          });
          App.registerChart(chart);

          container.querySelector('#rf2-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Одно дерево</div><div class="stat-value">${(singleAcc * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Лес @ ${nTreesMax} (test)</div><div class="stat-value">${(testCurve[testCurve.length - 1] * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Лес @ ${nTreesMax} (OOB)</div><div class="stat-value">${(oobCurve[oobCurve.length - 1] * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">OOB − Test</div><div class="stat-value">${((oobCurve[oobCurve.length - 1] - testCurve[testCurve.length - 1]) * 100).toFixed(2)}%</div></div>
          `;
        }

        [cShape, cNoise, cN].forEach(c => c.input.addEventListener('change', genData));
        cDepth.input.addEventListener('input', update);
        container.querySelector('#rf2-regen').onclick = genData;
        genData();
      },
    },
    ],

    python: `
      <h3>Python: случайный лес</h3>
      <p>sklearn.RandomForestClassifier — мощный ансамбль с OOB-оценкой и встроенной важностью признаков.</p>

      <h4>1. Обучение и OOB-оценка</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# oob_score=True — оценка без отдельной тест-выборки (бесплатно)
rf = RandomForestClassifier(n_estimators=200, max_depth=None,
                             min_samples_split=2, max_features='sqrt',
                             oob_score=True, n_jobs=-1, random_state=42)
rf.fit(X_train, y_train)

y_pred = rf.predict(X_test)
y_proba = rf.predict_proba(X_test)[:, 1]

print(f'OOB Score:    {rf.oob_score_:.4f}')
print(f'Test Accuracy: {rf.score(X_test, y_test):.4f}')
print(f'ROC-AUC:      {roc_auc_score(y_test, y_proba):.4f}')
print(classification_report(y_test, y_pred, target_names=data.target_names))</code></pre>

      <h4>2. Важность признаков</h4>
      <pre><code>import pandas as pd

# feature_importances_ — среднее снижение impurity по всем деревьям
importances = pd.Series(rf.feature_importances_, index=data.feature_names)
top15 = importances.sort_values(ascending=False).head(15)

plt.figure(figsize=(8, 6))
top15.plot(kind='barh')
plt.xlabel('Feature Importance (Mean Impurity Decrease)')
plt.title('Random Forest: важность признаков')
plt.tight_layout()
plt.show()

# Permutation importance — более честная оценка
from sklearn.inspection import permutation_importance
result = permutation_importance(rf, X_test, y_test, n_repeats=10, random_state=42)
perm_df = pd.DataFrame({'importance': result.importances_mean,
                         'std': result.importances_std},
                        index=data.feature_names).sort_values('importance', ascending=False)
print(perm_df.head(10).round(4))</code></pre>

      <h4>3. Влияние числа деревьев и настройка</h4>
      <pre><code># Как меняется OOB и test accuracy от числа деревьев
n_trees = [5, 10, 20, 50, 100, 200]
oob_scores, test_scores = [], []

for n in n_trees:
    model = RandomForestClassifier(n_estimators=n, oob_score=True,
                                    n_jobs=-1, random_state=42)
    model.fit(X_train, y_train)
    oob_scores.append(model.oob_score_)
    test_scores.append(model.score(X_test, y_test))

plt.plot(n_trees, oob_scores, 'o-', label='OOB Score')
plt.plot(n_trees, test_scores, 's-', label='Test Score')
plt.xlabel('Число деревьев')
plt.ylabel('Accuracy')
plt.title('Random Forest: сходимость с ростом деревьев')
plt.legend()
plt.show()

# GridSearchCV для ключевых параметров
from sklearn.model_selection import GridSearchCV
param_grid = {'n_estimators': [100], 'max_features': ['sqrt', 'log2', 0.5],
              'max_depth': [None, 10, 20]}
grid = GridSearchCV(RandomForestClassifier(oob_score=False, random_state=42),
                    param_grid, cv=5, scoring='roc_auc', n_jobs=-1)
grid.fit(X_train, y_train)
print(f'Лучшие параметры: {grid.best_params_}')
print(f'CV ROC-AUC: {grid.best_score_:.4f}')</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Кредитный скоринг и антифрод.</b> Банки годами держат RF как продакшен-модель: устойчивость к выбросам (мошеннические транзакции всегда нетипичны), нативная работа с пропусками в анкетах клиента и adequate калибровка через isotonic делают его надёжным «рабочим конём».</li>
        <li><b>Биоинформатика и геномика.</b> Когда признаков тысячи (экспрессия генов, SNP-маркеры), а объектов — сотни пациентов, <code>max_features='sqrt'</code> и bagging спасают от переобучения там, где линейные модели переобучились бы на шум.</li>
        <li><b>Feature importance и EDA.</b> Permutation importance на RF — стандартный способ быстро понять «какие признаки реально двигают таргет» перед тем, как строить более сложные модели или выкидывать ненужные фичи.</li>
        <li><b>Baseline за 10 минут.</b> Первая модель, которую запускают на новой табличной задаче: почти не требует тюнинга, даёт разумное качество, показывает «есть ли сигнал». Все последующие улучшения сравниваются с ней.</li>
        <li><b>Задачи с шумными данными и пропусками.</b> Промышленные сенсоры, медицинские анкеты, данные колл-центров — там, где чистить данные дорого, а RF всё равно переварит.</li>
        <li><b>Isolation Forest для детекции аномалий.</b> Родственная RF-архитектура: случайные деревья изолируют выбросы за меньшее число разбиений. Стандарт для поиска фрода и дефектов.</li>
        <li><b>Similarity / proximity matrix.</b> Два объекта считаются похожими, если часто попадают в один лист. Это даёт unsupervised-представление без расстояний и кернелов.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Работает «из коробки» без тюнинга.</b> Дефолты sklearn (<code>n_estimators=100</code>, <code>max_features='sqrt'</code>) в 80% случаев дают качество на 2-3% хуже идеально оттюненного XGBoost. На задаче, где ты не победитель Kaggle, эти 2-3% не стоят дня работы с гиперпараметрами.</p>
      <p><b>Практически не переобучается с ростом числа деревьев.</b> По закону больших чисел ошибка ансамбля сходится к пределу при $T \\to \\infty$. Добавление деревьев не ухудшает модель — только замедляет. Это редкое свойство: у бустинга больше $T$ = больший риск переобучения.</p>
      <p><b>OOB error — бесплатная кросс-валидация.</b> Каждое дерево обучается на bootstrap-выборке, поэтому ~37% данных остаются out-of-bag. На них можно честно оценить качество, не тратя отдельный validation set. Экономит данные на маленьких датасетах.</p>
      <p><b>Устойчивость к выбросам и пропускам.</b> Выброс попадает в один лист одного дерева и усредняется с остальными 99 прогнозами. Пропуски обрабатываются surrogate splits. В отличие от линейной регрессии или нейросетей, предобработка здесь минимальна.</p>
      <p><b>Идеально параллелится.</b> Каждое дерево независимо — <code>n_jobs=-1</code> и обучение ускоряется линейно по ядрам. Бустингу это недоступно: там $T_{t+1}$ зависит от $T_t$.</p>
      <p><b>Смешанные типы признаков без preprocessing.</b> Числа, категории (после ordinal encoding), разные масштабы — всё работает. Никакого StandardScaler, PolynomialFeatures и прочей возни.</p>
      <p><b>Встроенный feature importance.</b> Mean decrease in impurity (MDI) даёт первое приближение за долю секунды. Для production-выводов лучше permutation importance, но RF уже даёт откуда стартовать.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Почти всегда уступает бустингу в точности.</b> На любом Kaggle-соревновании или production-задаче, где каждый 0.5% accuracy = деньги, XGBoost/LightGBM/CatBoost обыгрывают RF. Random Forest — это «крепкий середняк», а не «state-of-the-art».</p>
      <p><b>Большая модель и медленный инференс.</b> 500 деревьев глубины 20 — это сотни мегабайт и десятки миллисекунд на предсказание. Для мобильного приложения или low-latency API это неприемлемо — придётся либо урезать <code>n_estimators</code>, либо дистиллировать в меньшую модель.</p>
      <p><b>Не экстраполирует.</b> Листья возвращают среднее обучающих точек. Если модель училась на доходах до 200 тыс., а в тесте приходит 500 тыс. — ответ будет «как для 200 тыс.». Для временных рядов с трендом или прогноза роста это смертельно.</p>
      <p><b>Плохо калиброванные вероятности.</b> <code>predict_proba</code> — это просто доля класса в среднем по листьям. Часто сжата к середине (0.3–0.7) и требует post-hoc калибровки (Platt/isotonic) перед тем, как использовать её в ценообразовании или оптимизации порогов.</p>
      <p><b>MDI importance смещена к признакам с большим числом уровней.</b> Категориальная фича с 100 уровнями «выиграет» у бинарной просто потому, что у неё больше способов разрезать данные. Всегда перепроверяй через permutation importance или SHAP.</p>
      <p><b>Размер модели плохо масштабируется с данными.</b> На датасете в 10M строк RF будет строить глубокие деревья (каждое размером с половину данных) — терабайты памяти и часы обучения. LightGBM с histogram-based split справится за минуты.</p>

      <h3>🧭 Когда брать Random Forest — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери Random Forest когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Нужен сильный бейзлайн за 10 минут без тюнинга — сравнивать с ним всё остальное</td>
          <td>Нужна максимальная точность: XGBoost/LightGBM почти всегда дадут +2-5%</td>
        </tr>
        <tr>
          <td>Мало данных (сотни–тысячи строк), но много признаков (биоинформатика, медицина)</td>
          <td>Очень большие данные (&gt; 10M строк) — LightGBM быстрее и меньше по памяти</td>
        </tr>
        <tr>
          <td>Много пропусков и выбросов, чистить которые дорого</td>
          <td>Продакшен с жёсткой latency (&lt; 10 мс) или ограничениями по размеру модели</td>
        </tr>
        <tr>
          <td>Нужна OOB-оценка вместо отдельной валидации (мало данных)</td>
          <td>Задача требует экстраполяции: временные ряды с трендом, прогноз роста, цены</td>
        </tr>
        <tr>
          <td>Нужен feature importance для отбора фич или EDA</td>
          <td>Нужна интерпретируемость одного правила «если → то» — бери одно дерево</td>
        </tr>
        <tr>
          <td>Обучение можно параллелить и железо позволяет (многоядерный CPU)</td>
          <td>Нужны точно калиброванные вероятности без post-hoc коррекции — бери LR</td>
        </tr>
        <tr>
          <td>Задача детекции аномалий — используй Isolation Forest</td>
          <td>Данные неструктурированные (изображения, текст, аудио) — нейросети нужнее</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a> (XGBoost/LightGBM/CatBoost)</b> — если критична точность и есть время на тюнинг. Последовательные деревья исправляют ошибки предыдущих, что обычно даёт +2-5% accuracy. Цена — сложнее тюнинг и риск переобучения.</li>
        <li><b>LightGBM</b> отдельно — если данных &gt; 1M строк. Histogram-based splits и leaf-wise рост дают x10-x50 ускорение обучения относительно RF при сопоставимом или лучшем качестве.</li>
        <li><b>ExtraTrees (Extremely Randomized Trees)</b> — если RF слишком медленный, а качество в пределах погрешности допустимо. Случайные пороги вместо оптимальных = быстрее и чуть больше разнообразия.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('decision-tree')">Одно дерево</a></b> — если нужна интерпретируемость «один путь → одно решение» для регулятора или бизнес-эксперта. Теряешь 5-10% точности, получаешь объяснимость.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a></b> — если зависимость линейна, нужны откалиброванные вероятности или latency критична. Быстрее обучается, меньше модель, интерпретируема на уровне коэффициентов.</li>
      </ul>
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

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=J4Wdy0Wc_xQ" target="_blank">StatQuest: Random Forests</a> — как Random Forest объединяет деревья решений</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D1%81%D0%BB%D1%83%D1%87%D0%B0%D0%B9%D0%BD%D1%8B%D0%B9%20%D0%BB%D0%B5%D1%81%20random%20forest" target="_blank">Random Forest на Habr</a> — разбор алгоритма и параметров на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html" target="_blank">sklearn: RandomForestClassifier</a> — документация случайного леса в sklearn</li>
      </ul>
    `,
  },
});
