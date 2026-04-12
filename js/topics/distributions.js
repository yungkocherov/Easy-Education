/* ==========================================================================
   Распределения
   ========================================================================== */
App.registerTopic({
  id: 'distributions',
  category: 'stats',
  title: 'Распределения',
  summary: 'Нормальное, биномиальное, Пуассона, экспоненциальное — формы случайности.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты играешь в игру: бросаешь кубик, крутишь рулетку или достаёшь карту из колоды. Результат случайный — но не любой. У кубика всегда выпадет число от 1 до 6, причём все с равной вероятностью. У рулетки — от 0 до 36. У монеты только орёл или решка.</p>
        <p>Распределение — это <b>правила игры</b> для случайной величины: какие значения она может принимать и как часто. Когда мы говорим «рост взрослых мужчин <b>распределён нормально</b>», мы имеем в виду, что правила такие: вокруг 175 см случаев много, 190 см уже редко, 210 см — почти никогда. Не каждый рост одинаково вероятен — есть закон.</p>
      </div>

      <h3>💡 Что такое распределение формально</h3>
      <p><span class="term" data-tip="Величина, значение которой определяется случайным экспериментом. До эксперимента известны только возможные значения и их вероятности.">Случайная величина</span> — это что-то, что принимает разные значения в зависимости от случая. Распределение описывает полную картину: какие значения возможны и с какой <b>вероятностью</b> (или плотностью) они встречаются.</p>

      <p>Есть два типа случайных величин:</p>
      <ul>
        <li><b>Дискретные</b> — принимают отдельные значения (1, 2, 3…). Примеры: число звонков, количество орлов, номер комнаты. Описываются через <span class="term" data-tip="Probability Mass Function. Функция, которая для каждого возможного значения x возвращает вероятность P(X = x).">PMF</span> — вероятность для каждого значения.</li>
        <li><b>Непрерывные</b> — принимают любое значение на отрезке (рост, время, температура). Описываются через <span class="term" data-tip="Probability Density Function. Плотность вероятности в точке x. Сама вероятность точки равна нулю, но интеграл плотности даёт вероятность попасть в интервал.">PDF</span> — плотность вероятности.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Важное различие</div>
        <p>Для <b>непрерывного</b> распределения вероятность точного значения всегда равна нулю ($P(X = 175.000\\ldots) = 0$). Имеет смысл только вероятность попасть в <b>интервал</b>: $P(170 < X < 180)$. Это потому что значений бесконечно много, и ни одному из них не досталось бы ненулевой вероятности.</p>
      </div>

      <h3>🎯 Зачем знать распределения</h3>
      <p>Распределения — это «словарь случайности». Понимая, как распределены данные, мы:</p>
      <ul>
        <li>Выбираем правильные статистические тесты (многие предполагают нормальность).</li>
        <li>Моделируем реальные процессы (очереди, отказы, трафик).</li>
        <li>Генерируем синтетические данные для симуляций.</li>
        <li>Понимаем ограничения ML-моделей (многие считают признаки нормальными).</li>
        <li>Правильно интерпретируем выбросы и хвосты.</li>
      </ul>

      <h3>📊 Ключевые распределения</h3>

      <div class="illustration bordered">
        <svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg" style="max-width:900px;">
          <defs>
            <linearGradient id="bellGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/></linearGradient>
            <linearGradient id="skewGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.4"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.05"/></linearGradient>
          </defs>
          <!-- Normal (generated) -->
          <text x="200" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">Нормальное (μ=0, σ=1)</text>
          <line x1="30" y1="240" x2="370" y2="240" stroke="#94a3b8" stroke-width="1.5"/>
          <path id="dist-intro-normal-area" d="" fill="url(#bellGrad)"/>
          <path id="dist-intro-normal" d="" fill="none" stroke="#1e40af" stroke-width="2.8"/>
          <line x1="200" y1="60" x2="200" y2="245" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="4"/>
          <text x="200" y="260" text-anchor="middle" font-size="12" fill="#1e40af" font-weight="700">μ</text>
          <line x1="137" y1="160" x2="263" y2="160" stroke="#64748b" stroke-width="1.5"/>
          <text x="200" y="178" text-anchor="middle" font-size="11" fill="#64748b">68% (μ±σ)</text>

          <!-- Right-skewed (generated) -->
          <text x="640" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#92400e">Правый скос (доходы, время)</text>
          <line x1="450" y1="240" x2="870" y2="240" stroke="#94a3b8" stroke-width="1.5"/>
          <path id="dist-intro-skew" d="" fill="url(#skewGrad)" stroke="#b45309" stroke-width="2.8"/>
          <!-- Mode, median, mean lines — well-separated -->
          <line id="dist-skew-mode" x1="0" y1="0" x2="0" y2="0" stroke="#059669" stroke-width="2" stroke-dasharray="4,2"/>
          <line id="dist-skew-median" x1="0" y1="0" x2="0" y2="0" stroke="#0284c7" stroke-width="2" stroke-dasharray="4,2"/>
          <line id="dist-skew-mean" x1="0" y1="0" x2="0" y2="0" stroke="#dc2626" stroke-width="2" stroke-dasharray="4,2"/>
          <text id="dist-skew-mode-label" x="0" y="260" text-anchor="middle" font-size="12" font-weight="700" fill="#059669">мода</text>
          <text id="dist-skew-median-label" x="0" y="278" text-anchor="middle" font-size="12" font-weight="700" fill="#0284c7">медиана</text>
          <text id="dist-skew-mean-label" x="0" y="296" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">среднее</text>
        </svg>
        <div class="caption">Слева: нормальное распределение — симметричный колокол, μ точно в центре. Справа: правый скос — мода (пик) левее медианы, медиана левее среднего. Длинный хвост «тянет» среднее вправо.</div>
        <script>
        (function() {
          var U = App.Util;
          // Normal: center 200, baseline 240, peak 60, halfWidth 150
          U.setPath(document, 'dist-intro-normal-area', U.normalSegmentPath(200, 240, 60, 150, -3, 3));
          U.setPath(document, 'dist-intro-normal', U.normalOutlinePath(200, 240, 60, 150));

          // Right-skewed: use custom path builder
          var modeX = 560;  // mode position
          var x0 = modeX - 80, x1 = modeX + 300;
          var baselineY = 240, peakY = 60;
          var n = 200;
          var pts = [];
          for (var i = 0; i <= n; i++) {
            var x = x0 + (x1 - x0) * i / n;
            var t = (x - modeX) / 60;
            var pdf;
            if (t < -1.2) pdf = 0;
            else if (t < 0) pdf = Math.pow(1 + t / 1.2, 4);
            else pdf = Math.exp(-t * 0.8);
            var y = baselineY - pdf * (baselineY - peakY);
            pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
          }
          var d = 'M' + pts[0][0] + ',' + baselineY;
          for (var j = 0; j < pts.length; j++) d += ' L' + pts[j][0] + ',' + pts[j][1];
          d += ' L' + pts[pts.length - 1][0] + ',' + baselineY + ' Z';
          document.getElementById('dist-intro-skew').setAttribute('d', d);

          // Position mode, median, mean lines
          var modePx = modeX;
          var medianPx = modeX + 50;
          var meanPx = modeX + 100;
          function setLine(id, x) {
            var el = document.getElementById(id);
            el.setAttribute('x1', x); el.setAttribute('x2', x);
            el.setAttribute('y1', 55); el.setAttribute('y2', 245);
          }
          setLine('dist-skew-mode', modePx);
          setLine('dist-skew-median', medianPx);
          setLine('dist-skew-mean', meanPx);
          document.getElementById('dist-skew-mode-label').setAttribute('x', modePx);
          document.getElementById('dist-skew-median-label').setAttribute('x', medianPx);
          document.getElementById('dist-skew-mean-label').setAttribute('x', meanPx);
        })();
        </script>
      </div>

      <h4>📊 Нормальное (Gaussian) — $N(\\mu, \\sigma^2)$</h4>
      <p>Главное распределение статистики. Симметричный «колокол» вокруг среднего $\\mu$. Ширина колокола задаётся $\\sigma$ (стандартным отклонением).</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="nG68" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.55"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.1"/></linearGradient>
            <linearGradient id="nG95" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/></linearGradient>
            <linearGradient id="nG997" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#94a3b8" stop-opacity="0.3"/><stop offset="100%" stop-color="#94a3b8" stop-opacity="0.05"/></linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e40af">Нормальное распределение и правило 68–95–99.7</text>
          <!-- Axis -->
          <line x1="60" y1="270" x2="700" y2="270" stroke="#475569" stroke-width="1.5"/>
          <!-- Tick marks: center 380, halfwidth 270, ±3σ -->
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="110" y="290">μ−3σ</text>
            <text x="200" y="290">μ−2σ</text>
            <text x="290" y="290">μ−σ</text>
            <text x="380" y="290" font-weight="700" fill="#1e40af">μ</text>
            <text x="470" y="290">μ+σ</text>
            <text x="560" y="290">μ+2σ</text>
            <text x="650" y="290">μ+3σ</text>
          </g>
          <!-- Generated paths (filled in by init) -->
          <path id="dist-997-area" d="" fill="url(#nG997)"/>
          <path id="dist-95-area" d="" fill="url(#nG95)"/>
          <path id="dist-68-area" d="" fill="url(#nG68)"/>
          <path id="dist-bell-outline" d="" fill="none" stroke="#1e40af" stroke-width="2.5"/>
          <!-- Mean line -->
          <line x1="380" y1="270" x2="380" y2="60" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="4,3"/>
          <!-- Percentage labels -->
          <text x="380" y="180" text-anchor="middle" font-size="18" font-weight="800" fill="#047857">68%</text>
          <text x="240" y="225" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">95%</text>
          <text x="520" y="225" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">95%</text>
          <text x="150" y="255" text-anchor="middle" font-size="11" fill="#475569">99.7%</text>
          <text x="610" y="255" text-anchor="middle" font-size="11" fill="#475569">99.7%</text>
        </svg>
        <div class="caption">Правило 68–95–99.7 на графике. В пределах одного сигма (зелёная зона) — 68% значений, в двух (синяя) — 95%, в трёх (серая) — 99.7%. За 3σ — менее 0.3% «экстремумов».</div>
        <script>
        (function() {
          var svg = document.getElementById('dist-bell-outline');
          if (!svg) return;
          var U = App.Util;
          var cx = 380, baselineY = 270, peakY = 60, halfWidth = 270;
          U.setPath(document, 'dist-bell-outline', U.normalOutlinePath(cx, baselineY, peakY, halfWidth));
          U.setPath(document, 'dist-997-area', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -3, 3));
          U.setPath(document, 'dist-95-area', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -2, 2));
          U.setPath(document, 'dist-68-area', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -1, 1));
        })();
        </script>
      </div>

      <p><b>Почему оно везде:</b> благодаря <span class="term" data-tip="Центральная предельная теорема. Утверждает, что среднее любых случайных величин (с конечной дисперсией) стремится к нормальному при большой выборке.">ЦПТ</span> — сумма большого числа независимых случайных факторов стремится к нормальному. Рост человека = сумма сотен генетических и средовых факторов → нормальное. Ошибка измерения = сумма многих мелких погрешностей → нормальное.</p>
      <p><b>Правило 68–95–99.7:</b> в пределах $\\mu \\pm \\sigma$ лежит ~68% значений, в $\\mu \\pm 2\\sigma$ — 95%, в $\\mu \\pm 3\\sigma$ — 99.7%. Это «правило трёх сигм».</p>
      <p><b>Где встречается:</b> рост, вес, IQ, ошибки измерений, шум в сигналах, остатки регрессии.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e40af">Влияние параметров μ и σ на форму нормального распределения</text>
          <line x1="40" y1="220" x2="720" y2="220" stroke="#475569" stroke-width="1.5"/>
          <!-- 3 normal curves: narrow at cx=200, standard at cx=380, wide at cx=560 -->
          <path id="dist-mu-narrow" d="" fill="none" stroke="#059669" stroke-width="2.8"/>
          <path id="dist-mu-standard" d="" fill="none" stroke="#1e40af" stroke-width="2.8"/>
          <path id="dist-mu-wide" d="" fill="none" stroke="#b45309" stroke-width="2.8"/>
          <!-- Mean ticks -->
          <line x1="200" y1="218" x2="200" y2="228" stroke="#059669" stroke-width="2"/>
          <line x1="380" y1="218" x2="380" y2="228" stroke="#1e40af" stroke-width="2"/>
          <line x1="560" y1="218" x2="560" y2="228" stroke="#b45309" stroke-width="2"/>
          <text x="200" y="245" text-anchor="middle" font-size="12" font-weight="600" fill="#059669">μ=2</text>
          <text x="380" y="245" text-anchor="middle" font-size="12" font-weight="600" fill="#1e40af">μ=5</text>
          <text x="560" y="245" text-anchor="middle" font-size="12" font-weight="600" fill="#b45309">μ=8</text>
          <!-- Legend: на разных уровнях, чтобы не накладывалось -->
          <g font-size="12" font-weight="600">
            <text x="120" y="65" text-anchor="middle" fill="#059669">σ=0.5 — узкий, острый</text>
            <line x1="200" y1="80" x2="200" y2="90" stroke="#059669" stroke-width="1"/>
            <text x="380" y="100" text-anchor="middle" fill="#1e40af">σ=1 — стандартный</text>
            <text x="640" y="135" text-anchor="middle" fill="#b45309">σ=2 — широкий, пологий</text>
          </g>
        </svg>
        <div class="caption">μ сдвигает колокол влево/вправо. σ меняет его ширину: маленькая σ — узкий и высокий пик, большая σ — широкий и пологий. Площадь под каждой кривой одинакова и равна 1.</div>
        <script>
        (function() {
          var U = App.Util;
          // peakY ниже = выше пик. Высоты пропорциональны 1/σ
          // Standard σ=1 → peakY = 130 (высота 90px)
          // σ=0.5 → высота 180px → peakY = 40
          // σ=2 → высота 45px → peakY = 175
          U.setPath(document, 'dist-mu-narrow',   U.normalOutlinePath(200, 220, 40,  60));
          U.setPath(document, 'dist-mu-standard', U.normalOutlinePath(380, 220, 130, 120));
          U.setPath(document, 'dist-mu-wide',     U.normalOutlinePath(560, 220, 175, 240));
        })();
        </script>
      </div>

      <h4>📐 Равномерное (uniform) — $U(a, b)$</h4>
      <p>Все значения на отрезке $[a, b]$ одинаково вероятны. Никаких «любимых» значений нет — это максимум неопределённости на ограниченном отрезке.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#7c3aed">Равномерное распределение U(a, b)</text>
          <line x1="40" y1="140" x2="520" y2="140" stroke="#475569" stroke-width="1.5"/>
          <!-- PDF rectangle -->
          <rect x="140" y="60" width="280" height="80" fill="#a78bfa" fill-opacity="0.35" stroke="#7c3aed" stroke-width="2.5"/>
          <!-- Horizontal line indicating 1/(b-a) -->
          <line x1="140" y1="60" x2="420" y2="60" stroke="#7c3aed" stroke-width="2.5"/>
          <!-- vertical drops -->
          <line x1="140" y1="60" x2="140" y2="140" stroke="#7c3aed" stroke-width="2.5"/>
          <line x1="420" y1="60" x2="420" y2="140" stroke="#7c3aed" stroke-width="2.5"/>
          <text x="140" y="158" text-anchor="middle" font-size="11" fill="#7c3aed" font-weight="600">a</text>
          <text x="420" y="158" text-anchor="middle" font-size="11" fill="#7c3aed" font-weight="600">b</text>
          <text x="280" y="100" text-anchor="middle" font-size="11" fill="#5b21b6">f(x) = 1/(b−a)</text>
          <text x="125" y="55" text-anchor="end" font-size="10" fill="#64748b">1/(b−a)</text>
          <line x1="130" y1="60" x2="138" y2="60" stroke="#64748b"/>
          <text x="30" y="100" font-size="10" fill="#64748b" transform="rotate(-90 30 100)">плотность</text>
          <text x="475" y="158" font-size="10" fill="#64748b">x</text>
        </svg>
        <div class="caption">PDF равномерного — горизонтальная линия на отрезке [a, b]. Вне отрезка плотность равна нулю. Площадь под прямоугольником = 1 (как у любой плотности).</div>
      </div>

      <p><b>Где встречается:</b> базовый источник случайности в компьютерах (rand()), справедливый жребий, углы в изотропных процессах.</p>
      <p><b>Важная роль:</b> из равномерного можно <b>сгенерировать</b> любое другое распределение через <span class="term" data-tip="Inverse Transform Sampling. Если F — функция распределения, то F⁻¹(U), где U ~ Uniform[0,1], даёт случайную величину с распределением F.">метод обратного преобразования</span>.</p>

      <h4>🪙 Биномиальное — $\\text{Bin}(n, p)$</h4>
      <p>Число «успехов» в $n$ независимых испытаниях, где в каждом успех происходит с вероятностью $p$.</p>
      <p><b>Пример:</b> бросаем монету 10 раз — сколько выпадет орлов? Это $\\text{Bin}(10, 0.5)$. Значения могут быть 0, 1, ..., 10.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#0369a1">Биномиальное Bin(10, p) — PMF</text>
          <line x1="40" y1="175" x2="540" y2="175" stroke="#475569" stroke-width="1.5"/>
          <!-- x axis labels 0..10, spacing ~45px starting at 55 -->
          <g font-size="10" fill="#64748b" text-anchor="middle">
            <text x="55" y="192">0</text><text x="100" y="192">1</text><text x="145" y="192">2</text>
            <text x="190" y="192">3</text><text x="235" y="192">4</text><text x="280" y="192">5</text>
            <text x="325" y="192">6</text><text x="370" y="192">7</text><text x="415" y="192">8</text>
            <text x="460" y="192">9</text><text x="505" y="192">10</text>
          </g>
          <text x="280" y="210" text-anchor="middle" font-size="10" fill="#64748b">число успехов k</text>
          <!-- Bars for p=0.5 (symmetric) -->
          <!-- approx values: 0.001, 0.010, 0.044, 0.117, 0.205, 0.246, 0.205, 0.117, 0.044, 0.010, 0.001 -->
          <!-- max 0.246 → 140px tall. scale factor = 570 -->
          <g fill="#0284c7" fill-opacity="0.75" stroke="#0369a1" stroke-width="1">
            <rect x="47" y="174" width="16" height="1"/>
            <rect x="92" y="169" width="16" height="6"/>
            <rect x="137" y="150" width="16" height="25"/>
            <rect x="182" y="108" width="16" height="67"/>
            <rect x="227" y="58" width="16" height="117"/>
            <rect x="272" y="35" width="16" height="140"/>
            <rect x="317" y="58" width="16" height="117"/>
            <rect x="362" y="108" width="16" height="67"/>
            <rect x="407" y="150" width="16" height="25"/>
            <rect x="452" y="169" width="16" height="6"/>
            <rect x="497" y="174" width="16" height="1"/>
          </g>
          <text x="280" y="28" text-anchor="middle" font-size="11" fill="#0369a1" font-weight="600">p = 0.5 — симметрично, пик в np = 5</text>
          <!-- small legend for p=0.3 and p=0.7 as dots -->
          <g font-size="10" fill="#64748b">
            <text x="95" y="45">p=0.3 → смещение влево (np=3)</text>
            <text x="400" y="60">p=0.7 → вправо (np=7)</text>
          </g>
        </svg>
        <div class="caption">PMF биномиального при p=0.5 симметрична и достигает максимума при k = np. При p &lt; 0.5 пик смещается влево, при p &gt; 0.5 — вправо.</div>
      </div>

      <p><b>Параметры интуитивно:</b></p>
      <ul>
        <li>Среднее число успехов: $np$</li>
        <li>Разброс: $np(1-p)$ — максимальный при $p = 0.5$, минимальный при $p$ близком к 0 или 1.</li>
      </ul>
      <p><b>Где встречается:</b> A/B тесты (сколько пользователей кликнули), контроль качества (сколько бракованных), статистика побед/поражений.</p>

      <h4>📞 Пуассоновское — $\\text{Poisson}(\\lambda)$</h4>
      <p>Число редких независимых событий за фиксированный интервал времени или в пространстве. Параметр $\\lambda$ — <b>среднее</b> число событий на интервал.</p>
      <p><b>Пример:</b> в колл-центр приходит в среднем 5 звонков в минуту. Сколько придёт за следующую минуту? Это $\\text{Poisson}(5)$. Может быть 0, 1, 2, 3, ..., но ~8+ уже маловероятно.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#b91c1c">Пуассон: Poisson(λ) — PMF</text>
          <line x1="40" y1="175" x2="540" y2="175" stroke="#475569" stroke-width="1.5"/>
          <g font-size="10" fill="#64748b" text-anchor="middle">
            <text x="55" y="192">0</text><text x="95" y="192">1</text><text x="135" y="192">2</text>
            <text x="175" y="192">3</text><text x="215" y="192">4</text><text x="255" y="192">5</text>
            <text x="295" y="192">6</text><text x="335" y="192">7</text><text x="375" y="192">8</text>
            <text x="415" y="192">9</text><text x="455" y="192">10</text><text x="495" y="192">11</text>
          </g>
          <text x="280" y="210" text-anchor="middle" font-size="10" fill="#64748b">число событий k</text>
          <!-- Poisson(3) bars -->
          <!-- k=0..11: 0.050, 0.149, 0.224, 0.224, 0.168, 0.101, 0.050, 0.022, 0.008, 0.003, 0.001, 0 -->
          <!-- max 0.224 → 140px -->
          <g fill="#dc2626" fill-opacity="0.35" stroke="#b91c1c" stroke-width="1.5">
            <rect x="48" y="144" width="14" height="31"/>
            <rect x="88" y="82" width="14" height="93"/>
            <rect x="128" y="35" width="14" height="140"/>
            <rect x="168" y="35" width="14" height="140"/>
            <rect x="208" y="70" width="14" height="105"/>
            <rect x="248" y="112" width="14" height="63"/>
            <rect x="288" y="144" width="14" height="31"/>
            <rect x="328" y="161" width="14" height="14"/>
            <rect x="368" y="170" width="14" height="5"/>
            <rect x="408" y="173" width="14" height="2"/>
            <rect x="448" y="174" width="14" height="1"/>
          </g>
          <text x="148" y="28" text-anchor="middle" font-size="11" fill="#b91c1c" font-weight="600">λ = 3</text>
          <!-- Poisson(7) bars overlaid -->
          <g fill="#0284c7" fill-opacity="0.25" stroke="#0369a1" stroke-width="1.5">
            <rect x="64" y="174" width="14" height="1"/>
            <rect x="104" y="170" width="14" height="5"/>
            <rect x="144" y="160" width="14" height="15"/>
            <rect x="184" y="138" width="14" height="37"/>
            <rect x="224" y="112" width="14" height="63"/>
            <rect x="264" y="96" width="14" height="79"/>
            <rect x="304" y="82" width="14" height="93"/>
            <rect x="344" y="82" width="14" height="93"/>
            <rect x="384" y="96" width="14" height="79"/>
            <rect x="424" y="117" width="14" height="58"/>
            <rect x="464" y="140" width="14" height="35"/>
            <rect x="504" y="158" width="14" height="17"/>
          </g>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#0369a1" font-weight="600">λ = 7</text>
        </svg>
        <div class="caption">Пуассон становится симметричным с ростом λ. При λ=3 пик на 2-3, хвост правый. При λ=7 уже почти симметрично. При λ&gt;20 приближается к нормальному.</div>
      </div>

      <p><b>Условия применимости:</b></p>
      <ul>
        <li>События происходят независимо друг от друга.</li>
        <li>Вероятность двух событий одновременно стремится к нулю.</li>
        <li>Средняя интенсивность постоянна во времени.</li>
      </ul>
      <p><b>Где встречается:</b> звонки, посетители, опечатки на странице, дефекты на метре ткани, радиоактивные распады, клики на рекламу.</p>

      <h4>⏱ Экспоненциальное — $\\text{Exp}(\\lambda)$</h4>
      <p>Непрерывный «брат» Пуассона. Если события происходят по Пуассону с интенсивностью $\\lambda$, то <b>время между</b> соседними событиями распределено экспоненциально.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#059669" stop-opacity="0.4"/><stop offset="100%" stop-color="#059669" stop-opacity="0.05"/></linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#047857">Экспоненциальное Exp(λ) — PDF</text>
          <line x1="60" y1="220" x2="720" y2="220" stroke="#475569" stroke-width="1.5"/>
          <line x1="60" y1="50" x2="60" y2="220" stroke="#475569" stroke-width="1.5"/>
          <!-- Two curves generated by init -->
          <path id="dist-exp-lam1-area" d="" fill="url(#expGrad)"/>
          <path id="dist-exp-lam1" d="" fill="none" stroke="#059669" stroke-width="2.8"/>
          <path id="dist-exp-lam05" d="" fill="none" stroke="#0284c7" stroke-width="2.8" stroke-dasharray="6,4"/>
          <!-- Legend -->
          <text x="250" y="80" fill="#059669" font-size="13" font-weight="600">λ = 1 (средний интервал = 1)</text>
          <text x="430" y="160" fill="#0369a1" font-size="13" font-weight="600">λ = 0.5 (средний = 2)</text>
          <!-- Axis ticks: 0..6, each unit = 110px starting at x=60 -->
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="60" y="240">0</text>
            <text x="170" y="240">1</text>
            <text x="280" y="240">2</text>
            <text x="390" y="240">3</text>
            <text x="500" y="240">4</text>
            <text x="610" y="240">5</text>
            <text x="720" y="240">6</text>
          </g>
          <text x="380" y="262" text-anchor="middle" font-size="12" fill="#64748b">время</text>
          <text x="40" y="135" font-size="11" fill="#64748b" text-anchor="middle" transform="rotate(-90 40 135)">f(x)</text>
        </svg>
        <div class="caption">PDF экспоненциального — убывающая экспонента. Маленькие интервалы (близкие к 0) самые частые, большие — редкие. Среднее интервала = 1/λ.</div>
        <script>
        (function() {
          var U = App.Util;
          var x0 = 60, baselineY = 220, length = 660;
          // λ=1: peak height = 1, occupies full vertical space (170px) → peakY = 50
          U.setPath(document, 'dist-exp-lam1-area', U.exponentialPath(x0, baselineY, 50, length, 1));
          U.setPath(document, 'dist-exp-lam1', U.exponentialOutline(x0, baselineY, 50, length, 1));
          // λ=0.5: peak height = 0.5 → peakY = 135 (half height)
          U.setPath(document, 'dist-exp-lam05', U.exponentialOutline(x0, baselineY, 135, length, 0.5));
        })();
        </script>
      </div>

      <p><b>Пример:</b> если приходит в среднем 5 клиентов в час ($\\lambda = 5$), то время до следующего клиента распределено экспоненциально со средним $1/\\lambda = 12$ минут.</p>
      <p><b>Особенность — «отсутствие памяти»:</b> если ты ждал автобус 10 минут, твои шансы на ближайшие 5 минут такие же, как в начале. Прошедшее время не влияет.</p>
      <p><b>Где встречается:</b> время ожидания в очереди, время до отказа лампочки, интервалы между запросами к серверу.</p>

      <h3>🔗 Связи между распределениями</h3>
      <p>Распределения не изолированы — они связаны друг с другом:</p>
      <ul>
        <li><b>Биномиальное → Пуассон:</b> при больших $n$ и малых $p$, если $np = \\lambda$ константа, $\\text{Bin}(n, p) \\approx \\text{Poisson}(\\lambda)$. Например, 10 000 посетителей сайта, каждый кликает с вероятностью 0.001 → число кликов ~ Poisson(10).</li>
        <li><b>Биномиальное → Нормальное:</b> при больших $n$, $\\text{Bin}(n, p) \\approx N(np, np(1-p))$. Это аппроксимация де Муавра-Лапласа.</li>
        <li><b>Пуассон → Нормальное:</b> при больших $\\lambda$, $\\text{Poisson}(\\lambda) \\approx N(\\lambda, \\lambda)$.</li>
        <li><b>Сумма экспоненциальных</b> = Гамма-распределение.</li>
        <li><b>Сумма квадратов стандартных нормальных</b> = $\\chi^2$-распределение.</li>
      </ul>

      <div class="callout tip">💡 Все эти связи следуют из <b>ЦПТ</b> — когда мы суммируем много случайных величин, результат стремится к нормальному. Поэтому нормальное так часто встречается.</div>

      <h3>🔬 Как определить распределение данных</h3>
      <ul>
        <li><a onclick="App.selectTopic('viz-histogram')"><b>Гистограмма</b></a> — первый и главный инструмент. Видишь форму — сразу есть гипотеза.</li>
        <li><a onclick="App.selectTopic('viz-qq-plot')"><b>Q-Q plot</b></a> — если точки на прямой, распределение близко к теоретическому.</li>
        <li><b>Тесты согласия:</b> Шапиро-Уилка, Колмогорова-Смирнова — формально проверяют соответствие.</li>
        <li><b>Descriptive stats:</b> сравни среднее и медиану. Если заметно отличаются — есть скос.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Все данные распределены нормально»</b> — нет. Доходы, цены, время ожидания обычно скошены.</li>
        <li><b>«Если n большое, данные нормальные»</b> — нет. Это не про сами данные, а про <b>среднее</b> выборки (ЦПТ).</li>
        <li><b>«Нормальное распределение на [0, ∞)»</b> — нет, оно всегда определено на всей числовой прямой.</li>
        <li><b>«Из нормального нельзя получить отрицательное число»</b> — можно, и это нужно учитывать (например, при моделировании роста нельзя использовать нормальное, если $\\mu - 3\\sigma < 0$).</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: многомерные распределения</summary>
        <div class="deep-dive-body">
          <p>До сих пор мы говорили о распределении одной величины. Но часто у нас сразу несколько: рост + вес, цена + площадь. Это <b>многомерные</b> распределения.</p>
          <p><b>Многомерное нормальное</b> $N(\\mu, \\Sigma)$ задаётся вектором средних $\\mu$ и <span class="term" data-tip="Covariance matrix. Матрица, где на диагонали — дисперсии каждой переменной, вне диагонали — ковариации между парами.">ковариационной матрицей</span> $\\Sigma$. Контуры равной плотности — эллипсы.</p>
          <p>Это основа многих методов: байесовской регрессии, гауссовых процессов, GMM (гауссовых смесей), PCA.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: тяжёлые хвосты и степенные распределения</summary>
        <div class="deep-dive-body">
          <p>Некоторые реальные данные имеют «тяжёлые хвосты» — экстремальные значения встречаются чаще, чем предсказывает нормальное:</p>
          <ul>
            <li><b>Log-normal</b> — логарифм распределён нормально. Доходы, цены акций, размеры файлов.</li>
            <li><b>Парето (power law)</b> — «правило 80/20». Распределение богатства, размеры городов, популярность сайтов.</li>
            <li><b>Коши (Cauchy)</b> — без среднего и дисперсии. Физика, некоторые финансовые ряды.</li>
          </ul>
          <p><b>Важно:</b> для таких данных среднее может быть бесконечным, а обычные методы не работают. Используй медиану и робастные методы.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>ЦПТ</b> объясняет, почему нормальное везде появляется.</li>
        <li><b>Проверка гипотез</b> — все тесты опираются на какое-то распределение статистики.</li>
        <li><b>Байесовские модели</b> — используют распределения для апостериорных.</li>
        <li><b>ML</b> — многие модели предполагают нормальность признаков или остатков.</li>
        <li><b>Семплирование</b> — в Monte Carlo симуляциях выбор распределения критичен.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Нормальное: правило 3 сигм',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Рост взрослых мужчин в России распределён примерно нормально: μ = 176 см, σ = 7 см. Какой процент мужчин имеет рост от 169 до 183 см? А какой рост «экстремально» высокий?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Записываем параметры</h4>
            <div class="calc">X ~ N(μ = 176, σ = 7)
