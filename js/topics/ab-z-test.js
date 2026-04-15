/* ==========================================================================
   A/B тестирование — z-тест для конверсий
   ========================================================================== */
App.registerTopic({
  id: 'ab-z-test',
  category: 'ab',
  title: 'z-тест для конверсий',
  summary: 'Сравнение долей (click rate, conversion rate) в двух группах.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь: ты подбрасываешь монету и хочешь понять, честная ли она. Ты бросил 1000 раз и получил 540 орлов вместо ожидаемых 500. Случайность или монета нечестная? <a class="glossary-link" onclick="App.selectTopic('glossary-z-test')">z-тест</a> даёт ответ, переводя вопрос в стандартизованные единицы: «насколько сигм наблюдение отклонилось от ожидания?»</p>
        <p>В A/B тестах мы делаем то же самое: сравниваем две «монеты» — конверсию варианта A и варианта B. Вопрос: наблюдаемая разница 1.5 п.п. — это реальный эффект или случайный шум?</p>
      </div>

      <h3>🎯 Когда применяем z-тест</h3>
      <p>z-тест для двух пропорций применяется, когда:</p>
      <ul>
        <li>Метрика — <b>бинарная</b>: клик / не клик, купил / не купил, зарегистрировался / нет.</li>
        <li>Обе выборки <b>независимы</b> (рандомизированные группы, не «до/после» одного пользователя).</li>
        <li>Выполнены условия нормального приближения: $n_i \\cdot p_i \\geq 5$ и $n_i \\cdot (1-p_i) \\geq 5$ для обеих групп.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Нормальное приближение</div>
        <p>Бинарные события подчиняются биномиальному распределению, но при достаточном n (≥30 в каждой группе) выборочная доля $\\hat{p}$ хорошо приближается нормальным. Это следует из ЦПТ: доля — это среднее n независимых Бернулли. Именно это приближение позволяет использовать таблицу z-распределения.</p>
      </div>

      <h3>📐 Формулы z-теста для пропорций</h3>
      <p>Имеем две группы: A (контроль) с $n_A$ наблюдений и $x_A$ «успехов», B (вариант) с $n_B$ и $x_B$.</p>

      <p><b>Выборочные пропорции:</b></p>
      <div class="math-block">$$\\hat{p}_A = \\frac{x_A}{n_A}, \\quad \\hat{p}_B = \\frac{x_B}{n_B}$$</div>

      <p><b>Объединённая пропорция</b> (pooled proportion) — оценка общей конверсии при $H_0$: $p_A = p_B$:</p>
      <div class="math-block">$$\\hat{p} = \\frac{x_A + x_B}{n_A + n_B}$$</div>

      <p><b><a class="glossary-link" onclick="App.selectTopic('glossary-standard-error')">Стандартная ошибка</a> разности</b> под $H_0$:</p>
      <div class="math-block">$$SE = \\sqrt{\\hat{p}(1-\\hat{p})\\left(\\frac{1}{n_A} + \\frac{1}{n_B}\\right)}$$</div>

      <p><b>z-статистика:</b></p>
      <div class="math-block">$$z = \\frac{\\hat{p}_B - \\hat{p}_A}{SE}$$</div>

      <p>Под $H_0$ статистика $z$ распределена примерно как $N(0, 1)$ — стандартное нормальное. Чем больше |z|, тем меньше p-value, тем сильнее доказательства против $H_0$.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="zBellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0.05"/>
            </linearGradient>
            <linearGradient id="zTailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#dc2626" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#dc2626" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">z-тест: стандартное нормальное N(0,1)</text>
          <line x1="60" y1="240" x2="700" y2="240" stroke="#475569" stroke-width="1.5"/>
          <!-- Generated paths -->
          <path id="zt-central" d="" fill="url(#zBellGrad)"/>
          <path id="zt-left-tail" d="" fill="url(#zTailGrad)" stroke="#dc2626" stroke-width="1.8"/>
          <path id="zt-right-tail" d="" fill="url(#zTailGrad)" stroke="#dc2626" stroke-width="1.8"/>
          <path id="zt-outline" d="" fill="none" stroke="#4338ca" stroke-width="2.8"/>
          <!-- z = 0 center line -->
          <line x1="380" y1="70" x2="380" y2="248" stroke="#475569" stroke-width="1.2" stroke-dasharray="4,3"/>
          <text x="380" y="256" text-anchor="middle" font-size="12" fill="#475569" font-weight="700">0</text>
          <!-- Critical lines ±1.96 -->
          <line id="zt-line-left" x1="0" y1="0" x2="0" y2="0" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
          <line id="zt-line-right" x1="0" y1="0" x2="0" y2="0" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
          <text id="zt-label-left" x="0" y="256" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">−1.96</text>
          <text id="zt-label-right" x="0" y="256" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">+1.96</text>
          <!-- Middle label -->
          <text x="380" y="130" text-anchor="middle" font-size="18" font-weight="800" fill="#4f46e5">95%</text>
          <text x="380" y="152" text-anchor="middle" font-size="12" fill="#4f46e5">не отвергаем H₀</text>
          <!-- Tail labels -->
          <text x="110" y="180" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">α/2 = 2.5%</text>
          <text x="650" y="180" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">α/2 = 2.5%</text>
          <!-- Sample z = 2.43 marker -->
          <line id="zt-sample" x1="0" y1="0" x2="0" y2="0" stroke="#f97316" stroke-width="3"/>
          <text id="zt-sample-label" x="0" y="270" text-anchor="middle" font-size="12" font-weight="700" fill="#f97316">наш z = 2.43</text>
        </svg>
        <div class="caption">z-распределение при H₀. Красные хвосты — область отвержения (каждая 2.5% при α=0.05). Оранжевая линия — пример z=2.43, который попадает в правый хвост: отвергаем H₀, p ≈ 0.015.</div>
        <script>
        (function() {
          var U = App.Util;
          var cx = 380, baselineY = 240, peakY = 70, halfWidth = 270;
          U.setPath(document, 'zt-outline', U.normalOutlinePath(cx, baselineY, peakY, halfWidth));
          U.setPath(document, 'zt-central', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -1.96, 1.96));
          U.setPath(document, 'zt-left-tail', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -3, -1.96));
          U.setPath(document, 'zt-right-tail', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, 1.96, 3));
          // Critical lines
          var leftX = cx - (1.96 / 3) * halfWidth;
          var rightX = cx + (1.96 / 3) * halfWidth;
          var critY = baselineY - Math.exp(-0.5 * 1.96 * 1.96) * (baselineY - peakY);
          var lL = document.getElementById('zt-line-left');
          lL.setAttribute('x1', leftX); lL.setAttribute('x2', leftX);
          lL.setAttribute('y1', critY); lL.setAttribute('y2', baselineY);
          var lR = document.getElementById('zt-line-right');
          lR.setAttribute('x1', rightX); lR.setAttribute('x2', rightX);
          lR.setAttribute('y1', critY); lR.setAttribute('y2', baselineY);
          document.getElementById('zt-label-left').setAttribute('x', leftX);
          document.getElementById('zt-label-right').setAttribute('x', rightX);
          // Sample z = 2.43 marker
          var sampleX = cx + (2.43 / 3) * halfWidth;
          var sampleY = baselineY - Math.exp(-0.5 * 2.43 * 2.43) * (baselineY - peakY);
          var ls = document.getElementById('zt-sample');
          ls.setAttribute('x1', sampleX); ls.setAttribute('x2', sampleX);
          ls.setAttribute('y1', sampleY); ls.setAttribute('y2', baselineY);
          document.getElementById('zt-sample-label').setAttribute('x', sampleX);
        })();
        </script>
      </div>

      <h3>🔁 Односторонний vs двусторонний тест</h3>
      <p>Для A/B тестов на практике:</p>
      <ul>
        <li><b>Двусторонний</b> ($H_1$: $p_A \\neq p_B$): стандартный выбор. Ловит эффект в обе стороны. p-value = $2 \\cdot (1 - \\Phi(|z|))$. Критическое |z| = 1.96 при α=0.05.</li>
        <li><b>Односторонний</b> ($H_1$: $p_B > p_A$): если изменение может только улучшить, не ухудшить. Более мощный, но только если направление известно заранее. Критическое z = 1.645 при α=0.05.</li>
      </ul>
      <div class="callout warn">⚠️ Переключать тест с двустороннего на односторонний после просмотра данных — грубая форма p-hacking. Выбирай тип теста ДО запуска.</div>

      <h3>📏 <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">Доверительный интервал</a> для разности пропорций</h3>
      <p>p-value говорит «значимо или нет». Доверительный интервал (<a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">CI</a>) говорит «насколько»:</p>
      <div class="math-block">$$\\text{CI}_{95\\%} = (\\hat{p}_B - \\hat{p}_A) \\pm z_{0.025} \\cdot \\sqrt{\\frac{\\hat{p}_A(1-\\hat{p}_A)}{n_A} + \\frac{\\hat{p}_B(1-\\hat{p}_B)}{n_B}}$$</div>
      <p>Обрати внимание: здесь используем SE <b>без</b> объединённой пропорции (непулированный), так как мы оцениваем интервал для реальной разности, а не тестируем гипотезу равенства.</p>

      <div class="key-concept">
        <div class="kc-label">Статистическая vs практическая значимость</div>
        <p>При большой выборке (n = 100 000) даже ничтожный эффект 0.01 п.п. будет статистически значимым. Но стоит ли ради такого эффекта менять дизайн? Всегда смотри на <b>размер эффекта и CI</b>, а не только на p-value. Если нижняя граница CI — 0.01 п.п., а верхняя — 0.03 п.п., спроси: «Важен ли нам такой эффект бизнесу?»</p>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: z-тест без пулинга (unpooled SE)</summary>
        <div class="deep-dive-body">
          <p>Стандартный z-тест использует <b>пулированную</b> (pooled) оценку пропорции под $H_0$. Но некоторые аналитики используют непулированный вариант:</p>
          <div class="math-block">$$SE_{unpooled} = \\sqrt{\\frac{\\hat{p}_A(1-\\hat{p}_A)}{n_A} + \\frac{\\hat{p}_B(1-\\hat{p}_B)}{n_B}}$$</div>
          <p><b>Разница:</b> пулированный SE немного меньше (точнее под $H_0$), что даёт чуть большее z и меньше p-value. Для CI правильнее непулированный.</p>
          <p>При $p_A \\approx p_B$ разница незначительна. При сильно разных пропорциях — незначительна тоже (редкий случай в A/B тестах). На практике оба дают схожие результаты при n ≥ 1000.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: delta method для ratio-метрик</summary>
        <div class="deep-dive-body">
          <p>Иногда метрика — это отношение: CTR = клики / показы, Revenue per user = сумма / пользователи. Если числитель и знаменатель коррелируют, простой z-тест некорректен.</p>
          <p><b>Delta method</b> позволяет получить корректную дисперсию для ratio-метрики $r = X/Y$:</p>
          <div class="math-block">$$\\text{Var}(r) \\approx \\frac{\\text{Var}(X)}{\\bar{Y}^2} - \\frac{2\\bar{X}\\,\\text{Cov}(X,Y)}{\\bar{Y}^3} + \\frac{\\bar{X}^2\\,\\text{Var}(Y)}{\\bar{Y}^4}$$</div>
          <p>После этого можно применять обычный z-тест/t-тест. Этот подход используется в крупных платформах (Airbnb, Microsoft ExP).</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Введение в A/B тест</b> — общий контекст и расчёт n.</li>
        <li><b>t-тест</b> — для непрерывных метрик (средние, а не доли).</li>
        <li><b>Хи-квадрат</b> — для более чем двух категорий исходов.</li>
        <li><b>Нормальное распределение / ЦПТ</b> — теоретическое обоснование нормального приближения.</li>
      </ul>
    `,

    examples: [
      {
        title: 'A/B тест кнопки «Купить»',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Провели A/B тест кнопки «Купить»: вариант A — серая кнопка, вариант B — зелёная. По 5000 посетителей в каждой группе. A получил 250 кликов, B — 290. Значимо ли различие при α = 0.05?</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Вариант</th><th>Посетители (n)</th><th>Кликов (x)</th><th>Конверсия (p̂)</th></tr>
              <tr><td><b>A (серая)</b></td><td>5 000</td><td>250</td><td>5.00%</td></tr>
              <tr><td><b>B (зелёная)</b></td><td>5 000</td><td>290</td><td>5.80%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Формулируем гипотезы</h4>
            <div class="calc">H₀: p_A = p_B  (конверсии одинаковы)
H₁: p_A ≠ p_B  (двусторонний тест)
α = 0.05</div>
            <div class="why">Двусторонний тест: нам интересно любое значимое отличие, мы не утверждаем заранее, что B лучше A.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Вычисляем выборочные пропорции</h4>
            <div class="calc">p̂_A = 250 / 5000 = 0.0500  (5.00%)
p̂_B = 290 / 5000 = 0.0580  (5.80%)
Разность: p̂_B − p̂_A = 0.0080  (0.80 п.п.)</div>
          </div>

          <div class="step" data-step="3">
            <h4>Вычисляем объединённую пропорцию</h4>
            <div class="calc">p̂ = (x_A + x_B) / (n_A + n_B)
   = (250 + 290) / (5000 + 5000)
   = 540 / 10000
   = <b>0.0540</b>  (5.40%)</div>
            <div class="why">Под H₀ обе группы имеют одинаковую конверсию. Объединяем данные обеих групп для наиболее точной оценки этой «общей» конверсии.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Вычисляем стандартную ошибку</h4>
            <div class="calc">SE = √( p̂ × (1 − p̂) × (1/n_A + 1/n_B) )
   = √( 0.0540 × 0.9460 × (1/5000 + 1/5000) )
   = √( 0.05109 × 0.0004 )
   = √( 0.00002044 )
   = <b>0.004521</b></div>
          </div>

          <div class="step" data-step="5">
            <h4>Считаем z-статистику</h4>
            <div class="calc">z = (p̂_B − p̂_A) / SE
  = 0.0080 / 0.004521
  = <b>1.770</b></div>
          </div>

          <div class="step" data-step="6">
            <h4>Находим p-value</h4>
            <div class="calc">p-value = 2 × (1 − Φ(|z|))  [двусторонний]
        = 2 × (1 − Φ(1.770))
        = 2 × (1 − 0.9616)
        = 2 × 0.0384
        = <b>0.0768</b></div>
            <p>p = 0.077 > 0.05 → <b>не отвергаем H₀</b>.</p>
            <div class="why">z = 1.770 < 1.96 (критическое для α=0.05 двусторонний). Хотя разность 0.8 п.п. выглядит неплохо, при n=5000 мы не набрали достаточно данных для достоверного утверждения. Нужно больше посетителей.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>z = <b>1.770</b>, p = <b>0.077</b>. Разность конверсий 0.8 п.п. <b>не является статистически значимой</b> при α = 0.05. Требуется больше данных или меньший MDE.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <defs>
                <linearGradient id="zEx1Center" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.08"/>
                </linearGradient>
                <linearGradient id="zEx1Tail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#ef4444" stop-opacity="0.08"/>
                </linearGradient>
              </defs>
              <text x="240" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">z = 1.770, p = 0.077 — НЕ значимо</text>
              <line x1="30" y1="140" x2="450" y2="140" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Curves set via JS -->
              <path id="zEx1AreaTailLeft"  d="" fill="url(#zEx1Tail)"/>
              <path id="zEx1AreaTailRight" d="" fill="url(#zEx1Tail)"/>
              <path id="zEx1AreaCenter"    d="" fill="url(#zEx1Center)"/>
              <path id="zEx1Curve"         d="" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- Critical value lines: z=±1.96 in σ units → x = 240 + (±1.96/3)*180 = 240±117.6 -->
              <line x1="122" y1="60" x2="122" y2="140" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>
              <text x="122" y="157" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="700">−1.96</text>
              <line x1="358" y1="60" x2="358" y2="140" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>
              <text x="358" y="157" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="700">+1.96</text>
              <!-- Center line -->
              <line x1="240" y1="40" x2="240" y2="140" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>
              <text x="240" y="157" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">0</text>
              <!-- Observed z = 1.770 → x = 240 + (1.770/3)*180 = 346.2 -->
              <line x1="346" y1="65" x2="346" y2="140" stroke="#f97316" stroke-width="2.5"/>
              <text x="346" y="175" text-anchor="middle" font-size="11" font-weight="700" fill="#f97316">z=1.770</text>
              <!-- annotation box, positioned above curve on left-center, not overlapping right side -->
              <text x="180" y="58" text-anchor="middle" font-size="11" fill="#4f46e5" font-weight="700">не отвергаем H₀</text>
              <text x="180" y="74" text-anchor="middle" font-size="10" fill="#4f46e5">95% доверительная область</text>
              <!-- "Нужно больше n" annotation below z=1.770 -->
              <text x="400" y="188" text-anchor="middle" font-size="10" fill="#b45309" font-weight="600">Нужно больше n</text>
            </svg>
            <div class="caption">z = 1.770 не достигает критического значения 1.96. Разность 0.8 п.п. при n=5000 — ещё не значима. Для детектирования 0.8 п.п. с мощностью 80% нужно ~12 900 на группу.</div>
            <script>
            (function() {
              var U = App.Util;
              // cx=240, baselineY=140, peakY=40, halfWidth=180 (for 3σ)
              U.setPath(document, 'zEx1Curve',         U.normalOutlinePath(240, 140, 40, 180));
              U.setPath(document, 'zEx1AreaCenter',    U.normalSegmentPath(240, 140, 40, 180, -1.96, 1.96));
              U.setPath(document, 'zEx1AreaTailLeft',  U.normalSegmentPath(240, 140, 40, 180, -3, -1.96));
              U.setPath(document, 'zEx1AreaTailRight', U.normalSegmentPath(240, 140, 40, 180, 1.96, 3));
            })();
            </script>
          </div>

          <div class="lesson-box">Разность 0.8 п.п. (5% → 5.8%) выглядит как рост, но статистически не доказана. Тест показывает: возможно, это случайность. Нужно либо больше данных, либо пересмотреть MDE — может, 0.8 п.п. недостаточно, чтобы оправдать изменение дизайна?</div>
        `
      },
      {
        title: 'Когда не хватает данных',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Аналитик провёл тест с малой выборкой: 100 посетителей в каждой группе, те же конверсии 5% и 5.8%. Что изменится в выводах? Сравним с предыдущим примером (n=5000).</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Вариант</th><th>n</th><th>Кликов</th><th>p̂</th></tr>
              <tr><td><b>A</b></td><td>100</td><td>5</td><td>5.0%</td></tr>
              <tr><td><b>B</b></td><td>100</td><td>6</td><td>6.0%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Проверяем условие нормального приближения</h4>
            <div class="calc">Условие: n × p ≥ 5 и n × (1−p) ≥ 5

Группа A: 100 × 0.05 = 5 ✓ (граничное!)
           100 × 0.95 = 95 ✓
Группа B: 100 × 0.06 = 6 ✓ (едва)
           100 × 0.94 = 94 ✓</div>
            <div class="why">При n=100 и p=5% у нас ровно 5 «успехов» — граница применимости z-теста. Формально условие выполнено, но результат менее надёжен. При n&lt;50 или p&lt;5% рекомендуется тест Фишера.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Объединённая пропорция и SE</h4>
            <div class="calc">p̂ = (5 + 6) / (100 + 100) = 11/200 = <b>0.055</b>

SE = √( 0.055 × 0.945 × (1/100 + 1/100) )
   = √( 0.051975 × 0.02 )
   = √( 0.0010395 )
   = <b>0.03224</b></div>
            <div class="why">SE теперь в 7 раз больше, чем при n=5000 (0.00452). Меньше данных = больше неопределённость = шире «облако ошибки».</div>
          </div>

          <div class="step" data-step="3">
            <h4>z-статистика и p-value</h4>
            <div class="calc">z = (0.06 − 0.05) / 0.03224 = 0.01 / 0.03224 = <b>0.310</b>

p-value = 2 × (1 − Φ(0.310)) = 2 × (1 − 0.622) = 2 × 0.378 = <b>0.756</b></div>
            <p>p = 0.756 >> 0.05 → <b>сильно не значимо</b>.</p>
          </div>

          <div class="step" data-step="4">
            <h4>Сравнение двух экспериментов</h4>
            <div class="calc">              n=100        n=5000
p_A:          5.0%         5.0%
p_B:          6.0%         5.8%  (близко)
SE:           0.0322       0.00452
z:            0.310        1.770
p-value:      0.756        0.077
Вывод:        не знач.     не знач.
(нужно n=):  ~8 000       ~11 000 (до значимости)</div>
            <p>Оба теста не дали значимости — но z=0.31 — это «слепота» из-за маленькой выборки, а z=1.77 — уже «слышим сигнал, но он ещё слабый».</p>
          </div>

          <div class="step" data-step="5">
            <h4>Ошибка II рода (пропуск)</h4>
            <div class="calc">Мощность теста при n=100, MDE=1 п.п.:
Power = Φ( |p₂−p₁|/SE − z_{0.025} )
      = Φ( 0.01/0.0322 − 1.96 )
      = Φ( 0.31 − 1.96 )
      = Φ(−1.65)
      = <b>5%</b>  (!)

Т.е. при реальной разнице 1 п.п. тест с n=100
правильно обнаружит её лишь в 5% случаев.
Это катастрофически маломощный тест!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Вывод</div>
            <p>z = <b>0.31</b>, p = <b>0.756</b>. Тест с n=100 не выявил значимости. Мощность теста — всего <b>5%</b>: даже если B реально лучше, мы пропустим эффект в 95% случаев. Это не «B не лучше» — это «у нас нет данных чтобы это узнать».</p>
          </div>

          <div class="lesson-box">«Не значимо» ≠ «нет эффекта». При маленькой выборке тест просто не видит эффект. Всегда рассчитывай мощность: если мощность &lt;50%, тест бесполезен — он найдёт эффект реже, чем монетка.</div>
        `
      },
      {
        title: 'Доверительный интервал для разницы',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Большой A/B тест: n_A = n_B = 20 000. Конверсия A = 8.0% (1 600 из 20 000), конверсия B = 9.1% (1 820 из 20 000). z-тест дал p &lt; 0.001. Но насколько большой эффект? Построить 95% CI для разности p_B − p_A.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Данные</h4>
            <div class="calc">p̂_A = 1600/20000 = 0.0800
p̂_B = 1820/20000 = 0.0910
Δ = p̂_B − p̂_A = 0.0110  (+1.10 п.п.)</div>
          </div>

          <div class="step" data-step="2">
            <h4>SE для CI (непулированный)</h4>
            <div class="calc">SE_CI = √( p̂_A(1−p̂_A)/n_A + p̂_B(1−p̂_B)/n_B )
      = √( 0.0800×0.9200/20000 + 0.0910×0.9090/20000 )
      = √( 0.0736/20000 + 0.0827/20000 )
      = √( 0.00000368 + 0.000004135 )
      = √( 0.000008015 )
      = <b>0.002831</b></div>
            <div class="why">Для CI используем непулированный SE — оцениваем истинную дисперсию каждой группы отдельно, не предполагая равенство долей. Это более точная оценка для реального интервала эффекта.</div>
          </div>

          <div class="step" data-step="3">
            <h4>95% доверительный интервал</h4>
            <div class="calc">CI₉₅% = Δ ± z_{0.025} × SE_CI
       = 0.0110 ± 1.96 × 0.002831
       = 0.0110 ± 0.00555

Нижняя граница: 0.0110 − 0.00555 = <b>0.00545</b>  (+0.55 п.п.)
Верхняя граница: 0.0110 + 0.00555 = <b>0.01655</b>  (+1.66 п.п.)</div>
          </div>

          <div class="step" data-step="4">
            <h4>Интерпретация CI</h4>
            <div class="calc">CI₉₅%: [+0.55 п.п.;  +1.66 п.п.]

Что это значит:
  1) 0 не входит в CI → результат статистически значим ✓
  2) Нижняя граница +0.55 п.п. — даже в пессимистичном
     сценарии эффект ощутимый
  3) Точечная оценка +1.10 п.п. при базе 8% = рост на 13.75%
  4) При 100 000 новых пользователей в день:
     доп. конверсий = 100000 × 0.0110 = 1100 в день</div>
            <div class="why">Именно CI делает результат «говорящим»: не просто «B лучше A», а «B лучше A на 0.55–1.66 п.п. с вероятностью 95%». Это позволяет оценить бизнес-ценность изменения.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Сравнение с z-тестом</h4>
            <div class="calc">Пулированный p̂ = (1600+1820)/(20000+20000) = 3420/40000 = 0.0855
SE_test = √(0.0855×0.9145×(1/20000+1/20000)) = √(0.07819×0.0001) = 0.002795

z = 0.0110 / 0.002795 = <b>3.935</b>
p-value = 2×(1 − Φ(3.935)) ≈ <b>0.000083</b> ≪ 0.001</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Разность конверсий = <b>+1.10 п.п.</b>; 95% CI: [<b>+0.55; +1.66 п.п.</b>]. z = 3.935, p &lt; 0.001. Результат высоко значим и практически важен. Нижняя граница 0.55 п.п. достаточна для внедрения.</p>
          </div>

          <div class="lesson-box">CI всегда информативнее p-value: он показывает и значимость (0 не в интервале) и величину эффекта (ширина и положение). Принимать бизнес-решения лучше по нижней границе CI — это реалистичный пессимистичный сценарий.</div>
        `
      }
    ],

    simulation: [
      {
        title: 'Базовый z-тест',
        html: `
          <h3>Симуляция z-теста для пропорций</h3>
          <p>Задай истинные конверсии и размер выборки — увидишь, обнаружит ли тест разницу.</p>
          <div class="sim-container">
            <div class="sim-controls" id="abz-controls"></div>
            <div class="sim-buttons"><button class="btn" id="abz-run">🔄 Новый тест</button></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="abz-chart"></canvas></div>
              <div class="sim-stats" id="abz-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#abz-controls');
          const cNA = App.makeControl('range', 'abz-na', 'n группы A', { min: 100, max: 10000, step: 100, value: 2000 });
          const cNB = App.makeControl('range', 'abz-nb', 'n группы B', { min: 100, max: 10000, step: 100, value: 2000 });
          const cPA = App.makeControl('range', 'abz-pa', 'Истинная p(A) %', { min: 1, max: 20, step: 0.5, value: 5 });
          const cPB = App.makeControl('range', 'abz-pb', 'Истинная p(B) %', { min: 1, max: 20, step: 0.5, value: 6.5 });
          [cNA, cNB, cPA, cPB].forEach(c => controls.appendChild(c.wrap));
          let chart = null;
          function run() {
            const nA = +cNA.input.value, nB = +cNB.input.value;
            const pA = +cPA.input.value / 100, pB = +cPB.input.value / 100;
            let sA = 0, sB = 0;
            for (let i = 0; i < nA; i++) if (Math.random() < pA) sA++;
            for (let i = 0; i < nB; i++) if (Math.random() < pB) sB++;
            const crA = sA / nA, crB = sB / nB;
            const pPool = (sA + sB) / (nA + nB);
            const se = Math.sqrt(pPool * (1 - pPool) * (1 / nA + 1 / nB));
            const z = se > 0 ? (crB - crA) / se : 0;
            const pVal = 2 * (1 - App.Util.normalCDF(Math.abs(z)));
            const sig = pVal < 0.05;
            const ctx = container.querySelector('#abz-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'bar', data: { labels: ['A', 'B'], datasets: [{ data: [crA * 100, crB * 100], backgroundColor: ['rgba(59,130,246,0.6)', sig ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.5)'] }] },
              options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: sig ? '✅ Разница значима (p < 0.05)' : '❌ Разница НЕ значима' } }, scales: { y: { min: 0, suggestedMax: Math.ceil(Math.max(crA, crB) * 100 * 1.3), title: { display: true, text: 'Конверсия %' } } } },
            });
            App.registerChart(chart);
            container.querySelector('#abz-stats').innerHTML = '<div class="stat-card"><div class="stat-label">CR(A)</div><div class="stat-value">' + (crA*100).toFixed(2) + '%</div></div><div class="stat-card"><div class="stat-label">CR(B)</div><div class="stat-value">' + (crB*100).toFixed(2) + '%</div></div><div class="stat-card"><div class="stat-label">z-статистика</div><div class="stat-value">' + z.toFixed(3) + '</div></div><div class="stat-card"><div class="stat-label">p-value</div><div class="stat-value">' + pVal.toFixed(4) + '</div></div>';
          }
          [cNA, cNB, cPA, cPB].forEach(c => c.input.addEventListener('input', run));
          container.querySelector('#abz-run').onclick = run;
          run();
        },
      },
      {
        title: 'Мощность vs n и effect size',
        html: `
          <h3>Как $n$ и размер эффекта управляют мощностью</h3>
          <p>Ключевая интуиция A/B-тестов: чтобы увидеть маленький эффект, нужна большая выборка. Сдвигай $n$ и разницу конверсий — смотри, как меняется <b>мощность</b> (вероятность обнаружить реальный эффект) и ожидаемая $z$-статистика.</p>
          <div class="sim-container">
            <div class="sim-controls" id="abzp-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="abzp-chart"></canvas></div>
              <div class="sim-stats" id="abzp-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#abzp-controls');
          const cBase = App.makeControl('range', 'abzp-base', 'Базовая p(A) %', { min: 1, max: 30, step: 0.5, value: 5 });
          const cLift = App.makeControl('range', 'abzp-lift', 'Относ. lift % (B vs A)', { min: 1, max: 50, step: 1, value: 10 });
          const cAlpha = App.makeControl('range', 'abzp-alpha', 'α', { min: 0.01, max: 0.1, step: 0.01, value: 0.05 });
          [cBase, cLift, cAlpha].forEach(c => controls.appendChild(c.wrap));
          let chart = null;
          // Power of two-proportion z-test (two-sided, pooled SE)
          function power(n, pA, pB, alpha) {
            const pBar = (pA + pB) / 2;
            const se0 = Math.sqrt(2 * pBar * (1 - pBar) / n);
            const se1 = Math.sqrt(pA * (1 - pA) / n + pB * (1 - pB) / n);
            const zcrit = App.Util.normalCDF ? -inverseNormal(alpha / 2) : 1.96;
            // mean shift in standardized units
            const delta = Math.abs(pB - pA);
            const mu = delta / se1;
            const crit = zcrit * se0 / se1;
            // P(|Z*| > crit) where Z* ~ N(mu, 1)
            return (1 - App.Util.normalCDF(crit - mu)) + App.Util.normalCDF(-crit - mu);
          }
          // Abramowitz-Stegun approximation of inverse normal
          function inverseNormal(p) {
            if (p <= 0) return -Infinity;
            if (p >= 1) return Infinity;
            const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
            const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
            const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
            const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
            const plow = 0.02425, phigh = 1 - plow;
            let q, r;
            if (p < plow) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
            if (p <= phigh) { q = p - 0.5; r = q*q; return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1); }
            q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
          }
          function run() {
            const pA = +cBase.input.value / 100;
            const lift = +cLift.input.value / 100;
            const pB = pA * (1 + lift);
            const alpha = +cAlpha.input.value;
            const ns = [];
            const powers = [];
            for (let n = 100; n <= 50000; n = Math.round(n * 1.15)) {
              ns.push(n);
              powers.push(power(n, pA, pB, alpha) * 100);
            }
            // Find n for 80% power
            let n80 = null;
            for (let i = 0; i < ns.length; i++) if (powers[i] >= 80 && n80 === null) n80 = ns[i];
            const ctx = container.querySelector('#abzp-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: ns,
                datasets: [
                  { label: 'Мощность %', data: powers, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.15)', borderWidth: 2, pointRadius: 0, fill: true },
                  { label: '80%', data: ns.map(() => 80), borderColor: '#10b981', borderDash: [6,4], borderWidth: 1.5, pointRadius: 0, fill: false },
                ],
              },
              options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Мощность как функция размера выборки' } }, scales: { x: { type: 'logarithmic', title: { display: true, text: 'n на группу (log-scale)' } }, y: { min: 0, max: 100, title: { display: true, text: 'Мощность %' } } } },
            });
            App.registerChart(chart);
            container.querySelector('#abzp-stats').innerHTML =
              '<div class="stat-card"><div class="stat-label">p(A)</div><div class="stat-value">' + (pA*100).toFixed(2) + '%</div></div>' +
              '<div class="stat-card"><div class="stat-label">p(B)</div><div class="stat-value">' + (pB*100).toFixed(2) + '%</div></div>' +
              '<div class="stat-card"><div class="stat-label">Δ (абс.)</div><div class="stat-value">' + ((pB-pA)*100).toFixed(2) + ' п.п.</div></div>' +
              '<div class="stat-card"><div class="stat-label">n для 80% power</div><div class="stat-value">' + (n80 ? n80.toLocaleString('ru') : '>50k') + '</div></div>';
          }
          [cBase, cLift, cAlpha].forEach(c => c.input.addEventListener('input', run));
          run();
        },
      },
      {
        title: 'z vs t: сходимость',
        html: `
          <h3>Когда z и t дают один ответ</h3>
          <p>На малых $n$ распределение Стьюдента имеет тяжелее хвосты, чем нормальное — $t$-критическое значение больше $z$. С ростом $n$ они стягиваются. Посмотри, где граница «пофиг, какой тест применять».</p>
          <div class="sim-container">
            <div class="sim-controls" id="abzt-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="abzt-chart"></canvas></div>
              <div class="sim-stats" id="abzt-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#abzt-controls');
          const cAlpha = App.makeControl('range', 'abzt-alpha', 'α (two-sided)', { min: 0.01, max: 0.2, step: 0.01, value: 0.05 });
          controls.appendChild(cAlpha.wrap);
          let chart = null;
          // Two-sided t critical value — good approximation via Wilson-Hilferty / series
          // Use simple method: compute from incomplete beta isn't trivial; use a reasonable approximation
          function tCrit(alpha, df) {
            // Use normal z for df≥120
            const z = zCrit(alpha);
            if (df >= 120) return z;
            // Approximation (Hill 1970-ish fallback): z * sqrt(df/(df-2)) bias-corrected isn't precise.
            // Better: use known formula — t_crit ≈ z * (1 + (z^2 + 1)/(4*df) + ...) for small df
            return z * (1 + (z*z + 1) / (4 * df) + (5*z*z*z*z + 16*z*z + 3) / (96 * df * df));
          }
          function zCrit(alpha) {
            // inverse normal at 1 - alpha/2
            const p = 1 - alpha / 2;
            // Beasley-Springer/Moro not needed — simple rational approximation
            const a = [2.515517, 0.802853, 0.010328];
            const b = [1.432788, 0.189269, 0.001308];
            const q = p > 0.5 ? 1 - p : p;
            const t = Math.sqrt(-2 * Math.log(q));
            const num = a[0] + a[1]*t + a[2]*t*t;
            const den = 1 + b[0]*t + b[1]*t*t + b[2]*t*t*t;
            const x = t - num / den;
            return p > 0.5 ? x : -x;
          }
          function run() {
            const alpha = +cAlpha.input.value;
            const dfs = [2,3,4,5,6,8,10,15,20,30,50,100,200,500,1000];
            const zc = zCrit(alpha);
            const tcs = dfs.map(df => tCrit(alpha, df));
            const zs = dfs.map(() => zc);
            const ctx = container.querySelector('#abzt-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: dfs,
                datasets: [
                  { label: 't-критическое', data: tcs, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 2, pointRadius: 3, fill: false },
                  { label: 'z-критическое', data: zs, borderColor: '#3b82f6', borderWidth: 2, borderDash: [6,4], pointRadius: 0, fill: false },
                ],
              },
              options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 't и z критические значения vs степени свободы' } }, scales: { x: { type: 'logarithmic', title: { display: true, text: 'df (log-scale)' } }, y: { title: { display: true, text: 'Критическое значение' } } } },
            });
            App.registerChart(chart);
            const t30 = tCrit(alpha, 30), t100 = tCrit(alpha, 100);
            container.querySelector('#abzt-stats').innerHTML =
              '<div class="stat-card"><div class="stat-label">z (α=' + alpha.toFixed(2) + ')</div><div class="stat-value">' + zc.toFixed(3) + '</div></div>' +
              '<div class="stat-card"><div class="stat-label">t при df=5</div><div class="stat-value">' + tCrit(alpha, 5).toFixed(3) + '</div></div>' +
              '<div class="stat-card"><div class="stat-label">t при df=30</div><div class="stat-value">' + t30.toFixed(3) + '</div></div>' +
              '<div class="stat-card"><div class="stat-label">t при df=100</div><div class="stat-value">' + t100.toFixed(3) + '</div></div>' +
              '<div class="stat-card"><div class="stat-label">Разрыв df=30</div><div class="stat-value">' + ((t30-zc)/zc*100).toFixed(1) + '%</div></div>';
          }
          cAlpha.input.addEventListener('input', run);
          run();
        },
      },
    ],

    python: `
      <h3>📊 z-тест для пропорций в Python</h3>
      <pre><code>from statsmodels.stats.proportion import proportions_ztest
import numpy as np

# Данные A/B теста
n_A, n_B = 5000, 5000       # размеры групп
conv_A, conv_B = 500, 560   # конверсии

# z-тест для двух пропорций
count = np.array([conv_A, conv_B])
nobs = np.array([n_A, n_B])

z_stat, p_value = proportions_ztest(count, nobs, alternative='two-sided')
print(f"p_A = {conv_A/n_A:.4f} ({conv_A/n_A:.2%})")
print(f"p_B = {conv_B/n_B:.4f} ({conv_B/n_B:.2%})")
print(f"z = {z_stat:.4f}")
print(f"p-value = {p_value:.4f}")
print(f"\\n{'Значимо!' if p_value < 0.05 else 'Не значимо'} (α=0.05)")</code></pre>

      <h3>📋 Доверительный интервал разности</h3>
      <pre><code>import numpy as np
from scipy import stats

n_A, n_B = 5000, 5000
p_A, p_B = 500/5000, 560/5000

# Разность пропорций
diff = p_B - p_A
se = np.sqrt(p_A*(1-p_A)/n_A + p_B*(1-p_B)/n_B)

# 95% доверительный интервал
z_crit = stats.norm.ppf(0.975)
ci_lower = diff - z_crit * se
ci_upper = diff + z_crit * se

print(f"Разность: {diff:.4f} ({diff:.2%})")
print(f"SE: {se:.4f}")
print(f"95% ДИ: [{ci_lower:.4f}, {ci_upper:.4f}]")
print(f"        [{ci_lower:.2%}, {ci_upper:.2%}]")
print(f"\\n0 {'НЕ входит' if ci_lower > 0 else 'входит'} в ДИ")</code></pre>

      <h3>📈 Визуализация результата</h3>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

p_A, p_B = 0.100, 0.112
diff = p_B - p_A
se = np.sqrt(p_A*0.9/5000 + p_B*0.888/5000)

x = np.linspace(diff - 4*se, diff + 4*se, 200)
y = stats.norm(diff, se).pdf(x)

plt.plot(x, y, 'b-', lw=2)
plt.axvline(0, color='red', linestyle='--', label='H₀: diff=0')
plt.fill_between(x, y, where=(x > 0), alpha=0.3, color='green')
plt.title(f"Распределение разности пропорций (diff={diff:.3f})")
plt.xlabel("p_B − p_A")
plt.legend()
plt.show()</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>A/B тесты конверсии.</b> Самый массовый случай: регистрация, покупка, клик, подписка. Метрика — доля «успехов» на группу; z-тест для пропорций — классический инструмент и стандарт в большинстве экспериментальных платформ.</li>
        <li><b>CTR рекламных креативов.</b> Два баннера, миллионы показов, сравниваем клики. Биномиальная природа данных (клик/не клик) + большие $n$ = идеальные условия для z-теста.</li>
        <li><b>Контроль качества производства.</b> Сравнение доли брака между партиями, сменами, поставщиками. Исторически именно из задач контроля качества вырос test of proportions.</li>
        <li><b>Опросы и социология.</b> Доли «да/нет», электоральные рейтинги, доля удовлетворённых клиентов. При крупных выборках (тысячи респондентов) z-тест корректен и прост.</li>
        <li><b>Медицина (эффективность vs побочки).</b> При больших клинических исследованиях — доля пациентов с ремиссией, частота побочных эффектов. При малых $n$ — Fisher exact.</li>
        <li><b>One-sample: проверка достижения цели.</b> Достигла ли конверсия бизнес-цели 10%? Сравниваем наблюдаемую долю с заданным порогом.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Простота формулы.</b> $z = (\\hat{p}_B - \\hat{p}_A)/\\text{SE}$ считается в одну строку без табличек и степеней свободы. Это делает z-тест идеальным для быстрых прикидок «на коленке» и прозрачных отчётов, где каждый шаг можно проверить руками.</p>
      <p><b>Корректный учёт биномиальной дисперсии.</b> Дисперсия пропорции — не произвольная, а жёстко связана со средним: $\\text{Var}(\\hat{p}) = p(1-p)/n$. Формула SE это учитывает, поэтому вывод остаётся честным именно для долей, в отличие от наивного применения t-теста к 0/1-данным.</p>
      <p><b>ЦПТ на больших $n$.</b> При $np \\geq 5$ и $n(1-p) \\geq 5$ распределение $\\hat{p}$ практически нормальное. На типичных продуктовых A/B-выборках (десятки тысяч юзеров) нормальное приближение работает идеально, поэтому на практике разница между z и t пренебрежимо мала — и большинство библиотек всё равно дефолтно возвращает t/Welch, который тождественен при больших $n$.</p>
      <p><b>Интерпретируемость z-статистики.</b> $z$ — это «сколько стандартных ошибок разделяет две группы». Правила «|z| &gt; 1.96 → значимо на 5%» знают наизусть, а CI для разности строится одной формулой $\\hat{p}_B - \\hat{p}_A \\pm 1.96 \\cdot \\text{SE}$ — бизнесу понятно без перевода.</p>
      <p><b>Стандарт индустрии для конверсий.</b> A/B-платформы (Optimizely, VWO, внутренние решения) используют именно test of two proportions как базу — это лингва франка между аналитиком, продактом и инженером.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Требование нормального приближения.</b> При $np &lt; 5$ или $n(1-p) &lt; 5$ (редкие события: покупка B2B, регистрация на закрытый продукт) биномиальное распределение далеко от нормального, p-value становится врушкой. Помогают: Fisher exact, точный биномиальный тест, Wilson/Agresti-Coull-CI.</p>
      <p><b>Только для бинарных метрик.</b> Средний чек, NPS (шкала -100..100), LTV — не пропорции. Применять z-тест к ним — типичная ошибка: дисперсия не $p(1-p)/n$, формула перестаёт быть корректной.</p>
      <p><b>Нарушение независимости наблюдений.</b> z-тест считает, что каждое «событие» независимо. Если один пользователь совершает 10 кликов за сессию, они сильно коррелированы — эффективное $n$ меньше номинального, SE занижена, ошибка I рода уплывает вверх. Нужны cluster randomization и cluster-robust SE.</p>
      <p><b>Ratio-метрики не работают напрямую.</b> «Клики на показы» выглядит как пропорция, но показы сами по себе — случайная величина, а не фиксированное $n$ на юзера. Правильный подход — delta-method или bootstrap, иначе CI неверный.</p>
      <p><b>Крайние конверсии (близко к 0% или 100%).</b> Симметричный нормальный CI может вылезти за $[0,1]$ и вводит в заблуждение. На границах лучше использовать Wilson или Clopper-Pearson CI.</p>

      <h3>🧭 Когда применять z-тест — и когда не стоит</h3>
      <table>
        <tr><th>✅ Применяй z-тест когда</th><th>❌ НЕ применяй когда</th></tr>
        <tr>
          <td>Метрика — чистая пропорция (клик/не клик, купил/не купил)</td>
          <td>Метрика непрерывная (чек, время, LTV) — бери t-тест или Mann-Whitney</td>
        </tr>
        <tr>
          <td>Выполнено $np \\geq 5$ и $n(1-p) \\geq 5$ в обеих группах</td>
          <td>Rare event и $np &lt; 5$ — бери Fisher exact или точный биномиальный тест</td>
        </tr>
        <tr>
          <td>Пользователи независимы: один пользователь = одно наблюдение</td>
          <td>Наблюдения коррелированы (повторные клики одного юзера, кластеры) — нужен cluster-robust подход</td>
        </tr>
        <tr>
          <td>Нужен простой CI для разности долей, который понятен бизнесу</td>
          <td>Конверсия близка к 0% или 100% — нормальный CI вылезает за границы, используй Wilson</td>
        </tr>
        <tr>
          <td>Сравниваешь две группы (контроль и вариант)</td>
          <td>Групп больше двух — используй хи-квадрат или поправки на множественные сравнения</td>
        </tr>
        <tr>
          <td>Метрика честно биномиальна: фиксированное $n$, независимые Bernoulli-испытания</td>
          <td>Ratio-метрика (клики/показы, где знаменатель случайный) — нужен delta-method или bootstrap</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('ab-chi-square')">Хи-квадрат тест</a></b> — естественное обобщение на более чем две группы или на $r \\times c$ таблицы. Для 2×2 математически эквивалентен z-тесту ($\\chi^2 = z^2$).</li>
        <li><b>Fisher exact test</b> — когда выборки малы и нормальное приближение ломается ($np &lt; 5$). Точно считает вероятность по гипергеометрическому распределению, не требует ЦПТ.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('ab-t-test')">Welch t-тест</a></b> — при больших $n$ даёт практически тот же ответ, что и z-тест (а библиотеки чаще возвращают именно t). Удобно, когда не хочется думать «а достаточно ли $n$ большое».</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('ab-bayesian')">Bayesian test of proportions</a></b> — если нужен прямой ответ $P(p_B &gt; p_A)$, возможность мониторить непрерывно и включить prior-знание о базовой конверсии.</li>
        <li><b>Wilson / Agresti-Coull CI</b> — когда важна не p-value, а качественный CI, особенно при крайних конверсиях. Устраняют перекос наивного Wald-CI.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=5ABpqVSx33I" target="_blank">Z-statistics vs. T-statistics (Khan Academy)</a> — z-оценки и z-тесты: когда и как применять</li>
        <li><a href="https://www.youtube.com/watch?v=vemZtEM63GY" target="_blank">StatQuest: p-values, clearly explained</a> — интерпретация p-value при тестировании конверсий</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample/tests-about-population-proportion/v/simple-hypothesis-testing" target="_blank">Khan Academy: Tests about a population proportion</a> — z-тест для пропорций с упражнениями</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=z-%D1%82%D0%B5%D1%81%D1%82%20%D0%BF%D1%80%D0%BE%D0%BF%D0%BE%D1%80%D1%86%D0%B8%D0%B9%20%D0%BA%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F" target="_blank">Habr: z-тест пропорций</a> — практические примеры z-теста для конверсий</li>
        <li><a href="https://en.wikipedia.org/wiki/Z-test" target="_blank">Wikipedia: Z-test</a> — математическое описание и условия применения z-теста</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportions_ztest.html" target="_blank">statsmodels: proportions_ztest</a> — z-тест для одной или двух пропорций</li>
        <li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html" target="_blank">statsmodels: proportion_confint</a> — доверительный интервал для пропорции</li>
      </ul>
    `,
  },
});
