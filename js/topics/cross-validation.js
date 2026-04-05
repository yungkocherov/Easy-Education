/* ==========================================================================
   Cross-Validation
   ========================================================================== */
App.registerTopic({
  id: 'cross-validation',
  category: 'ml-basics',
  title: 'Кросс-валидация',
  summary: 'Честная оценка качества модели и выбор гиперпараметров.',

  tabs: {
    theory: `
      <h3>Зачем</h3>
      <p>Оценка на обучающей выборке переоптимистична — модель видела эти данные. Нужна <b>отложенная</b> выборка, которую модель не видела. Но одного разбиения мало: результат может зависеть от случая.</p>

      <h3>K-Fold CV</h3>
      <p>Разбиваем данные на k равных частей (fold). Для каждой части:</p>
      <ol>
        <li>Обучаем модель на остальных k−1 частях.</li>
        <li>Оцениваем на отложенной части.</li>
      </ol>
      <p>Получаем k оценок качества, усредняем. Типичный k: 5 или 10.</p>

      <h3>Виды CV</h3>
      <ul>
        <li><b>Hold-out</b> — простое разбиение train/test (быстро, но шумно).</li>
        <li><b>K-Fold</b> — стандарт.</li>
        <li><b>Stratified K-Fold</b> — сохраняет пропорции классов в каждом фолде (для классификации).</li>
        <li><b>Leave-One-Out (LOO)</b> — k = n. Очень долго, но почти несмещённая оценка.</li>
        <li><b>TimeSeriesSplit</b> — для временных рядов, только «будущее» в test.</li>
        <li><b>Group K-Fold</b> — когда есть группы, которые не должны разделяться.</li>
      </ul>

      <h3>Зачем CV для выбора гиперпараметров</h3>
      <p>Для каждой комбинации гиперпараметров делаем k-fold CV, выбираем лучшую по среднему. Это <b>GridSearchCV</b>.</p>

      <div class="callout warn">⚠️ Если используешь CV для выбора гиперпараметров, финальную оценку делай на отдельном <b>test set</b>, иначе переоценишь качество (data leakage).</div>
    `,

    examples: `
      <h3>Пример 1: 5-fold CV</h3>
      <div class="example-card">
        <p>100 примеров, k=5. Каждый fold по 20 примеров.</p>
        <div class="example-data">Итерация 1: train=80-100, test=0-20 → acc=0.82
Итерация 2: train=0-20,80-100, test=20-40 → acc=0.79
Итерация 3: ... → acc=0.85
Итерация 4: ... → acc=0.81
Итерация 5: ... → acc=0.83
Средняя accuracy = 0.82 ± 0.022</div>
      </div>

      <h3>Пример 2: stratification</h3>
      <div class="example-card">
        <p>1000 примеров, 90% класса 0, 10% класса 1. Обычный K-Fold может случайно попасть на fold с 0% класса 1.</p>
        <p>Stratified K-Fold гарантирует ~10% класса 1 в каждом fold. Это важно при дисбалансе.</p>
      </div>

      <h3>Пример 3: nested CV</h3>
      <div class="example-card">
        <p>Для честной оценки при поиске гиперпараметров:</p>
        <pre>for outer_fold in 5_folds:
    train_outer, test_outer = split(outer_fold)
    for inner_fold in 5_folds(train_outer):
        train_inner, val = split(inner_fold)
        подобрать параметры
    обучить с лучшими параметрами на train_outer
    оценить на test_outer</pre>
        <p>25 моделей всего. Медленно, но самая честная оценка.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: разброс оценок между фолдами</h3>
        <p>Меняй k и размер выборки. Смотри, как меняется среднее и разброс метрик.</p>
        <div class="sim-container">
          <div class="sim-controls" id="cv-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="cv-run">▶ Прогнать CV</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="cv-chart"></canvas></div>
            <div class="sim-stats" id="cv-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#cv-controls');
        const cK = App.makeControl('range', 'cv-k', 'k (folds)', { min: 2, max: 20, step: 1, value: 5 });
        const cN = App.makeControl('range', 'cv-n', 'Размер выборки', { min: 30, max: 500, step: 10, value: 100 });
        const cSignal = App.makeControl('range', 'cv-sig', 'Сила сигнала', { min: 0.1, max: 3, step: 0.1, value: 1 });
        const cNoise = App.makeControl('range', 'cv-noise', 'Шум', { min: 0.1, max: 3, step: 0.1, value: 1 });
        [cK, cN, cSignal, cNoise].forEach(c => controls.appendChild(c.wrap));

        let chart = null;

        function run() {
          const k = +cK.input.value, n = +cN.input.value, sig = +cSignal.input.value, noise = +cNoise.input.value;

          // сгенерим данные (логистическая регрессия учится по одному признаку)
          const data = [];
          for (let i = 0; i < n; i++) {
            const x = App.Util.randn(0, 1);
            const z = sig * x + App.Util.randn(0, noise);
            data.push({ x, y: z > 0 ? 1 : 0 });
          }
          App.Util.shuffle(data);

          // k-fold
          const foldSize = Math.floor(n / k);
          const scores = [];
          for (let fold = 0; fold < k; fold++) {
            const test = data.slice(fold * foldSize, (fold + 1) * foldSize);
            const train = [...data.slice(0, fold * foldSize), ...data.slice((fold + 1) * foldSize)];
            // обучаем простой классификатор: порог по x
            // оптимум: перебор порогов
            const xs = train.map(d => d.x).sort((a, b) => a - b);
            let bestThr = 0, bestAcc = 0;
            for (let i = 0; i < xs.length; i++) {
              const thr = xs[i];
              let c = 0;
              train.forEach(d => { if ((d.x >= thr ? 1 : 0) === d.y) c++; });
              const acc = c / train.length;
              if (acc > bestAcc) { bestAcc = acc; bestThr = thr; }
            }
            let correct = 0;
            test.forEach(d => { if ((d.x >= bestThr ? 1 : 0) === d.y) correct++; });
            scores.push(correct / test.length);
          }

          const mean = App.Util.mean(scores);
          const std = App.Util.std(scores);

          const ctx = container.querySelector('#cv-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: scores.map((_, i) => `Fold ${i + 1}`),
              datasets: [
                { label: 'Accuracy', data: scores, backgroundColor: 'rgba(59,130,246,0.6)' },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: `Accuracy по фолдам (mean = ${mean.toFixed(3)}, std = ${std.toFixed(3)})` },
              },
              scales: { y: { min: 0, max: 1, title: { display: true, text: 'Accuracy' } } },
            },
          });
          App.registerChart(chart);

          container.querySelector('#cv-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Mean accuracy</div><div class="stat-value">${(mean * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Std</div><div class="stat-value">${(std * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Min</div><div class="stat-value">${(App.Util.min(scores) * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Max</div><div class="stat-value">${(App.Util.max(scores) * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">95% CI</div><div class="stat-value">±${(1.96 * std / Math.sqrt(k) * 100).toFixed(1)}%</div></div>
          `;
        }

        [cK, cN, cSignal, cNoise].forEach(c => c.input.addEventListener('input', run));
        container.querySelector('#cv-run').onclick = run;
        run();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Оценка качества</b> — несмещённая метрика перед деплоем.</li>
        <li><b>Tuning гиперпараметров</b> — GridSearchCV, RandomizedSearchCV, Optuna.</li>
        <li><b>Feature selection</b> — проверка, какие признаки добавить.</li>
        <li><b>Model selection</b> — сравнение LightGBM vs CatBoost vs NN.</li>
        <li><b>Stacking / ensembling</b> — получение out-of-fold предсказаний.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Честная оценка качества</li>
            <li>Использует все данные для обучения и тестирования</li>
            <li>Даёт оценку разброса качества</li>
            <li>Стандарт в индустрии</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>k-кратно дольше обучения</li>
            <li>При временных рядах стандартный K-Fold нельзя</li>
            <li>При группах данных — нужен Group K-Fold</li>
            <li>LOO очень дорого</li>
            <li>Data leakage если не аккуратно</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>K-Fold оценка</h3>
      <p>Датасет $D$ разбивается на $D_1, \\dots, D_k$:</p>
      <div class="math-block">$$\\text{CV}_k = \\frac{1}{k}\\sum_{i=1}^{k} \\text{metric}(M_i, D_i)$$</div>
      <p>$M_i$ — модель, обученная на $D \\setminus D_i$.</p>

      <h3>Стандартная ошибка</h3>
      <div class="math-block">$$\\text{SE}(\\text{CV}_k) = \\frac{\\sigma}{\\sqrt{k}}$$</div>
      <p>где σ — std по фолдам.</p>

      <h3>LOO bias-variance</h3>
      <ul>
        <li><b>LOO (k=n)</b>: почти несмещённая оценка, но высокая дисперсия (модели почти идентичны).</li>
        <li><b>5-10 fold</b>: небольшое смещение, умеренная дисперсия.</li>
        <li><b>Hold-out</b>: большая дисперсия, но быстро.</li>
      </ul>
      <p>Стандартный выбор k=5 или k=10 — хороший компромисс.</p>

      <h3>Nested CV</h3>
      <p>Две вложенные петли: внешняя для оценки, внутренняя для настройки:</p>
      <div class="math-block">$$\\text{Nested CV} = \\frac{1}{k_{out}}\\sum_{i=1}^{k_{out}} \\text{metric}(\\text{BestModel}_i, D_i^{out})$$</div>
    `,

    extra: `
      <h3>Time Series Split</h3>
      <p>Для временных рядов нельзя использовать будущее для обучения. Схема:</p>
      <pre>Fold 1: train [1..100], test [101..120]
Fold 2: train [1..120], test [121..140]
Fold 3: train [1..140], test [141..160]</pre>

      <h3>Group K-Fold</h3>
      <p>Если в данных есть группы (один пациент — много записей), записи одного пациента должны быть либо в train, либо в test. Иначе — data leakage.</p>

      <h3>Частые ошибки</h3>
      <ul>
        <li><b>Feature engineering до CV</b> — препроцессинг должен быть внутри каждого fold, иначе leakage. Используй Pipeline.</li>
        <li><b>Оверселектинг</b> — настраиваешь 1000 параметров на валидации, всё равно переобучишься. Используй test set.</li>
        <li><b>Несбалансированные классы + обычный K-Fold</b> — используй StratifiedKFold.</li>
      </ul>

      <h3>Bootstrap оценка</h3>
      <p>Альтернатива CV: семплируем с возвращением n раз, обучаем, оцениваем на out-of-bag примерах. Менее пессимистична, но больше вариативна.</p>

      <h3>Практические советы</h3>
      <ul>
        <li>k=5 для больших данных, k=10 для средних, LOO для маленьких.</li>
        <li>Используй StratifiedKFold по дефолту для классификации.</li>
        <li>cv_results_ в sklearn даёт std — всегда смотри, не только mean.</li>
        <li>Если std большой — модель нестабильна.</li>
      </ul>
    `,
  },
});
