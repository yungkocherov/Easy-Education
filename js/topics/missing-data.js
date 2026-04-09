/* ==========================================================================
   Обработка пропусков (Missing Data)
   ========================================================================== */
App.registerTopic({
  id: 'missing-data',
  category: 'ml-basics',
  title: 'Обработка пропусков',
  summary: 'Стратегии работы с NaN: удаление, заполнение, предсказание.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты анкетируешь пациентов перед операцией. Некоторые не заполнили «вес», кто-то пропустил «группу крови», кто-то отказался указывать «историю болезней». Это три <b>разные причины</b> пропуска — и обрабатывать их надо по-разному.</p>
        <p>Первое, что хочется сделать — удалить строки с пропусками. Но если пропуск «история болезней» чаще встречается у более тяжёлых пациентов — удаляя их, ты систематически искажаешь данные в сторону лёгких случаев. Модель научится на отфильтрованных данных и будет плохо работать в продакшене.</p>
        <p>Пропуски — это не досадный мусор. Это <b>информация о процессе сбора данных</b>, и работать с ними нужно вдумчиво.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 210" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="15" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Стратегии обработки пропусков</text>
          <!-- Raw table -->
          <rect x="5" y="25" width="120" height="155" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="65" y="43" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Данные с NaN</text>
          <text x="65" y="60" text-anchor="middle" font-size="9" fill="#374151">24 | 180 | 70</text>
          <text x="65" y="75" text-anchor="middle" font-size="9" fill="#374151">31 | NaN | 85</text>
          <text x="65" y="90" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="600">NaN| 165 | 60</text>
          <text x="65" y="105" text-anchor="middle" font-size="9" fill="#374151">45 | 172 | NaN</text>
          <text x="65" y="120" text-anchor="middle" font-size="9" fill="#374151">28 | 168 | 72</text>
          <text x="65" y="135" text-anchor="middle" font-size="9" fill="#374151">52 | NaN | 90</text>
          <text x="65" y="150" text-anchor="middle" font-size="9" fill="#374151">19 | 175 | 65</text>
          <text x="65" y="165" text-anchor="middle" font-size="9" fill="#374151">36 | 162 | NaN</text>
          <!-- Arrow down to strategies -->
          <line x1="65" y1="180" x2="65" y2="195" stroke="#64748b" stroke-width="1.5"/>
          <polygon points="60,195 65,203 70,195" fill="#64748b"/>
          <!-- Strategy 1: Delete -->
          <rect x="5" y="205" width="110" height="0" rx="0" fill="none"/>
          <!-- Strategy boxes (horizontal) -->
          <!-- Delete -->
          <rect x="130" y="25" width="95" height="80" rx="6" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
          <text x="177" y="44" text-anchor="middle" font-size="10" font-weight="600" fill="#991b1b">Удаление</text>
          <text x="177" y="60" text-anchor="middle" font-size="9" fill="#991b1b">24|180|70 ✓</text>
          <text x="177" y="75" text-anchor="middle" font-size="9" fill="#dc2626">31|NaN|85 ✗</text>
          <text x="177" y="90" text-anchor="middle" font-size="9" fill="#dc2626">NaN|165|60 ✗</text>
          <text x="177" y="100" text-anchor="middle" font-size="9" fill="#64748b">(-3 строки)</text>
          <!-- Simple impute -->
          <rect x="235" y="25" width="100" height="80" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
          <text x="285" y="44" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">Mean/Median</text>
          <text x="285" y="60" text-anchor="middle" font-size="9" fill="#1e40af">24|180|70</text>
          <text x="285" y="75" text-anchor="middle" font-size="9" fill="#1e40af">31|<b>170</b>|85</text>
          <text x="285" y="90" text-anchor="middle" font-size="9" fill="#1e40af"><b>34</b>|165|60</text>
          <text x="285" y="100" text-anchor="middle" font-size="9" fill="#64748b">(медиана)</text>
          <!-- KNN impute -->
          <rect x="345" y="25" width="100" height="80" rx="6" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
          <text x="395" y="44" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">KNN Imputer</text>
          <text x="395" y="60" text-anchor="middle" font-size="9" fill="#065f46">24|180|70</text>
          <text x="395" y="75" text-anchor="middle" font-size="9" fill="#065f46">31|<b>172</b>|85</text>
          <text x="395" y="90" text-anchor="middle" font-size="9" fill="#065f46"><b>27</b>|165|60</text>
          <text x="395" y="100" text-anchor="middle" font-size="9" fill="#64748b">(по соседям)</text>
          <!-- Indicator -->
          <rect x="455" y="25" width="100" height="80" rx="6" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
          <text x="505" y="44" text-anchor="middle" font-size="10" font-weight="600" fill="#5b21b6">+ Индикатор</text>
          <text x="505" y="60" text-anchor="middle" font-size="9" fill="#5b21b6">24|180|70|0</text>
          <text x="505" y="75" text-anchor="middle" font-size="9" fill="#5b21b6">31|170|85|1</text>
          <text x="505" y="90" text-anchor="middle" font-size="9" fill="#5b21b6">34|165|60|1</text>
          <text x="505" y="100" text-anchor="middle" font-size="9" fill="#64748b">(is_missing)</text>
          <!-- Labels below -->
          <text x="177" y="120" text-anchor="middle" font-size="9" fill="#64748b">Быстро, теряем</text>
          <text x="177" y="132" text-anchor="middle" font-size="9" fill="#64748b">данные</text>
          <text x="285" y="120" text-anchor="middle" font-size="9" fill="#64748b">Быстро, упрощает</text>
          <text x="285" y="132" text-anchor="middle" font-size="9" fill="#64748b">распределение</text>
          <text x="395" y="120" text-anchor="middle" font-size="9" fill="#64748b">Точнее, учитывает</text>
          <text x="395" y="132" text-anchor="middle" font-size="9" fill="#64748b">структуру данных</text>
          <text x="505" y="120" text-anchor="middle" font-size="9" fill="#64748b">Сохраняем сигнал</text>
          <text x="505" y="132" text-anchor="middle" font-size="9" fill="#64748b">о пропуске</text>
        </svg>
        <div class="caption">Четыре основные стратегии. Удаление — самое простое, но теряет данные. Лучшие методы заполняют пропуски, сохраняя информацию о них.</div>
      </div>

      <h3>🔍 Типы пропущенности (Mechanisms of Missingness)</h3>
      <p>Это фундаментально важное различие. От типа пропущенности зависит, какой метод применять.</p>

      <h4>MCAR — Missing Completely At Random</h4>
      <p>Пропуск никак не связан ни с другими признаками, ни со значением самого пропущенного признака. Прибор случайно сломался, анкета потерялась.</p>
      <p><b>Тест:</b> если разделить данные на «с пропуском» и «без» — средние по другим признакам должны совпадать. Тест Little's MCAR test.</p>
      <p><b>Как обрабатывать:</b> любой метод корректен. Удаление даёт несмещённые оценки (теряет только размер выборки).</p>

      <h4>MAR — Missing At Random</h4>
      <p>Пропуск зависит от других <em>наблюдаемых</em> признаков, но не от самого пропущенного значения. Пример: мужчины чаще пропускают вопрос о весе (пол наблюдаем, а пропуск зависит от пола, не от реального веса).</p>
      <p><b>Как обрабатывать:</b> множественное вменение (MICE), KNN imputer с другими признаками. Простое удаление даёт смещённые оценки!</p>

      <h4>MNAR — Missing Not At Random</h4>
      <p>Пропуск зависит от самого пропущенного значения. Люди с очень высоким доходом не указывают доход. Тяжело больные не приходят на контрольный осмотр.</p>
      <p><b>Как обрабатывать:</b> самый сложный случай. Индикатор пропуска часто несёт информацию. Идеально — собрать больше данных или использовать предметные знания. Все статистические методы дают смещённые оценки при MNAR.</p>

      <div class="key-concept">
        <div class="kc-label">Практическое правило</div>
        <p>На практике почти невозможно доказать MCAR или MAR статистически. Используйте предметную экспертизу: «почему этот признак может быть пропущен?». Если ответ включает само значение признака — это MNAR.</p>
      </div>

      <h3>🗑️ Удаление (Deletion)</h3>

      <h4>Listwise Deletion (полное удаление)</h4>
      <p>Удаляем строку, если в ней есть хотя бы один пропуск. Просто, не вносит дополнительных предположений.</p>
      <p><b>Проблема:</b> если пропуски в разных столбцах — теряется очень много данных. 5 признаков, в каждом 10% пропусков → в строке хотя бы один пропуск ≈ $1 - 0.9^5 = 41\%$ строк!</p>

      <h4>Pairwise Deletion</h4>
      <p>Удаляем строку только при вычислении конкретной пары переменных. Для корреляционного анализа — берём только те строки, где оба признака не пропущены.</p>
      <p><b>Проблема:</b> разные корреляции вычисляются на разных подвыборках → матрица корреляций может быть не положительно-определённой.</p>

      <h3>📊 Простое вменение (Simple Imputation)</h3>

      <h4>Mean/Median/Mode</h4>
      <p>Заполняем пропуски средним (числовые), медианой (с выбросами), модой (категориальные).</p>
      <p><b>Плюсы:</b> быстро, просто, не нужны другие признаки.</p>
      <p><b>Минусы:</b> искусственно сужает распределение — дисперсия занижается, корреляции с другими признаками занижаются. Не учитывает структуру данных.</p>

      <h4>Константа</h4>
      <p>Заполняем фиксированным значением: 0, -1, «Unknown», «Other». Полезно для категориальных признаков или когда «нет данных» само по себе информативно.</p>

      <h3>🤖 Модельное вменение</h3>

      <h4>KNN Imputer</h4>
      <p>Для каждой строки с пропуском находит K ближайших соседей (по другим признакам, без NaN) и заполняет пропуск средним значением у соседей.</p>
      <p><b>Плюсы:</b> учитывает взаимосвязи между признаками, более реалистичные значения.</p>
      <p><b>Минусы:</b> медленно на больших данных (O(n²)), чувствителен к масштабу → нужна стандартизация перед KNN.</p>

      <h4>Iterative Imputer (MICE)</h4>
      <p>Multiple Imputation by Chained Equations. Итеративно обучает модель регрессии для каждого признака по остальным и предсказывает пропущенные значения. Несколько итераций до сходимости.</p>
      <p><b>Плюсы:</b> теоретически лучший подход при MAR, моделирует неопределённость через множественные вменения.</p>
      <p><b>Минусы:</b> медленно, зависит от выбора базовой модели (регрессор/классификатор).</p>

      <h3>🚩 Индикатор пропуска (Missing Indicator)</h3>
      <p>Создаём дополнительный бинарный признак: <code>feature_is_missing = 1</code> если значение пропущено, иначе 0. Затем заполняем пропуск любым методом (обычно медианой).</p>
      <p><b>Когда использовать:</b> при MNAR, когда сам факт пропуска несёт информацию. Модель сама выучит, важен ли признак <code>is_missing</code>.</p>
      <p><b>Осторожно:</b> добавляет признаки — при большом числе столбцов с пропусками матрица удваивается.</p>

      <div class="deep-dive">
        <summary>Подробнее: множественное вменение (Multiple Imputation)</summary>
        <div class="deep-dive-body">
          <p>Простое вменение создаёт одно значение и «делает вид», что оно истинное. Это занижает дисперсию и ширину доверительных интервалов.</p>
          <p><b>Множественное вменение (MI)</b> создаёт M заполненных датасетов (например, M=10), обучает M моделей и объединяет их по правилу Рубина (Rubin's Rules):</p>
          <ul>
            <li>Точечная оценка: среднее по M моделям $\\hat{\\theta} = \\frac{1}{M}\\sum_{m=1}^M \\hat{\\theta}_m$</li>
            <li>Дисперсия включает как дисперсию внутри вменений, так и между ними</li>
          </ul>
          <p>MI корректно оценивает неопределённость при пропусках. IterativeImputer в sklearn реализует упрощённый вариант (MICE).</p>
          <p>В Python: <code>fancyimpute</code>, <code>miceforest</code>, <code>R::mice</code> — полная реализация MI.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: пропущенность как сигнал</summary>
        <div class="deep-dive-body">
          <p>Иногда факт пропуска содержит больше информации, чем само значение. Примеры из практики:</p>
          <ul>
            <li><b>Кредитный скоринг:</b> отсутствие кредитной истории (NaN в «количество кредитов») — сигнал, а не просто пропуск</li>
            <li><b>Медицина:</b> «не измеряли уровень маркера» может означать, что врач не подозревал болезнь → сам факт отсутствия измерения информативен</li>
            <li><b>E-commerce:</b> пользователь не заполнил дату рождения → возможно, не хочет раскрывать данные (признак конфиденциальности)</li>
          </ul>
          <p>Всегда создавайте индикаторный признак <code>X_is_missing</code> и проверяйте его важность в модели — прежде чем заполнять пропуск.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Feature Engineering</b> — обработка пропусков часть общего pipeline FE; всегда идёт перед кодированием и масштабированием</li>
        <li><b>sklearn Pipeline</b> — SimpleImputer и KNNImputer интегрируются в Pipeline, не допуская утечки данных</li>
        <li><b>Линейные модели</b> — не умеют работать с NaN вообще, нужна обязательная обработка</li>
        <li><b>Деревья (XGBoost, LightGBM)</b> — умеют обрабатывать NaN внутри (обучают отдельный порог для пропусков), но явная обработка всё равно может улучшить результат</li>
        <li><b>Статистика</b> — теория MCAR/MAR/MNAR пришла из статистического анализа данных (Rubin, 1976)</li>
      </ul>
    `,

    examples: [
      {
        title: 'Mean vs Median Imputation',
        steps: [
          {
            title: 'Исходные данные с пропусками',
            content: `
              <p>10 наблюдений, признак «возраст», 2 пропуска и 1 выброс:</p>
              <table class="data-table">
                <thead><tr><th>№</th><th>возраст</th><th>статус</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>24</td><td>✓</td></tr>
                  <tr><td>2</td><td>31</td><td>✓</td></tr>
                  <tr><td>3</td><td style="color:#ef4444;font-weight:600;">NaN</td><td>пропуск</td></tr>
                  <tr><td>4</td><td>45</td><td>✓</td></tr>
                  <tr><td>5</td><td>28</td><td>✓</td></tr>
                  <tr><td>6</td><td>52</td><td>✓</td></tr>
                  <tr><td>7</td><td>19</td><td>✓</td></tr>
                  <tr><td>8</td><td style="color:#ef4444;font-weight:600;">NaN</td><td>пропуск</td></tr>
                  <tr><td>9</td><td>36</td><td>✓</td></tr>
                  <tr><td>10</td><td style="color:#f97316;font-weight:600;">180</td><td>выброс!</td></tr>
                </tbody>
              </table>
              <p>Наблюдение 10 (возраст=180) — явный выброс (ошибка ввода). Посмотрим, как он влияет на разные методы.</p>
            `
          },
          {
            title: 'Вычисляем статистики',
            content: `
              <p>Считаем по 8 известным значениям: 24, 31, 45, 28, 52, 19, 36, 180</p>
              <table class="data-table">
                <thead><tr><th>Статистика</th><th>Значение</th><th>Комментарий</th></tr></thead>
                <tbody>
                  <tr><td><b>Среднее (mean)</b></td><td>51.9</td><td>= (24+31+45+28+52+19+36+180) / 8. Сильно завышено из-за выброса 180!</td></tr>
                  <tr><td><b>Медиана (median)</b></td><td>33.5</td><td>= (31+36)/2. Сортировка: [19,24,28,31,36,45,52,180] → средние два = 31 и 36. Устойчива к выбросу.</td></tr>
                  <tr><td><b>Мода (mode)</b></td><td>нет</td><td>Все значения уникальны, мода не применима.</td></tr>
                </tbody>
              </table>
              <p>Вывод: для данных с выбросами <b>медиана предпочтительнее</b>.</p>
            `
          },
          {
            title: 'Результат заполнения',
            content: `
              <p>Заполняем пропуски (строки 3 и 8) разными способами:</p>
              <table class="data-table">
                <thead><tr><th>№</th><th>Исходно</th><th>Mean (51.9)</th><th>Median (33.5)</th><th>Constant (−1)</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>24</td><td>24</td><td>24</td><td>24</td></tr>
                  <tr><td>2</td><td>31</td><td>31</td><td>31</td><td>31</td></tr>
                  <tr style="background:#fef3c7;"><td>3</td><td style="color:#ef4444;">NaN</td><td style="color:#2563eb;font-weight:600;">51.9</td><td style="color:#059669;font-weight:600;">33.5</td><td style="color:#7c3aed;font-weight:600;">−1</td></tr>
                  <tr><td>4–9</td><td>45…36</td><td>45…36</td><td>45…36</td><td>45…36</td></tr>
                  <tr style="background:#fef3c7;"><td>8</td><td style="color:#ef4444;">NaN</td><td style="color:#2563eb;font-weight:600;">51.9</td><td style="color:#059669;font-weight:600;">33.5</td><td style="color:#7c3aed;font-weight:600;">−1</td></tr>
                  <tr><td>10</td><td style="color:#f97316;">180</td><td>180</td><td>180</td><td>180</td></tr>
                </tbody>
              </table>
              <p>Среднее после заполнения медианой: <b>42.5</b> (реалистично). Среднее после заполнения mean: <b>51.9</b> (завышено, оба пропуска «тянут» к выбросу).</p>
            `
          }
        ]
      },
      {
        title: 'KNN Imputer',
        steps: [
          {
            title: 'Как работает KNN Imputer',
            content: `
              <p>KNN Imputer заполняет пропуск не глобальной статистикой, а значением <b>похожих</b> объектов.</p>
              <table class="data-table">
                <thead><tr><th>№</th><th>возраст</th><th>рост</th><th>вес</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>25</td><td>175</td><td>70</td></tr>
                  <tr><td>2</td><td>30</td><td>180</td><td style="color:#ef4444;font-weight:600;">NaN</td></tr>
                  <tr><td>3</td><td>24</td><td>172</td><td>68</td></tr>
                  <tr><td>4</td><td>55</td><td>168</td><td>80</td></tr>
                  <tr><td>5</td><td>28</td><td>178</td><td>74</td></tr>
                </tbody>
              </table>
              <p>Нужно заполнить вес объекта 2 (возраст=30, рост=180). Используем K=2 ближайших соседей по <b>известным признакам</b> (возраст и рост).</p>
            `
          },
          {
            title: 'Вычисляем расстояния',
            content: `
              <p>Считаем евклидово расстояние от объекта 2 до остальных (только по признакам без NaN):</p>
              <table class="data-table">
                <thead><tr><th>Сосед</th><th>Δвозраст</th><th>Δрост</th><th>Расстояние</th></tr></thead>
                <tbody>
                  <tr><td>Объект 1 (25, 175)</td><td>|30−25|=5</td><td>|180−175|=5</td><td>√(25+25) = <b>7.07</b></td></tr>
                  <tr><td>Объект 3 (24, 172)</td><td>|30−24|=6</td><td>|180−172|=8</td><td>√(36+64) = <b>10.00</b></td></tr>
                  <tr><td>Объект 4 (55, 168)</td><td>|30−55|=25</td><td>|180−168|=12</td><td>√(625+144) = <b>27.73</b></td></tr>
                  <tr><td>Объект 5 (28, 178)</td><td>|30−28|=2</td><td>|180−178|=2</td><td>√(4+4) = <b>2.83</b></td></tr>
                </tbody>
              </table>
              <p>2 ближайших соседа: объект 5 (расстояние 2.83) и объект 1 (расстояние 7.07).</p>
              <p>Вес = среднее по соседям = (74 + 70) / 2 = <b>72 кг</b>. Намного реалистичнее, чем глобальная медиана (74 кг, случайно близко, но с учётом выброса различалось бы сильнее).</p>
            `
          },
          {
            title: 'KNN vs Simple: когда важна разница',
            content: `
              <p>KNN особенно важен, когда <b>пропуск зависит от других признаков</b> (MAR):</p>
              <table class="data-table">
                <thead><tr><th>Метод</th><th>Заполняет пропуск</th><th>Учитывает другие признаки</th><th>Сохраняет корреляции</th></tr></thead>
                <tbody>
                  <tr><td>Mean Imputer</td><td>51.9 (общее среднее)</td><td>Нет</td><td>Занижает</td></tr>
                  <tr><td>KNN Imputer (K=2)</td><td>72 (из похожих)</td><td>Да (возраст + рост)</td><td>Лучше сохраняет</td></tr>
                  <tr><td>IterativeImputer</td><td>~71 (предсказание регрессии)</td><td>Да (все признаки)</td><td>Лучше всего</td></tr>
                </tbody>
              </table>
              <p><b>Когда KNN не поможет:</b> если пропуск MNAR (зависит от самого значения) — никакой метод вменения не даст несмещённых оценок без дополнительной информации.</p>
              <p><b>Практика:</b> KNN Imputer — хороший баланс между простотой и качеством. При больших данных (>100k строк) используйте SimpleImputer или IterativeImputer (быстрее KNN).</p>
            `
          }
        ]
      },
      {
        title: 'Индикатор пропуска',
        steps: [
          {
            title: 'Когда NaN — это сигнал',
            content: `
              <p>Задача: предсказать дефолт по кредиту. Признак «количество просрочек» часто пропущен у новых клиентов.</p>
              <table class="data-table">
                <thead><tr><th>Клиент</th><th>доход</th><th>кол-во просрочек</th><th>дефолт</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>60k</td><td>0</td><td>Нет</td></tr>
                  <tr><td>2</td><td>45k</td><td>3</td><td>Да</td></tr>
                  <tr><td>3</td><td>80k</td><td style="color:#ef4444;">NaN</td><td>Нет</td></tr>
                  <tr><td>4</td><td>35k</td><td style="color:#ef4444;">NaN</td><td>Нет</td></tr>
                  <tr><td>5</td><td>55k</td><td>1</td><td>Нет</td></tr>
                  <tr><td>6</td><td>42k</td><td>5</td><td>Да</td></tr>
                </tbody>
              </table>
              <p>NaN = «нет кредитной истории» = новый клиент. Это MNAR: пропуск зависит от самого значения (0 просрочек у тех, кто никогда не брал кредит — тоже своего рода 0, но с другим смыслом).</p>
            `
          },
          {
            title: 'Создаём индикаторный признак',
            content: `
              <p>Добавляем столбец <code>просрочки_is_missing</code> и заполняем пропуски медианой (1):</p>
              <table class="data-table">
                <thead><tr><th>Клиент</th><th>доход</th><th>просрочки (заполнено)</th><th>просрочки_is_missing</th><th>дефолт</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>60k</td><td>0</td><td>0</td><td>Нет</td></tr>
                  <tr><td>2</td><td>45k</td><td>3</td><td>0</td><td>Да</td></tr>
                  <tr><td>3</td><td>80k</td><td style="color:#059669;font-weight:600;">1 (median)</td><td style="color:#7c3aed;font-weight:600;">1</td><td>Нет</td></tr>
                  <tr><td>4</td><td>35k</td><td style="color:#059669;font-weight:600;">1 (median)</td><td style="color:#7c3aed;font-weight:600;">1</td><td>Нет</td></tr>
                  <tr><td>5</td><td>55k</td><td>1</td><td>0</td><td>Нет</td></tr>
                  <tr><td>6</td><td>42k</td><td>5</td><td>0</td><td>Да</td></tr>
                </tbody>
              </table>
              <p>Теперь модель может выучить: «если <code>просрочки_is_missing=1</code> (новый клиент) — риск дефолта меньше» или «меньше». Это важный сигнал, который без индикатора был бы потерян.</p>
            `
          },
          {
            title: 'Когда индикатор не нужен',
            content: `
              <p>Правило: добавлять индикатор пропуска только если факт пропуска <b>предположительно информативен</b>.</p>
              <table class="data-table">
                <thead><tr><th>Признак</th><th>Причина пропуска</th><th>Тип</th><th>Нужен индикатор?</th></tr></thead>
                <tbody>
                  <tr><td>Температура датчика</td><td>Датчик сломался случайно</td><td>MCAR</td><td>Нет</td></tr>
                  <tr><td>Уровень холестерина</td><td>Не измеряли у молодых (возраст известен)</td><td>MAR</td><td>Возможно</td></tr>
                  <tr><td>Доход клиента</td><td>Богатые не указывают</td><td>MNAR</td><td>Да!</td></tr>
                  <tr><td>Количество кредитов</td><td>Нет кредитной истории</td><td>MNAR</td><td>Да!</td></tr>
                </tbody>
              </table>
              <p>Практически: попробуйте добавить индикатор и посмотрите на важность признака в модели. Если feature importance близка к нулю — индикатор не нужен.</p>
            `
          }
        ]
      }
    ],

    simulation: `
      <div class="sim-container">
        <div class="sim-controls">
          <h3>Симуляция: влияние метода вменения на распределение</h3>
          <div class="control-group">
            <label>Доля пропусков: <span id="missing-pct-label">20%</span></label>
            <input type="range" id="missing-pct" min="5" max="60" value="20" step="5"
              oninput="document.getElementById('missing-pct-label').textContent=this.value+'%'">
          </div>
          <div class="control-group">
            <label>Метод вменения:</label>
            <select id="missing-method">
              <option value="mean">Mean (среднее)</option>
              <option value="median" selected>Median (медиана)</option>
              <option value="zero">Constant (0)</option>
              <option value="knn">KNN (имитация)</option>
            </select>
          </div>
          <div class="control-group">
            <label>Добавить выброс:</label>
            <input type="checkbox" id="missing-outlier">
            <span>(значение × 5 в 5% строк)</span>
          </div>
          <button class="btn-primary" onclick="runMissingSimulation()">Показать эффект</button>
        </div>
        <div id="missing-sim-output" class="sim-output">
          <p style="color:#64748b;">Нажмите кнопку чтобы запустить симуляцию.</p>
        </div>
      </div>
      <script>
      function runMissingSimulation() {
        const pct = parseInt(document.getElementById('missing-pct').value) / 100;
        const method = document.getElementById('missing-method').value;
        const hasOutlier = document.getElementById('missing-outlier').checked;
        const out = document.getElementById('missing-sim-output');

        // Generate 20 values from normal(50, 10)
        const seed = [42,37,55,61,48,52,39,58,44,53,47,56,41,60,38,51,49,57,43,54];
        let data = seed.slice();
        if (hasOutlier) { data[3] = 250; data[11] = 220; }

        // Introduce missing
        const missingIdx = [];
        for (let i = 0; i < data.length; i++) {
          if (Math.random() < pct || (i === 5 || i === 12 || i === 17)) missingIdx.push(i);
        }
        const nMissing = Math.min(Math.round(data.length * pct), data.length - 3);
        const fixedMissing = [2, 7, 13, 16, 4, 9, 1, 18, 6, 14].slice(0, nMissing);

        const known = data.filter((_, i) => !fixedMissing.includes(i));
        const mean = known.reduce((a,b)=>a+b,0)/known.length;
        const sorted = [...known].sort((a,b)=>a-b);
        const median = known.length % 2 === 0
          ? (sorted[known.length/2-1]+sorted[known.length/2])/2
          : sorted[Math.floor(known.length/2)];
        const variance = known.map(v=>(v-mean)**2).reduce((a,b)=>a+b,0)/known.length;
        const std = Math.sqrt(variance);

        let fillValue;
        const methodNames = {mean:'Среднее', median:'Медиана', zero:'Константа 0', knn:'KNN (имитация)'};
        if (method === 'mean') fillValue = mean;
        else if (method === 'median') fillValue = median;
        else if (method === 'zero') fillValue = 0;
        else fillValue = median + (Math.random()-0.5)*std*0.5; // KNN approx

        const filled = data.map((v,i) => fixedMissing.includes(i) ? fillValue : v);
        const filledMean = filled.reduce((a,b)=>a+b,0)/filled.length;
        const filledVar = filled.map(v=>(v-filledMean)**2).reduce((a,b)=>a+b,0)/filled.length;
        const filledStd = Math.sqrt(filledVar);

        out.innerHTML = \`
          <h4>Результат: \${methodNames[method]}, пропусков: \${(pct*100).toFixed(0)}%\${hasOutlier ? ', с выбросами' : ''}</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px;">
            <div style="padding:10px;background:#f0fdf4;border-radius:6px;border:1px solid #bbf7d0;">
              <b>До вменения (по известным):</b><br>
              N известных: \${known.length} из \${data.length}<br>
              Среднее: \${mean.toFixed(1)}<br>
              Медиана: \${median.toFixed(1)}<br>
              Std: \${std.toFixed(1)}
            </div>
            <div style="padding:10px;background:#eff6ff;border-radius:6px;border:1px solid #bfdbfe;">
              <b>После вменения (\${methodNames[method]}):</b><br>
              N: \${filled.length} (все строки сохранены)<br>
              Среднее: \${filledMean.toFixed(1)}<br>
              Вменено значение: \${fillValue.toFixed(1)}<br>
              Std: \${filledStd.toFixed(2)} <span style="color:\${filledStd < std*0.85?'#ef4444':'#059669'}">\${filledStd < std*0.85 ? '▼ занижена' : '≈ норма'}</span>
            </div>
          </div>
          <table class="data-table">
            <thead><tr><th>№</th><th>Исходное</th><th>Статус</th><th>После вменения</th></tr></thead>
            <tbody>
              \${data.map((v,i) => {
                const isMissing = fixedMissing.includes(i);
                return \`<tr style="\${isMissing?'background:#fef3c7;':''}">
                  <td>\${i+1}</td>
                  <td>\${isMissing ? '<span style="color:#ef4444;font-weight:600;">NaN</span>' : v}</td>
                  <td>\${isMissing ? '⚠ пропуск' : '✓'}</td>
                  <td style="\${isMissing?'color:#2563eb;font-weight:600;':''}">\${filled[i].toFixed(1)}</td>
                </tr>\`;
              }).join('')}
            </tbody>
          </table>
          \${pct > 0.4 ? '<p style="color:#ef4444;font-weight:600;margin-top:8px;">⚠ Более 40% пропусков — любой метод вменения будет давать существенное искажение распределения.</p>' : ''}
        \`;
      }
      </script>
    `,

    python: `
      <h3>🐍 Обработка пропусков в Python</h3>

      <h4>Диагностика пропусков</h4>
      <pre><code>import pandas as pd
import numpy as np

# Сколько пропусков и где
missing = df.isnull().sum()
missing_pct = (df.isnull().sum() / len(df) * 100).round(2)
missing_info = pd.DataFrame({'count': missing, 'percent': missing_pct})
print(missing_info[missing_info['count'] > 0].sort_values('percent', ascending=False))

# Паттерн пропусков (вместе ли они встречаются?)
import missingno as msno  # pip install missingno
msno.matrix(df)   # тепловая карта
msno.heatmap(df)  # корреляция пропусков

# Есть ли корреляция между фактом пропуска и таргетом?
df['age_is_missing'] = df['age'].isnull().astype(int)
print(df.groupby('age_is_missing')['target'].mean())  # если разные → MNAR/MAR</code></pre>

      <h4>SimpleImputer</h4>
      <pre><code>from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline

# Числовые признаки — медиана
num_imputer = SimpleImputer(strategy='median')  # 'mean', 'median', 'most_frequent', 'constant'
X_num_filled = num_imputer.fit_transform(X_train[numeric_cols])

# Категориальные — самое частое значение
cat_imputer = SimpleImputer(strategy='most_frequent')
X_cat_filled = cat_imputer.fit_transform(X_train[categorical_cols])

# Константа
const_imputer = SimpleImputer(strategy='constant', fill_value='Unknown')

# ВАЖНО: fit только на train, transform на test
X_test_num = num_imputer.transform(X_test[numeric_cols])  # не fit_transform!</code></pre>

      <h4>KNNImputer</h4>
      <pre><code>from sklearn.impute import KNNImputer
from sklearn.preprocessing import StandardScaler

# KNN чувствителен к масштабу → сначала масштабируем
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

knn_imputer = KNNImputer(n_neighbors=5, weights='uniform')
# weights='distance' — более близкие соседи имеют больший вес
X_filled = knn_imputer.fit_transform(X_scaled)

# Обратно в исходный масштаб
X_filled_original = scaler.inverse_transform(X_filled)

# В Pipeline:
from sklearn.pipeline import Pipeline
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('imputer', KNNImputer(n_neighbors=5)),
    ('model', LogisticRegression())
])</code></pre>

      <h4>IterativeImputer (MICE)</h4>
      <pre><code>from sklearn.impute import IterativeImputer
from sklearn.experimental import enable_iterative_imputer  # нужно включить

# Базовый вариант (BayesianRidge внутри)
iter_imputer = IterativeImputer(
    max_iter=10,          # количество итераций
    random_state=42,
    estimator=None        # None = BayesianRidge по умолчанию
)
X_filled = iter_imputer.fit_transform(X_train)

# С RandomForest как базовым регрессором (лучше для нелинейных данных)
from sklearn.ensemble import RandomForestRegressor
iter_imputer_rf = IterativeImputer(
    estimator=RandomForestRegressor(n_estimators=10, random_state=42),
    max_iter=5
)</code></pre>

      <h4>Индикатор пропуска</h4>
      <pre><code">from sklearn.impute import MissingIndicator, SimpleImputer
from sklearn.pipeline import FeatureUnion, Pipeline

# Вариант 1: вручную
for col in df.columns:
    if df[col].isnull().sum() > 0:
        df[f'{col}_is_missing'] = df[col].isnull().astype(int)

# Вариант 2: MissingIndicator в pipeline
from sklearn.impute import MissingIndicator

# FeatureUnion объединяет оригинальные признаки + индикаторы
transformer = FeatureUnion([
    ('original', SimpleImputer(strategy='median')),
    ('indicator', MissingIndicator())
])
X_with_indicators = transformer.fit_transform(X_train)</code></pre>

      <h4>Проверка качества вменения</h4>
      <pre><code">import matplotlib.pyplot as plt

# Сравниваем распределения до и после вменения
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Только известные значения
axes[0].hist(X_train['age'].dropna(), bins=20, alpha=0.7, label='Известные')
axes[0].set_title('До вменения')

# После вменения
axes[1].hist(X_train_filled['age'], bins=20, alpha=0.7, color='orange', label='После mean')
axes[1].hist(X_train['age'].dropna(), bins=20, alpha=0.5, label='Известные')
axes[1].set_title('После вменения')
plt.legend()
plt.show()

# Сравниваем метрики модели с разными стратегиями
from sklearn.model_selection import cross_val_score

strategies = ['mean', 'median', 'most_frequent']
for s in strategies:
    pipe = Pipeline([('imp', SimpleImputer(strategy=s)), ('clf', LogisticRegression())])
    score = cross_val_score(pipe, X, y, cv=5, scoring='roc_auc').mean()
    print(f'{s}: {score:.4f}')</code></pre>
    `,

    proscons: `
      <h3>Сравнение методов обработки пропусков</h3>
      <table class="data-table">
        <thead><tr><th>Метод</th><th>Плюсы</th><th>Минусы</th><th>Когда использовать</th></tr></thead>
        <tbody>
          <tr>
            <td><b>Listwise Deletion</b></td>
            <td>Просто; несмещённые оценки при MCAR</td>
            <td>Теряет данные; смещение при MAR/MNAR</td>
            <td>MCAR + достаточно данных (&lt;5% строк с NaN)</td>
          </tr>
          <tr>
            <td><b>Mean/Median</b></td>
            <td>Быстро; не теряет строки; легко интерпретировать</td>
            <td>Занижает дисперсию; рвёт корреляции; не учитывает структуру</td>
            <td>Быстрый прототип; MCAR с небольшим % NaN</td>
          </tr>
          <tr>
            <td><b>KNN Imputer</b></td>
            <td>Учитывает взаимосвязи признаков; реалистичнее mean</td>
            <td>Медленно O(n²); требует масштабирования; нет теоретических гарантий</td>
            <td>MAR; данные до 100k строк; есть смысловые связи между признаками</td>
          </tr>
          <tr>
            <td><b>IterativeImputer (MICE)</b></td>
            <td>Теоретически лучший при MAR; моделирует неопределённость</td>
            <td>Медленно; сложнее настраивать; предположение о MAR</td>
            <td>MAR; важна статистическая корректность; объём до 50k строк</td>
          </tr>
          <tr>
            <td><b>Индикатор пропуска</b></td>
            <td>Сохраняет сигнал; всегда применим; не мешает другим методам</td>
            <td>Удваивает число признаков; неинформативен при MCAR</td>
            <td>MNAR; кредитный скоринг; медицина; любой случай подозрения на MNAR</td>
          </tr>
          <tr>
            <td><b>Константа (−1, "Unknown")</b></td>
            <td>Явно показывает пропуск в данных; для деревьев удобно</td>
            <td>Может создать ложный паттерн; линейные модели не поймут −1 как "нет данных"</td>
            <td>Категориальные признаки; деревья; когда нет данных = отдельная категория</td>
          </tr>
        </tbody>
      </table>

      <h3>✅ Универсальный чеклист</h3>
      <ul>
        <li>Проверить % пропусков: если &gt;80% — рассмотреть удаление столбца целиком</li>
        <li>Определить тип пропущенности (MCAR/MAR/MNAR) через предметную экспертизу</li>
        <li>Создать индикаторный признак при подозрении на MNAR</li>
        <li>Числовые: медиана (или KNN при наличии времени и важности признака)</li>
        <li>Категориальные: мода или константа «Unknown»</li>
        <li>Всегда <code>fit</code> только на train, <code>transform</code> на test</li>
        <li>Сравнить метрики модели с разными стратегиями через кросс-валидацию</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главный принцип</div>
        <p>Не существует «лучшего» метода вне контекста. Выбор зависит от <b>типа пропущенности</b>, <b>доли пропусков</b> и <b>требований к точности</b>. Индикатор пропуска — бесплатная страховка: добавляйте его всегда при MNAR, проверяйте важность.</p>
      </div>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest (канал)</a> — разбор стратегий обработки пропусков</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BF%D1%80%D0%BE%D0%BF%D1%83%D1%81%D0%BA%D0%BE%D0%B2%20imputation" target="_blank">Пропуски в данных на Habr</a> — типы пропущенности, MCAR/MAR/MNAR и методы обработки</li>
        <li><a href="https://github.com/iskandr/fancyimpute" target="_blank">fancyimpute — GitHub</a> — библиотека с MICE, KNN и другими продвинутыми импутерами</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/impute.html" target="_blank">sklearn: Imputation of missing values</a> — SimpleImputer, KNNImputer, IterativeImputer</li>
      </ul>
    `,
  }
});
