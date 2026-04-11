/* ==========================================================================
   Глоссарий: Scatter Plot
   ========================================================================== */
App.registerTopic({
  id: 'viz-scatter-plot',
  category: 'viz',
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
          <text x="350" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">6 типичных паттернов scatter plot</text>
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
      <h3>Где используется Scatter Plot</h3>
      <table>
        <tr><th>Область</th><th>Применение</th></tr>
        <tr><td><b>EDA</b></td><td>Первый взгляд на связь двух переменных</td></tr>
        <tr><td><b>Корреляционный анализ</b></td><td>Визуальная проверка линейности перед применением Пирсона</td></tr>
        <tr><td><b>Регрессионный анализ</b></td><td>Диагностика остатков (residual plot = scatter)</td></tr>
        <tr><td><b>Обнаружение выбросов</b></td><td>Точки, далёкие от основного облака</td></tr>
        <tr><td><b>Кластеризация</b></td><td>Визуализация результатов K-Means/DBSCAN в 2D</td></tr>
        <tr><td><b>Экономика и финансы</b></td><td>Связь цен, доходов, расходов</td></tr>
        <tr><td><b>Биология и медицина</b></td><td>Рост vs вес, доза vs эффект</td></tr>
        <tr><td><b>t-SNE / UMAP визуализация</b></td><td>Проекция высокоразмерных данных в 2D scatter plot</td></tr>
      </table>
    `,

    proscons: `
      <h3>Плюсы</h3>
      <ul>
        <li>Интуитивно понятный — каждая точка = объект</li>
        <li>Показывает форму связи, а не только число</li>
        <li>Легко обнаруживает нелинейность, кластеры, выбросы</li>
        <li>Позволяет добавить дополнительные измерения (цвет, размер)</li>
      </ul>
      <h3>Минусы</h3>
      <ul>
        <li>Не работает при сильном overplotting (n &gt; 10k)</li>
        <li>Ограничен 2-3 переменными</li>
        <li>Плохо показывает распределение каждой переменной отдельно</li>
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
