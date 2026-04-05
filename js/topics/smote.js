/* ==========================================================================
   Дисбаланс классов и SMOTE
   ========================================================================== */
App.registerTopic({
  id: 'smote',
  category: 'ml-basics',
  title: 'Дисбаланс классов и SMOTE',
  summary: 'Что делать, когда одного класса в 100 раз меньше другого.',

  tabs: {
    theory: `
      <h3>Проблема дисбаланса</h3>
      <p>Fraud detection: 99.9% обычных транзакций, 0.1% мошеннических. Модель научится всегда предсказывать «не fraud» — accuracy 99.9%, но ловит 0 мошенников. Бесполезно.</p>

      <h3>Подходы к решению</h3>
      <h4>1. Работа с данными</h4>
      <ul>
        <li><b>Undersampling</b> — удалить примеры большинства до баланса. Быстро, но теряем информацию.</li>
        <li><b>Oversampling</b> — дублировать примеры меньшинства. Просто, но усиливает переобучение.</li>
        <li><b>SMOTE</b> — синтезировать новые примеры меньшинства.</li>
        <li><b>ADASYN</b> — SMOTE с акцентом на сложные примеры.</li>
      </ul>

      <h4>2. Работа с моделью</h4>
      <ul>
        <li><b>Class weights</b> — штрафовать ошибки в редком классе сильнее.</li>
        <li><b>Изменение порога</b> — снизить порог для положительного класса.</li>
        <li><b>Focal loss</b> — убирает вес у «лёгких» примеров.</li>
      </ul>

      <h4>3. Работа с метриками</h4>
      <ul>
        <li>Не смотри на accuracy.</li>
        <li>Используй F1, AUPRC, Recall, cost-sensitive metrics.</li>
      </ul>

      <h3>Как работает SMOTE</h3>
      <p>Synthetic Minority Oversampling Technique:</p>
      <ol>
        <li>Для каждого примера x из меньшинства найти k ближайших соседей из того же класса.</li>
        <li>Случайно выбрать одного соседа x'.</li>
        <li>Создать новую точку $x_{new} = x + \\alpha (x' - x)$, где $\\alpha \\in [0, 1]$ случайно.</li>
      </ol>
      <p>Новая точка лежит на отрезке между x и x'. «Интерполяция» внутри класса.</p>

      <div class="callout warn">⚠️ SMOTE применять только к train, никогда к validation/test. Иначе — data leakage и фальшиво хорошие метрики.</div>
    `,

    examples: `
      <h3>Пример 1: class_weight</h3>
      <div class="example-card">
        <p>1000 примеров, 950 класса 0, 50 класса 1 (дисбаланс 19:1). В sklearn:</p>
        <div class="example-data">class_weight = {0: 1, 1: 19}
или
class_weight = 'balanced'  # n_samples / (n_classes · n_per_class)</div>
        <p>Эквивалентно дублированию каждого примера класса 1 в 19 раз, но без реального копирования.</p>
      </div>

      <h3>Пример 2: SMOTE в 2D</h3>
      <div class="example-card">
        <div class="example-data">Меньшинство: A=(1,2), B=(3,4), C=(2,6)
k=2 ближайших соседа для A: B, C
Случайно выбираем B, α=0.4
x_new = (1,2) + 0.4·((3,4)-(1,2)) = (1.8, 2.8)</div>
        <p>Так создаём примеры внутри «области» меньшинства.</p>
      </div>

      <h3>Пример 3: threshold tuning</h3>
      <div class="example-card">
        <p>Вероятности модели:</p>
        <pre>default threshold 0.5: precision 0.9, recall 0.3
threshold 0.3: precision 0.7, recall 0.6
threshold 0.1: precision 0.3, recall 0.9</pre>
        <p>Для fraud detection понижаем порог — важнее recall.</p>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: дисбаланс и SMOTE</h3>
        <p>Смотри, как SMOTE создаёт синтетические примеры меньшинства.</p>
        <div class="sim-container">
          <div class="sim-controls" id="smote-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="smote-apply">✨ Применить SMOTE</button>
            <button class="btn secondary" id="smote-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;"><canvas id="smote-chart"></canvas></div>
            <div class="sim-stats" id="smote-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#smote-controls');
        const cImb = App.makeControl('range', 'smote-imb', 'Соотношение (1:N)', { min: 2, max: 30, step: 1, value: 10 });
        const cN = App.makeControl('range', 'smote-n', 'Размер большинства', { min: 50, max: 300, step: 10, value: 150 });
        const cK = App.makeControl('range', 'smote-k', 'k (соседей)', { min: 2, max: 10, step: 1, value: 5 });
        const cRatio = App.makeControl('range', 'smote-ratio', 'Целевое соотн.', { min: 0.3, max: 1, step: 0.05, value: 1 });
        [cImb, cN, cK, cRatio].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let majority = [], minority = [], synthetic = [];

        function regen() {
          const n = +cN.input.value, imb = +cImb.input.value;
          majority = []; minority = []; synthetic = [];
          for (let i = 0; i < n; i++) {
            majority.push({ x: App.Util.randn(-0.6, 0.35), y: App.Util.randn(-0.2, 0.35) });
          }
          const minN = Math.floor(n / imb);
          for (let i = 0; i < minN; i++) {
            minority.push({ x: App.Util.randn(0.8, 0.25), y: App.Util.randn(0.5, 0.25) });
          }
          draw();
        }

        function applySMOTE() {
          const k = +cK.input.value;
          const targetRatio = +cRatio.input.value;
          const target = Math.floor(majority.length * targetRatio);
          const need = Math.max(0, target - minority.length);
          synthetic = [];
          for (let i = 0; i < need; i++) {
            const base = minority[Math.floor(Math.random() * minority.length)];
            const dists = minority.filter(p => p !== base).map(p => ({ p, d: (p.x - base.x) ** 2 + (p.y - base.y) ** 2 }));
            dists.sort((a, b) => a.d - b.d);
            const neighbor = dists[Math.floor(Math.random() * Math.min(k, dists.length))].p;
            const alpha = Math.random();
            synthetic.push({
              x: base.x + alpha * (neighbor.x - base.x),
              y: base.y + alpha * (neighbor.y - base.y),
            });
          }
          draw();
        }

        function draw() {
          const ctx = container.querySelector('#smote-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: `Большинство (${majority.length})`, data: majority, backgroundColor: 'rgba(239,68,68,0.4)', pointRadius: 4 },
                { label: `Меньшинство (${minority.length})`, data: minority, backgroundColor: 'rgba(59,130,246,0.8)', pointRadius: 6 },
                { label: `SMOTE синт. (${synthetic.length})`, data: synthetic, backgroundColor: 'rgba(16,185,129,0.7)', pointRadius: 5, pointStyle: 'triangle' },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: { x: { type: 'linear', min: -2, max: 2 }, y: { min: -2, max: 2 } },
            },
          });
          App.registerChart(chart);

          const total = majority.length + minority.length + synthetic.length;
          const newRatio = (minority.length + synthetic.length) / total;
          container.querySelector('#smote-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Большинство</div><div class="stat-value">${majority.length}</div></div>
            <div class="stat-card"><div class="stat-label">Меньшинство</div><div class="stat-value">${minority.length}</div></div>
            <div class="stat-card"><div class="stat-label">Синтетических</div><div class="stat-value">${synthetic.length}</div></div>
            <div class="stat-card"><div class="stat-label">Новая доля минор.</div><div class="stat-value">${(newRatio * 100).toFixed(0)}%</div></div>
          `;
        }

        [cImb, cN].forEach(c => c.input.addEventListener('change', regen));
        container.querySelector('#smote-apply').onclick = applySMOTE;
        container.querySelector('#smote-regen').onclick = regen;
        regen();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Fraud detection</b> — мошенничество редко, но критично.</li>
        <li><b>Медицинская диагностика</b> — редкие заболевания.</li>
        <li><b>Отток клиентов (churn)</b> — обычно 5-15% уходят.</li>
        <li><b>Отказы оборудования</b> — поломки редки.</li>
        <li><b>Обнаружение аномалий</b> — по определению дисбаланс.</li>
        <li><b>Распознавание намерений</b> — редкие, но важные классы.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Что помогает</h4>
          <ul>
            <li>SMOTE для табличных данных</li>
            <li>Class weights в деревьях и логрег</li>
            <li>Изменение порога решения</li>
            <li>Правильные метрики (F1, AUPRC, Recall)</li>
            <li>Фокус на recall для редкого класса</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Не помогает / вредит</h4>
          <ul>
            <li>SMOTE в высоких размерностях плохо работает</li>
            <li>Простое дублирование — усиливает overfit</li>
            <li>SMOTE + test set = утечка</li>
            <li>Undersampling теряет информацию</li>
            <li>Accuracy при дисбалансе обманывает</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>SMOTE формула</h3>
      <p>Для точки $x_i$ из меньшинства и случайно выбранного соседа $x_{nn}$ из kNN:</p>
      <div class="math-block">$$x_{\\text{new}} = x_i + \\alpha \\cdot (x_{nn} - x_i), \\quad \\alpha \\sim U[0, 1]$$</div>

      <h3>Class weights</h3>
      <p>Взвешенная функция потерь:</p>
      <div class="math-block">$$L = \\sum_i w_{c(i)} \\cdot \\ell(y_i, \\hat{y}_i)$$</div>
      <p>Обычно $w_c = \\frac{n}{K \\cdot n_c}$ для баланса.</p>

      <h3>Focal Loss</h3>
      <p>Для подавления «лёгких» примеров:</p>
      <div class="math-block">$$\\text{FL}(p_t) = -(1 - p_t)^\\gamma \\log(p_t)$$</div>
      <p>$\\gamma > 0$ — если модель уже уверена, штраф мал.</p>

      <h3>Cost-sensitive classification</h3>
      <p>Матрица стоимостей ошибок $C_{ij}$ = стоимость предсказать i, когда реально j. Минимизируем ожидаемую стоимость.</p>
    `,

    extra: `
      <h3>Варианты SMOTE</h3>
      <ul>
        <li><b>BorderlineSMOTE</b> — генерирует только около границы классов.</li>
        <li><b>SVMSMOTE</b> — использует SVM для определения границы.</li>
        <li><b>ADASYN</b> — больше сэмплов в «трудных» областях.</li>
        <li><b>SMOTE-Tomek</b> — SMOTE + удаление пересекающихся точек.</li>
        <li><b>SMOTE-ENN</b> — SMOTE + Edited Nearest Neighbors.</li>
      </ul>

      <h3>Когда SMOTE плохо работает</h3>
      <ul>
        <li>Высокая размерность — «проклятие размерности», соседи не похожи.</li>
        <li>Категориальные признаки — интерполяция бессмысленна (используй SMOTE-NC).</li>
        <li>Кластерная структура меньшинства — может генерировать между кластерами.</li>
      </ul>

      <h3>Stratified sampling в CV</h3>
      <p>При дисбалансе обязательно StratifiedKFold — иначе fold может оказаться без примеров редкого класса.</p>

      <h3>Практический план</h3>
      <ol>
        <li>Начать с class_weight='balanced' — проще всего.</li>
        <li>Посмотреть на PR-кривую и ROC.</li>
        <li>Настроить порог под бизнес.</li>
        <li>Если мало данных меньшинства — попробовать SMOTE.</li>
        <li>Мониторить метрики для обоих классов.</li>
      </ol>

      <h3>Anomaly detection как альтернатива</h3>
      <p>Если дисбаланс очень сильный (1:1000+), возможно это не классификация, а поиск аномалий: Isolation Forest, One-Class SVM, Autoencoder.</p>
    `,
  },
});
