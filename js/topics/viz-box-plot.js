/* ==========================================================================
   Глоссарий: Box Plot
   ========================================================================== */
App.registerTopic({
  id: 'viz-box-plot',
  category: 'glossary',
  title: 'Box Plot (ящик с усами)',
  summary: 'Компактная визуализация распределения через квартили: медиана, IQR, выбросы.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты хочешь одним взглядом понять «как распределены зарплаты в компании». Гистограмма покажет форму, но её трудно сравнить с другой компанией. Box plot (ящик с усами) — это <b>стандартизированная карта</b> распределения: пять чисел (минимум, Q1, медиана, Q3, максимум) превращаются в один компактный рисунок.</p>
        <p>Главная сила box plot — <b>сравнение</b>. Нарисовал 5 ящиков рядом — и мгновенно видишь, какая из 5 групп имеет самый высокий медианный уровень, самый большой разброс, самые частые выбросы. Никакая другая диаграмма не даёт такого сжатого и информативного сравнения.</p>
      </div>

      <h3>🎯 Что такое Box Plot</h3>
      <p><b>Box plot</b> (ящик с усами, boxplot) — диаграмма, показывающая распределение числовых данных через <b>пять ключевых характеристик</b>:</p>
      <ul>
        <li><b>Минимум</b> — наименьшее значение (или нижняя граница «усов»)</li>
        <li><b>Q1</b> (нижний квартиль) — 25% данных ниже этого значения</li>
        <li><b>Медиана</b> (Q2) — 50% данных ниже</li>
        <li><b>Q3</b> (верхний квартиль) — 75% данных ниже</li>
        <li><b>Максимум</b> — наибольшее значение (или верхняя граница «усов»)</li>
      </ul>
      <p>Всё, что выходит за пределы усов, рисуется отдельными точками — это <b>выбросы</b>.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 360" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#1e293b">Анатомия Box Plot</text>
          <!-- Axis -->
          <line x1="80" y1="200" x2="620" y2="200" stroke="#475569" stroke-width="1.5"/>
          <g font-size="10" fill="#64748b" text-anchor="middle">
            <text x="80" y="220">0</text>
            <text x="170" y="220">20</text>
            <text x="260" y="220">40</text>
            <text x="350" y="220">60</text>
            <text x="440" y="220">80</text>
            <text x="530" y="220">100</text>
            <text x="620" y="220">120</text>
          </g>
          <!-- Lower whisker -->
          <line x1="170" y1="150" x2="260" y2="150" stroke="#475569" stroke-width="2"/>
          <line x1="170" y1="135" x2="170" y2="165" stroke="#475569" stroke-width="2"/>
          <!-- Box: Q1 to Q3 -->
          <rect x="260" y="105" width="180" height="90" fill="#3b82f6" fill-opacity="0.25" stroke="#1e40af" stroke-width="2.5"/>
          <!-- Median line -->
          <line x1="330" y1="105" x2="330" y2="195" stroke="#1e40af" stroke-width="3.5"/>
          <!-- Upper whisker -->
          <line x1="440" y1="150" x2="530" y2="150" stroke="#475569" stroke-width="2"/>
          <line x1="530" y1="135" x2="530" y2="165" stroke="#475569" stroke-width="2"/>
          <!-- Outliers -->
          <circle cx="590" cy="150" r="5" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>
          <circle cx="120" cy="150" r="5" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>
          <!-- Labels -->
          <line x1="120" y1="130" x2="120" y2="100" stroke="#dc2626" stroke-width="1"/>
          <text x="120" y="92" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">нижний выброс</text>
          <line x1="170" y1="135" x2="170" y2="75" stroke="#64748b" stroke-width="1"/>
          <text x="170" y="68" text-anchor="middle" font-size="11" font-weight="600" fill="#475569">нижний ус</text>
          <text x="170" y="82" text-anchor="middle" font-size="9" fill="#64748b">минимум</text>
          <line x1="260" y1="105" x2="260" y2="50" stroke="#1e40af" stroke-width="1"/>
          <text x="260" y="42" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Q1</text>
          <text x="260" y="55" text-anchor="middle" font-size="9" fill="#64748b">25-й перцентиль</text>
          <line x1="330" y1="105" x2="330" y2="30" stroke="#1e40af" stroke-width="1"/>
          <text x="330" y="22" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">Медиана (Q2)</text>
          <line x1="440" y1="105" x2="440" y2="50" stroke="#1e40af" stroke-width="1"/>
          <text x="440" y="42" text-anchor="middle" font-size="11" font-weight="600" fill="#1e40af">Q3</text>
          <text x="440" y="55" text-anchor="middle" font-size="9" fill="#64748b">75-й перцентиль</text>
          <line x1="530" y1="135" x2="530" y2="75" stroke="#64748b" stroke-width="1"/>
          <text x="530" y="68" text-anchor="middle" font-size="11" font-weight="600" fill="#475569">верхний ус</text>
          <text x="530" y="82" text-anchor="middle" font-size="9" fill="#64748b">максимум</text>
          <line x1="590" y1="130" x2="590" y2="100" stroke="#dc2626" stroke-width="1"/>
          <text x="590" y="92" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">верхний выброс</text>
          <!-- IQR brace -->
          <line x1="260" y1="260" x2="440" y2="260" stroke="#059669" stroke-width="1.5"/>
          <line x1="260" y1="255" x2="260" y2="265" stroke="#059669" stroke-width="1.5"/>
          <line x1="440" y1="255" x2="440" y2="265" stroke="#059669" stroke-width="1.5"/>
          <text x="350" y="278" text-anchor="middle" font-size="12" font-weight="700" fill="#059669">IQR = Q3 − Q1</text>
          <text x="350" y="293" text-anchor="middle" font-size="9" fill="#059669">(центральные 50% данных)</text>
          <!-- Outlier rule -->
          <text x="350" y="325" text-anchor="middle" font-size="10" fill="#64748b">Границы усов: Q1 − 1.5·IQR и Q3 + 1.5·IQR</text>
          <text x="350" y="340" text-anchor="middle" font-size="10" fill="#64748b">Точки вне этих границ = выбросы</text>
        </svg>
        <div class="caption">Полная анатомия box plot. Ящик охватывает центральные 50% данных (IQR), линия внутри — медиана, усы тянутся до крайних «нормальных» значений, отдельные точки — выбросы.</div>
      </div>

      <h3>📐 Как определяются выбросы</h3>
      <p>Правило Тьюки (Tukey's fences):</p>
      <ul>
        <li><b>Нижняя граница уса:</b> $Q_1 - 1.5 \\cdot \\text{IQR}$</li>
        <li><b>Верхняя граница уса:</b> $Q_3 + 1.5 \\cdot \\text{IQR}$</li>
      </ul>
      <p>Всё, что за этими границами — <b>выбросы</b> (outliers). Усы не обязательно доходят до min/max — они обрываются на последней «нормальной» точке внутри границ.</p>

      <div class="key-concept">
        <div class="kc-label">Почему именно 1.5·IQR?</div>
        <p>Для нормального распределения граница Q3 + 1.5·IQR соответствует примерно 99.3-му перцентилю. То есть только ~0.7% данных от нормального распределения попадут за эту границу.</p>
        <p>Если у тебя 1000 нормально распределённых точек, ожидаешь увидеть ~7 «выбросов» просто случайно. Если их намного больше — распределение ненормально, хвосты тяжелее.</p>
      </div>

      <h3>🔍 Как читать box plot</h3>
      <table>
        <tr><th>Что видишь</th><th>Что это значит</th></tr>
        <tr><td>Медиана в центре ящика</td><td>Распределение симметрично</td></tr>
        <tr><td>Медиана ближе к Q1 (нижняя часть)</td><td>Правый скос (хвост тянется вверх)</td></tr>
        <tr><td>Медиана ближе к Q3 (верхняя часть)</td><td>Левый скос (хвост тянется вниз)</td></tr>
        <tr><td>Очень длинные усы</td><td>Большой разброс, возможно тяжёлые хвосты</td></tr>
        <tr><td>Короткие усы, узкий ящик</td><td>Данные сильно сконцентрированы</td></tr>
        <tr><td>Много точек за усами</td><td>Много выбросов → не нормальное распределение</td></tr>
        <tr><td>Точки только с одной стороны</td><td>Односторонние выбросы → скос</td></tr>
      </table>

      <h3>📊 Сравнение нескольких групп</h3>
      <p>Главная суперспособность box plot — <b>параллельное сравнение</b>:</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Зарплаты в 4 отделах компании</text>
          <!-- Y axis -->
          <line x1="80" y1="50" x2="80" y2="250" stroke="#475569" stroke-width="1.5"/>
          <line x1="80" y1="250" x2="680" y2="250" stroke="#475569" stroke-width="1.5"/>
          <g font-size="10" fill="#64748b" text-anchor="end">
            <text x="75" y="254">0</text>
            <text x="75" y="209">50</text>
            <text x="75" y="165">100</text>
            <text x="75" y="121">150</text>
            <text x="75" y="77">200</text>
            <text x="75" y="54">250</text>
          </g>
          <text x="35" y="150" font-size="11" fill="#64748b" text-anchor="middle" transform="rotate(-90 35 150)">Зарплата (тыс. ₽)</text>
          <!-- Dept 1: Junior devs (narrow, low) -->
          <g>
            <line x1="180" y1="215" x2="180" y2="195" stroke="#475569"/>
            <line x1="165" y1="215" x2="195" y2="215" stroke="#475569"/>
            <rect x="155" y="170" width="50" height="30" fill="#60a5fa" fill-opacity="0.4" stroke="#1e40af" stroke-width="2"/>
            <line x1="155" y1="183" x2="205" y2="183" stroke="#1e40af" stroke-width="3"/>
            <line x1="180" y1="170" x2="180" y2="158" stroke="#475569"/>
            <line x1="165" y1="158" x2="195" y2="158" stroke="#475569"/>
            <text x="180" y="275" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">Стажёры</text>
            <text x="180" y="290" text-anchor="middle" font-size="9" fill="#64748b">n=15, med≈80</text>
          </g>
          <!-- Dept 2: Middle devs (medium) -->
          <g>
            <line x1="310" y1="195" x2="310" y2="170" stroke="#475569"/>
            <line x1="295" y1="195" x2="325" y2="195" stroke="#475569"/>
            <rect x="285" y="130" width="50" height="50" fill="#34d399" fill-opacity="0.4" stroke="#047857" stroke-width="2"/>
            <line x1="285" y1="150" x2="335" y2="150" stroke="#047857" stroke-width="3"/>
            <line x1="310" y1="130" x2="310" y2="110" stroke="#475569"/>
            <line x1="295" y1="110" x2="325" y2="110" stroke="#475569"/>
            <text x="310" y="275" text-anchor="middle" font-size="11" fill="#047857" font-weight="600">Middle</text>
            <text x="310" y="290" text-anchor="middle" font-size="9" fill="#64748b">n=30, med≈120</text>
          </g>
          <!-- Dept 3: Senior devs (wide) -->
          <g>
            <line x1="440" y1="175" x2="440" y2="135" stroke="#475569"/>
            <line x1="425" y1="175" x2="455" y2="175" stroke="#475569"/>
            <rect x="415" y="75" width="50" height="70" fill="#fbbf24" fill-opacity="0.4" stroke="#92400e" stroke-width="2"/>
            <line x1="415" y1="105" x2="465" y2="105" stroke="#92400e" stroke-width="3"/>
            <line x1="440" y1="75" x2="440" y2="60" stroke="#475569"/>
            <line x1="425" y1="60" x2="455" y2="60" stroke="#475569"/>
            <!-- Outlier -->
            <circle cx="440" cy="55" r="4" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/>
            <text x="440" y="275" text-anchor="middle" font-size="11" fill="#92400e" font-weight="600">Senior</text>
            <text x="440" y="290" text-anchor="middle" font-size="9" fill="#64748b">n=20, med≈165</text>
          </g>
          <!-- Dept 4: Executives (high, wide, 2 outliers) -->
          <g>
            <line x1="580" y1="150" x2="580" y2="115" stroke="#475569"/>
            <line x1="565" y1="150" x2="595" y2="150" stroke="#475569"/>
            <rect x="555" y="70" width="50" height="50" fill="#c084fc" fill-opacity="0.4" stroke="#6b21a8" stroke-width="2"/>
            <line x1="555" y1="95" x2="605" y2="95" stroke="#6b21a8" stroke-width="3"/>
            <line x1="580" y1="70" x2="580" y2="60" stroke="#475569"/>
            <line x1="565" y1="60" x2="595" y2="60" stroke="#475569"/>
            <circle cx="580" cy="55" r="4" fill="#dc2626" stroke="#7f1d1d" stroke-width="1"/>
            <text x="580" y="275" text-anchor="middle" font-size="11" fill="#6b21a8" font-weight="600">C-level</text>
            <text x="580" y="290" text-anchor="middle" font-size="9" fill="#64748b">n=5, med≈180</text>
          </g>
        </svg>
        <div class="caption">Один взгляд — и все выводы: стажёры получают меньше всех с маленьким разбросом, senior имеют большой разброс и один выброс, C-level — самые высокие зарплаты. Попробуй вытащить эту информацию из гистограммы так же быстро.</div>
      </div>

      <h3>🎨 Вариации box plot</h3>
      <ul>
        <li><b>Notched box plot</b> — ящик с «выемкой» на уровне медианы, показывает её доверительный интервал. Если выемки двух ящиков не пересекаются — медианы статистически различны.</li>
        <li><b>Violin plot</b> — комбинация box plot + density plot. Показывает не только квартили, но и форму распределения. См. отдельную тему.</li>
        <li><b>Strip plot / swarm plot</b> — добавляют поверх box plot точки сырых данных, чтобы не терять детали.</li>
        <li><b>Letter-value plot</b> — расширение на много квантилей (октили, гексадецили). Для больших выборок точнее показывает хвосты.</li>
      </ul>

      <h3>⚠️ Ограничения box plot</h3>
      <ul>
        <li><b>Не показывает бимодальность</b> — если в данных два пика, box plot выглядит так же, как у одномодального. Всегда смотри дополнительно на гистограмму/KDE.</li>
        <li><b>Выбросы зависят от правила</b> — стандарт 1.5·IQR условен. Для тяжёлых хвостов это правило пометит слишком много точек как выбросы.</li>
        <li><b>Не подходит для дискретных данных с маленьким диапазоном</b> — квартили могут совпадать.</li>
        <li><b>Маленькие выборки</b> — при n&lt;10 box plot ненадёжен, квартили нестабильны.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Усы всегда до min/max»</b> — нет, усы ограничены правилом 1.5·IQR. До min/max доходят только в отсутствии выбросов.</li>
        <li><b>«Точки вне усов = ошибочные данные»</b> — не обязательно. Это просто экстремальные значения. Для тяжёлых хвостов они нормальны.</li>
        <li><b>«Box plot заменяет гистограмму»</b> — нет, они дополняют друг друга. Box plot хорош для сравнения, гистограмма — для формы.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('descriptive-stats')">Описательная статистика</a> — квартили, IQR, выбросы.</li>
        <li><a onclick="App.selectTopic('viz-histogram')">Гистограмма</a> — дополняет box plot формой.</li>
        <li><a onclick="App.selectTopic('viz-violin-plot')">Violin plot</a> — расширение box plot с формой распределения.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Ручное построение box plot',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Построить box plot для выборки из 15 зарплат (тыс. ₽): 45, 50, 52, 55, 58, 60, 62, 65, 68, 70, 75, 80, 85, 120, 250.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Отсортировать данные</h4>
            <p>Данные уже отсортированы. n = 15.</p>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Найти квартили</h4>
            <div class="calc">Q2 (медиана) = 8-й элемент = 65
Q1 = медиана первой половины (1-й..7-й элемент) = 4-й = 55
Q3 = медиана второй половины (9-й..15-й элемент) = 12-й = 80</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Посчитать IQR</h4>
            <div class="calc">IQR = Q3 − Q1 = 80 − 55 = <b>25</b></div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Границы усов (правило Тьюки)</h4>
            <div class="calc">Нижняя: Q1 − 1.5·IQR = 55 − 37.5 = 17.5
Верхняя: Q3 + 1.5·IQR = 80 + 37.5 = 117.5</div>
            <p>Всё, что ниже 17.5 или выше 117.5, — выбросы.</p>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Определить выбросы и усы</h4>
            <p>Значения 120 и 250 &gt; 117.5 → <b>выбросы</b>.</p>
            <p>Нижний ус — минимальное значение, не являющееся выбросом: 45 (всё в пределах).</p>
            <p>Верхний ус — максимальное значение ≤ 117.5: 85.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Box plot</div>
            <p>Нижний ус = 45, Q1 = 55, медиана = 65, Q3 = 80, верхний ус = 85. Выбросы: 120, 250.</p>
            <p>Асимметрия: медиана ближе к Q1, расстояние Q3→верхний ус (5) меньше, чем Q1→нижний ус (10) → лёгкий правый скос. Но выбросы на 120 и 250 — явный знак тяжёлого правого хвоста (вероятно, зарплаты руководителей).</p>
          </div>
        `
      },
      {
        title: 'Сравнение трёх групп',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>У нас три A/B-варианта лендинга. Время на странице (секунды):</p>
            <ul>
              <li><b>Контроль A:</b> med=42, IQR=[30, 55], усы [15, 80]</li>
              <li><b>Вариант B:</b> med=55, IQR=[35, 70], усы [15, 110], 3 выброса &gt; 200</li>
              <li><b>Вариант C:</b> med=48, IQR=[40, 58], усы [25, 75], без выбросов</li>
            </ul>
            <p>Какой вариант «лучше»?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Анализ медианы</h4>
            <p>B имеет самую высокую медиану (55), C — вторая (48), A — самая низкая (42). С первого взгляда B «лучше».</p>
          </div>

          <div class="step" data-step="2">
            <h4>Анализ разброса (IQR)</h4>
            <ul>
              <li>A: IQR = 25</li>
              <li>B: IQR = 35 (самый большой разброс)</li>
              <li>C: IQR = 18 (самый малый)</li>
            </ul>
            <p>C — самый стабильный вариант: пользователи ведут себя предсказуемо.</p>
          </div>

          <div class="step" data-step="3">
            <h4>Анализ выбросов</h4>
            <p>В B есть 3 выброса &gt; 200 секунд. Это может означать:</p>
            <ul>
              <li>Кто-то открыл страницу и ушёл на обед (мусорные данные)</li>
              <li>Часть пользователей действительно зависла в чтении</li>
              <li>Или медиана B «завышена» из-за длинного хвоста</li>
            </ul>
            <p>Медиана устойчива к выбросам, но стоит проверить: если убрать топ-5% — как изменится результат?</p>
          </div>

          <div class="step" data-step="4">
            <h4>Решение</h4>
            <div class="why">B даёт лучшую медиану, но с большим разбросом и выбросами — риск, что «среднестатистический» пользователь получает хуже опыт, чем median говорит. C — более надёжный выбор: стабильная метрика без выбросов, медиана лишь немного хуже B.</div>
            <p>Нужно копнуть глубже: посмотреть гистограмму, 90-й перцентиль, конверсию на следующий шаг.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Вывод</div>
            <p>Box plot показал: B выглядит лучше по медиане, но имеет высокий разброс и выбросы; C — стабильный кандидат. Нельзя решать только по медиане — форма распределения критична.</p>
          </div>
        `
      }
    ],

    python: `
<h3>Box Plot в Python</h3>

<h4>matplotlib — базовый</h4>
<pre><code>import matplotlib.pyplot as plt
import numpy as np

data = [45, 50, 52, 55, 58, 60, 62, 65, 68, 70, 75, 80, 85, 120, 250]

fig, ax = plt.subplots(figsize=(6, 5))
ax.boxplot(data, vert=True, patch_artist=True,
           boxprops=dict(facecolor='#3b82f6', alpha=0.4),
           medianprops=dict(color='#1e40af', linewidth=2.5))
ax.set_ylabel('Зарплата (тыс. ₽)')
ax.set_title('Распределение зарплат')
plt.show()
</code></pre>

<h4>seaborn — сравнение групп</h4>
<pre><code>import seaborn as sns
import pandas as pd

df = pd.DataFrame({
    'отдел': ['Junior']*15 + ['Middle']*30 + ['Senior']*20 + ['C-level']*5,
    'зарплата': list(np.random.normal(80, 15, 15)) +
                list(np.random.normal(120, 25, 30)) +
                list(np.random.normal(165, 35, 20)) +
                list(np.random.normal(200, 40, 5))
})

fig, ax = plt.subplots(figsize=(9, 6))
sns.boxplot(data=df, x='отдел', y='зарплата',
            order=['Junior', 'Middle', 'Senior', 'C-level'],
            palette='viridis', ax=ax)
sns.stripplot(data=df, x='отдел', y='зарплата',
              order=['Junior', 'Middle', 'Senior', 'C-level'],
              color='black', alpha=0.3, size=4, ax=ax)
ax.set_title('Зарплаты по отделам')
plt.show()
</code></pre>

<h4>Notched box plot с доверительным интервалом</h4>
<pre><code># Notches показывают 95% CI для медианы
# Если notches двух групп не пересекаются — медианы статистически различны
fig, ax = plt.subplots()
sns.boxplot(data=df, x='отдел', y='зарплата', notch=True, ax=ax)
plt.show()
</code></pre>

<h4>Получить числовые значения квартилей</h4>
<pre><code>import numpy as np

data = np.array([45, 50, 52, 55, 58, 60, 62, 65, 68, 70, 75, 80, 85, 120, 250])

Q1 = np.percentile(data, 25)
Q2 = np.percentile(data, 50)  # медиана
Q3 = np.percentile(data, 75)
IQR = Q3 - Q1

lower_fence = Q1 - 1.5 * IQR
upper_fence = Q3 + 1.5 * IQR

outliers = data[(data < lower_fence) | (data > upper_fence)]

print(f"Q1 = {Q1}, Медиана = {Q2}, Q3 = {Q3}")
print(f"IQR = {IQR}")
print(f"Границы усов: [{lower_fence}, {upper_fence}]")
print(f"Выбросы: {outliers}")
</code></pre>

<h4>Удаление выбросов через IQR</h4>
<pre><code>def remove_outliers_iqr(data):
    Q1 = np.percentile(data, 25)
    Q3 = np.percentile(data, 75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    return data[(data >= lower) & (data <= upper)]

cleaned = remove_outliers_iqr(data)
print(f"До: {len(data)} точек, после: {len(cleaned)} точек")
</code></pre>
    `,

    applications: `
      <h3>Где используется Box Plot</h3>
      <table>
        <tr><th>Область</th><th>Применение</th></tr>
        <tr><td><b>Исследовательский анализ (EDA)</b></td><td>Первый шаг любого анализа — взглянуть на распределение и выбросы</td></tr>
        <tr><td><b>A/B тестирование</b></td><td>Сравнение распределения метрики по группам</td></tr>
        <tr><td><b>Контроль качества</b></td><td>Сравнение параметров продукции по партиям</td></tr>
        <tr><td><b>Медицинские исследования</b></td><td>Сравнение показателей пациентов по группам лечения</td></tr>
        <tr><td><b>HR-аналитика</b></td><td>Сравнение зарплат, стажа, KPI по отделам</td></tr>
        <tr><td><b>Финансы</b></td><td>Распределение доходностей, сравнение портфелей</td></tr>
        <tr><td><b>Образование</b></td><td>Сравнение оценок по классам, школам, регионам</td></tr>
        <tr><td><b>Feature engineering</b></td><td>Обнаружение выбросов перед обучением модели</td></tr>
      </table>
    `,

    proscons: `
      <h3>Плюсы Box Plot</h3>
      <ul>
        <li><b>Компактный</b> — вся картина распределения на 1 ячейке</li>
        <li><b>Отлично сравнивает группы</b> — нет лучшего инструмента для параллельного сравнения 3+ групп</li>
        <li><b>Устойчив к выбросам</b> — квартили не зависят от экстремумов</li>
        <li><b>Автоматически выявляет выбросы</b> — правило 1.5·IQR встроено</li>
        <li><b>Универсальный стандарт</b> — понятен всем аналитикам</li>
      </ul>

      <h3>Минусы Box Plot</h3>
      <ul>
        <li><b>Скрывает бимодальность</b> — не видно, что у распределения два пика</li>
        <li><b>Теряет детали формы</b> — симметричное и слегка скошенное могут выглядеть одинаково</li>
        <li><b>Не работает на маленьких n</b> (&lt; 10) — квартили нестабильны</li>
        <li><b>Правило 1.5·IQR субъективно</b> — для тяжёлых хвостов помечает много «выбросов»</li>
      </ul>

      <h3>🧭 Когда использовать</h3>
      <table>
        <tr><th>Задача</th><th>Подходит?</th></tr>
        <tr><td>Сравнение 3+ групп по числовой метрике</td><td><b>✅ Идеально</b></td></tr>
        <tr><td>Обзорный EDA одной переменной</td><td>✅ Отлично</td></tr>
        <tr><td>Обнаружение выбросов</td><td>✅ Хорошо</td></tr>
        <tr><td>Понять форму одного распределения</td><td>⚠️ Лучше гистограмма</td></tr>
        <tr><td>Обнаружить бимодальность</td><td>❌ Используй violin plot или KDE</td></tr>
        <tr><td>Маленькая выборка (n &lt; 20)</td><td>❌ Используй strip plot</td></tr>
      </table>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=fHLhBnmwUM0" target="_blank">StatQuest: Boxplots, Clearly Explained</a></li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Box_plot" target="_blank">Wikipedia: Box plot</a></li>
        <li><a href="https://habr.com/ru/search/?q=box%20plot%20%D1%8F%D1%89%D0%B8%D0%BA%20%D1%81%20%D1%83%D1%81%D0%B0%D0%BC%D0%B8" target="_blank">Habr: Box plot в анализе данных</a></li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.boxplot.html" target="_blank">matplotlib.pyplot.boxplot</a></li>
        <li><a href="https://seaborn.pydata.org/generated/seaborn.boxplot.html" target="_blank">seaborn.boxplot</a></li>
      </ul>
    `
  }
});
