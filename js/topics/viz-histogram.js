/* ==========================================================================
   Глоссарий: Гистограмма
   ========================================================================== */
App.registerTopic({
  id: 'viz-histogram',
  category: 'glossary',
  title: 'Гистограмма',
  summary: 'Столбчатая диаграмма частот: показывает форму распределения данных.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты измерил рост 1000 человек и хочешь понять: какие значения встречаются чаще, а какие реже. Можно выписать все числа в столбик — но это 1000 строк. Можно посчитать среднее — но это одно число и оно теряет форму. <b>Гистограмма</b> — это компромисс: мы делим диапазон роста на интервалы (например, 150-155, 155-160, 160-165...) и рисуем столбики, высота которых = число людей в этом интервале.</p>
        <p>Результат — наглядная «форма» распределения: где пик, как симметрично, есть ли хвосты и выбросы. Гистограмма — это <b>рентген</b> твоих данных.</p>
      </div>

      <h3>🎯 Что такое гистограмма</h3>
      <p><b>Гистограмма</b> — столбчатая диаграмма, где по оси X отложен диапазон значений, разделённый на интервалы (bins), а по оси Y — число наблюдений, попавших в каждый интервал (или плотность).</p>

      <h4>Как строится</h4>
      <ol>
        <li>Выбираем число бинов (например, 10) и ширину каждого.</li>
        <li>Считаем, сколько значений попало в каждый бин.</li>
        <li>Рисуем столбец с высотой = числу попаданий.</li>
      </ol>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Анатомия гистограммы: рост 1000 человек</text>
          <!-- Axes -->
          <line x1="70" y1="250" x2="650" y2="250" stroke="#475569" stroke-width="1.5"/>
          <line x1="70" y1="50" x2="70" y2="250" stroke="#475569" stroke-width="1.5"/>
          <!-- Y ticks -->
          <g font-size="10" fill="#64748b" text-anchor="end">
            <text x="65" y="254">0</text>
            <text x="65" y="210">50</text>
            <text x="65" y="170">100</text>
            <text x="65" y="130">150</text>
            <text x="65" y="90">200</text>
            <text x="65" y="54">250</text>
          </g>
          <!-- X ticks -->
          <g font-size="10" fill="#64748b" text-anchor="middle">
            <text x="75"  y="268">150</text>
            <text x="133" y="268">155</text>
            <text x="191" y="268">160</text>
            <text x="249" y="268">165</text>
            <text x="307" y="268">170</text>
            <text x="365" y="268">175</text>
            <text x="423" y="268">180</text>
            <text x="481" y="268">185</text>
            <text x="539" y="268">190</text>
            <text x="597" y="268">195</text>
            <text x="645" y="268">200</text>
          </g>
          <text x="360" y="288" text-anchor="middle" font-size="11" fill="#64748b">Рост, см</text>
          <text x="30" y="150" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 30 150)">Частота</text>
          <!-- Bars: bell-shaped distribution -->
          <!-- Each bar 50px wide -->
          <g fill="#3b82f6" fill-opacity="0.65" stroke="#1e40af" stroke-width="1.2">
            <rect x="75"  y="246" width="57" height="4"/>
            <rect x="133" y="228" width="57" height="22"/>
            <rect x="191" y="196" width="57" height="54"/>
            <rect x="249" y="148" width="57" height="102"/>
            <rect x="307" y="85"  width="57" height="165"/>
            <rect x="365" y="56"  width="57" height="194"/>
            <rect x="423" y="90"  width="57" height="160"/>
            <rect x="481" y="150" width="57" height="100"/>
            <rect x="539" y="200" width="57" height="50"/>
            <rect x="597" y="246" width="48" height="4"/>
          </g>
          <!-- Annotations -->
          <line x1="393" y1="56" x2="450" y2="30" stroke="#1e40af" stroke-width="1"/>
          <text x="455" y="30" font-size="11" fill="#1e40af" font-weight="600">пик = мода</text>
          <text x="455" y="44" font-size="9" fill="#64748b">наиболее частое значение</text>
        </svg>
        <div class="caption">Гистограмма роста. Каждый столбец — интервал роста шириной 5 см. Высота = число людей в этом интервале. Видно: пик ~178 см, почти симметрично, хвосты до 150 и 200.</div>
      </div>

      <h3>🎨 Выбор числа бинов</h3>
      <p>Главный параметр гистограммы — <b>число бинов</b>. Он критически влияет на то, что ты увидишь.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Одни и те же данные, разное число бинов</text>
          <!-- TOO FEW bins -->
          <g>
            <text x="120" y="38" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">5 бинов — слишком мало</text>
            <line x1="30" y1="200" x2="210" y2="200" stroke="#475569"/>
            <rect x="40"  y="170" width="30" height="30" fill="#fecaca" stroke="#dc2626"/>
            <rect x="72"  y="110" width="30" height="90" fill="#fecaca" stroke="#dc2626"/>
            <rect x="104" y="80"  width="30" height="120" fill="#fecaca" stroke="#dc2626"/>
            <rect x="136" y="115" width="30" height="85" fill="#fecaca" stroke="#dc2626"/>
            <rect x="168" y="175" width="30" height="25" fill="#fecaca" stroke="#dc2626"/>
            <text x="120" y="220" text-anchor="middle" font-size="9" fill="#64748b">Потеряли детали формы</text>
          </g>
          <!-- Just right -->
          <g>
            <text x="350" y="38" text-anchor="middle" font-size="11" font-weight="600" fill="#059669">20 бинов — оптимально</text>
            <line x1="260" y1="200" x2="440" y2="200" stroke="#475569"/>
            <g fill="#bbf7d0" stroke="#059669">
              <rect x="262" y="195" width="9" height="5"/>
              <rect x="271" y="188" width="9" height="12"/>
              <rect x="280" y="180" width="9" height="20"/>
              <rect x="289" y="168" width="9" height="32"/>
              <rect x="298" y="152" width="9" height="48"/>
              <rect x="307" y="135" width="9" height="65"/>
              <rect x="316" y="118" width="9" height="82"/>
              <rect x="325" y="100" width="9" height="100"/>
              <rect x="334" y="86" width="9" height="114"/>
              <rect x="343" y="80" width="9" height="120"/>
              <rect x="352" y="84" width="9" height="116"/>
              <rect x="361" y="98" width="9" height="102"/>
              <rect x="370" y="115" width="9" height="85"/>
              <rect x="379" y="133" width="9" height="67"/>
              <rect x="388" y="150" width="9" height="50"/>
              <rect x="397" y="168" width="9" height="32"/>
              <rect x="406" y="180" width="9" height="20"/>
              <rect x="415" y="188" width="9" height="12"/>
              <rect x="424" y="193" width="9" height="7"/>
              <rect x="433" y="196" width="9" height="4"/>
            </g>
            <text x="350" y="220" text-anchor="middle" font-size="9" fill="#64748b">Чёткая форма распределения</text>
          </g>
          <!-- TOO many -->
          <g>
            <text x="580" y="38" text-anchor="middle" font-size="11" font-weight="600" fill="#b45309">100 бинов — слишком много</text>
            <line x1="490" y1="200" x2="670" y2="200" stroke="#475569"/>
            <g fill="#fcd34d" stroke="#b45309" stroke-width="0.5">
              <rect x="492" y="199" width="1.5" height="1"/>
              <rect x="495" y="198" width="1.5" height="2"/>
              <rect x="498" y="196" width="1.5" height="4"/>
              <rect x="501" y="199" width="1.5" height="1"/>
              <rect x="504" y="195" width="1.5" height="5"/>
              <rect x="507" y="192" width="1.5" height="8"/>
              <rect x="510" y="188" width="1.5" height="12"/>
              <rect x="513" y="185" width="1.5" height="15"/>
              <rect x="516" y="180" width="1.5" height="20"/>
              <rect x="519" y="187" width="1.5" height="13"/>
              <rect x="522" y="175" width="1.5" height="25"/>
              <rect x="525" y="170" width="1.5" height="30"/>
              <rect x="528" y="178" width="1.5" height="22"/>
              <rect x="531" y="160" width="1.5" height="40"/>
              <rect x="534" y="155" width="1.5" height="45"/>
              <rect x="537" y="148" width="1.5" height="52"/>
              <rect x="540" y="145" width="1.5" height="55"/>
              <rect x="543" y="140" width="1.5" height="60"/>
              <rect x="546" y="138" width="1.5" height="62"/>
              <rect x="549" y="130" width="1.5" height="70"/>
              <rect x="552" y="128" width="1.5" height="72"/>
              <rect x="555" y="125" width="1.5" height="75"/>
              <rect x="558" y="120" width="1.5" height="80"/>
              <rect x="561" y="125" width="1.5" height="75"/>
              <rect x="564" y="118" width="1.5" height="82"/>
              <rect x="567" y="115" width="1.5" height="85"/>
              <rect x="570" y="118" width="1.5" height="82"/>
              <rect x="573" y="122" width="1.5" height="78"/>
              <rect x="576" y="120" width="1.5" height="80"/>
              <rect x="579" y="125" width="1.5" height="75"/>
              <rect x="582" y="130" width="1.5" height="70"/>
              <rect x="585" y="135" width="1.5" height="65"/>
              <rect x="588" y="130" width="1.5" height="70"/>
              <rect x="591" y="140" width="1.5" height="60"/>
              <rect x="594" y="145" width="1.5" height="55"/>
              <rect x="597" y="150" width="1.5" height="50"/>
              <rect x="600" y="155" width="1.5" height="45"/>
              <rect x="603" y="160" width="1.5" height="40"/>
              <rect x="606" y="165" width="1.5" height="35"/>
              <rect x="609" y="170" width="1.5" height="30"/>
              <rect x="612" y="175" width="1.5" height="25"/>
              <rect x="615" y="180" width="1.5" height="20"/>
              <rect x="618" y="185" width="1.5" height="15"/>
              <rect x="621" y="188" width="1.5" height="12"/>
              <rect x="624" y="192" width="1.5" height="8"/>
              <rect x="627" y="195" width="1.5" height="5"/>
              <rect x="630" y="197" width="1.5" height="3"/>
            </g>
            <text x="580" y="220" text-anchor="middle" font-size="9" fill="#64748b">Шум важнее формы</text>
          </g>
        </svg>
        <div class="caption">Слишком мало бинов (5): теряются детали, форма огрубляется. Слишком много (100): видишь шум и случайные флуктуации. Оптимум обычно 15-30 бинов.</div>
      </div>

      <h3>📏 Правила выбора числа бинов</h3>
      <table>
        <tr><th>Правило</th><th>Формула</th><th>Когда использовать</th></tr>
        <tr><td><b>Sturges</b></td><td>k = ⌈log₂(n) + 1⌉</td><td>n &lt; 200, нормальные данные</td></tr>
        <tr><td><b>Rice</b></td><td>k = 2 · n^(1/3)</td><td>Общий случай</td></tr>
        <tr><td><b>Scott</b></td><td>h = 3.5 · σ / n^(1/3)</td><td>Нормальные данные</td></tr>
        <tr><td><b>Freedman-Diaconis</b></td><td>h = 2 · IQR / n^(1/3)</td><td>Данные с выбросами</td></tr>
      </table>
      <p>В практике: начинай со «squareroot» правила ($k = \\sqrt{n}$) или дефолта библиотеки, потом подгоняй вручную если не устраивает.</p>

      <h3>📊 Виды гистограмм</h3>
      <ul>
        <li><b>Частотная</b> — по Y высота = число наблюдений. Самая простая.</li>
        <li><b>Плотностная</b> — по Y плотность (чтобы сумма площадей = 1). Удобна для сравнения с теоретическим распределением (PDF).</li>
        <li><b>Кумулятивная</b> — по Y накопленная частота. Показывает CDF эмпирически.</li>
        <li><b>Нормализованная (%)</b> — по Y процент наблюдений в бине. Удобна для сравнения двух выборок разного размера.</li>
        <li><b>Stacked</b> — несколько категорий в одном столбце.</li>
      </ul>

      <h3>🔍 Как читать гистограмму</h3>
      <table>
        <tr><th>Форма</th><th>Интерпретация</th></tr>
        <tr><td>Симметричный колокол</td><td>Нормальное распределение</td></tr>
        <tr><td>Правый скос (хвост вправо)</td><td>Доходы, цены, время ожидания</td></tr>
        <tr><td>Левый скос (хвост влево)</td><td>Возраст ухода на пенсию, оценки на экзамене</td></tr>
        <tr><td>Бимодальная (2 пика)</td><td>Смесь двух групп (мужчины + женщины, до + после)</td></tr>
        <tr><td>Равномерная</td><td>Все значения равновероятны</td></tr>
        <tr><td>U-образная</td><td>Концентрация на краях, избегание середины</td></tr>
        <tr><td>Одиночные «островки» далеко от основного пика</td><td>Выбросы или подгруппы</td></tr>
      </table>

      <h3>🆚 Гистограмма vs KDE</h3>
      <p><b>KDE</b> (Kernel Density Estimation) — сглаженная версия гистограммы без дискретных бинов. Преимущества KDE:</p>
      <ul>
        <li>Нет произвольного выбора ширины бинов</li>
        <li>Гладкий непрерывный результат</li>
        <li>Можно наложить несколько распределений на один график</li>
      </ul>
      <p>Недостатки: нужно выбирать ширину ядра (bandwidth), может «сгладить» реальные особенности (например, резкие границы). Часто рисуют вместе: гистограмма + KDE поверх.</p>

      <h3>⚠️ Частые ошибки</h3>
      <ul>
        <li><b>Неправильное число бинов</b> — главная ошибка. Всегда проверь 2-3 варианта.</li>
        <li><b>Путаница с bar chart</b> — bar chart для категориальных данных, гистограмма для числовых (столбцы касаются друг друга).</li>
        <li><b>Игнорирование начала оси Y</b> — если ось начинается не с 0, разница между столбцами выглядит больше, чем есть.</li>
        <li><b>Гистограмма на скошенных данных</b> — длинный хвост «съедает» весь график. Используй логарифмическую ось или показывай только [0, 95%]-перцентиль.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('descriptive-stats')">Описательная статистика</a> — что такое среднее, медиана, скос.</li>
        <li><a onclick="App.selectTopic('distributions')">Распределения</a> — гистограмма визуализирует эмпирическое распределение.</li>
        <li><a onclick="App.selectTopic('viz-box-plot')">Box plot</a> — компактная альтернатива для сравнения групп.</li>
        <li><a onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a> — более строгая проверка нормальности.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Бимодальное распределение: тайные две группы',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Ты анализируешь рост 500 человек и видишь на гистограмме <b>два пика</b>: один вокруг 165 см, другой вокруг 180 см. Среднее = 172 см, медиана = 172 см. Что это значит?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Интерпретация: бимодальность</h4>
            <p>Два пика — почти всегда признак того, что в данных <b>смешаны две подгруппы</b> с разными характеристиками. Среднее и медиана в таком случае обманчивы: они показывают точку «между» подгруппами, где на самом деле людей меньше всего.</p>
          </div>

          <div class="step" data-step="2">
            <h4>Что могло случиться</h4>
            <ul>
              <li><b>Пол:</b> женщины кучкуются около 165, мужчины — около 180. Смешали без разделения.</li>
              <li><b>Возраст:</b> подростки (ещё не дорастут) + взрослые.</li>
              <li><b>Две разные популяции:</b> данные из двух стран с разным средним.</li>
            </ul>
          </div>

          <div class="step" data-step="3">
            <h4>Что делать</h4>
            <p>Разделить данные по подгруппам и смотреть гистограммы <b>отдельно</b>:</p>
            <ul>
              <li>Если подгруппы известны (пол) — раскрашивай гистограмму по группам.</li>
              <li>Если нет — используй кластеризацию (например, Gaussian Mixture Model).</li>
            </ul>
          </div>

          <div class="answer-box">
            <div class="answer-label">Урок</div>
            <p>Бимодальность — важный диагностический сигнал. Среднее и медиана могут «скрывать» две разные группы. Гистограмма — единственный простой способ это заметить. Box plot бы показал единый «нормальный» ящик — проблема осталась бы невидимой.</p>
          </div>
        `
      },
      {
        title: 'Правый скос: ловушка среднего',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Гистограмма зарплат в компании: основная масса сосредоточена на 50-80 тыс. ₽, но есть длинный хвост до 500 тыс. ₽ (несколько топ-менеджеров). Какую статистику сообщать инвестору?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Расчёт характеристик</h4>
            <ul>
              <li><b>Среднее:</b> 95 тыс. ₽ (сдвинуто вправо из-за топов)</li>
              <li><b>Медиана:</b> 65 тыс. ₽</li>
              <li><b>Мода:</b> 60 тыс. ₽ (самая частая зарплата)</li>
            </ul>
            <p>Разница огромная. «Средняя зарплата 95 тыс.» и «типичная 60-65 тыс.» — это <b>разные истории</b>.</p>
          </div>

          <div class="step" data-step="2">
            <h4>Что показывает гистограмма</h4>
            <p>Гистограмма чётко показывает «холм» в районе 50-80, затем длинный хвост. Это классический правый скос — как логнормальное распределение.</p>
          </div>

          <div class="step" data-step="3">
            <h4>Какую статистику сообщать</h4>
            <ul>
              <li><b>Для инвестора (хочет показать красивую картину):</b> «средняя зарплата 95 тыс.»</li>
              <li><b>Для честного отчёта:</b> «медиана 65 тыс., с несколькими топ-позициями до 500 тыс.»</li>
              <li><b>Лучший вариант:</b> показать <b>гистограмму</b> — пусть зритель сам увидит форму.</li>
            </ul>
          </div>

          <div class="answer-box">
            <div class="answer-label">Урок</div>
            <p>Правый скос — предупреждение: не доверяй среднему. Медиана и гистограмма честнее. Для «скошенных» данных (зарплаты, цены, время отклика) почти всегда смотри медиану + 90-й/95-й перцентиль.</p>
          </div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Число бинов: слишком мало → теряешь моды, слишком много → шум</h3>
        <p>Это <b>главная</b> настройка гистограммы. С 5 бинами ты усредняешь всё в плоскую заливку и не видишь бимодальности. Со 100 бинами каждый столбец — это одно-два наблюдения, и ты «видишь» пики там, где их нет. Попробуй двигать на смеси двух нормальных — там два реальных пика, и настройка бинов показывает/прячет их.</p>
        <div class="sim-container">
          <div class="sim-controls" id="viz-hist-ctrl"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="viz-hist-chart"></canvas></div>
            <div class="sim-stats" id="viz-hist-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const ctrl = container.querySelector('#viz-hist-ctrl');
        const cBins = App.makeControl('range', 'viz-hist-bins', 'Число бинов', { min: 3, max: 100, step: 1, value: 20 });
        const cN = App.makeControl('range', 'viz-hist-n', 'Размер выборки', { min: 50, max: 5000, step: 50, value: 500 });
        const cDist = App.makeControl('select', 'viz-hist-dist', 'Распределение', {
          options: [
            { value: 'normal', label: 'Нормальное' },
            { value: 'bimodal', label: 'Смесь двух нормальных (бимодальное)' },
            { value: 'skewed', label: 'Log-normal (правый скос)' },
            { value: 'uniform', label: 'Равномерное' },
          ],
          value: 'bimodal',
        });
        const cKde = App.makeControl('select', 'viz-hist-kde', 'KDE наложение', {
          options: [{ value: 'no', label: 'Нет' }, { value: 'yes', label: 'Да' }],
          value: 'yes',
        });
        [cBins, cN, cDist, cKde].forEach(c => ctrl.appendChild(c.wrap));
        let chart = null;
        let data = [];
        function regen() {
          const n = +cN.input.value;
          const dist = cDist.input.value;
          if (dist === 'normal') data = App.Util.normalSample(n, 0, 1);
          else if (dist === 'bimodal') {
            data = [];
            for (let i = 0; i < n; i++) data.push(Math.random() < 0.5 ? App.Util.randn(-2, 0.6) : App.Util.randn(2, 0.6));
          } else if (dist === 'skewed') {
            data = [];
            for (let i = 0; i < n; i++) data.push(Math.exp(App.Util.randn(0, 0.7)));
          } else {
            data = [];
            for (let i = 0; i < n; i++) data.push(Math.random() * 6 - 3);
          }
          draw();
        }
        function kde(xs, data, bw) {
          const n = data.length;
          return xs.map(x => {
            let s = 0;
            for (let i = 0; i < n; i++) {
              const u = (x - data[i]) / bw;
              s += Math.exp(-0.5 * u * u);
            }
            return s / (n * bw * Math.sqrt(2 * Math.PI));
          });
        }
        function draw() {
          const bins = +cBins.input.value;
          const lo = App.Util.min(data);
          const hi = App.Util.max(data);
          const h = App.Util.histogram(data, bins, [lo, hi]);
          const binWidth = (hi - lo) / bins;
          // normalize counts to density
          const densities = h.counts.map(c => c / (data.length * binWidth));
          const datasets = [{
            type: 'bar',
            label: 'Histogram density',
            data: densities,
            backgroundColor: 'rgba(59,130,246,0.55)',
            borderColor: 'rgba(59,130,246,1)',
            borderWidth: 1,
          }];
          if (cKde.input.value === 'yes') {
            // Silverman's rule of thumb
            const std = App.Util.std(data);
            const bw = 1.06 * std * Math.pow(data.length, -1 / 5);
            const xs = h.centers;
            const kd = kde(xs, data, bw);
            datasets.push({
              type: 'line',
              label: 'KDE',
              data: kd,
              borderColor: '#ef4444',
              backgroundColor: 'transparent',
              borderWidth: 2.5,
              pointRadius: 0,
              fill: false,
              tension: 0.3,
            });
          }
          const ctx = container.querySelector('#viz-hist-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            data: { labels: h.centers.map(c => c.toFixed(2)), datasets },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: bins + ' бинов, ' + data.length + ' точек' } }, scales: { x: { title: { display: true, text: 'Значение' } }, y: { title: { display: true, text: 'Плотность' }, beginAtZero: true } } },
          });
          App.registerChart(chart);
          // Sturges / Freedman-Diaconis suggestions
          const sturges = Math.ceil(Math.log2(data.length) + 1);
          const q1 = App.Util.quantile(data, 0.25);
          const q3 = App.Util.quantile(data, 0.75);
          const iqr = q3 - q1;
          const fd = Math.max(1, Math.ceil((hi - lo) / (2 * iqr * Math.pow(data.length, -1 / 3))));
          container.querySelector('#viz-hist-stats').innerHTML =
            '<div class="stat-card"><div class="stat-label">Sturges</div><div class="stat-value">' + sturges + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Freedman-Diaconis</div><div class="stat-value">' + fd + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Текущее</div><div class="stat-value">' + bins + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Ширина бина</div><div class="stat-value">' + binWidth.toFixed(3) + '</div></div>';
        }
        cBins.input.addEventListener('input', draw);
        cKde.input.addEventListener('change', draw);
        cN.input.addEventListener('change', regen);
        cDist.input.addEventListener('change', regen);
        regen();
      },
    },

    python: `
<h3>Гистограмма в Python</h3>

<h4>matplotlib — базовая</h4>
<pre><code>import numpy as np
import matplotlib.pyplot as plt

data = np.random.normal(172, 8, 1000)  # рост 1000 человек

fig, ax = plt.subplots(figsize=(8, 5))
ax.hist(data, bins=20, color='#3b82f6', alpha=0.7, edgecolor='#1e40af')
ax.set_xlabel('Рост, см')
ax.set_ylabel('Частота')
ax.set_title('Распределение роста')
plt.show()
</code></pre>

<h4>Сравнение гистограмм (overlay)</h4>
<pre><code>men = np.random.normal(178, 7, 500)
women = np.random.normal(165, 6, 500)

fig, ax = plt.subplots(figsize=(8, 5))
ax.hist(men, bins=25, alpha=0.5, label='Мужчины', color='#3b82f6')
ax.hist(women, bins=25, alpha=0.5, label='Женщины', color='#ec4899')
ax.legend()
ax.set_xlabel('Рост, см')
ax.set_ylabel('Частота')
plt.show()
</code></pre>

<h4>Гистограмма + KDE</h4>
<pre><code>import seaborn as sns

sns.histplot(data, bins=20, kde=True, color='#3b82f6')
plt.title('Гистограмма со сглаженной плотностью (KDE)')
plt.show()
</code></pre>

<h4>Нормализованная гистограмма (density)</h4>
<pre><code># Чтобы сравнить с теоретическим PDF нормального распределения
from scipy import stats

fig, ax = plt.subplots(figsize=(8, 5))
ax.hist(data, bins=20, density=True, alpha=0.6, color='#3b82f6',
        edgecolor='#1e40af', label='Эмпирические данные')

# Теоретический PDF
x = np.linspace(data.min(), data.max(), 200)
pdf = stats.norm.pdf(x, loc=data.mean(), scale=data.std())
ax.plot(x, pdf, 'r-', linewidth=2, label='N(μ, σ²)')
ax.legend()
plt.show()
</code></pre>

<h4>Автоматический выбор числа бинов</h4>
<pre><code># numpy предлагает несколько правил
bins_sturges = np.histogram_bin_edges(data, bins='sturges')
bins_rice = np.histogram_bin_edges(data, bins='rice')
bins_fd = np.histogram_bin_edges(data, bins='fd')  # Freedman-Diaconis
bins_auto = np.histogram_bin_edges(data, bins='auto')

print(f"Sturges:          {len(bins_sturges) - 1} бинов")
print(f"Rice:             {len(bins_rice) - 1} бинов")
print(f"Freedman-Diaconis: {len(bins_fd) - 1} бинов")
print(f"Auto:             {len(bins_auto) - 1} бинов")

# Использовать в matplotlib
plt.hist(data, bins='fd')
</code></pre>

<h4>Логарифмическая ось для скошенных данных</h4>
<pre><code># Доходы с длинным хвостом
incomes = np.random.lognormal(mean=10, sigma=1, size=1000)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
axes[0].hist(incomes, bins=50, color='#f59e0b', alpha=0.7)
axes[0].set_title('Линейная ось — хвост «съел» график')
axes[0].set_xlabel('Доход')

axes[1].hist(incomes, bins=50, color='#f59e0b', alpha=0.7)
axes[1].set_xscale('log')
axes[1].set_title('Логарифмическая ось — форма видна')
axes[1].set_xlabel('Доход (log scale)')
plt.show()
</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Первый шаг EDA.</b> Любая новая числовая колонка — и дата-сайентист первым делом строит гистограмму: есть ли скос, нужен ли log, где хвосты, похоже ли на нормальное. Это «рентген» переменной перед любым моделированием.</li>
        <li><b>Feature engineering и трансформации.</b> Увидел длинный правый хвост у дохода или цены — сразу ясно, что линейной модели нужен <code>log1p</code> или Box-Cox. Без гистограммы такие вещи пропускаешь и удивляешься плохим метрикам.</li>
        <li><b>Контроль качества на производстве.</b> Размеры деталей, вес упаковок, время сборки — гистограмма показывает, лезут ли параметры в допуск и не уехал ли процесс (сдвиг среднего, рост дисперсии, бимодальность из-за двух станков).</li>
        <li><b>Компьютерное зрение.</b> Гистограмма яркостей пикселей — основа автоэкспозиции, эквализации и пороговой бинаризации (метод Оцу). Каждый фоторедактор показывает её в углу.</li>
        <li><b>Финансы и риск.</b> Распределение дневных доходностей актива — сразу видно «толстые хвосты» и асимметрию, которых нет у гауссовской модели. Это первый аргумент против наивного применения VaR через сигмы.</li>
        <li><b>A/B тесты и продуктовая аналитика.</b> Распределение времени сессии, чека, количества действий — часто оказывается мультимодальным (новички vs опытные), и среднее врёт. Гистограмма вскрывает это за 5 секунд.</li>
        <li><b>Биоинформатика и научные данные.</b> Экспрессия генов, длины последовательностей, интенсивности сигналов — всё начинается с гистограммы перед выбором теста.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Универсальность и нулевой порог входа.</b> Гистограмму понимает менеджер, врач, инженер — не нужен статистический бэкграунд. Поэтому её не стыдно вставить в отчёт для нетехнического заказчика: она действительно коммуницирует информацию, а не создаёт видимость аналитики.</p>
      <p><b>Показывает форму целиком.</b> Среднее, медиана, стандартное отклонение — это три числа, которые описывают совершенно разные распределения одинаково. Гистограмма показывает пики, провалы, хвосты, мультимодальность, обрезанные значения (floor/ceiling effects) — всё то, что теряется в числовых сводках.</p>
      <p><b>Выявляет аномалии данных, а не только модели.</b> Пик на 0 или 999 — обычно «магическое значение» (NaN, заполненный сенсор). Обрыв справа — цензурирование. Два одинаковых пика — две группы смешаны. Эти вещи часто важнее, чем результат модели поверх «чистых» данных.</p>
      <p><b>Работает на больших выборках отлично.</b> Чем больше точек, тем гладче картина и точнее оценка плотности. На миллионе точек строится за миллисекунды и не имеет проблем overplotting, как scatter plot.</p>
      <p><b>Легко накладывать эталон.</b> Поверх гистограммы можно нарисовать PDF нормального распределения с теми же $\\mu, \\sigma$ — и сразу видно, где реальность расходится с теорией. Это первый шаг к проверке предпосылок параметрических тестов.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Сильная зависимость от числа бинов.</b> 10 бинов превращают бимодальное распределение в один горб, 200 бинов на тех же данных создают шумный «гребешок», где за формой ничего не разглядишь. Правила Sturges/Freedman-Diaconis помогают, но не спасают — надо всегда пробовать несколько значений <code>bins</code> перед выводами.</p>
      <p><b>Границы бинов произвольны.</b> Сдвиг сетки на полбина может скрыть или проявить пик. Это известная патология: «форма распределения» на самом деле зависит от того, с какой точки ты начал резать ось. KDE лишён этой проблемы, потому что не привязан к сетке.</p>
      <p><b>Бесполезна на маленьких выборках.</b> При $n &lt; 30$ в каждом бине по 1–2 точки, и «форма» — это случайный шум. Легко увидеть «пики», которых в генеральной совокупности нет. Для таких данных нужен strip plot или dot plot, показывающие каждое наблюдение отдельно.</p>
      <p><b>Плохо сравнивает группы.</b> Overlay из 4+ гистограмм — это каша из полупрозрачных прямоугольников. Даже две наложенные гистограммы читаются с трудом, если они перекрываются. Box plot, violin или ridge plot решают эту задачу намного лучше.</p>
      <p><b>Дискретная природа искажает непрерывное.</b> Настоящая плотность гладкая, а гистограмма — кусочно-постоянная. Для презентаций и публикаций, где важна эстетика и точность формы, KDE выглядит и честнее, и приятнее.</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Бери гистограмму когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Первый взгляд на одну числовую переменную — нужна форма, скос, хвосты</td>
          <td>Выборка совсем маленькая ($n &lt; 30$) — будет шум вместо формы, используй strip plot</td>
        </tr>
        <tr>
          <td>Выборка большая ($n &gt; 100$) и нужна надёжная картина плотности</td>
          <td>Надо сравнивать 4+ группы — overlay превратится в кашу, бери box plot или violin</td>
        </tr>
        <tr>
          <td>Решаешь, нужна ли логарифмическая трансформация признака перед моделью</td>
          <td>Нужно формально проверить нормальность — бери Q-Q plot и Shapiro-Wilk</td>
        </tr>
        <tr>
          <td>Ищешь «магические» значения, floor/ceiling, пропуски, закодированные NaN</td>
          <td>Нужна гладкая оценка плотности для публикации — KDE честнее и красивее</td>
        </tr>
        <tr>
          <td>Надо показать распределение нетехническому заказчику — все поймут</td>
          <td>Ось X охватывает несколько порядков — либо log scale, либо другой инструмент</td>
        </tr>
        <tr>
          <td>Контроль качества: проверить, не уехал ли процесс относительно номинала</td>
          <td>Данные имеют естественную 2D-структуру (x, y) — нужен scatter или heatmap</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-kde')">KDE (Kernel Density Estimation)</a></b> — если нужна гладкая оценка плотности без артефактов бинов. Одна кривая вместо столбиков, легко накладывать несколько распределений.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Box plot</a></b> — когда надо параллельно сравнить 3+ группы. Компактно, читаемо, автоматически выделяет выбросы.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-violin-plot')">Violin plot</a></b> — комбинация box plot и KDE: показывает и квартили, и форму. Идеально для сравнения групп, где важна мультимодальность.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a></b> — если задача именно проверить соответствие эталонному распределению (обычно нормальному). Гораздо точнее гистограммы на малых $n$.</li>
        <li><b>Strip plot / dot plot</b> — при $n &lt; 30$. Показывает каждое наблюдение отдельно, ничего не теряется за бинами.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=qBigTkBLU6g" target="_blank">StatQuest: Histograms, Clearly Explained</a></li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Histogram" target="_blank">Wikipedia: Histogram</a></li>
        <li><a href="https://habr.com/ru/search/?q=%D0%B3%D0%B8%D1%81%D1%82%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85" target="_blank">Habr: гистограммы в анализе данных</a></li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.hist.html" target="_blank">matplotlib.pyplot.hist</a></li>
        <li><a href="https://seaborn.pydata.org/generated/seaborn.histplot.html" target="_blank">seaborn.histplot</a></li>
      </ul>
    `
  }
});
