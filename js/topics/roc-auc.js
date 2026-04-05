/* ==========================================================================
   ROC-AUC и PR-AUC
   ========================================================================== */
App.registerTopic({
  id: 'roc-auc',
  category: 'ml-basics',
  title: 'ROC-AUC',
  summary: 'Качество модели через все возможные пороги одновременно.',

  tabs: {
    theory: `
      <h3>Зачем нужна ROC</h3>
      <p>Precision/Recall/F1 считаются при конкретном пороге. Но модель выдаёт вероятности — и при разных порогах метрики разные. ROC-кривая показывает поведение модели при <b>всех</b> порогах сразу.</p>

      <h3>Определения</h3>
      <ul>
        <li><b>TPR (True Positive Rate) = Recall</b> = TP / (TP + FN)</li>
        <li><b>FPR (False Positive Rate)</b> = FP / (FP + TN)</li>
      </ul>

      <h3>ROC кривая</h3>
      <p>Ось X: FPR, ось Y: TPR. Для каждого порога — точка на кривой.</p>
      <ul>
        <li>Порог 1.0: ничего не предсказываем как 1 → TPR=0, FPR=0 → (0,0).</li>
        <li>Порог 0.0: всё предсказываем как 1 → TPR=1, FPR=1 → (1,1).</li>
        <li>Идеальная модель: угол (0, 1) — ловим всех и без ложных срабатываний.</li>
        <li>Случайная модель: диагональ.</li>
      </ul>

      <h3>AUC (Area Under Curve)</h3>
      <p>Площадь под ROC-кривой. Интерпретация:</p>
      <ul>
        <li><b>AUC = 0.5</b> — случайная модель.</li>
        <li><b>AUC = 1.0</b> — идеальная.</li>
        <li><b>AUC = 0.0</b> — всё перепутано (можно инвертировать).</li>
      </ul>
      <p>Вероятностная интерпретация: AUC = вероятность, что случайный положительный пример получит выше score, чем случайный отрицательный.</p>

      <div class="callout tip">💡 AUC не зависит от порога — её можно считать «универсальным» качеством ранжирования.</div>

      <h3>PR-кривая</h3>
      <p>Precision vs Recall. При сильном дисбалансе классов ROC выглядит хорошо, а PR показывает реальное качество.</p>
    `,

    examples: `
      <h3>Пример 1: идеально разделимые</h3>
      <div class="example-card">
        <p>Все положительные имеют score > 0.7, все отрицательные — score < 0.3.</p>
        <p>Любой порог в (0.3, 0.7) даст TPR=1, FPR=0 → AUC=1.</p>
      </div>

      <h3>Пример 2: случайная модель</h3>
      <div class="example-card">
        <p>Score распределён одинаково для обоих классов. ROC — диагональ от (0,0) до (1,1). AUC=0.5.</p>
      </div>

      <h3>Пример 3: подсчёт AUC вручную</h3>
      <div class="example-card">
        <div class="example-data">Scores и метки (по убыванию):
0.9 → 1
0.8 → 1
0.7 → 0
0.6 → 1
0.5 → 0
0.4 → 0</div>
        <p>Всего пар (pos, neg): 3×3 = 9.</p>
        <p>Сколько раз pos.score > neg.score:</p>
        <ul>
          <li>0.9 > 0.7, 0.5, 0.4 → 3</li>
          <li>0.8 > 0.7, 0.5, 0.4 → 3</li>
          <li>0.6 > 0.5, 0.4 → 2</li>
        </ul>
        <p>AUC = 8/9 ≈ 0.889</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: ROC и PR при разном качестве</h3>
        <div class="sim-container">
          <div class="sim-controls" id="roc-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="roc-regen">🔄 Новые предсказания</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="roc-curve"></canvas></div>
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="roc-pr"></canvas></div>
            </div>
            <div class="sim-stats" id="roc-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#roc-controls');
        const cSep = App.makeControl('range', 'roc-sep', 'Качество разделения', { min: 0, max: 3, step: 0.05, value: 1.2 });
        const cN = App.makeControl('range', 'roc-n', 'Размер выборки', { min: 100, max: 2000, step: 100, value: 500 });
        const cImb = App.makeControl('range', 'roc-imb', 'Доля класса 1', { min: 0.05, max: 0.5, step: 0.05, value: 0.3 });
        [cSep, cN, cImb].forEach(c => controls.appendChild(c.wrap));

        let rocChart = null, prChart = null;

        function run() {
          const sep = +cSep.input.value, n = +cN.input.value, imb = +cImb.input.value;
          const data = [];
          for (let i = 0; i < n; i++) {
            const cls = Math.random() < imb ? 1 : 0;
            const z = (cls === 1 ? sep : -sep) + App.Util.randn(0, 1);
            data.push({ cls, p: 1 / (1 + Math.exp(-z)) });
          }

          // сортируем по убыванию score
          const sorted = [...data].sort((a, b) => b.p - a.p);
          const P = data.filter(d => d.cls === 1).length;
          const N = data.filter(d => d.cls === 0).length;
          let tp = 0, fp = 0;
          const roc = [{ x: 0, y: 0 }];
          const pr = [];
          sorted.forEach(d => {
            if (d.cls === 1) tp++; else fp++;
            roc.push({ x: fp / N, y: tp / P });
            const prec = tp / (tp + fp);
            pr.push({ x: tp / P, y: prec });
          });

          // AUC ROC через трапеции
          let auc = 0;
          for (let i = 1; i < roc.length; i++) {
            auc += (roc[i].x - roc[i - 1].x) * (roc[i].y + roc[i - 1].y) / 2;
          }
          // AUPRC
          let aupr = 0;
          for (let i = 1; i < pr.length; i++) {
            aupr += (pr[i].x - pr[i - 1].x) * (pr[i].y + pr[i - 1].y) / 2;
          }

          const ctxR = container.querySelector('#roc-curve').getContext('2d');
          if (rocChart) rocChart.destroy();
          rocChart = new Chart(ctxR, {
            type: 'line',
            data: {
              datasets: [
                { label: 'ROC', data: roc, borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0, fill: 'origin', backgroundColor: 'rgba(59,130,246,0.15)' },
                { label: 'Случайная', data: [{ x: 0, y: 0 }, { x: 1, y: 1 }], borderColor: '#94a3b8', borderWidth: 1, borderDash: [5, 5], pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'ROC кривая' } },
              scales: { x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'FPR' } }, y: { min: 0, max: 1, title: { display: true, text: 'TPR' } } },
            },
          });
          App.registerChart(rocChart);

          const ctxP = container.querySelector('#roc-pr').getContext('2d');
          if (prChart) prChart.destroy();
          prChart = new Chart(ctxP, {
            type: 'line',
            data: {
              datasets: [
                { label: 'PR', data: pr, borderColor: '#16a34a', borderWidth: 2.5, pointRadius: 0, fill: 'origin', backgroundColor: 'rgba(22,163,74,0.15)' },
                { label: 'Baseline', data: [{ x: 0, y: imb }, { x: 1, y: imb }], borderColor: '#94a3b8', borderWidth: 1, borderDash: [5, 5], pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Precision-Recall кривая' } },
              scales: { x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'Recall' } }, y: { min: 0, max: 1, title: { display: true, text: 'Precision' } } },
            },
          });
          App.registerChart(prChart);

          container.querySelector('#roc-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">AUC-ROC</div><div class="stat-value">${auc.toFixed(3)}</div></div>
            <div class="stat-card"><div class="stat-label">AUC-PR</div><div class="stat-value">${aupr.toFixed(3)}</div></div>
            <div class="stat-card"><div class="stat-label">Положительных</div><div class="stat-value">${P}</div></div>
            <div class="stat-card"><div class="stat-label">Отрицательных</div><div class="stat-value">${N}</div></div>
          `;
        }

        [cSep, cN, cImb].forEach(c => c.input.addEventListener('input', run));
        container.querySelector('#roc-regen').onclick = run;
        run();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Сравнение моделей</b> — без привязки к порогу.</li>
        <li><b>Медицинская диагностика</b> — классический инструмент.</li>
        <li><b>Fraud detection</b> — при сильном дисбалансе — PR-AUC.</li>
        <li><b>Ранжирование</b> — рекомендательные системы.</li>
        <li><b>Выбор порога</b> — Youden's J: максимизируем TPR − FPR.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Не зависит от выбора порога</li>
            <li>Инвариантна к масштабу вероятностей</li>
            <li>Понятная вероятностная интерпретация</li>
            <li>Одно число для сравнения моделей</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Оптимистична при дисбалансе — используй PR-AUC</li>
            <li>Не отражает качества вероятностей (калибровки)</li>
            <li>Не все пороги одинаково важны на практике</li>
            <li>В multi-class требует one-vs-rest или макро-усреднения</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Определения</h3>
      <div class="math-block">$$\\text{TPR}(t) = \\frac{|\\{i : \\hat{p}_i \\geq t, y_i = 1\\}|}{|\\{i : y_i = 1\\}|}$$</div>
      <div class="math-block">$$\\text{FPR}(t) = \\frac{|\\{i : \\hat{p}_i \\geq t, y_i = 0\\}|}{|\\{i : y_i = 0\\}|}$$</div>

      <h3>AUC как вероятность</h3>
      <div class="math-block">$$\\text{AUC} = P(\\hat{p}_{\\text{pos}} > \\hat{p}_{\\text{neg}})$$</div>

      <h3>Формула через ранги</h3>
      <p>Пусть $R_i$ — ранг i-го положительного примера в отсортированных score. Тогда:</p>
      <div class="math-block">$$\\text{AUC} = \\frac{\\sum_{i \\in \\text{pos}} R_i - \\frac{n_+ (n_+ + 1)}{2}}{n_+ \\cdot n_-}$$</div>
      <p>(Связь с U-статистикой Манна-Уитни.)</p>

      <h3>Связь с Gini</h3>
      <div class="math-block">$$\\text{Gini} = 2 \\cdot \\text{AUC} - 1$$</div>

      <h3>AUPRC baseline</h3>
      <p>Для случайной модели $\\text{AUPRC} = P(y=1)$ — доля положительных.</p>
    `,

    extra: `
      <h3>ROC vs PR при дисбалансе</h3>
      <p>Пример: 1% положительных. Модель находит 90% из них (TPR=0.9), но с 5% FPR.</p>
      <ul>
        <li>ROC: TPR=0.9, FPR=0.05 — выглядит отлично.</li>
        <li>Но FP = 0.05 · 99 = 4.95%, а TP = 0.9%. Precision = 0.9/(0.9+4.95) ≈ 0.15.</li>
        <li>ROC «скрывает» плохой precision. PR-AUC его показывает.</li>
      </ul>

      <h3>Выбор порога по ROC</h3>
      <ul>
        <li><b>Youden's J</b>: $t^* = \\arg\\max_t [TPR(t) - FPR(t)]$</li>
        <li><b>Ближайшая точка к (0,1)</b>: минимизация евклидова расстояния.</li>
        <li><b>По стоимости ошибок</b>: $t^* = \\arg\\min_t [c_{FN} \\cdot FN(t) + c_{FP} \\cdot FP(t)]$.</li>
      </ul>

      <h3>Multi-class AUC</h3>
      <ul>
        <li><b>One-vs-Rest (OvR)</b>: для каждого класса считаем AUC, усредняем.</li>
        <li><b>One-vs-One (OvO)</b>: для всех пар классов.</li>
      </ul>

      <h3>Доверительный интервал</h3>
      <p>DeLong's test — параметрический. Или bootstrap: многократно ресемплируй и считай AUC.</p>
    `,
  },
});
