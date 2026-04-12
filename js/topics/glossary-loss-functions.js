/* ==========================================================================
   Глоссарий: Функции потерь
   ========================================================================== */
App.registerTopic({
  id: 'glossary-loss-functions',
  category: 'glossary',
  title: 'Функции потерь (Loss functions)',
  summary: 'MSE, MAE, Huber, Cross-Entropy, Hinge — как модель «наказывается» за ошибки.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты учишь собаку приносить палку. Нужна система поощрений и штрафов: принесла палку — награда, не принесла — лёгкий выговор, убежала совсем в другую сторону — жёсткий штраф. Это и есть <b>функция потерь</b>: математическое описание того, насколько «плохо» ошиблась модель. От выбора функции зависит, какие ошибки модель будет бояться сильнее, а какие прощать.</p>
      </div>

      <h3>🎯 Зачем нужна функция потерь</h3>
      <p>Модель ML ищет параметры $\\theta$, которые <b>минимизируют среднюю потерю</b> на тренировочных данных:</p>
      <div class="math-block">$$\\theta^* = \\arg\\min_\\theta \\frac{1}{n}\\sum_{i=1}^n L(y_i, f_\\theta(x_i))$$</div>
      <p>Функция $L$ и определяет, что значит «хорошо» или «плохо» — это наш способ сказать модели, чего мы от неё хотим.</p>

      <h3>📊 Для регрессии (предсказание числа)</h3>
      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Функции потерь для регрессии</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">По оси X — ошибка (y − ŷ), по оси Y — потеря L(y, ŷ)</text>
          <line x1="80" y1="260" x2="720" y2="260" stroke="#475569" stroke-width="1.5"/>
          <line x1="400" y1="60" x2="400" y2="280" stroke="#475569" stroke-width="1.5"/>
          <!-- X ticks -->
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="80" y="280">−4</text>
            <text x="160" y="280">−3</text>
            <text x="240" y="280">−2</text>
            <text x="320" y="280">−1</text>
            <text x="400" y="280">0</text>
            <text x="480" y="280">1</text>
            <text x="560" y="280">2</text>
            <text x="640" y="280">3</text>
            <text x="720" y="280">4</text>
          </g>
          <!-- MSE: parabola L = r^2 -->
          <path id="lf-mse" d="" fill="none" stroke="#dc2626" stroke-width="3"/>
          <!-- MAE: V-shape -->
          <path d="M80,180 L400,260 L720,180" fill="none" stroke="#059669" stroke-width="3"/>
          <!-- Huber (δ=1) -->
          <path id="lf-huber" d="" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6,3"/>
          <!-- Legend -->
          <g font-size="12" font-weight="600">
            <line x1="100" y1="90" x2="120" y2="90" stroke="#dc2626" stroke-width="3"/>
            <text x="125" y="94" fill="#dc2626">MSE: L = r² (взрывается на выбросах)</text>
            <line x1="100" y1="112" x2="120" y2="112" stroke="#059669" stroke-width="3"/>
            <text x="125" y="116" fill="#059669">MAE: L = |r| (устойчив к выбросам)</text>
            <line x1="100" y1="134" x2="120" y2="134" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="6,3"/>
            <text x="125" y="138" fill="#7c3aed">Huber: квадрат близко, линейно далеко</text>
          </g>
        </svg>
        <div class="caption">MSE растёт квадратично — один большой выброс доминирует. MAE растёт линейно — робастен к выбросам, но не дифференцируем в нуле. Huber — компромисс.</div>
        <script>
        (function() {
          // MSE: y = 260 - (r^2) * 40 (scale), r in [-4, 4]
          var x0 = 80, x1 = 720, cx = 400, baselineY = 260, topY = 60;
          var n = 100;
          var ptsMse = [];
          var ptsHub = [];
          for (var i = 0; i <= n; i++) {
            var r = -4 + (8 * i) / n;
            var xPx = cx + (r / 4) * (x1 - cx);
            // MSE: L = r^2 / 4^2 * scale (so at r=4, L=1 → height full)
            var lMse = Math.min(1, (r * r) / 16);
            var yMse = baselineY - lMse * (baselineY - topY);
            ptsMse.push([xPx.toFixed(1), yMse.toFixed(1)]);
            // Huber with δ=1: quadratic if |r|<=1, linear after
            var absR = Math.abs(r);
            var lHub;
            if (absR <= 1) lHub = 0.5 * r * r;
            else lHub = absR - 0.5;
            // Scale so max ~= 3.5 maps to full height
            var lHubN = Math.min(1, lHub / 3.5);
            var yHub = baselineY - lHubN * (baselineY - topY);
            ptsHub.push([xPx.toFixed(1), yHub.toFixed(1)]);
          }
          var dMse = 'M' + ptsMse[0][0] + ',' + ptsMse[0][1];
          for (var j = 1; j < ptsMse.length; j++) dMse += ' L' + ptsMse[j][0] + ',' + ptsMse[j][1];
          document.getElementById('lf-mse').setAttribute('d', dMse);
          var dHub = 'M' + ptsHub[0][0] + ',' + ptsHub[0][1];
          for (var k = 1; k < ptsHub.length; k++) dHub += ' L' + ptsHub[k][0] + ',' + ptsHub[k][1];
          document.getElementById('lf-huber').setAttribute('d', dHub);
        })();
        </script>
      </div>

      <h4>MSE — Mean Squared Error</h4>
      <div class="math-block">$$L = \\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2$$</div>
      <p><b>Плюсы:</b> гладкая, дифференцируема, хорошо оптимизируется. <b>Минусы:</b> один выброс вносит огромный вклад (квадрат), что смещает модель.</p>

      <h4>MAE — Mean Absolute Error</h4>
      <div class="math-block">$$L = \\frac{1}{n}\\sum |y_i - \\hat{y}_i|$$</div>
      <p><b>Плюсы:</b> робастная к выбросам, интерпретируется напрямую в единицах ошибки. <b>Минусы:</b> не дифференцируема в нуле, оптимизация сложнее.</p>

      <h4>Huber Loss</h4>
      <div class="math-block">$$L_\\delta(r) = \\begin{cases} \\frac{1}{2}r^2, & |r| \\leq \\delta \\\\ \\delta(|r| - \\frac{\\delta}{2}), & |r| > \\delta \\end{cases}$$</div>
      <p>Гибрид MSE и MAE: квадрат для маленьких ошибок (гладкий), линейный для больших (робастный). $\\delta$ — граница переключения.</p>

      <h3>📊 Для классификации</h3>

      <h4>Cross-Entropy (Log-Loss)</h4>
      <div class="math-block">$$L = -\\frac{1}{n}\\sum [y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)]$$</div>
      <p><b>Интуиция:</b> штраф = $-\\log(\\text{вероятность правильного класса})$. Если модель уверенно (99%) предсказала правильно → штраф ~0. Если уверенно ошиблась → штраф огромный.</p>
      <p><b>Почему log:</b> вытекает из <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">Maximum Likelihood</a> для Бернулли. Гладкая, выпуклая, идеальна для градиентного спуска.</p>

      <h4>Hinge Loss (для SVM)</h4>
      <div class="math-block">$$L = \\max(0, 1 - y_i \\cdot f(x_i))$$</div>
      <p>Штраф только за точки внутри margin. Если точка правильно классифицирована и далеко от границы — штраф 0. Именно Hinge Loss делает SVM «жёстким» классификатором с margin.</p>

      <h4>Focal Loss</h4>
      <div class="math-block">$$L = -(1-\\hat{p})^\\gamma \\log(\\hat{p})$$</div>
      <p>Расширение cross-entropy для сильно несбалансированных классов. Фактор $(1-\\hat{p})^\\gamma$ уменьшает вклад «легких» примеров, заставляя модель фокусироваться на сложных. Применяется в детекции объектов.</p>

      <h3>🧭 Как выбрать функцию потерь</h3>
      <table>
        <tr><th>Задача</th><th>Рекомендация</th></tr>
        <tr><td>Регрессия без выбросов</td><td>MSE (быстро, стабильно)</td></tr>
        <tr><td>Регрессия с выбросами</td><td>MAE или Huber</td></tr>
        <tr><td>Квантильная регрессия</td><td>Pinball loss (Quantile loss)</td></tr>
        <tr><td>Бинарная классификация</td><td>Cross-Entropy (стандарт)</td></tr>
        <tr><td>Многоклассовая</td><td>Categorical Cross-Entropy</td></tr>
        <tr><td>SVM</td><td>Hinge Loss</td></tr>
        <tr><td>Сильный дисбаланс классов</td><td>Focal Loss или weighted CE</td></tr>
      </table>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> — MSE как «сердце»</li>
        <li><a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a> — Cross-Entropy</li>
        <li><a onclick="App.selectTopic('svm')">SVM</a> — Hinge Loss</li>
        <li><a onclick="App.selectTopic('gradient-descent')">Градиентный спуск</a> — как минимизировать loss</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Loss_function" target="_blank">Wikipedia: Loss function</a></li>
        <li><a href="https://ml-cheatsheet.readthedocs.io/en/latest/loss_functions.html" target="_blank">ML Cheatsheet: Loss Functions</a></li>
      </ul>
    `
  }
});
