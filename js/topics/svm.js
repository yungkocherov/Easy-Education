/* ==========================================================================
   Support Vector Machine
   ========================================================================== */
App.registerTopic({
  id: 'svm',
  category: 'ml-cls',
  title: 'SVM (Метод опорных векторов)',
  summary: 'Граница с максимальным зазором между классами.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a> ·
        <a onclick="App.selectTopic('regularization')">Регуляризация</a> ·
        <a onclick="App.selectTopic('bias-variance')">Bias-Variance</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что тебе нужно провести дорогу между двумя деревнями, враждующими друг с другом. Вариантов провести прямую много, но <b>безопаснее всего</b> — так, чтобы дорога шла ровно посередине, как можно дальше от обеих деревень. Тогда ни одна не сможет пожаловаться, что дорога слишком близко.</p>
        <p>SVM делает именно это в мире данных. У нас два класса точек, нужно провести границу. SVM ищет такую границу, чтобы между ней и ближайшими точками обеих групп был <b>максимальный зазор (margin)</b>. Это обеспечивает устойчивость: небольшие сдвиги в данных не приведут к ошибкам.</p>
        <p>Точки, которые <b>определяют</b> положение границы (самые близкие к ней) — «опорные векторы» (support vectors). Это и есть название метода.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">SVM: максимальный зазор между классами</text>
          <!-- Background -->
          <rect x="30" y="25" width="440" height="160" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <!-- Class 1 dots (blue / indigo) -->
          <circle cx="100" cy="65" r="9" fill="#6366f1"/>
          <circle cx="80" cy="100" r="9" fill="#6366f1"/>
          <circle cx="120" cy="130" r="9" fill="#6366f1"/>
          <circle cx="65" cy="148" r="9" fill="#6366f1"/>
          <circle cx="140" cy="85" r="9" fill="#6366f1"/>
          <!-- Class 2 dots (amber) -->
          <circle cx="350" cy="55" r="9" fill="#f59e0b"/>
          <circle cx="390" cy="85" r="9" fill="#f59e0b"/>
          <circle cx="360" cy="120" r="9" fill="#f59e0b"/>
          <circle cx="420" cy="140" r="9" fill="#f59e0b"/>
          <circle cx="400" cy="55" r="9" fill="#f59e0b"/>
          <!-- Support vectors (highlighted with stroke) -->
          <circle cx="140" cy="85" r="9" fill="#6366f1" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="120" cy="130" r="9" fill="#6366f1" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="350" cy="55" r="9" fill="#f59e0b" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="360" cy="120" r="9" fill="#f59e0b" stroke="#ef4444" stroke-width="2.5"/>
          <!-- Decision boundary (solid) -->
          <line x1="220" y1="30" x2="250" y2="175" stroke="#6366f1" stroke-width="2.5"/>
          <!-- Margin lines (dashed) -->
          <line x1="178" y1="30" x2="208" y2="175" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="6,4"/>
          <line x1="262" y1="30" x2="292" y2="175" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,4"/>
          <!-- Margin label -->
          <text x="230" y="98" text-anchor="middle" font-size="10" fill="#64748b">margin</text>
          <line x1="180" y1="103" x2="262" y2="103" stroke="#64748b" stroke-width="1" marker-end="url(#sv_arr)"/>
          <!-- Labels -->
          <text x="90" y="175" text-anchor="middle" font-size="10" font-weight="600" fill="#6366f1">Класс A</text>
          <text x="390" y="175" text-anchor="middle" font-size="10" font-weight="600" fill="#d97706">Класс B</text>
          <text x="235" y="45" text-anchor="middle" font-size="9" fill="#6366f1">граница</text>
          <!-- Support vector label -->
          <text x="450" y="88" font-size="8" fill="#ef4444">← опорные</text>
          <text x="450" y="99" font-size="8" fill="#ef4444">   векторы</text>
          <defs>
            <marker id="sv_arr" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#64748b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">SVM находит гиперплоскость (синяя линия) с максимальным зазором (margin) между классами. Пунктирные линии — границы margin. Точки с красной обводкой — опорные векторы.</div>
      </div>

      <h3>🎯 Задача максимального зазора</h3>
      <p>SVM (Support Vector Machine, Метод опорных векторов) решает задачу классификации с новой идеей: <b>не просто разделить</b> классы, а разделить их <b>максимально уверенно</b>.</p>

      <p>Если классы линейно разделимы, существует бесконечно много разделяющих прямых. Какая лучшая? Та, что дальше всего от обеих групп. Это даёт максимальный «зазор безопасности».</p>

      <div class="math-block">$$\\min_{w, b} \\frac{1}{2}\\|w\\|^2 \\quad \\text{при условии} \\quad y_i(w^T x_i + b) \\geq 1$$</div>

      <p>Минимизация $\\|w\\|^2$ эквивалентна <b>максимизации</b> margin (зазора). Это и есть классическая задача SVM.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>SVM ищет гиперплоскость, которая максимально удалена от обоих классов. Точки, лежащие прямо на границе margin, называются <span class="term" data-tip="Support Vectors. Точки, лежащие на границе margin. Только они определяют положение разделяющей гиперплоскости — остальные точки не влияют.">опорными векторами</span>. Только они определяют модель — остальные можно выкинуть, результат не изменится.</p>
      </div>

      <h3>🔧 Soft margin: когда данные не идеально разделимы</h3>
      <p>В реальности классы почти никогда не разделимы идеально. Решение: разрешить некоторым точкам нарушать margin, но <b>со штрафом</b>:</p>

      <div class="math-block">$$\\min_{w, b, \\xi} \\frac{1}{2}\\|w\\|^2 + C \\sum_i \\xi_i$$</div>

      <p>Здесь $\\xi_i \\geq 0$ — «штрафы» за нарушения margin, а $C$ — параметр, регулирующий жёсткость.</p>

      <p><b>Роль C:</b></p>
      <ul>
        <li><b>Большой C (например, 100):</b> модель пытается строго разделить всех. Узкий margin, много support vectors, риск <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a>.</li>
        <li><b>Маленький C (например, 0.01):</b> допускает много нарушений. Широкий margin, более простая модель, риск <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">недообучения</a>.</li>
      </ul>

      <p>C — главный гиперпараметр SVM, похожий на обратный коэффициент регуляризации.</p>

      <h3>✨ <a class="glossary-link" onclick="App.selectTopic('glossary-kernel-trick')">Ядерный трюк</a> — секрет SVM</h3>
      <p>Классическая SVM рисует <b>прямую линию</b> (линейную границу). Как работать с нелинейными данными (например, круги или спирали)?</p>

      <p>Ответ: <span class="term" data-tip="Kernel Trick. Техника неявного отображения данных в более высокую размерность через функцию ядра K(x, x'), без реального вычисления преобразования.">ядерный трюк</span>. Идея гениальная:</p>
      <ol>
        <li>Отобразим данные в <b>более высокое</b> пространство, где они становятся линейно разделимыми.</li>
        <li>Но не делаем это <b>явно</b>. Вместо отображения $\\phi(x)$ используем функцию <b>ядра</b> $K(x, x') = \\phi(x)^T \\phi(x')$.</li>
        <li>Все вычисления в SVM зависят только от <b>скалярных произведений</b> — их и заменяем на ядро.</li>
      </ol>

      <p><b>Магия:</b> никогда не вычисляем $\\phi(x)$ явно. Даже если $\\phi$ отображает в бесконечномерное пространство.</p>

      <div class="key-concept">
        <div class="kc-label">Конкретный пример: polynomial kernel степени 2</div>
        <p>Пусть $x = (x_1, x_2)$ — два признака. Полиномиальное ядро $K(x, x') = (x^T x')^2$.</p>
        <p>Раскроем скобки: $(x_1 x_1' + x_2 x_2')^2 = x_1^2 {x_1'}^2 + 2 x_1 x_2 x_1' x_2' + x_2^2 {x_2'}^2$.</p>
        <p>Это скалярное произведение $\\phi(x)^T \\phi(x')$, где $\\phi(x) = (x_1^2, \\sqrt{2}\\, x_1 x_2, x_2^2)$.</p>
        <p>То есть ядро <b>неявно</b> отображает 2D-точку $(x_1, x_2)$ в 3D-пространство $(x_1^2, \\sqrt{2}\\, x_1 x_2, x_2^2)$. Данные, неразделимые прямой в 2D, могут стать разделимыми плоскостью в 3D!</p>
        <p>RBF-ядро делает то же самое, но отображение $\\phi$ бесконечномерно — мы даже не можем записать все компоненты. Но ядро считается за $O(d)$ операций.</p>
      </div>

      <h3>📐 Популярные ядра</h3>

      <h4>Linear</h4>
      <div class="math-block">$$K(x, x') = x^T x'$$</div>
      <p>Обычная SVM без трюка. Для линейно разделимых данных и текстов (где много признаков).</p>

      <h4>Polynomial (полиномиальное)</h4>
      <div class="math-block">$$K(x, x') = (\\gamma \\cdot x^T x' + r)^d$$</div>
      <p>Полиномиальные границы степени $d$. Подходит для задач с взаимодействиями признаков.</p>

      <h4>RBF (Gaussian)</h4>
      <div class="math-block">$$K(x, x') = \\exp(-\\gamma \\|x - x'\\|^2)$$</div>
      <p><b>Самое популярное</b> ядро. Может выучить почти любую границу. Параметр $\\gamma$ управляет «шириной»:</p>
      <ul>
        <li><b>Большой γ:</b> узкая «область влияния» каждой точки, сложные границы, переобучение.</li>
        <li><b>Маленький γ:</b> широкое влияние, гладкая граница, недообучение.</li>
      </ul>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">Sigmoid</a></h4>
      <div class="math-block">$$K(x, x') = \\tanh(\\gamma \\cdot x^T x' + r)$$</div>
      <p>Похоже на нейросеть. Используется редко.</p>

      <h3>⚙️ Настройка SVM</h3>
      <p>Два главных параметра — C и γ (для RBF):</p>
      <ul>
        <li>Перебираем по <b>log-сетке</b>: C ∈ {0.001, 0.01, 0.1, 1, 10, 100}, γ ∈ аналогично.</li>
        <li>Для каждой пары — кросс-валидация.</li>
        <li>Выбираем лучшую комбинацию.</li>
      </ul>

      <p>В sklearn — <code>GridSearchCV</code> с <code>SVC</code>.</p>

      <h3>⚠️ Масштабирование обязательно</h3>
      <p>SVM использует расстояния между точками. Если один признак измеряется в метрах, другой — в граммах, SVM будет игнорировать первый. <b>Перед SVM всегда</b> StandardScaler.</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Хорошо работает на <b>маленьких/средних</b> датасетах.</li>
        <li>Эффективен в <b>высоких размерностях</b> (текст, DNA).</li>
        <li>Экономичен по памяти — хранит только support vectors.</li>
        <li>Гибкость через разные ядра.</li>
        <li>Теоретически обоснованный (максимум margin = хорошая generalization).</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Медленный на больших данных</b> (> 100 000 примеров) — O(n²-n³).</li>
        <li>Не выдаёт вероятности «из коробки» (нужен Platt scaling).</li>
        <li>Требует настройки C и γ.</li>
        <li>Чувствителен к масштабу признаков.</li>
        <li>С RBF-ядром теряется интерпретируемость.</li>
        <li>Плохо работает при сильном дисбалансе классов.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«SVM всегда использует RBF»</b> — нет, linear часто быстрее и не хуже для текстов.</li>
        <li><b>«Больше C — всегда лучше»</b> — переобучение.</li>
        <li><b>«SVM не требует препроцессинга»</b> — масштабирование критично.</li>
        <li><b>«SVM даёт вероятности»</b> — нужна отдельная калибровка.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: primal vs dual формулировка</summary>
        <div class="deep-dive-body">
          <p>SVM может решаться двумя эквивалентными способами:</p>
          <ul>
            <li><b>Primal:</b> напрямую ищем $w$ и $b$. Размерность задачи = число признаков.</li>
            <li><b>Dual:</b> ищем коэффициенты $\\alpha_i$ для каждой точки. Размерность = число точек.</li>
          </ul>
          <p>Dual позволяет применять ядерный трюк (всё выражается через $K(x_i, x_j)$) и эффективен, когда признаков больше чем точек.</p>
          <p>Условия KKT дают: опорные векторы — это точки с $\\alpha_i > 0$. Их обычно 10-30% от всех точек.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: hinge loss</summary>
        <div class="deep-dive-body">
          <p>SVM можно переформулировать через loss-функцию:</p>
          <div class="math-block">$$L = \\frac{1}{2}\\|w\\|^2 + C \\sum_i \\max(0, 1 - y_i (w^T x_i + b))$$</div>
          <p>$\\max(0, 1 - y \\cdot s)$ — это <span class="term" data-tip="Hinge loss. Функция потерь: 0 если точка правильно классифицирована с margin >= 1, иначе линейно растёт. Используется в SVM.">hinge loss</span>. Она равна 0 для правильных уверенных классификаций и штрафует остальные линейно.</p>
          <p>Это L2-регуляризованная линейная модель с hinge loss — эквивалент SVM в форме для SGD.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: SVR и One-Class SVM</summary>
        <div class="deep-dive-body">
          <p><b>SVR (Support Vector Regression)</b> — SVM для регрессии. Идея: внутри ε-тубы ошибки не штрафуются, снаружи — штрафуются. Даёт «толстую» регрессионную линию.</p>
          <p><b>One-Class SVM</b> — для anomaly detection. Учит границу вокруг нормальных данных, всё «снаружи» — аномалии. Хорошо, когда нет размеченных аномалий.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Логистическая регрессия</b> — тоже строит линейную границу, но с другим критерием.</li>
        <li><b>Перцептрон</b> — находит любую границу, SVM — с максимальным margin.</li>
        <li><b>Нейросети</b> — могут выучить те же функции, но иначе.</li>
        <li><b>Регуляризация</b> — C это обратная сила регуляризации.</li>
        <li><b>Isolation Forest</b> — альтернатива One-Class SVM для аномалий.</li>
      </ul>
    `,

    examples: [
      {
        title: 'SVM на 4 точках: находим margin',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>4 точки на плоскости, два класса. Найти разделяющую гиперплоскость с максимальным margin, определить опорные векторы, вычислить расстояние от каждой точки до границы. Предсказать класс новой точки (3,3).</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th><th>Класс y</th></tr>
              <tr><td>A</td><td>1</td><td>1</td><td>−1</td></tr>
              <tr><td>B</td><td>2</td><td>2</td><td>−1</td></tr>
              <tr><td>C</td><td>4</td><td>4</td><td>+1</td></tr>
              <tr><td>D</td><td>5</td><td>5</td><td>+1</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Визуализация данных</h4>
            <div class="calc">
              Все точки лежат на прямой x₂ = x₁ (диагональ):<br>
              A(1,1), B(2,2) — класс −1 (синие)<br>
              C(4,4), D(5,5) — класс +1 (оранжевые)<br><br>
              Между группами: «дырка» от x = 2 до x = 4<br>
              Середина промежутка: (2+4)/2 = 3, т.е. точка (3,3)
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;">
                <defs>
                  <marker id="svm-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>
                <text x="200" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">4 точки на плоскости x₂ = x₁</text>
                <!-- Axes -->
                <line x1="40" y1="180" x2="380" y2="180" stroke="#64748b" stroke-width="1"/>
                <line x1="40" y1="180" x2="40" y2="20" stroke="#64748b" stroke-width="1"/>
                <text x="380" y="195" font-size="9" fill="#64748b">x₁</text>
                <text x="25" y="20" font-size="9" fill="#64748b">x₂</text>
                <!-- Scale: x=40+x1*60, y=180-x2*28 -->
                <!-- Grid labels -->
                <text x="100" y="195" font-size="8" fill="#94a3b8">1</text>
                <text x="160" y="195" font-size="8" fill="#94a3b8">2</text>
                <text x="220" y="195" font-size="8" fill="#94a3b8">3</text>
                <text x="280" y="195" font-size="8" fill="#94a3b8">4</text>
                <text x="340" y="195" font-size="8" fill="#94a3b8">5</text>
                <!-- Points: A(1,1)→(100,152), B(2,2)→(160,124), C(4,4)→(280,68), D(5,5)→(340,40) -->
                <circle cx="100" cy="152" r="10" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
                <text x="100" y="156" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">A</text>
                <circle cx="160" cy="124" r="10" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
                <text x="160" y="128" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">B</text>
                <circle cx="280" cy="68" r="10" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                <text x="280" y="72" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">C</text>
                <circle cx="340" cy="40" r="10" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                <text x="340" y="44" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">D</text>
                <!-- Diagonal line x2=x1 -->
                <line x1="60" y1="170" x2="360" y2="28" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3"/>
                <!-- Legend -->
                <circle cx="50" cy="16" r="5" fill="#3b82f6"/>
                <text x="60" y="20" font-size="8" fill="#3b82f6">класс −1</text>
                <circle cx="130" cy="16" r="5" fill="#f59e0b"/>
                <text x="140" y="20" font-size="8" fill="#f59e0b">класс +1</text>
              </svg>
            </div>
            <div class="why">Точки лежат на диагонали x₂ = x₁. Линейно разделимы: между B(2,2) и C(4,4) есть зазор. Любая прямая, проходящая через эту «дыру», разделит классы. Но SVM хочет МАКСИМАЛЬНЫЙ зазор.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Любая разделяющая прямая работает, но SVM хочет лучшую</h4>
            <div class="calc">
              Разделяющая прямая: w₁x₁ + w₂x₂ + b = 0<br><br>
              Попробуем разные варианты:<br>
              Прямая 1: x₁ + x₂ − 7 = 0 (проходит через точку (3,4))<br>
              &nbsp;&nbsp;A(1,1): 1+1−7 = −5 &lt; 0 → класс −1 ✓<br>
              &nbsp;&nbsp;C(4,4): 4+4−7 = +1 > 0 → класс +1 ✓ Работает!<br><br>
              Прямая 2: x₁ + x₂ − 8 = 0<br>
              &nbsp;&nbsp;A(1,1): 1+1−8 = −6 &lt; 0 → −1 ✓<br>
              &nbsp;&nbsp;C(4,4): 4+4−8 = 0 — НА границе (слишком близко!)<br><br>
              Прямая 3: x₁ + x₂ − 6 = 0 (ровно посередине)<br>
              &nbsp;&nbsp;A(1,1): 1+1−6 = −4 ✓, B(2,2): 2+2−6 = −2 ✓<br>
              &nbsp;&nbsp;C(4,4): 4+4−6 = +2 ✓, D(5,5): 5+5−6 = +4 ✓<br>
              Все точки далеко от границы!
            </div>
            <div class="why">Есть бесконечно много разделяющих прямых. Все три работают. Но SVM ищет ту, которая максимизирует РАССТОЯНИЕ от ближайших точек. Посмотрим, какая из них лучше.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Находим оптимальную границу: w = (1,1), b = −4.5</h4>
            <div class="calc">
              Средняя точка между B(2,2) и C(4,4):<br>
              midpoint = ((2+4)/2, (2+4)/2) = (3, 3)<br><br>
              Направление от −1 к +1: вдоль вектора (1,1) (по диагонали)<br>
              Разделяющая прямая должна быть ПЕРПЕНДИКУЛЯРНА этому направлению<br>
              и проходить через (3,3).<br><br>
              Перпендикуляр к (1,1): прямая x₁ + x₂ = const<br>
              Через (3,3): x₁ + x₂ = 6, т.е. x₁ + x₂ − 6 = 0<br><br>
              Нормализуем для SVM: w = (1,1), b = −6<br>
              Но для канонической формы (min |w·x+b| = 1) нужно масштабировать.<br><br>
              Ближайшие точки к границе: B(2,2) и C(4,4)<br>
              w·B + b = 1·2 + 1·2 − 6 = −2<br>
              w·C + b = 1·4 + 1·4 − 6 = +2<br><br>
              Масштабируем: делим w и b на 2:<br>
              w = (0.5, 0.5), b = −3 → w·B + b = 1+1−3 = −1, w·C + b = 2+2−3 = +1 ✓<br><br>
              Или эквивалентно: <b>w = (1, 1), b = −6</b>, нормируем потом.<br>
              Каноническая форма: <b>x₁ + x₂ − 6 = 0</b>
            </div>
            <div class="why">Мы нашли границу как перпендикулярный биссектор отрезка [B, C]. Это гарантирует одинаковое расстояние от B и C до границы — то есть максимальный margin.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Расстояние от каждой точки до границы</h4>
            <div class="calc">
              Расстояние от точки (x₁, x₂) до прямой w₁x₁ + w₂x₂ + b = 0:<br>
              d = |w₁x₁ + w₂x₂ + b| / ‖w‖<br><br>
              ‖w‖ = √(1² + 1²) = √2 ≈ 1.414<br><br>
              A(1,1): d = |1+1−6| / √2 = |−4| / √2 = 4/√2 = 2√2 ≈ <b>2.828</b><br>
              B(2,2): d = |2+2−6| / √2 = |−2| / √2 = 2/√2 = √2 ≈ <b>1.414</b> ← ближайшая −1<br>
              C(4,4): d = |4+4−6| / √2 = |+2| / √2 = 2/√2 = √2 ≈ <b>1.414</b> ← ближайшая +1<br>
              D(5,5): d = |5+5−6| / √2 = |+4| / √2 = 4/√2 = 2√2 ≈ <b>2.828</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Точка</th><th>w·x + b</th><th>Расстояние</th><th>Опорный вектор?</th></tr>
                <tr><td>A(1,1)</td><td>−4</td><td>2.828</td><td>Нет</td></tr>
                <tr><td>B(2,2)</td><td>−2</td><td><b>1.414</b></td><td><b>Да!</b></td></tr>
                <tr><td>C(4,4)</td><td>+2</td><td><b>1.414</b></td><td><b>Да!</b></td></tr>
                <tr><td>D(5,5)</td><td>+4</td><td>2.828</td><td>Нет</td></tr>
              </table>
            </div>
            <div class="why">Опорные векторы = точки, ближайшие к границе: B(2,2) и C(4,4). Они «определяют» положение границы. Если убрать A или D — ничего не изменится. Если сдвинуть B или C — граница сдвинется.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Margin = 2 / ‖w‖</h4>
            <div class="calc">
              В канонической форме (|w·x+b| = 1 для опорных векторов):<br>
              w' = w/2 = (0.5, 0.5), b' = −3<br>
              ‖w'‖ = √(0.25 + 0.25) = √0.5 = 1/√2 ≈ 0.707<br><br>
              Margin = 2 / ‖w'‖ = 2 / (1/√2) = 2√2 ≈ <b>2.828</b><br><br>
              Или эквивалентно: margin = 2 · min_distance = 2 · 1.414 = <b>2.828</b>
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
                <text x="210" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">SVM: граница, margin и опорные векторы</text>
                <!-- Axes -->
                <line x1="40" y1="180" x2="380" y2="180" stroke="#64748b" stroke-width="1"/>
                <line x1="40" y1="180" x2="40" y2="20" stroke="#64748b" stroke-width="1"/>
                <text x="380" y="195" font-size="9" fill="#64748b">x₁</text>
                <text x="25" y="20" font-size="9" fill="#64748b">x₂</text>
                <!-- Scale: x=40+x1*60, y=180-x2*28 -->
                <!-- Boundary: x1+x2=6 → (0,6) to (6,0) → screen: (40,12) to (400,180) -->
                <line x1="40" y1="12" x2="400" y2="180" stroke="#ef4444" stroke-width="2.5"/>
                <text x="365" y="158" font-size="9" fill="#ef4444" font-weight="600">x₁+x₂=6</text>
                <!-- Margin line -1: x1+x2=4 → (0,4) to (4,0) → screen: (40,68) to (280,180) -->
                <line x1="40" y1="68" x2="280" y2="180" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/>
                <text x="55" y="63" font-size="8" fill="#3b82f6">x₁+x₂=4</text>
                <!-- Margin line +1: x1+x2=8 → (0,8) to (8,0) → but clipped: (160,12) to (400,124) -->
                <line x1="160" y1="12" x2="400" y2="124" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,3"/>
                <text x="375" y="108" font-size="8" fill="#f59e0b">x₁+x₂=8</text>
                <!-- Margin shading -->
                <polygon points="40,68 280,180 400,180 400,124 160,12 40,12" fill="#ef4444" fill-opacity="0.06"/>
                <!-- Points -->
                <circle cx="100" cy="152" r="10" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
                <text x="100" y="156" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">A</text>
                <!-- B is support vector -->
                <circle cx="160" cy="124" r="10" fill="#3b82f6" stroke="#ef4444" stroke-width="3"/>
                <text x="160" y="128" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">B</text>
                <circle cx="160" cy="124" r="16" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
                <!-- C is support vector -->
                <circle cx="280" cy="68" r="10" fill="#f59e0b" stroke="#ef4444" stroke-width="3"/>
                <text x="280" y="72" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">C</text>
                <circle cx="280" cy="68" r="16" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
                <circle cx="340" cy="40" r="10" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
                <text x="340" y="44" text-anchor="middle" font-size="8" fill="#fff" font-weight="600">D</text>
                <!-- Margin arrows -->
                <line x1="185" y1="110" x2="240" y2="84" stroke="#64748b" stroke-width="1.5" marker-end="url(#svm-arr)"/>
                <line x1="255" y1="82" x2="200" y2="108" stroke="#64748b" stroke-width="1.5" marker-end="url(#svm-arr)"/>
                <text x="220" y="104" text-anchor="middle" font-size="9" fill="#64748b" font-weight="600">margin=2√2</text>
              </svg>
              <div class="caption">Красная линия — разделяющая гиперплоскость x₁+x₂=6. Пунктирные — границы margin (x₁+x₂=4 и x₁+x₂=8). B и C (обведены) — опорные векторы. Margin = 2√2 ≈ 2.83.</div>
            </div>
            <div class="why">Margin = расстояние между двумя пунктирными линиями = 2√2 ≈ 2.83. SVM нашёл прямую, которая максимизирует именно это расстояние. Опорных векторов всего 2 из 4 точек.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: Предсказание для новой точки (3,3)</h4>
            <div class="calc">
              Граница: x₁ + x₂ − 6 = 0, w = (1, 1), b = −6<br><br>
              Для точки (3,3):<br>
              w·x + b = 1·3 + 1·3 + (−6) = 3 + 3 − 6 = <b>0</b><br><br>
              Значение = 0 → точка РОВНО на границе!<br>
              Формально: sign(0) не определён → неуверенное предсказание<br><br>
              Для точки (3.5, 3.5):<br>
              w·x + b = 3.5 + 3.5 − 6 = +1 > 0 → класс <b>+1</b><br><br>
              Для точки (2.5, 2.5):<br>
              w·x + b = 2.5 + 2.5 − 6 = −1 &lt; 0 → класс <b>−1</b>
            </div>
            <div class="why">SVM предсказывает sign(w·x + b). Положительное значение → +1, отрицательное → −1. Абсолютное значение |w·x+b|/‖w‖ — это «уверенность» (расстояние от границы). Чем дальше от границы, тем увереннее.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Граница: x₁ + x₂ = 6. Опорные векторы: B(2,2) и C(4,4). Margin = 2√2 ≈ 2.83. Точка (3,3) лежит ровно на границе (неопределённость), (3.5,3.5) → +1, (2.5,2.5) → −1.</p>
          </div>
          <div class="lesson-box">
            Опорные векторы — единственные точки, влияющие на границу. Если удалить A или D, граница не изменится. Если сдвинуть B ближе к C — margin сузится. Это делает SVM устойчивым к не-опорным точкам.
          </div>
        `,
      },
      {
        title: 'Soft margin: эффект параметра C',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Добавляем «шумную» точку E(3,3) с классом −1 в данные из примера 1. Теперь классы НЕ разделимы линейно. Сравнить SVM с C=0.1 (мягкий) и C=100 (жёсткий).</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th><th>Класс y</th><th>Примечание</th></tr>
              <tr><td>A</td><td>1</td><td>1</td><td>−1</td><td></td></tr>
              <tr><td>B</td><td>2</td><td>2</td><td>−1</td><td></td></tr>
              <tr><td>C</td><td>4</td><td>4</td><td>+1</td><td></td></tr>
              <tr><td>D</td><td>5</td><td>5</td><td>+1</td><td></td></tr>
              <tr><td>E</td><td>3</td><td>3</td><td>−1</td><td>Шумная точка!</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Проблема — данные больше не разделимы</h4>
            <div class="calc">
              Без точки E: граница x₁+x₂ = 6 идеально разделяла классы<br>
              Точка E(3,3): w·x + b = 3+3−6 = 0 → на самой границе!<br>
              Класс E = −1, но она среди точек +1<br><br>
              Если поставить границу x₁+x₂ = 7 (правее E):<br>
              E(3,3): 3+3−7 = −1 &lt; 0 → −1 ✓<br>
              C(4,4): 4+4−7 = +1 > 0 → +1 ✓<br>
              Но: B(2,2): 2+2−7 = −3 (далеко), C(4,4): +1 (близко)<br>
              Margin стал маленьким и несбалансированным
            </div>
            <div class="why">Hard margin SVM не может обработать эту ситуацию: нет прямой, идеально разделяющей все 5 точек с хорошим margin. Нужен SOFT margin — допуск нарушений.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: C = 100 (жёсткий — «не терпит ошибок»)</h4>
            <div class="calc">
              Целевая функция: min ½‖w‖² + <b>100</b>·Σξᵢ<br><br>
              С C=100 штраф за нарушение очень высок<br>
              SVM пытается классифицировать ВСЕ точки верно, включая шумную E<br><br>
              Результат: граница сдвигается к x₁+x₂ ≈ 7.2<br>
              &nbsp;&nbsp;B(2,2): 2+2−7.2 = −3.2 → −1 ✓ (далеко от границы)<br>
              &nbsp;&nbsp;E(3,3): 3+3−7.2 = −1.2 → −1 ✓ (но граница подвинулась ради E!)<br>
              &nbsp;&nbsp;C(4,4): 4+4−7.2 = +0.8 → +1 ✓ (ОЧЕНЬ близко к границе)<br><br>
              Margin ≈ 2·0.8/√2 = 1.13 (был 2.83 без шума — сократился в 2.5 раза!)
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
                <text x="210" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">C=100: граница подстроилась под шумную точку</text>
                <!-- Boundary shifted right -->
                <line x1="120" y1="15" x2="390" y2="130" stroke="#ef4444" stroke-width="2"/>
                <text x="370" y="120" font-size="8" fill="#ef4444">x₁+x₂=7.2</text>
                <!-- Points: A(1,1), B(2,2), E(3,3), C(4,4), D(5,5) -->
                <!-- Scale: x=30+x1*65, y=130-x2*22 -->
                <circle cx="95" cy="108" r="8" fill="#3b82f6"/>
                <text x="95" y="112" text-anchor="middle" font-size="7" fill="#fff">A</text>
                <circle cx="160" cy="86" r="8" fill="#3b82f6"/>
                <text x="160" y="90" text-anchor="middle" font-size="7" fill="#fff">B</text>
                <circle cx="225" cy="64" r="8" fill="#3b82f6" stroke="#ef4444" stroke-width="2"/>
                <text x="225" y="68" text-anchor="middle" font-size="7" fill="#fff">E</text>
                <text x="240" y="56" font-size="8" fill="#ef4444">шум!</text>
                <circle cx="290" cy="42" r="8" fill="#f59e0b"/>
                <text x="290" y="46" text-anchor="middle" font-size="7" fill="#fff">C</text>
                <circle cx="355" cy="20" r="8" fill="#f59e0b"/>
                <text x="355" y="24" text-anchor="middle" font-size="7" fill="#fff">D</text>
                <!-- Narrow margin indication -->
                <line x1="270" y1="50" x2="295" y2="50" stroke="#64748b" stroke-width="1" marker-end="url(#svm-arr)"/>
                <text x="283" y="62" font-size="7" fill="#64748b">узкий margin</text>
              </svg>
            </div>
            <div class="why">C=100 «заставляет» SVM классифицировать шумную E правильно. Цена: margin сузился с 2.83 до ~1.13, и граница стала неоптимальной для «настоящих» данных. Одна шумная точка испортила модель!</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: C = 0.1 (мягкий — «терпит ошибки»)</h4>
            <div class="calc">
              Целевая функция: min ½‖w‖² + <b>0.1</b>·Σξᵢ<br><br>
              С C=0.1 штраф за нарушение низкий<br>
              SVM предпочтёт ШИРОКИЙ margin, даже если E окажется «не на своей стороне»<br><br>
              Результат: граница остаётся близко к x₁+x₂ = 6.0<br>
              &nbsp;&nbsp;B(2,2): 2+2−6 = −2 → −1 ✓<br>
              &nbsp;&nbsp;E(3,3): 3+3−6 = 0 → на границе, ξ_E > 0 (нарушение)<br>
              &nbsp;&nbsp;C(4,4): 4+4−6 = +2 → +1 ✓<br><br>
              Штраф за E: 0.1 · ξ_E ≈ 0.1 · 1.0 = 0.1 (маленький)<br>
              Margin ≈ 2.83 (почти не изменился!)<br><br>
              E классифицирована НЕВЕРНО (ξ > 0), но margin сохранён
            </div>
            <div class="why">C=0.1 «игнорирует» шумную точку E. Границы почти такие же, как без шума. Для новых данных этот SVM будет обобщать лучше, потому что margin широкий.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Сравнительная таблица</h4>
            <div class="example-data-table">
              <table>
                <tr><th></th><th>C = 0.1</th><th>C = 100</th></tr>
                <tr><td>Граница</td><td>x₁+x₂ ≈ 6.0</td><td>x₁+x₂ ≈ 7.2</td></tr>
                <tr><td>Margin</td><td><b>≈ 2.83 (широкий)</b></td><td>≈ 1.13 (узкий)</td></tr>
                <tr><td>Train accuracy</td><td>4/5 = 80%</td><td><b>5/5 = 100%</b></td></tr>
                <tr><td>Ошибка на E</td><td>Да (допускает)</td><td>Нет (подстроился)</td></tr>
                <tr><td>Обобщение</td><td><b>Хорошее</b></td><td>Плохое (под шум)</td></tr>
                <tr><td>Опорные векторы</td><td>B, C, E</td><td>E, C</td></tr>
              </table>
            </div>
            <div class="calc">
              Практический выбор C:<br>
              from sklearn.model_selection import GridSearchCV<br>
              param_grid = {'C': [0.001, 0.01, 0.1, 1, 10, 100]}<br>
              grid = GridSearchCV(SVC(), param_grid, cv=5)<br>
              # Обычно оптимум C = 0.1–10 для большинства задач
            </div>
            <div class="why">C контролирует баланс: широкий margin (обобщение) vs верная классификация обучения (подгонка). Малый C → широкий margin, допускает ошибки. Большой C → узкий margin, подстраивается под шум.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>C=0.1: margin ≈ 2.83, train acc = 80% (E ошибочна, но модель устойчива). C=100: margin ≈ 1.13, train acc = 100% (но подстроился под шум). В реальных задачах C=0.1 обобщает лучше.</p>
          </div>
          <div class="lesson-box">
            C — аналог 1/λ в регуляризации. Большой C = мало регуляризации = переобучение. Малый C = много регуляризации = недообучение. Выбирать через cross-validation. Стандартная сетка: C = [0.01, 0.1, 1, 10, 100].
          </div>
        `,
      },
      {
        title: 'RBF kernel: нелинейное разделение',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>6 точек расположены двумя «кольцами»: внутренние точки (+1) близко к центру, внешние (−1) далеко. Линейный SVM не справится. Показать, как RBF kernel решает задачу: вычислить K(xᵢ, xⱼ) для всех пар, показать трансформацию пространства.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th><th>r = √(x₁²+x₂²)</th><th>Класс y</th></tr>
              <tr><td>A</td><td>1</td><td>0</td><td>1.00</td><td>+1 (внутр.)</td></tr>
              <tr><td>B</td><td>0</td><td>1</td><td>1.00</td><td>+1 (внутр.)</td></tr>
              <tr><td>C</td><td>−1</td><td>0</td><td>1.00</td><td>+1 (внутр.)</td></tr>
              <tr><td>D</td><td>3</td><td>0</td><td>3.00</td><td>−1 (внешн.)</td></tr>
              <tr><td>E</td><td>0</td><td>3</td><td>3.00</td><td>−1 (внешн.)</td></tr>
              <tr><td>F</td><td>−3</td><td>0</td><td>3.00</td><td>−1 (внешн.)</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Почему линейный SVM провалится</h4>
            <div class="calc">
              Внутренние точки (r=1): A(1,0), B(0,1), C(−1,0) — вокруг центра<br>
              Внешние точки (r=3): D(3,0), E(0,3), F(−3,0) — далеко от центра<br><br>
              Нужна КРУГОВАЯ граница r = 2 (между кольцами)<br>
              Но линейный SVM ищет ПРЯМУЮ w₁x₁ + w₂x₂ + b = 0<br><br>
              Любая прямая через центр отсечёт часть внутренних И внешних точек<br>
              Например, x₁ = 0: A(1,0) справа ✓, C(−1,0) слева ✗<br>
              Линейный SVM: train accuracy ≈ 50–67%
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style="max-width:300px;">
                <text x="150" y="16" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">Два кольца: линейно неразделимы</text>
                <!-- Center at (150,110), scale 25px per unit -->
                <!-- Inner ring (r=1) -->
                <circle cx="150" cy="110" r="25" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/>
                <!-- Outer ring (r=3) -->
                <circle cx="150" cy="110" r="75" fill="none" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/>
                <!-- Points -->
                <circle cx="175" cy="110" r="8" fill="#3b82f6"/><text x="175" y="114" text-anchor="middle" font-size="7" fill="#fff">A</text>
                <circle cx="150" cy="85" r="8" fill="#3b82f6"/><text x="150" y="89" text-anchor="middle" font-size="7" fill="#fff">B</text>
                <circle cx="125" cy="110" r="8" fill="#3b82f6"/><text x="125" y="114" text-anchor="middle" font-size="7" fill="#fff">C</text>
                <circle cx="225" cy="110" r="8" fill="#f59e0b"/><text x="225" y="114" text-anchor="middle" font-size="7" fill="#fff">D</text>
                <circle cx="150" cy="35" r="8" fill="#f59e0b"/><text x="150" y="39" text-anchor="middle" font-size="7" fill="#fff">E</text>
                <circle cx="75" cy="110" r="8" fill="#f59e0b"/><text x="75" y="114" text-anchor="middle" font-size="7" fill="#fff">F</text>
                <!-- Ideal boundary -->
                <circle cx="150" cy="110" r="50" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6,3"/>
                <text x="295" y="70" text-anchor="end" font-size="8" fill="#10b981">идеальная граница r=2</text>
              </svg>
            </div>
            <div class="why">Данные расположены двумя концентрическими кольцами. Никакая прямая не может разделить «внутри» от «снаружи». Нужно нелинейное преобразование.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Вычисляем RBF kernel K(xᵢ, xⱼ) = exp(−γ‖xᵢ−xⱼ‖²)</h4>
            <div class="calc">
              Возьмём γ = 0.5. Считаем K для ключевых пар:<br><br>
              <b>Внутри-внутри:</b><br>
              K(A, B) = exp(−0.5·((1−0)²+(0−1)²)) = exp(−0.5·2) = exp(−1) ≈ <b>0.368</b><br>
              K(A, C) = exp(−0.5·((1−(−1))²+(0−0)²)) = exp(−0.5·4) = exp(−2) ≈ <b>0.135</b><br>
              K(B, C) = exp(−0.5·((0−(−1))²+(1−0)²)) = exp(−0.5·2) = exp(−1) ≈ <b>0.368</b><br><br>
              <b>Снаружи-снаружи:</b><br>
              K(D, E) = exp(−0.5·((3−0)²+(0−3)²)) = exp(−0.5·18) = exp(−9) ≈ <b>0.0001</b><br>
              K(D, F) = exp(−0.5·((3−(−3))²+0²)) = exp(−0.5·36) = exp(−18) ≈ <b>0.000</b><br><br>
              <b>Внутри-снаружи:</b><br>
              K(A, D) = exp(−0.5·((1−3)²+0²)) = exp(−0.5·4) = exp(−2) ≈ <b>0.135</b><br>
              K(A, E) = exp(−0.5·(1²+(−3)²)) = exp(−0.5·10) = exp(−5) ≈ <b>0.007</b><br>
              K(B, D) = exp(−0.5·((−3)²+(1)²)) = exp(−0.5·10) = exp(−5) ≈ <b>0.007</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>K(·,·)</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th></tr>
                <tr><td><b>A</b></td><td>1.000</td><td>0.368</td><td>0.135</td><td>0.135</td><td>0.007</td><td>0.002</td></tr>
                <tr><td><b>B</b></td><td>0.368</td><td>1.000</td><td>0.368</td><td>0.007</td><td>0.135</td><td>0.007</td></tr>
                <tr><td><b>C</b></td><td>0.135</td><td>0.368</td><td>1.000</td><td>0.002</td><td>0.007</td><td>0.135</td></tr>
                <tr><td><b>D</b></td><td>0.135</td><td>0.007</td><td>0.002</td><td>1.000</td><td>0.0001</td><td>0.000</td></tr>
                <tr><td><b>E</b></td><td>0.007</td><td>0.135</td><td>0.007</td><td>0.0001</td><td>1.000</td><td>0.000</td></tr>
                <tr><td><b>F</b></td><td>0.002</td><td>0.007</td><td>0.135</td><td>0.000</td><td>0.000</td><td>1.000</td></tr>
              </table>
            </div>
            <div class="why">K(xᵢ, xⱼ) — «похожесть» между точками. Внутренние точки похожи друг на друга (K ≈ 0.13–0.37). Внешние точки НЕ похожи на внутренние (K ≈ 0.002–0.007). RBF kernel создаёт «пузыри» вокруг каждой точки.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: <a class="glossary-link" onclick="App.selectTopic('glossary-kernel-trick')">Kernel trick</a> — неявное поднятие в высшее измерение</h4>
            <div class="calc">
              Вместо RBF можно ЯВНО добавить признак r² = x₁² + x₂²:<br><br>
              A(1,0): r² = 1² + 0² = <b>1</b> → новое пространство: (1, 0, 1)<br>
              B(0,1): r² = 0² + 1² = <b>1</b> → (0, 1, 1)<br>
              C(−1,0): r² = 1² + 0² = <b>1</b> → (−1, 0, 1)<br>
              D(3,0): r² = 9 + 0 = <b>9</b> → (3, 0, 9)<br>
              E(0,3): r² = 0 + 9 = <b>9</b> → (0, 3, 9)<br>
              F(−3,0): r² = 9 + 0 = <b>9</b> → (−3, 0, 9)<br><br>
              В новом пространстве (x₁, x₂, r²):<br>
              Внутренние: r² = 1 (все на «полке» z=1)<br>
              Внешние: r² = 9 (все на «полке» z=9)<br><br>
              Линейный разделитель: r² = 5 (или z = 5)<br>
              r² &lt; 5 → +1 (внутренние) ✓<br>
              r² > 5 → −1 (внешние) ✓<br>
              <b>100% accuracy!</b>
            </div>
            <div class="why">Kernel trick: RBF kernel НЕЯВНО поднимает данные в бесконечномерное пространство, где круговая граница становится линейной гиперплоскостью. Мы показали это на примере с r² — это упрощённая версия того, что делает RBF.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Влияние γ на границу</h4>
            <div class="calc">
              γ = 0.01 (маленький): K(A,D) = exp(−0.01·4) = exp(−0.04) ≈ 0.96<br>
              Все точки «похожи» → слишком гладкая граница → <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">underfitting</a><br><br>
              γ = 10 (большой): K(A,D) = exp(−10·4) = exp(−40) ≈ 0.000<br>
              Только ближайшие точки «видят» друг друга → слишком сложная граница → <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">overfitting</a><br><br>
              γ = 0.5 (оптимум): K адекватно отличает ближних от дальних
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>γ</th><th>K(A,B) внутри</th><th>K(A,D) внутри-снаружи</th><th>Train Acc</th><th>Граница</th></tr>
                <tr><td>0.01</td><td>0.98</td><td>0.96</td><td>50%</td><td>Прямая (underfitting)</td></tr>
                <tr><td>0.1</td><td>0.82</td><td>0.67</td><td>83%</td><td>Слабо изогнутая</td></tr>
                <tr><td>0.5</td><td>0.37</td><td>0.14</td><td><b>100%</b></td><td><b>Круговая (оптимум)</b></td></tr>
                <tr><td>10</td><td>0.00</td><td>0.00</td><td>100%</td><td>Островки (overfitting)</td></tr>
              </table>
            </div>
            <div class="why">γ контролирует «радиус влияния» каждой точки. Малый γ — все точки похожи (плавная граница). Большой γ — только ближайшие соседи влияют (сложная, переобученная граница). Выбирать через cross-validation вместе с C.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Линейный SVM: 50–67% (не справляется с кольцами). RBF SVM (γ=0.5, C=1): 100%. K(xᵢ,xⱼ) показывает «похожесть»: внутренние точки похожи (K≈0.37), внутренние-внешние различны (K≈0.007). Kernel trick заменяет круговую границу линейной в высшем измерении.</p>
          </div>
          <div class="lesson-box">
            Практика: всегда начинай с линейного SVM (быстро). Если accuracy низкая — пробуй RBF. Выбирай C и γ через GridSearchCV с логарифмической сеткой: C=[0.1,1,10,100], γ=[0.001,0.01,0.1,1].
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: SVM с разными ядрами</h3>
        <p>Меняй ядро, C и параметр γ. Смотри, как меняется граница.</p>
        <div class="sim-container">
          <div class="sim-controls" id="svm-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="svm-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="svm-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="svm-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#svm-controls');
        const cKernel = App.makeControl('select', 'svm-kernel', 'Ядро', {
          options: [{ value: 'linear', label: 'Linear' }, { value: 'rbf', label: 'RBF' }, { value: 'poly', label: 'Poly' }],
          value: 'rbf',
        });
        const cC = App.makeControl('range', 'svm-c', 'log₁₀(C)', { min: -2, max: 2, step: 0.1, value: 0 });
        const cGamma = App.makeControl('range', 'svm-gamma', 'γ (RBF)', { min: 0.1, max: 5, step: 0.1, value: 1 });
        const cDeg = App.makeControl('range', 'svm-deg', 'Степень (Poly)', { min: 2, max: 5, step: 1, value: 3 });
        const cShape = App.makeControl('select', 'svm-shape', 'Форма', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'circle', label: 'Круг' }, { value: 'linear', label: 'Линейно' }, { value: 'xor', label: 'XOR' }],
          value: 'moons',
        });
        [cKernel, cC, cGamma, cDeg, cShape].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#svm-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let alpha = []; // dual coefficients
        let b = 0;
        let kern = null;

        function genData() {
          const shape = cShape.input.value;
          points = [];
          const n = 40;
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) { x = -0.4 + 0.6 * Math.cos(t) + App.Util.randn(0, 0.06); y = -0.2 + 0.6 * Math.sin(t) + App.Util.randn(0, 0.06); cls = -1; }
              else { x = 0.2 + 0.6 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.06); y = 0.2 - 0.6 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.06); cls = 1; }
            } else if (shape === 'circle') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              const r = Math.sqrt(x * x + y * y);
              cls = r < 0.5 ? -1 : 1;
            } else if (shape === 'linear') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              cls = y > x ? 1 : -1;
              if (Math.random() < 0.1) cls = -cls;
            } else {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              cls = ((x > 0) ^ (y > 0)) ? 1 : -1;
            }
            points.push({ x, y, cls });
          }
        }

        function kernel(p1, p2) {
          const type = cKernel.input.value;
          const dot = p1.x * p2.x + p1.y * p2.y;
          if (type === 'linear') return dot;
          if (type === 'rbf') {
            const g = +cGamma.input.value;
            const d = (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
            return Math.exp(-g * d);
          }
          const deg = +cDeg.input.value;
          return Math.pow(dot + 1, deg);
        }

        // Simple SMO-like solver (упрощённый)
        function trainSVM() {
          const n = points.length;
          const C = Math.pow(10, +cC.input.value);
          alpha = new Array(n).fill(0);
          b = 0;
          const K = [];
          for (let i = 0; i < n; i++) { K.push([]); for (let j = 0; j < n; j++) K[i].push(kernel(points[i], points[j])); }

          const maxIter = 200;
          const tol = 1e-3;
          for (let iter = 0; iter < maxIter; iter++) {
            let numChanged = 0;
            for (let i = 0; i < n; i++) {
              const yi = points[i].cls;
              let Ei = b - yi; for (let k = 0; k < n; k++) Ei += alpha[k] * points[k].cls * K[k][i];
              if ((yi * Ei < -tol && alpha[i] < C) || (yi * Ei > tol && alpha[i] > 0)) {
                let j;
                do { j = Math.floor(Math.random() * n); } while (j === i);
                const yj = points[j].cls;
                let Ej = b - yj; for (let k = 0; k < n; k++) Ej += alpha[k] * points[k].cls * K[k][j];
                const ai_old = alpha[i], aj_old = alpha[j];
                let L, H;
                if (yi !== yj) { L = Math.max(0, aj_old - ai_old); H = Math.min(C, C + aj_old - ai_old); }
                else { L = Math.max(0, ai_old + aj_old - C); H = Math.min(C, ai_old + aj_old); }
                if (L === H) continue;
                const eta = 2 * K[i][j] - K[i][i] - K[j][j];
                if (eta >= 0) continue;
                alpha[j] = aj_old - yj * (Ei - Ej) / eta;
                alpha[j] = Math.min(H, Math.max(L, alpha[j]));
                if (Math.abs(alpha[j] - aj_old) < 1e-5) continue;
                alpha[i] = ai_old + yi * yj * (aj_old - alpha[j]);
                const b1 = b - Ei - yi * (alpha[i] - ai_old) * K[i][i] - yj * (alpha[j] - aj_old) * K[i][j];
                const b2 = b - Ej - yi * (alpha[i] - ai_old) * K[i][j] - yj * (alpha[j] - aj_old) * K[j][j];
                if (alpha[i] > 0 && alpha[i] < C) b = b1;
                else if (alpha[j] > 0 && alpha[j] < C) b = b2;
                else b = (b1 + b2) / 2;
                numChanged++;
              }
            }
            if (numChanged === 0) break;
          }
        }

        function predict(p) {
          let s = -b;
          for (let i = 0; i < points.length; i++) if (alpha[i] > 1e-6) s += alpha[i] * points[i].cls * kernel(points[i], p);
          return s;
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          const xMin = -1.5, xMax = 1.5;
          ctx.clearRect(0, 0, W, H);
          const step = 8;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = xMin + (py / H) * (xMax - xMin);
              const s = predict({ x, y });
              ctx.fillStyle = s >= 0 ? 'rgba(59,130,246,0.18)' : 'rgba(239,68,68,0.18)';
              ctx.fillRect(px, py, step, step);
            }
          }
          // граница + margin contours (нарисуем через пиксели)
          for (let px = 0; px < W; px += 2) {
            for (let py = 0; py < H; py += 2) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = xMin + (py / H) * (xMax - xMin);
              const s = predict({ x, y });
              if (Math.abs(s) < 0.03) { ctx.fillStyle = '#16a34a'; ctx.fillRect(px, py, 2, 2); }
              else if (Math.abs(Math.abs(s) - 1) < 0.03) { ctx.fillStyle = 'rgba(100,100,100,0.5)'; ctx.fillRect(px, py, 2, 2); }
            }
          }
          // точки
          points.forEach((p, i) => {
            ctx.fillStyle = p.cls === 1 ? '#3b82f6' : '#ef4444';
            const isSV = alpha[i] > 1e-4;
            ctx.strokeStyle = isSV ? '#0f172a' : '#fff';
            ctx.lineWidth = isSV ? 2.5 : 1.5;
            const cx = ((p.x - xMin) / (xMax - xMin)) * W;
            const cy = ((p.y - xMin) / (xMax - xMin)) * H;
            ctx.beginPath(); ctx.arc(cx, cy, isSV ? 7 : 5, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          let correct = 0, svCount = 0;
          points.forEach((p, i) => {
            const s = predict(p);
            if ((s >= 0 ? 1 : -1) === p.cls) correct++;
            if (alpha[i] > 1e-4) svCount++;
          });

          container.querySelector('#svm-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Ядро</div><div class="stat-value" style="font-size:14px;">${cKernel.input.value}</div></div>
            <div class="stat-card"><div class="stat-label">C</div><div class="stat-value">${Math.pow(10, +cC.input.value).toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Опорные векторы</div><div class="stat-value">${svCount}/${points.length}</div></div>
            <div class="stat-card"><div class="stat-label">Accuracy</div><div class="stat-value">${(correct / points.length * 100).toFixed(0)}%</div></div>
          `;
        }

        function rebuild() { trainSVM(); draw(); }

        [cKernel, cC, cGamma, cDeg].forEach(c => c.input.addEventListener('input', rebuild));
        cShape.input.addEventListener('change', () => { genData(); rebuild(); });
        container.querySelector('#svm-regen').onclick = () => { genData(); rebuild(); };

        setTimeout(() => { genData(); resize(); rebuild(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    python: `
      <h3>Python: метод опорных векторов (SVM)</h3>
      <p>sklearn.SVC поддерживает ядра RBF, polynomial и linear. GridSearchCV помогает подобрать C и gamma.</p>

      <h4>1. SVC с разными ядрами</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_moons, load_breast_cancer
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

# make_moons — нелинейно разделимый датасет
X, y = make_moons(n_samples=400, noise=0.2, random_state=42)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.3, random_state=42)

kernels = ['linear', 'rbf', 'poly']
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for ax, kernel in zip(axes, kernels):
    svc = SVC(kernel=kernel, C=1.0, probability=True)
    svc.fit(X_train, y_train)
    acc = svc.score(X_test, y_test)

    xx, yy = np.meshgrid(np.linspace(-3, 3, 200), np.linspace(-3, 3, 200))
    Z = svc.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    ax.contourf(xx, yy, Z, alpha=0.3, cmap='RdBu')
    ax.scatter(X_test[:, 0], X_test[:, 1], c=y_test, cmap='RdBu', edgecolors='k', s=30)
    ax.set_title(f'{kernel} (acc={acc:.3f})')

plt.suptitle('SVM с разными ядрами')
plt.tight_layout()
plt.show()</code></pre>

      <h4>2. GridSearchCV для C и gamma</h4>
      <pre><code>from sklearn.model_selection import GridSearchCV

# RBF: C контролирует margin, gamma — ширину ядра
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.01, 0.1],
    'kernel': ['rbf'],
}

grid = GridSearchCV(SVC(probability=True), param_grid,
                    cv=5, scoring='roc_auc', n_jobs=-1, verbose=0)
grid.fit(X_train, y_train)

print(f'Лучшие параметры: {grid.best_params_}')
print(f'CV ROC-AUC: {grid.best_score_:.4f}')
print(f'Test ROC-AUC: {roc_auc_score(y_test, grid.best_estimator_.predict_proba(X_test)[:,1]):.4f}')

# Тепловая карта результатов
import pandas as pd
results = pd.DataFrame(grid.cv_results_)
pivot = results.pivot_table(values='mean_test_score',
                             index='param_C', columns='param_gamma')
import seaborn as sns
sns.heatmap(pivot, annot=True, fmt='.3f', cmap='YlOrRd')
plt.title('GridSearchCV: ROC-AUC (C vs gamma)')
plt.show()</code></pre>

      <h4>3. SVM на реальных данных и опорные векторы</h4>
      <pre><code>data = load_breast_cancer()
X_r, y_r = data.data, data.target
X_tr, X_te, y_tr, y_te = train_test_split(X_r, y_r, test_size=0.2, random_state=42)

scaler2 = StandardScaler()
X_tr_s = scaler2.fit_transform(X_tr)
X_te_s = scaler2.transform(X_te)

svc_best = SVC(kernel='rbf', C=10, gamma='scale', probability=True)
svc_best.fit(X_tr_s, y_tr)

print(f'Test Accuracy: {svc_best.score(X_te_s, y_te):.4f}')
print(f'ROC-AUC: {roc_auc_score(y_te, svc_best.predict_proba(X_te_s)[:,1]):.4f}')
print(f'Число опорных векторов: {svc_best.n_support_}')
print(f'Всего опорных векторов: {svc_best.support_vectors_.shape[0]} из {len(X_tr)}')

print(classification_report(y_te, svc_best.predict(X_te_s), target_names=data.target_names))</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Классификация текстов</b> — категоризация документов.</li>
        <li><b>Распознавание лиц</b> — исторически сильное применение.</li>
        <li><b>Биоинформатика</b> — предсказание функции белков.</li>
        <li><b>Классификация изображений</b> — до эпохи CNN.</li>
        <li><b>Распознавание рукописных цифр</b> — MNIST benchmark.</li>
        <li><b>Anomaly detection</b> — One-Class SVM.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Хорошо работает на small/medium datasets</li>
            <li>Эффективен в высоких размерностях</li>
            <li>Memory efficient — хранит только support vectors</li>
            <li>Гибкость через разные ядра</li>
            <li>Чёткая геометрическая интуиция</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Медленный на больших данных (>100k)</li>
            <li>Не выдаёт вероятности напрямую</li>
            <li>Требует настройки C и γ</li>
            <li>Чувствителен к масштабу признаков</li>
            <li>Плохо с multi-class (OvO / OvR)</li>
            <li>Трудно интерпретируется (особенно с RBF)</li>
          </ul>
        </div>
      </div>

      <h3>🧭 Когда использовать vs когда НЕ использовать</h3>
      <table>
        <tr><th>✅ Используй когда</th><th>❌ НЕ используй когда</th></tr>
        <tr>
          <td>Небольшие/средние данные (до ~100 тыс. строк)</td>
          <td>Большие данные (&gt; 500k) — обучение занимает часы</td>
        </tr>
        <tr>
          <td>Высокая размерность (тексты, геномы) — SVM эффективен</td>
          <td>Нужны вероятности — SVM их не даёт напрямую (нужен Platt scaling)</td>
        </tr>
        <tr>
          <td>Данные линейно разделимы или с кастомным ядром</td>
          <td>Много классов — multi-class SVM неэффективен</td>
        </tr>
        <tr>
          <td>Нужна гарантированная граница с максимальным margin</td>
          <td>Нужна интерпретируемость — RBF SVM это чёрный ящик</td>
        </tr>
        <tr>
          <td>Небольшие выборки с шумом — SVM устойчив</td>
          <td>Смесь категориальных и числовых признаков — лучше деревья</td>
        </tr>
      </table>
      <p><b>Альтернативы:</b> Logistic Regression для линейных границ с вероятностями, XGBoost для табличных данных, нейросети для неструктурированных.</p>
    `,

    extra: `
      <h3>Hinge loss</h3>
      <p>SVM эквивалентен минимизации:</p>
      <div class="math-block">$$L = \\frac{1}{2}\\|\\mathbf{w}\\|^2 + C \\sum_i \\max(0, 1 - y_i(\\mathbf{w}^T x_i + b))$$</div>
      <p>Это hinge loss + L2 регуляризация.</p>

      <h3>Калибровка вероятностей (Platt scaling)</h3>
      <p>SVM не выдаёт вероятности. Platt scaling: обучить логистическую регрессию поверх score SVM:</p>
      <div class="math-block">$$P(y=1|f) = \\frac{1}{1 + e^{Af + B}}$$</div>

      <h3>Выбор параметров</h3>
      <ul>
        <li><b>C</b> — log-сетка [0.001, 0.01, 0.1, 1, 10, 100, 1000].</li>
        <li><b>γ (RBF)</b> — log-сетка или $\\gamma = 1/(\\text{n\\_features} \\cdot \\text{Var}(X))$.</li>
        <li>Grid search через CV.</li>
      </ul>

      <h3>One-Class SVM</h3>
      <p>Для anomaly detection: учим границу только нормальных данных, аномалии — вне границы.</p>

      <h3>SVR (SVM regression)</h3>
      <p>Для регрессии: epsilon-tube вокруг предсказания. Штрафуем ошибки, выходящие за ε, остальное игнорируем.</p>

      <h3>Масштабирование обязательно</h3>
      <p>SVM использует расстояния → чувствителен к масштабу. Всегда StandardScaler.</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=efR1C6CvhmE" target="_blank">StatQuest: Support Vector Machines</a> — интуитивное объяснение SVM и margin</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%20%D0%BE%D0%BF%D0%BE%D1%80%D0%BD%D1%8B%D1%85%20%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20SVM" target="_blank">SVM на Habr</a> — разбор метода опорных векторов на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html" target="_blank">sklearn: SVC</a> — документация Support Vector Classifier в sklearn</li>
      </ul>
    `,
  },
});
