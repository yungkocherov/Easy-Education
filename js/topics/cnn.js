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

      <h3>Проблема обычных сетей на изображениях</h3>
      <p>Полносвязная сеть (MLP) для изображения 224×224×3 требует ~150 000 весов на <b>один</b> нейрон первого слоя. Для тысяч нейронов в сети — миллиарды параметров. Это:</p>
      <ul>
        <li>Огромный размер модели.</li>
        <li>Долгое обучение.</li>
        <li>Сильное переобучение (слишком много свободы).</li>
        <li><b>Игнорирует локальную структуру</b> изображения.</li>
      </ul>

      <p>Проблема в том, что полносвязная сеть <b>не знает</b>, что соседние пиксели связаны. Пиксель (10, 10) и (11, 10) для неё такие же «разные», как (10, 10) и (200, 200).</p>

      <h3>Три ключевых идеи CNN</h3>

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

      <h3>Операция свёртки</h3>
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

      <h3>Параметры свёртки</h3>
      <ul>
        <li><b>Kernel size</b> — размер фильтра. Обычно 3×3 или 5×5.</li>
        <li><b>Stride</b> — шаг скольжения. Stride=1: пиксель за пикселем. Stride=2: через один.</li>
        <li><b>Padding</b> — «рамка» из нулей по краям. Позволяет сохранить размер выхода.</li>
        <li><b>Channels</b> — число фильтров в слое = число каналов на выходе.</li>
      </ul>

      <p>Формула размера выхода:</p>
      <div class="math-block">$$H_{out} = \\left\\lfloor \\frac{H_{in} + 2p - k}{s} \\right\\rfloor + 1$$</div>

      <h3>Pooling (агрегация)</h3>
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

      <h3>Типичная архитектура CNN</h3>
      <pre>Input (224×224×3)  ← исходное изображение
  → Conv 3×3, 64 filters → ReLU → MaxPool 2×2   (112×112×64)
  → Conv 3×3, 128 filters → ReLU → MaxPool 2×2  (56×56×128)
  → Conv 3×3, 256 filters → ReLU → MaxPool 2×2  (28×28×256)
  → Flatten → FC → Softmax</pre>

      <p>Идея: <b>глубина растёт</b> (больше фильтров), <b>размер уменьшается</b> (pooling). Получаем компактное, но информативное представление.</p>

      <h3>Иерархия признаков</h3>
      <p>Вот в чём магия CNN. Разные слои выучивают <b>разные уровни</b> абстракции:</p>

      <ul>
        <li><b>Слой 1:</b> границы, цветовые пятна, простые текстуры.</li>
        <li><b>Слой 2-3:</b> углы, дуги, простые формы.</li>
        <li><b>Слой 4-5:</b> части объектов (глаза, колёса, окна).</li>
        <li><b>Последние слои:</b> целые объекты (лица, машины, коты).</li>
      </ul>

      <p>Это <b>автоматическое</b> обучение признаков — не нужно вручную описывать, что искать. CNN сама находит полезные паттерны.</p>

      <h3>Receptive field</h3>
      <p><span class="term" data-tip="Receptive Field. Область входного изображения, которая влияет на один нейрон в глубоком слое. Растёт с глубиной сети.">Receptive field</span> — это область входного изображения, которая влияет на один нейрон. С глубиной он растёт: нейрон в 5-м слое «видит» большую область оригинальной картинки.</p>
      <p>Глубокие слои учат крупные паттерны, потому что у них большой receptive field.</p>

      <h3>Плюсы и ограничения</h3>
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

      <h3>Как это связано с другими темами</h3>
      <ul>
        <li><b>MLP</b> — CNN это MLP с хитрыми ограничениями.</li>
        <li><b>Transfer Learning</b> — предобученные CNN используются как основа.</li>
        <li><b>Transformer / ViT</b> — конкурент CNN с 2020 года.</li>
        <li><b>GAN, Autoencoder</b> — используют CNN для изображений.</li>
      </ul>
    `,

    examples: `
      <h3>Пример 1: свёртка 3×3 для детекции границ</h3>
      <div class="example-card">
        <p>Фильтр Собеля (вертикальные границы):</p>
        <pre>[-1  0  1]
[-2  0  2]
[-1  0  1]</pre>
        <p>Применяя к изображению, получаем карту с сильным откликом на вертикальные границы.</p>
      </div>

      <h3>Пример 2: подсчёт параметров</h3>
      <div class="example-card">
        <p>Conv слой: вход 28×28×1, 32 фильтра 3×3:</p>
        <div class="example-data">Параметров = 3·3·1·32 + 32 (bias) = 320
Выход: 26×26×32 (без padding)</div>
        <p>Для сравнения, FC между 28×28 и 32 нейронами: 784·32 + 32 = 25120 параметров.</p>
      </div>

      <h3>Пример 3: размеры выходов</h3>
      <div class="example-card">
        <p>Формула:</p>
        <div class="math-block">$$H_{out} = \\frac{H_{in} + 2p - k}{s} + 1$$</div>
        <p>Вход 32×32, kernel 3, stride 1, padding 1 → выход 32×32 (same padding).</p>
        <p>MaxPool 2×2, stride 2: 32×32 → 16×16.</p>
      </div>
    `,

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
  },
});
