/* ==========================================================================
   Тест: Decision Tree
   ========================================================================== */
App.registerQuiz('decision-tree', {
  questions: [
    {
      prompt: `Дерево А — глубина 3, дерево Б — глубина без ограничения (20+). Одни и те же данные. <b>Какая граница чья?</b>`,
      figure: `
        <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
          <svg viewBox="0 0 240 200" style="max-width:240px;width:100%;">
            <text x="120" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Граница А</text>
            <rect x="10" y="20" width="220" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
            <!-- simple rectangles -->
            <rect x="10" y="20" width="100" height="170" fill="#eef2ff" opacity="0.7"/>
            <rect x="110" y="20" width="120" height="170" fill="#fef3c7" opacity="0.7"/>
            <rect x="110" y="100" width="70" height="90" fill="#eef2ff" opacity="0.7"/>
            <line x1="110" y1="20" x2="110" y2="190" stroke="#334155" stroke-width="1.3"/>
            <line x1="110" y1="100" x2="180" y2="100" stroke="#334155" stroke-width="1.3"/>
            <line x1="180" y1="100" x2="180" y2="190" stroke="#334155" stroke-width="1.3"/>
            <!-- points -->
            <circle cx="50" cy="60" r="4" fill="#6366f1"/><circle cx="75" cy="110" r="4" fill="#6366f1"/><circle cx="40" cy="150" r="4" fill="#6366f1"/><circle cx="90" cy="90" r="4" fill="#6366f1"/><circle cx="60" cy="170" r="4" fill="#6366f1"/>
            <circle cx="140" cy="50" r="4" fill="#f59e0b"/><circle cx="190" cy="70" r="4" fill="#f59e0b"/><circle cx="160" cy="80" r="4" fill="#f59e0b"/><circle cx="200" cy="40" r="4" fill="#f59e0b"/>
            <circle cx="135" cy="140" r="4" fill="#6366f1"/><circle cx="155" cy="160" r="4" fill="#6366f1"/><circle cx="170" cy="130" r="4" fill="#6366f1"/>
            <circle cx="200" cy="150" r="4" fill="#f59e0b"/><circle cx="215" cy="170" r="4" fill="#f59e0b"/>
          </svg>
          <svg viewBox="0 0 240 200" style="max-width:240px;width:100%;">
            <text x="120" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Граница Б</text>
            <rect x="10" y="20" width="220" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
            <!-- Many small rectangles to look overfit -->
            <rect x="10" y="20" width="40" height="170" fill="#eef2ff" opacity="0.7"/>
            <rect x="50" y="20" width="35" height="90" fill="#eef2ff" opacity="0.7"/>
            <rect x="85" y="20" width="20" height="50" fill="#eef2ff" opacity="0.7"/>
            <rect x="85" y="70" width="20" height="50" fill="#fef3c7" opacity="0.7"/>
            <rect x="105" y="20" width="40" height="40" fill="#fef3c7" opacity="0.7"/>
            <rect x="145" y="20" width="85" height="80" fill="#fef3c7" opacity="0.7"/>
            <rect x="50" y="110" width="55" height="80" fill="#eef2ff" opacity="0.7"/>
            <rect x="105" y="60" width="40" height="50" fill="#eef2ff" opacity="0.7"/>
            <rect x="105" y="110" width="80" height="40" fill="#eef2ff" opacity="0.7"/>
            <rect x="185" y="100" width="45" height="50" fill="#fef3c7" opacity="0.7"/>
            <rect x="105" y="150" width="80" height="40" fill="#eef2ff" opacity="0.7"/>
            <rect x="185" y="150" width="45" height="40" fill="#fef3c7" opacity="0.7"/>
            <path d="M50 20 L50 190 M85 20 L85 110 M105 20 L105 150 M145 20 L145 60 M145 60 L230 60 L230 100 L185 100 L185 190 M50 110 L185 110 M145 60 L145 110 M105 60 L105 110 M105 150 L230 150" stroke="#334155" stroke-width="1" fill="none"/>
            <!-- same points -->
            <circle cx="50" cy="60" r="4" fill="#6366f1"/><circle cx="75" cy="110" r="4" fill="#6366f1"/><circle cx="40" cy="150" r="4" fill="#6366f1"/><circle cx="90" cy="90" r="4" fill="#6366f1"/><circle cx="60" cy="170" r="4" fill="#6366f1"/>
            <circle cx="140" cy="50" r="4" fill="#f59e0b"/><circle cx="190" cy="70" r="4" fill="#f59e0b"/><circle cx="160" cy="80" r="4" fill="#f59e0b"/><circle cx="200" cy="40" r="4" fill="#f59e0b"/>
            <circle cx="135" cy="140" r="4" fill="#6366f1"/><circle cx="155" cy="160" r="4" fill="#6366f1"/><circle cx="170" cy="130" r="4" fill="#6366f1"/>
            <circle cx="200" cy="150" r="4" fill="#f59e0b"/><circle cx="215" cy="170" r="4" fill="#f59e0b"/>
          </svg>
        </div>
      `,
      options: [
        { text: 'А — глубина 3 (крупные зоны); Б — переобученное дерево (лоскутки под каждую точку)', correct: true },
        { text: 'А — переобученное; Б — неглубокое' },
        { text: 'Это одно и то же дерево' },
        { text: 'По картинке нельзя понять глубину' },
      ],
      explain: `Глубокое дерево без ограничений рубит пространство, пока в листе не останется чистое большинство — получаются «коробочки» под каждый выброс. Типичные способы ограничить: <code>max_depth</code>, <code>min_samples_leaf</code>, прунинг (<code>ccp_alpha</code>).`,
    },

    {
      prompt: `Нужно ли <b>нормализовать признаки</b> перед обучением дерева?`,
      options: [
        { text: 'Нет — дерево разбивает по порогам одной переменной, масштаб не влияет', correct: true },
        { text: 'Да, обязательно StandardScaler' },
        { text: 'Нет, но нужно обязательно one-hot кодировать числовые признаки' },
        { text: 'Зависит от критерия (gini / entropy)' },
      ],
      explain: `Это одно из главных преимуществ деревьев: разбиение «age &lt; 30?» не зависит от того, в чём измерен age. Можно смешивать цену в рублях, возраст в годах и булев флаг — дереву всё равно. Поэтому бустинг и RF стали рабочей лошадкой для табличных данных.`,
    },

    {
      prompt: `Дерево должно разделить данные про <b>XOR</b>: класс 1 если (x&gt;0) XOR (y&gt;0). Линейный классификатор тут бессилен. А дерево?`,
      figure: `
        <svg viewBox="0 0 240 240" style="max-width:240px;width:100%;">
          <rect x="20" y="20" width="200" height="200" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
          <line x1="120" y1="20" x2="120" y2="220" stroke="#94a3b8"/>
          <line x1="20" y1="120" x2="220" y2="120" stroke="#94a3b8"/>
          <!-- Top-left: amber -->
          <circle cx="60" cy="50" r="5" fill="#f59e0b"/><circle cx="80" cy="80" r="5" fill="#f59e0b"/><circle cx="45" cy="95" r="5" fill="#f59e0b"/><circle cx="95" cy="50" r="5" fill="#f59e0b"/>
          <!-- Top-right: indigo -->
          <circle cx="155" cy="55" r="5" fill="#6366f1"/><circle cx="180" cy="80" r="5" fill="#6366f1"/><circle cx="205" cy="50" r="5" fill="#6366f1"/><circle cx="175" cy="100" r="5" fill="#6366f1"/>
          <!-- Bottom-left: indigo -->
          <circle cx="50" cy="150" r="5" fill="#6366f1"/><circle cx="90" cy="175" r="5" fill="#6366f1"/><circle cx="60" cy="200" r="5" fill="#6366f1"/><circle cx="100" cy="145" r="5" fill="#6366f1"/>
          <!-- Bottom-right: amber -->
          <circle cx="160" cy="150" r="5" fill="#f59e0b"/><circle cx="200" cy="170" r="5" fill="#f59e0b"/><circle cx="180" cy="200" r="5" fill="#f59e0b"/><circle cx="145" cy="190" r="5" fill="#f59e0b"/>
          <text x="70" y="35" font-size="10" fill="#7c2d12" font-weight="600">класс 1</text>
          <text x="170" y="35" font-size="10" fill="#1e1b4b" font-weight="600">класс 0</text>
          <text x="65" y="230" font-size="10" fill="#1e1b4b" font-weight="600">класс 0</text>
          <text x="165" y="230" font-size="10" fill="#7c2d12" font-weight="600">класс 1</text>
        </svg>
      `,
      options: [
        { text: 'Справится легко — первым разбиением делит по x, вторым по y внутри каждой половины. 4 листа.', correct: true },
        { text: 'Не справится — дереву тоже нужна линейная разделимость' },
        { text: 'Справится только если увеличить <code>max_depth</code> до 100' },
        { text: 'Нужно добавить взаимодействие x·y как новый признак' },
      ],
      explain: `XOR — классический пример, на котором «проваливаются» линейные модели (нужно вручную сделать x·y как признак). Для дерева это тривиально: после 2 разбиений (одно по x, второе по y) пространство разбито на 4 ячейки, и в каждой — чистый класс.`,
    },

    {
      prompt: `Критерии <b>Gini</b> и <b>entropy</b> — в чём разница на практике?`,
      options: [
        { text: 'Обычно разница минимальна; gini считается чуть быстрее (без log). На выбор модели влияет слабо.', correct: true },
        { text: 'Gini — для регрессии, entropy — для классификации' },
        { text: 'Entropy даёт всегда более точную модель' },
        { text: 'Gini игнорирует меньший класс' },
      ],
      explain: `Оба меряют «примесь» узла: gini — $1 - \\sum p_i^2$, entropy — $-\\sum p_i \\log p_i$. Численно они почти взаимозаменяемы — их кривые очень похожи. Обычно крутят другие гиперпараметры, а не критерий.`,
    },

    {
      prompt: `Одиночное дерево часто проигрывает Random Forest и бустингу. <b>Почему?</b>`,
      options: [
        { text: 'Дерево сильно зависит от конкретной выборки — чуть поменяешь данные, разбиения изменятся. Отсюда высокая variance.', correct: true },
        { text: 'У дерева большой bias — оно не может выучить сложные зависимости' },
        { text: 'Дерево не умеет работать с числовыми признаками' },
        { text: 'Дерево всегда переобучается, и это нельзя исправить' },
      ],
      explain: `Дерево — low-bias, high-variance модель. Усреднение многих деревьев (RF) или последовательная коррекция ошибок (бустинг) снижает variance. Поэтому на табличных задачах ансамбли деревьев — стандарт de-facto.`,
    },

    {
      prompt: `У тебя признак «дата рождения» с миллионами уникальных значений. Что будет, если дать его дереву <b>как числовой</b>?`,
      options: [
        { text: 'Дерево будет искать лучший порог среди всех уникальных значений — это работает, но медленно; легко переобучиться на конкретные даты.', correct: true },
        { text: 'Дерево откажется обучаться — слишком много уникальных значений' },
        { text: 'Дерево преобразует его в one-hot внутри себя' },
        { text: 'Дерево проигнорирует признак' },
      ],
      explain: `Для числовых признаков дерево перебирает пороги между соседними уникальными значениями. Выгодно <b>агрегировать</b> датту: возраст, год, десятилетие — так модель не будет выделять отдельные дни. В бустинге типа CatBoost и LightGBM есть специальная обработка high-cardinality категорий.`,
    },
  ],
});
