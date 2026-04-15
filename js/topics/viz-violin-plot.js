/* ==========================================================================
   Глоссарий: Violin Plot
   ========================================================================== */
App.registerTopic({
  id: 'viz-violin-plot',
  category: 'glossary',
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
              <path d="M0,240 C-8,238 -15,232 -25,220 C-40,205 -50,195 -50,185 C-50,175 -40,165 -20,155 C-10,150 -8,145 -10,140 C-15,132 -40,120 -50,110 C-55,102 -50,90 -35,82 C-18,75 -5,72 0,70 C5,72 18,75 35,82 C50,90 55,102 50,110 C40,120 15,132 10,140 C8,145 10,150 20,155 C40,165 50,175 50,185 C50,195 40,205 25,220 C15,232 8,238 0,240 Z" fill="#bbf7d0" fill-opacity="0.6" stroke="#059669" stroke-width="2"/>
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

    simulation: {
      html: `
        <h3>Ширина ядра (bandwidth) — главный параметр violin</h3>
        <p>Violin plot = симметричное KDE. Узкое ядро показывает каждую точку как горбик (перешумленная картинка). Широкое ядро стирает все моды в одну гладкую гауссиану. Двигай bandwidth на бимодальной выборке — смотри, где два горба «склеиваются» в один.</p>
        <div class="sim-container">
          <div class="sim-controls" id="viz-viol-ctrl"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="viz-viol-chart"></canvas></div>
            <div class="sim-stats" id="viz-viol-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const ctrl = container.querySelector('#viz-viol-ctrl');
        const cBw = App.makeControl('range', 'viz-viol-bw', 'Bandwidth (× Silverman)', { min: 0.1, max: 3, step: 0.05, value: 1 });
        const cN = App.makeControl('range', 'viz-viol-n', 'Размер выборки', { min: 50, max: 2000, step: 50, value: 300 });
        const cDist = App.makeControl('select', 'viz-viol-dist', 'Распределение', {
          options: [
            { value: 'bimodal', label: 'Смесь двух нормальных' },
            { value: 'trimodal', label: 'Смесь трёх нормальных' },
            { value: 'normal', label: 'Нормальное' },
            { value: 'skewed', label: 'Log-normal' },
          ],
          value: 'bimodal',
        });
        [cBw, cN, cDist].forEach(c => ctrl.appendChild(c.wrap));
        let chart = null;
        let data = [];
        function regen() {
          const n = +cN.input.value;
          const d = cDist.input.value;
          data = [];
          if (d === 'normal') data = App.Util.normalSample(n, 0, 1);
          else if (d === 'bimodal') {
            for (let i = 0; i < n; i++) data.push(Math.random() < 0.5 ? App.Util.randn(-2, 0.5) : App.Util.randn(2, 0.5));
          } else if (d === 'trimodal') {
            for (let i = 0; i < n; i++) {
              const r = Math.random();
              if (r < 0.33) data.push(App.Util.randn(-3, 0.45));
              else if (r < 0.66) data.push(App.Util.randn(0, 0.45));
              else data.push(App.Util.randn(3, 0.45));
            }
          } else {
            for (let i = 0; i < n; i++) data.push(Math.exp(App.Util.randn(0, 0.7)));
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
          const lo = App.Util.min(data);
          const hi = App.Util.max(data);
          const pad = (hi - lo) * 0.1;
          const xs = App.Util.linspace(lo - pad, hi + pad, 200);
          const std = App.Util.std(data);
          const silverman = 1.06 * std * Math.pow(data.length, -1 / 5);
          const bw = silverman * (+cBw.input.value);
          const dens = kde(xs, data, bw);
          // Count modes: local maxima
          let modes = 0;
          for (let i = 2; i < dens.length - 2; i++) {
            if (dens[i] > dens[i - 1] && dens[i] > dens[i - 2] && dens[i] > dens[i + 1] && dens[i] > dens[i + 2] && dens[i] > 0.02) modes++;
          }
          // Mirror for violin shape: symmetric dens+/- at x=value axis vertically
          // Use horizontal chart: x = value, y = density
          const ctx = container.querySelector('#viz-viol-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: xs.map(x => x.toFixed(2)),
              datasets: [
                { label: 'Верх violin (+KDE)', data: dens, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.35)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.1 },
                { label: 'Низ violin (-KDE)', data: dens.map(v => -v), borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.35)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.1 },
              ],
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Violin: bw=' + bw.toFixed(3) + ' (× ' + (+cBw.input.value).toFixed(2) + ' от Silverman)' } }, scales: { x: { title: { display: true, text: 'Значение' }, ticks: { maxTicksLimit: 12 } }, y: { title: { display: true, text: 'Плотность (зеркально)' } } } },
          });
          App.registerChart(chart);
          container.querySelector('#viz-viol-stats').innerHTML =
            '<div class="stat-card"><div class="stat-label">Silverman bw</div><div class="stat-value">' + silverman.toFixed(3) + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Текущее bw</div><div class="stat-value">' + bw.toFixed(3) + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Мод найдено</div><div class="stat-value">' + modes + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Σ under curve</div><div class="stat-value">' + (dens.reduce((s, v) => s + v, 0) * (xs[1] - xs[0])).toFixed(2) + '</div></div>';
        }
        cBw.input.addEventListener('input', draw);
        cN.input.addEventListener('change', regen);
        cDist.input.addEventListener('change', regen);
        regen();
      },
    },

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
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Биология и геномика.</b> Распределение экспрессии генов по клеткам — это классический случай мультимодальности: часть клеток ген «молчит», часть экспрессирует сильно. Box plot показал бы одну медиану, violin мгновенно вскрывает два пика. В single-cell RNA-seq это фактически стандарт визуализации.</li>
        <li><b>Продуктовая аналитика для времени/частоты.</b> Время сессии, время ответа API, частота покупок — почти всегда мультимодальные: есть «пролистнул и ушёл», «быстро купил» и «долго читал». Violin показывает все три группы пользователей на одной картинке, среднее и медиана врут.</li>
        <li><b>Медицинские клинические исследования.</b> Реакция на препарат часто бимодальная: «отвечающие» и «не отвечающие». Violin plot по группам лечения показывает, что эффект не в сдвиге медианы, а в появлении второго пика — критично для интерпретации результатов испытаний.</li>
        <li><b>ML-эксперименты и бенчмарки.</b> Распределение accuracy/loss по 30 seed'ам или по разным гиперпараметрам. Violin показывает, устойчива ли модель или есть провалы к нулю — чего не увидеть по среднему и std.</li>
        <li><b>Психометрика и опросники.</b> Ответы по шкале Лайкерта (1–5) часто имеют бимодальность «согласен / не согласен» с провалом в центре. Violin это показывает, box plot — нет.</li>
        <li><b>Финансовые доходности по активам.</b> Классы активов (акции/облигации/крипто) имеют не только разные средние, но и разную форму распределения: толстые хвосты, асимметрию. Violin plot визуализирует это сравнение лучше, чем пять отдельных гистограмм.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Единственный способ быстро увидеть мультимодальность при сравнении групп.</b> Это главное преимущество перед box plot. Если в данных есть подпопуляции — violin покажет их как два брюшка на скрипке, а ящик просто сольёт всё в одну медиану. В биомеде и продуктовой аналитике, где подпопуляции — норма, это незаменимо.</p>
      <p><b>Показывает всё сразу: и сводку, и форму.</b> Современные violin plot в seaborn по умолчанию рисуют внутри медиану и IQR — получаешь «box plot + KDE» в одном объекте. Читатель видит и квартили (надёжно, робастно), и форму (интересно, информативно).</p>
      <p><b>Компактное сравнение групп.</b> Как и box plot, хорошо масштабируется до 5–15 групп на одной оси. Гистограммы при таком количестве накладываются в кашу, а violin остаются читаемыми.</p>
      <p><b>Симметричная форма интуитивна.</b> Зеркальная скрипка визуально подчёркивает плотность: там, где толще — там больше наблюдений. Люди интерпретируют это правильно даже без объяснения, что такое KDE.</p>
      <p><b>Честнее, чем кажется.</b> В отличие от гистограммы, не зависит от выбора границ бинов — только от bandwidth KDE. При разумном bandwidth форма стабильна и воспроизводима.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Становится нечитаемым при большом числе групп.</b> 20+ скрипок на одной оси — это уже зоопарк: формы сливаются, детали теряются, легенда загромождается. Для многих групп лучше ridge plot (скрипки по вертикали с наложением) или обычный box plot.</p>
      <p><b>Требует понимания KDE.</b> Параметр bandwidth управляет сглаживанием: слишком маленький — шум, слишком большой — гладкая сосиска без пиков. Неопытный аналитик видит форму и не задумывается, что это артефакт параметра по умолчанию.</p>
      <p><b>Может «выдумать» хвосты.</b> KDE продолжает распределение за пределы наблюдаемых точек, особенно на границах (0, 100%). На violin появляются хвосты в отрицательной зоне у величин, которые физически не могут быть отрицательными (возраст, цена, длина). Это требует clip по поддержке распределения.</p>
      <p><b>Бесполезен на маленьких выборках.</b> При $n &lt; 30$ KDE — это гладкая ерунда, нарисованная по шуму. Никакой мультимодальности разглядеть нельзя, даже если она есть в генеральной совокупности. Нужен strip plot или swarm plot.</p>
      <p><b>Менее знаком широкой аудитории.</b> Руководителю или врачу без data-бэкграунда violin plot нужно объяснять: «это как гистограмма, зеркальная». Box plot понимают без объяснений. В отчётах для нетехнических заказчиков это реальный минус.</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Бери violin когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Подозреваешь мультимодальность (подпопуляции, бимодальность) — главная фича</td>
          <td>Выборка мала ($n &lt; 30$) — KDE построит шум, бери strip plot</td>
        </tr>
        <tr>
          <td>Сравниваешь 3–10 групп и форма распределения имеет значение</td>
          <td>Нужно разместить 20+ групп — violin сольются, бери box plot или ridge plot</td>
        </tr>
        <tr>
          <td>Биомед, single-cell, психометрия — где мультимодальность — норма</td>
          <td>Аудитория нетехническая и инструмент надо объяснять — box plot понятнее без слов</td>
        </tr>
        <tr>
          <td>Распределение ML-метрик по seed'ам: надо увидеть провалы, а не только среднее</td>
          <td>Переменная ограничена снизу/сверху (возраст, проценты) — без <code>cut=0</code> KDE «вылезет» за границы</td>
        </tr>
        <tr>
          <td>Хочешь показать и квартили, и форму в одной картинке для отчёта</td>
          <td>Нужна простая детекция выбросов — box plot компактнее и с встроенным 1.5·IQR</td>
        </tr>
        <tr>
          <td>Время сессии/ответа/клика в продуктовой аналитике — часто мультимодально</td>
          <td>Важна стабильная, воспроизводимая форма — выбор bandwidth делает violin субъективным</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Box plot</a></b> — если мультимодальность не ожидается и важна простота: знаком всем, компактнее, объясняет сам себя.</li>
        <li><b>Ridge plot (joyplot)</b> — если групп больше 15 и форма каждой важна. Скрипки перестают умещаться по горизонтали, ridge решает это вертикальным расположением с наложением.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-histogram')">Гистограмма</a></b> — если группа одна, форма важна, а «скрипка» избыточна. Гистограмма не требует понимания KDE.</li>
        <li><b>Strip plot / swarm plot</b> — при малых $n$, где каждое наблюдение важно и KDE бесполезна.</li>
        <li><b>KDE plot</b> (наложенные кривые) — если хочешь сравнить формы 3–4 групп без привязки к квартилям: чище, чем скрипки бок о бок.</li>
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
