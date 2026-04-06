/* ==========================================================================
   PCA
   ========================================================================== */
App.registerTopic({
  id: 'pca',
  category: 'ml',
  title: 'PCA (метод главных компонент)',
  summary: 'Снижение размерности с сохранением максимальной дисперсии.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты фотографируешь скамейку в парке. Самый информативный ракурс — <b>вдоль</b> скамейки (видна вся длина). Снимешь сбоку — увидишь только сиденье. Снимешь сверху — только прямоугольник. Разные ракурсы показывают разное количество информации.</p>
        <p>PCA ищет «главный ракурс» для твоих данных. Данные — это облако точек в многомерном пространстве. Одни направления показывают много вариативности (точки разлетаются сильно), другие — мало (точки близки). PCA находит <b>самые информативные направления</b> и выражает данные именно через них.</p>
        <p>Результат: ты можешь описать данные меньшим числом «главных» осей и всё равно сохранить почти всю информацию. Это <b>снижение размерности</b> без большой потери.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">PCA: главные оси облака данных</text>
          <!-- Background -->
          <rect x="30" y="25" width="440" height="160" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <!-- Data point cloud (elliptical, tilted) -->
          <ellipse cx="250" cy="110" rx="130" ry="45" transform="rotate(-35 250 110)" fill="#e0e7ff" opacity="0.5"/>
          <!-- Individual scatter points -->
          <circle cx="160" cy="148" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="185" cy="138" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="200" cy="130" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="218" cy="122" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="235" cy="112" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="248" cy="106" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="262" cy="98" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="278" cy="88" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="295" cy="79" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="315" cy="68" r="4" fill="#6366f1" opacity="0.7"/>
          <circle cx="330" cy="58" r="4" fill="#6366f1" opacity="0.7"/>
          <!-- Noisy scatter around line -->
          <circle cx="175" cy="155" r="4" fill="#818cf8" opacity="0.6"/>
          <circle cx="220" cy="115" r="4" fill="#818cf8" opacity="0.6"/>
          <circle cx="195" cy="125" r="4" fill="#818cf8" opacity="0.6"/>
          <circle cx="255" cy="118" r="4" fill="#818cf8" opacity="0.6"/>
          <circle cx="270" cy="80" r="4" fill="#818cf8" opacity="0.6"/>
          <circle cx="305" cy="62" r="4" fill="#818cf8" opacity="0.6"/>
          <circle cx="320" cy="73" r="4" fill="#818cf8" opacity="0.6"/>
          <!-- PC1: long arrow along main direction -->
          <line x1="140" y1="162" x2="355" y2="48" stroke="#6366f1" stroke-width="3" marker-end="url(#pc_arr1)"/>
          <text x="360" y="42" font-size="11" font-weight="700" fill="#6366f1">PC1</text>
          <text x="355" y="54" font-size="9" fill="#6366f1">(макс. дисперсия)</text>
          <!-- PC2: short arrow perpendicular -->
          <line x1="250" y1="108" x2="220" y2="70" stroke="#f59e0b" stroke-width="2" marker-end="url(#pc_arr2)"/>
          <text x="200" y="65" font-size="11" font-weight="700" fill="#d97706">PC2</text>
          <text x="200" y="78" font-size="9" fill="#d97706">(мин. дисперсия)</text>
          <!-- Markers -->
          <defs>
            <marker id="pc_arr1" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#6366f1"/>
            </marker>
            <marker id="pc_arr2" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#f59e0b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">PCA находит главные оси облака данных: PC1 (синяя) — направление максимального разброса, PC2 (жёлтая) — перпендикулярное, с меньшим разбросом. Проекция на PC1 сохраняет большую часть информации.</div>
      </div>

      <h3>📊 Зачем снижать размерность</h3>
      <p>Когда у нас много признаков (100, 1000, 10000), возникают проблемы:</p>
      <ul>
        <li><b>Проклятие размерности</b> — все алгоритмы работают хуже.</li>
        <li><b>Визуализация невозможна</b> — человек не видит 10D.</li>
        <li><b>Коррелированные признаки</b> — избыточность, шум.</li>
        <li><b>Вычислительные затраты</b> — обучение медленное.</li>
      </ul>
      <p>Идея: многие признаки содержат <b>одинаковую</b> информацию. Можно найти «главные» направления и выразить данные через них.</p>

      <h3>🔍 Главные компоненты — что это</h3>
      <p><span class="term" data-tip="Principal Components. Главные компоненты — новые оси (линейные комбинации исходных признаков), которые упорядочены по убыванию дисперсии данных вдоль них.">Главные компоненты</span> — это новые оси в пространстве признаков, построенные так:</p>
      <ul>
        <li><b>Первая главная компонента (PC1)</b> — направление, вдоль которого <b>разброс данных максимален</b>.</li>
        <li><b>Вторая (PC2)</b> — <b>ортогональна</b> первой и имеет следующий максимальный разброс.</li>
        <li>И так далее.</li>
      </ul>
      <p>Главные компоненты — это линейные комбинации исходных признаков. Например, PC1 может быть «0.7 · рост + 0.5 · вес − 0.3 · возраст».</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>PCA находит такой <b>поворот</b> системы координат, при котором данные вытянуты вдоль осей. Эти новые оси — главные компоненты. Если оставить первые k компонент (с максимальной дисперсией) и отбросить остальные — получим сжатие с минимальной потерей информации.</p>
      </div>

      <h3>🌐 Геометрическая интуиция</h3>
      <p>Представь облако точек в 2D, вытянутое по диагонали:</p>
      <ul>
        <li>Первая главная компонента — <b>ось вдоль вытянутости</b>. Вдоль неё точки разлетаются сильно.</li>
        <li>Вторая компонента — <b>перпендикулярно</b>. Вдоль неё разлёт минимальный.</li>
      </ul>
      <p>Если «сжать» облако по второй оси (игнорировать PC2) — точки сольются в линию, но потеряем мало: облако и так было тонким в этом направлении.</p>
      <p>В высоких размерностях то же самое: ищем, в каких направлениях облако «вытянуто», сохраняем именно их.</p>

      <h3>🧮 Как вычисляется PCA</h3>
      <p>Математически — через <b>собственные векторы ковариационной матрицы</b>:</p>
      <ol>
        <li><b>Центрирование:</b> вычитаем среднее из каждого признака. $X \\gets X - \\bar{X}$.</li>
        <li><b>Ковариационная матрица:</b> $\\Sigma = \\frac{1}{n-1} X^T X$.</li>
        <li><b>Eigendecomposition:</b> находим собственные векторы и значения $\\Sigma$.</li>
        <li><b>Собственные векторы</b> = главные компоненты (направления).</li>
        <li><b>Собственные значения</b> = дисперсии вдоль этих направлений.</li>
        <li>Сортируем по убыванию eigenvalue, берём первые k.</li>
      </ol>

      <p>На практике чаще используют <span class="term" data-tip="Singular Value Decomposition. Разложение матрицы в произведение трёх матриц: X = UΣV^T. Даёт PCA через столбцы V без явного построения ковариационной матрицы.">SVD-разложение</span> — оно численно устойчивее.</p>

      <h3>📐 Explained variance — сколько информации сохранили</h3>
      <p>Eigenvalue $\\lambda_i$ — это <b>дисперсия</b> данных вдоль i-й компоненты. Доля объяснённой дисперсии:</p>
      <div class="math-block">$$\\text{EVR}_i = \\frac{\\lambda_i}{\\sum_j \\lambda_j}$$</div>

      <p>Сумма по первым k компонентам — общая доля сохранённой информации.</p>

      <p><b>Пример:</b> eigenvalues = [5, 3, 1, 0.5, 0.3]. Всего = 9.8.</p>
      <ul>
        <li>PC1: 51% дисперсии.</li>
        <li>PC1 + PC2: 82%.</li>
        <li>PC1 + PC2 + PC3: 92%.</li>
      </ul>
      <p>Оставляя 3 компоненты вместо 5, сохраняем 92% информации.</p>

      <h3>🎯 Как выбрать k</h3>
      <ul>
        <li><b>Explained variance ≥ 95%</b> — стандартное правило.</li>
        <li><b>Scree plot</b> — график eigenvalues, ищем «локоть».</li>
        <li><b>Kaiser rule</b> — оставить компоненты с $\\lambda > 1$ (после стандартизации).</li>
        <li><b>CV</b> — если PCA часть ML pipeline, подбор через качество модели.</li>
      </ul>

      <h3>⚠️ Стандартизация обязательна</h3>
      <p>PCA максимизирует дисперсию. Если один признак в сантиметрах (1-100), другой в метрах (0.01-1), первый будет доминировать просто из-за масштаба.</p>
      <p><b>Перед PCA всегда</b> применяй StandardScaler (среднее=0, std=1). Иначе результат будет бессмысленным.</p>

      <h3>🔧 Применения PCA</h3>
      <ul>
        <li><b>Визуализация</b> многомерных данных в 2D/3D — главное применение.</li>
        <li><b>Сжатие</b> — изображения, embedding.</li>
        <li><b>Денойзинг</b> — малые компоненты обычно содержат шум, их отбрасывание очищает данные.</li>
        <li><b>Предобработка для ML</b> — ускорение, декорреляция признаков.</li>
        <li><b>Eigenfaces</b> — классический метод распознавания лиц.</li>
        <li><b>Finance</b> — факторный анализ рынков.</li>
        <li><b>Genomics</b> — анализ экспрессии генов.</li>
      </ul>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Математически строгий и понятный.</li>
        <li>Детерминированный (без рандома).</li>
        <li>Быстрый через SVD.</li>
        <li>Декоррелирует признаки.</li>
        <li>Работает как шумоподавление.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Линейный метод</b> — не ловит нелинейные структуры.</li>
        <li>Чувствителен к масштабу (нужна стандартизация).</li>
        <li>Главные компоненты — <b>комбинации</b> исходных признаков, сложно интерпретировать.</li>
        <li><b>Unsupervised</b> — не учитывает таргет. Максимизирует дисперсию, не разделимость классов.</li>
        <li>Чувствителен к выбросам.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«PCA улучшает модели»</b> — не всегда. Иногда информация в «малых» компонентах важна.</li>
        <li><b>«PC1 — самый важный признак»</b> — нет. PC1 — направление максимальной дисперсии. Это может быть шум.</li>
        <li><b>«PCA работает на категориальных данных»</b> — нет. Только на числовых. Для категорий — MCA.</li>
        <li><b>«Можно не центрировать»</b> — обязательно центрировать, иначе результат неверный.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: PCA через SVD</summary>
        <div class="deep-dive-body">
          <p>На практике чаще используют SVD-разложение:</p>
          <div class="math-block">$$X = U \\Sigma V^T$$</div>
          <p>где $U, V$ — ортогональные матрицы, $\\Sigma$ — диагональная с сингулярными значениями.</p>
          <p>Тогда главные компоненты = столбцы $V$. Eigenvalues: $\\lambda_i = \\sigma_i^2 / (n-1)$.</p>
          <p>SVD численно устойчивее и работает для разреженных матриц. Именно его использует sklearn под капотом.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: нелинейные альтернативы</summary>
        <div class="deep-dive-body">
          <p>PCA — линейный. Для нелинейных структур есть альтернативы:</p>
          <ul>
            <li><b>Kernel PCA</b> — PCA в ядерном пространстве.</li>
            <li><b>t-SNE</b> — для визуализации, сохраняет локальную структуру.</li>
            <li><b>UMAP</b> — быстрее t-SNE, сохраняет и локальную, и глобальную.</li>
            <li><b>Autoencoder</b> — нелинейный PCA через нейросеть.</li>
            <li><b>Isomap, LLE</b> — manifold learning методы.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: PCA vs LDA vs t-SNE</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>PCA:</b> unsupervised, максимизирует дисперсию. Для снижения размерности и визуализации.</li>
            <li><b>LDA (Linear Discriminant Analysis):</b> supervised, максимизирует разделимость классов. Лучше для классификации.</li>
            <li><b>t-SNE / UMAP:</b> нелинейные, только для визуализации. Не используй их для ML (не сохраняют расстояния глобально).</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Корреляция</b> — PCA использует ковариационную матрицу.</li>
        <li><b>Регуляризация</b> — PCA это другой способ уменьшить сложность модели.</li>
        <li><b>K-Means</b> — PCA часто применяется перед кластеризацией.</li>
        <li><b>Нейросети</b> — autoencoder это нелинейный PCA.</li>
        <li><b>SVD</b> — основной алгоритм вычисления PCA.</li>
      </ul>
    `,

    examples: [
      {
        title: 'PCA на 5 точках в 2D: полный расчёт',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Пошагово выполнить PCA на 5 точках: центрировать, вычислить матрицу ковариаций, найти собственные векторы и спроецировать данные.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th></tr>
              <tr><td>P1</td><td>2</td><td>2</td></tr>
              <tr><td>P2</td><td>3</td><td>4</td></tr>
              <tr><td>P3</td><td>4</td><td>4</td></tr>
              <tr><td>P4</td><td>5</td><td>6</td></tr>
              <tr><td>P5</td><td>6</td><td>4</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: центрировать данные (вычесть среднее)</h4>
            <div class="calc">
              x̄₁ = (2+3+4+5+6)/5 = 20/5 = <b>4.0</b><br>
              x̄₂ = (2+4+4+6+4)/5 = 20/5 = <b>4.0</b><br><br>
              Центрированные точки (xᵢ − x̄):<br>
              P1: (2−4, 2−4) = (−2, −2)<br>
              P2: (3−4, 4−4) = (−1, 0)<br>
              P3: (4−4, 4−4) = (0, 0)<br>
              P4: (5−4, 6−4) = (+1, +2)<br>
              P5: (6−4, 4−4) = (+2, 0)
            </div>
            <div class="why">Центрирование обязательно: PCA ищет направления максимальной дисперсии относительно центра. Без него получим неправильные компоненты.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: матрица ковариаций</h4>
            <div class="calc">
              C = (1/(n−1)) · Xᵀ · X, где X — центрированная матрица<br><br>
              C₁₁ = Var(x₁) = (4+1+0+1+4)/4 = 10/4 = <b>2.5</b><br>
              C₂₂ = Var(x₂) = (4+0+0+4+0)/4 = 8/4 = <b>2.0</b><br>
              C₁₂ = Cov(x₁,x₂) = [(−2)(−2)+(−1)(0)+(0)(0)+(1)(2)+(2)(0)]/4<br>
              = [4+0+0+2+0]/4 = 6/4 = <b>1.5</b><br><br>
              C = [[2.5, 1.5],<br>
                   [1.5, 2.0]]
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: собственные значения и векторы</h4>
            <div class="calc">
              det(C − λI) = 0<br>
              (2.5−λ)(2.0−λ) − 1.5² = 0<br>
              λ² − 4.5λ + (5.0 − 2.25) = 0<br>
              λ² − 4.5λ + 2.75 = 0<br><br>
              λ = (4.5 ± √(20.25 − 11)) / 2 = (4.5 ± √9.25) / 2<br>
              λ₁ = (4.5 + 3.04) / 2 = <b>3.77</b><br>
              λ₂ = (4.5 − 3.04) / 2 = <b>0.73</b><br><br>
              Собственный вектор для λ₁=3.77:<br>
              (C − λ₁I)v = 0 → (2.5−3.77)v₁ + 1.5·v₂ = 0<br>
              −1.27v₁ + 1.5v₂ = 0 → v₁/v₂ = 1.5/1.27 ≈ 1.18<br>
              PC1 ≈ [0.76, 0.64] (нормировано)
            </div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: проекции на PC1</h4>
            <div class="calc">
              z = X · PC1 (скалярное произведение)<br>
              PC1 = [0.76, 0.64]<br><br>
              P1: (−2)·0.76 + (−2)·0.64 = −1.52 − 1.28 = <b>−2.80</b><br>
              P2: (−1)·0.76 + (0)·0.64 = <b>−0.76</b><br>
              P3: 0 · 0.76 + 0 · 0.64 = <b>0.00</b><br>
              P4: 1·0.76 + 2·0.64 = 0.76 + 1.28 = <b>2.04</b><br>
              P5: 2·0.76 + 0·0.64 = <b>1.52</b>
            </div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 420 165" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">PCA: 5 точек, PC1 и PC2</text>
              <!-- Axes -->
              <line x1="50" y1="20" x2="50" y2="145" stroke="#64748b" stroke-width="1.5"/>
              <line x1="50" y1="145" x2="390" y2="145" stroke="#64748b" stroke-width="1.5"/>
              <text x="390" y="157" font-size="9" fill="#64748b">x₁</text>
              <text x="36" y="16" font-size="9" fill="#64748b">x₂</text>
              <!-- Scale: x1=2..6 → x=50+(x1-1)*62; x2=2..6 → y=145-(x2-1)*27 -->
              <!-- P1(2,2)→(112,118), P2(3,4)→(174,64), P3(4,4)→(236,64), P4(5,6)→(298,10), P5(6,4)→(360,64) -->
              <!-- Center mark (mean at 4,4 → (236,64)) -->
              <circle cx="236" cy="64" r="4" fill="#64748b" opacity="0.4"/>
              <text x="245" y="60" font-size="8" fill="#64748b">x̄=(4,4)</text>
              <!-- Grid lines light -->
              <line x1="50" y1="118" x2="390" y2="118" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="50" y1="64" x2="390" y2="64" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="112" y1="20" x2="112" y2="145" stroke="#f1f5f9" stroke-width="1"/>
              <line x1="236" y1="20" x2="236" y2="145" stroke="#f1f5f9" stroke-width="1"/>
              <!-- Data points -->
              <circle cx="112" cy="118" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="100" y="115" font-size="9" fill="#3b82f6">P1</text>
              <circle cx="174" cy="64" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="162" y="61" font-size="9" fill="#3b82f6">P2</text>
              <circle cx="236" cy="64" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="240" y="61" font-size="9" fill="#3b82f6">P3</text>
              <circle cx="298" cy="10" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="302" y="10" font-size="9" fill="#3b82f6">P4</text>
              <circle cx="360" cy="64" r="7" fill="#3b82f6" stroke="#fff" stroke-width="1.5"/>
              <text x="364" y="61" font-size="9" fill="#3b82f6">P5</text>
              <!-- PC1 direction: (0.76, 0.64) from center → arrow from (236,64) in direction (0.76,-0.64)*90 -->
              <!-- PC1 end: (236+0.76*90, 64-0.64*90) = (304, 6) -->
              <!-- PC1 start: (236-0.76*90, 64+0.64*90) = (168, 122) -->
              <line x1="130" y1="128" x2="340" y2="22" stroke="#ef4444" stroke-width="2.5"/>
              <text x="345" y="20" font-size="10" font-weight="600" fill="#ef4444">PC1</text>
              <text x="348" y="30" font-size="8" fill="#ef4444">83.8%</text>
              <!-- PC2 direction: perpendicular to PC1 → (-0.64, 0.76) from center -->
              <!-- PC2 end: (236-0.64*50, 64-0.76*50) = (204, 26) -->
              <!-- PC2 start: (236+0.64*50, 64+0.76*50) = (268, 102) -->
              <line x1="268" y1="102" x2="200" y2="26" stroke="#10b981" stroke-width="2.5"/>
              <text x="190" y="24" font-size="10" font-weight="600" fill="#10b981">PC2</text>
              <text x="182" y="34" font-size="8" fill="#10b981">16.2%</text>
              <!-- Projection lines of points onto PC1 -->
              <line x1="112" y1="118" x2="140" y2="96" stroke="#64748b" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
              <line x1="298" y1="10" x2="298" y2="22" stroke="#64748b" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
            </svg>
            <div class="caption">5 точек (синие) с PC1 (красная, 83.8% дисперсии) и PC2 (зелёная, 16.2%). PC1 указывает направление наибольшего разброса. Пунктирные линии — проекции точек на PC1.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>PC1 направлен ~(0.76, 0.64), объясняет λ₁/(λ₁+λ₂) = 3.77/4.5 = <b>83.8%</b> дисперсии. PC2 — 16.2%. Проекции на PC1: [−2.80, −0.76, 0.00, 2.04, 1.52].</p>
          </div>
          <div class="lesson-box">
            На практике: PCA через SVD (scipy.linalg.svd) устойчивее к численным ошибкам, чем через матрицу ковариаций. sklearn.decomposition.PCA использует SVD. Масштабирование обязательно перед PCA!
          </div>
        `,
      },
      {
        title: 'Explained Variance: сколько компонент оставить',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По eigenvalues определить, сколько главных компонент нужно сохранить, чтобы объяснить 95% дисперсии.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>PC</th><th>Eigenvalue λ</th><th>Доля дисперсии</th><th>Накопительная</th></tr>
              <tr><td>PC1</td><td>5.20</td><td>5.20/10.1 = 51.5%</td><td>51.5%</td></tr>
              <tr><td>PC2</td><td>3.05</td><td>30.2%</td><td>81.7%</td></tr>
              <tr><td>PC3</td><td>1.10</td><td>10.9%</td><td>92.6%</td></tr>
              <tr><td>PC4</td><td>0.50</td><td>5.0%</td><td>97.6%</td></tr>
              <tr><td>PC5</td><td>0.25</td><td>2.4%</td><td>100.0%</td></tr>
              <tr><td>Сумма</td><td>10.10</td><td>100%</td><td>—</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить доли объяснённой дисперсии</h4>
            <div class="calc">
              EVR(PCᵢ) = λᵢ / Σλⱼ<br>
              Σλ = 5.20 + 3.05 + 1.10 + 0.50 + 0.25 = 10.10<br><br>
              EVR(PC1) = 5.20/10.10 = <b>51.5%</b><br>
              EVR(PC2) = 3.05/10.10 = <b>30.2%</b><br>
              EVR(PC3) = 1.10/10.10 = <b>10.9%</b><br>
              EVR(PC4) = 0.50/10.10 = <b>5.0%</b>
            </div>
            <div class="why">Eigenvalue = дисперсия данных вдоль этой компоненты. Больше eigenvalue → компонента важнее.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: выбор числа компонент</h4>
            <div class="calc">
              Порог 80%: нужны PC1 + PC2 = 81.7% ≥ 80% → <b>k=2</b><br>
              Порог 90%: нужны PC1..PC3 = 92.6% ≥ 90% → <b>k=3</b><br>
              Порог 95%: нужны PC1..PC4 = 97.6% ≥ 95% → <b>k=4</b><br><br>
              Сжатие: 5 → 3 компоненты = 40% сжатие при потере лишь 7.4% дисперсии
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: scree plot и «правило Кайзера»</h4>
            <div class="calc">
              Scree plot: график λ по убыванию<br>
              «Локоть» между PC3 и PC4 (λ падает с 1.10 до 0.50)<br><br>
              Правило Кайзера: оставлять компоненты с λ > 1<br>
              (усреднённая дисперсия признака = 1 при стандартизации)<br>
              Здесь: PC1, PC2, PC3 → λ > 1 → k=3<br><br>
              Оба метода сходятся на k=3
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Для порога 95%: k=4 компоненты (97.6% дисперсии). По локтю scree plot и правилу Кайзера: k=3 (92.6%). Итоговый выбор зависит от задачи: для визуализации k=2, для ML — 90-95% threshold.</p>
          </div>
          <div class="lesson-box">
            В sklearn: PCA(n_components=0.95) автоматически выбирает минимальное k для объяснения 95% дисперсии. PCA(n_components=2) — всегда 2 компоненты. explained_variance_ratio_.cumsum() покажет накопительную долю.
          </div>
        `,
      },
      {
        title: 'Стандартизация обязательна',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как отсутствие стандартизации искажает результат PCA, когда признаки имеют разные масштабы.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Объект</th><th>Возраст (лет)</th><th>Доход (тыс. руб.)</th><th>Рост (м)</th></tr>
              <tr><td>1</td><td>25</td><td>50</td><td>1.70</td></tr>
              <tr><td>2</td><td>35</td><td>80</td><td>1.80</td></tr>
              <tr><td>3</td><td>45</td><td>120</td><td>1.75</td></tr>
              <tr><td>4</td><td>55</td><td>200</td><td>1.65</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: PCA без стандартизации</h4>
            <div class="calc">
              Дисперсии признаков (в исходных единицах):<br>
              Var(Возраст) ≈ 125 лет²<br>
              Var(Доход) ≈ 3433 тыс.² — в 27 раз больше!<br>
              Var(Рост) ≈ 0.003 м²<br><br>
              Матрица ковариаций доминирует признак «Доход»<br>
              PC1 ≈ направление «Дохода» (0.02, 0.999, 0.0001)<br>
              PC1 объясняет 96% «дисперсии» — но это просто масштаб дохода!<br>
              Возраст и Рост фактически игнорируются
            </div>
            <div class="why">Доход в тысячах рублей имеет дисперсию тысячи единиц. PCA «думает», что это самый важный признак, хотя на самом деле важность — вопрос масштаба.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: стандартизация признаков</h4>
            <div class="calc">
              z = (x − μ) / σ для каждого признака<br><br>
              Возраст: μ=40, σ=11.18<br>
              Доход: μ=112.5, σ=58.6<br>
              Рост: μ=1.725, σ=0.058<br><br>
              После стандартизации Var(z) = 1 для всех признаков<br>
              Каждый признак вносит одинаковый «стартовый» вклад<br>
              PCA теперь ищет реальные информативные направления
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: PCA после стандартизации</h4>
            <div class="calc">
              Матрица корреляций (= ковариаций стандартизованных):<br>
              Corr(Возраст, Доход) ≈ 0.98 — сильная корреляция<br>
              Corr(Возраст, Рост) ≈ −0.10<br>
              Corr(Доход, Рост) ≈ −0.05<br><br>
              PC1: (0.71, 0.71, 0.01) — ось «Возраст-Доход» (они коррелируют)<br>
              EVR(PC1) ≈ 65.5%<br>
              PC2: (0.01, 0.01, 0.999) — ось «Роста»<br>
              EVR(PC2) ≈ 33.8%<br>
              Итого 2 компоненты ≈ 99.3% дисперсии
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Без стандартизации PC1 = «Доход» (96%), Возраст и Рост игнорируются. После стандартизации PC1 = «Возраст-Доход» (65%), PC2 = «Рост» (34%). Результат содержателен и интерпретируем.</p>
          </div>
          <div class="lesson-box">
            Правило: всегда применяй StandardScaler перед PCA, если признаки имеют разные единицы измерения. Исключение: если все признаки в одних единицах и масштаб несёт информацию (например, координаты). В sklearn: Pipeline([('scaler', StandardScaler()), ('pca', PCA(n_components=0.95))]).
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: PCA на 2D облаке</h3>
        <p>Меняй параметры облака и смотри, куда указывают главные компоненты.</p>
        <div class="sim-container">
          <div class="sim-controls" id="pca-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="pca-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="pca-chart"></canvas></div>
            <div class="sim-stats" id="pca-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#pca-controls');
        const cN = App.makeControl('range', 'pca-n', 'Точек', { min: 30, max: 300, step: 10, value: 100 });
        const cRho = App.makeControl('range', 'pca-rho', 'Корреляция', { min: -0.95, max: 0.95, step: 0.05, value: 0.75 });
        const cSx = App.makeControl('range', 'pca-sx', 'σₓ', { min: 0.5, max: 4, step: 0.1, value: 2 });
        const cSy = App.makeControl('range', 'pca-sy', 'σᵧ', { min: 0.5, max: 4, step: 0.1, value: 1 });
        [cN, cRho, cSx, cSy].forEach(c => controls.appendChild(c.wrap));

        let chart = null;

        function run() {
          const n = +cN.input.value;
          const rho = +cRho.input.value;
          const sx = +cSx.input.value;
          const sy = +cSy.input.value;

          const xs = [], ys = [];
          for (let i = 0; i < n; i++) {
            const z1 = App.Util.randn(), z2 = App.Util.randn();
            xs.push(sx * z1);
            ys.push(sy * (rho * z1 + Math.sqrt(1 - rho * rho) * z2));
          }
          // центрируем
          const mx = App.Util.mean(xs), my = App.Util.mean(ys);
          for (let i = 0; i < n; i++) { xs[i] -= mx; ys[i] -= my; }

          // covariance
          let cxx = 0, cyy = 0, cxy = 0;
          for (let i = 0; i < n; i++) {
            cxx += xs[i] * xs[i];
            cyy += ys[i] * ys[i];
            cxy += xs[i] * ys[i];
          }
          cxx /= n - 1; cyy /= n - 1; cxy /= n - 1;

          // eigenvalues 2x2
          const trace = cxx + cyy, det = cxx * cyy - cxy * cxy;
          const lam1 = trace / 2 + Math.sqrt(trace * trace / 4 - det);
          const lam2 = trace / 2 - Math.sqrt(trace * trace / 4 - det);

          // eigenvectors
          function eig(lam) {
            // (cxx - lam)v1 + cxy v2 = 0
            let v1, v2;
            if (Math.abs(cxy) > 1e-9) { v1 = cxy; v2 = lam - cxx; }
            else { v1 = 1; v2 = 0; if (Math.abs(cxx - lam) > 1e-9) { v1 = 0; v2 = 1; } }
            const n = Math.sqrt(v1 * v1 + v2 * v2);
            return [v1 / n, v2 / n];
          }
          const v1 = eig(lam1), v2 = eig(lam2);

          const s1 = Math.sqrt(lam1) * 2;
          const s2 = Math.sqrt(lam2) * 2;

          const pc1Line = [
            { x: -v1[0] * s1, y: -v1[1] * s1 },
            { x: v1[0] * s1, y: v1[1] * s1 },
          ];
          const pc2Line = [
            { x: -v2[0] * s2, y: -v2[1] * s2 },
            { x: v2[0] * s2, y: v2[1] * s2 },
          ];

          const ctx = container.querySelector('#pca-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Данные', data: xs.map((x, i) => ({ x, y: ys[i] })), backgroundColor: 'rgba(99,102,241,0.4)', pointRadius: 3 },
                { type: 'line', label: 'PC1 (главная)', data: pc1Line, borderColor: '#dc2626', borderWidth: 3, pointRadius: 0, fill: false },
                { type: 'line', label: 'PC2', data: pc2Line, borderColor: '#16a34a', borderWidth: 3, pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: {
                x: { type: 'linear', title: { display: true, text: 'X' }, min: -8, max: 8 },
                y: { title: { display: true, text: 'Y' }, min: -8, max: 8 },
              },
            },
          });
          App.registerChart(chart);

          const total = lam1 + lam2;
          container.querySelector('#pca-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">λ₁ (PC1)</div><div class="stat-value">${App.Util.round(lam1, 3)}</div></div>
            <div class="stat-card"><div class="stat-label">λ₂ (PC2)</div><div class="stat-value">${App.Util.round(lam2, 3)}</div></div>
            <div class="stat-card"><div class="stat-label">PC1: дисперсия</div><div class="stat-value">${(lam1 / total * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">PC2: дисперсия</div><div class="stat-value">${(lam2 / total * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">PC1 угол</div><div class="stat-value">${(Math.atan2(v1[1], v1[0]) * 180 / Math.PI).toFixed(1)}°</div></div>
          `;
        }

        [cN, cRho, cSx, cSy].forEach(c => c.input.addEventListener('input', run));
        container.querySelector('#pca-regen').onclick = run;
        run();
      },
    },

    python: `
      <h3>Python: метод главных компонент (PCA)</h3>
      <p>sklearn.PCA вычисляет главные компоненты. explained_variance_ratio_ показывает долю объяснённой дисперсии. Scree plot помогает выбрать число компонент.</p>

      <h4>1. PCA и визуализация данных</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer()
X, y = data.data, data.target

# Обязательно масштабируем перед PCA
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Понижение до 2D для визуализации
pca = PCA(n_components=2, random_state=42)
X_pca = pca.fit_transform(X_scaled)

print(f'Объяснённая дисперсия: {pca.explained_variance_ratio_.round(3)}')
print(f'Суммарно: {pca.explained_variance_ratio_.sum():.3f}')

plt.figure(figsize=(8, 6))
for label, name in enumerate(data.target_names):
    mask = y == label
    plt.scatter(X_pca[mask, 0], X_pca[mask, 1], alpha=0.6, label=name, s=30)
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%})')
plt.title('PCA: 2D проекция Breast Cancer')
plt.legend()
plt.show()</code></pre>

      <h4>2. Scree plot и выбор числа компонент</h4>
      <pre><code># Обучаем PCA с полным числом компонент
pca_full = PCA(random_state=42)
pca_full.fit(X_scaled)

explained = pca_full.explained_variance_ratio_
cumulative = np.cumsum(explained)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# Scree plot
ax1.bar(range(1, 11), explained[:10] * 100)
ax1.set_xlabel('Компонента')
ax1.set_ylabel('Объяснённая дисперсия, %')
ax1.set_title('Scree plot')

# Кумулятивная объяснённая дисперсия
ax2.plot(range(1, len(cumulative)+1), cumulative * 100, 'o-')
ax2.axhline(95, color='red', linestyle='--', label='95%')
ax2.set_xlabel('Число компонент')
ax2.set_ylabel('Кумулятивная, %')
ax2.set_title('Объяснённая дисперсия')
ax2.legend()
plt.tight_layout()
plt.show()

n_95 = np.argmax(cumulative >= 0.95) + 1
print(f'Компонент для 95% дисперсии: {n_95} из {X.shape[1]}')</code></pre>

      <h4>3. PCA как предобработка + влияние на качество модели</h4>
      <pre><code>from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

# Сравниваем качество классификатора: с PCA и без
results = {}
for n_comp in [2, 5, 10, 20, None]:
    if n_comp is not None:
        pipe = Pipeline([
            ('scaler', StandardScaler()),
            ('pca', PCA(n_components=n_comp, random_state=42)),
            ('lr', LogisticRegression(max_iter=1000)),
        ])
        label = f'PCA({n_comp})'
    else:
        pipe = Pipeline([
            ('scaler', StandardScaler()),
            ('lr', LogisticRegression(max_iter=1000)),
        ])
        label = 'Без PCA'

    scores = cross_val_score(pipe, X, y, cv=5, scoring='roc_auc')
    results[label] = scores.mean()
    print(f'{label:12s}: ROC-AUC = {scores.mean():.4f} ± {scores.std():.4f}')

plt.bar(list(results.keys()), list(results.values()))
plt.ylabel('CV ROC-AUC')
plt.title('PCA: влияние на качество классификации')
plt.tight_layout()
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Визуализация</b> — 2D/3D проекция многомерных данных (EDA).</li>
        <li><b>Сжатие</b> — изображения, сигналы, embedding.</li>
        <li><b>Предобработка</b> — удаление шума, декорреляция признаков.</li>
        <li><b>Ускорение ML</b> — меньше признаков → быстрее обучение.</li>
        <li><b>Face recognition</b> — Eigenfaces.</li>
        <li><b>Finance</b> — факторный анализ, риск-модели.</li>
        <li><b>Genomics</b> — анализ экспрессии генов.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Математически строгий метод</li>
            <li>Детерминированный (без рандома)</li>
            <li>Быстрый через SVD</li>
            <li>Работает как шумоподавление</li>
            <li>Декоррелирует признаки</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Линейный метод — не ловит нелинейные структуры</li>
            <li>Чувствителен к масштабу (обязательна стандартизация)</li>
            <li>Новые оси могут быть не интерпретируемыми</li>
            <li>Максимизирует дисперсию ≠ сохраняет классы</li>
            <li>Чувствителен к выбросам</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Формулировка через собственные значения</h3>
      <p>Для центрированной матрицы $X \\in \\mathbb{R}^{n \\times p}$:</p>
      <div class="math-block">$$\\Sigma = \\frac{1}{n-1} X^T X$$</div>
      <p>Находим разложение: $\\Sigma = V \\Lambda V^T$, где V — ортогональная матрица собственных векторов, Λ — диагональная матрица eigenvalues.</p>

      <h4>Проекция</h4>
      <div class="math-block">$$Z = X V_k$$</div>
      <p>где $V_k$ — первые k столбцов V. $Z \\in \\mathbb{R}^{n \\times k}$ — данные в новом базисе.</p>

      <h4>Обратная реконструкция</h4>
      <div class="math-block">$$\\tilde{X} = Z V_k^T$$</div>

      <h3>Через SVD (практичнее)</h3>
      <div class="math-block">$$X = U \\Sigma V^T$$</div>
      <p>Тогда главные компоненты = столбцы V, а $\\lambda_i = \\sigma_i^2 / (n-1)$.</p>

      <h3>Explained variance</h3>
      <div class="math-block">$$\\text{EVR}_i = \\frac{\\lambda_i}{\\sum_j \\lambda_j}$$</div>

      <h3>Оптимизация (вывод)</h3>
      <p>Первая компонента $w_1$ — решение:</p>
      <div class="math-block">$$\\max_{\\|w\\|=1} w^T \\Sigma w$$</div>
      <p>Решение — собственный вектор $\\Sigma$ с максимальным eigenvalue.</p>
    `,

    extra: `
      <h3>Как выбрать число компонент</h3>
      <ul>
        <li><b>По объяснённой дисперсии</b>: 90-95% — стандарт.</li>
        <li><b>По scree plot</b>: «локоть».</li>
        <li><b>Kaiser rule</b>: оставить компоненты с $\\lambda > 1$ (после стандартизации).</li>
        <li><b>Cross-validation</b>: если PCA — часть пайплайна ML.</li>
      </ul>

      <h3>Стандартизация — ОБЯЗАТЕЛЬНА</h3>
      <p>Если один признак в метрах, другой в миллиметрах — второй будет доминировать. Перед PCA используй StandardScaler.</p>

      <h3>Нелинейные альтернативы</h3>
      <ul>
        <li><b>Kernel PCA</b> — PCA в ядерном пространстве.</li>
        <li><b>t-SNE</b> — для визуализации, сохраняет локальную структуру.</li>
        <li><b>UMAP</b> — быстрее t-SNE, сохраняет и локальную, и глобальную.</li>
        <li><b>Autoencoder</b> — нелинейный PCA через нейросеть.</li>
      </ul>

      <h3>PCA vs LDA</h3>
      <ul>
        <li><b>PCA</b> — unsupervised, ищет направления максимальной дисперсии.</li>
        <li><b>LDA</b> — supervised, ищет направления максимальной разделимости классов.</li>
      </ul>

      <h3>SVD для разреженных матриц</h3>
      <p>Для текстов (TF-IDF) используется <b>Truncated SVD</b> (LSA) — то же, что PCA, но без явного центрирования, работает с разреженными матрицами.</p>

      <h3>Whitening</h3>
      <p>После PCA можно поделить на $\\sqrt{\\lambda_i}$ — получим данные с единичной ковариацией. Полезно перед нейросетями.</p>
    `,
  },
});
