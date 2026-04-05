/* ==========================================================================
   Корреляция и ковариация
   ========================================================================== */
App.registerTopic({
  id: 'correlation',
  category: 'stats',
  title: 'Корреляция и ковариация',
  summary: 'Как измерить связь между двумя переменными.',

  tabs: {
    theory: `
      <h3>Ковариация</h3>
      <p>Ковариация показывает, как две переменные меняются вместе:</p>
      <ul>
        <li><b>Положительная</b>: растёт X → обычно растёт Y.</li>
        <li><b>Отрицательная</b>: растёт X → Y падает.</li>
        <li><b>Ноль</b>: линейной связи нет.</li>
      </ul>
      <p>Проблема: ковариация зависит от единиц измерения. Cov(рост, вес) в мм и г будет огромная, в м и кг — маленькая. Сравнивать нельзя.</p>

      <h3>Корреляция Пирсона</h3>
      <p>Нормализованная ковариация. Всегда лежит в $[-1, 1]$:</p>
      <ul>
        <li><b>+1</b> — идеальная линейная прямая связь.</li>
        <li><b>-1</b> — идеальная линейная обратная связь.</li>
        <li><b>0</b> — линейной связи нет (но может быть нелинейная!).</li>
      </ul>

      <h3>Шкала интерпретации (для социальных данных)</h3>
      <table>
        <tr><th>|r|</th><th>Сила связи</th></tr>
        <tr><td>0 – 0.1</td><td>нет / очень слабая</td></tr>
        <tr><td>0.1 – 0.3</td><td>слабая</td></tr>
        <tr><td>0.3 – 0.5</td><td>умеренная</td></tr>
        <tr><td>0.5 – 0.7</td><td>сильная</td></tr>
        <tr><td>0.7 – 1.0</td><td>очень сильная</td></tr>
      </table>

      <div class="callout warn">⚠️ <b>Корреляция ≠ причинность.</b> Мороженое и утопления коррелируют — но через третью переменную (жара).</div>
    `,

    examples: `
      <h3>Пример 1: рост и вес</h3>
      <div class="example-card">
        <div class="example-data">Рост: [160, 165, 170, 175, 180]
Вес:  [55, 62, 68, 75, 82]</div>
        <p>$\\bar{x}$ = 170, $\\bar{y}$ = 68.4</p>
        <p>Cov ≈ 55, $s_x$ ≈ 7.9, $s_y$ ≈ 10.5</p>
        <p>r = 55 / (7.9 · 10.5) ≈ <b>0.997</b> — почти идеальная линейная связь.</p>
      </div>

      <h3>Пример 2: нелинейная связь</h3>
      <div class="example-card">
        <div class="example-data">x: [-2, -1, 0, 1, 2]
y: [4, 1, 0, 1, 4]</div>
        <p>Связь явная: $y = x^2$. Но Пирсон = 0 (потому что связь нелинейная и симметричная).</p>
        <p>Решение: корреляция Спирмена (по рангам) или визуальный осмотр.</p>
      </div>

      <h3>Пример 3: квартет Анскомба</h3>
      <div class="example-card">
        <p>Четыре разных набора данных, у всех $r = 0.816$ и одинаковые статистики — но на графиках выглядят совершенно по-разному. <b>Всегда смотри на scatter plot!</b></p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: управляй корреляцией</h3>
        <p>Меняй истинную корреляцию ρ и количество точек. Наблюдай scatter и смотри на выборочный r.</p>
        <div class="sim-container">
          <div class="sim-controls" id="corr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="corr-regen">🔄 Перегенерировать</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="corr-chart"></canvas></div>
            <div class="sim-stats" id="corr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#corr-controls');
        const cRho = App.makeControl('range', 'corr-rho', 'Истинная ρ', { min: -1, max: 1, step: 0.05, value: 0.7 });
        const cN = App.makeControl('range', 'corr-n', 'Число точек', { min: 10, max: 500, step: 10, value: 100 });
        const cNoise = App.makeControl('range', 'corr-noise', 'Выбросов', { min: 0, max: 10, step: 1, value: 0 });
        [cRho, cN, cNoise].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;

        function run() {
          const rho = +cRho.input.value;
          const n = +cN.input.value;
          const nOut = +cNoise.input.value;

          // Генерим двумерное нормальное с заданной корреляцией
          const xs = [], ys = [];
          for (let i = 0; i < n; i++) {
            const z1 = App.Util.randn();
            const z2 = App.Util.randn();
            const x = z1;
            const y = rho * z1 + Math.sqrt(1 - rho * rho) * z2;
            xs.push(x);
            ys.push(y);
          }
          // добавим выбросы
          for (let i = 0; i < nOut; i++) {
            xs.push((Math.random() - 0.5) * 8);
            ys.push((Math.random() - 0.5) * 8);
          }

          // Выборочный r
          const mx = App.Util.mean(xs), my = App.Util.mean(ys);
          let cov = 0, sx = 0, sy = 0;
          for (let i = 0; i < xs.length; i++) {
            cov += (xs[i] - mx) * (ys[i] - my);
            sx += (xs[i] - mx) ** 2;
            sy += (ys[i] - my) ** 2;
          }
          const r = cov / Math.sqrt(sx * sy);
          const covVal = cov / (xs.length - 1);

          const ctx = container.querySelector('#corr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [{
                data: xs.map((x, i) => ({ x, y: ys[i] })),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 0.9)',
                pointRadius: 4,
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { title: { display: true, text: 'X' } },
                y: { title: { display: true, text: 'Y' } },
              },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#corr-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Истинная ρ', rho.toFixed(2)],
            ['Выборочный r', r.toFixed(3)],
            ['Ковариация', covVal.toFixed(3)],
            ['r² (объяснённая дисперсия)', (r * r).toFixed(3)],
            ['n', xs.length],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [cRho, cN, cNoise].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#corr-regen').onclick = run;
        run();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Feature selection</b> — отбор признаков с высокой связью с таргетом.</li>
        <li><b>Multicollinearity detection</b> — признаки с |r| > 0.9 часто избыточны.</li>
        <li><b>Портфельный анализ</b> — корреляция активов для диверсификации.</li>
        <li><b>Рекомендательные системы</b> — similarity по Пирсону.</li>
        <li><b>EDA</b> — heatmap корреляций как быстрый обзор связей в данных.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Простая интерпретация по шкале [-1, 1]</li>
            <li>Быстро считается</li>
            <li>Не зависит от единиц</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Ловит только линейные связи (Пирсон)</li>
            <li>Чувствительна к выбросам</li>
            <li>Не показывает причинность</li>
            <li>Может вводить в заблуждение при смешанных группах (парадокс Симпсона)</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Формулы</h3>

      <h4>Ковариация</h4>
      <div class="math-block">$$\\mathrm{Cov}(X, Y) = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})(y_i - \\bar{y})$$</div>

      <h4>Корреляция Пирсона</h4>
      <div class="math-block">$$r = \\frac{\\mathrm{Cov}(X, Y)}{s_x \\cdot s_y} = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum (x_i - \\bar{x})^2 \\sum (y_i - \\bar{y})^2}}$$</div>

      <h4>Корреляция Спирмена</h4>
      <div class="math-block">$$\\rho_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$$</div>
      <p>где $d_i$ — разность рангов. Устойчива к выбросам, ловит монотонные нелинейные связи.</p>

      <h4>Значимость корреляции</h4>
      <p>Для проверки $H_0: r = 0$:</p>
      <div class="math-block">$$t = \\frac{r \\sqrt{n-2}}{\\sqrt{1 - r^2}}, \\quad \\text{df} = n - 2$$</div>
    `,

    extra: `
      <h3>Парадокс Симпсона</h3>
      <p>Связь может менять знак при группировке. Пример: внутри каждого возраста курение не связано со здоровьем, но в целом связано — потому что курильщики в среднем старше.</p>

      <h3>Автокорреляция</h3>
      <p>Корреляция ряда с его сдвигом: $\\mathrm{Corr}(X_t, X_{t-k})$. Основа ARIMA и анализа временных рядов.</p>

      <h3>Частная (partial) корреляция</h3>
      <p>Связь X и Y <b>после</b> учёта других переменных Z. Убирает confounding.</p>

      <h3>Альтернативы для нелинейных связей</h3>
      <ul>
        <li><b>Distance correlation</b> — = 0 тогда и только тогда, когда X и Y независимы.</li>
        <li><b>Mutual information</b> — теоретико-информационная мера зависимости.</li>
        <li><b>MIC</b> — максимальная информационная корреляция.</li>
      </ul>
    `,
  },
});
