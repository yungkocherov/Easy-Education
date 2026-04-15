/* ==========================================================================
   Временные ряды
   ========================================================================== */
App.registerTopic({
  id: 'time-series',
  category: 'stats',
  title: 'Временные ряды',
  summary: 'Тренд, сезонность, стационарность, ARIMA, Prophet — анализ данных во времени.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Погода, биржевые котировки, продажи магазина, пульс пациента — это всё <b>временные ряды</b>: данные, где порядок наблюдений имеет значение. Нельзя перемешать наблюдения — это разрушит саму структуру данных.</p>
        <p>Представь историю продаж кофейни: в понедельник меньше, в пятницу больше, летом — пик (люди на улице), зимой — спад. Это не случайные числа. Есть <b>тренд</b> (растём год к году), <b>сезонность</b> (недельный и годовой цикл) и <b>шум</b> (случайные флуктуации).</p>
        <p>Задача анализа временных рядов: разложить сигнал на эти компоненты, понять закономерности и сделать прогноз на будущее.</p>
      </div>

      <h3>📐 Компоненты временного ряда</h3>
      <p>Любой временной ряд $Y_t$ можно разложить на три составляющие:</p>
      <ul>
        <li><b>Тренд (T):</b> долгосрочное направление. Продажи растут год к году? Популяция снижается? Это тренд.</li>
        <li><b>Сезонность (S):</b> регулярно повторяющиеся паттерны фиксированного периода. День недели, месяц года, час дня.</li>
        <li><b>Остаток / Шум (R):</b> то, что нельзя объяснить трендом и сезонностью. Идеально — белый шум.</li>
      </ul>

      <h4>Аддитивная vs мультипликативная декомпозиция:</h4>
      <div class="math-block">$$\\text{Аддитивная:}\\quad Y_t = T_t + S_t + R_t$$</div>
      <div class="math-block">$$\\text{Мультипликативная:}\\quad Y_t = T_t \\times S_t \\times R_t$$</div>
      <p>Аддитивная: когда амплитуда сезонности постоянна (летом всегда +100 продаж). Мультипликативная: когда амплитуда растёт вместе с уровнем ряда (летом всегда +20% от текущего уровня).</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 210" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="15" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Декомпозиция временного ряда</text>
          <!-- Original -->
          <text x="14" y="42" font-size="9" font-weight="600" fill="#334155">Ряд Y</text>
          <polyline points="40,55 70,40 100,50 130,35 160,45 190,30 220,40 250,25 280,35 310,22 340,30 370,18 400,28 430,15 460,22 490,12 520,20" fill="none" stroke="#6366f1" stroke-width="2"/>
          <!-- Trend -->
          <text x="14" y="90" font-size="9" font-weight="600" fill="#334155">Тренд T</text>
          <line x1="40" y1="100" x2="520" y2="60" stroke="#0284c7" stroke-width="2.5"/>
          <!-- Seasonality wavy -->
          <text x="14" y="138" font-size="9" font-weight="600" fill="#334155">Сезон S</text>
          <polyline points="40,150 70,135 100,150 130,135 160,150 190,135 220,150 250,135 280,150 310,135 340,150 370,135 400,150 430,135 460,150 490,135 520,150" fill="none" stroke="#16a34a" stroke-width="2"/>
          <!-- Residual -->
          <text x="14" y="186" font-size="9" font-weight="600" fill="#334155">Шум R</text>
          <polyline points="40,192 70,195 100,190 130,194 160,191 190,196 220,193 250,189 280,194 310,191 340,195 370,192 400,189 430,194 460,191 490,196 520,192" fill="none" stroke="#f59e0b" stroke-width="1.5"/>
          <!-- Arrows between -->
          <text x="270" y="74" font-size="18" fill="#64748b" text-anchor="middle">=</text>
          <text x="270" y="122" font-size="18" fill="#64748b" text-anchor="middle">+</text>
          <text x="270" y="172" font-size="18" fill="#64748b" text-anchor="middle">+</text>
        </svg>
        <div class="caption">Временной ряд (фиолетовый) = тренд (синий, линейный рост) + сезонность (зелёный, периодические колебания) + остаток-шум (жёлтый).</div>
      </div>

      <h3>📏 Стационарность</h3>
      <p><span class="term" data-tip="Стационарный ряд. Ряд, у которого среднее, дисперсия и автоковариация постоянны во времени. Большинство классических методов прогнозирования требуют стационарности.">Стационарность</span> — критически важное свойство. Ряд стационарен, если его среднее и дисперсия не меняются со временем.</p>
      <p>Почему важно: ARIMA и большинство классических методов предполагают стационарность. Нестационарный ряд (с трендом) даст «ложную» корреляцию между несвязанными переменными.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 260" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Стационарный vs нестационарный ряд</text>
          <!-- TOP: stationary -->
          <g>
            <text x="350" y="38" text-anchor="middle" font-size="11" font-weight="600" fill="#059669">Стационарный: среднее и дисперсия постоянны</text>
            <line x1="40" y1="130" x2="670" y2="130" stroke="#94a3b8" stroke-width="1"/>
            <line x1="40" y1="60" x2="40" y2="130" stroke="#94a3b8" stroke-width="1"/>
            <!-- Mean line -->
            <line x1="40" y1="95" x2="670" y2="95" stroke="#059669" stroke-width="1.5" stroke-dasharray="4,2"/>
            <text x="650" y="91" font-size="9" fill="#059669">μ</text>
            <!-- Stationary series: fluctuates around mean -->
            <polyline points="40,90 60,82 80,100 100,88 120,105 140,85 160,95 180,108 200,88 220,100 240,82 260,95 280,105 300,85 320,100 340,88 360,105 380,90 400,100 420,85 440,108 460,90 480,98 500,88 520,105 540,85 560,100 580,92 600,108 620,85 640,98 660,90" fill="none" stroke="#059669" stroke-width="1.8"/>
          </g>
          <!-- BOTTOM: non-stationary with trend -->
          <g>
            <text x="350" y="160" text-anchor="middle" font-size="11" font-weight="600" fill="#dc2626">Нестационарный: среднее растёт (тренд)</text>
            <line x1="40" y1="250" x2="670" y2="250" stroke="#94a3b8" stroke-width="1"/>
            <line x1="40" y1="175" x2="40" y2="250" stroke="#94a3b8" stroke-width="1"/>
            <!-- Trend line -->
            <line x1="40" y1="240" x2="670" y2="180" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,2"/>
            <text x="650" y="178" font-size="9" fill="#dc2626">μ(t) ↑</text>
            <!-- Non-stationary series with upward drift -->
            <polyline points="40,238 60,230 80,245 100,228 120,238 140,215 160,225 180,230 200,210 220,218 240,200 260,210 280,215 300,195 320,205 340,188 360,200 380,190 400,198 420,180 440,195 460,178 480,188 500,182 520,195 540,175 560,188 580,172 600,185 620,168 640,180 660,165" fill="none" stroke="#dc2626" stroke-width="1.8"/>
          </g>
        </svg>
        <div class="caption">Стационарный ряд (сверху) колеблется вокруг постоянного среднего. Нестационарный (снизу) имеет тренд — среднее меняется во времени. Нестационарность — причина «ложных» корреляций и плохих прогнозов.</div>
      </div>

      <h4>Как проверить: тест Дики-Фуллера</h4>
      <p>Расширенный <a class="glossary-link" onclick="App.selectTopic('glossary-stationarity')">тест Дики-Фуллера (ADF)</a> проверяет гипотезу H₀: ряд нестационарен (есть единичный корень). Если p-value < 0.05 — отвергаем H₀, ряд стационарен.</p>

      <h4>Как сделать стационарным:</h4>
      <ul>
        <li><b>Дифференцирование (d):</b> $Y'_t = Y_t - Y_{t-1}$. Убирает тренд. Первое дифференцирование снимает линейный тренд, второе — квадратичный.</li>
        <li><b>Логарифмирование + дифференцирование:</b> $\\log(Y_t) - \\log(Y_{t-1})$ — для мультипликативного тренда.</li>
        <li><b>Сезонное дифференцирование:</b> $Y_t - Y_{t-m}$ (m = период сезонности) — убирает сезонность.</li>
      </ul>

      <h3>🔁 <a class="glossary-link" onclick="App.selectTopic('glossary-arima')">Автокорреляция</a> (ACF и PACF)</h3>
      <p><span class="term" data-tip="ACF (Autocorrelation Function). Корреляция ряда с его собственной задержанной версией. ACF(k) = cor(Yt, Yt-k). Помогает определить порядок MA компоненты.">ACF (Autocorrelation Function)</span> показывает корреляцию ряда с самим собой при задержке k.</p>
      <p><span class="term" data-tip="PACF (Partial Autocorrelation Function). Прямая корреляция Yt и Yt-k, исключая влияние промежуточных лагов. Помогает определить порядок AR компоненты.">PACF (Partial Autocorrelation Function)</span> — та же корреляция, но за вычетом влияния промежуточных лагов.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style="max-width:700px;">
          <text x="350" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">ACF-коррелограмма: 3 типичных паттерна</text>
          <!-- WHITE NOISE -->
          <g>
            <text x="120" y="36" text-anchor="middle" font-size="11" font-weight="600" fill="#64748b">Белый шум</text>
            <line x1="30" y1="140" x2="220" y2="140" stroke="#475569" stroke-width="1"/>
            <line x1="30" y1="60" x2="30" y2="220" stroke="#475569" stroke-width="1"/>
            <line x1="30" y1="60" x2="220" y2="60" stroke="#cbd5e1" stroke-width="0.7" stroke-dasharray="2,2"/>
            <line x1="30" y1="220" x2="220" y2="220" stroke="#cbd5e1" stroke-width="0.7" stroke-dasharray="2,2"/>
            <!-- Significance bounds (±1.96/√n dashed) -->
            <line x1="30" y1="115" x2="220" y2="115" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
            <line x1="30" y1="165" x2="220" y2="165" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
            <!-- Lag 0: always 1 -->
            <line x1="42" y1="140" x2="42" y2="60" stroke="#0284c7" stroke-width="2.5"/>
            <!-- Other lags: small random values -->
            <line x1="58" y1="140" x2="58" y2="128" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="74" y1="140" x2="74" y2="148" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="90" y1="140" x2="90" y2="135" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="106" y1="140" x2="106" y2="150" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="122" y1="140" x2="122" y2="132" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="138" y1="140" x2="138" y2="146" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="154" y1="140" x2="154" y2="137" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="170" y1="140" x2="170" y2="143" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="186" y1="140" x2="186" y2="134" stroke="#0284c7" stroke-width="2.5"/>
            <line x1="202" y1="140" x2="202" y2="145" stroke="#0284c7" stroke-width="2.5"/>
            <text x="25" y="64" text-anchor="end" font-size="8" fill="#64748b">1</text>
            <text x="25" y="143" text-anchor="end" font-size="8" fill="#64748b">0</text>
            <text x="25" y="223" text-anchor="end" font-size="8" fill="#64748b">−1</text>
            <text x="120" y="245" text-anchor="middle" font-size="9" fill="#64748b">лаг</text>
            <text x="120" y="260" text-anchor="middle" font-size="9" fill="#64748b">Все лаги в пределах порога</text>
          </g>
          <!-- TREND -->
          <g>
            <text x="350" y="36" text-anchor="middle" font-size="11" font-weight="600" fill="#b45309">Ряд с трендом</text>
            <line x1="260" y1="140" x2="450" y2="140" stroke="#475569" stroke-width="1"/>
            <line x1="260" y1="60" x2="260" y2="220" stroke="#475569" stroke-width="1"/>
            <line x1="260" y1="115" x2="450" y2="115" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
            <line x1="260" y1="165" x2="450" y2="165" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
            <!-- Slow decay -->
            <line x1="272" y1="140" x2="272" y2="60" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="288" y1="140" x2="288" y2="65" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="304" y1="140" x2="304" y2="72" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="320" y1="140" x2="320" y2="80" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="336" y1="140" x2="336" y2="88" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="352" y1="140" x2="352" y2="96" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="368" y1="140" x2="368" y2="104" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="384" y1="140" x2="384" y2="110" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="400" y1="140" x2="400" y2="116" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="416" y1="140" x2="416" y2="120" stroke="#f59e0b" stroke-width="2.5"/>
            <line x1="432" y1="140" x2="432" y2="124" stroke="#f59e0b" stroke-width="2.5"/>
            <text x="350" y="245" text-anchor="middle" font-size="9" fill="#64748b">лаг</text>
            <text x="350" y="260" text-anchor="middle" font-size="9" fill="#64748b">Медленное затухание</text>
          </g>
          <!-- SEASONAL -->
          <g>
            <text x="580" y="36" text-anchor="middle" font-size="11" font-weight="600" fill="#7c3aed">Сезонный ряд (период 4)</text>
            <line x1="490" y1="140" x2="680" y2="140" stroke="#475569" stroke-width="1"/>
            <line x1="490" y1="60" x2="490" y2="220" stroke="#475569" stroke-width="1"/>
            <line x1="490" y1="115" x2="680" y2="115" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
            <line x1="490" y1="165" x2="680" y2="165" stroke="#3b82f6" stroke-width="1" stroke-dasharray="3,2" opacity="0.5"/>
            <!-- Periodic spikes every 4 lags -->
            <line x1="502" y1="140" x2="502" y2="60" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="518" y1="140" x2="518" y2="135" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="534" y1="140" x2="534" y2="150" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="550" y1="140" x2="550" y2="136" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="566" y1="140" x2="566" y2="75" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="582" y1="140" x2="582" y2="148" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="598" y1="140" x2="598" y2="133" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="614" y1="140" x2="614" y2="146" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="630" y1="140" x2="630" y2="85" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="646" y1="140" x2="646" y2="150" stroke="#8b5cf6" stroke-width="2.5"/>
            <line x1="662" y1="140" x2="662" y2="135" stroke="#8b5cf6" stroke-width="2.5"/>
            <text x="580" y="245" text-anchor="middle" font-size="9" fill="#64748b">лаг</text>
            <text x="580" y="260" text-anchor="middle" font-size="9" fill="#64748b">Пики на лагах 4, 8, 12…</text>
          </g>
        </svg>
        <div class="caption">По форме ACF-графика можно диагностировать характер ряда. Белый шум: все столбики в пределах голубых порогов. Тренд: медленное затухание. Сезонность: всплески на кратных периоду лагах.</div>
      </div>
      <p>Правила выбора порядков ARIMA по ACF/PACF:</p>
      <ul>
        <li>PACF обрывается на лаге p → AR(p)</li>
        <li>ACF обрывается на лаге q → MA(q)</li>
        <li>Оба затухают экспоненциально → ARMA(p, q)</li>
      </ul>

      <h3>📈 <a class="glossary-link" onclick="App.selectTopic('glossary-arima')">ARIMA</a>: авторегрессия + интеграция + скользящее среднее</h3>
      <p><span class="term" data-tip="ARIMA(p,d,q). p = порядок авторегрессии (AR), d = степень дифференцирования (I), q = порядок скользящего среднего (MA). Универсальная модель для стационаризированных рядов.">ARIMA(p, d, q)</span> — три компоненты:</p>
      <ul>
        <li><b>AR(p) — авторегрессия:</b> текущее значение зависит от p предыдущих. $Y_t = \\phi_1 Y_{t-1} + ... + \\phi_p Y_{t-p} + \\varepsilon_t$</li>
        <li><b>I(d) — интеграция:</b> ряд дифференцируется d раз до стационарности.</li>
        <li><b>MA(q) — скользящее среднее:</b> учитываем q прошлых ошибок прогноза. $Y_t = \\varepsilon_t + \\theta_1\\varepsilon_{t-1} + ... + \\theta_q\\varepsilon_{t-q}$</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">ARIMA(1,1,1) расшифровка</div>
        <p>Берём ряд, дифференцируем 1 раз (I=1). На стационарном ряду строим AR(1): значение зависит от одного предыдущего. Ошибку корректируем MA(1): учитываем одну прошлую ошибку. Итого 3 параметра для подбора: φ₁, θ₁, константа.</p>
      </div>

      <h3>🌊 Сезонный <a class="glossary-link" onclick="App.selectTopic('glossary-arima')">ARIMA (SARIMA)</a></h3>
      <p>Для данных с сезонностью: SARIMA(p,d,q)(P,D,Q)[m], где m — период сезонности (12 для месячных данных). Добавляет сезонные AR, I, MA члены с шагом m.</p>

      <h3>📉 Экспоненциальное сглаживание</h3>
      <p>Прогноз — взвешенное среднее прошлых значений, где вес экспоненциально убывает:</p>
      <div class="math-block">$$\\hat{Y}_{t+1} = \\alpha Y_t + (1-\\alpha)\\hat{Y}_t, \\quad 0 < \\alpha < 1$$</div>
      <p>Метод Холта добавляет тренд, метод Холта-Уинтерса добавляет сезонность. ETS (Error, Trend, Seasonality) — автоматический выбор.</p>

      <h3>🔮 Prophet (Facebook)</h3>
      <p>Prophet — библиотека от Meta (2017). Декомпозиционная модель: $Y(t) = g(t) + s(t) + h(t) + \\varepsilon_t$, где g(t) — тренд (линейный или логистический), s(t) — сезонность (через ряды Фурье), h(t) — праздники.</p>
      <p>Плюсы Prophet: устойчив к пропущенным данным, автоматически определяет точки излома тренда, не требует стационарности, интерпретируемые компоненты. Подходит для бизнес-прогнозирования.</p>

      <h3>🔀 Кросс-валидация для временных рядов</h3>
      <p>Обычная k-fold нельзя: нельзя обучаться на «будущих» данных. Используют <b>walk-forward validation</b>: фиксируем начальный тренировочный набор, каждый следующий фолд добавляет один шаг, тест — всегда будущее.</p>

      <div class="deep-dive">
        <summary>Подробнее: признаки Фурье и сезонность</summary>
        <div class="deep-dive-body">
          <p>Произвольную сезонность можно представить через ряд Фурье: набор синусов и косинусов разных частот. Prophet использует именно это для моделирования сезонности:</p>
          <div class="math-block">$$s(t) = \\sum_{n=1}^{N} \\left( a_n \\cos\\frac{2\\pi n t}{P} + b_n \\sin\\frac{2\\pi n t}{P} \\right)$$</div>
          <p>Преимущество: гибко описывает сложные паттерны (недельная + годовая сезонность одновременно), не требует регулярных наблюдений.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: LSTM для временных рядов</summary>
        <div class="deep-dive-body">
          <p>LSTM (Long Short-Term Memory) — рекуррентная нейросеть, умеющая запоминать долгосрочные зависимости. Для временных рядов:</p>
          <ul>
            <li>Входной формат: (samples, timesteps, features) — «окно» прошлых значений</li>
            <li>Плюсы: ловит нелинейные зависимости, работает с multivariate рядами (много переменных)</li>
            <li>Минусы: нужно много данных, долго обучается, сложно настроить, хуже интерпретируем</li>
            <li>Когда брать: ARIMA/Prophet не справляются, есть > 10 000 наблюдений</li>
          </ul>
          <p>Современный подход: Temporal Fusion Transformer (TFT) часто бьёт LSTM на бенчмарках.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: инжиниринг признаков для временных рядов</summary>
        <div class="deep-dive-body">
          <p>Если использовать ML-модель (XGBoost, LightGBM) вместо ARIMA — нужно ручное создание признаков:</p>
          <ul>
            <li><b>Лаговые признаки:</b> Y(t-1), Y(t-2), ..., Y(t-k) — прошлые значения как признаки</li>
            <li><b>Скользящая статистика:</b> rolling_mean(7), rolling_std(30) — среднее и стандартное отклонение за последние N шагов</li>
            <li><b>Календарные признаки:</b> день недели, месяц, номер недели, is_weekend, is_holiday</li>
            <li><b>Разности:</b> Y(t) - Y(t-1), Y(t) - Y(t-7) — темп изменения</li>
            <li><b>Циклические признаки:</b> sin(2π × month/12), cos(2π × month/12) — для сохранения цикличности</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Линейная регрессия</b> — тренд = линейная регрессия по времени. Basis for ARIMA.</li>
        <li><b>Статистика (распределения, тесты)</b> — ADF тест, критерий нормальности остатков.</li>
        <li><b>Нейронные сети</b> — LSTM и Transformer для сложных многомерных рядов.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting</b> — мощный подход с ручным созданием лаговых признаков.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Декомпозиция продаж',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>По 24 месячным значениям продаж выявить тренд, сезонность и остаток вручную.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Мес.</th><th>Продажи</th><th>Мес.</th><th>Продажи</th><th>Мес.</th><th>Продажи</th></tr>
              <tr><td>Янв'22</td><td>120</td><td>Сен'22</td><td>165</td><td>Май'23</td><td>155</td></tr>
              <tr><td>Фев'22</td><td>118</td><td>Окт'22</td><td>145</td><td>Июн'23</td><td>192</td></tr>
              <tr><td>Мар'22</td><td>130</td><td>Ноя'22</td><td>138</td><td>Июл'23</td><td>198</td></tr>
              <tr><td>Апр'22</td><td>140</td><td>Дек'22</td><td>182</td><td>Авг'23</td><td>195</td></tr>
              <tr><td>Май'22</td><td>148</td><td>Янв'23</td><td>135</td><td>Сен'23</td><td>182</td></tr>
              <tr><td>Июн'22</td><td>175</td><td>Фев'23</td><td>132</td><td>Окт'23</td><td>162</td></tr>
              <tr><td>Июл'22</td><td>180</td><td>Мар'23</td><td>148</td><td>Ноя'23</td><td>154</td></tr>
              <tr><td>Авг'22</td><td>178</td><td>Апр'23</td><td>158</td><td>Дек'23</td><td>205</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: выявить тренд (скользящее среднее 12)</h4>
            <div class="calc">
              Среднее за первые 12 месяцев (Янв–Дек'22):<br>
              T₇ = (120+118+130+140+148+175+180+178+165+145+138+182) / 12<br>
              T₇ = 1819 / 12 ≈ 151.6<br><br>
              Среднее за мес. 2–13 (Фев'22–Янв'23):<br>
              T₈ = (1819 − 120 + 135) / 12 ≈ 152.8<br><br>
              Тренд за 2022–2023:<br>
              ~152 → ~158 → ~164 → ~170 (рост ≈ +6/квартал)
            </div>
            <div class="why">Скользящее среднее сглаживает сезонные колебания. Длина окна = период сезонности (12 для месячных данных). Центрированное скользящее среднее лучше отражает реальный тренд.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: выявить сезонность</h4>
            <div class="calc">
              Для каждого месяца берём среднее по всем годам:<br><br>
              Январь:  (120 + 135) / 2 = 127.5  → ниже среднего ~163 → индекс −35.5<br>
              Февраль: (118 + 132) / 2 = 125.0  → индекс −38.0<br>
              Июнь:    (175 + 192) / 2 = 183.5  → индекс +20.5<br>
              Июль:    (180 + 198) / 2 = 189.0  → индекс +26.0<br>
              Декабрь: (182 + 205) / 2 = 193.5  → индекс +30.5<br><br>
              Сезонный паттерн: пики в июне–августе (+20–+26) и декабре (+30.5).<br>
              Провал в январе–феврале (−35 – −38).
            </div>
            <div class="why">Два пика — летний (отпуска, активность) и декабрьский (праздники). Это типичный паттерн многих розничных продаж. Сезонность аддитивная: амплитуда не растёт с уровнем ряда.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: остаток = факт − тренд − сезонность</h4>
            <div class="calc">
              Для июня 2022 (t=6):<br>
              Факт = 175<br>
              Тренд ≈ 153<br>
              Сезонность ≈ +20.5<br>
              Остаток = 175 − 153 − 20.5 = +1.5<br><br>
              Для декабря 2023 (t=24):<br>
              Факт = 205<br>
              Тренд ≈ 172<br>
              Сезонность ≈ +30.5<br>
              Остаток = 205 − 172 − 30.5 = +2.5
            </div>
            <div class="why">Остатки близки к нулю — значит декомпозиция хорошо объясняет данные. Если остатки большие и коррелированные — модель плохо захватила паттерн.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Ряд имеет восходящий тренд (~+6 продаж/квартал) и аддитивную сезонность с двумя пиками: летним (июль, +26) и декабрьским (+30). Остатки малы — модель декомпозиции адекватна.</p>
          </div>
          <div class="lesson-box">
            На практике используй statsmodels.tsa.seasonal.seasonal_decompose() — она делает это автоматически. Для более гибкого STL-разложения: STL(series, period=12).fit().
          </div>
        `,
      },
      {
        title: 'Стационарность и дифференцирование',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Проверить стационарность ряда «вручную» и сделать его стационарным через дифференцирование.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>t</th><th>Y_t (исходный)</th><th>Y'_t = Y_t − Y_{t−1}</th><th>Y''_t = Y'_t − Y'_{t−1}</th></tr>
              <tr><td>1</td><td>100</td><td>—</td><td>—</td></tr>
              <tr><td>2</td><td>103</td><td>+3</td><td>—</td></tr>
              <tr><td>3</td><td>108</td><td>+5</td><td>+2</td></tr>
              <tr><td>4</td><td>115</td><td>+7</td><td>+2</td></tr>
              <tr><td>5</td><td>124</td><td>+9</td><td>+2</td></tr>
              <tr><td>6</td><td>135</td><td>+11</td><td>+2</td></tr>
              <tr><td>7</td><td>148</td><td>+13</td><td>+2</td></tr>
              <tr><td>8</td><td>163</td><td>+15</td><td>+2</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: проверить стационарность исходного ряда</h4>
            <div class="calc">
              Среднее за первые 4 значения: (100+103+108+115)/4 = 106.5<br>
              Среднее за последние 4 значения: (124+135+148+163)/4 = 142.5<br><br>
              Среднее существенно растёт → ряд нестационарен.<br>
              Дисперсия также растёт: early std ≈ 6.3, late std ≈ 16.1<br><br>
              ADF-тест (гипотетически): p-value = 0.45 > 0.05<br>
              → не отвергаем H₀ → ряд нестационарен ✗
            </div>
            <div class="why">Нестационарный ряд — ARIMA(p,0,q) не подойдёт. Нужно дифференцировать (d > 0). Растущее среднее — явный признак нестационарности.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: первое дифференцирование Y' = ΔY</h4>
            <div class="calc">
              Y'_t = Y_t − Y_{t−1}:<br>
              Y'_2 = 103 − 100 = 3<br>
              Y'_3 = 108 − 103 = 5<br>
              Y'_4 = 115 − 108 = 7, ...<br><br>
              Среднее Y': (3+5+7+9+11+13+15)/7 = 9.0<br>
              Но Y' не постоянна: от 3 до 15 — растёт!<br><br>
              ADF на Y': p-value ≈ 0.12 > 0.05 → всё ещё нестационарен ✗
            </div>
            <div class="why">Первое дифференцирование убрало уровень (тренд), но не убрало ускорение (квадратичный тренд). Нужно дифференцировать ещё раз.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: второе дифференцирование Y'' = ΔY'</h4>
            <div class="calc">
              Y''_t = Y'_t − Y'_{t-1}:<br>
              Y''_3 = 5 − 3 = 2<br>
              Y''_4 = 7 − 5 = 2<br>
              Y''_5 = 9 − 7 = 2, ...<br><br>
              Ряд Y'' = [2, 2, 2, 2, 2, 2] — константа!<br>
              Среднее = 2.0 (постоянно), Дисперсия = 0 → стационарен ✓<br><br>
              ADF на Y'': p-value &lt; 0.001 → H₀ отвергается → стационарен ✓
            </div>
            <div class="why">Для квадратичного тренда Y_t = a·t² нужно d=2. Итого: ARIMA(p, 2, q). На практике d=1 хватает для большинства экономических рядов.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Исходный ряд нестационарен (квадратичный тренд). После двойного дифференцирования (d=2) ряд становится постоянным. Для ARIMA: d=2. ADF тест: p-value &lt; 0.05 подтверждает стационарность.</p>
          </div>
          <div class="lesson-box">
            Правило: не дифференцируй больше, чем нужно (overdifferencing). Лишнее дифференцирование вносит шум. Обычно d=1 или d=2. Используй AIC/BIC для выбора порядка.
          </div>
        `,
      },
      {
        title: 'ARIMA(1,1,1): подгонка и прогноз',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Подогнать ARIMA(1,1,1) на малый ряд из 8 значений и сделать прогноз на 3 шага вперёд.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>t</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th></tr>
              <tr><td>Y_t</td><td>50</td><td>53</td><td>58</td><td>56</td><td>62</td><td>67</td><td>65</td><td>70</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: дифференцирование (d=1)</h4>
            <div class="calc">
              Y'_t = Y_t − Y_{t-1}:<br>
              Y'_2 =  53−50 = +3<br>
              Y'_3 =  58−53 = +5<br>
              Y'_4 =  56−58 = −2<br>
              Y'_5 =  62−56 = +6<br>
              Y'_6 =  67−62 = +5<br>
              Y'_7 =  65−67 = −2<br>
              Y'_8 =  70−65 = +5<br><br>
              Среднее Y' ≈ 2.86, дисперсия ≈ 8.5 — приблизительно постоянна ✓
            </div>
            <div class="why">После одного дифференцирования ряд выглядит стационарным. ADF на Y': p-value &lt; 0.05. Можно строить ARMA на Y'.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: параметры AR(1) и MA(1)</h4>
            <div class="calc">
              Для ARIMA(1,1,1):<br>
              Y'_t = c + φ₁·Y'_{t-1} + θ₁·ε_{t-1} + ε_t<br><br>
              Оценим φ₁ через автокорреляцию лага 1:<br>
              cor(Y'_t, Y'_{t-1}) ≈ −0.3 → φ₁ ≈ −0.30<br>
              (отрицательная — ряд "колеблется" вокруг тренда)<br><br>
              c (drift) = среднее Y' × (1 − φ₁) ≈ 2.86 × 1.3 ≈ 3.72<br>
              θ₁ ≈ −0.20 (скользящее среднее ошибки)<br><br>
              Модель: Y'_t = 3.72 − 0.30·Y'_{t-1} − 0.20·ε_{t-1} + ε_t
            </div>
            <div class="why">На практике φ₁ и θ₁ оцениваются численно (MLE). Здесь используем упрощённые оценки для иллюстрации. statsmodels делает это автоматически.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: прогноз на 3 шага</h4>
            <div class="calc">
              Последнее значение Y₈ = 70, Y'₈ = +5, ε₈ ≈ 0<br><br>
              Прогноз Y'₉:<br>
              Ŷ'₉ = 3.72 − 0.30×5 − 0.20×0 = 3.72 − 1.5 = 2.22<br>
              Ŷ₉  = Y₈ + Ŷ'₉ = 70 + 2.22 = <b>72.2</b><br><br>
              Прогноз Y'₁₀ (ε₉ = 0 в ожидании):<br>
              Ŷ'₁₀ = 3.72 − 0.30×2.22 = 3.72 − 0.67 = 3.05<br>
              Ŷ₁₀  = 72.2 + 3.05 = <b>75.3</b><br><br>
              Прогноз Y'₁₁:<br>
              Ŷ'₁₁ = 3.72 − 0.30×3.05 = 3.72 − 0.92 = 2.80<br>
              Ŷ₁₁  = 75.3 + 2.80 = <b>78.1</b>
            </div>
            <div class="why">Прогнозы сходятся к линейному тренду: φ₁ &lt; 1, поэтому AR-часть затухает. На горизонтах > 5–10 шагов ARIMA всегда сходится к прямой линии тренда.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>ARIMA(1,1,1) прогноз: t=9 → 72.2, t=10 → 75.3, t=11 → 78.1. Ряд стационаризирован одним дифференцированием. AR(1) фиксирует отрицательную автокорреляцию приростов (откат после больших скачков). Прогноз сходится к тренду ≈ +3 в шаг.</p>
          </div>
          <div class="lesson-box">
            Для выбора p и q используй информационный критерий AIC: auto_arima из pmdarima автоматически перебирает параметры и выбирает наилучшую модель по AIC.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: генератор временного ряда и декомпозиция</h3>
        <p>Настрой тренд, сезонность и шум. Наблюдай исходный ряд, тренд-линию и сезонный паттерн.</p>
        <div class="sim-container">
          <div class="sim-controls" id="ts-controls"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="ts-main-chart" style="max-height:250px;"></canvas></div>
            <div class="sim-chart-wrap" style="margin-top:14px;"><canvas id="ts-decomp-chart" style="max-height:200px;"></canvas></div>
            <div class="sim-stats" id="ts-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#ts-controls');

        const cTrend    = App.makeControl('range', 'ts-trend',    'Сила тренда',           { min: 0,   max: 5,   step: 0.5, value: 2 });
        const cSeason   = App.makeControl('range', 'ts-season',   'Амплитуда сезонности',  { min: 0,   max: 30,  step: 1,   value: 15 });
        const cNoise    = App.makeControl('range', 'ts-noise',    'Уровень шума',          { min: 0,   max: 20,  step: 1,   value: 5 });
        const cPeriod   = App.makeControl('range', 'ts-period',   'Период сезонности (мес)', { min: 3, max: 12, step: 1,   value: 12 });
        [cTrend, cSeason, cNoise, cPeriod].forEach(c => controls.appendChild(c.wrap));

        let mainChart = null, decompChart = null;
        const N = 48;

        function generate() {
          const trend    = parseFloat(cTrend.input.value);
          const season   = parseFloat(cSeason.input.value);
          const noise    = parseFloat(cNoise.input.value);
          const period   = parseInt(cPeriod.input.value, 10);
          const base     = 100;

          const labels   = [];
          const tsData   = [];
          const trendData = [];
          const seasonData = [];
          const residData  = [];

          for (let t = 0; t < N; t++) {
            labels.push(`t${t + 1}`);
            const T = base + trend * t;
            const S = season * Math.sin((2 * Math.PI * t) / period);
            const R = App.Util.randn(0, noise);
            const Y = T + S + R;
            tsData.push(Math.round(Y * 10) / 10);
            trendData.push(Math.round(T * 10) / 10);
            seasonData.push(Math.round(S * 10) / 10);
            residData.push(Math.round(R * 10) / 10);
          }

          const ctxMain = container.querySelector('#ts-main-chart').getContext('2d');
          if (mainChart) mainChart.destroy();
          mainChart = new Chart(ctxMain, {
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  label: 'Временной ряд Y_t',
                  data: tsData,
                  borderColor: 'rgba(99,102,241,0.9)',
                  backgroundColor: 'rgba(99,102,241,0.08)',
                  borderWidth: 2,
                  pointRadius: 2,
                  fill: true,
                  tension: 0.3,
                },
                {
                  label: 'Тренд T_t',
                  data: trendData,
                  borderColor: 'rgba(2,132,199,0.9)',
                  borderWidth: 2.5,
                  borderDash: [6, 3],
                  pointRadius: 0,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Временной ряд с трендом' }, legend: { position: 'top' } },
              scales: { x: { ticks: { maxTicksLimit: 12 } } },
            },
          });
          App.registerChart(mainChart);

          const ctxD = container.querySelector('#ts-decomp-chart').getContext('2d');
          if (decompChart) decompChart.destroy();
          decompChart = new Chart(ctxD, {
            type: 'line',
            data: {
              labels,
              datasets: [
                {
                  label: 'Сезонность S_t',
                  data: seasonData,
                  borderColor: 'rgba(22,163,74,0.9)',
                  borderWidth: 2,
                  pointRadius: 0,
                  fill: false,
                  tension: 0.4,
                  yAxisID: 'y1',
                },
                {
                  label: 'Остаток R_t',
                  data: residData,
                  borderColor: 'rgba(245,158,11,0.85)',
                  borderWidth: 1.5,
                  pointRadius: 1,
                  fill: false,
                  yAxisID: 'y1',
                },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Компоненты: сезонность и остаток' }, legend: { position: 'top' } },
              scales: {
                x: { ticks: { maxTicksLimit: 12 } },
                y1: { position: 'left', title: { display: true, text: 'значение' } },
              },
            },
          });
          App.registerChart(decompChart);

          const meanY  = tsData.reduce((a, b) => a + b, 0) / N;
          const stdY   = Math.sqrt(tsData.reduce((s, v) => s + (v - meanY) ** 2, 0) / N);
          const snr    = noise > 0 ? Math.round(season / noise * 10) / 10 : '∞';
          container.querySelector('#ts-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Среднее Y</div><div class="stat-value">${Math.round(meanY)}</div></div>
            <div class="stat-card"><div class="stat-label">Стд. откл.</div><div class="stat-value">${Math.round(stdY)}</div></div>
            <div class="stat-card"><div class="stat-label">SNR (сезон/шум)</div><div class="stat-value">${snr}</div></div>
            <div class="stat-card"><div class="stat-label">Период</div><div class="stat-value">${period} мес.</div></div>
          `;
        }

        [cTrend, cSeason, cNoise, cPeriod].forEach(c => c.input.addEventListener('input', generate));
        generate();
      },
    },

    python: `
      <h3>Python: анализ временных рядов</h3>
      <p>statsmodels для классических методов (ARIMA, декомпозиция), prophet для бизнес-прогнозирования.</p>

      <h4>1. Декомпозиция и проверка стационарности</h4>
      <pre><code>import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose, STL
from statsmodels.tsa.stattools import adfuller

# Генерируем ряд с трендом и сезонностью
np.random.seed(42)
n = 48
t = np.arange(n)
trend_comp = 100 + 2 * t
season_comp = 15 * np.sin(2 * np.pi * t / 12)
noise_comp = np.random.normal(0, 5, n)
Y = trend_comp + season_comp + noise_comp

dates = pd.date_range('2020-01', periods=n, freq='ME')
ts = pd.Series(Y, index=dates)

# Классическая декомпозиция
result = seasonal_decompose(ts, model='additive', period=12)

fig, axes = plt.subplots(4, 1, figsize=(12, 8), sharex=True)
ts.plot(ax=axes[0], title='Исходный ряд', color='steelblue')
result.trend.plot(ax=axes[1], title='Тренд', color='darkorange')
result.seasonal.plot(ax=axes[2], title='Сезонность', color='green')
result.resid.plot(ax=axes[3], title='Остаток', color='red', linestyle='--')
plt.tight_layout()
plt.show()

# STL-декомпозиция (более надёжная)
stl = STL(ts, period=12, robust=True)
stl_result = stl.fit()
stl_result.plot()
plt.tight_layout()
plt.show()

# Тест Дики-Фуллера (ADF) на стационарность
def adf_test(series, name=''):
    result = adfuller(series.dropna(), autolag='AIC')
    print(f"\\nADF-тест: {name}")
    print(f"  Статистика: {result[0]:.4f}")
    print(f"  p-value:    {result[1]:.4f}")
    print(f"  {'Стационарен ✓' if result[1] < 0.05 else 'Нестационарен ✗'}")

adf_test(ts, 'исходный ряд')
adf_test(ts.diff().dropna(), 'после дифференцирования')</code></pre>

      <h4>2. ARIMA и SARIMA через statsmodels</h4>
      <pre><code>from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from sklearn.metrics import mean_absolute_error, mean_squared_error

# ACF и PACF для выбора p и q
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
plot_acf(ts.diff().dropna(), lags=20, ax=axes[0])
plot_pacf(ts.diff().dropna(), lags=20, ax=axes[1])
plt.tight_layout()
plt.show()

# Train / test split (хронологически!)
train = ts[:-6]
test  = ts[-6:]

# ARIMA(1,1,1)
arima = ARIMA(train, order=(1, 1, 1))
arima_fit = arima.fit()
print(arima_fit.summary())

# Прогноз
forecast = arima_fit.forecast(steps=6)
<a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">mae</a>  = mean_absolute_error(test, forecast)
rmse = np.sqrt(mean_squared_error(test, forecast))
print(f"\\nARIMA(1,1,1): MAE={mae:.2f}, RMSE={rmse:.2f}")

# SARIMA(1,1,1)(1,1,1)[12] для месячных данных с годовой сезонностью
sarima = SARIMAX(train,
                 order=(1, 1, 1),
                 seasonal_order=(1, 1, 1, 12),
                 enforce_stationarity=False,
                 enforce_invertibility=False)
sarima_fit = sarima.fit(disp=False)
sarima_fc = sarima_fit.forecast(steps=6)
rmse_s = np.sqrt(mean_squared_error(test, sarima_fc))
print(f"SARIMA(1,1,1)(1,1,1)[12]: RMSE={rmse_s:.2f}")

# Автоматический подбор через pmdarima
# pip install pmdarima
from pmdarima import auto_arima
auto_model = auto_arima(train,
                        seasonal=True, m=12,
                        d=1, D=1,
                        stepwise=True,
                        information_criterion='aic',
                        trace=True)
print(f"\\nАвто-ARIMA лучшая модель: {auto_model.summary()}")</code></pre>

      <h4>3. Prophet для бизнес-прогнозирования</h4>
      <pre><code># pip install prophet
from prophet import Prophet
import pandas as pd

# Prophet требует DataFrame с колонками 'ds' (дата) и 'y' (значение)
df_prophet = pd.DataFrame({
    'ds': dates,
    'y': Y,
})

# Создаём и обучаем модель
model = Prophet(
    yearly_seasonality=True,
    weekly_seasonality=False,   # для месячных данных не нужно
    daily_seasonality=False,
    changepoint_prior_scale=0.05,  # гибкость тренда (0.001–0.5)
    seasonality_prior_scale=10,    # гибкость сезонности
    interval_width=0.95,
)

# Добавить пользовательскую сезонность (например, квартальную)
model.add_seasonality(name='quarterly', period=91.25, fourier_order=5)

train_df = df_prophet.iloc[:-6]
model.fit(train_df)

# Прогноз на 12 месяцев вперёд
future = model.make_future_dataframe(periods=12, freq='ME')
forecast_df = model.predict(future)

# Визуализация
fig1 = model.plot(forecast_df)
fig1.suptitle('Prophet: прогноз с <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">доверительным интервалом</a>')
plt.show()

fig2 = model.plot_components(forecast_df)
plt.show()

# Метрики на тестовых данных
test_df = df_prophet.iloc[-6:]
pred_df = forecast_df[forecast_df['ds'].isin(test_df['ds'])]
mae_p  = mean_absolute_error(test_df['y'], pred_df['yhat'])
rmse_p = np.sqrt(mean_squared_error(test_df['y'], pred_df['yhat']))
print(f"Prophet: MAE={mae_p:.2f}, RMSE={rmse_p:.2f}")</code></pre>

      <h4>4. Walk-forward кросс-валидация</h4>
      <pre><code>from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings('ignore')

def walk_forward_cv(series, order, n_test_steps=6, min_train=24):
    """Walk-forward cross-validation для временного ряда."""
    errors = []
    n = len(series)

    for i in range(n_test_steps, 0, -1):
        train_size = n - i
        if train_size < min_train:
            continue
        train = series.iloc[:train_size]
        actual = series.iloc[train_size]

        try:
            model = ARIMA(train, order=order)
            fit = model.fit()
            pred = fit.forecast(steps=1)[0]
            errors.append(abs(actual - pred))
        except Exception:
            pass

    if not errors:
        return None
    mae = np.mean(errors)
    print(f"ARIMA{order}: Walk-forward MAE = {mae:.2f} (по {len(errors)} шагам)")
    return mae

# Сравниваем несколько конфигураций
for p, d, q in [(1,1,0), (0,1,1), (1,1,1), (2,1,1)]:
    walk_forward_cv(ts, order=(p, d, q), n_test_steps=6)</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Retail и прогноз спроса.</b> Сколько товара заказать у поставщика на следующий месяц с учётом сезонности, акций, ожидаемого тренда. Ошибка на 10% — либо упущенная выручка из-за пустых полок, либо замороженный капитал на складе. Классика SARIMA, Prophet, в последние годы — глобальные ML-модели по тысячам SKU.</li>
        <li><b>Финансы: волатильность, VaR, ликвидность.</b> Для прогноза самой цены ничто не работает стабильно (рынок efficient), но волатильность хорошо моделируется GARCH и его расширениями. Оценка VaR для риск-менеджмента — обязательное регуляторное требование.</li>
        <li><b>Энергетика: прогноз потребления электроэнергии.</b> Почасовой прогноз на сутки вперёд для балансирования сети. Сильная сезонность (суточная, недельная, годовая) + погода как экзогенные регрессоры. Ошибка в прогнозе → дисбаланс → штрафы от оператора сети.</li>
        <li><b>Веб/продуктовая аналитика.</b> Прогноз DAU, трафика, выручки для планирования инфраструктуры и бизнес-планов. Детекция аномалий в реальном времени — «метрика упала сильнее, чем объясняется сезонностью» → алерт. Prophet и STL-декомпозиция — стандарт.</li>
        <li><b>Предиктивное обслуживание (IoT).</b> Датчики вибрации, температуры, давления на оборудовании. Задача — предсказать поломку за N часов до неё. Комбинация автокорреляционных признаков (rolling std, FFT-фичи) и ML-моделей на лагах.</li>
        <li><b>Эпидемиология и здравоохранение.</b> Прогноз числа заболевших, нагрузки на госпитали, потребления лекарств. В COVID-19 массово применяли ARIMA, SEIR и Prophet для ежедневных обновлений моделей.</li>
        <li><b>Capacity planning в инфраструктуре.</b> Когда закончится место на дисках, когда упрётся сеть, сколько серверов нужно через полгода. Тут хватает линейной регрессии на тренде — именно потому, что ряд простой и предсказуемый.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>ARIMA/SARIMA — математически обоснованный бейзлайн.</b> За 50+ лет отполирован: ACF/PACF-диагностика, ADF-тест на <a class="glossary-link" onclick="App.selectTopic('glossary-stationarity')">стационарность</a>, доверительные интервалы на основе нормальной теории остатков. Если ряд чистый, сезонный и стационарный после дифференцирования — ARIMA почти всегда обыграет любой ML.</p>
      <p><b>Prophet работает из коробки на «бизнесовых» рядах.</b> Автоматически ловит multiplicative тренд с breakpoints, недельную/годовую сезонность, праздники. Устойчив к пропускам и выбросам. Не нужно быть эконометристом — sanity-прогноз за 10 минут. Именно поэтому Prophet стал дефолтом в продуктовой аналитике.</p>
      <p><b>XGBoost/LightGBM с лагами — глобальные модели на тысячах рядов.</b> Одна модель на все SKU/регионы/клиенты сразу, с категориальным признаком «id ряда». Выучивает общие паттерны и делится ими между рядами. Именно такие подходы побеждают в M5 и других forecasting-соревнованиях.</p>
      <p><b>LSTM/Temporal Fusion Transformer — когда зависимости сложные и нелинейные.</b> Multivariate, с экзогенными регрессорами, с переменной длиной истории. Выучивают структуру сами, без ручных лаговых признаков. Amazon DeepAR, Google TFT — промышленные решения именно этого класса.</p>
      <p><b>Классическая декомпозиция (STL) — инструмент понимания, а не прогноза.</b> Разложил ряд на trend + seasonality + residual — и сразу видишь, что происходит: есть ли тренд, какова амплитуда сезонности, где аномалии. Бесценно для EDA и объяснения результатов.</p>
      <p><b>Prophet и SARIMA дают доверительные интервалы «из коробки».</b> Для бизнес-планирования часто важнее «какой риск, что спрос превысит 10k» — а не точечный прогноз. Байесовский Prophet и нормальная теория SARIMA отвечают на этот вопрос напрямую. ML-бустинги требуют дополнительных приседаний (quantile regression, conformal prediction).</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>ARIMA ломается на нестационарных рядах и больших горизонтах.</b> Без <a class="glossary-link" onclick="App.selectTopic('glossary-stationarity')">стационарности</a> прогнозы «расплываются» — доверительные интервалы взрываются уже через 10-20 шагов. Для прогноза на год вперёд ARIMA почти всегда даёт почти плоскую линию от последнего значения. Это не ошибка алгоритма, а его честное «я не знаю».</p>
      <p><b>Data leakage через время убивает оценку качества.</b> Обычный k-fold на временных данных даёт accuracy 90%, walk-forward — 60%. Разница — не тонкая методологическая деталь, а катастрофа в проде: модель «переобучилась на будущее» и в реальности даёт прогнозы хуже наивного «завтра = сегодня». Это самая частая и самая дорогая ошибка в time-series проектах.</p>
      <p><b>LSTM требует огромных объёмов данных и не оправдывает сложности.</b> На типичном бизнес-ряде (1-5 лет ежедневных наблюдений, 400-2000 точек) LSTM стабильно проигрывает Prophet и XGBoost. Чтобы LSTM действительно заиграл, нужны тысячи рядов с общей структурой или ряд с ярко выраженной нелинейной динамикой. В остальных случаях это оверкилл.</p>
      <p><b>Prophet плох для высокочастотных и строго статистических задач.</b> На минутных данных переусложняется и переобучается на шум. В финансах или для строгой оценки неопределённости (VaR, регуляторные модели) байесовская оценка Prophet слишком «усреднённая» и не заменяет GARCH/ARCH.</p>
      <p><b>Ни одна модель не предсказывает шоки.</b> COVID, война, санкции, вирусные посты — никакая ARIMA/Prophet/LSTM не «увидит» их до того, как произойдут. Все прогнозы — экстраполяция прошлого. Нужно иметь план Б для «режимных изменений» (change point detection, быстрый re-train, ручной override).</p>
      <p><b>Горизонт прогноза растёт с неопределённостью экспоненциально.</b> Качественный прогноз на неделю вперёд не гарантирует качественный на год. Каждый дополнительный шаг — новый слой ошибки. Никогда не обещай бизнесу «точный прогноз на 12 месяцев» — обещай «ожидаемый диапазон».</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Выбирай time-series методы когда</th><th>❌ НЕ надо когда</th></tr>
        <tr>
          <td>Один ряд, 100-500 точек, чёткая сезонность, короткий горизонт (до 10 шагов) — бери <a class="glossary-link" onclick="App.selectTopic('glossary-arima')">ARIMA/SARIMA</a></td>
          <td>Задача — predictive maintenance на тысячах датчиков без чёткой сезонности: лучше классификация или anomaly detection</td>
        </tr>
        <tr>
          <td>Бизнес-ряд, праздники, длинный горизонт (квартал-год), нужны понятные компоненты — бери Prophet</td>
          <td>Финансовые цены: эффективный рынок съедает любой forecast. Моделируй волатильность, а не цену</td>
        </tr>
        <tr>
          <td>Тысячи рядов с общей структурой (SKU, регионы, клиенты) — бери XGBoost/LightGBM с лагами и id ряда</td>
          <td>Задача реально стационарная и простая — обычная регрессия с trend + lag + weekday решит всё без overhead</td>
        </tr>
        <tr>
          <td>Нужны доверительные интервалы и объяснимые компоненты для бизнес-стейкхолдеров</td>
          <td>Прогноз нужен на 10-50 шагов при 200 точках истории — доверительный интервал будет размером с сам прогноз</td>
        </tr>
        <tr>
          <td>Есть аномалии и change points — Prophet устойчив, STL-декомпозиция помогает их найти</td>
          <td>Ожидаются шоки или режимные изменения: никакая классика их не выучит, нужны ручные override и мониторинг</td>
        </tr>
        <tr>
          <td>LSTM/TFT — если есть 10k+ точек или тысячи multivariate рядов с нелинейными зависимостями</td>
          <td>Команда не умеет валидировать time-series (walk-forward, ADF, проверка остатков) — сначала обучите, потом внедряйте</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-arima')">ARIMA/SARIMA</a></b> — классический вариант для одного ряда с чёткой структурой. Лучшая интерпретируемость, доверительные интервалы «из коробки», мало данных — достаточно.</li>
        <li><b>Prophet (Facebook)</b> — бизнес-прогнозирование с праздниками, длинным горизонтом и нетехническими стейкхолдерами. Устойчив к пропускам и выбросам, почти не требует тюнинга.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a> на лаговых признаках</b> — глобальная модель на тысячах рядов, побеждает в forecasting-соревнованиях. Требует ручного feature engineering (лаги, rolling mean/std, календарные признаки).</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('rnn-lstm')">LSTM / Temporal Fusion Transformer</a></b> — когда данных много и зависимости нелинейные. Multivariate, экзогенные регрессоры, обучение на нескольких рядах сразу.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> с lag-признаками и trend/seasonality-dummy</b> — недооценённый бейзлайн. Для простых рядов часто хватает, и в бизнес-отчётах объясняется за 5 минут.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=GE3JOFwTWVM" target="_blank">What is Time Series Analysis?</a> — введение в анализ временных рядов и ARIMA</li>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest (канал)</a> — автокорреляционная и частичная автокорреляционная функции</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank">Khan Academy: Statistics and Probability</a> — основы статистики, полезные для понимания временных рядов</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D1%80%D1%8F%D0%B4%D1%8B%20ARIMA%20%D0%BF%D1%80%D0%BE%D0%B3%D0%BD%D0%BE%D0%B7%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5" target="_blank">Habr: ARIMA и временные ряды</a> — практические статьи о работе с временными рядами</li>
        <li><a href="https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average" target="_blank">Wikipedia: ARIMA</a> — математическое описание модели ARIMA</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://www.statsmodels.org/stable/tsa.html" target="_blank">statsmodels: Time Series Analysis (tsa)</a> — ARIMA, SARIMA, VAR, ARCH/GARCH и другие модели</li>
        <li><a href="https://facebook.github.io/prophet/docs/quick_start.html" target="_blank">Prophet: Quick Start</a> — быстрый старт с Facebook Prophet для прогнозирования рядов с сезонностью</li>
        <li><a href="https://scikit-learn.org/stable/modules/preprocessing.html#standardization-or-mean-removal-and-variance-scaling" target="_blank">scikit-learn: Preprocessing / Scaling</a> — MinMaxScaler и StandardScaler для нормализации перед LSTM</li>
      </ul>
    `,
  },
});
