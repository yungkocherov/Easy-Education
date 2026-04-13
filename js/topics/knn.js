/* ==========================================================================
   k-Nearest Neighbors
   ========================================================================== */
App.registerTopic({
  id: 'knn',
  category: 'ml-cls',
  title: 'k-Nearest Neighbors (kNN)',
  summary: 'Голосование k ближайших соседей — самая простая идея в ML.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты переехал в новый город и не знаешь, какое кафе выбрать на ужин. Что ты делаешь? Спрашиваешь нескольких соседей: «Куда вы обычно ходите?» Если трое из пяти говорят «в "Рассвет"» — ты идёшь туда.</p>
        <p>Это и есть kNN: <b>голосование ближайших соседей</b>. Никаких сложных моделей, никакого обучения — просто находим похожие примеры и смотрим, что выбрали они.</p>
        <p>Применить это можно к чему угодно. Новый фильм — ищем похожие фильмы, смотрим средний рейтинг. Новый клиент — ищем похожих, предсказываем, купит ли он. Весь алгоритм в одном предложении: <b>«скажи мне, с кем ты, и я скажу, кто ты»</b>.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 205" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">kNN: k=3 ближайших соседа</text>
          <!-- Background -->
          <rect x="30" y="25" width="440" height="165" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <!-- Class 1 dots (blue) -->
          <circle cx="120" cy="70" r="9" fill="#6366f1" opacity="0.85"/>
          <circle cx="90" cy="105" r="9" fill="#6366f1" opacity="0.85"/>
          <circle cx="155" cy="95" r="9" fill="#6366f1" opacity="0.85"/>
          <circle cx="70" cy="145" r="9" fill="#6366f1" opacity="0.85"/>
          <circle cx="145" cy="145" r="9" fill="#6366f1" opacity="0.85"/>
          <!-- Class 2 dots (amber) -->
          <circle cx="340" cy="65" r="9" fill="#f59e0b" opacity="0.85"/>
          <circle cx="380" cy="100" r="9" fill="#f59e0b" opacity="0.85"/>
          <circle cx="355" cy="135" r="9" fill="#f59e0b" opacity="0.85"/>
          <circle cx="410" cy="145" r="9" fill="#f59e0b" opacity="0.85"/>
          <circle cx="420" cy="75" r="9" fill="#f59e0b" opacity="0.85"/>
          <!-- Query point (star) -->
          <polygon points="250,97 257,116 277,116 261,128 268,147 250,135 232,147 239,128 223,116 243,116" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
          <!-- k=3 dashed circle -->
          <circle cx="250" cy="120" r="78" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="7,4"/>
          <text x="330" y="56" font-size="9" fill="#ef4444">k=3 (радиус)</text>
          <!-- Lines to 3 nearest (within circle) -->
          <line x1="250" y1="120" x2="155" y2="95" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>
          <line x1="250" y1="120" x2="355" y2="135" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>
          <line x1="250" y1="120" x2="340" y2="65" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.7"/>
          <!-- Legend -->
          <circle cx="55" cy="198" r="6" fill="#6366f1"/>
          <text x="66" y="202" font-size="9" fill="#334155">класс A</text>
          <circle cx="120" cy="198" r="6" fill="#f59e0b"/>
          <text x="131" y="202" font-size="9" fill="#334155">класс B</text>
          <polygon points="190,194 194,204 186,204" fill="#10b981"/>
          <text x="200" y="202" font-size="9" fill="#334155">запрос</text>
          <line x1="250" y1="198" x2="270" y2="198" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,3"/>
          <text x="275" y="202" font-size="9" fill="#334155">радиус k=3</text>
        </svg>
        <div class="caption">kNN с k=3: зелёная звезда — новая точка, красная окружность — радиус 3 ближайших соседей. Среди попавших 1 синяя + 2 оранжевых → предсказывается класс B (большинство).</div>
      </div>

      <h3>💡 Идея алгоритма</h3>
      <p>kNN — один из простейших алгоритмов в машинном обучении. Но он удивительно эффективен и интуитивно понятен.</p>
      <p>Алгоритм состоит из трёх шагов:</p>
      <ol>
        <li><b>Запоминаем</b> все обучающие примеры. Это всё «обучение» — просто хранение данных.</li>
        <li>Когда приходит новая точка, <b>считаем расстояния</b> от неё до всех обучающих точек.</li>
        <li><b>Голосуем</b>: берём k ближайших соседей и принимаем решение на основе их ответов.</li>
      </ol>

      <p>Для классификации — берём самый частый класс среди k соседей. Для регрессии — усредняем их значения.</p>

      <div class="key-concept">
        <div class="kc-label">Уникальность kNN</div>
        <p>В отличие от всех других моделей, kNN <b>не строит никакой формулы</b>. Он не ищет веса, не находит границы, не строит деревья. Всё, что он делает — хранит данные и ищет похожих в момент предсказания. Это называется <span class="term" data-tip="Lazy learner. 'Ленивый' алгоритм — не делает обобщения при обучении, откладывает всю работу на момент предсказания.">«ленивым обучением»</span>.</p>
      </div>

      <h3>📐 Метрики расстояния</h3>
      <p>«Расстояние» можно считать по-разному, и выбор влияет на результат:</p>

      <h4>Евклидово расстояние (по умолчанию)</h4>
      <div class="math-block">$$d(x, z) = \\sqrt{\\sum_{j=1}^{p} (x_j - z_j)^2}$$</div>
      <p>Прямая линия в пространстве. Подходит для непрерывных признаков.</p>

      <h4>Манхеттенское (L1)</h4>
      <div class="math-block">$$d(x, z) = \\sum_{j=1}^{p} |x_j - z_j|$$</div>
      <p>Сумма модулей по осям. Как расстояние на сетке улиц Манхеттена.</p>

      <h4>Косинусное расстояние</h4>
      <p>Измеряет угол между векторами, а не их длины. Стандарт для текстов и рекомендательных систем.</p>

      <h4>Метрики для категориальных данных</h4>
      <p>Для категориальных признаков — расстояние Хэмминга (число отличающихся атрибутов).</p>

      <h3>🎯 Гиперпараметр k — главный выбор</h3>
      <p>Число соседей k — единственный настроечный параметр kNN. Его выбор критически важен:</p>

      <ul>
        <li><b>k = 1</b>: каждый пример определяет свою окрестность. <b>Высокая variance</b> — модель шумная, чувствительна к выбросам. <span class="term" data-tip="Overfitting. Переобучение — модель слишком чувствительна к обучающим данным.">Переобучается</span>.</li>
        <li><b>k = 5-20</b>: обычно хорошо работает. Сглаживает шум, но улавливает локальные паттерны.</li>
        <li><b>k = n</b>: все точки голосуют одинаково → модель всегда предсказывает мажоритарный класс. <b>Высокий bias</b>, <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">недообучение</a>.</li>
      </ul>

      <p><b>Правила выбора k:</b></p>
      <ul>
        <li>Через <b>кросс-валидацию</b>: перебор k, выбор оптимума.</li>
        <li>Нечётное k для бинарной классификации (чтобы избежать ничьих).</li>
        <li>Правило большого пальца: $k \\approx \\sqrt{n}$.</li>
      </ul>

      <h3>⚖️ Взвешивание соседей</h3>
      <p>По умолчанию все k соседей голосуют с равным весом. Но логично, что <b>ближе</b> = <b>важнее</b>:</p>
      <ul>
        <li><b>Uniform:</b> все соседи с весом 1.</li>
        <li><b>Distance-weighted:</b> вес = 1/d. Близкие соседи важнее.</li>
        <li><b>Kernel-based:</b> вес по гауссову ядру.</li>
      </ul>

      <p>Взвешивание часто даёт небольшое улучшение и снижает чувствительность к выбору k.</p>

      <h3>⚠️ Масштабирование признаков обязательно</h3>
      <p>kNN использует расстояния — поэтому <b>критически</b> важно масштабирование. Если один признак в метрах (0-100), другой в граммах (0-10000) — второй доминирует в расстоянии, первый не имеет значения.</p>

      <p><b>Правило:</b> перед kNN <b>всегда</b> применяй StandardScaler (среднее 0, std 1) или MinMaxScaler (нормировка [0,1]).</p>

      <h3>🌌 Проклятие размерности</h3>
      <p>В <b>высоких размерностях</b> kNN работает плохо. В чём проблема?</p>

      <p>В пространстве 100 признаков почти <b>все</b> точки становятся примерно одинаково далёкими друг от друга. Разница между ближайшим и дальним соседом уменьшается. Понятие «ближайший сосед» теряет смысл.</p>

      <p><span class="term" data-tip="Curse of dimensionality. Группа проблем, возникающих при работе с данными в высоких размерностях. Включает разреженность, исчезновение различий расстояний, экспоненциальный рост требуемого количества данных.">Проклятие размерности</span> — фундаментальная проблема многих алгоритмов, но kNN страдает от неё особенно сильно. Практическое правило: kNN плохо работает при p > 20-30 признаков.</p>

      <p><b>Решения:</b></p>
      <ul>
        <li>Снижение размерности (PCA, t-SNE) перед kNN.</li>
        <li>Отбор важных признаков.</li>
        <li>Использование других алгоритмов.</li>
      </ul>

      <h3>📈 kNN для регрессии</h3>
      <p>Тот же алгоритм, только вместо голосования — усреднение:</p>
      <div class="math-block">$$\\hat{y} = \\frac{1}{k} \\sum_{i \\in N_k(x)} y_i$$</div>

      <p>Или взвешенное среднее, если используется distance-weighted подход.</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Максимально простой и интуитивный.</li>
        <li>Нет обучения — легко добавлять новые данные.</li>
        <li>Работает и для классификации, и для регрессии.</li>
        <li>Естественно многоклассовый.</li>
        <li>Находит нелинейные границы.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Медленный инференс</b>: O(n) для каждой новой точки.</li>
        <li>Требует много <b>памяти</b> (хранит весь датасет).</li>
        <li>Страдает от <a class="glossary-link" onclick="App.selectTopic('glossary-curse-dimensionality')">проклятия размерности</a>.</li>
        <li>Требует обязательного масштабирования.</li>
        <li>Чувствителен к нерелевантным признакам.</li>
        <li>Чувствителен к дисбалансу классов.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«kNN не требует обучения»</b> — формально да, но выбор k и метрики — это уже обучение.</li>
        <li><b>«k = 1 — самый точный»</b> — на train точность 100%, на test обычно плохо.</li>
        <li><b>«kNN — быстрый»</b> — обучение быстрое, но <b>предсказание медленное</b>. Для продакшена нужны специальные индексы.</li>
        <li><b>«Больше признаков — лучше»</b> — наоборот, лишние признаки разбавляют расстояние.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: ускорение через индексы</summary>
        <div class="deep-dive-body">
          <p>Наивный kNN считает расстояния до всех точек — O(n) на каждое предсказание. Для больших данных это непозволительно. Решение — <span class="term" data-tip="Space-partitioning tree. Структура данных, которая рекурсивно делит пространство на регионы. Позволяет искать соседей быстрее O(log n).">пространственные индексы</span>:</p>
          <ul>
            <li><b>KD-Tree</b> — работает для низких размерностей (p < 20), быстро, точно.</li>
            <li><b>Ball Tree</b> — лучше для высоких размерностей.</li>
            <li><b>FAISS</b> (Facebook) — приближённый поиск, миллиарды точек.</li>
            <li><b>HNSW</b> (Hierarchical Navigable Small World) — быстрый приближённый поиск.</li>
          </ul>
          <p>Для production-систем (поиск, рекомендации) почти всегда используют <b>приближённый</b> поиск ближайших соседей (ANN).</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: kNN и теория</summary>
        <div class="deep-dive-body">
          <p>kNN имеет интересную теоретическую оценку: при $n \\to \\infty$ и $k \\to \\infty$, при $k/n \\to 0$, kNN сходится к <span class="term" data-tip="Bayes optimal classifier. Идеальный классификатор, который знает истинные условные вероятности P(y|x). Даёт минимально возможную ошибку.">Байесовскому оптимальному классификатору</span>.</p>
          <p>Известная оценка для k=1 (1-NN): его ошибка ≤ 2 × ошибки Байеса. То есть самый простой kNN не может быть сильно хуже оптимума.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>PCA</b> — часто применяется перед kNN для снижения размерности.</li>
        <li><b>Isolation Forest</b> — альтернатива для anomaly detection.</li>
        <li><b>SMOTE</b> — использует kNN для генерации синтетических примеров.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">Embedding</a>-based поиск</b> — современные системы поиска используют kNN над обучаемыми векторами.</li>
        <li><b>Рекомендательные системы</b> — collaborative filtering часто основан на kNN.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Классификация фрукта (k=3)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По весу и диаметру классифицировать новый фрукт с помощью kNN при k=3. Пошагово вычислить все расстояния.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>№</th><th>Класс</th><th>Вес (г)</th><th>Диаметр (см)</th></tr>
              <tr><td>1</td><td>Яблоко</td><td>150</td><td>7.0</td></tr>
              <tr><td>2</td><td>Яблоко</td><td>160</td><td>7.5</td></tr>
              <tr><td>3</td><td>Яблоко</td><td>140</td><td>6.5</td></tr>
              <tr><td>4</td><td>Апельсин</td><td>200</td><td>8.5</td></tr>
              <tr><td>5</td><td>Апельсин</td><td>220</td><td>9.0</td></tr>
              <tr><td>6</td><td>Апельсин</td><td>180</td><td>8.0</td></tr>
              <tr><td>?</td><td>Новый фрукт</td><td>170</td><td>7.8</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить евклидово расстояние до каждой точки</h4>
            <div class="calc">
              d(x, xᵢ) = √((вес−весᵢ)² + (диаметр−диаметрᵢ)²)<br><br>
              До №1 (150, 7.0): √((170−150)² + (7.8−7.0)²) = √(400 + 0.64) = √400.64 ≈ <b>20.0</b><br>
              До №2 (160, 7.5): √((170−160)² + (7.8−7.5)²) = √(100 + 0.09) = √100.09 ≈ <b>10.0</b><br>
              До №3 (140, 6.5): √((170−140)² + (7.8−6.5)²) = √(900 + 1.69) = √901.69 ≈ <b>30.0</b><br>
              До №4 (200, 8.5): √((170−200)² + (7.8−8.5)²) = √(900 + 0.49) = √900.49 ≈ <b>30.0</b><br>
              До №5 (220, 9.0): √((170−220)² + (7.8−9.0)²) = √(2500 + 1.44) = √2501.44 ≈ <b>50.0</b><br>
              До №6 (180, 8.0): √((170−180)² + (7.8−8.0)²) = √(100 + 0.04) = √100.04 ≈ <b>10.0</b>
            </div>
            <div class="why">Евклидово расстояние — стандартный выбор для kNN. Главное: обе оси вносят свой вклад пропорционально разбросу.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: отсортировать по расстоянию и выбрать k=3 ближайших</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Ранг</th><th>Точка</th><th>Расстояние</th><th>Класс</th></tr>
                <tr><td>1</td><td>№2 (160, 7.5)</td><td>10.0</td><td>Яблоко</td></tr>
                <tr><td>2</td><td>№6 (180, 8.0)</td><td>10.0</td><td>Апельсин</td></tr>
                <tr><td>3</td><td>№1 (150, 7.0)</td><td>20.0</td><td>Яблоко</td></tr>
                <tr><td>4</td><td>№3 и №4</td><td>30.0</td><td>—</td></tr>
                <tr><td>6</td><td>№5 (220, 9.0)</td><td>50.0</td><td>Апельсин</td></tr>
              </table>
            </div>
            <div class="why">При k=3 берём первые три строки: №2, №6, №1.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: голосование большинством</h4>
            <div class="calc">
              3 ближайших соседа:<br>
              — №2: Яблоко ✓<br>
              — №6: Апельсин ✗<br>
              — №1: Яблоко ✓<br>
              Яблоко: 2 голоса, Апельсин: 1 голос<br>
              Итог: <b>Яблоко (2:1)</b>
            </div>
            <div class="why">Большинство побеждает. При вероятностном kNN: P(яблоко) = 2/3 ≈ 67%, P(апельсин) = 1/3 ≈ 33%.</div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 420 165" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">kNN (k=3): фрукт по весу и диаметру</text>
              <!-- Axes -->
              <line x1="55" y1="20" x2="55" y2="140" stroke="#64748b" stroke-width="1.5"/>
              <line x1="55" y1="140" x2="390" y2="140" stroke="#64748b" stroke-width="1.5"/>
              <text x="222" y="158" text-anchor="middle" font-size="10" fill="#64748b">Вес (г)</text>
              <text x="20" y="82" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,20,82)">Диаметр (см)</text>
              <!-- Scale: x: 140→80, 220→350 → 1g=3.75px; y: 6.5→130, 9.0→25 → 1cm=42px -->
              <!-- x = 55 + (weight-130)*2.8; y = 140 - (diam-6.0)*42 -->
              <!-- Apples: (150,7.0)→(111,94), (160,7.5)→(139,73), (140,6.5)→(83,115) -->
              <!-- Oranges: (200,8.5)→(251,31), (220,9.0)→(307,10), (180,8.0)→(195,52) -->
              <!-- Query: (170,7.8)→(167,61) -->
              <!-- Dashed circle: r~10 in feature space, scaled: 10g*2.8=28px, 0.3cm*42=12.6px → use r=28 approx -->
              <circle cx="167" cy="61" r="40" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="6,4"/>
              <!-- Apple dots -->
              <circle cx="111" cy="94" r="8" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <text x="111" y="110" text-anchor="middle" font-size="8" fill="#10b981">№1</text>
              <circle cx="139" cy="73" r="8" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <text x="139" y="88" text-anchor="middle" font-size="8" fill="#10b981">№2</text>
              <circle cx="83" cy="115" r="8" fill="#10b981" stroke="#fff" stroke-width="1.5"/>
              <text x="83" y="130" text-anchor="middle" font-size="8" fill="#10b981">№3</text>
              <!-- Orange dots -->
              <circle cx="251" cy="31" r="8" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="251" y="22" text-anchor="middle" font-size="8" fill="#f59e0b">№4</text>
              <circle cx="307" cy="10" r="8" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="307" y="26" text-anchor="middle" font-size="8" fill="#f59e0b">№5</text>
              <circle cx="195" cy="52" r="8" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <text x="207" y="48" text-anchor="middle" font-size="8" fill="#f59e0b">№6</text>
              <!-- Query star -->
              <text x="167" y="65" text-anchor="middle" font-size="18" fill="#ef4444">★</text>
              <text x="167" y="80" text-anchor="middle" font-size="8" fill="#ef4444">?</text>
              <!-- Distance lines to k=3 neighbors -->
              <line x1="167" y1="61" x2="139" y2="73" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <line x1="167" y1="61" x2="195" y2="52" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <line x1="167" y1="61" x2="111" y2="94" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <!-- Legend -->
              <circle cx="60" cy="150" r="6" fill="#10b981"/>
              <text x="70" y="154" font-size="9" fill="#10b981">Яблоко (2 из 3)</text>
              <circle cx="160" cy="150" r="6" fill="#f59e0b"/>
              <text x="170" y="154" font-size="9" fill="#f59e0b">Апельсин (1 из 3)</text>
              <text x="290" y="154" font-size="9" fill="#ef4444">★ = новый фрукт</text>
            </svg>
            <div class="caption">Звёздочка — новый фрукт (170 г, 7.8 см). Пунктирный круг — радиус поиска. 3 ближайших соседа: №2 (яблоко), №6 (апельсин), №1 (яблоко). Голосование: Яблоко 2:1.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Новый фрукт (170 г, 7.8 см) классифицирован как <b>Яблоко</b>. Три ближайших соседа: расстояния 10.0, 10.0, 20.0.</p>
          </div>
          <div class="lesson-box">
            kNN не строит явную модель — он просто запоминает данные. При предсказании нужно вычислить расстояния до всех n обучающих точек: O(n·d) на одно предсказание. Для больших датасетов используют KD-tree или Ball-tree.
          </div>
        `,
      },
      {
        title: 'Эффект масштабирования признаков',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как отсутствие масштабирования искажает расстояния и результат kNN.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Объект</th><th>Возраст (лет)</th><th>Доход (тыс. руб.)</th><th>Класс</th></tr>
              <tr><td>A</td><td>25</td><td>30</td><td>0</td></tr>
              <tr><td>B</td><td>25</td><td>200</td><td>1</td></tr>
              <tr><td>C</td><td>40</td><td>35</td><td>0</td></tr>
              <tr><td>Новый</td><td>26</td><td>50</td><td>?</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: расстояния без масштабирования (k=1)</h4>
            <div class="calc">
              d(Новый, A) = √((26−25)² + (50−30)²) = √(1 + 400) = √401 ≈ <b>20.0</b><br>
              d(Новый, B) = √((26−25)² + (50−200)²) = √(1 + 22500) = √22501 ≈ <b>150.0</b><br>
              d(Новый, C) = √((26−40)² + (50−35)²) = √(196 + 225) = √421 ≈ <b>20.5</b><br>
              Ближайший: A (класс 0)
            </div>
            <div class="why">Доход в тысячах доминирует над возрастом в годах. Разница 20 тыс. = 20 ед., а разница 1 год = 1 ед. Доход в 20 раз «важнее» по масштабу.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: стандартизация (Z-score)</h4>
            <div class="calc">
              Возраст: μ=30, σ=7.6 → A:(25−30)/7.6=−0.66, B:−0.66, C:1.32, Новый:−0.53<br>
              Доход: μ=88.3, σ=88.8 → A:−0.66, B:1.26, C:−0.60, Новый:−0.43<br><br>
              d(Новый, A): √((−0.53−(−0.66))² + (−0.43−(−0.66))²) = √(0.017 + 0.053) ≈ <b>0.264</b><br>
              d(Новый, B): √((−0.53−(−0.66))² + (−0.43−1.26)²) = √(0.017 + 2.856) ≈ <b>1.695</b><br>
              d(Новый, C): √((−0.53−1.32)² + (−0.43−(−0.60))²) = √(3.422 + 0.029) ≈ <b>1.858</b><br>
              Ближайший: A (класс 0) — тот же результат, но...
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: контрпример где результат меняется</h4>
            <div class="calc">
              Добавим точку D: возраст=27, доход=55 → класс 1<br>
              Без масштаб.: d(Новый, D) = √(1 + 25) = 5.1 — D ближе A!<br>
              После масштаб.: D:(−0.42, −0.37)<br>
              d(Новый, D) = √(0.012 + 0.004) ≈ 0.126 — D ещё ближе<br>
              При k=1 без масштаба: класс 0. С масштабом: класс 1.
            </div>
            <div class="why">Масштабирование меняет результат! Признаки с большим диапазоном подавляют остальные.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Всегда применяй StandardScaler или MinMaxScaler перед kNN. Исключение: если признаки уже в одних единицах и имеют схожий смысловой масштаб.</p>
          </div>
          <div class="lesson-box">
            StandardScaler: z = (x−μ)/σ. MinMaxScaler: z = (x−min)/(max−min). Первый лучше при нормальном распределении, второй — когда важно сохранить нули и диапазон.
          </div>
        `,
      },
      {
        title: 'k=1 vs k=7: <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучение</a> и сглаживание',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>На одних данных сравнить качество kNN при разных k и понять компромисс bias-variance.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>x₁</th><th>x₂</th><th>y (класс)</th></tr>
              <tr><td>1.0</td><td>1.0</td><td>A</td></tr>
              <tr><td>1.2</td><td>0.8</td><td>A</td></tr>
              <tr><td>1.5</td><td>1.5</td><td>B</td></tr>
              <tr><td>2.0</td><td>2.0</td><td>A</td></tr>
              <tr><td>2.2</td><td>1.8</td><td>A</td></tr>
              <tr><td>3.0</td><td>3.0</td><td>B</td></tr>
              <tr><td>3.1</td><td>2.9</td><td>B</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: k=1 — ближайший сосед</h4>
            <div class="calc">
              Запрос: точка (1.5, 1.5) из обучения с меткой B<br>
              При k=1: сама точка — ближайший сосед, предсказание B ✓ (train accuracy 100%)<br><br>
              Запрос: новая точка (1.6, 1.4)<br>
              Ближайший сосед: (1.5, 1.5) dist≈0.14 → B<br>
              Второй ближайший: (2.0, 2.0) dist≈0.72 → A<br>
              k=1 предсказывает: <b>B</b>
            </div>
            <div class="why">k=1: граница решения — сложная, выпуклые оболочки Вороного. Полностью запоминает обучение, но нестабилен к шуму.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: k=7 — все соседи</h4>
            <div class="calc">
              Запрос: точка (1.6, 1.4)<br>
              Все 7 точек: отсортированы по расстоянию<br>
              A: (1.2, 0.8), (1.0, 1.0), (2.0, 2.0), (2.2, 1.8) → 4 голоса<br>
              B: (1.5, 1.5), (3.0, 3.0), (3.1, 2.9) → 3 голоса<br>
              k=7 предсказывает: <b>A</b>
            </div>
            <div class="why">Большое k сглаживает: редкая точка B в море A уступает большинству. Граница становится плавнее, но может терять локальные паттерны.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: cross-validation для выбора k</h4>
            <div class="calc">
              5-fold CV accuracy (гипотетически):<br>
              k=1: train 100%, val 71% — переобучение<br>
              k=3: train 91%, val 84% — баланс<br>
              k=5: train 87%, val 86% — чуть лучше<br>
              k=7: train 83%, val 81% — небольшой <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">underfitting</a><br>
              Оптимум: <b>k=5</b> по cross-validation
            </div>
            <div class="why">Правило: k нечётное (нет ничьей), k ≈ √n как стартовая точка, финально выбирать через CV.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>k=1: высокая variance (шум влияет), низкий bias. k=n: высокий bias (все классифицируются как большинство), низкая variance. Оптимальный k находится cross-validation.</p>
          </div>
          <div class="lesson-box">
            k — гиперпараметр. Малый k → переобучение. Большой k → недообучение. Weighted kNN (1/d²) часто лучше: близкие соседи имеют больший вес.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: граница решения kNN</h3>
        <p>Меняй k и наблюдай, как меняется граница. Кликай на поле, чтобы добавлять точки.</p>
        <div class="sim-container">
          <div class="sim-controls" id="knn-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="knn-regen">🔄 Новые данные</button>
            <button class="btn secondary" id="knn-clear">🗑 Очистить</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="knn-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="knn-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#knn-controls');
        const cK = App.makeControl('range', 'knn-k', 'k (соседей)', { min: 1, max: 25, step: 1, value: 5 });
        const cN = App.makeControl('range', 'knn-n', 'Точек на класс', { min: 10, max: 60, step: 5, value: 25 });
        const cClass = App.makeControl('select', 'knn-class', 'Добавлять класс', {
          options: [{ value: '0', label: 'Красный' }, { value: '1', label: 'Синий' }, { value: '2', label: 'Зелёный' }],
          value: '0',
        });
        [cK, cN, cClass].forEach((c) => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#knn-canvas');
        const ctx = canvas.getContext('2d');
        const colors = ['#ef4444', '#3b82f6', '#10b981'];
        const colorsLight = ['rgba(239,68,68,0.22)', 'rgba(59,130,246,0.22)', 'rgba(16,185,129,0.22)'];
        let points = [];

        function resize() {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          draw();
        }

        function regenerate() {
          const n = +cN.input.value;
          points = [];
          const centers = [[0.25, 0.3], [0.7, 0.35], [0.5, 0.75]];
          centers.forEach((c, cls) => {
            for (let i = 0; i < n; i++) {
              points.push({
                x: c[0] + App.Util.randn(0, 0.08),
                y: c[1] + App.Util.randn(0, 0.08),
                cls,
              });
            }
          });
          draw();
        }

        function knnPredict(px, py, k) {
          const dists = points.map(p => ({ d: (p.x - px) ** 2 + (p.y - py) ** 2, cls: p.cls }));
          dists.sort((a, b) => a.d - b.d);
          const counts = [0, 0, 0];
          for (let i = 0; i < Math.min(k, dists.length); i++) counts[dists[i].cls]++;
          let best = 0;
          for (let i = 1; i < 3; i++) if (counts[i] > counts[best]) best = i;
          return best;
        }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          if (points.length === 0) return;

          const k = +cK.input.value;
          // заливка по сетке
          const step = 8;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const cls = knnPredict(px / W, py / H, k);
              ctx.fillStyle = colorsLight[cls];
              ctx.fillRect(px, py, step, step);
            }
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = colors[p.cls];
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          });

          container.querySelector('#knn-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">k</div><div class="stat-value">${k}</div></div>
            <div class="stat-card"><div class="stat-label">Всего точек</div><div class="stat-value">${points.length}</div></div>
            <div class="stat-card"><div class="stat-label">Классов</div><div class="stat-value">3</div></div>
          `;
        }

        canvas.addEventListener('click', (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          points.push({ x, y, cls: +cClass.input.value });
          draw();
        });

        cK.input.addEventListener('input', draw);
        cN.input.addEventListener('change', regenerate);
        container.querySelector('#knn-regen').onclick = regenerate;
        container.querySelector('#knn-clear').onclick = () => { points = []; draw(); };

        setTimeout(() => { resize(); regenerate(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    python: `
      <h3>Python: k ближайших соседей</h3>
      <p>sklearn.KNeighborsClassifier прост в использовании. GridSearchCV поможет найти оптимальное k и метрику расстояния.</p>

      <h4>1. KNeighborsClassifier и визуализация границы решений</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

# Простой 2D датасет для визуализации
X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                            n_clusters_per_class=1, random_state=42)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
print(f'Accuracy: {knn.score(X_test, y_test):.4f}')
print(classification_report(y_test, knn.predict(X_test)))

