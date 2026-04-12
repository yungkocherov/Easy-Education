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
          l.setAttribute('y1', critY); l.setAttribute('y2', baselineY + 8);
          var r = document.getElementById('ht-line-right');
          r.setAttribute('x1', rightX); r.setAttribute('x2', rightX);
          r.setAttribute('y1', critY); r.setAttribute('y2', baselineY + 8);
          document.getElementById('ht-label-left').setAttribute('x', leftX);
          document.getElementById('ht-label-right').setAttribute('x', rightX);
        })();
        </script>
      </div>

      <h3>💡 Полная процедура теста</h3>
      <ol>
        <li><b>Формулируем $H_0$ и $H_1$.</b> Чёткое и проверяемое утверждение.</li>
        <li><b>Выбираем α</b> ДО анализа данных. Обычно 0.05.</li>
        <li><b>Выбираем тест</b> в зависимости от данных: t-test, z-test, χ², ANOVA, Манн-Уитни и т.д.</li>
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
          l.setAttribute('y1', statY); l.setAttribute('y2', baselineY + 8);
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
          var baselineY = 250, peakY = 80, halfWidth = 130;
          var cxH0 = 250, cxH1 = 510;
          U.setPath(document, 'err-h0-outline', U.normalOutlinePath(cxH0, baselineY, peakY, halfWidth));
          U.setPath(document, 'err-h0-area', U.normalSegmentPath(cxH0, baselineY, peakY, halfWidth, -3, 3));
          U.setPath(document, 'err-h1-outline', U.normalOutlinePath(cxH1, baselineY, peakY, halfWidth));
          U.setPath(document, 'err-h1-area', U.normalSegmentPath(cxH1, baselineY, peakY, halfWidth, -3, 3));
          // Critical value at +1.5σ from H0 (which is also -1.5σ from H1 because они на 3σ apart)
          var critX = cxH0 + (1.5 / 3) * halfWidth;
          U.setPath(document, 'err-alpha', U.normalSegmentPath(cxH0, baselineY, peakY, halfWidth, 1.5, 3));
          U.setPath(document, 'err-beta', U.normalSegmentPath(cxH1, baselineY, peakY, halfWidth, -3, -1.5));
          var critLine = document.getElementById('err-crit');
          critLine.setAttribute('x1', critX); critLine.setAttribute('x2', critX);
          critLine.setAttribute('y1', 60); critLine.setAttribute('y2', 258);
          document.getElementById('err-crit-label').setAttribute('x', critX);
          document.getElementById('err-h0-title').setAttribute('x', cxH0);
          document.getElementById('err-h1-title').setAttribute('x', cxH1);
          // Position alpha label inside the right tail of H0 (slightly above baseline)
          document.getElementById('err-alpha-label').setAttribute('x', critX + 30);
          document.getElementById('err-alpha-sub').setAttribute('x', critX + 30);
          // Beta label inside the left tail of H1
          document.getElementById('err-beta-label').setAttribute('x', critX - 30);
          document.getElementById('err-beta-sub').setAttribute('x', critX - 30);
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
        <li><b>Многократные сравнения</b> — если проверил 20 гипотез с α=0.05, одна ложно отвергнется просто случайно. Нужны поправки (Бонферрони, FDR).</li>
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
            <div class="why">t-статистика показывает, на сколько стандартных ошибок среднее отличается от гипотезы. |t| = 3.41 — это больше 3 стандартных ошибок.</div>
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
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <linearGradient id="tailLeft" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#ef4444" stop-opacity="0.55"/>
                  <stop offset="100%" stop-color="#ef4444" stop-opacity="0.08"/>
                </linearGradient>
              </defs>
              <text x="230" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">t-тест: H₀: μ=1000, наблюдаем x̄=994</text>
              <!-- axis -->
              <line x1="30" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- bell centered at μ=1000 → x=240, σ/√n=1.758 → 1 SE ≈ 22px at scale -->
              <!-- scale: axis covers ~990..1010 (±5SE=±8.8g), total=20g → 400px → 20px/g -->
              <!-- x = 30 + (val-990)*20 -->
              <!-- shaded left tail from x_left to x=170 (val=994 → x=30+(994-990)*20=110) -->
              <!-- actually t=-3.41 → left tail only very far. show shaded region x<994 val -->
              <!-- let's center bell at 1000 → x=30+(1000-990)*20=230 -->
              <!-- shade left tail x<994 → x<110... too far left. Use visual approach: -->
              <!-- bell at center x=270, σ=1.758 g, scale 30px/g, 994 → 270+(994-1000)*30=270-180=90 -->
              <!-- that's still too wide. Let me use scale 15px/g: bell at x=255, 994→255-90=165 -->
              <!-- shaded region: left tail below 994 -->
              <path d="M30,130 L30,129 C50,128 70,124 90,114 C100,107 110,97 120,86 C130,72 140,56 150,45 C158,36 162,31 165,29 L165,130 Z" fill="url(#tailLeft)"/>
              <!-- bell curve centered at x=255 -->
              <path d="M30,130 C50,130 70,126 90,118 C110,108 130,92 150,73 C160,62 163,55 165,49 C170,40 180,30 195,24 C210,19 225,17 240,16 C255,15 270,17 285,22 C300,28 315,37 325,48 C330,54 335,62 340,72 C355,90 375,108 395,118 C415,126 435,130 455,130" fill="none" stroke="#3b82f6" stroke-width="2.5"/>
              <!-- μ₀=1000 line at x=240 -->
              <line x1="240" y1="16" x2="240" y2="130" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
              <text x="240" y="145" text-anchor="middle" font-size="10" fill="#64748b">μ₀=1000</text>
              <!-- x̄=994 line at x=165 -->
              <line x1="165" y1="29" x2="165" y2="130" stroke="#ef4444" stroke-width="2.5"/>
              <text x="165" y="145" text-anchor="middle" font-size="10" font-weight="600" fill="#ef4444">x̄=994</text>
              <!-- t-statistic annotation -->
              <text x="100" y="110" text-anchor="middle" font-size="11" font-weight="700" fill="#ef4444">p≈0.4%</text>
              <path d="M100,95 L140,78" stroke="#ef4444" stroke-width="1" marker-end="url(#arrH)"/>
              <defs><marker id="arrH" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ef4444"/></marker></defs>
              <text x="340" y="55" font-size="10" fill="#64748b">t = −3.41</text>
              <!-- critical value annotation -->
              <line x1="192" y1="60" x2="192" y2="130" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
              <text x="192" y="55" text-anchor="middle" font-size="9" fill="#b45309">t_кр=−1.83</text>
            </svg>
            <div class="caption">Распределение t-статистики при H₀: μ=1000. Красная линия — наблюдаемое x̄=994 (t=−3.41), далеко левее критического значения −1.83 (янтарная). Красная зона — p-value ≈ 0.4%: отвергаем H₀.</div>
          </div>

          <div class="lesson-box">Одновыборочный t-тест сравнивает выборочное среднее с известным значением. Формула: t = (x̄ − μ₀)/(s/√n). Чем больше |t|, тем сильнее доказательства против H₀.</div>
        `
      },
      {
        title: 'A/B тест конверсии',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Протестировали две версии кнопки «Купить». Достаточно ли данных, чтобы сказать, что B лучше A?</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Вариант</th><th>Показов</th><th>Кликов</th><th>Конверсия (CR)</th></tr>
              <tr><td><b>A (старая)</b></td><td>2000</td><td>100</td><td>5.0%</td></tr>
              <tr><td><b>B (новая)</b></td><td>2000</td><td>130</td><td>6.5%</td></tr>
            </table>
          </div>
          <p>Разница 1.5 п.п. Но может быть случайной?</p>

          <div class="step" data-step="1">
            <h4>Формулируем гипотезы</h4>
            <div class="calc">H₀: p_A = p_B  (разницы нет, одна случайность)
H₁: p_A ≠ p_B  (есть разница)
α = 0.05</div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем объединённую долю</h4>
            <div class="calc">p̂ = (100 + 130) / (2000 + 2000) = 230 / 4000 = <b>0.0575</b></div>
            <div class="why">Под H₀ конверсия одинакова, поэтому мы объединяем данные обеих групп для более точной оценки.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем стандартную ошибку разности</h4>
            <div class="calc">SE = √( p̂(1−p̂)(1/n_A + 1/n_B) )
   = √( 0.0575 × 0.9425 × (1/2000 + 1/2000) )
   = √( 0.0542 × 0.001 )
   = √0.0000542
   = <b>0.00736</b></div>
          </div>

          <div class="step" data-step="4">
            <h4>Считаем z-статистику</h4>
            <div class="calc">z = (p_B − p_A) / SE
  = (0.065 − 0.050) / 0.00736
  = 0.015 / 0.00736
  = <b>2.04</b></div>
          </div>

          <div class="step" data-step="5">
            <h4>Находим p-value и решаем</h4>
            <div class="calc">Для двустороннего теста:
p-value = 2 × P(Z > 2.04) = 2 × 0.0207 = <b>0.041</b>

0.041 < 0.05 → <b>отвергаем H₀!</b></div>
            <p>Разница <b>статистически значима</b> на уровне 5%. Вариант B действительно лучше.</p>
            <div class="why">Обрати <a class="glossary-link" onclick="App.selectTopic('glossary-attention')">внимание</a>: при 1000 показов на группу (вместо 2000) разница не была бы значимой (z ≈ 1.44, p ≈ 0.15). Размер выборки критичен для обнаружения маленьких эффектов.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>z = <b>2.04</b>, p = <b>0.041</b> < 0.05. Разница значима. Конверсия B (6.5%) <b>достоверно выше</b> A (5.0%).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 165" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.08"/>
                </linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10b981" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#10b981" stop-opacity="0.08"/>
                </linearGradient>
              </defs>
              <text x="230" y="14" text-anchor="middle" font-size="12" font-weight="600" fill="#1e293b">A/B тест: распределения конверсий pA=5% vs pB=6.5%</text>
              <!-- axis -->
              <line x1="30" y1="130" x2="430" y2="130" stroke="#94a3b8" stroke-width="1.5"/>
              <!-- Distribution A centered at pA=0.05, SE_A=sqrt(0.05*0.95/2000)≈0.00487 -->
              <!-- Distribution B centered at pB=0.065, SE_B=sqrt(0.065*0.935/2000)≈0.00550 -->
              <!-- Map p axis: 0.02..0.10, range=0.08, scale=400/0.08=5000px per unit -->
              <!-- pA=0.05→x=30+(0.05-0.02)*5000=180, SE_A=0.00487→30px, pB=0.065→255, SE_B=0.0055→34px -->
              <!-- Curve A: bell at x=180, half-width ~3SE=90px -->
              <path d="M90,130 C110,130 130,127 145,118 C155,110 163,98 168,82 C172,70 175,58 178,49 C179,44 180,42 180,40 C180,38 181,36 182,34 C183,31 184,29 186,27 C189,24 185,28 188,32 C190,35 191,40 192,47 C194,57 196,70 198,84 C202,100 208,114 215,121 C228,128 248,130 270,130" fill="url(#gA)" stroke="#3b82f6" stroke-width="2"/>
              <!-- Curve B: bell at x=255, half-width ~3SE=100px -->
              <path d="M150,130 C170,130 190,128 205,120 C215,113 222,101 228,86 C232,73 235,62 238,52 C240,44 241,40 243,36 C245,32 247,29 249,27 C251,25 253,24 255,24 C257,24 259,25 261,27 C263,29 265,33 267,38 C270,46 272,55 275,67 C279,82 283,97 290,110 C298,120 310,127 325,130 C350,130 380,130 400,130" fill="url(#gB)" stroke="#10b981" stroke-width="2"/>
              <!-- center lines -->
              <line x1="180" y1="35" x2="180" y2="130" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,3"/>
              <line x1="255" y1="24" x2="255" y2="130" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
              <!-- labels -->
              <text x="180" y="145" text-anchor="middle" font-size="10" font-weight="600" fill="#3b82f6">pA=5%</text>
              <text x="255" y="145" text-anchor="middle" font-size="10" font-weight="600" fill="#10b981">pB=6.5%</text>
              <!-- gap annotation -->
              <line x1="180" y1="60" x2="255" y2="60" stroke="#64748b" stroke-width="1.2" marker-end="url(#arrGap)" marker-start="url(#arrGapR)"/>
              <defs>
                <marker id="arrGap"  markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#64748b"/></marker>
                <marker id="arrGapR" markerWidth="5" markerHeight="5" refX="2" refY="2.5" orient="auto"><path d="M5,0 L0,2.5 L5,5 Z" fill="#64748b"/></marker>
              </defs>
              <text x="218" y="55" text-anchor="middle" font-size="9" fill="#64748b">Δ=1.5 п.п.</text>
              <!-- z stat -->
              <text x="340" y="90" font-size="10" fill="#475569">z = 2.04</text>
              <text x="340" y="105" font-size="10" fill="#475569">p = 0.041 &lt; 0.05</text>
              <text x="340" y="120" font-size="10" font-weight="600" fill="#059669">B значимо лучше!</text>
            </svg>
            <div class="caption">Два распределения выборочных пропорций: A (синяя, 5%) и B (зелёная, 6.5%). Разница 1.5 п.п. статистически значима (z=2.04, p=0.041): кривые достаточно разделены при n=2000.</div>
          </div>

          <div class="lesson-box">A/B тест — это z-тест для пропорций. Для маленьких эффектов (1-2 п.п.) нужны тысячи наблюдений. Всегда рассчитывай необходимый размер выборки заранее (power analysis).</div>
        `
      },
      {
        title: 'χ²-тест независимости',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Опросили 200 человек: связан ли пол с предпочтением утреннего напитка (чай или кофе)?</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th></th><th>Чай</th><th>Кофе</th><th>Итого</th></tr>
              <tr><td><b>Мужчины</b></td><td>30</td><td>70</td><td>100</td></tr>
              <tr><td><b>Женщины</b></td><td>60</td><td>40</td><td>100</td></tr>
              <tr><td><b>Итого</b></td><td>90</td><td>110</td><td>200</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Формулируем гипотезы</h4>
            <div class="calc">H₀: пол и предпочтение напитка независимы
H₁: есть зависимость
α = 0.05</div>
          </div>

          <div class="step" data-step="2">
            <h4>Считаем ожидаемые частоты (при H₀)</h4>
            <p>Если H₀ верна (пол не влияет), ожидаемая частота каждой ячейки:</p>
            <div class="calc">E = (итого строки × итого столбца) / общий итого</div>
            <div class="example-data-table">
              <table>
                <tr><th></th><th>Чай (E)</th><th>Кофе (E)</th></tr>
                <tr><td><b>М</b></td><td>100×90/200 = <b>45</b></td><td>100×110/200 = <b>55</b></td></tr>
                <tr><td><b>Ж</b></td><td>100×90/200 = <b>45</b></td><td>100×110/200 = <b>55</b></td></tr>
              </table>
            </div>
            <div class="why">При независимости пола и напитка оба пола должны пить чай и кофе в одинаковых пропорциях: 90/200 = 45% чай, 110/200 = 55% кофе.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем χ²-статистику</h4>
            <div class="calc">χ² = Σ (O − E)² / E

= (30−45)²/45 + (70−55)²/55 + (60−45)²/45 + (40−55)²/55
= 225/45 + 225/55 + 225/45 + 225/55
= 5.00 + 4.09 + 5.00 + 4.09
= <b>18.18</b></div>
            <div class="why">Для каждой ячейки считаем: (наблюдённая − ожидаемая)² / ожидаемая. Чем больше разница между наблюдённым и ожидаемым — тем больше χ² и тем сильнее данные противоречат H₀.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Определяем p-value</h4>
            <div class="calc">df = (строк − 1) × (столбцов − 1) = 1 × 1 = 1
Критическое χ² при df=1, α=0.05: 3.84

Наше χ² = 18.18 >> 3.84 → <b>отвергаем H₀</b>
p-value < 0.001</div>
          </div>

          <div class="step" data-step="5">
            <h4>Интерпретация</h4>
            <p>Связь между полом и предпочтением напитка <b>высоко значима</b>. Мужчины чаще выбирают кофе (70% vs 40%), женщины — чай (60% vs 30%).</p>
            <p>Но: χ²-тест говорит <b>есть ли связь</b>, а не <b>насколько она сильная</b> и <b>какая причинно-следственная</b>.</p>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>χ² = <b>18.18</b>, df = 1, p < <b>0.001</b>. Связь между полом и предпочтением напитка статистически значима.</p>
          </div>

          <div class="lesson-box">χ²-тест проверяет независимость двух категориальных признаков. Формула: сумма (O−E)²/E по всем ячейкам. Важно: все ожидаемые частоты должны быть ≥ 5, иначе тест не работает (используй точный тест Фишера).</div>
        `
      }
    ],

    simulation: {
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
                backgroundColor: hist.centers.map((c) => c < alpha ? 'rgba(220, 38, 38, 0.7)' : 'rgba(59, 130, 246, 0.6)'),
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'Распределение p-значений (красное — отвергаем H₀)' } },
              scales: { x: { title: { display: true, text: 'p-value' } }, y: { beginAtZero: true, min: 0, max: 200 } },
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

    python: `
      <h3>📊 t-тесты в scipy.stats</h3>
      <pre><code>from scipy import stats
import numpy as np

# Одновыборочный t-тест: среднее = 500?
sample = np.array([510, 495, 520, 505, 530, 498, 515, 490, 525, 508])
stat, p = stats.ttest_1samp(sample, popmean=500)
print(f"One-sample t-test: t={stat:.3f}, p={p:.4f}")
print("Отвергаем H₀" if p < 0.05 else "Не отвергаем H₀")

# Двухвыборочный t-тест
group_a = np.array([78, 82, 85, 79, 88, 91, 76, 84])
group_b = np.array([85, 89, 92, 88, 95, 87, 90, 93])
stat, p = stats.ttest_ind(group_a, group_b, equal_var=True)
print(f"\\nTwo-sample t-test: t={stat:.3f}, p={p:.4f}")

# Парный t-тест (до/после)
before = np.array([120, 135, 128, 140, 132])
after  = np.array([115, 125, 122, 130, 128])
stat, p = stats.ttest_rel(before, after)
print(f"\\nPaired t-test: t={stat:.3f}, p={p:.4f}")</code></pre>

      <h3>📋 Хи-квадрат тест</h3>
      <pre><code>from scipy.stats import chi2_contingency
import numpy as np

# Таблица сопряжённости: пол × предпочтение
#            Чай   Кофе  Сок
observed = np.array([
    [30, 50, 20],   # Мужчины
    [45, 35, 25]    # Женщины
])

chi2, p, dof, expected = chi2_contingency(observed)
print(f"χ² = {chi2:.2f}, p = {p:.4f}, df = {dof}")
print(f"\\nОжидаемые частоты:\\n{expected.round(1)}")</code></pre>

      <h3>🔍 Выбор теста — шпаргалка</h3>
      <pre><code># Нормальность → параметрический тест
from scipy import stats

data = np.random.normal(0, 1, 100)
_, p_shapiro = stats.shapiro(data)

if p_shapiro > 0.05:
    print("Данные нормальные → t-тест / ANOVA")
    # stats.ttest_ind(a, b)
else:
    print("Данные НЕ нормальные → Манн-Уитни / Краскел-Уоллис")
    # stats.mannwhitneyu(a, b)
    # stats.kruskal(a, b, c)</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>A/B тесты в продукте</b> — сравнение вариантов сайтов, e-mail, кнопок.</li>
        <li><b>Клинические исследования</b> — эффективность лекарств и процедур.</li>
        <li><b>Контроль качества</b> — не сместился ли процесс производства.</li>
        <li><b>ML feature selection</b> — значимость признаков (χ², F-тест).</li>
        <li><b>Регрессионный анализ</b> — значимость коэффициентов.</li>
        <li><b>Научные публикации</b> — стандартный инструмент подтверждения гипотез.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Строгая количественная процедура принятия решений</li>
            <li>Контроль частоты ложных срабатываний</li>
            <li>Широко принят в науке и индустрии</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>p-value часто неправильно интерпретируют</li>
            <li>p-hacking: перебор до «значимого» результата</li>
            <li>При больших n любой эффект «значим»</li>
            <li>Не отвечает на вопрос «насколько велик эффект»</li>
          </ul>
        </div>
      </div>
      <div class="callout warn">⚠️ При многократных сравнениях нужны поправки (Бонферрони, FDR), иначе ошибки I рода накапливаются.</div>
    `,

    extra: `
      <h3>Правильная интерпретация p-value</h3>
      <p><b>p = 0.03</b> означает: «если $H_0$ верна, то вероятность увидеть такие или более экстремальные данные — 3%». Это <b>не</b> «вероятность $H_0$».</p>

      <h3>Эффект-сайз</h3>
      <p>Всегда рапортуй размер эффекта рядом с p-value: Cohen's d, разность средних с CI, отношение рисков. p говорит «значимо», эффект-сайз — «насколько».</p>

      <h3>Мощность (power analysis)</h3>
      <p>Перед экспериментом рассчитай необходимый n для детектирования минимально интересного эффекта при желаемой мощности (обычно 0.8).</p>

      <h3>Поправки на множественные сравнения</h3>
      <ul>
        <li><b>Бонферрони</b>: α' = α/m для m тестов (консервативно).</li>
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
