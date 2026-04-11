/* ==========================================================================
   Глоссарий: Когортный анализ
   ========================================================================== */
App.registerTopic({
  id: 'glossary-cohort-analysis',
  category: 'glossary',
  title: 'Когортный анализ',
  summary: 'Группировка пользователей по времени регистрации и отслеживание их поведения со временем.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты директор школы и хочешь понять, хорошо ли учит твоя школа. Можно посмотреть «средний балл всех учеников сейчас». Но эта цифра ничего не говорит: у разных поколений разные условия. Гораздо полезнее сравнить: <b>ребята, поступившие в 2020, как они учились в 1, 2, 3 классе? А в 2021? А в 2022?</b> Если 2022 год учит лучше 2020 в те же классы — значит, школа стала эффективнее.</p>
        <p>Это и есть <b>когортный анализ</b>: группируем пользователей по моменту появления (когорта) и отслеживаем каждую когорту во времени. Только так можно отличить настоящее улучшение продукта от случайных колебаний.</p>
      </div>

      <h3>🎯 Что такое когорта</h3>
      <p><b>Когорта</b> — группа пользователей, которые начали использовать продукт в один и тот же период: неделю, месяц, квартал. Обычно когорту формируют по дате <b>первого визита</b> (acquisition cohort), реже — по дате первой покупки или другому действию.</p>
      <p><b>Когортный анализ</b> — это сравнение метрик разных когорт в привязке к «возрасту когорты» (сколько дней/недель/месяцев прошло с момента появления).</p>

      <h3>📊 Классическая когортная таблица</h3>
      <p>Самый частый формат — <b>retention table</b>: по строкам когорты, по столбцам «сколько месяцев прошло», в ячейках — процент вернувшихся пользователей.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Retention Cohort Table (heatmap)</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">% пользователей из когорты, вернувшихся через N месяцев</text>
          <!-- Header row: Month 0, 1, 2, 3, 4, 5 -->
          <g font-size="11" font-weight="700" fill="#475569" text-anchor="middle">
            <text x="160" y="80">Когорта (мес.)</text>
            <text x="250" y="80">M0</text>
            <text x="320" y="80">M1</text>
            <text x="390" y="80">M2</text>
            <text x="460" y="80">M3</text>
            <text x="530" y="80">M4</text>
            <text x="600" y="80">M5</text>
            <text x="690" y="80">Users</text>
          </g>
          <!-- Row data: cohort labels and cell values -->
          <g font-size="12" fill="#1e293b">
            <!-- Jan 2024 -->
            <text x="160" y="112" text-anchor="middle" font-weight="600">Январь</text>
            <rect x="220" y="95" width="60" height="24" fill="#1e40af"/>
            <text x="250" y="112" text-anchor="middle" fill="white" font-weight="700">100%</text>
            <rect x="290" y="95" width="60" height="24" fill="#60a5fa"/>
            <text x="320" y="112" text-anchor="middle" fill="white" font-weight="700">45%</text>
            <rect x="360" y="95" width="60" height="24" fill="#93c5fd"/>
            <text x="390" y="112" text-anchor="middle" fill="#1e293b" font-weight="700">32%</text>
            <rect x="430" y="95" width="60" height="24" fill="#bfdbfe"/>
            <text x="460" y="112" text-anchor="middle" fill="#1e293b" font-weight="700">28%</text>
            <rect x="500" y="95" width="60" height="24" fill="#dbeafe"/>
            <text x="530" y="112" text-anchor="middle" fill="#1e293b" font-weight="700">25%</text>
            <rect x="570" y="95" width="60" height="24" fill="#eff6ff"/>
            <text x="600" y="112" text-anchor="middle" fill="#1e293b" font-weight="700">23%</text>
            <text x="690" y="112" text-anchor="middle" fill="#64748b">4.2k</text>

            <!-- Feb 2024 -->
            <text x="160" y="144" text-anchor="middle" font-weight="600">Февраль</text>
            <rect x="220" y="127" width="60" height="24" fill="#1e40af"/>
            <text x="250" y="144" text-anchor="middle" fill="white" font-weight="700">100%</text>
            <rect x="290" y="127" width="60" height="24" fill="#3b82f6"/>
            <text x="320" y="144" text-anchor="middle" fill="white" font-weight="700">50%</text>
            <rect x="360" y="127" width="60" height="24" fill="#60a5fa"/>
            <text x="390" y="144" text-anchor="middle" fill="white" font-weight="700">38%</text>
            <rect x="430" y="127" width="60" height="24" fill="#93c5fd"/>
            <text x="460" y="144" text-anchor="middle" fill="#1e293b" font-weight="700">33%</text>
            <rect x="500" y="127" width="60" height="24" fill="#bfdbfe"/>
            <text x="530" y="144" text-anchor="middle" fill="#1e293b" font-weight="700">30%</text>
            <text x="600" y="144" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="690" y="144" text-anchor="middle" fill="#64748b">5.1k</text>

            <!-- Mar 2024 -->
            <text x="160" y="176" text-anchor="middle" font-weight="600">Март</text>
            <rect x="220" y="159" width="60" height="24" fill="#1e40af"/>
            <text x="250" y="176" text-anchor="middle" fill="white" font-weight="700">100%</text>
            <rect x="290" y="159" width="60" height="24" fill="#3b82f6"/>
            <text x="320" y="176" text-anchor="middle" fill="white" font-weight="700">52%</text>
            <rect x="360" y="159" width="60" height="24" fill="#60a5fa"/>
            <text x="390" y="176" text-anchor="middle" fill="white" font-weight="700">42%</text>
            <rect x="430" y="159" width="60" height="24" fill="#60a5fa"/>
            <text x="460" y="176" text-anchor="middle" fill="white" font-weight="700">36%</text>
            <text x="530" y="176" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="600" y="176" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="690" y="176" text-anchor="middle" fill="#64748b">5.8k</text>

            <!-- Apr 2024 -->
            <text x="160" y="208" text-anchor="middle" font-weight="600">Апрель</text>
            <rect x="220" y="191" width="60" height="24" fill="#1e40af"/>
            <text x="250" y="208" text-anchor="middle" fill="white" font-weight="700">100%</text>
            <rect x="290" y="191" width="60" height="24" fill="#1d4ed8"/>
            <text x="320" y="208" text-anchor="middle" fill="white" font-weight="700">58%</text>
            <rect x="360" y="191" width="60" height="24" fill="#3b82f6"/>
            <text x="390" y="208" text-anchor="middle" fill="white" font-weight="700">48%</text>
            <text x="460" y="208" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="530" y="208" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="600" y="208" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="690" y="208" text-anchor="middle" fill="#64748b">6.3k</text>

            <!-- May 2024 -->
            <text x="160" y="240" text-anchor="middle" font-weight="600">Май</text>
            <rect x="220" y="223" width="60" height="24" fill="#1e40af"/>
            <text x="250" y="240" text-anchor="middle" fill="white" font-weight="700">100%</text>
            <rect x="290" y="223" width="60" height="24" fill="#1d4ed8"/>
            <text x="320" y="240" text-anchor="middle" fill="white" font-weight="700">61%</text>
            <text x="390" y="240" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="460" y="240" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="530" y="240" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="600" y="240" text-anchor="middle" fill="#94a3b8">–</text>
            <text x="690" y="240" text-anchor="middle" fill="#64748b">7.1k</text>
          </g>
          <!-- Diagonal arrow to indicate improvement -->
          <path d="M250,265 L320,265 L600,265" stroke="#dc2626" stroke-width="0" fill="none"/>
          <text x="380" y="300" text-anchor="middle" font-size="12" font-weight="600" fill="#059669">↘ Читаем по столбцу M1: январь 45% → май 61% — retention растёт!</text>
          <text x="380" y="320" text-anchor="middle" font-size="12" font-weight="600" fill="#059669">Продукт явно улучшается от когорты к когорте.</text>
          <text x="380" y="350" text-anchor="middle" font-size="11" fill="#64748b">Диагональ (пустые ячейки) показывает «будущее», которое ещё не наступило для поздних когорт.</text>
          <text x="380" y="370" text-anchor="middle" font-size="11" fill="#64748b">Чем темнее ячейка — тем выше retention. Хорошая когорта — «лента» тёмных цветов слева направо.</text>
        </svg>
        <div class="caption">Классическая retention-heatmap. Строки — когорты (месяцы регистрации), столбцы — «возраст» когорты. Сравнивая столбец M1 сверху вниз (разные когорты в одном «возрасте»), можно увидеть, улучшается ли продукт со временем.</div>
      </div>

      <h3>💡 Как читать когортную таблицу</h3>
      <ol>
        <li><b>По строкам (горизонтально)</b>: retention curve одной когорты во времени. Обычно падает, потом стабилизируется.</li>
        <li><b>По столбцам (вертикально)</b>: сравнение разных когорт в одинаковом возрасте. Если свежие когорты выше — продукт улучшается. Если ниже — деградирует.</li>
        <li><b>Диагональ</b>: ячейки образуют «треугольник» — новые когорты имеют мало данных, старые — полную историю.</li>
      </ol>

      <h3>🎯 Зачем нужен когортный анализ</h3>
      <table>
        <tr><th>Задача</th><th>Что даёт когортный анализ</th></tr>
        <tr><td><b>Измерение влияния изменений</b></td><td>Сравнить retention когорт до и после релиза фичи</td></tr>
        <tr><td><b>Поиск Product-Market Fit</b></td><td>Retention должен стабилизироваться, а не падать в 0</td></tr>
        <tr><td><b>Расчёт LTV</b></td><td>Когорта даёт реальные данные о том, сколько в среднем платит пользователь за весь жизненный цикл</td></tr>
        <tr><td><b>Обнаружение сезонности</b></td><td>Новогодние когорты ведут себя иначе, чем летние</td></tr>
        <tr><td><b>Выявление источников оттока</b></td><td>Какие каналы привлечения дают лояльных, а какие — «одноразовых»</td></tr>
      </table>

      <h3>🔍 Виды когорт</h3>
      <ul>
        <li><b>Acquisition cohort</b> — по дате первого визита/регистрации (самый частый).</li>
        <li><b>Behavioral cohort</b> — по действию (все, кто совершил покупку в июне).</li>
        <li><b>Revenue cohort</b> — по дате первой покупки.</li>
        <li><b>Channel cohort</b> — по источнику привлечения (органика, реклама, реферал).</li>
      </ul>

      <h3>⚠️ Типичные ошибки</h3>
      <ul>
        <li><b>Смотреть только на среднюю метрику</b> (DAU, MAU) — когорты прячут, что старые хороши, а новые плохи. Или наоборот.</li>
        <li><b>Слишком мелкие когорты</b> (дневные) — большая дисперсия, тяжело интерпретировать. Обычно недельные или месячные.</li>
        <li><b>Не учитывать размер когорты</b> — маленькая когорта с «плохим» retention может быть случайностью.</li>
        <li><b>Сравнивать когорты разной длины</b> — у свежей когорты просто нет данных за M6.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('product-analytics')">Product Analytics</a> — когортный анализ как часть AARRR</li>
        <li><a onclick="App.selectTopic('glossary-funnel')">Воронка</a> — воронка + когортный анализ = полный взгляд на продукт</li>
        <li><a onclick="App.selectTopic('time-series')">Временные ряды</a> — когорты как особый вид временных рядов</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://amplitude.com/blog/cohort-analysis" target="_blank">Amplitude: cohort analysis guide</a></li>
        <li><a href="https://habr.com/ru/search/?q=%D0%BA%D0%BE%D0%B3%D0%BE%D1%80%D1%82%D0%BD%D1%8B%D0%B9%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7" target="_blank">Habr: когортный анализ</a></li>
      </ul>
    `
  }
});
