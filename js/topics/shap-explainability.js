/* ==========================================================================
   SHAP и объяснимость моделей
   ========================================================================== */
App.registerTopic({
  id: 'shap-explainability',
  category: 'ml-basics',
  title: 'SHAP и объяснимость моделей',
  summary: 'Как понять, почему модель приняла решение: SHAP values, LIME, feature importance.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('random-forest')">Random Forest</a> ·
        <a onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a> ·
        <a onclick="App.selectTopic('metrics')">Метрики</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что банк отказал тебе в кредите — и ты хочешь знать <b>почему</b>. Модель выдала «отказ», но что именно повлияло: низкий доход? возраст? кредитная история? Без объяснения модель — это <b>чёрный ящик</b>: на вход подали данные, на выходе получили решение, а что внутри — неизвестно.</p>
        <p>Объяснимость — это превращение чёрного ящика в <b>стеклянный</b>. Бизнесу нужно понимать решения (регуляция, доверие клиентов), дата-сайентисту — отлаживать модель (почему ошибается?), а юристу — объяснять их в суде.</p>
        <p>SHAP (SHapley Additive exPlanations) — самый математически строгий способ ответить на вопрос: «насколько каждый признак повлиял на <b>это конкретное</b> предсказание?»</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" style="max-width:640px;">
          <text x="320" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">SHAP Waterfall: объяснение одного предсказания</text>
          <!-- Base value bar -->
          <rect x="140" y="35" width="200" height="22" fill="#94a3b8" rx="3"/>
          <text x="135" y="50" text-anchor="end" font-size="10" fill="#64748b">Базовое значение</text>
          <text x="240" y="50" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">E[f(x)] = 250 000</text>
          <!-- Feature 1: площадь +80k -->
          <rect x="340" y="65" width="110" height="22" fill="#ef4444" rx="3"/>
          <text x="335" y="80" text-anchor="end" font-size="10" fill="#64748b">Площадь 120м²</text>
          <text x="395" y="80" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">+80 000</text>
          <!-- Feature 2: район +45k -->
          <rect x="450" y="95" width="62" height="22" fill="#ef4444" rx="3"/>
          <text x="445" y="110" text-anchor="end" font-size="10" fill="#64748b">Центр города</text>
          <text x="481" y="110" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">+45k</text>
          <!-- Feature 3: этаж -15k (negative, going left from 512) -->
          <rect x="472" y="125" width="40" height="22" fill="#3b82f6" rx="3"/>
          <text x="467" y="140" text-anchor="end" font-size="10" fill="#64748b">1-й этаж</text>
          <text x="492" y="140" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">−15k</text>
          <!-- Feature 4: год +20k -->
          <rect x="472" y="155" width="55" height="22" fill="#ef4444" rx="3"/>
          <text x="467" y="170" text-anchor="end" font-size="10" fill="#64748b">2020 год</text>
          <text x="499" y="170" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">+20k</text>
          <!-- Final prediction -->
          <rect x="140" y="185" width="387" height="22" fill="#10b981" rx="3"/>
          <text x="135" y="200" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">Предсказание</text>
          <text x="333" y="200" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">f(x) = 380 000 ₽</text>
          <!-- Arrow legend -->
          <rect x="370" y="225" width="12" height="10" fill="#ef4444" rx="1"/>
          <text x="386" y="234" font-size="9" fill="#334155">повышает цену</text>
          <rect x="490" y="225" width="12" height="10" fill="#3b82f6" rx="1"/>
          <text x="506" y="234" font-size="9" fill="#334155">снижает цену</text>
        </svg>
        <div class="caption">SHAP waterfall chart: каждый признак «сдвигает» предсказание от базового значения (среднего по датасету) к финальному. Красные — увеличивают, синие — уменьшают.</div>
      </div>

      <h3>🎯 Зачем нужна объяснимость?</h3>
      <p>Объяснимость — не роскошь, а необходимость в современном ML. Вот три главных причины:</p>
      <ul>
        <li><b>Регуляция (GDPR, ФЗ):</b> компании обязаны объяснить алгоритмические решения, влияющие на людей — кредиты, найм, медицина.</li>
        <li><b>Доверие:</b> бизнес не внедрит модель, которую не понимает. «Почему модель решила именно так?» — главный вопрос на любом демо.</li>
        <li><b>Отладка:</b> модель может быть точной, но по неправильным причинам (spurious correlations). SHAP помогает найти такие ловушки.</li>
      </ul>

      <h3>🌍 Глобальная vs локальная объяснимость</h3>
      <p>Существует два уровня объяснений:</p>
      <ul>
        <li><span class="term" data-tip="Global feature importance: насколько каждый признак важен для модели в целом, усреднённо по всем примерам.">Глобальная объяснимость</span> — «какие признаки в целом важны для модели?» Отвечает: feature importance, permutation importance, среднее |SHAP|.</li>
        <li><span class="term" data-tip="Local explainability: почему модель сделала ЭТО предсказание для ЭТОГО конкретного примера.">Локальная объяснимость</span> — «почему модель дала ИМЕННО ЭТО предсказание для конкретной записи?» Отвечает: SHAP waterfall, LIME.</li>
      </ul>

      <h3>📊 Permutation Importance</h3>
      <p><span class="term" data-tip="Permutation Importance: важность признака измеряется как падение метрики при случайном перемешивании этого признака в тестовой выборке.">Permutation Importance</span> — простой и мощный способ измерить глобальную важность признака:</p>
      <ol>
        <li>Обучи модель, запомни базовую метрику (например, accuracy = 92%).</li>
        <li>Возьми один признак и <b>перемешай его значения случайно</b> (сломай связь с таргетом).</li>
        <li>Измерь метрику снова. Если упала до 78% — признак важен (важность = 14%).</li>
        <li>Повтори для каждого признака по очереди.</li>
      </ol>
      <p>Преимущество: работает с любой моделью, не требует её «вскрывать». Недостаток: не учитывает взаимодействия между признаками.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея SHAP</div>
        <p>SHAP основан на <span class="term" data-tip="Shapley values из теории игр: справедливое распределение выигрыша между игроками коалиции. Каждый игрок получает свой средний вклад по всем возможным коалициям.">значениях Шепли</span> из теории кооперативных игр. Идея: признаки — это «игроки», предсказание — «выигрыш». Как справедливо распределить выигрыш между игроками? Shapley values вычисляют вклад каждого признака, усредняя его по всем возможным <b>коалициям</b> (подмножествам признаков). Математически строго, аксиоматически обосновано — единственное такое разложение.</p>
      </div>

      <h3>🔢 SHAP: как считается</h3>
      <p>Для признака $j$ значение SHAP равно:</p>
      <div class="math-block">$$\\phi_j = \\sum_{S \\subseteq F \\setminus \\{j\\}} \\frac{|S|!(|F|-|S|-1)!}{|F|!} \\left[ f(S \\cup \\{j\\}) - f(S) \\right]$$</div>
      <p>Где $F$ — все признаки, $S$ — коалиция без признака $j$, $f(S)$ — предсказание модели с этим набором признаков. На практике: для деревьев используется <b>TreeSHAP</b> (за полиномиальное время), для нейросетей — DeepSHAP / GradientSHAP.</p>
      <p>Ключевое свойство (аддитивность):</p>
      <div class="math-block">$$f(x) = \\underbrace{E[f(x)]}_{\\text{базовое значение}} + \\sum_{j=1}^{p} \\phi_j$$</div>
      <p>Сумма всех SHAP-значений плюс базовое значение всегда точно равна предсказанию модели.</p>

      <h3>📈 Типы SHAP-графиков</h3>
      <ul>
        <li><b>Waterfall chart:</b> локальное объяснение одного предсказания — от базового значения до финального через цепочку «добавок» признаков.</li>
        <li><b>Summary plot (Beeswarm):</b> глобальная картина — каждая точка = один пример, позиция по X = SHAP-значение, цвет = значение признака. Позволяет увидеть нелинейность и взаимодействия.</li>
        <li><b>Force plot:</b> компактное локальное объяснение в виде «сил», тянущих предсказание влево (вниз) и вправо (вверх).</li>
        <li><b>Dependence plot:</b> SHAP признака j в зависимости от его значения + цвет по другому признаку → взаимодействия.</li>
      </ul>

      <h3>🔵 LIME: локальная линейная аппроксимация</h3>
      <p><span class="term" data-tip="LIME (Local Interpretable Model-agnostic Explanations): строит простую (линейную) модель в окрестности конкретного предсказания, объясняя сложную модель локально.">LIME</span> работает иначе: для объяснения предсказания $x_0$ LIME:</p>
      <ol>
        <li>Генерирует соседей $x_0$ (случайные пертурбации).</li>
        <li>Спрашивает чёрный ящик: что предскажешь для этих соседей?</li>
        <li>Обучает простую линейную модель на парах (сосед, предсказание).</li>
        <li>Коэффициенты линейной модели — «объяснение» для $x_0$.</li>
      </ol>
      <p>LIME проще реализовать и работает с любыми входными данными (текст, изображения). Но менее стабилен: разные прогоны дают разные объяснения.</p>

      <div class="deep-dive">
        <summary>Подробнее: четыре аксиомы Шепли</summary>
        <div class="deep-dive-body">
          <p>Значения Шепли — единственная функция, удовлетворяющая четырём аксиомам:</p>
          <ul>
            <li><b>Эффективность:</b> сумма вкладов всех признаков = разница между предсказанием и базовым значением. Декомпозиция точная, без остатка.</li>
            <li><b>Симметрия:</b> если два признака вносят одинаковый вклад во все коалиции — они получают одинаковые значения Шепли.</li>
            <li><b>Фиктивный игрок (Dummy):</b> если признак не изменяет предсказание ни в одной коалиции — его значение Шепли = 0.</li>
            <li><b>Аддитивность:</b> если объяснить сумму двух моделей — это то же самое, что сложить объяснения каждой.</li>
          </ul>
          <p>Эти аксиомы делают SHAP единственным «справедливым» способом атрибуции вклада. Это отличает SHAP от ad-hoc методов вроде <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">градиентов</a> или <a class="glossary-link" onclick="App.selectTopic('glossary-attention')">attention</a>-весов.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: SHAP Interaction Values</summary>
        <div class="deep-dive-body">
          <p>Обычные SHAP-значения показывают главный эффект каждого признака. Но что если признаки взаимодействуют? SHAP Interaction Values разбивают $\\phi_j$ на:</p>
          <div class="math-block">$$\\phi_j = \\phi_{jj} + \\sum_{k \\neq j} \\phi_{jk}$$</div>
          <p>Где $\\phi_{jj}$ — главный эффект признака $j$ (без взаимодействий), $\\phi_{jk}$ — эффект взаимодействия $j$ и $k$. В sklearn TreeExplainer это вычисляется через <code>shap_interaction_values</code>. Полезно для обнаружения «условных эффектов»: признак A важен только если признак B = 1.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Random Forest / <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting:</b> встроенный feature_importances_ — быстро, но смещён (<a class="glossary-link" onclick="App.selectTopic('glossary-entropy')">Gini</a> importance предпочитает высококардинальные признаки). SHAP честнее.</li>
        <li><b>Линейная регрессия:</b> коэффициенты линейной модели — это «почти SHAP» (при стандартизации). SHAP обобщает это на нелинейные модели.</li>
        <li><b>A/B тест:</b> объяснимость помогает понять, что именно изменилось в поведении модели после обновления — как инструмент отладки.</li>
        <li><b>Product Analytics:</b> SHAP помогает объяснить предиктивные модели оттока, LTV, конверсии стейкхолдерам.</li>
      </ul>
    `,

    examples: [
      {
        title: 'SHAP waterfall: цена квартиры',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Модель предсказала цену квартиры 4 800 000 ₽. Базовое значение (среднее по всем квартирам) — 3 200 000 ₽. Понять, как каждый из 5 признаков повлиял на итоговое предсказание.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Признак</th><th>Значение</th><th>SHAP φ</th><th>Направление</th></tr>
              <tr><td>Площадь (м²)</td><td>85</td><td>+1 100 000</td><td>↑ повышает</td></tr>
              <tr><td>Район</td><td>Центр</td><td>+800 000</td><td>↑ повышает</td></tr>
              <tr><td>Этаж</td><td>1</td><td>−350 000</td><td>↓ снижает</td></tr>
              <tr><td>Год постройки</td><td>2019</td><td>+150 000</td><td>↑ повышает</td></tr>
              <tr><td>Наличие парковки</td><td>Нет</td><td>−100 000</td><td>↓ снижает</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: проверить аддитивность</h4>
            <div class="calc">
              E[f(x)] (базовое) = 3 200 000 ₽<br><br>
              Σφ_j = (+1 100 000) + (+800 000) + (−350 000) + (+150 000) + (−100 000)<br>
              Σφ_j = 1 100 000 + 800 000 − 350 000 + 150 000 − 100 000 = +1 600 000<br><br>
              f(x) = E[f(x)] + Σφ_j = 3 200 000 + 1 600 000 = <b>4 800 000 ₽</b> ✓
            </div>
            <div class="why">Ключевое свойство SHAP: сумма значений Шепли плюс базовое значение = точное предсказание модели. Нет никакого «остатка» — декомпозиция полная.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: интерпретация признаков</h4>
            <div class="calc">
              Площадь (85м²) → φ = +1 100 000:<br>
              Для этой квартиры площадь ВЫШЕ средней по датасету (~55м²)<br>
              Это «поднимает» предсказание на 1.1 млн выше базового<br><br>
              Этаж (1-й) → φ = −350 000:<br>
              1-й этаж хуже среднего → «тянет» предсказание вниз на 350к<br><br>
              Важно: SHAP показывает вклад именно в контексте этой квартиры,<br>
              не общий «эффект» признака по всему датасету
            </div>
            <div class="why">SHAP φ — это ответ на вопрос: «на сколько предсказание отличается от базового из-за ЭТОГО значения признака?» Это не коэффициент регрессии!</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: объяснение клиенту</h4>
            <div class="calc">
              Почему квартира стоит 4 800 000 ₽ (а не «среднюю» 3 200 000)?<br><br>
              + Большая площадь (85м² при средней 55м²) → +1 100 000 ₽<br>
              + Центральный район (выше среднего) → +800 000 ₽<br>
              + Новый дом (2019 г.) → +150 000 ₽<br>
              − 1-й этаж (хуже среднего) → −350 000 ₽<br>
              − Нет парковки → −100 000 ₽<br>
              ──────────────────────────────────────────<br>
              Итого: базовое + 1 600 000 = 4 800 000 ₽
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Квартира оценена выше среднего прежде всего за счёт большой площади (+1.1 млн) и центрального района (+0.8 млн). Первый этаж и отсутствие парковки снижают цену на 450 тыс. Аддитивная декомпозиция точная: 3 200 000 + 1 600 000 = 4 800 000 ₽.</p>
          </div>
          <div class="lesson-box">
            SHAP waterfall — лучший инструмент для объяснения ОДНОГО решения. Покажи его клиенту или юристу: он нагляден, математически точен и не требует знания ML.
          </div>
        `,
      },
      {
        title: 'Permutation Importance: shuffle и падение метрики',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучена модель классификации (Random Forest) для предсказания оттока клиентов. Accuracy = 88%. Определить, какие признаки реально важны, перемешав каждый по очереди.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Признак</th><th>Accuracy после shuffle</th><th>Падение accuracy</th><th>Важность</th></tr>
              <tr><td>Число звонков в поддержку</td><td>71%</td><td>17%</td><td>★★★★★</td></tr>
              <tr><td>Месяцев с нами (tenure)</td><td>79%</td><td>9%</td><td>★★★★</td></tr>
              <tr><td>Сумма последнего счёта</td><td>84%</td><td>4%</td><td>★★★</td></tr>
              <tr><td>Тариф (A/B/C)</td><td>86%</td><td>2%</td><td>★★</td></tr>
              <tr><td>Пол клиента</td><td>88%</td><td>0%</td><td>★ (нет)</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: алгоритм перестановки</h4>
            <div class="calc">
              Базовая accuracy = 88% (модель обучена, не меняется)<br><br>
              Берём признак «Число звонков в поддержку»:<br>
              • Копируем тестовый датасет X_test<br>
              • В X_test_shuffled перемешиваем только этот столбец случайно<br>
              • Вычисляем accuracy на X_test_shuffled (без <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a>!)<br>
              • Accuracy = 71% → важность = 88% − 71% = 17%<br><br>
              Повторяем для каждого признака по очереди
            </div>
            <div class="why">Shuffle ломает связь между признаком и таргетом, но не меняет маргинальное распределение признака. Если accuracy упала — признак реально использовался моделью для правильных предсказаний.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: интерпретация результатов</h4>
            <div class="calc">
              «Число звонков в поддержку» (−17%):<br>
              Ключевой предиктор оттока. Много звонков = раздражение → уход.<br>
              Рекомендация: приоритизировать клиентов с 3+ звонками.<br><br>
              «Пол клиента» (0%):<br>
              Полная перестановка не изменила accuracy → признак бесполезен.<br>
              Можно убрать из модели без потери качества.<br>
              Бонус: снимает вопросы о bias по гендеру.
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: сравнение с Gini Importance</h4>
            <div class="calc">
              RF Gini Importance для тех же признаков:<br>
              Число звонков: 0.19 (правильно высокая)<br>
              Тариф (3 значения): 0.18 (!)<br>
              Tenure: 0.17<br>
              Сумма счёта: 0.15<br>
              Пол: 0.11 (!) — Gini завышает из-за кардинальности<br><br>
              Permutation правильно показал: Пол = 0.
              Gini importance смещён в сторону признаков с большим числом уникальных значений!
            </div>
            <div class="why">Gini importance (built-in RF) смещён и не надёжен. Permutation Importance и SHAP — честные альтернативы. Sklearn: permutation_importance(model, X_test, y_test).</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Самый важный признак — «Число звонков в поддержку» (падение accuracy на 17% при shuffle). Пол клиента — незначим (0%). Permutation Importance объективнее встроенного Gini importance, так как тестирует на held-out данных и не смещён по кардинальности.</p>
          </div>
          <div class="lesson-box">
            Всегда считай Permutation Importance на тестовой, а не тренировочной выборке. На train важность будет завышена из-за переобучения.
          </div>
        `,
      },
      {
        title: 'SHAP Summary Plot: интерпретация beeswarm',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Модель предсказывает риск сердечного приступа (бинарная классификация). На SHAP summary plot отражены все объекты тестовой выборки. Разобрать, что означает каждый элемент графика.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Признак (по убыванию |SHAP|)</th><th>Высокое значение признака</th><th>Низкое значение признака</th></tr>
              <tr><td>Возраст</td><td>SHAP +0.8 (риск ↑)</td><td>SHAP −0.3 (риск ↓)</td></tr>
              <tr><td>Холестерин</td><td>SHAP +0.6 (риск ↑)</td><td>SHAP −0.1 (риск ↓)</td></tr>
              <tr><td>ЧСС в покое</td><td>SHAP +0.4 (риск ↑)</td><td>SHAP −0.2 (риск ↓)</td></tr>
              <tr><td>Курение (да/нет)</td><td>SHAP +0.35 (да → риск ↑)</td><td>SHAP −0.15 (нет → риск ↓)</td></tr>
              <tr><td>ИМТ</td><td>SHAP +0.2</td><td>SHAP −0.1</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: читаем оси beeswarm</h4>
            <div class="calc">
              Ось Y: признаки, отсортированы по среднему |SHAP| ↓<br>
              (вверху — самые важные для модели в целом)<br><br>
              Ось X: значение SHAP для каждого объекта<br>
              X > 0: этот признак увеличивает вероятность риска для этого объекта<br>
              X < 0: этот признак снижает вероятность риска<br>
              X = 0: признак не влияет на ЭТО предсказание<br><br>
              Цвет точки: значение самого признака<br>
              Красный = высокое значение, синий = низкое значение
            </div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: интерпретация паттернов</h4>
            <div class="calc">
              Возраст (топ-1 по важности):<br>
              Красные точки (высокий возраст) → справа (SHAP > 0) → риск ↑<br>
              Синие точки (молодые) → слева (SHAP < 0) → риск ↓<br>
              Чёткий паттерн: модель правильно учит возраст → риск<br><br>
              Холестерин (топ-2):<br>
              Аналогично, но точки «плотнее» — зависимость нелинейная.<br>
              Некоторые люди с высоким холестерином имеют SHAP ≈ 0<br>
              (из-за других защитных факторов — взаимодействие)<br><br>
              Курение (бинарный признак):<br>
              Только два кластера точек: курильщики (SHAP +0.35) и нет (−0.15)
            </div>
            <div class="why">Если красные точки — слева, а синие — справа: высокие значения признака СНИЖАЮТ риск. Например, «физическая активность»: высокая → меньший риск. Это контринтуитивный паттерн, который сразу видно на beeswarm.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: обнаружение проблем модели</h4>
            <div class="calc">
              Красный флаг: широкий разброс SHAP при одном значении признака<br>
              Если для одного и того же возраста SHAP варьируется от −0.5 до +0.8<br>
              → модель нестабильна / сильные взаимодействия / мало данных<br><br>
              Полезные вопросы при анализе beeswarm:<br>
              1. Логичны ли направления? (Высокий холестерин → риск ↑ — да)<br>
              2. Нет ли «перевёрнутых» эффектов? (признак важен, но не в ту сторону)<br>
              3. Нет ли неожиданно важных признаков? (ИД клиента, дата — утечка данных!)
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>SHAP beeswarm показывает: (1) глобальный рейтинг признаков (ось Y), (2) направление эффекта (X > 0 / X < 0), (3) нелинейность и взаимодействия (разброс точек), (4) распределение эффектов по всей выборке. Это самый информативный вид SHAP-визуализации для понимания модели в целом.</p>
          </div>
          <div class="lesson-box">
            Summary plot показывает и глобальную важность (порядок признаков), и локальные детали (каждая точка — один объект). Если хочешь только топ-важность — используй bar plot mean(|SHAP|). Если хочешь понять нелинейность — beeswarm.
          </div>
        `,
      },
    ],

    simulation: [
      {
        title: 'Waterfall: объяснение одного предсказания',
        html: `
          <h3>Waterfall: раскладываем одно предсказание на вклады признаков</h3>
          <p>Линейная модель предсказывает «одобрить кредит» по 6 признакам. SHAP-вклад каждого признака для конкретного клиента равен $\\phi_j = w_j (x_j - \\bar{x}_j)$ — насколько этот признак у клиента отклонил логит от среднего. Сумма вкладов + базовое значение = финальный логит. Двигай слайдеры признаков и смотри, как перестраивается waterfall.</p>
          <div class="sim-container">
            <div class="sim-controls" id="shap-controls"></div>
            <div class="sim-buttons">
              <button class="btn secondary" id="shap-reset">↺ Средний клиент</button>
              <button class="btn secondary" id="shap-random">🎲 Случайный клиент</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:340px;"><canvas id="shap-chart"></canvas></div>
              <div class="sim-stats" id="shap-stats"></div>
              <div class="lesson-box" style="margin-top:10px;">
                Красные бары тянут предсказание вниз (уменьшают вероятность одобрения), зелёные — вверх. <b>Base value</b> — это среднее предсказание по всей выборке; вклады SHAP — отклонения от него для конкретного клиента. Сумма всех вкладов + base = точное предсказание модели (аддитивность SHAP).
              </div>
            </div>
          </div>
        `,
        init(container) {
          const FEATURES = [
            { name: 'Доход', w: 1.2, mean: 0.0, std: 1, min: -2.5, max: 2.5, unit: 'σ' },
            { name: 'Кредитная история', w: 1.8, mean: 0.0, std: 1, min: -2.5, max: 2.5, unit: 'σ' },
            { name: 'Отношение долг/доход', w: -1.5, mean: 0.0, std: 1, min: -2.5, max: 2.5, unit: 'σ' },
            { name: 'Возраст', w: 0.6, mean: 0.0, std: 1, min: -2.5, max: 2.5, unit: 'σ' },
            { name: 'Кол-во открытых счетов', w: -0.4, mean: 0.0, std: 1, min: -2.5, max: 2.5, unit: 'σ' },
            { name: 'Стаж работы', w: 0.9, mean: 0.0, std: 1, min: -2.5, max: 2.5, unit: 'σ' },
          ];
          const BASE = 0.3; // base logit

          const controls = container.querySelector('#shap-controls');
          const sliders = FEATURES.map((f, i) => {
            const c = App.makeControl('range', `shap-f${i}`, f.name, { min: f.min, max: f.max, step: 0.05, value: f.mean });
            controls.appendChild(c.wrap);
            return c;
          });

          let chart = null;

          function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

          function update() {
            const x = sliders.map(s => +s.input.value);
            const contribs = FEATURES.map((f, i) => f.w * (x[i] - f.mean));
            // Sort by absolute contribution — как в shap.waterfall_plot
            const order = contribs.map((c, i) => i).sort((a, b) => Math.abs(contribs[b]) - Math.abs(contribs[a]));

            // Waterfall: base → + contribs в порядке убывания важности → final
            let running = BASE;
            const bars = [];
            order.forEach(i => {
              const from = running;
              running += contribs[i];
              bars.push({ idx: i, from, to: running, delta: contribs[i] });
            });
            const finalLogit = running;
            const finalProb = sigmoid(finalLogit);
            const baseProb = sigmoid(BASE);

            // Для Chart.js используем floating bar: [from, to]
            const labels = order.map(i => `${FEATURES[i].name} = ${x[i].toFixed(2)}`);
            const barData = bars.map(b => [b.from, b.to]);
            const colors = bars.map(b => b.delta >= 0 ? 'rgba(22,163,74,0.75)' : 'rgba(220,38,38,0.75)');
            const borders = bars.map(b => b.delta >= 0 ? '#16a34a' : '#dc2626');

            const ctx = container.querySelector('#shap-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels,
                datasets: [{
                  label: 'SHAP вклад',
                  data: barData,
                  backgroundColor: colors,
                  borderColor: borders,
                  borderWidth: 1.5,
                  borderSkipped: false,
                }],
              },
              options: {
                indexAxis: 'y',
                responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: `base = ${BASE.toFixed(2)}  →  финальный логит = ${finalLogit.toFixed(2)}  (P = ${finalProb.toFixed(3)})` },
                  tooltip: {
                    callbacks: {
                      label: (ctxT) => {
                        const b = bars[ctxT.dataIndex];
                        return `вклад: ${b.delta >= 0 ? '+' : ''}${b.delta.toFixed(3)}`;
                      },
                    },
                  },
                },
                scales: {
                  x: { title: { display: true, text: 'логит (log-odds одобрения)' } },
                  y: { ticks: { font: { size: 11 } } },
                },
              },
            });
            App.registerChart(chart);

            const decision = finalProb > 0.5 ? '<span style="color:#16a34a;font-weight:700;">одобрить</span>' : '<span style="color:#dc2626;font-weight:700;">отказать</span>';
            const sumContrib = contribs.reduce((a, b) => a + b, 0);
            container.querySelector('#shap-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Base P</div><div class="stat-value">${baseProb.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Сумма SHAP</div><div class="stat-value">${(sumContrib >= 0 ? '+' : '') + sumContrib.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Final P</div><div class="stat-value">${finalProb.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Решение</div><div class="stat-value" style="font-size:14px;">${decision}</div></div>
            `;
          }

          sliders.forEach(s => s.input.addEventListener('input', update));
          container.querySelector('#shap-reset').onclick = () => {
            sliders.forEach((s, i) => { s.input.value = FEATURES[i].mean; });
            update();
          };
          container.querySelector('#shap-random').onclick = () => {
            sliders.forEach((s, i) => { s.input.value = App.Util.randn(FEATURES[i].mean, 1).toFixed(2); });
            update();
          };
          update();
        },
      },
      {
        title: 'Global feature importance',
        html: `
          <h3>Глобальная важность = среднее $|\\text{SHAP}|$ по выборке</h3>
          <p>Для каждого из 200 «клиентов» считаем локальные вклады, берём модуль и усредняем по выборке. Это и есть bar-plot mean|SHAP| из библиотеки shap. Меняй шум — и смотри, как ранжирование остаётся стабильным для сильных признаков и «шатается» у слабых.</p>
          <div class="sim-container">
            <div class="sim-controls" id="shapg-controls"></div>
            <div class="sim-buttons">
              <button class="btn secondary" id="shapg-regen">🔄 Новая выборка</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="shapg-chart"></canvas></div>
              <div class="sim-stats" id="shapg-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const FEATURES = [
            { name: 'Доход', w: 1.2 },
            { name: 'Кредитная история', w: 1.8 },
            { name: 'Отношение долг/доход', w: -1.5 },
            { name: 'Возраст', w: 0.6 },
            { name: 'Кол-во открытых счетов', w: -0.4 },
            { name: 'Стаж работы', w: 0.9 },
            { name: 'Цвет глаз (шум)', w: 0 },
          ];
          const controls = container.querySelector('#shapg-controls');
          const cN = App.makeControl('range', 'shapg-n', 'Клиентов в выборке', { min: 30, max: 500, step: 10, value: 200 });
          const cNoise = App.makeControl('range', 'shapg-noise', 'Шум признаков σ', { min: 0.3, max: 3, step: 0.1, value: 1 });
          [cN, cNoise].forEach(c => controls.appendChild(c.wrap));

          let chart = null;
          function run() {
            const n = +cN.input.value;
            const sig = +cNoise.input.value;
            const absMean = new Array(FEATURES.length).fill(0);
            for (let i = 0; i < n; i++) {
              for (let j = 0; j < FEATURES.length; j++) {
                const xj = App.Util.randn(0, sig);
                absMean[j] += Math.abs(FEATURES[j].w * xj);
              }
            }
            for (let j = 0; j < FEATURES.length; j++) absMean[j] /= n;

            // Sort descending
            const order = absMean.map((_, i) => i).sort((a, b) => absMean[b] - absMean[a]);
            const labels = order.map(i => FEATURES[i].name);
            const vals = order.map(i => absMean[i]);

            const ctx = container.querySelector('#shapg-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels,
                datasets: [{
                  label: 'mean |SHAP|',
                  data: vals,
                  backgroundColor: vals.map((_, k) => k === 0 ? 'rgba(99,102,241,0.85)' : 'rgba(99,102,241,0.55)'),
                  borderRadius: 4,
                }],
              },
              options: {
                indexAxis: 'y',
                responsive: true, maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Глобальная важность признаков (mean |SHAP|)' },
                },
                scales: { x: { title: { display: true, text: 'mean |SHAP| (логит)' }, beginAtZero: true } },
              },
            });
            App.registerChart(chart);

            container.querySelector('#shapg-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Топ-1</div><div class="stat-value" style="font-size:13px;">${labels[0]}</div></div>
              <div class="stat-card"><div class="stat-label">Важность топ-1</div><div class="stat-value">${vals[0].toFixed(2)}</div></div>
              <div class="stat-card"><div class="stat-label">Шумовой признак</div><div class="stat-value">${absMean[6].toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Объектов</div><div class="stat-value">${n}</div></div>
            `;
          }

          [cN, cNoise].forEach(c => c.input.addEventListener('input', run));
          container.querySelector('#shapg-regen').onclick = run;
          run();
        },
      },
    ],

    python: `
      <h3>Python: SHAP, Permutation Importance, LIME</h3>
      <p>Основные инструменты: библиотека <code>shap</code>, <code>sklearn.inspection.permutation_importance</code>, <code>lime</code>.</p>

      <h4>1. SHAP TreeExplainer: объяснение Random Forest</h4>
      <pre><code>import numpy as np
import pandas as pd
import shap
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer

# Данные: рак молочной железы (30 признаков, бинарная классификация)
data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Обучаем модель
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
print(f'Accuracy: {model.score(X_test, y_test):.4f}')

# SHAP: TreeExplainer — быстрый алгоритм для деревьев (полиномиальное время)
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# shap_values — список из 2 массивов (по классу)
# Для бинарной классификации берём класс 1 (positive)
shap_vals_class1 = shap_values[1]  # shape: (n_test, n_features)

print(f'SHAP shape: {shap_vals_class1.shape}')
print(f'Базовое значение: {explainer.expected_value[1]:.4f}')

# Проверяем аддитивность для первого объекта
pred_proba = model.predict_proba(X_test.iloc[[0]])[0, 1]
shap_sum = explainer.expected_value[1] + shap_vals_class1[0].sum()
print(f'Прямое предсказание: {pred_proba:.6f}')
print(f'Base + sum(SHAP):    {shap_sum:.6f}')  # должны совпадать</code></pre>

      <h4>2. Waterfall plot: объяснение одного предсказания</h4>
      <pre><code># Объяснение для первого объекта тестовой выборки
sample_idx = 0

# Новый API shap: Explanation object
explanation = shap.Explanation(
    values=shap_vals_class1[sample_idx],
    base_values=explainer.expected_value[1],
    data=X_test.iloc[sample_idx],
    feature_names=data.feature_names
)

plt.figure(figsize=(10, 6))
shap.waterfall_plot(explanation, max_display=10)
plt.tight_layout()
plt.show()

# Force plot (интерактивный в jupyter)
shap.force_plot(
    explainer.expected_value[1],
    shap_vals_class1[sample_idx],
    X_test.iloc[sample_idx],
    feature_names=data.feature_names
)</code></pre>

      <h4>3. Summary plot (beeswarm): глобальная картина</h4>
      <pre><code># Beeswarm plot — все объекты, все признаки
plt.figure(figsize=(10, 8))
shap.summary_plot(shap_vals_class1, X_test, feature_names=data.feature_names)
plt.show()

# Bar plot — среднее |SHAP| (упрощённая важность)
plt.figure(figsize=(10, 6))
shap.summary_plot(shap_vals_class1, X_test,
                  feature_names=data.feature_names,
                  plot_type='bar')
plt.show()

# Dependence plot: SHAP признака vs его значение (+ взаимодействие)
shap.dependence_plot('worst radius', shap_vals_class1, X_test,
                     feature_names=data.feature_names)</code></pre>

      <h4>4. Permutation Importance из sklearn</h4>
      <pre><code>from sklearn.inspection import permutation_importance

# Важно: считаем на тестовой выборке!
result = permutation_importance(
    model, X_test, y_test,
    n_repeats=10,          # повторить shuffle 10 раз для стабильности
    random_state=42,
    n_jobs=-1
)

# Сортируем по важности
perm_sorted_idx = result.importances_mean.argsort()[::-1]

plt.figure(figsize=(10, 6))
plt.barh(
    [data.feature_names[i] for i in perm_sorted_idx[:15]],
    result.importances_mean[perm_sorted_idx[:15]],
    xerr=result.importances_std[perm_sorted_idx[:15]],
    color='steelblue', alpha=0.7
)
plt.xlabel('Среднее падение accuracy при перемешивании')
plt.title('Permutation Importance (тестовая выборка)')
plt.tight_layout()
plt.show()

# Сравнение с Gini importance
gini_importance = model.feature_importances_
print('\\nТоп-5 по Gini vs Permutation:')
gini_top5 = np.argsort(gini_importance)[::-1][:5]
perm_top5  = perm_sorted_idx[:5]
for i in range(5):
    print(f'Gini: {data.feature_names[gini_top5[i]]:30} | Perm: {data.feature_names[perm_top5[i]]}')</code></pre>

      <h4>5. LIME: локальное объяснение любой модели</h4>
      <pre><code>from lime import lime_tabular

# LIME работает с любой моделью (model-agnostic)
explainer_lime = lime_tabular.LimeTabularExplainer(
    X_train.values,
    feature_names=data.feature_names,
    class_names=['злокачественная', 'доброкачественная'],
    mode='classification'
)

# Объяснение для первого тестового объекта
exp = explainer_lime.explain_instance(
    X_test.iloc[0].values,
    model.predict_proba,
    num_features=10
)

# Визуализация (в jupyter: exp.show_in_notebook())
exp.as_pyplot_figure()
plt.title('LIME: локальное объяснение (первый объект)')
plt.tight_layout()
plt.show()

# Сравнение SHAP и LIME для одного объекта
print('\\nSHAP топ-5:')
top_shap = np.argsort(np.abs(shap_vals_class1[0]))[::-1][:5]
for i in top_shap:
    print(f'  {data.feature_names[i]:30}: {shap_vals_class1[0][i]:+.4f}')

print('\\nLIME топ-5:')
for feat, weight in sorted(exp.as_list(), key=lambda x: abs(x[1]), reverse=True)[:5]:
    print(f'  {feat:40}: {weight:+.4f}')</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Регуляторика в финансах.</b> GDPR (Европа), Equal Credit Opportunity Act (США), требования ЦБ РФ — везде требуется объяснение, почему человеку отказали в кредите или повысили ставку. SHAP стал де-факто стандартом: можно показать клиенту «ваш score понизили из-за этих 3 факторов».</li>
        <li><b>Медицина и диагностика.</b> Модель предсказывает «высокий риск диабета» — врачу нужно понимать, за счёт каких именно показателей (возраст? HbA1c? BMI?). Без этого нейросеть не получит согласование на клиническое использование.</li>
        <li><b>Отладка моделей и поиск data leakage.</b> SHAP показывает, какие признаки важны. Если фича «id_transaction» вдруг топ-3 — это утечка, модель использовала будущее. Такие находки спасают проекты от прод-аварий.</li>
        <li><b>Feature selection.</b> Глобальные SHAP values агрегируют локальные: можно убрать фичи с малым вкладом и получить проще/быстрее модель с тем же качеством.</li>
        <li><b>Fairness audit.</b> Проверка, не зависит ли модель от protected-атрибутов (пол, раса, возраст). Если SHAP показывает, что «пол» вносит значимый вклад — это юридический и этический риск, особенно в США/ЕС.</li>
        <li><b>Объяснение клиенту в B2B.</b> SaaS-продукты с ML внутри (скоринг, ретеншн, прогнозы) — клиент требует «почему модель так решила». SHAP waterfall — готовый формат ответа.</li>
        <li><b>Научные и пользовательские исследования.</b> Замена классической регрессии: SHAP показывает, какие факторы реально влияют на результат, включая нелинейные эффекты и взаимодействия, которые линейная модель не поймает.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Математически строгий фундамент.</b> SHAP — единственное аддитивное разложение, удовлетворяющее аксиомам Шепли (эффективность, симметрия, нулевой игрок, аддитивность). Это не эвристика, это доказанная уникальность — что важно в регуляторных разбирательствах и академических публикациях.</p>
      <p><b>Глобальная И локальная объяснимость.</b> SHAP одновременно отвечает на «какие фичи важны в целом» (summary plot) и «почему для этого клиента именно такое предсказание» (waterfall). Конкурирующие методы обычно дают только одно из двух.</p>
      <p><b>Аддитивность гарантирована.</b> $\\text{base} + \\sum \\phi_i = f(x)$ точно. Это свойство позволяет показать клиенту полное разложение предсказания — никаких «остатков необъяснённого».</p>
      <p><b>Работает с любой моделью.</b> TreeSHAP — для деревьев и бустинга (быстро, точно), KernelSHAP — для любой модели (медленно, аппроксимация), DeepSHAP — для нейросетей. Единый интерфейс для всего зоопарка моделей.</p>
      <p><b>Ловит нелинейности и взаимодействия.</b> В отличие от коэффициентов линейной регрессии, SHAP видит, что «возраст важен только для молодых клиентов» или «доход и образование взаимодействуют». Это реальная сила интерпретации сложных моделей.</p>
      <p><b>Обнаруживает data leakage и bugs в пайплайне.</b> Если SHAP показывает неожиданно важную фичу — это повод разобраться. Многие баги утечки данных были найдены именно так: «почему timestamp так важен?!».</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>KernelSHAP экспоненциально дорог.</b> Точный Shapley требует $O(2^p)$ коалиций признаков. Для 20 фичей — 1M коалиций на каждое предсказание. На практике — аппроксимация через подвыборку, но и она медленная: для миллиона строк объяснения занимают часы.</p>
      <p><b>Предположение независимости признаков.</b> SHAP усредняет по «маргинальным» распределениям фичей, как если бы они были независимы. При сильной корреляции (возраст и стаж) это приводит к нефизичным комбинациям и искажённым φ. Исправляется через conditional/interventional SHAP, но это уже не «из коробки».</p>
      <p><b>SHAP объясняет модель, а не реальность.</b> Модель могла выучить spurious correlation («люди с красными машинами чаще дефолтят»), и SHAP честно это покажет. Интерпретировать как причинность — ошибка. Для caus**ative** выводов нужны другие методы (causal inference, DoWhy).</p>
      <p><b>Объяснения могут быть бизнес-нелогичными.</b> SHAP правильно разложит предсказание, но это разложение может противоречить экспертной интуиции («почему возраст увеличивает риск для этого клиента, если он молодой?»). Приходится дополнять бизнес-здравым смыслом.</p>
      <p><b>DeepSHAP для нейросетей — приближение.</b> Интегрирует активации, но не гарантирует аксиом Шепли строго. Для картинок/текста часто используется вместе с Integrated Gradients и Grad-CAM.</p>
      <p><b>Порог входа и сложность коммуникации.</b> Термин «Shapley values» большинству стейкхолдеров ничего не говорит. Нужна простая обёртка вроде «вклад каждого признака в предсказание» — иначе объяснение нуждается в собственном объяснении.</p>

      <h3>🧭 Когда брать SHAP — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери SHAP когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Модель — Random Forest, XGBoost, LightGBM, CatBoost — используй TreeSHAP, это быстро и точно</td>
          <td>Модель — линейная регрессия или логрег: коэффициенты уже читаемы, SHAP лишний</td>
        </tr>
        <tr>
          <td>Нужно регуляторное объяснение решения (кредит, медицина, найм)</td>
          <td>Модель — дерево глубины 3, которое можно нарисовать — объясни его напрямую</td>
        </tr>
        <tr>
          <td>Отлаживаешь модель и ищешь data leakage через аномальную важность фичей</td>
          <td>Прод требует миллисекундных объяснений на миллионах запросов — SHAP слишком медленный</td>
        </tr>
        <tr>
          <td>Клиент или стейкхолдер спрашивает «почему так» для конкретного предсказания</td>
          <td>Данных миллионы и KernelSHAP на всех займёт дни — используй подвыборку или permutation importance</td>
        </tr>
        <tr>
          <td>Нужна глобальная картина важности фичей для отчёта/презентации</td>
          <td>Признаки сильно коррелируют и нет возможности использовать conditional SHAP — риск ошибок интерпретации</td>
        </tr>
        <tr>
          <td>Делаешь fairness audit на protected attributes</td>
          <td>Нужна причинность («если изменить X, изменится Y»), а не корреляция — бери causal inference</td>
        </tr>
        <tr>
          <td>Команда понимает ограничения метода и не путает «вклад в модель» с «причину»</td>
          <td>Стейкхолдеры могут принять SHAP за «причину» и построить на этом вредные решения</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b>Permutation Importance.</b> Прост и быстр: перетасуй колонку и замерь падение метрики. Глобальный рейтинг фичей «из коробки», model-agnostic. Но только глобальный — нет локальных объяснений.</li>
        <li><b>LIME.</b> Локальный линейный surrogate вокруг конкретного примера. Работает с текстом, картинками, таблицами. Нестабилен (разные прогоны — разные ответы), но проще и быстрее SHAP в ряде задач.</li>
        <li><b>Integrated Gradients и Grad-CAM.</b> Для нейросетей (особенно CV) это более естественные инструменты интерпретации, чем DeepSHAP.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('decision-tree')">Прямая интерпретация простых моделей</a>.</b> Линейная регрессия, логрег, небольшие деревья — сами себе объяснение. Не городите SHAP там, где можно прочитать коэффициенты.</li>
        <li><b>Causal inference (DoWhy, EconML).</b> Если нужна причинность, а не корреляция — берите методы каузального анализа. SHAP для этого не предназначен.</li>
        <li><b>Counterfactual explanations.</b> «Что должно измениться, чтобы модель дала другой ответ» — иногда гораздо полезнее для клиента, чем разложение вклада.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=VB9uV-x0gtg" target="_blank">Shapley Additive Explanations (SHAP)</a> — интуиция за SHAP values на примерах</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=SHAP%20%D0%BE%D0%B1%D1%8A%D1%8F%D1%81%D0%BD%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D1%8C%20%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D0%B5%D0%B9" target="_blank">SHAP на Habr</a> — объяснение SHAP values с примерами кода на русском</li>
        <li><a href="https://christophm.github.io/interpretable-ml-book/" target="_blank">Interpretable Machine Learning (Christoph Molnar)</a> — открытая книга об интерпретируемости ML-моделей</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://shap.readthedocs.io/en/latest/" target="_blank">SHAP документация</a> — официальный гайд по библиотеке SHAP</li>
      </ul>
    `,
  },
});
