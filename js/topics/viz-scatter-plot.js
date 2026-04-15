/* ==========================================================================
   Глоссарий: Scatter Plot
   ========================================================================== */
App.registerTopic({
  id: 'viz-scatter-plot',
  category: 'glossary',
  title: 'Scatter Plot (точечная диаграмма)',
  summary: 'Визуализация связи между двумя числовыми переменными — основа корреляционного анализа.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Если гистограмма — это рентген одной переменной, то <b>scatter plot</b> — рентген связи между двумя. Каждая точка на графике — один объект (человек, товар, наблюдение), у которого есть два свойства: X и Y. Форма «облака» точек говорит нам, как эти свойства связаны.</p>
        <p>Scatter plot — первый инструмент, которым ты открываешь любые двумерные данные. Посмотрел — и сразу видно: есть ли связь, какая она (линейная, нелинейная, никакой), есть ли кластеры, выбросы, странные паттерны.</p>
      </div>

      <h3>🎯 Что такое Scatter Plot</h3>
      <p><b>Scatter plot</b> (точечная диаграмма, диаграмма рассеяния) — график, где каждое наблюдение отображается одной точкой с координатами (X, Y). По X откладывается одна числовая переменная, по Y — другая.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="max-width:600px;">
          <text x="300" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Пример: площадь квартиры vs цена</text>
          <!-- Axes -->
          <line x1="70" y1="270" x2="560" y2="270" stroke="#475569" stroke-width="1.5"/>
          <line x1="70" y1="50" x2="70" y2="270" stroke="#475569" stroke-width="1.5"/>
          <!-- Grid -->
          <g stroke="#e5e7eb" stroke-width="0.5">
            <line x1="70" y1="100" x2="560" y2="100"/>
            <line x1="70" y1="160" x2="560" y2="160"/>
            <line x1="70" y1="215" x2="560" y2="215"/>
            <line x1="180" y1="50" x2="180" y2="270"/>
            <line x1="290" y1="50" x2="290" y2="270"/>
            <line x1="400" y1="50" x2="400" y2="270"/>
            <line x1="510" y1="50" x2="510" y2="270"/>
          </g>
          <!-- Points cluster -->
          <g fill="#0284c7" fill-opacity="0.75">
            <circle cx="100" cy="245" r="4"/>
            <circle cx="115" cy="240" r="4"/>
            <circle cx="130" cy="238" r="4"/>
            <circle cx="145" cy="225" r="4"/>
            <circle cx="160" cy="228" r="4"/>
            <circle cx="170" cy="215" r="4"/>
            <circle cx="185" cy="210" r="4"/>
            <circle cx="200" cy="220" r="4"/>
            <circle cx="215" cy="195" r="4"/>
            <circle cx="230" cy="205" r="4"/>
            <circle cx="245" cy="185" r="4"/>
            <circle cx="260" cy="175" r="4"/>
            <circle cx="275" cy="190" r="4"/>
            <circle cx="290" cy="165" r="4"/>
            <circle cx="305" cy="155" r="4"/>
            <circle cx="320" cy="160" r="4"/>
            <circle cx="340" cy="140" r="4"/>
            <circle cx="355" cy="148" r="4"/>
            <circle cx="370" cy="130" r="4"/>
            <circle cx="390" cy="120" r="4"/>
            <circle cx="410" cy="125" r="4"/>
            <circle cx="430" cy="105" r="4"/>
            <circle cx="450" cy="115" r="4"/>
            <circle cx="470" cy="95" r="4"/>
            <circle cx="490" cy="85" r="4"/>
            <circle cx="510" cy="75" r="4"/>
            <circle cx="530" cy="60" r="4"/>
          </g>
          <!-- Trend line -->
          <line x1="100" y1="245" x2="530" y2="60" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3" opacity="0.7"/>
          <text x="450" y="80" fill="#dc2626" font-size="10" font-weight="600">линия тренда</text>
          <!-- Axis labels -->
          <text x="300" y="295" text-anchor="middle" font-size="11" fill="#64748b">Площадь, м²</text>
          <text x="30" y="160" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90 30 160)">Цена, млн ₽</text>
          <g font-size="10" fill="#94a3b8" text-anchor="middle">
            <text x="70" y="287">20</text>
            <text x="180" y="287">40</text>
            <text x="290" y="287">60</text>
            <text x="400" y="287">80</text>
            <text x="510" y="287">100</text>
          </g>
        </svg>
        <div class="caption">Каждая точка — одна квартира. Видно положительную связь: больше площадь → выше цена. Красная пунктирная — тренд (линейная регрессия).</div>
      </div>

      <h3>📖 Какие паттерны можно увидеть</h3>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 480" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">7 типичных паттернов scatter plot</text>
          <!-- 1. Positive linear -->
          <g>
            <rect x="20" y="40" width="210" height="130" fill="#f8fafc" stroke="#cbd5e1"/>
            <text x="125" y="58" text-anchor="middle" font-size="10" font-weight="600" fill="#059669">1. Положительная линейная</text>
            <g fill="#059669" fill-opacity="0.8">
              <circle cx="40" cy="155" r="2.5"/><circle cx="55" cy="150" r="2.5"/>
              <circle cx="65" cy="145" r="2.5"/><circle cx="75" cy="138" r="2.5"/>
              <circle cx="85" cy="130" r="2.5"/><circle cx="95" cy="125" r="2.5"/>
              <circle cx="105" cy="118" r="2.5"/><circle cx="115" cy="110" r="2.5"/>
              <circle cx="125" cy="103" r="2.5"/><circle cx="135" cy="95" r="2.5"/>
              <circle cx="145" cy="90" r="2.5"/><circle cx="155" cy="82" r="2.5"/>
              <circle cx="165" cy="76" r="2.5"/><circle cx="180" cy="70" r="2.5"/>
              <circle cx="195" cy="62" r="2.5"/><circle cx="210" cy="55" r="2.5"/>
            </g>
          </g>
          <!-- 2. Negative linear -->
          <g>
            <rect x="250" y="40" width="210" height="130" fill="#f8fafc" stroke="#cbd5e1"/>
            <text x="355" y="58" text-anchor="middle" font-size="10" font-weight="600" fill="#dc2626">2. Отрицательная линейная</text>
            <g fill="#dc2626" fill-opacity="0.8">
              <circle cx="270" cy="65" r="2.5"/><circle cx="285" cy="70" r="2.5"/>
              <circle cx="295" cy="78" r="2.5"/><circle cx="305" cy="85" r="2.5"/>
              <circle cx="315" cy="92" r="2.5"/><circle cx="325" cy="100" r="2.5"/>
              <circle cx="335" cy="108" r="2.5"/><circle cx="345" cy="115" r="2.5"/>
              <circle cx="355" cy="122" r="2.5"/><circle cx="370" cy="130" r="2.5"/>
              <circle cx="385" cy="137" r="2.5"/><circle cx="400" cy="144" r="2.5"/>
              <circle cx="415" cy="150" r="2.5"/><circle cx="430" cy="155" r="2.5"/>
              <circle cx="440" cy="160" r="2.5"/>
            </g>
          </g>
          <!-- 3. No correlation -->
          <g>
            <rect x="480" y="40" width="210" height="130" fill="#f8fafc" stroke="#cbd5e1"/>
            <text x="585" y="58" text-anchor="middle" font-size="10" font-weight="600" fill="#64748b">3. Нет связи (r ≈ 0)</text>
            <g fill="#64748b" fill-opacity="0.8">
              <circle cx="500" cy="100" r="2.5"/><circle cx="520" cy="140" r="2.5"/>
              <circle cx="540" cy="85" r="2.5"/><circle cx="555" cy="120" r="2.5"/>
              <circle cx="570" cy="75" r="2.5"/><circle cx="585" cy="135" r="2.5"/>
              <circle cx="600" cy="90" r="2.5"/><circle cx="615" cy="155" r="2.5"/>
              <circle cx="630" cy="78" r="2.5"/><circle cx="645" cy="110" r="2.5"/>
              <circle cx="660" cy="125" r="2.5"/><circle cx="675" cy="95" r="2.5"/>
              <circle cx="530" cy="110" r="2.5"/><circle cx="550" cy="95" r="2.5"/>
              <circle cx="575" cy="150" r="2.5"/><circle cx="605" cy="115" r="2.5"/>
            </g>
          </g>
          <!-- 4. Nonlinear (U-shape / parabola) -->
          <g>
            <rect x="20" y="200" width="210" height="130" fill="#f8fafc" stroke="#cbd5e1"/>
            <text x="125" y="218" text-anchor="middle" font-size="10" font-weight="600" fill="#7c3aed">4. Нелинейная (парабола)</text>
            <g fill="#7c3aed" fill-opacity="0.8">
              <circle cx="35" cy="70" r="2.5" transform="translate(0,165)"/>
              <circle cx="50" cy="85" r="2.5" transform="translate(0,165)"/>
              <circle cx="65" cy="100" r="2.5" transform="translate(0,165)"/>
              <circle cx="80" cy="115" r="2.5" transform="translate(0,165)"/>
              <circle cx="95" cy="125" r="2.5" transform="translate(0,165)"/>
              <circle cx="110" cy="130" r="2.5" transform="translate(0,165)"/>
              <circle cx="125" cy="128" r="2.5" transform="translate(0,165)"/>
              <circle cx="140" cy="125" r="2.5" transform="translate(0,165)"/>
              <circle cx="155" cy="115" r="2.5" transform="translate(0,165)"/>
              <circle cx="170" cy="102" r="2.5" transform="translate(0,165)"/>
              <circle cx="185" cy="88" r="2.5" transform="translate(0,165)"/>
              <circle cx="200" cy="72" r="2.5" transform="translate(0,165)"/>
              <circle cx="215" cy="55" r="2.5" transform="translate(0,165)"/>
            </g>
          </g>
          <!-- 5. Clusters -->
          <g>
            <rect x="250" y="200" width="210" height="130" fill="#f8fafc" stroke="#cbd5e1"/>
            <text x="355" y="218" text-anchor="middle" font-size="10" font-weight="600" fill="#b45309">5. Кластеры (3 группы)</text>
            <g fill="#f59e0b" fill-opacity="0.8">
              <circle cx="275" cy="295" r="3"/><circle cx="285" cy="300" r="3"/>
              <circle cx="290" cy="290" r="3"/><circle cx="295" cy="305" r="3"/>
              <circle cx="300" cy="295" r="3"/>
            </g>
            <g fill="#0284c7" fill-opacity="0.8">
              <circle cx="345" cy="260" r="3"/><circle cx="355" cy="250" r="3"/>
              <circle cx="365" cy="265" r="3"/><circle cx="370" cy="255" r="3"/>
              <circle cx="380" cy="260" r="3"/>
            </g>
            <g fill="#059669" fill-opacity="0.8">
              <circle cx="410" cy="225" r="3"/><circle cx="420" cy="215" r="3"/>
              <circle cx="430" cy="230" r="3"/><circle cx="440" cy="220" r="3"/>
              <circle cx="450" cy="225" r="3"/>
            </g>
          </g>
          <!-- 6. Outliers -->
          <g>
            <rect x="480" y="200" width="210" height="130" fill="#f8fafc" stroke="#cbd5e1"/>
            <text x="585" y="218" text-anchor="middle" font-size="10" font-weight="600" fill="#be123c">6. Линия + выбросы</text>
            <g fill="#be123c" fill-opacity="0.8">
              <circle cx="500" cy="305" r="2.5"/><circle cx="515" cy="295" r="2.5"/>
              <circle cx="530" cy="285" r="2.5"/><circle cx="545" cy="275" r="2.5"/>
              <circle cx="560" cy="265" r="2.5"/><circle cx="575" cy="255" r="2.5"/>
              <circle cx="590" cy="245" r="2.5"/><circle cx="605" cy="235" r="2.5"/>
              <circle cx="620" cy="225" r="2.5"/><circle cx="635" cy="215" r="2.5"/>
              <circle cx="650" cy="205" r="2.5"/>
            </g>
            <circle cx="540" cy="230" r="4" fill="#be123c" stroke="#4c0519" stroke-width="2"/>
            <circle cx="620" cy="300" r="4" fill="#be123c" stroke="#4c0519" stroke-width="2"/>
          </g>
          <!-- 7. Funnel (heteroscedasticity) -->
          <g>
            <rect x="250" y="360" width="210" height="110" fill="#f8fafc" stroke="#cbd5e1"/>
            <text x="355" y="378" text-anchor="middle" font-size="10" font-weight="600" fill="#0891b2">7. Гетероскедастичность (воронка)</text>
            <g fill="#0891b2" fill-opacity="0.8">
              <circle cx="270" cy="420" r="2.5"/><circle cx="275" cy="418" r="2.5"/>
              <circle cx="285" cy="422" r="2.5"/><circle cx="295" cy="425" r="2.5"/>
              <circle cx="305" cy="416" r="2.5"/><circle cx="315" cy="428" r="2.5"/>
              <circle cx="325" cy="410" r="2.5"/><circle cx="335" cy="430" r="2.5"/>
              <circle cx="345" cy="405" r="2.5"/><circle cx="355" cy="438" r="2.5"/>
              <circle cx="365" cy="400" r="2.5"/><circle cx="375" cy="442" r="2.5"/>
              <circle cx="385" cy="395" r="2.5"/><circle cx="395" cy="450" r="2.5"/>
              <circle cx="405" cy="388" r="2.5"/><circle cx="415" cy="455" r="2.5"/>
              <circle cx="425" cy="395" r="2.5"/><circle cx="435" cy="450" r="2.5"/>
              <circle cx="445" cy="385" r="2.5"/>
            </g>
          </g>
        </svg>
        <div class="caption">7 типичных паттернов. Scatter plot — первый способ понять, какие отношения в данных: линейные, нелинейные, кластеры или просто случай.</div>
      </div>

      <h3>🎨 Улучшения scatter plot</h3>
      <ul>
        <li><b>Третья переменная через цвет</b> — например, пол: мужчины синие, женщины розовые.</li>
        <li><b>Размер точек</b> — для четвёртой переменной (bubble chart).</li>
        <li><b>Прозрачность (alpha)</b> — при большом числе точек, чтобы видеть плотность.</li>
        <li><b>Регрессионная линия</b> — подчеркнуть линейный тренд.</li>
        <li><b>Рanel plots (faceting)</b> — отдельные scatter plots для каждой категории.</li>
        <li><b>Jitter</b> — при дискретных X добавить шум, чтобы точки не накладывались.</li>
        <li><b>Hexbin / 2D histogram</b> — для очень большого n, когда точки сливаются.</li>
      </ul>

      <h3>⚠️ Ограничения</h3>
      <ul>
        <li><b>Overplotting</b> — при большом n (&gt; 10 000) точки сливаются. Используй прозрачность, hexbin или density plot.</li>
        <li><b>Только 2 переменные</b> — для больше надо scatter matrix (pairplot).</li>
        <li><b>Дискретные данные</b> — точки накладываются, нужен jitter.</li>
        <li><b>Не показывает распределение каждой переменной</b> — используй marginal plots.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('correlation')">Корреляция</a> — scatter plot — обязательный спутник коэффициента корреляции.</li>
        <li><a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> — scatter plot + regression line.</li>
        <li><a onclick="App.selectTopic('viz-histogram')">Гистограмма</a> — одномерный аналог.</li>
      </ul>
    `,

    simulation: {
      html: `
        <h3>Overplotting: когда точки сливаются в кляксу</h3>
        <p>На 200 точках scatter отлично работает. На 20 000 — всё превращается в чёрный прямоугольник, и никакая структура не видна. Три классических решения: прозрачность (alpha), уменьшение точек, и hexbin. Увеличивай $n$ и смотри, где глаз перестаёт различать плотность.</p>
        <div class="sim-container">
          <div class="sim-controls" id="viz-sc-ctrl"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:420px;padding:0;"><canvas id="viz-sc-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-stats" id="viz-sc-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const ctrl = container.querySelector('#viz-sc-ctrl');
        const cN = App.makeControl('range', 'viz-sc-n', 'Число точек', { min: 100, max: 30000, step: 100, value: 5000 });
        const cAlpha = App.makeControl('range', 'viz-sc-alpha', 'Alpha', { min: 0.02, max: 1, step: 0.01, value: 0.2 });
        const cSize = App.makeControl('range', 'viz-sc-size', 'Радиус точки', { min: 1, max: 8, step: 0.5, value: 3 });
        const cMode = App.makeControl('select', 'viz-sc-mode', 'Режим', {
          options: [
            { value: 'scatter', label: 'Scatter' },
            { value: 'hexbin', label: 'Hexbin (2D density)' },
          ],
          value: 'scatter',
        });
        const cData = App.makeControl('select', 'viz-sc-data', 'Структура данных', {
          options: [
            { value: 'linear', label: 'Линейная + шум' },
            { value: 'two', label: 'Два кластера' },
            { value: 'ring', label: 'Кольцо' },
            { value: 'uniform', label: 'Равномерно' },
          ],
          value: 'two',
        });
        [cN, cAlpha, cSize, cMode, cData].forEach(c => ctrl.appendChild(c.wrap));
        const canvas = container.querySelector('#viz-sc-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        function regen() {
          const n = +cN.input.value;
          const d = cData.input.value;
          points = [];
          for (let i = 0; i < n; i++) {
            let x, y;
            if (d === 'linear') {
              x = Math.random();
              y = 0.15 + 0.7 * x + App.Util.randn(0, 0.08);
            } else if (d === 'two') {
              if (Math.random() < 0.5) { x = 0.3 + App.Util.randn(0, 0.08); y = 0.3 + App.Util.randn(0, 0.08); }
              else { x = 0.7 + App.Util.randn(0, 0.08); y = 0.7 + App.Util.randn(0, 0.08); }
            } else if (d === 'ring') {
              const r = 0.35 + App.Util.randn(0, 0.03);
              const t = Math.random() * 2 * Math.PI;
              x = 0.5 + r * Math.cos(t);
              y = 0.5 + r * Math.sin(t);
            } else {
              x = Math.random();
              y = Math.random();
            }
            points.push([x, y]);
          }
          draw();
        }
        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }
        function draw() {
          if (!canvas.width) return;
          const W = canvas.width, H = canvas.height;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, W, H);
          const mode = cMode.input.value;
          if (mode === 'scatter') {
            const a = +cAlpha.input.value;
            const s = +cSize.input.value;
            ctx.fillStyle = `rgba(59,130,246,${a})`;
            points.forEach(p => {
              ctx.beginPath();
              ctx.arc(p[0] * W, (1 - p[1]) * H, s, 0, 2 * Math.PI);
              ctx.fill();
            });
          } else {
            // Hexbin
            const hexSize = 14;
            const cols = Math.floor(W / (hexSize * 1.5));
            const rows = Math.floor(H / (hexSize * Math.sqrt(3)));
            const counts = new Map();
            points.forEach(p => {
              const px = p[0] * W, py = (1 - p[1]) * H;
              const col = Math.round(px / (hexSize * 1.5));
              const offset = (col % 2) * hexSize * Math.sqrt(3) / 2;
              const row = Math.round((py - offset) / (hexSize * Math.sqrt(3)));
              const key = col + ',' + row;
              counts.set(key, (counts.get(key) || 0) + 1);
            });
            let maxC = 0;
            counts.forEach(v => { if (v > maxC) maxC = v; });
            counts.forEach((v, key) => {
              const [col, row] = key.split(',').map(Number);
              const cx = col * hexSize * 1.5;
              const offset = (col % 2) * hexSize * Math.sqrt(3) / 2;
              const cy = row * hexSize * Math.sqrt(3) + offset;
              const t = Math.log(1 + v) / Math.log(1 + maxC);
              const r = Math.round(59 + (255 - 59) * t);
              const g = Math.round(130 + (200 - 130) * (1 - Math.abs(t - 0.5) * 2));
              const b = Math.round(246 * (1 - t) + 50);
              ctx.fillStyle = `rgb(${r},${g},${b})`;
              ctx.beginPath();
              for (let i = 0; i < 6; i++) {
                const a = i * Math.PI / 3;
                const x = cx + hexSize * Math.cos(a);
                const y = cy + hexSize * Math.sin(a);
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
            });
          }
          const n = points.length;
          container.querySelector('#viz-sc-stats').innerHTML =
            '<div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">' + n.toLocaleString('ru') + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Режим</div><div class="stat-value">' + (mode === 'scatter' ? 'Scatter' : 'Hexbin') + '</div></div>' +
            '<div class="stat-card"><div class="stat-label">Alpha</div><div class="stat-value">' + (+cAlpha.input.value).toFixed(2) + '</div></div>';
        }
        [cAlpha, cSize, cMode].forEach(c => c.input.addEventListener('input', draw));
        cN.input.addEventListener('change', regen);
        cData.input.addEventListener('change', regen);
        setTimeout(() => { regen(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    python: `
<h3>Scatter Plot в Python</h3>

<h4>matplotlib — базовый</h4>
<pre><code>import matplotlib.pyplot as plt
import numpy as np

x = np.random.rand(100) * 100
y = 0.5 * x + np.random.randn(100) * 10

fig, ax = plt.subplots(figsize=(7, 5))
ax.scatter(x, y, alpha=0.7, s=50, c='#3b82f6', edgecolors='#1e40af')
ax.set_xlabel('Площадь, м²')
ax.set_ylabel('Цена, млн ₽')
ax.grid(True, alpha=0.3)
plt.show()
</code></pre>

<h4>С третьей переменной через цвет</h4>
<pre><code>categories = np.random.choice(['A', 'B', 'C'], 100)
colors = {'A': '#ef4444', 'B': '#10b981', 'C': '#3b82f6'}

fig, ax = plt.subplots(figsize=(7, 5))
for cat in ['A', 'B', 'C']:
    mask = categories == cat
    ax.scatter(x[mask], y[mask], label=cat, alpha=0.7, c=colors[cat])
ax.legend()
plt.show()
</code></pre>

<h4>seaborn — продвинутый</h4>
<pre><code>import seaborn as sns
import pandas as pd

df = pd.DataFrame({'x': x, 'y': y, 'category': categories})

# Обычный scatter с регрессионной линией
sns.regplot(data=df, x='x', y='y', scatter_kws={'alpha': 0.6})
plt.show()

# С hue (категория цветом)
sns.scatterplot(data=df, x='x', y='y', hue='category', size='category')
plt.show()

# Pairplot для всех пар переменных
sns.pairplot(df, hue='category')
plt.show()
</code></pre>

<h4>Overplotting: hexbin для больших данных</h4>
<pre><code># При n = 100 000 обычный scatter не читается
big_x = np.random.randn(100000)
big_y = big_x * 2 + np.random.randn(100000)

fig, ax = plt.subplots(figsize=(7, 5))
hb = ax.hexbin(big_x, big_y, gridsize=40, cmap='Blues', mincnt=1)
plt.colorbar(hb, label='плотность')
plt.show()
</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Первый взгляд на связь двух переменных.</b> Любой EDA начинается с «а как x связан с y?». Scatter plot отвечает за секунду: линейно, нелинейно, есть ли кластеры, есть ли выбросы, есть ли вообще сигнал. Одна картинка заменяет 10 числовых коэффициентов.</li>
        <li><b>Визуальная проверка линейности перед корреляцией.</b> Коэффициент Пирсона осмыслен только для линейной связи. Scatter plot показывает, выполняется ли это предположение, или у тебя парабола/синус, и тогда Пирсон близок к нулю, а связь на самом деле сильная.</li>
        <li><b>Диагностика регрессионных моделей (residual plot).</b> Остатки vs предсказания — это scatter plot, и он обязателен для любой линейной модели. Воронка = гетероскедастичность, дуга = нелинейность упущена, выбросы = потенциальные high-leverage points.</li>
        <li><b>Визуализация кластеризации и проекций.</b> Результаты K-Means/DBSCAN, выходы t-SNE/UMAP/PCA — всё это в итоге показывают как 2D scatter с раскраской по кластеру/классу. Без этого невозможно понять, что сделал алгоритм.</li>
        <li><b>Обнаружение выбросов и bivariate-аномалий.</b> Точка может быть нормальной по x и нормальной по y отдельно, но странной в паре — bivariate outlier. Только на scatter plot такие вещи видны.</li>
        <li><b>Дозо-эффектные исследования в биомеде.</b> Доза препарата vs реакция, концентрация vs активность — классический scatter с наложенной кривой. Основа фармакокинетики и токсикологии.</li>
        <li><b>Связь метрик в продуктовой аналитике.</b> LTV vs CAC, конверсия vs трафик, цена vs средний чек — scatter показывает форму зависимости и помогает сегментировать пользователей.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Интуитивно понятен.</b> Каждая точка — один объект (клиент, деталь, измерение). Никаких агрегаций, никаких потерь информации. Зритель видит сырые данные как есть и может сам проверить выводы, не веря аналитику на слово.</p>
      <p><b>Показывает форму связи, а не только число.</b> Коэффициент корреляции 0.7 может быть идеальной линией с шумом или параболой с двумя ветками — это принципиально разные зависимости, требующие разных моделей. Scatter plot делает разницу очевидной.</p>
      <p><b>Легко обнаруживает нелинейность и кластеры.</b> Одна картинка показывает параболы, ступеньки, насыщения, отдельные группы точек — всё то, что линейные методы и числовые сводки пропускают. Это основной инструмент для feature engineering «по наитию».</p>
      <p><b>Легко добавить новые измерения.</b> Цвет точки (категория), размер (вес/объём), форма (бинарный признак), прозрачность (плотность) — и 2D-график превращается в 4–5-мерный. Это называется bubble chart или encoded scatter и позволяет упаковать много информации.</p>
      <p><b>Работает с любыми парами числовых переменных.</b> Не требует предположений о распределении, линейности, нормальности. Универсальный инструмент, не ломающийся на «неудобных» данных.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Overplotting при большом $n$.</b> 100 точек — красиво. 10000 точек — чёрная клякса, в которой ничего не видно. 1 миллион точек — то же самое, только тормозит браузер. На больших данных scatter теряет смысл: плотность перестаёт читаться, отдельные точки не различимы. Решения: alpha-прозрачность, hexbin, 2D-гистограмма, sampling.</p>
      <p><b>Не работает с категориальными переменными.</b> Если по одной оси категории — точки ложатся столбцами, и scatter превращается в плохой strip plot. Для смешанных данных (число + категория) нужны другие визуализации: box plot, violin, swarm.</p>
      <p><b>Ограничен 2–3 переменными.</b> В 2D помещаются два признака, цветом добавляется третий. Больше — уже перегрузка. Для высокоразмерных данных нужны pair plot (матрица скаттеров) или проекции (PCA/t-SNE).</p>
      <p><b>Плохо показывает распределение каждой переменной отдельно.</b> Маргинальные распределения теряются в точечном облаке. Решение — jointplot: scatter в центре + гистограммы/KDE по краям (seaborn делает это из коробки).</p>
      <p><b>Выбор диапазона осей может обмануть.</b> Сжатая ось y делает слабую связь «драматичной», растянутая — скрывает явную. Scatter чувствителен к aspect ratio — то, что в публикациях решают стандартизацией, а в отчётах часто нет.</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Бери scatter когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Надо посмотреть связь двух числовых переменных — основной сценарий</td>
          <td>Точек очень много ($n &gt; 10$ тыс.) — overplotting, нужен hexbin или heatmap</td>
        </tr>
        <tr>
          <td>Диагностика регрессии: residuals vs fitted, residuals vs x</td>
          <td>Одна или обе переменные категориальные — нужен box plot или swarm plot</td>
        </tr>
        <tr>
          <td>Ищешь bivariate-выбросы, кластеры, нелинейности</td>
          <td>Нужна плотность/вероятность в 2D — бери 2D KDE или contour plot</td>
        </tr>
        <tr>
          <td>Показываешь результат кластеризации или 2D-проекции (PCA/t-SNE/UMAP)</td>
          <td>Переменных больше 3 и все важны — нужен pair plot или parallel coordinates</td>
        </tr>
        <tr>
          <td>Нужно проверить линейность перед применением Пирсона или линейной регрессии</td>
          <td>Цель — сравнить распределения нескольких групп, а не пары точек</td>
        </tr>
        <tr>
          <td>Аудитория хочет видеть «сырые» данные, а не агрегаты — доверие к анализу</td>
          <td>Данные дискретные с малым числом уровней — точки лягут друг на друга</td>
        </tr>
        <tr>
          <td>Нужно закодировать 3–4 измерения через цвет/размер/форму (bubble chart)</td>
          <td>Показываешь временной ряд — line plot честнее передаёт последовательность</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b>Hexbin plot</b> — при большом $n$ заменяет точки на шестиугольные ячейки с цветом по плотности. Решает overplotting и сохраняет форму связи.</li>
        <li><b>Heatmap / 2D histogram</b> — ещё один способ показать плотность при миллионах точек. Читается как тепловая карта, идеально для очень больших данных.</li>
        <li><b>2D KDE / contour plot</b> — гладкая оценка двумерной плотности. Красиво для публикаций, показывает моды и области концентрации без визуального шума.</li>
        <li><b>Pair plot (scatter matrix)</b> — если переменных 4–6, нужно увидеть все парные связи сразу. Основной EDA-инструмент для табличных данных среднего размера.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Box plot</a></b> — когда одна из переменных категориальная и scatter превращается в столбцы точек.</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Scatter_plot" target="_blank">Wikipedia: Scatter plot</a></li>
        <li><a href="https://seaborn.pydata.org/generated/seaborn.scatterplot.html" target="_blank">seaborn.scatterplot</a></li>
        <li><a href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html" target="_blank">matplotlib.pyplot.scatter</a></li>
      </ul>
    `
  }
});
