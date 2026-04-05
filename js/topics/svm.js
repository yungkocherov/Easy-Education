/* ==========================================================================
   Support Vector Machine
   ========================================================================== */
App.registerTopic({
  id: 'svm',
  category: 'ml',
  title: 'SVM (Метод опорных векторов)',
  summary: 'Граница с максимальным зазором между классами.',

  tabs: {
    theory: `
      <h3>Идея</h3>
      <p>Найти такую разделяющую гиперплоскость, чтобы зазор (margin) между классами был максимальным. Чем больше зазор — тем устойчивее модель.</p>

      <h3>Hard margin</h3>
      <p>Если данные линейно разделимы, существует множество разделяющих прямых. SVM ищет ту, что на максимальном расстоянии от ближайших точек. Эти ближайшие точки — <b>опорные векторы</b> (support vectors).</p>

      <h3>Soft margin</h3>
      <p>Если данные не разделимы идеально, допускаем ошибки с штрафом. Параметр <b>C</b> регулирует:</p>
      <ul>
        <li><b>Большой C</b> → строго, мало нарушений margin, переобучение.</li>
        <li><b>Маленький C</b> → много нарушений допускается, шире margin, недообучение.</li>
      </ul>

      <h3>Ядерный трюк (kernel trick)</h3>
      <p>Нелинейные границы получаем, «отображая» данные в более высокое пространство, где они становятся линейно разделимыми. На практике отображение не делаем явно — используем ядра:</p>
      <ul>
        <li><b>Linear</b>: $K(x, x') = x^T x'$</li>
        <li><b>Polynomial</b>: $K(x, x') = (x^T x' + c)^d$</li>
        <li><b>RBF (Gaussian)</b>: $K(x, x') = \\exp(-\\gamma \\|x - x'\\|^2)$ — самый популярный</li>
        <li><b>Sigmoid</b>: $K(x, x') = \\tanh(\\alpha x^T x' + c)$</li>
      </ul>

      <div class="callout tip">💡 SVM с RBF-ядром — сильный алгоритм на малых/средних датасетах. На больших (>100k) становится медленным.</div>
    `,

    examples: `
      <h3>Пример 1: linear vs RBF</h3>
      <div class="example-card">
        <p>Две луны:</p>
        <ul>
          <li><b>Linear SVM</b> — разделяет плохо, классы не линейно разделимы.</li>
          <li><b>SVM с RBF</b> — красиво огибает луны.</li>
        </ul>
      </div>

      <h3>Пример 2: эффект параметра C</h3>
      <div class="example-card">
        <p>C = 0.01 — широкий margin, много точек внутри margin, недообучение.</p>
        <p>C = 1 — баланс.</p>
        <p>C = 100 — узкий margin, модель пытается классифицировать всё правильно, может переобучиться.</p>
      </div>

      <h3>Пример 3: опорные векторы</h3>
      <div class="example-card">
        <p>Обычно только 5-20% точек становятся опорными векторами. Остальные можно «удалить» — модель не изменится.</p>
        <p>Это делает SVM устойчивой к данным, которые далеко от границы.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: SVM с разными ядрами</h3>
        <p>Меняй ядро, C и параметр γ. Смотри, как меняется граница.</p>
        <div class="sim-container">
          <div class="sim-controls" id="svm-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="svm-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="svm-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="svm-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#svm-controls');
        const cKernel = App.makeControl('select', 'svm-kernel', 'Ядро', {
          options: [{ value: 'linear', label: 'Linear' }, { value: 'rbf', label: 'RBF' }, { value: 'poly', label: 'Poly' }],
          value: 'rbf',
        });
        const cC = App.makeControl('range', 'svm-c', 'log₁₀(C)', { min: -2, max: 2, step: 0.1, value: 0 });
        const cGamma = App.makeControl('range', 'svm-gamma', 'γ (RBF)', { min: 0.1, max: 5, step: 0.1, value: 1 });
        const cDeg = App.makeControl('range', 'svm-deg', 'Степень (Poly)', { min: 2, max: 5, step: 1, value: 3 });
        const cShape = App.makeControl('select', 'svm-shape', 'Форма', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'circle', label: 'Круг' }, { value: 'linear', label: 'Линейно' }, { value: 'xor', label: 'XOR' }],
          value: 'moons',
        });
        [cKernel, cC, cGamma, cDeg, cShape].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#svm-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let alpha = []; // dual coefficients
        let b = 0;
        let kern = null;

        function genData() {
          const shape = cShape.input.value;
          points = [];
          const n = 40;
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) { x = -0.4 + 0.6 * Math.cos(t) + App.Util.randn(0, 0.06); y = -0.2 + 0.6 * Math.sin(t) + App.Util.randn(0, 0.06); cls = -1; }
              else { x = 0.2 + 0.6 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.06); y = 0.2 - 0.6 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.06); cls = 1; }
            } else if (shape === 'circle') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              const r = Math.sqrt(x * x + y * y);
              cls = r < 0.5 ? -1 : 1;
            } else if (shape === 'linear') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              cls = y > x ? 1 : -1;
              if (Math.random() < 0.1) cls = -cls;
            } else {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              cls = ((x > 0) ^ (y > 0)) ? 1 : -1;
            }
            points.push({ x, y, cls });
          }
        }

        function kernel(p1, p2) {
          const type = cKernel.input.value;
          const dot = p1.x * p2.x + p1.y * p2.y;
          if (type === 'linear') return dot;
          if (type === 'rbf') {
            const g = +cGamma.input.value;
            const d = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
            return Math.exp(-g * d);
          }
          const deg = +cDeg.input.value;
          return Math.pow(dot + 1, deg);
        }

        // Simple SMO-like solver (упрощённый)
        function trainSVM() {
          const n = points.length;
          const C = Math.pow(10, +cC.input.value);
          alpha = new Array(n).fill(0);
          b = 0;
          const K = [];
          for (let i = 0; i < n; i++) { K.push([]); for (let j = 0; j < n; j++) K[i].push(kernel(points[i], points[j])); }

          const maxIter = 200;
          const tol = 1e-3;
          for (let iter = 0; iter < maxIter; iter++) {
            let numChanged = 0;
            for (let i = 0; i < n; i++) {
              const yi = points[i].cls;
              let Ei = b - yi; for (let k = 0; k < n; k++) Ei += alpha[k] * points[k].cls * K[k][i];
              if ((yi * Ei < -tol && alpha[i] < C) || (yi * Ei > tol && alpha[i] > 0)) {
                let j;
                do { j = Math.floor(Math.random() * n); } while (j === i);
                const yj = points[j].cls;
                let Ej = b - yj; for (let k = 0; k < n; k++) Ej += alpha[k] * points[k].cls * K[k][j];
                const ai_old = alpha[i], aj_old = alpha[j];
                let L, H;
                if (yi !== yj) { L = Math.max(0, aj_old - ai_old); H = Math.min(C, C + aj_old - ai_old); }
                else { L = Math.max(0, ai_old + aj_old - C); H = Math.min(C, ai_old + aj_old); }
                if (L === H) continue;
                const eta = 2 * K[i][j] - K[i][i] - K[j][j];
                if (eta >= 0) continue;
                alpha[j] = aj_old - yj * (Ei - Ej) / eta;
                alpha[j] = Math.min(H, Math.max(L, alpha[j]));
                if (Math.abs(alpha[j] - aj_old) < 1e-5) continue;
                alpha[i] = ai_old + yi * yj * (aj_old - alpha[j]);
                const b1 = b - Ei - yi * (alpha[i] - ai_old) * K[i][i] - yj * (alpha[j] - aj_old) * K[i][j];
                const b2 = b - Ej - yi * (alpha[i] - ai_old) * K[i][j] - yj * (alpha[j] - aj_old) * K[j][j];
                if (alpha[i] > 0 && alpha[i] < C) b = b1;
                else if (alpha[j] > 0 && alpha[j] < C) b = b2;
                else b = (b1 + b2) / 2;
                numChanged++;
              }
            }
            if (numChanged === 0) break;
          }
        }

        function predict(p) {
          let s = -b;
          for (let i = 0; i < points.length; i++) if (alpha[i] > 1e-6) s += alpha[i] * points[i].cls * kernel(points[i], p);
          return s;
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          const xMin = -1.5, xMax = 1.5;
          ctx.clearRect(0, 0, W, H);
          const step = 8;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = xMin + (py / H) * (xMax - xMin);
              const s = predict({ x, y });
              ctx.fillStyle = s >= 0 ? 'rgba(59,130,246,0.18)' : 'rgba(239,68,68,0.18)';
              ctx.fillRect(px, py, step, step);
            }
          }
          // граница + margin contours (нарисуем через пиксели)
          for (let px = 0; px < W; px += 2) {
            for (let py = 0; py < H; py += 2) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = xMin + (py / H) * (xMax - xMin);
              const s = predict({ x, y });
              if (Math.abs(s) < 0.03) { ctx.fillStyle = '#16a34a'; ctx.fillRect(px, py, 2, 2); }
              else if (Math.abs(Math.abs(s) - 1) < 0.03) { ctx.fillStyle = 'rgba(100,100,100,0.5)'; ctx.fillRect(px, py, 2, 2); }
            }
          }
          // точки
          points.forEach((p, i) => {
            ctx.fillStyle = p.cls === 1 ? '#3b82f6' : '#ef4444';
            const isSV = alpha[i] > 1e-4;
            ctx.strokeStyle = isSV ? '#0f172a' : '#fff';
            ctx.lineWidth = isSV ? 2.5 : 1.5;
            const cx = ((p.x - xMin) / (xMax - xMin)) * W;
            const cy = ((p.y - xMin) / (xMax - xMin)) * H;
            ctx.beginPath(); ctx.arc(cx, cy, isSV ? 7 : 5, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          let correct = 0, svCount = 0;
          points.forEach((p, i) => {
            const s = predict(p);
            if ((s >= 0 ? 1 : -1) === p.cls) correct++;
            if (alpha[i] > 1e-4) svCount++;
          });

          container.querySelector('#svm-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Ядро</div><div class="stat-value" style="font-size:14px;">${cKernel.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">C</div><div class="stat-value">${Math.pow(10, +cC.input.value).toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Опорные векторы</div><div class="stat-value">${svCount}/${points.length}</div></div>
            <div class="stat-card"><div class="stat-label">Accuracy</div><div class="stat-value">${(correct / points.length * 100).toFixed(0)}%</div></div>
          `;
        }

        function rebuild() { trainSVM(); draw(); }

        [cKernel, cC, cGamma, cDeg].forEach(c => c.input.addEventListener('input', rebuild));
        cShape.input.addEventListener('change', () => { genData(); rebuild(); });
        container.querySelector('#svm-regen').onclick = () => { genData(); rebuild(); };

        setTimeout(() => { genData(); resize(); rebuild(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Классификация текстов</b> — категоризация документов.</li>
        <li><b>Распознавание лиц</b> — исторически сильное применение.</li>
        <li><b>Биоинформатика</b> — предсказание функции белков.</li>
        <li><b>Классификация изображений</b> — до эпохи CNN.</li>
        <li><b>Распознавание рукописных цифр</b> — MNIST benchmark.</li>
        <li><b>Anomaly detection</b> — One-Class SVM.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Хорошо работает на small/medium datasets</li>
            <li>Эффективен в высоких размерностях</li>
            <li>Memory efficient — хранит только support vectors</li>
            <li>Гибкость через разные ядра</li>
            <li>Чёткая геометрическая интуиция</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Медленный на больших данных (>100k)</li>
            <li>Не выдаёт вероятности напрямую</li>
            <li>Требует настройки C и γ</li>
            <li>Чувствителен к масштабу признаков</li>
            <li>Плохо с multi-class (OvO / OvR)</li>
            <li>Трудно интерпретируется (особенно с RBF)</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Primal задача (hard margin)</h3>
      <div class="math-block">$$\\min_{\\mathbf{w}, b} \\frac{1}{2} \\|\\mathbf{w}\\|^2 \\quad \\text{при} \\quad y_i(\\mathbf{w}^T \\mathbf{x}_i + b) \\geq 1$$</div>

      <h3>Soft margin</h3>
      <div class="math-block">$$\\min_{\\mathbf{w}, b, \\xi} \\frac{1}{2} \\|\\mathbf{w}\\|^2 + C \\sum_i \\xi_i$$</div>
      <div class="math-block">$$\\text{при } y_i(\\mathbf{w}^T \\mathbf{x}_i + b) \\geq 1 - \\xi_i, \\quad \\xi_i \\geq 0$$</div>

      <h3>Dual задача</h3>
      <div class="math-block">$$\\max_\\alpha \\sum_i \\alpha_i - \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j K(x_i, x_j)$$</div>
      <div class="math-block">$$\\text{при } 0 \\leq \\alpha_i \\leq C, \\quad \\sum_i \\alpha_i y_i = 0$$</div>

      <h3>Предсказание</h3>
      <div class="math-block">$$f(x) = \\sum_{i \\in SV} \\alpha_i y_i K(x_i, x) + b$$</div>
      <p>Где $SV = \\{i : \\alpha_i > 0\\}$ — опорные векторы.</p>

      <h3>Связь margin и ‖w‖</h3>
      <p>Margin = $\\frac{2}{\\|\\mathbf{w}\\|}$. Минимизация $\\|\\mathbf{w}\\|^2$ = максимизация margin.</p>
    `,

    extra: `
      <h3>Hinge loss</h3>
      <p>SVM эквивалентен минимизации:</p>
      <div class="math-block">$$L = \\frac{1}{2}\\|\\mathbf{w}\\|^2 + C \\sum_i \\max(0, 1 - y_i(\\mathbf{w}^T x_i + b))$$</div>
      <p>Это hinge loss + L2 регуляризация.</p>

      <h3>Калибровка вероятностей (Platt scaling)</h3>
      <p>SVM не выдаёт вероятности. Platt scaling: обучить логистическую регрессию поверх score SVM:</p>
      <div class="math-block">$$P(y=1|f) = \\frac{1}{1 + e^{Af + B}}$$</div>

      <h3>Выбор параметров</h3>
      <ul>
        <li><b>C</b> — log-сетка [0.001, 0.01, 0.1, 1, 10, 100, 1000].</li>
        <li><b>γ (RBF)</b> — log-сетка или $\\gamma = 1/(\\text{n\\_features} \\cdot \\text{Var}(X))$.</li>
        <li>Grid search через CV.</li>
      </ul>

      <h3>One-Class SVM</h3>
      <p>Для anomaly detection: учим границу только нормальных данных, аномалии — вне границы.</p>

      <h3>SVR (SVM regression)</h3>
      <p>Для регрессии: epsilon-tube вокруг предсказания. Штрафуем ошибки, выходящие за ε, остальное игнорируем.</p>

      <h3>Масштабирование обязательно</h3>
      <p>SVM использует расстояния → чувствителен к масштабу. Всегда StandardScaler.</p>
    `,
  },
});
