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
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('intro-ml')">Что такое ML</a> ·
        <a onclick="App.selectTopic('metrics')">Метрики классификации</a> ·
        <a onclick="App.selectTopic('bias-variance')">Bias-Variance</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты готовишься к экзамену по учебнику с 500 задачами. Если решать все 500 дома, а потом те же самые на экзамене — получишь пятёрку. Но это ничего не говорит о реальных знаниях: ты просто запомнил ответы.</p>
        <p>Честная проверка — отложить часть задач (например, 100), решать только 400, а потом проверять себя на «новых» — тех, что не видел. Это и есть идея валидации.</p>
        <p>Но есть ещё одна проблема: может, эти 100 тестовых задач случайно оказались лёгкими. Или слишком сложными. Одно разбиение — это одна случайная оценка. Поэтому делают <b>много разных разбиений</b> и усредняют. Это и есть кросс-валидация: пять разных «экзаменов» вместо одного.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 190" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <text x="260" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">5-Fold Cross-Validation</text>
          <!-- Fold 1: test=fold1, train=2-5 -->
          <text x="42" y="45" text-anchor="end" font-size="10" fill="#64748b">Fold 1</text>
          <rect x="50" y="32" width="82" height="22" rx="4" fill="#f59e0b"/>
          <text x="91" y="47" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">test</text>
          <rect x="136" y="32" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="222" y="32" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="308" y="32" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="394" y="32" width="82" height="22" rx="4" fill="#6366f1"/>
          <text x="348" y="47" text-anchor="middle" font-size="9" fill="#c7d2fe">train</text>
          <!-- Fold 2 -->
          <text x="42" y="80" text-anchor="end" font-size="10" fill="#64748b">Fold 2</text>
          <rect x="50" y="67" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="136" y="67" width="82" height="22" rx="4" fill="#f59e0b"/>
          <text x="177" y="82" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">test</text>
          <rect x="222" y="67" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="308" y="67" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="394" y="67" width="82" height="22" rx="4" fill="#6366f1"/>
          <!-- Fold 3 -->
          <text x="42" y="115" text-anchor="end" font-size="10" fill="#64748b">Fold 3</text>
          <rect x="50" y="102" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="136" y="102" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="222" y="102" width="82" height="22" rx="4" fill="#f59e0b"/>
          <text x="263" y="117" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">test</text>
          <rect x="308" y="102" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="394" y="102" width="82" height="22" rx="4" fill="#6366f1"/>
          <!-- Fold 4 -->
          <text x="42" y="150" text-anchor="end" font-size="10" fill="#64748b">Fold 4</text>
          <rect x="50" y="137" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="136" y="137" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="222" y="137" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="308" y="137" width="82" height="22" rx="4" fill="#f59e0b"/>
          <text x="349" y="152" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">test</text>
          <rect x="394" y="137" width="82" height="22" rx="4" fill="#6366f1"/>
          <!-- Fold 5 -->
          <text x="42" y="185" text-anchor="end" font-size="10" fill="#64748b">Fold 5</text>
          <rect x="50" y="172" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="136" y="172" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="222" y="172" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="308" y="172" width="82" height="22" rx="4" fill="#6366f1"/>
          <rect x="394" y="172" width="82" height="22" rx="4" fill="#f59e0b"/>
          <text x="435" y="187" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">test</text>
        </svg>
        <div class="caption">5-Fold CV: датасет делится на 5 частей. В каждом раунде одна часть (оранжевая) — тест, остальные (синие) — обучение. Итого 5 оценок → усредняем.</div>
      </div>

      <h3>🔍 Проблема: как честно оценить модель</h3>
      <p>Если оценивать модель на данных, на которых она училась, мы меряем, как хорошо она <b>запомнила</b>, а не как хорошо <b>обобщает</b>. Достаточно сложная модель может запомнить обучение на 100% — но это не значит, что она работает на новых данных.</p>
      <p>Нужна выборка, которую модель <b>не видела</b> при обучении. На ней и измеряем качество. Это основной принцип оценки ML-моделей.</p>

      <h3>📊 Простейший подход: hold-out</h3>
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

      <h3>🔄 K-Fold Cross-Validation — стандарт</h3>
      <p>Самый популярный вариант. Делим данные на k равных частей — <span class="term" data-tip="Fold. Одна из k равных частей, на которые разбивается датасет для кросс-валидации.">фолдов</span> (обычно k = 5 или 10). Затем:</p>

      <ol>
        <li>Берём первый fold как test, остальные k-1 — как train. Обучаем, оцениваем.</li>
        <li>Берём второй fold как test, остальные как train. Обучаем <b>заново</b>, оцениваем.</li>
        <li>...и так k раз.</li>
        <li>Усредняем k полученных метрик.</li>
      </ol>

      <p>Результат: k оценок качества, их среднее и стандартное отклонение. Каждая точка участвовала ровно один раз в test и k-1 раз в train.</p>

      <h3>🎲 Почему именно k = 5 или 10</h3>
      <p>Выбор k — компромисс между смещением и вычислениями:</p>
      <ul>
        <li><b>Маленькое k (2-3)</b> — train мал, модель обучается на меньшей выборке → <b>смещённая</b> (пессимистичная) оценка.</li>
        <li><b>Большое k (50-100)</b> — train почти полный, но считать долго. Модели в разных фолдах почти идентичны → <b>высокая дисперсия</b> оценки.</li>
        <li><b>k = 5 или 10</b> — эмпирически хороший компромисс.</li>
      </ul>

      <h3>📐 Разновидности кросс-валидации</h3>

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

      <h3>🎯 Использование CV для подбора гиперпараметров</h3>
      <p>Главное применение кросс-валидации — не только оценка, но и <b>выбор</b> лучшей модели:</p>

      <ol>
        <li>Задаём сетку гиперпараметров: например, {k: 3, 5, 7, 9} для kNN.</li>
        <li>Для <b>каждого</b> набора параметров делаем K-Fold CV.</li>
        <li>Берём набор с лучшей средней метрикой.</li>
      </ol>

      <p>Это называется <span class="term" data-tip="GridSearchCV. Полный перебор всех комбинаций гиперпараметров с оценкой через CV. В sklearn это класс GridSearchCV.">GridSearchCV</span>. Более умная альтернатива — <span class="term" data-tip="RandomizedSearchCV. Случайный поиск в пространстве гиперпараметров. Часто эффективнее Grid Search при больших пространствах.">RandomizedSearchCV</span> (случайный поиск).</p>

      <div class="key-concept">
        <div class="kc-label">Train / Validation / Test — три разные вещи</div>
        <p><b>Train</b> — данные, на которых модель обучается (подбирает веса/параметры).</p>
        <p><b>Validation</b> — данные для подбора <b>гиперпараметров</b> (max_depth, learning_rate). Модель на них НЕ обучается, но вы смотрите на их score, чтобы выбрать лучшую конфигурацию. При K-Fold CV каждый fold по очереди становится validation.</p>
        <p><b>Test</b> — данные для <b>финальной</b> оценки. Откладываются в начале и не используются до самого конца. Если вы подглядываете в test при выборе модели — вы переоцениваете качество.</p>
        <p><b>Как это работает вместе:</b></p>
        <ol>
          <li>Отложите 20% данных как <b>test</b> — спрячьте и забудьте.</li>
          <li>На оставшихся 80% запустите <b>K-Fold CV</b>: внутри каждого fold часть данных = train, часть = validation.</li>
          <li>Выберите лучшие гиперпараметры по средней score на validation fold'ах.</li>
          <li>Обучите финальную модель на всех 80% с лучшими гиперпараметрами.</li>
          <li>Один раз оцените на <b>test</b> — это и есть честная оценка.</li>
        </ol>
      </div>

      <h3>🔗 Nested Cross-Validation</h3>
      <p>Если использовать CV и для подбора гиперпараметров, и для оценки качества одновременно — результат будет <b>переоценен</b>. Потому что мы оптимизируем на тех же данных, что и оцениваем.</p>

      <p>Правильный подход — <b>вложенная</b> CV: внешний цикл для оценки, внутренний — для подбора. Получается дорого (k_outer × k_inner обучений), но это единственный честный способ.</p>

      <h3>⚠️ Основные риски</h3>

      <h4>Data leakage в препроцессинге</h4>
      <p>Если делать StandardScaler/PCA/feature engineering <b>до</b> разбиения — утечка гарантирована. Правильный порядок: внутри каждого fold обучать препроцессор на train и применять к test.</p>
      <p>Решение: <span class="term" data-tip="sklearn Pipeline. Объединение препроцессинга и модели в один объект, который правильно применяет каждый шаг только к train внутри CV.">Pipeline</span> в sklearn.</p>

      <h4>Переоценка от многократного выбора</h4>
      <p>Если перебираешь сотни гиперпараметров и берёшь лучший — его оценка будет завышена. Случайно один из параметров окажется «удачным» по CV. Спасает test set или nested CV.</p>

      <h3>⚠️ Частые заблуждения</h3>
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

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Bias-variance</b> — CV выявляет оба.</li>
        <li><b>Гиперпараметры</b> — CV основной инструмент их подбора.</li>
        <li><b>Метрики</b> — любая метрика оценивается через CV.</li>
        <li><b>Дисбаланс классов</b> — требует Stratified CV.</li>
        <li><b>Регуляризация</b> — λ выбирается через CV.</li>
      </ul>
    `,

    examples: [
      {
        title: '5-Fold CV на 20 точках',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>У нас <b>20 пронумерованных точек</b> (примеров). Применяем 5-Fold Cross-Validation для оценки классификатора kNN (k=3). Физически покажем, какие точки попадают в train и test на каждом фолде, и вычислим accuracy.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>ID точки</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
              <tr><td><b>Класс</b></td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Разбиваем 20 точек на 5 равных фолдов по 4 точки</h4>
            <div class="calc">Fold 1: точки  1,  2,  3,  4   (4 точки)
Fold 2: точки  5,  6,  7,  8   (4 точки)
Fold 3: точки  9, 10, 11, 12   (4 точки)
Fold 4: точки 13, 14, 15, 16   (4 точки)
Fold 5: точки 17, 18, 19, 20   (4 точки)

Итого: 5 фолдов × 4 точки = 20 точек ✓</div>
            <div class="why">При 5-Fold каждый fold содержит 20/5=4 точки. Каждая точка ровно ОДИН раз будет в test-выборке — это ключевое свойство K-Fold CV.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Итерация 1: Fold 1 — тест, остальные — train</h4>
            <div class="calc">Test:  точки 1, 2, 3, 4  (классы: 0, 1, 0, 1)
Train: точки 5–20      (16 точек)

Обучаем kNN(k=3) на 16 точках.
Предсказываем для 4 тестовых:
  Точка 1 (класс 0): 3 ближайших соседа из train → предсказание 0 ✓
  Точка 2 (класс 1): 3 ближайших соседа из train → предсказание 1 ✓
  Точка 3 (класс 0): 3 ближайших соседа из train → предсказание 0 ✓
  Точка 4 (класс 1): 3 ближайших соседа из train → предсказание 1 ✓

Fold 1 accuracy = 4/4 = <b>1.00</b></div>
            <div class="why">На первом фолде все 4 предсказания верны — accuracy 100%. Но это только один из 5 экспериментов. Нельзя делать вывод по одному фолду.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Итерации 2–5: результаты остальных фолдов</h4>
            <div class="calc">Fold 2: test = точки 5–8,  train = 1–4, 9–20
  Предсказания: 3 из 4 верных → accuracy = <b>0.75</b>

Fold 3: test = точки 9–12, train = 1–8, 13–20
  Предсказания: 4 из 4 верных → accuracy = <b>1.00</b>

Fold 4: test = точки 13–16, train = 1–12, 17–20
  Предсказания: 3 из 4 верных → accuracy = <b>0.75</b>

Fold 5: test = точки 17–20, train = 1–16
  Предсказания: 4 из 4 верных → accuracy = <b>1.00</b></div>
            <div class="why">Разные фолды дают разные результаты: от 0.75 до 1.00. Это нормально — каждый fold — случайная выборка. Именно поэтому мы делаем 5 экспериментов и усредняем.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Вычисляем итоговую CV-оценку</h4>
            <div class="calc">Accuracy по фолдам: [1.00, 0.75, 1.00, 0.75, 1.00]

Среднее: (1.00 + 0.75 + 1.00 + 0.75 + 1.00) / 5
       = 4.50 / 5
       = <b>0.90</b>

Стандартное отклонение: std = 0.134

Итоговая оценка: <b>0.90 ± 0.134</b>

95% доверительный интервал: 0.90 ± 1.96 * 0.134/√5 ≈ 0.90 ± 0.117</div>
            <div class="why">CV даёт не только среднее (0.90), но и разброс (±0.134). Большой std означает, что модель нестабильна. В нашем случае std=0.134 достаточно высокий — из-за маленького датасета (20 точек).</div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">5-Fold CV: 20 точек → фолды по 4</text>
              <!-- Row labels -->
              <text x="38" y="44" text-anchor="end" font-size="10" fill="#64748b">Fold 1</text>
              <text x="38" y="76" text-anchor="end" font-size="10" fill="#64748b">Fold 2</text>
              <text x="38" y="108" text-anchor="end" font-size="10" fill="#64748b">Fold 3</text>
              <text x="38" y="140" text-anchor="end" font-size="10" fill="#64748b">Fold 4+5</text>
              <!-- Fold 1: test=pts 1-4, train=5-20 -->
              <rect x="42" y="27" width="72" height="26" rx="4" fill="#f59e0b"/>
              <text x="78" y="44" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">1–4 test</text>
              <rect x="118" y="27" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="194" y="27" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="270" y="27" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="346" y="27" width="72" height="26" rx="4" fill="#6366f1"/>
              <text x="268" y="44" text-anchor="middle" font-size="9" fill="#c7d2fe">5–20 train</text>
              <text x="418" y="44" text-anchor="end" font-size="9" fill="#f59e0b">acc=1.00</text>
              <!-- Fold 2 -->
              <rect x="42" y="59" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="118" y="59" width="72" height="26" rx="4" fill="#f59e0b"/>
              <text x="154" y="76" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">5–8 test</text>
              <rect x="194" y="59" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="270" y="59" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="346" y="59" width="72" height="26" rx="4" fill="#6366f1"/>
              <text x="418" y="76" text-anchor="end" font-size="9" fill="#f59e0b">acc=0.75</text>
              <!-- Fold 3 -->
              <rect x="42" y="91" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="118" y="91" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="194" y="91" width="72" height="26" rx="4" fill="#f59e0b"/>
              <text x="230" y="108" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">9–12 test</text>
              <rect x="270" y="91" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="346" y="91" width="72" height="26" rx="4" fill="#6366f1"/>
              <text x="418" y="108" text-anchor="end" font-size="9" fill="#f59e0b">acc=1.00</text>
              <!-- Fold 4+5 summary -->
              <rect x="42" y="123" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="118" y="123" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="194" y="123" width="72" height="26" rx="4" fill="#6366f1"/>
              <rect x="270" y="123" width="72" height="26" rx="4" fill="#f59e0b"/>
              <text x="306" y="140" text-anchor="middle" font-size="9" font-weight="600" fill="#fff">13–16,17–20</text>
              <rect x="346" y="123" width="72" height="26" rx="4" fill="#f59e0b"/>
              <text x="418" y="140" text-anchor="end" font-size="9" fill="#f59e0b">0.75, 1.00</text>
            </svg>
            <div class="caption">Каждый фолд (оранжевый) поочерёдно становится тестом. Accuracy по фолдам: [1.00, 0.75, 1.00, 0.75, 1.00] → среднее 0.90 ± 0.134.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>5-Fold CV на 20 точках: каждый фолд = 4 точки в test, 16 точек в train.</p>
            <p>Accuracy по фолдам: [1.00, 0.75, 1.00, 0.75, 1.00]</p>
            <p>Итоговая CV-оценка: <b>0.90 ± 0.134</b></p>
          </div>

          <div class="lesson-box">5-Fold CV гарантирует, что каждая точка ровно один раз участвует в тесте. Это честная и устойчивая оценка. Всегда смотри не только на среднее, но и на std между фолдами — он говорит о стабильности модели.</div>
        `
      },
      {
        title: 'Stratified vs обычный K-Fold',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Датасет из <b>20 примеров с дисбалансом</b>: 16 класса 0 и 4 класса 1 (соотношение 4:1). Применяем обычный 4-Fold и Stratified 4-Fold. Покажите, что может пойти не так с обычным разбиением.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>ID</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th></tr>
              <tr><td><b>Класс</b></td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Обычный 4-Fold: порядковое разбиение без учёта классов</h4>
            <div class="calc">Fold 1 (test): точки 1–5   → классы: 0,0,0,0,1 → 1 объект класса 1
Fold 2 (test): точки 6–10  → классы: 0,0,0,0,1 → 1 объект класса 1
Fold 3 (test): точки 11–15 → классы: 0,0,0,0,1 → 1 объект класса 1
Fold 4 (test): точки 16–20 → классы: 0,0,0,0,1 → 1 объект класса 1

Повезло: случайно равномерно! Но если данные не упорядочены...</div>
            <div class="why">Если данные отсортированы по классу (сначала все 0, потом все 1), обычный K-Fold даст очень плохое разбиение.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Плохой сценарий: данные с другим порядком</h4>
            <div class="calc">Допустим данные поступили в случайном порядке:
ID:   1  2  3  4  5  6  7  8  9  10  11  12  13  14  15  16  17  18  19  20
Кл:   0  0  0  0  0  0  0  0  1   0   1   0   1   0   0   0   0   1   0   0

Обычный 4-Fold:
Fold 1 (точки 1–5):   0,0,0,0,0 → <b>0 объектов класса 1!</b>
Fold 2 (точки 6–10):  0,0,0,1,0 → 1 объект класса 1
Fold 3 (точки 11–15): 1,0,1,0,0 → 2 объекта класса 1
Fold 4 (точки 16–20): 0,0,1,0,0 → 1 объект класса 1

Fold 1: нет примеров класса 1 в test!
Модель оценивается без редкого класса → оценка бессмысленна.</div>
            <div class="why">Если в тестовом фолде нет примеров редкого класса, мы не можем измерить Recall для него. Оценка будет завышена или бессмысленна. При дисбалансе это частая проблема обычного K-Fold.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Stratified 4-Fold: гарантирует пропорции в каждом фолде</h4>
            <div class="calc">Всего: 16 класса 0, 4 класса 1 → доля класса 1 = 20%

Stratified 4-Fold разделит:
  Класс 0: 16 примеров → по 4 в каждый фолд
  Класс 1:  4 примера  → по 1 в каждый фолд

Результат:
Fold 1 (test): 4 объекта кл.0 + 1 объект кл.1 → 20% класса 1 ✓
Fold 2 (test): 4 объекта кл.0 + 1 объект кл.1 → 20% класса 1 ✓
Fold 3 (test): 4 объекта кл.0 + 1 объект кл.1 → 20% класса 1 ✓
Fold 4 (test): 4 объекта кл.0 + 1 объект кл.1 → 20% класса 1 ✓

Каждый фолд имеет ровно 20% редкого класса!</div>
            <div class="why">Stratified K-Fold разбивает каждый класс независимо и затем объединяет. Это гарантирует, что пропорции классов в train и test соответствуют исходным. Именно поэтому в sklearn StratifiedKFold — дефолт для классификации.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сравнение: что происходит с метриками</h4>
            <div class="calc">При обычном K-Fold (плохой сценарий):
  Fold 1: нет класса 1 в test → Recall для кл.1 = не определён
  Fold 2–4: работает, но оценка нестабильна
  Средняя F1 (кл.1): непредсказуемо завышена или занижена

При Stratified K-Fold:
  Все фолды: 1 пример класса 1 в test, 3 в train
  Средняя F1 (кл.1): стабильная, честная оценка
  std между фолдами: меньше → оценка надёжнее</div>
            <div class="why">Стабильность оценки — ключевое преимущество. При маленьком числе примеров редкого класса особенно важно, чтобы они равномерно распределились по фолдам, а не сосредоточились в одном.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Обычный K-Fold при дисбалансе и случайном порядке данных может создать фолды без редкого класса — оценка бессмысленна.</p>
            <p>Stratified K-Fold гарантирует: каждый фолд содержит <b>20% класса 1</b> (по 1 объекту из 5).</p>
            <p>Используй Stratified K-Fold для любой задачи классификации с дисбалансом.</p>
          </div>

          <div class="lesson-box">Правило: в sklearn всегда используй StratifiedKFold (или StratifiedShuffleSplit) для задач классификации. Обычный KFold подходит только для регрессии. Дисбаланс классов — главная причина, почему нестратифицированный CV даёт нестабильные оценки.</div>
        `
      },
      {
        title: 'GridSearchCV для k в kNN',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучаем <b>kNN-классификатор</b> на датасете из 50 примеров. Хотим найти лучшее значение гиперпараметра k (число соседей) из набора {1, 3, 5, 7}. Используем 5-Fold CV. Покажите процесс GridSearch и выберите оптимальное k.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>k</th><th>Fold 1 Acc</th><th>Fold 2 Acc</th><th>Fold 3 Acc</th><th>Fold 4 Acc</th><th>Fold 5 Acc</th><th>Mean Acc</th><th>Std</th></tr>
              <tr><td><b>k=1</b></td><td>0.80</td><td>0.70</td><td>0.90</td><td>0.60</td><td>0.80</td><td>0.76</td><td>0.107</td></tr>
              <tr><td><b>k=3</b></td><td>0.90</td><td>0.80</td><td>0.90</td><td>0.80</td><td>0.90</td><td>0.86</td><td>0.055</td></tr>
              <tr><td><b>k=5</b></td><td>0.90</td><td>0.90</td><td>0.80</td><td>0.90</td><td>0.80</td><td>0.86</td><td>0.055</td></tr>
              <tr><td><b>k=7</b></td><td>0.80</td><td>0.80</td><td>0.80</td><td>0.80</td><td>0.80</td><td>0.80</td><td>0.000</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Понимаем структуру GridSearch</h4>
            <div class="calc">Для каждого значения k: обучаем 5 моделей (по одной на каждый фолд)
Итого: 4 значения k × 5 фолдов = <b>20 моделей обучено</b>

Разбиение данных (50 примеров, 5 фолдов):
  Каждый фолд: 10 примеров в test, 40 примеров в train

Для k=3, Fold 1:
  Train: примеры 11–50 (40 шт.)
  Test:  примеры 1–10 (10 шт.)
  Результат: 9/10 верных → accuracy = 0.90</div>
            <div class="why">GridSearch — это полный перебор всех комбинаций гиперпараметров. Для каждой комбинации прогоняется полный CV. Это дорого, но даёт самую честную оценку при малом числе параметров.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Анализируем k=1: нестабильность</h4>
            <div class="calc">k=1 accuracy: [0.80, 0.70, 0.90, 0.60, 0.80]
Mean = 0.76, Std = 0.107

Разброс огромный: от 0.60 до 0.90!
Разница между лучшим и худшим фолдом: 0.30

k=1 — это overfit: один ближайший сосед запоминает каждый пример.
Модель чувствительна к тому, какие примеры попали в train/test.</div>
            <div class="why">Высокий Std при CV — признак нестабильной модели (высокая variance). k=1 в kNN — классический пример переобучения: модель идеально запоминает train, но плохо обобщает.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Анализируем k=7: стабильность, но плато</h4>
            <div class="calc">k=7 accuracy: [0.80, 0.80, 0.80, 0.80, 0.80]
Mean = 0.80, Std = 0.000

Абсолютно стабильно! Но среднее ниже k=3 и k=5.
k=7 — возможно underfit: слишком много соседей усредняет
предсказания, модель слишком «тупая».</div>
            <div class="why">Std=0.000 — это подозрительно. Означает, что все фолды дают одинаковый результат. Возможно, модель предсказывает один и тот же класс для большинства примеров — слишком сглаживает.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Выбор лучшего k: mean vs mean±std</h4>
            <div class="calc">Ранжирование по Mean accuracy:
  k=3: Mean=0.86, Std=0.055  ← победитель
  k=5: Mean=0.86, Std=0.055  ← ничья по mean
  k=7: Mean=0.80, Std=0.000
  k=1: Mean=0.76, Std=0.107

k=3 vs k=5: одинаковый Mean и Std!
Правило «1 Std»: выбираем наибольшее k, которое не хуже лучшего
  на 1 std. Оба k=3 и k=5 в пределах 1 std.
  Берём <b>k=5</b> — большее k → более стабильная модель.</div>
            <div class="why">Правило «1 стандартного отклонения» (1-SE rule) — выбирать более простую модель, если она не хуже лучшей в пределах одного std. Это защищает от случайного везения на CV.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Итоговое решение</h4>
            <div class="calc">GridSearch результат:
  Лучший k по CV: k=3 или k=5 (оба Mean=0.86)
  По правилу 1-SE: выбираем <b>k=5</b> как более простую модель

После выбора: обучаем ФИНАЛЬНУЮ модель kNN(k=5) на ВСЕХ 50 примерах.
(Не на fold — на всём датасете для максимальной точности)

Если есть отдельный test set: оцениваем только на нём один раз.</div>
            <div class="why">После GridSearchCV всегда переобучаем финальную модель на ВСЕХ обучающих данных, а не только на 4/5 фолда. CV использовался только для выбора k, а не для финального обучения.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>GridSearch перебрал 4 значения k × 5 фолдов = 20 моделей.</p>
            <p>Лучшие k=3 и k=5 показали Mean accuracy = <b>0.86 ± 0.055</b>.</p>
            <p>Оптимальный выбор по правилу 1-SE: <b>k=5</b> (более стабильная, не хуже k=3).</p>
          </div>

          <div class="lesson-box">GridSearchCV — стандартный инструмент выбора гиперпараметров. После выбора лучших параметров: 1) финальное обучение на ВСЕХ данных; 2) итоговая оценка на отдельном test set, который не использовался в GridSearch.</div>
        `
      }
    ],

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

    python: `
      <h3>Python: кросс-валидация и подбор гиперпараметров</h3>
      <p>sklearn.model_selection содержит инструменты для надёжной оценки моделей и автоматического подбора параметров.</p>

      <h4>1. cross_val_score и StratifiedKFold</h4>
      <pre><code>import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

X, y = make_classification(n_samples=1000, n_features=10,
                            weights=[0.8, 0.2], random_state=42)

# StratifiedKFold сохраняет баланс классов в каждом фолде
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
model = LogisticRegression()

scores = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
print(f'ROC-AUC по фолдам: {scores.round(3)}')
print(f'Среднее: {scores.mean():.3f} ± {scores.std():.3f}')

# Оцениваем несколько метрик сразу
from sklearn.model_selection import cross_validate
results = cross_validate(model, X, y, cv=cv,
                         scoring=['roc_auc', 'f1', 'precision', 'recall'])
for metric, vals in results.items():
    if metric.startswith('test_'):
        print(f'{metric}: {vals.mean():.3f} ± {vals.std():.3f}')</code></pre>

      <h4>2. GridSearchCV — поиск по сетке гиперпараметров</h4>
      <pre><code>from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC

param_grid = {
    'C': [0.01, 0.1, 1, 10],
    'kernel': ['linear', 'rbf'],
    'gamma': ['scale', 'auto'],
}

grid_search = GridSearchCV(
    SVC(probability=True),
    param_grid,
    cv=StratifiedKFold(5, shuffle=True, random_state=42),
    scoring='roc_auc',
    n_jobs=-1,        # используем все ядра
    verbose=1,
)
grid_search.fit(X, y)

print(f'Лучшие параметры: {grid_search.best_params_}')
print(f'Лучший ROC-AUC: {grid_search.best_score_:.4f}')

import pandas as pd
cv_results = pd.DataFrame(grid_search.cv_results_)
print(cv_results[['params', 'mean_test_score', 'std_test_score']].sort_values(
    'mean_test_score', ascending=False).head(5))</code></pre>

      <h4>3. Nested CV — честная оценка после подбора параметров</h4>
      <pre><code>from sklearn.model_selection import cross_val_score, GridSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Nested CV: внешний цикл — оценка, внутренний — подбор параметров
inner_cv = StratifiedKFold(n_splits=3, shuffle=True, random_state=1)
outer_cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

pipe = Pipeline([('scaler', StandardScaler()), ('svc', SVC(probability=True))])
param_grid = {'svc__C': [0.1, 1, 10], 'svc__kernel': ['linear', 'rbf']}

clf = GridSearchCV(pipe, param_grid, cv=inner_cv, scoring='roc_auc')

# Внешние фолды дают честную оценку обобщения
nested_scores = cross_val_score(clf, X, y, cv=outer_cv, scoring='roc_auc')
print(f'Nested CV ROC-AUC: {nested_scores.mean():.3f} ± {nested_scores.std():.3f}')</code></pre>
    `,

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

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=fSytzGwwBVw" target="_blank">StatQuest: Cross Validation</a> — объяснение K-Fold CV с нуля</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BA%D1%80%D0%BE%D1%81%D1%81-%D0%B2%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0%D1%86%D0%B8%D1%8F%20cross%20validation" target="_blank">Кросс-валидация на Habr</a> — подробный разбор методов кросс-валидации на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/cross_validation.html" target="_blank">sklearn: Cross-validation</a> — справочник по всем методам CV в sklearn</li>
      </ul>
    `,
  },
});
