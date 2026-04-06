/* ==========================================================================
   Байесовские модели
   ========================================================================== */
App.registerTopic({
  id: 'bayesian',
  category: 'ml',
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
            <tr><td>«Интервал»</td><td>Доверительный (CI)</td><td>Credible Interval</td></tr>
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
        title: 'Тест на болезнь: классика Байеса',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Болезнь встречается у 1% населения. Тест имеет чувствительность 99% и специфичность 95%. Тест положительный — какова реальная вероятность болезни?</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Параметр</th><th>Значение</th><th>Смысл</th></tr>
              <tr><td>P(D)</td><td>0.01</td><td>Заболеваемость (prior)</td></tr>
              <tr><td>P(¬D)</td><td>0.99</td><td>Здоровые</td></tr>
              <tr><td>P(+|D)</td><td>0.99</td><td>Чувствительность (sensitivity)</td></tr>
              <tr><td>P(+|¬D)</td><td>0.05</td><td>Ложно-положительные (1−specificity)</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: мысленный эксперимент — 10 000 человек</h4>
            <div class="calc">
              Больные: 10000 · 0.01 = <b>100 человек</b><br>
              Здоровые: 10000 · 0.99 = <b>9900 человек</b><br><br>
              Из 100 больных: тест «+» у 100·0.99 = <b>99 человек</b> (TP)<br>
              Из 100 больных: тест «−» у 100·0.01 = 1 человек (FN)<br><br>
              Из 9900 здоровых: тест «+» у 9900·0.05 = <b>495 человек</b> (FP!)<br>
              Из 9900 здоровых: тест «−» у 9900·0.95 = 9405 человек (TN)
            </div>
            <div class="why">Ключевое: 495 ложных тревог при только 99 реальных больных. Редкая болезнь → много FP.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: применить формулу Байеса</h4>
            <div class="calc">
              P(+) = P(+|D)·P(D) + P(+|¬D)·P(¬D)<br>
              = 0.99·0.01 + 0.05·0.99<br>
              = 0.0099 + 0.0495 = <b>0.0594</b><br><br>
              P(D|+) = P(+|D)·P(D) / P(+)<br>
              = (0.99 · 0.01) / 0.0594<br>
              = 0.0099 / 0.0594 = <b>0.1667 ≈ 16.7%</b>
            </div>
            <div class="why">Только 16.7%! Хотя тест очень точный, заболеваемость 1% делает большинство положительных тестов ложными.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: второй тест после положительного первого</h4>
            <div class="calc">
              Теперь prior P(D) = 0.167 (после первого положительного теста)<br><br>
              P(+) = 0.99·0.167 + 0.05·0.833<br>
              = 0.1653 + 0.0417 = 0.2070<br><br>
              P(D|++) = 0.99·0.167 / 0.2070<br>
              = 0.1653 / 0.2070 = <b>0.799 ≈ 80%</b>
            </div>
            <div class="why">Два положительных теста: вероятность болезни 80%. Это и есть байесовское обновление: каждое наблюдение обновляет prior.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>После 1 теста: P(болен|+) ≈ 16.7%. После 2 тестов: ≈ 80%. Контринтуитивно, но правильно: при редкой болезни даже точный тест часто ошибается (много FP).</p>
          </div>
          <div class="lesson-box">
            PPV (positive predictive value) = P(D|+) зависит от prevalence. При prevalence=50%: PPV ≈ 95%. При prevalence=0.1%: PPV ≈ 2%. Именно поэтому массовый скрининг редких болезней даёт много ложных тревог.
          </div>
        `,
      },
      {
        title: 'Naive Bayes для спама',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Классифицировать письмо «купить срочно бесплатно» как спам или не-спам с помощью Naive Bayes.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Слово</th><th>P(слово|спам)</th><th>P(слово|хам)</th></tr>
              <tr><td>купить</td><td>0.30</td><td>0.05</td></tr>
              <tr><td>срочно</td><td>0.40</td><td>0.02</td></tr>
              <tr><td>бесплатно</td><td>0.25</td><td>0.01</td></tr>
              <tr><td colspan="3">P(спам) = 0.30, P(хам) = 0.70</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить P(x|спам) и P(x|хам)</h4>
            <div class="calc">
              Предположение «наивности»: слова независимы друг от друга<br><br>
              P(x|спам) = P(купить|спам) · P(срочно|спам) · P(бесплатно|спам)<br>
              = 0.30 · 0.40 · 0.25 = <b>0.030</b><br><br>
              P(x|хам) = P(купить|хам) · P(срочно|хам) · P(бесплатно|хам)<br>
              = 0.05 · 0.02 · 0.01 = <b>0.000010</b>
            </div>
            <div class="why">«Наивность»: в реальности «купить» и «бесплатно» коррелируют в спаме, но мы игнорируем это. Несмотря на это, Naive Bayes часто хорошо работает.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: применить Байес</h4>
            <div class="calc">
              P(спам|x) ∝ P(x|спам) · P(спам)<br>
              = 0.030 · 0.30 = <b>0.009000</b><br><br>
              P(хам|x) ∝ P(x|хам) · P(хам)<br>
              = 0.000010 · 0.70 = <b>0.000007</b><br><br>
              Нормировочная константа Z = 0.009000 + 0.000007 = 0.009007<br><br>
              P(спам|x) = 0.009000 / 0.009007 ≈ <b>0.9992</b>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: log-пространство для численной стабильности</h4>
            <div class="calc">
              При длинных письмах произведения уходят в 0 (underflow)<br>
              Решение: логарифмировать<br><br>
              log P(x|спам) = log(0.30) + log(0.40) + log(0.25)<br>
              = −1.204 + (−0.916) + (−1.386) = <b>−3.506</b><br><br>
              log P(x|хам) = log(0.05) + log(0.02) + log(0.01)<br>
              = −2.996 + (−3.912) + (−4.605) = <b>−11.513</b><br><br>
              Разница: −3.506 − (−11.513) = 8.007<br>
              Спам в e^8 ≈ 3000 раз вероятнее хама
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>P(спам|«купить срочно бесплатно») ≈ 99.9%. Это спам! Отношение вероятностей спам/хам = 0.009/0.000007 ≈ 1286:1.</p>
          </div>
          <div class="lesson-box">
            Laplace smoothing: если слово не встречалось в обучении → P=0 → произведение = 0. Решение: P(w|c) = (count(w,c)+1) / (count(c)+|V|), где |V| — размер словаря. Всегда применять при Naive Bayes!
          </div>
        `,
      },
      {
        title: 'Обновление Beta prior',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать байесовское обновление на примере монеты: начать с uninformative prior и обновлять по мере бросков.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Момент</th><th>Броски</th><th>Орлов</th><th>Prior Beta</th><th>Posterior Beta</th><th>E[p]</th></tr>
              <tr><td>Начало</td><td>0</td><td>0</td><td>Beta(1,1)</td><td>Beta(1,1)</td><td>0.50</td></tr>
              <tr><td>После 5</td><td>5</td><td>4</td><td>Beta(1,1)</td><td>Beta(5,2)</td><td>5/7≈0.71</td></tr>
              <tr><td>После 20</td><td>20</td><td>14</td><td>Beta(1,1)</td><td>Beta(15,7)</td><td>15/22≈0.68</td></tr>
              <tr><td>После 100</td><td>100</td><td>68</td><td>Beta(1,1)</td><td>Beta(69,33)</td><td>69/102≈0.68</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что такое Beta prior</h4>
            <div class="calc">
              Beta(α, β) — распределение на [0,1]<br>
              Alpha (α) = «виртуальные орлы», Beta (β) = «виртуальные решки»<br><br>
              Beta(1,1) = равномерное — «не знаем ничего о монете»<br>
              Beta(5,5) = «похоже на честную монету» (было 5+5 орлов/решек)<br>
              Beta(10,1) = «похоже на нечестную в пользу орла»<br><br>
              E[p] = α/(α+β)
            </div>
            <div class="why">Сопряжённый prior для биномиального правдоподобия — Beta. Это значит posterior тоже Beta: аналитически удобно!</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: правило обновления</h4>
            <div class="calc">
              Prior: Beta(α, β)<br>
              Наблюдаем: h орлов из n бросков<br>
              Posterior: Beta(α + h, β + n − h)<br><br>
              5 бросков, 4 орла:<br>
              Beta(1,1) → Beta(1+4, 1+1) = <b>Beta(5, 2)</b><br>
              E[p] = 5/(5+2) = 0.714<br><br>
              Ещё 15 бросков, 10 орлов:<br>
              Beta(5,2) → Beta(5+10, 2+5) = <b>Beta(15, 7)</b><br>
              E[p] = 15/22 = 0.682
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: влияние силы prior</h4>
            <div class="calc">
              Слабый prior Beta(1,1): после 5 орлов из 5 → E[p]=5/7≈0.71<br>
              Сильный prior Beta(10,10): после 5 орлов из 5 → Beta(15,10), E[p]=15/25=0.60<br><br>
              При 1000 бросков: оба prior сходятся к истинному p<br>
              Сильный prior «тянет» результат к центру (shrinkage)<br><br>
              Сила prior = α+β («виртуальные наблюдения»)<br>
              Beta(10,10) = «эквивалентно 20 предварительным броскам»
            </div>
            <div class="why">Сильный prior нужен, когда данных мало. Слабый — когда данных много. При n→∞ prior не важен.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>После 100 бросков (68 орлов): E[p] = 69/102 ≈ 0.676. Монета, скорее всего, нечестная. 95% credible interval: Beta(69,33) → [0.584, 0.763] — не включает 0.5.</p>
          </div>
          <div class="lesson-box">
            Credible interval (байесовский) vs Confidence interval (частотный): разная интерпретация. «Параметр с 95% вероятностью лежит в [0.58, 0.76]» — это credible interval. Confidence interval так интерпретировать нельзя!
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
              scales: { x: { title: { display: true, text: 'p (вероятность «орёл»)' }, ticks: { maxTicksLimit: 10 } }, y: { title: { display: true, text: 'плотность' } } },
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

    math: `
      <h3>Теорема Байеса</h3>
      <div class="math-block">$$P(\\theta \\mid D) = \\frac{P(D \\mid \\theta) P(\\theta)}{P(D)}$$</div>

      <h3>Naive Bayes классификатор</h3>
      <div class="math-block">$$\\hat{c} = \\arg\\max_c P(c) \\prod_{j} P(x_j \\mid c)$$</div>
      <p>На практике — суммирование логов (для устойчивости):</p>
      <div class="math-block">$$\\hat{c} = \\arg\\max_c [\\log P(c) + \\sum_j \\log P(x_j \\mid c)]$$</div>

      <h3>Gaussian NB</h3>
      <div class="math-block">$$P(x_j \\mid c) = \\frac{1}{\\sqrt{2\\pi\\sigma_{c,j}^2}} \\exp\\left(-\\frac{(x_j - \\mu_{c,j})^2}{2\\sigma_{c,j}^2}\\right)$$</div>

      <h3>Multinomial NB (с Laplace smoothing)</h3>
      <div class="math-block">$$P(x_j \\mid c) = \\frac{N_{c,j} + \\alpha}{N_c + \\alpha V}$$</div>
      <p>$N_{c,j}$ — сколько раз токен j встретился в классе c; $N_c$ — всего токенов в классе; V — размер словаря; α = 1 для Лапласа.</p>

      <h3>Beta-Binomial (сопряжённое)</h3>
      <p>Prior Beta(α, β), likelihood — Binomial. Posterior:</p>
      <div class="math-block">$$\\text{Beta}(\\alpha + k, \\beta + n - k)$$</div>
      <p>где k успехов в n испытаниях.</p>
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
  },
});
