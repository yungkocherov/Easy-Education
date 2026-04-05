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
      <h3>Формулировка (на пальцах)</h3>
      <p>Если взять много независимых случайных величин <b>из любого распределения</b> (конечная дисперсия обязательна) и посчитать их сумму/среднее, то это среднее будет распределено примерно нормально — чем больше выборка, тем точнее.</p>

      <h3>Что это значит</h3>
      <p>Возьмём распределение бросков кубика — оно равномерное, дискретное, ничем не похоже на колокол. Но если повторить эксперимент «бросить 30 кубиков и взять среднее» тысячу раз и нарисовать гистограмму этих средних — получится колокол N(3.5, σ²/30).</p>

      <h3>Почему это важно</h3>
      <ul>
        <li><b>Любую оценку среднего можно считать нормальной</b> при больших n.</li>
        <li>Поэтому работают t-тесты, z-тесты, доверительные интервалы.</li>
        <li>Не нужно знать форму исходного распределения — достаточно n ≥ 30 (грубое правило).</li>
      </ul>

      <div class="callout tip">💡 ЦПТ — причина, по которой нормальное распределение встречается везде. Рост человека = сумма сотен генетических и средовых факторов → нормальное.</div>
    `,

    examples: `
      <h3>Пример 1: бросание кубика</h3>
      <div class="example-card">
        <p>Одно подбрасывание: равномерное на {1,2,3,4,5,6}. E[X]=3.5, Var(X) ≈ 2.92.</p>
        <p>Возьмём 50 кубиков, посчитаем среднее. Повторим 10 000 раз.</p>
        <p>Гистограмма этих 10 000 средних будет колоколом:</p>
        <ul>
          <li>Центр: 3.5 (как ожидание одного броска)</li>
          <li>Std = √(2.92/50) ≈ 0.24 (стандартная ошибка среднего)</li>
        </ul>
      </div>

      <h3>Пример 2: зарплата из log-normal</h3>
      <div class="example-card">
        <p>Зарплаты сильно скошены (log-normal). Средняя зарплата в компании — сильно завышена.</p>
        <p>Но если мы возьмём случайную выборку из 100 сотрудников из 10 разных компаний — средние этих выборок будут распределены нормально. Это позволяет строить доверительный интервал для средней зарплаты.</p>
      </div>

      <h3>Пример 3: стандартная ошибка</h3>
      <div class="example-card">
        <p>Если генеральная совокупность имеет σ = 20, и мы берём выборки по n = 100:</p>
        <div class="math-block">$$SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{20}{\\sqrt{100}} = 2$$</div>
        <p>Среднее выборки отличается от истинного μ в среднем на ±2. Увеличим n до 400 — SE упадёт в 2 раза до 1.</p>
      </div>
    `,

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

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Доверительные интервалы</b> для среднего — напрямую следуют из ЦПТ.</li>
        <li><b>t-тесты, z-тесты, ANOVA</b> — все опираются на нормальность выборочного среднего.</li>
        <li><b>A/B тесты</b> — оценка значимости изменения среднего.</li>
        <li><b>Бутстрэп</b> — ресемплирование даёт аналогичную идею без ЦПТ.</li>
        <li><b>Закон больших чисел в финансах</b> — диверсификация портфеля.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Сила ЦПТ</h4>
          <ul>
            <li>Универсальна — работает почти с любым распределением</li>
            <li>Позволяет строить доверительные интервалы без знания формы данных</li>
            <li>Основа всей параметрической статистики</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Ограничения</h4>
          <ul>
            <li>Нужна конечная дисперсия (не работает для Коши)</li>
            <li>При малых n аппроксимация плохая</li>
            <li>Для распределений с длинными хвостами нужна большая n</li>
            <li>ЦПТ про среднее, а не про отдельные наблюдения</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Формулировка</h3>
      <p>Пусть $X_1, X_2, \\dots, X_n$ — независимые одинаково распределённые случайные величины с $E[X_i] = \\mu$ и $\\mathrm{Var}(X_i) = \\sigma^2 < \\infty$.</p>

      <p>Обозначим $\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^{n} X_i$. Тогда:</p>

      <div class="math-block">$$\\frac{\\bar{X}_n - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} N(0, 1) \\quad \\text{при } n \\to \\infty$$</div>

      <p>Эквивалентная запись:</p>
      <div class="math-block">$$\\bar{X}_n \\approx N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$</div>

      <h4>Стандартная ошибка среднего</h4>
      <div class="math-block">$$SE(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}$$</div>
      <p>Выборка в 4 раза больше → ошибка среднего в 2 раза меньше. Точность растёт как $\\sqrt{n}$.</p>

      <h4>Закон больших чисел (следствие)</h4>
      <div class="math-block">$$\\bar{X}_n \\xrightarrow{P} \\mu$$</div>
      <p>Выборочное среднее сходится к истинному при $n \\to \\infty$.</p>
    `,

    extra: `
      <h3>Когда ЦПТ «не спасает»</h3>
      <ul>
        <li><b>Распределение Коши</b> — не имеет дисперсии, ЦПТ неприменима.</li>
        <li><b>Экстремально тяжёлые хвосты</b> (Парето с α<2) — сходимость очень медленная.</li>
        <li><b>Зависимые наблюдения</b> — обычная ЦПТ требует независимости, но есть версии для слабо зависимых рядов.</li>
      </ul>

      <h3>Практическое правило</h3>
      <p>Для симметричных распределений n ≥ 15 обычно достаточно. Для сильно скошенных — n ≥ 50-100. Проверить можно Q-Q plot выборочных средних.</p>

      <h3>Бутстрэп как альтернатива</h3>
      <p>Вместо опоры на ЦПТ можно делать ресемплирование с возвращением: многократно семплируем n элементов из исходной выборки и считаем статистику. Распределение бутстрэп-статистик приближает истинное распределение оценки.</p>

      <h3>t-распределение vs нормальное</h3>
      <p>Когда σ неизвестна, используем $\\bar{X} - \\mu)/(s/\\sqrt{n})$ — это распределено по Стьюденту с n−1 степенями свободы. При n > 30 почти неотличимо от нормального.</p>
    `,
  },
});
