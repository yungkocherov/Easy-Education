/* ==========================================================================
   Глоссарий: Энтропия и Information Gain
   ========================================================================== */
App.registerTopic({
  id: 'glossary-entropy',
  category: 'glossary',
  title: 'Энтропия и Information Gain',
  summary: 'Мера «неопределённости» распределения — основа деревьев решений и cross-entropy loss.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты играешь в «Угадай персонажа». Если в банке 1000 разных персонажей, ты будешь задавать много вопросов. Если в банке только 2 — узнаешь за 1 вопрос. <b>Энтропия</b> — это количество информации, нужное для опознания объекта. Чем больше хаоса (равномернее распределение), тем выше энтропия.</p>
        <p>Когда решающее дерево делает split: оно ищет вопрос, <b>максимально снижающий энтропию</b> — то есть максимально проясняющий ответ. Это и называется <b>Information Gain</b>: сколько неопределённости мы устранили одним вопросом.</p>
      </div>

      <h3>📐 Определение энтропии Шеннона</h3>
      <div class="math-block">$$H(X) = -\\sum_{i=1}^K p_i \\log_2 p_i$$</div>
      <p>где $p_i$ — вероятность $i$-го класса. Единица измерения — биты.</p>

      <h4>Интуитивные случаи</h4>
      <ul>
        <li><b>Всё один класс</b> ($p_1 = 1$, остальные 0): $H = -1 \\cdot \\log_2 1 = 0$. Нет неопределённости → нет энтропии.</li>
        <li><b>Два класса, 50/50</b>: $H = -(0.5 \\log 0.5 + 0.5 \\log 0.5) = 1$ бит. Максимальный хаос → нужен 1 бит для ответа.</li>
        <li><b>Два класса, 90/10</b>: $H = -(0.9 \\log 0.9 + 0.1 \\log 0.1) \\approx 0.47$ бит. Частично определено.</li>
        <li><b>Равномерно из 8 классов</b>: $H = \\log_2 8 = 3$ бита. Нужно 3 вопроса типа «да/нет».</li>
      </ul>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Энтропия бинарного распределения H(p) = −p log p − (1−p) log(1−p)</text>
          <line x1="80" y1="250" x2="720" y2="250" stroke="#475569" stroke-width="1.5"/>
          <line x1="80" y1="60" x2="80" y2="250" stroke="#475569" stroke-width="1.5"/>
          <!-- Y ticks -->
          <g font-size="11" fill="#64748b" text-anchor="end">
            <text x="75" y="254">0</text>
            <text x="75" y="205">0.25</text>
            <text x="75" y="157">0.5</text>
            <text x="75" y="110">0.75</text>
            <text x="75" y="64">1</text>
          </g>
          <!-- X ticks -->
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="80" y="270">0</text>
            <text x="240" y="270">0.25</text>
            <text x="400" y="270">0.5</text>
            <text x="560" y="270">0.75</text>
            <text x="720" y="270">1</text>
          </g>
          <text x="400" y="290" text-anchor="middle" font-size="12" fill="#64748b">p (вероятность класса 1)</text>
          <text x="40" y="155" text-anchor="middle" font-size="12" fill="#64748b" transform="rotate(-90 40 155)">H(p), бит</text>
          <!-- Curve: peaks at p=0.5 with H=1 -->
          <path id="entropy-curve" d="" fill="none" stroke="#4338ca" stroke-width="3"/>
          <!-- Key points -->
          <circle cx="80" cy="250" r="5" fill="#4338ca"/>
          <text x="90" y="246" font-size="11" fill="#4338ca" font-weight="700">H=0 (определённость)</text>
          <circle cx="720" cy="250" r="5" fill="#4338ca"/>
          <text x="710" y="246" text-anchor="end" font-size="11" fill="#4338ca" font-weight="700">H=0</text>
          <circle cx="400" cy="64" r="5" fill="#dc2626"/>
          <text x="400" y="52" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="700">H=1 (максимум при p=0.5)</text>
        </svg>
        <div class="caption">Энтропия как функция вероятности. Максимум (1 бит) при p=0.5 — «полная неопределённость». Минимум (0) на краях — мы точно знаем ответ.</div>
        <script>
        (function() {
          var pts = [];
          for (var i = 1; i <= 99; i++) {
            var p = i / 100;
            var h = -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
            var x = 80 + p * 640;
            var y = 250 - h * 186;
            pts.push([x.toFixed(1), y.toFixed(1)]);
          }
          var d = 'M80,250 L' + pts[0][0] + ',' + pts[0][1];
          for (var j = 1; j < pts.length; j++) d += ' L' + pts[j][0] + ',' + pts[j][1];
          d += ' L720,250';
          document.getElementById('entropy-curve').setAttribute('d', d);
        })();
        </script>
      </div>

      <h3>🎯 Information Gain (прирост информации)</h3>
      <p>Когда решающее дерево выбирает, по какому признаку сделать split, оно считает <b>information gain</b> — на сколько уменьшается энтропия после разделения.</p>
      <div class="math-block">$$\\text{IG}(S, A) = H(S) - \\sum_{v \\in \\text{values}(A)} \\frac{|S_v|}{|S|} H(S_v)$$</div>
      <p>где $S$ — исходное множество, $A$ — признак, $S_v$ — подмножество с значением $v$ у признака $A$.</p>

      <h4>Пошаговый пример</h4>
      <p>У нас 10 фруктов: 5 яблок и 5 апельсинов. Признак — цвет: 4 красных, 6 оранжевых.</p>
      <ul>
        <li>Исходная энтропия: $H(S) = -\\frac{5}{10}\\log_2\\frac{5}{10} - \\frac{5}{10}\\log_2\\frac{5}{10} = 1$ бит.</li>
        <li>Среди красных (4): 4 яблока, 0 апельсинов → $H(S_{red}) = 0$.</li>
        <li>Среди оранжевых (6): 1 яблоко, 5 апельсинов → $H(S_{orange}) = -\\frac{1}{6}\\log\\frac{1}{6} - \\frac{5}{6}\\log\\frac{5}{6} \\approx 0.65$.</li>
        <li>Взвешенная энтропия после split: $\\frac{4}{10}\\cdot 0 + \\frac{6}{10}\\cdot 0.65 = 0.39$ бит.</li>
        <li><b>IG = 1 − 0.39 = 0.61 бит</b>. Split по цвету снизил неопределённость на 0.61 бит.</li>
      </ul>

      <h3>🔢 Gini Impurity — альтернатива энтропии</h3>
      <p>Другая популярная мера «нечистоты» для деревьев решений:</p>
      <div class="math-block">$$\\text{Gini}(S) = 1 - \\sum_{i=1}^K p_i^2$$</div>
      <p>Интерпретация: вероятность того, что две случайно выбранные из $S$ точки принадлежат разным классам. Gini = 0 — все одного класса, Gini = 0.5 — максимум для бинарной задачи (vs 1 бит у энтропии).</p>
      <p>Практически Gini и Entropy дают очень похожие деревья. Gini чуть быстрее (не нужен log). CART использует Gini, ID3/C4.5 — энтропию.</p>

      <h3>🧮 Cross-Entropy Loss</h3>
      <p>Та же формула энтропии применяется как функция потерь классификации:</p>
      <div class="math-block">$$L = -\\sum_{i=1}^K y_i \\log \\hat{p}_i$$</div>
      <p>где $y_i$ — one-hot истинный класс, $\\hat{p}_i$ — предсказанная вероятность. Это <b>cross-entropy между истинным и предсказанным распределением</b> — сколько «битов» нужно, чтобы закодировать истину, если предполагать предсказанное распределение. Минимум при $\\hat{p} = y$.</p>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('decision-tree')">Решающее дерево</a> — Gini/Entropy при построении</li>
        <li><a onclick="App.selectTopic('glossary-loss-functions')">Функции потерь</a> — cross-entropy как loss</li>
        <li><a onclick="App.selectTopic('glossary-sigmoid-softmax')">Softmax</a> — вместе с cross-entropy</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Entropy_(information_theory)" target="_blank">Wikipedia: Information entropy</a></li>
        <li><a href="https://www.youtube.com/watch?v=v68zYyaEmEA" target="_blank">StatQuest: Entropy explained</a></li>
      </ul>
    `
  }
});
