/* ==========================================================================
   Neural Network (MLP)
   ========================================================================== */
App.registerTopic({
  id: 'neural-network',
  category: 'dl',
  title: 'Нейронная сеть (MLP)',
  summary: 'Многослойный перцептрон — основа глубокого обучения.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь конвейер на фабрике. Сырьё (данные) проходит через много станций, на каждой оно <b>преобразуется</b>: очищается, сортируется, комбинируется, обрабатывается. На выходе — готовый продукт. Каждая станция умеет делать что-то простое, но вместе они создают сложный продукт.</p>
        <p>Нейросеть устроена так же. На входе — сырые признаки (пиксели, слова, числа). Каждый слой <b>преобразует</b> их в более полезное представление. В конце — ответ: класс, число, текст.</p>
        <p>Магия не в одном нейроне (он умеет только линейные комбинации), а в том, что сотни нейронов в нескольких слоях вместе выучивают <b>иерархию представлений</b>: от простых паттернов до сложных концепций. Так нейросеть распознаёт лицо: первый слой видит края, второй — текстуры, третий — части лица, четвёртый — само лицо.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <!-- Input layer -->
          <circle cx="60" cy="60" r="18" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/><text x="60" y="65" text-anchor="middle" font-size="11" fill="#1e40af">x₁</text>
          <circle cx="60" cy="140" r="18" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/><text x="60" y="145" text-anchor="middle" font-size="11" fill="#1e40af">x₂</text>
          <text x="60" y="190" text-anchor="middle" font-size="10" fill="#64748b">Input</text>
          <!-- Hidden 1 -->
          <circle cx="200" cy="40" r="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="200" y="45" text-anchor="middle" font-size="10" fill="#92400e">h₁</text>
          <circle cx="200" cy="100" r="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="200" y="105" text-anchor="middle" font-size="10" fill="#92400e">h₂</text>
          <circle cx="200" cy="160" r="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="200" y="165" text-anchor="middle" font-size="10" fill="#92400e">h₃</text>
          <text x="200" y="190" text-anchor="middle" font-size="10" fill="#64748b">Hidden 1</text>
          <!-- Hidden 2 -->
          <circle cx="340" cy="60" r="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="340" y="65" text-anchor="middle" font-size="10" fill="#92400e">h₄</text>
          <circle cx="340" cy="140" r="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/><text x="340" y="145" text-anchor="middle" font-size="10" fill="#92400e">h₅</text>
          <text x="340" y="190" text-anchor="middle" font-size="10" fill="#64748b">Hidden 2</text>
          <!-- Output -->
          <circle cx="460" cy="100" r="18" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/><text x="460" y="105" text-anchor="middle" font-size="11" fill="#065f46">ŷ</text>
          <text x="460" y="190" text-anchor="middle" font-size="10" fill="#64748b">Output</text>
          <!-- Connections input→hidden1 -->
          <line x1="78" y1="60" x2="184" y2="40" stroke="#cbd5e1" stroke-width="1"/><line x1="78" y1="60" x2="184" y2="100" stroke="#cbd5e1" stroke-width="1"/><line x1="78" y1="60" x2="184" y2="160" stroke="#cbd5e1" stroke-width="1"/>
          <line x1="78" y1="140" x2="184" y2="40" stroke="#cbd5e1" stroke-width="1"/><line x1="78" y1="140" x2="184" y2="100" stroke="#cbd5e1" stroke-width="1"/><line x1="78" y1="140" x2="184" y2="160" stroke="#cbd5e1" stroke-width="1"/>
          <!-- hidden1→hidden2 -->
          <line x1="216" y1="40" x2="324" y2="60" stroke="#cbd5e1" stroke-width="1"/><line x1="216" y1="40" x2="324" y2="140" stroke="#cbd5e1" stroke-width="1"/>
          <line x1="216" y1="100" x2="324" y2="60" stroke="#cbd5e1" stroke-width="1"/><line x1="216" y1="100" x2="324" y2="140" stroke="#cbd5e1" stroke-width="1"/>
          <line x1="216" y1="160" x2="324" y2="60" stroke="#cbd5e1" stroke-width="1"/><line x1="216" y1="160" x2="324" y2="140" stroke="#cbd5e1" stroke-width="1"/>
          <!-- hidden2→output -->
          <line x1="356" y1="60" x2="442" y2="100" stroke="#cbd5e1" stroke-width="1"/><line x1="356" y1="140" x2="442" y2="100" stroke="#cbd5e1" stroke-width="1"/>
        </svg>
        <div class="caption">MLP 2→3→2→1: два входа, два скрытых слоя, один выход. Каждая линия — вес, каждый круг — нейрон с активацией.</div>
      </div>

      <h3>🏗️ От перцептрона к многослойной сети</h3>
      <p>Один перцептрон может провести только <b>прямую</b> границу. Не может XOR, круг, спираль. Решение — соединить перцептроны в <b>слои</b>:</p>

      <ul>
        <li><b>Input layer (входной)</b> — это не нейроны, а просто признаки объекта.</li>
        <li><b>Hidden layers (скрытые)</b> — промежуточные слои с нелинейной активацией.</li>
        <li><b>Output layer (выходной)</b> — нейроны, выдающие финальный ответ.</li>
      </ul>

      <p>Такая структура называется <span class="term" data-tip="Multi-Layer Perceptron. Классическая нейросеть с полносвязными слоями. Базовая архитектура для обучения нелинейных функций.">Multi-Layer Perceptron (MLP)</span> или feedforward neural network.</p>

      <div class="key-concept">
        <div class="kc-label">Главная идея</div>
        <p>Один слой — линейная комбинация. Много слоёв с <b>нелинейностью</b> между ними — могут выучить <b>любую</b> функцию. Глубина сети даёт иерархию признаков: ранние слои учат простое, поздние — сложное.</p>
      </div>

      <h3>➡️ Forward pass — как сеть считает предсказание</h3>
      <p>Данные идут слой за слоем. Для каждого слоя:</p>
      <div class="math-block">$$a^{(l)} = \\sigma\\left(W^{(l)} a^{(l-1)} + b^{(l)}\\right)$$</div>

      <p>Где:</p>
      <ul>
        <li>$a^{(l-1)}$ — вход слоя (выход предыдущего).</li>
        <li>$W^{(l)}$ — матрица весов слоя.</li>
        <li>$b^{(l)}$ — вектор bias.</li>
        <li>$\\sigma$ — нелинейная функция активации.</li>
        <li>$a^{(l)}$ — выход слоя.</li>
      </ul>

      <p>Это просто линейная комбинация + нелинейность. Повторяем для каждого слоя.</p>

      <h3>⚡ Функции активации</h3>
      <p><span class="term" data-tip="Activation function. Нелинейная функция, применяемая к выходу нейрона. Без неё сеть была бы эквивалентна одному линейному слою.">Активация</span> — критически важный элемент. Без неё несколько линейных слоёв эквивалентны одному.</p>

      <h4>Sigmoid</h4>
      <div class="math-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>
      <p>Выход в (0, 1). Классика 80-х. Сегодня используется только в выходном слое для бинарной классификации. Проблема: «умирает» на краях (градиент ≈ 0).</p>

      <h4>Tanh</h4>
      <div class="math-block">$$\\tanh(z) \\in (-1, 1)$$</div>
      <p>Центрирована около 0. Лучше sigmoid, но тоже насыщается.</p>

      <h4>ReLU (Rectified Linear Unit)</h4>
      <div class="math-block">$$\\text{ReLU}(z) = \\max(0, z)$$</div>
      <p><b>Стандарт в современных сетях</b>. Простая, быстрая, не насыщается для положительных. Проблема «dying ReLU» — нейроны с отрицательными входами застревают.</p>

      <h4>Leaky ReLU, ELU, GELU, Swish</h4>
      <p>Варианты ReLU, которые не «умирают». GELU и Swish используются в современных трансформерах.</p>

      <h3>🎓 Backpropagation — как сеть учится</h3>
      <p><span class="term" data-tip="Backpropagation. Алгоритм обратного распространения ошибки: вычисляет градиенты по всем весам через правило цепочки от выхода к входу.">Обратное распространение ошибки</span> — ключевой алгоритм обучения нейросетей. Идея:</p>

      <ol>
        <li><b>Forward pass:</b> прогнали данные через сеть, получили предсказание, посчитали loss.</li>
        <li><b>Backward pass:</b> идём <b>от конца сети к началу</b>, считая градиенты по каждому весу через правило цепочки.</li>
        <li><b>Update:</b> обновляем веса градиентным спуском: $W \\gets W - \\eta \\nabla_W L$.</li>
      </ol>

      <p>Магия: мы считаем градиенты для <b>миллионов</b> весов за одно прохождение через сеть. Это именно то, что делает обучение глубоких сетей возможным.</p>

      <h3>💡 Теорема универсальной аппроксимации</h3>
      <p><span class="term" data-tip="Universal Approximation Theorem. Нейросеть с одним скрытым слоем может аппроксимировать любую непрерывную функцию с любой точностью, при достаточном числе нейронов.">Теорема</span>: MLP с <b>одним</b> скрытым слоем и достаточным числом нейронов может аппроксимировать <b>любую</b> непрерывную функцию с любой точностью.</p>
      <p>Это удивительно: 1 скрытый слой теоретически достаточен для всего. Но на практике <b>глубокие</b> сети работают лучше — они выражают сложные функции меньшим числом параметров.</p>

      <h3>🔍 Иерархия представлений</h3>
      <p>Главное преимущество глубины — сеть автоматически учится <b>признакам разного уровня</b>:</p>
      <ul>
        <li><b>Слой 1:</b> простейшие паттерны (для изображений — края).</li>
        <li><b>Слой 2:</b> комбинации (углы, дуги).</li>
        <li><b>Слой 3:</b> формы (колёса, глаза).</li>
        <li><b>Слой 4:</b> объекты (машина, лицо).</li>
        <li><b>Последний слой:</b> классификация.</li>
      </ul>

      <p>Это называется <span class="term" data-tip="Representation Learning. Автоматическое обучение полезных признаков из сырых данных. В отличие от классического ML, не требует ручного feature engineering.">representation learning</span> — сеть сама находит полезные признаки, без feature engineering вручную.</p>

      <h3>⚠️ Проблемы обучения глубоких сетей</h3>

      <h4>Vanishing gradients</h4>
      <p>При обратном распространении градиент многократно умножается. Если $\\sigma' < 1$, градиент <b>затухает</b> — первые слои не учатся. Решается ReLU, batch normalization, residual connections.</p>

      <h4>Exploding gradients</h4>
      <p>Противоположная проблема: градиенты <b>взрываются</b>. Loss → NaN. Решается gradient clipping и правильной инициализацией.</p>

      <h4>Переобучение</h4>
      <p>Глубокие сети имеют миллионы параметров. Легко запоминают обучающие данные. Решается:</p>
      <ul>
        <li><b>Dropout</b> — случайно отключаем нейроны при обучении.</li>
        <li><b>Weight decay (L2)</b> — штраф за большие веса.</li>
        <li><b>Early stopping</b>.</li>
        <li><b>Data augmentation</b>.</li>
        <li><b>Batch normalization</b>.</li>
      </ul>

      <h3>🎯 Инициализация весов</h3>
      <p>Нельзя инициализировать все веса нулями (все нейроны будут одинаковыми). Правильная инициализация:</p>
      <ul>
        <li><b>Xavier/Glorot</b>: для sigmoid/tanh.</li>
        <li><b>He</b>: для ReLU.</li>
      </ul>

      <h3>⚖️ Плюсы и ограничения</h3>
      <p><b>Плюсы:</b></p>
      <ul>
        <li><b>Универсальный аппроксиматор</b> — выучит любую функцию.</li>
        <li><b>Автоматическое обучение признакам</b>.</li>
        <li>State-of-the-art на изображениях, тексте, аудио.</li>
        <li>Масштабируется на огромные данные.</li>
        <li>Гибкая архитектура под задачу.</li>
      </ul>

      <p><b>Ограничения:</b></p>
      <ul>
        <li><b>Нужно много данных</b>.</li>
        <li>Долго обучается, требует GPU.</li>
        <li>Плохая <b>интерпретируемость</b> (black box).</li>
        <li>Много гиперпараметров.</li>
        <li>На табличных данных часто уступает GBDT.</li>
      </ul>

      <h3>⚠️ Частые заблуждения</h3>
      <ul>
        <li><b>«Больше слоёв — всегда лучше»</b> — на маленьких данных нет. И без regularization переобучение.</li>
        <li><b>«Глубокая сеть = AI»</b> — это обучаемая функция, не «интеллект».</li>
        <li><b>«ReLU — всегда лучший выбор»</b> — GELU/Swish часто лучше в современных моделях.</li>
        <li><b>«Нейросеть работает без препроцессинга»</b> — нормализация входов важна.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: виды нейросетей</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>MLP</b> — полносвязные слои, для tabular данных.</li>
            <li><b>CNN</b> — свёрточные, для изображений.</li>
            <li><b>RNN/LSTM/GRU</b> — для последовательностей.</li>
            <li><b>Transformer</b> — attention, для NLP и других последовательностей.</li>
            <li><b>GNN</b> — графовые нейросети.</li>
            <li><b>Autoencoder</b> — сжатие и восстановление.</li>
            <li><b>GAN</b> — генеративные, соревнующиеся сети.</li>
            <li><b>Diffusion</b> — для генерации изображений.</li>
          </ul>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: современные архитектурные приёмы</summary>
        <div class="deep-dive-body">
          <ul>
            <li><b>Residual connections (ResNet)</b> — $y = F(x) + x$, позволяют обучать очень глубокие сети.</li>
            <li><b>Batch Normalization</b> — нормализует активации, ускоряет обучение, регуляризирует.</li>
            <li><b>Layer Normalization</b> — аналог для RNN/Transformer.</li>
            <li><b>Attention</b> — механизм фокусировки на важных частях входа.</li>
            <li><b>Skip connections</b> — короткие пути от входа к выходу.</li>
          </ul>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Перцептрон</b> — базовый блок сети.</li>
        <li><b>Градиентный спуск</b> — алгоритм обучения.</li>
        <li><b>CNN, RNN, Transformer</b> — специализированные архитектуры.</li>
        <li><b>Регуляризация</b> — dropout, weight decay, early stopping.</li>
        <li><b>Bias-variance</b> — глубокие сети умудряются балансировать.</li>
      </ul>
    `,

    examples: [
      {
        title: 'Forward pass: сеть 2→2→1',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Прогнать вход $x = (1,\; 2)$ через сеть 2→2→1. Конкретные веса скрытого слоя:</p>
            <div class="math-block">$$W^{(1)} = \\begin{pmatrix}0{,}5 & 0{,}2 \\\\ -0{,}3 & 0{,}8\\end{pmatrix},\\quad b^{(1)} = \\begin{pmatrix}0{,}1 \\\\ -0{,}5\\end{pmatrix}$$</div>
            <p>Выходной слой: $W^{(2)} = (0{,}6,\; -0{,}4)$, $b^{(2)} = 0{,}2$. Активация скрытого слоя: ReLU. Выход: линейный (регрессия).</p>
          </div>

          <div class="illustration bordered">
            <svg viewBox="0 0 460 170" xmlns="http://www.w3.org/2000/svg" style="max-width:460px;">
              <defs>
                <marker id="nn-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                </marker>
              </defs>
              <!-- Input layer: x1=1, x2=2 -->
              <circle cx="60" cy="60" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
              <text x="60" y="57" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">x₁</text>
              <text x="60" y="70" text-anchor="middle" font-size="10" fill="#1e40af">= 1</text>
              <circle cx="60" cy="130" r="22" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
              <text x="60" y="127" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">x₂</text>
              <text x="60" y="140" text-anchor="middle" font-size="10" fill="#1e40af">= 2</text>
              <!-- Hidden layer: h1, h2 -->
              <circle cx="230" cy="60" r="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
              <text x="230" y="57" text-anchor="middle" font-size="11" fill="#92400e" font-weight="600">h₁</text>
              <text x="230" y="70" text-anchor="middle" font-size="10" fill="#92400e">1.0</text>
              <circle cx="230" cy="130" r="22" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
              <text x="230" y="127" text-anchor="middle" font-size="11" fill="#92400e" font-weight="600">h₂</text>
              <text x="230" y="140" text-anchor="middle" font-size="10" fill="#92400e">0.8</text>
              <!-- Output layer -->
              <circle cx="390" cy="95" r="22" fill="#f0fdf4" stroke="#10b981" stroke-width="2"/>
              <text x="390" y="92" text-anchor="middle" font-size="11" fill="#065f46" font-weight="600">ŷ</text>
              <text x="390" y="105" text-anchor="middle" font-size="10" fill="#065f46">0.48</text>
              <!-- Edges x1→h1: w=0.5 -->
              <line x1="82" y1="60" x2="208" y2="60" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-arr)"/>
              <text x="145" y="52" text-anchor="middle" font-size="9" fill="#6366f1">0.5</text>
              <!-- Edges x1→h2: w=-0.3 -->
              <line x1="80" y1="68" x2="210" y2="122" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-arr)"/>
              <text x="148" y="105" text-anchor="middle" font-size="9" fill="#6366f1">−0.3</text>
              <!-- Edges x2→h1: w=0.2 -->
              <line x1="80" y1="122" x2="210" y2="68" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-arr)"/>
              <text x="148" y="87" text-anchor="middle" font-size="9" fill="#6366f1">0.2</text>
              <!-- Edges x2→h2: w=0.8 -->
              <line x1="82" y1="130" x2="208" y2="130" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-arr)"/>
              <text x="145" y="143" text-anchor="middle" font-size="9" fill="#6366f1">0.8</text>
              <!-- Edges h1→out: w=0.6 -->
              <line x1="252" y1="67" x2="368" y2="88" stroke="#10b981" stroke-width="1.8" marker-end="url(#nn-arr)"/>
              <text x="310" y="72" text-anchor="middle" font-size="9" fill="#10b981">0.6</text>
              <!-- Edges h2→out: w=-0.4 -->
              <line x1="252" y1="123" x2="368" y2="102" stroke="#10b981" stroke-width="1.8" marker-end="url(#nn-arr)"/>
              <text x="310" y="122" text-anchor="middle" font-size="9" fill="#10b981">−0.4</text>
              <!-- Layer labels -->
              <text x="60" y="165" text-anchor="middle" font-size="9" fill="#64748b">вход</text>
              <text x="230" y="165" text-anchor="middle" font-size="9" fill="#64748b">скрытый (ReLU)</text>
              <text x="390" y="165" text-anchor="middle" font-size="9" fill="#64748b">выход</text>
            </svg>
            <div class="caption">Сеть 2→2→1: веса на рёбрах, значения активаций внутри узлов после forward pass (x=(1,2)). Скрытый слой: ReLU(z). Выход: 0.48.</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Слой</th><th>Операция</th><th>Результат</th></tr>
              <tr><td>Вход</td><td>—</td><td>$x = (1,\; 2)$</td></tr>
              <tr><td>Скрытый (pre-act)</td><td>$z^{(1)} = W^{(1)} x + b^{(1)}$</td><td>$(1{,}0,\; 0{,}8)$</td></tr>
              <tr><td>Скрытый (post-act)</td><td>$a^{(1)} = \\text{ReLU}(z^{(1)})$</td><td>$(1{,}0,\; 0{,}8)$</td></tr>
              <tr><td>Выход (pre-act)</td><td>$z^{(2)} = W^{(2)} a^{(1)} + b^{(2)}$</td><td>$0{,}48$</td></tr>
              <tr><td>Выход</td><td>линейный</td><td>$\\hat{y} = 0{,}48$</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Вычисляем скрытый слой: нейрон 1</h4>
            <div class="calc">$z^{(1)}_1 = 0{,}5 \\cdot 1 + 0{,}2 \\cdot 2 + 0{,}1 = 0{,}5 + 0{,}4 + 0{,}1 = 1{,}0$</div>
            <div class="calc">$a^{(1)}_1 = \\text{ReLU}(1{,}0) = 1{,}0$</div>
            <div class="why">$z > 0$, поэтому ReLU пропускает значение без изменений.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Вычисляем скрытый слой: нейрон 2</h4>
            <div class="calc">$z^{(1)}_2 = -0{,}3 \\cdot 1 + 0{,}8 \\cdot 2 + (-0{,}5) = -0{,}3 + 1{,}6 - 0{,}5 = 0{,}8$</div>
            <div class="calc">$a^{(1)}_2 = \\text{ReLU}(0{,}8) = 0{,}8$</div>
            <div class="why">Тоже положительное значение — ReLU не обнуляет.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Вычисляем выходной нейрон</h4>
            <div class="calc">$z^{(2)} = 0{,}6 \\cdot 1{,}0 + (-0{,}4) \\cdot 0{,}8 + 0{,}2 = 0{,}6 - 0{,}32 + 0{,}2 = 0{,}48$</div>
            <div class="calc">$\\hat{y} = 0{,}48$ (линейная активация для регрессии)</div>
            <div class="why">Предсказание модели: 0,48. Это взвешенная сумма активаций скрытого слоя — каждый скрытый нейрон «голосует» своим вкладом.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Подсчёт параметров</h4>
            <div class="calc">
              Скрытый слой: $W^{(1)}$ — $2 \\times 2 = 4$ весов $+$ $b^{(1)}$ — 2 bias = <b>6 параметров</b><br>
              Выходной слой: $W^{(2)}$ — 2 весá $+$ $b^{(2)}$ — 1 bias = <b>3 параметра</b><br>
              Итого: $6 + 3 = $ <b>9 параметров</b>
            </div>
            <div class="why">Для сравнения: полносвязная сеть 2→100→50→1 имела бы $(2\\times100+100)+(100\\times50+50)+(50\\times1+1) = 5401$ параметр. Размер сети растёт быстро!</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Forward pass: $x=(1,2) \\to z^{(1)}=(1{,}0,\\;0{,}8) \\to a^{(1)}=(1{,}0,\\;0{,}8) \\to \\hat{y} = 0{,}48$. Сеть «преобразовала» входное пространство через нелинейный скрытый слой и выдала число.</p>
          </div>

          <div class="lesson-box">
            <b>Что делает скрытый слой:</b> он создаёт новые признаки из входных. Нейрон 1 (с весами 0,5 и 0,2) реагирует на «взвешенную сумму входов», нейрон 2 — на другую комбинацию. ReLU вносит нелинейность, без которой два слоя были бы эквивалентны одному.
          </div>
        `
      },
      {
        title: 'Backprop одного шага',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Продолжаем предыдущий пример. Истинный ответ $y = 1{,}0$. Вычислить градиенты по всем параметрам сети и обновить веса с $\\eta = 0{,}1$. Текущее предсказание $\\hat{y} = 0{,}48$.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Шаг</th><th>Что считаем</th><th>Результат</th></tr>
              <tr><td>1</td><td>Loss $L = (\\hat{y}-y)^2$</td><td>$0{,}2704$</td></tr>
              <tr><td>2</td><td>$\\partial L / \\partial \\hat{y}$</td><td>$-1{,}04$</td></tr>
              <tr><td>3</td><td>$\\partial L / \\partial W^{(2)}$</td><td>$(-1{,}04,\\; -0{,}832)$</td></tr>
              <tr><td>4</td><td>$\\partial L / \\partial a^{(1)}$</td><td>$(-0{,}624,\\; 0{,}416)$</td></tr>
              <tr><td>5</td><td>$\\partial L / \\partial W^{(1)}$</td><td>матрица $2\\times2$</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Ошибка и Loss</h4>
            <div class="calc">$e = \\hat{y} - y = 0{,}48 - 1{,}0 = -0{,}52$</div>
            <div class="calc">$L = e^2 = (-0{,}52)^2 = 0{,}2704$</div>
            <div class="why">Используем MSE loss: $L=(\\hat{y}-y)^2$. Ошибка отрицательная — мы предсказали меньше, чем нужно.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Градиент по выходу (начало backprop)</h4>
            <div class="calc">$\\dfrac{\\partial L}{\\partial \\hat{y}} = 2e = 2 \\cdot (-0{,}52) = -1{,}04$</div>
            <div class="why">Градиент отрицательный — нужно увеличить $\\hat{y}$. Backprop начинается с конца сети и идёт назад.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Градиент по весам выходного слоя</h4>
            <div class="calc">
              $\\dfrac{\\partial L}{\\partial W^{(2)}_1} = (-1{,}04) \\cdot a^{(1)}_1 = (-1{,}04) \\cdot 1{,}0 = -1{,}04$<br>
              $\\dfrac{\\partial L}{\\partial W^{(2)}_2} = (-1{,}04) \\cdot a^{(1)}_2 = (-1{,}04) \\cdot 0{,}8 = -0{,}832$<br>
              $\\dfrac{\\partial L}{\\partial b^{(2)}} = -1{,}04$
            </div>
            <div class="calc">
              Обновление: $W^{(2)} \\gets (0{,}6 + 0{,}104,\\; -0{,}4 + 0{,}083) = (0{,}704,\\; -0{,}317)$
            </div>
            <div class="why">Градиент по $W^{(2)}_1$ больше (−1,04), потому что нейрон 1 был активирован сильнее (1,0 > 0,8). Больший вклад → больший градиент.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Передаём градиент в скрытый слой (chain rule)</h4>
            <div class="calc">
              $\\dfrac{\\partial L}{\\partial a^{(1)}_1} = \\dfrac{\\partial L}{\\partial z^{(2)}} \\cdot W^{(2)}_1 = (-1{,}04) \\cdot 0{,}6 = -0{,}624$<br>
              $\\dfrac{\\partial L}{\\partial a^{(1)}_2} = (-1{,}04) \\cdot (-0{,}4) = +0{,}416$
            </div>
            <div class="why">Это и есть «обратное распространение»: градиент ошибки пропорционален весам, с которыми каждый нейрон влиял на выход. Знак у второго нейрона положительный — уменьшить его активацию полезно (он тянул $\\hat{y}$ вниз из-за отрицательного $W^{(2)}_2$).</div>
          </div>

          <div class="step" data-step="5">
            <h4>Через ReLU и к весам скрытого слоя</h4>
            <div class="calc">
              ReLU: $z^{(1)}_1 = 1{,}0 > 0$ → $\\partial a_1 / \\partial z_1 = 1$, &nbsp; $z^{(1)}_2 = 0{,}8 > 0$ → $\\partial a_2 / \\partial z_2 = 1$<br><br>
              $\\partial L / \\partial W^{(1)}_{11} = (-0{,}624) \\cdot x_1 = -0{,}624$, &nbsp; $\\partial L / \\partial W^{(1)}_{12} = (-0{,}624) \\cdot 2 = -1{,}248$<br>
              $\\partial L / \\partial W^{(1)}_{21} = 0{,}416 \\cdot 1 = 0{,}416$, &nbsp; $\\partial L / \\partial W^{(1)}_{22} = 0{,}416 \\cdot 2 = 0{,}832$
            </div>
            <div class="why">Если бы $z^{(1)}_j < 0$, ReLU «убило бы» нейрон: градиент был бы нулём и веса этого нейрона не обновились бы (проблема «dying ReLU»).</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Один шаг backprop: вычислили градиенты всех 9 параметров. После обновления с $\\eta=0{,}1$ новое предсказание будет ближе к 1,0. Loss снизится с 0,2704 до ~0,24. Так работает каждый шаг обучения нейросети.</p>
          </div>

          <div class="lesson-box">
            <b>Главное в backprop:</b> цепное правило позволяет вычислить градиенты всех $n$ параметров за $O(n)$ времени — такой же, как один forward pass. Без этого обучение миллиардных моделей было бы невозможно.
          </div>
        `
      },
      {
        title: 'Эффект числа нейронов',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Сравнить сети с 1, 4 и 16 нейронами в скрытом слое на задаче аппроксимации функции $y = \\sin(x)$ на $[0, 2\\pi]$. Понять, почему «больше нейронов» не всегда лучше.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Архитектура</th><th>Параметров</th><th>Способность</th><th>Риск</th></tr>
              <tr><td>1→1→1</td><td>4</td><td>Только линейная функция</td><td>Underfitting</td></tr>
              <tr><td>1→4→1</td><td>17</td><td>Грубое приближение синуса</td><td>Приемлемо</td></tr>
              <tr><td>1→16→1</td><td>65</td><td>Точная аппроксимация</td><td>Overfitting на малых данных</td></tr>
              <tr><td>1→64→1</td><td>257</td><td>Идеальная подгонка</td><td>Сильный overfitting</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Сеть 1→1→1: один нейрон (underfitting)</h4>
            <div class="calc">
              Скрытый нейрон: $a = \\text{ReLU}(w_1 x + b_1)$<br>
              Выход: $\\hat{y} = w_2 \\cdot a + b_2 = w_2 \\cdot \\text{ReLU}(w_1 x + b_1) + b_2$
            </div>
            <div class="why">Один ReLU-нейрон представляет только одну «сломанную прямую» с одним изломом. Синус — волновая функция — принципиально не выражается так. Тренировочный MSE: ~0,2–0,5 — плохо.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Сеть 1→4→1: четыре нейрона (адекватно)</h4>
            <div class="calc">
              $\\hat{y} = \\sum_{j=1}^{4} v_j \\cdot \\text{ReLU}(w_j x + b_j) + b$ — кусочно-линейная функция с 4 изломами
            </div>
            <div class="calc">
              Каждый нейрон «отвечает» за свой участок: один активен на $[0, \\pi/2]$, второй на $[\\pi/2, \\pi]$, третий на $[\\pi, 3\\pi/2]$, четвёртый на $[3\\pi/2, 2\\pi]$. Вместе — грубое приближение синуса.
            </div>
            <div class="why">Теоретически: $n$ ReLU-нейронов дают кусочно-линейную функцию с $n$ изломами. Для синуса на одном периоде — 4 сегмента для грубого приближения, 8–16 — для хорошего.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Сеть 1→16→1: 16 нейронов (хорошо, но опасно)</h4>
            <div class="calc">
              16 кусочно-линейных сегментов → точная аппроксимация $\\sin(x)$<br>
              На 10 тренировочных точках: MSE ≈ 0,001 (хорошо)<br>
              На тестовых точках (между обучающими): MSE ≈ 0,01 (неплохо)
            </div>
            <div class="why">При малом числе данных 16 нейронов могут «выучить» случайный шум, а не саму функцию. Это overfitting: на train отлично, на test — плохо.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Правило выбора размера сети</h4>
            <div class="calc">
              Эмпирическое правило: число параметров ≈ 10–30× числа обучающих примеров<br>
              10 примеров → 100–300 параметров → сеть 1→20→1 (~40 пар.) или 1→50→1 (~100 пар.)<br>
              1000 примеров → можно 1→100→50→1 (~10 250 пар.)
            </div>
            <div class="why">Это не строгое правило, а ориентир. Современный подход: большая сеть + регуляризация (dropout, weight decay). «Bigger is better» работает при достаточном объёме данных.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Bias-Variance tradeoff</h4>
            <div class="calc">
              Маленькая сеть (1 нейрон): высокий bias (не может выучить), низкий variance<br>
              Большая сеть (64 нейрона): низкий bias (выучит что угодно), высокий variance (чувствительна к данным)<br>
              Оптимум: ранняя остановка, dropout, L2-регуляризация
            </div>
            <div class="why">Парадокс современного DL: очень большие модели (млрд параметров) при правильной регуляризации не переобучаются на достаточном объёме данных. Это «double descent» — активная область исследований.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>1 нейрон → underfitting (не выражает синус). 4 нейрона → приемлемо. 16 нейронов → хорошая аппроксимация при достаточном числе данных. Слишком много нейронов при малом объёме данных → overfitting. Правило: валидируй на отложенной выборке и выбирай размер по val loss.</p>
          </div>

          <div class="lesson-box">
            <b>Практический совет:</b> начинай с небольшой сети, постепенно увеличивай. Следи за val loss: если он начинает расти при падении train loss — ты перешёл за оптимум. Используй early stopping или dropout.
          </div>
        `
      },
    ],

    simulation: {
      html: `
        <h3>Симуляция: обучение MLP на 2D данных</h3>
        <p>Сеть 2→hidden→1 учится классифицировать точки. Меняй архитектуру и смотри, как меняется граница.</p>
        <div class="sim-container">
          <div class="sim-controls" id="nn-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="nn-train">⏩ Обучить 200 эпох</button>
            <button class="btn secondary" id="nn-step">+20 эпох</button>
            <button class="btn secondary" id="nn-reset">↺ Новые веса</button>
            <button class="btn secondary" id="nn-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div class="sim-chart-wrap" style="height:400px;padding:0;"><canvas id="nn-canvas" class="sim-canvas"></canvas></div>
            <div class="sim-chart-wrap" style="height:180px;"><canvas id="nn-loss"></canvas></div>
            <div class="sim-stats" id="nn-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#nn-controls');
        const cShape = App.makeControl('select', 'nn-shape', 'Форма данных', {
          options: [{ value: 'moons', label: 'Две луны' }, { value: 'xor', label: 'XOR' }, { value: 'circle', label: 'Круг' }, { value: 'spiral', label: 'Спираль' }],
          value: 'moons',
        });
        const cHidden = App.makeControl('range', 'nn-h', 'Нейронов в слое', { min: 2, max: 32, step: 1, value: 8 });
        const cLayers = App.makeControl('range', 'nn-l', 'Скрытых слоёв', { min: 1, max: 4, step: 1, value: 2 });
        const cAct = App.makeControl('select', 'nn-act', 'Активация', {
          options: [{ value: 'relu', label: 'ReLU' }, { value: 'tanh', label: 'Tanh' }, { value: 'sigmoid', label: 'Sigmoid' }],
          value: 'relu',
        });
        const cLR = App.makeControl('range', 'nn-lr', 'Learning rate', { min: 0.001, max: 0.5, step: 0.001, value: 0.05 });
        [cShape, cHidden, cLayers, cAct, cLR].forEach(c => controls.appendChild(c.wrap));

        const canvas = container.querySelector('#nn-canvas');
        const ctx = canvas.getContext('2d');
        let points = [];
        let net = null;
        let lossHistory = [];
        let epochs = 0;
        let lossChart = null;

        // ---------- минимальная NN ----------
        function activations(name) {
          if (name === 'relu') return { f: z => Math.max(0, z), df: z => z > 0 ? 1 : 0 };
          if (name === 'tanh') return { f: z => Math.tanh(z), df: z => 1 - Math.tanh(z) ** 2 };
          return { f: z => 1 / (1 + Math.exp(-z)), df: z => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); } };
        }

        function createNet(arch) {
          const layers = [];
          for (let i = 0; i < arch.length - 1; i++) {
            const rows = arch[i + 1], cols = arch[i];
            const W = [];
            // He init
            const scale = Math.sqrt(2 / cols);
            for (let r = 0; r < rows; r++) {
              const row = [];
              for (let c = 0; c < cols; c++) row.push(App.Util.randn(0, scale));
              W.push(row);
            }
            const b = new Array(rows).fill(0);
            layers.push({ W, b });
          }
          return layers;
        }

        function matVec(M, v) {
          const out = new Array(M.length).fill(0);
          for (let i = 0; i < M.length; i++) {
            for (let j = 0; j < v.length; j++) out[i] += M[i][j] * v[j];
          }
          return out;
        }

        function forward(net, x, act) {
          const a = activations(act);
          const zs = [], as = [x];
          for (let i = 0; i < net.length; i++) {
            const { W, b } = net[i];
            const z = matVec(W, as[i]).map((v, k) => v + b[k]);
            zs.push(z);
            if (i === net.length - 1) {
              // sigmoid на выходе
              as.push(z.map(zz => 1 / (1 + Math.exp(-zz))));
            } else {
              as.push(z.map(a.f));
            }
          }
          return { zs, as };
        }

        function backward(net, fwd, y, act, lr) {
          const a = activations(act);
          const { zs, as } = fwd;
          const L = net.length;
          // out layer grad (sigmoid + BCE-like simplification: dL/dz = a - y)
          let dz = [as[L][0] - y];
          for (let l = L - 1; l >= 0; l--) {
            const aPrev = as[l];
            const { W, b } = net[l];
            // gradient W, b
            for (let i = 0; i < W.length; i++) {
              for (let j = 0; j < W[i].length; j++) {
                W[i][j] -= lr * dz[i] * aPrev[j];
              }
              b[i] -= lr * dz[i];
            }
            if (l > 0) {
              // propagate
              const daPrev = new Array(aPrev.length).fill(0);
              for (let j = 0; j < aPrev.length; j++) {
                for (let i = 0; i < W.length; i++) daPrev[j] += W[i][j] * dz[i];
              }
              dz = daPrev.map((d, j) => d * a.df(zs[l - 1][j]));
            }
          }
        }

        function predict(x) { return forward(net, x, cAct.input.value).as.slice(-1)[0][0]; }

        function trainEpoch() {
          const lr = +cLR.input.value;
          const act = cAct.input.value;
          let loss = 0;
          const shuffled = App.Util.shuffle(points);
          shuffled.forEach(p => {
            const fwd = forward(net, [p.x, p.y], act);
            const y = p.cls;
            const o = Math.max(1e-9, Math.min(1 - 1e-9, fwd.as.slice(-1)[0][0]));
            loss += -(y * Math.log(o) + (1 - y) * Math.log(1 - o));
            backward(net, fwd, y, act, lr);
          });
          loss /= points.length;
          lossHistory.push(loss);
          epochs++;
        }

        function train(n) { for (let i = 0; i < n; i++) trainEpoch(); draw(); }

        function initNet() {
          const hid = +cHidden.input.value;
          const layers = +cLayers.input.value;
          const arch = [2];
          for (let i = 0; i < layers; i++) arch.push(hid);
          arch.push(1);
          net = createNet(arch);
          lossHistory = [];
          epochs = 0;
        }

        function genData() {
          const shape = cShape.input.value;
          points = [];
          const n = 60;
          for (let i = 0; i < n; i++) {
            let x, y, cls;
            if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) {
                x = -0.4 + 0.6 * Math.cos(t) + App.Util.randn(0, 0.08);
                y = -0.2 + 0.6 * Math.sin(t) + App.Util.randn(0, 0.08);
                cls = 0;
              } else {
                x = 0.2 + 0.6 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.08);
                y = 0.2 - 0.6 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.08);
                cls = 1;
              }
            } else if (shape === 'xor') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              cls = ((x > 0) ^ (y > 0)) ? 1 : 0;
            } else if (shape === 'circle') {
              x = Math.random() * 2 - 1; y = Math.random() * 2 - 1;
              const r = Math.sqrt(x * x + y * y);
              cls = r < 0.5 ? 0 : 1;
            } else {
              const t = i / n * 4 * Math.PI;
              const r = t / (4 * Math.PI);
              if (Math.random() < 0.5) {
                x = r * Math.cos(t) + App.Util.randn(0, 0.05); y = r * Math.sin(t) + App.Util.randn(0, 0.05); cls = 0;
              } else {
                x = -r * Math.cos(t) + App.Util.randn(0, 0.05); y = -r * Math.sin(t) + App.Util.randn(0, 0.05); cls = 1;
              }
            }
            points.push({ x, y, cls });
          }
          initNet();
          draw();
        }

        function resize() { const r = canvas.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; draw(); }

        function draw() {
          if (!canvas.width || !net) return;
          const W = canvas.width, H = canvas.height;
          const xMin = -1.5, xMax = 1.5, yMin = -1.5, yMax = 1.5;
          ctx.clearRect(0, 0, W, H);
          const step = 10;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const x = xMin + (px / W) * (xMax - xMin);
              const y = yMax - (py / H) * (yMax - yMin);
              const p = predict([x, y]);
              const t = p;
              const r = Math.round(239 * (1 - t) + 59 * t);
              const g = Math.round(68 * (1 - t) + 130 * t);
              const bl = Math.round(68 * (1 - t) + 246 * t);
              ctx.fillStyle = `rgba(${r},${g},${bl},0.3)`;
              ctx.fillRect(px, py, step, step);
            }
          }
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            const cx = ((p.x - xMin) / (xMax - xMin)) * W;
            const cy = ((yMax - p.y) / (yMax - yMin)) * H;
            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });

          // loss
          const lossCtx = container.querySelector('#nn-loss').getContext('2d');
          if (lossChart) lossChart.destroy();
          lossChart = new Chart(lossCtx, {
            type: 'line',
            data: { labels: lossHistory.map((_, i) => i), datasets: [{ label: 'Loss', data: lossHistory, borderColor: '#16a34a', borderWidth: 2, pointRadius: 0, fill: false }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Cross-entropy loss' } }, scales: { y: { beginAtZero: true, min: 0, max: 1.5 } } },
          });
          App.registerChart(lossChart);

          let correct = 0;
          points.forEach(p => { if (Math.round(predict([p.x, p.y])) === p.cls) correct++; });
          const params = net.reduce((s, l) => s + l.W.length * l.W[0].length + l.b.length, 0);

          container.querySelector('#nn-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">Эпох</div><div class="stat-value">${epochs}</div></div>
            <div class="stat-card"><div class="stat-label">Loss</div><div class="stat-value">${lossHistory.length ? App.Util.round(lossHistory.slice(-1)[0], 4) : '-'}</div></div>
            <div class="stat-card"><div class="stat-label">Accuracy</div><div class="stat-value">${(correct / points.length * 100).toFixed(0)}%</div></div>
            <div class="stat-card"><div class="stat-label">Параметров</div><div class="stat-value">${params}</div></div>
            <div class="stat-card"><div class="stat-label">Архитектура</div><div class="stat-value" style="font-size:13px;">2→${Array(+cLayers.input.value).fill(cHidden.input.value).join('→')}→1</div></div>
          `;
        }

        [cHidden, cLayers, cAct].forEach(c => c.input.addEventListener('change', () => { initNet(); draw(); }));
        cShape.input.addEventListener('change', genData);
        container.querySelector('#nn-train').onclick = () => train(200);
        container.querySelector('#nn-step').onclick = () => train(20);
        container.querySelector('#nn-reset').onclick = () => { initNet(); draw(); };
        container.querySelector('#nn-regen').onclick = genData;

        setTimeout(() => { genData(); resize(); }, 50);
        window.addEventListener('resize', resize);
      },
    },

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Tabular ML</b> — альтернатива бустингу на больших данных.</li>
        <li><b>Image recognition</b> — CNN (свёрточные сети).</li>
        <li><b>NLP</b> — RNN, LSTM, Transformer.</li>
        <li><b>Speech</b> — распознавание и синтез.</li>
        <li><b>Recommender systems</b> — neural collaborative filtering, embeddings.</li>
        <li><b>Reinforcement Learning</b> — DQN, PPO.</li>
        <li><b>Generative AI</b> — GAN, VAE, Diffusion.</li>
      </ul>
    `,

    proscons: `
      <div class="proscons">
        <div class="pros">
          <h4>✓ Плюсы</h4>
          <ul>
            <li>Универсальный аппроксиматор</li>
            <li>Автоматическое обучение признакам</li>
            <li>Отлично масштабируется на большие данные</li>
            <li>State-of-the-art на изображениях, тексте, аудио</li>
            <li>Гибкая архитектура под задачу</li>
          </ul>
        </div>
        <div class="cons">
          <h4>✗ Минусы</h4>
          <ul>
            <li>Нужно много данных</li>
            <li>Долго обучается, нужны GPU</li>
            <li>Плохая интерпретируемость</li>
            <li>Много гиперпараметров</li>
            <li>Легко переобучается без регуляризации</li>
            <li>На табличных данных часто уступает бустингу</li>
          </ul>
        </div>
      </div>
    `,

    math: `
      <h3>Forward pass</h3>
      <div class="math-block">$$\\mathbf{z}^{(l)} = W^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)}, \\quad \\mathbf{a}^{(l)} = \\sigma(\\mathbf{z}^{(l)})$$</div>

      <h3>Loss для классификации (BCE)</h3>
      <div class="math-block">$$L = -\\frac{1}{n}\\sum_{i=1}^{n}[y_i \\log \\hat{y}_i + (1-y_i)\\log(1-\\hat{y}_i)]$$</div>

      <h3>Backpropagation</h3>
      <p>Определим $\\delta^{(l)} = \\frac{\\partial L}{\\partial \\mathbf{z}^{(l)}}$. Тогда:</p>
      <div class="math-block">$$\\delta^{(L)} = \\nabla_{\\mathbf{a}} L \\odot \\sigma'(\\mathbf{z}^{(L)})$$</div>
      <div class="math-block">$$\\delta^{(l)} = (W^{(l+1)T} \\delta^{(l+1)}) \\odot \\sigma'(\\mathbf{z}^{(l)})$$</div>
      <div class="math-block">$$\\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)} (\\mathbf{a}^{(l-1)})^T, \\quad \\frac{\\partial L}{\\partial \\mathbf{b}^{(l)}} = \\delta^{(l)}$$</div>

      <h3>Обновление</h3>
      <div class="math-block">$$W^{(l)} \\gets W^{(l)} - \\eta \\frac{\\partial L}{\\partial W^{(l)}}$$</div>

      <h3>Инициализация весов</h3>
      <ul>
        <li><b>Xavier/Glorot</b>: $W \\sim N(0, 1/n_{in})$ — для tanh.</li>
        <li><b>He</b>: $W \\sim N(0, 2/n_{in})$ — для ReLU.</li>
      </ul>
    `,

    extra: `
      <h3>Регуляризация</h3>
      <ul>
        <li><b>L2 (weight decay)</b> — штраф $\\lambda \\|W\\|^2$.</li>
        <li><b>Dropout</b> — случайно выключаем нейроны при обучении.</li>
        <li><b>Early stopping</b> — остановка по валидации.</li>
        <li><b>Data augmentation</b> — искусственное увеличение датасета.</li>
        <li><b>Batch normalization</b> — нормализация активаций, ускоряет обучение.</li>
      </ul>

      <h3>Проблемы обучения</h3>
      <table>
        <tr><th>Проблема</th><th>Симптом</th><th>Решение</th></tr>
        <tr><td>Vanishing gradients</td><td>Первые слои не учатся</td><td>ReLU, ResNet, BatchNorm</td></tr>
        <tr><td>Exploding gradients</td><td>Loss → NaN</td><td>Gradient clipping</td></tr>
        <tr><td>Переобучение</td><td>Train ↓ Val ↑</td><td>Dropout, больше данных</td></tr>
        <tr><td>Недообучение</td><td>Train и Val высокие</td><td>Больше слоёв/нейронов</td></tr>
        <tr><td>Плохой LR</td><td>Loss не падает или скачет</td><td>LR scheduler, warmup</td></tr>
      </table>

      <h3>Типы сетей</h3>
      <ul>
        <li><b>MLP</b> — полносвязные, для tabular.</li>
        <li><b>CNN</b> — свёрточные, для изображений.</li>
        <li><b>RNN/LSTM/GRU</b> — рекуррентные, для последовательностей.</li>
        <li><b>Transformer</b> — attention, для текста и не только.</li>
        <li><b>GNN</b> — графовые.</li>
        <li><b>Autoencoder</b> — сжатие/восстановление.</li>
        <li><b>GAN</b> — генеративные, конкурирующие сети.</li>
      </ul>

      <h3>Дальше</h3>
      <p>После MLP стоит изучать: CNN (для изображений) → RNN/LSTM (для последовательностей) → Transformer (для современных LLM). Концепция backprop и градиентного спуска остаётся той же.</p>
    `,
  },
});
