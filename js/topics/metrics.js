/* ==========================================================================
   Метрики классификации
   ========================================================================== */
App.registerTopic({
  id: 'metrics',
  category: 'ml-basics',
  title: 'Метрики классификации',
  summary: 'Accuracy, Precision, Recall, F1 — как правильно измерить качество модели.',

  tabs: {
    theory: `
      <h3>Матрица ошибок (Confusion Matrix)</h3>
      <p>Всё начинается с неё. Для бинарной классификации — 4 ячейки:</p>
      <table>
        <tr><th></th><th>Предсказано 1</th><th>Предсказано 0</th></tr>
        <tr><th>Реально 1</th><td>TP (True Positive)</td><td>FN (False Negative)</td></tr>
        <tr><th>Реально 0</th><td>FP (False Positive)</td><td>TN (True Negative)</td></tr>
      </table>

      <h3>Основные метрики</h3>
      <ul>
        <li><b>Accuracy</b> = (TP + TN) / all — доля верных предсказаний.</li>
        <li><b>Precision (точность)</b> = TP / (TP + FP) — «из предсказанных положительных сколько действительно положительные».</li>
        <li><b>Recall (полнота)</b> = TP / (TP + FN) — «сколько из реальных положительных мы нашли».</li>
        <li><b>F1-score</b> = 2 · Precision · Recall / (Precision + Recall) — гармоническое среднее.</li>
        <li><b>Specificity</b> = TN / (TN + FP) — точность на отрицательном классе.</li>
      </ul>

      <h3>Когда что использовать</h3>
      <ul>
        <li><b>Сбалансированные классы</b> → Accuracy.</li>
        <li><b>Дисбаланс, важно не пропустить (медицина, fraud)</b> → Recall.</li>
        <li><b>Дисбаланс, важно не бить тревогу зря (спам)</b> → Precision.</li>
        <li><b>Баланс между precision и recall</b> → F1.</li>
      </ul>

      <div class="callout warn">⚠️ Accuracy обманчива при дисбалансе: если 99% примеров класса 0, то модель «всегда 0» даст 99% accuracy, но полный 0 recall для класса 1.</div>
    `,

    examples: `
      <h3>Пример 1: детектор рака</h3>
      <div class="example-card">
        <p>1000 пациентов, 50 больны. Модель предсказала: 40 больных TP, 10 FN, 960 TN, 0 FP.</p>
        <ul>
          <li>Accuracy = (40+960)/1000 = 0.99 — выглядит отлично</li>
          <li>Precision = 40/40 = 1.00 — все предсказанные действительно больны</li>
          <li>Recall = 40/50 = 0.80 — но мы пропустили 10 больных!</li>
          <li>F1 = 2·1·0.8/1.8 = 0.89</li>
        </ul>
        <p>В медицине важнее Recall — лучше перепроверить здорового, чем пропустить больного.</p>
      </div>

      <h3>Пример 2: спам-фильтр</h3>
      <div class="example-card">
        <p>TP=180 (пойман спам), FP=20 (важные письма в спам), FN=120 (пропущенный спам), TN=680.</p>
        <ul>
          <li>Precision = 180/200 = 0.90 — из помеченных как спам 90% действительно спам</li>
          <li>Recall = 180/300 = 0.60 — мы ловим только 60% спама</li>
        </ul>
        <p>Для спама важнее Precision: пропустить спам неприятно, но удалить важное письмо — критично.</p>
      </div>

      <h3>Пример 3: F1 vs accuracy при дисбалансе</h3>
      <div class="example-card">
        <p>950 класса 0, 50 класса 1. Модель «всегда 0»: Accuracy=0.95, Precision и Recall для класса 1 = 0, F1 = 0.</p>
        <p>F1 честнее показывает, что модель ничего не выучила.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: порог решения и метрики</h3>
        <p>Модель выдаёт вероятности. Меняй порог и смотри, как меняются precision/recall.</p>
        <div class="sim-container">
          <div class="sim-controls" id="met-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="met-regen">🔄 Новые предсказания</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="met-chart"></canvas></div>
            <div class="sim-stats" id="met-stats"></div>
            <div id="met-cm" style="margin-top:14px;"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#met-controls');
        const cThr = App.makeControl('range', 'met-thr', 'Порог', { min: 0.05, max: 0.95, step: 0.01, value: 0.5 });
        const cN = App.makeControl('range', 'met-n', 'Всего примеров', { min: 50, max: 1000, step: 50, value: 300 });
        const cImb = App.makeControl('range', 'met-imb', 'Доля класса 1', { min: 0.05, max: 0.9, step: 0.05, value: 0.4 });
        const cNoise = App.makeControl('range', 'met-noise', 'Качество модели', { min: 0.3, max: 2, step: 0.1, value: 1 });
        [cThr, cN, cImb, cNoise].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let data = [];

        function regen() {
          const n = +cN.input.value, imb = +cImb.input.value, noise = +cNoise.input.value;
          data = [];
          for (let i = 0; i < n; i++) {
            const cls = Math.random() < imb ? 1 : 0;
            const p = 1 / (1 + Math.exp(-(cls === 1 ? 1 : -1) * noise + App.Util.randn(0, 1)));
            data.push({ cls, p });
          }
          update();
        }

        function update() {
          const thr = +cThr.input.value;
          let tp = 0, fp = 0, tn = 0, fn = 0;
          data.forEach(d => {
            const pred = d.p >= thr ? 1 : 0;
            if (pred === 1 && d.cls === 1) tp++;
            else if (pred === 1 && d.cls === 0) fp++;
            else if (pred === 0 && d.cls === 1) fn++;
            else tn++;
          });
          const acc = (tp + tn) / data.length;
          const prec = tp / (tp + fp) || 0;
          const rec = tp / (tp + fn) || 0;
          const f1 = 2 * prec * rec / (prec + rec) || 0;

          // гистограммы вероятностей по классам
          const bins = 20;
          const h0 = new Array(bins).fill(0), h1 = new Array(bins).fill(0);
          data.forEach(d => {
            const idx = Math.min(bins - 1, Math.floor(d.p * bins));
            if (d.cls === 0) h0[idx]++; else h1[idx]++;
          });
          const labels = App.Util.linspace(0.025, 0.975, bins).map(v => v.toFixed(2));

          const ctx = container.querySelector('#met-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels,
              datasets: [
                { label: 'Класс 0', data: h0, backgroundColor: 'rgba(239,68,68,0.6)' },
                { label: 'Класс 1', data: h1, backgroundColor: 'rgba(59,130,246,0.6)' },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' }, title: { display: true, text: 'Распределения предсказанных вероятностей' } },
              scales: { x: { stacked: true, title: { display: true, text: 'p' } }, y: { stacked: true } },
            },
          });
          App.registerChart(chart);

          container.querySelector('#met-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Accuracy</div><div class="stat-value">${(acc * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Precision</div><div class="stat-value">${(prec * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Recall</div><div class="stat-value">${(rec * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">F1</div><div class="stat-value">${(f1 * 100).toFixed(1)}%</div></div>
          `;

          container.querySelector('#met-cm').innerHTML = `
            <table style="text-align:center;">
              <tr><th></th><th>Предсказано 1</th><th>Предсказано 0</th></tr>
              <tr><th>Реально 1</th><td style="background:#dcfce7;"><b>TP = ${tp}</b></td><td style="background:#fee2e2;">FN = ${fn}</td></tr>
              <tr><th>Реально 0</th><td style="background:#fee2e2;">FP = ${fp}</td><td style="background:#dcfce7;"><b>TN = ${tn}</b></td></tr>
            </table>
          `;
        }

        [cN, cImb, cNoise].forEach(c => c.input.addEventListener('change', regen));
        cThr.input.addEventListener('input', update);
        container.querySelector('#met-regen').onclick = regen;
        regen();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Выбор модели</b> — сравнение моделей на валидации.</li>
        <li><b>Настройка порога</b> — подбор под бизнес-метрики.</li>
        <li><b>A/B тесты моделей</b> — оценка улучшения.</li>
        <li><b>Мониторинг в проде</b> — контроль деградации.</li>
        <li><b>Отчётность</b> — одно число для стейкхолдеров.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Когда что</h4>
          <ul>
            <li><b>Accuracy</b> — сбалансированные классы</li>
            <li><b>Precision</b> — FP дорог (спам, реклама)</li>
            <li><b>Recall</b> — FN дорог (рак, fraud)</li>
            <li><b>F1</b> — нужен баланс</li>
            <li><b>F-beta</b> — регулируемый баланс</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Ловушки</h4>
          <ul>
            <li>Accuracy при дисбалансе — бесполезна</li>
            <li>Precision без Recall (или наоборот) — однобока</li>
            <li>Усреднение метрик в multi-class — нужно выбрать схему (macro/micro/weighted)</li>
            <li>Метрики не учитывают стоимость ошибок</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Формулы</h3>
      <div class="math-block">$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$</div>
      <div class="math-block">$$\\text{Precision} = \\frac{TP}{TP + FP}$$</div>
      <div class="math-block">$$\\text{Recall} = \\frac{TP}{TP + FN}$$</div>
      <div class="math-block">$$F_1 = \\frac{2 \\cdot \\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$</div>
      <div class="math-block">$$F_\\beta = (1 + \\beta^2) \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\beta^2 \\cdot \\text{Precision} + \\text{Recall}}$$</div>
      <p>β > 1 — больше вес Recall, β < 1 — больше вес Precision.</p>

      <h3>Multi-class averaging</h3>
      <ul>
        <li><b>Macro</b>: среднее метрик по классам (равный вес каждому классу).</li>
        <li><b>Micro</b>: общие TP/FP/FN, потом метрика (равный вес каждому примеру).</li>
        <li><b>Weighted</b>: macro, но с весами по числу примеров в классе.</li>
      </ul>

      <h3>Для регрессии</h3>
      <ul>
        <li>MAE: $\\frac{1}{n}\\sum|y_i - \\hat{y}_i|$</li>
        <li>MSE: $\\frac{1}{n}\\sum(y_i - \\hat{y}_i)^2$</li>
        <li>RMSE: $\\sqrt{MSE}$</li>
        <li>MAPE: $\\frac{1}{n}\\sum\\frac{|y_i - \\hat{y}_i|}{|y_i|}$</li>
        <li>$R^2 = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{y})^2}$</li>
      </ul>
    `,

    extra: `
      <h3>Business metrics vs ML metrics</h3>
      <p>F1 = 0.75 не говорит, заработает ли модель денег. Мосты между ML-метриками и бизнесом:</p>
      <ul>
        <li><b>Cost-sensitive metrics</b>: назначаем цену каждой клетке confusion matrix.</li>
        <li><b>Expected value</b>: $EV = P(y=1) \\cdot [P \\cdot V_{TP} + (1-P) \\cdot V_{FN}] + P(y=0) \\cdot [...]$</li>
        <li><b>Lift / Gain charts</b>: насколько модель лучше случайного выбора.</li>
      </ul>

      <h3>Калибровка</h3>
      <p>Precision/Recall не измеряют качество вероятностей. Для этого — Brier score, calibration plot, log-loss.</p>

      <h3>Выбор метрики по проблеме</h3>
      <table>
        <tr><th>Задача</th><th>Метрика</th></tr>
        <tr><td>Fraud detection</td><td>Recall, F-beta (β>1)</td></tr>
        <tr><td>Медицинская диагностика</td><td>Recall + специфичность</td></tr>
        <tr><td>Recommendation</td><td>Precision@K, NDCG</td></tr>
        <tr><td>Search/IR</td><td>MAP, MRR</td></tr>
        <tr><td>Imbalanced binary</td><td>F1, AUPRC</td></tr>
      </table>
    `,
  },
});
