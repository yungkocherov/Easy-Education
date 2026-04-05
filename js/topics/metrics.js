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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты работаешь на почте и сортируешь письма: важные — в коробку «срочно», остальные — «обычно». Твой начальник спрашивает: «Как ты работаешь?»</p>
        <p>Можно ответить по-разному:</p>
        <p><b>«Из всех писем, которые я положил в "срочно", 90% действительно срочные»</b> — это <b>precision</b>. Качество того, что ты отметил как важное.</p>
        <p><b>«Из всех реально срочных писем я поймал 80%»</b> — это <b>recall</b>. Насколько полно ты выловил все важные.</p>
        <p><b>«95% всех писем я рассортировал правильно»</b> — это <b>accuracy</b>. Общий процент верных решений.</p>
        <p>Три метрики измеряют разные стороны одной работы. И часто между ними приходится выбирать.</p>
      </div>

      <h3>Зачем нужны метрики</h3>
      <p>Модель классификации предсказывает классы. Но <b>насколько хорошо</b> она это делает? Нужен способ измерения, чтобы:</p>
      <ul>
        <li>Сравнивать модели между собой и выбирать лучшую.</li>
        <li>Понимать, готова ли модель к продакшену.</li>
        <li>Отчитываться перед стейкхолдерами простым числом.</li>
        <li>Отслеживать деградацию модели со временем.</li>
      </ul>
      <p>Но нет одной «правильной» метрики — выбор зависит от задачи и цены ошибок.</p>

      <h3>Матрица ошибок — основа всего</h3>
      <p><span class="term" data-tip="Confusion Matrix. Таблица, которая показывает, сколько предсказаний каждого класса оказались правильными, а сколько — ошибочными.">Confusion Matrix</span> — это таблица, где строки — реальные классы, столбцы — предсказанные. Для бинарной задачи получается 4 ячейки:</p>

      <table>
        <tr><th></th><th>Предсказано: Положительный</th><th>Предсказано: Отрицательный</th></tr>
        <tr><th>Реально: Положительный</th><td>✓ <b>TP</b> (True Positive)<br>Верно предсказали «да»</td><td>✗ <b>FN</b> (False Negative)<br>Пропустили положительный</td></tr>
        <tr><th>Реально: Отрицательный</th><td>✗ <b>FP</b> (False Positive)<br>Ложная тревога</td><td>✓ <b>TN</b> (True Negative)<br>Верно предсказали «нет»</td></tr>
      </table>

      <p>Все метрики выводятся из этих 4 чисел. Разница между метриками — в том, какие комбинации ячеек они считают.</p>

      <h3>Основные метрики — подробно</h3>

      <h4>Accuracy (точность общая)</h4>
      <div class="math-block">$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$</div>
      <p>Доля верных предсказаний среди всех. Самая интуитивная и самая опасная при <span class="term" data-tip="Imbalanced classes. Когда один класс встречается намного чаще другого — например, 99% здоровых и 1% больных.">дисбалансе классов</span>.</p>
      <p><b>Проблема:</b> если у тебя 99% здоровых и 1% больных, модель «всегда здоров» даёт 99% accuracy. Звучит отлично, но она бесполезна — ни одного больного не нашла.</p>

      <h4>Precision (точность по положительным)</h4>
      <div class="math-block">$$\\text{Precision} = \\frac{TP}{TP + FP}$$</div>
      <p>«Из всех, кого я отметил положительными, сколько действительно положительные?»</p>
      <p><b>Когда важно:</b> когда ложная тревога дорого стоит. Спам-фильтр, помечающий важное письмо как спам. Система рекомендаций, показывающая нерелевантный контент. Фильтр контента, банящий невиновных.</p>

      <h4>Recall (полнота)</h4>
      <div class="math-block">$$\\text{Recall} = \\frac{TP}{TP + FN}$$</div>
      <p>«Из всех реальных положительных, сколько я поймал?» Также называется <b>Sensitivity</b> или <b>True Positive Rate</b>.</p>
      <p><b>Когда важно:</b> когда пропуск дорого стоит. Детекция рака (пропустить больного хуже, чем перепроверить здорового). Детекция мошенничества. Поиск террористов. Детекция отказов оборудования.</p>

      <h4>Specificity (полнота по отрицательным)</h4>
      <div class="math-block">$$\\text{Specificity} = \\frac{TN}{TN + FP}$$</div>
      <p>«Из всех реально отрицательных, сколько я правильно определил?» Аналог recall, но для отрицательного класса.</p>

      <div class="key-concept">
        <div class="kc-label">Компромисс Precision-Recall</div>
        <p>Почти всегда precision и recall <b>противоречат друг другу</b>. Снижая порог классификации, модель ловит больше положительных (↑ recall), но ловит и больше ложных тревог (↓ precision). И наоборот. Выбор зависит от задачи.</p>
      </div>

      <h4>F1-score — компромисс</h4>
      <div class="math-block">$$F_1 = \\frac{2 \\cdot \\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$</div>
      <p>Гармоническое среднее precision и recall. Принимает значения от 0 до 1. Используется, когда нужен баланс между обоими.</p>
      <p><b>Почему гармоническое среднее:</b> оно сильнее «штрафует» низкие значения. Если precision = 1 и recall = 0, арифметическое среднее = 0.5 (неплохо), а F1 = 0 (честно — модель бесполезна).</p>

      <h4>F-beta — регулируемый баланс</h4>
      <div class="math-block">$$F_\\beta = (1 + \\beta^2) \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\beta^2 \\cdot \\text{Precision} + \\text{Recall}}$$</div>
      <ul>
        <li>β = 1 → F1 (равный вес).</li>
        <li>β = 2 → F2 (recall в 2 раза важнее precision).</li>
        <li>β = 0.5 → F0.5 (precision важнее).</li>
      </ul>

      <h3>Какую метрику выбрать</h3>

      <table>
        <tr><th>Ситуация</th><th>Метрика</th><th>Пример</th></tr>
        <tr><td>Сбалансированные классы, цена ошибок равна</td><td>Accuracy</td><td>Распознавание рукописных цифр</td></tr>
        <tr><td>FP дороги, нельзя ложно тревожить</td><td>Precision (F0.5)</td><td>Спам-фильтр, реклама</td></tr>
        <tr><td>FN дороги, нельзя пропускать</td><td>Recall (F2)</td><td>Рак, fraud, терроризм</td></tr>
        <tr><td>Дисбаланс, нужен баланс</td><td>F1</td><td>Детекция редких событий</td></tr>
        <tr><td>Порог ещё не выбран</td><td>ROC-AUC, PR-AUC</td><td>Сравнение моделей</td></tr>
      </table>

      <h3>Порог решения — скрытый параметр</h3>
      <p>Большинство моделей выдают <b>вероятность</b>, а не класс. Класс получается применением порога:</p>
      <div class="math-block">$$\\hat{y} = \\begin{cases} 1, & p \\geq \\text{threshold} \\\\ 0, & p < \\text{threshold} \\end{cases}$$</div>
      <p>По умолчанию threshold = 0.5. Но он должен быть подобран под задачу:</p>
      <ul>
        <li>Низкий порог → больше TP и FP (высокий recall, низкий precision).</li>
        <li>Высокий порог → меньше FP, но и пропусков больше (высокий precision, низкий recall).</li>
      </ul>

      <h3>Многоклассовая классификация</h3>
      <p>Если классов больше двух, метрики обобщаются через <b>усреднение</b>:</p>
      <ul>
        <li><b>Macro-average</b> — считаем метрику для каждого класса, усредняем. Равный вес каждому классу.</li>
        <li><b>Micro-average</b> — суммируем TP/FP/FN по всем классам, потом считаем. Равный вес каждому примеру.</li>
        <li><b>Weighted-average</b> — macro, но с весами по числу примеров в классе.</li>
      </ul>
      <p>При дисбалансе: macro показывает качество на редких классах, micro «приятно выглядит», но скрывает проблемы.</p>

      <h3>Метрики для регрессии (коротко)</h3>
      <p>Для задачи регрессии применяются другие метрики:</p>
      <ul>
        <li><b>MAE</b> (Mean Absolute Error) — средняя модуль ошибки. Устойчива к выбросам.</li>
        <li><b>MSE</b> (Mean Squared Error) — средний квадрат ошибки. Наказывает большие ошибки сильнее.</li>
        <li><b>RMSE</b> — корень из MSE, в единицах таргета.</li>
        <li><b>R²</b> — доля объяснённой дисперсии.</li>
        <li><b>MAPE</b> — в процентах от истинного значения.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Accuracy — хорошая метрика по умолчанию»</b> — только при сбалансированных классах. Иначе опасно.</li>
        <li><b>«F1 = 0.9 — значит модель хорошая»</b> — не всегда. Важен контекст: что сравниваем, какие есть alternatives.</li>
        <li><b>«100% recall — идеал»</b> — достижимо тривиально: помечать всех как положительных. Бесполезно.</li>
        <li><b>«Precision и recall — одно и то же»</b> — нет, это разные стороны компромисса.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: cost-sensitive metrics</summary>
        <div class="deep-dive-body">
          <p>Стандартные метрики считают все ошибки одинаковыми. Но в жизни FP и FN обычно имеют разную «цену». Cost-sensitive подход:</p>
          <ul>
            <li>Назначаем стоимость каждой ячейке confusion matrix: $C_{TP}, C_{FP}, C_{TN}, C_{FN}$.</li>
            <li>Минимизируем ожидаемую стоимость: $E[\\text{cost}] = C_{TP} \\cdot TP + C_{FP} \\cdot FP + ...$</li>
            <li>Это напрямую оптимизирует бизнес-метрику, а не абстрактные цифры.</li>
          </ul>
          <p>Пример: в fraud detection стоимость пропуска = сумма украденных денег, стоимость ложной тревоги = стоимость работы оператора.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Matthews Correlation Coefficient</summary>
        <div class="deep-dive-body">
          <p>MCC — метрика, устойчивая к дисбалансу:</p>
          <div class="math-block">$$\\text{MCC} = \\frac{TP \\cdot TN - FP \\cdot FN}{\\sqrt{(TP+FP)(TP+FN)(TN+FP)(TN+FN)}}$$</div>
          <p>Диапазон [−1, +1]: +1 — идеально, 0 — случайно, −1 — полностью неверно. Часто считается самой «честной» метрикой для дисбалансированных задач.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>ROC-AUC</b> — интегральные метрики без привязки к порогу.</li>
        <li><b>Дисбаланс классов</b> — диктует выбор метрики.</li>
        <li><b>Гипотезы</b> — при сравнении моделей нужны тесты на разницу метрик.</li>
        <li><b>Любая ML-модель</b> — оценивается через метрики.</li>
        <li><b>Cross-validation</b> — даёт среднюю метрику с доверительным интервалом.</li>
      </ul>
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
