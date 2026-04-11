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
            <text x="100" y="268">150</text>
            <text x="165" y="268">160</text>
            <text x="230" y="268">170</text>
            <text x="295" y="268">175</text>
            <text x="360" y="268">180</text>
            <text x="425" y="268">185</text>
            <text x="490" y="268">190</text>
            <text x="555" y="268">200</text>
          </g>
          <text x="360" y="288" text-anchor="middle" font-size="11" fill="#64748b">Рост, см</text>
          <text x="30" y="150" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 30 150)">Частота</text>
          <!-- Bars: bell-shaped distribution -->
          <!-- Each bar 50px wide -->
          <g fill="#3b82f6" fill-opacity="0.65" stroke="#1e40af" stroke-width="1.2">
            <rect x="75"  y="246" width="52" height="4"/>
            <rect x="128" y="228" width="52" height="22"/>
            <rect x="181" y="196" width="52" height="54"/>
            <rect x="234" y="148" width="52" height="102"/>
            <rect x="287" y="85"  width="52" height="165"/>
            <rect x="340" y="56"  width="52" height="194"/>
            <rect x="393" y="90"  width="52" height="160"/>
            <rect x="446" y="150" width="52" height="100"/>
            <rect x="499" y="200" width="52" height="50"/>
            <rect x="552" y="230" width="52" height="20"/>
            <rect x="605" y="246" width="40" height="4"/>
          </g>
          <!-- Annotations -->
          <line x1="365" y1="56" x2="430" y2="30" stroke="#1e40af" stroke-width="1"/>
          <text x="435" y="30" font-size="11" fill="#1e40af" font-weight="600">пик = мода</text>
          <text x="435" y="44" font-size="9" fill="#64748b">наиболее частое значение</text>
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
      <h3>Где используется гистограмма</h3>
      <table>
        <tr><th>Область</th><th>Применение</th></tr>
        <tr><td><b>EDA (исследовательский анализ)</b></td><td>Первый шаг при работе с любой числовой переменной</td></tr>
        <tr><td><b>Контроль качества</b></td><td>Проверка соответствия параметров производства нормальному распределению</td></tr>
        <tr><td><b>Компьютерное зрение</b></td><td>Гистограмма яркостей пикселей для анализа и улучшения изображений</td></tr>
        <tr><td><b>Обработка сигналов</b></td><td>Анализ шумов, распределения амплитуд</td></tr>
        <tr><td><b>Экономика и финансы</b></td><td>Распределение доходностей, цен, доходов</td></tr>
        <tr><td><b>Биоинформатика</b></td><td>Распределение выражения генов, длин последовательностей</td></tr>
        <tr><td><b>Feature engineering</b></td><td>Понять форму признаков до трансформации (нужен ли log?)</td></tr>
        <tr><td><b>A/B тесты</b></td><td>Сравнение распределений метрик в группах</td></tr>
      </table>
    `,

    proscons: `
      <h3>Плюсы гистограммы</h3>
      <ul>
        <li><b>Универсальный инструмент EDA</b> — первое, что строят для любой переменной</li>
        <li><b>Наглядно показывает форму</b> — пики, хвосты, асимметрию, бимодальность</li>
        <li><b>Интуитивно понятна</b> — не нужен статистический бэкграунд</li>
        <li><b>Выявляет выбросы и аномалии</b></li>
        <li><b>Легко построить</b> в любой библиотеке визуализации</li>
      </ul>

      <h3>Минусы гистограммы</h3>
      <ul>
        <li><b>Зависимость от числа бинов</b> — разные k дают разные картины</li>
        <li><b>Границы бинов произвольны</b> — сдвиг на полбина может изменить форму</li>
        <li><b>Плохо сравнивает группы</b> — overlay из 4+ гистограмм становится нечитаемым</li>
        <li><b>Не работает на очень маленьких выборках</b> (n &lt; 30) — каждый бин 1-2 точки</li>
        <li><b>Дискретная природа</b> — KDE лучше для гладкого распределения</li>
      </ul>

      <h3>🧭 Когда использовать</h3>
      <table>
        <tr><th>Задача</th><th>Использовать?</th></tr>
        <tr><td>Первый взгляд на одну переменную</td><td><b>✅ Идеально</b></td></tr>
        <tr><td>Форма распределения (пики, скос)</td><td>✅ Отлично</td></tr>
        <tr><td>Сравнение 2-3 групп</td><td>⚠️ Overlay работает, но лучше box plot</td></tr>
        <tr><td>Сравнение 5+ групп</td><td>❌ Box plot или violin plot</td></tr>
        <tr><td>Проверка нормальности</td><td>⚠️ Лучше Q-Q plot</td></tr>
        <tr><td>Маленькая выборка (n &lt; 30)</td><td>❌ Strip plot, dot plot</td></tr>
      </table>
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
