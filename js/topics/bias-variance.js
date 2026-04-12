/* ==========================================================================
   Bias-Variance Tradeoff
   ========================================================================== */
App.registerTopic({
  id: 'bias-variance',
  category: 'ml-basics',
  title: 'Bias-Variance Tradeoff',
  summary: 'Главный компромисс в ML: простота vs гибкость модели.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('intro-ml')">Что такое ML</a> ·
        <a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты стреляешь в мишень. У тебя два типа ошибок:</p>
        <p><b>Смещение (bias)</b> — твой прицел сбит. Все выстрелы ложатся кучно, но не в центр, а где-то в стороне. Ты стреляешь <b>систематически</b> неправильно. Простая модель «стреляет не туда».</p>
        <p><b>Разброс (variance)</b> — у тебя дрожат руки. Выстрелы в среднем в центре, но летят куда попало — раскиданы по всей мишени. Ты стреляешь <b>непредсказуемо</b>. Сложная модель «трясётся» от выборки к выборке.</p>
        <p>Идеал — целиться в центр и не дрожать (низкий bias + низкая variance). Но в ML есть фундаментальный компромисс: уменьшая одно, часто увеличиваешь другое. Выбираем «золотую середину».</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" style="max-width:640px;">
          <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="45" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="20" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="3" fill="#dc2626"/>
          <circle cx="140" cy="65" r="4" fill="#3b82f6"/><circle cx="145" cy="72" r="4" fill="#3b82f6"/>
          <circle cx="138" cy="60" r="4" fill="#3b82f6"/><circle cx="143" cy="68" r="4" fill="#3b82f6"/>
          <circle cx="136" cy="70" r="4" fill="#3b82f6"/>
          <text x="100" y="190" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">High Bias</text>
          <text x="100" y="202" text-anchor="middle" font-size="10" fill="#64748b">Low Variance</text>
          <circle cx="320" cy="100" r="70" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="320" cy="100" r="45" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="320" cy="100" r="20" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="320" cy="100" r="3" fill="#dc2626"/>
          <circle cx="290" cy="70" r="4" fill="#3b82f6"/><circle cx="355" cy="130" r="4" fill="#3b82f6"/>
          <circle cx="310" cy="140" r="4" fill="#3b82f6"/><circle cx="340" cy="60" r="4" fill="#3b82f6"/>
          <circle cx="300" cy="115" r="4" fill="#3b82f6"/>
          <text x="320" y="190" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Low Bias</text>
          <text x="320" y="202" text-anchor="middle" font-size="10" fill="#64748b">High Variance</text>
          <circle cx="540" cy="100" r="70" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="540" cy="100" r="45" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="540" cy="100" r="20" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
          <circle cx="540" cy="100" r="3" fill="#dc2626"/>
          <circle cx="537" cy="97" r="4" fill="#10b981"/><circle cx="543" cy="103" r="4" fill="#10b981"/>
          <circle cx="535" cy="102" r="4" fill="#10b981"/><circle cx="541" cy="96" r="4" fill="#10b981"/>
          <circle cx="539" cy="100" r="4" fill="#10b981"/>
          <text x="540" y="190" text-anchor="middle" font-size="12" font-weight="600" fill="#065f46">Low Bias</text>
          <text x="540" y="202" text-anchor="middle" font-size="10" fill="#065f46">Low Variance</text>
        </svg>
        <div class="caption">Слева: прицел сбит, кучно не в центр (underfit). Центр: прицел верный, но дрожат руки (overfit). Справа: идеал.</div>
      </div>

      <h3>🎯 Зачем знать про bias-variance</h3>
      <p>Это главный компромисс в машинном обучении. Он объясняет:</p>
      <ul>
        <li>Почему простые модели плохо работают (высокий bias).</li>
        <li>Почему сложные модели переобучаются (высокая variance).</li>
        <li>Когда помогают регуляризация, больше данных, ансамблирование.</li>
        <li>Как диагностировать проблемы с моделью.</li>
      </ul>

      <h3>🧮 Три источника ошибки</h3>
      <p>Любая ошибка предсказания модели раскладывается на три <b>несократимые</b> части:</p>

      <div class="math-block">$$\\text{Error} = \\text{Bias}^2 + \\text{Variance} + \\text{Noise}$$</div>

      <h4>1. Bias (смещение) — «модель слишком простая»</h4>
      <p>Насколько модель <b>систематически</b> промахивается мимо истины, <b>в среднем по всем возможным выборкам</b>. Это следствие упрощений, заложенных в модель.</p>
      <p>Пример: пытаемся предсказать синусоиду прямой линией. Как ни обучай — прямая не сможет её ухватить. Модель <b>недостаточно гибкая</b> для реальности данных. Это высокий bias.</p>
      <p><b>Симптомы высокого bias:</b></p>
      <ul>
        <li>Train error и validation error оба высокие.</li>
        <li>Train error и validation error близки друг к другу.</li>
        <li>Модель систематически ошибается в определённых зонах.</li>
      </ul>
      <p>Это называется <span class="term" data-tip="Underfitting. Недообучение. Модель слишком проста, чтобы уловить закономерности в данных. Симптомы: высокая ошибка на обучении и тесте."><a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">недообучением</a> (<a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">underfitting</a>)</span>.</p>

      <h4>2. Variance (дисперсия) — «модель слишком чувствительная»</h4>
      <p>Насколько сильно предсказания модели <b>меняются</b> при разных обучающих выборках. Высокая variance означает: возьми другую случайную выборку того же размера — получишь совсем другую модель.</p>
      <p>Пример: полином 20-й степени на 30 точках. Он идеально проходит через все точки, но между ними выдумывает дикие колебания. Уберёшь одну точку — кривая изменится до неузнаваемости. Модель запоминает не только сигнал, но и <b>шум</b>.</p>
      <p><b>Симптомы высокой variance:</b></p>
      <ul>
        <li>Train error низкий, validation error высокий.</li>
        <li>Большой разрыв между train и validation.</li>
        <li>При разных фолдах CV — большой разброс качества.</li>
      </ul>
      <p>Это называется <span class="term" data-tip="Overfitting. Переобучение. Модель запоминает особенности обучающей выборки, включая шум, и плохо работает на новых данных."><a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучением</a> (<a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">overfitting</a>)</span>.</p>

      <h4>3. Noise (шум) — «данные сами по себе неточны»</h4>
      <p>Неустранимая часть ошибки, присущая данным. Реальные измерения всегда содержат случайность: даже совершенная модель не предскажет цены на бирже идеально — там есть истинная случайность.</p>
      <p>Шум мы не можем уменьшить, его можно только <b>не добавить</b> своими ошибками.</p>

      <div class="key-concept">
        <div class="kc-label">Главный компромисс</div>
        <p>Усложняя модель: <b>уменьшаем bias</b>, но <b>увеличиваем variance</b>. Упрощая: наоборот. Цель — найти такую сложность, при которой сумма bias² + variance минимальна. Это и есть оптимум для данной задачи и данного объёма данных.</p>
      </div>

      <h3>📉 U-образная кривая ошибки</h3>
      <p>Если построить график «ошибка на test vs сложность модели», получается характерная U-образная форма:</p>
      <ul>
        <li><b>Слева (простые модели):</b> высокая ошибка из-за bias. Увеличивая сложность, мы её снижаем.</li>
        <li><b>Минимум:</b> оптимальная сложность, где bias и variance сбалансированы.</li>
        <li><b>Справа (сложные модели):</b> ошибка снова растёт — из-за variance.</li>
      </ul>

      <p>А ошибка на <b>train</b> монотонно падает с ростом сложности — она обманчива и не показывает реального качества.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 360" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">U-образная кривая: ошибка vs сложность модели</text>
          <line x1="80" y1="280" x2="720" y2="280" stroke="#475569" stroke-width="1.5"/>
          <line x1="80" y1="60" x2="80" y2="280" stroke="#475569" stroke-width="1.5"/>
          <!-- X ticks -->
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="80" y="300">низкая</text>
            <text x="720" y="300">высокая</text>
          </g>
          <text x="400" y="325" text-anchor="middle" font-size="12" font-weight="600" fill="#64748b">Сложность модели</text>
          <text x="40" y="170" text-anchor="middle" font-size="12" font-weight="600" fill="#64748b" transform="rotate(-90 40 170)">Ошибка</text>
          <!-- Train error: monotonically decreasing (exponential decay) -->
          <path id="bv-train" d="" fill="none" stroke="#1e40af" stroke-width="3"/>
          <!-- Test error: U-shape (quadratic-ish) -->
          <path id="bv-test" d="" fill="none" stroke="#dc2626" stroke-width="3"/>
          <!-- Bias component: decreasing -->
          <path id="bv-bias" d="" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="5,3"/>
          <!-- Variance component: increasing -->
          <path id="bv-variance" d="" fill="none" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5,3"/>
          <!-- Optimal point marker -->
          <line id="bv-opt-line" x1="0" y1="0" x2="0" y2="0" stroke="#059669" stroke-width="2" stroke-dasharray="3,3"/>
          <text id="bv-opt-label" x="0" y="0" text-anchor="middle" font-size="11" font-weight="700" fill="#059669">Оптимум</text>
          <!-- Labels -->
          <text x="140" y="340" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">← высокий bias (underfitting)</text>
          <text x="640" y="340" text-anchor="middle" font-size="12" font-weight="700" fill="#7c3aed">высокий variance (overfitting) →</text>
          <text x="130" y="95" text-anchor="start" font-size="10" fill="#b45309">(underfitting)</text>
          <text x="700" y="95" text-anchor="end" font-size="10" fill="#7c3aed">(overfitting)</text>
          <!-- Legend -->
          <g font-size="11" font-weight="600">
            <line x1="570" y1="225" x2="595" y2="225" stroke="#1e40af" stroke-width="3"/>
            <text x="600" y="229" fill="#1e40af">Train error</text>
            <line x1="570" y1="245" x2="595" y2="245" stroke="#dc2626" stroke-width="3"/>
            <text x="600" y="249" fill="#dc2626">Test error</text>
            <line x1="570" y1="265" x2="595" y2="265" stroke="#b45309" stroke-width="2" stroke-dasharray="5,3"/>
            <text x="600" y="269" fill="#b45309">Bias²</text>
            <line x1="570" y1="285" x2="595" y2="285" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5,3"/>
            <text x="600" y="289" fill="#7c3aed">Variance</text>
          </g>
        </svg>
        <div class="caption">Классическая U-образная кривая. Train ошибка (синяя) монотонно падает с ростом сложности — обманчиво. Test ошибка (красная) сначала падает (уменьшается bias), потом растёт (растёт variance). Минимум test ошибки = оптимальная сложность модели.</div>
        <script>
        (function() {
          var x0 = 80, x1 = 720, y0 = 280, y1 = 60;
          var n = 100;
          // X = complexity [0, 10]
          function toX(c) { return x0 + (c / 10) * (x1 - x0); }
          function toY(v) { return y0 - v * (y0 - y1); }
          // Bias^2: exponential decay, starts high (0.9) ends low (0.05)
          function bias2(c) { return 0.05 + 0.85 * Math.exp(-c / 2.5); }
          // Variance: exponential growth, starts low (0.05) grows
          function variance(c) { return 0.05 + 0.02 * Math.exp(c / 2.2); }
          // Irreducible error
          var noise = 0.1;
          // Train error = bias^2 − some underfitting correction (train sees the data)
          // For visualisation: train is strictly decreasing
          function trainErr(c) { return Math.max(0.01, 0.95 * Math.exp(-c / 1.6)); }
          function testErr(c) { return Math.min(0.95, bias2(c) + variance(c) + noise); }

          function buildPath(fn) {
            var pts = [];
            for (var i = 0; i <= n; i++) {
              var c = (10 * i) / n;
              pts.push([toX(c).toFixed(1), toY(Math.min(0.95, fn(c))).toFixed(1)]);
            }
            var d = 'M' + pts[0][0] + ',' + pts[0][1];
            for (var j = 1; j < pts.length; j++) d += ' L' + pts[j][0] + ',' + pts[j][1];
            return d;
          }

          document.getElementById('bv-train').setAttribute('d', buildPath(trainErr));
          document.getElementById('bv-test').setAttribute('d', buildPath(testErr));
          document.getElementById('bv-bias').setAttribute('d', buildPath(bias2));
          document.getElementById('bv-variance').setAttribute('d', buildPath(variance));

          // Find optimum (min of test error)
          var bestC = 0, bestErr = Infinity;
          for (var i = 0; i <= n; i++) {
            var c = (10 * i) / n;
            var e = testErr(c);
            if (e < bestErr) { bestErr = e; bestC = c; }
          }
          var optX = toX(bestC), optY = toY(bestErr);
          var optLine = document.getElementById('bv-opt-line');
          optLine.setAttribute('x1', optX); optLine.setAttribute('x2', optX);
          optLine.setAttribute('y1', optY - 5); optLine.setAttribute('y2', 280);
          var optLabel = document.getElementById('bv-opt-label');
          optLabel.setAttribute('x', optX);
          optLabel.setAttribute('y', optY - 15);
        })();
        </script>
      </div>

      <h3>🔍 Как диагностировать проблему</h3>
      <p>Всегда сравнивай train и validation ошибки:</p>

      <table>
        <tr><th>Train error</th><th>Val error</th><th>Диагноз</th><th>Что делать</th></tr>
        <tr><td>Высокий</td><td>Высокий, близко к train</td><td>High bias (underfit)</td><td>Усложнить модель, добавить признаки, ослабить регуляризацию</td></tr>
        <tr><td>Низкий</td><td>Высокий, большой разрыв</td><td>High variance (overfit)</td><td>Больше данных, регуляризация, проще модель</td></tr>
        <tr><td>Низкий</td><td>Низкий, близко к train</td><td>Всё хорошо!</td><td>Ничего не делать</td></tr>
        <tr><td>Высокий</td><td>Низкий</td><td>Невозможно</td><td>Проверить data leakage</td></tr>
      </table>

      <h3>⚙️ Как управлять bias и variance</h3>

      <h4>Снижение bias (от недообучения)</h4>
      <ul>
        <li>Более сложная модель (больше параметров, глубже деревья, больше слоёв).</li>
        <li>Больше признаков / feature engineering.</li>
        <li>Ослабить регуляризацию (уменьшить λ).</li>
        <li>Обучать дольше (больше эпох в нейросети).</li>
        <li>Нелинейные модели вместо линейных.</li>
      </ul>

      <h4>Снижение variance (от переобучения)</h4>
      <ul>
        <li><b>Больше данных</b> — самое надёжное средство.</li>
        <li>Регуляризация (L1, L2, dropout).</li>
        <li>Упростить модель (меньше параметров).</li>
        <li>Ансамблирование (bagging, Random Forest).</li>
        <li>Early stopping.</li>
        <li>Data augmentation.</li>
      </ul>

      <h3>🔗 Связь с ансамблями</h3>
      <ul>
        <li><b>Bagging (Random Forest)</b> — снижает variance, усредняя много моделей с высокой variance. Bias остаётся таким же, как у одного дерева.</li>
        <li><b>Boosting (XGBoost)</b> — снижает bias, последовательно улучшая слабые модели. Может увеличить variance, нужна регуляризация.</li>
        <li><b>Stacking</b> — может снизить и то, и другое.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Больше данных всегда помогает»</b> — снижает variance, но не bias. Если модель принципиально слишком проста — данные не спасут.</li>
        <li><b>«Регуляризация всегда хороша»</b> — слишком сильная регуляризация даёт underfit.</li>
        <li><b>«Глубокие сети не переобучаются»</b> — переобучаются, особенно на маленьких данных. Нужны dropout, augmentation, early stopping.</li>
        <li><b>«Сложная модель = лучше»</b> — только при достаточных данных. На маленьком датасете простая модель часто обгоняет сложную.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: формальное разложение</summary>
        <div class="deep-dive-body">
          <p>Для регрессии с квадратичной <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">функцией потерь</a>, при истинной функции $f$ и шуме $\\epsilon$:</p>
          <div class="math-block">$$E\\left[(y - \\hat{f}(x))^2\\right] = \\underbrace{(E[\\hat{f}(x)] - f(x))^2}_{\\text{Bias}^2} + \\underbrace{E\\left[(\\hat{f}(x) - E[\\hat{f}(x)])^2\\right]}_{\\text{Variance}} + \\underbrace{\\sigma^2}_{\\text{Noise}}$$</div>
          <p>Здесь ожидание берётся по всем возможным обучающим выборкам.</p>
          <p>Важное допущение: разложение существует для <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a>. Для других функций потерь (log-loss, hinge loss) аналогичные разложения тоже есть, но выглядят иначе.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: double descent в глубоких сетях</summary>
        <div class="deep-dive-body">
          <p>В классической теории bias-variance ошибка на test строго U-образная. Но в современных <b>over-parameterized</b> нейросетях (где параметров больше, чем примеров) наблюдается <b>двойной спуск</b>:</p>
          <ol>
            <li>Сначала ошибка падает (обычный bias→0).</li>
            <li>Потом растёт (variance растёт, классический overfit).</li>
            <li>Потом <b>снова падает</b> и становится меньше начального минимума.</li>
          </ol>
          <p>Это феномен современного DL, который активно исследуется. Он показывает, что классическая теория bias-variance — упрощение, работающее в классическом режиме, но не всегда в режиме огромных моделей.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: learning curves</summary>
        <div class="deep-dive-body">
          <p><b>Learning curve</b> — график train/val error в зависимости от размера выборки. Читается так:</p>
          <ul>
            <li>Обе кривые высокие и сходятся → high bias. Больше данных <b>не поможет</b>.</li>
            <li>Train низкая, val высокая, большой разрыв → high variance. Больше данных <b>поможет</b>.</li>
            <li>Обе кривые низкие и сошлись → идеально.</li>
          </ul>
          <p>Learning curve — практический инструмент диагностики: построй её и сразу увидишь, что нужно делать дальше.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Cross-validation</b> — основной инструмент измерения bias и variance.</li>
        <li><b>Регуляризация</b> — главный инструмент снижения variance.</li>
        <li><b>Ансамблирование</b> — снижает variance (bagging) или bias (boosting).</li>
        <li><b>Все ML-модели</b> — выбор сложности всегда упирается в bias-variance.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Подбор степени полинома',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>У нас 10 точек, сгенерированных по функции <b>y = sin(x) + шум</b>. Обучаем полиномиальную регрессию степеней 1, 3 и 9. Для каждой степени считаем train MSE и test MSE. Найдите оптимальную степень и объясните с позиции bias-variance.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>x</th><th>0.5</th><th>1.0</th><th>1.5</th><th>2.0</th><th>2.5</th><th>3.0</th><th>3.5</th><th>4.0</th><th>4.5</th><th>5.0</th></tr>
              <tr><td><b>y (истинный sin)</b></td><td>0.48</td><td>0.84</td><td>1.00</td><td>0.91</td><td>0.60</td><td>0.14</td><td>-0.35</td><td>-0.76</td><td>-0.98</td><td>-0.96</td></tr>
              <tr><td><b>y (с шумом)</b></td><td>0.55</td><td>0.79</td><td>1.05</td><td>0.85</td><td>0.68</td><td>0.22</td><td>-0.28</td><td>-0.71</td><td>-1.04</td><td>-0.89</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Степень 1: линейная функция y = a + b*x</h4>
            <div class="calc">Обученная функция (МНК): y = 1.12 - 0.35*x

Предсказания vs реальность (с шумом):
  x=0.5: pred=0.945, real=0.55, ошибка=0.395
  x=2.5: pred=0.245, real=0.68, ошибка=0.435
  x=5.0: pred=-0.63, real=-0.89, ошибка=0.260

Train MSE = 0.187
Test MSE  = 0.214  (на 3 новых точках: x=0.8, 2.2, 4.2)

Разрыв Train/Test: 0.027 — маленький!</div>
            <div class="why">Маленький разрыв Train/Test — признак высокого BIAS, а не хорошей модели. Обе ошибки высокие (0.187, 0.214) — модель одинаково плохо работает и на train, и на test. Линия не может описать синусоиду — underfitting.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Степень 3: кубический полином y = a + bx + cx^2 + dx^3</h4>
            <div class="calc">Обученная функция близко описывает sin(x):
  На train: предсказания близки к реальным значениям

Train MSE = 0.008
Test MSE  = 0.012  (на тех же 3 новых точках)

Разрыв Train/Test: 0.004 — маленький!
Обе ошибки низкие — хорошо!</div>
            <div class="why">Кубический полином хорошо описывает форму синусоиды на данном диапазоне. Маленький разрыв + обе ошибки низкие = хороший баланс bias и variance. Это и есть «золотая середина».</div>
          </div>

          <div class="step" data-step="3">
            <h4>Степень 9: полином степени 9 через все 10 точек</h4>
            <div class="calc">Полином степени 9 проходит через все 10 точек идеально:

Train MSE = 0.000  (проходит через все точки!)
Test MSE  = 0.891  (!) — катастрофа на новых данных

Разрыв Train/Test: 0.891 — огромный!
Train: идеально, Test: ужасно — overfit</div>
            <div class="why">Полином степени 9 с 10 точками имеет ровно столько степеней свободы, чтобы пройти через каждую точку. Он запомнил шум как сигнал. На новых x выдаёт дикие колебания — это классическая высокая variance.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сводная таблица: bias-variance по степеням</h4>
            <div class="calc">Степень  Train MSE  Test MSE  Разрыв  Диагноз
   1       0.187      0.214    0.027   High Bias (underfit)
   3       0.008      0.012    0.004   Хороший баланс
   9       0.000      0.891    0.891   High Variance (overfit)

Закономерность:
  Степень 1 -&gt; 3: обе ошибки падают (уменьшаем bias)
  Степень 3 -&gt; 9: train падает, test растёт (растёт variance)</div>
            <div class="why">Это классическая U-образная кривая test error в зависимости от сложности модели. Минимум test error = оптимальная сложность. Здесь это степень 3. Выбираем её для финальной модели.</div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <text x="230" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Полиномы степени 1, 3, 9 на данных sin(x)</text>
              <!-- Axes -->
              <line x1="40" y1="20" x2="40" y2="148" stroke="#64748b" stroke-width="1.5"/>
              <line x1="40" y1="148" x2="440" y2="148" stroke="#64748b" stroke-width="1.5"/>
              <text x="440" y="160" font-size="9" fill="#64748b">x</text>
              <text x="28" y="16" font-size="9" fill="#64748b">y</text>
              <!-- Scatter dots (approximating sin curve with noise) -->
              <circle cx="80" cy="80" r="4" fill="#64748b"/>
              <circle cx="118" cy="50" r="4" fill="#64748b"/>
              <circle cx="156" cy="35" r="4" fill="#64748b"/>
              <circle cx="194" cy="42" r="4" fill="#64748b"/>
              <circle cx="232" cy="65" r="4" fill="#64748b"/>
              <circle cx="270" cy="100" r="4" fill="#64748b"/>
              <circle cx="308" cy="122" r="4" fill="#64748b"/>
              <circle cx="346" cy="135" r="4" fill="#64748b"/>
              <circle cx="384" cy="130" r="4" fill="#64748b"/>
              <circle cx="420" cy="115" r="4" fill="#64748b"/>
              <!-- Degree 1: straight line (high bias) -->
              <line x1="50" y1="130" x2="430" y2="60" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,3"/>
              <!-- Degree 3: smooth curve fitting sin (good) -->
              <path d="M50,95 C100,35 150,20 200,40 C250,60 300,115 350,140 C390,158 420,125 435,105" fill="none" stroke="#10b981" stroke-width="2.5"/>
              <!-- Degree 9: wild oscillating curve (high variance) -->
              <path d="M50,80 C65,20 80,130 100,40 C120,30 140,15 160,35 C185,60 205,40 230,65 C255,90 270,105 295,120 C320,135 340,130 360,128 C385,126 410,70 435,110" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,2"/>
              <!-- Legend -->
              <line x1="48" y1="162" x2="72" y2="162" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,2"/>
              <text x="75" y="165" font-size="9" fill="#ef4444">степень 1 (underfit)</text>
              <line x1="178" y1="162" x2="202" y2="162" stroke="#10b981" stroke-width="2.5"/>
              <text x="205" y="165" font-size="9" fill="#10b981">степень 3 (оптимум)</text>
              <line x1="318" y1="162" x2="342" y2="162" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3,2"/>
              <text x="345" y="165" font-size="9" fill="#3b82f6">степень 9 (overfit)</text>
            </svg>
            <div class="caption">Красная прямая (степень 1) не описывает форму — высокий bias. Зелёная кривая (степень 3) — оптимальный баланс. Синяя (степень 9) дрожит между точками — высокая variance.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Степень 1: High Bias — Train MSE=0.187, Test MSE=0.214. Underfitting.</p>
            <p>Степень 3: оптимум — Train MSE=0.008, Test MSE=0.012. Хороший баланс bias-variance.</p>
            <p>Степень 9: High Variance — Train MSE=0.000, Test MSE=0.891. Catastrophic overfitting.</p>
            <p>Оптимальная степень: <b>3</b>.</p>
          </div>

          <div class="lesson-box">Bias-variance tradeoff проявляется чётко: увеличение сложности снижает bias (train ошибка падает), но при переходе точки оптимума начинает расти variance (test ошибка растёт). Разрыв между train и test error — индикатор variance. Используй CV для честного выбора оптимальной сложности.</div>
        `
      },
      {
        title: 'Диагностика по train/val ошибкам',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Ты обучаешь модель и видишь значения train/validation error. По каждому сценарию определи: что происходит с моделью, и что нужно сделать для улучшения.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Сценарий</th><th>Train Error</th><th>Val Error</th><th>Разрыв (Val-Train)</th></tr>
              <tr><td>A</td><td>0.35</td><td>0.37</td><td>0.02</td></tr>
              <tr><td>B</td><td>0.05</td><td>0.38</td><td>0.33</td></tr>
              <tr><td>C</td><td>0.08</td><td>0.10</td><td>0.02</td></tr>
              <tr><td>D</td><td>0.32</td><td>0.65</td><td>0.33</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Сценарий A: Train=0.35, Val=0.37, Разрыв=0.02</h4>
            <div class="calc">Train error ВЫСОКИЙ (0.35)
Val error ВЫСОКИЙ (0.37)
Разрыв МАЛЕНЬКИЙ (0.02)

Диагноз: HIGH BIAS / Underfitting

Модель систематически ошибается на обоих множествах.
Разрыв мал — это не проблема переобучения.
Проблема: модель слишком простая.</div>
            <div class="why">Когда обе ошибки высокие и разрыв маленький — модель не может описать закономерности в данных. Добавление данных не поможет: ошибки сойдутся, но обе останутся высокими.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Что делать при High Bias (Сценарий A)</h4>
            <div class="calc">Проблема: модель слишком простая.

Решения (от простого к сложному):
1. Увеличить сложность модели (больше слоёв, выше степень)
2. Добавить новые признаки (feature engineering)
3. Убрать регуляризацию (уменьшить lambda)
4. Попробовать более мощный класс моделей

Чего НЕ делать:
- Добавлять больше данных (train error тоже высокий — данные не помогут)
- Увеличивать регуляризацию (только ухудшит)</div>
            <div class="why">При high bias нужно увеличивать ёмкость модели — давать ей больше «мощности» для описания данных. Добавление данных при high bias только сглаживает кривые, но не снижает их уровень.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Сценарий B: Train=0.05, Val=0.38, Разрыв=0.33</h4>
            <div class="calc">Train error НИЗКИЙ (0.05) — модель отлично учится
Val error ВЫСОКИЙ (0.38) — на новых данных плохо
Разрыв БОЛЬШОЙ (0.33)

Диагноз: HIGH VARIANCE / Overfitting

Модель запомнила обучение, не выучила закономерность.
На train — почти идеально, на val — значительно хуже.</div>
            <div class="why">Большой разрыв между train и val — признак переобучения. Модель выучила шум обучающей выборки. Она «помнит» примеры, а не находит общий паттерн.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Что делать при High Variance (Сценарий B)</h4>
            <div class="calc">Проблема: модель слишком сложная / данных мало.

Решения:
1. Добавить данных (самое эффективное!)
2. Добавить регуляризацию (L1/L2)
3. Уменьшить сложность модели
4. Dropout (для нейросетей)
5. Ансамблирование (bagging)
6. Feature selection (убрать шумовые признаки)

Признак улучшения: разрыв между train и val уменьшается</div>
            <div class="why">При high variance модель слишком хорошо подстраивается под обучающие данные. Регуляризация и больше данных — главные инструменты борьбы.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Сценарии C и D: анализ</h4>
            <div class="calc">Сценарий C: Train=0.08, Val=0.10, Разрыв=0.02
  Обе ошибки НИЗКИЕ, разрыв МАЛЕНЬКИЙ
  Диагноз: Хорошо! Оптимальный баланс bias-variance.
  Действие: модель готова к деплою.

Сценарий D: Train=0.32, Val=0.65, Разрыв=0.33
  Train ВЫСОКИЙ, Val ЕЩЁ ВЫШЕ, разрыв БОЛЬШОЙ
  Диагноз: High Bias + High Variance — худший случай!
  Модель и простая (train высокий), и переобученная (разрыв большой).
  Возможная причина: слишком маленький датасет + неправильная архитектура.</div>
            <div class="why">Сценарий D — двойная проблема. Нужно и увеличивать сложность модели, и добавлять данные, и регуляризировать. Часто встречается при нехватке данных для данной сложности задачи.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Сценарий A: High Bias — усложни модель, добавь признаки.</p>
            <p>Сценарий B: High Variance — добавь данные, регуляризацию.</p>
            <p>Сценарий C: Оптимально — деплой!</p>
            <p>Сценарий D: High Bias + High Variance — добавь данные И усложни архитектуру.</p>
          </div>

          <div class="lesson-box">Главный диагностический инструмент ML — сравнение train и val ошибок. Обе высокие + маленький разрыв = bias (underfitting). Маленькая train + большой разрыв = variance (overfitting). Обе низкие = успех. Это первое, что делает хороший ML-инженер при отладке модели.</div>
        `
      },
      {
        title: 'Больше данных vs сложнее модель',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Команда обучает модель для предсказания цен на квартиры. Текущее состояние: Train error = 18%, Val error = 42%. У команды два варианта: <b>А) собрать ещё 5000 примеров</b> или <b>Б) добавить полиномиальные признаки</b>. Покажите через learning curves, что поможет при high variance.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Размер train</th><th>Train Error</th><th>Val Error</th><th>Разрыв</th></tr>
              <tr><td>100</td><td>5%</td><td>62%</td><td>57%</td></tr>
              <tr><td>500</td><td>10%</td><td>50%</td><td>40%</td></tr>
              <tr><td>1000</td><td>14%</td><td>45%</td><td>31%</td></tr>
              <tr><td>2000</td><td>16%</td><td>42%</td><td>26%</td></tr>
              <tr><td>5000</td><td>17%</td><td>35%</td><td>18%</td></tr>
              <tr><td>10000</td><td>18%</td><td>29%</td><td>11%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Диагностика текущего состояния</h4>
            <div class="calc">Текущее: Train=18%, Val=42%, Разрыв=24%

