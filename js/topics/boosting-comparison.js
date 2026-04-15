/* ==========================================================================
   XGBoost, LightGBM, CatBoost — сравнение библиотек бустинга
   ========================================================================== */
App.registerTopic({
  id: 'boosting-comparison',
  category: 'ml-cls',
  title: 'XGBoost, LightGBM, CatBoost',
  summary: `Три главные библиотеки <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting: чем отличаются, когда какую выбрать.`,

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Ты открываешь ресторан и выбираешь шеф-повара. Все трое — мастера одной кухни (gradient boosting), но каждый готовит по-своему:</p>
        <ul>
          <li><b>XGBoost</b> — опытный классик: надёжный, проверенный, подходит для всего. Иногда медлителен.</li>
          <li><b>LightGBM</b> — спринтер: готовит вдвое быстрее, но нужно правильно подобрать ингредиенты.</li>
          <li><b>CatBoost</b> — специалист по капризным блюдам: отлично справляется с необработанными продуктами (категориальными признаками) без предварительной подготовки.</li>
        </ul>
      </div>

      <h3>🎯 Общая идея: Gradient Boosting</h3>
      <p>Все три библиотеки реализуют одну концепцию — <b>последовательное построение деревьев</b>, где каждое следующее дерево исправляет ошибки предыдущих. Отличия — в деталях реализации, которые дают разные скорость, точность и удобство.</p>

      <div class="key-concept">
        <div class="kc-label">Что объединяет XGBoost, LightGBM, CatBoost</div>
        <p>Все три: (1) строят деревья последовательно, (2) каждое дерево обучается на остатках предыдущих, (3) используют gradient descent в функциональном пространстве, (4) поддерживают регуляризацию. Разница — в <b>как</b> строить дерево, <b>как</b> обрабатывать признаки, <b>как</b> ускорить вычисления.</p>
      </div>

      <h3>⚡ XGBoost (eXtreme Gradient Boosting, 2014)</h3>
      <p>Чен Тяньци создал XGBoost для соревнований по ML — и он быстро стал стандартом. Ключевые идеи:</p>
      <ul>
        <li><b>Аппроксимация 2-го порядка:</b> использует и <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">градиент</a>, и гессиан (вторую производную) для более точных сплитов.</li>
        <li><b>Регуляризация в loss:</b> $L = \\sum l(y_i, \\hat{y}_i) + \\sum [\\gamma T + \\frac{1}{2}\\lambda \\|w\\|^2]$, где $T$ — число листьев, $w$ — значения в листьях.</li>
        <li><b>Рост дерева: level-wise</b> — сначала все узлы текущего уровня, потом следующий.</li>
        <li><b>Weighted quantile sketch</b> — для ускорения поиска сплитов на больших данных.</li>
        <li><b>Встроенная обработка пропусков</b> — автоматически определяет, куда отправлять NaN.</li>
      </ul>
      <div class="math-block">$$\\text{Gain} = \\frac{1}{2}\\left[\\frac{G_L^2}{H_L + \\lambda} + \\frac{G_R^2}{H_R + \\lambda} - \\frac{(G_L + G_R)^2}{H_L + H_R + \\lambda}\\right] - \\gamma$$</div>
      <p>Где $G$ — сумма градиентов, $H$ — сумма гессианов. Дерево делает сплит только если Gain > 0.</p>

      <h3>🚀 LightGBM (Light Gradient Boosting Machine, 2017)</h3>
      <p>Microsoft Research сделали LightGBM быстрее XGBoost в 5-20 раз. Как:</p>
      <ul>
        <li><b>Рост дерева: leaf-wise</b> — вместо всех узлов одного уровня, выбирает лист с <b>максимальным loss reduction</b>. Даёт более точные, но асимметричные деревья.</li>
        <li><b>GOSS (Gradient-based One-Side Sampling)</b> — оставляет объекты с большим градиентом (большой ошибкой), случайно сэмплирует остальные. Меньше данных — быстрее.</li>
        <li><b>EFB (Exclusive Feature Bundling)</b> — объединяет редко совпадающие признаки (sparse features) для уменьшения размерности.</li>
        <li><b>Histogram-based splits</b> — бинирует непрерывные признаки в 255 бинов, ищет сплит по <a class="glossary-link" onclick="App.selectTopic('viz-histogram')">гистограмме</a>. $O(\\text{bins})$ вместо $O(n)$.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Level-wise vs Leaf-wise</div>
        <p><b>Level-wise</b> (XGBoost по умолчанию): дерево растёт «ровно» — все узлы одного уровня, потом следующий. Контролируется через max_depth.</p>
        <p><b>Leaf-wise</b> (LightGBM): дерево выбирает самый «полезный» лист и делит его. Быстрее добирается до хорошего loss, но может переобучиться → нужно ограничивать num_leaves.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Level-wise (XGBoost) vs Leaf-wise (LightGBM)</text>

          <!-- Level-wise tree -->
          <g>
            <text x="190" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">Level-wise: симметричный рост</text>
            <text x="190" y="72" text-anchor="middle" font-size="10" fill="#64748b">Все узлы одного уровня сначала</text>
            <!-- Root -->
            <circle cx="190" cy="100" r="18" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
            <text x="190" y="105" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">x1</text>
            <!-- Level 1 -->
            <circle cx="130" cy="160" r="18" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
            <text x="130" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">x2</text>
            <circle cx="250" cy="160" r="18" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
            <text x="250" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">x3</text>
            <line x1="178" y1="115" x2="142" y2="146" stroke="#475569" stroke-width="1.5"/>
            <line x1="202" y1="115" x2="238" y2="146" stroke="#475569" stroke-width="1.5"/>
            <!-- Level 2 (leaves): binary tree → 4 leaves -->
            <rect x="85" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="100" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L1</text>
            <rect x="135" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="150" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L2</text>
            <rect x="215" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="230" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L3</text>
            <rect x="265" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="280" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L4</text>
            <line x1="122" y1="175" x2="100" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="138" y1="175" x2="150" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="242" y1="175" x2="230" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="258" y1="175" x2="280" y2="212" stroke="#475569" stroke-width="1"/>

            <text x="190" y="265" text-anchor="middle" font-size="11" fill="#475569">Ограничение: max_depth</text>
            <text x="190" y="283" text-anchor="middle" font-size="11" fill="#059669">✓ Сбалансированное</text>
            <text x="190" y="298" text-anchor="middle" font-size="11" fill="#059669">✓ Меньше <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a></text>
            <text x="190" y="313" text-anchor="middle" font-size="11" fill="#dc2626">✗ Медленнее достигает loss</text>
          </g>

          <!-- Leaf-wise tree -->
          <g>
            <text x="570" y="55" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">Leaf-wise: асимметричный рост</text>
            <text x="570" y="72" text-anchor="middle" font-size="10" fill="#64748b">Делим самый «полезный» лист</text>
            <!-- Root -->
            <circle cx="570" cy="100" r="18" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
            <text x="570" y="105" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">x1</text>
            <!-- Left goes deeper (wanted to split the "best" leaf) -->
            <circle cx="500" cy="160" r="18" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
            <text x="500" y="165" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">x2</text>
            <!-- Right stays as leaf -->
            <rect x="620" y="148" width="30" height="22" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
            <text x="635" y="163" text-anchor="middle" font-size="10" fill="#92400e">L1</text>
            <line x1="556" y1="115" x2="512" y2="146" stroke="#475569" stroke-width="1.5"/>
            <line x1="584" y1="115" x2="624" y2="148" stroke="#475569" stroke-width="1.5"/>
            <!-- Level 2: x2 splits further -->
            <circle cx="450" cy="220" r="18" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
            <text x="450" y="225" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">x3</text>
            <rect x="530" y="208" width="30" height="22" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
            <text x="545" y="223" text-anchor="middle" font-size="10" fill="#92400e">L2</text>
            <line x1="488" y1="175" x2="462" y2="206" stroke="#475569" stroke-width="1"/>
            <line x1="512" y1="175" x2="534" y2="208" stroke="#475569" stroke-width="1"/>
            <!-- Level 3: x3 splits further -->
            <rect x="405" y="270" width="30" height="22" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
            <text x="420" y="285" text-anchor="middle" font-size="10" fill="#92400e">L3</text>
            <rect x="465" y="270" width="30" height="22" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
            <text x="480" y="285" text-anchor="middle" font-size="10" fill="#92400e">L4</text>
            <line x1="442" y1="238" x2="420" y2="268" stroke="#475569" stroke-width="1"/>
            <line x1="458" y1="238" x2="480" y2="268" stroke="#475569" stroke-width="1"/>

            <text x="570" y="313" text-anchor="middle" font-size="11" fill="#059669">✓ Быстрее снижает loss</text>
          </g>
        </svg>
        <div class="caption">Слева — level-wise растёт симметрично, все ветки одной глубины. Справа — leaf-wise идёт «в глубину» туда, где наибольший выигрыш по loss. Асимметричное дерево быстрее снижает ошибку, но легче переобучается.</div>
      </div>

      <h3>🐱 CatBoost (Categorical Boosting, 2017)</h3>
      <p>Яндекс создал CatBoost специально для данных с <b>категориальными признаками</b> (город, тип товара, операционная система):</p>
      <ul>
        <li><b>Ordered Target Encoding</b> — кодирует категории средним таргета, но с хитростью: для каждого объекта использует только предыдущие объекты (предотвращает target leakage).</li>
        <li><b>Ordered Boosting</b> — при вычислении остатков для каждого объекта использует модель, обученную без него. Борется с prediction shift.</li>
        <li><b>Symmetric Trees</b> — все узлы на одном уровне используют <b>один и тот же сплит</b>. Это ограничивает гибкость, но ускоряет предсказание и снижает переобучение.</li>
        <li><b>Не нужен <a class="glossary-link" onclick="App.selectTopic('glossary-one-hot')">one-hot</a> encoding</b> — принимает категории «как есть», без ручной подготовки.</li>
      </ul>

      <h3>📊 Сравнительная таблица</h3>
      <table>
        <tr><th></th><th>XGBoost</th><th>LightGBM</th><th>CatBoost</th></tr>
        <tr><td><b>Рост дерева</b></td><td>Level-wise</td><td>Leaf-wise</td><td>Symmetric (level-wise)</td></tr>
        <tr><td><b>Скорость обучения</b></td><td>Средняя</td><td>Быстрая (×5-20)</td><td>Средняя</td></tr>
        <tr><td><b>Категориальные</b></td><td>Нужен encoding</td><td>Нужен encoding</td><td>Встроенная обработка</td></tr>
        <tr><td><b>Пропуски (NaN)</b></td><td>Встроенная обработка</td><td>Встроенная обработка</td><td>Встроенная обработка</td></tr>
        <tr><td><b>GPU</b></td><td>Да</td><td>Да</td><td>Да (быстрый)</td></tr>
        <tr><td><b>Порядок данных</b></td><td>Не важен</td><td>Не важен</td><td>Влияет (ordered boosting)</td></tr>
        <tr><td><b>Переобучение</b></td><td>Средний риск</td><td>Высокий (leaf-wise)</td><td>Низкий</td></tr>
        <tr><td><b>Из коробки</b></td><td>Нужен тюнинг</td><td>Нужен тюнинг</td><td>Хорошо без тюнинга</td></tr>
        <tr><td><b>Лучше для</b></td><td>Любые задачи</td><td>Большие данные</td><td>Много категорий</td></tr>
      </table>

      <h3>🔧 Ключевые гиперпараметры</h3>
      <table>
        <tr><th>Параметр</th><th>XGBoost</th><th>LightGBM</th><th>CatBoost</th></tr>
        <tr><td><b>Скорость обучения</b></td><td>learning_rate</td><td>learning_rate</td><td>learning_rate</td></tr>
        <tr><td><b>Число деревьев</b></td><td>n_estimators</td><td>n_estimators</td><td>iterations</td></tr>
        <tr><td><b>Глубина</b></td><td>max_depth (6)</td><td>max_depth (-1)</td><td>depth (6)</td></tr>
        <tr><td><b>Листьев</b></td><td>—</td><td>num_leaves (31)</td><td>—</td></tr>
        <tr><td><b>L2 регуляризация</b></td><td>reg_lambda</td><td>reg_lambda</td><td>l2_leaf_reg</td></tr>
        <tr><td><b>Сэмплинг строк</b></td><td>subsample</td><td>bagging_fraction</td><td>subsample</td></tr>
        <tr><td><b>Сэмплинг признаков</b></td><td>colsample_bytree</td><td>feature_fraction</td><td>rsm</td></tr>
        <tr><td><b>Min в листе</b></td><td>min_child_weight</td><td>min_child_samples</td><td>min_data_in_leaf</td></tr>
      </table>

      <h3>📋 Как выбрать библиотеку</h3>
      <ul>
        <li><b>Данные > 1M строк</b> → LightGBM (скорость решает).</li>
        <li><b>Много категориальных признаков</b> → CatBoost (не нужен ручной encoding).</li>
        <li><b>Нужна максимальная надёжность</b> → XGBoost (проверен годами).</li>
        <li><b>Kaggle / соревнования</b> → попробуйте все три и возьмите лучший (или стекинг всех трёх).</li>
        <li><b>Быстрый бейзлайн без тюнинга</b> → CatBoost (хорошие дефолты).</li>
        <li><b>Продакшен с малой латентностью</b> → CatBoost (быстрый inference за счёт symmetric trees).</li>
      </ul>

      <h3>⚠️ Частые ошибки</h3>
      <ul>
        <li><b>«LightGBM всегда быстрее»</b> — на маленьких датасетах разница минимальна, а leaf-wise может переобучиться.</li>
        <li><b>«CatBoost только для категорий»</b> — нет, он хорош и на числовых данных, просто для категорий особенно силён.</li>
        <li><b>Забыть early_stopping</b> — без него деревья плодятся бесконтрольно. Всегда используйте.</li>
        <li><b>Не масштабировать данные</b> — не нужно! Деревья инвариантны к монотонным преобразованиям.</li>
        <li><b>Сравнивать без тюнинга</b> — дефолтные параметры разные. Честное сравнение — после оптимизации.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: Prediction Shift в CatBoost</summary>
        <div class="deep-dive-body">
          <p>Обычный boosting использует одну и ту же модель для вычисления остатков <b>для всех объектов</b>, включая те, на которых модель обучалась. Это создаёт «оптимистичный» сдвиг: модель переуверена на train.</p>
          <p>CatBoost использует <b>ordered boosting</b>: для объекта $i$ остаток считается по модели, обученной только на объектах $1, \\ldots, i-1$. Каждый объект «видит» модель, которая его не знает. Это аналогично leave-one-out, но вычислительно эффективно.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: GOSS в LightGBM</summary>
        <div class="deep-dive-body">
          <p>Идея: объекты с <b>маленьким градиентом</b> уже хорошо обучены — их можно сэмплировать. Объекты с <b>большим градиентом</b> (большие ошибки) — самые информативные, берём все.</p>
          <p>Алгоритм: сортируем объекты по |gradient|. Берём top-a% с большим градиентом и случайные b% из остальных. Остальным умножаем вес на (1-a)/b, чтобы сохранить распределение.</p>
          <p>Типичные значения: a=20%, b=10%. Итого обучаем на 30% данных с корректными весами — ускорение ~3×.</p>
        </div>
      </div>
    `,

    examples: [
      {
        title: 'Сравнение на одном датасете',
        content: `
          <h4>Задача</h4>
          <p>Классификация клиентов банка: уйдёт или останется (churn). 10 000 строк, 10 признаков (числовые + категориальные: «город», «пол», «тарифный план»).</p>

          <h4>Шаг 1: Подготовка для каждой библиотеки</h4>
          <table>
            <tr><th>Библиотека</th><th>Подготовка категорий</th><th>Подготовка пропусков</th></tr>
            <tr><td>XGBoost</td><td>LabelEncoder + one-hot (или OrdinalEncoder)</td><td>Не нужна (обрабатывает NaN)</td></tr>
            <tr><td>LightGBM</td><td>LabelEncoder (указать categorical_feature)</td><td>Не нужна</td></tr>
            <tr><td>CatBoost</td><td><b>Ничего</b> (указать cat_features)</td><td>Не нужна</td></tr>
          </table>

          <h4>Шаг 2: Обучение с одинаковыми гиперпараметрами</h4>
          <p>learning_rate=0.1, n_estimators=500, max_depth=6, early_stopping=50 раундов.</p>

          <h4>Шаг 3: Результаты</h4>
          <table>
            <tr><th>Метрика</th><th>XGBoost</th><th>LightGBM</th><th>CatBoost</th></tr>
            <tr><td><b>ROC-AUC</b></td><td>0.862</td><td>0.858</td><td><b>0.871</b></td></tr>
            <tr><td><b>F1-score</b></td><td>0.641</td><td>0.635</td><td><b>0.659</b></td></tr>
            <tr><td><b>Время обучения</b></td><td>12.3 сек</td><td><b>3.1 сек</b></td><td>8.7 сек</td></tr>
            <tr><td><b>Деревьев до early_stop</b></td><td>287</td><td>312</td><td>245</td></tr>
          </table>

          <div class="why">CatBoost выиграл по качеству (3 категориальных признака → его сильная сторона). LightGBM — в 4 раза быстрее XGBoost. XGBoost — золотая середина. При тюнинге каждой библиотеки отдельно разрыв может измениться.</div>

          <h4>Шаг 4: После тюнинга (Optuna, 100 trials)</h4>
          <table>
            <tr><th></th><th>XGBoost</th><th>LightGBM</th><th>CatBoost</th></tr>
            <tr><td><b>ROC-AUC</b></td><td>0.878</td><td>0.876</td><td><b>0.882</b></td></tr>
          </table>
          <p>После тюнинга разрыв сужается до ~0.5%. На практике различия между библиотеками <b>меньше</b>, чем между качеством feature engineering.</p>
        `
      },
      {
        title: 'LightGBM на больших данных',
        content: `
          <h4>Задача</h4>
          <p>Предсказание кликов по рекламе. 10 млн строк, 50 признаков. Датасет не помещается в обычный GridSearch.</p>

          <h4>Почему LightGBM?</h4>
          <ul>
            <li><b>GOSS</b>: обучение на 30% данных → ×3 ускорение.</li>
            <li><b>Histogram binning</b>: 255 бинов вместо сортировки 10M значений.</li>
            <li><b>Leaf-wise</b>: быстрее достигает хорошего loss.</li>
          </ul>

          <h4>Сравнение времени обучения (500 деревьев, depth=8, CPU)</h4>
          <table>
            <tr><th>Строк</th><th>XGBoost</th><th>LightGBM</th><th>Ускорение</th></tr>
            <tr><td>100K</td><td>8 сек</td><td>3 сек</td><td>×2.7</td></tr>
            <tr><td>1M</td><td>85 сек</td><td>12 сек</td><td>×7</td></tr>
            <tr><td>10M</td><td>950 сек</td><td>65 сек</td><td><b>×15</b></td></tr>
          </table>

          <div class="why">Ускорение растёт с размером данных. На 10M строк LightGBM в 15 раз быстрее. Это критично для итеративного ML: больше экспериментов за то же время → лучший результат.</div>

          <h4>Ключевые настройки LightGBM для больших данных</h4>
          <ul>
            <li><code>num_leaves=63</code> (вместо дефолтных 31) — более сложные деревья.</li>
            <li><code>min_child_samples=100</code> — не переобучаться на маленьких подвыборках.</li>
            <li><code>feature_fraction=0.7</code> — не все признаки на каждое дерево.</li>
            <li><code>bagging_fraction=0.8, bagging_freq=5</code> — стохастичность для стабильности.</li>
          </ul>
        `
      },
      {
        title: 'CatBoost с категориальными признаками',
        content: `
          <h4>Задача</h4>
          <p>Предсказание зарплаты по резюме. Признаки: город (500 значений), должность (200), отрасль (50), стаж (число), образование (5 категорий).</p>
          <p>3 из 5 признаков — <b>категориальные с высокой кардинальностью</b>.</p>

          <h4>Проблема с one-hot encoding</h4>
          <ul>
            <li>Город: 500 значений → 500 бинарных столбцов. Матрица становится sparse.</li>
            <li>Должность: 200 столбцов.</li>
            <li>Итого: 5 → 755 столбцов. Деревья тратят время на бесполезные сплиты.</li>
          </ul>

          <h4>CatBoost: ordered target encoding</h4>
          <p>Для объекта $i$ кодирует «Москва» как:</p>
          <div class="math-block">$$\\text{encode}(\\text{Москва}, i) = \\frac{\\sum_{j < i, \\text{city}_j = \\text{Москва}} y_j + \\text{prior}}{\\text{count}_{j < i, \\text{city}_j = \\text{Москва}} + 1}$$</div>
          <p>Используются только <b>предыдущие</b> объекты → нет target leakage!</p>

          <h4>Результаты</h4>
          <table>
            <tr><th>Метод</th><th>RMSE</th><th>R²</th></tr>
            <tr><td>XGBoost + One-Hot</td><td>28 500</td><td>0.72</td></tr>
            <tr><td>LightGBM + LabelEnc</td><td>26 800</td><td>0.75</td></tr>
            <tr><td>CatBoost (cat_features)</td><td><b>24 100</b></td><td><b>0.80</b></td></tr>
          </table>

          <div class="why">CatBoost выигрывает 8% по R² за счёт правильного кодирования категорий. Город «Москва» кодируется числом ~120K (средняя зарплата москвичей в датасете), что намного информативнее бинарного 0/1.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: четыре ансамбля на одних данных</h3>
        <p>Один и тот же датасет — четыре модели: <b>Random Forest</b>, <b>XGBoost</b> (level-wise, depth-limited), <b>LightGBM</b> (leaf-wise, асимметричный рост), <b>CatBoost</b> (oblivious / симметричные деревья). Сравни границы решений: RF более гладкий, LightGBM тянется глубже в сложные зоны, CatBoost симметричный и аккуратный. <i>Симуляция концептуальная — имитирует философию библиотек, а не их реальный код.</i></p>
        <div class="sim-container">
          <div class="sim-controls" id="bc-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="bc-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div><div style="font-weight:600;margin-bottom:4px;">Random Forest</div><div class="sim-chart-wrap" style="height:230px;padding:0;"><canvas id="bc-rf" class="sim-canvas"></canvas></div></div>
              <div><div style="font-weight:600;margin-bottom:4px;">XGBoost (level-wise)</div><div class="sim-chart-wrap" style="height:230px;padding:0;"><canvas id="bc-xgb" class="sim-canvas"></canvas></div></div>
              <div><div style="font-weight:600;margin-bottom:4px;">LightGBM (leaf-wise)</div><div class="sim-chart-wrap" style="height:230px;padding:0;"><canvas id="bc-lgb" class="sim-canvas"></canvas></div></div>
              <div><div style="font-weight:600;margin-bottom:4px;">CatBoost (oblivious)</div><div class="sim-chart-wrap" style="height:230px;padding:0;"><canvas id="bc-cat" class="sim-canvas"></canvas></div></div>
            </div>
            <div class="sim-stats" id="bc-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#bc-controls');
        const cShape = App.makeControl('select', 'bc-shape', 'Форма данных', {
          options: [
            { value: 'moons', label: 'Две луны' },
            { value: 'xor', label: 'XOR' },
            { value: 'circle', label: 'Круг' },
            { value: 'spiral', label: 'Спираль' },
          ],
          value: 'moons',
        });
        const cN = App.makeControl('range', 'bc-n', 'Точек', { min: 60, max: 300, step: 10, value: 140 });
        const cNoise = App.makeControl('range', 'bc-noise', 'Шум меток %', { min: 0, max: 20, step: 1, value: 5 });
        const cTrees = App.makeControl('range', 'bc-trees', 'Число деревьев', { min: 10, max: 100, step: 5, value: 40 });
        [cShape, cN, cNoise, cTrees].forEach(c => controls.appendChild(c.wrap));

        let points = [];

        function genPoint(shape, noise) {
          let x, y, cls;
          if (shape === 'moons') {
            const t = Math.random() * Math.PI;
            if (Math.random() < 0.5) {
              x = 0.3 + 0.25 * Math.cos(t) + App.Util.randn(0, 0.03);
              y = 0.45 + 0.25 * Math.sin(t) + App.Util.randn(0, 0.03);
              cls = 0;
            } else {
              x = 0.55 + 0.25 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.03);
              y = 0.55 - 0.25 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.03);
              cls = 1;
            }
          } else if (shape === 'xor') {
            x = Math.random(); y = Math.random();
            cls = ((x > 0.5) ^ (y > 0.5)) ? 1 : 0;
          } else if (shape === 'circle') {
            x = Math.random(); y = Math.random();
            const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
            cls = r < 0.25 ? 0 : 1;
          } else {
            const t = Math.random() * 4 * Math.PI;
            const r = t / (4 * Math.PI) * 0.3;
            if (Math.random() < 0.5) {
              x = 0.5 + r * Math.cos(t) + App.Util.randn(0, 0.015);
              y = 0.5 + r * Math.sin(t) + App.Util.randn(0, 0.015);
              cls = 0;
            } else {
              x = 0.5 - r * Math.cos(t) + App.Util.randn(0, 0.015);
              y = 0.5 - r * Math.sin(t) + App.Util.randn(0, 0.015);
              cls = 1;
            }
          }
          if (Math.random() < noise) cls = 1 - cls;
          return { x, y, cls };
        }

        function genData() {
          const shape = cShape.input.value;
          const noise = +cNoise.input.value / 100;
          const n = +cN.input.value;
          points = [];
          for (let i = 0; i < n; i++) points.push(genPoint(shape, noise));
          rebuildAll();
        }

        // --- generic helpers ---
        function gini(items) {
          if (items.length === 0) return 0;
          let c0 = 0; items.forEach(p => p.cls === 0 && c0++);
          const p0 = c0 / items.length, p1 = 1 - p0;
          return 1 - p0 * p0 - p1 * p1;
        }
        function majority(items) { let c0 = 0; items.forEach(p => p.cls === 0 && c0++); return c0 >= items.length - c0 ? 0 : 1; }
        function leafProb(items) {
          if (items.length === 0) return 0.5;
          let c1 = 0; items.forEach(p => p.cls === 1 && c1++);
          return c1 / items.length;
        }
        function bestSplit(items, forcedFeat) {
          const feats = forcedFeat ? [forcedFeat] : ['x', 'y'];
          let best = null;
          const base = gini(items);
          feats.forEach(feat => {
            const vals = items.map(p => p[feat]).sort((a, b) => a - b);
            for (let i = 1; i < vals.length; i++) {
              const thr = (vals[i - 1] + vals[i]) / 2;
              const L = items.filter(p => p[feat] < thr);
              const R = items.filter(p => p[feat] >= thr);
              if (L.length === 0 || R.length === 0) continue;
              const w = (L.length * gini(L) + R.length * gini(R)) / items.length;
              const gain = base - w;
              if (!best || gain > best.gain) best = { feat, thr, gain, L, R };
            }
          });
          return best;
        }

        // --- RF: level-wise, bagging, random feat subset ---
        function buildRFTree(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length < 2 || gini(items) < 1e-9) {
            return { leaf: true, prob: leafProb(items) };
          }
          const feat = Math.random() < 0.5 ? 'x' : 'y';
          const best = bestSplit(items, feat);
          if (!best || best.gain < 1e-6) return { leaf: true, prob: leafProb(items) };
          return { leaf: false, feat: best.feat, thr: best.thr,
            left: buildRFTree(best.L, depth + 1, maxDepth),
            right: buildRFTree(best.R, depth + 1, maxDepth) };
        }

        // --- XGBoost: level-wise, strict max_depth, both feats ---
        function buildXGBTree(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length < 2 || gini(items) < 1e-9) {
            return { leaf: true, prob: leafProb(items) };
          }
          const best = bestSplit(items);
          if (!best || best.gain < 1e-6) return { leaf: true, prob: leafProb(items) };
          return { leaf: false, feat: best.feat, thr: best.thr,
            left: buildXGBTree(best.L, depth + 1, maxDepth),
            right: buildXGBTree(best.R, depth + 1, maxDepth) };
        }

        // --- LightGBM: leaf-wise, max_leaves ---
        function buildLGBTree(items, maxLeaves) {
          const root = { leaf: true, items, prob: leafProb(items), depth: 0 };
          const leaves = [root];
          while (leaves.length < maxLeaves) {
            // выбрать лист с макс. gain
            let bestLeaf = null, bestData = null;
            for (const lf of leaves) {
              if (lf.items.length < 4) continue;
              const split = bestSplit(lf.items);
              if (!split || split.gain < 1e-6) continue;
              if (!bestData || split.gain > bestData.gain) { bestLeaf = lf; bestData = split; }
            }
            if (!bestLeaf) break;
            // разделить
            bestLeaf.leaf = false;
            bestLeaf.feat = bestData.feat;
            bestLeaf.thr = bestData.thr;
            const L = { leaf: true, items: bestData.L, prob: leafProb(bestData.L), depth: bestLeaf.depth + 1 };
            const R = { leaf: true, items: bestData.R, prob: leafProb(bestData.R), depth: bestLeaf.depth + 1 };
            bestLeaf.left = L; bestLeaf.right = R;
            const idx = leaves.indexOf(bestLeaf);
            leaves.splice(idx, 1, L, R);
          }
          // очистка items
          (function strip(n) { delete n.items; if (!n.leaf) { strip(n.left); strip(n.right); } })(root);
          return root;
        }

        // --- CatBoost: oblivious / symmetric — все узлы одного уровня имеют одинаковый сплит ---
        function buildOblivious(items, depth) {
          // на каждом уровне один и тот же (feat, thr) для ВСЕХ узлов
          // жадно: перебираем сплит, максимизируя средний gain по всем текущим leaf-bucket-ам
          let buckets = [items];
          const splits = [];
          for (let d = 0; d < depth; d++) {
            let best = null;
            ['x', 'y'].forEach(feat => {
              const allVals = items.map(p => p[feat]).sort((a, b) => a - b);
              const step = Math.max(1, Math.floor(allVals.length / 12));
              for (let i = step; i < allVals.length; i += step) {
                const thr = (allVals[i - 1] + allVals[i]) / 2;
                let totalGain = 0, totalItems = 0;
                buckets.forEach(b => {
                  if (b.length === 0) return;
                  const baseG = gini(b) * b.length;
                  const L = b.filter(p => p[feat] < thr);
                  const R = b.filter(p => p[feat] >= thr);
                  if (L.length === 0 || R.length === 0) { totalGain += 0; totalItems += b.length; return; }
                  const gainW = baseG - (L.length * gini(L) + R.length * gini(R));
                  totalGain += gainW;
                  totalItems += b.length;
                });
                const avg = totalItems > 0 ? totalGain / totalItems : 0;
                if (!best || avg > best.gain) best = { feat, thr, gain: avg };
              }
            });
            if (!best || best.gain < 1e-6) break;
            splits.push({ feat: best.feat, thr: best.thr });
            const newBuckets = [];
            buckets.forEach(b => {
              newBuckets.push(b.filter(p => p[best.feat] < best.thr));
              newBuckets.push(b.filter(p => p[best.feat] >= best.thr));
            });
            buckets = newBuckets;
          }
          const leafProbs = buckets.map(b => leafProb(b));
          return { splits, leafProbs };
        }
        function predictOblivious(tree, x, y) {
          let idx = 0;
          tree.splits.forEach(s => {
            const v = s.feat === 'x' ? x : y;
            idx = idx * 2 + (v < s.thr ? 0 : 1);
          });
          return tree.leafProbs[idx] ?? 0.5;
        }

        function predictBinary(tree, x, y) {
          if (tree.leaf) return tree.prob;
          const v = tree.feat === 'x' ? x : y;
          return v < tree.thr ? predictBinary(tree.left, x, y) : predictBinary(tree.right, x, y);
        }

        // ансамбли
        let rfModel = null, xgbModel = null, lgbModel = null, catModel = null;

        function bootstrap() {
          const sample = [];
          for (let i = 0; i < points.length; i++) sample.push(points[Math.floor(Math.random() * points.length)]);
          return sample;
        }

        function rebuildAll() {
          const T = +cTrees.input.value;
          // RF: bagging, depth 5, majority vote — среднее вероятностей
          rfModel = [];
          for (let t = 0; t < T; t++) rfModel.push(buildRFTree(bootstrap(), 0, 5));
          // XGBoost: depth 4, boosting по градиенту (сводим к residuals, но для классификации — упрощённо: каждое дерево берёт текущие остатки как (cls - pred))
          xgbModel = [];
          let probs = new Array(points.length).fill(0.5);
          for (let t = 0; t < T; t++) {
            const items = points.map((p, i) => ({ x: p.x, y: p.y, cls: p.cls - probs[i] > 0 ? 1 : 0 }));
            const tree = buildXGBTree(items, 0, 4);
            xgbModel.push(tree);
            for (let i = 0; i < points.length; i++) {
              probs[i] += 0.3 * (predictBinary(tree, points[i].x, points[i].y) - 0.5);
            }
          }
          // LightGBM: leaf-wise, max_leaves=16, boosting
          lgbModel = [];
          probs = new Array(points.length).fill(0.5);
          for (let t = 0; t < T; t++) {
            const items = points.map((p, i) => ({ x: p.x, y: p.y, cls: p.cls - probs[i] > 0 ? 1 : 0 }));
            const tree = buildLGBTree(items, 16);
            lgbModel.push(tree);
            for (let i = 0; i < points.length; i++) {
              probs[i] += 0.3 * (predictBinary(tree, points[i].x, points[i].y) - 0.5);
            }
          }
          // CatBoost: oblivious depth 5, boosting
          catModel = [];
          probs = new Array(points.length).fill(0.5);
          for (let t = 0; t < T; t++) {
            const items = points.map((p, i) => ({ x: p.x, y: p.y, cls: p.cls - probs[i] > 0 ? 1 : 0 }));
            const tree = buildOblivious(items, 5);
            catModel.push(tree);
            for (let i = 0; i < points.length; i++) {
              probs[i] += 0.3 * (predictOblivious(tree, points[i].x, points[i].y) - 0.5);
            }
          }
          drawAll();
        }

        function predictModel(model, type, x, y) {
          if (type === 'rf') {
            let s = 0; model.forEach(t => s += predictBinary(t, x, y));
            return s / model.length;
          }
          let v = 0.5;
          model.forEach(t => {
            const p = type === 'cat' ? predictOblivious(t, x, y) : predictBinary(t, x, y);
            v += 0.3 * (p - 0.5);
          });
          return Math.max(0, Math.min(1, v));
        }

        function drawModel(canvasId, model, type) {
          const canvas = container.querySelector('#' + canvasId);
          const r = canvas.getBoundingClientRect();
          canvas.width = r.width;
          canvas.height = r.height;
          const ctx = canvas.getContext('2d');
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const step = 6;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const p = predictModel(model, type, px / W, py / H);
              ctx.fillStyle = `rgba(${Math.round(239 * (1 - p) + 59 * p)},${Math.round(68 * (1 - p) + 130 * p)},${Math.round(68 * (1 - p) + 246 * p)},0.25)`;
              ctx.fillRect(px, py, step, step);
            }
          }
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 3, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });
          // accuracy
          let correct = 0;
          points.forEach(p => { if (Math.round(predictModel(model, type, p.x, p.y)) === p.cls) correct++; });
          return correct / points.length;
        }

        function drawAll() {
          const accRF = drawModel('bc-rf', rfModel, 'rf');
          const accXGB = drawModel('bc-xgb', xgbModel, 'xgb');
          const accLGB = drawModel('bc-lgb', lgbModel, 'lgb');
          const accCAT = drawModel('bc-cat', catModel, 'cat');
          container.querySelector('#bc-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">RF acc</div><div class="stat-value">${(accRF * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">XGB acc</div><div class="stat-value">${(accXGB * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">LGB acc</div><div class="stat-value">${(accLGB * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">CAT acc</div><div class="stat-value">${(accCAT * 100).toFixed(1)}%</div></div>
          `;
        }

        [cShape, cN, cNoise].forEach(c => c.input.addEventListener('change', genData));
        cTrees.input.addEventListener('change', rebuildAll);
        container.querySelector('#bc-regen').onclick = genData;
        setTimeout(genData, 50);
        window.addEventListener('resize', () => drawAll());
      },
    },

    python: `
<h3>Единый API для трёх библиотек</h3>
<pre><code>import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# Загрузка данных
df = pd.read_csv('churn.csv')
X = df.drop('churn', axis=1)
y = df['churn']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
</code></pre>

<h4>XGBoost</h4>
<pre><code>import xgboost as xgb

model_xgb = xgb.XGBClassifier(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1.0,
    eval_metric='auc',
    early_stopping_rounds=50,
    random_state=42
)
model_xgb.fit(X_train, y_train,
              eval_set=[(X_test, y_test)],
              verbose=100)

print(f"XGBoost AUC: {roc_auc_score(y_test, model_xgb.predict_proba(X_test)[:,1]):.4f}")
</code></pre>

<h4>LightGBM</h4>
<pre><code>import lightgbm as lgb

model_lgb = lgb.LGBMClassifier(
    n_estimators=500,
    learning_rate=0.05,
    num_leaves=63,            # leaf-wise: контролируем сложность
    max_depth=-1,             # без ограничения (контроль через num_leaves)
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1.0,
    random_state=42
)
model_lgb.fit(X_train, y_train,
              eval_set=[(X_test, y_test)],
              callbacks=[lgb.early_stopping(50), lgb.log_evaluation(100)])

print(f"LightGBM AUC: {roc_auc_score(y_test, model_lgb.predict_proba(X_test)[:,1]):.4f}")
</code></pre>

<h4>CatBoost</h4>
<pre><code>from catboost import CatBoostClassifier

cat_features = ['city', 'gender', 'plan']  # имена категориальных колонок

model_cb = CatBoostClassifier(
    iterations=500,
    learning_rate=0.05,
    depth=6,
    l2_leaf_reg=3.0,
    cat_features=cat_features,  # вот и всё!
    eval_metric='AUC',
    early_stopping_rounds=50,
    verbose=100,
    random_state=42
)
model_cb.fit(X_train, y_train, eval_set=(X_test, y_test))

print(f"CatBoost AUC: {roc_auc_score(y_test, model_cb.predict_proba(X_test)[:,1]):.4f}")
</code></pre>

<h4>Стекинг всех трёх</h4>
<pre><code>from sklearn.ensemble import VotingClassifier

ensemble = VotingClassifier(
    estimators=[
        ('xgb', model_xgb),
        ('lgb', model_lgb),
        ('cb', model_cb)
    ],
    voting='soft'  # усредняем вероятности
)
# Для CatBoost с cat_features нужен отдельный pipeline
# Простой вариант — усреднить вероятности вручную:
p_xgb = model_xgb.predict_proba(X_test)[:, 1]
p_lgb = model_lgb.predict_proba(X_test)[:, 1]
p_cb = model_cb.predict_proba(X_test)[:, 1]

p_ensemble = (p_xgb + p_lgb + p_cb) / 3
print(f"Ensemble AUC: {roc_auc_score(y_test, p_ensemble):.4f}")
</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется каждая библиотека — реальные кейсы</h3>
      <ul>
        <li><b>XGBoost — старая гвардия Kaggle и enterprise.</b> Стандарт в банках и крупных компаниях США: проверен с 2014 года, есть интеграции во все ML-платформы (Databricks, SageMaker, Vertex AI), отлично задокументирован. Если ты приходишь в банк с существующим ML-стеком, там уже стоит XGBoost.</li>
        <li><b>LightGBM — рекламные системы и огромные данные.</b> Microsoft создал его именно для Bing Ads, и сегодня он стандарт на задачах CTR/CVR prediction с десятками миллионов строк и сотнями признаков. Там, где XGBoost тренируется час, LightGBM справляется за 10 минут.</li>
        <li><b>CatBoost — Яндекс, e-commerce, задачи с категориями.</b> Родная библиотека Яндекса, используется для ранжирования поиска, рекомендаций, прогноза такси. Лучший выбор, когда у тебя много high-cardinality categorical фич: ID магазина, модель товара, географический район.</li>
        <li><b>Random Forest — продакшен в банках, биомедицина, EDA.</b> Там, где данных мало (сотни строк, тысячи фич), тюнить некому и стабильность важнее последних 2% точности. Типично в геномике, медицинских исследованиях, первичном EDA любой задачи.</li>
        <li><b>Stacking XGBoost + LightGBM + CatBoost — Kaggle gold.</b> Когда нужны последние 0.5% на лидерборде. Каждая библиотека находит чуть разные паттерны, мета-модель их комбинирует. В продакшене редко — слишком сложно поддерживать.</li>
        <li><b>Учебные задачи и маленькие данные — sklearn GradientBoosting.</b> Без зависимостей, простой API, достаточно для понимания алгоритма и работы на датасетах &lt; 50K строк. Дальше — миграция на XGBoost/LightGBM.</li>
      </ul>

      <h3>✅ Сильные стороны — и когда они решают выбор</h3>
      <p><b>XGBoost: надёжность и регуляризация.</b> L1/L2 регуляризация на уровне функции потерь, tree pruning через gain threshold, честная обработка sparse-данных — всё это делает XGBoost предсказуемым на средних датасетах (10K-1M строк). Если ты не знаешь, что выбрать, и у тебя обычная таблица — начинай с XGBoost.</p>
      <p><b>LightGBM: скорость на больших данных.</b> Histogram-based split (дискретизация в 256 бинов) + GOSS (gradient-based one-side sampling) + EFB (exclusive feature bundling) дают x10-x50 ускорение относительно XGBoost на датасетах от миллиона строк. Leaf-wise рост даёт более глубокую оптимизацию при том же числе узлов.</p>
      <p><b>CatBoost: категориальные признаки без ручной работы.</b> Ordered target encoding (leak-free target encoding внутри CV) плюс feature combinations (автоматические произведения категорий) — это целый класс фич, которые XGBoost и LightGBM требуют делать руками. Если у тебя 50+ категориальных колонок — CatBoost сэкономит дни feature engineering.</p>
      <p><b>CatBoost: лучшие дефолты.</b> Symmetric trees + ordered boosting + автоматическая регуляризация дают качественную модель «из коробки» — часто без тюнинга. Для задач, где некому тратить день на Optuna, CatBoost — самый безопасный выбор.</p>
      <p><b>CatBoost: быстрый inference.</b> Symmetric trees (oblivious trees) имеют одинаковую структуру на каждом уровне — инференс векторизуется в десятки раз быстрее, чем у XGBoost/LightGBM. Важно для real-time API.</p>
      <p><b>Random Forest: устойчивость и простота.</b> Работает без тюнинга, не переобучается с ростом деревьев, дружелюбен к шумным меткам. Для задач, где «надо запустить и забыть», RF всё ещё лучший выбор.</p>

      <h3>⚠️ Ограничения каждой библиотеки — и где это реально бьёт</h3>
      <p><b>XGBoost: нет нативных категорий (до версии 1.5).</b> Нужен one-hot или ручной target encoding. На high-cardinality фичах это создаёт разреженные матрицы и замедляет обучение. Если у тебя много категорий — LightGBM или CatBoost проще.</p>
      <p><b>XGBoost: медленнее LightGBM на больших данных.</b> На датасете в 10M строк разница в скорости обучения может быть 5-10х. Для итеративного тюнинга это часы против минут — существенно для итераций.</p>
      <p><b>LightGBM: leaf-wise рост переобучается на маленьких данных.</b> Аггрессивная оптимизация по «самому плохому» листу даёт глубокие несбалансированные деревья, которые запоминают шум на датасетах &lt; 10K строк. Нужно аккуратно выставлять <code>num_leaves</code> и <code>min_data_in_leaf</code>.</p>
      <p><b>LightGBM: чувствителен к <code>num_leaves</code>.</b> Этот параметр — главный рычаг, и интуиция «больше = лучше» здесь неверна. Без грамотного тюнинга можно получить модель хуже XGBoost с дефолтами.</p>
      <p><b>CatBoost: медленнее LightGBM.</b> Ordered boosting и symmetric trees дают качество, но стоят 2-3х времени обучения относительно LightGBM. На очень больших данных (&gt; 10M) это может быть критично.</p>
      <p><b>CatBoost: меньше гибкости в структуре деревьев.</b> Oblivious trees (одинаковые сплиты на уровне) ограничивают выразительность — на некоторых задачах XGBoost/LightGBM найдут более тонкие паттерны. Обычно проигрыш 0.5-1%, но он есть.</p>
      <p><b>Random Forest: уступает всем трём GBM в точности.</b> На Kaggle и в продакшене, где точность = деньги, RF — это бейзлайн, а не финальная модель. Разница 2-5% почти всегда в пользу бустинга.</p>

      <h3>🧭 Какую библиотеку выбрать — матрица решений</h3>
      <table>
        <tr><th>✅ Бери эту библиотеку когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td><b>XGBoost</b> — классический табличный ML, 10K–1M строк, есть комьюнити и зрелый стек</td>
          <td>XGBoost: миллионы строк и критична скорость — LightGBM в разы быстрее</td>
        </tr>
        <tr>
          <td><b>LightGBM</b> — очень большие данные (&gt; 1M строк), CTR prediction, быстрый тюнинг</td>
          <td>LightGBM: данных &lt; 10K — переобучится leaf-wise, возьми XGBoost/CatBoost</td>
        </tr>
        <tr>
          <td><b>CatBoost</b> — много категориальных фич, мало времени на тюнинг, нужен быстрый inference</td>
          <td>CatBoost: данных &gt; 10M и критична скорость обучения — медленнее LightGBM</td>
        </tr>
        <tr>
          <td><b>CatBoost</b> — задача ранжирования (Yandex YetiRank, YetiRankPairwise)</td>
          <td>CatBoost: нужна максимальная гибкость структуры деревьев — oblivious ограничивают</td>
        </tr>
        <tr>
          <td><b>Random Forest</b> — нет времени тюнить, данных мало, метки зашумлены</td>
          <td>Random Forest: нужны последние 2-5% точности — любой GBM обыграет</td>
        </tr>
        <tr>
          <td><b>Stacking всех трёх</b> — Kaggle, последние 0.5% на лидерборде</td>
          <td>Stacking: продакшен с ограничениями по latency и поддержке</td>
        </tr>
        <tr>
          <td><b>sklearn GBM</b> — учебная задача или маленький датасет без зависимостей</td>
          <td>sklearn GBM: данных &gt; 50K — устаревший и медленный, бери XGBoost/LightGBM</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы по конкретным сценариям</h3>
      <ul>
        <li><b>Если ты в сомнениях и у тебя обычные таблички</b> — бери <b>CatBoost</b>: лучшие дефолты, меньше шансов выстрелить в ногу без тюнинга. Для большинства продакшен-задач этого достаточно.</li>
        <li><b>Если у тебя огромные данные и нужна скорость</b> — <b>LightGBM</b> с аккуратным тюнингом <code>num_leaves</code> и <code>min_data_in_leaf</code>. GPU-режим ещё больше ускорит обучение.</li>
        <li><b>Если нужна проверенная временем классика с зрелой экосистемой</b> — <b>XGBoost</b>. Стандарт в Databricks, SageMaker, H2O.ai; есть мониторинг и интеграции.</li>
        <li><b>Если данных мало или метки шумные</b> — <a class="glossary-link" onclick="App.selectTopic('random-forest')"><b>Random Forest</b></a>: безопаснее, проще, устойчивее к overfit, не требует тюнинга.</li>
        <li><b>Если нужны последние 0.5% качества любой ценой</b> — <a class="glossary-link" onclick="App.selectTopic('stacking')"><b>Stacking</b></a> XGBoost + LightGBM + CatBoost + мета-модель (Logistic/Ridge). Стандартный Kaggle-финал.</li>
      </ul>
    `,

    links: `
      <h3>Внешние ресурсы</h3>
      <ul>
        <li><a href="https://xgboost.readthedocs.io/" target="_blank">XGBoost — официальная документация</a></li>
        <li><a href="https://lightgbm.readthedocs.io/" target="_blank">LightGBM — официальная документация</a></li>
        <li><a href="https://catboost.ai/docs/" target="_blank">CatBoost — официальная документация</a></li>
        <li><a href="https://habr.com/ru/search/?q=XGBoost+LightGBM+CatBoost+%D1%81%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5&target_type=posts&order=relevance" target="_blank">Habr — сравнение XGBoost, LightGBM, CatBoost</a></li>
        <li><a href="https://arxiv.org/abs/1603.02754" target="_blank">XGBoost paper (Chen & Guestrin, 2016)</a></li>
        <li><a href="https://arxiv.org/abs/1706.09516" target="_blank">LightGBM paper (Ke et al., 2017)</a></li>
        <li><a href="https://arxiv.org/abs/1706.09516" target="_blank">CatBoost paper (Prokhorenkova et al., 2018)</a></li>
      </ul>
    `
  }
});