Вопрос: P(169 ≤ X ≤ 183) = ?</div>
          </div>

          <div class="step" data-step="2">
            <h4>Замечаем: 169 = 176 − 7, а 183 = 176 + 7</h4>
            <p>То есть мы спрашиваем: P(μ − σ ≤ X ≤ μ + σ) = ?</p>
            <p>Это ровно <b>один сигма</b> в каждую сторону от среднего.</p>
            <div class="why">Правило 68-95-99.7 (правило трёх сигм) говорит: для нормального распределения ~68% значений лежат в пределах ±1σ, ~95% — в ±2σ, ~99.7% — в ±3σ.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Применяем правило</h4>
            <div class="calc">P(169 ≤ X ≤ 183) = P(μ−σ ≤ X ≤ μ+σ) ≈ <b>68%</b></div>
            <p>Примерно 68% мужчин имеют рост от 169 до 183 см.</p>
          </div>

          <div class="step" data-step="4">
            <h4>Рассчитаем «экстремальные» диапазоны</h4>
            <div class="calc">±1σ: 169 – 183 см → 68% мужчин
±2σ: 162 – 190 см → 95% мужчин
±3σ: 155 – 197 см → 99.7% мужчин</div>
            <p>Мужчина ростом 197+ см — это за пределами 3 сигм. Менее 0.15% населения.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>~<b>68%</b> мужчин имеют рост 169–183 см. Рост выше <b>197 см</b> (~3σ) — экстремально редкий (<0.15%).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 165" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <defs>
                <linearGradient id="band1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.55"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1"/>
                </linearGradient>
                <linearGradient id="band2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.08"/>
                </linearGradient>
                <linearGradient id="band3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.06"/>
                </linearGradient>
              </defs>
              <text x="240" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Правило трёх сигм N(176, 7²)</text>
              <!-- axis -->
              <line x1="30" y1="130" x2="450" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- μ=176 → x=240, σ=7 → 60px; ±3σ covers x=60..420 -->
              <!-- 99.7% band: −3σ→180−3*60=x=−0=60 to +3σ→420 -->
              <path d="M60,130 L60,128 C80,120 100,105 120,87 C140,68 160,50 180,37 C200,26 220,20 240,19 C260,20 280,26 300,37 C320,50 340,68 360,87 C380,105 400,120 420,128 L420,130 Z" fill="url(#band3)"/>
              <!-- 95% band: −2σ→120 to +2σ→360 -->
              <path d="M120,130 L120,87 C140,68 160,50 180,37 C200,26 220,20 240,19 C260,20 280,26 300,37 C320,50 340,68 360,87 L360,130 Z" fill="url(#band2)"/>
              <!-- 68% band: −1σ→180 to +1σ→300 -->
              <path d="M180,130 L180,37 C200,26 220,20 240,19 C260,20 280,26 300,37 L300,130 Z" fill="url(#band1)"/>
              <!-- bell outline -->
              <path d="M30,130 C50,130 65,128 80,122 C100,113 120,95 140,75 C160,54 175,38 185,30 C200,21 220,17 240,16 C260,17 280,21 295,30 C305,38 320,54 340,75 C360,95 380,113 400,122 C415,128 430,130 450,130" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- sigma lines -->
              <line x1="180" y1="37" x2="180" y2="130" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
              <line x1="300" y1="37" x2="300" y2="130" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
              <line x1="120" y1="87" x2="120" y2="130" stroke="#10b981" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
              <line x1="360" y1="87" x2="360" y2="130" stroke="#10b981" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
              <line x1="60"  y1="128" x2="60"  y2="130" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>
              <line x1="420" y1="128" x2="420" y2="130" stroke="#f59e0b" stroke-width="1" opacity="0.6"/>
              <!-- labels -->
              <text x="240" y="145" text-anchor="middle" font-size="10" fill="#64748b">μ=176</text>
              <text x="180" y="145" text-anchor="middle" font-size="9" fill="#3b82f6">−1σ</text>
              <text x="300" y="145" text-anchor="middle" font-size="9" fill="#3b82f6">+1σ</text>
              <text x="120" y="145" text-anchor="middle" font-size="9" fill="#10b981">−2σ</text>
              <text x="360" y="145" text-anchor="middle" font-size="9" fill="#10b981">+2σ</text>
              <text x="60"  y="145" text-anchor="middle" font-size="9" fill="#f59e0b">−3σ</text>
              <text x="420" y="145" text-anchor="middle" font-size="9" fill="#f59e0b">+3σ</text>
              <!-- band labels -->
              <text x="240" y="85" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">68%</text>
              <text x="155" y="110" text-anchor="middle" font-size="10" fill="#059669">95%</text>
              <text x="85"  y="125" text-anchor="middle" font-size="10" fill="#b45309">99.7%</text>
            </svg>
            <div class="caption">Три «полосы» нормального распределения N(176, 7²). Синяя зона (±1σ, 169–183 см) — 68% мужчин. Зелёная (±2σ) — 95%. Янтарная (±3σ) — 99.7%.</div>
          </div>

          <div class="lesson-box">Правило 68-95-99.7 позволяет быстро оценивать вероятности без калькулятора. Работает только для нормального распределения.</div>
        `
      },
      {
        title: 'Биномиальное: A/B тест кнопки',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показали новую кнопку «Купить» 20 пользователям. Известно, что обычная конверсия (вероятность клика) p = 0.3. Какова вероятность, что ровно 8 из 20 кликнут? А что 10 или больше?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Определяем параметры</h4>
            <div class="calc">n = 20 (пользователей)
p = 0.3 (вероятность клика)
X ~ Bin(20, 0.3)

Вопрос 1: P(X = 8) = ?
Вопрос 2: P(X ≥ 10) = ?</div>
            <div class="why">Это биномиальное, потому что: n фиксировано (20), каждый пользователь независим, вероятность клика p одинакова для всех, исход — «кликнул/не кликнул» (бинарный).</div>
          </div>

          <div class="step" data-step="2">
            <h4>Формула биномиальной вероятности</h4>
            <div class="math-block">$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$</div>
            <p>Где $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$ — число способов выбрать k элементов из n.</p>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем P(X = 8)</h4>
            <div class="calc">C(20, 8) = 20! / (8! · 12!) = 125970

P(X=8) = 125970 · 0.3⁸ · 0.7¹²
       = 125970 · 0.00006561 · 0.01384
       = 125970 · 0.000000908
       ≈ <b>0.114</b> (11.4%)</div>
            <div class="why">Каждый конкретный паттерн «8 кликов и 12 не-кликов» имеет вероятность $0.3^8 \\cdot 0.7^{12}$ — крошечную. Но таких паттернов $C(20,8)$ = 125970 штук (разные наборы из 8 пользователей). Их общая вероятность набирается до ~11%.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Проверка через среднее и std</h4>
            <div class="calc">E[X] = n·p = 20 · 0.3 = 6  (ожидаем 6 кликов)
Var(X) = n·p·(1-p) = 20 · 0.3 · 0.7 = 4.2
std = √4.2 ≈ 2.05</div>
            <p>8 кликов = 6 + 2 ≈ μ + 1σ. Это заметно выше среднего, но не экстремально.</p>
          </div>

          <div class="step" data-step="5">
            <h4>P(X ≥ 10): сумма хвоста</h4>
            <p>P(X ≥ 10) = P(X=10) + P(X=11) + ... + P(X=20). Считаем или смотрим в таблицу:</p>
            <div class="calc">P(X ≥ 10) ≈ 0.048 ≈ <b>4.8%</b></div>
            <p>10 кликов из 20 при p=0.3 — довольно редкое событие. Это может быть повод подумать, что новая кнопка правда лучше.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>P(ровно 8 кликов) ≈ <b>11.4%</b>. P(10+ кликов) ≈ <b>4.8%</b> — значимо на уровне 5%.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 480 165" xmlns="http://www.w3.org/2000/svg" style="max-width:480px;">
              <text x="240" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">PMF: Bin(20, 0.3) — подсвечен k=8</text>
              <!-- axes -->
              <line x1="30" y1="135" x2="460" y2="135" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="30" y1="135" x2="30" y2="20" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Bin(20,0.3) PMF approximate values for k=0..12 (max prob ~0.192 at k=6) -->
              <!-- heights scaled so max bar height = 100px, P(k=6)≈0.192 → 100px scale=521 -->
              <!-- k: 0→P≈0.001, 1→0.007, 2→0.028, 3→0.072, 4→0.130, 5→0.179, 6→0.192, 7→0.164, 8→0.114, 9→0.065, 10→0.031, 11→0.012, 12→0.004 -->
              <!-- bar x positions: x=40+k*35, width=22 -->
              <rect x="40"  y="134" width="22" height="1"   fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=0 -->
              <rect x="75"  y="131" width="22" height="4"   fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=1 -->
              <rect x="110" y="120" width="22" height="15"  fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=2 -->
              <rect x="145" y="98"  width="22" height="37"  fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=3 -->
              <rect x="180" y="68"  width="22" height="67"  fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=4 -->
              <rect x="215" y="42"  width="22" height="93"  fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=5 -->
              <rect x="250" y="35"  width="22" height="100" fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=6 -->
              <rect x="285" y="50"  width="22" height="85"  fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=7 -->
              <!-- k=8 highlighted -->
              <rect x="320" y="76"  width="22" height="59"  fill="#ef4444" opacity="0.85" rx="2"/> <!-- k=8 highlighted -->
              <rect x="355" y="101" width="22" height="34"  fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=9 -->
              <rect x="390" y="119" width="22" height="16"  fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=10 -->
              <rect x="425" y="129" width="22" height="6"   fill="#3b82f6" opacity="0.7" rx="2"/> <!-- k=11 -->
              <!-- x labels -->
              <text x="51"  y="150" text-anchor="middle" font-size="9" fill="#334155">0</text>
              <text x="86"  y="150" text-anchor="middle" font-size="9" fill="#334155">1</text>
              <text x="121" y="150" text-anchor="middle" font-size="9" fill="#334155">2</text>
              <text x="156" y="150" text-anchor="middle" font-size="9" fill="#334155">3</text>
              <text x="191" y="150" text-anchor="middle" font-size="9" fill="#334155">4</text>
              <text x="226" y="150" text-anchor="middle" font-size="9" fill="#334155">5</text>
              <text x="261" y="150" text-anchor="middle" font-size="9" fill="#334155">6</text>
              <text x="296" y="150" text-anchor="middle" font-size="9" fill="#334155">7</text>
              <text x="331" y="150" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="600">8</text>
              <text x="366" y="150" text-anchor="middle" font-size="9" fill="#334155">9</text>
              <text x="401" y="150" text-anchor="middle" font-size="9" fill="#334155">10</text>
              <text x="436" y="150" text-anchor="middle" font-size="9" fill="#334155">11</text>
              <!-- annotation -->
              <line x1="331" y1="74" x2="360" y2="55" stroke="#ef4444" stroke-width="1"/>
              <text x="365" y="50" font-size="10" fill="#ef4444" font-weight="600">P(8) ≈ 11.4%</text>
              <!-- mean line -->
              <line x1="261" y1="30" x2="261" y2="135" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,2"/>
              <text x="261" y="25" text-anchor="middle" font-size="9" fill="#64748b">μ=6</text>
            </svg>
            <div class="caption">PMF биномиального Bin(20, p=0.3). Наиболее вероятны k=6 (μ=np=6). Столбик k=8 выделен красным — P(X=8) ≈ 11.4%, примерно на 1σ правее среднего.</div>
          </div>

          <div class="lesson-box">Биномиальное распределение считает «число успехов из n попыток». Его среднее = np, разброс = np(1-p). Полезно для A/B тестов, конверсий, контроля качества.</div>
        `
      },
      {
        title: 'Пуассон: звонки в колл-центр',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>В колл-центр поступает в среднем 3 звонка за 10 минут (λ = 3). Какова вероятность, что за 10 минут не будет ни одного звонка? А что будет 5 или больше?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Записываем параметры</h4>
            <div class="calc">X ~ Poisson(λ = 3)
Вопрос 1: P(X = 0) = ?
Вопрос 2: P(X ≥ 5) = ?</div>
            <div class="why">Пуассон подходит, потому что: события (звонки) происходят независимо друг от друга, интенсивность постоянна (3 за 10 минут), два звонка одновременно невозможны. Это «классический» пуассоновский поток.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Формула Пуассона</h4>
            <div class="math-block">$$P(X = k) = \\frac{\\lambda^k \\cdot e^{-\\lambda}}{k!}$$</div>
            <p>Где $e \\approx 2.718$ (число Эйлера), $k!$ = факториал ($k! = k \\cdot (k-1) \\cdot \\ldots \\cdot 1$).</p>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем P(X = 0)</h4>
            <div class="calc">P(X = 0) = 3⁰ · e⁻³ / 0!
           = 1 · 0.0498 / 1
           = <b>0.0498</b> ≈ 5%</div>
            <p>Вероятность «ни одного звонка за 10 минут» — около 5%. Случается, но нечасто.</p>
          </div>

          <div class="step" data-step="4">
            <h4>Считаем P(X = 1), P(X = 2), ..., чтобы найти хвост</h4>
            <div class="calc">P(X=0) = e⁻³ · 3⁰/0! = 0.0498
P(X=1) = e⁻³ · 3¹/1! = 0.1494
P(X=2) = e⁻³ · 3²/2! = 0.2240
P(X=3) = e⁻³ · 3³/3! = 0.2240
P(X=4) = e⁻³ · 3⁴/4! = 0.1680

Сумма P(0..4) = 0.0498 + 0.1494 + 0.2240 + 0.2240 + 0.1680 = 0.8153</div>
            <div class="why">Считаем «кусок за куском», потому что для Пуассона нет простой формулы хвоста. Но есть трюк: P(X ≥ 5) = 1 − P(X ≤ 4).</div>
          </div>

          <div class="step" data-step="5">
            <h4>Находим P(X ≥ 5)</h4>
            <div class="calc">P(X ≥ 5) = 1 − P(X ≤ 4) = 1 − 0.8153 = <b>0.1847</b> ≈ 18.5%</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>P(ни одного звонка) ≈ <b>5%</b>. P(5+ звонков) ≈ <b>18.5%</b>. Самые вероятные исходы: 2 или 3 звонка (по ~22% каждый).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 420 165" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">PMF: Poisson(λ=3)</text>
              <!-- axes -->
              <line x1="30" y1="135" x2="400" y2="135" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="30" y1="135" x2="30" y2="20" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Poisson(3) PMF: k=0..9 -->
              <!-- P(0)=0.0498, P(1)=0.1494, P(2)=0.2240, P(3)=0.2240, P(4)=0.1680, P(5)=0.1008, P(6)=0.0504, P(7)=0.0216, P(8)=0.0081, P(9)=0.0027 -->
              <!-- scale: P(2)=P(3)=0.224 → 100px bar height. scale=446 -->
              <!-- x positions: x=45+k*36, bar width=24 -->
              <rect x="45"  y="113" width="24" height="22"  fill="#10b981" opacity="0.75" rx="2"/> <!-- k=0: 0.0498*446=22 -->
              <rect x="81"  y="68"  width="24" height="67"  fill="#10b981" opacity="0.75" rx="2"/> <!-- k=1: 0.1494*446=67 -->
              <rect x="117" y="35"  width="24" height="100" fill="#10b981" opacity="0.75" rx="2"/> <!-- k=2: 0.2240*446=100 -->
              <rect x="153" y="35"  width="24" height="100" fill="#10b981" opacity="0.75" rx="2"/> <!-- k=3: 0.2240*446=100 -->
              <rect x="189" y="60"  width="24" height="75"  fill="#10b981" opacity="0.75" rx="2"/> <!-- k=4: 0.1680*446=75 -->
              <rect x="225" y="90"  width="24" height="45"  fill="#10b981" opacity="0.75" rx="2"/> <!-- k=5: 0.1008*446=45 -->
              <rect x="261" y="113" width="24" height="22"  fill="#10b981" opacity="0.75" rx="2"/> <!-- k=6: 0.0504*446=22 -->
              <rect x="297" y="125" width="24" height="10"  fill="#10b981" opacity="0.75" rx="2"/> <!-- k=7 -->
              <rect x="333" y="131" width="24" height="4"   fill="#10b981" opacity="0.75" rx="2"/> <!-- k=8 -->
              <rect x="369" y="133" width="24" height="2"   fill="#10b981" opacity="0.75" rx="2"/> <!-- k=9 -->
              <!-- x labels -->
              <text x="57"  y="150" text-anchor="middle" font-size="10" fill="#334155">0</text>
              <text x="93"  y="150" text-anchor="middle" font-size="10" fill="#334155">1</text>
              <text x="129" y="150" text-anchor="middle" font-size="10" fill="#334155">2</text>
              <text x="165" y="150" text-anchor="middle" font-size="10" fill="#334155">3</text>
              <text x="201" y="150" text-anchor="middle" font-size="10" fill="#334155">4</text>
              <text x="237" y="150" text-anchor="middle" font-size="10" fill="#334155">5</text>
              <text x="273" y="150" text-anchor="middle" font-size="10" fill="#334155">6</text>
              <text x="309" y="150" text-anchor="middle" font-size="10" fill="#334155">7</text>
              <text x="345" y="150" text-anchor="middle" font-size="10" fill="#334155">8</text>
              <text x="381" y="150" text-anchor="middle" font-size="10" fill="#334155">9</text>
              <!-- λ=μ line -->
              <line x1="165" y1="30" x2="165" y2="135" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,2"/>
              <text x="155" y="25" text-anchor="middle" font-size="9" fill="#64748b">λ=μ=3</text>
              <!-- y axis label -->
              <text x="18" y="85" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,18,85)">P(X=k)</text>
            </svg>
            <div class="caption">PMF распределения Пуассона с λ=3. Наиболее вероятны k=2 и k=3 (оба ~22.4%). P(X=0) ≈ 5% — «ни одного звонка» маловероятно, но возможно.</div>
          </div>

          <div class="lesson-box">Пуассон описывает «число редких событий за интервал». Его среднее и дисперсия оба равны λ. Чем больше λ, тем больше похож на нормальное.</div>
        `
      },
      {
        title: 'Экспоненциальное: время ожидания',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Автобус приходит в среднем раз в 15 минут (λ = 4 автобуса/час). Ты пришёл на остановку. Какова вероятность, что ждать придётся больше 20 минут? А больше 30?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Определяем параметры</h4>
            <div class="calc">λ = 4 автобуса/час (= 1 автобус каждые 15 мин)
Среднее время ожидания = 1/λ = 0.25 часа = 15 минут
T ~ Exp(λ = 4), в часах</div>
            <div class="why">Если автобусы приходят по пуассоновскому потоку (случайно, независимо), то время между приходами — экспоненциальное.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Формула «вероятности не дождаться»</h4>
            <div class="math-block">$$P(T > t) = e^{-\\lambda t}$$</div>
            <p>Это <b>функция выживания</b> — вероятность, что событие ещё не произошло к моменту t.</p>
          </div>

          <div class="step" data-step="3">
            <h4>P(ждать > 20 минут)</h4>
            <p>20 минут = 20/60 = 1/3 часа:</p>
            <div class="calc">P(T > 1/3) = e^(−4 · 1/3) = e^(−1.333) ≈ <b>0.264</b> ≈ 26.4%</div>
          </div>

          <div class="step" data-step="4">
            <h4>P(ждать > 30 минут)</h4>
            <div class="calc">P(T > 1/2) = e^(−4 · 0.5) = e^(−2) ≈ <b>0.135</b> ≈ 13.5%</div>
          </div>

          <div class="step" data-step="5">
            <h4>Свойство «отсутствия памяти»</h4>
            <p>Допустим, ты уже ждёшь 10 минут. Какова вероятность ждать ещё 20?</p>
            <div class="calc">P(T > 30 | T > 10) = P(T > 20) = e^(−4·1/3) ≈ 0.264</div>
            <p><b>Та же самая</b>, что и для нового ожидания! Это «отсутствие памяти»: сколько бы ты ни ждал, вероятность ждать ещё X минут — такая же.</p>
            <div class="why">Математически: $P(T > s+t \\mid T > s) = P(T > t)$. Экспоненциальное — единственное непрерывное распределение с этим свойством. Это следствие «пуассоновости» потока: каждый момент как начало заново.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>P(ждать > 20 мин) ≈ <b>26%</b>. P(ждать > 30 мин) ≈ <b>14%</b>. Прошлое ожидание не влияет на будущее (memoryless property).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <linearGradient id="tailFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#ef4444" stop-opacity="0.08"/>
                </linearGradient>
              </defs>
              <text x="230" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Exp(λ=4): P(T &gt; 20 мин) ≈ 26%</text>
              <!-- axes -->
              <line x1="40" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <line x1="40" y1="130" x2="40" y2="20" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Exp PDF: f(t) = λ·e^(-λt), in minutes λ=1/15 per min -->
              <!-- map t(min) 0..60 to x=40..430, so scale=(430-40)/60=6.5px/min -->
              <!-- f(0)=1/15≈0.0667, peak at x=40, y scaled: f(0)*scale_y + 130 = 20 → scale_y=(110)/0.0667=1649 -->
              <!-- curve: decreasing from (40,20) to (430,~130) -->
              <!-- shaded tail area from t=20min → x=40+20*6.5=170 to end -->
              <path d="M170,130 L170,64 C185,72 205,84 230,96 C260,110 300,120 350,126 C380,128 410,129 430,130 Z" fill="url(#tailFill)"/>
              <!-- main curve -->
              <path d="M40,20 C50,28 60,38 75,50 C95,66 120,82 150,96 C180,108 210,117 240,122 C280,127 330,129 430,130" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- vertical line at t=20 min → x=170 -->
              <line x1="170" y1="64" x2="170" y2="130" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,3"/>
              <text x="170" y="145" text-anchor="middle" font-size="10" font-weight="600" fill="#ef4444">20 мин</text>
              <!-- mean line at t=15 min → x=40+15*6.5=137.5 -->
              <line x1="137" y1="76" x2="137" y2="130" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,2"/>
              <text x="137" y="145" text-anchor="middle" font-size="10" fill="#64748b">μ=15</text>
              <!-- tail annotation -->
              <text x="310" y="108" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">26%</text>
              <text x="310" y="122" text-anchor="middle" font-size="9" fill="#dc2626">P(T&gt;20мин)</text>
              <!-- y axis -->
              <text x="34" y="23" text-anchor="end" font-size="9" fill="#64748b">f(0)</text>
              <text x="34" y="133" text-anchor="end" font-size="9" fill="#64748b">0</text>
              <!-- x axis labels -->
              <text x="40"  y="145" text-anchor="middle" font-size="9" fill="#64748b">0</text>
              <text x="235" y="145" text-anchor="middle" font-size="9" fill="#64748b">30</text>
              <text x="430" y="145" text-anchor="middle" font-size="9" fill="#64748b">60 мин</text>
            </svg>
            <div class="caption">PDF экспоненциального распределения (λ=4/час = 1 автобус/15 мин). Красная зона — вероятность ждать дольше 20 минут: P(T&gt;20) ≈ 26%. Кривая резко убывает, большинство ожиданий коротких.</div>
          </div>

          <div class="lesson-box">Экспоненциальное — «партнёр» Пуассона. Если число событий ~ Poisson(λ), то время между событиями ~ Exp(λ). Среднее время = 1/λ.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция распределений</h3>
        <p>Выбери тип распределения и параметры — увидь форму.</p>
        <div class="sim-container">
          <div class="sim-controls" id="dist-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="dist-regen">🔄 Перегенерировать</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="dist-chart"></canvas></div>
            <div class="sim-stats" id="dist-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#dist-controls');
        const cType = App.makeControl('select', 'dist-type', 'Распределение', {
          options: [
            { value: 'normal', label: 'Нормальное' },
            { value: 'uniform', label: 'Равномерное' },
            { value: 'binomial', label: 'Биномиальное' },
            { value: 'poisson', label: 'Пуассона' },
            { value: 'exp', label: 'Экспоненциальное' },
          ],
          value: 'normal',
        });
        const cN = App.makeControl('range', 'dist-n', 'Размер выборки', { min: 100, max: 5000, step: 100, value: 1000 });
        const cP1 = App.makeControl('range', 'dist-p1', 'Параметр 1', { min: -20, max: 50, step: 1, value: 0 });
        const cP2 = App.makeControl('range', 'dist-p2', 'Параметр 2', { min: 1, max: 50, step: 1, value: 1 });
        [cType, cN, cP1, cP2].forEach((c) => controls.appendChild(c.wrap));

        const paramLabels = {
          normal: ['μ (среднее)', 'σ (ст.откл.)', { p1: { min: -20, max: 50, step: 0.5, value: 0 }, p2: { min: 0.5, max: 20, step: 0.5, value: 1 } }],
          uniform: ['a (мин)', 'b (макс)', { p1: { min: -20, max: 20, step: 1, value: 0 }, p2: { min: 1, max: 50, step: 1, value: 10 } }],
          binomial: ['n испытаний', 'p успеха', { p1: { min: 1, max: 100, step: 1, value: 20 }, p2: { min: 0.05, max: 0.95, step: 0.05, value: 0.5 } }],
          poisson: ['λ', '—', { p1: { min: 0.5, max: 30, step: 0.5, value: 5 }, p2: { min: 0, max: 0, step: 0, value: 0 } }],
          exp: ['λ (интенсивность)', '—', { p1: { min: 0.1, max: 10, step: 0.1, value: 1 }, p2: { min: 0, max: 0, step: 0, value: 0 } }],
        };

        let chart = null;

        function updateLabels() {
          const type = cType.input.value;
          const [l1, l2, ranges] = paramLabels[type];
          cP1.wrap.querySelector('label span:first-child').textContent = l1;
          cP2.wrap.querySelector('label span:first-child').textContent = l2;
          // обновим диапазоны
          cP1.input.min = ranges.p1.min; cP1.input.max = ranges.p1.max; cP1.input.step = ranges.p1.step; cP1.input.value = ranges.p1.value;
          cP2.input.min = ranges.p2.min; cP2.input.max = ranges.p2.max; cP2.input.step = ranges.p2.step; cP2.input.value = ranges.p2.value;
          cP1.wrap.querySelector('.value-display').textContent = cP1.input.value;
          cP2.wrap.querySelector('.value-display').textContent = cP2.input.value;
          cP2.wrap.style.opacity = (l2 === '—') ? 0.4 : 1;
          cP2.input.disabled = (l2 === '—');
        }

        function run() {
          const type = cType.input.value;
          const n = +cN.input.value;
          const p1 = +cP1.input.value;
          const p2 = +cP2.input.value;

          let data;
          if (type === 'normal') data = App.Util.normalSample(n, p1, p2);
          else if (type === 'uniform') data = App.Util.uniformSample(n, p1, p2);
          else if (type === 'binomial') data = App.Util.binomialSample(n, Math.round(p1), p2);
          else if (type === 'poisson') data = App.Util.poissonSample(n, p1);
          else data = App.Util.expSample(n, p1);

          const isDiscrete = type === 'binomial' || type === 'poisson';
          // Фиксированный range <a class="glossary-link" onclick="App.selectTopic('viz-histogram')">гистограммы</a> по типу распределения
          const fixedRange = {
            normal: [-30, 60],
            uniform: [-25, 55],
            binomial: [0, Math.round(p1) + 1],
            poisson: [0, 40],
            exp: [0, 15],
          }[type];
          const bins = isDiscrete ? Math.min(50, fixedRange[1] - fixedRange[0] + 1) : 50;
          const hist = App.Util.histogram(data, bins, fixedRange);

          const ctx = container.querySelector('#dist-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: hist.centers.map((c) => App.Util.round(c, 1)),
              datasets: [{
                label: 'Частота',
                data: hist.counts,
                backgroundColor: 'rgba(99, 102, 241, 0.55)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { title: { display: true, text: 'Значение' }, ticks: { maxTicksLimit: 15 } },
                y: { title: { display: true, text: 'Частота' }, min: 0, max: Math.round(n * 0.35), beginAtZero: true },
              },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#dist-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['Выборочное среднее', App.Util.round(App.Util.mean(data), 3)],
            ['Выборочный std', App.Util.round(App.Util.std(data), 3)],
            ['Медиана', App.Util.round(App.Util.median(data), 3)],
            ['Min', App.Util.round(App.Util.min(data), 3)],
            ['Max', App.Util.round(App.Util.max(data), 3)],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        cType.input.addEventListener('change', () => { updateLabels(); run(); });
        [cN, cP1, cP2].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#dist-regen').onclick = run;
        updateLabels();
        run();
      },
    },

    python: `
      <h3>📊 Распределения в scipy.stats</h3>
      <pre><code>import numpy as np
