/* ==========================================================================
   Глоссарий: ARIMA (AR, MA, I, SARIMA)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-arima',
  category: 'glossary',
  title: 'ARIMA / SARIMA',
  summary: 'Классическое семейство моделей временных рядов: AR (авторегрессия) + I (дифференцирование) + MA (скользящее среднее). SARIMA добавляет сезонность.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>ARIMA — это «швейцарский нож» для временных рядов до эры ML. Состоит из трёх блоков:</p>
        <ul>
          <li><b>AR (Autoregressive)</b>: «сегодня похоже на вчера». $Y_t$ зависит от прошлых значений $Y_{t-1}, Y_{t-2}, \\ldots$.</li>
          <li><b>I (Integrated)</b>: «избавимся от тренда». Дифференцируем ряд $d$ раз.</li>
          <li><b>MA (Moving Average)</b>: «учитываем прошлые ошибки». $Y_t$ зависит от шумов прошлых шагов.</li>
        </ul>
        <p>ARIMA(p, d, q) — порядок каждого блока. Например, ARIMA(2, 1, 1) = AR(2) + 1 дифференцирование + MA(1).</p>
      </div>

      <h3>📐 Компонент AR(p) — авторегрессия</h3>
      <div class="math-block">$$Y_t = c + \\phi_1 Y_{t-1} + \\phi_2 Y_{t-2} + \\ldots + \\phi_p Y_{t-p} + \\varepsilon_t$$</div>
      <p>Линейная регрессия ряда на свои <b>лаги</b>. Например, AR(1): $Y_t = 0.7 Y_{t-1} + \\varepsilon_t$ — каждое значение на 70% похоже на предыдущее плюс случайный шум. Используется при наличии автокорреляции.</p>

      <h3>📐 Компонент MA(q) — скользящее среднее</h3>
      <div class="math-block">$$Y_t = c + \\varepsilon_t + \\theta_1 \\varepsilon_{t-1} + \\theta_2 \\varepsilon_{t-2} + \\ldots + \\theta_q \\varepsilon_{t-q}$$</div>
      <p><b>Внимание</b>: «moving average» здесь — <b>не</b> сглаживание, как часто думают! Это <b>средневзвешенное прошлых ошибок</b> (innovations). Если в момент $t-1$ мы ошиблись, эта ошибка частично переносится на $t$.</p>

      <h3>📐 Компонент I(d) — дифференцирование</h3>
      <p>Если ряд нестационарен (есть тренд), его дифференцируют:</p>
      <div class="math-block">$$Y_t' = Y_t - Y_{t-1}$$</div>
      <p>$d=1$ — одно дифференцирование (убирает линейный тренд). $d=2$ — двойное (убирает квадратичный). $d=0$ — ряд уже стационарен.</p>

      <h3>🧩 Как соединить: ARIMA(p, d, q)</h3>
      <p>Сначала $d$ раз дифференцируешь ряд → получаешь стационарный $Y_t'$. На него применяешь ARMA(p, q):</p>
      <div class="math-block">$$Y_t' = c + \\sum_{i=1}^p \\phi_i Y_{t-i}' + \\sum_{j=1}^q \\theta_j \\varepsilon_{t-j} + \\varepsilon_t$$</div>

      <h3>🔢 Как выбрать (p, d, q)</h3>
      <ol>
        <li><b>Определи d</b>: проверь стационарность (ADF тест). Если не стационарен — дифференцируй и повтори. Обычно $d \\in \\{0, 1, 2\\}$.</li>
        <li><b>Определи p</b>: смотри на <b>PACF</b> (Partial Autocorrelation Function). Если PACF «обрывается» после лага $k$ — $p = k$.</li>
        <li><b>Определи q</b>: смотри на <b>ACF</b> (Autocorrelation Function). Если ACF «обрывается» после лага $k$ — $q = k$.</li>
        <li><b>Альтернатива</b>: автоматически — <code>auto_arima</code> (пакет <code>pmdarima</code>) или AIC/BIC grid search.</li>
      </ol>

      <h3>📊 Распознавание по ACF/PACF</h3>
      <table>
        <tr><th>Модель</th><th>ACF</th><th>PACF</th></tr>
        <tr><td>AR(p)</td><td>Затухает экспоненциально</td><td><b>Обрывается</b> после лага p</td></tr>
        <tr><td>MA(q)</td><td><b>Обрывается</b> после лага q</td><td>Затухает экспоненциально</td></tr>
        <tr><td>ARMA(p,q)</td><td>Затухает</td><td>Затухает</td></tr>
      </table>

      <h3>🎯 SARIMA — добавляем сезонность</h3>
      <p>SARIMA(p, d, q)(P, D, Q)[m] добавляет <b>сезонные</b> аналоги:</p>
      <ul>
        <li>$P$ — сезонная авторегрессия (зависимость от значений года назад).</li>
        <li>$D$ — сезонное дифференцирование.</li>
        <li>$Q$ — сезонная MA-компонента.</li>
        <li>$m$ — длина сезона (12 для месяцев, 7 для дней недели, 24 для часов).</li>
      </ul>
      <p>Пример: SARIMA(1,1,1)(1,1,0)[12] для месячных данных с годовой сезонностью.</p>

      <h3>📊 Пример: продажи мороженого</h3>
      <div class="calc">Данные: 60 месяцев продаж, видна годовая сезонность + рост.

1. ADF тест → p=0.45, нестационарен → d=1
2. После 1 дифференцирования всё ещё годовая сезонность → D=1
3. PACF после диф. показывает обрыв на лаге 1 → p=1
4. ACF показывает обрыв на лаге 1 → q=1

Модель: SARIMA(1,1,1)(0,1,1)[12]

from statsmodels.tsa.statespace.sarimax import SARIMAX
model = SARIMAX(sales, order=(1,1,1), seasonal_order=(0,1,1,12))
results = model.fit()
forecast = results.forecast(steps=12)  # на год вперёд</div>

      <h3>⚖️ ARIMA vs ML модели</h3>
      <table>
        <tr><th>Аспект</th><th>ARIMA</th><th>ML (RF, XGBoost, LSTM)</th></tr>
        <tr><td>Малые данные</td><td>✓ Хорошо</td><td>✗ Переобучается</td></tr>
        <tr><td>Объяснимость</td><td>✓ Параметры интерпретируемы</td><td>✗ Black box</td></tr>
        <tr><td>Несколько рядов</td><td>✗ Один ряд за раз</td><td>✓ Хорошо</td></tr>
        <tr><td>Внешние признаки</td><td>SARIMAX (только линейно)</td><td>✓ Любые</td></tr>
        <tr><td>Нелинейные паттерны</td><td>✗</td><td>✓</td></tr>
        <tr><td>Сезонность</td><td>✓ Прямо в SARIMA</td><td>Нужны feature engineering</td></tr>
      </table>
      <p>ARIMA — отличный baseline. Если ML обгоняет — оправдано использовать ML. Часто SARIMA + feature engineering даёт сильный baseline, который не пробивает даже LSTM.</p>

      <h3>🎯 Современные альтернативы</h3>
      <ul>
        <li><b>Prophet</b> (Facebook) — учитывает праздники, легче в настройке.</li>
        <li><b>Holt-Winters</b> (ETS) — экспоненциальное сглаживание с трендом и сезонностью.</li>
        <li><b>NeuralProphet</b>, <b>TFT</b> (Temporal Fusion Transformer), <b>N-BEATS</b> — нейронные методы.</li>
        <li><b>Gradient Boosting на лагах + дате-фичах</b> — практический рабочий конь.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('time-series')">Временные ряды</a></li>
        <li><a onclick="App.selectTopic('glossary-stationarity')">Стационарность</a> — предусловие для ARIMA</li>
      </ul>
    `,
    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://otexts.com/fpp3/" target="_blank">Hyndman: Forecasting Principles and Practice (free book)</a></li>
        <li><a href="https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average" target="_blank">Wikipedia: ARIMA</a></li>
      </ul>
    `
  }
});
