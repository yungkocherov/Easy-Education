/* ==========================================================================
   Проверка гипотез
   ========================================================================== */
App.registerTopic({
  id: 'hypothesis-testing',
  category: 'stats',
  title: 'Проверка гипотез',
  summary: 'p-value, α, ошибки I/II рода — как решать «значимо ли отличие».',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты в суде. Подсудимого считают невиновным, пока не <b>доказано</b> обратное. Задача прокурора — привести настолько сильные доказательства, чтобы поверить в невиновность стало нелогично. Если доказательства слабые — его оправдывают. Это не значит, что он точно невиновен, просто не хватило улик.</p>
        <p>Проверка гипотез работает так же. Мы предполагаем, что эффекта нет (как «невиновен»). Потом собираем данные и смотрим: <b>если бы эффекта действительно не было</b>, какова была бы вероятность увидеть такие данные случайно? Если очень маленькая — «отвергаем презумпцию», признаём эффект. Если нет — говорим «недостаточно доказательств».</p>
      </div>

      <h3>🎯 Зачем она нужна</h3>
      <p>В жизни мы постоянно задаём вопросы: «новый сайт лучше старого?», «лекарство работает?», «реклама увеличила продажи?». Проблема в том, что даже без всякого эффекта цифры всё равно немного меняются от случая к случаю. Как отличить <b>настоящий эффект</b> от случайных колебаний?</p>
      <p>Проверка гипотез даёт формальный ответ: «этот результат слишком необычен, чтобы быть случайностью». Это стандартный инструмент науки, медицины, маркетинга и продуктовой аналитики.</p>

      <h3>📊 Две гипотезы</h3>
      <p>Любой тест начинается с двух взаимоисключающих утверждений:</p>
      <ul>
        <li><span class="term" data-tip="Null hypothesis. Базовое предположение «эффекта нет, разницы нет, всё как обычно». Именно её мы пытаемся отвергнуть.">Нулевая гипотеза $H_0$</span> — «эффекта нет», статус-кво. Например: «новый сайт не отличается от старого», «средние в двух группах равны».</li>
        <li><span class="term" data-tip="Alternative hypothesis. То, что мы хотим доказать: есть эффект, есть разница, что-то изменилось.">Альтернативная гипотеза $H_1$</span> — то, что мы хотим показать. «Новый сайт лучше», «группы отличаются».</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Важная асимметрия</div>
        <p>Мы <b>никогда не доказываем $H_0$</b>. Мы либо её отвергаем (если данные против неё), либо говорим «недостаточно данных для отвержения». Это как в суде: «не доказано» ≠ «доказана невиновность».</p>
      </div>

      <h3>🔬 p-value — главный герой</h3>
      <p><span class="term" data-tip="Probability value. Вероятность увидеть такой же или более экстремальный результат при условии, что нулевая гипотеза верна. Чем меньше p-value, тем сильнее свидетельство против H0.">p-value</span> — это ответ на вопрос: «если $H_0$ верна, насколько вероятно увидеть такие (или ещё более экстремальные) данные случайно?»</p>
      <p>Например, p = 0.03 значит: если эффекта нет, то такой результат мы бы увидели только в 3% случаев. Это редко, значит, скорее всего эффект есть.</p>
      <p><b>Правильное чтение:</b> p-value — это не «вероятность того, что $H_0$ верна». Это вероятность <b>данных</b> при условии $H_0$. Разница огромная.</p>

      <h3>📐 Уровень значимости α</h3>
      <p>Заранее выбираем порог, ниже которого p-value считается «достаточно малым». Обычные значения:</p>
      <ul>
        <li>α = 0.05 — стандарт в социальных науках и бизнесе.</li>
        <li>α = 0.01 — более строгий, для важных решений.</li>
        <li>α = 5·10⁻⁸ — в физике элементарных частиц (5 сигма).</li>
      </ul>
      <p>Правило: если <b>p < α</b>, отвергаем $H_0$ и говорим «результат статистически значим».</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="htBellGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.08"/>
            </linearGradient>
            <linearGradient id="htTailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0.1"/>
            </linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Двусторонний критерий: критическая область</text>
          <line x1="60" y1="220" x2="700" y2="220" stroke="#475569" stroke-width="1.5"/>
          <!-- Generated bell curve and segments -->
          <path id="ht-central-area" d="" fill="url(#htBellGrad)"/>
          <path id="ht-left-tail" d="" fill="url(#htTailGrad)" stroke="#dc2626" stroke-width="1.8"/>
          <path id="ht-right-tail" d="" fill="url(#htTailGrad)" stroke="#dc2626" stroke-width="1.8"/>
          <path id="ht-bell-outline" d="" fill="none" stroke="#4338ca" stroke-width="2.8"/>
          <!-- Critical value lines (will be set by init) -->
          <line id="ht-line-left" x1="0" y1="0" x2="0" y2="0" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
          <line id="ht-line-right" x1="0" y1="0" x2="0" y2="0" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
          <!-- Tail labels -->
          <text x="130" y="170" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">Отвергаем H₀</text>
          <text x="130" y="188" text-anchor="middle" font-size="12" fill="#7f1d1d">α / 2</text>
          <text x="630" y="170" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">Отвергаем H₀</text>
          <text x="630" y="188" text-anchor="middle" font-size="12" fill="#7f1d1d">α / 2</text>
          <!-- Center label -->
          <text x="380" y="115" text-anchor="middle" font-size="14" font-weight="700" fill="#047857">Не отвергаем H₀</text>
          <text x="380" y="135" text-anchor="middle" font-size="12" fill="#065f46">1 − α</text>
          <!-- Axis labels -->
          <text id="ht-label-left" x="0" y="245" text-anchor="middle" font-size="12" fill="#dc2626" font-weight="700">−z₍α/2₎</text>
          <text x="380" y="245" text-anchor="middle" font-size="12" fill="#64748b" font-weight="700">0</text>
          <text id="ht-label-right" x="0" y="245" text-anchor="middle" font-size="12" fill="#dc2626" font-weight="700">+z₍α/2₎</text>
          <line x1="380" y1="220" x2="380" y2="228" stroke="#64748b"/>
        </svg>
        <div class="caption">Двусторонний критерий: красные хвосты — критическая область отвержения H₀ (каждая площадью α/2). Если тестовая статистика попадает в хвост — результат значим, отвергаем H₀.</div>
        <script>
        (function() {
          var U = App.Util;
          var cx = 380, baselineY = 220, peakY = 50, halfWidth = 270;
          U.setPath(document, 'ht-bell-outline', U.normalOutlinePath(cx, baselineY, peakY, halfWidth));
          U.setPath(document, 'ht-central-area', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -2, 2));
          U.setPath(document, 'ht-left-tail', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -3, -2));
          U.setPath(document, 'ht-right-tail', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, 2, 3));
          // Critical lines at ±2σ
          var leftX = cx - (2 / 3) * halfWidth;  // ≈ 200
          var rightX = cx + (2 / 3) * halfWidth;
          var critY = baselineY - Math.exp(-0.5 * 4) * (baselineY - peakY);
          var l = document.getElementById('ht-line-left');
          l.setAttribute('x1', leftX); l.setAttribute('x2', leftX);
          l.setAttribute('y1', critY); l.setAttribute('y2', baselineY);
          var r = document.getElementById('ht-line-right');
          r.setAttribute('x1', rightX); r.setAttribute('x2', rightX);
          r.setAttribute('y1', critY); r.setAttribute('y2', baselineY);
          document.getElementById('ht-label-left').setAttribute('x', leftX);
          document.getElementById('ht-label-right').setAttribute('x', rightX);
        })();
        </script>
      </div>

      <h3>💡 Полная процедура теста</h3>
      <ol>
        <li><b>Формулируем $H_0$ и $H_1$.</b> Чёткое и проверяемое утверждение.</li>
        <li><b>Выбираем α</b> ДО анализа данных. Обычно 0.05.</li>
        <li><b>Выбираем тест</b> в зависимости от данных: t-test, <a class="glossary-link" onclick="App.selectTopic('glossary-z-test')">z-test</a>, χ², <a class="glossary-link" onclick="App.selectTopic('glossary-anova')">ANOVA</a>, <a class="glossary-link" onclick="App.selectTopic('glossary-nonparametric-tests')">Манн-Уитни</a> и т.д.</li>
        <li><b>Вычисляем тестовую статистику</b> из данных — одно число, описывающее, насколько данные «необычны».</li>
        <li><b>Находим p-value</b> — вероятность такого же или более экстремального значения статистики.</li>
        <li><b>Сравниваем с α</b>: если $p < α$ → отвергаем $H_0$.</li>
        <li><b>Формулируем вывод</b> в терминах исходной задачи.</li>
      </ol>

      <h3>⚖️ Две ошибки — природа компромисса</h3>
      <p>Тест не может быть идеальным. Возможны два типа ошибок:</p>

      <table>
        <tr><th></th><th>$H_0$ верна</th><th>$H_0$ неверна</th></tr>
        <tr><th>Отвергли $H_0$</th><td>❌ <b>Ошибка I рода</b> (ложная тревога)</td><td>✓ Правильное обнаружение</td></tr>
        <tr><th>Не отвергли $H_0$</th><td>✓ Правильное не-обнаружение</td><td>❌ <b>Ошибка II рода</b> (пропуск)</td></tr>
      </table>

      <ul>
        <li><span class="term" data-tip="Type I error. Ошибка «ложная тревога» — отвергли H0, когда она на самом деле верна. Вероятность этой ошибки = α.">Ошибка I рода (α)</span> — «ложная тревога». Сказали, что эффект есть, когда его нет. Контролируется уровнем α.</li>
        <li><span class="term" data-tip="Type II error. Ошибка «пропуск» — не отвергли H0, хотя она ложна. Вероятность этой ошибки = β, зависит от размера выборки и силы эффекта.">Ошибка II рода (β)</span> — «пропуск». Эффект был, но мы его не заметили. Зависит от размера выборки.</li>
        <li><span class="term" data-tip="Power of the test. Вероятность правильно отвергнуть ложную H0. Обычно целятся в 0.8. Чем больше выборка, тем выше мощность.">Мощность теста</span> = 1 − β — вероятность правильно обнаружить реальный эффект.</li>
      </ul>

      <div class="callout warn">⚠️ Чем меньше α (строже тест), тем больше β. Эти ошибки связаны: уменьшая одну, увеличиваешь другую. Единственный способ уменьшить обе — взять больше данных.</div>

      <h3>📊 Односторонний vs двусторонний тест</h3>
      <ul>
        <li><b>Двусторонний:</b> $H_1$: «среднее отличается» (в любую сторону). p-value считается с обеих сторон распределения. Более осторожный подход.</li>
        <li><b>Односторонний:</b> $H_1$: «среднее больше» или «меньше» (в конкретную сторону). p-value только с одной стороны. Даёт более мощный тест, но только если направление известно заранее.</li>
      </ul>
      <p><b>Правило:</b> всегда предпочитать двусторонний, если нет веских причин для одностороннего, и выбор направления ДО просмотра данных.</p>

      <h3>🧮 Типы тестов для разных ситуаций</h3>
      <ul>
        <li><b>Одна выборка vs константа</b> — одновыборочный t-test (средний рост = 175?).</li>
        <li><b>Две независимые выборки</b> — двухвыборочный t-test, Welch's t-test (A/B тест).</li>
        <li><b>Связанные пары</b> — парный t-test (до/после лечения).</li>
        <li><b>Более 2 групп</b> — ANOVA (сравнение 3+ средних).</li>
        <li><b>Пропорции (доли)</b> — z-test для пропорций, $\\chi^2$-test.</li>
        <li><b>Зависимость категорий</b> — $\\chi^2$-test независимости.</li>
        <li><b>Непараметрические (без предположения о распределении)</b> — Манн-Уитни, Уилкоксон, Крускал-Уоллис.</li>
      </ul>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 280" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="pvG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6366f1" stop-opacity="0.25"/><stop offset="100%" stop-color="#6366f1" stop-opacity="0.05"/></linearGradient>
            <linearGradient id="pvTail" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dc2626" stop-opacity="0.6"/><stop offset="100%" stop-color="#dc2626" stop-opacity="0.1"/></linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Визуализация p-value</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">Распределение тестовой статистики при H₀</text>
          <line x1="60" y1="220" x2="700" y2="220" stroke="#475569" stroke-width="1.5"/>
          <path id="pv-area" d="" fill="url(#pvG)"/>
          <path id="pv-outline" d="" fill="none" stroke="#6366f1" stroke-width="2.8"/>
          <path id="pv-tail" d="" fill="url(#pvTail)" stroke="#dc2626" stroke-width="2"/>
          <line id="pv-stat-line" x1="0" y1="0" x2="0" y2="0" stroke="#dc2626" stroke-width="2.5"/>
          <text id="pv-stat-label" x="0" y="248" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">наблюдаемая t</text>
          <!-- p-value annotation -->
          <text x="610" y="120" text-anchor="middle" font-size="14" font-weight="700" fill="#dc2626">p-value</text>
          <text x="610" y="140" text-anchor="middle" font-size="11" fill="#7f1d1d">(площадь хвоста)</text>
          <line x1="610" y1="148" x2="595" y2="195" stroke="#dc2626" stroke-width="1.5"/>
          <!-- H0 label -->
          <text x="380" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#4338ca">Если H₀ верна,</text>
          <text x="380" y="118" text-anchor="middle" font-size="13" font-weight="600" fill="#4338ca">статистика распределена так</text>
        </svg>
        <div class="caption">p-value = площадь хвоста за наблюдаемой статистикой. Маленький p-value → наблюдаемый результат «экстремальный» при H₀, есть основания её отвергнуть.</div>
        <script>
        (function() {
          var U = App.Util;
          var cx = 380, baselineY = 220, peakY = 60, halfWidth = 280;
          U.setPath(document, 'pv-area', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, -3, 3));
          U.setPath(document, 'pv-outline', U.normalOutlinePath(cx, baselineY, peakY, halfWidth));
          // Right tail starting at t = +1.7
          U.setPath(document, 'pv-tail', U.normalSegmentPath(cx, baselineY, peakY, halfWidth, 1.7, 3));
          var statX = cx + (1.7 / 3) * halfWidth;
          var statY = baselineY - Math.exp(-0.5 * 1.7 * 1.7) * (baselineY - peakY);
          var l = document.getElementById('pv-stat-line');
          l.setAttribute('x1', statX); l.setAttribute('x2', statX);
          l.setAttribute('y1', statY); l.setAttribute('y2', baselineY);
          document.getElementById('pv-stat-label').setAttribute('x', statX);
        })();
        </script>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <defs>
            <linearGradient id="h0G" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/><stop offset="100%" stop-color="#6366f1" stop-opacity="0.05"/></linearGradient>
            <linearGradient id="h1G" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.05"/></linearGradient>
            <linearGradient id="alphaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dc2626" stop-opacity="0.65"/><stop offset="100%" stop-color="#dc2626" stop-opacity="0.1"/></linearGradient>
            <linearGradient id="betaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0891b2" stop-opacity="0.55"/><stop offset="100%" stop-color="#0891b2" stop-opacity="0.1"/></linearGradient>
          </defs>
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Ошибки I и II рода: α и β</text>
          <line x1="40" y1="250" x2="720" y2="250" stroke="#475569" stroke-width="1.5"/>
          <!-- H0 area + outline (centered at cx_h0) -->
          <path id="err-h0-area" d="" fill="url(#h0G)"/>
          <path id="err-h0-outline" d="" fill="none" stroke="#4338ca" stroke-width="2.5"/>
          <path id="err-h1-area" d="" fill="url(#h1G)"/>
          <path id="err-h1-outline" d="" fill="none" stroke="#b45309" stroke-width="2.5"/>
          <!-- Alpha (right tail of H0 beyond critical) -->
          <path id="err-alpha" d="" fill="url(#alphaG)" stroke="#dc2626" stroke-width="1.5"/>
          <!-- Beta (left tail of H1 below critical) -->
          <path id="err-beta" d="" fill="url(#betaG)" stroke="#0891b2" stroke-width="1.5"/>
          <!-- Critical value line -->
          <line id="err-crit" x1="0" y1="0" x2="0" y2="0" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4,3"/>
          <text id="err-crit-label" x="0" y="278" text-anchor="middle" font-size="12" font-weight="700" fill="#dc2626">критич. значение c</text>
          <!-- Alpha label -->
          <text id="err-alpha-label" x="0" y="155" text-anchor="middle" font-size="16" font-weight="800" fill="#dc2626">α</text>
          <text id="err-alpha-sub" x="0" y="172" text-anchor="middle" font-size="10" fill="#7f1d1d">(ошибка I рода)</text>
          <!-- Beta label -->
          <text id="err-beta-label" x="0" y="155" text-anchor="middle" font-size="16" font-weight="800" fill="#0891b2">β</text>
          <text id="err-beta-sub" x="0" y="172" text-anchor="middle" font-size="10" fill="#164e63">(ошибка II рода)</text>
          <!-- Distribution labels -->
          <text id="err-h0-title" x="0" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#4338ca">H₀ верна</text>
          <text id="err-h1-title" x="0" y="60" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">H₁ верна</text>
          <!-- Bottom legend -->
          <text x="380" y="305" text-anchor="middle" font-size="11" fill="#64748b">Мощность теста = 1 − β = вероятность правильно отвергнуть ложную H₀</text>
        </svg>
        <div class="caption">Два распределения: под H₀ (синее) и под H₁ (оранжевое). Граница c разделяет «отвергаем/не отвергаем». Красная площадь = α (ложная тревога). Голубая = β (пропуск эффекта).</div>
        <script>
        (function() {
          var U = App.Util;
          var baselineY = 250, peakY = 80, halfWidth = 160;
          var cxH0 = 220, cxH1 = 500;
          // sigma in pixels = halfWidth / 3 ≈ 53.3
          var sigPx = halfWidth / 3;
          // Distance between centres in sigma units
          var deltaSig = (cxH1 - cxH0) / sigPx;  // ≈ 5.25 sigma
          // Critical point at +1.65σ from H0
          var critSig = 1.65;
          var critX = cxH0 + critSig * sigPx;
          // For H1, the critical point is at (critX - cxH1) / sigPx sigma
          var critSigH1 = (critX - cxH1) / sigPx;  // negative (left tail of H1)
          U.setPath(document, 'err-h0-outline', U.normalOutlinePath(cxH0, baselineY, peakY, halfWidth));
          U.setPath(document, 'err-h0-area', U.normalSegmentPath(cxH0, baselineY, peakY, halfWidth, -3, 3));
          U.setPath(document, 'err-h1-outline', U.normalOutlinePath(cxH1, baselineY, peakY, halfWidth));
          U.setPath(document, 'err-h1-area', U.normalSegmentPath(cxH1, baselineY, peakY, halfWidth, -3, 3));
          // Alpha = right tail of H0 beyond critSig
          U.setPath(document, 'err-alpha', U.normalSegmentPath(cxH0, baselineY, peakY, halfWidth, critSig, 3));
          // Beta = left portion of H1 up to critX (i.e. from -3 to critSigH1 in H1's frame)
          U.setPath(document, 'err-beta', U.normalSegmentPath(cxH1, baselineY, peakY, halfWidth, -3, critSigH1));
          var critLine = document.getElementById('err-crit');
          critLine.setAttribute('x1', critX); critLine.setAttribute('x2', critX);
          critLine.setAttribute('y1', 60); critLine.setAttribute('y2', 258);
          // Position labels — alpha right of crit, beta left of crit, well-separated
          document.getElementById('err-alpha-label').setAttribute('x', critX + 55);
          document.getElementById('err-alpha-sub').setAttribute('x', critX + 55);
          document.getElementById('err-beta-label').setAttribute('x', critX - 55);
          document.getElementById('err-beta-sub').setAttribute('x', critX - 55);
          document.getElementById('err-crit-label').setAttribute('x', critX);
          document.getElementById('err-h0-title').setAttribute('x', cxH0);
          document.getElementById('err-h1-title').setAttribute('x', cxH1);
          // Position alpha label inside the right tail of H0 (slightly above baseline)
          document.getElementById('err-alpha-label').setAttribute('x', critX + 55);
          document.getElementById('err-alpha-sub').setAttribute('x', critX + 55);
          // Beta label inside the left tail of H1
          document.getElementById('err-beta-label').setAttribute('x', critX - 55);
          document.getElementById('err-beta-sub').setAttribute('x', critX - 55);
        })();
        </script>
      </div>

      <h3>⚠️ Что p-value НЕ означает</h3>
      <ul>
        <li>❌ «Вероятность того, что $H_0$ верна». Это вероятность данных <b>при условии</b> $H_0$.</li>
        <li>❌ «Насколько велик эффект». Маленькое p-value при больших выборках может соответствовать крошечному эффекту.</li>
        <li>❌ «Что результат важен на практике». Статистическая значимость ≠ практическая значимость.</li>
        <li>❌ «Вероятность, что результат повторится». Для этого нужны другие методы.</li>
      </ul>

      <h3>⚠️ Частые заблуждения и плохие практики</h3>
      <ul>
        <li><span class="term" data-tip="p-hacking. Множественный анализ данных до получения желаемого p < 0.05: подгонка модели, отбрасывание 'плохих' данных, переделка теста разными способами.">p-hacking</span> — мучить данные, пока не получится p < 0.05. Грубая форма научного мошенничества.</li>
        <li><a class="glossary-link" onclick="App.selectTopic('glossary-multiple-testing')"><b>Многократные сравнения</b></a> — если проверил 20 гипотез с α=0.05, одна ложно отвергнется просто случайно. Нужны поправки (Бонферрони, FDR).</li>
        <li><b>«p = 0.06 — почти значимо»</b> — нет. Либо ты придерживаешься α, либо нет. «Почти значимо» = «не значимо».</li>
        <li><b>«Не отвергли $H_0$ — значит $H_0$ верна»</b> — нет. Может, просто не хватило данных.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: проблема воспроизводимости</summary>
        <div class="deep-dive-body">
          <p>В 2010-х годах выявилась «репликационная катастрофа» — многие опубликованные результаты в психологии, медицине и других науках не воспроизводятся при повторных исследованиях. Причины:</p>
          <ul>
            <li>Публикуются только значимые результаты (publication bias).</li>
            <li>p-hacking и селективный выбор анализов.</li>
            <li>Малые выборки → случайные значимости.</li>
            <li>Неправильное понимание p-value.</li>
          </ul>
          <p>Решения: preregistration (регистрация плана анализа заранее), репортинг размеров эффектов, <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">доверительных интервалов</a>, байесовских методов.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: почему именно α = 0.05</summary>
        <div class="deep-dive-body">
          <p>Эту пороговую величину ввёл Рональд Фишер в 1925 году как «удобную» для научных работ. Он явно писал, что 0.05 — не закон природы, а просто практичный ориентир.</p>
          <p>С тех пор 0.05 стал стандартом де-факто, часто без критического осмысления. Современные рекомендации (например, от ASA):</p>
          <ul>
            <li>Не фетишизировать 0.05.</li>
            <li>Рапортовать точный p-value.</li>
            <li>Показывать размеры эффектов и доверительные интервалы.</li>
            <li>Рассматривать байесовские альтернативы.</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>ЦПТ</b> — делает возможным вычисление p-value через нормальное распределение.</li>
        <li><b>Доверительные интервалы</b> — эквивалентный подход: если 0 не в <a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">CI</a>, то эффект значим.</li>
        <li><b>A/B тесты</b> — главное применение в продукте и маркетинге.</li>
        <li><b>ROC-AUC, метрики</b> — для оценки моделей используются похожие идеи.</li>
        <li><b>Байесовский подход</b> — альтернатива, отвечающая на вопрос «вероятность гипотезы» напрямую.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Одновыборочный t-тест',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Производитель утверждает, что вес пачки муки = 1000 г. Контролёр взвесил 10 случайных пачек. Правда ли, что муки сыпят меньше?</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Пачка</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th></tr>
              <tr><td><b>Вес (г)</b></td><td>995</td><td>988</td><td>1002</td><td>991</td><td>997</td><td>985</td><td>999</td><td>993</td><td>990</td><td>1000</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Формулируем гипотезы</h4>
            <div class="calc">H₀: μ = 1000  (производитель прав, вес нормальный)
