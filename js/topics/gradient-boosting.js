/* ==========================================================================
   <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting
   ========================================================================== */
App.registerTopic({
  id: 'gradient-boosting',
  category: 'ml-cls',
  title: 'Gradient Boosting',
  summary: 'Каждое новое дерево исправляет ошибки всех предыдущих.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('decision-tree')">Решающее дерево</a> ·
        <a onclick="App.selectTopic('random-forest')">Random Forest</a> ·
        <a onclick="App.selectTopic('gradient-descent')">Градиентный спуск</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты учишь человека стрелять из лука. Первый выстрел — промах на 30 см вправо. Второй выстрел с поправкой — промах на 15 см влево (перекорректировал). Третий — уже всего 5 см от центра. Постепенно, <b>исправляя ошибки предыдущих попыток</b>, ты становишься всё точнее.</p>
        <p>Gradient Boosting работает так же: начинает с простого предсказания (скажем, среднего), смотрит где ошибся, и <b>обучает новое дерево специально исправлять эти ошибки</b>. Потом ещё одно — исправить оставшиеся ошибки. И так сотни раз. В итоге — очень точная модель, построенная на последовательном улучшении.</p>
        <p>Это кардинально отличается от Random Forest: там деревья независимы и работают параллельно. Здесь — последовательная цепочка, где каждое следующее дерево «стоит на плечах» предыдущих.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 212" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <text x="270" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Gradient Boosting: последовательное исправление ошибок</text>
          <!-- Stage 1 box -->
          <rect x="20" y="30" width="130" height="90" rx="6" fill="#eff6ff" stroke="#6366f1" stroke-width="1.5"/>
          <text x="85" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#6366f1">Дерево 1</text>
          <text x="85" y="70" text-anchor="middle" font-size="9" fill="#475569">Исходные данные</text>
          <text x="85" y="85" text-anchor="middle" font-size="9" fill="#475569">F₀ = среднее(y)</text>
          <text x="85" y="108" text-anchor="middle" font-size="9" fill="#ef4444">Ошибка: большая</text>
          <text x="85" y="133" text-anchor="middle" font-size="20">📊</text>
          <!-- Plus sign -->
          <text x="168" y="85" text-anchor="middle" font-size="24" font-weight="700" fill="#10b981">+</text>
          <!-- Stage 2 box: residuals -->
          <rect x="195" y="30" width="140" height="90" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="265" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#10b981">Дерево 2</text>
          <text x="265" y="70" text-anchor="middle" font-size="9" fill="#475569">Учится на остатках</text>
          <text x="265" y="85" text-anchor="middle" font-size="9" fill="#475569">r = y − F₀(x)</text>
          <text x="265" y="108" text-anchor="middle" font-size="9" fill="#f59e0b">Ошибка: меньше</text>
          <text x="265" y="133" text-anchor="middle" font-size="20">📉</text>
          <!-- Plus sign -->
          <text x="352" y="85" text-anchor="middle" font-size="24" font-weight="700" fill="#10b981">+</text>
          <!-- Stage 3 box: smaller residuals -->
          <rect x="375" y="30" width="140" height="90" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="445" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#d97706">Дерево 3</text>
          <text x="445" y="70" text-anchor="middle" font-size="9" fill="#475569">Учится на новых</text>
          <text x="445" y="85" text-anchor="middle" font-size="9" fill="#475569">остатках r²</text>
          <text x="445" y="108" text-anchor="middle" font-size="9" fill="#10b981">Ошибка: минимальна</text>
          <text x="445" y="133" text-anchor="middle" font-size="20">✅</text>
          <!-- Bottom result line -->
          <line x1="85" y1="165" x2="85" y2="178" stroke="#64748b" stroke-width="1.5"/>
          <line x1="265" y1="165" x2="265" y2="178" stroke="#64748b" stroke-width="1.5"/>
          <line x1="445" y1="165" x2="445" y2="178" stroke="#64748b" stroke-width="1.5"/>
          <line x1="85" y1="178" x2="445" y2="178" stroke="#64748b" stroke-width="1.5"/>
          <line x1="265" y1="178" x2="265" y2="190" stroke="#64748b" stroke-width="1.5"/>
          <rect x="165" y="188" width="200" height="18" rx="5" fill="#6366f1"/>
          <text x="265" y="201" text-anchor="middle" font-size="10" font-weight="600" fill="#fff">F_M = F₀ + η·h₁ + η·h₂ + ...</text>
        </svg>
        <div class="caption">Gradient Boosting: каждое следующее дерево обучается на остатках (ошибках) предыдущих. Финальная модель — взвешенная сумма всех деревьев.</div>
      </div>

      <h3>💡 Основная идея</h3>
      <p>Gradient Boosting — это ансамбль деревьев, где каждое следующее дерево обучается на <b>ошибках</b> предыдущих. Это принципиально отличается от Random Forest, где деревья независимы.</p>

      <p>Общая схема:</p>
      <ol>
        <li>Начинаем с простейшего предсказания $F_0$ — обычно среднее y.</li>
        <li>Считаем <span class="term" data-tip="Residual. Остаток — разность между истинным значением и предсказанием модели.">остатки</span> (ошибки) для каждого примера: $r_i = y_i - F_0(x_i)$.</li>
        <li>Обучаем <b>новое дерево</b> предсказывать эти остатки.</li>
        <li>Добавляем предсказания дерева к модели (с коэффициентом η — learning rate).</li>
        <li>Повторяем: снова считаем остатки, снова обучаем дерево, и так M раз.</li>
      </ol>

      <p>Финальное предсказание:</p>
      <div class="math-block">$$F_M(x) = F_0 + \\eta \\sum_{m=1}^{M} h_m(x)$$</div>

      <p>Сумма базового предсказания и всех «корректирующих» деревьев, каждое со своим весом.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Boosting исправляет <b>bias</b> слабых моделей, объединяя их в сильную. Каждое дерево — небольшое улучшение, но много маленьких улучшений складываются в отличный результат.</p>
      </div>

      <h3>🔍 Почему «градиентный»?</h3>
      <p>На самом деле каждое новое дерево учится не на самих остатках, а на <b>отрицательном <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">градиенте</a></b> <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">функции потерь</a>:</p>
      <div class="math-block">$$r_i^{(m)} = -\\left[\\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}}$$</div>

      <p>Для <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a> градиент = $y - F$, то есть обычный остаток. Но для других функций потерь (log-loss, Huber) градиент другой — и именно на нём учится новое дерево.</p>
      <p>Это и есть <b>gradient boosting</b>: мы делаем шаг в сторону уменьшения loss, «спускаясь по градиенту» в пространстве функций.</p>

      <h3>⚙️ Learning rate η — главный параметр</h3>
      <p>Без коэффициента $\\eta$ (learning rate) каждое новое дерево полностью заменяло бы ошибки предыдущих — это быстро переобучается. Поэтому мы «замедляем» обучение:</p>
      <div class="math-block">$$F_m = F_{m-1} + \\eta \\cdot h_m$$</div>

      <ul>
        <li><b>η = 1:</b> агрессивно, быстро учится, сильно переобучается.</li>
        <li><b>η = 0.1:</b> осторожнее, нужно больше деревьев, лучше обобщает.</li>
        <li><b>η = 0.01:</b> очень медленно, но часто лучшее качество (при больших M).</li>
      </ul>

      <p><b>Правило:</b> меньше η → нужно больше деревьев M. Чаще всего η ∈ [0.01, 0.1].</p>

      <h3>🛡️ Как бороться с <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучением</a></h3>
      <p>Boosting склонен к переобучению. Инструменты борьбы:</p>
      <ul>
        <li><b>Learning rate</b> — главная ручка. Маленький η + много деревьев.</li>
        <li><b>Early stopping</b> — останавливаем обучение, когда качество на валидации перестало расти.</li>
        <li><b>Ограничение деревьев:</b> max_depth (обычно 3-8), min_samples_leaf.</li>
        <li><b>Subsample</b> — каждое дерево обучается на случайной подвыборке данных (Stochastic GB).</li>
        <li><b>Colsample</b> — случайный выбор признаков для каждого дерева.</li>
        <li><b>Регуляризация</b> — L1/L2 на листьях (XGBoost, LightGBM).</li>
      </ul>

      <h3>🚀 Современные реализации</h3>
      <p>Простой Gradient Boosting — медленный и базовый. На практике используют оптимизированные библиотеки:</p>

      <h4>XGBoost (2014)</h4>
      <ul>
        <li>Разложение loss до второго порядка (Тейлор).</li>
        <li>Встроенная регуляризация L1/L2.</li>
        <li>Обработка пропусков.</li>
        <li>Параллельное построение одного дерева.</li>
        <li>Первая супер-популярная библиотека бустинга.</li>
      </ul>

      <h4>LightGBM (2017)</h4>
      <ul>
        <li>Leaf-wise рост деревьев (вместо level-wise).</li>
        <li>Оптимизации для категориальных признаков.</li>
        <li>Gradient-based sampling (GOSS) — быстрый.</li>
        <li>Меньше памяти, быстрее XGBoost.</li>
      </ul>

      <h4>CatBoost (2017, Яндекс)</h4>
      <ul>
        <li>Отличная работа с категориальными признаками «из коробки».</li>
        <li>Ordered boosting — борется со смещением.</li>
        <li>Симметричные деревья — быстрый inference.</li>
      </ul>

      <h3>⚖️ Бустинг vs Random Forest</h3>
      <table>
        <tr><th>Критерий</th><th>Random Forest</th><th>Gradient Boosting</th></tr>
        <tr><td>Построение</td><td>Параллельно</td><td>Последовательно</td></tr>
        <tr><td>Что снижает</td><td>Variance</td><td>Bias</td></tr>
        <tr><td>Глубина деревьев</td><td>Глубокие</td><td>Мелкие (3-8)</td></tr>
        <tr><td>Переобучение</td><td>Устойчив</td><td>Склонен</td></tr>
        <tr><td>Настройка</td><td>Простая</td><td>Сложная</td></tr>
        <tr><td>Качество</td><td>Хорошее</td><td>Обычно лучше</td></tr>
        <tr><td>Параллелизация</td><td>Отличная</td><td>Слабая</td></tr>
      </table>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Обычно лучшее качество</b> на табличных данных.</li>
        <li>Работает с разными функциями потерь (регрессия, классификация, ранжирование).</li>
        <li>Feature importance «из коробки».</li>
        <li>Обработка пропусков и категорий (в XGBoost/LightGBM/CatBoost).</li>
        <li>Хорошо калиброванные вероятности.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Склонен к переобучению</b> при плохой настройке.</li>
        <li><b>Много гиперпараметров</b> для настройки.</li>
        <li>Последовательное обучение — <b>медленное</b>.</li>
        <li>Плохо параллелится (в отличие от RF).</li>
        <li>Чувствителен к шуму в таргете.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Чем больше M, тем лучше»</b> — нет, модель переобучится. Используй early stopping.</li>
        <li><b>«Boosting заменяет deep learning»</b> — на табличных данных да, на изображениях/тексте — нет.</li>
        <li><b>«Бустинг всегда побеждает RF»</b> — при плохой настройке часто проигрывает.</li>
        <li><b>«XGBoost лучший»</b> — зависит от данных. LightGBM часто быстрее и не хуже.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: XGBoost и второй порядок</summary>
        <div class="deep-dive-body">
          <p>XGBoost использует <b>разложение Тейлора 2-го порядка</b> функции потерь. Это позволяет находить оптимальные значения листьев аналитически:</p>
          <div class="math-block">$$\\text{Obj} = \\sum_i \\left[g_i w_{q(i)} + \\frac{1}{2} h_i w_{q(i)}^2\\right] + \\gamma T + \\frac{1}{2}\\lambda \\sum_j w_j^2$$</div>
          <p>Здесь $g_i$ — градиент, $h_i$ — гессиан, $w_j$ — значение листа, $T$ — число листьев. Оптимум $w_j$ находится аналитически.</p>
          <p>Второй порядок даёт более быструю и точную оптимизацию, чем чистый градиент.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: level-wise vs leaf-wise</summary>
        <div class="deep-dive-body">
          <p>Два разных способа роста деревьев:</p>
          <ul>
            <li><b>Level-wise (XGBoost):</b> строим дерево по уровням — сначала все узлы на уровне 1, потом на 2, и т.д. Симметричное.</li>
            <li><b>Leaf-wise (LightGBM):</b> на каждом шаге разбиваем лист с <b>максимальным</b> loss reduction. Асимметричное, но точнее.</li>
          </ul>
          <p>Leaf-wise даёт меньшую потерю при том же числе листьев, но может переобучаться — нужен max_depth или num_leaves.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: порядок настройки параметров</summary>
        <div class="deep-dive-body">
          <p>Рекомендуемый порядок настройки GBDT:</p>
          <ol>
            <li>Фиксируем η = 0.1, n_estimators = большое число (500-1000).</li>
            <li>Настраиваем <b>глубину</b> (max_depth / num_leaves): 3-8.</li>
            <li>Настраиваем <b>min_child_weight / min_data_in_leaf</b>.</li>
            <li>Добавляем <b>регуляризацию</b> (λ, α, γ).</li>
            <li>Настраиваем <b>subsample и colsample</b> для разнообразия.</li>
            <li>Уменьшаем η до 0.01-0.03, пропорционально увеличиваем n_estimators.</li>
            <li>Используем <b>early stopping</b> для автоматического выбора n_estimators.</li>
          </ol>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Decision Tree</b> — базовый блок бустинга.</li>
        <li><b>Random Forest</b> — альтернативный ансамбль деревьев.</li>
        <li><b>Gradient Descent</b> — бустинг это градиентный спуск в функциональном пространстве.</li>
        <li><b>Регуляризация</b> — L1/L2 встроены в XGBoost/LightGBM.</li>
        <li><b>Bias-variance</b> — бустинг снижает bias.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Регрессия пошагово: 3 итерации',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>На 5 точках показать 3 итерации градиентного бустинга для регрессии с η=0.5, depth=1.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>x</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
              <tr><th>y (факт)</th><td>2</td><td>5</td><td>6</td><td>9</td><td>11</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Итерация 0: начальная модель F₀</h4>
            <div class="calc">
              F₀(x) = ȳ = (2+5+6+9+11)/5 = 33/5 = <b>6.6</b> (для всех x)<br><br>
              Остатки r⁰ = y − F₀(x):<br>
              r⁰ = [2−6.6, 5−6.6, 6−6.6, 9−6.6, 11−6.6]<br>
              r⁰ = [<b>−4.6, −1.6, −0.6, 2.4, 4.4</b>]<br><br>
              MSE₀ = (21.16 + 2.56 + 0.36 + 5.76 + 19.36)/5 = 49.2/5 = <b>9.84</b>
            </div>
            <div class="why">Начальная модель — просто среднее. Остатки — то, что нужно «доисправить» следующим деревом.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Итерация 1: дерево h₁ предсказывает остатки r⁰</h4>
            <div class="calc">
              Обучаем h₁ на (x, r⁰) с depth=1 (stumр — одно разбиение)<br>
              Лучшее разбиение: x &lt; 3 vs x ≥ 3<br>
              Левый лист (x=1,2): среднее(−4.6, −1.6) = <b>−3.10</b><br>
              Правый лист (x=3,4,5): среднее(−0.6, 2.4, 4.4) = <b>2.07</b><br><br>
              F₁(x) = F₀(x) + η·h₁(x), η=0.5<br>
              F₁(1) = 6.6 + 0.5·(−3.10) = 6.6 − 1.55 = <b>5.05</b><br>
              F₁(2) = 6.6 + 0.5·(−3.10) = <b>5.05</b><br>
              F₁(3) = 6.6 + 0.5·2.07 = 6.6 + 1.035 = <b>7.635</b><br>
              F₁(4) = 6.6 + 0.5·2.07 = <b>7.635</b><br>
              F₁(5) = 6.6 + 0.5·2.07 = <b>7.635</b>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Итерация 2: остатки r¹ и дерево h₂</h4>
            <div class="calc">
              r¹ = y − F₁(x):<br>
              r¹(1) = 2 − 5.05 = −3.05<br>
              r¹(2) = 5 − 5.05 = −0.05<br>
              r¹(3) = 6 − 7.635 = −1.635<br>
              r¹(4) = 9 − 7.635 = 1.365<br>
              r¹(5) = 11 − 7.635 = 3.365<br><br>
              MSE₁ = (9.30 + 0.003 + 2.67 + 1.86 + 11.32)/5 = 25.15/5 = <b>5.03</b><br>
              Улучшение: 9.84 → 5.03 (-49%)
            </div>
          </div>
          <div class="step" data-step="4">
            <h4>Итерация 3: дерево h₃ и финальная модель</h4>
            <div class="calc">
              h₂ обучен на r¹, разбиение x &lt; 2 vs x ≥ 2<br>
              Левый: среднее(−3.05) = −3.05<br>
              Правый: среднее(−0.05, −1.635, 1.365, 3.365) = 0.76<br><br>
              F₂(1) = 5.05 + 0.5·(−3.05) = <b>3.525</b><br>
              F₂(2..5) = 7.635 + 0.5·0.76 = <b>8.015</b> (примерно)<br><br>
              MSE₂ ≈ <b>2.8</b> — ещё улучшение
            </div>
            <div class="why">Каждая итерация исправляет текущие ошибки. MSE падает монотонно на обучении.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>MSE: 9.84 → 5.03 → 2.80 — каждое дерево снижает ошибку. При η=0.5 нужно меньше итераций, чем при η=0.1, но риск переобучения выше.</p>
          </div>
          <div class="lesson-box">
            Градиент MSE-потери: −∂L/∂F = y − F(x) = остаток. Поэтому для MSE остатки = отрицательный градиент. Для других потерь (logistic, huber) — другой «псевдо-остаток».
          </div>
        `,
      },
      {
        title: 'Эффект learning rate η',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить поведение градиентного бустинга при разных значениях learning rate η на одних данных.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>η</th><th>n_estimators</th><th>Train MSE</th><th>Val MSE</th><th>Вывод</th></tr>
              <tr><td>1.0</td><td>50</td><td>0.12</td><td>2.45</td><td>Переобучение</td></tr>
              <tr><td>0.5</td><td>100</td><td>0.38</td><td>1.82</td><td>Немного переобуч.</td></tr>
              <tr><td>0.1</td><td>500</td><td>0.51</td><td>1.21</td><td>Хорошо</td></tr>
              <tr><td>0.05</td><td>1000</td><td>0.53</td><td>1.19</td><td>Оптимум</td></tr>
              <tr><td>0.01</td><td>5000</td><td>0.55</td><td>1.22</td><td>Медленно, ок</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: почему большой η опасен</h4>
            <div class="calc">
              При η=1.0 каждое дерево корректирует 100% остатка<br>
              Итерация 1: F₁ почти идеально подгоняет обучение<br>
              Новые остатки ≈ 0 → последующие деревья подстраиваются под шум<br>
              → Модель «запоминает» тренировочные данные<br>
              → Val MSE растёт, хотя Train MSE падает
            </div>
            <div class="why">Аналогия с SGD: большой learning rate → шумная сходимость, пропуск минимума.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: компромисс η ↔ n_estimators</h4>
            <div class="calc">
              Правило: η · n_estimators ≈ const для похожего качества<br>
              η=0.1, n=500 ↔ η=0.01, n=5000 — примерно равны<br>
              Но η=0.01, n=5000 медленнее обучается в 10 раз<br>
              Рекомендация: η ∈ [0.01, 0.1], n → подбирать через early stopping
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: оптимальный η на практике</h4>
            <div class="calc">
              1. Задать η=0.1 как начальную точку<br>
              2. Использовать early stopping на val: остановиться, если val_loss не улучшается 50 итераций<br>
              3. Модель сама определит оптимальное n_estimators<br>
              4. Для финала: уменьшить η вдвое, увеличить n вдвое — часто чуть лучше<br>
              Типичные значения: η=0.05, n=300-1000
            </div>
            <div class="why">Early stopping = автоматическая регуляризация. Не нужно перебирать n_estimators вручную.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимум при η=0.05, n=1000 (Val MSE=1.19). Правило: меньший η + больше деревьев = лучше, но дольше. Early stopping решает проблему выбора n автоматически.</p>
          </div>
          <div class="lesson-box">
            В XGBoost/LightGBM есть subsample (стохастический бустинг) и colsample_bytree — случайные признаки как в Random Forest. Это дополнительно снижает дисперсию и иногда позволяет использовать больший η.
          </div>
        `,
      },
      {
        title: 'Early Stopping',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Наблюдать, как Train Loss и Val Loss расходятся без early stopping, и как остановка в нужный момент даёт лучшую модель.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Итерация</th><th>Train MSE</th><th>Val MSE</th><th>Лучший Val?</th></tr>
              <tr><td>50</td><td>1.82</td><td>1.95</td><td>—</td></tr>
              <tr><td>100</td><td>1.21</td><td>1.48</td><td>—</td></tr>
              <tr><td>150</td><td>0.87</td><td>1.22</td><td>—</td></tr>
              <tr><td>200</td><td>0.64</td><td>1.08</td><td>—</td></tr>
              <tr><td>250</td><td>0.48</td><td>1.01</td><td>★ Лучший</td></tr>
              <tr><td>300</td><td>0.35</td><td>1.04</td><td>+0.03</td></tr>
              <tr><td>350</td><td>0.27</td><td>1.09</td><td>+0.08</td></tr>
              <tr><td>400</td><td>0.21</td><td>1.18</td><td>+0.17</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: когда остановить</h4>
            <div class="calc">
              После итерации 250 Val MSE = 1.01 (минимум)<br>
              Итерации 300-400: Train MSE падает, Val MSE растёт<br>
              Это классическое переобучение бустинга<br><br>
              Early stopping с patience=50:<br>
              Остановиться, если за 50 итераций Val MSE не улучшилось<br>
              Минимум: итерация 250<br>
              Следующий порог: 250 + 50 = 300 → Val ухудшилось, стоп!<br>
              Возврат к модели итерации 250
            </div>
            <div class="why">Early stopping — наилучший способ выбрать n_estimators. Автоматически, без перебора по сетке.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: что сохранять</h4>
            <div class="calc">
              Лучшая модель сохраняется в памяти на итерации 250<br>
              При остановке — возврат к ней, не к последней итерации<br>
              В XGBoost: xgb.train(early_stopping_rounds=50, evals=[(val, 'val')])<br>
              В sklearn GBM: нет встроенного, нужен staged_predict + цикл
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: early stopping как регуляризация</h4>
            <div class="calc">
              Без early stopping: Val MSE = 1.18 (итерация 400)<br>
              С early stopping: Val MSE = 1.01 (итерация 250)<br>
              Улучшение: (1.18−1.01)/1.18 = <b>14.4%</b> лучше на тесте<br><br>
              Совет: разбить данные 60/20/20 (train/val/test)<br>
              val → для early stopping<br>
              test → для финальной оценки (не трогать до конца!)
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимальное число итераций: 250. Early stopping с patience=50 автоматически находит его. Улучшение Val MSE: 14.4% по сравнению с полным обучением (400 итераций).</p>
          </div>
          <div class="lesson-box">
            В соревнованиях Kaggle: обучают с η=0.05, early_stopping_rounds=100, eval_metric='rmse'. После нахождения оптимального n_estimators — финально дообучают на train+val с тем же n. Это даёт +1-2% качества.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: бустинг для регрессии</h3>
        <p>Смотри, как каждое новое дерево исправляет остатки. Меняй глубину, η и число итераций.</p>
        <div class="sim-container">
          <div class="sim-controls" id="gb-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="gb-step">➕ 1 итерация</button>
            <button class="btn" id="gb-step10">+10 итераций</button>
            <button class="btn secondary" id="gb-reset">↺ Сброс</button>
            <button class="btn secondary" id="gb-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:340px;"><canvas id="gb-chart"></canvas></div>
            <div class="sim-chart-wrap" style="height:180px;"><canvas id="gb-loss"></canvas></div>
            <div class="sim-stats" id="gb-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#gb-controls');
        const cLR = App.makeControl('range', 'gb-lr', 'Learning rate η', { min: 0.01, max: 1, step: 0.01, value: 0.3 });
        const cDepth = App.makeControl('range', 'gb-depth', 'Глубина дерева', { min: 1, max: 6, step: 1, value: 2 });
        const cNoise = App.makeControl('range', 'gb-noise', 'Шум', { min: 0, max: 1, step: 0.05, value: 0.3 });
        [cLR, cDepth, cNoise].forEach(c => controls.appendChild(c.wrap));

        let chart = null, lossChart = null;
        let xs = [], ys = [];
        let preds = [];
        let residuals = [];
        let lossHistory = [];
        let iter = 0;
        let F0 = 0;
        let trees = [];

        function genData() {
          xs = []; ys = [];
          const noise = +cNoise.input.value;
          for (let i = 0; i < 40; i++) {
            const x = i / 40 * 10;
            const y = Math.sin(x) + 0.3 * x + App.Util.randn(0, noise);
            xs.push(x); ys.push(y);
          }
          reset();
        }

        function reset() {
          F0 = App.Util.mean(ys);
          preds = new Array(xs.length).fill(F0);
          residuals = ys.map((y, i) => y - preds[i]);
          trees = [];
          iter = 0;
          lossHistory = [computeLoss()];
          draw();
        }

        function computeLoss() {
          let sum = 0;
          for (let i = 0; i < ys.length; i++) sum += (ys[i] - preds[i]) ** 2;
          return sum / ys.length;
        }

        // очень простое дерево для регрессии (1D, только x)
        function buildTree(targets, depth, maxDepth) {
          const items = xs.map((x, i) => ({ x, t: targets[i] }));
          return grow(items, depth, maxDepth);
        }

        function mean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

        function grow(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length < 2) {
            return { leaf: true, val: mean(items.map(p => p.t)) };
          }
          // найдём лучший split по x (MSE)
          const sorted = [...items].sort((a, b) => a.x - b.x);
          let bestGain = -Infinity, bestThr = null, bestL = null, bestR = null;
          const totalMean = mean(sorted.map(p => p.t));
          const totalVar = sorted.reduce((s, p) => s + (p.t - totalMean) ** 2, 0);
          for (let i = 1; i < sorted.length; i++) {
            const thr = (sorted[i - 1].x + sorted[i].x) / 2;
            const L = sorted.slice(0, i), R = sorted.slice(i);
            const mL = mean(L.map(p => p.t)), mR = mean(R.map(p => p.t));
            const vL = L.reduce((s, p) => s + (p.t - mL) ** 2, 0);
            const vR = R.reduce((s, p) => s + (p.t - mR) ** 2, 0);
            const gain = totalVar - (vL + vR);
            if (gain > bestGain) { bestGain = gain; bestThr = thr; bestL = L; bestR = R; }
          }
          if (bestGain <= 0) return { leaf: true, val: totalMean };
          return {
            leaf: false, thr: bestThr,
            left: grow(bestL, depth + 1, maxDepth),
            right: grow(bestR, depth + 1, maxDepth),
          };
        }

        function predictTree(tree, x) {
          if (tree.leaf) return tree.val;
          return x < tree.thr ? predictTree(tree.left, x) : predictTree(tree.right, x);
        }

        function doStep() {
          const lr = +cLR.input.value;
          const depth = +cDepth.input.value;
          const tree = buildTree(residuals, 0, depth);
          trees.push({ tree, lr });
          for (let i = 0; i < xs.length; i++) {
            preds[i] += lr * predictTree(tree, xs[i]);
            residuals[i] = ys[i] - preds[i];
          }
          iter++;
          lossHistory.push(computeLoss());
          draw();
        }

        function draw() {
          // сетка x для кривой
          const gridX = App.Util.linspace(0, 10, 200);
          const gridY = gridX.map(x => {
            let v = F0;
            trees.forEach(({ tree, lr }) => v += lr * predictTree(tree, x));
            return v;
          });

          const ctx = container.querySelector('#gb-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Данные', data: xs.map((x, i) => ({ x, y: ys[i] })), backgroundColor: 'rgba(59,130,246,0.5)', pointRadius: 4 },
                { type: 'line', label: 'Предсказание', data: gridX.map((x, i) => ({ x, y: gridY[i] })), borderColor: '#dc2626', borderWidth: 2.5, pointRadius: 0, fill: false, tension: 0 },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' }, title: { display: true, text: 'Gradient Boosting: предсказание' } },
              scales: { x: { type: 'linear', title: { display: true, text: 'x' }, min: 0, max: 10 }, y: { title: { display: true, text: 'y' }, suggestedMin: -3, suggestedMax: 6 } },
            },
          });
          App.registerChart(chart);

          const ctx2 = container.querySelector('#gb-loss').getContext('2d');
          if (lossChart) lossChart.destroy();
          lossChart = new Chart(ctx2, {
            type: 'line',
            data: {
              labels: lossHistory.map((_, i) => i),
              datasets: [{ label: 'MSE', data: lossHistory, borderColor: '#16a34a', borderWidth: 2, pointRadius: 0, fill: false }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'MSE по итерациям' } },
              scales: { x: { title: { display: true, text: 'Итерация' } }, y: { title: { display: true, text: 'MSE' }, beginAtZero: true } },
            },
          });
          App.registerChart(lossChart);

          container.querySelector('#gb-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Итераций</div><div class="stat-value">${iter}</div></div>
            <div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${App.Util.round(computeLoss(), 4)}</div></div>
            <div class="stat-card"><div class="stat-label">η</div><div class="stat-value">${cLR.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">Глубина дерева</div><div class="stat-value">${cDepth.input.value}</div></div>
          `;
        }

        container.querySelector('#gb-step').onclick = doStep;
        container.querySelector('#gb-step10').onclick = () => { for (let i = 0; i < 10; i++) doStep(); };
        container.querySelector('#gb-reset').onclick = reset;
        container.querySelector('#gb-regen').onclick = genData;
        cNoise.input.addEventListener('change', genData);

        genData();
      },
    },

    python: `
      <h3>Python: градиентный бустинг</h3>
      <p>sklearn.GradientBoostingClassifier и XGBoost — наиболее популярные реализации. Early stopping предотвращает переобучение.</p>

      <h4>1. sklearn GradientBoostingClassifier</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report

data = load_breast_cancer()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

gb = GradientBoostingClassifier(
    n_estimators=200,    # число итераций бустинга
    learning_rate=0.1,   # шаг обучения
    max_depth=3,         # глубина каждого дерева
    subsample=0.8,       # stochastic GB — снижает variance
    random_state=42,
)
gb.fit(X_train, y_train)

y_proba = gb.predict_proba(X_test)[:, 1]
print(f'ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}')
print(classification_report(y_test, gb.predict(X_test), target_names=data.target_names))</code></pre>

      <h4>2. Early stopping и staged_predict</h4>
      <pre><code># staged_predict позволяет видеть качество на каждой итерации
train_scores = [roc_auc_score(y_train, p[:, 1])
                for p in gb.staged_predict_proba(X_train)]
test_scores  = [roc_auc_score(y_test, p[:, 1])
                for p in gb.staged_predict_proba(X_test)]

best_n = np.argmax(test_scores) + 1
print(f'Лучшее число итераций: {best_n}, ROC-AUC={test_scores[best_n-1]:.4f}')

plt.plot(train_scores, label='Train ROC-AUC')
plt.plot(test_scores, label='Test ROC-AUC')
plt.axvline(best_n - 1, color='red', linestyle='--', label=f'Best iter={best_n}')
plt.xlabel('Число итераций')
plt.ylabel('ROC-AUC')
plt.title('Gradient Boosting: кривая обучения')
plt.legend()
plt.show()</code></pre>

      <h4>3. XGBoost с early stopping</h4>
      <pre><code># pip install xgboost
import xgboost as xgb
from sklearn.model_selection import train_test_split

X_tr, X_val, y_tr, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=0)

# XGBoost — более быстрая и гибкая реализация GB
xgb_model = xgb.XGBClassifier(
    n_estimators=1000,
    learning_rate=0.05,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric='auc',
    early_stopping_rounds=20,   # останавливаемся если нет улучшения
    random_state=42,
    verbosity=0,
)
xgb_model.fit(X_tr, y_tr, eval_set=[(X_val, y_val)])

print(f'Best iteration: {xgb_model.best_iteration}')
print(f'Test ROC-AUC: {roc_auc_score(y_test, xgb_model.predict_proba(X_test)[:,1]):.4f}')

# Важность признаков
xgb.plot_importance(xgb_model, max_num_features=10)
plt.tight_layout()
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Kaggle</b> — чемпион на табличных данных.</li>
        <li><b>Ранжирование</b> — LambdaMART в поисковых системах.</li>
        <li><b>Скоринг</b> — банки, страхование, сегментация клиентов.</li>
        <li><b>CTR-prediction</b> — рекламные системы.</li>
        <li><b>Прогнозирование временных рядов</b> — продажи, спрос.</li>
        <li><b>Tabular Deep Learning competitors</b> — часто побеждает нейросети.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Как правило, наилучшее качество на табличных данных</li>
            <li>Работает с разными функциями потерь</li>
            <li>Feature importance</li>
            <li>Обрабатывает пропуски (в XGBoost/LightGBM)</li>
            <li>Хорошо калиброванные вероятности</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Склонен к переобучению при плохой настройке</li>
            <li>Много гиперпараметров</li>
            <li>Медленное обучение (последовательное)</li>
            <li>Чувствителен к шуму</li>
            <li>Плохо параллелится (в отличие от RF)</li>
          </ul>
        </div>
      </div>

      <h3>🧭 Когда использовать vs когда НЕ использовать</h3>
      <table>
        <tr><th>✅ Используй когда</th><th>❌ НЕ используй когда</th></tr>
        <tr>
          <td>Нужна максимальная точность на табличных данных (Kaggle, продакшен)</td>
          <td>Очень мало данных (&lt; 500 строк) — риск переобучения</td>
        </tr>
        <tr>
          <td>Есть время на тюнинг гиперпараметров</td>
          <td>Нужна интерпретация каждого предсказания без SHAP</td>
        </tr>
        <tr>
          <td>Смешанные типы признаков (числа + категории)</td>
          <td>Нужна сверхнизкая latency предсказания</td>
        </tr>
        <tr>
          <td>Есть пропуски — XGBoost/LightGBM/CatBoost их обрабатывают</td>
          <td>Задача онлайн-обучения (новые данные каждую секунду)</td>
        </tr>
        <tr>
          <td>Нужны вероятности — GB даёт хорошо калиброванные</td>
          <td>Данные сильно зашумлены — GB чувствителен к шуму</td>
        </tr>
        <tr>
          <td>State-of-the-art бейзлайн для любой табличной задачи</td>
          <td>Неструктурированные данные (изображения, аудио) — нужны нейросети</td>
        </tr>
      </table>
      <p><b>Альтернативы:</b> Random Forest (если нет времени тюнить), нейросети для неструктурированных данных, линейные модели для интерпретируемости.</p>
    `,

    extra: `
      <h3>Регуляризация в бустинге</h3>
      <ul>
        <li><b>Learning rate (shrinkage)</b> — самая важная.</li>
        <li><b>Subsample</b> — обучение на случайной подвыборке (stochastic GB).</li>
        <li><b>Colsample</b> — случайный выбор признаков для каждого дерева.</li>
        <li><b>Early stopping</b> — остановка по валидации.</li>
        <li><b>L1/L2 на листьях</b> (в XGBoost/LightGBM).</li>
      </ul>

      <h3>XGBoost vs LightGBM vs CatBoost</h3>
      <table>
        <tr><th>Критерий</th><th>XGBoost</th><th>LightGBM</th><th>CatBoost</th></tr>
        <tr><td>Рост</td><td>Level-wise</td><td>Leaf-wise</td><td>Симметричный</td></tr>
        <tr><td>Скорость</td><td>Средняя</td><td>Быстрая</td><td>Средняя</td></tr>
        <tr><td>Категориальные</td><td>Нет (OHE)</td><td>Есть</td><td>Отлично</td></tr>
        <tr><td>GPU</td><td>Да</td><td>Да</td><td>Да</td></tr>
      </table>

      <h3>Тонкости настройки</h3>
      <ol>
        <li>Начать с небольшого η (0.1), большого числа деревьев и early stopping.</li>
        <li>Настроить глубину (3-8) и min_child_weight.</li>
        <li>Добавить регуляризацию (λ, α, γ).</li>
        <li>Уменьшить η до 0.01-0.03, увеличить n_estimators.</li>
        <li>Subsample, colsample для разнообразия.</li>
      </ol>

      <h3>Практические советы</h3>
      <ul>
        <li>Не забыть early_stopping_rounds.</li>
        <li>На маленьких данных может переобучаться — используй CV.</li>
        <li>Feature importance → SHAP values (лучше для интерпретации).</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=3CC4N4z3GJc" target="_blank">StatQuest: Gradient Boost (часть 1)</a> — пошаговое построение градиентного бустинга</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%D0%BD%D1%8B%D0%B9%20%D0%B1%D1%83%D1%81%D1%82%D0%B8%D0%BD%D0%B3%20XGBoost%20LightGBM" target="_blank">Градиентный бустинг на Habr</a> — теория и реализация XGBoost/LightGBM на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://xgboost.readthedocs.io/en/stable/" target="_blank">XGBoost документация</a> — официальная документация XGBoost</li>
        <li><a href="https://lightgbm.readthedocs.io/en/latest/" target="_blank">LightGBM документация</a> — официальная документация LightGBM</li>
      </ul>
    `,
  },
});