# Граница решений
xx, yy = np.meshgrid(np.linspace(-3, 3, 200), np.linspace(-3, 3, 200))
Z = knn.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
plt.contourf(xx, yy, Z, alpha=0.3, cmap='RdBu')
plt.scatter(X_test[:, 0], X_test[:, 1], c=y_test, cmap='RdBu', edgecolors='k')
plt.title('KNN (k=5): граница решений')
plt.show()</code></pre>

      <h4>2. GridSearchCV для k и метрики расстояния</h4>
      <pre><code>from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_neighbors': range(1, 31),
    'weights': ['uniform', 'distance'],
    'metric': ['euclidean', 'manhattan'],
}

grid = GridSearchCV(KNeighborsClassifier(), param_grid,
                    cv=5, scoring='accuracy', n_jobs=-1)
grid.fit(X_train, y_train)

print(f'Лучшие параметры: {grid.best_params_}')
print(f'CV Accuracy: {grid.best_score_:.4f}')
print(f'Test Accuracy: {grid.best_estimator_.score(X_test, y_test):.4f}')

# Как меняется accuracy от k
import pandas as pd
results = pd.DataFrame(grid.cv_results_)
for metric in ['euclidean', 'manhattan']:
    subset = results[results['param_metric'] == metric]
    k_vals = subset['param_n_neighbors'].astype(int)
    plt.plot(k_vals, subset['mean_test_score'], label=metric)
