/* ==========================================================================
   RNN / LSTM
   ========================================================================== */
App.registerTopic({
  id: 'rnn-lstm',
  category: 'dl',
  title: 'RNN / LSTM',
  summary: 'Рекуррентные сети для последовательностей: память во времени.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('neural-network')">Многослойный перцептрон</a> ·
        <a onclick="App.selectTopic('gradient-descent')">Градиентный спуск</a> ·
        <a onclick="App.selectTopic('nlp-basics')">Основы NLP</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты читаешь детектив. Ты не можешь понять «кто убийца» на 200-й странице, если забыл, что было на 50-й. Ты <b>помнишь</b> ключевые факты: «у героя алиби», «дверь была заперта», «подозреваемый курил сигареты "Рассвет"». По ходу чтения эти факты обновляются: что-то забывается, что-то добавляется.</p>
        <p>RNN работает так же. Обычная нейросеть смотрит на вход «все сразу» — не может обработать <b>последовательность</b>. RNN читает входы <b>по одному</b>, поддерживая «память» (скрытое состояние) о прочитанном. Эта память переносится от шага к шагу, позволяя учитывать контекст.</p>
        <p>Но у vanilla RNN короткая память: она забывает события из далёкого прошлого. LSTM исправляет это: добавляет механизмы «что запомнить» и «что забыть», как умный читатель.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 185" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <defs>
            <marker id="arrowR" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6366f1"/>
            </marker>
            <marker id="arrowRG" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#10b981"/>
            </marker>
            <marker id="arrowRB" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#64748b"/>
            </marker>
          </defs>
          <!-- Three RNN cells -->
          <!-- Cell 1 -->
          <rect x="60" y="75" width="70" height="45" rx="8" fill="#ede9fe" stroke="#6366f1" stroke-width="2.5"/>
          <text x="95" y="103" text-anchor="middle" font-size="14" fill="#4f46e5" font-weight="700">h₁</text>
          <!-- Cell 2 -->
          <rect x="215" y="75" width="70" height="45" rx="8" fill="#ede9fe" stroke="#6366f1" stroke-width="2.5"/>
          <text x="250" y="103" text-anchor="middle" font-size="14" fill="#4f46e5" font-weight="700">h₂</text>
          <!-- Cell 3 -->
          <rect x="370" y="75" width="70" height="45" rx="8" fill="#ede9fe" stroke="#6366f1" stroke-width="2.5"/>
          <text x="405" y="103" text-anchor="middle" font-size="14" fill="#4f46e5" font-weight="700">h₃</text>
          <!-- Horizontal arrows h1→h2, h2→h3 -->
          <line x1="130" y1="97" x2="215" y2="97" stroke="#6366f1" stroke-width="2.5" marker-end="url(#arrowR)"/>
          <line x1="285" y1="97" x2="370" y2="97" stroke="#6366f1" stroke-width="2.5" marker-end="url(#arrowR)"/>
          <!-- Dots continuing right -->
          <text x="460" y="102" font-size="18" fill="#6366f1" font-weight="700">···</text>
          <!-- Input arrows x1, x2, x3 from below -->
          <line x1="95" y1="140" x2="95" y2="120" stroke="#64748b" stroke-width="2" marker-end="url(#arrowRB)"/>
          <text x="95" y="160" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">x₁</text>
          <line x1="250" y1="140" x2="250" y2="120" stroke="#64748b" stroke-width="2" marker-end="url(#arrowRB)"/>
          <text x="250" y="160" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">x₂</text>
          <line x1="405" y1="140" x2="405" y2="120" stroke="#64748b" stroke-width="2" marker-end="url(#arrowRB)"/>
          <text x="405" y="160" text-anchor="middle" font-size="12" fill="#334155" font-weight="600">x₃</text>
          <!-- Output arrows y1, y2, y3 from above -->
          <line x1="95" y1="75" x2="95" y2="50" stroke="#10b981" stroke-width="2" marker-end="url(#arrowRG)"/>
          <text x="95" y="40" text-anchor="middle" font-size="12" fill="#059669" font-weight="600">y₁</text>
          <line x1="250" y1="75" x2="250" y2="50" stroke="#10b981" stroke-width="2" marker-end="url(#arrowRG)"/>
          <text x="250" y="40" text-anchor="middle" font-size="12" fill="#059669" font-weight="600">y₂</text>
          <line x1="405" y1="75" x2="405" y2="50" stroke="#10b981" stroke-width="2" marker-end="url(#arrowRG)"/>
          <text x="405" y="40" text-anchor="middle" font-size="12" fill="#059669" font-weight="600">y₃</text>
          <!-- Label -->
          <text x="270" y="183" text-anchor="middle" font-size="10" fill="#64748b">Разворот RNN во времени: одни и те же веса на каждом шаге</text>
        </svg>
        <div class="caption">Развёрнутая во времени RNN: три копии одного блока h, связанные стрелками скрытого состояния. Входы x₁, x₂, x₃ подаются снизу, выходы y₁, y₂, y₃ выходят сверху.</div>
      </div>

      <h3>🎯 Проблема обработки последовательностей</h3>
      <p>Многие данные имеют <b>последовательную</b> природу:</p>
      <ul>
        <li>Тексты (слова в порядке).</li>
        <li>Речь (звуки во времени).</li>
        <li>Временные ряды (цены акций, датчики).</li>
        <li>Видео (кадры).</li>
        <li>Музыка (ноты).</li>
      </ul>

      <p>Обычная полносвязная сеть (MLP) или CNN не умеют работать с последовательностями разной длины и не учитывают порядок. Нужен новый подход.</p>

      <h3>💡 Идея RNN: скрытое состояние</h3>
      <p>RNN обрабатывает последовательность <b>элемент за элементом</b>. На каждом шаге:</p>
      <ol>
        <li>Получает текущий вход $x_t$.</li>
        <li>Комбинирует его с <span class="term" data-tip="Hidden state. Вектор, представляющий 'память' RNN о прошлых шагах. Обновляется на каждом новом входе.">скрытым состоянием</span> $h_{t-1}$ (память прошлого).</li>
        <li>Выдаёт обновлённое состояние $h_t$.</li>
      </ol>

      <div class="math-block">$$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$$</div>
      <div class="math-block">$$y_t = W_{hy} h_t + b_y$$</div>

      <p>Скрытое состояние $h_t$ — это «сжатая память» обо всём, что сеть видела до момента $t$. Веса $W_{hh}, W_{xh}, W_{hy}$ <b>одни и те же</b> на всех шагах — это разделение весов.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>RNN применяет <b>одну и ту же</b> функцию к каждому элементу последовательности, передавая информацию через скрытое состояние. Это позволяет обрабатывать последовательности любой длины и учитывать весь прошлый контекст.</p>
      </div>

      <h3>⏱️ Разворачивание во времени</h3>
      <p>RNN можно представить как <b>очень глубокую</b> сеть, где каждый слой — это один временной шаг:</p>
      <pre>x_1 → h_1 → h_2 → h_3 → ... → h_T → output
      ↑     ↑     ↑           ↑
      |   x_2   x_3          x_T</pre>

      <p>Все эти «слои» используют одни и те же веса. При обучении применяется <span class="term" data-tip="BPTT. Backpropagation Through Time. Алгоритм обратного распространения для RNN: разворачиваем сеть во времени и применяем обычный backprop.">backpropagation through time (BPTT)</span>.</p>

      <h3>⚠️ Проблема <a class="glossary-link" onclick="App.selectTopic('glossary-vanishing-gradient')">vanishing gradients</a></h3>
      <p>Главная болезнь vanilla RNN. При BPTT через много шагов <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">градиент</a> умножается на $W_{hh}$ снова и снова. Если собственные значения меньше 1 — градиент <b>затухает</b> экспоненциально.</p>
      <p>Последствие: сеть <b>не может помнить далёкое прошлое</b>. Связи длиной больше 10-20 шагов почти не обучаются.</p>
      <p>Альтернатива — <b>exploding gradients</b>: если собственные значения > 1, градиенты взрываются. Решается <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">gradient</a> clipping.</p>

      <h3>🏗️ LSTM — революция в памяти</h3>
      <p><span class="term" data-tip="Long Short-Term Memory. Специальная архитектура RNN с механизмом 'гейтов', решающая проблему vanishing gradients. Может помнить контекст на сотни шагов.">LSTM</span> (1997) решает проблему vanishing gradients через <b>cell state</b> — отдельный «канал памяти» с аддитивными обновлениями.</p>

      <p>LSTM добавляет три <b>гейта</b> (ворота), контролирующие информацию:</p>

      <h4>Forget gate (что забыть)</h4>
      <div class="math-block">$$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$$</div>
      <p>Решает, какие элементы старой памяти нужно «забыть». <a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">Сигмоида</a> выдаёт значения от 0 до 1 для каждого элемента cell state.</p>

      <h4>Input gate (что записать)</h4>
      <div class="math-block">$$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)$$</div>
      <p>Решает, какие новые данные добавить в память.</p>

      <h4>Output gate (что показать)</h4>
      <div class="math-block">$$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o)$$</div>
      <p>Контролирует, что из памяти выдавать наружу как выход.</p>

      <h4>Обновление cell state</h4>
      <div class="math-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$$</div>

      <div class="key-concept">
        <div class="kc-label">Почему cell state решает vanishing gradients</div>
        <p>В vanilla RNN градиент проходит через <b>умножение</b> на $W_{hh}$ на каждом шаге: $\\frac{\\partial h_t}{\\partial h_{t-1}} = \\text{diag}(\\tanh') \\cdot W_{hh}$. За 20 шагов: $0.5^{20} = 0.000001$ — градиент исчез.</p>
        <p>В LSTM градиент по cell state: $\\frac{\\partial c_t}{\\partial c_{t-1}} = f_t$ — это просто <b>поэлементное умножение на forget gate</b>. Если $f_t \\approx 0.95$, то за 20 шагов: $0.95^{20} \\approx 0.36$ — <b>36% градиента сохранилось</b>!</p>
        <p>Сравни: RNN теряет 99.9999% градиента, LSTM сохраняет 36%. Cell state — это <b>«шоссе» для градиента</b>: информация течёт по нему без сжатия через нелинейности и матричные умножения. Именно поэтому формула $c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$ использует <b>сложение</b>, а не умножение на матрицу.</p>
      </div>

      <h3>🔧 GRU — упрощённая LSTM</h3>
      <p><span class="term" data-tip="Gated Recurrent Unit. Упрощённая версия LSTM с двумя гейтами вместо трёх. Меньше параметров, часто работает не хуже.">GRU</span> (2014) — более простая версия LSTM:</p>
      <ul>
        <li>2 гейта вместо 3 (update и reset).</li>
        <li>Нет отдельного cell state.</li>
        <li>Меньше параметров.</li>
        <li>Обучается быстрее.</li>
      </ul>

      <p>На практике GRU и LSTM дают похожие результаты. Выбор — эмпирический.</p>

      <h3>📋 Типы задач с RNN</h3>
      <ul>
        <li><b>Many-to-one:</b> вход — последовательность, выход — один. Классификация текста, sentiment analysis.</li>
        <li><b>Many-to-many (sync):</b> вход и выход одной длины. POS-tagging.</li>
        <li><b>Many-to-many (async, seq2seq):</b> вход и выход разной длины. Машинный перевод.</li>
        <li><b>One-to-many:</b> один вход, много выходов. Image captioning.</li>
      </ul>

      <h3>↔️ Bidirectional RNN</h3>
      <p>Для некоторых задач важен контекст <b>и справа, и слева</b>. Bidirectional RNN = две RNN: одна идёт вперёд, другая назад. Их hidden states объединяются.</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Обрабатывает последовательности переменной длины.</li>
        <li>Разделение весов — компактно.</li>
        <li>LSTM/GRU помнят долгие зависимости.</li>
        <li>Хорош для онлайн-обработки.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Последовательная обработка</b> — плохо параллелится.</li>
        <li>Обучение медленное.</li>
        <li>Даже LSTM ограничен на очень длинных последовательностях.</li>
        <li><b>Уступает Transformer</b> в большинстве NLP задач.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«RNN помнит всё»</b> — vanilla RNN забывает быстро. LSTM помнит дольше, но тоже ограничен.</li>
        <li><b>«LSTM решает все проблемы RNN»</b> — частично. На очень длинных последовательностях (>1000) тоже проблемы.</li>
        <li><b>«RNN устарели»</b> — в NLP заменены Transformer, но актуальны для онлайн, стриминга, time series.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: seq2seq и <a class="glossary-link" onclick="App.selectTopic('glossary-attention')">attention</a></summary>
        <div class="deep-dive-body">
          <p><b>Seq2seq</b> — архитектура для задач типа перевода:</p>
          <ul>
            <li><b>Encoder</b> RNN читает вход, кодирует в вектор.</li>
            <li><b>Decoder</b> RNN генерирует выход из этого вектора.</li>
          </ul>
          <p>Проблема: <b>узкое горло</b> — весь вход сжимается в один вектор. Теряется информация.</p>
          <p>Решение: <b>attention</b>. Decoder на каждом шаге смотрит на <b>все</b> hidden states encoder с весами. Это предшественник Transformer.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: gradient clipping</summary>
        <div class="deep-dive-body">
          <p>Для борьбы с exploding gradients в RNN используют clipping: обрезаем норму градиента:</p>
          <div class="math-block">$$\\text{if } \\|g\\| > \\text{threshold}: \\quad g \\gets g \\cdot \\frac{\\text{threshold}}{\\|g\\|}$$</div>
          <p>Не решает vanishing, но спасает от exploding. Стандартная техника обучения RNN.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: закат RNN</summary>
        <div class="deep-dive-body">
          <p>С 2018 года Transformer почти везде вытеснил RNN в NLP. Причины:</p>
          <ul>
            <li><b>Параллелизация:</b> Transformer обрабатывает все позиции сразу, RNN последовательно.</li>
            <li><b>Длинные связи:</b> attention видит любую позицию напрямую.</li>
            <li><b>Масштабирование:</b> лучше работает на больших данных.</li>
          </ul>
          <p>Но RNN остаются полезными для: стриминга, малых моделей, time series, когда важна последовательная обработка.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>MLP</b> — RNN это MLP с обратной связью.</li>
        <li><b>Transformer</b> — современная альтернатива для последовательностей.</li>
        <li><b>CNN</b> — можно комбинировать (CNN+LSTM для видео).</li>
        <li><b>Attention</b> — родился как улучшение seq2seq с RNN.</li>
      </ul>
    `,

    examples: [
      {
        title: 'LSTM предсказывает температуру',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Пройти полный forward pass LSTM на 3 временных шагах для предсказания температуры. Данные: 5 дневных температур [18, 22, 25, 23, 20]. Сеть: input_size=1, hidden_size=2, output_size=1. Показать ВСЕ вычисления в каждом гейте.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: данные и оконный подход</h4>
            <div class="example-data-table">
              <table>
                <tr><th>День</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
                <tr><td>Температура (°C)</td><td>18</td><td>22</td><td>25</td><td>23</td><td>20</td></tr>
              </table>
            </div>
            <div class="calc">
              Оконный подход: вход = [t, t+1, t+2] → предсказание = t+3<br><br>
              Окно 1: вход [18, 22, 25] → цель: 23<br>
              Окно 2: вход [22, 25, 23] → цель: 20<br><br>
              Нормализация (min=18, max=25): x_norm = (x - 18) / (25 - 18) = (x - 18) / 7<br>
              18 → 0.00, 22 → 0.571, 25 → 1.00, 23 → 0.714, 20 → 0.286
            </div>
            <div class="why">LSTM обрабатывает последовательность по одному элементу. Оконный подход превращает временной ряд в пары (вход, цель). Нормализация в [0, 1] критична — без неё <a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">sigmoid</a>/tanh будут насыщаться.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: инициализация весов LSTM</h4>
            <p>LSTM с hidden_size=2, input_size=1. Каждый гейт имеет: $W$ (для $[h_{t-1}, x_t]$) размером $2 \\times 3$ и bias $b$ размером $2 \\times 1$.</p>
            <div class="calc">
              Объединённый вход: $[h_{t-1}, x_t]$ — вектор размера 3 (2 от h + 1 от x)<br><br>

              <b>Forget gate:</b><br>
              $W_f = \\begin{pmatrix} 0.5 & 0.3 & 0.1 \\\\ 0.2 & 0.4 & -0.1 \\end{pmatrix}$, $b_f = \\begin{pmatrix} 0.5 \\\\ 0.5 \\end{pmatrix}$<br><br>

              <b>Input gate:</b><br>
              $W_i = \\begin{pmatrix} 0.3 & -0.2 & 0.6 \\\\ 0.1 & 0.5 & 0.3 \\end{pmatrix}$, $b_i = \\begin{pmatrix} 0.0 \\\\ 0.0 \\end{pmatrix}$<br><br>

              <b>Candidate cell:</b><br>
              $W_c = \\begin{pmatrix} 0.4 & 0.1 & 0.8 \\\\ -0.3 & 0.6 & 0.2 \\end{pmatrix}$, $b_c = \\begin{pmatrix} 0.0 \\\\ 0.0 \\end{pmatrix}$<br><br>

              <b>Output gate:</b><br>
              $W_o = \\begin{pmatrix} 0.2 & 0.5 & -0.1 \\\\ 0.4 & -0.3 & 0.7 \\end{pmatrix}$, $b_o = \\begin{pmatrix} 0.0 \\\\ 0.0 \\end{pmatrix}$<br><br>

              <b>Выходной слой:</b><br>
              $W_{out} = \\begin{pmatrix} 0.6 & 0.4 \\end{pmatrix}$, $b_{out} = 0.1$<br><br>

              Начальные состояния: $h_0 = (0, 0)^T$, $c_0 = (0, 0)^T$
            </div>
            <div class="why">Bias в forget gate часто инициализируют единицами (здесь 0.5) — это рекомендация из статьи Jozefowicz et al. (2015). Если $b_f$ = 0, начальный forget gate $\\approx$ 0.5, и сеть сразу забывает половину информации. С $b_f$ = 1 начальный $f \\approx$ 0.73 — память лучше сохраняется.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: обработка $x_1 = 18$ (нормализ. 0.00)</h4>
            <p>Объединённый вход: $[h_0, x_1] = [0, 0, 0]^T$</p>

            <p><b>3a. Forget gate:</b></p>
            <div class="calc">
              $W_f \\cdot [0, 0, 0]^T + b_f = [0, 0]^T + [0.5, 0.5]^T = [0.5, 0.5]^T$<br>
              $f_1 = \\sigma([0.5, 0.5]^T) = [0.622, 0.622]^T$<br>
              (напомним: $\\sigma(0.5) = 1/(1+e^{-0.5}) = 1/1.607 = 0.622$)
            </div>
            <div class="why">Forget gate решает, сколько старой информации сохранить. При нулевом входе и нулевом скрытом состоянии результат определяется только bias. $f = 0.622$ — сохраняем ~62% прошлой памяти (но $c_0 = 0$, так что забывать нечего).</div>

            <p><b>3b. Input gate:</b></p>
            <div class="calc">
              $W_i \\cdot [0, 0, 0]^T + b_i = [0, 0]^T$<br>
              $i_1 = \\sigma([0, 0]^T) = [0.500, 0.500]^T$
            </div>

            <p><b>3c. Candidate cell state:</b></p>
            <div class="calc">
              $W_c \\cdot [0, 0, 0]^T + b_c = [0, 0]^T$<br>
              $\\tilde{c}_1 = \\tanh([0, 0]^T) = [0, 0]^T$
            </div>

            <p><b>3d. Cell state update:</b></p>
            <div class="calc">
              $c_1 = f_1 \\odot c_0 + i_1 \\odot \\tilde{c}_1$<br>
              $= [0.622, 0.622] \\odot [0, 0] + [0.500, 0.500] \\odot [0, 0]$<br>
              $= [0, 0] + [0, 0] = [0, 0]^T$
            </div>

            <p><b>3e. Output gate и hidden state:</b></p>
            <div class="calc">
              $W_o \\cdot [0, 0, 0]^T + b_o = [0, 0]^T$<br>
              $o_1 = \\sigma([0, 0]^T) = [0.500, 0.500]^T$<br><br>
              $h_1 = o_1 \\odot \\tanh(c_1) = [0.500, 0.500] \\odot \\tanh([0, 0]) = [0.500, 0.500] \\odot [0, 0] = [0, 0]^T$
            </div>
            <div class="why">Первый шаг с $x=0.00$ и нулевыми начальными состояниями даёт нулевой выход. Вся информация — в bias-ах, а кандидат $\\tilde{c}$ = 0. Нормализованная температура 18°C = 0.00, поэтому сеть по сути «пропускает» этот шаг. С нормализованными входами > 0 эффект будет заметным.</div>

            <div class="illustration bordered">
              <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
                <text x="250" y="16" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">LSTM ячейка: шаг 1 (x=0.00)</text>
                <!-- Cell body -->
                <rect x="120" y="40" width="260" height="130" rx="10" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
                <!-- Forget gate -->
                <rect x="140" y="55" width="70" height="28" rx="5" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                <text x="175" y="73" text-anchor="middle" font-size="9" fill="#92400e" font-weight="600">f=[.62,.62]</text>
                <!-- Input gate -->
                <rect x="140" y="90" width="70" height="28" rx="5" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5"/>
                <text x="175" y="108" text-anchor="middle" font-size="9" fill="#166534" font-weight="600">i=[.50,.50]</text>
                <!-- Candidate -->
                <rect x="220" y="90" width="70" height="28" rx="5" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.5"/>
                <text x="255" y="108" text-anchor="middle" font-size="9" fill="#5b21b6" font-weight="600">c~=[0,0]</text>
                <!-- Cell state -->
                <rect x="300" y="55" width="65" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
                <text x="332" y="73" text-anchor="middle" font-size="9" fill="#1e40af" font-weight="700">c=[0,0]</text>
                <!-- Output gate -->
                <rect x="220" y="130" width="70" height="28" rx="5" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
                <text x="255" y="148" text-anchor="middle" font-size="9" fill="#991b1b" font-weight="600">o=[.50,.50]</text>
                <!-- Hidden state output -->
                <rect x="310" y="130" width="55" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
                <text x="337" y="148" text-anchor="middle" font-size="9" fill="#1e40af" font-weight="700">h=[0,0]</text>
                <!-- Input label -->
                <text x="80" y="108" text-anchor="middle" font-size="10" fill="#64748b">x₁=0.00</text>
                <text x="80" y="70" text-anchor="middle" font-size="10" fill="#64748b">h₀=[0,0]</text>
                <!-- Arrows -->
                <line x1="110" y1="105" x2="138" y2="105" stroke="#64748b" stroke-width="1.5"/>
                <line x1="110" y1="68" x2="138" y2="68" stroke="#64748b" stroke-width="1.5"/>
              </svg>
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: обработка $x_2 = 22$ (нормализ. 0.571)</h4>
            <p>Объединённый вход: $[h_1, x_2] = [0, 0, 0.571]^T$</p>

            <p><b>4a. Forget gate:</b></p>
            <div class="calc">
              $W_f \\cdot [0, 0, 0.571]^T + b_f$<br>
              $= [0.5 \\cdot 0 + 0.3 \\cdot 0 + 0.1 \\cdot 0.571 + 0.5,\\; 0.2 \\cdot 0 + 0.4 \\cdot 0 + (-0.1) \\cdot 0.571 + 0.5]^T$<br>
              $= [0.057 + 0.5,\\; -0.057 + 0.5]^T = [0.557, 0.443]^T$<br>
              $f_2 = \\sigma([0.557, 0.443]^T) = [0.636, 0.609]^T$
            </div>

            <p><b>4b. Input gate:</b></p>
            <div class="calc">
              $W_i \\cdot [0, 0, 0.571]^T + b_i$<br>
              $= [0.3 \\cdot 0 + (-0.2) \\cdot 0 + 0.6 \\cdot 0.571,\\; 0.1 \\cdot 0 + 0.5 \\cdot 0 + 0.3 \\cdot 0.571]^T$<br>
              $= [0.343, 0.171]^T$<br>
              $i_2 = \\sigma([0.343, 0.171]^T) = [0.585, 0.543]^T$
            </div>

            <p><b>4c. Candidate cell state:</b></p>
            <div class="calc">
              $W_c \\cdot [0, 0, 0.571]^T + b_c = [0.4 \\cdot 0 + 0.1 \\cdot 0 + 0.8 \\cdot 0.571,\\; -0.3 \\cdot 0 + 0.6 \\cdot 0 + 0.2 \\cdot 0.571]^T$<br>
              $= [0.457, 0.114]^T$<br>
              $\\tilde{c}_2 = \\tanh([0.457, 0.114]^T) = [0.428, 0.114]^T$
            </div>

            <p><b>4d. Cell state update:</b></p>
            <div class="calc">
              $c_2 = f_2 \\odot c_1 + i_2 \\odot \\tilde{c}_2$<br>
              $= [0.636, 0.609] \\odot [0, 0] + [0.585, 0.543] \\odot [0.428, 0.114]$<br>
              $= [0, 0] + [0.250, 0.062]$<br>
              $= [0.250, 0.062]^T$
            </div>

            <p><b>4e. Output gate и hidden state:</b></p>
            <div class="calc">
              $W_o \\cdot [0, 0, 0.571]^T + b_o = [0.2 \\cdot 0 + 0.5 \\cdot 0 + (-0.1) \\cdot 0.571,\\; 0.4 \\cdot 0 + (-0.3) \\cdot 0 + 0.7 \\cdot 0.571]^T$<br>
              $= [-0.057, 0.400]^T$<br>
              $o_2 = \\sigma([-0.057, 0.400]^T) = [0.486, 0.599]^T$<br><br>
              $h_2 = o_2 \\odot \\tanh(c_2) = [0.486, 0.599] \\odot \\tanh([0.250, 0.062])$<br>
              $= [0.486, 0.599] \\odot [0.245, 0.062] = [0.119, 0.037]^T$
            </div>
            <div class="why">Теперь $c_2 = [0.250, 0.062]$ — ячейка «запомнила» информацию о температуре 22°C. $h_2 = [0.119, 0.037]$ — hidden state, который передаётся на следующий шаг и используется для предсказания. Первый компонент ($c_2[0] = 0.250$) запомнил больше благодаря большему весу $W_c[0,2] = 0.8$.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: обработка $x_3 = 25$ (нормализ. 1.00) — ключевые значения</h4>
            <p>Объединённый вход: $[h_2, x_3] = [0.119, 0.037, 1.00]^T$</p>
            <div class="calc">
              <b>Forget gate:</b> $W_f \\cdot [0.119, 0.037, 1.00]^T + b_f$<br>
              $= [0.5 \\cdot 0.119 + 0.3 \\cdot 0.037 + 0.1 \\cdot 1.00 + 0.5,\\; 0.2 \\cdot 0.119 + 0.4 \\cdot 0.037 + (-0.1) \\cdot 1.00 + 0.5]^T$<br>
              $= [0.060 + 0.011 + 0.100 + 0.500,\\; 0.024 + 0.015 - 0.100 + 0.500]^T$<br>
              $= [0.671, 0.439]^T$<br>
              $f_3 = \\sigma([0.671, 0.439]) = [0.662, 0.608]^T$<br><br>

              <b>Input gate:</b> $i_3 = \\sigma(W_i \\cdot [0.119, 0.037, 1.00]^T + b_i)$<br>
              $= \\sigma([0.3 \\cdot 0.119 + (-0.2) \\cdot 0.037 + 0.6 \\cdot 1.00,\\; 0.1 \\cdot 0.119 + 0.5 \\cdot 0.037 + 0.3 \\cdot 1.00])$<br>
              $= \\sigma([0.036 - 0.007 + 0.600,\\; 0.012 + 0.019 + 0.300])$<br>
              $= \\sigma([0.629, 0.331]) = [0.652, 0.582]^T$<br><br>

              <b>Candidate:</b> $\\tilde{c}_3 = \\tanh(W_c \\cdot [0.119, 0.037, 1.00]^T + b_c)$<br>
              $= \\tanh([0.4 \\cdot 0.119 + 0.1 \\cdot 0.037 + 0.8 \\cdot 1.00,\\; -0.3 \\cdot 0.119 + 0.6 \\cdot 0.037 + 0.2 \\cdot 1.00])$<br>
              $= \\tanh([0.048 + 0.004 + 0.800,\\; -0.036 + 0.022 + 0.200])$<br>
              $= \\tanh([0.852, 0.186]) = [0.693, 0.184]^T$<br><br>

              <b>Cell state:</b> $c_3 = f_3 \\odot c_2 + i_3 \\odot \\tilde{c}_3$<br>
              $= [0.662, 0.608] \\odot [0.250, 0.062] + [0.652, 0.582] \\odot [0.693, 0.184]$<br>
              $= [0.166, 0.038] + [0.452, 0.107] = [0.617, 0.145]^T$<br><br>

              <b>Output gate и h:</b><br>
              $o_3 = \\sigma(W_o \\cdot [0.119, 0.037, 1.00]^T + b_o)$<br>
              $= \\sigma([0.2 \\cdot 0.119 + 0.5 \\cdot 0.037 + (-0.1) \\cdot 1.00,\\; 0.4 \\cdot 0.119 + (-0.3) \\cdot 0.037 + 0.7 \\cdot 1.00])$<br>
              $= \\sigma([0.024 + 0.019 - 0.100,\\; 0.048 - 0.011 + 0.700])$<br>
              $= \\sigma([-0.058, 0.737]) = [0.486, 0.676]^T$<br><br>

              $h_3 = o_3 \\odot \\tanh(c_3) = [0.486, 0.676] \\odot \\tanh([0.617, 0.145])$<br>
              $= [0.486, 0.676] \\odot [0.549, 0.144] = [0.267, 0.097]^T$
            </div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: финальное предсказание</h4>
            <div class="calc">
              $\\hat{y}_{norm} = W_{out} \\cdot h_3 + b_{out}$<br>
              $= [0.6, 0.4] \\cdot [0.267, 0.097]^T + 0.1$<br>
              $= 0.6 \\cdot 0.267 + 0.4 \\cdot 0.097 + 0.1$<br>
              $= 0.160 + 0.039 + 0.1 = 0.299$<br><br>

              Денормализация: $\\hat{y} = 0.299 \\cdot 7 + 18 = 2.093 + 18 = <b>20.09°C</b>$<br><br>

              Истинное значение: $y = 23°C$<br>
              Ошибка: $|23 - 20.09| = 2.91°C$
            </div>
            <div class="why">Предсказание 20.09°C при цели 23°C — ошибка 2.91°C. Это с случайными весами без обучения! После gradient descent по <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a> loss веса подстроятся, и LSTM научится улавливать паттерн «рост → пик → спад». Ошибка уменьшится в десятки раз.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7: вычисление loss</h4>
            <div class="calc">
              MSE loss = $(\\hat{y}_{norm} - y_{norm})^2 = (0.299 - 0.714)^2 = (-0.415)^2 = <b>0.172</b>$<br><br>
              Это значение будет использовано для backpropagation through time (BPTT),<br>
              чтобы обновить все 42 параметра: $W_f, W_i, W_c, W_o$ (по 8), $b_f, b_i, b_c, b_o$ (по 2), $W_{out}$ (2), $b_{out}$ (1).
            </div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>LSTM обработал 3 температуры [18°, 22°, 25°], накопил информацию в cell state $c_3 = [0.617, 0.145]$ и hidden state $h_3 = [0.267, 0.097]$. Предсказание: 20.09°C (цель: 23°C, loss = 0.172). Cell state хранит долгосрочную память о тренде, hidden state — текущее «мнение» сети.</p>
          </div>
        `
      },
      {
        title: 'Vanishing gradient на числах',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как градиент затухает при обратном распространении через 5 шагов vanilla RNN. Проследить числа на каждом шаге. Сравнить с LSTM, где forget gate ≈ 1.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: формула обратного прохода RNN</h4>
            <div class="calc">
              Forward: $h_t = \\tanh(W_{hh} \\cdot h_{t-1} + W_{xh} \\cdot x_t + b)$<br><br>
              Градиент loss по $h_t$ через один шаг назад:<br>
              $\\frac{\\partial h_t}{\\partial h_{t-1}} = W_{hh} \\cdot \\text{diag}(1 - h_t^2)$<br><br>
              Для скалярного случая (hidden_size=1): $\\frac{\\partial h_t}{\\partial h_{t-1}} = W_{hh} \\cdot (1 - h_t^2)$
            </div>
            <div class="why">Каждый шаг назад умножает градиент на произведение двух чисел: $W_{hh}$ (обычно $< 1$) и $1 - h_t^2$ (производная tanh, всегда $\\leq 1$). Два числа меньше единицы перемножаются — результат ещё меньше.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: прямой проход — сохраняем активации</h4>
            <p>Параметры: $W_{hh} = 0.7$, $W_{xh} = 0.5$, $b = 0.1$. Входы $x = [0.8, 0.3, -0.2, 0.5, 0.1]$, $h_0 = 0$.</p>
            <div class="example-data-table">
              <table>
                <tr><th>Шаг $t$</th><th>$x_t$</th><th>$z_t = W_{hh}h_{t-1} + W_{xh}x_t + b$</th><th>$h_t = \\tanh(z_t)$</th><th>$1 - h_t^2$ (tanh')</th></tr>
                <tr><td>1</td><td>0.8</td><td>$0.7 \\cdot 0 + 0.5 \\cdot 0.8 + 0.1 = 0.500$</td><td>0.462</td><td>0.787</td></tr>
                <tr><td>2</td><td>0.3</td><td>$0.7 \\cdot 0.462 + 0.5 \\cdot 0.3 + 0.1 = 0.573$</td><td>0.517</td><td>0.733</td></tr>
                <tr><td>3</td><td>-0.2</td><td>$0.7 \\cdot 0.517 + 0.5 \\cdot (-0.2) + 0.1 = 0.362$</td><td>0.348</td><td>0.879</td></tr>
                <tr><td>4</td><td>0.5</td><td>$0.7 \\cdot 0.348 + 0.5 \\cdot 0.5 + 0.1 = 0.594$</td><td>0.531</td><td>0.718</td></tr>
                <tr><td>5</td><td>0.1</td><td>$0.7 \\cdot 0.531 + 0.5 \\cdot 0.1 + 0.1 = 0.522$</td><td>0.480</td><td>0.770</td></tr>
              </table>
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: обратный проход — градиент затухает</h4>
            <p>Начальный градиент: $\\delta_5 = \\frac{\\partial L}{\\partial h_5} = 1.0$ (для удобства).</p>
            <div class="calc">
              $\\delta_4 = \\delta_5 \\cdot W_{hh} \\cdot (1 - h_5^2) = 1.0 \\cdot 0.7 \\cdot 0.770 = <b>0.539</b>$<br>
              Осталось: 53.9% от исходного<br><br>

              $\\delta_3 = \\delta_4 \\cdot W_{hh} \\cdot (1 - h_4^2) = 0.539 \\cdot 0.7 \\cdot 0.718 = <b>0.271</b>$<br>
              Осталось: 27.1%<br><br>

              $\\delta_2 = \\delta_3 \\cdot W_{hh} \\cdot (1 - h_3^2) = 0.271 \\cdot 0.7 \\cdot 0.879 = <b>0.167</b>$<br>
              Осталось: 16.7%<br><br>

              $\\delta_1 = \\delta_2 \\cdot W_{hh} \\cdot (1 - h_2^2) = 0.167 \\cdot 0.7 \\cdot 0.733 = <b>0.086</b>$<br>
              Осталось: 8.6%
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Шаг</th><th>5 (конец)</th><th>4</th><th>3</th><th>2</th><th>1 (начало)</th></tr>
                <tr><td>Градиент</td><td>1.000</td><td>0.539</td><td>0.271</td><td>0.167</td><td>0.086</td></tr>
                <tr><td>% от исходного</td><td>100%</td><td>53.9%</td><td>27.1%</td><td>16.7%</td><td>8.6%</td></tr>
              </table>
            </div>
            <div class="why">За 4 шага назад градиент упал до 8.6%! Множитель на каждом шаге: $W_{hh} \\cdot \\tanh' \\approx 0.7 \\cdot 0.78 \\approx 0.55$. Через 10 шагов: $0.55^{10} \\approx 0.003$ (0.3%). Через 20 шагов: $0.55^{20} \\approx 0.000006$. Параметры на далёких шагах практически не обучаются.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: LSTM — градиент через cell state</h4>
            <p>В LSTM градиент по cell state: $\\frac{\\partial c_t}{\\partial c_{t-1}} = f_t$</p>
            <div class="calc">
              Если forget gate $f_t \\approx 0.95$ на каждом шаге:<br><br>

              Шаг 5 → 4: $\\delta_4^{(c)} = 1.0 \\cdot 0.95 = <b>0.950</b>$ (95%)<br>
              Шаг 4 → 3: $\\delta_3^{(c)} = 0.950 \\cdot 0.95 = <b>0.903</b>$ (90.3%)<br>
              Шаг 3 → 2: $\\delta_2^{(c)} = 0.903 \\cdot 0.95 = <b>0.857</b>$ (85.7%)<br>
              Шаг 2 → 1: $\\delta_1^{(c)} = 0.857 \\cdot 0.95 = <b>0.815</b>$ (81.5%)
            </div>
            <div class="example-data-table">
              <table>
                <tr><th></th><th>Шаг 5</th><th>Шаг 4</th><th>Шаг 3</th><th>Шаг 2</th><th>Шаг 1</th></tr>
                <tr><td>RNN gradient</td><td>100%</td><td>53.9%</td><td>27.1%</td><td>16.7%</td><td>8.6%</td></tr>
                <tr><td>LSTM gradient (cell)</td><td>100%</td><td>95%</td><td>90.3%</td><td>85.7%</td><td>81.5%</td></tr>
              </table>
            </div>
            <div class="why">На шаге 1: RNN сохранила 8.6% градиента, LSTM — 81.5%! Разница в 10 раз. На 20 шагах: RNN $\\approx$ 0%, LSTM $\\approx$ 36%. Это и есть «шоссе градиента» через cell state: аддитивное обновление $c_t = f_t \\odot c_{t-1} + ...$ вместо мультипликативного $h_t = \\tanh(W_{hh} \\cdot h_{t-1} + ...)$.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: экстраполяция на длинные последовательности</h4>
            <div class="calc">
              Через N шагов назад:<br>
              RNN: $(W_{hh} \\cdot \\tanh')^N \\approx 0.55^N$<br>
              LSTM: $f^N \\approx 0.95^N$<br><br>

              N=10: RNN = 0.3%, LSTM = 60%<br>
              N=20: RNN ≈ 0%, LSTM = 36%<br>
              N=50: RNN ≈ 0%, LSTM = 7.7%<br>
              N=100: RNN ≈ 0%, LSTM = 0.6% (тоже проблемы!)
            </div>
            <div class="why">LSTM драматически лучше RNN, но тоже затухает на очень длинных последовательностях (100+ шагов). Для таких задач нужны Transformer (внимание на любое расстояние за 1 шаг) или SSM (Mamba).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>За 4 шага назад: RNN сохранила 8.6% градиента ($0.55^4$), LSTM — 81.5% ($0.95^4$). Vanishing gradient — главная проблема vanilla RNN для длинных зависимостей. LSTM решает её через cell state с forget gate ≈ 1, создавая «шоссе» для градиента.</p>
          </div>
        `
      },
      {
        title: 'Forget gate в действии: смена паттерна',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как forget gate LSTM учится «забывать» старую информацию, когда начинается новый паттерн. Последовательность: стабильный сигнал [5, 5, 5], затем резкая смена [1, 1]. Проследить, как cell state реагирует на смену паттерна.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: данные — два паттерна</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Шаг t</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>
                <tr><td>Вход $x_t$</td><td>5</td><td>5</td><td>5</td><td>1</td><td>1</td></tr>
                <tr><td>Нормализ. (÷5)</td><td>1.0</td><td>1.0</td><td>1.0</td><td>0.2</td><td>0.2</td></tr>
                <tr><td>Паттерн</td><td colspan="3" style="background:#dcfce7">Стабильный «высокий»</td><td colspan="2" style="background:#fee2e2">Новый «низкий»</td></tr>
              </table>
            </div>
            <div class="why">Мы хотим увидеть: когда вход резко меняется с 5 до 1, как LSTM «забывает» старый паттерн и адаптируется к новому?</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: обученная LSTM — веса, которые «научились» забывать</h4>
            <p>Используем упрощённый скалярный LSTM (hidden_size=1) с весами, которые сеть «выучила» после обучения:</p>
            <div class="calc">
              <b>Forget gate:</b> $f_t = \\sigma(w_f^h \\cdot h_{t-1} + w_f^x \\cdot x_t + b_f)$<br>
              Обученные: $w_f^h = 0.3$, $w_f^x = -1.5$, $b_f = 2.0$<br><br>

              <b>Input gate:</b> $i_t = \\sigma(w_i^h \\cdot h_{t-1} + w_i^x \\cdot x_t + b_i)$<br>
              Обученные: $w_i^h = 0.2$, $w_i^x = 1.0$, $b_i = -0.5$<br><br>

              <b>Candidate:</b> $\\tilde{c}_t = \\tanh(w_c^h \\cdot h_{t-1} + w_c^x \\cdot x_t + b_c)$<br>
              Обученные: $w_c^h = 0.1$, $w_c^x = 0.8$, $b_c = 0.0$<br><br>

              <b>Output gate:</b> $o_t = \\sigma(0.5 \\cdot h_{t-1} + 0.3 \\cdot x_t + 0.0)$
            </div>
            <div class="why">Обратите внимание на $w_f^x = -1.5$: когда вход УМЕНЬШАЕТСЯ (с 1.0 до 0.2), вклад $w_f^x \\cdot x_t$ падает с $-1.5$ до $-0.3$, увеличивая аргумент сигмоида. Но здесь ключевое: при стабильном высоком входе $f$ высокий (помним), при смене — $f$ падает (забываем).</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: прогон через стабильную фазу (x = 1.0, 1.0, 1.0)</h4>
            <p>$h_0 = 0$, $c_0 = 0$:</p>
            <div class="calc">
              <b>t=1 (x=1.0):</b><br>
              $f_1 = \\sigma(0.3 \\cdot 0 + (-1.5) \\cdot 1.0 + 2.0) = \\sigma(0.5) = 0.622$<br>
              $i_1 = \\sigma(0.2 \\cdot 0 + 1.0 \\cdot 1.0 + (-0.5)) = \\sigma(0.5) = 0.622$<br>
              $\\tilde{c}_1 = \\tanh(0.1 \\cdot 0 + 0.8 \\cdot 1.0 + 0) = \\tanh(0.8) = 0.664$<br>
              $c_1 = 0.622 \\cdot 0 + 0.622 \\cdot 0.664 = <b>0.413</b>$<br>
              $o_1 = \\sigma(0.5 \\cdot 0 + 0.3 \\cdot 1.0) = \\sigma(0.3) = 0.574$<br>
              $h_1 = 0.574 \\cdot \\tanh(0.413) = 0.574 \\cdot 0.391 = <b>0.224</b>$<br><br>

              <b>t=2 (x=1.0):</b><br>
              $f_2 = \\sigma(0.3 \\cdot 0.224 + (-1.5) \\cdot 1.0 + 2.0) = \\sigma(0.567) = 0.638$<br>
              $i_2 = \\sigma(0.2 \\cdot 0.224 + 1.0 \\cdot 1.0 - 0.5) = \\sigma(0.545) = 0.633$<br>
              $\\tilde{c}_2 = \\tanh(0.1 \\cdot 0.224 + 0.8 \\cdot 1.0) = \\tanh(0.822) = 0.677$<br>
              $c_2 = 0.638 \\cdot 0.413 + 0.633 \\cdot 0.677 = 0.263 + 0.429 = <b>0.692</b>$<br>
              $h_2 = \\sigma(0.5 \\cdot 0.224 + 0.3) \\cdot \\tanh(0.692) = 0.604 \\cdot 0.601 = <b>0.363</b>$<br><br>

              <b>t=3 (x=1.0):</b><br>
              $f_3 = \\sigma(0.3 \\cdot 0.363 - 1.5 + 2.0) = \\sigma(0.609) = 0.648$<br>
              $i_3 = \\sigma(0.2 \\cdot 0.363 + 1.0 - 0.5) = \\sigma(0.573) = 0.639$<br>
              $\\tilde{c}_3 = \\tanh(0.1 \\cdot 0.363 + 0.8) = \\tanh(0.836) = 0.685$<br>
              $c_3 = 0.648 \\cdot 0.692 + 0.639 \\cdot 0.685 = 0.448 + 0.438 = <b>0.886</b>$<br>
              $h_3 = \\sigma(0.5 \\cdot 0.363 + 0.3) \\cdot \\tanh(0.886) = 0.621 \\cdot 0.709 = <b>0.440</b>$
            </div>
            <div class="why">Cell state растёт: $c_1 = 0.413 \\to c_2 = 0.692 \\to c_3 = 0.886$. LSTM «накапливает» уверенность в паттерне «высокий вход». Forget gate ≈ 0.64 — сохраняем ~64% прошлого и добавляем новое.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: смена паттерна (x = 0.2) — forget gate реагирует!</h4>
            <div class="calc">
              <b>t=4 (x=0.2) — РЕЗКАЯ СМЕНА:</b><br>
              $f_4 = \\sigma(0.3 \\cdot 0.440 + (-1.5) \\cdot 0.2 + 2.0) = \\sigma(0.132 - 0.300 + 2.0) = \\sigma(1.832) = <b>0.862</b>$<br><br>

              Стоп! $f_4 = 0.862$ — это ВЫШЕ чем при x=1.0 ($f_3 = 0.648$)!<br><br>

              Причина: $w_f^x = -1.5$, поэтому:<br>
              При $x = 1.0$: вклад $= -1.5 \\cdot 1.0 = -1.5$ (сильно давит вниз)<br>
              При $x = 0.2$: вклад $= -1.5 \\cdot 0.2 = -0.3$ (слабо давит вниз)<br><br>

              Результат: при НИЗКОМ входе forget gate ВЫШЕ → старая память СОХРАНЯЕТСЯ!<br><br>

              $i_4 = \\sigma(0.2 \\cdot 0.440 + 1.0 \\cdot 0.2 - 0.5) = \\sigma(0.088 + 0.2 - 0.5) = \\sigma(-0.212) = <b>0.447</b>$<br>
              $\\tilde{c}_4 = \\tanh(0.1 \\cdot 0.440 + 0.8 \\cdot 0.2) = \\tanh(0.204) = <b>0.201</b>$<br>
              $c_4 = 0.862 \\cdot 0.886 + 0.447 \\cdot 0.201 = 0.764 + 0.090 = <b>0.854</b>$<br>
              $h_4 = 0.576 \\cdot \\tanh(0.854) = 0.576 \\cdot 0.694 = <b>0.400</b>$
            </div>
            <div class="why">Интересный результат! С этими весами LSTM сохраняет старую память ($f=0.862$) при смене входа, но input gate закрывается ($i=0.447$) и кандидат мал ($\\tilde{c}=0.201$). Сеть как бы «осторожничает»: не забывает старое сразу, но и мало записывает новое. Это — инерция памяти.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: сводная таблица — эволюция cell state</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Шаг</th><th>$x_t$</th><th>Паттерн</th><th>$f_t$</th><th>$i_t$</th><th>$c_t$</th><th>$h_t$</th></tr>
                <tr><td>1</td><td>1.0</td><td style="background:#dcfce7">высокий</td><td>0.622</td><td>0.622</td><td>0.413</td><td>0.224</td></tr>
                <tr><td>2</td><td>1.0</td><td style="background:#dcfce7">высокий</td><td>0.638</td><td>0.633</td><td>0.692</td><td>0.363</td></tr>
                <tr><td>3</td><td>1.0</td><td style="background:#dcfce7">высокий</td><td>0.648</td><td>0.639</td><td>0.886</td><td>0.440</td></tr>
                <tr><td>4</td><td>0.2</td><td style="background:#fee2e2">низкий!</td><td>0.862</td><td>0.447</td><td>0.854</td><td>0.400</td></tr>
                <tr><td>5</td><td>0.2</td><td style="background:#fee2e2">низкий</td><td>0.853</td><td>0.429</td><td>0.808</td><td>0.378</td></tr>
              </table>
            </div>
            <div class="calc">
              Динамика cell state: 0.413 → 0.692 → 0.886 (рост) → 0.854 → 0.808 (медленный спад)<br><br>
              Ключевой вывод: при смене паттерна $c_t$ снижается МЕДЛЕННО (с 0.886 до 0.808 за 2 шага).<br>
              Это и есть «долгая память»: старая информация не исчезает мгновенно.
            </div>
            <div class="why">В этом примере forget gate с $w_f^x = -1.5$ оказался настроен так, что при НИЗКОМ входе он СОХРАНЯЕТ память (высокий $f$). Это один возможный режим. Если бы $w_f^x = +1.5$, при низком входе $f$ было бы низким, и старая память стиралась бы быстро. Сеть сама выбирает нужный режим при обучении!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>При смене паттерна с [1.0, 1.0, 1.0] на [0.2, 0.2]: forget gate увеличился с 0.648 до 0.862 (с данными весами — сохранение старой памяти), input gate упал с 0.639 до 0.447 (слабая запись нового). Cell state медленно снижается: 0.886 → 0.854 → 0.808. Forget gate — главный механизм управления «что помнить, что забыть».</p>
          </div>
        `
      },
    ],

    simulation: [
      {
        title: 'RNN на синусе',
        html: `
        <h3>Симуляция: RNN учит последовательность</h3>
        <p>Простая RNN учится предсказывать следующую точку в синусоиде.</p>
        <div class="sim-container">
          <div class="sim-controls" id="rnn-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="rnn-train">⏩ Обучить 500 шагов</button>
            <button class="btn secondary" id="rnn-step">+50 шагов</button>
            <button class="btn secondary" id="rnn-reset">↺ Сброс</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:320px;"><canvas id="rnn-chart"></canvas></div>
            <div class="sim-chart-wrap" style="height:160px;"><canvas id="rnn-loss"></canvas></div>
            <div class="sim-stats" id="rnn-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#rnn-controls');
        const cHidden = App.makeControl('range', 'rnn-h', 'Hidden size', { min: 4, max: 32, step: 2, value: 12 });
        const cSeqLen = App.makeControl('range', 'rnn-seq', 'Длина контекста', { min: 3, max: 20, step: 1, value: 10 });
        const cLR = App.makeControl('range', 'rnn-lr', 'Learning rate', { min: 0.001, max: 0.1, step: 0.001, value: 0.02 });
        [cHidden, cSeqLen, cLR].forEach(c => controls.appendChild(c.wrap));

        let Wxh, Whh, Why, bh, by;
        let hSize = 0;
        let lossHistory = [];
        let iter = 0;
        let fullSeries = [];
        let chart = null, lossChart = null;

        function init() {
          hSize = +cHidden.input.value;
          Wxh = new Array(hSize).fill(0).map(() => App.Util.randn(0, 0.3));
          Whh = Array.from({ length: hSize }, () => new Array(hSize).fill(0).map(() => App.Util.randn(0, 0.3)));
          Why = new Array(hSize).fill(0).map(() => App.Util.randn(0, 0.3));
          bh = new Array(hSize).fill(0);
          by = 0;
          lossHistory = []; iter = 0;
          // generate sine series
          fullSeries = [];
          for (let i = 0; i < 200; i++) fullSeries.push(Math.sin(i * 0.1) + 0.5 * Math.sin(i * 0.23));
        }

        function step(xSeq, target) {
          const seqLen = xSeq.length;
          const hStates = [new Array(hSize).fill(0)];
          // forward
          for (let t = 0; t < seqLen; t++) {
            const h = new Array(hSize).fill(0);
            for (let i = 0; i < hSize; i++) {
              let s = Wxh[i] * xSeq[t] + bh[i];
              for (let j = 0; j < hSize; j++) s += Whh[i][j] * hStates[t][j];
              h[i] = Math.tanh(s);
            }
            hStates.push(h);
          }
          let y = by;
          for (let i = 0; i < hSize; i++) y += Why[i] * hStates[seqLen][i];
          const err = y - target;
          const loss = 0.5 * err * err;
          // backward (through time)
          const lr = +cLR.input.value;
          // dWhy
          for (let i = 0; i < hSize; i++) Why[i] -= lr * err * hStates[seqLen][i];
          by -= lr * err;
          // grad w.r.t. h at last step
          let dh = new Array(hSize).fill(0);
          for (let i = 0; i < hSize; i++) dh[i] = err * Why[i];
          for (let t = seqLen - 1; t >= 0; t--) {
            const dhRaw = new Array(hSize).fill(0);
            for (let i = 0; i < hSize; i++) dhRaw[i] = dh[i] * (1 - hStates[t + 1][i] ** 2);
            // update Wxh, bh, Whh
            for (let i = 0; i < hSize; i++) {
              Wxh[i] -= lr * dhRaw[i] * xSeq[t];
              bh[i] -= lr * dhRaw[i];
              for (let j = 0; j < hSize; j++) Whh[i][j] -= lr * dhRaw[i] * hStates[t][j];
            }
            // propagate
            const dhPrev = new Array(hSize).fill(0);
            for (let j = 0; j < hSize; j++) for (let i = 0; i < hSize; i++) dhPrev[j] += Whh[i][j] * dhRaw[i];
            dh = dhPrev;
          }
          return loss;
        }

        function trainN(n) {
          const seqLen = +cSeqLen.input.value;
          for (let it = 0; it < n; it++) {
            const start = Math.floor(Math.random() * (fullSeries.length - seqLen - 1));
            const xs = fullSeries.slice(start, start + seqLen);
            const target = fullSeries[start + seqLen];
            const l = step(xs, target);
            lossHistory.push(l);
            iter++;
          }
          draw();
        }

        function predictNext(xSeq) {
          let h = new Array(hSize).fill(0);
          for (let t = 0; t < xSeq.length; t++) {
            const nh = new Array(hSize).fill(0);
            for (let i = 0; i < hSize; i++) {
              let s = Wxh[i] * xSeq[t] + bh[i];
              for (let j = 0; j < hSize; j++) s += Whh[i][j] * h[j];
              nh[i] = Math.tanh(s);
            }
            h = nh;
          }
          let y = by;
          for (let i = 0; i < hSize; i++) y += Why[i] * h[i];
          return y;
        }

        function draw() {
          const seqLen = +cSeqLen.input.value;
          // предсказания на весь ряд
          const preds = [];
          for (let i = seqLen; i < fullSeries.length; i++) {
            preds.push({ x: i, y: predictNext(fullSeries.slice(i - seqLen, i)) });
          }
          const truth = fullSeries.map((v, i) => ({ x: i, y: v }));

          const ctx = container.querySelector('#rnn-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              datasets: [
                { label: 'Истина', data: truth, borderColor: '#94a3b8', borderWidth: 2, pointRadius: 0, fill: false },
                { label: 'Предсказания', data: preds, borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: { x: { type: 'linear', title: { display: true, text: 't' }, min: 0, max: 200 }, y: { title: { display: true, text: 'x(t)' }, suggestedMin: -2.5, suggestedMax: 2.5 } },
            },
          });
          App.registerChart(chart);

          const ctx2 = container.querySelector('#rnn-loss').getContext('2d');
          if (lossChart) lossChart.destroy();
          lossChart = new Chart(ctx2, {
            type: 'line',
            data: { labels: lossHistory.map((_, i) => i), datasets: [{ label: 'Loss', data: lossHistory, borderColor: '#16a34a', borderWidth: 1, pointRadius: 0, fill: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Loss (MSE)' } }, scales: { y: { min: 0 } } },
          });
          App.registerChart(lossChart);

          // train MSE
          let mse = 0; preds.forEach(p => { mse += (p.y - fullSeries[p.x]) ** 2; }); mse /= preds.length;
          container.querySelector('#rnn-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Итераций</div><div class="stat-value">${iter}</div></div>
            <div class="stat-card"><div class="stat-label">Hidden</div><div class="stat-value">${hSize}</div></div>
            <div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${mse.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">Последний loss</div><div class="stat-value">${lossHistory.length ? lossHistory.slice(-1)[0].toFixed(4) : '-'}</div></div>
          `;
        }

        cHidden.input.addEventListener('change', () => { init(); draw(); });
        container.querySelector('#rnn-train').onclick = () => trainN(500);
        container.querySelector('#rnn-step').onclick = () => trainN(50);
        container.querySelector('#rnn-reset').onclick = () => { init(); draw(); };

        init();
        setTimeout(draw, 50);
      },
      },
      {
        title: 'Vanishing gradient: RNN vs LSTM',
        html: `
          <h3>Исчезающий градиент: почему LSTM помнит дольше</h3>
          <p>Распространяем градиент назад по времени через $T$ шагов. В ванильной RNN скрытое состояние сжимается через $\\tanh$, и $\\partial h_t / \\partial h_0 \\sim (W \\cdot \\tanh')^T$ — при $|W \\cdot \\tanh'| < 1$ градиент экспоненциально исчезает. В LSTM есть cell state $c_t$, и если forget gate $f \\approx 1$, градиент течёт по нему почти без затухания.</p>
          <div class="sim-container">
            <div class="sim-controls" id="rnnv-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:360px;"><canvas id="rnnv-chart"></canvas></div>
              <div class="sim-stats" id="rnnv-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#rnnv-controls');
          const cT = App.makeControl('range', 'rnnv-t', 'Длина последовательности T', { min: 5, max: 100, step: 1, value: 40 });
          const cW = App.makeControl('range', 'rnnv-w', 'Вес рекуррентной связи |W|', { min: 0.3, max: 1.5, step: 0.05, value: 0.9 });
          const cF = App.makeControl('range', 'rnnv-f', 'LSTM forget gate f', { min: 0.5, max: 1.0, step: 0.01, value: 0.95 });
          [cT, cW, cF].forEach(c => controls.appendChild(c.wrap));

          let chart = null;

          function compute() {
            const T = +cT.input.value;
            const W = +cW.input.value;
            const f = +cF.input.value;
            // RNN: |∂h_T/∂h_0| ≈ prod |W * tanh'(z_t)|
            // Предполагаем h_t ≈ 0.5 → tanh'(0.5)=1 - tanh²(0.5)≈0.79
            const tanhDeriv = 0.79;
            const rnn = [];
            const lstm = [];
            for (let t = 0; t <= T; t++) {
              rnn.push(Math.pow(W * tanhDeriv, t));
              lstm.push(Math.pow(f, t));
            }
            return { rnn, lstm };
          }

          function draw() {
            const { rnn, lstm } = compute();
            const T = rnn.length - 1;
            const labels = rnn.map((_, i) => i);
            const ctx = container.querySelector('#rnnv-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels,
                datasets: [
                  { label: 'RNN |∂h_t/∂h_0|', data: rnn.map(v => Math.max(1e-12, Math.abs(v))), borderColor: '#ef4444', borderWidth: 2.5, pointRadius: 0, fill: false },
                  { label: 'LSTM |∂c_t/∂c_0| = f^t', data: lstm.map(v => Math.max(1e-12, v)), borderColor: '#10b981', borderWidth: 2.5, pointRadius: 0, fill: false },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Норма градиента по времени (log-шкала)' } },
                scales: {
                  x: { title: { display: true, text: 'шаг t назад от конца' } },
                  y: { type: 'logarithmic', min: 1e-12, max: 10, title: { display: true, text: '|grad|' } },
                },
              },
            });
            App.registerChart(chart);

            const rnnEnd = rnn[T];
            const lstmEnd = lstm[T];
            const ratio = lstmEnd / Math.max(1e-12, Math.abs(rnnEnd));
            container.querySelector('#rnnv-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">T</div><div class="stat-value">${T}</div></div>
              <div class="stat-card"><div class="stat-label">RNN grad @ t=T</div><div class="stat-value">${Math.abs(rnnEnd).toExponential(1)}</div></div>
              <div class="stat-card"><div class="stat-label">LSTM grad @ t=T</div><div class="stat-value">${lstmEnd.toExponential(1)}</div></div>
              <div class="stat-card"><div class="stat-label">LSTM/RNN</div><div class="stat-value">${ratio > 1 ? '×' + ratio.toExponential(1) : ratio.toFixed(2)}</div></div>
            `;
          }

          [cT, cW, cF].forEach(c => c.input.addEventListener('input', draw));
          setTimeout(draw, 50);
        },
      },
      {
        title: 'LSTM-ворота в действии',
        html: `
          <h3>Что делают ворота LSTM</h3>
          <p>На каждом шаге LSTM решает: что забыть из cell state ($f_t$), что добавить ($i_t \\odot \\tilde{c}_t$), что вывести ($o_t$). Здесь показано, как три ворота реагируют на простой входной сигнал.</p>
          <div class="sim-container">
            <div class="sim-controls" id="rnng-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:380px;"><canvas id="rnng-chart"></canvas></div>
              <div class="sim-stats" id="rnng-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#rnng-controls');
          const cSignal = App.makeControl('select', 'rnng-sig', 'Входной сигнал', {
            options: [
              { value: 'pulse', label: 'Одиночный импульс' },
              { value: 'double', label: 'Два импульса' },
              { value: 'step', label: 'Ступенька' },
              { value: 'noise', label: 'Шум + сигнал' },
            ],
            value: 'pulse',
          });
          const cKeep = App.makeControl('range', 'rnng-keep', 'Склонность помнить (bias f)', { min: -2, max: 4, step: 0.1, value: 2 });
          [cSignal, cKeep].forEach(c => controls.appendChild(c.wrap));

          let chart = null;

          function makeSignal(type) {
            const T = 30;
            const x = new Array(T).fill(0);
            if (type === 'pulse') x[5] = 1;
            else if (type === 'double') { x[5] = 1; x[15] = -1; }
            else if (type === 'step') { for (let i = 5; i < 20; i++) x[i] = 1; }
            else { for (let i = 0; i < T; i++) x[i] = (Math.random() - 0.5) * 0.3; x[10] = 1; }
            return x;
          }

          function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

          function run() {
            const x = makeSignal(cSignal.input.value);
            const bf = +cKeep.input.value;
            const T = x.length;
            // fake LSTM: input i_t = sigmoid(x_t*2), f_t = sigmoid(bf - |x_t|*2), o_t = sigmoid(1)
            // c_t = f_t * c_{t-1} + i_t * tanh(x_t*2)
            let c = 0;
            const fs = [], is = [], os = [], cs = [], hs = [];
            for (let t = 0; t < T; t++) {
              const i = sigmoid(x[t] * 3);
              const f = sigmoid(bf - Math.abs(x[t]) * 2);
              const o = sigmoid(1 + Math.abs(x[t]));
              const cand = Math.tanh(x[t] * 2);
              c = f * c + i * cand;
              const h = o * Math.tanh(c);
              is.push(i); fs.push(f); os.push(o); cs.push(c); hs.push(h);
            }

            const ctx = container.querySelector('#rnng-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: x.map((_, i) => i),
                datasets: [
                  { label: 'Вход x_t', data: x, borderColor: '#64748b', borderWidth: 2, pointRadius: 0, fill: false },
                  { label: 'forget f_t', data: fs, borderColor: '#ef4444', borderWidth: 2, pointRadius: 0, fill: false },
                  { label: 'input i_t', data: is, borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0, fill: false },
                  { label: 'cell c_t', data: cs, borderColor: '#10b981', borderWidth: 2.5, pointRadius: 0, fill: false },
                  { label: 'output h_t', data: hs, borderColor: '#a855f7', borderWidth: 2, borderDash: [4, 4], pointRadius: 0, fill: false },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Динамика ворот LSTM' } },
                scales: { x: { title: { display: true, text: 'шаг t' } }, y: { suggestedMin: -1.2, suggestedMax: 1.5 } },
              },
            });
            App.registerChart(chart);

            container.querySelector('#rnng-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Шагов</div><div class="stat-value">${T}</div></div>
              <div class="stat-card"><div class="stat-label">c_T</div><div class="stat-value">${cs.slice(-1)[0].toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Макс |h|</div><div class="stat-value">${Math.max(...hs.map(Math.abs)).toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Средн. f</div><div class="stat-value">${(fs.reduce((a, b) => a + b, 0) / T).toFixed(2)}</div></div>
            `;
          }

          [cSignal, cKeep].forEach(c => c.input.addEventListener('input', run));
          setTimeout(run, 50);
        },
      },
    ],

    python: `
      <h3>RNN и LSTM на Python (PyTorch)</h3>
      <p>Используем nn.LSTM и nn.GRU для предсказания последовательностей. Показываем pack/pad для переменной длины.</p>

      <h4>1. nn.LSTM: предсказание следующего значения в синусе</h4>
      <pre><code>import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt

# Генерируем обучающие данные: предсказываем sin(t+1) по sin(t)
t      = np.linspace(0, 4 * np.pi, 500)
signal = np.sin(t).astype(np.float32)

# Создаём пары (вход, таргет): сдвиг на 1 шаг вперёд
seq_len = 20      # длина входного окна
X, y = [], []
for i in range(len(signal) - seq_len):
    X.append(signal[i : i + seq_len])
    y.append(signal[i + seq_len])   # следующее значение после окна

X = torch.tensor(X).unsqueeze(-1)   # [N, seq_len, 1] — добавляем признак
y = torch.tensor(y).unsqueeze(-1)   # [N, 1]

# Модель: LSTM → линейный выход
class LSTMPredictor(nn.Module):
    def __init__(self, input_size=1, hidden_size=32, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers,
                            batch_first=True,   # вход: [batch, seq, features]
                            dropout=0.1)
        self.fc   = nn.Linear(hidden_size, 1)

    def forward(self, x):
        out, (h, c) = self.lstm(x)    # out: [batch, seq, hidden]
        return self.fc(out[:, -1, :]) # берём только последний шаг

model     = LSTMPredictor()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn   = nn.MSELoss()

# Обучение
for epoch in range(100):
    model.train()
    optimizer.zero_grad()
    pred = model(X)
    loss = loss_fn(pred, y)
    loss.backward()
    optimizer.step()
    if epoch % 20 == 0:
        print(f"Epoch {epoch:3d}: MSE={loss.item():.5f}")
</code></pre>

      <h4>2. nn.GRU vs LSTM — сравнение архитектур</h4>
      <pre><code>import torch
import torch.nn as nn

# GRU — упрощённый вариант LSTM (меньше параметров, часто не хуже)
class GRUModel(nn.Module):
    def __init__(self, input_size=1, hidden_size=32):
        super().__init__()
        self.gru = nn.GRU(input_size, hidden_size, batch_first=True)
        self.fc  = nn.Linear(hidden_size, 1)

    def forward(self, x):
        out, h = self.gru(x)          # GRU не имеет cell state (только h)
        return self.fc(out[:, -1, :])

# Сравниваем количество параметров
lstm_model = nn.LSTM(1, 32, batch_first=True)
gru_model  = nn.GRU(1,  32, batch_first=True)

lstm_params = sum(p.numel() for p in lstm_model.parameters())
gru_params  = sum(p.numel() for p in gru_model.parameters())

print(f"LSTM параметров: {lstm_params}")  # ~4 ворота * (32+1)*32 + 32
print(f"GRU  параметров: {gru_params}")   # ~3 ворота — на 25% меньше

# Скорость прямого прохода
x = torch.randn(32, 50, 1)  # батч 32, длина 50, 1 признак
import time
for name, m in [('LSTM', lstm_model), ('GRU', gru_model)]:
    start = time.time()
    for _ in range(1000):
        _ = m(x)
    print(f"{name}: {(time.time()-start)*1000:.1f} ms за 1000 прогонов")
</code></pre>

      <h4>3. Pack/Pad: работа с последовательностями разной длины</h4>
      <pre><code>import torch
import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence, pad_sequence

# Последовательности разной длины (как в NLP — предложения разной длины)
seqs = [
    torch.randn(5, 4),   # последовательность длины 5, 4 признака
    torch.randn(3, 4),   # длины 3
    torch.randn(8, 4),   # длины 8
]

# Паддинг: дополняем нулями до максимальной длины
padded = pad_sequence(seqs, batch_first=True)   # [3, 8, 4]
lengths = torch.tensor([5, 3, 8])               # реальные длины

# Сортируем по убыванию длины (требование pack_padded_sequence)
lengths, sort_idx = lengths.sort(descending=True)
padded = padded[sort_idx]

# Pack: убираем лишние нули — LSTM не обрабатывает паддинг
packed = pack_padded_sequence(padded, lengths, batch_first=True)

lstm = nn.LSTM(4, 16, batch_first=True)
packed_out, (h, c) = lstm(packed)

# Unpack: восстанавливаем форму [batch, seq, hidden]
output, out_lengths = pad_packed_sequence(packed_out, batch_first=True)
print(f"Выход после unpack: {output.shape}")     # [3, 8, 16]
print(f"Последний hidden:   {h.shape}")          # [1, 3, 16]

# Для классификации берём h последнего реального шага
last_hidden = h[-1]   # [batch, hidden]
print(f"Для классификации: {last_hidden.shape}")
</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Прогнозирование временных рядов.</b> Продажи, спрос, энергопотребление, котировки. LSTM/GRU до сих пор рабочая лошадка там, где данных мало и сезонность сложная — Transformer требует слишком много примеров, а ARIMA не тянет нелинейности.</li>
        <li><b>Распознавание речи и акустические модели.</b> LSTM + CTC — классика ASR до эры Whisper. В on-device распознавании (Siri, Google Assistant на телефоне) LSTM всё ещё используются из-за низкой latency и малого memory footprint.</li>
        <li><b>Онлайн-обработка потоков.</b> Датчики IoT, мониторинг оборудования, детекция аномалий в реальном времени. RNN обрабатывает один sample за раз и хранит скрытое состояние — идеально для streaming, где Transformer требует весь контекст сразу.</li>
        <li><b>Генерация музыки и char-level задачи.</b> Magenta (Google), MuseNet. LSTM хорошо моделирует длинные периодические структуры, и для генерации MIDI/char-последовательностей его всё ещё применяют вместо громоздкого Transformer.</li>
        <li><b>Видеоаналитика (CNN + LSTM).</b> Описание видео, action recognition, трекинг. CNN извлекает признаки из кадров, LSTM моделирует их эволюцию по времени. Простая и работающая схема для коротких клипов.</li>
        <li><b>Прогноз траекторий.</b> Движение пешеходов, автомобилей, курсоров. В автономном вождении LSTM предсказывает следующие позиции объектов по их истории за несколько секунд.</li>
        <li><b>Анализ последовательностей биоинформатики.</b> ДНК/белковые последовательности, где модель должна помнить контекст в сотнях позиций. На малых задачах LSTM ещё конкурирует с Transformer.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Обрабатывают переменную длину входа нативно.</b> Классические модели требуют фиксированной размерности — для текста или временного ряда это боль. RNN разворачивается на любое число шагов, используя одни и те же веса, что делает архитектуру элегантно компактной.</p>
      <p><b>Weight sharing по времени.</b> Тот же блок применяется на каждом шаге — количество параметров не зависит от длины последовательности. LSTM на 10 шагах и на 1000 шагах — это одни и те же веса. Это огромная экономия по сравнению с MLP на развёрнутом входе.</p>
      <p><b>LSTM/GRU умеют хранить долгие зависимости.</b> Cell state и gate mechanism позволяют сохранять информацию в течение сотен шагов — это решение проблемы vanishing gradient, которая убивала простые RNN.</p>
      <p><b>Онлайн-инкрементальная обработка.</b> RNN обновляет скрытое состояние по одному элементу — идеально для streaming, где надо выдавать ответ «прямо сейчас, не дожидаясь конца последовательности». Transformer так не умеет без дополнительных трюков.</p>
      <p><b>Малый memory footprint.</b> На inference хранится только последнее скрытое состояние ($h_t$, $c_t$) — десятки килобайт. Это критично для embedded-устройств, где Transformer со своим O(n²) attention просто не влезает.</p>
      <p><b>Работают на малых датасетах.</b> Благодаря сильному inductive bias (последовательность, локальность, рекуррентность) LSTM учится на сотнях примеров там, где Transformer требует десятки тысяч. Для редких задач с ограниченными данными это решающий фактор.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Плохо параллелятся.</b> Чтобы посчитать $h_t$, нужно сначала посчитать $h_{t-1}$. На GPU это означает, что длинная последовательность обрабатывается последовательно — GPU простаивает. Transformer параллелит все позиции сразу и поэтому обучается в десятки раз быстрее.</p>
      <p><b>Проигрывают Transformer практически во всём NLP.</b> Машинный перевод, языковое моделирование, QA, summarization, classification — везде Transformer-модели (BERT, GPT, T5) опережают LSTM по качеству в разы. Для современных NLP-задач brать RNN — это сознательно выбрать худшую модель.</p>
      <p><b>Даже LSTM имеет предел памяти.</b> На последовательностях длиной 1000+ LSTM начинает забывать начало — gates не способны «идеально» сохранять информацию на такое количество шагов. Attention решает это в один skip, у LSTM такого механизма нет.</p>
      <p><b>Vanishing/exploding gradients.</b> Даже с LSTM/GRU обучение на длинных последовательностях требует gradient clipping, carefully выбранного learning rate и часто truncated BPTT. Tuning хрупкий, и одна неправильная настройка ломает всё обучение.</p>
      <p><b>Сложно адаптировать под bidirectional-задачи.</b> BiLSTM удваивает параметры и всё равно проигрывает self-attention, который естественно смотрит во все стороны. Для задач понимания (NER, classification) Transformer нативно подходит лучше.</p>

      <h3>🧭 Когда брать RNN/LSTM — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери RNN/LSTM когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Онлайн-обработка потока в реальном времени с малой latency</td>
          <td>Нужна SOTA-модель для NLP — возьми Transformer (BERT/GPT/LLaMA)</td>
        </tr>
        <tr>
          <td>Прогноз временных рядов на малом датасете (сотни-тысячи точек)</td>
          <td>Есть десятки тысяч примеров и ресурсы — Transformer обгонит по качеству</td>
        </tr>
        <tr>
          <td>Embedded / on-device задачи, где memory footprint критичен</td>
          <td>Нужна максимальная параллелизация на GPU — LSTM последовательна</td>
        </tr>
        <tr>
          <td>Streaming ASR с жёстким требованием обработки по одному фрейму</td>
          <td>Последовательности длиной 1000+ шагов и важны далёкие зависимости</td>
        </tr>
        <tr>
          <td>CNN + LSTM для коротких видео — простая и рабочая схема</td>
          <td>Машинный перевод, summarization, QA — там Transformer-стандарт</td>
        </tr>
        <tr>
          <td>Нужен сильный inductive bias на последовательность при дефиците данных</td>
          <td>Задача табличная или визуальная — RNN нерелевантна</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('transformer')">Transformer</a></b> — стандарт де-факто для всего NLP и большинства задач на последовательностях. Параллелится, масштабируется, даёт SOTA.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('time-series')">Классические методы временных рядов</a> (ARIMA, Prophet)</b> — если данных мало и важна интерпретируемость сезонности и трендов.</li>
        <li><b>Temporal Convolutional Networks (TCN)</b> — свёрточная альтернатива RNN для последовательностей: параллелится, стабильнее обучается, часто не хуже LSTM.</li>
        <li><b>Gradient Boosting на лаговых признаках</b> — если задача предсказать одну величину вперёд: XGBoost/LightGBM на лагах часто бьёт LSTM при минимуме усилий.</li>
      </ul>
    `,

    extra: `
      <h3>seq2seq (encoder-decoder)</h3>
      <p>Encoder RNN читает вход, кодирует в вектор. Decoder RNN генерирует выход. Основа машинного перевода до Transformer.</p>

      <h3>Attention (предшественник Transformer)</h3>
      <p>Вместо одного вектора в seq2seq, decoder смотрит на все hidden states encoder с весами (attention). Это решило проблему узкого горла.</p>

      <h3>Gradient clipping</h3>
      <p>Для борьбы с exploding gradients в RNN: обрезаем норму градиента.</p>
      <div class="math-block">$$\\text{if } \\|g\\| > \\text{thr}: g \\gets g \\cdot \\text{thr} / \\|g\\|$$</div>

      <h3>Типы RNN задач</h3>
      <ul>
        <li><b>one-to-one</b>: обычная классификация (не RNN).</li>
        <li><b>one-to-many</b>: генерация последовательности из одного входа (image captioning).</li>
        <li><b>many-to-one</b>: sentiment analysis.</li>
        <li><b>many-to-many (sync)</b>: POS-tagging.</li>
        <li><b>many-to-many (async)</b>: машинный перевод.</li>
      </ul>

      <h3>Teacher forcing</h3>
      <p>При обучении decoder подаём реальный предыдущий токен (не предсказанный). Ускоряет обучение, но создаёт разрыв между train и inference.</p>

      <h3>Beam search</h3>
      <p>При генерации — храним top-k гипотез, выбираем из них. Даёт более качественный выход, чем жадный decoding.</p>

      <h3>Закат RNN</h3>
      <p>С 2018 RNN постепенно вытеснены Transformer-ами в NLP. Но остаются актуальны для стриминга, онлайн-обработки, маленьких моделей, time series.</p>
    `,
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=YCzL96nL7j0" target="_blank">StatQuest: LSTM</a> — понятное объяснение ячейки LSTM и потоков градиентов</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://colah.github.io/posts/2015-08-Understanding-LSTMs/" target="_blank">Colah's blog: Understanding LSTM Networks</a> — классическое визуальное объяснение LSTM</li>
        <li><a href="https://habr.com/ru/search/?q=LSTM%20%D1%80%D0%B5%D0%BA%D1%83%D1%80%D1%80%D0%B5%D0%BD%D1%82%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5%20%D1%81%D0%B5%D1%82%D0%B8" target="_blank">Habr: LSTM и GRU</a> — разбор архитектур с кодом на PyTorch</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://pytorch.org/docs/stable/generated/torch.nn.LSTM.html" target="_blank">PyTorch LSTM</a> — официальная документация с параметрами и примерами</li>
      </ul>
    `,
  },
});
