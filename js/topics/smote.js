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

      <div class="illustration bordered">
        <svg viewBox="0 0 500 195" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">SMOTE: синтетические примеры меньшинства</text>
          <!-- Background area -->
          <rect x="30" y="25" width="440" height="155" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <!-- Majority class (blue dots) - many dots -->
          <circle cx="60" cy="55" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="90" cy="80" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="75" cy="110" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="110" cy="60" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="55" cy="140" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="130" cy="130" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="145" cy="90" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="100" cy="155" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="160" cy="50" r="8" fill="#6366f1" opacity="0.7"/>
          <circle cx="170" cy="140" r="8" fill="#6366f1" opacity="0.7"/>
          <!-- Legend label for majority -->
          <circle cx="50" cy="185" r="6" fill="#6366f1" opacity="0.7"/>
          <text x="62" y="189" font-size="9" fill="#334155">большинство</text>
          <!-- Minority class (red dots) - few -->
          <circle cx="340" cy="65" r="9" fill="#ef4444"/>
          <circle cx="390" cy="90" r="9" fill="#ef4444"/>
          <circle cx="365" cy="135" r="9" fill="#ef4444"/>
          <!-- Connecting lines between minority points -->
          <line x1="340" y1="65" x2="390" y2="90" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
          <line x1="390" y1="90" x2="365" y2="135" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
          <line x1="340" y1="65" x2="365" y2="135" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
          <!-- Synthetic points (green triangles) on connecting lines -->
          <polygon points="362,76 369,91 355,91" fill="#10b981"/>
          <polygon points="379,111 386,126 372,126" fill="#10b981"/>
          <polygon points="350,97 357,112 343,112" fill="#10b981"/>
          <!-- Legend -->
          <circle cx="145" cy="185" r="6" fill="#ef4444"/>
          <text x="157" y="189" font-size="9" fill="#334155">меньшинство</text>
          <polygon points="238,180 244,191 232,191" fill="#10b981"/>
          <text x="250" y="189" font-size="9" fill="#334155">синтетические (SMOTE)</text>
        </svg>
        <div class="caption">SMOTE: синие точки — класс большинства, красные — меньшинство. Зелёные треугольники — синтетические примеры, сгенерированные между красными точками по отрезкам.</div>
      </div>

      <h3>📊 Проблема дисбаланса</h3>
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

      <h3>🔧 Три подхода к решению</h3>

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

      <h3>🔍 Как работает SMOTE подробно</h3>
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

      <h3>📐 Варианты SMOTE</h3>
      <ul>
        <li><b>BorderlineSMOTE</b> — генерирует примеры только около <b>границы</b> с другим классом. Фокус на «сложных» примерах.</li>
        <li><b>ADASYN</b> — Adaptive Synthetic Sampling. Больше синтетических примеров для «сложных» регионов (где соседи разного класса).</li>
        <li><b>SVMSMOTE</b> — использует SVM для определения границы.</li>
        <li><b>SMOTE-Tomek</b> — после SMOTE удаляет перекрывающиеся пары классов.</li>
        <li><b>SMOTE-ENN</b> — после SMOTE применяет Edited Nearest Neighbors для чистки.</li>
        <li><b>SMOTE-NC</b> — для <span class="term" data-tip="Nominal Continuous. Смешанные данные с категориальными и числовыми признаками. Обычный SMOTE работает только с числовыми.">смешанных данных</span> (категориальные + числовые).</li>
      </ul>

      <h3>⚠️ Важные правила применения SMOTE</h3>

      <div class="callout warn">⚠️ <b>SMOTE — только на train!</b> Никогда не применяй его к validation/test. Иначе синтетические точки утекут из train в test → завышенная оценка качества. Это грубая форма data leakage.</div>

      <p>Правильный порядок действий:</p>
      <ol>
        <li>Разбить данные на train/test.</li>
        <li>Применить SMOTE <b>только к train</b>.</li>
        <li>Обучить модель на balanced train.</li>
        <li>Оценить на исходном (несбалансированном) test.</li>
      </ol>

      <p>В sklearn это делается через <code>imblearn.pipeline.Pipeline</code>.</p>

      <h3>🚫 Когда SMOTE плохо работает</h3>
      <ul>
        <li><b>Высокая размерность</b> — «проклятие размерности», соседи перестают быть похожими.</li>
        <li><b>Категориальные признаки</b> — интерполяция бессмысленна (нельзя на 0.7 соединить «Москва» и «Лондон»). Нужен SMOTE-NC.</li>
        <li><b>Кластерная структура</b> — SMOTE может сгенерировать точки между кластерами меньшинства в «пустоте».</li>
        <li><b>Сильный overlap с большинством</b> — SMOTE усугубит, создавая точки внутри класса большинства.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
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

    examples: [
      {
        title: 'class_weight в логистической регрессии',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Датасет кредитных заявок: <b>100 примеров</b>, <b>95 хороших заёмщиков (класс 0)</b> и <b>5 дефолтов (класс 1)</b>. Дисбаланс 19:1. Обучаем логистическую регрессию без весов и с <code>class_weight='balanced'</code>. Сравните результаты.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Параметр</th><th>Без весов</th><th>class_weight='balanced'</th></tr>
              <tr><td>TP (верно нашли дефолт)</td><td>1</td><td>4</td></tr>
              <tr><td>FP (ложная тревога)</td><td>2</td><td>18</td></tr>
              <tr><td>FN (пропущен дефолт)</td><td>4</td><td>1</td></tr>
              <tr><td>TN (верно пропустили)</td><td>93</td><td>77</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Как работает class_weight='balanced'</h4>
            <div class="calc">Формула: weight_i = n_samples / (n_classes * n_i)

n_samples = 100 (всего примеров)
n_classes = 2   (два класса)
n_0 = 95        (хороших заёмщиков)
n_1 = 5         (дефолтов)

weight_0 = 100 / (2 * 95) = 100/190 = 0.526
weight_1 = 100 / (2 * 5)  = 100/10  = 10.0

Соотношение весов: 10.0 / 0.526 = 19.0

Класс 1 в 19 раз "важнее" при вычислении loss!</div>
            <div class="why">class_weight='balanced' автоматически рассчитывает веса обратно пропорционально частоте классов. Ошибка на дефолте (класс 1) теперь штрафуется в 19 раз сильнее. Это заставляет модель уделять больше внимания редкому классу.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем метрики без весов</h4>
            <div class="calc">TP=1, FP=2, FN=4, TN=93

Accuracy = (1+93)/100 = 94%  (выглядит отлично!)
Precision = 1/(1+2) = 33.3%  (2 из 3 тревог — ложные)
Recall    = 1/(1+4) = 20.0%  (нашли только 1 из 5 дефолтов!)
F1        = 2*0.333*0.2/(0.333+0.2) = 0.250

Модель пропустила 4 из 5 дефолтов!
Это стоит банку реальных убытков.</div>
            <div class="why">Accuracy 94% — красивая цифра, но за ней скрывается провал: только 1 из 5 дефолтов найден. Recall=20% означает: модель пропускает 4 из каждых 5 проблемных заёмщиков. Без взвешивания модель "ленится" искать редкий класс.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем метрики с class_weight='balanced'</h4>
            <div class="calc">TP=4, FP=18, FN=1, TN=77

Accuracy = (4+77)/100 = 81%  (упала с 94%!)
Precision = 4/(4+18) = 18.2%  (много ложных тревог)
Recall    = 4/(4+1)  = 80.0%  (нашли 4 из 5 дефолтов!)
F1        = 2*0.182*0.8/(0.182+0.8) = 0.296

Recall вырос с 20% до 80%!
Но Precision упала — много ложных тревог.</div>
            <div class="why">Взвешивание сделало компромисс: модель стала находить гораздо больше реальных дефолтов (80% vs 20%), но ценой роста ложных тревог. Accuracy упала с 94% до 81% — это честная цена за улучшение Recall.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Финансовый анализ: что важнее?</h4>
            <div class="calc">Оценим бизнес-стоимость ошибок:
  Стоимость FN (пропущенный дефолт): 100 000 руб.
  Стоимость FP (ложная тревога): 1 000 руб. (отказ хорошему клиенту)

Без весов:  4 FN * 100000 + 2 FP * 1000 = 402 000 руб.
С весами:   1 FN * 100000 + 18 FP * 1000 = 118 000 руб.

Взвешивание экономит: 402000 - 118000 = 284 000 руб.!</div>
            <div class="why">Бизнес-метрики часто важнее ML-метрик. Хотя Accuracy упала с 94% до 81%, финансовые потери уменьшились с 402 000 до 118 000 руб. Правильный выбор весов зависит от стоимости каждого типа ошибки.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Без взвешивания: Accuracy=94%, но Recall для дефолтов = <b>20%</b> — катастрофа.</p>
            <p>С class_weight='balanced': Accuracy=81%, Recall = <b>80%</b> — нашли 4 из 5 дефолтов.</p>
            <p>Финансовый эффект: экономия 284 000 руб. за счёт правильного взвешивания.</p>
          </div>

          <div class="lesson-box">class_weight='balanced' — первое, что нужно попробовать при дисбалансе классов. Это бесплатно (нет изменения данных), реализовано в большинстве sklearn-моделей (LogisticRegression, SVC, DecisionTree, RandomForest). Accuracy при этом упадёт — это нормально, смотри на F1 и Recall.</div>
        `
      },
      {
        title: 'SMOTE пошагово: 5 точек в 2D',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Датасет дисбалансирован: 5 точек меньшинства (класс 1) в 2D пространстве. Нужно сгенерировать <b>3 синтетических примера</b> методом SMOTE с k=2 соседями. Покажите пошагово координаты новых точек.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x1</th><th>x2</th><th>Тип</th></tr>
              <tr><td>A</td><td>1.0</td><td>2.0</td><td>Реальная (меньшинство)</td></tr>
              <tr><td>B</td><td>3.0</td><td>4.0</td><td>Реальная (меньшинство)</td></tr>
              <tr><td>C</td><td>2.0</td><td>6.0</td><td>Реальная (меньшинство)</td></tr>
              <tr><td>D</td><td>5.0</td><td>3.0</td><td>Реальная (меньшинство)</td></tr>
              <tr><td>E</td><td>4.0</td><td>7.0</td><td>Реальная (меньшинство)</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Алгоритм SMOTE: что происходит</h4>
            <div class="calc">Для каждой точки меньшинства:
  1. Найти k ближайших соседей среди меньшинства (k=2)
  2. Случайно выбрать одного соседа
  3. Сгенерировать случайный alpha в [0, 1]
  4. x_new = x_base + alpha * (x_neighbor - x_base)

Результат: новая точка лежит НА ОТРЕЗКЕ между
исходной точкой и её соседом.
Она всегда ВНУТРИ "области" меньшинства.</div>
            <div class="why">SMOTE не создаёт копии существующих точек (это было бы oversampling). Вместо этого генерирует НОВЫЕ точки между соседями. Они лежат в той же области пространства, что и меньшинство, но являются уникальными данными.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Находим k=2 соседей для точки A=(1.0, 2.0)</h4>
            <div class="calc">Евклидовы расстояния от A до остальных точек:

dist(A, B) = sqrt((3-1)^2 + (4-2)^2) = sqrt(4+4) = sqrt(8) = 2.83
dist(A, C) = sqrt((2-1)^2 + (6-2)^2) = sqrt(1+16) = sqrt(17) = 4.12
dist(A, D) = sqrt((5-1)^2 + (3-2)^2) = sqrt(16+1) = sqrt(17) = 4.12
dist(A, E) = sqrt((4-1)^2 + (7-2)^2) = sqrt(9+25) = sqrt(34) = 5.83

2 ближайших соседа A: B (2.83) и C/D (оба 4.12)
Берём B и C как соседей.</div>
            <div class="why">kNN-поиск соседей выполняется только среди точек меньшинства — не среди большинства! Это гарантирует, что синтетические точки будут в области меньшинства, а не на границе между классами.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Генерируем синтетическую точку S1 (от A к B)</h4>
            <div class="calc">Выбираем соседа: B = (3.0, 4.0)
Генерируем alpha = 0.4 (случайное из [0,1])

x_new = A + alpha * (B - A)
x1_new = 1.0 + 0.4 * (3.0 - 1.0) = 1.0 + 0.4 * 2.0 = 1.0 + 0.8 = 1.8
x2_new = 2.0 + 0.4 * (4.0 - 2.0) = 2.0 + 0.4 * 2.0 = 2.0 + 0.8 = 2.8

S1 = (1.8, 2.8)

Проверка: точка лежит на отрезке A-B?
  При alpha=0: x_new = A = (1.0, 2.0) ✓
  При alpha=1: x_new = B = (3.0, 4.0) ✓
  При alpha=0.4: между ними ✓</div>
            <div class="why">alpha=0.4 означает: новая точка находится на 40% пути от A к B. Если бы alpha=0 — это была бы копия A. Если alpha=1 — копия B. Случайность alpha гарантирует уникальность каждой синтетической точки.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Генерируем S2 и S3 аналогично</h4>
            <div class="calc">Синтетическая точка S2 (от B к C, alpha=0.7):
  B=(3.0,4.0), C=(2.0,6.0)
  x1 = 3.0 + 0.7*(2.0-3.0) = 3.0 + 0.7*(-1.0) = 3.0 - 0.7 = 2.3
  x2 = 4.0 + 0.7*(6.0-4.0) = 4.0 + 0.7*2.0  = 4.0 + 1.4 = 5.4
  S2 = (2.3, 5.4)

Синтетическая точка S3 (от C к E, alpha=0.3):
  C=(2.0,6.0), E=(4.0,7.0)
  x1 = 2.0 + 0.3*(4.0-2.0) = 2.0 + 0.6 = 2.6
  x2 = 6.0 + 0.3*(7.0-6.0) = 6.0 + 0.3 = 6.3
  S3 = (2.6, 6.3)</div>
            <div class="why">Каждая синтетическая точка генерируется между двумя реальными точками меньшинства. S2=(2.3,5.4) лежит между B=(3,4) и C=(2,6). S3=(2.6,6.3) — между C=(2,6) и E=(4,7). Все три точки в "облаке" меньшинства.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Итог: исходные и синтетические точки</h4>
            <div class="calc">Исходные точки меньшинства (5 шт.):
  A=(1.0, 2.0), B=(3.0, 4.0), C=(2.0, 6.0)
  D=(5.0, 3.0), E=(4.0, 7.0)

Синтетические точки SMOTE (3 новых):
  S1=(1.8, 2.8)  — между A и B
  S2=(2.3, 5.4)  — между B и C
  S3=(2.6, 6.3)  — между C и E

Было меньшинства: 5 точек
Стало меньшинства: 8 точек (5 реальных + 3 синтетических)

Все 3 синтетические точки лежат ВНУТРИ "облака" реальных точек.
Граница между классами не нарушена.</div>
            <div class="why">SMOTE заполняет пространство между существующими точками меньшинства, а не выходит за его пределы. Это ключевое отличие от случайного oversampling (копирования): SMOTE создаёт разнообразие, а не дубликаты.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>3 синтетические точки SMOTE (k=2, случайные alpha):</p>
            <p>S1 = <b>(1.8, 2.8)</b> — 40% пути от A к B.</p>
            <p>S2 = <b>(2.3, 5.4)</b> — 70% пути от B к C.</p>
            <p>S3 = <b>(2.6, 6.3)</b> — 30% пути от C к E.</p>
            <p>Меньшинство выросло с 5 до 8 точек, все новые — внутри "облака" класса 1.</p>
          </div>

          <div class="lesson-box">SMOTE генерирует синтетические точки вдоль отрезков между реальными точками меньшинства. Это лучше, чем простое копирование: модель видит "новые" данные, а не дубликаты. Однако SMOTE может создать проблемы в шумных датасетах — тогда используй SMOTE + Tomek Links или ADASYN.</div>
        `
      },
      {
        title: 'Threshold tuning для fraud detection',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Модель обнаружения мошенничества выдала вероятности для 10 транзакций. Стандартный порог 0.5 пропускает слишком много фрода. Найдите оптимальный порог, используя бизнес-ограничение: <b>Recall >= 80%</b>.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Транзакция</th><th>P(fraud)</th><th>Реальный класс</th></tr>
              <tr><td>T1</td><td>0.97</td><td>Fraud (1)</td></tr>
              <tr><td>T2</td><td>0.89</td><td>Fraud (1)</td></tr>
              <tr><td>T3</td><td>0.72</td><td>Нормальная (0)</td></tr>
              <tr><td>T4</td><td>0.65</td><td>Fraud (1)</td></tr>
              <tr><td>T5</td><td>0.51</td><td>Нормальная (0)</td></tr>
              <tr><td>T6</td><td>0.43</td><td>Fraud (1)</td></tr>
              <tr><td>T7</td><td>0.38</td><td>Нормальная (0)</td></tr>
              <tr><td>T8</td><td>0.29</td><td>Fraud (1)</td></tr>
              <tr><td>T9</td><td>0.17</td><td>Нормальная (0)</td></tr>
              <tr><td>T10</td><td>0.08</td><td>Нормальная (0)</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Базовый случай: порог 0.5</h4>
            <div class="calc">При пороге 0.5: помечаем T1, T2, T3, T4, T5 (p >= 0.5)

TP: T1(fraud), T2(fraud), T4(fraud) = 3
FP: T3(нормальная), T5(нормальная) = 2
FN: T6(fraud), T8(fraud) = 2
TN: T7, T9, T10 = 3

Precision = 3/(3+2) = 60.0%
Recall    = 3/(3+2) = 60.0%
F1        = 0.600

Recall 60% — пропускаем 2 из 5 мошеннических транзакций!</div>
            <div class="why">Порог 0.5 — дефолтный, но не оптимальный. Recall 60% означает: каждая третья мошенническая транзакция проходит незамеченной. При высоких суммах транзакций это катастрофа. Нужно снизить порог.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Порог 0.4: добавляем T6</h4>
            <div class="calc">При пороге 0.4: помечаем T1-T6 (p >= 0.4)

TP: T1, T2, T4, T6 = 4
FP: T3, T5 = 2
FN: T8 = 1
TN: T7, T9, T10 = 3

Precision = 4/(4+2) = 66.7%
Recall    = 4/(4+1) = 80.0%   <- достигли цели!
F1        = 2*0.667*0.8/(0.667+0.8) = 0.727

Recall = 80% — цель достигнута!</div>
            <div class="why">При пороге 0.4 мы поймали T6 (fraud с p=0.43), который пропускался при пороге 0.5. Recall вырос с 60% до 80%. Precision даже немного выросла (с 60% до 67%), потому что T6 — реальный fraud. Это удачная точка.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Порог 0.3: добавляем T8</h4>
            <div class="calc">При пороге 0.3: помечаем T1-T8 (p >= 0.3)

TP: T1, T2, T4, T6, T8 = 5  (все fraud найдены!)
FP: T3, T5, T7 = 3
FN: 0
TN: T9, T10 = 2

Precision = 5/(5+3) = 62.5%
Recall    = 5/(5+0) = 100.0%
F1        = 2*0.625*1.0/(0.625+1.0) = 0.769

Recall = 100%! Но Precision упала, и 3 ложные тревоги.</div>
            <div class="why">Порог 0.3 ловит всех мошенников (Recall=100%), но добавляет ещё одну ложную тревогу (T7). Если каждая ложная тревога требует ручной проверки оператора — это дополнительные расходы. Нужно взвешивать.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сводная таблица и выбор оптимального порога</h4>
            <div class="calc">Порог  TP  FP  FN  Precision  Recall   F1     Стоим. ошибок*
0.50    3   2   2    60.0%    60.0%  0.600   2*50000+2*200 = 100400
0.40    4   2   1    66.7%    80.0%  0.727   1*50000+2*200 = 50400
0.30    5   3   0    62.5%   100.0%  0.769   0*50000+3*200 = 600

*FN стоит 50000 руб. (пропущенный фрод), FP стоит 200 руб. (ручная проверка)

По стоимости ошибок: порог 0.30 лучший (600 руб.)
По бизнес-ограничению Recall>=80%: порог 0.40 достаточен (50400 руб.)

Ответ зависит от стоимости ручной проверки vs убытков от фрода.</div>
            <div class="why">Threshold tuning — это бизнес-решение, а не техническое. Разные приоритеты дают разные ответы. Если проверка стоит дёшево — снижай порог агрессивнее. Если дорого — ищи баланс Precision/Recall.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Как выбирать порог на практике</h4>
            <div class="calc">Метод 1: По целевому Recall/Precision
  "Хочу Recall >= 80%" -> выбрать минимальный порог, дающий это

Метод 2: Максимизация F1 (или F-beta)
  Перебрать все пороги, взять max F1
  F-beta с beta>1 усиливает Recall (beta=2 для fraud)

Метод 3: По стоимости ошибок
  Считаем: sum(cost_FN * FN + cost_FP * FP)
  Берём порог с минимальной стоимостью

Метод 4: Youden's J на ROC-кривой
  J = TPR - FPR, берём порог с максимальным J</div>
            <div class="why">Не существует "правильного" метода выбора порога — всё зависит от задачи. Для fraud чаще используют метод 3 (стоимости ошибок) или метод 1 (целевой Recall). Выбор порога — продуктовое решение, которое должны принимать совместно ML-инженер и бизнес.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Порог 0.5: Recall=60% — слишком мало для fraud.</p>
            <p>Порог 0.4: Recall=<b>80%</b> — достигает бизнес-цели. F1=0.727.</p>
            <p>Порог 0.3: Recall=100%, но 3 ложные тревоги. Оптимален по стоимости ошибок.</p>
            <p>Рекомендация при ограничении Recall>=80%: порог <b>0.4</b>.</p>
          </div>

          <div class="lesson-box">Порог 0.5 — не "правильный", это просто дефолт. При дисбалансе классов и важном Recall (fraud, болезни, безопасность) всегда понижай порог. Оптимальный порог выбирается через перебор по Precision-Recall кривой или по стоимости ошибок. Это делается на validation set, а не на test.</div>
        `
      }
    ],

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

    python: `
      <h3>Python: SMOTE и балансировка классов</h3>
      <p>imbalanced-learn предоставляет SMOTE и другие методы oversampling. sklearn поддерживает class_weight для встроенной балансировки.</p>

      <h4>1. SMOTE: синтетическая генерация примеров</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from collections import Counter

# pip install imbalanced-learn
from imblearn.over_sampling import SMOTE

# Несбалансированный датасет: 90% vs 10%
X, y = make_classification(n_samples=1000, n_features=2, n_redundant=0,
                            n_clusters_per_class=1, weights=[0.9, 0.1],
                            random_state=42)

print('До SMOTE:', Counter(y))

smote = SMOTE(sampling_strategy='auto', k_neighbors=5, random_state=42)
X_res, y_res = smote.fit_resample(X, y)
print('После SMOTE:', Counter(y_res))

# Визуализация
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
for ax, X_p, y_p, title in [(axes[0], X, y, 'До SMOTE'),
                              (axes[1], X_res, y_res, 'После SMOTE')]:
    ax.scatter(X_p[y_p==0, 0], X_p[y_p==0, 1], alpha=0.3, label='Класс 0')
    ax.scatter(X_p[y_p==1, 0], X_p[y_p==1, 1], alpha=0.6, label='Класс 1')
    ax.set_title(title)
    ax.legend()
plt.show()</code></pre>

      <h4>2. Сравнение стратегий: без балансировки, SMOTE, class_weight</h4>
      <pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.metrics import f1_score, classification_report
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3,
                                                       stratify=y, random_state=42)

strategies = {
    'Без балансировки': LogisticRegression(),
    'class_weight=balanced': LogisticRegression(class_weight='balanced'),
    'SMOTE + LR': ImbPipeline([
        ('smote', SMOTE(random_state=42)),
        ('lr', LogisticRegression()),
    ]),
}

for name, clf in strategies.items():
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    f1 = f1_score(y_test, y_pred)
    print(f'{name}: F1 = {f1:.3f}')

# Подробный отчёт по лучшей стратегии
best = strategies['SMOTE + LR']
print(classification_report(y_test, best.predict(X_test)))</code></pre>

      <h4>3. Undersampling и комбинированные методы</h4>
      <pre><code>from imblearn.under_sampling import RandomUnderSampler, TomekLinks
from imblearn.combine import SMOTETomek

# SMOTETomek — oversample + удалить граничные примеры
smt = SMOTETomek(random_state=42)
X_res2, y_res2 = smt.fit_resample(X_train, y_train)
print('SMOTETomek:', Counter(y_res2))

lr = LogisticRegression()
lr.fit(X_res2, y_res2)
print('SMOTETomek F1:', f1_score(y_test, lr.predict(X_test), average='macro').round(3))

# Только undersampling — быстро, но теряет данные
rus = RandomUnderSampler(random_state=42)
X_under, y_under = rus.fit_resample(X_train, y_train)
lr.fit(X_under, y_under)
print('UnderSampling F1:', f1_score(y_test, lr.predict(X_test), average='macro').round(3))</code></pre>
    `,

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

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest (канал)</a> — разбор проблемы дисбаланса и метода SMOTE</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%B4%D0%B8%D1%81%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%20%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%BE%D0%B2%20SMOTE" target="_blank">Дисбаланс классов на Habr</a> — стратегии работы с несбалансированными данными на русском</li>
        <li><a href="https://arxiv.org/abs/1106.1813" target="_blank">Оригинальная статья SMOTE (Chawla et al.)</a> — исходная научная публикация алгоритма SMOTE</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://imbalanced-learn.org/stable/" target="_blank">imbalanced-learn документация</a> — полная документация библиотеки с SMOTE и вариантами</li>
      </ul>
    `,
  },
});
