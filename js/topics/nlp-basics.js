/* ==========================================================================
   NLP: от текста к числам
   ========================================================================== */
App.registerTopic({
  id: 'nlp-basics',
  category: 'dl',
  title: 'NLP: от текста к числам',
  summary: 'Bag-of-Words, TF-IDF, Word2Vec, <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">embeddings</a> — как превратить текст в признаки.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('intro-ml')">Что такое ML</a> ·
        <a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a> ·
        <a onclick="App.selectTopic('metrics')">Метрики</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Компьютер не умеет «читать» в человеческом смысле. Для него слово «кошка» — просто строка символов. Чтобы найти связи между словами, сравнивать тексты и делать предсказания, нужен <b>переводчик: от слов к числам</b>.</p>
        <p>Представь словарь как огромную систему координат. Каждое слово — точка в этом пространстве. Близкие по смыслу слова стоят рядом. Математические операции над словами становятся возможными: «король» − «мужчина» + «женщина» ≈ «королева».</p>
        <p>NLP — это именно этот мост. Начиная с простого подсчёта слов (Bag-of-Words) и заканчивая нейросетями, которые понимают контекст (BERT, GPT).</p>
      </div>

      <h3>🔧 Предобработка текста</h3>
      <p>Прежде чем превращать текст в числа, его нужно «почистить». Стандартный конвейер:</p>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-tokenization')">Токенизация</a>:</b> разбить текст на отдельные единицы (слова, подслова). «Я иду домой» → ['я', 'иду', 'домой'].</li>
        <li><b>Приведение к нижнему регистру:</b> «Кошка» и «кошка» — одно и то же слово. Всё в строчные.</li>
        <li><b>Удаление стоп-слов:</b> «и», «в», «на», «что» — встречаются везде, не несут смысла. Убираем.</li>
        <li><b>Стемминг:</b> обрезаем суффиксы до корня. «бегу», «бежишь», «бежал» → «беж». Грубо, но быстро.</li>
        <li><b>Лемматизация:</b> приводим к словарной форме. «бегу» → «бежать». Точнее, требует словаря.</li>
      </ul>
      <p>Чем чище текст, тем лучше признаки. Но иногда стоп-слова важны — например, в задачах определения стиля автора.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 190" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Конвейер NLP: от текста к модели</text>
          <!-- Box 1: raw text -->
          <rect x="10" y="35" width="90" height="42" rx="7" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="55" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">Текст</text>
          <text x="55" y="67" text-anchor="middle" font-size="9" fill="#64748b">«Кот сидит»</text>
          <!-- Arrow -->
          <line x1="100" y1="56" x2="120" y2="56" stroke="#64748b" stroke-width="1.5" marker-end="url(#nlp_arr)"/>
          <!-- Box 2: tokens -->
          <rect x="120" y="35" width="90" height="42" rx="7" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
          <text x="165" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#5b21b6">Токены</text>
          <text x="165" y="67" text-anchor="middle" font-size="9" fill="#5b21b6">['кот','сидит']</text>
          <!-- Arrow -->
          <line x1="210" y1="56" x2="230" y2="56" stroke="#64748b" stroke-width="1.5" marker-end="url(#nlp_arr)"/>
          <!-- Box 3: vectors -->
          <rect x="230" y="35" width="95" height="42" rx="7" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
          <text x="277" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#15803d">Векторы</text>
          <text x="277" y="67" text-anchor="middle" font-size="9" fill="#15803d">[0,1,0,2,...]</text>
          <!-- Arrow -->
          <line x1="325" y1="56" x2="345" y2="56" stroke="#64748b" stroke-width="1.5" marker-end="url(#nlp_arr)"/>
          <!-- Box 4: features -->
          <rect x="345" y="35" width="95" height="42" rx="7" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
          <text x="392" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Признаки</text>
          <text x="392" y="67" text-anchor="middle" font-size="9" fill="#92400e">TF-IDF / W2V</text>
          <!-- Arrow -->
          <line x1="440" y1="56" x2="460" y2="56" stroke="#64748b" stroke-width="1.5" marker-end="url(#nlp_arr)"/>
          <!-- Box 5: model -->
          <rect x="460" y="35" width="85" height="42" rx="7" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
          <text x="502" y="52" text-anchor="middle" font-size="10" font-weight="600" fill="#b91c1c">Модель</text>
          <text x="502" y="67" text-anchor="middle" font-size="9" fill="#b91c1c">predict()</text>
          <!-- Labels below -->
          <text x="55"  y="95" text-anchor="middle" font-size="9" fill="#64748b">raw</text>
          <text x="165" y="95" text-anchor="middle" font-size="9" fill="#64748b">preprocess</text>
          <text x="277" y="95" text-anchor="middle" font-size="9" fill="#64748b">BoW / TF-IDF</text>
          <text x="392" y="95" text-anchor="middle" font-size="9" fill="#64748b">embedding</text>
          <text x="502" y="95" text-anchor="middle" font-size="9" fill="#64748b">ML / DL</text>
          <!-- Methods row -->
          <text x="280" y="125" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Методы представления:</text>
          <rect x="30"  y="135" width="100" height="30" rx="5" fill="#ede9fe" stroke="#7c3aed" stroke-width="1"/>
          <text x="80"  y="155" text-anchor="middle" font-size="10" fill="#5b21b6">Bag-of-Words</text>
          <rect x="145" y="135" width="80"  height="30" rx="5" fill="#dcfce7" stroke="#16a34a" stroke-width="1"/>
          <text x="185" y="155" text-anchor="middle" font-size="10" fill="#15803d">TF-IDF</text>
          <rect x="240" y="135" width="90"  height="30" rx="5" fill="#fef9c3" stroke="#ca8a04" stroke-width="1"/>
          <text x="285" y="155" text-anchor="middle" font-size="10" fill="#92400e">Word2Vec</text>
          <rect x="345" y="135" width="80"  height="30" rx="5" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
          <text x="385" y="155" text-anchor="middle" font-size="10" fill="#b91c1c">FastText</text>
          <rect x="440" y="135" width="100" height="30" rx="5" fill="#f0f9ff" stroke="#0284c7" stroke-width="1"/>
          <text x="490" y="155" text-anchor="middle" font-size="10" fill="#0369a1">BERT / GPT</text>
          <defs>
            <marker id="nlp_arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">Конвейер NLP: сырой текст проходит предобработку, затем кодируется в числовые признаки одним из методов, и подаётся в модель.</div>
      </div>

      <h3>📦 Bag-of-Words (мешок слов)</h3>
      <p><span class="term" data-tip="Bag-of-Words. Представление текста как вектора подсчёта слов. Порядок слов теряется — важно только, сколько раз встречается каждое слово из словаря.">Bag-of-Words (BoW)</span> — самый простой способ: строим словарь всех уникальных слов, и каждый документ описываем вектором частот этих слов.</p>
      <p>Принцип прост: «не важно, в каком порядке стоят слова — важно, какие слова есть». Текст превращается в «мешок», где слова перемешаны, но посчитаны.</p>
      <p>Плюсы: прост, интерпретируем, работает для классификации спама. Минусы: теряет порядок и контекст, словарь может быть огромным.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея BoW</div>
        <p>Каждый документ становится вектором длиной |V| (размер словаря). Компонента $i$ = количество вхождений слова $w_i$ в документ. Тексты с похожим набором слов имеют похожие векторы.</p>
      </div>

      <h3>📊 <a class="glossary-link" onclick="App.selectTopic('glossary-tfidf')">TF-IDF</a>: взвешенный подсчёт</h3>
      <p>BoW даёт одинаковый вес частому слову «очень» и редкому специфичному слову «онтология». <span class="term" data-tip="TF-IDF (Term Frequency — Inverse Document Frequency). Взвешивание слова: высокое TF-IDF означает, что слово часто встречается в данном документе, но редко — в остальных.">TF-IDF</span> это исправляет.</p>

      <h4>Формула TF-IDF:</h4>
      <div class="math-block">$$\\text{TF}(t, d) = \\frac{\\text{count}(t, d)}{\\text{total words in } d}$$</div>
      <div class="math-block">$$\\text{IDF}(t) = \\log\\frac{N}{\\text{df}(t)}$$</div>
      <div class="math-block">$$\\text{TF-IDF}(t, d) = \\text{TF}(t, d) \\times \\text{IDF}(t)$$</div>
      <p>Слово, которое встречается в каждом документе (например, «и»), получает IDF ≈ 0 и высокий TF-IDF не наберёт. Редкое, но специфичное слово получает высокий IDF и «выделяется».</p>

      <h3>🧠 Word2Vec: слова как векторы</h3>
      <p><span class="term" data-tip="Word2Vec. Нейросетевой метод обучения плотных векторов для слов. Слова с похожим контекстом получают похожие векторы. Обучается на задаче предсказания соседних слов.">Word2Vec</span> (Mikolov, 2013) — революция в NLP. Идея: <b>«слово — это его контекст»</b>. Слова, которые встречаются рядом с похожими словами, получают похожие векторы.</p>
      <p>Вместо разреженного вектора длиной |V| (10 000–100 000) каждое слово кодируется <b>плотным вектором</b> из 100–300 чисел. И в этом пространстве работает алгебра:</p>
      <div class="math-block">$$\\vec{\\text{король}} - \\vec{\\text{мужчина}} + \\vec{\\text{женщина}} \\approx \\vec{\\text{королева}}$$</div>
      <p>Word2Vec обучается нейросетью с одним скрытым слоем. Два режима:</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg" style="max-width:640px;">
          <!-- CBOW -->
          <text x="150" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">CBOW</text>
          <text x="150" y="32" text-anchor="middle" font-size="10" fill="#64748b">контекст → слово</text>
          <rect x="20" y="45" width="80" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/><text x="60" y="63" text-anchor="middle" font-size="10" fill="#1e40af">кот</text>
          <rect x="20" y="80" width="80" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/><text x="60" y="98" text-anchor="middle" font-size="10" fill="#1e40af">сидел</text>
          <rect x="20" y="150" width="80" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/><text x="60" y="168" text-anchor="middle" font-size="10" fill="#1e40af">коврике</text>
          <line x1="100" y1="59" x2="130" y2="125" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="100" y1="94" x2="130" y2="125" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="100" y1="164" x2="130" y2="125" stroke="#3b82f6" stroke-width="1.5"/>
          <rect x="130" y="110" width="70" height="30" rx="6" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/><text x="165" y="129" text-anchor="middle" font-size="10" font-weight="600" fill="#15803d">скрытый</text>
          <line x1="200" y1="125" x2="230" y2="125" stroke="#16a34a" stroke-width="1.5"/>
          <rect x="230" y="110" width="60" height="30" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><text x="260" y="129" text-anchor="middle" font-size="11" font-weight="600" fill="#92400e">на</text>
          <text x="260" y="155" text-anchor="middle" font-size="9" fill="#64748b">предсказание</text>

          <!-- Skip-gram -->
          <text x="480" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">Skip-gram</text>
          <text x="480" y="32" text-anchor="middle" font-size="10" fill="#64748b">слово → контекст</text>
          <rect x="400" y="110" width="60" height="30" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2"/><text x="430" y="129" text-anchor="middle" font-size="11" font-weight="600" fill="#92400e">на</text>
          <line x1="460" y1="125" x2="490" y2="125" stroke="#16a34a" stroke-width="1.5"/>
          <rect x="490" y="110" width="70" height="30" rx="6" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/><text x="525" y="129" text-anchor="middle" font-size="10" font-weight="600" fill="#15803d">скрытый</text>
          <line x1="560" y1="125" x2="580" y2="59" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="560" y1="125" x2="580" y2="94" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="560" y1="125" x2="580" y2="164" stroke="#3b82f6" stroke-width="1.5"/>
          <rect x="580" y="45" width="50" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/><text x="605" y="63" text-anchor="middle" font-size="10" fill="#1e40af">кот</text>
          <rect x="580" y="80" width="50" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/><text x="605" y="98" text-anchor="middle" font-size="10" fill="#1e40af">сидел</text>
          <rect x="580" y="150" width="55" height="28" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="1"/><text x="607" y="168" text-anchor="middle" font-size="10" fill="#1e40af">коврике</text>
        </svg>
        <div class="caption"><b>CBOW</b>: по контекстным словам предсказываем центральное. <b>Skip-gram</b>: по центральному слову предсказываем контекст. Skip-gram лучше для редких слов, CBOW быстрее.</div>
      </div>

      <p><b>CBOW</b> усредняет векторы контекстных слов и предсказывает центральное — быстрый, хорош на частых словах. <b>Skip-gram</b> берёт центральное слово и предсказывает каждое контекстное по отдельности — медленнее, но лучше для редких слов и маленьких корпусов.</p>

      <h3>🌐 Современные <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">эмбеддинги</a>: BERT и GPT</h3>
      <p>Word2Vec даёт одинаковый вектор слову «банк» в предложениях «банк реки» и «банк выдал кредит». <b>Контекстуальные эмбеддинги</b> (BERT, GPT) это исправляют: вектор слова зависит от всего предложения.</p>

      <table>
        <tr><th></th><th>BERT (2018, Google)</th><th>GPT (2018 → 2023+, OpenAI)</th></tr>
        <tr><td><b>Архитектура</b></td><td>Encoder Transformer</td><td>Decoder Transformer</td></tr>
        <tr><td><b>Направление</b></td><td>Двунаправленный — видит слова слева <b>и</b> справа</td><td>Однонаправленный — видит только слова <b>слева</b></td></tr>
        <tr><td><b>Обучение</b></td><td>Маскируем 15% слов, модель их угадывает (MLM)</td><td>Предсказывает следующее слово (LM)</td></tr>
        <tr><td><b>Лучше для</b></td><td>Понимание: классификация, NER, QA</td><td>Генерация: тексты, код, чат, диалог</td></tr>
        <tr><td><b>Пример</b></td><td>«Кот [MASK] на коврике» → «сидел»</td><td>«Кот сидел на» → «коврике»</td></tr>
      </table>

      <div class="key-concept">
        <div class="kc-label">Практическое правило</div>
        <p>Для 80% NLP-задач достаточно <b>TF-IDF + линейная модель</b>. Переходи к BERT/GPT когда точности недостаточно, задача требует понимания контекста (QA, NER, перевод), или данных мало и нужен transfer learning.</p>
      </div>

      <h3>⚡ FastText: подслова и OOV</h3>
      <p><span class="term" data-tip="FastText (Facebook, 2016). Расширение Word2Vec: каждое слово раскладывается на n-граммы символов. Вектор слова = сумма векторов его n-грамм. Работает со словами вне словаря (OOV).">FastText</span> решает главный недостаток Word2Vec: слова вне словаря (OOV). Если модель не видела слово «непредсказуемость» — Word2Vec не знает что делать. FastText разбивает слово на символьные n-граммы («непред», «предск», ...) и строит вектор из них. Редкие и новые слова обрабатываются корректно.</p>

      <div class="deep-dive">
        <summary>Подробнее: BPE токенизация и подсловные модели</summary>
        <div class="deep-dive-body">
          <p><b><a class="glossary-link" onclick="App.selectTopic('glossary-tokenization')">Byte Pair Encoding (BPE)</a></b> — алгоритм токенизации, используемый в GPT, RoBERTa. Вместо слов токенами могут быть части слов («play», «##ing», «##ed»).</p>
          <p>Алгоритм: начинаем с символов, итеративно объединяем наиболее частые пары. «низкочастотный» → ['низко', '##часто', '##тный']. Это позволяет:</p>
          <ul>
            <li>Не иметь проблемы OOV — любое слово можно разложить на известные подслова</li>
            <li>Ограничить размер словаря (типично 30 000–50 000 токенов)</li>
            <li>Обрабатывать языки с богатой морфологией (русский, финский)</li>
          </ul>
          <p>WordPiece (BERT) похож на BPE, но выбирает пары по вероятностному критерию, а не просто по частоте.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: визуализация эмбеддингов (t-SNE, UMAP)</summary>
        <div class="deep-dive-body">
          <p>Векторы слов — 300-мерные объекты. Чтобы «увидеть» структуру, применяют методы снижения размерности:</p>
          <ul>
            <li><b>PCA:</b> линейное снижение. Быстро, но плохо сохраняет локальную структуру.</li>
            <li><b>t-SNE:</b> нелинейное. Похожие точки кластеризуются. Медленно на больших данных. Не сохраняет глобальные расстояния.</li>
            <li><b>UMAP:</b> быстрее t-SNE, лучше сохраняет глобальную структуру. Рекомендуется для больших корпусов.</li>
          </ul>
          <p>На визуализациях Word2Vec видны кластеры: страны рядом со странами, глаголы движения рядом с глаголами движения, числа образуют линию.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: когда что применять</summary>
        <div class="deep-dive-body">
          <table style="width:100%; font-size:13px; border-collapse:collapse;">
            <tr style="background:#f1f5f9;"><th style="padding:6px; text-align:left;">Метод</th><th style="padding:6px;">Размер вектора</th><th style="padding:6px;">Контекст</th><th style="padding:6px;">OOV</th><th style="padding:6px;">Когда использовать</th></tr>
            <tr><td style="padding:5px;"><b>BoW</b></td><td style="padding:5px; text-align:center;">|V| (разреж.)</td><td style="padding:5px; text-align:center;">нет</td><td style="padding:5px; text-align:center;">нет</td><td style="padding:5px;">простая классификация, маленький датасет</td></tr>
            <tr><td style="padding:5px;"><b>TF-IDF</b></td><td style="padding:5px; text-align:center;">|V| (разреж.)</td><td style="padding:5px; text-align:center;">нет</td><td style="padding:5px; text-align:center;">нет</td><td style="padding:5px;">поиск, классификация текстов</td></tr>
            <tr><td style="padding:5px;"><b>Word2Vec</b></td><td style="padding:5px; text-align:center;">100–300</td><td style="padding:5px; text-align:center;">окно</td><td style="padding:5px; text-align:center;">нет</td><td style="padding:5px;">семантика, аналогии, рекомендации</td></tr>
            <tr><td style="padding:5px;"><b>FastText</b></td><td style="padding:5px; text-align:center;">100–300</td><td style="padding:5px; text-align:center;">окно</td><td style="padding:5px; text-align:center;">да</td><td style="padding:5px;">морфологически богатые языки, OOV важно</td></tr>
            <tr><td style="padding:5px;"><b>BERT</b></td><td style="padding:5px; text-align:center;">768–1024</td><td style="padding:5px; text-align:center;">полный</td><td style="padding:5px; text-align:center;">да (BPE)</td><td style="padding:5px;">NER, QA, сложная классификация</td></tr>
          </table>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Логистическая регрессия</b> — классика NLP: TF-IDF + LogReg часто сильный baseline.</li>
        <li><b>Нейронные сети</b> — Word2Vec обучается нейросетью; BERT это большой трансформер.</li>
        <li><b>Снижение размерности (PCA, t-SNE)</b> — визуализация пространства эмбеддингов.</li>
        <li><b>Кластеризация (k-means)</b> — кластеризация документов по TF-IDF или эмбеддингам.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Bag-of-Words вручную',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По трём коротким предложениям построить словарь, матрицу счётчиков и понять структуру BoW.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>#</th><th>Документ</th></tr>
              <tr><td>d1</td><td>«кот сидит на крыше»</td></tr>
              <tr><td>d2</td><td>«кот пьёт молоко»</td></tr>
              <tr><td>d3</td><td>«собака сидит на полу»</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: токенизация и нижний регистр</h4>
            <div class="calc">
              d1: ['кот', 'сидит', 'на', 'крыше']<br>
              d2: ['кот', 'пьёт', 'молоко']<br>
              d3: ['собака', 'сидит', 'на', 'полу']
            </div>
            <div class="why">Разбиваем по пробелам, все буквы в нижний регистр. Пунктуацию убираем.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: строим словарь (vocabulary)</h4>
            <div class="calc">
              Все уникальные слова, отсортированные:<br>
              V = ['кот', 'крыше', 'молоко', 'на', 'пьёт', 'полу', 'сидит', 'собака']<br>
              |V| = 8 слов — длина каждого вектора документа
            </div>
            <div class="why">Словарь строится по всему корпусу. На практике |V| может быть 50 000–500 000 слов. Редкие слова (частота &lt; min_df) обычно отбрасываются.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: матрица счётчиков</h4>
            <div class="calc">
              ┌────────┬─────┬───────┬────────┬────┬──────┬──────┬────────┬────────┐<br>
              │        │ кот │крыше  │молоко  │ на │пьёт  │ полу │ сидит  │ собака │<br>
              ├────────┼─────┼───────┼────────┼────┼──────┼──────┼────────┼────────┤<br>
              │  d1    │  1  │   1   │   0    │ 1  │  0   │  0   │   1    │   0    │<br>
              │  d2    │  1  │   0   │   1    │ 0  │  1   │  0   │   0    │   0    │<br>
              │  d3    │  0  │   0   │   0    │ 1  │  0   │  1   │   1    │   1    │<br>
              └────────┴─────┴───────┴────────┴────┴──────┴──────┴────────┴────────┘
            </div>
            <div class="why">Каждая строка — документ как вектор. Компонента i = сколько раз слово i встречается в документе. Большинство значений — нули (разреженная матрица).</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: сходство документов</h4>
            <div class="calc">
              <a class="glossary-link" onclick="App.selectTopic('glossary-cosine-similarity')">Косинусное сходство</a> d1 и d3:<br>
              d1 = [1,1,0,1,0,0,1,0], d3 = [0,0,0,1,0,1,1,1]<br>
              d1·d3 = 0+0+0+1+0+0+1+0 = 2<br>
              |d1| = √(1+1+0+1+0+0+1+0) = √4 = 2.0<br>
              |d3| = √(0+0+0+1+0+1+1+1) = √4 = 2.0<br>
              cos(d1, d3) = 2 / (2.0 × 2.0) = 0.50<br><br>
              cos(d1, d2) = 1 / (2.0 × √3) ≈ 0.29
            </div>
            <div class="why">d1 и d3 похожи (оба про животных на горизонтальных поверхностях), d1 и d2 — меньше. BoW это уловил по одному слову «сидит» и предлогу «на».</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>BoW: словарь из 8 слов, каждый документ — вектор 8 чисел. Сходство d1↔d3 (0.50) выше, чем d1↔d2 (0.29). Минус: слово «на» получает такой же вес как «кот» — хотя «на» ничего не несёт. TF-IDF это исправит.</p>
          </div>
          <div class="lesson-box">
            BoW теряет порядок слов — «кот ест рыбу» и «рыба ест кота» дают одинаковый вектор! Для задач где порядок важен (анализ тональности, QA) используй n-граммы или embeddings.
          </div>
        `,
      },
      {
        title: 'TF-IDF: взвешиваем важность',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Для тех же 3 документов вычислить TF, IDF и TF-IDF. Показать, как частые слова получают меньший вес.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>#</th><th>Документ</th></tr>
              <tr><td>d1</td><td>«кот сидит на крыше»</td></tr>
              <tr><td>d2</td><td>«кот пьёт молоко»</td></tr>
              <tr><td>d3</td><td>«собака сидит на полу»</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: Term Frequency (TF)</h4>
            <div class="calc">
              TF(t, d) = count(t, d) / len(d)<br><br>
              TF("кот", d1) = 1/4 = 0.250<br>
              TF("на",  d1) = 1/4 = 0.250<br>
              TF("на",  d3) = 1/4 = 0.250<br>
              TF("кот", d2) = 1/3 = 0.333<br>
              TF("молоко", d2) = 1/3 = 0.333
            </div>
            <div class="why">TF показывает, насколько часто слово встречается внутри документа. «кот» и «на» имеют одинаковый TF в d1 — но «на» встречается в двух документах, а «кот» — тоже в двух. Смотри дальше на IDF.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: Inverse Document Frequency (IDF)</h4>
            <div class="calc">
              N = 3 документа<br>
              IDF(t) = log(N / df(t)), где df(t) = в скольких документах встречается t<br><br>
              "на":     df = 2 → IDF = log(3/2) = 0.405<br>
              "кот":    df = 2 → IDF = log(3/2) = 0.405<br>
              "сидит":  df = 2 → IDF = log(3/2) = 0.405<br>
              "крыше":  df = 1 → IDF = log(3/1) = 1.099<br>
              "молоко": df = 1 → IDF = log(3/1) = 1.099<br>
              "полу":   df = 1 → IDF = log(3/1) = 1.099<br>
              "пьёт":   df = 1 → IDF = log(3/1) = 1.099<br>
              "собака": df = 1 → IDF = log(3/1) = 1.099
            </div>
            <div class="why">Слова, встречающиеся в каждом документе, получили бы IDF = log(3/3) = 0. Уникальные слова получают высокий IDF — они характеризуют конкретный документ.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: TF-IDF = TF × IDF</h4>
            <div class="calc">
              Для документа d1 «кот сидит на крыше»:<br><br>
              TF-IDF("кот",   d1) = 0.250 × 0.405 = 0.101<br>
              TF-IDF("сидит", d1) = 0.250 × 0.405 = 0.101<br>
              TF-IDF("на",    d1) = 0.250 × 0.405 = 0.101<br>
              TF-IDF("крыше", d1) = 0.250 × 1.099 = <b>0.275</b>  ← выделяется!<br><br>
              Для документа d2 «кот пьёт молоко»:<br>
              TF-IDF("кот",    d2) = 0.333 × 0.405 = 0.135<br>
              TF-IDF("пьёт",   d2) = 0.333 × 1.099 = <b>0.366</b><br>
              TF-IDF("молоко", d2) = 0.333 × 1.099 = <b>0.366</b>
            </div>
            <div class="why">«крыше» получает самый высокий TF-IDF в d1 — это слово уникально для этого документа. «на» снижено — оно встречается в двух документах из трёх.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>TF-IDF повышает вес уникальных слов («крыше», «молоко», «полу») и снижает вес слов, встречающихся во многих документах («на», «сидит»). Это делает TF-IDF гораздо более информативным, чем просто BoW счётчики.</p>
          </div>
          <div class="lesson-box">
            В sklearn TfidfVectorizer по умолчанию использует сглаженную формулу IDF(t) = log((N+1)/(df+1)) + 1, чтобы IDF никогда не был 0. Также L2-нормализует вектора строк. Это чуть отличается от «учебной» формулы выше.
          </div>
        `,
      },
      {
        title: 'Word2Vec аналогии',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Понять векторную арифметику Word2Vec: как из предобученных векторов получить «королеву» сложением/вычитанием.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Слово</th><th>v1 (пол)</th><th>v2 (власть)</th><th>v3 (животное)</th><th>...</th></tr>
              <tr><td>король</td><td>+0.8</td><td>+0.9</td><td>–0.1</td><td>...</td></tr>
              <tr><td>королева</td><td>–0.7</td><td>+0.9</td><td>–0.1</td><td>...</td></tr>
              <tr><td>мужчина</td><td>+0.9</td><td>+0.0</td><td>–0.1</td><td>...</td></tr>
              <tr><td>женщина</td><td>–0.8</td><td>+0.0</td><td>–0.1</td><td>...</td></tr>
              <tr><td>собака</td><td>+0.0</td><td>–0.1</td><td>+0.9</td><td>...</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вектор «король − мужчина»</h4>
            <div class="calc">
              v(король)  = [+0.8, +0.9, −0.1, ...]<br>
              v(мужчина) = [+0.9, +0.0, −0.1, ...]<br><br>
              v(король) − v(мужчина) = [−0.1, +0.9, 0.0, ...]<br><br>
              Интерпретация: убрали «мужской пол» (+0.8−0.9=−0.1),<br>
              осталась «власть» (+0.9−0.0=+0.9)
            </div>
            <div class="why">Вычитание вектора «мужчина» убирает признак «мужской пол» из вектора «король». Остаётся что-то вроде «монарх без указания пола».</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: добавляем «женщина»</h4>
            <div class="calc">
              v(король) − v(мужчина) + v(женщина)<br>
              = [−0.1, +0.9, 0.0, ...] + [−0.8, +0.0, −0.1, ...]<br>
              = [−0.9, +0.9, −0.1, ...]<br><br>
              Теперь ищем ближайшее слово к вектору [−0.9, +0.9, −0.1, ...]
            </div>
            <div class="why">Прибавили «женский пол». Результат — вектор с признаками: женский пол (−0.9) + власть (+0.9) + не животное (−0.1).</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: cosine similarity с кандидатами</h4>
            <div class="calc">
              Целевой вектор: [−0.9, +0.9, −0.1]<br><br>
              cos с "королева" = [−0.7, +0.9, −0.1]:<br>
              числитель = (−0.9×−0.7)+(0.9×0.9)+(−0.1×−0.1)<br>
                        = 0.63 + 0.81 + 0.01 = 1.45<br>
              |цель| = √(0.81+0.81+0.01) ≈ 1.275<br>
              |королева| ≈ 1.136<br>
              cos ≈ 1.45 / (1.275 × 1.136) ≈ <b>1.00</b> ← максимум!<br><br>
              cos с "мужчина" ≈ −0.52 ← далеко<br>
              cos с "собака"  ≈ −0.07 ← далеко
            </div>
            <div class="why">Вектор «королевы» — ближайший к результату арифметики. Это работает, потому что Word2Vec кодирует семантические отношения линейно в пространстве эмбеддингов.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>король − мужчина + женщина ≈ королева. Аналогия работает потому, что отношение «король→мужчина» описывается тем же вектором-смещением, что «королева→женщина». Другие примеры: Париж − Франция + Германия ≈ Берлин; программист − мужчина + женщина ≈ программистка.</p>
          </div>
          <div class="lesson-box">
            На практике аналогии работают не идеально — косинусное сходство даёт правильный ответ в ~75% случаев на бенчмарке Google. Качество зависит от размера корпуса и размерности векторов.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: BoW и TF-IDF</h3>
        <p>Выбери набор предложений. Включай и выключай стоп-слова. Смотри на BoW и TF-IDF <a class="glossary-link" onclick="App.selectTopic('viz-histogram')">гистограммы</a>.</p>
        <div class="sim-container">
          <div class="sim-controls" id="nlp-controls"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="nlp-bow-chart" style="max-height:240px;"></canvas></div>
            <div class="sim-chart-wrap" style="margin-top:14px;"><canvas id="nlp-tfidf-chart" style="max-height:240px;"></canvas></div>
            <div class="sim-stats" id="nlp-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const CORPORA = [
          {
            label: 'Животные и действия',
            docs: [
              'кот сидит на крыше и смотрит вниз',
              'кот пьёт молоко и мурлычет громко',
              'собака сидит на полу и виляет хвостом',
            ],
          },
          {
            label: 'Машинное обучение',
            docs: [
              'модель обучается на данных и делает предсказания',
              'нейронная сеть обучается на большом количестве данных',
              'дерево решений делает предсказания по правилам',
            ],
          },
          {
            label: 'Погода и природа',
            docs: [
              'сегодня светит солнце и дует тёплый ветер',
              'завтра будет дождь и облачная погода',
              'весной расцветают цветы и поют птицы',
            ],
          },
        ];

        const STOPWORDS = new Set(['и', 'на', 'в', 'по', 'что', 'это', 'а', 'но', 'да', 'не', 'к', 'с', 'из', 'о']);

        const controls = container.querySelector('#nlp-controls');

        const cCorpus = App.makeControl('select', 'nlp-corpus', 'Набор предложений', {
          options: CORPORA.map((c, i) => ({ value: i, label: c.label })),
        });
        const cStopwords = App.makeControl('checkbox', 'nlp-sw', 'Удалять стоп-слова', { value: true });
        const cMinDf = App.makeControl('range', 'nlp-mindf', 'min_df (мин. документов)', { min: 1, max: 3, step: 1, value: 1 });
        [cCorpus, cStopwords, cMinDf].forEach(c => controls.appendChild(c.wrap));

        let bowChart = null, tfidfChart = null;

        function tokenize(text, removeStop) {
          let tokens = text.toLowerCase().replace(/[^а-яёa-z\s]/g, '').split(/\s+/).filter(Boolean);
          if (removeStop) tokens = tokens.filter(t => !STOPWORDS.has(t));
          return tokens;
        }

        function update() {
          const idx = parseInt(cCorpus.input.value, 10);
          const removeStop = cStopwords.input.checked;
          const minDf = parseInt(cMinDf.input.value, 10);
          const docs = CORPORA[idx].docs;

          const tokenized = docs.map(d => tokenize(d, removeStop));

          // Build vocabulary with min_df
          const dfMap = {};
          tokenized.forEach(tokens => {
            const unique = [...new Set(tokens)];
            unique.forEach(t => { dfMap[t] = (dfMap[t] || 0) + 1; });
          });
          const vocab = Object.keys(dfMap).filter(t => dfMap[t] >= minDf).sort();

          if (vocab.length === 0) {
            container.querySelector('#nlp-stats').innerHTML = '<p style="color:#ef4444;">Пустой словарь при текущих настройках.</p>';
            return;
          }

          // BoW matrix
          const bow = tokenized.map(tokens => {
            const vec = {};
            tokens.forEach(t => { if (vocab.includes(t)) vec[t] = (vec[t] || 0) + 1; });
            return vocab.map(w => vec[w] || 0);
          });

          // TF-IDF
          const N = docs.length;
          const idf = vocab.map(w => Math.log((N + 1) / (dfMap[w] + 1)) + 1);
          const tfidf = bow.map((row, di) => {
            const len = tokenized[di].filter(t => vocab.includes(t)).length || 1;
            return row.map((cnt, wi) => (cnt / len) * idf[wi]);
          });

          const colors = ['rgba(99,102,241,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)'];
          const borderColors = ['rgba(99,102,241,1)', 'rgba(16,185,129,1)', 'rgba(245,158,11,1)'];

          const ctxBow = container.querySelector('#nlp-bow-chart').getContext('2d');
          if (bowChart) bowChart.destroy();
          bowChart = new Chart(ctxBow, {
            type: 'bar',
            data: {
              labels: vocab,
              datasets: docs.map((d, i) => ({
                label: `d${i + 1}`,
                data: bow[i],
                backgroundColor: colors[i],
                borderColor: borderColors[i],
                borderWidth: 1,
              })),
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Bag-of-Words: счётчики слов' }, legend: { position: 'top' } },
              scales: { x: { ticks: { maxRotation: 45 } }, y: { beginAtZero: true, title: { display: true, text: 'count' } } },
            },
          });
          App.registerChart(bowChart);

          const ctxTf = container.querySelector('#nlp-tfidf-chart').getContext('2d');
          if (tfidfChart) tfidfChart.destroy();
          tfidfChart = new Chart(ctxTf, {
            type: 'bar',
            data: {
              labels: vocab,
              datasets: docs.map((d, i) => ({
                label: `d${i + 1}`,
                data: tfidf[i].map(v => Math.round(v * 1000) / 1000),
                backgroundColor: colors[i],
                borderColor: borderColors[i],
                borderWidth: 1,
              })),
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'TF-IDF: взвешенные признаки' }, legend: { position: 'top' } },
              scales: { x: { ticks: { maxRotation: 45 } }, y: { beginAtZero: true, title: { display: true, text: 'TF-IDF' } } },
            },
          });
          App.registerChart(tfidfChart);

          container.querySelector('#nlp-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Размер словаря</div><div class="stat-value">${vocab.length}</div></div>
            <div class="stat-card"><div class="stat-label">Документов</div><div class="stat-value">${N}</div></div>
            <div class="stat-card"><div class="stat-label">Стоп-слова</div><div class="stat-value">${removeStop ? 'убраны' : 'оставлены'}</div></div>
          `;
        }

        [cCorpus, cStopwords, cMinDf].forEach(c => c.input.addEventListener('change', update));
        update();
      },
    },

    python: `
      <h3>Python: NLP от BoW до BERT</h3>
      <p>sklearn для классических методов, gensim для Word2Vec, HuggingFace Transformers для современных эмбеддингов.</p>

      <h4>1. CountVectorizer и TfidfVectorizer (sklearn)</h4>
      <pre><code>import numpy as np
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Пример: классификация тональности отзывов
texts = [
    "отличный товар, очень доволен покупкой",
    "ужасное качество, деньги на ветер",
    "хороший продукт, рекомендую всем",
    "плохой сервис, больше не куплю",
    "прекрасная вещь, быстрая доставка",
    "полная дрянь, не покупайте",
]
labels = [1, 0, 1, 0, 1, 0]  # 1 = позитив, 0 = негатив

# 1. Bag-of-Words
bow = CountVectorizer(
    min_df=1,           # минимум вхождений в N документах
    max_features=1000,  # топ-1000 слов
    ngram_range=(1, 2), # унограммы + биграммы
    stop_words=None,    # для русского нет встроенного списка
)
X_bow = bow.fit_transform(texts)
print(f"Размер матрицы BoW: {X_bow.shape}")
print(f"Пример признаков: {bow.get_feature_names_out()[:10]}")

# 2. TF-IDF
tfidf = TfidfVectorizer(
    min_df=1,
    max_features=1000,
    ngram_range=(1, 2),
    sublinear_tf=True,  # использовать log(TF) — помогает при высоких частотах
)
X_tfidf = tfidf.fit_transform(texts)

# 3. Классификация
X_tr, X_te, y_tr, y_te = train_test_split(X_tfidf, labels, test_size=0.33, random_state=42)
clf = LogisticRegression(max_iter=200)
clf.fit(X_tr, y_tr)
print(classification_report(y_te, clf.predict(X_te)))

# Важные слова (по весу коэффициентов)
feature_names = tfidf.get_feature_names_out()
coefs = clf.coef_[0]
top_pos = np.argsort(coefs)[-5:][::-1]
top_neg = np.argsort(coefs)[:5]
print("Позитивные признаки:", [feature_names[i] for i in top_pos])
print("Негативные признаки:", [feature_names[i] for i in top_neg])</code></pre>

      <h4>2. Word2Vec через gensim</h4>
      <pre><code>from gensim.models import Word2Vec
import re

# Подготовка корпуса
corpus_raw = [
    "кот сидит на крыше и смотрит вниз",
    "собака бегает по двору и лает громко",
    "кот и собака — домашние животные",
    "питомцы живут рядом с людьми в домах",
]

def preprocess(text):
    tokens = re.sub(r'[^а-яёa-z\s]', '', text.lower()).split()
    return tokens

corpus = [preprocess(doc) for doc in corpus_raw]

# Обучение Word2Vec
model = Word2Vec(
    sentences=corpus,
    vector_size=50,    # размерность эмбеддинга
    window=3,          # размер контекстного окна
    min_count=1,       # минимальная частота слова
    workers=4,
    sg=1,              # 1 = Skip-gram, 0 = CBOW
    epochs=100,
)

# Использование
print("Вектор 'кот':", model.wv['кот'][:5], "...")
print("Похожие на 'кот':", model.wv.most_similar('кот', topn=3))

# Аналогии: кот - животное + питомец ≈ ?
try:
    result = model.wv.most_similar(positive=['кот', 'питомец'],
                                   negative=['животное'], topn=3)
    print("кот - животное + питомец ≈", result)
except KeyError as e:
    print(f"Слово не в словаре: {e}")

# Сохранение и загрузка
model.save("word2vec_model.bin")
loaded = Word2Vec.load("word2vec_model.bin")

# Предобученные модели (для русского)
# pip install navec
# from navec import Navec
# navec = Navec.load('navec_hudlit_v1_12B_500K_300d_100q.tar')
# navec['кот']  # -> numpy array 300d</code></pre>

      <h4>3. HuggingFace: токенизация и BERT-эмбеддинги</h4>
      <pre><code>from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np

# Предобученная русскоязычная модель
model_name = "cointegrated/rubert-tiny2"  # маленькая и быстрая
tokenizer = AutoTokenizer.from_pretrained(model_name)
bert_model = AutoModel.from_pretrained(model_name)

def get_embedding(text):
    """Получить sentence embedding через усреднение токен-векторов."""
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        max_length=512,
        padding=True,
    )
    with torch.no_grad():
        outputs = bert_model(**inputs)
    # CLS токен как sentence embedding
    cls_embedding = outputs.last_hidden_state[:, 0, :].squeeze().numpy()
    return cls_embedding

sentences = [
    "кот мурлычет на солнце",
    "собака лает во дворе",
    "питомец греется у камина",
]

embeddings = np.array([get_embedding(s) for s in sentences])
print(f"Размер эмбеддинга: {embeddings.shape}")  # (3, 312)

# Косинусное сходство
from sklearn.metrics.pairwise import cosine_similarity
sim_matrix = cosine_similarity(embeddings)
print("Матрица сходства:")
for i, s in enumerate(sentences):
    for j, s2 in enumerate(sentences):
        if j > i:
            print(f"  '{s[:20]}...' ~ '{s2[:20]}...': {sim_matrix[i,j]:.3f}")</code></pre>

      <h4>4. Pipeline: TF-IDF + классификация на реальном датасете</h4>
      <pre><code>from sklearn.datasets import fetch_20newsgroups
from sklearn.pipeline import Pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.model_selection import cross_val_score

# 20 Newsgroups — классический датасет NLP
categories = ['sci.med', 'sci.space', 'rec.sport.hockey', 'talk.politics.guns']
train = fetch_20newsgroups(subset='train', categories=categories, remove=('headers', 'footers', 'quotes'))
test  = fetch_20newsgroups(subset='test',  categories=categories, remove=('headers', 'footers', 'quotes'))

pipelines = {
    'TF-IDF + NaiveBayes': Pipeline([
        ('tfidf', TfidfVectorizer(max_features=10000, ngram_range=(1, 2), sublinear_tf=True)),
        ('clf',   MultinomialNB(alpha=0.1)),
    ]),
    'TF-IDF + LinearSVC': Pipeline([
        ('tfidf', TfidfVectorizer(max_features=10000, ngram_range=(1, 2), sublinear_tf=True)),
        ('clf',   LinearSVC(C=1.0, max_iter=2000)),
    ]),
}

for name, pipe in pipelines.items():
    pipe.fit(train.data, train.target)
    acc = pipe.score(test.data, test.target)
    print(f"{name}: accuracy = {acc:.4f}")</code></pre>
    `,

    applications: `
      <h3>Где применяются базовые NLP-методы</h3>
      <table>
        <tr><th>Задача</th><th>Подход</th></tr>
        <tr><td><b>Классификация текста</b></td><td>Спам, тональность, категоризация статей → TF-IDF + LinearSVC</td></tr>
        <tr><td><b>Поиск похожих документов</b></td><td>TF-IDF + cosine similarity (для тысяч документов)</td></tr>
        <tr><td><b>Рекомендации контента</b></td><td>Content-based: статьи/фильмы по эмбеддингам описаний</td></tr>
        <tr><td><b>Named Entity Recognition</b></td><td>Извлечение имён, мест, организаций → BERT fine-tune</td></tr>
        <tr><td><b>Автоматический перевод</b></td><td>seq2seq Transformer (Google Translate, DeepL)</td></tr>
        <tr><td><b>Чат-боты</b></td><td>Intent classification + slot filling на базе эмбеддингов</td></tr>
        <tr><td><b>Модерация контента</b></td><td>Классификация токсичности, спама, фейков</td></tr>
        <tr><td><b>Суммаризация</b></td><td>Extractive (TextRank) или abstractive (Transformer)</td></tr>
      </table>
        `,

    proscons: `
      <h3>BoW vs TF-IDF vs Word2Vec vs BERT</h3>
      <div class="example-data-table">
        <table>
          <tr><th>Критерий</th><th>Bag-of-Words</th><th>TF-IDF</th><th>Word2Vec</th><th>BERT</th></tr>
          <tr><td>Размер вектора</td><td>|V| разреж.</td><td>|V| разреж.</td><td>100–300 плотн.</td><td>768–1024 плотн.</td></tr>
          <tr><td>Порядок слов</td><td>Нет</td><td>Нет</td><td>Частично (окно)</td><td>Да (полный)</td></tr>
          <tr><td>Контекст слова</td><td>Нет</td><td>Нет</td><td>Статичный</td><td>Динамичный</td></tr>
          <tr><td>Семантика</td><td>Нет</td><td>Слабая</td><td>Хорошая</td><td>Отличная</td></tr>
          <tr><td>OOV слова</td><td>Нет</td><td>Нет</td><td>Нет (FastText — да)</td><td>Да (BPE)</td></tr>
          <tr><td>Скорость обуч.</td><td>Мгновенно</td><td>Мгновенно</td><td>Минуты–часы</td><td>Часы–дни (GPU)</td></tr>
          <tr><td>Inference</td><td>Мгновенно</td><td>Мгновенно</td><td>Быстро</td><td>Медленно (CPU)</td></tr>
          <tr><td>Интерпрет.</td><td>Отличная</td><td>Хорошая</td><td>Средняя</td><td>Плохая</td></tr>
          <tr><td>Нужны данные</td><td>Мало</td><td>Мало</td><td>Много (100M+)</td><td>Предобученный</td></tr>
          <tr><td>Языки</td><td>Любой</td><td>Любой</td><td>Нужен корпус</td><td>Нужна модель</td></tr>
        </table>
      </div>

      <div class="proscons" style="margin-top:20px;">
        <div class="pros">
          <h4>✓ Когда использовать TF-IDF</h4>
          <ul>
            <li>Классификация текстов с ограниченным датасетом (< 10 000 примеров)</li>
            <li>Информационный поиск — TF-IDF лежит в основе поисковых систем</li>
            <li>Быстрый baseline — всегда начинай с TF-IDF + LogReg/LinearSVC</li>
            <li>Нет GPU, нужна интерпретируемость</li>
            <li>Длинные документы (TF-IDF работает лучше эмбеддингов на длинных текстах)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✓ Когда использовать embeddings (BERT)</h4>
          <ul>
            <li>Семантический поиск — похожие по смыслу, но разные по словам</li>
            <li>NER, POS-tagging, вопросно-ответные системы</li>
            <li>Многоязычные задачи (multilingual-BERT, LaBSE)</li>
            <li>Когда TF-IDF baseline недостаточен и есть ресурсы</li>
            <li>Transfer learning: fine-tune BERT на малом датасете</li>
          </ul>
        </div>
      </div>

      <h3>⚠️ Типичные ошибки в NLP</h3>
      <ul>
        <li><b>Утечка данных:</b> CountVectorizer.fit() нужно вызывать только на train, а transform() — и на train, и на test.</li>
        <li><b>Не учитывать длину документа:</b> длинный документ всегда даст большие BoW значения. Используй TF вместо count или normalize=True.</li>
        <li><b>Игнорировать OOV:</b> на продакшне появятся слова, которых не было в обучении. Пробуй FastText или char n-grams.</li>
        <li><b>Сразу бросаться на BERT:</b> 80% NLP задач решаются TF-IDF + LinearSVC с хорошей точностью, за секунды, без GPU.</li>
        <li><b>Не удалять HTML/спецсимволы:</b> парсить тексты с web нужно перед векторизацией.</li>
      </ul>
    `,
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest: канал</a> — поиск по «word2vec» и «NLP» для основ векторных представлений</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=NLP%20%D0%BE%D0%B1%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0%20TF-IDF%20Word2Vec" target="_blank">Habr: NLP — с чего начать</a> — обзор методов от BoW до BERT с практическими примерами</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html" target="_blank">sklearn TfidfVectorizer</a> — документация с параметрами и примерами</li>
        <li><a href="https://radimrehurek.com/gensim/models/word2vec.html" target="_blank">Gensim Word2Vec</a> — документация по обучению и использованию Word2Vec</li>
        <li><a href="https://huggingface.co/docs/transformers/index" target="_blank">HuggingFace Transformers</a> — документация библиотеки для работы с BERT и современными LLM</li>
      </ul>
    `,
  },
});
