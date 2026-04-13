/* ==========================================================================
   Рекомендательные системы
   ========================================================================== */
App.registerTopic({
  id: 'recsys',
  category: 'ml-basics',
  title: 'Рекомендательные системы',
  summary: 'Как предсказывать предпочтения пользователей: collaborative filtering, content-based, матричная факторизация и гибридные подходы.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что друг советует тебе фильм. Он может делать это двумя способами:</p>
        <p><b>Способ 1 — «Я тебя знаю»</b> (collaborative filtering): друг знает, что тебе нравились «Интерстеллар» и «Начало», а его знакомому Коле — тоже. Коля недавно посмотрел «Прибытие» и был в восторге. Значит, тебе тоже понравится! Здесь рекомендация основана на <b>сходстве вкусов</b> между людьми.</p>
        <p><b>Способ 2 — «Я знаю фильм»</b> (content-based): друг знает, что тебе нравится научная фантастика с глубоким сюжетом. Он смотрит на характеристики фильмов: жанр, режиссёр, тематика — и рекомендует «Прибытие», потому что оно <b>похоже по характеристикам</b> на то, что тебе нравилось раньше.</p>
        <p>Рекомендательные системы делают то же самое, но в масштабе <b>миллионов</b> пользователей и товаров. Netflix, YouTube, Spotify, Amazon — все они строят модели ваших предпочтений, чтобы показать именно то, что вам понравится.</p>
      </div>

      <h3>💡 Два основных подхода</h3>

      <div class="key-concept">
        <div class="kc-label">Content-Based Filtering</div>
        <p>Рекомендации на основе <b>характеристик объектов</b>. Для каждого item (фильм, товар, песня) создаётся вектор признаков: жанр, автор, ключевые слова, длительность и т.д. Система ищет items, <b>похожие</b> на те, что пользователю уже нравились.</p>
      </div>

      <p>Ключевые компоненты content-based подхода:</p>
      <ul>
        <li><b>Профиль item'а</b> — вектор признаков. Для фильма: жанры (боевик, комедия, драма), актёры, режиссёр, год выпуска.</li>
        <li><b>Профиль пользователя</b> — усреднённый вектор понравившихся items: если нравятся боевики со Сталлоне, профиль будет «высокий» в компоненте «боевик» и «Сталлоне».</li>
        <li><b>Меры сходства</b> — чаще всего <span class="term" data-tip="Cosine Similarity. Мера сходства, основанная на угле между двумя векторами. cos(θ)=1 → одинаковые направления, 0 → ортогональные.">косинусное сходство</span>:</li>
      </ul>
      <div class="math-block">$$\\text{sim}(A, B) = \\cos(\\theta) = \\frac{\\vec{A} \\cdot \\vec{B}}{\\|\\vec{A}\\| \\cdot \\|\\vec{B}\\|} = \\frac{\\sum_{i} A_i B_i}{\\sqrt{\\sum_{i} A_i^2} \\cdot \\sqrt{\\sum_{i} B_i^2}}$$</div>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('glossary-tfidf')">TF-IDF</a> для текста</b> — если item имеет текстовое описание, превращаем слова в числовые признаки. TF (term frequency) показывает, как часто слово встречается в описании, IDF (inverse document frequency) снижает вес частых слов вроде «фильм» или «книга».</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Collaborative Filtering</div>
        <p>Рекомендации на основе <b>поведения похожих пользователей</b>. Не нужно знать признаки items — достаточно матрицы «кто что оценил». Если пользователи A и B ставили похожие оценки, то фильмы, которые нравятся A, но B ещё не видел — хорошие кандидаты для рекомендации B.</p>
      </div>

      <p>Два варианта collaborative filtering:</p>

      <h4>User-User CF</h4>
      <p>Находим пользователей с похожими вкусами и рекомендуем то, что нравится «соседям».</p>
      <ol>
        <li>Берём матрицу оценок <b>R</b> (users × items).</li>
        <li>Для целевого пользователя u находим k наиболее похожих пользователей (по косинусному сходству или корреляции Пирсона).</li>
        <li>Предсказываем оценку пользователя u для item i как взвешенное среднее оценок похожих пользователей:</li>
      </ol>
      <div class="math-block">$$\\hat{r}_{ui} = \\bar{r}_u + \\frac{\\sum_{v \\in N(u)} \\text{sim}(u, v) \\cdot (r_{vi} - \\bar{r}_v)}{\\sum_{v \\in N(u)} |\\text{sim}(u, v)|}$$</div>
      <p>Здесь $\\bar{r}_u$ — средняя оценка пользователя u, $N(u)$ — множество его «соседей».</p>

      <h4>Item-Item CF</h4>
      <p>Вместо «похожих пользователей» ищем «похожие items». Два фильма похожи, если их оценивали одинаково. Этот подход <b>стабильнее</b>: предпочтения items меняются реже, чем вкусы пользователей.</p>
      <div class="math-block">$$\\hat{r}_{ui} = \\frac{\\sum_{j \\in N(i)} \\text{sim}(i, j) \\cdot r_{uj}}{\\sum_{j \\in N(i)} |\\text{sim}(i, j)|}$$</div>
      <p>Amazon использовал именно item-item CF для «Те, кто купил X, также купили Y».</p>

      <h3>🔢 <a class="glossary-link" onclick="App.selectTopic('glossary-matrix-factorization')">Матричная факторизация</a></h3>
      <p>Главная идея: матрица оценок R (users × items) — разреженная, большинство ячеек пусты. Мы хотим <b>заполнить пропуски</b>, разложив R на произведение двух маленьких матриц:</p>
      <div class="math-block">$$R \\approx U \\cdot V^T$$</div>
      <p>где $U$ — матрица пользовательских латентных факторов (n_users × k), $V$ — матрица item'овских латентных факторов (n_items × k), а k — число скрытых факторов (обычно 10–200).</p>

      <div class="illustration bordered">
        <svg viewBox="0 0 760 380" xmlns="http://www.w3.org/2000/svg" style="max-width:760px;">
          <text x="380" y="22" text-anchor="middle" font-size="15" font-weight="700" fill="#1e293b">Matrix Factorization: R ≈ U · Vᵀ</text>
          <text x="380" y="40" text-anchor="middle" font-size="11" fill="#64748b">Разреженная матрица оценок → плотные латентные вектора</text>

          <!-- R matrix (sparse) -->
          <g>
            <text x="170" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#475569">R (users × items)</text>
            <text x="170" y="86" text-anchor="middle" font-size="10" fill="#64748b">? — неизвестные оценки</text>
            <!-- 4x5 grid -->
            <g>
              <text x="70" y="110" font-size="11" font-weight="600">Аня</text>
              <text x="70" y="132" font-size="11" font-weight="600">Боря</text>
              <text x="70" y="154" font-size="11" font-weight="600">Вера</text>
              <text x="70" y="176" font-size="11" font-weight="600">Гена</text>
            </g>
            <g font-size="10" text-anchor="middle">
              <text x="115" y="96">Ф1</text>
              <text x="140" y="96">Ф2</text>
              <text x="165" y="96">Ф3</text>
              <text x="190" y="96">Ф4</text>
              <text x="215" y="96">Ф5</text>
            </g>
            <!-- cells -->
            <g>
              <rect x="102" y="100" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="115" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">5</text>
              <rect x="128" y="100" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="141" y="113" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>
              <rect x="154" y="100" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="167" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">4</text>
              <rect x="180" y="100" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="193" y="113" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>
              <rect x="206" y="100" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="219" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">1</text>

              <rect x="102" y="122" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="115" y="135" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>
              <rect x="128" y="122" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="141" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">5</text>
              <rect x="154" y="122" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="167" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">2</text>
              <rect x="180" y="122" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="193" y="135" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">4</text>
              <rect x="206" y="122" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="219" y="135" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>

              <rect x="102" y="144" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="115" y="157" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">4</text>
              <rect x="128" y="144" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="141" y="157" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>
              <rect x="154" y="144" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="167" y="157" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>
              <rect x="180" y="144" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="193" y="157" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">3</text>
              <rect x="206" y="144" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="219" y="157" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">2</text>

              <rect x="102" y="166" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="115" y="179" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>
              <rect x="128" y="166" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="141" y="179" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">4</text>
              <rect x="154" y="166" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="167" y="179" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">5</text>
              <rect x="180" y="166" width="26" height="18" fill="#f3f4f6" stroke="#64748b"/>
              <text x="193" y="179" text-anchor="middle" font-size="11" fill="#9ca3af">?</text>
              <rect x="206" y="166" width="26" height="18" fill="#dbeafe" stroke="#64748b"/>
              <text x="219" y="179" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">1</text>
            </g>
          </g>

          <!-- ≈ sign -->
          <text x="275" y="145" text-anchor="middle" font-size="22" font-weight="700" fill="#475569">≈</text>

          <!-- U matrix -->
          <g>
            <text x="360" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#059669">U (users × 2)</text>
            <text x="360" y="86" text-anchor="middle" font-size="10" fill="#64748b">латентные вектора пользователей</text>
            <g>
              <text x="306" y="110" font-size="10" font-weight="600">Аня</text>
              <rect x="328" y="100" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="343" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">1.2</text>
              <rect x="358" y="100" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="373" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">-0.5</text>

              <text x="306" y="132" font-size="10" font-weight="600">Боря</text>
              <rect x="328" y="122" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="343" y="135" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">-0.8</text>
              <rect x="358" y="122" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="373" y="135" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">1.1</text>

              <text x="306" y="154" font-size="10" font-weight="600">Вера</text>
              <rect x="328" y="144" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="343" y="157" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">0.9</text>
              <rect x="358" y="144" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="373" y="157" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">0.3</text>

              <text x="306" y="176" font-size="10" font-weight="600">Гена</text>
              <rect x="328" y="166" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="343" y="179" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">-0.6</text>
              <rect x="358" y="166" width="30" height="18" fill="#dcfce7" stroke="#059669"/>
              <text x="373" y="179" text-anchor="middle" font-size="10" font-weight="700" fill="#065f46">1.3</text>
            </g>
          </g>

          <!-- × sign -->
          <text x="425" y="145" text-anchor="middle" font-size="22" font-weight="700" fill="#475569">×</text>

          <!-- V^T matrix -->
          <g>
            <text x="570" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">Vᵀ (2 × items)</text>
            <text x="570" y="86" text-anchor="middle" font-size="10" fill="#64748b">латентные вектора фильмов</text>
            <g>
              <g font-size="10" text-anchor="middle">
                <text x="475" y="96">Ф1</text>
                <text x="510" y="96">Ф2</text>
                <text x="545" y="96">Ф3</text>
                <text x="580" y="96">Ф4</text>
                <text x="615" y="96">Ф5</text>
              </g>
              <rect x="460" y="100" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="475" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">2.1</text>
              <rect x="495" y="100" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="510" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">-0.3</text>
              <rect x="530" y="100" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="545" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">1.6</text>
              <rect x="565" y="100" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="580" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">0.7</text>
              <rect x="600" y="100" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="615" y="113" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">-0.4</text>

              <rect x="460" y="122" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="475" y="135" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">-0.2</text>
              <rect x="495" y="122" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="510" y="135" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">1.8</text>
              <rect x="530" y="122" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="545" y="135" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">0.4</text>
              <rect x="565" y="122" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="580" y="135" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">1.5</text>
              <rect x="600" y="122" width="30" height="18" fill="#fef3c7" stroke="#b45309"/>
              <text x="615" y="135" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">-0.7</text>
            </g>
          </g>

          <!-- Interpretation of latent factors -->
          <text x="380" y="230" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Интерпретация латентных факторов (модель обнаруживает сама):</text>
          <g font-size="11">
            <text x="200" y="255" text-anchor="middle" fill="#059669" font-weight="600">Фактор 1: любитель экшна (−) / драмы (+)</text>
            <text x="560" y="255" text-anchor="middle" fill="#b45309" font-weight="600">Фактор 1: фильм экшн (+) / драма (−)</text>
            <text x="200" y="275" text-anchor="middle" fill="#059669" font-weight="600">Фактор 2: любитель комедий (+)</text>
            <text x="560" y="275" text-anchor="middle" fill="#b45309" font-weight="600">Фактор 2: фильм комедийный (+)</text>
          </g>

          <!-- Arrow to prediction example -->
          <text x="380" y="310" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">Предсказать оценку Ани на Ф2:</text>
          <text x="380" y="328" text-anchor="middle" font-size="11" fill="#475569" font-family="monospace">r̂(Аня, Ф2) = 1.2 × (−0.3) + (−0.5) × 1.8 = −0.36 − 0.9 = −1.26</text>
          <text x="380" y="346" text-anchor="middle" font-size="11" fill="#64748b">(Аня любит экшн и не любит комедии → не понравится Ф2, который комедия)</text>
          <text x="380" y="364" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626">Рекомендация: не показывать!</text>
        </svg>
        <div class="caption">Matrix Factorization: разреженная матрица оценок приближается произведением двух маленьких плотных матриц. Строки U — вектора пользователей, столбцы Vᵀ — вектора фильмов. Оценка r̂(u, i) = скалярное произведение их векторов. Модель сама открывает «смысл» каждого измерения.</div>
      </div>

      <p><b>Что такое латентные факторы?</b> Это скрытые характеристики, которые модель обнаруживает сама. Например, для фильмов один фактор может отвечать за «серьёзность vs. комедийность», другой — за «визуальные эффекты vs. диалоги». Модель не знает этих названий, но обнаруживает паттерны в данных.</p>

      <h4>SVD (Singular Value Decomposition)</h4>
      <div class="math-block">$$R = U \\Sigma V^T$$</div>
      <p>$\\Sigma$ — диагональная матрица с сингулярными значениями (от большего к меньшему). Оставляя k наибольших значений, получаем <b>приближение ранга k</b> — лучшее в смысле <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a> (теорема Экарта-Янга).</p>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-matrix-factorization')">ALS (Alternating Least Squares)</a></h4>
      <p>SVD напрямую плохо работает с пропусками. ALS решает задачу итеративно:</p>
      <ol>
        <li>Фиксируем V, оптимизируем U (обычный метод наименьших квадратов).</li>
        <li>Фиксируем U, оптимизируем V.</li>
        <li>Повторяем, пока не сойдётся.</li>
      </ol>
      <p><a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">Функция потерь</a>:</p>
      <div class="math-block">$$\\min_{U, V} \\sum_{(u,i) \\in \\text{observed}} (r_{ui} - \\vec{u}_u \\cdot \\vec{v}_i)^2 + \\lambda(\\|\\vec{u}_u\\|^2 + \\|\\vec{v}_i\\|^2)$$</div>
      <p>Регуляризация $\\lambda$ предотвращает <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучение</a>.</p>

      <h3>❄️ Проблема холодного старта</h3>
      <p><span class="term" data-tip="Cold Start Problem. Ситуация, когда система не может делать рекомендации для нового пользователя или нового item'а из-за отсутствия данных.">Холодный старт</span> — фундаментальная проблема рекомендательных систем:</p>
      <ul>
        <li><b>Новый пользователь</b> — нет истории оценок, невозможно найти «соседей». Решения: показать популярное, попросить оценить несколько items, использовать демографические данные.</li>
        <li><b>Новый item</b> — никто ещё не оценил, нельзя рассчитать сходство. Решения: использовать content-based признаки (жанр, описание), exploitation vs exploration стратегии.</li>
      </ul>

      <h3>🔄 Гибридные подходы</h3>
      <p>Лучшие системы <b>комбинируют</b> несколько подходов:</p>
      <ul>
        <li><b>Weighted hybrid</b> — средневзвешенное предсказаний CF и content-based.</li>
        <li><b>Switching</b> — для новых пользователей используем content-based, для «опытных» — CF.</li>
        <li><b>Feature augmentation</b> — предсказания одной модели подаются как признаки в другую.</li>
        <li><b>Meta-level</b> — одна модель строит профиль, другая использует его для рекомендаций.</li>
      </ul>
      <p>Netflix Prize (2009) показал, что ансамбль из сотен моделей побеждает любой одиночный подход.</p>

      <h3>👆 Implicit vs Explicit Feedback</h3>
      <p><b>Explicit feedback</b> — пользователь явно оценивает: ставит 5 звёзд, нажимает «лайк». Проблема: данных мало, пользователи ленятся ставить оценки.</p>
      <p><b>Implicit feedback</b> — поведение пользователя: клики, время просмотра, покупки, добавление в корзину. Данных <b>намного больше</b>, но они зашумлённые: если человек не кликнул — это не значит, что ему не нравится (может, просто не видел).</p>
      <p>Для implicit feedback используются специальные методы: <b>Bayesian Personalized Ranking (BPR)</b>, <b>Weighted ALS</b>, где наблюдённые взаимодействия получают больший вес.</p>

      <h3>🧠 Современные подходы</h3>
      <ul>
        <li><b>Neural Collaborative Filtering (NCF)</b> — вместо скалярного произведения $\\vec{u} \\cdot \\vec{v}$ используется нейросеть, которая моделирует нелинейные взаимодействия.</li>
        <li><b>Two-Tower Model</b> — две «башни» (нейросети): одна кодирует пользователя, другая — item. На выходе — скалярное произведение <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">эмбеддингов</a>. Подходит для масштабных систем (YouTube, Google).</li>
        <li><b>Transformer-based</b> — модели типа SASRec, BERT4Rec рассматривают историю взаимодействий как последовательность и предсказывают следующий item, как языковые модели предсказывают слово.</li>
        <li><b>Graph Neural Networks</b> — пользователи и items — узлы графа, взаимодействия — рёбра. GNN агрегируют информацию от соседей (LightGCN, PinSage).</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: метрики качества рекомендаций</summary>
        <div class="deep-dive-body">
          <p>Для оценки рекомендательных систем используют специальные метрики:</p>
          <ul>
            <li><b>RMSE / <a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MAE</a></b> — для предсказания рейтингов (регрессия).</li>
            <li><b>Precision@K / Recall@K</b> — какая доля из K рекомендаций релевантна / какая доля релевантных items попала в top-K.</li>
            <li><b>NDCG (Normalized Discounted Cumulative Gain)</b> — учитывает позицию: релевантный item выше — лучше.</li>
            <li><b>MAP (Mean Average Precision)</b> — среднее AP по всем пользователям.</li>
            <li><b>Coverage</b> — какую долю каталога система вообще рекомендует.</li>
            <li><b>Diversity / Novelty</b> — насколько разнообразны рекомендации.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: проблема популярности и фильтр-пузырей</summary>
        <div class="deep-dive-body">
          <p>Рекомендательные системы склонны рекомендовать <b>популярные</b> items (popularity bias). Это создаёт «фильтр-пузырь»: пользователь видит всё более похожий контент и не узнаёт о новом.</p>
          <p>Решения: добавлять exploration-компоненту (epsilon-greedy, Thompson sampling), штрафовать популярные items, оптимизировать diversity наряду с relevance.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>kNN</b> — user-user и item-item CF — это по сути kNN по пользователям/объектам.</li>
        <li><b>PCA / SVD</b> — матричная факторизация тесно связана с PCA: оба ищут латентные структуры.</li>
        <li><b>NLP</b> — TF-IDF, word <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">embeddings</a> используются в content-based подходах.</li>
        <li><b>Нейронные сети</b> — NCF, two-tower, transformer-based модели для рекомендаций.</li>
        <li><b>Метрики</b> — Precision, Recall, NDCG для оценки качества.</li>
      </ul>
    `,

    examples: [
      {
        title: 'User-User Collaborative Filtering',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>5 пользователей оценили 5 фильмов по шкале 1–5. Пользователь Алиса не видела фильм «Матрица». Предсказать её оценку методом user-user CF (k=2 ближайших соседа).</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Пользователь</th><th>Начало</th><th>Титаник</th><th>Матрица</th><th>Дюна</th><th>Амели</th></tr>
              <tr><td><b>Алиса</b></td><td>5</td><td>3</td><td><b>?</b></td><td>4</td><td>2</td></tr>
              <tr><td>Борис</td><td>4</td><td>2</td><td>5</td><td>5</td><td>1</td></tr>
              <tr><td>Вера</td><td>2</td><td>5</td><td>2</td><td>1</td><td>4</td></tr>
              <tr><td>Глеб</td><td>5</td><td>1</td><td>4</td><td>4</td><td>2</td></tr>
              <tr><td>Дина</td><td>1</td><td>4</td><td>1</td><td>2</td><td>5</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: вычислить средние оценки каждого пользователя</h4>
            <div class="calc">
              Для корректного сравнения нужно центрировать оценки (убрать индивидуальный «масштаб»).<br><br>
              r̄(Алиса) = (5+3+4+2)/4 = <b>3.50</b> (без Матрицы, т.к. нет оценки)<br>
              r̄(Борис) = (4+2+5+5+1)/5 = <b>3.40</b><br>
              r̄(Вера) = (2+5+2+1+4)/5 = <b>2.80</b><br>
              r̄(Глеб) = (5+1+4+4+2)/5 = <b>3.20</b><br>
              r̄(Дина) = (1+4+1+2+5)/5 = <b>2.60</b>
            </div>
            <div class="why">Центрирование убирает разницу в «строгости» пользователей. Кто-то ставит 5 всем подряд, кто-то — максимум 3. Центрирование приводит всех к единому масштабу.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: центрировать оценки</h4>
            <div class="calc">
              Центрированная оценка: r'ᵤᵢ = rᵤᵢ − r̄ᵤ<br><br>
              <b>Алиса:</b>  (5−3.5)=1.5,  (3−3.5)=−0.5,  ?,  (4−3.5)=0.5,  (2−3.5)=−1.5<br>
              → Алиса' = [1.5, −0.5, ?, 0.5, −1.5]<br><br>
              <b>Борис:</b>  (4−3.4)=0.6,  (2−3.4)=−1.4,  (5−3.4)=1.6,  (5−3.4)=1.6,  (1−3.4)=−2.4<br>
              → Борис' = [0.6, −1.4, 1.6, 1.6, −2.4]<br><br>
              <b>Вера:</b>  (2−2.8)=−0.8,  (5−2.8)=2.2,  (2−2.8)=−0.8,  (1−2.8)=−1.8,  (4−2.8)=1.2<br>
              → Вера' = [−0.8, 2.2, −0.8, −1.8, 1.2]<br><br>
              <b>Глеб:</b>  (5−3.2)=1.8,  (1−3.2)=−2.2,  (4−3.2)=0.8,  (4−3.2)=0.8,  (2−3.2)=−1.2<br>
              → Глеб' = [1.8, −2.2, 0.8, 0.8, −1.2]<br><br>
              <b>Дина:</b>  (1−2.6)=−1.6,  (4−2.6)=1.4,  (1−2.6)=−1.6,  (2−2.6)=−0.6,  (5−2.6)=2.4<br>
              → Дина' = [−1.6, 1.4, −1.6, −0.6, 2.4]
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: вычислить косинусное сходство Алисы с каждым пользователем</h4>
            <div class="calc">
              Для сравнения берём только фильмы, оценённые <b>обоими</b> (у Алисы нет «Матрицы»).<br>
              Общие позиции: Начало, Титаник, Дюна, Амели (индексы 0,1,3,4).<br><br>
              Алиса' (общ.) = [1.5, −0.5, 0.5, −1.5]<br>
              ‖Алиса'‖ = √(2.25+0.25+0.25+2.25) = √5.0 = <b>2.236</b><br><br>

              <b>sim(Алиса, Борис):</b><br>
              Борис' (общ.) = [0.6, −1.4, 1.6, −2.4]<br>
              Числитель = 1.5×0.6 + (−0.5)×(−1.4) + 0.5×1.6 + (−1.5)×(−2.4)<br>
              = 0.9 + 0.7 + 0.8 + 3.6 = <b>6.0</b><br>
              ‖Борис'‖ = √(0.36+1.96+2.56+5.76) = √10.64 = <b>3.262</b><br>
              sim = 6.0 / (2.236 × 3.262) = 6.0 / 7.294 = <b>0.822</b><br><br>

              <b>sim(Алиса, Вера):</b><br>
              Вера' (общ.) = [−0.8, 2.2, −1.8, 1.2]<br>
              Числитель = 1.5×(−0.8) + (−0.5)×2.2 + 0.5×(−1.8) + (−1.5)×1.2<br>
              = −1.2 − 1.1 − 0.9 − 1.8 = <b>−5.0</b><br>
              ‖Вера'‖ = √(0.64+4.84+3.24+1.44) = √10.16 = <b>3.188</b><br>
              sim = −5.0 / (2.236 × 3.188) = −5.0 / 7.126 = <b>−0.702</b><br><br>

              <b>sim(Алиса, Глеб):</b><br>
              Глеб' (общ.) = [1.8, −2.2, 0.8, −1.2]<br>
              Числитель = 1.5×1.8 + (−0.5)×(−2.2) + 0.5×0.8 + (−1.5)×(−1.2)<br>
              = 2.7 + 1.1 + 0.4 + 1.8 = <b>6.0</b><br>
              ‖Глеб'‖ = √(3.24+4.84+0.64+1.44) = √10.16 = <b>3.188</b><br>
              sim = 6.0 / (2.236 × 3.188) = 6.0 / 7.126 = <b>0.842</b><br><br>

              <b>sim(Алиса, Дина):</b><br>
              Дина' (общ.) = [−1.6, 1.4, −0.6, 2.4]<br>
              Числитель = 1.5×(−1.6) + (−0.5)×1.4 + 0.5×(−0.6) + (−1.5)×2.4<br>
              = −2.4 − 0.7 − 0.3 − 3.6 = <b>−7.0</b><br>
              ‖Дина'‖ = √(2.56+1.96+0.36+5.76) = √10.64 = <b>3.262</b><br>
              sim = −7.0 / (2.236 × 3.262) = −7.0 / 7.294 = <b>−0.959</b>
            </div>
            <div class="why">Положительное сходство — похожие вкусы. Отрицательное — противоположные. Глеб и Борис наиболее похожи на Алису.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: выбрать k=2 ближайших соседа и предсказать оценку</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Пользователь</th><th>sim с Алисой</th><th>Оценка «Матрица»</th><th>Центрированная</th></tr>
                <tr style="background:#e0f2e9"><td><b>Глеб</b></td><td><b>0.842</b></td><td>4</td><td>0.8</td></tr>
                <tr style="background:#e0f2e9"><td><b>Борис</b></td><td><b>0.822</b></td><td>5</td><td>1.6</td></tr>
                <tr><td>Вера</td><td>−0.702</td><td>2</td><td>−0.8</td></tr>
                <tr><td>Дина</td><td>−0.959</td><td>1</td><td>−1.6</td></tr>
              </table>
            </div>
            <div class="calc">
              Формула предсказания (с центрированием):<br>
              r̂(Алиса, Матрица) = r̄(Алиса) + Σ[sim × (r−r̄)] / Σ|sim|<br><br>
              Числитель = 0.842 × 0.8 + 0.822 × 1.6 = 0.674 + 1.315 = <b>1.989</b><br>
              Знаменатель = |0.842| + |0.822| = <b>1.664</b><br><br>
              r̂ = 3.50 + 1.989/1.664 = 3.50 + 1.195 = <b>4.70</b>
            </div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Предсказанная оценка Алисы для «Матрицы» = <b>4.70</b> (≈ 5 из 5). Это логично: Алиса похожа на Бориса (sim=0.82) и Глеба (sim=0.84), которые оба высоко оценили «Матрицу» (5 и 4). У них общий паттерн: любят sci-fi (Начало, Дюна), не любят мелодрамы (Титаник, Амели).</p>
          </div>
          <div class="lesson-box">
            На практике: user-user CF плохо масштабируется (n² сравнений пользователей). Для миллионов пользователей используют item-item CF или матричную факторизацию. Также важно выбрать минимальное число общих оценок (threshold) для надёжного сходства.
          </div>
        `,
      },
      {
        title: 'Матричная факторизация (SVD)',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Матрица оценок 4 пользователя × 5 фильмов с пропусками. Разложить на U×V^T с k=2 латентными факторами, показать как «всплывают» скрытые паттерны (любитель экшена, любитель романтики), восстановить пропущенные оценки.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Пользователь</th><th>Терминатор</th><th>Дневник памяти</th><th>Безумный Макс</th><th>Гордость и предубеждение</th><th>Джон Уик</th></tr>
              <tr><td>Петя</td><td>5</td><td>1</td><td>4</td><td>?</td><td>5</td></tr>
              <tr><td>Маша</td><td>1</td><td>5</td><td>?</td><td>4</td><td>1</td></tr>
              <tr><td>Коля</td><td>4</td><td>?</td><td>5</td><td>1</td><td>4</td></tr>
              <tr><td>Оля</td><td>?</td><td>4</td><td>1</td><td>5</td><td>?</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: интуиция — почему k=2 фактора</h4>
            <div class="calc">
              Посмотрим на паттерны в данных:<br><br>
              Петя и Коля: любят «Терминатор», «Безумный Макс», «Джон Уик» — <b>экшен</b><br>
              Маша и Оля: любят «Дневник памяти», «Гордость и предубеждение» — <b>романтика</b><br><br>
              Гипотеза: есть 2 скрытых фактора:<br>
              Фактор 1: «экшен» (высокий → любит экшен)<br>
              Фактор 2: «романтика» (высокий → любит романтику)
            </div>
            <div class="why">Матричная факторизация обнаруживает такие скрытые паттерны автоматически. Мы задаём только число факторов k, а модель сама определяет их «смысл».</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: задать латентные векторы (после обучения ALS)</h4>
            <div class="calc">
              После обучения (минимизация MSE на наблюдённых оценках + регуляризация):<br><br>
              <b>Пользовательские векторы U (users × 2):</b><br>
              Петя = [2.2, 0.3]  — высокий «экшен», низкая «романтика»<br>
              Маша = [0.3, 2.1]  — низкий «экшен», высокая «романтика»<br>
              Коля = [2.0, 0.2]  — высокий «экшен», низкая «романтика»<br>
              Оля  = [0.2, 2.0]  — низкий «экшен», высокая «романтика»<br><br>
              <b>Item-векторы V (items × 2):</b><br>
              Терминатор              = [2.3, 0.2]<br>
              Дневник памяти          = [0.2, 2.3]<br>
              Безумный Макс           = [2.1, 0.1]<br>
              Гордость и предубеждение = [0.1, 2.2]<br>
              Джон Уик                = [2.2, 0.3]
            </div>
            <div class="why">Векторы пользователей и фильмов живут в одном 2D пространстве. «Экшен-фильмы» и «экшен-любители» имеют высокий первый компонент. Скалярное произведение похожих = высокая оценка.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: восстановить пропущенные оценки</h4>
            <div class="calc">
              r̂ = u⃗ · v⃗ᵀ (скалярное произведение)<br><br>
              <b>Петя × «Гордость и предубеждение»:</b><br>
              r̂ = [2.2, 0.3] · [0.1, 2.2] = 2.2×0.1 + 0.3×2.2 = 0.22 + 0.66 = <b>0.88 ≈ 1</b><br>
              → Петя — любитель экшена, романтика ему не близка. Логично!<br><br>
              <b>Маша × «Безумный Макс»:</b><br>
              r̂ = [0.3, 2.1] · [2.1, 0.1] = 0.3×2.1 + 2.1×0.1 = 0.63 + 0.21 = <b>0.84 ≈ 1</b><br>
              → Маша — любительница романтики, экшен не для неё.<br><br>
              <b>Коля × «Дневник памяти»:</b><br>
              r̂ = [2.0, 0.2] · [0.2, 2.3] = 2.0×0.2 + 0.2×2.3 = 0.40 + 0.46 = <b>0.86 ≈ 1</b><br>
              → Коля — экшенист, романтика не зайдёт.<br><br>
              <b>Оля × «Терминатор»:</b><br>
              r̂ = [0.2, 2.0] · [2.3, 0.2] = 0.2×2.3 + 2.0×0.2 = 0.46 + 0.40 = <b>0.86 ≈ 1</b><br>
              → Оля предпочитает романтику, экшен не для неё.<br><br>
              <b>Оля × «Джон Уик»:</b><br>
              r̂ = [0.2, 2.0] · [2.2, 0.3] = 0.2×2.2 + 2.0×0.3 = 0.44 + 0.60 = <b>1.04 ≈ 1</b>
            </div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: проверить на наблюдённых оценках</h4>
            <div class="calc">
              <b>Петя × «Терминатор» (реальная оценка 5):</b><br>
              r̂ = [2.2, 0.3] · [2.3, 0.2] = 5.06 + 0.06 = <b>5.12 ≈ 5</b> ✓<br><br>
              <b>Маша × «Дневник памяти» (реальная оценка 5):</b><br>
              r̂ = [0.3, 2.1] · [0.2, 2.3] = 0.06 + 4.83 = <b>4.89 ≈ 5</b> ✓<br><br>
              <b>Петя × «Дневник памяти» (реальная оценка 1):</b><br>
              r̂ = [2.2, 0.3] · [0.2, 2.3] = 0.44 + 0.69 = <b>1.13 ≈ 1</b> ✓
            </div>
            <div class="why">Модель хорошо восстанавливает наблюдённые оценки — значит, латентные факторы правильно уловили структуру данных.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Два латентных фактора — «экшен» и «романтика» — полностью объясняют матрицу оценок. Все пропущенные оценки восстановлены как ~1 (низкие), потому что в нашем примере каждый пользователь чётко принадлежит одному «лагерю». В реальности латентные факторы менее интерпретируемы и их больше (50–200).</p>
          </div>
          <div class="lesson-box">
            На практике: используют FunkSVD (Simon Funk, Netflix Prize) или ALS из библиотеки implicit. Важно добавлять bias-термы: r̂ = μ + bᵤ + bᵢ + u⃗·v⃗, где μ — глобальное среднее, bᵤ — смещение пользователя, bᵢ — смещение item'а. Это значительно улучшает качество.
          </div>
        `,
      },
      {
        title: 'Content-Based для фильмов',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>4 фильма описаны вектором жанровых признаков. Пользователь оценил 2 фильма. Найти, какой из оставшихся фильмов рекомендовать, используя content-based подход с косинусным сходством.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Фильм</th><th>Экшен</th><th>Романтика</th><th>Sci-Fi</th><th>Комедия</th><th>Оценка юзера</th></tr>
              <tr><td>Интерстеллар</td><td>0.3</td><td>0.2</td><td>0.9</td><td>0.0</td><td>5 ⭐</td></tr>
              <tr><td>Дэдпул</td><td>0.8</td><td>0.3</td><td>0.2</td><td>0.7</td><td>2 ⭐</td></tr>
              <tr><td>Прибытие</td><td>0.1</td><td>0.1</td><td>0.8</td><td>0.0</td><td>?</td></tr>
              <tr><td>Форсаж</td><td>0.9</td><td>0.1</td><td>0.1</td><td>0.3</td><td>?</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: построить профиль пользователя</h4>
            <div class="calc">
              Профиль = взвешенная сумма векторов оценённых фильмов.<br>
              Вес = нормализованная оценка (от −1 до 1):<br>
              Средняя оценка = (5+2)/2 = 3.5<br>
              w(Интерстеллар) = (5−3.5)/1.5 = <b>+1.0</b><br>
              w(Дэдпул) = (2−3.5)/1.5 = <b>−1.0</b><br><br>

              Профиль юзера = w₁·v₁ + w₂·v₂<br>
              = 1.0 × [0.3, 0.2, 0.9, 0.0] + (−1.0) × [0.8, 0.3, 0.2, 0.7]<br>
              = [0.3, 0.2, 0.9, 0.0] + [−0.8, −0.3, −0.2, −0.7]<br>
              = [<b>−0.5, −0.1, 0.7, −0.7</b>]
            </div>
            <div class="why">Профиль показывает: пользователь любит Sci-Fi (+0.7), не любит экшен (−0.5) и комедию (−0.7). Это отражает высокую оценку Интерстеллара и низкую — Дэдпула.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: вычислить косинусное сходство профиля с каждым фильмом-кандидатом</h4>
            <div class="calc">
              Профиль P = [−0.5, −0.1, 0.7, −0.7]<br>
              ‖P‖ = √(0.25+0.01+0.49+0.49) = √1.24 = <b>1.114</b><br><br>

              <b>sim(P, Прибытие):</b><br>
              Прибытие = [0.1, 0.1, 0.8, 0.0]<br>
              ‖Прибытие‖ = √(0.01+0.01+0.64+0.0) = √0.66 = <b>0.812</b><br>
              Числитель = (−0.5)×0.1 + (−0.1)×0.1 + 0.7×0.8 + (−0.7)×0.0<br>
              = −0.05 − 0.01 + 0.56 + 0.0 = <b>0.50</b><br>
              sim = 0.50 / (1.114 × 0.812) = 0.50 / 0.905 = <b>0.553</b><br><br>

              <b>sim(P, Форсаж):</b><br>
              Форсаж = [0.9, 0.1, 0.1, 0.3]<br>
              ‖Форсаж‖ = √(0.81+0.01+0.01+0.09) = √0.92 = <b>0.959</b><br>
              Числитель = (−0.5)×0.9 + (−0.1)×0.1 + 0.7×0.1 + (−0.7)×0.3<br>
              = −0.45 − 0.01 + 0.07 − 0.21 = <b>−0.60</b><br>
              sim = −0.60 / (1.114 × 0.959) = −0.60 / 1.069 = <b>−0.561</b>
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: ранжировать и рекомендовать</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Фильм</th><th>Сходство с профилем</th><th>Рекомендация</th></tr>
                <tr style="background:#e0f2e9"><td><b>Прибытие</b></td><td><b>+0.553</b></td><td>✓ Рекомендовать</td></tr>
                <tr><td>Форсаж</td><td>−0.561</td><td>✗ Не рекомендовать</td></tr>
              </table>
            </div>
            <div class="calc">
              «Прибытие» (sci-fi, low action) похоже на профиль: sim = +0.553<br>
              «Форсаж» (action, low sci-fi) противоположен профилю: sim = −0.561<br><br>
              Рекомендуем: <b>«Прибытие»</b>
            </div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Content-based система рекомендует «Прибытие» (sim=+0.553), а не «Форсаж» (sim=−0.561). Система правильно уловила, что пользователь предпочитает научную фантастику, а не экшен-боевики — на основе всего двух оценок.</p>
          </div>
          <div class="lesson-box">
            Преимущество content-based: работает даже для новых items (нет cold start для items, если есть описание). Недостаток: не может рекомендовать «неожиданные» items за пределами привычных жанров — нет serendipity. Поэтому лучшие системы используют гибридный подход.
          </div>
        `,
      },
    ],

    python: `
      <h3>Python: рекомендательные системы</h3>
      <p>Основные библиотеки: <b>surprise</b> (collaborative filtering), <b>implicit</b> (implicit feedback, ALS), <b>sklearn</b> (cosine_similarity для content-based).</p>

      <h4>1. Content-Based: TF-IDF + косинусное сходство</h4>
      <pre><code>import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Датасет фильмов с описаниями
movies = pd.DataFrame({
    'title': ['Интерстеллар', 'Прибытие', 'Дэдпул', 'Форсаж', 'Гравитация'],
    'description': [
        'космос путешествие время чёрная дыра научная фантастика',
        'инопланетяне язык лингвистика время научная фантастика',
        'супергерой юмор экшен боевик комедия',
        'гонки машины экшен боевик скорость',
        'космос астронавт выживание орбита научная фантастика',
    ]
})

# TF-IDF векторизация описаний
tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(movies['description'])

# Матрица сходства
sim_matrix = cosine_similarity(tfidf_matrix)
print("Матрица сходства фильмов:")
print(pd.DataFrame(sim_matrix, index=movies['title'], columns=movies['title']).round(2))

# Рекомендация: найти фильмы, похожие на «Интерстеллар»
idx = 0  # Интерстеллар
scores = list(enumerate(sim_matrix[idx]))
scores = sorted(scores, key=lambda x: x[1], reverse=True)[1:]  # исключаем сам фильм
print(f"\\nПохожие на '{movies['title'][idx]}':")
for i, score in scores:
    print(f"  {movies['title'][i]}: {score:.3f}")</code></pre>

      <h4>2. Collaborative Filtering с библиотекой Surprise</h4>
      <pre><code># pip install scikit-surprise
from surprise import Dataset, Reader, SVD, KNNBasic
from surprise.model_selection import cross_validate
import pandas as pd

# Создаём датасет оценок
ratings = pd.DataFrame({
    'user': ['Алиса','Алиса','Алиса','Борис','Борис','Борис',
             'Вера','Вера','Вера','Глеб','Глеб','Глеб'],
    'item': ['Начало','Титаник','Дюна','Начало','Матрица','Титаник',
             'Титаник','Дюна','Матрица','Начало','Дюна','Матрица'],
    'rating': [5, 3, 4, 4, 5, 2, 5, 1, 2, 5, 4, 4]
})

reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(ratings[['user', 'item', 'rating']], reader)

# --- SVD (матричная факторизация) ---
svd = SVD(n_factors=2, n_epochs=50, random_state=42)
cv_results = cross_validate(svd, data, measures=['RMSE', 'MAE'], cv=3, verbose=True)

# Обучим на всех данных и предскажем
trainset = data.build_full_trainset()
svd.fit(trainset)

# Предсказание для Алисы на «Матрицу»
pred = svd.predict('Алиса', 'Матрица')
print(f"\\nПредсказание: Алиса → Матрица = {pred.est:.2f}")

# --- User-based kNN ---
knn = KNNBasic(k=2, sim_options={'name': 'cosine', 'user_based': True})
knn.fit(trainset)
pred_knn = knn.predict('Алиса', 'Матрица')
print(f"Предсказание (kNN): Алиса → Матрица = {pred_knn.est:.2f}")</code></pre>

      <h4>3. Implicit Feedback: ALS</h4>
      <pre><code># pip install implicit
import implicit
import numpy as np
from scipy.sparse import csr_matrix

# Матрица взаимодействий (implicit: клики, покупки)
# Строки — items, столбцы — users (формат implicit)
interactions = np.array([
    [10, 0, 5, 0],   # item 0: user0 кликнул 10 раз, user2 — 5 раз
    [0, 8, 0, 7],    # item 1
    [6, 0, 9, 0],    # item 2
    [0, 4, 0, 10],   # item 3
    [8, 1, 7, 0],    # item 4
])
item_user = csr_matrix(interactions)

# ALS модель
model = implicit.als.AlternatingLeastSquares(
    factors=2,
    regularization=0.1,
    iterations=50,
    random_state=42
)
model.fit(item_user)

# Рекомендации для user 0
user_items = item_user.T.tocsr()  # user-item матрица
ids, scores = model.recommend(0, user_items[0], N=3, filter_already_liked_items=True)
print("Рекомендации для user 0:")
for item_id, score in zip(ids, scores):
    print(f"  Item {item_id}: score={score:.3f}")

# Похожие items
similar = model.similar_items(0, N=3)
print("\\nПохожие на item 0:", similar)</code></pre>

      <h4>4. Метрики качества рекомендаций</h4>
      <pre><code>import numpy as np

def precision_at_k(recommended, relevant, k):
    """Precision@K: доля релевантных среди top-K рекомендаций"""
    rec_k = recommended[:k]
    hits = len(set(rec_k) & set(relevant))
    return hits / k

def recall_at_k(recommended, relevant, k):
    """Recall@K: доля найденных релевантных из всех релевантных"""
    rec_k = recommended[:k]
    hits = len(set(rec_k) & set(relevant))
    return hits / len(relevant) if relevant else 0

def ndcg_at_k(recommended, relevant, k):
    """NDCG@K: учитывает позицию релевантного item'а"""
    dcg = 0
    for i, item in enumerate(recommended[:k]):
        if item in relevant:
            dcg += 1 / np.log2(i + 2)  # позиция от 1
    # Идеальный DCG
    idcg = sum(1/np.log2(i+2) for i in range(min(len(relevant), k)))
    return dcg / idcg if idcg > 0 else 0

# Пример
recommended = ['Прибытие', 'Гравитация', 'Форсаж', 'Дэдпул', 'Амели']
relevant = ['Прибытие', 'Гравитация', 'Марсианин']

for k in [1, 3, 5]:
    p = precision_at_k(recommended, relevant, k)
    r = recall_at_k(recommended, relevant, k)
    n = ndcg_at_k(recommended, relevant, k)
    print(f"K={k}: Precision={p:.2f}, Recall={r:.2f}, NDCG={n:.3f}")</code></pre>
    `,

    applications: `
      <h3>Где применяются рекомендательные системы</h3>
      <ul>
        <li><b>Стриминг видео (Netflix, YouTube)</b> — персонализированная лента, «Вам может понравиться». Netflix оценивает, что 80% просмотров приходит из рекомендаций.</li>
        <li><b>Музыка (Spotify, Яндекс.Музыка)</b> — плейлисты Discover Weekly, радио по вкусам. Используют collaborative filtering + audio features (content-based по спектрограммам).</li>
        <li><b>E-commerce (Amazon, Wildberries, Ozon)</b> — «С этим товаром покупают», «Рекомендовано для вас». Item-item CF — основа «Amazon'овской» рекомендации.</li>
        <li><b>Новостные ленты (Яндекс.Дзен, TikTok)</b> — ранжирование контента по предсказанному интересу. TikTok использует deep learning модели с implicit feedback (время просмотра, replay).</li>
        <li><b>Социальные сети (ВКонтакте, Instagram)</b> — «Люди, которых вы можете знать», рекомендации постов и сообществ.</li>
        <li><b>Работа (LinkedIn, hh.ru)</b> — подбор вакансий по резюме и истории откликов.</li>
        <li><b>Реклама</b> — таргетированная реклама — по сути рекомендация рекламных объявлений конкретному пользователю (CTR prediction).</li>
        <li><b>Банки и финтех</b> — рекомендации финансовых продуктов (вклады, кредиты, страховки) на основе профиля клиента.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Content-Based</h4>
          <ul>
            <li>Нет cold start для items (есть признаки)</li>
            <li>Прозрачность: можно объяснить «почему»</li>
            <li>Не нужны данные других пользователей</li>
            <li>Работает для нишевых items</li>
          </ul>
          <h4>✓ Collaborative Filtering</h4>
          <ul>
            <li>Не нужны признаки items</li>
            <li>Находит неожиданные рекомендации (serendipity)</li>
            <li>Автоматически улавливает сложные паттерны</li>
            <li>Масштабируется через matrix factorization</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Content-Based</h4>
          <ul>
            <li>Нужны качественные признаки items</li>
            <li>Overspecialization — рекомендует «больше того же»</li>
            <li>Cold start для новых пользователей</li>
            <li>Не учитывает мнения сообщества</li>
          </ul>
          <h4>✗ Collaborative Filtering</h4>
          <ul>
            <li>Cold start для новых пользователей И items</li>
            <li>Разреженность матрицы (sparsity problem)</li>
            <li>Popularity bias — «рекомендует популярное»</li>
            <li>Плохая интерпретируемость</li>
            <li>Масштабируемость user-user CF (O(n²))</li>
          </ul>
        </div>
      </div>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=Eeg1DEeWUjA" target="_blank">StatQuest: Recommendation Systems</a> — визуальное введение в рекомендательные системы</li>
        <li><a href="https://www.youtube.com/watch?v=ZspR5PZemcs" target="_blank">Google: Recommendation Systems (ML Crash Course)</a> — collaborative filtering и matrix factorization от Google</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D1%80%D0%B5%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%8B" target="_blank">Рекомендательные системы на Habr</a> — подборка статей на русском языке</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://surprise.readthedocs.io/en/stable/" target="_blank">Surprise</a> — библиотека для collaborative filtering на Python</li>
        <li><a href="https://benfred.github.io/implicit/" target="_blank">Implicit</a> — ALS, BPR и другие модели для implicit feedback</li>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html" target="_blank">sklearn: cosine_similarity</a> — вычисление косинусного сходства</li>
      </ul>
    `,
  },
});
