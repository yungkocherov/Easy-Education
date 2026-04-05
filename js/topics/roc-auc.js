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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь медицинский тест на редкую болезнь. У тебя в руках ручка «чувствительность»: крутишь вправо — ловим всех больных, но и здоровые пугаются. Крутишь влево — никого лишнего не беспокоим, но пропускаем пациентов. Где установить ручку?</p>
        <p>Ответа нет без контекста. ROC-кривая показывает, <b>на что способен твой тест при любом положении ручки</b>. Это график «сколько настоящих больных ты ловишь» против «сколько здоровых пугаешь зря». Один взгляд — и ты видишь всё.</p>
        <p>А <b>AUC</b> — это число, которое сжимает весь график до одного значения: «насколько хорош тест в принципе». 0.5 — бесполезный (монетка), 1.0 — идеальный.</p>
      </div>

      <h3>Зачем нужна ROC-кривая</h3>
      <p>Большинство моделей выдают не класс, а <b>вероятность</b>. Чтобы получить класс, мы ставим <span class="term" data-tip="Threshold. Порог для принятия решения: если вероятность >= threshold → класс 1, иначе класс 0.">порог</span>: $p \\geq 0.5$ → класс 1. Но выбор порога — это компромисс:</p>
      <ul>
        <li>Понизим порог → ловим больше положительных (↑ recall), но больше ложных тревог (↓ precision).</li>
        <li>Повысим порог → меньше ложных тревог, но больше пропусков.</li>
      </ul>
      <p>Precision, recall, F1 считаются при <b>фиксированном</b> пороге. Но что если порог ещё не выбран? Или мы сравниваем две модели, у которых разные оптимальные пороги? Здесь вступает ROC — она показывает поведение модели при <b>всех</b> порогах сразу.</p>

      <h3>Два главных термина</h3>

      <h4>TPR — True Positive Rate</h4>
      <div class="math-block">$$\\text{TPR} = \\frac{TP}{TP + FN} = \\text{Recall}$$</div>
      <p>«Из всех настоящих больных, какую долю мы поймали?» Это тот же <b>recall</b>. Ещё называется <span class="term" data-tip="Sensitivity. Другое название для TPR/Recall. Показывает, насколько модель чувствительна к положительному классу.">sensitivity</span>.</p>

      <h4>FPR — False Positive Rate</h4>
      <div class="math-block">$$\\text{FPR} = \\frac{FP}{FP + TN} = 1 - \\text{Specificity}$$</div>
      <p>«Из всех настоящих здоровых, какую долю мы ложно заподозрили?» Это «цена» работы модели.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея ROC</div>
        <p>Мы строим график, где на оси X — FPR (что ты проигрываешь), на оси Y — TPR (что ты выигрываешь). Для каждого возможного порога — точка на графике. Соединяем точки → получается <b>ROC-кривая</b>.</p>
      </div>

      <h3>Как читать ROC-кривую</h3>
      <p>Крайние точки:</p>
      <ul>
        <li><b>(0, 0) — порог = 1.0</b>: ничего не помечаем как положительный → TPR = 0, FPR = 0. Никого не беспокоим, но и никого не находим.</li>
        <li><b>(1, 1) — порог = 0.0</b>: всё помечаем как положительное → TPR = 1, FPR = 1. Находим всех, но и ложно тревожим всех.</li>
      </ul>

      <p>Между крайностями лежит кривая. Она показывает <b>набор компромиссов</b>:</p>
      <ul>
        <li>🟢 <b>Идеальная модель</b>: кривая проходит через угол (0, 1) — можем поймать всех при нулевых ложных тревогах.</li>
        <li>🟡 <b>Случайная модель</b>: кривая = диагональ. TPR = FPR всегда. Никакой полезной информации.</li>
        <li>🔵 <b>Реальная модель</b>: выпуклая кривая между диагональю и углом. Чем ближе к углу — тем лучше.</li>
        <li>🔴 <b>Кривая ниже диагонали</b>: модель хуже случайной. Инвертируй предсказания — получишь хорошую.</li>
      </ul>

      <h3>AUC — площадь под кривой</h3>
      <p><span class="term" data-tip="Area Under Curve. Площадь под ROC-кривой. Одно число от 0 до 1, характеризующее качество модели независимо от порога.">AUC</span> (Area Under Curve) — число от 0 до 1, измеряющее <b>общее</b> качество модели:</p>
      <ul>
        <li><b>AUC = 1.0</b> — идеальная модель.</li>
        <li><b>AUC = 0.9+</b> — очень хорошая.</li>
        <li><b>AUC = 0.8-0.9</b> — хорошая.</li>
        <li><b>AUC = 0.7-0.8</b> — приемлемая.</li>
        <li><b>AUC = 0.6-0.7</b> — слабая.</li>
        <li><b>AUC = 0.5</b> — случайная (бесполезная).</li>
        <li><b>AUC < 0.5</b> — хуже случайной (инвертируй).</li>
      </ul>

      <h3>Вероятностная интерпретация AUC</h3>
      <p>Есть красивое толкование: <b>AUC = вероятность того, что случайный положительный пример получит от модели более высокий score, чем случайный отрицательный</b>.</p>
      <p>Это интуитивно: хорошая модель «ранжирует» положительные выше отрицательных. AUC = 0.85 означает: в 85% случаев, если взять рандомного больного и рандомного здорового, модель отдаст больному больший score.</p>

      <div class="callout tip">💡 Эта интерпретация делает AUC особенно ценной в задачах <b>ранжирования</b>: рекомендательные системы, поиск, кредитный скоринг.</div>

      <h3>PR-кривая — альтернатива для дисбаланса</h3>
      <p>ROC имеет большой недостаток: при <b>сильном дисбалансе</b> классов она может выглядеть отлично, хотя модель на самом деле плохая.</p>
      <p><b>Почему:</b> FPR считается по всем отрицательным. Если их миллион, а FP всего 1000, то FPR = 0.001 — выглядит отлично. Но в абсолютных числах 1000 ложных тревог — это много.</p>
      <p>Решение: <span class="term" data-tip="Precision-Recall curve. Вместо TPR/FPR строится precision vs recall. При дисбалансе показывает реальную картину качества модели.">PR-кривая</span> (Precision-Recall).</p>
      <ul>
        <li>По оси X — Recall.</li>
        <li>По оси Y — Precision.</li>
        <li>Площадь — <b>AUPRC</b> (Area Under PR Curve).</li>
      </ul>
      <p><b>Baseline для PR:</b> доля положительных в выборке. Для случайной модели AUPRC равен этой доле.</p>

      <h3>ROC vs PR — когда что</h3>
      <table>
        <tr><th>Ситуация</th><th>Используй</th></tr>
        <tr><td>Сбалансированные классы</td><td>ROC-AUC</td></tr>
        <tr><td>Сильный дисбаланс</td><td>PR-AUC (AUPRC)</td></tr>
        <tr><td>Важен положительный класс</td><td>PR-AUC</td></tr>
        <tr><td>Ранжирование</td><td>ROC-AUC</td></tr>
        <tr><td>Сравнение моделей</td><td>Обе!</td></tr>
      </table>

      <h3>Как выбрать оптимальный порог</h3>
      <p>ROC-кривая даёт инструмент для выбора порога под конкретную задачу:</p>
      <ul>
        <li><b>Youden's J:</b> $J = TPR - FPR$. Порог с максимальным J — оптимум при равной цене ошибок.</li>
        <li><b>Ближайшая к (0, 1):</b> геометрический подход.</li>
        <li><b>По стоимости:</b> если знаешь цены FP и FN, минимизируй $C_{FN} \\cdot FN + C_{FP} \\cdot FP$.</li>
        <li><b>По целевой precision/recall:</b> «хочу recall = 0.9, какой порог нужен?»</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«AUC = 0.95 — модель отличная»</b> — не всегда. При дисбалансе — возможно, она просто хорошо определяет класс большинства.</li>
        <li><b>«AUC выше → модель лучше»</b> — в среднем да, но игнорируется форма кривой. Иногда модель с меньшим AUC лучше в интересующей области порогов.</li>
        <li><b>«AUC не зависит от порога»</b> — верно, но это и проблема: она не учитывает, какие пороги практически важны.</li>
        <li><b>«PR и ROC одно и то же»</b> — нет, при дисбалансе могут давать разную картину.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: связь AUC с другими метриками</summary>
        <div class="deep-dive-body">
          <p>AUC связан с несколькими другими мерами:</p>
          <ul>
            <li><b>Gini coefficient</b>: $\\text{Gini} = 2 \\cdot \\text{AUC} - 1$. Используется в финансах.</li>
            <li><b>Mann-Whitney U</b>: AUC численно равен нормализованной U-статистике.</li>
            <li><b>Concordance index (C-index)</b>: то же, что AUC, но часто используется в survival analysis.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: калибровка вероятностей</summary>
        <div class="deep-dive-body">
          <p>AUC говорит о <b>ранжировании</b>, но не о <b>калибровке</b> вероятностей. Модель может выдавать score 0.9 для всех положительных и 0.1 для всех отрицательных — AUC = 1.0. Но сами по себе 0.9 и 0.1 — не «настоящие вероятности».</p>
          <p>Для оценки калибровки используют:</p>
          <ul>
            <li><b>Reliability diagram</b> — график «предсказанная вероятность vs реальная частота».</li>
            <li><b>Brier score</b> — среднеквадратичная ошибка вероятностей.</li>
            <li><b>Log-loss</b> — чувствительна и к ранжированию, и к калибровке.</li>
          </ul>
          <p>Если нужны калиброванные вероятности — используй Platt scaling или Isotonic regression.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Метрики классификации</b> — TPR/FPR выводятся из confusion matrix.</li>
        <li><b>Дисбаланс классов</b> — диктует выбор между ROC и PR.</li>
        <li><b>Логистическая регрессия</b> — выдаёт вероятности, которые ROC анализирует.</li>
        <li><b>Бизнес-метрики</b> — порог на ROC выбирается по бизнес-целям.</li>
        <li><b>Сравнение моделей</b> — AUC позволяет сравнивать модели без выбора порога.</li>
      </ul>
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
