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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты готовишься к экзамену по учебнику с 500 задачами. Если решать все 500 дома, а потом те же самые на экзамене — получишь пятёрку. Но это ничего не говорит о реальных знаниях: ты просто запомнил ответы.</p>
        <p>Честная проверка — отложить часть задач (например, 100), решать только 400, а потом проверять себя на «новых» — тех, что не видел. Это и есть идея валидации.</p>
        <p>Но есть ещё одна проблема: может, эти 100 тестовых задач случайно оказались лёгкими. Или слишком сложными. Одно разбиение — это одна случайная оценка. Поэтому делают <b>много разных разбиений</b> и усредняют. Это и есть кросс-валидация: пять разных «экзаменов» вместо одного.</p>
      </div>

      <h3>Проблема: как честно оценить модель</h3>
      <p>Если оценивать модель на данных, на которых она училась, мы меряем, как хорошо она <b>запомнила</b>, а не как хорошо <b>обобщает</b>. Достаточно сложная модель может запомнить обучение на 100% — но это не значит, что она работает на новых данных.</p>
      <p>Нужна выборка, которую модель <b>не видела</b> при обучении. На ней и измеряем качество. Это основной принцип оценки ML-моделей.</p>

      <h3>Простейший подход: hold-out</h3>
      <p>Делим данные один раз на две части — обучающую (train) и тестовую (test). Например, 80/20:</p>
      <ol>
        <li>Обучаем модель на train.</li>
        <li>Предсказываем на test.</li>
        <li>Считаем метрику.</li>
      </ol>
      <p><b>Проблема:</b> результат зависит от случайного разбиения. Может, в test случайно попали «лёгкие» примеры → оценка слишком оптимистичная. Может, «сложные» → слишком пессимистичная.</p>

      <div class="key-concept">
        <div class="kc-label">Решение</div>
        <p>Сделать <b>много разных разбиений</b>, на каждом обучить модель и оценить, потом усреднить. Это и есть кросс-валидация. Она даёт более устойчивую оценку качества + показатель её разброса (std).</p>
      </div>

      <h3>K-Fold Cross-Validation — стандарт</h3>
      <p>Самый популярный вариант. Делим данные на k равных частей — <span class="term" data-tip="Fold. Одна из k равных частей, на которые разбивается датасет для кросс-валидации.">фолдов</span> (обычно k = 5 или 10). Затем:</p>

      <ol>
        <li>Берём первый fold как test, остальные k-1 — как train. Обучаем, оцениваем.</li>
        <li>Берём второй fold как test, остальные как train. Обучаем <b>заново</b>, оцениваем.</li>
        <li>...и так k раз.</li>
        <li>Усредняем k полученных метрик.</li>
      </ol>

      <p>Результат: k оценок качества, их среднее и стандартное отклонение. Каждая точка участвовала ровно один раз в test и k-1 раз в train.</p>

      <h3>Почему именно k = 5 или 10</h3>
      <p>Выбор k — компромисс между смещением и вычислениями:</p>
      <ul>
        <li><b>Маленькое k (2-3)</b> — train мал, модель обучается на меньшей выборке → <b>смещённая</b> (пессимистичная) оценка.</li>
        <li><b>Большое k (50-100)</b> — train почти полный, но считать долго. Модели в разных фолдах почти идентичны → <b>высокая дисперсия</b> оценки.</li>
        <li><b>k = 5 или 10</b> — эмпирически хороший компромисс.</li>
      </ul>

      <h3>Разновидности кросс-валидации</h3>

      <h4>Stratified K-Fold</h4>
      <p>Для классификации обычный K-Fold может случайно создать fold без какого-то класса (особенно при дисбалансе). <span class="term" data-tip="Stratified sampling. Разбиение, сохраняющее пропорции классов в каждом фолде. При дисбалансе классов — обязательный инструмент.">Stratified K-Fold</span> гарантирует, что доля классов в каждом fold соответствует доле во всей выборке.</p>
      <p><b>Правило:</b> для классификации всегда используй stratified, особенно при дисбалансе.</p>

      <h4>Leave-One-Out (LOO)</h4>
      <p>Экстремальный случай: k = n. Каждый раз обучаем на n−1 примере, тестируем на одном. Требует n обучений модели — <b>очень дорого</b>.</p>
      <p>Плюс: почти несмещённая оценка. Минус: высокая дисперсия + непрактично на больших датасетах. Используют только когда данных очень мало (n < 50).</p>

      <h4>Time Series Split</h4>
      <p>Для временных рядов <b>нельзя</b> использовать обычный K-Fold: будущее не должно попадать в train, иначе модель «подсматривает». Используют специальную схему:</p>
      <pre>Fold 1: train [1..100],  test [101..120]
