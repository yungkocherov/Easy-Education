/* ==========================================================================
   Глоссарий: One-hot encoding
   ========================================================================== */
App.registerTopic({
  id: 'glossary-one-hot',
  category: 'glossary',
  title: 'One-hot encoding',
  summary: 'Преобразование категориальных признаков в бинарные столбцы.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>У тебя есть колонка «цвет»: <code>красный, синий, зелёный, красный, синий</code>. ML-модель не умеет работать с текстом — ей нужны числа. Первая идея: закодировать как 1, 2, 3. Но тогда модель решит, что «зелёный (3)» &gt; «синего (2)» &gt; «красного (1)» — ложное упорядочивание.</p>
        <p><b>One-hot encoding</b> решает это элегантно: вместо одной колонки делаем столько колонок, сколько значений, и ставим 1 только в ту, которая соответствует текущему значению. Каждая категория получает свою «осу́», они равноправны.</p>
      </div>

      <h3>🎯 Определение</h3>
      <p><b>One-hot encoding</b> — преобразование категориальной переменной с $K$ значениями в $K$ бинарных (0/1) признаков. Для каждой строки ровно один признак = 1 (тот, что соответствует её категории), остальные = 0.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">One-hot encoding колонки «цвет»</text>

          <!-- Before -->
          <g>
            <text x="150" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#475569">До: текстовая категория</text>
            <rect x="90" y="80" width="120" height="30" fill="#fef3c7" stroke="#b45309" stroke-width="1.5"/>
            <text x="150" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">цвет</text>
            <rect x="90" y="110" width="120" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="150" y="127" text-anchor="middle" font-size="12">красный</text>
            <rect x="90" y="135" width="120" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="150" y="152" text-anchor="middle" font-size="12">синий</text>
            <rect x="90" y="160" width="120" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="150" y="177" text-anchor="middle" font-size="12">зелёный</text>
            <rect x="90" y="185" width="120" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="150" y="202" text-anchor="middle" font-size="12">красный</text>
            <rect x="90" y="210" width="120" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="150" y="227" text-anchor="middle" font-size="12">синий</text>
            <text x="150" y="255" text-anchor="middle" font-size="10" fill="#dc2626">✗ Модель не понимает текст</text>
          </g>

          <!-- Arrow -->
          <path d="M240,155 L340,155" stroke="#475569" stroke-width="2.5" fill="none" marker-end="url(#oh-arr)"/>
          <text x="290" y="145" text-anchor="middle" font-size="11" fill="#475569" font-weight="700">one-hot</text>
          <defs>
            <marker id="oh-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#475569"/>
            </marker>
          </defs>

          <!-- After -->
          <g>
            <text x="555" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#475569">После: 3 бинарных колонки</text>
            <g>
              <rect x="380" y="80" width="110" height="30" fill="#fecaca" stroke="#dc2626" stroke-width="1.5"/>
              <text x="435" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b">красный</text>
              <rect x="490" y="80" width="110" height="30" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
              <text x="545" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">синий</text>
              <rect x="600" y="80" width="110" height="30" fill="#bbf7d0" stroke="#059669" stroke-width="1.5"/>
              <text x="655" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">зелёный</text>
            </g>
            <!-- Row 1: red -->
            <rect x="380" y="110" width="110" height="25" fill="#fee2e2" stroke="#cbd5e1"/>
            <text x="435" y="127" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">1</text>
            <rect x="490" y="110" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="545" y="127" text-anchor="middle" font-size="13">0</text>
            <rect x="600" y="110" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="655" y="127" text-anchor="middle" font-size="13">0</text>
            <!-- Row 2: blue -->
            <rect x="380" y="135" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="435" y="152" text-anchor="middle" font-size="13">0</text>
            <rect x="490" y="135" width="110" height="25" fill="#dbeafe" stroke="#cbd5e1"/>
            <text x="545" y="152" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">1</text>
            <rect x="600" y="135" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="655" y="152" text-anchor="middle" font-size="13">0</text>
            <!-- Row 3: green -->
            <rect x="380" y="160" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="435" y="177" text-anchor="middle" font-size="13">0</text>
            <rect x="490" y="160" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="545" y="177" text-anchor="middle" font-size="13">0</text>
            <rect x="600" y="160" width="110" height="25" fill="#bbf7d0" stroke="#cbd5e1"/>
            <text x="655" y="177" text-anchor="middle" font-size="13" font-weight="700" fill="#059669">1</text>
            <!-- Row 4: red -->
            <rect x="380" y="185" width="110" height="25" fill="#fee2e2" stroke="#cbd5e1"/>
            <text x="435" y="202" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">1</text>
            <rect x="490" y="185" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="545" y="202" text-anchor="middle" font-size="13">0</text>
            <rect x="600" y="185" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="655" y="202" text-anchor="middle" font-size="13">0</text>
            <!-- Row 5: blue -->
            <rect x="380" y="210" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="435" y="227" text-anchor="middle" font-size="13">0</text>
            <rect x="490" y="210" width="110" height="25" fill="#dbeafe" stroke="#cbd5e1"/>
            <text x="545" y="227" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">1</text>
            <rect x="600" y="210" width="110" height="25" fill="#fff" stroke="#cbd5e1"/>
            <text x="655" y="227" text-anchor="middle" font-size="13">0</text>
            <text x="555" y="255" text-anchor="middle" font-size="10" fill="#059669">✓ Числовое представление, равноправные категории</text>
          </g>
          <text x="380" y="285" text-anchor="middle" font-size="11" fill="#64748b">Каждая строка имеет ровно одну 1 и несколько 0. Отсюда название «one-hot».</text>
        </svg>
        <div class="caption">Категориальный признак «цвет» с 3 значениями превращается в 3 бинарных признака. Каждая строка имеет ровно одну «горячую» единицу.</div>
      </div>

      <h3>🎯 Когда использовать</h3>
      <table>
        <tr><th>Ситуация</th><th>Подходит?</th></tr>
        <tr><td>Номинальные (неупорядоченные) категории</td><td><b>✅ Да</b> — цвет, город, страна</td></tr>
        <tr><td>Линейные модели (регрессия, SVM)</td><td>✅ Да</td></tr>
        <tr><td>Нейросети</td><td>✅ Да, но часто лучше embedding</td></tr>
        <tr><td>Деревья (RF, GB)</td><td>⚠️ Иногда лучше label encoding — деревья справляются</td></tr>
        <tr><td>Много уникальных значений (high cardinality)</td><td>❌ Избегай — тысячи колонок замедлят модель</td></tr>
        <tr><td>Ordinal (упорядоченные) категории</td><td>❌ Используй ordinal encoding — размер S/M/L/XL имеет порядок</td></tr>
      </table>

      <h3>⚠️ Подводные камни</h3>

      <h4>1. Dummy variable trap (линейная зависимость)</h4>
      <p>Если кодировать 3 категории как 3 столбца, они линейно зависимы: $\\text{red} + \\text{blue} + \\text{green} = 1$. Для линейных моделей (регрессия) это создаёт мультиколлинеарность. Решение — <b>drop_first</b>: оставить $K-1$ столбцов, «базовая» категория закодирована нулями во всех.</p>

      <h4>2. High cardinality</h4>
      <p>Если у признака 10 000 уникальных значений (например, ID товара) — one-hot создаст 10 000 колонок, почти все нули. Это замедлит модель и увеличит риск переобучения.</p>
      <p><b>Альтернативы:</b> target encoding, frequency encoding, embedding.</p>

      <h4>3. Новые категории при inference</h4>
      <p>Что если в продакшене пришло значение, которого не было в train? Нужно решить заранее: ошибка? Отдельная колонка «unknown»? sklearn <code>OneHotEncoder(handle_unknown='ignore')</code> обрабатывает это корректно.</p>

      <h3>🔢 Альтернативы one-hot</h3>
      <table>
        <tr><th>Метод</th><th>Идея</th><th>Когда лучше</th></tr>
        <tr><td><b>Label encoding</b></td><td>Каждой категории — число</td><td>Ordinal данные, деревья</td></tr>
        <tr><td><b>Frequency encoding</b></td><td>Заменяем категорию на её частоту</td><td>High cardinality</td></tr>
        <tr><td><b>Target encoding</b></td><td>Заменяем на среднее target для этой категории</td><td>High cardinality + сильная связь с target</td></tr>
        <tr><td><b>Embedding</b></td><td>Обучаемый плотный вектор</td><td>Нейросети, рекомендательные системы</td></tr>
        <tr><td><b>Hashing</b></td><td>Hash-функция в фиксированное число колонок</td><td>Огромная cardinality, потоковая обработка</td></tr>
      </table>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('feature-engineering')">Feature Engineering</a></li>
        <li><a onclick="App.selectTopic('glossary-embedding')">Embedding</a> — современная альтернатива</li>
        <li><a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a> — классическое применение</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/One-hot" target="_blank">Wikipedia: One-hot</a></li>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html" target="_blank">sklearn.OneHotEncoder</a></li>
      </ul>
    `
  }
});
