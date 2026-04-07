/* ==========================================================================
   Decision Tree
   ========================================================================== */
App.registerTopic({
  id: 'decision-tree',
  category: 'ml-cls',
  title: 'Решающее дерево',
  summary: 'Иерархия if-else вопросов, которая делит данные на однородные группы.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты принимаешь решение «выдать ли кредит». Ты задаёшь вопросы последовательно:</p>
        <p><b>«Зарплата больше 100к?»</b> — да → <b>«Есть ли задолженности?»</b> — нет → <b>«Работает больше 2 лет?»</b> — да → <b>одобрить</b>.</p>
        <p>Это и есть дерево решений: серия «если-иначе» вопросов, каждый из которых делит людей на две группы. В конце каждой цепочки — ответ. Чем глубже идёшь, тем точнее решение.</p>
        <p>Компьютер строит такое дерево автоматически: смотрит на данные и находит <b>какой вопрос</b> лучше всего разделяет группы, потом рекурсивно строит дерево для каждой подгруппы. В итоге — готовая система правил, которую можно прочитать и понять.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
          <!-- Root -->
          <rect x="160" y="10" width="160" height="32" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
          <text x="240" y="31" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Зарплата > 50к?</text>
          <!-- Left branch -->
          <line x1="200" y1="42" x2="120" y2="72" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="148" y="58" font-size="9" fill="#64748b">нет</text>
          <rect x="40" y="72" width="160" height="32" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
          <text x="120" y="93" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Возраст > 25?</text>
          <!-- Right branch -->
          <line x1="280" y1="42" x2="360" y2="72" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="330" y="58" font-size="9" fill="#64748b">да</text>
          <rect x="290" y="72" width="140" height="32" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
          <text x="360" y="93" text-anchor="middle" font-size="11" font-weight="600" fill="#065f46">Одобрить ✓</text>
          <!-- Left-left -->
          <line x1="80" y1="104" x2="50" y2="140" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="53" y="125" font-size="9" fill="#64748b">нет</text>
          <rect x="5" y="140" width="90" height="32" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
          <text x="50" y="161" text-anchor="middle" font-size="11" font-weight="600" fill="#991b1b">Отказ ✗</text>
          <!-- Left-right -->
          <line x1="160" y1="104" x2="190" y2="140" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="186" y="125" font-size="9" fill="#64748b">да</text>
          <rect x="145" y="140" width="130" height="32" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
          <text x="210" y="161" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Поручитель?</text>
          <!-- Left-right leaves -->
          <line x1="180" y1="172" x2="150" y2="198" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="155" y="190" font-size="9" fill="#64748b">нет</text>
          <rect x="110" y="192" width="80" height="24" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
          <text x="150" y="208" text-anchor="middle" font-size="10" fill="#991b1b">Отказ ✗</text>
          <line x1="240" y1="172" x2="280" y2="198" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="270" y="190" font-size="9" fill="#64748b">да</text>
          <rect x="240" y="192" width="100" height="24" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="290" y="208" text-anchor="middle" font-size="10" fill="#065f46">Одобрить ✓</text>
        </svg>
        <div class="caption">Дерево решений для одобрения кредита: на каждом уровне задаётся вопрос, ответ ведёт к следующему вопросу или решению.</div>
      </div>

      <h3>💡 Идея алгоритма</h3>
      <p>Дерево решений — это серия вложенных вопросов о признаках, которые приводят к предсказанию. Каждый <b>внутренний узел</b> задаёт вопрос (например, «x > 5?»), каждый <b>лист</b> содержит ответ.</p>
      <p>Обучение: рекурсивно выбирать такие вопросы, которые <b>лучше всего разделяют</b> данные на однородные группы. Идём сверху вниз, делая на каждом шаге локально оптимальный выбор.</p>

      <h3>🌲 Как выглядит обученное дерево</h3>
      <pre>if зарплата > 100k:
    if задолженности == нет:
        if стаж > 2:
            одобрить
        else:
            отказать
    else:
        отказать
else:
    if поручитель == да:
        одобрить
    else:
        отказать</pre>

      <p>Эта структура легко читается — <b>любой</b> человек поймёт логику модели. Это главное преимущество деревьев.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>На каждом шаге ищем такое разбиение, которое делает дочерние узлы <b>чище</b>, чем родительский. «Чистота» — это мера, показывающая, насколько однородны классы в узле. Идеально чистый узел — все примеры одного класса.</p>
      </div>

      <h3>🧮 Измерение чистоты: impurity</h3>
      <p>Нам нужна формальная мера того, насколько «однородны» данные в узле. Есть три стандартных варианта:</p>

      <h4>Gini impurity (для классификации)</h4>
      <div class="math-block">$$\\text{Gini} = 1 - \\sum_{c=1}^{C} p_c^2$$</div>
      <p>Где $p_c$ — доля класса $c$ в узле.</p>
      <ul>
        <li>Все примеры одного класса → Gini = 0 (идеально чисто).</li>
        <li>50/50 в двух классах → Gini = 0.5 (максимальная смесь).</li>
        <li>Три равных класса → Gini ≈ 0.67.</li>
      </ul>

      <h4>Entropy (энтропия)</h4>
      <div class="math-block">$$H = -\\sum_{c=1}^{C} p_c \\log_2 p_c$$</div>
      <p>Мера неопределённости из теории информации. Даёт похожие результаты, но чуть сильнее штрафует смесь.</p>

      <h4>MSE (для регрессии)</h4>
      <p>Дисперсия целевой в узле. Чем разнороднее значения y в группе — тем выше MSE.</p>

      <h3>🎯 Как выбирается лучшее разбиение</h3>
      <p>В каждом узле алгоритм перебирает <b>все</b> признаки и <b>все</b> возможные пороги, выбирая разбиение с максимальным <span class="term" data-tip="Information Gain. Разность impurity до и после разбиения. Чем больше IG, тем лучше разбиение разделяет классы.">Information Gain</span>:</p>

      <div class="math-block">$$IG = \\text{Impurity}_{\\text{до}} - \\sum_{\\text{дети}} \\frac{|S_{\\text{ребёнок}}|}{|S|} \\cdot \\text{Impurity}_{\\text{ребёнок}}$$</div>

      <p>Проще: «насколько разбиение уменьшило беспорядок». Чем больше — тем лучше.</p>

      <h3>🛑 Когда остановиться</h3>
      <p>Если не ограничивать рост, дерево построит один лист на каждый обучающий пример. <b>Train accuracy = 100%, test accuracy — ужас</b>. Классическое переобучение.</p>

      <p>Главные критерии остановки — <span class="term" data-tip="Pre-pruning. Остановка роста дерева по критериям (max_depth, min_samples). Альтернатива пост-прунингу — обрезке готового дерева.">pre-pruning</span>:</p>
      <ul>
        <li><b>max_depth</b> — максимальная глубина (обычно 5-15).</li>
        <li><b>min_samples_split</b> — минимум примеров в узле, чтобы разбивать дальше.</li>
        <li><b>min_samples_leaf</b> — минимум примеров в листе.</li>
        <li><b>max_leaf_nodes</b> — ограничение на число листьев.</li>
        <li><b>min_impurity_decrease</b> — минимальное улучшение для разбиения.</li>
      </ul>

      <p>Альтернатива — <span class="term" data-tip="Post-pruning. Сначала строим полное дерево, потом обрезаем ветки, которые не улучшают качество на валидации.">post-pruning</span>: построить большое дерево, потом обрезать лишние ветки (cost-complexity pruning).</p>

      <h3>🔮 Предсказание</h3>
      <p>Новый пример проходит по дереву от корня к листу, отвечая на вопросы. В листе:</p>
      <ul>
        <li><b>Классификация:</b> мажоритарный класс обучающих примеров в листе.</li>
        <li><b>Регрессия:</b> среднее значение y в листе.</li>
        <li><b>Вероятности:</b> распределение классов в листе.</li>
      </ul>

      <h3>⚠️ Жадность и её последствия</h3>
      <p>Алгоритм построения дерева — <b>жадный</b> (greedy). На каждом шаге выбирается локально оптимальное разбиение, без учёта будущих шагов.</p>

      <p><b>Плюс жадности:</b> очень быстро. Построение дерева — O(n·p·log(n)).</p>

      <p><b>Минус:</b> дерево может быть не глобально оптимальным. Иногда «плохой» первый split даёт отличные детей, а «хороший» — посредственных.</p>

      <p>Это не лечится (поиск оптимального дерева — NP-трудная задача), но компенсируется ансамблями (Random Forest, boosting).</p>

      <h3>🌊 Нестабильность деревьев</h3>
      <p>Маленькое изменение в данных → совершенно другое дерево. Это <b>главная проблема</b> одиночных деревьев — <span class="term" data-tip="High variance. Высокая чувствительность к обучающим данным. Разные выборки дают сильно разные модели.">высокая variance</span>.</p>

      <p>Пример: переместили одну точку на 1%, первый split изменился — дерево перестроилось полностью.</p>

      <p>Именно поэтому одиночные деревья редко используются в проде. Вместо этого — ансамбли (Random Forest, Gradient Boosting), которые снижают variance.</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Интерпретируемость</b> — можно нарисовать, объяснить любому.</li>
        <li>Не требует <b>масштабирования</b> признаков.</li>
        <li>Работает с числовыми <b>и</b> категориальными признаками.</li>
        <li>Ловит нелинейные зависимости и взаимодействия.</li>
        <li>Устойчиво к выбросам.</li>
        <li>Автоматический feature selection (неважные признаки не попадают в split).</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li>Легко <b>переобучается</b>.</li>
        <li><b>Нестабильно</b> — маленькое изменение данных → другое дерево.</li>
        <li>Только axis-parallel разбиения (не ловит косые границы).</li>
        <li>Плохо <b>экстраполирует</b> для регрессии (предсказания ограничены min/max обучения).</li>
        <li>Смещение к признакам с многими уровнями.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Более глубокое дерево = более точное»</b> — на train да, на test обычно нет.</li>
        <li><b>«Дерево не требует препроцессинга»</b> — масштабирование не нужно, но обработка категориальных зависит от реализации.</li>
        <li><b>«Feature importance из дерева надёжна»</b> — смещена к признакам с многими уникальными значениями.</li>
        <li><b>«Дерево интерпретируемо»</b> — только небольшие деревья. Дерево с 1000 листьев — уже не интерпретируемо.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: CART vs ID3 vs C4.5</summary>
        <div class="deep-dive-body">
          <p>Исторически было несколько алгоритмов построения деревьев:</p>
          <ul>
            <li><b>ID3</b> (1986): использовал энтропию, только дискретные признаки.</li>
            <li><b>C4.5</b> (1993): развитие ID3, поддержка числовых признаков, обрезка.</li>
            <li><b>CART</b> (1984): использует Gini, бинарные деревья, поддержка регрессии.</li>
          </ul>
          <p>Все современные реализации (sklearn, XGBoost, LightGBM) основаны на CART.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: категориальные признаки</summary>
        <div class="deep-dive-body">
          <p>Разные реализации обрабатывают категориальные признаки по-разному:</p>
          <ul>
            <li><b>CART:</b> разбивает категории на два подмножества (перебор).</li>
            <li><b>sklearn:</b> требует явного кодирования (One-Hot или Label).</li>
            <li><b>LightGBM:</b> нативная поддержка, оптимальное разбиение по среднему таргету.</li>
            <li><b>CatBoost:</b> специальная обработка через target encoding.</li>
          </ul>
          <p>Для категорий с большим количеством уровней One-Hot создаёт много признаков и замедляет дерево. LightGBM/CatBoost справляются лучше.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: cost-complexity pruning</summary>
        <div class="deep-dive-body">
          <p>Умный способ обрезки: минимизируем $R(T) + \\alpha|T|$, где $R(T)$ — ошибка, $|T|$ — число листьев, $\\alpha$ — параметр регуляризации.</p>
          <p>Большой $\\alpha$ → простое дерево (много обрезок). Маленький $\\alpha$ → глубокое дерево.</p>
          <p>$\\alpha$ выбирается через CV. В sklearn параметр <code>ccp_alpha</code>.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Random Forest</b> — ансамбль деревьев с bagging + случайные признаки.</li>
        <li><b>Gradient Boosting</b> — последовательное строительство деревьев.</li>
        <li><b>Isolation Forest</b> — деревья для детекции аномалий.</li>
        <li><b>Feature importance</b> — важный инструмент интерпретации моделей.</li>
        <li><b>Bias-variance</b> — одиночное дерево = высокая variance; ансамбли снижают её.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Одобрение кредита: строим дерево',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По 6 заявителям построить дерево решений для выдачи кредита. Найти лучшее первое разбиение по индексу Gini.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>№</th><th>Зарплата (тыс.)</th><th>Стаж (лет)</th><th>Долги?</th><th>Решение</th></tr>
              <tr><td>1</td><td>80</td><td>5</td><td>Нет</td><td>Одобрить (1)</td></tr>
              <tr><td>2</td><td>40</td><td>2</td><td>Да</td><td>Отказать (0)</td></tr>
              <tr><td>3</td><td>60</td><td>8</td><td>Нет</td><td>Одобрить (1)</td></tr>
              <tr><td>4</td><td>30</td><td>1</td><td>Нет</td><td>Отказать (0)</td></tr>
              <tr><td>5</td><td>90</td><td>3</td><td>Да</td><td>Отказать (0)</td></tr>
              <tr><td>6</td><td>70</td><td>10</td><td>Нет</td><td>Одобрить (1)</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: Gini корневого узла (все 6 примеров)</h4>
            <div class="calc">
              Одобрено: 3 (№1,3,6), Отказано: 3 (№2,4,5)<br>
              p₁ = 3/6 = 0.5, p₀ = 3/6 = 0.5<br>
              Gini = 1 − (0.5² + 0.5²) = 1 − 0.5 = <b>0.50</b>
            </div>
            <div class="why">Gini = 0.5 — максимальное загрязнение. Идеальный чистый узел имеет Gini = 0.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: разбиение «Долги = Да?»</h4>
            <div class="calc">
              Левая (Долги=Нет): №1,3,4,6 → Одобрено:3, Отказано:1<br>
              Gini_лев = 1 − ((3/4)² + (1/4)²) = 1 − (0.5625 + 0.0625) = <b>0.375</b><br><br>
              Правая (Долги=Да): №2,5 → Одобрено:0, Отказано:2<br>
              Gini_прав = 1 − ((0/2)² + (2/2)²) = 1 − 1 = <b>0.000</b> (чистый!)<br><br>
              Взвешенный Gini = (4/6)·0.375 + (2/6)·0.0 = <b>0.250</b><br>
              Gain = 0.50 − 0.250 = <b>0.250</b>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: разбиение «Зарплата ≥ 65?»</h4>
            <div class="calc">
              Левая (Зарплата &lt; 65): №2,3,4 → Одобрено:1, Отказано:2<br>
              Gini_лев = 1 − ((1/3)² + (2/3)²) = 1 − 0.556 = <b>0.444</b><br><br>
              Правая (Зарплата ≥ 65): №1,5,6 → Одобрено:2, Отказано:1<br>
              Gini_прав = 1 − ((2/3)² + (1/3)²) = <b>0.444</b><br><br>
              Взвешенный Gini = 0.5·0.444 + 0.5·0.444 = <b>0.444</b><br>
              Gain = 0.50 − 0.444 = <b>0.056</b>
            </div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: выбрать лучшее разбиение</h4>
            <div class="calc">
              Gain(Долги): 0.250 — лучшее!<br>
              Gain(Зарплата≥65): 0.056<br>
              Gain(Стаж≥5): ≈0.167<br><br>
              Структура дерева:<br>
              Долги = Да? → Да: Отказать (лист, Gini=0)<br>
              → Нет: продолжить на 4 примерах (Gini=0.375)
            </div>
            <div class="why">Признак «Долги» лучше всех: правая ветка абсолютно чистая. Правило жёсткое и понятное.</div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 440 165" xmlns="http://www.w3.org/2000/svg" style="max-width:440px;">
              <text x="220" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Дерево решений: одобрение кредита</text>
              <!-- Root node -->
              <rect x="155" y="26" width="130" height="38" rx="8" fill="#e0e7ff" stroke="#6366f1" stroke-width="2"/>
              <text x="220" y="42" text-anchor="middle" font-size="11" font-weight="600" fill="#3730a3">Есть долги?</text>
              <text x="220" y="58" text-anchor="middle" font-size="9" fill="#6366f1">Gini=0.50, n=6</text>
              <!-- Left branch: Да → Отказать -->
              <line x1="185" y1="64" x2="110" y2="100" stroke="#ef4444" stroke-width="2"/>
              <text x="138" y="88" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="600">Да</text>
              <rect x="55" y="100" width="110" height="38" rx="8" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
              <text x="110" y="117" text-anchor="middle" font-size="11" font-weight="600" fill="#991b1b">Отказать</text>
              <text x="110" y="131" text-anchor="middle" font-size="9" fill="#ef4444">Gini=0.0, n=2</text>
              <!-- Right branch: Нет → second split -->
              <line x1="255" y1="64" x2="330" y2="100" stroke="#10b981" stroke-width="2"/>
              <text x="302" y="88" text-anchor="middle" font-size="9" fill="#10b981" font-weight="600">Нет</text>
              <rect x="270" y="100" width="130" height="38" rx="8" fill="#d1fae5" stroke="#10b981" stroke-width="2"/>
              <text x="335" y="117" text-anchor="middle" font-size="11" font-weight="600" fill="#065f46">Зарплата ≥ 65?</text>
              <text x="335" y="131" text-anchor="middle" font-size="9" fill="#10b981">Gini=0.375, n=4</text>
              <!-- Level 2 from "Зарплата >= 65?" -->
              <line x1="300" y1="138" x2="260" y2="155" stroke="#ef4444" stroke-width="1.5"/>
              <text x="270" y="150" text-anchor="middle" font-size="8" fill="#ef4444">Нет</text>
              <rect x="215" y="152" width="80" height="10" rx="3" fill="#fee2e2" stroke="#ef4444" stroke-width="1"/>
              <text x="255" y="160" text-anchor="middle" font-size="8" fill="#991b1b">Отказать</text>
              <line x1="370" y1="138" x2="405" y2="155" stroke="#10b981" stroke-width="1.5"/>
              <text x="396" y="150" text-anchor="middle" font-size="8" fill="#10b981">Да</text>
              <rect x="362" y="152" width="80" height="10" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1"/>
              <text x="402" y="160" text-anchor="middle" font-size="8" fill="#065f46">Одобрить</text>
              <!-- Gain labels -->
              <text x="110" y="95" text-anchor="middle" font-size="8" fill="#ef4444">Gain=0.250</text>
            </svg>
            <div class="caption">Дерево решений для кредита. Корень: «Есть долги?» — лучший сплит (Gain=0.25). Левая ветка (Да) — чистый лист Отказать. Правая (Нет) — второй уровень по зарплате.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Первое разбиение: «Есть долги?». Да → Отказать. Нет → второй уровень. Дерево глубиной 2 классифицирует все 6 примеров без ошибок.</p>
          </div>
          <div class="lesson-box">
            Алгоритм CART перебирает все признаки и все пороги, выбирая пару (признак, порог) с минимальным взвешенным Gini. Сложность O(n·d·log n) на уровень.
          </div>
        `,
      },
      {
        title: 'Gini: пошаговый расчёт',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Детально разобрать Gini Impurity и Information Gain для двух кандидатных разбиений, сравнить их.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Узел</th><th>Класс A</th><th>Класс B</th><th>Всего</th><th>Gini</th></tr>
              <tr><td>Родитель</td><td>10</td><td>10</td><td>20</td><td>?</td></tr>
              <tr><td>Разбиение 1 — Левый</td><td>8</td><td>2</td><td>10</td><td>?</td></tr>
              <tr><td>Разбиение 1 — Правый</td><td>2</td><td>8</td><td>10</td><td>?</td></tr>
              <tr><td>Разбиение 2 — Левый</td><td>6</td><td>4</td><td>10</td><td>?</td></tr>
              <tr><td>Разбиение 2 — Правый</td><td>4</td><td>6</td><td>10</td><td>?</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: Gini родительского узла</h4>
            <div class="calc">
              p_A = 10/20 = 0.5, p_B = 10/20 = 0.5<br>
              Gini = 1 − (p_A² + p_B²) = 1 − (0.25 + 0.25) = <b>0.500</b>
            </div>
            <div class="why">Gini максимален (0.5) при двух равных классах. Чем чище узел, тем меньше Gini.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: Gini разбиения 1 (хорошее)</h4>
            <div class="calc">
              Левый [8A, 2B]: p_A=0.8, p_B=0.2<br>
              Gini_лев = 1 − (0.64 + 0.04) = <b>0.320</b><br><br>
              Правый [2A, 8B]: p_A=0.2, p_B=0.8<br>
              Gini_прав = 1 − (0.04 + 0.64) = <b>0.320</b><br><br>
              Взвешенный = (10/20)·0.320 + (10/20)·0.320 = <b>0.320</b><br>
              Gain₁ = 0.500 − 0.320 = <b>0.180</b>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: Gini разбиения 2 (слабое)</h4>
            <div class="calc">
              Левый [6A, 4B]: p_A=0.6, p_B=0.4<br>
              Gini_лев = 1 − (0.36 + 0.16) = <b>0.480</b><br><br>
              Правый [4A, 6B]: Gini_прав = <b>0.480</b><br><br>
              Взвешенный = 0.5·0.480 + 0.5·0.480 = <b>0.480</b><br>
              Gain₂ = 0.500 − 0.480 = <b>0.020</b>
            </div>
            <div class="why">Разбиение 2 почти не помогает: оба узла остались почти такими же смешанными. Дерево выберет разбиение 1.</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: идеальное разбиение</h4>
            <div class="calc">
              Левый [10A, 0B]: Gini = 1 − (1² + 0²) = <b>0.0</b> — идеально!<br>
              Правый [0A, 10B]: Gini = <b>0.0</b><br>
              Взвешенный Gini = 0 → Gain = 0.500 — максимально возможный
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Разбиение 1: Gain=0.180. Разбиение 2: Gain=0.020. Дерево выберет разбиение 1 как корневое условие.</p>
          </div>
          <div class="lesson-box">
            Энтропия (ID3): −Σp·log₂(p). Gini (CART): 1−Σp². Оба критерия дают схожие результаты, Gini быстрее вычислять. Для регрессии используют variance reduction.
          </div>
        `,
      },
      {
        title: 'Переобучение при depth=∞',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как неограниченная глубина дерева приводит к переобучению, и как правильно регуляризовать.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Глубина</th><th>Train Accuracy</th><th>Val Accuracy</th><th>Листьев</th><th>Диагноз</th></tr>
              <tr><td>1</td><td>62%</td><td>60%</td><td>2</td><td>Underfitting</td></tr>
              <tr><td>2</td><td>78%</td><td>75%</td><td>4</td><td>Нормально</td></tr>
              <tr><td>3</td><td>85%</td><td>83%</td><td>8</td><td>Оптимум</td></tr>
              <tr><td>5</td><td>94%</td><td>80%</td><td>32</td><td>Начало переобуч.</td></tr>
              <tr><td>10</td><td>100%</td><td>71%</td><td>~200</td><td>Переобучение</td></tr>
              <tr><td>∞</td><td>100%</td><td>68%</td><td>n</td><td>Полное переобуч.</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что происходит при depth=∞</h4>
            <div class="calc">
              n=100 примеров → до 100 листьев при depth=∞<br>
              Каждый лист ≈ 1 обучающий пример<br>
              Train Accuracy = 100% — дерево запомнило всё<br>
              Новый объект x_new попадает в лист с 1 примером<br>
              → предсказание = метка этого 1 примера с шумом<br>
              → любой шум в данных = ошибка на тесте
            </div>
            <div class="why">Дерево без ограничений — это lookup table, а не обобщающая модель.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: методы регуляризации</h4>
            <div class="calc">
              max_depth=3 → ограничить глубину напрямую<br>
              min_samples_split=10 → делить узел, только если ≥10 примеров<br>
              min_samples_leaf=5 → каждый лист ≥5 примеров<br>
              max_leaf_nodes=20 → не более 20 листьев<br>
              min_impurity_decrease=0.01 → делить, только если Gain ≥ 0.01
            </div>
            <div class="why">min_samples_leaf часто эффективнее max_depth: не даёт создавать листья с очень малым числом примеров.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: cost-complexity pruning</h4>
            <div class="calc">
              Loss(T) = Gini(T) + α · |leaves(T)|<br>
              α=0 → полное дерево<br>
              α → ∞ → только корень<br>
              Оптимальный α: перебрать сетку, выбрать max Val Accuracy<br>
              В sklearn: DecisionTreeClassifier(ccp_alpha=0.01)
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимальная глубина = 3 (Val 83%). Правило: min_samples_leaf ≈ 1–5% от датасета. Строй кривые обучения (train vs val по глубине) для диагностики.</p>
          </div>
          <div class="lesson-box">
            Кривая обучения: val score растёт с глубиной, достигает пика, затем падает (переобучение). Пик — оптимум. Train score монотонно растёт. Если они близки — underfitting, если расходятся — overfitting.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: построение дерева</h3>
        <p>Меняй глубину и посмотри, как дерево разбивает пространство.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dt-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dt-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="dt-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="dt-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dt-controls');
        const cDepth = App.makeControl('range', 'dt-depth', 'Max depth', { min: 1, max: 10, step: 1, value: 3 });
        const cMinSplit = App.makeControl('range', 'dt-min', 'Min samples split', { min: 2, max: 30, step: 1, value: 2 });
        const cShape = App.makeControl('select', 'dt-shape', 'Форма данных', {
          options: [{ value: 'blobs', label: 'Кластеры' }, { value: 'xor', label: 'XOR' }, { value: 'moons', label: 'Две луны' }, { value: 'circle', label: 'Круг' }],
          value: 'moons',
        });
        const cN = App.makeControl('range', 'dt-n', 'Точек', { min: 20, max: 300, step: 10, value: 100 });
        [cDepth, cMinSplit, cShape, cN].forEach((c) => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#dt-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];

        function genData() {
          const shape = cShape.input.value;
          const n = +cN.input.value;
          points = [];
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'blobs') {
              cls = Math.random() < 0.5 ? 0 : 1;
              const c = cls === 0 ? [0.3, 0.3] : [0.7, 0.7];
              x = c[0] + App.Util.randn(0, 0.08);
              y = c[1] + App.Util.randn(0, 0.08);
            } else if (shape === 'xor') {
              x = Math.random(); y = Math.random();
              cls = ((x > 0.5) ^ (y > 0.5)) ? 1 : 0;
            } else if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) {
                x = 0.3 + 0.25 * Math.cos(t) + App.Util.randn(0, 0.03);
                y = 0.45 + 0.25 * Math.sin(t) + App.Util.randn(0, 0.03);
                cls = 0;
              } else {
                x = 0.55 + 0.25 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.03);
                y = 0.55 - 0.25 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.03);
                cls = 1;
              }
            } else {
              x = Math.random(); y = Math.random();
              const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
              cls = r < 0.25 ? 0 : 1;
            }
            points.push({ x, y, cls });
          }
        }

        function gini(items) {
          if (items.length === 0) return 0;
          const counts = [0, 0];
          items.forEach(p => counts[p.cls]++);
          const p0 = counts[0] / items.length, p1 = counts[1] / items.length;
          return 1 - p0 * p0 - p1 * p1;
        }

        function majority(items) {
          const counts = [0, 0];
          items.forEach(p => counts[p.cls]++);
          return counts[0] >= counts[1] ? 0 : 1;
        }

        function buildTree(items, depth, maxDepth, minSplit) {
          if (depth >= maxDepth || items.length < minSplit || gini(items) < 1e-9) {
            return { leaf: true, cls: majority(items), n: items.length };
          }
          // перебор
          let best = null;
          const baseGini = gini(items);
          ['x', 'y'].forEach(feat => {
            const vals = items.map(p => p[feat]).sort((a, b) => a - b);
            for (let i = 1; i < vals.length; i++) {
              const thr = (vals[i - 1] + vals[i]) / 2;
              const L = items.filter(p => p[feat] < thr);
              const R = items.filter(p => p[feat] >= thr);
              if (L.length === 0 || R.length === 0) continue;
              const w = (L.length * gini(L) + R.length * gini(R)) / items.length;
              const gain = baseGini - w;
              if (!best || gain > best.gain) best = { feat, thr, gain, L, R };
            }
          });
          if (!best || best.gain < 1e-6) return { leaf: true, cls: majority(items), n: items.length };
          return {
            leaf: false, feat: best.feat, thr: best.thr,
            left: buildTree(best.L, depth + 1, maxDepth, minSplit),
            right: buildTree(best.R, depth + 1, maxDepth, minSplit),
            n: items.length,
          };
        }

        function countLeaves(t) { return t.leaf ? 1 : countLeaves(t.left) + countLeaves(t.right); }

        function predict(tree, x, y) {
          if (tree.leaf) return tree.cls;
          const v = tree.feat === 'x' ? x : y;
          return v < tree.thr ? predict(tree.left, x, y) : predict(tree.right, x, y);
        }

        function resize() {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          draw();
        }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          const maxDepth = +cDepth.input.value;
          const minSplit = +cMinSplit.input.value;
          const tree = buildTree(points, 0, maxDepth, minSplit);

          ctx.clearRect(0, 0, W, H);
          const step = 6;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const cls = predict(tree, px / W, py / H);
              ctx.fillStyle = cls === 0 ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)';
              ctx.fillRect(px, py, step, step);
            }
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 4, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          // accuracy
          let correct = 0;
          points.forEach(p => { if (predict(tree, p.x, p.y) === p.cls) correct++; });
          const acc = correct / points.length;

          container.querySelector('#dt-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Max depth</div><div class="stat-value">${maxDepth}</div></div>
            <div class="stat-card"><div class="stat-label">Листьев</div><div class="stat-value">${countLeaves(tree)}</div></div>
            <div class="stat-card"><div class="stat-label">Train accuracy</div><div class="stat-value">${(acc * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${points.length}</div></div>
          `;
        }

        [cDepth, cMinSplit].forEach(c => c.input.addEventListener('input', draw));
        [cShape, cN].forEach(c => c.input.addEventListener('change', () => { genData(); draw(); }));
        container.querySelector('#dt-regen').onclick = () => { genData(); draw(); };

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    python: `
      <h3>Python: дерево решений</h3>
      <p>sklearn.DecisionTreeClassifier позволяет обучить дерево, визуализировать его и проанализировать важность признаков.</p>

      <h4>1. Обучение и визуализация дерева</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

data = load_iris()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# max_depth ограничивает сложность — борьба с переобучением
tree = DecisionTreeClassifier(max_depth=3, min_samples_split=10,
                               criterion='gini', random_state=42)
tree.fit(X_train, y_train)

print(f'Train accuracy: {tree.score(X_train, y_train):.4f}')
print(f'Test accuracy:  {tree.score(X_test, y_test):.4f}')
print(classification_report(y_test, tree.predict(X_test),
      target_names=data.target_names))

# Визуализация дерева
plt.figure(figsize=(14, 6))
plot_tree(tree, feature_names=data.feature_names,
          class_names=data.target_names,
          filled=True, rounded=True, fontsize=10)
plt.title('Дерево решений (Iris, depth=3)')
plt.show()</code></pre>

      <h4>2. Важность признаков и влияние глубины</h4>
      <pre><code># Важность признаков через feature_importances_
importances = tree.feature_importances_
plt.barh(data.feature_names, importances)
plt.xlabel('Feature Importance (Gini)')
plt.title('Важность признаков')
plt.tight_layout()
plt.show()

# Как меняется качество от глубины
train_scores, test_scores = [], []
depths = range(1, 15)
for d in depths:
    dt = DecisionTreeClassifier(max_depth=d, random_state=42)
    dt.fit(X_train, y_train)
    train_scores.append(dt.score(X_train, y_train))
    test_scores.append(dt.score(X_test, y_test))

plt.plot(depths, train_scores, 'o-', label='Train')
plt.plot(depths, test_scores, 's-', label='Test')
plt.xlabel('max_depth')
plt.ylabel('Accuracy')
plt.title('Переобучение: accuracy vs глубина дерева')
plt.legend()
plt.show()</code></pre>

      <h4>3. Подбор параметров и cost-complexity pruning</h4>
      <pre><code>from sklearn.model_selection import GridSearchCV

param_grid = {
    'max_depth': [2, 3, 4, 5, None],
    'min_samples_split': [2, 5, 10, 20],
    'criterion': ['gini', 'entropy'],
}

grid = GridSearchCV(DecisionTreeClassifier(random_state=42),
                    param_grid, cv=5, scoring='accuracy')
grid.fit(X_train, y_train)
print(f'Лучшие параметры: {grid.best_params_}')
print(f'CV Accuracy: {grid.best_score_:.4f}')

# Post-pruning через cost complexity
path = DecisionTreeClassifier(random_state=42).cost_complexity_pruning_path(X_train, y_train)
ccp_alphas = path.ccp_alphas[::5]  # берём каждый 5-й для скорости

scores = []
for alpha in ccp_alphas:
    dt = DecisionTreeClassifier(ccp_alpha=alpha, random_state=42)
    dt.fit(X_train, y_train)
    scores.append(dt.score(X_test, y_test))

plt.plot(ccp_alphas, scores, 'o-')
plt.xlabel('ccp_alpha')
plt.ylabel('Test Accuracy')
plt.title('Cost-Complexity Pruning')
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Бизнес-правила</b> — когда важна интерпретируемость.</li>
        <li><b>Кредитный скоринг</b> — регуляторы требуют прозрачности.</li>
        <li><b>Медицина</b> — диагностические деревья.</li>
        <li><b>Компонент ансамблей</b> — Random Forest, Gradient Boosting, XGBoost.</li>
        <li><b>Feature importance</b> — какие признаки важны для модели.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Интерпретируемость — можно нарисовать и объяснить</li>
            <li>Не требует масштабирования признаков</li>
            <li>Работает и с числовыми, и с категориальными признаками</li>
            <li>Ловит нелинейные зависимости и взаимодействия</li>
            <li>Устойчиво к выбросам</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Легко переобучается</li>
            <li>Нестабильно — небольшой шум меняет структуру</li>
            <li>Смещение к признакам с многими уровнями</li>
            <li>Плохо в экстраполяции (регрессия)</li>
            <li>Не находит косых границ</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Меры неопределённости</h3>

      <h4>Gini impurity</h4>
      <div class="math-block">$$\\text{Gini}(S) = 1 - \\sum_{c=1}^{C} p_c^2$$</div>
      <p>$p_c$ — доля класса c в узле S.</p>

      <h4>Энтропия</h4>
      <div class="math-block">$$H(S) = -\\sum_{c=1}^{C} p_c \\log_2 p_c$$</div>

      <h4>Information Gain</h4>
      <div class="math-block">$$IG(S, A) = H(S) - \\sum_{v \\in \\text{vals}(A)} \\frac{|S_v|}{|S|} H(S_v)$$</div>

      <h4>Для регрессии (MSE)</h4>
      <div class="math-block">$$\\text{MSE}(S) = \\frac{1}{|S|} \\sum_{i \\in S} (y_i - \\bar{y}_S)^2$$</div>

      <h3>Алгоритм CART</h3>
      <ol>
        <li>Для каждого признака и порога вычислить impurity после разбиения.</li>
        <li>Выбрать разбиение с максимальным снижением impurity.</li>
        <li>Рекурсивно применить к детям, пока не достигнут стоп-критерий.</li>
      </ol>

      <h3>Prepruning vs Postpruning</h3>
      <ul>
        <li><b>Pre-pruning</b>: остановка роста по критериям (max_depth, min_samples).</li>
        <li><b>Post-pruning</b>: построить большое дерево, потом обрезать (cost-complexity pruning, параметр α).</li>
      </ul>
    `,

    extra: `
      <h3>Cost-Complexity Pruning</h3>
      <p>Минимизируем $R(T) + \\alpha |T|$, где R(T) — ошибка, |T| — число листьев. Параметр α ищется через CV.</p>

      <h3>Feature Importance</h3>
      <p>Для каждого признака суммируется уменьшение impurity, которое он принёс во всех узлах, где использовался. Нормализуется до 1.</p>

      <h3>Oblique trees</h3>
      <p>Обычные деревья разбивают параллельно осям ($x_j < t$). Oblique trees используют линейные комбинации признаков — ловят косые границы, но теряют интерпретируемость.</p>

      <h3>Почему деревья → лес</h3>
      <p>Отдельное дерево нестабильно и переобучается. Решение: много деревьев с рандомизацией = Random Forest. Или последовательное улучшение = Gradient Boosting.</p>

      <h3>Категориальные признаки</h3>
      <ul>
        <li>CART: группирует категории в 2 подмножества.</li>
        <li>LightGBM: оптимальное разбиение по среднему таргету.</li>
        <li>XGBoost: либо one-hot, либо target encoding.</li>
      </ul>
    `,
  },
});