H₁: μ < 1000  (муки недосыпают)
α = 0.05 (уровень значимости)</div>
            <div class="why">Используем <b>односторонний</b> тест (μ < 1000), потому что контролёра интересует именно недовес, а не любое отклонение. H₀ — это «презумпция невиновности»: производитель прав, пока не доказано обратное.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем выборочные статистики</h4>
            <div class="calc">x̄ = (995+988+1002+991+997+985+999+993+990+1000) / 10
  = 9940 / 10 = <b>994.0 г</b>

Отклонения от x̄: 1, −6, 8, −3, 3, −9, 5, −1, −4, 6
Квадраты: 1, 36, 64, 9, 9, 81, 25, 1, 16, 36 → сумма = 278

s² = 278 / (10−1) = 30.89
s = √30.89 ≈ <b>5.56 г</b></div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем t-статистику</h4>
            <div class="calc">t = (x̄ − μ₀) / (s / √n)
  = (994.0 − 1000) / (5.56 / √10)
  = −6.0 / 1.758
  = <b>−3.41</b></div>
            <div class="why">t-статистика показывает, на сколько <a class="glossary-link" onclick="App.selectTopic('glossary-standard-error')">стандартных ошибок</a> среднее отличается от гипотезы. |t| = 3.41 — это больше 3 стандартных ошибок.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сравниваем с критическим значением</h4>
            <div class="calc">df = n − 1 = 9
