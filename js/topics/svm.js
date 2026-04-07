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
        <li><b>Большой C (например, 100):</b> модель пытается строго разделить всех. Узкий margin, много support vectors, риск переобучения.</li>
        <li><b>Маленький C (например, 0.01):</b> допускает много нарушений. Широкий margin, более простая модель, риск недообучения.</li>
      </ul>

      <p>C — главный гиперпараметр SVM, похожий на обратный коэффициент регуляризации.</p>

      <h3>✨ Ядерный трюк — секрет SVM</h3>
      <p>Классическая SVM рисует <b>прямую линию</b> (линейную границу). Как работать с нелинейными данными (например, круги или спирали)?</p>

      <p>Ответ: <span class="term" data-tip="Kernel Trick. Техника неявного отображения данных в более высокую размерность через функцию ядра K(x, x'), без реального вычисления преобразования.">ядерный трюк</span>. Идея гениальная:</p>
      <ol>
        <li>Отобразим данные в <b>более высокое</b> пространство, где они становятся линейно разделимыми.</li>
        <li>Но не делаем это <b>явно</b>. Вместо отображения $\\phi(x)$ используем функцию <b>ядра</b> $K(x, x') = \\phi(x)^T \\phi(x')$.</li>
        <li>Все вычисления в SVM зависят только от <b>скалярных произведений</b> — их и заменяем на ядро.</li>
      </ol>

      <p><b>Магия:</b> никогда не вычисляем $\\phi(x)$ явно. Даже если $\\phi$ отображает в бесконечномерное пространство.</p>

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

      <h4>Sigmoid</h4>
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
        title: 'Линейный SVM: 4 точки, найти margin',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По 4 точкам найти разделяющую гиперплоскость и ширину margin вручную.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th><th>Класс y</th></tr>
              <tr><td>A</td><td>1</td><td>2</td><td>+1</td></tr>
              <tr><td>B</td><td>2</td><td>3</td><td>+1</td></tr>
              <tr><td>C</td><td>3</td><td>1</td><td>−1</td></tr>
              <tr><td>D</td><td>4</td><td>2</td><td>−1</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: попробовать разделяющую прямую</h4>
            <div class="calc">
              Попробуем: w₁x₁ + w₂x₂ + b = 0<br>
              Угадаем: x₁ − x₂ + 0 = 0, т.е. x₁ = x₂<br><br>
              Проверим:<br>
              A(1,2): 1 − 2 = −1 (предсказывает y=−1, факт +1) ✗<br>
              B(2,3): 2 − 3 = −1 ✗<br>
              Не подходит — нужно сместить.
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: найти правильную границу</h4>
            <div class="calc">
              Попробуем: x₁ − x₂ + 1 = 0 (добавим b=+1)<br><br>
              A(1,2): 1 − 2 + 1 = 0 — на границе (опорный вектор!)<br>
              B(2,3): 2 − 3 + 1 = 0 — тоже на границе!<br>
              C(3,1): 3 − 1 + 1 = 3 > 0 → предсказание +1, факт −1 ✗<br><br>
              Попробуем: −x₁ + x₂ + 1 = 0, т.е. x₂ = x₁ − 1<br>
              A(1,2): −1 + 2 + 1 = 2 > 0 → +1 ✓<br>
              B(2,3): −2 + 3 + 1 = 2 > 0 → +1 ✓<br>
              C(3,1): −3 + 1 + 1 = −1 &lt; 0 → −1 ✓<br>
              D(4,2): −4 + 2 + 1 = −1 &lt; 0 → −1 ✓
            </div>
            <div class="why">Граница w = (−1, 1), b = 1 → прямая x₂ = x₁ − 1. Все 4 точки классифицированы правильно!</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: вычислить margin</h4>
            <div class="calc">
              ‖w‖ = √(w₁² + w₂²) = √(1 + 1) = √2 ≈ 1.414<br><br>
              Расстояние от точки до гиперплоскости: |w·x + b| / ‖w‖<br><br>
              A(1,2): |−1 + 2 + 1| / √2 = 2/√2 = √2 ≈ <b>1.414</b><br>
              B(2,3): |−2 + 3 + 1| / √2 = 2/√2 = √2 ≈ <b>1.414</b><br>
              C(3,1): |−3 + 1 + 1| / √2 = 1/√2 ≈ <b>0.707</b><br>
              D(4,2): |−4 + 2 + 1| / √2 = 1/√2 ≈ <b>0.707</b><br><br>
              Опорные векторы: C и D (ближайшие к границе)<br>
              Margin = 2 · min_distance = 2 · 0.707 = <b>1.414</b>
            </div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: нормализовать w для канонической формы</h4>
            <div class="calc">
              В SVM ищем w такой, что минимальное |w·x + b| = 1<br>
              Сейчас минимум = 1 (у C и D)<br>
              Ширина margin = 2/‖w‖ = 2/√2 = √2 ≈ <b>1.414</b><br>
              SVM максимизирует именно эту величину
            </div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 400 165" xmlns="http://www.w3.org/2000/svg" style="max-width:400px;">
              <text x="200" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">SVM: 4 точки, разделяющая прямая и margin</text>
              <!-- Axes -->
              <line x1="45" y1="20" x2="45" y2="145" stroke="#64748b" stroke-width="1.5"/>
              <line x1="45" y1="145" x2="375" y2="145" stroke="#64748b" stroke-width="1.5"/>
              <text x="375" y="157" font-size="9" fill="#64748b">x₁</text>
              <text x="32" y="16" font-size="9" fill="#64748b">x₂</text>
              <!-- Scale: x1=1..4 → x=45+x1*70; x2=1..3 → y=145-x2*42 -->
              <!-- A(1,2)→(115,61), B(2,3)→(185,19), C(3,1)→(255,103), D(4,2)→(325,61) -->
              <!-- Separating line: x2 = x1 - 1 → (x1=1,x2=0), (x1=4.5,x2=3.5) → screen: (115,145),(360,7) -->
              <!-- Margin lines: x2=x1 (upper), x2=x1-2 (lower) -->
              <!-- Upper margin: x2=x1: (1,1)→(115,103),(3,3)→(255,19) -->
              <line x1="115" y1="103" x2="285" y2="19" stroke="#3b82f6" stroke-width="1" stroke-dasharray="5,3" opacity="0.7"/>
              <!-- Lower margin: x2=x1-2: (2,0)→(185,145),(5,3)→(390,19) clipped -->
              <line x1="185" y1="145" x2="375" y2="61" stroke="#f59e0b" stroke-width="1" stroke-dasharray="5,3" opacity="0.7"/>
              <!-- Separating line: x2=x1-1: (1,0)→(115,145),(4.5,3.5)→(360,7) -->
              <line x1="115" y1="145" x2="360" y2="7" stroke="#ef4444" stroke-width="2.5"/>
              <text x="362" y="10" font-size="9" fill="#ef4444">−x₁+x₂+1=0</text>
              <!-- Margin area shading -->
              <polygon points="115,103 285,19 360,7 185,145" fill="#ef4444" fill-opacity="0.07"/>
              <!-- Data points -->
              <circle cx="115" cy="61" r="9" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
              <text x="115" y="58" text-anchor="middle" font-size="8" fill="#fff">A</text>
              <circle cx="185" cy="19" r="9" fill="#3b82f6" stroke="#fff" stroke-width="2"/>
              <text x="185" y="16" text-anchor="middle" font-size="8" fill="#fff">B</text>
              <!-- Support vectors: C, D on margin boundary; ring indicator -->
              <circle cx="255" cy="103" r="9" fill="#f59e0b" stroke="#1d4ed8" stroke-width="2.5"/>
              <text x="255" y="100" text-anchor="middle" font-size="8" fill="#1d4ed8">C</text>
              <circle cx="255" cy="103" r="14" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2"/>
              <circle cx="325" cy="61" r="9" fill="#f59e0b" stroke="#1d4ed8" stroke-width="2.5"/>
              <text x="325" y="58" text-anchor="middle" font-size="8" fill="#1d4ed8">D</text>
              <circle cx="325" cy="61" r="14" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,2"/>
              <!-- Margin label -->
              <line x1="210" y1="67" x2="248" y2="67" stroke="#64748b" stroke-width="1.5" marker-end="url(#arr2)"/>
              <line x1="210" y1="67" x2="172" y2="67" stroke="#64748b" stroke-width="1.5"/>
              <text x="210" y="80" text-anchor="middle" font-size="9" fill="#64748b">margin = √2</text>
              <!-- Legend -->
              <circle cx="48" cy="157" r="5" fill="#3b82f6"/>
              <text x="57" y="161" font-size="8" fill="#3b82f6">класс +1 (A,B)</text>
              <circle cx="138" cy="157" r="5" fill="#f59e0b"/>
              <text x="147" y="161" font-size="8" fill="#f59e0b">класс −1 (C,D)</text>
              <text x="225" y="161" font-size="8" fill="#f59e0b">○ опорные векторы</text>
            </svg>
            <div class="caption">Красная линия — разделяющая гиперплоскость. Пунктирные линии — границы margin. C и D (обведены кружком) — опорные векторы на margin. Ширина margin = √2 ≈ 1.41.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Разделяющая прямая: −x₁ + x₂ + 1 = 0. Опорные векторы: C(3,1) и D(4,2). Margin = √2 ≈ 1.414. A и B тоже опорные (расстояние √2 с другой стороны).</p>
          </div>
          <div class="lesson-box">
            Жёсткий SVM (hard margin) требует идеального разделения. Мягкий (soft margin, параметр C): допускает нарушения с штрафом C·ξᵢ. Большой C → жёсткий, малый C → мягкий, широкий margin.
          </div>
        `,
      },
      {
        title: 'Эффект параметра C',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как параметр C (штраф за нарушение margin) влияет на границу и обобщение SVM.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>C</th><th>Margin</th><th>Нарушений</th><th>Train Acc</th><th>Val Acc</th><th>Диагноз</th></tr>
              <tr><td>0.001</td><td>Очень широкий</td><td>Много</td><td>78%</td><td>76%</td><td>Underfitting</td></tr>
              <tr><td>0.1</td><td>Широкий</td><td>Несколько</td><td>85%</td><td>84%</td><td>Хорошо</td></tr>
              <tr><td>1</td><td>Средний</td><td>1–2</td><td>88%</td><td>87%</td><td>Оптимум</td></tr>
              <tr><td>10</td><td>Узкий</td><td>0–1</td><td>93%</td><td>86%</td><td>Начало переобуч.</td></tr>
              <tr><td>1000</td><td>Минимальный</td><td>0</td><td>98%</td><td>81%</td><td>Переобучение</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что контролирует C</h4>
            <div class="calc">
              Целевая функция SVM: min (1/2)‖w‖² + C·Σξᵢ<br>
              ‖w‖² — регуляризация (широкий margin)<br>
              C·Σξᵢ — штраф за нарушения (верная классификация)<br><br>
              C → 0: регуляризация доминирует → ignore ошибки → широкий margin<br>
              C → ∞: ошибки нетерпимы → узкий margin → жёсткий SVM
            </div>
            <div class="why">C — аналог 1/λ в Ridge регрессии. Большой C = малая регуляризация.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: геометрический смысл</h4>
            <div class="calc">
              C=0.1: margin = 2/‖w‖ ≈ 2.5 (широкий)<br>
              Несколько точек могут лежать «не той стороне» margin — ξᵢ > 0<br>
              Но штраф 0.1·ξᵢ мал → SVM терпит нарушения<br><br>
              C=1000: margin ≈ 0.08 (узкий)<br>
              SVM пытается классифицировать всё обучение правильно<br>
              Граница изгибается вокруг шумных точек → переобучение
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: выбор оптимального C</h4>
            <div class="calc">
              Метод: grid search + cross-validation<br>
              Сетка: C ∈ [0.001, 0.01, 0.1, 1, 10, 100, 1000]<br>
              Для каждого C: 5-fold CV accuracy<br>
              Выбрать C с максимальным CV accuracy<br>
              Результат: C=1 → CV accuracy 87% (оптимум из таблицы)
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимум C=1 (Val Acc=87%). Малый C — недообучение (широкий margin, много ошибок). Большой C — переобучение (узкий margin, подгонка под шум).</p>
          </div>
          <div class="lesson-box">
            Для RBF ядра нужно одновременно выбирать C и γ: GridSearchCV с логарифмической сеткой. Стандартная сетка: C=[0.1,1,10,100], γ=[0.001,0.01,0.1,1]. Вычислительно дорого для больших датасетов.
          </div>
        `,
      },
      {
        title: 'RBF ядро vs линейное',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить линейное и RBF ядро на нелинейно разделимых данных (два концентрических круга).</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x₁</th><th>x₂</th><th>r = √(x₁²+x₂²)</th><th>Класс</th></tr>
              <tr><td>A</td><td>0.5</td><td>0</td><td>0.5</td><td>Внутр. (+1)</td></tr>
              <tr><td>B</td><td>0</td><td>0.7</td><td>0.7</td><td>Внутр. (+1)</td></tr>
              <tr><td>C</td><td>2</td><td>0</td><td>2.0</td><td>Внешн. (−1)</td></tr>
              <tr><td>D</td><td>0</td><td>2.5</td><td>2.5</td><td>Внешн. (−1)</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: линейное ядро провалится</h4>
            <div class="calc">
              Линейный SVM ищет: w₁x₁ + w₂x₂ + b = 0<br>
              Для любых (w₁, w₂, b) найдутся ошибки:<br>
              Внутренние точки разбросаны по окружности r=0.6<br>
              Внешние — по r=2.2<br>
              Нет прямой, разделяющей два кольца<br>
              Accuracy линейного SVM ≈ 50–60%
            </div>
            <div class="why">Данные линейно неразделимы в (x₁, x₂). Нужно поднять в высшее измерение.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: RBF ядро — неявное расширение признаков</h4>
            <div class="calc">
              RBF: K(x, xᵢ) = exp(−γ‖x−xᵢ‖²)<br>
              При γ=1:<br>
              K(A, C) = exp(−(2−0.5)² − 0²) = exp(−2.25) ≈ 0.105<br>
              K(A, B) = exp(−0.25 − 0.49) = exp(−0.74) ≈ 0.477<br><br>
              RBF неявно проецирует в бесконечномерное пространство<br>
              В этом пространстве круговая граница → линейная гиперплоскость<br>
              Accuracy RBF SVM ≈ 98–100%
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: явный kernel trick через φ(x)</h4>
            <div class="calc">
              Добавим признак r² = x₁² + x₂²<br>
              Новое признаковое пространство: (x₁, x₂, r²)<br><br>
              A(0.5, 0, 0.25), B(0, 0.7, 0.49)<br>
              C(2, 0, 4.00), D(0, 2.5, 6.25)<br><br>
              Теперь разделяем по r² = 1.0:<br>
              r² &lt; 1 → внутренний (+1): A(0.25) ✓, B(0.49) ✓<br>
              r² > 1 → внешний (−1): C(4.0) ✓, D(6.25) ✓<br>
              Линейный SVM в новом пространстве работает идеально!
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Линейный SVM: ~55% accuracy (не справляется). RBF SVM (γ=1, C=1): 100% на этих данных. Ключевая идея kernel trick: вычислять K(x,xᵢ) без явного вычисления φ(x).</p>
          </div>
          <div class="lesson-box">
            Параметр γ контролирует «ширину» RBF. Малый γ → широкое влияние → плавная граница. Большой γ → узкое влияние → сложная, переобученная граница. Выбирать вместе с C через GridSearchCV.
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
    `,

    math: `
      <h3>Primal задача (hard margin)</h3>
      <div class="math-block">$$\\min_{\\mathbf{w}, b} \\frac{1}{2} \\|\\mathbf{w}\\|^2 \\quad \\text{при} \\quad y_i(\\mathbf{w}^T \\mathbf{x}_i + b) \\geq 1$$</div>

      <h3>Soft margin</h3>
      <div class="math-block">$$\\min_{\\mathbf{w}, b, \\xi} \\frac{1}{2} \\|\\mathbf{w}\\|^2 + C \\sum_i \\xi_i$$</div>
      <div class="math-block">$$\\text{при } y_i(\\mathbf{w}^T \\mathbf{x}_i + b) \\geq 1 - \\xi_i, \\quad \\xi_i \\geq 0$$</div>

      <h3>Dual задача</h3>
      <div class="math-block">$$\\max_\\alpha \\sum_i \\alpha_i - \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j K(x_i, x_j)$$</div>
      <div class="math-block">$$\\text{при } 0 \\leq \\alpha_i \\leq C, \\quad \\sum_i \\alpha_i y_i = 0$$</div>

      <h3>Предсказание</h3>
      <div class="math-block">$$f(x) = \\sum_{i \\in SV} \\alpha_i y_i K(x_i, x) + b$$</div>
      <p>Где $SV = \\{i : \\alpha_i > 0\\}$ — опорные векторы.</p>

      <h3>Связь margin и ‖w‖</h3>
      <p>Margin = $\\frac{2}{\\|\\mathbf{w}\\|}$. Минимизация $\\|\\mathbf{w}\\|^2$ = максимизация margin.</p>
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
  },
});
