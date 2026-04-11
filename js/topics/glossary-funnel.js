/* ==========================================================================
   Глоссарий: Воронка (Funnel Analysis)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-funnel',
  category: 'glossary',
  title: 'Воронка (Funnel)',
  summary: 'Последовательность шагов пользователя и конверсия между ними — главный инструмент product analytics.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты продаёшь книги через интернет-магазин. Путь пользователя от первого визита до покупки состоит из шагов: <b>зашёл на сайт → увидел товар → добавил в корзину → оформил заказ → оплатил</b>. На каждом шаге часть людей «отваливается». Если визуально изобразить это — получится форма <b>воронки</b>: широкая сверху (много визитов), узкая снизу (мало покупок).</p>
        <p>Воронка показывает, где именно ты теряешь пользователей, и помогает сфокусировать усилия на самом узком месте. Самое полезное правило: <b>не оптимизируй шаг, который не является бутылочным горлышком</b>.</p>
      </div>

      <h3>🎯 Что такое воронка</h3>
      <p><b>Воронка (funnel)</b> — последовательность дискретных событий, которые пользователь проходит по порядку. Метрика воронки — <b>конверсия</b> между соседними шагами (step-to-step conversion) и <b>общая конверсия</b> (от первого до последнего шага).</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Воронка интернет-магазина</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">Каждая ступень — число пользователей на этом шаге</text>
          <!-- 5 trapezoids getting narrower -->
          <path d="M 100,60 L 660,60 L 600,110 L 160,110 Z" fill="#dbeafe" stroke="#1e40af" stroke-width="2"/>
          <text x="380" y="92" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">1. Визит сайта</text>
          <text x="685" y="90" font-size="13" font-weight="700" fill="#1e40af">10 000</text>

          <path d="M 160,120 L 600,120 L 540,170 L 220,170 Z" fill="#bfdbfe" stroke="#1e40af" stroke-width="2"/>
          <text x="380" y="152" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">2. Просмотр товара</text>
          <text x="685" y="150" font-size="13" font-weight="700" fill="#1e40af">6 200</text>
          <!-- Conversion label -->
          <text x="80" y="125" text-anchor="end" font-size="11" font-weight="600" fill="#059669">62%</text>

          <path d="M 220,180 L 540,180 L 480,230 L 280,230 Z" fill="#93c5fd" stroke="#1e40af" stroke-width="2"/>
          <text x="380" y="212" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">3. В корзину</text>
          <text x="685" y="210" font-size="13" font-weight="700" fill="#1e40af">4 100</text>
          <text x="200" y="185" text-anchor="end" font-size="11" font-weight="600" fill="#059669">66%</text>

          <path d="M 280,240 L 480,240 L 420,290 L 340,290 Z" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
          <text x="380" y="272" text-anchor="middle" font-size="14" font-weight="700" fill="#991b1b">4. Оформление</text>
          <text x="685" y="270" font-size="13" font-weight="700" fill="#991b1b">1 640</text>
          <text x="260" y="245" text-anchor="end" font-size="12" font-weight="800" fill="#dc2626">40% ⚠</text>

          <path d="M 340,300 L 420,300 L 400,350 L 360,350 Z" fill="#bbf7d0" stroke="#059669" stroke-width="2"/>
          <text x="380" y="332" text-anchor="middle" font-size="13" font-weight="700" fill="#047857">5. Оплата</text>
          <text x="685" y="330" font-size="13" font-weight="700" fill="#047857">1 230</text>
          <text x="320" y="305" text-anchor="end" font-size="11" font-weight="600" fill="#059669">75%</text>

          <!-- Arrow pointing to bottleneck -->
          <path d="M 540,260 L 500,275" stroke="#dc2626" stroke-width="2" fill="none" marker-end="url(#fnl-arr)"/>
          <text x="565" y="264" font-size="12" font-weight="700" fill="#dc2626">Бутылочное</text>
          <text x="565" y="278" font-size="12" font-weight="700" fill="#dc2626">горлышко!</text>
          <defs>
            <marker id="fnl-arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#dc2626"/>
            </marker>
          </defs>
          <!-- Overall conversion -->
          <text x="380" y="373" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">Общая конверсия: 12.3% (10 000 → 1 230)</text>
        </svg>
        <div class="caption">Типичная воронка e-commerce. Каждая зелёная подпись — конверсия от предыдущего шага. Шаг «Оформление» (40%) — главный провал: он теряет больше всех пользователей. Именно его и надо оптимизировать.</div>
      </div>

      <h3>📊 Как считается конверсия</h3>
      <div class="math-block">$$\\text{Step Conversion}_{i} = \\frac{\\text{Users at step } i}{\\text{Users at step } i-1}$$</div>
      <div class="math-block">$$\\text{Total Conversion} = \\frac{\\text{Users at last step}}{\\text{Users at first step}}$$</div>
      <p>Общая конверсия = произведение всех step conversions: $0.62 \\times 0.66 \\times 0.40 \\times 0.75 \\approx 0.123$.</p>

      <h3>🔍 Как читать воронку</h3>
      <ol>
        <li><b>Найди самый «узкий» шаг</b> — где конверсия сильно меньше, чем на других. Это первый кандидат для оптимизации.</li>
        <li><b>Сравни со стандартами отрасли</b>. Для e-commerce «норма»: visit→add to cart 5-10%, cart→checkout 60-80%, checkout→payment 70-90%.</li>
        <li><b>Сегментируй по источникам</b>. Воронка для органического трафика может сильно отличаться от платного.</li>
        <li><b>Сравни с прошлым периодом</b>. Внезапное падение на каком-то шаге — сигнал о баге или изменениях.</li>
      </ol>

      <div class="key-concept">
        <div class="kc-label">Эффект оптимизации узкого места</div>
        <p>Улучшение самого узкого шага имеет <b>мультипликативный</b> эффект на всю воронку. В примере выше: если улучшить шаг 4 с 40% до 60% (на 50% relative), общая конверсия вырастет с 12.3% до 18.4% — <b>плюс 50% продаж</b>. Улучшение шага с 66% до 75% дало бы лишь +14%.</p>
      </div>

      <h3>⚙️ Строгая vs мягкая воронка</h3>
      <ul>
        <li><b>Строгая (strict)</b>: шаги должны идти в строгом порядке, без пропусков. A → B → C. Пользователь, который сделал C без B, не считается.</li>
        <li><b>Мягкая (any order / relaxed)</b>: шаги могут идти в любом порядке. Учитывается, что пользователь «сделал C» — даже если потом вернулся к B.</li>
        <li><b>С окном времени (time-window)</b>: все шаги должны произойти в пределах 1 часа / 1 дня / 7 дней. Полезно, когда одни и те же действия могут повторяться у одного пользователя.</li>
      </ul>

      <h3>⚠️ Типичные ошибки</h3>
      <ul>
        <li><b>Оптимизировать не то место.</b> Оптимизация шага, который и так конвертит в 90%, даст мало эффекта. Всегда иди к узкому месту.</li>
        <li><b>Игнорировать сегментацию.</b> Одна и та же воронка может выглядеть отлично в среднем, но плохо на мобильных / в регионах.</li>
        <li><b>Считать общую конверсию без учёта временного окна.</b> Если пользователь купил через месяц после первого визита — он всё ещё сконвертировался?</li>
        <li><b>Игнорировать cross-session paths.</b> Пользователь может «добавить в корзину», уйти и купить через неделю. Строгая session-based воронка его не увидит.</li>
        <li><b>Не учитывать повторные попытки.</b> Один пользователь может пройти воронку несколько раз — это искажает метрики.</li>
      </ul>

      <h3>🛠 Инструменты</h3>
      <ul>
        <li><b>Google Analytics / GA4</b> — встроенные воронки, поддержка сегментации.</li>
        <li><b>Amplitude, Mixpanel</b> — профессиональные Product Analytics платформы, продвинутые воронки с time windows, path analysis.</li>
        <li><b>Собственный SQL по event-логам</b> — максимальная гибкость, но трудозатратно.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('product-analytics')">Product Analytics</a> — полный контекст применения воронки.</li>
        <li><a onclick="App.selectTopic('glossary-cohort-analysis')">Когортный анализ</a> — дополняет воронку временным измерением.</li>
        <li><a onclick="App.selectTopic('ab-testing-intro')">A/B тесты</a> — главный инструмент улучшения воронки.</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://amplitude.com/blog/funnel-analysis" target="_blank">Amplitude: guide to funnel analysis</a></li>
        <li><a href="https://habr.com/ru/search/?q=%D0%B2%D0%BE%D1%80%D0%BE%D0%BD%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0" target="_blank">Habr: воронки и product analytics</a></li>
      </ul>
    `
  }
});