from scipy import stats

# Нормальное распределение N(μ=170, σ=10)
norm = stats.norm(loc=170, scale=10)
print(f"PDF(170): {norm.pdf(170):.4f}")   # плотность в точке
print(f"CDF(180): {norm.cdf(180):.4f}")   # P(X ≤ 180)
print(f"PPF(0.95): {norm.ppf(0.95):.1f}") # квантиль 95%
sample = norm.rvs(size=1000)               # генерация выборки

# Биномиальное B(n=100, p=0.3)
binom = stats.binom(n=100, p=0.3)
print(f"P(X=30): {binom.pmf(30):.4f}")
print(f"P(X≤25): {binom.cdf(25):.4f}")

# Пуассоновское Pois(λ=5)
poisson = stats.poisson(mu=5)
print(f"P(X=3): {poisson.pmf(3):.4f}")</code></pre>

      <h3>📈 Визуализация распределений</h3>
      <pre><code>import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

fig, axes = plt.subplots(1, 3, figsize=(14, 4))

# Нормальное
x = np.linspace(140, 200, 200)
axes[0].plot(x, stats.norm(170, 10).pdf(x))
axes[0].set_title("Нормальное N(170, 10)")

# Биномиальное
k = np.arange(0, 50)
axes[1].bar(k, stats.binom(100, 0.3).pmf(k), width=0.8)
axes[1].set_title("Биномиальное B(100, 0.3)")

