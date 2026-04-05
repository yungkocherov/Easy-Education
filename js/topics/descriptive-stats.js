/* ==========================================================================
   Описательная статистика
   ========================================================================== */
App.registerTopic({
  id: 'descriptive-stats',
  category: 'stats',
  title: 'Описательная статистика',
  summary: 'Среднее, медиана, дисперсия, квантили — как одним числом описать выборку.',

  tabs: {
    theory: `
      <h3>Что это и зачем</h3>
      <p>Описательная статистика — это числовые характеристики, которые «сжимают» выборку до нескольких понятных чисел. Вместо того чтобы смотреть на тысячи значений, мы смотрим на среднее, разброс и форму распределения.</p>

      <h3>Меры центральной тенденции</h3>
      <ul>
        <li><b>Среднее (mean)</b> — сумма значений, делённая на их количество. Чувствительно к выбросам.</li>
        <li><b>Медиана (median)</b> — значение в середине отсортированной выборки. Устойчива к выбросам.</li>
        <li><b>Мода (mode)</b> — самое часто встречающееся значение.</li>
      </ul>

      <h3>Меры разброса</h3>
      <ul>
        <li><b>Дисперсия (variance)</b> — среднее квадратичное отклонение от среднего.</li>
        <li><b>Стандартное отклонение (std)</b> — корень из дисперсии, в тех же единицах, что и данные.</li>
        <li><b>Размах (range)</b> — max − min.</li>
        <li><b>IQR (межквартильный размах)</b> — Q3 − Q1, устойчив к выбросам.</li>
      </ul>

      <div class="callout tip">💡 <b>Правило большого пальца:</b> если у тебя симметричное распределение без выбросов — смотри на среднее и std. Если есть выбросы или скос — используй медиану и IQR.</div>
    `,

    examples: `
      <h3>Пример 1: зарплаты в отделе</h3>
      <div class="example-card">
        <h4>Данные</h4>
        <div class="example-data">[40, 42, 45, 48, 50, 52, 55, 58, 60, 250]</div>
        <p><b>Среднее:</b> (40+42+45+48+50+52+55+58+60+250) / 10 = <b>70</b></p>
        <p><b>Медиана:</b> среднее 5-го и 6-го значения = (50+52)/2 = <b>51</b></p>
        <p>Зарплата в 250 — выброс (может быть директор). Среднее из-за неё «съехало» до 70, хотя почти все получают около 50. Медиана = 51 гораздо точнее отражает «типичную» зарплату.</p>
      </div>

      <h3>Пример 2: разброс оценок</h3>
      <div class="example-card">
        <h4>Группа A</h4>
        <div class="example-data">[4, 4, 5, 5, 5, 5, 5, 5, 5, 4]  → среднее 4.7, std ≈ 0.48</div>
        <h4>Группа B</h4>
        <div class="example-data">[2, 3, 5, 5, 5, 5, 5, 5, 7, 5]  → среднее 4.7, std ≈ 1.34</div>
        <p>У обеих групп среднее одинаковое (4.7), но группа B разнороднее — больший std. <b>Среднее без std обманчиво</b>.</p>
      </div>

      <h3>Пример 3: квартили и IQR</h3>
      <div class="example-card">
        <div class="example-data">[3, 7, 8, 12, 14, 18, 21, 25, 30, 34, 40]</div>
        <p><b>Q1 (25%)</b> = 10 (четверть значений ниже)</p>
        <p><b>Q2 (медиана)</b> = 18</p>
        <p><b>Q3 (75%)</b> = 27.5 (три четверти значений ниже)</p>
        <p><b>IQR</b> = Q3 − Q1 = 17.5 — в этом диапазоне лежит центральная половина данных.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: как выбросы влияют на статистики</h3>
        <p>Сгенерируй выборку и посмотри, как меняются среднее/медиана/std при добавлении выбросов.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dstat-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dstat-regen">🔄 Новая выборка</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="dstat-chart"></canvas></div>
            <div class="sim-stats" id="dstat-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dstat-controls');
        const c1 = App.makeControl('range', 'dstat-n', 'Размер выборки', { min: 20, max: 500, step: 10, value: 100 });
        const c2 = App.makeControl('range', 'dstat-mu', 'Среднее μ', { min: 0, max: 100, step: 1, value: 50 });
        const c3 = App.makeControl('range', 'dstat-sigma', 'Ст. отклонение σ', { min: 1, max: 30, step: 1, value: 10 });
        const c4 = App.makeControl('range', 'dstat-outliers', 'Количество выбросов', { min: 0, max: 20, step: 1, value: 0 });
        const c5 = App.makeControl('range', 'dstat-outlier-val', 'Значение выброса', { min: 50, max: 500, step: 10, value: 200 });
        [c1, c2, c3, c4, c5].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;

        function run() {
          const n = +c1.input.value;
          const mu = +c2.input.value;
          const sigma = +c3.input.value;
          const nOut = +c4.input.value;
          const outVal = +c5.input.value;

          const base = App.Util.normalSample(n, mu, sigma);
          const outliers = new Array(nOut).fill(outVal);
          const data = [...base, ...outliers];

          const mean = App.Util.mean(data);
          const median = App.Util.median(data);
          const std = App.Util.std(data);
          const q1 = App.Util.quantile(data, 0.25);
          const q3 = App.Util.quantile(data, 0.75);
          const iqr = q3 - q1;

          // Гистограмма
          const hist = App.Util.histogram(data, 30);
          const ctx = container.querySelector('#dstat-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: hist.centers.map((c) => App.Util.round(c, 1)),
              datasets: [
                {
                  label: 'Частота',
                  data: hist.counts,
                  backgroundColor: 'rgba(59, 130, 246, 0.55)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                annotation: {},
                tooltip: { callbacks: { title: (items) => 'x ≈ ' + items[0].label } },
              },
              scales: {
                x: { title: { display: true, text: 'Значение' } },
                y: { title: { display: true, text: 'Частота' }, beginAtZero: true },
              },
            },
          });
          App.registerChart(chart);

          // Статистики
          const statsEl = container.querySelector('#dstat-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Среднее', App.Util.round(mean, 2)],
            ['Медиана', App.Util.round(median, 2)],
            ['Std', App.Util.round(std, 2)],
            ['Q1', App.Util.round(q1, 2)],
            ['Q3', App.Util.round(q3, 2)],
            ['IQR', App.Util.round(iqr, 2)],
            ['Min', App.Util.round(App.Util.min(data), 2)],
            ['Max', App.Util.round(App.Util.max(data), 2)],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [c1, c2, c3, c4, c5].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#dstat-regen').onclick = run;
        run();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>EDA</b> — первый шаг анализа любых данных: посмотреть распределение, выявить аномалии.</li>
        <li><b>Мониторинг бизнес-метрик</b> — средний чек, медианное время отклика, 95-й перцентиль.</li>
        <li><b>A/B тесты</b> — сравнение средних и дисперсий двух групп.</li>
        <li><b>SLA / производительность систем</b> — p50, p95, p99 по задержкам.</li>
        <li><b>Контроль качества</b> — выход за пределы μ ± 3σ сигнализирует о браке.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Очень просто считать и интерпретировать</li>
            <li>Даёт быстрое представление о данных</li>
            <li>Основа для любой дальнейшей аналитики</li>
            <li>Легко передавать стейкхолдерам</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Одно число не отражает форму распределения</li>
            <li>Среднее и std чувствительны к выбросам</li>
            <li>Не показывают связи между переменными</li>
            <li>Могут вводить в заблуждение при мультимодальных данных</li>
          </ul>
        </div>
      </div>
      <div class="callout warn">⚠️ Квартет Анскомба: четыре разных датасета с одинаковыми средним, дисперсией и корреляцией — но совершенно разной формой. Всегда рисуй график!</div>
    `,

    math: `
      <h3>Математические формулы</h3>

      <h4>Среднее арифметическое</h4>
      <div class="math-block">$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i$$</div>

      <h4>Дисперсия (несмещённая, выборочная)</h4>
      <div class="math-block">$$s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2$$</div>
      <p>Деление на $n-1$ (поправка Бесселя) даёт несмещённую оценку дисперсии генеральной совокупности.</p>

      <h4>Стандартное отклонение</h4>
      <div class="math-block">$$s = \\sqrt{s^2}$$</div>

      <h4>Медиана</h4>
      <div class="math-block">$$\\text{med}(x) = \\begin{cases} x_{((n+1)/2)}, & n \\text{ нечётно} \\\\ \\frac{x_{(n/2)} + x_{(n/2+1)}}{2}, & n \\text{ чётно} \\end{cases}$$</div>

      <h4>Квантиль уровня q</h4>
      <p>Значение $x_q$, такое что $P(X \\leq x_q) = q$. Для выборки — интерполяция между упорядоченными элементами.</p>

      <h4>Коэффициент вариации</h4>
      <div class="math-block">$$CV = \\frac{s}{\\bar{x}}$$</div>
      <p>Безразмерная мера разброса — удобна для сравнения выборок с разными единицами.</p>
    `,

    extra: `
      <h3>Тонкости и ловушки</h3>
      <h4>Почему n−1, а не n?</h4>
      <p>При расчёте дисперсии по выборке мы оцениваем $\\bar{x}$, которое само зависит от данных. Это «съедает» одну степень свободы. Деление на $n-1$ компенсирует это и даёт несмещённую оценку.</p>

      <h4>Скошенность (skewness) и эксцесс (kurtosis)</h4>
      <p>Третий и четвёртый моменты описывают форму распределения:</p>
      <ul>
        <li><b>Skewness > 0</b> — длинный правый хвост (доходы, цены).</li>
        <li><b>Skewness < 0</b> — длинный левый хвост.</li>
        <li><b>Kurtosis > 3</b> — «тяжёлые хвосты» (больше выбросов, чем у нормального).</li>
      </ul>

      <h4>Boxplot</h4>
      <p>Графическое представление пятёрки чисел: min, Q1, median, Q3, max. Точки за пределами Q1−1.5·IQR и Q3+1.5·IQR считаются выбросами.</p>

      <h4>Робастные статистики</h4>
      <ul>
        <li><b>Trimmed mean</b> — среднее после удаления k% крайних значений.</li>
        <li><b>MAD</b> (median absolute deviation) — медиана отклонений от медианы, устойчивая альтернатива std.</li>
      </ul>

      <h3>Дальше</h3>
      <p>После описательной статистики обычно переходят к <b>распределениям</b> и <b>проверке гипотез</b> — они отвечают на вопрос «а значимо ли отличие?».</p>
    `,
  },
});
