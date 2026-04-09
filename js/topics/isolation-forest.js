/* ==========================================================================
   Isolation Forest
   ========================================================================== */
App.registerTopic({
  id: 'isolation-forest',
  category: 'ml-unsup',
  title: 'Isolation Forest',
  summary: 'Аномалии изолируются быстрее нормальных точек случайными разбиениями.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь игру «найди лишнего» в зале людей. Если все одеты одинаково, кроме одного в ярком костюме — выделить его легко. <b>Одним вопросом</b>: «кто в красном?» — и он найден.</p>
        <p>Если пытаться найти обычного человека в толпе, задавать вопросы придётся долго: «кто в синих джинсах?» (половина толпы), «у кого тёмные волосы?» (четверть), «кто в свитере?» и так далее. <b>Много вопросов</b> нужно, чтобы описать кого-то «обычного».</p>
        <p>Isolation Forest работает так же: задаёт случайные вопросы о признаках, и смотрит, сколько вопросов нужно, чтобы <b>изолировать</b> точку. Аномалии изолируются за <b>несколько</b> вопросов, нормальные точки — за много. Чем меньше вопросов — тем подозрительнее точка.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <text x="250" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Isolation Forest: аномалии изолируются быстро</text>
          <!-- Background -->
          <rect x="25" y="25" width="450" height="160" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <!-- Dense cluster of normal points -->
          <circle cx="140" cy="85" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="160" cy="70" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="175" cy="100" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="155" cy="110" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="130" cy="105" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="150" cy="80" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="170" cy="115" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="145" cy="125" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="120" cy="90" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="185" cy="85" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="135" cy="70" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="165" cy="130" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="195" cy="105" r="6" fill="#6366f1" opacity="0.75"/>
          <circle cx="115" cy="115" r="6" fill="#6366f1" opacity="0.75"/>
          <!-- Splits isolating normal points (many splits needed) -->
          <line x1="210" y1="25" x2="210" y2="185" stroke="#64748b" stroke-width="1" opacity="0.4"/>
          <line x1="100" y1="55" x2="100" y2="185" stroke="#64748b" stroke-width="1" opacity="0.4"/>
          <line x1="100" y1="55" x2="210" y2="55" stroke="#64748b" stroke-width="1" opacity="0.4"/>
          <line x1="100" y1="145" x2="210" y2="145" stroke="#64748b" stroke-width="1" opacity="0.4"/>
          <text x="155" y="165" text-anchor="middle" font-size="9" fill="#64748b">много разбиений</text>
          <!-- Outlier point (far away, red) -->
          <circle cx="400" cy="70" r="9" fill="#ef4444"/>
          <text x="400" y="50" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="600">АНОМАЛИЯ</text>
          <!-- Quick splits isolating outlier (few, bold) -->
          <line x1="340" y1="25" x2="340" y2="185" stroke="#ef4444" stroke-width="1.5" opacity="0.6"/>
          <line x1="340" y1="115" x2="470" y2="115" stroke="#ef4444" stroke-width="1.5" opacity="0.6"/>
          <text x="400" y="150" text-anchor="middle" font-size="9" fill="#ef4444">2 разбиения!</text>
          <!-- Split count labels -->
          <text x="155" y="190" text-anchor="middle" font-size="9" fill="#6366f1">глубина: 8+ → норма</text>
          <text x="400" y="190" text-anchor="middle" font-size="9" fill="#ef4444">глубина: 2 → аномалия</text>
        </svg>
        <div class="caption">Isolation Forest: нормальные точки (синие) требуют многих случайных разбиений для изоляции. Аномалия (красная) изолируется за 1-2 разбиения — это сигнал её ненормальности.</div>
      </div>

      <h3>🔍 Задача поиска аномалий</h3>
      <p><b>Аномалия (outlier)</b> — это наблюдение, которое сильно отличается от большинства данных. Примеры:</p>
      <ul>
        <li>Мошенническая транзакция среди обычных покупок.</li>
        <li>Аномальная температура у пациента.</li>
        <li>Подозрительный сетевой трафик.</li>
        <li>Брак на производстве.</li>
        <li>Ошибка ввода данных.</li>
      </ul>

      <p>Это задача <span class="term" data-tip="Anomaly Detection. Обнаружение аномалий — задача поиска редких и необычных наблюдений в данных. Часто unsupervised, без разметки.">детекции аномалий</span>. Обычно аномалий мало (1% или меньше), и они сильно отличаются от нормы.</p>

      <h3>💡 Необычный подход Isolation Forest</h3>
      <p>Классические методы детекции аномалий строят «модель нормы» и проверяют, насколько точка от неё отличается:</p>
      <ul>
        <li><b>Density-based:</b> аномалии в областях низкой плотности (DBSCAN, LOF).</li>
        <li><b>Distance-based:</b> аномалии далеко от всех (kNN).</li>
        <li><b>Statistical:</b> точки > 3σ от среднего.</li>
      </ul>

      <p>Isolation Forest идёт <b>с другого конца</b>: он не пытается описать норму. Он пытается <b>изолировать</b> каждую точку. Идея: аномалии <b>легко изолируются</b>, потому что они редкие и расположены «в стороне».</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Строим много случайных деревьев, в каждом делаем случайные разбиения пространства. Для каждой точки меряем <b>глубину</b>, на которой она осталась одна (изолировалась). <b>Аномалии изолируются на маленькой глубине</b>, нормальные точки — глубоко. Это — мера аномальности.</p>
      </div>

      <h3>🌲 Как строится iTree (Isolation Tree)</h3>
      <p>Одно дерево строится так:</p>
      <ol>
        <li>Берём подвыборку данных (обычно 256 точек).</li>
        <li>Выбираем <b>случайный</b> признак.</li>
        <li>Выбираем <b>случайный</b> порог из диапазона этого признака.</li>
        <li>Разбиваем: точки с меньшими значениями — налево, большие — направо.</li>
        <li>Повторяем рекурсивно для каждой подгруппы.</li>
        <li>Останавливаемся, когда каждая точка одна в листе или достигнута максимальная глубина.</li>
      </ol>

      <p><b>Обрати внимание:</b> никакой оптимизации, никакого выбора «лучшего» сплита — просто случайность. Это и есть магия алгоритма.</p>

      <h3>📊 Мера аномальности</h3>
      <p>Для каждой точки считаем <b>глубину</b>, на которой она попала в отдельный лист. Усредняем по лесу (обычно 100 деревьев):</p>

      <p>Нормируем:</p>
      <div class="math-block">$$s(x, n) = 2^{-\\frac{E[h(x)]}{c(n)}}$$</div>
      <p>Где $E[h(x)]$ — средняя глубина изоляции, $c(n)$ — нормировочная константа (ожидаемая глубина в случайном дереве).</p>

      <p><b>Интерпретация score:</b></p>
      <ul>
        <li><b>s близко к 1:</b> глубина очень маленькая → <b>аномалия</b>.</li>
        <li><b>s около 0.5:</b> нельзя однозначно сказать.</li>
        <li><b>s близко к 0:</b> глубина большая → <b>норма</b>.</li>
      </ul>

      <h3>🔍 Почему это работает</h3>
      <p>Интуиция: случайный сплит <b>с большей вероятностью</b> отделит изолированную точку. Если точка «сидит» в плотной области — у неё много соседей, случайный сплит скорее всего их не разделит. Если точка <b>далеко от других</b>, любой сплит может её изолировать.</p>
      <p>Формально: математическое ожидание глубины изоляции аномалии < ожидания для нормальной точки.</p>

      <h3>⚙️ Гиперпараметры</h3>
      <ul>
        <li><b>n_estimators</b> — число деревьев (обычно 100). Больше — точнее, но медленнее.</li>
        <li><b>max_samples</b> — размер подвыборки для каждого дерева. Стандарт — 256. Больше не помогает.</li>
        <li><b>contamination</b> — ожидаемая доля аномалий. Нужна для автоматического выбора порога.</li>
        <li><b>max_features</b> — сколько признаков рассматривать (по умолчанию все).</li>
      </ul>

      <h3>🎯 Как установить порог аномальности</h3>
      <p>Score — это относительная оценка. Чтобы получить бинарный «аномалия / норма», нужен <b>порог</b>:</p>
      <ul>
        <li>Задаём <b>contamination</b> (например, 0.05 — ожидаем 5% аномалий).</li>
        <li>Алгоритм считает score для всех точек.</li>
        <li>Топ 5% по score помечаются аномалиями.</li>
      </ul>

      <p>Если не знаешь contamination — строй гистограмму scores и выбирай порог вручную.</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Линейная сложность</b> O(n log n) — масштабируется на большие данные.</li>
        <li>Не требует вычисления <b>расстояний</b>.</li>
        <li>Хорошо работает в <b>высоких размерностях</b>.</li>
        <li><b>Параллелится</b> — каждое дерево независимо.</li>
        <li>Мало гиперпараметров.</li>
        <li><b>Unsupervised</b> — не нужны размеченные аномалии.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Случайный алгоритм</b> — результаты могут варьироваться.</li>
        <li><b>Axis-parallel splits</b> — плохо с «косыми» аномалиями.</li>
        <li>Нужно знать (или угадать) contamination.</li>
        <li>Плохо при <b>кластерных аномалиях</b> (много аномалий рядом).</li>
        <li>Может ошибочно помечать нормальные точки в разреженных областях.</li>
      </ul>

      <h3>🔧 Применения</h3>
      <ul>
        <li><b>Fraud detection</b> — банковские транзакции, страхование.</li>
        <li><b>Сетевая безопасность</b> — аномальный трафик, вторжения.</li>
        <li><b>Мониторинг систем</b> — аномальные метрики серверов.</li>
        <li><b>Manufacturing</b> — детекция дефектов.</li>
        <li><b>Medical</b> — аномальные анализы.</li>
        <li><b>Data cleaning</b> — поиск ошибок в данных перед ML.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Score — это вероятность»</b> — нет, это относительный ранг.</li>
        <li><b>«Isolation Forest работает без настройки»</b> — в большинстве случаев да, но порог важен.</li>
        <li><b>«Чем глубже дерево, тем лучше»</b> — нет, max_depth ограничивают.</li>
        <li><b>«IF универсален»</b> — плохо ловит кластерные аномалии или локальные выбросы.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: нормировочная константа</summary>
        <div class="deep-dive-body">
          <p>Для правильной нормализации используется ожидаемая глубина в случайном BST:</p>
          <div class="math-block">$$c(n) = 2H(n-1) - \\frac{2(n-1)}{n}$$</div>
          <p>где $H(i) = \\ln(i) + 0.5772$ (гармоническое число).</p>
          <p>Это позволяет сравнивать глубины для датасетов разного размера.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Extended Isolation Forest</summary>
        <div class="deep-dive-body">
          <p>Обычный Isolation Forest использует <b>axis-parallel</b> сплиты (по одной координате). Это создаёт характерные артефакты — «полосы» в score.</p>
          <p><b>Extended Isolation Forest</b> решает это: вместо порога на одной оси использует случайную <b>гиперплоскость</b> с произвольными наклонами. Даёт более гладкие и точные scores.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: альтернативы для аномалий</summary>
        <div class="deep-dive-body">
          <table>
            <tr><th>Метод</th><th>Идея</th><th>Когда лучше</th></tr>
            <tr><td>Isolation Forest</td><td>Изолировать</td><td>Tabular, высокая размерность</td></tr>
            <tr><td>LOF</td><td>Локальная плотность</td><td>Разная плотность кластеров</td></tr>
            <tr><td>One-Class SVM</td><td>Граница нормы</td><td>Небольшие данные, известна норма</td></tr>
            <tr><td>Autoencoder</td><td>Reconstruction error</td><td>Изображения, сигналы</td></tr>
            <tr><td>Z-score</td><td>σ от среднего</td><td>1D, нормальные данные</td></tr>
            <tr><td>DBSCAN</td><td>Точки вне кластеров</td><td>Низкая размерность</td></tr>
          </table>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Random Forest</b> — общая идея с рандомизированными деревьями.</li>
        <li><b>Decision Tree</b> — основа Isolation Forest.</li>
        <li><b>DBSCAN</b> — альтернативный метод для аномалий.</li>
        <li><b>Дисбаланс классов</b> — аномалии это экстремальный дисбаланс.</li>
        <li><b>One-Class SVM</b> — другой unsupervised метод для аномалий.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Изоляция аномалии за 2 шага',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>На 1D данных показать, почему аномалия изолируется быстрее нормальных точек, и что такое path length.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>Значение</th><th>Тип</th></tr>
              <tr><td>P1</td><td>1</td><td>Нормальная</td></tr>
              <tr><td>P2</td><td>2</td><td>Нормальная</td></tr>
              <tr><td>P3</td><td>3</td><td>Нормальная</td></tr>
              <tr><td>P4</td><td>4</td><td>Нормальная</td></tr>
              <tr><td>P5</td><td>5</td><td>Нормальная</td></tr>
              <tr><td>P6</td><td>6</td><td>Нормальная</td></tr>
              <tr><td>P7</td><td>7</td><td>Нормальная</td></tr>
              <tr><td>P8</td><td>8</td><td>Нормальная</td></tr>
              <tr><td>P9</td><td>9</td><td>Нормальная</td></tr>
              <tr><td>A</td><td>100</td><td><b>Аномалия</b></td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: первое случайное разбиение</h4>
            <div class="calc">
              Диапазон данных: [1, 100]<br>
              Случайный порог t₁: равновероятно из [1, 100]<br><br>
              Вероятность t₁ > 9 (изолирует аномалию сразу): 91/99 ≈ <b>91.9%</b><br>
              Пример: t₁ = 50<br>
              Левая ветка: P1..P9 (9 точек в диапазоне [1, 9])<br>
              Правая ветка: A (1 точка в диапазоне [50, 100])<br><br>
              A изолирована на глубине 1!<br>
              Нормальные точки нужно разделять дальше...
            </div>
            <div class="why">Аномалия «одна» в своей части пространства → любой порог > 9 её изолирует. Нормальные точки плотно упакованы → нужно много разбиений.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: второе разбиение для нормальных точек</h4>
            <div class="calc">
              Осталось: P1..P9 в [1, 9]<br>
              Случайный порог t₂ из [1, 9]<br>
              Пример: t₂ = 5<br><br>
              Левая: P1,P2,P3,P4 (диапазон [1,5])<br>
              Правая: P5,P6,P7,P8,P9 (диапазон [5,9])<br><br>
              Нужно ещё 2-3 разбиения, чтобы изолировать отдельные нормальные точки<br>
              Ожидаемая глубина нормальных: ~log₂(9) ≈ 3-4 уровня
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: path length и anomaly score</h4>
            <div class="calc">
              Path length h(x) = глубина листа, где изолирована точка<br><br>
              Аномалия A: в большинстве деревьев h(A) = 1 или 2<br>
              Средняя h̄(A) ≈ 1.5<br><br>
              Нормальная P5: h(P5) ≈ 3-4 в разных деревьях<br>
              Средняя h̄(P5) ≈ 3.5<br><br>
              Ожидаемая глубина для n=10, c(n) = 2H(9) − 2·9/10 ≈ 4.0<br><br>
              score(A) = 2^(−1.5/4.0) = 2^(−0.375) ≈ <b>0.772</b><br>
              score(P5) = 2^(−3.5/4.0) = 2^(−0.875) ≈ <b>0.546</b>
            </div>
            <div class="why">score ∈ (0, 1]. Чем ближе к 1 — тем больше аномалия. score ≈ 0.5 → нормальная точка. score > 0.7 → вероятная аномалия.</div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Isolation Forest: аномалия изолируется быстрее</text>
              <!-- Main rectangle -->
              <rect x="30" y="28" width="400" height="116" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
              <!-- First split: t1=50 (vertical line) -->
              <line x1="175" y1="28" x2="175" y2="144" stroke="#3b82f6" stroke-width="2"/>
              <text x="103" y="24" text-anchor="middle" font-size="9" fill="#3b82f6">t₁ = 50</text>
              <!-- Left half label (normal cluster) -->
              <rect x="35" y="34" width="133" height="104" rx="4" fill="#dbeafe" fill-opacity="0.4"/>
              <text x="102" y="60" text-anchor="middle" font-size="9" fill="#64748b">Нормальные точки</text>
              <text x="102" y="72" text-anchor="middle" font-size="9" fill="#64748b">P1..P9 (значения 1-9)</text>
              <!-- Normal dots in left half -->
              <circle cx="48" cy="95" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="62" cy="88" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="76" cy="100" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="90" cy="82" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="104" cy="95" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="118" cy="86" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="132" cy="100" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="146" cy="90" r="5" fill="#3b82f6" opacity="0.7"/>
              <circle cx="160" cy="82" r="5" fill="#3b82f6" opacity="0.7"/>
              <!-- Second split inside left: t2=5 -->
              <line x1="103" y1="28" x2="103" y2="144" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="5,3"/>
              <text x="70" y="126" text-anchor="middle" font-size="8" fill="#3b82f6">t₂=5</text>
              <!-- Third split indication -->
              <line x1="68" y1="68" x2="68" y2="144" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
              <text x="50" y="120" text-anchor="middle" font-size="7" fill="#64748b">t₃</text>
              <text x="50" y="130" text-anchor="middle" font-size="7" fill="#64748b">t₄...</text>
              <text x="50" y="140" text-anchor="middle" font-size="7" fill="#64748b">глубина~4</text>
              <!-- Right half: anomaly isolated -->
              <rect x="180" y="34" width="244" height="104" rx="4" fill="#fee2e2" fill-opacity="0.3"/>
              <text x="302" y="60" text-anchor="middle" font-size="9" fill="#64748b">После первого сплита:</text>
              <text x="302" y="72" text-anchor="middle" font-size="9" fill="#64748b">аномалия ОДНА</text>
              <!-- Anomaly dot -->
              <circle cx="302" cy="95" r="10" fill="#ef4444" stroke="#991b1b" stroke-width="2.5"/>
              <text x="302" y="92" text-anchor="middle" font-size="8" fill="#fff">A</text>
              <text x="302" y="107" text-anchor="middle" font-size="8" fill="#ef4444">100</text>
              <!-- Isolation box around anomaly -->
              <rect x="255" y="66" width="95" height="60" rx="4" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3"/>
              <text x="302" y="138" text-anchor="middle" font-size="8" fill="#ef4444">глубина = 1</text>
              <!-- Labels -->
              <text x="102" y="155" text-anchor="middle" font-size="9" fill="#3b82f6">score ≈ 0.55 (норм.)</text>
              <text x="302" y="155" text-anchor="middle" font-size="9" fill="#ef4444">score ≈ 0.77 (аномалия)</text>
            </svg>
            <div class="caption">Прямоугольник — пространство данных. Первый сплит t₁=50 сразу изолирует аномалию A=100 (справа, глубина 1). Нормальные точки требуют ещё 3-4 сплита. Anomaly score пропорционален обратной глубине изоляции.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Аномалия A=100 изолируется за 1-2 шага (score≈0.77). Нормальные точки [1-9] изолируются за 3-4 шага (score≈0.55). Разница в глубинах — основа детекции аномалий.</p>
          </div>
          <div class="lesson-box">
            Isolation Forest не требует обучения «что нормально» — он опирается только на структуру данных. Поэтому это unsupervised метод. Работает даже без меток аномалий.
          </div>
        `,
      },
      {
        title: 'Вычисление Anomaly Score',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По средним path length из 5 деревьев вычислить anomaly score для нескольких точек и интерпретировать результат.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Точка</th><th>h (Дерево 1)</th><th>h (Дерево 2)</th><th>h (Дерево 3)</th><th>h (Дерево 4)</th><th>h (Дерево 5)</th><th>h̄(x)</th></tr>
              <tr><td>A (аномалия)</td><td>2</td><td>1</td><td>2</td><td>1</td><td>2</td><td>1.6</td></tr>
              <tr><td>B (граничная)</td><td>4</td><td>3</td><td>5</td><td>4</td><td>3</td><td>3.8</td></tr>
              <tr><td>C (нормальная)</td><td>6</td><td>7</td><td>5</td><td>8</td><td>6</td><td>6.4</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить c(n) — нормировочную константу</h4>
            <div class="calc">
              n = 256 (размер выборки), subsampling_size обычно 256<br><br>
              c(n) = 2H(n−1) − 2(n−1)/n<br>
              H(n) ≈ ln(n) + 0.5772 (гармоническое число)<br><br>
              H(255) = ln(255) + 0.5772 ≈ 5.541 + 0.577 = 6.118<br>
              c(256) = 2·6.118 − 2·255/256<br>
              = 12.236 − 1.992 = <b>10.244</b>
            </div>
            <div class="why">c(n) — ожидаемая глубина случайного BST для n точек. Нормировка делает score сопоставимым при разных размерах датасета.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить anomaly score</h4>
            <div class="calc">
              s(x) = 2^(−h̄(x) / c(n))<br><br>
              Аномалия A: h̄ = 1.6<br>
              s(A) = 2^(−1.6/10.244) = 2^(−0.1562) ≈ <b>0.897</b><br><br>
              Граничная B: h̄ = 3.8<br>
              s(B) = 2^(−3.8/10.244) = 2^(−0.3711) ≈ <b>0.774</b><br><br>
              Нормальная C: h̄ = 6.4<br>
              s(C) = 2^(−6.4/10.244) = 2^(−0.6249) ≈ <b>0.648</b>
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: интерпретация score</h4>
            <div class="calc">
              s ≈ 1.0: аномалия (очень малая глубина изоляции)<br>
              s ≈ 0.5: нормальная точка (глубина ≈ c(n))<br>
              s &lt; 0.5: «анти-аномалия» (очень глубоко, очень нормальная)<br><br>
              Точка A: s=0.897 → сильная аномалия<br>
              Точка B: s=0.774 → подозрительная<br>
              Точка C: s=0.648 → нормальная<br><br>
              При contamination=0.1: порог = 10-й персентиль score<br>
              Если top-10% по score включает A и B → оба аномалии
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>score(A)=0.897, score(B)=0.774, score(C)=0.648. При пороге contamination=5% → только A (score>0.85). При 15% → A и B. Порог зависит от ожидаемой доли аномалий в данных.</p>
          </div>
          <div class="lesson-box">
            Формула s(x) = 2^(−h̄/c(n)): при h̄=c(n) → s=2^(−1)=0.5 (нейтральная точка). При h̄→0 → s→1 (аномалия). При h̄→∞ → s→0 (очень нормальная). Среднее по дереву учитывает и листовые узлы с несколькими точками.
          </div>
        `,
      },
      {
        title: 'Выбор contamination',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как выбор параметра contamination влияет на порог обнаружения, и как подбирать его при разных сценариях.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Rank</th><th>Score</th><th>contamination=0.05</th><th>contamination=0.10</th><th>contamination=0.20</th></tr>
              <tr><td>1</td><td>0.92</td><td>Аномалия</td><td>Аномалия</td><td>Аномалия</td></tr>
              <tr><td>2</td><td>0.89</td><td>Аномалия</td><td>Аномалия</td><td>Аномалия</td></tr>
              <tr><td>3</td><td>0.85</td><td>Аномалия</td><td>Аномалия</td><td>Аномалия</td></tr>
              <tr><td>4</td><td>0.79</td><td>—</td><td>Аномалия</td><td>Аномалия</td></tr>
              <tr><td>5</td><td>0.74</td><td>—</td><td>Аномалия</td><td>Аномалия</td></tr>
              <tr><td>6–10</td><td>0.65–0.70</td><td>—</td><td>—</td><td>Аномалия</td></tr>
              <tr><td>11–20</td><td>0.55–0.64</td><td>—</td><td>—</td><td>—</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: как contamination задаёт порог</h4>
            <div class="calc">
              n = 20 точек, contamination = 0.05<br>
              Кол-во аномалий: 20 · 0.05 = 1 точка<br>
              Но обычно берут топ 5% по score<br><br>
              Порог = 95-й персентиль score<br>
              Аномалии = точки с score > порога<br><br>
              contamination = 0.05: топ 5% = 1 точка (rank 1)<br>
              contamination = 0.10: топ 10% = 2 точки (rank 1-2)<br>
              contamination = 0.20: топ 20% = 4 точки (rank 1-4)
            </div>
            <div class="why">contamination — гиперпараметр, задающий «агрессивность» детектора. Нет правильного ответа без знания истинной доли аномалий.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: стратегии выбора contamination</h4>
            <div class="calc">
              Стратегия 1: доменные знания<br>
              «Знаем, что ~5% транзакций — мошенничество» → contamination=0.05<br><br>
              Стратегия 2: гистограмма score<br>
              Строим гистограмму score: видим бимодальное распределение<br>
              Пик около 0.5–0.6: нормальные | Хвост 0.75+: аномалии<br>
              Выбираем порог в «долине» между пиками<br><br>
              Стратегия 3: бизнес-ограничения<br>
              «Команда может проверять 50 подозрительных в день»<br>
              contamination = 50/n
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: использование raw scores вместо бинарной метки</h4>
            <div class="calc">
              Вместо бинарного (аномалия/нет) → использовать score напрямую<br>
              Сортировать по score → проверять вручную от наибольшего<br><br>
              model.score_samples(X) → массив score<br>
              (в sklearn score = −s(x), т.е. более отрицательный = аномалия)<br><br>
              Это гибче: не нужно фиксировать порог заранее<br>
              Аналитик сам решает, где «отрезать»
            </div>
            <div class="why">В реальных системах обычно используют score-based ranking, а не бинарное предсказание. Порог устанавливается по бизнес-требованиям.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>contamination=0.05: только самые явные аномалии (score>0.88). contamination=0.20: 4x больше подозрительных. Лучшая практика: использовать score напрямую и строить гистограмму для диагностики.</p>
          </div>
          <div class="lesson-box">
            Если нет меток: Isolation Forest → score → выбор порога по гистограмме или k-distance plot. Если есть немного меток: можно подбирать contamination через precision@k (сколько из топ-k реально аномалии).
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: поиск аномалий</h3>
        <p>Нормальные точки в двух кластерах + случайные выбросы. Цвет показывает score — красное = аномалия.</p>
        <div class="sim-container">
          <div class="sim-controls" id="if-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="if-regen">🔄 Новые данные</button>
            <button class="btn secondary" id="if-rebuild">🌲 Пересчитать лес</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="if-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="if-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#if-controls');
        const cTrees = App.makeControl('range', 'if-trees', 'Число деревьев', { min: 10, max: 200, step: 10, value: 50 });
        const cDepth = App.makeControl('range', 'if-depth', 'Макс. глубина', { min: 4, max: 15, step: 1, value: 8 });
        const cN = App.makeControl('range', 'if-n', 'Нормальных точек', { min: 50, max: 300, step: 10, value: 150 });
        const cOut = App.makeControl('range', 'if-out', 'Выбросов', { min: 0, max: 30, step: 1, value: 10 });
        const cCont = App.makeControl('range', 'if-cont', 'contamination', { min: 0.01, max: 0.3, step: 0.01, value: 0.08 });
        [cTrees, cDepth, cN, cOut, cCont].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#if-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let scores = [];

        function genData() {
          const n = +cN.input.value;
          const nOut = +cOut.input.value;
          points = [];
          for (let i = 0; i < n / 2; i++) {
            points.push({ x: 0.3 + App.Util.randn(0, 0.07), y: 0.35 + App.Util.randn(0, 0.07), truth: 0 });
          }
          for (let i = 0; i < n / 2; i++) {
            points.push({ x: 0.7 + App.Util.randn(0, 0.07), y: 0.65 + App.Util.randn(0, 0.07), truth: 0 });
          }
          for (let i = 0; i < nOut; i++) {
            points.push({ x: 0.05 + 0.9 * Math.random(), y: 0.05 + 0.9 * Math.random(), truth: 1 });
          }
        }

        function buildITree(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length <= 1) {
            return { leaf: true, size: items.length, depth };
          }
          // выбираем случайный признак и случайный порог
          const feat = Math.random() < 0.5 ? 'x' : 'y';
          const vals = items.map(p => p[feat]);
          const lo = Math.min(...vals), hi = Math.max(...vals);
          if (lo === hi) return { leaf: true, size: items.length, depth };
          const thr = lo + Math.random() * (hi - lo);
          const L = items.filter(p => p[feat] < thr);
          const R = items.filter(p => p[feat] >= thr);
          return {
            leaf: false, feat, thr, depth,
            left: buildITree(L, depth + 1, maxDepth),
            right: buildITree(R, depth + 1, maxDepth),
          };
        }

        function c(n) { if (n <= 1) return 0; return 2 * (Math.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n; }

        function pathLength(tree, p, depth) {
          if (tree.leaf) return depth + c(tree.size);
          const v = tree.feat === 'x' ? p.x : p.y;
          return v < tree.thr ? pathLength(tree.left, p, depth + 1) : pathLength(tree.right, p, depth + 1);
        }

        function computeScores() {
          const nTrees = +cTrees.input.value;
          const maxDepth = +cDepth.input.value;
          const sampleSize = Math.min(256, points.length);
          const norm = c(sampleSize);

          const forest = [];
          for (let t = 0; t < nTrees; t++) {
            const sample = [];
            for (let i = 0; i < sampleSize; i++) sample.push(points[Math.floor(Math.random() * points.length)]);
            forest.push(buildITree(sample, 0, maxDepth));
          }

          scores = points.map(p => {
            let sum = 0;
            forest.forEach(t => sum += pathLength(t, p, 0));
            const avg = sum / nTrees;
            return Math.pow(2, -avg / norm);
          });
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);

          // определяем порог по contamination
          const cont = +cCont.input.value;
          const sorted = [...scores].sort((a, b) => b - a);
          const threshold = sorted[Math.floor(cont * scores.length)];

          // считаем anomaly detection metrics
          let tp = 0, fp = 0, fn = 0, tn = 0;
          points.forEach((p, i) => {
            const pred = scores[i] >= threshold ? 1 : 0;
            if (pred === 1 && p.truth === 1) tp++;
            else if (pred === 1 && p.truth === 0) fp++;
            else if (pred === 0 && p.truth === 1) fn++;
            else tn++;
          });

          // рисуем точки по score (от синего до красного)
          points.forEach((p, i) => {
            const s = scores[i];
            const t = Math.max(0, Math.min(1, (s - 0.4) / 0.35));
            const r = Math.round(59 + (239 - 59) * t);
            const g = Math.round(130 + (68 - 130) * t);
            const b = Math.round(246 + (68 - 246) * t);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            const isAnom = scores[i] >= threshold;
            ctx.strokeStyle = isAnom ? '#0f172a' : '#fff';
            ctx.lineWidth = isAnom ? 2 : 1;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, isAnom ? 6 : 4, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
          });

          const precision = tp / (tp + fp) || 0;
          const recall = tp / (tp + fn) || 0;

          container.querySelector('#if-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Threshold</div><div class="stat-value">${App.Util.round(threshold, 3)}</div></div>
            <div class="stat-card"><div class="stat-label">Обнаружено аномалий</div><div class="stat-value">${tp + fp}</div></div>
            <div class="stat-card"><div class="stat-label">TP / FP / FN</div><div class="stat-value">${tp}/${fp}/${fn}</div></div>
            <div class="stat-card"><div class="stat-label">Precision</div><div class="stat-value">${(precision * 100).toFixed(0)}%</div></div>
            <div class="stat-card"><div class="stat-label">Recall</div><div class="stat-value">${(recall * 100).toFixed(0)}%</div></div>
          `;
        }

        function rebuild() { computeScores(); draw(); }

        [cTrees, cDepth].forEach(c => c.input.addEventListener('input', rebuild));
        [cN, cOut].forEach(c => c.input.addEventListener('change', () => { genData(); rebuild(); }));
        cCont.input.addEventListener('input', draw);
        container.querySelector('#if-regen').onclick = () => { genData(); rebuild(); };
        container.querySelector('#if-rebuild').onclick = rebuild;

        setTimeout(() => { genData(); resize(); rebuild(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    python: `
      <h3>Python: Isolation Forest</h3>
      <p>sklearn.IsolationForest эффективно обнаруживает аномалии без меток. score_samples возвращает аномальность каждой точки.</p>

      <h4>1. Isolation Forest: базовое использование</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# Нормальные данные + аномалии
np.random.seed(42)
X_normal = np.random.randn(300, 2)
X_outliers = np.random.uniform(-5, 5, (30, 2))  # разбросанные выбросы
X_all = np.vstack([X_normal, X_outliers])

# contamination — ожидаемая доля аномалий
iso = IsolationForest(n_estimators=100, contamination=0.09,
                      random_state=42, n_jobs=-1)
iso.fit(X_all)
labels = iso.predict(X_all)       # +1 нормальный, -1 аномалия
scores = iso.score_samples(X_all) # чем ниже, тем аномальнее

print(f'Обнаружено аномалий: {(labels == -1).sum()}')
print(f'Score range: [{scores.min():.3f}, {scores.max():.3f}]')

# Визуализация
plt.scatter(X_all[labels==1, 0], X_all[labels==1, 1], alpha=0.4, label='Normal')
plt.scatter(X_all[labels==-1, 0], X_all[labels==-1, 1],
            c='red', s=60, label='Anomaly')
plt.title('Isolation Forest: обнаружение аномалий')
plt.legend()
plt.show()</code></pre>

      <h4>2. Тепловая карта anomaly score</h4>
      <pre><code># Визуализируем anomaly score на сетке
xx, yy = np.meshgrid(np.linspace(-6, 6, 200), np.linspace(-6, 6, 200))
Z = iso.score_samples(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

plt.figure(figsize=(8, 6))
plt.contourf(xx, yy, Z, levels=20, cmap='RdYlGn')
plt.colorbar(label='Anomaly Score (ниже = аномальнее)')
plt.scatter(X_normal[:, 0], X_normal[:, 1], s=15, alpha=0.5, c='blue', label='Normal')
plt.scatter(X_outliers[:, 0], X_outliers[:, 1], s=50, c='black', marker='x', label='Outliers')
plt.title('Isolation Forest: карта аномальности')
plt.legend()
plt.show()

# Гистограмма score: нормальные vs аномалии
true_labels = np.array([1]*300 + [-1]*30)
plt.hist(scores[true_labels==1], bins=30, alpha=0.6, label='Normal')
plt.hist(scores[true_labels==-1], bins=10, alpha=0.6, label='Outlier')
plt.xlabel('Anomaly Score')
plt.title('Распределение score: Normal vs Outlier')
plt.legend()
plt.show()</code></pre>

      <h4>3. Подбор contamination и оценка качества</h4>
      <pre><code>from sklearn.metrics import f1_score, roc_auc_score

# Синтетический датасет с известными метками
np.random.seed(0)
X_n = np.random.randn(400, 5)                    # нормальные
X_a = np.random.uniform(-4, 4, (40, 5))          # аномалии
X = np.vstack([X_n, X_a])
y_true = np.array([0]*400 + [1]*40)              # 1 = аномалия

# Перебираем contamination
contaminations = [0.02, 0.05, 0.08, 0.10, 0.15]
f1_scores = []

for cont in contaminations:
    iso = IsolationForest(n_estimators=200, contamination=cont, random_state=42)
    preds = iso.fit_predict(X)
    y_pred = (preds == -1).astype(int)            # -1 → 1 (аномалия)
    f1_scores.append(f1_score(y_true, y_pred, zero_division=0))

# Anomaly score → ROC-AUC (без порога)
iso_roc = IsolationForest(n_estimators=200, contamination=0.09, random_state=42)
iso_roc.fit(X)
scores_roc = -iso_roc.score_samples(X)           # инвертируем: выше = аномальнее
print(f'ROC-AUC: {roc_auc_score(y_true, scores_roc):.4f}')

plt.plot(contaminations, f1_scores, 'o-')
plt.xlabel('contamination')
plt.ylabel('F1 Score')
plt.title('Isolation Forest: подбор contamination')
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Fraud detection</b> — аномальные банковские транзакции.</li>
        <li><b>Сетевая безопасность</b> — аномальный трафик, вторжения.</li>
        <li><b>Мониторинг систем</b> — аномальные метрики серверов.</li>
        <li><b>Manufacturing</b> — дефекты производства.</li>
        <li><b>Medical</b> — аномальные показатели в анализах.</li>
        <li><b>Data cleaning</b> — обнаружение выбросов перед ML.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Линейная сложность O(n log n)</li>
            <li>Масштабируется на большие данные</li>
            <li>Не требует вычисления расстояний</li>
            <li>Хорошо работает в высоких размерностях</li>
            <li>Параллелится</li>
            <li>Мало гиперпараметров</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Случайный — результаты могут варьироваться</li>
            <li>Axis-parallel splits — плохо с «косыми» аномалиями</li>
            <li>Нужно знать contamination или порог</li>
            <li>Плохо работает при кластерных аномалиях (много рядом стоящих)</li>
            <li>Может принять плотные кластеры за аномалии в разреженных данных</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Построение iTree</h3>
      <p>Рекурсивно разбиваем случайно, пока не достигли глубины или единичного узла.</p>

      <h3>Path length</h3>
      <p>$h(x)$ — глубина, на которой изолируется x. Если лист содержит >1 точку (из-за ограничения глубины), добавляем поправку:</p>
      <div class="math-block">$$h(x) = e + c(T.size)$$</div>

      <h3>Нормировочная константа</h3>
      <p>Ожидаемая глубина в случайном BST:</p>
      <div class="math-block">$$c(n) = 2H(n-1) - \\frac{2(n-1)}{n}, \\quad H(i) = \\ln(i) + \\gamma$$</div>

      <h3>Anomaly score</h3>
      <div class="math-block">$$s(x, n) = 2^{-\\frac{E[h(x)]}{c(n)}}$$</div>
      <ul>
        <li>$s \\to 1$ при $E[h(x)] \\to 0$ — аномалия</li>
        <li>$s \\to 0$ при $E[h(x)] \\to n-1$ — норма</li>
        <li>$s \\approx 0.5$ — нельзя сказать</li>
      </ul>

      <h3>Параметры</h3>
      <ul>
        <li>$t$ — число деревьев (обычно 100)</li>
        <li>$\\psi$ — размер подвыборки (обычно 256)</li>
        <li>max_depth = $\\lceil \\log_2(\\psi) \\rceil$</li>
      </ul>
    `,

    extra: `
      <h3>Extended Isolation Forest</h3>
      <p>Обычный iForest делает axis-parallel разбиения, что создаёт артефакты. EIF использует случайные гиперплоскости с произвольными наклонами — более точные score.</p>

      <h3>Альтернативы для аномалий</h3>
      <table>
        <tr><th>Метод</th><th>Идея</th><th>Когда использовать</th></tr>
        <tr><td>Isolation Forest</td><td>Изолировать</td><td>Большие tabular данные</td></tr>
        <tr><td>LOF</td><td>Локальная плотность</td><td>Когда кластеры разной плотности</td></tr>
        <tr><td>One-Class SVM</td><td>Граница нормы</td><td>Небольшие данные, известна норма</td></tr>
        <tr><td>Autoencoder</td><td>Reconstruction error</td><td>Изображения, сигналы</td></tr>
        <tr><td>Z-score</td><td>σ от среднего</td><td>1D, нормальные данные</td></tr>
      </table>

      <h3>Как выбрать contamination</h3>
      <ul>
        <li>Если знаешь историческую долю аномалий — используй её.</li>
        <li>Если нет разметки — смотри на распределение score и выбирай руками.</li>
        <li>В проде часто контролируют через precision@k — фиксируем количество алёртов.</li>
      </ul>

      <h3>Интерпретация score</h3>
      <p>Score сам по себе не вероятность аномалии — это относительный ранг. Для калибровки используй calibration plots или percentile rank.</p>

      <h3>Multi-variate anomalies</h3>
      <p>Isolation Forest хорошо ловит отдельные сильные аномалии, но плохо — точечные малые отклонения в контексте. Для временных рядов нужны специальные адаптации (например, детекция изменений).</p>
    `,
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest: канал</a> — поиск по «anomaly detection» и «random forest» для фундаментальных основ</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=isolation%20forest%20%D0%B0%D0%BD%D0%BE%D0%BC%D0%B0%D0%BB%D0%B8%D0%B8" target="_blank">Habr: Isolation Forest</a> — разбор алгоритма с кодом и примерами на реальных данных</li>
        <li><a href="https://arxiv.org/abs/1811.02141" target="_blank">Оригинальная статья: Isolation Forest (Liu et al.)</a> — расширенная версия с Extended Isolation Forest</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html" target="_blank">sklearn IsolationForest</a> — официальная документация с параметрами contamination и n_estimators</li>
      </ul>
    `,
  },
});