# Экспоненциальное
x2 = np.linspace(0, 5, 200)
axes[2].plot(x2, stats.expon(scale=1).pdf(x2))
axes[2].set_title("Экспоненциальное Exp(λ=1)")

plt.tight_layout()
plt.show()</code></pre>

      <h3>🔍 Проверка нормальности</h3>
      <pre><code>from scipy import stats

data = np.random.normal(100, 15, size=200)

# Тест Шапиро-Уилка
stat, p = stats.shapiro(data)
print(f"Shapiro-Wilk: stat={stat:.4f}, p={p:.4f}")
print("Нормальное" if p > 0.05 else "Не нормальное")</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Нормальное</b> — статистические тесты, <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">доверительные интервалы</a>, байесовские модели, шум в сигналах.</li>
        <li><b>Биномиальное</b> — A/B тесты, конверсии, click-through rate.</li>
        <li><b>Пуассоновское</b> — моделирование потоков событий: трафика, поломок, заявок.</li>
        <li><b>Экспоненциальное</b> — время жизни, время ожидания, теория массового обслуживания.</li>
        <li><b>Log-normal</b> — доходы, цены акций, размеры файлов.</li>
        <li><b>Power law / Парето</b> — «правило 80/20», распределение богатства, размеры городов.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Зачем знать распределения</h4>
          <ul>
            <li>Правильный выбор статистического теста</li>
            <li>Моделирование реальных процессов</li>
            <li>Генерация синтетических данных</li>
            <li>Понимание предположений ML-моделей</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Типичные ошибки</h4>
          <ul>
            <li>Предположение нормальности без проверки</li>
            <li>Применение среднего к сильно скошенным данным</li>
            <li>Игнорирование тяжёлых хвостов</li>
            <li>Путаница биномиального и гипергеометрического</li>
          </ul>
        </div>
      </div>
    `,

    extra: `
      <h3>Как проверить, что данные нормальны?</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-qq-plot')">Q-Q plot</a></b> — если точки на прямой, распределение близко к нормальному.</li>
        <li><b>Тест Шапиро-Уилка</b> — формальный тест нормальности.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('viz-histogram')">Гистограмма</a> и оценка плотности (KDE)</b> — визуальная проверка.</li>
      </ul>

      <h3>Что делать с ненормальными данными</h3>
      <ul>
        <li><b>Log-преобразование</b> — часто помогает с правым скосом (доходы, цены).</li>
        <li><b>Box-Cox</b> — семейство степенных преобразований.</li>
        <li><b>Непараметрические методы</b> — не требуют предположений о форме распределения.</li>
      </ul>

      <h3>Связи между распределениями</h3>
      <ul>
        <li>Сумма экспоненциальных → Гамма-распределение</li>
        <li>Сумма квадратов стандартных нормальных → χ²-распределение</li>
        <li>Биномиальное при n→∞, p→0, np=const → Пуассон</li>
        <li>Пуассон при λ→∞ → Нормальное N(λ, λ)</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=rzFX5NWojp0" target="_blank">StatQuest: Normal Distribution, Clearly Explained</a> — нормальное распределение: интуиция и формулы</li>
        <li><a href="https://www.youtube.com/watch?v=Fvi9A_tEmXQ" target="_blank">Probability density functions (Khan Academy)</a> — распределение Пуассона с примерами</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/random-variables-stats-library" target="_blank">Khan Academy: Random variables and probability distributions</a> — курс по случайным величинам и распределениям</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B2%D0%B5%D1%80%D0%BE%D1%8F%D1%82%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9%20%D0%BD%D0%BE%D1%80%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%9F%D1%83%D0%B0%D1%81%D1%81%D0%BE%D0%BD" target="_blank">Habr: распределения вероятностей</a> — статьи о вероятностных распределениях на Хабре</li>
        <li><a href="https://en.wikipedia.org/wiki/List_of_probability_distributions" target="_blank">Wikipedia: List of probability distributions</a> — полный список стандартных распределений</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank">SciPy: scipy.stats distributions</a> — все стандартные распределения: norm, poisson, binom, expon и др.</li>
        <li><a href="https://numpy.org/doc/stable/reference/random/generated/numpy.random.normal.html" target="_blank">NumPy: numpy.random.normal</a> — генерация нормально распределённых случайных чисел</li>
      </ul>
    `,
  },
});
