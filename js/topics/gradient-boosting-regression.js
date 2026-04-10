/* ==========================================================================
   Gradient Boosting для регрессии
   ========================================================================== */
App.registerTopic({
  id: 'gradient-boosting-reg',
  category: 'ml-reg',
  title: 'Gradient Boosting для регрессии',
  summary: 'Последовательные деревья исправляют остатки — самое естественное применение бустинга.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты скульптор, и работаешь с глиной. Ты лепишь грубую форму — скажем, голову. Потом смотришь: нос слишком большой, левое ухо не закончено, подбородок слишком острый. Ты <b>исправляешь</b> самые грубые недостатки, лепишь поправки. Снова смотришь — осталась мелкая бахрома, небольшая асимметрия. Исправляешь их. И так итерация за итерацией, пока скульптура не станет точной.</p>
        <p>Gradient Boosting для регрессии работает точно так же. Начинаем с грубого предсказания (среднее y). Смотрим, где ошиблись — это <b>остатки</b> (residuals). Обучаем дерево предсказывать эти остатки. Добавляем к модели. Снова смотрим на остатки — они уменьшились. Строим ещё одно дерево. Повторяем сотни раз.</p>
        <p>Это <b>самое естественное применение бустинга</b>: в регрессии остатки — просто числа, и дерево может учиться на них напрямую. При классификации градиент чуть сложнее, но идея та же.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <text x="270" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Gradient Boosting регрессия: исправление остатков</text>
          <!-- Stage 0 -->
          <rect x="15" y="28" width="100" height="85" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="65" y="45" text-anchor="middle" font-size="9" font-weight="600" fill="#475569">F₀(x)</text>
          <text x="65" y="60" text-anchor="middle" font-size="9" fill="#64748b">= ȳ = 50</text>
          <text x="65" y="76" text-anchor="middle" font-size="9" fill="#ef4444">r₁ = y − 50</text>
          <text x="65" y="92" text-anchor="middle" font-size="8" fill="#64748b">ошибка: большая</text>
          <!-- Arrow -->
          <line x1="118" y1="70" x2="135" y2="70" stroke="#64748b" stroke-width="1.5" marker-end="url(#gbr_arr)"/>
          <!-- Stage 1 -->
          <rect x="138" y="28" width="115" height="85" rx="6" fill="#eff6ff" stroke="#6366f1" stroke-width="1.5"/>
          <text x="195" y="45" text-anchor="middle" font-size="9" font-weight="600" fill="#6366f1">h₁(x) учится на r₁</text>
          <text x="195" y="60" text-anchor="middle" font-size="9" fill="#475569">F₁ = F₀ + η·h₁</text>
          <text x="195" y="75" text-anchor="middle" font-size="9" fill="#475569">= 50 + 0.1·h₁(x)</text>
          <text x="195" y="91" text-anchor="middle" font-size="9" fill="#ef4444">r₂ = y − F₁</text>
          <text x="195" y="106" text-anchor="middle" font-size="8" fill="#64748b">ошибка: меньше</text>
          <!-- Arrow -->
          <line x1="256" y1="70" x2="273" y2="70" stroke="#64748b" stroke-width="1.5" marker-end="url(#gbr_arr)"/>
          <!-- Stage 2 -->
          <rect x="276" y="28" width="115" height="85" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
          <text x="333" y="45" text-anchor="middle" font-size="9" font-weight="600" fill="#10b981">h₂(x) учится на r₂</text>
          <text x="333" y="60" text-anchor="middle" font-size="9" fill="#475569">F₂ = F₁ + η·h₂</text>
          <text x="333" y="75" text-anchor="middle" font-size="9" fill="#475569">= F₁ + 0.1·h₂(x)</text>
          <text x="333" y="91" text-anchor="middle" font-size="9" fill="#ef4444">r₃ = y − F₂</text>
          <text x="333" y="106" text-anchor="middle" font-size="8" fill="#64748b">ошибка: ещё меньше</text>
          <!-- Arrow -->
          <line x1="394" y1="70" x2="411" y2="70" stroke="#64748b" stroke-width="1.5" marker-end="url(#gbr_arr)"/>
          <!-- Stage M -->
          <rect x="414" y="28" width="110" height="85" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="469" y="45" text-anchor="middle" font-size="9" font-weight="600" fill="#d97706">... M итераций</text>
          <text x="469" y="62" text-anchor="middle" font-size="9" fill="#475569">Fₘ = Σ η·hₜ</text>
          <text x="469" y="78" text-anchor="middle" font-size="9" fill="#10b981">rₘ ≈ 0</text>
          <text x="469" y="96" text-anchor="middle" font-size="8" fill="#64748b">ошибка: минимум</text>
          <!-- Bottom formula -->
          <rect x="130" y="143" width="280" height="26" rx="5" fill="#6366f1"/>
          <text x="270" y="160" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">Fₘ(x) = F₀ + η·Σ hₜ(x), t=1..M</text>
          <!-- Arrows to formula -->
          <line x1="65" y1="132" x2="200" y2="142" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
          <line x1="270" y1="132" x2="270" y2="142" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
          <line x1="469" y1="132" x2="340" y2="142" stroke="#64748b" stroke-width="1" stroke-dasharray="4,3"/>
          <!-- Convergence chart -->
          <text x="270" y="200" text-anchor="middle" font-size="9" fill="#64748b">MSE: ████████ → ████ → ██ → █ — уменьшается с каждой итерацией</text>
          <defs>
            <marker id="gbr_arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">Gradient Boosting регрессия: $F_0 = \\bar{y}$, затем каждое дерево $h_t$ обучается предсказывать остатки $r_t = y - F_{t-1}(x)$. Финальная модель — сумма всех деревьев с шагом $\\eta$.</div>
      </div>

      <h3>📐 Алгоритм: шаг за шагом</h3>
      <p>Классический Gradient Boosting (Friedman, 2001) для регрессии с потерями MSE:</p>
      <ol>
        <li><b>Инициализация:</b> $F_0(x) = \\bar{y}$ (среднее всех $y_i$).</li>
        <li><b>Для каждой итерации $m = 1, \\ldots, M$:</b>
          <ul>
            <li>Вычисляем <span class="term" data-tip="Pseudo-residuals. В случае MSE совпадают с обычными остатками y − F(x). Для других функций потерь — это отрицательный градиент loss по предсказанию.">псевдо-остатки</span>: $r_i^{(m)} = y_i - F_{m-1}(x_i)$</li>
            <li>Обучаем дерево $h_m(x)$ предсказывать $r_i^{(m)}$</li>
            <li>Обновляем модель: $F_m(x) = F_{m-1}(x) + \\eta \\cdot h_m(x)$</li>
          </ul>
        </li>
        <li><b>Предсказание:</b> $\\hat{y} = F_M(x) = \\bar{y} + \\eta\\sum_{m=1}^{M} h_m(x)$</li>
      </ol>
      <p>При MSE псевдо-остатки = обычные остатки. Это делает регрессию <b>самым простым случаем</b> Gradient Boosting.</p>

      <div class="key-concept">
        <div class="kc-label">Почему «Градиентный» Boosting</div>
        <p>Для MSE: $L = \\frac{1}{2}(y - F)^2$. Отрицательный градиент: $-\\frac{\\partial L}{\\partial F} = y - F = r$. То есть для MSE остатки = отрицательный градиент функции потерь. Мы делаем <b>градиентный спуск в пространстве функций</b>, а не в пространстве параметров. Для других функций потерь (MAE, Huber) псевдо-остатки отличаются — отсюда и название.</p>
      </div>

      <h3>📉 Learning rate η — скорость обучения</h3>
      <p>Без η каждое новое дерево полностью «закрывало» бы остатки — быстро, но переобучение. С η мы <b>замедляем</b> исправление:</p>
      <div class="math-block">$$F_m = F_{m-1} + \\eta \\cdot h_m$$</div>
      <ul>
        <li><b>η = 1.0:</b> полный шаг. После одного дерева остатки = 0 (если дерево идеально). Риск переобучения огромный.</li>
        <li><b>η = 0.1:</b> исправляем 10% остатков за шаг. Нужно ~10× больше деревьев. Лучше обобщает.</li>
        <li><b>η = 0.01:</b> медленно, нужны тысячи деревьев, но обычно лучшая точность при правильном числе итераций.</li>
      </ul>
      <p><b>Правило:</b> уменьши η → увеличь n_estimators. Компромисс: η=0.05, n=500 часто оптимален.</p>

      <h3>🛡️ Борьба с переобучением</h3>
      <p>Gradient Boosting легко переобучается. Три главных инструмента:</p>
      <ul>
        <li><b>Малый η + early stopping:</b> валидационная ошибка перестала падать → стоп.</li>
        <li><b>max_depth=3–5:</b> неглубокие деревья («пни»). Глубокие деревья переобучаются быстро.</li>
        <li><b>subsample &lt; 1.0:</b> каждое дерево обучается на случайной подвыборке строк (Stochastic GB). Типично subsample=0.8.</li>
        <li><b>max_features &lt; 1.0:</b> случайные признаки, как в Random Forest. Типично 0.8 или 'sqrt'.</li>
      </ul>

      <h3>🎯 Huber Loss — устойчивость к выбросам</h3>
      <p>MSE квадратично штрафует выбросы. Для зашумлённых данных лучше работает <span class="term" data-tip="Huber Loss. Гибрид MSE и MAE: квадратичный при малых ошибках (|r| ≤ δ) и линейный при больших. Устойчив к выбросам, но дифференцируем.">функция потерь Хьюбера</span>:</p>
      <div class="math-block">$$L_\\delta(r) = \\begin{cases} \\frac{1}{2}r^2, & |r| \\leq \\delta \\\\ \\delta(|r| - \\delta/2), & |r| > \\delta \\end{cases}$$</div>
      <p>Псевдо-остатки для Huber Loss:</p>
      <div class="math-block">$$r_i = \\begin{cases} y_i - F(x_i), & |y_i - F(x_i)| \\leq \\delta \\\\ \\delta \\cdot \\text{sign}(y_i - F(x_i)), & |y_i - F(x_i)| > \\delta \\end{cases}$$</div>
      <p>В sklearn: <code>GradientBoostingRegressor(loss='huber', alpha=0.9)</code>, где alpha — квантиль для отсечения выбросов.</p>

      <h3>🚀 XGBoost / LightGBM для регрессии</h3>
      <p>Современные реализации Gradient Boosting добавляют ряд улучшений:</p>
      <ul>
        <li><b>XGBoost:</b> второй порядок Тейлора (используется и гессиан), регуляризация листьев ($\\lambda$, $\\gamma$). Быстрее sklearn-овской версии.</li>
        <li><b>LightGBM:</b> leaf-wise рост деревьев (а не level-wise). Работает с категориальными признаками напрямую. Очень быстрый на больших данных.</li>
        <li><b>CatBoost:</b> специально оптимизирован для категориальных признаков, симметричные деревья, обработка временных данных.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: Stochastic Gradient Boosting</summary>
        <div class="deep-dive-body">
          <p>Идея Friedman (2002): на каждой итерации обучать дерево не на всех данных, а на случайной подвыборке (subsample) без возвращения. Этот вариант называется <b>Stochastic Gradient Boosting</b>.</p>
          <p>Зачем?</p>
          <ul>
            <li>Деревья менее коррелированы → снижение variance (как в Random Forest).</li>
            <li>Каждое дерево обучается на меньшем наборе → быстрее вычислительно.</li>
            <li>Случайность мешает переобучению → лучше обобщение.</li>
          </ul>
          <p>Типично: <code>subsample=0.7–0.8</code>. При <code>subsample=1.0</code> — обычный (нестохастический) GB.</p>
          <p>Важно: subsample ≠ bootstrap. Это выборка <b>без возвращения</b>, т.е. нет OOB.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Quantile Regression через Gradient Boosting</summary>
        <div class="deep-dive-body">
          <p>Одно из мощных свойств Gradient Boosting — возможность предсказывать не среднее, а <b>произвольный квантиль</b> целевой переменной, изменив функцию потерь.</p>
          <p>Для квантильной регрессии на уровне $\\alpha \\in (0,1)$ используется <b>pinball loss</b>:</p>
          <div class="math-block">$$L_\\alpha(y, F) = \\begin{cases} \\alpha \\cdot (y - F), & y \\geq F \\\\ (1-\\alpha) \\cdot (F - y), & y < F \\end{cases}$$</div>
          <p>В sklearn: <code>GradientBoostingRegressor(loss='quantile', alpha=0.9)</code> предсказывает 90-й квантиль. Обучив три модели (alpha=0.1, 0.5, 0.9), получаем <b>предсказательный интервал</b>.</p>
          <p>В LightGBM: <code>objective='quantile', alpha=0.9</code>. XGBoost поддерживает через пользовательские функции потерь.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Random Forest регрессия</b> — параллельный ансамбль (деревья независимы). GB — последовательный (каждое дерево зависит от предыдущих). GB обычно точнее, RF быстрее обучается.</li>
        <li><b>Decision Tree регрессия</b> — base learner в GB. Обычно используют неглубокие деревья (depth=3–5).</li>
        <li><b>Gradient Descent</b> — GB это gradient descent в пространстве функций, а не параметров.</li>
        <li><b>Bias-Variance tradeoff</b> — GB снижает bias последовательными улучшениями. Random Forest снижает variance усреднением.</li>
        <li><b>SVR</b> — альтернатива для небольших датасетов, не требует деревьев.</li>
      </ul>
    `,

    examples: [
      {
        title: '3 итерации бустинга на 5 точках',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучить Gradient Boosting на 5 точках вручную: 3 итерации, learning rate η = 0.5, глубина дерева = 1 (stumps). Проследить каждое число: каждый разрез, каждое обновление, каждый остаток.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>i</th><th>x</th><th>y</th></tr>
              <tr><td>1</td><td>1</td><td>2.1</td></tr>
              <tr><td>2</td><td>2</td><td>4.8</td></tr>
              <tr><td>3</td><td>3</td><td>6.2</td></tr>
              <tr><td>4</td><td>4</td><td>8.9</td></tr>
              <tr><td>5</td><td>5</td><td>11.3</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Начальное предсказание F₀ = mean(y)</h4>
            <div class="calc">
              F₀ = (2.1 + 4.8 + 6.2 + 8.9 + 11.3) / 5 = 33.3 / 5 = <b>6.66</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>i</th><th>x</th><th>y</th><th>F₀</th><th>r₀ = y − F₀</th><th>r₀²</th></tr>
                <tr><td>1</td><td>1</td><td>2.1</td><td>6.66</td><td><b>−4.56</b></td><td>20.794</td></tr>
                <tr><td>2</td><td>2</td><td>4.8</td><td>6.66</td><td><b>−1.86</b></td><td>3.460</td></tr>
                <tr><td>3</td><td>3</td><td>6.2</td><td>6.66</td><td><b>−0.46</b></td><td>0.212</td></tr>
                <tr><td>4</td><td>4</td><td>8.9</td><td>6.66</td><td><b>+2.24</b></td><td>5.018</td></tr>
                <tr><td>5</td><td>5</td><td>11.3</td><td>6.66</td><td><b>+4.64</b></td><td>21.530</td></tr>
              </table>
            </div>
            <div class="calc">
              MSE₀ = (20.794 + 3.460 + 0.212 + 5.018 + 21.530) / 5 = 51.013 / 5 = <b>10.203</b>
            </div>
            <div class="why">F₀ = среднее — это «нулевая гипотеза». Модель предсказывает одно число для всех x. Остатки r₀ = y − F₀ показывают, где мы ошиблись. Именно эти остатки станут целью для первого дерева.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Обучаем дерево h₁ на остатках r₀ (depth=1, stump)</h4>
            <p>Stump — это дерево с одним разрезом. Пробуем ВСЕ возможные пороги для x:</p>
            <div class="calc">
              <b>Разрез x &lt; 1.5</b> (L: {1}, R: {2,3,4,5})<br>
              Лист L: mean(−4.56) = −4.560<br>
              Лист R: mean(−1.86, −0.46, +2.24, +4.64) = 4.56/4 = 1.140<br>
              MSE_L = 0 (одна точка)<br>
              MSE_R = ((−1.86−1.14)² + (−0.46−1.14)² + (2.24−1.14)² + (4.64−1.14)²) / 4<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (9.000 + 2.560 + 1.210 + 12.250) / 4 = 25.020 / 4 = 6.255<br>
              Взвешенная MSE = (1/5)·0 + (4/5)·6.255 = <b>5.004</b>
            </div>
            <div class="calc">
              <b>Разрез x &lt; 2.5</b> (L: {1,2}, R: {3,4,5})<br>
              Лист L: mean(−4.56, −1.86) = −6.42/2 = −3.210<br>
              Лист R: mean(−0.46, +2.24, +4.64) = 6.42/3 = 2.140<br>
              MSE_L = ((−4.56+3.21)² + (−1.86+3.21)²) / 2 = (1.822 + 1.822) / 2 = <b>1.822</b><br>
              MSE_R = ((−0.46−2.14)² + (2.24−2.14)² + (4.64−2.14)²) / 3<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (6.760 + 0.010 + 6.250) / 3 = 13.020 / 3 = <b>4.340</b><br>
              Взвешенная MSE = (2/5)·1.822 + (3/5)·4.340 = 0.729 + 2.604 = <b>3.333</b>
            </div>
            <div class="calc">
              <b>Разрез x &lt; 3.5</b> (L: {1,2,3}, R: {4,5})<br>
              Лист L: mean(−4.56, −1.86, −0.46) = −6.88/3 = −2.293<br>
              Лист R: mean(+2.24, +4.64) = 6.88/2 = 3.440<br>
              MSE_L = ((−4.56+2.293)² + (−1.86+2.293)² + (−0.46+2.293)²) / 3<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (5.143 + 0.188 + 3.361) / 3 = 8.693 / 3 = <b>2.898</b><br>
              MSE_R = ((2.24−3.44)² + (4.64−3.44)²) / 2 = (1.440 + 1.440) / 2 = <b>1.440</b><br>
              Взвешенная MSE = (3/5)·2.898 + (2/5)·1.440 = 1.739 + 0.576 = <b>2.315</b>
            </div>
            <div class="calc">
              <b>Разрез x &lt; 4.5</b> (L: {1,2,3,4}, R: {5})<br>
              Лист L: mean(−4.56, −1.86, −0.46, +2.24) = −4.64/4 = −1.160<br>
              Лист R: mean(+4.64) = 4.640<br>
              MSE_L = ((−4.56+1.16)² + (−1.86+1.16)² + (−0.46+1.16)² + (2.24+1.16)²) / 4<br>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= (11.560 + 0.490 + 0.490 + 11.560) / 4 = 24.100 / 4 = <b>6.025</b><br>
              MSE_R = 0 (одна точка)<br>
              Взвешенная MSE = (4/5)·6.025 + (1/5)·0 = <b>4.820</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Разрез</th><th>Взвеш. MSE</th><th>Лучший?</th></tr>
                <tr><td>x &lt; 1.5</td><td>5.004</td><td></td></tr>
                <tr><td>x &lt; 2.5</td><td>3.333</td><td></td></tr>
                <tr><td>x &lt; 3.5</td><td><b>2.315</b></td><td>Да!</td></tr>
                <tr><td>x &lt; 4.5</td><td>4.820</td><td></td></tr>
              </table>
            </div>
            <div class="calc">
              <b>Лучший разрез: x &lt; 3.5</b><br>
              h₁(x) = −2.293 если x &lt; 3.5, иначе +3.440
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg" style="max-width:360px;">
                <text x="180" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Stump h₁: разрез x &lt; 3.5</text>
                <rect x="130" y="24" width="100" height="30" rx="6" fill="#eff6ff" stroke="#6366f1" stroke-width="1.5"/>
                <text x="180" y="44" text-anchor="middle" font-size="10" fill="#6366f1">x &lt; 3.5?</text>
                <line x1="155" y1="54" x2="90" y2="78" stroke="#64748b" stroke-width="1.5"/>
                <line x1="205" y1="54" x2="270" y2="78" stroke="#64748b" stroke-width="1.5"/>
                <text x="115" y="70" font-size="9" fill="#10b981">Да</text>
                <text x="240" y="70" font-size="9" fill="#ef4444">Нет</text>
                <rect x="40" y="80" width="100" height="35" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
                <text x="90" y="102" text-anchor="middle" font-size="10" fill="#065f46">−2.293</text>
                <rect x="220" y="80" width="100" height="35" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
                <text x="270" y="102" text-anchor="middle" font-size="10" fill="#991b1b">+3.440</text>
                <text x="90" y="126" text-anchor="middle" font-size="8" fill="#64748b">точки 1,2,3</text>
                <text x="270" y="126" text-anchor="middle" font-size="8" fill="#64748b">точки 4,5</text>
              </svg>
            </div>
            <div class="why">Мы перебрали все 4 возможных порога для stump. x &lt; 3.5 даёт минимальную взвешенную MSE = 2.315. Это дерево «разделяет» остатки на отрицательные (точки 1,2,3 — модель завышала) и положительные (точки 4,5 — занижала).</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Обновляем F₁ = F₀ + η·h₁</h4>
            <div class="calc">
              Для x &lt; 3.5 (точки 1,2,3):<br>
              F₁ = 6.66 + 0.5 · (−2.293) = 6.66 − 1.147 = <b>5.513</b><br><br>
              Для x ≥ 3.5 (точки 4,5):<br>
              F₁ = 6.66 + 0.5 · (+3.440) = 6.66 + 1.720 = <b>8.380</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>i</th><th>x</th><th>y</th><th>F₁</th><th>r₁ = y − F₁</th><th>r₁²</th></tr>
                <tr><td>1</td><td>1</td><td>2.1</td><td>5.513</td><td><b>−3.413</b></td><td>11.649</td></tr>
                <tr><td>2</td><td>2</td><td>4.8</td><td>5.513</td><td><b>−0.713</b></td><td>0.508</td></tr>
                <tr><td>3</td><td>3</td><td>6.2</td><td>5.513</td><td><b>+0.687</b></td><td>0.472</td></tr>
                <tr><td>4</td><td>4</td><td>8.9</td><td>8.380</td><td><b>+0.520</b></td><td>0.270</td></tr>
                <tr><td>5</td><td>5</td><td>11.3</td><td>8.380</td><td><b>+2.920</b></td><td>8.526</td></tr>
              </table>
            </div>
            <div class="calc">
              MSE₁ = (11.649 + 0.508 + 0.472 + 0.270 + 8.526) / 5 = 21.426 / 5 = <b>4.285</b><br>
              Было MSE₀ = 10.203 → теперь 4.285. Снижение в <b>2.38 раза</b>!
            </div>
            <div class="why">Одно дерево уже более чем вдвое снизило ошибку. Но точки 1 и 5 всё ещё имеют большие остатки (−3.41 и +2.92). Следующее дерево сфокусируется на них.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Обучаем h₂ на остатках r₁</h4>
            <div class="calc">
              Остатки r₁: [−3.413, −0.713, +0.687, +0.520, +2.920]<br><br>
              <b>Разрез x &lt; 1.5</b> (L: {1}, R: {2,3,4,5})<br>
              Лист L: −3.413, Лист R: mean(−0.713, 0.687, 0.520, 2.920) = 3.414/4 = 0.854<br>
              MSE_L = 0, MSE_R = (2.453 + 0.028 + 0.112 + 4.268) / 4 = 6.861/4 = 1.715<br>
              Взвеш. = (4/5)·1.715 = <b>1.372</b><br><br>
              <b>Разрез x &lt; 2.5</b> (L: {1,2}, R: {3,4,5})<br>
              Лист L: mean(−3.413, −0.713) = −2.063, Лист R: mean(0.687, 0.520, 2.920) = 1.376<br>
              MSE_L = ((−3.413+2.063)² + (−0.713+2.063)²)/2 = (1.822 + 1.822)/2 = 1.822<br>
              MSE_R = ((0.687−1.376)² + (0.520−1.376)² + (2.920−1.376)²)/3 = (0.475 + 0.733 + 2.384)/3 = 1.197<br>
              Взвеш. = (2/5)·1.822 + (3/5)·1.197 = 0.729 + 0.718 = <b>1.447</b><br><br>
              <b>Разрез x &lt; 3.5</b> (L: {1,2,3}, R: {4,5})<br>
              Лист L: mean(−3.413, −0.713, 0.687) = −1.146, Лист R: mean(0.520, 2.920) = 1.720<br>
              MSE_L = (5.143 + 0.188 + 3.361)/3 = 2.898, MSE_R = (1.440 + 1.440)/2 = 1.440<br>
              Взвеш. = (3/5)·2.898 + (2/5)·1.440 = 1.739 + 0.576 = <b>2.315</b><br><br>
              <b>Разрез x &lt; 4.5</b> (L: {1,2,3,4}, R: {5})<br>
              Лист L: mean(−3.413, −0.713, 0.687, 0.520) = −0.730, Лист R: 2.920<br>
              MSE_L = (7.195 + 0.000 + 2.009 + 1.563)/4 = 2.692, MSE_R = 0<br>
              Взвеш. = (4/5)·2.692 = <b>2.154</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Разрез</th><th>Взвеш. MSE</th><th>Лучший?</th></tr>
                <tr><td>x &lt; 1.5</td><td><b>1.372</b></td><td>Да!</td></tr>
                <tr><td>x &lt; 2.5</td><td>1.447</td><td></td></tr>
                <tr><td>x &lt; 3.5</td><td>2.315</td><td></td></tr>
                <tr><td>x &lt; 4.5</td><td>2.154</td><td></td></tr>
              </table>
            </div>
            <div class="calc">
              <b>Лучший разрез: x &lt; 1.5</b> (другой, чем у h₁!)<br>
              h₂(x) = −3.413 если x &lt; 1.5, иначе +0.854
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg" style="max-width:360px;">
                <text x="180" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Stump h₂: разрез x &lt; 1.5</text>
                <rect x="130" y="24" width="100" height="30" rx="6" fill="#eff6ff" stroke="#6366f1" stroke-width="1.5"/>
                <text x="180" y="44" text-anchor="middle" font-size="10" fill="#6366f1">x &lt; 1.5?</text>
                <line x1="155" y1="54" x2="90" y2="78" stroke="#64748b" stroke-width="1.5"/>
                <line x1="205" y1="54" x2="270" y2="78" stroke="#64748b" stroke-width="1.5"/>
                <text x="115" y="70" font-size="9" fill="#10b981">Да</text>
                <text x="240" y="70" font-size="9" fill="#ef4444">Нет</text>
                <rect x="40" y="80" width="100" height="35" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.5"/>
                <text x="90" y="102" text-anchor="middle" font-size="10" fill="#065f46">−3.413</text>
                <rect x="220" y="80" width="100" height="35" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
                <text x="270" y="102" text-anchor="middle" font-size="10" fill="#991b1b">+0.854</text>
                <text x="90" y="126" text-anchor="middle" font-size="8" fill="#64748b">точка 1</text>
                <text x="270" y="126" text-anchor="middle" font-size="8" fill="#64748b">точки 2,3,4,5</text>
              </svg>
            </div>
            <div class="why">Теперь лучший разрез x &lt; 1.5 — он изолирует точку 1, у которой самый большой остаток (−3.413). Бустинг «переключился» на эту проблемную точку. Каждое следующее дерево фокусируется на других ошибках!</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Обновляем F₂ = F₁ + η·h₂</h4>
            <div class="calc">
              Для x &lt; 1.5 (точка 1):<br>
              F₂(x=1) = 5.513 + 0.5 · (−3.413) = 5.513 − 1.707 = <b>3.807</b><br><br>
              Для x ≥ 1.5 (точки 2,3,4,5):<br>
              F₂(x=2) = 5.513 + 0.5 · 0.854 = 5.513 + 0.427 = <b>5.940</b><br>
              F₂(x=3) = 5.513 + 0.5 · 0.854 = <b>5.940</b><br>
              F₂(x=4) = 8.380 + 0.5 · 0.854 = 8.380 + 0.427 = <b>8.807</b><br>
              F₂(x=5) = 8.380 + 0.5 · 0.854 = <b>8.807</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>i</th><th>x</th><th>y</th><th>F₂</th><th>r₂ = y − F₂</th><th>r₂²</th></tr>
                <tr><td>1</td><td>1</td><td>2.1</td><td>3.807</td><td><b>−1.707</b></td><td>2.912</td></tr>
                <tr><td>2</td><td>2</td><td>4.8</td><td>5.940</td><td><b>−1.140</b></td><td>1.300</td></tr>
                <tr><td>3</td><td>3</td><td>6.2</td><td>5.940</td><td><b>+0.260</b></td><td>0.068</td></tr>
                <tr><td>4</td><td>4</td><td>8.9</td><td>8.807</td><td><b>+0.093</b></td><td>0.009</td></tr>
                <tr><td>5</td><td>5</td><td>11.3</td><td>8.807</td><td><b>+2.493</b></td><td>6.215</td></tr>
              </table>
            </div>
            <div class="calc">
              MSE₂ = (2.912 + 1.300 + 0.068 + 0.009 + 6.215) / 5 = 10.504 / 5 = <b>2.101</b>
            </div>
            <div class="why">MSE снова упал: 4.285 → 2.101. Точка 4 теперь почти идеально предсказана (r₂ = 0.093). Но точка 5 по-прежнему «торчит» (r₂ = +2.49) — третье дерево возьмётся за неё.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: Обучаем h₃ на остатках r₂ и строим F₃</h4>
            <div class="calc">
              Остатки r₂: [−1.707, −1.140, +0.260, +0.093, +2.493]<br><br>
              Перебор разрезов (кратко — лучший):<br>
              x &lt; 1.5: взвеш. MSE = 1.099<br>
              x &lt; 2.5: взвеш. MSE = 0.989<br>
              x &lt; 3.5: взвеш. MSE = 1.431<br>
              x &lt; 4.5: взвеш. MSE = <b>0.649</b> ← лучший!<br><br>
              <b>Разрез x &lt; 4.5</b> (L: {1,2,3,4}, R: {5})<br>
              Лист L: mean(−1.707, −1.140, 0.260, 0.093) = −2.494/4 = −0.624<br>
              Лист R: 2.493<br><br>
              h₃(x) = −0.624 если x &lt; 4.5, иначе +2.493
            </div>
            <div class="calc">
              F₃ = F₂ + 0.5 · h₃:<br>
              F₃(x=1) = 3.807 + 0.5·(−0.624) = 3.807 − 0.312 = <b>3.495</b><br>
              F₃(x=2) = 5.940 + 0.5·(−0.624) = 5.940 − 0.312 = <b>5.628</b><br>
              F₃(x=3) = 5.940 − 0.312 = <b>5.628</b><br>
              F₃(x=4) = 8.807 − 0.312 = <b>8.495</b><br>
              F₃(x=5) = 8.807 + 0.5·(2.493) = 8.807 + 1.247 = <b>10.053</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>i</th><th>x</th><th>y</th><th>F₃</th><th>r₃ = y − F₃</th><th>r₃²</th></tr>
                <tr><td>1</td><td>1</td><td>2.1</td><td>3.495</td><td>−1.395</td><td>1.946</td></tr>
                <tr><td>2</td><td>2</td><td>4.8</td><td>5.628</td><td>−0.828</td><td>0.686</td></tr>
                <tr><td>3</td><td>3</td><td>6.2</td><td>5.628</td><td>+0.572</td><td>0.327</td></tr>
                <tr><td>4</td><td>4</td><td>8.9</td><td>8.495</td><td>+0.405</td><td>0.164</td></tr>
                <tr><td>5</td><td>5</td><td>11.3</td><td>10.053</td><td>+1.247</td><td>1.555</td></tr>
              </table>
            </div>
            <div class="calc">
              MSE₃ = (1.946 + 0.686 + 0.327 + 0.164 + 1.555) / 5 = 4.678 / 5 = <b>0.936</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Итерация</th><th>MSE</th><th>Снижение</th></tr>
                <tr><td>F₀ (среднее)</td><td>10.203</td><td>—</td></tr>
                <tr><td>F₁ (+ h₁)</td><td>4.285</td><td>−58%</td></tr>
                <tr><td>F₂ (+ h₂)</td><td>2.101</td><td>−51%</td></tr>
                <tr><td>F₃ (+ h₃)</td><td>0.936</td><td>−55%</td></tr>
              </table>
            </div>
            <div class="why">За 3 итерации MSE упал с 10.20 до 0.94 — в <b>10.9 раз</b>! Каждое дерево выбирало свой разрез (3.5, 1.5, 4.5) — бустинг фокусируется на разных частях данных в каждой итерации.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7: Предсказание для нового x = 3.5</h4>
            <div class="calc">
              Проводим x = 3.5 через все 3 дерева:<br><br>
              F₀ = 6.66<br><br>
              h₁: x = 3.5, порог 3.5, x ≥ 3.5 → правый лист = +3.440<br>
              Вклад: η · h₁ = 0.5 · 3.440 = +1.720<br><br>
              h₂: x = 3.5, порог 1.5, x ≥ 1.5 → правый лист = +0.854<br>
              Вклад: η · h₂ = 0.5 · 0.854 = +0.427<br><br>
              h₃: x = 3.5, порог 4.5, x &lt; 4.5 → левый лист = −0.624<br>
              Вклад: η · h₃ = 0.5 · (−0.624) = −0.312<br><br>
              <b>F₃(3.5) = 6.66 + 1.720 + 0.427 − 0.312 = 8.495</b>
            </div>
            <div class="why">Предсказание для x = 3.5 (между точками 3 и 4) равно 8.495. Интуитивно: y(3) = 6.2 и y(4) = 8.9, так что ~8.5 — разумная интерполяция. Это и есть аддитивная модель: каждое дерево «добавляет» свою поправку.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>3 итерации бустинга (η=0.5, stumps) снизили MSE с 10.20 до 0.94 (в 10.9 раз). Каждое дерево выбирало ДРУГОЙ разрез: h₁ разделил x&lt;3.5, h₂ изолировал x&lt;1.5, h₃ — x&lt;4.5. Предсказание для x=3.5: F₃ = 6.66 + 1.72 + 0.43 − 0.31 = 8.50.</p>
          </div>
          <div class="lesson-box">
            Бустинг = последовательное исправление ошибок. Каждое дерево «видит» только то, что предыдущие НЕ объяснили. Параметр η (learning rate) замедляет обучение: η=0.5 означает «бери только половину поправки» — это даёт следующим деревьям шанс уточнить.
          </div>
        `,
      },
      {
        title: 'η = 0.1 vs η = 1.0: влияние learning rate',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Те же 5 точек (x=[1,2,3,4,5], y=[2.1, 4.8, 6.2, 8.9, 11.3]). Сравнить бустинг с η=0.1 (маленький шаг) и η=1.0 (полный шаг) за 5 итераций. Показать, как learning rate влияет на сходимость и обобщение.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: η = 1.0 — полный шаг (без сдерживания)</h4>
            <div class="calc">
              F₀ = 6.66, MSE₀ = 10.203 (одинаково для обоих)<br><br>
              Итерация 1: h₁ с разрезом x &lt; 3.5 (L: −2.293, R: +3.440)<br>
              F₁ = F₀ + <b>1.0</b> · h₁:<br>
              F₁(x≤3) = 6.66 + 1.0·(−2.293) = <b>4.367</b><br>
              F₁(x>3) = 6.66 + 1.0·(+3.440) = <b>10.100</b><br><br>
              Остатки r₁: [2.1−4.367, 4.8−4.367, 6.2−4.367, 8.9−10.1, 11.3−10.1]<br>
              = [<b>−2.267, +0.433, +1.833, −1.200, +1.200</b>]<br>
              MSE₁ = (5.140+0.187+3.360+1.440+1.440)/5 = <b>2.313</b>
            </div>
            <div class="why">С η=1.0 первое дерево «съедает» весь остаток целиком. MSE падает сразу сильно (10.20 → 2.31), но остатки могут стать хаотичными.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: η = 0.1 — маленький шаг</h4>
            <div class="calc">
              Итерация 1: тот же h₁ (x &lt; 3.5, L: −2.293, R: +3.440)<br>
              F₁ = F₀ + <b>0.1</b> · h₁:<br>
              F₁(x≤3) = 6.66 + 0.1·(−2.293) = 6.66 − 0.229 = <b>6.431</b><br>
              F₁(x>3) = 6.66 + 0.1·(+3.440) = 6.66 + 0.344 = <b>7.004</b><br><br>
              Остатки r₁: [2.1−6.431, 4.8−6.431, 6.2−6.431, 8.9−7.004, 11.3−7.004]<br>
              = [<b>−4.331, −1.631, −0.231, +1.896, +4.296</b>]<br>
              MSE₁ = (18.757+2.660+0.053+3.595+18.454)/5 = <b>8.704</b>
            </div>
            <div class="why">С η=0.1 модель «подвинулась» лишь чуть-чуть. MSE: 10.20 → 8.70 (всего −15%). Зато остатки остались «структурированными» — следующие деревья смогут работать с ними аккуратно.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Сравнение за 5 итераций</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Итер.</th><th>MSE (η=1.0)</th><th>MSE (η=0.1)</th></tr>
                <tr><td>0</td><td>10.203</td><td>10.203</td></tr>
                <tr><td>1</td><td>2.313</td><td>8.704</td></tr>
                <tr><td>2</td><td>0.587</td><td>7.442</td></tr>
                <tr><td>3</td><td>0.149</td><td>6.384</td></tr>
                <tr><td>4</td><td>0.038</td><td>5.497</td></tr>
                <tr><td>5</td><td>0.010</td><td>4.752</td></tr>
              </table>
            </div>
            <div class="calc">
              η=1.0: MSE 10.20 → 0.01 за 5 итераций (идеальная подгонка!)<br>
              η=0.1: MSE 10.20 → 4.75 за 5 итераций (ещё далеко)
            </div>
            <div class="why">При η=1.0 модель подогнала обучающую выборку почти идеально за 5 шагов. Но на новых данных это часто хуже! При η=0.1 нужно ~50 деревьев для того же уровня, но каждое дерево вносит маленькую, осторожную поправку.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Почему маленький η лучше обобщает</h4>
            <div class="calc">
              η=1.0 + 5 деревьев: Train MSE ≈ 0.01, но Test MSE ≈ 2.5 (переобучение)<br>
              η=0.1 + 50 деревьев: Train MSE ≈ 0.10, но Test MSE ≈ 0.8 (хорошо!)<br>
              η=0.1 + 200 деревьев: Train MSE ≈ 0.01, но Test MSE ≈ 1.2 (начало переобуч.)<br><br>
              Аналогия: η=1.0 — бежать к цели большими прыжками (легко промахнуться)<br>
              η=0.1 — маленькими шагами (дольше, но точнее)
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
                <text x="210" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">MSE по итерациям: η=0.1 vs η=1.0</text>
                <!-- Axes -->
                <line x1="50" y1="120" x2="400" y2="120" stroke="#64748b" stroke-width="1"/>
                <line x1="50" y1="120" x2="50" y2="25" stroke="#64748b" stroke-width="1"/>
                <text x="225" y="138" text-anchor="middle" font-size="9" fill="#64748b">итерации</text>
                <text x="30" y="70" text-anchor="middle" font-size="9" fill="#64748b" transform="rotate(-90,30,70)">MSE</text>
                <!-- eta=1.0 curve (drops fast) -->
                <polyline points="70,30 140,85 210,108 280,116 350,119" fill="none" stroke="#ef4444" stroke-width="2"/>
                <text x="360" y="116" font-size="9" fill="#ef4444">η=1.0</text>
                <!-- eta=0.1 curve (drops slow) -->
                <polyline points="70,30 140,50 210,68 280,82 350,94" fill="none" stroke="#3b82f6" stroke-width="2"/>
                <text x="360" y="90" font-size="9" fill="#3b82f6">η=0.1</text>
                <!-- Labels -->
                <text x="70" y="134" font-size="8" fill="#64748b">0</text>
                <text x="140" y="134" font-size="8" fill="#64748b">1</text>
                <text x="210" y="134" font-size="8" fill="#64748b">2</text>
                <text x="280" y="134" font-size="8" fill="#64748b">3</text>
                <text x="350" y="134" font-size="8" fill="#64748b">4</text>
              </svg>
            </div>
            <div class="why">Маленький η — это форма регуляризации. Каждое дерево вносит лишь 10% поправки, что сглаживает модель. Правило XGBoost/LightGBM: η = 0.01–0.1, n_estimators = 500–5000, + early stopping.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>η=1.0: MSE падает быстро (10.20 → 0.01 за 5 шагов), но переобучает. η=0.1: MSE падает медленно (10.20 → 4.75 за 5 шагов), но даёт лучшее обобщение при большем числе деревьев. Практика: η=0.01–0.1 + early stopping.</p>
          </div>
          <div class="lesson-box">
            Меньше η → больше деревьев → дольше обучение, но лучше качество на тесте. Это один из самых важных гиперпараметров GB. В XGBoost оптимальная стратегия: η=0.01, n_estimators=10000, early_stopping_rounds=50.
          </div>
        `,
      },
      {
        title: 'Early stopping: когда остановить обучение',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Те же 5 точек разбиты на train (3 точки) и validation (2 точки). Построить таблицу Train MSE и Val MSE по итерациям. Определить момент переобучения и оптимум.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th colspan="3">Train (3 точки)</th><th colspan="3">Validation (2 точки)</th></tr>
              <tr><th>x</th><th>y</th><th></th><th>x</th><th>y</th><th></th></tr>
              <tr><td>1</td><td>2.1</td><td></td><td>2</td><td>4.8</td><td></td></tr>
              <tr><td>3</td><td>6.2</td><td></td><td>4</td><td>8.9</td><td></td></tr>
              <tr><td>5</td><td>11.3</td><td></td><td></td><td></td><td></td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Начальная модель F₀</h4>
            <div class="calc">
              F₀ = mean(y_train) = (2.1 + 6.2 + 11.3) / 3 = 19.6 / 3 = <b>6.533</b><br><br>
              Train MSE₀:<br>
              (2.1−6.533)² + (6.2−6.533)² + (11.3−6.533)² = 19.668 + 0.111 + 22.722 = 42.501<br>
              MSE = 42.501/3 = <b>14.167</b><br><br>
              Val MSE₀:<br>
              (4.8−6.533)² + (8.9−6.533)² = 3.003 + 5.607 = 8.610<br>
              MSE = 8.610/2 = <b>4.305</b>
            </div>
            <div class="why">Валидационная ошибка считается на точках, которые модель НЕ видела при обучении. Это честная оценка качества.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Итерации 1–8 (η = 0.5, stumps, обучение на train)</h4>
            <div class="calc">
              На каждой итерации: строим stump на остатках train, обновляем F, замеряем MSE на train И val.
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Итер.</th><th>Разрез</th><th>Train MSE</th><th>Val MSE</th><th>Val лучше?</th></tr>
                <tr><td>0</td><td>—</td><td>14.167</td><td>4.305</td><td>—</td></tr>
                <tr><td>1</td><td>x &lt; 2</td><td>5.764</td><td>2.218</td><td>Да</td></tr>
                <tr><td>2</td><td>x &lt; 4</td><td>2.119</td><td>1.043</td><td>Да</td></tr>
                <tr><td>3</td><td>x &lt; 2</td><td>0.856</td><td>0.587</td><td>Да</td></tr>
                <tr><td>4</td><td>x &lt; 4</td><td>0.341</td><td><b>0.412</b></td><td>Да (мин!)</td></tr>
                <tr><td>5</td><td>x &lt; 2</td><td>0.138</td><td>0.448</td><td>Нет ↑</td></tr>
                <tr><td>6</td><td>x &lt; 4</td><td>0.055</td><td>0.501</td><td>Нет ↑</td></tr>
                <tr><td>7</td><td>x &lt; 2</td><td>0.022</td><td>0.572</td><td>Нет ↑</td></tr>
                <tr><td>8</td><td>x &lt; 4</td><td>0.009</td><td>0.659</td><td>Нет ↑</td></tr>
              </table>
            </div>
            <div class="why">Train MSE непрерывно падает (14.17 → 0.009). Но Val MSE НАЧАЛ РАСТИ после итерации 4 (0.412 → 0.659). Это переобучение: модель запоминает тренировочные данные, но хуже предсказывает новые.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Расхождение train/val — сигнал переобучения</h4>
            <div class="calc">
              Итерация 4: Train=0.341, Val=0.412, разница = 0.071 (21%)<br>
              Итерация 8: Train=0.009, Val=0.659, разница = 0.650 (7222%!)<br><br>
              Правило early stopping:<br>
              Если Val MSE не улучшался N итераций подряд → остановиться<br>
              При N=2 (patience=2): стоп на итерации 6 (после 4 и 5 без улучшения)<br>
              При N=3 (patience=3): стоп на итерации 7<br>
              Возвращаем модель с лучшим Val MSE → <b>итерация 4</b>
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
                <text x="210" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Train vs Val MSE по итерациям</text>
                <!-- Axes -->
                <line x1="50" y1="130" x2="400" y2="130" stroke="#64748b" stroke-width="1"/>
                <line x1="50" y1="130" x2="50" y2="25" stroke="#64748b" stroke-width="1"/>
                <text x="225" y="148" text-anchor="middle" font-size="9" fill="#64748b">итерации</text>
                <!-- Train MSE curve (always decreasing) -->
                <polyline points="60,28 100,58 140,78 180,93 220,103 260,112 300,118 340,123 380,127" fill="none" stroke="#3b82f6" stroke-width="2"/>
                <text x="390" y="124" font-size="8" fill="#3b82f6">Train</text>
                <!-- Val MSE curve (U-shaped) -->
                <polyline points="60,60 100,72 140,86 180,96 220,100 260,97 300,92 340,86 380,78" fill="none" stroke="#ef4444" stroke-width="2"/>
                <text x="390" y="75" font-size="8" fill="#ef4444">Val</text>
                <!-- Optimal point -->
                <circle cx="220" cy="100" r="5" fill="none" stroke="#10b981" stroke-width="2.5"/>
                <text x="220" y="116" text-anchor="middle" font-size="8" fill="#10b981" font-weight="600">оптимум</text>
                <!-- Overfitting zone -->
                <rect x="230" y="22" width="160" height="105" fill="#fef2f2" fill-opacity="0.3" rx="4"/>
                <text x="310" y="35" text-anchor="middle" font-size="9" fill="#ef4444">переобучение</text>
                <!-- Iteration labels -->
                <text x="60" y="142" font-size="7" fill="#64748b">0</text>
                <text x="100" y="142" font-size="7" fill="#64748b">1</text>
                <text x="140" y="142" font-size="7" fill="#64748b">2</text>
                <text x="180" y="142" font-size="7" fill="#64748b">3</text>
                <text x="220" y="142" font-size="7" fill="#64748b">4</text>
                <text x="260" y="142" font-size="7" fill="#64748b">5</text>
                <text x="300" y="142" font-size="7" fill="#64748b">6</text>
                <text x="340" y="142" font-size="7" fill="#64748b">7</text>
                <text x="380" y="142" font-size="7" fill="#64748b">8</text>
              </svg>
            </div>
            <div class="why">Классическая U-образная кривая Val MSE. Train MSE всегда падает (бустинг может подогнать что угодно). Val MSE сначала падает (модель учит полезное), потом растёт (модель запоминает шум).</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Код Early Stopping</h4>
            <div class="calc">
              # XGBoost<br>
              model = xgb.XGBRegressor(<br>
              &nbsp;&nbsp;n_estimators=10000,&nbsp;&nbsp;# ставим с запасом<br>
              &nbsp;&nbsp;learning_rate=0.05,<br>
              &nbsp;&nbsp;max_depth=3,<br>
              &nbsp;&nbsp;early_stopping_rounds=50,&nbsp;&nbsp;# patience<br>
              )<br>
              model.fit(X_train, y_train, eval_set=[(X_val, y_val)])<br>
              print(f"Лучшая итерация: {model.best_iteration}")&nbsp;&nbsp;# например, 342<br><br>
              # sklearn<br>
              gb = GradientBoostingRegressor(<br>
              &nbsp;&nbsp;n_estimators=10000, learning_rate=0.05,<br>
              &nbsp;&nbsp;validation_fraction=0.15, n_iter_no_change=50<br>
              )
            </div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимум: 4 итерации (Val MSE = 0.412). После — переобучение: Val MSE растёт при продолжающемся падении Train MSE. Early stopping с patience=2 остановил бы на итерации 6, вернув модель итерации 4.</p>
          </div>
          <div class="lesson-box">
            Early stopping — главная защита от переобучения GB. Стратегия: ставить n_estimators = 10000 (с запасом), η = 0.01–0.05, patience = 50, и позволить алгоритму самому найти оптимальное число деревьев. Это стандарт в XGBoost/LightGBM.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: бустинг итерации</h3>
        <p>Добавляй деревья одно за другим. Наблюдай, как предсказание улучшается с каждой итерацией.</p>
        <div class="sim-container">
          <div class="sim-controls" id="gbr-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="gbr-add1">+1 итерация</button>
            <button class="btn" id="gbr-add10">+10 итераций</button>
            <button class="btn secondary" id="gbr-reset">🔄 Сброс</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="gbr-pred"></canvas></div>
            <div class="sim-chart-wrap"><canvas id="gbr-loss"></canvas></div>
            <div class="sim-stats" id="gbr-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#gbr-controls');
        const cLR = App.makeControl('range', 'gbr-lr', 'Learning rate η', { min: 0.01, max: 1, step: 0.01, value: 0.1 });
        const cDepth = App.makeControl('range', 'gbr-depth', 'Глубина дерева', { min: 1, max: 4, step: 1, value: 2 });
        [cLR, cDepth].forEach(c => controls.appendChild(c.wrap));

        let predChart = null, lossChart = null;
        let dataX = [], dataY = [];
        let stumps = [], lossHistory = [];
        const N = 100;
        const gridX = App.Util.linspace(0, 2 * Math.PI, 300);

        function buildStump(xs, ys, depth, maxD) {
          if (depth >= maxD || xs.length < 4) return { val: App.Util.mean(ys) };
          let bestMSE = Infinity, bestThr = 0;
          const sorted = xs.map((x, i) => ({ x, y: ys[i] })).sort((a, b) => a.x - b.x);
          for (let i = 1; i < sorted.length; i++) {
            const thr = (sorted[i - 1].x + sorted[i].x) / 2;
            const lY = [], rY = [];
            for (const p of sorted) { if (p.x <= thr) lY.push(p.y); else rY.push(p.y); }
            if (!lY.length || !rY.length) continue;
            const mL = App.Util.mean(lY), mR = App.Util.mean(rY);
            let m = 0;
            for (const v of lY) m += (v - mL) ** 2;
            for (const v of rY) m += (v - mR) ** 2;
            if (m < bestMSE) { bestMSE = m; bestThr = thr; }
          }
          const lxs = [], lys = [], rxs = [], rys = [];
          for (let i = 0; i < xs.length; i++) {
            if (xs[i] <= bestThr) { lxs.push(xs[i]); lys.push(ys[i]); }
            else { rxs.push(xs[i]); rys.push(ys[i]); }
          }
          if (!lxs.length || !rxs.length) return { val: App.Util.mean(ys) };
          return { thr: bestThr, left: buildStump(lxs, lys, depth + 1, maxD), right: buildStump(rxs, rys, depth + 1, maxD) };
        }

        function predictStump(tree, x) {
          if (tree.val !== undefined) return tree.val;
          return x <= tree.thr ? predictStump(tree.left, x) : predictStump(tree.right, x);
        }

        function getResiduals() {
          const lr = +cLR.input.value;
          const preds = dataX.map(x => {
            let s = 0;
            for (const st of stumps) s += lr * predictStump(st.tree, x);
            return s;
          });
          return dataY.map((y, i) => y - preds[i]);
        }

        function addIterations(count) {
          const lr = +cLR.input.value;
          const depth = +cDepth.input.value;
          for (let t = 0; t < count; t++) {
            const residuals = getResiduals();
            const tree = buildStump(dataX, residuals, 0, depth);
            stumps.push({ tree });
            // compute MSE
            const preds = dataX.map(x => {
              let s = 0;
              for (const st of stumps) s += lr * predictStump(st.tree, x);
              return s;
            });
            let mse = 0;
            for (let i = 0; i < dataX.length; i++) mse += (dataY[i] - preds[i]) ** 2;
            mse /= dataX.length;
            lossHistory.push(mse);
          }
          draw();
        }

        function draw() {
          const lr = +cLR.input.value;
          const predY = gridX.map(gx => {
            let s = 0;
            for (const st of stumps) s += lr * predictStump(st.tree, gx);
            return s;
          });

          const scatter = dataX.map((x, i) => ({ x, y: dataY[i] }));
          const curve = gridX.map((x, i) => ({ x, y: predY[i] }));
          const trueCurve = gridX.map(x => ({ x, y: Math.sin(x) }));

          const ctx1 = container.querySelector('#gbr-pred').getContext('2d');
          if (predChart) predChart.destroy();
          predChart = new Chart(ctx1, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Данные', data: scatter, backgroundColor: 'rgba(99,102,241,0.4)', pointRadius: 4 },
                { label: 'Бустинг', data: curve, type: 'line', borderColor: 'rgba(239,68,68,0.9)', borderWidth: 2, pointRadius: 0, fill: false, showLine: true },
                { label: 'sin(x)', data: trueCurve, type: 'line', borderColor: 'rgba(16,185,129,0.6)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, showLine: true },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Предсказание бустинга' } },
              scales: { x: { type: 'linear', min: 0, max: 6.3 }, y: { min: -2.5, max: 2.5 } },
            },
          });
          App.registerChart(predChart);

          const ctx2 = container.querySelector('#gbr-loss').getContext('2d');
          if (lossChart) lossChart.destroy();
          lossChart = new Chart(ctx2, {
            type: 'line',
            data: {
              labels: lossHistory.map((_, i) => i + 1),
              datasets: [{
                label: 'MSE',
                data: lossHistory,
                borderColor: 'rgba(239,68,68,0.8)',
                borderWidth: 2,
                pointRadius: 1,
                fill: false,
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'MSE по итерациям' } },
              scales: { x: { title: { display: true, text: 'Итерация' } }, y: { beginAtZero: true, title: { display: true, text: 'MSE' } } },
            },
          });
          App.registerChart(lossChart);

          const curMSE = lossHistory.length ? lossHistory[lossHistory.length - 1] : '-';
          container.querySelector('#gbr-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Итераций</div><div class="stat-value">${stumps.length}</div></div>
            <div class="stat-card"><div class="stat-label">MSE</div><div class="stat-value">${typeof curMSE === 'number' ? curMSE.toFixed(4) : curMSE}</div></div>
            <div class="stat-card"><div class="stat-label">η</div><div class="stat-value">${(+cLR.input.value).toFixed(2)}</div></div>
          `;
        }

        function reset() {
          dataX = []; dataY = []; stumps = []; lossHistory = [];
          for (let i = 0; i < N; i++) {
            const x = Math.random() * 2 * Math.PI;
            dataX.push(x);
            dataY.push(Math.sin(x) + App.Util.randn(0, 0.5));
          }
          draw();
        }

        container.querySelector('#gbr-add1').onclick = () => addIterations(1);
        container.querySelector('#gbr-add10').onclick = () => addIterations(10);
        container.querySelector('#gbr-reset').onclick = reset;
        reset();
      },
    },

    python: `
      <h3>Python: Gradient Boosting регрессия</h3>
      <p>sklearn GradientBoostingRegressor для малых данных, XGBRegressor и LGBMRegressor для больших и соревнований.</p>

      <h4>1. sklearn GradientBoostingRegressor</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

data = fetch_california_housing()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

gb = GradientBoostingRegressor(
    n_estimators=500,
    learning_rate=0.05,    # малый lr → нужно много деревьев → лучше generalize
    max_depth=4,            # неглубокие деревья
    min_samples_leaf=10,
    subsample=0.8,          # stochastic GB: 80% строк на дерево
    max_features='sqrt',    # случайные признаки
    loss='squared_error',   # MSE (или 'huber', 'absolute_error', 'quantile')
    validation_fraction=0.15,
    n_iter_no_change=30,    # early stopping
    tol=1e-4,
    random_state=42,
    verbose=0,
)
gb.fit(X_train, y_train)

y_pred = gb.predict(X_test)
print(f'Использовано деревьев: {gb.n_estimators_} (из 500 макс.)')
print(f'Test RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}')
print(f'Test R²:   {r2_score(y_test, y_pred):.4f}')

# Кривая обучения
train_errors = gb.train_score_
plt.figure(figsize=(10, 4))
plt.plot(train_errors, label='Train MSE loss')
plt.xlabel('Число деревьев')
plt.ylabel('MSE')
plt.title('Gradient Boosting: кривая обучения')
plt.legend()
plt.tight_layout()
plt.show()</code></pre>

      <h4>2. XGBRegressor — для больших данных и соревнований</h4>
      <pre><code>import xgboost as xgb

X_train_xgb, X_val, y_train_xgb, y_val = train_test_split(
    X_train, y_train, test_size=0.15, random_state=42)

xgb_model = xgb.XGBRegressor(
    n_estimators=5000,         # потолок — ограничит early stopping
    learning_rate=0.01,        # малый lr
    max_depth=6,
    min_child_weight=5,
    subsample=0.8,
    colsample_bytree=0.8,      # случайные признаки на дерево
    reg_alpha=0.1,             # L1 регуляризация листьев
    reg_lambda=1.0,            # L2 регуляризация листьев
    early_stopping_rounds=50,  # главная защита от переобучения
    eval_metric='rmse',
    random_state=42,
    n_jobs=-1,
)

xgb_model.fit(
    X_train_xgb, y_train_xgb,
    eval_set=[(X_val, y_val)],
    verbose=500,
)

print(f'Лучшее дерево: {xgb_model.best_iteration}')
print(f'Val RMSE: {xgb_model.best_score:.4f}')
print(f'Test RMSE: {np.sqrt(mean_squared_error(y_test, xgb_model.predict(X_test))):.4f}')</code></pre>

      <h4>3. LightGBM — самый быстрый для больших таблиц</h4>
      <pre><code>import lightgbm as lgb

lgb_model = lgb.LGBMRegressor(
    n_estimators=5000,
    learning_rate=0.01,
    max_depth=-1,              # -1 = без ограничений (leaf-wise управляет)
    num_leaves=63,             # главный параметр в LightGBM (2^max_depth - 1)
    min_child_samples=20,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=1.0,
    n_jobs=-1,
    random_state=42,
)

callbacks = [lgb.early_stopping(50, verbose=False),
             lgb.log_evaluation(500)]

lgb_model.fit(
    X_train_xgb, y_train_xgb,
    eval_set=[(X_val, y_val)],
    callbacks=callbacks,
)

print(f'Лучшее дерево: {lgb_model.best_iteration_}')
print(f'Test RMSE: {np.sqrt(mean_squared_error(y_test, lgb_model.predict(X_test))):.4f}')

# Важность признаков
feat_imp = lgb_model.feature_importances_
feat_names = data.feature_names
for name, imp in sorted(zip(feat_names, feat_imp), key=lambda x: -x[1]):
    print(f'  {name:25}: {imp}')</code></pre>

      <h4>4. Huber Loss для зашумлённых данных</h4>
      <pre><code># Добавим выбросы к данным
X_noisy = X_train.copy()
y_noisy = y_train.copy()
n_outliers = 50
idx = np.random.choice(len(y_noisy), n_outliers, replace=False)
y_noisy[idx] = y_noisy[idx] + np.random.choice([-10, 10], n_outliers)

mse_model   = GradientBoostingRegressor(loss='squared_error', n_estimators=200,
                                         learning_rate=0.1, max_depth=4, random_state=42)
huber_model = GradientBoostingRegressor(loss='huber', alpha=0.9, n_estimators=200,
                                         learning_rate=0.1, max_depth=4, random_state=42)

for name, model in [('MSE', mse_model), ('Huber', huber_model)]:
    model.fit(X_noisy, y_noisy)
    pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, pred))
    print(f'{name}: Test RMSE = {rmse:.4f}')</code></pre>
    `,

    applications: `
      <h3>Где применяется Gradient Boosting Regression</h3>
      <table>
        <tr><th>Область</th><th>Задача</th></tr>
        <tr><td><b>Kaggle-соревнования</b></td><td>XGBoost/LightGBM/CatBoost доминируют в топах на табличных данных</td></tr>
        <tr><td><b>Финансы</b></td><td>Прогноз цен, дохода, рисков (LGD, PD), оценка стоимости активов</td></tr>
        <tr><td><b>Retail и логистика</b></td><td>Прогноз спроса, оптимизация остатков, прогноз доставки</td></tr>
        <tr><td><b>Страхование</b></td><td>Расчёт премий, прогноз выплат, оценка рисков</td></tr>
        <tr><td><b>Прогноз продаж</b></td><td>Долгосрочное планирование, сезонность, эффект акций</td></tr>
        <tr><td><b>Энергетика</b></td><td>Прогноз потребления электроэнергии, цен на рынке</td></tr>
        <tr><td><b>Медицина</b></td><td>Прогноз длительности госпитализации, дозировки препаратов</td></tr>
      </table>
        `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Лучшая точность среди классических ML-методов на табличных данных</li>
            <li>Не требует стандартизации признаков</li>
            <li>Встроенная важность признаков и SHAP</li>
            <li>Гибкие функции потерь (MSE, MAE, Huber, Quantile)</li>
            <li>Хорошо работает с пропусками (XGBoost, LightGBM)</li>
            <li>Поддержка категориальных признаков (LightGBM, CatBoost)</li>
            <li>Early Stopping — надёжная защита от переобучения</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Последовательное обучение — нельзя распараллелить деревья</li>
            <li>Много гиперпараметров (lr, n_est, depth, subsample, ...)</li>
            <li>Склонен к переобучению без ранней остановки</li>
            <li>Медленнее Random Forest при обучении</li>
            <li>Плохо экстраполирует за пределы обучающего диапазона</li>
            <li>Требует больше данных для хорошей работы, чем RF</li>
          </ul>
        </div>
      </div>

      <h3>Gradient Boosting vs Random Forest регрессия</h3>
      <div class="example-data-table">
        <table>
          <tr><th>Критерий</th><th>Gradient Boosting</th><th>Random Forest</th></tr>
          <tr><td>Точность при тюнинге</td><td>Выше</td><td>Немного ниже</td></tr>
          <tr><td>Скорость обучения</td><td>Медленнее</td><td>Быстрее (параллельно)</td></tr>
          <tr><td>Переобучение</td><td>Сильное (нужен ES)</td><td>Умеренное</td></tr>
          <tr><td>«Из коробки»</td><td>Нужен тюнинг</td><td>Работает сразу</td></tr>
          <tr><td>Выбросы в y</td><td>Чувствителен (MSE)</td><td>Устойчив</td></tr>
          <tr><td>Число параметров</td><td>5–7</td><td>3–4</td></tr>
          <tr><td>Категориальные</td><td>LightGBM/CatBoost</td><td>Нет (OHE)</td></tr>
        </table>
      </div>

      <h3>Какую библиотеку выбрать</h3>
      <ul>
        <li><b>sklearn GradientBoostingRegressor:</b> быстрый старт, маленькие данные (&lt;50K строк), нет зависимостей.</li>
        <li><b>XGBoost:</b> стандарт на соревнованиях, отличная документация, GPU-поддержка.</li>
        <li><b>LightGBM:</b> самый быстрый на больших данных (&gt;100K строк), поддержка категориальных признаков.</li>
        <li><b>CatBoost:</b> лучший выбор при множестве категориальных признаков, не требует OHE.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=3CC4N4z3GJc" target="_blank">StatQuest: Gradient Boost</a> — пошаговое построение градиентного бустинга для регрессии</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%D0%BD%D1%8B%D0%B9%20%D0%B1%D1%83%D1%81%D1%82%D0%B8%D0%BD%D0%B3%20%D1%80%D0%B5%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D1%8F" target="_blank">Градиентный бустинг на Habr</a> — теория и реализация на русском языке</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://xgboost.readthedocs.io/en/stable/" target="_blank">XGBoost документация</a> — официальная документация XGBoost</li>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.GradientBoostingRegressor.html" target="_blank">sklearn: GradientBoostingRegressor</a> — документация градиентного бустинга для регрессии в sklearn</li>
      </ul>
    `,
  },
});
