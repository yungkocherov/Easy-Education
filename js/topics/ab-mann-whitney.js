/* ==========================================================================
   Тест Манна-Уитни
   ========================================================================== */
App.registerTopic({
  id: 'ab-mann-whitney',
  category: 'ab',
  title: 'Тест Манна-Уитни',
  summary: 'Непараметрическая альтернатива t-тесту — не требует нормальности.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Ключевая идея</div>
        <p>Представь, что ты проводишь турнир между двумя командами. Игроков из обеих команд ставят в один общий рейтинг от самого слабого до самого сильного. Вопрос: <b>игроки какой команды чаще занимают высокие места?</b></p>
        <p>Это и есть логика теста Манна-Уитни. Вместо сравнения средних значений (как в t-тесте) мы <b>смотрим на <a class="glossary-link" onclick="App.selectTopic('glossary-nonparametric-tests')">ранги</a></b>: как часто наблюдение из группы A оказывается выше наблюдения из группы B? Если группы одинаковы, каждая должна занимать примерно половину высоких мест.</p>
        <p>Такой подход не требует нормального распределения, устойчив к выбросам и работает с порядковыми данными — там, где t-тест просто неприменим.</p>
      </div>

      <h3>🎯 Когда использовать тест Манна-Уитни</h3>
      <p>Тест Манна-Уитни — правильный выбор в нескольких ситуациях:</p>
      <ul>
        <li><b>Скошенные распределения</b> — время на странице, выручка на пользователя, время ответа сервера. Эти метрики имеют длинный правый хвост, и среднее искажается несколькими большими значениями.</li>
        <li><b>Порядковые (ординальные) данные</b> — оценки 1–5, рейтинги NPS (0–10), уровни сложности. Арифметика над «звёздочками» бессмысленна: разница между 1 и 2 звёздами не равна разнице между 4 и 5.</li>
        <li><b>Выбросы</b> — один «кит» (пользователь с аномально большой суммой заказа) сдвигает среднее, но почти не меняет ранги.</li>
        <li><b>Маленькие выборки</b> — при n &lt; 30 нельзя полагаться на ЦПТ для нормальной аппроксимации, а проверить нормальность на малой выборке практически невозможно.</li>
        <li><b>Явные нарушения нормальности</b> — <a class="glossary-link" onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a> показывает сильные отклонения, тест Шапиро-Уилка значим.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Нулевая гипотеза теста</div>
        <p>Строго говоря, $H_0$ в тесте Манна-Уитни — не «медианы равны», а <b>«вероятность того, что случайный элемент группы A превысит случайный элемент группы B, равна 0.5»</b>. То есть $P(X > Y) = 0.5$. Это тонкое, но важное различие: тест сравнивает не параметр распределения, а упорядочивание.</p>
      </div>

      <h3>📐 Алгоритм: шаг за шагом</h3>
      <ol>
        <li><b>Объединяем</b> все наблюдения обеих групп в один список.</li>
        <li><b>Присваиваем ранги</b> от 1 (наименьшее) до $n_1 + n_2$ (наибольшее). При совпадающих значениях (ties) присваиваем средний ранг: если два числа делят места 5 и 6, оба получают ранг 5.5.</li>
        <li><b>Суммируем ранги</b> по каждой группе: $R_1$ и $R_2$.</li>
        <li><b>Вычисляем статистику U</b> для каждой группы:
          <div class="math-block">$$U_1 = R_1 - \\frac{n_1(n_1+1)}{2}, \\quad U_2 = R_2 - \\frac{n_2(n_2+1)}{2}$$</div>
        </li>
        <li><b>Берём минимум:</b> $U = \\min(U_1, U_2)$. Это тестовая статистика.</li>
        <li><b>Проверяем значимость</b> по таблице критических значений (малые n) или нормальной аппроксимации (большие n).</li>
      </ol>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <defs>
            <marker id="mw_arr" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/>
            </marker>
          </defs>
          <text x="280" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Ранжирование двух групп на числовой прямой</text>
          <!-- Number line -->
          <line x1="30" y1="90" x2="530" y2="90" stroke="#64748b" stroke-width="2" marker-end="url(#mw_arr)"/>
          <text x="30" y="108" text-anchor="middle" font-size="10" fill="#64748b">мин</text>
          <text x="520" y="108" text-anchor="middle" font-size="10" fill="#64748b">макс</text>

          <!-- Group A points (blue circles) -->
          <!-- values roughly at x positions: 60, 110, 190, 270, 350, 430, 480 -->
          <circle cx="60"  cy="90" r="9" fill="#3b82f6" stroke="white" stroke-width="2"/>
          <circle cx="110" cy="90" r="9" fill="#3b82f6" stroke="white" stroke-width="2"/>
          <circle cx="190" cy="90" r="9" fill="#3b82f6" stroke="white" stroke-width="2"/>
          <circle cx="320" cy="90" r="9" fill="#3b82f6" stroke="white" stroke-width="2"/>
          <circle cx="400" cy="90" r="9" fill="#3b82f6" stroke="white" stroke-width="2"/>
          <text x="60"  cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">A</text>
          <text x="110" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">A</text>
          <text x="190" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">A</text>
          <text x="320" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">A</text>
          <text x="400" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">A</text>

          <!-- Group B points (green circles) -->
          <circle cx="150" cy="90" r="9" fill="#10b981" stroke="white" stroke-width="2"/>
          <circle cx="240" cy="90" r="9" fill="#10b981" stroke="white" stroke-width="2"/>
          <circle cx="280" cy="90" r="9" fill="#10b981" stroke="white" stroke-width="2"/>
          <circle cx="450" cy="90" r="9" fill="#10b981" stroke="white" stroke-width="2"/>
          <circle cx="500" cy="90" r="9" fill="#10b981" stroke="white" stroke-width="2"/>
          <text x="150" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">B</text>
          <text x="240" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">B</text>
          <text x="280" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">B</text>
          <text x="450" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">B</text>
          <text x="500" cy="90" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white" y="90">B</text>

          <!-- Rank numbers below -->
          <text x="60"  y="120" text-anchor="middle" font-size="9" fill="#3b82f6">r=1</text>
          <text x="110" y="120" text-anchor="middle" font-size="9" fill="#3b82f6">r=2</text>
          <text x="150" y="120" text-anchor="middle" font-size="9" fill="#10b981">r=3</text>
          <text x="190" y="120" text-anchor="middle" font-size="9" fill="#3b82f6">r=4</text>
          <text x="240" y="120" text-anchor="middle" font-size="9" fill="#10b981">r=5</text>
          <text x="280" y="120" text-anchor="middle" font-size="9" fill="#10b981">r=6</text>
          <text x="320" y="120" text-anchor="middle" font-size="9" fill="#3b82f6">r=7</text>
          <text x="400" y="120" text-anchor="middle" font-size="9" fill="#3b82f6">r=8</text>
          <text x="450" y="120" text-anchor="middle" font-size="9" fill="#10b981">r=9</text>
          <text x="500" y="120" text-anchor="middle" font-size="9" fill="#10b981">r=10</text>

          <!-- Legend -->
          <circle cx="50"  cy="158" r="8" fill="#3b82f6"/>
          <text x="64"  y="162" font-size="11" fill="#1e293b">Группа A  (R₁ = 1+2+4+7+8 = 22)</text>
          <circle cx="260" cy="158" r="8" fill="#10b981"/>
          <text x="274" y="162" font-size="11" fill="#1e293b">Группа B  (R₂ = 3+5+6+9+10 = 33)</text>
          <text x="280" y="186" text-anchor="middle" font-size="11" fill="#64748b">B чаще занимает высокие ранги → U₁ &lt; U₂</text>
        </svg>
        <div class="caption">10 наблюдений объединены и проранжированы. Синие — группа A, зелёные — группа B. R₁=22, R₂=33. Сумма рангов B больше → B «выше» в целом.</div>
      </div>

      <h3>🔗 Связь с критерием Уилкоксона для двух выборок</h3>
      <p>Тест Манна-Уитни и <span class="term" data-tip="Wilcoxon rank-sum test. Идентичен тесту Манна-Уитни по математике. Статистика W = сумма рангов первой группы. W и U связаны линейно: U₁ = W − n₁(n₁+1)/2.">критерий Уилкоксона для ранговых сумм</span> — это один и тот же тест, просто записанный через разные статистики. Статистика W = $R_1$ (сумма рангов первой группы), а $U_1 = W - \\frac{n_1(n_1+1)}{2}$. Все статистические пакеты (scipy, R) могут возвращать любую из них.</p>
      <p>Не путать с <b>парным тестом Уилкоксона</b> — тот применяется для связанных пар (до/после у одних и тех же испытуемых).</p>

      <h3>📊 Нормальная аппроксимация для больших выборок</h3>
      <p>При $n_1, n_2 \\geq 10$ статистика U приближённо нормально распределена:</p>
      <div class="math-block">$$z = \\frac{U - \\mu_U}{\\sigma_U}, \\quad \\mu_U = \\frac{n_1 n_2}{2}, \\quad \\sigma_U = \\sqrt{\\frac{n_1 n_2 (n_1 + n_2 + 1)}{12}}$$</div>
      <p>Поправка на <span class="term" data-tip="Ties. Совпадающие значения. Из-за ties стандартное отклонение σ_U немного уменьшается: под корнем вычитается сумма T_k = (t_k³ − t_k)/12 для каждой группы совпадений размера t_k.">совпадения (ties)</span> при большом числе равных значений:</p>
      <div class="math-block">$$\\sigma_U^{\\text{corr}} = \\sqrt{\\frac{n_1 n_2}{12}\\left(n+1 - \\sum_k \\frac{t_k^3 - t_k}{n(n-1)}\\right)}, \\quad n = n_1 + n_2$$</div>

      <h3>📏 Размер эффекта: ранг-бисериальная корреляция</h3>
      <p>p-value говорит о значимости, но не о величине эффекта. Для Манна-Уитни используют <span class="term" data-tip="Rank-biserial correlation r. Размер эффекта для теста Манна-Уитни. Показывает долю пар (a,b) где a>b минус долю пар где a<b. Диапазон от -1 до 1.">ранг-бисериальную корреляцию</span>:</p>
      <div class="math-block">$$r = 1 - \\frac{2U}{n_1 n_2} = \\frac{U_1 - U_2}{n_1 n_2}$$</div>
      <p>Интерпретация: |r| = 0.1 — малый, 0.3 — средний, 0.5 — большой эффект (по Коэну).</p>
      <p>Эквивалентно: $r$ — это разница между долей пар, где A > B, и долей пар, где A < B.</p>

      <div class="deep-dive">
        <summary>Подробнее: связь U с AUC</summary>
        <div class="deep-dive-body">
          <p>Статистика U имеет красивую интерпретацию: $\\frac{U_1}{n_1 n_2}$ — это оценка $P(X_1 > X_2)$, вероятности того, что случайный элемент из группы A превысит случайный элемент из группы B. Это в точности равно <b>AUC</b> (площадь под ROC-кривой) классификатора, предсказывающего принадлежность к группе A!</p>
          <p>При AUC = 0.5 тест даёт максимальное p-value (группы неразличимы). При AUC → 1 или AUC → 0 p-value стремится к 0.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: мощность vs t-тест</summary>
        <div class="deep-dive-body">
          <p>При нормальных данных тест Манна-Уитни имеет асимптотическую мощность $\\frac{3}{\\pi} \\approx 95.5\\%$ от t-теста. То есть «теряется» лишь 4.5% мощности ради отказа от предположения о нормальности — отличная сделка.</p>
          <p>При тяжёлых хвостах или скошенных распределениях Манн-Уитни <b>мощнее</b> t-теста: он не перегружен влиянием выбросов.</p>
          <p>Для порядковых данных (1–5 звёзд) t-тест математически некорректен, и Манн-Уитни — единственный правильный параметрический аналог.</p>
        </div>
      </div>

      <h3>⚠️ Ограничения и подводные камни</h3>
      <ul>
        <li><b>Не тестирует равенство медиан напрямую</b> — это распространённое заблуждение. Тест сравнивает стохастическое упорядочение. Медианы могут быть равны, но тест всё равно будет значим, если формы распределений отличаются.</li>
        <li><b>Много совпадений (ties)</b> — при большой доле одинаковых значений нужна поправка на ties; без неё z-статистика завышена.</li>
        <li><b>Не подходит для связанных выборок</b> — для пар «до/после» нужен парный тест Уилкоксона (знаковых рангов).</li>
        <li><b>Для &gt;2 групп</b> нужен тест Краскела-Уоллиса (непараметрический аналог ANOVA).</li>
      </ul>

      <div class="callout warn">⚠️ Манн-Уитни не спасает от всех проблем с данными. Если в данных есть ошибки измерений, систематические смещения или нарушения независимости наблюдений — никакой тест не поможет.</div>
    `,

    examples: [
      {
        title: 'Время на странице (скошенное)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>A/B тест: новый дизайн страницы (B) против старого (A). Метрика — время на странице (секунды). Данные сильно скошены из-за случайного «зависания» нескольких пользователей. Применить t-тест рискованно — используем Манн-Уитни.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Группа A</th><td>45</td><td>32</td><td>128</td><td>41</td><td>37</td><td>55</td><td>29</td></tr>
              <tr><th>Группа B</th><td>62</td><td>71</td><td>48</td><td>85</td><td>53</td><td>76</td><td>91</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Объединяем и ранжируем все 14 значений</h4>
            <div class="calc">Сортируем: 29(A) 32(A) 37(A) 41(A) 45(A) 48(B) 53(B) 55(A) 62(B) 71(B) 76(B) 85(B) 91(B) 128(A)

Ранги:
  A: 29→1, 32→2, 37→3, 41→4, 45→5, 55→8, 128→14
  B: 48→6, 53→7, 62→9, 71→10, 76→11, 85→12, 91→13</div>
            <div class="why">Каждому значению присваивается его порядковое место в общем списке. Выброс 128 получает ранг 14 — он по-прежнему «самый большой», но влияет лишь на один ранг, а не тянет среднее вверх.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Суммируем ранги по группам</h4>
            <div class="calc">R_A = 1 + 2 + 3 + 4 + 5 + 8 + 14 = <b>37</b>
R_B = 6 + 7 + 9 + 10 + 11 + 12 + 13 = <b>68</b>

Проверка: R_A + R_B = 37 + 68 = 105 = 14×15/2 ✓</div>
          </div>

          <div class="step" data-step="3">
            <h4>Вычисляем статистику U</h4>
            <div class="calc">n₁ = n₂ = 7

U_A = R_A − n₁(n₁+1)/2 = 37 − 7×8/2 = 37 − 28 = <b>9</b>
U_B = R_B − n₂(n₂+1)/2 = 68 − 7×8/2 = 68 − 28 = <b>40</b>

Проверка: U_A + U_B = 9 + 40 = 49 = 7×7 ✓

U = min(9, 40) = <b>9</b></div>
            <div class="why">U_A = 9 означает: из 49 возможных пар (a, b), где a из A и b из B, только 9 пар где a > b. Группа B в большинстве случаев выше.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Z-аппроксимация и p-value</h4>
            <div class="calc">μ_U = n₁×n₂/2 = 49/2 = 24.5
σ_U = √(n₁×n₂×(n₁+n₂+1)/12) = √(7×7×15/12) = √(61.25) ≈ 7.83

z = (U − μ_U) / σ_U = (9 − 24.5) / 7.83 = −15.5 / 7.83 ≈ <b>−1.98</b>

p-value (двусторонний) = 2 × P(Z < −1.98) ≈ 2 × 0.024 = <b>0.048</b></div>
          </div>

          <div class="step" data-step="5">
            <h4>Вывод и размер эффекта</h4>
            <div class="calc">p = 0.048 < α = 0.05 → <b>Отвергаем H₀</b>

Размер эффекта (ранг-бисериальная корреляция):
r = 1 − 2U/(n₁×n₂) = 1 − 2×9/49 = 1 − 0.367 = <b>0.633</b>
→ большой эффект по шкале Коэна</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>U = 9, z ≈ −1.98, p ≈ 0.048. Новый дизайн (B) статистически значимо увеличивает время на странице. Размер эффекта r = 0.63 — большой. Медиана A ≈ 41 с, медиана B ≈ 71 с.</p>
          </div>

          <div class="lesson-box">Обрати внимание: выброс 128 в группе A получил лишь ранг 14, не исказив итог. При t-тесте он бы поднял среднее A с 52 до ~67 и мог скрыть преимущество B.</div>
        `
      },
      {
        title: 'Сравнение с t-тестом',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Те же данные из примера 1. Сравним результаты Манна-Уитни и t-теста на одних и тех же данных и обсудим, когда они расходятся.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Считаем t-тест (двухвыборочный, Welch)</h4>
            <div class="calc">A: 45, 32, 128, 41, 37, 55, 29  → x̄_A = 367/7 ≈ 52.4,  s_A ≈ 33.0
B: 62, 71,  48, 85, 53, 76, 91  → x̄_B = 486/7 ≈ 69.4,  s_B ≈ 16.5

SE = √(s_A²/n_A + s_B²/n_B) = √(33²/7 + 16.5²/7) = √(155.6 + 38.9) ≈ 13.94

t = (x̄_B − x̄_A) / SE = (69.4 − 52.4) / 13.94 = 17.0 / 13.94 ≈ <b>1.22</b>

df (Welch) ≈ 8.9,  p-value (двусторонний) ≈ <b>0.254</b>

→ t-тест: <b>НЕ отвергаем H₀</b> (p > 0.05)</div>
            <div class="why">Выброс 128 сильно увеличил дисперсию группы A (s_A=33), увеличив стандартную ошибку и уменьшив t. T-тест «растерялся» из-за нарушения нормальности.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Сравниваем результаты</h4>
            <div class="calc">Тест Манна-Уитни:  U = 9,  p ≈ 0.048  → <b>Значимо</b>
Двухвыборочный t: t ≈ 1.22, p ≈ 0.254 → <b>Не значимо</b></div>
            <p>Два теста дают противоположные ответы! Какому верить?</p>
          </div>

          <div class="step" data-step="3">
            <h4>Диагностика данных</h4>
            <div class="calc">Медиана A = 41 сек,  Медиана B = 71 сек
Среднее  A = 52.4 сек, Среднее  B = 69.4 сек

Skewness группы A:
  Без выброса: среднее ≈ 39.8, с выбросом: 52.4  — разница огромная!
  → Распределение A явно скошено

Тест Шапиро-Уилка для группы A: p ≈ 0.02 → нормальность отвергается</div>
            <div class="why">Когда нормальность нарушена, t-тест некорректен. Правильный инструмент — Манн-Уитни.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Когда они совпадают, а когда расходятся</h4>
            <div class="calc">Расходятся когда:
  • Есть выбросы (они влияют на среднее, но не на ранги)
  • Данные сильно скошены
  • Маленькая выборка с ненормальным распределением

Совпадают когда:
  • Данные близки к нормальным
  • Нет выбросов
  • Большая выборка (ЦПТ делает t-тест устойчивым)</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Вывод</div>
            <p>При нарушении нормальности Манн-Уитни надёжнее. Выброс 128 «обманул» t-тест, завысив дисперсию группы A. Ранговый подход выявил реальную разницу (медианы 41 vs 71 сек).</p>
          </div>

          <div class="lesson-box">Правило выбора: если <a class="glossary-link" onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a> показывает отклонения или тест Шапиро-Уилка значим — используй Манн-Уитни. При нормальных данных t-тест чуть мощнее (95.5% эффективности у МУ).</div>
        `
      },
      {
        title: 'Ординальные данные: рейтинги',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Пользователи оценивали новый и старый интерфейс по шкале удовлетворённости 1–5 звёзд. Можно ли использовать t-тест? Нет — звёзды порядковые, арифметика над ними бессмысленна. Применяем Манн-Уитни.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Версия</th><th colspan="8">Оценки пользователей</th><th>Медиана</th></tr>
              <tr><td><b>A (старая)</b></td><td>2</td><td>3</td><td>2</td><td>4</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2.5</td></tr>
              <tr><td><b>B (новая)</b></td><td>4</td><td>5</td><td>3</td><td>4</td><td>5</td><td>4</td><td>3</td><td>5</td><td>4</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Объясняем, почему нельзя t-тест</h4>
            <div class="calc">Среднее A = (2+3+2+4+3+2+3+1)/8 = 20/8 = 2.5
Среднее B = (4+5+3+4+5+4+3+5)/8 = 33/8 = 4.125

Проблемы с t-тестом для таких данных:
  1. Дискретные значения только 1,2,3,4,5 — не непрерывные
  2. Разница «1→2» может не равняться «4→5» по смыслу
  3. Распределение не нормальное (ограничено [1,5])
  4. Маленькая выборка</div>
            <div class="why">Звезда — это порядок, а не измерение. «4 + 2 = 3» в смысле удовлетворённости не имеет смысла.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Ранжирование с учётом ties</h4>
            <div class="calc">Все 16 оценок (отсортированы):
1(A) 2(A) 2(A) 2(A) 3(A) 3(A) 3(A) 3(B) 3(B) 4(A) 4(B) 4(B) 4(B) 5(B) 5(B) 5(B)

Ties → средние ранги:
  Значение 1: позиция 1               → ранг 1.0
  Значение 2: позиции 2,3,4           → ранг (2+3+4)/3 = 3.0
  Значение 3: позиции 5,6,7,8,9       → ранг (5+6+7+8+9)/5 = 7.0
  Значение 4: позиции 10,11,12,13     → ранг (10+11+12+13)/4 = 11.5
  Значение 5: позиции 14,15,16        → ранг (14+15+16)/3 = 15.0

R_A: 1×1.0 + 3×3.0 + 3×7.0 + 1×11.5 = 1 + 9 + 21 + 11.5 = <b>42.5</b>
R_B: 2×7.0 + 3×11.5 + 3×15.0        = 14 + 34.5 + 45 = <b>93.5</b>

Проверка: 42.5 + 93.5 = 136 ✓ (N=16: 16×17/2=136)</div>
          </div>

          <div class="step" data-step="3">
            <h4>Статистика U и p-value</h4>
            <div class="calc">n_A = n_B = 8

U_A = R_A − n_A(n_A+1)/2 = 42.5 − 8×9/2 = 42.5 − 36 = <b>6.5</b>
U_B = R_B − n_B(n_B+1)/2 = 93.5 − 36 = <b>57.5</b>

μ_U = 8×8/2 = 32
σ_U = √(8×8×17/12) ≈ √(90.67) ≈ 9.52  (без поправки на ties)

z = (6.5 − 32) / 9.52 = −25.5 / 9.52 ≈ <b>−2.68</b>
p-value (двусторонний) ≈ <b>0.007</b></div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>U = 6.5, z ≈ −2.68, p ≈ 0.007. Новый интерфейс (B) значимо выше по удовлетворённости. Из 64 пар сравнений (a, b) лишь U_A = 6.5 — где оценка A выше B (ничьи считаются за ½). Ранг-бисериальная корреляция r = 1 − 2×6.5/64 ≈ 0.80 — очень большой эффект.</p>
          </div>

          <div class="lesson-box">Для ординальных данных (шкалы Лайкерта, звёзды, NPS) Манн-Уитни — стандартный выбор. T-тест технически некорректен, хотя на практике часто даёт похожие результаты при достаточном числе градаций шкалы (≥5).</div>
        `
      },
    ],

    simulation: [
      {
        title: 'Базовый тест',
        html: `
        <h3>Ранговый тест: симуляция Манна-Уитни</h3>
        <p>Сгенерируй две выборки с разными распределениями и посмотри, как тест реагирует на реальный сдвиг.</p>
        <div class="sim-container">
          <div class="sim-controls" id="mw-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="mw-run">▶ Провести тест</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="mw-chart"></canvas></div>
            <div class="sim-stats" id="mw-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#mw-controls');
        const cN    = App.makeControl('range',  'mw-n',    'n в каждой группе',     { min: 10, max: 100, step: 5,   value: 30  });
        const cMuA  = App.makeControl('range',  'mw-muA',  'Сдвиг группы A (μ_A)',  { min: 0,  max: 10,  step: 0.5, value: 3   });
        const cMuB  = App.makeControl('range',  'mw-muB',  'Сдвиг группы B (μ_B)',  { min: 0,  max: 10,  step: 0.5, value: 5   });
        const cDist = App.makeControl('select', 'mw-dist', 'Тип распределения', {
          options: [
            { value: 'normal',      label: 'Нормальное' },
            { value: 'exponential', label: 'Экспоненциальное' },
            { value: 'uniform',     label: 'Равномерное' },
          ],
          value: 'exponential',
        });
        [cN, cMuA, cMuB, cDist].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;

        function generateSample(n, mu, dist) {
          if (dist === 'normal')      return App.Util.normalSample(n, mu, 2);
          if (dist === 'exponential') return App.Util.expSample(n, 1 / (mu + 0.01));
          if (dist === 'uniform')     return App.Util.uniformSample(n, mu * 0.5, mu * 1.5 + 1);
          return App.Util.normalSample(n, mu, 2);
        }

        function mannWhitneyU(a, b) {
          // Compute U via rank-sum
          const n1 = a.length, n2 = b.length;
          const combined = [
            ...a.map((v) => ({ v, g: 0 })),
            ...b.map((v) => ({ v, g: 1 })),
          ].sort((x, y) => x.v - y.v);
          // Assign ranks with tie correction
          const ranks = new Array(combined.length);
          let i = 0;
          while (i < combined.length) {
            let j = i;
            while (j < combined.length && combined[j].v === combined[i].v) j++;
            const avgRank = (i + j + 1) / 2; // 1-based average rank
            for (let k = i; k < j; k++) ranks[k] = avgRank;
            i = j;
          }
          let r1 = 0;
          combined.forEach((item, idx) => { if (item.g === 0) r1 += ranks[idx]; });
          const u1 = r1 - n1 * (n1 + 1) / 2;
          const u2 = n1 * n2 - u1;
          const u  = Math.min(u1, u2);
          const mu = n1 * n2 / 2;
          const sigma = Math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
          const z = (u - mu) / sigma;
          const p = 2 * (1 - App.Util.normalCDF(Math.abs(z)));
          const r = (u1 - u2) / (n1 * n2);
          return { u, u1, u2, z, p, r };
        }

        function run() {
          const n    = +cN.input.value;
          const muA  = +cMuA.input.value;
          const muB  = +cMuB.input.value;
          const dist = cDist.input.value;

          const sampA = generateSample(n, muA, dist);
          const sampB = generateSample(n, muB, dist);
          const result = mannWhitneyU(sampA, sampB);

          // Histograms overlaid
          const allVals = [...sampA, ...sampB];
          const lo = App.Util.min(allVals);
          const hi = App.Util.max(allVals);
          const bins = 20;
          const histA = App.Util.histogram(sampA, bins, [lo, hi]);
          const histB = App.Util.histogram(sampB, bins, [lo, hi]);

          const ctx = container.querySelector('#mw-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: histA.centers.map((c) => App.Util.round(c, 1)),
              datasets: [
                {
                  label: 'Группа A',
                  data: histA.counts,
                  backgroundColor: 'rgba(59,130,246,0.55)',
                  borderColor: 'rgba(59,130,246,1)',
                  borderWidth: 1,
                },
                {
                  label: 'Группа B',
                  data: histB.counts,
                  backgroundColor: 'rgba(16,185,129,0.55)',
                  borderColor: 'rgba(16,185,129,1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { display: true },
                title: { display: true, text: 'Перекрытые гистограммы A и B' },
              },
              scales: {
                x: { title: { display: true, text: 'Значение' }, ticks: { maxTicksLimit: 12 } },
                y: { title: { display: true, text: 'Частота' }, beginAtZero: true },
              },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#mw-stats');
          statsEl.innerHTML = '';
          const sig = result.p < 0.05;
          const rAbs = Math.abs(result.r);
          const effLabel = rAbs < 0.1 ? 'пренебрежимый' : rAbs < 0.3 ? 'малый' : rAbs < 0.5 ? 'средний' : 'большой';
          [
            ['U-статистика',  App.Util.round(result.u, 0)],
            ['z',             App.Util.round(result.z, 3)],
            ['p-value',       App.Util.round(result.p, 4)],
            ['Значимо?',      sig ? '✓ Да (p<0.05)' : '✗ Нет (p≥0.05)'],
            ['Ранг-бисер. r', App.Util.round(result.r, 3)],
            ['Размер эффекта', effLabel],
            ['Медиана A',     App.Util.round(App.Util.median(sampA), 2)],
            ['Медиана B',     App.Util.round(App.Util.median(sampB), 2)],
          ].forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [cN, cMuA, cMuB, cDist].forEach((c) => c.input.addEventListener('change', run));
        [cN, cMuA, cMuB].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#mw-run').onclick = run;
        run();
      },
      },
      {
        title: 'MW vs t-test на тяжёлых хвостах',
        html: `
          <h3>Кто надёжнее при выбросах: MW или t-test?</h3>
          <p>На симметричных нормальных данных t-test выигрывает. Но если распределение тяжёлое (log-normal, с выбросами), среднее «гуляет», дисперсия раздувается — t-test теряет мощность. Ранговый MW смотрит только на порядок, ему всё равно на экстремумы. Запусти серию Монте-Карло и сравни долю обнаружений.</p>
          <div class="sim-container">
            <div class="sim-controls" id="mw2-controls"></div>
            <div class="sim-buttons"><button class="btn" id="mw2-run">🔄 Запустить Монте-Карло</button></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="mw2-chart"></canvas></div>
              <div class="sim-stats" id="mw2-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#mw2-controls');
          const cN = App.makeControl('range', 'mw2-n', 'n в каждой группе', { min: 10, max: 200, step: 10, value: 40 });
          const cShift = App.makeControl('range', 'mw2-shift', 'Истинный сдвиг (log-normal μ)', { min: 0, max: 1.5, step: 0.05, value: 0.3 });
          const cContam = App.makeControl('range', 'mw2-contam', 'Доля выбросов %', { min: 0, max: 30, step: 1, value: 5 });
          const cSim = App.makeControl('range', 'mw2-sim', 'Симуляций', { min: 100, max: 1000, step: 100, value: 300 });
          [cN, cShift, cContam, cSim].forEach(c => controls.appendChild(c.wrap));
          let chart = null;
          // Simple t-test (Welch)
          function welchT(a, b) {
            const ma = App.Util.mean(a), mb = App.Util.mean(b);
            const va = a.reduce((s, x) => s + (x - ma) ** 2, 0) / (a.length - 1);
            const vb = b.reduce((s, x) => s + (x - mb) ** 2, 0) / (b.length - 1);
            const se = Math.sqrt(va / a.length + vb / b.length);
            if (se === 0) return { t: 0, p: 1 };
            const t = (ma - mb) / se;
            // Approximate p with normal (n≥20)
            const p = 2 * (1 - App.Util.normalCDF(Math.abs(t)));
            return { t, p };
          }
          function mwU(a, b) {
            const n1 = a.length, n2 = b.length;
            const combined = [...a.map(v => ({ v, g: 0 })), ...b.map(v => ({ v, g: 1 }))].sort((x, y) => x.v - y.v);
            const ranks = new Array(combined.length);
            let i = 0;
            while (i < combined.length) {
              let j = i;
              while (j < combined.length && combined[j].v === combined[i].v) j++;
              const avg = (i + j + 1) / 2;
              for (let k = i; k < j; k++) ranks[k] = avg;
              i = j;
            }
            let r1 = 0;
            combined.forEach((it, idx) => { if (it.g === 0) r1 += ranks[idx]; });
            const u1 = r1 - n1 * (n1 + 1) / 2;
            const u2 = n1 * n2 - u1;
            const u = Math.min(u1, u2);
            const mu = n1 * n2 / 2;
            const sigma = Math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
            const z = (u - mu) / sigma;
            const p = 2 * (1 - App.Util.normalCDF(Math.abs(z)));
            return { u, p };
          }
          function sampleLogNormal(n, muLog, contam) {
            const s = new Array(n);
            for (let i = 0; i < n; i++) {
              if (Math.random() < contam) {
                // Outlier: extreme log-normal
                s[i] = Math.exp(muLog + App.Util.randn(0, 1) + 3);
              } else {
                s[i] = Math.exp(muLog + App.Util.randn(0, 0.7));
              }
            }
            return s;
          }
          function run() {
            const n = +cN.input.value;
            const shift = +cShift.input.value;
            const contam = +cContam.input.value / 100;
            const nSim = +cSim.input.value;
            let tRej = 0, mwRej = 0;
            for (let s = 0; s < nSim; s++) {
              const a = sampleLogNormal(n, 0, contam);
              const b = sampleLogNormal(n, shift, contam);
              if (welchT(a, b).p < 0.05) tRej++;
              if (mwU(a, b).p < 0.05) mwRej++;
            }
            const tPower = tRej / nSim * 100;
            const mwPower = mwRej / nSim * 100;
            const ctx = container.querySelector('#mw2-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Welch t-test', 'Mann-Whitney U'],
                datasets: [{
                  label: 'Мощность %',
                  data: [tPower, mwPower],
                  backgroundColor: [
                    tPower < mwPower ? 'rgba(239,68,68,0.55)' : 'rgba(16,185,129,0.7)',
                    mwPower < tPower ? 'rgba(239,68,68,0.55)' : 'rgba(16,185,129,0.7)',
                  ],
                }],
              },
              options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: shift === 0 ? 'H₀ верна — должна быть ~5% (false positive rate)' : 'Мощность (доля обнаружений)' } }, scales: { y: { min: 0, max: 100, title: { display: true, text: '% отвергнутых H₀' } } } },
            });
            App.registerChart(chart);
            const winner = Math.abs(tPower - mwPower) < 2 ? 'равны' : (tPower > mwPower ? 't-test' : 'MW');
            container.querySelector('#mw2-stats').innerHTML =
              '<div class="stat-card"><div class="stat-label">t-test power</div><div class="stat-value">' + tPower.toFixed(1) + '%</div></div>' +
              '<div class="stat-card"><div class="stat-label">MW power</div><div class="stat-value">' + mwPower.toFixed(1) + '%</div></div>' +
              '<div class="stat-card"><div class="stat-label">Разница</div><div class="stat-value">' + (mwPower - tPower).toFixed(1) + ' п.п.</div></div>' +
              '<div class="stat-card"><div class="stat-label">Выигрывает</div><div class="stat-value">' + winner + '</div></div>';
          }
          [cN, cShift, cContam, cSim].forEach(c => c.input.addEventListener('change', run));
          container.querySelector('#mw2-run').onclick = run;
          run();
        },
      },
    ],

    python: `
      <h3>📊 Тест Манна-Уитни в Python</h3>
      <pre><code>from scipy import stats
import numpy as np

np.random.seed(42)

# Данные: время на сайте (секунды) — скошенное распределение
group_A = np.random.exponential(scale=120, size=300)  # контроль
group_B = np.random.exponential(scale=140, size=300)  # тест

# Тест Манна-Уитни (непараметрический)
u_stat, p_value = stats.mannwhitneyu(group_A, group_B, alternative='two-sided')

print(f"Медиана A: {np.median(group_A):.1f} сек")
print(f"Медиана B: {np.median(group_B):.1f} сек")
print(f"\\nU-статистика = {u_stat:.0f}")
print(f"p-value = {p_value:.4f}")
print(f"\\n{'Значимо!' if p_value < 0.05 else 'Не значимо'} (α=0.05)")</code></pre>

      <h3>📋 Когда использовать Манна-Уитни vs t-тест</h3>
      <pre><code>from scipy import stats
import numpy as np

# Проверяем нормальность данных
_, p_shapiro_A = stats.shapiro(group_A[:50])  # берём подвыборку
_, p_shapiro_B = stats.shapiro(group_B[:50])

print(f"Shapiro-Wilk A: p={p_shapiro_A:.4f}")
print(f"Shapiro-Wilk B: p={p_shapiro_B:.4f}")

if p_shapiro_A > 0.05 and p_shapiro_B > 0.05:
    print("\\n→ Данные нормальные → используйте t-тест")
    t, p = stats.ttest_ind(group_A, group_B)
    print(f"  t-тест: t={t:.3f}, p={p:.4f}")
else:
    print("\\n→ Данные НЕ нормальные → используйте Манна-Уитни")
    u, p = stats.mannwhitneyu(group_A, group_B)
    print(f"  Манн-Уитни: U={u:.0f}, p={p:.4f}")</code></pre>

      <h3>📈 Визуализация распределений</h3>
      <pre><code>import matplotlib.pyplot as plt

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# <a class="glossary-link" onclick="App.selectTopic('viz-histogram')">Гистограммы</a>
ax1.hist(group_A, bins=30, alpha=0.5, label='A', color='blue')
ax1.hist(group_B, bins=30, alpha=0.5, label='B', color='green')
ax1.axvline(np.median(group_A), color='blue', linestyle='--')
ax1.axvline(np.median(group_B), color='green', linestyle='--')
ax1.set_title("Распределения (скошенные)")
ax1.legend()

# <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a>
ax2.<a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a>([group_A, group_B], labels=['A', 'B'])
ax2.set_title("<a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a>: A vs B")
ax2.set_ylabel("Время (сек)")

plt.tight_layout()
plt.show()</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>A/B с тяжёлыми хвостами.</b> LTV, ARPU, средний чек, выручка на пользователя — распределения, у которых медиана и среднее отличаются в разы, а одиночный «кит» может перевернуть t-тест. Манн-Уитни работает с рангами и не боится выбросов.</li>
        <li><b>Время отклика систем.</b> Latency веб-страниц, API, запросов к БД — всегда правоскошенное распределение с тяжёлым хвостом. Классическая область применения непараметрики, где t-тест теряет мощность и врёт про средние.</li>
        <li><b>Опросы и шкалы Лайкерта.</b> Ординальные данные (1..5 звёзд, «не нравится»/«нравится»/«очень нравится») формально не числа — арифметика над ними некорректна. Манн-Уитни сравнивает стохастический порядок, что именно соответствует смыслу «оценки одного варианта выше другого».</li>
        <li><b>Клинические исследования с малыми выборками.</b> Когда пациентов мало (n &lt; 30), нормальность не проверить, а результат надо обосновать регулятору — Mann-Whitney корректен при любом $n$ и не требует допущений.</li>
        <li><b>Сравнение метрик ML-моделей на нескольких прогонах.</b> Особенно когда прогонов мало и распределение метрики по сидам неизвестно — ранговый тест не требует нормальности.</li>
        <li><b>Исследовательский EDA.</b> Быстрая проверка «есть ли различие» без предварительной проверки нормальности, lognormal-трансформаций и прочих шаманств.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Не требует нормальности.</b> Тест основан на рангах, а не на самих значениях, поэтому форма распределения не влияет на корректность. У t-теста $p$-value перестаёт быть честной при скошенных данных и малых $n$; у Mann-Whitney — всегда корректна, при любой форме.</p>
      <p><b>Устойчивость к выбросам.</b> Экстремум в данных получает ранг $n$ — и всё. Он не может «утащить среднее» как в параметрических тестах. Это критически важно для выручки, LTV, latency, где единичные киты встречаются постоянно.</p>
      <p><b>Работает с ординальными данными.</b> Шкала Лайкерта или ранжированные оценки не имеют метрики («разница между 4 и 5 = разнице между 1 и 2»?) — арифметические операции над ними некорректны. Манн-Уитни использует только порядок, что математически соответствует природе данных.</p>
      <p><b>Высокая асимптотическая эффективность.</b> При идеально нормальных данных Pitman efficiency Манна-Уитни относительно t-теста = $3/\\pi \\approx 0.955$ — теряем всего 4.5% мощности. А при тяжёлых хвостах он уже мощнее t-теста, иногда в разы. «Цена страховки» от ненормальности минимальна.</p>
      <p><b>Корректен при малых $n$.</b> Распределение U-статистики при $H_0$ можно вычислить точно (перебор перестановок) — тест работает даже при $n=4+4$, без нормального приближения. Это делает его методом выбора в биологии, медицине, пилотных экспериментах.</p>
      <p><b>Прямая связь с AUC.</b> $U / (n_1 n_2)$ математически равен AUROC: вероятности, что случайный элемент B больше случайного элемента A. Это делает результат интерпретируемым — не «средние разошлись», а «с вероятностью 0.61 случайный B &gt; случайный A».</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Потеря мощности при нормальных данных.</b> Если распределения действительно нормальные, t-тест точнее (~4.5% выше мощность). На бесплатных метриках вроде CTR или времени на странице, где нормальное приближение работает, Манн-Уитни — лёгкий pessimization.</p>
      <p><b>Нестандартная $H_0$.</b> Формально Mann-Whitney тестирует стохастическое упорядочение $P(X &lt; Y) = 0.5$, а не равенство медиан. Эти вещи совпадают только при одинаковой форме распределений. Если B не только сдвинут, но и имеет другую форму — «значимый» результат не означает «медиана больше», только «в среднем B больше A при парном сравнении».</p>
      <p><b>Ties (совпадения значений) требуют поправки.</b> Целочисленные оценки (1..5) и округлённые секунды создают много связей — наивная формула даёт смещённую дисперсию. Нужны tie correction или перейти на Monte Carlo / exact test.</p>
      <p><b>Интерпретация в рангах, а не в единицах.</b> Результат — «$U = 1247$, $p = 0.008$». Бизнесу нужно переводить в медиану или Hodges-Lehmann estimator (медиана всех парных разностей). Для t-теста «разность в рублях» лежит прямо в выходе.</p>
      <p><b>Нет нативного способа учесть ковариаты.</b> В параметрическом мире есть ANCOVA — модель с корректировкой на стратификацию. В непараметрике аналога нет, только Quade test или rank-based ANCOVA — сложнее и не везде реализовано.</p>
      <p><b>Не для парных данных.</b> Для «до/после» одного и того же юзера используется не Mann-Whitney, а Wilcoxon signed-rank test — это другой тест, хотя по имени похож.</p>

      <h3>🧭 Когда применять Mann-Whitney — и когда не стоит</h3>
      <table>
        <tr><th>✅ Применяй Манна-Уитни когда</th><th>❌ НЕ применяй когда</th></tr>
        <tr>
          <td>Данные скошенные, с тяжёлыми хвостами (LTV, latency, выручка)</td>
          <td>Данные нормальные и $n$ большое — t-тест даст чуть больше мощности</td>
        </tr>
        <tr>
          <td>Есть выбросы, которые не хочется чистить вручную</td>
          <td>Нужен CI для разности средних в исходных единицах (рублях, секундах)</td>
        </tr>
        <tr>
          <td>Данные ординальные (шкала Лайкерта, ранги, оценки)</td>
          <td>Данные парные (до/после) — бери Wilcoxon signed-rank, не Mann-Whitney</td>
        </tr>
        <tr>
          <td>Малая выборка ($n &lt; 30$), нормальность не проверить</td>
          <td>Распределения в группах имеют разную форму — «сдвиг» неверная модель</td>
        </tr>
        <tr>
          <td>Нужна корректность теста без допущений о форме распределения</td>
          <td>Нужно контролировать ковариаты — нет прямого непараметрического ANCOVA</td>
        </tr>
        <tr>
          <td>Хочешь интерпретируемую статистику через AUC / $P(B &gt; A)$</td>
          <td>Очень много совпадений (ties) — exact версия или bootstrap точнее</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('ab-t-test')">Welch t-тест</a></b> — при нормальных или почти нормальных данных даёт больше мощности и прямую интерпретацию разности средних.</li>
        <li><b>Bootstrap разности медиан</b> — когда хочется непараметрический подход, но нужен CI в исходных единицах метрики. Универсален, работает при любом $n$, легко считается в коде.</li>
        <li><b>Wilcoxon signed-rank test</b> — парный аналог Mann-Whitney для «до/после» одних и тех же объектов.</li>
        <li><b>Permutation test (exact randomization test)</b> — прямой перебор перестановок меток: корректен при любом $n$ и распределении, не требует таблиц критических значений.</li>
        <li><b>Quantile regression</b> — когда интересно не «в среднем», а конкретный квантиль (например, p95 latency) и влияние ковариат.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=BT1FKd1Qzjw" target="_blank">Mann-Whitney U Test (By Hand)</a> — ранговый тест Манна-Уитни: логика и применение</li>
        <li><a href="https://www.youtube.com/watch?v=NF5_btOaCig" target="_blank">Using Linear Models for t-tests and ANOVA (StatQuest)</a> — сравнение t-теста и непараметрических альтернатив</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank">Khan Academy: Statistics</a> — основы статистики для понимания непараметрических тестов</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BA%D1%80%D0%B8%D1%82%D0%B5%D1%80%D0%B8%D0%B9%20%D0%9C%D0%B0%D0%BD%D0%BD%D0%B0-%D0%A3%D0%B8%D1%82%D0%BD%D0%B8" target="_blank">Habr: тест Манна-Уитни</a> — когда и как применять непараметрические тесты</li>
        <li><a href="https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test" target="_blank">Wikipedia: Mann-Whitney U test</a> — математическое описание, статистика U и AUROC</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.mannwhitneyu.html" target="_blank">SciPy: scipy.stats.mannwhitneyu</a> — тест Манна-Уитни с выбором альтернативы (two-sided, greater, less)</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.rankdata.html" target="_blank">SciPy: scipy.stats.rankdata</a> — ранжирование данных с обработкой совпадений (ties)</li>
      </ul>
    `,
  },
});
