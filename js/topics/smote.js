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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь школу, где 990 хорошистов и 10 отличников. Учитель хочет определить, что делает ученика отличником. Но проблема: если он просто анализирует всех подряд, отличников <b>почти не видно</b> в общей массе. Результат: учитель скажет «средний школьник — это хорошист», и полностью проигнорирует отличников.</p>
        <p>Та же проблема с моделями: если класс A встречается в 100 раз чаще класса B, модель может сказать «все относятся к A» и получить 99% точности. Формально выглядит отлично, практически — бесполезно.</p>
        <p>Нужны специальные техники, чтобы модель «обращала внимание» на редкий класс. SMOTE — одна из них: синтезирует новых «отличников» на основе существующих, делая класс более заметным.</p>
      </div>

      <h3>Проблема дисбаланса</h3>
      <p>Дисбаланс классов — это ситуация, когда один класс в данных встречается намного чаще другого:</p>
      <ul>
        <li><b>Fraud detection</b>: 99.9% обычных транзакций, 0.1% мошеннических.</li>
        <li><b>Медицина</b>: редкие болезни — 1 случай на 10 000.</li>
        <li><b>Отказ оборудования</b>: 99% нормальной работы, 1% поломок.</li>
        <li><b>Отток клиентов</b>: 95% остаются, 5% уходят.</li>
      </ul>

      <p><b>Почему это плохо для обучения:</b></p>
      <ul>
        <li>Модель <b>не видит достаточно</b> примеров редкого класса, чтобы выучить его.</li>
        <li>Оптимизатор идёт по пути наименьшего сопротивления: «всегда предсказывай большинство» — даёт 99% accuracy.</li>
        <li>Стандартные метрики (accuracy) обманывают.</li>
        <li>Информативные признаки редкого класса теряются в шуме.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главное правило</div>
        <p>При дисбалансе классов <b>никогда не смотри только на accuracy</b>. Модель «всегда 0» на 99% дисбалансе даёт 99% accuracy, но 0% recall на редком классе. Используй precision, recall, F1, AUPRC.</p>
      </div>

      <h3>Три подхода к решению</h3>

      <h4>1. Работа с данными (resampling)</h4>
      <p>Балансируем классы через изменение данных:</p>

      <ul>
        <li><span class="term" data-tip="Undersampling. Случайное удаление примеров большинства до достижения баланса с меньшинством. Быстро, но теряем информацию.">Undersampling</span> — удаляем примеры большинства, пока классы не станут равными.
          <ul>
            <li>+ Быстро, проще.</li>
            <li>− Теряем информацию.</li>
          </ul>
        </li>
        <li><span class="term" data-tip="Oversampling. Дублирование примеров меньшинства до достижения баланса. Простое, но может усилить переобучение.">Oversampling</span> — дублируем примеры меньшинства.
          <ul>
            <li>+ Не теряем данные.</li>
            <li>− Модель может переобучиться на дубликатах.</li>
          </ul>
        </li>
        <li><b>SMOTE</b> — синтезируем <b>новые</b> примеры меньшинства между существующими.</li>
        <li><b>ADASYN</b> — SMOTE, фокусирующийся на «сложных» примерах.</li>
        <li><b>Tomek Links, ENN</b> — умное удаление пограничных примеров большинства.</li>
      </ul>

      <h4>2. Работа с моделью</h4>
      <p>Оставляем данные как есть, но меняем обучение:</p>

      <ul>
        <li><span class="term" data-tip="Class weights. Коэффициенты, умножающие loss для каждого класса. Большой вес у редкого класса заставляет модель обращать на него больше внимания.">Class weights</span> — штрафуем ошибки в редком классе сильнее. В sklearn: <code>class_weight='balanced'</code>.</li>
        <li><b>Смещение порога</b> — если модель выдаёт вероятности, понижаем порог с 0.5 до, например, 0.1.</li>
        <li><span class="term" data-tip="Focal Loss. Функция потерь, которая понижает вес 'лёгких' примеров и акцентирует внимание на 'сложных'. Полезна при экстремальном дисбалансе.">Focal Loss</span> — модификация loss, которая игнорирует «лёгкие» примеры и фокусируется на «сложных».</li>
      </ul>

      <h4>3. Работа с метриками</h4>
      <p>Меняем способ оценки:</p>
      <ul>
        <li>Precision/Recall/F1 для меньшинства.</li>
        <li>ROC-AUC и особенно <b>PR-AUC (AUPRC)</b> при сильном дисбалансе.</li>
        <li>Cost-sensitive метрики с бизнес-весами.</li>
        <li>Stratified K-Fold CV обязательна.</li>
      </ul>

      <h3>Как работает SMOTE подробно</h3>
      <p><span class="term" data-tip="Synthetic Minority Over-sampling Technique. Алгоритм, создающий синтетические примеры меньшинства через интерполяцию между существующими.">SMOTE</span> (Synthetic Minority Over-sampling Technique) — классический алгоритм. Идея: вместо дублирования существующих примеров, создавать <b>новые</b> между ними.</p>

      <p>Алгоритм для каждого нового примера:</p>
      <ol>
        <li>Выбираем случайный пример $x$ из меньшинства.</li>
        <li>Находим его $k$ ближайших соседей (обычно k=5) <b>из того же класса</b>.</li>
        <li>Случайно выбираем одного соседа $x'$ из этих k.</li>
        <li>Генерируем случайное число $\\alpha \\in [0, 1]$.</li>
        <li>Новый пример: $x_{\\text{new}} = x + \\alpha \\cdot (x' - x)$.</li>
      </ol>

      <p>Геометрически: новая точка лежит на <b>отрезке</b> между $x$ и одним из его соседей. То есть мы <b>интерполируем</b> внутри «облака» меньшинства.</p>

      <p><b>Почему это работает:</b> мы не копируем точки, а создаём новые «похожие» примеры в том же регионе пространства. Модель видит более полную картину класса.</p>

      <h3>Варианты SMOTE</h3>
      <ul>
        <li><b>BorderlineSMOTE</b> — генерирует примеры только около <b>границы</b> с другим классом. Фокус на «сложных» примерах.</li>
        <li><b>ADASYN</b> — Adaptive Synthetic Sampling. Больше синтетических примеров для «сложных» регионов (где соседи разного класса).</li>
        <li><b>SVMSMOTE</b> — использует SVM для определения границы.</li>
        <li><b>SMOTE-Tomek</b> — после SMOTE удаляет перекрывающиеся пары классов.</li>
        <li><b>SMOTE-ENN</b> — после SMOTE применяет Edited Nearest Neighbors для чистки.</li>
        <li><b>SMOTE-NC</b> — для <span class="term" data-tip="Nominal Continuous. Смешанные данные с категориальными и числовыми признаками. Обычный SMOTE работает только с числовыми.">смешанных данных</span> (категориальные + числовые).</li>
      </ul>

      <h3>Важные правила применения SMOTE</h3>

      <div class="callout warn">⚠️ <b>SMOTE — только на train!</b> Никогда не применяй его к validation/test. Иначе синтетические точки утекут из train в test → завышенная оценка качества. Это грубая форма data leakage.</div>

      <p>Правильный порядок действий:</p>
      <ol>
        <li>Разбить данные на train/test.</li>
        <li>Применить SMOTE <b>только к train</b>.</li>
        <li>Обучить модель на balanced train.</li>
        <li>Оценить на исходном (несбалансированном) test.</li>
      </ol>

      <p>В sklearn это делается через <code>imblearn.pipeline.Pipeline</code>.</p>

      <h3>Когда SMOTE плохо работает</h3>
      <ul>
        <li><b>Высокая размерность</b> — «проклятие размерности», соседи перестают быть похожими.</li>
        <li><b>Категориальные признаки</b> — интерполяция бессмысленна (нельзя на 0.7 соединить «Москва» и «Лондон»). Нужен SMOTE-NC.</li>
        <li><b>Кластерная структура</b> — SMOTE может сгенерировать точки между кластерами меньшинства в «пустоте».</li>
        <li><b>Сильный overlap с большинством</b> — SMOTE усугубит, создавая точки внутри класса большинства.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«SMOTE всегда помогает»</b> — нет. Иногда простой <code>class_weight='balanced'</code> работает лучше.</li>
        <li><b>«Нужно балансировать до 50/50»</b> — не обязательно. Часто оптимум — 20-30% меньшинства.</li>
        <li><b>«SMOTE можно применять к test»</b> — нет, это серьёзная ошибка.</li>
        <li><b>«SMOTE устраняет нужду в правильных метриках»</b> — всё равно используй PR-AUC, F1, recall.</li>
        <li><b>«Дисбаланс 60/40 — это дисбаланс»</b> — почти нет. Проблемы начинаются с 90/10 и жёстче.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: когда дисбаланс — не проблема</summary>
        <div class="deep-dive-body">
          <p>Удивительно, но дисбаланс сам по себе <b>не всегда</b> проблема. Настоящая проблема — когда:</p>
          <ul>
            <li>Редкого класса <b>слишком мало</b> в абсолютных числах (скажем, 50 примеров).</li>
            <li>Редкий класс сложно отличить от большинства.</li>
            <li>Модель и метрика чувствительны к дисбалансу.</li>
          </ul>
          <p>Если у тебя 1% редкого класса, но это 10 000 примеров — модели часто справляются без SMOTE. Проверяй эмпирически.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: anomaly detection как альтернатива</summary>
        <div class="deep-dive-body">
          <p>При экстремальном дисбалансе (1:1000+) классификация часто уступает место <b>anomaly detection</b>: обучаем модель только на нормальных данных, всё «не похожее» — аномалия.</p>
          <ul>
            <li><b>Isolation Forest</b> — строит деревья, аномалии изолируются быстрее.</li>
            <li><b>One-Class SVM</b> — учит границу «нормы».</li>
            <li><b>Autoencoder</b> — смотрит на reconstruction error.</li>
            <li><b>Local Outlier Factor</b> — плотностный подход.</li>
          </ul>
          <p>Их плюс: не нужен размеченный меньшинство. Особенно полезно для fraud и отказов оборудования.</p>
        </div>
      </div>

      <h3>Практический план</h3>
      <ol>
        <li><b>Проверь дисбаланс:</b> посчитай доли классов.</li>
        <li><b>Выбери правильную метрику:</b> F1, PR-AUC, Recall — но не accuracy.</li>
        <li><b>Начни с простого:</b> <code>class_weight='balanced'</code> часто достаточно.</li>
        <li><b>Если не помогло:</b> попробуй SMOTE + class_weight.</li>
        <li><b>Настрой порог</b> решения под бизнес-задачу.</li>
        <li><b>Мониторь</b> precision и recall по обоим классам.</li>
        <li><b>Если экстремальный дисбаланс (<1%):</b> рассмотри anomaly detection.</li>
      </ol>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Метрики классификации</b> — дисбаланс диктует выбор метрики.</li>
        <li><b>ROC-AUC vs PR-AUC</b> — при дисбалансе предпочти PR-AUC.</li>
        <li><b>Cross-validation</b> — обязательно Stratified.</li>
        <li><b>Anomaly detection</b> — альтернатива при экстремальном дисбалансе.</li>
        <li><b>Class weights</b> — встроены в большинство моделей sklearn.</li>
      </ul>
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
