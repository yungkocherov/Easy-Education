/* ==========================================================================
   Что такое Machine Learning — вводная тема
   ========================================================================== */
App.registerTopic({
  id: 'intro-ml',
  category: 'ml-basics',
  title: 'Что такое Machine Learning',
  summary: `Типы задач, что значит «обучить модель», train/test, <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">overfitting</a> — фундамент для всего остального.`,

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты учишь ребёнка отличать кошек от собак. Ты <b>не пишешь ему инструкцию</b> «если уши торчат и хвост загнут — это собака». Вместо этого ты показываешь ему 100 фотографий кошек и 100 фотографий собак, а он <b>сам</b> находит закономерности: «пушистая морда с усами — скорее кошка».</p>
        <p>Machine Learning (ML) работает точно так же. Вместо того чтобы программист писал явные правила, мы даём алгоритму <b>данные с ответами</b>, а он сам находит паттерны. Чем больше примеров — тем лучше он «понимает» задачу.</p>
      </div>

      <h3>🎯 Зачем нужен ML</h3>
      <p>Традиционное программирование: <b>правила + данные → ответ</b>. Ты пишешь <code>if temperature &gt; 30: print("жарко")</code>.</p>
      <p>Machine Learning: <b>данные + ответы → правила</b>. Алгоритм сам выучивает, что «жарко» — это когда температура выше некоторого порога, и этот порог он подбирает из данных.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 180" style="width:100%;max-width:700px;">
          <!-- Traditional -->
          <rect x="20" y="20" width="120" height="50" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
          <text x="80" y="50" text-anchor="middle" font-size="13" fill="#0369a1">Правила</text>
          <rect x="160" y="20" width="120" height="50" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
          <text x="220" y="50" text-anchor="middle" font-size="13" fill="#0369a1">Данные</text>
          <line x1="280" y1="45" x2="320" y2="45" stroke="#0284c7" stroke-width="2" marker-end="url(#arrowBlue)"/>
          <rect x="320" y="20" width="120" height="50" rx="8" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
          <text x="380" y="42" text-anchor="middle" font-size="12" font-weight="600" fill="#0369a1">Программа</text>
          <text x="380" y="58" text-anchor="middle" font-size="12" fill="#0369a1">(if/else)</text>
          <line x1="440" y1="45" x2="480" y2="45" stroke="#0284c7" stroke-width="2" marker-end="url(#arrowBlue)"/>
          <rect x="480" y="20" width="100" height="50" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
          <text x="530" y="50" text-anchor="middle" font-size="13" fill="#0369a1">Ответ</text>
          <text x="350" y="12" text-anchor="middle" font-size="11" fill="#64748b">Традиционное программирование</text>

          <!-- ML -->
          <rect x="20" y="110" width="120" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
          <text x="80" y="140" text-anchor="middle" font-size="13" fill="#15803d">Данные</text>
          <rect x="160" y="110" width="120" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
          <text x="220" y="140" text-anchor="middle" font-size="13" fill="#15803d">Ответы</text>
          <line x1="280" y1="135" x2="320" y2="135" stroke="#16a34a" stroke-width="2" marker-end="url(#arrowGreen)"/>
          <rect x="320" y="110" width="120" height="50" rx="8" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/>
          <text x="380" y="132" text-anchor="middle" font-size="12" font-weight="600" fill="#15803d">Алгоритм</text>
          <text x="380" y="148" text-anchor="middle" font-size="12" fill="#15803d">(обучение)</text>
          <line x1="440" y1="135" x2="480" y2="135" stroke="#16a34a" stroke-width="2" marker-end="url(#arrowGreen)"/>
          <rect x="480" y="110" width="100" height="50" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
          <text x="530" y="140" text-anchor="middle" font-size="13" fill="#15803d">Модель</text>
          <text x="350" y="102" text-anchor="middle" font-size="11" fill="#64748b">Machine Learning</text>

          <defs>
            <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8" fill="#0284c7"/>
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8" fill="#16a34a"/>
            </marker>
          </defs>
        </svg>
      </div>

      <p>ML применяется, когда правила <b>слишком сложны</b> для ручного описания: распознавание лиц, перевод текста, прогноз оттока клиентов, рекомендации в YouTube.</p>

      <h3>📋 Три типа задач ML</h3>

      <h4>1. Обучение с учителем (Supervised Learning)</h4>
      <p>У нас есть <b>данные с правильными ответами</b> (метками). Алгоритм учится на парах «вход → правильный выход» и потом предсказывает ответы для новых данных.</p>
      <p>Два подтипа:</p>
      <ul>
        <li><b>Регрессия</b> — предсказываем число. Пример: цена квартиры по площади, этажу и району.</li>
        <li><b>Классификация</b> — предсказываем категорию. Пример: спам / не спам, кошка / собака, диагноз.</li>
      </ul>
      <div class="key-concept">
        <div class="kc-label">Ключевое отличие</div>
        <p><b>Регрессия</b> = ответ непрерывный (42.5, 100500). <b>Классификация</b> = ответ дискретный (класс A, класс B).</p>
      </div>

      <h4>2. Обучение без учителя (Unsupervised Learning)</h4>
      <p>У нас есть данные <b>без ответов</b>. Алгоритм ищет скрытую структуру: группы, аномалии, основные компоненты.</p>
      <ul>
        <li><b>Кластеризация</b> — разбить данные на группы. Пример: сегментировать клиентов по поведению.</li>
        <li><b>Снижение размерности</b> — сжать 100 признаков в 2-3, сохранив главное (PCA, t-SNE).</li>
        <li><b>Обнаружение аномалий</b> — найти «чужих» в данных (Isolation Forest).</li>
      </ul>

      <h4>3. Обучение с подкреплением (Reinforcement Learning)</h4>
      <p>Агент учится в среде методом проб и ошибок, получая <b>награды и штрафы</b>. Применяется в играх (AlphaGo), робототехнике, управлении ресурсами. В этом курсе мы его не разбираем, но важно знать, что он существует.</p>

      <h3>🔄 Как устроен ML-pipeline</h3>
      <p>Любой ML-проект проходит через стандартные этапы:</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 700 60" style="width:100%;max-width:700px;">
          <rect x="5" y="10" width="90" height="40" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="50" y="34" text-anchor="middle" font-size="11" fill="#1e40af">Данные</text>
          <line x1="95" y1="30" x2="115" y2="30" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arrB)"/>
          <rect x="115" y="10" width="90" height="40" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="160" y="28" text-anchor="middle" font-size="10" fill="#1e40af">Очистка и</text>
          <text x="160" y="40" text-anchor="middle" font-size="10" fill="#1e40af">подготовка</text>
          <line x1="205" y1="30" x2="225" y2="30" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arrB)"/>
          <rect x="225" y="10" width="90" height="40" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="270" y="28" text-anchor="middle" font-size="10" fill="#1e40af">Train / Test</text>
          <text x="270" y="40" text-anchor="middle" font-size="10" fill="#1e40af">split</text>
          <line x1="315" y1="30" x2="335" y2="30" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#arrB)"/>
          <rect x="335" y="10" width="90" height="40" rx="6" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/>
          <text x="380" y="34" text-anchor="middle" font-size="11" fill="#15803d">Обучение</text>
          <line x1="425" y1="30" x2="445" y2="30" stroke="#16a34a" stroke-width="1.5" marker-end="url(#arrG)"/>
          <rect x="445" y="10" width="90" height="40" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
          <text x="490" y="34" text-anchor="middle" font-size="11" fill="#92400e">Оценка</text>
          <line x1="535" y1="30" x2="555" y2="30" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrO)"/>
          <rect x="555" y="10" width="115" height="40" rx="6" fill="#fce7f3" stroke="#db2777" stroke-width="1.5"/>
          <text x="612" y="34" text-anchor="middle" font-size="11" fill="#9d174d">Применение</text>
          <defs>
            <marker id="arrB" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#3b82f6"/></marker>
            <marker id="arrG" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#16a34a"/></marker>
            <marker id="arrO" markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#d97706"/></marker>
          </defs>
        </svg>
      </div>

      <ol>
        <li><b>Сбор данных</b> — таблица, где строки = объекты, столбцы = признаки (features), один столбец = ответ (target).</li>
        <li><b>Очистка и подготовка</b> — убрать пропуски, выбросы, привести данные к числовому виду (feature engineering).</li>
        <li><b>Разделение на train / test</b> — часть данных для обучения, часть для проверки. Обычно 80% / 20%.</li>
        <li><b>Обучение модели</b> — алгоритм подбирает параметры, чтобы минимизировать ошибку на тренировочных данных.</li>
        <li><b>Оценка</b> — проверяем модель на тестовых данных, которые она <b>не видела</b>.</li>
        <li><b>Применение</b> — если модель хороша, используем её для предсказаний на новых данных.</li>
      </ol>

      <h3>🧪 Train / Test split — зачем делить данные</h3>
      <p>Если мы оценим модель на тех же данных, на которых обучали, — она покажет нереально хороший результат. Это как сдавать экзамен по билетам, которые ты видел заранее. Реальная проверка — на данных, которых модель <b>никогда не видела</b>.</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 500 70" style="width:100%;max-width:500px;">
          <rect x="10" y="20" width="380" height="35" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="200" y="42" text-anchor="middle" font-size="13" font-weight="600" fill="#1e40af">Train (80%)</text>
          <rect x="390" y="20" width="100" height="35" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
          <text x="440" y="42" text-anchor="middle" font-size="13" font-weight="600" fill="#92400e">Test (20%)</text>
          <text x="250" y="12" text-anchor="middle" font-size="11" fill="#64748b">Весь датасет (100%)</text>
        </svg>
      </div>

      <p>Train — для обучения. Test — для <b>честной</b> оценки. Мы <b>никогда</b> не используем test при обучении.</p>

      <h3>⚠️ <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">Переобучение</a> и <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">недообучение</a></h3>
      <p>Два главных врага ML-модели:</p>

      <table>
        <tr><th></th><th>Недообучение (<a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">Underfitting</a>)</th><th>Переобучение (Overfitting)</th></tr>
        <tr>
          <td><b>Что происходит</b></td>
          <td>Модель слишком простая, не уловила закономерности</td>
          <td>Модель слишком сложная, запомнила шум в данных</td>
        </tr>
        <tr>
          <td><b>Train ошибка</b></td>
          <td>Высокая</td>
          <td>Очень низкая</td>
        </tr>
        <tr>
          <td><b>Test ошибка</b></td>
          <td>Высокая</td>
          <td>Высокая (намного выше train)</td>
        </tr>
        <tr>
          <td><b>Аналогия</b></td>
          <td>Ученик, который не учил материал</td>
          <td>Ученик, который зазубрил ответы, но не понял принцип</td>
        </tr>
        <tr>
          <td><b>Лечение</b></td>
          <td>Усложнить модель, добавить признаки</td>
          <td>Упростить модель, добавить данные, регуляризация</td>
        </tr>
      </table>

      <div class="key-concept">
        <div class="kc-label">Золотое правило</div>
        <p>Хорошая модель — та, которая хорошо работает на <b>новых данных</b>, а не та, которая идеально выучила тренировочные.</p>
      </div>

      <h3>📦 Что такое «признаки» и «целевая переменная»</h3>
      <p>ML работает с таблицами. Каждая строка — один объект (человек, транзакция, квартира). Столбцы делятся на два типа:</p>
      <ul>
        <li><b>Признаки (features, X)</b> — то, что мы знаем: площадь, этаж, район, возраст клиента.</li>
        <li><b>Целевая переменная (target, y)</b> — то, что мы хотим предсказать: цена, класс, вероятность.</li>
      </ul>
      <table>
        <tr><th>Площадь, м²</th><th>Этаж</th><th>Район</th><th style="background:#dcfce7">Цена, млн ₽</th></tr>
        <tr><td>45</td><td>3</td><td>Центр</td><td style="background:#dcfce7">6.2</td></tr>
        <tr><td>72</td><td>8</td><td>Спальный</td><td style="background:#dcfce7">4.8</td></tr>
        <tr><td>30</td><td>1</td><td>Пригород</td><td style="background:#dcfce7">2.1</td></tr>
        <tr><td>55</td><td>12</td><td>Центр</td><td style="background:#dcfce7"><b>?</b></td></tr>
      </table>
      <p>Зелёный столбец — target (цена). Остальные — features. Задача модели: выучить связь features → target и предсказать «?» для новой квартиры.</p>

      <h3>🧭 Карта алгоритмов</h3>
      <p>ML-алгоритмов много, но для старта достаточно знать основные:</p>
      <table>
        <tr><th>Задача</th><th>Алгоритмы</th><th>Когда использовать</th></tr>
        <tr><td><b>Регрессия</b></td><td>Линейная регрессия, KNN, Деревья, Random Forest, <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting</td><td>Предсказываем число (цена, количество, длительность)</td></tr>
        <tr><td><b>Классификация</b></td><td>Логистическая регрессия, KNN, Деревья, RF, GB, SVM, Naive Bayes</td><td>Предсказываем класс (да/нет, тип, категория)</td></tr>
        <tr><td><b>Кластеризация</b></td><td>K-Means, DBSCAN, иерархическая</td><td>Ищем группы в данных без меток</td></tr>
        <tr><td><b>Снижение размерности</b></td><td>PCA, t-SNE, UMAP</td><td>Визуализируем или сжимаем данные</td></tr>
      </table>

      <h3>📏 Как оценить модель</h3>
      <p>Для разных задач — разные метрики:</p>
      <ul>
        <li><b>Регрессия:</b> <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a> (средний квадрат ошибки), <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MAE</a> (средний модуль ошибки), R² (доля объяснённой дисперсии).</li>
        <li><b>Классификация:</b> Accuracy (доля правильных), Precision, Recall, F1-score, ROC-AUC.</li>
      </ul>
      <p>Подробно разбираем метрики в отдельных темах: «Метрики классификации» и «ROC и AUC».</p>

      <h3>🤔 Когда ML не нужен</h3>
      <p>Не всякая задача требует ML:</p>
      <ul>
        <li>Если правила можно описать <b>простым if/else</b> — ML избыточен.</li>
        <li>Если данных <b>очень мало</b> (10-50 строк) — модель не сможет выучить закономерности.</li>
        <li>Если нужна 100% <b>интерпретируемость</b> и прозрачность — иногда ручные правила лучше.</li>
        <li>Если нет <b>обратной связи</b> — модель нельзя проверить, нет тестовых данных.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Регрессия: предсказываем цену',
        content: `
          <h4>Задача</h4>
          <p>У нас есть 5 квартир с известной площадью и ценой. Нужно предсказать цену квартиры с площадью 55 м².</p>

          <table>
            <tr><th>Площадь (X)</th><th>Цена, млн ₽ (y)</th></tr>
            <tr><td>30</td><td>2.0</td></tr>
            <tr><td>40</td><td>3.1</td></tr>
            <tr><td>50</td><td>3.8</td></tr>
            <tr><td>60</td><td>4.7</td></tr>
            <tr><td>70</td><td>5.5</td></tr>
          </table>

          <h4>Шаг 1: Разделяем данные</h4>
          <p>Train: первые 4 квартиры (30-60 м²). Test: последняя (70 м²).</p>

          <h4>Шаг 2: Строим простейшую модель</h4>
          <p>Самая простая модель — линейная: $\\hat{y} = w_0 + w_1 \\cdot x$.</p>
          <p>По тренировочным данным находим: $w_0 \\approx 0.05$, $w_1 \\approx 0.077$.</p>
          <p>Модель: $\\hat{y} = 0.05 + 0.077 \\cdot x$.</p>

          <h4>Шаг 3: Проверяем на test</h4>
          <p>Квартира 70 м²: $\\hat{y} = 0.05 + 0.077 \\times 70 = 5.44$ млн.</p>
          <p>Реальная цена: 5.5 млн. Ошибка: |5.5 − 5.44| = 0.06 млн. Отлично!</p>

          <h4>Шаг 4: Предсказание для новой квартиры</h4>
          <p>55 м²: $\\hat{y} = 0.05 + 0.077 \\times 55 = 4.29$ млн.</p>

          <div class="key-concept">
            <div class="kc-label">Что мы сделали</div>
            <p>Обучили модель на данных с ответами (supervised learning, регрессия), проверили на отложенной части (test), и применили к новому объекту. Это и есть ML-pipeline в миниатюре.</p>
          </div>
        `
      },
      {
        title: 'Классификация: спам / не спам',
        content: `
          <h4>Задача</h4>
          <p>У нас 8 писем, и мы знаем, какие из них спам. Признаки: длина письма и количество ссылок.</p>

          <table>
            <tr><th>#</th><th>Длина (слов)</th><th>Ссылок</th><th>Спам?</th></tr>
            <tr><td>1</td><td>50</td><td>0</td><td>Нет</td></tr>
            <tr><td>2</td><td>120</td><td>1</td><td>Нет</td></tr>
            <tr><td>3</td><td>30</td><td>5</td><td>Да</td></tr>
            <tr><td>4</td><td>200</td><td>0</td><td>Нет</td></tr>
            <tr><td>5</td><td>15</td><td>8</td><td>Да</td></tr>
            <tr><td>6</td><td>80</td><td>2</td><td>Нет</td></tr>
            <tr><td>7</td><td>25</td><td>6</td><td>Да</td></tr>
            <tr><td>8</td><td>10</td><td>10</td><td>Да</td></tr>
          </table>

          <h4>Шаг 1: Замечаем паттерн</h4>
          <p>Спам-письма: короткие и с большим количеством ссылок. Не-спам: длинные и с 0-2 ссылками.</p>

          <h4>Шаг 2: Простейшее правило (модель)</h4>
          <p>Если <b>ссылок ≥ 4</b> — спам. Иначе — не спам.</p>
          <p>Проверим на всех 8 письмах:</p>
          <ul>
            <li>Письмо 1: 0 ссылок → не спам ✅</li>
            <li>Письмо 3: 5 ссылок → спам ✅</li>
            <li>Письмо 6: 2 ссылки → не спам ✅</li>
            <li>Все 8 писем классифицированы верно → Accuracy = 100%</li>
          </ul>

          <h4>Шаг 3: А если новое письмо?</h4>
          <p>Новое письмо: 45 слов, 3 ссылки → не спам (3 < 4).</p>

          <div class="key-concept">
            <div class="kc-label">Суть классификации</div>
            <p>Модель нашла <b>границу решений</b> (decision boundary) — порог по количеству ссылок. В реальности ML-алгоритмы находят такие границы автоматически, учитывая все признаки сразу.</p>
          </div>
        `
      },
      {
        title: 'Overfitting на простом примере',
        content: `
          <h4>Задача</h4>
          <p>Мы хотим предсказать зависимость y от x. У нас 6 точек:</p>
          <table>
            <tr><th>x</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>
            <tr><th>y</th><td>2.1</td><td>3.9</td><td>6.2</td><td>7.8</td><td>10.1</td><td>12.3</td></tr>
          </table>
          <p>Истинная зависимость: $y \\approx 2x$ (с небольшим шумом).</p>

          <h4>Модель A: прямая (1 параметр)</h4>
          <p>$\\hat{y} = 2.03x$. Train ошибка: 0.04. Test ошибка: 0.05.</p>
          <p>Простая модель, хорошо обобщает → <b>хорошо</b>.</p>

          <h4>Модель B: полином 5-й степени (6 параметров)</h4>
          <p>Проходит <b>точно через все 6 точек</b>. Train ошибка: 0.00. Идеально!</p>
          <p>Но для x = 3.5 (между точками) даёт y = 8.7 вместо ожидаемых 7.0.</p>
          <p>Test ошибка: 2.5 — <b>в 50 раз хуже</b>, чем у прямой!</p>

          <h4>Почему?</h4>
          <p>Полином 5-й степени <b>запомнил шум</b> в данных. Он подстроился под каждое отклонение (2.1 вместо 2.0, 6.2 вместо 6.0) вместо того, чтобы выучить общую тенденцию.</p>

          <div class="key-concept">
            <div class="kc-label">Ключевой урок</div>
            <p>Больше параметров ≠ лучше. Модель с 6 параметрами на 6 точках — это как зазубрить все ответы: на экзамене с новыми вопросами ты провалишься. Баланс между сложностью модели и количеством данных — центральная идея ML.</p>
          </div>
        `
      }
    ],

    simulation: [
      {
        title: 'Train / Test split',
        html: `
          <h3>Симуляция: зачем нужен train/test split</h3>
          <p>Модель учится только на синих точках (train). Красные (test) — спрятаны. Смотри, совпадает ли train-качество с test-качеством.</p>
          <div class="sim-container">
            <div class="sim-controls" id="introml-split-controls"></div>
            <div class="sim-buttons">
              <button class="btn" id="introml-split-regen">🔄 Перемешать / новые данные</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:340px;"><canvas id="introml-split-chart"></canvas></div>
              <div class="sim-stats" id="introml-split-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#introml-split-controls');
          const cTest = App.makeControl('range', 'introml-split-test', 'Доля test (%)', { min: 10, max: 60, step: 5, value: 30 });
          const cN = App.makeControl('range', 'introml-split-n', 'Всего точек', { min: 20, max: 200, step: 10, value: 60 });
          const cNoise = App.makeControl('range', 'introml-split-noise', 'Шум σ', { min: 0, max: 1.2, step: 0.05, value: 0.4 });
          [cTest, cN, cNoise].forEach(c => controls.appendChild(c.wrap));

          let chart = null;
          let xs = [], ys = [];

          function truefn(x) { return 0.6 * x + 0.4; }

          function regen() {
            const n = +cN.input.value, noise = +cNoise.input.value;
            xs = []; ys = [];
            for (let i = 0; i < n; i++) {
              const x = -3 + 6 * Math.random();
              xs.push(x); ys.push(truefn(x) + App.Util.randn(0, noise));
            }
            update();
          }

          function update() {
            const frac = +cTest.input.value / 100;
            const n = xs.length;
            // детерминированное разбиение: каждая точка получает номер, первые k — train
            const idx = xs.map((_, i) => i);
            // простое «перемешивание» детерминированным seed чтобы не прыгало на слайдерах
            const order = idx.slice().sort((a, b) => ((a * 9301 + 49297) % 233280) - ((b * 9301 + 49297) % 233280));
            const nTest = Math.max(1, Math.round(n * frac));
            const testIdx = new Set(order.slice(0, nTest));

            const trainX = [], trainY = [], testX = [], testY = [];
            for (let i = 0; i < n; i++) {
              if (testIdx.has(i)) { testX.push(xs[i]); testY.push(ys[i]); }
              else { trainX.push(xs[i]); trainY.push(ys[i]); }
            }

            // линейная регрессия на train
            const mx = App.Util.mean(trainX), my = App.Util.mean(trainY);
            let num = 0, den = 0;
            for (let i = 0; i < trainX.length; i++) { num += (trainX[i] - mx) * (trainY[i] - my); den += (trainX[i] - mx) ** 2; }
            const w1 = den === 0 ? 0 : num / den;
            const w0 = my - w1 * mx;
            const pred = x => w0 + w1 * x;

            let trainMSE = 0; trainX.forEach((x, i) => { trainMSE += (trainY[i] - pred(x)) ** 2; }); trainMSE /= Math.max(1, trainX.length);
            let testMSE = 0; testX.forEach((x, i) => { testMSE += (testY[i] - pred(x)) ** 2; }); testMSE /= Math.max(1, testX.length);

            const gridX = App.Util.linspace(-3.5, 3.5, 60);
            const ctx = container.querySelector('#introml-split-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'scatter',
              data: {
                datasets: [
                  { label: 'Train', data: trainX.map((x, i) => ({ x, y: trainY[i] })), backgroundColor: 'rgba(59,130,246,0.7)', pointRadius: 4 },
                  { label: 'Test', data: testX.map((x, i) => ({ x, y: testY[i] })), backgroundColor: 'rgba(239,68,68,0.85)', pointRadius: 5, pointStyle: 'triangle' },
                  { type: 'line', label: 'Модель (обучена на train)', data: gridX.map(x => ({ x, y: pred(x) })), borderColor: '#16a34a', borderWidth: 2.5, pointRadius: 0, fill: false },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: `Train: ${trainX.length} точек, Test: ${testX.length} точек` } },
                scales: { x: { type: 'linear', min: -3.5, max: 3.5, title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'y' } } },
              },
            });
            App.registerChart(chart);

            const gap = testMSE - trainMSE;
            const warn = testX.length < 5 ? '<div class="stat-card" style="background:#fee2e2;"><div class="stat-label">!</div><div class="stat-value" style="font-size:13px;">Test слишком мал</div></div>' : '';
            container.querySelector('#introml-split-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Train MSE</div><div class="stat-value">${trainMSE.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Test MSE</div><div class="stat-value">${testMSE.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Gap (test − train)</div><div class="stat-value">${gap.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">w₀ / w₁</div><div class="stat-value">${w0.toFixed(2)} / ${w1.toFixed(2)}</div></div>
              ${warn}
            `;
          }

          [cTest].forEach(c => c.input.addEventListener('input', update));
          [cN, cNoise].forEach(c => c.input.addEventListener('change', regen));
          container.querySelector('#introml-split-regen').onclick = regen;
          regen();
        },
      },
      {
        title: 'Overfitting: гибкость модели',
        html: `
          <h3>Симуляция: сложность модели и переобучение</h3>
          <p>Чем выше степень полинома, тем точнее модель на train. Но с какого-то момента она начинает запоминать шум вместо сигнала — и test-ошибка растёт.</p>
          <div class="sim-container">
            <div class="sim-controls" id="introml-of-controls"></div>
            <div class="sim-buttons">
              <button class="btn" id="introml-of-regen">🔄 Новые данные</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="introml-of-chart"></canvas></div>
              <div class="sim-stats" id="introml-of-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#introml-of-controls');
          const cDeg = App.makeControl('range', 'introml-of-deg', 'Степень полинома', { min: 1, max: 12, step: 1, value: 1 });
          const cN = App.makeControl('range', 'introml-of-n', 'Train точек', { min: 6, max: 40, step: 1, value: 12 });
          const cNoise = App.makeControl('range', 'introml-of-noise', 'Шум σ', { min: 0, max: 1, step: 0.05, value: 0.35 });
          [cDeg, cN, cNoise].forEach(c => controls.appendChild(c.wrap));

          let chart = null;
          let xTrain = [], yTrain = [], xTest = [], yTest = [];

          function truefn(x) { return Math.sin(1.3 * x); }

          function regen() {
            const n = +cN.input.value, noise = +cNoise.input.value;
            xTrain = []; yTrain = []; xTest = []; yTest = [];
            for (let i = 0; i < n; i++) {
              const x = -3 + 6 * Math.random();
              xTrain.push(x); yTrain.push(truefn(x) + App.Util.randn(0, noise));
            }
            for (let i = 0; i < 40; i++) {
              const x = -3 + 6 * Math.random();
              xTest.push(x); yTest.push(truefn(x) + App.Util.randn(0, noise));
            }
            update();
          }

          function fitPoly(xs, ys, deg) {
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
            for (let r = 0; r < p; r++) A[r][r] += 1e-8;
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

          function predict(w, x) { let s = 0; for (let d = 0; d < w.length; d++) s += w[d] * Math.pow(x, d); return s; }

          function update() {
            const deg = +cDeg.input.value;
            const w = fitPoly(xTrain, yTrain, deg);
            let trainErr = 0; xTrain.forEach((x, i) => { trainErr += (yTrain[i] - predict(w, x)) ** 2; }); trainErr /= xTrain.length;
            let testErr = 0; xTest.forEach((x, i) => { testErr += (yTest[i] - predict(w, x)) ** 2; }); testErr /= xTest.length;

            const gridX = App.Util.linspace(-3, 3, 200);
            const ctx = container.querySelector('#introml-of-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'scatter',
              data: {
                datasets: [
                  { label: 'Train', data: xTrain.map((x, i) => ({ x, y: yTrain[i] })), backgroundColor: 'rgba(59,130,246,0.7)', pointRadius: 4 },
                  { type: 'line', label: 'Истинная f(x)', data: gridX.map(x => ({ x, y: truefn(x) })), borderColor: '#94a3b8', borderWidth: 2, pointRadius: 0, fill: false, borderDash: [6, 4] },
                  { type: 'line', label: `Модель, степень ${deg}`, data: gridX.map(x => ({ x, y: predict(w, x) })), borderColor: '#dc2626', borderWidth: 2.5, pointRadius: 0, fill: false },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { x: { type: 'linear', min: -3.2, max: 3.2 }, y: { suggestedMin: -2.5, suggestedMax: 2.5 } },
              },
            });
            App.registerChart(chart);

            let label = 'OK';
            if (deg <= 2 && trainErr > 0.3) label = 'Недообучение';
            else if (testErr > trainErr * 2 && testErr > 0.3) label = 'Переобучение';
            else if (testErr < 0.2 && trainErr < 0.2) label = 'Баланс';

            container.querySelector('#introml-of-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Степень</div><div class="stat-value">${deg}</div></div>
              <div class="stat-card"><div class="stat-label">Параметров</div><div class="stat-value">${deg + 1}</div></div>
              <div class="stat-card"><div class="stat-label">Train MSE</div><div class="stat-value">${trainErr.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Test MSE</div><div class="stat-value">${testErr.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Диагноз</div><div class="stat-value" style="font-size:14px;">${label}</div></div>
            `;
          }

          cDeg.input.addEventListener('input', update);
          [cN, cNoise].forEach(c => c.input.addEventListener('change', regen));
          container.querySelector('#introml-of-regen').onclick = regen;
          regen();
        },
      },
    ],

    python: `
<h3>Минимальный ML-pipeline на Python</h3>
<pre><code># 1. Импортируем библиотеки
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# 2. Загружаем данные (пример: цены квартир)
data = pd.DataFrame({
    'area': [30, 40, 50, 55, 60, 65, 70, 80, 90, 100],
    'floor': [1, 3, 5, 2, 8, 4, 10, 6, 12, 7],
    'price': [2.0, 3.1, 3.8, 3.9, 4.7, 4.5, 5.5, 6.0, 7.2, 8.0]
})

X = data[['area', 'floor']]   # features
y = data['price']              # target

# 3. Делим на train / test (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Обучаем модель
model = LinearRegression()
model.fit(X_train, y_train)

# 5. Оцениваем на тесте
y_pred = model.predict(X_test)
print(f"MSE:  {mean_squared_error(y_test, y_pred):.3f}")
print(f"R²:   {r2_score(y_test, y_pred):.3f}")

# 6. Предсказание для новой квартиры
new_apartment = [[55, 7]]
print(f"Цена: {model.predict(new_apartment)[0]:.2f} млн ₽")
</code></pre>

<h3>Классификация — аналогичный pipeline</h3>
<pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Данные: спам или нет
X = [[50, 0], [120, 1], [30, 5], [200, 0],
     [15, 8], [80, 2], [25, 6], [10, 10]]
y = [0, 0, 1, 0, 1, 0, 1, 1]  # 0 = не спам, 1 = спам

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

model = LogisticRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(classification_report(y_test, y_pred,
      target_names=['не спам', 'спам']))
</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>E-commerce и ритейл.</b> Рекомендации товаров (Amazon, Wildberries), прогноз спроса, динамическое ценообразование, прогноз churn. ML приносит проценты выручки напрямую — отсюда огромные бюджеты на data science в этих компаниях.</li>
        <li><b>Финансы и банки.</b> Кредитный скоринг, антифрод, алгоритмическая торговля, AML (anti-money laundering). Требует объяснимости перед регулятором — классические модели (логрег, деревья) здесь доминируют над нейросетями.</li>
        <li><b>Медицина и биоинформатика.</b> Диагностика по рентгену/МРТ, прогноз риска сердечно-сосудистых заболеваний, дизайн лекарств, анализ геномов. Данных обычно мало → классические модели + аккуратная кросс-валидация.</li>
        <li><b>NLP и чат-боты.</b> Машинный перевод, суммаризация, sentiment analysis, вопрос-ответные системы, LLM (ChatGPT, Claude). Область, где глубокое обучение за 5 лет вытеснило почти всё классическое.</li>
        <li><b>Компьютерное зрение.</b> Автопилоты, распознавание лиц, OCR, детекция дефектов на производстве, медицинская визуализация. CNN и Vision Transformers — стандарт.</li>
        <li><b>Промышленность и IoT.</b> Предиктивное обслуживание (когда сломается насос), контроль качества, оптимизация энергопотребления, anomaly detection на датчиках.</li>
        <li><b>Маркетинг и продукт.</b> Сегментация клиентов, churn prediction, uplift modelling, A/B-тесты, рекомендации в ленте.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Автоматическое извлечение закономерностей.</b> Человек, пишущий правила вручную, физически не способен удержать в голове сотни признаков и их взаимодействий. Модель находит паттерны, которые аналитик пропустит — и делает это за минуты, а не месяцы.</p>
      <p><b>Масштабируемость по применению.</b> Обучил один раз — предсказываешь миллиард раз за доли копейки. Это экономика SaaS: стоимость обучения фиксированная, стоимость инференса стремится к нулю с ростом объёмов.</p>
      <p><b>Адаптивность к новым данным.</b> Меняется поведение пользователей, сезонность, рынок — переобучил модель, и она подстраивается. Ручные правила пришлось бы переписывать и заново согласовывать с бизнесом.</p>
      <p><b>Работа с высокоразмерными и неструктурированными данными.</b> Классическое ПО задыхается на картинках, текстах, звуке — для ML это «нативный» вход. Один раз выучил представления — и можно делать хоть классификацию, хоть поиск, хоть генерацию.</p>
      <p><b>Персонализация.</b> Один сервис, миллион разных ответов — каждому пользователю свой feed, своя цена, свой маршрут. Без ML такое невозможно на уровне стоимости и реакции.</p>
      <p><b>Компромиссы явные и управляемые.</b> ML даёт ручки: точность vs скорость, precision vs recall, bias vs variance. Бизнес выбирает точку на кривой — в отличие от «чёрного» экспертного решения, где компромисс скрыт в голове эксперта.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Garbage in — garbage out.</b> ML не магия: без чистых, репрезентативных, размеченных данных модель либо не взлетит, либо запомнит артефакты разметки. На практике 70–80% времени дата-саентиста уходит не на модель, а на очистку, фичи и проверку лейблов.</p>
      <p><b>Черный ящик и проблема объяснимости.</b> Точные модели (нейросети, бустинг) почти невозможно объяснить построчно. В медицине, финансах, HR это регуляторный барьер — приходится либо жертвовать точностью ради линейных моделей, либо строить слой объяснений (<a class="glossary-link" onclick="App.selectTopic('shap-explainability')">SHAP</a>, LIME).</p>
      <p><b>Data drift и concept drift.</b> Модель, обученная на докризисных данных, в кризис ломается — распределения сдвинулись. Без мониторинга метрик и переобучения ML-системы деградируют медленно и незаметно, пока не случается инцидент.</p>
      <p><b>Bias в данных → bias в решениях.</b> Модель воспроизводит и усиливает предубеждения из обучающей выборки: дискриминация по полу при найме, завышенные ставки по кредитам для определённых районов. Это не «техническая мелочь», а прямой юридический и репутационный риск.</p>
      <p><b>Стоимость инфраструктуры.</b> Нейросети требуют GPU, MLOps, pipeline-ов для данных, мониторинга, A/B-тестов. Для маленькой компании с простой задачей часто дешевле написать правила, чем тащить всю инфраструктуру.</p>
      <p><b>Переобучение и иллюзия качества.</b> Красивые метрики на валидации ≠ работа в бою. Утечки (data leakage), неправильная кросс-валидация, целевые переменные из будущего — типичные грабли, из-за которых модели «отлично» ведут себя на тестах и проваливаются в проде.</p>

      <h3>🧭 Когда брать ML — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери ML когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Есть много исторических данных с ответами и паттерн реально существует</td>
          <td>Данных меньше десятков строк или ответы сами по себе сомнительны</td>
        </tr>
        <tr>
          <td>Задачу сложно описать правилами (картинки, тексты, поведение пользователей)</td>
          <td>Задача решается понятной формулой или бизнес-логикой — ML тут лишняя сложность</td>
        </tr>
        <tr>
          <td>Нужны миллионы похожих решений в секунду (скоринг, рекомендации, антифрод)</td>
          <td>Нужно единственное критическое решение, где ошибка стоит жизни, и нет слоя верификации</td>
        </tr>
        <tr>
          <td>Есть механизм получения обратной связи и переобучения</td>
          <td>Нет возможности проверить предсказания — модель превратится в «черный ящик, которому верят»</td>
        </tr>
        <tr>
          <td>Допустимы вероятностные ошибки и есть бюджет на MLOps и мониторинг</td>
          <td>Требуется 100% объяснимость каждого решения и нет ресурсов на explainability-слой</td>
        </tr>
        <tr>
          <td>Паттерн стабилен или меняется предсказуемо — модель можно обновлять</td>
          <td>Мир меняется хаотично и быстро — любая модель устареет до выхода в прод</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b>Rule-based systems и экспертные правила.</b> Если задача хорошо формализована (например, «заблокировать транзакцию &gt; $10k без 2FA»), if/else быстрее, дешевле и не требует MLOps. Используй до тех пор, пока правила влезают в голову.</li>
        <li><b>Статистика и классический A/B.</b> Если нужно измерить эффект, а не делать персонализированные предсказания — t-test, регрессионный анализ и доверительные интервалы решают задачу и объясняются сами.</li>
        <li><b>Оптимизация и OR.</b> Задачи маршрутизации, планирования, расписания — это линейное/целочисленное программирование. ML тут либо не нужен, либо работает в связке с солвером.</li>
        <li><b>LLM из коробки (zero/few-shot).</b> Если задача — NLP и данных мало, иногда дешевле дёрнуть GPT-4 API с хорошим промптом, чем обучать собственную модель.</li>
        <li><b>Симуляции и физические модели.</b> Если известны уравнения (физика, химия, финансы), численный солвер даёт более надёжный ответ и не требует обучающих данных.</li>
      </ul>
    `,

    links: `
      <h3>Внешние ресурсы</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=machine+learning+%D0%B2%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5&target_type=posts&order=relevance" target="_blank">Habr — введение в Machine Learning</a></li>
        <li><a href="https://scikit-learn.org/stable/getting_started.html" target="_blank">scikit-learn: Getting Started</a></li>
        <li><a href="https://www.coursera.org/learn/machine-learning" target="_blank">Andrew Ng — Machine Learning (Coursera)</a></li>
        <li><a href="https://developers.google.com/machine-learning/crash-course" target="_blank">Google ML Crash Course</a></li>
      </ul>
    `
  }
});