Train error низкий → bias не катастрофический
Разрыв большой (24%) → HIGH VARIANCE — модель переобучена

Вывод: главная проблема — высокая variance (overfitting).
Нужно либо: больше данных ИЛИ регуляризация ИЛИ более простая модель.</div>
            <div class="why">Разрыв в 24 процентных пункта между train и val — ясный сигнал high variance. Модель слишком хорошо подстраивается под обучающие данные.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Анализ learning curves: что происходит с ростом данных</h4>
            <div class="calc">Наблюдения из таблицы:
  Train error растёт: 5% -&gt; 10% -&gt; 14% -&gt; 18% (норма!)
  Val error падает:  62% -&gt; 50% -&gt; 45% -&gt; 42% (хорошо!)
  Разрыв сужается:  57% -&gt; 40% -&gt; 31% -&gt; 24% (тренд есть)

При 5000 примерах: разрыв = 18%
При 10000 примерах: разрыв = 11%

Тренд: каждое удвоение данных уменьшает разрыв примерно на 8-10%</div>
            <div class="why">Когда train error растёт при добавлении данных — это нормально: больше разнообразных примеров сложнее запомнить дословно. Val error при этом должен падать — это позитивный сигнал, данные помогают.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Вариант А: собрать +5000 примеров (итого ~7000)</h4>
            <div class="calc">Экстраполяция по таблице:
  При 5000: Val=35%, разрыв=18%
  При 10000: Val=29%, разрыв=11%
  При 7000 (интерполяция): Val ~33%, разрыв ~14%

