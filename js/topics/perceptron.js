/* ==========================================================================
   Perceptron
   ========================================================================== */
App.registerTopic({
  id: 'perceptron',
  category: 'dl',
  title: 'Перцептрон',
  summary: 'Простейшая нейросеть — один нейрон, линейная граница, правило Розенблатта.',

  tabs: {
    theory: `
      <h3>История</h3>
      <p>Перцептрон (Розенблатт, 1958) — первая модель искусственного нейрона. Построен по мотивам биологического нейрона: входы с весами, сумматор, пороговая активация.</p>

      <h3>Устройство</h3>
      <div class="math-block">$$\\hat{y} = \\text{sign}(w_0 + w_1 x_1 + w_2 x_2 + \\dots + w_p x_p)$$</div>
      <p>Берём взвешенную сумму входов, пропускаем через знаковую функцию, получаем класс (+1 или −1).</p>

      <h3>Правило обучения (Розенблатт)</h3>
      <p>Если предсказание правильное — ничего не делаем. Если нет — корректируем веса:</p>
      <div class="math-block">$$\\mathbf{w} \\gets \\mathbf{w} + \\eta (y_i - \\hat{y}_i) \\mathbf{x}_i$$</div>
      <p>Или эквивалентно:</p>
      <ul>
        <li>Ошиблись с меткой +1 (предсказали −1) → $\\mathbf{w} \\gets \\mathbf{w} + \\mathbf{x}$</li>
        <li>Ошиблись с меткой −1 (предсказали +1) → $\\mathbf{w} \\gets \\mathbf{w} - \\mathbf{x}$</li>
      </ul>

      <h3>Теорема сходимости</h3>
      <p>Если данные <b>линейно разделимы</b>, перцептрон гарантированно найдёт разделяющую гиперплоскость за конечное число итераций.</p>

      <div class="callout warn">⚠️ XOR-проблема: перцептрон не может решить задачу XOR — она не линейно разделима. Это привело к «зиме нейросетей» в 70-х, пока не изобрели многослойные сети.</div>
    `,

    examples: `
      <h3>Пример 1: AND функция</h3>
      <div class="example-card">
        <div class="example-data">x₁ x₂ | y
0  0  | 0
0  1  | 0
1  0  | 0
1  1  | 1</div>
        <p>Решается перцептроном: $y = \\text{sign}(-1.5 + x_1 + x_2)$.</p>
        <ul>
          <li>(0,0): sign(−1.5) = −1 → класс 0 ✓</li>
          <li>(0,1): sign(−0.5) = −1 → класс 0 ✓</li>
          <li>(1,0): sign(−0.5) = −1 → класс 0 ✓</li>
          <li>(1,1): sign(0.5) = +1 → класс 1 ✓</li>
        </ul>
      </div>

      <h3>Пример 2: обучение шаг за шагом</h3>
      <div class="example-card">
        <p>Начальные веса: w = (0, 0, 0). η = 1. Данные: (1, 1) → +1; (−1, 1) → −1.</p>
        <div class="example-data">Итерация 1: x=(1,1,1) (с bias), y=+1, ŷ=sign(0)=−1 (ошибка)
   w ← (0,0,0) + (1,1,1) = (1,1,1)

Итерация 2: x=(1,-1,1), y=-1, ŷ=sign(-1+1+1)=+1 (ошибка)
   w ← (1,1,1) - (1,-1,1) = (0,2,0)

Проверка: для (1,1): sign(0+2+0)=+1 ✓, для (-1,1): sign(0-2+0)=-1 ✓</div>
      </div>

      <h3>Пример 3: XOR (не решается одним нейроном)</h3>
      <div class="example-card">
        <div class="example-data">(0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0</div>
        <p>Ни одна прямая не разделит классы. Нужны минимум 2 слоя. Это и привело к многослойным нейросетям.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: обучение перцептрона</h3>
        <p>Посмотри, как меняется граница на каждом шаге. Клик по полю — добавить точку.</p>
        <div class="sim-container">
          <div class="sim-controls" id="perc-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="perc-step">▶ 1 проход</button>
            <button class="btn" id="perc-train">⏩ Обучить до сходимости</button>
            <button class="btn secondary" id="perc-reset">↺ Сбросить веса</button>
            <button class="btn secondary" id="perc-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="perc-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="perc-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#perc-controls');
        const cSep = App.makeControl('range', 'perc-sep', 'Разделимость', { min: 0.5, max: 5, step: 0.1, value: 2 });
        const cN = App.makeControl('range', 'perc-n', 'Точек на класс', { min: 10, max: 80, step: 5, value: 30 });
        const cLR = App.makeControl('range', 'perc-lr', 'η', { min: 0.05, max: 1, step: 0.05, value: 0.5 });
        [cSep, cN, cLR].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#perc-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let w = [0, 0, 0]; // w0, w1, w2 (bias)
        let epoch = 0;
        let errors = 0;

        function genData() {
          const sep = +cSep.input.value;
          const n = +cN.input.value;
          points = [];
          for (let i = 0; i < n; i++) {
            points.push({ x: App.Util.randn(-sep, 1), y: App.Util.randn(-sep, 1), cls: -1 });
            points.push({ x: App.Util.randn(sep, 1), y: App.Util.randn(sep, 1), cls: 1 });
          }
          w = [0, 0, 0];
          epoch = 0; errors = 0;
          draw();
        }

        function sign(z) { return z >= 0 ? 1 : -1; }

        function oneEpoch() {
          const lr = +cLR.input.value;
          let err = 0;
          const shuffled = App.Util.shuffle(points);
          shuffled.forEach(p => {
            const z = w[0] + w[1] * p.x + w[2] * p.y;
            const pred = sign(z);
            if (pred !== p.cls) {
              w[0] += lr * p.cls;
              w[1] += lr * p.cls * p.x;
              w[2] += lr * p.cls * p.y;
              err++;
            }
          });
          errors = err;
          epoch++;
          draw();
          return err;
        }

        function trainTillConverge() {
          for (let i = 0; i < 200; i++) {
            if (oneEpoch() === 0) break;
          }
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          const xMin = -6, xMax = 6, yMin = -6, yMax = 6;
          const toCanvas = (x, y) => [((x - xMin) / (xMax - xMin)) * W, ((yMax - y) / (yMax - yMin)) * H];

          ctx.clearRect(0, 0, W, H);
          // граница: w0 + w1*x + w2*y = 0
          // заливка
          const step = 10;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = yMax - (py / H) * (yMax - yMin);
              const z = w[0] + w[1] * x + w[2] * y;
              ctx.fillStyle = z >= 0 ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)';
              ctx.fillRect(px, py, step, step);
            }
          }
          // линия
          if (Math.abs(w[2]) > 1e-6) {
            const y1 = -(w[0] + w[1] * xMin) / w[2];
            const y2 = -(w[0] + w[1] * xMax) / w[2];
            const [x1c, y1c] = toCanvas(xMin, y1);
            const [x2c, y2c] = toCanvas(xMax, y2);
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1c, y1c);
            ctx.lineTo(x2c, y2c);
            ctx.stroke();
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = p.cls === 1 ? '#3b82f6' : '#ef4444';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            const [cx, cy] = toCanvas(p.x, p.y);
            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          container.querySelector('#perc-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Эпоха</div><div class="stat-value">${epoch}</div></div>
            <div class="stat-card"><div class="stat-label">Ошибок</div><div class="stat-value">${errors}</div></div>
            <div class="stat-card"><div class="stat-label">w₀ (bias)</div><div class="stat-value">${App.Util.round(w[0], 2)}</div></div>
            <div class="stat-card"><div class="stat-label">w₁</div><div class="stat-value">${App.Util.round(w[1], 2)}</div></div>
            <div class="stat-card"><div class="stat-label">w₂</div><div class="stat-value">${App.Util.round(w[2], 2)}</div></div>
          `;
        }

        [cSep, cN].forEach(c => c.input.addEventListener('change', genData));
        container.querySelector('#perc-step').onclick = oneEpoch;
        container.querySelector('#perc-train').onclick = trainTillConverge;
        container.querySelector('#perc-reset').onclick = () => { w = [0, 0, 0]; epoch = 0; errors = 0; draw(); };
        container.querySelector('#perc-regen').onclick = genData;

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Исторический интерес</b> — первая обучаемая модель.</li>
        <li><b>Фундамент нейросетей</b> — нейрон в любой сети это и есть перцептрон с нелинейностью.</li>
        <li><b>Линейные классификаторы</b> — онлайн-обучение, потоковые данные.</li>
        <li><b>Обучение теории</b> — упрощённая модель для понимания основ.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Максимально простой алгоритм</li>
            <li>Сходится, если данные линейно разделимы</li>
            <li>Быстрый, онлайн-обучаемый</li>
            <li>Основа для понимания нейросетей</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Не работает на не-линейно-разделимых данных</li>
            <li>Не выдаёт вероятности</li>
            <li>Может колебаться при неразделимости</li>
            <li>Нет регуляризации</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Модель</h3>
      <div class="math-block">$$\\hat{y} = \\text{sign}(\\mathbf{w}^T \\mathbf{x}) = \\begin{cases} +1, & \\mathbf{w}^T \\mathbf{x} \\geq 0 \\\\ -1, & \\text{иначе} \\end{cases}$$</div>

      <h3>Правило обновления</h3>
      <div class="math-block">$$\\mathbf{w}_{t+1} = \\mathbf{w}_t + \\eta \\cdot y_i \\cdot \\mathbf{x}_i \\quad \\text{если } \\hat{y}_i \\neq y_i$$</div>

      <h3>Теорема сходимости (Новиков)</h3>
      <p>Пусть данные линейно разделимы с зазором $\\gamma > 0$: $\\exists \\mathbf{w}^*$ с $\\|\\mathbf{w}^*\\| = 1$ и $y_i \\mathbf{w}^{*T} \\mathbf{x}_i \\geq \\gamma$ для всех i. Пусть $R = \\max \\|\\mathbf{x}_i\\|$.</p>
      <p>Тогда число ошибок перцептрона:</p>
      <div class="math-block">$$\\text{errors} \\leq \\left(\\frac{R}{\\gamma}\\right)^2$$</div>

      <h3>Связь с SVM</h3>
      <p>Перцептрон находит <b>любую</b> разделяющую гиперплоскость. SVM — гиперплоскость с <b>максимальным зазором</b>. Если данные не разделимы, SVM всё равно работает с soft margin.</p>

      <h3>Мини-батч версия</h3>
      <p>Вместо обновления на одном примере, усредняем градиенты по батчу. Более стабильное обучение.</p>
    `,

    extra: `
      <h3>Pocket algorithm</h3>
      <p>Если данные не разделимы, обычный перцептрон зацикливается. Pocket хранит «лучшие найденные» веса: обновляет «pocket weights» только если они дают меньше ошибок. Даёт разумное решение и для неразделимых данных.</p>

      <h3>Voted и averaged perceptron</h3>
      <p>Усредняем веса по всем итерациям → более устойчивые, лучше обобщают.</p>

      <h3>Многослойный перцептрон (MLP)</h3>
      <p>Стекаем несколько перцептронов с нелинейной активацией (sigmoid, ReLU). Получаем универсальный аппроксиматор — это уже нейросеть.</p>

      <h3>Дуальная форма и ядра</h3>
      <p>Можно переписать перцептрон через скалярные произведения: $\\mathbf{w} = \\sum_i \\alpha_i y_i \\mathbf{x}_i$. Заменив $\\langle \\mathbf{x}_i, \\mathbf{x}_j \\rangle$ на ядро $K(\\mathbf{x}_i, \\mathbf{x}_j)$, получаем kernel perceptron — умеет в нелинейные границы.</p>

      <h3>От перцептрона к современному DL</h3>
      <ol>
        <li>Перцептрон (1958) — один нейрон, sign-функция.</li>
        <li>MLP (1986) — backpropagation.</li>
        <li>CNN (1998) — LeNet, свёртки.</li>
        <li>Deep Nets (2012) — AlexNet, GPU.</li>
        <li>Transformer (2017) — attention, LLMs.</li>
      </ol>
    `,
  },
});