Критическое t при α=0.05, df=9, односторонний: t_крит = −1.833

Наше t = −3.41 < −1.833 → <b>отвергаем H₀</b></div>
            <p>p-value ≈ 0.004 — вероятность увидеть такое (или более) экстремальное среднее случайно, если вес действительно 1000 г, всего 0.4%.</p>
          </div>

          <div class="step" data-step="5">
            <h4>Формулируем вывод</h4>
            <p>На уровне значимости 5% есть <b>статистически значимые доказательства</b> того, что средний вес пачки ниже 1000 г. Контролёр может предъявить претензию производителю.</p>
            <p>Средний недовес: 1000 − 994 = 6 г (0.6%).</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>t = <b>−3.41</b>, p ≈ <b>0.004</b>. Отвергаем H₀: муки действительно недосыпают. Средний недовес ~6 г.</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <linearGradient id="htTailLeft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ef4444" stop-opacity="0.55"/>
                  <stop offset="100%" stop-color="#ef4444" stop-opacity="0.08"/>
                </linearGradient>
                <marker id="arrHt" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/>
                </marker>
              </defs>
              <text x="230" y="18" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">t-тест: H₀ — μ=1000, наблюдаем x̄=994</text>
              <!-- axis -->
              <line x1="30" y1="140" x2="430" y2="140" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Bell curve centered at μ₀=1000 → x=230, halfWidth=175 (±3.5 SE visible).
                   1 SE unit in σ-coords = 1 (normalOutlinePath uses σ). We mark:
                   • critical value t_cr = -1.83 (at σ units -1.83)
                   • observed t = -3.41 (at σ units -3.41)
                   Pixel mapping: x = 230 + (σ/3) * 175 → σ=1 at x=288.3, σ=-1.83 at x=123.2, σ=-3.41 at x=31.2 -->
              <path id="htTailArea" d="" fill="url(#htTailLeft)"/>
              <path id="htCurve"    d="" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
              <!-- μ₀=1000 center line -->
              <line x1="230" y1="30" x2="230" y2="140" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
              <text x="230" y="158" text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">μ₀=1000</text>
              <!-- Critical value line at σ = -1.83 → x ≈ 123 -->
              <line x1="123" y1="75" x2="123" y2="140" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,3"/>
              <text x="123" y="158" text-anchor="middle" font-size="10" fill="#b45309" font-weight="700">t_кр=−1.83</text>
              <!-- Observed x̄ line at σ = -3.41 → x ≈ 31 (at boundary, so draw at 34) -->
              <line x1="34" y1="138" x2="34" y2="140" stroke="#ef4444" stroke-width="2.5"/>
              <text x="50" y="175" text-anchor="middle" font-size="11" fill="#ef4444" font-weight="700">x̄=994</text>
              <text x="50" y="187" text-anchor="middle" font-size="10" fill="#ef4444">(t=−3.41)</text>
              <!-- p-value annotation with arrow pointing into red tail -->
              <text x="175" y="90" text-anchor="middle" font-size="13" font-weight="700" fill="#dc2626">p ≈ 0.4%</text>
              <path d="M145,95 L100,120" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arrHt)"/>
            </svg>
            <div class="caption">Распределение t-статистики при H₀: μ=1000. Красная линия на левом краю — наблюдаемое x̄=994 (t=−3.41), далеко левее критического значения −1.83 (янтарная пунктирная). Красная зона — p-value ≈ 0.4%: отвергаем H₀.</div>
            <script>
            (function() {
              var U = App.Util;
              // cx=230, baselineY=140, peakY=35, halfWidth=175 for 3σ; show out to ±3.5σ
              U.setPath(document, 'htCurve',    U.normalOutlinePath(230, 140, 35, 175, 3.5));
              // Shade the LEFT tail beyond t = -1.83 (rejection region α)
              // Observed t = -3.41 sits deep inside this region (shown as red line)
              U.setPath(document, 'htTailArea', U.normalSegmentPath(230, 140, 35, 175, -3.5, -1.83, 3.5));
            })();
            </script>
          </div>

          <div class="lesson-box">Одновыборочный t-тест сравнивает выборочное среднее с известным значением. Формула: t = (x̄ − μ₀)/(s/√n). Чем больше |t|, тем сильнее доказательства против H₀.</div>

          <div class="callout tip">💡 <b>Где смотреть конкретные тесты</b> — примеры с полным выводом для сравнения двух групп (<a onclick="App.selectTopic('ab-t-test')">t-тест для средних</a>, <a onclick="App.selectTopic('ab-z-test')">z-тест для конверсий</a>, <a onclick="App.selectTopic('ab-chi-square')">χ² для категориальных</a>, <a onclick="App.selectTopic('ab-mann-whitney')">Манн-Уитни для ненормальных</a>) вынесены в категорию <b>«Эксперименты и аналитика»</b>. Здесь остаётся только одновыборочный случай как самый компактный шаблон для понимания механики p-value и критических значений.</div>
        `
      }
    ],

    simulation: [
      {
        title: 'p-значения и мощность',
      html: `
        <h3>Симуляция: когда мы отвергаем $H_0$</h3>
        <p>Сравним две группы. Первая имеет среднее 0, вторая — μ₂. Посмотрим, как часто тест находит разницу в зависимости от размера выборки и эффекта.</p>
        <div class="sim-container">
          <div class="sim-controls" id="ht-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="ht-run">▶ Запустить 500 симуляций</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="ht-chart"></canvas></div>
            <div class="sim-stats" id="ht-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#ht-controls');
        const cN = App.makeControl('range', 'ht-n', 'Размер каждой группы', { min: 10, max: 500, step: 10, value: 50 });
        const cEffect = App.makeControl('range', 'ht-effect', 'Истинный эффект (μ₂ − μ₁)', { min: 0, max: 2, step: 0.05, value: 0.3 });
        const cSigma = App.makeControl('range', 'ht-sigma', 'Ст. отклонение σ', { min: 0.5, max: 3, step: 0.1, value: 1 });
        const cAlpha = App.makeControl('range', 'ht-alpha', 'α', { min: 0.01, max: 0.1, step: 0.01, value: 0.05 });
        [cN, cEffect, cSigma, cAlpha].forEach((c) => controls.appendChild(c.wrap));

        let chart = null;

        // Двухвыборочный t-тест (предположение равных дисперсий)
        function tTest(a, b) {
          const n1 = a.length, n2 = b.length;
          const m1 = App.Util.mean(a), m2 = App.Util.mean(b);
          const v1 = App.Util.variance(a), v2 = App.Util.variance(b);
          const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
          const t = (m1 - m2) / Math.sqrt(sp2 * (1 / n1 + 1 / n2));
          // Приближение p-value через нормальное (для большого df)
          const z = Math.abs(t);
          const p = 2 * (1 - App.Util.normalCDF(z));
          return { t, p };
        }

        function run() {
          const n = +cN.input.value;
          const eff = +cEffect.input.value;
          const sigma = +cSigma.input.value;
          const alpha = +cAlpha.input.value;
          const K = 500;
          const pvals = [];
          let rejected = 0;
          for (let i = 0; i < K; i++) {
            const a = App.Util.normalSample(n, 0, sigma);
            const b = App.Util.normalSample(n, eff, sigma);
            const { p } = tTest(a, b);
            pvals.push(p);
            if (p < alpha) rejected++;
          }

          // гистограмма p-значений
          const hist = App.Util.histogram(pvals, 20, [0, 1]);
          const ctx = container.querySelector('#ht-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: hist.centers.map((c) => App.Util.round(c, 2)),
              datasets: [{
                data: hist.counts,
                backgroundColor: hist.centers.map((c, i) => { const binW = 1 / 20; return (c + binW / 2) <= alpha ? 'rgba(220, 38, 38, 0.7)' : 'rgba(59, 130, 246, 0.6)'; }),
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'Распределение p-значений (красное — отвергаем H₀)' } },
              scales: { x: { title: { display: true, text: 'p-value' } }, y: { beginAtZero: true } },
            },
          });
          App.registerChart(chart);

          const power = rejected / K;
          const cardsEl = container.querySelector('#ht-stats');
          cardsEl.innerHTML = '';
          const cards = [
            ['Симуляций', K],
            ['Отвергли H₀', `${rejected} (${(power * 100).toFixed(1)}%)`],
            [eff === 0 ? 'Наблюд. ошибка I рода' : 'Наблюд. мощность (1−β)', (power * 100).toFixed(1) + '%'],
            ['Ожидаемая α', (alpha * 100).toFixed(0) + '%'],
          ];
          cards.forEach(([label, val]) => {
            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `<div class="stat-label">${label}</div><div class="stat-value">${val}</div>`;
            cardsEl.appendChild(card);
          });
        }

        [cN, cEffect, cSigma, cAlpha].forEach((c) => c.input.addEventListener('input', run));
        container.querySelector('#ht-run').onclick = run;
        run();
      },
      },
      {
        title: 'Кривая мощности',
        html: `
          <h3>Power curve: как мощность растёт с n и размером эффекта</h3>
          <p>Мощность (1 − β) — вероятность детектить реальный эффект при заданном $\\alpha$. Зависит от размера эффекта $d$, $\\sigma$, $n$ и $\\alpha$. Двигай слайдеры — смотри, при каком $n$ у тебя будет стандартная мощность 0.8.</p>
          <div class="sim-container">
            <div class="sim-controls" id="htP-controls"></div>
            <div class="sim-output">
              <div class="sim-chart-wrap"><canvas id="htP-chart"></canvas></div>
              <div class="sim-stats" id="htP-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#htP-controls');
          const cEff = App.makeControl('range', 'htP-eff', 'Размер эффекта d (Cohen)', { min: 0.05, max: 1.5, step: 0.05, value: 0.3 });
          const cAlpha = App.makeControl('range', 'htP-alpha', 'α', { min: 0.01, max: 0.1, step: 0.005, value: 0.05 });
          const cNmax = App.makeControl('range', 'htP-nmax', 'Максимум n (на группу)', { min: 50, max: 1000, step: 50, value: 500 });
          [cEff, cAlpha, cNmax].forEach(c => controls.appendChild(c.wrap));

          let chart = null;

          // z-approximation of two-sample t-test power
          // Power = P(|Z + d*sqrt(n/2)| > z_{1-alpha/2}) ≈ Φ(d*sqrt(n/2) - z_crit) + Φ(-d*sqrt(n/2) - z_crit)
          function invNorm(p) {
            // Beasley-Springer-Moro approximation for quantile of N(0,1)
            const a = [-39.696830, 220.946098, -275.928510, 138.357751, -30.664798, 2.506628];
            const b = [-54.476098, 161.585836, -155.698979, 66.801311, -13.280681];
            const c = [-0.007784894, -0.322396458, -2.400758278, -2.549732539, 4.374664141, 2.938163983];
            const d = [0.007784695, 0.322467565, 2.445134137, 3.754408661];
            const pL = 0.02425, pH = 1 - pL;
            let q, r, x;
            if (p < pL) {
              q = Math.sqrt(-2 * Math.log(p));
              x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                  ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            } else if (p <= pH) {
              q = p - 0.5; r = q * q;
              x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                  (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
            } else {
              q = Math.sqrt(-2 * Math.log(1 - p));
              x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                   ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            }
            return x;
          }

          function run() {
            const d = +cEff.input.value;
            const alpha = +cAlpha.input.value;
            const nMax = +cNmax.input.value;
            const zCrit = invNorm(1 - alpha / 2);

            const xs = [], powers = [];
            for (let n = 5; n <= nMax; n += Math.max(1, Math.floor(nMax / 60))) {
              const ncp = d * Math.sqrt(n / 2);
              const power = (1 - App.Util.normalCDF(zCrit - ncp)) + App.Util.normalCDF(-zCrit - ncp);
              xs.push(n);
              powers.push(power);
            }

            // требуемое n для power=0.8
            let nFor80 = null;
            for (let n = 3; n <= 5000; n++) {
              const ncp = d * Math.sqrt(n / 2);
              const power = (1 - App.Util.normalCDF(zCrit - ncp)) + App.Util.normalCDF(-zCrit - ncp);
              if (power >= 0.8) { nFor80 = n; break; }
            }

            const ctx = container.querySelector('#htP-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: xs,
                datasets: [
                  {
                    label: 'Мощность (1 − β)',
                    data: powers,
                    borderColor: 'rgba(59,130,246,0.9)',
                    backgroundColor: 'rgba(59,130,246,0.15)',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.2,
                  },
                  {
                    label: 'Цель 0.8',
                    data: xs.map(() => 0.8),
                    borderColor: 'rgba(239,68,68,0.8)',
                    borderWidth: 1.5,
                    borderDash: [6, 3],
                    pointRadius: 0,
                    fill: false,
                  },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { title: { display: true, text: 'Power curve: двухвыборочный t-тест (z-аппроксимация)' } },
                scales: {
                  x: { title: { display: true, text: 'n на группу' }, ticks: { maxTicksLimit: 12 } },
                  y: { min: 0, max: 1, title: { display: true, text: '1 − β' } },
                },
              },
            });
            App.registerChart(chart);

            const statsEl = container.querySelector('#htP-stats');
            statsEl.innerHTML = '';
            const cards = [
              ['Эффект d', d.toFixed(2)],
              ['α', alpha.toFixed(3)],
              ['n для мощности 0.8', nFor80 !== null ? nFor80 : '> 5000'],
              ['Мощность при n = ' + nMax, ((powers[powers.length - 1]) * 100).toFixed(1) + '%'],
            ];
            cards.forEach(([l, v]) => {
              const c = document.createElement('div');
              c.className = 'stat-card';
              c.innerHTML = `<div class="stat-label">${l}</div><div class="stat-value">${v}</div>`;
              statsEl.appendChild(c);
            });
          }

          [cEff, cAlpha, cNmax].forEach(c => c.input.addEventListener('input', run));
          run();
        },
      },
    ],

    python: `
      <h3>📊 Одновыборочный t-тест</h3>
      <pre><code>from scipy import stats
import numpy as np

# Проверяем: среднее отличается от 500?
sample = np.array([510, 495, 520, 505, 530, 498, 515, 490, 525, 508])
stat, p = stats.ttest_1samp(sample, popmean=500)
print(f"One-sample t-test: t={stat:.3f}, p={p:.4f}")
print("Отвергаем H₀" if p < 0.05 else "Не отвергаем H₀")</code></pre>
      <p>Двухвыборочный t-тест, χ² и Манн-Уитни с полным Python-выводом находятся в специализированных темах категории «Эксперименты и аналитика».</p>

      <h3>🔍 Выбор теста — шпаргалка</h3>
      <pre><code># Сначала — проверка нормальности
from scipy import stats

data = np.random.normal(0, 1, 100)
_, p_shapiro = stats.shapiro(data)

if p_shapiro > 0.05:
    print("Данные нормальные → t-тест / ANOVA (параметрические)")
else:
    print("НЕ нормальные → Манн-Уитни / Краскел-Уоллис (непараметрические)")

# Схема выбора:
# 2 группы, непрерывные, нормальные       → ttest_ind
# 2 группы, непрерывные, не нормальные     → mannwhitneyu
# 2+ групп, непрерывные, нормальные        → f_oneway (ANOVA)
# 2+ групп, непрерывные, не нормальные     → kruskal
# Парные измерения (до/после)              → ttest_rel / wilcoxon
# Категориальные данные                    → chi2_contingency / fisher_exact
# Две пропорции (бинарная метрика)         → proportions_ztest</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>A/B тесты в продукте.</b> Главное применение в индустрии. Тестируешь новую кнопку «Купить», email-рассылку, layout страницы — и решаешь, катить в прод или нет. z-тест пропорций, t-тест средних, chi-square для таблиц сопряжённости — весь стандартный арсенал.</li>
        <li><b>Клинические исследования и фармакология.</b> RCT (randomized controlled trial) с проверкой гипотезы «лекарство эффективнее плацебо» — это буквально требование FDA и EMA для регистрации препарата. Без формального hypothesis testing препарат не пустят на рынок.</li>
        <li><b>Регрессионный анализ и эконометрика.</b> t-тест на значимость коэффициента ($H_0: \\beta_j = 0$), F-тест на значимость модели в целом, тесты на гетероскедастичность (Breusch-Pagan), автокорреляцию (Durbin-Watson), нормальность остатков (Jarque-Bera). Без них OLS — просто набор чисел.</li>
        <li><b>Контроль качества (SPC).</b> Тест «не сместилось ли среднее процесса» — это one-sample t-тест против исторического $\\mu_0$. Если p &lt; 0.01, станок проверяют. Основа статистического контроля качества по Demming и Shewhart.</li>
        <li><b>Feature selection в ML.</b> ANOVA F-test и chi-square применяются для отбора значимых признаков в <code>SelectKBest</code>. Не лучший способ (лучше использовать shap/permutation importance), но быстрый и работает.</li>
        <li><b>Научные публикации.</b> Стандарт де-факто в психологии, биологии, медицине, социологии: p &lt; 0.05 как билет к публикации. Хотя это и источник replication crisis, другой формальной альтернативы массово пока нет.</li>
        <li><b>Маркетинговая аналитика и медиа.</b> «Изменилась ли конверсия после редизайна», «отличается ли CTR у двух сегментов», «значим ли эффект промо-кампании» — всё это гипотезы в привычной формулировке.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Формальная процедура принятия решений.</b> Hypothesis testing — это не «на глаз», а строгий протокол: ставим $H_0$, выбираем $\\alpha$, считаем статистику, принимаем решение. Это позволяет воспроизводить и аудировать выводы — критично в медицине и регулируемых отраслях.</p>
      <p><b>Контроль частоты ошибок I рода.</b> Если все тесты выполняются при $\\alpha = 0.05$, то при верном $H_0$ ты ошибёшься не чаще 5% случаев. Это математическая гарантия, которую даёт частотный подход — и которую большинство ML-моделей в принципе не даёт.</p>
      <p><b>Отделяет «вижу эффект» от «эффект есть».</b> Любая разница между группами в конечной выборке что-то покажет — но это может быть просто шум. p-value отвечает: «насколько экстремально то, что я вижу, если эффекта на самом деле нет?». Без этого фильтра бизнес принимает решения на случайных флуктуациях.</p>
      <p><b>Широкая адоптация и инструментарий.</b> scipy.stats, statsmodels, pingouin, R-пакеты — гигантская экосистема готовых тестов под любую задачу: параметрические, непараметрические, для пропорций, для дисперсий, для распределений. Тебе не нужно ничего выводить.</p>
      <p><b>Power analysis — планирование экспериментов.</b> Через обратную задачу (какой $n$ нужен, чтобы детектить эффект размера $d$ с мощностью 0.8) — планируешь эксперимент ДО сбора данных. Это экономит месяцы и деньги: не начинаешь то, что заведомо не даст результата.</p>
      <p><b>Стандартный язык коммуникации.</b> «Эффект значим, p = 0.002, 95% CI [1.2, 3.5]» — одна фраза, и все статистики мира понимают, что ты имеешь в виду. Это общий протокол для передачи результатов.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>p-value почти всегда интерпретируют неправильно.</b> «p = 0.03 означает, что $H_0$ верна с вероятностью 3%» — неправильно. Правильно: «если $H_0$ верна, вероятность увидеть такие или более экстремальные данные — 3%». Это разные величины. Путаница порождает легион плохих выводов в научных статьях и продуктовой аналитике.</p>
      <p><b>p-hacking и garden of forking paths.</b> Если ты перебираешь сегменты, метрики, преобразования данных, останавливаешься на «значимом» — твоё честное $\\alpha = 0.05$ превращается в 0.5+. Preregistration и FDR-поправки пытаются это починить, но в индустрии почти никто их не делает.</p>
      <p><b>При больших $n$ значимо всё.</b> Увеличиваешь выборку — и любой крохотный эффект становится статистически значимым. Для Big Tech с миллионами пользователей p-value бессмысленно само по себе: там нужно смотреть на <b>размер эффекта</b> (Cohen's d, разность средних, lift) и его практическую значимость, а не на «звёздочки».</p>
      <p><b>Ничего не говорит о размере эффекта.</b> p = 0.001 не значит «эффект огромный». Он может быть 0.01% с огромной выборкой. Всегда нужно репортить effect size + confidence interval рядом с p, иначе решение принимается в слепую.</p>
      <p><b>Множественное тестирование.</b> Проверяешь 20 гипотез с $\\alpha = 0.05$ — в среднем одна даст ложное срабатывание. Бонферрони слишком консервативен, Benjamini-Hochberg (FDR) лучше, но большинство аналитиков про это вообще не думает. Это одна из основных причин replication crisis.</p>
      <p><b>Не отвечает на вопрос, который ты на самом деле задаёшь.</b> Ты хочешь знать $P(H_1 | \\text{данные})$ — «насколько вероятно, что B лучше A». Частотный p-value отвечает на $P(\\text{данные} | H_0)$ — «насколько неожиданны данные, если B = A». Это разные вопросы. Байесовский подход прямо отвечает на первый.</p>

      <h3>🧭 Когда применять — и когда не стоит</h3>
      <table>
        <tr><th>✅ Применяй когда</th><th>❌ НЕ применяй когда</th></tr>
        <tr>
          <td>Нужна формальная процедура с контролем ошибки I рода (медицина, регулятор, аудит)</td>
          <td>Ты будешь «перебирать до значимого» — это p-hacking, и $\\alpha$ перестанет иметь смысл</td>
        </tr>
        <tr>
          <td>A/B тест с заранее зафиксированным $n$, метрикой и гипотезой</td>
          <td>Выборка огромная — любой шум будет «значимым», смотри размер эффекта</td>
        </tr>
        <tr>
          <td>Классификация «значимо / нет» нужна для публикации или compliance</td>
          <td>Есть полезный приор (эксперт, история, физика) — байесовский подход использует его явно</td>
        </tr>
        <tr>
          <td>Эффект ожидается небольшим, но важным — power analysis даёт нужный $n$</td>
          <td>Делаешь сотни тестов одновременно без FDR-поправок — ложные срабатывания гарантированы</td>
        </tr>
        <tr>
          <td>Есть чёткое $H_0$ из теории — «новая мера = старая» — которое надо опровергнуть</td>
          <td>Важен размер эффекта и неопределённость — лучше сразу CI или posterior distribution</td>
        </tr>
        <tr>
          <td>Контроль качества: «не сдвинулся ли процесс» — t-тест, chi-square, SPC-карты</td>
          <td>Данные non-i.i.d. (временные ряды, кластеризация) — стандартные тесты дают ложную уверенность</td>
        </tr>
        <tr>
          <td>Небольшая выборка, но классические предпосылки соблюдены — t-тест ещё работает</td>
          <td>Нужно сравнить гипотезы напрямую (какая вероятнее) — это байесовский фактор, не частотный p</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">Доверительные интервалы</a></b> — вместо «значимо/нет» дают диапазон правдоподобных значений эффекта. Содержат ту же информацию, что p-value, но в более информативной форме. American Statistical Association (2016) явно рекомендует смещать акцент с p на CI.</li>
        <li><b>Байесовский подход и Bayes factors</b> — прямо считает $P(H_1 | \\text{данные})$ и отношение правдоподобий $\\frac{P(\\text{данные} | H_1)}{P(\\text{данные} | H_0)}$. Не требует $\\alpha$, не страдает от p-hacking в прежнем виде, естественно работает с приорами.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-effect-size')">Effect size + CI</a></b> — Cohen's d, Cliff's delta, разность средних с 95% ДИ. Отвечает на «насколько велик эффект», а не только «есть ли он». Для индустрии часто полезнее p-value.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-bootstrap')">Бутстрэп</a> и permutation tests</b> — непараметрические альтернативы классическим тестам. Работают при нарушенных предпосылках, легко считают ДИ для любых статистик.</li>
        <li><b>Sequential testing (Wald SPRT, mSPRT, always valid CI)</b> — когда хочется «подсматривать» в данные в процессе A/B теста без inflation of type I error. Стандарт в современных experimentation-платформах (Optimizely, VWO).</li>
      </ul>
    `,

    extra: `
      <h3>Правильная интерпретация p-value</h3>
      <p><b>p = 0.03</b> означает: «если $H_0$ верна, то вероятность увидеть такие или более экстремальные данные — 3%». Это <b>не</b> «вероятность $H_0$».</p>

      <h3>Эффект-сайз</h3>
      <p>Всегда рапортуй <a class="glossary-link" onclick="App.selectTopic('glossary-effect-size')">размер эффекта</a> рядом с p-value: Cohen's d, разность средних с CI, отношение рисков. p говорит «значимо», эффект-сайз — «насколько».</p>

      <h3>Мощность (power analysis)</h3>
      <p>Перед экспериментом рассчитай необходимый n для детектирования минимально интересного эффекта при желаемой мощности (обычно 0.8).</p>

      <h3>Поправки на множественные сравнения</h3>
      <ul>
        <li><a class="glossary-link" onclick="App.selectTopic('glossary-multiple-testing')"><b>Бонферрони</b></a>: α' = α/m для m тестов (консервативно).</li>
        <li><b>Benjamini-Hochberg (FDR)</b>: контроль доли ложных открытий (менее консервативно).</li>
      </ul>

      <h3>Байесовская альтернатива</h3>
      <p>Байесовский фактор и апостериорные вероятности — альтернатива p-value. Прямо отвечают «вероятность гипотезы при данных».</p>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=vemZtEM63GY" target="_blank">StatQuest: p-values, clearly explained</a> — что такое p-value и как его правильно интерпретировать</li>
        <li><a href="https://www.youtube.com/watch?v=0oc49DyA3hU" target="_blank">StatQuest: Hypothesis Testing and The Null Hypothesis</a> — нулевая гипотеза, альтернативная гипотеза и ошибки I и II рода</li>
        <li><a href="https://www.khanacademy.org/math/statistics-probability/significance-tests-one-sample" target="_blank">Khan Academy: Significance tests</a> — практические упражнения по проверке гипотез</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D0%B3%D0%B8%D0%BF%D0%BE%D1%82%D0%B5%D0%B7%20p-value" target="_blank">Habr: проверка гипотез</a> — статьи о статистических критериях на Хабре</li>
        <li><a href="https://en.wikipedia.org/wiki/Statistical_hypothesis_testing" target="_blank">Wikipedia: Statistical hypothesis testing</a> — полный обзор методов проверки статистических гипотез</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://www.statsmodels.org/stable/stats.html" target="_blank">statsmodels: Statistical tests</a> — широкий набор статистических тестов: t-test, z-test, chi-square и др.</li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/stats.html#statistical-tests" target="_blank">SciPy: Statistical tests</a> — ttest_1samp, ttest_ind, mannwhitneyu и другие критерии</li>
      </ul>
    `,
  },
});
