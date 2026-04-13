/* ==========================================================================
   Глоссарий: Калибровка моделей (Log-loss, Brier score, Platt scaling)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-calibration',
  category: 'glossary',
  title: 'Калибровка вероятностей',
  summary: 'Когда модель говорит «80% уверенности», она должна оказаться правой в 80% случаев. Калибровка измеряет это и исправляет.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Метеоролог говорит «вероятность дождя 70%». Если из всех дней, когда он так предсказал, дождь был ровно в 70% — он <b>хорошо откалиброван</b>. Если только в 30% — он систематически переоценивает риск.</p>
        <p>То же с ML моделями: predict_proba возвращает 0.8, но это не значит, что модель «уверена на 80%». Random Forest, например, обычно даёт <b>сглаженные</b> вероятности (никогда не 0.99 или 0.01). SVM и нейросети — наоборот, переуверены. Калибровка это исправляет.</p>
      </div>

      <h3>🎯 Когда важна калибровка</h3>
      <ul>
        <li><b>Risk scoring</b>: банк решает выдать ли кредит — нужна реальная вероятность дефолта, а не просто ранжирование.</li>
        <li><b>Медицина</b>: «вероятность болезни 30%» должна быть истинной, чтобы врач принял правильное решение.</li>
        <li><b>Ценообразование</b>: страховые премии вычисляются из вероятностей событий.</li>
        <li><b>Множественные модели</b>: чтобы корректно их комбинировать (ансамбли, voting), вероятности должны быть на одной шкале.</li>
      </ul>
      <p>Когда не важна: если задача — только классификация (argmax), а не вероятности. Тогда достаточно правильного ranking.</p>

      <h3>📊 Reliability diagram</h3>
      <p>Главный визуальный инструмент. Разбиваем предсказания на бины (например, [0, 0.1], [0.1, 0.2], ...). Для каждого бина считаем:</p>
      <ul>
        <li><b>Среднюю предсказанную вероятность</b> (центр бина).</li>
        <li><b>Реальную долю позитивов</b> в этом бине.</li>
      </ul>
      <p>Идеально откалиброванная модель даёт точки на диагонали ($y = x$). Отклонение вверх — модель занижает, вниз — завышает.</p>

      <h3>🔢 Метрики калибровки</h3>

      <h4>Brier score</h4>
      <div class="math-block">$$\\text{Brier} = \\frac{1}{N}\\sum_{i=1}^N (\\hat{p}_i - y_i)^2$$</div>
      <p>Просто MSE между предсказанной вероятностью и истинной меткой (0 или 1). Меньше — лучше. Brier = 0 у идеальной модели, 0.25 — у «всегда 0.5».</p>
      <p>Brier score можно <b>разложить</b>: $\\text{Brier} = \\text{Reliability} - \\text{Resolution} + \\text{Uncertainty}$. Reliability отражает миску калибровки.</p>

      <h4>Log-loss (Cross-entropy)</h4>
      <div class="math-block">$$\\text{LogLoss} = -\\frac{1}{N}\\sum_{i=1}^N [y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)]$$</div>
      <p>Сильно штрафует уверенные ошибки: если модель сказала $p = 0.99$, а истина 0 — log-loss = $-\\log(0.01) = 4.6$. Если сказала $0.5$ и ошиблась — всего $0.69$. Хорошо для калибровки.</p>

      <h4>Expected Calibration Error (ECE)</h4>
      <div class="math-block">$$\\text{ECE} = \\sum_{m=1}^M \\frac{|B_m|}{N} \\cdot |\\text{acc}(B_m) - \\text{conf}(B_m)|$$</div>
      <p>Усреднённая разница между точностью и средней уверенностью по бинам. ECE=0 — идеально. Удобно для отчётов.</p>

      <h3>🛠 Методы калибровки</h3>

      <h4>1. Platt Scaling (1999)</h4>
      <p>Тренируем логистическую регрессию <b>поверх</b> сырых предсказаний модели:</p>
      <div class="math-block">$$\\hat{p}_{\\text{cal}} = \\frac{1}{1 + e^{a \\hat{f}(x) + b}}$$</div>
      <p>где $\\hat{f}(x)$ — сырой выход (например, decision_function SVM). $a, b$ обучаются на отдельной валидационной выборке.</p>
      <ul>
        <li>Хорошо работает, когда искажение калибровки имеет S-образный характер (типично для SVM).</li>
        <li>Простой, мало параметров — не переобучается даже на малой выборке.</li>
      </ul>

      <h4>2. Isotonic Regression</h4>
      <p>Подгоняет монотонно неубывающую функцию $g(\\hat{p})$, минимизируя MSE. Без предположений о форме искажения — гибче, чем Platt.</p>
      <ul>
        <li>Работает для любых форм некалибровки.</li>
        <li><b>Минус</b>: переобучается на маленьких датасетах. Нужно ≥1000 примеров на класс.</li>
      </ul>

      <h4>3. Temperature Scaling (для нейросетей)</h4>
      <p>Самый простой и эффективный для DL. Делим логиты на «температуру» $T$ перед softmax:</p>
      <div class="math-block">$$\\hat{p}_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}$$</div>
      <p>$T$ оптимизируется на val set минимизацией NLL. $T > 1$ сглаживает переуверенные предсказания (типично для нейросетей).</p>
      <ul>
        <li>Не меняет ranking (только масштаб уверенности).</li>
        <li>Один параметр — не переобучается.</li>
        <li>Стандарт для DL после статьи Guo et al. (2017).</li>
      </ul>

      <h3>📊 Какие модели нуждаются в калибровке</h3>
      <table>
        <tr><th>Модель</th><th>Калибровка по умолчанию</th></tr>
        <tr><td>Logistic Regression</td><td>✓ Хорошо откалибрована</td></tr>
        <tr><td>Naive Bayes</td><td>✗ Плохо (переуверена)</td></tr>
        <tr><td>Random Forest</td><td>✗ Сглажена в середине</td></tr>
        <tr><td>SVM</td><td>✗ Не возвращает вероятности (нужен Platt)</td></tr>
        <tr><td>Gradient Boosting</td><td>≈ Чуть переуверена</td></tr>
        <tr><td>Нейронные сети</td><td>✗ Сильно переуверены</td></tr>
      </table>

      <h3>💡 sklearn пример</h3>
      <div class="calc">from sklearn.calibration import CalibratedClassifierCV
from sklearn.svm import SVC

base = SVC()
calibrated = CalibratedClassifierCV(base, method='sigmoid', cv=5)
calibrated.fit(X_train, y_train)
probas = calibrated.predict_proba(X_test)  # теперь откалиброванные

# Метрики:
from sklearn.metrics import brier_score_loss
brier = brier_score_loss(y_test, probas[:, 1])

from sklearn.calibration import calibration_curve
prob_pred, prob_true = calibration_curve(y_test, probas[:, 1], n_bins=10)</div>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('metrics')">Метрики классификации</a></li>
        <li><a onclick="App.selectTopic('roc-auc')">ROC-AUC</a></li>
        <li><a onclick="App.selectTopic('glossary-loss-functions')">Функции потерь</a></li>
      </ul>
    `,
    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Brier_score" target="_blank">Brier score</a></li>
        <li><a href="https://arxiv.org/abs/1706.04599" target="_blank">Guo et al. (2017): On Calibration of Modern Neural Networks</a></li>
      </ul>
    `
  }
});
