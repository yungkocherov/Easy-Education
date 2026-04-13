/* ==========================================================================
   Продуктовая аналитика
   ========================================================================== */
App.registerTopic({
  id: 'product-analytics',
  category: 'ab',
  title: 'Продуктовая аналитика',
  summary: '<a class="glossary-link" onclick="App.selectTopic('glossary-funnel')">Воронки</a>, retention, LTV, North Star метрика, <a class="glossary-link" onclick="App.selectTopic('glossary-cohort-analysis')">когортный анализ</a>.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Ключевая идея</div>
        <p>Представь продукт как живой организм. У него есть жизненные показатели: пульс (DAU), иммунитет (retention), питание (новые пользователи), метаболизм (конверсия по воронке), и наконец — сколько он «весит» в деньгах (LTV).</p>
        <p>Продуктовая аналитика — это регулярный «медосмотр» организма. Она отвечает на три вопроса: <b>здоров ли продукт сейчас?</b> Куда уходят пользователи и почему? Сколько стоит привлечение vs удержание?</p>
        <p>Без этих инструментов команда работает вслепую: добавляет фичи, которые никто не использует, тратит бюджет на привлечение пользователей, которые тут же уходят, и не замечает настоящих точек роста.</p>
      </div>

      <h3>🚀 AARRR: пиратская воронка</h3>
      <p>Фреймворк AARRR (или «пиратская метрика», потому что произносится как «аррр!») описывает жизненный путь пользователя через пять этапов:</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <defs>
            <linearGradient id="pa_acq" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#6366f1"/>
              <stop offset="100%" stop-color="#818cf8"/>
            </linearGradient>
            <linearGradient id="pa_act" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#3b82f6"/>
              <stop offset="100%" stop-color="#60a5fa"/>
            </linearGradient>
            <linearGradient id="pa_ret" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0ea5e9"/>
              <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>
            <linearGradient id="pa_rev" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#10b981"/>
              <stop offset="100%" stop-color="#34d399"/>
            </linearGradient>
            <linearGradient id="pa_ref" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#fbbf24"/>
            </linearGradient>
          </defs>
          <text x="280" y="16" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">AARRR <a class="glossary-link" onclick="App.selectTopic('glossary-funnel')">Funnel</a></text>

          <!-- Trapezoids forming a funnel -->
          <!-- Acquisition: widest -->
          <polygon points="30,28 530,28 490,70 70,70" fill="url(#pa_acq)"/>
          <text x="280" y="54" text-anchor="middle" font-size="12" font-weight="700" fill="white">Acquisition — Привлечение</text>
          <text x="544" y="52" font-size="10" fill="#6366f1">100 000</text>

          <!-- Activation -->
          <polygon points="70,74 490,74 450,116 110,116" fill="url(#pa_act)"/>
          <text x="280" y="100" text-anchor="middle" font-size="12" font-weight="700" fill="white">Activation — Активация</text>
          <text x="544" y="98" font-size="10" fill="#3b82f6">40 000</text>

          <!-- Retention -->
          <polygon points="110,120 450,120 400,162 160,162" fill="url(#pa_ret)"/>
          <text x="280" y="146" text-anchor="middle" font-size="12" font-weight="700" fill="white">Retention — Удержание</text>
          <text x="544" y="144" font-size="10" fill="#0ea5e9">20 000</text>

          <!-- Revenue -->
          <polygon points="160,166 400,166 350,208 210,208" fill="url(#pa_rev)"/>
          <text x="280" y="192" text-anchor="middle" font-size="12" font-weight="700" fill="white">Revenue — Монетизация</text>
          <text x="544" y="190" font-size="10" fill="#10b981">8 000</text>

          <!-- Referral: narrowest -->
          <polygon points="210,212 350,212 320,248 240,248" fill="url(#pa_ref)"/>
          <text x="280" y="235" text-anchor="middle" font-size="11" font-weight="700" fill="white">Referral — Рекомендации</text>
          <text x="544" y="233" font-size="10" fill="#f59e0b">3 000</text>

          <!-- Conversion rates -->
          <text x="15" y="96"  font-size="9" fill="#64748b" text-anchor="end">40%</text>
          <text x="15" y="142" font-size="9" fill="#64748b" text-anchor="end">50%</text>
          <text x="15" y="188" font-size="9" fill="#64748b" text-anchor="end">40%</text>
          <text x="15" y="234" font-size="9" fill="#64748b" text-anchor="end">37.5%</text>
        </svg>
        <div class="caption">AARRR воронка. Цифры справа — пользователи на каждом этапе. Процент слева — конверсия между этапами. Самая узкая часть — главное «бутылочное горлышко».</div>
      </div>

      <ul>
        <li><b>Acquisition (Привлечение)</b> — как пользователи узнают о продукте? Откуда приходят (SEO, реклама, word-of-mouth). Метрики: CPA, CPL, CAC, трафик по каналам.</li>
        <li><b>Activation (Активация)</b> — получил ли пользователь первую ценность? Зарегистрировался, отправил первый запрос, сделал первую покупку. Метрика: activation rate.</li>
        <li><b>Retention (Удержание)</b> — возвращается ли пользователь? Самая важная стадия — без удержания всё остальное бессмысленно. Метрики: retention rate, churn, DAU/MAU.</li>
        <li><b>Revenue (Монетизация)</b> — приносит ли пользователь деньги? Метрики: ARPU, ARPPU, конверсия в платящих, MRR, ARR.</li>
        <li><b>Referral (Рекомендации)</b> — рекомендует ли пользователь продукт? Метрики: NPS, коэффициент вирусности k-factor.</li>
      </ul>

      <h3>📊 Ключевые операционные метрики</h3>

      <h4>DAU / MAU и их отношение</h4>
      <p><span class="term" data-tip="Daily Active Users. Число уникальных пользователей, использующих продукт хотя бы раз за день. Зависит от определения 'активности' для конкретного продукта.">DAU</span> (Daily Active Users) и <span class="term" data-tip="Monthly Active Users. Число уникальных пользователей за месяц. Более стабильная метрика, чем DAU.">MAU</span> (Monthly Active Users) — базовые метрики активности.</p>
      <p><b>Stickiness = DAU / MAU</b>. Показывает, как часто месячные пользователи заходят каждый день.</p>
      <ul>
        <li>Stickiness ≈ 50%+ — очень высокое вовлечение (WhatsApp, Facebook).</li>
        <li>Stickiness ≈ 20–30% — нормально для большинства продуктов.</li>
        <li>Stickiness &lt; 10% — низкое вовлечение, нужно исследовать.</li>
      </ul>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-ab-metrics')">Retention</a> и кривые выживаемости</h4>
      <p>Retention Rate на N-й день/неделю/месяц: какая доля пользователей из <a class="glossary-link" onclick="App.selectTopic('glossary-cohort-analysis')">когорты</a> вернулась через N периодов.</p>
      <div class="math-block">$$\\text{Retention}_N = \\frac{\\text{вернулись на } N\\text{-й день}}{\\text{стартовали в день 0}}$$</div>
      <p><b>Retention curve</b> — график retention по времени. Кривая обычно резко падает в первые дни, потом стабилизируется. Форма важнее абсолютных цифр.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Retention Curve: три типичные формы</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">Что происходит с когортой со временем (день 0 = 100%)</text>
          <line x1="80" y1="280" x2="720" y2="280" stroke="#475569" stroke-width="1.5"/>
          <line x1="80" y1="60" x2="80" y2="280" stroke="#475569" stroke-width="1.5"/>
          <g font-size="11" fill="#64748b" text-anchor="end">
            <text x="75" y="284">0%</text>
            <text x="75" y="240">20%</text>
            <text x="75" y="196">40%</text>
            <text x="75" y="152">60%</text>
            <text x="75" y="108">80%</text>
            <text x="75" y="64">100%</text>
          </g>
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="80" y="300">D0</text>
            <text x="180" y="300">D1</text>
            <text x="280" y="300">D3</text>
            <text x="380" y="300">D7</text>
            <text x="505" y="300">D14</text>
            <text x="720" y="300">D30</text>
          </g>
          <text x="380" y="322" text-anchor="middle" font-size="12" fill="#64748b">дни с момента первого визита</text>
          <path d="M80,64 L180,180 L280,230 L380,255 L505,268 L720,275" fill="none" stroke="#dc2626" stroke-width="3"/>
          <path d="M80,64 L180,130 L280,155 L380,170 L505,175 L720,178" fill="none" stroke="#059669" stroke-width="3"/>
          <path d="M80,64 L180,155 L280,185 L380,205 L505,218 L720,230" fill="none" stroke="#d97706" stroke-width="3"/>
          <g>
            <circle cx="180" cy="130" r="4" fill="#059669"/>
            <circle cx="280" cy="155" r="4" fill="#059669"/>
            <circle cx="380" cy="170" r="4" fill="#059669"/>
            <circle cx="505" cy="175" r="4" fill="#059669"/>
            <circle cx="720" cy="178" r="4" fill="#059669"/>
            <circle cx="180" cy="155" r="4" fill="#d97706"/>
            <circle cx="280" cy="185" r="4" fill="#d97706"/>
            <circle cx="380" cy="205" r="4" fill="#d97706"/>
            <circle cx="505" cy="218" r="4" fill="#d97706"/>
            <circle cx="720" cy="230" r="4" fill="#d97706"/>
            <circle cx="180" cy="180" r="4" fill="#dc2626"/>
            <circle cx="280" cy="230" r="4" fill="#dc2626"/>
            <circle cx="380" cy="255" r="4" fill="#dc2626"/>
            <circle cx="505" cy="268" r="4" fill="#dc2626"/>
            <circle cx="720" cy="275" r="4" fill="#dc2626"/>
          </g>
          <g font-size="12" font-weight="600">
            <line x1="440" y1="75" x2="460" y2="75" stroke="#059669" stroke-width="3"/>
            <text x="465" y="79" fill="#059669">Здоровый продукт (стабилизация ~50%)</text>
            <line x1="440" y1="100" x2="460" y2="100" stroke="#d97706" stroke-width="3"/>
            <text x="465" y="104" fill="#d97706">Средний (медленное угасание)</text>
            <line x1="440" y1="125" x2="460" y2="125" stroke="#dc2626" stroke-width="3"/>
            <text x="465" y="129" fill="#dc2626">Leaky bucket (утечка до 0)</text>
          </g>
        </svg>
        <div class="caption">3 типичные формы кривой retention. <b>Зелёная</b> — признак Product-Market Fit: резкое падение в первые дни, потом стабилизация. <b>Жёлтая</b> — «медленная смерть». <b>Красная</b> — дырявое ведро, пользователи уходят почти сразу.</div>
      </div>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-ab-metrics')">Churn Rate</a></h4>
      <p>Churn — обратная сторона retention: доля пользователей, покинувших продукт за период.</p>
      <div class="math-block">$$\\text{Churn} = 1 - \\text{Retention}$$</div>
      <p>Высокий churn уничтожает рост: при 10% monthly churn через год остаётся лишь $0.9^{12} \\approx 28\\%$ пользователей.</p>

      <div class="key-concept">
        <div class="kc-label">Retention — главная метрика</div>
        <p>Retention — самая важная метрика продукта. Продукт с хорошим retention при любом уровне привлечения в итоге накопит аудиторию. Продукт с плохим retention — «дырявое ведро»: сколько ни наливай, всё вытечет.</p>
      </div>

      <h3>💰 LTV: Lifetime Value</h3>
      <p><span class="term" data-tip="Customer Lifetime Value (LTV или CLV). Общая выручка (или прибыль) от одного пользователя за всё время использования продукта. Определяет, сколько можно потратить на привлечение.">LTV</span> — суммарная выручка от одного пользователя за всё время использования продукта.</p>

      <p><b>Простая формула (при постоянном churn):</b></p>
      <div class="math-block">$$\\text{LTV} = \\frac{\\text{ARPU}}{\\text{Churn Rate}}$$</div>
      <p>Где ARPU — средняя выручка на пользователя в период, Churn Rate — в тех же единицах.</p>

      <p><b>Пример:</b> ARPU = 500 руб./мес., Monthly Churn = 5% → LTV = 500 / 0.05 = 10 000 руб.</p>

      <p><b>Дисконтированный LTV:</b></p>
      <div class="math-block">$$\\text{LTV} = \\sum_{t=0}^{T} \\frac{\\text{ARPU}_t \\cdot (1 - \\text{Churn})^t}{(1 + r)^t}$$</div>
      <p>Где $r$ — ставка дисконтирования (стоимость капитала). Деньги сейчас ценнее денег в будущем.</p>

      <h3>📈 CAC и отношение LTV/CAC</h3>
      <p><span class="term" data-tip="Customer Acquisition Cost. Стоимость привлечения одного платящего пользователя. CAC = Общие расходы на маркетинг / Число привлечённых пользователей за период.">CAC</span> (Customer Acquisition Cost) — стоимость привлечения одного пользователя.</p>
      <div class="math-block">$$\\text{CAC} = \\frac{\\text{Расходы на маркетинг + продажи}}{\\text{Число новых клиентов за период}}$$</div>

      <p><b>Ключевое правило:</b> LTV/CAC &gt; 3 — здоровый бизнес. LTV/CAC &lt; 1 — тонет.</p>
      <p><b>Срок окупаемости CAC:</b> CAC / (ARPU × Gross Margin). Должен быть &lt; 12 месяцев для большинства бизнесов.</p>

      <h3>🔭 Когортный анализ</h3>
      <p>Когорта — группа пользователей, объединённых каким-то событием в один период (зарегистрировались в одну неделю, сделали первую покупку в одном месяце).</p>
      <p>Когортный анализ позволяет:</p>
      <ul>
        <li>Сравнивать поведение разных когорт (улучшаются ли новые пользователи?).</li>
        <li>Видеть реальный retention без смешения новых и старых.</li>
        <li>Выявлять сезонность и влияние продуктовых изменений.</li>
      </ul>
      <p>Стандартное представление — <b>треугольная retention-таблица</b>: строки = когорты, столбцы = периоды жизни.</p>

      <h3>⭐ <a class="glossary-link" onclick="App.selectTopic('glossary-ab-metrics')">North Star Metric</a></h3>
      <p><span class="term" data-tip="North Star Metric. Одна метрика, которая лучше всего отражает ценность, которую продукт создаёт для пользователей. Объединяет всю команду вокруг одной цели.">North Star Metric (NSM)</span> — единственная метрика, которая отражает основную ценность продукта для пользователей.</p>
      <p>Примеры NSM:</p>
      <ul>
        <li><b>Airbnb</b> — количество ночей, забронированных через сервис.</li>
        <li><b>Spotify</b> — время прослушивания музыки в день.</li>
        <li><b>Facebook</b> (в эпоху роста) — число друзей, добавленных за первые 10 дней.</li>
        <li><b>WhatsApp</b> — число отправленных сообщений.</li>
        <li><b>Netflix</b> — часы просмотра на пользователя.</li>
      </ul>
      <p>Хорошая NSM: выражает ценность для пользователя (не для компании!), коррелирует с выручкой в долгосроке, поддаётся измерению, на неё может влиять вся команда.</p>

      <h3>🎯 Сегментация пользователей</h3>
      <p>Одна метрика для всех пользователей маскирует важные различия. Сегментация по:</p>
      <ul>
        <li><b>Поведению</b> — новые / активные / возвращённые / ушедшие.</li>
        <li><b>Ценности</b> — RFM: Recency (давность), Frequency (частота), Monetary (сумма).</li>
        <li><b>Каналу привлечения</b> — SEO / SEM / реферал / органика.</li>
        <li><b>Устройству / географии / демографии.</b></li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: Product-Market Fit и его измерение</summary>
        <div class="deep-dive-body">
          <p><span class="term" data-tip="Product-Market Fit. Состояние когда продукт хорошо соответствует потребностям рынка. Пользователи активно используют, рекомендуют и готовы платить. Retention-кривая стабилизируется.">Product-Market Fit (PMF)</span> — момент, когда продукт «щёлкает» для рынка. Как его измерить?</p>
          <ul>
            <li><b>Тест Шона Эллиса</b>: «Как бы вы себя чувствовали, если бы не могли больше использовать этот продукт?» Если &gt;40% отвечают «очень расстроился бы» — PMF есть.</li>
            <li><b>Retention curve</b> — если кривая retention стабилизируется (не падает до нуля) — признак PMF.</li>
            <li><b>Органический рост</b> — значительная доля новых пользователей приходит по рекомендации, без рекламы.</li>
            <li><b>NPS &gt; 40–50</b> — пользователи активно рекомендуют продукт.</li>
          </ul>
          <p>Без PMF нет смысла масштабировать маркетинг: вы ускоряете слив пользователей через дырявое ведро.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: RFM-анализ</summary>
        <div class="deep-dive-body">
          <p><b>RFM</b> — классический метод сегментации клиентов в e-commerce и SaaS:</p>
          <ul>
            <li><b>Recency (R)</b> — как давно пользователь совершил последнее действие? Свежая активность = высокий балл.</li>
            <li><b>Frequency (F)</b> — как часто пользователь активен? Больше визитов/покупок = высокий балл.</li>
            <li><b>Monetary (M)</b> — сколько денег принёс пользователь? Больше трат = высокий балл.</li>
          </ul>
          <p>Каждый пользователь получает оценку 1–5 по каждому измерению. Комбинация даёт сегменты:</p>
          <ul>
            <li><b>Champions (555)</b> — покупали недавно, часто, много. Награждай.</li>
            <li><b>At Risk (155)</b> — платили много, но давно не активны. Нужен win-back.</li>
            <li><b>Lost (111)</b> — давно, редко, мало. Реактивация дорога.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: метрики вовлечённости</summary>
        <div class="deep-dive-body">
          <p>Помимо DAU/MAU, есть более тонкие метрики вовлечённости:</p>
          <ul>
            <li><b>Session Length</b> — длительность сессии. Для медиа продуктов: дольше = лучше. Для utility: короче = лучше (задача решена быстрее).</li>
            <li><b>Sessions per User per Day</b> — частота открытия приложения.</li>
            <li><b>Feature Adoption Rate</b> — доля пользователей, использующих конкретную фичу.</li>
            <li><b>Breadth of Use</b> — сколько функций использует средний пользователь.</li>
            <li><b>L7 / L30</b> — число дней активности за последние 7/30 дней (0-7 или 0-30).</li>
          </ul>
          <p>Не существует универсально «правильных» значений — всё зависит от типа продукта. Сравнивайте с историей и с конкурентами.</p>
        </div>
      </div>

      <h3>⚠️ Типичные ошибки продуктовой аналитики</h3>
      <ul>
        <li><b>Vanity metrics</b> — «у нас 1 млн установок» без данных о retention и монетизации. Красиво, но бессмысленно.</li>
        <li><b>Смешение когорт</b> — «средний retention» скрывает деградацию: новые пользователи могут быть хуже, но их мало.</li>
        <li><b>Неправильное определение «активного»</b> — «запустил приложение» vs «получил ценность» — огромная разница.</li>
        <li><b>Оптимизация не той части воронки</b> — гнать трафик при высоком churn не поможет.</li>
        <li><b>Игнорирование сегментации</b> — средние значения скрывают сегменты с очень разным поведением.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Воронка регистрации',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Мобильное приложение. Процесс регистрации состоит из 5 шагов. Нужно найти «бутылочное горлышко» — этап с наибольшими потерями — и приоритизировать улучшения.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Шаг</th><th>Описание</th><th>Пользователей</th><th>Конверсия</th></tr>
              <tr><td>1</td><td>Открыли приложение</td><td>10 000</td><td>—</td></tr>
              <tr><td>2</td><td>Нажали «Регистрация»</td><td>6 200</td><td>62%</td></tr>
              <tr><td>3</td><td>Ввели email и пароль</td><td>4 100</td><td>66%</td></tr>
              <tr><td>4</td><td>Подтвердили email</td><td>1 640</td><td>40%</td></tr>
              <tr><td>5</td><td>Заполнили профиль</td><td>1 230</td><td>75%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Считаем потери на каждом шаге</h4>
            <div class="calc">Шаг 1→2: потеряли 3800 (38%) — решили не регистрироваться
Шаг 2→3: потеряли 2100 (34%) — бросили форму
Шаг 3→4: потеряли 2460 (60%) — не подтвердили email ← МАКСИМУМ
Шаг 4→5: потеряли  410 (25%) — не заполнили профиль

Итоговая конверсия: 1230 / 10000 = <b>12.3%</b></div>
            <div class="why">Шаг 3→4 (подтверждение email) — настоящее «бутылочное горлышко»: теряем 60% пользователей! Даже небольшое улучшение здесь даст максимальный прирост.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Оцениваем потенциальный эффект от улучшения</h4>
            <div class="calc">Сценарий: оптимизируем подтверждение email
  Текущая конверсия шага 3→4: 40%
  Цель: 60% (отправляем напоминания, упрощаем письмо)

Новый расчёт воронки:
  Шаг 4: 4100 × 0.60 = 2460 (было 1640)
  Шаг 5: 2460 × 0.75 = 1845 (было 1230)

Прирост регистраций: +615 → +50% к итоговой конверсии
Новая итоговая конверсия: 1845 / 10000 = <b>18.45%</b></div>
          </div>

          <div class="step" data-step="3">
            <h4>Сравниваем альтернативы</h4>
            <div class="calc">Оптимизация шага 1→2 (62% → 70%):
  Новый поток: 10000×0.70×0.66×0.40×0.75 = <b>1386</b> (+156, +12.7%)

Оптимизация шага 3→4 (40% → 60%):
  Новый поток: 1845  (+615, +50.0%)  ← лучше

Оптимизация шага 4→5 (75% → 90%):
  Новый поток: 10000×0.62×0.66×0.40×0.90 = <b>1476</b> (+246, +20.0%)

Приоритет: сначала шаг 3→4, потом 4→5, потом 1→2.</div>
            <div class="why">Это принцип «фиксируй снизу воронки» — оптимизация раннего шага имеет меньший эффект, если позже теряешь большую долю.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Гипотезы для улучшения шага подтверждения email</h4>
            <div class="calc">Проблема: 60% не подтверждают email

Возможные причины:
  ✗ Письмо попадает в спам
  ✗ Слишком долго ждать (устарел интерес)
  ✗ Письмо непонятное / неприятное визуально
  ✗ Пользователь забыл (нет напоминаний)

Гипотезы для тестирования:
  H1: Добавить повторное письмо через 10 минут
  H2: Добавить SMS-подтверждение как альтернативу
  H3: Улучшить дизайн письма
  H4: Разрешить начать пользование до подтверждения</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Бутылочное горлышко — шаг подтверждения email (конверсия 40%). Его оптимизация до 60% даёт +50% регистраций. Приоритет: решить проблему доставки и UX письма о подтверждении перед работой с другими шагами воронки.</p>
          </div>

          <div class="lesson-box">Funnel analysis не отвечает «почему» уходят — только «где». Для ответа на «почему» нужны качественные методы: сессионные записи, exit-опросы, usability тесты.</div>
        `
      },
      {
        title: 'Retention по когортам',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Продукт запущен 4 недели назад. Для каждой еженедельной когорты посчитан retention в последующие недели. Нужно проанализировать, улучшается ли удержание с каждой новой когортой.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Когорта</th><th>Неделя 0</th><th>Неделя 1</th><th>Неделя 2</th><th>Неделя 3</th></tr>
              <tr><td><b>Неделя 1</b></td><td>1200 (100%)</td><td>480 (40%)</td><td>264 (22%)</td><td>192 (16%)</td></tr>
              <tr><td><b>Неделя 2</b></td><td>1500 (100%)</td><td>630 (42%)</td><td>345 (23%)</td><td>—</td></tr>
              <tr><td><b>Неделя 3</b></td><td>1800 (100%)</td><td>792 (44%)</td><td>—</td><td>—</td></tr>
              <tr><td><b>Неделя 4</b></td><td>2100 (100%)</td><td>—</td><td>—</td><td>—</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Анализируем Week-1 Retention по когортам</h4>
            <div class="calc">Когорта 1: W1 retention = 40%
Когорта 2: W1 retention = 42%  (+2 п.п. vs когорта 1)
Когорта 3: W1 retention = 44%  (+2 п.п. vs когорта 2)
Когорта 4: W1 retention = ?   (данных ещё нет)

Тренд: W1 retention растёт на ~2 п.п. в неделю ✓
Это хороший знак: продуктовые улучшения повышают удержание.</div>
            <div class="why">Рост retention когорт во времени — ключевой признак Product-Market Fit. Продукт становится лучше, пользователи уходят меньше.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Анализируем кривую retention для когорты 1</h4>
            <div class="calc">Кривая: 100% → 40% → 22% → 16%

Потери:
  W0→W1: теряем 60% — очень высокий churn на старте
  W1→W2: из оставшихся теряем ещё 45%
  W2→W3: из оставшихся теряем ещё 27%

Паттерн: кривая замедляет падение.
Если к W4 retention стабилизируется на ~14–15%,
то ≈ 14–15% составит «ядро» лояльных пользователей.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Оцениваем «дырявость» воронки</h4>
            <div class="calc">Модель роста DAU (без учёта смерти когорт):
  Предположим retention по схеме когорты 1: 100→40→22→16→14→14...

  Когорта W1 (1200): вклад в будущие недели
    W1: 480, W2: 264, W3: 192, W4: 168, W5+: ~168...

  Установившееся состояние для когорты 1200 пользователей:
    Долгосрочный вклад = 1200 × 0.14 = 168 DAU/неделю

  Если привлечение растёт (1200→1500→1800→2100):
    Накопленный DAU ≈ Σ(когорта × retention к текущей неделе)
    После 4 недель: 2100×1 + 1800×0.44 + 1500×0.23 + 1200×0.16
                   = 2100 + 792 + 345 + 192 = <b>3429 WAU</b></div>
          </div>

          <div class="step" data-step="4">
            <h4>Предупреждающий сигнал: W0→W1 churn = 60%</h4>
            <div class="calc">60% уходят после первой недели — критично высоко.

Возможные причины:
  • Плохой onboarding — не показали ценность быстро
  • Несоответствие ожиданий (реклама обещала одно, продукт другое)
  • Продукт не решает проблему достаточно хорошо
  • Технические проблемы (краши, тормоза)

Цель: улучшить W1 retention хотя бы до 50–55%
  Эффект: долгосрочное ядро выросло бы с 14% до ~18-20%
  Это +28-43% LTV при том же привлечении!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Хорошая новость: retention когорт растёт (+2 п.п./неделю) — продукт улучшается. Плохая новость: W1 retention только 40–44% — первая неделя критична. Приоритет: оптимизировать onboarding для снижения churn в первую неделю. WAU после 4 недель ≈ 3429.</p>
          </div>

          <div class="lesson-box">Когортный анализ — единственный способ честно измерить retention без «смешения» новых и старых пользователей. Агрегированный «средний DAU» скрывает деградацию или улучшение.</div>
        `
      },
      {
        title: 'Расчёт LTV',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>SaaS-продукт с подпиской. Нужно рассчитать LTV тремя способами (простым, дисконтированным, когортным) и сравнить с CAC для оценки unit-экономики.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Метрика</th><th>Значение</th></tr>
              <tr><td>ARPU (средняя выручка/пользователь/мес.)</td><td>1 500 руб.</td></tr>
              <tr><td>Gross Margin</td><td>70%</td></tr>
              <tr><td>Monthly Churn Rate</td><td>4%</td></tr>
              <tr><td>CAC (стоимость привлечения)</td><td>12 000 руб.</td></tr>
              <tr><td>Ставка дисконтирования (годовая)</td><td>24%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Способ 1: Простая формула</h4>
            <div class="calc">LTV = ARPU / Churn Rate
    = 1 500 / 0.04
    = <b>37 500 руб.</b>

LTV (по прибыли, с учётом маржи):
    = ARPU × Gross Margin / Churn Rate
    = 1 500 × 0.70 / 0.04
    = <b>26 250 руб.</b>

Средняя жизнь клиента = 1 / Churn Rate = 1/0.04 = <b>25 месяцев</b></div>
            <div class="why">LTV = ARPU/Churn выводится из суммы геометрической прогрессии: ARPU×(1+s+s²+...)=ARPU/(1-s), где s=1-churn. При churn=4% средний клиент остаётся 25 месяцев.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Способ 2: Дисконтированный LTV</h4>
            <div class="calc">Месячная ставка: r_m = (1+0.24)^(1/12) − 1 ≈ 1.81%

Дисконтированный LTV = ARPU × Gross Margin / (Churn + r_m)
    = 1 500 × 0.70 / (0.04 + 0.0181)
    = 1 050 / 0.0581
    ≈ <b>18 072 руб.</b>

Разница с недисконтированным: 26 250 vs 18 072
  → Деньги в будущем стоят меньше — разница 31%!</div>
            <div class="why">Дисконтирование важно для финансового планирования. При высоких ставках (стартапы, развивающиеся рынки) LTV значительно меньше простой формулы.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Способ 3: Когортный LTV (накопительный)</h4>
            <div class="calc">Когорта 1000 пользователей, ARPU = 1500 руб.:
  Мес. 1:  1000 × 0.96^0 × 1500 = 1 500 000 руб.
  Мес. 2:  1000 × 0.96^1 × 1500 = 1 440 000 руб.
  Мес. 3:  1000 × 0.96^2 × 1500 = 1 382 400 руб.
  ...
  Мес. 12: 1000 × 0.96^11× 1500 = 953 270 руб.

Накопленная выручка за 12 мес. на когорту:
  = 1500 × Σ(k=0..11) 0.96^k × 1000
  = 1500 × 1000 × (1−0.96^12)/(1−0.96)
  = 1 500 000 × (1−0.612)/0.04
  = 1 500 000 × 9.70
  ≈ 14 550 000 / 1000 = <b>14 550 руб./клиент за 12 мес.</b>

За 24 месяца: ≈ 22 700 руб./клиент (55% всего LTV приходит в первые 2 года)</div>
          </div>

          <div class="step" data-step="4">
            <h4>Unit-экономика: LTV vs CAC</h4>
            <div class="calc">CAC = 12 000 руб.
LTV (простой, с маржой) = 26 250 руб.

LTV/CAC = 26 250 / 12 000 = <b>2.19</b>  ← ниже нормы (≥3)

Срок окупаемости CAC:
  Ежемесячная прибыль на клиента = 1500 × 0.70 = 1050 руб.
  Payback period = 12 000 / 1050 ≈ <b>11.4 месяцев</b>

Вывод: бизнес окупает привлечение за ~11 мес. — приемлемо.
Но LTV/CAC = 2.2 — ниже целевых 3.
Нужно либо снизить CAC с 12 000 до 8 750 руб. (↓27%)
       либо увеличить ARPU или снизить churn.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Чувствительность: влияние churn на LTV</h4>
            <div class="calc">Как меняется LTV при улучшении churn:
  Churn 5%  → LTV = 1050/0.05 = 21 000 руб. (базовый)
  Churn 4%  → LTV = 1050/0.04 = 26 250 руб. (+25%)
  Churn 3%  → LTV = 1050/0.03 = 35 000 руб. (+67%)
  Churn 2%  → LTV = 1050/0.02 = 52 500 руб. (+150%)

Вывод: снижение churn на 1 п.п. даёт несоразмерно большой
прирост LTV — retention критически важнее, чем кажется!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>LTV (с маржой) = 26 250 руб. (простой) / 18 072 руб. (дисконтированный). CAC = 12 000 руб. LTV/CAC = 2.19 — ниже целевых 3. Payback = 11.4 мес. Главная рекомендация: снижение churn с 4% до 3% даёт +33% к LTV и улучшает LTV/CAC с 2.2 до 2.9.</p>
          </div>

          <div class="lesson-box">LTV чрезвычайно чувствителен к churn rate — это нелинейная зависимость (1/churn). Уменьшение churn вдвое удваивает LTV. Инвестиции в retention часто дают больший ROI, чем снижение CAC.</div>
        `
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: воронка конверсий</h3>
        <p>Настрой конверсию на каждом шаге и число пользователей. Наблюдай, где теряется больше всего.</p>
        <div class="sim-container">
          <div class="sim-controls" id="funnel-controls"></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="funnel-chart"></canvas></div>
            <div class="sim-stats" id="funnel-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#funnel-controls');
        const cUsers = App.makeControl('range', 'funnel-users', 'Пользователей', { min: 1000, max: 50000, step: 500, value: 10000 });
        const cS1 = App.makeControl('range', 'funnel-s1', 'Визит → Регистр. (%)', { min: 50, max: 100, step: 1, value: 80 });
        const cS2 = App.makeControl('range', 'funnel-s2', 'Регистр. → Актив. (%)', { min: 20, max: 80, step: 1, value: 50 });
        const cS3 = App.makeControl('range', 'funnel-s3', 'Актив. → Покупка (%)', { min: 10, max: 60, step: 1, value: 30 });
        const cS4 = App.makeControl('range', 'funnel-s4', 'Покупка → Повтор (%)', { min: 5, max: 40, step: 1, value: 15 });
        [cUsers, cS1, cS2, cS3, cS4].forEach(c => controls.appendChild(c.wrap));

        let chart = null;

        function update() {
          const total = +cUsers.input.value;
          const s1 = +cS1.input.value / 100;
          const s2 = +cS2.input.value / 100;
          const s3 = +cS3.input.value / 100;
          const s4 = +cS4.input.value / 100;

          const steps = [
            { name: 'Визит', count: total },
            { name: 'Регистрация', count: Math.round(total * s1) },
            { name: 'Активация', count: Math.round(total * s1 * s2) },
            { name: 'Покупка', count: Math.round(total * s1 * s2 * s3) },
            { name: 'Повторная', count: Math.round(total * s1 * s2 * s3 * s4) },
          ];

          // find biggest drop
          let maxDrop = 0, maxDropIdx = 0;
          for (let i = 1; i < steps.length; i++) {
            const drop = steps[i - 1].count - steps[i].count;
            if (drop > maxDrop) { maxDrop = drop; maxDropIdx = i; }
          }
          const biggestDrop = steps[maxDropIdx - 1].name + ' → ' + steps[maxDropIdx].name;

          const overallConv = (steps[steps.length - 1].count / steps[0].count * 100).toFixed(2);

          const colors = [
            'rgba(99,102,241,0.8)',
            'rgba(59,130,246,0.8)',
            'rgba(16,185,129,0.8)',
            'rgba(245,158,11,0.8)',
            'rgba(239,68,68,0.8)',
          ];

          const ctx = container.querySelector('#funnel-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: steps.map(s => s.name),
              datasets: [{
                label: 'Пользователей',
                data: steps.map(s => s.count),
                backgroundColor: colors,
                borderWidth: 0,
              }],
            },
            options: {
              indexAxis: 'y',
              responsive: true, maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: 'Воронка конверсий' },
                legend: { display: false },
              },
              scales: { x: { beginAtZero: true } },
            },
          });
          App.registerChart(chart);

          container.querySelector('#funnel-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Всего визитов</div><div class="stat-value">${total.toLocaleString()}</div></div>
            <div class="stat-card"><div class="stat-label">Покупок</div><div class="stat-value">${steps[3].count.toLocaleString()}</div></div>
            <div class="stat-card"><div class="stat-label">Общая конверсия</div><div class="stat-value">${overallConv}%</div></div>
            <div class="stat-card"><div class="stat-label">Макс. потеря</div><div class="stat-value">${biggestDrop}</div></div>
          `;
        }

        [cUsers, cS1, cS2, cS3, cS4].forEach(c => c.input.addEventListener('input', update));
        update();
      },
    },

    python: `
      <h3>📊 Когортный анализ Retention в Pandas</h3>
      <pre><code>import pandas as pd
import numpy as np

# Симулируем данные регистраций и визитов
np.random.seed(42)
dates = pd.date_range('2024-01-01', periods=90, freq='D')
users = []

for day in dates[:30]:  # Когорты за первый месяц
    n_new = np.random.randint(80, 150)
    for uid in range(n_new):
        reg_date = day
        # Генерируем визиты с убывающей вероятностью
        for d in range(90):
            visit_date = reg_date + pd.Timedelta(days=d)
            prob = 0.5 * np.exp(-0.03 * d)  # экспоненциальное затухание
            if np.random.random() < prob or d == 0:
                users.append({'user_id': f'{day.date()}_{uid}',
                             'reg_date': reg_date,
                             'visit_date': visit_date})

df = pd.DataFrame(users)
df['cohort'] = df['reg_date'].dt.to_period('W')   # недельные когорты
df['day_n'] = (df['visit_date'] - df['reg_date']).dt.days

print(f"Всего записей: {len(df)}")
print(f"Уникальных пользователей: {df['user_id'].nunique()}")
print(f"Когорт: {df['cohort'].nunique()}")</code></pre>

      <h3>📋 Pivot-таблица Retention</h3>
      <pre><code># Считаем Retention по когортам
cohort_sizes = df.groupby('cohort')['user_id'].nunique()

retention = (df.groupby(['cohort', 'day_n'])['user_id']
             .nunique()
             .unstack(fill_value=0))

# Берём ключевые дни
key_days = [0, 1, 3, 7, 14, 30]
retention_pct = retention[key_days].div(cohort_sizes, axis=0) * 100

print("Retention (%) по когортам:")
print(retention_pct.round(1).head(8))
print(f"\\nСредний Ret D1:  {retention_pct[1].mean():.1f}%")
print(f"Средний Ret D7:  {retention_pct[7].mean():.1f}%")
print(f"Средний Ret D30: {retention_pct[30].mean():.1f}%")</code></pre>

      <h3>📈 Heatmap Retention</h3>
      <pre><code>import matplotlib.pyplot as plt
import seaborn as sns

fig, ax = plt.subplots(figsize=(10, 6))
sns.heatmap(retention_pct.round(1), annot=True, fmt='.1f',
            cmap='YlOrRd_r', vmin=0, vmax=100, ax=ax)
ax.set_title("Retention (%) по когортам")
ax.set_xlabel("День после регистрации")
ax.set_ylabel("Когорта (неделя)")
plt.tight_layout()
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяется Product Analytics</h3>
      <table>
        <tr><th>Тип продукта</th><th>Ключевые метрики</th></tr>
        <tr><td><b>SaaS / B2B</b></td><td>MRR, churn, LTV, CAC, NPS, feature adoption, activation rate</td></tr>
        <tr><td><b>E-commerce</b></td><td>Конверсия, AOV, CR по воронке, retention, cart abandonment</td></tr>
        <tr><td><b>Social / Media</b></td><td>DAU/MAU, stickiness, engagement, time spent, viral coefficient</td></tr>
        <tr><td><b>Mobile apps</b></td><td>Install → активация, D1/D7/D30 retention, session length, ARPU</td></tr>
        <tr><td><b>Marketplaces</b></td><td>GMV, take rate, liquidity, cross-side network effects</td></tr>
        <tr><td><b>FinTech</b></td><td>Активация счёта, средний баланс, частота транзакций, cross-sell</td></tr>
        <tr><td><b>Gaming</b></td><td>K-factor, LTV, monetization funnel, ARPPU, уровни retention</td></tr>
      </table>
        `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы продуктовой аналитики</h4>
          <ul>
            <li>Превращает интуицию в измеримые решения</li>
            <li>Выявляет точки роста без лишних экспериментов</li>
            <li>AARRR даёт системный взгляд на весь путь пользователя</li>
            <li>Когортный анализ честно показывает улучшение продукта во времени</li>
            <li>LTV/CAC — универсальный язык для бизнес-решений</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Ограничения и подводные камни</h4>
          <ul>
            <li>Vanity metrics могут вводить в заблуждение (DAU без retention)</li>
            <li>Корреляция метрик не означает причинность — нужны A/B тесты</li>
            <li>Плохое определение «активного пользователя» искажает все расчёты</li>
            <li>LTV-формулы предполагают постоянный churn — редко верно в реальности</li>
            <li>Сегментация без достаточных данных может быть недостоверной</li>
          </ul>
        </div>
      </div>
      <div class="callout warn">⚠️ Аналитика отвечает «что» и «сколько», но не «почему». Для ответа «почему» нужны качественные методы: интервью, usability тесты, сессионные записи. Оба подхода дополняют, а не заменяют друг друга.</div>
      <div class="callout">💡 <b>Приоритет метрик:</b> Retention → Activation → Revenue → Acquisition → Referral. Начинай с удержания, а не с привлечения. Без retention деньги на маркетинг уходят в «дырявое ведро».</div>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=lHI5oEgNkrk" target="_blank">Power and Sample Size (StatQuest)</a> — принципы дизайна экспериментов для продуктовой аналитики</li>
        <li><a href="https://www.youtube.com/watch?v=vemZtEM63GY" target="_blank">StatQuest: p-values</a> — как интерпретировать результаты продуктовых A/B тестов</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability" target="_blank">Khan Academy: Statistics and Probability</a> — статистические основы для продуктового аналитика</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D0%BA%D0%B8%20%D0%B2%D0%BE%D1%80%D0%BE%D0%BD%D0%BA%D0%B0" target="_blank">Habr: продуктовая аналитика</a> — метрики, когортный анализ, воронки на Хабре</li>
        <li><a href="https://habr.com/ru/search/?q=%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%20%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D0%BA%D0%B8%20%D0%B2%D0%BE%D1%80%D0%BE%D0%BD%D0%BA%D0%B0" target="_blank">Habr: unit-экономика</a> — LTV, CAC, ARPU и расчёт unit-экономики</li>
        <li><a href="https://en.wikipedia.org/wiki/Customer_lifetime_value" target="_blank">Wikipedia: Customer Lifetime Value</a> — формулы и методы расчёта LTV</li>
      </ul>
      <h3>📚 Документация и инструменты</h3>
      <ul>
        <li><a href="https://amplitude.com/docs" target="_blank">Amplitude: Documentation</a> — полная документация по продуктовой аналитике в Amplitude</li>
        <li><a href="https://pandas.pydata.org/docs/reference/groupby.html" target="_blank">Pandas: GroupBy</a> — когортный анализ и агрегации для продуктовых метрик</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html" target="_blank">SciPy: scipy.stats</a> — статистические тесты для проверки продуктовых гипотез</li>
      </ul>
    `,
  },
});
