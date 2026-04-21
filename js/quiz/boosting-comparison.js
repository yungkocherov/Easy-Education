/* ==========================================================================
   Тест: XGBoost / LightGBM / CatBoost
   ========================================================================== */
App.registerQuiz('boosting-comparison', {
  questions: [
    {
      prompt: `В чём главная техническая разница между <b>XGBoost</b> и <b>LightGBM</b> по стратегии роста деревьев?`,
      figure: `
        <svg viewBox="0 0 380 180" style="max-width:380px;width:100%;">
          <text x="90" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">XGBoost: level-wise</text>
          <text x="290" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">LightGBM: leaf-wise</text>
          <!-- Tree 1: balanced -->
          <circle cx="90" cy="35" r="8" fill="#6366f1"/>
          <line x1="90" y1="43" x2="55" y2="70" stroke="#64748b"/>
          <line x1="90" y1="43" x2="125" y2="70" stroke="#64748b"/>
          <circle cx="55" cy="78" r="8" fill="#6366f1"/>
          <circle cx="125" cy="78" r="8" fill="#6366f1"/>
          <line x1="55" y1="86" x2="35" y2="115" stroke="#64748b"/>
          <line x1="55" y1="86" x2="75" y2="115" stroke="#64748b"/>
          <line x1="125" y1="86" x2="105" y2="115" stroke="#64748b"/>
          <line x1="125" y1="86" x2="145" y2="115" stroke="#64748b"/>
          <circle cx="35" cy="123" r="8" fill="#6366f1"/>
          <circle cx="75" cy="123" r="8" fill="#6366f1"/>
          <circle cx="105" cy="123" r="8" fill="#6366f1"/>
          <circle cx="145" cy="123" r="8" fill="#6366f1"/>
          <text x="90" y="165" text-anchor="middle" font-size="10" fill="#64748b">все уровни равномерно</text>
          <!-- Tree 2: unbalanced/leaf-wise -->
          <circle cx="290" cy="35" r="8" fill="#10b981"/>
          <line x1="290" y1="43" x2="255" y2="70" stroke="#64748b"/>
          <line x1="290" y1="43" x2="325" y2="70" stroke="#64748b"/>
          <circle cx="255" cy="78" r="8" fill="#10b981"/>
          <circle cx="325" cy="78" r="8" fill="#10b981"/>
          <line x1="255" y1="86" x2="235" y2="115" stroke="#64748b"/>
          <line x1="255" y1="86" x2="275" y2="115" stroke="#64748b"/>
          <circle cx="235" cy="123" r="8" fill="#10b981"/>
          <circle cx="275" cy="123" r="8" fill="#10b981"/>
          <line x1="235" y1="131" x2="220" y2="155" stroke="#64748b"/>
          <line x1="235" y1="131" x2="250" y2="155" stroke="#64748b"/>
          <circle cx="220" cy="163" r="6" fill="#10b981"/>
          <circle cx="250" cy="163" r="6" fill="#10b981"/>
          <text x="290" y="180" text-anchor="middle" font-size="10" fill="#64748b">углубляется там, где снижение loss</text>
        </svg>
      `,
      options: [
        { text: 'XGBoost растит все листы на одном уровне одновременно (level-wise); LightGBM развивает лист с максимальным снижением loss (leaf-wise) — быстрее и точнее, но легче переобучается', correct: true },
        { text: 'XGBoost — для регрессии, LightGBM — для классификации' },
        { text: 'В XGBoost деревья не могут быть глубже 6, в LightGBM — любые' },
        { text: 'Разница чисто синтаксическая' },
      ],
      explain: `Это ключевое различие. <b>Leaf-wise</b> LightGBM-а обычно даёт лучшее качество при том же числе листьев и быстрее обучается, но требует ограничения <code>num_leaves</code> или <code>max_depth</code>, иначе переобучается. В XGBoost тоже можно включить grow_policy=lossguide, но дефолт — level-wise.`,
    },

    {
      prompt: `<b>CatBoost</b> в первую очередь про что?`,
      options: [
        { text: 'Встроенную обработку категориальных признаков (target encoding с защитой от утечек) и ordered boosting', correct: true },
        { text: 'Более быстрый inference, чем у XGBoost' },
        { text: 'Встроенную регуляризацию через dropout в деревьях' },
        { text: 'Работу без GPU' },
      ],
      explain: `CatBoost решает две боли: (1) high-cardinality категории — через ordered target statistics, (2) <b>target leakage</b> в target encoding — через permutation-based схему (ordered boosting). В остальном это тот же gradient boosting. Бонус: часто даёт приличное качество без тюнинга.`,
    },

    {
      prompt: `У тебя датасет 200M строк, много числовых признаков, нужна скорость обучения. Кого обычно берут?`,
      options: [
        { text: 'LightGBM — он быстрее на больших датасетах благодаря histogram-based split и GOSS (одностороннее sampling градиентов)', correct: true },
        { text: 'CatBoost — он самый быстрый' },
        { text: 'Sklearn GradientBoostingClassifier — у него есть встроенный параллелизм' },
        { text: 'AdaBoost — классика для big data' },
      ],
      explain: `LightGBM квантует числовые признаки в bins (гистограммы) — это сильно ускоряет поиск лучшего split. GOSS фокусируется на объектах с большими градиентами — остальные оцениваются по подвыборке. Для миллиардных датасетов LightGBM часто лучший выбор.`,
    },

    {
      prompt: `AdaBoost vs Gradient Boosting — <b>ключевое различие</b>?`,
      options: [
        { text: 'AdaBoost увеличивает веса неправильно классифицированных объектов. GBM напрямую аппроксимирует антиградиент заданного лосса — это обобщение AdaBoost на произвольные функции потерь.', correct: true },
        { text: 'AdaBoost только для классификации, GBM только для регрессии' },
        { text: 'AdaBoost быстрее сходится' },
        { text: 'AdaBoost — это CatBoost для дерева' },
      ],
      explain: `<b>AdaBoost</b> — частный случай GBM с экспоненциальным лоссом. GBM позволяет любой дифференцируемый лосс: log-loss, MSE, Huber, quantile — и поэтому гораздо гибче. AdaBoost сейчас используется редко, в основном как учебный пример boosting-идеи.`,
    },

    {
      prompt: `На картинке — кривые обучения двух моделей. Одна — RF, другая — GBM. <b>Какая кто?</b>`,
      figure: `
        <svg viewBox="0 0 380 220" style="max-width:380px;width:100%;">
          <text x="190" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Train loss по числу деревьев</text>
          <rect x="30" y="20" width="330" height="180" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
          <line x1="45" y1="185" x2="350" y2="185" stroke="#94a3b8"/>
          <line x1="45" y1="30" x2="45" y2="185" stroke="#94a3b8"/>
          <text x="197" y="200" text-anchor="middle" font-size="9" fill="#64748b">число деревьев</text>
          <!-- Curve A: plateau quickly (RF averaging) -->
          <path d="M 45 110 Q 80 75, 120 65 Q 180 58, 260 55 Q 320 54, 350 54" fill="none" stroke="#6366f1" stroke-width="2.5"/>
          <text x="260" y="48" font-size="11" font-weight="700" fill="#6366f1">А</text>
          <!-- Curve B: keeps going down (boosting) -->
          <path d="M 45 125 Q 100 95, 180 70 Q 260 45, 330 35 L 350 33" fill="none" stroke="#10b981" stroke-width="2.5"/>
          <text x="320" y="28" font-size="11" font-weight="700" fill="#10b981">Б</text>
        </svg>
      `,
      options: [
        { text: 'А — RF (быстро выходит на плато, усреднение не улучшается бесконечно). Б — GBM (train loss продолжает падать).', correct: true },
        { text: 'А — GBM, Б — RF' },
        { text: 'Обе RF с разными параметрами' },
        { text: 'Обе GBM, но с разным learning rate' },
      ],
      explain: `В RF добавление новых деревьев — это голосование уже «умных» независимых деревьев. После какой-то точки новые не добавляют разнообразия. В GBM каждое дерево продолжает фиксить ошибки предыдущих — train loss падает «бесконечно» (за счёт всё большего переобучения). На <i>валидации</i> обе рано или поздно упрутся.`,
    },

    {
      prompt: `Ты обнаружил, что в XGBoost большое число деревьев (n_estimators=5000), а learning_rate=0.01 даёт лучшее качество, чем 200 деревьев с lr=0.3. <b>Что это значит?</b>`,
      options: [
        { text: 'Ты продвигаешься к оптимуму меньшими шагами, меньше «проскакиваешь» его. Это типично: уменьшай lr и увеличивай n_estimators до тех пор, пока хватает терпения и времени.', correct: true },
        { text: 'Это случайность — результаты несравнимы' },
        { text: 'XGBoost неправильно настроен' },
        { text: 'Нужно ещё уменьшить lr до 0.001' },
      ],
      explain: `Это базовый закон бустинга. Lr как learning rate в градиентном спуске: меньше — надёжнее сойтись к точному минимуму, но медленнее. Стандартная практика: <b>early stopping</b> + маленький lr + много деревьев — получаешь плавную кривую обучения и надёжное качество.`,
    },
  ],
});
