/* ==========================================================================
   Байесовский A/B тест
   ========================================================================== */
App.registerTopic({
  id: 'ab-bayesian',
  category: 'ab',
  title: 'Байесовский A/B тест',
  summary: 'Вероятность того, что B лучше A — без p-value и порогов.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Ключевая идея</div>
        <p>Классический (частотный) A/B тест отвечает на вопрос: <b>«если разницы нет — насколько вероятно увидеть такие данные?»</b>. Это косвенный вопрос. Нас же интересует: <b>«с какой вероятностью B действительно лучше A?»</b></p>
        <p>Байесовский подход отвечает именно на это. По мере сбора данных мы накапливаем убеждения о конверсии каждого варианта в форме вероятностных распределений. Итоговый ответ — число от 0 до 1: «вероятность того, что B лучше A».</p>
        <p>Если P(B > A) = 0.97 — это понятно бизнесу без всяких p-value, критических значений и порогов. Это прямой ответ на практический вопрос.</p>
      </div>

      <h3>🎯 Модель Beta-Binomial</h3>
      <p>Рассмотрим классический случай: конверсия (кнопка «Купить», регистрация и т.д.).</p>
      <p>У каждого варианта есть неизвестная <b>истинная конверсия</b> $\\theta$ (число от 0 до 1). Мы наблюдаем $k$ успехов из $n$ показов.</p>

      <p>Байесовский рецепт:</p>
      <ol>
        <li><b>Выбираем prior</b> — начальное убеждение о $\\theta$ до данных.</li>
        <li><b>Наблюдаем данные</b> — $k$ конверсий из $n$ посещений.</li>
        <li><b>Вычисляем posterior</b> — обновлённое убеждение о $\\theta$.</li>
        <li><b>Отвечаем на вопрос</b> — P(θ_B > θ_A) по двум posterior-распределениям.</li>
      </ol>

      <h3>🔢 Beta-распределение как prior</h3>
      <p><span class="term" data-tip="Beta-distribution. Распределение на [0,1], параметризованное α и β. Beta(1,1) — равномерное. Beta(α,β) — пик смещается к α/(α+β). Используется как сопряжённый prior для биномиального правдоподобия.">Beta-распределение</span> $\\text{Beta}(\\alpha, \\beta)$ — идеальный prior для конверсии:</p>
      <ul>
        <li>Определено на $[0, 1]$ — правильный диапазон для вероятности.</li>
        <li>$\\text{Beta}(1, 1)$ — равномерный prior (полная неопределённость).</li>
        <li>$\\text{Beta}(\\alpha, \\beta)$ с $\\alpha > 1, \\beta > 1$ — уверенность в конверсии $\\frac{\\alpha}{\\alpha+\\beta}$.</li>
        <li>$\\alpha$ и $\\beta$ интерпретируются как «псевдо-успехи» и «псевдо-неудачи».</li>
      </ul>
      <div class="math-block">$$\\text{Beta}(\\theta; \\alpha, \\beta) = \\frac{\\theta^{\\alpha-1}(1-\\theta)^{\\beta-1}}{B(\\alpha,\\beta)}, \\quad \\theta \\in [0,1]$$</div>

      <h3>📊 Байесовское обновление: Prior → Posterior</h3>
      <p>Самое красивое в Beta-Binomial модели: <span class="term" data-tip="Conjugate prior. Сопряжённый prior — такой, что posterior имеет ту же форму. Для биномиального правдоподобия Beta является сопряжённым prior.">сопряжённость</span> делает обновление элементарным:</p>

      <div class="math-block">$$\\text{Prior: } \\text{Beta}(\\alpha_0, \\beta_0)$$</div>
      <div class="math-block">$$\\text{Данные: } k \\text{ успехов из } n \\text{ попыток}$$</div>
      <div class="math-block">$$\\text{Posterior: } \\text{Beta}(\\alpha_0 + k,\\; \\beta_0 + n - k)$$</div>

      <p>Просто добавляем успехи к $\\alpha$ и неудачи к $\\beta$. Никаких сложных вычислений!</p>

      <div class="key-concept">
        <div class="kc-label">Интерпретация параметров posterior</div>
        <p>Posterior $\\text{Beta}(\\alpha_0 + k, \\beta_0 + n - k)$ можно читать как: «наша уверенность теперь такова, как будто мы наблюдали $\\alpha_0 + k$ успехов и $\\beta_0 + n - k$ неудач в сумме». Prior — это «виртуальные» предыдущие наблюдения.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 215" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <defs>
            <linearGradient id="bab_gradA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/>
            </linearGradient>
            <linearGradient id="bab_gradB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/>
            </linearGradient>
            <linearGradient id="bab_prior" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.05"/>
            </linearGradient>
            <marker id="bab_arr" markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#f59e0b"/>
            </marker>
          </defs>
          <text x="280" y="16" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Posterior-распределения конверсии A и B</text>
          <!-- Axes -->
          <line x1="40" y1="175" x2="530" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <line x1="40" y1="175" x2="40" y2="28" stroke="#64748b" stroke-width="1.5"/>
          <text x="285" y="198" text-anchor="middle" font-size="10" fill="#64748b">θ (истинная конверсия)</text>
          <!-- X-axis ticks -->
          <text x="40"  y="188" text-anchor="middle" font-size="9" fill="#64748b">0</text>
          <text x="138" y="188" text-anchor="middle" font-size="9" fill="#64748b">0.2</text>
          <text x="236" y="188" text-anchor="middle" font-size="9" fill="#64748b">0.4</text>
          <text x="334" y="188" text-anchor="middle" font-size="9" fill="#64748b">0.6</text>
          <text x="432" y="188" text-anchor="middle" font-size="9" fill="#64748b">0.8</text>
          <text x="530" y="188" text-anchor="middle" font-size="9" fill="#64748b">1.0</text>
          <!-- Prior flat (Beta(1,1)) -->
          <path d="M40,172 L530,172" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4"/>
          <!-- Posterior A: Beta(52,952) peak ~5.2% → θ≈0.052 → x=40+0.052*490≈65, wide curve -->
          <!-- scale: x = 40 + θ*490  so θ=0.05→x=64.5, θ=0.1→x=89 -->
          <!-- Beta(52,952) mean=52/1004≈0.0518, sd≈sqrt(52*952/1004^2/1005)≈0.007 -->
          <!-- peak at x≈64.5, half-width ~3SD=0.021 → 10px, very narrow -->
          <!-- Draw bell at x≈65, spread ≈ 25px visually  -->
          <path d="M40,173 C45,173 52,172 58,168 C62,163 64,152 65,138 C66,120 67,100 67.5,80 C68,60 68,45 68.5,35 C69,28 69.5,26 70,26 C70.5,26 71,28 71.5,35 C72,42 72.5,57 73,76 C73.5,96 74,116 75,136 C76,152 78,163 82,168 C88,172 100,173 530,173" fill="url(#bab_gradA)" stroke="#3b82f6" stroke-width="2.2"/>
          <!-- Posterior B: Beta(67,933) mean=67/1000=0.067 → x=40+0.067*490≈73, slightly right -->
          <path d="M45,173 C52,173 60,172 67,168 C71,163 73.5,152 74.5,138 C75.5,122 76,105 76.5,88 C77,70 77.5,52 78,40 C78.3,32 78.7,29 79,27.5 C79.3,26.5 79.7,26 80,26 C80.3,26 80.7,26.5 81,27.5 C81.3,29 81.7,32 82,40 C82.5,52 83,70 83.5,88 C84,105 84.5,122 85.5,138 C86.5,152 88,163 92,168 C99,172 115,173 530,173" fill="url(#bab_gradB)" stroke="#10b981" stroke-width="2.2"/>
          <!-- Overlap shading indicator -->
          <text x="68" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#3b82f6">A</text>
          <text x="80" y="15" text-anchor="middle" font-size="10" font-weight="700" fill="#10b981">B</text>
          <!-- P(B>A) arrow annotation -->
          <path d="M85,100 C120,80 160,75 185,78" stroke="#f59e0b" stroke-width="2" fill="none" marker-end="url(#bab_arr)"/>
          <text x="165" y="68" text-anchor="middle" font-size="11" font-weight="700" fill="#d97706">P(B &gt; A) = ?</text>
          <!-- Legend -->
          <line x1="200" y1="205" x2="225" y2="205" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
          <text x="232" y="208" font-size="9" fill="#64748b">Prior Beta(1,1)</text>
          <rect x="310" y="200" width="14" height="9" fill="url(#bab_gradA)" stroke="#3b82f6" stroke-width="1"/>
          <text x="328" y="208" font-size="9" fill="#1e293b">Posterior A</text>
          <rect x="400" y="200" width="14" height="9" fill="url(#bab_gradB)" stroke="#10b981" stroke-width="1"/>
          <text x="418" y="208" font-size="9" fill="#1e293b">Posterior B</text>
        </svg>
        <div class="caption">Два posterior-распределения конверсии. Равномерный prior Beta(1,1) после данных превращается в острые пики. P(B&gt;A) — доля «пространства» где зелёный хвост правее синего. Считается через Монте-Карло.</div>
      </div>

      <h3>🎲 P(B > A) через Монте-Карло</h3>
      <p>Как вычислить вероятность того, что $\\theta_B > \\theta_A$? Аналитическая формула существует (через неполную бета-функцию), но на практике проще:</p>
      <ol>
        <li>Из posterior A семплируем $N$ значений: $\\theta_A^{(1)}, \\ldots, \\theta_A^{(N)}$.</li>
        <li>Из posterior B семплируем $N$ значений: $\\theta_B^{(1)}, \\ldots, \\theta_B^{(N)}$.</li>
        <li>$\\hat{P}(B > A) = \\frac{1}{N}\\sum_{i=1}^{N} \\mathbf{1}[\\theta_B^{(i)} > \\theta_A^{(i)}]$.</li>
      </ol>
      <p>При $N = 100000$ ошибка оценки менее 0.1%. Это просто и интерпретируемо.</p>

      <h3>📉 Expected Loss (ожидаемые потери)</h3>
      <p>Ещё более информативная метрика: если мы выберем B, сколько в среднем потеряем по сравнению с правильным выбором?</p>
      <div class="math-block">$$\\text{Loss}(B) = E\\left[\\max(\\theta_A - \\theta_B, 0)\\right] \\approx \\frac{1}{N}\\sum_i \\max(\\theta_A^{(i)} - \\theta_B^{(i)}, 0)$$</div>
      <p>Порог остановки: если Loss(B) < $\\epsilon$ (например, 0.001 — потеря менее 0.1 п.п.) — запускаем B. Это позволяет принимать бизнес-решение в реальных единицах, а не в абстрактных p-value.</p>

      <h3>🔭 Преимущества байесовского подхода</h3>
      <ul>
        <li><b>Интерпретируемость</b> — «97% вероятность, что B лучше» понятно всем стейкхолдерам.</li>
        <li><b>Нет проблемы подглядывания</b> — можно смотреть на данные в любой момент без инфляции ошибок. P(B > A) просто обновляется с каждым новым наблюдением.</li>
        <li><b>Непрерывный мониторинг</b> — в отличие от частотного теста, где нужно ждать заранее определённого n.</li>
        <li><b>Включение prior знаний</b> — если исторически конверсия 3–5%, это можно закодировать в prior.</li>
        <li><b>Вероятностные выводы</b> — вместо бинарного «значимо/незначимо» получаем вероятностный спектр.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: Thompson Sampling и онлайн-оптимизация</summary>
        <div class="deep-dive-body">
          <p><span class="term" data-tip="Thompson Sampling. Байесовский алгоритм многорукого бандита. На каждом шаге семплируем θ из posterior каждого варианта и показываем вариант с наибольшим θ. Балансирует exploration и exploitation.">Thompson Sampling</span> — это использование байесовских posterior для онлайн-принятия решений:</p>
          <ol>
            <li>Для каждого варианта семплируем одно значение $\\theta^{(s)}$ из текущего posterior.</li>
            <li>Показываем пользователю вариант с наибольшим $\\theta^{(s)}$.</li>
            <li>Получаем результат → обновляем posterior.</li>
          </ol>
          <p>Это решает проблему exploration/exploitation: пока один вариант явно лучше — его показываем чаще, но не полностью прекращаем проверку остальных. В отличие от классического A/B теста, уже во время эксперимента направляем трафик на лучший вариант.</p>
          <p>Используется в рекомендательных системах (Spotify, Netflix), контекстной рекламе, news feeds.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Credible Interval vs Доверительный интервал</summary>
        <div class="deep-dive-body">
          <p>Байесовский <b>Credible Interval</b> (CI) и частотный <b>Confidence Interval</b> — похожие по виду, но принципиально разные концепции:</p>
          <table>
            <tr><th></th><th>Confidence Interval (частотный)</th><th>Credible Interval (байесовский)</th></tr>
            <tr><td>Определение</td><td>При многократном повторении 95% таких интервалов накроют истинный θ</td><td>С вероятностью 95% θ находится в этом интервале</td></tr>
            <tr><td>Интерпретация</td><td>Фиксированный, но неправильно понимается</td><td>Именно то, что все и так думают о CI</td></tr>
            <tr><td>Зависит от prior</td><td>Нет</td><td>Да</td></tr>
          </table>
          <p>Парадокс: частотный CI <b>нельзя</b> интерпретировать как «вероятность», но все так и делают. Байесовский можно — это ровно то, что он означает.</p>
          <p>В Beta-Binomial модели 95% credible interval — это квантили 2.5% и 97.5% posterior Beta-распределения. Вычисляется через <code>scipy.stats.beta.ppf([0.025, 0.975], α, β)</code>.</p>
        </div>
      </div>

      <h3>⚠️ Ограничения и подводные камни</h3>
      <ul>
        <li><b>Выбор prior имеет значение</b> при малых выборках. Информативный prior может доминировать над данными. При больших n prior «смывается» данными.</li>
        <li><b>Метрики не для конверсий</b> — для непрерывных метрик (выручка, время) нужны другие модели (Normal-Normal, Gamma-Poisson). Beta-Binomial — только для пропорций.</li>
        <li><b>Нет гарантии на ошибки I рода</b> — если бизнес требует строгого контроля FDR, нужны специальные процедуры.</li>
        <li><b>P(B > A) ≠ P(запустить B правильно)</b> — нужно ещё учитывать размер эффекта (Expected Loss).</li>
      </ul>
    `,

    examples: [
      {
        title: 'Конверсия двух вариантов',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Тест кнопки «Оформить заказ»: красная (A) vs зелёная (B). Начинаем с равномерного prior. Считаем posterior и P(B > A) через Монте-Карло.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Вариант</th><th>Показы (n)</th><th>Конверсии (k)</th><th>Конверсия</th></tr>
              <tr><td><b>A (красная)</b></td><td>1000</td><td>51</td><td>5.1%</td></tr>
              <tr><td><b>B (зелёная)</b></td><td>1000</td><td>67</td><td>6.7%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Задаём prior</h4>
            <div class="calc">Prior: Beta(1, 1) — равномерный, «ничего не знаем»
  α₀ = 1, β₀ = 1

Смысл: как будто у нас был 1 успех и 1 неудача в истории — минимальная информация.</div>
            <div class="why">Beta(1,1) = Uniform(0,1). Это «честный» prior когда нет исторических данных. Если есть история (например, конверсии всегда 3-8%), можно использовать информативный prior вроде Beta(5, 95).</div>
          </div>

          <div class="step" data-step="2">
            <h4>Вычисляем posteriors</h4>
            <div class="calc">Posterior A:
  α_A = 1 + 51  = 52
  β_A = 1 + (1000 − 51) = 950
  → Beta(52, 950)
  Среднее = 52/1002 ≈ 5.19%,  SD ≈ 0.70%

Posterior B:
  α_B = 1 + 67  = 68
  β_B = 1 + (1000 − 67) = 934
  → Beta(68, 934)
  Среднее = 68/1002 ≈ 6.79%,  SD ≈ 0.79%</div>
            <div class="why">Просто добавляем успехи к α и неудачи к β. Это и есть вся «математика» обновления для Beta-Binomial модели.</div>
          </div>

          <div class="step" data-step="3">
            <h4>95% Credible Intervals</h4>
            <div class="calc">CI для θ_A: [3.83%, 6.70%]  (квантили 2.5% и 97.5% Beta(52,950))
CI для θ_B: [5.30%, 8.43%]  (квантили 2.5% и 97.5% Beta(68,934))

Интерпретация:
  С вероятностью 95% истинная конверсия A ∈ [3.83%, 6.70%]
  С вероятностью 95% истинная конверсия B ∈ [5.30%, 8.43%]

Интервалы немного перекрываются — результат неоднозначен?</div>
          </div>

          <div class="step" data-step="4">
            <h4>Монте-Карло: P(B > A)</h4>
            <div class="calc">Псевдокод (N = 100 000 симуляций):
  theta_A ~ Beta(52, 950)   // N случайных конверсий для A
  theta_B ~ Beta(68, 934)   // N случайных конверсий для B
  P(B > A) = mean(theta_B > theta_A)

Результат: <b>P(B > A) ≈ 0.968</b>

Expected Loss при выборе B:
  Loss = mean(max(theta_A − theta_B, 0)) ≈ 0.00041 (0.041 п.п.)

Expected Loss при выборе A:
  Loss = mean(max(theta_B − theta_A, 0)) ≈ 0.01640 (1.64 п.п.)</div>
            <div class="why">P(B>A)=0.968 означает: в 96.8% симуляций зелёная кнопка имеет более высокую истинную конверсию. Ожидаемые потери от выбора B крошечны (0.041 п.п.) против потерь от выбора A (1.64 п.п.).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>P(B > A) = <b>96.8%</b>. Expected Loss(B) = 0.041 п.п. Рекомендация: запускать вариант B. Классический z-тест на тех же данных: z = 1.93, p = 0.053 — <i>не значимо</i>! Байесовский подход принял бы решение, частотный — нет.</p>
          </div>

          <div class="lesson-box">Перекрывающиеся credible intervals НЕ означают, что разница незначима — важна совместная вероятность P(θ_B > θ_A), а не сравнение отдельных интервалов.</div>
        `
      },
      {
        title: 'Когда остановить тест',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Тест идёт уже неделю. Каждый день приходят новые данные. Когда можно остановить и принять решение? Используем Expected Loss как критерий остановки.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>День</th><th>n_A</th><th>k_A</th><th>n_B</th><th>k_B</th><th>P(B&gt;A)</th><th>Loss(B)</th></tr>
              <tr><td>1</td><td>100</td><td>5</td><td>100</td><td>8</td><td>78.2%</td><td>0.0198</td></tr>
              <tr><td>2</td><td>200</td><td>10</td><td>200</td><td>14</td><td>80.4%</td><td>0.0162</td></tr>
              <tr><td>3</td><td>300</td><td>15</td><td>300</td><td>21</td><td>83.1%</td><td>0.0130</td></tr>
              <tr><td>4</td><td>400</td><td>20</td><td>400</td><td>30</td><td>89.7%</td><td>0.0084</td></tr>
              <tr><td>5</td><td>500</td><td>26</td><td>500</td><td>38</td><td>92.5%</td><td>0.0059</td></tr>
              <tr><td>6</td><td>600</td><td>31</td><td>600</td><td>45</td><td>94.8%</td><td>0.0041</td></tr>
              <tr><td>7</td><td>700</td><td>36</td><td>700</td><td>53</td><td>96.3%</td><td>0.0028</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Задаём критерии остановки</h4>
            <div class="calc">Критерий 1 (P-порог): остановить когда P(B > A) ≥ 0.95
Критерий 2 (Loss-порог): остановить когда Loss(B) ≤ 0.005 (0.5 п.п.)

Порог 0.5 п.п. означает: «мы готовы запустить B, даже если он хуже A
максимум на 0.5 п.п. в ожидаемом значении»</div>
            <div class="why">Loss-порог задаётся в бизнес-терминах. Если минимальный значимый эффект для бизнеса = 1 п.п., то потери 0.5 п.п. приемлемы. Это гораздо понятнее, чем абстрактный α=0.05.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Отслеживаем posterior по дням</h4>
            <div class="calc">День 7:
  Posterior A: Beta(1+36, 1+664) = Beta(37, 665)
    Среднее = 37/702 ≈ 5.27%
  Posterior B: Beta(1+53, 1+647) = Beta(54, 648)
    Среднее = 54/702 ≈ 7.69%

P(B > A) = 96.3% ≥ 95% ✓
Loss(B)  = 0.0028 ≤ 0.005 ✓

→ Оба критерия выполнены на 7-й день</div>
          </div>

          <div class="step" data-step="3">
            <h4>Сравнение с частотным подходом</h4>
            <div class="calc">Частотный тест: заранее рассчитан n = 1300 на группу для мощности 80%, α=0.05
  → нельзя останавливать до 1300 показов!

На день 7 (700 показов/группу) частотный тест:
  z = (7.57% − 5.14%) / SE ≈ 2.67, p = 0.008 → значимо
  Но мы «заглядывали» 7 раз → inflated α! Реальный α ≈ 0.20.

Байесовский подход:
  Можно смотреть каждый день. P(B>A) просто обновляется.
  Нет накопления ошибок I рода.</div>
            <div class="why">Это одно из ключевых практических преимуществ байесовского подхода: отсутствие «проблемы подглядывания» (peeking problem). В частотных тестах каждый промежуточный взгляд увеличивает вероятность ложной значимости.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Останавливаем тест на <b>7-й день</b> (700 показов/группу), когда P(B > A) = 96.3% и Expected Loss = 0.28 п.п. Запускаем B. Сэкономили ~600 показов vs частотный подход (требовал 1300/группу).</p>
          </div>

          <div class="lesson-box">Expected Loss как критерий остановки — самый практичный байесовский критерий. Он напрямую отвечает: «если мы ошибёмся — сколько потеряем?». Задайте порог в бизнес-единицах, а не в вероятностях.</div>
        `
      },
      {
        title: 'Сравнение с z-тестом',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Одни и те же данные, два теста. Разбираем случай когда частотный и байесовский подходы приходят к разным выводам — и почему это не противоречие, а разные вопросы.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Вариант</th><th>Показы</th><th>Конверсии</th><th>CR</th></tr>
              <tr><td><b>A</b></td><td>800</td><td>42</td><td>5.25%</td></tr>
              <tr><td><b>B</b></td><td>800</td><td>55</td><td>6.875%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Частотный z-тест</h4>
            <div class="calc">H₀: p_A = p_B
p̂ = (42+55)/(800+800) = 97/1600 = 0.0606

SE = √(0.0606 × 0.9394 × (1/800 + 1/800)) = √(0.0000711) ≈ 0.00843

z = (0.06875 − 0.0525) / 0.00843 = 0.01625 / 0.00843 ≈ <b>1.928</b>

p-value (двусторонний) = 2 × P(Z > 1.928) ≈ <b>0.054</b>

Вывод при α=0.05: <b>НЕ отвергаем H₀</b> (p = 0.054 > 0.05)</div>
          </div>

          <div class="step" data-step="2">
            <h4>Байесовский подход</h4>
            <div class="calc">Prior: Beta(1, 1)

Posterior A: Beta(43, 759)  → среднее ≈ 5.36%
Posterior B: Beta(56, 746)  → среднее ≈ 6.99%

Monte Carlo (N=100000):
  P(B > A) ≈ <b>0.947</b>   (94.7%)
  Expected Loss (B) ≈ 0.0051  (0.51 п.п.)
  Expected Loss (A) ≈ 0.0168  (1.68 п.п.)

Вывод: выбор B рационален (потери минимальны)</div>
          </div>

          <div class="step" data-step="3">
            <h4>Почему они расходятся?</h4>
            <div class="calc">Частотный тест: «при H₀: p_A=p_B, данные выглядят недостаточно редко (p=0.054)»
  → Решение: нет достаточных улик против H₀
  → Действие: «не отвергаем» (≠ «принимаем A»)

Байесовский: «с 94.7% вероятностью θ_B > θ_A по текущим данным»
  → Это прямой ответ: скорее всего B лучше
  → Expected Loss от выбора B минимален

Ключевое различие:
  Частотный отвечает: «достаточно ли данных против H₀?»
  Байесовский отвечает: «что мы думаем об истинных значениях θ?»</div>
            <div class="why">Это не противоречие — они отвечают на РАЗНЫЕ вопросы. При p=0.054 данные «почти» нарушают H₀ в частотном смысле, а байесовский говорит «94.7% — довольно уверен».</div>
          </div>

          <div class="step" data-step="4">
            <h4>Какой подход выбрать?</h4>
            <div class="calc">Используйте частотный когда:
  ✓ Нужен строгий контроль ошибки I рода (медицина, финансы)
  ✓ Регуляторные требования
  ✓ Заранее определённый размер выборки

Используйте байесовский когда:
  ✓ Нужна интерпретируемость для бизнеса
  ✓ Хотите мониторить результат в реальном времени
  ✓ Хотите включить prior знания
  ✓ Нужно принять решение при небольших данных</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Z-тест: p = 0.054, <b>не значимо</b> при α=0.05. Байесовский тест: P(B > A) = <b>94.7%</b>, Expected Loss(B) = 0.51 п.п. Расхождение из-за разных вопросов, а не ошибок. Для бизнес-решений байесовская интерпретация часто полезнее.</p>
          </div>

          <div class="lesson-box">P(B>A)=0.947 при p=0.054 — не противоречие. Порог α=0.05 произвольный. Если бизнес готов принять риск 5.3%, ожидая выиграть 1.68 п.п. против потери 0.51 п.п. — решение очевидно.</div>
        `
      },
    ],

    simulation: {
      html: `
        <h3>Байесовский A/B: апостериорные распределения</h3>
        <p>Задай данные обеих групп — увидишь posteriors и P(B лучше A).</p>
        <div class="sim-container">
          <div class="sim-controls" id="abbay-controls"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="abbay-chart"></canvas></div>
            <div class="sim-stats" id="abbay-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#abbay-controls');
        const cNA = App.makeControl('range', 'abbay-na', 'Показов A', { min: 50, max: 5000, step: 50, value: 1000 });
        const cSA = App.makeControl('range', 'abbay-sa', 'Конверсий A', { min: 1, max: 500, step: 1, value: 50 });
        const cNB = App.makeControl('range', 'abbay-nb', 'Показов B', { min: 50, max: 5000, step: 50, value: 1000 });
        const cSB = App.makeControl('range', 'abbay-sb', 'Конверсий B', { min: 1, max: 500, step: 1, value: 65 });
        [cNA, cSA, cNB, cSB].forEach(c => controls.appendChild(c.wrap));
        let chart = null;
        function betaPdf(x, a, b) { return x <= 0 || x >= 1 ? 0 : Math.pow(x, a-1) * Math.pow(1-x, b-1); }
        function run() {
          const nA = +cNA.input.value, sA = Math.min(+cSA.input.value, nA);
          const nB = +cNB.input.value, sB = Math.min(+cSB.input.value, nB);
          const aA = 1 + sA, bA = 1 + nA - sA;
          const aB = 1 + sB, bB = 1 + nB - sB;
          const xs = App.Util.linspace(0.001, 0.2, 200);
          const pdfA = xs.map(x => betaPdf(x, aA, bA));
          const pdfB = xs.map(x => betaPdf(x, aB, bB));
          const normA = pdfA.reduce((s,v) => s+v, 0) * (xs[1]-xs[0]);
          const normB = pdfB.reduce((s,v) => s+v, 0) * (xs[1]-xs[0]);
          // Monte Carlo P(B>A)
          let wins = 0; const mc = 10000;
          for (let i = 0; i < mc; i++) {
            let sa = 0; for (let j = 0; j < aA; j++) sa -= Math.log(Math.random()); let ra = 0; for (let j = 0; j < bA; j++) ra -= Math.log(Math.random()); const pA = sa / (sa + ra);
            let sb = 0; for (let j = 0; j < aB; j++) sb -= Math.log(Math.random()); let rb = 0; for (let j = 0; j < bB; j++) rb -= Math.log(Math.random()); const pB = sb / (sb + rb);
            if (pB > pA) wins++;
          }
          const probBwins = wins / mc;
          const ctx = container.querySelector('#abbay-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'line', data: { labels: xs.map(x => (x*100).toFixed(1)),
              datasets: [{ label: 'Posterior A', data: pdfA.map((v,i) => v/normA), borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0, fill: false },
                         { label: 'Posterior B', data: pdfB.map((v,i) => v/normB), borderColor: '#10b981', borderWidth: 2, pointRadius: 0, fill: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'P(B лучше A) = ' + (probBwins*100).toFixed(1) + '%' } }, scales: { x: { title: { display: true, text: 'Конверсия %' }, ticks: { maxTicksLimit: 10 } }, y: { title: { display: true, text: 'Плотность' } } } },
          });
          App.registerChart(chart);
          container.querySelector('#abbay-stats').innerHTML = '<div class="stat-card"><div class="stat-label">P(B лучше A)</div><div class="stat-value">' + (probBwins*100).toFixed(1) + '%</div></div><div class="stat-card"><div class="stat-label">CR(A)</div><div class="stat-value">' + (sA/nA*100).toFixed(2) + '%</div></div><div class="stat-card"><div class="stat-label">CR(B)</div><div class="stat-value">' + (sB/nB*100).toFixed(2) + '%</div></div><div class="stat-card"><div class="stat-label">Posterior mean A</div><div class="stat-value">' + (aA/(aA+bA)*100).toFixed(2) + '%</div></div><div class="stat-card"><div class="stat-label">Posterior mean B</div><div class="stat-value">' + (aB/(aB+bB)*100).toFixed(2) + '%</div></div>';
        }
        [cNA, cSA, cNB, cSB].forEach(c => c.input.addEventListener('input', run));
        run();
      },
    },

    python: `
      <h3>📊 Байесовский A/B тест в Python</h3>
      <pre><code>from scipy import stats
import numpy as np

# Данные теста
conv_A, n_A = 120, 5000   # группа A
conv_B, n_B = 155, 5000   # группа B

# Априорное распределение: Beta(1, 1) — неинформативное
alpha_prior, beta_prior = 1, 1

# Апостериорные распределения: Beta(alpha + conversions, beta + non-conversions)
post_A = stats.beta(alpha_prior + conv_A, beta_prior + n_A - conv_A)
post_B = stats.beta(alpha_prior + conv_B, beta_prior + n_B - conv_B)

print(f"Posterior A: Beta({alpha_prior+conv_A}, {beta_prior+n_A-conv_A})")
print(f"  Среднее: {post_A.mean():.4f}, 95% ДИ: [{post_A.ppf(0.025):.4f}, {post_A.ppf(0.975):.4f}]")
print(f"\\nPosterior B: Beta({alpha_prior+conv_B}, {beta_prior+n_B-conv_B})")
print(f"  Среднее: {post_B.mean():.4f}, 95% ДИ: [{post_B.ppf(0.025):.4f}, {post_B.ppf(0.975):.4f}]")</code></pre>

      <h3>🎲 Monte Carlo: P(B > A)</h3>
      <pre><code>import numpy as np
from scipy import stats

# Генерируем сэмплы из апостериорных распределений
n_samples = 100_000
samples_A = stats.beta(121, 4881).rvs(n_samples)
samples_B = stats.beta(156, 4846).rvs(n_samples)

# P(B > A) — просто доля сэмплов, где B лучше
prob_B_wins = (samples_B > samples_A).mean()
print(f"P(B > A) = {prob_B_wins:.4f} ({prob_B_wins:.1%})")

# Ожидаемый lift
lift = (samples_B - samples_A) / samples_A
print(f"Ожидаемый lift: {lift.mean():.2%}")
print(f"95% ДИ lift: [{np.percentile(lift, 2.5):.2%}, {np.percentile(lift, 97.5):.2%}]")

# Риск (expected loss)
loss_A = np.maximum(samples_B - samples_A, 0).mean()
loss_B = np.maximum(samples_A - samples_B, 0).mean()
print(f"\\nExpected loss если выбрать A: {loss_A:.5f}")
print(f"Expected loss если выбрать B: {loss_B:.5f}")</code></pre>

      <h3>📈 Визуализация апостериорных распределений</h3>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

x = np.linspace(0.015, 0.045, 1000)
post_A = stats.beta(121, 4881)
post_B = stats.beta(156, 4846)

plt.plot(x, post_A.pdf(x), 'b-', lw=2, label=f'A: {post_A.mean():.4f}')
plt.plot(x, post_B.pdf(x), 'g-', lw=2, label=f'B: {post_B.mean():.4f}')
plt.fill_between(x, post_A.pdf(x), alpha=0.2, color='blue')
plt.fill_between(x, post_B.pdf(x), alpha=0.2, color='green')
plt.xlabel("Конверсия")
plt.ylabel("Плотность")
plt.title("Апостериорные распределения конверсий")
plt.legend()
plt.show()</code></pre>
    `,

    math: `
      <h3>Основные формулы</h3>

      <h4>Байесовское обновление (Beta-Binomial)</h4>
      <div class="math-block">$$\\text{Prior: } \\theta \\sim \\text{Beta}(\\alpha_0, \\beta_0)$$</div>
      <div class="math-block">$$\\text{Likelihood: } k \\mid \\theta, n \\sim \\text{Binomial}(n, \\theta)$$</div>
      <div class="math-block">$$\\text{Posterior: } \\theta \\mid k, n \\sim \\text{Beta}(\\alpha_0 + k,\\; \\beta_0 + n - k)$$</div>

      <h4>Параметры posterior</h4>
      <div class="math-block">$$E[\\theta \\mid k, n] = \\frac{\\alpha_0 + k}{\\alpha_0 + \\beta_0 + n}, \\quad \\text{Var}[\\theta \\mid k,n] = \\frac{(\\alpha+k)(\\beta+n-k)}{(\\alpha+\\beta+n)^2(\\alpha+\\beta+n+1)}$$</div>

      <h4>Вероятность превосходства (аналитически)</h4>
      <div class="math-block">$$P(\\theta_B > \\theta_A) = \\sum_{i=0}^{\\alpha_B - 1} \\frac{B(\\alpha_A + i,\\; \\beta_A + \\beta_B)}{(\\beta_B + i)\\, B(1+i,\\, \\beta_B)\\, B(\\alpha_A,\\, \\beta_A)}$$</div>
      <p>На практике используется Монте-Карло.</p>

      <h4>Expected Loss</h4>
      <div class="math-block">$$\\text{Loss}(B) = E[\\max(\\theta_A - \\theta_B,\\, 0)] = \\int_0^1\\int_0^1 \\max(\\theta_A - \\theta_B,0)\\, p(\\theta_A)\\, p(\\theta_B)\\, d\\theta_A\\, d\\theta_B$$</div>

      <h4>Monte Carlo оценка</h4>
      <div class="math-block">$$\\hat{P}(B>A) = \\frac{1}{N}\\sum_{i=1}^{N} \\mathbf{1}[\\theta_B^{(i)} > \\theta_A^{(i)}], \\quad \\theta_k^{(i)} \\sim \\text{Beta}(\\alpha_k,\\beta_k)$$</div>

      <h4>Сопряжённые семейства для других метрик</h4>
      <table>
        <tr><th>Метрика</th><th>Likelihood</th><th>Prior</th><th>Posterior</th></tr>
        <tr><td>Конверсия</td><td>Binomial</td><td>Beta(α,β)</td><td>Beta(α+k, β+n−k)</td></tr>
        <tr><td>Счётчики (клики/сессию)</td><td>Poisson(λ)</td><td>Gamma(a,b)</td><td>Gamma(a+k, b+n)</td></tr>
        <tr><td>Непрерывная (выручка)</td><td>Normal(μ,σ²)</td><td>Normal(μ₀,σ₀²)</td><td>Normal (формула)</td></tr>
      </table>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Интерпретируемый результат: P(B &gt; A) понятен всем</li>
            <li>Нет проблемы подглядывания — можно мониторить непрерывно</li>
            <li>Включает prior знания об исторической конверсии</li>
            <li>Expected Loss — решение в бизнес-единицах</li>
            <li>Работает при маленьких выборках (prior стабилизирует)</li>
            <li>Вероятностный вывод вместо бинарного «значимо/нет»</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Выбор prior субъективен и влияет при малых данных</li>
            <li>Нет гарантированного контроля ошибки I рода</li>
            <li>Сложнее реализовать для непрерывных метрик</li>
            <li>Менее знаком регуляторам и академическому сообществу</li>
            <li>Вычислительно дороже (Монте-Карло)</li>
          </ul>
        </div>
      </div>
      <div class="callout">💡 <b>Совет:</b> в большинстве продуктовых A/B тестов байесовский подход практичнее. Для клинических испытаний и регуляторных задач — частотный (строгий контроль α).</div>
    `,
  },
});
