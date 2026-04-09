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
        <svg viewBox="0 0 500 210" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
          <!-- Axes -->
          <line x1="70" y1="20" x2="70" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <line x1="70" y1="175" x2="440" y2="175" stroke="#64748b" stroke-width="1.5"/>
          <!-- Axis labels -->
          <text x="250" y="198" text-anchor="middle" font-size="11" fill="#64748b">FPR (False Positive Rate)</text>
          <text x="18" y="100" text-anchor="middle" font-size="11" fill="#64748b" transform="rotate(-90,18,100)">TPR (Recall)</text>
          <!-- Axis ticks -->
          <text x="67" y="178" text-anchor="end" font-size="9" fill="#64748b">0</text>
          <text x="67" y="24" text-anchor="end" font-size="9" fill="#64748b">1</text>
          <text x="437" y="188" text-anchor="middle" font-size="9" fill="#64748b">1</text>
          <!-- Diagonal dashed line (random) -->
          <line x1="70" y1="175" x2="437" y2="20" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="340" y="120" font-size="9" fill="#94a3b8">случайная модель</text>
          <!-- AUC shaded area -->
          <path d="M70,175 C100,140 130,80 180,55 C230,30 300,22 437,20 L437,175 Z" fill="#818cf8" fill-opacity="0.18"/>
          <!-- ROC curve (model) -->
          <path d="M70,175 C100,140 130,80 180,55 C230,30 300,22 437,20" fill="none" stroke="#6366f1" stroke-width="2.5"/>
          <!-- AUC label -->
          <text x="310" y="140" text-anchor="middle" font-size="12" font-weight="600" fill="#6366f1">AUC</text>
          <text x="310" y="156" text-anchor="middle" font-size="10" fill="#6366f1">(площадь)</text>
          <!-- Corner point label -->
          <circle cx="70" cy="20" r="4" fill="#10b981"/>
          <text x="82" y="17" font-size="9" fill="#10b981">идеал (0,1)</text>
          <!-- Legend -->
          <line x1="75" y1="200" x2="100" y2="200" stroke="#6366f1" stroke-width="2.5"/>
          <text x="104" y="203" font-size="9" fill="#334155">модель</text>
          <line x1="165" y1="200" x2="190" y2="200" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5,3"/>
          <text x="194" y="203" font-size="9" fill="#334155">случайная</text>
        </svg>
        <div class="caption">ROC-кривая: ось X — FPR (цена ошибки), ось Y — TPR (польза). Чем выше и левее кривая, тем лучше. AUC — закрашенная площадь под кривой.</div>
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
            <li><b>Gini coefficient</b>: $\\text{Gini} = 2 \\cdot \\text{AUC} - 1$. Используется в финансах.</li>
            <li><b>Mann-Whitney U</b>: AUC численно равен нормализованной U-статистике.</li>
            <li><b>Concordance index (C-index)</b>: то же, что AUC, но часто используется в survival analysis.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: калибровка вероятностей</summary>
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
        <li><b>Метрики классификации</b> — TPR/FPR выводятся из confusion matrix.</li>
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
    'Gradient Boosting': GradientBoostingClassifier(random_state=42),
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
      <h3>Где применяется</h3>
      <ul>
        <li><b>Сравнение моделей</b> — без привязки к порогу.</li>
        <li><b>Медицинская диагностика</b> — классический инструмент.</li>
        <li><b>Fraud detection</b> — при сильном дисбалансе — PR-AUC.</li>
        <li><b>Ранжирование</b> — рекомендательные системы.</li>
        <li><b>Выбор порога</b> — Youden's J: максимизируем TPR − FPR.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Не зависит от выбора порога</li>
            <li>Инвариантна к масштабу вероятностей</li>
            <li>Понятная вероятностная интерпретация</li>
            <li>Одно число для сравнения моделей</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Оптимистична при дисбалансе — используй PR-AUC</li>
            <li>Не отражает качества вероятностей (калибровки)</li>
            <li>Не все пороги одинаково важны на практике</li>
            <li>В multi-class требует one-vs-rest или макро-усреднения</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Определения</h3>
      <div class="math-block">$$\\text{TPR}(t) = \\frac{|\\{i : \\hat{p}_i \\geq t, y_i = 1\\}|}{|\\{i : y_i = 1\\}|}$$</div>
      <div class="math-block">$$\\text{FPR}(t) = \\frac{|\\{i : \\hat{p}_i \\geq t, y_i = 0\\}|}{|\\{i : y_i = 0\\}|}$$</div>

      <h3>AUC как вероятность</h3>
      <div class="math-block">$$\\text{AUC} = P(\\hat{p}_{\\text{pos}} > \\hat{p}_{\\text{neg}})$$</div>

      <h3>Формула через ранги</h3>
      <p>Пусть $R_i$ — ранг i-го положительного примера в отсортированных score. Тогда:</p>
      <div class="math-block">$$\\text{AUC} = \\frac{\\sum_{i \\in \\text{pos}} R_i - \\frac{n_+ (n_+ + 1)}{2}}{n_+ \\cdot n_-}$$</div>
      <p>(Связь с U-статистикой Манна-Уитни.)</p>

      <h3>Связь с Gini</h3>
      <div class="math-block">$$\\text{Gini} = 2 \\cdot \\text{AUC} - 1$$</div>

      <h3>AUPRC baseline</h3>
      <p>Для случайной модели $\\text{AUPRC} = P(y=1)$ — доля положительных.</p>
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

      <h3>Доверительный интервал</h3>
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
