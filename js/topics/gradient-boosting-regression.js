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
        <div class="caption">Gradient Boosting регрессия: $F_0 = \bar{y}$, затем каждое дерево $h_t$ обучается предсказывать остатки $r_t = y - F_{t-1}(x)$. Финальная модель — сумма всех деревьев с шагом $\eta$.</div>
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
        title: 'Gradient Boosting вручную: 4 итерации',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучить Gradient Boosting на 5 точках вручную (4 итерации, η=0.5, глубина дерева=1). Показать, как остатки уменьшаются с каждым шагом.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>ID</th><th>x</th><th>y (факт)</th></tr>
              <tr><td>1</td><td>1</td><td>3.0</td></tr>
              <tr><td>2</td><td>2</td><td>5.5</td></tr>
              <tr><td>3</td><td>3</td><td>6.0</td></tr>
              <tr><td>4</td><td>4</td><td>8.0</td></tr>
              <tr><td>5</td><td>5</td><td>9.5</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: F₀ = среднее(y)</h4>
            <div class="calc">
              ȳ = (3.0 + 5.5 + 6.0 + 8.0 + 9.5) / 5 = 32.0 / 5 = <b>6.4</b><br>
              F₀(x) = 6.4 для всех x<br><br>
              Остатки r¹ = y − F₀:<br>
              r¹₁ = 3.0 − 6.4 = <b>−3.4</b><br>
              r¹₂ = 5.5 − 6.4 = <b>−0.9</b><br>
              r¹₃ = 6.0 − 6.4 = <b>−0.4</b><br>
              r¹₄ = 8.0 − 6.4 = <b>+1.6</b><br>
              r¹₅ = 9.5 − 6.4 = <b>+3.1</b><br>
              MSE₀ = (11.56+0.81+0.16+2.56+9.61)/5 = 4.94
            </div>
            <div class="why">F₀ = среднее — это «нулевая гипотеза». Мы начинаем с самого грубого предсказания.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: Дерево h₁ обучается на r¹ (глубина=1)</h4>
            <div class="calc">
              Ищем лучший разрез для минимизации MSE остатков:<br><br>
              Разрез x ≤ 2: группа {1,2}, группа {3,4,5}<br>
              Лист L: mean(r¹₁, r¹₂) = mean(−3.4, −0.9) = −2.15<br>
              Лист R: mean(r¹₃, r¹₄, r¹₅) = mean(−0.4, 1.6, 3.1) = 1.43<br><br>
              Разрез x ≤ 3: группа {1,2,3}, группа {4,5}<br>
              Лист L: mean(−3.4, −0.9, −0.4) = −1.57<br>
              Лист R: mean(1.6, 3.1) = 2.35<br><br>
              (проверяем MSE, выбираем x≤3 как лучший):<br>
              MSE(x≤3): {L: (−3.4+1.57)²+(−0.9+1.57)²+(−0.4+1.57)²}/5 + ... = 0.86<br>
              MSE(x≤2): выше → выбираем разрез x≤3<br><br>
              h₁(x): x≤3 → −1.57, x>3 → +2.35
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: Обновление F₁ = F₀ + η·h₁ (η=0.5)</h4>
            <div class="calc">
              F₁(x≤3) = 6.4 + 0.5·(−1.57) = 6.4 − 0.785 = <b>5.615</b><br>
              F₁(x>3) = 6.4 + 0.5·(2.35)  = 6.4 + 1.175 = <b>7.575</b><br><br>
              Новые остатки r²:<br>
              r²₁ = 3.0 − 5.615 = −2.615<br>
              r²₂ = 5.5 − 5.615 = −0.115<br>
              r²₃ = 6.0 − 5.615 = +0.385<br>
              r²₄ = 8.0 − 7.575 = +0.425<br>
              r²₅ = 9.5 − 7.575 = +1.925<br>
              MSE₁ = (6.84+0.01+0.15+0.18+3.71)/5 = <b>2.18</b> (было 4.94)
            </div>
            <div class="why">MSE упал с 4.94 до 2.18 — в 2 раза! Одно дерево уже значительно улучшило модель.</div>
          </div>
          <div class="step" data-step="4">
            <h4>Шаг 4: Итерация 2 — h₂ обучается на r²</h4>
            <div class="calc">
              Лучший разрез для r²: x≤1<br>
              Лист L: mean(r²₁) = −2.615<br>
              Лист R: mean(r²₂,...,r²₅) = mean(−0.115, 0.385, 0.425, 1.925) = 0.655<br><br>
              h₂: x≤1 → −2.615, x>1 → 0.655<br><br>
              F₂(x=1) = 5.615 + 0.5·(−2.615) = 4.307<br>
              F₂(x=2,3) = 5.615 + 0.5·0.655 = 5.943<br>
              F₂(x=4,5) = 7.575 + 0.5·0.655 = 7.903<br><br>
              MSE₂ ≈ <b>1.08</b> (продолжает снижаться)
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Прогресс: MSE₀=4.94 → MSE₁=2.18 → MSE₂=1.08. За 2 итерации MSE упал в 4.6 раза. С η=0.5 сходимость умеренная; с η=0.1 нужно ~50 итераций, но качество лучше.</p>
          </div>
          <div class="lesson-box">
            Ключевой паттерн: каждое дерево «видит» то, что предыдущие не объяснили. Первое дерево убрало главный тренд, второе — уточнило крайние точки. Это и есть «последовательное исправление ошибок».
          </div>
        `,
      },
      {
        title: 'Early Stopping: когда остановить обучение',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Продемонстрировать на таблице, как Train и Validation RMSE меняются с числом деревьев. Найти оптимальное число итераций.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>n_estimators</th><th>Train RMSE</th><th>Val RMSE</th><th>Диагноз</th></tr>
              <tr><td>10</td><td>3.21</td><td>3.45</td><td>Недообучение</td></tr>
              <tr><td>50</td><td>1.87</td><td>1.98</td><td>Улучшение</td></tr>
              <tr><td>100</td><td>1.42</td><td>1.51</td><td>Хорошо</td></tr>
              <tr><td>200</td><td>1.08</td><td>1.34</td><td>Хорошо</td></tr>
              <tr><td>300</td><td>0.84</td><td>1.29</td><td>Оптимум val!</td></tr>
              <tr><td>500</td><td>0.61</td><td>1.35</td><td>Переобучение</td></tr>
              <tr><td>1000</td><td>0.33</td><td>1.48</td><td>Сильное переобучение</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: интерпретация таблицы</h4>
            <div class="calc">
              До 300 деревьев: оба RMSE снижаются → недообучение устраняется<br>
              При 300 деревьях: Val RMSE = 1.29 — минимум<br>
              После 300: Train RMSE продолжает падать (0.84, 0.61, 0.33)<br>
              Val RMSE растёт (1.35, 1.48) → переобучение<br><br>
              Расхождение Train/Val при 1000: 0.33 vs 1.48 = 4.5×
              Это классический признак переобучения бустинга.
            </div>
            <div class="why">Gradient Boosting не перестаёт обучаться сам по себе. Нужен явный механизм остановки.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: Early Stopping в sklearn</h4>
            <div class="calc">
              from sklearn.ensemble import GradientBoostingRegressor<br><br>
              gb = GradientBoostingRegressor(<br>
                  n_estimators=1000,  # потолок<br>
                  learning_rate=0.05,<br>
                  max_depth=4,<br>
                  validation_fraction=0.15,  # часть train как val<br>
                  n_iter_no_change=20,        # остановить если 20 итер. без улучшения<br>
                  tol=1e-4,<br>
                  random_state=42<br>
              )<br>
              gb.fit(X_train, y_train)<br>
              print(gb.n_estimators_)  # реальное число деревьев
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: Early Stopping в XGBoost (ещё гибче)</h4>
            <div class="calc">
              import xgboost as xgb<br><br>
              model = xgb.XGBRegressor(<br>
                  n_estimators=1000,<br>
                  learning_rate=0.05,<br>
                  max_depth=4,<br>
                  early_stopping_rounds=50,  # остановить после 50 без улучшения<br>
                  eval_metric='rmse',<br>
                  random_state=42,<br>
              )<br>
              model.fit(<br>
                  X_train, y_train,<br>
                  eval_set=[(X_val, y_val)],<br>
                  verbose=100<br>
              )<br>
              print(f'Оптимум: {model.best_iteration} деревьев')
            </div>
            <div class="why">Early stopping — главная защита от переобучения в бустинге. Позволяет смело ставить n_estimators=10000 и не беспокоиться.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимум: 300 деревьев (Val RMSE=1.29). После — переобучение. Стратегия: ставить n_estimators=1000–5000, включать early_stopping_rounds=50, находить оптимум автоматически.</p>
          </div>
          <div class="lesson-box">
            Общее правило: меньше learning_rate → позже оптимум → нужно больше деревьев → больше потенциал для роста качества. lr=0.01 + n=5000 + early_stopping — стандарт для соревнований.
          </div>
        `,
      },
      {
        title: 'Huber Loss vs MSE: когда важна устойчивость',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить GradientBoosting с loss='squared_error' и loss='huber' на данных с выбросами. Показать, как Huber Loss защищает от них.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Объект</th><th>x</th><th>y</th><th>Примечание</th></tr>
              <tr><td>1–15</td><td>1–15</td><td>≈ 2x + шум±1</td><td>Нормальные точки</td></tr>
              <tr><td>16</td><td>8</td><td>50.0</td><td>Выброс (ошибка измерения)!</td></tr>
              <tr><td>17</td><td>12</td><td>−10.0</td><td>Выброс!</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что происходит с MSE при выбросах</h4>
            <div class="calc">
              Выброс (x=8, y=50): нормальное значение ≈ 16<br>
              Остаток r = 50 − 16 = 34<br>
              MSE штраф: 34² = <b>1156</b><br>
              Нормальная ошибка (r=1): штраф = 1<br><br>
              Один выброс весит как 1156 нормальных точек!<br>
              GB с MSE будет «работать» на выброс несколько деревьев подряд<br>
              Это искажает предсказания для нормальных точек рядом
            </div>
            <div class="why">MSE Loss: квадратичная чувствительность к выбросам. Один выброс может «украсть» несколько деревьев ансамбля.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: Huber Loss обрезает влияние выбросов</h4>
            <div class="calc">
              Huber Loss с δ = 5.0:<br>
              При r &lt; 5: L(r) = r²/2 (MSE-режим)<br>
              При r ≥ 5: L(r) = δ·(|r| − δ/2) = 5·(r − 2.5) (MAE-режим)<br><br>
              Выброс (r=34): Huber штраф = 5·(34 − 2.5) = <b>157.5</b><br>
              vs MSE штраф = 1156<br>
              В 7.3× меньше влияние!<br><br>
              Псевдо-остаток Huber для выброса: sign(r)·δ = +5.0<br>
              vs MSE псевдо-остаток: r = 34<br>
              Дерево «видит» выброс как отклонение 5, а не 34
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: результаты сравнения</h4>
            <div class="calc">
              На 15 нормальных точках (без выбросов в тесте):<br><br>
              GBR с MSE + выбросы в train:<br>
                Train RMSE = 4.2 (выбросы «тянут» деревья)<br>
                Test RMSE  = 3.8 (искажённая модель)<br><br>
              GBR с Huber + выбросы в train:<br>
                Train RMSE = 1.8 (модель игнорирует выбросы)<br>
                Test RMSE  = 1.5 (почти как без выбросов!)<br><br>
              GBR с MSE без выбросов (идеал):<br>
                Test RMSE  = 1.2
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>С выбросами: Huber Test RMSE=1.5 vs MSE Test RMSE=3.8. Huber в 2.5× точнее. Параметр δ (в sklearn: alpha — квантиль): если 90% ошибок «нормальные» → alpha=0.9 автоматически настраивает δ.</p>
          </div>
          <div class="lesson-box">
            Используй Huber если: в данных есть ошибки измерений, известно что часть y — артефакты, задача предсказания медианы важнее среднего. Для чистых данных MSE или MAE часто достаточно.
          </div>
        `,
      },
    ],

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

    math: `
      <h3>Алгоритм Gradient Boosting (MSE)</h3>
      <p><b>Инициализация:</b></p>
      <div class="math-block">$$F_0(x) = \\arg\\min_\\gamma \\sum_{i=1}^n L(y_i, \\gamma) = \\bar{y}$$</div>

      <p><b>Итерация m=1,...,M:</b></p>
      <div class="math-block">$$r_i^{(m)} = -\\left[\\frac{\\partial L(y_i, F(x_i))}{\\partial F(x_i)}\\right]_{F=F_{m-1}} = y_i - F_{m-1}(x_i)$$</div>
      <div class="math-block">$$h_m = \\arg\\min_h \\sum_i (r_i^{(m)} - h(x_i))^2$$</div>
      <div class="math-block">$$F_m(x) = F_{m-1}(x) + \\eta \\cdot h_m(x)$$</div>

      <h3>Функции потерь и псевдо-остатки</h3>
      <div class="example-data-table">
        <table>
          <tr><th>Loss</th><th>L(y, F)</th><th>Псевдо-остаток $-\partial L / \partial F$</th></tr>
          <tr><td>MSE</td><td>$(y-F)^2/2$</td><td>$y - F$</td></tr>
          <tr><td>MAE</td><td>$|y-F|$</td><td>$\text{sign}(y - F)$</td></tr>
          <tr><td>Huber</td><td>$(r^2/2$ if $|r|\leq\delta)$</td><td>$r$ if $|r|\leq\delta$, else $\delta\cdot\text{sign}(r)$</td></tr>
          <tr><td>Quantile (α)</td><td>Pinball</td><td>$\alpha$ if $r>0$, else $\alpha - 1$</td></tr>
        </table>
      </div>

      <h3>XGBoost: второй порядок Тейлора</h3>
      <div class="math-block">$$L^{(m)} \\approx \\sum_i \\left[ g_i h_m(x_i) + \\frac{1}{2} k_i h_m^2(x_i) \\right] + \\Omega(h_m)$$</div>
      <p>Где $g_i = \\partial L/\\partial F_{m-1}$ — градиент, $k_i = \\partial^2 L/\\partial F_{m-1}^2$ — гессиан.</p>
      <div class="math-block">$$\\Omega(h) = \\gamma T + \\frac{1}{2}\\lambda \\sum_{j=1}^T w_j^2$$</div>
      <p>$T$ — число листьев, $w_j$ — значение листа $j$.</p>

      <h3>Оптимальные значения листьев (XGBoost)</h3>
      <div class="math-block">$$w_j^* = -\\frac{\\sum_{i \\in I_j} g_i}{\\sum_{i \\in I_j} k_i + \\lambda}$$</div>

      <h3>Gain от разбиения</h3>
      <div class="math-block">$$\\text{Gain} = \\frac{1}{2}\\left[\\frac{G_L^2}{H_L+\\lambda} + \\frac{G_R^2}{H_R+\\lambda} - \\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}\\right] - \\gamma$$</div>
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
  },
});
