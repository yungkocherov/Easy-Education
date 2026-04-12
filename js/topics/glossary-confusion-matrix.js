/* ==========================================================================
   Глоссарий: Confusion Matrix
   ========================================================================== */
App.registerTopic({
  id: 'glossary-confusion-matrix',
  category: 'glossary',
  title: 'Confusion Matrix (матрица ошибок)',
  summary: 'Таблица TP/FP/TN/FN — основа всех метрик классификации.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь детектор металла на входе в аэропорт. Он принимает решение «пропустить / задержать» по каждому пассажиру. У каждого решения есть 4 возможных исхода:</p>
        <ul>
          <li>Задержал пассажира с оружием — <b>правильно!</b> (True Positive)</li>
          <li>Задержал пассажира с ключами — <b>ложная тревога</b> (False Positive)</li>
          <li>Пропустил пассажира с оружием — <b>опасный промах</b> (False Negative)</li>
          <li>Пропустил обычного пассажира — <b>правильно!</b> (True Negative)</li>
        </ul>
        <p>Confusion Matrix — это таблица, где для каждой пары (реальность × предсказание) записано количество таких случаев. Из неё выводятся все остальные метрики классификации.</p>
      </div>

      <h3>🎯 Структура confusion matrix</h3>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Confusion Matrix для бинарной классификации</text>

          <!-- Row label -->
          <text x="170" y="120" text-anchor="middle" font-size="13" font-weight="700" fill="#475569" transform="rotate(-90 170 120)">Реальность</text>
          <!-- Column label -->
          <text x="430" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#475569">Предсказание модели</text>

          <!-- Column headers -->
          <text x="340" y="90" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Positive (1)</text>
          <text x="520" y="90" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Negative (0)</text>

          <!-- Row headers -->
          <text x="230" y="145" text-anchor="end" font-size="12" font-weight="700" fill="#1e293b">Positive (1)</text>
          <text x="230" y="235" text-anchor="end" font-size="12" font-weight="700" fill="#1e293b">Negative (0)</text>

          <!-- 4 cells -->
          <!-- TP (top-left, green) -->
          <rect x="250" y="100" width="180" height="90" fill="#bbf7d0" stroke="#059669" stroke-width="2"/>
          <text x="340" y="130" text-anchor="middle" font-size="14" font-weight="800" fill="#065f46">TP</text>
          <text x="340" y="150" text-anchor="middle" font-size="11" fill="#065f46">True Positive</text>
          <text x="340" y="168" text-anchor="middle" font-size="10" fill="#047857">предсказали 1, реально 1</text>
          <text x="340" y="184" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">✓ Правильно</text>

          <!-- FN (top-right, red) -->
          <rect x="430" y="100" width="180" height="90" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>
          <text x="520" y="130" text-anchor="middle" font-size="14" font-weight="800" fill="#991b1b">FN</text>
          <text x="520" y="150" text-anchor="middle" font-size="11" fill="#991b1b">False Negative</text>
          <text x="520" y="168" text-anchor="middle" font-size="10" fill="#b91c1c">предсказали 0, реально 1</text>
          <text x="520" y="184" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b">✗ Пропуск</text>

          <!-- FP (bottom-left, red) -->
          <rect x="250" y="190" width="180" height="90" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>
          <text x="340" y="220" text-anchor="middle" font-size="14" font-weight="800" fill="#991b1b">FP</text>
          <text x="340" y="240" text-anchor="middle" font-size="11" fill="#991b1b">False Positive</text>
          <text x="340" y="258" text-anchor="middle" font-size="10" fill="#b91c1c">предсказали 1, реально 0</text>
          <text x="340" y="274" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b">✗ Ложная тревога</text>

          <!-- TN (bottom-right, green) -->
          <rect x="430" y="190" width="180" height="90" fill="#bbf7d0" stroke="#059669" stroke-width="2"/>
          <text x="520" y="220" text-anchor="middle" font-size="14" font-weight="800" fill="#065f46">TN</text>
          <text x="520" y="240" text-anchor="middle" font-size="11" fill="#065f46">True Negative</text>
          <text x="520" y="258" text-anchor="middle" font-size="10" fill="#047857">предсказали 0, реально 0</text>
          <text x="520" y="274" text-anchor="middle" font-size="11" font-weight="700" fill="#065f46">✓ Правильно</text>

          <!-- Sum labels -->
          <text x="340" y="305" text-anchor="middle" font-size="10" fill="#64748b">Precision = TP/(TP+FP)</text>
          <text x="520" y="305" text-anchor="middle" font-size="10" fill="#64748b">Specificity = TN/(TN+FP)</text>
          <text x="660" y="145" text-anchor="middle" font-size="10" fill="#64748b">Recall =</text>
          <text x="660" y="158" text-anchor="middle" font-size="10" fill="#64748b">TP/(TP+FN)</text>
        </svg>
        <div class="caption">Матрица 2×2 для бинарной классификации. Зелёные клетки — правильные предсказания (диагональ), красные — ошибки. Каждая ячейка — это количество примеров соответствующего типа.</div>
      </div>

      <h3>📐 Метрики, выведенные из confusion matrix</h3>

      <div class="math-block">$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN} \\quad\\text{(доля правильных)}$$</div>

      <div class="math-block">$$\\text{Precision} = \\frac{TP}{TP + FP} \\quad\\text{(точность: если сказали «да» — сколько раз правы)}$$</div>

      <div class="math-block">$$\\text{Recall} = \\frac{TP}{TP + FN} \\quad\\text{(полнота: сколько из реальных positive нашли)}$$</div>

      <div class="math-block">$$\\text{F1} = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}} \\quad\\text{(гармоническое среднее)}$$</div>

      <div class="math-block">$$\\text{Specificity} = \\frac{TN}{TN + FP} \\quad\\text{(доля правильно «отвергнутых» negatives)}$$</div>

      <h3>📊 Numerical пример: спам-фильтр</h3>
      <p>Классификатор проверил 1000 писем. Из них реальный спам — 100, не-спам — 900. Модель предсказала спам 120 писем, из них 80 действительно спам.</p>

      <table>
        <tr><th></th><th>Предсказано: спам</th><th>Предсказано: не спам</th><th>Всего</th></tr>
        <tr><td><b>Реально спам</b></td><td>TP = 80</td><td>FN = 20</td><td>100</td></tr>
        <tr><td><b>Реально не спам</b></td><td>FP = 40</td><td>TN = 860</td><td>900</td></tr>
      </table>

      <p>Посчитаем метрики:</p>
      <ul>
        <li><b>Accuracy</b> = (80 + 860) / 1000 = <b>94%</b></li>
        <li><b>Precision</b> = 80 / (80 + 40) = 80/120 = <b>66.7%</b></li>
        <li><b>Recall</b> = 80 / (80 + 20) = 80/100 = <b>80%</b></li>
        <li><b>F1</b> = 2 × 0.667 × 0.8 / (0.667 + 0.8) = <b>72.7%</b></li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Accuracy обманчиво при дисбалансе</div>
        <p>В примере выше accuracy = 94% звучит хорошо. Но модель, которая всегда говорит «не спам», имела бы accuracy = 90% (не пропустила бы только 100 писем спама). Поэтому для дисбалансированных задач смотрят precision/recall/F1, а не accuracy.</p>
      </div>

      <h3>🎯 Когда что использовать</h3>
      <table>
        <tr><th>Задача</th><th>Главная метрика</th><th>Почему</th></tr>
        <tr><td>Обнаружение рака</td><td><b>Recall</b></td><td>Пропустить болезнь (FN) хуже, чем лишний тест (FP)</td></tr>
        <tr><td>Спам-фильтр</td><td><b>Precision</b></td><td>Пометить нормальное письмо как спам (FP) хуже, чем пропустить спам (FN)</td></tr>
        <tr><td>Поиск информации</td><td><b>F1</b></td><td>Баланс: не хотим ни мусора, ни пропусков</td></tr>
        <tr><td>Сбалансированная задача</td><td>Accuracy или F1</td><td>Когда классы равны, простая метрика работает</td></tr>
        <tr><td>Сильный дисбаланс</td><td>ROC-AUC, PR-AUC</td><td>Не зависят от порога классификации</td></tr>
      </table>

      <h3>🔢 Multiclass confusion matrix</h3>
      <p>Для $K$ классов матрица имеет размер $K \\times K$. Диагональные ячейки — правильные предсказания, вне диагонали — ошибки. Чтение: строка $i$, столбец $j$ = «сколько раз объект класса $i$ был предсказан как класс $j$».</p>
      <p>По такой матрице можно увидеть <b>систематические путаницы</b>: например, модель часто путает «6» и «8» — визуально похожие цифры.</p>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('metrics')">Метрики классификации</a></li>
        <li><a onclick="App.selectTopic('roc-auc')">ROC и AUC</a></li>
        <li><a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a></li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Confusion_matrix" target="_blank">Wikipedia: Confusion matrix</a></li>
        <li><a href="https://www.youtube.com/watch?v=Kdsp6soqA7o" target="_blank">StatQuest: Confusion Matrix</a></li>
      </ul>
    `
  }
});
