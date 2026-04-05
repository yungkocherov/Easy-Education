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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь класс студентов, пишущих эссе. Каждый читает предложение «она взяла книгу и начала её читать». Вопрос: что означает «её»? «Книгу», конечно. Чтобы это понять, нужно <b>обратить внимание</b> на слово «книгу», несмотря на расстояние в предложении.</p>
        <p>Раньше (RNN) модели читали текст слово за словом, и к концу предложения уже забывали начало. Transformer сделал революционный ход: каждое слово <b>смотрит напрямую на все остальные слова</b> и выбирает, на какие обратить больше внимания. Это и называется <b>attention</b>.</p>
        <p>Результат: огромные языковые модели (GPT, Claude, Gemini), которые понимают контекст, пишут тексты, переводят, отвечают на вопросы. Transformer — архитектура современной эпохи ИИ.</p>
      </div>

      <h3>Почему Transformer победил RNN</h3>
      <p>RNN имеют несколько фундаментальных проблем:</p>
      <ol>
        <li><b>Последовательная обработка</b> — слова читаются одно за другим. Не параллелится, медленно на GPU.</li>
        <li><b>Короткая память</b> — даже LSTM теряет информацию на длинных последовательностях.</li>
        <li><b>Длинный путь от входа к выходу</b> — информация от слова на позиции 1 проходит через все промежуточные состояния.</li>
      </ol>

      <p>Transformer (2017, "Attention is All You Need") решил все три проблемы:</p>
      <ul>
        <li><b>Параллельная обработка</b> — все токены обрабатываются одновременно.</li>
        <li><b>Прямые связи</b> — каждый токен напрямую «видит» все остальные.</li>
        <li><b>Единица расстояния</b> — путь между любыми двумя токенами = 1 операция.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Transformer использует только <b>attention</b> (внимание) и отказывается от рекуррентности. Каждое слово на каждом слое «смотрит» на все остальные и взвешенно их агрегирует. Это и делает Transformer таким мощным.</p>
      </div>

      <h3>Self-Attention — сердце Transformer</h3>
      <p>Для каждого токена (слова) модель вычисляет <b>три вектора</b>:</p>
      <ul>
        <li><span class="term" data-tip="Query vector. 'Запрос' — что этот токен ищет в других токенах.">Query (Q)</span> — «что я ищу?» У слова «её» — поиск объекта.</li>
        <li><span class="term" data-tip="Key vector. 'Ключ' — что этот токен предлагает другим.">Key (K)</span> — «что у меня есть?» У слова «книгу» — ключ-«объект».</li>
        <li><span class="term" data-tip="Value vector. 'Значение' — что этот токен передаёт, если на него обращают внимание.">Value (V)</span> — «какую информацию я несу?»</li>
      </ul>

      <p>Алгоритм:</p>
      <ol>
        <li>Для каждой пары (token_i, token_j) считаем «совпадение» Q_i и K_j: $\\text{score}_{ij} = Q_i \\cdot K_j$.</li>
        <li>Нормализуем: делим на $\\sqrt{d_k}$ (чтобы значения не взрывались).</li>
        <li>Применяем softmax — получаем веса attention.</li>
        <li>Выход для токена i = взвешенная сумма V всех токенов с этими весами.</li>
      </ol>

      <div class="math-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$$</div>

      <h3>Multi-Head Attention</h3>
      <p>Запускаем <b>несколько параллельных</b> attention-операций с разными проекциями Q, K, V. Каждая «голова» учит свой паттерн:</p>
      <ul>
        <li>Одна голова может отслеживать синтаксические связи.</li>
        <li>Другая — семантические.</li>
        <li>Третья — длинные зависимости.</li>
        <li>Четвёртая — ближайших соседей.</li>
      </ul>

      <p>Выходы голов конкатенируются и проецируются. Это даёт модели возможность <b>одновременно</b> фокусироваться на разных аспектах.</p>

      <h3>Positional Encoding</h3>
      <p>У self-attention есть особенность: он <b>не различает порядок</b> токенов. Для него «собака укусила человека» и «человек укусил собаку» одинаковы.</p>

      <p>Решение — <span class="term" data-tip="Positional Encoding. Векторы, добавляемые к эмбеддингам слов, кодирующие их позицию в последовательности. Позволяет attention учитывать порядок.">positional encoding</span>: к эмбеддингу каждого токена добавляем вектор, кодирующий его позицию. Теперь модель знает, где каждое слово стоит.</p>

      <p>Оригинальная статья использует синусоидальные encodings. Современные модели часто используют обучаемые или RoPE (rotary).</p>

      <h3>Архитектура блока Transformer</h3>
      <pre>x → LayerNorm → Multi-Head Attention → + x  (residual)
  → LayerNorm → Feed-Forward Network → +     (residual)</pre>

      <p>Один блок содержит:</p>
      <ol>
        <li><b>Layer Normalization</b> — нормализация активаций.</li>
        <li><b>Multi-Head Attention</b> — главная операция.</li>
        <li><b>Residual connection</b> — добавляем вход к выходу.</li>
        <li><b>Feed-Forward Network</b> — обычный MLP, применённый к каждому токену.</li>
        <li>Снова residual.</li>
      </ol>

      <p>Transformer — это <b>стек</b> таких блоков (6 в оригинале, до 100+ в больших моделях).</p>

      <h3>Encoder vs Decoder</h3>
      <p>Есть три типа Transformer-моделей:</p>

      <h4>Encoder-only</h4>
      <p><b>Полное</b> attention — каждый токен видит все. Хорошо для понимания текста.</p>
      <p><b>Примеры:</b> BERT, RoBERTa. Задачи: классификация, NER, QA.</p>

      <h4>Decoder-only</h4>
      <p><span class="term" data-tip="Causal / Masked Attention. Attention, где токен может смотреть только на предыдущие токены (не в будущее). Используется в decoder для генерации текста.">Causal attention</span> — токен видит только <b>предыдущие</b> токены. Хорошо для генерации.</p>
      <p><b>Примеры:</b> GPT, LLaMA, Claude. Задачи: генерация, чат, code completion.</p>

      <h4>Encoder-Decoder</h4>
      <p>Комбинация. Encoder читает вход, decoder генерирует выход.</p>
      <p><b>Примеры:</b> T5, BART. Задачи: перевод, summarization.</p>

      <h3>Вычислительная сложность</h3>
      <p>Главный минус: self-attention имеет сложность $O(n^2)$ по длине последовательности. Если вход 10000 токенов — это 100 млн операций только на одну голову, один слой.</p>
      <p>Поэтому для очень длинных контекстов разработаны специальные варианты: Sparse Attention (Longformer), Linear Attention (Performer), FlashAttention (оптимизация памяти).</p>

      <h3>Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Отлично параллелится</b> — быстрое обучение на GPU.</li>
        <li>Длинные зависимости — за 1 шаг.</li>
        <li>Масштабируется до миллиардов параметров.</li>
        <li>State-of-the-art почти везде в NLP и за пределами.</li>
        <li>Transfer learning работает отлично.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li>$O(n^2)$ по длине последовательности.</li>
        <li>Нужно много данных для обучения с нуля.</li>
        <li>Дорого обучать большие модели.</li>
        <li>Требуются positional encodings.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Attention = это внимание как у людей»</b> — математически это просто взвешенная сумма с softmax.</li>
        <li><b>«Трансформеры понимают язык»</b> — они моделируют статистику. Понимание — спорный вопрос.</li>
        <li><b>«Трансформеры только для текста»</b> — работают на изображениях (ViT), аудио, видео, коде, белках.</li>
        <li><b>«Больше слоёв — всегда лучше»</b> — нужно тщательно балансировать с данными и compute.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: семейства моделей</summary>
        <div class="deep-dive-body">
          <table>
            <tr><th>Тип</th><th>Модели</th><th>Задачи</th></tr>
            <tr><td>Encoder-only</td><td>BERT, RoBERTa, DeBERTa</td><td>Classification, NER, QA</td></tr>
            <tr><td>Decoder-only</td><td>GPT, LLaMA, Claude, Mistral</td><td>Generation, Chat</td></tr>
            <tr><td>Encoder-Decoder</td><td>T5, BART, mT5</td><td>Translation, Summarization</td></tr>
            <tr><td>Vision Transformer</td><td>ViT, Swin, DINO</td><td>Image classification</td></tr>
            <tr><td>Multimodal</td><td>CLIP, GPT-4V</td><td>Text+Image</td></tr>
          </table>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: scaling laws</summary>
        <div class="deep-dive-body">
          <p>Качество LLM предсказуемо растёт с:</p>
          <ul>
            <li>Числом параметров.</li>
            <li>Объёмом данных.</li>
            <li>Вычислительным бюджетом.</li>
          </ul>
          <p>Исследования (Kaplan, Chinchilla) вывели законы масштабирования. Оптимальное соотношение параметров к токенам: ~1:20 (Chinchilla scaling).</p>
          <p>Это привело к гонке вооружений: GPT-2 → GPT-3 → GPT-4 → ..., каждая модель больше и умнее.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: alignment и RLHF</summary>
        <div class="deep-dive-body">
          <p>Pre-trained LLM генерирует текст, но не обязательно «полезно». Для создания моделей типа ChatGPT/Claude:</p>
          <ol>
            <li><b>Pre-training:</b> обучение на огромном корпусе текстов.</li>
            <li><b>Supervised Fine-Tuning (SFT):</b> обучение на парах «инструкция → ответ».</li>
            <li><b>RLHF</b> (Reinforcement Learning from Human Feedback) — дообучение с обратной связью людей.</li>
          </ol>
          <p>Это превращает «предсказатель следующего слова» в помощника-собеседника.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: эмерджентные способности</summary>
        <div class="deep-dive-body">
          <p>Удивительное свойство больших LLM: некоторые способности появляются <b>внезапно</b> при достижении определённого масштаба, а не постепенно.</p>
          <p>Примеры:</p>
          <ul>
            <li>In-context learning — обучение из примеров в промпте.</li>
            <li>Chain-of-thought reasoning.</li>
            <li>Code generation.</li>
            <li>Мульти-язычность.</li>
          </ul>
          <p>Почему — до конца непонятно. Это активная область исследований.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>RNN</b> — историческая альтернатива, заменённая Transformer.</li>
        <li><b>CNN</b> — ViT использует Transformer для изображений.</li>
        <li><b>Attention</b> — впервые появилось в seq2seq с RNN.</li>
        <li><b>MLP</b> — FFN блоки Transformer это обычные MLP.</li>
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
