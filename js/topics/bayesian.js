/* ==========================================================================
   Байесовские модели
   ========================================================================== */
App.registerTopic({
  id: 'bayesian',
  category: 'ml-cls',
  title: 'Байесовские модели',
  summary: 'Теорема Байеса, Naive Bayes и байесовский подход к обучению.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты детектив. У тебя три подозреваемых в краже. <b>До</b> того, как ты начал расследование, все казались равно виновными (по 33%). Но ты нашёл улики: отпечаток пальца подозреваемого А, потом ложь в алиби, потом свидетеля, который его видел. Каждая улика <b>меняет</b> твою оценку: «А всё вероятнее виновен».</p>
        <p>Это и есть байесовский подход: у тебя есть <b>начальное мнение</b> (априорная вероятность), ты собираешь <b>доказательства</b> (данные), и с каждым новым фактом <b>обновляешь</b> своё мнение. Финальное мнение (апостериорная вероятность) — это синтез начального взгляда и всех данных.</p>
        <p>Теорема Байеса даёт формулу, как именно обновлять убеждения. Это одна из самых важных формул в статистике и машинном обучении.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <text x="260" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Байесовское обновление убеждений</text>
          <!-- Axes -->
          <line x1="40" y1="170" x2="490" y2="170" stroke="#64748b" stroke-width="1.5"/>
          <text x="265" y="190" text-anchor="middle" font-size="10" fill="#64748b">θ (параметр)</text>
          <!-- Prior curve (dashed) - wide, centered -->
          <path d="M50,165 C80,165 110,150 155,110 C185,83 210,55 260,48 C310,55 335,83 365,110 C410,150 440,165 470,165" fill="none" stroke="#818cf8" stroke-width="2" stroke-dasharray="7,4"/>
          <!-- Prior fill -->
          <path d="M50,165 C80,165 110,150 155,110 C185,83 210,55 260,48 C310,55 335,83 365,110 C410,150 440,165 470,165 L470,165 L50,165 Z" fill="#818cf8" fill-opacity="0.12"/>
          <!-- Posterior curve (solid) - narrower, shifted right -->
          <path d="M200,165 C220,165 240,158 270,130 C290,110 310,75 340,52 C355,42 365,42 375,52 C400,75 415,112 430,135 C450,158 465,165 490,165" fill="none" stroke="#6366f1" stroke-width="2.8"/>
          <!-- Posterior fill -->
          <path d="M200,165 C220,165 240,158 270,130 C290,110 310,75 340,52 C355,42 365,42 375,52 C400,75 415,112 430,135 C450,158 465,165 490,165 L490,165 L200,165 Z" fill="#6366f1" fill-opacity="0.15"/>
          <!-- Arrow from prior to posterior with label "данные" -->
          <line x1="270" y1="85" x2="330" y2="65" stroke="#f59e0b" stroke-width="2" marker-end="url(#bay_arr)"/>
          <text x="288" y="78" font-size="10" fill="#d97706" font-weight="600">данные</text>
          <!-- Labels -->
          <text x="175" y="42" font-size="10" fill="#818cf8" font-weight="600">Prior</text>
          <text x="178" y="55" font-size="9" fill="#818cf8">(до данных)</text>
          <text x="415" y="42" font-size="10" fill="#6366f1" font-weight="600">Posterior</text>
          <text x="415" y="55" font-size="9" fill="#6366f1">(после данных)</text>
          <!-- Legend lines -->
          <line x1="40" y1="197" x2="70" y2="197" stroke="#818cf8" stroke-width="2" stroke-dasharray="6,3"/>
          <text x="76" y="200" font-size="9" fill="#334155">Prior P(θ)</text>
          <line x1="160" y1="197" x2="190" y2="197" stroke="#6366f1" stroke-width="2.5"/>
          <text x="196" y="200" font-size="9" fill="#334155">Posterior P(θ|D)</text>
          <defs>
            <marker id="bay_arr" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">Байесовское обновление: пунктирная кривая (prior) — начальное убеждение до данных. Сплошная кривая (posterior) — после наблюдения данных. Стрелка показывает сдвиг и уточнение оценки.</div>
      </div>

      <h3>🔢 Теорема Байеса</h3>
      <p>Главная формула:</p>
      <div class="math-block">$$P(H \\mid D) = \\frac{P(D \\mid H) \\cdot P(H)}{P(D)}$$</div>

      <p>Где:</p>
      <ul>
        <li>$P(H)$ — <span class="term" data-tip="Prior. Априорная вероятность. То, что мы думали о гипотезе ДО того, как увидели данные.">prior (априорная)</span> — начальное убеждение до данных.</li>
        <li>$P(D \\mid H)$ — <span class="term" data-tip="Likelihood. Правдоподобие. Вероятность увидеть такие данные при данной гипотезе.">likelihood (правдоподобие)</span> — насколько данные объясняются гипотезой.</li>
        <li>$P(H \\mid D)$ — <span class="term" data-tip="Posterior. Апостериорная вероятность. Обновлённое убеждение после учёта данных.">posterior (апостериорная)</span> — обновлённое убеждение после данных.</li>
        <li>$P(D)$ — <span class="term" data-tip="Evidence. Свидетельство. Вероятность данных во всех возможных гипотезах. Нужна для нормировки.">evidence</span> — нормировочная константа.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Байесовский подход — это <b>обновление убеждений на основе данных</b>. Начинаем с какого-то мнения, получаем новую информацию, применяем формулу Байеса → получаем обновлённое мнение. Повторяем бесконечно.</p>
      </div>

      <h3>🏥 Знаменитый пример: тест на болезнь</h3>
      <p>Болезнь у 1% населения. Тест точный: 99% чувствительность, 95% специфичность. Тест положительный — какова вероятность болезни?</p>

      <p>Большинство интуитивно ответят «~95-99%». Правильный ответ — <b>16.7%</b>. Вот почему:</p>
      <ul>
        <li>Prior: P(болен) = 0.01.</li>
        <li>Likelihood: P(тест+ | болен) = 0.99, P(тест+ | здоров) = 0.05.</li>
        <li>P(тест+) = 0.99·0.01 + 0.05·0.99 = 0.0594.</li>
        <li>P(болен | тест+) = (0.99·0.01) / 0.0594 ≈ <b>0.167</b>.</li>
      </ul>

      <p>Урок: даже точный тест даёт много ложных срабатываний, когда болезнь <b>редкая</b>. Prior критически важен.</p>

      <h3>🤖 Naive Bayes классификатор</h3>
      <p>Простая, но эффективная модель классификации. Хотим найти класс с максимальной вероятностью:</p>
      <div class="math-block">$$\\hat{c} = \\arg\\max_c P(c \\mid x_1, \\ldots, x_p)$$</div>

      <p>По Байесу:</p>
      <div class="math-block">$$P(c \\mid x) \\propto P(c) \\cdot P(x_1, \\ldots, x_p \\mid c)$$</div>

      <p>Проблема: $P(x_1, \\ldots, x_p \\mid c)$ — совместное распределение признаков — сложно оценить. Нужно огромное количество данных.</p>

      <p><b>Naive Bayes делает сильное упрощение:</b> предполагает <b>независимость</b> признаков внутри класса:</p>
      <div class="math-block">$$P(x_1, \\ldots, x_p \\mid c) \\approx \\prod_{j=1}^{p} P(x_j \\mid c)$$</div>

      <p>И теперь:</p>
      <div class="math-block">$$\\hat{c} = \\arg\\max_c P(c) \\prod_{j=1}^{p} P(x_j \\mid c)$$</div>

      <p>Каждый $P(x_j \\mid c)$ легко оценить отдельно. Модель становится простой и быстрой.</p>

      <h3>🔍 Почему «naive» (наивный)?</h3>
      <p>Предположение независимости признаков — <b>почти всегда неверно</b>. В тексте слова зависят друг от друга, в медицине симптомы коррелируют. Но удивительно: даже при нарушении этого предположения Naive Bayes часто <b>работает хорошо</b>.</p>
      <p>Причина: для классификации нам важно не точно оценить вероятности, а лишь <b>ранжировать</b> классы. Ошибки в абсолютных значениях не так страшны, если порядок классов сохранён.</p>

      <h3>📐 Варианты Naive Bayes</h3>

      <h4>Gaussian Naive Bayes</h4>
      <p>Для непрерывных признаков. Предполагает, что $P(x_j \\mid c)$ — нормальное распределение:</p>
      <div class="math-block">$$P(x_j \\mid c) = \\frac{1}{\\sqrt{2\\pi\\sigma_{c,j}^2}} \\exp\\left(-\\frac{(x_j - \\mu_{c,j})^2}{2\\sigma_{c,j}^2}\\right)$$</div>

      <h4>Multinomial Naive Bayes</h4>
      <p>Для счётчиков. Классический выбор для текстов (bag-of-words):</p>
      <div class="math-block">$$P(x_j \\mid c) = \\frac{N_{c,j} + \\alpha}{N_c + \\alpha V}$$</div>
      <p>$\\alpha$ — сглаживание Лапласа (обычно α = 1), V — размер словаря.</p>

      <h4>Bernoulli Naive Bayes</h4>
      <p>Для бинарных признаков (слово есть / нет). Применяется в задачах спам-фильтрации.</p>

      <h4>Complement Naive Bayes</h4>
      <p>Модификация Multinomial для несбалансированных данных. Часто работает лучше.</p>

      <h3>🔧 Laplace smoothing</h3>
      <p>Классическая проблема: если слово «купить» не встретилось ни разу в классе «не-спам», то $P(\\text{купить} \\mid \\text{не-спам}) = 0$. Тогда произведение <b>всё</b> зануляется — модель теряет информацию из других слов.</p>
      <p>Решение: добавляем 1 к счётчикам:</p>
      <div class="math-block">$$P(x_j \\mid c) = \\frac{N_{c,j} + 1}{N_c + V}$$</div>
      <p>Это называется <span class="term" data-tip="Laplace smoothing. Добавление псевдосчётов ко всем признакам, чтобы избежать нулевых вероятностей. В общем случае — добавление α (add-α smoothing).">сглаживанием Лапласа</span> (или add-one smoothing).</p>

      <h3>🎲 Байесовский ML более широко</h3>
      <p>Байесовский подход — это не только Naive Bayes. Это целая парадигма в ML:</p>

      <h4>Три способа оценки параметров</h4>
      <ul>
        <li><b>MLE (Maximum Likelihood):</b> $\\hat{\\theta} = \\arg\\max P(D \\mid \\theta)$. Игнорирует prior.</li>
        <li><b>MAP (Maximum a Posteriori):</b> $\\hat{\\theta} = \\arg\\max P(\\theta \\mid D)$. Использует prior, даёт одну оценку.</li>
        <li><b>Full Bayes:</b> работаем с распределением $P(\\theta \\mid D)$ целиком. Дороже, но даёт uncertainty.</li>
      </ul>

      <p>Связь с регуляризацией: MAP с гауссовским prior = L2-регуляризация, с Laplace prior = L1-регуляризация.</p>

      <h3>📊 Сопряжённые распределения</h3>
      <p>Если prior и likelihood в специальных «сопряжённых» семействах, posterior имеет тот же вид, что prior:</p>
      <table>
        <tr><th>Likelihood</th><th>Prior</th><th>Posterior</th></tr>
        <tr><td>Bernoulli / Binomial</td><td>Beta</td><td>Beta</td></tr>
        <tr><td>Multinomial</td><td>Dirichlet</td><td>Dirichlet</td></tr>
        <tr><td>Normal (μ)</td><td>Normal</td><td>Normal</td></tr>
        <tr><td>Poisson</td><td>Gamma</td><td>Gamma</td></tr>
      </table>

      <p>Удобно: обновление сводится к изменению нескольких параметров. Без сопряжённости нужны численные методы (MCMC, Variational Inference).</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы Naive Bayes:</b></p>
      <ul>
        <li><b>Очень быстрый</b> в обучении и предсказании.</li>
        <li>Работает на <b>маленьких</b> датасетах.</li>
        <li>Отлично для <b>текстов</b>.</li>
        <li>Естественно multi-class.</li>
        <li>Устойчив к нерелевантным признакам.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Независимость признаков</b> — сильное упрощение.</li>
        <li>Плохо <b>калиброванные</b> вероятности.</li>
        <li>Не ловит взаимодействия признаков.</li>
        <li>Часто уступает более сложным моделям.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Naive Bayes плох из-за наивности»</b> — часто даёт качество сравнимое с логрегом, быстрее в разы.</li>
        <li><b>«Вероятности Naive Bayes надёжны»</b> — нет, они плохо откалиброваны (обычно слишком уверенные).</li>
        <li><b>«Байесовский подход только для Naive Bayes»</b> — напротив, это целая парадигма: prior/posterior везде.</li>
        <li><b>«Frequentist vs Bayesian — религиозная война»</b> — на практике используют оба подхода.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: log-space для численной стабильности</summary>
        <div class="deep-dive-body">
          <p>Произведение многих маленьких вероятностей быстро становится чрезвычайно малым и вызывает <span class="term" data-tip="Underflow. Численное переполнение в сторону нуля: произведение многих маленьких чисел становится неотличимым от нуля в представлении float.">underflow</span>. Решение — работать в логарифмах:</p>
          <div class="math-block">$$\\log P(c \\mid x) = \\log P(c) + \\sum_j \\log P(x_j \\mid c) - \\log P(x)$$</div>
          <p>Сумма логов вместо произведения вероятностей — численно устойчиво.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: frequentist vs Bayesian</summary>
        <div class="deep-dive-body">
          <p>Два подхода к статистике:</p>
          <table>
            <tr><th></th><th>Frequentist</th><th>Bayesian</th></tr>
            <tr><td>Параметр θ</td><td>Фиксирован, но неизвестен</td><td>Случайная величина</td></tr>
            <tr><td>Данные</td><td>Случайные</td><td>Фиксированы</td></tr>
            <tr><td>«Интервал»</td><td>Доверительный (<a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">CI</a>)</td><td>Credible Interval</td></tr>
            <tr><td>Prior</td><td>Нет</td><td>Обязателен</td></tr>
            <tr><td>Вывод</td><td>p-value</td><td>P(θ | data)</td></tr>
          </table>
          <p>На практике каждый подход даёт свои преимущества. Байесовский выигрывает при малых данных и когда есть экспертное знание.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: численные методы</summary>
        <div class="deep-dive-body">
          <p>Когда posterior нельзя посчитать аналитически:</p>
          <ul>
            <li><b>MCMC</b> (Markov Chain Monte Carlo) — семплируем из posterior. PyMC, Stan.</li>
            <li><b>Variational Inference</b> — приближаем posterior параметризованным распределением, оптимизируя KL-дивергенцию.</li>
            <li><b>Gibbs Sampling</b> — для моделей с условными сопряжёнными.</li>
            <li><b>HMC / NUTS</b> — современные MCMC методы.</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Регуляризация</b> — L2 = Gaussian prior, L1 = Laplace prior.</li>
        <li><b>Распределения</b> — байесовские модели используют их как блоки.</li>
        <li><b>Проверка гипотез</b> — байесовская альтернатива p-value.</li>
        <li><b>A/B тесты</b> — можно делать байесовски, получая вероятности напрямую.</li>
        <li><b>Байесовская оптимизация</b> — подбор гиперпараметров моделей.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Тест на болезнь: полный Байес',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Болезнь встречается у 1% населения. Тест: чувствительность 99%, специфичность 95%. Человек получил положительный тест. Какова реальная вероятность болезни? Затем — <b>второй тест</b> тоже положительный. Как обновляется вероятность?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1. Априорные вероятности (prior)</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Параметр</th><th>Обозначение</th><th>Значение</th><th>Смысл</th></tr>
                <tr><td>Заболеваемость</td><td>P(sick)</td><td>0.01</td><td>1 из 100 болен</td></tr>
                <tr><td>Здоровые</td><td>P(healthy)</td><td>0.99</td><td>99 из 100 здоровы</td></tr>
              </table>
            </div>
            <div class="why">Prior — это то, что мы знаем <b>до</b> теста. 1% — это prevalence болезни в популяции. Это ключевое число, которое определяет всё дальнейшее.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2. Likelihood (правдоподобие теста)</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Параметр</th><th>Обозначение</th><th>Значение</th><th>Смысл</th></tr>
                <tr><td>Чувствительность</td><td>P(test+|sick)</td><td>0.99</td><td>Тест верно находит 99% больных</td></tr>
                <tr><td>Ложно-отриц.</td><td>P(test−|sick)</td><td>0.01</td><td>1% больных пропускает</td></tr>
                <tr><td>Ложно-полож.</td><td>P(test+|healthy)</td><td>0.05</td><td>5% здоровых получают «+»</td></tr>
                <tr><td>Специфичность</td><td>P(test−|healthy)</td><td>0.95</td><td>Тест верно определяет 95% здоровых</td></tr>
              </table>
            </div>
            <div class="why">Likelihood — это P(данные | гипотеза). Тест «хороший»: 99% чувствительность и 95% специфичность. Но при редкой болезни 5% FPR создаёт проблему.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3. Дерево вероятностей: 10 000 человек</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 500 185" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
                <text x="250" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Дерево вероятностей: 10 000 человек</text>
                <!-- Root -->
                <rect x="15" y="48" width="70" height="30" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
                <text x="50" y="62" text-anchor="middle" font-size="10" font-weight="700" fill="#3730a3">10 000</text>
                <text x="50" y="74" text-anchor="middle" font-size="8" fill="#6366f1">человек</text>
                <!-- Branch sick -->
                <line x1="85" y1="55" x2="150" y2="40" stroke="#ef4444" stroke-width="1.5"/>
                <text x="118" y="38" font-size="8" fill="#ef4444">P=0.01</text>
                <!-- Branch healthy -->
                <line x1="85" y1="70" x2="150" y2="120" stroke="#10b981" stroke-width="1.5"/>
                <text x="118" y="110" font-size="8" fill="#10b981">P=0.99</text>
                <!-- Sick box -->
                <rect x="150" y="24" width="70" height="32" rx="6" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
                <text x="185" y="39" text-anchor="middle" font-size="10" font-weight="700" fill="#991b1b">100</text>
                <text x="185" y="51" text-anchor="middle" font-size="8" fill="#ef4444">больных</text>
                <!-- Healthy box -->
                <rect x="150" y="106" width="70" height="32" rx="6" fill="#d1fae5" stroke="#10b981" stroke-width="1.5"/>
                <text x="185" y="121" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">9 900</text>
                <text x="185" y="133" text-anchor="middle" font-size="8" fill="#10b981">здоровых</text>
                <!-- Sick → TP -->
                <line x1="220" y1="35" x2="280" y2="26" stroke="#ef4444" stroke-width="1.5"/>
                <text x="250" y="22" font-size="7" fill="#ef4444">P(+|D)=0.99</text>
                <rect x="280" y="14" width="65" height="26" rx="5" fill="#ef4444"/>
                <text x="312" y="27" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">99 TP</text>
                <text x="312" y="37" text-anchor="middle" font-size="7" fill="#fecaca">тест +</text>
                <!-- Sick → FN -->
                <line x1="220" y1="45" x2="280" y2="55" stroke="#94a3b8" stroke-width="1"/>
                <text x="250" y="56" font-size="7" fill="#94a3b8">P(−|D)=0.01</text>
                <rect x="280" y="46" width="65" height="20" rx="4" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1"/>
                <text x="312" y="59" text-anchor="middle" font-size="8" fill="#64748b">1 FN</text>
                <!-- Healthy → FP -->
                <line x1="220" y1="115" x2="280" y2="100" stroke="#f59e0b" stroke-width="1.5"/>
                <text x="250" y="100" font-size="7" fill="#f59e0b">P(+|¬D)=0.05</text>
                <rect x="280" y="88" width="65" height="26" rx="5" fill="#fbbf24"/>
                <text x="312" y="101" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">495 FP</text>
                <text x="312" y="111" text-anchor="middle" font-size="7" fill="#78350f">тест +</text>
                <!-- Healthy → TN -->
                <line x1="220" y1="130" x2="280" y2="140" stroke="#10b981" stroke-width="1.5"/>
                <text x="250" y="145" font-size="7" fill="#10b981">P(−|¬D)=0.95</text>
                <rect x="280" y="130" width="70" height="22" rx="4" fill="#d1fae5" stroke="#10b981" stroke-width="1"/>
                <text x="315" y="145" text-anchor="middle" font-size="9" fill="#065f46">9 405 TN</text>
                <!-- Summary box -->
                <rect x="370" y="50" width="120" height="70" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
                <text x="430" y="68" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e">Все тест+:</text>
                <text x="430" y="82" text-anchor="middle" font-size="9" fill="#92400e">99 + 495 = 594</text>
                <text x="430" y="100" text-anchor="middle" font-size="10" font-weight="700" fill="#ef4444">PPV = 99/594</text>
                <text x="430" y="114" text-anchor="middle" font-size="11" font-weight="700" fill="#ef4444">= 16.7%</text>
              </svg>
              <div class="caption">Из 10 000 человек: 594 получат тест+. Из них только 99 реально больны (16.7%). Остальные 495 — ложная тревога.</div>
            </div>
            <div class="calc">
              Считаем по ветвям дерева:<br>
              Больных: $10000 \\times 0{,}01 = \\mathbf{100}$<br>
              Здоровых: $10000 \\times 0{,}99 = \\mathbf{9900}$<br><br>
              TP (больны, тест+): $100 \\times 0{,}99 = \\mathbf{99}$<br>
              FN (больны, тест−): $100 \\times 0{,}01 = \\mathbf{1}$<br>
              FP (здоровы, тест+): $9900 \\times 0{,}05 = \\mathbf{495}$<br>
              TN (здоровы, тест−): $9900 \\times 0{,}95 = \\mathbf{9405}$
            </div>
            <div class="why">Ключевое наблюдение: 495 ложных тревог vs 99 реальных больных. FP в 5 раз больше TP! Причина: здоровых (9900) в 99 раз больше, чем больных (100).</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4. Вычисляем P(test+): полная вероятность</h4>
            <div class="calc">
              $P(\\text{test}+) = P(+|\\text{sick}) \\cdot P(\\text{sick}) + P(+|\\text{healthy}) \\cdot P(\\text{healthy})$<br><br>
              $= 0{,}99 \\times 0{,}01 + 0{,}05 \\times 0{,}99$<br><br>
              $= 0{,}0099 + 0{,}0495 = \\mathbf{0{,}0594}$<br><br>
              Или по дереву: $594 / 10000 = 0{,}0594$ — то же самое!
            </div>
            <div class="why">5,94% людей получат положительный тест. Это знаменатель формулы Байеса — нормировочная константа.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5. Формула Байеса: P(sick | test+)</h4>
            <div class="calc">
              $P(\\text{sick}|+) = \\dfrac{P(+|\\text{sick}) \\cdot P(\\text{sick})}{P(+)}$<br><br>
              $= \\dfrac{0{,}99 \\times 0{,}01}{0{,}0594}$<br><br>
              $= \\dfrac{0{,}0099}{0{,}0594} = \\mathbf{0{,}1667 \\approx 16{,}7\\%}$<br><br>
              Или по дереву: $99 / (99 + 495) = 99 / 594 = 0{,}1667$ — то же самое!
            </div>
            <div class="why">Шокирующий результат: тест «99% точный», но при положительном результате вероятность болезни лишь 16,7%! Причина: prior P(sick) = 1% слишком мал — большинство «+» это FP.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6. Второй тест: обновляем prior!</h4>
            <div class="calc">
              После первого теста: $P(\\text{sick}) = 0{,}167$ (это новый prior!)<br>
              $P(\\text{healthy}) = 1 - 0{,}167 = 0{,}833$<br><br>
              Второй тест тоже «+»:<br>
              $P(+) = 0{,}99 \\times 0{,}167 + 0{,}05 \\times 0{,}833$<br>
              $= 0{,}1653 + 0{,}0417 = 0{,}2070$<br><br>
              $P(\\text{sick}|++) = \\dfrac{0{,}99 \\times 0{,}167}{0{,}2070} = \\dfrac{0{,}1653}{0{,}2070} = \\mathbf{0{,}799 \\approx 80\\%}$
            </div>
            <div class="why">Два положительных теста: вероятность выросла с 1% → 16,7% → 80%! Каждый тест обновляет prior. Это и есть <b>байесовское обновление</b>: posterior первого шага становится prior для следующего.</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Момент</th><th>Prior P(sick)</th><th>Тест</th><th>Posterior P(sick)</th></tr>
              <tr><td>До тестов</td><td>0.010 (1%)</td><td>—</td><td>0.010</td></tr>
              <tr><td>После 1-го теста +</td><td>0.010</td><td>+</td><td><b>0.167 (16.7%)</b></td></tr>
              <tr><td>После 2-го теста +</td><td>0.167</td><td>+</td><td><b>0.799 (80%)</b></td></tr>
            </table>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>P(sick | 1 тест+) = 16,7%. P(sick | 2 теста+) = 80%. При редкой болезни один тест недостаточен — нужен повторный. Формула Байеса: $P(H|D) = P(D|H) \\cdot P(H) / P(D)$.</p>
          </div>

          <div class="lesson-box">
            <b>Почему врачи назначают повторные тесты:</b> PPV зависит от prevalence. При P(sick)=1%: PPV=16.7%. При P(sick)=50%: PPV=95%. Повторный тест повышает «эффективный prior» и резко улучшает PPV. Массовый скрининг редких болезней без повторных тестов — плохая идея.
          </div>
        `,
      },
      {
        title: 'Naive Bayes для 3 писем',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>3 обучающих письма, словарь из 5 слов. Обучить Naive Bayes <b>с нуля</b>, используя Laplace smoothing ($\\alpha = 1$). Затем классифицировать новое письмо «деньги бесплатно».</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1. Обучающие данные: 3 письма</h4>
            <div class="example-data-table">
              <table>
                <tr><th>№</th><th>Текст</th><th>Класс</th></tr>
                <tr><td>1</td><td>«деньги акция бесплатно»</td><td>спам</td></tr>
                <tr><td>2</td><td>«встреча проект завтра»</td><td>хам</td></tr>
                <tr><td>3</td><td>«деньги проект акция»</td><td>спам</td></tr>
              </table>
            </div>
            <div class="calc">
              Словарь $V$: {деньги, акция, бесплатно, встреча, проект, завтра} → $|V| = 6$<br>
              Спам: 2 письма (№1, №3). Хам: 1 письмо (№2).<br>
              P(спам) = 2/3 = 0.667, P(хам) = 1/3 = 0.333
            </div>
            <div class="why">Prior основан на частоте классов в обучении. 2 из 3 писем — спам, поэтому P(спам) > P(хам). В реальности prior обычно 50/50 или подбирается.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2. Считаем частоты слов по классам</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Слово</th><th>count(спам)</th><th>count(хам)</th></tr>
                <tr><td>деньги</td><td>2</td><td>0</td></tr>
                <tr><td>акция</td><td>2</td><td>0</td></tr>
                <tr><td>бесплатно</td><td>1</td><td>0</td></tr>
                <tr><td>встреча</td><td>0</td><td>1</td></tr>
                <tr><td>проект</td><td>1</td><td>1</td></tr>
                <tr><td>завтра</td><td>0</td><td>1</td></tr>
                <tr><td><b>Всего слов</b></td><td><b>6</b></td><td><b>3</b></td></tr>
              </table>
            </div>
            <div class="why">Проблема: «бесплатно» встречается 0 раз в хаме → P(бесплатно|хам) = 0 → всё произведение = 0. Нужен Laplace smoothing!</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3. Laplace smoothing: $P(w|c) = \\dfrac{\\text{count}(w,c) + \\alpha}{\\text{total}(c) + \\alpha \\cdot |V|}$</h4>
            <div class="calc">
              $\\alpha = 1$ (добавляем 1 «виртуальное» вхождение каждого слова)<br>
              $|V| = 6$ слов в словаре<br><br>
              <b>Для спама:</b> знаменатель = $6 + 1 \\times 6 = 12$<br>
              $P(\\text{деньги}|\\text{спам}) = (2+1)/12 = 3/12 = \\mathbf{0{,}250}$<br>
              $P(\\text{акция}|\\text{спам}) = (2+1)/12 = 3/12 = \\mathbf{0{,}250}$<br>
              $P(\\text{бесплатно}|\\text{спам}) = (1+1)/12 = 2/12 = \\mathbf{0{,}167}$<br>
              $P(\\text{встреча}|\\text{спам}) = (0+1)/12 = 1/12 = \\mathbf{0{,}083}$<br>
              $P(\\text{проект}|\\text{спам}) = (1+1)/12 = 2/12 = \\mathbf{0{,}167}$<br>
              $P(\\text{завтра}|\\text{спам}) = (0+1)/12 = 1/12 = \\mathbf{0{,}083}$
            </div>
            <div class="calc">
              <b>Для хама:</b> знаменатель = $3 + 1 \\times 6 = 9$<br>
              $P(\\text{деньги}|\\text{хам}) = (0+1)/9 = 1/9 = \\mathbf{0{,}111}$<br>
              $P(\\text{акция}|\\text{хам}) = (0+1)/9 = 1/9 = \\mathbf{0{,}111}$<br>
              $P(\\text{бесплатно}|\\text{хам}) = (0+1)/9 = 1/9 = \\mathbf{0{,}111}$<br>
              $P(\\text{встреча}|\\text{хам}) = (1+1)/9 = 2/9 = \\mathbf{0{,}222}$<br>
              $P(\\text{проект}|\\text{хам}) = (1+1)/9 = 2/9 = \\mathbf{0{,}222}$<br>
              $P(\\text{завтра}|\\text{хам}) = (1+1)/9 = 2/9 = \\mathbf{0{,}222}$
            </div>
            <div class="why">Laplace smoothing ($\\alpha=1$): все нулевые вероятности стали ненулевыми. Без smoothing любое слово, не встреченное в классе, «убивает» весь класс (произведение = 0).</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4. Сводная таблица вероятностей</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Слово</th><th>P(w|спам)</th><th>P(w|хам)</th><th>Ratio спам/хам</th></tr>
                <tr><td>деньги</td><td>0.250</td><td>0.111</td><td>2.25x</td></tr>
                <tr><td>акция</td><td>0.250</td><td>0.111</td><td>2.25x</td></tr>
                <tr><td>бесплатно</td><td>0.167</td><td>0.111</td><td>1.50x</td></tr>
                <tr><td>встреча</td><td>0.083</td><td>0.222</td><td>0.38x</td></tr>
                <tr><td>проект</td><td>0.167</td><td>0.222</td><td>0.75x</td></tr>
                <tr><td>завтра</td><td>0.083</td><td>0.222</td><td>0.38x</td></tr>
              </table>
            </div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5. Классифицируем: «деньги бесплатно»</h4>
            <div class="calc">
              <b>Наивное предположение:</b> слова независимы внутри класса.<br><br>
              $P(\\text{«деньги бесплатно»}|\\text{спам}) = P(\\text{деньги}|\\text{спам}) \\times P(\\text{бесплатно}|\\text{спам})$<br>
              $= 0{,}250 \\times 0{,}167 = \\mathbf{0{,}04175}$<br><br>

              $P(\\text{«деньги бесплатно»}|\\text{хам}) = P(\\text{деньги}|\\text{хам}) \\times P(\\text{бесплатно}|\\text{хам})$<br>
              $= 0{,}111 \\times 0{,}111 = \\mathbf{0{,}01232}$
            </div>
            <div class="why">Likelihood для спама в ~3.4 раза выше. Но нужно ещё учесть prior!</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6. Применяем Байес: posterior</h4>
            <div class="calc">
              $P(\\text{спам}|x) \\propto P(x|\\text{спам}) \\cdot P(\\text{спам})$<br>
              $= 0{,}04175 \\times 0{,}667 = \\mathbf{0{,}02785}$<br><br>

              $P(\\text{хам}|x) \\propto P(x|\\text{хам}) \\cdot P(\\text{хам})$<br>
              $= 0{,}01232 \\times 0{,}333 = \\mathbf{0{,}00410}$<br><br>

              <b>Нормировка:</b> $Z = 0{,}02785 + 0{,}00410 = 0{,}03195$<br><br>

              $P(\\text{спам}|x) = 0{,}02785 / 0{,}03195 = \\mathbf{0{,}872 \\approx 87{,}2\\%}$<br>
              $P(\\text{хам}|x) = 0{,}00410 / 0{,}03195 = \\mathbf{0{,}128 \\approx 12{,}8\\%}$
            </div>
            <div class="why">87,2% вероятность спама. «Деньги» и «бесплатно» — оба слова сильнее ассоциированы со спамом, плюс prior 2/3 тоже в пользу спама.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7. Проверка в log-пространстве (для длинных текстов)</h4>
            <div class="calc">
              $\\log P(\\text{спам}|x) \\propto \\log P(\\text{спам}) + \\log P(\\text{деньги}|\\text{спам}) + \\log P(\\text{бесплатно}|\\text{спам})$<br>
              $= \\ln(0{,}667) + \\ln(0{,}250) + \\ln(0{,}167)$<br>
              $= -0{,}405 + (-1{,}386) + (-1{,}792) = \\mathbf{-3{,}583}$<br><br>

              $\\log P(\\text{хам}|x) \\propto \\ln(0{,}333) + \\ln(0{,}111) + \\ln(0{,}111)$<br>
              $= -1{,}099 + (-2{,}198) + (-2{,}198) = \\mathbf{-5{,}495}$<br><br>

              Разница: $-3{,}583 - (-5{,}495) = 1{,}912$<br>
              Спам в $e^{1{,}912} \\approx 6{,}8$ раз вероятнее хама.
            </div>
            <div class="why">В log-пространстве произведения → суммы. Это предотвращает underflow при длинных текстах (десятки слов → произведение стремится к 0).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>«деньги бесплатно» → P(спам) = 87,2%. Naive Bayes с Laplace smoothing ($\\alpha=1$): 3 письма, 6 слов в словаре — и классификатор уже работает. В log-пространстве: спам в 6,8 раз вероятнее хама.</p>
          </div>

          <div class="lesson-box">
            <b>Naive Bayes на практике:</b> 1) Всегда используйте Laplace smoothing ($\\alpha=1$ или $\\alpha=0{,}1$). 2) Работайте в log-пространстве. 3) «Наивность» (независимость слов) — грубое допущение, но NB удивительно хорошо работает для текстов, особенно при малом количестве данных.
          </div>
        `,
      },
      {
        title: 'Beta posterior обновление',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Монета: prior Beta(2, 2) (слабое предположение о «честности»). Наблюдаем 10 бросков: 7 орлов, 3 решки. Вычислить posterior, E[p], mode, и 95% credible interval. Показать сдвиг распределения.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1. Prior: Beta(2, 2) — что это значит?</h4>
            <div class="calc">
              Beta($\\alpha$, $\\beta$) — распределение на [0, 1]<br>
              $\\alpha = 2$ — «виртуальных орлов», $\\beta = 2$ — «виртуальных решек»<br><br>
              $E[p] = \\dfrac{\\alpha}{\\alpha + \\beta} = \\dfrac{2}{2+2} = \\mathbf{0{,}500}$<br><br>
              $\\text{Mode}[p] = \\dfrac{\\alpha - 1}{\\alpha + \\beta - 2} = \\dfrac{1}{2} = \\mathbf{0{,}500}$<br><br>
              $\\text{Var}[p] = \\dfrac{\\alpha \\beta}{(\\alpha+\\beta)^2(\\alpha+\\beta+1)} = \\dfrac{4}{16 \\cdot 5} = \\mathbf{0{,}050}$<br>
              $\\text{Std}[p] = \\sqrt{0{,}050} = 0{,}224$
            </div>
            <div class="why">Beta(2,2) — слабый prior: «мы немного верим, что монета честная (p ≈ 0.5), но легко изменим мнение при данных». Сила prior = $\\alpha + \\beta = 4$ (эквивалент 4 «виртуальных» бросков).</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2. Данные: 10 бросков, 7 орлов, 3 решки</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Бросок</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
                <tr><td>Результат</td><td>О</td><td>Р</td><td>О</td><td>О</td><td>О</td><td>Р</td><td>О</td><td>О</td><td>Р</td><td>О</td></tr>
              </table>
            </div>
            <div class="calc">
              Орлов (h) = 7, Решек (t) = 3, Всего (n) = 10<br>
              Частотная оценка: $\\hat{p}_{MLE} = 7/10 = 0{,}700$
            </div>
            <div class="why">MLE-оценка = 0.7, но с 10 бросками это неуверенная оценка. Байесовский подход: комбинируем prior + данные → получаем распределение, а не точку.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3. Правило обновления: conjugate prior</h4>
            <div class="calc">
              <b>Формула:</b> Beta($\\alpha$, $\\beta$) + (h орлов, t решек) = Beta($\\alpha + h$, $\\beta + t$)<br><br>
              Prior: Beta(2, 2)<br>
              Данные: h = 7, t = 3<br><br>
              <b>Posterior:</b> Beta(2 + 7, 2 + 3) = <b>Beta(9, 5)</b>
            </div>
            <div class="why">Conjugate prior — это магия: posterior имеет ту же форму (Beta), что и prior. Просто прибавляем наблюдения к параметрам. Не нужно считать интегралы!</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4. Характеристики posterior Beta(9, 5)</h4>
            <div class="calc">
              $E[p] = \\dfrac{9}{9+5} = \\dfrac{9}{14} = \\mathbf{0{,}643}$<br><br>
              $\\text{Mode}[p] = \\dfrac{9-1}{9+5-2} = \\dfrac{8}{12} = \\mathbf{0{,}667}$<br><br>
              $\\text{Var}[p] = \\dfrac{9 \\times 5}{14^2 \\times 15} = \\dfrac{45}{2940} = 0{,}0153$<br>
              $\\text{Std}[p] = \\sqrt{0{,}0153} = \\mathbf{0{,}124}$
            </div>
            <div class="why">Среднее сдвинулось: 0.500 → 0.643 (к MLE 0.700). Std уменьшился: 0.224 → 0.124 (мы стали увереннее). Posterior = компромисс между prior и данными.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5. Сравнение prior vs posterior</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Характеристика</th><th>Prior Beta(2,2)</th><th>Posterior Beta(9,5)</th><th>MLE</th></tr>
                <tr><td>E[p]</td><td>0.500</td><td><b>0.643</b></td><td>0.700</td></tr>
                <tr><td>Mode[p]</td><td>0.500</td><td><b>0.667</b></td><td>0.700</td></tr>
                <tr><td>Std[p]</td><td>0.224</td><td><b>0.124</b></td><td>—</td></tr>
                <tr><td>«Виртуальных» бросков</td><td>4</td><td><b>14</b></td><td>10</td></tr>
              </table>
            </div>
            <div class="calc">
              Posterior E[p] = 0.643 — это взвешенное среднее:<br>
              $E[p]_{\\text{post}} = \\dfrac{\\alpha + \\beta}{\\alpha + \\beta + n} \\cdot E[p]_{\\text{prior}} + \\dfrac{n}{\\alpha + \\beta + n} \\cdot \\hat{p}_{MLE}$<br>
              $= \\dfrac{4}{14} \\cdot 0{,}500 + \\dfrac{10}{14} \\cdot 0{,}700$<br>
              $= 0{,}143 + 0{,}500 = \\mathbf{0{,}643}$ — сходится!
            </div>
            <div class="why">Posterior = взвешенное среднее prior и MLE. Вес prior = 4/14 (29%), вес данных = 10/14 (71%). С ростом n вес данных растёт → posterior → MLE.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6. 95% credible interval</h4>
            <div class="calc">
              Для Beta(9, 5) 95% credible interval (числовое приближение):<br>
              2.5-й перцентиль ≈ <b>0.387</b><br>
              97.5-й перцентиль ≈ <b>0.855</b><br><br>
              95% CI: $p \\in [0{,}387,\\; 0{,}855]$<br><br>
              Содержит ли интервал 0.5 (честная монета)? → <b>Да!</b><br>
              → Мы пока не можем отвергнуть гипотезу о честной монете.
            </div>
            <div class="why">Credible interval (байесовский): «параметр $p$ лежит в [0.387, 0.855] с вероятностью 95%». Это прямая интерпретация! В отличие от confidence interval, который так интерпретировать нельзя.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7. Что если данных больше? 70 орлов из 100</h4>
            <div class="calc">
              Prior: Beta(2, 2). Данные: h=70, t=30.<br>
              Posterior: Beta(72, 32)<br><br>
              $E[p] = 72/104 = 0{,}692$ (очень близко к MLE = 0.700)<br>
              $\\text{Std}[p] = \\sqrt{\\dfrac{72 \\times 32}{104^2 \\times 105}} = 0{,}045$<br><br>
              95% CI: $[0{,}600,\\; 0{,}777]$<br>
              Содержит ли 0.5? → <b>Нет!</b> Монета нечестная.
            </div>
            <div class="why">С 100 бросками: prior почти не влияет (2/104 = 2%), posterior ≈ MLE. Интервал сузился (std 0.224 → 0.045). С достаточным количеством данных байесовский вывод сходится к частотному.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Prior Beta(2,2) + 7 орлов из 10 = Posterior Beta(9,5). E[p] сдвинулся с 0.500 к 0.643 (между prior и MLE). 95% CI: [0.387, 0.855] — ещё включает 0.5. При 70/100: posterior Beta(72,32), E[p]=0.692, CI не включает 0.5 — монета нечестная.</p>
          </div>

          <div class="lesson-box">
            <b>Beta-binomial — итог:</b> Prior Beta($\\alpha$, $\\beta$) + данные (h, t) = Posterior Beta($\\alpha+h$, $\\beta+t$). Posterior = компромисс prior/data, взвешенный по «числу наблюдений». При $n \\to \\infty$: posterior → MLE, prior не важен. Используйте credible interval для принятия решений.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: байесовское обновление</h3>
        <p>Априорное → данные → апостериорное. Смотри, как данные меняют уверенность.</p>
        <div class="sim-container">
          <div class="sim-controls" id="bay-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="bay-flip">🪙 Один бросок</button>
            <button class="btn" id="bay-flip10">🪙 10 бросков</button>
            <button class="btn secondary" id="bay-reset">↺ Сбросить</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:320px;"><canvas id="bay-chart"></canvas></div>
            <div class="sim-stats" id="bay-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#bay-controls');
        const cTrue = App.makeControl('range', 'bay-true', 'Истинная p (монеты)', { min: 0.1, max: 0.9, step: 0.05, value: 0.7 });
        const cPriorA = App.makeControl('range', 'bay-a', 'prior α', { min: 1, max: 20, step: 1, value: 2 });
        const cPriorB = App.makeControl('range', 'bay-b', 'prior β', { min: 1, max: 20, step: 1, value: 2 });
        [cTrue, cPriorA, cPriorB].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let heads = 0, tails = 0;

        function betaPdf(x, a, b) {
          // Beta(a,b) density; нормируем численно
          if (x <= 0 || x >= 1) return 0;
          return Math.pow(x, a - 1) * Math.pow(1 - x, b - 1);
        }

        function draw() {
          const pTrue = +cTrue.input.value;
          const a0 = +cPriorA.input.value, b0 = +cPriorB.input.value;
          const aPost = a0 + heads, bPost = b0 + tails;

          const xs = App.Util.linspace(0.001, 0.999, 200);
          const prior = xs.map(x => betaPdf(x, a0, b0));
          const post = xs.map(x => betaPdf(x, aPost, bPost));
          // нормировка
          const normP = prior.reduce((s, v) => s + v, 0) * (xs[1] - xs[0]);
          const normPo = post.reduce((s, v) => s + v, 0) * (xs[1] - xs[0]);
          const priorN = prior.map(v => v / normP);
          const postN = post.map(v => v / normPo);

          const ctx = container.querySelector('#bay-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xs.map(v => v.toFixed(3)),
              datasets: [
                { label: `Prior Beta(${a0},${b0})`, data: priorN, borderColor: '#94a3b8', borderWidth: 2, pointRadius: 0, fill: false, borderDash: [5, 5] },
                { label: `Posterior Beta(${aPost},${bPost})`, data: postN, borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0, fill: 'origin', backgroundColor: 'rgba(59,130,246,0.15)' },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' }, title: { display: true, text: `Истинное p = ${pTrue}` } },
              scales: { x: { title: { display: true, text: 'p (вероятность «орёл»)' }, ticks: { maxTicksLimit: 10 }, min: 0, max: 1 }, y: { title: { display: true, text: 'плотность' }, min: 0, max: 12 } },
            },
          });
          App.registerChart(chart);

          const mean = aPost / (aPost + bPost);
          const varP = aPost * bPost / ((aPost + bPost) ** 2 * (aPost + bPost + 1));
          const std = Math.sqrt(varP);

          container.querySelector('#bay-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Бросков</div><div class="stat-value">${heads + tails}</div></div>
            <div class="stat-card"><div class="stat-label">Орлов / Решек</div><div class="stat-value">${heads} / ${tails}</div></div>
            <div class="stat-card"><div class="stat-label">Posterior mean</div><div class="stat-value">${mean.toFixed(3)}</div></div>
            <div class="stat-card"><div class="stat-label">Posterior std</div><div class="stat-value">${std.toFixed(3)}</div></div>
          `;
        }

        function flip(n) {
          const pTrue = +cTrue.input.value;
          for (let i = 0; i < n; i++) { if (Math.random() < pTrue) heads++; else tails++; }
          draw();
        }

        [cTrue, cPriorA, cPriorB].forEach(c => c.input.addEventListener('input', draw));
        container.querySelector('#bay-flip').onclick = () => flip(1);
        container.querySelector('#bay-flip10').onclick = () => flip(10);
        container.querySelector('#bay-reset').onclick = () => { heads = 0; tails = 0; draw(); };
        draw();
      },
    },

    python: `
      <h3>Python: Байесовские методы</h3>
      <p>sklearn.GaussianNB — быстрый наивный Байес. scipy.stats.beta позволяет работать с бета-распределением для байесовского обновления.</p>

      <h4>1. GaussianNB — наивный Байес</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.naive_bayes import GaussianNB, MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

data = load_iris()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

gnb = GaussianNB()
gnb.fit(X_train, y_train)
y_pred = gnb.predict(X_test)

print(f'Accuracy: {accuracy_score(y_test, y_pred):.4f}')
print(classification_report(y_test, y_pred, target_names=data.target_names))

# Параметры модели — средние и дисперсии каждого признака
print('Средние по классам:')
print(np.round(gnb.theta_, 2))  # shape: (n_classes, n_features)
print('Дисперсии по классам:')
print(np.round(gnb.var_, 2))</code></pre>

      <h4>2. Байесовское обновление с бета-распределением</h4>
      <pre><code>from scipy import stats

# Монета: наблюдаем орлы и решки, обновляем belief о P(орёл)
# Prior: Beta(alpha=2, beta=2) — слабое prior вокруг 0.5
alpha_prior, beta_prior = 2, 2

# Данные: 7 орлов из 10 бросков
heads, tails = 7, 3

# Posterior: Beta(alpha + heads, beta + tails)
alpha_post = alpha_prior + heads
beta_post = beta_prior + tails

x = np.linspace(0, 1, 200)
prior = stats.beta.pdf(x, alpha_prior, beta_prior)
likelihood = stats.binom.pmf(heads, heads + tails, x)
likelihood = likelihood / likelihood.max() * prior.max()
posterior = stats.beta.pdf(x, alpha_post, beta_post)

plt.plot(x, prior, '--', label=f'Prior Beta({alpha_prior},{beta_prior})')
plt.plot(x, likelihood, ':', label='Правдоподобие (scaled)')
plt.plot(x, posterior, '-', lw=2, label=f'Posterior Beta({alpha_post},{beta_post})')
plt.xlabel('P(орёл)')
plt.ylabel('Плотность')
plt.title('Байесовское обновление: бета-распределение')
plt.legend()
plt.show()

print(f'MAP оценка: {(alpha_post-1)/(alpha_post+beta_post-2):.3f}')
print(f'95% HDI: [{stats.beta.ppf(0.025, alpha_post, beta_post):.3f}, '
      f'{stats.beta.ppf(0.975, alpha_post, beta_post):.3f}]')</code></pre>

      <h4>3. Байесовский A/B тест — сравнение конверсий</h4>
      <pre><code>from scipy import stats

# Конверсия варианта A: 120 успехов из 1000
# Конверсия варианта B: 135 успехов из 1000
a_success, a_total = 120, 1000
b_success, b_total = 135, 1000

# Posterior distributions
alpha_A = 1 + a_success;  beta_A = 1 + a_total - a_success
alpha_B = 1 + b_success;  beta_B = 1 + b_total - b_success

# P(B > A) через Монте-Карло
n_samples = 100_000
samples_A = stats.beta.rvs(alpha_A, beta_A, size=n_samples, random_state=42)
samples_B = stats.beta.rvs(alpha_B, beta_B, size=n_samples, random_state=42)
prob_B_better = (samples_B > samples_A).mean()

print(f'Конверсия A: {a_success/a_total:.2%}')
print(f'Конверсия B: {b_success/b_total:.2%}')
print(f'P(B > A): {prob_B_better:.4f}')

x = np.linspace(0.05, 0.25, 300)
plt.fill_between(x, stats.beta.pdf(x, alpha_A, beta_A), alpha=0.5, label='Вариант A')
plt.fill_between(x, stats.beta.pdf(x, alpha_B, beta_B), alpha=0.5, label='Вариант B')
plt.xlabel('Конверсия')
plt.ylabel('Плотность')
plt.title(f'Байесовский A/B тест: P(B>A)={prob_B_better:.3f}')
plt.legend()
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Спам-фильтрация</b> — классическое применение NB.</li>
        <li><b>Text classification</b> — тематическая классификация.</li>
        <li><b>Sentiment analysis</b> — с подсчётом слов.</li>
        <li><b>Медицинская диагностика</b> — байесовский пересчёт при новых данных.</li>
        <li><b>A/B тесты (байесовские)</b> — вместо p-values.</li>
        <li><b>Bayesian optimization</b> — настройка гиперпараметров.</li>
        <li><b>Bayesian deep learning</b> — uncertainty в нейросетях.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Очень быстрый в обучении и предсказании</li>
            <li>Малое количество данных достаточно</li>
            <li>Хорошо работает с текстами</li>
            <li>Естественно обрабатывает multi-class</li>
            <li>Выдаёт вероятности (хоть и плохо калиброванные)</li>
            <li>Устойчив к нерелевантным признакам</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Независимость признаков — сильное предположение</li>
            <li>Не улавливает взаимодействия признаков</li>
            <li>Плохо калиброванные вероятности</li>
            <li>Zero-frequency problem (нужен smoothing)</li>
            <li>Часто хуже более сложных моделей</li>
          </ul>
        </div>
      </div>
    `,

    extra: `
      <h3>Сопряжённые распределения</h3>
      <p>Когда posterior имеет тот же вид, что prior. Удобно — обновление сводится к изменению параметров:</p>
      <table>
        <tr><th>Likelihood</th><th>Prior</th><th>Posterior</th></tr>
        <tr><td>Bernoulli/Binomial</td><td>Beta</td><td>Beta</td></tr>
        <tr><td>Multinomial</td><td>Dirichlet</td><td>Dirichlet</td></tr>
        <tr><td>Normal (μ)</td><td>Normal</td><td>Normal</td></tr>
        <tr><td>Poisson</td><td>Gamma</td><td>Gamma</td></tr>
      </table>

      <h3>MCMC</h3>
      <p>Когда posterior аналитически не посчитать — используем семплирование (Metropolis-Hastings, Gibbs, HMC, NUTS). PyMC, Stan, TFP.</p>

      <h3>Variational Inference</h3>
      <p>Альтернатива MCMC: приближаем posterior параметризованным распределением, минимизируя KL-дивергенцию. Быстрее, но приближённо.</p>

      <h3>Байесовские нейросети</h3>
      <p>Веса — распределения, а не числа. Получаем uncertainty estimates. Дорого в обучении, используется в медицине, беспилотниках.</p>

      <h3>Frequentist vs Bayesian</h3>
      <table>
        <tr><th></th><th>Frequentist</th><th>Bayesian</th></tr>
        <tr><td>Параметр θ</td><td>Фиксирован</td><td>Случайная величина</td></tr>
        <tr><td>Данные</td><td>Случайные</td><td>Фиксированы</td></tr>
        <tr><td>Интервал</td><td>Доверительный</td><td>Credible</td></tr>
        <tr><td>Prior</td><td>Нет</td><td>Есть</td></tr>
      </table>

      <h3>A/B тесты по-байесовски</h3>
      <p>Вместо p-value — P(B лучше A | данные). Легко обновляется, даёт вероятности напрямую.</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=O2L2Uv9pdDA" target="_blank">StatQuest: Naive Bayes</a> — объяснение наивного байесовского классификатора</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BD%D0%B0%D0%B8%D0%B2%D0%BD%D1%8B%D0%B9%20%D0%B1%D0%B0%D0%B9%D0%B5%D1%81%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80" target="_blank">Наивный Байес на Habr</a> — разбор алгоритма с примерами на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/naive_bayes.html" target="_blank">sklearn: Naive Bayes</a> — документация всех вариантов наивного байеса в sklearn</li>
      </ul>
    `,
  },
});
