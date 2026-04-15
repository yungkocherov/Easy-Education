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
          <text x="285" y="75" text-anchor="middle" font-size="9" fill="#1e40af">31|<tspan font-weight="700">170</tspan>|85</text>
          <text x="285" y="90" text-anchor="middle" font-size="9" fill="#1e40af"><tspan font-weight="700">34</tspan>|165|60</text>
          <text x="285" y="100" text-anchor="middle" font-size="9" fill="#64748b">(медиана)</text>
          <!-- KNN impute -->
          <rect x="345" y="25" width="100" height="80" rx="6" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
          <text x="395" y="44" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">KNN Imputer</text>
          <text x="395" y="60" text-anchor="middle" font-size="9" fill="#065f46">24|180|70</text>
          <text x="395" y="75" text-anchor="middle" font-size="9" fill="#065f46">31|<tspan font-weight="700">172</tspan>|85</text>
          <text x="395" y="90" text-anchor="middle" font-size="9" fill="#065f46"><tspan font-weight="700">27</tspan>|165|60</text>
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
          <p>Простое вменение создаёт одно значение и «делает вид», что оно истинное. Это занижает дисперсию и ширину <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">доверительных интервалов</a>.</p>
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
              <p>Среднее после заполнения медианой: <b>48.2</b> (реалистичнее). Среднее после заполнения mean: <b>51.9</b> (остаётся завышенным, т.к. mean-impute сохраняет исходное среднее с выбросом).</p>
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
              <p>Вес = среднее по соседям = (74 + 70) / 2 = <b>72 кг</b>. KNN нашёл похожих людей и использовал именно их значения — это намного надёжнее, чем глобальное среднее (73 кг), особенно на больших данных с выбросами.</p>
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

    simulation: [
      {
        title: 'Imputers в 2D',
        html: `
          <h3>Mean / Median / KNN / Iterative на одних данных</h3>
          <p>Есть два коррелированных признака $X_1, X_2$. Часть значений $X_2$ — пропуски. Разные импьютеры дают разные вменённые точки: mean/median ложатся на горизонтальную линию (игнорируют $X_1$), KNN и Iterative используют связь с $X_1$ и восстанавливают данные близко к истинной прямой.</p>
          <div class="sim-container">
            <div class="sim-controls" id="miImp-controls"></div>
            <div class="sim-buttons">
              <button class="btn" id="miImp-regen">🔄 Новые данные</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="miImp-chart"></canvas></div>
              <div class="sim-stats" id="miImp-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#miImp-controls');
          const cMethod = App.makeControl('select', 'miImp-method', 'Метод', {
            options: [
              { value: 'mean', label: 'Mean imputation' },
              { value: 'median', label: 'Median imputation' },
              { value: 'knn', label: 'KNN (k=5, по X1)' },
              { value: 'iter', label: 'Iterative (линейная регрессия)' },
              { value: 'all', label: 'Все методы сразу' },
            ],
            value: 'all',
          });
          const cN = App.makeControl('range', 'miImp-n', 'Число точек', { min: 30, max: 300, step: 10, value: 120 });
          const cRho = App.makeControl('range', 'miImp-rho', 'Истинная ρ(X1, X2)', { min: -0.95, max: 0.95, step: 0.05, value: 0.8 });
          const cPct = App.makeControl('range', 'miImp-pct', 'Доля пропусков X2', { min: 0.05, max: 0.5, step: 0.05, value: 0.25 });
          [cMethod, cN, cRho, cPct].forEach(c => controls.appendChild(c.wrap));

          let chart = null;
          let seed = null;

          function regen() {
            const n = +cN.input.value;
            const rho = +cRho.input.value;
            const pct = +cPct.input.value;
            const x1 = [], x2 = [];
            for (let i = 0; i < n; i++) {
              const z1 = App.Util.randn();
              const z2 = App.Util.randn();
              x1.push(z1 * 2);
              x2.push((rho * z1 + Math.sqrt(1 - rho * rho) * z2) * 2);
            }
            const missing = new Array(n).fill(false);
            // Добавим пропуски случайно (MCAR)
            for (let i = 0; i < n; i++) if (Math.random() < pct) missing[i] = true;
            seed = { x1, x2, missing };
          }

          function linreg(xs, ys) {
            const mx = App.Util.mean(xs), my = App.Util.mean(ys);
            let num = 0, den = 0;
            for (let i = 0; i < xs.length; i++) {
              num += (xs[i] - mx) * (ys[i] - my);
              den += (xs[i] - mx) ** 2;
            }
            const slope = num / (den || 1e-12);
            return { slope, intercept: my - slope * mx };
          }

          function impute(method) {
            const { x1, x2, missing } = seed;
            const known = x2.filter((_, i) => !missing[i]);
            const knownX1 = x1.filter((_, i) => !missing[i]);
            const imputed = x2.slice();
            if (method === 'mean') {
              const m = App.Util.mean(known);
              for (let i = 0; i < x2.length; i++) if (missing[i]) imputed[i] = m;
            } else if (method === 'median') {
              const md = App.Util.median(known);
              for (let i = 0; i < x2.length; i++) if (missing[i]) imputed[i] = md;
            } else if (method === 'knn') {
              const k = 5;
              for (let i = 0; i < x2.length; i++) {
                if (!missing[i]) continue;
                const dists = knownX1.map((v, j) => [Math.abs(v - x1[i]), known[j]]);
                dists.sort((a, b) => a[0] - b[0]);
                let s = 0;
                for (let j = 0; j < Math.min(k, dists.length); j++) s += dists[j][1];
                imputed[i] = s / Math.min(k, dists.length);
              }
            } else if (method === 'iter') {
              const lr = linreg(knownX1, known);
              for (let i = 0; i < x2.length; i++) if (missing[i]) imputed[i] = lr.intercept + lr.slope * x1[i];
            }
            return imputed;
          }

          function run() {
            if (!seed) regen();
            const { x1, x2, missing } = seed;
            const method = cMethod.input.value;

            const observed = x1.map((x, i) => missing[i] ? null : { x, y: x2[i] }).filter(Boolean);
            const truth = x1.map((x, i) => missing[i] ? { x, y: x2[i] } : null).filter(Boolean);

            const datasets = [
              { label: 'Наблюдаемые', data: observed, backgroundColor: 'rgba(59,130,246,0.55)', pointRadius: 4 },
              { label: 'Истинные (скрытые)', data: truth, backgroundColor: 'rgba(148,163,184,0.35)', pointRadius: 5, pointStyle: 'triangle' },
            ];

            const methodsToShow = method === 'all' ? ['mean', 'median', 'knn', 'iter'] : [method];
            const colors = { mean: 'rgba(239,68,68,0.9)', median: 'rgba(245,158,11,0.9)', knn: 'rgba(16,185,129,0.9)', iter: 'rgba(139,92,246,0.9)' };
            const labels = { mean: 'Mean', median: 'Median', knn: 'KNN', iter: 'Iterative' };
            const errors = {};
            for (const m of methodsToShow) {
              const imp = impute(m);
              const pts = x1.map((x, i) => missing[i] ? { x, y: imp[i] } : null).filter(Boolean);
              datasets.push({
                label: labels[m] + ' импьют',
                data: pts,
                backgroundColor: colors[m],
                pointRadius: 5,
                pointStyle: 'crossRot',
                borderColor: colors[m],
                borderWidth: 2,
              });
              // MSE на пропущенных
              let sse = 0, cnt = 0;
              for (let i = 0; i < x1.length; i++) if (missing[i]) { sse += (imp[i] - x2[i]) ** 2; cnt++; }
              errors[m] = cnt ? Math.sqrt(sse / cnt) : 0;
            }

            const ctx = container.querySelector('#miImp-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'scatter',
              data: { datasets },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Каждый крестик — вменённое значение на месте пропуска' } },
                scales: {
                  x: { title: { display: true, text: 'X1 (наблюдается всегда)' } },
                  y: { title: { display: true, text: 'X2 (часть — пропуски)' } },
                },
              },
            });
            App.registerChart(chart);

            const statsEl = container.querySelector('#miImp-stats');
            statsEl.innerHTML = '';
            const nMiss = missing.filter(Boolean).length;
            const cards = [['Пропусков', nMiss + ' из ' + x1.length]];
            for (const m of methodsToShow) cards.push(['RMSE ' + labels[m], errors[m].toFixed(3)]);
            cards.forEach(([l, v]) => {
              const d = document.createElement('div');
              d.className = 'stat-card';
              d.innerHTML = `<div class="stat-label">${l}</div><div class="stat-value">${v}</div>`;
              statsEl.appendChild(d);
            });
          }

          [cMethod, cN, cRho, cPct].forEach(c => c.input.addEventListener('input', () => { if (c === cN || c === cRho || c === cPct) regen(); run(); }));
          cMethod.input.addEventListener('change', run);
          container.querySelector('#miImp-regen').onclick = () => { regen(); run(); };
          regen();
          run();
        },
      },
      {
        title: 'MCAR vs MAR vs MNAR',
        html: `
          <h3>MCAR, MAR, MNAR: когда среднее смещается</h3>
          <p>Сгенерируем данные и применим три механизма пропусков. Для каждого посчитаем <b>среднее по наблюдаемым</b> и сравним с истинным средним. MCAR — несмещённое. MAR — можно поправить моделью. <b>MNAR</b> — среднее систематически смещено, никакое mean/median-вменение это не спасёт.</p>
          <div class="sim-container">
            <div class="sim-controls" id="miMech-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="miMech-chart"></canvas></div>
              <div class="sim-stats" id="miMech-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#miMech-controls');
          const cN = App.makeControl('range', 'miMech-n', 'Размер выборки', { min: 200, max: 3000, step: 100, value: 1000 });
          const cStrength = App.makeControl('range', 'miMech-str', 'Сила механизма', { min: 0.1, max: 1, step: 0.05, value: 0.6 });
          [cN, cStrength].forEach(c => controls.appendChild(c.wrap));

          let chart = null;

          function run() {
            const n = +cN.input.value;
            const str = +cStrength.input.value;

            // Истинные данные: зарплата ~ LogNormal, возраст независимый
            const salary = [];
            const age = [];
            for (let i = 0; i < n; i++) {
              salary.push(Math.exp(App.Util.randn(4, 0.5)) * 10); // medianish ~ 545
              age.push(25 + Math.random() * 40);
            }
            const trueMean = App.Util.mean(salary);

            // MCAR: случайно, независимо от всего
            const mcar = salary.map(v => Math.random() < str * 0.4 ? null : v);
            // MAR: вероятность пропуска зависит от возраста (полностью наблюдаемого)
            const mar = salary.map((v, i) => {
              const p = str * (age[i] - 25) / 40;
              return Math.random() < p ? null : v;
            });
            // MNAR: вероятность пропуска зависит от самой зарплаты — богатые не отвечают
            const mnar = salary.map(v => {
              const p = str * (v / (trueMean * 3));
              return Math.random() < p ? null : v;
            });

            function observedMean(arr) {
              const f = arr.filter(v => v !== null);
              return f.length ? App.Util.mean(f) : 0;
            }
            function biasPct(arr) {
              const m = observedMean(arr);
              return ((m - trueMean) / trueMean) * 100;
            }

            // гистограммы
            const lo = 0, hi = App.Util.quantile(salary, 0.99);
            const hTrue = App.Util.histogram(salary, 40, [lo, hi]);
            const hMCAR = App.Util.histogram(mcar.filter(v => v !== null), 40, [lo, hi]);
            const hMAR = App.Util.histogram(mar.filter(v => v !== null), 40, [lo, hi]);
            const hMNAR = App.Util.histogram(mnar.filter(v => v !== null), 40, [lo, hi]);

            const ctx = container.querySelector('#miMech-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: hTrue.centers.map(c => App.Util.round(c, 0)),
                datasets: [
                  { label: 'Истинное', data: hTrue.counts, borderColor: 'rgba(15,23,42,0.7)', borderWidth: 2, pointRadius: 0, fill: false },
                  { label: 'MCAR (наблюд.)', data: hMCAR.counts, borderColor: 'rgba(16,185,129,0.9)', borderWidth: 2, pointRadius: 0, fill: false },
                  { label: 'MAR (наблюд.)', data: hMAR.counts, borderColor: 'rgba(245,158,11,0.9)', borderWidth: 2, pointRadius: 0, fill: false },
                  { label: 'MNAR (наблюд.)', data: hMNAR.counts, borderColor: 'rgba(239,68,68,0.9)', borderWidth: 2.5, pointRadius: 0, fill: false },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Распределения наблюдаемых зарплат при разных механизмах пропусков' } },
                scales: {
                  x: { title: { display: true, text: 'Зарплата' }, ticks: { maxTicksLimit: 10 } },
                  y: { title: { display: true, text: 'Частота' }, beginAtZero: true },
                },
              },
            });
            App.registerChart(chart);

            const statsEl = container.querySelector('#miMech-stats');
            statsEl.innerHTML = '';
            const cards = [
              ['Истинное ср.', trueMean.toFixed(1)],
              ['MCAR bias', biasPct(mcar).toFixed(1) + '%'],
              ['MAR bias', biasPct(mar).toFixed(1) + '%'],
              ['MNAR bias', biasPct(mnar).toFixed(1) + '% ⚠'],
            ];
            cards.forEach(([l, v]) => {
              const d = document.createElement('div');
              d.className = 'stat-card';
              d.innerHTML = `<div class="stat-label">${l}</div><div class="stat-value">${v}</div>`;
              statsEl.appendChild(d);
            });
          }

          [cN, cStrength].forEach(c => c.input.addEventListener('input', run));
          run();
        },
      },
    ],

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

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Медицинские данные и клинические исследования.</b> У разных пациентов проведены разные анализы: кому-то делали МРТ, кому-то нет. Удалять строки — значит выбросить половину выборки. Правильная импутация + индикатор пропуска — стандарт работы с EHR (electronic health records).</li>
        <li><b>Опросы и социология.</b> Респонденты пропускают «неудобные» вопросы (доход, политические взгляды). Это классический MAR/MNAR: сам факт пропуска несёт информацию о респонденте. MICE (multiple imputation by chained equations) — стандарт в статистике.</li>
        <li><b>Кредитный скоринг.</b> У новых клиентов нет кредитной истории, у самозанятых — справки о доходах. Пропуск сильно коррелирован с риском, поэтому индикатор NaN сам по себе мощная фича, а заполнение медианой грубо искажает сигнал.</li>
        <li><b>Сенсорные данные и IoT.</b> Датчики теряют связь, перезагружаются, дают NaN при калибровке. Чаще всего MCAR — можно импутировать интерполяцией или forward-fill по времени.</li>
        <li><b>Log-данные и product analytics.</b> Событие не произошло — это 0 или NaN? Для «сколько раз пользователь нажал кнопку» — 0. Для «сколько секунд длилось видео» у того, кто его не открыл — NaN. Путать эти случаи — источник большинства багов в аналитике.</li>
        <li><b>Legacy-системы и миграции баз.</b> Исторические данные с меняющейся схемой: старые записи имеют пропуски в полях, которые появились позже. Часто нужно удалять столбцы по порогу заполненности.</li>
        <li><b>Таблицы Kaggle-соревнований.</b> Любой реальный датасет имеет пропуски; грамотная работа с ними — один из главных бустеров метрики для табличных задач.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Сохраняет объём выборки.</b> Listwise deletion (удалить строки с NaN) может выкинуть половину данных, если пропуски размазаны по разным столбцам. Импутация позволяет использовать все строки — особенно важно при ограниченном датасете и дорогой разметке.</p>
      <p><b>Median/Mean — бесплатный бейзлайн.</b> Один вызов <code>SimpleImputer(strategy='median')</code> — и большинство моделей перестают падать на NaN. Для быстрого прототипа или MCAR с &lt; 5% пропусков этого часто достаточно, а временные затраты — нулевые.</p>
      <p><b>Индикатор пропуска — «бесплатная» фича.</b> Добавление бинарной колонки <code>is_missing</code> не портит ничего и часто сильно улучшает модель при MNAR: сам факт пропуска несёт сигнал. Обязательный приём в скоринге и медицине.</p>
      <p><b>KNN-Imputer учитывает структуру данных.</b> В отличие от медианы, восстанавливает значение «по соседям» — сохраняет корреляции между признаками. Работает лучше на датасетах, где признаки осмысленно связаны (рост↔вес, доход↔образование).</p>
      <p><b>IterativeImputer (MICE) статистически корректен при MAR.</b> Моделирует каждый признак с пропусками как функцию остальных через регрессию. Теоретически наилучший метод, когда пропуски зависят от других наблюдаемых переменных, и стандарт в биостатистике.</p>
      <p><b>Деревья и бустинги работают с NaN нативно.</b> LightGBM, XGBoost, CatBoost принимают NaN как отдельное значение и оптимально выбирают направление в дереве. Это снимает необходимость в импутации вообще и часто даёт лучший результат «без лишних телодвижений».</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Mean/Median искажают распределение и рвут корреляции.</b> Замена NaN на среднее занижает дисперсию и создаёт искусственный «пик» на среднем. Линейные модели и тесты гипотез после такой импутации дают смещённые доверительные интервалы. Для быстрого прототипа — ок, для серьёзной статистики — нет.</p>
      <p><b>Все методы, кроме индикатора, проваливаются при MNAR.</b> Missing Not At Random — пропуск зависит от самого пропущенного значения («не ответил о доходе, потому что доход большой/маленький»). Ни KNN, ни MICE, ни среднее не знают истинного значения. Игнорирование MNAR даёт систематическое смещение, которое не лечится ни одним алгоритмом импутации — только моделированием механизма пропусков или отдельным индикатором.</p>
      <p><b>KNN и Iterative медленные и капризные.</b> KNN-Imputer работает за $O(n^2)$ — на 500k строк он просто не закончит. IterativeImputer требует сходимости итераций и плохо работает при высокой доле пропусков. Оба требуют масштабирования признаков.</p>
      <p><b>Утечка данных через импутацию.</b> Если <code>fit_transform</code> сделан на всём датасете (train + test), статистика теста «протекает» в train. Обязательно внутри <code>Pipeline</code>, <code>fit</code> только на train, <code>transform</code> на test — иначе CV-метрики врут.</p>
      <p><b>Константа ломает линейные модели.</b> Замена NaN на $-1$ выглядит удобно для деревьев, но для линейной модели −1 это просто маленькое число, которое тянет коэффициент вниз. В линейных моделях обязательно one-hot с индикатором или смысловая константа.</p>
      <p><b>Слишком большой процент пропусков.</b> Если в столбце &gt; 60–80% NaN, любая импутация становится фантазией. Обычно честнее удалить признак целиком или превратить его в бинарный «есть/нет значение».</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Что выбрать / делать</th><th>❌ Когда подход провалится</th></tr>
        <tr>
          <td><b>Удалить строки (listwise):</b> MCAR и пропусков &lt; 5% — самый честный вариант</td>
          <td>Пропусков &gt; 5% или MAR/MNAR — потеряешь данные и получишь смещение</td>
        </tr>
        <tr>
          <td><b>Median/Mean:</b> быстрый бейзлайн, MCAR, немного пропусков, простая модель</td>
          <td>Нужны корректные доверительные интервалы или пропусков много — исказит дисперсию</td>
        </tr>
        <tr>
          <td><b>Mode (для категорий):</b> категориальные признаки с доминирующим классом</td>
          <td>Категории распределены равномерно — мода не несёт смысла, лучше «Unknown»</td>
        </tr>
        <tr>
          <td><b>KNN-Imputer:</b> MAR, осмысленные связи между признаками, до 100k строк</td>
          <td>Большие данные (&gt; 500k) или много признаков — станет катастрофически медленным</td>
        </tr>
        <tr>
          <td><b>IterativeImputer (MICE):</b> MAR, статистические задачи, биостатистика, средние объёмы</td>
          <td>MNAR или сходимость плохая — результаты будут необоснованными</td>
        </tr>
        <tr>
          <td><b>Индикатор пропуска (<code>is_missing</code>):</b> подозрение на MNAR — скоринг, медицина, опросы</td>
          <td>Чистый MCAR — индикатор будет просто шумом</td>
        </tr>
        <tr>
          <td><b>Ничего не делать:</b> LightGBM/XGBoost/CatBoost — принимают NaN нативно</td>
          <td>Используешь линейную модель, SVM, kNN, нейросеть — упадут на NaN</td>
        </tr>
        <tr>
          <td><b>Удалить столбец:</b> &gt; 60–80% пропусков и нет MNAR-сигнала</td>
          <td>Пропуск сам по себе информативен (MNAR) — удалишь сигнал</td>
        </tr>
        <tr>
          <td><b>Domain-based (ручное правило):</b> знание предметной области говорит, чем заменить</td>
          <td>Предметной экспертизы нет — не выдумывай, проверь MCAR/MAR/MNAR сначала</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a> с нативной поддержкой NaN</b> — LightGBM, XGBoost, CatBoost не требуют импутации вообще. Часто проще и лучше, чем придумывать сложную схему заполнения.</li>
        <li><b>Multiple Imputation</b> — вместо одного значения заполняем несколько раз с разными случайными дополнениями, обучаем модели на каждом и усредняем. Статистически наиболее корректный подход для получения доверительных интервалов.</li>
        <li><b>Deep learning импутация (Denoising Autoencoders, GAIN)</b> — нейросеть учится восстанавливать пропуски на большом датасете. Имеет смысл на огромных таблицах с высокой долей NaN и сложными зависимостями.</li>
        <li><b>Сбор дополнительных данных</b> — самое честное решение. Если признак важен и часто пропущен, иногда дешевле вернуться к источнику и дозаполнить, чем пытаться угадать.</li>
        <li><b>Переформулировать признак</b> — вместо «сколько лет кредитной истории» использовать «есть ли кредитная история (бинарно)». Убирает NaN ценой потери тонкости сигнала.</li>
      </ul>
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
