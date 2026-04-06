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

      <h3>Историческое значение</h3>
      <p>Перцептрон придумал Фрэнк Розенблатт в <b>1958 году</b>. Это была первая обучаемая модель, вдохновлённая биологическими нейронами.</p>
      <p>В 60-х годах перцептрон был сенсацией: считали, что до искусственного интеллекта осталось несколько лет. Но в 1969 году Минский и Паперт показали фундаментальное ограничение: перцептрон не может решить задачу XOR. Это привело к <b>«первой зиме нейросетей»</b> — финансирование упало, исследования замерли на десятилетие.</p>
      <p>В 1986 году было изобретено <span class="term" data-tip="Backpropagation. Алгоритм обратного распространения ошибки. Позволяет обучать многослойные нейросети, используя правило цепочки.">обратное распространение ошибки</span>, и многослойные сети перцептронов стали снова актуальны. Сегодня перцептрон — базовая единица в любой нейросети.</p>

      <h3>Устройство перцептрона</h3>
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

      <h3>Правило обучения Розенблатта</h3>
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

      <h3>Теорема сходимости</h3>
      <p>Это одна из красивейших теорем машинного обучения. Если данные <b>линейно разделимы</b> (существует прямая, которая правильно разделяет классы), то перцептрон <b>гарантированно</b> найдёт разделяющую прямую за <b>конечное</b> число итераций.</p>
      <p>Более того, число ошибок ограничено: $\\leq (R/\\gamma)^2$, где $R$ — максимальная длина $x$, $\\gamma$ — минимальный margin.</p>

      <h3>XOR-проблема — граница возможностей</h3>
      <p>Есть данные, которые перцептрон <b>не может</b> классифицировать:</p>
      <pre>(0, 0) → 0
(0, 1) → 1
(1, 0) → 1
(1, 1) → 0</pre>

      <p>Это функция XOR. Нарисуй точки: класс 0 в углах (0,0) и (1,1), класс 1 в (0,1) и (1,0). <b>Ни одна прямая</b> не может разделить эти классы. А перцептрон умеет только прямые.</p>

      <p>Вывод: перцептрон — <b>линейный</b> классификатор. Работает только когда данные линейно разделимы.</p>

      <p><b>Решение:</b> многослойный перцептрон (MLP). Несколько слоёв нелинейно комбинируют признаки, выучивая сложные формы границ. Это и есть <b>нейронная сеть</b>.</p>

      <h3>Плюсы и ограничения</h3>
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

      <h3>Частые заблуждения</h3>
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

      <h3>Как это связано с другими темами</h3>
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
            <div class="calc">$w = (0,0,0)$, $z = 0 \cdot 1 + 0 \cdot 0 + 0 \cdot 0 = 0$, $\\hat{y} = \\text{sign}(0) = -1$<br>Предсказание $-1$ = метка $-1$ → <b>правильно</b>, обновление не нужно</div>
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
            <div class="calc">$z = 0 \cdot 1 + 0 \cdot 1 + 0 \cdot 1 = 0$, $\\hat{y} = \\text{sign}(0) = -1 \neq +1$ → <b>ошибка!</b><br>$w \\gets w + 1 \cdot (+1) \cdot (1,1,1) = (0,0,0) + (1,1,1) = (1,1,1)$</div>
            <div class="why">Ошибались: хотели $+1$, сказали $-1$. $z$ был слишком маленьким → добавляем $x$ к $w$, чтобы в следующий раз $z$ стал больше.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Эпоха 2: проверяем с $w=(1,1,1)$</h4>
            <div class="calc">
              $(0,0)$: $z = 1 \cdot 1 + 1 \cdot 0 + 1 \cdot 0 = 1$, $\\hat{y}=+1 \neq -1$ → ошибка. $w \gets (1,1,1) - (1,0,0) = (0,1,1)$<br>
              $(0,1)$: $z = 0+0+1=1 > 0$, $\\hat{y}=+1 \neq -1$ → ошибка. $w \gets (0,1,1) - (1,0,1) = (-1,1,0)$<br>
              $(1,0)$: $z = -1+1+0=0$, $\\hat{y}=-1$ = метка $-1$ → ок<br>
              $(1,1)$: $z = -1+1+0=0$, $\\hat{y}=-1 \neq +1$ → ошибка. $w \gets (-1,1,0) + (1,1,1) = (0,2,1)$
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
            <b>Интуиция правила обновления:</b> при ошибке «+1 вместо −1» $z$ был слишком большим — вычитаем $x$. При ошибке «−1 вместо +1» $z$ был слишком маленьким — добавляем $x$. Правило именно это и делает: $w \gets w + y \cdot x$.
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
            <div class="calc">$w = (-0{,}5, 0, 0)$. Точка $(0,0) \to -1$: $z=-0{,}5$, $\\hat{y}=-1$ = метка → ок</div>
            <div class="why">Bias $-0{,}5$ обеспечивает правильное предсказание «оба нуля → нет» с самого начала.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Точка (0,1) → +1: ошибка</h4>
            <div class="calc">$z = -0{,}5 + 0 \cdot 0 + 0 \cdot 1 = -0{,}5$, $\\hat{y}=-1 \neq +1$<br>$w \gets (-0{,}5, 0, 0) + 1 \cdot (+1) \cdot (1, 0, 1) = (0{,}5, 0, 1)$</div>
            <div class="why">Добавляем вектор признаков: увеличиваем $w_0$ (bias) и $w_2$ (вес для $x_2$). Теперь $x_2=1$ сможет перевесить bias.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Точка (1,0) → +1: проверяем</h4>
            <div class="calc">$w=(0{,}5, 0, 1)$: $z = 0{,}5 + 0 \cdot 1 + 1 \cdot 0 = 0{,}5 > 0$, $\\hat{y}=+1$ — но ждём верный ответ $+1$ → <b>правильно!</b></div>
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
            <p>Перцептрон правильно классифицирует, если $y_i \cdot (w_0 + w_1 x_{i1} + w_2 x_{i2}) > 0$:</p>
            <div class="calc">
              (i) $(0,0) \to -1$: &nbsp; $-1 \cdot w_0 > 0$ &nbsp; ⟹ &nbsp; $w_0 < 0$<br>
              (ii) $(0,1) \to +1$: &nbsp; $+(w_0 + w_2) > 0$ &nbsp; ⟹ &nbsp; $w_0 + w_2 > 0$<br>
              (iii) $(1,0) \to +1$: &nbsp; $+(w_0 + w_1) > 0$ &nbsp; ⟹ &nbsp; $w_0 + w_1 > 0$<br>
              (iv) $(1,1) \to -1$: &nbsp; $-(w_0 + w_1 + w_2) > 0$ &nbsp; ⟹ &nbsp; $w_0 + w_1 + w_2 < 0$
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
            <p>Нарисуем 4 точки XOR. Классы: $\{(0,0),\,(1,1)\} \to -1$ и $\{(0,1),\,(1,0)\} \to +1$.</p>
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
  },
});
