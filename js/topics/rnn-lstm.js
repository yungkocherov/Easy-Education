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
      <h3>Проблема последовательностей</h3>
      <p>Как обработать переменной длины вход (текст, речь, временные ряды)? Обычные FC/CNN требуют фиксированный размер. RNN смотрит на элементы один за другим, поддерживая <b>скрытое состояние</b> (hidden state).</p>

      <h3>Vanilla RNN</h3>
      <p>На каждом шаге:</p>
      <div class="math-block">$$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$$</div>
      <div class="math-block">$$y_t = W_{hy} h_t + b_y$$</div>
      <p>$h_t$ — «память» сети. Она переносится с шага на шаг.</p>

      <h3>Проблема vanishing gradients</h3>
      <p>При обратном распространении через много шагов градиент многократно умножается на $W_{hh}$. Если собственные значения < 1 → градиент затухает, сеть не помнит далёкое прошлое.</p>

      <h3>LSTM (Long Short-Term Memory)</h3>
      <p>Исправляет vanishing gradient через <b>ячейку памяти</b> $c_t$ с «аддитивным» обновлением + гейты:</p>
      <ul>
        <li><b>Forget gate</b> $f_t$ — что забыть из памяти.</li>
        <li><b>Input gate</b> $i_t$ — что нового записать.</li>
        <li><b>Output gate</b> $o_t$ — что показать наружу.</li>
      </ul>

      <h3>GRU</h3>
      <p>Упрощённая LSTM с двумя гейтами вместо трёх. Меньше параметров, часто не хуже LSTM.</p>

      <div class="callout tip">💡 LSTM помнит важные события на сотни шагов назад — благодаря механизму gating.</div>
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
