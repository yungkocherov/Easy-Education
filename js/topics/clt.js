/* ==========================================================================
   Центральная предельная теорема
   ========================================================================== */
App.registerTopic({
  id: 'clt',
  category: 'stats',
  title: 'Центральная предельная теорема',
  summary: 'Почему среднее любой выборки стремится к нормальному распределению.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты решил узнать средний возраст посетителей торгового центра. Первая выборка из 50 человек даёт среднее 34.2. Вторая — 32.8. Третья — 35.5. Каждый раз цифра немного другая.</p>
        <p>Если повторить это 1000 раз и нарисовать все 1000 «средних» на графике — получится красивый колокол вокруг истинного возраста посетителей. <b>Любая выборка даёт немного разное среднее, но все эти средние вместе образуют нормальное распределение.</b> И это работает <b>независимо от того</b>, как распределён возраст в реальности: может он скошенный, может двугорбый, может равномерный — всё равно средние будут нормальными.</p>
        <p>Это и есть ЦПТ: магия, благодаря которой работает вся классическая статистика.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="cltGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">ЦПТ в действии</text>
          <!-- Left: uniform histogram -->
          <text x="120" y="55" text-anchor="middle" font-size="12" font-weight="600" fill="#f59e0b">Исходные данные</text>
          <text x="120" y="72" text-anchor="middle" font-size="10" fill="#64748b">(любое распределение)</text>
          <line x1="30" y1="220" x2="230" y2="220" stroke="#475569" stroke-width="1.5"/>
          <g fill="#fbbf24" fill-opacity="0.55" stroke="#b45309" stroke-width="1.5">
            <rect x="35" y="100" width="30" height="120"/>
            <rect x="68" y="95" width="30" height="125"/>
            <rect x="101" y="105" width="30" height="115"/>
            <rect x="134" y="98" width="30" height="122"/>
            <rect x="167" y="102" width="30" height="118"/>
            <rect x="200" y="100" width="30" height="120"/>
          </g>
          <!-- Arrow -->
          <text x="380" y="125" text-anchor="middle" font-size="14" font-weight="700" fill="#6366f1">n → ∞</text>
          <text x="380" y="145" text-anchor="middle" font-size="11" fill="#64748b">средние выборок</text>
          <line x1="265" y1="160" x2="495" y2="160" stroke="#6366f1" stroke-width="2.5"/>
          <polygon points="495,154 510,160 495,166" fill="#6366f1"/>
          <!-- Right: nice bell curve -->
          <text x="640" y="55" text-anchor="middle" font-size="12" font-weight="600" fill="#6366f1">Средние выборок</text>
          <text x="640" y="72" text-anchor="middle" font-size="10" fill="#64748b">(всегда нормальное)</text>
          <line x1="540" y1="220" x2="740" y2="220" stroke="#475569" stroke-width="1.5"/>
          <path id="clt-intro-area" d="" fill="url(#cltGrad)"/>
          <path id="clt-intro-outline" d="" fill="none" stroke="#6366f1" stroke-width="2.8"/>
          <line x1="640" y1="80" x2="640" y2="225" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="4,3"/>
          <text x="640" y="245" text-anchor="middle" font-size="14" fill="#6366f1" font-weight="700">μ</text>
        </svg>
        <div class="caption">ЦПТ в действии: какое бы ни было исходное распределение (равномерное, скошенное, дискретное), распределение выборочных средних при большом n всегда стремится к нормальному колоколу вокруг истинного μ.</div>
        <script>
        (function() {
          var U = App.Util;
          U.setPath(document, 'clt-intro-area', U.normalSegmentPath(640, 220, 80, 100, -3, 3));
          U.setPath(document, 'clt-intro-outline', U.normalOutlinePath(640, 220, 80, 100));
        })();
        </script>
      </div>

      <h3>💡 Формулировка</h3>
      <p>Если взять много независимых случайных величин <b>из любого распределения</b> с конечной дисперсией и вычислить их среднее, то распределение этих средних будет стремиться к нормальному. Чем больше <span class="term" data-tip="Размер выборки — количество наблюдений, из которых вычисляется среднее.">выборка</span>, тем точнее аппроксимация.</p>

      <p>Математически: пусть $X_1, X_2, \\ldots, X_n$ — независимые одинаково распределённые случайные величины со средним $\\mu$ и дисперсией $\\sigma^2$. Тогда:</p>

      <div class="math-block">$$\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^{n} X_i \\xrightarrow{n \\to \\infty} N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$</div>

      <p>Читается так: «выборочное среднее $\\bar{X}_n$ при больших $n$ распределено примерно нормально со средним $\\mu$ и дисперсией $\\sigma^2/n$».</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>ЦПТ говорит не о самих данных, а о <b>выборочном среднем</b>. Исходные данные могут быть распределены как угодно (хоть дискретные броски кубика, хоть скошенные доходы) — но <b>их среднее</b> всегда стремится к нормальному при большой выборке.</p>
      </div>

      <h3>💡 Почему это работает — интуитивно</h3>
      <p>Когда мы усредняем много случайных величин, происходит следующее: если одно значение оказалось высоким, другое может оказаться низким, и они «компенсируют» друг друга. Чем больше слагаемых, тем больше компенсаций, и тем сильнее среднее «тянется» к истинному $\\mu$.</p>
      <p>Экстремальные средние (далеко от $\\mu$) становятся всё менее вероятными, потому что нужно, чтобы <b>все</b> слагаемые оказались экстремальными в одну сторону. А симметричные распределения вокруг $\\mu$ возникают естественно — отклонения в плюс и в минус встречаются примерно одинаково.</p>

      <h3>📐 <a class="glossary-link" onclick="App.selectTopic('glossary-standard-error')">Стандартная ошибка среднего (SE)</a></h3>
      <p>Из формулы ЦПТ следует важный результат: стандартное отклонение выборочного среднего равно:</p>
      <div class="math-block">$$SE(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$$</div>

      <p>Это называется <span class="term" data-tip="Standard Error. Мера того, насколько сильно выборочное среднее отличается от истинного среднего генеральной совокупности. Чем больше n, тем меньше SE.">стандартной ошибкой среднего</span>. Она показывает, насколько «прыгает» оценка среднего от выборки к выборке.</p>

      <p><b>Важное следствие:</b> точность оценки растёт как $\\sqrt{n}$, а не как $n$.</p>
      <ul>
        <li>n = 100: SE = σ/10</li>
        <li>n = 400: SE = σ/20 (в 2 раза точнее)</li>
        <li>n = 10000: SE = σ/100 (в 10 раз точнее)</li>
      </ul>
      <p>Чтобы удвоить точность, нужно <b>учетверить</b> размер выборки. Это закон убывающей отдачи в статистике.</p>

      <h3>📈 Эмерджентность нормального: прогрессия n</h3>
      <p>Один из самых наглядных способов почувствовать ЦПТ — посмотреть, как меняется распределение средних при росте n. Возьмём в качестве «исходных данных» равномерное распределение U(0, 1) — оно совсем не похоже на колокол.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 900 320" xmlns="http://www.w3.org/2000/svg" style="max-width:900px;">
          <text x="450" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Распределение средних из U(0,1) при разном n</text>
          <text x="450" y="40" text-anchor="middle" font-size="11" fill="#64748b">Начинаем с равномерного — не похоже на колокол. С ростом n форма становится нормальной.</text>

          <!-- n=1 (uniform) -->
          <g>
            <text x="120" y="75" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">n = 1 (исходное)</text>
            <line x1="40" y1="240" x2="200" y2="240" stroke="#475569" stroke-width="1.5"/>
            <rect x="50" y="120" width="140" height="120" fill="#fed7aa" fill-opacity="0.65" stroke="#f59e0b" stroke-width="2"/>
            <text x="120" y="265" text-anchor="middle" font-size="11" fill="#64748b">U(0,1) — равномерное</text>
            <text x="120" y="282" text-anchor="middle" font-size="11" fill="#64748b">плоский «прямоугольник»</text>
          </g>
          <!-- n=2 (triangle) -->
          <g>
            <text x="340" y="75" text-anchor="middle" font-size="12" font-weight="700" fill="#fb923c">n = 2</text>
            <line x1="260" y1="240" x2="420" y2="240" stroke="#475569" stroke-width="1.5"/>
            <path d="M270,240 L340,110 L410,240 Z" fill="#fdba74" fill-opacity="0.65" stroke="#ea580c" stroke-width="2"/>
            <text x="340" y="265" text-anchor="middle" font-size="11" fill="#64748b">Уже треугольник —</text>
            <text x="340" y="282" text-anchor="middle" font-size="11" fill="#64748b">не равномерное!</text>
          </g>
          <!-- n=5 (smooth bell-like) -->
          <g>
            <text x="560" y="75" text-anchor="middle" font-size="12" font-weight="700" fill="#7c3aed">n = 5</text>
            <line x1="480" y1="240" x2="640" y2="240" stroke="#475569" stroke-width="1.5"/>
            <path id="clt-prog-n5-area" d="" fill="#ddd6fe" fill-opacity="0.7"/>
            <path id="clt-prog-n5" d="" fill="none" stroke="#7c3aed" stroke-width="2.2"/>
            <text x="560" y="265" text-anchor="middle" font-size="11" fill="#64748b">Уже похоже на колокол</text>
            <text x="560" y="282" text-anchor="middle" font-size="11" fill="#64748b">SE = σ/√5 ≈ σ/2.24</text>
          </g>
          <!-- n=30 (sharp bell) -->
          <g>
            <text x="780" y="75" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">n = 30</text>
            <line x1="700" y1="240" x2="860" y2="240" stroke="#475569" stroke-width="1.5"/>
            <path id="clt-prog-n30-area" d="" fill="#dbeafe" fill-opacity="0.7"/>
            <path id="clt-prog-n30" d="" fill="none" stroke="#1e40af" stroke-width="2.2"/>
            <text x="780" y="265" text-anchor="middle" font-size="11" fill="#64748b">Идеальный колокол</text>
            <text x="780" y="282" text-anchor="middle" font-size="11" fill="#64748b">SE = σ/√30 (узкий)</text>
          </g>
          <text x="450" y="305" text-anchor="middle" font-size="12" font-weight="600" fill="#475569">→ Чем больше n, тем уже и «нормальнее» распределение средних →</text>
        </svg>
        <div class="caption">Магия ЦПТ: даже из равномерного (плоского) распределения уже при n=5 возникает почти-колокол, при n=30 — практически идеальный нормальный. Это работает с любым исходным распределением.</div>
        <script>
        (function() {
          var U = App.Util;
          // n=5: «средне» широкий
          U.setPath(document, 'clt-prog-n5-area', U.normalSegmentPath(560, 240, 110, 70, -3, 3));
          U.setPath(document, 'clt-prog-n5', U.normalOutlinePath(560, 240, 110, 70));
          // n=30: уже / выше (peakY ниже = пик выше). halfWidth меньше — узкий колокол.
          U.setPath(document, 'clt-prog-n30-area', U.normalSegmentPath(780, 240, 95, 55, -3, 3));
          U.setPath(document, 'clt-prog-n30', U.normalOutlinePath(780, 240, 95, 55));
        })();
        </script>
      </div>

      <h3>🧮 Сколько должно быть n?</h3>
      <p>ЦПТ — это предельная теорема: «при $n \\to \\infty$». В реальности же нужно знать, когда аппроксимация «достаточно хороша». Правила большого пальца:</p>
      <ul>
        <li><b>Симметричные распределения без хвостов:</b> $n \\geq 15$ уже достаточно.</li>
        <li><b>Слабо скошенные:</b> $n \\geq 30$ (классическое правило).</li>
        <li><b>Сильно скошенные (доходы, экспоненциальное):</b> $n \\geq 50-100$.</li>
        <li><b>С очень тяжёлыми хвостами:</b> может потребоваться $n \\geq 1000$ или вообще не работать.</li>
      </ul>

      <div class="callout tip">💡 Можно проверить применимость ЦПТ практически: взять несколько выборок из твоих данных, посчитать средние, посмотреть на их <a onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a>. Если на прямой — ЦПТ работает.</div>

      <h3>⚠️ Когда ЦПТ «не работает»</h3>
      <ul>
        <li><b>Распределение Коши</b> — не имеет конечной дисперсии. ЦПТ неприменима, среднее не стремится к нормальному.</li>
        <li><b>Распределение Парето с α < 2</b> — тяжёлые хвосты, бесконечная дисперсия.</li>
        <li><b>Зависимые наблюдения</b> — обычная ЦПТ требует независимости. Для временных рядов нужны специальные версии.</li>
        <li><b>Малые выборки из сильно скошенных распределений</b> — аппроксимация плохая.</li>
      </ul>

      <h3>🎯 Зачем ЦПТ нужна на практике</h3>
      <p>Без ЦПТ огромная часть статистики просто не работала бы. Благодаря ей:</p>

      <h4>1. Работают <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">доверительные интервалы</a></h4>
      <p>Когда мы пишем «средняя зарплата 85k ± 3k», это основано на ЦПТ. 95% доверительный интервал для среднего: $\\bar{x} \\pm 1.96 \\cdot SE$. Это формула работает, потому что $\\bar{X}$ распределено нормально.</p>

      <h4>2. Работают t-тесты и z-тесты</h4>
      <p>Все классические тесты на сравнение средних (t-test, ANOVA, z-test для пропорций) опираются на ЦПТ. Нам не нужно знать распределение данных — достаточно знать, что среднее распределено нормально.</p>

      <h4>3. Объясняется, почему нормальное распределение везде</h4>
      <p>Рост человека = сумма сотен генетических и средовых факторов. Ошибка измерения = сумма многих мелких погрешностей. IQ = сумма множества когнитивных способностей. Все эти величины образуются как <b>суммы</b>, поэтому они нормальные — это и есть ЦПТ в действии.</p>

      <h4>4. Работает <span class="term" data-tip="Bootstrap. Метод ресемплирования: многократно семплируем с возвращением из исходной выборки и считаем статистику. Распределение бутстреп-оценок приближает истинное распределение.">бутстреп</span></h4>
      <p>Метод бутстрепа (когда мы многократно ресемплируем данные) даёт тот же результат, что ЦПТ — даже без формальных предположений.</p>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Если n большое, данные нормальные»</b> — неверно. Нормальным становится <b>среднее</b>, а не сами данные. Доходы остаются скошенными даже при миллионе наблюдений.</li>
        <li><b>«n = 30 — это магическое число»</b> — нет, это грубое правило. Для сильно скошенных нужно больше, для симметричных — меньше.</li>
        <li><b>«ЦПТ требует нормальности исходных данных»</b> — наоборот. Вся её сила в том, что она работает для <b>любого</b> распределения с конечной дисперсией.</li>
        <li><b>«Если выборка большая, она точная»</b> — SE падает медленно ($\\sqrt{n}$). От 1000 до 4000 наблюдений SE уменьшится только в 2 раза.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: закон больших чисел</summary>
        <div class="deep-dive-body">
          <p>ЦПТ часто путают с <span class="term" data-tip="Закон больших чисел. Утверждает, что выборочное среднее сходится к истинному при n → ∞. Говорит только о сходимости, но не о форме распределения.">законом больших чисел</span> (ЗБЧ). Это разные утверждения:</p>
          <ul>
            <li><b>ЗБЧ</b> говорит: $\\bar{X}_n \\to \\mu$ при $n \\to \\infty$. Просто сходимость к истинному среднему.</li>
            <li><b>ЦПТ</b> говорит: $\\bar{X}_n \\approx N(\\mu, \\sigma^2/n)$. Как именно устроено отклонение.</li>
          </ul>
          <p>ЗБЧ — это «есть сходимость». ЦПТ — это «и вот как она выглядит количественно». Вторая сильнее, из неё следует первая.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: разные версии ЦПТ</summary>
        <div class="deep-dive-body">
          <p>Классическая ЦПТ (Линдеберг-Леви) требует одинакового распределения и независимости. Но есть обобщения:</p>
          <ul>
            <li><b>ЦПТ Ляпунова</b> — для разных распределений (нужна конечность третьего момента).</li>
            <li><b>ЦПТ Линдеберга</b> — обобщение Ляпунова с менее строгим условием.</li>
            <li><b>Функциональная ЦПТ</b> — для процессов (броуновское движение как предел).</li>
            <li><b>Мультивариатная ЦПТ</b> — для векторов случайных величин.</li>
            <li><b>ЦПТ для слабо зависимых рядов</b> — в анализе временных рядов.</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Доверительные интервалы</b> — прямое следствие ЦПТ.</li>
        <li><b>Проверка гипотез</b> — t-test, z-test строятся на нормальности среднего.</li>
        <li><b>A/B тесты</b> — сравнение средних двух групп.</li>
        <li><b>Бутстреп</b> — альтернативный путь к тому же результату.</li>
        <li><b>Нормальное распределение</b> — ЦПТ объясняет его вездесущность.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Средний бросок кубика',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Бросаем честный кубик 36 раз и считаем среднее. Какое среднее мы ожидаем и каков его разброс? Как это объясняет ЦПТ?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Параметры одного броска</h4>
            <p>Один бросок кубика — равномерное на {1, 2, 3, 4, 5, 6}:</p>
            <div class="calc">E[X] = (1+2+3+4+5+6)/6 = 21/6 = <b>3.5</b>

Var(X) = E[X²] − (E[X])²
  E[X²] = (1+4+9+16+25+36)/6 = 91/6 ≈ 15.17
  Var(X) = 15.17 − 12.25 = <b>2.917</b>

σ = √2.917 ≈ <b>1.71</b></div>
            <div class="why">Нам нужно знать μ и σ одного броска, чтобы потом применить ЦПТ к среднему.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Применяем ЦПТ к среднему из 36 бросков</h4>
            <p>По ЦПТ, среднее $\\bar{X}_{36}$ распределено примерно нормально:</p>
            <div class="calc">E[X̄] = μ = <b>3.5</b>  (не меняется!)

SE = σ / √n = 1.71 / √36 = 1.71 / 6 = <b>0.285</b>

X̄₃₆ ~ N(3.5, 0.285²)  приблизительно</div>
            <div class="why">ЦПТ говорит: «распределение среднего стремится к нормальному, центр = μ, разброс = σ/√n». Это работает для любого исходного распределения (кубик — дискретный, равномерный, ничем не похожий на колокол).</div>
          </div>

          <div class="step" data-step="3">
            <h4>Интерпретация по правилу 3σ</h4>
            <div class="calc">95% средних попадут в диапазон:
  3.5 ± 2 × 0.285 = 3.5 ± 0.57 = [<b>2.93</b>, <b>4.07</b>]

99.7% средних попадут в:
  3.5 ± 3 × 0.285 = 3.5 ± 0.855 = [2.645, 4.355]</div>
            <p>Если вы бросили 36 кубиков и среднее вышло 4.5 — это крайне подозрительно (за 3σ). Возможно, кубик нечестный!</p>
          </div>

          <div class="step" data-step="4">
            <h4>Как меняется при увеличении n</h4>
            <div class="example-data-table">
              <table>
                <tr><th>n (бросков)</th><th>SE</th><th>95% интервал для среднего</th></tr>
                <tr><td>4</td><td>0.855</td><td>[1.79, 5.21]</td></tr>
                <tr><td>36</td><td>0.285</td><td>[2.93, 4.07]</td></tr>
                <tr><td>100</td><td>0.171</td><td>[3.16, 3.84]</td></tr>
                <tr><td>10000</td><td>0.017</td><td>[3.47, 3.53]</td></tr>
              </table>
            </div>
            <p>С ростом n интервал <b>сужается</b>. Чем больше бросков — тем точнее среднее. Но точность растёт медленно: √n.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Среднее 36 бросков: E = <b>3.5</b>, SE = <b>0.285</b>. В 95% случаев среднее окажется в [2.93, 4.07]. ЦПТ работает, хотя один бросок — совсем не нормальный.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 165" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <text x="240" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">ЦПТ: равномерное → нормальное при росте n</text>
              <!-- Left: uniform flat bars for n=1 (dice) -->
              <text x="80" y="32" text-anchor="middle" font-size="10" fill="#64748b">n=1 (один бросок)</text>
              <line x1="20" y1="110" x2="140" y2="110" stroke="#94a3b8" stroke-width="1"/>
              <rect x="22"  y="65" width="16" height="45" fill="#64748b" opacity="0.6" rx="1"/>
              <rect x="40"  y="65" width="16" height="45" fill="#64748b" opacity="0.6" rx="1"/>
              <rect x="58"  y="65" width="16" height="45" fill="#64748b" opacity="0.6" rx="1"/>
              <rect x="76"  y="65" width="16" height="45" fill="#64748b" opacity="0.6" rx="1"/>
              <rect x="94"  y="65" width="16" height="45" fill="#64748b" opacity="0.6" rx="1"/>
              <rect x="112" y="65" width="16" height="45" fill="#64748b" opacity="0.6" rx="1"/>
              <text x="80" y="125" text-anchor="middle" font-size="9" fill="#64748b">равномерное</text>
              <!-- Arrow -->
              <text x="190" y="90" text-anchor="middle" font-size="22" fill="#94a3b8">→</text>
              <text x="190" y="106" text-anchor="middle" font-size="8" fill="#64748b">n растёт</text>
              <!-- Right: bell curve for n=36 -->
              <text x="355" y="32" text-anchor="middle" font-size="10" fill="#64748b">n=36 (среднее)</text>
              <line x1="240" y1="110" x2="460" y2="110" stroke="#94a3b8" stroke-width="1"/>
              <path d="M240,110 C260,110 275,108 290,103 C305,97 315,86 325,72 C335,57 340,47 345,42 C350,38 353,36 355,35 C357,36 360,38 365,42 C370,47 375,57 385,72 C395,86 405,97 420,103 C435,108 450,110 460,110" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2.5"/>
              <text x="355" y="125" text-anchor="middle" font-size="9" fill="#3b82f6">нормальное N(3.5, 0.285²)</text>
              <!-- center line -->
              <line x1="355" y1="35" x2="355" y2="110" stroke="#3b82f6" stroke-width="1.2" stroke-dasharray="3,2" opacity="0.6"/>
              <text x="355" y="140" text-anchor="middle" font-size="9" fill="#3b82f6">μ=3.5</text>
            </svg>
            <div class="caption">Слева — исходное равномерное распределение (один бросок кубика). Справа — распределение среднего из 36 бросков: по ЦПТ оно нормальное N(3.5, 0.285²), хотя исходное совсем не нормальное.</div>
          </div>

          <div class="lesson-box">ЦПТ не требует нормальности исходных данных. Кубик — равномерный, дискретный, «прямоугольный», но среднее бросков уже при n=36 — отличный колокол.</div>
        `
      },
      {
        title: 'Стандартная ошибка и размер выборки',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Фармкомпания проводит клиническое исследование. Известно, что давление пациентов имеет σ = 20 мм рт.ст. Сколько пациентов нужно, чтобы оценить среднее давление с точностью ±5 мм рт.ст. (с 95% уверенностью)?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Формулируем требование</h4>
            <p>Хотим, чтобы 95% доверительный интервал имел ширину ±5:</p>
            <div class="calc">Ширина 95% <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">CI</a> = ±1.96 × SE ≤ 5
где SE = σ / √n = 20 / √n</div>
            <div class="why">Число 1.96 — это квантиль нормального распределения, соответствующий 95% уровню уверенности. Для 99% будет 2.576.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Решаем неравенство</h4>
            <div class="calc">1.96 × (20 / √n) ≤ 5
39.2 / √n ≤ 5
√n ≥ 39.2 / 5
√n ≥ 7.84
n ≥ 7.84² = 61.5

Округляем вверх: n = <b>62 пациента</b></div>
          </div>

          <div class="step" data-step="3">
            <h4>Проверяем: а если хотим точнее?</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Точность (±)</th><th>Нужно пациентов</th><th>Стоимость (условно)</th></tr>
                <tr><td>±10 мм</td><td>16</td><td>160 тыс.</td></tr>
                <tr><td>±5 мм</td><td>62</td><td>620 тыс.</td></tr>
                <tr><td>±2 мм</td><td>385</td><td>3.85 млн</td></tr>
                <tr><td>±1 мм</td><td>1537</td><td>15.4 млн</td></tr>
              </table>
            </div>
            <div class="why">Точность растёт как √n: чтобы <b>удвоить</b> точность (с ±5 до ±2.5), нужно <b>в 4 раза</b> больше пациентов. Это закон убывающей отдачи — главная проблема больших исследований.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Нужно <b>62 пациента</b> для точности ±5 мм при 95% уверенности. Для ±1 мм — уже 1537 пациентов (в 25 раз больше).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 180" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <text x="240" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">SE = σ/√n: чем больше n — тем уже колокол</text>
              <!-- axis -->
              <line x1="30" y1="140" x2="450" y2="140" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- All three curves set via JS, same peak area shown by varying peakY to preserve ~constant area -->
              <path id="cltSen4"   d="" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <path id="cltSen36"  d="" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <path id="cltSen100" d="" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- center line -->
              <line x1="240" y1="30" x2="240" y2="140" stroke="#64748b" stroke-width="1" stroke-dasharray="3,2"/>
              <text x="240" y="157" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">μ=3.5</text>
              <!-- legend -->
              <rect x="42" y="42" width="20" height="3" fill="#f59e0b"/>
              <text x="68" y="47" font-size="11" fill="#b45309" font-weight="600">n=4, SE=0.855 (широкий)</text>
              <rect x="42" y="60" width="20" height="3" fill="#10b981"/>
              <text x="68" y="65" font-size="11" fill="#047857" font-weight="600">n=36, SE=0.285 (средний)</text>
              <rect x="42" y="78" width="20" height="3" fill="#3b82f6"/>
              <text x="68" y="83" font-size="11" fill="#1d4ed8" font-weight="600">n=100, SE=0.171 (узкий)</text>
            </svg>
            <div class="caption">Три кривые показывают распределение выборочного среднего при n=4, 36, 100. Все центрированы на μ=3.5. При росте n кривая сужается по закону SE=σ/√n: чем больше выборка, тем точнее оценка среднего.</div>
            <script>
            (function() {
              var U = App.Util;
              // cx=240, baselineY=140. Same area under each curve (so height × width const).
              // n=4 → halfWidth=150, peakY=100 (wide/short)
              // n=36 → halfWidth=50, peakY=55  (medium)
              // n=100 → halfWidth=30, peakY=30 (narrow/tall)
              U.setPath(document, 'cltSen4',   U.normalOutlinePath(240, 140, 100, 150));
              U.setPath(document, 'cltSen36',  U.normalOutlinePath(240, 140, 55,  50));
              U.setPath(document, 'cltSen100', U.normalOutlinePath(240, 140, 30,  30));
            })();
            </script>
          </div>

          <div class="lesson-box">SE = σ/√n — главная формула планирования исследований. Она показывает, сколько данных нужно для заданной точности. Удвоение точности стоит в 4 раза дороже.</div>
        `
      },
      {
        title: 'Доверительный интервал для среднего',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Опросили 50 клиентов: средний чек = 1200 руб, стандартное отклонение по выборке s = 300 руб. Построить 95% доверительный интервал для среднего чека всех клиентов.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Записываем данные</h4>
            <div class="calc">n = 50 (размер выборки)
x̄ = 1200 руб (выборочное среднее)
s = 300 руб (выборочное std)
Уровень уверенности: 95%</div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем стандартную ошибку среднего (SE)</h4>
            <div class="calc">SE = s / √n = 300 / √50 = 300 / 7.07 ≈ <b>42.4 руб</b></div>
            <div class="why">SE показывает, на сколько «прыгает» выборочное среднее от выборки к выборке. Чем больше n, тем меньше SE, тем точнее наша оценка среднего.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Строим доверительный интервал</h4>
            <p>По ЦПТ выборочное среднее распределено нормально. Для 95% CI:</p>
            <div class="calc">CI = x̄ ± z × SE
   = 1200 ± 1.96 × 42.4
   = 1200 ± 83.1
   = [<b>1116.9</b>, <b>1283.1</b>] руб</div>
            <div class="why">Множитель 1.96 — для 95% уверенности (это z-квантиль). При n < 30 используют t-распределение вместо z, которое даёт чуть более широкий интервал.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Интерпретация</h4>
            <p>«Мы на 95% уверены, что средний чек всех клиентов лежит в диапазоне от <b>1117 до 1283 руб</b>.»</p>
            <p><b>Что это значит формально:</b> если бы мы повторяли это исследование 100 раз с новыми выборками, то примерно в 95 случаях истинное среднее попало бы внутрь нашего интервала.</p>
            <p><b>Что это НЕ значит:</b> «с вероятностью 95% среднее в этом интервале» — истинное среднее фиксировано, а не случайно. Случайный — наш интервал.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>95% CI для среднего чека: <b>[1117, 1283] руб</b>. Ширина ±83 руб.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <linearGradient id="ciFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.08"/>
                </linearGradient>
              </defs>
              <text x="230" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">95% доверительный интервал: 1117–1283 руб</text>

              <!-- Sampling distribution of the mean ~ N(1200, 42.4²) -->
              <!-- cx=230, baselineY=130, peakY=45, halfWidth=180 (±3 SE ≈ ±127 руб) -->
              <path id="ciCurveArea" d="" fill="url(#ciFill)"/>
              <path id="ciCurve"     d="" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

              <!-- axis -->
              <line x1="30" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>

              <!-- CI vertical lines at 1117 (x=151) and 1283 (x=309) -->
              <line x1="151" y1="65" x2="151" y2="130" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="4,3"/>
              <line x1="309" y1="65" x2="309" y2="130" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="4,3"/>

              <!-- point estimate vertical line -->
              <line x1="230" y1="45" x2="230" y2="130" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="230" cy="130" r="5" fill="#1e40af"/>

              <!-- bracket showing CI width -->
              <line x1="151" y1="152" x2="309" y2="152" stroke="#1e40af" stroke-width="2"/>
              <line x1="151" y1="147" x2="151" y2="157" stroke="#1e40af" stroke-width="2"/>
              <line x1="309" y1="147" x2="309" y2="157" stroke="#1e40af" stroke-width="2"/>
              <text x="230" y="146" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">95% CI: ±83 руб</text>

              <!-- number labels -->
              <text x="151" y="172" text-anchor="middle" font-size="11" fill="#1d4ed8" font-weight="700">1117</text>
              <text x="230" y="172" text-anchor="middle" font-size="12" fill="#1e40af" font-weight="700">x̄=1200</text>
              <text x="309" y="172" text-anchor="middle" font-size="11" fill="#1d4ed8" font-weight="700">1283</text>

              <!-- axis range ticks -->
              <text x="40"  y="186" text-anchor="middle" font-size="10" fill="#64748b">1000</text>
              <text x="420" y="186" text-anchor="middle" font-size="10" fill="#64748b">1400</text>

              <!-- bottom annotation -->
              <text x="230" y="205" text-anchor="middle" font-size="11" fill="#475569" font-style="italic">в 95 случаях из 100 CI накрывает истинное μ</text>
            </svg>
            <div class="caption">95% доверительный интервал для среднего чека: синяя колоколообразная кривая — распределение выборочного среднего ~ N(1200, 42.4²). Пунктирные линии — границы 95% CI [1117, 1283]. ЦПТ гарантирует, что такой интервал накрывает истинное μ в 95% случаев.</div>
            <script>
            (function() {
              var U = App.Util;
              // Sampling distribution curve: cx=230, baselineY=130, peakY=45, halfWidth=180 (≈3 SE)
              U.setPath(document, 'ciCurve',     U.normalOutlinePath(230, 130, 45, 180));
              // Shade only the CI region: ±1.96 SE ≈ ±83 руб, mapped to ±79px within ±180px halfwidth
              // 1.96 SE corresponds to 1.96/3 of halfwidth = 0.653 → -1.96 to +1.96 in sigma units
              U.setPath(document, 'ciCurveArea', U.normalSegmentPath(230, 130, 45, 180, -1.96, 1.96));
            })();
            </script>
          </div>

          <div class="lesson-box">Доверительный интервал — прямое следствие ЦПТ. Формула: x̄ ± z × (s/√n). Чем больше выборка, тем уже интервал. Чем выше уверенность (99% вместо 95%), тем шире.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция ЦПТ в действии</h3>
        <p>Выберите исходное (совсем не нормальное!) распределение. Будем брать из него выборки размера n, считать их средние, и смотреть как распределение этих средних становится всё «нормальнее» по мере роста n.</p>
        <div class="sim-container">
          <div class="sim-controls" id="clt-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="clt-run">▶ Запустить</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div>
                <p style="font-size:13px;font-weight:600;color:#475569;margin-bottom:6px;">Исходное распределение (одна выборка большого размера)</p>
                <div class="sim-chart-wrap" style="height:260px;"><canvas id="clt-src"></canvas></div>
              </div>
              <div>
                <p style="font-size:13px;font-weight:600;color:#475569;margin-bottom:6px;">Распределение 2000 выборочных средних</p>
                <div class="sim-chart-wrap" style="height:260px;"><canvas id="clt-means"></canvas></div>
              </div>
            </div>
            <div class="sim-stats" id="clt-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#clt-controls');
        const cSrc = App.makeControl('select', 'clt-src-dist', 'Исходное распределение', {
          options: [
            { value: 'uniform', label: 'Равномерное [0, 10]' },
            { value: 'exp', label: 'Экспоненциальное (λ=1)' },
            { value: 'bimodal', label: 'Бимодальное' },
            { value: 'skewed', label: 'Скошенное' },
          ],
          value: 'exp',
        });
        const cN = App.makeControl('range', 'clt-n', 'Размер выборки n', { min: 1, max: 200, step: 1, value: 30 });
        const cK = App.makeControl('range', 'clt-k', 'Количество выборок', { min: 200, max: 5000, step: 100, value: 2000 });
        [cSrc, cN, cK].forEach((c) => controls.appendChild(c.wrap));

        let chartSrc = null, chartMeans = null;

        function sampleFrom(type, size) {
          if (type === 'uniform') return App.Util.uniformSample(size, 0, 10);
          if (type === 'exp') return App.Util.expSample(size, 1);
          if (type === 'bimodal') {
            const s = [];
            for (let i = 0; i < size; i++) {
              s.push(Math.random() < 0.5 ? App.Util.randn(2, 0.8) : App.Util.randn(8, 0.8));
            }
            return s;
          }
          // skewed: beta-like через суммы
          const s = [];
          for (let i = 0; i < size; i++) {
            const u = Math.random();
            s.push(Math.pow(u, 3) * 10);
          }
          return s;
        }

        function run() {
          const type = cSrc.input.value;
          const n = +cN.input.value;
          const k = +cK.input.value;

          // рисуем исходное распределение большой выборкой
          const src = sampleFrom(type, 5000);
          const hSrc = App.Util.histogram(src, 40);
          const ctxSrc = container.querySelector('#clt-src').getContext('2d');
          if (chartSrc) chartSrc.destroy();
          chartSrc = new Chart(ctxSrc, {
            type: 'bar',
            data: {
              labels: hSrc.centers.map((c) => App.Util.round(c, 1)),
              datasets: [{ data: hSrc.counts, backgroundColor: 'rgba(148, 163, 184, 0.65)' }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { ticks: { maxTicksLimit: 8 } }, y: { beginAtZero: true } },
            },
          });
          App.registerChart(chartSrc);

          // k выборок по n, считаем средние
          const means = new Array(k);
          for (let i = 0; i < k; i++) {
            const s = sampleFrom(type, n);
            means[i] = App.Util.mean(s);
          }
          const hM = App.Util.histogram(means, 40);
          const ctxM = container.querySelector('#clt-means').getContext('2d');
          if (chartMeans) chartMeans.destroy();

          // теоретическая нормальная кривая поверх
          const mMean = App.Util.mean(means);
          const mStd = App.Util.std(means);
          const curve = hM.centers.map((x) => {
            const pdf = App.Util.normalPDF(x, mMean, mStd);
            // масштабируем под счёт
            return pdf * k * hM.width;
          });

          chartMeans = new Chart(ctxM, {
            type: 'bar',
            data: {
              labels: hM.centers.map((c) => App.Util.round(c, 2)),
              datasets: [
                { type: 'bar', data: hM.counts, backgroundColor: 'rgba(59, 130, 246, 0.6)' },
                { type: 'line', data: curve, borderColor: '#dc2626', borderWidth: 2, pointRadius: 0, tension: 0.4 },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { x: { ticks: { maxTicksLimit: 8 } }, y: { beginAtZero: true } },
            },
          });
          App.registerChart(chartMeans);

          // статы
          const statsEl = container.querySelector('#clt-stats');
          statsEl.innerHTML = '';
          const theoreticalSE = App.Util.std(src) / Math.sqrt(n);
          const cards = [
            ['Среднее исходного', App.Util.round(App.Util.mean(src), 3)],
            ['Std исходного', App.Util.round(App.Util.std(src), 3)],
            ['Среднее из средних', App.Util.round(mMean, 3)],
            ['Std средних (наблюдаемый SE)', App.Util.round(mStd, 3)],
            ['Теоретический SE = σ/√n', App.Util.round(theoreticalSE, 3)],
            ['n', n],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [cSrc, cN, cK].forEach((c) => c.input.addEventListener('change', run));
        cN.input.addEventListener('input', run);
        container.querySelector('#clt-run').onclick = run;
        run();
      },
    },

    python: `
      <h3>📊 Симуляция ЦПТ в Python</h3>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt

# Исходное распределение — экспоненциальное (явно НЕ нормальное)
np.random.seed(42)
population = np.random.exponential(scale=5, size=100_000)

print(f"Популяция: μ={population.mean():.2f}, σ={population.std():.2f}")

# Берём 2000 выборок по n наблюдений и считаем средние
sample_sizes = [5, 30, 100]
fig, axes = plt.subplots(1, 3, figsize=(14, 4))

for ax, n in zip(axes, sample_sizes):
    means = [np.random.choice(population, n).mean() for _ in range(2000)]
    ax.hist(means, bins=40, density=True, alpha=0.7)
    ax.set_title(f"n = {n}, std = {np.std(means):.2f}")
    ax.axvline(np.mean(means), color='red', linestyle='--')

plt.suptitle("ЦПТ: распределение выборочных средних")
plt.tight_layout()
plt.show()</code></pre>

      <h3>📈 Проверка σ/√n</h3>
      <pre><code>import numpy as np

pop = np.random.exponential(5, 100_000)
sigma = pop.std()

for n in [10, 30, 100, 500]:
    means = [np.random.choice(pop, n).mean() for _ in range(5000)]
    se_theory = sigma / np.sqrt(n)
    se_actual = np.std(means)
    print(f"n={n:>3d}: теория σ/√n={se_theory:.3f}, "
          f"факт={se_actual:.3f}, "
          f"отклонение={abs(se_theory-se_actual)/se_theory:.1%}")</code></pre>

      <h3>🎯 Доверительный интервал для среднего</h3>
      <pre><code>from scipy import stats
import numpy as np

sample = np.random.exponential(5, size=50)
mean = sample.mean()
se = stats.sem(sample)  # стандартная ошибка среднего

# 95% доверительный интервал
ci = stats.t.interval(0.95, df=len(sample)-1, loc=mean, scale=se)
print(f"Среднее: {mean:.2f}")
print(f"95% ДИ: [{ci[0]:.2f}, {ci[1]:.2f}]")</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Доверительные интервалы для среднего.</b> Формула $\\bar{x} \\pm z_{\\alpha/2} \\cdot s/\\sqrt{n}$ работает напрямую благодаря ЦПТ: выборочное среднее распределено приблизительно нормально, даже если исходные данные нет. Это буквально первый инструмент любого аналитика.</li>
        <li><b>t-тесты, z-тесты, ANOVA.</b> Все параметрические тесты средних опираются на нормальность выборочного среднего. Без ЦПТ ты мог бы применять их только к нормальным данным — а с ЦПТ они работают почти везде при больших $n$.</li>
        <li><b>A/B тестирование в продукте.</b> Сравниваешь конверсию/средний чек/время на сайте между группами? Используешь z-тест пропорций или t-тест. Оба оправданы ЦПТ: конверсия — это среднее Bernoulli-переменной, и при $n \\geq$ нескольких сотен распределение выборочной доли нормально.</li>
        <li><b>Контроль качества и SPC.</b> Shewhart control charts строят «контрольные пределы» как $\\mu \\pm 3\\sigma/\\sqrt{n}$. Это работает только потому, что выборочное среднее партии продукции распределено нормально по ЦПТ, даже если измерения отдельных деталей имеют произвольную форму.</li>
        <li><b>Финансовые оценки и диверсификация.</b> Доходность портфеля из многих активов стремится к нормальной по ЦПТ (при выполнении условий — что, впрочем, часто нарушается из-за зависимостей и тяжёлых хвостов). Основа modern portfolio theory.</li>
        <li><b>Симуляции и Monte Carlo.</b> Когда усредняешь результаты многих симуляций, распределение среднего — нормальное, и ошибка падает как $1/\\sqrt{n}$. Это позволяет оценивать точность симуляций и строить доверительные интервалы для любых численных расчётов.</li>
        <li><b>Sample size calculation.</b> Расчёт необходимого $n$ для эксперимента — $n = (z_{\\alpha/2} \\cdot \\sigma / \\text{MDE})^2$ — это ЦПТ в обратную сторону: сколько точек нужно, чтобы точность среднего была $\\leq$ MDE.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Универсальность.</b> ЦПТ — один из самых мощных результатов в статистике именно потому, что почти ничего не требует: конечное среднее, конечная дисперсия, независимость. Не важно, нормальные у тебя данные или экспоненциальные или биномиальные — среднее всё равно будет нормальным при большом $n$.</p>
      <p><b>Сводит всё к одному распределению.</b> Вместо того чтобы искать сложные формулы для каждой задачи, ты знаешь: «среднее $\\sim N(\\mu, \\sigma^2/n)$». Это позволяет переиспользовать одну таблицу квантилей (или одну функцию <code>scipy.stats.norm</code>) для огромного количества задач.</p>
      <p><b>Скорость сходимости $1/\\sqrt{n}$.</b> Ошибка оценки среднего падает как корень из $n$. Это даёт практическое правило: чтобы удвоить точность, нужно в 4 раза больше данных. Понимание этой скорости — основа sample size planning.</p>
      <p><b>Работает вместе с законом больших чисел.</b> ЗБЧ говорит, что $\\bar{x} \\to \\mu$. ЦПТ уточняет: $\\bar{x} - \\mu \\approx N(0, \\sigma^2/n)$. Вместе они дают полную картину: куда сходится оценка и как быстро.</p>
      <p><b>Оправдывает параметрическую статистику на непараметрических данных.</b> Даже если исходные данные не нормальные, ты можешь применять t-тест и z-тест к среднему. ЦПТ — причина, по которой «классическая» статистика XX века вообще применима в реальной жизни.</p>
      <p><b>Дёшево в реализации.</b> Чтобы применить ЦПТ, не нужны симуляции, MCMC, сложные численные методы. Всё сводится к формулам, которые считаются мгновенно — идеально для real-time аналитики и встроенных систем.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Тяжёлые хвосты убивают ЦПТ.</b> Для распределения Коши ЦПТ не работает в принципе: дисперсия бесконечна, среднее не сходится, выборочное среднее распределено как сам Коши. Для Парето с $\\alpha < 2$ — тоже беда. Финансовые данные, размеры катастроф, размеры файлов — всё это регион, где ЦПТ требует осторожности или вообще не применима.</p>
      <p><b>Малые $n$ — плохая аппроксимация.</b> Правило «$n \\geq 30$» — это грубый ориентир. Для симметричных данных достаточно $n = 15$. Для log-normal или сильно скошенных — и 100 мало. Если ты полагаешься на ЦПТ при $n = 20$ на экспоненциальных данных, твой доверительный интервал будет систематически смещён.</p>
      <p><b>Зависимость наблюдений ломает классическую ЦПТ.</b> Стандартная формулировка требует i.i.d. Временные ряды, кластеризованные данные (школы, семьи), сетевые данные (друзья друзей) — всё это нарушает независимость. Есть обобщённые версии (для слабо зависимых рядов, mixing), но формула $\\sigma/\\sqrt{n}$ даёт слишком узкий ДИ, если игнорировать корреляцию.</p>
      <p><b>ЦПТ — про среднее, а не про отдельные точки.</b> Частая ошибка: «данные большие, значит каждая точка нормальна». Нет! ЦПТ говорит про распределение <b>выборочного среднего</b>, а не про распределение самих наблюдений. Отдельные точки остаются такими, какими были.</p>
      <p><b>Не работает для максимумов и минимумов.</b> Для экстремумов нужна теория экстремальных значений (Gumbel, Fréchet, Weibull), а не ЦПТ. Если твоя метрика — «худший p99 за день», это не среднее, и ЦПТ не поможет.</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Применяй когда</th><th>❌ НЕ применяй когда</th></tr>
        <tr>
          <td>$n \\geq 30$ и распределение не сильно скошенное — классический t-/z-тест работает</td>
          <td>Данные имеют тяжёлые хвосты (Коши, Парето с $\\alpha<2$) — дисперсия бесконечна, ЦПТ не спасёт</td>
        </tr>
        <tr>
          <td>Нужно построить ДИ для среднего по большой выборке без знания распределения</td>
          <td>Выборка маленькая и данные сильно скошены — возьми бутстрэп или непараметрику</td>
        </tr>
        <tr>
          <td>A/B тест с тысячами наблюдений — z-тест пропорций оправдан</td>
          <td>Наблюдения зависимые (временной ряд, кластеры) — стандартная ЦПТ недооценит дисперсию</td>
        </tr>
        <tr>
          <td>Расчёт sample size через $n = (z \\cdot \\sigma / \\text{MDE})^2$</td>
          <td>Интересует максимум / минимум / экстремум — нужна теория экстремальных значений</td>
        </tr>
        <tr>
          <td>Симуляции Monte Carlo — среднее результатов даст нормальную ошибку</td>
          <td>Интересует распределение отдельных точек, а не среднего — ЦПТ вообще не об этом</td>
        </tr>
        <tr>
          <td>Контроль качества: среднее партии продукции против контрольных пределов</td>
          <td>Данные дискретные и $n \\cdot p < 10$ (биномиальное) — нормальная аппроксимация плохая</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-bootstrap')">Бутстрэп</a></b> — ресемплирование вместо ЦПТ. Работает при малых $n$, при тяжёлых хвостах (в разумных пределах), для любых статистик (медиана, квантили, корреляция). Главный ресёрч-инструмент XXI века.</li>
        <li><b>Непараметрические тесты (Mann-Whitney, Wilcoxon, Kruskal-Wallis)</b> — когда данные не вписываются в ЦПТ, а нужна сравнительная статистика. Тестируют ранги, а не средние.</li>
        <li><b>Permutation tests</b> — когда можно перемешать метки групп и считать экстремальность наблюдаемой статистики среди перестановок. Не требует ЦПТ, работает с любой статистикой.</li>
        <li><b>Extreme value theory (EVT)</b> — для максимумов и минимумов. Gumbel, Fréchet, Weibull — аналоги ЦПТ, но для экстремумов.</li>
        <li><b>Робастные методы (M-estimators, trimmed mean)</b> — устойчивы к выбросам и тяжёлым хвостам, имеют свою асимптотическую теорию.</li>
      </ul>
    `,

    extra: `
      <h3>Когда ЦПТ «не спасает»</h3>
      <ul>
        <li><b>Распределение Коши</b> — не имеет дисперсии, ЦПТ неприменима.</li>
        <li><b>Экстремально тяжёлые хвосты</b> (Парето с α<2) — сходимость очень медленная.</li>
        <li><b>Зависимые наблюдения</b> — обычная ЦПТ требует независимости, но есть версии для слабо зависимых рядов.</li>
      </ul>

      <h3>Практическое правило</h3>
      <p>Для симметричных распределений n ≥ 15 обычно достаточно. Для сильно скошенных — n ≥ 50-100. Проверить можно <a class="glossary-link" onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a> выборочных средних.</p>

      <h3><a class="glossary-link" onclick="App.selectTopic('glossary-bootstrap')">Бутстрэп</a> как альтернатива</h3>
      <p>Вместо опоры на ЦПТ можно делать ресемплирование с возвращением: многократно семплируем n элементов из исходной выборки и считаем статистику. Распределение бутстрэп-статистик приближает истинное распределение оценки.</p>

      <h3><a class="glossary-link" onclick="App.selectTopic('glossary-t-distribution')">t-распределение</a> vs нормальное</h3>
      <p>Когда σ неизвестна, используем $\\bar{X} - \\mu)/(s/\\sqrt{n})$ — это распределено по Стьюденту с n−1 <a class="glossary-link" onclick="App.selectTopic('glossary-degrees-of-freedom')">степенями свободы</a>. При n > 30 почти неотличимо от нормального.</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=YAlJCEDH2uY" target="_blank">StatQuest: The Central Limit Theorem</a> — центральная предельная теорема: интуиция и доказательство на пальцах</li>
        <li><a href="https://www.youtube.com/watch?v=zeJD6dqJ5lo" target="_blank">3Blue1Brown: But what is the Central Limit Theorem?</a> — визуальное объяснение ЦПТ с анимациями</li>
        <li><a href="https://www.khanacademy.org/math/ap-statistics/sampling-distribution-ap/what-is-sampling-distribution/v/central-limit-theorem" target="_blank">Khan Academy: Central Limit Theorem</a> — интерактивные упражнения и объяснение</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D1%86%D0%B5%D0%BD%D1%82%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BE%D1%80%D0%B5%D0%BC%D0%B0" target="_blank">Habr: центральная предельная теорема</a> — статьи о ЦПТ и её применении</li>
        <li><a href="https://en.wikipedia.org/wiki/Central_limit_theorem" target="_blank">Wikipedia: Central limit theorem</a> — строгая формулировка и условия применимости</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://numpy.org/doc/stable/reference/random/generated/numpy.random.normal.html" target="_blank">NumPy: numpy.random.normal</a> — симуляция нормального распределения для демонстрации ЦПТ</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.sem.html" target="_blank">SciPy: scipy.stats.sem</a> — вычисление стандартной ошибки среднего</li>
      </ul>
    `,
  },
});
