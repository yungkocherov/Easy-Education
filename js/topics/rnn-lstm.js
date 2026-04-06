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

      <h3>⚠️ Проблема vanishing gradients</h3>
      <p>Главная болезнь vanilla RNN. При BPTT через много шагов градиент умножается на $W_{hh}$ снова и снова. Если собственные значения меньше 1 — градиент <b>затухает</b> экспоненциально.</p>
      <p>Последствие: сеть <b>не может помнить далёкое прошлое</b>. Связи длиной больше 10-20 шагов почти не обучаются.</p>
      <p>Альтернатива — <b>exploding gradients</b>: если собственные значения > 1, градиенты взрываются. Решается gradient clipping.</p>

      <h3>🏗️ LSTM — революция в памяти</h3>
      <p><span class="term" data-tip="Long Short-Term Memory. Специальная архитектура RNN с механизмом 'гейтов', решающая проблему vanishing gradients. Может помнить контекст на сотни шагов.">LSTM</span> (1997) решает проблему vanishing gradients через <b>cell state</b> — отдельный «канал памяти» с аддитивными обновлениями.</p>

      <p>LSTM добавляет три <b>гейта</b> (ворота), контролирующие информацию:</p>

      <h4>Forget gate (что забыть)</h4>
      <div class="math-block">$$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$$</div>
      <p>Решает, какие элементы старой памяти нужно «забыть». Сигмоида выдаёт значения от 0 до 1 для каждого элемента cell state.</p>

      <h4>Input gate (что записать)</h4>
      <div class="math-block">$$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)$$</div>
      <p>Решает, какие новые данные добавить в память.</p>

      <h4>Output gate (что показать)</h4>
      <div class="math-block">$$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o)$$</div>
      <p>Контролирует, что из памяти выдавать наружу как выход.</p>

      <h4>Обновление cell state</h4>
      <div class="math-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$$</div>

      <p>Ключевой момент: cell state обновляется <b>аддитивно</b> — то есть градиенты проходят через неё без экспоненциального затухания. Поэтому LSTM может помнить сотни шагов назад.</p>

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
        <summary>Подробнее: seq2seq и attention</summary>
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
        title: 'RNN forward на 3 шагах',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Прогнать последовательность $x = (1,\; 0,\; -1)$ через простую RNN с размером hidden state $h = 1$ (скалярный). Веса: $W_{xh} = 0{,}5$, $W_{hh} = 0{,}8$, $b_h = 0{,}1$. Начальное состояние $h_0 = 0$. Вычислить $h_1, h_2, h_3$.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 155" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <marker id="rnn-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                </marker>
                <marker id="rnn-arr-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0,6 3,0 6" fill="#3b82f6"/>
                </marker>
              </defs>
              <!-- h0 box -->
              <rect x="10" y="55" width="60" height="44" rx="6" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5"/>
              <text x="40" y="74" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">h₀</text>
              <text x="40" y="88" text-anchor="middle" font-size="10" fill="#64748b">= 0</text>
              <!-- Arrow h0 → RNN1 -->
              <line x1="70" y1="77" x2="100" y2="77" stroke="#3b82f6" stroke-width="2" marker-end="url(#rnn-arr-b)"/>
              <!-- x1 input arrow -->
              <line x1="130" y1="10" x2="130" y2="52" stroke="#f59e0b" stroke-width="2" marker-end="url(#rnn-arr)"/>
              <text x="130" y="8" text-anchor="middle" font-size="10" fill="#f59e0b" font-weight="600">x₁=1</text>
              <!-- RNN step 1 box -->
              <rect x="100" y="55" width="60" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
              <text x="130" y="72" text-anchor="middle" font-size="10" fill="#1e40af" font-weight="600">RNN</text>
              <text x="130" y="86" text-anchor="middle" font-size="10" fill="#1e40af">h₁=0.54</text>
              <!-- Arrow RNN1 → RNN2 -->
              <line x1="160" y1="77" x2="190" y2="77" stroke="#3b82f6" stroke-width="2" marker-end="url(#rnn-arr-b)"/>
              <!-- x2 input arrow -->
              <line x1="220" y1="10" x2="220" y2="52" stroke="#f59e0b" stroke-width="2" marker-end="url(#rnn-arr)"/>
              <text x="220" y="8" text-anchor="middle" font-size="10" fill="#f59e0b" font-weight="600">x₂=0</text>
              <!-- RNN step 2 box -->
              <rect x="190" y="55" width="60" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
              <text x="220" y="72" text-anchor="middle" font-size="10" fill="#1e40af" font-weight="600">RNN</text>
              <text x="220" y="86" text-anchor="middle" font-size="10" fill="#1e40af">h₂=0.49</text>
              <!-- Arrow RNN2 → RNN3 -->
              <line x1="250" y1="77" x2="280" y2="77" stroke="#3b82f6" stroke-width="2" marker-end="url(#rnn-arr-b)"/>
              <!-- x3 input arrow -->
              <line x1="310" y1="10" x2="310" y2="52" stroke="#ef4444" stroke-width="2" marker-end="url(#rnn-arr)"/>
              <text x="310" y="8" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="600">x₃=−1</text>
              <!-- RNN step 3 box -->
              <rect x="280" y="55" width="60" height="44" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
              <text x="310" y="72" text-anchor="middle" font-size="10" fill="#1e40af" font-weight="600">RNN</text>
              <text x="310" y="86" text-anchor="middle" font-size="10" fill="#1e40af">h₃=−0.01</text>
              <!-- Arrow to output -->
              <line x1="340" y1="77" x2="380" y2="77" stroke="#64748b" stroke-width="1.8" marker-end="url(#rnn-arr)"/>
              <text x="400" y="74" text-anchor="middle" font-size="10" fill="#64748b">выход</text>
              <!-- Recurrent connection labels -->
              <text x="85" y="70" text-anchor="middle" font-size="8" fill="#3b82f6">W_hh</text>
              <text x="175" y="70" text-anchor="middle" font-size="8" fill="#3b82f6">W_hh</text>
              <text x="265" y="70" text-anchor="middle" font-size="8" fill="#3b82f6">W_hh</text>
              <!-- Time axis -->
              <line x1="10" y1="118" x2="370" y2="118" stroke="#64748b" stroke-width="1" marker-end="url(#rnn-arr)"/>
              <text x="190" y="132" text-anchor="middle" font-size="9" fill="#64748b">время →</text>
              <text x="40" y="112" text-anchor="middle" font-size="8" fill="#64748b">t=0</text>
              <text x="130" y="112" text-anchor="middle" font-size="8" fill="#64748b">t=1</text>
              <text x="220" y="112" text-anchor="middle" font-size="8" fill="#64748b">t=2</text>
              <text x="310" y="112" text-anchor="middle" font-size="8" fill="#64748b">t=3</text>
              <!-- Weights legend -->
              <text x="390" y="120" font-size="8" fill="#64748b">W_xh=0.5</text>
              <text x="390" y="132" font-size="8" fill="#3b82f6">W_hh=0.8</text>
              <text x="390" y="144" font-size="8" fill="#64748b">b=0.1</text>
            </svg>
            <div class="caption">RNN forward на 3 шагах: каждый блок получает вход xₜ и скрытое состояние hₜ₋₁, выдаёт hₜ=tanh(). h₁=0.54 → h₂=0.49 (память затухает) → h₃=−0.01 (отрицательный вход побеждает).</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Шаг $t$</th><th>Вход $x_t$</th><th>Предыдущее $h_{t-1}$</th><th>$z_t = W_{xh}x_t + W_{hh}h_{t-1} + b$</th><th>$h_t = \\tanh(z_t)$</th></tr>
              <tr><td>1</td><td>1</td><td>0</td><td>$0{,}5\\cdot1 + 0{,}8\\cdot0 + 0{,}1 = 0{,}6$</td><td>$\\tanh(0{,}6) = 0{,}537$</td></tr>
              <tr><td>2</td><td>0</td><td>0,537</td><td>$0{,}5\\cdot0 + 0{,}8\\cdot0{,}537 + 0{,}1 = 0{,}530$</td><td>$\\tanh(0{,}530) = 0{,}485$</td></tr>
              <tr><td>3</td><td>−1</td><td>0,485</td><td>$0{,}5\\cdot(-1) + 0{,}8\\cdot0{,}485 + 0{,}1 = -0{,}012$</td><td>$\\tanh(-0{,}012) = -0{,}012$</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: входной сигнал $x_1 = 1$</h4>
            <div class="calc">$z_1 = W_{xh} \\cdot x_1 + W_{hh} \\cdot h_0 + b_h = 0{,}5 \\cdot 1 + 0{,}8 \\cdot 0 + 0{,}1 = 0{,}6$</div>
            <div class="calc">$h_1 = \\tanh(0{,}6) \\approx 0{,}537$</div>
            <div class="why">В начале $h_0 = 0$ — нет прошлой памяти. На первом шаге hidden state определяется только текущим входом. $\\tanh$ сжимает вывод в $(-1, 1)$ — это и есть «представление прошлого».</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: нулевой вход $x_2 = 0$, но есть память $h_1$</h4>
            <div class="calc">$z_2 = 0{,}5 \\cdot 0 + 0{,}8 \\cdot 0{,}537 + 0{,}1 = 0 + 0{,}430 + 0{,}1 = 0{,}530$</div>
            <div class="calc">$h_2 = \\tanh(0{,}530) \\approx 0{,}485$</div>
            <div class="why">Вход нулевой, но $h_2 \approx 0{,}485$ — всё ещё положительный! Это «эхо» от $x_1=1$: через рекуррентную связь $W_{hh} = 0{,}8$ память сохраняется. Коэффициент 0,8 — «сила памяти».</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: отрицательный вход $x_3 = -1$ борется с памятью</h4>
            <div class="calc">$z_3 = 0{,}5 \\cdot (-1) + 0{,}8 \\cdot 0{,}485 + 0{,}1 = -0{,}5 + 0{,}388 + 0{,}1 = -0{,}012$</div>
            <div class="calc">$h_3 = \\tanh(-0{,}012) \\approx -0{,}012$</div>
            <div class="why">Отрицательный вход $(-0{,}5)$ почти скомпенсировал положительную память $(+0{,}388)$ и bias $(+0{,}1)$. Итог близок к нулю: «сигнал от прошлого почти вытеснен». RNN учится балансировать прошлое и настоящее.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Как затухает память: математика</h4>
            <div class="calc">
              Если $x_t = 0$ для всех $t > 1$, то $h_t = \\tanh(W_{hh} \\cdot h_{t-1})$<br>
              При малых значениях $\\tanh(z) \\approx z$, поэтому $h_t \\approx W_{hh}^{t-1} \\cdot h_1 = 0{,}8^{t-1} \\cdot 0{,}537$<br>
              $t=1$: 0,537; $t=5$: $0{,}8^4 \\cdot 0{,}537 \\approx 0{,}22$; $t=10$: $0{,}8^9 \\cdot 0{,}537 \\approx 0{,}07$; $t=20$: $0{,}8^{19} \\approx 0{,}008$
            </div>
            <div class="why">Через 20 шагов от $h_1$ осталось менее 1,5%! Это экспоненциальное затухание памяти в vanilla RNN. Для длинных зависимостей нужен LSTM.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>$h_1 = 0{,}537$, $h_2 = 0{,}485$, $h_3 = -0{,}012$. Hidden state аккумулирует информацию о прошлых входах через рекуррентный вес $W_{hh}=0{,}8$. Память затухает как $0{,}8^t$ — экспоненциально быстро для далёких событий.</p>
          </div>

          <div class="lesson-box">
            <b>Физический смысл $W_{hh}$:</b> если $|W_{hh}| < 1$ — память затухает (vanishing gradient). Если $|W_{hh}| > 1$ — память растёт (exploding gradient). Идеально $|W_{hh}| = 1$, но тогда нет избирательной памяти. LSTM решает это через гейты.
          </div>
        `
      },
      {
        title: 'Vanishing gradient числами',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как градиент затухает при обратном распространении через 10 шагов RNN. Веса $W_{hh} = 0{,}8$, функция активации $\\tanh$ (производная: $\\tanh'(z) = 1 - \\tanh^2(z) \\leq 1$). Начальный градиент с конца: $\\delta_T = 1$.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Шаг назад</th><th>Градиент $\\delta_t$</th><th>Остаток от начального</th></tr>
              <tr><td>$T$ (конец)</td><td>$1{,}000$</td><td>100%</td></tr>
              <tr><td>$T-1$</td><td>$\\approx 0{,}640$</td><td>64%</td></tr>
              <tr><td>$T-2$</td><td>$\\approx 0{,}410$</td><td>41%</td></tr>
              <tr><td>$T-5$</td><td>$\\approx 0{,}107$</td><td>11%</td></tr>
              <tr><td>$T-10$</td><td>$\\approx 0{,}011$</td><td>1,1%</td></tr>
              <tr><td>$T-20$</td><td>$\\approx 0{,}0001$</td><td>0,01%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Формула backpropagation through time</h4>
            <p>При BPTT градиент на шаге $t$ связан с шагом $t+1$ через:</p>
            <div class="math-block">$$\\delta_t = \\delta_{t+1} \\cdot W_{hh} \\cdot (1 - h_t^2)$$</div>
            <div class="why">Каждый шаг назад умножает градиент на $W_{hh}$ и на $\\tanh'(z_t) = (1-h_t^2)$. Оба множителя меньше 1 (при типичных активациях). Произведение стремительно уменьшается.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Оценка одного шага: типичный случай</h4>
            <div class="calc">
              Предположим $h_t \\approx 0{,}5$ (умеренная активация), тогда $\\tanh'(z_t) = 1 - 0{,}5^2 = 0{,}75$<br>
              Один шаг назад: $\\delta_t \\approx \\delta_{t+1} \\times 0{,}8 \\times 0{,}75 = \\delta_{t+1} \\times 0{,}60$
            </div>
            <div class="why">Каждый шаг назад: градиент умножается на ~0,6. Это геометрически убывающая прогрессия.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Через 10 шагов назад</h4>
            <div class="calc">$\\delta_{T-10} \\approx 0{,}60^{10} \\cdot \\delta_T = 0{,}006 \\cdot \\delta_T$</div>
            <div class="why">Меньше 1% от исходного! Параметры на шагах $T-10$ и ранее почти не обучаются — их градиент фактически ноль. Если полезная информация была на шаге $T-10$, модель её «не слышит».</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сравнение: что делает LSTM</h4>
            <p>В LSTM cell state обновляется аддитивно:</p>
            <div class="math-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$$</div>
            <div class="calc">
              Градиент по $c_{t-1}$: $\\partial L / \\partial c_{t-1} = (\\partial L / \\partial c_t) \\cdot f_t$<br>
              Если $f_t \\approx 1$ (forget gate открыт): градиент проходит НЕТРОНУТЫМ!<br>
              После 10 шагов: $\\delta_{T-10} \\approx f^{10} \\cdot \\delta_T \\approx 1{,}0^{10} \\cdot \\delta_T = \\delta_T$
            </div>
            <div class="why">Это «магия» LSTM: аддитивное обновление cell state создаёт «шоссе» для градиента. Он не умножается на матрицы снова и снова — он просто «течёт» через forget gate с минимальным затуханием.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Когда vanishing gradient не страшен</h4>
            <div class="calc">
              Если нужная зависимость — длиной 3-5 шагов: $0{,}6^5 \\approx 0{,}08$ — 8%, обучится<br>
              Если длиной 10 шагов: $0{,}6^{10} \\approx 0{,}006$ — 0,6%, трудно<br>
              Если длиной 50 шагов: $0{,}6^{50} \\approx 10^{-11}$ — невозможно
            </div>
            <div class="why">Практическое правило для vanilla RNN: надёжно работает на зависимостях до 5–10 шагов. Для более длинных нужны LSTM/GRU (до 100–200), или Transformer (любая длина за 1 шаг).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>При $W_{hh} = 0{,}8$ и $\\tanh'(z) \\approx 0{,}75$ за 10 шагов назад градиент уменьшается в ~170 раз (до ~0,6%). LSTM решает проблему через аддитивное обновление cell state с forget gate близким к 1 — градиент течёт без экспоненциального затухания.</p>
          </div>

          <div class="lesson-box">
            <b>Интуиция:</b> vanishing gradient — это «забывание», exploding gradient — «паника». Vanilla RNN страдает от обоих. LSTM — это умный фильтр памяти: он решает, что помнить долго (c через forget gate), а что — только сейчас (h через output gate).
          </div>
        `
      },
      {
        title: 'LSTM гейты интуитивно',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Проследить работу LSTM-гейтов при чтении предложения «Маша любит кошек, а Дима — собак». Для каждого слова — объяснить, что открывается и закрывается. Числа упрощённые, для иллюстрации идеи.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Слово</th><th>Forget gate $f_t$</th><th>Input gate $i_t$</th><th>Output gate $o_t$</th><th>Что в памяти $c_t$</th></tr>
              <tr><td>Маша</td><td>0,1 (сбрасываем старое)</td><td>0,9 (запоминаем субъект)</td><td>0,7 (выдаём)</td><td>«субъект: Маша, жен. р.»</td></tr>
              <tr><td>любит</td><td>0,9 (сохраняем субъект)</td><td>0,8 (добавляем глагол)</td><td>0,5</td><td>«Маша, любит»</td></tr>
              <tr><td>кошек</td><td>0,9</td><td>0,7 (объект 1)</td><td>0,6</td><td>«Маша любит кошек»</td></tr>
              <tr><td>, а</td><td>0,3 (частичный сброс)</td><td>0,2 (союз)</td><td>0,2</td><td>«любит, противопост.»</td></tr>
              <tr><td>Дима</td><td>0,2 (новый субъект!)</td><td>0,9 (новый субъект)</td><td>0,8</td><td>«субъект: Дима, муж. р.»</td></tr>
              <tr><td>собак</td><td>0,9</td><td>0,7</td><td>0,7</td><td>«Дима любит собак»</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Forget gate: «что забыть»</h4>
            <div class="calc">$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f) \\in (0, 1)$</div>
            <div class="calc">$c_t^{\\text{new}} \\leftarrow f_t \\odot c_{t-1}$</div>
            <div class="why">$f_t$ близко к 0 → «стереть» информацию. $f_t$ близко к 1 → «сохранить». При чтении «а» — частичный сброс (0,3): мы помним, что было предложение, но готовимся к новому субъекту. При «Дима» — $f_t \approx 0{,}2$: сбрасываем «Маша» из активной памяти.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Input gate: «что запомнить»</h4>
            <div class="calc">$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i) \\in (0, 1)$</div>
            <div class="calc">$\\tilde{c}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c) \\in (-1, 1)$</div>
            <div class="calc">$c_t^{\\text{add}} \\leftarrow i_t \\odot \\tilde{c}_t$ (новая информация)</div>
            <div class="why">$i_t$ решает, насколько сильно записать новый сигнал $\\tilde{c}_t$. При слове «Маша» (начало предложения): $i_t \approx 0{,}9$ — важно запомнить субъект. При союзе «а»: $i_t \approx 0{,}2$ — служебное слово, мало полезного.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Cell state: аддитивное обновление (ключ к долгой памяти)</h4>
            <div class="calc">$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$</div>
            <div class="calc">
              На шаге «Маша»: $c_1 = 0{,}1 \\cdot c_0 + 0{,}9 \\cdot \\tilde{c}_1 \\approx 0 + 0{,}9 \\cdot c_{\\text{Маша}}$<br>
              На шаге «любит»: $c_2 = 0{,}9 \\cdot c_1 + 0{,}8 \\cdot c_{\\text{любит}} \\approx 0{,}81 c_{\\text{Маша}} + 0{,}8 c_{\\text{любит}}$<br>
              На шаге «кошек»: $c_3 \\approx 0{,}73 c_{\\text{Маша}} + 0{,}72 c_{\\text{любит}} + 0{,}7 c_{\\text{кошек}}$
            </div>
            <div class="why">«Маша» всё ещё присутствует в памяти через 3 шага с весом ~0,73! В vanilla RNN: $0{,}6^3 \\approx 0{,}22$. LSTM сохраняет информацию в 3 раза лучше за те же шаги, а при $f \approx 1$ — практически без потерь.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Output gate: «что показать»</h4>
            <div class="calc">$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o)$</div>
            <div class="calc">$h_t = o_t \\odot \\tanh(c_t)$</div>
            <div class="why">$h_t$ — это «видимая» часть памяти, которая передаётся следующему слою и в следующий шаг. $c_t$ — «внутренняя» долгосрочная память. Output gate фильтрует: показать всё или только часть. Например, при «Она» — output gate для «Маша, жен. р.» открывается.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Числовой пример: разрешение местоимения «она»</h4>
            <div class="calc">
              Предположим: «субъект:Маша» кодируется как $c_{\\text{fem}} = +1$, «субъект:Дима» — $c_{\\text{masc}} = -1$<br>
              После «Маша»: $c_t[\\text{gender}] \\approx +0{,}9$<br>
              Через 4 слова («кошек, а Дима»): $c_t[\\text{gender}] \\approx 0{,}9^3 \\cdot (+0{,}9) = +0{,}66$ (всё ещё женский!)<br>
              После «Дима»: $f_t = 0{,}2$, $c_t[\\text{gender}] = 0{,}2 \\cdot 0{,}66 + 0{,}9 \\cdot (-0{,}9) = +0{,}13 - 0{,}81 = -0{,}68$ (теперь мужской)
            </div>
            <div class="why">Вот как LSTM разрешает кореференции: информация о роде субъекта хранится в cell state, обновляется при появлении нового субъекта. Это то, что NLP-модели учат автоматически из текста!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>LSTM управляет памятью через три гейта: forget (что стереть), input (что записать), output (что показать). Cell state — долгосрочная память, hidden state — оперативная. При чтении текста: субъект запоминается при появлении, сохраняется через предложение, используется при разрешении местоимения.</p>
          </div>

          <div class="lesson-box">
            <b>Аналогия с RAM/ROM:</b> cell state $c_t$ — это жёсткий диск (долгосрочное хранение), hidden state $h_t$ — оперативная память (то, с чем работаем прямо сейчас). Forget gate — «delete», input gate — «write», output gate — «read». Три операции управления памятью.
          </div>
        `
      },
    ],

    simulation: {
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
              scales: { x: { type: 'linear', title: { display: true, text: 't' }, min: 0, max: 200 }, y: { title: { display: true, text: 'x(t)' }, min: -2.5, max: 2.5 } },
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
      <h3>Где применяется</h3>
      <ul>
        <li><b>NLP</b> — классификация текста, NER, POS-tagging (до Transformer).</li>
        <li><b>Машинный перевод</b> — seq2seq с encoder-decoder.</li>
        <li><b>Распознавание речи</b> — LSTM + CTC loss.</li>
        <li><b>Time series forecasting</b> — прогноз продаж, цен.</li>
        <li><b>Генерация текста и музыки</b> — char-RNN.</li>
        <li><b>Video analysis</b> — CNN + LSTM для описания видео.</li>
        <li><b>Трекинг</b> — предсказание траекторий.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Обрабатывает переменную длину входа</li>
            <li>Разделяет веса по времени — компактно</li>
            <li>LSTM/GRU помнят долгие зависимости</li>
            <li>Хорошо для онлайн-обработки</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Последовательная обработка — плохо параллелится</li>
            <li>Медленное обучение</li>
            <li>Даже LSTM имеет ограничения на очень длинные последовательности</li>
            <li>Проигрывают Transformer на большинстве NLP задач</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Vanilla RNN</h3>
      <div class="math-block">$$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$$</div>
      <div class="math-block">$$y_t = W_{hy} h_t + b_y$$</div>

      <h3>LSTM</h3>
      <div class="math-block">$$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f) \\quad \\text{forget}$$</div>
      <div class="math-block">$$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i) \\quad \\text{input}$$</div>
      <div class="math-block">$$\\tilde{c}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c) \\quad \\text{candidate}$$</div>
      <div class="math-block">$$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t \\quad \\text{cell update}$$</div>
      <div class="math-block">$$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o) \\quad \\text{output}$$</div>
      <div class="math-block">$$h_t = o_t \\odot \\tanh(c_t)$$</div>

      <h3>GRU</h3>
      <div class="math-block">$$z_t = \\sigma(W_z [h_{t-1}, x_t]) \\quad \\text{update}$$</div>
      <div class="math-block">$$r_t = \\sigma(W_r [h_{t-1}, x_t]) \\quad \\text{reset}$$</div>
      <div class="math-block">$$\\tilde{h}_t = \\tanh(W [r_t \\odot h_{t-1}, x_t])$$</div>
      <div class="math-block">$$h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t$$</div>

      <h3>Backprop Through Time (BPTT)</h3>
      <p>Разворачиваем RNN во времени в глубокую сеть, применяем обычный backprop. Через T шагов — T-слойная сеть с разделяемыми весами.</p>
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
  },
});
