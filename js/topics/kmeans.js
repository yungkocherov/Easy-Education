/* ==========================================================================
   K-Means
   ========================================================================== */
App.registerTopic({
  id: 'kmeans',
  category: 'ml',
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

      <h3>Задача кластеризации</h3>
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

      <h3>Алгоритм Ллойда (классический K-Means)</h3>
      <p>Простая итеративная процедура:</p>
      <ol>
        <li><b>Инициализация:</b> выбрать $k$ случайных центроидов.</li>
        <li><b>Assignment (распределение):</b> каждую точку отнести к ближайшему центроиду.</li>
        <li><b>Update (обновление):</b> пересчитать каждый центроид как среднее его кластера.</li>
        <li><b>Повторять</b> шаги 2-3, пока центроиды перестанут меняться (или почти).</li>
      </ol>

      <p>Алгоритм гарантированно сходится за конечное число итераций (обычно 10-20).</p>

      <h3>Что именно минимизирует K-Means</h3>
      <p>Формально K-Means минимизирует сумму квадратов расстояний от точек до их центроидов:</p>
      <div class="math-block">$$J = \\sum_{i=1}^{n} \\|x_i - \\mu_{c(i)}\\|^2$$</div>

      <p>Это называется <span class="term" data-tip="Inertia / WCSS. Within-Cluster Sum of Squares. Сумма квадратов расстояний от точек до их центроидов. Метрика качества кластеризации — чем меньше, тем лучше.">inertia</span> или WCSS (Within-Cluster Sum of Squares). Чем меньше — тем «плотнее» кластеры.</p>

      <p><b>Важно:</b> это невыпуклая задача с локальными минимумами. Разные инициализации дают разные результаты.</p>

      <h3>Инициализация — критически важна</h3>
      <p>Если начать со случайных точек, K-Means может попасть в плохой локальный минимум. Решение: <span class="term" data-tip="K-Means++. Умная инициализация центроидов: первый центр случайный, следующие выбираются с вероятностью, пропорциональной квадрату расстояния до ближайшего уже выбранного центра.">K-Means++</span>:</p>

      <ol>
        <li>Первый центр — случайная точка.</li>
        <li>Следующий центр — с вероятностью, пропорциональной квадрату расстояния до ближайшего уже выбранного центра.</li>
        <li>Повторять, пока не выбрано $k$ центров.</li>
      </ol>

      <p>Центроиды получаются «далеко друг от друга» — лучше покрывают пространство. Это стандартная инициализация в sklearn.</p>

      <h3>Выбор k — главный вопрос</h3>
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

      <h3>Ограничения K-Means</h3>
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

      <h3>Применения</h3>
      <ul>
        <li><b>Сегментация клиентов</b> — группировка по поведению (RFM-анализ).</li>
        <li><b>Сжатие изображений</b> — квантизация цветов.</li>
        <li><b>Feature engineering</b> — номер кластера как признак.</li>
        <li><b>Anomaly detection</b> — точки далёкие от всех центроидов.</li>
        <li><b>Document clustering</b> — тематическая группировка текстов.</li>
        <li><b>Vector quantization</b> — в speech и image processing.</li>
      </ul>

      <h3>Частые заблуждения</h3>
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

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>DBSCAN</b> — альтернатива для некруглых кластеров и с шумом.</li>
        <li><b>PCA</b> — часто применяется перед K-Means для снижения размерности.</li>
        <li><b>GMM</b> — мягкое обобщение K-Means.</li>
        <li><b>Hierarchical clustering</b> — даёт дендрограмму, не требует k.</li>
        <li><b>Feature engineering</b> — кластер-номер как новый признак для supervised задачи.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: одна итерация</h3>
      <div class="example-card">
        <div class="example-data">Точки: (1,1), (2,1), (4,3), (5,4)
Начальные центры: μ₁=(1,1), μ₂=(5,5)</div>
        <p><b>Assign:</b></p>
        <ul>
          <li>(1,1): ближе к μ₁ → кластер 1</li>
          <li>(2,1): ближе к μ₁ → кластер 1</li>
          <li>(4,3): ближе к μ₂ → кластер 2</li>
          <li>(5,4): ближе к μ₂ → кластер 2</li>
        </ul>
        <p><b>Update:</b></p>
        <ul>
          <li>μ₁ = среднее (1,1) и (2,1) = (1.5, 1)</li>
          <li>μ₂ = среднее (4,3) и (5,4) = (4.5, 3.5)</li>
        </ul>
        <p>Центры сдвинулись → следующая итерация.</p>
      </div>

      <h3>Пример 2: K-Means++ инициализация</h3>
      <div class="example-card">
        <p>Плохая случайная инициализация может привести к плохому локальному минимуму. K-Means++:</p>
        <ol>
          <li>Первый центр — случайная точка.</li>
          <li>Следующий центр — с вероятностью, пропорциональной квадрату расстояния до ближайшего уже выбранного центра.</li>
          <li>Так центры получаются «далеко друг от друга».</li>
        </ol>
        <p>Это стандартная инициализация в sklearn.</p>
      </div>

      <h3>Пример 3: elbow method</h3>
      <div class="example-card">
        <p>Считаем inertia для k = 1, 2, 3, ..., 10. Получаем убывающую кривую.</p>
        <p>«Локоть» — точка резкого замедления убывания. Обычно именно в ней оптимальный k.</p>
      </div>
    `,

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
