/* ==========================================================================
   Глоссарий: DAG — направленный ациклический граф
   ========================================================================== */
App.registerTopic({
  id: 'glossary-dag',
  category: 'glossary',
  title: 'DAG (причинный граф)',
  summary: 'Directed Acyclic Graph: визуальный язык для выражения причинных связей между переменными.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь детектива, расследующего дело. У него есть куча улик, и он рисует на доске схему: «вот это привело к этому, а это — к этому». Стрелки показывают, <b>кто на кого повлиял</b>. Если в схеме стрелки образуют петлю — значит, детектив запутался, такого быть не может.</p>
        <p>DAG — это ровно такая схема, но в статистике: <b>кружки</b> — это переменные, <b>стрелки</b> — причинные влияния, и никаких петель (поэтому «ациклический»). DAG — главный инструмент <a class="glossary-link" onclick="App.selectTopic('causal-inference')">причинного вывода</a>: без него невозможно понять, какие переменные надо контролировать, а какие — категорически нельзя.</p>
      </div>

      <h3>🎯 Что такое DAG</h3>
      <p><b>Directed Acyclic Graph (DAG)</b> — ориентированный граф без циклов. В причинном анализе:</p>
      <ul>
        <li><b>Узлы</b> (вершины) = переменные (возраст, доход, лечение, исход...).</li>
        <li><b>Рёбра со стрелкой</b> A → B = «A является причиной B».</li>
        <li><b>Отсутствие цикла</b> = невозможно попасть из узла обратно в себя, следуя по стрелкам.</li>
      </ul>
      <p>DAG — это <b>модель причинных предположений</b>, которые ты делаешь о мире. Без этих предположений никакая статистика не скажет, что «X вызывает Y».</p>

      <h3>📐 Три фундаментальные структуры</h3>
      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Три базовые структуры DAG</text>

          <!-- 1. CHAIN (Mediator) -->
          <g>
            <text x="130" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#0369a1">1. Цепь (медиатор)</text>
            <circle cx="50" cy="130" r="22" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
            <text x="50" y="135" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">T</text>
            <circle cx="130" cy="130" r="22" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>
            <text x="130" y="135" text-anchor="middle" font-size="14" font-weight="700" fill="#b45309">M</text>
            <circle cx="210" cy="130" r="22" fill="#dcfce7" stroke="#166534" stroke-width="2"/>
            <text x="210" y="135" text-anchor="middle" font-size="14" font-weight="700" fill="#166534">Y</text>
            <line x1="72" y1="130" x2="108" y2="130" stroke="#475569" stroke-width="2" marker-end="url(#dag-arr)"/>
            <line x1="152" y1="130" x2="188" y2="130" stroke="#475569" stroke-width="2" marker-end="url(#dag-arr)"/>
            <text x="130" y="175" text-anchor="middle" font-size="11" fill="#64748b">T → M → Y</text>
            <text x="130" y="200" text-anchor="middle" font-size="10" fill="#475569">M — медиатор</text>
            <text x="130" y="215" text-anchor="middle" font-size="10" fill="#475569">(промежуточный шаг)</text>
            <text x="130" y="245" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309">НЕ контролируй M!</text>
            <text x="130" y="260" text-anchor="middle" font-size="10" fill="#64748b">Иначе заблокируешь эффект</text>
            <text x="130" y="278" text-anchor="middle" font-size="11" font-style="italic" fill="#475569">Пример: Лекарство → Давление → Выживаемость</text>
          </g>

          <!-- 2. FORK (Confounder) -->
          <g>
            <text x="380" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#7c2d12">2. Развилка (конфаундер)</text>
            <circle cx="380" cy="105" r="22" fill="#fecaca" stroke="#b91c1c" stroke-width="2"/>
            <text x="380" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#b91c1c">C</text>
            <circle cx="310" cy="170" r="22" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
            <text x="310" y="175" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">T</text>
            <circle cx="450" cy="170" r="22" fill="#dcfce7" stroke="#166534" stroke-width="2"/>
            <text x="450" y="175" text-anchor="middle" font-size="14" font-weight="700" fill="#166534">Y</text>
            <line x1="365" y1="123" x2="325" y2="150" stroke="#475569" stroke-width="2" marker-end="url(#dag-arr)"/>
            <line x1="395" y1="123" x2="435" y2="150" stroke="#475569" stroke-width="2" marker-end="url(#dag-arr)"/>
            <text x="380" y="215" text-anchor="middle" font-size="11" fill="#64748b">T ← C → Y</text>
            <text x="380" y="238" text-anchor="middle" font-size="10" fill="#475569">C — конфаундер</text>
            <text x="380" y="253" text-anchor="middle" font-size="10" fill="#475569">(общая причина)</text>
            <text x="380" y="278" text-anchor="middle" font-size="11" font-weight="700" fill="#059669">ОБЯЗАТЕЛЬНО контролируй C!</text>
            <text x="380" y="293" text-anchor="middle" font-size="10" fill="#64748b">Иначе ложная корреляция</text>
            <text x="380" y="311" text-anchor="middle" font-size="11" font-style="italic" fill="#475569">Пример: Жара → Мороженое, Утопления</text>
          </g>

          <!-- 3. COLLIDER -->
          <g>
            <text x="630" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#581c87">3. Коллайдер</text>
            <circle cx="560" cy="105" r="22" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
            <text x="560" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">T</text>
            <circle cx="700" cy="105" r="22" fill="#dcfce7" stroke="#166534" stroke-width="2"/>
            <text x="700" y="110" text-anchor="middle" font-size="14" font-weight="700" fill="#166534">Y</text>
            <circle cx="630" cy="170" r="22" fill="#e9d5ff" stroke="#7c3aed" stroke-width="2"/>
            <text x="630" y="175" text-anchor="middle" font-size="14" font-weight="700" fill="#7c3aed">C</text>
            <line x1="575" y1="123" x2="615" y2="150" stroke="#475569" stroke-width="2" marker-end="url(#dag-arr)"/>
            <line x1="685" y1="123" x2="645" y2="150" stroke="#475569" stroke-width="2" marker-end="url(#dag-arr)"/>
            <text x="630" y="215" text-anchor="middle" font-size="11" fill="#64748b">T → C ← Y</text>
            <text x="630" y="238" text-anchor="middle" font-size="10" fill="#475569">C — коллайдер</text>
            <text x="630" y="253" text-anchor="middle" font-size="10" fill="#475569">(T и Y оба влияют на C)</text>
            <text x="630" y="278" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">НЕ контролируй C!</text>
            <text x="630" y="293" text-anchor="middle" font-size="10" fill="#64748b">Создаст ложную связь</text>
            <text x="630" y="311" text-anchor="middle" font-size="11" font-style="italic" fill="#475569">Пример: Талант → Успех ← Везение</text>
          </g>
          <defs>
            <marker id="dag-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#475569"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">Три фундаментальные причинные структуры. Для каждой есть своё правило: медиатор не контролируем (иначе убиваем эффект), конфаундер обязательно контролируем, коллайдер никогда не контролируем (иначе создаём ложную связь).</div>
      </div>

      <h3>💡 Почему важно правильно читать DAG</h3>
      <p>Неправильный выбор «переменных для контроля» в регрессии даёт неверные выводы. Три классические ошибки:</p>

      <table>
        <tr><th>Ошибка</th><th>Последствие</th></tr>
        <tr><td><b>Не контролировать конфаундер</b></td><td>Находим «эффект», которого нет (жара → мороженое → утопления)</td></tr>
        <tr><td><b>Контролировать медиатор</b></td><td>Теряем реальный эффект (убиваем канал влияния)</td></tr>
        <tr><td><b>Контролировать коллайдер</b></td><td>Создаём ложную корреляцию между независимыми переменными</td></tr>
      </table>

      <div class="key-concept">
        <div class="kc-label">Классический пример коллайдера: парадокс Берксона</div>
        <p>Предположим: талант и внешность — <b>независимые</b> качества в популяции. Но среди знаменитостей (которым нужно либо одно, либо другое, чтобы прославиться) они окажутся <b>отрицательно коррелированы</b>: «у красивых знаменитостей меньше таланта, у талантливых — меньше красоты». Это не правда о мире — это артефакт того, что мы «контролируем» фактор знаменитости (коллайдер).</p>
      </div>

      <h3>🔄 Backdoor criterion</h3>
      <p>Джудеа Перл формализовал правила DAG через <b>backdoor criterion</b>: чтобы оценить причинный эффект T → Y, нужно найти и контролировать множество переменных $Z$ такое, что:</p>
      <ul>
        <li>$Z$ блокирует все «обратные» пути из T в Y (через конфаундеры).</li>
        <li>$Z$ не содержит потомков T (медиаторов).</li>
      </ul>
      <p>Если такое $Z$ существует — эффект идентифицируется из наблюдательных данных. Если нет — нужен эксперимент (A/B тест) или более сложные методы (инструментальные переменные).</p>

      <h3>📊 Как нарисовать DAG для своей задачи</h3>
      <ol>
        <li><b>Выпиши все релевантные переменные.</b> Включай даже те, которые не можешь измерить (они важны для логики).</li>
        <li><b>Спроси про каждую пару: есть ли прямая причинная связь?</b> Если да — проведи стрелку в правильную сторону.</li>
        <li><b>Проверь на циклы.</b> Если A → B → C → A — у тебя проблема с логикой.</li>
        <li><b>Идентифицируй структуры.</b> Где конфаундеры? Где медиаторы? Где коллайдеры?</li>
        <li><b>Выбери, что контролировать.</b> По backdoor criterion или хотя бы интуитивно: все конфаундеры «да», медиаторы и коллайдеры «нет».</li>
      </ol>

      <h3>🛠 Инструменты для работы с DAG</h3>
      <ul>
        <li><b>DAGitty</b> (<a href="http://www.dagitty.net" target="_blank">dagitty.net</a>) — браузерный инструмент для рисования и автоматической идентификации эффектов.</li>
        <li><b>DoWhy</b> (Microsoft) — Python-библиотека для причинного анализа через DAG.</li>
        <li><b>CausalML</b> (Uber) — для uplift-моделирования и эффектов на подгруппы.</li>
      </ul>

      <h3>⚠️ Ограничения</h3>
      <ul>
        <li><b>DAG отражает твои предположения, а не истину.</b> Если ты забыл важный конфаундер — метод даст неправильный ответ.</li>
        <li><b>Нет способа «проверить» DAG из данных.</b> Разные DAG могут быть совместимы с одними данными (Markov equivalence class).</li>
        <li><b>Нет обратной связи во времени.</b> Обычный DAG плохо подходит для динамических систем.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('causal-inference')">Причинный вывод</a> — главное применение DAG</li>
        <li><a onclick="App.selectTopic('correlation')">Корреляция</a> — DAG объясняет, почему корреляция ≠ причинность</li>
        <li><a onclick="App.selectTopic('ab-testing-intro')">A/B тестирование</a> — рандомизация делает DAG проще (разрывает все backdoor-пути)</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Directed_acyclic_graph" target="_blank">Wikipedia: DAG</a></li>
        <li><a href="http://www.dagitty.net" target="_blank">DAGitty — интерактивный редактор</a></li>
        <li><a href="https://www.pywhy.org/dowhy/" target="_blank">DoWhy — Python для causal inference</a></li>
      </ul>
    `
  }
});
