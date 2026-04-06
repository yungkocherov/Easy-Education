/* ==========================================================================
   Регуляризация (L1, L2, Elastic Net)
   ========================================================================== */
App.registerTopic({
  id: 'regularization',
  category: 'ml-basics',
  title: 'Регуляризация',
  summary: 'L1, L2, ElasticNet — контроль сложности модели через штрафы.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты нанимаешь экспертов для предсказания погоды. У тебя 100 потенциальных «экспертов»: кто-то смотрит на облака, кто-то на давление, кто-то на лунный цикл. Без ограничений ты платишь всем по заслугам — и в итоге даёшь огромные деньги шарлатанам, которые «угадали» пару раз.</p>
        <p>Регуляризация — это правило: «плати за реальную ценность, но накажи за жадность». Ты вводишь штраф за <b>сумму зарплат</b>. Тогда эксперты с маленьким вкладом получат ноль (или почти ноль), а только лучшие — реальные деньги. Модель становится проще, надёжнее и меньше зависит от случайных совпадений.</p>
      </div>

      <h3>Зачем нужна регуляризация</h3>
      <p>Когда признаков много или данных мало, модель склонна <b>подгоняться под шум</b>. Она находит «закономерности», которых на самом деле нет. Веса модели становятся огромными, чтобы компенсировать друг друга: один +1000, другой −998, вместе они угадывают обучающую выборку, но катастрофически ошибаются на новых данных.</p>
      <p>Это классический <span class="term" data-tip="Overfitting. Переобучение. Модель учит не общий закон, а шум обучающих данных. Плохо работает на новых примерах.">overfitting</span>. Регуляризация — один из главных способов с ним бороться.</p>

      <h3>Базовая идея</h3>
      <p>К обычной функции потерь добавляем <b>штраф за сложность</b> модели:</p>
      <div class="math-block">$$L_{\\text{reg}}(\\mathbf{w}) = L_{\\text{data}}(\\mathbf{w}) + \\lambda \\cdot R(\\mathbf{w})$$</div>

      <ul>
        <li>$L_{\\text{data}}$ — обычная функция потерь (MSE, log-loss и т.д.).</li>
        <li>$R(\\mathbf{w})$ — <b>штраф</b> за «большие» веса.</li>
        <li>$\\lambda$ — гиперпараметр силы штрафа.</li>
      </ul>

      <p>Теперь модель ищет компромисс: хочется минимизировать ошибку (маленький data loss), но и не хочется больших весов (маленький штраф). Чем больше $\\lambda$, тем сильнее модель «жмётся к нулю».</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Регуляризация — это <b>управление сложностью модели</b> через гиперпараметр $\\lambda$. Маленькое $\\lambda$ → модель гибкая (risk overfitting). Большое $\\lambda$ → модель жёсткая (risk underfitting). Оптимальное $\\lambda$ подбирается через кросс-валидацию.</p>
      </div>

      <h3>L2-регуляризация (Ridge)</h3>
      <div class="math-block">$$R(\\mathbf{w}) = \\|\\mathbf{w}\\|_2^2 = \\sum_j w_j^2$$</div>

      <p>Штрафуем <b>сумму квадратов</b> весов. Называется «Ridge» (гребень) в регрессии.</p>

      <p><b>Что делает:</b> сжимает все веса пропорционально. Не зануляет их, но делает меньше. Веса, за которые «платится» большая цена, уменьшаются.</p>

      <p><b>Особенности:</b></p>
      <ul>
        <li>Все признаки остаются в модели.</li>
        <li>Функция гладкая, есть аналитическое решение.</li>
        <li>Хорошо справляется с <span class="term" data-tip="Multicollinearity. Ситуация, когда признаки сильно коррелируют между собой. Делает оценки весов нестабильными.">мультиколлинеарностью</span>.</li>
        <li>Легко оптимизируется градиентными методами.</li>
      </ul>

      <p><b>Когда использовать:</b> когда ожидаешь, что все признаки важны (хотя бы немного).</p>

      <h3>L1-регуляризация (Lasso)</h3>
      <div class="math-block">$$R(\\mathbf{w}) = \\|\\mathbf{w}\\|_1 = \\sum_j |w_j|$$</div>

      <p>Штрафуем <b>сумму модулей</b> весов. Называется «Lasso» (Least Absolute Shrinkage and Selection Operator).</p>

      <p><b>Что делает:</b> в отличие от L2, <b>зануляет</b> часть весов полностью. Признаки с нулевыми весами фактически исключаются из модели.</p>

      <p><b>Особенности:</b></p>
      <ul>
        <li>Автоматический <span class="term" data-tip="Feature Selection. Процесс выбора наиболее важных признаков. L1 делает его автоматически, зануляя веса ненужных признаков.">feature selection</span>.</li>
        <li>Модель становится <b>разреженной</b> (sparse).</li>
        <li>Не дифференцируема в нуле — сложнее оптимизация.</li>
        <li>При коррелированных признаках произвольно выбирает один из них.</li>
      </ul>

      <p><b>Когда использовать:</b> когда хочешь найти несколько самых важных признаков из большого набора.</p>

      <h3>Почему L1 зануляет, а L2 — нет</h3>
      <p>Это красивый геометрический факт. При поиске оптимума с ограничением «штраф ≤ C» модель ищет ближайшую точку к минимуму на поверхности штрафа:</p>
      <ul>
        <li>L2: граница — <b>круг</b> (в 2D), сфера (в высоких измерениях). Оптимум попадает куда угодно, в общем случае все компоненты ненулевые.</li>
        <li>L1: граница — <b>ромб</b> (в 2D), «октаэдр» (в высоких измерениях). У ромба есть <b>углы</b> на координатных осях. Оптимум часто попадает в угол, где одна координата равна нулю.</li>
      </ul>

      <p>Именно поэтому L1 даёт разреженные решения: «уголки» ромба лежат на осях координат.</p>

      <h3>Elastic Net — комбинация обеих</h3>
      <div class="math-block">$$R(\\mathbf{w}) = \\alpha \\|\\mathbf{w}\\|_1 + (1 - \\alpha) \\|\\mathbf{w}\\|_2^2$$</div>

      <p>Смешивает L1 и L2 в пропорции $\\alpha$. Даёт разреженность от L1 и устойчивость от L2.</p>

      <p><b>Когда использовать:</b> при сильно коррелированных признаках, когда чистый L1 ведёт себя нестабильно (выбирает произвольный признак из группы).</p>

      <h3>Настройка λ</h3>
      <p>Гиперпараметр $\\lambda$ подбирается через CV:</p>
      <ul>
        <li>Перебираем λ на логарифмической сетке: [0.001, 0.01, 0.1, 1, 10, 100].</li>
        <li>Для каждого значения — K-Fold CV.</li>
        <li>Выбираем λ с лучшей средней метрикой.</li>
      </ul>

      <p>В sklearn часто используется <b>C = 1/λ</b> (inverse regularization). Тогда большой C = слабая регуляризация.</p>

      <p><b>1-SE rule:</b> иногда выбирают не оптимальное λ, а наибольшее λ в пределах одного стандартного отклонения от минимума. Это даёт более простую модель с почти таким же качеством.</p>

      <h3>Обязательно — стандартизация признаков</h3>
      <p>Регуляризация штрафует <b>все</b> веса одинаково. Но если один признак измеряется в миллиметрах, а другой в километрах — коэффициенты будут сильно разного порядка, и штраф будет несправедливым.</p>

      <p><b>Правило:</b> перед регуляризированной моделью <b>всегда</b> применяй <span class="term" data-tip="StandardScaler. Преобразует признаки так, чтобы среднее было 0, а стандартное отклонение 1. Обязательно перед регуляризацией и многими другими моделями.">StandardScaler</span> ($x \\to (x - \\mu)/\\sigma$). Только тогда λ имеет смысл.</p>

      <h3>Регуляризация в других моделях</h3>
      <p>Регуляризация есть <b>везде</b>, но под разными названиями:</p>
      <ul>
        <li><b>Логистическая регрессия</b> — L1/L2 встроены.</li>
        <li><b>SVM</b> — параметр C управляет регуляризацией.</li>
        <li><b>Нейросети</b> — <span class="term" data-tip="Weight decay. То же, что L2-регуляризация, но в контексте нейросетей. Штрафует большие веса.">weight decay</span> = L2.</li>
        <li><b>Деревья</b> — min_samples_split, max_depth.</li>
        <li><b>Бустинг</b> — η (learning rate), регуляризация листьев в XGBoost.</li>
        <li><b>Dropout в нейросетях</b> — стохастическая регуляризация.</li>
        <li><b>Early stopping</b> — регуляризация через ограничение обучения.</li>
      </ul>

      <h3>Частые заблуждения</h3>
      <ul>
        <li><b>«Больше λ = лучше»</b> — нет. Слишком большой λ даёт underfit.</li>
        <li><b>«L1 всегда лучше L2 из-за feature selection»</b> — L1 нестабилен при коррелированных признаках.</li>
        <li><b>«Регуляризация не нужна при большом наборе данных»</b> — часто всё равно улучшает обобщение.</li>
        <li><b>«Нужно стандартизировать таргет»</b> — только признаки! (Хотя для некоторых задач нормализация y тоже помогает.)</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: байесовская интерпретация</summary>
        <div class="deep-dive-body">
          <p>Регуляризация имеет красивую <b>байесовскую</b> интерпретацию:</p>
          <ul>
            <li><b>L2 = гауссовский prior</b> на веса: $w_j \\sim N(0, \\sigma^2)$. Чем меньше $\\sigma$, тем сильнее регуляризация.</li>
            <li><b>L1 = лапласовский prior</b>: $w_j \\sim \\text{Laplace}(0, b)$. Лапласовское распределение имеет острый пик в нуле — отсюда разреженность.</li>
          </ul>
          <p>MAP-оценка (максимум апостериорной вероятности) с таким prior даёт <b>регуляризованную</b> задачу оптимизации. Так что регуляризация — это «мягкое» априорное мнение о параметрах.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: L0-регуляризация</summary>
        <div class="deep-dive-body">
          <p>L0-«норма» — это просто <b>число ненулевых весов</b>: $\\|\\mathbf{w}\\|_0 = \\#\\{j : w_j \\neq 0\\}$.</p>
          <p>L0-регуляризация напрямую контролирует разреженность, но оптимизация — NP-hard задача. L1 — удобная выпуклая аппроксимация L0.</p>
          <p>В некоторых случаях используют жадный перебор или специализированные алгоритмы (LARS) для приближения L0.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: dropout как регуляризация</summary>
        <div class="deep-dive-body">
          <p>В нейросетях <span class="term" data-tip="Dropout. Техника регуляризации: во время обучения случайно 'выключаются' часть нейронов с вероятностью p.">Dropout</span> случайно «выключает» нейроны при обучении с вероятностью p. Это как обучение ансамбля из $2^n$ подсетей и усреднение.</p>
          <p>Эффект похож на L2: предотвращает ко-адаптацию нейронов и переобучение. На inference dropout не применяется.</p>
        </div>
      </div>

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>Bias-variance</b> — регуляризация снижает variance ценой небольшого bias.</li>
        <li><b>Cross-validation</b> — основной инструмент подбора λ.</li>
        <li><b>Feature selection</b> — L1 делает его автоматически.</li>
        <li><b>Байесовские модели</b> — регуляризация эквивалентна prior.</li>
        <li><b>Все модели с весами</b> — линейные, логистические, SVM, нейросети — имеют свою регуляризацию.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Ridge: сжатие весов при L2',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Линейная регрессия с 4 признаками предсказывает цену квартиры. Без регуляризации модель переобучена. Применим Ridge (L2) с разными значениями λ и посмотрим, как меняются веса. Признаки: площадь, этаж, год постройки, расстояние до метро.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Признак</th><th>w (без регул.)</th><th>Ridge λ=0.1</th><th>Ridge λ=1.0</th><th>Ridge λ=10.0</th></tr>
              <tr><td>Площадь (м²)</td><td>12.50</td><td>11.80</td><td>8.70</td><td>3.20</td></tr>
              <tr><td>Этаж</td><td>0.85</td><td>0.80</td><td>0.55</td><td>0.18</td></tr>
              <tr><td>Год постройки</td><td>-3.20</td><td>-3.00</td><td>-2.10</td><td>-0.75</td></tr>
              <tr><td>До метро (мин)</td><td>-8.90</td><td>-8.40</td><td>-6.20</td><td>-2.30</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Понимаем механизм Ridge: что оптимизируется</h4>
            <div class="calc">Без регуляризации: минимизируем только MSE
  L(w) = MSE(w) = (1/n) * sum(y_i - w*x_i)^2

Ridge добавляет штраф:
  L_ridge(w) = MSE(w) + lambda * sum(w_j^2)

При lambda=1.0, текущие веса w=[12.5, 0.85, -3.2, -8.9]:
  MSE штраф = ... (зависит от данных)
  L2 штраф = 1.0 * (12.5^2 + 0.85^2 + 3.2^2 + 8.9^2)
           = 1.0 * (156.25 + 0.72 + 10.24 + 79.21)
           = 1.0 * 246.42 = 246.42

Оптимизатор вынужден снижать большие веса!</div>
            <div class="why">Штраф пропорционален квадрату весов. Большой вес (например, 12.5) вносит огромный штраф (156.25). Чтобы уменьшить штраф, модель сжимает вес. Но полностью до нуля не обнулит — квадратичная функция никогда не даёт точно ноль при конечном lambda.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Сравниваем эффект для разных lambda</h4>
            <div class="calc">Признак "Площадь" (наибольший вес):
  lambda=0.0 (без регул.): w = 12.50
  lambda=0.1:              w = 11.80  (сжатие на 5.6%)
  lambda=1.0:              w =  8.70  (сжатие на 30.4%)
  lambda=10.0:             w =  3.20  (сжатие на 74.4%)

Признак "Этаж" (маленький вес):
  lambda=0.0: w = 0.85
  lambda=0.1: w = 0.80  (сжатие на 5.9%)
  lambda=1.0: w = 0.55  (сжатие на 35.3%)
  lambda=10.0:w = 0.18  (сжатие на 78.8%)</div>
            <div class="why">Ключевое наблюдение: все признаки сжимаются пропорционально, но НИ ОДИН не обнуляется. Ridge «выключает» признаки частично — делает их менее влиятельными, но не удаляет из модели. Даже при lambda=10 все 4 признака остаются в игре.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем L2-штраф при разных lambda</h4>
            <div class="calc">Норма весов ||w||^2 при разных lambda:

lambda=0.0: ||w||^2 = 12.5^2 + 0.85^2 + 3.2^2 + 8.9^2 = 246.4
lambda=0.1: ||w||^2 = 11.8^2 + 0.8^2 + 3.0^2 + 8.4^2  = 219.2
lambda=1.0: ||w||^2 =  8.7^2 + 0.55^2+ 2.1^2 + 6.2^2  = 118.7
lambda=10.0:||w||^2 =  3.2^2 + 0.18^2+ 0.75^2+ 2.3^2  =  16.1

Суммарный L2 штраф:
  lambda=0.1:  0.1 * 219.2 = 21.9
  lambda=1.0:  1.0 * 118.7 = 118.7
  lambda=10.0: 10.0 * 16.1 = 161.0</div>
            <div class="why">Интересно: при lambda=10 штраф сам по себе больше (161 vs 118 при lambda=1), но ВЕСОВЫЕ нормы меньше. Это компромисс: модель согласна иметь большую сумму штрафов в денежных единицах, но уменьшает сами веса, снижая риск переобучения.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Влияние на train и val ошибки (MSE)</h4>
            <div class="calc">         Train MSE   Val MSE   Разрыв
lambda=0.0:  0.8       8.5       7.7   (overfit!)
lambda=0.1:  0.9       6.2       5.3
lambda=1.0:  1.4       2.8       1.4   (оптимум?)
lambda=10.0: 3.2       3.6       0.4   (underfit начинается?)
lambda=100:  8.9       9.1       0.2   (явный underfit)

Оптимальный lambda ~1.0: val MSE минимален</div>
            <div class="why">Классическая кривая: при росте lambda train MSE растёт (теряем качество на train), val MSE сначала падает (борьба с overfit), потом растёт (underfit). Минимум val MSE = оптимальный lambda. Подбирать через CV.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Ridge сжимает все веса пропорционально, но никогда не обнуляет их.</p>
            <p>Сжатие тем сильнее, чем больше lambda: при lambda=10 вес "Площадь" сжался с 12.5 до 3.2 (на 74%).</p>
            <p>Оптимальный lambda ≈ <b>1.0</b> — минимальный val MSE = 2.8.</p>
          </div>

          <div class="lesson-box">Ridge (L2) сжимает все веса, оставляя все признаки в модели. Это хорошо при мультиколлинеарности: когда признаки коррелируют, OLS не может выбрать один — Ridge распределяет вес между ними. Lambda подбирается через CV по логарифмической сетке [0.001, 0.01, 0.1, 1, 10, 100].</div>
        `
      },
      {
        title: 'Lasso: занулёние нерелевантных признаков',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Модель предсказывает кредитный риск. Есть <b>6 признаков</b>: 3 реально влияющих и 3 шумовых. Сравните, что делают Ridge (L2) и Lasso (L1) с шумовыми признаками при lambda=1.0.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Признак</th><th>Тип</th><th>w (без регул.)</th><th>Ridge λ=1.0</th><th>Lasso λ=1.0</th></tr>
              <tr><td>Доход</td><td>Важный</td><td>5.80</td><td>4.20</td><td>3.90</td></tr>
              <tr><td>Долг/доход</td><td>Важный</td><td>-4.30</td><td>-3.10</td><td>-2.85</td></tr>
              <tr><td>История платежей</td><td>Важный</td><td>3.10</td><td>2.20</td><td>1.95</td></tr>
              <tr><td>Цвет машины</td><td>Шумовой</td><td>0.42</td><td>0.28</td><td>0.00</td></tr>
              <tr><td>Порядковый номер</td><td>Шумовой</td><td>-0.31</td><td>-0.20</td><td>0.00</td></tr>
              <tr><td>Дата рождения</td><td>Шумовой</td><td>0.18</td><td>0.11</td><td>0.00</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Почему L1 обнуляет, а L2 нет: геометрическая причина</h4>
            <div class="calc">L2 штраф: lambda * (w1^2 + w2^2) — круговые линии уровня
L1 штраф: lambda * (|w1| + |w2|) — ромбовые линии уровня

Геометрически: решение находится в точке касания
эллипсоидов функции потерь с "шаровой" (L2) или "ромбовой" (L1) областью.

Ромб имеет острые УГЛЫ на осях (w1=0 или w2=0).
Вероятность касания на оси (обнуление) — высокая!

Круг не имеет углов — касание происходит не на оси.
Вероятность точного обнуления — нулевая!</div>
            <div class="why">Вот математическая причина разного поведения L1 и L2. L1-штраф создаёт "острые углы" в пространстве ограничений — оптимум часто попадает именно туда, что соответствует нулевым весам.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Проверяем: что происходит с шумовыми признаками</h4>
            <div class="calc">Шумовые признаки (маленький вес в модели без регул.):

"Цвет машины" (w=0.42):
  Ridge: 0.42 -> 0.28  (сжатие на 33%, остался!)
  Lasso: 0.42 -> 0.00  (полностью занулён!)

"Порядковый номер" (w=-0.31):
  Ridge: -0.31 -> -0.20  (остался, вес 65% от исходного)
  Lasso: -0.31 -> 0.00   (занулён!)

"Дата рождения" (w=0.18):
  Ridge: 0.18 -> 0.11  (ещё там!)
  Lasso: 0.18 -> 0.00  (занулён!)</div>
            <div class="why">Lasso занулил все три шумовых признака! Ridge только уменьшил их, но они остались в модели. Это делает Lasso инструментом автоматического feature selection — он "выключает" нерелевантные признаки.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Считаем штрафы: как L1 "выгодно" занулять</h4>
            <div class="calc">Для признака "Цвет машины" (w=0.42):

L2 при w=0.42: штраф = 1.0 * 0.42^2 = 0.176
L2 при w=0.28: штраф = 1.0 * 0.28^2 = 0.078  (уменьшили)
L2 при w=0.00: штраф = 1.0 * 0.00^2 = 0.000  (максимум!)

L1 при w=0.42: штраф = 1.0 * |0.42| = 0.420
L1 при w=0.28: штраф = 1.0 * |0.28| = 0.280
L1 при w=0.00: штраф = 1.0 * |0.00| = 0.000  (максимум!)

Для L2: выгода от обнуления (0.176) vs потери точности.
Для L1: выгода от обнуления (0.420) БОЛЬШЕ.
При маленьких весах L1 "охотнее" зануляет.</div>
            <div class="why">Это ключевое: штраф L1 линейный по |w|, штраф L2 квадратичный. При маленьких w квадрат намного меньше модуля — поэтому L2 не "спешит" обнулять маленькие веса, а L1 делает это охотно.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сравнение: сколько признаков остаётся</h4>
            <div class="calc">           lambda=0.1  lambda=1.0  lambda=10.0
Ridge:       6/6         6/6          6/6   (все всегда остаются)
Lasso:       5/6         3/6          1/6   (разреженность растёт)

При lambda=1.0:
  Ridge: все 6 признаков активны
  Lasso: 3 признака активны, 3 занулены

При lambda=10.0:
  Lasso: только 1 признак (Доход) — самый важный!</div>
            <div class="why">Lasso автоматически выбирает количество активных признаков через lambda. Это встроенный feature selection — не нужен отдельный этап отбора признаков. При lambda=10 модель выбрала только самый важный признак.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Ridge (L2): все 6 признаков остаются, но шумовые сжимаются с 0.42 до 0.28, -0.31 до -0.20, 0.18 до 0.11.</p>
            <p>Lasso (L1): 3 шумовых признака <b>полностью занулены</b> = 0.00. В модели остаются только Доход, Долг/доход, История платежей.</p>
            <p>Lasso = автоматический feature selection через обнуление.</p>
          </div>

          <div class="lesson-box">Lasso (L1) обнуляет веса шумовых признаков — это встроенный feature selection. Ridge (L2) только сжимает, все признаки остаются. Правило: когда подозреваешь, что большинство признаков нерелевантны — используй Lasso. Когда все признаки важны и коррелируют — Ridge. Elastic Net объединяет оба.</div>
        `
      },
      {
        title: 'Подбор lambda через кросс-валидацию',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Обучаем Ridge-регрессию для предсказания стоимости недвижимости. Нужно выбрать оптимальное lambda из сетки [0.01, 0.1, 1, 10, 100] через 5-Fold CV. Покажите процесс и выберите лучшее lambda.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>lambda</th><th>Fold 1 MSE</th><th>Fold 2 MSE</th><th>Fold 3 MSE</th><th>Fold 4 MSE</th><th>Fold 5 MSE</th><th>Mean MSE</th><th>Std</th></tr>
              <tr><td>0.01</td><td>8.2</td><td>12.1</td><td>7.8</td><td>14.5</td><td>9.3</td><td>10.38</td><td>2.68</td></tr>
              <tr><td>0.10</td><td>6.5</td><td>8.3</td><td>6.1</td><td>9.4</td><td>7.2</td><td>7.50</td><td>1.33</td></tr>
              <tr><td>1.00</td><td>4.8</td><td>5.2</td><td>4.6</td><td>5.5</td><td>5.0</td><td>5.02</td><td>0.35</td></tr>
              <tr><td>10.0</td><td>5.1</td><td>5.3</td><td>5.0</td><td>5.4</td><td>5.2</td><td>5.20</td><td>0.16</td></tr>
              <tr><td>100</td><td>9.8</td><td>10.1</td><td>9.5</td><td>10.3</td><td>9.9</td><td>9.92</td><td>0.30</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Понимаем структуру GridSearch по lambda</h4>
            <div class="calc">Для каждого из 5 значений lambda:
  Прогоняем 5-Fold CV на обучающей выборке
  Получаем 5 значений MSE (по одному на fold)
  Считаем Mean MSE и Std

Итого моделей обучено: 5 lambda * 5 folds = 25 моделей

Ищем lambda с минимальным Mean MSE на валидации.
Std важен тоже: меньше std = стабильнее результат.</div>
            <div class="why">В sklearn это делается через RidgeCV или GridSearchCV. Логарифмическая сетка [0.01, 0.1, 1, 10, 100] — стандартная отправная точка: каждый шаг — умножение на 10. Это покрывает 4 порядка величины.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Анализируем lambda=0.01: недорегуляризация</h4>
            <div class="calc">lambda=0.01: Mean MSE=10.38, Std=2.68

Высокий Mean MSE — большая ошибка предсказания
Высокий Std — нестабильный результат (от 7.8 до 14.5!)

Почему так:
  lambda слишком мал — почти нет регуляризации
  Модель переобучена (high variance)
  Разные фолды дают очень разные результаты</div>
            <div class="why">При маленьком lambda модель ведёт себя как без регуляризации. Разные фолды (то есть разные обучающие выборки) дают разные модели — это высокая variance. Std=2.68 показывает нестабильность.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Анализируем lambda=100: перерегуляризация</h4>
            <div class="calc">lambda=100: Mean MSE=9.92, Std=0.30

Высокий Mean MSE — модель слишком простая
Очень низкий Std=0.30 — но это плохая стабильность!

Почему так:
  lambda слишком велик — все веса сжаты почти в ноль
  Модель недообучена (high bias)
  Все фолды дают похожий результат — но все плохие!

Аналогия: модель "всегда предсказывает среднее" — стабильно, но плохо.</div>
            <div class="why">Перерегуляризация — обратная проблема: модель настолько "зажата", что не может выучить реальные закономерности. Низкий Std — это не достижение: это значит, что все одинаково плохи.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Выбор оптимального lambda</h4>
            <div class="calc">Ранжируем по Mean MSE (меньше — лучше):
  lambda=1.0:   Mean=5.02, Std=0.35  <- лучший по Mean MSE
  lambda=10.0:  Mean=5.20, Std=0.16
  lambda=0.10:  Mean=7.50, Std=1.33
  lambda=0.01:  Mean=10.38, Std=2.68
  lambda=100:   Mean=9.92, Std=0.30

Правило 1-SE: лучший = lambda=1.0 (Mean=5.02)
  SE = 0.35/sqrt(5) = 0.156
  Порог: 5.02 + 0.156 = 5.176
  lambda=10.0 имеет Mean=5.20 > 5.176 — не проходит
  lambda=1.0 остаётся победителем</div>
            <div class="why">Правило 1-SE: если более простая модель (большее lambda) не хуже лучшей на величину одного SE — выбираем более простую. Здесь lambda=10 чуть хуже порога, поэтому выбираем lambda=1.0 как прямого победителя.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Финальный этап после выбора lambda</h4>
            <div class="calc">Выбранный lambda = 1.0

Действия:
1. Переобучить Ridge(lambda=1.0) на ВСЁМ обучающем датасете
   (не на 4/5 фолда, а на 100% train данных)
2. Оценить финальную модель на TEST SET (один раз!)
3. Зафиксировать результат

Финальный test MSE = 4.85
(лучше среднего CV=5.02, что нормально — больше данных для обучения)</div>
            <div class="why">После выбора lambda через CV финальная модель обучается на ВСЕХ доступных обучающих данных — это даёт лучшее качество. Test set используется ровно один раз в самом конце для честной оценки.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>GridSearch по сетке [0.01, 0.1, 1, 10, 100] с 5-Fold CV = 25 обученных моделей.</p>
            <p>Победитель: <b>lambda = 1.0</b> — Mean CV MSE = 5.02 ± 0.35.</p>
            <p>lambda=0.01 переобучена (MSE=10.38, Std=2.68). lambda=100 недообучена (MSE=9.92).</p>
            <p>Финальный test MSE после переобучения на всём train: <b>4.85</b>.</p>
          </div>

          <div class="lesson-box">Алгоритм подбора lambda: 1) логарифмическая сетка значений; 2) 5-Fold CV для каждого; 3) выбор минимума Mean MSE (или по правилу 1-SE); 4) финальное обучение на всём train; 5) оценка на test — один раз. В sklearn: RidgeCV делает это автоматически.</div>
        `
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: как λ влияет на веса</h3>
        <p>Полиномиальная регрессия с регуляризацией. Увеличивай λ и смотри, как сжимаются веса.</p>
        <div class="sim-container">
          <div class="sim-controls" id="reg-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="reg-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="reg-fit"></canvas></div>
              <div class="sim-chart-wrap" style="height:300px;"><canvas id="reg-weights"></canvas></div>
            </div>
            <div class="sim-stats" id="reg-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#reg-controls');
        const cLam = App.makeControl('range', 'reg-lam', 'log₁₀(λ)', { min: -5, max: 3, step: 0.1, value: -2 });
        const cType = App.makeControl('select', 'reg-type', 'Тип', {
          options: [{ value: 'l2', label: 'L2 (Ridge)' }, { value: 'l1', label: 'L1 (Lasso)' }, { value: 'none', label: 'Без регуляризации' }],
          value: 'l2',
        });
        const cDeg = App.makeControl('range', 'reg-deg', 'Степень полинома', { min: 3, max: 15, step: 1, value: 10 });
        const cNoise = App.makeControl('range', 'reg-noise', 'Шум', { min: 0, max: 0.8, step: 0.05, value: 0.3 });
        const cN = App.makeControl('range', 'reg-n', 'Точек', { min: 10, max: 80, step: 5, value: 20 });
        [cLam, cType, cDeg, cNoise, cN].forEach(c => controls.appendChild(c.wrap));

        let fitChart = null, wChart = null;
        let xTrain = [], yTrain = [];

        function truefn(x) { return Math.sin(1.5 * x); }

        function regen() {
          const n = +cN.input.value, noise = +cNoise.input.value;
          xTrain = []; yTrain = [];
          for (let i = 0; i < n; i++) {
            const x = -3 + 6 * Math.random();
            xTrain.push(x); yTrain.push(truefn(x) + App.Util.randn(0, noise));
          }
          update();
        }

        // Решение ridge: (X^T X + λI) w = X^T y
        function fitRidge(xs, ys, deg, lam) {
          const n = xs.length, p = deg + 1;
          const X = xs.map(x => { const row = []; for (let d = 0; d <= deg; d++) row.push(Math.pow(x, d)); return row; });
          const A = Array.from({ length: p }, () => new Array(p).fill(0));
          const b = new Array(p).fill(0);
          for (let i = 0; i < n; i++) {
            for (let r = 0; r < p; r++) {
              for (let c = 0; c < p; c++) A[r][c] += X[i][r] * X[i][c];
              b[r] += X[i][r] * ys[i];
            }
          }
          for (let r = 0; r < p; r++) A[r][r] += lam;
          // Gauss elim
          for (let i = 0; i < p; i++) {
            let mx = i;
            for (let k = i + 1; k < p; k++) if (Math.abs(A[k][i]) > Math.abs(A[mx][i])) mx = k;
            [A[i], A[mx]] = [A[mx], A[i]]; [b[i], b[mx]] = [b[mx], b[i]];
            for (let k = i + 1; k < p; k++) {
              const f = A[k][i] / A[i][i];
              for (let j = i; j < p; j++) A[k][j] -= f * A[i][j];
              b[k] -= f * b[i];
            }
          }
          const w = new Array(p).fill(0);
          for (let i = p - 1; i >= 0; i--) {
            let s = b[i];
            for (let j = i + 1; j < p; j++) s -= A[i][j] * w[j];
            w[i] = s / A[i][i];
          }
          return w;
        }

        // Coordinate descent для Lasso
        function fitLasso(xs, ys, deg, lam) {
          const n = xs.length, p = deg + 1;
          const X = xs.map(x => { const row = []; for (let d = 0; d <= deg; d++) row.push(Math.pow(x, d)); return row; });
          // нормализация колонок
          const scales = new Array(p).fill(0);
          for (let j = 0; j < p; j++) {
            let s = 0; for (let i = 0; i < n; i++) s += X[i][j] * X[i][j];
            scales[j] = Math.sqrt(s / n) || 1;
            for (let i = 0; i < n; i++) X[i][j] /= scales[j];
          }
          const w = new Array(p).fill(0);
          const r = [...ys];
          for (let it = 0; it < 500; it++) {
            let maxDiff = 0;
            for (let j = 0; j < p; j++) {
              let num = 0, den = 0;
              for (let i = 0; i < n; i++) {
                const rij = r[i] + w[j] * X[i][j];
                num += X[i][j] * rij;
                den += X[i][j] * X[i][j];
              }
              num /= n; den /= n;
              const wj_old = w[j];
              // soft threshold
              const thr = lam;
              let wj_new;
              if (num > thr) wj_new = (num - thr) / den;
              else if (num < -thr) wj_new = (num + thr) / den;
              else wj_new = 0;
              if (j === 0) wj_new = num / den; // не штрафуем intercept
              const d = wj_new - wj_old;
              if (Math.abs(d) > maxDiff) maxDiff = Math.abs(d);
              for (let i = 0; i < n; i++) r[i] -= d * X[i][j];
              w[j] = wj_new;
            }
            if (maxDiff < 1e-6) break;
          }
          // деномализуем
          return w.map((v, j) => v / scales[j]);
        }

        function predict(w, x) { let s = 0; for (let d = 0; d < w.length; d++) s += w[d] * Math.pow(x, d); return s; }

        function update() {
          const type = cType.input.value;
          const deg = +cDeg.input.value;
          const lam = Math.pow(10, +cLam.input.value);
          let w;
          if (type === 'none') w = fitRidge(xTrain, yTrain, deg, 1e-8);
          else if (type === 'l2') w = fitRidge(xTrain, yTrain, deg, lam);
          else w = fitLasso(xTrain, yTrain, deg, lam);

          const gridX = App.Util.linspace(-3, 3, 200);
          const ctx = container.querySelector('#reg-fit').getContext('2d');
          if (fitChart) fitChart.destroy();
          fitChart = new Chart(ctx, {
            type: 'scatter',
            data: {
              datasets: [
                { label: 'Train', data: xTrain.map((x, i) => ({ x, y: yTrain[i] })), backgroundColor: 'rgba(59,130,246,0.5)', pointRadius: 3 },
                { type: 'line', label: 'True', data: gridX.map(x => ({ x, y: truefn(x) })), borderColor: '#94a3b8', borderWidth: 2, pointRadius: 0, fill: false, borderDash: [5, 5] },
                { type: 'line', label: 'Модель', data: gridX.map(x => ({ x, y: predict(w, x) })), borderColor: '#dc2626', borderWidth: 2.5, pointRadius: 0, fill: false },
              ],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { position: 'top' } },
              scales: { x: { type: 'linear', min: -3.5, max: 3.5 }, y: { min: -3, max: 3 } },
            },
          });
          App.registerChart(fitChart);

          const ctx2 = container.querySelector('#reg-weights').getContext('2d');
          if (wChart) wChart.destroy();
          wChart = new Chart(ctx2, {
            type: 'bar',
            data: {
              labels: w.map((_, i) => `w${i}`),
              datasets: [{ data: w, backgroundColor: w.map(v => Math.abs(v) < 1e-5 ? 'rgba(148,163,184,0.3)' : 'rgba(99,102,241,0.7)') }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, title: { display: true, text: 'Веса модели' } },
              scales: { y: { title: { display: true, text: 'Значение' } } },
            },
          });
          App.registerChart(wChart);

          let trainErr = 0; xTrain.forEach((x, i) => { trainErr += (yTrain[i] - predict(w, x)) ** 2; }); trainErr /= xTrain.length;
          const nonZero = w.filter(v => Math.abs(v) > 1e-5).length;
          const norm = Math.sqrt(w.reduce((s, v) => s + v * v, 0));

          container.querySelector('#reg-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">λ</div><div class="stat-value">${lam.toExponential(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Train MSE</div><div class="stat-value">${trainErr.toFixed(4)}</div></div>
            <div class="stat-card"><div class="stat-label">‖w‖₂</div><div class="stat-value">${norm.toFixed(2)}</div></div>
            <div class="stat-card"><div class="stat-label">Ненулевых весов</div><div class="stat-value">${nonZero}/${w.length}</div></div>
          `;
        }

        [cLam, cDeg, cType].forEach(c => c.input.addEventListener('input', update));
        [cN, cNoise].forEach(c => c.input.addEventListener('change', regen));
        container.querySelector('#reg-regen').onclick = regen;
        regen();
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Линейная регрессия с многими признаками</b> — борьба с overfit.</li>
        <li><b>Feature selection</b> — L1 сам выбирает важные.</li>
        <li><b>Логистическая регрессия</b> — встроенная регуляризация.</li>
        <li><b>SVM</b> — параметр C управляет регуляризацией.</li>
        <li><b>Нейросети</b> — L2 (weight decay), dropout.</li>
        <li><b>Градиентный бустинг</b> — λ, α для листьев в XGBoost.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Борется с overfitting</li>
            <li>Улучшает обобщение</li>
            <li>L1 даёт feature selection</li>
            <li>L2 стабилизирует мультиколлинеарность</li>
            <li>Уменьшает чувствительность к шуму</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Требует настройки λ</li>
            <li>Слишком сильная регуляризация → underfit</li>
            <li>L1 нестабилен при коррелированных признаках</li>
            <li>Нужна стандартизация признаков</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Ridge (L2)</h3>
      <div class="math-block">$$\\mathbf{w}^* = \\arg\\min_\\mathbf{w} \\|y - X\\mathbf{w}\\|^2 + \\lambda \\|\\mathbf{w}\\|_2^2$$</div>
      <p>Аналитическое решение:</p>
      <div class="math-block">$$\\mathbf{w}^* = (X^T X + \\lambda I)^{-1} X^T y$$</div>

      <h3>Lasso (L1)</h3>
      <div class="math-block">$$\\mathbf{w}^* = \\arg\\min_\\mathbf{w} \\|y - X\\mathbf{w}\\|^2 + \\lambda \\|\\mathbf{w}\\|_1$$</div>
      <p>Нет closed-form. Решается координатным спуском или проксимальными методами.</p>

      <h3>Soft-thresholding (для Lasso)</h3>
      <div class="math-block">$$S_\\lambda(z) = \\text{sign}(z) \\cdot \\max(|z| - \\lambda, 0)$$</div>

      <h3>Elastic Net</h3>
      <div class="math-block">$$\\mathbf{w}^* = \\arg\\min \\|y - X\\mathbf{w}\\|^2 + \\lambda_1 \\|\\mathbf{w}\\|_1 + \\lambda_2 \\|\\mathbf{w}\\|_2^2$$</div>

      <h3>Байесовская интерпретация</h3>
      <ul>
        <li><b>L2 = Gaussian prior</b> на веса: $w_j \\sim N(0, 1/\\lambda)$.</li>
        <li><b>L1 = Laplace prior</b>: $w_j \\sim \\text{Laplace}(0, 1/\\lambda)$.</li>
        <li>MAP оценка → регуляризованная задача.</li>
      </ul>
    `,

    extra: `
      <h3>Геометрия L1 vs L2</h3>
      <p>Контур L2 — окружность/сфера. Контур L1 — ромб с углами на осях координат. Оптимум при пересечении контура loss с контуром штрафа. L1 с большей вероятностью попадает в угол (зануляет компоненты).</p>

      <h3>Стандартизация обязательна</h3>
      <p>Регуляризация штрафует все веса одинаково. Если признаки разного масштаба — будет несправедливость. <b>Всегда StandardScaler</b> перед регуляризированной моделью.</p>

      <h3>Регуляризация в нейросетях</h3>
      <ul>
        <li><b>Weight decay</b> = L2 на веса.</li>
        <li><b>Dropout</b> — случайно занулять активации.</li>
        <li><b>Batch Normalization</b> — имеет регуляризующий эффект.</li>
        <li><b>Early stopping</b> — остановка до переобучения.</li>
        <li><b>Data augmentation</b> — регуляризация через данные.</li>
        <li><b>Label smoothing</b> — мягкие цели.</li>
      </ul>

      <h3>Подбор λ</h3>
      <ul>
        <li><b>CV</b> — стандарт.</li>
        <li><b>LARS path</b> — даёт весь путь решений Lasso.</li>
        <li><b>AIC/BIC</b> — теоретические критерии.</li>
        <li><b>1-SE rule</b>: взять наибольший λ, который в пределах 1 SE от минимума CV.</li>
      </ul>

      <h3>Когда что</h3>
      <table>
        <tr><th>Ситуация</th><th>Что использовать</th></tr>
        <tr><td>Много признаков, мало важных</td><td>L1</td></tr>
        <tr><td>Все признаки могут быть важны</td><td>L2</td></tr>
        <tr><td>Коррелированные признаки</td><td>L2 или Elastic Net</td></tr>
        <tr><td>Нужна интерпретация</td><td>L1</td></tr>
      </table>
    `,
  },
});
