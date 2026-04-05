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
      <h3>Теорема Байеса</h3>
      <div class="math-block">$$P(H \\mid D) = \\frac{P(D \\mid H) \\cdot P(H)}{P(D)}$$</div>
      <ul>
        <li><b>P(H)</b> — apriori (до данных): что мы думали о гипотезе до наблюдений.</li>
        <li><b>P(D | H)</b> — likelihood: насколько данные правдоподобны при этой гипотезе.</li>
        <li><b>P(H | D)</b> — aposteriori (после данных): обновлённое убеждение.</li>
        <li><b>P(D)</b> — evidence: нормировочная константа.</li>
      </ul>

      <h3>Naive Bayes классификатор</h3>
      <p>Хотим найти класс с максимальной вероятностью при наблюдении признаков:</p>
      <div class="math-block">$$\\hat{c} = \\arg\\max_c P(c \\mid x_1, \\dots, x_p)$$</div>
      <p>Применяем Байеса + <b>наивное</b> предположение о независимости признаков:</p>
      <div class="math-block">$$\\hat{c} = \\arg\\max_c P(c) \\prod_{j=1}^{p} P(x_j \\mid c)$$</div>

      <h3>Варианты Naive Bayes</h3>
      <ul>
        <li><b>Gaussian NB</b> — признаки непрерывные, $P(x_j | c) \\sim N(\\mu_{c,j}, \\sigma_{c,j}^2)$.</li>
        <li><b>Multinomial NB</b> — для счётчиков (часто для текста): bag-of-words.</li>
        <li><b>Bernoulli NB</b> — для бинарных признаков.</li>
        <li><b>Complement NB</b> — устойчив к дисбалансу.</li>
      </ul>

      <h3>Байесовский ML (более широко)</h3>
      <p>Вместо одной оценки параметров — распределение:</p>
      <ul>
        <li><b>MLE</b>: $\\hat{\\theta} = \\arg\\max P(D | \\theta)$</li>
        <li><b>MAP</b>: $\\hat{\\theta} = \\arg\\max P(\\theta | D) = \\arg\\max P(D|\\theta) P(\\theta)$</li>
        <li><b>Full Bayes</b>: работаем с $P(\\theta | D)$ напрямую, делаем предсказания через интеграл.</li>
      </ul>

      <div class="callout tip">💡 Naive Bayes называется «наивным» из-за предположения независимости признаков — почти никогда не верно, но модель всё равно часто работает хорошо.</div>
    `,

    examples: `
      <h3>Пример 1: классический байес — болезнь</h3>
      <div class="example-card">
        <p>Болезнь у 1% населения. Тест: 99% чувствительность, 95% специфичность. Тест положительный — какая вероятность болезни?</p>
        <div class="math-block">$$P(D|+) = \\frac{P(+|D) P(D)}{P(+|D)P(D) + P(+|\\neg D)P(\\neg D)}$$</div>
        <div class="math-block">$$= \\frac{0.99 \\cdot 0.01}{0.99 \\cdot 0.01 + 0.05 \\cdot 0.99} = \\frac{0.0099}{0.0594} \\approx 0.167$$</div>
        <p>Только 16.7% вероятность болезни! Контринтуитивно — дело в низкой исходной вероятности.</p>
      </div>

      <h3>Пример 2: Naive Bayes для спама</h3>
      <div class="example-card">
        <p>Частоты слов в спаме и хамах:</p>
        <pre>P("купить" | спам) = 0.3   P("купить" | хам) = 0.05
P("срочно" | спам) = 0.4   P("срочно" | хам) = 0.02
P(спам) = 0.3              P(хам) = 0.7</pre>
        <p>Письмо содержит «купить срочно»:</p>
        <div class="math-block">$$P(\\text{спам}|x) \\propto 0.3 \\cdot 0.3 \\cdot 0.4 = 0.036$$</div>
        <div class="math-block">$$P(\\text{хам}|x) \\propto 0.7 \\cdot 0.05 \\cdot 0.02 = 0.0007$$</div>
        <p>Нормируем: P(спам|x) = 0.036/(0.036+0.0007) ≈ 0.98. Это спам.</p>
      </div>

      <h3>Пример 3: Laplace smoothing</h3>
      <div class="example-card">
        <p>Если слово ни разу не встретилось в классе — P(слово|класс) = 0, и всё произведение зануляется.</p>
        <p>Сглаживание Лапласа: добавляем 1 к счётчикам:</p>
        <div class="math-block">$$P(x_j|c) = \\frac{\\text{count}(x_j, c) + 1}{\\text{count}(c) + V}$$</div>
        <p>где V — размер словаря.</p>
      </div>
    `,

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
