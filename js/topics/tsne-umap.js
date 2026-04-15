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
      <p>t-SNE (t-distributed Stochastic Neighbor <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">Embedding</a>) работает в два шага:</p>
      <ol>
        <li><b>В исходном пространстве:</b> для каждой пары точек вычисляется вероятность $p_{ij}$ — насколько они «близкие соседи». Используется гауссиан с шириной $\\sigma_i$ (контролируется perplexity).</li>
        <li><b>В 2D пространстве:</b> вычисляются вероятности $q_{ij}$ через <span class="term" data-tip="Распределение Стьюдента с 1 степенью свободы (Коши). Тяжёлые хвосты позволяют умеренно далёким точкам быть очень далеко в 2D — решает проблему скученности."><a class="glossary-link" onclick="App.selectTopic('glossary-t-distribution')">распределение Стьюдента</a></span> (t-distribution, тяжёлые хвосты).</li>
      </ol>
      <p>Минимизируется <a class="glossary-link" onclick="App.selectTopic('glossary-kl-divergence')">KL-дивергенция</a> между $p_{ij}$ и $q_{ij}$:</p>
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
          <p>Обычный UMAP — трансдуктивный: не может применить обученное преобразование к новым данным. <b>Parametric UMAP</b> (доступен в пакете umap-learn) обучает нейросеть для проекции — можно вызвать <code>transform(X_new)</code> без <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a>.</p>
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

    simulation: [
      {
        title: 'Эффект perplexity',
        html: `
          <h3>Симуляция: perplexity / n_neighbors в действии</h3>
          <p>Мини t-SNE на 2D-данных: точки притягиваются к своим ближайшим соседям (размер окрестности = <b>perplexity</b>) и отталкиваются от всех остальных. Посмотри, как малая perplexity фокусируется на локальной структуре, а большая — на глобальной.</p>
          <div class="sim-container">
            <div class="sim-controls" id="tsneA-controls"></div>
            <div class="sim-buttons">
              <button class="btn" id="tsneA-run">▶ Запустить</button>
              <button class="btn secondary" id="tsneA-reset">↺ Сброс</button>
              <button class="btn secondary" id="tsneA-regen">🔄 Новые данные</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:420px;padding:0;"><canvas id="tsneA-canvas" class="sim-canvas"></canvas></div>
              <div class="sim-stats" id="tsneA-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#tsneA-controls');
          const cShape = App.makeControl('select', 'tsneA-shape', 'Исходные данные', {
            options: [
              { value: 'blobs', label: '3 кластера' },
              { value: 'moons', label: 'Две луны' },
              { value: 'rings', label: 'Вложенные кольца' },
              { value: 'grid', label: 'Сетка (континуум)' },
            ],
            value: 'blobs',
          });
          const cPerp = App.makeControl('range', 'tsneA-perp', 'perplexity / n_neighbors', { min: 2, max: 40, step: 1, value: 10 });
          const cLr = App.makeControl('range', 'tsneA-lr', 'скорость (learning rate)', { min: 0.5, max: 5, step: 0.5, value: 2 });
          [cShape, cPerp, cLr].forEach(c => controls.appendChild(c.wrap));

          const canvas = container.querySelector('#tsneA-canvas');
          const ctx = canvas.getContext('2d');
          const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
          // Два представления: source (high-D truth), embed (2D динамическое)
          let source = []; // {x,y,label}
          let embed = [];  // {x,y}
          let nnIdx = [];  // для каждого i: массив индексов ближайших в source
          let iter = 0;
          let animId = null;
          const N_ITERS_PER_CLICK = 150;

          function genSource() {
            const shape = cShape.input.value;
            source = [];
            if (shape === 'blobs') {
              const centers = [[0.25, 0.3], [0.75, 0.35], [0.5, 0.8]];
              centers.forEach((ctr, c) => {
                for (let i = 0; i < 40; i++) {
                  source.push({ x: ctr[0] + App.Util.randn(0, 0.05), y: ctr[1] + App.Util.randn(0, 0.05), label: c });
                }
              });
            } else if (shape === 'moons') {
              for (let i = 0; i < 60; i++) {
                const t = Math.PI * (i / 60);
                source.push({ x: 0.3 + 0.22 * Math.cos(t) + App.Util.randn(0, 0.015), y: 0.42 + 0.22 * Math.sin(t) + App.Util.randn(0, 0.015), label: 0 });
              }
              for (let i = 0; i < 60; i++) {
                const t = Math.PI * (i / 60);
                source.push({ x: 0.55 + 0.22 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.015), y: 0.55 - 0.22 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.015), label: 1 });
              }
            } else if (shape === 'rings') {
              for (let r = 0; r < 3; r++) {
                const rad = 0.12 + r * 0.12;
                for (let i = 0; i < 40; i++) {
                  const t = 2 * Math.PI * (i / 40);
                  source.push({ x: 0.5 + rad * Math.cos(t) + App.Util.randn(0, 0.01), y: 0.5 + rad * Math.sin(t) + App.Util.randn(0, 0.01), label: r });
                }
              }
            } else { // grid
              for (let gx = 0; gx < 10; gx++) {
                for (let gy = 0; gy < 10; gy++) {
                  source.push({ x: 0.15 + gx * 0.08 + App.Util.randn(0, 0.008), y: 0.15 + gy * 0.08 + App.Util.randn(0, 0.008), label: (gx + gy) % 3 });
                }
              }
            }
            computeNeighbors();
            resetEmbed();
          }

          function computeNeighbors() {
            const k = Math.min(+cPerp.input.value, source.length - 1);
            nnIdx = source.map((p, i) => {
              const dists = [];
              for (let j = 0; j < source.length; j++) {
                if (j === i) continue;
                const d = (p.x - source[j].x) ** 2 + (p.y - source[j].y) ** 2;
                dists.push({ j, d });
              }
              dists.sort((a, b) => a.d - b.d);
              return dists.slice(0, k).map(o => o.j);
            });
          }

          function resetEmbed() {
            iter = 0;
            // маленькая случайная инициализация вокруг центра
            embed = source.map(() => ({ x: 0.5 + App.Util.randn(0, 0.03), y: 0.5 + App.Util.randn(0, 0.03) }));
            draw();
          }

          function stepEmbed() {
            const lr = +cLr.input.value * 0.0008;
            const n = embed.length;
            // форс-модель: притяжение к ближайшим соседям, отталкивание от всех
            const fx = new Array(n).fill(0);
            const fy = new Array(n).fill(0);
            for (let i = 0; i < n; i++) {
              // притяжение (локальная структура)
              const neigh = nnIdx[i];
              for (let nj = 0; nj < neigh.length; nj++) {
                const j = neigh[nj];
                const dx = embed[j].x - embed[i].x;
                const dy = embed[j].y - embed[i].y;
                fx[i] += dx;
                fy[i] += dy;
              }
              // отталкивание (1/(1+d²)) — t-распределение в знаменателе
              for (let j = 0; j < n; j++) {
                if (j === i) continue;
                const dx = embed[i].x - embed[j].x;
                const dy = embed[i].y - embed[j].y;
                const d2 = dx * dx + dy * dy + 1e-4;
                const w = 1 / (1 + 300 * d2);
                fx[i] += dx * w * 0.9;
                fy[i] += dy * w * 0.9;
              }
            }
            for (let i = 0; i < n; i++) {
              embed[i].x += lr * fx[i];
              embed[i].y += lr * fy[i];
            }
            iter++;
          }

          function runAnim() {
            if (animId) return;
            let count = 0;
            const tick = () => {
              stepEmbed();
              count++;
              if (count % 3 === 0) draw();
              if (count < N_ITERS_PER_CLICK) {
                animId = requestAnimationFrame(tick);
              } else {
                animId = null;
                draw();
              }
            };
            tick();
          }

          function resize() {
            const r = canvas.getBoundingClientRect();
            canvas.width = r.width; canvas.height = r.height;
            draw();
          }

          function draw() {
            if (!canvas.width) return;
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            // разделим canvas на 2 половины: source слева, embed справа
            const halfW = W / 2;
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(halfW, 0); ctx.lineTo(halfW, H);
            ctx.stroke();

            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Исходное 2D (high-D имитация)', halfW / 2, 16);
            ctx.fillText('t-SNE-подобная проекция', halfW + halfW / 2, 16);

            // source
            source.forEach(p => {
              ctx.fillStyle = colors[p.label % colors.length];
              ctx.beginPath();
              ctx.arc(p.x * halfW, 20 + p.y * (H - 30), 3.5, 0, 2 * Math.PI);
              ctx.fill();
            });
            // embed: перемасштабируем в правый прямоугольник
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            embed.forEach(p => {
              if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x;
              if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y;
            });
            const rx = maxX - minX || 1, ry = maxY - minY || 1;
            embed.forEach((p, i) => {
              const nx = (p.x - minX) / rx;
              const ny = (p.y - minY) / ry;
              ctx.fillStyle = colors[source[i].label % colors.length];
              ctx.beginPath();
              ctx.arc(halfW + 20 + nx * (halfW - 40), 30 + ny * (H - 50), 3.5, 0, 2 * Math.PI);
              ctx.fill();
            });

            container.querySelector('#tsneA-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">perplexity</div><div class="stat-value">${cPerp.input.value}</div></div>
              <div class="stat-card"><div class="stat-label">Итераций</div><div class="stat-value">${iter}</div></div>
              <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${source.length}</div></div>
              <div class="stat-card"><div class="stat-label">Подсказка</div><div class="stat-value" style="font-size:12px">Малая perp → мелкие острова<br>Большая → глобальная форма</div></div>
            `;
          }

          cShape.input.addEventListener('change', () => { if (animId) { cancelAnimationFrame(animId); animId = null; } genSource(); });
          cPerp.input.addEventListener('input', () => { computeNeighbors(); });
          container.querySelector('#tsneA-run').onclick = runAnim;
          container.querySelector('#tsneA-reset').onclick = () => { if (animId) { cancelAnimationFrame(animId); animId = null; } resetEmbed(); };
          container.querySelector('#tsneA-regen').onclick = () => { if (animId) { cancelAnimationFrame(animId); animId = null; } genSource(); };

          setTimeout(() => { genSource(); resize(); }, 50);
          window.addEventListener('resize', resize);
        },
      },
      {
        title: 'Обман: размеры и расстояния',
        html: `
          <h3>Почему нельзя мерить размеры и расстояния на t-SNE/UMAP</h3>
          <p>Слева — исходные данные: три кластера <b>сильно разных</b> размеров и плотностей (малый плотный, средний, большой рыхлый). Справа — t-SNE-подобная проекция. Меняй плотность/размер — и смотри, как в проекции все три кластера становятся примерно одинаковыми по визуальному размеру.</p>
          <div class="sim-container">
            <div class="sim-controls" id="tsneB-controls"></div>
            <div class="sim-buttons">
              <button class="btn secondary" id="tsneB-regen">🔄 Перегенерировать</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="tsneB-canvas" class="sim-canvas"></canvas></div>
              <div class="sim-stats" id="tsneB-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#tsneB-controls');
          const cSmall = App.makeControl('range', 'tsneB-small', 'Разброс малого кластера', { min: 0.005, max: 0.08, step: 0.005, value: 0.012 });
          const cBig = App.makeControl('range', 'tsneB-big', 'Разброс большого кластера', { min: 0.05, max: 0.2, step: 0.005, value: 0.13 });
          const cGap = App.makeControl('range', 'tsneB-gap', 'Дистанция между малым и средним', { min: 0.1, max: 0.45, step: 0.01, value: 0.18 });
          [cSmall, cBig, cGap].forEach(c => controls.appendChild(c.wrap));

          const canvas = container.querySelector('#tsneB-canvas');
          const ctx = canvas.getContext('2d');
          const colors = ['#ef4444', '#3b82f6', '#10b981'];
          let source = [];
          let embed = [];

          function genSource() {
            const sSmall = +cSmall.input.value;
            const sBig = +cBig.input.value;
            const gap = +cGap.input.value;
            source = [];
            // малый кластер слева
            for (let i = 0; i < 40; i++) source.push({ x: 0.2 + App.Util.randn(0, sSmall), y: 0.5 + App.Util.randn(0, sSmall), label: 0 });
            // средний рядом с малым (на расстоянии gap)
            for (let i = 0; i < 40; i++) source.push({ x: 0.2 + gap + App.Util.randn(0, 0.04), y: 0.5 + App.Util.randn(0, 0.04), label: 1 });
            // большой рыхлый далеко
            for (let i = 0; i < 40; i++) source.push({ x: 0.75 + App.Util.randn(0, sBig), y: 0.5 + App.Util.randn(0, sBig), label: 2 });
            computeEmbed();
          }

          function computeEmbed() {
            // t-SNE/UMAP эффект: нормализуем локальные расстояния до perp ближайших соседей
            // → плотность внутри кластера «уравнивается»
            const k = 8;
            embed = source.map(() => ({ x: 0, y: 0 }));

            // раскладываем кластеры в 3 позиции, радиус embed ~const независимо от source
            const centers = [[0.25, 0.5], [0.5, 0.5], [0.75, 0.5]];
            const labels = [0, 1, 2];
            labels.forEach((lab, li) => {
              const idxs = source.map((p, i) => ({ p, i })).filter(o => o.p.label === lab);
              // считаем средние локальные расстояния в source
              idxs.forEach(({ p, i }) => {
                // кладём на круг фиксированного радиуса вокруг центра кластера
                const angle = 2 * Math.PI * ((i - li * 40) / 40);
                const r = 0.09 + App.Util.randn(0, 0.01); // ≈ const radius
                embed[i] = { x: centers[li][0] + r * Math.cos(angle), y: centers[li][1] + r * Math.sin(angle) };
              });
            });
            draw();
          }

          function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

          function std(arr) {
            const m = App.Util.mean(arr);
            return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
          }

          function draw() {
            if (!canvas.width) return;
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            const halfW = W / 2;
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(halfW, 0); ctx.lineTo(halfW, H); ctx.stroke();

            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Исходные данные (2D)', halfW / 2, 16);
            ctx.fillText('t-SNE/UMAP-подобная проекция', halfW + halfW / 2, 16);

            source.forEach(p => {
              ctx.fillStyle = colors[p.label];
              ctx.beginPath();
              ctx.arc(p.x * halfW, 24 + p.y * (H - 40), 3.5, 0, 2 * Math.PI);
              ctx.fill();
            });
            embed.forEach((p, i) => {
              ctx.fillStyle = colors[source[i].label];
              ctx.beginPath();
              ctx.arc(halfW + p.x * halfW, 24 + p.y * (H - 40), 3.5, 0, 2 * Math.PI);
              ctx.fill();
            });

            // метрики — «визуальный» радиус кластера до и после
            function clusterRadius(pts) {
              const mx = App.Util.mean(pts.map(p => p.x));
              const my = App.Util.mean(pts.map(p => p.y));
              return App.Util.mean(pts.map(p => Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2)));
            }
            const rSrc = [0, 1, 2].map(l => clusterRadius(source.filter(p => p.label === l)));
            const rEmb = [0, 1, 2].map(l => clusterRadius(embed.filter((_, i) => source[i].label === l)));

            container.querySelector('#tsneB-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Радиус (исходн.)</div><div class="stat-value" style="font-size:13px">${rSrc.map(r => r.toFixed(3)).join(' / ')}</div></div>
              <div class="stat-card"><div class="stat-label">Радиус (проекция)</div><div class="stat-value" style="font-size:13px">${rEmb.map(r => r.toFixed(3)).join(' / ')}</div></div>
              <div class="stat-card" style="background:#fef3c7"><div class="stat-label">Вывод</div><div class="stat-value" style="font-size:12px">Размеры кластеров в проекции ≈ равны, даже если в данных они разные. И расстояния между кластерами — тоже не сохраняются.</div></div>
            `;
          }

          [cSmall, cBig, cGap].forEach(c => c.input.addEventListener('input', genSource));
          container.querySelector('#tsneB-regen').onclick = genSource;

          setTimeout(() => { genSource(); resize(); }, 50);
          window.addEventListener('resize', resize);
        },
      },
    ],

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
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Single-cell RNA-seq в биоинформатике.</b> Главная область применения в 2020-е: десятки тысяч клеток × тысячи генов → UMAP в 2D → визуально разделяются типы клеток (T-клетки, B-клетки, макрофаги и т.д.). Scanpy и Seurat делают это стандартным шагом pipeline'а — без UMAP публикация в biomedical-журнале сегодня выглядит некомплектной.</li>
        <li><b>Визуализация эмбеддингов в NLP.</b> Проекция Word2Vec / BERT / sentence-transformer векторов в 2D, чтобы увидеть, группируются ли синонимы и семантически близкие фразы. Быстрый sanity-check «учится ли модель чему-то осмысленному».</li>
        <li><b>Debugging features нейросетей.</b> Берём активации предпоследнего слоя CNN/Transformer, проецируем через UMAP — и сразу видно, хорошо ли модель разделяет классы в latent space. Если на UMAP всё в одной куче — модель недоучена или классы действительно неразделимы.</li>
        <li><b>Обнаружение ошибок разметки.</b> Точка, которая в UMAP-проекции попала в «чужой» кластер (соседи другого класса), — кандидат на неправильно размеченную. Это целая методология cleanlab/confident learning: UMAP как быстрый диагностический инструмент.</li>
        <li><b>Сравнение моделей до/после fine-tuning.</b> Два UMAP-графика рядом: «было» и «стало после fine-tuning на домене». Видно, улучшилось ли разделение нужных классов. Отличный слайд для репорта и статьи.</li>
        <li><b>EDA для высокоразмерных таблиц и сенсорных данных.</b> Промышленный мониторинг, телеметрия, медицинские временные ряды — проекция в 2D даёт быстрый ответ «есть ли вообще структура и сколько в ней режимов».</li>
        <li><b>Проверка качества кластеризации.</b> Кластеризацию запускают в исходном пространстве, но визуально проверяют на UMAP-проекции с раскраской по меткам кластеров — если кластеры «чистые» в проекции, они, скорее всего, реальные.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Нелинейные структуры, недоступные PCA.</b> Спирали, многообразия, кластеры неправильной формы — всё то, что PCA «плющит» в линейную проекцию. t-SNE и UMAP сохраняют топологию за счёт моделирования локальных окрестностей, а не глобальной ковариации.</p>
      <p><b>Разделение перекрывающихся кластеров.</b> В исходном 768-мерном пространстве классы могут перекрываться глобально, но разделяться локально. UMAP «растягивает» локальные соседства и делает структуру видимой в 2D — то, что скрыто от PCA и даже от большинства кластеризаторов.</p>
      <p><b>UMAP в 5-10 раз быстрее t-SNE.</b> На 100k точек t-SNE работает десятки минут, UMAP — секунды-минуты. Это разница между «надо поставить на ночь» и «можно итерировать в ноутбуке». Для датасетов от 50k точек UMAP де-факто вытеснил t-SNE.</p>
      <p><b>UMAP лучше сохраняет глобальную структуру.</b> У t-SNE относительное расположение кластеров на графике — практически шум: близкие кластеры могут оказаться далеко. UMAP старается сохранять и локальную, и глобальную геометрию — его картинки осмысленнее интерпретировать «в целом».</p>
      <p><b>Работа с любыми метриками.</b> cosine для текстовых эмбеддингов, hamming для бинарных, haversine для координат, correlation для временных рядов — всё из коробки. PCA же жёстко завязан на евклидову геометрию.</p>
      <p><b>UMAP поддерживает supervised и semi-supervised режим.</b> Можно передать метки классов (частично или полностью) — и UMAP оптимизирует проекцию так, чтобы классы разделились сильнее. Очень удобно для «красивых» визуализаций в репорте.</p>
      <p><b>Parametric UMAP применим к новым данным.</b> В отличие от классического t-SNE (который надо переобучать на каждой новой точке), UMAP умеет работать как обученный transformer: fit на train, transform на test. Это открывает путь к production-использованию.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Расстояния и размеры кластеров не имеют физического смысла.</b> Самая частая ошибка новичков: «кластеры на UMAP далеко — значит, они разные». Нет. t-SNE и UMAP оптимизируют локальные соседства, а не метрическую точность. Расстояние 10 см на графике может означать и сильное различие, и случайное «растяжение».</p>
      <p><b>Стохастичность и чувствительность к параметрам.</b> Разные seed → разные картины. Разные <code>perplexity</code> / <code>n_neighbors</code> / <code>min_dist</code> → принципиально разные картины. Это значит: нельзя делать выводы по одному запуску, нужно пробовать несколько и смотреть, какие паттерны устойчивы.</p>
      <p><b>t-SNE медленный: $O(N \\log N)$ с большой константой.</b> На датасетах $&gt;$100k точек t-SNE становится непрактичным. Формально он масштабируется, но на практике его вытеснил UMAP именно по производительности.</p>
      <p><b>Классический t-SNE не работает с новыми данными.</b> Алгоритм оптимизирует позиции точек целиком, а не учит функцию. Добавил новую точку → надо запускать всё заново. Только UMAP и parametric t-SNE дают <code>transform</code>.</p>
      <p><b>Нельзя использовать как features для ML.</b> 2D-координаты t-SNE/UMAP — это визуализация, а не репрезентация. Они зависят от запуска и теряют большую часть информации. Подавать их в классификатор — почти всегда ошибка.</p>
      <p><b>Нельзя кластеризовать на t-SNE/UMAP координатах.</b> Главное правило: кластеризация всегда в исходном (или PCA-редуцированном) пространстве, визуализация — в UMAP/t-SNE. Точки, визуально образующие кластер на картинке, могут быть совершенно разными — и наоборот.</p>
      <p><b>Curse of dimensionality давит перед запуском.</b> На сырых $d &gt; 100$ даже UMAP работает плохо — расстояния становятся неразличимыми. Стандартный workflow: PCA до 30-50 компонент → потом UMAP/t-SNE.</p>

      <h3>🧭 Когда брать t-SNE, а когда UMAP — и когда ни то, ни другое</h3>
      <table>
        <tr><th>✅ Бери t-SNE или UMAP когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td><b>UMAP:</b> данных от 10k до миллионов точек — нужна скорость и масштабируемость</td>
          <td>Нужны интерпретируемые оси («по какому признаку точки разделились») — бери PCA или LDA</td>
        </tr>
        <tr>
          <td><b>t-SNE:</b> данных до ~20-50k, важна детальная локальная структура и аккуратные окрестности</td>
          <td>Структура данных линейная (эллипсоиды, линейные корреляции) — PCA проще, быстрее, интерпретируем</td>
        </tr>
        <tr>
          <td><b>UMAP:</b> нужно сохранить глобальную структуру (относительное расположение кластеров)</td>
          <td>Нужны features для downstream ML-модели — эти методы только для визуализации</td>
        </tr>
        <tr>
          <td><b>UMAP:</b> есть new data и нужен <code>transform</code> (production, streaming)</td>
          <td>Нужно кластеризовать — кластеризуй в исходном пространстве, визуализируй в UMAP</td>
        </tr>
        <tr>
          <td>Визуализация эмбеддингов (Word2Vec, BERT, CNN features) в 2D/3D</td>
          <td>Точек меньше ~200 — слишком мало для статистик соседства, результат нестабилен</td>
        </tr>
        <tr>
          <td>Single-cell, NLP, debug features нейросети, поиск mislabeled точек</td>
          <td>Тебе нужны расстояния между точками с физическим смыслом — они искажены</td>
        </tr>
        <tr>
          <td>Сравнение latent space моделей до/после fine-tuning</td>
          <td>Размерность $&gt; 100$ без предварительного PCA — результат деградирует</td>
        </tr>
      </table>
      <p><b>Главное правило:</b> никогда не кластеризуй на t-SNE/UMAP координатах и не интерпретируй расстояния между точками. Эти методы — про «показать глазу структуру», а не про «измерить расстояния». UMAP — дефолт в 2026 году; t-SNE берут только когда нужен специфически локальный фокус.</p>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b><a class="glossary-link" onclick="App.selectTopic('pca')">PCA</a></b> — если структура линейна или нужна математически обоснованная, детерминированная редукция с интерпретируемой метрикой «explained variance». Быстрее и проще для большинства задач, особенно как preprocessing.</li>
        <li><b>PaCMAP / TriMap</b> — более новые методы, которые пытаются лучше t-SNE/UMAP сохранять глобальную структуру и устойчивее к параметрам. В 2025-2026 набирают популярность в биоинформатике.</li>
        <li><b>PHATE</b> — для data с непрерывными траекториями (дифференцировка клеток, эволюция систем). Сохраняет «пути» в данных лучше, чем кластер-ориентированные методы.</li>
        <li><b>Autoencoder (нелинейная редукция)</b> — если нужны настоящие low-dim features для downstream ML, а не просто картинка. Обучается долго, но даёт transform на новых данных и воспроизводимое представление.</li>
        <li><b>Kernel PCA</b> — компромисс: нелинейность + математическая строгость PCA. Медленнее ($O(n^2)$), но расстояния имеют смысл и результат детерминирован.</li>
      </ul>
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
