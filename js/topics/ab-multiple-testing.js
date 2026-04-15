/* ==========================================================================
   Множественные сравнения
   ========================================================================== */
App.registerTopic({
  id: 'ab-multiple-testing',
  category: 'ab',
  title: 'Множественные сравнения',
  summary: 'Поправки Бонферрони, FDR, FWER — когда тестируешь много гипотез.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Ключевая идея</div>
        <p>Представь, что ты бросаешь монетку. Вероятность орла — 50%. Если бросишь 1 раз — маловероятно увидеть орла и решить, что монетка нечестная. Но если бросишь <b>100 раз</b> и будешь каждый раз проверять «не странный ли этот бросок?» — почти наверняка найдёшь что-то «подозрительное».</p>
        <p>Это и есть проблема множественных сравнений. Если ты одновременно проверяешь 20 гипотез при уровне значимости α = 0.05, то <b>в среднем одна из них окажется «значимой» просто случайно</b> — даже если ни одна из них не верна в реальности.</p>
        <p>Поправки на множественные сравнения позволяют контролировать вероятность хотя бы одной ложной находки при проверке многих гипотез сразу.</p>
      </div>

      <h3>🎯 Математика проблемы</h3>
      <p>При одном тесте с α = 0.05 вероятность ошибки I рода: P(ошибка) = 0.05.</p>
      <p>При m независимых тестах вероятность <b>хотя бы одной</b> ошибки I рода:</p>
      <div class="math-block">$$P(\\text{хотя бы 1 ошибка}) = 1 - (1 - \\alpha)^m$$</div>
      <table>
        <tr><th>m тестов</th><th>P(≥1 ложная значимость)</th></tr>
        <tr><td>1</td><td>5.0%</td></tr>
        <tr><td>5</td><td>22.6%</td></tr>
        <tr><td>10</td><td>40.1%</td></tr>
        <tr><td>20</td><td>64.2%</td></tr>
        <tr><td>50</td><td>92.3%</td></tr>
        <tr><td>100</td><td>99.4%</td></tr>
      </table>
      <p>При 20 тестах вы ошибаетесь с вероятностью 64%! Это неприемлемо.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Накопление ложных открытий с числом тестов m</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">P(хотя бы одна ложная) = 1 − (1 − α)ᵐ при α = 0.05</text>
          <!-- Axes -->
          <line x1="80" y1="260" x2="720" y2="260" stroke="#475569" stroke-width="1.5"/>
          <line x1="80" y1="60" x2="80" y2="260" stroke="#475569" stroke-width="1.5"/>
          <!-- Y ticks -->
          <g font-size="11" fill="#64748b" text-anchor="end">
            <text x="75" y="264">0%</text>
            <text x="75" y="214">25%</text>
            <text x="75" y="164">50%</text>
            <text x="75" y="114">75%</text>
            <text x="75" y="64">100%</text>
          </g>
          <!-- Grid lines -->
          <line x1="80" y1="214" x2="720" y2="214" stroke="#e5e7eb" stroke-width="0.7"/>
          <line x1="80" y1="164" x2="720" y2="164" stroke="#e5e7eb" stroke-width="0.7"/>
          <line x1="80" y1="114" x2="720" y2="114" stroke="#e5e7eb" stroke-width="0.7"/>
          <!-- X ticks (0..50) -->
          <g font-size="11" fill="#64748b" text-anchor="middle">
            <text x="80" y="280">0</text>
            <text x="208" y="280">10</text>
            <text x="336" y="280">20</text>
            <text x="464" y="280">30</text>
            <text x="592" y="280">40</text>
            <text x="720" y="280">50</text>
          </g>
          <text x="380" y="302" text-anchor="middle" font-size="12" fill="#64748b">число тестов m</text>
          <text x="40" y="160" text-anchor="middle" font-size="12" fill="#64748b" transform="rotate(-90 40 160)">FWER</text>
          <!-- Curve (computed below) -->
          <path id="mt-fwer-curve" d="" fill="none" stroke="#dc2626" stroke-width="3"/>
          <!-- Horizontal line at 5% (target FWER with Bonferroni) -->
          <line x1="80" y1="250" x2="720" y2="250" stroke="#059669" stroke-width="2.2" stroke-dasharray="6,4"/>
          <!-- Annotations -->
          <text x="640" y="85" text-anchor="end" font-size="13" font-weight="700" fill="#dc2626">Без поправки</text>
          <text x="640" y="245" text-anchor="end" font-size="13" font-weight="700" fill="#059669">С поправкой Бонферрони (≤5%)</text>
          <!-- Key points with labels -->
          <circle id="mt-pt-5" cx="0" cy="0" r="5" fill="#dc2626"/>
          <text id="mt-lbl-5" x="0" y="0" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">23%</text>
          <circle id="mt-pt-10" cx="0" cy="0" r="5" fill="#dc2626"/>
          <text id="mt-lbl-10" x="0" y="0" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">40%</text>
          <circle id="mt-pt-20" cx="0" cy="0" r="5" fill="#dc2626"/>
          <text id="mt-lbl-20" x="0" y="0" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">64%</text>
          <circle id="mt-pt-50" cx="0" cy="0" r="5" fill="#dc2626"/>
          <text id="mt-lbl-50" x="0" y="0" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">92%</text>
        </svg>
        <div class="caption">Красная кривая: рост FWER (вероятность ≥1 ложного открытия) с числом тестов при α=0.05 без поправки. Уже при 10 тестах почти 40%, при 20 — 64%. Зелёная линия: FWER после поправки Бонферрони остаётся ≤5% при любом m.</div>
        <script>
        (function() {
          // Build exact curve: y = 1 - 0.95^m for m = 0..50
          var x0 = 80, x1 = 720, y0 = 260, y1 = 60;  // axes
          var pts = [];
          for (var m = 0; m <= 50; m += 0.5) {
            var x = x0 + (m / 50) * (x1 - x0);
            var p = 1 - Math.pow(0.95, m);
            var y = y0 - p * (y0 - y1);
            pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
          }
          var d = 'M' + pts[0][0] + ',' + pts[0][1];
          for (var i = 1; i < pts.length; i++) d += ' L' + pts[i][0] + ',' + pts[i][1];
          document.getElementById('mt-fwer-curve').setAttribute('d', d);
          // Place markers at m = 5, 10, 20, 50
          function placeAt(m, idCircle, idLabel, text) {
            var x = x0 + (m / 50) * (x1 - x0);
            var p = 1 - Math.pow(0.95, m);
            var y = y0 - p * (y0 - y1);
            var c = document.getElementById(idCircle);
            c.setAttribute('cx', x); c.setAttribute('cy', y);
            var l = document.getElementById(idLabel);
            l.setAttribute('x', x); l.setAttribute('y', y - 10);
            l.textContent = text;
          }
          placeAt(5, 'mt-pt-5', 'mt-lbl-5', '23%');
          placeAt(10, 'mt-pt-10', 'mt-lbl-10', '40%');
          placeAt(20, 'mt-pt-20', 'mt-lbl-20', '64%');
          placeAt(50, 'mt-pt-50', 'mt-lbl-50', '92%');
        })();
        </script>
      </div>

      <h3>📊 FWER — Family-Wise Error Rate</h3>
      <p><span class="term" data-tip="Family-Wise Error Rate. Вероятность хотя бы одной ложной значимости (ошибки I рода) среди всех m тестов. Строгий критерий: контролируем вероятность ЛЮБОЙ ошибки.">FWER</span> = вероятность хотя бы одной ложной значимости в наборе из m тестов.</p>
      <p>Методы контроля FWER подходят, когда цена любой ошибки высока: клинические исследования, финансовые решения, принятие научных публикаций.</p>

      <h3>🔧 <a class="glossary-link" onclick="App.selectTopic('glossary-multiple-testing')">Поправка Бонферрони</a></h3>
      <p>Самый простой и известный метод. Логика: если хочу FWER ≤ α при m тестах, уменьшаю порог для каждого теста:</p>
      <div class="math-block">$$\\alpha_{\\text{adj}} = \\frac{\\alpha}{m}$$</div>
      <p>Отвергаем $H_{0,i}$ только если $p_i < \\alpha/m$.</p>
      <p><b>Пример:</b> 20 тестов с α = 0.05 → новый порог = 0.0025.</p>
      <p><b>Плюс:</b> очень простой, надёжно контролирует FWER.</p>
      <p><b>Минус:</b> слишком консервативный — при большом m почти невозможно что-то обнаружить. Теряется много мощности.</p>

      <div class="key-concept">
        <div class="kc-label">Когда Бонферрони применим</div>
        <p>Бонферрони подходит, когда тесты независимы или число тестов невелико (m ≤ 10–20). При сильных корреляциях между тестами он слишком строгий — существуют более точные методы (Šidák, permutation-based).</p>
      </div>

      <h3>🪜 Метод Холма-Бонферрони (step-down)</h3>
      <p><span class="term" data-tip="Holm-Bonferroni method. Step-down процедура: сортируем p-values по возрастанию, сравниваем с убывающими порогами. Строго контролирует FWER, но мощнее Бонферрони.">Метод Холма</span> — более мощная альтернатива, тоже контролирует FWER:</p>
      <ol>
        <li>Сортируем p-values по возрастанию: $p_{(1)} \\leq p_{(2)} \\leq \\ldots \\leq p_{(m)}$.</li>
        <li>Для $k$-го по порядку (начиная с наименьшего): порог $\\alpha_k = \\frac{\\alpha}{m - k + 1}$.</li>
        <li>Начинаем с $k=1$: если $p_{(k)} < \\alpha_k$ — отвергаем $H_{0,(k)}$ и переходим к $k+1$.</li>
        <li>Как только встречаем $p_{(k)} \\geq \\alpha_k$ — <b>останавливаемся</b>. Все оставшиеся H₀ не отвергаются.</li>
      </ol>
      <p>Холм строго <b>доминирует</b> над Бонферрони: никогда не отвергает меньше гипотез, а часто больше.</p>

      <h3>📉 <a class="glossary-link" onclick="App.selectTopic('glossary-multiple-testing')">FDR</a> — False Discovery Rate</h3>
      <p>FWER очень строгий: он требует, чтобы хотя бы одна ошибка почти никогда не случалась. В многих областях (геномика, продуктовая аналитика) мы готовы терпеть <b>некоторую долю</b> ложных открытий, лишь бы не пропустить настоящие.</p>
      <p><span class="term" data-tip="False Discovery Rate. Ожидаемая доля ложных открытий среди всех отвергнутых H₀. FDR = E[FP / max(R, 1)], где FP — false positives, R — число отвергнутых гипотез.">FDR</span> = ожидаемая доля ложных открытий среди всех объявленных «значимыми»:</p>
      <div class="math-block">$$\\text{FDR} = E\\left[\\frac{FP}{\\max(R, 1)}\\right]$$</div>
      <p>Если мы нашли 10 значимых результатов и контролировали FDR ≤ 0.1, то в среднем 1 из них ложный.</p>

      <h3>📐 <a class="glossary-link" onclick="App.selectTopic('glossary-multiple-testing')">Метод Бенджамини-Хохберга (BH)</a></h3>
      <p>Основной алгоритм контроля FDR. Прост и мощен:</p>
      <ol>
        <li>Сортируем p-values по возрастанию: $p_{(1)} \\leq \\ldots \\leq p_{(m)}$.</li>
        <li>Для каждого $k$ вычисляем порог: $p_{(k)}^{\\text{BH}} = \\frac{k}{m} \\cdot q^*$, где $q^*$ — желаемый уровень FDR.</li>
        <li>Находим наибольшее $k^*$: $p_{(k^*)} \\leq \\frac{k^*}{m} q^*$.</li>
        <li>Отвергаем все $H_{0,(1)}, \\ldots, H_{0,(k^*)}$.</li>
      </ol>
      <div class="math-block">$$\\text{Отвергаем } H_{0,(i)} \\text{ если } p_{(i)} \\leq \\frac{i}{m} \\cdot q^*$$</div>

      <div class="deep-dive">
        <summary>Подробнее: FWER vs FDR — когда что выбирать</summary>
        <div class="deep-dive-body">
          <table>
            <tr><th></th><th>FWER (Бонферрони/Холм)</th><th>FDR (Бенджамини-Хохберг)</th></tr>
            <tr><td>Контролирует</td><td>P(любая ошибка I рода)</td><td>E[доля ложных открытий]</td></tr>
            <tr><td>Строгость</td><td>Очень строгий</td><td>Менее строгий</td></tr>
            <tr><td>Мощность</td><td>Низкая при большом m</td><td>Значительно выше</td></tr>
            <tr><td>Когда использовать</td><td>Малое m, дорогая ошибка</td><td>Большое m, нужен первичный скрининг</td></tr>
            <tr><td>Примеры</td><td>Клинические испытания, финансы</td><td>Геномика, продуктовая аналитика</td></tr>
          </table>
          <p><b>Правило большого пальца:</b> m ≤ 5 → можно без поправки или Бонферрони. 5 &lt; m &lt; 30 → Холм. m ≥ 30 → BH (FDR).</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: множественные сравнения в A/B — практика</summary>
        <div class="deep-dive-body">
          <p>В продуктовых A/B тестах проблема множественных сравнений возникает в трёх контекстах:</p>
          <ul>
            <li><b>Множественные метрики</b> — тестируем одновременно CTR, конверсию, выручку, время на сайте. Каждая метрика — отдельный тест. Нужны поправки.</li>
            <li><b>Множественные варианты</b> — A/B/C/D тест с 4 вариантами: 6 пар сравнений (C(4,2)). Нужны поправки или ANOVA-аналог.</li>
            <li><b>Множественные сегменты</b> — анализ результата по устройствам, регионам, <a class="glossary-link" onclick="App.selectTopic('glossary-cohort-analysis')">когортам</a>. Каждый сегмент — отдельный тест.</li>
          </ul>
          <p>На практике многие компании (Booking.com, Netflix) явно применяют BH-коррекцию к своим A/B метрикам.</p>
        </div>
      </div>

      <h3>🔗 Связанные концепции</h3>
      <ul>
        <li><span class="term" data-tip="q-value. FDR-аналог p-value: минимальный уровень FDR, при котором тест остался бы значимым. Введён Стори (Storey, 2002).">q-value</span> — FDR-аналог p-value. Если q = 0.03, при контроле FDR ≤ 0.03 этот тест ещё значим.</li>
        <li><b>Bejamini-Yekutieli (BY)</b> — более консервативная версия BH для зависимых тестов.</li>
        <li><b>Permutation-based correction</b> — при сильных корреляциях между тестами даёт более точные границы.</li>
        <li><b>Pre-registration</b> — лучший способ избежать множественных сравнений: зафиксировать список гипотез ДО сбора данных.</li>
      </ul>

      <div class="callout warn">⚠️ <b>p-hacking</b> — это неявное множественное сравнение: перебор подгрупп, метрик, временных периодов до нахождения «значимого» результата. Поправки не спасают от p-hacking — только pre-registration.</div>
    `,

    examples: [
      {
        title: '20 метрик в A/B тесте',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Команда запустила A/B тест и одновременно проверила 20 метрик (CTR, конверсия, время на странице, bounce rate, ...). Одна оказалась «значимой» с p = 0.031. Стоит ли радоваться?</p>
          </div>

          <div class="step" data-step="1">
            <h4>Базовый расчёт: ожидаемые ложные открытия</h4>
            <div class="calc">m = 20 тестов, α = 0.05

Если ВСЕ 20 метрик на самом деле не отличаются (H₀ везде верна):
  Ожидаемое число ложных значимостей = m × α = 20 × 0.05 = <b>1.0</b>

Вероятность хотя бы одной ложной значимости:
  P(≥1 ошибка) = 1 − (1 − 0.05)^20 = 1 − 0.358 = <b>64.2%</b></div>
            <div class="why">Мы получили ровно то, что ожидалось! 1 «значимый» результат из 20 при α=0.05 — это просто случайность, не открытие.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Применяем поправку Бонферрони</h4>
            <div class="calc">α_Бонф = α / m = 0.05 / 20 = <b>0.0025</b>

Наше p = 0.031 > 0.0025 → <b>НЕ значимо</b> после Бонферрони

Вопрос: было ли это единственное «значимое» значение?
Допустим, полный список p-values:
  0.031, 0.085, 0.12, 0.18, 0.22, 0.27, 0.31, 0.38, 0.44, 0.52,
  0.55, 0.61, 0.64, 0.68, 0.71, 0.75, 0.79, 0.83, 0.90, 0.95</div>
          </div>

          <div class="step" data-step="3">
            <h4>Применяем метод Холма</h4>
            <div class="calc">Сортируем: 0.031, 0.085, 0.12, 0.18, 0.22, ...

k=1: порог = 0.05/(20−1+1) = 0.05/20 = 0.0025.  p₁=0.031 > 0.0025 → СТОП.
Ни одна гипотеза не отвергается.

Метод Холма даёт тот же вывод, что Бонферрони, когда
наименьшее p-value больше α/m.</div>
          </div>

          <div class="step" data-step="4">
            <h4>BH-коррекция (FDR = 0.05)</h4>
            <div class="calc">Сортируем p-values и считаем BH-пороги:
  k=1: порог = (1/20)×0.05 = 0.0025.  p=0.031 > 0.0025 → нет отвержения
  k=2: порог = (2/20)×0.05 = 0.005.   p=0.031 > 0.005 → нет отвержения
  ...
  k=12: порог = (12/20)×0.05 = 0.030. p=0.031 > 0.030 → нет отвержения
  k=13: порог = (13/20)×0.05 = 0.0325. p=0.031 < 0.0325 → <b>ОТВЕРГАЕМ!</b>

Нет, нет. Алгоритм BH: ищем наибольшее k*, где p_(k) ≤ (k/m)×q
  Наибольшее k* = 12 (p=0.031 ≤ 0.030? нет)
  Нет такого k* → BH тоже не отвергает ни одной.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Один «значимый» результат из 20 тестов с p = 0.031 — <b>ожидаемый шум</b>. Ни одна поправка (Бонферрони, Холм, BH) не подтверждает этот результат. Правильный вывод: <b>нет значимого эффекта</b>. Нужно либо сфокусироваться на 1–2 первичных метриках, либо собрать больше данных.</p>
          </div>

          <div class="lesson-box">Золотое правило A/B теста: определите ОДНУ первичную метрику до запуска. Остальные — вторичные, для генерации гипотез. Только первичная метрика требует строгого контроля α.</div>
        `
      },
      {
        title: 'Бонферрони vs Бенджамини-Хохберг',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Тест нового ML-алгоритма рекомендаций: проверяем 10 гипотез (сегменты пользователей). Применяем обе поправки и сравниваем, сколько гипотез каждая поправка подтверждает.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Гипотеза</th><th>Описание</th><th>p-value</th></tr>
              <tr><td>H₁</td><td>Новые пользователи</td><td>0.0012</td></tr>
              <tr><td>H₂</td><td>Мобильные устройства</td><td>0.0089</td></tr>
              <tr><td>H₃</td><td>Сегмент Premium</td><td>0.0245</td></tr>
              <tr><td>H₄</td><td>Возраст 25-34</td><td>0.0312</td></tr>
              <tr><td>H₅</td><td>Регион Москва</td><td>0.0487</td></tr>
              <tr><td>H₆</td><td>Вечернее время</td><td>0.0531</td></tr>
              <tr><td>H₇</td><td>Пользователи iOS</td><td>0.0680</td></tr>
              <tr><td>H₈</td><td>Категория «Электроника»</td><td>0.1250</td></tr>
              <tr><td>H₉</td><td>Постоянные покупатели</td><td>0.2340</td></tr>
              <tr><td>H₁₀</td><td>Выходные дни</td><td>0.4100</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Без поправки (α = 0.05)</h4>
            <div class="calc">Значимы: H₁(0.0012), H₂(0.0089), H₃(0.0245), H₄(0.0312), H₅(0.0487)
→ 5 из 10 гипотез «значимы»

Ожидаемое число ложных при m=10, α=0.05: 10×0.05 = 0.5
  (если все H₀ верны — скорее всего 0–1 ложных)
P(хотя бы 1 ложная) = 1−0.95^10 ≈ 40.1%</div>
          </div>

          <div class="step" data-step="2">
            <h4>Поправка Бонферрони (FWER ≤ 0.05)</h4>
            <div class="calc">α_Бонф = 0.05 / 10 = <b>0.005</b>

Сравниваем каждое p с 0.005:
  H₁: 0.0012 < 0.005 ✓ → значимо
  H₂: 0.0089 > 0.005 ✗ → не значимо
  H₃–H₁₀: все > 0.005 ✗

→ Значима только <b>1 гипотеза (H₁)</b></div>
          </div>

          <div class="step" data-step="3">
            <h4>Метод Холма (FWER ≤ 0.05)</h4>
            <div class="calc">Сортировка уже сделана. Пороги α/(m−k+1):
  k=1:  α/(10) = 0.0050.  p₁=0.0012 < 0.0050 ✓ → отвергаем H₁
  k=2:  α/(9)  = 0.0056.  p₂=0.0089 > 0.0056 ✗ → СТОП

→ Значима только <b>1 гипотеза (H₁)</b>
  (Холм и Бонферрони совпали, хотя Холм теоретически мощнее)</div>
          </div>

          <div class="step" data-step="4">
            <h4>Метод Бенджамини-Хохберга (FDR ≤ 0.05)</h4>
            <div class="calc">BH-пороги: (k/m)×q* = (k/10)×0.05

k   p_(k)   BH-порог  p ≤ порог?
1  0.0012   0.005      ✓
2  0.0089   0.010      ✓
3  0.0245   0.015      ✗
4  0.0312   0.020      ✗
5  0.0487   0.025      ✗

Наибольшее k* где p_(k) ≤ (k/m)×q*:
  k=2: p=0.0089 ≤ 0.010 ✓  ← наибольшее
  k=3: p=0.0245 > 0.015  ✗

→ Отвергаем H₁ и H₂.  <b>Значимы 2 гипотезы</b></div>
            <div class="why">BH нашла больше значимых результатов (2 vs 1 у Бонферрони). Плата: среди этих 2 ожидаем FDR ≤ 5%, то есть в среднем ≤ 0.1 ложного открытия. Это приемлемо для разведочного анализа.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Сравнение методов</div>
            <table>
              <tr><th>Метод</th><th>Значимых гипотез</th><th>Гарантия</th></tr>
              <tr><td>Без поправки</td><td>5 (H₁–H₅)</td><td>нет</td></tr>
              <tr><td>Бонферрони</td><td>1 (H₁)</td><td>FWER ≤ 5%</td></tr>
              <tr><td>Холм</td><td>1 (H₁)</td><td>FWER ≤ 5%</td></tr>
              <tr><td>BH (FDR)</td><td>2 (H₁, H₂)</td><td>FDR ≤ 5%</td></tr>
            </table>
            <p>BH — разумный выбор для аналитической работы. Бонферрони — для критических решений.</p>
          </div>

          <div class="lesson-box">Чем строже контроль ошибок (FWER &gt; FDR), тем меньше открытий. Это фундаментальный компромисс: строгость vs мощность. Выбирайте метод исходя из цены ошибки.</div>
        `
      },
      {
        title: 'A/B/C/D тест: попарные сравнения',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Тестируем 4 варианта дизайна (A, B, C, D). Провели попарные z-тесты для всех 6 пар. Применяем поправки на множественные сравнения.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Вариант</th><th>n</th><th>k (конверсии)</th><th>CR</th></tr>
              <tr><td><b>A</b></td><td>500</td><td>25</td><td>5.0%</td></tr>
              <tr><td><b>B</b></td><td>500</td><td>32</td><td>6.4%</td></tr>
              <tr><td><b>C</b></td><td>500</td><td>30</td><td>6.0%</td></tr>
              <tr><td><b>D</b></td><td>500</td><td>28</td><td>5.6%</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Число попарных сравнений</h4>
            <div class="calc">k вариантов → C(k,2) = k(k-1)/2 попарных сравнений
C(4,2) = 4×3/2 = <b>6 пар</b>: AB, AC, AD, BC, BD, CD

При α=0.05 без поправки:
  P(≥1 ложной значимости) = 1 − 0.95^6 ≈ 26.5%</div>
            <div class="why">При 4 вариантах FWER уже 26.5% — нельзя игнорировать множественность.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Вычисляем p-values для 6 пар</h4>
            <div class="calc">Формула z-теста для пропорций (двусторонний):
  p̂ = (k₁+k₂)/(n₁+n₂),  z = (CR₁−CR₂)/√(p̂(1−p̂)(1/n₁+1/n₂))

Пара A-B: CR_A=5.0%, CR_B=6.4%  → p̂=5.7%
  z = 0.014/√(0.057×0.943×0.004) = 0.014/0.01035 ≈ 1.353  → p = 0.176

Пара A-C: CR_A=5.0%, CR_C=6.0%  → p̂=5.5%
  z = 0.010/0.01016 ≈ 0.984  → p = 0.325

Пара A-D: CR_A=5.0%, CR_D=5.6%  → p̂=5.3%
  z = 0.006/0.01001 ≈ 0.599  → p = 0.549

Пара B-C: CR_B=6.4%, CR_C=6.0%  → p̂=6.2%
  z = 0.004/0.01079 ≈ 0.371  → p = 0.711

Пара B-D: CR_B=6.4%, CR_D=5.6%  → p̂=6.0%
  z = 0.008/0.01063 ≈ 0.753  → p = 0.451

Пара C-D: CR_C=6.0%, CR_D=5.6%  → p̂=5.8%
  z = 0.004/0.01047 ≈ 0.382  → p = 0.703</div>
          </div>

          <div class="step" data-step="3">
            <h4>Применяем поправки</h4>
            <div class="calc">Сортированные p-values: 0.176, 0.325, 0.451, 0.549, 0.703, 0.711

Бонферрони: α_adj = 0.05/6 = 0.00833
  Ни одно p < 0.00833 → ни одна пара не значима

Метод Холма:
  k=1: p=0.176 > 0.05/6=0.0083 → СТОП. Ни одна не значима.

BH (FDR=0.05):
  k=1: p=0.176 > (1/6)×0.05=0.0083 → ни одно ≤ порогу
  Ни одна не значима.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Правильная интерпретация</h4>
            <div class="calc">При n=500/группу тест слишком маломощный для обнаружения
различий между вариантами с конверсиями 5–6.4%.

Расчёт нужного n (мощность 80%, α=0.05, Бонферрони α'=0.0083):
  Минимальный детектируемый эффект при n=500: ~2.5 п.п.
  Разница A и B: 1.4 п.п. — слишком мала!

  Нужный n для детектирования 1.4 п.п. при Бонферрони:
  ≈ 2500 наблюдений/вариант (в 5× больше текущего!)

Вывод: нужно либо увеличить n, либо выбрать B как «лучший»
по точечной оценке, признав неопределённость.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Ни одна пара не значима после поправок. Вариант B имеет лучшую точечную конверсию (6.4%), но нет статистических доказательств превосходства над остальными при данном размере выборки. Рекомендация: либо собрать больше данных (n ≈ 2500/вариант), либо выбрать B по точечной оценке, явно сообщив об неопределённости.</p>
          </div>

          <div class="lesson-box">При A/B/C/D тестах поправки на множественность требуют значительно большего n. Это основная причина, почему лучше последовательно тестировать варианты (A vs B, потом лучший vs C), а не все сразу.</div>
        `
      },
    ],

    simulation: [
      {
        title: 'Инфляция FWER',
        html: `
        <h3>Инфляция ложных срабатываний</h3>
        <p>Чем больше тестов проводим — тем чаще «находим» несуществующий эффект.</p>
        <div class="sim-container">
          <div class="sim-controls" id="abmult-controls"></div>
          <div class="sim-buttons"><button class="btn" id="abmult-run">🔄 Запустить</button></div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="abmult-chart"></canvas></div>
            <div class="sim-stats" id="abmult-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#abmult-controls');
        const cM = App.makeControl('range', 'abmult-m', 'Количество тестов m', { min: 1, max: 50, step: 1, value: 20 });
        const cAlpha = App.makeControl('range', 'abmult-a', 'α', { min: 0.01, max: 0.1, step: 0.01, value: 0.05 });
        const cSim = App.makeControl('range', 'abmult-sim', 'Симуляций', { min: 100, max: 2000, step: 100, value: 500 });
        [cM, cAlpha, cSim].forEach(c => controls.appendChild(c.wrap));
        let chart = null;
        function run() {
          const m = +cM.input.value, alpha = +cAlpha.input.value, nSim = +cSim.input.value;
          // Для каждой симуляции: m тестов на null-данных, считаем сколько p < α
          const fpCounts = new Array(m + 1).fill(0);
          let anyFP = 0;
          for (let s = 0; s < nSim; s++) {
            let fp = 0;
            for (let t = 0; t < m; t++) {
              // Под H0: z ~ N(0,1)
              const z = App.Util.randn();
              const p = 2 * (1 - App.Util.normalCDF(Math.abs(z)));
              if (p < alpha) fp++;
            }
            fpCounts[fp]++;
            if (fp > 0) anyFP++;
          }
          const fwer = anyFP / nSim;
          const theoretical = 1 - Math.pow(1 - alpha, m);
          const bonf = Math.min(1, alpha / m);
          const labels = []; const data = [];
          for (let i = 0; i <= Math.min(m, 10); i++) { labels.push(i.toString()); data.push(fpCounts[i]); }
          const ctx = container.querySelector('#abmult-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar', data: { labels, datasets: [{ label: 'Частота', data, backgroundColor: data.map((_, i) => i === 0 ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)') }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Сколько ложных срабатываний за эксперимент (из ' + m + ' тестов)' } }, scales: { x: { title: { display: true, text: 'Число ложных срабатываний' } }, y: { beginAtZero: true } } },
          });
          App.registerChart(chart);
          container.querySelector('#abmult-stats').innerHTML = '<div class="stat-card"><div class="stat-label">Наблюдаемый FWER</div><div class="stat-value">' + (fwer*100).toFixed(1) + '%</div></div><div class="stat-card"><div class="stat-label">Теоретический FWER</div><div class="stat-value">' + (theoretical*100).toFixed(1) + '%</div></div><div class="stat-card"><div class="stat-label">α (без коррекции)</div><div class="stat-value">' + (alpha*100).toFixed(0) + '%</div></div><div class="stat-card"><div class="stat-label">α Бонферрони</div><div class="stat-value">' + (bonf*100).toFixed(2) + '%</div></div>';
        }
        [cM, cAlpha, cSim].forEach(c => c.input.addEventListener('input', run));
        container.querySelector('#abmult-run').onclick = run;
        run();
      },
      },
      {
        title: 'Bonferroni vs BH-FDR',
        html: `
          <h3>Строгость vs мощность: две философии</h3>
          <p>Бонферрони контролирует FWER (вероятность хоть одного ложного срабатывания). BH-FDR контролирует долю ложных среди значимых. На графике — $m$ p-значений, отсортированные. Бонферрони просто делит $\\alpha$ на $m$. BH — ступенчатая линия $\\alpha \\cdot k / m$. Двигай долю реально ненулевых эффектов и смотри, кто сколько находит.</p>
          <div class="sim-container">
            <div class="sim-controls" id="abmult2-controls"></div>
            <div class="sim-buttons"><button class="btn" id="abmult2-run">🔄 Новые p-значения</button></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="abmult2-chart"></canvas></div>
              <div class="sim-stats" id="abmult2-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#abmult2-controls');
          const cM = App.makeControl('range', 'abmult2-m', 'Тестов m', { min: 10, max: 200, step: 5, value: 50 });
          const cPi = App.makeControl('range', 'abmult2-pi', 'Доля истинно ненулевых %', { min: 0, max: 100, step: 5, value: 30 });
          const cEff = App.makeControl('range', 'abmult2-eff', 'Сила эффекта (z₁)', { min: 1, max: 5, step: 0.1, value: 3 });
          const cAlpha = App.makeControl('range', 'abmult2-alpha', 'α', { min: 0.01, max: 0.2, step: 0.01, value: 0.05 });
          [cM, cPi, cEff, cAlpha].forEach(c => controls.appendChild(c.wrap));
          let chart = null;
          function run() {
            const m = +cM.input.value;
            const pi = +cPi.input.value / 100;
            const eff = +cEff.input.value;
            const alpha = +cAlpha.input.value;
            // Generate p-values: null → Uniform(0,1); non-null → z ~ N(eff, 1), p = 2*(1-Φ(|z|))
            const pvals = [];
            const truth = [];
            for (let i = 0; i < m; i++) {
              if (Math.random() < pi) {
                const z = App.Util.randn(eff, 1);
                pvals.push(2 * (1 - App.Util.normalCDF(Math.abs(z))));
                truth.push(1);
              } else {
                pvals.push(Math.random());
                truth.push(0);
              }
            }
            // Sort ascending with truth labels
            const idx = pvals.map((_, i) => i).sort((a, b) => pvals[a] - pvals[b]);
            const sortedP = idx.map(i => pvals[i]);
            const sortedTruth = idx.map(i => truth[i]);
            const bonfThresh = alpha / m;
            // BH: find largest k such that p_(k) ≤ k/m * α
            let bhK = 0;
            for (let k = m; k >= 1; k--) {
              if (sortedP[k - 1] <= k / m * alpha) { bhK = k; break; }
            }
            const bhThresh = bhK > 0 ? bhK / m * alpha : 0;
            // Results: counts
            let bonfTP = 0, bonfFP = 0, bhTP = 0, bhFP = 0, unTP = 0, unFP = 0;
            for (let i = 0; i < m; i++) {
              const rejBonf = sortedP[i] <= bonfThresh;
              const rejBh = i < bhK;
              const rejUn = sortedP[i] <= alpha;
              if (sortedTruth[i] === 1) { if (rejBonf) bonfTP++; if (rejBh) bhTP++; if (rejUn) unTP++; }
              else { if (rejBonf) bonfFP++; if (rejBh) bhFP++; if (rejUn) unFP++; }
            }
            // Chart: p-values vs rank, with Bonferroni line (flat) and BH line
            const ranks = Array.from({ length: m }, (_, i) => i + 1);
            const bhLine = ranks.map(k => k / m * alpha);
            const bonfLine = ranks.map(() => bonfThresh);
            const alphaLine = ranks.map(() => alpha);
            // Color points: true effect = green, null = red
            const pointColors = sortedTruth.map(t => t === 1 ? '#10b981' : '#ef4444');
            const ctx = container.querySelector('#abmult2-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: ranks,
                datasets: [
                  { label: 'p-value', data: sortedP, borderColor: '#3b82f6', backgroundColor: pointColors, borderWidth: 1, pointRadius: 4, pointBackgroundColor: pointColors, showLine: true, fill: false },
                  { label: 'Bonferroni α/m', data: bonfLine, borderColor: '#ef4444', borderWidth: 2, borderDash: [4,4], pointRadius: 0, fill: false },
                  { label: 'BH-FDR k/m·α', data: bhLine, borderColor: '#f59e0b', borderWidth: 2, borderDash: [8,4], pointRadius: 0, fill: false },
                  { label: 'Uncorrected α', data: alphaLine, borderColor: '#94a3b8', borderWidth: 1, borderDash: [2,3], pointRadius: 0, fill: false },
                ],
              },
              options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Отсортированные p-значения (зелёные = истинно ненулевые)' } }, scales: { x: { title: { display: true, text: 'Ранг k' } }, y: { min: 0, max: Math.min(1, alpha * 3), title: { display: true, text: 'p-value' } } } },
            });
            App.registerChart(chart);
            const bhTotal = bhTP + bhFP;
            const bonfTotal = bonfTP + bonfFP;
            const unTotal = unTP + unFP;
            container.querySelector('#abmult2-stats').innerHTML =
              '<div class="stat-card"><div class="stat-label">Без коррекции</div><div class="stat-value">' + unTP + '/' + unTotal + ' (FP: ' + unFP + ')</div></div>' +
              '<div class="stat-card"><div class="stat-label">Bonferroni</div><div class="stat-value">' + bonfTP + '/' + bonfTotal + ' (FP: ' + bonfFP + ')</div></div>' +
              '<div class="stat-card"><div class="stat-label">BH-FDR</div><div class="stat-value">' + bhTP + '/' + bhTotal + ' (FP: ' + bhFP + ')</div></div>' +
              '<div class="stat-card"><div class="stat-label">BH FDR факт.</div><div class="stat-value">' + (bhTotal > 0 ? (bhFP / bhTotal * 100).toFixed(0) + '%' : '—') + '</div></div>';
          }
          [cM, cPi, cEff, cAlpha].forEach(c => c.input.addEventListener('input', run));
          container.querySelector('#abmult2-run').onclick = run;
          run();
        },
      },
    ],

    python: `
      <h3>📊 Коррекция множественных сравнений</h3>
      <pre><code>from statsmodels.stats.multitest import multipletests
import numpy as np

# p-значения из нескольких тестов (5 метрик одновременно)
p_values = np.array([0.03, 0.04, 0.01, 0.15, 0.08])
metric_names = ['Конверсия', 'ARPU', 'Retention D1', 'Время сессии', 'CTR']

# Бонферрони — самый строгий
reject_bonf, pvals_bonf, _, _ = multipletests(p_values, alpha=0.05, method='bonferroni')

# Холм (Holm) — ступенчатый, менее строгий
reject_holm, pvals_holm, _, _ = multipletests(p_values, alpha=0.05, method='holm')

# BH (Benjamini-Hochberg) — контроль FDR
reject_bh, pvals_bh, _, _ = multipletests(p_values, alpha=0.05, method='fdr_bh')

print(f"{'Метрика':<15} {'p':>6} {'Bonf':>8} {'Holm':>8} {'BH':>8}")
print("-" * 50)
for i, name in enumerate(metric_names):
    print(f"{name:<15} {p_values[i]:>6.3f} "
          f"{'✓' if reject_bonf[i] else '✗':>8} "
          f"{'✓' if reject_holm[i] else '✗':>8} "
          f"{'✓' if reject_bh[i] else '✗':>8}")</code></pre>

      <h3>📋 Скорректированные p-значения</h3>
      <pre><code>from statsmodels.stats.multitest import multipletests
import numpy as np

p_values = np.array([0.03, 0.04, 0.01, 0.15, 0.08])
names = ['Конверсия', 'ARPU', 'Ret D1', 'Время', 'CTR']

methods = ['bonferroni', 'holm', 'fdr_bh']
print(f"{'Метрика':<12} {'p_raw':>7}", end="")
for m in methods:
    print(f" {m:>12}", end="")
print()
print("-" * 55)

results = {}
for m in methods:
    _, pvals_adj, _, _ = multipletests(p_values, alpha=0.05, method=m)
    results[m] = pvals_adj

for i, name in enumerate(names):
    print(f"{name:<12} {p_values[i]:>7.4f}", end="")
    for m in methods:
        print(f" {results[m][i]:>12.4f}", end="")
    print()</code></pre>

      <h3>🎯 Симуляция: почему коррекция важна</h3>
      <pre><code>import numpy as np
from scipy import stats

np.random.seed(42)
n_simulations = 10_000
n_metrics = 5
alpha = 0.05

false_positive_count = 0

for _ in range(n_simulations):
    # Генерируем данные, где эффекта НЕТ (H₀ верна для всех метрик)
    p_vals = [stats.ttest_ind(
        np.random.normal(0, 1, 500),
        np.random.normal(0, 1, 500)
    ).pvalue for _ in range(n_metrics)]

    # Хотя бы одно значимое без коррекции?
    if any(p < alpha for p in p_vals):
        false_positive_count += 1

fpr = false_positive_count / n_simulations
theory = 1 - (1 - alpha) ** n_metrics

print(f"Вероятность ≥1 ложного срабатывания:")
print(f"  Эмпирическая: {fpr:.1%}")
print(f"  Теоретическая: {theory:.1%}")
print(f"  (при α={alpha} и {n_metrics} метриках)")</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>A/B тесты с десятками метрик.</b> Продуктовые эксперименты обычно измеряют 5-20 метрик сразу: конверсия, retention, ARPU, time on site, churn, NPS. Без поправки при $m=10$ и $\\alpha=0.05$ вероятность хоть одного ложного срабатывания $1 - 0.95^{10} \\approx 40\\%$ — почти гарантированное ложное «открытие».</li>
        <li><b>A/B/C/D тесты с несколькими вариантами.</b> Сравнение контроля с $k$ вариантами даёт $k$ попарных тестов; нужна поправка (Dunnett, Bonferroni или Holm), иначе FWER раздувается линейно.</li>
        <li><b>Поиск значимых фичей в ML.</b> Отбор «важных» признаков среди сотен через univariate-тесты (t, chi-square): без BH-контроля десятки фичей пройдут «случайно» и попадут в модель.</li>
        <li><b>Геномика и биоинформатика.</b> Тысячи генов / SNP / пиков экспрессии тестируются параллельно. Здесь FDR (Бенджамини-Хохберг) — стандарт индустрии: FWER-поправки обнуляют мощность при $m = 10^4$.</li>
        <li><b>Subgroup и когортный анализ.</b> Эффект A/B по сегментам: мобильные / десктоп, iOS / Android, новые / старые, страны, возрастные группы. Легко набирается $m = 20{-}50$ сравнений.</li>
        <li><b>Защита от p-hacking и HARKing.</b> Главное средство против «data dredging»: если тестировать достаточно гипотез, что-нибудь обязательно окажется «значимым». Поправки формализуют это и спасают репутацию аналитика.</li>
        <li><b>Клинические испытания с co-primary endpoints.</b> Регуляторы требуют формального контроля FWER при нескольких первичных исходах — используются Hochberg, Holm, gated procedures.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Контроль FWER (Family-Wise Error Rate).</b> Бонферрони, Holm, Hochberg гарантируют: $P(\\text{хоть одно ложное срабатывание}) \\leq \\alpha$. Это «строгий» режим: если дальше принимается дорогое решение (раскатка продукта, одобрение препарата), нужна именно эта гарантия, а не «в среднем будет немного ложных».</p>
      <p><b>FDR (Benjamini-Hochberg) как компромисс мощности и контроля.</b> BH контролирует ожидаемую долю ложных открытий среди отвергнутых: $E[V/R] \\leq q$. При $m = 10^4$ Бонферрони порезал бы все «настоящие» сигналы, а BH оставляет существенную часть — идеален в геномике, скоринге признаков, exploratory analysis.</p>
      <p><b>Holm строго доминирует Бонферрони.</b> Holm — step-down процедура с тем же контролем FWER, но всегда не менее мощная, чем Bonferroni, иногда заметно больше. Цена — ноль: тот же ввод, чуть более сложная формула. Если уж делаешь FWER-поправку, Holm лучше почти всегда.</p>
      <p><b>Воспроизводимость исследований.</b> Без поправок ~40% «значимых» результатов в эксплоративных работах — ложные. Кризис воспроизводимости в психологии и медицине во многом вызван именно игнорированием множественных сравнений.</p>
      <p><b>Формализованный ответ на вопрос «чему верить».</b> Когда в отчёте 20 p-value, глаз сам цепляется за минимальное. Поправки превращают «смотри, $p &lt; 0.05$!» в честную оценку: «с учётом того, что тестировали 20 гипотез, это значимо — или нет».</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Бонферрони сверх-консервативен при коррелированных тестах.</b> Метрики в A/B обычно сильно скоррелированы (конверсия, выручка, retention — все зависят от одного поведения). Бонферрони считает, как будто тесты независимы, и режет $\\alpha$ в $m$ раз — мощность проседает на порядок. Лучше Holm, ещё лучше permutation-based max-T (Westfall-Young), который учитывает корреляцию напрямую.</p>
      <p><b>BH-FDR теряет контроль при сильной зависимости.</b> Классическое доказательство BH требует независимости или Positive Regression Dependence (PRDS). При произвольной зависимости нужен BH-Yekutieli (BY) с добавочным множителем $\\sum 1/i$, что режет мощность в ~$\\ln(m)$ раз.</p>
      <p><b>Требуют увеличения выборки для той же мощности.</b> При $m=10$ и Bonferroni эффективный $\\alpha = 0.005$, что означает потерю мощности. Чтобы вернуть её, нужно больше наблюдений — иногда существенно.</p>
      <p><b>Не защищают от p-hacking и HARKing.</b> Если список гипотез формируется ПОСЛЕ взгляда на данные («о, давайте протестируем эту подгруппу, тут вроде что-то есть»), никакая поправка не корректна. Защита работает только при pre-registered множестве гипотез, зафиксированном до анализа.</p>
      <p><b>Бинарное решение «отвергнуть / не отвергнуть» усугубляется.</b> После поправки один и тот же p-value может быть «значим» в одном отчёте и «не значим» в другом (зависит от того, какие другие тесты включили в семью). Это не ошибка метода, но важный источник путаницы и манипуляций.</p>
      <p><b>Не решают вопрос практической значимости.</b> Поправка отвечает на «случайность ли это», но не на «велик ли эффект». При большом $n$ BH пропустит тривиально малые, но «стабильно ненулевые» эффекты — нужен отдельный анализ mere size.</p>

      <h3>🧭 Когда применять поправки — и когда не стоит</h3>
      <table>
        <tr><th>✅ Применяй поправку когда</th><th>❌ НЕ применяй когда</th></tr>
        <tr>
          <td>Тестируется заранее зафиксированный набор из $m &gt; 1$ гипотез</td>
          <td>Гипотезы выбраны post-hoc по данным — поправка не спасёт от p-hacking</td>
        </tr>
        <tr>
          <td>Решение дорогое и один ложный позитив критичен — используй FWER (Holm)</td>
          <td>Одна заранее заданная первичная метрика, остальные — exploratory для гипотез</td>
        </tr>
        <tr>
          <td>Много тестов ($m \\gg 100$) и нужна разумная мощность — используй BH-FDR</td>
          <td>Очень сильно коррелированные тесты и нужен FWER — Bonferroni излишне консервативен, бери permutation (Westfall-Young)</td>
        </tr>
        <tr>
          <td>Регуляторное требование формального FWER-контроля (клинические исследования)</td>
          <td>Байесовский подход с нормальным совместным prior — поправки не нужны, всё уже в posterior</td>
        </tr>
        <tr>
          <td>A/B/C/D с несколькими вариантами vs один контроль — Dunnett или Holm</td>
          <td>Данные exploratory и цель — генерация гипотез для следующих тестов, а не финальное решение</td>
        </tr>
        <tr>
          <td>Subgroup analysis по многим сегментам, где хочется честности</td>
          <td>Single-metric A/B с одной pre-registered гипотезой — нет множественности, нечего поправлять</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b>Holm-Bonferroni (step-down)</b> — строго доминирует классического Бонферрони по мощности, тот же контроль FWER. Почти всегда лучший выбор для «строгого» режима.</li>
        <li><b>Benjamini-Hochberg FDR</b> — когда $m$ велико и нужна разумная мощность. Контролирует ожидаемую долю ложных открытий, стандарт в геномике и скоринге фичей.</li>
        <li><b>Westfall-Young permutation max-T</b> — учитывает корреляцию между тестами через пересэмплирование. Мощнее Бонферрони при коррелированных метриках, без допущений о распределении.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('ab-bayesian')">Bayesian hierarchical model</a></b> — вместо поправок моделируем эффекты совместно с общим prior. Shrinkage автоматически гасит ложные «выбросы» без явных коррекций.</li>
        <li><b>Pre-registered primary metric + exploratory</b> — самая простая стратегия: одна заранее выбранная первичная метрика (без поправки) + все остальные только для генерации новых гипотез. Убирает саму проблему множественности.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=K8LQSvtjcEo" target="_blank">StatQuest: FDR and the Benjamini-Hochberg Method</a> — контроль доли ложных открытий (FDR) и метод Бенджамини-Хохберга</li>
        <li><a href="https://www.youtube.com/watch?v=vemZtEM63GY" target="_blank">StatQuest: p-values, clearly explained</a> — почему множественные тесты раздувают ошибку I рода</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample" target="_blank">Khan Academy: Significance tests</a> — основы статистических тестов для понимания поправок</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BC%D0%BD%D0%BE%D0%B6%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5%20%D1%81%D1%80%D0%B0%D0%B2%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BF%D0%BE%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B0%20%D0%91%D0%BE%D0%BD%D1%84%D0%B5%D1%80%D1%80%D0%BE%D0%BD%D0%B8" target="_blank">Habr: множественные сравнения</a> — проблема множественных тестов и методы коррекции</li>
        <li><a href="https://en.wikipedia.org/wiki/False_discovery_rate" target="_blank">Wikipedia: False discovery rate</a> — FDR: определение, процедура BH и применение</li>
        <li><a href="https://en.wikipedia.org/wiki/Bonferroni_correction" target="_blank">Wikipedia: Bonferroni correction</a> — поправка Бонферрони: формула и ограничения</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://www.statsmodels.org/stable/generated/statsmodels.stats.multitest.multipletests.html" target="_blank">statsmodels: multipletests</a> — Bonferroni, Holm, BH, BY и другие поправки в одной функции</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.false_discovery_control.html" target="_blank">SciPy: false_discovery_control</a> — контроль FDR по методу Бенджамини-Хохберга</li>
      </ul>
    `,
  },
});
