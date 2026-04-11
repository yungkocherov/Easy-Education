/* ==========================================================================
   Глоссарий: Violin Plot
   ========================================================================== */
App.registerTopic({
  id: 'viz-violin-plot',
  category: 'viz',
  title: 'Violin Plot',
  summary: 'Гибрид box plot и density plot: показывает и квартили, и форму распределения.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Box plot отлично показывает квартили и выбросы, но скрывает форму. Density plot (KDE) показывает форму, но скрывает квартили. <b>Violin plot</b> — это «лучшее из двух миров»: получаешь симметричный density plot (форма похожа на скрипку) плюс встроенный box plot по центру.</p>
        <p>На одном графике сразу: медиана, квартили, выбросы <b>и</b> форма распределения — моды, хвосты, симметрия, бимодальность. Особенно полезен, когда ты сравниваешь группы и подозреваешь, что у каждой своя форма.</p>
      </div>

      <h3>🎯 Что такое Violin Plot</h3>
      <p>Violin plot — это <b>зеркально отражённый KDE</b>: плотность распределения рисуется симметрично слева и справа от центральной линии. В результате ширина «скрипки» в точке = плотность данных в этом значении.</p>
      <p>Внутри часто рисуют либо box plot (ящик + усы + медиана), либо просто линию медианы и квартили.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Анатомия Violin Plot</text>
          <!-- Y axis -->
          <line x1="80" y1="50" x2="80" y2="270" stroke="#475569" stroke-width="1.5"/>
          <line x1="80" y1="270" x2="620" y2="270" stroke="#475569" stroke-width="1.5"/>
          <!-- Violin shape: wide in middle (center), narrow at top and bottom -->
          <g transform="translate(250,0)">
            <path d="M0,260 C-20,258 -35,245 -40,220 C-45,200 -55,180 -60,155 C-65,130 -55,100 -45,80 C-30,55 -5,50 0,50 C5,50 30,55 45,80 C55,100 65,130 60,155 C55,180 45,200 40,220 C35,245 20,258 0,260 Z" fill="#a78bfa" fill-opacity="0.4" stroke="#7c3aed" stroke-width="2"/>
            <!-- Inner box plot -->
            <rect x="-12" y="120" width="24" height="60" fill="#7c3aed" fill-opacity="0.7" stroke="#4c1d95" stroke-width="1.5"/>
            <line x1="-12" y1="150" x2="12" y2="150" stroke="white" stroke-width="2.5"/>
            <circle cx="0" cy="150" r="3" fill="white"/>
            <!-- Whiskers -->
            <line x1="0" y1="120" x2="0" y2="85" stroke="#4c1d95" stroke-width="1.5"/>
            <line x1="-6" y1="85" x2="6" y2="85" stroke="#4c1d95" stroke-width="1.5"/>
            <line x1="0" y1="180" x2="0" y2="220" stroke="#4c1d95" stroke-width="1.5"/>
            <line x1="-6" y1="220" x2="6" y2="220" stroke="#4c1d95" stroke-width="1.5"/>
          </g>
          <!-- Annotations -->
          <!-- Outer shape -->
          <line x1="310" y1="155" x2="420" y2="120" stroke="#7c3aed" stroke-width="1"/>
          <text x="425" y="115" font-size="11" font-weight="600" fill="#7c3aed">форма плотности</text>
          <text x="425" y="128" font-size="9" fill="#64748b">(зеркальный KDE)</text>
          <line x1="195" y1="155" x2="95" y2="125" stroke="#7c3aed" stroke-width="1"/>
          <text x="93" y="120" text-anchor="end" font-size="11" fill="#7c3aed">ширина = плотность</text>
          <text x="93" y="133" text-anchor="end" font-size="9" fill="#64748b">(больше точек здесь)</text>
          <!-- Inner box -->
          <line x1="262" y1="150" x2="150" y2="200" stroke="#4c1d95" stroke-width="1"/>
          <text x="145" y="200" text-anchor="end" font-size="11" fill="#4c1d95">медиана</text>
          <line x1="262" y1="135" x2="470" y2="200" stroke="#4c1d95" stroke-width="1"/>
          <text x="475" y="200" font-size="11" fill="#4c1d95">Q1 и Q3 (ящик)</text>
          <line x1="250" y1="85" x2="130" y2="70" stroke="#4c1d95" stroke-width="1"/>
          <text x="125" y="70" text-anchor="end" font-size="11" fill="#4c1d95">границы усов</text>
          <!-- Labels on axis -->
          <g font-size="10" fill="#64748b" text-anchor="end">
            <text x="75" y="274">0</text>
            <text x="75" y="220">25</text>
            <text x="75" y="165">50</text>
            <text x="75" y="110">75</text>
            <text x="75" y="55">100</text>
          </g>
          <text x="35" y="160" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 35 160)">Значение</text>
        </svg>
        <div class="caption">Violin plot = симметричный KDE (фиолетовая форма) + внутренний box plot (тёмный ящик с медианой, квартилями, усами). В одном графике — форма и статистики.</div>
      </div>

      <h3>📊 Главное преимущество: бимодальность</h3>
      <p>Box plot не различает unimodal и bimodal распределения — ящик и усы одинаковы. Violin plot сразу показывает два пика:</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 300" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Box plot vs Violin plot: один и тот же датасет</text>
          <!-- Box plot -->
          <g>
            <text x="180" y="40" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">Box plot — выглядит нормально</text>
            <line x1="80" y1="255" x2="280" y2="255" stroke="#475569"/>
            <line x1="80" y1="60" x2="80" y2="255" stroke="#475569"/>
            <!-- Single box -->
            <rect x="160" y="115" width="40" height="100" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
            <line x1="160" y1="165" x2="200" y2="165" stroke="#dc2626" stroke-width="3"/>
            <line x1="180" y1="115" x2="180" y2="75" stroke="#dc2626" stroke-width="2"/>
            <line x1="170" y1="75" x2="190" y2="75" stroke="#dc2626" stroke-width="2"/>
            <line x1="180" y1="215" x2="180" y2="240" stroke="#dc2626" stroke-width="2"/>
            <line x1="170" y1="240" x2="190" y2="240" stroke="#dc2626" stroke-width="2"/>
            <text x="180" y="280" text-anchor="middle" font-size="10" fill="#64748b">Вид обычный —</text>
            <text x="180" y="293" text-anchor="middle" font-size="10" fill="#64748b">и ничего не подозреваешь</text>
          </g>
          <!-- Violin plot (bimodal) -->
          <g transform="translate(360,0)">
            <text x="180" y="40" text-anchor="middle" font-size="11" font-weight="600" fill="#059669">Violin plot — 2 пика!</text>
            <line x1="80" y1="255" x2="280" y2="255" stroke="#475569"/>
            <line x1="80" y1="60" x2="80" y2="255" stroke="#475569"/>
            <!-- Bimodal violin (2 bulges) -->
            <g transform="translate(180,0)">
              <path d="M0,240 C-10,238 -20,230 -15,215 C-5,200 -30,180 -40,155 C-50,130 -25,115 -5,100 C5,90 0,78 0,75 C0,78 -5,90 5,100 C25,115 50,130 40,155 C30,180 5,200 15,215 C20,230 10,238 0,240 Z" fill="#bbf7d0" fill-opacity="0.6" stroke="#059669" stroke-width="2"/>
              <!-- Inner box plot, centered but showing overall stats -->
              <rect x="-8" y="115" width="16" height="100" fill="#059669" fill-opacity="0.6" stroke="#064e3b" stroke-width="1.5"/>
              <line x1="-8" y1="165" x2="8" y2="165" stroke="white" stroke-width="2.5"/>
            </g>
            <text x="180" y="280" text-anchor="middle" font-size="10" fill="#64748b">2 пика видны сразу —</text>
            <text x="180" y="293" text-anchor="middle" font-size="10" fill="#64748b">в данных 2 подгруппы</text>
          </g>
        </svg>
        <div class="caption">На одинаковом бимодальном датасете box plot (слева) выглядит обычно — медиана, квартили, усы в норме. Violin plot (справа) сразу показывает: в данных 2 кластера. Именно поэтому violin лучше для сложных распределений.</div>
      </div>

      <h3>🎨 Варианты Violin Plot</h3>
      <ul>
        <li><b>Split violin</b> — половинки violin показывают разные группы (например, мужчины/женщины).</li>
        <li><b>Inner: box</b> — внутри обычный box plot (по умолчанию).</li>
        <li><b>Inner: stick/quartile</b> — показывают линиями квартили без ящика.</li>
        <li><b>Inner: point</b> — показывают каждую точку сырых данных.</li>
        <li><b>Bandwidth параметр</b> — управляет сглаженностью KDE (как бины у гистограммы).</li>
      </ul>

      <h3>⚠️ Ограничения и подводные камни</h3>
      <ul>
        <li><b>KDE может исказить концы</b> — на границах распределения KDE создаёт «хвосты», которых в данных нет. Обрезай до min/max.</li>
        <li><b>Выбор bandwidth</b> — слишком малый = шум, слишком большой = сглаживает всё.</li>
        <li><b>Не подходит для маленьких n</b> (&lt; 30) — KDE становится ненадёжным.</li>
        <li><b>Новичкам трудно читать</b> — не все аналитики понимают с первого взгляда.</li>
        <li><b>Overkill для простых данных</b> — если распределение явно унимодальное, box plot проще.</li>
      </ul>

      <h3>🧭 Когда использовать</h3>
      <table>
        <tr><th>Задача</th><th>Лучший выбор</th></tr>
        <tr><td>Сравнение 3-5 групп с сложной формой</td><td><b>Violin plot</b></td></tr>
        <tr><td>Обнаружение бимодальности</td><td><b>Violin plot</b> или гистограмма</td></tr>
        <tr><td>Простое сравнение медиан</td><td>Box plot (проще)</td></tr>
        <tr><td>Публикация для широкой аудитории</td><td>Box plot (более известен)</td></tr>
        <tr><td>Много групп (10+)</td><td>Box plot (violin станет слишком плотным)</td></tr>
      </table>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('viz-box-plot')">Box Plot</a> — родитель и главная альтернатива.</li>
        <li><a onclick="App.selectTopic('viz-histogram')">Гистограмма</a> — показывает форму, но труднее сравнивать группы.</li>
        <li><a onclick="App.selectTopic('descriptive-stats')">Описательная статистика</a> — квартили, плотность.</li>
      </ul>
    `,

    python: `
<h3>Violin Plot в Python</h3>

<h4>seaborn — самый простой</h4>
<pre><code>import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# Сгенерируем бимодальные данные для одной группы
np.random.seed(42)
group_A = np.concatenate([
    np.random.normal(40, 5, 100),
    np.random.normal(70, 5, 100)
])  # 2 пика
group_B = np.random.normal(55, 10, 200)  # унимодальная
group_C = np.random.normal(60, 15, 200)  # шире

df = pd.DataFrame({
    'value': np.concatenate([group_A, group_B, group_C]),
    'group': ['A']*200 + ['B']*200 + ['C']*200
})

fig, ax = plt.subplots(figsize=(8, 5))
sns.violinplot(data=df, x='group', y='value', palette='Set2', ax=ax)
ax.set_title('Сравнение трёх групп: группа A бимодальна!')
plt.show()
</code></pre>

<h4>С inner box plot и точками</h4>
<pre><code># По умолчанию inner='box'
sns.violinplot(data=df, x='group', y='value', inner='box')

# Все точки внутри
sns.violinplot(data=df, x='group', y='value', inner='point')

# Квартили линиями
sns.violinplot(data=df, x='group', y='value', inner='quartile')

# Без ничего — только скрипка
sns.violinplot(data=df, x='group', y='value', inner=None)
</code></pre>

<h4>Split violin: сравнение двух групп по одной категории</h4>
<pre><code># Добавим столбец пола
df['gender'] = np.random.choice(['M', 'F'], len(df))

sns.violinplot(data=df, x='group', y='value', hue='gender',
               split=True, palette={'M': '#3b82f6', 'F': '#ec4899'})
plt.show()
# Левая половина = мужчины, правая = женщины
</code></pre>

<h4>Контроль bandwidth (сглаженности)</h4>
<pre><code># bw влияет на плавность KDE
# Малый bw → детальнее, больше шума
# Большой bw → сглаженнее, теряет детали

sns.violinplot(data=df, x='group', y='value', bw_method=0.2)  # детально
sns.violinplot(data=df, x='group', y='value', bw_method=0.5)  # среднее (по умолчанию)
sns.violinplot(data=df, x='group', y='value', bw_method=1.0)  # сглажено
</code></pre>

<h4>Matplotlib (без seaborn)</h4>
<pre><code>fig, ax = plt.subplots(figsize=(8, 5))
data_list = [df[df['group']==g]['value'].values for g in ['A', 'B', 'C']]
parts = ax.violinplot(data_list, positions=[1, 2, 3], showmeans=True, showmedians=True)
ax.set_xticks([1, 2, 3])
ax.set_xticklabels(['A', 'B', 'C'])
plt.show()
</code></pre>
    `,

    applications: `
      <h3>Где используется Violin Plot</h3>
      <table>
        <tr><th>Область</th><th>Применение</th></tr>
        <tr><td><b>Биология, геномика</b></td><td>Распределение экспрессии генов по клеткам — очень часто бимодально</td></tr>
        <tr><td><b>Психология</b></td><td>Распределение ответов на опросники (шкалы Лайкерта)</td></tr>
        <tr><td><b>Продуктовая аналитика</b></td><td>Распределение времени сессии, когда есть «быстрые» и «медленные» пользователи</td></tr>
        <tr><td><b>Финансы</b></td><td>Распределение доходностей разных активов</td></tr>
        <tr><td><b>ML experiments</b></td><td>Сравнение распределения метрик по разным моделям/seed'ам</td></tr>
        <tr><td><b>Медицина</b></td><td>Реакция пациентов на лечение — часто есть «отвечающие» и «не отвечающие»</td></tr>
      </table>
    `,

    proscons: `
      <h3>Плюсы</h3>
      <ul>
        <li>Показывает <b>и</b> квартили, <b>и</b> форму распределения</li>
        <li>Единственный способ быстро увидеть бимодальность при сравнении групп</li>
        <li>Компактен — много информации в одном графике</li>
        <li>Отлично сравнивает группы</li>
      </ul>
      <h3>Минусы</h3>
      <ul>
        <li>Требует понимания KDE (bandwidth, искажения на границах)</li>
        <li>Менее знаком широкой аудитории, чем box plot</li>
        <li>Не работает на маленьких выборках (n &lt; 30)</li>
        <li>Может «выдумать» хвосты, которых нет в данных</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Violin_plot" target="_blank">Wikipedia: Violin plot</a></li>
        <li><a href="https://seaborn.pydata.org/generated/seaborn.violinplot.html" target="_blank">seaborn.violinplot</a></li>
        <li><a href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.violinplot.html" target="_blank">matplotlib.violinplot</a></li>
      </ul>
    `
  }
});
