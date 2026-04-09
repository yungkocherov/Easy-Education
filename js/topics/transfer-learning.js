/* ==========================================================================
   Transfer Learning и Fine-tuning
   ========================================================================== */
App.registerTopic({
  id: 'transfer-learning',
  category: 'dl',
  title: 'Transfer Learning и Fine-tuning',
  summary: 'Перенос знаний из обученной модели на новую задачу: быстрее, дешевле, точнее.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что тебе нужен повар для ресторана японской кухни. Есть два варианта:</p>
        <ol>
          <li><b>Обучить с нуля</b> — взять человека, который никогда не готовил. Учить его 5 лет: как держать нож, как варить рис, что такое умами, рецепты...</li>
          <li><b>Transfer Learning</b> — нанять опытного шеф-повара французской кухни. Он уже знает ножевые техники, принципы вкуса, работу с продуктами. Нужно лишь <b>доучить</b> его специфике японской кухни: суши, темпура, мисо. Это займёт 3 месяца вместо 5 лет.</li>
        </ol>
        <p>Transfer Learning в машинном обучении — это то же самое. Вместо того чтобы обучать нейросеть с нуля (случайные веса), мы берём модель, уже обученную на огромном датасете, и <b>адаптируем</b> её под нашу задачу. Модель уже «знает» базовые паттерны — нам нужно лишь научить её специфике.</p>
      </div>

      <h3>Почему обучение с нуля — расточительство</h3>
      <p>Обучение современных моделей с нуля требует колоссальных ресурсов:</p>
      <ul>
        <li><b>Данные</b> — ImageNet содержит 14 млн изображений, GPT-3 обучен на 300 млрд токенов. У вас вряд ли столько данных для вашей задачи.</li>
        <li><b>Вычисления</b> — обучение ResNet-50 на ImageNet занимает ~1 неделю на 8 GPU V100. Обучение GPT-3 стоило ~$4.6 млн.</li>
        <li><b>Время</b> — недели и месяцы экспериментов, подбора гиперпараметров.</li>
        <li><b>Переобучение</b> — если у вас мало данных (скажем, 1000 фотографий), модель с миллионами параметров просто запомнит обучающую выборку.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p><b>Transfer Learning</b> — это техника, при которой модель, обученная на одной задаче (source task), используется как отправная точка для другой задачи (target task). Знания, полученные на большом датасете, <b>переносятся</b> на новую задачу, ускоряя обучение и повышая качество.</p>
      </div>

      <h3>Что именно «переносится»?</h3>
      <p>Нейросеть учит иерархию признаков. Ранние слои извлекают универсальные паттерны, которые полезны для любой задачи:</p>
      <ul>
        <li><b>Слой 1-2 (CNN)</b> — границы, углы, цветовые градиенты. Эти признаки одинаковы для фотографий котов, рентгенов лёгких и спутниковых снимков.</li>
        <li><b>Слой 3-4</b> — текстуры, простые формы (круги, прямоугольники).</li>
        <li><b>Слой 5-6</b> — части объектов (глаза, колёса, крылья).</li>
        <li><b>Последние слои</b> — специфичные для задачи: «это кот», «это пневмония».</li>
      </ul>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 160" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <!-- Layer blocks -->
          <rect x="20" y="40" width="90" height="80" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="65" y="70" text-anchor="middle" font-size="10" fill="#1e40af" font-weight="600">Слои 1-2</text>
          <text x="65" y="85" text-anchor="middle" font-size="9" fill="#3b82f6">Границы,</text>
          <text x="65" y="97" text-anchor="middle" font-size="9" fill="#3b82f6">углы</text>

          <rect x="130" y="40" width="90" height="80" rx="8" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
          <text x="175" y="70" text-anchor="middle" font-size="10" fill="#4338ca" font-weight="600">Слои 3-4</text>
          <text x="175" y="85" text-anchor="middle" font-size="9" fill="#6366f1">Текстуры,</text>
          <text x="175" y="97" text-anchor="middle" font-size="9" fill="#6366f1">формы</text>

          <rect x="240" y="40" width="90" height="80" rx="8" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/>
          <text x="285" y="70" text-anchor="middle" font-size="10" fill="#be185d" font-weight="600">Слои 5-6</text>
          <text x="285" y="85" text-anchor="middle" font-size="9" fill="#ec4899">Части</text>
          <text x="285" y="97" text-anchor="middle" font-size="9" fill="#ec4899">объектов</text>

          <rect x="350" y="40" width="100" height="80" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="400" y="70" text-anchor="middle" font-size="10" fill="#92400e" font-weight="600">Голова</text>
          <text x="400" y="85" text-anchor="middle" font-size="9" fill="#f59e0b">Специфичный</text>
          <text x="400" y="97" text-anchor="middle" font-size="9" fill="#f59e0b">классификатор</text>

          <!-- Arrows -->
          <line x1="110" y1="80" x2="130" y2="80" stroke="#94a3b8" stroke-width="2"/>
          <line x1="220" y1="80" x2="240" y2="80" stroke="#94a3b8" stroke-width="2"/>
          <line x1="330" y1="80" x2="350" y2="80" stroke="#94a3b8" stroke-width="2"/>

          <!-- Labels -->
          <text x="175" y="145" text-anchor="middle" font-size="10" fill="#16a34a" font-weight="600">Замороженные (переносятся)</text>
          <text x="400" y="145" text-anchor="middle" font-size="10" fill="#dc2626" font-weight="600">Обучается заново</text>

          <!-- Brackets -->
          <line x1="20" y1="128" x2="330" y2="128" stroke="#16a34a" stroke-width="2"/>
          <line x1="350" y1="128" x2="450" y2="128" stroke="#dc2626" stroke-width="2"/>
        </svg>
        <div class="caption">Feature extraction: замораживаем ранние слои (универсальные признаки), обучаем только классификатор под новую задачу.</div>
      </div>

      <h3>Два подхода к Transfer Learning</h3>

      <h4>1. Feature Extraction (извлечение признаков)</h4>
      <p>Замораживаем все слои предобученной модели и используем её как «генератор признаков». Обучаем только новый классификатор поверх.</p>
      <ul>
        <li><b>Когда:</b> мало данных (100-1000 примеров), задача похожа на исходную.</li>
        <li><b>Преимущество:</b> быстро, не нужен GPU, минимальный риск переобучения.</li>
        <li><b>Пример:</b> ResNet обучен на ImageNet (животные, транспорт, еда). Для классификации пород собак просто заменяем последний слой.</li>
      </ul>

      <h4>2. Fine-tuning (тонкая настройка)</h4>
      <p>Размораживаем часть (или все) слоёв предобученной модели и дообучаем их с маленьким learning rate.</p>
      <ul>
        <li><b>Когда:</b> достаточно данных (5000+), задача может отличаться от исходной.</li>
        <li><b>Преимущество:</b> модель адаптируется глубже, более высокое качество.</li>
        <li><b>Риск:</b> catastrophic forgetting — модель «забывает» полезные признаки.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Feature Extraction vs Fine-tuning</div>
        <p><b>Feature Extraction</b> = замораживаем всё, обучаем голову. Быстро, безопасно, но потолок ниже.</p>
        <p><b>Fine-tuning</b> = размораживаем слои, дообучаем. Выше качество, но нужно больше данных и аккуратность.</p>
        <p>На практике часто используют комбинацию: сначала Feature Extraction (обучаем голову 5 эпох), потом Fine-tuning (размораживаем последние слои).</p>
      </div>

      <h3>Стратегия заморозки слоёв</h3>
      <p>Выбор того, какие слои замораживать, зависит от двух факторов:</p>
      <ol>
        <li><b>Размер вашего датасета</b> — мало данных? Больше замораживаем.</li>
        <li><b>Похожесть домена</b> — ваш домен похож на источник (ImageNet, Wikipedia)? Меньше настройки нужно.</li>
      </ol>

      <h3>Learning Rate стратегии для Fine-tuning</h3>

      <h4>Discriminative Learning Rates</h4>
      <p>Разные слои обучаются с разной скоростью. Ранние слои (универсальные признаки) — с очень маленьким lr, поздние — с большим:</p>
      <div class="math-block">$$lr_{\\text{слой}_i} = lr_{\\text{base}} \\cdot \\gamma^{(N - i)}$$</div>
      <p>где $\\gamma \\approx 0.1\\text{-}0.5$ — коэффициент затухания, $N$ — число слоёв, $i$ — номер слоя.</p>
      <div class="why">Ранние слои содержат универсальные признаки, которые не нужно сильно менять. Поздние слои более специфичны — им нужна большая корректировка. Поэтому lr ранних слоёв в 10-100 раз меньше, чем у поздних.</div>

      <h4>Warmup</h4>
      <p>Первые несколько сотен шагов lr растёт от 0 до целевого значения. Это не даёт модели резко «сломать» предобученные веса в начале fine-tuning.</p>
      <div class="math-block">$$lr(t) = lr_{\\text{target}} \\cdot \\min\\left(1,\\; \\frac{t}{T_{\\text{warmup}}}\\right)$$</div>

      <h3>Domain Adaptation</h3>
      <p>Иногда source и target домены сильно отличаются (например, фотографии из интернета vs. медицинские снимки). В таких случаях прямой transfer может не работать. Техники Domain Adaptation помогают сблизить распределения:</p>
      <ul>
        <li><b>Gradual unfreezing</b> — размораживаем по одному слою за эпоху, от верхних к нижним.</li>
        <li><b>Intermediate pre-training</b> — дообучаем модель на данных, близких к целевому домену, перед финальным fine-tuning.</li>
        <li><b>Data augmentation</b> — увеличиваем разнообразие целевых данных.</li>
      </ul>

      <h3>Популярные предобученные модели</h3>

      <div class="deep-dive">
        <h4>Computer Vision (ImageNet)</h4>
        <ul>
          <li><b>ResNet-50/101</b> — надёжная базовая модель, 25M параметров. Хорош для начала.</li>
          <li><b>EfficientNet-B0..B7</b> — оптимальный баланс точности и скорости. B0 — 5M параметров, B7 — 66M.</li>
          <li><b>ViT (Vision Transformer)</b> — transformer для изображений, state-of-the-art на больших данных.</li>
          <li><b>ConvNeXt</b> — современная CNN, конкурирует с ViT.</li>
        </ul>

        <h4>NLP</h4>
        <ul>
          <li><b>BERT (110M)</b> — двунаправленный энкодер, для классификации, NER, QA.</li>
          <li><b>RoBERTa</b> — улучшенный BERT (больше данных, лучше предобучение).</li>
          <li><b>GPT-2/3</b> — авторегрессивные модели, генерация текста.</li>
          <li><b>T5/FLAN-T5</b> — encoder-decoder, все задачи как text-to-text.</li>
        </ul>

        <h4>Multimodal</h4>
        <ul>
          <li><b>CLIP</b> — связывает изображения и текст. Обучен на 400M пар image-text.</li>
          <li><b>Whisper</b> — распознавание речи, обучен на 680K часов аудио.</li>
        </ul>
      </div>
    `,

    examples: [
      {
        title: 'ImageNet → классификация котов/собак',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>У нас есть 2000 фотографий: 1000 котов и 1000 собак. Нужно обучить классификатор. Сравним обучение с нуля vs. transfer learning с ResNet-50.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Подход «с нуля» — обучаем CNN самостоятельно</h4>
            <p>Строим простую CNN (5 свёрточных слоёв, ~2M параметров) и обучаем на 2000 фотографиях:</p>
            <div class="calc">
              Эпох: 50<br>
              Время: ~2 часа на GPU<br>
              <b>Accuracy: 72%</b>
            </div>
            <div class="why">2000 фотографий — это мало для CNN. Модель переобучается: на train — 98%, на test — 72%. Данных не хватает, чтобы выучить все необходимые признаки с нуля.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Transfer Learning — Feature Extraction</h4>
            <p>Берём ResNet-50, предобученный на ImageNet (1.2M изображений, 1000 классов). Замораживаем все свёрточные слои и обучаем только новый линейный классификатор:</p>
            <div class="calc">
              ResNet-50 выход: вектор размера 2048<br>
              Новый слой: Linear(2048, 2) — всего <b>4098 обучаемых параметров</b><br>
              Эпох: 10<br>
              Время: ~5 минут на GPU<br>
              <b>Accuracy: 93%</b>
            </div>
            <div class="why">ResNet уже знает, как выглядят границы, текстуры, части тел животных — всё это он выучил на ImageNet. Нам нужно лишь научить последний слой: «эти признаки = кот, эти = собака». 2000 примеров для этого достаточно.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Transfer Learning — Fine-tuning</h4>
            <p>Размораживаем последние 2 блока ResNet-50 и дообучаем их с маленьким learning rate:</p>
            <div class="calc">
              lr для замороженных слоёв: 0 (не обучаются)<br>
              lr для размороженных блоков: $1 \\times 10^{-5}$<br>
              lr для классификатора: $1 \\times 10^{-3}$<br>
              Эпох: 15<br>
              Время: ~20 минут на GPU<br>
              <b>Accuracy: 96%</b>
            </div>
            <div class="why">Fine-tuning позволяет адаптировать высокоуровневые признаки ResNet к нашей конкретной задаче. Разница с feature extraction — 3%, но для продакшена это может быть критично.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Итог: сравнение трёх подходов</h4>
            <table class="data-table">
              <tr><th>Подход</th><th>Accuracy</th><th>Время</th><th>Параметры для обучения</th></tr>
              <tr><td>С нуля</td><td>72%</td><td>2 часа</td><td>2M</td></tr>
              <tr><td>Feature Extraction</td><td>93%</td><td>5 минут</td><td>4K</td></tr>
              <tr><td>Fine-tuning</td><td>96%</td><td>20 минут</td><td>~8M</td></tr>
            </table>
            <div class="why">Transfer learning дал +24% accuracy и ускорил обучение в 6-24 раза. Это типичный результат: предобученные модели почти всегда побеждают обучение с нуля, особенно на малых данных.</div>
          </div>
        `
      },
      {
        title: 'BERT → анализ тональности',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Классификация отзывов на фильмы: положительный или отрицательный. Сравним классический TF-IDF + логрег (100K отзывов) vs. BERT fine-tuning (1000 отзывов).</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Классический подход — TF-IDF + Logistic Regression</h4>
            <p>Обучаем на полном датасете из 100 000 отзывов:</p>
            <div class="calc">
              Предобработка: токенизация, стоп-слова, TF-IDF (50K признаков)<br>
              Модель: LogisticRegression(C=1.0)<br>
              Обучение: ~2 минуты на CPU<br>
              <b>Accuracy: 88%</b>
            </div>
            <div class="why">TF-IDF не учитывает порядок слов, контекст, сарказм. «Фильм не плохой» и «фильм плохой» получают похожие признаки. 88% — это потолок для bag-of-words подхода.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: BERT fine-tuning на 1000 отзывах</h4>
            <p>Берём предобученный BERT-base (110M параметров), добавляем классификационную голову и fine-tune на <b>всего 1000</b> отзывах:</p>
            <div class="calc">
              BERT-base → [CLS] токен → Linear(768, 2)<br>
              lr = $2 \\times 10^{-5}$ с warmup 10% шагов<br>
              Эпох: 3<br>
              Batch size: 16<br>
              Время: ~10 минут на GPU<br>
              <b>Accuracy: 91%</b>
            </div>
            <div class="why">BERT понимает контекст, порядок слов, отрицания. Предобученный на миллиардах слов, он «знает» язык. 1000 примеров достаточно, чтобы научить его <b>конкретной задаче</b> — классификации тональности.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Главный вывод</h4>
            <table class="data-table">
              <tr><th>Модель</th><th>Данные</th><th>Accuracy</th><th>Понимает контекст?</th></tr>
              <tr><td>TF-IDF + LogReg</td><td>100 000</td><td>88%</td><td>Нет</td></tr>
              <tr><td>BERT fine-tuned</td><td>1 000</td><td>91%</td><td>Да</td></tr>
            </table>
            <div class="why">BERT с 1000 примерами побил TF-IDF со 100K примерами. Transfer learning позволяет достичь лучшего качества с <b>в 100 раз меньшим количеством данных</b>. Это и есть сила переноса знаний.</div>
          </div>
        `
      },
      {
        title: 'Когда замораживать слои',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Выбрать стратегию Transfer Learning в зависимости от размера данных и похожести домена. Ниже — практическое руководство.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Матрица решений</h4>
            <table class="data-table">
              <tr>
                <th></th>
                <th>Похожий домен</th>
                <th>Другой домен</th>
              </tr>
              <tr>
                <td><b>Мало данных<br>(100-1000)</b></td>
                <td>Feature Extraction: замораживаем всё, обучаем только голову. Риск переобучения минимален.</td>
                <td>Осторожный fine-tuning: замораживаем ранние слои (универсальные), fine-tune последние 1-2 блока с очень маленьким lr ($10^{-5}$).</td>
              </tr>
              <tr>
                <td><b>Много данных<br>(10K+)</b></td>
                <td>Fine-tuning всей модели: данных достаточно, чтобы адаптировать все слои. lr для ранних слоёв в 10x меньше.</td>
                <td>Fine-tuning всей модели с warmup и discriminative lr. Или даже обучение с нуля, если данных > 100K.</td>
              </tr>
            </table>
          </div>

          <div class="step" data-step="2">
            <h4>Пример 1: Мало данных + Похожий домен</h4>
            <p><b>Задача:</b> классификация пород кошек (500 фото), источник — ImageNet (есть категория «кошки»).</p>
            <div class="calc">
              Стратегия: Feature Extraction<br>
              Замораживаем: все слои ResNet-50<br>
              Обучаем: Linear(2048, 12) — 12 пород<br>
              Результат: <b>89% accuracy</b>
            </div>
            <div class="why">ImageNet уже содержит кошек — модель знает, как они выглядят. Нам нужно лишь научиться различать породы по уже извлечённым признакам.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Пример 2: Мало данных + Другой домен</h4>
            <p><b>Задача:</b> классификация дефектов на печатных платах (300 фото), источник — ImageNet (печатных плат нет).</p>
            <div class="calc">
              Стратегия: осторожный fine-tuning<br>
              Замораживаем: слои 1-3 (границы, текстуры — полезны)<br>
              Размораживаем: слои 4-5 (адаптируем к виду плат)<br>
              lr ранних: $10^{-6}$, lr поздних: $10^{-4}$<br>
              Результат: <b>82% accuracy</b> (с нуля было бы ~55%)
            </div>
            <div class="why">Ранние слои всё равно полезны — границы и текстуры нужны и для плат. Но поздние слои ImageNet ищут «глаза» и «колёса» — их нужно переучить на «трещины» и «замыкания».</div>
          </div>

          <div class="step" data-step="4">
            <h4>Пример 3: Много данных + Похожий домен</h4>
            <p><b>Задача:</b> классификация 200 видов птиц (50K фото), источник — ImageNet.</p>
            <div class="calc">
              Стратегия: полный fine-tuning<br>
              Discriminative lr: ранние $10^{-5}$, средние $10^{-4}$, голова $10^{-3}$<br>
              Warmup: 500 шагов<br>
              Результат: <b>94% accuracy</b> (feature extraction давал 85%)
            </div>
            <div class="why">Данных достаточно для fine-tuning без переобучения. Модель адаптирует все уровни признаков: от общих контуров до специфичных для птиц деталей (форма клюва, окраска).</div>
          </div>
        `
      }
    ],

    python: `
      <h3>Transfer Learning на Python</h3>
      <p>Два основных фреймворка: <b>PyTorch + torchvision</b> для Computer Vision и <b>HuggingFace Transformers</b> для NLP.</p>

      <h4>1. PyTorch: ResNet-50 для классификации изображений</h4>
      <pre><code>import torch
import torch.nn as nn
from torchvision import models, transforms, datasets
from torch.utils.data import DataLoader

# === 1. Загружаем предобученный ResNet-50 ===
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)

# === 2. Замораживаем все слои ===
for param in model.parameters():
    param.requires_grad = False

# === 3. Заменяем классификатор (голову) ===
# Оригинал: Linear(2048, 1000) — 1000 классов ImageNet
# Наш: Linear(2048, 2) — коты vs собаки
model.fc = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(2048, 2)
)
# Голова не заморожена — её параметры requires_grad=True по умолчанию

# === 4. Подготовка данных ===
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])
train_data = datasets.ImageFolder("data/train", transform=transform)
train_loader = DataLoader(train_data, batch_size=32, shuffle=True)

# === 5. Обучаем только голову (Feature Extraction) ===
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
criterion = nn.CrossEntropyLoss()

for epoch in range(10):
    for images, labels in train_loader:
        outputs = model(images)
        loss = criterion(outputs, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")

# === 6. Fine-tuning: размораживаем последние блоки ===
# Размораживаем layer4 (последний свёрточный блок)
for param in model.layer4.parameters():
    param.requires_grad = True

# Discriminative learning rates
optimizer = torch.optim.Adam([
    {"params": model.layer4.parameters(), "lr": 1e-5},  # Малый lr
    {"params": model.fc.parameters(), "lr": 1e-3},       # Большой lr
])

for epoch in range(5):
    for images, labels in train_loader:
        outputs = model(images)
        loss = criterion(outputs, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()</code></pre>

      <h4>2. HuggingFace: Fine-tuning BERT для классификации текста</h4>
      <pre><code>from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)
from datasets import load_dataset
import numpy as np

# === 1. Загружаем предобученный BERT и токенизатор ===
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=2  # Положительный / Отрицательный
)

# === 2. Готовим данные ===
dataset = load_dataset("imdb")
# Берём только 1000 примеров для демонстрации
train_data = dataset["train"].shuffle(seed=42).select(range(1000))
test_data  = dataset["test"].shuffle(seed=42).select(range(500))

def tokenize(batch):
    return tokenizer(batch["text"], padding="max_length",
                     truncation=True, max_length=256)

train_data = train_data.map(tokenize, batched=True)
test_data  = test_data.map(tokenize, batched=True)

# === 3. Настраиваем обучение ===
args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=16,
    learning_rate=2e-5,             # Маленький lr для fine-tuning!
    warmup_ratio=0.1,               # 10% шагов — warmup
    weight_decay=0.01,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

# === 4. Метрика ===
def compute_metrics(eval_pred):
    predictions = np.argmax(eval_pred.predictions, axis=-1)
    labels = eval_pred.label_ids
    accuracy = (predictions == labels).mean()
    return {"accuracy": accuracy}

# === 5. Запускаем обучение ===
trainer = Trainer(
    model=model,
    args=args,
    train_dataset=train_data,
    eval_dataset=test_data,
    compute_metrics=compute_metrics,
)
trainer.train()

# === 6. Используем модель ===
from transformers import pipeline
classifier = pipeline("sentiment-analysis", model=model,
                      tokenizer=tokenizer)
result = classifier("This movie was absolutely fantastic!")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9987}]</code></pre>

      <h4>3. Заморозка отдельных слоёв BERT</h4>
      <pre><code># Замораживаем эмбеддинги и первые 8 из 12 слоёв
for param in model.bert.embeddings.parameters():
    param.requires_grad = False

for i in range(8):  # Замораживаем слои 0-7
    for param in model.bert.encoder.layer[i].parameters():
        param.requires_grad = False

# Остаются обучаемыми: слои 8-11 + классификатор
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
total = sum(p.numel() for p in model.parameters())
print(f"Обучаемых: {trainable:,} из {total:,} "
      f"({100*trainable/total:.1f}%)")
# Обучаемых: 30,234,370 из 109,483,778 (27.6%)</code></pre>
    `,

    applications: `
      <h3>Где применяется Transfer Learning</h3>
      <ul>
        <li><b>Медицина</b> — классификация рентгенов, МРТ, гистологии. Данных мало (сотни снимков), но ImageNet-модели дают 90%+ accuracy после fine-tuning.</li>
        <li><b>NLP в бизнесе</b> — анализ тональности отзывов, классификация тикетов, извлечение сущностей. BERT fine-tuning на 1000 примерах.</li>
        <li><b>Автономное вождение</b> — модели, предобученные на общих дорожных данных, адаптируются к конкретному городу или погоде.</li>
        <li><b>Сельское хозяйство</b> — детекция болезней растений по фотографиям листьев. Transfer с ImageNet.</li>
        <li><b>Промышленный контроль качества</b> — поиск дефектов на конвейере. Мало примеров дефектов, но transfer learning справляется.</li>
        <li><b>Чат-боты и Q&A</b> — fine-tuning GPT/LLaMA на корпоративных данных для внутреннего помощника.</li>
        <li><b>Распознавание речи</b> — Whisper fine-tuning на конкретный акцент или терминологию (медицина, юриспруденция).</li>
        <li><b>Рекомендательные системы</b> — предобученные эмбеддинги товаров (e.g., из CLIP) для cold start.</li>
        <li><b>Генерация изображений</b> — fine-tuning Stable Diffusion / LoRA для конкретного стиля или объекта.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>Плюсы</h4>
          <ul>
            <li>Работает с малым количеством данных (100-1000 примеров)</li>
            <li>Быстрое обучение (минуты вместо дней)</li>
            <li>Более высокая accuracy, чем обучение с нуля</li>
            <li>Меньше переобучения на малых данных</li>
            <li>Не нужны мощные GPU для feature extraction</li>
            <li>Проверенные архитектуры и веса — меньше экспериментов</li>
            <li>Доступны модели для CV, NLP, Audio, Multimodal</li>
          </ul>
        </div>
        <div class="cons">
          <h4>Минусы</h4>
          <ul>
            <li>Catastrophic forgetting — при агрессивном fine-tuning модель теряет полезные признаки</li>
            <li>Negative transfer — если домены слишком разные, перенос может навредить</li>
            <li>Размер модели — ResNet-50 = 98MB, BERT = 440MB, не всегда подходит для edge-устройств</li>
            <li>Зависимость от предобучения — баги и предвзятости источника переносятся</li>
            <li>Лицензирование — не все модели можно использовать коммерчески</li>
            <li>Ограниченная интерпретируемость — сложно понять, какие признаки перенеслись</li>
          </ul>
        </div>
      </div>
    `,

    links: `
      <h3>Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=yofjFQddwHE" target="_blank">Andrew Ng: Transfer Learning (Stanford CS230)</a> — объяснение концепции от ведущего эксперта</li>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest: канал</a> — поиск по «transfer learning» и «fine-tuning» для визуальных объяснений</li>
      </ul>
      <h3>Статьи</h3>
      <ul>
        <li><a href="https://arxiv.org/abs/1411.1792" target="_blank">How transferable are features in deep neural networks? (Yosinski et al., 2014)</a> — фундаментальная работа об универсальности признаков в нейросетях</li>
        <li><a href="https://arxiv.org/abs/1810.04805" target="_blank">BERT: Pre-training of Deep Bidirectional Transformers (Devlin et al., 2018)</a> — модель, совершившая революцию в NLP transfer learning</li>
        <li><a href="https://habr.com/ru/search/?q=transfer%20learning%20%D0%BF%D0%B5%D1%80%D0%B5%D0%BD%D0%BE%D1%81%20%D0%BE%D0%B1%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D1%8F" target="_blank">Habr: Transfer Learning</a> — статьи о переносе обучения на русском</li>
      </ul>
      <h3>Документация</h3>
      <ul>
        <li><a href="https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html" target="_blank">PyTorch: Transfer Learning Tutorial</a> — официальный туториал с кодом</li>
        <li><a href="https://huggingface.co/docs/transformers/training" target="_blank">HuggingFace: Fine-tuning Tutorial</a> — пошаговое руководство по fine-tuning трансформеров</li>
      </ul>
    `,
  },
});
