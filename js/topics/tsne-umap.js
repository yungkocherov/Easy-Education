/* ==========================================================================
   t-SNE и UMAP: нелинейное снижение размерности
   ========================================================================== */
App.registerTopic({
  id: 'tsne-umap',
  category: 'ml-unsup',
  title: 't-SNE и UMAP',
  summary: 'Нелинейное снижение размерности для визуализации кластеров.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('pca')">PCA</a> ·
        <a onclick="App.selectTopic('kmeans')">K-Means</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что данные лежат на поверхности скомканного листа бумаги в трёх измерениях. <b>PCA</b> проецирует бумагу на стол: он видит только «тени» и теряет всю структуру складок. <b>t-SNE и UMAP</b> аккуратно разворачивают бумагу и раскладывают на столе — сохраняя соседей рядом.</p>
        <p>PCA ищет <b>прямые</b> направления максимальной дисперсии. Но если кластеры лежат на нелинейном многообразии (manifold) — спирали, кольца, вложенные сферы — прямые направления бесполезны. t-SNE и UMAP работают с <b>локальными расстояниями</b>: «кто является соседом кого?» — и пытаются сохранить это в 2D.</p>
        <p>Результат: из 784-мерного пространства MNIST получается красивый 2D-график, где каждая цифра образует свой кластер. PCA на тех же данных даёт размытое облако.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <text x="270" y="17" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Высокоразмерные кластеры → 2D визуализация</text>
          <!-- High-D blob on left -->
          <rect x="20" y="30" width="160" height="160" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
          <text x="100" y="48" text-anchor="middle" font-size="10" font-weight="600" fill="#64748b">Высокая размерность</text>
          <text x="100" y="60" text-anchor="middle" font-size="9" fill="#94a3b8">(5D, 50D, 784D...)</text>
          <!-- Overlapping blobs in high-D -->
          <ellipse cx="80" cy="110" rx="35" ry="28" fill="#6366f1" fill-opacity="0.3" stroke="#6366f1" stroke-width="1"/>
          <ellipse cx="115" cy="100" rx="30" ry="25" fill="#ef4444" fill-opacity="0.3" stroke="#ef4444" stroke-width="1"/>
          <ellipse cx="95" cy="145" rx="28" ry="20" fill="#10b981" fill-opacity="0.3" stroke="#10b981" stroke-width="1"/>
          <text x="100" y="195" text-anchor="middle" font-size="9" fill="#64748b">кластеры перекрываются</text>
          <!-- Arrow -->
          <text x="200" y="118" font-size="22" fill="#6366f1">→</text>
          <text x="192" y="105" font-size="9" fill="#64748b">t-SNE</text>
          <text x="192" y="132" font-size="9" fill="#64748b">UMAP</text>
          <!-- 2D result on right -->
          <rect x="230" y="30" width="290" height="160" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
          <text x="375" y="48" text-anchor="middle" font-size="10" font-weight="600" fill="#64748b">2D визуализация</text>
          <!-- Separated clusters -->
          <ellipse cx="295" cy="105" rx="38" ry="30" fill="#6366f1" fill-opacity="0.25" stroke="#6366f1" stroke-width="1.5"/>
          <text x="295" y="108" text-anchor="middle" font-size="10" fill="#6366f1" font-weight="600">Кластер 1</text>
          <ellipse cx="415" cy="90" rx="38" ry="28" fill="#ef4444" fill-opacity="0.25" stroke="#ef4444" stroke-width="1.5"/>
          <text x="415" y="93" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="600">Кластер 2</text>
          <ellipse cx="370" cy="155" rx="36" ry="24" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.5"/>
          <text x="370" y="158" text-anchor="middle" font-size="10" fill="#10b981" font-weight="600">Кластер 3</text>
          <text x="375" y="195" text-anchor="middle" font-size="9" fill="#64748b">кластеры чётко разделены</text>
        </svg>
        <div class="caption">t-SNE и UMAP «разворачивают» нелинейную структуру данных, разделяя кластеры, которые в исходном пространстве перекрывались. PCA дал бы тот же размытый результат, что и слева.</div>
      </div>

      <h3>🎯 Почему PCA недостаточен</h3>
      <p><span class="term" data-tip="PCA (Principal Component Analysis): линейное снижение размерности, проецирует данные на направления максимальной дисперсии. Не может обнаружить нелинейные структуры.">PCA</span> ищет линейную проекцию: $z = Wx$, где $W$ — матрица главных компонент. Это хорошо для:</p>
      <ul>
        <li>Данных с линейными зависимостями</li>
        <li>Шумовой фильтрации (первые K компонент захватывают «сигнал»)</li>
        <li>Инициализации t-SNE/UMAP (уменьшить с 784D до 50D перед t-SNE)</li>
      </ul>
      <p>Но PCA <b>провалится</b> когда: данные лежат на нелинейном многообразии (швейцарский рулет, тор, клубок), классы разделяются нелинейно, или локальная структура важнее глобальной.</p>

      <h3>🌡️ t-SNE: притяжение и отталкивание</h3>
      <p>t-SNE (t-distributed Stochastic Neighbor Embedding) работает в два шага:</p>
      <ol>
        <li><b>В исходном пространстве:</b> для каждой пары точек вычисляется вероятность $p_{ij}$ — насколько они «близкие соседи». Используется гауссиан с шириной $\\sigma_i$ (контролируется perplexity).</li>
        <li><b>В 2D пространстве:</b> вычисляются вероятности $q_{ij}$ через <span class="term" data-tip="Распределение Стьюдента с 1 степенью свободы (Коши). Тяжёлые хвосты позволяют умеренно далёким точкам быть очень далеко в 2D — решает проблему скученности.">распределение Стьюдента</span> (t-distribution, тяжёлые хвосты).</li>
      </ol>
      <p>Минимизируется KL-дивергенция между $p_{ij}$ и $q_{ij}$:</p>
      <div class="math-block">$$KL(P \\| Q) = \\sum_{i \\neq j} p_{ij} \\log \\frac{p_{ij}}{q_{ij}}$$</div>
      <p>Результат: точки, которые соседи в исходном пространстве, притягиваются друг к другу в 2D. Дальние точки отталкиваются. Тяжёлые хвосты t-distribution решают <b>проблему скученности</b> (crowding problem): в высоких измерениях средние расстояния становятся одинаковыми, и нужен «усиленный» разброс в 2D.</p>

      <div class="key-concept">
        <div class="kc-label">Perplexity: ключевой параметр t-SNE</div>
        <p><span class="term" data-tip="Perplexity в t-SNE: приблизительное число соседей, которое рассматривается для каждой точки. Типичные значения: 5–50. Малая perplexity — локальная структура, большая — глобальная.">Perplexity</span> управляет «эффективным числом соседей»: perplexity ≈ 5 → смотрим только на ближайших 5 соседей (очень локально). perplexity ≈ 50 → смотрим на ближайших 50 (более глобально). Типичные значения: 5–50. Правило: perplexity &lt; N/3. При разных perplexity один и тот же датасет выглядит по-разному — это нормально!</p>
      </div>

      <h3>⚡ UMAP: быстрее и лучше сохраняет глобальную структуру</h3>
      <p><span class="term" data-tip="UMAP (Uniform Manifold Approximation and Projection): основан на топологии Риманова многообразия. Строит fuzzy topological graph в исходном пространстве, затем оптимизирует его в 2D.">UMAP</span> основан на математически более строгом фундаменте (топология многообразий Римана), но интуиция похожа:</p>
      <ol>
        <li><b>Строит граф k-ближайших соседей</b> в исходном пространстве с взвешенными рёбрами.</li>
        <li><b>Оптимизирует низкоразмерное представление</b>, чтобы его граф был похож на исходный.</li>
      </ol>
      <p>Ключевые преимущества UMAP перед t-SNE:</p>
      <ul>
        <li>В 5–10 раз быстрее на больших датасетах</li>
        <li>Лучше сохраняет <b>глобальную структуру</b> (расстояния между кластерами более осмысленны)</li>
        <li>Детерминирован (при фиксированном random_state)</li>
        <li>Параметрический UMAP: можно обучить и применять к новым данным</li>
      </ul>

      <h3>🎛️ Параметры UMAP</h3>
      <ul>
        <li><b>n_neighbors (5–50):</b> аналог perplexity. Малое значение → мелкая локальная структура. Большое → глобальная структура.</li>
        <li><b>min_dist (0.0–0.99):</b> минимальное расстояние между точками в 2D. Малое → плотные компактные кластеры. Большое → рассеянные точки, лучше видна непрерывная структура.</li>
        <li><b>metric:</b> метрика расстояния в исходном пространстве (euclidean, cosine, manhattan...).</li>
      </ul>

      <h3>⚠️ Критические предупреждения</h3>
      <ul>
        <li>🚫 <b>Расстояния между кластерами в t-SNE/UMAP НЕ ИМЕЮТ СМЫСЛА.</b> Кластер А может быть «далеко» от Б на картинке, но это не значит ничего о реальных расстояниях.</li>
        <li>🚫 <b>Размеры кластеров НЕ ИМЕЮТ СМЫСЛА.</b> Большой кластер может быть малочисленным.</li>
        <li>🚫 <b>Не кластеризуй на выходе t-SNE.</b> Кластеры, видимые на t-SNE, — артефакт алгоритма. K-means на t-SNE coordinates = ошибка.</li>
        <li>✅ Используй t-SNE/UMAP только для <b>визуализации</b> — чтобы убедиться, что структура есть. Кластеризацию делай в исходном пространстве.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Как правильно интерпретировать t-SNE / UMAP</div>
        <p>Многие предупреждения пугают новичков. Вот что <b>можно</b> и <b>нельзя</b> извлечь:</p>
        <p><b>✅ Можно:</b></p>
        <ul>
          <li><b>Кластерная структура:</b> если точки образуют отдельные «облака» — в данных есть группы. Раскрасьте точки по меткам: если кластеры совпадают с классами — признаки хорошо разделяют классы.</li>
          <li><b>Выбросы:</b> точки, далёкие от всех кластеров — потенциальные аномалии.</li>
          <li><b>Подгруппы:</b> кластер, распавшийся на два подоблака — возможная скрытая структура.</li>
          <li><b>Quality check:</b> если данные после обучения модели хорошо разделяются на t-SNE — модель выучила полезные representation.</li>
        </ul>
        <p><b>❌ Нельзя:</b></p>
        <ul>
          <li><b>Расстояния:</b> «кластер A далеко от B» ≠ «A и B непохожи». Расстояния между кластерами не сохраняются.</li>
          <li><b>Размеры:</b> «кластер A больше B» ≠ «A более разнообразен». Плотность искажается.</li>
          <li><b>Формы:</b> вытянутость или округлость кластера — артефакт, а не свойство данных.</li>
        </ul>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: параметрический UMAP и использование для предкластеризации</summary>
        <div class="deep-dive-body">
          <p>Обычный UMAP — трансдуктивный: не может применить обученное преобразование к новым данным. <b>Parametric UMAP</b> (доступен в пакете umap-learn) обучает нейросеть для проекции — можно вызвать <code>transform(X_new)</code> без переобучения.</p>
          <p>Практический workflow:</p>
          <ol>
            <li>Снизить размерность с PCA до 50 (быстро убирает шум)</li>
            <li>Применить UMAP с n_neighbors=15, min_dist=0.1 → 2D/3D</li>
            <li>Визуализировать и убедиться, что кластеры есть</li>
            <li>Запустить HDBSCAN в <b>исходном</b> или PCA-50 пространстве</li>
            <li>Покрасить визуализацию UMAP цветами из HDBSCAN</li>
          </ol>
          <p>Не используй <code>n_components=2</code> UMAP как вход для K-means — это выбрасывает большую часть информации.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: проблема скученности (crowding problem) в t-SNE</summary>
        <div class="deep-dive-body">
          <p>В высоких измерениях возникает парадокс: у каждой точки очень много «средних» соседей и почти нет «очень близких» или «очень далёких». Всё скучивается в узком диапазоне расстояний.</p>
          <p>Если использовать гауссиан и в исходном, и в 2D пространстве — невозможно правильно разместить средних соседей: для них нет места (2D слишком маленькое). Решение t-SNE: в 2D использовать распределение Стьюдента с тяжёлыми хвостами:</p>
          <div class="math-block">$$q_{ij} = \\frac{(1 + \\|y_i - y_j\\|^2)^{-1}}{\\sum_{k \\neq l}(1 + \\|y_k - y_l\\|^2)^{-1}}$$</div>
          <p>Тяжёлые хвосты позволяют «умеренно далёким» точкам быть очень далеко в 2D — освобождая место для ближайших соседей и создавая чёткие кластеры.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>PCA:</b> линейный предшественник. Всегда запускай PCA перед t-SNE на высоких размерностях (784→50, потом 50→2).</li>
        <li><b>K-means / DBSCAN:</b> кластеризуй в исходном или PCA-пространстве, визуализируй с UMAP/t-SNE.</li>
        <li><b>Нейросети (автоэнкодеры):</b> альтернатива для нелинейного снижения размерности — обучаемая, масштабируемая.</li>
        <li><b>Product Analytics:</b> визуализация пользовательских сегментов, поведенческих паттернов.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Perplexity: 5 vs 30 vs 100',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Один и тот же датасет (3 кластера, 500 точек, 10 признаков) визуализируется с t-SNE при разных perplexity. Понять, как параметр меняет картину.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Perplexity</th><th>Число «соседей»</th><th>Что видно</th><th>Проблемы</th></tr>
              <tr><td>5</td><td>~5</td><td>Много мелких разрозненных «островков»</td><td>Кластеры разбиты на части — артефакт</td></tr>
              <tr><td>30</td><td>~30</td><td>Три чётких кластера, хорошо разделены</td><td>Оптимально для N=500</td></tr>
              <tr><td>100</td><td>~100</td><td>Кластеры сжаты, расстояния между ними смазаны</td><td>Слишком глобально — локальная структура теряется</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: что происходит при маленькой perplexity (5)</h4>
            <div class="calc">
              σ_i (ширина гауссиана) подбирается так, чтобы «эффективное число соседей» ≈ perplexity<br><br>
              perplexity = 5 → σ_i очень маленькая → только 5 ближайших точек<br>
              «видят» друг друга с высокой вероятностью p_ij<br><br>
              Что получается:<br>
              • Каждая точка тянется к 5 своим соседям → мелкие плотные группы<br>
              • Связи между этими группами слабые → они «разрываются»<br>
              • Один реальный кластер из 150 точек → 5-10 мелких островков<br>
              • Интерпретировать такой график нельзя!
            </div>
            <div class="why">При perplexity &lt; 10 на обычных датасетах — артефакты неизбежны. Мелкие «дырки» и разрывы внутри кластеров не означают реальной структуры.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: оптимальная perplexity (30)</h4>
            <div class="calc">
              perplexity = 30 для N = 500:<br>
              Правило: perplexity ∈ [N/100, N/10] ≈ [5, 50]<br><br>
              Каждая точка «видит» ~30 соседей<br>
              Для кластера из 150 точек: алгоритм знает о 30/150 ≈ 20% кластера<br>
              Достаточно для обнаружения структуры, не слишком глобально<br><br>
              Результат: три компактных, чётко разделённых кластера<br>
              Расстояние МЕЖДУ кластерами → НЕ интерпретировать!
            </div>
            <div class="why">«Правильная» perplexity зависит от N и плотности кластеров. Запускай t-SNE с 3-4 разными perplexity и доверяй только тем структурам, которые устойчивы.</div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: большая perplexity (100)</h4>
            <div class="calc">
              perplexity = 100 → σ_i большая → «видим» 100 соседей<br><br>
              Проблемы:<br>
              • 100 > 150/3 (треть кластера) → начинаем «видеть» другие кластеры<br>
              • p_ij между кластерами становятся ненулевыми<br>
              • Оптимизация «тянет» кластеры друг к другу<br>
              • Кластеры сближаются, детали внутри кластеров стираются<br><br>
              При perplexity ≥ N/2: результат стремится к PCA
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Оптимальная perplexity для N=500: около 30. При 5 — артефакты (разрывы кластеров). При 100 — потеря локальной структуры. Всегда запускай с 2-3 значениями. Структура, видимая при всех perplexity — надёжна. Структура, видимая только при одном — артефакт.</p>
          </div>
          <div class="lesson-box">
            Нет единственно «правильного» t-SNE. Разные preplexity, random seed, числе итераций — разные картины. Доверяй только воспроизводимым паттернам.
          </div>
        `,
      },
      {
        title: 't-SNE vs PCA на MNIST-подобных данных',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить PCA и t-SNE на данных рукописных цифр (784 признака = пиксели). Понять, почему PCA не разделяет классы, а t-SNE разделяет.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Метод</th><th>Время</th><th>Разделение классов</th><th>Интерпретируемость осей</th></tr>
              <tr><td>PCA (PC1 vs PC2)</td><td>~0.1 сек</td><td>Плохое, классы перекрываются</td><td>Да (PC1 = макс. дисперсия)</td></tr>
              <tr><td>PCA 50D → t-SNE 2D</td><td>~30 сек</td><td>Отличное, 10 чётких кластеров</td><td>Нет (оси случайны)</td></tr>
              <tr><td>UMAP</td><td>~5 сек</td><td>Хорошее + глобальная структура</td><td>Нет</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: почему PCA не справляется</h4>
            <div class="calc">
              MNIST: 70 000 изображений 28×28 = 784 признака<br>
              10 классов (цифры 0-9)<br><br>
              PCA PC1 объясняет ~9% дисперсии (яркость изображения)<br>
              PCA PC2 объясняет ~7% дисперсии (вертикальное распределение)<br>
              Суммарно PC1+PC2: ~16% информации<br><br>
              Разные цифры имеют схожие «главные направления»:<br>
              «1» и «7» — похожие узкие вертикальные изображения → PC1 одинаков<br>
              «0» и «6» — похожая округлая форма → PC2 одинаков<br>
              → PC1 vs PC2: кластеры сильно перекрываются
            </div>
            <div class="why">PCA оптимизирует глобальную дисперсию, а не разделимость классов. Различия между цифрами лежат в нелинейных взаимодействиях пикселей — PCA их не видит.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: почему t-SNE успешен</h4>
            <div class="calc">
              Workflow: PCA 784D → 50D (убираем шум, ускоряем t-SNE)<br>
              t-SNE 50D → 2D (perplexity=30, 1000 итераций)<br><br>
              t-SNE смотрит на локальных соседей:<br>
              «1» похожа на другие «1» — они рядом в пространстве пикселей<br>
              «0» непохожа на «1» — они далеко в пространстве пикселей<br><br>
              В 2D: каждая цифра образует компактный кластер<br>
              Некоторые перекрытия: «4» и «9» (похожи визуально)<br>
              «5» и «8» — иногда перекрываются (плохо написанные цифры)
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: что рассказывает t-SNE об MNIST</h4>
            <div class="calc">
              Наблюдения на t-SNE MNIST (исторически воспроизводимые):<br><br>
              1. «1» — самый изолированный кластер (цифра уникальна)<br>
              2. «4», «7», «9» — рядом (похожие черты: вертикали + диагонали)<br>
              3. «3», «5», «8» — рядом (округлые элементы)<br>
              4. «0» и «6» — рядом (кольца)<br>
              5. На границах кластеров: «настоящие» трудные случаи,<br>
                 которые и классификатор путает<br><br>
              Это информация о СТРУКТУРЕ данных, полезная для модели!
            </div>
            <div class="why">Точки, лежащие на границе кластеров в t-SNE — это те самые «сложные» примеры, на которых модели ошибаются. Изучи их: вероятно, плохая разметка или неоднозначные изображения.</div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>PCA сохраняет 16% дисперсии в 2D и не разделяет классы (нелинейная структура). t-SNE на PCA-50 даёт 10 чётких кластеров за 30 секунд. UMAP даёт аналогичный результат за 5 секунд. Граничные точки между кластерами — реально трудные примеры для любого классификатора.</p>
          </div>
          <div class="lesson-box">
            Стандартный pipeline: sklearn PCA(n_components=50) → sklearn TSNE(n_components=2, perplexity=30). Или: PCA(50) → UMAP(n_neighbors=15). Никогда не пропускай PCA перед t-SNE на высоких размерностях — это и ускоряет, и убирает шум.
          </div>
        `,
      },
      {
        title: 'UMAP параметры: n_neighbors и min_dist',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Исследовать, как параметры n_neighbors и min_dist UMAP влияют на визуализацию. Датасет: данные о клиентах с 4 сегментами.</p>
          </div>
          <div class="example-data-table">
            <table>
              <tr><th>Параметры</th><th>n_neighbors=5, min_dist=0.1</th><th>n_neighbors=15, min_dist=0.1</th><th>n_neighbors=15, min_dist=0.9</th></tr>
              <tr><td>Локальная структура</td><td>Очень детальная</td><td>Хорошая</td><td>Размытая</td></tr>
              <tr><td>Глобальная структура</td><td>Слабая</td><td>Хорошая</td><td>Хорошая</td></tr>
              <tr><td>Компактность кластеров</td><td>Высокая</td><td>Средняя</td><td>Низкая (рассеяны)</td></tr>
              <tr><td>Применение</td><td>Анализ субкластеров</td><td>Общий обзор</td><td>Непрерывные переходы</td></tr>
            </table>
          </div>
          <div class="step" data-step="1">
            <h4>Шаг 1: n_neighbors — локальное vs глобальное</h4>
            <div class="calc">
              n_neighbors = 5:<br>
              UMAP смотрит на 5 ближайших соседей каждой точки<br>
              Граф плотен только локально — кластеры «изолированы» друг от друга<br>
              Хорошо видны субкластеры внутри сегментов<br>
              Плохо видно расположение кластеров друг относительно друга<br><br>
              n_neighbors = 30:<br>
              Граф более связный — далёкие кластеры «знают» о друг друге<br>
              Лучше глобальная структура, хуже локальная детализация<br>
              Схоже с эффектом большой perplexity в t-SNE
            </div>
            <div class="why">n_neighbors аналогичен perplexity в t-SNE, но влияет сильнее на глобальную структуру. При n_neighbors близком к N UMAP стремится к PCA.</div>
          </div>
          <div class="step" data-step="2">
            <h4>Шаг 2: min_dist — компактность vs разброс</h4>
            <div class="calc">
              min_dist = 0.0 (или ~0.05):<br>
              Точки внутри кластера «слипаются» — очень компактные блобы<br>
              Хорошо для подсчёта кластеров, плохо для видения внутренней структуры<br><br>
              min_dist = 0.5:<br>
              Точки рассеяны внутри кластера<br>
              Видна внутренняя структура (плотные ядра vs периферия)<br>
              Лучше для понимания непрерывных переходов между состояниями<br><br>
              min_dist = 0.99:<br>
              Все точки равномерно распределены в 2D<br>
              Кластеры почти неразличимы
            </div>
          </div>
          <div class="step" data-step="3">
            <h4>Шаг 3: практические рекомендации</h4>
            <div class="calc">
              Задача: «хочу понять, сколько кластеров и разделены ли они»<br>
              → n_neighbors=15, min_dist=0.1 (стандартные параметры)<br><br>
              Задача: «хочу разобраться в структуре внутри одного кластера»<br>
              → n_neighbors=5, min_dist=0.05 (детальная локальная структура)<br><br>
              Задача: «данные лежат на непрерывном многообразии (траектории)»<br>
              → n_neighbors=30, min_dist=0.5 (сохраняет непрерывность)<br><br>
              Всегда запускай с несколькими наборами параметров!<br>
              Устойчивые структуры → реальные, зависящие от параметров → артефакты
            </div>
          </div>
          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>n_neighbors контролирует баланс локальной/глобальной структуры (аналог perplexity). min_dist контролирует компактность кластеров в 2D. Стандарт: n_neighbors=15, min_dist=0.1. Для анализа субкластеров: меньше n_neighbors. Для непрерывных данных: больше min_dist. Запускай с разными параметрами и доверяй устойчивым паттернам.</p>
          </div>
          <div class="lesson-box">
            В отличие от t-SNE, UMAP лучше сохраняет глобальную структуру — расстояния МЕЖДУ кластерами в UMAP более осмысленны, чем в t-SNE. Но «более осмысленны» ≠ «можно интерпретировать напрямую».
          </div>
        `,
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: проекция кластеров — PCA vs t-SNE-like</h3>
        <p>Генерируем 3 кластера в 5D. Проецируем двумя способами: PCA (линейный) и упрощённая нелинейная проекция (имитация t-SNE). Меняй параметры и наблюдай разделение.</p>
        <div class="sim-container">
          <div class="sim-controls" id="tsne-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="tsne-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap"><canvas id="tsne-chart"></canvas></div>
            <div class="sim-stats" id="tsne-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#tsne-controls');
        const cMethod = App.makeControl('select', 'tsne-method', 'Метод проекции', {
          options: [{ value: 'pca', label: 'PCA (линейный)' }, { value: 'tsne', label: 'Нелинейный (t-SNE-like)' }],
        });
        const cPerp = App.makeControl('range', 'tsne-perp', 'Perplexity-like (разброс кластеров)', { min: 1, max: 10, step: 0.5, value: 4 });
        const cSep = App.makeControl('range', 'tsne-sep', 'Разделённость кластеров в 5D', { min: 0.5, max: 4, step: 0.5, value: 2 });
        [cMethod, cPerp, cSep].forEach(c => controls.appendChild(c.wrap));

        let chart = null;
        let currentData = null;
        const N = 60; // points per cluster
        const clusterColors = [
          'rgba(99,102,241,0.7)', 'rgba(239,68,68,0.7)', 'rgba(16,185,129,0.7)',
        ];
        const clusterLabels = ['Кластер 1', 'Кластер 2', 'Кластер 3'];

        function generateClusters(sep) {
          const centers = [
            [sep, 0, 0, 0, 0],
            [-sep * 0.5, sep * 0.866, 0, 0, 0],
            [-sep * 0.5, -sep * 0.866, sep * 0.5, 0, 0],
          ];
          const data = [];
          for (let c = 0; c < 3; c++) {
            for (let i = 0; i < N; i++) {
              const point = centers[c].map(v => v + App.Util.randn(0, 0.8));
              data.push({ point, cluster: c });
            }
          }
          return data;
        }

        function projectPCA(data) {
          // Use first two dimensions as simple PCA proxy
          return data.map(d => ({ x: d.point[0] + d.point[2] * 0.3, y: d.point[1] + d.point[3] * 0.2, cluster: d.cluster }));
        }

        function projectNonlinear(data, perp) {
          // Nonlinear: exaggerate within-cluster similarity, push clusters apart
          return data.map(d => {
            const noise = 1 / (perp * 0.5);
            const clusterAngle = (d.cluster * 2 * Math.PI) / 3;
            const r = perp * 1.2;
            const x = r * Math.cos(clusterAngle) + App.Util.randn(0, noise);
            const y = r * Math.sin(clusterAngle) + App.Util.randn(0, noise);
            return { x, y, cluster: d.cluster };
          });
        }

        function update() {
          const method = cMethod.input ? cMethod.input.value : 'pca';
          const perp = +cPerp.input.value;
          const sep = +cSep.input.value;

          if (!currentData || currentData.sep !== sep) {
            currentData = { points: generateClusters(sep), sep };
          }

          const projected = method === 'pca'
            ? projectPCA(currentData.points)
            : projectNonlinear(currentData.points, perp);

          const datasets = [0, 1, 2].map(c => ({
            label: clusterLabels[c],
            data: projected.filter(p => p.cluster === c).map(p => ({ x: p.x, y: p.y })),
            backgroundColor: clusterColors[c],
            pointRadius: 5,
          }));

          const ctx = container.querySelector('#tsne-chart').getContext('2d');
          if (chart) chart.destroy();
          chart = new Chart(ctx, {
            type: 'scatter',
            data: { datasets },
            options: {
              responsive: true, maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: method === 'pca' ? 'PCA: линейная проекция' : 'Нелинейная проекция (t-SNE-like)',
                },
              },
              scales: {
                x: { title: { display: true, text: 'Компонента 1' } },
                y: { title: { display: true, text: 'Компонента 2' } },
              },
            },
          });
          App.registerChart(chart);

          // Simple overlap metric (lower = better separation)
          const pca = projectPCA(currentData.points);
          const pcaMeans = [0, 1, 2].map(c => {
            const pts = pca.filter(p => p.cluster === c);
            return { x: App.Util.mean(pts.map(p => p.x)), y: App.Util.mean(pts.map(p => p.y)) };
          });
          const pcaDist = Math.sqrt((pcaMeans[0].x - pcaMeans[1].x) ** 2 + (pcaMeans[0].y - pcaMeans[1].y) ** 2);

          container.querySelector('#tsne-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Метод</div><div class="stat-value">${method === 'pca' ? 'PCA' : 't-SNE-like'}</div></div>
            <div class="stat-card"><div class="stat-label">Разделённость (5D)</div><div class="stat-value">${sep.toFixed(1)}</div></div>
            <div class="stat-card"><div class="stat-label">Perplexity</div><div class="stat-value">${perp.toFixed(1)}</div></div>
          `;
        }

        [cMethod, cPerp, cSep].forEach(c => {
          const el = c.input || c.select;
          if (el) el.addEventListener('change', () => { if (c === cSep) currentData = null; update(); });
          if (c.input) c.input.addEventListener('input', () => { if (c === cSep) currentData = null; update(); });
        });
        container.querySelector('#tsne-regen').onclick = () => { currentData = null; update(); };
        update();
      },
    },

    python: `
      <h3>Python: t-SNE и UMAP</h3>
      <p>sklearn содержит t-SNE. UMAP доступен через отдельный пакет <code>umap-learn</code> (pip install umap-learn).</p>

      <h4>1. t-SNE на MNIST</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.datasets import load_digits  # 8x8 версия MNIST, 64 признака

# Загружаем данные
digits = load_digits()
X, y = digits.data, digits.target  # X: (1797, 64), y: 0-9
print(f'Данные: {X.shape}, классов: {len(np.unique(y))}')

# Шаг 1: PCA до 50 компонент (ускоряет t-SNE и убирает шум)
pca = PCA(n_components=30, random_state=42)
X_pca = pca.fit_transform(X)
print(f'PCA объясняет {pca.explained_variance_ratio_.sum():.1%} дисперсии')

# Шаг 2: t-SNE 2D
tsne = TSNE(
    n_components=2,
    perplexity=30,       # обычно 5-50
    n_iter=1000,         # больше = точнее, но медленнее
    random_state=42,
    init='pca',          # инициализация PCA стабилизирует результат
    learning_rate='auto'
)
X_tsne = tsne.fit_transform(X_pca)
print(f't-SNE KL-divergence: {tsne.kl_divergence_:.4f}')  # ниже = лучше

# Визуализация
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# PCA
X_pca2 = PCA(n_components=2, random_state=42).fit_transform(X)
scatter = axes[0].scatter(X_pca2[:, 0], X_pca2[:, 1], c=y, cmap='tab10', s=10, alpha=0.7)
axes[0].set_title('PCA: первые 2 компоненты')
axes[0].set_xlabel('PC1')
axes[0].set_ylabel('PC2')

# t-SNE
scatter2 = axes[1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='tab10', s=10, alpha=0.7)
axes[1].set_title('t-SNE (perplexity=30)')
axes[1].set_xlabel('Компонента 1 (без смысла)')
axes[1].set_ylabel('Компонента 2 (без смысла)')

plt.colorbar(scatter2, ax=axes[1], label='Цифра')
plt.tight_layout()
plt.show()</code></pre>

      <h4>2. Сравнение perplexity</h4>
      <pre><code># Запускаем t-SNE с разными perplexity
perplexities = [5, 15, 30, 50]
fig, axes = plt.subplots(1, 4, figsize=(20, 5))

for ax, perp in zip(axes, perplexities):
    tsne = TSNE(n_components=2, perplexity=perp, n_iter=500, random_state=42)
    X_proj = tsne.fit_transform(X_pca)
    ax.scatter(X_proj[:, 0], X_proj[:, 1], c=y, cmap='tab10', s=8, alpha=0.7)
    ax.set_title(f'perplexity={perp}')
    ax.set_xticks([])
    ax.set_yticks([])

plt.suptitle('t-SNE: влияние perplexity', fontsize=14)
plt.tight_layout()
plt.show()</code></pre>

      <h4>3. UMAP: быстрее и с глобальной структурой</h4>
      <pre><code>import umap  # pip install umap-learn

# Сравнение параметров UMAP
configs = [
    {'n_neighbors': 5,  'min_dist': 0.1, 'title': 'n_neighbors=5'},
    {'n_neighbors': 15, 'min_dist': 0.1, 'title': 'n_neighbors=15 (стандарт)'},
    {'n_neighbors': 30, 'min_dist': 0.1, 'title': 'n_neighbors=30'},
    {'n_neighbors': 15, 'min_dist': 0.8, 'title': 'min_dist=0.8'},
]

fig, axes = plt.subplots(1, 4, figsize=(20, 5))

for ax, cfg in zip(axes, configs):
    reducer = umap.UMAP(
        n_components=2,
        n_neighbors=cfg['n_neighbors'],
        min_dist=cfg['min_dist'],
        random_state=42
    )
    X_umap = reducer.fit_transform(X)  # UMAP можно без PCA
    ax.scatter(X_umap[:, 0], X_umap[:, 1], c=y, cmap='tab10', s=8, alpha=0.7)
    ax.set_title(cfg['title'])
    ax.set_xticks([])
    ax.set_yticks([])

plt.suptitle('UMAP: влияние параметров', fontsize=14)
plt.tight_layout()
plt.show()</code></pre>

      <h4>4. Правильный workflow: UMAP + кластеризация</h4>
      <pre><code>from sklearn.cluster import KMeans
from sklearn.metrics import adjusted_rand_score

# ПРАВИЛЬНО: кластеризуем в исходном пространстве, визуализируем через UMAP
reducer = umap.UMAP(n_components=2, n_neighbors=15, min_dist=0.1, random_state=42)
X_umap = reducer.fit_transform(X)

# Кластеризация в исходном пространстве
kmeans = KMeans(n_clusters=10, random_state=42, n_init=10)
labels_orig = kmeans.fit_predict(X)  # на исходных данных!
ari_orig = adjusted_rand_score(y, labels_orig)

# НЕПРАВИЛЬНО: кластеризуем на UMAP-координатах
labels_umap = KMeans(n_clusters=10, random_state=42, n_init=10).fit_predict(X_umap)
ari_umap = adjusted_rand_score(y, labels_umap)

print(f'ARI (кластеризация в исходном пространстве): {ari_orig:.3f}')
print(f'ARI (кластеризация на UMAP coords):          {ari_umap:.3f}')
# Обычно ari_orig > ari_umap!

# Правильная визуализация: UMAP для картинки, метки из кластеризации в 64D
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].scatter(X_umap[:, 0], X_umap[:, 1], c=labels_orig, cmap='tab10', s=8, alpha=0.7)
axes[0].set_title(f'Кластеры из 64D (ARI={ari_orig:.2f}) → UMAP visualized')
axes[1].scatter(X_umap[:, 0], X_umap[:, 1], c=y, cmap='tab10', s=8, alpha=0.7)
axes[1].set_title('Реальные метки классов')
plt.tight_layout()
plt.show()</code></pre>
    `,

    applications: `
      <h3>Где применяются t-SNE и UMAP</h3>
      <table>
        <tr><th>Область</th><th>Задача</th></tr>
        <tr><td><b>Биоинформатика</b></td><td>Визуализация single-cell RNA-seq (разные типы клеток как кластеры)</td></tr>
        <tr><td><b>NLP</b></td><td>Визуализация эмбеддингов слов/документов — проверка качества представлений</td></tr>
        <tr><td><b>Компьютерное зрение</b></td><td>Проверка features нейросети: хорошо ли разделяются классы в latent space</td></tr>
        <tr><td><b>Кластерный анализ</b></td><td>Визуальная проверка найденных кластеров (но кластеризовать лучше в исходном пространстве!)</td></tr>
        <tr><td><b>Исследовательский анализ</b></td><td>Быстрый взгляд на структуру высокоразмерных данных</td></tr>
        <tr><td><b>Обнаружение аномалий</b></td><td>Выбросы — точки далеко от всех кластеров</td></tr>
        <tr><td><b>Сравнение моделей</b></td><td>До/после fine-tuning: улучшилось ли разделение классов</td></tr>
      </table>
        `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Находит нелинейные структуры, недоступные PCA и другим линейным методам</li>
            <li>Разделяет кластеры, которые в исходном пространстве перекрываются</li>
            <li>UMAP в 5-10 раз быстрее t-SNE на больших датасетах</li>
            <li>UMAP лучше сохраняет глобальную структуру (относительное расположение кластеров)</li>
            <li>Незаменимы для визуализации и «санity check» данных</li>
            <li>Работают с любыми метриками (cosine для текста, hamming для бинарных)</li>
            <li>Помогают обнаружить ошибки разметки (точки не в том кластере)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Расстояния и размеры на результирующем графике НЕ имеют смысла</li>
            <li>Стохастичны: разные запуски → разные картины (особенно t-SNE)</li>
            <li>Чувствительны к параметрам (perplexity, n_neighbors, min_dist)</li>
            <li>t-SNE медленный: O(N log N), практически непригоден для N > 100 000</li>
            <li>Нельзя применить к новым данным (только UMAP parametric)</li>
            <li>Нельзя использовать как признаки для ML-моделей — только для визуализации</li>
            <li>НЕ использовать для кластеризации — кластеризуй в исходном пространстве!</li>
          </ul>
        </div>
      </div>
      <div class="when-to-use">
        <h4>Когда использовать</h4>
        <ul>
          <li><b>t-SNE:</b> небольшие датасеты (до 50 000), когда важна детальная локальная структура.</li>
          <li><b>UMAP:</b> большие датасеты, когда нужна скорость и/или глобальная структура.</li>
          <li><b>Workflow:</b> PCA до 30-50 компонент → UMAP/t-SNE → визуализация с метками из кластеризации в исходном пространстве.</li>
          <li><b>Когда НЕ нужно:</b> линейная структура данных (PCA лучше), нужна интерпретируемость осей, данных меньше 100 точек.</li>
          <li><b>Главное правило:</b> никогда не кластеризуй на t-SNE/UMAP координатах и не интерпретируй расстояния между кластерами!</li>
        </ul>
      </div>
    `,
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=NEaUSP4YerM" target="_blank">StatQuest: t-SNE</a> — доступное объяснение алгоритма и параметра perplexity</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=t-SNE%20UMAP%20%D0%B2%D0%B8%D0%B7%D1%83%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F" target="_blank">Habr: t-SNE и UMAP</a> — сравнение методов с практическими примерами</li>
        <li><a href="https://distill.pub/2016/misread-tsne/" target="_blank">Distill.pub: How to Use t-SNE Effectively</a> — интерактивный разбор типичных ошибок интерпретации</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://umap-learn.readthedocs.io/en/latest/" target="_blank">UMAP документация</a> — официальная документация с туториалами и параметрами</li>
      </ul>
    `,
  },
});
