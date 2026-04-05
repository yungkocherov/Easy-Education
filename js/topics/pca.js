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
      <h3>Задача</h3>
      <p>У нас p признаков, многие из них коррелированы. Хотим найти <b>новые</b> оси (комбинации старых признаков) так, чтобы:</p>
      <ul>
        <li>Вдоль первой оси — максимальная дисперсия данных.</li>
        <li>Вторая ось ортогональна первой и тоже максимизирует дисперсию.</li>
        <li>И так далее.</li>
      </ul>
      <p>Можно оставить только первые k осей и получить снижение размерности с минимальной потерей информации.</p>

      <h3>Геометрическая интуиция</h3>
      <p>Представь облако точек в 2D, вытянутое по диагонали. Первая главная компонента — ось вдоль вытянутости. Вторая — перпендикулярно. Если сжать на вторую — потеряем мало (облако тонкое в этом направлении).</p>

      <h3>Как считается</h3>
      <ol>
        <li>Центрировать данные: $X \\gets X - \\bar{X}$.</li>
        <li>Вычислить ковариационную матрицу $\\Sigma = \\frac{1}{n-1} X^T X$.</li>
        <li>Найти собственные векторы и собственные значения $\\Sigma$.</li>
        <li>Собственные векторы = главные компоненты.</li>
        <li>Собственные значения = дисперсии вдоль компонент.</li>
        <li>Отсортировать по убыванию eigenvalue, взять первые k.</li>
      </ol>

      <div class="callout tip">💡 PCA — это поиск ортогонального поворота, в котором ковариационная матрица становится диагональной.</div>
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
