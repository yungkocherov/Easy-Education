/* ==========================================================================
   Тест: Support Vector Machine
   ========================================================================== */
App.registerQuiz('svm', {
  questions: [
    {
      prompt: `На рисунке две разделяющие линии. Обе разделяют данные идеально. <b>Какую выберет SVM и почему?</b>`,
      figure: `
        <svg viewBox="0 0 320 220" style="max-width:320px;width:100%;">
          <rect x="15" y="15" width="290" height="190" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
          <!-- indigo class (left) -->
          <circle cx="60" cy="60" r="6" fill="#6366f1"/>
          <circle cx="90" cy="95" r="6" fill="#6366f1"/>
          <circle cx="55" cy="130" r="6" fill="#6366f1"/>
          <circle cx="100" cy="155" r="6" fill="#6366f1"/>
          <circle cx="75" cy="180" r="6" fill="#6366f1"/>
          <!-- amber class (right) -->
          <circle cx="220" cy="55" r="6" fill="#f59e0b"/>
          <circle cx="245" cy="90" r="6" fill="#f59e0b"/>
          <circle cx="210" cy="125" r="6" fill="#f59e0b"/>
          <circle cx="260" cy="150" r="6" fill="#f59e0b"/>
          <circle cx="230" cy="180" r="6" fill="#f59e0b"/>
          <!-- Line A (crooked, close to indigo) -->
          <line x1="110" y1="20" x2="140" y2="200" stroke="#ef4444" stroke-width="2"/>
          <text x="115" y="30" font-size="12" font-weight="700" fill="#ef4444">А</text>
          <!-- Line B (centered, max-margin) with margin bands -->
          <line x1="155" y1="15" x2="160" y2="205" stroke="#10b981" stroke-width="2"/>
          <line x1="123" y1="15" x2="128" y2="205" stroke="#10b981" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
          <line x1="185" y1="15" x2="190" y2="205" stroke="#10b981" stroke-width="1" stroke-dasharray="4,3" opacity="0.6"/>
          <text x="160" y="30" font-size="12" font-weight="700" fill="#10b981">Б</text>
          <text x="220" y="210" font-size="9" fill="#10b981" font-weight="600">margin</text>
        </svg>
      `,
      options: [
        { text: 'Б — она максимизирует зазор (margin) до ближайших точек обоих классов. Это даёт лучшее обобщение.', correct: true },
        { text: 'А — она ближе к синему классу, значит надёжнее' },
        { text: 'Обе — SVM выбирает случайно между ними' },
        { text: 'Та, которая быстрее считается' },
      ],
      explain: `SVM ищет <b>maximum-margin hyperplane</b>. Интуиция: если между классами есть широкий «коридор», новый объект скорее попадёт в правильную часть, даже если он немного отличается от обучающих. Поэтому SVM исторически хорошо работал на небольших датасетах без явного дисбаланса.`,
    },

    {
      prompt: `В SVM есть параметр <b>C</b>. При $C \\to \\infty$ — жёстко штрафуем любую ошибку на train. При $C \\to 0$ — разрешаем ошибки. Для какой картинки нужно большое C, а для какой — маленькое?`,
      figure: `
        <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
          <svg viewBox="0 0 220 200" style="max-width:220px;width:100%;">
            <text x="110" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Данные №1</text>
            <rect x="10" y="20" width="200" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
            <!-- clearly separable -->
            <circle cx="50" cy="55" r="5" fill="#6366f1"/><circle cx="40" cy="100" r="5" fill="#6366f1"/><circle cx="65" cy="140" r="5" fill="#6366f1"/><circle cx="85" cy="75" r="5" fill="#6366f1"/><circle cx="70" cy="170" r="5" fill="#6366f1"/>
            <circle cx="160" cy="50" r="5" fill="#f59e0b"/><circle cx="175" cy="90" r="5" fill="#f59e0b"/><circle cx="145" cy="130" r="5" fill="#f59e0b"/><circle cx="190" cy="155" r="5" fill="#f59e0b"/><circle cx="165" cy="175" r="5" fill="#f59e0b"/>
          </svg>
          <svg viewBox="0 0 220 200" style="max-width:220px;width:100%;">
            <text x="110" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Данные №2</text>
            <rect x="10" y="20" width="200" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
            <!-- heavy overlap -->
            <circle cx="70" cy="60" r="5" fill="#6366f1"/><circle cx="90" cy="100" r="5" fill="#6366f1"/><circle cx="110" cy="130" r="5" fill="#6366f1"/><circle cx="85" cy="160" r="5" fill="#6366f1"/><circle cx="55" cy="120" r="5" fill="#6366f1"/>
            <circle cx="140" cy="70" r="5" fill="#f59e0b"/><circle cx="120" cy="110" r="5" fill="#f59e0b"/><circle cx="100" cy="90" r="5" fill="#f59e0b"/><circle cx="155" cy="140" r="5" fill="#f59e0b"/><circle cx="135" cy="170" r="5" fill="#f59e0b"/>
          </svg>
        </div>
      `,
      options: [
        { text: '№1 — можно большое C (классы разделяются). №2 — нужно маленькое C: жёсткий штраф приведёт к странной границе, ориентированной на выбросы.', correct: true },
        { text: 'Везде нужно большое C — это сделает модель точнее' },
        { text: 'Везде нужно маленькое C — это даёт больший margin' },
        { text: 'C влияет только на скорость, а не на результат' },
      ],
      explain: `<b>C = trade-off между margin и ошибками на train.</b> На сильно перекрытых данных большое C заставит модель выкручиваться, перекос будет в сторону отдельных выбросов. Маленькое C = «пусть часть точек будет неправильно, зато граница красивее».`,
    },

    {
      prompt: `Линейный SVM не справляется с задачей «круг внутри круга». Что с этим делать без нелинейной модели?`,
      figure: `
        <svg viewBox="0 0 240 200" style="max-width:240px;width:100%;">
          <rect x="10" y="20" width="220" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
          <circle cx="120" cy="105" r="60" fill="none" stroke="#94a3b8" stroke-dasharray="4,3"/>
          <!-- Inner class (amber) -->
          <circle cx="120" cy="105" r="5" fill="#f59e0b"/><circle cx="110" cy="90" r="5" fill="#f59e0b"/><circle cx="130" cy="115" r="5" fill="#f59e0b"/><circle cx="115" cy="120" r="5" fill="#f59e0b"/><circle cx="125" cy="90" r="5" fill="#f59e0b"/>
          <!-- Outer class (indigo) -->
          <circle cx="50" cy="60" r="5" fill="#6366f1"/><circle cx="200" cy="60" r="5" fill="#6366f1"/><circle cx="50" cy="150" r="5" fill="#6366f1"/><circle cx="200" cy="150" r="5" fill="#6366f1"/><circle cx="120" cy="40" r="5" fill="#6366f1"/><circle cx="120" cy="170" r="5" fill="#6366f1"/><circle cx="40" cy="105" r="5" fill="#6366f1"/><circle cx="210" cy="105" r="5" fill="#6366f1"/>
        </svg>
      `,
      options: [
        { text: 'Использовать <b>kernel trick</b>: например RBF-ядро неявно проецирует данные в пространство, где они разделимы линейно', correct: true },
        { text: 'Обязательно перейти на нейросеть — SVM не справится' },
        { text: 'Нормализовать данные — и задача решится' },
        { text: 'Добавить штраф L2 — граница изогнётся' },
      ],
      explain: `<b>Kernel trick</b>: вместо ручного добавления $x_1^2, x_2^2, x_1 x_2$ ядро напрямую вычисляет скалярное произведение в нужном пространстве. RBF (гауссово ядро) может разделить любые данные — платим мы сложностью и отсутствием явных коэффициентов.`,
    },

    {
      prompt: `Параметр <b>γ (gamma)</b> в RBF-ядре контролирует «радиус влияния» опорных векторов. При большом γ...`,
      options: [
        { text: 'Каждый опорный вектор влияет только локально, граница становится изогнутой и подгоняется под каждую точку — риск переобучения', correct: true },
        { text: 'Граница становится линейной' },
        { text: 'Модель обучается быстрее, но менее точно' },
        { text: 'γ это то же самое, что C' },
      ],
      explain: `<b>γ и C — главные гиперпараметры RBF-SVM.</b> Большое γ = узкая «гауссиана» вокруг каждой точки, граница рваная. Маленькое γ = гладкая, почти линейная граница. Оба параметра подбираются совместно — обычно через grid search на log-scale.`,
    },

    {
      prompt: `Что такое <b>support vectors</b>?`,
      options: [
        { text: 'Точки, лежащие на margin или нарушающие его — именно они определяют положение разделяющей границы. Остальные точки можно выбросить, модель не изменится.', correct: true },
        { text: 'Самые центральные точки каждого класса' },
        { text: 'Все точки обучающей выборки' },
        { text: 'Случайная подвыборка, как в Random Forest' },
      ],
      explain: `Именно поэтому SVM называется «support vector»: границу «поддерживают» только эти точки. Если у тебя 1 млн объектов, а support-векторов — 5 000, инференс быстрый. Но обучение всё равно O(n²)–O(n³) — отсюда проблемы на больших датасетах.`,
    },

    {
      prompt: `У тебя 5 млн объектов, задача бинарной классификации. Стоит ли брать SVM?`,
      options: [
        { text: 'Обычно нет — классический SVM плохо масштабируется. Лучше линейный SVM (LinearSVC), логрег или бустинг.', correct: true },
        { text: 'Да, SVM — универсальный чемпион' },
        { text: 'Да, просто увеличь C до 1000' },
        { text: 'Да, но только с полиномиальным ядром' },
      ],
      explain: `Обучение ядерного SVM — O(n²)–O(n³) по памяти и времени. Для миллионов точек используют: <b>LinearSVC</b> (O(n)), SGD-версии (<code>SGDClassifier</code> с hinge loss), либо другие модели. Бустинг/LogReg обычно выигрывают на больших табличных данных и по скорости, и по качеству.`,
    },
  ],
});
