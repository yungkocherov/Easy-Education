/* ==========================================================================
   Глоссарий: Метрики регрессии
   ========================================================================== */
App.registerTopic({
  id: 'glossary-regression-metrics',
  category: 'glossary',
  title: 'Метрики регрессии (RMSE, R², MAPE)',
  summary: 'MSE, RMSE, MAE, R², MAPE — как измерить качество предсказания чисел.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Ты стреляешь по мишени. Каждый выстрел — предсказание, центр мишени — истинное значение. Метрика — это способ оценить, насколько хорошо ты стреляешь. Можно считать среднее расстояние до центра (MAE), среднее квадрат расстояния (MSE), или долю объяснённой дисперсии (R²). У каждой метрики свои плюсы.</p>
      </div>

      <h3>📐 MSE — Mean Squared Error</h3>
      <div class="math-block">$$\\text{MSE} = \\frac{1}{n}\\sum_{i=1}^n (y_i - \\hat{y}_i)^2$$</div>
      <ul>
        <li><b>Единицы:</b> квадрат единиц target (если target в рублях — MSE в рублях²)</li>
        <li><b>Плюсы:</b> дифференцируема, удобна для оптимизации, сильнее штрафует большие ошибки</li>
        <li><b>Минусы:</b> чувствительна к выбросам, трудно интерпретировать (квадратные единицы)</li>
        <li><b>Когда:</b> стандартный выбор для линейной регрессии, нейросетей</li>
      </ul>

      <h3>📐 RMSE — Root Mean Squared Error</h3>
      <div class="math-block">$$\\text{RMSE} = \\sqrt{\\text{MSE}} = \\sqrt{\\frac{1}{n}\\sum_{i=1}^n (y_i - \\hat{y}_i)^2}$$</div>
      <ul>
        <li><b>Единицы:</b> те же, что у target (рубли → рубли). Интерпретируема напрямую!</li>
        <li><b>Пример:</b> RMSE = 5000 руб. → «в среднем ошибаемся на ~5000 руб.»</li>
        <li><b>Минусы:</b> чувствительна к выбросам (как MSE)</li>
        <li><b>Когда:</b> когда нужно сообщить ошибку в «человеческих» единицах</li>
      </ul>

      <h3>📐 MAE — Mean Absolute Error</h3>
      <div class="math-block">$$\\text{MAE} = \\frac{1}{n}\\sum_{i=1}^n |y_i - \\hat{y}_i|$$</div>
      <ul>
        <li><b>Единицы:</b> те же, что у target</li>
        <li><b>Плюсы:</b> робастна к выбросам (один большой промах не доминирует)</li>
        <li><b>Минусы:</b> не дифференцируема в нуле, оптимизация сложнее</li>
        <li><b>Когда:</b> данные с выбросами, нужна медианная регрессия</li>
      </ul>

      <h3>📐 R² — коэффициент детерминации</h3>
      <div class="math-block">$$R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2} = 1 - \\frac{\\text{MSE модели}}{\\text{дисперсия таргета}}$$</div>
      <ul>
        <li><b>Диапазон:</b> от −∞ до 1. R²=1 → идеальная модель. R²=0 → модель не лучше простого среднего. R²&lt;0 → хуже среднего!</li>
        <li><b>Интерпретация:</b> «какая доля дисперсии Y объясняется моделью». R²=0.85 → 85% вариации объяснено.</li>
        <li><b>Плюсы:</b> безразмерная, интуитивно понятная, стандартная в науке</li>
        <li><b>Минусы:</b> растёт при добавлении любого признака (даже бесполезного). Используй adjusted R² для fair comparison.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Adjusted R²</div>
        <div class="math-block">$$R^2_{adj} = 1 - \\frac{(1-R^2)(n-1)}{n-p-1}$$</div>
        <p>Где $p$ — число признаков. Штрафует за добавление бесполезных признаков. Если новый признак не улучшает модель — adjusted R² упадёт.</p>
      </div>

      <h3>📐 MAPE — Mean Absolute Percentage Error</h3>
      <div class="math-block">$$\\text{MAPE} = \\frac{1}{n}\\sum_{i=1}^n \\left|\\frac{y_i - \\hat{y}_i}{y_i}\\right| \\times 100\\%$$</div>
      <ul>
        <li><b>Единицы:</b> проценты (безразмерная!)</li>
        <li><b>Пример:</b> MAPE = 8% → «в среднем ошибаемся на 8% от реального значения»</li>
        <li><b>Плюсы:</b> интуитивно понятна бизнесу, не зависит от масштаба</li>
        <li><b>Минусы:</b> не определена при $y_i = 0$, несимметрична (занижение штрафуется сильнее завышения)</li>
        <li><b>Когда:</b> прогнозирование спроса, финансы, отчёты для стейкхолдеров</li>
      </ul>

      <h3>🧭 Как выбрать метрику</h3>
      <table>
        <tr><th>Ситуация</th><th>Рекомендуемая метрика</th></tr>
        <tr><td>Оптимизация модели (loss function)</td><td><b>MSE</b> — гладкая, дифференцируемая</td></tr>
        <tr><td>Сообщить ошибку в человеческих единицах</td><td><b>RMSE</b> или <b>MAE</b></td></tr>
        <tr><td>Данные с выбросами</td><td><b>MAE</b> — робастнее MSE/RMSE</td></tr>
        <tr><td>Сравнить модели на разных датасетах</td><td><b>R²</b> — безразмерная</td></tr>
        <tr><td>Отчёт для бизнеса</td><td><b>MAPE</b> — проценты понятны всем</td></tr>
        <tr><td>Сравнить модели с разным числом признаков</td><td><b>Adjusted R²</b></td></tr>
        <tr><td>Target на разных масштабах</td><td><b>MAPE</b> или log-transform + MSE</td></tr>
      </table>

      <h3>🔢 Числовой пример</h3>
      <table>
        <tr><th>i</th><th>yᵢ (реальное)</th><th>ŷᵢ (предсказание)</th><th>ошибка</th><th>|ошибка|</th><th>ошибка²</th><th>|ошибка/y| %</th></tr>
        <tr><td>1</td><td>100</td><td>95</td><td>−5</td><td>5</td><td>25</td><td>5%</td></tr>
        <tr><td>2</td><td>150</td><td>160</td><td>+10</td><td>10</td><td>100</td><td>6.7%</td></tr>
        <tr><td>3</td><td>200</td><td>190</td><td>−10</td><td>10</td><td>100</td><td>5%</td></tr>
        <tr><td>4</td><td>120</td><td>150</td><td>+30</td><td>30</td><td>900</td><td>25%</td></tr>
      </table>
      <ul>
        <li><b>MAE</b> = (5 + 10 + 10 + 30) / 4 = <b>13.75</b></li>
        <li><b>MSE</b> = (25 + 100 + 100 + 900) / 4 = <b>281.25</b></li>
        <li><b>RMSE</b> = √281.25 ≈ <b>16.77</b></li>
        <li><b>MAPE</b> = (5 + 6.7 + 5 + 25) / 4 ≈ <b>10.4%</b></li>
      </ul>
      <p>Обрати внимание: MSE/RMSE доминируется 4-м примером (ошибка 30 → квадрат 900). MAE более «ровная». MAPE показывает, что 4-й пример — 25% ошибка, что критично.</p>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('glossary-loss-functions')">Функции потерь</a> — MSE/MAE как loss для оптимизации</li>
        <li><a onclick="App.selectTopic('linear-regression')">Линейная регрессия</a> — R² как основная метрика</li>
        <li><a onclick="App.selectTopic('glossary-confusion-matrix')">Confusion Matrix</a> — метрики классификации</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Mean_squared_error" target="_blank">Wikipedia: MSE</a></li>
        <li><a href="https://en.wikipedia.org/wiki/Coefficient_of_determination" target="_blank">Wikipedia: R²</a></li>
        <li><a href="https://scikit-learn.org/stable/modules/model_evaluation.html#regression-metrics" target="_blank">sklearn: Regression metrics</a></li>
      </ul>
    `
  }
});
