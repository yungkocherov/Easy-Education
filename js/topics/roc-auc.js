/* ==========================================================================
   ROC-AUC и PR-AUC
   ========================================================================== */
App.registerTopic({
  id: 'roc-auc',
  category: 'ml-basics',
  title: 'ROC-AUC',
  summary: 'Качество модели через все возможные пороги одновременно.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь медицинский тест на редкую болезнь. У тебя в руках ручка «чувствительность»: крутишь вправо — ловим всех больных, но и здоровые пугаются. Крутишь влево — никого лишнего не беспокоим, но пропускаем пациентов. Где установить ручку?</p>
        <p>Ответа нет без контекста. ROC-кривая показывает, <b>на что способен твой тест при любом положении ручки</b>. Это график «сколько настоящих больных ты ловишь» против «сколько здоровых пугаешь зря». Один взгляд — и ты видишь всё.</p>
        <p>А <b>AUC</b> — это число, которое сжимает весь график до одного значения: «насколько хорош тест в принципе». 0.5 — бесполезный (монетка), 1.0 — идеальный.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 440" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <!-- Axes -->
          <line x1="80" y1="40" x2="80" y2="340" stroke="#475569" stroke-width="1.5"/>
          <line x1="80" y1="340" x2="680" y2="340" stroke="#475569" stroke-width="1.5"/>
          <!-- Axis labels -->
          <text x="380" y="385" text-anchor="middle" font-size="13" fill="#64748b" font-weight="600">FPR (False Positive Rate)</text>
          <text x="30" y="190" text-anchor="middle" font-size="13" fill="#64748b" font-weight="600" transform="rotate(-90,30,190)">TPR (Recall)</text>
          <!-- Axis ticks -->
          <g font-size="11" fill="#64748b" text-anchor="end">
            <text x="75" y="344">0</text>
            <text x="75" y="284">0.2</text>
            <text x="75" y="224">0.4</text>
            <text x="75" y="164">0.6</text>
            <text x="75" y="104">0.8</text>
            <text x="75" y="44">1</text>
          </g>
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="80" y="360">0</text>
            <text x="200" y="360">0.2</text>
            <text x="320" y="360">0.4</text>
            <text x="440" y="360">0.6</text>
            <text x="560" y="360">0.8</text>
            <text x="680" y="360">1</text>
          </g>
          <!-- Grid -->
          <g stroke="#e5e7eb" stroke-width="0.5">
            <line x1="80" y1="284" x2="680" y2="284"/>
            <line x1="80" y1="224" x2="680" y2="224"/>
            <line x1="80" y1="164" x2="680" y2="164"/>
            <line x1="80" y1="104" x2="680" y2="104"/>
            <line x1="200" y1="40" x2="200" y2="340"/>
            <line x1="320" y1="40" x2="320" y2="340"/>
            <line x1="440" y1="40" x2="440" y2="340"/>
            <line x1="560" y1="40" x2="560" y2="340"/>
          </g>
          <!-- Diagonal (random model AUC=0.5) -->
          <line x1="80" y1="340" x2="680" y2="40" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8,5"/>
          <!-- AUC shaded area (step-wise) -->
          <path d="M80,340 L80,220 L140,220 L140,160 L200,160 L200,120 L260,120 L260,95 L320,95 L320,75 L400,75 L400,60 L500,60 L500,50 L600,50 L600,42 L680,42 L680,340 Z" fill="#4338ca" fill-opacity="0.12"/>
          <!-- ROC curve (step-wise — realistic) -->
          <path d="M80,340 L80,220 L140,220 L140,160 L200,160 L200,120 L260,120 L260,95 L320,95 L320,75 L400,75 L400,60 L500,60 L500,50 L600,50 L600,42 L680,42" fill="none" stroke="#4338ca" stroke-width="3"/>
          <!-- AUC label -->
          <text x="400" y="250" text-anchor="middle" font-size="20" font-weight="800" fill="#4338ca">AUC = 0.91</text>
          <text x="400" y="275" text-anchor="middle" font-size="12" fill="#6366f1">(площадь под кривой)</text>
          <!-- Ideal point (0,1) -->
          <circle cx="80" cy="40" r="6" fill="none" stroke="#059669" stroke-width="2.5"/>
          <text x="95" y="35" font-size="12" fill="#059669" font-weight="700">идеал (0, 1)</text>
          <!-- Legend -->
          <g font-size="12" font-weight="600">
            <line x1="80" y1="410" x2="110" y2="410" stroke="#4338ca" stroke-width="3"/>
            <text x="118" y="414" fill="#4338ca">модель (AUC=0.91)</text>
            <line x1="320" y1="410" x2="350" y2="410" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8,5"/>
            <text x="358" y="414" fill="#94a3b8">случайная (AUC=0.5)</text>
          </g>
        </svg>
        <div class="caption">ROC-кривая: ось X — FPR (сколько здоровых напугали), ось Y — TPR (сколько больных поймали). Ступенчатая форма — реалистичная (каждая ступень = один порог). Чем выше и левее кривая, тем лучше. Площадь под кривой = AUC.</div>
      </div>

      <h3>🎯 Зачем нужна ROC-кривая</h3>
      <p>Большинство моделей выдают не класс, а <b>вероятность</b>. Чтобы получить класс, мы ставим <span class="term" data-tip="Threshold. Порог для принятия решения: если вероятность >= threshold → класс 1, иначе класс 0.">порог</span>: $p \\geq 0.5$ → класс 1. Но выбор порога — это компромисс:</p>
      <ul>
        <li>Понизим порог → ловим больше положительных (↑ recall), но больше ложных тревог (↓ precision).</li>
        <li>Повысим порог → меньше ложных тревог, но больше пропусков.</li>
      </ul>
      <p>Precision, recall, F1 считаются при <b>фиксированном</b> пороге. Но что если порог ещё не выбран? Или мы сравниваем две модели, у которых разные оптимальные пороги? Здесь вступает ROC — она показывает поведение модели при <b>всех</b> порогах сразу.</p>

      <h3>📊 Два главных термина</h3>

      <h4>TPR — True Positive Rate</h4>
      <div class="math-block">$$\\text{TPR} = \\frac{TP}{TP + FN} = \\text{Recall}$$</div>
      <p>«Из всех настоящих больных, какую долю мы поймали?» Это тот же <b>recall</b>. Ещё называется <span class="term" data-tip="Sensitivity. Другое название для TPR/Recall. Показывает, насколько модель чувствительна к положительному классу.">sensitivity</span>.</p>

      <h4>FPR — False Positive Rate</h4>
      <div class="math-block">$$\\text{FPR} = \\frac{FP}{FP + TN} = 1 - \\text{Specificity}$$</div>
      <p>«Из всех настоящих здоровых, какую долю мы ложно заподозрили?» Это «цена» работы модели.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея ROC</div>
        <p>Мы строим график, где на оси X — FPR (что ты проигрываешь), на оси Y — TPR (что ты выигрываешь). Для каждого возможного порога — точка на графике. Соединяем точки → получается <b>ROC-кривая</b>.</p>
      </div>

      <h3>🔍 Как читать ROC-кривую</h3>
      <p>Крайние точки:</p>
      <ul>
        <li><b>(0, 0) — порог = 1.0</b>: ничего не помечаем как положительный → TPR = 0, FPR = 0. Никого не беспокоим, но и никого не находим.</li>
        <li><b>(1, 1) — порог = 0.0</b>: всё помечаем как положительное → TPR = 1, FPR = 1. Находим всех, но и ложно тревожим всех.</li>
      </ul>

      <p>Между крайностями лежит кривая. Она показывает <b>набор компромиссов</b>:</p>
      <ul>
        <li>🟢 <b>Идеальная модель</b>: кривая проходит через угол (0, 1) — можем поймать всех при нулевых ложных тревогах.</li>
        <li>🟡 <b>Случайная модель</b>: кривая = диагональ. TPR = FPR всегда. Никакой полезной информации.</li>
        <li>🔵 <b>Реальная модель</b>: выпуклая кривая между диагональю и углом. Чем ближе к углу — тем лучше.</li>
        <li>🔴 <b>Кривая ниже диагонали</b>: модель хуже случайной. Инвертируй предсказания — получишь хорошую.</li>
      </ul>

      <h3>📐 AUC — площадь под кривой</h3>
      <p><span class="term" data-tip="Area Under Curve. Площадь под ROC-кривой. Одно число от 0 до 1, характеризующее качество модели независимо от порога.">AUC</span> (Area Under Curve) — число от 0 до 1, измеряющее <b>общее</b> качество модели:</p>
      <ul>
        <li><b>AUC = 1.0</b> — идеальная модель.</li>
        <li><b>AUC = 0.9+</b> — очень хорошая.</li>
        <li><b>AUC = 0.8-0.9</b> — хорошая.</li>
        <li><b>AUC = 0.7-0.8</b> — приемлемая.</li>
        <li><b>AUC = 0.6-0.7</b> — слабая.</li>
        <li><b>AUC = 0.5</b> — случайная (бесполезная).</li>
        <li><b>AUC < 0.5</b> — хуже случайной (инвертируй).</li>
      </ul>

      <h3>🎲 Вероятностная интерпретация AUC</h3>
      <p>Есть красивое толкование: <b>AUC = вероятность того, что случайный положительный пример получит от модели более высокий score, чем случайный отрицательный</b>.</p>
      <p>Это интуитивно: хорошая модель «ранжирует» положительные выше отрицательных. AUC = 0.85 означает: в 85% случаев, если взять рандомного больного и рандомного здорового, модель отдаст больному больший score.</p>

      <div class="callout tip">💡 Эта интерпретация делает AUC особенно ценной в задачах <b>ранжирования</b>: рекомендательные системы, поиск, кредитный скоринг.</div>

      <h3>📊 PR-кривая — альтернатива для дисбаланса</h3>
      <p>ROC имеет большой недостаток: при <b>сильном дисбалансе</b> классов она может выглядеть отлично, хотя модель на самом деле плохая.</p>
      <p><b>Почему:</b> FPR считается по всем отрицательным. Если их миллион, а FP всего 1000, то FPR = 0.001 — выглядит отлично. Но в абсолютных числах 1000 ложных тревог — это много.</p>
      <p>Решение: <span class="term" data-tip="Precision-Recall curve. Вместо TPR/FPR строится precision vs recall. При дисбалансе показывает реальную картину качества модели.">PR-кривая</span> (Precision-Recall).</p>
      <ul>
        <li>По оси X — Recall.</li>
        <li>По оси Y — Precision.</li>
        <li>Площадь — <b>AUPRC</b> (Area Under PR Curve).</li>
      </ul>
      <p><b>Baseline для PR:</b> доля положительных в выборке. Для случайной модели AUPRC равен этой доле.</p>

      <h3>⚖️ ROC vs PR — когда что</h3>
      <table>
        <tr><th>Ситуация</th><th>Используй</th></tr>
        <tr><td>Сбалансированные классы</td><td>ROC-AUC</td></tr>
        <tr><td>Сильный дисбаланс</td><td>PR-AUC (AUPRC)</td></tr>
        <tr><td>Важен положительный класс</td><td>PR-AUC</td></tr>
        <tr><td>Ранжирование</td><td>ROC-AUC</td></tr>
        <tr><td>Сравнение моделей</td><td>Обе!</td></tr>
      </table>

      <h3>🎯 Как выбрать оптимальный порог</h3>
      <p>ROC-кривая даёт инструмент для выбора порога под конкретную задачу:</p>
      <ul>
        <li><b>Youden's J:</b> $J = TPR - FPR$. Порог с максимальным J — оптимум при равной цене ошибок.</li>
        <li><b>Ближайшая к (0, 1):</b> геометрический подход.</li>
        <li><b>По стоимости:</b> если знаешь цены FP и FN, минимизируй $C_{FN} \\cdot FN + C_{FP} \\cdot FP$.</li>
        <li><b>По целевой precision/recall:</b> «хочу recall = 0.9, какой порог нужен?»</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«AUC = 0.95 — модель отличная»</b> — не всегда. При дисбалансе — возможно, она просто хорошо определяет класс большинства.</li>
        <li><b>«AUC выше → модель лучше»</b> — в среднем да, но игнорируется форма кривой. Иногда модель с меньшим AUC лучше в интересующей области порогов.</li>
        <li><b>«AUC не зависит от порога»</b> — верно, но это и проблема: она не учитывает, какие пороги практически важны.</li>
        <li><b>«PR и ROC одно и то же»</b> — нет, при дисбалансе могут давать разную картину.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: связь AUC с другими метриками</summary>
        <div class="deep-dive-body">
          <p>AUC связан с несколькими другими мерами:</p>
          <ul>
            <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-entropy')">Gini</a> coefficient</b>: $\\text{Gini} = 2 \\cdot \\text{AUC} - 1$. Используется в финансах.</li>
            <li><b>Mann-Whitney U</b>: AUC численно равен нормализованной U-статистике.</li>
            <li><b>Concordance index (C-index)</b>: то же, что AUC, но часто используется в survival analysis.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: <a class="glossary-link" onclick="App.selectTopic('glossary-calibration')">калибровка вероятностей</a></summary>
        <div class="deep-dive-body">
          <p>AUC говорит о <b>ранжировании</b>, но не о <b>калибровке</b> вероятностей. Модель может выдавать score 0.9 для всех положительных и 0.1 для всех отрицательных — AUC = 1.0. Но сами по себе 0.9 и 0.1 — не «настоящие вероятности».</p>
          <p>Для оценки калибровки используют:</p>
          <ul>
            <li><b>Reliability diagram</b> — график «предсказанная вероятность vs реальная частота».</li>
            <li><b>Brier score</b> — среднеквадратичная ошибка вероятностей.</li>
            <li><b>Log-loss</b> — чувствительна и к ранжированию, и к калибровке.</li>
          </ul>
          <p>Если нужны калиброванные вероятности — используй Platt scaling или Isotonic regression.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Метрики классификации</b> — TPR/FPR выводятся из <a class="glossary-link" onclick="App.selectTopic('glossary-confusion-matrix')">confusion matrix</a>.</li>
        <li><b>Дисбаланс классов</b> — диктует выбор между ROC и PR.</li>
        <li><b>Логистическая регрессия</b> — выдаёт вероятности, которые ROC анализирует.</li>
        <li><b>Бизнес-метрики</b> — порог на ROC выбирается по бизнес-целям.</li>
        <li><b>Сравнение моделей</b> — AUC позволяет сравнивать модели без выбора порога.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Построение ROC по 8 точкам',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Модель выдала вероятности для 8 примеров. Постройте ROC-кривую пошагово, двигаясь от высокого порога к низкому. Из 8 примеров: 3 положительных (y=1) и 5 отрицательных (y=0).</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Пример</th><th>Score</th><th>Реальный класс</th><th>Ранг</th></tr>
              <tr><td>A</td><td>0.95</td><td>1 (положительный)</td><td>1</td></tr>
              <tr><td>B</td><td>0.87</td><td>0 (отрицательный)</td><td>2</td></tr>
              <tr><td>C</td><td>0.76</td><td>1 (положительный)</td><td>3</td></tr>
              <tr><td>D</td><td>0.64</td><td>0 (отрицательный)</td><td>4</td></tr>
              <tr><td>E</td><td>0.52</td><td>1 (положительный)</td><td>5</td></tr>
              <tr><td>F</td><td>0.41</td><td>0 (отрицательный)</td><td>6</td></tr>
              <tr><td>G</td><td>0.33</td><td>0 (отрицательный)</td><td>7</td></tr>
              <tr><td>H</td><td>0.18</td><td>0 (отрицательный)</td><td>8</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Начальная точка: порог выше максимального</h4>
            <div class="calc">Порог > 0.95 → ничего не помечаем как положительное
TP = 0, FP = 0
TPR = 0/3 = 0.0
FPR = 0/5 = 0.0
Точка ROC: (FPR=0.0, TPR=0.0) — начало координат</div>
            <div class="why">При бесконечно высоком пороге модель никого не классифицирует как положительный. Нет ни TP, ни FP — стартуем из угла (0,0).</div>
          </div>

          <div class="step" data-step="2">
            <h4>Снижаем порог — добавляем примеры по одному</h4>
            <div class="calc">После примера A (score=0.95, класс=1): TP=1, FP=0
  TPR = 1/3 = 0.333, FPR = 0/5 = 0.0 → точка (0.0, 0.333)

После примера B (score=0.87, класс=0): TP=1, FP=1
  TPR = 1/3 = 0.333, FPR = 1/5 = 0.2 → точка (0.2, 0.333)

После примера C (score=0.76, класс=1): TP=2, FP=1
  TPR = 2/3 = 0.667, FPR = 1/5 = 0.2 → точка (0.2, 0.667)

После примера D (score=0.64, класс=0): TP=2, FP=2
  TPR = 2/3 = 0.667, FPR = 2/5 = 0.4 → точка (0.4, 0.667)

После примера E (score=0.52, класс=1): TP=3, FP=2
  TPR = 3/3 = 1.000, FPR = 2/5 = 0.4 → точка (0.4, 1.0)

После примеров F, G, H (класс=0): FP растёт, TPR=1.0
  Финальная точка: (1.0, 1.0)</div>
            <div class="why">Ключевое правило: каждый положительный пример (y=1) двигает точку ВВЕРХ (растёт TPR). Каждый отрицательный (y=0) двигает вправо (растёт FPR). Чем раньше встречаются положительные — тем лучше кривая.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Все точки ROC-кривой</h4>
            <div class="calc">Точки: (0.0, 0.0) → (0.0, 0.333) → (0.2, 0.333) → (0.2, 0.667)
       → (0.4, 0.667) → (0.4, 1.0) → (0.6, 1.0) → (0.8, 1.0) → (1.0, 1.0)

Кривая идёт выше диагонали — модель лучше случайной!</div>
            <div class="why">Хорошая ROC-кривая выпуклая и стремится к верхнему левому углу (0,1). Наша кривая достигает TPR=1.0 уже при FPR=0.4 — это хороший результат.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Оцениваем AUC методом трапеций</h4>
            <div class="calc">Разбиваем площадь на трапеции между соседними точками:

Отрезок (0.0,0.0)→(0.0,0.333): ширина=0, площадь=0
Отрезок (0.0,0.333)→(0.2,0.333): ширина=0.2, высота=0.333, площадь=0.2*0.333=0.0667
Отрезок (0.2,0.333)→(0.2,0.667): ширина=0, площадь=0
Отрезок (0.2,0.667)→(0.4,0.667): ширина=0.2, высота=0.667, площадь=0.2*0.667=0.1333
Отрезок (0.4,0.667)→(0.4,1.0):   ширина=0, площадь=0
Отрезок (0.4,1.0)→(1.0,1.0):     ширина=0.6, высота=1.0, площадь=0.6*1.0=0.6

AUC = 0 + 0.0667 + 0 + 0.1333 + 0 + 0.6 = <b>0.80</b></div>
            <div class="why">AUC=0.80 означает: если случайно взять один положительный и один отрицательный пример, с вероятностью 80% модель правильно даст положительному более высокий score.</div>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg" style="max-width:420px;">
              <text x="210" y="16" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">ROC-кривая по 8 точкам (AUC = 0.80)</text>
              <!-- Axes -->
              <line x1="55" y1="22" x2="55" y2="148" stroke="#64748b" stroke-width="1.5"/>
              <line x1="55" y1="148" x2="400" y2="148" stroke="#64748b" stroke-width="1.5"/>
              <text x="228" y="165" text-anchor="middle" font-size="10" fill="#64748b">FPR</text>
              <text x="20" y="88" text-anchor="middle" font-size="10" fill="#64748b" transform="rotate(-90,20,88)">TPR</text>
              <!-- Axis tick labels: FPR 0,0.2,0.4,0.6,0.8,1.0 -->
              <text x="55" y="160" text-anchor="middle" font-size="8" fill="#64748b">0</text>
              <text x="124" y="160" text-anchor="middle" font-size="8" fill="#64748b">0.2</text>
              <text x="193" y="160" text-anchor="middle" font-size="8" fill="#64748b">0.4</text>
              <text x="262" y="160" text-anchor="middle" font-size="8" fill="#64748b">0.6</text>
              <text x="331" y="160" text-anchor="middle" font-size="8" fill="#64748b">0.8</text>
              <text x="400" y="160" text-anchor="middle" font-size="8" fill="#64748b">1.0</text>
              <!-- TPR 0,0.33,0.67,1.0 -->
              <text x="50" y="151" text-anchor="end" font-size="8" fill="#64748b">0</text>
              <text x="50" y="105" text-anchor="end" font-size="8" fill="#64748b">0.33</text>
              <text x="50" y="60" text-anchor="end" font-size="8" fill="#64748b">0.67</text>
              <text x="50" y="25" text-anchor="end" font-size="8" fill="#64748b">1.0</text>
              <!-- Diagonal dashed -->
              <line x1="55" y1="148" x2="400" y2="22" stroke="#94a3b8" stroke-width="1" stroke-dasharray="5,3"/>
              <!-- AUC fill area under step-curve -->
              <polygon points="55,148 55,105 124,105 124,60 193,60 193,22 400,22 400,148" fill="#3b82f6" fill-opacity="0.15"/>
              <!-- Step-function ROC curve -->
              <polyline points="55,148 55,105 124,105 124,60 193,60 193,22 400,22" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round"/>
              <!-- Key points -->
              <circle cx="55" cy="148" r="4" fill="#64748b"/>
              <circle cx="55" cy="105" r="4" fill="#3b82f6"/>
              <circle cx="124" cy="105" r="4" fill="#3b82f6"/>
              <circle cx="124" cy="60" r="4" fill="#3b82f6"/>
              <circle cx="193" cy="60" r="4" fill="#3b82f6"/>
              <circle cx="193" cy="22" r="4" fill="#10b981"/>
              <circle cx="400" cy="22" r="4" fill="#64748b"/>
              <!-- Labels for key points -->
              <text x="65" y="102" font-size="8" fill="#3b82f6">A(+)</text>
              <text x="127" y="100" font-size="8" fill="#ef4444">B(−)</text>
              <text x="130" y="57" font-size="8" fill="#3b82f6">C(+)</text>
              <text x="196" y="55" font-size="8" fill="#ef4444">D(−)</text>
              <text x="196" y="20" font-size="8" fill="#10b981">E(+)→ TPR=1</text>
            </svg>
            <div class="caption">Ступенчатая ROC-кривая: каждый положительный (A,C,E) тянет кривую вверх, каждый отрицательный (B,D) — вправо. Площадь AUC=0.80 закрашена синим.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>ROC-кривая построена по 9 точкам от (0,0) до (1,1).</p>
            <p>Ключевые точки: (0.0, 0.333), (0.2, 0.667), (0.4, 1.0).</p>
            <p>AUC = <b>0.80</b> — хорошее качество разделения.</p>
          </div>

          <div class="lesson-box">ROC строится путём сортировки примеров по убыванию score и последовательного снижения порога. Каждый положительный пример тянет кривую вверх, каждый отрицательный — вправо. Чем быстрее кривая «уходит вверх» — тем лучше модель.</div>
        `
      },
      {
        title: 'Расчёт AUC через ранговый метод',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Дан небольшой датасет из 6 примеров: 3 положительных и 3 отрицательных. Рассчитайте AUC, используя ранговый метод (формула Манна-Уитни). Проверьте результат через подсчёт пар.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>ID</th><th>Score</th><th>Класс (y)</th></tr>
              <tr><td>1</td><td>0.90</td><td>1</td></tr>
              <tr><td>2</td><td>0.75</td><td>0</td></tr>
              <tr><td>3</td><td>0.65</td><td>1</td></tr>
              <tr><td>4</td><td>0.55</td><td>0</td></tr>
              <tr><td>5</td><td>0.45</td><td>1</td></tr>
              <tr><td>6</td><td>0.30</td><td>0</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Присваиваем ранги (1 = наивысший score)</h4>
            <div class="calc">Сортируем по убыванию score и присваиваем ранги:

Ранг 1: ID=1, score=0.90, класс=1  (положительный)
Ранг 2: ID=2, score=0.75, класс=0  (отрицательный)
Ранг 3: ID=3, score=0.65, класс=1  (положительный)
Ранг 4: ID=4, score=0.55, класс=0  (отрицательный)
Ранг 5: ID=5, score=0.45, класс=1  (положительный)
Ранг 6: ID=6, score=0.30, класс=0  (отрицательный)</div>
            <div class="why">Ранговый метод работает с позициями в отсортированном списке, а не с самими scores. Это делает AUC инвариантным к монотонным преобразованиям score.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Применяем формулу через сумму рангов положительных</h4>
            <div class="calc">Ранги положительных примеров (y=1): R1=1, R3=3, R5=5

Сумма рангов положительных: sum_R = 1 + 3 + 5 = 9

n_pos = 3 (количество положительных)
n_neg = 3 (количество отрицательных)

U = sum_R - n_pos*(n_pos+1)/2
  = 9 - 3*4/2
  = 9 - 6
  = 3

AUC = U / (n_pos * n_neg)
    = 3 / (3 * 3)
    = 3 / 9
    = <b>0.333</b></div>
            <div class="why">Формула Манна-Уитни: U — это число пар (pos, neg), где pos имеет более высокий score, чем neg. Деление на общее число пар n_pos*n_neg нормирует результат в [0,1].</div>
          </div>

          <div class="step" data-step="3">
            <h4>Проверка: считаем все пары вручную</h4>
            <div class="calc">Все пары (pos, neg) — проверяем score_pos > score_neg:

Пара (ID1=0.90, ID2=0.75): 0.90 > 0.75 → 1 (pos выше) ✓
Пара (ID1=0.90, ID4=0.55): 0.90 > 0.55 → 1 ✓
Пара (ID1=0.90, ID6=0.30): 0.90 > 0.30 → 1 ✓
Пара (ID3=0.65, ID2=0.75): 0.65 < 0.75 → 0 (neg выше) ✗
Пара (ID3=0.65, ID4=0.55): 0.65 > 0.55 → 1 ✓
Пара (ID3=0.65, ID6=0.30): 0.65 > 0.30 → 1 ✓
Пара (ID5=0.45, ID2=0.75): 0.45 < 0.75 → 0 ✗
Пара (ID5=0.45, ID4=0.55): 0.45 < 0.55 → 0 ✗
Пара (ID5=0.45, ID6=0.30): 0.45 > 0.30 → 1 ✓

Успешных пар: 6 из 9
AUC = 6/9 = <b>0.667</b></div>
            <div class="why">Подождите! Получили 0.667, а формула дала 0.333. Ошибка? Нет — в формуле ранги присвоены от наибольшего к наименьшему (ранг 1 = лучший). Если перевернуть (ранг 1 = наихудший), U совпадёт. Пересчитаем с правильными рангами.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Корректный расчёт с рангами от наименьшего к наибольшему</h4>
            <div class="calc">Переназначаем ранги (1 = наименьший score):

Ранг 1: ID=6, score=0.30, класс=0
Ранг 2: ID=5, score=0.45, класс=1  (положительный)
Ранг 3: ID=4, score=0.55, класс=0
Ранг 4: ID=3, score=0.65, класс=1  (положительный)
Ранг 5: ID=2, score=0.75, класс=0
Ранг 6: ID=1, score=0.90, класс=1  (положительный)

Ранги положительных: 2, 4, 6
sum_R = 2 + 4 + 6 = 12

U = 12 - 3*4/2 = 12 - 6 = 6
AUC = 6 / (3*3) = 6/9 = <b>0.667</b></div>
            <div class="why">Теперь совпадает с прямым подсчётом. AUC=0.667 означает: в 67% случаев модель даёт положительному более высокий score, чем отрицательному. Это выше случайного (0.5), но ещё есть куда расти.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>AUC = <b>0.667</b> двумя методами:</p>
            <p>1. Прямой подсчёт пар: 6 корректных пар из 9 = 6/9 ≈ 0.667.</p>
            <p>2. Ранговая формула Манна-Уитни: U=6, n_pos*n_neg=9, AUC=6/9 ≈ 0.667.</p>
          </div>

          <div class="lesson-box">AUC — это вероятность правильного ранжирования случайной пары (pos, neg). Ранговая формула Манна-Уитни — эффективный способ считать AUC: О(n log n) вместо О(n^2). В sklearn так и реализовано.</div>
        `
      },
      {
        title: 'ROC vs PR при дисбалансе классов',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Одна и та же модель тестируется на двух датасетах: <b>сбалансированном</b> (50% pos) и <b>дисбалансированном</b> (5% pos). Модель одинаковая, ранжирование одинаковое. Покажите, почему ROC-AUC одинакова, а PR-AUC сильно отличается.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Параметр</th><th>Датасет 1 (сбаланс.)</th><th>Датасет 2 (дисбаланс.)</th></tr>
              <tr><td>Всего примеров</td><td>100</td><td>100</td></tr>
              <tr><td>Положительных (y=1)</td><td>50</td><td>5</td></tr>
              <tr><td>Отрицательных (y=0)</td><td>50</td><td>95</td></tr>
              <tr><td>При пороге 0.5: TP</td><td>40</td><td>4</td></tr>
              <tr><td>При пороге 0.5: FP</td><td>10</td><td>10</td></tr>
              <tr><td>При пороге 0.5: FN</td><td>10</td><td>1</td></tr>
              <tr><td>При пороге 0.5: TN</td><td>40</td><td>85</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Считаем ROC-метрики для обоих датасетов</h4>
            <div class="calc">Датасет 1 (сбалансированный):
  TPR = TP/(TP+FN) = 40/50 = 0.80
  FPR = FP/(FP+TN) = 10/50 = 0.20
  Точка на ROC: (0.20, 0.80)

Датасет 2 (дисбалансированный):
  TPR = TP/(TP+FN) = 4/5 = 0.80
  FPR = FP/(FP+TN) = 10/95 = 0.105
  Точка на ROC: (0.105, 0.80)</div>
            <div class="why">TPR (Recall) одинаков — 0.80 — потому что модель в относительном смысле работает одинаково. FPR даже лучше для дисбалансированного датасета, потому что отрицательных примеров больше, и FP/TN их делит на большое число.</div>
          </div>

          <div class="step" data-step="2">
            <h4>ROC-AUC похожа у обоих датасетов</h4>
            <div class="calc">Для простоты возьмём только три пороговые точки (0.7, 0.5, 0.3):

Датасет 1:            FPR: 0.0, 0.20, 0.40
                      TPR: 0.4, 0.80, 1.00
ROC-AUC ≈ 0.82

Датасет 2:            FPR: 0.0, 0.105, 0.25
                      TPR: 0.4,  0.80, 1.00
ROC-AUC ≈ 0.87

ROC-AUC у дисбалансированного ЛУЧШЕ, хотя в абсолютных числах
модель нашла лишь 4 из 5 положительных и дала 10 ложных тревог.</div>
            <div class="why">FPR = FP / (FP + TN). При большом числе отрицательных TN огромен, поэтому даже 10 FP дают маленький FPR. ROC-AUC «не видит» абсолютных чисел FP — она видит только пропорцию. Это и есть ловушка при дисбалансе.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем PR-метрики — картина меняется</h4>
            <div class="calc">Датасет 1 (сбалансированный):
  Precision = TP/(TP+FP) = 40/(40+10) = 0.80
  Recall    = TP/(TP+FN) = 40/50 = 0.80

Датасет 2 (дисбалансированный):
  Precision = TP/(TP+FP) = 4/(4+10) = 0.286 (!!)
  Recall    = TP/(TP+FN) = 4/5 = 0.80</div>
            <div class="why">Precision резко упала с 0.80 до 0.286! Причина: 10 FP остались теми же в обоих датасетах, но теперь их 10 из 14 помеченных (а не 10 из 50). Precision = TP/(TP+FP) видит абсолютное число FP — именно это нужно при дисбалансе.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сравниваем PR-AUC</h4>
            <div class="calc">Baseline (случайная модель):
  Датасет 1: AUPRC_baseline = 0.50 (50% pos)
  Датасет 2: AUPRC_baseline = 0.05 (5% pos)

Наша модель:
  Датасет 1: AUPRC ≈ 0.78  (намного выше baseline 0.50)
  Датасет 2: AUPRC ≈ 0.35  (лучше baseline 0.05, но не впечатляет)

Прирост над baseline:
  Датасет 1: +0.28 (хорошо)
  Датасет 2: +0.30 (тоже хорошо, но модель имеет серьёзные проблемы)</div>
            <div class="why">PR-AUC честно показывает: при сильном дисбалансе даже хороший Recall сопровождается ужасным Precision. Абсолютный AUPRC = 0.35 заставляет задуматься, а не успокаивает как ROC-AUC.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>ROC-AUC: ~0.82 (сбаланс.) vs ~0.87 (дисбаланс.) — дисбаланс выглядит <b>лучше</b>, хотя модель та же!</p>
            <p>Precision: 0.80 (сбаланс.) vs <b>0.29</b> (дисбаланс.) — реальная катастрофа видна только здесь.</p>
            <p>При дисбалансе ROC-AUC вводит в заблуждение, PR-AUC показывает правду.</p>
          </div>

          <div class="lesson-box">При сильном дисбалансе классов (fraud, болезни, отказы) ВСЕГДА смотри на PR-кривую и AUPRC. ROC-AUC при дисбалансе оптимистично врёт: большое число TN делает FPR маленьким, скрывая реальные проблемы с Precision.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: ROC и PR при разном качестве</h3>
        <div class="sim-container">
          <div class="sim-controls" id="roc-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="roc-regen">🔄 Новые предсказания</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="roc-curve"></canvas></div>
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="roc-pr"></canvas></div>
            </div>
            <div class="sim-stats" id="roc-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#roc-controls');
        const cSep = App.makeControl('range', 'roc-sep', 'Качество разделения', { min: 0, max: 3, step: 0.05, value: 1.2 });
        const cN = App.makeControl('range', 'roc-n', 'Размер выборки', { min: 100, max: 2000, step: 100, value: 500 });
        const cImb = App.makeControl('range', 'roc-imb', 'Доля класса 1', { min: 0.05, max: 0.5, step: 0.05, value: 0.3 });
        [cSep, cN, cImb].forEach(c => controls.appendChild(c.wrap));

        let rocChart = null, prChart = null;

        function run() {
          const sep = +cSep.input.value, n = +cN.input.value, imb = +cImb.input.value;
          const data = [];
          for (let i = 0; i < n; i++) {
            const cls = Math.random() < imb ? 1 : 0;
            const z = (cls === 1 ? sep : -sep) + App.Util.randn(0, 1);
            data.push({ cls, p: 1 / (1 + Math.exp(-z)) });
          }

          // сортируем по убыванию score
          const sorted = [...data].sort((a, b) => b.p - a.p);
          const P = data.filter(d => d.cls === 1).length;
          const N = data.filter(d => d.cls === 0).length;
          let tp = 0, fp = 0;
          const roc = [{ x: 0, y: 0 }];
          const pr = [];
          sorted.forEach(d => {
            if (d.cls === 1) tp++; else fp++;
            roc.push({ x: fp / N, y: tp / P });
            const prec = tp / (tp + fp);
            pr.push({ x: tp / P, y: prec });
          });

          // AUC ROC через трапеции
          let auc = 0;
          for (let i = 1; i < roc.length; i++) {
            auc += (roc[i].x - roc[i - 1].x) * (roc[i].y + roc[i - 1].y) / 2;
          }
          // AUPRC
          let aupr = 0;
          for (let i = 1; i < pr.length; i++) {
            aupr += (pr[i].x - pr[i - 1].x) * (pr[i].y + pr[i - 1].y) / 2;
          }

          const ctxR = container.querySelector('#roc-curve').getContext('2d');
          if (rocChart) rocChart.destroy();
          rocChart = new Chart(ctxR, {
            type: 'line',
            data: {
              datasets: [
                { label: 'ROC', data: roc, borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0, fill: 'origin', backgroundColor: 'rgba(59,130,246,0.15)' },
                { label: 'Случайная', data: [{ x: 0, y: 0 }, { x: 1, y: 1 }], borderColor: '#94a3b8', borderWidth: 1, borderDash: [5, 5], pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'ROC кривая' } },
              scales: { x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'FPR' } }, y: { min: 0, max: 1, title: { display: true, text: 'TPR' } } },
            },
          });
          App.registerChart(rocChart);

          const ctxP = container.querySelector('#roc-pr').getContext('2d');
          if (prChart) prChart.destroy();
          prChart = new Chart(ctxP, {
            type: 'line',
            data: {
              datasets: [
                { label: 'PR', data: pr, borderColor: '#16a34a', borderWidth: 2.5, pointRadius: 0, fill: 'origin', backgroundColor: 'rgba(22,163,74,0.15)' },
                { label: 'Baseline', data: [{ x: 0, y: imb }, { x: 1, y: imb }], borderColor: '#94a3b8', borderWidth: 1, borderDash: [5, 5], pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { title: { display: true, text: 'Precision-Recall кривая' } },
              scales: { x: { type: 'linear', min: 0, max: 1, title: { display: true, text: 'Recall' } }, y: { min: 0, max: 1, title: { display: true, text: 'Precision' } } },
            },
          });
          App.registerChart(prChart);

          container.querySelector('#roc-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">AUC-ROC</div><div class="stat-value">${auc.toFixed(3)}</div></div>
            <div class="stat-card"><div class="stat-label">AUC-PR</div><div class="stat-value">${aupr.toFixed(3)}</div></div>
            <div class="stat-card"><div class="stat-label">Положительных</div><div class="stat-value">${P}</div></div>
            <div class="stat-card"><div class="stat-label">Отрицательных</div><div class="stat-value">${N}</div></div>
          `;
        }

        [cSep, cN, cImb].forEach(c => c.input.addEventListener('input', run));
        container.querySelector('#roc-regen').onclick = run;
        run();
      },
    },

    python: `
      <h3>Python: ROC-кривая и AUC</h3>
      <p>sklearn.metrics позволяет построить ROC-кривую, вычислить AUC и сравнить несколько моделей на одном графике.</p>

      <h4>1. Построение ROC-кривой</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_curve, auc, roc_auc_score

X, y = make_classification(n_samples=1000, n_features=10,
                            weights=[0.8, 0.2], random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)
y_proba = model.predict_proba(X_test)[:, 1]

# Вычисляем точки ROC-кривой
fpr, tpr, thresholds = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(7, 5))
plt.plot(fpr, tpr, lw=2, label=f'ROC (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], '--', color='grey', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC-кривая')
plt.legend()
plt.show()

print(f'ROC-AUC (sklearn): {roc_auc_score(y_test, y_proba):.4f}')</code></pre>

      <h4>2. Сравнение нескольких моделей</h4>
      <pre><code>from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

models = {
    'Logistic Regression': LogisticRegression(),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    '<a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting': GradientBoostingClassifier(random_state=42),
}

plt.figure(figsize=(8, 6))
for name, clf in models.items():
    clf.fit(X_train, y_train)
    proba = clf.predict_proba(X_test)[:, 1]
    fpr, tpr, _ = roc_curve(y_test, proba)
    score = auc(fpr, tpr)
    plt.plot(fpr, tpr, lw=2, label=f'{name} (AUC={score:.3f})')

plt.plot([0, 1], [0, 1], '--', color='grey')
plt.xlabel('FPR')
plt.ylabel('TPR')
plt.title('Сравнение ROC-кривых')
plt.legend()
plt.show()</code></pre>

      <h4>3. Precision-Recall AUC (лучше при сильном дисбалансе)</h4>
      <pre><code>from sklearn.metrics import precision_recall_curve, average_precision_score

y_proba = model.predict_proba(X_test)[:, 1]
precision, recall, _ = precision_recall_curve(y_test, y_proba)
ap = average_precision_score(y_test, y_proba)

plt.figure(figsize=(7, 5))
plt.plot(recall, precision, lw=2, label=f'PR-кривая (AP={ap:.3f})')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title('Precision-Recall кривая')
plt.legend()
plt.show()

# При дисбалансе 1:9 случайный классификатор даёт AP ~ 0.1
# ROC-AUC всегда 0.5 у случайного — но менее информативен
print(f'Average Precision: {ap:.4f}')</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Сравнение моделей без выбора порога.</b> Ты ещё не решил, где ставить решающую границу — а уже хочешь знать, какая модель лучше ранжирует. ROC-AUC даёт одно число для сравнения без привязки к продуктовым решениям.</li>
        <li><b>Медицинская диагностика.</b> Классический инструмент эпидемиологии и доказательной медицины: ROC появилась именно там, в радарной/диагностической индустрии. Публикации про новые тесты/модели без ROC-AUC почти не существуют.</li>
        <li><b>Fraud detection и антифрод.</b> Тут важен и ROC-AUC (общая способность различать), и PR-AUC (реалистичная оценка при сильном дисбалансе 1:1000 и выше). Обычно смотрят оба.</li>
        <li><b>Credit scoring.</b> Gini = 2·AUC − 1 — стандартная метрика в банках. Регуляторы (ЦБ, Базель) требуют именно её. Без AUC/Gini модель не выйдет в прод.</li>
        <li><b>Ранжирование в рекомендательных системах.</b> Когда важно, чтобы интересные айтемы стояли выше неинтересных, а конкретный порог не нужен — ROC-AUC естественная метрика.</li>
        <li><b>Выбор оптимального порога.</b> Youden's J ($TPR - FPR$ максимум) или ближайшая точка к (0, 1) на ROC-кривой — способы подобрать порог, балансирующий чувствительность и специфичность.</li>
        <li><b>Мониторинг модели в проде.</b> Суточный ROC-AUC по свежим данным — сигнал деградации. Падение на 0.02-0.05 — повод переобучать.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Не зависит от выбора порога.</b> Порог — это продуктовое решение: «при какой вероятности блокировать транзакцию». Пока оно не принято, ROC-AUC показывает, насколько модель в принципе способна различать классы — это чистая метрика ранжирования.</p>
      <p><b>Инвариантна к масштабу вероятностей.</b> Плохо откалиброванная модель с сдвинутыми вероятностями (0.01-0.3 вместо 0-1) всё равно получит честный AUC. Метрика смотрит только на относительный порядок — удобно сравнивать калиброванную и некалиброванную модели.</p>
      <p><b>Понятная вероятностная интерпретация.</b> ROC-AUC = вероятность, что случайный positive получит от модели выше балл, чем случайный negative. Это легко объяснить стейкхолдеру без погружения в TPR/FPR.</p>
      <p><b>Одно число для сравнения.</b> Модель A: AUC 0.87. Модель B: AUC 0.89. Решение принято. Precision и recall зависят от порога — не удобно для быстрого сравнения, ROC-AUC — удобно.</p>
      <p><b>Стандарт в медицине и финансах.</b> Это общий язык индустрии: публикации, тендеры, регуляторные отчёты. Не знать ROC-AUC — значит говорить на другом языке.</p>
      <p><b>Невосприимчива к лёгкому дисбалансу.</b> В отличие от accuracy, ROC-AUC 0.5 всегда означает «случайно», что бы ни было с классами. Это делает её удобной при умеренном дисбалансе (до 1:10).</p>

      <h3>⚠️ Ограничения — когда ROC-AUC вводит в заблуждение</h3>
      <p><b>Оптимистична при сильном дисбалансе.</b> Самая частая ловушка: датасет 1:999, модель ловит 90% positive с 5% FPR. ROC-AUC = 0.95 — «отлично!». Но FP = 0.05·999 ≈ 50 на каждый TP, precision ≈ 0.15. Продукт бесполезен. Решение: PR-AUC (Average Precision) — она этого не скрывает.</p>
      <p><b>Не отражает качества вероятностей.</b> Две модели с одинаковым AUC могут дать совершенно разные откалиброванные вероятности. Если тебе важно не ранжирование, а само число $P(y=1|x)$ (ценообразование, риск-менеджмент), ROC-AUC не поможет — смотри Brier score и calibration plot.</p>
      <p><b>Не все пороги одинаково важны.</b> ROC-AUC интегрирует по всем FPR от 0 до 1. В проде тебя часто интересует только узкая область (FPR &lt; 1%). Модель с общим AUC 0.85, но отличным поведением в твоей зоне, лучше модели с AUC 0.90, которая хороша «в среднем». Partial AUC решает проблему.</p>
      <p><b>Multi-class — усложнение.</b> ROC-AUC определена для бинарной задачи. Для N классов — one-vs-rest или one-vs-one с макро/микро усреднением. Каждый вариант даёт разный ответ, нужно фиксировать схему.</p>
      <p><b>Игнорирует стоимость ошибок.</b> FN и FP у ROC-AUC равнозначны. В задачах с сильно асимметричной ценой (потеря клиента vs ошибочная блокировка) это приводит к неверному выбору модели. Нужно cost-sensitive оценивание или взвешенная метрика.</p>
      <p><b>Смешение с точностью.</b> «AUC 0.92» звучит близко к «accuracy 92%», но это разные вещи. Стейкхолдеры путают постоянно, приходится объяснять отдельно.</p>

      <h3>🧭 Когда брать ROC-AUC — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери ROC-AUC когда</th><th>❌ НЕ бери (или дополни) когда</th></tr>
        <tr>
          <td>Классы сбалансированы или дисбаланс умеренный (до 1:10)</td>
          <td>Дисбаланс сильный (1:100 и хуже) — бери PR-AUC / Average Precision</td>
        </tr>
        <tr>
          <td>Нужно сравнить модели до выбора порога и продуктовых решений</td>
          <td>Порог уже зафиксирован бизнесом — смотри precision/recall при этом пороге</td>
        </tr>
        <tr>
          <td>Работаешь в медицине или финансах, где AUC/Gini — стандарт отчётности</td>
          <td>Модель используется для принятия вероятностных решений — нужна калибровка, не только ранжирование</td>
        </tr>
        <tr>
          <td>Задача — чистое ранжирование (рекомендации, поиск) без порога</td>
          <td>Задача — рекомендации по топу-k: возьми NDCG, MAP@k, Recall@k — они адресуют твой use case точнее</td>
        </tr>
        <tr>
          <td>Нужна одна метрика для трекинга в эксперимент-трекере</td>
          <td>Стоимости FP и FN явно несимметричны и известны в $ — считай expected cost</td>
        </tr>
        <tr>
          <td>Валидация показала стабильные кривые и разумный диапазон</td>
          <td>Данные — multi-class с редкими классами — макро ROC-AUC может быть обманчив</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-pr-auc')">Precision-Recall AUC (Average Precision)</a></b> — обязательна при сильном дисбалансе. Показывает реальный precision на разных уровнях recall и не обманывает, как ROC.</li>
        <li><b>Partial AUC (pAUC)</b> — если интересует только узкая область FPR (например, FPR &lt; 5%). Интегрируется только по ней, точнее отражает реальный use case.</li>
        <li><b>Brier score и log loss</b> — когда важны честные вероятности, а не ранжирование. Штрафуют плохо калиброванные модели.</li>
        <li><b>Cost-sensitive metric</b> — если FP и FN имеют явную цену, метрика должна её учитывать. Expected value / expected cost — наиболее бизнес-ориентированный вариант.</li>
        <li><b>NDCG, MAP@k, MRR</b> — для ранжирования в рекомендациях и поиске, где важен порядок топ-k, а не AUC по всему ранкингу.</li>
      </ul>
    `,

    extra: `
      <h3>ROC vs PR при дисбалансе</h3>
      <p>Пример: 1% положительных. Модель находит 90% из них (TPR=0.9), но с 5% FPR.</p>
      <ul>
        <li>ROC: TPR=0.9, FPR=0.05 — выглядит отлично.</li>
        <li>Но FP = 0.05 · 99 = 4.95%, а TP = 0.9%. Precision = 0.9/(0.9+4.95) ≈ 0.15.</li>
        <li>ROC «скрывает» плохой precision. PR-AUC его показывает.</li>
      </ul>

      <h3>Выбор порога по ROC</h3>
      <ul>
        <li><b>Youden's J</b>: $t^* = \\arg\\max_t [TPR(t) - FPR(t)]$</li>
        <li><b>Ближайшая точка к (0,1)</b>: минимизация евклидова расстояния.</li>
        <li><b>По стоимости ошибок</b>: $t^* = \\arg\\min_t [c_{FN} \\cdot FN(t) + c_{FP} \\cdot FP(t)]$.</li>
      </ul>

      <h3>Multi-class AUC</h3>
      <ul>
        <li><b>One-vs-Rest (OvR)</b>: для каждого класса считаем AUC, усредняем.</li>
        <li><b>One-vs-One (OvO)</b>: для всех пар классов.</li>
      </ul>

      <h3><a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">Доверительный интервал</a></h3>
      <p>DeLong's test — параметрический. Или bootstrap: многократно ресемплируй и считай AUC.</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=4jRBRDbJemM" target="_blank">StatQuest: ROC and AUC</a> — пошаговое построение ROC-кривой и смысл AUC</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=ROC%20AUC%20%D0%BA%D1%80%D0%B8%D0%B2%D0%B0%D1%8F" target="_blank">ROC-AUC на Habr</a> — теория и интерпретация ROC/PR кривых на русском</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_curve.html" target="_blank">sklearn: roc_curve</a> — вычисление ROC-кривой и AUC в sklearn</li>
      </ul>
    `,
  },
});
