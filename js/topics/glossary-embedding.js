/* ==========================================================================
   Глоссарий: Embedding (Векторное представление)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-embedding',
  category: 'glossary',
  title: 'Embedding (векторное представление)',
  summary: 'Плотный векторный код для дискретных объектов: слов, категорий, пользователей, товаров.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты пытаешься описать человека одним номером: «#42». Это номер из списка, никакой информации. А теперь опиши его вектором из 300 чисел: [рост, вес, возраст, любимая еда (закодированная), уровень образования, склонность к авантюрам, ...]. Теперь по двум векторам можно сказать, <b>похожи ли люди</b>: если их векторы близки — у них похожие свойства.</p>
        <p>Embedding делает то же самое для <b>дискретных объектов</b>: вместо безликого ID присваивает каждому объекту вектор из 50-500 чисел, где близкие вектора означают похожие объекты.</p>
      </div>

      <h3>🎯 Что такое embedding</h3>
      <p><b>Embedding</b> — отображение дискретных сущностей (слов, категорий, товаров, пользователей) в <b>непрерывное векторное пространство</b> малой размерности (обычно 50–1024), где геометрическое расстояние отражает семантическую близость.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">One-hot vs Embedding</text>
          <!-- Left: One-hot -->
          <g>
            <text x="180" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">One-hot encoding</text>
            <text x="180" y="78" text-anchor="middle" font-size="10" fill="#64748b">Вектор длины = размер словаря</text>
            <!-- Table of one-hot vectors -->
            <g font-size="11">
              <text x="70" y="110" font-weight="600" fill="#475569">"кот"</text>
              <rect x="110" y="98" width="20" height="16" fill="#dc2626"/>
              <text x="120" y="110" text-anchor="middle" fill="white" font-weight="700">1</text>
              <rect x="130" y="98" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="140" y="110" text-anchor="middle">0</text>
              <rect x="150" y="98" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="160" y="110" text-anchor="middle">0</text>
              <rect x="170" y="98" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="180" y="110" text-anchor="middle">0</text>
              <text x="198" y="110" fill="#64748b">. . .</text>
              <rect x="220" y="98" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="230" y="110" text-anchor="middle">0</text>
              <text x="255" y="110" fill="#64748b">(10000 dim)</text>

              <text x="70" y="140" font-weight="600" fill="#475569">"пёс"</text>
              <rect x="110" y="128" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="120" y="140" text-anchor="middle">0</text>
              <rect x="130" y="128" width="20" height="16" fill="#dc2626"/>
              <text x="140" y="140" text-anchor="middle" fill="white" font-weight="700">1</text>
              <rect x="150" y="128" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="160" y="140" text-anchor="middle">0</text>
              <rect x="170" y="128" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="180" y="140" text-anchor="middle">0</text>
              <text x="198" y="140" fill="#64748b">. . .</text>

              <text x="70" y="170" font-weight="600" fill="#475569">"машина"</text>
              <rect x="110" y="158" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="120" y="170" text-anchor="middle">0</text>
              <rect x="130" y="158" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="140" y="170" text-anchor="middle">0</text>
              <rect x="150" y="158" width="20" height="16" fill="#dc2626"/>
              <text x="160" y="170" text-anchor="middle" fill="white" font-weight="700">1</text>
              <rect x="170" y="158" width="20" height="16" fill="#fff" stroke="#cbd5e1"/>
              <text x="180" y="170" text-anchor="middle">0</text>
              <text x="198" y="170" fill="#64748b">. . .</text>
            </g>
            <text x="180" y="215" text-anchor="middle" font-size="10" fill="#dc2626">• Огромная размерность</text>
            <text x="180" y="232" text-anchor="middle" font-size="10" fill="#dc2626">• Все слова «одинаково далеки»</text>
            <text x="180" y="249" text-anchor="middle" font-size="10" fill="#dc2626">• Нет семантики</text>
          </g>
          <!-- Right: Embedding -->
          <g>
            <text x="560" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#059669">Embedding</text>
            <text x="560" y="78" text-anchor="middle" font-size="10" fill="#64748b">Плотный вектор (dim ~ 100-300)</text>
            <!-- Vectors as colored cells -->
            <g font-size="11">
              <text x="440" y="110" font-weight="600" fill="#475569">"кот"</text>
              <rect x="470" y="98" width="22" height="16" fill="#60a5fa"/>
              <text x="481" y="110" text-anchor="middle" fill="white" font-size="9">0.82</text>
              <rect x="492" y="98" width="22" height="16" fill="#fbbf24"/>
              <text x="503" y="110" text-anchor="middle" fill="white" font-size="9">-0.3</text>
              <rect x="514" y="98" width="22" height="16" fill="#34d399"/>
              <text x="525" y="110" text-anchor="middle" fill="white" font-size="9">0.51</text>
              <rect x="536" y="98" width="22" height="16" fill="#f87171"/>
              <text x="547" y="110" text-anchor="middle" fill="white" font-size="9">0.12</text>
              <rect x="558" y="98" width="22" height="16" fill="#a78bfa"/>
              <text x="569" y="110" text-anchor="middle" fill="white" font-size="9">0.88</text>
              <text x="590" y="110" fill="#64748b">. . .</text>

              <text x="440" y="140" font-weight="600" fill="#475569">"пёс"</text>
              <rect x="470" y="128" width="22" height="16" fill="#60a5fa"/>
              <text x="481" y="140" text-anchor="middle" fill="white" font-size="9">0.78</text>
              <rect x="492" y="128" width="22" height="16" fill="#fbbf24"/>
              <text x="503" y="140" text-anchor="middle" fill="white" font-size="9">-0.1</text>
              <rect x="514" y="128" width="22" height="16" fill="#34d399"/>
              <text x="525" y="140" text-anchor="middle" fill="white" font-size="9">0.45</text>
              <rect x="536" y="128" width="22" height="16" fill="#f87171"/>
              <text x="547" y="140" text-anchor="middle" fill="white" font-size="9">0.18</text>
              <rect x="558" y="128" width="22" height="16" fill="#a78bfa"/>
              <text x="569" y="140" text-anchor="middle" fill="white" font-size="9">0.91</text>
              <text x="590" y="140" fill="#64748b">. . .</text>

              <text x="440" y="170" font-weight="600" fill="#475569">"машина"</text>
              <rect x="470" y="158" width="22" height="16" fill="#c084fc"/>
              <text x="481" y="170" text-anchor="middle" fill="white" font-size="9">-0.4</text>
              <rect x="492" y="158" width="22" height="16" fill="#fb923c"/>
              <text x="503" y="170" text-anchor="middle" fill="white" font-size="9">0.65</text>
              <rect x="514" y="158" width="22" height="16" fill="#e879f9"/>
              <text x="525" y="170" text-anchor="middle" fill="white" font-size="9">-0.2</text>
              <rect x="536" y="158" width="22" height="16" fill="#4ade80"/>
              <text x="547" y="170" text-anchor="middle" fill="white" font-size="9">0.71</text>
              <rect x="558" y="158" width="22" height="16" fill="#facc15"/>
              <text x="569" y="170" text-anchor="middle" fill="white" font-size="9">0.03</text>
              <text x="590" y="170" fill="#64748b">. . .</text>
            </g>
            <text x="560" y="215" text-anchor="middle" font-size="10" fill="#059669">• Компактно (100-300 чисел)</text>
            <text x="560" y="232" text-anchor="middle" font-size="10" fill="#059669">• «Кот» и «пёс» близки (оба животные)</text>
            <text x="560" y="249" text-anchor="middle" font-size="10" fill="#059669">• «Машина» далеко от них</text>
          </g>
          <!-- Arrow -->
          <path d="M290,160 L420,160" stroke="#475569" stroke-width="2" fill="none" marker-end="url(#emb-arr)"/>
          <text x="355" y="150" text-anchor="middle" font-size="11" fill="#475569" font-weight="600">выучивается</text>
          <text x="355" y="175" text-anchor="middle" font-size="10" fill="#64748b">из данных</text>
          <defs>
            <marker id="emb-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#475569"/>
            </marker>
          </defs>
          <text x="380" y="295" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">В пространстве embedding: близкие вектора = похожие объекты</text>
        </svg>
        <div class="caption">One-hot и embedding — два способа кодировать дискретные сущности. One-hot прост, но лишён семантики. Embedding учится на данных и кодирует смысл через геометрию вектора.</div>
      </div>

      <h3>🔑 Откуда берутся embedding'и</h3>
      <ol>
        <li><b>Обучаются вместе с моделью</b> — как параметры. Например, в нейросети для рекомендаций слой <code>Embedding(num_users, 50)</code> — это матрица $U \\times 50$, которая обучается.</li>
        <li><b>Pretrained</b> — обучены на больших корпусах и скачиваются (Word2Vec, GloVe, BERT, CLIP). Можно использовать как есть или fine-tune'ить.</li>
        <li><b>Через понижение размерности</b> — из one-hot + SVD/PCA получаются плотные вектора (старый подход).</li>
      </ol>

      <h3>🎯 Где используются embedding'и</h3>
      <table>
        <tr><th>Область</th><th>Что embedding'уется</th></tr>
        <tr><td><b>NLP</b></td><td>Слова, предложения, документы (Word2Vec, BERT)</td></tr>
        <tr><td><b>Рекомендации</b></td><td>Пользователи и товары (Matrix Factorization)</td></tr>
        <tr><td><b>Computer Vision</b></td><td>Изображения → вектор (ResNet, CLIP)</td></tr>
        <tr><td><b>Табличные данные</b></td><td>Категориальные признаки (отдельный embedding для каждой колонки)</td></tr>
        <tr><td><b>Графы</b></td><td>Узлы графа (Node2Vec, GNN)</td></tr>
        <tr><td><b>Код</b></td><td>Функции, куски кода (CodeBERT)</td></tr>
        <tr><td><b>Мультимодальные</b></td><td>Текст + картинка в общем пространстве (CLIP)</td></tr>
      </table>

      <h3>📐 Меры близости в embedding-пространстве</h3>
      <ul>
        <li><b>Cosine similarity</b>: $\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\|\\|v\\|}$ — угол между векторами. Наиболее популярная, не зависит от длины вектора.</li>
        <li><b>Euclidean distance</b>: $\\|u - v\\|$ — обычное расстояние. Зависит от масштаба.</li>
        <li><b>Dot product</b>: $u \\cdot v$ — простое скалярное произведение. Используется в attention.</li>
      </ul>

      <h3>✨ Магия embedding'ов: алгебра смыслов</h3>
      <div class="math-block">$$\\vec{\\text{король}} - \\vec{\\text{мужчина}} + \\vec{\\text{женщина}} \\approx \\vec{\\text{королева}}$$</div>
      <p>В хорошем embedding-пространстве арифметика векторов соответствует семантическим операциям. Это знаменитый результат Word2Vec, показавший, что векторное представление <b>реально выучивает смысл</b>, а не просто статистику.</p>

      <h3>⚠️ Типичные ошибки</h3>
      <ul>
        <li><b>Слишком большая размерность</b> — переобучение, замедление.</li>
        <li><b>Слишком маленькая</b> — embedding не вмещает достаточно информации (bottleneck).</li>
        <li><b>Нет нормализации</b> — при использовании Euclidean близости разные масштабы искажают результат.</li>
        <li><b>Утечка через embedding</b> — обучил embedding на всех данных, включая test → утечка.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('nlp-basics')">Основы NLP</a> — Word2Vec, TF-IDF vs embedding</li>
        <li><a onclick="App.selectTopic('recsys')">Рекомендательные системы</a> — user/item embeddings</li>
        <li><a onclick="App.selectTopic('pca')">PCA</a>, <a onclick="App.selectTopic('tsne-umap')">t-SNE/UMAP</a> — визуализация embedding'ов</li>
        <li><a onclick="App.selectTopic('transformer')">Transformer</a> — contextual embeddings</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Word_embedding" target="_blank">Wikipedia: Word embedding</a></li>
        <li><a href="https://projector.tensorflow.org/" target="_blank">TensorFlow Embedding Projector</a> — интерактивная визуализация</li>
      </ul>
    `
  }
});
