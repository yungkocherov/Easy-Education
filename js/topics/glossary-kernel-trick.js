/* ==========================================================================
   Глоссарий: Kernel Trick
   ========================================================================== */
App.registerTopic({
  id: 'glossary-kernel-trick',
  category: 'glossary',
  title: 'Kernel Trick',
  summary: 'Техника неявного перехода в высокоразмерное пространство без вычисления координат.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что у тебя точки на плоскости, расположенные двумя кольцами: одно внутри другого. Никакой <b>прямой</b> их не разделить. Но если добавить третье измерение (высоту) — можно «поднять» внутреннее кольцо вверх, и теперь плоскость легко их разделит.</p>
        <p><b>Kernel Trick</b> — это математический фокус: мы будто бы переходим в такое «высокоразмерное» пространство, но <b>фактически там никогда не оказываемся</b>. Вместо явного вычисления координат мы просто определяем, как считать «скалярное произведение» в новом пространстве — и этого достаточно для большинства алгоритмов (SVM, Kernel PCA, Gaussian Processes).</p>
      </div>

      <h3>🎯 Почему это работает</h3>
      <p>Многие алгоритмы (например, SVM) работают <b>только со скалярными произведениями</b> между точками, а не с самими координатами. Такие алгоритмы называются <b>кернелизуемыми</b>.</p>
      <p>Определим отображение $\\phi: \\mathbb{R}^d \\to \\mathbb{R}^D$ (обычно $D \\gg d$). Тогда скалярное произведение в новом пространстве:</p>
      <div class="math-block">$$K(x, x') = \\phi(x)^T \\phi(x')$$</div>
      <p>Функция $K$ называется <b>ядром (kernel)</b>. Если мы можем вычислить $K(x, x')$ <b>напрямую</b>, минуя $\\phi$, — мы не тратим ресурсы на высокоразмерное пространство.</p>

      <h3>🔢 Конкретный пример: polynomial kernel</h3>
      <p>Возьмём 2D точки $x = (x_1, x_2)$ и ядро $K(x, x') = (x^T x')^2$.</p>
      <p>Раскроем:</p>
      <div class="math-block">$$K(x, x') = (x_1 x_1' + x_2 x_2')^2 = x_1^2 x_1'^2 + 2x_1 x_2 x_1' x_2' + x_2^2 x_2'^2$$</div>
      <p>Сравни с $\\phi(x)^T \\phi(x')$, где $\\phi(x) = (x_1^2, \\sqrt{2}\\,x_1 x_2, x_2^2)$. Получаем:</p>
      <div class="math-block">$$\\phi(x)^T \\phi(x') = x_1^2 \\cdot x_1'^2 + 2 x_1 x_2 \\cdot x_1' x_2' + x_2^2 \\cdot x_2'^2$$</div>
      <p><b>Результаты совпадают!</b> Мы не вычисляли $\\phi(x)$ явно — только кернел. Данные неявно «подняты» в 3D $(x_1^2, \\sqrt{2}x_1 x_2, x_2^2)$.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Неразделимые данные в 2D становятся разделимы в высшем пространстве</text>

          <!-- Left: 2D circle problem -->
          <g>
            <text x="180" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#475569">2D: не разделимы линейно</text>
            <line x1="60" y1="260" x2="300" y2="260" stroke="#475569" stroke-width="1"/>
            <line x1="180" y1="90" x2="180" y2="280" stroke="#475569" stroke-width="1"/>
            <!-- Red inner cluster -->
            <g fill="#dc2626">
              <circle cx="155" cy="170" r="4"/>
              <circle cx="180" cy="150" r="4"/>
              <circle cx="205" cy="170" r="4"/>
              <circle cx="215" cy="195" r="4"/>
              <circle cx="195" cy="215" r="4"/>
              <circle cx="165" cy="210" r="4"/>
              <circle cx="150" cy="190" r="4"/>
              <circle cx="175" cy="185" r="4"/>
              <circle cx="195" cy="175" r="4"/>
              <circle cx="180" cy="200" r="4"/>
            </g>
            <!-- Blue outer ring -->
            <g fill="#1e40af">
              <circle cx="100" cy="180" r="4"/>
              <circle cx="110" cy="130" r="4"/>
              <circle cx="160" cy="105" r="4"/>
              <circle cx="210" cy="105" r="4"/>
              <circle cx="250" cy="130" r="4"/>
              <circle cx="260" cy="180" r="4"/>
              <circle cx="245" cy="225" r="4"/>
              <circle cx="200" cy="250" r="4"/>
              <circle cx="155" cy="250" r="4"/>
              <circle cx="110" cy="230" r="4"/>
              <circle cx="95" cy="200" r="4"/>
              <circle cx="270" cy="155" r="4"/>
            </g>
            <text x="180" y="300" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="700">Никакой прямой нельзя разделить</text>
          </g>

          <!-- Arrow with kernel -->
          <path d="M310,170 L440,170" stroke="#7c3aed" stroke-width="2.5" fill="none" marker-end="url(#kt-arr)"/>
          <text x="375" y="155" text-anchor="middle" font-size="12" font-weight="700" fill="#7c3aed">φ или K</text>
          <text x="375" y="188" text-anchor="middle" font-size="10" fill="#64748b">(добавляем</text>
          <text x="375" y="202" text-anchor="middle" font-size="10" fill="#64748b">признак r²=x²+y²)</text>
          <defs>
            <marker id="kt-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#7c3aed"/>
            </marker>
          </defs>

          <!-- Right: 3D lifted view -->
          <g>
            <text x="580" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#475569">3D: разделима плоскостью</text>
            <!-- Axes: x, y, z (perspective) -->
            <line x1="460" y1="260" x2="700" y2="260" stroke="#475569" stroke-width="1"/>
            <line x1="580" y1="90" x2="580" y2="280" stroke="#475569" stroke-width="1"/>
            <line x1="480" y1="240" x2="560" y2="140" stroke="#475569" stroke-width="1"/>
            <text x="700" y="260" font-size="10" fill="#64748b">x</text>
            <text x="585" y="85" font-size="10" fill="#64748b">r²=x²+y²</text>
            <!-- Separating plane (horizontal) -->
            <line x1="470" y1="215" x2="690" y2="215" stroke="#059669" stroke-width="2" stroke-dasharray="5,3"/>
            <text x="695" y="213" font-size="10" fill="#059669" font-weight="600">плоскость</text>
            <!-- Inner points (low r²) - near the bottom -->
            <g fill="#dc2626">
              <circle cx="550" cy="245" r="4"/>
              <circle cx="570" cy="255" r="4"/>
              <circle cx="590" cy="250" r="4"/>
              <circle cx="605" cy="240" r="4"/>
              <circle cx="580" cy="235" r="4"/>
              <circle cx="560" cy="235" r="4"/>
              <circle cx="575" cy="230" r="4"/>
              <circle cx="595" cy="245" r="4"/>
            </g>
            <!-- Outer points (high r²) - above the plane -->
            <g fill="#1e40af">
              <circle cx="500" cy="180" r="4"/>
              <circle cx="540" cy="140" r="4"/>
              <circle cx="580" cy="115" r="4"/>
              <circle cx="615" cy="130" r="4"/>
              <circle cx="650" cy="165" r="4"/>
              <circle cx="645" cy="200" r="4"/>
              <circle cx="530" cy="160" r="4"/>
              <circle cx="620" cy="155" r="4"/>
            </g>
            <text x="580" y="300" text-anchor="middle" font-size="11" fill="#059669" font-weight="700">Линейная плоскость разделяет!</text>
          </g>
        </svg>
        <div class="caption">Красные и синие точки в 2D образуют два кольца — никакой прямой не разделить. Но если добавить измерение $r^2 = x^2 + y^2$, внутренние точки имеют малый $r^2$, внешние — большой. В 3D их легко разделить плоскостью. Kernel trick делает это неявно через $K(x, x') = \\phi(x)^T \\phi(x')$ без явного вычисления координат.</div>
      </div>

      <h3>🎯 Популярные ядра</h3>
      <table>
        <tr><th>Ядро</th><th>Формула</th><th>Когда использовать</th></tr>
        <tr><td><b>Linear</b></td><td>$K(x, x') = x^T x'$</td><td>Линейно разделимые, много признаков</td></tr>
        <tr><td><b>Polynomial</b></td><td>$K = (\\gamma x^T x' + r)^d$</td><td>Полиномиальные зависимости, взаимодействия признаков</td></tr>
        <tr><td><b>RBF (Gaussian)</b></td><td>$K = \\exp(-\\gamma \\|x - x'\\|^2)$</td><td>Самое универсальное, выучивает любые границы</td></tr>
        <tr><td><b>Sigmoid</b></td><td>$K = \\tanh(\\gamma x^T x' + r)$</td><td>Аналог нейрона, редко используется</td></tr>
        <tr><td><b>Laplacian</b></td><td>$K = \\exp(-\\gamma \\|x - x'\\|)$</td><td>Робастнее RBF к выбросам</td></tr>
      </table>

      <h3>💡 RBF: магия бесконечного измерения</h3>
      <p>RBF-ядро $K(x, x') = \\exp(-\\gamma \\|x - x'\\|^2)$ соответствует отображению в <b>бесконечномерное</b> пространство (разложение по базисным функциям Эрмита / Гаусса). Невозможно выписать $\\phi(x)$ — это бесконечный вектор. Но $K$ вычисляется за $O(d)$, и SVM работает.</p>
      <p>Это абсолютная магия kernel trick: <b>работа в бесконечномерном пространстве за конечное время</b>.</p>

      <h3>🧮 Где используется</h3>
      <ul>
        <li><b>SVM</b> — классика, именно там kernel trick сделал прорыв в 90-х.</li>
        <li><b>Kernel PCA</b> — нелинейное снижение размерности.</li>
        <li><b>Gaussian Processes</b> — Bayesian модели регрессии.</li>
        <li><b>Kernel Ridge Regression</b> — нелинейный аналог Ridge.</li>
        <li><b>Spectral Clustering</b> — кластеризация через нелинейные признаки.</li>
      </ul>

      <h3>⚠️ Ограничения</h3>
      <ul>
        <li><b>O(n²) память</b> — нужно хранить kernel matrix $K_{ij} = K(x_i, x_j)$. Для n &gt; 50 000 становится дорого.</li>
        <li><b>Медленное предсказание</b> — зависит от числа support vectors.</li>
        <li><b>Выбор ядра</b> — нужно экспериментировать, нет универсального рецепта.</li>
        <li><b>Плохо масштабируется</b> — для big data лучше нейросети.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('svm')">SVM</a> — главное применение</li>
        <li><a onclick="App.selectTopic('pca')">PCA</a> — есть Kernel PCA</li>
        <li><a onclick="App.selectTopic('svr')">SVR</a> — kernel trick для регрессии</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Kernel_method" target="_blank">Wikipedia: Kernel method</a></li>
        <li><a href="https://www.youtube.com/watch?v=efR1C6CvhmE" target="_blank">StatQuest: SVM (kernel trick объяснение)</a></li>
      </ul>
    `
  }
});
