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

      <h3>Зачем снижать размерность</h3>
      <p>Когда у нас много признаков (100, 1000, 10000), возникают проблемы:</p>
      <ul>
        <li><b>Проклятие размерности</b> — все алгоритмы работают хуже.</li>
        <li><b>Визуализация невозможна</b> — человек не видит 10D.</li>
        <li><b>Коррелированные признаки</b> — избыточность, шум.</li>
        <li><b>Вычислительные затраты</b> — обучение медленное.</li>
      </ul>
      <p>Идея: многие признаки содержат <b>одинаковую</b> информацию. Можно найти «главные» направления и выразить данные через них.</p>

      <h3>Главные компоненты — что это</h3>
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

      <h3>Геометрическая интуиция</h3>
      <p>Представь облако точек в 2D, вытянутое по диагонали:</p>
      <ul>
        <li>Первая главная компонента — <b>ось вдоль вытянутости</b>. Вдоль неё точки разлетаются сильно.</li>
        <li>Вторая компонента — <b>перпендикулярно</b>. Вдоль неё разлёт минимальный.</li>
      </ul>
      <p>Если «сжать» облако по второй оси (игнорировать PC2) — точки сольются в линию, но потеряем мало: облако и так было тонким в этом направлении.</p>
      <p>В высоких размерностях то же самое: ищем, в каких направлениях облако «вытянуто», сохраняем именно их.</p>

      <h3>Как вычисляется PCA</h3>
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

      <h3>Explained variance — сколько информации сохранили</h3>
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

      <h3>Как выбрать k</h3>
      <ul>
        <li><b>Explained variance ≥ 95%</b> — стандартное правило.</li>
        <li><b>Scree plot</b> — график eigenvalues, ищем «локоть».</li>
        <li><b>Kaiser rule</b> — оставить компоненты с $\\lambda > 1$ (после стандартизации).</li>
        <li><b>CV</b> — если PCA часть ML pipeline, подбор через качество модели.</li>
      </ul>

      <h3>Стандартизация обязательна</h3>
      <p>PCA максимизирует дисперсию. Если один признак в сантиметрах (1-100), другой в метрах (0.01-1), первый будет доминировать просто из-за масштаба.</p>
      <p><b>Перед PCA всегда</b> применяй StandardScaler (среднее=0, std=1). Иначе результат будет бессмысленным.</p>

      <h3>Применения PCA</h3>
      <ul>
        <li><b>Визуализация</b> многомерных данных в 2D/3D — главное применение.</li>
        <li><b>Сжатие</b> — изображения, embedding.</li>
        <li><b>Денойзинг</b> — малые компоненты обычно содержат шум, их отбрасывание очищает данные.</li>
        <li><b>Предобработка для ML</b> — ускорение, декорреляция признаков.</li>
        <li><b>Eigenfaces</b> — классический метод распознавания лиц.</li>
        <li><b>Finance</b> — факторный анализ рынков.</li>
        <li><b>Genomics</b> — анализ экспрессии генов.</li>
      </ul>

      <h3>Плюсы и ограничения</h3>
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

      <h3>Частые заблуждения</h3>
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

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Корреляция</b> — PCA использует ковариационную матрицу.</li>
        <li><b>Регуляризация</b> — PCA это другой способ уменьшить сложность модели.</li>
        <li><b>K-Means</b> — PCA часто применяется перед кластеризацией.</li>
        <li><b>Нейросети</b> — autoencoder это нелинейный PCA.</li>
        <li><b>SVD</b> — основной алгоритм вычисления PCA.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: 2D → 1D</h3>
      <div class="example-card">
        <p>Точки: (2,3), (3,4), (4,5), (5,6). Все лежат на линии y = x + 1.</p>
        <p>Центрирование: $\\bar{x}$ = 3.5, $\\bar{y}$ = 4.5 → (-1.5,-1.5), (-0.5,-0.5), (0.5,0.5), (1.5,1.5).</p>
        <p>Первая компонента = направление (1,1)/√2. Проекции: -√4.5, -√0.5, √0.5, √4.5.</p>
        <p>Вторая компонента: дисперсия = 0 (все точки на прямой).</p>
        <p><b>Мы сжали 2D в 1D без потерь.</b></p>
      </div>

      <h3>Пример 2: explained variance</h3>
      <div class="example-card">
        <p>Eigenvalues: λ₁=5, λ₂=3, λ₃=1, λ₄=0.5, λ₅=0.3. Всего = 9.8.</p>
        <ul>
          <li>PC1: 5/9.8 = 51% дисперсии</li>
          <li>PC2: 3/9.8 = 31% (накопительно 82%)</li>
          <li>PC3: 10% (накоп. 92%)</li>
          <li>PC4: 5% (накоп. 97%)</li>
        </ul>
        <p>Оставляя первые 3 компоненты, сохраняем 92% информации при сжатии с 5 до 3 измерений.</p>
      </div>

      <h3>Пример 3: scree plot</h3>
      <div class="example-card">
        <p>График eigenvalues в порядке убывания. Ищем «локоть» — после него компоненты уже шум. До локтя — оставляем.</p>
      </div>
    `,

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
