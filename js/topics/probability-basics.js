/* ==========================================================================
   Вероятность, PDF, CDF — основы теории вероятностей
   ========================================================================== */
App.registerTopic({
  id: 'probability-basics',
  category: 'stats',
  title: 'Вероятность, PDF и CDF',
  summary: 'Случайные величины, функция плотности, функция распределения — фундамент всей статистики.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты бросаешь дротик в мишень с закрытыми глазами. Ты не знаешь, куда он попадёт, но знаешь <b>правила</b>: ближе к центру — вероятнее, чем на краю. Эти «правила» — это и есть распределение вероятностей.</p>
        <p>Теперь два вопроса. Первый: «какова вероятность попасть <b>ровно</b> в точку (3.141592..., 2.718281...)?» Ответ: ноль. Точка бесконечно маленькая. Второй вопрос полезнее: «какова вероятность попасть <b>в область</b> — скажем, в круг радиуса 5 см от центра?» Вот это уже можно посчитать.</p>
        <p>Функция плотности (PDF) описывает, <b>где</b> дротики падают чаще. Функция распределения (CDF) отвечает на вопрос «какова вероятность попасть <b>левее</b> данной точки». Вместе они полностью описывают случайность.</p>
      </div>

      <h3>🎲 Случайная величина — что это</h3>
      <p><span class="term" data-tip="Random variable. Переменная, значение которой определяется случайным экспериментом. До эксперимента мы знаем только возможные значения и их вероятности, но не конкретный результат.">Случайная величина</span> — это число, которое зависит от случая. До эксперимента мы не знаем его точного значения, но знаем <b>правила</b>, по которым оно выбирается.</p>

      <p>Примеры случайных величин:</p>
      <ul>
        <li>Результат броска кубика: может быть 1, 2, 3, 4, 5 или 6.</li>
        <li>Рост случайного человека: может быть ~150–200 см.</li>
        <li>Время ожидания автобуса: от 0 до ∞ минут.</li>
        <li>Число лайков на посте: 0, 1, 2, ...</li>
        <li>Температура завтра: любое число на шкале.</li>
      </ul>

      <p>Случайные величины бывают двух типов:</p>

      <h4>Дискретные</h4>
      <p>Принимают <b>отдельные</b> (счётные) значения: 1, 2, 3... или «да/нет». Между значениями ничего нет.</p>
      <p>Примеры: бросок кубика, число клиентов, количество ошибок, число орлов из 10 бросков монеты.</p>

      <h4>Непрерывные</h4>
      <p>Принимают <b>любое</b> значение на отрезке (или всей числовой прямой). Между любыми двумя значениями есть бесконечно много других.</p>
      <p>Примеры: рост, вес, температура, время, скорость, цена акции.</p>

      <div class="key-concept">
        <div class="kc-label">Почему это важно</div>
        <p>Для дискретных и непрерывных величин используются <b>разные</b> инструменты описания. У дискретных — <b>функция вероятности</b> (PMF). У непрерывных — <b>функция плотности</b> (PDF). Но <b>функция распределения</b> (CDF) работает для обоих типов.</p>
      </div>

      <h3>📊 PMF — для дискретных: «вероятность каждого значения»</h3>
      <p><span class="term" data-tip="Probability Mass Function (PMF). Функция, которая каждому возможному значению дискретной случайной величины ставит в соответствие его вероятность: P(X = x).">PMF</span> (Probability Mass Function) — это функция, которая для каждого возможного значения $x$ возвращает вероятность $P(X = x)$.</p>

      <p>Пример: честный кубик.</p>
      <div class="example-data-table">
        <table>
          <tr><th>x</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
          <tr><td><b>P(X=x)</b></td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td></tr>
        </table>
      </div>

      <p>Свойства PMF:</p>
      <ul>
        <li>Каждая вероятность $\\geq 0$: $P(X = x) \\geq 0$ для всех x.</li>
        <li>Сумма всех вероятностей = 1: $\\sum_{\\text{все } x} P(X = x) = 1$.</li>
      </ul>

      <p>Визуально PMF — это <b>столбиковая диаграмма</b>: высота столбика = вероятность значения.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="16" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">PMF: честный кубик</text>
          <!-- Axes -->
          <line x1="60" y1="165" x2="440" y2="165" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="60" y1="165" x2="60" y2="30" stroke="#94a3b8" stroke-width="1.5"/>
          <!-- Bars -->
          <rect x="80" y="65" width="40" height="100" fill="#3b82f6" opacity="0.7" rx="3"/>
          <rect x="140" y="65" width="40" height="100" fill="#3b82f6" opacity="0.7" rx="3"/>
          <rect x="200" y="65" width="40" height="100" fill="#3b82f6" opacity="0.7" rx="3"/>
          <rect x="260" y="65" width="40" height="100" fill="#3b82f6" opacity="0.7" rx="3"/>
          <rect x="320" y="65" width="40" height="100" fill="#3b82f6" opacity="0.7" rx="3"/>
          <rect x="380" y="65" width="40" height="100" fill="#3b82f6" opacity="0.7" rx="3"/>
          <!-- Labels -->
          <text x="100" y="182" text-anchor="middle" font-size="12" fill="#334155">1</text>
          <text x="160" y="182" text-anchor="middle" font-size="12" fill="#334155">2</text>
          <text x="220" y="182" text-anchor="middle" font-size="12" fill="#334155">3</text>
          <text x="280" y="182" text-anchor="middle" font-size="12" fill="#334155">4</text>
          <text x="340" y="182" text-anchor="middle" font-size="12" fill="#334155">5</text>
          <text x="400" y="182" text-anchor="middle" font-size="12" fill="#334155">6</text>
          <!-- Y label -->
          <text x="45" y="68" text-anchor="end" font-size="10" fill="#64748b">1/6</text>
          <line x1="56" y1="65" x2="60" y2="65" stroke="#94a3b8" stroke-width="1"/>
          <text x="250" y="198" text-anchor="middle" font-size="11" fill="#64748b">x</text>
          <text x="20" y="110" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90, 20, 110)">P(X=x)</text>
        </svg>
        <div class="caption">PMF честного кубика: все 6 значений равновероятны (1/6 каждое). Сумма высот = 1.</div>
      </div>

      <h3>📈 PDF — для непрерывных: «плотность, а не вероятность»</h3>
      <p>Для непрерывной величины вероятность <b>точного</b> значения всегда равна нулю: $P(X = 175.000\\ldots) = 0$. Почему? Потому что значений бесконечно много — если каждому дать ненулевую вероятность, сумма станет бесконечной.</p>

      <p>Вместо вероятности отдельного значения используют <span class="term" data-tip="Probability Density Function (PDF). Функция плотности вероятности f(x). Не вероятность! Вероятность = интеграл плотности по интервалу. PDF может быть > 1.">плотность вероятности</span> $f(x)$ — функцию, которая показывает, <b>насколько «густо»</b> распределены значения в каждой точке.</p>

      <div class="key-concept">
        <div class="kc-label">Ключевое различие</div>
        <p><b>PMF: P(X = x)</b> — конкретная вероятность конкретного значения. Имеет смысл для дискретных.</p>
        <p><b>PDF: f(x)</b> — плотность, не вероятность! Вероятность получается только при <b>интегрировании</b> по интервалу:</p>
        <div class="math-block">$$P(a \\leq X \\leq b) = \\int_a^b f(x) \\, dx$$</div>
        <p>Геометрически: вероятность = <b>площадь под кривой</b> на интервале $[a, b]$.</p>
      </div>

      <p>Свойства PDF:</p>
      <ul>
        <li>$f(x) \\geq 0$ для всех $x$ (плотность не отрицательна).</li>
        <li>Общая площадь под кривой = 1: $\\int_{-\\infty}^{+\\infty} f(x)\\,dx = 1$.</li>
        <li>$f(x)$ <b>может быть больше 1</b>! Это не вероятность, а плотность. Например, для $U(0, 0.5)$ плотность = 2 на всём отрезке.</li>
      </ul>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="pdfFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/></linearGradient>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.6"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.15"/></linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">PDF и площадь = вероятность</text>
          <!-- Axes -->
          <line x1="60" y1="260" x2="720" y2="260" stroke="#475569" stroke-width="1.5"/>
          <line x1="60" y1="260" x2="60" y2="50" stroke="#475569" stroke-width="1.5"/>
          <!-- Bell curve area + outline -->
          <path id="pb-pdf-area" d="" fill="url(#pdfFill)"/>
          <path id="pb-pdf-outline" d="" fill="none" stroke="#3b82f6" stroke-width="2.8"/>
          <!-- Shaded interval [a, b] (path generated separately) -->
          <path id="pb-pdf-interval" d="" fill="url(#areaFill)" stroke="#059669" stroke-width="2.5"/>
          <!-- Vertical drop lines for a and b -->
          <line id="pb-pdf-line-a" x1="0" y1="0" x2="0" y2="0" stroke="#059669" stroke-width="1.5" stroke-dasharray="4,3"/>
          <line id="pb-pdf-line-b" x1="0" y1="0" x2="0" y2="0" stroke="#059669" stroke-width="1.5" stroke-dasharray="4,3"/>
          <!-- a, b labels on axis -->
          <text id="pb-label-a" x="0" y="280" text-anchor="middle" font-size="13" font-weight="700" fill="#059669">a</text>
          <text id="pb-label-b" x="0" y="280" text-anchor="middle" font-size="13" font-weight="700" fill="#059669">b</text>
          <!-- f(x) label at top -->
          <text x="380" y="60" text-anchor="middle" font-size="14" fill="#1e40af" font-weight="700">f(x)</text>
          <!-- Legend with P(a≤X≤b) -->
          <text x="540" y="105" font-size="13" font-weight="700" fill="#059669">P(a ≤ X ≤ b)</text>
          <text x="540" y="125" font-size="12" fill="#047857">= зелёная площадь</text>
          <line x1="540" y1="115" x2="490" y2="180" stroke="#059669" stroke-width="1.5"/>
          <!-- Axis labels -->
          <text x="380" y="305" text-anchor="middle" font-size="13" fill="#64748b">x</text>
          <text x="35" y="155" text-anchor="middle" font-size="13" fill="#64748b" transform="rotate(-90 35 155)">f(x)</text>
        </svg>
        <div class="caption">PDF: кривая показывает плотность. Вероятность P(a ≤ X ≤ b) = зелёная площадь под кривой на этом интервале. Вся площадь под кривой = 1.</div>
        <script>
        (function() {
          var U = App.Util;
          // Bell centered at x=380, baseline 260, peak 70, halfWidth 280
          var cx = 380, baselineY = 260, peakY = 70, halfWidth = 280;
          U.setPath(document, 'pb-pdf-area', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -3, 3));
          U.setPath(document, 'pb-pdf-outline', U.normalOutlinePath(cx, baselineY, peakY, halfWidth));
          // Interval [a, b] = [+0.5σ, +2σ] (right of mean, like in screenshot)
          U.setPath(document, 'pb-pdf-interval', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, 0.5, 2.0));
          // a, b в пиксельных координатах
          var aX = cx + (0.5 / 3) * halfWidth;  // ≈ 426.67
          var bX = cx + (2.0 / 3) * halfWidth;  // ≈ 566.67
          document.getElementById('pb-pdf-line-a').setAttribute('x1', aX);
          document.getElementById('pb-pdf-line-a').setAttribute('y1', baselineY);
          document.getElementById('pb-pdf-line-a').setAttribute('x2', aX);
          document.getElementById('pb-pdf-line-a').setAttribute('y2', baselineY - Math.exp(-0.5 * 0.25) * (baselineY - peakY));
          document.getElementById('pb-pdf-line-b').setAttribute('x1', bX);
          document.getElementById('pb-pdf-line-b').setAttribute('y1', baselineY);
          document.getElementById('pb-pdf-line-b').setAttribute('x2', bX);
          document.getElementById('pb-pdf-line-b').setAttribute('y2', baselineY - Math.exp(-0.5 * 4) * (baselineY - peakY));
          document.getElementById('pb-label-a').setAttribute('x', aX);
          document.getElementById('pb-label-b').setAttribute('x', bX);
        })();
        </script>
      </div>

      <h3>📉 CDF — «какова вероятность быть ≤ x»</h3>
      <p><span class="term" data-tip="Cumulative Distribution Function (CDF). Функция распределения F(x) = P(X ≤ x). Показывает вероятность того, что случайная величина не превышает x. Работает для любых типов распределений.">CDF</span> (Cumulative Distribution Function) — функция распределения. Она отвечает на вопрос: «какова вероятность, что $X$ окажется <b>не больше</b> $x$?»</p>

      <div class="math-block">$$F(x) = P(X \\leq x)$$</div>

      <p>Для <b>дискретной</b> величины:</p>
      <div class="math-block">$$F(x) = \\sum_{x_i \\leq x} P(X = x_i)$$</div>
      <p>Для <b>непрерывной</b>:</p>
      <div class="math-block">$$F(x) = \\int_{-\\infty}^{x} f(t)\\,dt$$</div>

      <p><b>Пример:</b> бросок кубика.</p>
      <div class="example-data-table">
        <table>
          <tr><th>x</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
          <tr><td><b>P(X=x)</b></td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td><td>1/6</td></tr>
          <tr><td><b>F(x)=P(X≤x)</b></td><td>1/6</td><td>2/6</td><td>3/6</td><td>4/6</td><td>5/6</td><td>6/6</td></tr>
        </table>
      </div>
      <p>$F(3) = P(X \\leq 3) = 3/6 = 0.5$. Вероятность выбросить 3 или меньше — 50%.</p>

      <h4>Свойства CDF</h4>
      <ul>
        <li>$F(x)$ <b>неубывающая</b>: если $a < b$, то $F(a) \\leq F(b)$.</li>
        <li>$F(-\\infty) = 0$: вероятность быть «меньше всего» = 0.</li>
        <li>$F(+\\infty) = 1$: вероятность быть «не больше +∞» = 1 (достоверное событие).</li>
        <li>Для непрерывной: $F(x)$ — <b>гладкая</b> кривая от 0 до 1.</li>
        <li>Для дискретной: $F(x)$ — <b>ступенчатая</b> функция.</li>
      </ul>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <text x="260" y="16" text-anchor="middle" font-size="13" font-weight="600" fill="#1e293b">CDF: дискретная (кубик) vs непрерывная (нормальная)</text>
          <!-- Left: discrete -->
          <line x1="30" y1="170" x2="230" y2="170" stroke="#94a3b8" stroke-width="1"/>
          <line x1="30" y1="170" x2="30" y2="30" stroke="#94a3b8" stroke-width="1"/>
          <text x="130" y="192" text-anchor="middle" font-size="10" fill="#64748b">Дискретная (ступеньки)</text>
          <!-- Steps -->
          <line x1="30" y1="170" x2="55" y2="170" stroke="#3b82f6" stroke-width="2"/>
          <line x1="55" y1="170" x2="55" y2="147" stroke="#3b82f6" stroke-width="2"/>
          <line x1="55" y1="147" x2="90" y2="147" stroke="#3b82f6" stroke-width="2"/>
          <line x1="90" y1="147" x2="90" y2="123" stroke="#3b82f6" stroke-width="2"/>
          <line x1="90" y1="123" x2="125" y2="123" stroke="#3b82f6" stroke-width="2"/>
          <line x1="125" y1="123" x2="125" y2="100" stroke="#3b82f6" stroke-width="2"/>
          <line x1="125" y1="100" x2="160" y2="100" stroke="#3b82f6" stroke-width="2"/>
          <line x1="160" y1="100" x2="160" y2="76" stroke="#3b82f6" stroke-width="2"/>
          <line x1="160" y1="76" x2="195" y2="76" stroke="#3b82f6" stroke-width="2"/>
          <line x1="195" y1="76" x2="195" y2="53" stroke="#3b82f6" stroke-width="2"/>
          <line x1="195" y1="53" x2="230" y2="53" stroke="#3b82f6" stroke-width="2"/>
          <!-- Y ticks -->
          <text x="24" y="172" text-anchor="end" font-size="9" fill="#64748b">0</text>
          <text x="24" y="56" text-anchor="end" font-size="9" fill="#64748b">1</text>
          <!-- Right: continuous -->
          <line x1="280" y1="170" x2="490" y2="170" stroke="#94a3b8" stroke-width="1"/>
          <line x1="280" y1="170" x2="280" y2="30" stroke="#94a3b8" stroke-width="1"/>
          <text x="385" y="192" text-anchor="middle" font-size="10" fill="#64748b">Непрерывная (S-кривая)</text>
          <!-- S-curve -->
          <path d="M280,168 C300,167 320,165 340,158 C355,150 365,135 375,115 C385,90 390,70 395,60 C400,52 410,48 420,46 C440,44 460,43 490,43" fill="none" stroke="#10b981" stroke-width="2.5"/>
          <!-- Y ticks -->
          <text x="274" y="172" text-anchor="end" font-size="9" fill="#64748b">0</text>
          <text x="274" y="48" text-anchor="end" font-size="9" fill="#64748b">1</text>
          <!-- Dashed lines for F(x)=0.5 -->
          <line x1="280" y1="107" x2="378" y2="107" stroke="#64748b" stroke-width="1" stroke-dasharray="3"/>
          <line x1="378" y1="107" x2="378" y2="170" stroke="#64748b" stroke-width="1" stroke-dasharray="3"/>
          <text x="381" y="180" font-size="9" fill="#64748b">median</text>
          <text x="274" y="110" text-anchor="end" font-size="9" fill="#64748b">0.5</text>
        </svg>
        <div class="caption">CDF: слева — ступенчатая (дискретная, кубик), справа — гладкая S-кривая (непрерывная, нормальная). Обе идут от 0 до 1.</div>
      </div>

      <h3>🔄 Связь PDF и CDF</h3>
      <p>PDF и CDF — две стороны одной медали:</p>

      <div class="math-block">$$F(x) = \\int_{-\\infty}^{x} f(t)\\,dt \\quad \\Longleftrightarrow \\quad f(x) = F'(x)$$</div>

      <ul>
        <li><b>CDF — интеграл PDF:</b> накопили площадь под кривой плотности → получили CDF.</li>
        <li><b>PDF — производная CDF:</b> где CDF растёт быстро — там плотность высокая. Где плоская — плотность ≈ 0.</li>
      </ul>

      <p>Это как связь «скорость — путь»: скорость (PDF) интегрируется в пройденный путь (CDF), а путь (CDF) дифференцируется в скорость (PDF).</p>

      <h3>🧮 Как считать вероятности через CDF</h3>
      <p>CDF — главный инструмент для вычисления вероятностей:</p>

      <div class="math-block">$$P(X \\leq a) = F(a)$$</div>
      <div class="math-block">$$P(X > a) = 1 - F(a)$$</div>
      <div class="math-block">$$P(a \\leq X \\leq b) = F(b) - F(a)$$</div>

      <p><b>Пример:</b> нормальное $N(0, 1)$. $F(1.96) \\approx 0.975$.</p>
      <ul>
        <li>$P(X \\leq 1.96) = 0.975$.</li>
        <li>$P(X > 1.96) = 1 - 0.975 = 0.025$.</li>
        <li>$P(-1.96 \\leq X \\leq 1.96) = F(1.96) - F(-1.96) = 0.975 - 0.025 = 0.95$.</li>
      </ul>

      <div class="callout tip">💡 Именно так получается правило 95%: 95% значений стандартной нормальной лежат в $[-1.96, 1.96]$. Это напрямую из CDF.</div>

      <h3>🎯 Квантили — «обратная CDF»</h3>
      <p><span class="term" data-tip="Quantile. Квантиль уровня q — значение x_q, такое что P(X ≤ x_q) = q. Обратная функция к CDF.">Квантиль</span> уровня $q$ — это значение $x_q$, при котором $F(x_q) = q$. То есть «ниже $x_q$ лежит $q$ доля данных».</p>

      <div class="math-block">$$x_q = F^{-1}(q)$$</div>

      <ul>
        <li><b>Медиана</b> = квантиль 0.5 ($F^{-1}(0.5)$).</li>
        <li><b>Q1</b> = квантиль 0.25, <b>Q3</b> = квантиль 0.75.</li>
        <li><b>Перцентиль 95</b> = квантиль 0.95 ($F^{-1}(0.95)$).</li>
      </ul>

      <p>Квантили широко используются:</p>
      <ul>
        <li>В <b><a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">доверительных интервалах</a></b>: $z_{0.975} = 1.96$ для 95% <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">CI</a>.</li>
        <li>В <b>SLA мониторинге</b>: p50, p95, p99 задержек.</li>
        <li>В <b>проверке гипотез</b>: критические значения t, z, $\\chi^2$.</li>
      </ul>

      <h3>📐 Математическое ожидание и дисперсия</h3>
      <p>Два главных числа, характеризующих распределение:</p>

      <h4>Математическое ожидание (среднее, μ)</h4>
      <p>«Центр тяжести» распределения — если бы вы повторяли эксперимент бесконечно, среднее результатов стремилось бы к $\\mu$.</p>
      <div class="math-block">$$\\mu = E[X] = \\begin{cases} \\sum_x x \\cdot P(X=x) & \\text{дискретная} \\\\ \\int_{-\\infty}^{+\\infty} x \\cdot f(x)\\,dx & \\text{непрерывная} \\end{cases}$$</div>

      <h4>Дисперсия (σ²) и стандартное отклонение (σ)</h4>
      <p>«Разброс» вокруг среднего:</p>
      <div class="math-block">$$\\sigma^2 = \\text{Var}(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$$</div>
      <div class="math-block">$$\\sigma = \\sqrt{\\text{Var}(X)}$$</div>

      <p>$\\sigma$ имеет те же единицы, что и $X$ — удобно для интерпретации.</p>

      <h3>🔬 Примеры: PDF и CDF конкретных распределений</h3>

      <h4>Равномерное $U(a, b)$</h4>
      <div class="math-block">$$f(x) = \\begin{cases} \\frac{1}{b-a}, & a \\leq x \\leq b \\\\ 0, & \\text{иначе} \\end{cases} \\qquad F(x) = \\begin{cases} 0, & x < a \\\\ \\frac{x-a}{b-a}, & a \\leq x \\leq b \\\\ 1, & x > b \\end{cases}$$</div>
      <p>PDF = горизонтальная линия, CDF = прямая линия от 0 до 1.</p>

      <h4>Экспоненциальное $\\text{Exp}(\\lambda)$</h4>
      <div class="math-block">$$f(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0 \\qquad F(x) = 1 - e^{-\\lambda x}$$</div>
      <p>PDF убывает экспоненциально, CDF — растёт и насыщается к 1.</p>

      <h4>Нормальное $N(\\mu, \\sigma^2)$</h4>
      <div class="math-block">$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$</div>
      <p>PDF = знаменитый колокол. CDF — гладкая S-кривая (нет простой формулы, считают численно или по таблицам).</p>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«PDF — это вероятность»</b> — нет! PDF — это плотность. Вероятность = <b>интеграл</b> плотности. PDF может быть > 1.</li>
        <li><b>«P(X = 5) для непрерывной = f(5)»</b> — нет. $P(X = 5) = 0$ для любого конкретного значения. $f(5)$ — плотность в точке 5.</li>
        <li><b>«CDF может убывать»</b> — нет, CDF строго неубывающая. $F(a) \\leq F(b)$ при $a < b$.</li>
        <li><b>«PMF и PDF — одно и то же»</b> — нет. PMF для дискретных (вероятность), PDF для непрерывных (плотность).</li>
        <li><b>«Квантиль 0.95 = 95% значений»</b> — почти: ниже квантиля 0.95 лежит 95% распределения.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: совместное распределение двух величин</summary>
        <div class="deep-dive-body">
          <p>Если у нас две случайные величины $X$ и $Y$, их совместное распределение описывается:</p>
          <ul>
            <li><b>Совместная PMF/PDF:</b> $f(x, y)$ — плотность в точке $(x, y)$.</li>
            <li><b>Маргинальная:</b> $f_X(x) = \\int f(x, y)\\,dy$ — распределение одной из них.</li>
            <li><b>Условная:</b> $f(y|x) = f(x,y) / f_X(x)$ — распределение Y при фиксированном X.</li>
          </ul>
          <p><b>Независимость:</b> X и Y независимы, если $f(x, y) = f_X(x) \\cdot f_Y(y)$.</p>
          <p>Это основа для байесовских моделей, регрессии и теории вероятностей в целом.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: закон неосознанного статистика (LOTUS)</summary>
        <div class="deep-dive-body">
          <p>Если $g(X)$ — функция от случайной величины, её ожидание:</p>
          <div class="math-block">$$E[g(X)] = \\int g(x) f(x)\\,dx$$</div>
          <p>Не нужно находить распределение $g(X)$ отдельно! Это «закон неосознанного статистика» (Law of the Unconscious Statistician, LOTUS) — один из самых полезных фактов теории вероятностей.</p>
          <p>Пример: $E[X^2] = \\int x^2 f(x)\\,dx$. Используется для вычисления дисперсии через $\\text{Var} = E[X^2] - (E[X])^2$.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: генерация случайных чисел из любого распределения</summary>
        <div class="deep-dive-body">
          <p>Если $U \\sim U(0, 1)$ — равномерная на $[0, 1]$, то $X = F^{-1}(U)$ имеет распределение с CDF $F$.</p>
          <p>Это <span class="term" data-tip="Inverse Transform Sampling. Метод генерации случайных чисел: берём U~Uniform[0,1], применяем обратную CDF — получаем нужное распределение.">метод обратного преобразования</span>. Из одного равномерного генератора можно получить <b>любое</b> распределение, если знаем его CDF.</p>
          <p>Так работают rand()/random() в компьютерах: генерируют равномерное, потом преобразуют в нужное.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Описательная статистика</b> — среднее, дисперсия, квантили — всё определяется через PDF/CDF.</li>
        <li><b>Распределения</b> — нормальное, биномиальное и т.д. — конкретные семейства PDF/PMF.</li>
        <li><b>ЦПТ</b> — говорит, что CDF выборочного среднего стремится к CDF нормального.</li>
        <li><b>Проверка гипотез</b> — p-value = площадь хвоста под PDF тестовой статистики.</li>
        <li><b>Байесовские модели</b> — prior и posterior — это PDF параметров.</li>
        <li><b>Логистическая регрессия</b> — <a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">сигмоида</a> это CDF логистического распределения.</li>
      </ul>
    `,

    examples: [
      {
        title: 'PMF и CDF кубика',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Бросаем честный кубик. Найти PMF, CDF, P(X ≤ 4), P(2 ≤ X ≤ 5), E[X] и Var(X).</p>
          </div>

          <div class="step" data-step="1">
            <h4>PMF (функция вероятности)</h4>
            <p>Кубик честный → каждое значение с вероятностью 1/6:</p>
            <div class="calc">P(X=1) = P(X=2) = ... = P(X=6) = 1/6 ≈ 0.167</div>
            <div class="why">Всего 6 исходов, все равновероятны. Сумма: 6 × 1/6 = 1. Корректно.</div>
          </div>

          <div class="step" data-step="2">
            <h4>CDF (функция распределения)</h4>
            <p>Накапливаем вероятности:</p>
            <div class="calc">F(1) = P(X≤1) = 1/6 ≈ 0.167
F(2) = P(X≤2) = 2/6 ≈ 0.333
F(3) = P(X≤3) = 3/6 = 0.500
F(4) = P(X≤4) = 4/6 ≈ 0.667
F(5) = P(X≤5) = 5/6 ≈ 0.833
F(6) = P(X≤6) = 6/6 = 1.000</div>
          </div>

          <div class="step" data-step="3">
            <h4>P(X ≤ 4)</h4>
            <div class="calc">P(X ≤ 4) = F(4) = 4/6 = <b>2/3 ≈ 0.667</b></div>
          </div>

          <div class="step" data-step="4">
            <h4>P(2 ≤ X ≤ 5)</h4>
            <div class="calc">P(2 ≤ X ≤ 5) = F(5) − F(1) = 5/6 − 1/6 = <b>4/6 = 2/3 ≈ 0.667</b></div>
            <div class="why">Вычитаем F(1), а не F(2), потому что нижняя граница включена: нам нужны значения 2, 3, 4, 5.</div>
          </div>

          <div class="step" data-step="5">
            <h4>E[X] — математическое ожидание</h4>
            <div class="calc">E[X] = 1·(1/6) + 2·(1/6) + 3·(1/6) + 4·(1/6) + 5·(1/6) + 6·(1/6)
     = (1+2+3+4+5+6) / 6 = 21/6 = <b>3.5</b></div>
          </div>

          <div class="step" data-step="6">
            <h4>Var(X) — дисперсия</h4>
            <div class="calc">E[X²] = (1²+2²+3²+4²+5²+6²)/6 = (1+4+9+16+25+36)/6 = 91/6 ≈ 15.17

Var(X) = E[X²] − (E[X])² = 15.17 − 3.5² = 15.17 − 12.25 = <b>2.92</b>

σ = √2.92 ≈ <b>1.71</b></div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>PMF: все по 1/6. P(X≤4) = <b>2/3</b>. P(2≤X≤5) = <b>2/3</b>. E[X] = <b>3.5</b>. σ ≈ <b>1.71</b>.</p>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="15" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">CDF честного кубика (ступенчатая функция)</text>
              <!-- axes -->
              <line x1="50" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="50" y1="130" x2="50" y2="25" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- y-ticks: 0,1/6,2/6..6/6 mapped to y: 130→0, 25→1 -->
              <!-- y = 130 - prob*105 -->
              <!-- steps: x positions for dice values 1..6 spaced at 60px each starting at x=90 -->
              <!-- before 1: F=0 -->
              <line x1="50" y1="130" x2="90" y2="130" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- jump at 1 to 1/6 -->
              <line x1="90" y1="130" x2="90" y2="112" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="90" cy="130" r="3.5" fill="white" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="90" cy="112" r="3.5" fill="#3b82f6"/>
              <line x1="90" y1="112" x2="150" y2="112" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- jump at 2 to 2/6 -->
              <line x1="150" y1="112" x2="150" y2="95" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="150" cy="112" r="3.5" fill="white" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="150" cy="95" r="3.5" fill="#3b82f6"/>
              <line x1="150" y1="95" x2="210" y2="95" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- jump at 3 to 3/6=0.5 -->
              <line x1="210" y1="95" x2="210" y2="77" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="210" cy="95" r="3.5" fill="white" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="210" cy="77" r="3.5" fill="#3b82f6"/>
              <line x1="210" y1="77" x2="270" y2="77" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- jump at 4 to 4/6 -->
              <line x1="270" y1="77" x2="270" y2="60" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="270" cy="77" r="3.5" fill="white" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="270" cy="60" r="3.5" fill="#3b82f6"/>
              <line x1="270" y1="60" x2="330" y2="60" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- jump at 5 to 5/6 -->
              <line x1="330" y1="60" x2="330" y2="42" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="330" cy="60" r="3.5" fill="white" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="330" cy="42" r="3.5" fill="#3b82f6"/>
              <line x1="330" y1="42" x2="390" y2="42" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- jump at 6 to 6/6=1 -->
              <line x1="390" y1="42" x2="390" y2="25" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="390" cy="42" r="3.5" fill="white" stroke="#3b82f6" stroke-width="2"/>
              <circle cx="390" cy="25" r="3.5" fill="#3b82f6"/>
              <line x1="390" y1="25" x2="430" y2="25" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- x labels -->
              <text x="90"  y="145" text-anchor="middle" font-size="11" fill="#334155">1</text>
              <text x="150" y="145" text-anchor="middle" font-size="11" fill="#334155">2</text>
              <text x="210" y="145" text-anchor="middle" font-size="11" fill="#334155">3</text>
              <text x="270" y="145" text-anchor="middle" font-size="11" fill="#334155">4</text>
              <text x="330" y="145" text-anchor="middle" font-size="11" fill="#334155">5</text>
              <text x="390" y="145" text-anchor="middle" font-size="11" fill="#334155">6</text>
              <!-- y labels -->
              <text x="44" y="133" text-anchor="end" font-size="9" fill="#64748b">0</text>
              <text x="44" y="115" text-anchor="end" font-size="9" fill="#64748b">1/6</text>
              <text x="44" y="80" text-anchor="end" font-size="9" fill="#64748b">1/2</text>
              <text x="44" y="28" text-anchor="end" font-size="9" fill="#64748b">1</text>
              <line x1="46" y1="77" x2="50" y2="77" stroke="#94a3b8" stroke-width="1"/>
              <line x1="46" y1="25" x2="50" y2="25" stroke="#94a3b8" stroke-width="1"/>
            </svg>
            <div class="caption">CDF кубика — ступенчатая функция: на каждом значении 1..6 делает прыжок вверх на 1/6. F(3)=0.5 означает: вероятность выбросить 3 или меньше равна 50%.</div>
          </div>

          <div class="lesson-box">CDF — накопленная сумма PMF. Вероятность интервала = разность CDF на концах.</div>
        `
      },
      {
        title: 'PDF нормального: площадь под кривой',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Рост мужчин ~ N(175, 7²). Какова вероятность, что случайный мужчина имеет рост от 168 до 182 см? А больше 189?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Стандартизуем (z-score)</h4>
            <p>Переводим в стандартное нормальное N(0,1):</p>
            <div class="calc">z = (x − μ) / σ

z₁ = (168 − 175) / 7 = −1.0
z₂ = (182 − 175) / 7 = +1.0
z₃ = (189 − 175) / 7 = +2.0</div>
            <div class="why">Z-score показывает, на сколько стандартных отклонений значение отличается от среднего. Это позволяет использовать одну таблицу для любого нормального распределения.</div>
          </div>

          <div class="step" data-step="2">
            <h4>P(168 ≤ X ≤ 182) через CDF</h4>
            <div class="calc">P(168 ≤ X ≤ 182) = P(−1 ≤ Z ≤ 1)
  = F(1) − F(−1)
  = 0.8413 − 0.1587
  = <b>0.6826 ≈ 68.3%</b></div>
            <p>Это и есть правило «68%»: в пределах ±1σ лежит ~68% значений.</p>
          </div>

          <div class="step" data-step="3">
            <h4>P(X > 189)</h4>
            <div class="calc">P(X > 189) = P(Z > 2) = 1 − F(2)
  = 1 − 0.9772
  = <b>0.0228 ≈ 2.3%</b></div>
            <p>Только ~2.3% мужчин выше 189 см.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>P(168–182 см) ≈ <b>68.3%</b>. P(>189 см) ≈ <b>2.3%</b>. Всё через CDF стандартного нормального.</p>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 460 175" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <linearGradient id="pbN175Fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.55"/>
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.1"/>
                </linearGradient>
              </defs>
              <text x="230" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">N(175, 7²): P(168 ≤ X ≤ 182) ≈ 68%</text>
              <!-- axis -->
              <line x1="30" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- shaded area (from z=-1 to z=+1) and bell outline set via JS -->
              <path id="pbN175Area" d="" fill="url(#pbN175Fill)"/>
              <path id="pbN175Curve" d="" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- vertical dashed lines at 168 (z=-1, x=190) and 182 (z=+1, x=270) -->
              <line x1="190" y1="52" x2="190" y2="130" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
              <line x1="270" y1="52" x2="270" y2="130" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
              <!-- μ line -->
              <line x1="230" y1="30" x2="230" y2="130" stroke="#64748b" stroke-width="1" stroke-dasharray="3,2"/>
              <!-- labels -->
              <text x="190" y="148" text-anchor="middle" font-size="11" fill="#059669" font-weight="600">168</text>
              <text x="230" y="148" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">μ=175</text>
              <text x="270" y="148" text-anchor="middle" font-size="11" fill="#059669" font-weight="600">182</text>
              <!-- z scores below numbers -->
              <text x="190" y="162" text-anchor="middle" font-size="9" fill="#10b981">z=−1</text>
              <text x="270" y="162" text-anchor="middle" font-size="9" fill="#10b981">z=+1</text>
              <!-- annotation -->
              <text x="230" y="95" text-anchor="middle" font-size="14" font-weight="700" fill="#059669">68%</text>
            </svg>
            <script>
            (function() {
              var U = App.Util;
              U.setPath(document, 'pbN175Curve', U.normalOutlinePath(230, 130, 30, 120));
              U.setPath(document, 'pbN175Area',  U.normalSegmentPath(230, 130, 30, 120, -1, 1));
            })();
            </script>
            <div class="caption">Нормальное распределение N(175, 7²): зелёная зона — P(168 ≤ X ≤ 182) = P(−1 ≤ Z ≤ +1) ≈ 68%. Примерно двое из трёх мужчин имеют рост в этом диапазоне.</div>
          </div>

          <div class="lesson-box">Для нормального: стандартизуй через z = (x−μ)/σ, потом используй таблицу или функцию CDF. Вероятность интервала = F(b) − F(a).</div>
        `
      },
      {
        title: 'Квантили: обратная CDF',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Время загрузки страницы ~ Exp(λ=0.5). Найти медиану и 95-й перцентиль (p95). Какое время гарантирует, что 95% загрузок быстрее?</p>
          </div>

          <div class="step" data-step="1">
            <h4>CDF экспоненциального</h4>
            <div class="calc">F(t) = 1 − e^(−λt) = 1 − e^(−0.5t)</div>
          </div>

          <div class="step" data-step="2">
            <h4>Медиана: F(t) = 0.5</h4>
            <div class="calc">1 − e^(−0.5t) = 0.5
e^(−0.5t) = 0.5
−0.5t = ln(0.5) = −0.693
t = 0.693 / 0.5 = <b>1.386 сек</b></div>
            <div class="why">Медиана — квантиль 0.5: половина загрузок быстрее 1.39 сек, половина медленнее. Заметь: среднее = 1/λ = 2 сек, а медиана = 1.39 — они разные, потому что экспоненциальное скошено вправо.</div>
          </div>

          <div class="step" data-step="3">
            <h4>p95: F(t) = 0.95</h4>
            <div class="calc">1 − e^(−0.5t) = 0.95
e^(−0.5t) = 0.05
−0.5t = ln(0.05) = −2.996
t = 2.996 / 0.5 = <b>5.99 сек</b></div>
            <p>95% загрузок быстрее ~6 сек. Если SLA = «p95 < 6 сек», то мы на грани.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Медиана = <b>1.39 сек</b>. p95 = <b>5.99 сек</b>. Среднее = 2 сек (больше медианы из-за правого скоса).</p>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/>
                </linearGradient>
              </defs>
              <text x="230" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">CDF Exp(0.5): квантили p50 и p95</text>
              <!-- axes -->
              <line x1="50" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="50" y1="130" x2="50" y2="20" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- CDF curve F(t) = 1 - e^(-0.5t), t from 0 to 12 -->
              <!-- map t→x: x=50+t*(380/12), F→y: y=130-F*110 -->
              <!-- t=0→F=0, t=1.39→F=0.5, t=6→F=0.95, t=12→F≈0.998 -->
              <path d="M50,130 C70,100 90,75 120,56 C150,39 180,30 210,24 C240,20 280,18 320,17 C360,16 400,16 430,16" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- p50 line: F=0.5 → y=130-55=75, t=1.39 → x=50+1.39*31.67≈94 -->
              <line x1="50" y1="75" x2="94" y2="75" stroke="#10b981" stroke-width="1.8" stroke-dasharray="5,3"/>
              <line x1="94" y1="75" x2="94" y2="130" stroke="#10b981" stroke-width="1.8" stroke-dasharray="5,3"/>
              <circle cx="94" cy="75" r="4" fill="#10b981"/>
              <text x="44" y="78" text-anchor="end" font-size="10" font-weight="600" fill="#10b981">0.50</text>
              <text x="94" y="145" text-anchor="middle" font-size="10" font-weight="600" fill="#10b981">1.39</text>
              <!-- p95 line: F=0.95 → y=130-104.5=25.5, t=5.99 → x=50+5.99*31.67≈240 -->
              <line x1="50" y1="25" x2="240" y2="25" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="5,3"/>
              <line x1="240" y1="25" x2="240" y2="130" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="5,3"/>
              <circle cx="240" cy="25" r="4" fill="#f59e0b"/>
              <text x="44" y="28" text-anchor="end" font-size="10" font-weight="600" fill="#f59e0b">0.95</text>
              <text x="240" y="145" text-anchor="middle" font-size="10" font-weight="600" fill="#f59e0b">5.99</text>
              <!-- axis labels -->
              <text x="44" y="133" text-anchor="end" font-size="9" fill="#64748b">0</text>
              <text x="44" y="20" text-anchor="end" font-size="9" fill="#64748b">1</text>
              <text x="240" y="158" text-anchor="middle" font-size="10" fill="#64748b">t (сек)</text>
              <!-- legend -->
              <rect x="280" y="48" width="12" height="3" fill="#10b981"/>
              <text x="296" y="53" font-size="10" fill="#10b981">медиана p50 = 1.39 сек</text>
              <rect x="280" y="65" width="12" height="3" fill="#f59e0b"/>
              <text x="296" y="70" font-size="10" fill="#f59e0b">p95 = 5.99 сек</text>
            </svg>
            <div class="caption">CDF экспоненциального Exp(λ=0.5). Горизонтальные линии показывают вероятности 0.5 и 0.95, вертикальные — соответствующие квантили. p50≈1.39 сек (медиана), p95≈5.99 сек.</div>
          </div>

          <div class="lesson-box">Квантиль = обратная CDF: F⁻¹(q). Для мониторинга систем p50/p95/p99 важнее среднего — они показывают «хвост» задержек.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: бросок кубика и закон больших чисел</h3>
        <p>Увеличивай число бросков и наблюдай, как среднее сходится к 3.5.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dice-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dice-regen">🔄 Бросить заново</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="dice-hist"></canvas></div>
            <div class="sim-chart-wrap"><canvas id="dice-avg"></canvas></div>
            <div class="sim-stats" id="dice-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dice-controls');
        const cN = App.makeControl('range', 'dice-n', 'Число бросков', { min: 10, max: 5000, step: 10, value: 100 });
        [cN].forEach(c => controls.appendChild(c.wrap));

        let histChart = null, avgChart = null;

        function run() {
          const n = +cN.input.value;
          const rolls = [];
          for (let i = 0; i < n; i++) rolls.push(Math.floor(Math.random() * 6) + 1);

          // histogram counts
          const counts = [0, 0, 0, 0, 0, 0];
          for (const r of rolls) counts[r - 1]++;

          // running average
          const runAvg = [];
          let sum = 0;
          for (let i = 0; i < n; i++) {
            sum += rolls[i];
            runAvg.push(sum / (i + 1));
          }
          const labels = Array.from({ length: n }, (_, i) => i + 1);
          // downsample for performance
          const step = Math.max(1, Math.floor(n / 300));
          const dsLabels = [], dsAvg = [], dsRef = [];
          for (let i = 0; i < n; i += step) {
            dsLabels.push(labels[i]);
            dsAvg.push(runAvg[i]);
            dsRef.push(3.5);
          }

          const ctxH = container.querySelector('#dice-hist').getContext('2d');
          if (histChart) histChart.destroy();
          histChart = new Chart(ctxH, {
            type: 'bar',
            data: {
              labels: ['1', '2', '3', '4', '5', '6'],
              datasets: [{
                label: 'Частота',
                data: counts,
                backgroundColor: 'rgba(99,102,241,0.6)',
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Гистограмма граней' } },
              scales: { y: { beginAtZero: true } },
            },
          });
          App.registerChart(histChart);

          const ctxA = container.querySelector('#dice-avg').getContext('2d');
          if (avgChart) avgChart.destroy();
          avgChart = new Chart(ctxA, {
            type: 'line',
            data: {
              labels: dsLabels,
              datasets: [
                { label: 'Среднее', data: dsAvg, borderColor: 'rgba(59,130,246,0.9)', borderWidth: 2, pointRadius: 0, fill: false },
                { label: 'Теорет. (3.5)', data: dsRef, borderColor: 'rgba(239,68,68,0.7)', borderWidth: 2, borderDash: [6, 3], pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Среднее по ходу бросков' } },
              scales: { x: { title: { display: true, text: 'Бросок' } }, y: { min: 1, max: 6 } },
            },
          });
          App.registerChart(avgChart);

          const empMean = App.Util.mean(rolls);
          container.querySelector('#dice-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Эмпир. среднее</div><div class="stat-value">${empMean.toFixed(3)}</div></div>
            <div class="stat-card"><div class="stat-label">Теорет. среднее</div><div class="stat-value">3.500</div></div>
            <div class="stat-card"><div class="stat-label">Разница</div><div class="stat-value">${Math.abs(empMean - 3.5).toFixed(3)}</div></div>
          `;
        }

        cN.input.addEventListener('input', run);
        container.querySelector('#dice-regen').onclick = run;
        run();
      },
    },

    python: `
      <h3>📊 Вероятность и распределения в Python</h3>
      <pre><code>from scipy import stats
import numpy as np

# Нормальное распределение N(μ=100, σ=15)
norm = stats.norm(loc=100, scale=15)

# PDF — плотность в точке
print(f"PDF(100): {norm.pdf(100):.4f}")  # максимум в μ
print(f"PDF(85):  {norm.pdf(85):.4f}")

# CDF — вероятность P(X ≤ x)
print(f"P(X ≤ 115): {norm.cdf(115):.4f}")  # ~84.1%
print(f"P(X > 130):  {1 - norm.cdf(130):.4f}")  # ~2.3%

# PPF — обратная CDF (квантиль)
print(f"Квантиль 95%: {norm.ppf(0.95):.1f}")
print(f"Квантиль 99%: {norm.ppf(0.99):.1f}")</code></pre>

      <h3>📈 Визуализация PDF и CDF</h3>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

norm = stats.norm(loc=100, scale=15)
x = np.linspace(50, 150, 300)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# PDF
ax1.plot(x, norm.pdf(x), 'b-', lw=2)
ax1.fill_between(x, norm.pdf(x), where=(x >= 85) & (x <= 115),
                 alpha=0.3, label='μ ± σ (68.3%)')
ax1.set_title("PDF — плотность вероятности")
ax1.legend()

# CDF
ax2.plot(x, norm.cdf(x), 'r-', lw=2)
ax2.axhline(0.5, color='gray', linestyle='--', alpha=0.5)
ax2.axvline(100, color='gray', linestyle='--', alpha=0.5)
ax2.set_title("CDF — функция распределения")

plt.tight_layout()
plt.show()</code></pre>

      <h3>🎲 Условная вероятность и Байес</h3>
      <pre><code># Теорема Байеса: тест на болезнь
# P(болезнь) = 1%, чувствительность = 95%, специфичность = 90%

p_disease = 0.01
sensitivity = 0.95  # P(+|болезнь)
specificity = 0.90  # P(-|здоров)

# P(+ тест)
p_positive = sensitivity * p_disease + (1 - specificity) * (1 - p_disease)

# P(болезнь | + тест) — теорема Байеса
p_disease_given_pos = (sensitivity * p_disease) / p_positive

print(f"P(болезнь | +тест) = {p_disease_given_pos:.1%}")
# Всего ~8.8%! Даже с хорошим тестом</code></pre>
    `,

    applications: `
      <h3>Где это используется</h3>
      <table>
        <tr><th>Область</th><th>Применение</th></tr>
        <tr><td><b>A/B тестирование</b></td><td>Вероятность того, что B лучше A, p-value как условная вероятность данных при H₀</td></tr>
        <tr><td><b>Машинное обучение</b></td><td>Классификаторы возвращают P(class | features), Naive Bayes напрямую использует условные вероятности</td></tr>
        <tr><td><b>Медицинская диагностика</b></td><td>Теорема Байеса: P(болезнь | тест+) с учётом чувствительности и специфичности</td></tr>
        <tr><td><b>Надёжность и SLA</b></td><td>Квантили задержек (p50, p95, p99), uptime = P(система работает)</td></tr>
        <tr><td><b>Страхование и финансы</b></td><td>Ожидаемые потери E[L], Value at Risk (квантиль распределения убытков)</td></tr>
        <tr><td><b>Контроль качества</b></td><td>Вероятность дефекта, биномиальное распределение для доли брака</td></tr>
        <tr><td><b>Обработка сигналов</b></td><td>Шум моделируется распределениями, байесовские фильтры (Калман, частицы)</td></tr>
      </table>
    `,

    proscons: `
      <h3>Сила вероятностного подхода</h3>
      <ul>
        <li><b>Универсальный язык неопределённости</b> — применим везде, где есть случайность или неполная информация.</li>
        <li><b>Формальные правила вывода</b> — теорема Байеса позволяет обновлять веру при новых данных.</li>
        <li><b>Количественные ответы</b> — не «наверное», а «с вероятностью 73%».</li>
        <li><b>Основа всей статистики и ML</b> — без вероятностей нет гипотез, нет классификации, нет регрессии.</li>
      </ul>

      <h3>Типичные заблуждения и ловушки</h3>
      <ul>
        <li><b>Путать P(A|B) и P(B|A)</b> — это разные величины. «Если дождь, то мокро» ≠ «если мокро, то дождь».</li>
        <li><b>Считать PDF вероятностью</b> — f(x) может быть > 1. Вероятность даёт только интеграл PDF по интервалу.</li>
        <li><b>Игнорировать базовую вероятность</b> — классическая ошибка в диагностике: «тест точен на 99%, значит результат верен на 99%». Нет! Зависит от распространённости болезни.</li>
        <li><b>Смешивать зависимые и независимые события</b> — P(A ∩ B) = P(A)·P(B) только для независимых.</li>
        <li><b>Ожидать, что среднее = типичное значение</b> — для скошенных распределений это не так (зарплаты, время отклика).</li>
      </ul>

      <h3>Когда вероятностная модель неприменима</h3>
      <ul>
        <li>Когда события фундаментально <b>детерминированные</b> (проще посчитать, чем моделировать).</li>
        <li>Когда <b>нет данных</b> для оценки параметров распределения.</li>
        <li>Когда распределение <b>нестабильно во времени</b> (нестационарные процессы) — нужна адаптивная модель.</li>
      </ul>
    `,

    extra: `
      <h3>Таблица: PMF vs PDF vs CDF</h3>
      <table>
        <tr><th></th><th>PMF</th><th>PDF</th><th>CDF</th></tr>
        <tr><td>Тип</td><td>Дискретная</td><td>Непрерывная</td><td>Любая</td></tr>
        <tr><td>Обозначение</td><td>P(X=x)</td><td>f(x)</td><td>F(x)=P(X≤x)</td></tr>
        <tr><td>Значение</td><td>Вероятность</td><td>Плотность</td><td>Накопл. вероятность</td></tr>
        <tr><td>Диапазон</td><td>[0, 1]</td><td>[0, ∞)</td><td>[0, 1]</td></tr>
        <tr><td>Сумма/интеграл</td><td>= 1</td><td>= 1</td><td>от 0 до 1</td></tr>
        <tr><td>Графически</td><td>Столбики</td><td>Кривая</td><td>Ступеньки / S-кривая</td></tr>
      </table>

      <h3>Survival function</h3>
      <p>$S(x) = 1 - F(x) = P(X > x)$ — вероятность «выжить» дольше x. Используется в анализе выживания (время до отказа, время жизни клиента).</p>

      <h3>Hazard function</h3>
      <p>$h(x) = f(x) / S(x)$ — мгновенная интенсивность отказа. Для экспоненциального h(x) = λ = const (постоянный риск).</p>

      <h3>Moment Generating Function (MGF)</h3>
      <p>$M_X(t) = E[e^{tX}]$ — «генератор моментов». Из неё можно получить все моменты: $E[X^n] = M^{(n)}(0)$. Единственным образом определяет распределение.</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=uzkc-qNVoOk" target="_blank">Probability explained (Khan Academy)</a> — разница между вероятностью и функцией правдоподобия</li>
        <li><a href="https://www.youtube.com/watch?v=HZGCoVF3YvM" target="_blank">3Blue1Brown: Bayes theorem</a> — визуальное объяснение теоремы Байеса</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/probability-library" target="_blank">Khan Academy: Basic probability</a> — основы теории вероятностей с упражнениями</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D1%84%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F%20%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BF%D0%BB%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D0%B2%D0%B5%D1%80%D0%BE%D1%8F%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B8" target="_blank">Habr: теория вероятностей</a> — русскоязычные статьи о теории вероятностей</li>
        <li><a href="https://en.wikipedia.org/wiki/Probability_density_function" target="_blank">Wikipedia: Probability density function (PDF)</a> — определение и свойства функции плотности вероятности</li>
        <li><a href="https://en.wikipedia.org/wiki/Conditional_probability" target="_blank">Wikipedia: Conditional probability</a> — условная вероятность и формула Байеса</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank">SciPy: scipy.stats</a> — вычисление PMF, PDF, CDF для всех стандартных распределений</li>
        <li><a href="https://numpy.org/doc/stable/reference/random/index.html" target="_blank">NumPy: Random sampling</a> — генерация случайных выборок из разных распределений</li>
      </ul>
    `,
  },
});
