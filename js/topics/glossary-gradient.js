/* ==========================================================================
   Глоссарий: Градиент
   ========================================================================== */
App.registerTopic({
  id: 'glossary-gradient',
  category: 'glossary',
  title: 'Градиент',
  summary: 'Вектор частных производных — направление самого быстрого роста функции.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты стоишь на горе с закрытыми глазами. Ты хочешь понять, в какую сторону идти, чтобы <b>быстрее всего</b> подняться наверх. Что ты сделаешь? Сделаешь маленький шажок в каждую сторону и почувствуешь, где склон самый крутой. Направление максимального подъёма — это и есть <b>градиент</b>.</p>
        <p>В ML мы обычно хотим <b>минимизировать</b> функцию потерь, а не максимизировать. Поэтому идём в сторону, противоположную градиенту — <b>против градиента</b>. Это и есть градиентный спуск.</p>
      </div>

      <h3>🎯 Определение</h3>
      <p>Для функции нескольких переменных $f(x_1, x_2, \\ldots, x_n)$ <b>градиент</b> — это вектор из её частных производных:</p>
      <div class="math-block">$$\\nabla f = \\left( \\frac{\\partial f}{\\partial x_1},\\ \\frac{\\partial f}{\\partial x_2},\\ \\ldots,\\ \\frac{\\partial f}{\\partial x_n} \\right)$$</div>
      <p>Градиент указывает в сторону <b>самого быстрого роста</b> функции. Противоположный вектор $-\\nabla f$ — в сторону самого быстрого убывания.</p>

      <h3>🔑 Три ключевых свойства</h3>
      <ol>
        <li><b>Направление</b>: градиент показывает, куда функция растёт быстрее всего.</li>
        <li><b>Длина (норма)</b>: $\\|\\nabla f\\|$ — скорость этого роста. Большая норма — крутой склон, маленькая — пологий.</li>
        <li><b>Перпендикулярность линиям уровня</b>: градиент всегда перпендикулярен контурам (линиям, где $f$ = const).</li>
      </ol>

      <h3>📐 Простой пример</h3>
      <p>Функция $f(x, y) = x^2 + 3y^2$. Частные производные:</p>
      <ul>
        <li>$\\frac{\\partial f}{\\partial x} = 2x$</li>
        <li>$\\frac{\\partial f}{\\partial y} = 6y$</li>
      </ul>
      <p>Градиент: $\\nabla f = (2x, 6y)$.</p>
      <p>В точке $(1, 1)$: $\\nabla f = (2, 6)$. Длина: $\\sqrt{4 + 36} \\approx 6.3$. Направление — больше «вверх» (по $y$), чем «вправо» (по $x$) — потому что $y$ имеет больший коэффициент.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Градиент как направление самого быстрого роста</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">Контуры функции f(x,y) = x² + 3y² и градиенты в разных точках</text>

          <!-- Central elliptic contours -->
          <ellipse cx="380" cy="190" rx="200" ry="115" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
          <ellipse cx="380" cy="190" rx="150" ry="87" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
          <ellipse cx="380" cy="190" rx="100" ry="58" fill="none" stroke="#64748b" stroke-width="1.5"/>
          <ellipse cx="380" cy="190" rx="50" ry="29" fill="none" stroke="#475569" stroke-width="1.5"/>
          <circle cx="380" cy="190" r="5" fill="#1e40af"/>
          <text x="380" y="180" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">min</text>

          <!-- Gradient arrows at various points -->
          <!-- Right side point -->
          <circle cx="530" cy="190" r="5" fill="#dc2626"/>
          <line x1="530" y1="190" x2="590" y2="190" stroke="#dc2626" stroke-width="3" marker-end="url(#grad-arr)"/>
          <text x="595" y="188" font-size="11" fill="#dc2626" font-weight="700">∇f</text>

          <!-- Top point -->
          <circle cx="380" cy="100" r="5" fill="#dc2626"/>
          <line x1="380" y1="100" x2="380" y2="40" stroke="#dc2626" stroke-width="3" marker-end="url(#grad-arr)"/>
          <text x="390" y="50" font-size="11" fill="#dc2626" font-weight="700">∇f</text>

          <!-- Diagonal upper right -->
          <circle cx="480" cy="125" r="5" fill="#dc2626"/>
          <line x1="480" y1="125" x2="540" y2="80" stroke="#dc2626" stroke-width="3" marker-end="url(#grad-arr)"/>

          <!-- Left side -->
          <circle cx="230" cy="190" r="5" fill="#dc2626"/>
          <line x1="230" y1="190" x2="170" y2="190" stroke="#dc2626" stroke-width="3" marker-end="url(#grad-arr)"/>

          <!-- Bottom -->
          <circle cx="380" cy="280" r="5" fill="#dc2626"/>
          <line x1="380" y1="280" x2="380" y2="320" stroke="#dc2626" stroke-width="3" marker-end="url(#grad-arr)"/>

          <defs>
            <marker id="grad-arr" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="#dc2626"/>
            </marker>
          </defs>

          <!-- Legend -->
          <text x="380" y="335" text-anchor="middle" font-size="11" fill="#64748b">Каждый градиент перпендикулярен контуру и смотрит «наружу» (в сторону роста f)</text>
        </svg>
        <div class="caption">Контуры функции $f(x,y) = x^2 + 3y^2$ — это эллипсы, вытянутые вдоль оси $x$ (при $y=0$: $|x|=\\sqrt{c}$, а при $x=0$: $|y|=\\sqrt{c/3}$ — то есть по $y$ эллипс у́же в $\\sqrt{3}$ раз, так как $y$ входит с бо́льшим коэффициентом). Красные стрелки — градиенты: они всегда направлены «наружу», перпендикулярно контурам, в сторону возрастания $f$.</div>
      </div>

      <h3>🚀 Градиентный спуск</h3>
      <p>Самый важный практический алгоритм на основе градиента:</p>
      <div class="math-block">$$w_{t+1} = w_t - \\eta \\cdot \\nabla L(w_t)$$</div>
      <p>где $\\eta$ — <b>learning rate</b> (скорость обучения), $L$ — функция потерь. На каждом шаге мы смещаемся в сторону, противоположную градиенту, то есть в сторону минимума.</p>

      <h3>🧮 Как вычислить градиент</h3>
      <h4>Аналитически</h4>
      <p>Берём производные вручную или по правилам. Для $L(w) = (y - w \\cdot x)^2$: $\\frac{\\partial L}{\\partial w} = -2x(y - wx)$.</p>

      <h4>Численно (для проверки)</h4>
      <div class="math-block">$$\\frac{\\partial f}{\\partial x_i} \\approx \\frac{f(x_1, \\ldots, x_i + h, \\ldots, x_n) - f(x_1, \\ldots, x_i - h, \\ldots, x_n)}{2h}$$</div>
      <p>для маленького $h$ (например, $10^{-5}$). Медленно, но полезно для верификации аналитических формул.</p>

      <h4>Автодифференциация (autograd)</h4>
      <p>PyTorch/TensorFlow автоматически вычисляют градиенты через граф вычислений. Ты описываешь forward pass, а backward pass строится сам. Это магия современных фреймворков.</p>

      <h3>🎯 Градиент в глубоком обучении</h3>
      <p>В нейросетях параметров миллионы. Для каждого нужно вычислить $\\partial L / \\partial w_i$. Это делается через <b>backpropagation</b> — эффективное применение chain rule от выхода к входу. Без backprop обучение нейросетей было бы вычислительно невозможно.</p>

      <h3>⚠️ Проблемы градиента</h3>
      <ul>
        <li><b>Vanishing gradient</b>: в глубоких сетях градиент умножается через слои и может становиться исчезающе малым — ранние слои перестают учиться.</li>
        <li><b>Exploding gradient</b>: обратная проблема — градиент «взрывается» до огромных значений, веса разлетаются.</li>
        <li><b>Локальные минимумы</b>: спуск может застрять в неоптимальной точке.</li>
        <li><b>Saddle points</b> (сёдла): где градиент = 0, но это не минимум и не максимум.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('gradient-descent')">Градиентный спуск</a> — главное применение</li>
        <li><a onclick="App.selectTopic('neural-network')">Нейронные сети</a> — backpropagation</li>
        <li><a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> — простейший случай</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Gradient" target="_blank">Wikipedia: Gradient</a></li>
        <li><a href="https://www.youtube.com/watch?v=IHZwWFHWa-w" target="_blank">3Blue1Brown: Gradient descent</a></li>
      </ul>
    `
  }
});
