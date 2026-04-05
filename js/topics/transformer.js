/* ==========================================================================
   Transformer
   ========================================================================== */
App.registerTopic({
  id: 'transformer',
  category: 'dl',
  title: 'Transformer',
  summary: 'Attention is all you need — архитектура современных LLM.',

  tabs: {
    theory: `
      <h3>Зачем Transformer</h3>
      <p>RNN обрабатывают последовательность по одному элементу — медленно, плохо параллелится. Transformer отказался от рекуррентности и использует только <b>attention</b>: каждый элемент смотрит на все остальные напрямую.</p>

      <h3>Self-Attention</h3>
      <p>Для каждого токена вычисляем три вектора:</p>
      <ul>
        <li><b>Query (Q)</b> — «что я ищу?»</li>
        <li><b>Key (K)</b> — «что я предлагаю?»</li>
        <li><b>Value (V)</b> — «что я несу, если меня выбрали»</li>
      </ul>
      <p>Attention от токена i к токену j = softmax(Q_i · K_j / √d). Выход = взвешенная сумма V всех токенов.</p>
      <div class="math-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$$</div>

      <h3>Multi-Head Attention</h3>
      <p>Параллельно запускаем несколько attention-голов с разными проекциями Q, K, V. Каждая голова учит свой паттерн (синтаксис, семантика, дистанция…). Конкатенируем выходы.</p>

      <h3>Positional Encoding</h3>
      <p>Attention сам по себе не различает порядок токенов. Добавляем позиционные эмбеддинги — или синусоидальные (оригинал), или обучаемые.</p>

      <h3>Архитектура блока</h3>
      <pre>x → LayerNorm → MultiHeadAttention → + x (residual)
  → LayerNorm → FFN (2 слоя) → + (residual)</pre>
      <p>Transformer состоит из стека таких блоков (6-100+).</p>

      <div class="callout tip">💡 Ключевая идея: каждый токен может «обратиться» к любому другому напрямую — длина пути = 1 (в RNN путь = длина последовательности).</div>

      <h3>Encoder vs Decoder</h3>
      <ul>
        <li><b>Encoder</b> — полное внимание (на всех токенах). BERT.</li>
        <li><b>Decoder</b> — причинное (маскированное) внимание — только на предыдущих. GPT.</li>
        <li><b>Encoder-Decoder</b> — переводчики (T5, BART).</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: attention для перевода</h3>
      <div class="example-card">
        <p>«The animal didn't cross the street because it was too tired.»</p>
        <p>Когда модель обрабатывает «it», attention показывает сильную связь с «animal» — модель поняла местоимение.</p>
      </div>

      <h3>Пример 2: softmax attention</h3>
      <div class="example-card">
        <p>3 токена, scores Q·K: [2.0, 1.0, 3.0]. Делим на √d = √8:</p>
        <div class="math-block">$$\\text{scores} = [0.71, 0.35, 1.06]$$</div>
        <p>softmax: [0.32, 0.22, 0.46]. Выход = 0.32·V₁ + 0.22·V₂ + 0.46·V₃.</p>
      </div>

      <h3>Пример 3: подсчёт параметров в BERT-base</h3>
      <div class="example-card">
        <ul>
          <li>12 слоёв, hidden=768, 12 голов.</li>
          <li>Self-attention: 4·768·768 ≈ 2.4M / слой.</li>
          <li>FFN: 768·3072·2 ≈ 4.7M / слой.</li>
          <li>×12 слоёв ≈ 85M.</li>
          <li>+ embeddings (30k vocab · 768) ≈ 23M.</li>
          <li>Итого ≈ 110M параметров.</li>
        </ul>
      </div>
    `,

    simulation: {
      html: `
        <h3>Симуляция: self-attention heatmap</h3>
        <p>Показывает, как токены «смотрят» друг на друга. Веса обучаются на задаче: предсказать, связаны ли два слова. Синие ячейки — сильное внимание.</p>
        <div class="sim-container">
          <div class="sim-controls" id="tr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="tr-run">🔄 Пересчитать</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="tr-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="tr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#tr-controls');
        const cSentence = App.makeControl('select', 'tr-sent', 'Пример', {
          options: [
            { value: 'animal', label: 'The animal did not cross it was tired' },
            { value: 'bank', label: 'I walked to the river bank to sit' },
            { value: 'mary', label: 'Mary gave John her book yesterday' },
          ],
          value: 'animal',
        });
        const cTemp = App.makeControl('range', 'tr-temp', 'Temperature (softmax)', { min: 0.2, max: 3, step: 0.1, value: 1 });
        const cHead = App.makeControl('range', 'tr-head', 'Attention head', { min: 1, max: 4, step: 1, value: 1 });
        [cSentence, cTemp, cHead].forEach(c => controls.appendChild(c.wrap));

        const sentences = {
          animal: ['the', 'animal', 'did', 'not', 'cross', 'it', 'was', 'tired'],
          bank: ['I', 'walked', 'to', 'the', 'river', 'bank', 'to', 'sit'],
          mary: ['Mary', 'gave', 'John', 'her', 'book', 'yesterday'],
        };

        const canvas = container.querySelector('#tr-canvas');
        const ctx = canvas.getContext('2d');

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const tokens = sentences[cSentence.input.value];
          const n = tokens.length;
          const temp = +cTemp.input.value;
          const head = +cHead.input.value;

          // Собираем «псевдо-обученные» attention веса по правилам
          // Разные головы — разные паттерны
          function raw(i, j) {
            if (head === 1) {
              // «местоимения → существительное»
              const pronouns = ['it', 'her', 'his', 'they'];
              const nouns = ['animal', 'bank', 'Mary', 'John', 'book', 'river'];
              if (pronouns.includes(tokens[i])) return nouns.includes(tokens[j]) ? 3 : 0.3;
              return i === j ? 2 : 1 / (Math.abs(i - j) + 1);
            }
            if (head === 2) {
              // «локальный контекст»
              return Math.exp(-Math.abs(i - j) / 2);
            }
            if (head === 3) {
              // «глобальный — смотрим на конец»
              return j === n - 1 || j === n - 2 ? 2 : 0.5;
            }
            // head 4: зеркальное
            return (i + j === n - 1) ? 3 : 0.5;
          }

          // softmax по строкам с температурой
          const att = [];
          for (let i = 0; i < n; i++) {
            const row = [];
            for (let j = 0; j < n; j++) row.push(Math.exp(raw(i, j) / temp));
            const s = row.reduce((a, b) => a + b, 0);
            att.push(row.map(v => v / s));
          }

          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const pad = 100;
          const cs = Math.min((W - pad) / n, (H - pad) / n);
          const offX = pad, offY = pad - 20;
          // labels top
          ctx.fillStyle = '#0f172a';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          tokens.forEach((t, i) => {
            ctx.save();
            ctx.translate(offX + (i + 0.5) * cs, offY - 4);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(t, 0, 0);
            ctx.restore();
          });
          // labels left
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          tokens.forEach((t, i) => ctx.fillText(t, offX - 8, offY + (i + 0.5) * cs));
          // cells
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
              const v = att[i][j];
              ctx.fillStyle = `rgba(59,130,246,${Math.min(1, v * 2.5)})`;
              ctx.fillRect(offX + j * cs, offY + i * cs, cs, cs);
              ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.5;
              ctx.strokeRect(offX + j * cs, offY + i * cs, cs, cs);
              if (v > 0.15) {
                ctx.fillStyle = v > 0.5 ? '#fff' : '#0f172a';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(v.toFixed(2), offX + (j + 0.5) * cs, offY + (i + 0.5) * cs);
              }
            }
          }

          container.querySelector('#tr-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Токенов</div><div class="stat-value">${n}</div></div>
            <div class="stat-card"><div class="stat-label">Attention head</div><div class="stat-value">${head}</div></div>
            <div class="stat-card"><div class="stat-label">Temperature</div><div class="stat-value">${temp}</div></div>
            <div class="stat-card"><div class="stat-label">Строка = query</div><div class="stat-value" style="font-size:13px;">Столбец = key</div></div>
          `;
        }

        [cSentence, cTemp, cHead].forEach(c => c.input.addEventListener('input', draw));
        container.querySelector('#tr-run').onclick = draw;
        setTimeout(() => { resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>LLM</b> — GPT, Claude, Gemini, LLaMA, Mistral.</li>
        <li><b>NLP tasks</b> — классификация, NER, QA, summarization.</li>
        <li><b>Машинный перевод</b> — Google Translate.</li>
        <li><b>Vision Transformer (ViT)</b> — для изображений.</li>
        <li><b>Speech (Whisper)</b> — распознавание речи.</li>
        <li><b>Code generation</b> — Copilot, Codex.</li>
        <li><b>Multimodal models</b> — CLIP, GPT-4V.</li>
        <li><b>AlphaFold 2</b> — предсказание структуры белков.</li>
        <li><b>Music, video generation</b>.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Отлично параллелится (в отличие от RNN)</li>
            <li>Длинные зависимости в один шаг</li>
            <li>Масштабируется до миллиардов параметров</li>
            <li>State-of-the-art почти везде в NLP и за пределами</li>
            <li>Transfer learning работает великолепно</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>O(n²) память и время по длине входа</li>
            <li>Нужно много данных</li>
            <li>Дорого обучать</li>
            <li>Нужны позиционные эмбеддинги</li>
            <li>Плохая интерпретируемость</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Scaled Dot-Product Attention</h3>
      <div class="math-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$$</div>
      <p>$Q \\in \\mathbb{R}^{n \\times d_k}$, $K \\in \\mathbb{R}^{n \\times d_k}$, $V \\in \\mathbb{R}^{n \\times d_v}$.</p>

      <h3>Multi-Head Attention</h3>
      <div class="math-block">$$\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$</div>
      <div class="math-block">$$\\text{MHA}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$</div>

      <h3>Positional Encoding (sinusoidal)</h3>
      <div class="math-block">$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right)$$</div>
      <div class="math-block">$$PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)$$</div>

      <h3>Transformer Block</h3>
      <div class="math-block">$$x' = x + \\text{MHA}(\\text{LN}(x))$$</div>
      <div class="math-block">$$y = x' + \\text{FFN}(\\text{LN}(x'))$$</div>
      <div class="math-block">$$\\text{FFN}(x) = \\text{ReLU}(xW_1 + b_1) W_2 + b_2$$</div>

      <h3>Causal mask (для decoder)</h3>
      <p>Запрещаем смотреть в будущее:</p>
      <div class="math-block">$$\\text{mask}_{i,j} = \\begin{cases} 0, & j \\leq i \\\\ -\\infty, & j > i \\end{cases}$$</div>
    `,

    extra: `
      <h3>Семейства моделей</h3>
      <table>
        <tr><th>Тип</th><th>Модели</th><th>Задача</th></tr>
        <tr><td>Encoder-only</td><td>BERT, RoBERTa</td><td>Понимание (классификация, NER)</td></tr>
        <tr><td>Decoder-only</td><td>GPT, LLaMA, Claude</td><td>Генерация</td></tr>
        <tr><td>Encoder-Decoder</td><td>T5, BART</td><td>Перевод, summarization</td></tr>
      </table>

      <h3>Известные архитектуры</h3>
      <ul>
        <li><b>Transformer</b> (2017) — оригинальная статья «Attention is All You Need».</li>
        <li><b>BERT</b> (2018) — pre-training на masked language modeling.</li>
        <li><b>GPT-2/3/4</b> — масштабирование decoder-only.</li>
        <li><b>T5</b> — всё как seq2seq.</li>
        <li><b>ViT</b> — Transformer для изображений.</li>
      </ul>

      <h3>Эффективные варианты</h3>
      <p>Для длинных последовательностей O(n²) — проблема. Решения:</p>
      <ul>
        <li><b>Sparse attention</b> (Longformer, BigBird) — attention только на части токенов.</li>
        <li><b>Linear attention</b> (Performer, Linformer) — аппроксимация.</li>
        <li><b>FlashAttention</b> — оптимизация для GPU памяти.</li>
        <li><b>RoPE</b> — rotary position embedding, лучше extrapolation.</li>
        <li><b>ALiBi</b> — attention с линейным смещением по позиции.</li>
      </ul>

      <h3>Scaling laws</h3>
      <p>Качество LLM предсказуемо растёт с размером модели, данных и compute (Kaplan et al., Chinchilla). Для оптимума параметров и токенов должно быть ~20:1 (Chinchilla).</p>

      <h3>RLHF и alignment</h3>
      <p>Pre-training + supervised fine-tuning + reinforcement learning from human feedback → instruction-following модели (ChatGPT, Claude).</p>

      <h3>In-context learning</h3>
      <p>Большие LLM умеют учиться из примеров в промпте без изменения весов — few-shot, zero-shot. Эмерджентное свойство scale.</p>
    `,
  },
});
