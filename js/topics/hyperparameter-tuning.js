/* ==========================================================================
   Hyperparameter Tuning
   ========================================================================== */
App.registerTopic({
  id: 'hyperparameter-tuning',
  category: 'ml-basics',
  title: 'Подбор гиперпараметров',
  summary: 'Как найти лучшие настройки модели: Grid Search, Random Search, Bayesian Optimization и Hyperband.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты готовишь блюдо. Ингредиенты — это данные, рецепт — это алгоритм (Random Forest, XGBoost и т.д.), а вот <b>температура духовки</b> и <b>время запекания</b> — это гиперпараметры.</p>
        <p>Алгоритм сам «учится» готовить блюдо (подбирает параметры модели), но температуру и время ты задаёшь <b>до начала</b> готовки. Если поставишь 100°C на 10 минут — блюдо сырое (<a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">underfitting</a>). Если 300°C на 2 часа — сгорит (<a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">overfitting</a>).</p>
        <p>Подбор гиперпараметров — это поиск той самой «идеальной температуры и времени», при которых блюдо получается лучше всего. Можно перебрать все комбинации (Grid Search), тыкать наугад (Random Search) или умно пробовать, учась на предыдущих попытках (Bayesian Optimization).</p>
      </div>

      <h3>Параметры vs Гиперпараметры</h3>
      <p>Это ключевое различие, которое многие путают:</p>

      <table>
        <tr><th></th><th>Параметры модели</th><th>Гиперпараметры</th></tr>
        <tr><td><b>Кто задаёт</b></td><td>Модель учит сама</td><td>Вы задаёте до обучения</td></tr>
        <tr><td><b>Когда</b></td><td>Во время обучения (fit)</td><td>До обучения</td></tr>
        <tr><td><b>Примеры</b></td><td>Веса нейросети, коэфф. линейной регрессии, разбиения дерева</td><td>learning_rate, max_depth, n_estimators, C, gamma</td></tr>
        <tr><td><b>Как оптимизировать</b></td><td>Градиентный спуск, жадный алгоритм</td><td>Grid Search, Random Search, Optuna</td></tr>
        <tr><td><b>Количество</b></td><td>Тысячи — миллиарды</td><td>Обычно 3–15</td></tr>
      </table>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Гиперпараметры контролируют <b>сложность</b> и <b>поведение</b> модели. Неправильные гиперпараметры → модель либо недообучена, либо переобучена. Правильный подбор может поднять качество на 5–15% без изменения алгоритма или данных.</p>
      </div>

      <h3>Типичные гиперпараметры популярных моделей</h3>
      <table>
        <tr><th>Модель</th><th>Гиперпараметр</th><th>Что контролирует</th><th>Типичный диапазон</th></tr>
        <tr><td rowspan="3"><b>Random Forest</b></td><td>n_estimators</td><td>Кол-во деревьев</td><td>100–1000</td></tr>
        <tr><td>max_depth</td><td>Макс. глубина деревьев</td><td>5–30 или None</td></tr>
        <tr><td>min_samples_split</td><td>Мин. объектов для разбиения</td><td>2–20</td></tr>
        <tr><td rowspan="3"><b><a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting</b></td><td>learning_rate</td><td>Скорость обучения</td><td>0.001–0.3</td></tr>
        <tr><td>n_estimators</td><td>Кол-во деревьев</td><td>100–3000</td></tr>
        <tr><td>max_depth</td><td>Глубина деревьев</td><td>3–10</td></tr>
        <tr><td rowspan="3"><b>SVM</b></td><td>C</td><td>Штраф за ошибки</td><td>0.01–100 (log-scale)</td></tr>
        <tr><td>gamma</td><td>Ширина ядра RBF</td><td>0.001–10 (log-scale)</td></tr>
        <tr><td>kernel</td><td>Тип ядра</td><td>linear, rbf, poly</td></tr>
        <tr><td rowspan="3"><b>Neural Networks</b></td><td>learning_rate</td><td>Шаг градиентного спуска</td><td>1e-5–1e-1 (log-scale)</td></tr>
        <tr><td>batch_size</td><td>Размер мини-батча</td><td>16–512</td></tr>
        <tr><td>layers/neurons</td><td>Архитектура сети</td><td>1–5 слоёв, 32–512 нейронов</td></tr>
      </table>

      <h3>Метод 1: GridSearchCV — полный перебор</h3>
      <p>Самый простой подход: задай <b>сетку</b> значений для каждого гиперпараметра, и sklearn перебирает <b>все комбинации</b>.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 420 280" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
          <text x="210" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">GridSearchCV: 3x3 = 9 комбинаций</text>
          <!-- Axes -->
          <text x="210" y="38" text-anchor="middle" font-size="10" fill="#64748b">n_estimators</text>
          <text x="30" y="160" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,30,160)">max_depth</text>
          <!-- Grid labels top -->
          <text x="130" y="58" text-anchor="middle" font-size="10" fill="#475569">100</text>
          <text x="220" y="58" text-anchor="middle" font-size="10" fill="#475569">200</text>
          <text x="310" y="58" text-anchor="middle" font-size="10" fill="#475569">300</text>
          <!-- Grid labels left -->
          <text x="65" y="105" text-anchor="end" font-size="10" fill="#475569">5</text>
          <text x="65" y="165" text-anchor="end" font-size="10" fill="#475569">10</text>
          <text x="65" y="225" text-anchor="end" font-size="10" fill="#475569">15</text>
          <!-- Row 1 -->
          <rect x="86" y="72" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="130" y="98" text-anchor="middle" font-size="11" fill="#4338ca">0.82</text>
          <rect x="176" y="72" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="220" y="98" text-anchor="middle" font-size="11" fill="#4338ca">0.84</text>
          <rect x="266" y="72" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="310" y="98" text-anchor="middle" font-size="11" fill="#4338ca">0.84</text>
          <!-- Row 2 -->
          <rect x="86" y="132" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="130" y="158" text-anchor="middle" font-size="11" fill="#4338ca">0.86</text>
          <rect x="176" y="132" width="88" height="45" rx="6" fill="#dcfce7" stroke="#10b981" stroke-width="2.5"/>
          <text x="220" y="158" text-anchor="middle" font-size="12" font-weight="700" fill="#065f46">0.91</text>
          <rect x="266" y="132" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="310" y="158" text-anchor="middle" font-size="11" fill="#4338ca">0.90</text>
          <!-- Row 3 -->
          <rect x="86" y="192" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="130" y="218" text-anchor="middle" font-size="11" fill="#4338ca">0.85</text>
          <rect x="176" y="192" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="220" y="218" text-anchor="middle" font-size="11" fill="#4338ca">0.89</text>
          <rect x="266" y="192" width="88" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1"/>
          <text x="310" y="218" text-anchor="middle" font-size="11" fill="#4338ca">0.88</text>
          <text x="210" y="268" text-anchor="middle" font-size="10" fill="#065f46">Лучшая комбинация: n_estimators=200, max_depth=10 → accuracy=0.91</text>
        </svg>
        <div class="caption">GridSearch перебирает все 9 комбинаций. Зелёная ячейка — лучший результат. Каждая оценка — среднее по 5-fold CV.</div>
      </div>

      <p><b>Проблема:</b> экспоненциальный рост. Если у вас 5 гиперпараметров по 4 значения каждый — это 4<sup>5</sup> = 1024 комбинации. С 5-fold CV — 5120 обучений модели!</p>

      <div class="math-block">$$\\text{Кол-во комбинаций} = \\prod_{i=1}^{k} |G_i|$$</div>
      <p>где |G<sub>i</sub>| — количество значений в сетке для i-го гиперпараметра.</p>

      <h3>Метод 2: RandomizedSearchCV — случайный поиск</h3>
      <p>Вместо перебора всех комбинаций — семплируем <b>случайные точки</b> из пространства гиперпараметров. Задаёте бюджет (n_iter) и распределения.</p>

      <div class="key-concept">
        <div class="kc-label">Почему Random Search часто не хуже Grid Search</div>
        <p>Бергстра и Бенжио (2012) доказали: если один из гиперпараметров важнее остальных, Random Search покрывает <b>больше уникальных значений</b> важного параметра при том же бюджете. Grid Search тратит вычисления на все комбинации неважных параметров.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <text x="260" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Grid Search vs Random Search (9 точек)</text>
          <!-- Grid Search -->
          <text x="130" y="40" text-anchor="middle" font-size="11" font-weight="600" fill="#4338ca">Grid Search</text>
          <rect x="40" y="50" width="180" height="150" rx="4" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          <circle cx="70" cy="80" r="5" fill="#6366f1"/><circle cx="130" cy="80" r="5" fill="#6366f1"/><circle cx="190" cy="80" r="5" fill="#6366f1"/>
          <circle cx="70" cy="125" r="5" fill="#6366f1"/><circle cx="130" cy="125" r="5" fill="#6366f1"/><circle cx="190" cy="125" r="5" fill="#6366f1"/>
          <circle cx="70" cy="170" r="5" fill="#6366f1"/><circle cx="130" cy="170" r="5" fill="#6366f1"/><circle cx="190" cy="170" r="5" fill="#6366f1"/>
          <text x="130" y="215" text-anchor="middle" font-size="9" fill="#64748b">3 уникальных значения по каждой оси</text>
          <!-- Random Search -->
          <text x="390" y="40" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">Random Search</text>
          <rect x="300" y="50" width="180" height="150" rx="4" fill="none" stroke="#e5e7eb" stroke-width="1"/>
          <circle cx="325" cy="72" r="5" fill="#ef4444"/><circle cx="410" cy="95" r="5" fill="#ef4444"/><circle cx="355" cy="145" r="5" fill="#ef4444"/>
          <circle cx="460" cy="68" r="5" fill="#ef4444"/><circle cx="380" cy="175" r="5" fill="#ef4444"/><circle cx="315" cy="115" r="5" fill="#ef4444"/>
          <circle cx="445" cy="155" r="5" fill="#ef4444"/><circle cx="370" cy="85" r="5" fill="#ef4444"/><circle cx="430" cy="130" r="5" fill="#ef4444"/>
          <text x="390" y="215" text-anchor="middle" font-size="9" fill="#64748b">9 уникальных значений по каждой оси</text>
        </svg>
        <div class="caption">При одинаковом бюджете (9 точек) Random Search покрывает гораздо больше уникальных значений каждого гиперпараметра.</div>
      </div>

      <h3>Метод 3: Bayesian Optimization (Optuna, Hyperopt)</h3>
      <p>Самый умный подход. Вместо слепого перебора строит <b>суррогатную модель</b>, которая предсказывает, какие комбинации гиперпараметров дадут лучший результат, и целенаправленно пробует перспективные области.</p>

      <p><b>Как работает:</b></p>
      <ol>
        <li>Пробуем несколько случайных комбинаций (разведка).</li>
        <li>Строим суррогатную модель (Gaussian Process или TPE) по уже оценённым точкам.</li>
        <li>Выбираем следующую точку там, где суррогатная модель предсказывает улучшение (acquisition function).</li>
        <li>Оцениваем реальное качество, обновляем суррогатную модель.</li>
        <li>Повторяем шаги 3–4 до исчерпания бюджета.</li>
      </ol>

      <div class="deep-dive">
        <h4>TPE (Tree-structured Parzen Estimator) — метод Optuna</h4>
        <p>Вместо GP моделирует два распределения: p(x | y < y*) — «хорошие» параметры и p(x | y >= y*) — «плохие». Выбирает x, максимизирующий отношение этих распределений. Быстрее GP при высокой размерности.</p>
      </div>

      <h3>Метод 4: Successive Halving / Hyperband</h3>
      <p>Идея: не нужно обучать <b>каждую</b> конфигурацию до конца. Плохие варианты видно рано.</p>
      <ol>
        <li>Запускаем много конфигураций с маленьким бюджетом (мало итераций / данных).</li>
        <li>Оставляем лучшую половину, удваиваем бюджет.</li>
        <li>Повторяем, пока не останется одна конфигурация с полным бюджетом.</li>
      </ol>

      <p><b>Пример:</b> 64 конфигурации → 32 лучших (2 эпохи) → 16 лучших (4 эпохи) → 8 (8 эпох) → 4 (16 эпох) → 2 (32 эпохи) → 1 победитель (64 эпохи). Вместо 64 полных обучений — суммарно как ~8 полных.</p>

      <h3>Сравнение методов</h3>
      <table>
        <tr><th>Метод</th><th>Бюджет</th><th>Когда использовать</th><th>Инструменты</th></tr>
        <tr><td><b>Grid Search</b></td><td>Экспоненциальный</td><td>2–3 параметра, мало значений</td><td>sklearn GridSearchCV</td></tr>
        <tr><td><b>Random Search</b></td><td>Фиксированный (n_iter)</td><td>Много параметров, первичная разведка</td><td>sklearn RandomizedSearchCV</td></tr>
        <tr><td><b>Bayesian</b></td><td>Фиксированный (n_trials)</td><td>Дорогие модели, точная настройка</td><td>Optuna, Hyperopt, SMAC</td></tr>
        <tr><td><b>Hyperband</b></td><td>Адаптивный</td><td>Нейронные сети, длительное обучение</td><td>Optuna (с pruner), Ray Tune</td></tr>
      </table>

      <h3>Практические советы</h3>
      <ul>
        <li><b>Всегда используй CV</b> — без кросс-валидации оценка гиперпараметров ненадёжна. Минимум 5-fold.</li>
        <li><b>Log-scale для lr, C, gamma</b> — эти параметры действуют мультипликативно. Разница между 0.001 и 0.01 важнее, чем между 0.01 и 0.1. Поэтому семплируй в лог-шкале: <code>loguniform(1e-4, 1e-1)</code>.</li>
        <li><b>Фиксируй random_state</b> — для воспроизводимости всегда задавай seed в модели и CV-сплиттере.</li>
        <li><b>Начинай с Random Search</b> — быстро находит хороший регион. Потом уточняй Grid Search или Optuna.</li>
        <li><b>Мониторь overfitting</b> — если train score >> val score, параметры ведут к <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучению</a>.</li>
        <li><b>Pipeline!</b> — всегда оборачивай препроцессинг + модель в Pipeline, чтобы не было <a class="glossary-link" onclick="App.selectTopic('glossary-data-leakage')">data leakage</a>.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Золотое правило</div>
        <p>Подбор гиперпараметров — это <b>тоже обучение</b>. Если вы оптимизировали гиперпараметры на валидации, эта валидация больше не является несмещённой оценкой. Для финальной оценки нужен <b>отдельный test set</b> или Nested CV.</p>
      </div>
    `,

    examples: [
      {
        title: 'GridSearch для Random Forest',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Подбираем гиперпараметры Random Forest на датасете из 500 объектов (бинарная классификация). Сетка: <b>n_estimators</b> = {50, 100, 200} и <b>max_depth</b> = {5, 10, 15}. Всего 3 x 3 = 9 комбинаций. Оцениваем каждую по 5-fold CV (accuracy).</p>
          </div>

          <div class="step" data-step="1">
            <h4>Задаём сетку гиперпараметров</h4>
            <div class="calc">param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth':    [5, 10, 15]
}

Всего комбинаций: 3 × 3 = 9
С 5-fold CV: 9 × 5 = 45 обучений модели</div>
            <div class="why">GridSearch перебирает ВСЕ комбинации. 3 значения × 3 значения = 9 точек в сетке. На каждую точку — 5 обучений (по числу фолдов). Итого 45 моделей.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Результаты всех 9 комбинаций</h4>
            <div class="calc">
┌─────────────┬───────────┬──────────────────┬──────────────────┐
│ n_estimators│ max_depth │ mean_cv_accuracy │   std_accuracy   │
├─────────────┼───────────┼──────────────────┼──────────────────┤
│     50      │     5     │     0.832        │     0.028        │
│     50      │    10     │     0.861        │     0.022        │
│     50      │    15     │     0.854        │     0.031        │
│    100      │     5     │     0.838        │     0.025        │
│    100      │    10     │     0.874        │     0.019        │
│    100      │    15     │     0.868        │     0.024        │
│    200      │     5     │     0.841        │     0.023        │
│    200      │    10     │     0.879        │     0.018        │
│    200      │    15     │     0.871        │     0.021        │
└─────────────┴───────────┴──────────────────┴──────────────────┘</div>
            <div class="why">Каждая строка — одна комбинация гиперпараметров. mean_cv_accuracy — среднее по 5 фолдам, std — разброс. Смотрим не только на среднее, но и на стабильность (маленький std — хорошо).</div>
          </div>

          <div class="step" data-step="3">
            <h4>Анализируем закономерности</h4>
            <div class="calc">По max_depth:
  depth=5:  среднее accuracy ≈ 0.837 (<a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">недообучение</a> — деревья слишком мелкие)
  depth=10: среднее accuracy ≈ 0.871 (оптимум — достаточно гибкости)
  depth=15: среднее accuracy ≈ 0.864 (чуть хуже — начало переобучения)

По n_estimators:
  n=50:  среднее accuracy ≈ 0.849 (мало деревьев — нестабильно)
  n=100: среднее accuracy ≈ 0.860 (уже хорошо)
  n=200: среднее accuracy ≈ 0.864 (чуть лучше, но прирост минимален)

Вывод: max_depth важнее, чем n_estimators!</div>
            <div class="why">max_depth контролирует сложность каждого дерева — это главный регулятор bias/variance. n_estimators уменьшает variance (больше деревьев = стабильнее), но после ~100 деревьев эффект затухает.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Выбираем лучшую комбинацию</h4>
            <div class="calc">Лучший результат:
  n_estimators = 200, max_depth = 10
  mean_cv_accuracy = 0.879 ± 0.018

Второе место:
  n_estimators = 100, max_depth = 10
  mean_cv_accuracy = 0.874 ± 0.019

Разница: 0.879 - 0.874 = 0.005 (полпроцента)
При этом 200 деревьев обучаются в 2 раза дольше</div>
            <div class="why">Разница между 1-м и 2-м местом минимальна. На практике часто выбирают более простую модель, если качество сопоставимо. 100 деревьев с depth=10 — хороший компромисс скорость/качество.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>GridSearchCV перебрал 9 комбинаций (45 обучений с 5-fold CV).</p>
            <p>Лучшие параметры: <b>n_estimators=200, max_depth=10</b> → accuracy = <b>0.879 ± 0.018</b></p>
            <p>Главный вывод: max_depth (контроль сложности) влияет сильнее, чем n_estimators (количество деревьев).</p>
          </div>

          <div class="lesson-box">GridSearch гарантирует нахождение лучшей комбинации в сетке, но затраты растут экспоненциально. Для 2–3 параметров с 3–4 значениями — это разумный выбор. Для 5+ параметров — используй Random Search или Optuna.</div>
        `
      },
      {
        title: 'Optuna для XGBoost: Bayesian vs Grid',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравниваем подбор гиперпараметров XGBoost двумя способами: GridSearch (полный перебор) и Optuna (Bayesian Optimization, TPE). Параметры: <b>learning_rate</b> (4 значения), <b>max_depth</b> (3 значения), <b>n_estimators</b> (3 значения), <b>subsample</b> (3 значения). Итого: Grid = 4 × 3 × 3 × 3 = 108 комбинаций. Optuna — бюджет 20 триалов.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Пространство поиска</h4>
            <div class="calc">learning_rate: [0.01, 0.05, 0.1, 0.2]
max_depth:     [3, 5, 7]
n_estimators:  [100, 300, 500]
subsample:     [0.7, 0.8, 1.0]

GridSearch: 4 × 3 × 3 × 3 = 108 комбинаций
С 5-fold CV: 108 × 5 = 540 обучений

Optuna: 20 триалов × 5 фолдов = 100 обучений
Экономия: 540 / 100 = 5.4× меньше вычислений</div>
            <div class="why">Уже при 4 гиперпараметрах Grid Search требует 540 обучений. Optuna с бюджетом 20 триалов — всего 100. При этом Optuna «умно» выбирает, куда смотреть дальше.</div>
          </div>

          <div class="step" data-step="2">
            <h4>GridSearch: лучший результат из 108 комбинаций</h4>
            <div class="calc">GridSearch обучил 540 моделей.
Время: ~45 минут

Топ-3 результата:
1. lr=0.05, depth=5, n=500, sub=0.8  → accuracy = 0.912 ± 0.015
2. lr=0.1,  depth=5, n=300, sub=0.8  → accuracy = 0.910 ± 0.017
3. lr=0.05, depth=5, n=300, sub=1.0  → accuracy = 0.908 ± 0.016

Лучший: <b>accuracy = 0.912</b></div>
            <div class="why">GridSearch нашёл оптимум — 0.912. Но потратил 45 минут на перебор ВСЕХ 108 комбинаций, хотя большинство из них давали accuracy < 0.88.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Optuna: 20 триалов с TPE</h4>
            <div class="calc">Trial  1: lr=0.15, depth=4, n=230, sub=0.85 → 0.878  (случайный)
Trial  2: lr=0.02, depth=6, n=410, sub=0.72 → 0.885  (случайный)
Trial  3: lr=0.08, depth=3, n=150, sub=0.95 → 0.871  (случайный)
Trial  4: lr=0.18, depth=7, n=120, sub=0.78 → 0.862  (случайный)
Trial  5: lr=0.04, depth=5, n=350, sub=0.88 → 0.893  (случайный)
--- TPE начинает направлять поиск ---
Trial  6: lr=0.06, depth=5, n=420, sub=0.82 → 0.901  ↑
Trial  7: lr=0.05, depth=6, n=380, sub=0.80 → 0.897
Trial  8: lr=0.04, depth=5, n=480, sub=0.85 → 0.905  ↑
Trial  9: lr=0.07, depth=5, n=450, sub=0.79 → 0.903
Trial 10: lr=0.05, depth=5, n=500, sub=0.83 → 0.909  ↑
...
Trial 15: lr=0.05, depth=5, n=470, sub=0.81 → 0.911  ↑
Trial 18: lr=0.06, depth=5, n=490, sub=0.80 → 0.910
Trial 20: lr=0.05, depth=5, n=510, sub=0.82 → 0.909

Лучший (trial 15): <b>accuracy = 0.911</b>
Время: ~8 минут (100 обучений)</div>
            <div class="why">Первые 5 триалов — случайная разведка. С 6-го триала TPE уже «понял», что lr≈0.05, depth≈5 — хороший регион, и фокусируется там. За 20 триалов достигнут 0.911 — всего на 0.001 хуже GridSearch, но в 5.4 раза быстрее!</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сравнение эффективности</h4>
            <div class="calc">
┌──────────────┬──────────┬───────────────┬──────────────┐
│    Метод     │ Триалов  │  Лучший acc   │    Время     │
├──────────────┼──────────┼───────────────┼──────────────┤
│ Grid Search  │   108    │    0.912      │   ~45 мин    │
│ Optuna (20)  │    20    │    0.911      │    ~8 мин    │
│ Optuna (40)  │    40    │    0.913      │   ~16 мин    │
│ Random (20)  │    20    │    0.898      │    ~8 мин    │
└──────────────┴──────────┴───────────────┴──────────────┘

Optuna (20 триалов) отстаёт от Grid (108) всего на 0.001!
Optuna (40 триалов) даже ОБГОНЯЕТ Grid — потому что не привязан к фиксированной сетке.
Random Search (20) — хуже обоих: нет умного направления поиска.</div>
            <div class="why">Bayesian Optimization — оптимальный компромисс: за 20 триалов почти догоняет полный перебор, а за 40 — обгоняет, потому что может пробовать промежуточные значения (lr=0.06), которых нет в фиксированной сетке Grid Search.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>GridSearch (108 комбинаций): accuracy = 0.912, время ~45 мин.</p>
            <p>Optuna (20 триалов): accuracy = 0.911, время ~8 мин.</p>
            <p>Optuna нашёл почти такой же результат в <b>5.4 раза быстрее</b>.</p>
            <p>Optuna (40 триалов) обогнал GridSearch: 0.913 > 0.912 — потому что не ограничен сеткой.</p>
          </div>

          <div class="lesson-box">Для 4+ гиперпараметров Bayesian Optimization (Optuna) — лучший выбор. Он умно направляет поиск в перспективные области и может находить значения между точками сетки. Grid Search оправдан только для 2–3 параметров с малым числом значений.</div>
        `
      },
      {
        title: 'Влияние learning rate на кривые обучения',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучаем Gradient Boosting с разными <b>learning_rate</b> (0.001, 0.01, 0.1, 1.0) при фиксированных n_estimators=500 и max_depth=4. Показываем, как learning_rate влияет на кривые обучения (train vs validation loss по итерациям).</p>
          </div>

          <div class="step" data-step="1">
            <h4>Что такое learning rate в Gradient Boosting</h4>
            <div class="calc">В Gradient Boosting каждое новое дерево добавляется с коэффициентом η (learning_rate):

F_m(x) = F_{m-1}(x) + η · h_m(x)

η = 1.0:  каждое дерево вносит ПОЛНЫЙ вклад → быстрая сходимость, но нестабильно
η = 0.1:  каждое дерево вносит 10% вклада → медленнее, но стабильнее
η = 0.01: каждое дерево вносит 1% вклада → очень медленно, нужно много деревьев
η = 0.001: слишком мало — 500 деревьев не хватит для сходимости</div>
            <div class="why">learning_rate — это «размер шага». Большой шаг — быстро, но можно перескочить оптимум. Маленький шаг — точнее, но нужно больше итераций (деревьев).</div>
          </div>

          <div class="step" data-step="2">
            <h4>Кривые обучения при разных lr</h4>
            <div class="calc">lr = 0.001 (слишком мало):
  Iter 100: train_loss=0.58, val_loss=0.59
  Iter 300: train_loss=0.42, val_loss=0.43
  Iter 500: train_loss=0.35, val_loss=0.36
  → Модель НЕ сошлась! Обе ошибки всё ещё падают. Нужно больше деревьев.

lr = 0.01 (маловато):
  Iter 100: train_loss=0.41, val_loss=0.42
  Iter 300: train_loss=0.24, val_loss=0.26
  Iter 500: train_loss=0.18, val_loss=0.22
  → Почти сошлась. Небольшой разрыв train/val — немного переобучается.

lr = 0.1 (оптимум):
  Iter 100: train_loss=0.15, val_loss=0.19
  Iter 200: train_loss=0.10, val_loss=0.17
  Iter 300: train_loss=0.07, val_loss=0.16  ← val перестал улучшаться
  Iter 500: train_loss=0.03, val_loss=0.18  ← ПЕРЕОБУЧЕНИЕ!
  → Оптимум на ~200 итерациях. val_loss = 0.17

lr = 1.0 (слишком много):
  Iter   5: train_loss=0.28, val_loss=0.32
  Iter  10: train_loss=0.15, val_loss=0.25
  Iter  20: train_loss=0.05, val_loss=0.30  ← val растёт!
  Iter  50: train_loss=0.01, val_loss=0.42  ← СИЛЬНОЕ ПЕРЕОБУЧЕНИЕ
  → Переобучение с самого начала. Модель нестабильна.</div>
            <div class="why">Маленький lr — медленная, но стабильная сходимость (кривые близко). Большой lr — быстрое переобучение (большой разрыв train/val). Оптимальный lr=0.1 сошёлся за ~200 итераций с val_loss=0.17.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Оптимальная стратегия: lr + <a class="glossary-link" onclick="App.selectTopic('glossary-early-stopping')">early stopping</a></h4>
            <div class="calc">Лучшая практика:
  1. Задай lr = 0.05–0.1 (умеренно маленький)
  2. Поставь n_estimators = 5000 (с запасом)
  3. Включи early_stopping_rounds = 50

Результат с lr=0.05, early_stopping:
  Остановка на итерации 347 из 5000
  train_loss = 0.09, val_loss = 0.16
  best_iteration = 297

Сравнение финальных результатов:
  lr=0.001, n=500:          val_loss = 0.36 (не сошлось)
  lr=0.01,  n=500:          val_loss = 0.22
  lr=0.1,   n=500:          val_loss = 0.18 (переобучение после iter 200)
  lr=0.1,   n=200 (early):  val_loss = 0.17
  lr=0.05,  early_stopping: val_loss = 0.16 ← лучший!</div>
            <div class="why">Трюк: используй маленький lr (0.05) + early stopping. Это даёт лучшее качество, потому что маленький шаг + много итераций = более гладкая и точная модель. Early stopping автоматически найдёт оптимальное число деревьев.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Влияние learning_rate при фиксированных 500 деревьях:</p>
            <p>lr=0.001: val_loss=0.36 (не сошлось), lr=0.01: val_loss=0.22, lr=0.1: val_loss=0.17 (оптимум ~200 iter), lr=1.0: val_loss=0.42 (переобучение)</p>
            <p>Лучшая стратегия: <b>lr=0.05 + early_stopping</b> → val_loss = <b>0.16</b></p>
          </div>

          <div class="lesson-box">Learning rate — один из важнейших гиперпараметров для бустинга. Всегда используй умеренно маленький lr (0.01–0.1) в сочетании с early_stopping. Это надёжнее, чем подбирать lr и n_estimators раздельно.</div>
        `
      }
    ],

    python: `
      <h3>Python: подбор гиперпараметров</h3>
      <p>Три основных подхода: GridSearchCV (полный перебор), RandomizedSearchCV (случайный) и Optuna (Bayesian Optimization).</p>

      <h4>1. GridSearchCV — полный перебор сетки</h4>
      <pre><code>import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold

# Генерируем датасет
X, y = make_classification(n_samples=1000, n_features=20,
                            n_informative=10, random_state=42)

# Задаём сетку гиперпараметров
param_grid = {
    'n_estimators': [50, 100, 200, 300],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10],
}
# Итого: 4 × 4 × 3 = 48 комбинаций × 5 фолдов = 240 обучений

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=cv,
    scoring='accuracy',
    n_jobs=-1,        # все ядра CPU
    verbose=1,
    return_train_score=True,  # для диагностики overfitting
)
grid_search.fit(X, y)

print(f"Лучшие параметры: {grid_search.best_params_}")
print(f"Лучший accuracy: {grid_search.best_score_:.4f}")

# Анализ результатов
import pandas as pd
results = pd.DataFrame(grid_search.cv_results_)
print(results[['params', 'mean_test_score', 'std_test_score',
               'mean_train_score']].sort_values(
    'mean_test_score', ascending=False).head(10))</code></pre>

      <h4>2. RandomizedSearchCV — случайный поиск</h4>
      <pre><code>from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform, loguniform

# Задаём РАСПРЕДЕЛЕНИЯ, а не фиксированные значения
param_distributions = {
    'n_estimators': randint(50, 500),        # целые числа от 50 до 500
    'max_depth': randint(3, 30),             # целые от 3 до 30
    'min_samples_split': randint(2, 20),     # целые от 2 до 20
    'min_samples_leaf': randint(1, 10),      # целые от 1 до 10
    'max_features': uniform(0.3, 0.7),       # дробные от 0.3 до 1.0
}

random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions,
    n_iter=50,            # пробуем 50 случайных комбинаций
    cv=cv,
    scoring='accuracy',
    n_jobs=-1,
    random_state=42,
    verbose=1,
)
random_search.fit(X, y)

print(f"Лучшие параметры: {random_search.best_params_}")
print(f"Лучший accuracy: {random_search.best_score_:.4f}")</code></pre>

      <h4>3. Optuna — Bayesian Optimization</h4>
      <pre><code>import optuna
from sklearn.model_selection import cross_val_score
import xgboost as xgb

# Определяем функцию для оптимизации
def objective(trial):
    params = {
        'learning_rate': trial.suggest_float('learning_rate', 1e-3, 0.3, log=True),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'n_estimators': trial.suggest_int('n_estimators', 100, 1000),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'reg_alpha': trial.suggest_float('reg_alpha', 1e-8, 10.0, log=True),
        'reg_lambda': trial.suggest_float('reg_lambda', 1e-8, 10.0, log=True),
    }

    model = xgb.XGBClassifier(**params, random_state=42, verbosity=0)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')

    return scores.mean()

# Запускаем оптимизацию
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50, show_progress_bar=True)

print(f"Лучшие параметры: {study.best_params}")
print(f"Лучший accuracy: {study.best_value:.4f}")

# Визуализация процесса оптимизации
from optuna.visualization import (
    plot_optimization_history,
    plot_param_importances,
)
plot_optimization_history(study).show()
plot_param_importances(study).show()</code></pre>

      <h4>4. Optuna с pruning (ранняя остановка плохих триалов)</h4>
      <pre><code>import optuna
from sklearn.model_selection import StratifiedKFold
import lightgbm as lgb
import numpy as np

def objective_with_pruning(trial):
    params = {
        'learning_rate': trial.suggest_float('learning_rate', 1e-3, 0.3, log=True),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'num_leaves': trial.suggest_int('num_leaves', 20, 150),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = []

    for fold, (train_idx, val_idx) in enumerate(cv.split(X, y)):
        X_train, X_val = X[train_idx], X[val_idx]
        y_train, y_val = y[train_idx], y[val_idx]

        model = lgb.LGBMClassifier(**params, n_estimators=1000,
                                    random_state=42, verbosity=-1)
        model.fit(X_train, y_train,
                  eval_set=[(X_val, y_val)],
                  callbacks=[lgb.early_stopping(50, verbose=False)])

        score = model.score(X_val, y_val)
        scores.append(score)

        # Pruning: если промежуточный результат плохой — останавливаем
        trial.report(np.mean(scores), fold)
        if trial.should_prune():
            raise optuna.TrialPruned()

    return np.mean(scores)

study = optuna.create_study(
    direction='maximize',
    pruner=optuna.pruners.MedianPruner(n_warmup_steps=2),
)
study.optimize(objective_with_pruning, n_trials=100)</code></pre>

      <h4>5. Pipeline + GridSearchCV (правильный подход)</h4>
      <pre><code>from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV

# ВАЖНО: препроцессинг внутри Pipeline, чтобы не было data leakage!
pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('pca', PCA()),
    ('svc', SVC()),
])

# Параметры Pipeline задаются через двойное подчёркивание
param_grid = {
    'pca__n_components': [5, 10, 15],
    'svc__C': [0.1, 1, 10, 100],
    'svc__gamma': [0.001, 0.01, 0.1],
    'svc__kernel': ['rbf'],
}

search = GridSearchCV(pipe, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
search.fit(X, y)

print(f"Лучшие параметры: {search.best_params_}")
print(f"Лучший accuracy: {search.best_score_:.4f}")</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Kaggle-соревнования</b> — подбор гиперпараметров часто отделяет топ-10% от остальных. Optuna стал стандартом на Kaggle.</li>
        <li><b>AutoML-системы</b> — Auto-sklearn, H2O AutoML, Google AutoML под капотом используют Bayesian Optimization и Hyperband.</li>
        <li><b>Обучение нейронных сетей</b> — подбор learning rate, batch size, архитектуры. Используют Ray Tune, Optuna, Weights & Biases Sweeps.</li>
        <li><b>Продуктовые ML-пайплайны</b> — в проде модели переобучаются периодически, и гиперпараметры подбираются автоматически.</li>
        <li><b>Медицина и биоинформатика</b> — когда данных мало, правильный подбор гиперпараметров (с Nested CV!) критически важен.</li>
        <li><b>NLP и трансформеры</b> — подбор learning rate warmup, weight decay, dropout. Population Based Training (PBT) для длительных экспериментов.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы подбора гиперпараметров</h4>
          <ul>
            <li>Может значительно улучшить качество (5–15%)</li>
            <li>Автоматизируется (не требует экспертизы)</li>
            <li>GridSearch гарантирует нахождение оптимума в сетке</li>
            <li>Optuna/Hyperopt эффективны при большом пространстве</li>
            <li>CV защищает от переобучения на валидации</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы и подводные камни</h4>
          <ul>
            <li>GridSearch экспоненциально дорог (curse of dimensionality)</li>
            <li>Опасность переобучения на валидации при слишком большом числе триалов</li>
            <li>Вычислительные затраты: часы/дни для сложных моделей</li>
            <li>Оптимальные параметры зависят от данных — не переносятся</li>
            <li>Без Nested CV оценка качества будет смещённой</li>
            <li>Random Search может пропустить оптимум при малом бюджете</li>
          </ul>
        </div>
      </div>
    `,

    links: `
      <h3>Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest (канал)</a> -- подбор гиперпараметров с нуля, наглядно</li>
        <li><a href="https://www.youtube.com/watch?v=ttE0F7fghfk" target="_blank">Hyperparameter Optimization (Siraj Raval)</a> -- практический пример GridSearch в Python</li>
      </ul>
      <h3>Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%20%D0%B3%D0%B8%D0%BF%D0%B5%D1%80%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D0%BE%D0%B2%20Optuna" target="_blank">Подбор гиперпараметров и Optuna на Habr</a> -- статьи на русском о подборе гиперпараметров</li>
        <li><a href="https://jmlr.org/papers/v13/bergstra12a.html" target="_blank">Bergstra & Bengio (2012): Random Search for Hyper-Parameter Optimization</a> -- оригинальная статья, доказывающая эффективность Random Search</li>
      </ul>
      <h3>Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/grid_search.html" target="_blank">sklearn: Tuning hyper-parameters</a> -- справочник по GridSearchCV и RandomizedSearchCV</li>
        <li><a href="https://optuna.readthedocs.io/en/stable/" target="_blank">Optuna Documentation</a> -- официальная документация Optuna</li>
      </ul>
    `,
  },
});
