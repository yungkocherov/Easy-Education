/* ==========================================================================
   Глоссарий: Sigmoid и Softmax
   ========================================================================== */
App.registerTopic({
  id: 'glossary-sigmoid-softmax',
  category: 'glossary',
  title: 'Sigmoid и Softmax',
  summary: 'Функции, превращающие произвольные числа в вероятности.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Твоя модель выдаёт число — например, <b>2.7</b>. Что это значит? Для классификации нужно понять: это вероятность класса? Но вероятность должна быть от 0 до 1. Sigmoid и Softmax — это «переводчики»: они берут любое число (или вектор чисел) и превращают в правильно распределённые вероятности.</p>
      </div>

      <h3>📐 Sigmoid: для бинарной классификации</h3>
      <div class="math-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>
      <p>Принимает любое число $z \\in (-\\infty, +\\infty)$ и возвращает значение в $(0, 1)$ — идеально для вероятности «да/нет».</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Sigmoid: σ(z) = 1 / (1 + e⁻ᶻ)</text>
          <line x1="80" y1="260" x2="720" y2="260" stroke="#475569" stroke-width="1.5"/>
          <line x1="400" y1="50" x2="400" y2="280" stroke="#475569" stroke-width="1.5"/>
          <!-- Grid lines at y=0, 0.5, 1 -->
          <line x1="80" y1="80" x2="720" y2="80" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="80" y1="170" x2="720" y2="170" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="3,3"/>
          <!-- Y labels -->
          <g font-size="11" fill="#64748b" text-anchor="end">
            <text x="75" y="264">0</text>
            <text x="75" y="174">0.5</text>
            <text x="75" y="84">1</text>
          </g>
          <!-- X labels -->
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="80" y="280">−6</text>
            <text x="240" y="280">−3</text>
            <text x="400" y="280">0</text>
            <text x="560" y="280">3</text>
            <text x="720" y="280">6</text>
          </g>
          <!-- Sigmoid curve -->
          <path id="sigmoid-curve" d="" fill="none" stroke="#1e40af" stroke-width="3.5"/>
          <!-- Decision boundary at 0.5 -->
          <circle cx="400" cy="170" r="5" fill="#dc2626"/>
          <text x="415" y="166" font-size="11" fill="#dc2626" font-weight="700">σ(0) = 0.5</text>
          <text x="415" y="180" font-size="10" fill="#dc2626">порог решения</text>
        </svg>
        <div class="caption">Sigmoid гладко переводит любое действительное число в вероятность [0,1]. При z=0 → σ=0.5 (порог). Большие положительные z → близко к 1, большие отрицательные → близко к 0.</div>
        <script>
        (function() {
          var n = 200;
          var pts = [];
          for (var i = 0; i <= n; i++) {
            var z = -6 + (12 * i) / n;
            var s = 1 / (1 + Math.exp(-z));
            var x = 80 + ((z + 6) / 12) * 640;
            var y = 260 - s * 180;
            pts.push([x.toFixed(1), y.toFixed(1)]);
          }
          var d = 'M' + pts[0][0] + ',' + pts[0][1];
          for (var j = 1; j < pts.length; j++) d += ' L' + pts[j][0] + ',' + pts[j][1];
          document.getElementById('sigmoid-curve').setAttribute('d', d);
        })();
        </script>
      </div>

      <h4>Свойства sigmoid</h4>
      <ul>
        <li>$\\sigma(0) = 0.5$ — середина</li>
        <li>$\\sigma(\\infty) = 1$, $\\sigma(-\\infty) = 0$ — асимптоты</li>
        <li>Симметрия: $\\sigma(-z) = 1 - \\sigma(z)$</li>
        <li>Производная: $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$ — удобно для backprop</li>
      </ul>

      <h3>📐 Softmax: для многоклассовой классификации</h3>
      <p>Обобщение sigmoid на $K$ классов. Принимает вектор чисел $(z_1, z_2, \\ldots, z_K)$ и возвращает вектор вероятностей, которые в сумме дают 1:</p>
      <div class="math-block">$$\\text{softmax}(z_k) = \\frac{e^{z_k}}{\\sum_{j=1}^K e^{z_j}}$$</div>

      <div class="key-concept">
        <div class="kc-label">Численный пример</div>
        <p>Пусть модель выдала 3 «сырых» значения (logits): $z = [2.0,\\ 1.0,\\ 0.5]$</p>
        <ul>
          <li>Экспоненты: $e^{2.0}=7.39$, $e^{1.0}=2.72$, $e^{0.5}=1.65$. Сумма = 11.76.</li>
          <li>Вероятности: $[7.39/11.76,\\ 2.72/11.76,\\ 1.65/11.76] = [0.63,\\ 0.23,\\ 0.14]$</li>
          <li>Сумма = 1.0 ✓. Модель уверена в классе 1 на 63%.</li>
        </ul>
      </div>

      <h4>Свойства softmax</h4>
      <ul>
        <li>Все выходы неотрицательны и в сумме = 1 (правильное распределение вероятностей).</li>
        <li>Инвариантен к сдвигу: $\\text{softmax}(z + c) = \\text{softmax}(z)$ для любой константы $c$.</li>
        <li><b>Temperature scaling</b>: $\\text{softmax}(z/T)$. При $T \\to 0$ — превращается в argmax (жёсткое решение). При $T \\to \\infty$ — в равномерное распределение.</li>
        <li>Для $K=2$ softmax математически эквивалентен sigmoid.</li>
      </ul>

      <h3>🎯 Где применяются</h3>
      <table>
        <tr><th>Задача</th><th>Функция</th></tr>
        <tr><td>Логистическая регрессия (бинарная)</td><td>Sigmoid на выходе</td></tr>
        <tr><td>Логистическая регрессия (многоклассовая)</td><td>Softmax</td></tr>
        <tr><td>Нейросети, бинарная классификация</td><td>Sigmoid на выходе + BCE loss</td></tr>
        <tr><td>Нейросети, многоклассовая</td><td>Softmax + Cross-Entropy loss</td></tr>
        <tr><td>Attention механизм в Transformer</td><td>Softmax по score'ам</td></tr>
        <tr><td>Gating в LSTM/GRU</td><td>Sigmoid (что забыть / запомнить)</td></tr>
      </table>

      <h3>⚠️ Численные проблемы и решения</h3>
      <ul>
        <li><b>Overflow в softmax</b>: если $z_k$ очень большое, $e^{z_k}$ взрывается. Решение — вычесть максимум: $\\text{softmax}(z) = \\text{softmax}(z - \\max(z))$.</li>
        <li><b>Underflow в sigmoid</b>: при очень отрицательном $z$, $e^{-z}$ → ∞. Решение — использовать <code>log-sigmoid</code> или <code>torch.nn.BCEWithLogitsLoss</code> (комбинирует sigmoid + log в одной операции стабильно).</li>
        <li><b>Log-softmax</b>: вместо отдельных softmax + log используй <code>log_softmax</code> для численной стабильности в cross-entropy.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a></li>
        <li><a onclick="App.selectTopic('neural-network')">Нейронные сети</a></li>
        <li><a onclick="App.selectTopic('transformer')">Transformer</a> — softmax в attention</li>
        <li><a onclick="App.selectTopic('glossary-loss-functions')">Функции потерь</a> — Cross-Entropy в паре с softmax</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Sigmoid_function" target="_blank">Wikipedia: Sigmoid</a></li>
        <li><a href="https://en.wikipedia.org/wiki/Softmax_function" target="_blank">Wikipedia: Softmax</a></li>
      </ul>
    `
  }
});
