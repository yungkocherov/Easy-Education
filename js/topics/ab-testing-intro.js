/* ==========================================================================
   A/B тестирование — Введение
   ========================================================================== */
App.registerTopic({
  id: 'ab-testing-intro',
  category: 'ab',
  title: 'Введение в A/B тестирование',
  summary: 'Дизайн экспериментов, выбор теста, расчёт размера выборки, частые ошибки.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Ты меняешь кнопку на сайте с серой на зелёную и замечаешь, что продажи выросли на 8%. Отлично? Не так быстро. Может быть, в тот день была пятница, а пятничные пользователи покупают больше. Может быть, ты случайно показал новую кнопку именно постоянным покупателям. Может быть, просто так получилось — случайные колебания.</p>
        <p>A/B тест — это способ ответить на вопрос <b>«стало лучше или это случайность?»</b> строго и без самообмана. Ты одновременно показываешь вариант A части пользователей и вариант B другой части, случайно разделив их, и сравниваешь результаты.</p>
      </div>

      <h3>🎯 Что такое A/B тест</h3>
      <p>A/B тест — это <b>контролируемый эксперимент</b>, в котором:</p>
      <ul>
        <li>Участники случайно делятся на две (или больше) группы.</li>
        <li>Каждая группа получает разное «воздействие» (вариант интерфейса, алгоритм, сообщение).</li>
        <li>Результаты статистически сравниваются, чтобы решить, есть ли значимый эффект.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Почему важна рандомизация</div>
        <p><b>Случайное</b> назначение групп гарантирует, что единственное систематическое различие между A и B — это сам тестируемый вариант. Без рандомизации ты не можешь быть уверен, что эффект вызван именно изменением, а не тем, что в одну группу попали «лучшие» пользователи. Рандомизация — это сердце доверия к результату.</p>
      </div>

      <h3>📋 Шаги A/B теста</h3>
      <p>Классическая последовательность включает шесть этапов:</p>
      <ol>
        <li><b>Гипотеза</b> — чётко формулируем, что и почему меняем. «Зелёная кнопка 'Купить' привлечёт больше кликов, потому что она выделяется на белом фоне.»</li>
        <li><b>Метрика</b> — определяем одну первичную метрику (конверсия, ARPU, retention) и несколько вторичных. Только до начала теста!</li>
        <li><b>Размер выборки</b> — рассчитываем, сколько пользователей нужно для заданной мощности теста. Недостаточно данных → результат ненадёжен.</li>
        <li><b>Запуск</b> — рандомизируем, запускаем, не заглядываем в данные до конца (или используем sequential testing).</li>
        <li><b>Анализ</b> — применяем выбранный статистический тест, считаем p-value и доверительный интервал.</li>
        <li><b>Решение</b> — «раскатываем» победителя или отвергаем изменение, документируем выводы.</li>
      </ol>

      <div class="illustration bordered">
        <svg viewBox="0 0 620 200" xmlns="http://www.w3.org/2000/svg" style="max-width:620px;">
          <defs>
            <marker id="arrAB" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#6366f1"/>
            </marker>
          </defs>
          <!-- Step boxes -->
          <!-- Step 1: Hypothesis -->
          <rect x="10" y="75" width="85" height="50" rx="8" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
          <text x="52" y="97" text-anchor="middle" font-size="11" font-weight="700" fill="#5b21b6">Гипотеза</text>
          <text x="52" y="112" text-anchor="middle" font-size="9" fill="#5b21b6">H₀ vs H₁</text>
          <!-- Arrow 1→2 -->
          <line x1="95" y1="100" x2="112" y2="100" stroke="#6366f1" stroke-width="1.8" marker-end="url(#arrAB)"/>
          <!-- Step 2: Metric -->
          <rect x="112" y="75" width="85" height="50" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
          <text x="154" y="97" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">Метрика</text>
          <text x="154" y="112" text-anchor="middle" font-size="9" fill="#1e40af">CR, ARPU...</text>
          <!-- Arrow 2→3 -->
          <line x1="197" y1="100" x2="214" y2="100" stroke="#6366f1" stroke-width="1.8" marker-end="url(#arrAB)"/>
          <!-- Step 3: Sample size -->
          <rect x="214" y="75" width="85" height="50" rx="8" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
          <text x="256" y="93" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">Размер</text>
          <text x="256" y="107" text-anchor="middle" font-size="9" fill="#065f46">выборки</text>
          <text x="256" y="119" text-anchor="middle" font-size="9" fill="#065f46">α, β, MDE</text>
          <!-- Arrow 3→4 -->
          <line x1="299" y1="100" x2="316" y2="100" stroke="#6366f1" stroke-width="1.8" marker-end="url(#arrAB)"/>
          <!-- Step 4: Run -->
          <rect x="316" y="75" width="85" height="50" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
          <text x="358" y="97" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">Запуск</text>
          <text x="358" y="112" text-anchor="middle" font-size="9" fill="#92400e">рандомиз.</text>
          <!-- Arrow 4→5 -->
          <line x1="401" y1="100" x2="418" y2="100" stroke="#6366f1" stroke-width="1.8" marker-end="url(#arrAB)"/>
          <!-- Step 5: Analyze -->
          <rect x="418" y="75" width="85" height="50" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
          <text x="460" y="97" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b">Анализ</text>
          <text x="460" y="112" text-anchor="middle" font-size="9" fill="#991b1b">p-value, CI</text>
          <!-- Arrow 5→6 -->
          <line x1="503" y1="100" x2="520" y2="100" stroke="#6366f1" stroke-width="1.8" marker-end="url(#arrAB)"/>
          <!-- Step 6: Decision -->
          <rect x="520" y="75" width="90" height="50" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
          <text x="565" y="97" text-anchor="middle" font-size="11" font-weight="700" fill="#15803d">Решение</text>
          <text x="565" y="112" text-anchor="middle" font-size="9" fill="#15803d">раскатить / нет</text>
          <!-- Title -->
          <text x="310" y="25" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Жизненный цикл A/B теста</text>
          <!-- Numbers -->
          <text x="52"  y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#7c3aed">1</text>
          <text x="154" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#2563eb">2</text>
          <text x="256" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#059669">3</text>
          <text x="358" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#d97706">4</text>
          <text x="460" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">5</text>
          <text x="565" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#16a34a">6</text>
        </svg>
        <div class="caption">Шесть шагов A/B теста. Критично: метрику и размер выборки определяем до запуска, иначе rискуем p-hacking'ом.</div>
      </div>

      <h3>📐 Выбор теста по типу метрики</h3>
      <p>Правильный тест зависит от типа данных и числа групп:</p>
      <table>
        <tr><th>Тип метрики</th><th>Примеры</th><th>Тест</th></tr>
        <tr><td><b>Бинарный исход</b> (да/нет)</td><td>Конверсия, клик, покупка</td><td>z-тест для пропорций</td></tr>
        <tr><td><b>Непрерывная величина</b></td><td>Чек, время на сайте, LTV</td><td>t-тест (Welch)</td></tr>
        <tr><td><b>Категориальный исход</b></td><td>Выбранный тариф, тип действия</td><td>Хи-квадрат</td></tr>
        <tr><td><b>Ранговая / нет нормальности</b></td><td>Оценка, NPS</td><td>Манн-Уитни U</td></tr>
        <tr><td><b>Более двух групп</b></td><td>A/B/C/D тест</td><td>ANOVA, хи-квадрат</td></tr>
        <tr><td><b>Парные наблюдения</b></td><td>До/после одного пользователя</td><td>Парный t-тест</td></tr>
      </table>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <defs>
            <marker id="arrFlow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#64748b"/>
            </marker>
          </defs>
          <text x="280" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Блок-схема выбора теста</text>
          <!-- Q1: Two groups? -->
          <rect x="195" y="34" width="170" height="38" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="280" y="50" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Сколько групп?</text>
          <text x="280" y="65" text-anchor="middle" font-size="10" fill="#1e40af">2 группы или &gt;2?</text>
          <!-- Arrow: 2 groups left -->
          <line x1="195" y1="53" x2="140" y2="53" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <text x="165" y="47" text-anchor="middle" font-size="9" fill="#475569">2</text>
          <!-- Arrow: >2 groups right -->
          <line x1="365" y1="53" x2="420" y2="53" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <text x="390" y="47" text-anchor="middle" font-size="9" fill="#475569">&gt;2</text>
          <!-- >2 groups box -->
          <rect x="420" y="35" width="125" height="36" rx="8" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
          <text x="482" y="51" text-anchor="middle" font-size="10" font-weight="600" fill="#713f12">ANOVA /</text>
          <text x="482" y="65" text-anchor="middle" font-size="10" fill="#713f12">Хи-квадрат</text>
          <!-- Q2: What type? -->
          <rect x="55" y="100" width="170" height="38" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="140" y="116" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Тип метрики?</text>
          <text x="140" y="130" text-anchor="middle" font-size="10" fill="#1e40af">бинарная / непрерывная / категориальная</text>
          <line x1="140" y1="72" x2="140" y2="100" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <!-- Binary branch -->
          <line x1="90" y1="138" x2="60" y2="175" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <text x="60" y="155" font-size="9" fill="#475569">бинар.</text>
          <rect x="10" y="175" width="100" height="38" rx="8" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
          <text x="60" y="191" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">z-тест для</text>
          <text x="60" y="205" text-anchor="middle" font-size="10" fill="#065f46">пропорций</text>
          <!-- Continuous branch -->
          <line x1="140" y1="138" x2="140" y2="175" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <text x="145" y="160" font-size="9" fill="#475569">непрер.</text>
          <!-- Q3: Normal? -->
          <rect x="80" y="175" width="120" height="38" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="140" y="191" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Нормальность?</text>
          <text x="140" y="205" text-anchor="middle" font-size="9" fill="#1e40af">n&gt;30 или норм.</text>
          <!-- Yes → t-test -->
          <line x1="200" y1="194" x2="240" y2="194" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <text x="218" y="188" font-size="9" fill="#475569">да</text>
          <rect x="240" y="175" width="80" height="38" rx="8" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
          <text x="280" y="191" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">t-тест</text>
          <text x="280" y="205" text-anchor="middle" font-size="10" fill="#065f46">(Welch)</text>
          <!-- No → Mann-Whitney -->
          <line x1="140" y1="213" x2="140" y2="240" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <text x="147" y="233" font-size="9" fill="#475569">нет</text>
          <rect x="80" y="240" width="120" height="16" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
          <text x="140" y="252" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Манн-Уитни U</text>
          <!-- Categorical branch -->
          <line x1="185" y1="138" x2="340" y2="175" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrFlow)"/>
          <text x="290" y="155" font-size="9" fill="#475569">категор.</text>
          <rect x="310" y="175" width="110" height="38" rx="8" fill="#fce7f3" stroke="#db2777" stroke-width="1.5"/>
          <text x="365" y="191" text-anchor="middle" font-size="10" font-weight="600" fill="#831843">Хи-квадрат /</text>
          <text x="365" y="205" text-anchor="middle" font-size="10" fill="#831843">Тест Фишера</text>
        </svg>
        <div class="caption">Блок-схема: начни с числа групп, потом смотри на тип метрики. Для бинарных метрик — z-тест, для непрерывных — t-тест (если нормальность) или Манн-Уитни, для категориальных — хи-квадрат.</div>
      </div>

      <h3>🔢 Расчёт размера выборки (power analysis)</h3>
      <p>Самый частый вопрос при планировании A/B теста: «Сколько пользователей нам нужно?». Ответ зависит от четырёх параметров:</p>

      <table>
        <tr><th>Параметр</th><th>Обозначение</th><th>Типичное значение</th><th>Что это</th></tr>
        <tr><td><b>Уровень значимости</b></td><td>α</td><td>0.05</td><td>Допустимая вероятность ложноположительного результата</td></tr>
        <tr><td><b>Мощность теста</b></td><td>1 − β</td><td>0.80</td><td>Вероятность обнаружить реальный эффект, если он есть</td></tr>
        <tr><td><b>Базовая метрика</b></td><td>p₀</td><td>Из истории</td><td>Текущее значение конверсии / среднего</td></tr>
        <tr><td><b>MDE</b></td><td>Δ</td><td>~0.5–2 п.п.</td><td>Минимальный эффект, который важен для бизнеса</td></tr>
      </table>

      <p>Формула для <b>z-теста пропорций</b> (двусторонний, одинаковые группы):</p>
      <div class="math-block">$$n = \\frac{(z_{\\alpha/2} + z_{\\beta})^2 \\cdot (p_1(1-p_1) + p_2(1-p_2))}{(p_2 - p_1)^2}$$</div>
      <p>где $z_{0.025} = 1.96$ и $z_{0.2} = 0.84$ при стандартных α=0.05, β=0.20.</p>

      <div class="key-concept">
        <div class="kc-label">MDE — минимальный детектируемый эффект</div>
        <p><span class="term" data-tip="Minimum Detectable Effect. Минимальное изменение метрики, которое ты хочешь надёжно обнаружить. Слишком маленький MDE требует огромных выборок. Слишком большой — пропустишь реальные эффекты.">MDE</span> — это бизнес-решение, а не статистическое. Спроси: «При каком минимальном улучшении нам стоит внедрять изменение?». Если ответ — 0.1 п.п., тебе нужны миллионы пользователей. Если 5 п.п. — несколько тысяч.</p>
      </div>

      <h3>⚠️ Частые ошибки в A/B тестах</h3>

      <h4>1. Peeking («подглядывание»)</h4>
      <p>Самая распространённая ошибка. Ты запустил тест и каждый день проверяешь данные. Как только p < 0.05 — останавливаешь. Проблема: при многократных проверках реальная ошибка I рода сильно превышает 5%.</p>
      <div class="callout warn">⚠️ Если проверять каждый день 20 дней, вероятность ложно-положительного результата при H₀ составит не 5%, а ~30–40%. Это не анализ — это рулетка.</div>

      <h4>2. Несколько первичных метрик</h4>
      <p>Если ты одновременно тестируешь 10 метрик и смотришь, у какой p < 0.05 — случайно значимой окажется ~1 из 10 (при α=0.05). Реши заранее: одна <b>первичная</b> метрика, остальные — вторичные (без корректировки на значимость).</p>

      <h4>3. Novelty effect (эффект новизны)</h4>
      <p>Пользователи реагируют на любое изменение только потому, что оно новое. Через неделю-две эффект исчезает. Решение: дождаться устойчивого сигнала, особенно для изменений в UX.</p>

      <h4>4. Selection bias (систематическая ошибка выборки)</h4>
      <p>Вариант B получают «лучшие» пользователи — например, только пользователи нового браузера, у которых конверсия изначально выше. Решение: рандомизируй на уровне пользователя, а не сессии, и проверяй балансировку групп (AA-тест перед AB).</p>

      <h4>5. Слишком маленькая выборка</h4>
      <p>Тест с 50 пользователями в группе, конверсией 5% и ожидаемым эффектом 1 п.п. — это не тест, это шум. Считай размер выборки до запуска, всегда.</p>

      <h4>6. Остановка как только победитель «найден» без учёта CI</h4>
      <p>p < 0.05 не означает «B лучше A на X%». Всегда смотри на доверительный интервал для разницы. Если CI содержит нуль — результат не окончательный.</p>

      <h3>🔬 AA-тесты</h3>
      <p><span class="term" data-tip="AA-тест — запуск A/B теста, где обе группы получают одинаковый вариант. Используется для проверки корректности системы рандомизации, логирования и анализа.">AA-тест</span> — это «тест теста». Ты показываешь обеим группам один и тот же вариант A и проверяешь, нет ли значимой разницы в метриках. Если p < 0.05 в AA-тесте — у тебя проблема с рандомизацией или системой учёта событий. Ни одному AB-тесту нельзя доверять, пока AA не пройден.</p>

      <div class="deep-dive">
        <summary>Подробнее: sequential testing — как «подглядывать» правильно</summary>
        <div class="deep-dive-body">
          <p>Иногда нельзя ждать до конца теста — нужно принять решение быстро. <b>Sequential testing</b> (последовательный анализ) позволяет проверять данные по ходу теста, сохраняя контроль над ошибкой I рода.</p>
          <p>Идеи за методом:</p>
          <ul>
            <li><b>Alpha-spending function</b> (Поккок, О'Брайен-Флеминг) — «расходует» α постепенно по промежуточным анализам, так что суммарная вероятность ложного срабатывания остаётся ≤ α.</li>
            <li><b>SPRT (Sequential Probability Ratio Test)</b> — Вальд (1945): на каждом шаге вычисляется отношение правдоподобия, тест останавливается при пересечении порога.</li>
            <li>Современные платформы (Optimizely, VWO) используют <b>Always-Valid p-values</b> — анytime-valid inference, позволяющую останавливаться в любой момент без инфляции ошибок.</li>
          </ul>
          <p><b>Цена</b>: увеличенный средний размер выборки по сравнению с фиксированным дизайном.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: multi-armed bandits как альтернатива A/B тесту</summary>
        <div class="deep-dive-body">
          <p>Классический A/B тест — «исследовательский»: сначала собираем данные, потом принимаем решение. Весь трафик делится поровну, даже если один вариант явно хуже.</p>
          <p><b>Multi-armed bandit (MAB)</b> — другой подход: алгоритм адаптивно перераспределяет трафик в пользу лучшего варианта по ходу теста. Основные алгоритмы:</p>
          <ul>
            <li><b>ε-greedy</b> — с вероятностью ε исследуем (случайный вариант), с 1-ε — эксплуатируем лучший.</li>
            <li><b>UCB (Upper Confidence Bound)</b> — выбираем вариант с наибольшей верхней оценкой.</li>
            <li><b>Thompson sampling</b> — байесовский подход: семплируем из апостериорного распределения каждого варианта.</li>
          </ul>
          <p><b>Когда MAB лучше A/B</b>: при высокой стоимости «плохого» варианта (медицина), коротком горизонте. <b>Когда A/B лучше</b>: когда важно строгое статистическое заключение, при длинных экспериментах.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Проверка гипотез</b> — теоретическая база всех тестов.</li>
        <li><b>z-тест</b> — для конверсий и бинарных метрик.</li>
        <li><b>t-тест</b> — для средних (выручка, время).</li>
        <li><b>Хи-квадрат</b> — для категориальных исходов.</li>
        <li><b>Байесовский подход</b> — альтернатива частотному A/B тесту.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Расчёт размера выборки',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Текущая конверсия кнопки «Оформить заказ» составляет <b>5%</b>. Продакт-менеджер считает изменение дизайна значимым, если конверсия вырастет хотя бы до <b>6%</b>. Сколько пользователей нужно в каждой группе? Используем α = 0.05, мощность 80% (β = 0.20), двусторонний тест.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Фиксируем параметры</h4>
            <div class="calc">p₁ = 0.05  (контроль, вариант A)
p₂ = 0.06  (ожидаемый эффект, вариант B)
MDE = p₂ − p₁ = 0.01  (1 процентный пункт)
α = 0.05  → z_{α/2} = z_{0.025} = 1.96
β = 0.20  → z_{β}   = z_{0.20}  = 0.84
Тест: двусторонний</div>
            <div class="why">Двусторонний тест — потому что нас интересует любое значимое отклонение (в обе стороны), а не только рост. Это более консервативный, но более распространённый выбор.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Вычисляем дисперсии каждой группы</h4>
            <div class="calc">Var(p₁) = p₁ · (1 − p₁) = 0.05 × 0.95 = 0.0475
Var(p₂) = p₂ · (1 − p₂) = 0.06 × 0.94 = 0.0564
Сумма дисперсий = 0.0475 + 0.0564 = <b>0.1039</b></div>
            <div class="why">Пропорция p распределена по биномиальному закону с дисперсией p·(1−p). В формуле расчёта n нам нужна суммарная дисперсия обеих групп, потому что мы анализируем разность двух пропорций.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Применяем формулу</h4>
            <div class="calc">n = (z_{α/2} + z_β)² × (Var₁ + Var₂) / (p₂ − p₁)²

n = (1.96 + 0.84)² × 0.1039 / (0.01)²
n = (2.80)² × 0.1039 / 0.0001
n = 7.84 × 0.1039 / 0.0001
n = 0.8146 / 0.0001
n = <b>8 146</b> на группу</div>
          </div>

          <div class="step" data-step="4">
            <h4>Итого и интерпретация</h4>
            <div class="calc">Всего пользователей: 8 146 × 2 = <b>16 292</b>
При трафике 1 000 пользователей/день: тест займёт ~16 дней</div>
            <p>Если ты остановишь тест раньше — у тебя не будет 80% вероятности обнаружить эффект в 1 п.п. Тест будет «маломощным» (underpowered).</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Нужно минимум <b>8 146 пользователей в каждой группе</b> (16 292 всего), чтобы с мощностью 80% обнаружить рост конверсии с 5% до 6% при α = 0.05.</p>
          </div>

          <div class="lesson-box">Чем меньше MDE (минимальный детектируемый эффект), тем больше нужна выборка. Для MDE = 0.5 п.п. нужно было бы ~32 000 человек в группе. Переход с 5% до 4.5% — это не маленькое изменение, это огромные данные.</div>
        `
      },
      {
        title: 'Выбор теста по типу метрики',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Продуктовая команда запускает одновременно несколько A/B тестов. Для каждого сценария нужно выбрать правильный статистический тест.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Сценарий 1: Новый экран онбординга</h4>
            <div class="calc">Метрика: конверсия в первую покупку (купил / не купил)
Данные: A: 500 чел, 35 купили (7%)
        B: 500 чел, 48 купили (9.6%)

Тип: бинарный исход (да/нет)
→ z-тест для пропорций</div>
            <div class="why">Конверсия — бинарная метрика: каждый пользователь либо купил, либо нет. Бинарные данные подчиняются биномиальному закону, для которого при n·p ≥ 5 применяют нормальное приближение (z-тест).</div>
          </div>

          <div class="step" data-step="2">
            <h4>Сценарий 2: Новый алгоритм рекомендаций</h4>
            <div class="calc">Метрика: средний чек (рублей)
Данные: A: n=300, x̄=1 250 руб, s=800 руб
        B: n=300, x̄=1 410 руб, s=950 руб
Тест Шапиро-Уилка: данные ненормальные (выбросы)
n достаточно большое (n=300 > 30)

Тип: непрерывная, ЦПТ применима при n=300
→ t-тест Уэлча (дисперсии неравны, σ_B > σ_A)</div>
            <div class="why">Средний чек — непрерывная метрика. Дисперсии в группах разные (800 vs 950), поэтому используем вариант Уэлча, а не стьюдентовский t-тест. При n=300 ЦПТ оправдывает нормальность среднего, даже если сами данные скошены.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Сценарий 3: Редизайн тарифной страницы</h4>
            <div class="calc">Метрика: выбранный тариф (Базовый / Стандарт / Премиум)
Данные:
       Базовый  Стандарт  Премиум
A:     140      80         30
B:     110      90         50

Тип: категориальный исход (3 категории)
→ Хи-квадрат тест независимости (2×3 таблица)</div>
            <div class="why">Тариф — категориальная переменная с 3 вариантами. z-тест работает только для двух долей. Хи-квадрат тест сравнивает наблюдаемые и ожидаемые (при отсутствии эффекта) частоты во всей таблице сразу.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сценарий 4: Оценка службы поддержки (NPS)</h4>
            <div class="calc">Метрика: NPS-оценка (1–10, целое число)
Данные: явно не нормальные, много 1 и 10
n = 120 в каждой группе

Тип: порядковая, нет нормальности, n умеренный
→ Критерий Манн-Уитни U (ранговый непараметрический)</div>
            <div class="why">NPS — порядковая шкала. Разница между «1» и «2» не обязательно равна разнице между «9» и «10». Манн-Уитни не предполагает нормальности и работает с рангами, что корректно для таких данных.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Итоговая таблица</div>
            <table>
              <tr><th>Сценарий</th><th>Тип метрики</th><th>Тест</th></tr>
              <tr><td>Онбординг → покупка</td><td>Бинарный</td><td><b>z-тест пропорций</b></td></tr>
              <tr><td>Средний чек</td><td>Непрерывный, σ разные</td><td><b>Welch t-тест</b></td></tr>
              <tr><td>Выбор тарифа (3 кат.)</td><td>Категориальный</td><td><b>Хи-квадрат</b></td></tr>
              <tr><td>NPS-оценка</td><td>Порядковый / ненормальный</td><td><b>Манн-Уитни U</b></td></tr>
            </table>
          </div>

          <div class="lesson-box">Нет одного «лучшего» теста для всех случаев. Сначала определи тип метрики (бинарная / непрерывная / категориальная), потом проверь предположения (нормальность, размер выборки) — и только тогда выбирай тест.</div>
        `
      },
      {
        title: 'Peeking problem — инфляция ошибки I рода',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Аналитик запустил A/B тест. H₀: p_A = p_B. Каждый день он проверяет p-value. Как только p < 0.05 — останавливает. Насколько это проблема? Покажем, что реальная ошибка I рода уже не равна 5%.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Теоретический аргумент</h4>
            <div class="calc">При одном тесте в конце: P(ложное срабатывание) = α = 0.05

При k = 20 последовательных тестах с одними данными:
P(хотя бы одно ложное срабатывание) = 1 − (1 − 0.05)^20 ≈ 0.64</div>
            <div class="why">Это грубое приближение (реальные тесты на одних данных не независимы), но оно показывает масштаб проблемы. На практике инфляция ошибки I рода при peeking составляет 15–40% вместо 5%.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Симуляция: тест при H₀ = верна (p_A = p_B = 0.05)</h4>
            <div class="calc">Генерируем 10 000 экспериментов:
  - n_max = 1000 в каждой группе, p_A = p_B = 0.05
  - Стратегия A: проверяем только в конце → ошибка I = 5.1% ✓
  - Стратегия B: проверяем каждые 50 наблюдений → ошибка I = 26.4% ✗
  - Стратегия C: проверяем каждые 10 наблюдений → ошибка I = 38.7% ✗</div>
            <p>Стратегия B даёт ошибку I рода в <b>5 раз выше</b> запланированной.</p>
          </div>

          <div class="step" data-step="3">
            <h4>Почему это происходит интуитивно</h4>
            <p>Представь: ты бросаешь монету 1000 раз. В какой-то момент случайно выпадет длинная серия орлов. Если ты остановишься в этот момент — покажется, что монета нечестная. Но если ждать до конца — случайные серии сглаживаются.</p>
            <div class="calc">При 20 промежуточных проверках каждый тест «тратит» часть α.
Чтобы сохранить суммарный α = 0.05 при 20 анализах,
каждый тест должен использовать α' ≈ 0.0026 (поправка Бонферрони).

Или использовать O'Brien-Fleming spending function:
  Анализ 1 (n=50):   α₁ = 0.0006
  Анализ 5 (n=250):  α₅ = 0.0143
  Финал (n=1000):    α₂₀ = 0.0458
  Итог: суммарный α = 0.05 ✓</div>
          </div>

          <div class="step" data-step="4">
            <h4>Практические решения</h4>
            <div class="calc">1. Зафиксировать n заранее и проверять ТОЛЬКО в конце.
2. Sequential testing с правильной α-spending function.
3. Always-valid p-values (mSPRT, e-values).
4. Байесовский подход — posterior probability обновляется корректно.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Вывод</div>
            <p>Peeking при α = 0.05 может дать реальную ошибку I рода <b>26–40%</b> вместо 5%. Это значит, что каждый четвёртый «значимый» результат — ложноположительный. Решение: фиксируй n заранее, либо используй sequential testing.</p>
          </div>

          <div class="lesson-box">Peeking — одна из самых частых причин нереплицируемых результатов A/B тестов в продуктах. «Я проверю ещё раз завтра» = риск принять неверное решение.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Калькулятор размера выборки</h3>
        <p>Меняй параметры и смотри, сколько пользователей нужно для обнаружения эффекта.</p>
        <div class="sim-container">
          <div class="sim-controls" id="abintro-controls"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="abintro-chart"></canvas></div>
            <div class="sim-stats" id="abintro-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#abintro-controls');
        const cBase = App.makeControl('range', 'abintro-base', 'Базовая конверсия %', { min: 1, max: 20, step: 0.5, value: 5 });
        const cMDE = App.makeControl('range', 'abintro-mde', 'MDE (мин. эффект) %', { min: 0.5, max: 5, step: 0.1, value: 1 });
        const cAlpha = App.makeControl('range', 'abintro-alpha', 'α', { min: 0.01, max: 0.1, step: 0.01, value: 0.05 });
        const cPower = App.makeControl('range', 'abintro-power', 'Мощность (1−β)', { min: 0.7, max: 0.99, step: 0.01, value: 0.8 });
        [cBase, cMDE, cAlpha, cPower].forEach(c => controls.appendChild(c.wrap));

        let chart = null;

        function zFromAlpha(a) { return a <= 0.01 ? 2.576 : a <= 0.025 ? 1.96 : a <= 0.05 ? 1.645 : 1.28; }
        function zFromPower(p) { return p >= 0.99 ? 2.326 : p >= 0.95 ? 1.645 : p >= 0.9 ? 1.282 : p >= 0.8 ? 0.842 : 0.524; }

        function run() {
          const p = +cBase.input.value / 100;
          const delta = +cMDE.input.value / 100;
          const alpha = +cAlpha.input.value;
          const power = +cPower.input.value;
          const za = zFromAlpha(alpha / 2);
          const zb = zFromPower(power);
          const n = Math.ceil(2 * p * (1 - p) * ((za + zb) / delta) ** 2);

          // Показываем n при разных MDE
          const mdes = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5].map(m => m / 100);
          const ns = mdes.map(d => Math.ceil(2 * p * (1 - p) * ((za + zb) / d) ** 2));

          const ctx = container.querySelector('#abintro-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: mdes.map(d => (d * 100).toFixed(1) + '%'),
              datasets: [{
                label: 'Размер выборки на группу',
                data: ns,
                backgroundColor: mdes.map(d => Math.abs(d - delta) < 0.001 ? 'rgba(59,130,246,0.8)' : 'rgba(59,130,246,0.3)'),
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'Размер выборки vs MDE' } },
              scales: { x: { title: { display: true, text: 'MDE' } }, y: { title: { display: true, text: 'n на группу' }, beginAtZero: true } },
            },
          });
          App.registerChart(chart);

          const days = Math.ceil(n * 2 / 1000);
          container.querySelector('#abintro-stats').innerHTML =
            '<div class="stat-card"><div class="stat-label">n на группу</div><div class="stat-value">' + n.toLocaleString() + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Всего участников</div><div class="stat-value">' + (n * 2).toLocaleString() + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Дней (при 1000/день)</div><div class="stat-value">' + days + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">MDE</div><div class="stat-value">' + cMDE.input.value + '%</div></div>';
        }

        [cBase, cMDE, cAlpha, cPower].forEach(c => c.input.addEventListener('input', run));
        run();
      },
    },

    python: `
      <h3>📊 Расчёт размера выборки</h3>
      <pre><code>from statsmodels.stats.power import NormalIndPower

power_analysis = NormalIndPower()

# Параметры: MDE, alpha, power
# effect_size = MDE / pooled_std (для пропорций ≈ MDE / sqrt(p*(1-p)))
baseline_cr = 0.10   # текущая конверсия 10%
mde = 0.02           # хотим увидеть +2 п.п. (до 12%)

# Для пропорций: effect_size (Cohen's h)
import numpy as np
h = 2 * np.arcsin(np.sqrt(baseline_cr + mde)) - 2 * np.arcsin(np.sqrt(baseline_cr))

n_per_group = power_analysis.solve_power(
    effect_size=h,
    alpha=0.05,       # уровень значимости
    power=0.80,       # мощность 80%
    alternative='two-sided'
)
print(f"Cohen's h: {h:.4f}")
print(f"Нужно на группу: {int(np.ceil(n_per_group))}")
print(f"Всего участников: {int(np.ceil(n_per_group)) * 2}")</code></pre>

      <h3>📈 График зависимости выборки от MDE</h3>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np
from statsmodels.stats.power import NormalIndPower

power_analysis = NormalIndPower()
baseline = 0.10

mde_range = np.arange(0.005, 0.06, 0.005)
sample_sizes = []

for mde in mde_range:
    h = 2 * np.arcsin(np.sqrt(baseline + mde)) - 2 * np.arcsin(np.sqrt(baseline))
    n = power_analysis.solve_power(effect_size=h, alpha=0.05, power=0.80)
    sample_sizes.append(int(np.ceil(n)))

plt.plot(mde_range * 100, sample_sizes, 'bo-')
plt.xlabel("MDE (процентные пункты)")
plt.ylabel("Размер выборки на группу")
plt.title("Размер выборки vs MDE (baseline=10%)")
plt.grid(alpha=0.3)
plt.show()</code></pre>

      <h3>🎯 Быстрая оценка длительности теста</h3>
      <pre><code># Сколько дней нужно для теста?
daily_traffic = 5000       # визитов в день
n_per_group = 3900         # из расчёта выше
n_groups = 2               # A и B
traffic_share = 1.0        # 100% трафика в тест

days = (n_per_group * n_groups) / (daily_traffic * traffic_share)
print(f"Нужно дней: {np.ceil(days):.0f}")
print(f"Рекомендация: минимум {max(7, int(np.ceil(days)))} дней")
print("(не менее 7 дней для учёта дня-недели эффекта)")</code></pre>
    `,

    math: `
      <h3>Ключевые формулы A/B тестирования</h3>

      <h4>Размер выборки (z-тест для пропорций)</h4>
      <div class="math-block">$$n = \\frac{(z_{\\alpha/2} + z_{\\beta})^2 \\cdot [p_1(1-p_1) + p_2(1-p_2)]}{(p_2 - p_1)^2}$$</div>
      <p>Стандартные значения: $z_{0.025} = 1.96$ (α=0.05), $z_{0.20} = 0.84$ (мощность 80%), $z_{0.10} = 1.28$ (мощность 90%).</p>

      <h4>Размер выборки (t-тест для средних)</h4>
      <div class="math-block">$$n = \\frac{2\\sigma^2 (z_{\\alpha/2} + z_{\\beta})^2}{\\delta^2}$$</div>
      <p>где $\\sigma$ — оценка стандартного отклонения, $\\delta = \\mu_2 - \\mu_1$ — MDE для среднего.</p>

      <h4>Поправка Бонферрони (множественные тесты)</h4>
      <div class="math-block">$$\\alpha' = \\frac{\\alpha}{m}$$</div>
      <p>где $m$ — число одновременно проверяемых гипотез. Используй, если тестируешь несколько первичных метрик одновременно.</p>

      <h4>Ошибки I и II рода</h4>
      <table>
        <tr><th></th><th>H₀ верна</th><th>H₀ ложна</th></tr>
        <tr><th>Отвергаем H₀</th><td>Ошибка I рода (α)</td><td>Верное решение (1−β)</td></tr>
        <tr><th>Не отвергаем H₀</th><td>Верное решение (1−α)</td><td>Ошибка II рода (β)</td></tr>
      </table>

      <h4>Мощность через нормальное приближение</h4>
      <div class="math-block">$$\\text{Power} = \\Phi\\!\\left(\\frac{|\\mu_1 - \\mu_2|\\sqrt{n}}{\\sigma\\sqrt{2}} - z_{\\alpha/2}\\right)$$</div>

      <h4>Доверительный интервал для разности пропорций</h4>
      <div class="math-block">$$(\\hat{p}_2 - \\hat{p}_1) \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}_1(1-\\hat{p}_1)}{n_1} + \\frac{\\hat{p}_2(1-\\hat{p}_2)}{n_2}}$$</div>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы A/B тестирования</h4>
          <ul>
            <li>Единственный способ установить причинно-следственную связь в продукте</li>
            <li>Контролируемый уровень ошибки I рода — знаем риск ложного срабатывания</li>
            <li>Принятие решений на данных, а не на интуиции</li>
            <li>Масштабируется: можно тестировать одновременно многие изменения</li>
            <li>Документирует историю продуктовых решений и их эффект</li>
            <li>Защита от HiPPO (Highest Paid Person's Opinion — мнение начальника вместо данных)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы и ограничения</h4>
          <ul>
            <li>Требует большого трафика — малые эффекты сложно детектировать</li>
            <li>Занимает время — тест нельзя останавливать раньше расчётного срока</li>
            <li>Только краткосрочный эффект — не ловит долгосрочные изменения поведения</li>
            <li>Не работает для rare events (события с частотой &lt;0.1%)</li>
            <li>Трудно тестировать системные изменения (редизайн, смена алгоритма рекомендаций целиком)</li>
            <li>Novelty effect — временное улучшение без реального долгосрочного эффекта</li>
            <li>Network effects — разделение пользователей нарушает независимость (соцсети)</li>
          </ul>
        </div>
      </div>
      <div class="callout tip">💡 A/B тест говорит «что» произошло, но не «почему». Качественные исследования (интервью, usability) объясняют механизм.</div>
      <div class="callout warn">⚠️ Три главных врага A/B теста: peeking (останавливаем рано), multiple metrics (тестируем всё подряд) и novelty effect (пользователи реагируют на новизну). Помни о них при каждом тесте.</div>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=lHI5oEgNkrk" target="_blank">StatQuest: Designing Experiments</a> — принципы экспериментального дизайна и рандомизации</li>
        <li><a href="https://www.youtube.com/watch?v=vemZtEM63GY" target="_blank">StatQuest: p-values, clearly explained</a> — понимание p-value в контексте A/B тестирования</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/designing-studies" target="_blank">Khan Academy: Designing studies</a> — контролируемые эксперименты, выборка и рандомизация</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=AB+%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5" target="_blank">Habr: A/B тестирование</a> — практические руководства по A/B тестам на Хабре</li>
        <li><a href="https://en.wikipedia.org/wiki/A/B_testing" target="_blank">Wikipedia: A/B testing</a> — обзор метода A/B тестирования</li>
      </ul>
      <h3>📚 Документация и инструменты</h3>
      <ul>
        <li><a href="https://www.evanmiller.org/ab-testing/sample-size.html" target="_blank">Evan Miller: Sample Size Calculator</a> — онлайн-калькулятор необходимого размера выборки для A/B теста</li>
        <li><a href="https://www.statsmodels.org/stable/stats.html#power-and-sample-size-calculations" target="_blank">statsmodels: Power and sample size</a> — расчёт мощности и размера выборки программно</li>
      </ul>
    `,
  },
});
