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

      <h3>Проблема обработки последовательностей</h3>
      <p>Многие данные имеют <b>последовательную</b> природу:</p>
      <ul>
        <li>Тексты (слова в порядке).</li>
        <li>Речь (звуки во времени).</li>
        <li>Временные ряды (цены акций, датчики).</li>
        <li>Видео (кадры).</li>
        <li>Музыка (ноты).</li>
      </ul>

      <p>Обычная полносвязная сеть (MLP) или CNN не умеют работать с последовательностями разной длины и не учитывают порядок. Нужен новый подход.</p>

      <h3>Идея RNN: скрытое состояние</h3>
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

      <h3>Разворачивание во времени</h3>
      <p>RNN можно представить как <b>очень глубокую</b> сеть, где каждый слой — это один временной шаг:</p>
      <pre>x_1 → h_1 → h_2 → h_3 → ... → h_T → output
      ↑     ↑     ↑           ↑
      |   x_2   x_3          x_T</pre>

      <p>Все эти «слои» используют одни и те же веса. При обучении применяется <span class="term" data-tip="BPTT. Backpropagation Through Time. Алгоритм обратного распространения для RNN: разворачиваем сеть во времени и применяем обычный backprop.">backpropagation through time (BPTT)</span>.</p>

      <h3>Проблема vanishing gradients</h3>
      <p>Главная болезнь vanilla RNN. При BPTT через много шагов градиент умножается на $W_{hh}$ снова и снова. Если собственные значения меньше 1 — градиент <b>затухает</b> экспоненциально.</p>
      <p>Последствие: сеть <b>не может помнить далёкое прошлое</b>. Связи длиной больше 10-20 шагов почти не обучаются.</p>
      <p>Альтернатива — <b>exploding gradients</b>: если собственные значения > 1, градиенты взрываются. Решается gradient clipping.</p>

      <h3>LSTM — революция в памяти</h3>
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

      <h3>GRU — упрощённая LSTM</h3>
      <p><span class="term" data-tip="Gated Recurrent Unit. Упрощённая версия LSTM с двумя гейтами вместо трёх. Меньше параметров, часто работает не хуже.">GRU</span> (2014) — более простая версия LSTM:</p>
      <ul>
        <li>2 гейта вместо 3 (update и reset).</li>
        <li>Нет отдельного cell state.</li>
        <li>Меньше параметров.</li>
        <li>Обучается быстрее.</li>
      </ul>

      <p>На практике GRU и LSTM дают похожие результаты. Выбор — эмпирический.</p>

      <h3>Типы задач с RNN</h3>
      <ul>
        <li><b>Many-to-one:</b> вход — последовательность, выход — один. Классификация текста, sentiment analysis.</li>
        <li><b>Many-to-many (sync):</b> вход и выход одной длины. POS-tagging.</li>
        <li><b>Many-to-many (async, seq2seq):</b> вход и выход разной длины. Машинный перевод.</li>
        <li><b>One-to-many:</b> один вход, много выходов. Image captioning.</li>
      </ul>

      <h3>Bidirectional RNN</h3>
      <p>Для некоторых задач важен контекст <b>и справа, и слева</b>. Bidirectional RNN = две RNN: одна идёт вперёд, другая назад. Их hidden states объединяются.</p>

      <h3>Плюсы и ограничения</h3>
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

      <h3>Частые заблуждения</h3>
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

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>MLP</b> — RNN это MLP с обратной связью.</li>
        <li><b>Transformer</b> — современная альтернатива для последовательностей.</li>
        <li><b>CNN</b> — можно комбинировать (CNN+LSTM для видео).</li>
        <li><b>Attention</b> — родился как улучшение seq2seq с RNN.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: предсказание следующего символа</h3>
      <div class="example-card">
        <p>Вход: "hell" → предсказать "o".</p>
        <p>Каждый символ one-hot: h=[1,0,0,0], e=[0,1,0,0], l=[0,0,1,0], o=[0,0,0,1].</p>
        <ul>
          <li>$h_1 = \\tanh(W_x \\cdot h + W_h \\cdot 0)$</li>
          <li>$h_2 = \\tanh(W_x \\cdot e + W_h \\cdot h_1)$</li>
          <li>$h_3 = \\tanh(W_x \\cdot l + W_h \\cdot h_2)$</li>
          <li>$h_4 = \\tanh(W_x \\cdot l + W_h \\cdot h_3)$</li>
          <li>$y = \\text{softmax}(W_y \\cdot h_4)$ → «o»</li>
        </ul>
      </div>

      <h3>Пример 2: гейты LSTM — интуиция</h3>
      <div class="example-card">
        <p>Читаем текст: «Маша пошла в магазин. Она купила яблоки.»</p>
        <ul>
          <li>На слове «Маша» — <b>input gate</b> открывается, записываем «субъект: Маша, женского рода».</li>
          <li>На слове «Она» — обращаемся к памяти через <b>output gate</b>, используем «женского рода».</li>
          <li>На новом предложении — <b>forget gate</b> может сбросить контекст.</li>
        </ul>
      </div>

      <h3>Пример 3: bidirectional RNN</h3>
      <div class="example-card">
        <p>«Он положил *яблоко* в корзину» — нужно знать контекст и слева, и справа. Bidirectional RNN = две RNN (forward + backward), их состояния объединяются.</p>
      </div>
    `,

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
              scales: { x: { type: 'linear', title: { display: true, text: 't' } }, y: { title: { display: true, text: 'x(t)' } } },
            },
          });
          App.registerChart(chart);

          const ctx2 = container.querySelector('#rnn-loss').getContext('2d');
          if (lossChart) lossChart.destroy();
          lossChart = new Chart(ctx2, {
            type: 'line',
            data: { labels: lossHistory.map((_, i) => i), datasets: [{ label: 'Loss', data: lossHistory, borderColor: '#16a34a', borderWidth: 1, pointRadius: 0, fill: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Loss (MSE)' } } },
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
