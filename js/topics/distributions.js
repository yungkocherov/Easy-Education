/* ==========================================================================
   Распределения
   ========================================================================== */
App.registerTopic({
  id: 'distributions',
  category: 'stats',
  title: 'Распределения',
  summary: 'Нормальное, биномиальное, Пуассона, экспоненциальное — формы случайности.',

  tabs: {
    theory: `
      <h3>Что такое распределение</h3>
      <p>Распределение — это закон, по которому случайная величина принимает значения. Оно описывает, какие значения возможны и с какой «плотностью» или вероятностью они встречаются.</p>

      <h3>Основные семейства</h3>
      <h4>Нормальное (Гаусса)</h4>
      <p>Колокол, симметричный вокруг μ. Появляется благодаря ЦПТ: сумма многих независимых случайных величин стремится к нормальному. Параметры: μ (среднее), σ (разброс).</p>
      <p>Примеры: рост людей, ошибки измерений, шум в сенсорах.</p>

      <h4>Равномерное (uniform)</h4>
      <p>Все значения на [a, b] равновероятны. Используется как базовый источник случайности.</p>
      <p>Примеры: случайный выбор, генерация ID.</p>

      <h4>Биномиальное</h4>
      <p>Число успехов в n независимых испытаниях с вероятностью p.</p>
      <p>Примеры: сколько из 100 клиентов кликнут на баннер.</p>

      <h4>Пуассоновское</h4>
      <p>Число событий за фиксированный интервал, когда события редкие и независимые. Параметр λ — среднее число событий.</p>
      <p>Примеры: число звонков в колл-центр за час, число опечаток на странице.</p>

      <h4>Экспоненциальное</h4>
      <p>Время между двумя последовательными пуассоновскими событиями. Параметр λ — интенсивность.</p>
      <p>Примеры: время ожидания следующего заказа, время до отказа оборудования.</p>

      <div class="callout tip">💡 Биномиальное и Пуассон связаны: при больших n и малых p биномиальное ≈ Пуассону с λ = np.</div>
    `,

    examples: `
      <h3>Нормальное — правило 68-95-99.7</h3>
      <div class="example-card">
        <p>Для $N(\\mu, \\sigma^2)$:</p>
        <ul>
          <li>~68% значений лежат в $\\mu \\pm \\sigma$</li>
          <li>~95% значений лежат в $\\mu \\pm 2\\sigma$</li>
          <li>~99.7% значений лежат в $\\mu \\pm 3\\sigma$</li>
        </ul>
        <p><b>Пример:</b> если IQ ~ N(100, 15²), то 68% людей имеют IQ от 85 до 115, а 99.7% — от 55 до 145.</p>
      </div>

      <h3>Биномиальное — подбрасывание монеты</h3>
      <div class="example-card">
        <p>Бросаем честную монету 10 раз. Вероятность выпадения ровно 7 орлов:</p>
        <div class="math-block">$$P(X=7) = \\binom{10}{7} \\cdot 0.5^7 \\cdot 0.5^3 = 120 \\cdot 0.0078 \\approx 0.117$$</div>
        <p>Т.е. примерно в 12% случаев из 10 бросков будет ровно 7 орлов.</p>
      </div>

      <h3>Пуассон — посетители кофейни</h3>
      <div class="example-card">
        <p>В кафе приходит в среднем 4 клиента в час (λ = 4). Вероятность того, что за час придёт ровно 6:</p>
        <div class="math-block">$$P(X=6) = \\frac{4^6 e^{-4}}{6!} = \\frac{4096 \\cdot 0.0183}{720} \\approx 0.104$$</div>
      </div>

      <h3>Экспоненциальное — время до следующего клиента</h3>
      <div class="example-card">
        <p>Если λ = 4 клиента/час, то среднее время ожидания следующего = 1/λ = 15 минут.</p>
        <p>Вероятность, что следующий клиент придёт в течение 10 минут (t = 1/6 часа):</p>
        <div class="math-block">$$P(T \\leq 1/6) = 1 - e^{-4 \\cdot 1/6} = 1 - e^{-0.667} \\approx 0.487$$</div>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция распределений</h3>
        <p>Выбери тип распределения и параметры — увидь форму.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dist-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dist-regen">🔄 Перегенерировать</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="dist-chart"></canvas></div>
            <div class="sim-stats" id="dist-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dist-controls');
        const cType = App.makeControl('select', 'dist-type', 'Распределение', {
          options: [
            { value: 'normal', label: 'Нормальное' },
            { value: 'uniform', label: 'Равномерное' },
            { value: 'binomial', label: 'Биномиальное' },
            { value: 'poisson', label: 'Пуассона' },
            { value: 'exp', label: 'Экспоненциальное' },
          ],
          value: 'normal',
        });
        const cN = App.makeControl('range', 'dist-n', 'Размер выборки', { min: 100, max: 5000, step: 100, value: 1000 });
        const cP1 = App.makeControl('range', 'dist-p1', 'Параметр 1', { min: -20, max: 50, step: 1, value: 0 });
        const cP2 = App.makeControl('range', 'dist-p2', 'Параметр 2', { min: 1, max: 50, step: 1, value: 1 });
        [cType, cN, cP1, cP2].forEach((c) => controls.appendChild(c.wrap));

        const paramLabels = {
          normal: ['μ (среднее)', 'σ (ст.откл.)', { p1: { min: -20, max: 50, step: 0.5, value: 0 }, p2: { min: 0.5, max: 20, step: 0.5, value: 1 } }],
          uniform: ['a (мин)', 'b (макс)', { p1: { min: -20, max: 20, step: 1, value: 0 }, p2: { min: 1, max: 50, step: 1, value: 10 } }],
          binomial: ['n испытаний', 'p успеха', { p1: { min: 1, max: 100, step: 1, value: 20 }, p2: { min: 0.05, max: 0.95, step: 0.05, value: 0.5 } }],
          poisson: ['λ', '—', { p1: { min: 0.5, max: 30, step: 0.5, value: 5 }, p2: { min: 0, max: 0, step: 0, value: 0 } }],
          exp: ['λ (интенсивность)', '—', { p1: { min: 0.1, max: 10, step: 0.1, value: 1 }, p2: { min: 0, max: 0, step: 0, value: 0 } }],
        };

        let chart = null;

        function updateLabels() {
          const type = cType.input.value;
          const [l1, l2, ranges] = paramLabels[type];
          cP1.wrap.querySelector('label span:first-child').textContent = l1;
          cP2.wrap.querySelector('label span:first-child').textContent = l2;
          // обновим диапазоны
          cP1.input.min = ranges.p1.min; cP1.input.max = ranges.p1.max; cP1.input.step = ranges.p1.step; cP1.input.value = ranges.p1.value;
          cP2.input.min = ranges.p2.min; cP2.input.max = ranges.p2.max; cP2.input.step = ranges.p2.step; cP2.input.value = ranges.p2.value;
          cP1.wrap.querySelector('.value-display').textContent = cP1.input.value;
          cP2.wrap.querySelector('.value-display').textContent = cP2.input.value;
          cP2.wrap.style.opacity = (l2 === '—') ? 0.4 : 1;
          cP2.input.disabled = (l2 === '—');
        }

        function run() {
          const type = cType.input.value;
          const n = +cN.input.value;
          const p1 = +cP1.input.value;
          const p2 = +cP2.input.value;

          let data;
          if (type === 'normal') data = App.Util.normalSample(n, p1, p2);
          else if (type === 'uniform') data = App.Util.uniformSample(n, p1, p2);
          else if (type === 'binomial') data = App.Util.binomialSample(n, Math.round(p1), p2);
          else if (type === 'poisson') data = App.Util.poissonSample(n, p1);
          else data = App.Util.expSample(n, p1);

          const isDiscrete = type === 'binomial' || type === 'poisson';
          const bins = isDiscrete ? Math.min(50, Math.max(...data) - Math.min(...data) + 1) : 40;
          const hist = App.Util.histogram(data, bins);

          const ctx = container.querySelector('#dist-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: hist.centers.map((c) => App.Util.round(c, 2)),
              datasets: [{
                label: 'Частота',
                data: hist.counts,
                backgroundColor: 'rgba(99, 102, 241, 0.55)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { title: { display: true, text: 'Значение' } },
                y: { title: { display: true, text: 'Частота' }, beginAtZero: true },
              },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#dist-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Выборочное среднее', App.Util.round(App.Util.mean(data), 3)],
            ['Выборочный std', App.Util.round(App.Util.std(data), 3)],
            ['Медиана', App.Util.round(App.Util.median(data), 3)],
            ['Min', App.Util.round(App.Util.min(data), 3)],
            ['Max', App.Util.round(App.Util.max(data), 3)],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        cType.input.addEventListener('change', () => { updateLabels(); run(); });
        [cN, cP1, cP2].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#dist-regen').onclick = run;
        updateLabels();
        run();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Нормальное</b> — статистические тесты, доверительные интервалы, байесовские модели, шум в сигналах.</li>
        <li><b>Биномиальное</b> — A/B тесты, конверсии, click-through rate.</li>
        <li><b>Пуассоновское</b> — моделирование потоков событий: трафика, поломок, заявок.</li>
        <li><b>Экспоненциальное</b> — время жизни, время ожидания, теория массового обслуживания.</li>
        <li><b>Log-normal</b> — доходы, цены акций, размеры файлов.</li>
        <li><b>Power law / Парето</b> — «правило 80/20», распределение богатства, размеры городов.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Зачем знать распределения</h4>
          <ul>
            <li>Правильный выбор статистического теста</li>
            <li>Моделирование реальных процессов</li>
            <li>Генерация синтетических данных</li>
            <li>Понимание предположений ML-моделей</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Типичные ошибки</h4>
          <ul>
            <li>Предположение нормальности без проверки</li>
            <li>Применение среднего к сильно скошенным данным</li>
            <li>Игнорирование тяжёлых хвостов</li>
            <li>Путаница биномиального и гипергеометрического</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Плотности и PMF</h3>

      <h4>Нормальное $N(\\mu, \\sigma^2)$</h4>
      <div class="math-block">$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$</div>
      <p>$E[X] = \\mu$, $\\mathrm{Var}(X) = \\sigma^2$.</p>

      <h4>Равномерное $U(a, b)$</h4>
      <div class="math-block">$$f(x) = \\frac{1}{b-a}, \\quad x \\in [a, b]$$</div>
      <p>$E[X] = \\frac{a+b}{2}$, $\\mathrm{Var}(X) = \\frac{(b-a)^2}{12}$.</p>

      <h4>Биномиальное $\\text{Bin}(n, p)$</h4>
      <div class="math-block">$$P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}$$</div>
      <p>$E[X] = np$, $\\mathrm{Var}(X) = np(1-p)$.</p>

      <h4>Пуассоновское $\\text{Poisson}(\\lambda)$</h4>
      <div class="math-block">$$P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$$</div>
      <p>$E[X] = \\lambda$, $\\mathrm{Var}(X) = \\lambda$.</p>

      <h4>Экспоненциальное $\\text{Exp}(\\lambda)$</h4>
      <div class="math-block">$$f(t) = \\lambda e^{-\\lambda t}, \\quad t \\geq 0$$</div>
      <p>$E[T] = 1/\\lambda$, $\\mathrm{Var}(T) = 1/\\lambda^2$.</p>
    `,

    extra: `
      <h3>Как проверить, что данные нормальны?</h3>
      <ul>
        <li><b>Q-Q plot</b> — если точки на прямой, распределение близко к нормальному.</li>
        <li><b>Тест Шапиро-Уилка</b> — формальный тест нормальности.</li>
        <li><b>Гистограмма и оценка плотности (KDE)</b> — визуальная проверка.</li>
      </ul>

      <h3>Что делать с ненормальными данными</h3>
      <ul>
        <li><b>Log-преобразование</b> — часто помогает с правым скосом (доходы, цены).</li>
        <li><b>Box-Cox</b> — семейство степенных преобразований.</li>
        <li><b>Непараметрические методы</b> — не требуют предположений о форме распределения.</li>
      </ul>

      <h3>Связи между распределениями</h3>
      <ul>
        <li>Сумма экспоненциальных → Гамма-распределение</li>
        <li>Сумма квадратов стандартных нормальных → χ²-распределение</li>
        <li>Биномиальное при n→∞, p→0, np=const → Пуассон</li>
        <li>Пуассон при λ→∞ → Нормальное N(λ, λ)</li>
      </ul>
    `,
  },
});
