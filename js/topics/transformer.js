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

      <div class="illustration bordered">
        <svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <!-- Tokens -->
          <rect x="20" y="130" width="70" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/><text x="55" y="150" text-anchor="middle" font-size="11" fill="#1e40af">Кот</text>
          <rect x="110" y="130" width="70" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/><text x="145" y="150" text-anchor="middle" font-size="11" fill="#1e40af">сидел</text>
          <rect x="200" y="130" width="70" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/><text x="235" y="150" text-anchor="middle" font-size="11" fill="#1e40af">на</text>
          <rect x="290" y="130" width="70" height="30" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/><text x="325" y="150" text-anchor="middle" font-size="11" fill="#1e40af">коврике</text>
          <!-- Attention arrows to "сидел" -->
          <path d="M145,130 C145,80 55,80 55,130" fill="none" stroke="#ef4444" stroke-width="2.5" opacity="0.7"/>
          <text x="90" y="78" text-anchor="middle" font-size="9" fill="#dc2626" font-weight="600">0.45</text>
          <path d="M145,130 C145,95 145,95 145,130" fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.5"/>
          <path d="M145,130 C145,80 235,80 235,130" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>
          <text x="195" y="78" text-anchor="middle" font-size="9" fill="#92400e">0.15</text>
          <path d="M145,130 C145,60 325,60 325,130" fill="none" stroke="#10b981" stroke-width="2" opacity="0.6"/>
          <text x="260" y="55" text-anchor="middle" font-size="9" fill="#065f46" font-weight="600">0.30</text>
          <!-- Label -->
          <text x="420" y="70" font-size="11" fill="#334155">← Attention от «сидел»:</text>
          <text x="420" y="88" font-size="10" fill="#64748b">на кого смотрит это слово?</text>
          <text x="420" y="106" font-size="10" fill="#64748b">Больше всего — на «кот»</text>
          <text x="420" y="124" font-size="10" fill="#64748b">и «коврике» (субъект + место).</text>
        </svg>
        <div class="caption">Self-attention: каждое слово «смотрит» на все остальные с разными весами. «Сидел» обращает внимание на «кот» (кто?) и «коврике» (где?).</div>
      </div>

      <h3>🎯 Почему Transformer победил RNN</h3>
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

      <h3>💡 Self-Attention — сердце Transformer</h3>
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

      <h3>🔀 Multi-Head Attention</h3>
      <p>Запускаем <b>несколько параллельных</b> attention-операций с разными проекциями Q, K, V. Каждая «голова» учит свой паттерн:</p>
      <ul>
        <li>Одна голова может отслеживать синтаксические связи.</li>
        <li>Другая — семантические.</li>
        <li>Третья — длинные зависимости.</li>
        <li>Четвёртая — ближайших соседей.</li>
      </ul>

      <p>Выходы голов конкатенируются и проецируются. Это даёт модели возможность <b>одновременно</b> фокусироваться на разных аспектах.</p>

      <h3>📍 Positional Encoding</h3>
      <p>У self-attention есть особенность: он <b>не различает порядок</b> токенов. Для него «собака укусила человека» и «человек укусил собаку» одинаковы.</p>

      <p>Решение — <span class="term" data-tip="Positional Encoding. Векторы, добавляемые к эмбеддингам слов, кодирующие их позицию в последовательности. Позволяет attention учитывать порядок.">positional encoding</span>: к эмбеддингу каждого токена добавляем вектор, кодирующий его позицию. Теперь модель знает, где каждое слово стоит.</p>

      <p>Оригинальная статья использует синусоидальные encodings. Современные модели часто используют обучаемые или RoPE (rotary).</p>

      <h3>🏗️ Архитектура блока Transformer</h3>
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

      <h3>⚙️ Encoder vs Decoder</h3>
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

      <h3>📊 Вычислительная сложность</h3>
      <p>Главный минус: self-attention имеет сложность $O(n^2)$ по длине последовательности. Если вход 10000 токенов — это 100 млн операций только на одну голову, один слой.</p>
      <p>Поэтому для очень длинных контекстов разработаны специальные варианты: Sparse Attention (Longformer), Linear Attention (Performer), FlashAttention (оптимизация памяти).</p>

      <h3>⚖️ Плюсы и ограничения</h3>
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

      <h3>⚠️ Частые заблуждения</h3>
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

    examples: [
      {
        title: 'Self-Attention на 3 токенах',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Вычислить self-attention для 3 токенов: «Кот», «сидит», «там». Размерность $d_k = 2$. Конкретные Q, K, V (уже вычисленные проекции):</p>
            <div class="math-block">$$Q = \\begin{pmatrix}1 & 0 \\\\ 0 & 1 \\\\ 1 & 1\\end{pmatrix},\\quad K = \\begin{pmatrix}1 & 1 \\\\ 0 & 1 \\\\ 1 & 0\\end{pmatrix},\\quad V = \\begin{pmatrix}1 & 0 \\\\ 0 & 1 \\\\ 1 & 1\\end{pmatrix}$$</div>
            <p>Строки — токены («Кот», «сидит», «там»). Колонки — компоненты векторов.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <!-- 3x3 attention weight heatmap: values from the example -->
              <!-- Row "Кот": 0.401, 0.198, 0.401 -->
              <!-- Row "сидит": 0.401, 0.401, 0.198 -->
              <!-- Row "там": 0.503, 0.248, 0.248 -->
              <!-- Color scale: low=white, high=#3b82f6. We map 0.198→light, 0.503→dark -->
              <!-- Map value v: opacity = (v-0.198)/(0.503-0.198)*0.9 + 0.1 -->
              <!-- Кот→Кот=0.401: (0.401-0.198)/0.305=0.665*0.9+0.1=0.699 → #3b82f6 at 70% -->
              <!-- Cell size 70px, starting at x=120,y=20 -->
              <text x="80" y="20" font-size="11" fill="#64748b" font-weight="600">Attention matrix A (softmax)</text>
              <!-- Column headers (Keys) -->
              <text x="155" y="50" text-anchor="middle" font-size="10" fill="#64748b">Кот</text>
              <text x="225" y="50" text-anchor="middle" font-size="10" fill="#64748b">сидит</text>
              <text x="295" y="50" text-anchor="middle" font-size="10" fill="#64748b">там</text>
              <!-- Row headers (Queries) -->
              <text x="110" y="88" text-anchor="end" font-size="10" fill="#64748b">Кот</text>
              <text x="110" y="123" text-anchor="end" font-size="10" fill="#64748b">сидит</text>
              <text x="110" y="158" text-anchor="end" font-size="10" fill="#64748b">там</text>
              <!-- Row 0 "Кот": 0.401, 0.198, 0.401 -->
              <rect x="120" y="58" width="70" height="35" fill="#3b82f6" opacity="0.70" rx="3"/>
              <text x="155" y="80" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.40</text>
              <rect x="190" y="58" width="70" height="35" fill="#3b82f6" opacity="0.25" rx="3"/>
              <text x="225" y="80" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.20</text>
              <rect x="260" y="58" width="70" height="35" fill="#3b82f6" opacity="0.70" rx="3"/>
              <text x="295" y="80" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.40</text>
              <!-- Row 1 "сидит": 0.401, 0.401, 0.198 -->
              <rect x="120" y="93" width="70" height="35" fill="#3b82f6" opacity="0.70" rx="3"/>
              <text x="155" y="115" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.40</text>
              <rect x="190" y="93" width="70" height="35" fill="#3b82f6" opacity="0.70" rx="3"/>
              <text x="225" y="115" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.40</text>
              <rect x="260" y="93" width="70" height="35" fill="#3b82f6" opacity="0.25" rx="3"/>
              <text x="295" y="115" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.20</text>
              <!-- Row 2 "там": 0.503, 0.248, 0.248 -->
              <rect x="120" y="128" width="70" height="35" fill="#3b82f6" opacity="0.95" rx="3"/>
              <text x="155" y="150" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">0.50</text>
              <rect x="190" y="128" width="70" height="35" fill="#3b82f6" opacity="0.35" rx="3"/>
              <text x="225" y="150" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.25</text>
              <rect x="260" y="128" width="70" height="35" fill="#3b82f6" opacity="0.35" rx="3"/>
              <text x="295" y="150" text-anchor="middle" font-size="11" fill="#1e3a8a" font-weight="600">0.25</text>
              <!-- Grid border -->
              <rect x="120" y="58" width="210" height="105" fill="none" stroke="#64748b" stroke-width="1.5" rx="3"/>
              <line x1="190" y1="58" x2="190" y2="163" stroke="#64748b" stroke-width="1"/>
              <line x1="260" y1="58" x2="260" y2="163" stroke="#64748b" stroke-width="1"/>
              <line x1="120" y1="93" x2="330" y2="93" stroke="#64748b" stroke-width="1"/>
              <line x1="120" y1="128" x2="330" y2="128" stroke="#64748b" stroke-width="1"/>
              <!-- Colorscale legend -->
              <rect x="350" y="80" width="14" height="75" fill="url(#hm-grad)" rx="2"/>
              <defs>
                <linearGradient id="hm-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.95"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1"/>
                </linearGradient>
              </defs>
              <text x="368" y="86" font-size="8" fill="#64748b">0.50</text>
              <text x="368" y="158" font-size="8" fill="#64748b">0.20</text>
              <text x="350" y="72" font-size="8" fill="#64748b">вес ↑</text>
            </svg>
            <div class="caption">Матрица attention весов A (3×3): строка i = «на кого смотрит токен i». «Там» (строка 3) уделяет 50% «Коту» — самый тёмный квадрат. Каждая строка суммируется в 1 (softmax).</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Токен</th><th>$Q_i$</th><th>$K_i$</th><th>$V_i$</th></tr>
              <tr><td>Кот (i=1)</td><td>$(1, 0)$</td><td>$(1, 1)$</td><td>$(1, 0)$</td></tr>
              <tr><td>сидит (i=2)</td><td>$(0, 1)$</td><td>$(0, 1)$</td><td>$(0, 1)$</td></tr>
              <tr><td>там (i=3)</td><td>$(1, 1)$</td><td>$(1, 0)$</td><td>$(1, 1)$</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Вычисляем матрицу scores $S = QK^T$</h4>
            <p>$s_{ij} = Q_i \\cdot K_j$ — «насколько токен $i$ обращает внимание на токен $j$»:</p>
            <div class="calc">
              $s_{11} = Q_1 \\cdot K_1 = 1\\cdot1 + 0\\cdot1 = 1$<br>
              $s_{12} = Q_1 \\cdot K_2 = 1\\cdot0 + 0\\cdot1 = 0$<br>
              $s_{13} = Q_1 \\cdot K_3 = 1\\cdot1 + 0\\cdot0 = 1$<br>
              $s_{21} = Q_2 \\cdot K_1 = 0\\cdot1 + 1\\cdot1 = 1$<br>
              $s_{22} = Q_2 \\cdot K_2 = 0\\cdot0 + 1\\cdot1 = 1$<br>
              $s_{23} = Q_2 \\cdot K_3 = 0\\cdot1 + 1\\cdot0 = 0$<br>
              $s_{31} = Q_3 \\cdot K_1 = 1\\cdot1 + 1\\cdot1 = 2$<br>
              $s_{32} = Q_3 \\cdot K_2 = 1\\cdot0 + 1\\cdot1 = 1$<br>
              $s_{33} = Q_3 \\cdot K_3 = 1\\cdot1 + 1\\cdot0 = 1$
            </div>
            <div class="why">Итоговая матрица $S = \\begin{pmatrix}1&0&1\\\\1&1&0\\\\2&1&1\\end{pmatrix}$. Строка 3 («там») имеет самый высокий score на «Кот» (2) — модель «замечает» связь.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Масштабирование на $\\sqrt{d_k} = \\sqrt{2} \\approx 1{,}414$</h4>
            <div class="calc">
              $\\tilde{S} = S / \\sqrt{2} = \\begin{pmatrix}0{,}707 & 0 & 0{,}707 \\\\ 0{,}707 & 0{,}707 & 0 \\\\ 1{,}414 & 0{,}707 & 0{,}707\\end{pmatrix}$
            </div>
            <div class="why">Без масштабирования при больших $d_k$ скалярные произведения становятся очень большими → softmax «замерзает» (один элемент ≈1, все ≈0) → исчезают градиенты. Деление на $\\sqrt{d_k}$ стабилизирует.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Применяем softmax по строкам</h4>
            <div class="calc">
              Строка 1: $(0{,}707, 0, 0{,}707)$ → $e^{0{,}707}=2{,}028$, $e^0=1$, $e^{0{,}707}=2{,}028$<br>
              Сумма $= 5{,}056$. Веса: $(0{,}401, 0{,}198, 0{,}401)$<br><br>
              Строка 2: $(0{,}707, 0{,}707, 0)$ → $(2{,}028, 2{,}028, 1)$<br>
              Сумма $= 5{,}056$. Веса: $(0{,}401, 0{,}401, 0{,}198)$<br><br>
              Строка 3: $(1{,}414, 0{,}707, 0{,}707)$ → $(4{,}113, 2{,}028, 2{,}028)$<br>
              Сумма $= 8{,}169$. Веса: $(0{,}503, 0{,}248, 0{,}248)$
            </div>
            <div class="why">«Там» (строка 3) уделяет 50% внимания «Кот» и по 25% остальным. Это интуитивно верно: «там» скорее всего указывает на что-то (кота, место), а не на глагол «сидит».</div>
          </div>

          <div class="step" data-step="4">
            <h4>Вычисляем выходы $Z = A \cdot V$</h4>
            <div class="calc">
              Для «Кот» (строка 1): $z_1 = 0{,}401 \\cdot V_1 + 0{,}198 \\cdot V_2 + 0{,}401 \\cdot V_3$<br>
              $= 0{,}401(1,0) + 0{,}198(0,1) + 0{,}401(1,1)$<br>
              $= (0{,}401, 0) + (0, 0{,}198) + (0{,}401, 0{,}401) = (0{,}802, 0{,}599)$<br><br>
              Для «там» (строка 3): $z_3 = 0{,}503 \\cdot V_1 + 0{,}248 \\cdot V_2 + 0{,}248 \\cdot V_3$<br>
              $= 0{,}503(1,0) + 0{,}248(0,1) + 0{,}248(1,1) = (0{,}751, 0{,}496)$
            </div>
            <div class="why">Каждый выходной вектор — это взвешенное среднее Value-векторов. «Кот» получил информацию от «там» (40%) — теперь его представление обогащено контекстом местоположения.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Итоговая матрица attention и выходы</h4>
            <div class="calc">
              $A = \\begin{pmatrix}0{,}401 & 0{,}198 & 0{,}401 \\\\ 0{,}401 & 0{,}401 & 0{,}198 \\\\ 0{,}503 & 0{,}248 & 0{,}248\\end{pmatrix}$<br><br>
              $Z = AV = \\begin{pmatrix}0{,}802 & 0{,}599 \\\\ 0{,}401 & 0{,}599 \\\\ 0{,}751 & 0{,}496\\end{pmatrix}$
            </div>
            <div class="why">Каждый токен получил новое представление, учитывающее контекст всего предложения. Это и есть contextualized embeddings — главная сила Transformer. Одно слово «кот» может иметь разное представление в «кот спит» и «кот у реки».</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Self-attention для 3 токенов: матрица Q·K^T/√2 → softmax → умножение на V. «Там» обращает 50% внимания на «Кот». Итог: каждый токен получил контекстуализированный вектор размерности $d_k=2$, обогащённый информацией от других токенов.</p>
          </div>

          <div class="lesson-box">
            <b>Сложность:</b> вычисление $QK^T$ — это $O(n^2 \\cdot d_k)$ операций ($n$ — длина последовательности). Для 1000 токенов: $10^6$ операций на один слой, одну голову. Это главный ограничитель Transformer для длинных текстов.
          </div>
        `
      },
      {
        title: 'Multi-Head: 2 головы',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как 2 головы attention на тех же 3 токенах («Маша», «любит», «кошек») фокусируются на разных аспектах. Размерность $d = 4$, каждая голова $d_k = 2$. Сравнить attention-матрицы двух голов и показать финальное объединение.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Голова</th><th>Специализация</th><th>«любит» → max attention на</th><th>Вес</th></tr>
              <tr><td>Голова 1 (синтаксис)</td><td>субъект-глагол</td><td>«Маша» (субъект)</td><td>0,723</td></tr>
              <tr><td>Голова 2 (семантика)</td><td>глагол-объект</td><td>«кошек» (объект)</td><td>0,701</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Голова 1: матрица attention (фокус на субъекте)</h4>
            <div class="calc">
              Scores для «любит» (строка 2) → после масштабирования и softmax:<br>
              $\\alpha_{2,1} = 0{,}723$ («Маша» — субъект, важно для глагола)<br>
              $\\alpha_{2,2} = 0{,}123$ (сам на себя — умеренно)<br>
              $\\alpha_{2,3} = 0{,}154$ («кошек» — объект, менее важен для этой головы)
            </div>
            <div class="calc">
              $z^{(1)}_2 = 0{,}723 V^{(1)}_1 + 0{,}123 V^{(1)}_2 + 0{,}154 V^{(1)}_3$<br>
              Пусть $V^{(1)} = \\begin{pmatrix}1&0\\\\0&1\\\\1&1\\end{pmatrix}$:<br>
              $z^{(1)}_2 = (0{,}723+0+0{,}154, 0+0{,}123+0{,}154) = (0{,}877, 0{,}277)$
            </div>
            <div class="why">Голова 1 кодирует «любит» как «действие Маши» — преобладает вклад V-вектора «Маша». Выход (0,877; 0,277) несёт информацию о субъекте действия.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Голова 2: матрица attention (фокус на объекте)</h4>
            <div class="calc">
              Scores для «любит» (другие проекции $W^Q_2, W^K_2$):<br>
              $\\alpha_{2,1} = 0{,}171$ («Маша» — менее важна для этой головы)<br>
              $\\alpha_{2,2} = 0{,}128$ (сам на себя)<br>
              $\\alpha_{2,3} = 0{,}701$ («кошек» — объект, главное!)
            </div>
            <div class="calc">
              Пусть $V^{(2)} = \\begin{pmatrix}0&1\\\\1&0\\\\0&1\\end{pmatrix}$:<br>
              $z^{(2)}_2 = 0{,}171(0,1) + 0{,}128(1,0) + 0{,}701(0,1)$<br>
              $= (0+0{,}128+0, 0{,}171+0+0{,}701) = (0{,}128, 0{,}872)$
            </div>
            <div class="why">Голова 2 кодирует «любит» как «действие с объектом кошки» — преобладает вклад V-вектора «кошек». Выход (0,128; 0,872) несёт информацию об объекте.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Конкатенация и проекция $W^O$</h4>
            <div class="calc">
              $\\text{concat}(z^{(1)}_2, z^{(2)}_2) = (0{,}877, 0{,}277, 0{,}128, 0{,}872) \\in \\mathbb{R}^4$<br><br>
              $W^O = \\begin{pmatrix}0{,}5&0{,}3&0{,}1&0{,}2\\\\0{,}2&0{,}4&0{,}3&0{,}5\\\\0{,}1&0{,}2&0{,}6&0{,}1\\\\0{,}3&0{,}1&0{,}2&0{,}4\\end{pmatrix}$<br><br>
              $\\text{MHA}_2 = W^O \\cdot (0{,}877, 0{,}277, 0{,}128, 0{,}872)^T \\approx (0{,}72, 0{,}73, 0{,}58, 0{,}71)$
            </div>
            <div class="why">$W^O$ обучается смешивать информацию от обеих голов. Выходной вектор «любит» теперь кодирует и субъект (от головы 1), и объект (от головы 2) — полное синтаксическое представление!</div>
          </div>

          <div class="step" data-step="4">
            <h4>Зачем разделять $d$ между головами?</h4>
            <div class="calc">
              Без разделения: одна голова $d_k = d = 4$, число параметров = $4 W^Q + 4 W^K + 4 W^V = 48$ пар. (для $d=4$)<br>
              С двумя головами $d_k = 2$: $2 \\times (2 W^Q + 2 W^K + 2 W^V) + W^O = 2 \\times 12 + 16 = 40$ пар.<br>
              В BERT: 12 голов, $d=768$, $d_k = 64$ — число параметров то же!
            </div>
            <div class="why">Multi-Head не увеличивает число параметров — оно делит $d$ поровну между головами. Зато даёт больше «взглядов» на данные. Это как 12 аналитиков, каждый со своей специализацией, вместо одного универсального.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Что учат разные головы в реальных моделях</h4>
            <div class="calc">
              (из Clark et al. 2019 «What Does BERT Look At?»)<br>
              Голова 8-10: синтаксические зависимости (подлежащее-сказуемое)<br>
              Голова 5: следующий токен (позиционный паттерн)<br>
              Голова 4-9: кореференции (местоимение → существительное)<br>
              Голова 2: редкие токены (числа, знаки препинания)
            </div>
            <div class="why">Это эмерджентные специализации — их никто не программировал. Они появились из обучения на тексте. Разные головы захватили разные лингвистические феномены автоматически!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>2 головы с $d_k=2$ параллельно анализируют «любит»: голова 1 → субъект «Маша» (72%), голова 2 → объект «кошек» (70%). Конкатенация $(0{,}877, 0{,}277, 0{,}128, 0{,}872)$ через $W^O$ даёт финальный вектор, кодирующий оба аспекта одновременно.</p>
          </div>

          <div class="lesson-box">
            <b>Интуиция Multi-Head:</b> представь, что ты читаешь предложение сразу несколькими «способами восприятия» — один ищет грамматическую структуру, другой — смысловые связи, третий — эмоциональный тон. Multi-Head Attention делает именно это, причём параллельно и без дополнительных параметров.
          </div>
        `
      },
      {
        title: 'Positional Encoding',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, почему Self-Attention без позиционного кодирования не различает порядок слов, и как синусоидальное кодирование решает эту проблему. Размерность $d = 4$. Сравнить предложения «Маша любит Диму» и «Дима любит Машу».</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Позиция $pos$</th><th>$\\sin(pos/1)$</th><th>$\\cos(pos/1)$</th><th>$\\sin(pos/100)$</th><th>$\\cos(pos/100)$</th></tr>
              <tr><td>0 (первое слово)</td><td>0,000</td><td>1,000</td><td>0,000</td><td>1,000</td></tr>
              <tr><td>1 (второе слово)</td><td>0,841</td><td>0,540</td><td>0,010</td><td>1,000</td></tr>
              <tr><td>2 (третье слово)</td><td>0,909</td><td>−0,416</td><td>0,020</td><td>1,000</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Проблема: attention инвариантен к перестановке</h4>
            <div class="calc">
              «Маша любит Диму»: эмбеддинги $e_{\\text{Маша}}, e_{\\text{любит}}, e_{\\text{Диму}}$<br>
              «Дима любит Машу»: эмбеддинги $e_{\\text{Дима}}, e_{\\text{любит}}, e_{\\text{Машу}}$
            </div>
            <div class="calc">
              Если $e_{\\text{Маша}} = e_{\\text{Машу}}$ и $e_{\\text{Дима}} = e_{\\text{Диму}}$ (один токен),<br>
              то обе последовательности дают одинаковое множество векторов → одинаковый attention → одинаковый выход!<br>
              Модель не видит разницы между субъектом и объектом.
            </div>
            <div class="why">Self-attention вычисляет $QK^T$ — это набор скалярных произведений, который не зависит от порядка расположения токенов. Нужно явно добавить информацию о позиции.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Синусоидальное кодирование (формула оригинальной статьи)</h4>
            <div class="math-block">$$PE_{pos, 2i} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad PE_{pos, 2i+1} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)$$</div>
            <div class="calc">
              $d=4$, позиция 0: $PE_0 = (\\sin(0), \\cos(0), \\sin(0/100), \\cos(0/100)) = (0,\\; 1,\\; 0,\\; 1)$<br>
              Позиция 1: $PE_1 = (\\sin(1),\\; \\cos(1),\\; \\sin(0{,}01),\\; \\cos(0{,}01)) = (0{,}841,\\; 0{,}540,\\; 0{,}010,\\; 1{,}000)$<br>
              Позиция 2: $PE_2 = (\\sin(2),\\; \\cos(2),\\; \\sin(0{,}02),\\; \\cos(0{,}02)) = (0{,}909,\\; -0{,}416,\\; 0{,}020,\\; 1{,}000)$
            </div>
            <div class="why">Первые два компонента меняются быстро ($i=0$, период $2\\pi$) — различают соседние слова. Последние два — медленно ($i=1$, период $200\\pi$) — различают слова на расстоянии сотен позиций. Многочастотный код как у ДНК.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Добавляем PE к эмбеддингу: «Маша» на позиции 0 vs. позиции 2</h4>
            <div class="calc">
              $e_{\\text{Маша}} = (0{,}5,\\; -0{,}3,\\; 0{,}8,\\; 0{,}1)$ (статичный эмбеддинг)<br>
              «Маша» на pos=0: $x_0 = (0{,}5+0,\\; -0{,}3+1,\\; 0{,}8+0,\\; 0{,}1+1) = (0{,}5,\\; 0{,}7,\\; 0{,}8,\\; 1{,}1)$<br>
              «Машу» на pos=2: $x_2 = (0{,}5+0{,}909,\\; -0{,}3-0{,}416,\\; 0{,}8+0{,}020,\\; 0{,}1+1) = (1{,}409,\\; -0{,}716,\\; 0{,}820,\\; 1{,}100)$
            </div>
            <div class="why">Одно и то же слово «Маша/Машу», но разные позиционные векторы → разные итоговые входы. Теперь attention между ними ≠ 1, и модель «знает», что субъект (pos=0) и объект (pos=2) — разные роли!</div>
          </div>

          <div class="step" data-step="4">
            <h4>Скалярные произведения PE: близость позиций</h4>
            <div class="calc">
              $PE_0 \\cdot PE_0 = 0^2 + 1^2 + 0^2 + 1^2 = 2$ (сам с собой, максимум)<br>
              $PE_0 \\cdot PE_1 = 0\\cdot0{,}841 + 1\\cdot0{,}540 + 0\\cdot0{,}010 + 1\\cdot1{,}000 = 1{,}540$<br>
              $PE_0 \\cdot PE_2 = 0\\cdot0{,}909 + 1\\cdot(-0{,}416) + 0\\cdot0{,}020 + 1\\cdot1{,}000 = 0{,}584$<br>
              $PE_0 \\cdot PE_5 \\approx -0{,}292$ (дальше — меньше сходство)
            </div>
            <div class="why">Схожесть $PE_i \\cdot PE_j$ убывает с расстоянием $|i-j|$. Значит, через $QK^T$ attention «видит» позиционную близость. Близкие слова «притягиваются» через PE-компоненту scores.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Почему синусоиды лучше простых чисел?</h4>
            <div class="calc">
              Вариант 1: $PE_{pos} = pos$ (число). Проблема: при обучении на длинах до 512, на inference для длины 2048 — неизвестные значения.<br>
              Вариант 2: $PE_{pos} = \\text{случайный вектор}$. Проблема: нет структуры — близкие позиции не связаны.<br>
              Синусоиды: $PE_pos = (\\sin, \\cos, \\sin, \\cos, ...)$ — периодические, можно вычислить для любого $pos$, близкие позиции похожи.
            </div>
            <div class="calc">
              Бонус: $PE_{pos+k}$ линейно выражается через $PE_{pos}$ (свойство тригонометрии):<br>
              $\\sin(pos+k) = \\sin(pos)\\cos(k) + \\cos(pos)\\sin(k)$<br>
              Модель может выучить «сдвиг на k позиций» как линейное преобразование!
            </div>
            <div class="why">Современные модели (LLaMA, Mistral) используют RoPE (Rotary Positional Embedding) — ещё более элегантное решение, встраивающее позицию прямо в Q и K через вращение векторов.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Без PE: «Маша любит Диму» ≡ «Дима любит Машу». С $PE_{pos=0} = (0,1,0,1)$ и $PE_{pos=2} = (0{,}909, -0{,}416, 0{,}020, 1{,}0)$: разные позиции → разные входные векторы → разные attention → правильное понимание ролей субъекта и объекта.</p>
          </div>

          <div class="lesson-box">
            <b>Аналогия с GPS:</b> без PE — токены как точки без координат, нельзя понять кто рядом. PE — это GPS-координаты: теперь модель «знает», где каждое слово находится в предложении, и может учитывать расстояния между словами при вычислении attention.
          </div>
        `
      },
    ],

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

    python: `
      <h3>Transformer на Python (PyTorch + HuggingFace)</h3>
      <p>Строим TransformerEncoder вручную на PyTorch, затем используем HuggingFace pipeline в 3 строки.</p>

      <h4>1. PyTorch: nn.TransformerEncoder для классификации текста</h4>
      <pre><code>import torch
import torch.nn as nn
import math

class TransformerClassifier(nn.Module):
    def __init__(self, vocab_size=1000, d_model=128, nhead=4,
                 num_layers=2, num_classes=2, max_len=64):
        super().__init__()
        # Эмбеддинги: токены → векторы размера d_model
        self.embedding = nn.Embedding(vocab_size, d_model, padding_idx=0)
        # Позиционное кодирование (обучаемое — проще nn.Embedding)
        self.pos_emb   = nn.Embedding(max_len, d_model)

        # Ядро Transformer: стопка слоёв self-attention + FFN
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,          # количество голов внимания
            dim_feedforward=256,  # размер FFN внутри каждого слоя
            dropout=0.1,
            batch_first=True      # вход: [batch, seq, features]
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.classifier  = nn.Linear(d_model, num_classes)

    def forward(self, x, mask=None):
        seq_len = x.size(1)
        # Складываем токен-эмбеддинги и позиционные
        pos  = torch.arange(seq_len, device=x.device).unsqueeze(0)
        emb  = self.embedding(x) + self.pos_emb(pos)   # [B, seq, d_model]
        out  = self.transformer(emb, src_key_padding_mask=mask)  # [B, seq, d_model]
        # Агрегируем по всем позициям (mean pooling)
        out  = out.mean(dim=1)                          # [B, d_model]
        return self.classifier(out)                     # [B, num_classes]

# Тест: батч из 4 предложений длиной 32 токена
model = TransformerClassifier()
x_dummy = torch.randint(1, 1000, (4, 32))     # 4 предложения, 32 токена
logits  = model(x_dummy)
print(f"Логиты: {logits.shape}")              # [4, 2]
print(f"Параметров: {sum(p.numel() for p in model.parameters()):,}")
</code></pre>

      <h4>2. HuggingFace pipeline — классификация в 3 строки</h4>
      <pre><code>from transformers import pipeline

# Один вызов — скачивает модель, токенизирует, выдаёт результат
clf = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

# Классификация тональности (sentiment analysis)
texts = [
    "This movie was absolutely fantastic!",
    "I hated every minute of this film.",
    "It was okay, nothing special.",
]
results = clf(texts)
for text, res in zip(texts, results):
    print(f"{res['label']:8s} ({res['score']:.2%}): {text}")
</code></pre>

      <h4>3. Токенизатор HuggingFace — основы</h4>
      <pre><code>from transformers import AutoTokenizer
import torch

# Загружаем токенизатор BERT
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Токенизируем пару предложений
text1 = "The cat sat on the mat."
text2 = "I like cats and dogs."

# Автоматически добавляет [CLS], [SEP], паддинг и attention mask
encoded = tokenizer(
    [text1, text2],
    padding=True,          # дополняем до одной длины
    truncation=True,       # обрезаем если длиннее max_length
    max_length=32,
    return_tensors="pt"    # возвращаем PyTorch тензоры
)

print("input_ids shape:      ", encoded["input_ids"].shape)       # [2, 32]
print("attention_mask shape: ", encoded["attention_mask"].shape)  # [2, 32]

# Декодируем обратно в текст
decoded = tokenizer.decode(encoded["input_ids"][0], skip_special_tokens=True)
print("Декодировано:", decoded)

# Словарь: количество токенов
print(f"Размер словаря: {tokenizer.vocab_size:,}")   # ~30 000 у BERT
</code></pre>
    `,

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
