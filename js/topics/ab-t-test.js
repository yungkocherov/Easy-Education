/* ==========================================================================
   A/B тестирование — t-тест для средних
   ========================================================================== */
App.registerTopic({
  id: 'ab-t-test',
  category: 'ab',
  title: 't-тест для средних',
  summary: 'Сравнение средних значений (revenue, time on page) двух групп.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Ты владеешь двумя кофейнями и хочешь понять, в какой средний чек выше. Измеряешь 30 случайных заказов в каждой. В кофейне A: 290, 315, 280, ... — среднее 302 руб. В кофейне B: 320, 295, 340, ... — среднее 315 руб. Разница 13 руб. Но разброс в заказах большой — 50–100 руб. Случайная ли разница?</p>
        <p>t-тест отвечает именно на этот вопрос: «Разница средних реальна, или она могла возникнуть случайно из-за случайного разброса данных?» Он нормирует разность средних на стандартную ошибку — и переводит вопрос в единицы «насколько стандартных ошибок».</p>
      </div>

      <h3>🎯 Когда применяем t-тест</h3>
      <p>Двухвыборочный t-тест для средних применяется, когда:</p>
      <ul>
        <li>Метрика <b>непрерывная</b> или дискретная с большим диапазоном: выручка, время на странице, число страниц за сессию, LTV.</li>
        <li>Две группы <b>независимы</b> (разные пользователи, рандомизированные).</li>
        <li>Данные примерно нормальны, <b>или</b> n достаточно большое (≥30 в каждой группе — ЦПТ спасает).</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Зачем t, а не z?</div>
        <p>z-тест предполагает, что дисперсия генеральной совокупности <b>известна</b>. На практике мы её оцениваем по выборке. Это создаёт дополнительную неопределённость — особенно при малом n. t-распределение Стьюдента «шире» нормального и учитывает эту неопределённость. При n → ∞ t → z. При n ≥ 30 разница незначительна.</p>
      </div>

      <h3>📐 Два варианта двухвыборочного t-теста</h3>

      <h4>Student's t-test (равные дисперсии)</h4>
      <p>Предполагает $\\sigma_A^2 = \\sigma_B^2$. Использует <b>объединённую</b> (pooled) оценку дисперсии:</p>
      <div class="math-block">$$s_p^2 = \\frac{(n_A - 1)s_A^2 + (n_B - 1)s_B^2}{n_A + n_B - 2}$$</div>
      <div class="math-block">$$t = \\frac{\\bar{x}_A - \\bar{x}_B}{s_p \\sqrt{\\dfrac{1}{n_A} + \\dfrac{1}{n_B}}}, \\quad df = n_A + n_B - 2$$</div>

      <h4>Welch's t-test (неравные дисперсии)</h4>
      <p>Не предполагает равенства дисперсий. Более надёжный в общем случае:</p>
      <div class="math-block">$$t = \\frac{\\bar{x}_A - \\bar{x}_B}{\\sqrt{\\dfrac{s_A^2}{n_A} + \\dfrac{s_B^2}{n_B}}}$$</div>
      <div class="math-block">$$df = \\frac{\\left(\\dfrac{s_A^2}{n_A} + \\dfrac{s_B^2}{n_B}\\right)^2}{\\dfrac{(s_A^2/n_A)^2}{n_A-1} + \\dfrac{(s_B^2/n_B)^2}{n_B-1}}$$</div>
      <p>Формула df по Уэлчу-Саттертуэйту — дробное значение, обычно округляют вниз.</p>

      <div class="key-concept">
        <div class="kc-label">Практическое правило: всегда используй Welch</div>
        <p>Тест Стьюдента требует проверки гомогенности дисперсий (тест Левена, F-тест). Если дисперсии реально неравны и ты использовал Student — ошибка I рода инфлируется. Welch работает корректно как при равных, так и при неравных дисперсиях — с очень небольшой потерей мощности в первом случае. Большинство статпакетов (R, Python) по умолчанию используют Welch.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 580 210" xmlns="http://www.w3.org/2000/svg" style="max-width:580px;">
          <defs>
            <linearGradient id="tDistA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/>
            </linearGradient>
            <linearGradient id="tDistB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          <text x="290" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Сравнение средних двух групп</text>
          <!-- Axis -->
          <line x1="30" y1="168" x2="550" y2="168" stroke="#94a3b8" stroke-width="1.5"/>
          <!-- Group A: mean=280, sd=40 → bell at x=180 -->
          <!-- Group B: mean=315, sd=55 → bell at x=295 -->
          <!-- Scale: x = 30 + (val-180)*2.5; val from 180 to 380 = 200 points = 500px/200=2.5px -->
          <!-- A bell center at 280 → x=30+(280-180)*2.5=280 -->
          <!-- B bell center at 315 → x=30+(315-180)*2.5=368 -->
          <!-- A with σ=40→ half-width ~3σ=120px -->
          <path d="M100,168 C120,168 145,163 165,152 C180,142 192,127 200,110 C210,89 218,68 228,52 C235,40 240,33 245,28 C250,24 255,21 260,19 C265,17 268,16 272,16 C276,16 279,17 282,20 C287,24 291,30 296,38 C303,50 309,65 315,85 C320,100 325,117 330,133 C336,148 343,160 355,166 C370,169 400,168 430,168" fill="url(#tDistA)" stroke="#3b82f6" stroke-width="2"/>
          <!-- B bell center at x=368, σ=55→half-width ~160px -->
          <path d="M160,168 C185,168 205,165 225,156 C240,148 252,136 262,121 C270,108 275,94 280,80 C285,66 290,54 295,44 C300,35 305,28 310,24 C315,21 318,20 322,20 C326,20 330,21 335,25 C340,30 344,38 348,49 C354,63 358,78 362,94 C368,113 374,132 382,147 C390,158 402,165 420,168 C445,169 480,168 520,168" fill="url(#tDistB)" stroke="#10b981" stroke-width="2"/>
          <!-- mean lines -->
          <line x1="272" y1="16" x2="272" y2="173" stroke="#2563eb" stroke-width="2" stroke-dasharray="5,3"/>
          <text x="272" y="185" text-anchor="middle" font-size="11" font-weight="600" fill="#2563eb">x̄_A=280</text>
          <line x1="322" y1="20" x2="322" y2="173" stroke="#059669" stroke-width="2" stroke-dasharray="5,3"/>
          <text x="322" y="185" text-anchor="middle" font-size="11" font-weight="600" fill="#059669">x̄_B=315</text>
          <!-- difference arrow -->
          <line x1="272" y1="100" x2="322" y2="100" stroke="#64748b" stroke-width="1.5"/>
          <text x="297" y="94" text-anchor="middle" font-size="10" fill="#64748b">Δ=35</text>
          <!-- legend -->
          <rect x="40" y="30" width="12" height="12" fill="#3b82f6" opacity="0.6" rx="2"/>
          <text x="57" y="41" font-size="10" fill="#2563eb">Группа A: μ=280, σ=40</text>
          <rect x="40" y="50" width="12" height="12" fill="#10b981" opacity="0.6" rx="2"/>
          <text x="57" y="61" font-size="10" fill="#059669">Группа B: μ=315, σ=55</text>
          <!-- SE annotation -->
          <text x="430" y="80" font-size="10" fill="#475569">Разность значима</text>
          <text x="430" y="94" font-size="10" fill="#475569">если Δ >> SE</text>
          <text x="430" y="108" font-size="10" font-weight="600" fill="#7c3aed">t = Δ / SE</text>
        </svg>
        <div class="caption">Две группы с разными средними и разными дисперсиями. Чем меньше перекрытие кривых, тем сильнее сигнал. t-статистика нормирует Δ на SE — учитывает разброс и размер выборки.</div>
      </div>

      <h3>📊 Предположения t-теста</h3>
      <ol>
        <li><b>Независимость наблюдений</b> — каждый пользователь вносит один вклад, нет корреляции между группами.</li>
        <li><b>Нормальность</b> — при n ≥ 30 ЦПТ обеспечивает нормальность средних, даже если исходные данные не нормальны.</li>
        <li><b>Отсутствие грубых выбросов</b> — один выброс может сильно сместить среднее. При сильно скошенных данных рассмотри log-transform.</li>
      </ol>

      <h3>🔄 Когда использовать log-transform</h3>
      <p>Выручка, время на сайте, LTV — часто распределены <b>правосторонне</b> (log-normal). Маленький процент пользователей даёт огромные значения. Это нарушает предположение «нет грубых выбросов».</p>
      <p>Решение: применить $\\log(x+1)$ преобразование. Тогда:</p>
      <ul>
        <li>Распределение станет ближе к нормальному.</li>
        <li>t-тест на логарифмах корректен.</li>
        <li>Интерпретация: тест на разность логарифмов = тест на разность <b>геометрических средних</b> (мультипликативный эффект).</li>
      </ul>
      <div class="callout tip">💡 Если медиана значительно меньше среднего — данные скошены, рассмотри log-transform или непараметрический Манн-Уитни.</div>

      <h3>📏 Размер эффекта: Cohen's d</h3>
      <p><span class="term" data-tip="Cohen's d — стандартизованный размер эффекта. Показывает, на сколько стандартных отклонений отличаются средние. Не зависит от единиц измерения и размера выборки.">Cohen's d</span> — стандартизованная мера того, насколько велика реальная разница:</p>
      <div class="math-block">$$d = \\frac{|\\bar{x}_A - \\bar{x}_B|}{s_p}$$</div>
      <p>Интерпретация по Коэну:</p>
      <table>
        <tr><th>d</th><th>Интерпретация</th><th>Пример</th></tr>
        <tr><td>0.2</td><td>Маленький эффект</td><td>Рост IQ на 3 балла</td></tr>
        <tr><td>0.5</td><td>Средний эффект</td><td>Рост IQ на 7 баллов</td></tr>
        <tr><td>0.8</td><td>Большой эффект</td><td>Рост IQ на 12 баллов</td></tr>
      </table>
      <p>d не зависит от n: при n=10 000 d=0.1 дасть p &lt; 0.001, но эффект крошечный. При n=10 d=0.8 даст p=0.1, но эффект большой. Оба факта важны.</p>

      <h3>🔗 Парный t-тест (paired)</h3>
      <p>Если каждому наблюдению группы A соответствует конкретное наблюдение группы B (один и тот же пользователь до и после, одна и та же страница с разными вариантами), используй <b>парный t-тест</b>.</p>
      <p>Вычислив разности $d_i = x_{B,i} - x_{A,i}$, применяем одновыборочный t-тест к $\\{d_i\\}$:</p>
      <div class="math-block">$$t = \\frac{\\bar{d}}{s_d / \\sqrt{n}}, \\quad df = n - 1$$</div>
      <p>Парный тест мощнее непарного, потому что устраняет «шум» от различий между пользователями.</p>

      <div class="deep-dive">
        <summary>Подробнее: CUPED — снижение дисперсии через ковариату</summary>
        <div class="deep-dive-body">
          <p><b>CUPED (Controlled-experiment Using Pre-Experiment Data)</b> — метод, разработанный в Microsoft, повышающий мощность A/B теста без увеличения выборки.</p>
          <p>Идея: используем предэксперимен­тальные данные (значение метрики пользователя до теста) как ковариату, чтобы скорректировать наблюдаемые значения:</p>
          <div class="math-block">$$Y_i^{cuped} = Y_i - \\theta \\cdot (X_i - \\bar{X})$$</div>
          <p>где $X_i$ — предэксперименталь­ное значение, $\\theta = \\text{Cov}(Y,X)/\\text{Var}(X)$.</p>
          <p>Эффект: дисперсия $Y^{cuped}$ меньше, чем $Y$ (если $r(Y,X) > 0$), значит SE меньше, t больше, тест мощнее. CUPED используется в Airbnb, Netflix, Yandex.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: bootstrap t-тест для тяжёлых хвостов</summary>
        <div class="deep-dive-body">
          <p>При сильно скошенных данных (LTV, выручка) даже логарифмирование может не дать нормальности. Bootstrap (перестановочный тест) не требует никаких предположений о распределении:</p>
          <ol>
            <li>Объединяем оба варианта и случайно разбиваем на две группы. Считаем разность средних → это нулевое распределение.</li>
            <li>Повторяем 10 000 раз.</li>
            <li>p-value = доля перестановок, где |Δ| ≥ |Δ_наблюдаемое|.</li>
          </ol>
          <p>Это самый робастный подход для нестандартных распределений. Широко применяется в продуктовой аналитике.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>z-тест</b> — частный случай при известной σ или больших n.</li>
        <li><b>Хи-квадрат</b> — аналог для категориальных метрик.</li>
        <li><b>ANOVA</b> — обобщение t-теста на 3+ группы.</li>
        <li><b>ЦПТ и нормальное распределение</b> — теоретическое обоснование.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Средний чек: A vs B',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Тестируем рекомендательный блок «Вам также может понравиться». Мерим средний чек. Группа A (без блока): 8 пользователей. Группа B (с блоком): 8 пользователей. Значимо ли различие при α = 0.05?</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Пользователь</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
              <tr><td><b>A (чек, руб)</b></td><td>850</td><td>1 200</td><td>600</td><td>980</td><td>1 400</td><td>750</td><td>1 100</td><td>920</td></tr>
              <tr><td><b>B (чек, руб)</b></td><td>1 100</td><td>1 350</td><td>900</td><td>1 200</td><td>1 600</td><td>1 050</td><td>1 300</td><td>1 100</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Формулируем гипотезы</h4>
            <div class="calc">H₀: μ_A = μ_B  (средние чеки одинаковы)
H₁: μ_A ≠ μ_B  (двусторонний)
α = 0.05</div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем средние</h4>
            <div class="calc">Сумма A = 850+1200+600+980+1400+750+1100+920 = 7800
x̄_A = 7800 / 8 = <b>975 руб</b>

Сумма B = 1100+1350+900+1200+1600+1050+1300+1100 = 9600
x̄_B = 9600 / 8 = <b>1200 руб</b>

Разность: x̄_B − x̄_A = <b>225 руб</b></div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем выборочные дисперсии</h4>
            <div class="calc">Отклонения от x̄_A = 975:
  −125, +225, −375, +5, +425, −225, +125, −55
Квадраты: 15625, 50625, 140625, 25, 180625, 50625, 15625, 3025
Сумма квадратов = 456800
s²_A = 456800 / (8−1) = 65257  →  s_A = <b>255.5</b>

Отклонения от x̄_B = 1200:
  −100, +150, −300, 0, +400, −150, +100, −100
Квадраты: 10000, 22500, 90000, 0, 160000, 22500, 10000, 10000
Сумма квадратов = 325000
s²_B = 325000 / 7 = 46428  →  s_B = <b>215.5</b></div>
          </div>

          <div class="step" data-step="4">
            <h4>Welch t-тест (дисперсии разные)</h4>
            <div class="calc">SE = √(s²_A/n_A + s²_B/n_B)
   = √(65257/8 + 46428/8)
   = √(8157.1 + 5803.5)
   = √(13960.6)
   = <b>118.2</b>

t = (x̄_B − x̄_A) / SE
  = 225 / 118.2
  = <b>1.903</b></div>
          </div>

          <div class="step" data-step="5">
            <h4>Степени свободы (Welch-Satterthwaite)</h4>
            <div class="calc">df = (s²_A/n_A + s²_B/n_B)² / [ (s²_A/n_A)²/(n_A−1) + (s²_B/n_B)²/(n_B−1) ]

Числитель = (8157.1 + 5803.5)² = (13960.6)² = 194 897 146
Знаменатель = (8157.1)²/7 + (5803.5)²/7
            = 66537 279/7 + 33680 612/7
            = 9505 325 + 4811 516
            = 14 316 841

df = 194 897 146 / 14 316 841 = <b>13.6</b> → округляем до 13</div>
          </div>

          <div class="step" data-step="6">
            <h4>Определяем значимость</h4>
            <div class="calc">t = 1.903, df = 13
Критическое t при α=0.05, df=13, двусторонний: t_крит = 2.160

|t| = 1.903 < 2.160 → <b>не отвергаем H₀</b>

p-value ≈ 0.079 > 0.05</div>
            <div class="why">При n=8 в группе и разбросе ~250 руб разность 225 руб — статистически незначима. Тест маломощный: слишком мало данных.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Cohen's d — размер эффекта</h4>
            <div class="calc">s_p = √( ((n_A−1)s²_A + (n_B−1)s²_B) / (n_A+n_B−2) )
   = √( (7×65257 + 7×46428) / 14 )
   = √( (456799 + 324996) / 14 )
   = √( 781795 / 14 )
   = √(55842.5)
   = 236.3

d = |x̄_B − x̄_A| / s_p = 225 / 236.3 = <b>0.95</b></div>
            <p>d = 0.95 — это <b>большой эффект</b> по шкале Коэна (> 0.8). При большей выборке это был бы значимый результат.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>t = <b>1.903</b>, df = 13, p ≈ <b>0.079</b>. Разность средних 225 руб (23% от базы) <b>не значима</b> при n=8, однако Cohen's d = <b>0.95</b> — большой эффект. Нужно ~18–20 пользователей в группе для значимости при этом d.</p>
          </div>

          <div class="lesson-box">Маленькая выборка = мало мощности. Большой эффект (d=0.95) есть, но данных не хватает, чтобы отличить его от шума. Увеличь n до 18–20 в группе, и тест даст p &lt; 0.05.</div>
        `
      },
      {
        title: 'Welch vs Student — неравные дисперсии',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Тестируем два UI: A — текущий, B — новый. Метрика: время на странице (секунды). n_A = n_B = 30. У группы A дисперсия низкая, у B — высокая. Покажем, что Student ошибается, а Welch корректен.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Данные (агрегированные)</h4>
            <div class="calc">Группа A: x̄_A = 45.0 сек, s_A = 8.0 сек,  n_A = 30
Группа B: x̄_B = 51.5 сек, s_B = 24.0 сек, n_B = 30
Разность: 6.5 сек

Проверим гомогенность дисперсий (F-тест Левена):
F = s²_B / s²_A = 576 / 64 = 9.0
F_крит(29, 29, 0.05) ≈ 1.86
F = 9.0 >> 1.86 → дисперсии ЗНАЧИМО НЕРАВНЫ ✗
→ Студентовский тест НЕ применим</div>
            <div class="why">Отношение дисперсий 9:1 — очень сильная негомогенность. Студентовский тест в таком случае даёт инфлированную ошибку I рода. Нужен Welch.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Student's t-тест (НЕКОРРЕКТНО, для сравнения)</h4>
            <div class="calc">s²_p = ((30−1)×64 + (30−1)×576) / (30+30−2)
     = (1856 + 16704) / 58
     = 18560 / 58 = 320.0
s_p = 17.89

t_S = (51.5 − 45.0) / (17.89 × √(1/30+1/30))
    = 6.5 / (17.89 × 0.2582)
    = 6.5 / 4.619
    = <b>1.408</b>

df = 58
t_крит(58, 0.025) = 2.001
p-value ≈ 0.164 → не значимо</div>
          </div>

          <div class="step" data-step="3">
            <h4>Welch's t-тест (КОРРЕКТНО)</h4>
            <div class="calc">SE = √(s²_A/n_A + s²_B/n_B)
   = √(64/30 + 576/30)
   = √(2.133 + 19.2)
   = √(21.333)
   = <b>4.619</b>

t_W = 6.5 / 4.619 = <b>1.408</b>
(z-числитель одинаков! разница в df)</div>
            <div class="why">Интересно: z-числители одинаковы, но df у Welch другой — и это меняет критическое значение.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Степени свободы Welch</h4>
            <div class="calc">df_W = (2.133 + 19.2)² / [ (2.133)²/29 + (19.2)²/29 ]
     = (21.333)² / [ 4.55/29 + 368.64/29 ]
     = 455.3 / [ 0.1569 + 12.712 ]
     = 455.3 / 12.869
     = <b>35.4</b> → округляем до 35

t_крит(35, 0.025) = 2.030

|t| = 1.408 < 2.030 → не значимо при Welch тоже

Но разница была бы существенна, если t = 2.05:
  Student: df=58, t_крит=2.001 → значимо ✓ (ошибочно)
  Welch:   df=35, t_крит=2.030 → не значимо ✗ (корректно)</div>
          </div>

          <div class="step" data-step="5">
            <h4>Когда разница критична</h4>
            <div class="calc">При неравных дисперсиях Student тест:
  - Инфлирует ошибку I рода при n_A = n_B
  - Особенно опасен при n_A ≠ n_B

Пример (крайний случай):
  n_A=10 (маленькая σ), n_B=100 (большая σ)
  Student ошибка I рода = до 2× от α
  Welch ошибка I рода ≈ α ✓</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Вывод</div>
            <p>При s_A=8 и s_B=24 дисперсии значимо неравны. Обе версии дали t = <b>1.408</b>, но Welch имеет df = 35 вместо 58 — более консервативный. Использование Student при резко неравных дисперсиях может давать ложные срабатывания. Всегда используй <b>Welch</b>.</p>
          </div>

          <div class="lesson-box">Welch и Student дают одинаковый числитель (одно SE). Разница — только в df: Welch «штрафует» за неравенство дисперсий, давая меньшие df и большее критическое t. Это защита от ложных срабатываний.</div>
        `
      },
      {
        title: "Cohen's d — размер эффекта",
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Три разных A/B теста дали одинаково значимый p = 0.03. Но насколько практически важны эти результаты? Считаем Cohen's d для каждого и интерпретируем.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Тест 1: Большая выборка, маленький эффект</h4>
            <div class="calc">n_A = n_B = 10 000
x̄_A = 100.00 руб/день, x̄_B = 100.40 руб/день
s_p = 20.0 руб

d = |100.40 − 100.00| / 20.0 = 0.40 / 20.0 = <b>0.02</b>  (микроскопический!)

SE = 20 × √(1/10000 + 1/10000) = 20 × 0.01414 = 0.283
t = 0.40 / 0.283 = 1.41 → Подождём...

Пересчёт с n=5000: SE=0.4, t=1 → нет
Пересчёт: нужно n=(1.96+0.84)²×(2×400)/0.16 = 7.84×5000 = 39200 → но у нас 10000...
Реальный пример: n=10000, d=0.02 → t = d×√n/2 = 0.02×√5000 = 0.02×70.7 = 1.41 → p≈0.16
Скорректируем: d=0.04 → t=2.83 → p=0.005 ✓

x̄_B = 100.80 руб, d = 0.80/20 = <b>0.04</b>
t = 0.04 × √5000 = 2.83, p ≈ 0.005 ✓

Эффект: +0.8 руб/день на пользователя при базе 100 руб → 0.8%</div>
            <div class="why">d=0.04 — ничтожный эффект. Несмотря на значимость, 0.8% прирост дохода может не окупить стоимость поддержки изменения.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Тест 2: Средняя выборка, средний эффект</h4>
            <div class="calc">n_A = n_B = 200
x̄_A = 4.5 мин (время на сайте), x̄_B = 5.5 мин
s_p = 2.0 мин

d = |5.5 − 4.5| / 2.0 = 1.0 / 2.0 = <b>0.50</b>  (средний)

SE = 2.0 × √(1/200 + 1/200) = 2.0 × 0.1 = 0.2
t = 1.0 / 0.2 = 5.0, df ≈ 398
p ≪ 0.001 ✓

Интерпретация: на 1 стандартное отклонение / 2 больше.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Тест 3: Маленькая выборка, большой эффект</h4>
            <div class="calc">n_A = n_B = 25
x̄_A = 50 сек (загрузка страницы), x̄_B = 35 сек
s_p = 18.75 сек

d = |50 − 35| / 18.75 = 15 / 18.75 = <b>0.80</b>  (большой)

SE = 18.75 × √(1/25 + 1/25) = 18.75 × 0.283 = 5.31
t = 15 / 5.31 = 2.82, df = 48
t_крит(48, 0.025) = 2.011
p ≈ 0.007 ✓</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сравнение трёх тестов</h4>
            <div class="calc">                Тест 1      Тест 2      Тест 3
n в группе:    10 000      200         25
Эффект (Δ):   +0.8 руб    +1 мин      −15 сек
s_p:          20 руб      2 мин       18.75 сек
Cohen's d:    0.04        0.50        0.80
p-value:      0.005       &lt;&lt;0.001     0.007
Практически:  МАЛЫЙ ✗    СРЕДНИЙ ?   БОЛЬШОЙ ✓</div>
          </div>

          <div class="step" data-step="5">
            <h4>Правило расчёта n по d</h4>
            <div class="calc">Нужный n для мощности 80% при α=0.05:
  d=0.2 (маленький):  n = 394 в группе
  d=0.5 (средний):    n = 64  в группе
  d=0.8 (большой):    n = 26  в группе

Формула: n ≈ (z_{0.025} + z_{0.20})² × 2 / d²
           = 7.84 × 2 / d²
           = 15.68 / d²</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Все три теста значимы (p &lt; 0.05), но практическое значение разное. Тест 1 (d=<b>0.04</b>) — ничтожный, Тест 2 (d=<b>0.50</b>) — средний, Тест 3 (d=<b>0.80</b>) — большой, реально важный. Всегда дополняй p-value размером эффекта.</p>
          </div>

          <div class="lesson-box">p-value зависит от n. Cohen's d не зависит. При огромных n даже d=0.01 даст p&lt;0.001 — но стоит ли менять продукт ради 1% изменения? Это бизнес-вопрос, не статистический.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Сравнение средних двух групп</h3>
        <p>Генерируем две группы с разными средними и смотрим, найдёт ли t-тест разницу.</p>
        <div class="sim-container">
          <div class="sim-controls" id="abt-controls"></div>
          <div class="sim-buttons"><button class="btn" id="abt-run">🔄 Новый тест</button></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="abt-chart"></canvas></div>
            <div class="sim-stats" id="abt-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#abt-controls');
        const cN = App.makeControl('range', 'abt-n', 'n на группу', { min: 10, max: 500, step: 10, value: 50 });
        const cMA = App.makeControl('range', 'abt-ma', 'μ(A)', { min: 10, max: 100, step: 1, value: 50 });
        const cMB = App.makeControl('range', 'abt-mb', 'μ(B)', { min: 10, max: 100, step: 1, value: 55 });
        const cS = App.makeControl('range', 'abt-s', 'σ', { min: 1, max: 30, step: 1, value: 15 });
        [cN, cMA, cMB, cS].forEach(c => controls.appendChild(c.wrap));
        let chart = null;
        function run() {
          const n = +cN.input.value, muA = +cMA.input.value, muB = +cMB.input.value, sigma = +cS.input.value;
          const A = App.Util.normalSample(n, muA, sigma);
          const B = App.Util.normalSample(n, muB, sigma);
          const mA = App.Util.mean(A), mB = App.Util.mean(B);
          const vA = App.Util.variance(A), vB = App.Util.variance(B);
          const se = Math.sqrt(vA / n + vB / n);
          const t = se > 0 ? (mB - mA) / se : 0;
          const df = n + n - 2;
          const pVal = 2 * (1 - App.Util.normalCDF(Math.abs(t)));
          const d = (mB - mA) / Math.sqrt((vA + vB) / 2);
          const sig = pVal < 0.05;
          const hA = App.Util.histogram(A, 20, [0, 120]);
          const hB = App.Util.histogram(B, 20, [0, 120]);
          const ctx = container.querySelector('#abt-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar', data: { labels: hA.centers.map(c => c.toFixed(0)),
              datasets: [{ label: 'A', data: hA.counts, backgroundColor: 'rgba(59,130,246,0.4)' }, { label: 'B', data: hB.counts, backgroundColor: 'rgba(16,185,129,0.4)' }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: sig ? '✅ Разница значима' : '❌ Не значима' } }, scales: { y: { beginAtZero: true } } },
          });
          App.registerChart(chart);
          container.querySelector('#abt-stats').innerHTML = '<div class="stat-card"><div class="stat-label">x̄(A)</div><div class="stat-value">' + mA.toFixed(1) + '</div></div><div class="stat-card"><div class="stat-label">x̄(B)</div><div class="stat-value">' + mB.toFixed(1) + '</div></div><div class="stat-card"><div class="stat-label">t</div><div class="stat-value">' + t.toFixed(3) + '</div></div><div class="stat-card"><div class="stat-label">p-value</div><div class="stat-value">' + pVal.toFixed(4) + '</div></div><div class="stat-card"><div class="stat-label">Cohen d</div><div class="stat-value">' + d.toFixed(2) + '</div></div>';
        }
        [cN, cMA, cMB, cS].forEach(c => c.input.addEventListener('input', run));
        container.querySelector('#abt-run').onclick = run;
        run();
      },
    },

    python: `
      <h3>📊 t-тест для A/B теста средних</h3>
      <pre><code>from scipy import stats
import numpy as np

np.random.seed(42)

# Данные: средний чек (выручка на пользователя)
group_A = np.random.normal(loc=1200, scale=400, size=500)
group_B = np.random.normal(loc=1280, scale=420, size=500)

# Двухвыборочный t-тест (тест Уэлча — не требует равных дисперсий)
t_stat, p_value = stats.ttest_ind(group_A, group_B, equal_var=False)

print(f"Среднее A: {group_A.mean():.1f} руб.")
print(f"Среднее B: {group_B.mean():.1f} руб.")
print(f"Разница:   {group_B.mean() - group_A.mean():.1f} руб.")
print(f"\\nt-stat = {t_stat:.4f}")
print(f"p-value = {p_value:.4f}")
print(f"\\n{'Значимо!' if p_value < 0.05 else 'Не значимо'} (α=0.05)")</code></pre>

      <h3>📋 Cohen's d — размер эффекта</h3>
      <pre><code>import numpy as np

def cohens_d(group1, group2):
    """Вычисляет Cohen's d для двух групп"""
    n1, n2 = len(group1), len(group2)
    var1, var2 = group1.var(ddof=1), group2.var(ddof=1)
    # Pooled standard deviation
    pooled_std = np.sqrt(((n1-1)*var1 + (n2-1)*var2) / (n1+n2-2))
    return (group2.mean() - group1.mean()) / pooled_std

d = cohens_d(group_A, group_B)
print(f"Cohen's d = {d:.3f}")

# Интерпретация
if abs(d) < 0.2:
    print("Эффект: незначительный")
elif abs(d) < 0.5:
    print("Эффект: малый")
elif abs(d) < 0.8:
    print("Эффект: средний")
else:
    print("Эффект: большой")</code></pre>

      <h3>📈 Визуализация распределений групп</h3>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(10, 5))

ax.hist(group_A, bins=30, alpha=0.5, label=f'A (μ={group_A.mean():.0f})', color='blue')
ax.hist(group_B, bins=30, alpha=0.5, label=f'B (μ={group_B.mean():.0f})', color='green')
ax.axvline(group_A.mean(), color='blue', linestyle='--', lw=2)
ax.axvline(group_B.mean(), color='green', linestyle='--', lw=2)
ax.set_xlabel("Средний чек (руб.)")
ax.set_ylabel("Количество пользователей")
ax.set_title("A/B тест: распределение среднего чека")
ax.legend()
plt.show()</code></pre>
    `,

    math: `
      <h3>t-тест для средних — полная математика</h3>

      <h4>Welch's t-тест (рекомендованный)</h4>
      <div class="math-block">$$t = \\frac{\\bar{x}_A - \\bar{x}_B}{\\sqrt{\\dfrac{s_A^2}{n_A} + \\dfrac{s_B^2}{n_B}}}$$</div>

      <h4>Степени свободы Welch-Satterthwaite</h4>
      <div class="math-block">$$df = \\frac{\\left(\\dfrac{s_A^2}{n_A} + \\dfrac{s_B^2}{n_B}\\right)^2}{\\dfrac{(s_A^2/n_A)^2}{n_A-1} + \\dfrac{(s_B^2/n_B)^2}{n_B-1}}$$</div>

      <h4>Student's t-тест (равные дисперсии)</h4>
      <div class="math-block">$$s_p^2 = \\frac{(n_A-1)s_A^2 + (n_B-1)s_B^2}{n_A+n_B-2}, \\quad t = \\frac{\\bar{x}_A - \\bar{x}_B}{s_p\\sqrt{\\frac{1}{n_A}+\\frac{1}{n_B}}}$$</div>

      <h4>Парный t-тест</h4>
      <div class="math-block">$$d_i = x_{B,i} - x_{A,i}, \\quad t = \\frac{\\bar{d}}{s_d/\\sqrt{n}}, \\quad df = n-1$$</div>

      <h4>Cohen's d</h4>
      <div class="math-block">$$d = \\frac{|\\bar{x}_A - \\bar{x}_B|}{s_p}, \\quad \\text{где } s_p = \\sqrt{\\frac{(n_A-1)s_A^2+(n_B-1)s_B^2}{n_A+n_B-2}}$$</div>

      <h4>95% CI для разности средних</h4>
      <div class="math-block">$$(\\bar{x}_B - \\bar{x}_A) \\pm t_{\\alpha/2,df} \\cdot \\sqrt{\\frac{s_A^2}{n_A} + \\frac{s_B^2}{n_B}}$$</div>

      <h4>Нужный размер выборки (по Cohen's d)</h4>
      <div class="math-block">$$n \\approx \\frac{2(z_{\\alpha/2}+z_\\beta)^2}{d^2} = \\frac{2 \\times 7.84}{d^2} \\approx \\frac{15.7}{d^2}$$</div>
      <p>При $\\alpha=0.05$, мощность 80%: d=0.2→n=394, d=0.5→n=63, d=0.8→n=25.</p>

      <h4>t-критические значения (двусторонний, α=0.05)</h4>
      <table>
        <tr><th>df</th><th>t_крит</th><th>df</th><th>t_крит</th></tr>
        <tr><td>5</td><td>2.571</td><td>30</td><td>2.042</td></tr>
        <tr><td>10</td><td>2.228</td><td>60</td><td>2.000</td></tr>
        <tr><td>20</td><td>2.086</td><td>∞</td><td>1.960</td></tr>
      </table>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы t-теста для средних</h4>
          <ul>
            <li>Работает при малых выборках (n &lt; 30) — в отличие от z-теста</li>
            <li>Робустен к умеренным отклонениям от нормальности (особенно Welch при n≥30)</li>
            <li>Даёт CI для разности средних — понятен бизнесу</li>
            <li>Cohen's d не зависит от n — честная мера эффекта</li>
            <li>Welch корректен при неравных дисперсиях</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы и ограничения</h4>
          <ul>
            <li>Чувствителен к выбросам — один большой чек искажает среднее</li>
            <li>Не работает для бинарных метрик — используй z-тест</li>
            <li>При сильном правостороннем скосе (LTV, доходы) — рассмотри log-transform или bootstrap</li>
            <li>Среднее — не всегда правильная метрика (медиана для выручки может быть лучше)</li>
            <li>При очень разных n в группах Student ненадёжен, Welch более устойчив</li>
          </ul>
        </div>
      </div>
      <div class="callout tip">💡 Правило: если медиана и среднее сильно расходятся — данные скошены. Используй Welch + log-transform, либо bootstrap, либо Манн-Уитни (непараметрический).</div>
      <div class="callout warn">⚠️ Никогда не используй Student при явно неравных дисперсиях (отношение s²_B/s²_A > 3). Используй Welch — он работает корректно в обоих случаях.</div>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=NF5_btOaCig" target="_blank">StatQuest: t-tests, clearly explained</a> — t-тест для двух выборок: интуиция и расчёт</li>
        <li><a href="https://www.youtube.com/watch?v=AGh66ZPpOSQ" target="_blank">StatQuest: Welch's t-test</a> — t-тест Уэлча при неравных дисперсиях</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/significance-tests-two-sample/two-sample-t-test-for-difference-of-means/v/two-sample-t-test-and-robustness" target="_blank">Khan Academy: Two-sample t-test</a> — двухвыборочный t-тест с примерами</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=t-%D1%82%D0%B5%D1%81%D1%82%20%D1%81%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D1%85" target="_blank">Habr: t-тест средних</a> — применение t-теста для сравнения средних значений</li>
        <li><a href="https://en.wikipedia.org/wiki/Welch%27s_t-test" target="_blank">Wikipedia: Welch's t-test</a> — описание t-теста Уэлча и его преимущества</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_ind.html" target="_blank">SciPy: scipy.stats.ttest_ind</a> — двухвыборочный t-тест (Student и Welch) с параметром equal_var</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.ttest_1samp.html" target="_blank">SciPy: scipy.stats.ttest_1samp</a> — одновыборочный t-тест</li>
      </ul>
    `,
  },
});
