/* ==========================================================================
   Transformer
   ========================================================================== */
App.registerTopic({
  id: 'transformer',
  category: 'dl',
  title: 'Transformer',
  summary: `<a class="glossary-link" onclick="App.selectTopic('glossary-attention')">Attention</a> is all you need — архитектура современных LLM.`,

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('neural-network')">Многослойный перцептрон</a> ·
        <a onclick="App.selectTopic('rnn-lstm')">RNN и LSTM</a> ·
        <a onclick="App.selectTopic('nlp-basics')">Основы NLP</a> ·
        <a onclick="App.selectTopic('regularization')">Регуляризация</a>
      </div>
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
          <text x="555" y="70" text-anchor="end" font-size="10" fill="#334155">← Attention от «сидел»:</text>
          <text x="555" y="86" text-anchor="end" font-size="9" fill="#64748b">на кого смотрит это слово?</text>
          <text x="555" y="102" text-anchor="end" font-size="9" fill="#64748b">Больше всего — на «кот»</text>
          <text x="555" y="118" text-anchor="end" font-size="9" fill="#64748b">и «коврике» (субъект + место).</text>
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
        <li><b>Параллельная обработка</b> — все <a class="glossary-link" onclick="App.selectTopic('glossary-tokenization')">токены</a> обрабатываются одновременно.</li>
        <li><b>Прямые связи</b> — каждый токен напрямую «видит» все остальные.</li>
        <li><b>Единица расстояния</b> — путь между любыми двумя токенами = 1 операция.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Transformer использует только <b>attention</b> (внимание) и отказывается от рекуррентности. Каждое слово на каждом слое «смотрит» на все остальные и взвешенно их агрегирует. Это и делает Transformer таким мощным.</p>
      </div>

      <h3>💡 Self-Attention — сердце Transformer</h3>
      <p>Для каждого токена (слова) модель вычисляет <b>три вектора</b>. Проще всего понять их через аналогию с <b>поиском в базе данных</b>:</p>

      <div class="key-concept">
        <div class="kc-label">Аналогия Q / K / V = поиск в библиотеке</div>
        <p>Ты приходишь в библиотеку и спрашиваешь: «Мне нужна книга про космос» — это твой <b>Query</b> (запрос).</p>
        <p>У каждой книги на полке есть карточка-описание: «физика, планеты, звёзды» — это <b>Key</b> (ключ).</p>
        <p>Библиотекарь сравнивает твой запрос с каждой карточкой и решает, какие книги <b>релевантны</b>. Чем больше совпадение Query с Key — тем выше вес этой книги.</p>
        <p>А сам <b>текст книги</b>, который ты унесёшь — это <b>Value</b> (значение).</p>
        <p>Итого: ты получаешь смесь текстов книг, взвешенную по релевантности их карточек твоему запросу.</p>
      </div>

      <ul>
        <li><span class="term" data-tip="Query vector. 'Запрос' — что этот токен ищет в других токенах.">Query (Q)</span> — «что я ищу?» Каждый токен формулирует свой запрос.</li>
        <li><span class="term" data-tip="Key vector. 'Ключ' — что этот токен предлагает другим.">Key (K)</span> — «что у меня есть?» Каждый токен описывает свой «профиль».</li>
        <li><span class="term" data-tip="Value vector. 'Значение' — что этот токен передаёт, если на него обращают внимание.">Value (V)</span> — «какую информацию я несу?» Содержимое, которое передаётся.</li>
      </ul>

      <p>Все три вектора получаются из исходного <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">эмбеддинга</a> токена через обучаемые матрицы: $Q = x W^Q$, $K = x W^K$, $V = x W^V$.</p>

      <p><b>Алгоритм self-attention за 4 шага:</b></p>
      <ol>
        <li><b>Совместимость:</b> для каждой пары (token_i, token_j) считаем скалярное произведение $\\text{score}_{ij} = Q_i \\cdot K_j$. Чем ближе «запрос» и «ключ», тем выше скор.</li>
        <li><b>Масштабирование:</b> делим на $\\sqrt{d_k}$, где $d_k$ — размерность вектора Key.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">Softmax</a>:</b> превращаем скоры в веса (сумма = 1).</li>
        <li><b>Агрегация:</b> выход для токена i = взвешенная сумма V всех токенов.</li>
      </ol>

      <div class="math-block">$$\\text{Attention}(Q, K, V) = \\text{<a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">softmax</a>}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$$</div>

      <div class="key-concept">
        <div class="kc-label">Зачем делить на √d_k?</div>
        <p>Скалярное произведение двух случайных векторов размерности $d_k$ имеет дисперсию порядка $d_k$. Когда $d_k$ велико (64, 128...), скоры получаются огромными — например, 50 вместо 2. А $\\text{softmax}([50, 1, 2])$ ≈ $[1.0, 0.0, 0.0]$ — почти вся масса на одном элементе.</p>
        <p>Деление на $\\sqrt{d_k}$ возвращает дисперсию к ~1, и softmax остаётся «мягким» — модель может плавно распределять внимание между несколькими токенами, а не ставить всё на один.</p>
      </div>

      <h3>🔀 Multi-Head Attention</h3>
      <p>Одна операция attention фокусируется на одном типе связей. Но в языке одновременно важны <b>разные аспекты</b>: кто подлежащее, где сказуемое, какое прилагательное к какому существительному.</p>

      <p>Решение — запустить <b>h параллельных attention-операций</b> (голов), каждая со своими матрицами $W^Q_i, W^K_i, W^V_i$:</p>
      <ul>
        <li>Голова 1 может отслеживать синтаксические связи (подлежащее → сказуемое).</li>
        <li>Голова 2 — семантические (прилагательное → существительное).</li>
        <li>Голова 3 — длинные зависимости (местоимение → антецедент).</li>
        <li>Голова 4 — ближайших соседей.</li>
      </ul>

      <p><b>Как объединяются выходы:</b></p>
      <ol>
        <li>Каждая голова $i$ даёт свой выход $\\text{head}_i \\in \\mathbb{R}^{n \\times d_v}$ (где $d_v = d_{model} / h$).</li>
        <li>Все $h$ выходов <b>конкатенируются</b>: $[\\text{head}_1; \\text{head}_2; \\ldots; \\text{head}_h] \\in \\mathbb{R}^{n \\times d_{model}}$.</li>
        <li>Результат проецируется через обучаемую матрицу $W^O$: $\\text{MultiHead} = \\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h) W^O$.</li>
      </ol>
      <p>Итого: каждая голова «видит» мир через свою линзу, а финальная проекция $W^O$ учится комбинировать их взгляды.</p>

      <h3>📍 Positional Encoding</h3>
      <p>У self-attention есть особенность: он <b>не различает порядок</b> токенов. Для него «собака укусила человека» и «человек укусил собаку» одинаковы.</p>

      <p>Решение — <span class="term" data-tip="Positional Encoding. Векторы, добавляемые к эмбеддингам слов, кодирующие их позицию в последовательности. Позволяет attention учитывать порядок.">positional encoding</span>: к эмбеддингу каждого токена добавляем вектор, кодирующий его позицию. Теперь модель знает, где каждое слово стоит.</p>

      <p>Оригинальная статья использует синусоидальные encodings. Современные модели часто используют обучаемые или RoPE (rotary).</p>

      <h3>🏗️ Архитектура блока Transformer</h3>
      <pre>x → LayerNorm → Multi-Head Attention → + x  (residual)
  → LayerNorm → Feed-Forward Network → +     (residual)</pre>

      <p>Один блок содержит:</p>
      <ol>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-batchnorm')">Layer Normalization</a></b> — нормализация активаций.</li>
        <li><b>Multi-Head Attention</b> — главная операция.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-residual')">Residual connection</a></b> — добавляем вход к выходу.</li>
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
        title: 'Self-Attention от начала до конца',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Провести ПОЛНЫЙ forward pass через один Transformer-блок для предложения «Кот сидит» (2 токена). Размерность эмбеддинга $d = 4$, размерность attention $d_k = 3$. Показать ВСЕ шаги: эмбеддинги → позиционное кодирование → Q, K, V → attention scores → softmax → выход → residual → FFN.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Token <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">Embeddings</a></h4>
            <p>Каждый токен представляется 4-мерным вектором (обучаемый lookup table):</p>
            <div class="calc">
              $e_{\\text{Кот}} = (0.5,\\; -0.2,\\; 0.8,\\; 0.1)$<br>
              $e_{\\text{сидит}} = (-0.3,\\; 0.7,\\; 0.4,\\; -0.5)$
            </div>
            <div class="why">Эмбеддинги — это обучаемые векторы, по одному на каждый токен в словаре. Они инициализируются случайно и подстраиваются во время обучения. Числа выше — выдуманные для примера, но реальные эмбеддинги выглядят похоже.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Positional Encoding — добавляем информацию о позиции</h4>
            <div class="calc">
              Формула: $PE_{pos, 2i} = \\sin(pos / 10000^{2i/d})$, $PE_{pos, 2i+1} = \\cos(pos / 10000^{2i/d})$<br><br>

              Позиция 0 («Кот»), $d=4$:<br>
              $PE_{0,0} = \\sin(0 / 10000^{0/4}) = \\sin(0) = 0.000$<br>
              $PE_{0,1} = \\cos(0 / 10000^{0/4}) = \\cos(0) = 1.000$<br>
              $PE_{0,2} = \\sin(0 / 10000^{2/4}) = \\sin(0) = 0.000$<br>
              $PE_{0,3} = \\cos(0 / 10000^{2/4}) = \\cos(0) = 1.000$<br>
              $PE_0 = (0.000,\\; 1.000,\\; 0.000,\\; 1.000)$<br><br>

              Позиция 1 («сидит»):<br>
              $PE_{1,0} = \\sin(1 / 1) = \\sin(1) = 0.841$<br>
              $PE_{1,1} = \\cos(1 / 1) = \\cos(1) = 0.540$<br>
              $PE_{1,2} = \\sin(1 / 100) = \\sin(0.01) = 0.010$<br>
              $PE_{1,3} = \\cos(1 / 100) = \\cos(0.01) = 1.000$<br>
              $PE_1 = (0.841,\\; 0.540,\\; 0.010,\\; 1.000)$
            </div>
            <div class="calc">
              Поэлементное сложение:<br>
              $x_{\\text{Кот}} = e_{\\text{Кот}} + PE_0 = (0.5+0, -0.2+1, 0.8+0, 0.1+1) = (0.500,\\; 0.800,\\; 0.800,\\; 1.100)$<br>
              $x_{\\text{сидит}} = e_{\\text{сидит}} + PE_1 = (-0.3+0.841, 0.7+0.540, 0.4+0.010, -0.5+1) = (0.541,\\; 1.240,\\; 0.410,\\; 0.500)$
            </div>
            <div class="why">Без PE: если поменять «Кот» и «сидит» местами, attention будет одинаковым (множество тех же векторов). С PE: разные позиции создают разные входы, и модель «знает» порядок слов.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Вычисляем Q, K, V (проекции через обучаемые матрицы)</h4>
            <p>Матрицы проекции размером $4 \\times 3$ ($d \\times d_k$):</p>
            <div class="calc">
              $W_Q = \\begin{pmatrix} 0.3 & 0.1 & -0.2 \\\\ 0.5 & -0.4 & 0.1 \\\\ -0.1 & 0.6 & 0.3 \\\\ 0.2 & 0.0 & 0.5 \\end{pmatrix}$,
              $W_K = \\begin{pmatrix} 0.4 & -0.1 & 0.3 \\\\ -0.2 & 0.5 & 0.1 \\\\ 0.6 & 0.2 & -0.3 \\\\ 0.1 & 0.3 & 0.4 \\end{pmatrix}$,
              $W_V = \\begin{pmatrix} 0.2 & 0.5 & -0.1 \\\\ -0.3 & 0.1 & 0.4 \\\\ 0.7 & -0.2 & 0.3 \\\\ 0.0 & 0.6 & 0.1 \\end{pmatrix}$
            </div>
            <div class="calc">
              <b>Q для «Кот»:</b> $Q_{\\text{Кот}} = x_{\\text{Кот}} \\cdot W_Q = (0.5, 0.8, 0.8, 1.1) \\cdot W_Q$<br>
              $Q_{\\text{Кот}}[0] = 0.5 \\cdot 0.3 + 0.8 \\cdot 0.5 + 0.8 \\cdot (-0.1) + 1.1 \\cdot 0.2 = 0.15 + 0.40 - 0.08 + 0.22 = 0.69$<br>
              $Q_{\\text{Кот}}[1] = 0.5 \\cdot 0.1 + 0.8 \\cdot (-0.4) + 0.8 \\cdot 0.6 + 1.1 \\cdot 0.0 = 0.05 - 0.32 + 0.48 + 0 = 0.21$<br>
              $Q_{\\text{Кот}}[2] = 0.5 \\cdot (-0.2) + 0.8 \\cdot 0.1 + 0.8 \\cdot 0.3 + 1.1 \\cdot 0.5 = -0.10 + 0.08 + 0.24 + 0.55 = 0.77$<br>
              $Q_{\\text{Кот}} = (0.69,\\; 0.21,\\; 0.77)$<br><br>

              <b>Q для «сидит»:</b> $Q_{\\text{сидит}} = (0.541, 1.240, 0.410, 0.500) \\cdot W_Q$<br>
              $Q_{\\text{сидит}}[0] = 0.541 \\cdot 0.3 + 1.240 \\cdot 0.5 + 0.410 \\cdot (-0.1) + 0.500 \\cdot 0.2 = 0.162 + 0.620 - 0.041 + 0.100 = 0.841$<br>
              $Q_{\\text{сидит}}[1] = 0.541 \\cdot 0.1 + 1.240 \\cdot (-0.4) + 0.410 \\cdot 0.6 + 0.500 \\cdot 0.0 = 0.054 - 0.496 + 0.246 + 0 = -0.196$<br>
              $Q_{\\text{сидит}}[2] = 0.541 \\cdot (-0.2) + 1.240 \\cdot 0.1 + 0.410 \\cdot 0.3 + 0.500 \\cdot 0.5 = -0.108 + 0.124 + 0.123 + 0.250 = 0.389$<br>
              $Q_{\\text{сидит}} = (0.841,\\; -0.196,\\; 0.389)$
            </div>
            <div class="calc">
              Аналогично (сокращённо):<br>
              $K_{\\text{Кот}} = x_{\\text{Кот}} \\cdot W_K = (0.78,\\; 0.54,\\; 0.35)$<br>
              $K_{\\text{сидит}} = x_{\\text{сидит}} \\cdot W_K = (0.27,\\; 0.90,\\; 0.51)$<br><br>
              $V_{\\text{Кот}} = x_{\\text{Кот}} \\cdot W_V = (0.32,\\; 0.95,\\; 0.42)$<br>
              $V_{\\text{сидит}} = x_{\\text{сидит}} \\cdot W_V = (0.31,\\; 0.68,\\; 0.38)$
            </div>
            <div class="why">Q (query) = «что я ищу?», K (key) = «что я предлагаю?», V (value) = «какую информацию я несу?». Каждый токен одновременно задаёт вопрос (Q), предоставляет ключ (K) и содержит информацию (V). Разные W-матрицы позволяют этим ролям быть независимыми.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Attention Scores — $Q \\cdot K^T$ (каждый элемент — скалярное произведение)</h4>
            <div class="calc">
              $s_{11} = Q_{\\text{Кот}} \\cdot K_{\\text{Кот}} = 0.69 \\cdot 0.78 + 0.21 \\cdot 0.54 + 0.77 \\cdot 0.35$<br>
              $= 0.538 + 0.113 + 0.270 = <b>0.921</b>$<br><br>

              $s_{12} = Q_{\\text{Кот}} \\cdot K_{\\text{сидит}} = 0.69 \\cdot 0.27 + 0.21 \\cdot 0.90 + 0.77 \\cdot 0.51$<br>
              $= 0.186 + 0.189 + 0.393 = <b>0.768</b>$<br><br>

              $s_{21} = Q_{\\text{сидит}} \\cdot K_{\\text{Кот}} = 0.841 \\cdot 0.78 + (-0.196) \\cdot 0.54 + 0.389 \\cdot 0.35$<br>
              $= 0.656 - 0.106 + 0.136 = <b>0.686</b>$<br><br>

              $s_{22} = Q_{\\text{сидит}} \\cdot K_{\\text{сидит}} = 0.841 \\cdot 0.27 + (-0.196) \\cdot 0.90 + 0.389 \\cdot 0.51$<br>
              $= 0.227 - 0.176 + 0.198 = <b>0.249</b>$<br><br>

              $S = \\begin{pmatrix} 0.921 & 0.768 \\\\ 0.686 & 0.249 \\end{pmatrix}$
            </div>
            <div class="why">$s_{11} = 0.921 > s_{12} = 0.768$: «Кот» чуть больше обращает внимание на себя, чем на «сидит». $s_{21} = 0.686 \\gg s_{22} = 0.249$: «сидит» сильно обращает внимание на «Кот»! Это интуитивно верно: глагол «привязывается» к субъекту.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Scale by $\\sqrt{d_k} = \\sqrt{3} \\approx 1.732$</h4>
            <div class="calc">
              $\\tilde{S} = S / \\sqrt{3} = \\begin{pmatrix} 0.921/1.732 & 0.768/1.732 \\\\ 0.686/1.732 & 0.249/1.732 \\end{pmatrix} = \\begin{pmatrix} 0.532 & 0.443 \\\\ 0.396 & 0.144 \\end{pmatrix}$
            </div>
            <div class="why">Деление на $\\sqrt{d_k}$ предотвращает «замерзание» softmax. Без масштабирования при большом $d_k$ (например, 64 в BERT) скалярные произведения могут быть $\\sim \\sqrt{64} = 8$, и softmax выдаст почти <a class="glossary-link" onclick="App.selectTopic('glossary-one-hot')">one-hot</a> вектор (один вес ≈ 1, все ≈ 0). <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Градиенты</a> через такой softmax ≈ 0.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: Softmax — превращаем scores в вероятности (по строкам)</h4>
            <div class="calc">
              <b>Строка 1 (Кот):</b> $(0.532, 0.443)$<br>
              $e^{0.532} = 1.702$, $e^{0.443} = 1.557$<br>
              Сумма $= 1.702 + 1.557 = 3.259$<br>
              $\\alpha_{11} = 1.702 / 3.259 = <b>0.522</b>$ (внимание Кот → Кот)<br>
              $\\alpha_{12} = 1.557 / 3.259 = <b>0.478</b>$ (внимание Кот → сидит)<br>
              Проверка: $0.522 + 0.478 = 1.000$ ✓<br><br>

              <b>Строка 2 (сидит):</b> $(0.396, 0.144)$<br>
              $e^{0.396} = 1.486$, $e^{0.144} = 1.155$<br>
              Сумма $= 1.486 + 1.155 = 2.641$<br>
              $\\alpha_{21} = 1.486 / 2.641 = <b>0.563</b>$ (внимание сидит → Кот)<br>
              $\\alpha_{22} = 1.155 / 2.641 = <b>0.437</b>$ (внимание сидит → сидит)<br>
              Проверка: $0.563 + 0.437 = 1.000$ ✓
            </div>
            <div class="calc">
              $A = \\begin{pmatrix} 0.522 & 0.478 \\\\ 0.563 & 0.437 \\end{pmatrix}$
            </div>
            <div class="why">«Сидит» уделяет 56.3% внимания «Коту» — глагол «привязывается» к субъекту. «Кот» распределяет внимание почти поровну (52/48). Это результат одной случайной инициализации; после обучения веса станут более специализированными.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7: Output = Attention Weights x V</h4>
            <div class="calc">
              <b>Выход для «Кот»:</b><br>
              $z_{\\text{Кот}} = 0.522 \\cdot V_{\\text{Кот}} + 0.478 \\cdot V_{\\text{сидит}}$<br>
              $= 0.522 \\cdot (0.32, 0.95, 0.42) + 0.478 \\cdot (0.31, 0.68, 0.38)$<br>
              $= (0.167, 0.496, 0.219) + (0.148, 0.325, 0.182)$<br>
              $= <b>(0.315, 0.821, 0.401)</b>$<br><br>

              <b>Выход для «сидит»:</b><br>
              $z_{\\text{сидит}} = 0.563 \\cdot V_{\\text{Кот}} + 0.437 \\cdot V_{\\text{сидит}}$<br>
              $= 0.563 \\cdot (0.32, 0.95, 0.42) + 0.437 \\cdot (0.31, 0.68, 0.38)$<br>
              $= (0.180, 0.535, 0.236) + (0.135, 0.297, 0.166)$<br>
              $= <b>(0.316, 0.832, 0.402)</b>$
            </div>
            <div class="why">Теперь каждый вектор — это КОНТЕКСТУАЛИЗИРОВАННОЕ представление. $z_{\\text{сидит}}$ содержит 56.3% информации от «Кот» — глагол «знает» про своего субъекта. Одно слово «сидит» будет иметь разные $z$ в «Кот сидит» vs. «Собака сидит».</div>
          </div>

          <div class="step" data-step="8">
            <h4>Шаг 8: SVG — полная схема вычислений</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 520 260" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
                <defs>
                  <marker id="tf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>
                <text x="260" y="16" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Self-Attention: полный pipeline с числами</text>
                <!-- Input embeddings -->
                <rect x="20" y="30" width="100" height="28" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
                <text x="70" y="48" text-anchor="middle" font-size="9" fill="#1e40af">x_Кот (4D)</text>
                <rect x="20" y="64" width="100" height="28" rx="5" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
                <text x="70" y="82" text-anchor="middle" font-size="9" fill="#1e40af">x_сидит (4D)</text>
                <!-- W_Q, W_K, W_V -->
                <rect x="150" y="30" width="70" height="62" rx="5" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
                <text x="185" y="55" text-anchor="middle" font-size="9" fill="#92400e" font-weight="600">W_Q,K,V</text>
                <text x="185" y="70" text-anchor="middle" font-size="8" fill="#92400e">4x3</text>
                <!-- Arrow -->
                <line x1="120" y1="60" x2="148" y2="60" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
                <!-- Q,K,V -->
                <rect x="240" y="28" width="60" height="22" rx="4" fill="#dcfce7" stroke="#22c55e" stroke-width="1.2"/>
                <text x="270" y="43" text-anchor="middle" font-size="9" fill="#166534">Q (2x3)</text>
                <rect x="240" y="52" width="60" height="22" rx="4" fill="#fce7f3" stroke="#ec4899" stroke-width="1.2"/>
                <text x="270" y="67" text-anchor="middle" font-size="9" fill="#9d174d">K (2x3)</text>
                <rect x="240" y="76" width="60" height="22" rx="4" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.2"/>
                <text x="270" y="91" text-anchor="middle" font-size="9" fill="#5b21b6">V (2x3)</text>
                <line x1="220" y1="60" x2="238" y2="60" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
                <!-- QK^T -->
                <rect x="330" y="40" width="80" height="32" rx="5" fill="#fff7ed" stroke="#f97316" stroke-width="1.5"/>
                <text x="370" y="55" text-anchor="middle" font-size="9" fill="#9a3412" font-weight="600">QK^T / sqrt(3)</text>
                <text x="370" y="67" text-anchor="middle" font-size="8" fill="#9a3412">2x2 scores</text>
                <line x1="300" y1="55" x2="328" y2="55" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
                <!-- Softmax -->
                <rect x="330" y="90" width="80" height="28" rx="5" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
                <text x="370" y="108" text-anchor="middle" font-size="9" fill="#991b1b" font-weight="600">softmax</text>
                <line x1="370" y1="72" x2="370" y2="88" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
                <!-- Attention weights -->
                <rect x="430" y="90" width="80" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
                <text x="470" y="104" text-anchor="middle" font-size="8" fill="#1e40af" font-weight="600">.52 .48</text>
                <text x="470" y="114" text-anchor="middle" font-size="8" fill="#1e40af" font-weight="600">.56 .44</text>
                <line x1="410" y1="104" x2="428" y2="104" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
                <!-- A * V -->
                <rect x="430" y="140" width="80" height="28" rx="5" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
                <text x="470" y="158" text-anchor="middle" font-size="9" fill="#166534" font-weight="600">A * V = Z</text>
                <line x1="470" y1="118" x2="470" y2="138" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
                <!-- Residual -->
                <rect x="330" y="190" width="180" height="28" rx="5" fill="#f3e8ff" stroke="#a855f7" stroke-width="2"/>
                <text x="420" y="208" text-anchor="middle" font-size="9" fill="#6b21a8" font-weight="600">Residual: Z + X → FFN</text>
                <line x1="470" y1="168" x2="470" y2="188" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
                <!-- Output -->
                <rect x="380" y="235" width="100" height="22" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
                <text x="430" y="250" text-anchor="middle" font-size="9" fill="#1e40af" font-weight="700">Output (2x4)</text>
                <line x1="430" y1="218" x2="430" y2="233" stroke="#64748b" stroke-width="1.5" marker-end="url(#tf-arr)"/>
              </svg>
            </div>
          </div>

          <div class="step" data-step="9">
            <h4>Шаг 9: Residual Connection — добавляем вход обратно</h4>
            <p>Attention output $z$ имеет размерность $d_k = 3$, но вход $x$ имеет размерность $d = 4$. В реальных Transformer $d_k = d$, или используется проекция $W_O$. Для нашего примера спроецируем $z$ обратно в $d=4$:</p>
            <div class="calc">
              $W_O = \\begin{pmatrix} 0.5 & -0.2 & 0.3 & 0.1 \\\\ 0.1 & 0.6 & -0.1 & 0.4 \\\\ -0.3 & 0.2 & 0.5 & 0.2 \\end{pmatrix}$ (размер $3 \\times 4$)<br><br>

              $z'_{\\text{Кот}} = z_{\\text{Кот}} \\cdot W_O = (0.315, 0.821, 0.401) \\cdot W_O$<br>
              $= (0.315 \\cdot 0.5 + 0.821 \\cdot 0.1 + 0.401 \\cdot (-0.3),\\; ...)$<br>
              $\\approx (0.119,\\; 0.510,\\; 0.313,\\; 0.440)$<br><br>

              Residual: $r_{\\text{Кот}} = x_{\\text{Кот}} + z'_{\\text{Кот}} = (0.500, 0.800, 0.800, 1.100) + (0.119, 0.510, 0.313, 0.440)$<br>
              $= <b>(0.619, 1.310, 1.113, 1.540)</b>$
            </div>
            <div class="why">Residual connection (skip connection) решает две проблемы: (1) стабильность обучения — градиент «обходит» сложный блок; (2) сохранение оригинальной информации — если attention бесполезен, сеть может его игнорировать (выучить $W_O \\approx 0$).</div>
          </div>

          <div class="step" data-step="10">
            <h4>Шаг 10: Feed-Forward Network (FFN)</h4>
            <p>FFN применяется к каждой позиции НЕЗАВИСИМО:</p>
            <div class="calc">
              FFN(x) = $\\text{<a class="glossary-link" onclick="App.selectTopic('glossary-activations')">ReLU</a>}(x \\cdot W_1 + b_1) \\cdot W_2 + b_2$<br><br>

              Обычно $d_{ff} = 4d$, но возьмём $d_{ff} = 3$ для простоты:<br>
              $W_1$ размер $4 \\times 3$, $W_2$ размер $3 \\times 4$<br><br>

              Для $r_{\\text{Кот}} = (0.619, 1.310, 1.113, 1.540)$:<br><br>

              Допустим $W_1 = \\begin{pmatrix} 0.4 & -0.2 & 0.3 \\\\ 0.1 & 0.5 & -0.1 \\\\ -0.3 & 0.2 & 0.6 \\\\ 0.2 & 0.1 & 0.4 \\end{pmatrix}$, $b_1 = (0.1, 0.0, -0.1)$<br><br>

              Скрытый слой: $h = r_{\\text{Кот}} \\cdot W_1 + b_1$<br>
              $h[0] = 0.619 \\cdot 0.4 + 1.310 \\cdot 0.1 + 1.113 \\cdot (-0.3) + 1.540 \\cdot 0.2 + 0.1 = 0.248 + 0.131 - 0.334 + 0.308 + 0.1 = 0.453$<br>
              $h[1] = 0.619 \\cdot (-0.2) + 1.310 \\cdot 0.5 + 1.113 \\cdot 0.2 + 1.540 \\cdot 0.1 + 0.0 = -0.124 + 0.655 + 0.223 + 0.154 = 0.908$<br>
              $h[2] = 0.619 \\cdot 0.3 + 1.310 \\cdot (-0.1) + 1.113 \\cdot 0.6 + 1.540 \\cdot 0.4 - 0.1 = 0.186 - 0.131 + 0.668 + 0.616 - 0.1 = 1.239$<br><br>

              ReLU: $\\text{ReLU}(0.453, 0.908, 1.239) = (0.453, 0.908, 1.239)$ (все > 0)<br><br>

              Выход: $\\text{FFN}_{\\text{Кот}} = (0.453, 0.908, 1.239) \\cdot W_2 + b_2 \\approx (0.52, 0.87, 0.63, 0.91)$<br><br>

              + ещё один residual: $\\text{out}_{\\text{Кот}} = r_{\\text{Кот}} + \\text{FFN}_{\\text{Кот}} \\approx <b>(1.14, 2.18, 1.74, 2.45)</b>$
            </div>
            <div class="why">FFN — это «обработка» каждого токена по отдельности. Attention смешивает информацию между токенами, а FFN трансформирует каждый вектор. Вместе они формируют один Transformer block. В GPT-3 таких блоков 96, каждый уточняет представление.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Полный pipeline для «Кот сидит»: эмбеддинги (4D) + PE → проекции Q,K,V (3D) → scores $QK^T$ → scale → softmax: «сидит» уделяет 56.3% внимания «Коту» → взвешенная сумма V → проекция $W_O$ + residual → FFN + residual → выход. Каждый токен получил контекстуализированное представление, обогащённое информацией от другого токена.</p>
          </div>
        `
      },
      {
        title: 'Multi-Head: 2 головы видят разное',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как 2 головы attention на тех же 2 токенах «Кот сидит» фокусируются на РАЗНОМ. Каждая голова имеет свои $W_Q, W_K, W_V$ размером $4 \\times 2$ (итого $d_k = 2$ на голову, вместе $d_{model} = 4$). Вычислить attention в каждой голове, конкатенировать, спроецировать.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: входные векторы (после PE)</h4>
            <div class="calc">
              $x_{\\text{Кот}} = (0.500, 0.800, 0.800, 1.100)$<br>
              $x_{\\text{сидит}} = (0.541, 1.240, 0.410, 0.500)$
            </div>
            <div class="why">Это те же входы из предыдущего примера. Но теперь вместо одной головы с $d_k=3$, мы используем 2 головы по $d_k=2$. Общее число параметров примерно одинаковое, но модель получает 2 разных «взгляда» на данные.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Голова 1 — «синтаксическая» (W настроены на субъект-глагол)</h4>
            <div class="calc">
              $W_Q^{(1)} = \\begin{pmatrix} 0.8 & 0.0 \\\\ -0.5 & 0.3 \\\\ 0.2 & 0.7 \\\\ 0.1 & -0.4 \\end{pmatrix}$,
              $W_K^{(1)} = \\begin{pmatrix} 0.6 & 0.2 \\\\ 0.3 & -0.5 \\\\ -0.1 & 0.8 \\\\ 0.4 & 0.1 \\end{pmatrix}$<br><br>

              $Q^{(1)}_{\\text{Кот}} = (0.5, 0.8, 0.8, 1.1) \\cdot W_Q^{(1)}$<br>
              $= (0.5 \\cdot 0.8 + 0.8 \\cdot (-0.5) + 0.8 \\cdot 0.2 + 1.1 \\cdot 0.1,\\; 0.5 \\cdot 0 + 0.8 \\cdot 0.3 + 0.8 \\cdot 0.7 + 1.1 \\cdot (-0.4))$<br>
              $= (0.40 - 0.40 + 0.16 + 0.11,\\; 0 + 0.24 + 0.56 - 0.44) = <b>(0.27, 0.36)</b>$<br><br>

              $Q^{(1)}_{\\text{сидит}} = (0.541, 1.24, 0.41, 0.5) \\cdot W_Q^{(1)}$<br>
              $= (0.433 - 0.620 + 0.082 + 0.050,\\; 0 + 0.372 + 0.287 - 0.200) = <b>(-0.055, 0.459)</b>$<br><br>

              $K^{(1)}_{\\text{Кот}} = (0.5, 0.8, 0.8, 1.1) \\cdot W_K^{(1)} = (0.30 + 0.24 - 0.08 + 0.44,\\; 0.10 - 0.40 + 0.64 + 0.11) = <b>(0.90, 0.45)</b>$<br>
              $K^{(1)}_{\\text{сидит}} = (0.541, 1.24, 0.41, 0.5) \\cdot W_K^{(1)} = (0.325 + 0.372 - 0.041 + 0.200,\\; 0.108 - 0.620 + 0.328 + 0.050) = <b>(0.856, -0.134)</b>$
            </div>
            <div class="calc">
              Scores головы 1 (scale by $\\sqrt{2} = 1.414$):<br>
              $s^{(1)}_{11} = (0.27 \\cdot 0.90 + 0.36 \\cdot 0.45) / 1.414 = (0.243 + 0.162) / 1.414 = 0.405 / 1.414 = <b>0.286</b>$<br>
              $s^{(1)}_{12} = (0.27 \\cdot 0.856 + 0.36 \\cdot (-0.134)) / 1.414 = (0.231 - 0.048) / 1.414 = 0.183 / 1.414 = <b>0.129</b>$<br>
              $s^{(1)}_{21} = (-0.055 \\cdot 0.90 + 0.459 \\cdot 0.45) / 1.414 = (-0.050 + 0.207) / 1.414 = <b>0.111</b>$<br>
              $s^{(1)}_{22} = (-0.055 \\cdot 0.856 + 0.459 \\cdot (-0.134)) / 1.414 = (-0.047 - 0.062) / 1.414 = <b>-0.077</b>$
            </div>
            <div class="calc">
              Softmax строка 2 (сидит): $(0.111, -0.077)$<br>
              $e^{0.111} = 1.117$, $e^{-0.077} = 0.926$<br>
              Сумма = 2.043<br>
              $\\alpha^{(1)}_{21} = 1.117/2.043 = <b>0.547</b>$ (сидит → Кот)<br>
              $\\alpha^{(1)}_{22} = 0.926/2.043 = <b>0.453</b>$ (сидит → сидит)
            </div>
            <div class="why">Голова 1: «сидит» уделяет 54.7% внимания «Коту». Эти веса ищут связь «субъект ← глагол» (кто сидит?).</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Голова 2 — «позиционная» (другие W, другой паттерн)</h4>
            <div class="calc">
              $W_Q^{(2)} = \\begin{pmatrix} 0.1 & 0.6 \\\\ 0.7 & -0.2 \\\\ -0.3 & 0.4 \\\\ 0.5 & 0.1 \\end{pmatrix}$,
              $W_K^{(2)} = \\begin{pmatrix} -0.2 & 0.5 \\\\ 0.4 & 0.3 \\\\ 0.6 & -0.1 \\\\ -0.1 & 0.7 \\end{pmatrix}$<br><br>

              $Q^{(2)}_{\\text{Кот}} = (0.5, 0.8, 0.8, 1.1) \\cdot W_Q^{(2)} = (0.05 + 0.56 - 0.24 + 0.55,\\; 0.30 - 0.16 + 0.32 + 0.11) = <b>(0.92, 0.57)</b>$<br>
              $Q^{(2)}_{\\text{сидит}} = (0.541, 1.24, 0.41, 0.5) \\cdot W_Q^{(2)} = (0.054 + 0.868 - 0.123 + 0.250,\\; 0.325 - 0.248 + 0.164 + 0.050) = <b>(1.049, 0.291)</b>$<br><br>

              $K^{(2)}_{\\text{Кот}} = <b>(0.34, 0.96)</b>$ (аналогичный расчёт)<br>
              $K^{(2)}_{\\text{сидит}} = <b>(0.630, 0.596)</b>$
            </div>
            <div class="calc">
              Scores головы 2 / $\\sqrt{2}$:<br>
              $s^{(2)}_{21} = (1.049 \\cdot 0.34 + 0.291 \\cdot 0.96) / 1.414 = (0.357 + 0.279) / 1.414 = <b>0.450</b>$<br>
              $s^{(2)}_{22} = (1.049 \\cdot 0.630 + 0.291 \\cdot 0.596) / 1.414 = (0.661 + 0.173) / 1.414 = <b>0.590</b>$<br><br>

              Softmax строка 2 (сидит): $(0.450, 0.590)$<br>
              $e^{0.450} = 1.568$, $e^{0.590} = 1.804$<br>
              $\\alpha^{(2)}_{21} = 1.568/3.372 = <b>0.465</b>$ (сидит → Кот)<br>
              $\\alpha^{(2)}_{22} = 1.804/3.372 = <b>0.535</b>$ (сидит → сидит)
            </div>
            <div class="why">Голова 2: «сидит» уделяет 53.5% внимания СЕБЕ (и 46.5% «Коту»). Это другой паттерн! Голова 1 фокусируется на субъекте (Кот: 54.7%), Голова 2 — на себе (сидит: 53.5%). Разные головы «видят» разные зависимости.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: сравнение паттернов двух голов</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Строка «сидит»</th><th>Внимание на «Кот»</th><th>Внимание на «сидит»</th><th>Фокус</th></tr>
                <tr><td>Голова 1</td><td><b>0.547</b></td><td>0.453</td><td>→ субъект (Кот)</td></tr>
                <tr><td>Голова 2</td><td>0.465</td><td><b>0.535</b></td><td>→ себя (позиционный)</td></tr>
              </table>
            </div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: конкатенация и проекция $W_O$</h4>
            <div class="calc">
              $V^{(1)} = \\begin{pmatrix} 0.3 & 0.7 \\\\ -0.1 & 0.4 \\\\ 0.5 & -0.2 \\\\ 0.2 & 0.6 \\end{pmatrix}$,
              $V^{(2)} = \\begin{pmatrix} 0.6 & -0.3 \\\\ 0.2 & 0.8 \\\\ -0.4 & 0.1 \\\\ 0.3 & 0.5 \\end{pmatrix}$<br><br>

              $V^{(1)}_{\\text{Кот}} = (0.5, 0.8, 0.8, 1.1) \\cdot V^{(1)} = (0.15-0.08+0.40+0.22,\\; 0.35+0.32-0.16+0.66) = (0.69, 1.17)$<br>
              $V^{(1)}_{\\text{сидит}} = (-0.054+0.496+0.205+0.1,\\; 0.379-0.248-0.082+0.3) = (0.747, 0.349)$ (сокращённо)<br><br>

              Выход головы 1 для «сидит»: $z^{(1)} = 0.547 \\cdot (0.69, 1.17) + 0.453 \\cdot (0.747, 0.349) = (0.377+0.338,\\; 0.640+0.158) = <b>(0.716, 0.798)</b>$<br><br>

              Аналогично выход головы 2 для «сидит»: $z^{(2)} \\approx <b>(0.52, 0.41)</b>$<br><br>

              Конкатенация: $[z^{(1)}, z^{(2)}] = (0.716, 0.798, 0.52, 0.41) \\in \\mathbb{R}^4$<br><br>

              $W_O \\cdot (0.716, 0.798, 0.52, 0.41)^T \\approx <b>(0.73, 0.68, 0.55, 0.71)</b>$ — финальный вектор «сидит»
            </div>
            <div class="why">$W_O$ (размер $4 \\times 4$) смешивает информацию от обеих голов. Финальный вектор «сидит» содержит: информацию о субъекте (от головы 1) + позиционную информацию (от головы 2). Две специализированные головы лучше, чем одна универсальная!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>2 головы с $d_k=2$: Голова 1 — «сидит» фокусируется на «Кот» (54.7%), ищет субъект. Голова 2 — «сидит» фокусируется на себе (53.5%), кодирует позицию. Конкатенация двух 2D выходов → проекция $W_O$ → 4D вектор, кодирующий оба аспекта. Multi-Head = несколько параллельных «взглядов» на данные без увеличения параметров.</p>
          </div>
        `
      },
      {
        title: 'Causal mask: decoder не подсматривает',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как causal (autoregressive) mask в decoder не даёт токенам «заглядывать в будущее». 3 токена: «Я», «люблю», «кота». Вычислить masked attention, где каждый токен видит только себя и предыдущие.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: зачем нужна маска</h4>
            <div class="calc">
              При генерации текста (GPT, Claude):<br>
              • Модель генерирует по одному токену за раз<br>
              • Когда предсказывает токен 3, токены 4, 5, ... ещё не существуют<br>
              • При ОБУЧЕНИИ все токены известны, но мы должны имитировать генерацию<br>
              • Решение: маска, запрещающая «подглядывать» вправо
            </div>
            <div class="why">Без маски: при обучении «Я люблю кота» модель бы «подсматривала» ответ. Токен «люблю» видел бы «кота» и тривиально предсказал бы его. Обучение стало бы бесполезным — модель не научилась бы генерировать.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: scores без маски</h4>
            <p>Допустим, уже вычислили масштабированные scores $\\tilde{S} = QK^T / \\sqrt{d_k}$:</p>
            <div class="calc">
              $\\tilde{S} = \\begin{pmatrix} 1.2 & 0.5 & 0.8 \\\\ 0.3 & 1.5 & 0.9 \\\\ 0.7 & 0.4 & 1.1 \\end{pmatrix}$<br><br>
              Строки = query (кто смотрит), столбцы = key (на кого смотрят):<br>
              «Я» видит всех: (1.2, 0.5, 0.8)<br>
              «люблю» видит всех: (0.3, 1.5, 0.9)<br>
              «кота» видит всех: (0.7, 0.4, 1.1)
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: применяем causal mask</h4>
            <div class="calc">
              Маска: нижнетреугольная матрица. Позиции выше диагонали → $-\\infty$<br><br>

              $M = \\begin{pmatrix} 0 & -\\infty & -\\infty \\\\ 0 & 0 & -\\infty \\\\ 0 & 0 & 0 \\end{pmatrix}$<br><br>

              $\\tilde{S} + M = \\begin{pmatrix} 1.2 & -\\infty & -\\infty \\\\ 0.3 & 1.5 & -\\infty \\\\ 0.7 & 0.4 & 1.1 \\end{pmatrix}$
            </div>

            <div class="illustration bordered">
              <svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
                <text x="230" y="16" text-anchor="middle" font-size="11" font-weight="700" fill="#334155">Causal Mask: запрет на будущие токены</text>
                <!-- Column headers -->
                <text x="175" y="48" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">Я</text>
                <text x="245" y="48" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">люблю</text>
                <text x="315" y="48" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">кота</text>
                <!-- Row headers -->
                <text x="120" y="83" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">Я</text>
                <text x="120" y="123" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">люблю</text>
                <text x="120" y="163" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">кота</text>
                <!-- Row 0: Я видит только себя -->
                <rect x="140" y="58" width="70" height="40" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5" rx="3"/>
                <text x="175" y="82" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">1.2</text>
                <rect x="210" y="58" width="70" height="40" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" rx="3"/>
                <text x="245" y="82" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="600">-inf</text>
                <rect x="280" y="58" width="70" height="40" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" rx="3"/>
                <text x="315" y="82" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="600">-inf</text>
                <!-- Row 1: люблю видит Я и себя -->
                <rect x="140" y="98" width="70" height="40" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5" rx="3"/>
                <text x="175" y="122" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">0.3</text>
                <rect x="210" y="98" width="70" height="40" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5" rx="3"/>
                <text x="245" y="122" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">1.5</text>
                <rect x="280" y="98" width="70" height="40" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" rx="3"/>
                <text x="315" y="122" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="600">-inf</text>
                <!-- Row 2: кота видит всех -->
                <rect x="140" y="138" width="70" height="40" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5" rx="3"/>
                <text x="175" y="162" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">0.7</text>
                <rect x="210" y="138" width="70" height="40" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5" rx="3"/>
                <text x="245" y="162" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">0.4</text>
                <rect x="280" y="138" width="70" height="40" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5" rx="3"/>
                <text x="315" y="162" text-anchor="middle" font-size="11" fill="#166534" font-weight="600">1.1</text>
                <!-- Legend -->
                <rect x="370" y="70" width="14" height="14" fill="#dcfce7" stroke="#22c55e" stroke-width="1" rx="2"/>
                <text x="390" y="81" font-size="9" fill="#166534">видно</text>
                <rect x="370" y="92" width="14" height="14" fill="#fee2e2" stroke="#ef4444" stroke-width="1" rx="2"/>
                <text x="390" y="103" font-size="9" fill="#991b1b">замаскировано</text>
              </svg>
              <div class="caption">Causal mask: зелёные ячейки видны, красные ($-\\infty$) — запрещены. «Я» видит только себя, «люблю» видит «Я» и себя, «кота» видит всех.</div>
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Softmax с маской</h4>
            <div class="calc">
              <b>Строка 1 («Я»):</b> $(1.2, -\\infty, -\\infty)$<br>
              $e^{1.2} = 3.320$, $e^{-\\infty} = 0$, $e^{-\\infty} = 0$<br>
              Сумма = 3.320<br>
              $\\alpha = (3.320/3.320, 0, 0) = <b>(1.000, 0.000, 0.000)</b>$<br>
              → «Я» обращает 100% внимания на себя. Первый токен ничего не знает о будущем.<br><br>

              <b>Строка 2 («люблю»):</b> $(0.3, 1.5, -\\infty)$<br>
              $e^{0.3} = 1.350$, $e^{1.5} = 4.482$, $e^{-\\infty} = 0$<br>
              Сумма = 5.832<br>
              $\\alpha = (1.350/5.832, 4.482/5.832, 0) = <b>(0.231, 0.769, 0.000)</b>$<br>
              → «люблю» видит «Я» (23.1%) и себя (76.9%). НЕ видит «кота».<br><br>

              <b>Строка 3 («кота»):</b> $(0.7, 0.4, 1.1)$ — без маски, все видны<br>
              $e^{0.7} = 2.014$, $e^{0.4} = 1.492$, $e^{1.1} = 3.004$<br>
              Сумма = 6.510<br>
              $\\alpha = (2.014/6.510, 1.492/6.510, 3.004/6.510) = <b>(0.309, 0.229, 0.461)</b>$<br>
              → «кота» видит всех (последний токен имеет полный контекст)
            </div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: итоговая masked attention matrix</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Query ↓ / Key →</th><th>Я</th><th>люблю</th><th>кота</th></tr>
                <tr><td><b>Я</b></td><td>1.000</td><td>0.000</td><td>0.000</td></tr>
                <tr><td><b>люблю</b></td><td>0.231</td><td>0.769</td><td>0.000</td></tr>
                <tr><td><b>кота</b></td><td>0.309</td><td>0.229</td><td>0.461</td></tr>
              </table>
            </div>
            <div class="calc">
              Сравнение с BEZ маски (encoder-style):<br>
              Без маски «люблю» → $(0.122, 0.538, 0.340)$ — видит «кота» на 34%<br>
              С маской «люблю» → $(0.231, 0.769, 0.000)$ — НЕ видит «кота»<br><br>
              Это гарантирует: предсказание токена 3 основано ТОЛЬКО на токенах 1 и 2.
            </div>
            <div class="why">Causal mask — это то, что делает GPT, Claude и другие autoregressive модели честными. При обучении: все токены обрабатываются параллельно (быстро!), но каждый «видит» только прошлое (корректно!). Трюк: одна маска заменяет N отдельных forward pass.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: как маска работает при генерации</h4>
            <div class="calc">
              Генерация «Я люблю кота»:<br><br>
              Шаг 1: Вход: «Я». Attention: [1.00]. Предсказание следующего: «люблю»<br>
              Шаг 2: Вход: «Я люблю». Attention: $\\begin{pmatrix} 1.00 & 0 \\\\ 0.23 & 0.77 \\end{pmatrix}$. Предсказание: «кота»<br>
              Шаг 3: Вход: «Я люблю кота». Attention: $\\begin{pmatrix} 1.00 & 0 & 0 \\\\ 0.23 & 0.77 & 0 \\\\ 0.31 & 0.23 & 0.46 \\end{pmatrix}$. Предсказание: «.»<br><br>

              При обучении ВСЕ это вычисляется за ОДИН forward pass (маска имитирует авторегрессию)!
            </div>
            <div class="why">Маска — ключ к эффективному обучению decoder моделей. Без неё пришлось бы делать N отдельных forward pass (для каждой длины префикса). С маской — один проход, и каждая позиция учится предсказывать следующий токен параллельно.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Causal mask заменяет верхний треугольник scores на $-\\infty$ до softmax. Результат: «Я» видит только себя (100%), «люблю» видит «Я» (23.1%) и себя (76.9%) но НЕ «кота», «кота» видит всех. Маска обеспечивает авторегрессивность при параллельном обучении — один forward pass вместо N.</p>
          </div>
        `
      },
    ],

    simulation: [
      {
        title: 'Attention heatmap',
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
      {
        title: 'Positional encoding',
        html: `
          <h3>Позиционное кодирование</h3>
          <p>Self-attention не различает порядок токенов — для него набор слов. Чтобы сеть знала позицию, к эмбеддингам прибавляют позиционный вектор. В оригинальной статье его строят из синусов и косинусов разной частоты:</p>
          <p>$$PE(pos, 2i) = \\sin(pos / 10000^{2i/d}),\\quad PE(pos, 2i+1) = \\cos(pos / 10000^{2i/d})$$</p>
          <p>Каждая строка — позиция, каждый столбец — размерность. Низкие размерности меняются быстро (высокочастотные), высокие — медленно.</p>
          <div class="sim-container">
            <div class="sim-controls" id="trp-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:360px;padding:0;"><canvas id="trp-heat" class="sim-canvas"></canvas></div>
              <div class="sim-chart-wrap" style="height:200px;"><canvas id="trp-lines"></canvas></div>
              <div class="sim-stats" id="trp-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#trp-controls');
          const cSeq = App.makeControl('range', 'trp-seq', 'Длина последовательности', { min: 10, max: 80, step: 1, value: 40 });
          const cDim = App.makeControl('range', 'trp-dim', 'Размерность d', { min: 8, max: 64, step: 2, value: 32 });
          [cSeq, cDim].forEach(c => controls.appendChild(c.wrap));

          const canvas = container.querySelector('#trp-heat');
          const ctx = canvas.getContext('2d');
          let chart = null;

          function makePE(L, d) {
            const pe = Array.from({ length: L }, () => new Array(d).fill(0));
            for (let pos = 0; pos < L; pos++) {
              for (let i = 0; i < d; i++) {
                const twoI = 2 * Math.floor(i / 2);
                const angle = pos / Math.pow(10000, twoI / d);
                pe[pos][i] = (i % 2 === 0) ? Math.sin(angle) : Math.cos(angle);
              }
            }
            return pe;
          }

          function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

          function draw() {
            if (!canvas.width) return;
            const L = +cSeq.input.value;
            const d = +cDim.input.value;
            const pe = makePE(L, d);
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            const padL = 50, padT = 30, padR = 20, padB = 30;
            const cw = (W - padL - padR) / d;
            const ch = (H - padT - padB) / L;
            for (let pos = 0; pos < L; pos++) {
              for (let i = 0; i < d; i++) {
                const v = pe[pos][i]; // [-1, 1]
                const t = (v + 1) / 2;
                const r = Math.round(239 * (1 - t) + 59 * t);
                const g = Math.round(68 * (1 - t) + 130 * t);
                const b = Math.round(68 * (1 - t) + 246 * t);
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(padL + i * cw, padT + pos * ch, cw + 0.5, ch + 0.5);
              }
            }
            ctx.fillStyle = '#0f172a';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText('размерность →', padL + (W - padL - padR) / 2, padT - 8);
            ctx.save();
            ctx.translate(padL - 8, padT + (H - padT - padB) / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText('позиция →', 0, 0);
            ctx.restore();

            // Line chart: выберем несколько размерностей, покажем как функция от позиции
            const ctxL = container.querySelector('#trp-lines').getContext('2d');
            if (chart) chart.destroy();
            const dims = [0, 2, Math.floor(d / 4), Math.floor(d / 2)];
            const labels = Array.from({ length: L }, (_, i) => i);
            chart = new Chart(ctxL, {
              type: 'line',
              data: {
                labels,
                datasets: dims.map((k, idx) => ({
                  label: `PE[·, ${k}]`,
                  data: pe.map(row => row[k]),
                  borderColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][idx],
                  borderWidth: 2, pointRadius: 0, fill: false,
                })),
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Синусоиды разной частоты по размерностям' } },
                scales: { x: { title: { display: true, text: 'позиция' } }, y: { min: -1.1, max: 1.1 } },
              },
            });
            App.registerChart(chart);

            container.querySelector('#trp-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Длина</div><div class="stat-value">${L}</div></div>
              <div class="stat-card"><div class="stat-label">d</div><div class="stat-value">${d}</div></div>
              <div class="stat-card"><div class="stat-label">Период (i=0)</div><div class="stat-value">2π ≈ 6.3</div></div>
              <div class="stat-card"><div class="stat-label">Период (i=d-1)</div><div class="stat-value">2π·10000 ≈ 63k</div></div>
            `;
          }

          [cSeq, cDim].forEach(c => c.input.addEventListener('input', draw));
          setTimeout(() => { resize(); }, 50);
          window.addEventListener('resize', resize);
        },
      },
    ],

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
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Большие языковые модели (LLM).</b> GPT-4, Claude, Gemini, LLaMA, Mistral, Qwen — всё это decoder-only Transformer с авторегрессионной генерацией. Чат-боты, ассистенты, агенты, RAG-системы — любая работа с естественным языком строится поверх Transformer.</li>
        <li><b>Машинный перевод.</b> Google Translate, DeepL, Яндекс.Переводчик — encoder-decoder Transformer (T5, mBART, NLLB). Это первое применение оригинальной статьи «Attention is All You Need» в 2017-м.</li>
        <li><b>Понимание текста и NLP-пайплайны.</b> BERT, RoBERTa, DeBERTa — энкодеры для классификации, NER, QA, семантического поиска. Используются в модерации, антифроде, анализе тональности, извлечении сущностей из документов.</li>
        <li><b>Code generation и ассистенты для разработчиков.</b> GitHub Copilot, Cursor, Claude Code, Codex, StarCoder — Transformer, обученный на миллиардах строк кода. Автокомплит, рефакторинг, объяснение кода, генерация тестов.</li>
        <li><b>Vision Transformer для изображений.</b> ViT, Swin, DINOv2 — классификация, детекция, сегментация. На больших датасетах (JFT-300M+) обгоняют CNN и стали основой для Segment Anything, LLaVA, Flamingo.</li>
        <li><b>Распознавание речи (Whisper) и аудио.</b> OpenAI Whisper, AudioLM, MusicGen — Transformer на спектрограммах. Мультиязычное ASR, генерация музыки и речи.</li>
        <li><b>Мультимодальные модели.</b> CLIP, LLaVA, GPT-4V, Gemini — совместные эмбеддинги текста и изображений. Поиск картинок по описанию, Visual QA, OCR-on-steroids.</li>
        <li><b>Научные приложения.</b> AlphaFold 2/3 (структура белков), ESM (биоинформатика), GNoME (материалы). Transformer оказался удивительно хорош для любых данных со сложной структурой связей.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Отличная параллелизация.</b> В отличие от RNN, где шаг $t$ зависит от $t-1$, self-attention обрабатывает все позиции одновременно. Это позволило обучать модели на сотни миллиардов параметров на GPU-кластерах — без параллелизации LLM-эры просто не было бы.</p>
      <p><b>Длинные зависимости в один шаг.</b> <a class="glossary-link" onclick="App.selectTopic('glossary-attention')">Attention</a> связывает любые две позиции за одну операцию. LSTM на 1000 шагах теряет контекст начала; Transformer с контекстом 1M (Claude, Gemini) помнит всё. Это качественное, а не количественное преимущество.</p>
      <p><b>Масштабируемость со scaling laws.</b> Качество Transformer растёт предсказуемо с размером модели, данных и вычислений (Kaplan et al., Chinchilla). Это редкое свойство — ты знаешь заранее, что удвоение параметров улучшит loss. Именно это оправдывает миллиардные бюджеты на обучение.</p>
      <p><b>Transfer learning работает великолепно.</b> Pre-train на огромном корпусе → fine-tune на 1000 примеров твоей задачи. BERT, GPT, CLIP — это базовые модели, которые адаптируются под любую downstream-задачу. Радикально снизило порог входа в NLP.</p>
      <p><b>Универсальность архитектуры.</b> Один и тот же Transformer-блок работает для текста, кода, изображений, аудио, белков, временных рядов. Не надо проектировать специальную архитектуру под каждый тип данных — достаточно токенизировать вход.</p>
      <p><b>Interpretability через attention maps.</b> В отличие от LSTM, где скрытое состояние — чёрный ящик, в Transformer можно посмотреть, на какие токены модель обращала внимание при генерации каждого слова. Это не полное объяснение, но хотя бы диагностический инструмент.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>O(n²) память и время по длине входа.</b> Self-attention строит матрицу всех пар токенов — для контекста 100k это 10 млрд элементов. Приходится использовать Flash Attention, sliding window, sparse attention, recurrent memory — и всё равно длинный контекст остаётся дорогим. Transformer «из коробки» на книгу не посадить.</p>
      <p><b>Чудовищная жадность до данных.</b> Маленький Transformer на 1000 примерах переобучится моментально. Минимум для обучения с нуля — десятки миллионов токенов; для SOTA — триллионы. Без предобученного чекпоинта Transformer обычно проигрывает CNN/LSTM/бустингу.</p>
      <p><b>Дорогое обучение и инференс.</b> Обучение GPT-4 — сотни миллионов долларов, обучение LLaMA-3-70B — миллионы. Даже inference большой модели требует нескольких GPU. Для стартапа без бюджета единственный путь — API или open-source fine-tune.</p>
      <p><b>Нужны позиционные эмбеддинги.</b> Self-attention симметричен и сам по себе не знает, что «кот ест рыбу» отличается от «рыба ест кота». Порядок кодируется отдельно (RoPE, ALiBi, learnable positions), и неправильная схема ломает длинные контексты.</p>
      <p><b>Галлюцинации и отсутствие внутренней верификации.</b> LLM уверенно генерирует несуществующие факты, цитаты и ссылки. Это фундаментальное свойство авторегрессионной генерации — модель оптимизирует правдоподобие, а не истинность. Решается только внешними механизмами (RAG, tool use, верификатор).</p>
      <p><b>Плохая интерпретируемость на уровне логики.</b> Attention maps показывают «куда смотрела модель», но не «почему она пришла к такому выводу». Mechanistic interpretability — активная область, но далеко от production-решения.</p>

      <h3>🧭 Когда брать Transformer — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери Transformer когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Задача — NLP (классификация, генерация, QA, перевод) и есть предобученный чекпоинт</td>
          <td>У тебя меньше 1000 примеров и нет предобученной модели — возьми LR или SVM</td>
        </tr>
        <tr>
          <td>Есть GPU/бюджет и нужен SOTA-результат на тексте, коде, изображениях или речи</td>
          <td>Данные табличные — Gradient Boosting почти всегда побеждает</td>
        </tr>
        <tr>
          <td>Нужна one-shot/few-shot генерализация через prompting большой LLM</td>
          <td>Нужна streaming-обработка с низкой latency на one-sample-at-a-time</td>
        </tr>
        <tr>
          <td>Нужны длинные зависимости (книга, документ, код на тысячи токенов)</td>
          <td>Жёсткие ограничения по памяти/вычислениям (edge, микроконтроллер)</td>
        </tr>
        <tr>
          <td>Мультимодальная задача — текст + картинка, речь + текст</td>
          <td>Задача простая и линейная — LR справится за тысячную долю стоимости</td>
        </tr>
        <tr>
          <td>Transfer learning от BERT/GPT/ViT/Whisper даёт экономию на разметке</td>
          <td>Строгое требование интерпретируемости и воспроизводимости решений</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('rnn-lstm')">LSTM/GRU</a></b> — если задача стриминговая, данных мало, или требуется низкая latency и малый memory footprint.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('cnn')">CNN</a></b> — для изображений на маленьких и средних датасетах: меньше параметров, сильнее inductive bias, быстрее inference.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a></b> — на табличных данных. Transformer для таблиц почти никогда не побеждает XGBoost/LightGBM.</li>
        <li><b>Mamba / State Space Models</b> — свежая альтернатива с линейной сложностью по длине входа. Перспектива для очень длинных последовательностей.</li>
        <li><b>Retrieval-Augmented Generation (RAG)</b> — если нужен доступ к большой базе знаний: маленький Transformer + внешняя векторная БД часто лучше, чем «всё в контексте».</li>
      </ul>
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
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=wjZofJX0v4M" target="_blank">3Blue1Brown: Attention in transformers</a> — визуальная интуиция механизма внимания</li>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest: канал</a> — поиск по «transformer» и «attention» для пошагового разбора</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://arxiv.org/abs/1706.03762" target="_blank">Attention Is All You Need (Vaswani et al., 2017)</a> — оригинальная статья, представившая архитектуру Transformer</li>
        <li><a href="https://jalammar.github.io/illustrated-transformer/" target="_blank">Jay Alammar: The Illustrated Transformer</a> — лучшее визуальное объяснение трансформера</li>
        <li><a href="https://habr.com/ru/search/?q=%D1%82%D1%80%D0%B0%D0%BD%D1%81%D1%84%D0%BE%D1%80%D0%BC%D0%B5%D1%80%20attention%20%D0%BC%D0%B5%D1%85%D0%B0%D0%BD%D0%B8%D0%B7%D0%BC%20%D0%B2%D0%BD%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F" target="_blank">Habr: Трансформер</a> — разбор архитектуры с кодом на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://huggingface.co/docs/transformers/index" target="_blank">HuggingFace Transformers</a> — документация, туториалы и модели для быстрого старта</li>
      </ul>
    `,
  },
});
