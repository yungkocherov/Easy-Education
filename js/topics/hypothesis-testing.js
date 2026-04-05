/* ==========================================================================
   Проверка гипотез
   ========================================================================== */
App.registerTopic({
  id: 'hypothesis-testing',
  category: 'stats',
  title: 'Проверка гипотез',
  summary: 'p-value, α, ошибки I/II рода — как решать «значимо ли отличие».',

  tabs: {
    theory: `
      <h3>Идея</h3>
      <p>Мы не можем доказать, что что-то «точно работает». Но можем оценить, насколько невероятен наблюдаемый эффект при условии, что <b>ничего не работает</b>. Если он очень маловероятен — отвергаем «ничего не работает».</p>

      <h3>Шаги процедуры</h3>
      <ol>
        <li><b>Сформулировать нулевую гипотезу $H_0$</b> — «нет эффекта» (например, средние равны).</li>
        <li><b>Альтернативная гипотеза $H_1$</b> — что мы хотим доказать (средние различаются).</li>
        <li><b>Выбрать уровень значимости α</b> — обычно 0.05.</li>
        <li><b>Посчитать статистику</b> из данных (t-стат, z-стат, χ²).</li>
        <li><b>Найти p-value</b> — вероятность увидеть такой или более экстремальный результат при верной $H_0$.</li>
        <li><b>Решение:</b> если p < α — отвергаем $H_0$, иначе «не хватает данных отвергнуть».</li>
      </ol>

      <h3>Ошибки</h3>
      <table>
        <tr><th></th><th>$H_0$ верна</th><th>$H_0$ неверна</th></tr>
        <tr><th>Отвергли $H_0$</th><td>❌ Ошибка I рода (α)</td><td>✓ Верно</td></tr>
        <tr><th>Не отвергли $H_0$</th><td>✓ Верно</td><td>❌ Ошибка II рода (β)</td></tr>
      </table>
      <p><b>Мощность теста</b> = 1 − β — вероятность заметить реальный эффект.</p>

      <div class="callout warn">⚠️ p < 0.05 ≠ «эффект большой» или «важный». Это только «маловероятно случайно». При большом n даже крошечные эффекты значимы.</div>
    `,

    examples: `
      <h3>Пример 1: средняя высота деревьев</h3>
      <div class="example-card">
        <p>Утверждение: «средняя высота сосен в лесу = 20 м». Берём выборку n=25, находим $\\bar{x}$ = 22 м, s = 3 м.</p>
        <div class="math-block">$$t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}} = \\frac{22 - 20}{3/\\sqrt{25}} = \\frac{2}{0.6} = 3.33$$</div>
        <p>При df=24 критическое значение t для α=0.05 (двусторонний) ≈ 2.06. <b>|3.33| > 2.06 → отвергаем $H_0$</b>. Деревья в среднем выше 20 м.</p>
        <p>p-value ≈ 0.003 — очень маловероятно увидеть такое отклонение случайно.</p>
      </div>

      <h3>Пример 2: A/B тест</h3>
      <div class="example-card">
        <p>Кнопка A: 1000 показов, 50 кликов (CR = 5%). Кнопка B: 1000 показов, 65 кликов (CR = 6.5%).</p>
        <p>Нулевая: $p_A = p_B$. Объединённая доля: $\\hat{p}$ = 115/2000 = 0.0575.</p>
        <div class="math-block">$$z = \\frac{p_B - p_A}{\\sqrt{\\hat{p}(1-\\hat{p})(1/n_A+1/n_B)}} = \\frac{0.015}{\\sqrt{0.0575 \\cdot 0.9425 \\cdot 0.002}} \\approx 1.44$$</div>
        <p>p-value ≈ 0.15 — <b>не отвергаем $H_0$</b>. Разница 1.5 п.п. могла быть случайной. Нужно больше данных.</p>
      </div>

      <h3>Пример 3: χ²-тест независимости</h3>
      <div class="example-card">
        <p>Связан ли пол с предпочтением напитка?</p>
        <table>
          <tr><th></th><th>Чай</th><th>Кофе</th></tr>
          <tr><th>М</th><td>30</td><td>70</td></tr>
          <tr><th>Ж</th><td>60</td><td>40</td></tr>
        </table>
        <p>χ² ≈ 18, df=1, p-value < 0.001 → связь есть.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: когда мы отвергаем $H_0$</h3>
        <p>Сравним две группы. Первая имеет среднее 0, вторая — μ₂. Посмотрим, как часто тест находит разницу в зависимости от размера выборки и эффекта.</p>
        <div class="sim-container">
          <div class="sim-controls" id="ht-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="ht-run">▶ Запустить 500 симуляций</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="ht-chart"></canvas></div>
            <div class="sim-stats" id="ht-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#ht-controls');
        const cN = App.makeControl('range', 'ht-n', 'Размер каждой группы', { min: 10, max: 500, step: 10, value: 50 });
        const cEffect = App.makeControl('range', 'ht-effect', 'Истинный эффект (μ₂ − μ₁)', { min: 0, max: 2, step: 0.05, value: 0.3 });
        const cSigma = App.makeControl('range', 'ht-sigma', 'Ст. отклонение σ', { min: 0.5, max: 3, step: 0.1, value: 1 });
        const cAlpha = App.makeControl('range', 'ht-alpha', 'α', { min: 0.01, max: 0.1, step: 0.01, value: 0.05 });
        [cN, cEffect, cSigma, cAlpha].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;

        // Двухвыборочный t-тест (предположение равных дисперсий)
        function tTest(a, b) {
          const n1 = a.length, n2 = b.length;
          const m1 = App.Util.mean(a), m2 = App.Util.mean(b);
          const v1 = App.Util.variance(a), v2 = App.Util.variance(b);
          const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
          const t = (m1 - m2) / Math.sqrt(sp2 * (1 / n1 + 1 / n2));
          // Приближение p-value через нормальное (для большого df)
          const z = Math.abs(t);
          const p = 2 * (1 - App.Util.normalCDF(z));
          return { t, p };
        }

        function run() {
          const n = +cN.input.value;
          const eff = +cEffect.input.value;
          const sigma = +cSigma.input.value;
          const alpha = +cAlpha.input.value;
          const K = 500;
          const pvals = [];
          let rejected = 0;
          for (let i = 0; i < K; i++) {
            const a = App.Util.normalSample(n, 0, sigma);
            const b = App.Util.normalSample(n, eff, sigma);
            const { p } = tTest(a, b);
            pvals.push(p);
            if (p < alpha) rejected++;
          }

          // гистограмма p-значений
          const hist = App.Util.histogram(pvals, 20, [0, 1]);
          const ctx = container.querySelector('#ht-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: hist.centers.map((c) => App.Util.round(c, 2)),
              datasets: [{
                data: hist.counts,
                backgroundColor: hist.centers.map((c) => c < alpha ? 'rgba(220, 38, 38, 0.7)' : 'rgba(59, 130, 246, 0.6)'),
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'Распределение p-значений (красное — отвергаем H₀)' } },
              scales: { x: { title: { display: true, text: 'p-value' } }, y: { beginAtZero: true } },
            },
          });
          App.registerChart(chart);

          const power = rejected / K;
          const cardsEl = container.querySelector('#ht-stats');
          cardsEl.innerHTML = '';
          const cards = [
            ['Симуляций', K],
            ['Отвергли H₀', `${rejected} (${(power * 100).toFixed(1)}%)`],
            [eff === 0 ? 'Наблюд. ошибка I рода' : 'Наблюд. мощность (1−β)', (power * 100).toFixed(1) + '%'],
            ['Ожидаемая α', (alpha * 100).toFixed(0) + '%'],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            cardsEl.appendChild(card);
          });
        }

        [cN, cEffect, cSigma, cAlpha].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#ht-run').onclick = run;
        run();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>A/B тесты в продукте</b> — сравнение вариантов сайтов, e-mail, кнопок.</li>
        <li><b>Клинические исследования</b> — эффективность лекарств и процедур.</li>
        <li><b>Контроль качества</b> — не сместился ли процесс производства.</li>
        <li><b>ML feature selection</b> — значимость признаков (χ², F-тест).</li>
        <li><b>Регрессионный анализ</b> — значимость коэффициентов.</li>
        <li><b>Научные публикации</b> — стандартный инструмент подтверждения гипотез.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Строгая количественная процедура принятия решений</li>
            <li>Контроль частоты ложных срабатываний</li>
            <li>Широко принят в науке и индустрии</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>p-value часто неправильно интерпретируют</li>
            <li>p-hacking: перебор до «значимого» результата</li>
            <li>При больших n любой эффект «значим»</li>
            <li>Не отвечает на вопрос «насколько велик эффект»</li>
          </ul>
        </div>
      </div>
      <div class="callout warn">⚠️ При многократных сравнениях нужны поправки (Бонферрони, FDR), иначе ошибки I рода накапливаются.</div>
    `,

    math: `
      <h3>Основные формулы</h3>

      <h4>Одновыборочный t-тест</h4>
      <div class="math-block">$$t = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}, \\quad \\text{df} = n - 1$$</div>

      <h4>Двухвыборочный t-тест (равные дисперсии)</h4>
      <div class="math-block">$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}, \\quad s_p^2 = \\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}$$</div>

      <h4>z-тест для пропорций</h4>
      <div class="math-block">$$z = \\frac{\\hat{p}_1 - \\hat{p}_2}{\\sqrt{\\hat{p}(1-\\hat{p})(1/n_1 + 1/n_2)}}$$</div>

      <h4>χ²-тест независимости</h4>
      <div class="math-block">$$\\chi^2 = \\sum_{i,j} \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}$$</div>

      <h4>p-value</h4>
      <p>$p$-value $= P(\\text{статистика} \\geq \\text{наблюдаемой} \\,|\\, H_0)$.</p>
    `,

    extra: `
      <h3>Правильная интерпретация p-value</h3>
      <p><b>p = 0.03</b> означает: «если $H_0$ верна, то вероятность увидеть такие или более экстремальные данные — 3%». Это <b>не</b> «вероятность $H_0$».</p>

      <h3>Эффект-сайз</h3>
      <p>Всегда рапортуй размер эффекта рядом с p-value: Cohen's d, разность средних с CI, отношение рисков. p говорит «значимо», эффект-сайз — «насколько».</p>

      <h3>Мощность (power analysis)</h3>
      <p>Перед экспериментом рассчитай необходимый n для детектирования минимально интересного эффекта при желаемой мощности (обычно 0.8).</p>

      <h3>Поправки на множественные сравнения</h3>
      <ul>
        <li><b>Бонферрони</b>: α' = α/m для m тестов (консервативно).</li>
        <li><b>Benjamini-Hochberg (FDR)</b>: контроль доли ложных открытий (менее консервативно).</li>
      </ul>

      <h3>Байесовская альтернатива</h3>
      <p>Байесовский фактор и апостериорные вероятности — альтернатива p-value. Прямо отвечают «вероятность гипотезы при данных».</p>
    `,
  },
});
