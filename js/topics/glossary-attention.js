/* ==========================================================================
   Глоссарий: Attention (механизм внимания)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-attention',
  category: 'glossary',
  title: 'Attention (механизм внимания)',
  summary: 'Механизм, позволяющий модели «смотреть» на важные части входа — основа Transformer.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Когда ты читаешь предложение «Кот сидел на <b>коврике</b>, и <b>он</b> был пушистый» — чтобы понять, к кому относится «он», твой мозг <b>возвращается</b> к слову «кот». Ты мысленно фокусируешь внимание на релевантных словах.</p>
        <p><b>Attention</b> — это математическая версия этой идеи. Для каждого слова модель вычисляет «насколько внимательно смотреть» на каждое другое слово. Итоговое представление слова — это <b>взвешенная сумма</b> всех остальных, где веса = «внимание».</p>
      </div>

      <h3>🎯 Зачем нужен attention</h3>
      <p>До attention, в RNN информация из начала последовательности «утекала» к концу. К 50-му слову модель уже плохо помнила 1-е. Attention решает это радикально: <b>каждое слово имеет прямой доступ ко всем остальным</b>, независимо от расстояния.</p>

      <h3>📐 Формула Scaled Dot-Product Attention</h3>
      <div class="math-block">$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$$</div>
      <p>Три компонента:</p>
      <ul>
        <li><b>Query (Q)</b> — «что я ищу?» (вектор от текущего слова)</li>
        <li><b>Key (K)</b> — «что у меня есть?» (вектор от каждого слова, с которым мы сравниваем)</li>
        <li><b>Value (V)</b> — «что передать, если совпало?» (вектор с содержимым)</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Аналогия Q / K / V = поиск в библиотеке</div>
        <p>Ты приходишь в библиотеку: «Мне нужна книга про космос» — это <b>Query</b>.</p>
        <p>У каждой книги на полке есть карточка: «физика, планеты, звёзды» — это <b>Key</b>.</p>
        <p>Библиотекарь сравнивает твой Query с каждым Key и определяет релевантность. Чем больше совпадений — тем выше «вес» этой книги.</p>
        <p>А сам <b>текст книги</b>, который ты в итоге получишь — это <b>Value</b>.</p>
        <p>Итог: смесь текстов всех книг, взвешенная по релевантности.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Self-Attention: как слова «смотрят» друг на друга</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">«Кот сидел на коврике, он был пушистый» — на кого смотрит слово «он»?</text>

          <!-- Tokens -->
          <g font-size="12" font-weight="700">
            <rect x="50" y="200" width="70" height="30" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="85" y="220" text-anchor="middle" fill="#1e40af">Кот</text>
            <rect x="130" y="200" width="70" height="30" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="165" y="220" text-anchor="middle" fill="#1e40af">сидел</text>
            <rect x="210" y="200" width="55" height="30" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="237" y="220" text-anchor="middle" fill="#1e40af">на</text>
            <rect x="275" y="200" width="90" height="30" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="320" y="220" text-anchor="middle" fill="#1e40af">коврике</text>
            <rect x="375" y="200" width="55" height="30" rx="6" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
            <text x="402" y="220" text-anchor="middle" fill="#b45309">он</text>
            <rect x="440" y="200" width="55" height="30" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="467" y="220" text-anchor="middle" fill="#1e40af">был</text>
            <rect x="505" y="200" width="95" height="30" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
            <text x="552" y="220" text-anchor="middle" fill="#1e40af">пушистый</text>
          </g>

          <!-- Attention arrows from "он" to each token, thicker = higher attention -->
          <!-- "Кот" gets highest attention -->
          <path d="M402,200 C402,140 85,140 85,200" fill="none" stroke="#dc2626" stroke-width="4" opacity="0.85"/>
          <text x="200" y="135" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="700">0.62 (основная связь)</text>
          <!-- "сидел" lower -->
          <path d="M402,200 C402,160 165,160 165,200" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.7"/>
          <text x="280" y="158" text-anchor="middle" font-size="10" fill="#f59e0b">0.10</text>
          <!-- "на" even lower -->
          <path d="M402,200 C402,180 237,180 237,200" fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.5"/>
          <text x="305" y="180" text-anchor="middle" font-size="9" fill="#94a3b8">0.03</text>
          <!-- "коврике" significant -->
          <path d="M402,200 C402,170 320,170 320,200" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.75"/>
          <text x="355" y="168" text-anchor="middle" font-size="10" fill="#f59e0b">0.18</text>
          <!-- "он" to self -->
          <path d="M402,200 L402,175 L402,200" fill="none" stroke="#64748b" stroke-width="1.2" opacity="0.5"/>
          <!-- "был" -->
          <path d="M402,200 C402,180 467,180 467,200" fill="none" stroke="#94a3b8" stroke-width="1" opacity="0.5"/>
          <text x="445" y="180" text-anchor="middle" font-size="9" fill="#94a3b8">0.02</text>
          <!-- "пушистый" -->
          <path d="M402,200 C402,170 552,170 552,200" fill="none" stroke="#94a3b8" stroke-width="1.5" opacity="0.6"/>
          <text x="490" y="170" text-anchor="middle" font-size="10" fill="#94a3b8">0.05</text>

          <text x="402" y="265" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">Query</text>
          <text x="402" y="280" text-anchor="middle" font-size="10" fill="#64748b">«на кого я смотрю?»</text>

          <text x="380" y="310" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b">Модель правильно определяет: «он» = «Кот»</text>
          <text x="380" y="325" text-anchor="middle" font-size="10" fill="#64748b">Толщина стрелки = вес внимания (после softmax)</text>
        </svg>
        <div class="caption">Слово «он» вычисляет свой Query и сравнивает с Key каждого другого слова. Softmax превращает «совпадения» в веса (они в сумме = 1). Финальное представление «он» — взвешенная сумма V всех токенов. Высокий вес 0.62 на «Кот» означает: модель поняла антецедент местоимения.</div>
      </div>

      <h3>⚙️ Алгоритм за 4 шага</h3>
      <ol>
        <li><b>Вычисляем Q, K, V</b> для каждого токена через линейные проекции: $Q = xW^Q$, $K = xW^K$, $V = xW^V$.</li>
        <li><b>Scores</b>: $\\text{score}_{ij} = Q_i \\cdot K_j$ — насколько $i$-й токен «интересуется» $j$-м.</li>
        <li><b>Scaling + softmax</b>: $\\text{weights}_{ij} = \\text{softmax}(\\text{score}_{ij} / \\sqrt{d_k})$ — нормируем.</li>
        <li><b>Выход</b>: $\\text{out}_i = \\sum_j \\text{weights}_{ij} \\cdot V_j$ — взвешенная сумма V.</li>
      </ol>

      <div class="key-concept">
        <div class="kc-label">Зачем делить на √d_k?</div>
        <p>При большом $d_k$ скалярные произведения имеют большую дисперсию → softmax становится «почти one-hot», модель даёт всё внимание одному токену. Деление на $\\sqrt{d_k}$ возвращает дисперсию к единице и делает softmax «мягким».</p>
      </div>

      <h3>🧩 Виды attention</h3>
      <ul>
        <li><b>Self-attention</b> — Q, K, V из одной последовательности. Каждое слово смотрит на все остальные в этом же предложении. Базовый блок Transformer.</li>
        <li><b>Cross-attention</b> — Q из одной последовательности, K и V из другой. Используется в encoder-decoder моделях: decoder смотрит на encoder при переводе.</li>
        <li><b>Masked (causal) attention</b> — в decoder запрещено смотреть в будущее. Реализуется через маску, заменяющую скоры на $-\\infty$ перед softmax.</li>
        <li><b>Multi-head attention</b> — $h$ параллельных attention'ов с разными проекциями. Каждая «голова» учит свой паттерн (синтаксис, семантика, позиции).</li>
      </ul>

      <h3>💥 Революция attention в NLP</h3>
      <p>До 2017: RNN/LSTM доминировали в NLP. Paper «Attention is All You Need» (2017) показал: можно выбросить рекуррентность и оставить <b>только attention</b>. Результат — Transformer, который:</p>
      <ul>
        <li>Параллелится (нет зависимости от времени, как в RNN).</li>
        <li>Имеет прямой доступ к длинным зависимостям.</li>
        <li>Масштабируется до миллиардов параметров.</li>
      </ul>
      <p>Attention стал основой BERT, GPT, T5, LLaMA, Claude и практически всей современной NLP/LLM-индустрии.</p>

      <h3>⚠️ Ограничения</h3>
      <ul>
        <li><b>O(n²) сложность</b> по длине последовательности. Для 10k токенов — 100M операций.</li>
        <li><b>Не учитывает порядок</b> сам по себе — нужно добавлять positional encoding.</li>
        <li><b>Большое потребление памяти</b> при длинных контекстах.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('transformer')">Transformer</a> — главное применение attention</li>
        <li><a onclick="App.selectTopic('rnn-lstm')">RNN/LSTM</a> — что было до attention</li>
        <li><a onclick="App.selectTopic('glossary-sigmoid-softmax')">Softmax</a> — используется внутри attention</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://arxiv.org/abs/1706.03762" target="_blank">Attention Is All You Need (2017)</a></li>
        <li><a href="https://www.youtube.com/watch?v=wjZofJX0v4M" target="_blank">3Blue1Brown: Attention in transformers</a></li>
        <li><a href="https://jalammar.github.io/illustrated-transformer/" target="_blank">The Illustrated Transformer</a></li>
      </ul>
    `
  }
});