Fold 2: train [1..120],  test [121..140]
Fold 3: train [1..140],  test [141..160]</pre>
      <p>Train только расширяется, test всегда «после» train.</p>

      <h4>Group K-Fold</h4>
      <p>Когда в данных есть <b>группы</b>, которые не должны разделяться между train и test:</p>
      <ul>
        <li>Один пациент — много записей. Все записи должны быть в одной из частей.</li>
        <li>Один автор — много текстов.</li>
        <li>Один пользователь — много сессий.</li>
      </ul>
      <p>Иначе <span class="term" data-tip="Data leakage. Когда информация из test утекает в train, создавая нереалистично хорошую оценку качества.">data leakage</span>: модель «знает» пациента по другим его записям.</p>

      <h3>Использование CV для подбора гиперпараметров</h3>
      <p>Главное применение кросс-валидации — не только оценка, но и <b>выбор</b> лучшей модели:</p>

      <ol>
        <li>Задаём сетку гиперпараметров: например, {k: 3, 5, 7, 9} для kNN.</li>
        <li>Для <b>каждого</b> набора параметров делаем K-Fold CV.</li>
        <li>Берём набор с лучшей средней метрикой.</li>
      </ol>

      <p>Это называется <span class="term" data-tip="GridSearchCV. Полный перебор всех комбинаций гиперпараметров с оценкой через CV. В sklearn это класс GridSearchCV.">GridSearchCV</span>. Более умная альтернатива — <span class="term" data-tip="RandomizedSearchCV. Случайный поиск в пространстве гиперпараметров. Часто эффективнее Grid Search при больших пространствах.">RandomizedSearchCV</span> (случайный поиск).</p>

      <div class="callout warn">⚠️ <b>Train / Validation / Test — три разные вещи</b>. Train — для обучения. Validation — для подбора гиперпараметров (через CV). Test — финальная оценка, на test нельзя смотреть до самого конца.</div>

      <h3>Nested Cross-Validation</h3>
      <p>Если использовать CV и для подбора гиперпараметров, и для оценки качества одновременно — результат будет <b>переоценен</b>. Потому что мы оптимизируем на тех же данных, что и оцениваем.</p>

      <p>Правильный подход — <b>вложенная</b> CV: внешний цикл для оценки, внутренний — для подбора. Получается дорого (k_outer × k_inner обучений), но это единственный честный способ.</p>

      <h3>Основные риски</h3>

      <h4>Data leakage в препроцессинге</h4>
      <p>Если делать StandardScaler/PCA/feature engineering <b>до</b> разбиения — утечка гарантирована. Правильный порядок: внутри каждого fold обучать препроцессор на train и применять к test.</p>
      <p>Решение: <span class="term" data-tip="sklearn Pipeline. Объединение препроцессинга и модели в один объект, который правильно применяет каждый шаг только к train внутри CV.">Pipeline</span> в sklearn.</p>

      <h4>Переоценка от многократного выбора</h4>
      <p>Если перебираешь сотни гиперпараметров и берёшь лучший — его оценка будет завышена. Случайно один из параметров окажется «удачным» по CV. Спасает test set или nested CV.</p>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«CV заменяет test set»</b> — нет. Если настраиваешь гиперпараметры по CV, нужен отдельный test.</li>
        <li><b>«K=10 всегда лучше K=5»</b> — не обязательно. На больших датасетах разница минимальна, а K=10 в 2 раза дороже.</li>
        <li><b>«Hold-out достаточно»</b> — при маленьких данных разброс результатов огромный. CV обязательна.</li>
        <li><b>«Усреднение = хорошо»</b> — но std по фолдам не менее важен. Если std большой, модель нестабильна.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: bias-variance в CV</summary>
        <div class="deep-dive-body">
          <p>Оценка CV имеет и <b>смещение</b> (bias), и <b>дисперсию</b> (variance):</p>
          <ul>
            <li><b>Bias:</b> оценка может быть систематически занижена (CV-модели обучены на k-1/k данных, не на всех). Чем меньше k — тем больше bias.</li>
            <li><b>Variance:</b> результат может сильно колебаться. Чем больше k (LOO) — тем сильнее коррелированы фолды, тем выше дисперсия среднего.</li>
          </ul>
          <p>k = 5-10 — компромисс: небольшой bias, умеренная variance.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Repeated CV и Bootstrap</summary>
        <div class="deep-dive-body">
          <p><b>Repeated K-Fold:</b> делаем K-Fold несколько раз с разными seed, усредняем. Сглаживает случайность разбиений.</p>
          <p><b>Bootstrap:</b> альтернатива — семплируем n примеров с возвращением, обучаем на этой выборке, оцениваем на «не попавших» (out-of-bag). Даёт чуть оптимистичную оценку, но стандартна в bagging (Random Forest).</p>
          <p><b>0.632 bootstrap:</b> коррекция для устранения оптимистического смещения.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Bias-variance</b> — CV выявляет оба.</li>
        <li><b>Гиперпараметры</b> — CV основной инструмент их подбора.</li>
        <li><b>Метрики</b> — любая метрика оценивается через CV.</li>
        <li><b>Дисбаланс классов</b> — требует Stratified CV.</li>
        <li><b>Регуляризация</b> — λ выбирается через CV.</li>
      </ul>
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
