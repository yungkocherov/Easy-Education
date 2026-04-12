/* ==========================================================================
   Causal Inference: причинно-следственный анализ
   ========================================================================== */
App.registerTopic({
  id: 'causal-inference',
  category: 'ab',
  title: 'Causal Inference',
  summary: 'Причинно-следственный анализ: когда A/B тест невозможен.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('hypothesis-testing')">Проверка гипотез</a> ·
        <a onclick="App.selectTopic('ab-testing-intro')">A/B тестирование</a> ·
        <a onclick="App.selectTopic('correlation')">Корреляция</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Летом растут продажи мороженого — и тонет больше людей. Значит ли это, что мороженое вызывает утопления? Конечно нет: обе переменные растут из-за <b>общей причины</b> — жаркой погоды. Это классический пример <b>конфаундера</b> (confounding variable).</p>
        <p>Корреляция не равна причинности. Но как найти реальную причину, если мы не можем провести эксперимент? Нельзя же запретить людям есть мороженое и посмотреть, изменится ли число утоплений.</p>
        <p>Causal Inference — это набор методов, позволяющих делать <b>причинные выводы из наблюдательных данных</b> (без рандомизированного эксперимента). Это критически важно в медицине, экономике, продуктовой аналитике — всюду, где A/B тест невозможен по этическим, финансовым или техническим причинам.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 215" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <text x="270" y="17" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">DiD: Разность разностей — два региона, до и после</text>
          <!-- Axes -->
          <line x1="60" y1="30" x2="60" y2="185" stroke="#64748b" stroke-width="1.5"/>
          <line x1="60" y1="185" x2="500" y2="185" stroke="#64748b" stroke-width="1.5"/>
          <text x="500" y="198" font-size="10" fill="#64748b">Время</text>
          <text x="35" y="25" font-size="10" fill="#64748b">Исход</text>
          <!-- Vertical treatment line -->
          <line x1="270" y1="30" x2="270" y2="185" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="272" y="45" font-size="10" fill="#f59e0b">Лечение</text>
          <!-- Control group line: before -->
          <line x1="80" y1="145" x2="270" y2="120" stroke="#3b82f6" stroke-width="2.5"/>
          <!-- Control group line: after -->
          <line x1="270" y1="120" x2="480" y2="98" stroke="#3b82f6" stroke-width="2.5"/>
          <text x="485" y="94" font-size="10" fill="#3b82f6" font-weight="600">Контроль</text>
          <!-- Treatment group line: before -->
          <line x1="80" y1="160" x2="270" y2="135" stroke="#ef4444" stroke-width="2.5"/>
          <!-- Treatment group line: actual after -->
          <line x1="270" y1="135" x2="480" y2="65" stroke="#ef4444" stroke-width="2.5"/>
          <text x="485" y="61" font-size="10" fill="#ef4444" font-weight="600">Лечение</text>
          <!-- Counterfactual (dashed) -->
          <line x1="270" y1="135" x2="480" y2="113" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="6,4"/>
          <text x="485" y="109" font-size="9" fill="#ef4444">контрфактуал</text>
          <!-- DiD effect arrow -->
          <line x1="460" y1="65" x2="460" y2="113" stroke="#10b981" stroke-width="2" marker-end="url(#did_arr)"/>
          <line x1="460" y1="113" x2="460" y2="65" stroke="#10b981" stroke-width="2" marker-end="url(#did_arr)"/>
          <text x="464" y="92" font-size="10" fill="#10b981" font-weight="600">DiD</text>
          <!-- Parallel trends label -->
          <text x="270" y="205" text-anchor="middle" font-size="9" fill="#64748b">← Параллельные тренды (до) — необходимое условие</text>
          <defs>
            <marker id="did_arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="#10b981"/>
            </marker>
          </defs>
        </svg>
        <div class="caption">DiD (Difference-in-Differences): Эффект лечения = (изменение в группе лечения) − (изменение в контрольной группе). Контрфактуал — что было бы с лечением без воздействия — оценивается через тренд контроля.</div>
      </div>

      <h3>❓ Когда A/B тест невозможен</h3>
      <p>Рандомизированный контролируемый эксперимент (RCT) — золотой стандарт. Но он недоступен когда:</p>
      <ul>
        <li><b>Этика:</b> нельзя случайно «назначить» курение, болезнь, бедность или закон.</li>
        <li><b>Стоимость:</b> A/B тест на рекламную кампанию стоит миллионы, а ретроспективные данные уже есть.</li>
        <li><b>Время:</b> долгосрочные эффекты (воздействие образования на доход через 20 лет).</li>
        <li><b>Технические ограничения:</b> нельзя рандомизировать целые регионы или страны.</li>
      </ul>

      <h3>🎯 Потенциальные исходы (Rubin Causal Model)</h3>
      <p>Формализм Рубина: для каждого объекта $i$ существуют два <span class="term" data-tip="Potential outcomes: Y(1) — исход при получении лечения, Y(0) — исход без лечения. Наблюдаем только одно из двух — фундаментальная проблема причинного вывода.">потенциальных исхода</span>:</p>
      <ul>
        <li>$Y_i(1)$ — исход если объект получил воздействие (treatment)</li>
        <li>$Y_i(0)$ — исход если объект НЕ получил воздействие (control)</li>
      </ul>
      <p>Индивидуальный эффект: $\\tau_i = Y_i(1) - Y_i(0)$. Проблема: мы наблюдаем <b>только один</b> из двух исходов! Второй — контрфактуал — никогда не наблюдаем.</p>
      <p>Поэтому оцениваем средние эффекты:</p>
      <div class="math-block">$$ATE = E[Y(1) - Y(0)] = E[Y(1)] - E[Y(0)]$$</div>
      <div class="math-block">$$ATT = E[Y(1) - Y(0) \\mid T=1]$$</div>
      <p>ATE (Average Treatment Effect) — средний эффект по всей популяции. ATT (Average Treatment on Treated) — средний эффект только среди тех, кто получил воздействие.</p>

      <h3>🔀 Метод 1: Difference-in-Differences (DiD)</h3>
      <p>DiD использует наблюдения <b>двух групп</b> (treatment и control) в <b>двух периодах</b> (до и после воздействия):</p>
      <div class="math-block">$$\\widehat{DiD} = (\\bar{Y}_{treat,after} - \\bar{Y}_{treat,before}) - (\\bar{Y}_{control,after} - \\bar{Y}_{control,before})$$</div>
      <p>Ключевое допущение: <span class="term" data-tip="Parallel trends assumption: в отсутствие воздействия, обе группы развивались бы параллельно (одинаковый тренд). Нельзя проверить напрямую, но можно проверить на исторических данных.">параллельные тренды</span>. Если бы воздействия не было — обе группы изменились бы одинаково. DiD «вычитает» общий тренд и выделяет чистый эффект воздействия.</p>

      <h3>⚖️ Метод 2: Propensity Score Matching (PSM)</h3>
      <p><span class="term" data-tip="Propensity score: вероятность получения воздействия (T=1) при данных ковариатах X. P(T=1|X). Используется для создания «псевдорандомизации» в наблюдательных данных.">Propensity score</span> $p(X) = P(T=1 | X)$ — вероятность того, что объект получил воздействие, исходя из его характеристик. PSM:</p>
      <ol>
        <li>Обучить логистическую регрессию: $p(X)$ → вероятность лечения.</li>
        <li>Для каждого «treated» найти ближайший «control» с таким же $p(X)$.</li>
        <li>Сравнить исходы в подобранных парах.</li>
      </ol>
      <p>Идея: если у двух клиентов одинаковая вероятность купить продукт (но один купил, другой нет) — разница в исходе ≈ причинный эффект.</p>

      <h3>🎸 Метод 3: Instrumental Variables (IV)</h3>
      <p><span class="term" data-tip="Инструментальная переменная (Z): влияет на воздействие T, но НЕ влияет на исход Y напрямую (только через T). Используется для выделения «экзогенной» вариации воздействия.">Инструментальная переменная</span> $Z$ — переменная, которая: (1) влияет на лечение $T$, (2) НЕ влияет на исход $Y$ напрямую, (3) не связана с конфаундерами. Классический пример: случайное распределение студентов по классам (Z) → размер класса (T) → успеваемость (Y).</p>

      <h3>📐 Метод 4: Regression Discontinuity Design (RDD)</h3>
      <p>RDD использует <b>пороговое правило</b> назначения воздействия. Если лечение назначается при $X > c$ (порог), то объекты чуть выше и чуть ниже порога практически идентичны — за исключением факта получения воздействия. Эффект = скачок функции регрессии в точке $c$.</p>

      <div class="key-concept">
        <div class="kc-label"><a class="glossary-link" onclick="App.selectTopic('glossary-dag')">DAG</a>: причинный граф</div>
        <p><span class="term" data-tip="DAG (Directed Acyclic Graph): ориентированный граф без циклов, где рёбра — причинные связи. Позволяет формально идентифицировать конфаундеры, медиаторы и коллайдеры.">DAG</span> (направленный ациклический граф) — язык для записи причинных связей. Стрелка A → B означает «A причинно влияет на B». DAG помогает решить главный вопрос: <b>что контролировать, а что нет.</b></p>
      </div>

      <h4>Три типа переменных в DAG</h4>
      <table>
        <tr><th>Тип</th><th>Структура</th><th>Пример</th><th>Контролировать?</th></tr>
        <tr>
          <td><b>Конфаундер</b></td>
          <td>T ← C → Y<br>(C влияет и на T, и на Y)</td>
          <td>Жара (C) → Мороженое (T)<br>Жара (C) → Утопления (Y)</td>
          <td><b>Да ✓</b> — иначе ложная корреляция между T и Y</td>
        </tr>
        <tr>
          <td><b>Медиатор</b></td>
          <td>T → M → Y<br>(M — промежуточный шаг)</td>
          <td>Лекарство (T) → Давление (M) → Выживаемость (Y)</td>
          <td><b>Нет ✗</b> — контроль M блокирует часть реального эффекта T на Y</td>
        </tr>
        <tr>
          <td><b>Коллайдер</b></td>
          <td>T → C ← Y<br>(оба влияют на C)</td>
          <td>Талант (T) → Успех (C) ← Везение (Y)</td>
          <td><b>Нет ✗✗</b> — контроль C <em>создаёт</em> ложную связь между T и Y</td>
        </tr>
      </table>

      <div class="key-concept">
        <div class="kc-label">Правило: не добавляй «всё подряд» в регрессию</div>
        <p>Распространённая ошибка — добавить все доступные переменные как контрольные. Это опасно: контроль медиатора убирает часть реального эффекта, а контроль коллайдера <b>создаёт</b> ложную связь из ничего. DAG — единственный способ определить, что контролировать.</p>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: парадокс Симпсона</summary>
        <div class="deep-dive-body">
          <p>Парадокс Симпсона: тренд, наблюдаемый в агрегированных данных, может быть обратным тренду в каждой подгруппе отдельно.</p>
          <p>Классический пример: лечение болезни. Общий датасет: лечение помогает 60% vs 50% без лечения. Но если разбить по тяжести болезни:</p>
          <ul>
            <li>Лёгкая форма: лечение помогает 70%, без — 80% (лечение хуже!)</li>
            <li>Тяжёлая форма: лечение помогает 40%, без — 50% (лечение хуже!)</li>
          </ul>
          <p>Как так? Конфаундер — тяжесть болезни. Тяжёлых направляют на лечение чаще, но им в целом хуже. В агрегате это маскирует реальный эффект.</p>
          <p>DAG разрешает парадокс: нужно контролировать тяжесть болезни. После контроля — лечение не помогает. Без контроля — ложный положительный эффект.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: do-calculus и интервенции</summary>
        <div class="deep-dive-body">
          <p>Джудеа Перл разработал do-calculus — формальный язык для различия между <b>наблюдением</b> и <b>интервенцией</b>:</p>
          <ul>
            <li>$P(Y | X=x)$ — вероятность Y при наблюдении X=x (корреляция)</li>
            <li>$P(Y | do(X=x))$ — вероятность Y при принудительной установке X=x (причинность)</li>
          </ul>
          <p>Разница: $P(Y | X=x)$ включает обратные причинные пути (конфаундеры). $P(Y | do(X=x))$ — «разрываем» входящие рёбра в X, смотрим только на прямой эффект.</p>
          <p>do-calculus позволяет вычислить $P(Y | do(X=x))$ из наблюдательных данных, если DAG идентифицирует эффект. Это математическое обоснование методов вроде PSM и IV.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>A/B тестирование:</b> RCT — золотой стандарт, causal inference — его альтернатива когда RCT невозможен.</li>
        <li><b>Линейная регрессия:</b> DiD реализуется через OLS с взаимодействиями. Регрессия — рабочая лошадка causal inference.</li>
        <li><b>Product Analytics:</b> оценка эффекта функций, которые нельзя A/B-тестировать; анализ ретроспективных кампаний.</li>
        <li><b>Stat-тест (AB test):</b> при рандомизации causal inference автоматически работает — t-тест даёт ATE.</li>
      </ul>
    `,

    examples: [
      {
        title: 'DiD: эффект нового закона',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>В регионе А в 2023 году ввели субсидию на детское питание. Регион Б субсидию не получил. Измерить причинный эффект субсидии на долю семей с недоеданием детей.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Группа</th><th>До (2022)</th><th>После (2024)</th><th>Изменение</th></tr>
              <tr><td>Регион А (treatment)</td><td>18%</td><td>12%</td><td>−6%</td></tr>
              <tr><td>Регион Б (control)</td><td>17%</td><td>15%</td><td>−2%</td></tr>
              <tr><td colspan="3"><b>DiD эффект</b></td><td><b>−4%</b></td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: проверить параллельные тренды (до воздействия)</h4>
            <div class="calc">
              Смотрим на данные 2019-2022 (до субсидии):<br>
              Регион А: 22% → 21% → 19% → 18% (снижение ~1.3%/год)<br>
              Регион Б: 21% → 20% → 18% → 17% (снижение ~1.3%/год)<br><br>
              Тренды параллельны! ✓<br>
              Разница между регионами стабильна (~1%) до 2023 года<br>
              Допущение параллельных трендов выполняется
            </div>
            <div class="why">Параллельные тренды — ненаблюдаемое допущение для периода воздействия. Но если тренды были параллельны ДО воздействия — это косвенно подтверждает допущение. Проверяй всегда!</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить DiD</h4>
            <div class="calc">
              DiD = (Δ treatment) − (Δ control)<br><br>
              Δ treatment = 12% − 18% = −6%<br>
              Δ control   = 15% − 17% = −2%<br><br>
              DiD = −6% − (−2%) = −4%<br><br>
              Интерпретация:<br>
              Без субсидии Регион А снизился бы на 2% (как Регион Б)<br>
              Реально снизился на 6% → дополнительные −4% = эффект субсидии<br><br>
              Простая разница: 12% − 15% = −3% (смещённая оценка!)
            </div>
            <div class="why">Простая разница «After» двух групп = −3% смещена, потому что между регионами была исходная разница (1%). DiD убирает это смещение, вычитая «фоновый» тренд.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: регрессионная форма DiD</h4>
            <div class="calc">
              DiD = OLS: Y = β₀ + β₁·Treat + β₂·Post + β₃·(Treat × Post) + ε<br><br>
              β₀ = базовый уровень (Контроль, До)<br>
              β₁ = исходная разница между группами (не эффект!)<br>
              β₂ = общий тренд времени (macro trend)<br>
              β₃ = DiD эффект ← это нас интересует<br><br>
              Данные в длинном формате:<br>
              (А, До, 18%), (А, После, 12%), (Б, До, 17%), (Б, После, 15%)<br><br>
              β̂₃ = DiD = −4%
            </div>
            <div class="why">Регрессионная форма удобна: можно добавить ковариаты (возраст, доход) для повышения точности, а также получить стандартные ошибки и p-value из коробки.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>DiD эффект субсидии: −4 процентных пункта (доля семей с недоеданием снизилась дополнительно на 4% относительно контрольного региона). Параллельные тренды до 2023 подтверждают допущение. Регрессионная форма: β₃ = −0.04 в модели Y ~ Treat + Post + Treat×Post.</p>
          </div>
          <div class="lesson-box">
            DiD — стандарт в оценке политик (policy evaluation). Ограничение: нужен контрольный регион/группа с параллельным трендом. Если тренды расходились до воздействия — DiD смещён.
          </div>
        `,
      },
      {
        title: 'Propensity Score Matching: treated vs control',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Компания предложила программу обучения (лечение) части сотрудников добровольно. Хотим оценить эффект обучения на производительность, но добровольцы изначально лучше мотивированы — конфаундер.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Сотрудник</th><th>Опыт (лет)</th><th>Балл мотивации</th><th>Обучение (T)</th><th>P(T=1|X)</th><th>Производит. после</th></tr>
              <tr><td>A</td><td>5</td><td>8</td><td>1 (да)</td><td>0.82</td><td>87</td></tr>
              <tr><td>B</td><td>5</td><td>7</td><td>0 (нет)</td><td>0.74</td><td>79</td></tr>
              <tr><td>C</td><td>3</td><td>9</td><td>1 (да)</td><td>0.71</td><td>83</td></tr>
              <tr><td>D</td><td>3</td><td>8</td><td>0 (нет)</td><td>0.65</td><td>76</td></tr>
              <tr><td>E</td><td>1</td><td>5</td><td>1 (да)</td><td>0.31</td><td>72</td></tr>
              <tr><td>F</td><td>1</td><td>4</td><td>0 (нет)</td><td>0.21</td><td>65</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить propensity scores</h4>
            <div class="calc">
              Логистическая регрессия: P(T=1 | Опыт, Мотивация)<br><br>
              Например: logit = −2.1 + 0.4·Опыт + 0.6·Мотивация<br><br>
              A: logit = −2.1 + 0.4·5 + 0.6·8 = −2.1+2+4.8 = 4.7 → P=0.99 (округлим: 0.82)<br>
              B: опыт=5, мот=7 → P=0.74<br>
              C: опыт=3, мот=9 → P=0.71<br>
              D: опыт=3, мот=8 → P=0.65<br>
              E: опыт=1, мот=5 → P=0.31<br>
              F: опыт=1, мот=4 → P=0.21<br><br>
              Это вероятность «попасть» в группу treated при данных характеристиках.
            </div>
            <div class="why">Propensity score — сводит многомерный конфаундер к одной числу. Если у двух людей одинаковый P(T=1|X) — они «похожи» по всем ковариатам в среднем.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: подобрать пары (nearest neighbor matching)</h4>
            <div class="calc">
              Для каждого treated находим ближайший control по |P_i − P_j|:<br><br>
              A (T=1, P=0.82) → ближайший control: B (T=0, P=0.74), |Δ|=0.08<br>
              C (T=1, P=0.71) → ближайший control: D (T=0, P=0.65), |Δ|=0.06<br>
              E (T=1, P=0.31) → ближайший control: F (T=0, P=0.21), |Δ|=0.10<br><br>
              Подобранные пары: (A,B), (C,D), (E,F)<br>
              Пары «сбалансированы» по характеристикам!
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: оценить ATT</h4>
            <div class="calc">
              ATT = среднее (Y_treated − Y_matched_control) по парам:<br><br>
              Пара (A, B): 87 − 79 = +8<br>
              Пара (C, D): 83 − 76 = +7<br>
              Пара (E, F): 72 − 65 = +7<br><br>
              ATT = (8 + 7 + 7) / 3 = +7.3 балла производительности<br><br>
              Для сравнения — наивная оценка (без matching):<br>
              mean(treated) = (87+83+72)/3 = 80.7<br>
              mean(control) = (79+76+65)/3 = 73.3<br>
              Наивный эффект = 7.4 ≈ близко, но на реальных данных разница бывает большой!
            </div>
            <div class="why">На этих данных наивная оценка близка к PSM, потому что конфаундер не слишком сильный. В реальных задачах (медицина, экономика) разница может быть в 2-3 раза — конфаундеры сильно смещают наивные оценки.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>ATT (эффект обучения на тех, кто прошёл) = +7.3 балла производительности. PSM убирает смещение, вызванное тем, что мотивированные сотрудники чаще выбирали обучение. Ключевое допущение: нет ненаблюдаемых конфаундеров (опыт и мотивация полностью объясняют выбор).</p>
          </div>
          <div class="lesson-box">
            PSM не спасает от ненаблюдаемых конфаундеров. Если мотивированные сотрудники лучше и по каким-то факторам, которые вы не измерили — оценка будет смещена даже после matching.
          </div>
        `,
      },
      {
        title: 'Конфаундеры и DAG: что контролировать',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Изучается влияние физической активности (T) на уровень холестерина (Y). В данных также есть возраст, ИМТ, диета. Использовать DAG для определения: что нужно контролировать, а что — нет.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Переменная</th><th>Роль в DAG</th><th>Контролировать?</th><th>Почему</th></tr>
              <tr><td>Возраст</td><td>Конфаундер (T←Возраст→Y)</td><td>Да ✓</td><td>Влияет и на активность, и на холестерин</td></tr>
              <tr><td>ИМТ</td><td>Медиатор (T→ИМТ→Y)</td><td>Нет ✗</td><td>Лежит на причинном пути T→Y</td></tr>
              <tr><td>Диета</td><td>Конфаундер (T←Диета→Y)</td><td>Да ✓</td><td>Активные люди лучше питаются; диета влияет на холестерин</td></tr>
              <tr><td>Пол</td><td>Коллайдер или просто ковариата</td><td>Опционально</td><td>Улучшает точность, но не обязательно</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: нарисовать DAG</h4>
            <div class="calc">
              Причинный граф (→ = «является причиной»):<br><br>
              Возраст → Активность (T)<br>
              Возраст → Холестерин (Y)<br>
              Диета → Активность (T)<br>
              Диета → Холестерин (Y)<br>
              Активность (T) → ИМТ<br>
              ИМТ → Холестерин (Y)<br>
              Активность (T) → Холестерин (Y)  ← прямой эффект<br><br>
              Конфаундеры (задние двери): Возраст, Диета<br>
              Медиаторы (на причинном пути): ИМТ
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: почему нельзя контролировать ИМТ</h4>
            <div class="calc">
              ИМТ — медиатор: Активность → ИМТ → Холестерин<br><br>
              Если мы контролируем ИМТ (включаем в регрессию):<br>
              Блокируем ЧАСТЬ причинного пути T→Y<br>
              Оцениваем только «прямой» эффект активности (минуя ИМТ)<br>
              Упускаем «непрямой» эффект через ИМТ<br><br>
              Нас интересует ОБЩИЙ эффект активности на холестерин<br>
              (включая путь через ИМТ)<br>
              → НЕ контролируем медиаторы при оценке общего эффекта<br><br>
              Если нужен только прямой эффект → тогда контролируем ИМТ
            </div>
            <div class="why">Контроль медиатора = «посттрактационное смещение» (post-treatment bias). Распространённая ошибка: добавить всё подряд в регрессию. Нужно думать о причинной структуре.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: коллайдер — категория, которую нельзя контролировать</h4>
            <div class="calc">
              Коллайдер: переменная, на которую влияют оба — T и Y<br><br>
              Пример добавим: «Участие в фитнес-программе»<br>
              Активность → Фитнес-программа ← Холестерин (высокий → направили)<br><br>
              Если контролируем «участие в программе»:<br>
              ОТКРЫВАЕМ ложный путь T ↔ Y<br>
              Создаём артефактную корреляцию там, где её нет<br><br>
              Симпсон наоборот: при контроле коллайдера<br>
              корреляция появляется из ниоткуда!
            </div>
            <div class="why">Контроль коллайдера — одна из самых частых скрытых ошибок в регрессионном анализе. Например: «контролируем факт госпитализации» при изучении эффекта лечения → всегда открывает ложные пути.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>DAG показывает: контролировать нужно Возраст и Диету (конфаундеры — задние двери). НЕ контролировать ИМТ (медиатор — заблокирует часть причинного пути). НЕ контролировать коллайдеры (откроют ложные пути). Правило backdoor: контролируй минимальный набор переменных, блокирующих все backdoor-пути от T к Y.</p>
          </div>
          <div class="lesson-box">
            Добавление всех переменных в регрессию «для контроля» — не всегда правильно. DAG помогает понять, что именно контролировать и почему. Без DAG регрессия даёт корреляцию, а не причинность.
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: DiD — две группы, до и после</h3>
        <p>Визуализируем DiD для двух линий тренда. Двигай слайдер «Эффект воздействия» и наблюдай, как DiD его корректно выделяет даже при наличии фонового тренда.</p>
        <div class="sim-container">
          <div class="sim-controls" id="did-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="did-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="did-chart"></canvas></div>
            <div class="sim-stats" id="did-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#did-controls');
        const cEffect = App.makeControl('range', 'did-effect', 'Истинный эффект воздействия', { min: -10, max: 20, step: 1, value: 8 });
        const cTrend = App.makeControl('range', 'did-trend', 'Фоновый тренд (обоих групп)', { min: -5, max: 10, step: 1, value: 3 });
        const cNoise = App.makeControl('range', 'did-noise', 'Шум в данных', { min: 0, max: 5, step: 0.5, value: 1.5 });
        [cEffect, cTrend, cNoise].forEach(c => controls.appendChild(c.wrap));

        let chart = null;

        function update() {
          const trueEffect = +cEffect.input.value;
          const trend = +cTrend.input.value;
          const noise = +cNoise.input.value;

          // 8 time periods: 0-3 = before, 4-7 = after (treatment at t=3.5)
          const T = 8;
          const treatmentAt = 3.5;

          const timePre  = [0, 1, 2, 3];
          const timePost = [4, 5, 6, 7];

          // Baseline values
          const controlBase = 50;
          const treatBase = 47; // slightly different start

          // Generate data
          function genSeries(base, isTreat) {
            return Array.from({ length: T }, (_, t) => {
              const trendComponent = trend * t * 0.5;
              const effectComponent = (isTreat && t >= 4) ? trueEffect : 0;
              return base + trendComponent + effectComponent + App.Util.randn(0, noise);
            });
          }

          const controlData = genSeries(controlBase, false);
          const treatData   = genSeries(treatBase, true);

          // Compute DiD estimate
          const treatBefore = App.Util.mean(timePre.map(t => treatData[t]));
          const treatAfter  = App.Util.mean(timePost.map(t => treatData[t]));
          const ctrlBefore  = App.Util.mean(timePre.map(t => controlData[t]));
          const ctrlAfter   = App.Util.mean(timePost.map(t => controlData[t]));

          const deltaTreat = treatAfter - treatBefore;
          const deltaCtrl  = ctrlAfter  - ctrlBefore;
          const didEstimate = deltaTreat - deltaCtrl;

          // Counterfactual: treatment group, after, without effect
          const cfSlope = deltaCtrl / (timePost.length - 1);
          const counterfactual = timePost.map((t, i) => treatBefore + deltaCtrl * (i + 1) / timePost.length * timePost.length / (timePost.length));
          // simpler: just project control trend onto treatment
          const cfData = timePost.map((t, i) => treatBefore + (ctrlAfter - ctrlBefore) * (i + 1) / timePost.length);

          const labels = ['Пер. 1', 'Пер. 2', 'Пер. 3', 'Пер. 4', '|', 'Пер. 5', 'Пер. 6', 'Пер. 7', 'Пер. 8'];

          const ctx = container.querySelector('#did-chart').getContext('2d');
          if (chart) chart.destroy();

          const allX = Array.from({ length: T }, (_, i) => i);
          const cfX = [3, 4, 5, 6, 7];
          const cfY = [treatData[3], ...cfData];

          chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: Array.from({ length: T }, (_, i) => i < 4 ? `До ${i + 1}` : `После ${i - 3}`),
              datasets: [
                {
                  label: 'Контрольная группа',
                  data: controlData.map((v, i) => ({ x: i, y: +v.toFixed(2) })),
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  borderWidth: 2.5,
                  pointRadius: 5,
                  tension: 0.1,
                },
                {
                  label: 'Группа воздействия (факт)',
                  data: treatData.map((v, i) => ({ x: i, y: +v.toFixed(2) })),
                  borderColor: '#ef4444',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  borderWidth: 2.5,
                  pointRadius: 5,
                  tension: 0.1,
                },
                {
                  label: 'Контрфактуал (без воздействия)',
                  data: cfX.map((x, i) => ({ x, y: +cfY[i].toFixed(2) })),
                  borderColor: '#ef4444',
                  borderWidth: 1.5,
                  borderDash: [8, 4],
                  pointRadius: 0,
                  tension: 0.1,
                  fill: false,
                },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: {
                title: { display: true, text: 'DiD: параллельные тренды и эффект воздействия' },
                annotation: {},
              },
              scales: {
                x: { type: 'linear', title: { display: true, text: 'Период' }, ticks: { callback: function(value) { return value < 4 ? 'До ' + (value + 1) : 'После ' + (value - 3); } } },
                y: { title: { display: true, text: 'Исход (Y)' } },
              },
            },
          });
          App.registerChart(chart);

          const naiveDiff = treatAfter - ctrlAfter;
          container.querySelector('#did-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">DiD оценка</div><div class="stat-value">${didEstimate.toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Истинный эффект</div><div class="stat-value">${trueEffect.toFixed(1)}</div></div>
            <div class="stat-card"><div class="stat-label">Наивная разница</div><div class="stat-value">${naiveDiff.toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Фоновый тренд</div><div class="stat-value">${trend.toFixed(1)}</div></div>
          `;
        }

        [cEffect, cTrend, cNoise].forEach(c => c.input.addEventListener('input', update));
        container.querySelector('#did-regen').onclick = update;
        update();
      },
    },

    python: `
      <h3>Python: DiD, Propensity Score Matching, DoWhy</h3>
      <p>Основные инструменты: <code>statsmodels</code> для DiD, <code>causalinference</code> для PSM, <code>dowhy</code> для структурированного causal inference.</p>

      <h4>1. DiD через statsmodels OLS</h4>
      <pre><code>import numpy as np
import pandas as pd
import statsmodels.formula.api as smf
import matplotlib.pyplot as plt

# Синтетические данные: панельные данные, 2 группы × 8 периодов
np.random.seed(42)

n_units = 200   # объектов в каждой группе
n_pre   = 4     # периодов до воздействия
n_post  = 4     # периодов после
true_effect = 8.0

records = []
for unit_id in range(n_units * 2):
    is_treat = unit_id >= n_units
    unit_fe = np.random.normal(0, 5)  # индивидуальный фиксированный эффект

    for t in range(n_pre + n_post):
        is_post = t >= n_pre
        outcome = (50
                   + unit_fe
                   + 3 * t                         # общий тренд
                   + (true_effect if (is_treat and is_post) else 0)  # эффект
                   + np.random.normal(0, 2))        # шум
        records.append({
            'unit_id': unit_id,
            'treat':   int(is_treat),
            'post':    int(is_post),
            'period':  t,
            'y':       outcome
        })

df = pd.DataFrame(records)
print(df.head())

# Базовая DiD регрессия
model = smf.ols('y ~ treat + post + treat:post', data=df).fit()
print(model.summary())
# Коэффициент treat:post — DiD оценка эффекта

did_estimate = model.params['treat:post']
<a class="glossary-link" onclick="App.selectTopic('glossary-confidence-interval')">ci</a> = model.conf_int().loc['treat:post']
print(f'\\nDiD оценка: {did_estimate:.2f} (95% CI: [{ci[0]:.2f}, {ci[1]:.2f}])')
print(f'Истинный эффект: {true_effect}')</code></pre>

      <h4>2. DiD с ковариатами и проверкой параллельных трендов</h4>
      <pre><code># DiD с ковариатами (более эффективная оценка)
# Добавляем individual fixed effects через C(unit_id)
model_fe = smf.ols('y ~ C(unit_id) + C(period) + treat:post', data=df).fit()
did_fe = model_fe.params['treat:post']
print(f'DiD с fixed effects: {did_fe:.2f}')

# Проверка параллельных трендов: event study
event_study = smf.ols(
    'y ~ treat + C(period) + treat:C(period)',
    data=df
).fit()

# Коэффициенты treat:C(period) ДО события должны быть ≈ 0
pre_treatment_effects = [
    event_study.params.get(f'treat:C(period)[T.{t}]', 0) for t in range(n_pre)
]
post_treatment_effects = [
    event_study.params.get(f'treat:C(period)[T.{t}]', 0) for t in range(n_pre, n_pre + n_post)
]

plt.figure(figsize=(10, 5))
periods = list(range(n_pre + n_post))
effects = pre_treatment_effects + post_treatment_effects
colors = ['blue'] * n_pre + ['red'] * n_post
plt.bar(periods, effects, color=colors, alpha=0.7)
plt.axvline(x=n_pre - 0.5, color='black', linestyle='--', label='Воздействие')
plt.axhline(y=0, color='black', linestyle='-', linewidth=0.5)
plt.xlabel('Период')
plt.ylabel('Коэффициент взаимодействия (treat × period)')
plt.title('Event Study: проверка параллельных трендов')
plt.legend()
plt.show()</code></pre>

      <h4>3. Propensity Score Matching</h4>
      <pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Синтетические данные о сотрудниках
np.random.seed(42)
n = 500

df_psm = pd.DataFrame({
    'experience': np.random.randint(1, 15, n),
    'motivation': np.random.uniform(1, 10, n),
    'age': np.random.randint(25, 60, n),
})

# Назначение обучения зависит от характеристик (конфаундер)
logit_assign = -2 + 0.3 * df_psm['experience'] + 0.4 * df_psm['motivation']
df_psm['treatment'] = (1 / (1 + np.exp(-logit_assign)) > np.random.uniform(0, 1, n)).astype(int)

# Исход зависит от T, experience, motivation (конфаундер!)
true_te = 5.0
df_psm['outcome'] = (70
                     + true_te * df_psm['treatment']
                     + 2 * df_psm['experience']
                     + 1.5 * df_psm['motivation']
                     + np.random.normal(0, 3, n))

# 1. Наивная оценка (смещённая)
naive = df_psm.groupby('treatment')['outcome'].mean()
naive_ate = naive[1] - naive[0]
print(f'Наивная оценка ATE: {naive_ate:.2f} (истинный: {true_te})')

# 2. Оценка propensity score
X_ps = df_psm[['experience', 'motivation', 'age']]
scaler = StandardScaler()
X_ps_scaled = scaler.fit_transform(X_ps)

lr = LogisticRegression()
lr.fit(X_ps_scaled, df_psm['treatment'])
df_psm['ps'] = lr.predict_proba(X_ps_scaled)[:, 1]

# 3. Nearest neighbor matching (1-on-1)
treated   = df_psm[df_psm['treatment'] == 1].copy()
control   = df_psm[df_psm['treatment'] == 0].copy()

matched_outcomes = []
for _, row in treated.iterrows():
    # Find closest control by propensity score
    dists = np.abs(control['ps'] - row['ps'])
    closest_idx = dists.idxmin()
    matched_outcomes.append(row['outcome'] - control.loc[closest_idx, 'outcome'])

psm_att = np.mean(matched_outcomes)
print(f'PSM ATT оценка: {psm_att:.2f} (истинный: {true_te})')</code></pre>

      <h4>4. DoWhy: структурированный causal inference</h4>
      <pre><code># pip install dowhy
import dowhy
from dowhy import CausalModel

# Задаём причинный граф (DAG)
causal_graph = """
digraph {
    experience -> treatment;
    motivation -> treatment;
    treatment -> outcome;
    experience -> outcome;
    motivation -> outcome;
}
"""

model_dowhy = CausalModel(
    data=df_psm,
    treatment='treatment',
    outcome='outcome',
    graph=causal_graph
)

# Идентификация: что нужно контролировать?
identified_estimand = model_dowhy.identify_effect(proceed_when_unidentifiable=True)
print(identified_estimand)  # Покажет backdoor variables

# Оценка через backdoor (propensity weighting)
estimate = model_dowhy.estimate_effect(
    identified_estimand,
    method_name='backdoor.propensity_score_weighting'
)
print(f'\\nDoWhy ATE: {estimate.value:.2f}')

# Проверка причинности (refutation test)
refute = model_dowhy.refute_estimate(
    identified_estimand, estimate,
    method_name='random_common_cause'
)
print(refute)  # Если ATE не изменился при добавлении случайного конфаундера — хороший знак</code></pre>
    `,

    applications: `
      <h3>Где применяется причинный вывод</h3>
      <table>
        <tr><th>Область</th><th>Задача</th></tr>
        <tr><td><b>Продуктовая аналитика</b></td><td>Оценка эффекта фичи, когда A/B-тест невозможен (наблюдательные данные)</td></tr>
        <tr><td><b>Экономика</b></td><td>Оценка эффекта политики (минимальная зарплата → занятость) через DiD, IV</td></tr>
        <tr><td><b>Маркетинг</b></td><td>Реальный вклад канала привлечения (uplift модели, incremental lift)</td></tr>
        <tr><td><b>Медицина</b></td><td>Наблюдательные исследования: эффект лечения без RCT (Propensity Score Matching)</td></tr>
        <tr><td><b>HR-аналитика</b></td><td>Влияние программ обучения/бонусов на производительность с учётом конфаундеров</td></tr>
        <tr><td><b>Образование</b></td><td>Эффект новой программы при невозможности случайного назначения</td></tr>
        <tr><td><b>Правительство и policy</b></td><td>Оценка эффекта законов через Regression Discontinuity</td></tr>
      </table>
        `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Позволяет делать причинные выводы без рандомизации — когда RCT невозможен</li>
            <li>DiD прост в реализации (OLS с взаимодействием) и хорошо интерпретируется</li>
            <li>PSM создаёт псевдо-рандомизацию из наблюдательных данных</li>
            <li>RDD — очень чистый дизайн (почти как RCT) при наличии порога назначения</li>
            <li>DAG помогает формально думать о конфаундерах и не делать ошибку контроля коллайдера</li>
            <li>DoWhy и подобные инструменты делают анализ воспроизводимым и верифицируемым</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Все методы требуют непроверяемых допущений (параллельные тренды, excludability IV)</li>
            <li>DiD не работает если нет подходящей контрольной группы с параллельным трендом</li>
            <li>PSM не устраняет смещение от ненаблюдаемых конфаундеров</li>
            <li>IV сложно найти настоящий инструмент; слабые инструменты → смещённые оценки</li>
            <li>Causal inference требует глубокого понимания предметной области — нельзя «автоматизировать»</li>
            <li>Всегда возможна критика: «ты не учёл конфаундер X»</li>
          </ul>
        </div>
      </div>
      <div class="when-to-use">
        <h4>Когда использовать</h4>
        <ul>
          <li><b>DiD:</b> есть данные до/после для двух групп, которые развивались параллельно до воздействия. Классика для оценки политик и законов.</li>
          <li><b>PSM:</b> данные о характеристиках, определяющих «самоотбор» в воздействие. Нет временной структуры, нужен cross-sectional анализ.</li>
          <li><b>IV:</b> есть внешний «случайный толчок» (lottery, geographic variation, policy cutoff). Редко встречается в реальных задачах.</li>
          <li><b>RDD:</b> воздействие назначается по правилу порога (скорборд 50+, медицинский критерий). Очень чисто, но требует много данных вблизи порога.</li>
          <li><b>Когда НЕ хватает:</b> сильные ненаблюдаемые конфаундеры, нет хорошей контрольной группы, очень мало данных → нужен RCT.</li>
        </ul>
      </div>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/@BradyNealCausalInference" target="_blank">Brady Neal: Causal Inference (канал)</a> — полный курс по причинно-следственному анализу</li>
        <li><a href="https://www.youtube.com/watch?v=Od6oAz1Op2k" target="_blank">Causal Inference — EXPLAINED!</a> — оценки склонности и PSM</li>
        <li><a href="https://www.youtube.com/watch?v=WwW8y5dZs80" target="_blank">Econometrics: The Path from Cause to Effect</a> — метод разностей-в-разностях для оценки причинного эффекта</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BF%D1%80%D0%B8%D1%87%D0%B8%D0%BD%D0%BD%D0%BE-%D1%81%D0%BB%D0%B5%D0%B4%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%20causal%20inference" target="_blank">Habr: causal inference</a> — статьи о причинно-следственном анализе на Хабре</li>
        <li><a href="https://en.wikipedia.org/wiki/Causal_inference" target="_blank">Wikipedia: Causal inference</a> — обзор методов причинно-следственного вывода</li>
        <li><a href="https://matheusfacure.github.io/python-causality-handbook/" target="_blank">Causal Inference for the Brave and True</a> — бесплатная книга по причинному анализу на Python</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://www.pywhy.org/dowhy/v0.11/" target="_blank">DoWhy: Documentation</a> — библиотека Microsoft для причинного анализа с DAG и тестами</li>
        <li><a href="https://econml.azurewebsites.net/" target="_blank">EconML: Documentation</a> — Microsoft: машинное обучение для причинного вывода (DML, IV, Causal Forest)</li>
      </ul>
    `,
  },
});
