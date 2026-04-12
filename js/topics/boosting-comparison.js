/* ==========================================================================
   XGBoost, LightGBM, CatBoost — сравнение библиотек бустинга
   ========================================================================== */
App.registerTopic({
  id: 'boosting-comparison',
  category: 'ml-cls',
  title: 'XGBoost, LightGBM, CatBoost',
  summary: 'Три главные библиотеки <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting: чем отличаются, когда какую выбрать.',

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
            <!-- Level 2 (leaves) -->
            <rect x="80" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="95" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L1</text>
            <rect x="115" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="130" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L2</text>
            <rect x="150" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="165" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L3</text>
            <rect x="200" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="215" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L4</text>
            <rect x="235" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="250" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L5</text>
            <rect x="270" y="215" width="30" height="22" fill="#bfdbfe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="285" y="230" text-anchor="middle" font-size="10" fill="#1e40af">L6</text>
            <line x1="122" y1="175" x2="95" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="128" y1="175" x2="130" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="138" y1="175" x2="165" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="242" y1="175" x2="215" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="250" y1="175" x2="250" y2="212" stroke="#475569" stroke-width="1"/>
            <line x1="258" y1="175" x2="285" y2="212" stroke="#475569" stroke-width="1"/>

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
      <h3>Где применяются</h3>
      <table>
        <tr><th>Область</th><th>Типичная задача</th><th>Рекомендуемая библиотека</th></tr>
        <tr><td>Kaggle-соревнования</td><td>Любая табличная задача</td><td>Все три (стекинг)</td></tr>
        <tr><td>Банки</td><td>Кредитный скоринг</td><td>XGBoost, CatBoost</td></tr>
        <tr><td>E-commerce</td><td>Предсказание конверсии</td><td>CatBoost (много категорий)</td></tr>
        <tr><td>Рекламные платформы</td><td>CTR prediction (10M+ строк)</td><td>LightGBM</td></tr>
        <tr><td>Яндекс</td><td>Ранжирование поиска</td><td>CatBoost (создан для этого)</td></tr>
        <tr><td>Промышленность</td><td>Предиктивное обслуживание</td><td>XGBoost</td></tr>
        <tr><td>Медицина</td><td>Диагностика по анализам</td><td>XGBoost (интерпретируемость через SHAP)</td></tr>
      </table>

      <p><b>Факт:</b> по данным Kaggle, ~70% победных решений на табличных данных используют gradient boosting (одну из трёх библиотек или их стекинг).</p>
    `,

    proscons: `
      <h3>XGBoost</h3>
      <table>
        <tr><th>✅ Плюсы</th><th>❌ Минусы</th></tr>
        <tr><td>Проверен годами, огромное комьюнити</td><td>Медленнее LightGBM на больших данных</td></tr>
        <tr><td>Хорошая регуляризация</td><td>Нет встроенной обработки категорий</td></tr>
        <tr><td>Обрабатывает пропуски</td><td>Больше гиперпараметров для тюнинга</td></tr>
      </table>

      <h3>LightGBM</h3>
      <table>
        <tr><th>✅ Плюсы</th><th>❌ Минусы</th></tr>
        <tr><td>Очень быстрый на больших данных</td><td>Leaf-wise может переобучаться</td></tr>
        <tr><td>Низкое потребление памяти</td><td>Чувствителен к num_leaves</td></tr>
        <tr><td>Встроенная параллелизация</td><td>Нужен ручной encoding категорий</td></tr>
      </table>

      <h3>CatBoost</h3>
      <table>
        <tr><th>✅ Плюсы</th><th>❌ Минусы</th></tr>
        <tr><td>Отличная обработка категорий</td><td>Медленнее LightGBM</td></tr>
        <tr><td>Хорошие дефолты (мало тюнинга)</td><td>Ordered boosting зависит от порядка данных</td></tr>
        <tr><td>Быстрый inference (symmetric trees)</td><td>Меньше гибкости в структуре деревьев</td></tr>
        <tr><td>Устойчив к переобучению</td><td>Дольше обучается, чем LightGBM</td></tr>
      </table>
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
