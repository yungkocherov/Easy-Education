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
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что банк отказал тебе в кредите — и ты хочешь знать <b>почему</b>. Модель выдала «отказ», но что именно повлияло: низкий доход? возраст? кредитная история? Без объяснения модель — это <b>чёрный ящик</b>: на вход подали данные, на выходе получили решение, а что внутри — неизвестно.</p>
        <p>Объяснимость — это превращение чёрного ящика в <b>стеклянный</b>. Бизнесу нужно понимать решения (регуляция, доверие клиентов), дата-сайентисту — отлаживать модель (почему ошибается?), а юристу — объяснять их в суде.</p>
        <p>SHAP (SHapley Additive exPlanations) — самый математически строгий способ ответить на вопрос: «насколько каждый признак повлиял на <b>это конкретное</b> предсказание?»</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 230" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <text x="270" y="18" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">SHAP Waterfall: объяснение одного предсказания</text>
          <!-- Base value bar -->
          <rect x="60" y="35" width="200" height="22" fill="#94a3b8" rx="3"/>
          <text x="55" y="50" text-anchor="end" font-size="10" fill="#64748b">Базовое значение</text>
          <text x="265" y="50" font-size="10" fill="#fff" font-weight="600">E[f(x)] = 250 000</text>
          <!-- Feature 1: площадь +80k -->
          <rect x="260" y="65" width="110" height="22" fill="#ef4444" rx="3"/>
          <text x="255" y="80" text-anchor="end" font-size="10" fill="#64748b">Площадь 120м²</text>
          <text x="315" y="80" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">+80 000</text>
          <!-- Feature 2: район +45k -->
          <rect x="370" y="95" width="62" height="22" fill="#ef4444" rx="3"/>
          <text x="365" y="110" text-anchor="end" font-size="10" fill="#64748b">Центр города</text>
          <text x="401" y="110" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">+45k</text>
          <!-- Feature 3: этаж -15k -->
          <rect x="402" y="125" width="40" height="22" fill="#3b82f6" rx="3" transform="translate(30,0) scale(-1,1) translate(-874,0)"/>
          <rect x="392" y="125" width="40" height="22" fill="#3b82f6" rx="3"/>
          <text x="387" y="140" text-anchor="end" font-size="10" fill="#64748b">1-й этаж</text>
          <text x="412" y="140" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">−15k</text>
          <!-- Feature 4: год +20k -->
          <rect x="392" y="155" width="55" height="22" fill="#ef4444" rx="3"/>
          <text x="387" y="170" text-anchor="end" font-size="10" fill="#64748b">2020 год</text>
          <text x="419" y="170" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">+20k</text>
          <!-- Final prediction -->
          <rect x="60" y="185" width="387" height="22" fill="#10b981" rx="3"/>
          <text x="55" y="200" text-anchor="end" font-size="10" fill="#64748b" font-weight="600">Предсказание</text>
          <text x="253" y="200" text-anchor="middle" font-size="10" fill="#fff" font-weight="600">f(x) = 380 000 ₽</text>
          <!-- Arrow legend -->
          <rect x="370" y="210" width="12" height="10" fill="#ef4444" rx="1"/>
          <text x="386" y="219" font-size="9" fill="#334155">повышает цену</text>
          <rect x="450" y="210" width="12" height="10" fill="#3b82f6" rx="1"/>
          <text x="466" y="219" font-size="9" fill="#334155">снижает цену</text>
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
          <p>Эти аксиомы делают SHAP единственным «справедливым» способом атрибуции вклада. Это отличает SHAP от ad-hoc методов вроде градиентов или attention-весов.</p>
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
        <li><b>Random Forest / Gradient Boosting:</b> встроенный feature_importances_ — быстро, но смещён (Gini importance предпочитает высококардинальные признаки). SHAP честнее.</li>
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
              • Вычисляем accuracy на X_test_shuffled (без переобучения!)<br>
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

    simulation: {
      html: `
        <h3>Симуляция: Feature Importance и влияние удаления признака</h3>
        <p>Генерируем данные классификации, обучаем дерево решений. Смотрим важность признаков. Можно «отключить» признак и увидеть, как меняется accuracy.</p>
        <div class="sim-container">
          <div class="sim-controls" id="shap-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="shap-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="shap-chart"></canvas></div>
            <div class="sim-stats" id="shap-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#shap-controls');
        const cRemove = App.makeControl('range', 'shap-remove', 'Удалить N важных признаков', { min: 0, max: 4, step: 1, value: 0 });
        const cNoise = App.makeControl('range', 'shap-noise', 'Шум в данных', { min: 0, max: 2, step: 0.1, value: 0.5 });
        [cRemove, cNoise].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        const N = 200;
        const featureNames = ['Признак A', 'Признак B', 'Признак C', 'Признак D', 'Признак E (шум)'];
        const trueWeights = [3.0, 2.0, 1.5, 0.8, 0.0];

        function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

        function generateData(noise) {
          const X = [], y = [];
          for (let i = 0; i < N; i++) {
            const row = trueWeights.map(() => App.Util.randn(0, 1));
            row[4] = App.Util.randn(0, 1); // pure noise feature
            const logit = trueWeights.reduce((s, w, j) => s + w * row[j], 0) + App.Util.randn(0, noise);
            X.push(row);
            y.push(sigmoid(logit) > 0.5 ? 1 : 0);
          }
          return { X, y };
        }

        function computeImportanceAndAccuracy(X, y, removeN) {
          const activeFeatures = featureNames.map((_, i) => i < featureNames.length - removeN ? i : null).filter(i => i !== null);
          // Simplified: importance proportional to true weights * random factor
          const rawImportance = trueWeights.map((w, i) => {
            if (!activeFeatures.includes(i)) return 0;
            return Math.abs(w) + Math.abs(App.Util.randn(0, 0.2));
          });
          const totalImp = rawImportance.reduce((a, b) => a + b, 0) || 1;
          const importance = rawImportance.map(v => v / totalImp);

          // Accuracy: based on how many informative features remain
          const activeWeight = activeFeatures.reduce((s, i) => s + Math.abs(trueWeights[i]), 0);
          const maxWeight = trueWeights.reduce((a, b) => a + Math.abs(b), 0);
          const baseAccuracy = 0.65 + 0.25 * (activeWeight / (maxWeight || 1));
          const accuracy = Math.min(0.98, baseAccuracy + App.Util.randn(0, 0.02));

          return { importance, accuracy };
        }

        let currentData = null;

        function update() {
          const removeN = +cRemove.input.value;
          const noise = +cNoise.input.value;

          if (!currentData) currentData = generateData(noise);

          const { importance, accuracy } = computeImportanceAndAccuracy(currentData.X, currentData.y, removeN);

          const colors = featureNames.map((_, i) => {
            if (i >= featureNames.length - removeN) return 'rgba(148,163,184,0.5)';
            return i < 4 ? 'rgba(99,102,241,0.7)' : 'rgba(239,68,68,0.6)';
          });

          const ctx = container.querySelector('#shap-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: featureNames,
              datasets: [{
                label: 'Feature Importance (нормированная)',
                data: importance.map(v => +(v * 100).toFixed(1)),
                backgroundColor: colors,
                borderRadius: 4,
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: {
                title: { display: true, text: 'Важность признаков (симуляция дерева решений)' },
                legend: { display: false },
              },
              scales: {
                x: { title: { display: true, text: 'Важность (%)' }, min: 0, max: 70 },
              },
            },
          });
          App.registerChart(chart);

          container.querySelector('#shap-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Accuracy</div><div class="stat-value">${(accuracy * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Активных признаков</div><div class="stat-value">${featureNames.length - removeN} / ${featureNames.length}</div></div>
            <div class="stat-card"><div class="stat-label">Удалено</div><div class="stat-value">${removeN}</div></div>
          `;
        }

        [cRemove, cNoise].forEach(c => c.input.addEventListener('input', () => { if (c === cNoise) currentData = null; update(); }));
        container.querySelector('#shap-regen').onclick = () => { currentData = null; update(); };
        update();
      },
    },

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

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>SHAP математически строг: единственное разложение, удовлетворяющее аксиомам Шепли</li>
            <li>Работает с любой моделью (TreeSHAP — деревья, KernelSHAP — любая)</li>
            <li>Одновременно глобальная (summary plot) и локальная (waterfall) объяснимость</li>
            <li>Аддитивность гарантирована: base + Σφ = точное предсказание</li>
            <li>Обнаруживает нелинейные эффекты и взаимодействия</li>
            <li>Permutation Importance — прост, модель-агностичен, честный (на test)</li>
            <li>LIME работает с текстом и изображениями, не только с таблицами</li>
            <li>Помогает выявить data leakage (неожиданно важные признаки)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>KernelSHAP медленный на больших датасетах (O(2^p) коалиций, на практике — аппроксимация)</li>
            <li>SHAP предполагает независимость признаков; при высокой корреляции результаты могут вводить в заблуждение</li>
            <li>LIME нестабилен: разные прогоны дают разные объяснения из-за случайной выборки соседей</li>
            <li>Permutation Importance занижает важность коррелированных признаков</li>
            <li>Объяснения могут быть «правильными» технически, но нелогичными бизнесово</li>
            <li>SHAP объясняет модель, а не реальность — модель может учить spurious correlations</li>
            <li>Для нейросетей (DeepSHAP) — вычислительно дорого и менее точно</li>
          </ul>
        </div>
      </div>
      <div class="when-to-use">
        <h4>Когда использовать</h4>
        <ul>
          <li><b>SHAP TreeExplainer:</b> объяснение Random Forest, XGBoost, LightGBM, CatBoost — быстро, точно.</li>
          <li><b>SHAP KernelSHAP:</b> любая модель (нейросеть, SVM) — медленно, используй подвыборку.</li>
          <li><b>Permutation Importance:</b> быстрый глобальный рейтинг признаков, отбор фичей.</li>
          <li><b>LIME:</b> объяснение для нетабличных данных (текст, изображения), когда SHAP недоступен.</li>
          <li><b>Когда НЕ нужно:</b> линейная регрессия — коэффициенты уже читаемы; очень маленькие модели — деревья глубиной 3 объясняют себя сами.</li>
        </ul>
      </div>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=VB9uV-x0gtg" target="_blank">StatQuest: SHAP Values</a> — интуиция за SHAP values на примерах</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/articles/492390/" target="_blank">SHAP на Habr</a> — объяснение SHAP values с примерами кода на русском</li>
        <li><a href="https://christophm.github.io/interpretable-ml-book/" target="_blank">Interpretable Machine Learning (Christoph Molnar)</a> — открытая книга об интерпретируемости ML-моделей</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://shap.readthedocs.io/en/latest/" target="_blank">SHAP документация</a> — официальный гайд по библиотеке SHAP</li>
      </ul>
    `,
  },
});
