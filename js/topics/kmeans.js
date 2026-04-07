/* ==========================================================================
   K-Means
   ========================================================================== */
App.registerTopic({
  id: 'kmeans',
  category: 'ml-unsup',
  title: 'K-Means кластеризация',
  summary: 'Разбивает данные на k кластеров итеративным перемещением центроидов.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты рассаживаешь гостей на свадьбе по столам. У тебя 100 гостей и 10 столов. Идея простая: похожие люди за один стол, разные — за разные. Но как понять «похожие»?</p>
        <p>Метод K-Means: ставишь 10 случайных стульев в комнате. Каждый гость садится за <b>ближайший</b> стул. Потом ты двигаешь каждый стул в <b>центр</b> своей группы гостей. Некоторые гости теперь ближе к другому стулу — они переходят. Ты снова двигаешь стулья в центры. И так далее, пока всё не устаканится.</p>
        <p>Результат: 10 групп похожих людей, каждая сгруппирована вокруг своего центра. Это и есть K-Means — простой, наглядный и часто эффективный алгоритм кластеризации.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 205" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">K-Means: три кластера с центроидами</text>
          <!-- Background -->
          <rect x="25" y="25" width="450" height="165" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <!-- Cluster 1: indigo dots + centroid -->
          <circle cx="95" cy="70" r="7" fill="#6366f1" opacity="0.75"/>
          <circle cx="75" cy="95" r="7" fill="#6366f1" opacity="0.75"/>
          <circle cx="115" cy="100" r="7" fill="#6366f1" opacity="0.75"/>
          <circle cx="85" cy="125" r="7" fill="#6366f1" opacity="0.75"/>
          <circle cx="110" cy="65" r="7" fill="#6366f1" opacity="0.75"/>
          <!-- Centroid 1 (large) -->
          <circle cx="97" cy="92" r="13" fill="#6366f1" stroke="#fff" stroke-width="2.5"/>
          <text x="97" y="96" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">C₁</text>
          <!-- Dashed circle around cluster 1 -->
          <circle cx="97" cy="92" r="48" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>
          <!-- Cluster 2: green dots + centroid -->
          <circle cx="250" cy="55" r="7" fill="#10b981" opacity="0.75"/>
          <circle cx="230" cy="80" r="7" fill="#10b981" opacity="0.75"/>
          <circle cx="270" cy="80" r="7" fill="#10b981" opacity="0.75"/>
          <circle cx="245" cy="110" r="7" fill="#10b981" opacity="0.75"/>
          <circle cx="265" cy="52" r="7" fill="#10b981" opacity="0.75"/>
          <!-- Centroid 2 -->
          <circle cx="252" cy="78" r="13" fill="#10b981" stroke="#fff" stroke-width="2.5"/>
          <text x="252" y="82" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">C₂</text>
          <!-- Dashed circle around cluster 2 -->
          <circle cx="252" cy="78" r="45" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>
          <!-- Cluster 3: amber dots + centroid -->
          <circle cx="390" cy="105" r="7" fill="#f59e0b" opacity="0.75"/>
          <circle cx="415" cy="85" r="7" fill="#f59e0b" opacity="0.75"/>
          <circle cx="420" cy="140" r="7" fill="#f59e0b" opacity="0.75"/>
          <circle cx="400" cy="160" r="7" fill="#f59e0b" opacity="0.75"/>
          <circle cx="445" cy="110" r="7" fill="#f59e0b" opacity="0.75"/>
          <!-- Centroid 3 -->
          <circle cx="415" cy="120" r="13" fill="#f59e0b" stroke="#fff" stroke-width="2.5"/>
          <text x="415" y="124" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">C₃</text>
          <!-- Dashed circle around cluster 3 -->
          <circle cx="415" cy="120" r="50" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>
          <!-- Legend -->
          <circle cx="50" cy="200" r="5" fill="#6366f1"/>
          <text x="62" y="204" font-size="9" fill="#334155">кластер 1</text>
          <circle cx="140" cy="200" r="5" fill="#10b981"/>
          <text x="152" y="204" font-size="9" fill="#334155">кластер 2</text>
          <circle cx="230" cy="200" r="5" fill="#f59e0b"/>
          <text x="242" y="204" font-size="9" fill="#334155">кластер 3</text>
          <circle cx="320" cy="200" r="10" fill="#6366f1" stroke="#fff" stroke-width="2"/>
          <text x="336" y="204" font-size="9" fill="#334155">центроид</text>
        </svg>
        <div class="caption">K-Means с k=3: большие круги с C₁/C₂/C₃ — центроиды, малые точки — данные, пунктирные окружности — границы кластерного назначения.</div>
      </div>

      <h3>📊 Задача кластеризации</h3>
      <p>У нас есть данные <b>без разметки</b> — только признаки, никаких классов. Хочется найти <b>естественные группы</b> среди этих точек: похожие объекты объединить, разные — разделить.</p>
      <p>Это задача <span class="term" data-tip="Unsupervised Learning. Обучение без учителя. Модель находит структуру в данных без размеченных ответов.">обучения без учителя</span> (unsupervised learning). Кластеризация — её главный представитель.</p>

      <p>K-Means — самый популярный алгоритм кластеризации. Он разбивает данные на $k$ групп (кластеров) так, чтобы:</p>
      <ul>
        <li>Точки внутри одного кластера были <b>близки</b> друг к другу.</li>
        <li>Точки из разных кластеров были <b>далеки</b>.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>K-Means ищет $k$ точек (<span class="term" data-tip="Centroid. Центр кластера — точка, координаты которой равны среднему координат всех точек кластера.">центроидов</span>), которые «представляют» свои группы. Каждая точка данных относится к ближайшему центроиду. Центроиды оптимизируются так, чтобы суммарное расстояние точек до их центра было минимальным.</p>
      </div>

      <h3>🔄 Алгоритм Ллойда (классический K-Means)</h3>
      <p>Простая итеративная процедура:</p>
      <ol>
        <li><b>Инициализация:</b> выбрать $k$ случайных центроидов.</li>
        <li><b>Assignment (распределение):</b> каждую точку отнести к ближайшему центроиду.</li>
        <li><b>Update (обновление):</b> пересчитать каждый центроид как среднее его кластера.</li>
        <li><b>Повторять</b> шаги 2-3, пока центроиды перестанут меняться (или почти).</li>
      </ol>

      <p>Алгоритм гарантированно сходится за конечное число итераций (обычно 10-20).</p>

      <h3>🧮 Что именно минимизирует K-Means</h3>
      <p>Формально K-Means минимизирует сумму квадратов расстояний от точек до их центроидов:</p>
      <div class="math-block">$$J = \\sum_{i=1}^{n} \\|x_i - \\mu_{c(i)}\\|^2$$</div>

      <p>Это называется <span class="term" data-tip="Inertia / WCSS. Within-Cluster Sum of Squares. Сумма квадратов расстояний от точек до их центроидов. Метрика качества кластеризации — чем меньше, тем лучше.">inertia</span> или WCSS (Within-Cluster Sum of Squares). Чем меньше — тем «плотнее» кластеры.</p>

      <p><b>Важно:</b> это невыпуклая задача с локальными минимумами. Разные инициализации дают разные результаты.</p>

      <h3>⚙️ Инициализация — критически важна</h3>
      <p>Если начать со случайных точек, K-Means может попасть в плохой локальный минимум. Решение: <span class="term" data-tip="K-Means++. Умная инициализация центроидов: первый центр случайный, следующие выбираются с вероятностью, пропорциональной квадрату расстояния до ближайшего уже выбранного центра.">K-Means++</span>:</p>

      <ol>
        <li>Первый центр — случайная точка.</li>
        <li>Следующий центр — с вероятностью, пропорциональной квадрату расстояния до ближайшего уже выбранного центра.</li>
        <li>Повторять, пока не выбрано $k$ центров.</li>
      </ol>

      <p>Центроиды получаются «далеко друг от друга» — лучше покрывают пространство. Это стандартная инициализация в sklearn.</p>

      <h3>🎯 Выбор k — главный вопрос</h3>
      <p>K-Means требует знать $k$ заранее. Как выбрать?</p>

      <h4>Elbow Method</h4>
      <p>Считаем inertia для разных $k$. Получается убывающая кривая. Ищем <b>«локоть»</b> — точку резкого замедления падения.</p>
      <ul>
        <li>До локтя: добавление кластера сильно улучшает качество.</li>
        <li>После локтя: уже малоэффективно.</li>
      </ul>

      <h4>Silhouette Score</h4>
      <p>Для каждой точки меряет: насколько она ближе к своему кластеру, чем к <b>ближайшему чужому</b>:</p>
      <div class="math-block">$$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$$</div>
      <p>Где $a$ — среднее расстояние до своих, $b$ — до ближайших чужих. $s \\in [-1, 1]$, чем выше — тем лучше.</p>

      <h4>Gap Statistic</h4>
      <p>Сравнивает inertia реальных данных с inertia случайных данных. Показывает, насколько структура «лучше случайной».</p>

      <h4>Знание предметной области</h4>
      <p>Иногда $k$ диктуется задачей: «нам нужны 5 сегментов клиентов для маркетинга». Тогда выбор предопределён.</p>

      <h3>⚠️ Ограничения K-Means</h3>
      <p>K-Means прост и быстр, но имеет серьёзные ограничения:</p>

      <h4>1. Ищет только сферические кластеры</h4>
      <p>Алгоритм использует евклидово расстояние и предполагает, что кластеры — округлые. Если есть вытянутые или изогнутые формы — K-Means их <b>не найдёт</b>.</p>

      <h4>2. Чувствителен к масштабу</h4>
      <p>Признак в тысячах будет «тянуть на себя» кластеризацию. <b>Обязательна стандартизация</b> перед K-Means.</p>

      <h4>3. Чувствителен к инициализации</h4>
      <p>Плохое начальное положение → плохой локальный минимум. Запускают несколько раз (n_init = 10) и берут лучший результат.</p>

      <h4>4. Кластеры должны быть сравнимого размера</h4>
      <p>Если один кластер из 1000 точек, другой из 10 — K-Means часто «разрежет» большой, чтобы сбалансировать.</p>

      <h4>5. Нужно знать k</h4>
      <p>В реальности часто неизвестно. DBSCAN этого не требует.</p>

      <h4>6. Плохо с выбросами</h4>
      <p>Центроиды — средние, а среднее чувствительно к выбросам.</p>

      <h3>🔧 Применения</h3>
      <ul>
        <li><b>Сегментация клиентов</b> — группировка по поведению (RFM-анализ).</li>
        <li><b>Сжатие изображений</b> — квантизация цветов.</li>
        <li><b>Feature engineering</b> — номер кластера как признак.</li>
        <li><b>Anomaly detection</b> — точки далёкие от всех центроидов.</li>
        <li><b>Document clustering</b> — тематическая группировка текстов.</li>
        <li><b>Vector quantization</b> — в speech и image processing.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«K-Means универсален»</b> — нет, только для круглых кластеров.</li>
        <li><b>«Inertia — хорошая метрика качества»</b> — только при фиксированном k.</li>
        <li><b>«Результат K-Means стабилен»</b> — нет, зависит от инициализации. Запускай много раз.</li>
        <li><b>«K-Means не требует масштабирования»</b> — требует обязательно.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: почему K-Means сходится</summary>
        <div class="deep-dive-body">
          <p>Каждая итерация K-Means <b>не увеличивает</b> inertia:</p>
          <ul>
            <li><b>Assignment шаг:</b> каждую точку относим к ближайшему центру — значит сумма расстояний уменьшается или остаётся.</li>
            <li><b>Update шаг:</b> центр = среднее точек — это точка, минимизирующая сумму квадратов расстояний до группы.</li>
          </ul>
          <p>Inertia только падает и ограничена снизу нулём → алгоритм сходится. Но может сойтись к локальному минимуму.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: варианты K-Means</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>Mini-batch K-Means</b> — для очень больших данных: обновление по мини-батчам.</li>
            <li><b>K-Medoids (PAM)</b> — центры = реальные точки, устойчив к выбросам.</li>
            <li><b>K-Modes</b> — для категориальных данных.</li>
            <li><b>Fuzzy C-Means</b> — точки принадлежат нескольким кластерам с весами.</li>
            <li><b>Spherical K-Means</b> — для текстов (косинусное расстояние).</li>
            <li><b>Kernel K-Means</b> — в ядерном пространстве для нелинейных кластеров.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: связь с EM и GMM</summary>
        <div class="deep-dive-body">
          <p>K-Means — это <b>hard версия</b> EM-алгоритма для Gaussian Mixture Model (GMM) с единичной ковариацией.</p>
          <p>GMM моделирует каждый кластер как гауссовское распределение. Assignment — мягкий: точка принадлежит каждому кластеру с некоторой вероятностью. Обновление — максимизация правдоподобия.</p>
          <p>GMM гибче: ловит эллиптические кластеры, разные размеры. Но дороже и сложнее.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>DBSCAN</b> — альтернатива для некруглых кластеров и с шумом.</li>
        <li><b>PCA</b> — часто применяется перед K-Means для снижения размерности.</li>
        <li><b>GMM</b> — мягкое обобщение K-Means.</li>
        <li><b>Hierarchical clustering</b> — даёт дендрограмму, не требует k.</li>
        <li><b>Feature engineering</b> — кластер-номер как новый признак для supervised задачи.</li>
      </ul>
    `,

    examples: [
      {
        title: '2 итерации K-Means на 6 точках',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Пошагово выполнить 2 итерации K-Means (k=2) на 6 точках: шаги Assign и Update.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th></tr>
              <tr><td>A</td><td>1</td><td>1</td></tr>
              <tr><td>B</td><td>1.5</td><td>2</td></tr>
              <tr><td>C</td><td>2</td><td>1</td></tr>
              <tr><td>D</td><td>5</td><td>4</td></tr>
              <tr><td>E</td><td>5</td><td>5</td></tr>
              <tr><td>F</td><td>6</td><td>4</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Начальная инициализация</h4>
            <div class="calc">
              Случайно выбираем начальные центроиды:<br>
              μ₁ = A = (1, 1)<br>
              μ₂ = E = (5, 5)
            </div>
            <div class="why">Плохая инициализация может привести к локальному минимуму. K-Means++ выбирает центры умнее, но здесь покажем базовый вариант.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Итерация 1 — Assign: назначить кластеры</h4>
            <div class="calc">
              d(x, μᵢ) = √((x₁−μᵢ₁)² + (x₂−μᵢ₂)²)<br><br>
              A(1,1): d(μ₁)=0, d(μ₂)=√(16+16)=5.66 → <b>Кластер 1</b><br>
              B(1.5,2): d(μ₁)=√(0.25+1)=1.12, d(μ₂)=√(12.25+9)=4.61 → <b>Кластер 1</b><br>
              C(2,1): d(μ₁)=1.0, d(μ₂)=√(9+16)=5.0 → <b>Кластер 1</b><br>
              D(5,4): d(μ₁)=√(16+9)=5.0, d(μ₂)=√(0+1)=1.0 → <b>Кластер 2</b><br>
              E(5,5): d(μ₁)=√(16+16)=5.66, d(μ₂)=0 → <b>Кластер 2</b><br>
              F(6,4): d(μ₁)=√(25+9)=5.83, d(μ₂)=√(1+1)=1.41 → <b>Кластер 2</b>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Итерация 1 — Update: пересчитать центроиды</h4>
            <div class="calc">
              Кластер 1: {A, B, C}<br>
              μ₁ = ((1+1.5+2)/3, (1+2+1)/3) = (1.5, 1.33)<br><br>
              Кластер 2: {D, E, F}<br>
              μ₂ = ((5+5+6)/3, (4+5+4)/3) = (5.33, 4.33)<br><br>
              Центроиды изменились → нужна следующая итерация
            </div>
          </div>
          <div class="step" data-step="4">
            <h4>Итерация 2 — Assign с новыми центрами</h4>
            <div class="calc">
              μ₁=(1.5, 1.33), μ₂=(5.33, 4.33)<br><br>
              A(1,1): d(μ₁)=√(0.25+0.11)=0.60, d(μ₂)=5.87 → <b>К1</b><br>
              B(1.5,2): d(μ₁)=√(0+0.45)=0.67, d(μ₂)=4.71 → <b>К1</b><br>
              C(2,1): d(μ₁)=√(0.25+0.11)=0.60, d(μ₂)=4.53 → <b>К1</b><br>
              D(5,4): d(μ₁)=4.59, d(μ₂)=√(0.11+0.11)=0.47 → <b>К2</b><br>
              E(5,5): d(μ₁)=4.93, d(μ₂)=√(0.11+0.44)=0.74 → <b>К2</b><br>
              F(6,4): d(μ₁)=5.26, d(μ₂)=√(0.44+0.11)=0.74 → <b>К2</b><br><br>
              Назначения не изменились → <b>сходимость!</b>
            </div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 440 165" xmlns="http://www.w3.org/2000/svg" style="max-width:440px;">
              <text x="220" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">K-Means: 2 итерации на 6 точках (k=2)</text>
              <!-- Left panel: Iteration 1 -->
              <text x="110" y="34" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">Итерация 1</text>
              <!-- Axes left -->
              <line x1="30" y1="42" x2="30" y2="148" stroke="#e2e8f0" stroke-width="1"/>
              <line x1="30" y1="148" x2="210" y2="148" stroke="#e2e8f0" stroke-width="1"/>
              <!-- Scale: x=(coord-0)*26+30, y=148-(coord-0)*18 -->
              <!-- Points: A(1,1),B(1.5,2),C(2,1),D(5,4),E(5,5),F(6,4) -->
              <!-- Left panel (x: *26+30, y: 148-*18) -->
              <!-- Cluster 1 points (blue): A(56,130), B(69,112), C(82,130) -->
              <circle cx="56" cy="130" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="56" y="126" text-anchor="middle" font-size="7" fill="#fff">A</text>
              <circle cx="69" cy="112" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="69" y="108" text-anchor="middle" font-size="7" fill="#fff">B</text>
              <circle cx="82" cy="130" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="82" y="126" text-anchor="middle" font-size="7" fill="#fff">C</text>
              <!-- Cluster 2 points (orange): D(160,76), E(160,58), F(186,76) -->
              <circle cx="160" cy="76" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="160" y="72" text-anchor="middle" font-size="7" fill="#fff">D</text>
              <circle cx="160" cy="58" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="160" y="54" text-anchor="middle" font-size="7" fill="#fff">E</text>
              <circle cx="186" cy="76" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="186" y="72" text-anchor="middle" font-size="7" fill="#fff">F</text>
              <!-- Initial centroids: μ1=A(56,130), μ2=E(160,58) -->
              <circle cx="56" cy="130" r="12" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="4,3"/>
              <text x="44" y="148" font-size="8" fill="#3b82f6">μ₁=A</text>
              <circle cx="160" cy="58" r="12" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="4,3"/>
              <text x="160" y="46" text-anchor="middle" font-size="8" fill="#f59e0b">μ₂=E</text>
              <!-- Arrow between panels -->
              <text x="218" y="95" font-size="20" fill="#64748b">→</text>
              <!-- Right panel: After Update -->
              <text x="330" y="34" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">После обновления μ</text>
              <!-- Axes right -->
              <line x1="245" y1="42" x2="245" y2="148" stroke="#e2e8f0" stroke-width="1"/>
              <line x1="245" y1="148" x2="425" y2="148" stroke="#e2e8f0" stroke-width="1"/>
              <!-- Same points shifted by +215 on x -->
              <circle cx="271" cy="130" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="271" y="126" text-anchor="middle" font-size="7" fill="#fff">A</text>
              <circle cx="284" cy="112" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="284" y="108" text-anchor="middle" font-size="7" fill="#fff">B</text>
              <circle cx="297" cy="130" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="297" y="126" text-anchor="middle" font-size="7" fill="#fff">C</text>
              <circle cx="375" cy="76" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="375" y="72" text-anchor="middle" font-size="7" fill="#fff">D</text>
              <circle cx="375" cy="58" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="375" y="54" text-anchor="middle" font-size="7" fill="#fff">E</text>
              <circle cx="401" cy="76" r="7" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="401" y="72" text-anchor="middle" font-size="7" fill="#fff">F</text>
              <!-- New centroids: μ1=(1.5,1.33)→(69,124), μ2=(5.33,4.33)→(383,70) -->
              <circle cx="284" cy="124" r="9" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5"/>
              <text x="275" y="148" font-size="8" fill="#3b82f6">μ₁'</text>
              <circle cx="383" cy="70" r="9" fill="#f59e0b" stroke="#d97706" stroke-width="2.5"/>
              <text x="396" y="68" font-size="8" fill="#f59e0b">μ₂'</text>
              <!-- Arrows from old to new centroids -->
              <line x1="271" y1="130" x2="282" y2="125" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arr)"/>
              <line x1="375" y1="58" x2="383" y2="71" stroke="#f59e0b" stroke-width="1.5"/>
              <text x="330" y="158" text-anchor="middle" font-size="9" fill="#10b981">Сходимость!</text>
            </svg>
            <div class="caption">Слева: исходные центроиды μ₁=A(1,1), μ₂=E(5,5). Справа: после Assign+Update центроиды сдвинулись к центрам кластеров. Итерация 2 — назначения не меняются → сходимость.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>K-Means сошёлся за 2 итерации. Кластер 1: {A, B, C} с центром (1.5, 1.33). Кластер 2: {D, E, F} с центром (5.33, 4.33). Inertia = сумма квадратов расстояний до центров ≈ 3.1.</p>
          </div>
          <div class="lesson-box">
            K-Means гарантирует сходимость, но не к глобальному минимуму. Запускайте несколько раз (n_init=10 в sklearn) с разными инициализациями и выбирайте запуск с минимальной inertia.
          </div>
        `,
      },
      {
        title: 'Elbow Method: выбор k',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Вычислить inertia для k=1..5 и найти «локоть» — оптимальное k.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>k</th><th>Inertia</th><th>Δ Inertia</th><th>% снижения</th></tr>
              <tr><td>1</td><td>120.0</td><td>—</td><td>—</td></tr>
              <tr><td>2</td><td>38.5</td><td>81.5</td><td>67.9%</td></tr>
              <tr><td>3</td><td>15.2</td><td>23.3</td><td>60.5%</td></tr>
              <tr><td>4</td><td>11.8</td><td>3.4</td><td>22.4%</td></tr>
              <tr><td>5</td><td>10.2</td><td>1.6</td><td>13.6%</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что такое inertia</h4>
            <div class="calc">
              Inertia = Σᵢ Σₓ∈Cᵢ ‖x − μᵢ‖²<br>
              Сумма квадратов расстояний от каждой точки до своего центроида<br><br>
              k=1: один центр = среднее всех данных → большая inertia<br>
              k=n: каждая точка = свой кластер → inertia = 0
            </div>
            <div class="why">Inertia всегда убывает с ростом k, поэтому нельзя просто минимизировать её — нужен «локоть».</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: найти «локоть»</h4>
            <div class="calc">
              k=1→2: Δ=81.5 (67.9% снижения) — огромный выигрыш<br>
              k=2→3: Δ=23.3 (60.5%) — ещё значительный выигрыш<br>
              k=3→4: Δ=3.4 (22.4%) — резкое замедление<br>
              k=4→5: Δ=1.6 (13.6%) — почти не меняется<br><br>
              «Локоть» — между k=3 и k=4<br>
              Оптимальное k = <b>3</b>
            </div>
            <div class="why">Резкое замедление снижения inertia означает: добавление ещё одного кластера не даёт существенного улучшения.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: альтернативный критерий — Silhouette Score</h4>
            <div class="calc">
              s(i) = (b(i) − a(i)) / max(a(i), b(i))<br>
              a(i) = среднее расстояние до точек своего кластера<br>
              b(i) = среднее расстояние до точек ближайшего чужого кластера<br><br>
              s ∈ [−1, 1]: ближе к 1 — лучше<br>
              Silhouette Score для k=2: 0.72<br>
              Для k=3: 0.68<br>
              Для k=4: 0.51<br>
              По Silhouette: k=2 лучше, но по elbow — k=3
            </div>
            <div class="why">Разные метрики могут давать разные ответы. Используй оба критерия + доменные знания.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>По elbow method: оптимальное k=3 (локоть на переходе 3→4). Inertia снижается с 120 до 15 при k=3, дальше слабо. Итоговый выбор = k=3 с учётом бизнес-смысла.</p>
          </div>
          <div class="lesson-box">
            Другие критерии: BIC (байесовский информационный критерий), Gap statistic, Davies-Bouldin index. На практике: elbow + silhouette + понимание данных. Идеального автоматического способа нет.
          </div>
        `,
      },
      {
        title: 'Плохая инициализация и K-Means++',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как плохая инициализация центроидов ведёт к субоптимальному результату, и как K-Means++ это исправляет.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th><th>Истинный кластер</th></tr>
              <tr><td>A</td><td>1</td><td>1</td><td>Левый</td></tr>
              <tr><td>B</td><td>2</td><td>1</td><td>Левый</td></tr>
              <tr><td>C</td><td>1.5</td><td>2</td><td>Левый</td></tr>
              <tr><td>D</td><td>8</td><td>8</td><td>Правый</td></tr>
              <tr><td>E</td><td>9</td><td>8</td><td>Правый</td></tr>
              <tr><td>F</td><td>8.5</td><td>9</td><td>Правый</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: плохая инициализация — оба центра в одной группе</h4>
            <div class="calc">
              Инициализация: μ₁=A=(1,1), μ₂=B=(2,1) — оба в левой группе!<br><br>
              Итерация 1 — Assign:<br>
              A: ближе к μ₁ → К1<br>
              B: ближе к μ₂ → К2<br>
              C: к μ₁ (d=1.12) vs μ₂ (d=1.12) — ничья → К1 (например)<br>
              D,E,F: ближе к μ₂ (расстояния ~7) vs μ₁ (~9.9) → К2<br><br>
              K1={A,C}, K2={B,D,E,F} — неверная кластеризация!
            </div>
            <div class="why">Оба центра стартовали близко → один кластер захватит дальние точки. Inertia будет высокой.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: K-Means++ выбирает умные начальные центры</h4>
            <div class="calc">
              1. Первый центр μ₁: случайно = A(1,1)<br><br>
              2. Расстояния до μ₁:<br>
                 A: 0², B: 1², C: 1.56², D: 9.90², E: 10.63², F: 10.37²<br>
                 Суммы: 0+1+2.43+98.01+113.0+107.5 = 321.9<br><br>
              3. Вероятность выбора:<br>
                 P(D) = 98.01/321.9 ≈ 0.305 — наибольшая!<br>
                 P(E) = 113.0/321.9 ≈ 0.351 — ещё больше<br>
                 P(A) = 0 (уже выбрана)<br><br>
              4. Второй центр μ₂: выбираем E(9,8) с P≈0.35<br>
              5. Результат: центры A(1,1) и E(9,8) — далеко друг от друга
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: K-Means++ даёт правильный результат</h4>
            <div class="calc">
              μ₁=(1,1), μ₂=(9,8)<br><br>
              Assign: A,B,C → К1 (расстояния 1-2 vs 10+)<br>
              D,E,F → К2 (расстояния 1-2 vs 10+)<br><br>
              После одного Update: μ₁=(1.5, 1.33), μ₂=(8.5, 8.33)<br>
              Assign снова: не изменилось → сходимость!<br><br>
              Inertia = 3.43 (vs ~50 при плохой инициализации)
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Плохая инициализация: Inertia ≈ 50, неверная кластеризация. K-Means++: Inertia ≈ 3.4, идеальная кластеризация. K-Means++ используется по умолчанию (init='k-means++' в sklearn).</p>
          </div>
          <div class="lesson-box">
            K-Means++ гарантирует O(log k)-приближение к оптимуму. На практике: запускать n_init раз (default=10) и брать лучший результат по inertia. Это почти всегда даёт хороший результат без сложной ручной инициализации.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: шаги K-Means</h3>
        <p>Нажимай "Шаг" и смотри, как центроиды двигаются. Меняй k и перегенерируй.</p>
        <div class="sim-container">
          <div class="sim-controls" id="km-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="km-step">▶ Шаг</button>
            <button class="btn" id="km-run">⏩ До сходимости</button>
            <button class="btn secondary" id="km-reset">↺ Сбросить центры</button>
            <button class="btn secondary" id="km-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="km-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="km-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#km-controls');
        const cK = App.makeControl('range', 'km-k', 'k (кластеров)', { min: 2, max: 8, step: 1, value: 3 });
        const cNclusters = App.makeControl('range', 'km-nc', 'Истинных кластеров', { min: 2, max: 6, step: 1, value: 3 });
        const cN = App.makeControl('range', 'km-n', 'Точек на кластер', { min: 20, max: 100, step: 5, value: 40 });
        const cSpread = App.makeControl('range', 'km-spread', 'Разброс', { min: 0.02, max: 0.15, step: 0.01, value: 0.07 });
        [cK, cNclusters, cN, cSpread].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#km-canvas');
        const ctx = canvas.getContext('2d');
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
        let points = [];
        let centroids = [];
        let iter = 0;

        function regen() {
          const nc = +cNclusters.input.value;
          const nPer = +cN.input.value;
          const spread = +cSpread.input.value;
          points = [];
          const centers = [];
          for (let c = 0; c < nc; c++) {
            centers.push([0.2 + 0.6 * Math.random(), 0.2 + 0.6 * Math.random()]);
          }
          centers.forEach(ctr => {
            for (let i = 0; i < nPer; i++) {
              points.push({ x: ctr[0] + App.Util.randn(0, spread), y: ctr[1] + App.Util.randn(0, spread), cls: -1 });
            }
          });
          resetCentroids();
        }

        function resetCentroids() {
          const k = +cK.input.value;
          centroids = [];
          // K-Means++
          centroids.push({ ...points[Math.floor(Math.random() * points.length)] });
          for (let c = 1; c < k; c++) {
            const dists = points.map(p => {
              let m = Infinity;
              centroids.forEach(ctr => {
                const d = (p.x - ctr.x) ** 2 + (p.y - ctr.y) ** 2;
                if (d < m) m = d;
              });
              return m;
            });
            const sum = dists.reduce((a, b) => a + b, 0);
            let r = Math.random() * sum;
            for (let i = 0; i < dists.length; i++) {
              r -= dists[i];
              if (r <= 0) { centroids.push({ x: points[i].x, y: points[i].y }); break; }
            }
          }
          iter = 0;
          assign();
          draw();
        }

        function assign() {
          points.forEach(p => {
            let best = 0, bestD = Infinity;
            centroids.forEach((c, i) => {
              const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
              if (d < bestD) { bestD = d; best = i; }
            });
            p.cls = best;
          });
        }

        function update() {
          let moved = 0;
          centroids.forEach((c, i) => {
            const cluster = points.filter(p => p.cls === i);
            if (cluster.length === 0) return;
            const nx = App.Util.mean(cluster.map(p => p.x));
            const ny = App.Util.mean(cluster.map(p => p.y));
            moved += Math.abs(nx - c.x) + Math.abs(ny - c.y);
            c.x = nx; c.y = ny;
          });
          return moved;
        }

        function step() {
          update();
          assign();
          iter++;
          draw();
        }

        function runToConverge() {
          for (let i = 0; i < 50; i++) {
            const m = update();
            assign();
            iter++;
            if (m < 1e-5) break;
          }
          draw();
        }

        function computeInertia() {
          let sum = 0;
          points.forEach(p => {
            const c = centroids[p.cls];
            sum += (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
          });
          return sum;
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          // фон — заливка по центрам (Voronoi-like)
          const step = 10;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              let best = 0, bestD = Infinity;
              centroids.forEach((c, i) => {
                const d = (px / W - c.x) ** 2 + (py / H - c.y) ** 2;
                if (d < bestD) { bestD = d; best = i; }
              });
              ctx.fillStyle = colors[best] + '22';
              ctx.fillRect(px, py, step, step);
            }
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = colors[p.cls] || '#94a3b8';
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 3.5, 0, 2 * Math.PI);
            ctx.fill();
          });
          // центроиды
          centroids.forEach((c, i) => {
            ctx.fillStyle = colors[i];
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(c.x * W, c.y * H, 11, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i + 1, c.x * W, c.y * H);
          });

          container.querySelector('#km-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Итераций</div><div class="stat-value">${iter}</div></div>
            <div class="stat-card"><div class="stat-label">k</div><div class="stat-value">${centroids.length}</div></div>
            <div class="stat-card"><div class="stat-label">Inertia</div><div class="stat-value">${App.Util.round(computeInertia(), 3)}</div></div>
            <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${points.length}</div></div>
          `;
        }

        cK.input.addEventListener('input', resetCentroids);
        [cNclusters, cN, cSpread].forEach(c => c.input.addEventListener('change', regen));
        container.querySelector('#km-step').onclick = step;
        container.querySelector('#km-run').onclick = runToConverge;
        container.querySelector('#km-reset').onclick = resetCentroids;
        container.querySelector('#km-regen').onclick = regen;

        setTimeout(() => { regen(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    python: `
      <h3>Python: K-Means кластеризация</h3>
      <p>sklearn.KMeans прост и быстр. Метод локтя и silhouette_score помогают выбрать оптимальное число кластеров.</p>

      <h4>1. KMeans и визуализация кластеров</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# Генерируем 4 кластера в 2D
X, y_true = make_blobs(n_samples=400, centers=4, cluster_std=0.8, random_state=42)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=4, n_init=10, random_state=42)
labels = kmeans.fit_predict(X_scaled)

# Визуализация
colors = ['tab:blue', 'tab:orange', 'tab:green', 'tab:red']
for k in range(4):
    mask = labels == k
    plt.scatter(X_scaled[mask, 0], X_scaled[mask, 1], s=30, alpha=0.6, label=f'Кластер {k}')
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
            s=200, c='black', marker='x', linewidths=2, label='Центроиды')
plt.title(f'K-Means (k=4), inertia={kmeans.inertia_:.1f}')
plt.legend()
plt.show()

print(f'Silhouette Score: {silhouette_score(X_scaled, labels):.4f}')</code></pre>

      <h4>2. Метод локтя и silhouette для выбора k</h4>
      <pre><code>k_range = range(2, 11)
inertias = []
silhouettes = []

for k in k_range:
    km = KMeans(n_clusters=k, n_init=10, random_state=42)
    labels_k = km.fit_predict(X_scaled)
    inertias.append(km.inertia_)
    silhouettes.append(silhouette_score(X_scaled, labels_k))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# Метод локтя
ax1.plot(k_range, inertias, 'o-')
ax1.set_xlabel('k')
ax1.set_ylabel('Inertia (WCSS)')
ax1.set_title('Метод локтя')

# Silhouette
ax2.plot(k_range, silhouettes, 's-', color='orange')
ax2.axvline(4, color='red', linestyle='--', label='Оптимум')
ax2.set_xlabel('k')
ax2.set_ylabel('Silhouette Score')
ax2.set_title('Silhouette Score')
ax2.legend()

plt.tight_layout()
plt.show()
print(f'Лучшее k по silhouette: {k_range[silhouettes.index(max(silhouettes))]}')</code></pre>

      <h4>3. K-Means для сегментации клиентов (RFM)</h4>
      <pre><code>import pandas as pd

# Синтетические RFM данные (Recency, Frequency, Monetary)
np.random.seed(42)
n = 500
rfm = pd.DataFrame({
    'Recency':   np.random.exponential(30, n).astype(int) + 1,   # дней с последней покупки
    'Frequency': np.random.poisson(5, n) + 1,                     # число покупок
    'Monetary':  np.random.exponential(1000, n) + 50,             # сумма покупок
})

# Нормализация
rfm_scaled = StandardScaler().fit_transform(rfm)

# K-Means с k=4 сегментами
km_rfm = KMeans(n_clusters=4, n_init=20, random_state=42)
rfm['Сегмент'] = km_rfm.fit_predict(rfm_scaled)

# Профиль каждого сегмента
profile = rfm.groupby('Сегмент').agg({
    'Recency': 'mean', 'Frequency': 'mean', 'Monetary': 'mean', 'Сегмент': 'count'
}).rename(columns={'Сегмент': 'Размер'}).round(1)
print(profile)

# Scatter plot: Frequency vs Monetary
plt.scatter(rfm['Frequency'], rfm['Monetary'],
            c=rfm['Сегмент'], cmap='tab10', alpha=0.5)
plt.xlabel('Frequency')
plt.ylabel('Monetary')
plt.title('RFM-сегментация клиентов')
plt.colorbar(label='Сегмент')
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Сегментация клиентов</b> — RFM-анализ, маркетинг.</li>
        <li><b>Сжатие изображений</b> — квантизация цветов.</li>
        <li><b>Анализ документов</b> — тематическая группировка.</li>
        <li><b>Anomaly detection</b> — точки далеко от всех центроидов.</li>
        <li><b>Preprocessing</b> — кластер-фичи как признаки для supervised.</li>
        <li><b>Vector quantization</b> — в speech и image processing.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Простой и быстрый O(n·k·d·T)</li>
            <li>Масштабируется на большие данные</li>
            <li>Хорошо работает на сферических кластерах</li>
            <li>Интерпретируемые центроиды</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Нужно знать k заранее</li>
            <li>Чувствителен к инициализации</li>
            <li>Плохо для некруглых кластеров</li>
            <li>Чувствителен к выбросам и масштабу</li>
            <li>Кластеры должны быть похожего размера</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Оптимизация</h3>
      <p>Минимизируем:</p>
      <div class="math-block">$$J(C, \\mu) = \\sum_{i=1}^{n} \\|x_i - \\mu_{c(i)}\\|^2$$</div>

      <h3>Итеративные обновления</h3>
      <p><b>Assignment step:</b></p>
      <div class="math-block">$$c(i) = \\arg\\min_{k} \\|x_i - \\mu_k\\|^2$$</div>

      <p><b>Update step:</b></p>
      <div class="math-block">$$\\mu_k = \\frac{1}{|C_k|} \\sum_{i \\in C_k} x_i$$</div>

      <h3>Сходимость</h3>
      <p>Каждый шаг не увеличивает J, J ≥ 0 → алгоритм сходится за конечное число итераций. Но может сойтись к локальному минимуму.</p>

      <h3>Silhouette score</h3>
      <div class="math-block">$$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$$</div>
      <p>где $a(i)$ — среднее расстояние до точек своего кластера, $b(i)$ — до ближайшего чужого. $s \\in [-1, 1]$, чем выше — тем лучше.</p>

      <h3>Связь с EM для GMM</h3>
      <p>K-Means — это hard version EM для гауссовой смеси с единичной ковариацией и одинаковыми весами.</p>
    `,

    extra: `
      <h3>Варианты K-Means</h3>
      <ul>
        <li><b>Mini-batch K-Means</b> — для очень больших данных, обновление по мини-батчам.</li>
        <li><b>K-Medoids (PAM)</b> — центроид = реальная точка, устойчив к выбросам.</li>
        <li><b>K-Modes</b> — для категориальных данных, использует моду.</li>
        <li><b>Fuzzy C-Means</b> — мягкая принадлежность к кластерам.</li>
        <li><b>Spherical K-Means</b> — для текстов (косинусное расстояние).</li>
      </ul>

      <h3>Альтернативы</h3>
      <ul>
        <li><b>DBSCAN</b> — плотностная, находит кластеры любой формы, автоматически определяет k, отмечает шум.</li>
        <li><b>Hierarchical (Agglomerative)</b> — строит дендрограмму, не нужен k.</li>
        <li><b>GMM</b> — гибче (эллипсы), выдаёт вероятности.</li>
        <li><b>Spectral clustering</b> — для кластеров сложной топологии.</li>
      </ul>

      <h3>Когда что использовать</h3>
      <table>
        <tr><th>Данные</th><th>Алгоритм</th></tr>
        <tr><td>Круглые кластеры, известно k</td><td>K-Means</td></tr>
        <tr><td>Шум, сложные формы</td><td>DBSCAN</td></tr>
        <tr><td>Иерархия важна</td><td>Agglomerative</td></tr>
        <tr><td>Эллиптические, вероятности</td><td>GMM</td></tr>
      </table>

      <h3>Масштабирование</h3>
      <p>K-Means использует евклидово расстояние — признаки с большим диапазоном доминируют. <b>Всегда скейли признаки</b> (StandardScaler).</p>
    `,
  },
});
