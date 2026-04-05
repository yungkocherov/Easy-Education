/* ==========================================================================
   k-Nearest Neighbors
   ========================================================================== */
App.registerTopic({
  id: 'knn',
  category: 'ml',
  title: 'k-Nearest Neighbors (kNN)',
  summary: 'Голосование k ближайших соседей — самая простая идея в ML.',

  tabs: {
    theory: `
      <h3>Идея</h3>
      <p>Нет никакого обучения. Просто запоминаем все тренировочные примеры. Когда приходит новая точка:</p>
      <ol>
        <li>Считаем расстояния до всех обучающих точек.</li>
        <li>Берём k ближайших.</li>
        <li>Для классификации — голосуем большинством. Для регрессии — берём среднее.</li>
      </ol>

      <h3>Гиперпараметры</h3>
      <ul>
        <li><b>k</b> — число соседей. Маленькое k → переобучение. Большое k → недообучение.</li>
        <li><b>Метрика расстояния</b> — евклидова, манхеттенская, косинусная.</li>
        <li><b>Веса</b> — uniform (все равны) или distance (ближе — важнее).</li>
      </ul>

      <h3>Как выбирать k</h3>
      <p>Обычно через кросс-валидацию. Нечётные k предпочтительнее в бинарной классификации (чтобы избежать ничьих). Правило большого пальца: $k \\approx \\sqrt{n}$.</p>

      <div class="callout warn">⚠️ kNN — «ленивый» алгоритм (lazy learner): обучения нет, вся работа при предсказании. Это плохо для больших датасетов и онлайн-инференса.</div>
    `,

    examples: `
      <h3>Пример 1: классификация фруктов</h3>
      <div class="example-card">
        <p>Признаки: вес (г), диаметр (см). Классы: яблоко, апельсин.</p>
        <div class="example-data">Обучение:
Яблоко: (150, 7), (160, 7.5), (140, 6.5)
Апельсин: (200, 8.5), (220, 9), (180, 8)</div>
        <p>Новая точка: (170, 7.8). Расстояния:</p>
        <ul>
          <li>до (150, 7): √(400 + 0.64) ≈ 20.0 — яблоко</li>
          <li>до (160, 7.5): √(100 + 0.09) ≈ 10.0 — яблоко</li>
          <li>до (140, 6.5): √(900 + 1.69) ≈ 30.0 — яблоко</li>
          <li>до (180, 8): √(100 + 0.04) ≈ 10.0 — апельсин</li>
          <li>до (200, 8.5): √(900 + 0.49) ≈ 30.0 — апельсин</li>
          <li>до (220, 9): √(2500 + 1.44) ≈ 50.0 — апельсин</li>
        </ul>
        <p>k=3: ближайшие — (160, 7.5) яблоко, (180, 8) апельсин, (150, 7) яблоко. Голосование: <b>яблоко (2:1)</b>.</p>
      </div>

      <h3>Пример 2: важность масштабирования</h3>
      <div class="example-card">
        <p>Если один признак в единицах 0-1, а другой 0-10000 — второй «задавит» первый. <b>Всегда масштабируй признаки</b> (StandardScaler или MinMaxScaler) перед kNN.</p>
      </div>

      <h3>Пример 3: регрессия через kNN</h3>
      <div class="example-card">
        <p>Оценить цену квартиры по 3 похожим:</p>
        <div class="example-data">Похожие: 180к, 200к, 190к (тыс.)
Предсказание: среднее = 190к</div>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: граница решения kNN</h3>
        <p>Меняй k и наблюдай, как меняется граница. Кликай на поле, чтобы добавлять точки.</p>
        <div class="sim-container">
          <div class="sim-controls" id="knn-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="knn-regen">🔄 Новые данные</button>
            <button class="btn secondary" id="knn-clear">🗑 Очистить</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="knn-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="knn-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#knn-controls');
        const cK = App.makeControl('range', 'knn-k', 'k (соседей)', { min: 1, max: 25, step: 1, value: 5 });
        const cN = App.makeControl('range', 'knn-n', 'Точек на класс', { min: 10, max: 60, step: 5, value: 25 });
        const cClass = App.makeControl('select', 'knn-class', 'Добавлять класс', {
          options: [{ value: '0', label: 'Красный' }, { value: '1', label: 'Синий' }, { value: '2', label: 'Зелёный' }],
          value: '0',
        });
        [cK, cN, cClass].forEach((c) => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#knn-canvas');
        const ctx = canvas.getContext('2d');
        const colors = ['#ef4444', '#3b82f6', '#10b981'];
        const colorsLight = ['rgba(239,68,68,0.22)', 'rgba(59,130,246,0.22)', 'rgba(16,185,129,0.22)'];
        let points = [];

        function resize() {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          draw();
        }

        function regenerate() {
          const n = +cN.input.value;
          points = [];
          const centers = [[0.25, 0.3], [0.7, 0.35], [0.5, 0.75]];
          centers.forEach((c, cls) => {
            for (let i = 0; i < n; i++) {
              points.push({
                x: c[0] + App.Util.randn(0, 0.08),
                y: c[1] + App.Util.randn(0, 0.08),
                cls,
              });
            }
          });
          draw();
        }

        function knnPredict(px, py, k) {
          const dists = points.map(p => ({ d: (p.x - px) ** 2 + (p.y - py) ** 2, cls: p.cls }));
          dists.sort((a, b) => a.d - b.d);
          const counts = [0, 0, 0];
          for (let i = 0; i < Math.min(k, dists.length); i++) counts[dists[i].cls]++;
          let best = 0;
          for (let i = 1; i < 3; i++) if (counts[i] > counts[best]) best = i;
          return best;
        }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          if (points.length === 0) return;

          const k = +cK.input.value;
          // заливка по сетке
          const step = 8;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const cls = knnPredict(px / W, py / H, k);
              ctx.fillStyle = colorsLight[cls];
              ctx.fillRect(px, py, step, step);
            }
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = colors[p.cls];
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          });

          container.querySelector('#knn-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">k</div><div class="stat-value">${k}</div></div>
            <div class="stat-card"><div class="stat-label">Всего точек</div><div class="stat-value">${points.length}</div></div>
            <div class="stat-card"><div class="stat-label">Классов</div><div class="stat-value">3</div></div>
          `;
        }

        canvas.addEventListener('click', (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          points.push({ x, y, cls: +cClass.input.value });
          draw();
        });

        cK.input.addEventListener('input', draw);
        cN.input.addEventListener('change', regenerate);
        container.querySelector('#knn-regen').onclick = regenerate;
        container.querySelector('#knn-clear').onclick = () => { points = []; draw(); };

        setTimeout(() => { resize(); regenerate(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Рекомендательные системы</b> — «похожие пользователи» / «похожие товары».</li>
        <li><b>Импутация пропусков</b> — заменить NaN средним по k соседям.</li>
        <li><b>Аномалии</b> — точки с большим расстоянием до соседей.</li>
        <li><b>OCR / распознавание цифр</b> — классика MNIST.</li>
        <li><b>Медицинская диагностика</b> — «пациенты с похожими симптомами».</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Интуитивно понятен</li>
            <li>Нет обучения — легко добавлять новые данные</li>
            <li>Работает с любыми задачами (классификация и регрессия)</li>
            <li>Естественно работает с многоклассовыми задачами</li>
            <li>Нелинейная граница</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Медленно предсказывает — O(n) для каждой точки</li>
            <li>Большая память — хранит весь датасет</li>
            <li>Страдает от «проклятия размерности»</li>
            <li>Требует обязательного масштабирования</li>
            <li>Чувствителен к нерелевантным признакам</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Формулы расстояний</h3>

      <h4>Евклидово</h4>
      <div class="math-block">$$d(\\mathbf{x}, \\mathbf{z}) = \\sqrt{\\sum_{j=1}^{p} (x_j - z_j)^2}$$</div>

      <h4>Манхеттенское</h4>
      <div class="math-block">$$d(\\mathbf{x}, \\mathbf{z}) = \\sum_{j=1}^{p} |x_j - z_j|$$</div>

      <h4>Минковского (обобщение)</h4>
      <div class="math-block">$$d(\\mathbf{x}, \\mathbf{z}) = \\left(\\sum_{j=1}^{p} |x_j - z_j|^q\\right)^{1/q}$$</div>

      <h4>Косинусное</h4>
      <div class="math-block">$$d(\\mathbf{x}, \\mathbf{z}) = 1 - \\frac{\\mathbf{x} \\cdot \\mathbf{z}}{\\|\\mathbf{x}\\| \\|\\mathbf{z}\\|}$$</div>

      <h3>Классификация</h3>
      <div class="math-block">$$\\hat{y}(x) = \\arg\\max_c \\sum_{i \\in N_k(x)} \\mathbb{1}[y_i = c]$$</div>

      <h3>Регрессия</h3>
      <div class="math-block">$$\\hat{y}(x) = \\frac{1}{k} \\sum_{i \\in N_k(x)} y_i$$</div>

      <h3>Взвешенный kNN</h3>
      <div class="math-block">$$\\hat{y}(x) = \\frac{\\sum_i w_i y_i}{\\sum_i w_i}, \\quad w_i = \\frac{1}{d(x, x_i)^2}$$</div>
    `,

    extra: `
      <h3>Проклятие размерности</h3>
      <p>В высокой размерности все точки становятся примерно одинаково далёкими друг от друга. Различие между ближайшим и дальним соседом уменьшается. kNN плохо работает при p > 20.</p>

      <h3>Ускорение</h3>
      <ul>
        <li><b>KD-Tree</b> — O(log n) поиск, хорош для низких размерностей.</li>
        <li><b>Ball Tree</b> — лучше для высоких размерностей.</li>
        <li><b>FAISS / HNSW</b> — приближённый поиск для миллиардов точек.</li>
      </ul>

      <h3>Как выбрать k: bias-variance</h3>
      <ul>
        <li><b>k=1</b> — высокая дисперсия, низкое смещение, переобучение.</li>
        <li><b>k=n</b> — низкая дисперсия, высокое смещение, недообучение (предсказывает моду).</li>
        <li>Оптимальное k выбирается через CV.</li>
      </ul>

      <h3>Взвешивание признаков</h3>
      <p>Если некоторые признаки важнее, умножить их на больший вес. Иначе нерелевантные признаки «разбавят» расстояние.</p>

      <h3>kNN и learning theory</h3>
      <p>1-NN имеет асимптотическую ошибку ≤ 2× оптимальная (Bayes). Для большого n kNN сходится к оптимальному классификатору при $k \\to \\infty$ и $k/n \\to 0$.</p>
    `,
  },
});
