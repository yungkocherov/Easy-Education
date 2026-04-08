/* ==========================================================================
   Convolutional Neural Networks (CNN)
   ========================================================================== */
App.registerTopic({
  id: 'cnn',
  category: 'dl',
  title: 'CNN (Свёрточные сети)',
  summary: 'Нейросети для изображений: свёртки, пулинг, локальные паттерны.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты ищешь друга в толпе. Ты не смотришь на всех 10 000 людей одновременно — ты сканируешь толпу маленькими «окошками», проверяя каждое: «это он?». Причём <b>одно и то же</b> лицо друга ты ищешь везде — неважно, в центре толпы или с краю.</p>
        <p>CNN (свёрточная нейросеть) работает так же с изображениями. Вместо того чтобы смотреть на все пиксели сразу, она «скользит» маленькими <b>фильтрами</b> по картинке, ища знакомые паттерны. Первые фильтры ищут простое: границы, углы, цвета. Следующие — более сложное: текстуры, части объектов. Самые глубокие — целые объекты.</p>
        <p>Это подражает тому, как работает зрительная кора человека: сначала простые элементы, потом их комбинации. Так машина «видит» картинку иерархически.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 190" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <!-- Input image grid 5x5 -->
          <text x="45" y="20" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Вход (5×5)</text>
          <g id="input-grid">
            <!-- Draw 5x5 cells at x=10, y=28, cell size 24 -->
            <!-- Row 0 -->
            <rect x="10" y="28" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="34" y="28" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="58" y="28" width="24" height="24" fill="#c7d2fe" stroke="#94a3b8" stroke-width="1"/>
            <rect x="82" y="28" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <rect x="106" y="28" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <!-- Row 1 -->
            <rect x="10" y="52" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="34" y="52" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="58" y="52" width="24" height="24" fill="#c7d2fe" stroke="#94a3b8" stroke-width="1"/>
            <rect x="82" y="52" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <rect x="106" y="52" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <!-- Row 2 -->
            <rect x="10" y="76" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="34" y="76" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="58" y="76" width="24" height="24" fill="#c7d2fe" stroke="#94a3b8" stroke-width="1"/>
            <rect x="82" y="76" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <rect x="106" y="76" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <!-- Row 3 -->
            <rect x="10" y="100" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="34" y="100" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="58" y="100" width="24" height="24" fill="#c7d2fe" stroke="#94a3b8" stroke-width="1"/>
            <rect x="82" y="100" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <rect x="106" y="100" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <!-- Row 4 -->
            <rect x="10" y="124" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="34" y="124" width="24" height="24" fill="#eff6ff" stroke="#94a3b8" stroke-width="1"/>
            <rect x="58" y="124" width="24" height="24" fill="#c7d2fe" stroke="#94a3b8" stroke-width="1"/>
            <rect x="82" y="124" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
            <rect x="106" y="124" width="24" height="24" fill="#6366f1" stroke="#94a3b8" stroke-width="1"/>
          </g>
          <!-- 3x3 sliding filter overlay (highlighted) -->
          <rect x="10" y="28" width="72" height="72" fill="none" stroke="#f59e0b" stroke-width="3" rx="2"/>
          <text x="46" y="115" text-anchor="middle" font-size="9" fill="#b45309" font-weight="600">3×3 фильтр</text>
          <!-- Filter kernel box -->
          <text x="215" y="20" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Фильтр (3×3)</text>
          <rect x="175" y="28" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="188" y="45" text-anchor="middle" font-size="10" fill="#92400e">-1</text>
          <rect x="201" y="28" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="214" y="45" text-anchor="middle" font-size="10" fill="#92400e">0</text>
          <rect x="227" y="28" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="240" y="45" text-anchor="middle" font-size="10" fill="#92400e">+1</text>
          <rect x="175" y="54" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="188" y="71" text-anchor="middle" font-size="10" fill="#92400e">-2</text>
          <rect x="201" y="54" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="214" y="71" text-anchor="middle" font-size="10" fill="#92400e">0</text>
          <rect x="227" y="54" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="240" y="71" text-anchor="middle" font-size="10" fill="#92400e">+2</text>
          <rect x="175" y="80" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="188" y="97" text-anchor="middle" font-size="10" fill="#92400e">-1</text>
          <rect x="201" y="80" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="214" y="97" text-anchor="middle" font-size="10" fill="#92400e">0</text>
          <rect x="227" y="80" width="26" height="26" rx="3" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/><text x="240" y="97" text-anchor="middle" font-size="10" fill="#92400e">+1</text>
          <!-- Arrow → -->
          <defs>
            <marker id="arrowC" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6366f1"/>
            </marker>
          </defs>
          <line x1="270" y1="80" x2="315" y2="80" stroke="#6366f1" stroke-width="2.5" marker-end="url(#arrowC)"/>
          <text x="292" y="73" text-anchor="middle" font-size="9" fill="#6366f1">свёртка</text>
          <!-- Feature map 3x3 output -->
          <text x="375" y="20" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">Feature map (3×3)</text>
          <rect x="330" y="28" width="30" height="30" rx="3" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/><text x="345" y="48" text-anchor="middle" font-size="11" fill="#065f46">4</text>
          <rect x="360" y="28" width="30" height="30" rx="3" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/><text x="375" y="48" text-anchor="middle" font-size="11" fill="#065f46">4</text>
          <rect x="390" y="28" width="30" height="30" rx="3" fill="#eff6ff" stroke="#10b981" stroke-width="1.5"/><text x="405" y="48" text-anchor="middle" font-size="11" fill="#065f46">0</text>
          <rect x="330" y="58" width="30" height="30" rx="3" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/><text x="345" y="78" text-anchor="middle" font-size="11" fill="#065f46">4</text>
          <rect x="360" y="58" width="30" height="30" rx="3" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/><text x="375" y="78" text-anchor="middle" font-size="11" fill="#065f46">4</text>
          <rect x="390" y="58" width="30" height="30" rx="3" fill="#eff6ff" stroke="#10b981" stroke-width="1.5"/><text x="405" y="78" text-anchor="middle" font-size="11" fill="#065f46">0</text>
          <rect x="330" y="88" width="30" height="30" rx="3" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/><text x="345" y="108" text-anchor="middle" font-size="11" fill="#065f46">4</text>
          <rect x="360" y="88" width="30" height="30" rx="3" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/><text x="375" y="108" text-anchor="middle" font-size="11" fill="#065f46">4</text>
          <rect x="390" y="88" width="30" height="30" rx="3" fill="#eff6ff" stroke="#10b981" stroke-width="1.5"/><text x="405" y="108" text-anchor="middle" font-size="11" fill="#065f46">0</text>
          <!-- Sliding arrow hint -->
          <path d="M82,100 C120,155 155,155 175,135" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#arrSlide)"/>
          <defs>
            <marker id="arrSlide" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#f59e0b"/>
            </marker>
          </defs>
          <text x="128" y="168" text-anchor="middle" font-size="9" fill="#b45309">скользит →</text>
        </svg>
        <div class="caption">Фильтр 3×3 скользит по входному изображению 5×5 (stride=1, без padding). В каждой позиции вычисляется свёрточная сумма → feature map 3×3. Высокие значения (4) там, где фильтр обнаружил вертикальную границу.</div>
      </div>

      <h3>🎯 Проблема обычных сетей на изображениях</h3>
      <p>Полносвязная сеть (MLP) для изображения 224×224×3 требует ~150 000 весов на <b>один</b> нейрон первого слоя. Для тысяч нейронов в сети — миллиарды параметров. Это:</p>
      <ul>
        <li>Огромный размер модели.</li>
        <li>Долгое обучение.</li>
        <li>Сильное переобучение (слишком много свободы).</li>
        <li><b>Игнорирует локальную структуру</b> изображения.</li>
      </ul>

      <p>Проблема в том, что полносвязная сеть <b>не знает</b>, что соседние пиксели связаны. Пиксель (10, 10) и (11, 10) для неё такие же «разные», как (10, 10) и (200, 200).</p>

      <h3>💡 Три ключевых идеи CNN</h3>

      <h4>1. Локальные связи</h4>
      <p>Каждый нейрон смотрит только на небольшое <b>окно</b> изображения (например, 3×3 пикселя), а не на всю картинку. Это резко уменьшает число параметров.</p>

      <h4>2. Weight sharing (разделение весов)</h4>
      <p>Один и тот же <b>фильтр</b> применяется ко всем позициям изображения. Это разумно: если мы ищем вертикальную границу, она выглядит одинаково в любом месте. Параметры переиспользуются.</p>

      <h4>3. Translation invariance (инвариантность к сдвигу)</h4>
      <p>Кот остаётся котом, где бы он ни был на картинке. Свёртка находит паттерн независимо от его позиции.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Вместо обучения миллиардов весов между всеми пикселями, CNN обучает <b>маленькие фильтры</b> (3×3 или 5×5), которые скользят по изображению. Каждый фильтр ловит свой паттерн, и один и тот же фильтр применяется везде.</p>
      </div>

      <h3>🔲 Операция свёртки</h3>
      <p><span class="term" data-tip="Convolution. Математическая операция скользящего окна: фильтр 'проходит' по изображению и в каждой позиции вычисляет взвешенную сумму пикселей под ним.">Свёртка</span> — базовая операция CNN. Небольшая матрица <span class="term" data-tip="Kernel / Filter. Маленькая матрица весов (обычно 3×3 или 5×5), которая 'скользит' по изображению и применяется в каждой позиции.">kernel</span> $K \\times K$ скользит по изображению. В каждой позиции:</p>
      <ol>
        <li>Умножаем значения фильтра на соответствующие пиксели окна.</li>
        <li>Суммируем результаты.</li>
        <li>Результат записываем в новую матрицу.</li>
      </ol>

      <p>Результирующая матрица называется <span class="term" data-tip="Feature Map. Результат применения фильтра к изображению. Показывает, где на изображении этот фильтр 'активировался' сильно.">feature map</span>. Её значения показывают, насколько фильтр «сработал» в каждой позиции.</p>

      <p>Пример фильтра — <b>детектор вертикальных границ</b>:</p>
      <pre>[-1  0  1]
[-2  0  2]
[-1  0  1]</pre>
      <p>Применив его к изображению, получим карту с высокими значениями там, где есть вертикальный перепад яркости.</p>

      <h3>⚙️ Параметры свёртки</h3>
      <ul>
        <li><b>Kernel size</b> — размер фильтра. Обычно 3×3 или 5×5.</li>
        <li><b>Stride</b> — шаг скольжения. Stride=1: пиксель за пикселем. Stride=2: через один.</li>
        <li><b>Padding</b> — «рамка» из нулей по краям. Позволяет сохранить размер выхода.</li>
        <li><b>Channels</b> — число фильтров в слое = число каналов на выходе.</li>
      </ul>

      <p>Формула размера выхода:</p>
      <div class="math-block">$$H_{out} = \\left\\lfloor \\frac{H_{in} + 2p - k}{s} \\right\\rfloor + 1$$</div>

      <h3>🗜️ Pooling (агрегация)</h3>
      <p>После свёрток обычно делают <span class="term" data-tip="Pooling. Операция агрегации: из окна (обычно 2×2) берём одно значение — максимум или среднее. Уменьшает размер feature map.">pooling</span> — уменьшение размера feature map:</p>
      <ul>
        <li><b>MaxPooling</b> — берёт максимум из окна (обычно 2×2). Сохраняет самые сильные активации.</li>
        <li><b>AvgPooling</b> — среднее.</li>
      </ul>

      <p>Pooling:</p>
      <ul>
        <li>Уменьшает вычисления (меньше признаков).</li>
        <li>Добавляет translation invariance.</li>
        <li>Увеличивает receptive field.</li>
      </ul>

      <h3>🏗️ Типичная архитектура CNN</h3>
      <pre>Input (224×224×3)  ← исходное изображение
  → Conv 3×3, 64 filters → ReLU → MaxPool 2×2   (112×112×64)
  → Conv 3×3, 128 filters → ReLU → MaxPool 2×2  (56×56×128)
  → Conv 3×3, 256 filters → ReLU → MaxPool 2×2  (28×28×256)
  → Flatten → FC → Softmax</pre>

      <p>Идея: <b>глубина растёт</b> (больше фильтров), <b>размер уменьшается</b> (pooling). Получаем компактное, но информативное представление.</p>

      <h3>🔍 Иерархия признаков</h3>
      <p>Вот в чём магия CNN. Разные слои выучивают <b>разные уровни</b> абстракции:</p>

      <ul>
        <li><b>Слой 1:</b> границы, цветовые пятна, простые текстуры.</li>
        <li><b>Слой 2-3:</b> углы, дуги, простые формы.</li>
        <li><b>Слой 4-5:</b> части объектов (глаза, колёса, окна).</li>
        <li><b>Последние слои:</b> целые объекты (лица, машины, коты).</li>
      </ul>

      <p>Это <b>автоматическое</b> обучение признаков — не нужно вручную описывать, что искать. CNN сама находит полезные паттерны.</p>

      <h3>👁️ Receptive field</h3>
      <p><span class="term" data-tip="Receptive Field. Область входного изображения, которая влияет на один нейрон в глубоком слое. Растёт с глубиной сети.">Receptive field</span> — это область входного изображения, которая влияет на один нейрон. С глубиной он растёт: нейрон в 5-м слое «видит» большую область оригинальной картинки.</p>
      <p>Глубокие слои учат крупные паттерны, потому что у них большой receptive field.</p>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Отлично для изображений</b> — state-of-the-art долгое время.</li>
        <li>Translation invariance.</li>
        <li>Weight sharing → меньше параметров.</li>
        <li>Иерархия признаков.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li>Нужно много данных и GPU.</li>
        <li>Не rotation-invariant сами по себе.</li>
        <li>С 2020 Vision Transformer обходит CNN на больших данных.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: известные архитектуры</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>LeNet-5</b> (1998) — первая CNN для MNIST.</li>
            <li><b>AlexNet</b> (2012) — революция в ImageNet, ReLU, dropout.</li>
            <li><b>VGG</b> (2014) — простая, только 3×3 свёртки.</li>
            <li><b>GoogLeNet</b> (2014) — inception-модули.</li>
            <li><b>ResNet</b> (2015) — skip connections, очень глубокие (100+ слоёв).</li>
            <li><b>EfficientNet</b> (2019) — оптимальный баланс размеров.</li>
            <li><b>ViT</b> (2020) — attention вместо свёрток.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: residual connections</summary>
        <div class="deep-dive-body">
          <p>В глубоких CNN возникает проблема vanishing gradients. Решение — <span class="term" data-tip="Residual Connection. Skip-связь, добавляющая вход блока к его выходу: y = F(x) + x. Позволяет обучать очень глубокие сети.">residual connections</span>:</p>
          <div class="math-block">$$y = F(x) + x$$</div>
          <p>Вход блока добавляется к выходу. Это «короткий путь» для градиентов — они легко доходят до ранних слоёв.</p>
          <p>ResNet использует это и успешно обучает сети в 100+ слоёв.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: специальные типы свёрток</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>1×1 convolution</b> — уменьшает число каналов, добавляет нелинейность.</li>
            <li><b>Dilated convolution</b> — свёртка с «дырками», увеличивает receptive field без параметров.</li>
            <li><b>Transposed convolution</b> — «обратная», для upsampling (в autoencoders, GAN).</li>
            <li><b>Depthwise separable</b> — эффективная факторизация (MobileNet).</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>MLP</b> — CNN это MLP с хитрыми ограничениями.</li>
        <li><b>Transfer Learning</b> — предобученные CNN используются как основа.</li>
        <li><b>Transformer / ViT</b> — конкурент CNN с 2020 года.</li>
        <li><b>GAN, Autoencoder</b> — используют CNN для изображений.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Свёртка 3×3: полный расчёт',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Дано изображение 5x5 в оттенках серого (значения пикселей 0–255). Применить вертикальный фильтр Собеля 3x3 вручную: вычислить ВСЕ 9 элементов выходной feature map, затем ReLU и MaxPool 2x2. Каждое умножение показано явно.</p>
            <div class="math-block">$$K = \\begin{pmatrix}-1 & 0 & 1 \\\\ -2 & 0 & 2 \\\\ -1 & 0 & 1\\end{pmatrix}$$</div>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Входное изображение 5x5</h4>
            <div class="example-data-table">
              <table>
                <tr><th colspan="5">Изображение I (5x5), значения пикселей</th></tr>
                <tr><td>10</td><td>10</td><td>10</td><td>80</td><td>80</td></tr>
                <tr><td>10</td><td>10</td><td>10</td><td>80</td><td>80</td></tr>
                <tr><td>10</td><td>10</td><td>80</td><td>80</td><td>80</td></tr>
                <tr><td>10</td><td>10</td><td>80</td><td>80</td><td>80</td></tr>
                <tr><td>10</td><td>10</td><td>80</td><td>80</td><td>80</td></tr>
              </table>
            </div>
            <div class="calc">
              Левая часть (столбцы 0–1): тёмные пиксели (10)<br>
              Правая часть (столбцы 3–4): светлые пиксели (80)<br>
              Столбец 2: граница смещается вниз (10 сверху, 80 снизу)<br><br>
              Размер выхода: (5−3)/1 + 1 = <b>3×3</b> (без padding, stride=1)
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 500 170" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
                <defs>
                  <marker id="cnn-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>
                <text x="60" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">Вход 5x5</text>
                <!-- 5x5 grid, cell=22, start x=10,y=20 -->
                <g stroke="#94a3b8" stroke-width="1" fill="none">
                  <rect x="10" y="20" width="110" height="110" rx="2"/>
                  <line x1="10" y1="42" x2="120" y2="42"/><line x1="10" y1="64" x2="120" y2="64"/>
                  <line x1="10" y1="86" x2="120" y2="86"/><line x1="10" y1="108" x2="120" y2="108"/>
                  <line x1="32" y1="20" x2="32" y2="130"/><line x1="54" y1="20" x2="54" y2="130"/>
                  <line x1="76" y1="20" x2="76" y2="130"/><line x1="98" y1="20" x2="98" y2="130"/>
                </g>
                <!-- Cell fills: dark=10, light=80 -->
                <rect x="76" y="64" width="22" height="66" fill="#dbeafe" opacity="0.5"/>
                <rect x="76" y="20" width="22" height="44" fill="#fef3c7" opacity="0.3"/>
                <rect x="98" y="20" width="22" height="110" fill="#dbeafe" opacity="0.5"/>
                <!-- Values -->
                <g font-size="9" text-anchor="middle" fill="#1e293b">
                  <text x="21" y="35">10</text><text x="43" y="35">10</text><text x="65" y="35">10</text><text x="87" y="35" fill="#3b82f6" font-weight="600">80</text><text x="109" y="35" fill="#3b82f6" font-weight="600">80</text>
                  <text x="21" y="57">10</text><text x="43" y="57">10</text><text x="65" y="57">10</text><text x="87" y="57" fill="#3b82f6" font-weight="600">80</text><text x="109" y="57" fill="#3b82f6" font-weight="600">80</text>
                  <text x="21" y="79">10</text><text x="43" y="79">10</text><text x="65" y="79" fill="#3b82f6" font-weight="600">80</text><text x="87" y="79" fill="#3b82f6" font-weight="600">80</text><text x="109" y="79" fill="#3b82f6" font-weight="600">80</text>
                  <text x="21" y="101">10</text><text x="43" y="101">10</text><text x="65" y="101" fill="#3b82f6" font-weight="600">80</text><text x="87" y="101" fill="#3b82f6" font-weight="600">80</text><text x="109" y="101" fill="#3b82f6" font-weight="600">80</text>
                  <text x="21" y="123">10</text><text x="43" y="123">10</text><text x="65" y="123" fill="#3b82f6" font-weight="600">80</text><text x="87" y="123" fill="#3b82f6" font-weight="600">80</text><text x="109" y="123" fill="#3b82f6" font-weight="600">80</text>
                </g>
                <!-- Arrow -->
                <line x1="130" y1="75" x2="155" y2="75" stroke="#64748b" stroke-width="1.5" marker-end="url(#cnn-a)"/>
                <text x="142" y="70" font-size="8" fill="#64748b">*</text>
                <!-- Filter -->
                <text x="195" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#ef4444">Фильтр 3x3</text>
                <g stroke="#ef4444" stroke-width="1.5" fill="none">
                  <rect x="160" y="40" width="66" height="66" rx="2"/>
                  <line x1="160" y1="62" x2="226" y2="62"/><line x1="160" y1="84" x2="226" y2="84"/>
                  <line x1="182" y1="40" x2="182" y2="106"/><line x1="204" y1="40" x2="204" y2="106"/>
                </g>
                <g font-size="10" text-anchor="middle" fill="#b91c1c" font-weight="600">
                  <text x="171" y="56">-1</text><text x="193" y="56">0</text><text x="215" y="56">1</text>
                  <text x="171" y="78">-2</text><text x="193" y="78">0</text><text x="215" y="78">2</text>
                  <text x="171" y="100">-1</text><text x="193" y="100">0</text><text x="215" y="100">1</text>
                </g>
                <!-- Arrow -->
                <line x1="236" y1="75" x2="261" y2="75" stroke="#64748b" stroke-width="1.5" marker-end="url(#cnn-a)"/>
                <text x="248" y="70" font-size="8" fill="#64748b">=</text>
                <!-- Output 3x3 -->
                <text x="330" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#10b981">Feature map 3x3</text>
                <g stroke="#10b981" stroke-width="1.5" fill="none">
                  <rect x="270" y="40" width="90" height="90" rx="2"/>
                  <line x1="270" y1="70" x2="360" y2="70"/><line x1="270" y1="100" x2="360" y2="100"/>
                  <line x1="300" y1="40" x2="300" y2="130"/><line x1="330" y1="40" x2="330" y2="130"/>
                </g>
                <g font-size="11" text-anchor="middle" font-weight="600">
                  <text x="285" y="60" fill="#10b981">280</text><text x="315" y="60" fill="#10b981">280</text><text x="345" y="60" fill="#64748b">0</text>
                  <text x="285" y="90" fill="#10b981">210</text><text x="315" y="90" fill="#10b981">140</text><text x="345" y="90" fill="#64748b">0</text>
                  <text x="285" y="120" fill="#64748b">0</text><text x="315" y="120" fill="#64748b">0</text><text x="345" y="120" fill="#64748b">0</text>
                </g>
                <text x="50" y="150" font-size="8" fill="#64748b">тёмное | светлое</text>
                <text x="315" y="150" text-anchor="middle" font-size="8" fill="#64748b">граница найдена!</text>
              </svg>
            </div>
            <div class="why">Изображение имитирует вертикальную границу: тёмная область слева, светлая справа. Граница «ступенькой» смещается в столбце 2. Фильтр Собеля должен обнаружить эту границу.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Позиция (0,0) — все 9 умножений</h4>
            <p>Окно: строки 0–2, столбцы 0–2 изображения:</p>
            <div class="calc">
              Окно: $\\begin{pmatrix}10&10&10\\\\10&10&10\\\\10&10&80\\end{pmatrix}$, Фильтр: $\\begin{pmatrix}-1&0&1\\\\-2&0&2\\\\-1&0&1\\end{pmatrix}$<br><br>
              Поэлементное умножение:<br>
              (-1)·10 = <b>-10</b> &nbsp;&nbsp; 0·10 = <b>0</b> &nbsp;&nbsp; 1·10 = <b>+10</b><br>
              (-2)·10 = <b>-20</b> &nbsp;&nbsp; 0·10 = <b>0</b> &nbsp;&nbsp; 2·10 = <b>+20</b><br>
              (-1)·10 = <b>-10</b> &nbsp;&nbsp; 0·10 = <b>0</b> &nbsp;&nbsp; 1·80 = <b>+80</b><br><br>
              Сумма: -10 + 0 + 10 + (-20) + 0 + 20 + (-10) + 0 + 80 = <b>70</b><br>
              output[0][0] = <b>70</b>
            </div>
            <div class="why">Отклик 70 (умеренный): в нижнем правом углу окна есть пиксель 80, а слева — 10. Фильтр «видит» начало границы. Без пикселя 80 было бы 0 (однородная область).</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Позиция (0,1) — сдвиг вправо на 1</h4>
            <p>Окно: строки 0–2, столбцы 1–3:</p>
            <div class="calc">
              Окно: $\\begin{pmatrix}10&10&80\\\\10&10&80\\\\10&80&80\\end{pmatrix}$<br><br>
              (-1)·10 = -10 &nbsp;&nbsp; 0·10 = 0 &nbsp;&nbsp; 1·80 = +80<br>
              (-2)·10 = -20 &nbsp;&nbsp; 0·10 = 0 &nbsp;&nbsp; 2·80 = +160<br>
              (-1)·10 = -10 &nbsp;&nbsp; 0·80 = 0 &nbsp;&nbsp; 1·80 = +80<br><br>
              Сумма: -10 + 0 + 80 + (-20) + 0 + 160 + (-10) + 0 + 80 = <b>280</b><br>
              output[0][1] = <b>280</b>
            </div>
            <div class="why">Отклик 280 — сильный! Левый столбец окна = 10 (тёмный), правый = 80 (светлый). Это ярко выраженная вертикальная граница. Фильтр Собеля максимально реагирует именно на такой контраст.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Позиция (0,2) — ещё правее</h4>
            <p>Окно: строки 0–2, столбцы 2–4:</p>
            <div class="calc">
              Окно: $\\begin{pmatrix}10&80&80\\\\10&80&80\\\\80&80&80\\end{pmatrix}$<br><br>
              (-1)·10 = -10 &nbsp;&nbsp; 0·80 = 0 &nbsp;&nbsp; 1·80 = +80<br>
              (-2)·10 = -20 &nbsp;&nbsp; 0·80 = 0 &nbsp;&nbsp; 2·80 = +160<br>
              (-1)·80 = -80 &nbsp;&nbsp; 0·80 = 0 &nbsp;&nbsp; 1·80 = +80<br><br>
              Сумма: -10 + 0 + 80 + (-20) + 0 + 160 + (-80) + 0 + 80 = <b>210</b><br>
              output[0][2] = <b>210</b>
            </div>
            <div class="why">Отклик 210 — всё ещё сильный. Левый столбец ещё содержит тёмные пиксели (10, 10, 80). Но нижний пиксель уже 80, поэтому контраст чуть слабее, чем при 280.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Полный первый ряд + все 9 позиций</h4>
            <p>Вычислим оставшиеся 6 позиций тем же способом:</p>
            <div class="calc">
              <b>Строка 1 (row=1):</b><br>
              (1,0): окно строки 1–3, столбцы 0–2:<br>
              $\\begin{pmatrix}10&10&10\\\\10&10&80\\\\10&10&80\\end{pmatrix}$ → -10+0+10-20+0+160-10+0+80 = <b>210</b><br><br>
              (1,1): $\\begin{pmatrix}10&10&80\\\\10&80&80\\\\10&80&80\\end{pmatrix}$ → -10+0+80-20+0+160-10+0+80 = <b>280</b><br><br>
              (1,2): $\\begin{pmatrix}10&80&80\\\\80&80&80\\\\80&80&80\\end{pmatrix}$ → -10+0+80-160+0+160-80+0+80 = <b>70</b><br><br>
              <b>Строка 2 (row=2):</b><br>
              (2,0): $\\begin{pmatrix}10&10&80\\\\10&10&80\\\\10&10&80\\end{pmatrix}$ → -10+0+80-20+0+160-10+0+80 = <b>280</b><br><br>
              (2,1): $\\begin{pmatrix}10&80&80\\\\10&80&80\\\\10&80&80\\end{pmatrix}$ → -10+0+80-20+0+160-10+0+80 = <b>280</b><br><br>
              (2,2): $\\begin{pmatrix}80&80&80\\\\80&80&80\\\\80&80&80\\end{pmatrix}$ → -80+0+80-160+0+160-80+0+80 = <b>0</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th colspan="3">Feature map (свёртка, 3x3)</th></tr>
                <tr><td>70</td><td><b>280</b></td><td>210</td></tr>
                <tr><td>210</td><td><b>280</b></td><td>70</td></tr>
                <tr><td><b>280</b></td><td><b>280</b></td><td>0</td></tr>
              </table>
            </div>
            <div class="why">Высокие значения (280) — там, где вертикальная граница проходит чётко. 0 — однородная область (все 80). Фильтр «нарисовал карту» расположения границ в изображении.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: Итоговая feature map — визуализация</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 460 130" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
                <text x="230" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">Вход 5x5 → Свёртка → Feature map 3x3</text>
                <!-- Input 5x5 simplified -->
                <rect x="10" y="24" width="40" height="90" fill="#1e293b" rx="2"/>
                <rect x="50" y="24" width="20" height="45" fill="#1e293b" rx="0"/>
                <rect x="50" y="69" width="20" height="45" fill="#93c5fd" rx="0"/>
                <rect x="70" y="24" width="40" height="90" fill="#93c5fd" rx="2"/>
                <text x="55" y="75" text-anchor="middle" font-size="8" fill="#fff">граница</text>
                <text x="30" y="122" font-size="8" fill="#64748b">10</text>
                <text x="90" y="122" font-size="8" fill="#64748b">80</text>
                <!-- Arrow -->
                <line x1="118" y1="70" x2="140" y2="70" stroke="#64748b" stroke-width="1.5" marker-end="url(#cnn-a)"/>
                <!-- Feature map 3x3 as heatmap -->
                <g transform="translate(150,30)">
                  <rect x="0" y="0" width="30" height="30" fill="#fef3c7" rx="1"/><text x="15" y="20" text-anchor="middle" font-size="9" fill="#92400e">70</text>
                  <rect x="30" y="0" width="30" height="30" fill="#f97316" rx="1"/><text x="45" y="20" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="60" y="0" width="30" height="30" fill="#fdba74" rx="1"/><text x="75" y="20" text-anchor="middle" font-size="9" fill="#7c2d12">210</text>
                  <rect x="0" y="30" width="30" height="30" fill="#fdba74" rx="1"/><text x="15" y="50" text-anchor="middle" font-size="9" fill="#7c2d12">210</text>
                  <rect x="30" y="30" width="30" height="30" fill="#f97316" rx="1"/><text x="45" y="50" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="60" y="30" width="30" height="30" fill="#fef3c7" rx="1"/><text x="75" y="50" text-anchor="middle" font-size="9" fill="#92400e">70</text>
                  <rect x="0" y="60" width="30" height="30" fill="#f97316" rx="1"/><text x="15" y="80" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="30" y="60" width="30" height="30" fill="#f97316" rx="1"/><text x="45" y="80" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="60" y="60" width="30" height="30" fill="#f1f5f9" rx="1"/><text x="75" y="80" text-anchor="middle" font-size="9" fill="#94a3b8">0</text>
                </g>
                <text x="195" y="122" text-anchor="middle" font-size="8" fill="#64748b">Feature map</text>
                <!-- Arrow -->
                <line x1="255" y1="70" x2="277" y2="70" stroke="#64748b" stroke-width="1.5" marker-end="url(#cnn-a)"/>
                <text x="266" y="62" font-size="8" fill="#64748b">ReLU</text>
                <!-- After ReLU (same, all positive) -->
                <g transform="translate(285,30)">
                  <rect x="0" y="0" width="30" height="30" fill="#fef3c7" rx="1"/><text x="15" y="20" text-anchor="middle" font-size="9">70</text>
                  <rect x="30" y="0" width="30" height="30" fill="#f97316" rx="1"/><text x="45" y="20" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="60" y="0" width="30" height="30" fill="#fdba74" rx="1"/><text x="75" y="20" text-anchor="middle" font-size="9">210</text>
                  <rect x="0" y="30" width="30" height="30" fill="#fdba74" rx="1"/><text x="15" y="50" text-anchor="middle" font-size="9">210</text>
                  <rect x="30" y="30" width="30" height="30" fill="#f97316" rx="1"/><text x="45" y="50" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="60" y="30" width="30" height="30" fill="#fef3c7" rx="1"/><text x="75" y="50" text-anchor="middle" font-size="9">70</text>
                  <rect x="0" y="60" width="30" height="30" fill="#f97316" rx="1"/><text x="15" y="80" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="30" y="60" width="30" height="30" fill="#f97316" rx="1"/><text x="45" y="80" text-anchor="middle" font-size="9" fill="#fff">280</text>
                  <rect x="60" y="60" width="30" height="30" fill="#f1f5f9" rx="1"/><text x="75" y="80" text-anchor="middle" font-size="9" fill="#94a3b8">0</text>
                </g>
                <text x="330" y="122" text-anchor="middle" font-size="8" fill="#64748b">После ReLU</text>
              </svg>
            </div>
            <div class="why">Feature map показывает ГДЕ в изображении находится вертикальная граница. Яркие оранжевые ячейки (280) = чёткая граница. Бледные (70) = слабая граница. Белая (0) = однородная область.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7: ReLU — max(0, x) для каждого значения</h4>
            <div class="calc">
              ReLU(70) = max(0, 70) = <b>70</b> (без изменений)<br>
              ReLU(280) = max(0, 280) = <b>280</b> (без изменений)<br>
              ReLU(210) = max(0, 210) = <b>210</b> (без изменений)<br>
              ReLU(0) = max(0, 0) = <b>0</b> (без изменений)<br><br>
              В данном случае все значения ≥ 0, поэтому ReLU ничего не изменил.<br>
              Но если бы фильтр давал отрицательные значения (например, тёмное справа от светлого),<br>
              ReLU обнулил бы их: «нас интересуют только ПОЛОЖИТЕЛЬНЫЕ отклики».
            </div>
            <div class="example-data-table">
              <table>
                <tr><th colspan="3">После ReLU (3x3)</th></tr>
                <tr><td>70</td><td>280</td><td>210</td></tr>
                <tr><td>210</td><td>280</td><td>70</td></tr>
                <tr><td>280</td><td>280</td><td>0</td></tr>
              </table>
            </div>
            <div class="why">ReLU отсекает отрицательные активации. Интуиция: «фильтр нашёл паттерн» = положительный отклик. Отрицательный = «паттерн не найден или найден инверсный» → обнуляем.</div>
          </div>

          <div class="step" data-step="8">
            <h4>Шаг 8: MaxPool 2x2 (stride=2)</h4>
            <div class="calc">
              Feature map 3x3 не делится ровно на блоки 2x2 (нечётный размер!).<br>
              Обычно MaxPool 2x2 на 3x3 даёт выход пола (3/2) = 1x1 (только один полный блок)<br>
              Или, если взять с перекрытием/padding, 2x2. Покажем один полный блок:<br><br>
              Блок (0,0)-(1,1): $\\begin{pmatrix}70&280\\\\210&280\\end{pmatrix}$ → max = <b>280</b><br><br>
              Если с padding=right+bottom → дополняем нулями до 4x4:<br>
              $\\begin{pmatrix}70&280&210&0\\\\210&280&70&0\\\\280&280&0&0\\\\0&0&0&0\\end{pmatrix}$<br><br>
              Блок (0,0): max(70,280,210,280) = <b>280</b><br>
              Блок (0,1): max(210,0,70,0) = <b>210</b><br>
              Блок (1,0): max(280,280,0,0) = <b>280</b><br>
              Блок (1,1): max(0,0,0,0) = <b>0</b><br><br>
              MaxPool 2x2: $\\begin{pmatrix}280&210\\\\280&0\\end{pmatrix}$
            </div>
            <div class="why">MaxPool сжимает 3x3 → 2x2 (или 1x1 без padding). Сохраняется самый сильный отклик в каждом регионе: 280 = «здесь точно есть граница». Позиция внутри блока теряется — это translation invariance.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Свёртка 5x5 с Собелем 3x3 дала feature map: максимум 280 там, где граница чёткая, 0 где однородно. ReLU оставил всё без изменений (нет отрицательных). MaxPool 2x2 сжал до 2x2, сохранив пиковые отклики 280.</p>
          </div>
          <div class="lesson-box">
            Полный пайплайн CNN: Input → Conv (извлечение признаков) → ReLU (нелинейность) → Pool (сжатие). Каждый Conv-фильтр — «детектор» одного паттерна. В реальной сети 32–512 фильтров на слой, каждый ищет свой паттерн.
          </div>
        `
      },
      {
        title: 'Подсчёт параметров по слоям',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Дана архитектура мини-CNN для MNIST (28x28x1): Conv1(3x3, 16) → Pool → Conv2(3x3, 32) → Pool → FC(128) → FC(10). Вычислить размеры тензоров и число параметров на КАЖДОМ слое. Показать формулы и каждое число.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Вход → Conv1(3x3, 16 фильтров, no padding)</h4>
            <div class="calc">
              <b>Размер выхода:</b><br>
              H_out = (H_in − k) / stride + 1 = (28 − 3) / 1 + 1 = <b>26</b><br>
              W_out = (28 − 3) / 1 + 1 = <b>26</b><br>
              Каналов = 16 (число фильтров)<br>
              Выход: <b>26 x 26 x 16</b><br><br>
              <b>Параметры:</b><br>
              Один фильтр: k x k x C_in = 3 x 3 x 1 = 9 весов + 1 bias = <b>10</b><br>
              16 фильтров: 16 x 10 = <b>160 параметров</b>
            </div>
            <div class="why">Conv1 берёт 1-канальный вход (grayscale) и создаёт 16 карт признаков. Каждый фильтр 3x3 имеет всего 9 весов — они ПЕРЕИСПОЛЬЗУЮТСЯ для всех 26x26 позиций (weight sharing). Это в 784/9 ≈ 87 раз экономнее FC.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: MaxPool1(2x2, stride=2)</h4>
            <div class="calc">
              H_out = 26 / 2 = <b>13</b><br>
              W_out = 26 / 2 = <b>13</b><br>
              Каналов = 16 (не меняется!)<br>
              Выход: <b>13 x 13 x 16</b><br><br>
              Параметры: <b>0</b> (MaxPool — фиксированная операция, без обучаемых весов)
            </div>
            <div class="why">Pooling уменьшает пространственные размеры в 2 раза (26→13), но число каналов остаётся 16. Объём данных: 26x26x16 = 10816 → 13x13x16 = 2704 (в 4 раза меньше).</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Conv2(3x3, 32 фильтра, no padding)</h4>
            <div class="calc">
              <b>Размер выхода:</b><br>
              H_out = (13 − 3) / 1 + 1 = <b>11</b><br>
              Выход: <b>11 x 11 x 32</b><br><br>
              <b>Параметры:</b><br>
              Один фильтр: 3 x 3 x <b>16</b> = 144 весов + 1 bias = <b>145</b><br>
              (16 — потому что ВХОД имеет 16 каналов от Conv1!)<br>
              32 фильтра: 32 x 145 = <b>4 640 параметров</b>
            </div>
            <div class="why">Второй Conv-слой НАМНОГО тяжелее (4640 vs 160), потому что каждый фильтр теперь 3x3x16 (работает по всем 16 входным каналам). Формула: k x k x C_in x C_out + C_out.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: MaxPool2(2x2) → Flatten</h4>
            <div class="calc">
              MaxPool2: 11 x 11 x 32 → пол(11/2) = 5<br>
              Выход: <b>5 x 5 x 32</b> = <b>800</b> нейронов<br>
              Параметры: <b>0</b><br><br>
              Flatten: преобразуем 3D тензор 5x5x32 в 1D вектор длины 800
            </div>
            <div class="why">После двух Conv+Pool тензор сжался с 28x28x1 = 784 до 5x5x32 = 800. Пространственный размер уменьшился (28→5), но каналов стало больше (1→32). Каждый канал — отдельный «детектор паттерна».</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: FC1(800→128) и FC2(128→10)</h4>
            <div class="calc">
              <b>FC1 (800 → 128):</b><br>
              Веса: 800 x 128 = 102 400<br>
              Bias: 128<br>
              Итого: <b>102 528 параметров</b><br><br>
              <b>FC2 (128 → 10):</b><br>
              Веса: 128 x 10 = 1 280<br>
              Bias: 10<br>
              Итого: <b>1 290 параметров</b>
            </div>
            <div class="why">FC1 — «бутылочное горлышко»: 102 528 из 108 618 всех параметров! Это 94% модели. Именно поэтому в современных CNN FC заменяют на Global Average Pooling.</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6: Итоговая таблица</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Слой</th><th>Выход</th><th>Параметры</th><th>% от всех</th></tr>
                <tr><td>Вход</td><td>28x28x1</td><td>—</td><td>—</td></tr>
                <tr><td>Conv1 (3x3, 16)</td><td>26x26x16</td><td>160</td><td>0.1%</td></tr>
                <tr><td>MaxPool1 (2x2)</td><td>13x13x16</td><td>0</td><td>—</td></tr>
                <tr><td>Conv2 (3x3, 32)</td><td>11x11x32</td><td>4 640</td><td>4.3%</td></tr>
                <tr><td>MaxPool2 (2x2)</td><td>5x5x32</td><td>0</td><td>—</td></tr>
                <tr><td>Flatten</td><td>800</td><td>—</td><td>—</td></tr>
                <tr><td>FC1 (→128)</td><td>128</td><td><b>102 528</b></td><td><b>94.4%</b></td></tr>
                <tr><td>FC2 (→10)</td><td>10</td><td>1 290</td><td>1.2%</td></tr>
                <tr><td colspan="2"><b>ИТОГО</b></td><td colspan="2"><b>108 618</b></td></tr>
              </table>
            </div>
            <div class="illustration bordered">
              <svg viewBox="0 0 500 80" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
                <text x="250" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">Распределение параметров</text>
                <!-- Bar chart -->
                <rect x="20" y="25" width="2" height="40" fill="#6366f1" rx="1"/><text x="21" y="75" text-anchor="middle" font-size="7" fill="#64748b">Conv1</text>
                <rect x="40" y="25" width="20" height="40" fill="#6366f1" rx="1"/><text x="50" y="75" text-anchor="middle" font-size="7" fill="#64748b">Conv2</text>
                <rect x="80" y="25" width="380" height="40" fill="#ef4444" rx="1"/><text x="270" y="50" text-anchor="middle" font-size="11" fill="#fff" font-weight="600">FC1: 102 528 (94.4%)</text>
                <rect x="462" y="25" width="8" height="40" fill="#f59e0b" rx="1"/><text x="466" y="75" text-anchor="middle" font-size="7" fill="#64748b">FC2</text>
              </svg>
            </div>
            <div class="why">Conv-слои экономны (160 + 4640 = 4800 параметров), потому что каждый фильтр переиспользуется для всех позиций. FC-слой расточителен: каждый из 800 входов соединён с каждым из 128 выходов. Решение: Global Average Pooling заменяет FC.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Всего: 108 618 параметров. Conv1: 160 (0.1%), Conv2: 4640 (4.3%), FC1: 102 528 (94.4%), FC2: 1290 (1.2%). FC-слой доминирует. С padding размеры были бы больше (28→14→7), и FC ещё тяжелее.</p>
          </div>
          <div class="lesson-box">
            <b>Формула параметров Conv:</b> k x k x C_in x C_out + C_out. Формула параметров FC: N_in x N_out + N_out. Conv растёт с глубиной каналов, FC — с пространственным размером. Современные CNN (ResNet, EfficientNet) используют GAP для устранения FC.
          </div>
        `
      },
      {
        title: 'Что видят фильтры: горизонт, вертикаль, диагональ',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Одно и то же изображение 5x5 пропустить через 3 разных фильтра: вертикальный Собель, горизонтальный Собель, диагональный. Сравнить выходы и понять, что «видит» каждый фильтр.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Входное изображение с двумя типами границ</h4>
            <div class="example-data-table">
              <table>
                <tr><th colspan="5">Изображение I (5x5)</th></tr>
                <tr><td>10</td><td>10</td><td>80</td><td>80</td><td>80</td></tr>
                <tr><td>10</td><td>10</td><td>80</td><td>80</td><td>80</td></tr>
                <tr><td>10</td><td>10</td><td>80</td><td>80</td><td>80</td></tr>
                <tr><td>80</td><td>80</td><td>80</td><td>80</td><td>80</td></tr>
                <tr><td>80</td><td>80</td><td>80</td><td>80</td><td>80</td></tr>
              </table>
            </div>
            <div class="calc">
              <b>Вертикальная граница:</b> столбец 1→2 (10→80) в строках 0–2<br>
              <b>Горизонтальная граница:</b> строка 2→3 (10→80) в столбцах 0–1<br>
              <b>Правый нижний угол:</b> однородная область (всё 80)
            </div>
            <div class="why">Изображение содержит «Г»-образную тёмную область (10) в левом верхнем углу. Остальное — светлое (80). Есть и вертикальная, и горизонтальная граница.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Фильтр 1 — вертикальный Собель</h4>
            <div class="calc">
              $K_v = \\begin{pmatrix}-1&0&1\\\\-2&0&2\\\\-1&0&1\\end{pmatrix}$<br><br>
              Этот фильтр реагирует на разницу «лево vs право».<br><br>
              Ключевые позиции feature map (3x3):<br><br>
              (0,0): окно $\\begin{pmatrix}10&10&80\\\\10&10&80\\\\10&10&80\\end{pmatrix}$<br>
              = (-1)·10 + 0·10 + 1·80 + (-2)·10 + 0·10 + 2·80 + (-1)·10 + 0·10 + 1·80<br>
              = -10+80-20+160-10+80 = <b>280</b> (сильный отклик!)<br><br>
              (0,2): окно $\\begin{pmatrix}80&80&80\\\\80&80&80\\\\80&80&80\\end{pmatrix}$<br>
              = -80+80-160+160-80+80 = <b>0</b> (однородно)<br><br>
              (2,0): окно $\\begin{pmatrix}10&10&80\\\\80&80&80\\\\80&80&80\\end{pmatrix}$<br>
              = -10+80-160+160-80+80 = <b>70</b> (слабый: граница только в 1 строке из 3)
            </div>
            <div class="example-data-table">
              <table>
                <tr><th colspan="3">Верт. Собель: feature map</th></tr>
                <tr><td><b>280</b></td><td>210</td><td>0</td></tr>
                <tr><td><b>280</b></td><td>140</td><td>0</td></tr>
                <tr><td>70</td><td>0</td><td>0</td></tr>
              </table>
            </div>
            <div class="why">Вертикальный фильтр «зажёг» левый столбец (280, 280, 70) — там вертикальная граница. Правый столбец = 0 (однородная область). Фильтр НАШЁЛ вертикальную границу и ПРОИГНОРИРОВАЛ горизонтальную.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Фильтр 2 — горизонтальный Собель</h4>
            <div class="calc">
              $K_h = \\begin{pmatrix}-1&-2&-1\\\\0&0&0\\\\1&2&1\\end{pmatrix}$<br><br>
              Этот фильтр реагирует на разницу «верх vs низ».<br><br>
              (0,0): окно $\\begin{pmatrix}10&10&80\\\\10&10&80\\\\10&10&80\\end{pmatrix}$<br>
              = (-1)·10+(-2)·10+(-1)·80 + 0+0+0 + 1·10+2·10+1·80<br>
              = -10-20-80+10+20+80 = <b>0</b> (нет горизонтальной границы!)<br><br>
              (2,0): окно $\\begin{pmatrix}10&10&80\\\\80&80&80\\\\80&80&80\\end{pmatrix}$<br>
              = (-1)·10+(-2)·10+(-1)·80 + 0+0+0 + 1·80+2·80+1·80<br>
              = -10-20-80+80+160+80 = <b>210</b> (сильный!)<br><br>
              (2,2): окно $\\begin{pmatrix}80&80&80\\\\80&80&80\\\\80&80&80\\end{pmatrix}$<br>
              = -80-160-80+80+160+80 = <b>0</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th colspan="3">Гориз. Собель: feature map</th></tr>
                <tr><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>140</td><td>70</td><td>0</td></tr>
                <tr><td><b>210</b></td><td><b>140</b></td><td>0</td></tr>
              </table>
            </div>
            <div class="why">Горизонтальный фильтр «зажёг» нижнюю строку (210, 140) — там горизонтальная граница. Верхняя строка = 0. Этот фильтр НАШЁЛ горизонтальную границу и ПРОИГНОРИРОВАЛ вертикальную!</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Фильтр 3 — диагональный (45 градусов)</h4>
            <div class="calc">
              $K_d = \\begin{pmatrix}0&-1&-2\\\\1&0&-1\\\\2&1&0\\end{pmatrix}$<br><br>
              Реагирует на диагональную границу (из правого верхнего в левый нижний).<br><br>
              (0,0): окно $\\begin{pmatrix}10&10&80\\\\10&10&80\\\\10&10&80\\end{pmatrix}$<br>
              = 0·10+(-1)·10+(-2)·80 + 1·10+0·10+(-1)·80 + 2·10+1·10+0·80<br>
              = 0-10-160+10+0-80+20+10+0 = <b>-210</b> → после ReLU: <b>0</b><br><br>
              (1,0): окно $\\begin{pmatrix}10&10&80\\\\10&10&80\\\\80&80&80\\end{pmatrix}$<br>
              = 0-10-160+10+0-80+160+80+0 = <b>0</b><br><br>
              (2,0): окно $\\begin{pmatrix}10&10&80\\\\80&80&80\\\\80&80&80\\end{pmatrix}$<br>
              = 0-10-160+80+0-80+160+80+0 = <b>70</b>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th colspan="3">Диагон. фильтр: feature map</th></tr>
                <tr><td>-210</td><td>-140</td><td>0</td></tr>
                <tr><td>0</td><td>-70</td><td>0</td></tr>
                <tr><td>70</td><td>0</td><td>0</td></tr>
              </table>
            </div>
            <div class="calc">
              После ReLU (обнуляем отрицательные):<br>
              $\\begin{pmatrix}0&0&0\\\\0&0&0\\\\70&0&0\\end{pmatrix}$
            </div>
            <div class="why">Диагональный фильтр почти не активировался (только 70 в одной ячейке). Потому что в изображении НЕТ диагональных границ — только вертикальные и горизонтальные. Каждый фильтр «видит» только свой тип паттерна!</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Сравнение трёх фильтров</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg" style="max-width:500px;">
                <text x="250" y="14" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">Три фильтра — три разных «зрения»</text>
                <!-- Vertical filter result -->
                <g transform="translate(20,25)">
                  <text x="45" y="0" text-anchor="middle" font-size="9" fill="#6366f1" font-weight="600">Верт. Собель</text>
                  <rect x="0" y="5" width="30" height="30" fill="#f97316"/><rect x="30" y="5" width="30" height="30" fill="#fdba74"/><rect x="60" y="5" width="30" height="30" fill="#f1f5f9"/>
                  <rect x="0" y="35" width="30" height="30" fill="#f97316"/><rect x="30" y="35" width="30" height="30" fill="#fef3c7"/><rect x="60" y="35" width="30" height="30" fill="#f1f5f9"/>
                  <rect x="0" y="65" width="30" height="30" fill="#fef3c7"/><rect x="30" y="65" width="30" height="30" fill="#f1f5f9"/><rect x="60" y="65" width="30" height="30" fill="#f1f5f9"/>
                  <text x="45" y="110" text-anchor="middle" font-size="8" fill="#64748b">видит | границу</text>
                </g>
                <!-- Horizontal filter result -->
                <g transform="translate(170,25)">
                  <text x="45" y="0" text-anchor="middle" font-size="9" fill="#10b981" font-weight="600">Гориз. Собель</text>
                  <rect x="0" y="5" width="30" height="30" fill="#f1f5f9"/><rect x="30" y="5" width="30" height="30" fill="#f1f5f9"/><rect x="60" y="5" width="30" height="30" fill="#f1f5f9"/>
                  <rect x="0" y="35" width="30" height="30" fill="#fef3c7"/><rect x="30" y="35" width="30" height="30" fill="#fef3c7"/><rect x="60" y="35" width="30" height="30" fill="#f1f5f9"/>
                  <rect x="0" y="65" width="30" height="30" fill="#fdba74"/><rect x="30" y="65" width="30" height="30" fill="#fef3c7"/><rect x="60" y="65" width="30" height="30" fill="#f1f5f9"/>
                  <text x="45" y="110" text-anchor="middle" font-size="8" fill="#64748b">видит — границу</text>
                </g>
                <!-- Diagonal filter result -->
                <g transform="translate(320,25)">
                  <text x="45" y="0" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="600">Диагон. фильтр</text>
                  <rect x="0" y="5" width="30" height="30" fill="#f1f5f9"/><rect x="30" y="5" width="30" height="30" fill="#f1f5f9"/><rect x="60" y="5" width="30" height="30" fill="#f1f5f9"/>
                  <rect x="0" y="35" width="30" height="30" fill="#f1f5f9"/><rect x="30" y="35" width="30" height="30" fill="#f1f5f9"/><rect x="60" y="35" width="30" height="30" fill="#f1f5f9"/>
                  <rect x="0" y="65" width="30" height="30" fill="#fef3c7"/><rect x="30" y="65" width="30" height="30" fill="#f1f5f9"/><rect x="60" y="65" width="30" height="30" fill="#f1f5f9"/>
                  <text x="45" y="110" text-anchor="middle" font-size="8" fill="#64748b">почти пусто</text>
                </g>
              </svg>
            </div>
            <div class="example-data-table">
              <table>
                <tr><th>Фильтр</th><th>Макс. отклик</th><th>Сумма после ReLU</th><th>Что нашёл</th></tr>
                <tr><td>Верт. Собель</td><td><b>280</b></td><td><b>980</b></td><td>Вертикальную границу слева</td></tr>
                <tr><td>Гориз. Собель</td><td><b>210</b></td><td><b>560</b></td><td>Горизонтальную границу снизу</td></tr>
                <tr><td>Диагональный</td><td>70</td><td>70</td><td>Почти ничего (нет диагонали)</td></tr>
              </table>
            </div>
            <div class="why">Каждый фильтр — специалист по своему типу границ. CNN обучает фильтры автоматически: первый слой находит края (как Собель), второй — текстуры (комбинации краёв), третий — части объектов, и так далее. Это иерархия признаков.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Вертикальный фильтр: сильный отклик (280) на вертикальной границе. Горизонтальный: сильный (210) на горизонтальной. Диагональный: почти нулевой (нет диагонали). Каждый фильтр «видит» только свой паттерн. CNN автоматически обучает набор фильтров для задачи.</p>
          </div>
          <div class="lesson-box">
            В реальной CNN первый слой содержит 32–64 фильтра, которые обучаются автоматически. После обучения они оказываются похожи на Собеля, Габора и другие классические детекторы. Но CNN может найти и нестандартные фильтры, специфичные для задачи (например, детектор кошачьих глаз).
          </div>
        `
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: фильтры свёртки в действии</h3>
        <p>Выбери фильтр и посмотри, что он извлекает из тестового изображения.</p>
        <div class="sim-container">
          <div class="sim-controls" id="cnn-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="cnn-apply">▶ Применить</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
              <div>
                <p style="font-size:12px;font-weight:600;color:#475569;margin-bottom:4px;">Вход</p>
                <div style="height:220px;"><canvas id="cnn-in" class="sim-canvas"></canvas></div>
              </div>
              <div>
                <p style="font-size:12px;font-weight:600;color:#475569;margin-bottom:4px;">Фильтр (kernel)</p>
                <div style="height:220px;"><canvas id="cnn-kernel" class="sim-canvas"></canvas></div>
              </div>
              <div>
                <p style="font-size:12px;font-weight:600;color:#475569;margin-bottom:4px;">Выход (feature map)</p>
                <div style="height:220px;"><canvas id="cnn-out" class="sim-canvas"></canvas></div>
              </div>
            </div>
            <div class="sim-stats" id="cnn-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#cnn-controls');
        const cFilter = App.makeControl('select', 'cnn-filter', 'Фильтр', {
          options: [
            { value: 'sobelx', label: 'Sobel X (верт. границы)' },
            { value: 'sobely', label: 'Sobel Y (гориз. границы)' },
            { value: 'edge', label: 'Laplacian (все границы)' },
            { value: 'blur', label: 'Размытие (среднее)' },
            { value: 'sharpen', label: 'Резкость' },
            { value: 'emboss', label: 'Тиснение' },
            { value: 'identity', label: 'Identity' },
          ],
          value: 'edge',
        });
        const cInput = App.makeControl('select', 'cnn-input', 'Изображение', {
          options: [{ value: 'circle', label: 'Круг' }, { value: 'cross', label: 'Крест' }, { value: 'diag', label: 'Диагональ' }, { value: 'checker', label: 'Шахматка' }, { value: 'face', label: 'Лицо' }],
          value: 'circle',
        });
        [cFilter, cInput].forEach(c => controls.appendChild(c.wrap));

        const size = 32;
        function genImage(type) {
          const img = Array.from({ length: size }, () => new Array(size).fill(0));
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              if (type === 'circle') {
                const d = Math.sqrt((i - size / 2) ** 2 + (j - size / 2) ** 2);
                img[i][j] = d < 10 ? 1 : 0;
              } else if (type === 'cross') {
                img[i][j] = (Math.abs(i - size / 2) < 3 || Math.abs(j - size / 2) < 3) ? 1 : 0;
              } else if (type === 'diag') {
                img[i][j] = Math.abs(i - j) < 3 ? 1 : 0;
              } else if (type === 'checker') {
                img[i][j] = ((Math.floor(i / 4) + Math.floor(j / 4)) % 2) === 0 ? 1 : 0;
              } else {
                // simple face: head + eyes + mouth
                const d = Math.sqrt((i - size / 2) ** 2 + (j - size / 2) ** 2);
                let v = d < 12 ? 0.8 : 0;
                if (Math.sqrt((i - 12) ** 2 + (j - 12) ** 2) < 2) v = 0;
                if (Math.sqrt((i - 12) ** 2 + (j - 20) ** 2) < 2) v = 0;
                if (i > 18 && i < 22 && j > 12 && j < 20) v = 0;
                img[i][j] = v;
              }
            }
          }
          return img;
        }

        const kernels = {
          sobelx: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
          sobely: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]],
          edge: [[0, -1, 0], [-1, 4, -1], [0, -1, 0]],
          blur: [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]],
          sharpen: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
          emboss: [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]],
          identity: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
        };

        function conv2d(img, k) {
          const n = img.length;
          const out = Array.from({ length: n }, () => new Array(n).fill(0));
          for (let i = 1; i < n - 1; i++) {
            for (let j = 1; j < n - 1; j++) {
              let s = 0;
              for (let ki = 0; ki < 3; ki++) for (let kj = 0; kj < 3; kj++) {
                s += img[i + ki - 1][j + kj - 1] * k[ki][kj];
              }
              out[i][j] = s;
            }
          }
          return out;
        }

        function drawMatrix(canvasId, mat, autoRange = false) {
          const canvas = container.querySelector(canvasId);
          const ctx = canvas.getContext('2d');
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width; canvas.height = rect.height;
          const n = mat.length;
          const cs = Math.min(canvas.width, canvas.height) / n;
          const off = ((canvas.width - cs * n) / 2);
          const offY = ((canvas.height - cs * n) / 2);
          let mn = Infinity, mx = -Infinity;
          if (autoRange) {
            for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
              if (mat[i][j] < mn) mn = mat[i][j];
              if (mat[i][j] > mx) mx = mat[i][j];
            }
          } else { mn = 0; mx = 1; }
          const range = mx - mn || 1;
          for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
              const v = (mat[i][j] - mn) / range;
              const c = Math.round(v * 255);
              ctx.fillStyle = `rgb(${c},${c},${c})`;
              ctx.fillRect(off + j * cs, offY + i * cs, cs + 1, cs + 1);
            }
          }
        }

        function drawKernel(canvasId, k) {
          const canvas = container.querySelector(canvasId);
          const ctx = canvas.getContext('2d');
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width; canvas.height = rect.height;
          const cs = Math.min(canvas.width, canvas.height) / 3;
          const off = (canvas.width - cs * 3) / 2;
          const offY = (canvas.height - cs * 3) / 2;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const v = k[i][j];
              const col = v > 0 ? `rgba(59,130,246,${Math.min(1, Math.abs(v) / 2)})` : v < 0 ? `rgba(239,68,68,${Math.min(1, Math.abs(v) / 2)})` : '#fff';
              ctx.fillStyle = col;
              ctx.fillRect(off + j * cs, offY + i * cs, cs, cs);
              ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1;
              ctx.strokeRect(off + j * cs, offY + i * cs, cs, cs);
              ctx.fillStyle = '#0f172a';
              ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(v.toFixed(2).replace(/\.?0+$/, ''), off + j * cs + cs / 2, offY + i * cs + cs / 2);
            }
          }
        }

        function run() {
          const img = genImage(cInput.input.value);
          const k = kernels[cFilter.input.value];
          const out = conv2d(img, k);
          drawMatrix('#cnn-in', img);
          drawKernel('#cnn-kernel', k);
          drawMatrix('#cnn-out', out, true);
          container.querySelector('#cnn-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Размер входа</div><div class="stat-value">${size}×${size}</div></div>
            <div class="stat-card"><div class="stat-label">Ядро</div><div class="stat-value">3×3</div></div>
            <div class="stat-card"><div class="stat-label">Фильтр</div><div class="stat-value" style="font-size:13px;">${cFilter.input.value}</div></div>
          `;
        }

        cFilter.input.addEventListener('change', run);
        cInput.input.addEventListener('change', run);
        container.querySelector('#cnn-apply').onclick = run;
        setTimeout(run, 50);
        window.addEventListener('resize', run);
      },
    },

    python: `
      <h3>CNN на Python (PyTorch)</h3>
      <p>Строим свёрточную сеть для MNIST: nn.Conv2d + nn.MaxPool2d. Показываем архитектуру и torchvision transforms.</p>

      <h4>1. Архитектура CNN для MNIST (28×28 → 10 классов)</h4>
      <pre><code>import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        # Свёрточные блоки: извлекаем признаки из изображения
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)  # 1 канал → 32 фильтра
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1) # 32 → 64 фильтра
        self.pool  = nn.MaxPool2d(2, 2)                           # уменьшаем в 2 раза
        self.dropout = nn.Dropout(0.25)

        # Полносвязные слои: классификация на основе признаков
        # После 2 пулингов: 28→14→7; итого 64*7*7 = 3136
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)              # 10 классов цифр

    def forward(self, x):
        # Блок 1: свёртка → ReLU → пулинг
        x = self.pool(F.relu(self.conv1(x)))       # [B,32,14,14]
        # Блок 2: свёртка → ReLU → пулинг
        x = self.pool(F.relu(self.conv2(x)))       # [B,64,7,7]
        x = self.dropout(x)
        x = x.view(x.size(0), -1)                 # разворачиваем в вектор
        x = F.relu(self.fc1(x))
        return self.fc2(x)                         # логиты (без softmax)

model = SimpleCNN()
print(model)

# Считаем количество параметров
total = sum(p.numel() for p in model.parameters())
print(f"Параметров: {total:,}")

# Проверяем форму: батч из 4 изображений 28×28
x_dummy = torch.randn(4, 1, 28, 28)
out = model(x_dummy)
print(f"Выход: {out.shape}")   # torch.Size([4, 10])
</code></pre>

      <h4>2. torchvision: загрузка MNIST и аугментации</h4>
      <pre><code>import torch
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# Трансформации: нормализация и аугментация для обучения
train_transform = transforms.Compose([
    transforms.RandomRotation(10),          # случайный поворот ±10°
    transforms.RandomAffine(0, translate=(0.1, 0.1)),  # случайный сдвиг
    transforms.ToTensor(),                  # PIL Image → FloatTensor [0,1]
    transforms.Normalize((0.1307,), (0.3081,)),  # нормализация (mean, std) MNIST
])

# Для теста — только нормализация, без аугментаций
test_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,)),
])

# Загружаем датасеты (скачивает автоматически)
train_ds = datasets.MNIST('./data', train=True,  download=True, transform=train_transform)
test_ds  = datasets.MNIST('./data', train=False, download=True, transform=test_transform)

train_loader = DataLoader(train_ds, batch_size=64, shuffle=True,  num_workers=2)
test_loader  = DataLoader(test_ds,  batch_size=256, shuffle=False, num_workers=2)

print(f"Обучающих батчей: {len(train_loader)}")   # 60000/64 ≈ 938
print(f"Тестовых батчей:  {len(test_loader)}")    # 10000/256 ≈ 40
</code></pre>

      <h4>3. Полный цикл обучения CNN</h4>
      <pre><code>import torch
import torch.nn as nn
import torch.optim as optim

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model  = SimpleCNN().to(device)               # переносим на GPU если есть

optimizer = optim.Adam(model.parameters(), lr=1e-3)
loss_fn   = nn.CrossEntropyLoss()
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.5)

def train_epoch(loader):
    model.train()
    total_loss, correct = 0, 0
    for imgs, labels in loader:
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        out  = model(imgs)
        loss = loss_fn(out, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
        correct    += (out.argmax(1) == labels).sum().item()
    return total_loss / len(loader), correct / len(loader.dataset)

def eval_epoch(loader):
    model.eval()
    correct = 0
    with torch.no_grad():
        for imgs, labels in loader:
            imgs, labels = imgs.to(device), labels.to(device)
            correct += (model(imgs).argmax(1) == labels).sum().item()
    return correct / len(loader.dataset)

for epoch in range(10):
    loss, train_acc = train_epoch(train_loader)
    test_acc        = eval_epoch(test_loader)
    scheduler.step()                          # снижаем lr каждые 5 эпох
    print(f"Ep {epoch+1:2d}: loss={loss:.3f}, train={train_acc:.2%}, test={test_acc:.2%}")
# Типичный результат: test accuracy ~99% за 10 эпох
</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Классификация изображений</b> — ImageNet, медицинская диагностика.</li>
        <li><b>Детекция объектов</b> — YOLO, Faster R-CNN.</li>
        <li><b>Семантическая сегментация</b> — U-Net, DeepLab.</li>
        <li><b>Распознавание лиц</b> — FaceNet.</li>
        <li><b>OCR</b> — распознавание текста.</li>
        <li><b>Генерация изображений</b> — GAN, Stable Diffusion использует U-Net.</li>
        <li><b>Видео, аудио (спектрограммы)</b> — 2D и 3D CNN.</li>
        <li><b>Medical imaging</b> — МРТ, КТ, рентген.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Отлично для изображений</li>
            <li>Translation invariance</li>
            <li>Параметры переиспользуются (weight sharing)</li>
            <li>Иерархия признаков — от простых к сложным</li>
            <li>State-of-the-art на image tasks (до Vision Transformer)</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Нужно много данных</li>
            <li>Долго обучается, требует GPU</li>
            <li>Плохая интерпретируемость</li>
            <li>Не rotation-invariant сами по себе</li>
            <li>Проигрывают Transformer-ам на очень больших данных</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>2D свёртка (дискретная)</h3>
      <div class="math-block">$$(I * K)(i, j) = \\sum_{m} \\sum_{n} I(i+m, j+n) \\cdot K(m, n)$$</div>

      <h3>Размеры выхода</h3>
      <div class="math-block">$$H_{out} = \\left\\lfloor \\frac{H_{in} + 2p - k}{s} \\right\\rfloor + 1$$</div>
      <p>где p — padding, k — kernel size, s — stride.</p>

      <h3>Количество параметров</h3>
      <p>Для conv-слоя с входом $C_{in}$ каналов, $C_{out}$ фильтров размера $k \\times k$:</p>
      <div class="math-block">$$\\text{params} = k^2 \\cdot C_{in} \\cdot C_{out} + C_{out}$$</div>

      <h3>Receptive field</h3>
      <p>Область входа, влияющая на один нейрон выхода. Растёт с глубиной. Для n сложенных свёрток k×k (stride=1):</p>
      <div class="math-block">$$RF = 1 + n(k - 1)$$</div>

      <h3>Backward через свёртку</h3>
      <p>Градиент по K = свёртка входа с градиентом выхода. Градиент по входу = full-свёртка повёрнутого K с градиентом выхода.</p>
    `,

    extra: `
      <h3>Известные архитектуры</h3>
      <ul>
        <li><b>LeNet-5</b> (1998) — первая CNN для MNIST.</li>
        <li><b>AlexNet</b> (2012) — первый большой успех на ImageNet, ReLU, dropout.</li>
        <li><b>VGG</b> (2014) — простая, только 3×3 свёртки.</li>
        <li><b>GoogLeNet / Inception</b> (2014) — inception-модули.</li>
        <li><b>ResNet</b> (2015) — skip connections, очень глубокие.</li>
        <li><b>EfficientNet</b> (2019) — балансировка depth/width/resolution.</li>
        <li><b>Vision Transformer</b> (2020) — attention вместо свёрток.</li>
      </ul>

      <h3>Residual connections</h3>
      <p>$y = F(x) + x$ — «short-cut» вокруг блока слоёв. Решает vanishing gradients, позволяет сети в 100+ слоёв.</p>

      <h3>Batch Normalization</h3>
      <p>Нормализует активации в батче. Ускоряет обучение, регуляризирует, позволяет большие learning rates.</p>

      <h3>Dilated / Atrous Convolution</h3>
      <p>Свёртка с «дырками» — расширяет receptive field без роста параметров. Для семантической сегментации.</p>

      <h3>Transposed Convolution</h3>
      <p>«Обратная» свёртка для увеличения разрешения. Используется в autoencoders, GAN, сегментации.</p>

      <h3>Transfer Learning</h3>
      <p>Взять предобученную сеть (например, ResNet на ImageNet), заморозить большую часть, дообучить последние слои. Работает на маленьких датасетах.</p>

      <h3>Data Augmentation</h3>
      <ul>
        <li>Повороты, отражения, масштабирование, обрезка.</li>
        <li>Цветовые искажения.</li>
        <li>Mixup, CutMix — смешивание изображений.</li>
        <li>AutoAugment, RandAugment — автоподбор.</li>
      </ul>
    `,
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=KuXjwB4LzSA" target="_blank">3Blue1Brown: But what is a convolution?</a> — визуальная интуиция свёрточных операций</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://cs231n.stanford.edu/" target="_blank">CS231n Stanford: Convolutional Neural Networks</a> — классический курс по CNN для компьютерного зрения</li>
        <li><a href="https://habr.com/ru/articles/309508/" target="_blank">Habr: Свёрточные нейронные сети</a> — разбор архитектуры с примерами</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html" target="_blank">PyTorch: Training a CNN on CIFAR-10</a> — официальный туториал по обучению CNN</li>
      </ul>
    `,
  },
});
