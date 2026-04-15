/* ==========================================================================
   Feature Engineering
   ========================================================================== */
App.registerTopic({
  id: 'feature-engineering',
  category: 'ml-basics',
  title: 'Feature Engineering',
  summary: 'Кодирование, масштабирование, создание и отбор признаков — главный навык DS.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('intro-ml')">Что такое ML</a> ·
        <a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> ·
        <a onclick="App.selectTopic('metrics')">Метрики</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты повар. Сырые данные — это необработанные продукты: картошка в земле, мясо с костями, специи целиком. Модель машинного обучения — это печь: она умеет печь, но не умеет чистить и нарезать. <b>Feature engineering — это готовка</b>: правильно нарезать, замариновать, соединить ингредиенты перед тем как поставить в печь.</p>
        <p>Даже самая мощная «умная печь» (нейросеть, градиентный бустинг) приготовит плохое блюдо из плохо подготовленных ингредиентов. Наоборот, правильно подготовленные данные позволяют даже простой линейной регрессии показывать отличные результаты.</p>
        <p>На практике feature engineering — это то, что <b>отличает среднего дата-сайентиста от сильного</b>. Именно здесь применяются знания предметной области.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Пайплайн обработки признаков</text>
          <!-- Raw data box -->
          <rect x="10" y="30" width="110" height="120" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="65" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Сырые данные</text>
          <text x="65" y="70" text-anchor="middle" font-size="9" fill="#78350f">город: "Москва"</text>
          <text x="65" y="85" text-anchor="middle" font-size="9" fill="#78350f">дата: 2024-03-15</text>
          <text x="65" y="100" text-anchor="middle" font-size="9" fill="#78350f">цена: 15000000</text>
          <text x="65" y="115" text-anchor="middle" font-size="9" fill="#78350f">площадь: 54</text>
          <text x="65" y="130" text-anchor="middle" font-size="9" fill="#ef4444">возраст: NaN</text>
          <text x="65" y="145" text-anchor="middle" font-size="9" fill="#78350f">этаж: 7</text>
          <!-- Arrow 1 -->
          <polygon points="120,90 140,84 140,96" fill="#64748b"/>
          <line x1="120" y1="90" x2="140" y2="90" stroke="#64748b" stroke-width="1.5"/>
          <!-- Transform box -->
          <rect x="140" y="30" width="130" height="120" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
          <text x="205" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#5b21b6">Преобразования</text>
          <text x="205" y="70" text-anchor="middle" font-size="9" fill="#5b21b6">OHE: Москва→[1,0,0]</text>
          <text x="205" y="85" text-anchor="middle" font-size="9" fill="#5b21b6">час→8, день→5</text>
          <text x="205" y="100" text-anchor="middle" font-size="9" fill="#5b21b6">цена/площадь=277k</text>
          <text x="205" y="115" text-anchor="middle" font-size="9" fill="#5b21b6">StandardScaler</text>
          <text x="205" y="130" text-anchor="middle" font-size="9" fill="#5b21b6">NaN→median</text>
          <text x="205" y="145" text-anchor="middle" font-size="9" fill="#5b21b6">SelectKBest top-10</text>
          <!-- Arrow 2 -->
          <polygon points="270,90 290,84 290,96" fill="#64748b"/>
          <line x1="270" y1="90" x2="290" y2="90" stroke="#64748b" stroke-width="1.5"/>
          <!-- Features box -->
          <rect x="290" y="30" width="120" height="120" rx="8" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
          <text x="350" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Признаки</text>
          <text x="350" y="70" text-anchor="middle" font-size="9" fill="#065f46">city_moscow: 1</text>
          <text x="350" y="85" text-anchor="middle" font-size="9" fill="#065f46">hour: 0.62</text>
          <text x="350" y="100" text-anchor="middle" font-size="9" fill="#065f46">price_per_sqm: 0.81</text>
          <text x="350" y="115" text-anchor="middle" font-size="9" fill="#065f46">floor_norm: 0.44</text>
          <text x="350" y="130" text-anchor="middle" font-size="9" fill="#065f46">age_imputed: 0.30</text>
          <text x="350" y="145" text-anchor="middle" font-size="9" fill="#065f46">is_weekend: 0</text>
          <!-- Arrow 3 -->
          <polygon points="410,90 430,84 430,96" fill="#64748b"/>
          <line x1="410" y1="90" x2="430" y2="90" stroke="#64748b" stroke-width="1.5"/>
          <!-- Model box -->
          <rect x="430" y="50" width="110" height="80" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
          <text x="485" y="80" text-anchor="middle" font-size="10" font-weight="600" fill="#991b1b">Модель</text>
          <text x="485" y="98" text-anchor="middle" font-size="9" fill="#991b1b">LinearRegression</text>
          <text x="485" y="113" text-anchor="middle" font-size="9" fill="#991b1b">RandomForest</text>
          <text x="485" y="128" text-anchor="middle" font-size="9" fill="#991b1b">XGBoost</text>
          <!-- Bottom labels -->
          <text x="65" y="175" text-anchor="middle" font-size="9" fill="#64748b">Исходная таблица</text>
          <text x="205" y="175" text-anchor="middle" font-size="9" fill="#64748b">Feature Engineering</text>
          <text x="350" y="175" text-anchor="middle" font-size="9" fill="#64748b">Матрица признаков X</text>
          <text x="485" y="175" text-anchor="middle" font-size="9" fill="#64748b">Предсказание</text>
        </svg>
        <div class="caption">Feature engineering преобразует сырые данные в числовую матрицу, понятную модели. Каждый шаг — отдельная техника.</div>
      </div>

      <h3>📦 Типы признаков</h3>
      <p>Прежде чем обрабатывать данные, нужно понять, с чем имеем дело:</p>
      <ul>
        <li><b>Числовые (Numerical):</b> возраст, цена, температура. Уже числа, но нужно масштабирование.</li>
        <li><b>Категориальные (Categorical):</b> город, цвет, тип товара. Нужно кодирование.</li>
        <li><b>Текстовые (Text):</b> описание, отзыв. Нужны TF-IDF, <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">эмбеддинги</a>.</li>
        <li><b>Даты и время (Datetime):</b> дата рождения, время транзакции. Нужна декомпозиция.</li>
        <li><b>Бинарные (Binary):</b> флаги да/нет. Уже готовы (0/1).</li>
      </ul>

      <h3>🔤 Кодирование категориальных признаков</h3>
      <p>Модели работают с числами. Категории нужно превратить в числа — и тут важен выбор метода.</p>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-one-hot')">One-Hot</a> Encoding (OHE)</h4>
      <p>Каждая категория → отдельный столбец с 0/1. Для признака «город» с 3 значениями создаётся 3 бинарных столбца.</p>
      <p><b>Когда:</b> мало уникальных значений (до 20–30), нет порядка между категориями, модель линейная или деревья.</p>
      <p><b>Проблема:</b> при большой кардинальности (тысячи городов) создаёт огромную разреженную матрицу.</p>

      <h4>Label Encoding</h4>
      <p>Каждая категория → целое число (Москва=0, Питер=1, Казань=2). Простой и компактный.</p>
      <p><b>Когда:</b> категории имеют естественный порядок (low/medium/high), или только для деревьев (они сами разберутся).</p>
      <p><b>Проблема:</b> для линейных моделей создаёт ложный порядок — модель думает, что Казань «больше» Питера.</p>

      <h4>Target Encoding</h4>
      <p>Каждая категория → среднее значение целевой переменной по этой категории. Если Москва даёт средние продажи 500k — кодируется как 500k.</p>
      <p><b>Когда:</b> высокая кардинальность, регрессия или бинарная классификация.</p>
      <p><b>Проблема:</b> <span class="term" data-tip="Target leakage при target encoding. Если кодировать на обучающих данных и сразу использовать — модель увидит информацию о целевой переменной в признаках. Решение: кодировать только на train, с K-fold cross-validation.">утечка таргета</span>! Нужна cross-validation при обучении или out-of-fold encoding.</p>

      <h4>Frequency Encoding</h4>
      <p>Каждая категория → частота её встречаемости в данных. Москва встречается в 40% строк → 0.40.</p>
      <p><b>Когда:</b> высокая кардинальность, частота встречаемости сама по себе информативна (популярные категории vs редкие).</p>

      <div class="key-concept">
        <div class="kc-label">Золотое правило кодирования</div>
        <p>Для <b>деревьев (RF, XGBoost)</b> — Label Encoding часто достаточен, OHE не всегда улучшает. Для <b>линейных моделей и нейросетей</b> — OHE обязателен для номинальных переменных. Target Encoding мощный, но требует аккуратности с утечкой.</p>
      </div>

      <h3>📏 Масштабирование числовых признаков</h3>
      <p>Признаки в разных масштабах ломают многие алгоритмы: KNN и SVM полностью «слепнут» к маленьким признакам, градиентный спуск сходится медленно.</p>

      <h4>StandardScaler (Z-нормализация)</h4>
      <p>$x' = (x - \\mu) / \\sigma$ — среднее 0, стандартное отклонение 1. Данные центрируются и нормируются.</p>
      <p><b>Когда:</b> нормальное или около-нормальное распределение, нет сильных выбросов. Лучший выбор для линейных моделей, SVM, нейросетей.</p>

      <h4>MinMaxScaler</h4>
      <p>$x' = (x - x_{min}) / (x_{max} - x_{min})$ — все значения в диапазоне [0, 1].</p>
      <p><b>Когда:</b> нужен фиксированный диапазон (например, для нейросетей с <a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">sigmoid</a>-активацией), данные ограничены (изображения 0–255). <b>Чувствителен к выбросам</b> — один экстремальный выброс сжимает все остальные данные.</p>

      <h4>RobustScaler</h4>
      <p>$x' = (x - Q_{50}) / (Q_{75} - Q_{25})$ — использует медиану и межквартильный размах вместо среднего и std.</p>
      <p><b>Когда:</b> есть выбросы, которые нельзя удалить. Не чувствителен к экстремальным значениям.</p>

      <h3>⚗️ Создание новых признаков</h3>
      <p>Иногда самые мощные признаки — не те, что есть в данных, а те, что вы создадите сами.</p>
      <ul>
        <li><b>Полиномиальные:</b> $x^2$, $x^3$. Добавляют нелинейность для линейных моделей. <code>PolynomialFeatures(degree=2)</code> создаёт все комбинации.</li>
        <li><b>Взаимодействия:</b> $x_1 \\cdot x_2$. Цена × площадь = общая стоимость. Возраст × болезнь = риск.</li>
        <li><b>Агрегаты:</b> средние по группам. Средняя цена по городу, максимальная оценка пользователя.</li>
        <li><b>Декомпозиция datetime:</b> из даты → год, месяц, день, час, день недели, <code>is_weekend</code>, квартал, номер недели, количество дней до события.</li>
        <li><b>Признаки из текста:</b> длина строки, количество слов, наличие ключевых слов.</li>
        <li><b>Ранги и бины:</b> <code>pd.cut()</code> для разбивки на категории, <code>pd.qcut()</code> для квантилей.</li>
      </ul>

      <h3>🎯 Отбор признаков</h3>
      <p>Больше признаков ≠ лучше модель. Лишние признаки увеличивают шум, время обучения, риск <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a>.</p>

      <h4>Фильтровые методы (Filter)</h4>
      <p>Оцениваем признаки независимо от модели. Быстро, но не учитывает взаимодействия между признаками.</p>
      <ul>
        <li><b>Корреляция Пирсона:</b> убираем признаки с корреляцией &gt;0.95 (дублируют информацию) и признаки с малой корреляцией с таргетом.</li>
        <li><b>Mutual Information:</b> насколько признак снижает неопределённость таргета. Улавливает нелинейные зависимости.</li>
        <li><b>Дисперсия:</b> признак с нулевой дисперсией (все значения одинаковые) бесполезен → <code>VarianceThreshold</code>.</li>
      </ul>

      <h4>Обёрточные методы (Wrapper)</h4>
      <p>Обучаем модель на разных подмножествах признаков и выбираем лучший набор.</p>
      <ul>
        <li><b>RFE (Recursive Feature Elimination):</b> обучаем модель, убираем наименее важный признак, повторяем. Медленно, но качественно.</li>
      </ul>

      <h4>Встроенные методы (Embedded)</h4>
      <p>Отбор происходит в процессе обучения самой модели.</p>
      <ul>
        <li><b>L1 (Lasso) регуляризация:</b> обнуляет веса бесполезных признаков — получаем отбор «бесплатно» при обучении.</li>
        <li><b>Feature Importance деревьев:</b> Random Forest и XGBoost возвращают <code>.feature_importances_</code> — убираем признаки с нулевой важностью.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: <a class="glossary-link" onclick="App.selectTopic('glossary-data-leakage')">утечка таргета</a> при Target Encoding</summary>
        <div class="deep-dive-body">
          <p>Target Encoding — мощный инструмент, но с ловушкой. Если вы считаете среднее таргета по категории на <em>всех</em> обучающих данных, а потом используете эти же данные для обучения модели — модель видит «намёки» о правильном ответе в признаках.</p>
          <p>Правило: кодировать нужно только на <em>других</em> данных:</p>
          <ul>
            <li><b>K-fold cross-encoding:</b> разбиваем train на K частей, для каждой части кодируем по остальным K-1. Это Out-of-Fold Target Encoding.</li>
            <li>На test всегда используем кодировки, посчитанные на всём train (без утечки, т.к. test не участвовал).</li>
          </ul>
          <p>В sklearn есть <code>TargetEncoder</code> (sklearn ≥ 1.3), который делает OOF-кодирование автоматически.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Feature Stores — управление признаками в продакшене</summary>
        <div class="deep-dive-body">
          <p>В реальных ML-системах появляется проблема: одни и те же признаки (например, «среднее количество покупок пользователя за 30 дней») нужны многим моделям и пересчитываются независимо. Это дорого и ведёт к рассинхрону.</p>
          <p><b>Feature Store</b> — это централизованное хранилище вычисленных признаков:</p>
          <ul>
            <li><b>Offline store:</b> исторические признаки для обучения (Hive, Parquet, S3)</li>
            <li><b>Online store:</b> признаки в реальном времени для инференса (Redis, DynamoDB)</li>
          </ul>
          <p>Популярные инструменты: Feast, Tecton, Vertex AI Feature Store, Hopsworks.</p>
          <p>Ключевой принцип: признак вычисляется один раз, используется многими моделями. При инференсе модель запрашивает признаки по ключу (user_id, item_id) — без пересчёта.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Обработка пропусков</b> — часть feature engineering pipeline, предшествует кодированию и масштабированию.</li>
        <li><b>Линейная регрессия</b> — полностью зависит от качества признаков; полиномиальные признаки добавляют нелинейность.</li>
        <li><b>Random Forest / <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting</b> — менее чувствительны к масштабированию и кодированию, но хорошие признаки всё равно помогают.</li>
        <li><b>Нейросети</b> — при достаточном количестве данных учатся представлениям сами (representation learning), но хороший FE всё равно ускоряет сходимость.</li>
        <li><b>PCA</b> — метод уменьшения размерности, создаёт новые «синтетические» признаки из существующих.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Кодирование категорий',
        steps: [
          {
            title: 'Исходные данные',
            content: `
              <p>Есть датасет продаж с категориальным признаком «город» (3 значения) и «цвет» (3 значения). Нужно передать их в модель.</p>
              <table class="data-table">
                <thead><tr><th>id</th><th>город</th><th>цвет</th><th>цена (таргет)</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>Москва</td><td>Красный</td><td>500</td></tr>
                  <tr><td>2</td><td>Питер</td><td>Синий</td><td>350</td></tr>
                  <tr><td>3</td><td>Казань</td><td>Зелёный</td><td>280</td></tr>
                  <tr><td>4</td><td>Москва</td><td>Синий</td><td>520</td></tr>
                  <tr><td>5</td><td>Питер</td><td>Красный</td><td>370</td></tr>
                </tbody>
              </table>
              <p>Задача: превратить строки «Москва», «Питер», «Казань» в числа.</p>
            `
          },
          {
            title: 'One-Hot Encoding',
            content: `
              <p><b>OHE</b> создаёт бинарный столбец для каждого уникального значения. 3 города → 3 столбца:</p>
              <table class="data-table">
                <thead><tr><th>id</th><th>город_Москва</th><th>город_Питер</th><th>город_Казань</th><th>цвет_Красный</th><th>цвет_Синий</th><th>цвет_Зелёный</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
                  <tr><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
                  <tr><td>3</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
                  <tr><td>4</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
                  <tr><td>5</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
                </tbody>
              </table>
              <p>Итого: было 2 столбца → стало 6. Каждая строка содержит ровно одну «1» в каждой группе.</p>
              <p><b>Dummy trap:</b> обычно один столбец из каждой группы убирают (<code>drop='first'</code>), чтобы избежать мультиколлинеарности. Если Москва=0 и Питер=0 — значит это Казань.</p>
            `
          },
          {
            title: 'Label Encoding vs Target Encoding',
            content: `
              <p><b>Label Encoding:</b> просто присваиваем числа (0, 1, 2). Порядок произвольный.</p>
              <table class="data-table">
                <thead><tr><th>город</th><th>Label</th><th>Frequency</th><th>Target (средняя цена)</th></tr></thead>
                <tbody>
                  <tr><td>Москва</td><td>0</td><td>0.40 (2/5)</td><td>510 (среднее 500 и 520)</td></tr>
                  <tr><td>Питер</td><td>1</td><td>0.40 (2/5)</td><td>360 (среднее 350 и 370)</td></tr>
                  <tr><td>Казань</td><td>2</td><td>0.20 (1/5)</td><td>280</td></tr>
                </tbody>
              </table>
              <p><b>Вывод по методам:</b></p>
              <ul>
                <li><b>OHE</b> — идеален для линейных моделей, создаёт много столбцов</li>
                <li><b>Label</b> — для деревьев ОК, для линейных — плохо (ложный порядок)</li>
                <li><b>Target</b> — мощный для высокой кардинальности, но берегись утечки!</li>
                <li><b>Frequency</b> — когда популярность категории информативна</li>
              </ul>
            `
          }
        ]
      },
      {
        title: 'Масштабирование признаков',
        steps: [
          {
            title: 'Проблема разных масштабов',
            content: `
              <p>Три признака в совершенно разных единицах измерения:</p>
              <table class="data-table">
                <thead><tr><th>Объект</th><th>возраст (лет)</th><th>доход (₽)</th><th>кредитный_рейтинг (0–1)</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>25</td><td>50000</td><td>0.75</td></tr>
                  <tr><td>2</td><td>45</td><td>120000</td><td>0.90</td></tr>
                  <tr><td>3</td><td>30</td><td>80000</td><td>0.60</td></tr>
                  <tr><td>4</td><td>55</td><td>200000</td><td>0.85</td></tr>
                </tbody>
              </table>
              <p>Для KNN: расстояние между объектами 1 и 4 = $\\sqrt{(25-55)^2 + (50000-200000)^2 + (0.75-0.85)^2}$ ≈ <b>150000</b>. Признак «доход» полностью доминирует, «рейтинг» незаметен!</p>
            `
          },
          {
            title: 'Применяем StandardScaler',
            content: `
              <p>Считаем среднее и std каждого признака по обучающим данным:</p>
              <table class="data-table">
                <thead><tr><th>Статистика</th><th>возраст</th><th>доход</th><th>рейтинг</th></tr></thead>
                <tbody>
                  <tr><td>mean (μ)</td><td>38.75</td><td>112500</td><td>0.775</td></tr>
                  <tr><td>std (σ)</td><td>12.50</td><td>63509</td><td>0.122</td></tr>
                </tbody>
              </table>
              <p>Применяем $x' = (x - \\mu) / \\sigma$ к каждому объекту:</p>
              <table class="data-table">
                <thead><tr><th>Объект</th><th>возраст_norm</th><th>доход_norm</th><th>рейтинг_norm</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>−1.10</td><td>−0.98</td><td>−0.20</td></tr>
                  <tr><td>2</td><td>+0.50</td><td>+0.12</td><td>+1.02</td></tr>
                  <tr><td>3</td><td>−0.70</td><td>−0.51</td><td>−1.43</td></tr>
                  <tr><td>4</td><td>+1.30</td><td>+1.38</td><td>+0.61</td></tr>
                </tbody>
              </table>
              <p>Теперь все признаки в диапазоне ≈ [−2, +2]. KNN, SVM, нейросети увидят каждый признак одинаково.</p>
              <p><b>Важно:</b> StandardScaler обучается только на train. На test применяем те же μ и σ что из train — не пересчитываем!</p>
            `
          },
          {
            title: 'Сравнение StandardScaler vs MinMaxScaler vs RobustScaler',
            content: `
              <p>Добавим строку с выбросом (доход = 2000000) и сравним:</p>
              <table class="data-table">
                <thead><tr><th>Метод</th><th>Формула</th><th>Диапазон</th><th>Устойчивость к выбросам</th><th>Применение</th></tr></thead>
                <tbody>
                  <tr><td><b>StandardScaler</b></td><td>(x−μ)/σ</td><td>≈ [−3, +3]</td><td>Средняя</td><td>Линейные, SVM, нейросети</td></tr>
                  <tr><td><b>MinMaxScaler</b></td><td>(x−min)/(max−min)</td><td>[0, 1]</td><td>Плохая</td><td>Нейросети с sigmoid, изображения</td></tr>
                  <tr><td><b>RobustScaler</b></td><td>(x−Q50)/(Q75−Q25)</td><td>Переменный</td><td>Высокая</td><td>Данные с выбросами</td></tr>
                </tbody>
              </table>
              <p>Деревья (RF, XGBoost, DecisionTree) — масштабирование <b>не нужно</b>: они разбивают по порогам и не используют расстояния.</p>
            `
          }
        ]
      },
      {
        title: 'Создание новых признаков',
        steps: [
          {
            title: 'Декомпозиция datetime',
            content: `
              <p>Исходный признак — дата и время транзакции. Сам по себе бесполезен для модели, но из него можно извлечь много информации:</p>
              <table class="data-table">
                <thead><tr><th>timestamp</th><th>→ год</th><th>→ месяц</th><th>→ день</th><th>→ час</th><th>→ weekday</th><th>→ is_weekend</th><th>→ квартал</th></tr></thead>
                <tbody>
                  <tr><td>2024-03-15 08:30</td><td>2024</td><td>3</td><td>15</td><td>8</td><td>4 (пт)</td><td>0</td><td>1</td></tr>
                  <tr><td>2024-03-16 14:00</td><td>2024</td><td>3</td><td>16</td><td>14</td><td>5 (сб)</td><td>1</td><td>1</td></tr>
                  <tr><td>2024-12-31 23:59</td><td>2024</td><td>12</td><td>31</td><td>23</td><td>1 (вт)</td><td>0</td><td>4</td></tr>
                </tbody>
              </table>
              <p>Дополнительно можно создать: <code>days_to_holiday</code>, <code>is_morning</code> (час 6–10), <code>season</code>, <code>week_of_year</code>.</p>
              <pre><code>df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
df['weekday'] = pd.to_datetime(df['timestamp']).dt.weekday
df['is_weekend'] = (df['weekday'] >= 5).astype(int)
df['quarter'] = pd.to_datetime(df['timestamp']).dt.quarter</code></pre>
            `
          },
          {
            title: 'Взаимодействия и соотношения',
            content: `
              <p>Для рынка недвижимости — исходные данные:</p>
              <table class="data-table">
                <thead><tr><th>объект</th><th>цена (₽)</th><th>площадь (м²)</th><th>комнаты</th><th>этаж</th><th>этажей_всего</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>8 000 000</td><td>45</td><td>2</td><td>3</td><td>9</td></tr>
                  <tr><td>2</td><td>15 000 000</td><td>80</td><td>3</td><td>7</td><td>12</td></tr>
                  <tr><td>3</td><td>5 500 000</td><td>38</td><td>1</td><td>1</td><td>5</td></tr>
                </tbody>
              </table>
              <p>Создаём осмысленные новые признаки:</p>
              <table class="data-table">
                <thead><tr><th>объект</th><th>цена/м²</th><th>м²/комната</th><th>относит_этаж</th><th>is_first_floor</th><th>is_top_floor</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>177 778</td><td>22.5</td><td>0.33</td><td>0</td><td>0</td></tr>
                  <tr><td>2</td><td>187 500</td><td>26.7</td><td>0.58</td><td>0</td><td>0</td></tr>
                  <tr><td>3</td><td>144 737</td><td>38.0</td><td>0.20</td><td>1</td><td>0</td></tr>
                </tbody>
              </table>
              <p>Признак «цена/м²» — это именно то, что покупатели реально сравнивают. Модель могла бы выучить это взаимодействие сама, но мы подсказываем ей явно.</p>
            `
          },
          {
            title: 'Агрегаты по группам',
            content: `
              <p>Мощный приём — агрегировать статистики по группам (пользователь, категория, магазин):</p>
              <pre><code># Средняя цена по городу
df['city_mean_price'] = df.groupby('city')['price'].transform('mean')

# Количество покупок пользователя
df['user_purchase_count'] = df.groupby('user_id')['purchase_id'].transform('count')

# Отклонение от средней по категории (насколько товар дороже/дешевле аналогов)
df['price_vs_category_mean'] = df['price'] / df.groupby('category')['price'].transform('mean')</code></pre>
              <p>Такие признаки называются <b>aggregation features</b> или <b>target statistics</b> (если агрегируем таргет). Они очень эффективны в задачах с высокой кардинальностью.</p>
              <p><b>Осторожно с утечкой:</b> при агрегировании таргета — то же правило, что и с Target Encoding: считать только по train, вычислять out-of-fold.</p>
            `
          }
        ]
      }
    ],

    simulation: [
      {
        title: 'Кодирование и масштабирование',
        html: `
          <h3>Симуляция: кодирование категорий + масштабирование чисел</h3>
          <p>Выбери метод кодирования категории, метод масштабирования числового признака и включи выброс — посмотри, как разные скейлеры реагируют на экстремальные значения.</p>
          <div class="sim-container">
            <div class="sim-controls" id="fe-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="fe-chart"></canvas></div>
              <div class="sim-stats" id="fe-stats"></div>
              <div id="fe-table" style="margin-top:12px;"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#fe-controls');
          const cEnc = App.makeControl('select', 'fe-enc', 'Кодирование', {
            options: [
              { value: 'label', label: 'Label Encoding' },
              { value: 'ohe', label: 'One-Hot Encoding' },
              { value: 'target', label: 'Target Encoding' },
              { value: 'freq', label: 'Frequency Encoding' },
            ],
            value: 'ohe',
          });
          const cScl = App.makeControl('select', 'fe-scl', 'Масштабирование', {
            options: [
              { value: 'none', label: 'Без масштабирования' },
              { value: 'standard', label: 'StandardScaler' },
              { value: 'minmax', label: 'MinMaxScaler' },
              { value: 'robust', label: 'RobustScaler' },
            ],
            value: 'standard',
          });
          const cOut = App.makeControl('range', 'fe-out', 'Выброс ×', { min: 1, max: 20, step: 1, value: 1 });
          [cEnc, cScl, cOut].forEach(c => controls.appendChild(c.wrap));

          let chart = null;
          const categories = ['Москва', 'Питер', 'Казань', 'Москва', 'Питер', 'Казань', 'Москва', 'Питер', 'Казань'];
          const targets = [500, 350, 280, 520, 370, 290, 510, 360, 285];
          const baseValues = [23, 45, 67, 34, 56, 12, 89, 41, 63];

          function run() {
            const enc = cEnc.input.value;
            const scl = cScl.input.value;
            const outK = +cOut.input.value;
            const rawValues = baseValues.slice();
            rawValues[8] = 63 * outK;

            const encNames = { label: 'Label', ohe: 'One-Hot', target: 'Target', freq: 'Frequency' };
            const sclNames = { none: 'сырой', standard: 'Standard', minmax: 'MinMax', robust: 'Robust' };

            let catResult;
            if (enc === 'label') {
              const map = { Москва: 0, Питер: 1, Казань: 2 };
              catResult = categories.map(c => String(map[c]));
            } else if (enc === 'ohe') {
              catResult = categories.map(c => '[' + (c === 'Москва' ? '1,0,0' : c === 'Питер' ? '0,1,0' : '0,0,1') + ']');
            } else if (enc === 'target') {
              const tmap = {};
              ['Москва', 'Питер', 'Казань'].forEach(cat => {
                const vals = targets.filter((_, i) => categories[i] === cat);
                tmap[cat] = App.Util.mean(vals);
              });
              catResult = categories.map(c => tmap[c].toFixed(0));
            } else {
              const fmap = {};
              categories.forEach(c => { fmap[c] = (fmap[c] || 0) + 1; });
              Object.keys(fmap).forEach(k => { fmap[k] /= categories.length; });
              catResult = categories.map(c => fmap[c].toFixed(2));
            }

            const n = rawValues.length;
            const mean = App.Util.mean(rawValues);
            const std = App.Util.std(rawValues, false);
            const mn = Math.min(...rawValues);
            const mx = Math.max(...rawValues);
            const q1 = App.Util.quantile(rawValues, 0.25);
            const q2 = App.Util.quantile(rawValues, 0.5);
            const q3 = App.Util.quantile(rawValues, 0.75);
            const iqr = q3 - q1 || 1;

            let scaled;
            if (scl === 'none') scaled = rawValues.slice();
            else if (scl === 'standard') scaled = rawValues.map(v => (v - mean) / (std || 1));
            else if (scl === 'minmax') scaled = rawValues.map(v => (v - mn) / (mx - mn || 1));
            else scaled = rawValues.map(v => (v - q2) / iqr);

            const ctx = container.querySelector('#fe-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: scaled.map((_, i) => '№' + (i + 1)),
                datasets: [{
                  label: sclNames[scl] + ' значение',
                  data: scaled.map(v => +v.toFixed(3)),
                  backgroundColor: scaled.map((v, i) => i === 8 && outK > 1 ? 'rgba(239,68,68,0.8)' : 'rgba(59,130,246,0.65)'),
                }],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, title: { display: true, text: 'Масштабированный признак (красный — выброс)' } },
                scales: { y: { title: { display: true, text: 'Значение после ' + sclNames[scl] } } },
              },
            });
            App.registerChart(chart);

            const statsEl = container.querySelector('#fe-stats');
            statsEl.innerHTML = '';
            const outlierHit = Math.abs(scaled[8]) > (scl === 'robust' ? 20 : 2.5) && outK > 1;
            const cards = [
              ['Min / Max', mn + ' / ' + mx],
              ['Mean / Std', mean.toFixed(1) + ' / ' + std.toFixed(1)],
              ['Q1 / Q3 / IQR', q1.toFixed(0) + ' / ' + q3.toFixed(0) + ' / ' + iqr.toFixed(0)],
              ['Выброс после scale', scaled[8].toFixed(2) + (outlierHit ? ' ⚠' : '')],
            ];
            cards.forEach(([l, v]) => {
              const d = document.createElement('div');
              d.className = 'stat-card';
              d.innerHTML = `<div class="stat-label">${l}</div><div class="stat-value">${v}</div>`;
              statsEl.appendChild(d);
            });

            const tableEl = container.querySelector('#fe-table');
            tableEl.innerHTML = `
              <table class="data-table">
                <thead><tr><th>№</th><th>Город</th><th>${encNames[enc]}</th><th>Сырой</th><th>${sclNames[scl]}</th></tr></thead>
                <tbody>
                  ${rawValues.map((v, i) => `<tr${i === 8 && outK > 1 ? ' style="background:#fef2f2;"' : ''}><td>${i + 1}</td><td>${categories[i]}</td><td>${catResult[i]}</td><td>${v}</td><td>${scaled[i].toFixed(3)}</td></tr>`).join('')}
                </tbody>
              </table>
            `;
          }

          [cEnc, cScl].forEach(c => c.input.addEventListener('change', run));
          cOut.input.addEventListener('input', run);
          run();
        },
      },
      {
        title: 'Binning непрерывных признаков',
        html: `
          <h3>Биннинг: equal-width, equal-frequency, quantile</h3>
          <p>Непрерывный признак можно разбить на корзины — превратив его в категориальный. Это полезно для линейных моделей (ловят нелинейность), для деревьев — обычно бесполезно. Смотри, как разные стратегии бьют распределение: equal-width даёт «пустые» корзины на хвостах, equal-frequency выравнивает наполнение, но ширина корзин плавает.</p>
          <div class="sim-container">
            <div class="sim-controls" id="feBin-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="feBin-chart"></canvas></div>
              <div class="sim-stats" id="feBin-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#feBin-controls');
          const cDist = App.makeControl('select', 'feBin-dist', 'Распределение', {
            options: [
              { value: 'normal', label: 'Нормальное' },
              { value: 'lognorm', label: 'LogNormal (скошенное)' },
              { value: 'bimodal', label: 'Бимодальное' },
              { value: 'uniform', label: 'Равномерное' },
            ],
            value: 'lognorm',
          });
          const cStrategy = App.makeControl('select', 'feBin-strat', 'Стратегия', {
            options: [
              { value: 'uniform', label: 'Equal-width' },
              { value: 'quantile', label: 'Equal-frequency (quantile)' },
              { value: 'kmeans', label: 'KMeans (1D)' },
            ],
            value: 'uniform',
          });
          const cK = App.makeControl('range', 'feBin-k', 'Число корзин', { min: 2, max: 15, step: 1, value: 5 });
          const cN = App.makeControl('range', 'feBin-n', 'Размер выборки', { min: 200, max: 3000, step: 100, value: 1000 });
          [cDist, cStrategy, cK, cN].forEach(c => controls.appendChild(c.wrap));

          let chart = null;

          function sampleDist(type, n) {
            const out = [];
            for (let i = 0; i < n; i++) {
              if (type === 'normal') out.push(App.Util.randn(0, 1));
              else if (type === 'lognorm') out.push(Math.exp(App.Util.randn(0, 0.7)));
              else if (type === 'bimodal') out.push(Math.random() < 0.5 ? App.Util.randn(-2, 0.6) : App.Util.randn(2, 0.6));
              else out.push(Math.random() * 10 - 5);
            }
            return out;
          }

          function computeEdges(data, strategy, k) {
            if (strategy === 'uniform') {
              const lo = Math.min(...data), hi = Math.max(...data);
              const step = (hi - lo) / k;
              const edges = [];
              for (let i = 0; i <= k; i++) edges.push(lo + step * i);
              return edges;
            }
            if (strategy === 'quantile') {
              const edges = [Math.min(...data)];
              for (let i = 1; i < k; i++) edges.push(App.Util.quantile(data, i / k));
              edges.push(Math.max(...data));
              return edges;
            }
            // KMeans 1D
            const sorted = [...data].sort((a, b) => a - b);
            const centers = [];
            for (let i = 0; i < k; i++) centers.push(sorted[Math.floor((i + 0.5) * sorted.length / k)]);
            for (let it = 0; it < 30; it++) {
              const groups = Array.from({ length: k }, () => []);
              for (const v of data) {
                let best = 0, bd = Infinity;
                for (let j = 0; j < k; j++) {
                  const d = Math.abs(v - centers[j]);
                  if (d < bd) { bd = d; best = j; }
                }
                groups[best].push(v);
              }
              for (let j = 0; j < k; j++) if (groups[j].length) centers[j] = App.Util.mean(groups[j]);
            }
            centers.sort((a, b) => a - b);
            const edges = [Math.min(...data)];
            for (let i = 0; i < k - 1; i++) edges.push((centers[i] + centers[i + 1]) / 2);
            edges.push(Math.max(...data));
            return edges;
          }

          function run() {
            const n = +cN.input.value;
            const k = +cK.input.value;
            const data = sampleDist(cDist.input.value, n);
            const edges = computeEdges(data, cStrategy.input.value, k);

            // счётчик по корзинам
            const counts = new Array(k).fill(0);
            for (const v of data) {
              for (let i = 0; i < k; i++) {
                if (v <= edges[i + 1]) { counts[i]++; break; }
              }
            }
            const widths = [];
            for (let i = 0; i < k; i++) widths.push(edges[i + 1] - edges[i]);

            const labels = [];
            for (let i = 0; i < k; i++) labels.push('[' + edges[i].toFixed(1) + ', ' + edges[i + 1].toFixed(1) + ']');

            const ctx = container.querySelector('#feBin-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels,
                datasets: [
                  {
                    label: 'Точек в корзине',
                    data: counts,
                    backgroundColor: 'rgba(59,130,246,0.65)',
                    yAxisID: 'y',
                  },
                  {
                    label: 'Ширина корзины',
                    data: widths,
                    type: 'line',
                    borderColor: 'rgba(239,68,68,0.9)',
                    borderWidth: 2,
                    pointRadius: 3,
                    yAxisID: 'y1',
                    fill: false,
                  },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Размер и ширина корзин' } },
                scales: {
                  x: { ticks: { maxRotation: 40 } },
                  y: { position: 'left', beginAtZero: true, title: { display: true, text: 'Точек' } },
                  y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, title: { display: true, text: 'Ширина' } },
                },
              },
            });
            App.registerChart(chart);

            // метрики качества биннинга
            const avg = n / k;
            let maxDev = 0;
            for (const c of counts) maxDev = Math.max(maxDev, Math.abs(c - avg) / avg);
            const minCount = Math.min(...counts);
            const maxCount = Math.max(...counts);

            const statsEl = container.querySelector('#feBin-stats');
            statsEl.innerHTML = '';
            const cards = [
              ['Корзин', k],
              ['Среднее наполнение', avg.toFixed(0)],
              ['Min / Max', minCount + ' / ' + maxCount],
              ['Макс. отклонение', (maxDev * 100).toFixed(0) + '%'],
              ['Ширина корзин равна?', cStrategy.input.value === 'uniform' ? 'да' : 'нет'],
            ];
            cards.forEach(([l, v]) => {
              const d = document.createElement('div');
              d.className = 'stat-card';
              d.innerHTML = `<div class="stat-label">${l}</div><div class="stat-value">${v}</div>`;
              statsEl.appendChild(d);
            });
          }

          [cK, cN].forEach(c => c.input.addEventListener('input', run));
          [cDist, cStrategy].forEach(c => c.input.addEventListener('change', run));
          run();
        },
      },
    ],

    python: `
      <h3>🐍 Feature Engineering в sklearn</h3>

      <h4>ColumnTransformer — разные трансформации для разных столбцов</h4>
      <pre><code>from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# Определяем типы столбцов
numeric_features = ['age', 'income', 'credit_score']
categorical_features = ['city', 'product_type']
ordinal_features = ['education_level']  # low < medium < high

# Пайплайны для каждого типа
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

ordinal_transformer = OrdinalEncoder(categories=[['low', 'medium', 'high']])

# Объединяем всё в ColumnTransformer
preprocessor = ColumnTransformer(transformers=[
    ('num', numeric_transformer, numeric_features),
    ('cat', categorical_transformer, categorical_features),
    ('ord', ordinal_transformer, ordinal_features)
])

# Финальный пайплайн с моделью
from sklearn.ensemble import RandomForestClassifier
clf = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100))
])

clf.fit(X_train, y_train)
predictions = clf.predict(X_test)</code></pre>

      <h4>Создание новых признаков</h4>
      <pre><code>import pandas as pd
import numpy as np
from sklearn.preprocessing import PolynomialFeatures

# Datetime декомпозиция
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['hour'] = df['timestamp'].dt.hour
df['weekday'] = df['timestamp'].dt.weekday
df['month'] = df['timestamp'].dt.month
df['is_weekend'] = (df['weekday'] >= 5).astype(int)
df['quarter'] = df['timestamp'].dt.quarter

# Взаимодействия вручную
df['price_per_sqm'] = df['price'] / df['area']
df['rooms_per_sqm'] = df['rooms'] / df['area']
df['floor_ratio'] = df['floor'] / df['total_floors']

# Агрегаты по группам
df['city_mean_price'] = df.groupby('city')['price'].transform('mean')
df['user_purchase_count'] = df.groupby('user_id')['id'].transform('count')

# Полиномиальные признаки
poly = PolynomialFeatures(degree=2, include_bias=False, interaction_only=False)
X_poly = poly.fit_transform(X_numeric)
print("Исходных:", X_numeric.shape[1], "→ Полином. признаков:", X_poly.shape[1])</code></pre>

      <h4>Отбор признаков</h4>
      <pre><code>from sklearn.feature_selection import (
    SelectKBest, mutual_info_classif, f_classif,
    RFE, SelectFromModel, VarianceThreshold
)
from sklearn.linear_model import LogisticRegression, Lasso
from sklearn.ensemble import RandomForestClassifier

# 1. Фильтровый метод: Mutual Information
selector_mi = SelectKBest(score_func=mutual_info_classif, k=10)
X_selected = selector_mi.fit_transform(X_train, y_train)
selected_features = [feat for feat, sel in zip(feature_names, selector_mi.get_support()) if sel]
print("Топ-10 признаков по MI:", selected_features)

# 2. Фильтровый: убираем нулевую дисперсию
vt = VarianceThreshold(threshold=0.01)
X_nonzero = vt.fit_transform(X_train)

# 3. Обёрточный: RFE
rfe = RFE(estimator=LogisticRegression(max_iter=1000), n_features_to_select=10)
rfe.fit(X_train, y_train)
print("RFE выбрал признаки:", rfe.get_support())

# 4. Встроенный: L1 (Lasso)
lasso = SelectFromModel(Lasso(alpha=0.01))
lasso.fit(X_train, y_train)
X_lasso = lasso.transform(X_train)
print("Lasso оставил:", X_lasso.shape[1], "из", X_train.shape[1])

# 5. Встроенный: важность деревьев
rf = RandomForestClassifier(n_estimators=100)
rf.fit(X_train, y_train)
importances = pd.Series(rf.feature_importances_, index=feature_names)
print(importances.sort_values(ascending=False).head(10))</code></pre>

      <h4>Target Encoding (безопасный, без утечки)</h4>
      <pre><code>from sklearn.preprocessing import TargetEncoder  # sklearn >= 1.3

# Автоматически использует cross-validation при fit
te = TargetEncoder(smooth='auto')
X_encoded = te.fit_transform(X_train[['city']], y_train)

# Вручную (out-of-fold):
from sklearn.model_selection import KFold
kf = KFold(n_splits=5, shuffle=True, random_state=42)
df['city_target_enc'] = 0.0

for train_idx, val_idx in kf.split(df):
    train_part = df.iloc[train_idx]
    mean_map = train_part.groupby('city')['target'].mean()
    df.loc[df.index[val_idx], 'city_target_enc'] = df.iloc[val_idx]['city'].map(mean_map)</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Табличные соревнования и продакшен-скоринг.</b> Kaggle, кредитный скоринг, антифрод — всё, где строки-признаки-таргет. Здесь грамотные агрегаты, отношения и target encoding часто дают больший прирост, чем переход от XGBoost к более тяжёлой модели.</li>
        <li><b>Временные ряды и прогнозирование.</b> Лаги ($y_{t-1}, y_{t-7}$), скользящие средние, разности, день недели, праздники, сезонные флаги. Без этого ML-модель вообще не понимает, что данные упорядочены во времени — в отличие от ARIMA/Prophet.</li>
        <li><b>Product analytics и churn.</b> RFM-метрики (Recency, Frequency, Monetary), сессионные агрегаты, doc2vec по последовательностям событий. Сырые логи надо превратить в «портрет пользователя».</li>
        <li><b>Финансы и риск-менеджмент.</b> Отношения (долг/доход, LTV/cap), бининг возраста, WoE-кодирование категорий, производные показатели (волатильность, momentum). Фичи валидируются риск-отделом и регулятором.</li>
        <li><b>NLP до эпохи трансформеров (и до сих пор в лёгких моделях).</b> TF-IDF, n-граммы, длина текста, доля заглавных, POS-теги, sentiment-lexicons. Быстрый бейзлайн на логистической регрессии часто выбивает 90% качества тяжёлой нейросети.</li>
        <li><b>Computer Vision до CNN и сейчас в медицине/науке.</b> HOG, SIFT, гистограммы цветов, текстурные фичи Haralick. В задачах с очень малым числом меченых снимков ручные фичи + SVM до сих пор конкурируют с fine-tuned нейросетями.</li>
        <li><b>Sensor data и IoT.</b> FFT-коэффициенты, энергия сигнала в полосах, статистики скользящего окна — превращают непрерывный поток в вектор признаков для любого табличного алгоритма.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Встраивание доменной экспертизы напрямую в модель.</b> Модель не знает, что «долг / доход» важнее каждого из двух чисел по отдельности, а аналитик — знает. Одна такая производная фича часто стоит дороже, чем переход с логистической регрессии на градиентный бустинг. Это самый дешёвый способ «подарить» модели знание мира.</p>
      <p><b>Делает простые модели конкурентоспособными.</b> Линейная/логистическая регрессия с хорошими признаками обгоняет нейросеть с сырыми. Для продакшена это огромный плюс: интерпретируемая, быстрая, стабильная модель вместо чёрного ящика с GPU.</p>
      <p><b>Снимает ограничения линейных моделей.</b> Полиномиальные признаки ($x^2$, $xy$) и взаимодействия превращают линейную модель в способную ловить нелинейности — при этом коэффициенты остаются интерпретируемыми.</p>
      <p><b>Решает проблему малых данных.</b> Когда у тебя 500 примеров, нейросеть не обучится, а дерево переобучится. Явные фичи, отражающие структуру задачи, позволяют работать даже с крошечными датасетами — потому что ты заменяешь «обучение с нуля» на «заданную априорную структуру».</p>
      <p><b>Интерпретируемость для стейкхолдеров.</b> Фича <code>debt_to_income</code> понятна риск-менеджеру, а скрытый признак из слоя embedding — нет. В регулируемых отраслях вручную созданные признаки — это единственный способ пройти аудит.</p>
      <p><b>Часто закрывает целые классы проблем.</b> Нормализация, кодирование категорий, обработка пропусков, обработка выбросов — всё это FE в широком смысле. Без него модель либо не обучается, либо обучается некорректно.</p>
      <p><b>Многоразовое использование.</b> Один раз построенный пайплайн фич применяется ко многим задачам в той же предметной области. RFM-метрики работают и для churn, и для LTV-прогноза, и для сегментации.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Требует времени и экспертизы.</b> Хороший FE — это недели работы аналитика, который понимает данные. Если бюджета нет или ты работаешь в незнакомой области, получится криво. AutoML-фреймворк за час сделает больше, чем неподготовленный человек за неделю.</p>
      <p><b>Комбинаторный взрыв.</b> Для $p$ признаков есть $p(p-1)/2$ попарных взаимодействий, $p^2$ квадратичных и так далее. Начинаешь генерировать всё подряд — получаешь тысячи признаков и переобучение. Нужен жёсткий feature selection или регуляризация.</p>
      <p><b>Риск target leakage.</b> Любая агрегация, считающая среднее таргета по группе, легко включает текущую строку — и ты получаешь модель с AUC 0.99 на train и 0.55 на проде. Особенно опасны target encoding, скользящие статистики и оконные фичи. Обязательна out-of-fold схема.</p>
      <p><b>Утечка статистик train→test.</b> Обучил StandardScaler на всём датасете, а потом разбил — и твой CV врёт. Правило «<code>fit</code> только на train» постоянно нарушают начинающие, а потом удивляются, что прод-метрики хуже оффлайна.</p>
      <p><b>Устаревание фич.</b> Признак «количество транзакций за последний месяц» при изменении продукта (новая подписка, новая категория) перестаёт значить то же самое. FE создаёт долг на мониторинг: кто-то должен следить, что распределения фич не уехали.</p>
      <p><b>На изображениях, аудио и длинных текстах проигрывает глубокому обучению.</b> CNN сама выучит оптимальные фильтры лучше, чем HOG. Transformer построит контекстные embedding лучше, чем TF-IDF. Тратить силы на ручные фичи в этих областях при наличии данных — почти всегда потеря времени.</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Делай ручной FE когда</th><th>❌ НЕ заморачивайся когда</th></tr>
        <tr>
          <td>Табличные данные и линейная/логистическая модель — тут FE даёт основной прирост</td>
          <td>Ты используешь современный градиентный бустинг (XGBoost/LightGBM/CatBoost) на сотнях тысяч строк — он сам поймает взаимодействия</td>
        </tr>
        <tr>
          <td>Данных мало (&lt; 10k строк): явные признаки компенсируют недостаток обучающего сигнала</td>
          <td>Данных очень много (миллионы строк) и ты обучаешь глубокую нейросеть или сильный бустинг — модель сама выучит нужные представления</td>
        </tr>
        <tr>
          <td>Есть доменная экспертиза — риск-менеджер, врач, инженер, — которую можно превратить в формулы</td>
          <td>Работаешь с изображениями/аудио/длинными текстами и есть возможность взять предобученную CNN/Transformer — transfer learning обыграет любой ручной FE</td>
        </tr>
        <tr>
          <td>Нужна интерпретируемость: регулятор или бизнес должны понимать, что ест модель</td>
          <td>Быстрый прототип «есть ли сигнал в данных» — сначала проверь на сырых фичах с бустингом, потом уже инвестируй в FE</td>
        </tr>
        <tr>
          <td>Временные ряды: без лагов и окон ML-модель в принципе не понимает структуру времени</td>
          <td>Ты не знаешь предметной области и нет эксперта под рукой — скорее всего, сделаешь бесполезные или вредные фичи. Возьми AutoML</td>
        </tr>
        <tr>
          <td>Нужна стабильность в продакшене: простая модель + хорошие фичи легче мониторить, чем end-to-end нейросеть</td>
          <td>Задача взаимодействий произвольно высокого порядка и нет способа их вручную перечислить — пусть бустинг сам найдёт</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a> на сырых признаках</b> — XGBoost/LightGBM/CatBoost при большом датасете сам находит взаимодействия и нелинейности. Часто лучший первый шаг: запусти с дефолтами и посмотри, нужен ли FE вообще.</li>
        <li><b>AutoML (AutoGluon, H2O, FLAML)</b> — автоматически перебирает преобразования признаков, кодирования, модели. Хорошо в незнакомой области и при нехватке времени; хуже там, где важна глубокая доменная логика.</li>
        <li><b>Representation learning / <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">embeddings</a></b> — нейросеть сама учит плотные представления для категорий, текста, графов. Альтернатива one-hot и ручным фичам при очень больших данных.</li>
        <li><b>Feature stores (Feast, Tecton)</b> — не альтернатива, а инфраструктура: переиспользуй ранее сделанные фичи между командами вместо изобретения колеса.</li>
        <li><b>Deep Learning end-to-end</b> — для изображений, аудио, длинных текстов, графов. Там ручной FE давно проиграл; ставка на transfer learning почти всегда правильнее.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=68ABAU_V8qI" target="_blank">Feature Engineering (PyData London)</a> — обзор ключевых техник от Kaggle</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=feature%20engineering%20%D0%BF%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D0%BA%D0%B8" target="_blank">Feature Engineering на Habr</a> — разбор методов обработки и создания признаков на русском</li>
        <li><a href="https://www.kaggle.com/learn/feature-engineering" target="_blank">Kaggle: Feature Engineering micro-course</a> — практический мини-курс с упражнениями</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/preprocessing.html" target="_blank">sklearn: Preprocessing data</a> — масштабирование, кодирование, нормализация</li>
      </ul>
    `,
  }
});
