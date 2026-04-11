/* ==========================================================================
   Глоссарий: t-распределение (Student's t)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-t-distribution',
  category: 'glossary',
  title: 't-распределение',
  summary: 'Распределение Стьюдента: похоже на нормальное, но с тяжёлыми хвостами для малых выборок.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь: ты измеряешь рост 10 человек и хочешь сказать «средний рост». Если бы ты знал <b>истинное σ</b> популяции, ты бы использовал нормальное распределение. Но σ ты не знаешь — только оценку $s$ по тем же 10 измерениям. Эта оценка <b>сама по себе шумная</b>: могла получиться чуть больше или меньше истинного.</p>
        <p>t-распределение учитывает эту дополнительную неопределённость. Оно похоже на нормальное, но имеет <b>более тяжёлые хвосты</b> — признаёт, что экстремальные значения встречаются чуть чаще, чем предсказывает нормальное, из-за шума в $s$. При n → ∞ разница исчезает, и t сходится к нормальному.</p>
      </div>

      <h3>📜 История</h3>
      <p>William Sealy Gosset работал в пивоварне <b>Guinness</b> (Дублин, 1900-е) и сталкивался с задачей: сравнить сорта пива по малым выборкам ингредиентов. Нормальное распределение давало слишком оптимистичные p-value при n=5-10. В 1908 Госсет вывел t-распределение, но Guinness запретил публиковать под именем (коммерческая тайна). Он опубликовал под псевдонимом <b>«Student»</b>.</p>

      <h3>📐 Формула</h3>
      <div class="math-block">$$f(t; \\nu) = \\frac{\\Gamma\\left(\\frac{\\nu+1}{2}\\right)}{\\sqrt{\\nu\\pi}\\,\\Gamma\\left(\\frac{\\nu}{2}\\right)}\\left(1 + \\frac{t^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}$$</div>
      <p>Единственный параметр — $\\nu$ (nu) — <b>степени свободы (df)</b>. Для выборки из $n$ наблюдений: $\\nu = n - 1$.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">t-распределение при разных df</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">При df → ∞ сливается с нормальным N(0, 1)</text>
          <line x1="60" y1="260" x2="700" y2="260" stroke="#475569" stroke-width="1.5"/>
          <path id="gt-normal" d="" fill="none" stroke="#1e40af" stroke-width="3"/>
          <path id="gt-t30" d="" fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,3"/>
          <path id="gt-t5" d="" fill="none" stroke="#b45309" stroke-width="2.5"/>
          <path id="gt-t2" d="" fill="none" stroke="#dc2626" stroke-width="2.5"/>
          <path id="gt-t1" d="" fill="none" stroke="#7c2d12" stroke-width="2.5"/>
          <line x1="380" y1="65" x2="380" y2="265" stroke="#64748b" stroke-width="1" stroke-dasharray="3,3"/>
          <text x="380" y="280" text-anchor="middle" font-size="11" fill="#64748b">0</text>
          <g font-size="12" font-weight="600">
            <line x1="70" y1="75" x2="90" y2="75" stroke="#7c2d12" stroke-width="2.5"/>
            <text x="95" y="79" fill="#7c2d12">df = 1 (Cauchy — огромные хвосты)</text>
            <line x1="70" y1="98" x2="90" y2="98" stroke="#dc2626" stroke-width="2.5"/>
            <text x="95" y="102" fill="#dc2626">df = 2</text>
            <line x1="70" y1="121" x2="90" y2="121" stroke="#b45309" stroke-width="2.5"/>
            <text x="95" y="125" fill="#b45309">df = 5</text>
            <line x1="70" y1="144" x2="90" y2="144" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,3"/>
            <text x="95" y="148" fill="#059669">df = 30 (почти нормальное)</text>
            <line x1="70" y1="167" x2="90" y2="167" stroke="#1e40af" stroke-width="3"/>
            <text x="95" y="171" fill="#1e40af">N(0, 1) нормальное</text>
          </g>
        </svg>
        <div class="caption">При df = 1 (распределение Коши) у t бесконечная дисперсия. При df = 30 почти неотличимо от нормального. Именно поэтому при n &gt; 30 часто заменяют t-тест на z-тест.</div>
        <script>
        (function() {
          var U = App.Util;
          var cx = 380, baselineY = 260, peakY = 80, halfWidth = 250;
          U.setPath(document, 'gt-normal', U.normalOutlinePath(cx, baselineY, peakY, halfWidth, 4));
          U.setPath(document, 'gt-t30', U.tDistOutline(cx, baselineY, peakY, halfWidth, 30, 4));
          U.setPath(document, 'gt-t5', U.tDistOutline(cx, baselineY, peakY, halfWidth, 5, 4));
          U.setPath(document, 'gt-t2', U.tDistOutline(cx, baselineY, peakY, halfWidth, 2, 4));
          U.setPath(document, 'gt-t1', U.tDistOutline(cx, baselineY, peakY, halfWidth, 1, 4));
        })();
        </script>
      </div>

      <h3>🔑 Ключевые свойства</h3>
      <ul>
        <li><b>Симметрично</b> вокруг 0.</li>
        <li><b>Среднее</b> = 0 (при df &gt; 1).</li>
        <li><b>Дисперсия</b> = $\\nu / (\\nu - 2)$ при $\\nu &gt; 2$ (больше 1, поэтому хвосты тяжелее).</li>
        <li><b>Критические значения</b> больше, чем у нормального. Например, для двустороннего 95% CI:
          <ul>
            <li>df = 5: $t_{crit} = 2.571$</li>
            <li>df = 10: $t_{crit} = 2.228$</li>
            <li>df = 30: $t_{crit} = 2.042$</li>
            <li>df = ∞: $t_{crit} = 1.960$ (нормальное)</li>
          </ul>
        </li>
      </ul>

      <h3>🎯 Где применяется</h3>
      <ul>
        <li><b>t-тест</b> для одной и двух выборок, когда $\\sigma$ неизвестно.</li>
        <li><b>Доверительные интервалы</b> для среднего при малой выборке.</li>
        <li><b>Регрессия</b>: коэффициенты регрессии оцениваются и тестируются через t-статистику.</li>
        <li><b>Робастная статистика</b>: Student-t используется как модель данных с тяжёлыми хвостами (финансовые ряды).</li>
      </ul>

      <h3>💡 Правило большого пальца</h3>
      <ul>
        <li><b>n &lt; 30</b>: обязательно используй t-распределение.</li>
        <li><b>n ≥ 30</b>: разница с нормальным ~1%, можно использовать z-тест.</li>
        <li><b>n ≥ 100</b>: t и z практически идентичны.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('ab-t-test')">T-тест для A/B</a> — главное применение.</li>
        <li><a onclick="App.selectTopic('distributions')">Распределения</a> — семья распределений.</li>
        <li><a onclick="App.selectTopic('glossary-confidence-interval')">Доверительный интервал</a> — использует t-критические значения.</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Student%27s_t-distribution" target="_blank">Wikipedia: Student's t-distribution</a></li>
        <li><a href="https://en.wikipedia.org/wiki/William_Sealy_Gosset" target="_blank">William Sealy Gosset — история</a></li>
        <li><a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.t.html" target="_blank">scipy.stats.t</a></li>
      </ul>
    `
  }
});
