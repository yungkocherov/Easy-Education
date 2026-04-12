/* ==========================================================================
   Глоссарий: Функции активации
   ========================================================================== */
App.registerTopic({
  id: 'glossary-activations',
  category: 'glossary',
  title: 'Функции активации',
  summary: 'ReLU, Leaky ReLU, tanh, GELU, Swish — почему нужна нелинейность и какую выбрать.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь нейросеть без функций активации — это просто куча линейных слоёв. Но композиция линейных функций — снова линейная функция! Какой смысл в 100 слоях, если результат можно заменить одним? Функции активации добавляют <b>нелинейность</b> — это то, что позволяет нейросети выучить сложные паттерны (кривые, границы, логические комбинации).</p>
      </div>

      <h3>🎯 Зачем нужна нелинейность</h3>
      <p>Если каждый слой нейросети просто умножает вход на матрицу: $y = W_2(W_1 x) = (W_2 W_1) x = W x$. Без нелинейности вся сеть — одна линейная операция, не важно сколько слоёв.</p>
      <p>Активация добавляется <b>между слоями</b>: $y = W_2 \\cdot g(W_1 x)$. Теперь модель может выучить нелинейные зависимости. Это главная причина мощи глубоких сетей.</p>

      <h3>📊 Обзор основных активаций</h3>
      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Функции активации</text>
          <line x1="80" y1="200" x2="720" y2="200" stroke="#475569" stroke-width="1.5"/>
          <line x1="400" y1="50" x2="400" y2="320" stroke="#475569" stroke-width="1.5"/>
          <!-- Grid -->
          <line x1="80" y1="110" x2="720" y2="110" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>
          <!-- Axis labels -->
          <g font-size="11" fill="#64748b">
            <text x="395" y="120" text-anchor="end">1</text>
            <text x="395" y="214" text-anchor="end">0</text>
            <text x="395" y="305" text-anchor="end">−1</text>
            <text x="80" y="220" text-anchor="middle">−4</text>
            <text x="240" y="220" text-anchor="middle">−2</text>
            <text x="400" y="220" text-anchor="middle">0</text>
            <text x="560" y="220" text-anchor="middle">2</text>
            <text x="720" y="220" text-anchor="middle">4</text>
          </g>
          <!-- Curves (computed below) -->
          <path id="act-sigmoid" d="" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
          <path id="act-tanh" d="" fill="none" stroke="#059669" stroke-width="2.5"/>
          <path id="act-relu" d="" fill="none" stroke="#dc2626" stroke-width="2.5"/>
          <path id="act-leaky" d="" fill="none" stroke="#b45309" stroke-width="2.5" stroke-dasharray="5,3"/>
          <path id="act-gelu" d="" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
          <!-- Legend -->
          <g font-size="11" font-weight="600">
            <line x1="460" y1="60" x2="480" y2="60" stroke="#3b82f6" stroke-width="2.5"/>
            <text x="485" y="64" fill="#3b82f6">Sigmoid</text>
            <line x1="560" y1="60" x2="580" y2="60" stroke="#059669" stroke-width="2.5"/>
            <text x="585" y="64" fill="#059669">Tanh</text>
            <line x1="640" y1="60" x2="660" y2="60" stroke="#dc2626" stroke-width="2.5"/>
            <text x="665" y="64" fill="#dc2626">ReLU</text>
            <line x1="460" y1="80" x2="480" y2="80" stroke="#b45309" stroke-width="2.5" stroke-dasharray="5,3"/>
            <text x="485" y="84" fill="#b45309">Leaky ReLU</text>
            <line x1="560" y1="80" x2="580" y2="80" stroke="#7c3aed" stroke-width="2.5"/>
            <text x="585" y="84" fill="#7c3aed">GELU</text>
          </g>
        </svg>
        <div class="caption">Сравнение пяти популярных активаций. Sigmoid ограничен (0,1), Tanh — (−1,1) симметричен. ReLU — самая простая и популярная: 0 для отрицательных, линия для положительных. Leaky ReLU и GELU — современные улучшения.</div>
        <script>
        (function() {
          // X: −4..4 → pixel 80..720
          // Y: −1..1 → pixel 300..110  (center 200 = 0)
          function toPx(x, y) {
            var px = 80 + ((x + 4) / 8) * 640;
            var py = 200 - y * 90;  // 1 unit = 90 px
            return [px.toFixed(1), py.toFixed(1)];
          }
          function buildPath(fn) {
            var pts = [];
            for (var i = 0; i <= 200; i++) {
              var x = -4 + (8 * i) / 200;
              var y = fn(x);
              pts.push(toPx(x, y));
            }
            var d = 'M' + pts[0][0] + ',' + pts[0][1];
            for (var j = 1; j < pts.length; j++) d += ' L' + pts[j][0] + ',' + pts[j][1];
            return d;
          }
          document.getElementById('act-sigmoid').setAttribute('d', buildPath(function(x) { return 1 / (1 + Math.exp(-x)); }));
          document.getElementById('act-tanh').setAttribute('d', buildPath(function(x) { return Math.tanh(x); }));
          document.getElementById('act-relu').setAttribute('d', buildPath(function(x) { return Math.max(0, x) / 2; }));
          document.getElementById('act-leaky').setAttribute('d', buildPath(function(x) { return (x > 0 ? x : 0.1 * x) / 2; }));
          // GELU approximation
          document.getElementById('act-gelu').setAttribute('d', buildPath(function(x) {
            var g = 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
            return g / 2;
          }));
        })();
        </script>
      </div>

      <h3>🔑 ReLU — стандарт по умолчанию</h3>
      <div class="math-block">$$\\text{ReLU}(z) = \\max(0, z)$$</div>
      <ul>
        <li><b>✅ Плюсы:</b> очень быстрая (никаких экспонент), не страдает от vanishing gradient, биологически правдоподобна.</li>
        <li><b>❌ Минусы:</b> «умирающий ReLU» — если все входы отрицательные, нейрон навсегда возвращает 0 (градиент тоже 0, обучение останавливается).</li>
        <li><b>Где:</b> 90% современных нейросетей для скрытых слоёв (CNN, MLP).</li>
      </ul>

      <h3>🔑 Leaky ReLU — фикс для умирающего нейрона</h3>
      <div class="math-block">$$\\text{LeakyReLU}(z) = \\begin{cases} z, & z > 0 \\\\ \\alpha z, & z \\leq 0 \\end{cases}$$</div>
      <p>Маленький наклон $\\alpha$ (обычно 0.01) для отрицательной части. Нейрон «немножко пропускает» отрицательные сигналы и не может полностью умереть. На практике часто даёт небольшой прирост над обычным ReLU.</p>

      <h3>🔑 Tanh — симметричная альтернатива sigmoid</h3>
      <div class="math-block">$$\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}$$</div>
      <p>Выход в $(-1, 1)$, симметрично относительно 0. Лучше sigmoid для скрытых слоёв (zero-centred), но страдает от vanishing gradient. Сейчас используется редко (в RNN/LSTM для гейтов).</p>

      <h3>🔑 GELU — Gaussian Error Linear Unit</h3>
      <div class="math-block">$$\\text{GELU}(z) = z \\cdot \\Phi(z)$$</div>
      <p>Где $\\Phi(z)$ — CDF стандартного нормального. Интуитивно: взвешиваем $z$ на вероятность, что «соответствующая случайная величина ≤ z». Гладкая, приближается к ReLU для больших $|z|$, но мягче около нуля.</p>
      <p><b>Где:</b> современные Transformer (BERT, GPT, Vision Transformer).</p>

      <h3>🔑 Swish / SiLU</h3>
      <div class="math-block">$$\\text{Swish}(z) = z \\cdot \\sigma(z)$$</div>
      <p>Похож на GELU, но использует sigmoid вместо нормального CDF. Google обнаружил его автопоиском активаций. Чуть лучше ReLU в некоторых задачах.</p>

      <h3>🧭 Какую активацию выбрать</h3>
      <table>
        <tr><th>Ситуация</th><th>Выбор</th></tr>
        <tr><td>По умолчанию для скрытых слоёв</td><td><b>ReLU</b></td></tr>
        <tr><td>Проблема «умирающих нейронов»</td><td>Leaky ReLU или GELU</td></tr>
        <tr><td>Transformer (attention + FFN)</td><td>GELU или Swish</td></tr>
        <tr><td>RNN/LSTM/GRU (гейты)</td><td>Sigmoid и Tanh</td></tr>
        <tr><td>Выход для бинарной классификации</td><td>Sigmoid</td></tr>
        <tr><td>Выход для многоклассовой</td><td>Softmax</td></tr>
        <tr><td>Выход для регрессии</td><td>Линейная (без активации)</td></tr>
      </table>

      <h3>⚠️ Vanishing gradient</h3>
      <p>У sigmoid и tanh производная быстро становится близкой к 0 для больших $|z|$. Это приводит к <b>затуханию градиента</b> в глубоких сетях: при backprop градиенты умножаются друг на друга и стремятся к нулю. Первые слои перестают учиться.</p>
      <p>ReLU решает проблему: его производная = 1 для положительных $z$, не зависит от величины — градиент проходит без затухания.</p>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('neural-network')">Нейронные сети</a></li>
        <li><a onclick="App.selectTopic('glossary-sigmoid-softmax')">Sigmoid и Softmax</a></li>
        <li><a onclick="App.selectTopic('rnn-lstm')">RNN/LSTM</a> — tanh и sigmoid в гейтах</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Activation_function" target="_blank">Wikipedia: Activation function</a></li>
        <li><a href="https://arxiv.org/abs/1606.08415" target="_blank">GELU paper (Hendrycks & Gimpel, 2016)</a></li>
      </ul>
    `
  }
});