Итог после сбора данных:
  Train error ~18-19% (почти не меняется)
  Val error ~33% (улучшение с 42%!)
  Разрыв ~14% (было 24%)

Улучшение Val error: с 42% до ~33% = -9 процентных пунктов</div>
            <div class="why">При high variance больше данных ПОМОГАЕТ. Это видно из learning curves — кривые ещё не сошлись, есть куда улучшаться. Сбор данных — дорогой, но надёжный способ.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Вариант Б: добавить полиномиальные признаки (усложнить модель)</h4>
            <div class="calc">Добавляем x^2, x^3, взаимодействия признаков — усложняем модель.

Что произойдёт при high variance:
  Train error: ещё снизится (было 18%, станет ~8%)
  Val error: ВЫРАСТЕТ (было 42%, станет ~55%)
  Разрыв: УВЕЛИЧИТСЯ (было 24%, станет ~47%)

Усложнение модели при high variance = УХУДШЕНИЕ!</div>
            <div class="why">При high variance усложнение модели — ошибка! Модель и так переобучена. Добавив ещё больше параметров, мы ещё сильнее переобучимся. Усложнение модели помогает только при high bias.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Итоговое сравнение стратегий</h4>
            <div class="calc">Ситуация: High Variance (разрыв 24%)

                          Val Error  Разрыв  Вердикт
