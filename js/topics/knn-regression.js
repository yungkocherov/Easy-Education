/* ==========================================================================
   kNN для регрессии
   ========================================================================== */
App.registerTopic({
  id: 'knn-regression',
  category: 'ml-reg',
  title: 'kNN для регрессии',
  summary: 'Предсказание числа по среднему k ближайших соседей.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Ты хочешь узнать, сколько стоит квартира в незнакомом районе. Что ты делаешь? Звонишь соседям и спрашиваешь: «За сколько вы продали свою?» Если три ближайших по площади и этажу квартиры ушли за 8, 9 и 10 миллионов — ты ожидаешь примерно 9 миллионов за свою.</p>
        <p>Это и есть kNN для регрессии: <b>берём k ближайших соседей и возвращаем их среднее</b>. Никакой линии, никакой формулы — просто «найди похожих и усредни».</p>
        <p>В отличие от kNN-классификации, где соседи голосуют за класс, здесь они <b>взвешивают своё число</b>. Ближайший сосед важнее далёкого — поэтому взвешенный kNN часто точнее.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">kNN регрессия: k=3, предсказываем цену квартиры</text>
          <!-- Axes -->
          <line x1="50" y1="30" x2="50" y2="170" stroke="#64748b" stroke-width="1.5"/>
          <line x1="50" y1="170" x2="470" y2="170" stroke="#64748b" stroke-width="1.5"/>
          <text x="260" y="190" text-anchor="middle" font-size="10" fill="#64748b">Площадь (м²)</text>
          <text x="18" y="103" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,18,103)">Цена (млн)</text>
          <!-- Y-axis labels -->
          <text x="44" y="172" text-anchor="end" font-size="8" fill="#94a3b8">5</text>
          <text x="44" y="137" text-anchor="end" font-size="8" fill="#94a3b8">8</text>
          <text x="44" y="103" text-anchor="end" font-size="8" fill="#94a3b8">11</text>
          <text x="44" y="67" text-anchor="end" font-size="8" fill="#94a3b8">14</text>
          <text x="44" y="33" text-anchor="end" font-size="8" fill="#94a3b8">17</text>
          <!-- X-axis labels -->
          <text x="50" y="182" text-anchor="middle" font-size="8" fill="#94a3b8">30</text>
          <text x="130" y="182" text-anchor="middle" font-size="8" fill="#94a3b8">50</text>
          <text x="210" y="182" text-anchor="middle" font-size="8" fill="#94a3b8">70</text>
          <text x="290" y="182" text-anchor="middle" font-size="8" fill="#94a3b8">90</text>
          <text x="370" y="182" text-anchor="middle" font-size="8" fill="#94a3b8">110</text>
          <text x="450" y="182" text-anchor="middle" font-size="8" fill="#94a3b8">130</text>
          <!-- scale: x = 50 + (area-30)*3.33, y = 170 - (price-5)*11.67 -->
          <!-- Points: (40,7)→(83,146), (55,9)→(133,123), (60,10)→(150,111), (75,12)→(200,93), (80,13)→(217,82), (95,15)→(267,58), (110,16)→(317,46), (120,17)→(350,35) -->
          <circle cx="83" cy="146" r="7" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
          <text x="83" y="138" text-anchor="middle" font-size="8" fill="#6366f1">7М</text>
          <circle cx="133" cy="123" r="7" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
          <text x="133" y="115" text-anchor="middle" font-size="8" fill="#6366f1">9М</text>
          <circle cx="150" cy="111" r="7" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
          <text x="162" y="115" text-anchor="middle" font-size="8" fill="#6366f1">10М</text>
          <circle cx="217" cy="82" r="7" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
          <text x="217" y="74" text-anchor="middle" font-size="8" fill="#6366f1">13М</text>
          <circle cx="267" cy="58" r="7" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
          <text x="267" y="50" text-anchor="middle" font-size="8" fill="#6366f1">15М</text>
          <circle cx="350" cy="35" r="7" fill="#6366f1" stroke="#fff" stroke-width="1.5"/>
          <text x="350" y="27" text-anchor="middle" font-size="8" fill="#6366f1">17М</text>
          <!-- Query point -->
          <circle cx="190" cy="93" r="9" fill="#ef4444" stroke="#fff" stroke-width="2"/>
          <text x="190" y="86" text-anchor="middle" font-size="9" font-weight="600" fill="#ef4444">?</text>
          <!-- k=3 circle -->
          <circle cx="190" cy="93" r="60" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,4"/>
          <!-- Lines to 3 nearest -->
          <line x1="190" y1="93" x2="150" y2="111" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
          <line x1="190" y1="93" x2="133" y2="123" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
          <line x1="190" y1="93" x2="217" y2="82" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
          <!-- Mean line -->
          <line x1="50" y1="105" x2="470" y2="105" stroke="#10b981" stroke-width="1" stroke-dasharray="3,5" opacity="0.5"/>
          <text x="475" y="108" font-size="8" fill="#10b981">10.67М</text>
          <!-- Legend -->
          <circle cx="60" cy="202" r="5" fill="#6366f1"/>
          <text x="70" y="206" font-size="9" fill="#334155">обучающая точка</text>
          <circle cx="170" cy="202" r="5" fill="#ef4444"/>
          <text x="180" y="206" font-size="9" fill="#334155">новая квартира (85 м²)</text>
          <line x1="300" y1="202" x2="320" y2="202" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
          <text x="325" y="206" font-size="9" fill="#334155">k=3 соседа</text>
        </svg>
        <div class="caption">kNN регрессия: для квартиры 85 м² находим 3 ближайших (60, 55, 80 м²). Их цены: 10, 9, 13 млн. Среднее: (10+9+13)/3 ≈ 10.67 млн — это и есть предсказание.</div>
      </div>

      <h3>💡 Идея алгоритма</h3>
      <p>kNN для регрессии работает точно так же, как для классификации — с одним отличием в последнем шаге:</p>
      <ol>
        <li><b>Запоминаем</b> все обучающие примеры (x, y), где y — число.</li>
        <li>Для новой точки x* <b>считаем расстояния</b> до всех обучающих точек.</li>
        <li>Берём <b>k ближайших соседей</b> и возвращаем <b>среднее</b> их y-значений.</li>
      </ol>

      <div class="math-block">$$\\hat{y}(x^*) = \\frac{1}{k} \\sum_{i \\in N_k(x^*)} y_i$$</div>

      <p>Никаких параметров, никакого обучения — просто запоминаем данные и ищем похожих в момент предсказания. Это называется <span class="term" data-tip="Lazy learner. 'Ленивый' алгоритм — не строит формулу при обучении, откладывает всю работу на момент предсказания.">ленивым обучением</span>.</p>

      <div class="key-concept">
        <div class="kc-label">Ключевое отличие от классификации</div>
        <p>В классификации соседи <b>голосуют</b> за класс — побеждает большинство. В регрессии соседи <b>сообщают свои числа</b> — берём среднее. Тот же алгоритм, другой финальный шаг.</p>
      </div>

      <h3>⚖️ Взвешенный kNN</h3>
      <p>Логично, что ближний сосед должен влиять на предсказание больше, чем далёкий. Решение — <b>взвешенное среднее</b>:</p>

      <div class="math-block">$$\\hat{y}(x^*) = \\frac{\\sum_{i \\in N_k} w_i \\cdot y_i}{\\sum_{i \\in N_k} w_i}, \\quad w_i = \\frac{1}{d(x^*, x_i)^2}$$</div>

      <p>Чем ближе сосед (меньше d), тем больше его вес. Если сосед точно совпадает — он один определяет предсказание.</p>

      <p>В sklearn это делается через параметр <code>weights='distance'</code>.</p>

      <h3>🎯 Выбор k и bias-variance</h3>
      <ul>
        <li><b>k = 1</b>: предсказываем значение буквально ближайшей точки. Высокая дисперсия, <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучение</a> — «запомнили» каждый выброс.</li>
        <li><b>k = 5-15</b>: обычно хороший баланс. Сглаживает шум, но отслеживает локальные паттерны.</li>
        <li><b>k = n</b>: предсказываем среднее всего датасета для всех точек. Максимальное смещение, <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">недообучение</a>.</li>
      </ul>

      <h3>📐 Метрики расстояния</h3>
      <p>Стандартный выбор — евклидово расстояние. Важно: перед kNN <b>обязательно масштабировать признаки</b>. Иначе признаки с большим диапазоном будут доминировать.</p>

      <div class="math-block">$$d(x, z) = \\sqrt{\\sum_{j=1}^{p} (x_j - z_j)^2}$$</div>

      <h3>📈 kNN vs линейная регрессия</h3>
      <p>Когда kNN для регрессии <b>лучше</b> линейной модели:</p>
      <ul>
        <li>Нелинейная зависимость y от x (kNN автоматически её уловит).</li>
        <li>Мало данных, нет предположений о распределении.</li>
        <li>Нужно быстро получить базовое предсказание без настройки модели.</li>
      </ul>
      <p>Когда kNN <b>хуже</b>:</p>
      <ul>
        <li>Много признаков — проклятие размерности.</li>
        <li>Большой датасет — медленный инференс O(n).</li>
        <li>Нужна интерпретируемость — kNN не даёт явной формулы.</li>
        <li>Экстраполяция — kNN не умеет предсказывать за пределами обучения.</li>
      </ul>

      <h3>🌌 Проклятие размерности</h3>
      <p>В высоких размерностях все точки становятся примерно одинаково далёкими. kNN теряет смысл при p > 20-30 признаков. Решение — снижение размерности (PCA) перед применением kNN.</p>

      <div class="deep-dive">
        <summary>Подробнее: ускорение через KD-Tree и Ball-Tree</summary>
        <div class="deep-dive-body">
          <p>Наивный kNN перебирает все n точек — O(n·p) на каждое предсказание. Для больших данных используют пространственные индексы:</p>
          <ul>
            <li><b>KD-Tree</b> — рекурсивно делит пространство по осям. O(log n) для низких p. Используется в sklearn по умолчанию при p &lt; 20.</li>
            <li><b>Ball-Tree</b> — делит пространство на «шары». Работает лучше для высоких p и нестандартных метрик.</li>
            <li><b>FAISS / HNSW</b> — приближённый поиск для миллионов точек.</li>
          </ul>
          <p>В sklearn параметр <code>algorithm='kd_tree'</code> или <code>'ball_tree'</code> выбирается автоматически.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: гладкость kNN-регрессии</summary>
        <div class="deep-dive-body">
          <p>kNN-регрессия аппроксимирует функцию локально — в каждой точке строит «кусочно-постоянную» аппроксимацию. При k=1 поверхность ступенчатая (Вороные области). При большом k — всё более гладкая.</p>
          <p>Взвешенный kNN (weights='distance') даёт более плавную поверхность, чем равновесный. Для ещё более плавного результата — Nadaraya-Watson регрессия (ядерная регрессия с гауссовым ядром).</p>
        </div>
      </div>

      <h3>🔗 Связи с другими темами</h3>
      <ul>
        <li><b>PCA</b> — часто применяется перед kNN для снижения размерности.</li>
        <li><b>Линейная регрессия</b> — явная параметрическая альтернатива.</li>
        <li><b>Random Forest Regression</b> — мощнее, не страдает от размерности.</li>
        <li><b>SMOTE</b> — использует kNN для генерации синтетических примеров.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Цена квартиры (k=3)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Предсказать цену квартиры площадью 72 м² с помощью kNN-регрессии при k=3. Данные: 6 квартир с известными ценами.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>№</th><th>Площадь (м²)</th><th>Цена (млн руб.)</th></tr>
              <tr><td>1</td><td>45</td><td>6.5</td></tr>
              <tr><td>2</td><td>58</td><td>8.2</td></tr>
              <tr><td>3</td><td>65</td><td>9.0</td></tr>
              <tr><td>4</td><td>80</td><td>11.5</td></tr>
              <tr><td>5</td><td>90</td><td>13.0</td></tr>
              <tr><td>6</td><td>110</td><td>16.0</td></tr>
              <tr><td>?</td><td><b>72</b></td><td>?</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить расстояния</h4>
            <div class="calc">
              Один признак (площадь) → расстояние = |x* − xᵢ|<br><br>
              До №1 (45 м²): |72 − 45| = <b>27</b><br>
              До №2 (58 м²): |72 − 58| = <b>14</b><br>
              До №3 (65 м²): |72 − 65| = <b>7</b><br>
              До №4 (80 м²): |72 − 80| = <b>8</b><br>
              До №5 (90 м²): |72 − 90| = <b>18</b><br>
              До №6 (110 м²): |72 − 110| = <b>38</b>
            </div>
            <div class="why">В этом примере один признак, поэтому расстояние — просто разность площадей. В реальности добавляют этаж, район, год постройки — тогда нужно евклидово расстояние.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: отсортировать и выбрать k=3 ближайших</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Ранг</th><th>Квартира</th><th>Расстояние</th><th>Цена (млн)</th></tr>
                <tr><td>1</td><td>№3 (65 м²)</td><td>7</td><td>9.0</td></tr>
                <tr><td>2</td><td>№4 (80 м²)</td><td>8</td><td>11.5</td></tr>
                <tr><td>3</td><td>№2 (58 м²)</td><td>14</td><td>8.2</td></tr>
                <tr><td>4</td><td>№5 (90 м²)</td><td>18</td><td>13.0</td></tr>
                <tr><td>5</td><td>№1 (45 м²)</td><td>27</td><td>6.5</td></tr>
                <tr><td>6</td><td>№6 (110 м²)</td><td>38</td><td>16.0</td></tr>
              </table>
            </div>
            <div class="why">k=3 — берём первые три строки: №3, №4, №2.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: предсказание = среднее цен k соседей</h4>
            <div class="calc">
              3 ближайших соседа: цены 9.0, 11.5, 8.2 млн<br><br>
              ŷ = (9.0 + 11.5 + 8.2) / 3 = 28.7 / 3 ≈ <b>9.57 млн руб.</b>
            </div>
            <div class="why">Это не голосование — мы усредняем числа. Чем ближе сосед, тем ближе его площадь к нашей, но вес у всех одинаковый (uniform).</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: взвешенный kNN (weights='distance')</h4>
            <div class="calc">
              Веса: wᵢ = 1/dᵢ<br>
              w₃ = 1/7 ≈ 0.1429, w₄ = 1/8 = 0.125, w₂ = 1/14 ≈ 0.0714<br><br>
              ŷ_взв = (0.1429·9.0 + 0.125·11.5 + 0.0714·8.2) / (0.1429+0.125+0.0714)<br>
              = (1.286 + 1.4375 + 0.586) / 0.3393<br>
              = 3.309 / 0.3393 ≈ <b>9.75 млн руб.</b>
            </div>
            <div class="why">Взвешенный kNN дал 9.75 vs равновесный 9.57. Больший вес у ближайшего (65 м², 9.0 млн) и следующего (80 м², 11.5 млн) — предсказание слегка сдвинулось.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>kNN (k=3, uniform): <b>9.57 млн руб.</b> &nbsp;|&nbsp; kNN (k=3, distance-weighted): <b>9.75 млн руб.</b></p>
          </div>
          <div class="lesson-box">
            Для регрессии kNN предсказывает среднее (или взвешенное среднее) y-значений соседей. Масштабирование признаков критично: если добавить «этаж» в штуках без нормировки, он будет несопоставим с «площадью» в м².
          </div>
        `,
      },
      {
        title: 'k=1 vs k=5: переобучение',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как выбор k влияет на переобучение / недообучение в задаче регрессии. Одни и те же данные, разные k.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>x</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th></tr>
              <tr><th>y (факт)</th><td>2.1</td><td>3.8</td><td>6.2</td><td>5.9</td><td>8.3</td><td>9.1</td><td>11.5</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>k=1: полное запоминание</h4>
            <div class="calc">
              При k=1 для каждой обучающей точки ближайший сосед — она сама.<br>
              ŷ(1) = 2.1, ŷ(2) = 3.8, ŷ(3) = 6.2 ... — идеально на тренировке!<br>
              Train <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a> = 0.0<br><br>
              Для новой точки x=3.5:<br>
              Ближайший → x=4 (расстояние 0.5): ŷ = <b>5.9</b><br><br>
              Для x=3.1:<br>
              Ближайший → x=3 (расстояние 0.1): ŷ = <b>6.2</b>
            </div>
            <div class="why">k=1 запоминает каждую точку. Шум и выбросы (например, 5.9 рядом с 6.2) не сглаживаются. На новых данных — нестабильные предсказания.</div>
          </div>
          <div class="step" data-step="2">
            <h4>k=5: сглаживание</h4>
            <div class="calc">
              Для x=4 (5 ближайших — все точки кроме x=7):<br>
              ŷ = (2.1+3.8+6.2+5.9+8.3)/5 = 26.3/5 = <b>5.26</b><br>
              Истинное значение: 5.9. Ошибка: 0.64<br><br>
              Для x=7 (5 ближайших → x=3,4,5,6,7):<br>
              ŷ = (6.2+5.9+8.3+9.1+11.5)/5 = 41.0/5 = <b>8.2</b><br>
              Истинное значение: 11.5. Ошибка: 3.3 — модель «недооценивает» крайние значения.
            </div>
            <div class="why">k=5 сглаживает шум, но вносит смещение. При k большом модель «усредняет» слишком много — хвосты распределения предсказываются плохо.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: сравнение через кросс-валидацию</h4>
            <div class="example-data-table">
              <table>
                <tr><th>k</th><th>Train MSE</th><th>Val MSE (CV)</th><th>Вывод</th></tr>
                <tr><td>1</td><td>0.00</td><td>3.82</td><td>Переобучение</td></tr>
                <tr><td>2</td><td>0.51</td><td>2.14</td><td>Лучше</td></tr>
                <tr><td>3</td><td>0.79</td><td>1.61</td><td>Хорошо</td></tr>
                <tr><td>5</td><td>1.35</td><td>1.73</td><td>Немного смещён</td></tr>
                <tr><td>7</td><td>2.10</td><td>2.95</td><td>Недообучение</td></tr>
              </table>
            </div>
            <div class="why">Оптимум при k=3. Это стандартная bias-variance кривая: маленькое k → высокая дисперсия, большое k → высокое смещение.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>k=1 — нулевой Train MSE, плохой Val MSE (переобучение). k=7 — высокий Train и Val MSE (недообучение). Оптимум k=3 через кросс-валидацию.</p>
          </div>
          <div class="lesson-box">
            Выбор k — единственный гиперпараметр kNN для регрессии (помимо метрики). Всегда подбирайте k через CV. Правило большого пальца: начните с k=√n.
          </div>
        `,
      },
      {
        title: 'Взвешенный kNN',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить равновесный и взвешенный kNN на примере предсказания стоимости подержанного автомобиля по пробегу и возрасту.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Авто</th><th>Пробег (тыс. км)</th><th>Возраст (лет)</th><th>Цена (тыс. руб.)</th></tr>
              <tr><td>A</td><td>50</td><td>3</td><td>900</td></tr>
              <tr><td>B</td><td>80</td><td>5</td><td>700</td></tr>
              <tr><td>C</td><td>55</td><td>4</td><td>850</td></tr>
              <tr><td>D</td><td>120</td><td>8</td><td>450</td></tr>
              <tr><td>E</td><td>90</td><td>6</td><td>620</td></tr>
              <tr><td>?</td><td><b>60</b></td><td><b>4</b></td><td>?</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: стандартизация и расстояния (k=3)</h4>
            <div class="calc">
              Стандартизируем признаки (μ, σ для обучающей выборки):<br>
              Пробег: μ=79, σ=27.1 | Возраст: μ=5.2, σ=1.92<br><br>
              Запрос (60, 4): z_prob = (60−79)/27.1 = −0.70, z_age = (4−5.2)/1.92 = −0.625<br>
              A (50, 3): z = (−1.07, −1.15) → d = √((−0.70+1.07)² + (−0.625+1.15)²) = √(0.137 + 0.276) = <b>0.643</b><br>
              B (80, 5): z = (0.04, −0.10) → d = √((−0.70−0.04)² + (−0.625+0.10)²) = √(0.548 + 0.276) = <b>0.908</b><br>
              C (55, 4): z = (−0.88, −0.625) → d = √((−0.70+0.88)² + 0²) = √(0.032) = <b>0.179</b><br>
              D (120, 8): z = (1.51, 1.46) → d = √(4.850 + 4.410) = <b>3.043</b><br>
              E (90, 6): z = (0.41, 0.42) → d = √(1.232 + 1.100) = <b>1.527</b>
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: 3 ближайших соседа</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Авто</th><th>d</th><th>Цена</th><th>w=1/d²</th></tr>
                <tr><td>C</td><td>0.179</td><td>850</td><td>31.23</td></tr>
                <tr><td>A</td><td>0.643</td><td>900</td><td>2.419</td></tr>
                <tr><td>B</td><td>0.908</td><td>700</td><td>1.213</td></tr>
              </table>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: равновесный vs взвешенный</h4>
            <div class="calc">
              Равновесный kNN (uniform):<br>
              ŷ = (850 + 900 + 700) / 3 = 2450 / 3 ≈ <b>817 тыс. руб.</b><br><br>
              Взвешенный kNN (w = 1/d²):<br>
              Σw = 31.23 + 2.419 + 1.213 = 34.862<br>
              ŷ = (31.23·850 + 2.419·900 + 1.213·700) / 34.862<br>
              = (26545.5 + 2177.1 + 849.1) / 34.862<br>
              = 29571.7 / 34.862 ≈ <b>848 тыс. руб.</b>
            </div>
            <div class="why">Взвешенный kNN дал 848 vs 817. Авто C (55 тыс. км, 4 года) с ценой 850 имеет огромный вес 31.23 — оно почти полностью определяет ответ. Это логично: C наиболее похоже на запрос.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Равновесный (uniform): <b>817 тыс. руб.</b> Взвешенный (distance): <b>848 тыс. руб.</b> Разница значительна, когда один сосед существенно ближе других — взвешенный подход предпочтительнее.</p>
          </div>
          <div class="lesson-box">
            В sklearn: <code>KNeighborsRegressor(n_neighbors=3, weights='distance')</code>. Взвешенный kNN почти всегда лучше равновесного при неравномерном распределении данных.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: kNN-регрессия — эффект k</h3>
        <p>Меняй k, шум и число точек. Наблюдай, как сглаживается предсказание.</p>
        <div class="sim-container">
          <div class="sim-controls" id="knnr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="knnr-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="knnr-chart"></canvas></div>
            <div class="sim-stats" id="knnr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#knnr-controls');
        const cK = App.makeControl('range', 'knnr-k', 'k (соседей)', { min: 1, max: 20, step: 1, value: 5 });
        const cNoise = App.makeControl('range', 'knnr-noise', 'Шум σ', { min: 0.1, max: 2, step: 0.1, value: 0.5 });
        const cN = App.makeControl('range', 'knnr-n', 'Число точек', { min: 30, max: 200, step: 5, value: 80 });
        [cK, cNoise, cN].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let dataX = [], dataY = [];

        function generate() {
          const n = +cN.input.value;
          const sigma = +cNoise.input.value;
          dataX = []; dataY = [];
          for (let i = 0; i < n; i++) {
            const x = Math.random() * 2 * Math.PI;
            dataX.push(x);
            dataY.push(Math.sin(x) + App.Util.randn(0, sigma));
          }
          update();
        }

        function update() {
          const k = +cK.input.value;
          // build prediction curve
          const gridX = App.Util.linspace(0, 2 * Math.PI, 200);
          const predY = gridX.map(gx => {
            const dists = dataX.map((dx, i) => ({ d: Math.abs(dx - gx), y: dataY[i] }));
            dists.sort((a, b) => a.d - b.d);
            let s = 0;
            for (let j = 0; j < k; j++) s += dists[j].y;
            return s / k;
          });

          // MSE on training data
          let mse = 0;
          for (let i = 0; i < dataX.length; i++) {
            const dists = dataX.map((dx, j) => ({ d: Math.abs(dx - dataX[i]), y: dataY[j] }));
            dists.sort((a, b) => a.d - b.d);
            let s = 0;
            for (let j = 0; j < k; j++) s += dists[j].y;
            const pred = s / k;
            mse += (dataY[i] - pred) ** 2;
          }
          mse /= dataX.length;

          const scatter = dataX.map((x, i) => ({ x, y: dataY[i] }));
          const curve = gridX.map((x, i) => ({ x, y: predY[i] }));
          const trueCurve = gridX.map(x => ({ x, y: Math.sin(x) }));

          const ctx = container.querySelector('#knnr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Данные', data: scatter, backgroundColor: 'rgba(99,102,241,0.4)', pointRadius: 4 },
                { label: 'kNN предсказание', data: curve, type: 'line', borderColor: 'rgba(239,68,68,0.9)', borderWidth: 2, pointRadius: 0, fill: false, showLine: true },
                { label: 'sin(x) истинная', data: trueCurve, type: 'line', borderColor: 'rgba(16,185,129,0.6)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, showLine: true },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'kNN-регрессия' } },
              scales: { x: { type: 'linear', min: 0, max: 6.3 }, y: { min: -2.5, max: 2.5 } },
            },
          });
          App.registerChart(chart);

          container.querySelector('#knnr-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">k</div><div class="stat-value">${k}</div></div>
            <div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${mse.toFixed(4)}</div></div>
          `;
        }

        [cNoise, cN].forEach(c => c.input.addEventListener('input', generate));
        cK.input.addEventListener('input', update);
        container.querySelector('#knnr-regen').onclick = generate;
        generate();
      },
    },

    python: `
      <h4>1. Базовый KNeighborsRegressor</h4>
      <pre><code>from sklearn.neighbors import KNeighborsRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Пример: цены квартир
X = np.array([[45], [58], [65], [80], [90], [110]])
y = np.array([6.5, 8.2, 9.0, 11.5, 13.0, 16.0])

# Масштабирование обязательно!
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# kNN регрессия
knn = KNeighborsRegressor(n_neighbors=3, weights='uniform')
knn.fit(X_scaled, y)

x_new = scaler.transform([[72]])
pred = knn.predict(x_new)
print(f"Предсказание для 72 м²: {pred[0]:.2f} млн руб.")</code></pre>

      <h4>2. Подбор k через кросс-валидацию</h4>
      <pre><code>from sklearn.datasets import fetch_california_housing
from sklearn.pipeline import Pipeline

data = fetch_california_housing()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Pipeline: стандартизация + kNN
results = []
for k in range(1, 21):
    pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('knn', KNeighborsRegressor(n_neighbors=k, weights='distance'))
    ])
    scores = cross_val_score(pipe, X_train, y_train,
                             cv=5, scoring='neg_mean_squared_error')
    results.append({'k': k, 'val_mse': -scores.mean()})

