/* ==========================================================================
   DBSCAN
   ========================================================================== */
App.registerTopic({
  id: 'dbscan',
  category: 'ml',
  title: 'DBSCAN',
  summary: 'Плотностная кластеризация — находит кластеры любой формы и шум.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь ночной город сверху. Видишь скопления огней — это жилые районы. Между ними — тёмные пустоши и случайные одинокие фонари вдоль дорог. Как определить «район»? Район — это <b>густое</b> скопление огней, отделённое пустотой от других скоплений.</p>
        <p>DBSCAN работает именно так. Он не знает заранее, сколько районов (кластеров) в городе. Он ищет области <b>высокой плотности</b> точек и говорит: «это район 1, это район 2, а эта точка — просто одинокий фонарь вдали — шум».</p>
        <p>Это принципиально другой подход, чем у K-Means. Там кластеры — круглые «горки» вокруг центров, и число кластеров задаётся заранее. У DBSCAN — любая форма, а количество определяется по данным.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">DBSCAN: ядра, границы, шум</text>
          <!-- Background -->
          <rect x="25" y="25" width="450" height="160" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <!-- Cluster 1: core points (large, indigo) -->
          <circle cx="100" cy="85" r="13" fill="#6366f1" opacity="0.9"/>
          <circle cx="130" cy="105" r="13" fill="#6366f1" opacity="0.9"/>
          <circle cx="105" cy="130" r="13" fill="#6366f1" opacity="0.9"/>
          <circle cx="145" cy="75" r="13" fill="#6366f1" opacity="0.9"/>
          <!-- Cluster 1: border points (medium, lighter) -->
          <circle cx="80" cy="55" r="9" fill="#818cf8" opacity="0.8"/>
          <circle cx="165" cy="125" r="9" fill="#818cf8" opacity="0.8"/>
          <!-- Cluster 2: core points (green) -->
          <circle cx="310" cy="80" r="13" fill="#10b981" opacity="0.9"/>
          <circle cx="340" cy="100" r="13" fill="#10b981" opacity="0.9"/>
          <circle cx="320" cy="125" r="13" fill="#10b981" opacity="0.9"/>
          <!-- Cluster 2: border points -->
          <circle cx="290" cy="130" r="9" fill="#6ee7b7" opacity="0.8"/>
          <circle cx="365" cy="75" r="9" fill="#6ee7b7" opacity="0.8"/>
          <!-- eps circle around one core point -->
          <circle cx="130" cy="105" r="45" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.7"/>
          <text x="130" y="58" text-anchor="middle" font-size="8" fill="#6366f1">ε-окрестность</text>
          <!-- Noise points (small gray) -->
          <circle cx="215" cy="60" r="6" fill="#94a3b8" opacity="0.7"/>
          <circle cx="235" cy="155" r="6" fill="#94a3b8" opacity="0.7"/>
          <circle cx="440" cy="55" r="6" fill="#94a3b8" opacity="0.7"/>
          <circle cx="460" cy="150" r="6" fill="#94a3b8" opacity="0.7"/>
          <!-- Labels -->
          <text x="115" y="165" text-anchor="middle" font-size="9" fill="#6366f1" font-weight="600">Кластер 1</text>
          <text x="330" y="165" text-anchor="middle" font-size="9" fill="#10b981" font-weight="600">Кластер 2</text>
          <text x="450" y="100" text-anchor="middle" font-size="9" fill="#94a3b8">шум</text>
          <!-- Legend -->
          <circle cx="40" cy="195" r="8" fill="#6366f1"/>
          <text x="54" y="199" font-size="9" fill="#334155">ядро</text>
          <circle cx="105" cy="195" r="6" fill="#818cf8"/>
          <text x="117" y="199" font-size="9" fill="#334155">граница</text>
          <circle cx="185" cy="195" r="4" fill="#94a3b8"/>
          <text x="195" y="199" font-size="9" fill="#334155">шум</text>
          <circle cx="250" cy="195" r="15" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="4,2"/>
          <text x="280" y="199" font-size="9" fill="#334155">ε-радиус</text>
        </svg>
        <div class="caption">DBSCAN: большие точки — ядровые (много соседей в ε-радиусе), средние — граничные (сами не ядровые, но рядом с ядровыми), маленькие серые — шум.</div>
      </div>

      <h3>🔍 Что такое DBSCAN</h3>
      <p>DBSCAN = <b>D</b>ensity-<b>B</b>ased <b>S</b>patial <b>C</b>lustering of <b>A</b>pplications with <b>N</b>oise. «Плотностная кластеризация с шумом».</p>
      <p>Главные идеи:</p>
      <ul>
        <li><b>Кластер = область высокой плотности</b> точек.</li>
        <li>Разделены <b>областями низкой плотности</b>.</li>
        <li>Точки вне любого кластера — <b>шум</b>.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>DBSCAN не нужно знать число кластеров заранее — он сам их найдёт. Он может находить кластеры <b>любой формы</b> (не только круглые) и автоматически <b>выделяет шум</b>. Это делает его мощным инструментом, где K-Means бессилен.</p>
      </div>

      <h3>⚙️ Два параметра</h3>
      <p>У DBSCAN всего два параметра, но их правильный выбор критически важен:</p>

      <ul>
        <li><b>eps (ε)</b> — радиус окрестности. «Насколько близко надо быть, чтобы считаться соседом».</li>
        <li><b>min_samples</b> — сколько соседей нужно, чтобы считать точку «плотной». Минимум точек в ε-окрестности.</li>
      </ul>

      <p>Эти параметры вместе определяют <b>порог плотности</b>: «плотная область» = место, где в радиусе ε есть как минимум min_samples точек.</p>

      <h3>🔵 Три типа точек</h3>
      <p>Алгоритм классифицирует каждую точку в один из трёх типов:</p>

      <h4>Core point (ядровая точка)</h4>
      <p>В её ε-окрестности <b>не меньше</b> min_samples точек (включая её). Это «сердцевина» кластера — плотная область.</p>

      <h4>Border point (граничная точка)</h4>
      <p>Сама не core (меньше соседей), но попадает в ε-окрестность какой-то core-точки. Это «край» кластера.</p>

      <h4>Noise point (шум)</h4>
      <p>Не core и не border. Изолированная точка. Это выброс или просто одиночка.</p>

      <h3>🔄 Алгоритм</h3>
      <ol>
        <li>Для каждой точки находим соседей в радиусе ε.</li>
        <li>Если соседей ≥ min_samples → она <b>core</b>. Создаём новый кластер (если она ещё не в кластере).</li>
        <li><b>Расширяем кластер:</b> все соседи core-точки добавляются в этот же кластер. Если новая точка — тоже core, её соседи тоже включаются. Идём рекурсивно, пока кластер не перестанет расти.</li>
        <li>Точки, не попавшие ни в один кластер — <b>шум</b>.</li>
      </ol>

      <p>Результат: каждая точка помечена как принадлежащая кластеру #1, #2, ..., или помечена как шум (−1).</p>

      <h3>🎯 Как выбрать параметры</h3>

      <h4>min_samples</h4>
      <p>Эвристика: <b>2 × размерность</b>. Для 2D данных — 4. Для 10D — 20.</p>
      <p>Большие значения → модель игнорирует мелкие кластеры, больше точек помечено шумом. Маленькие → чувствительнее, но может делить кластеры.</p>

      <h4>eps — через k-distance plot</h4>
      <p>Стандартный подход:</p>
      <ol>
        <li>Для каждой точки считаем расстояние до её k-го ближайшего соседа (k = min_samples).</li>
        <li>Сортируем эти расстояния по возрастанию.</li>
        <li>Рисуем график → ищем <b>«колено»</b> (резкий изгиб вверх).</li>
        <li>Значение в колене — хороший кандидат для ε.</li>
      </ol>

      <p>Идея: точки на «полке» графика — внутри кластеров (близкие соседи). Точки на «стене» — шум или граница. Колено разделяет их.</p>

      <h3>⚖️ Сравнение с K-Means</h3>
      <table>
        <tr><th>Критерий</th><th>K-Means</th><th>DBSCAN</th></tr>
        <tr><td>Форма кластеров</td><td>Только сферические</td><td>Любая</td></tr>
        <tr><td>Число кластеров</td><td>Задаётся заранее</td><td>Определяется автоматически</td></tr>
        <tr><td>Обработка шума</td><td>Все точки в кластеры</td><td>Явно выделяет выбросы</td></tr>
        <tr><td>Разные размеры</td><td>Обычно нормально</td><td>Нормально</td></tr>
        <tr><td>Разная плотность</td><td>Нормально</td><td>Плохо</td></tr>
        <tr><td>Скорость</td><td>Очень быстро</td><td>Средне</td></tr>
      </table>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Не нужно</b> знать число кластеров.</li>
        <li>Находит кластеры <b>любой формы</b>.</li>
        <li><b>Автоматически</b> выделяет шум.</li>
        <li>Устойчив к выбросам.</li>
        <li>Один проход по данным.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Плохо с разной плотностью</b> кластеров — один ε не подходит всем.</li>
        <li>Чувствителен к выбору ε.</li>
        <li><b>Не работает в высоких размерностях</b> (p > 20) из-за проклятия размерности.</li>
        <li>Граничные точки могут быть отнесены к разным кластерам (недетерминированность).</li>
      </ul>

      <h3>🔧 Применения</h3>
      <ul>
        <li><b>Geospatial</b> — кластеры такси, магазинов, пожаров.</li>
        <li><b>Anomaly detection</b> — точки, помеченные как шум.</li>
        <li><b>Сегментация изображений</b> — группировка похожих пикселей.</li>
        <li><b>Анализ логов</b> — группировка событий.</li>
        <li><b>Астрономия</b> — поиск звёздных скоплений.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«DBSCAN универсальный»</b> — плохо с разной плотностью и в высоких размерностях.</li>
        <li><b>«DBSCAN не требует настройки»</b> — всё равно нужно выбрать ε и min_samples.</li>
        <li><b>«Шум — это плохо»</b> — наоборот, способность его находить — фича DBSCAN.</li>
        <li><b>«DBSCAN детерминирован»</b> — почти да, но граничные точки могут попасть в разные кластеры в зависимости от порядка обхода.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: формальные определения</summary>
        <div class="deep-dive-body">
          <p>Теоретические концепции DBSCAN:</p>
          <ul>
            <li><b>ε-окрестность:</b> $N_\\epsilon(p) = \\{q : d(p, q) \\leq \\epsilon\\}$</li>
            <li><b>Direct density-reachable:</b> q напрямую достижима из p, если p core и $q \\in N_\\epsilon(p)$.</li>
            <li><b>Density-reachable:</b> есть цепочка $p_1, p_2, \\ldots, p_n$, где каждая следующая достижима напрямую.</li>
            <li><b>Density-connected:</b> p и q density-connected, если существует точка o, из которой достижимы и p, и q.</li>
          </ul>
          <p>Кластер — максимальный набор density-connected точек. Math красивая, реализация простая.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: HDBSCAN и OPTICS</summary>
        <div class="deep-dive-body">
          <p>Эволюция DBSCAN, решающая его проблемы:</p>
          <ul>
            <li><b>HDBSCAN</b> — иерархический DBSCAN, автоматически определяет кластеры разной плотности. Не требует ε! Нужно только min_samples.</li>
            <li><b>OPTICS</b> — создаёт упорядочивание точек, из которого можно извлечь кластеризацию для любого ε. Удобно для исследования.</li>
          </ul>
          <p>Оба доступны в sklearn. HDBSCAN часто работает лучше DBSCAN «из коробки».</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: сложность и масштабирование</summary>
        <div class="deep-dive-body">
          <p>Наивная реализация: O(n²) — для каждой точки ищем соседей среди всех.</p>
          <p>С пространственным индексом (KD-Tree, R-Tree, Ball Tree): <b>O(n log n)</b>.</p>
          <p>Память: O(n) — не хранит матрицу расстояний.</p>
          <p>Для очень больших данных существуют распределённые версии.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>K-Means</b> — альтернатива для сферических кластеров.</li>
        <li><b>Isolation Forest</b> — специализированный метод для anomaly detection.</li>
        <li><b>HDBSCAN</b> — современное улучшение DBSCAN.</li>
        <li><b>kNN</b> — DBSCAN использует k ближайших соседей внутри себя.</li>
        <li><b>t-SNE / UMAP</b> — часто применяются перед DBSCAN для визуализации.</li>
      </ul>
    `,

    examples: [
      {
        title: 'DBSCAN на 10 точках: Core/Border/Noise',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Классифицировать 10 точек как Core, Border или Noise при eps=1.5, minPts=3.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>x</th><th>y</th></tr>
              <tr><td>P1</td><td>1.0</td><td>1.0</td></tr>
              <tr><td>P2</td><td>1.5</td><td>1.5</td></tr>
              <tr><td>P3</td><td>2.0</td><td>1.0</td></tr>
              <tr><td>P4</td><td>2.0</td><td>2.5</td></tr>
              <tr><td>P5</td><td>5.0</td><td>5.0</td></tr>
              <tr><td>P6</td><td>5.5</td><td>5.5</td></tr>
              <tr><td>P7</td><td>6.0</td><td>5.0</td></tr>
              <tr><td>P8</td><td>5.5</td><td>4.5</td></tr>
              <tr><td>P9</td><td>9.0</td><td>1.0</td></tr>
              <tr><td>P10</td><td>3.0</td><td>4.0</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: найти ε-соседей каждой точки (eps=1.5)</h4>
            <div class="calc">
              P1(1,1): соседи в радиусе 1.5<br>
              d(P1,P2)=√(0.25+0.25)=0.71 ✓, d(P1,P3)=1.0 ✓, d(P1,P4)=√(1+2.25)=1.80 ✗<br>
              Соседи P1: {P2, P3} → 2 соседа (не считая себя)<br><br>
              P2(1.5,1.5): d(P1)=0.71✓, d(P3)=√(0.25+0.25)=0.71✓, d(P4)=√(0.25+1)=1.12✓<br>
              Соседи P2: {P1, P3, P4} → 3 соседа<br><br>
              P5(5,5): d(P6)=0.71✓, d(P7)=1.0✓, d(P8)=√(0.25+0.25)=0.71✓<br>
              Соседи P5: {P6, P7, P8} → 3 соседа
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: классифицировать точки</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Точка</th><th>Соседей в eps</th><th>minPts=3?</th><th>Тип</th></tr>
                <tr><td>P1</td><td>2 (P2,P3)</td><td>Нет</td><td>Border (сосед core P2)</td></tr>
                <tr><td>P2</td><td>3 (P1,P3,P4)</td><td>Да</td><td><b>Core</b></td></tr>
                <tr><td>P3</td><td>2 (P1,P2)</td><td>Нет</td><td>Border (сосед core P2)</td></tr>
                <tr><td>P4</td><td>1 (P2)</td><td>Нет</td><td>Border (сосед core P2)</td></tr>
                <tr><td>P5</td><td>3 (P6,P7,P8)</td><td>Да</td><td><b>Core</b></td></tr>
                <tr><td>P6</td><td>3 (P5,P7,P8)</td><td>Да</td><td><b>Core</b></td></tr>
                <tr><td>P7</td><td>3 (P5,P6,P8)</td><td>Да</td><td><b>Core</b></td></tr>
                <tr><td>P8</td><td>3 (P5,P6,P7)</td><td>Да</td><td><b>Core</b></td></tr>
                <tr><td>P9</td><td>0</td><td>Нет</td><td><b>Noise</b></td></tr>
                <tr><td>P10</td><td>0</td><td>Нет</td><td><b>Noise</b></td></tr>
              </table>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: построить кластеры</h4>
            <div class="calc">
              Кластер 1: начать с core P2<br>
              P2 → достижимы: P1 (border), P3 (border), P4 (border)<br>
              Кластер 1 = {P1, P2, P3, P4}<br><br>
              Кластер 2: начать с core P5<br>
              P5 → достижимы: P6, P7, P8 (все core — связаны)<br>
              Кластер 2 = {P5, P6, P7, P8}<br><br>
              Шум: {P9, P10} — не принадлежат ни одному кластеру
            </div>
            <div class="why">Border точки принадлежат кластеру ближайшей Core точки. Noise точки не достижимы ни из одной Core точки.</div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">DBSCAN: 10 точек (eps=1.5, minPts=3)</text>
              <!-- Scale: x=(coord)*35+30; y=155-coord*22 -->
              <!-- Cluster 1: P1(1,1)→(65,133), P2(1.5,1.5)→(82,122), P3(2,1)→(100,133), P4(2,2.5)→(100,100) -->
              <!-- Cluster 2: P5(5,5)→(205,45), P6(5.5,5.5)→(222,33), P7(6,5)→(240,45), P8(5.5,4.5)→(222,56) -->
              <!-- Noise: P9(9,1)→(345,133), P10(3,4)→(135,67) -->
              <!-- eps circle around P2 (core) -->
              <circle cx="82" cy="122" r="52" fill="#3b82f6" fill-opacity="0.08" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/>
              <text x="50" y="75" font-size="8" fill="#3b82f6">ε=1.5</text>
              <!-- Cluster 1 dots -->
              <!-- P2 = Core -->
              <circle cx="82" cy="122" r="10" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2.5"/>
              <text x="82" y="119" text-anchor="middle" font-size="7" fill="#fff">P2</text>
              <text x="82" y="138" text-anchor="middle" font-size="7" fill="#3b82f6">Core</text>
              <!-- P1, P3, P4 = Border -->
              <circle cx="65" cy="133" r="8" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
              <text x="65" y="130" text-anchor="middle" font-size="7" fill="#1d4ed8">P1</text>
              <circle cx="100" cy="133" r="8" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
              <text x="100" y="130" text-anchor="middle" font-size="7" fill="#1d4ed8">P3</text>
              <circle cx="100" cy="100" r="8" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
              <text x="100" y="97" text-anchor="middle" font-size="7" fill="#1d4ed8">P4</text>
              <!-- Cluster 2 dots (all Core) -->
              <circle cx="205" cy="45" r="10" fill="#10b981" stroke="#065f46" stroke-width="2.5"/>
              <text x="205" y="42" text-anchor="middle" font-size="7" fill="#fff">P5</text>
              <circle cx="222" cy="33" r="10" fill="#10b981" stroke="#065f46" stroke-width="2.5"/>
              <text x="222" y="30" text-anchor="middle" font-size="7" fill="#fff">P6</text>
              <circle cx="240" cy="45" r="10" fill="#10b981" stroke="#065f46" stroke-width="2.5"/>
              <text x="240" y="42" text-anchor="middle" font-size="7" fill="#fff">P7</text>
              <circle cx="222" cy="56" r="10" fill="#10b981" stroke="#065f46" stroke-width="2.5"/>
              <text x="222" y="53" text-anchor="middle" font-size="7" fill="#fff">P8</text>
              <text x="222" y="74" text-anchor="middle" font-size="7" fill="#10b981">Core×4</text>
              <!-- Noise points -->
              <circle cx="345" cy="133" r="8" fill="#64748b" stroke="#475569" stroke-width="1.5"/>
              <text x="345" y="130" text-anchor="middle" font-size="7" fill="#fff">P9</text>
              <text x="345" y="148" text-anchor="middle" font-size="7" fill="#64748b">Noise</text>
              <circle cx="135" cy="67" r="8" fill="#64748b" stroke="#475569" stroke-width="1.5"/>
              <text x="135" y="64" text-anchor="middle" font-size="7" fill="#fff">P10</text>
              <text x="135" y="82" text-anchor="middle" font-size="7" fill="#64748b">Noise</text>
              <!-- Legend -->
              <circle cx="275" cy="100" r="7" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>
              <text x="286" y="104" font-size="9" fill="#3b82f6">Core (P2,P5-P8)</text>
              <circle cx="275" cy="120" r="7" fill="#93c5fd" stroke="#3b82f6" stroke-width="1.5"/>
              <text x="286" y="124" font-size="9" fill="#3b82f6">Border (P1,P3,P4)</text>
              <circle cx="275" cy="140" r="7" fill="#64748b" stroke="#475569" stroke-width="1.5"/>
              <text x="286" y="144" font-size="9" fill="#64748b">Noise (P9,P10)</text>
            </svg>
            <div class="caption">Синий кластер {P1-P4}: P2 — Core (3 соседа), P1/P3/P4 — Border. Зелёный кластер {P5-P8}: все Core. Серые P9 и P10 — Noise (0 соседей в радиусе eps=1.5). Пунктир — eps-окрестность P2.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>2 кластера. Кластер 1: {P1-P4}. Кластер 2: {P5-P8}. Шум: {P9, P10}. Core точки: P2, P5, P6, P7, P8. Border: P1, P3, P4.</p>
          </div>
          <div class="lesson-box">
            Ключевое отличие от K-Means: DBSCAN не требует задавать k, автоматически находит шум, работает с произвольными формами кластеров. Но параметры eps и minPts нужно подбирать.
          </div>
        `,
      },
      {
        title: 'Выбор eps через k-distance graph',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Подобрать оптимальный eps для DBSCAN с помощью графика k-расстояний (k=minPts=4).</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Ранг точки</th><th>4-е расстояние (k-dist)</th><th>Интерпретация</th></tr>
              <tr><td>1–30</td><td>0.08–0.12</td><td>Плотные кластеры</td></tr>
              <tr><td>31–60</td><td>0.13–0.18</td><td>Плотные кластеры</td></tr>
              <tr><td>61–80</td><td>0.19–0.25</td><td>Граница кластеров</td></tr>
              <tr><td>81–90</td><td>0.35–0.55</td><td>Шум (резкий скачок)</td></tr>
              <tr><td>91–100</td><td>0.70–1.20</td><td>Явные выбросы</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: построить k-distance graph</h4>
            <div class="calc">
              Для каждой точки xᵢ: вычислить расстояние до её k-го соседа<br>
              (k = minPts = 4)<br><br>
              Отсортировать расстояния по убыванию и построить график<br>
              Ось X: ранг точки (от 1 до n)<br>
              Ось Y: k-расстояние<br><br>
              Из таблицы: 80 точек имеют k-dist ≤ 0.25<br>
              На ранге 80–81 резкий скачок: 0.25 → 0.35+
            </div>
            <div class="why">Точки с малым k-расстоянием — внутри плотных кластеров. Точки с большим — на краю или шум.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: найти «колено»</h4>
            <div class="calc">
              «Колено» — точка резкого увеличения k-расстояния<br>
              В нашем случае: между рангами 80 и 81<br>
              k-distance на «колене» ≈ 0.25–0.30<br><br>
              Рекомендация: eps = значение k-dist в «колене»<br>
              Выбираем: eps = <b>0.25</b><br><br>
              Проверка: при eps=0.25, minPts=4<br>
              → ~80 точек попадают в кластеры<br>
              → ~20 точек = шум (рейтинг 81-100)
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: тонкая настройка eps</h4>
            <div class="calc">
              eps=0.20: слишком строго → много шума, кластеры дробятся<br>
              eps=0.25: «колено» → хороший баланс<br>
              eps=0.40: слишком мягко → кластеры сливаются<br>
              eps=1.0: почти всё один кластер<br><br>
              Практический совет: попробовать eps ∈ {0.20, 0.25, 0.30}<br>
              Оценить: число кластеров, % шума, Silhouette Score
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимальный eps ≈ 0.25 (значение k-dist в «колене» графика). minPts = 2·dim = 4 (для 2D). При этих параметрах 80% точек в кластерах, 20% — шум.</p>
          </div>
          <div class="lesson-box">
            Эвристика minPts: для 2D данных minPts=4, для d-мерных — 2d. Более шумные данные → больший minPts. Если данных мало — minPts=3. Метод колена на k-distance graph — стандартный способ выбора eps.
          </div>
        `,
      },
      {
        title: 'DBSCAN vs K-Means на «лунах»',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить K-Means и DBSCAN на данных в форме двух полумесяцев («лун») — классический пример нелинейных кластеров.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Метод</th><th>Кластер 1 (точек)</th><th>Кластер 2 (точек)</th><th>Шум</th><th>Accuracy*</th></tr>
              <tr><td>K-Means (k=2)</td><td>Половина каждой луны</td><td>Другая половина</td><td>0%</td><td>≈50%</td></tr>
              <tr><td>DBSCAN (eps=0.3)</td><td>Верхняя луна (50 т.)</td><td>Нижняя луна (50 т.)</td><td>2-5 т.</td><td>≈97%</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: почему K-Means провалится</h4>
            <div class="calc">
              K-Means ищет выпуклые кластеры вокруг центроидов<br><br>
              Верхний полумесяц: центр ≈ (0, 0.5)<br>
              Нижний полумесяц: центр ≈ (1, −0.5)<br><br>
              K-Means разделит плоскость по линии, равноудалённой от центров<br>
              Эта линия разрежет оба полумесяца пополам<br>
              Левая половина верхней луны → кластер 1<br>
              Правая половина нижней луны → кластер 1 (ошибка!)
            </div>
            <div class="why">K-Means предполагает шаровидные кластеры. Луны не шаровидные — граница Вороного не соответствует истинной границе.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: почему DBSCAN справится</h4>
            <div class="calc">
              DBSCAN следует плотности данных<br><br>
              Точка на верхнем полумесяце: её eps-соседи — другие точки<br>
              того же полумесяца (они близко вдоль кривой)<br><br>
              Точки разных лун: расстояние между ними > eps<br>
              (луны «не касаются» в пространстве)<br><br>
              Алгоритм: начать с любой core-точки, расширять кластер<br>
              по density-reachability → обходит весь полумесяц<br>
              но не перепрыгивает на другой (gap > eps)
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: выбор eps критичен</h4>
            <div class="calc">
              eps = 0.1 (слишком мало): луны разбиваются на много мелких кластеров<br>
              eps = 0.3 (оптимум): две луны, 2-5 шумовых точек<br>
              eps = 0.5 (слишком много): обе луны сливаются в один кластер<br><br>
              Типичный разрыв между лунами: 0.15–0.25<br>
              eps должен быть меньше разрыва, но больше внутрикластерного расстояния
            </div>
            <div class="why">DBSCAN чувствителен к eps. На данных с разной плотностью кластеров нужен HDBSCAN (иерархический вариант).</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>K-Means: ~50% accuracy (разрезает луны). DBSCAN (eps=0.3, minPts=5): ~97% accuracy. DBSCAN идеален для произвольных форм. K-Means — только для шаровидных кластеров.</p>
          </div>
          <div class="lesson-box">
            DBSCAN vs K-Means: DBSCAN лучше при произвольных формах, шуме, неизвестном k. K-Means быстрее O(n·k·iter) vs O(n²) у DBSCAN. Для больших данных: HDBSCAN (иерархический) или ANN-ускоренный DBSCAN.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: DBSCAN в действии</h3>
        <p>Меняй eps и min_samples. Чёрные точки — шум.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dbs-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dbs-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="dbs-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="dbs-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dbs-controls');
        const cEps = App.makeControl('range', 'dbs-eps', 'eps', { min: 0.02, max: 0.25, step: 0.005, value: 0.07 });
        const cMin = App.makeControl('range', 'dbs-min', 'min_samples', { min: 2, max: 15, step: 1, value: 4 });
        const cShape = App.makeControl('select', 'dbs-shape', 'Форма', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'circles', label: 'Круги' }, { value: 'blobs', label: 'Кластеры' }, { value: 'spiral', label: 'Спирали' }],
          value: 'moons',
        });
        const cNoise = App.makeControl('range', 'dbs-noise', 'Шум', { min: 0, max: 50, step: 5, value: 15 });
        [cEps, cMin, cShape, cNoise].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#dbs-canvas');
        const ctx = canvas.getContext('2d');
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];
        let points = [];
        let labels = [];

        function genData() {
          const shape = cShape.input.value;
          const nn = +cNoise.input.value;
          points = [];
          if (shape === 'moons') {
            for (let i = 0; i < 100; i++) {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) points.push({ x: 0.3 + 0.2 * Math.cos(t) + App.Util.randn(0, 0.02), y: 0.4 + 0.2 * Math.sin(t) + App.Util.randn(0, 0.02) });
              else points.push({ x: 0.5 + 0.2 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.02), y: 0.5 - 0.2 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.02) });
            }
          } else if (shape === 'circles') {
            for (let i = 0; i < 100; i++) {
              const t = Math.random() * 2 * Math.PI;
              const r = Math.random() < 0.5 ? 0.15 : 0.35;
              points.push({ x: 0.5 + r * Math.cos(t) + App.Util.randn(0, 0.015), y: 0.5 + r * Math.sin(t) + App.Util.randn(0, 0.015) });
            }
          } else if (shape === 'blobs') {
            const centers = [[0.25, 0.3], [0.7, 0.35], [0.5, 0.75]];
            centers.forEach(c => { for (let i = 0; i < 40; i++) points.push({ x: c[0] + App.Util.randn(0, 0.05), y: c[1] + App.Util.randn(0, 0.05) }); });
          } else {
            for (let i = 0; i < 100; i++) {
              const t = i / 50 * 2 * Math.PI;
              const r = 0.05 + i / 250;
              if (i < 50) points.push({ x: 0.5 + r * Math.cos(t) + App.Util.randn(0, 0.015), y: 0.5 + r * Math.sin(t) + App.Util.randn(0, 0.015) });
              else points.push({ x: 0.5 - r * Math.cos(t) + App.Util.randn(0, 0.015), y: 0.5 - r * Math.sin(t) + App.Util.randn(0, 0.015) });
            }
          }
          for (let i = 0; i < nn; i++) points.push({ x: Math.random(), y: Math.random() });
          run();
        }

        function run() {
          const eps = +cEps.input.value, minS = +cMin.input.value;
          labels = new Array(points.length).fill(-1); // -1 = unvisited
          let cluster = 0;
          const UNCLASSIFIED = -1, NOISE = -2;
          for (let i = 0; i < points.length; i++) labels[i] = UNCLASSIFIED;

          function neighbors(i) {
            const out = [];
            for (let j = 0; j < points.length; j++) {
              const d = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2);
              if (d <= eps) out.push(j);
            }
            return out;
          }

          for (let i = 0; i < points.length; i++) {
            if (labels[i] !== UNCLASSIFIED) continue;
            const N = neighbors(i);
            if (N.length < minS) { labels[i] = NOISE; continue; }
            labels[i] = cluster;
            const queue = [...N];
            while (queue.length) {
              const q = queue.shift();
              if (labels[q] === NOISE) labels[q] = cluster;
              if (labels[q] !== UNCLASSIFIED) continue;
              labels[q] = cluster;
              const Nq = neighbors(q);
              if (Nq.length >= minS) Nq.forEach(x => { if (labels[x] === UNCLASSIFIED || labels[x] === NOISE) queue.push(x); });
            }
            cluster++;
          }
          draw();
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const eps = +cEps.input.value;
          // eps-радиусы для первых нескольких core-точек (для иллюстрации)
          ctx.strokeStyle = 'rgba(148,163,184,0.25)';
          ctx.lineWidth = 1;
          const shown = new Set();
          points.forEach((p, i) => {
            if (labels[i] >= 0 && shown.size < 5 && !shown.has(labels[i])) {
              shown.add(labels[i]);
              ctx.beginPath();
              ctx.arc(p.x * W, p.y * H, eps * W, 0, 2 * Math.PI);
              ctx.stroke();
            }
          });
          points.forEach((p, i) => {
            const lab = labels[i];
            ctx.fillStyle = lab === -2 ? '#0f172a' : colors[lab % colors.length];
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, lab === -2 ? 3 : 5, 0, 2 * Math.PI);
            ctx.fill();
            if (lab !== -2) ctx.stroke();
          });

          const nClusters = new Set(labels.filter(l => l >= 0)).size;
          const nNoise = labels.filter(l => l === -2).length;
          container.querySelector('#dbs-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Кластеров</div><div class="stat-value">${nClusters}</div></div>
            <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${points.length}</div></div>
            <div class="stat-card"><div class="stat-label">Шум</div><div class="stat-value">${nNoise}</div></div>
            <div class="stat-card"><div class="stat-label">eps</div><div class="stat-value">${eps.toFixed(3)}</div></div>
          `;
        }

        [cEps, cMin].forEach(c => c.input.addEventListener('input', run));
        [cShape, cNoise].forEach(c => c.input.addEventListener('change', genData));
        container.querySelector('#dbs-regen').onclick = genData;

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Geospatial</b> — кластеры такси, торговых точек.</li>
        <li><b>Anomaly detection</b> — точки, помеченные как шум.</li>
        <li><b>Сегментация изображений</b> — похожие пиксели.</li>
        <li><b>Микроархитектура</b> — группировка событий в логах.</li>
        <li><b>Астрономия</b> — поиск звёздных скоплений.</li>
        <li><b>Биология</b> — группировка экспрессии генов.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Не нужно знать число кластеров</li>
            <li>Находит кластеры любой формы</li>
            <li>Автоматически выделяет шум</li>
            <li>Устойчив к выбросам</li>
            <li>Один проход по данным</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Плохо работает при разной плотности кластеров</li>
            <li>Чувствителен к eps</li>
            <li>Не работает в высоких размерностях</li>
            <li>Требует выбора eps и min_samples</li>
            <li>Граничные точки могут быть в разных кластерах</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Определения</h3>
      <ul>
        <li><b>ε-окрестность</b>: $N_\\epsilon(p) = \\{q \\in D : d(p, q) \\leq \\epsilon\\}$</li>
        <li><b>Core point</b>: $|N_\\epsilon(p)| \\geq \\text{minPts}$</li>
        <li><b>Directly density-reachable</b>: q достижима из p напрямую, если p core и $q \\in N_\\epsilon(p)$.</li>
        <li><b>Density-reachable</b>: есть цепочка $p = p_1, p_2, \\dots, p_n = q$ из direct достижений.</li>
        <li><b>Density-connected</b>: существует o, из которого density-reachable и p, и q.</li>
      </ul>

      <h3>Формальное определение кластера</h3>
      <p>Кластер C ⊆ D удовлетворяет:</p>
      <ol>
        <li><b>Maximality</b>: если $p \\in C$ и q density-reachable из p, то $q \\in C$.</li>
        <li><b>Connectivity</b>: $\\forall p, q \\in C$, они density-connected.</li>
      </ol>

      <h3>Сложность</h3>
      <ul>
        <li>Наивно: $O(n^2)$.</li>
        <li>С KD-tree / R-tree: $O(n \\log n)$.</li>
      </ul>

      <h3>Выбор ε через k-distance plot</h3>
      <p>Для каждой точки найти расстояние до k-го ближайшего соседа (k = min_samples). Отсортировать. «Колено» графика — хорошее значение ε.</p>
    `,

    extra: `
      <h3>HDBSCAN — эволюция DBSCAN</h3>
      <p>Автоматически определяет разные плотности, не требует eps. Строит иерархию кластеров и выбирает стабильные.</p>

      <h3>OPTICS</h3>
      <p>Расширение DBSCAN: создаёт упорядочивание точек, из которого можно извлечь кластеризацию для любого ε.</p>

      <h3>Сравнение с K-Means</h3>
      <table>
        <tr><th></th><th>K-Means</th><th>DBSCAN</th></tr>
        <tr><td>Форма кластеров</td><td>Сферические</td><td>Любая</td></tr>
        <tr><td>Число кластеров</td><td>Задаётся</td><td>Определяется</td></tr>
        <tr><td>Шум</td><td>Все точки в кластерах</td><td>Явно выделяется</td></tr>
        <tr><td>Разные плотности</td><td>Нормально</td><td>Плохо</td></tr>
        <tr><td>Масштабируемость</td><td>Хорошая</td><td>Средняя</td></tr>
      </table>

      <h3>Настройка параметров</h3>
      <ul>
        <li>min_samples = 4 как дефолт для 2D.</li>
        <li>min_samples = 2·dim для высоких размерностей.</li>
        <li>ε выбирать по k-distance plot.</li>
        <li>Масштабировать признаки перед DBSCAN!</li>
      </ul>

      <h3>Границы применимости</h3>
      <ul>
        <li>Плохо при dim > 10-20 — проклятие размерности.</li>
        <li>Плохо при сильно разной плотности кластеров.</li>
        <li>Нужно искать компромиссный ε.</li>
      </ul>
    `,
  },
});