Текущее состояние:           42%      24%   проблема
После +5000 примеров (А):   ~33%     ~14%   улучшение
После усложнения (Б):        ~55%    ~47%   ухудшение!

Правильная стратегия для High Variance:
  1. Собрать больше данных (вариант А)
  2. Добавить регуляризацию
  3. Убрать часть признаков
  4. Использовать ensemble (bagging)</div>
            <div class="why">Learning curves — это компас. Если разрыв train/val большой и кривые ещё не сошлись — данные помогут. Если сошлись на высоком уровне — нужна более сложная модель. Это главный инструмент принятия решений в ML.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Диагноз: <b>High Variance</b> (разрыв 24%, train=18%, val=42%).</p>
            <p>Вариант А (больше данных): val error улучшается до ~33%. <b>Правильно!</b></p>
            <p>Вариант Б (сложнее модель): val error ухудшается до ~55%. <b>Неправильно!</b></p>
            <p>При high variance нужно: больше данных, регуляризация, упрощение модели.</p>
          </div>

          <div class="lesson-box">Ключевое правило: смотри на learning curves, прежде чем принимать решение. При high variance (большой разрыв train/val) — добавляй данные и регуляризируй. При high bias (обе кривые высокие) — усложняй модель. Неправильно диагностируешь — потеряешь время и деньги.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: полиномиальная регрессия</h3>
        <p>Меняй степень полинома и смотри, как меняются train и test ошибки.</p>
        <div class="sim-container">
          <div class="sim-controls" id="bv-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="bv-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="bv-fit"></canvas></div>
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="bv-err"></canvas></div>
            </div>
            <div class="sim-stats" id="bv-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#bv-controls');
        const cDeg = App.makeControl('range', 'bv-deg', 'Степень полинома', { min: 1, max: 15, step: 1, value: 3 });
        const cN = App.makeControl('range', 'bv-n', 'Примеров', { min: 10, max: 100, step: 5, value: 20 });
        const cNoise = App.makeControl('range', 'bv-noise', 'Шум σ', { min: 0, max: 1, step: 0.05, value: 0.3 });
        [cDeg, cN, cNoise].forEach(c => controls.appendChild(c.wrap));

        let fitChart = null, errChart = null;
        let xTrain = [], yTrain = [], xTest = [], yTest = [];

        function truefn(x) { return Math.sin(1.5 * x); }

        function regen() {
          const n = +cN.input.value, noise = +cNoise.input.value;
          xTrain = []; yTrain = []; xTest = []; yTest = [];
          for (let i = 0; i < n; i++) {
            const x = -3 + 6 * Math.random();
            xTrain.push(x); yTrain.push(truefn(x) + App.Util.randn(0, noise));
          }
          for (let i = 0; i < 100; i++) {
            const x = -3 + 6 * (i / 99);
            xTest.push(x); yTest.push(truefn(x) + App.Util.randn(0, noise));
          }
          update();
        }

        // Решение полиномиальной регрессии через normal equation
        function fitPoly(xs, ys, deg) {
          const n = xs.length;
          const X = xs.map(x => { const row = []; for (let d = 0; d <= deg; d++) row.push(Math.pow(x, d)); return row; });
          // X^T X
          const p = deg + 1;
          const XtX = Array.from({ length: p }, () => new Array(p).fill(0));
          const Xty = new Array(p).fill(0);
          for (let i = 0; i < n; i++) {
            for (let r = 0; r < p; r++) {
              for (let c = 0; c < p; c++) XtX[r][c] += X[i][r] * X[i][c];
              Xty[r] += X[i][r] * ys[i];
            }
          }
          // Gauss elimination + small regularization
          for (let r = 0; r < p; r++) XtX[r][r] += 1e-8;
          for (let i = 0; i < p; i++) {
            // pivot
            let maxR = i;
            for (let k = i + 1; k < p; k++) if (Math.abs(XtX[k][i]) > Math.abs(XtX[maxR][i])) maxR = k;
            [XtX[i], XtX[maxR]] = [XtX[maxR], XtX[i]];
            [Xty[i], Xty[maxR]] = [Xty[maxR], Xty[i]];
            for (let k = i + 1; k < p; k++) {
              const f = XtX[k][i] / XtX[i][i];
              for (let j = i; j < p; j++) XtX[k][j] -= f * XtX[i][j];
              Xty[k] -= f * Xty[i];
            }
          }
          const w = new Array(p).fill(0);
          for (let i = p - 1; i >= 0; i--) {
            let s = Xty[i];
            for (let j = i + 1; j < p; j++) s -= XtX[i][j] * w[j];
            w[i] = s / XtX[i][i];
          }
          return w;
        }

        function predict(w, x) { let s = 0; for (let d = 0; d < w.length; d++) s += w[d] * Math.pow(x, d); return s; }

        function update() {
          const deg = +cDeg.input.value;
          const w = fitPoly(xTrain, yTrain, deg);
          let trainErr = 0; xTrain.forEach((x, i) => { trainErr += (yTrain[i] - predict(w, x)) ** 2; }); trainErr /= xTrain.length;
          let testErr = 0; xTest.forEach((x, i) => { testErr += (yTest[i] - predict(w, x)) ** 2; }); testErr /= xTest.length;

          // fit chart
          const gridX = App.Util.linspace(-3, 3, 200);
          const ctx = container.querySelector('#bv-fit').getContext('2d');
          if (fitChart) fitChart.destroy();
          fitChart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Train', data: xTrain.map((x, i) => ({ x, y: yTrain[i] })), backgroundColor: 'rgba(59,130,246,0.5)', pointRadius: 3 },
                { type: 'line', label: 'True', data: gridX.map(x => ({ x, y: truefn(x) })), borderColor: '#94a3b8', borderWidth: 2, pointRadius: 0, fill: false, borderDash: [5, 5] },
                { type: 'line', label: 'Предсказание', data: gridX.map(x => ({ x, y: predict(w, x) })), borderColor: '#dc2626', borderWidth: 2.5, pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' }, title: { display: true, text: `Полином степени ${deg}` } },
              scales: { x: { type: 'linear', min: -3.5, max: 3.5 }, y: { suggestedMin: -3, suggestedMax: 3 } },
            },
          });
          App.registerChart(fitChart);

          // error curve: train vs test по степеням
          const errs = [];
          for (let d = 1; d <= 15; d++) {
            const ww = fitPoly(xTrain, yTrain, d);
            let te = 0; xTrain.forEach((x, i) => { te += (yTrain[i] - predict(ww, x)) ** 2; }); te /= xTrain.length;
            let ve = 0; xTest.forEach((x, i) => { ve += (yTest[i] - predict(ww, x)) ** 2; }); ve /= xTest.length;
            errs.push({ d, train: te, test: ve });
          }

          const ctx2 = container.querySelector('#bv-err').getContext('2d');
          if (errChart) errChart.destroy();
          errChart = new Chart(ctx2, {
            type: 'line',
            data: {
              labels: errs.map(e => e.d),
              datasets: [
                { label: 'Train MSE', data: errs.map(e => e.train), borderColor: '#3b82f6', borderWidth: 2, pointRadius: 2, fill: false },
                { label: 'Test MSE', data: errs.map(e => e.test), borderColor: '#dc2626', borderWidth: 2, pointRadius: 2, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' }, title: { display: true, text: 'Bias-Variance кривая' } },
              scales: { x: { title: { display: true, text: 'Степень полинома' } }, y: { type: 'logarithmic', title: { display: true, text: 'MSE' }, min: 0.001 } },
            },
          });
          App.registerChart(errChart);

          container.querySelector('#bv-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Степень</div><div class="stat-value">${deg}</div></div>
            <div class="stat-card"><div class="stat-label">Train MSE</div><div class="stat-value">${trainErr.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">Test MSE</div><div class="stat-value">${testErr.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">Параметров</div><div class="stat-value">${deg + 1}</div></div>
          `;
        }

        cDeg.input.addEventListener('input', update);
        [cN, cNoise].forEach(c => c.input.addEventListener('change', regen));
        container.querySelector('#bv-regen').onclick = regen;
        regen();
      },
    },

    python: `
      <h3>Python: диагностика bias-variance</h3>
      <p>Полиномиальные признаки помогают наглядно показать переобучение и недообучение через кривые обучения.</p>

      <h4>1. Влияние степени полинома на train/test ошибку</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

# Генерируем нелинейные данные с шумом
np.random.seed(42)
X = np.sort(np.random.uniform(-3, 3, 100)).reshape(-1, 1)
y = 0.5 * X.ravel()**2 - X.ravel() + np.random.randn(100) * 1.5

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

degrees = range(1, 12)
train_errors, test_errors = [], []

for d in degrees:
    pipe = Pipeline([('poly', PolynomialFeatures(d)), ('lr', LinearRegression())])
    pipe.fit(X_train, y_train)
    train_errors.append(mean_squared_error(y_train, pipe.predict(X_train)))
    test_errors.append(mean_squared_error(y_test, pipe.predict(X_test)))

plt.semilogy(degrees, train_errors, 'o-', label='Train MSE')
plt.semilogy(degrees, test_errors, 's-', label='Test MSE')
plt.xlabel('Степень полинома')
plt.ylabel('MSE (log)')
plt.title('Bias-Variance: train vs test')
plt.legend()
plt.show()</code></pre>

      <h4>2. Кривые обучения (learning curves)</h4>
      <pre><code>from sklearn.model_selection import learning_curve

def plot_learning_curve(estimator, X, y, title=''):
    train_sizes, train_scores, val_scores = learning_curve(
        estimator, X, y, cv=5, scoring='neg_mean_squared_error',
        train_sizes=np.linspace(0.1, 1.0, 10), random_state=42)

    train_mean = -train_scores.mean(axis=1)
    val_mean = -val_scores.mean(axis=1)

    plt.plot(train_sizes, train_mean, 'o-', label='Train MSE')
    plt.plot(train_sizes, val_mean, 's-', label='Val MSE')
    plt.xlabel('Размер обучающей выборки')
    plt.ylabel('MSE')
    plt.title(title)
    plt.legend()

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

plt.sca(axes[0])
plot_learning_curve(
    Pipeline([('poly', PolynomialFeatures(1)), ('lr', LinearRegression())]),
    X, y, title='Underfitting (степень=1)')

plt.sca(axes[1])
plot_learning_curve(
    Pipeline([('poly', PolynomialFeatures(10)), ('lr', LinearRegression())]),
    X, y, title='Overfitting (степень=10)')

plt.tight_layout()
plt.show()</code></pre>

      <h4>3. Оценка bias и variance через bootstrap</h4>
      <pre><code>from sklearn.utils import resample

# Оцениваем разброс предсказаний (variance) через bootstrap
X_test_single = np.array([[1.5]])  # одна точка для предсказания
predictions = []

for _ in range(200):
    X_b, y_b = resample(X_train, y_train, random_state=None)
    pipe = Pipeline([('poly', PolynomialFeatures(8)), ('lr', LinearRegression())])
    pipe.fit(X_b, y_b)
    predictions.append(pipe.predict(X_test_single)[0])

predictions = np.array(predictions)
true_val = 0.5 * 1.5**2 - 1.5  # истинное значение

print(f'Истинное значение: {true_val:.3f}')
print(f'Среднее предсказание: {predictions.mean():.3f}  (bias = {predictions.mean()-true_val:.3f})')
print(f'Std предсказаний: {predictions.std():.3f}  (variance)')

plt.hist(predictions, bins=30, alpha=0.7)
plt.axvline(true_val, color='red', label='True value')
plt.axvline(predictions.mean(), color='green', linestyle='--', label='Mean pred')
plt.legend()
plt.title('Bootstrap: распределение предсказаний (сложная модель)')
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется идея</h3>
      <ul>
        <li><b>Выбор модели</b> — простая или сложная?</li>
        <li><b>Регуляризация</b> — ручка для управления variance.</li>
        <li><b>Ансамблирование</b> — bagging снижает variance, boosting снижает bias.</li>
        <li><b>Early stopping</b> — остановка до того как variance начнёт расти.</li>
        <li><b>Learning curves</b> — диагностика через размер выборки.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Как реагировать</h4>
          <ul>
            <li><b>High bias</b>: усложнить модель, добавить признаки, слабее регуляризация</li>
            <li><b>High variance</b>: больше данных, сильнее регуляризация, проще модель</li>
            <li><b>Оба низкие</b>: хорошо!</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ В DL нарушение классики</h4>
          <ul>
            <li>Double descent: при очень больших моделях test error может снова падать</li>
            <li>Over-parameterized сети хорошо обобщают</li>
            <li>Классическая U-кривая — упрощение</li>
          </ul>
        </div>
      </div>
    `,

    extra: `
      <h3>Learning curves</h3>
      <p>График: train/val ошибка vs размер выборки.</p>
      <ul>
        <li><b>Обе ошибки высокие и сходятся</b> → High bias, больше данных не поможет.</li>
        <li><b>Train низкая, val высокая, разрыв</b> → High variance, больше данных поможет.</li>
      </ul>

      <h3>Double descent</h3>
      <p>В современных нейросетях наблюдается феномен: при увеличении числа параметров test error сначала падает, потом растёт (классика), потом <b>снова</b> падает. Это противоречит классическому bias-variance и до сих пор активно исследуется.</p>

      <h3>Bagging vs Boosting в терминах bias-variance</h3>
      <ul>
        <li><b>Bagging (Random Forest)</b> — снижает variance, оставляет bias базовых моделей.</li>
        <li><b>Boosting</b> — снижает bias, может поднять variance (нужна регуляризация).</li>
      </ul>

      <h3>Практические выводы</h3>
      <ul>
        <li>Смотри на train/val — это главный диагностический сигнал.</li>
        <li>Если разрыв большой → overfit → больше данных или регуляризация.</li>
        <li>Если обе ошибки высоки → underfit → сложнее модель или больше фичей.</li>
        <li>Baseline всегда: с чем сравнивать?</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=EuBBz3bI-aA" target="_blank">StatQuest: Bias and Variance</a> — интуитивное объяснение компромисса смещения и дисперсии</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=bias%20variance%20%D0%BA%D0%BE%D0%BC%D0%BF%D1%80%D0%BE%D0%BC%D0%B8%D1%81%D1%81%20%D1%81%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B4%D0%B8%D1%81%D0%BF%D0%B5%D1%80%D1%81%D0%B8%D1%8F" target="_blank">Bias-Variance на Habr</a> — разбор компромисса на русском языке с примерами</li>
        <li><a href="http://scott.fortmann-roe.com/docs/BiasVariance.html" target="_blank">Understanding the Bias-Variance Tradeoff (Scott Fortmann-Roe)</a> — классическое интерактивное эссе с визуализациями</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/auto_examples/model_selection/plot_bias_variance.html" target="_blank">sklearn: Bias-Variance example</a> — демонстрация компромисса на примере полиномиальной регрессии</li>
      </ul>
    `,
  },
});
