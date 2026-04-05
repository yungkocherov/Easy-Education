/* ==========================================================================
   Neural Network (MLP)
   ========================================================================== */
App.registerTopic({
  id: 'neural-network',
  category: 'dl',
  title: 'Нейронная сеть (MLP)',
  summary: 'Многослойный перцептрон — основа глубокого обучения.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь конвейер на фабрике. Сырьё (данные) проходит через много станций, на каждой оно <b>преобразуется</b>: очищается, сортируется, комбинируется, обрабатывается. На выходе — готовый продукт. Каждая станция умеет делать что-то простое, но вместе они создают сложный продукт.</p>
        <p>Нейросеть устроена так же. На входе — сырые признаки (пиксели, слова, числа). Каждый слой <b>преобразует</b> их в более полезное представление. В конце — ответ: класс, число, текст.</p>
        <p>Магия не в одном нейроне (он умеет только линейные комбинации), а в том, что сотни нейронов в нескольких слоях вместе выучивают <b>иерархию представлений</b>: от простых паттернов до сложных концепций. Так нейросеть распознаёт лицо: первый слой видит края, второй — текстуры, третий — части лица, четвёртый — само лицо.</p>
      </div>

      <h3>От перцептрона к многослойной сети</h3>
      <p>Один перцептрон может провести только <b>прямую</b> границу. Не может XOR, круг, спираль. Решение — соединить перцептроны в <b>слои</b>:</p>

      <ul>
        <li><b>Input layer (входной)</b> — это не нейроны, а просто признаки объекта.</li>
        <li><b>Hidden layers (скрытые)</b> — промежуточные слои с нелинейной активацией.</li>
        <li><b>Output layer (выходной)</b> — нейроны, выдающие финальный ответ.</li>
      </ul>

      <p>Такая структура называется <span class="term" data-tip="Multi-Layer Perceptron. Классическая нейросеть с полносвязными слоями. Базовая архитектура для обучения нелинейных функций.">Multi-Layer Perceptron (MLP)</span> или feedforward neural network.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Один слой — линейная комбинация. Много слоёв с <b>нелинейностью</b> между ними — могут выучить <b>любую</b> функцию. Глубина сети даёт иерархию признаков: ранние слои учат простое, поздние — сложное.</p>
      </div>

      <h3>Forward pass — как сеть считает предсказание</h3>
      <p>Данные идут слой за слоем. Для каждого слоя:</p>
      <div class="math-block">$$a^{(l)} = \\sigma\\left(W^{(l)} a^{(l-1)} + b^{(l)}\\right)$$</div>

      <p>Где:</p>
      <ul>
        <li>$a^{(l-1)}$ — вход слоя (выход предыдущего).</li>
        <li>$W^{(l)}$ — матрица весов слоя.</li>
        <li>$b^{(l)}$ — вектор bias.</li>
        <li>$\\sigma$ — нелинейная функция активации.</li>
        <li>$a^{(l)}$ — выход слоя.</li>
      </ul>

      <p>Это просто линейная комбинация + нелинейность. Повторяем для каждого слоя.</p>

      <h3>Функции активации</h3>
      <p><span class="term" data-tip="Activation function. Нелинейная функция, применяемая к выходу нейрона. Без неё сеть была бы эквивалентна одному линейному слою.">Активация</span> — критически важный элемент. Без неё несколько линейных слоёв эквивалентны одному.</p>

      <h4>Sigmoid</h4>
      <div class="math-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>
      <p>Выход в (0, 1). Классика 80-х. Сегодня используется только в выходном слое для бинарной классификации. Проблема: «умирает» на краях (градиент ≈ 0).</p>

      <h4>Tanh</h4>
      <div class="math-block">$$\\tanh(z) \\in (-1, 1)$$</div>
      <p>Центрирована около 0. Лучше sigmoid, но тоже насыщается.</p>

      <h4>ReLU (Rectified Linear Unit)</h4>
      <div class="math-block">$$\\text{ReLU}(z) = \\max(0, z)$$</div>
      <p><b>Стандарт в современных сетях</b>. Простая, быстрая, не насыщается для положительных. Проблема «dying ReLU» — нейроны с отрицательными входами застревают.</p>

      <h4>Leaky ReLU, ELU, GELU, Swish</h4>
      <p>Варианты ReLU, которые не «умирают». GELU и Swish используются в современных трансформерах.</p>

      <h3>Backpropagation — как сеть учится</h3>
      <p><span class="term" data-tip="Backpropagation. Алгоритм обратного распространения ошибки: вычисляет градиенты по всем весам через правило цепочки от выхода к входу.">Обратное распространение ошибки</span> — ключевой алгоритм обучения нейросетей. Идея:</p>

      <ol>
        <li><b>Forward pass:</b> прогнали данные через сеть, получили предсказание, посчитали loss.</li>
        <li><b>Backward pass:</b> идём <b>от конца сети к началу</b>, считая градиенты по каждому весу через правило цепочки.</li>
        <li><b>Update:</b> обновляем веса градиентным спуском: $W \\gets W - \\eta \\nabla_W L$.</li>
      </ol>

      <p>Магия: мы считаем градиенты для <b>миллионов</b> весов за одно прохождение через сеть. Это именно то, что делает обучение глубоких сетей возможным.</p>

      <h3>Теорема универсальной аппроксимации</h3>
      <p><span class="term" data-tip="Universal Approximation Theorem. Нейросеть с одним скрытым слоем может аппроксимировать любую непрерывную функцию с любой точностью, при достаточном числе нейронов.">Теорема</span>: MLP с <b>одним</b> скрытым слоем и достаточным числом нейронов может аппроксимировать <b>любую</b> непрерывную функцию с любой точностью.</p>
      <p>Это удивительно: 1 скрытый слой теоретически достаточен для всего. Но на практике <b>глубокие</b> сети работают лучше — они выражают сложные функции меньшим числом параметров.</p>

      <h3>Иерархия представлений</h3>
      <p>Главное преимущество глубины — сеть автоматически учится <b>признакам разного уровня</b>:</p>
      <ul>
        <li><b>Слой 1:</b> простейшие паттерны (для изображений — края).</li>
        <li><b>Слой 2:</b> комбинации (углы, дуги).</li>
        <li><b>Слой 3:</b> формы (колёса, глаза).</li>
        <li><b>Слой 4:</b> объекты (машина, лицо).</li>
        <li><b>Последний слой:</b> классификация.</li>
      </ul>

      <p>Это называется <span class="term" data-tip="Representation Learning. Автоматическое обучение полезных признаков из сырых данных. В отличие от классического ML, не требует ручного feature engineering.">representation learning</span> — сеть сама находит полезные признаки, без feature engineering вручную.</p>

      <h3>Проблемы обучения глубоких сетей</h3>

      <h4>Vanishing gradients</h4>
      <p>При обратном распространении градиент многократно умножается. Если $\\sigma' < 1$, градиент <b>затухает</b> — первые слои не учатся. Решается ReLU, batch normalization, residual connections.</p>

      <h4>Exploding gradients</h4>
      <p>Противоположная проблема: градиенты <b>взрываются</b>. Loss → NaN. Решается gradient clipping и правильной инициализацией.</p>

      <h4>Переобучение</h4>
      <p>Глубокие сети имеют миллионы параметров. Легко запоминают обучающие данные. Решается:</p>
      <ul>
        <li><b>Dropout</b> — случайно отключаем нейроны при обучении.</li>
        <li><b>Weight decay (L2)</b> — штраф за большие веса.</li>
        <li><b>Early stopping</b>.</li>
        <li><b>Data augmentation</b>.</li>
        <li><b>Batch normalization</b>.</li>
      </ul>

      <h3>Инициализация весов</h3>
      <p>Нельзя инициализировать все веса нулями (все нейроны будут одинаковыми). Правильная инициализация:</p>
      <ul>
        <li><b>Xavier/Glorot</b>: для sigmoid/tanh.</li>
        <li><b>He</b>: для ReLU.</li>
      </ul>

      <h3>Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Универсальный аппроксиматор</b> — выучит любую функцию.</li>
        <li><b>Автоматическое обучение признакам</b>.</li>
        <li>State-of-the-art на изображениях, тексте, аудио.</li>
        <li>Масштабируется на огромные данные.</li>
        <li>Гибкая архитектура под задачу.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Нужно много данных</b>.</li>
        <li>Долго обучается, требует GPU.</li>
        <li>Плохая <b>интерпретируемость</b> (black box).</li>
        <li>Много гиперпараметров.</li>
        <li>На табличных данных часто уступает GBDT.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Больше слоёв — всегда лучше»</b> — на маленьких данных нет. И без regularization переобучение.</li>
        <li><b>«Глубокая сеть = AI»</b> — это обучаемая функция, не «интеллект».</li>
        <li><b>«ReLU — всегда лучший выбор»</b> — GELU/Swish часто лучше в современных моделях.</li>
        <li><b>«Нейросеть работает без препроцессинга»</b> — нормализация входов важна.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: виды нейросетей</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>MLP</b> — полносвязные слои, для tabular данных.</li>
            <li><b>CNN</b> — свёрточные, для изображений.</li>
            <li><b>RNN/LSTM/GRU</b> — для последовательностей.</li>
            <li><b>Transformer</b> — attention, для NLP и других последовательностей.</li>
            <li><b>GNN</b> — графовые нейросети.</li>
            <li><b>Autoencoder</b> — сжатие и восстановление.</li>
            <li><b>GAN</b> — генеративные, соревнующиеся сети.</li>
            <li><b>Diffusion</b> — для генерации изображений.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: современные архитектурные приёмы</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>Residual connections (ResNet)</b> — $y = F(x) + x$, позволяют обучать очень глубокие сети.</li>
            <li><b>Batch Normalization</b> — нормализует активации, ускоряет обучение, регуляризирует.</li>
            <li><b>Layer Normalization</b> — аналог для RNN/Transformer.</li>
            <li><b>Attention</b> — механизм фокусировки на важных частях входа.</li>
            <li><b>Skip connections</b> — короткие пути от входа к выходу.</li>
          </ul>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Перцептрон</b> — базовый блок сети.</li>
        <li><b>Градиентный спуск</b> — алгоритм обучения.</li>
        <li><b>CNN, RNN, Transformer</b> — специализированные архитектуры.</li>
        <li><b>Регуляризация</b> — dropout, weight decay, early stopping.</li>
        <li><b>Bias-variance</b> — глубокие сети умудряются балансировать.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: сеть 2→3→1</h3>
      <div class="example-card">
        <p>Вход x = [1, 2], скрытый слой 3 нейрона, выход 1 нейрон.</p>
        <p><b>Forward:</b></p>
        <div class="math-block">$$\\mathbf{z}^{(1)} = W^{(1)} \\mathbf{x} + \\mathbf{b}^{(1)}, \\quad W^{(1)} \\in \\mathbb{R}^{3 \\times 2}$$</div>
        <div class="math-block">$$\\mathbf{a}^{(1)} = \\text{ReLU}(\\mathbf{z}^{(1)}) \\in \\mathbb{R}^3$$</div>
        <div class="math-block">$$z^{(2)} = W^{(2)} \\mathbf{a}^{(1)} + b^{(2)}, \\quad \\hat{y} = \\sigma(z^{(2)})$$</div>
        <p>Всего параметров: 2·3 + 3 + 3·1 + 1 = 13.</p>
      </div>

      <h3>Пример 2: backprop одного шага</h3>
      <div class="example-card">
        <p>Loss $L = (\\hat{y} - y)^2$. Градиенты:</p>
        <div class="math-block">$$\\frac{\\partial L}{\\partial \\hat{y}} = 2(\\hat{y} - y)$$</div>
        <div class="math-block">$$\\frac{\\partial L}{\\partial z^{(2)}} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\sigma'(z^{(2)})$$</div>
        <div class="math-block">$$\\frac{\\partial L}{\\partial W^{(2)}} = \\frac{\\partial L}{\\partial z^{(2)}} \\cdot \\mathbf{a}^{(1)T}$$</div>
        <p>И дальше вглубь, применяя chain rule.</p>
      </div>

      <h3>Пример 3: проблема исчезающих градиентов</h3>
      <div class="example-card">
        <p>В глубокой сети с sigmoid: $\\sigma'(z) \\leq 0.25$. За 10 слоёв градиент умножается на $\\sim 0.25^{10} \\approx 10^{-6}$. Первые слои почти не учатся.</p>
        <p>Решения: ReLU, batch normalization, residual connections, правильная инициализация.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: обучение MLP на 2D данных</h3>
        <p>Сеть 2→hidden→1 учится классифицировать точки. Меняй архитектуру и смотри, как меняется граница.</p>
        <div class="sim-container">
          <div class="sim-controls" id="nn-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="nn-train">⏩ Обучить 200 эпох</button>
            <button class="btn secondary" id="nn-step">+20 эпох</button>
            <button class="btn secondary" id="nn-reset">↺ Новые веса</button>
            <button class="btn secondary" id="nn-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="nn-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-chart-wrap" style="height:180px;"><canvas id="nn-loss"></canvas></div>
            <div class="sim-stats" id="nn-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#nn-controls');
        const cShape = App.makeControl('select', 'nn-shape', 'Форма данных', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'xor', label: 'XOR' }, { value: 'circle', label: 'Круг' }, { value: 'spiral', label: 'Спираль' }],
          value: 'moons',
        });
        const cHidden = App.makeControl('range', 'nn-h', 'Нейронов в слое', { min: 2, max: 32, step: 1, value: 8 });
        const cLayers = App.makeControl('range', 'nn-l', 'Скрытых слоёв', { min: 1, max: 4, step: 1, value: 2 });
        const cAct = App.makeControl('select', 'nn-act', 'Активация', {
          options: [{ value: 'relu', label: 'ReLU' }, { value: 'tanh', label: 'Tanh' }, { value: 'sigmoid', label: 'Sigmoid' }],
          value: 'relu',
        });
        const cLR = App.makeControl('range', 'nn-lr', 'Learning rate', { min: 0.001, max: 0.5, step: 0.001, value: 0.05 });
        [cShape, cHidden, cLayers, cAct, cLR].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#nn-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let net = null;
        let lossHistory = [];
        let epochs = 0;
        let lossChart = null;

        // ---------- минимальная NN ----------
        function activations(name) {
          if (name === 'relu') return { f: z => Math.max(0, z), df: z => z > 0 ? 1 : 0 };
          if (name === 'tanh') return { f: z => Math.tanh(z), df: z => 1 - Math.tanh(z) ** 2 };
          return { f: z => 1 / (1 + Math.exp(-z)), df: z => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); } };
        }

        function createNet(arch) {
          const layers = [];
          for (let i = 0; i < arch.length - 1; i++) {
            const rows = arch[i + 1], cols = arch[i];
            const W = [];
            // He init
            const scale = Math.sqrt(2 / cols);
            for (let r = 0; r < rows; r++) {
              const row = [];
              for (let c = 0; c < cols; c++) row.push(App.Util.randn(0, scale));
              W.push(row);
            }
            const b = new Array(rows).fill(0);
            layers.push({ W, b });
          }
          return layers;
        }

        function matVec(M, v) {
          const out = new Array(M.length).fill(0);
          for (let i = 0; i < M.length; i++) {
            for (let j = 0; j < v.length; j++) out[i] += M[i][j] * v[j];
          }
          return out;
        }

        function forward(net, x, act) {
          const a = activations(act);
          const zs = [], as = [x];
          for (let i = 0; i < net.length; i++) {
            const { W, b } = net[i];
            const z = matVec(W, as[i]).map((v, k) => v + b[k]);
            zs.push(z);
            if (i === net.length - 1) {
              // sigmoid на выходе
              as.push(z.map(zz => 1 / (1 + Math.exp(-zz))));
            } else {
              as.push(z.map(a.f));
            }
          }
          return { zs, as };
        }

        function backward(net, fwd, y, act, lr) {
          const a = activations(act);
          const { zs, as } = fwd;
          const L = net.length;
          // out layer grad (sigmoid + BCE-like simplification: dL/dz = a - y)
          let dz = [as[L][0] - y];
          for (let l = L - 1; l >= 0; l--) {
            const aPrev = as[l];
            const { W, b } = net[l];
            // gradient W, b
            for (let i = 0; i < W.length; i++) {
              for (let j = 0; j < W[i].length; j++) {
                W[i][j] -= lr * dz[i] * aPrev[j];
              }
              b[i] -= lr * dz[i];
            }
            if (l > 0) {
              // propagate
              const daPrev = new Array(aPrev.length).fill(0);
              for (let j = 0; j < aPrev.length; j++) {
                for (let i = 0; i < W.length; i++) daPrev[j] += W[i][j] * dz[i];
              }
              dz = daPrev.map((d, j) => d * a.df(zs[l - 1][j]));
            }
          }
        }

        function predict(x) { return forward(net, x, cAct.input.value).as.slice(-1)[0][0]; }

        function trainEpoch() {
          const lr = +cLR.input.value;
          const act = cAct.input.value;
          let loss = 0;
          const shuffled = App.Util.shuffle(points);
          shuffled.forEach(p => {
            const fwd = forward(net, [p.x, p.y], act);
            const y = p.cls;
            const o = Math.max(1e-9, Math.min(1 - 1e-9, fwd.as.slice(-1)[0][0]));
            loss += -(y * Math.log(o) + (1 - y) * Math.log(1 - o));
            backward(net, fwd, y, act, lr);
          });
          loss /= points.length;
          lossHistory.push(loss);
          epochs++;
        }

        function train(n) { for (let i = 0; i < n; i++) trainEpoch(); draw(); }

        function initNet() {
          const hid = +cHidden.input.value;
          const layers = +cLayers.input.value;
          const arch = [2];
          for (let i = 0; i < layers; i++) arch.push(hid);
          arch.push(1);
          net = createNet(arch);
          lossHistory = [];
          epochs = 0;
        }

        function genData() {
          const shape = cShape.input.value;
          points = [];
          const n = 60;
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) {
                x = -0.4 + 0.6 * Math.cos(t) + App.Util.randn(0, 0.08);
                y = -0.2 + 0.6 * Math.sin(t) + App.Util.randn(0, 0.08);
                cls = 0;
              } else {
                x = 0.2 + 0.6 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.08);
                y = 0.2 - 0.6 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.08);
                cls = 1;
              }
            } else if (shape === 'xor') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              cls = ((x > 0) ^ (y > 0)) ? 1 : 0;
            } else if (shape === 'circle') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              const r = Math.sqrt(x * x + y * y);
              cls = r < 0.5 ? 0 : 1;
            } else {
              const t = i / n * 4 * Math.PI;
              const r = t / (4 * Math.PI);
              if (Math.random() < 0.5) {
                x = r * Math.cos(t) + App.Util.randn(0, 0.05); y = r * Math.sin(t) + App.Util.randn(0, 0.05); cls = 0;
              } else {
                x = -r * Math.cos(t) + App.Util.randn(0, 0.05); y = -r * Math.sin(t) + App.Util.randn(0, 0.05); cls = 1;
              }
            }
            points.push({ x, y, cls });
          }
          initNet();
          draw();
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width || !net) return;
          const W = canvas.width, H = canvas.height;
          const xMin = -1.5, xMax = 1.5, yMin = -1.5, yMax = 1.5;
          ctx.clearRect(0, 0, W, H);
          const step = 10;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = yMax - (py / H) * (yMax - yMin);
              const p = predict([x, y]);
              const t = p;
              const r = Math.round(239 * (1 - t) + 59 * t);
              const g = Math.round(68 * (1 - t) + 130 * t);
              const bl = Math.round(68 * (1 - t) + 246 * t);
              ctx.fillStyle = `rgba(${r},${g},${bl},0.3)`;
              ctx.fillRect(px, py, step, step);
            }
          }
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            const cx = ((p.x - xMin) / (xMax - xMin)) * W;
            const cy = ((yMax - p.y) / (yMax - yMin)) * H;
            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          // loss
          const lossCtx = container.querySelector('#nn-loss').getContext('2d');
          if (lossChart) lossChart.destroy();
          lossChart = new Chart(lossCtx, {
            type: 'line',
            data: { labels: lossHistory.map((_, i) => i), datasets: [{ label: 'Loss', data: lossHistory, borderColor: '#16a34a', borderWidth: 2, pointRadius: 0, fill: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Cross-entropy loss' } }, scales: { y: { beginAtZero: true } } },
          });
          App.registerChart(lossChart);

          let correct = 0;
          points.forEach(p => { if (Math.round(predict([p.x, p.y])) === p.cls) correct++; });
          const params = net.reduce((s, l) => s + l.W.length * l.W[0].length + l.b.length, 0);

          container.querySelector('#nn-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Эпох</div><div class="stat-value">${epochs}</div></div>
            <div class="stat-card"><div class="stat-label">Loss</div><div class="stat-value">${lossHistory.length ? App.Util.round(lossHistory.slice(-1)[0], 4) : '-'}</div></div>
            <div class="stat-card"><div class="stat-label">Accuracy</div><div class="stat-value">${(correct / points.length * 100).toFixed(0)}%</div></div>
            <div class="stat-card"><div class="stat-label">Параметров</div><div class="stat-value">${params}</div></div>
            <div class="stat-card"><div class="stat-label">Архитектура</div><div class="stat-value" style="font-size:13px;">2→${Array(+cLayers.input.value).fill(cHidden.input.value).join('→')}→1</div></div>
          `;
        }

        [cHidden, cLayers, cAct].forEach(c => c.input.addEventListener('change', () => { initNet(); draw(); }));
        cShape.input.addEventListener('change', genData);
        container.querySelector('#nn-train').onclick = () => train(200);
        container.querySelector('#nn-step').onclick = () => train(20);
        container.querySelector('#nn-reset').onclick = () => { initNet(); draw(); };
        container.querySelector('#nn-regen').onclick = genData;

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Tabular ML</b> — альтернатива бустингу на больших данных.</li>
        <li><b>Image recognition</b> — CNN (свёрточные сети).</li>
        <li><b>NLP</b> — RNN, LSTM, Transformer.</li>
        <li><b>Speech</b> — распознавание и синтез.</li>
        <li><b>Recommender systems</b> — neural collaborative filtering, embeddings.</li>
        <li><b>Reinforcement Learning</b> — DQN, PPO.</li>
        <li><b>Generative AI</b> — GAN, VAE, Diffusion.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Универсальный аппроксиматор</li>
            <li>Автоматическое обучение признакам</li>
            <li>Отлично масштабируется на большие данные</li>
            <li>State-of-the-art на изображениях, тексте, аудио</li>
            <li>Гибкая архитектура под задачу</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Нужно много данных</li>
            <li>Долго обучается, нужны GPU</li>
            <li>Плохая интерпретируемость</li>
            <li>Много гиперпараметров</li>
            <li>Легко переобучается без регуляризации</li>
            <li>На табличных данных часто уступает бустингу</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Forward pass</h3>
      <div class="math-block">$$\\mathbf{z}^{(l)} = W^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)}, \\quad \\mathbf{a}^{(l)} = \\sigma(\\mathbf{z}^{(l)})$$</div>

      <h3>Loss для классификации (BCE)</h3>
      <div class="math-block">$$L = -\\frac{1}{n}\\sum_{i=1}^{n}[y_i \\log \\hat{y}_i + (1-y_i)\\log(1-\\hat{y}_i)]$$</div>

      <h3>Backpropagation</h3>
      <p>Определим $\\delta^{(l)} = \\frac{\\partial L}{\\partial \\mathbf{z}^{(l)}}$. Тогда:</p>
      <div class="math-block">$$\\delta^{(L)} = \\nabla_{\\mathbf{a}} L \\odot \\sigma'(\\mathbf{z}^{(L)})$$</div>
      <div class="math-block">$$\\delta^{(l)} = (W^{(l+1)T} \\delta^{(l+1)}) \\odot \\sigma'(\\mathbf{z}^{(l)})$$</div>
      <div class="math-block">$$\\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)} (\\mathbf{a}^{(l-1)})^T, \\quad \\frac{\\partial L}{\\partial \\mathbf{b}^{(l)}} = \\delta^{(l)}$$</div>

      <h3>Обновление</h3>
      <div class="math-block">$$W^{(l)} \\gets W^{(l)} - \\eta \\frac{\\partial L}{\\partial W^{(l)}}$$</div>

      <h3>Инициализация весов</h3>
      <ul>
        <li><b>Xavier/Glorot</b>: $W \\sim N(0, 1/n_{in})$ — для tanh.</li>
        <li><b>He</b>: $W \\sim N(0, 2/n_{in})$ — для ReLU.</li>
      </ul>
    `,

    extra: `
      <h3>Регуляризация</h3>
      <ul>
        <li><b>L2 (weight decay)</b> — штраф $\\lambda \\|W\\|^2$.</li>
        <li><b>Dropout</b> — случайно выключаем нейроны при обучении.</li>
        <li><b>Early stopping</b> — остановка по валидации.</li>
        <li><b>Data augmentation</b> — искусственное увеличение датасета.</li>
        <li><b>Batch normalization</b> — нормализация активаций, ускоряет обучение.</li>
      </ul>

      <h3>Проблемы обучения</h3>
      <table>
        <tr><th>Проблема</th><th>Симптом</th><th>Решение</th></tr>
        <tr><td>Vanishing gradients</td><td>Первые слои не учатся</td><td>ReLU, ResNet, BatchNorm</td></tr>
        <tr><td>Exploding gradients</td><td>Loss → NaN</td><td>Gradient clipping</td></tr>
        <tr><td>Переобучение</td><td>Train ↓ Val ↑</td><td>Dropout, больше данных</td></tr>
        <tr><td>Недообучение</td><td>Train и Val высокие</td><td>Больше слоёв/нейронов</td></tr>
        <tr><td>Плохой LR</td><td>Loss не падает или скачет</td><td>LR scheduler, warmup</td></tr>
      </table>

      <h3>Типы сетей</h3>
      <ul>
        <li><b>MLP</b> — полносвязные, для tabular.</li>
        <li><b>CNN</b> — свёрточные, для изображений.</li>
        <li><b>RNN/LSTM/GRU</b> — рекуррентные, для последовательностей.</li>
        <li><b>Transformer</b> — attention, для текста и не только.</li>
        <li><b>GNN</b> — графовые.</li>
        <li><b>Autoencoder</b> — сжатие/восстановление.</li>
        <li><b>GAN</b> — генеративные, конкурирующие сети.</li>
      </ul>

      <h3>Дальше</h3>
      <p>После MLP стоит изучать: CNN (для изображений) → RNN/LSTM (для последовательностей) → Transformer (для современных LLM). Концепция backprop и градиентного спуска остаётся той же.</p>
    `,
  },
});