plt.xlabel('k')
plt.ylabel('CV Accuracy')
plt.title('KNN: accuracy от k')
plt.legend()
plt.show()</code></pre>

      <h4>3. KNN для регрессии и поиск аномалий</h4>
      <pre><code>from sklearn.neighbors import KNeighborsRegressor, LocalOutlierFactor

# KNN регрессия
from sklearn.datasets import load_diabetes
data = load_diabetes()
X_r, y_r = data.data, data.target
X_tr, X_te, y_tr, y_te = train_test_split(X_r, y_r, test_size=0.2, random_state=42)

knn_reg = KNeighborsRegressor(n_neighbors=7)
knn_reg.fit(X_tr, y_tr)
from sklearn.metrics import r2_score
print(f'KNN Regression R²: {r2_score(y_te, knn_reg.predict(X_te)):.4f}')

# LOF — поиск аномалий через плотность соседей
X_anom, _ = make_classification(n_samples=200, n_features=2, n_redundant=0, random_state=0)
# Добавляем выбросы
outliers = np.random.uniform(-4, 4, (20, 2))
X_all = np.vstack([X_anom, outliers])

lof = LocalOutlierFactor(n_neighbors=20)
labels = lof.fit_predict(X_all)  # -1 = аномалия

plt.scatter(X_all[labels==1, 0], X_all[labels==1, 1], label='Normal', alpha=0.5)
plt.scatter(X_all[labels==-1, 0], X_all[labels==-1, 1], c='red', label='Outlier', s=80)
plt.title('LOF: обнаружение аномалий')
plt.legend()
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Рекомендательные системы</b> — «похожие пользователи» / «похожие товары».</li>
        <li><b>Импутация пропусков</b> — заменить NaN средним по k соседям.</li>
        <li><b>Аномалии</b> — точки с большим расстоянием до соседей.</li>
        <li><b>OCR / распознавание цифр</b> — классика MNIST.</li>
        <li><b>Медицинская диагностика</b> — «пациенты с похожими симптомами».</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Интуитивно понятен</li>
            <li>Нет обучения — легко добавлять новые данные</li>
            <li>Работает с любыми задачами (классификация и регрессия)</li>
            <li>Естественно работает с многоклассовыми задачами</li>
            <li>Нелинейная граница</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Медленно предсказывает — O(n) для каждой точки</li>
            <li>Большая память — хранит весь датасет</li>
            <li>Страдает от «проклятия размерности»</li>
            <li>Требует обязательного масштабирования</li>
            <li>Чувствителен к нерелевантным признакам</li>
          </ul>
        </div>
      </div>
    `,

    extra: `
      <h3>Проклятие размерности</h3>
      <p>В высокой размерности все точки становятся примерно одинаково далёкими друг от друга. Различие между ближайшим и дальним соседом уменьшается. kNN плохо работает при p > 20.</p>

      <h3>Ускорение</h3>
      <ul>
        <li><b>KD-Tree</b> — O(log n) поиск, хорош для низких размерностей.</li>
        <li><b>Ball Tree</b> — лучше для высоких размерностей.</li>
        <li><b>FAISS / HNSW</b> — приближённый поиск для миллиардов точек.</li>
      </ul>

      <h3>Как выбрать k: bias-variance</h3>
      <ul>
        <li><b>k=1</b> — высокая дисперсия, низкое смещение, переобучение.</li>
        <li><b>k=n</b> — низкая дисперсия, высокое смещение, недообучение (предсказывает моду).</li>
        <li>Оптимальное k выбирается через CV.</li>
      </ul>

      <h3>Взвешивание признаков</h3>
      <p>Если некоторые признаки важнее, умножить их на больший вес. Иначе нерелевантные признаки «разбавят» расстояние.</p>

      <h3>kNN и learning theory</h3>
      <p>1-NN имеет асимптотическую ошибку ≤ 2× оптимальная (Bayes). Для больших n kNN сходится к оптимальному классификатору при $k \\to \\infty$ и $k/n \\to 0$.</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=HVXime0nQeI" target="_blank">StatQuest: K-nearest neighbors</a> — наглядное объяснение алгоритма kNN</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%20%D0%B1%D0%BB%D0%B8%D0%B6%D0%B0%D0%B9%D1%88%D0%B8%D1%85%20%D1%81%D0%BE%D1%81%D0%B5%D0%B4%D0%B5%D0%B9%20kNN" target="_blank">Метод ближайших соседей на Habr</a> — разбор kNN с примерами на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html" target="_blank">sklearn: KNeighborsClassifier</a> — документация kNN-классификатора</li>
      </ul>
    `,
  },
});
