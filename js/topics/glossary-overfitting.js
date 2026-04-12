/* ==========================================================================
   Глоссарий: Переобучение (Overfitting)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-overfitting',
  category: 'glossary',
  title: 'Переобучение (Overfitting)',
  summary: 'Модель идеально запомнила train, но плохо работает на новых данных.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь студента, который выучил 500 задач из учебника <b>наизусть</b>, вместе с ответами. На контрольной по тем же задачам — 100 баллов. На экзамене с новыми задачами — 30 баллов. Он не понял принципы, а запомнил конкретные случаи. Это и есть <b>переобучение</b>: модель «вызубрила» тренировочную выборку, но не выучила закономерности.</p>
        <p>Противоположная проблема — <b>недообучение</b>: студент не выучил материал вообще, и на контрольной, и на экзамене получает 30 баллов. Золотая середина — учится понимать принципы, чтобы обобщать на новые задачи. Это наша цель.</p>
      </div>

      <h3>🎯 Определение</h3>
      <p><b>Переобучение (overfitting)</b> — ситуация, когда модель показывает низкую ошибку на тренировочных данных, но высокую ошибку на тестовых (или в продакшене). Модель «запомнила» шум и специфику train-выборки вместо того, чтобы выучить общие закономерности.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Три случая: недообучение, баланс, переобучение</text>
          <!-- Three panels -->
          <!-- Underfitting -->
          <g>
            <rect x="30" y="50" width="220" height="200" fill="#fafafa" stroke="#cbd5e1"/>
            <text x="140" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309">Недообучение</text>
            <text x="140" y="86" text-anchor="middle" font-size="10" fill="#64748b">Слишком простая модель</text>
            <!-- Sine-like true curve points -->
            <g fill="#475569">
              <circle cx="60" cy="210" r="3"/>
              <circle cx="80" cy="180" r="3"/>
              <circle cx="100" cy="140" r="3"/>
              <circle cx="120" cy="110" r="3"/>
              <circle cx="140" cy="100" r="3"/>
              <circle cx="160" cy="115" r="3"/>
              <circle cx="180" cy="145" r="3"/>
              <circle cx="200" cy="185" r="3"/>
              <circle cx="220" cy="210" r="3"/>
            </g>
            <!-- Fit: straight horizontal line -->
            <line x1="55" y1="160" x2="230" y2="160" stroke="#dc2626" stroke-width="2.5"/>
            <text x="140" y="235" text-anchor="middle" font-size="10" fill="#b45309">Train ошибка: ВЫСОКАЯ</text>
            <text x="140" y="248" text-anchor="middle" font-size="10" fill="#b45309">Test ошибка: ВЫСОКАЯ</text>
          </g>
          <!-- Good fit -->
          <g>
            <rect x="270" y="50" width="220" height="200" fill="#fafafa" stroke="#cbd5e1"/>
            <text x="380" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="#059669">Хороший fit (balance)</text>
            <text x="380" y="86" text-anchor="middle" font-size="10" fill="#64748b">Модель выучила паттерн</text>
            <g fill="#475569">
              <circle cx="300" cy="210" r="3"/>
              <circle cx="320" cy="180" r="3"/>
              <circle cx="340" cy="140" r="3"/>
              <circle cx="360" cy="110" r="3"/>
              <circle cx="380" cy="100" r="3"/>
              <circle cx="400" cy="115" r="3"/>
              <circle cx="420" cy="145" r="3"/>
              <circle cx="440" cy="185" r="3"/>
              <circle cx="460" cy="210" r="3"/>
            </g>
            <!-- Smooth curve following points -->
            <path d="M295,212 Q320,180 340,140 Q365,105 380,100 Q395,105 420,145 Q445,185 465,212" fill="none" stroke="#059669" stroke-width="2.5"/>
            <text x="380" y="235" text-anchor="middle" font-size="10" fill="#059669">Train ошибка: НИЗКАЯ</text>
            <text x="380" y="248" text-anchor="middle" font-size="10" fill="#059669">Test ошибка: НИЗКАЯ ✓</text>
          </g>
          <!-- Overfitting -->
          <g>
            <rect x="510" y="50" width="220" height="200" fill="#fafafa" stroke="#cbd5e1"/>
            <text x="620" y="70" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">Переобучение</text>
            <text x="620" y="86" text-anchor="middle" font-size="10" fill="#64748b">Запомнила шум</text>
            <g fill="#475569">
              <circle cx="540" cy="210" r="3"/>
              <circle cx="560" cy="180" r="3"/>
              <circle cx="580" cy="140" r="3"/>
              <circle cx="600" cy="110" r="3"/>
              <circle cx="620" cy="100" r="3"/>
              <circle cx="640" cy="115" r="3"/>
              <circle cx="660" cy="145" r="3"/>
              <circle cx="680" cy="185" r="3"/>
              <circle cx="700" cy="210" r="3"/>
            </g>
            <!-- Wiggly curve passing through every point exactly -->
            <path d="M540,210 Q550,150 560,180 Q570,220 580,140 Q590,90 600,110 Q610,160 620,100 Q630,60 640,115 Q650,200 660,145 Q670,90 680,185 Q690,235 700,210" fill="none" stroke="#dc2626" stroke-width="2.2"/>
            <text x="620" y="235" text-anchor="middle" font-size="10" fill="#dc2626">Train ошибка: ~0 (идеально)</text>
            <text x="620" y="248" text-anchor="middle" font-size="10" fill="#dc2626">Test ошибка: ВЫСОКАЯ ✗</text>
          </g>
          <text x="380" y="295" text-anchor="middle" font-size="12" font-weight="600" fill="#64748b">Чёрные точки — обучающие данные (у каждого своя случайность — шум)</text>
          <text x="380" y="315" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">Цель: модель, которая отражает ПАТТЕРН, а не шум</text>
        </svg>
        <div class="caption">Слева — модель слишком простая (горизонтальная линия), не ловит закономерность. Справа — модель слишком сложная, проходит через каждую точку, включая шум. По центру — правильный баланс.</div>
      </div>

      <h3>🔍 Как обнаружить переобучение</h3>
      <ol>
        <li><b>Сравни train и test ошибки</b>. Если разница большая (train 0.02, test 0.15) — переобучение.</li>
        <li><b>Посмотри на learning curves</b>. Train ошибка падает, test ошибка сначала падает, потом растёт — точка разворота = начало переобучения.</li>
        <li><b>Используй кросс-валидацию</b>. Если разброс между фолдами большой — модель нестабильна.</li>
        <li><b>Проверь на новых данных</b>. Соберите свежий датасет и оцените — honest test.</li>
      </ol>

      <h3>🛠 Как бороться с переобучением</h3>
      <table>
        <tr><th>Метод</th><th>Как работает</th></tr>
        <tr><td><b>Больше данных</b></td><td>С ростом n сложной модели труднее запомнить всё. Самое надёжное лекарство.</td></tr>
        <tr><td><b>Регуляризация (L1, L2)</b></td><td>Штрафует большие веса, заставляет модель быть проще</td></tr>
        <tr><td><b>Early stopping</b></td><td>Останавливаем обучение, когда val-ошибка начинает расти</td></tr>
        <tr><td><b>Dropout (нейросети)</b></td><td>Случайно отключаем нейроны → ансамбль «разных» сетей</td></tr>
        <tr><td><b>Уменьшение сложности модели</b></td><td>Меньше слоёв, меньше признаков, меньше деревьев</td></tr>
        <tr><td><b>Аугментация данных</b></td><td>Искусственно создаём вариации (повороты, шум) → модель видит больше</td></tr>
        <tr><td><b>Bagging / ансамбли</b></td><td>Усреднение нескольких моделей снижает variance</td></tr>
      </table>

      <h3>⚠️ Частые причины переобучения</h3>
      <ul>
        <li><b>Слишком мало данных</b> — модель «запоминает» вместо обучения.</li>
        <li><b>Слишком много признаков</b> (curse of dimensionality) — модель находит ложные паттерны.</li>
        <li><b>Слишком сложная модель</b> — много параметров = много «степеней свободы».</li>
        <li><b>Подсматривание в test</b> — если тюнил гиперпараметры на test, ты уже переобучился на него.</li>
        <li><b>Утечка данных (leakage)</b> — признак, который содержит информацию о target из будущего.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('bias-variance')">Bias-Variance Tradeoff</a></li>
        <li><a onclick="App.selectTopic('regularization')">Регуляризация</a></li>
        <li><a onclick="App.selectTopic('cross-validation')">Кросс-валидация</a></li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Overfitting" target="_blank">Wikipedia: Overfitting</a></li>
        <li><a href="https://www.youtube.com/watch?v=EuBBz3bI-aA" target="_blank">StatQuest: Bias and Variance</a></li>
      </ul>
    `
  }
});
