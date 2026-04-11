/* ==========================================================================
   Описательная статистика
   ========================================================================== */
App.registerTopic({
  id: 'descriptive-stats',
  category: 'stats',
  title: 'Описательная статистика',
  summary: 'Среднее, медиана, дисперсия, квантили — как одним числом описать выборку.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что твой друг съездил в отпуск в 30 стран и ты спрашиваешь: «Ну как там было?» Он не будет пересказывать тебе все 30 поездок — он скажет: «в среднем классно, но в одной стране был кошмар». Он <b>сжал</b> огромный опыт в пару характеристик: «среднее впечатление» и «самая худшая точка».</p>
        <p>Описательная статистика делает то же самое с числами. У тебя 10 000 зарплат сотрудников — вместо того чтобы смотреть на весь список, ты говоришь: «средняя 80 тыс, медиана 65 тыс, самая высокая 500 тыс». Три числа — и собеседник уже понимает картину.</p>
      </div>

      <h3>🎯 Зачем она нужна</h3>
      <p>Любой анализ данных начинается с одного и того же вопроса: «а что у нас вообще есть?». Прежде чем строить модели, тестировать гипотезы и делать выводы, нужно понять свои данные. Описательная статистика — это инструмент первичного знакомства с данными.</p>
      <p>С её помощью мы отвечаем на три главных вопроса:</p>
      <ul>
        <li><b>Где центр данных?</b> — какое «типичное» значение.</li>
        <li><b>Насколько данные разбросаны?</b> — все близки к центру или разлетаются.</li>
        <li><b>Какова форма распределения?</b> — симметрично, с длинным хвостом, с выбросами.</li>
      </ul>

      <h3>📊 Меры центральной тенденции — «где центр»</h3>
      <p>Центр данных — это попытка ответить на вопрос «какое значение самое типичное». Есть три способа его посчитать, и выбор между ними не случайный — он зависит от того, насколько данные «чистые».</p>

      <h4>1. Среднее арифметическое (mean)</h4>
      <p>Сложить все числа, разделить на их количество. Самый привычный способ. Формула: $\\bar{x} = \\frac{1}{n} \\sum x_i$.</p>
      <p>Пример: зарплаты [40, 50, 60] → среднее = 50.</p>
      <p><b>Особенность:</b> среднее учитывает <b>каждое</b> значение. Это его сила (использует всю информацию) и слабость — одно экстремальное число может сильно сдвинуть результат. Если к зарплатам [40, 50, 60] добавить директора с 10 000, среднее станет 2537 — никто в компании столько не получает, но «среднее» так говорит.</p>

      <h4>2. Медиана (median)</h4>
      <p>Отсортировать числа и взять то, что <b>ровно посередине</b>. Если чисел чётное количество — берём среднее двух центральных.</p>
      <p>Пример: [40, 50, 60, 10000] → сортируем, серединные 50 и 60, медиана = 55.</p>
      <p><b>Особенность:</b> медиана игнорирует экстремальные значения, потому что смотрит только на порядок, а не на сами числа. Директор с 10 000 не сдвигает медиану сильнее, чем директор с 200.</p>

      <h4>3. Мода (mode)</h4>
      <p>Значение, которое встречается чаще всего.</p>
      <p>Пример: [1, 2, 2, 3, 5, 5, 5, 7] → мода = 5.</p>
      <p><b>Особенность:</b> единственная мера, которая работает и для <span class="term" data-tip="Признаки без числового значения: цвет, пол, категория, страна. Их нельзя усреднить арифметически.">категориальных данных</span>. Но бессмысленна для непрерывных чисел (где каждое значение обычно уникально).</p>

      <div class="key-concept">
        <div class="kc-label">Ключевая идея</div>
        <p>Среднее чувствительно к <span class="term" data-tip="Значение, которое резко отличается от большинства. Может быть ошибкой ввода, аномалией или просто редким случаем.">выбросам</span>, медиана — нет. Если в данных есть подозрительные экстремальные значения, медиана даст более честную картину «типичного».</p>
      </div>

      <h3>📐 Меры разброса — «насколько данные разлетаются»</h3>
      <p>Центр — это только половина картины. Две группы могут иметь одинаковое среднее, но вести себя совершенно по-разному: одни тесно кучкуются, другие разбросаны. Это описывают меры разброса.</p>

      <h4>Размах (range)</h4>
      <p>Разница между максимумом и минимумом: $R = x_{max} - x_{min}$. Простой, но ненадёжный — зависит только от двух крайних точек, полностью определяется выбросами.</p>

      <h4>Дисперсия (variance)</h4>
      <p>Среднее квадратов отклонений от среднего: $s^2 = \\frac{1}{n-1}\\sum(x_i - \\bar{x})^2$.</p>
      <p>Идея: для каждого числа считаем, насколько далеко оно от среднего, возводим в квадрат (чтобы плюсы и минусы не сокращались), и усредняем.</p>
      <p><b>Почему квадраты, а не модули?</b> Квадраты сильнее штрафуют большие отклонения и дают гладкую функцию, удобную для математического анализа. Это историческое соглашение, оно же и удобное с точки зрения теории вероятностей.</p>
      <p><b>Проблема дисперсии:</b> она измеряется в <b>квадратных</b> единицах. Если данные в рублях, дисперсия — в рублях². Неудобно интерпретировать.</p>

      <h4>Стандартное отклонение (std, σ)</h4>
      <p>Квадратный корень из дисперсии: $s = \\sqrt{s^2}$.</p>
      <p>Благодаря корню возвращаемся к исходным единицам. Если данные в рублях — std в рублях. Это главная мера разброса на практике.</p>
      <p><b>Как читать std:</b> «типичное отклонение от среднего». Если $\\bar{x} = 100$ и $s = 15$, большинство значений лежат в диапазоне $100 \\pm 15$.</p>

      <h4>Квартили и IQR</h4>
      <p>Если отсортировать данные и разделить на 4 равные части, точки деления называются <b>квартилями</b>:</p>
      <ul>
        <li>Q1 (25-й перцентиль) — 25% данных ниже этого значения.</li>
        <li>Q2 (50-й) — это медиана.</li>
        <li>Q3 (75-й) — 75% данных ниже.</li>
      </ul>
      <p><span class="term" data-tip="InterQuartile Range. Диапазон, в котором лежат центральные 50% данных. Не зависит от крайних значений, поэтому устойчив к выбросам.">IQR</span> = Q3 − Q1 — диапазон, где лежат <b>центральные 50%</b> наблюдений. Это «устойчивый» аналог std.</p>

      <h3>🧮 Стандартная пятёрка чисел (five-number summary)</h3>
      <p>Минимум, Q1, медиана, Q3, максимум — даёт быстрое понимание всей формы распределения. Графически это отображается как <span class="term" data-tip="Графическое представление пятёрки чисел: ящик — от Q1 до Q3, линия внутри — медиана, усы — до крайних «нормальных» значений, точки — выбросы."><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a></span>.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <!-- Horizontal axis -->
          <line x1="40" y1="130" x2="520" y2="130" stroke="#64748b" stroke-width="1.5"/>
          <!-- Whisker left: min to Q1 -->
          <line x1="80" y1="130" x2="200" y2="130" stroke="#6366f1" stroke-width="2"/>
          <line x1="80" y1="118" x2="80" y2="142" stroke="#6366f1" stroke-width="2"/>
          <!-- Box: Q1 to Q3 -->
          <rect x="200" y="100" width="160" height="60" fill="#818cf8" fill-opacity="0.25" stroke="#6366f1" stroke-width="2.5" rx="3"/>
          <!-- Median line -->
          <line x1="290" y1="100" x2="290" y2="160" stroke="#6366f1" stroke-width="3"/>
          <!-- Whisker right: Q3 to max -->
          <line x1="360" y1="130" x2="450" y2="130" stroke="#6366f1" stroke-width="2"/>
          <line x1="450" y1="118" x2="450" y2="142" stroke="#6366f1" stroke-width="2"/>
          <!-- Outlier point -->
          <circle cx="500" cy="130" r="6" fill="#ef4444" stroke="#ef4444" stroke-width="1.5" fill-opacity="0.8"/>
          <!-- Dashed line from max to outlier -->
          <line x1="450" y1="130" x2="494" y2="130" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>
          <!-- Labels above -->
          <text x="80" y="110" text-anchor="middle" font-size="11" fill="#64748b">Min</text>
          <text x="200" y="90" text-anchor="middle" font-size="11" fill="#6366f1">Q1</text>
          <text x="290" y="88" text-anchor="middle" font-size="12" font-weight="700" fill="#6366f1">Медиана</text>
          <text x="360" y="90" text-anchor="middle" font-size="11" fill="#6366f1">Q3</text>
          <text x="450" y="110" text-anchor="middle" font-size="11" fill="#64748b">Max</text>
          <text x="500" y="110" text-anchor="middle" font-size="11" fill="#ef4444">Выброс</text>
          <!-- IQR brace label -->
          <line x1="200" y1="170" x2="360" y2="170" stroke="#10b981" stroke-width="1.5"/>
          <line x1="200" y1="165" x2="200" y2="175" stroke="#10b981" stroke-width="1.5"/>
          <line x1="360" y1="165" x2="360" y2="175" stroke="#10b981" stroke-width="1.5"/>
          <text x="280" y="168" text-anchor="middle" font-size="11" fill="#10b981" dy="12">IQR = Q3 − Q1</text>
        </svg>
        <div class="caption"><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a> (<a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">ящик с усами</a>): ящик охватывает центральные 50% данных (IQR), линия внутри — медиана, усы тянутся до крайних «нормальных» значений, красная точка — выброс.</div>
      </div>

      <div class="callout tip">💡 <b>Правило большого пальца:</b> если распределение симметрично и без выбросов → смотри на среднее и std. Если есть выбросы или сильный скос → используй медиану и IQR. Всегда рисуй <span class="term" data-tip="Столбчатая диаграмма, показывающая, сколько значений попадает в каждый интервал. Визуализирует форму распределения."><a class="glossary-link" onclick="App.selectTopic('viz-histogram')">гистограмму</a></span> или <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a> перед выводами.</div>

      <h3>🔬 Форма распределения</h3>
      <p>Помимо центра и разброса, распределение может быть <b>несимметричным</b>. Это описывают:</p>
      <ul>
        <li><b>Скошенность (skewness)</b> — насколько хвост вытянут в одну сторону.
          <ul>
            <li>skewness > 0: длинный правый хвост (доходы, цены). Среднее > медианы.</li>
            <li>skewness < 0: длинный левый хвост. Среднее < медианы.</li>
            <li>skewness ≈ 0: симметрично.</li>
          </ul>
        </li>
        <li><b>Эксцесс (kurtosis)</b> — насколько «тяжёлые» хвосты, то есть часто ли встречаются экстремальные значения.</li>
      </ul>

      <div class="illustration bordered">
        <svg viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg" style="max-width:900px;">
          <text x="450" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Три формы распределения и взаимное положение моды / медианы / среднего</text>

          <!-- LEFT panel: left-skewed (long tail to the LEFT) -->
          <g>
            <text x="150" y="50" text-anchor="middle" font-size="13" font-weight="600" fill="#b45309">Левый скос (skewness &lt; 0)</text>
            <line x1="30" y1="240" x2="280" y2="240" stroke="#475569" stroke-width="1.5"/>
            <!-- Bell-like curve, shifted toward right (mode at right side) -->
            <path id="ds-skew-left" d="" fill="#fcd34d" fill-opacity="0.5" stroke="#b45309" stroke-width="2.5"/>
            <!-- Vertical lines for mean (left), median (middle), mode (right) -->
            <line x1="120" y1="100" x2="120" y2="240" stroke="#dc2626" stroke-width="2.2"/>
            <line x1="160" y1="80" x2="160" y2="240" stroke="#0284c7" stroke-width="2.2"/>
            <line x1="200" y1="65" x2="200" y2="240" stroke="#059669" stroke-width="2.2"/>
            <!-- Stacked labels with leader lines, separated vertically -->
            <text x="120" y="270" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="700">среднее</text>
            <text x="160" y="290" text-anchor="middle" font-size="11" fill="#0284c7" font-weight="700">медиана</text>
            <text x="200" y="310" text-anchor="middle" font-size="11" fill="#059669" font-weight="700">мода</text>
            <!-- Leader lines from labels to ticks at the baseline -->
            <line x1="120" y1="245" x2="120" y2="262" stroke="#dc2626" stroke-width="1.5"/>
            <line x1="160" y1="245" x2="160" y2="282" stroke="#0284c7" stroke-width="1.5"/>
            <line x1="200" y1="245" x2="200" y2="302" stroke="#059669" stroke-width="1.5"/>
            <text x="155" y="335" text-anchor="middle" font-size="11" fill="#475569" font-style="italic">среднее &lt; медиана &lt; мода</text>
          </g>

          <!-- CENTER panel: symmetric -->
          <g>
            <text x="450" y="50" text-anchor="middle" font-size="13" font-weight="600" fill="#1e40af">Симметричное (skewness ≈ 0)</text>
            <line x1="330" y1="240" x2="580" y2="240" stroke="#475569" stroke-width="1.5"/>
            <path id="ds-skew-sym" d="" fill="#bfdbfe" fill-opacity="0.55" stroke="#1e40af" stroke-width="2.5"/>
            <!-- Single combined vertical at center -->
            <line x1="455" y1="60" x2="455" y2="240" stroke="#1e40af" stroke-width="2.5"/>
            <text x="455" y="270" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">мода</text>
            <text x="455" y="288" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">=</text>
            <text x="455" y="306" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">медиана</text>
            <text x="455" y="324" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">=</text>
            <text x="455" y="342" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="700">среднее</text>
          </g>

          <!-- RIGHT panel: right-skewed (long tail to the RIGHT) -->
          <g>
            <text x="750" y="50" text-anchor="middle" font-size="13" font-weight="600" fill="#92400e">Правый скос (skewness &gt; 0)</text>
            <line x1="630" y1="240" x2="880" y2="240" stroke="#475569" stroke-width="1.5"/>
            <path id="ds-skew-right" d="" fill="#fdba74" fill-opacity="0.55" stroke="#92400e" stroke-width="2.5"/>
            <!-- Mode (left), median (mid), mean (right) -->
            <line x1="705" y1="65" x2="705" y2="240" stroke="#059669" stroke-width="2.2"/>
            <line x1="745" y1="80" x2="745" y2="240" stroke="#0284c7" stroke-width="2.2"/>
            <line x1="785" y1="100" x2="785" y2="240" stroke="#dc2626" stroke-width="2.2"/>
            <text x="705" y="270" text-anchor="middle" font-size="11" fill="#059669" font-weight="700">мода</text>
            <text x="745" y="290" text-anchor="middle" font-size="11" fill="#0284c7" font-weight="700">медиана</text>
            <text x="785" y="310" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="700">среднее</text>
            <line x1="705" y1="245" x2="705" y2="262" stroke="#059669" stroke-width="1.5"/>
            <line x1="745" y1="245" x2="745" y2="282" stroke="#0284c7" stroke-width="1.5"/>
            <line x1="785" y1="245" x2="785" y2="302" stroke="#dc2626" stroke-width="1.5"/>
            <text x="745" y="335" text-anchor="middle" font-size="11" fill="#475569" font-style="italic">мода &lt; медиана &lt; среднее</text>
          </g>
        </svg>
        <div class="caption">Три формы распределения. При <b>правом скосе</b> длинный хвост тянется вправо, и среднее «тянется» за ним: мода &lt; медиана &lt; среднее. При <b>левом скосе</b> наоборот. Симметричное — все три совпадают.</div>
        <script>
        (function() {
          var U = App.Util;
          // Симметричное: обычная нормальная, центр 455, halfWidth 110
          U.setPath(document, 'ds-skew-sym', U.normalOutlinePath(455, 240, 60, 110));
          // Левый скос — это «нормальная», смещённая так, что хвост слева.
          // Мы рисуем кривую с пиком справа от центра панели.
          // Пик у x=200 (мода), длинный хвост идёт влево.
          // Используем экспоненциальную с инверсией для левого хвоста.
          var leftSkew = buildLeftSkewPath(155, 240, 60, 200);
          document.getElementById('ds-skew-left').setAttribute('d', leftSkew);
          var rightSkew = buildRightSkewPath(755, 240, 60, 705);
          document.getElementById('ds-skew-right').setAttribute('d', rightSkew);

          function buildRightSkewPath(centerPanelX, baselineY, peakY, modeX) {
            // Лог-нормально-подобная форма: быстрый рост от 0 до моды, медленный спад
            // x от modeX-60 до modeX+170
            var pts = [];
            var x0 = modeX - 60;
            var x1 = modeX + 175;
            var n = 150;
            for (var i = 0; i <= n; i++) {
              var x = x0 + (x1 - x0) * i / n;
              var t = (x - modeX) / 50; // нормализованный
              var pdf;
              if (t < -1) {
                pdf = 0;
              } else if (t < 0) {
                // Быстрый подъём слева от моды
                pdf = Math.pow(1 + t, 4);
              } else {
                // Медленный экспоненциальный спад
                pdf = Math.exp(-t * 1.0);
              }
              var y = baselineY - pdf * (baselineY - peakY);
              pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
            }
            var d = 'M' + pts[0][0] + ',' + baselineY;
            for (var j = 0; j < pts.length; j++) d += ' L' + pts[j][0] + ',' + pts[j][1];
            d += ' L' + pts[pts.length - 1][0] + ',' + baselineY + ' Z';
            return d;
          }

          function buildLeftSkewPath(centerPanelX, baselineY, peakY, modeX) {
            // Зеркальный
            var pts = [];
            var x0 = modeX - 175;
            var x1 = modeX + 60;
            var n = 150;
            for (var i = 0; i <= n; i++) {
              var x = x0 + (x1 - x0) * i / n;
              var t = (x - modeX) / 50;
              var pdf;
              if (t > 1) {
                pdf = 0;
              } else if (t > 0) {
                pdf = Math.pow(1 - t, 4);
              } else {
                pdf = Math.exp(t * 1.0);
              }
              var y = baselineY - pdf * (baselineY - peakY);
              pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
            }
            var d = 'M' + pts[0][0] + ',' + baselineY;
            for (var j = 0; j < pts.length; j++) d += ' L' + pts[j][0] + ',' + pts[j][1];
            d += ' L' + pts[pts.length - 1][0] + ',' + baselineY + ' Z';
            return d;
          }
        })();
        </script>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Одно и то же среднее, разное стандартное отклонение</text>
          <line x1="50" y1="220" x2="710" y2="220" stroke="#475569" stroke-width="1.5"/>
          <!-- mean line -->
          <line x1="380" y1="40" x2="380" y2="230" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
          <text x="380" y="248" text-anchor="middle" font-size="12" fill="#64748b" font-weight="600">μ = 100</text>
          <!-- Narrow σ=5: peak high (60), narrow halfWidth -->
          <path id="ds-narrow" d="" fill="none" stroke="#059669" stroke-width="3"/>
          <!-- Wide σ=20: peak lower (170), wide halfWidth -->
          <path id="ds-wide" d="" fill="none" stroke="#dc2626" stroke-width="3"/>
          <!-- Legend -->
          <text x="180" y="80" text-anchor="middle" font-size="13" font-weight="600" fill="#059669">σ = 5 (данные кучкуются)</text>
          <text x="600" y="100" text-anchor="middle" font-size="13" font-weight="600" fill="#dc2626">σ = 20 (данные разлетаются)</text>
        </svg>
        <div class="caption">Два распределения с одинаковым средним (μ = 100), но разным σ. Зелёное (σ = 5) — узкое и высокое, значения кучкуются вокруг 100. Красное (σ = 20) — широкое и пологое, значения разлетаются гораздо сильнее.</div>
        <script>
        (function() {
          var U = App.Util;
          // Узкое распределение: халф-ширина 60 (соответствует ±3·5=15 единиц), пик высокий
          U.setPath(document, 'ds-narrow', U.normalOutlinePath(380, 220, 50, 60));
          // Широкое: халф-ширина 240 (±3·20=60 единиц), пик ниже (peakY=170 → высота 50)
          U.setPath(document, 'ds-wide', U.normalOutlinePath(380, 220, 170, 240));
        })();
        </script>
      </div>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Среднее — это типичное значение»</b> — не всегда. При правом скосе большинство значений <b>ниже</b> среднего.</li>
        <li><b>«Если std маленький, данные надёжны»</b> — нет, std говорит только о разбросе, а не о качестве данных.</li>
        <li><b>«Два датасета с одинаковыми статистиками похожи»</b> — ложь. Квартет Анскомба показывает: 4 совершенно разных датасета имеют одинаковые среднее, std и корреляцию. Всегда визуализируй.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: почему n−1, а не n в дисперсии?</summary>
        <div class="deep-dive-body">
          <p>Когда мы считаем дисперсию по выборке, нам не известно истинное среднее генеральной совокупности — мы используем <b>выборочное</b> среднее $\\bar{x}$. Но $\\bar{x}$ само зависит от наших данных и уже «подогнано» под них, чтобы отклонения в сумме давали ноль.</p>
          <p>Это означает, что при фиксированном $\\bar{x}$ у нас есть только $n-1$ <span class="term" data-tip="Число независимых значений, которые могут свободно меняться. Если известно среднее, последнее число определяется однозначно → одна степень свободы теряется.">степень свободы</span> — последнее значение определяется однозначно из остальных.</p>
          <p>Деление на $n-1$ (<b>поправка Бесселя</b>) компенсирует эту «потерянную» степень свободы и делает оценку <b>несмещённой</b> — в среднем она равна истинной дисперсии генеральной совокупности. Деление на $n$ дало бы систематически заниженную оценку.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: робастные альтернативы</summary>
        <div class="deep-dive-body">
          <p>Если данные «грязные» (с выбросами), классические статистики могут обманывать. Вместо них используют <b>робастные</b> (устойчивые) версии:</p>
          <ul>
            <li><b>Усечённое среднее (trimmed mean)</b> — удаляем k% крайних значений с каждой стороны, потом считаем среднее. 10% trimmed mean игнорирует топ и низ 10%.</li>
            <li><b>MAD (median absolute deviation)</b> — медиана отклонений от медианы. Альтернатива std, устойчивая к выбросам: $\\text{MAD} = \\text{median}(|x_i - \\text{median}(x)|)$.</li>
            <li><b>Huber M-estimator</b> — компромисс между средним и медианой.</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li>Описательная статистика — это база, от которой отталкиваются <b>все</b> остальные методы: распределения, гипотезы, ML-модели.</li>
        <li>Среднее и дисперсия — ключевые параметры нормального распределения.</li>
        <li>ЦПТ показывает, что выборочное <b>среднее</b> всегда распределено примерно нормально — поэтому именно оно, а не медиана, лежит в основе большинства тестов.</li>
        <li>В ML при препроцессинге почти всегда стандартизируют признаки: $x_{new} = (x - \\bar{x}) / s$.</li>
      </ul>

      <h3>📊 Графики, которые здесь упомянуты — отдельные темы в глоссарии</h3>
      <ul>
        <li><a onclick="App.selectTopic('viz-histogram')">Гистограмма</a> — главный инструмент визуализации формы распределения.</li>
        <li><a onclick="App.selectTopic('viz-box-plot')">Box plot (ящик с усами)</a> — компактная визуализация квартилей и выбросов.</li>
        <li><a onclick="App.selectTopic('viz-violin-plot')">Violin plot</a> — гибрид <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">box plot</a> и плотности.</li>
        <li><a onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a> — визуальная проверка нормальности.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Среднее и медиана зарплат',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>В маленькой IT-компании 8 человек. Нужно понять «типичную» зарплату для отчёта инвестору. Вот зарплаты (тыс. руб/мес):</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Сотрудник</th><th>Анна</th><th>Борис</th><th>Вика</th><th>Глеб</th><th>Даша</th><th>Егор</th><th>Женя</th><th>Директор</th></tr>
              <tr><td><b>Зарплата</b></td><td>60</td><td>65</td><td>70</td><td>75</td><td>80</td><td>85</td><td>90</td><td>450</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Считаем среднее арифметическое</h4>
            <p>Складываем все зарплаты и делим на количество:</p>
            <div class="calc">среднее = (60 + 65 + 70 + 75 + 80 + 85 + 90 + 450) / 8
= 975 / 8
= <b>121.9 тыс.</b></div>
            <div class="why">Среднее учитывает каждое значение — это его сильная сторона (использует всю информацию), но и слабость: одна зарплата директора 450 тыс. «утянула» среднее далеко вверх.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем медиану</h4>
            <p>Данные уже отсортированы. У нас 8 значений (чётное), поэтому берём среднее 4-го и 5-го:</p>
            <div class="calc">60, 65, 70, <b>75, 80</b>, 85, 90, 450
                        ↑4-е  ↑5-е

медиана = (75 + 80) / 2 = <b>77.5 тыс.</b></div>
            <div class="why">Медиана смотрит только на позицию в отсортированном ряду, а не на величину. Зарплата 450 могла быть хоть миллион — медиана не изменилась бы. Именно поэтому она устойчива к выбросам.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Сравниваем результаты</h4>
            <p>Среднее = 121.9, медиана = 77.5. Разница огромная!</p>
            <p>Из 8 человек <b>семеро</b> получают <b>ниже</b> среднего. Среднее завышено директорской зарплатой и не отражает «типичную» ситуацию. Медиана ближе к реальности: половина получает больше 77.5, половина — меньше.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Среднее = <b>121.9 тыс.</b>, медиана = <b>77.5 тыс.</b> При наличии выброса (директор) медиана лучше описывает «типичную» зарплату.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 160" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <text x="240" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Зарплаты: среднее vs медиана</text>
              <!-- axis -->
              <line x1="30" y1="90" x2="460" y2="90" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- scale labels: 60..450 mapped to x=30..460 -->
              <!-- x = 30 + (val-60)/(450-60)*430 -->
              <!-- 60→30, 65→35.5, 70→41, 75→46.5, 80→52, 85→57.5, 90→63, 450→460 -->
              <!-- salary dots -->
              <circle cx="30"  cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="36"  cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="41"  cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="47"  cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="52"  cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="58"  cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="63"  cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <circle cx="460" cy="90" r="6" fill="#3b82f6" opacity="0.85"/>
              <!-- mean line at 121.9 → x = 30 + (121.9-60)/390*430 ≈ 98 -->
              <line x1="98" y1="55" x2="98" y2="125" stroke="#ef4444" stroke-width="2.5"/>
              <text x="98" y="48" text-anchor="middle" font-size="11" font-weight="600" fill="#ef4444">Среднее</text>
              <text x="98" y="140" text-anchor="middle" font-size="10" fill="#ef4444">121.9 тыс.</text>
              <!-- median line at 77.5 → x = 30 + (77.5-60)/390*430 ≈ 49 -->
              <line x1="49" y1="55" x2="49" y2="125" stroke="#10b981" stroke-width="2.5"/>
              <text x="49" y="48" text-anchor="middle" font-size="11" font-weight="600" fill="#10b981">Медиана</text>
              <text x="49" y="140" text-anchor="middle" font-size="10" fill="#10b981">77.5 тыс.</text>
              <!-- axis ticks -->
              <text x="30"  y="106" text-anchor="middle" font-size="9" fill="#64748b">60</text>
              <text x="460" y="106" text-anchor="middle" font-size="9" fill="#64748b">450</text>
              <!-- arrow showing pull -->
              <path d="M55,72 Q76,62 92,72" stroke="#ef4444" stroke-width="1.5" fill="none" marker-end="url(#arr)"/>
              <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/></marker></defs>
              <text x="73" y="60" text-anchor="middle" font-size="9" fill="#ef4444">выброс тянет вверх</text>
            </svg>
            <div class="caption">Число 450 (директор) сдвигает среднее (красная линия) далеко вправо от реальной «середины» данных. Медиана (зелёная) остаётся там, где большинство точек.</div>
          </div>

          <div class="lesson-box">Когда в данных есть выбросы или сильный «скос» — используй медиану вместо среднего. Именно поэтому новости о «средней зарплате по стране» часто вводят в заблуждение.</div>
        `
      },
      {
        title: 'Дисперсия и стандартное отклонение',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Два магазина продают примерно одинаковое количество товаров в день. Но менеджер хочет понять, какой магазин <b>стабильнее</b>. Вот продажи за 5 дней (штук):</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>День</th><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th></tr>
              <tr><td><b>Магазин A</b></td><td>48</td><td>51</td><td>50</td><td>49</td><td>52</td></tr>
              <tr><td><b>Магазин B</b></td><td>20</td><td>80</td><td>50</td><td>30</td><td>70</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Считаем среднее обоих магазинов</h4>
            <div class="calc">Магазин A: (48+51+50+49+52) / 5 = 250 / 5 = <b>50</b>
Магазин B: (20+80+50+30+70) / 5 = 250 / 5 = <b>50</b></div>
            <p>Среднее одинаковое — 50 штук! Но продажи ведут себя совсем по-разному.</p>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем отклонения от среднего</h4>
            <p>Для каждого дня вычтем среднее (50):</p>
            <div class="example-data-table">
              <table>
                <tr><th>День</th><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th></tr>
                <tr><td><b>A: отклонение</b></td><td>−2</td><td>+1</td><td>0</td><td>−1</td><td>+2</td></tr>
                <tr><td><b>B: отклонение</b></td><td>−30</td><td>+30</td><td>0</td><td>−20</td><td>+20</td></tr>
              </table>
            </div>
            <div class="why">Отклонения показывают, насколько каждое значение далеко от среднего. У магазина B отклонения в десятки раз больше — он нестабильнее.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Возводим отклонения в квадрат и усредняем → дисперсия</h4>
            <div class="calc">Магазин A: ((−2)² + 1² + 0² + (−1)² + 2²) / (5−1)
           = (4 + 1 + 0 + 1 + 4) / 4
           = 10 / 4 = <b>2.5</b>

Магазин B: ((−30)² + 30² + 0² + (−20)² + 20²) / (5−1)
           = (900 + 900 + 0 + 400 + 400) / 4
           = 2600 / 4 = <b>650</b></div>
            <div class="why">Делим на n−1 (а не n), потому что мы оцениваем дисперсию по выборке, а не по всей генеральной совокупности. Это поправка Бесселя — без неё оценка была бы систематически занижена.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Извлекаем корень → стандартное отклонение</h4>
            <div class="calc">Магазин A: std = √2.5 ≈ <b>1.6 штуки</b>
Магазин B: std = √650 ≈ <b>25.5 штук</b></div>
            <div class="why">Дисперсия измеряется в квадратных единицах (штуки²), что неудобно. Корень возвращает нас к исходным единицам — теперь можно сказать: «типичное отклонение от среднего у A — 1.6 штуки, у B — 25.5 штук».</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Магазин A: среднее 50, std ≈ <b>1.6</b> — очень стабильный.</p>
            <p>Магазин B: среднее 50, std ≈ <b>25.5</b> — непредсказуемый, огромные колебания.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 160" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <text x="240" y="15" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Разброс: Магазин A (тесно) vs Магазин B (широко)</text>
              <!-- Store A axis -->
              <line x1="20" y1="70" x2="220" y2="70" stroke="#94a3b8" stroke-width="1.2"/>
              <text x="120" y="100" text-anchor="middle" font-size="11" font-weight="600" fill="#3b82f6">Магазин A  std ≈ 1.6</text>
              <!-- A dots: 48,49,50,51,52 — center 50, range 48-52 → scale to x 20-220, center=120 -->
              <!-- x = 120 + (val-50)*20 -->
              <circle cx="80"  cy="70" r="8" fill="#3b82f6" opacity="0.75"/> <!-- 48 -->
              <circle cx="100" cy="70" r="8" fill="#3b82f6" opacity="0.75"/> <!-- 49 -->
              <circle cx="120" cy="70" r="8" fill="#3b82f6" opacity="0.75"/> <!-- 50 -->
              <circle cx="140" cy="70" r="8" fill="#3b82f6" opacity="0.75"/> <!-- 51 -->
              <circle cx="160" cy="70" r="8" fill="#3b82f6" opacity="0.75"/> <!-- 52 -->
              <!-- center tick A -->
              <line x1="120" y1="55" x2="120" y2="85" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,2"/>
              <text x="120" y="50" text-anchor="middle" font-size="10" fill="#64748b">μ=50</text>
              <!-- Store B axis -->
              <line x1="260" y1="70" x2="460" y2="70" stroke="#94a3b8" stroke-width="1.2"/>
              <text x="360" y="100" text-anchor="middle" font-size="11" font-weight="600" fill="#ef4444">Магазин B  std ≈ 25.5</text>
              <!-- B dots: 20,30,50,70,80 — center 50, range 20-80 → scale center=360, x=360+(val-50)*2 -->
              <circle cx="300" cy="70" r="8" fill="#ef4444" opacity="0.75"/> <!-- 20 -->
              <circle cx="320" cy="70" r="8" fill="#ef4444" opacity="0.75"/> <!-- 30 -->
              <circle cx="360" cy="70" r="8" fill="#ef4444" opacity="0.75"/> <!-- 50 -->
              <circle cx="400" cy="70" r="8" fill="#ef4444" opacity="0.75"/> <!-- 70 -->
              <circle cx="420" cy="70" r="8" fill="#ef4444" opacity="0.75"/> <!-- 80 -->
              <!-- center tick B -->
              <line x1="360" y1="55" x2="360" y2="85" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,2"/>
              <text x="360" y="50" text-anchor="middle" font-size="10" fill="#64748b">μ=50</text>
              <!-- divider -->
              <line x1="240" y1="25" x2="240" y2="115" stroke="#e2e8f0" stroke-width="1"/>
              <!-- bracket A -->
              <line x1="80" y1="130" x2="160" y2="130" stroke="#3b82f6" stroke-width="1.5"/>
              <line x1="80" y1="125" x2="80" y2="135" stroke="#3b82f6" stroke-width="1.5"/>
              <line x1="160" y1="125" x2="160" y2="135" stroke="#3b82f6" stroke-width="1.5"/>
              <text x="120" y="148" text-anchor="middle" font-size="9" fill="#3b82f6">диапазон 48–52</text>
              <!-- bracket B -->
              <line x1="300" y1="130" x2="420" y2="130" stroke="#ef4444" stroke-width="1.5"/>
              <line x1="300" y1="125" x2="300" y2="135" stroke="#ef4444" stroke-width="1.5"/>
              <line x1="420" y1="125" x2="420" y2="135" stroke="#ef4444" stroke-width="1.5"/>
              <text x="360" y="148" text-anchor="middle" font-size="9" fill="#ef4444">диапазон 20–80</text>
            </svg>
            <div class="caption">Оба магазина имеют одинаковое среднее (μ = 50). Но Магазин A (синий) компактен — все значения близко. Магазин B (красный) разбросан на весь диапазон. Std улавливает именно этот разброс.</div>
          </div>

          <div class="lesson-box">Среднее само по себе не показывает, насколько данные стабильны. Стандартное отклонение — это «типичный размер колебания» вокруг среднего. Маленький std = стабильные данные, большой std = хаос.</div>
        `
      },
      {
        title: 'Квартили, IQR и <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a>',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Врач измеряет пульс у 11 пациентов в покое (ударов/мин). Нужно описать распределение и найти подозрительные значения.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Пациент</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr>
              <tr><td><b>Пульс</b></td><td>58</td><td>62</td><td>65</td><td>68</td><td>70</td><td>72</td><td>74</td><td>76</td><td>80</td><td>85</td><td>120</td></tr>
            </table>
          </div>
          <p>Данные уже отсортированы по возрастанию. 11 пациентов.</p>

          <div class="step" data-step="1">
            <h4>Находим медиану (Q2)</h4>
            <p>11 значений — нечётное, медиана = значение посередине = 6-е по счёту:</p>
            <div class="calc">58, 62, 65, 68, 70, <b>[72]</b>, 74, 76, 80, 85, 120
                                   ↑ 6-е значение

Медиана (Q2) = <b>72</b></div>
            <div class="why">Медиана делит данные пополам: 5 значений ниже 72, 5 — выше. Это «серединный» пульс.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Находим Q1 (первый квартиль)</h4>
            <p>Q1 — медиана <b>нижней</b> половины (все значения ниже медианы):</p>
            <div class="calc">Нижняя половина: 58, 62, <b>[65]</b>, 68, 70
                                         ↑ Q1

Q1 = <b>65</b></div>
            <div class="why">25% пациентов имеют пульс ниже 65. Q1 отсекает нижнюю четверть данных.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Находим Q3 (третий квартиль)</h4>
            <p>Q3 — медиана <b>верхней</b> половины:</p>
            <div class="calc">Верхняя половина: 74, 76, <b>[80]</b>, 85, 120
                                          ↑ Q3

Q3 = <b>80</b></div>
          </div>

          <div class="step" data-step="4">
            <h4>Считаем IQR</h4>
            <div class="calc">IQR = Q3 − Q1 = 80 − 65 = <b>15</b></div>
            <div class="why">IQR — диапазон, в котором лежит центральная половина данных (от 25-го до 75-го перцентиля). Устойчив к выбросам, потому что крайние 25% сверху и снизу игнорируются.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Определяем выбросы по правилу 1.5×IQR</h4>
            <p>Считаем границы «нормальных» значений:</p>
            <div class="calc">Нижняя граница = Q1 − 1.5 × IQR = 65 − 1.5 × 15 = 65 − 22.5 = <b>42.5</b>
Верхняя граница = Q3 + 1.5 × IQR = 80 + 1.5 × 15 = 80 + 22.5 = <b>102.5</b></div>
            <p>Все значения ниже 42.5 или выше 102.5 — <b>выбросы</b>.</p>
            <p>Проверяем: пульс 120 > 102.5 → <b>выброс!</b> Все остальные в пределах нормы.</p>
            <div class="why">Правило 1.5×IQR — стандартный метод из <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a>. Множитель 1.5 выбран исторически: для нормального распределения он помечает ~0.7% самых крайних значений.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Собираем «пятёрку чисел» (five-number summary)</h4>
            <div class="calc">Min = 58
Q1  = 65
Q2  = 72 (медиана)
Q3  = 80
Max = 120 (выброс!)</div>
            <p>Эти 5 чисел — основа <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a>. «Ящик» от Q1 до Q3, линия внутри — медиана, «усы» до крайних не-выбросов, отдельные точки — выбросы.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Медиана пульса = <b>72</b>. IQR = <b>15</b> (от 65 до 80). Пациент с пульсом <b>120</b> — выброс (нужно проверить: тахикардия? ошибка измерения?).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 160" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="15" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b"><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a>: пульс 11 пациентов</text>
              <!-- axis: values 58..120, map to x 40..420, scale=(420-40)/(120-58)=380/62≈6.13 -->
              <!-- x = 40 + (val-58)*6.13 -->
              <!-- Min=58→40, Q1=65→82.9, Q2=72→124.9, Q3=80→173.8, max(non-outlier)=85→204.5, outlier=120→451 clamp to 430 -->
              <line x1="40" y1="90" x2="435" y2="90" stroke="#94a3b8" stroke-width="1.2"/>
              <!-- whisker left: min(58)→40 to Q1(65)→83 -->
              <line x1="40" y1="90" x2="83" y2="90" stroke="#6366f1" stroke-width="2"/>
              <line x1="40" y1="80" x2="40" y2="100" stroke="#6366f1" stroke-width="2"/>
              <!-- box Q1(65)→83 to Q3(80)→174 -->
              <rect x="83" y="65" width="91" height="50" fill="#818cf8" fill-opacity="0.22" stroke="#6366f1" stroke-width="2.5" rx="3"/>
              <!-- median Q2(72)→125 -->
              <line x1="125" y1="65" x2="125" y2="115" stroke="#6366f1" stroke-width="3"/>
              <!-- whisker right: Q3(80)→174 to max-non-outlier(85)→204 -->
              <line x1="174" y1="90" x2="204" y2="90" stroke="#6366f1" stroke-width="2"/>
              <line x1="204" y1="80" x2="204" y2="100" stroke="#6366f1" stroke-width="2"/>
              <!-- dashed to outlier -->
              <line x1="204" y1="90" x2="420" y2="90" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="5,3"/>
              <!-- outlier dot at 120 -->
              <circle cx="430" cy="90" r="7" fill="none" stroke="#ef4444" stroke-width="2"/>
              <!-- labels below axis -->
              <text x="40"  y="115" text-anchor="middle" font-size="10" fill="#64748b">58</text>
              <text x="83"  y="115" text-anchor="middle" font-size="10" fill="#6366f1">Q1=65</text>
              <text x="125" y="115" text-anchor="middle" font-size="10" fill="#6366f1">M=72</text>
              <text x="174" y="115" text-anchor="middle" font-size="10" fill="#6366f1">Q3=80</text>
              <text x="204" y="115" text-anchor="middle" font-size="10" fill="#64748b">85</text>
              <text x="430" y="115" text-anchor="middle" font-size="10" fill="#ef4444">120!</text>
              <!-- IQR bracket -->
              <line x1="83" y1="140" x2="174" y2="140" stroke="#6366f1" stroke-width="1.5"/>
              <line x1="83" y1="135" x2="83" y2="145" stroke="#6366f1" stroke-width="1.5"/>
              <line x1="174" y1="135" x2="174" y2="145" stroke="#6366f1" stroke-width="1.5"/>
              <text x="128" y="155" text-anchor="middle" font-size="10" fill="#6366f1">IQR = 15</text>
              <!-- outlier label -->
              <text x="430" y="55" text-anchor="middle" font-size="10" fill="#ef4444">выброс</text>
              <line x1="430" y1="58" x2="430" y2="78" stroke="#ef4444" stroke-width="1"/>
            </svg>
            <div class="caption"><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a>: ящик — от Q1 до Q3 (IQR=15), линия внутри — медиана (72), усы — до крайних «нормальных» значений (58 и 85). Пульс 120 вышел за порог 1.5×IQR — показан отдельной точкой-выбросом.</div>
          </div>

          <div class="lesson-box">Квартили и IQR — «робастная» альтернатива среднему и std: они устойчивы к выбросам. В <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a> всё наглядно видно: центр, разброс и подозрительные точки.</div>
        `
      },
      {
        title: 'Коэффициент вариации',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Инвестор сравнивает волатильность двух активов. Акция стоит ~5000 руб, криптовалюта ~0.5 руб. Стандартные отклонения:</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Актив</th><th>Средняя цена</th><th>Std (за день)</th></tr>
              <tr><td>Акция «Газпром»</td><td>5000 руб</td><td>100 руб</td></tr>
              <tr><td>Криптовалюта XYZ</td><td>0.50 руб</td><td>0.05 руб</td></tr>
            </table>
          </div>

          <p>На первый взгляд, акция волатильнее: std 100 руб против 0.05 руб. Но это нечестно — масштабы цен разные!</p>

          <div class="step" data-step="1">
            <h4>Считаем коэффициент вариации (CV)</h4>
            <p>CV = std / среднее. Это <b>безразмерная</b> мера — показывает разброс в процентах от среднего:</p>
            <div class="calc">Акция:  CV = 100 / 5000 = 0.02 = <b>2%</b>
Крипта: CV = 0.05 / 0.50 = 0.10 = <b>10%</b></div>
            <div class="why">CV убирает зависимость от масштаба. Теперь сравнение честное: не «рубли колебаний», а «доля от цены».</div>
          </div>

          <div class="step" data-step="2">
            <h4>Интерпретируем результат</h4>
            <p>Акция: цена колеблется на ~2% в день. Криптовалюта — на ~10%. Криптовалюта в 5 раз волатильнее, хотя её абсолютный std в 2000 раз меньше.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>CV акции = <b>2%</b>, CV крипты = <b>10%</b>. Криптовалюта <b>в 5 раз волатильнее</b> в относительном выражении.</p>
          </div>

          <div class="lesson-box">Когда нужно сравнить разброс двух величин разного масштаба (цены, зарплаты в разных странах, размеры клеток) — используй коэффициент вариации. Std без контекста масштаба бессмыслен для сравнения.</div>
        `
      },
      {
        title: 'Скошенность: среднее vs медиана',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Маркетолог анализирует время, которое 12 пользователей провели на сайте (минут). Нужно понять «типичное» время и форму распределения.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Пользователь</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>
              <tr><td><b>Время (мин)</b></td><td>0.5</td><td>1</td><td>1.5</td><td>2</td><td>2</td><td>3</td><td>3</td><td>4</td><td>5</td><td>8</td><td>15</td><td>45</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Считаем среднее</h4>
            <div class="calc">среднее = (0.5+1+1.5+2+2+3+3+4+5+8+15+45) / 12
        = 90 / 12 = <b>7.5 минут</b></div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем медиану</h4>
            <div class="calc">12 значений → медиана = среднее 6-го и 7-го:
(3 + 3) / 2 = <b>3 минуты</b></div>
          </div>

          <div class="step" data-step="3">
            <h4>Сравниваем и делаем вывод о форме</h4>
            <p>Среднее (7.5) намного <b>больше</b> медианы (3). Это признак <b>правого скоса</b>: длинный хвост вправо — несколько пользователей сидят очень долго, «перетягивая» среднее.</p>
            <div class="why">Правило: если среднее > медианы — распределение скошено вправо (positive skew). Если среднее &lt; медианы — влево. Если примерно равны — симметричное. Это помогает быстро оценить форму без графика.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Что рапортовать менеджеру</h4>
            <p>«Типичный пользователь сидит на сайте <b>3 минуты</b> (медиана). Среднее завышено до 7.5 из-за нескольких пользователей, которые сидят по 15-45 минут.»</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Среднее = <b>7.5 мин</b>, медиана = <b>3 мин</b>. Распределение с правым скосом. Для «типичного» пользователя лучше использовать медиану.</p>
          </div>

          <div class="lesson-box">Время на сайте, доходы, цены, задержки серверов — почти всегда скошены вправо. В таких случаях медиана намного полезнее среднего. А бизнесу стоит смотреть на перцентили: p50 (медиана), p90, p95, p99.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: как выбросы влияют на статистики</h3>
        <p>Сгенерируй выборку и посмотри, как меняются среднее/медиана/std при добавлении выбросов.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dstat-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dstat-regen">🔄 Новая выборка</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="dstat-chart"></canvas></div>
            <div class="sim-stats" id="dstat-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dstat-controls');
        const c1 = App.makeControl('range', 'dstat-n', 'Размер выборки', { min: 20, max: 500, step: 10, value: 100 });
        const c2 = App.makeControl('range', 'dstat-mu', 'Среднее μ', { min: 0, max: 100, step: 1, value: 50 });
        const c3 = App.makeControl('range', 'dstat-sigma', 'Ст. отклонение σ', { min: 1, max: 30, step: 1, value: 10 });
        const c4 = App.makeControl('range', 'dstat-outliers', 'Количество выбросов', { min: 0, max: 20, step: 1, value: 0 });
        const c5 = App.makeControl('range', 'dstat-outlier-val', 'Значение выброса', { min: 50, max: 500, step: 10, value: 200 });
        [c1, c2, c3, c4, c5].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;

        function run() {
          const n = +c1.input.value;
          const mu = +c2.input.value;
          const sigma = +c3.input.value;
          const nOut = +c4.input.value;
          const outVal = +c5.input.value;

          const base = App.Util.normalSample(n, mu, sigma);
          const outliers = new Array(nOut).fill(outVal);
          const data = [...base, ...outliers];

          const mean = App.Util.mean(data);
          const median = App.Util.median(data);
          const std = App.Util.std(data);
          const q1 = App.Util.quantile(data, 0.25);
          const q3 = App.Util.quantile(data, 0.75);
          const iqr = q3 - q1;

          // <a class="glossary-link" onclick="App.selectTopic('viz-histogram')">Гистограмма</a> с фиксированным range
          const histRange = [-20, Math.max(outVal + 20, 120)];
          const hist = App.Util.histogram(data, 40, histRange);
          const ctx = container.querySelector('#dstat-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: hist.centers.map((c) => App.Util.round(c, 1)),
              datasets: [
                {
                  label: 'Частота',
                  data: hist.counts,
                  backgroundColor: 'rgba(59, 130, 246, 0.55)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                annotation: {},
                tooltip: { callbacks: { title: (items) => 'x ≈ ' + items[0].label } },
              },
              scales: {
                x: { title: { display: true, text: 'Значение' }, ticks: { maxTicksLimit: 15 } },
                y: { title: { display: true, text: 'Частота' }, min: 0, max: Math.round(n * 0.3), beginAtZero: true },
              },
            },
          });
          App.registerChart(chart);

          // Статистики
          const statsEl = container.querySelector('#dstat-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Среднее', App.Util.round(mean, 2)],
            ['Медиана', App.Util.round(median, 2)],
            ['Std', App.Util.round(std, 2)],
            ['Q1', App.Util.round(q1, 2)],
            ['Q3', App.Util.round(q3, 2)],
            ['IQR', App.Util.round(iqr, 2)],
            ['Min', App.Util.round(App.Util.min(data), 2)],
            ['Max', App.Util.round(App.Util.max(data), 2)],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [c1, c2, c3, c4, c5].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#dstat-regen').onclick = run;
        run();
      },
    },

    python: `
      <h3>📊 Описательная статистика в Python</h3>
      <pre><code># NumPy — базовые статистики
import numpy as np

data = np.array([60, 65, 70, 75, 80, 85, 90, 450])

print(f"Среднее:  {np.mean(data):.1f}")      # 121.9
print(f"Медиана:  {np.median(data):.1f}")     # 77.5
print(f"Std:      {np.std(data, ddof=1):.1f}")# ddof=1 для выборочной
print(f"Q1:       {np.quantile(data, 0.25):.1f}")
print(f"Q3:       {np.quantile(data, 0.75):.1f}")
print(f"IQR:      {np.quantile(data,0.75) - np.quantile(data,0.25):.1f}")</code></pre>

      <h3>📋 Pandas — одна строка для всего</h3>
      <pre><code>import pandas as pd

s = pd.Series([60, 65, 70, 75, 80, 85, 90, 450], name="Зарплата")
print(s.describe())
# count      8.0
# mean     121.9
# std      130.7
# min       60.0
# 25%       68.75
# 50%       77.5   ← медиана
# 75%       86.25
# max      450.0</code></pre>

      <h3>📈 <a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a> в Matplotlib</h3>
      <pre><code>import matplotlib.pyplot as plt

data = [60, 65, 70, 75, 80, 85, 90, 450]
plt.<a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">boxplot</a>(data, vert=False)
plt.title("<a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a> зарплат")
plt.xlabel("тыс. руб.")
plt.show()  # Выброс 450 виден как отдельная точка</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>EDA</b> — первый шаг анализа любых данных: посмотреть распределение, выявить аномалии.</li>
        <li><b>Мониторинг бизнес-метрик</b> — средний чек, медианное время отклика, 95-й перцентиль.</li>
        <li><b>A/B тесты</b> — сравнение средних и дисперсий двух групп.</li>
        <li><b>SLA / производительность систем</b> — p50, p95, p99 по задержкам.</li>
        <li><b>Контроль качества</b> — выход за пределы μ ± 3σ сигнализирует о браке.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Очень просто считать и интерпретировать</li>
            <li>Даёт быстрое представление о данных</li>
            <li>Основа для любой дальнейшей аналитики</li>
            <li>Легко передавать стейкхолдерам</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Одно число не отражает форму распределения</li>
            <li>Среднее и std чувствительны к выбросам</li>
            <li>Не показывают связи между переменными</li>
            <li>Могут вводить в заблуждение при мультимодальных данных</li>
          </ul>
        </div>
      </div>
      <div class="callout warn">⚠️ Квартет Анскомба: четыре разных датасета с одинаковыми средним, дисперсией и корреляцией — но совершенно разной формой. Всегда рисуй график!</div>
    `,

    extra: `
      <h3>Тонкости и ловушки</h3>
      <h4>Почему n−1, а не n?</h4>
      <p>При расчёте дисперсии по выборке мы оцениваем $\\bar{x}$, которое само зависит от данных. Это «съедает» одну степень свободы. Деление на $n-1$ компенсирует это и даёт несмещённую оценку.</p>

      <h4>Скошенность (skewness) и эксцесс (kurtosis)</h4>
      <p>Третий и четвёртый моменты описывают форму распределения:</p>
      <ul>
        <li><b>Skewness > 0</b> — длинный правый хвост (доходы, цены).</li>
        <li><b>Skewness < 0</b> — длинный левый хвост.</li>
        <li><b>Kurtosis > 3</b> — «тяжёлые хвосты» (больше выбросов, чем у нормального).</li>
      </ul>

      <h4><a class="glossary-link" onclick="App.selectTopic('viz-box-plot')">Boxplot</a></h4>
      <p>Графическое представление пятёрки чисел: min, Q1, median, Q3, max. Точки за пределами Q1−1.5·IQR и Q3+1.5·IQR считаются выбросами.</p>

      <h4>Робастные статистики</h4>
      <ul>
        <li><b>Trimmed mean</b> — среднее после удаления k% крайних значений.</li>
        <li><b>MAD</b> (median absolute deviation) — медиана отклонений от медианы, устойчивая альтернатива std.</li>
      </ul>

      <h3>Дальше</h3>
      <p>После описательной статистики обычно переходят к <b>распределениям</b> и <b>проверке гипотез</b> — они отвечают на вопрос «а значимо ли отличие?».</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=qBigTkBLU6g" target="_blank">StatQuest: Histograms, Clearly Explained</a> — наглядное объяснение <a class="glossary-link" onclick="App.selectTopic('viz-histogram')">гистограмм</a> и их параметров</li>
        <li><a href="https://www.youtube.com/watch?v=SzZ6GpcfoQY" target="_blank">StatQuest: Mean, Variance and Standard Deviation</a> — среднее, дисперсия и стандартное отклонение</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data" target="_blank">Khan Academy: Summarizing quantitative data</a> — интерактивный курс по описательной статистике</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BE%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B0%20%D1%81%D1%80%D0%B5%D0%B4%D0%BD%D0%B5%D0%B5%20%D0%BC%D0%B5%D0%B4%D0%B8%D0%B0%D0%BD%D0%B0" target="_blank">Habr: описательная статистика</a> — подборка русскоязычных статей на Хабре</li>
        <li><a href="https://en.wikipedia.org/wiki/Descriptive_statistics" target="_blank">Wikipedia: Descriptive statistics</a> — обзор методов описательной статистики</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://numpy.org/doc/stable/reference/routines.statistics.html" target="_blank">NumPy: Statistical routines</a> — mean, median, std, percentile и другие функции</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank">SciPy: scipy.stats</a> — расширенные статистические функции, skewness, kurtosis</li>
        <li><a href="https://pandas.pydata.org/docs/reference/frame.html#computations-descriptive-stats" target="_blank">Pandas: describe() и статистические методы</a> — быстрый сводный анализ DataFrame</li>
      </ul>
    `,
  },
});
