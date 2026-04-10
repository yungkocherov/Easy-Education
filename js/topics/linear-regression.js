/* ==========================================================================
   Линейная регрессия
   ========================================================================== */
App.registerTopic({
  id: 'linear-regression',
  category: 'ml-reg',
  title: 'Линейная регрессия',
  summary: 'Предсказание непрерывной переменной прямой линией через облако точек.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты продаёшь квартиры и хочешь оценивать их цену. Ты замечаешь: чем больше площадь, тем дороже квартира. Но <b>насколько</b> дороже? Можно провести простое правило: «каждый квадратный метр стоит 3 тысячи». Это и есть линейная регрессия в простейшем виде.</p>
        <p>Дальше можно добавить этажей, комнат, расстояния до метро, и твоя формула станет: «цена = базовая + 3·метры + 100·удобство метро − 5·удалённость». Ты научился связывать признаки с целевой величиной простой формулой.</p>
        <p>Линейная регрессия рисует <b>прямую линию</b> (или плоскость) через облако точек, которая лучше всего описывает зависимость. «Лучше всего» значит «точки в среднем ближе всего к этой прямой».</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <!-- Axes -->
          <line x1="50" y1="20" x2="50" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <line x1="50" y1="175" x2="470" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <text x="460" y="188" font-size="10" fill="#64748b">x</text>
          <text x="38" y="16" font-size="10" fill="#64748b">y</text>
          <!-- Fitted line -->
          <line x1="55" y1="165" x2="460" y2="35" stroke="#6366f1" stroke-width="2.5"/>
          <text x="390" y="58" font-size="10" fill="#6366f1" font-weight="600">ŷ = w₀ + w₁x</text>
          <!-- Scatter points with residuals -->
          <!-- Point 1 -->
          <circle cx="90" cy="135" r="5" fill="#f59e0b"/>
          <line x1="90" y1="135" x2="90" y2="150" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Point 2 -->
          <circle cx="140" cy="115" r="5" fill="#f59e0b"/>
          <line x1="140" y1="115" x2="140" y2="132" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Point 3 -->
          <circle cx="190" cy="95" r="5" fill="#f59e0b"/>
          <line x1="190" y1="95" x2="190" y2="113" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Point 4 (above line) -->
          <circle cx="240" cy="75" r="5" fill="#f59e0b"/>
          <line x1="240" y1="75" x2="240" y2="96" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Point 5 -->
          <circle cx="290" cy="100" r="5" fill="#f59e0b"/>
          <line x1="290" y1="79" x2="290" y2="100" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Point 6 -->
          <circle cx="340" cy="60" r="5" fill="#f59e0b"/>
          <line x1="340" y1="60" x2="340" y2="62" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Point 7 -->
          <circle cx="390" cy="55" r="5" fill="#f59e0b"/>
          <line x1="390" y1="44" x2="390" y2="55" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Point 8 -->
          <circle cx="430" cy="42" r="5" fill="#f59e0b"/>
          <line x1="430" y1="37" x2="430" y2="42" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Residual label -->
          <text x="305" y="95" font-size="9" fill="#ef4444">остатки rᵢ</text>
          <!-- Legend -->
          <circle cx="60" cy="192" r="5" fill="#f59e0b"/>
          <text x="72" y="196" font-size="9" fill="#334155">точки данных</text>
          <line x1="155" y1="192" x2="175" y2="192" stroke="#6366f1" stroke-width="2.5"/>
          <text x="180" y="196" font-size="9" fill="#334155">регрессионная прямая</text>
          <line x1="310" y1="192" x2="330" y2="192" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
          <text x="335" y="196" font-size="9" fill="#334155">остатки</text>
        </svg>
        <div class="caption">Линейная регрессия: прямая минимизирует сумму квадратов остатков (красные пунктирные линии от точек до прямой).</div>
      </div>

      <h3>📋 Задача линейной регрессии</h3>
      <p>У нас есть набор наблюдений: каждое — это пара (признаки, целевая величина). Признаки — это характеристики объекта (площадь квартиры, возраст клиента, температура). Целевая — число, которое мы хотим предсказать (цена, доход, продажи).</p>
      <p>Цель: найти <b>формулу</b>, которая связывает признаки с целевой:</p>
      <div class="math-block">$$\\hat{y} = w_0 + w_1 x_1 + w_2 x_2 + \\ldots + w_p x_p$$</div>

      <p>Где:</p>
      <ul>
        <li>$\\hat{y}$ — предсказание (шляпка означает «оценка»).</li>
        <li>$x_1, x_2, \\ldots, x_p$ — признаки объекта.</li>
        <li>$w_0$ — <span class="term" data-tip="Intercept / bias. Свободный член — значение y при всех x = 0. Геометрически — где прямая пересекает ось y.">intercept (свободный член)</span>.</li>
        <li>$w_1, \\ldots, w_p$ — веса признаков (насколько каждый признак влияет на y).</li>
      </ul>

      <p>Задача обучения — <b>найти веса</b> $w_0, w_1, \\ldots, w_p$, которые делают предсказания как можно ближе к истинным значениям.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Линейная регрессия предполагает, что целевая величина — это <b>взвешенная сумма</b> признаков плюс константа. Это сильное упрощение, но для многих задач оно работает удивительно хорошо и даёт очень интерпретируемую модель.</p>
      </div>

      <h3>🎯 Что значит «наилучшая прямая»</h3>
      <p>Для каждого наблюдения мы можем посчитать <b>ошибку</b>: разницу между истинным $y_i$ и предсказанием $\\hat{y}_i$. Эта ошибка называется <span class="term" data-tip="Residual. Остаток — разница между фактическим значением и предсказанием модели: r_i = y_i - ŷ_i. Показывает, как сильно модель ошиблась на этом примере.">остатком</span>: $r_i = y_i - \\hat{y}_i$.</p>
      <p>Наша цель — подобрать веса так, чтобы остатки были <b>в среднем</b> как можно меньше. Но просто «минимизировать остатки» не работает: положительные и отрицательные компенсируют друг друга.</p>
      <p>Решение: минимизировать <b>сумму квадратов</b> остатков (OLS — Ordinary Least Squares):</p>
      <div class="math-block">$$L(\\mathbf{w}) = \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 \\to \\min$$</div>

      <h3>🔍 Почему именно квадраты?</h3>
      <ul>
        <li><b>Положительность:</b> квадрат всегда ≥ 0, положительные и отрицательные ошибки не сокращаются.</li>
        <li><b>Большие ошибки штрафуются сильнее:</b> ошибка 10 даёт штраф 100, ошибка 1 — штраф 1. Модель «боится» больших промахов.</li>
        <li><b>Гладкость:</b> квадрат легко дифференцировать — удобно для оптимизации.</li>
        <li><b>Статистический смысл:</b> при нормально распределённом шуме минимизация квадратов даёт <span class="term" data-tip="Maximum Likelihood Estimation. Метод оценки параметров, максимизирующий вероятность наблюдаемых данных. Для нормального шума MLE совпадает с МНК.">максимум правдоподобия</span>.</li>
        <li><b>Аналитическое решение:</b> существует точная формула для оптимальных весов.</li>
      </ul>

      <h3>🧮 Аналитическое решение</h3>
      <p>В отличие от большинства ML-моделей, линейная регрессия имеет <b>точное</b> решение. Используя матричную запись:</p>
      <div class="math-block">$$\\mathbf{w}^* = (X^T X)^{-1} X^T y$$</div>

      <p>Это называется <span class="term" data-tip="Normal equations. Система линейных уравнений, решение которой даёт оптимальные веса линейной регрессии. Получается из условия ∇L = 0.">нормальным уравнением</span>. Одна матричная операция — и мы получаем оптимальные веса.</p>

      <p>На практике для больших данных или многих признаков используют <span class="term" data-tip="Gradient Descent. Итеративный метод оптимизации: на каждом шаге двигаемся в направлении против градиента функции потерь.">градиентный спуск</span> — дешевле по памяти.</p>

      <h3>📖 Интерпретация коэффициентов</h3>
      <p>Главное достоинство линейной регрессии — её <b>прозрачность</b>. Каждый коэффициент $w_i$ напрямую говорит: «при увеличении признака $x_i$ на 1 единицу (при прочих равных) целевая увеличится на $w_i$ единиц».</p>
      <p>Пример: если в модели цены квартир $w_{площадь} = 3$, то каждый дополнительный м² добавляет 3 тыс к цене.</p>
      <p><b>Важно:</b> «при прочих равных» — критическая оговорка. Она верна только если признаки <b>не коррелируют</b> между собой.</p>

      <h3>📊 Оценка качества модели</h3>

      <h4>MSE (Mean Squared Error) и RMSE</h4>
      <p>Среднеквадратичная ошибка: $\\text{MSE} = \\frac{1}{n}\\sum (y_i - \\hat{y}_i)^2$. RMSE = √MSE, в единицах таргета.</p>

      <h4>MAE (Mean Absolute Error)</h4>
      <p>$\\text{MAE} = \\frac{1}{n}\\sum |y_i - \\hat{y}_i|$. Устойчивее к выбросам, в единицах таргета.</p>

      <h4>R² — коэффициент детерминации</h4>
      <div class="math-block">$$R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$$</div>

      <p>Доля дисперсии, <b>объяснённая</b> моделью:</p>
      <ul>
        <li><b>R² = 1</b> — идеальная модель.</li>
        <li><b>R² = 0.8</b> — модель объясняет 80% вариации y.</li>
        <li><b>R² = 0</b> — модель не лучше, чем просто предсказывать среднее.</li>
        <li><b>R² < 0</b> — модель <b>хуже</b>, чем константа. Плохой знак!</li>
      </ul>

      <h3>📐 Предположения линейной регрессии (LINE)</h3>
      <p>Чтобы линейная регрессия давала корректные результаты (особенно доверительные интервалы и тесты), нужны 4 предположения:</p>

      <ul>
        <li><b>L — Linearity</b>: связь между X и y должна быть линейной. Если на самом деле квадратичная — линейная модель будет систематически ошибаться.</li>
        <li><b>I — Independence</b>: ошибки независимы друг от друга. Нарушается, например, во временных рядах.</li>
        <li><b>N — Normality</b>: ошибки распределены нормально. Нужно для p-value и доверительных интервалов, но не для самих предсказаний.</li>
        <li><b>E — Equal variance (гомоскедастичность)</b>: дисперсия ошибок одинакова во всех точках. <span class="term" data-tip="Heteroscedasticity. Ситуация, когда разброс ошибок зависит от значения x. Например, больший разброс для больших x. Нарушает стандартные формулы для стандартных ошибок.">Гетероскедастичность</span> — нарушение этого.</li>
      </ul>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li>Максимальная интерпретируемость.</li>
        <li>Аналитическое решение.</li>
        <li>Быстрое обучение.</li>
        <li>Мало данных достаточно.</li>
        <li>Легко добавить регуляризацию (Ridge, Lasso).</li>
        <li>Часто хороший baseline.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li>Только линейные зависимости (без feature engineering).</li>
        <li>Чувствительна к выбросам.</li>
        <li>Проблемы с <span class="term" data-tip="Multicollinearity. Ситуация, когда признаки сильно коррелируют. Делает веса нестабильными и трудными в интерпретации.">мультиколлинеарностью</span>.</li>
        <li>Плохо экстраполирует (вне обучающего диапазона).</li>
      </ul>

      <h3>🧭 Когда использовать и альтернативы</h3>
      <table>
        <tr><th>Ситуация</th><th>Линейная регрессия</th><th>Альтернатива</th></tr>
        <tr><td>Мало данных (< 1000), нужна интерпретация</td><td><b>✅ Лучший выбор</b></td><td>—</td></tr>
        <tr><td>Нелинейные зависимости</td><td>Полиномиальные признаки</td><td>Деревья, Random Forest, GB</td></tr>
        <tr><td>Много признаков, переобучение</td><td>Ridge / Lasso</td><td>Elastic Net</td></tr>
        <tr><td>Выбросы в данных</td><td>Huber регрессия</td><td>Деревья (устойчивы)</td></tr>
        <tr><td>Большие данные + максимальная точность</td><td>Как бейзлайн</td><td>XGBoost, LightGBM, CatBoost</td></tr>
      </table>
      <p>Линейная регрессия — всегда хороший <b>бейзлайн</b>. Если она уже работает хорошо — более сложные модели не нужны.</p>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Линейная регрессия работает только с линейными связями»</b> — можно включить $x^2$, $\\log(x)$, взаимодействия как новые признаки. Модель «линейна по параметрам», а не по признакам.</li>
        <li><b>«Низкий R² = плохая модель»</b> — не всегда. В социальных науках R² = 0.3 может быть отличным результатом.</li>
        <li><b>«Высокий R² = модель хорошая»</b> — может быть переобученной. Смотри на test R².</li>
        <li><b>«Большой коэффициент = важный признак»</b> — зависит от масштаба признака. Сравнивай стандартизированные коэффициенты.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: полиномиальная и нелинейные расширения</summary>
        <div class="deep-dive-body">
          <p>Линейная регрессия не обязана быть линейной в признаках! Можно добавить:</p>
          <ul>
            <li><b>Полиномиальные признаки:</b> $y = w_0 + w_1 x + w_2 x^2 + w_3 x^3$. Ловит кривые зависимости.</li>
            <li><b>Логарифмы:</b> $y = w_0 + w_1 \\log(x)$. Для экспоненциальных зависимостей.</li>
            <li><b>Взаимодействия:</b> $y = w_0 + w_1 x_1 + w_2 x_2 + w_3 x_1 x_2$. Когда эффект одного признака зависит от другого.</li>
            <li><b>Сплайны, GAM</b> — ещё более гибкие расширения.</li>
          </ul>
          <p>Главное — модель остаётся <b>линейной по параметрам</b> $w$, что сохраняет все удобства (аналитическое решение, интерпретация).</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: диагностика модели</summary>
        <div class="deep-dive-body">
          <p>Проверки, которые нужно делать перед доверием к модели:</p>
          <ul>
            <li><b>Residual plot</b> — график остатков vs предсказаний. Должно быть случайное облако. Если видишь паттерн — модель что-то не ловит.</li>
            <li><b>Q-Q plot остатков</b> — проверка нормальности.</li>
            <li><b>VIF (Variance Inflation Factor)</b> — диагностика мультиколлинеарности. VIF > 10 — проблема.</li>
            <li><b>Outlier detection</b> — Cook's distance, leverage.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: геометрическая интуиция</summary>
        <div class="deep-dive-body">
          <p>С точки зрения линейной алгебры, линейная регрессия — это <b>проекция</b> вектора $y$ на подпространство, натянутое на столбцы матрицы $X$. Предсказание $\\hat{y} = Xw$ — это ближайшая к $y$ точка в этом подпространстве.</p>
          <p>Остатки $r = y - \\hat{y}$ <b>ортогональны</b> подпространству $X$. Это геометрическая причина, почему OLS работает: мы выбираем такое $\\hat{y}$, что $y - \\hat{y}$ перпендикулярен всем признакам.</p>
          <p>Именно из этой ортогональности выводится нормальное уравнение $X^T(y - Xw) = 0$.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Логистическая регрессия</b> — обобщение для классификации.</li>
        <li><b>Регуляризация (Ridge, Lasso)</b> — борется с переобучением и мультиколлинеарностью.</li>
        <li><b>Градиентный спуск</b> — альтернативный способ поиска весов.</li>
        <li><b>Нейронные сети</b> — один «нейрон» это и есть линейная регрессия.</li>
        <li><b>Bias-variance</b> — линейная регрессия имеет высокий bias, низкую variance.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Цена квартиры от площади',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По 5 квартирам найти линейную зависимость цены от площади и вычислить коэффициенты аналитически.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Площадь x (м²)</th><th>30</th><th>40</th><th>50</th><th>60</th><th>70</th></tr>
              <tr><th>Цена y (тыс.)</th><td>90</td><td>120</td><td>140</td><td>170</td><td>200</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить средние</h4>
            <div class="calc">x̄ = (30+40+50+60+70)/5 = 250/5 = <b>50</b></div>
            <div class="calc">ȳ = (90+120+140+170+200)/5 = 720/5 = <b>144</b></div>
            <div class="why">Центрируем данные, чтобы работать с отклонениями от среднего.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить Cov(x, y) и Var(x)</h4>
            <div class="calc">
              Cov(x,y) = Σ(xᵢ−x̄)(yᵢ−ȳ) / (n−1)<br>
              = [(30−50)(90−144) + (40−50)(120−144) + (50−50)(140−144) + (60−50)(170−144) + (70−50)(200−144)] / 4<br>
              = [(-20)(-54) + (-10)(-24) + (0)(-4) + (10)(26) + (20)(56)] / 4<br>
              = [1080 + 240 + 0 + 260 + 1120] / 4 = 2700/4 = <b>675</b>
            </div>
            <div class="calc">
              Var(x) = Σ(xᵢ−x̄)² / (n−1)<br>
              = [400 + 100 + 0 + 100 + 400] / 4 = 1000/4 = <b>250</b>
            </div>
            <div class="why">Ковариация показывает совместное изменение x и y. Дисперсия нормирует на разброс x.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: найти коэффициенты</h4>
            <div class="calc">
              ŵ₁ = Cov(x,y) / Var(x) = 675 / 250 = <b>2.7</b><br>
              ŵ₀ = ȳ − ŵ₁·x̄ = 144 − 2.7 · 50 = 144 − 135 = <b>9</b>
            </div>
            <div class="why">Наклон прямой: при росте площади на 1 м² цена растёт на 2.7 тыс. Сдвиг: начальная цена при нулевой площади (теоретически).</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: проверить предсказания</h4>
            <div class="calc">
              ŷ(30) = 9 + 2.7·30 = 9 + 81 = 90 ✓<br>
              ŷ(50) = 9 + 2.7·50 = 9 + 135 = 144 (факт 140, ошибка +4)<br>
              ŷ(70) = 9 + 2.7·70 = 9 + 189 = 198 (факт 200, ошибка −2)
            </div>
            <div class="why">Линейная модель проходит через центр тяжести (x̄, ȳ) и минимизирует сумму квадратов ошибок.</div>
          </div>
          <div class="illustration bordered">
            <svg viewBox="0 0 420 165" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Цена квартиры = 9 + 2.7 · площадь</text>
              <!-- Axes -->
              <line x1="55" y1="20" x2="55" y2="140" stroke="#64748b" stroke-width="1.5"/>
              <line x1="55" y1="140" x2="400" y2="140" stroke="#64748b" stroke-width="1.5"/>
              <!-- Axis labels -->
              <text x="228" y="158" text-anchor="middle" font-size="10" fill="#64748b">Площадь (м²)</text>
              <text x="22" y="85" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,22,85)">Цена (тыс.)</text>
              <!-- X ticks: 30, 40, 50, 60, 70 → mapped to x=97, 159, 221, 283, 345 -->
              <text x="97" y="152" text-anchor="middle" font-size="9" fill="#64748b">30</text>
              <text x="159" y="152" text-anchor="middle" font-size="9" fill="#64748b">40</text>
              <text x="221" y="152" text-anchor="middle" font-size="9" fill="#64748b">50</text>
              <text x="283" y="152" text-anchor="middle" font-size="9" fill="#64748b">60</text>
              <text x="345" y="152" text-anchor="middle" font-size="9" fill="#64748b">70</text>
              <!-- Y ticks: 90,120,140,170,200 → mapped (200=y30, 90=y129) scale: 1 unit = 0.9px, y=140-val*0.9+81 -->
              <!-- y=140-(val-90)*0.6 : 90→116, 120→98, 140→86, 170→68, 200→50 -->
              <text x="50" y="119" text-anchor="end" font-size="9" fill="#64748b">90</text>
              <text x="50" y="101" text-anchor="end" font-size="9" fill="#64748b">120</text>
              <text x="50" y="89" text-anchor="end" font-size="9" fill="#64748b">140</text>
              <text x="50" y="71" text-anchor="end" font-size="9" fill="#64748b">170</text>
              <text x="50" y="53" text-anchor="end" font-size="9" fill="#64748b">200</text>
              <!-- Fitted line: y(30)=90→(97,119), y(70)=198→(345,52) -->
              <line x1="75" y1="126" x2="370" y2="49" stroke="#3b82f6" stroke-width="2.5"/>
              <text x="355" y="44" font-size="9" fill="#3b82f6">ŷ = 9 + 2.7x</text>
              <!-- Data points (30,90),(40,120),(50,140),(60,170),(70,200) -->
              <circle cx="97" cy="119" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <circle cx="159" cy="101" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <circle cx="221" cy="89" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <circle cx="283" cy="71" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <circle cx="345" cy="53" r="6" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
              <!-- Residual lines (from point to line) -->
              <line x1="221" y1="89" x2="221" y2="83" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
              <line x1="283" y1="71" x2="283" y2="65" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2"/>
            </svg>
            <div class="caption">5 точек (жёлтые) с подогнанной прямой (синяя). Красные пунктиры — остатки (residuals). Прямая проходит через центр тяжести (50, 144).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Модель: <b>цена = 9 + 2.7 · площадь</b>. За каждый лишний м² квартира дорожает на 2700 руб.</p>
          </div>
          <div class="lesson-box">
            Формулы для наклона и смещения — это аналитическое решение нормального уравнения (XᵀX)⁻¹Xᵀy. Для одного признака оно сводится к отношению ковариации к дисперсии.
          </div>
        `,
      },
      {
        title: 'Предсказание и R²',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Используя модель «цена = 9 + 2.7·площадь», сделать предсказания и оценить качество через R².</p>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: предсказания для известных и новых точек</h4>
            <div class="calc">
              Квартира 45 м²: ŷ = 9 + 2.7·45 = 9 + 121.5 = <b>130.5 тыс.</b><br>
              Квартира 55 м²: ŷ = 9 + 2.7·55 = 9 + 148.5 = <b>157.5 тыс.</b><br>
              Квартира 80 м²: ŷ = 9 + 2.7·80 = 9 + 216 = <b>225 тыс.</b> (экстраполяция!)
            </div>
            <div class="why">80 м² выходит за диапазон обучения [30–70], поэтому предсказание менее надёжно.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить остатки (residuals)</h4>
            <div class="example-data-table">
              <table>
                <tr><th>x</th><th>y (факт)</th><th>ŷ (пред.)</th><th>eᵢ = y−ŷ</th><th>eᵢ²</th></tr>
                <tr><td>30</td><td>90</td><td>90</td><td>0</td><td>0</td></tr>
                <tr><td>40</td><td>120</td><td>117</td><td>+3</td><td>9</td></tr>
                <tr><td>50</td><td>140</td><td>144</td><td>−4</td><td>16</td></tr>
                <tr><td>60</td><td>170</td><td>171</td><td>−1</td><td>1</td></tr>
                <tr><td>70</td><td>200</td><td>198</td><td>+2</td><td>4</td></tr>
              </table>
            </div>
            <div class="calc">SSres = 0 + 9 + 16 + 1 + 4 = <b>30</b></div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: вычислить SStot</h4>
            <div class="calc">
              ȳ = 144<br>
              SStot = Σ(yᵢ−ȳ)² = (90−144)² + (120−144)² + (140−144)² + (170−144)² + (200−144)²<br>
              = 2916 + 576 + 16 + 676 + 3136 = <b>7320</b>
            </div>
            <div class="why">SStot — полный разброс данных вокруг среднего, который нужно объяснить.</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: R²</h4>
            <div class="calc">
              R² = 1 − SSres / SStot = 1 − 30 / 7320 = 1 − 0.0041 = <b>0.9959</b>
            </div>
            <div class="why">R² близко к 1 — модель объясняет 99.6% дисперсии цен. Для 5 точек это ожидаемо хорошо.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>R² = 0.996 — отличное качество. MSE = 30/5 = 6, RMSE = 2.45 тыс. руб. — средняя ошибка предсказания.</p>
          </div>
          <div class="lesson-box">
            R² ∈ [0, 1] при разумной модели. R² = 0 означает, что модель не лучше константы ȳ. R² &lt; 0 возможно, если модель хуже константы (например, использовали неправильные коэффициенты).
          </div>
        `,
      },
      {
        title: 'Когда линейная не работает',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, что линейная регрессия плохо справляется с нелинейными данными (например, синусоида).</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>x</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
              <tr><th>y = sin(x)</th><td>0.00</td><td>0.84</td><td>0.91</td><td>0.14</td><td>−0.76</td><td>−0.96</td><td>−0.28</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: подогнать линейную модель</h4>
            <div class="calc">
              x̄ = 3, ȳ ≈ −0.016<br>
              Cov(x,y) ≈ −0.47, Var(x) = 4<br>
              ŵ₁ = −0.47/4 ≈ −0.117<br>
              ŵ₀ ≈ −0.016 − (−0.117)·3 ≈ 0.336<br>
              Линейная модель: ŷ = 0.336 − 0.117·x
            </div>
            <div class="why">Линейная модель ищет наилучшую прямую, но синус — это волна.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: сравнить предсказания</h4>
            <div class="example-data-table">
              <table>
                <tr><th>x</th><th>y факт</th><th>ŷ линейная</th><th>ошибка</th></tr>
                <tr><td>0</td><td>0.00</td><td>0.34</td><td>0.34</td></tr>
                <tr><td>2</td><td>0.91</td><td>0.10</td><td>0.81</td></tr>
                <tr><td>4</td><td>−0.76</td><td>−0.13</td><td>0.63</td></tr>
                <tr><td>6</td><td>−0.28</td><td>−0.37</td><td>0.09</td></tr>
              </table>
            </div>
            <div class="calc">R² ≈ 0.11 — модель объясняет лишь 11% дисперсии.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: что делать?</h4>
            <div class="calc">
              Вариант А — добавить признаки: x, x², x³, sin(x)<br>
              Вариант Б — полиномиальная регрессия степени 7 даст R²≈1<br>
              Вариант В — нелинейные модели: деревья, нейросети
            </div>
            <div class="why">Полиномиальная регрессия остаётся линейной по параметрам — просто добавляем новые столбцы в матрицу X.</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: опасность переобучения</h4>
            <div class="calc">
              7 точек + полином степени 6 → идеальная интерполяция, но<br>
              на новых данных x=6.5: полином может дать −5 или +10<br>
              sin(6.5) = 0.28 — полином ошибается катастрофически
            </div>
            <div class="why">Без регуляризации сложная модель «запоминает» данные, но плохо обобщается.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Линейная регрессия на синусоиде даёт R² ≈ 0.11. Диагностика: residual plot покажет ярко выраженный паттерн (волну) вместо случайного шума — сигнал нелинейности.</p>
          </div>
          <div class="lesson-box">
            Всегда строй residual plot. Если остатки образуют паттерн (U-форма, волна) — линейная модель неверна. Добавь нелинейные признаки или смени модель.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: подбор прямой</h3>
        <p>Управляй углом, сдвигом, шумом и количеством точек. Наблюдай, как меняется MSE и R².</p>
        <div class="sim-container">
          <div class="sim-controls" id="lr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="lr-regen">🔄 Новые данные</button>
            <button class="btn secondary" id="lr-fit">✓ Подогнать оптимально</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="lr-chart"></canvas></div>
            <div class="sim-stats" id="lr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#lr-controls');
        const cTrueW = App.makeControl('range', 'lr-true-w', 'Истинный наклон', { min: -3, max: 3, step: 0.1, value: 1.5 });
        const cTrueB = App.makeControl('range', 'lr-true-b', 'Истинный сдвиг', { min: -5, max: 5, step: 0.5, value: 2 });
        const cNoise = App.makeControl('range', 'lr-noise', 'Шум σ', { min: 0, max: 5, step: 0.1, value: 1.5 });
        const cN = App.makeControl('range', 'lr-n', 'Число точек', { min: 10, max: 200, step: 5, value: 50 });
        const cGuessW = App.makeControl('range', 'lr-guess-w', 'Наш наклон $\\hat{w}$', { min: -3, max: 3, step: 0.05, value: 1 });
        const cGuessB = App.makeControl('range', 'lr-guess-b', 'Наш сдвиг $\\hat{b}$', { min: -5, max: 5, step: 0.1, value: 0 });
        [cTrueW, cTrueB, cNoise, cN, cGuessW, cGuessB].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;
        let dataX = [], dataY = [];

        function regenerate() {
          const w = +cTrueW.input.value;
          const b = +cTrueB.input.value;
          const sigma = +cNoise.input.value;
          const n = +cN.input.value;
          dataX = []; dataY = [];
          for (let i = 0; i < n; i++) {
            const x = Math.random() * 10 - 5;
            const y = w * x + b + App.Util.randn(0, sigma);
            dataX.push(x);
            dataY.push(y);
          }
          update();
        }

        function fitOptimal() {
          // Аналитическое решение
          const mx = App.Util.mean(dataX), my = App.Util.mean(dataY);
          let num = 0, den = 0;
          for (let i = 0; i < dataX.length; i++) {
            num += (dataX[i] - mx) * (dataY[i] - my);
            den += (dataX[i] - mx) ** 2;
          }
          const w = num / den;
          const b = my - w * mx;
          cGuessW.input.value = w.toFixed(2);
          cGuessB.input.value = b.toFixed(2);
          cGuessW.wrap.querySelector('.value-display').textContent = w.toFixed(2);
          cGuessB.wrap.querySelector('.value-display').textContent = b.toFixed(2);
          update();
        }

        function update() {
          const gw = +cGuessW.input.value;
          const gb = +cGuessB.input.value;

          // предсказания + ошибки
          const preds = dataX.map((x) => gw * x + gb);
          let mse = 0, ssRes = 0, ssTot = 0;
          const my = App.Util.mean(dataY);
          for (let i = 0; i < dataX.length; i++) {
            const e = dataY[i] - preds[i];
            mse += e * e;
            ssRes += e * e;
            ssTot += (dataY[i] - my) ** 2;
          }
          mse /= dataX.length;
          const r2 = 1 - ssRes / ssTot;

          const lineXs = [-5, 5];
          const lineYs = lineXs.map((x) => gw * x + gb);

          const ctx = container.querySelector('#lr-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                {
                  label: 'Данные',
                  data: dataX.map((x, i) => ({ x, y: dataY[i] })),
                  backgroundColor: 'rgba(59, 130, 246, 0.55)',
                  pointRadius: 4,
                },
                {
                  type: 'line',
                  label: 'Наша прямая',
                  data: lineXs.map((x, i) => ({ x, y: lineYs[i] })),
                  borderColor: '#dc2626',
                  borderWidth: 2.5,
                  pointRadius: 0,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: {
                x: { type: 'linear', title: { display: true, text: 'X' }, min: -5, max: 5 },
                y: { title: { display: true, text: 'Y' }, min: -20, max: 20 },
              },
            },
          });
          App.registerChart(chart);

          const statsEl = container.querySelector('#lr-stats');
          statsEl.innerHTML = '';
          const cards = [
            ['MSE', App.Util.round(mse, 3)],
            ['RMSE', App.Util.round(Math.sqrt(mse), 3)],
            ['R²', App.Util.round(r2, 3)],
            ['Истинный w', cTrueW.input.value],
            ['Наш ŵ', gw.toFixed(2)],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            statsEl.appendChild(card);
          });
        }

        [cTrueW, cTrueB, cNoise, cN].forEach((c) => c.input.addEventListener('input', regenerate));
        [cGuessW, cGuessB].forEach((c) => c.input.addEventListener('input', update));
        container.querySelector('#lr-regen').onclick = regenerate;
        container.querySelector('#lr-fit').onclick = fitOptimal;
        regenerate();
      },
    },

    python: `
      <h3>Python: линейная регрессия</h3>
      <p>sklearn.LinearRegression реализует МНК, а numpy позволяет воспроизвести OLS вручную через матричные операции.</p>

      <h4>1. sklearn LinearRegression и оценка качества</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.datasets import load_diabetes

# Датасет о диабете — регрессионная задача
data = load_diabetes()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print(f'R²: {r2_score(y_test, y_pred):.4f}')
print(f'RMSE: {mean_squared_error(y_test, y_pred)**0.5:.2f}')
print(f'Коэффициенты: {dict(zip(data.feature_names, model.coef_.round(1)))}')
print(f'Intercept: {model.intercept_:.2f}')

# Предсказанные vs реальные
plt.scatter(y_test, y_pred, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel('Реальные значения')
plt.ylabel('Предсказанные')
plt.title('Linear Regression: pred vs true')
plt.show()</code></pre>

      <h4>2. Ручной МНК через numpy</h4>
      <pre><code># Формула МНК: w = (X^T X)^{-1} X^T y
np.random.seed(42)
X_simple = np.random.randn(100, 1)
y_simple = 3.5 * X_simple.ravel() + 2.0 + np.random.randn(100) * 0.5

# Добавляем столбец из единиц для intercept
X_aug = np.column_stack([np.ones(len(X_simple)), X_simple])

# OLS в матричной форме
w = np.linalg.inv(X_aug.T @ X_aug) @ X_aug.T @ y_simple
print(f'Intercept (ручной): {w[0]:.4f}')
print(f'Slope (ручной):     {w[1]:.4f}')

# Сравниваем с sklearn
lr = LinearRegression().fit(X_simple, y_simple)
print(f'Intercept (sklearn): {lr.intercept_:.4f}')
print(f'Slope (sklearn):     {lr.coef_[0]:.4f}')

# Визуализация
x_line = np.linspace(-3, 3, 100)
plt.scatter(X_simple, y_simple, alpha=0.4)
plt.plot(x_line, w[0] + w[1]*x_line, 'r-', label='OLS (numpy)')
plt.legend()
plt.title('Линейная регрессия: ручной МНК')
plt.show()</code></pre>

      <h4>3. Множественная регрессия с анализом остатков</h4>
      <pre><code>from sklearn.preprocessing import StandardScaler

# Масштабируем для сравнимости коэффициентов
scaler = StandardScaler()
X_scaled = scaler.fit_transform(data.data)
model2 = LinearRegression().fit(X_scaled, data.target)

# Важность признаков по абсолютному коэффициенту
importance = sorted(zip(data.feature_names, np.abs(model2.coef_)),
                    key=lambda x: x[1], reverse=True)
names, vals = zip(*importance)
plt.barh(names, vals)
plt.xlabel('|коэффициент|')
plt.title('Важность признаков (стандартизованные)')
plt.tight_layout()
plt.show()

# Анализ остатков
residuals = data.target - model2.predict(X_scaled)
plt.scatter(model2.predict(X_scaled), residuals, alpha=0.4)
plt.axhline(0, color='red', linestyle='--')
plt.xlabel('Предсказанные')
plt.ylabel('Остатки')
plt.title('График остатков')
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Прогноз цен</b> — недвижимость, товары, акции (как базовая модель).</li>
        <li><b>Экономика и эконометрика</b> — влияние факторов на ВВП, инфляцию.</li>
        <li><b>Биостатистика</b> — зависимости показателей здоровья от возраста, веса.</li>
        <li><b>Маркетинг</b> — влияние бюджета рекламы на продажи.</li>
        <li><b>Baseline в ML</b> — всегда начинают с неё, чтоб понять, нужна ли сложная модель.</li>
        <li><b>Intrepretability</b> — когда важно объяснить, почему модель выдаёт прогноз.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Максимально интерпретируема</li>
            <li>Аналитическое решение (не нужна итерация)</li>
            <li>Быстро обучается, быстро предсказывает</li>
            <li>Мало данных достаточно</li>
            <li>Легко добавлять регуляризацию (Ridge, Lasso)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Ловит только линейные зависимости</li>
            <li>Чувствительна к выбросам</li>
            <li>Требует отсутствия мультиколлинеарности</li>
            <li>Предполагает константную дисперсию ошибок (гомоскедастичность)</li>
            <li>Предполагает независимость ошибок</li>
          </ul>
        </div>
      </div>
    `,

    extra: `
      <h3>Предположения линейной регрессии (LINE)</h3>
      <ul>
        <li><b>L</b>inearity — связь между X и y линейна.</li>
        <li><b>I</b>ndependence — ошибки независимы.</li>
        <li><b>N</b>ormality — ошибки распределены нормально (важно для CI и p-value).</li>
        <li><b>E</b>qual variance — гомоскедастичность.</li>
      </ul>

      <h3>Диагностика</h3>
      <ul>
        <li><b>Residual plot</b> — ошибки должны быть случайным облаком без паттернов.</li>
        <li><b>Q-Q plot ошибок</b> — для проверки нормальности.</li>
        <li><b>VIF</b> — для детекции мультиколлинеарности (VIF > 10 — плохо).</li>
      </ul>

      <h3>Когда линейной недостаточно</h3>
      <ul>
        <li><b>Полиномиальная регрессия</b> — добавить $x^2, x^3$, остаётся линейной по параметрам.</li>
        <li><b>Сплайны</b> — кусочно-полиномиальные.</li>
        <li><b>GAM</b> — обобщённые аддитивные модели.</li>
        <li><b>Нелинейные модели</b> — деревья, ядра, нейросети.</li>
      </ul>

      <h3>Ridge vs Lasso</h3>
      <ul>
        <li><b>Ridge</b> — сжимает все коэффициенты, но не зануляет. Хорошо при мультиколлинеарности.</li>
        <li><b>Lasso</b> — зануляет некоторые коэффициенты → feature selection.</li>
        <li><b>ElasticNet</b> — комбинация обоих.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=nk2CQITm_eo" target="_blank">StatQuest: Linear Regression</a> — разбор линейной регрессии с нуля</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data" target="_blank">Khan Academy: Linear Regression</a> — интерактивный курс по регрессии и корреляции</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html" target="_blank">sklearn: LinearRegression</a> — документация линейной регрессии в sklearn</li>
      </ul>
    `,
  },
});
