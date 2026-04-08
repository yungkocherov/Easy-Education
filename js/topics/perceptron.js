/* ==========================================================================
   Perceptron
   ========================================================================== */
App.registerTopic({
  id: 'perceptron',
  category: 'dl',
  title: 'Перцептрон',
  summary: 'Простейшая нейросеть — один нейрон, линейная граница, правило Розенблатта.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, как работает нейрон в мозге. К нему приходят сигналы от множества других нейронов. Каждый сигнал имеет свой <b>вес</b>: один нейрон «убедительнее» другого. Если взвешенная сумма сигналов превысила <b>порог</b> — нейрон «выстреливает», активируется.</p>
        <p>Перцептрон — это простейшая математическая модель нейрона. Получает числа на вход, умножает каждое на вес, суммирует, и если сумма больше порога — выдаёт 1, иначе −1. Простейшая модель принятия бинарного решения.</p>
        <p>Это <b>первый кирпичик</b> нейросетей. Один перцептрон умеет только проводить прямую линию между классами. Но тысячи перцептронов, соединённых слоями — это современные нейросети, которые распознают кошек, переводят тексты и играют в шахматы.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <!-- Input nodes x1, x2 -->
          <circle cx="70" cy="70" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
          <text x="70" y="75" text-anchor="middle" font-size="13" fill="#1e40af" font-weight="600">x₁</text>
          <circle cx="70" cy="140" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
          <text x="70" y="145" text-anchor="middle" font-size="13" fill="#1e40af" font-weight="600">x₂</text>
          <!-- Weight labels on connections -->
          <line x1="92" y1="70" x2="215" y2="98" stroke="#6366f1" stroke-width="2"/>
          <text x="148" y="76" text-anchor="middle" font-size="11" fill="#6366f1" font-weight="600">w₁</text>
          <line x1="92" y1="140" x2="215" y2="112" stroke="#6366f1" stroke-width="2"/>
          <text x="148" y="138" text-anchor="middle" font-size="11" fill="#6366f1" font-weight="600">w₂</text>
          <!-- Summation circle Σ -->
          <circle cx="245" cy="105" r="28" fill="#fef3c7" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="245" y="112" text-anchor="middle" font-size="20" fill="#92400e">Σ</text>
          <!-- Activation block -->
          <rect x="305" y="83" width="80" height="44" rx="8" fill="#ecfdf5" stroke="#10b981" stroke-width="2.5"/>
          <text x="345" y="101" text-anchor="middle" font-size="10" fill="#065f46">activation</text>
          <text x="345" y="117" text-anchor="middle" font-size="10" fill="#065f46">f(z)</text>
          <!-- Arrow Σ → activation -->
          <line x1="273" y1="105" x2="305" y2="105" stroke="#64748b" stroke-width="2" marker-end="url(#arrowP)"/>
          <!-- Output ŷ -->
          <circle cx="450" cy="105" r="22" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
          <text x="450" y="111" text-anchor="middle" font-size="13" fill="#b91c1c" font-weight="600">ŷ</text>
          <!-- Arrow activation → output -->
          <line x1="385" y1="105" x2="428" y2="105" stroke="#64748b" stroke-width="2" marker-end="url(#arrowP)"/>
          <!-- Bias input -->
          <text x="245" y="62" text-anchor="middle" font-size="10" fill="#64748b">+b (bias)</text>
          <line x1="245" y1="67" x2="245" y2="77" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Arrow marker -->
          <defs>
            <marker id="arrowP" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#64748b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">Один нейрон (перцептрон): входы x₁, x₂ умножаются на веса w₁, w₂, суммируются (Σ) с bias b, проходят через функцию активации → предсказание ŷ.</div>
      </div>

      <h3>📜 Историческое значение</h3>
      <p>Перцептрон придумал Фрэнк Розенблатт в <b>1958 году</b>. Это была первая обучаемая модель, вдохновлённая биологическими нейронами.</p>
      <p>В 60-х годах перцептрон был сенсацией: считали, что до искусственного интеллекта осталось несколько лет. Но в 1969 году Минский и Паперт показали фундаментальное ограничение: перцептрон не может решить задачу XOR. Это привело к <b>«первой зиме нейросетей»</b> — финансирование упало, исследования замерли на десятилетие.</p>
      <p>В 1986 году было изобретено <span class="term" data-tip="Backpropagation. Алгоритм обратного распространения ошибки. Позволяет обучать многослойные нейросети, используя правило цепочки.">обратное распространение ошибки</span>, и многослойные сети перцептронов стали снова актуальны. Сегодня перцептрон — базовая единица в любой нейросети.</p>

      <h3>🏗️ Устройство перцептрона</h3>
      <p>У перцептрона есть входы $x_1, \\ldots, x_p$ и для каждого — свой <b>вес</b> $w_1, \\ldots, w_p$. Плюс свободный член $w_0$ (bias).</p>

      <p>Перцептрон работает в два этапа:</p>
      <ol>
        <li><b>Взвешенная сумма:</b> $z = w_0 + w_1 x_1 + w_2 x_2 + \\ldots + w_p x_p$.</li>
        <li><b>Активация:</b> если $z \\geq 0$, выдаём +1 (класс «да»). Иначе −1 (класс «нет»).</li>
      </ol>

      <div class="math-block">$$\\hat{y} = \\text{sign}(w_0 + w_1 x_1 + w_2 x_2 + \\ldots + w_p x_p)$$</div>

      <p>Функция <b>sign</b> — это пороговая функция активации. Современные нейроны используют другие (sigmoid, ReLU), но идея та же.</p>

      <div class="key-concept">
        <div class="kc-label">Геометрическая интуиция</div>
        <p>Перцептрон проводит <b>прямую</b> (или гиперплоскость в высоких размерностях): $w_0 + w_1 x_1 + w_2 x_2 = 0$. Точки с одной стороны — класс +1, с другой — класс −1. Обучение = подбор правильной прямой.</p>
      </div>

      <h3>🎓 Правило обучения Розенблатта</h3>
      <p>Алгоритм обновления весов простой и красивый:</p>
      <ol>
        <li>Инициализируем веса нулями (или маленькими случайными).</li>
        <li>Для каждого примера $(x_i, y_i)$:
          <ul>
            <li>Считаем предсказание $\\hat{y}_i$.</li>
            <li>Если <b>правильно</b> — ничего не делаем.</li>
            <li>Если <b>ошиблись</b> — корректируем веса.</li>
          </ul>
        </li>
        <li>Повторяем, пока не перестанем ошибаться (или долго).</li>
      </ol>

      <p>Формула коррекции:</p>
      <div class="math-block">$$w \\gets w + \\eta \\cdot (y_i - \\hat{y}_i) \\cdot x_i$$</div>

      <p>Или эквивалентно:</p>
      <ul>
        <li>Ожидали +1, предсказали −1 → <b>увеличиваем</b> веса: $w \\gets w + \\eta \\cdot x$.</li>
        <li>Ожидали −1, предсказали +1 → <b>уменьшаем</b> веса: $w \\gets w - \\eta \\cdot x$.</li>
      </ul>

      <p><b>Интуиция:</b> если ошиблись в сторону «−1 вместо +1», значит $w^T x$ было слишком маленьким. Нужно его увеличить — для этого добавляем $x$ к $w$.</p>

      <h3>💡 Теорема сходимости</h3>
      <p>Это одна из красивейших теорем машинного обучения. Если данные <b>линейно разделимы</b> (существует прямая, которая правильно разделяет классы), то перцептрон <b>гарантированно</b> найдёт разделяющую прямую за <b>конечное</b> число итераций.</p>
      <p>Более того, число ошибок ограничено: $\\leq (R/\\gamma)^2$, где $R$ — максимальная длина $x$, $\\gamma$ — минимальный margin.</p>

      <h3>🎯 XOR-проблема — граница возможностей</h3>
      <p>Есть данные, которые перцептрон <b>не может</b> классифицировать:</p>
      <pre>(0, 0) → 0
(0, 1) → 1
(1, 0) → 1
(1, 1) → 0</pre>

      <p>Это функция XOR. Нарисуй точки: класс 0 в углах (0,0) и (1,1), класс 1 в (0,1) и (1,0). <b>Ни одна прямая</b> не может разделить эти классы. А перцептрон умеет только прямые.</p>

      <p>Вывод: перцептрон — <b>линейный</b> классификатор. Работает только когда данные линейно разделимы.</p>

      <p><b>Решение:</b> многослойный перцептрон (MLP). Несколько слоёв нелинейно комбинируют признаки, выучивая сложные формы границ. Это и есть <b>нейронная сеть</b>.</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Максимально простой алгоритм.</li>
        <li>Гарантированная сходимость при линейной разделимости.</li>
        <li>Онлайн-обучение (можно добавлять примеры постепенно).</li>
        <li>Основа для понимания нейросетей.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Только линейная граница</b> — нельзя XOR, круги, спирали.</li>
        <li>Может бесконечно колебаться, если данные <b>не разделимы</b>.</li>
        <li>Не выдаёт вероятности, только +1/−1.</li>
        <li>Нет регуляризации.</li>
        <li>Результат зависит от порядка примеров.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Перцептрон — это нейросеть»</b> — это один нейрон. Нейросеть — много соединённых.</li>
        <li><b>«Если не сходится — данные плохие»</b> — может быть, они просто не линейно разделимы.</li>
        <li><b>«Перцептрон устарел»</b> — сама идея лежит в основе всех нейросетей.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: связь с другими моделями</summary>
        <div class="deep-dive-body">
          <p>Перцептрон связан со многими моделями:</p>
          <ul>
            <li><b>Логистическая регрессия</b> = перцептрон с сигмоидной активацией вместо sign.</li>
            <li><b>SVM</b> = перцептрон, который ищет прямую с <b>максимальным margin</b>.</li>
            <li><b>Нейросеть</b> = много перцептронов в нескольких слоях.</li>
            <li><b>Kernel perceptron</b> = перцептрон с ядерным трюком для нелинейных границ.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Pocket algorithm</summary>
        <div class="deep-dive-body">
          <p>Обычный перцептрон на <b>неразделимых</b> данных зацикливается — колеблется между весами. Pocket algorithm решает эту проблему:</p>
          <ul>
            <li>Запоминает веса с <b>наименьшим</b> числом ошибок, увиденные до сих пор («кладёт в карман»).</li>
            <li>Обновляет их только когда находит лучшие.</li>
          </ul>
          <p>Результат: разумное решение даже для неразделимых данных.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: от перцептрона к LLM</summary>
        <div class="deep-dive-body">
          <p>Эволюция от перцептрона к современным моделям:</p>
          <ol>
            <li><b>1958</b> — Перцептрон (Розенблатт).</li>
            <li><b>1986</b> — MLP + Backpropagation (Rumelhart et al.).</li>
            <li><b>1998</b> — LeNet-5 (свёрточные сети, LeCun).</li>
            <li><b>2012</b> — AlexNet (deep learning революция).</li>
            <li><b>2014</b> — Seq2seq, Attention.</li>
            <li><b>2017</b> — Transformer ("Attention is All You Need").</li>
            <li><b>2022+</b> — GPT-4, Claude, LLMs.</li>
          </ol>
          <p>Всё это развитие идеи перцептрона: нейрон → слои → глубокие сети → внимание.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Логистическая регрессия</b> — «гладкий» перцептрон с вероятностями.</li>
        <li><b>SVM</b> — максимально разделяющий перцептрон.</li>
        <li><b>Нейронные сети</b> — много перцептронов в слоях.</li>
        <li><b>Градиентный спуск</b> — обобщение правила Розенблатта.</li>
      </ul>
    `,

    examples: [
      {
        title: 'AND: обучение перцептрона',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучить перцептрон функции AND. Данные: метки $+1$ (AND=1) и $-1$ (AND=0). Начальные веса $w_0 = w_1 = w_2 = 0$ (bias $w_0$). $\\eta = 1$. Правило: $w \\gets w + \\eta \\cdot y_i \\cdot x_i$ при ошибке.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <defs>
                <marker id="and-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                </marker>
              </defs>
              <!-- Axes -->
              <line x1="50" y1="130" x2="310" y2="130" stroke="#64748b" stroke-width="1.5" marker-end="url(#and-arr)"/>
              <line x1="50" y1="130" x2="50" y2="15" stroke="#64748b" stroke-width="1.5" marker-end="url(#and-arr)"/>
              <text x="315" y="134" font-size="10" fill="#64748b">x₁</text>
              <text x="42" y="12" font-size="10" fill="#64748b">x₂</text>
              <!-- Tick marks and labels -->
              <line x1="50" y1="130" x2="50" y2="125" stroke="#64748b" stroke-width="1"/>
              <text x="47" y="140" font-size="9" fill="#64748b">0</text>
              <line x1="170" y1="130" x2="170" y2="125" stroke="#64748b" stroke-width="1"/>
              <text x="167" y="140" font-size="9" fill="#64748b">1</text>
              <line x1="50" y1="130" x2="55" y2="130" stroke="#64748b" stroke-width="1"/>
              <line x1="50" y1="50" x2="55" y2="50" stroke="#64748b" stroke-width="1"/>
              <text x="35" y="54" font-size="9" fill="#64748b">1</text>
              <!-- Points: (0,0)→-1 circle, (0,1)→-1 circle, (1,0)→-1 circle, (1,1)→+1 filled -->
              <!-- x=50+x1*120, y=130-x2*80 -->
              <circle cx="50" cy="130" r="7" fill="none" stroke="#3b82f6" stroke-width="2"/>
              <text x="57" y="125" font-size="9" fill="#3b82f6">(0,0)</text>
              <circle cx="50" cy="50" r="7" fill="none" stroke="#3b82f6" stroke-width="2"/>
              <text x="57" y="45" font-size="9" fill="#3b82f6">(0,1)</text>
              <circle cx="170" cy="130" r="7" fill="none" stroke="#3b82f6" stroke-width="2"/>
              <text x="177" y="125" font-size="9" fill="#3b82f6">(1,0)</text>
              <circle cx="170" cy="50" r="8" fill="#ef4444" stroke="#ef4444" stroke-width="2"/>
              <text x="177" y="45" font-size="9" fill="#ef4444">(1,1) AND=1</text>
              <!-- Separating line: x1+x2=1.5, passes through (1.5,0)→(280,130) and (0,1.5)→(50,-40) approx -->
              <!-- at x1=0: x2=1.5 → y=130-1.5*80=-40 (off screen top) -->
              <!-- at x2=0: x1=1.5 → x=50+1.5*120=230 -->
              <!-- at x1=0.5: x2=1 → draw from (80,50) to (260,130) is better -->
              <!-- line: x1+x2=1.5. At x1=0.5,x2=1: px=(110,50). At x1=1.5,x2=0: px=(230,130) -->
              <line x1="110" y1="50" x2="250" y2="130" stroke="#10b981" stroke-width="2" stroke-dasharray="7,3"/>
              <text x="240" y="50" font-size="9" fill="#10b981">x₁+x₂=1.5</text>
              <!-- Legend -->
              <circle cx="330" cy="50" r="6" fill="none" stroke="#3b82f6" stroke-width="2"/>
              <text x="340" y="54" font-size="9" fill="#3b82f6">AND=0</text>
              <circle cx="330" cy="70" r="6" fill="#ef4444" stroke="#ef4444" stroke-width="2"/>
              <text x="340" y="74" font-size="9" fill="#ef4444">AND=1</text>
              <line x1="320" y1="90" x2="345" y2="90" stroke="#10b981" stroke-width="2" stroke-dasharray="5,2"/>
              <text x="350" y="94" font-size="9" fill="#10b981">граница</text>
            </svg>
            <div class="caption">AND в 2D: три класса 0 (круги) и один класс 1 (закрашен). Прямая x₁+x₂=1.5 разделяет их — данные линейно разделимы.</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>$(x_1, x_2)$</th><th>Метка $y$</th><th>$x^{(\\text{augm})}$ с bias</th></tr>
              <tr><td>(0, 0)</td><td>−1</td><td>(1, 0, 0)</td></tr>
              <tr><td>(0, 1)</td><td>−1</td><td>(1, 0, 1)</td></tr>
              <tr><td>(1, 0)</td><td>−1</td><td>(1, 1, 0)</td></tr>
              <tr><td>(1, 1)</td><td>+1</td><td>(1, 1, 1)</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Эпоха 1, точка (0,0) → −1</h4>
            <div class="calc">$w = (0,0,0)$, $z = 0 \\cdot 1 + 0 \\cdot 0 + 0 \\cdot 0 = 0$, $\\hat{y} = \\text{sign}(0) = -1$<br>Предсказание $-1$ = метка $-1$ → <b>правильно</b>, обновление не нужно</div>
            <div class="why">Нет ошибки → веса не меняются. $w = (0,0,0)$.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Эпоха 1, точка (0,1) → −1</h4>
            <div class="calc">$z = 0+0+0=0$, $\\hat{y}=-1$ = метка $-1$ → <b>правильно</b></div>
            <div class="why">$w = (0,0,0)$ — не меняется.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Эпоха 1, точка (1,0) → −1</h4>
            <div class="calc">$z = 0+0+0=0$, $\\hat{y}=-1$ = метка $-1$ → <b>правильно</b></div>
            <div class="why">$w = (0,0,0)$.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Эпоха 1, точка (1,1) → +1</h4>
            <div class="calc">$z = 0 \\cdot 1 + 0 \\cdot 1 + 0 \\cdot 1 = 0$, $\\hat{y} = \\text{sign}(0) = -1 \\neq +1$ → <b>ошибка!</b><br>$w \\gets w + 1 \\cdot (+1) \\cdot (1,1,1) = (0,0,0) + (1,1,1) = (1,1,1)$</div>
            <div class="why">Ошибались: хотели $+1$, сказали $-1$. $z$ был слишком маленьким → добавляем $x$ к $w$, чтобы в следующий раз $z$ стал больше.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Эпоха 2: проверяем с $w=(1,1,1)$</h4>
            <div class="calc">
              $(0,0)$: $z = 1 \\cdot 1 + 1 \\cdot 0 + 1 \\cdot 0 = 1$, $\\hat{y}=+1 \\neq -1$ → ошибка. $w \\gets (1,1,1) - (1,0,0) = (0,1,1)$<br>
              $(0,1)$: $z = 0+0+1=1 > 0$, $\\hat{y}=+1 \\neq -1$ → ошибка. $w \\gets (0,1,1) - (1,0,1) = (-1,1,0)$<br>
              $(1,0)$: $z = -1+1+0=0$, $\\hat{y}=-1$ = метка $-1$ → ок<br>
              $(1,1)$: $z = -1+1+0=0$, $\\hat{y}=-1 \\neq +1$ → ошибка. $w \\gets (-1,1,0) + (1,1,1) = (0,2,1)$
            </div>
            <div class="why">Веса: $(0, 2, 1)$. Всё ещё не сошлись — нужно продолжать.</div>
          </div>

          <div class="step" data-step="6">
            <h4>После нескольких эпох: финальные веса</h4>
            <div class="calc">Перцептрон сходится к весам вида $w = (-1{,}5,\, 1,\, 1)$ (или пропорциональным)</div>
            <div class="calc">
              $(0,0)$: $\\text{sign}(-1{,}5+0+0) = \\text{sign}(-1{,}5) = -1$ ✓<br>
              $(0,1)$: $\\text{sign}(-1{,}5+0+1) = \\text{sign}(-0{,}5) = -1$ ✓<br>
              $(1,0)$: $\\text{sign}(-1{,}5+1+0) = \\text{sign}(-0{,}5) = -1$ ✓<br>
              $(1,1)$: $\\text{sign}(-1{,}5+1+1) = \\text{sign}(0{,}5) = +1$ ✓
            </div>
            <div class="why">Граница решения: $-1{,}5 + x_1 + x_2 = 0$, то есть $x_1 + x_2 = 1{,}5$ — прямая, разделяющая $(1,1)$ от остальных. Геометрически это верно!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Перцептрон выучивает AND-функцию за несколько эпох. Граница решения: $w_0 + w_1 x_1 + w_2 x_2 = 0$, где $w = (-1{,}5, 1, 1)$. Данные линейно разделимы → теорема Новикова гарантирует сходимость.</p>
          </div>

          <div class="lesson-box">
            <b>Интуиция правила обновления:</b> при ошибке «+1 вместо −1» $z$ был слишком большим — вычитаем $x$. При ошибке «−1 вместо +1» $z$ был слишком маленьким — добавляем $x$. Правило именно это и делает: $w \\gets w + y \\cdot x$.
          </div>
        `
      },
      {
        title: 'OR функция',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучить перцептрон функции OR: $y=+1$ если хотя бы один из входов равен 1, иначе $y=-1$. Стартуем с $w=(-0{,}5, 0, 0)$ (маленький отрицательный bias — хорошая инициализация для OR), $\\eta = 1$.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>$(x_1, x_2)$</th><th>OR = $y$</th><th>$z = -0{,}5 + w_1 x_1 + w_2 x_2$</th><th>$\\hat{y}$</th><th>Ошибка?</th></tr>
              <tr><td>(0, 0)</td><td>−1</td><td>−0,5</td><td>−1</td><td>Нет</td></tr>
              <tr><td>(0, 1)</td><td>+1</td><td>−0,5</td><td>−1</td><td>Да</td></tr>
              <tr><td>(1, 0)</td><td>+1</td><td>−0,5</td><td>−1</td><td>Да</td></tr>
              <tr><td>(1, 1)</td><td>+1</td><td>−0,5</td><td>−1</td><td>Да</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Инициализация и первая точка</h4>
            <div class="calc">$w = (-0{,}5, 0, 0)$. Точка $(0,0) \\to -1$: $z=-0{,}5$, $\\hat{y}=-1$ = метка → ок</div>
            <div class="why">Bias $-0{,}5$ обеспечивает правильное предсказание «оба нуля → нет» с самого начала.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Точка (0,1) → +1: ошибка</h4>
            <div class="calc">$z = -0{,}5 + 0 \\cdot 0 + 0 \\cdot 1 = -0{,}5$, $\\hat{y}=-1 \\neq +1$<br>$w \\gets (-0{,}5, 0, 0) + 1 \\cdot (+1) \\cdot (1, 0, 1) = (0{,}5, 0, 1)$</div>
            <div class="why">Добавляем вектор признаков: увеличиваем $w_0$ (bias) и $w_2$ (вес для $x_2$). Теперь $x_2=1$ сможет перевесить bias.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Точка (1,0) → +1: проверяем</h4>
            <div class="calc">$w=(0{,}5, 0, 1)$: $z = 0{,}5 + 0 \\cdot 1 + 1 \\cdot 0 = 0{,}5 > 0$, $\\hat{y}=+1$ — но ждём верный ответ $+1$ → <b>правильно!</b></div>
            <div class="why">Bias $+0{,}5$ теперь слишком большой — точка $(0,0)$ может дать ошибку. Так перцептрон «жонглирует» разными точками.</div>
          </div>

          <div class="step" data-step="4">
            <h4>После нескольких эпох: финальные веса</h4>
            <div class="calc">Оптимальное решение для OR: $w = (-0{,}5, 1, 1)$ или эквивалентное</div>
            <div class="calc">
              $(0,0)$: $\\text{sign}(-0{,}5+0+0)=-1$ ✓<br>
              $(0,1)$: $\\text{sign}(-0{,}5+0+1)=\\text{sign}(0{,}5)=+1$ ✓<br>
              $(1,0)$: $\\text{sign}(-0{,}5+1+0)=\\text{sign}(0{,}5)=+1$ ✓<br>
              $(1,1)$: $\\text{sign}(-0{,}5+1+1)=\\text{sign}(1{,}5)=+1$ ✓
            </div>
            <div class="why">Граница: $x_1 + x_2 = 0{,}5$ — наклонная прямая, отрезающая только угол $(0,0)$. Именно это нужно для OR.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Сравнение AND и OR</h4>
            <p>Обе функции линейно разделимы, но границы разные:</p>
            <div class="calc">AND: $x_1 + x_2 = 1{,}5$ (отрезает только $(1,1)$ в классе $+1$)<br>OR: $x_1 + x_2 = 0{,}5$ (отрезает только $(0,0)$ в классе $-1$)</div>
            <div class="why">Чем «шире» граница между классами, тем быстрее сходится перцептрон. Для OR — больший запас, сходится быстрее. Это связано с понятием margin в SVM.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Перцептрон выучивает OR. Решение $w=(-0{,}5, 1, 1)$: граница $x_1 + x_2 = 0{,}5$. Отличие от AND: только в bias — для OR он меньше ($-0{,}5$ vs $-1{,}5$), что отражает разную «строгость» порога.</p>
          </div>

          <div class="lesson-box">
            <b>Ключевое наблюдение:</b> AND и OR различаются только значением bias $w_0$. Веса $w_1 = w_2 = 1$ одинаковы! Bias — это «порог активации»: насколько «убедительным» должен быть суммарный сигнал.
          </div>
        `
      },
      {
        title: 'XOR: почему не работает',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, что перцептрон <b>не может</b> выучить XOR — ни при каких весах. XOR: $y=+1$ если ровно один вход равен 1, иначе $y=-1$.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <defs>
                <marker id="xor-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                </marker>
              </defs>
              <!-- Axes -->
              <line x1="50" y1="130" x2="310" y2="130" stroke="#64748b" stroke-width="1.5" marker-end="url(#xor-arr)"/>
              <line x1="50" y1="130" x2="50" y2="15" stroke="#64748b" stroke-width="1.5" marker-end="url(#xor-arr)"/>
              <text x="315" y="134" font-size="10" fill="#64748b">x₁</text>
              <text x="42" y="12" font-size="10" fill="#64748b">x₂</text>
              <text x="47" y="140" font-size="9" fill="#64748b">0</text>
              <line x1="170" y1="130" x2="170" y2="125" stroke="#64748b" stroke-width="1"/>
              <text x="167" y="140" font-size="9" fill="#64748b">1</text>
              <line x1="50" y1="50" x2="55" y2="50" stroke="#64748b" stroke-width="1"/>
              <text x="35" y="54" font-size="9" fill="#64748b">1</text>
              <!-- XOR points: (0,0)→0 circle, (0,1)→1 filled, (1,0)→1 filled, (1,1)→0 circle -->
              <circle cx="50" cy="130" r="8" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
              <text x="57" y="126" font-size="9" fill="#3b82f6">(0,0) XOR=0</text>
              <circle cx="50" cy="50" r="8" fill="#ef4444" stroke="#ef4444" stroke-width="2"/>
              <text x="57" y="46" font-size="9" fill="#ef4444">(0,1) XOR=1</text>
              <circle cx="170" cy="130" r="8" fill="#ef4444" stroke="#ef4444" stroke-width="2"/>
              <text x="177" y="126" font-size="9" fill="#ef4444">(1,0) XOR=1</text>
              <circle cx="170" cy="50" r="8" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
              <text x="177" y="46" font-size="9" fill="#3b82f6">(1,1) XOR=0</text>
              <!-- No line possible — show crossed-out attempt lines -->
              <line x1="60" y1="140" x2="260" y2="40" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
              <line x1="50" y1="90" x2="250" y2="90" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
              <line x1="110" y1="140" x2="110" y2="20" stroke="#64748b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.5"/>
              <!-- "no line" label -->
              <text x="210" y="100" font-size="10" fill="#ef4444" font-weight="600">ни одна</text>
              <text x="210" y="113" font-size="10" fill="#ef4444" font-weight="600">прямая</text>
              <text x="210" y="126" font-size="10" fill="#ef4444" font-weight="600">не делит!</text>
              <!-- Legend -->
              <circle cx="330" cy="50" r="6" fill="none" stroke="#3b82f6" stroke-width="2"/>
              <text x="340" y="54" font-size="9" fill="#3b82f6">XOR=0</text>
              <circle cx="330" cy="70" r="6" fill="#ef4444" stroke="#ef4444" stroke-width="2"/>
              <text x="340" y="74" font-size="9" fill="#ef4444">XOR=1</text>
            </svg>
            <div class="caption">XOR в 2D: класс 0 — углы (0,0) и (1,1); класс 1 — углы (0,1) и (1,0). Никакая прямая не разделит их — данные нелинейно разделимы.</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>$(x_1, x_2)$</th><th>XOR = $y$</th><th>Нужно</th></tr>
              <tr><td>(0, 0)</td><td>0 → $y=-1$</td><td>$w_0 < 0$</td></tr>
              <tr><td>(0, 1)</td><td>1 → $y=+1$</td><td>$w_0 + w_2 > 0$</td></tr>
              <tr><td>(1, 0)</td><td>1 → $y=+1$</td><td>$w_0 + w_1 > 0$</td></tr>
              <tr><td>(1, 1)</td><td>0 → $y=-1$</td><td>$w_0 + w_1 + w_2 < 0$</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Система неравенств из условий правильной классификации</h4>
            <p>Перцептрон правильно классифицирует, если $y_i \\cdot (w_0 + w_1 x_{i1} + w_2 x_{i2}) > 0$:</p>
            <div class="calc">
              (i) $(0,0) \\to -1$: &nbsp; $-1 \\cdot w_0 > 0$ &nbsp; ⟹ &nbsp; $w_0 < 0$<br>
              (ii) $(0,1) \\to +1$: &nbsp; $+(w_0 + w_2) > 0$ &nbsp; ⟹ &nbsp; $w_0 + w_2 > 0$<br>
              (iii) $(1,0) \\to +1$: &nbsp; $+(w_0 + w_1) > 0$ &nbsp; ⟹ &nbsp; $w_0 + w_1 > 0$<br>
              (iv) $(1,1) \\to -1$: &nbsp; $-(w_0 + w_1 + w_2) > 0$ &nbsp; ⟹ &nbsp; $w_0 + w_1 + w_2 < 0$
            </div>
            <div class="why">Это четыре неравенства. Если система несовместна — перцептрон невозможен.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Сложим неравенства (ii) и (iii)</h4>
            <div class="calc">$(w_0 + w_2) + (w_0 + w_1) > 0 + 0$<br>$2w_0 + w_1 + w_2 > 0$ &nbsp; — назовём это <b>(A)</b></div>
            <div class="why">Из условий на «одиночные единицы» следует, что сумма $2w_0 + w_1 + w_2$ должна быть строго положительной.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Сложим неравенства (i) и (iv)</h4>
            <div class="calc">$w_0 < 0$ &nbsp; и &nbsp; $w_0 + w_1 + w_2 < 0$<br>Складываем: $2w_0 + w_1 + w_2 < 0$ &nbsp; — назовём это <b>(B)</b></div>
            <div class="why">Из условий на «чётные» точки (0 единиц и 2 единицы) следует, что та же сумма строго отрицательна.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Противоречие</h4>
            <div class="calc">(A): $2w_0 + w_1 + w_2 > 0$<br>(B): $2w_0 + w_1 + w_2 < 0$</div>
            <div class="why">Одна и та же величина не может быть одновременно положительной и отрицательной. <b>Противоречие!</b> Значит, система неравенств несовместна, и линейного разделителя не существует.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Геометрическая интерпретация</h4>
            <p>Нарисуем 4 точки XOR. Классы: $\{(0,0),\,(1,1)\} \\to -1$ и $\{(0,1),\,(1,0)\} \\to +1$.</p>
            <div class="calc">
              Попытка 1: прямая $x_1 + x_2 = 1$ — делит (0,0) от (0,1),(1,0), но (1,1) тоже попадает в класс $+1$ ✗<br>
              Попытка 2: прямая $x_1 - x_2 = 0$ — делит (0,1),(0,0) от (1,0),(1,1) ✗<br>
              Попытка 3: любая прямая — проверь сам: $(0,0)$ и $(1,1)$ всегда окажутся «по разные стороны» от $(0,1)$ и $(1,0)$
            </div>
            <div class="why">XOR — классический пример нелинейно разделимых данных. Это был «гвоздь в крышку гроба» первых нейросетей в 1969 году (Минский и Паперт).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Ни при каких весах перцептрон не классифицирует XOR правильно — это математически доказано. Нужен хотя бы <b>один скрытый слой</b>: тогда сеть 2→2→1 решает XOR, выучив нелинейную границу.</p>
          </div>

          <div class="lesson-box">
            <b>Историческая важность:</b> эта демонстрация в 1969 году вызвала первую «зиму ИИ». Но она же дала толчок к разработке многослойных сетей и алгоритма backpropagation (1986) — который и решил XOR, обучив скрытый слой формировать нелинейные признаки.
          </div>
        `
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: обучение перцептрона</h3>
        <p>Посмотри, как меняется граница на каждом шаге. Клик по полю — добавить точку.</p>
        <div class="sim-container">
          <div class="sim-controls" id="perc-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="perc-step">▶ 1 проход</button>
            <button class="btn" id="perc-train">⏩ Обучить до сходимости</button>
            <button class="btn secondary" id="perc-reset">↺ Сбросить веса</button>
            <button class="btn secondary" id="perc-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="perc-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="perc-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#perc-controls');
        const cSep = App.makeControl('range', 'perc-sep', 'Разделимость', { min: 0.5, max: 5, step: 0.1, value: 2 });
        const cN = App.makeControl('range', 'perc-n', 'Точек на класс', { min: 10, max: 80, step: 5, value: 30 });
        const cLR = App.makeControl('range', 'perc-lr', 'η', { min: 0.05, max: 1, step: 0.05, value: 0.5 });
        [cSep, cN, cLR].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#perc-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let w = [0, 0, 0]; // w0, w1, w2 (bias)
        let epoch = 0;
        let errors = 0;

        function genData() {
          const sep = +cSep.input.value;
          const n = +cN.input.value;
          points = [];
          for (let i = 0; i < n; i++) {
            points.push({ x: App.Util.randn(-sep, 1), y: App.Util.randn(-sep, 1), cls: -1 });
            points.push({ x: App.Util.randn(sep, 1), y: App.Util.randn(sep, 1), cls: 1 });
          }
          w = [0, 0, 0];
          epoch = 0; errors = 0;
          draw();
        }

        function sign(z) { return z >= 0 ? 1 : -1; }

        function oneEpoch() {
          const lr = +cLR.input.value;
          let err = 0;
          const shuffled = App.Util.shuffle(points);
          shuffled.forEach(p => {
            const z = w[0] + w[1] * p.x + w[2] * p.y;
            const pred = sign(z);
            if (pred !== p.cls) {
              w[0] += lr * p.cls;
              w[1] += lr * p.cls * p.x;
              w[2] += lr * p.cls * p.y;
              err++;
            }
          });
          errors = err;
          epoch++;
          draw();
          return err;
        }

        function trainTillConverge() {
          for (let i = 0; i < 200; i++) {
            if (oneEpoch() === 0) break;
          }
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          const xMin = -6, xMax = 6, yMin = -6, yMax = 6;
          const toCanvas = (x, y) => [((x - xMin) / (xMax - xMin)) * W, ((yMax - y) / (yMax - yMin)) * H];

          ctx.clearRect(0, 0, W, H);
          // граница: w0 + w1*x + w2*y = 0
          // заливка
          const step = 10;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = yMax - (py / H) * (yMax - yMin);
              const z = w[0] + w[1] * x + w[2] * y;
              ctx.fillStyle = z >= 0 ? 'rgba(59,130,246,0.15)' : 'rgba(239,68,68,0.15)';
              ctx.fillRect(px, py, step, step);
            }
          }
          // линия
          if (Math.abs(w[2]) > 1e-6) {
            const y1 = -(w[0] + w[1] * xMin) / w[2];
            const y2 = -(w[0] + w[1] * xMax) / w[2];
            const [x1c, y1c] = toCanvas(xMin, y1);
            const [x2c, y2c] = toCanvas(xMax, y2);
            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x1c, y1c);
            ctx.lineTo(x2c, y2c);
            ctx.stroke();
          }
          // точки
          points.forEach(p => {
            ctx.fillStyle = p.cls === 1 ? '#3b82f6' : '#ef4444';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            const [cx, cy] = toCanvas(p.x, p.y);
            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          container.querySelector('#perc-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Эпоха</div><div class="stat-value">${epoch}</div></div>
            <div class="stat-card"><div class="stat-label">Ошибок</div><div class="stat-value">${errors}</div></div>
            <div class="stat-card"><div class="stat-label">w₀ (bias)</div><div class="stat-value">${App.Util.round(w[0], 2)}</div></div>
            <div class="stat-card"><div class="stat-label">w₁</div><div class="stat-value">${App.Util.round(w[1], 2)}</div></div>
            <div class="stat-card"><div class="stat-label">w₂</div><div class="stat-value">${App.Util.round(w[2], 2)}</div></div>
          `;
        }

        [cSep, cN].forEach(c => c.input.addEventListener('change', genData));
        container.querySelector('#perc-step').onclick = oneEpoch;
        container.querySelector('#perc-train').onclick = trainTillConverge;
        container.querySelector('#perc-reset').onclick = () => { w = [0, 0, 0]; epoch = 0; errors = 0; draw(); };
        container.querySelector('#perc-regen').onclick = genData;

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    python: `
      <h3>Перцептрон на Python</h3>
      <p>Реализуем перцептрон вручную на numpy (10 строк), затем используем sklearn. Проверяем AND и XOR.</p>

      <h4>1. Ручная реализация перцептрона на numpy</h4>
      <pre><code>import numpy as np

class Perceptron:
    def __init__(self, lr=0.1, n_epochs=100):
        self.lr = lr
        self.n_epochs = n_epochs

    def fit(self, X, y):
        # Инициализируем веса нулями (+ смещение как первый вес)
        self.w = np.zeros(X.shape[1] + 1)
        for epoch in range(self.n_epochs):
            errors = 0
            for xi, yi in zip(X, y):
                xi_aug = np.r_[1, xi]              # добавляем bias = 1
                pred   = int(self.w @ xi_aug >= 0) # шаговая функция активации
                delta  = self.lr * (yi - pred)     # правило обновления перцептрона
                self.w += delta * xi_aug            # обновляем веса
                errors += int(delta != 0)
            if errors == 0:
                print(f"Сошлось на эпохе {epoch+1}"); break

    def predict(self, X):
        return (np.c_[np.ones(len(X)), X] @ self.w >= 0).astype(int)

# Данные для логического AND
X_and = np.array([[0,0],[0,1],[1,0],[1,1]])
y_and = np.array([0, 0, 0, 1])            # AND: истина только 1 и 1

p = Perceptron(lr=0.1, n_epochs=50)
p.fit(X_and, y_and)
print("AND predictions:", p.predict(X_and))   # [0 0 0 1] — верно!

# XOR — линейно неразделим, перцептрон не справится
X_xor = np.array([[0,0],[0,1],[1,0],[1,1]])
y_xor = np.array([0, 1, 1, 0])            # XOR: истина, когда биты разные

p_xor = Perceptron(lr=0.1, n_epochs=100)
p_xor.fit(X_xor, y_xor)
print("XOR predictions:", p_xor.predict(X_xor))  # НЕ [0 1 1 0] — провал!
</code></pre>

      <h4>2. sklearn: Perceptron — промышленная реализация</h4>
      <pre><code>from sklearn.linear_model import Perceptron
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

# Генерируем линейно разделимые данные
X, y = make_classification(n_samples=300, n_features=2, n_redundant=0,
                            n_clusters_per_class=1, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Обучаем перцептрон sklearn
clf = Perceptron(max_iter=100, eta0=0.1, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2%}")
print(f"Веса: {clf.coef_[0]}")
print(f"Bias: {clf.intercept_[0]:.4f}")
</code></pre>

      <h4>3. Визуализация: AND vs XOR — почему XOR невозможен</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
X = np.array([[0,0],[0,1],[1,0],[1,1]])

for ax, (y, title) in zip(axes, [
    (np.array([0,0,0,1]), 'AND (линейно разделим)'),
    (np.array([0,1,1,0]), 'XOR (НЕ разделим)')
]):
    colors = ['red' if yi == 0 else 'blue' for yi in y]
    ax.scatter(X[:,0], X[:,1], c=colors, s=200, zorder=5)
    # Подписи точек
    for xi, yi in zip(X, y):
        ax.annotate(str(yi), xi, textcoords="offset points",
                    xytext=(8, 5), fontsize=12)
    # Разделяющая прямая для AND: w1*x + w2*y + b = 0
    if title.startswith('AND'):
        xline = np.linspace(-0.5, 1.5, 100)
        ax.plot(xline, 1.5 - xline, 'g--', label='граница решения')
        ax.legend()
    ax.set_xlim(-0.5, 1.5); ax.set_ylim(-0.5, 1.5)
    ax.set_title(title); ax.grid(True, alpha=0.3)
    ax.set_xlabel('x₁'); ax.set_ylabel('x₂')

plt.tight_layout(); plt.show()
# Вывод: XOR требует нелинейной границы → нужна нейросеть (MLP)
</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Исторический интерес</b> — первая обучаемая модель.</li>
        <li><b>Фундамент нейросетей</b> — нейрон в любой сети это и есть перцептрон с нелинейностью.</li>
        <li><b>Линейные классификаторы</b> — онлайн-обучение, потоковые данные.</li>
        <li><b>Обучение теории</b> — упрощённая модель для понимания основ.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Максимально простой алгоритм</li>
            <li>Сходится, если данные линейно разделимы</li>
            <li>Быстрый, онлайн-обучаемый</li>
            <li>Основа для понимания нейросетей</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Не работает на не-линейно-разделимых данных</li>
            <li>Не выдаёт вероятности</li>
            <li>Может колебаться при неразделимости</li>
            <li>Нет регуляризации</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Модель</h3>
      <div class="math-block">$$\\hat{y} = \\text{sign}(\\mathbf{w}^T \\mathbf{x}) = \\begin{cases} +1, & \\mathbf{w}^T \\mathbf{x} \\geq 0 \\\\ -1, & \\text{иначе} \\end{cases}$$</div>

      <h3>Правило обновления</h3>
      <div class="math-block">$$\\mathbf{w}_{t+1} = \\mathbf{w}_t + \\eta \\cdot y_i \\cdot \\mathbf{x}_i \\quad \\text{если } \\hat{y}_i \\neq y_i$$</div>

      <h3>Теорема сходимости (Новиков)</h3>
      <p>Пусть данные линейно разделимы с зазором $\\gamma > 0$: $\\exists \\mathbf{w}^*$ с $\\|\\mathbf{w}^*\\| = 1$ и $y_i \\mathbf{w}^{*T} \\mathbf{x}_i \\geq \\gamma$ для всех i. Пусть $R = \\max \\|\\mathbf{x}_i\\|$.</p>
      <p>Тогда число ошибок перцептрона:</p>
      <div class="math-block">$$\\text{errors} \\leq \\left(\\frac{R}{\\gamma}\\right)^2$$</div>

      <h3>Связь с SVM</h3>
      <p>Перцептрон находит <b>любую</b> разделяющую гиперплоскость. SVM — гиперплоскость с <b>максимальным зазором</b>. Если данные не разделимы, SVM всё равно работает с soft margin.</p>

      <h3>Мини-батч версия</h3>
      <p>Вместо обновления на одном примере, усредняем градиенты по батчу. Более стабильное обучение.</p>
    `,

    extra: `
      <h3>Pocket algorithm</h3>
      <p>Если данные не разделимы, обычный перцептрон зацикливается. Pocket хранит «лучшие найденные» веса: обновляет «pocket weights» только если они дают меньше ошибок. Даёт разумное решение и для неразделимых данных.</p>

      <h3>Voted и averaged perceptron</h3>
      <p>Усредняем веса по всем итерациям → более устойчивые, лучше обобщают.</p>

      <h3>Многослойный перцептрон (MLP)</h3>
      <p>Стекаем несколько перцептронов с нелинейной активацией (sigmoid, ReLU). Получаем универсальный аппроксиматор — это уже нейросеть.</p>

      <h3>Дуальная форма и ядра</h3>
      <p>Можно переписать перцептрон через скалярные произведения: $\\mathbf{w} = \\sum_i \\alpha_i y_i \\mathbf{x}_i$. Заменив $\\langle \\mathbf{x}_i, \\mathbf{x}_j \\rangle$ на ядро $K(\\mathbf{x}_i, \\mathbf{x}_j)$, получаем kernel perceptron — умеет в нелинейные границы.</p>

      <h3>От перцептрона к современному DL</h3>
      <ol>
        <li>Перцептрон (1958) — один нейрон, sign-функция.</li>
        <li>MLP (1986) — backpropagation.</li>
        <li>CNN (1998) — LeNet, свёртки.</li>
        <li>Deep Nets (2012) — AlexNet, GPU.</li>
        <li>Transformer (2017) — attention, LLMs.</li>
      </ol>
    `,
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest: канал</a> — поиск по «perceptron» и «neural networks» для основ</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/articles/312450/" target="_blank">Habr: Перцептрон</a> — история, математика и реализация с нуля</li>
        <li><a href="https://en.wikipedia.org/wiki/Perceptron" target="_blank">Wikipedia: Perceptron</a> — история создания, математика и теорема сходимости</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Perceptron.html" target="_blank">sklearn Perceptron</a> — документация с параметрами и примерами</li>
      </ul>
    `,
  },
});