best = min(results, key=lambda r: r['val_mse'])
print(f"Лучший k: {best['k']}, Val MSE: {best['val_mse']:.4f}")

# Финальная оценка
best_pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('knn', KNeighborsRegressor(n_neighbors=best['k'], weights='distance'))
])
best_pipe.fit(X_train, y_train)
y_pred = best_pipe.predict(X_test)
print(f"Test R²: {r2_score(y_test, y_pred):.4f}")
print(f"Test RMSE: {mean_squared_error(y_test, y_pred)**0.5:.4f}")</code></pre>

      <h4>3. Взвешенный kNN и сравнение с линейной регрессией</h4>
      <pre><code>from sklearn.linear_model import LinearRegression

models = {
    'kNN-uniform (k=5)': KNeighborsRegressor(n_neighbors=5, weights='uniform'),
    'kNN-distance (k=5)': KNeighborsRegressor(n_neighbors=5, weights='distance'),
    'Linear Regression': LinearRegression(),
}

for name, model in models.items():
    pipe = Pipeline([('scaler', StandardScaler()), ('model', model)])
    pipe.fit(X_train, y_train)
    r2 = r2_score(y_test, pipe.predict(X_test))
    rmse = mean_squared_error(y_test, pipe.predict(X_test))**0.5
    print(f"{name}: R²={r2:.3f}, RMSE={rmse:.3f}")</code></pre>
    `,

    applications: `
      <h3>Где применяется KNN Regression</h3>
      <table>
        <tr><th>Область</th><th>Задача</th></tr>
        <tr><td><b>Недвижимость</b></td><td>Оценка квартиры по похожим в том же районе</td></tr>
        <tr><td><b>Рекомендательные системы</b></td><td>Item-item / user-user CF: оценка на основе похожих товаров/пользователей</td></tr>
        <tr><td><b>Медицина</b></td><td>Прогноз параметров пациента по похожим случаям в анамнезе</td></tr>
        <tr><td><b>Прогноз погоды</b></td><td>Нахождение аналогов в истории наблюдений (аналоговый прогноз)</td></tr>
        <tr><td><b>Заполнение пропусков</b></td><td>KNN imputation — заполнение NaN по ближайшим соседям</td></tr>
        <tr><td><b>Бейзлайн</b></td><td>Простая модель для быстрой проверки — если KNN плох, данные шумные</td></tr>
      </table>
        `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Максимально прост и интуитивен</li>
            <li>Нет обучения — мгновенно добавить новые данные</li>
            <li>Нелинейная регрессия без настройки</li>
            <li>Нет предположений о распределении данных</li>
            <li>Один гиперпараметр k — легко настраивать</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Медленный инференс — O(n) для каждой точки</li>
            <li>Много памяти — хранит весь датасет</li>
            <li>Страдает от проклятия размерности (p > 20)</li>
            <li>Требует обязательного масштабирования признаков</li>
            <li>Не экстраполирует — плохо за пределами обучения</li>
            <li>Нет интерпретируемой формулы</li>
          </ul>
        </div>
      </div>
      <h4>kNN vs Линейная регрессия</h4>
      <table>
        <tr><th>Критерий</th><th>kNN регрессия</th><th>Линейная регрессия</th></tr>
        <tr><td>Тип зависимости</td><td>Нелинейная (автоматически)</td><td>Линейная</td></tr>
        <tr><td>Интерпретируемость</td><td>Низкая</td><td>Высокая (коэффициенты)</td></tr>
        <tr><td>Экстраполяция</td><td>Плохо</td><td>Хорошо</td></tr>
        <tr><td>Скорость инференса</td><td>O(n)</td><td>O(p)</td></tr>
        <tr><td>Много признаков</td><td>Плохо</td><td>Хорошо</td></tr>
        <tr><td>Обучение</td><td>Мгновенно</td><td>Быстро</td></tr>
      </table>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=HVXime0nQeI" target="_blank">StatQuest: K-nearest neighbors</a> — принцип kNN, применим к регрессии и классификации</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=kNN%20%D1%80%D0%B5%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D1%8F%20%D0%B1%D0%BB%D0%B8%D0%B6%D0%B0%D0%B9%D1%88%D0%B8%D0%B5%20%D1%81%D0%BE%D1%81%D0%B5%D0%B4%D0%B8" target="_blank">Метод ближайших соседей на Habr</a> — разбор kNN с примерами применения</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsRegressor.html" target="_blank">sklearn: KNeighborsRegressor</a> — документация kNN-регрессора в sklearn</li>
      </ul>
    `,
  },
});
