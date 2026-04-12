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
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('perceptron')">Перцептрон</a> ·
        <a onclick="App.selectTopic('gradient-descent')">Градиентный спуск</a> ·
        <a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a>
      </div>
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
        <li>$\\sigma$ — нелинейная <a class="glossary-link" onclick="App.selectTopic('glossary-activations')">функция активации</a>.</li>
        <li>$a^{(l)}$ — выход слоя.</li>
      </ul>

      <p>Это просто линейная комбинация + нелинейность. Повторяем для каждого слоя.</p>

      <h3>⚡ Функции активации</h3>
      <p><span class="term" data-tip="Activation function. Нелинейная функция, применяемая к выходу нейрона. Без неё сеть была бы эквивалентна одному линейному слою.">Активация</span> — критически важный элемент. Без неё несколько линейных слоёв эквивалентны одному.</p>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">Sigmoid</a></h4>
      <div class="math-block">$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$</div>
      <p>Выход в (0, 1). Классика 80-х. Сегодня используется только в выходном слое для бинарной классификации. Проблема: «умирает» на краях (<a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">градиент</a> ≈ 0).</p>

      <h4>Tanh</h4>
      <div class="math-block">$$\\tanh(z) \\in (-1, 1)$$</div>
      <p>Центрирована около 0. Лучше sigmoid, но тоже насыщается.</p>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-activations')">ReLU</a> (Rectified Linear Unit)</h4>
      <div class="math-block">$$\\text{ReLU}(z) = \\max(0, z)$$</div>
      <p><b>Стандарт в современных сетях</b>. Простая, быстрая, не насыщается для положительных. Проблема «dying ReLU» — нейроны с отрицательными входами застревают.</p>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-activations')">Leaky ReLU</a>, ELU, <a class="glossary-link" onclick="App.selectTopic('glossary-activations')">GELU</a>, <a class="glossary-link" onclick="App.selectTopic('glossary-activations')">Swish</a></h4>
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
      <p>Противоположная проблема: градиенты <b>взрываются</b>. Loss → NaN. Решается <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">gradient</a> clipping и правильной инициализацией.</p>

      <h4><a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">Переобучение</a></h4>
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
            <li><b>Transformer</b> — <a class="glossary-link" onclick="App.selectTopic('glossary-attention')">attention</a>, для NLP и других последовательностей.</li>
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
        title: 'Forward pass: сеть 2→2→1 полностью',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Прогнать вход $x = [1,\\; 2]$ через сеть 2→2→1 для задачи <b>бинарной классификации</b>. Целевое значение: $y = 1$.</p>
            <p>Веса (записаны явно — возьмите ручку и повторяйте):</p>
            <div class="math-block">$$W^{(1)} = \\begin{pmatrix}0{,}5 & 0{,}2 \\\\ -0{,}3 & 0{,}8\\end{pmatrix},\\quad b^{(1)} = \\begin{pmatrix}0{,}1 \\\\ -0{,}5\\end{pmatrix}$$</div>
            <div class="math-block">$$W^{(2)} = (0{,}6,\\; -0{,}4),\\quad b^{(2)} = 0{,}2$$</div>
            <p>Скрытый слой: ReLU. Выход: <b>sigmoid</b> (классификация). Loss: Binary Cross-Entropy.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Параметр</th><th>Размерность</th><th>Значения</th></tr>
              <tr><td>$x$ (вход)</td><td>2×1</td><td>[1, 2]</td></tr>
              <tr><td>$W^{(1)}$</td><td>2×2</td><td>[[0.5, 0.2], [−0.3, 0.8]]</td></tr>
              <tr><td>$b^{(1)}$</td><td>2×1</td><td>[0.1, −0.5]</td></tr>
              <tr><td>$W^{(2)}$</td><td>1×2</td><td>[0.6, −0.4]</td></tr>
              <tr><td>$b^{(2)}$</td><td>1×1</td><td>[0.2]</td></tr>
              <tr><td>Всего параметров</td><td>—</td><td>4 + 2 + 2 + 1 = <b>9</b></td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1. Архитектура сети — SVG-схема со всеми весами</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
                <defs>
                  <marker id="nn-fwd" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <polygon points="0 0,6 3,0 6" fill="#64748b"/>
                  </marker>
                </defs>
                <!-- Input layer -->
                <circle cx="60" cy="65" r="24" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
                <text x="60" y="60" text-anchor="middle" font-size="12" fill="#1e40af" font-weight="700">x₁</text>
                <text x="60" y="76" text-anchor="middle" font-size="10" fill="#1e40af">= 1</text>
                <circle cx="60" cy="150" r="24" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
                <text x="60" y="145" text-anchor="middle" font-size="12" fill="#1e40af" font-weight="700">x₂</text>
                <text x="60" y="161" text-anchor="middle" font-size="10" fill="#1e40af">= 2</text>
                <!-- Hidden layer -->
                <circle cx="250" cy="55" r="24" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
                <text x="250" y="50" text-anchor="middle" font-size="11" fill="#92400e" font-weight="700">h₁</text>
                <text x="250" y="64" text-anchor="middle" font-size="9" fill="#92400e">b=0.1</text>
                <circle cx="250" cy="155" r="24" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
                <text x="250" y="150" text-anchor="middle" font-size="11" fill="#92400e" font-weight="700">h₂</text>
                <text x="250" y="164" text-anchor="middle" font-size="9" fill="#92400e">b=−0.5</text>
                <!-- Output -->
                <circle cx="440" cy="105" r="26" fill="#f0fdf4" stroke="#10b981" stroke-width="2"/>
                <text x="440" y="100" text-anchor="middle" font-size="12" fill="#065f46" font-weight="700">out</text>
                <text x="440" y="115" text-anchor="middle" font-size="9" fill="#065f46">b=0.2</text>
                <!-- Edges input→hidden -->
                <line x1="84" y1="60" x2="226" y2="55" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-fwd)"/>
                <text x="155" y="48" text-anchor="middle" font-size="10" fill="#6366f1" font-weight="600">0.5</text>
                <line x1="84" y1="75" x2="226" y2="145" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-fwd)"/>
                <text x="145" y="125" text-anchor="middle" font-size="10" fill="#6366f1" font-weight="600">−0.3</text>
                <line x1="84" y1="142" x2="226" y2="65" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-fwd)"/>
                <text x="165" y="92" text-anchor="middle" font-size="10" fill="#6366f1" font-weight="600">0.2</text>
                <line x1="84" y1="150" x2="226" y2="155" stroke="#6366f1" stroke-width="1.5" marker-end="url(#nn-fwd)"/>
                <text x="155" y="163" text-anchor="middle" font-size="10" fill="#6366f1" font-weight="600">0.8</text>
                <!-- Edges hidden→output -->
                <line x1="274" y1="60" x2="414" y2="98" stroke="#10b981" stroke-width="2" marker-end="url(#nn-fwd)"/>
                <text x="344" y="72" text-anchor="middle" font-size="10" fill="#10b981" font-weight="600">0.6</text>
                <line x1="274" y1="150" x2="414" y2="112" stroke="#10b981" stroke-width="2" marker-end="url(#nn-fwd)"/>
                <text x="344" y="142" text-anchor="middle" font-size="10" fill="#10b981" font-weight="600">−0.4</text>
                <!-- Labels -->
                <text x="60" y="190" text-anchor="middle" font-size="10" fill="#64748b">Вход</text>
                <text x="250" y="190" text-anchor="middle" font-size="10" fill="#64748b">Скрытый (ReLU)</text>
                <text x="440" y="190" text-anchor="middle" font-size="10" fill="#64748b">Выход (sigmoid)</text>
              </svg>
              <div class="caption">Полная архитектура: 2 входа, 2 скрытых нейрона (ReLU), 1 выход (sigmoid). Все веса и bias подписаны.</div>
            </div>
            <div class="why">Каждое ребро = одно умножение. Bias записан внутри узлов. При forward pass мы последовательно вычисляем значения слева направо.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2. Скрытый нейрон h₁: каждое умножение</h4>
            <div class="calc">
              $z_1 = w_{11} \\cdot x_1 + w_{12} \\cdot x_2 + b_1$<br><br>
              $w_{11} \\cdot x_1 = 0{,}5 \\times 1 = 0{,}5$<br>
              $w_{12} \\cdot x_2 = 0{,}2 \\times 2 = 0{,}4$<br>
              $z_1 = 0{,}5 + 0{,}4 + 0{,}1 = \\mathbf{1{,}0}$
            </div>
            <div class="calc">
              $a_1 = \\text{ReLU}(z_1) = \\text{ReLU}(1{,}0) = \\max(0,\\; 1{,}0) = \\mathbf{1{,}0}$
            </div>
            <div class="why">$z_1 = 1{,}0 > 0$, поэтому ReLU(1.0) = 1.0. ReLU «пропускает» положительные значения без изменений, а отрицательные зануляет.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3. Скрытый нейрон h₂: каждое умножение</h4>
            <div class="calc">
              $z_2 = w_{21} \\cdot x_1 + w_{22} \\cdot x_2 + b_2$<br><br>
              $w_{21} \\cdot x_1 = (-0{,}3) \\times 1 = -0{,}3$<br>
              $w_{22} \\cdot x_2 = 0{,}8 \\times 2 = 1{,}6$<br>
              $z_2 = -0{,}3 + 1{,}6 + (-0{,}5) = -0{,}3 + 1{,}6 - 0{,}5 = \\mathbf{0{,}8}$
            </div>
            <div class="calc">
              $a_2 = \\text{ReLU}(z_2) = \\text{ReLU}(0{,}8) = \\max(0,\\; 0{,}8) = \\mathbf{0{,}8}$
            </div>
            <div class="why">Тоже положительное: $0{,}8 > 0$, ReLU пропускает. Обратите внимание: нейрон h₂ «видит» $x_2$ сильнее ($w_{22}=0{,}8$), а $x_1$ — с отрицательным весом.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4. Выходной нейрон: pre-activation и sigmoid</h4>
            <div class="calc">
              $z_{out} = w_1^{(2)} \\cdot a_1 + w_2^{(2)} \\cdot a_2 + b^{(2)}$<br><br>
              $w_1^{(2)} \\cdot a_1 = 0{,}6 \\times 1{,}0 = 0{,}6$<br>
              $w_2^{(2)} \\cdot a_2 = (-0{,}4) \\times 0{,}8 = -0{,}32$<br>
              $z_{out} = 0{,}6 + (-0{,}32) + 0{,}2 = 0{,}6 - 0{,}32 + 0{,}2 = \\mathbf{0{,}48}$
            </div>
            <div class="calc">
              Sigmoid: $\\hat{y} = \\sigma(z_{out}) = \\dfrac{1}{1 + e^{-0{,}48}}$<br><br>
              $e^{-0{,}48} = 0{,}6188$<br>
              $\\hat{y} = \\dfrac{1}{1 + 0{,}6188} = \\dfrac{1}{1{,}6188} = \\mathbf{0{,}618}$
            </div>
            <div class="why">Sigmoid переводит любое число в диапазон (0, 1) — это вероятность класса 1. Наша сеть считает, что $P(y=1) = 0{,}618$, то есть 61,8%.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5. Loss: Binary Cross-Entropy</h4>
            <div class="calc">
              $L = -[y \\cdot \\ln(\\hat{y}) + (1-y) \\cdot \\ln(1-\\hat{y})]$<br><br>
              $y = 1$, поэтому:<br>
              $L = -[1 \\cdot \\ln(0{,}618) + 0 \\cdot \\ln(0{,}382)]$<br>
              $L = -\\ln(0{,}618) = -(-0{,}481) = \\mathbf{0{,}481}$
            </div>
            <div class="why">Если бы $\\hat{y}$ был ближе к 1, $\\ln(\\hat{y})$ был бы ближе к 0, и loss был бы меньше. При $\\hat{y}=1$: $L=0$ (идеально). При $\\hat{y}\\to 0$: $L \\to +\\infty$ (максимальная ошибка).</div>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Слой</th><th>Формула</th><th>Числовой результат</th></tr>
              <tr><td>Вход</td><td>—</td><td>$x = [1,\\; 2]$</td></tr>
              <tr><td>Скрытый $z$</td><td>$W^{(1)}x + b^{(1)}$</td><td>$[1{,}0,\\; 0{,}8]$</td></tr>
              <tr><td>Скрытый $a$</td><td>ReLU($z$)</td><td>$[1{,}0,\\; 0{,}8]$</td></tr>
              <tr><td>Выход $z_{out}$</td><td>$W^{(2)}a + b^{(2)}$</td><td>$0{,}48$</td></tr>
              <tr><td>Выход $\\hat{y}$</td><td>$\\sigma(z_{out})$</td><td>$0{,}618$</td></tr>
              <tr><td>Loss</td><td>$-\\ln(\\hat{y})$</td><td>$0{,}481$</td></tr>
            </table>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Forward pass: $x=[1,2] \\to z=[1{,}0,\\; 0{,}8] \\to a=[1{,}0,\\; 0{,}8] \\to z_{out}=0{,}48 \\to \\hat{y} = \\sigma(0{,}48) = 0{,}618$. Loss (BCE) = 0,481. Сеть на 61,8% уверена в классе 1, но мы хотим 100% — нужен backprop.</p>
          </div>

          <div class="lesson-box">
            <b>Что делает каждый слой:</b> скрытый слой создаёт новые «признаки» ($a_1$ и $a_2$) из входных. ReLU вносит нелинейность — без неё 2 линейных слоя эквивалентны одному. Sigmoid на выходе превращает число в вероятность.
          </div>
        `
      },
      {
        title: 'Backprop: вычисляем все градиенты',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Продолжаем пример 1. Вычислить <b>все</b> градиенты по всем 9 параметрам, обновить веса с $\\eta = 0{,}1$, затем сделать второй forward pass и показать, что loss снизился.</p>
            <p>Напоминание: $\\hat{y}=0{,}618$, $y=1$, $z_{out}=0{,}48$, $a=[1{,}0,\\; 0{,}8]$, $z=[1{,}0,\\; 0{,}8]$, $x=[1,\\; 2]$.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Параметр</th><th>Старое значение</th><th>Градиент $\\partial L / \\partial$</th><th>Новое значение</th></tr>
              <tr><td>$w_1^{(2)}$</td><td>0.6</td><td>?</td><td>?</td></tr>
              <tr><td>$w_2^{(2)}$</td><td>−0.4</td><td>?</td><td>?</td></tr>
              <tr><td>$b^{(2)}$</td><td>0.2</td><td>?</td><td>?</td></tr>
              <tr><td>$w_{11}^{(1)}$</td><td>0.5</td><td>?</td><td>?</td></tr>
              <tr><td>$w_{12}^{(1)}$</td><td>0.2</td><td>?</td><td>?</td></tr>
              <tr><td>$w_{21}^{(1)}$</td><td>−0.3</td><td>?</td><td>?</td></tr>
              <tr><td>$w_{22}^{(1)}$</td><td>0.8</td><td>?</td><td>?</td></tr>
              <tr><td>$b_1^{(1)}$</td><td>0.1</td><td>?</td><td>?</td></tr>
              <tr><td>$b_2^{(1)}$</td><td>−0.5</td><td>?</td><td>?</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1. Градиент loss по выходу: $\\partial L / \\partial \\hat{y}$</h4>
            <div class="calc">
              $L = -\\ln(\\hat{y})$ (при $y=1$)<br>
              $\\dfrac{\\partial L}{\\partial \\hat{y}} = -\\dfrac{1}{\\hat{y}} = -\\dfrac{1}{0{,}618} = \\mathbf{-1{,}618}$
            </div>
            <div class="why">Знак отрицательный: чтобы уменьшить loss, нужно <b>увеличить</b> $\\hat{y}$ (сдвинуть предсказание ближе к 1). Это начальная точка обратного распространения.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2. Через sigmoid: $\\partial L / \\partial z_{out}$</h4>
            <div class="calc">
              Производная sigmoid: $\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$<br>
              $\\sigma'(0{,}48) = 0{,}618 \\times (1 - 0{,}618) = 0{,}618 \\times 0{,}382 = 0{,}236$<br><br>
              Для BCE + sigmoid есть красивое упрощение:<br>
              $\\dfrac{\\partial L}{\\partial z_{out}} = \\hat{y} - y = 0{,}618 - 1 = \\mathbf{-0{,}382}$
            </div>
            <div class="why">Проверка: $(-1{,}618) \\times 0{,}236 = -0{,}382$ — сходится! Упрощение $\\hat{y}-y$ работает только для пары BCE + sigmoid.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3. Градиенты по $W^{(2)}$ и $b^{(2)}$</h4>
            <div class="calc">
              $\\dfrac{\\partial L}{\\partial w_1^{(2)}} = \\dfrac{\\partial L}{\\partial z_{out}} \\cdot a_1 = (-0{,}382) \\times 1{,}0 = \\mathbf{-0{,}382}$<br><br>
              $\\dfrac{\\partial L}{\\partial w_2^{(2)}} = \\dfrac{\\partial L}{\\partial z_{out}} \\cdot a_2 = (-0{,}382) \\times 0{,}8 = \\mathbf{-0{,}306}$<br><br>
              $\\dfrac{\\partial L}{\\partial b^{(2)}} = \\dfrac{\\partial L}{\\partial z_{out}} \\cdot 1 = \\mathbf{-0{,}382}$
            </div>
            <div class="why">Градиент по весу = (градиент по pre-activation) $\\times$ (вход этого веса). Чем сильнее активирован нейрон ($a_1 > a_2$), тем больше его вес будет скорректирован.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4. Передаём градиент к скрытым активациям</h4>
            <div class="calc">
              $\\dfrac{\\partial L}{\\partial a_1} = \\dfrac{\\partial L}{\\partial z_{out}} \\cdot w_1^{(2)} = (-0{,}382) \\times 0{,}6 = \\mathbf{-0{,}229}$<br><br>
              $\\dfrac{\\partial L}{\\partial a_2} = \\dfrac{\\partial L}{\\partial z_{out}} \\cdot w_2^{(2)} = (-0{,}382) \\times (-0{,}4) = \\mathbf{+0{,}153}$
            </div>
            <div class="why">Градиент по $a_2$ <b>положительный</b>: вес $w_2^{(2)}=-0{,}4$ отрицательный, поэтому увеличение $a_2$ <b>уменьшает</b> $z_{out}$, а нам нужно его увеличить. Значит, $a_2$ следует уменьшить.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5. Через ReLU: $\\partial L / \\partial z_j$</h4>
            <div class="calc">
              $\\text{ReLU}'(z) = \\begin{cases} 1, & z > 0 \\\\ 0, & z \\leq 0 \\end{cases}$<br><br>
              $z_1 = 1{,}0 > 0 \\Rightarrow \\text{ReLU}'(z_1) = 1$<br>
              $z_2 = 0{,}8 > 0 \\Rightarrow \\text{ReLU}'(z_2) = 1$<br><br>
              $\\dfrac{\\partial L}{\\partial z_1} = \\dfrac{\\partial L}{\\partial a_1} \\cdot 1 = \\mathbf{-0{,}229}$<br>
              $\\dfrac{\\partial L}{\\partial z_2} = \\dfrac{\\partial L}{\\partial a_2} \\cdot 1 = \\mathbf{+0{,}153}$
            </div>
            <div class="why">Оба $z > 0$, поэтому ReLU'=1 и градиент проходит без изменений. Если бы $z_j \\leq 0$, ReLU «убило бы» нейрон: градиент = 0, веса бы не обновились (проблема dying ReLU).</div>
          </div>

          <div class="step" data-step="6">
            <h4>Шаг 6. Градиенты по всей матрице $W^{(1)}$ и $b^{(1)}$ — 6 значений</h4>
            <div class="calc">
              <b>Первый нейрон ($\\partial L/\\partial z_1 = -0{,}229$):</b><br>
              $\\dfrac{\\partial L}{\\partial w_{11}} = (-0{,}229) \\times x_1 = (-0{,}229) \\times 1 = \\mathbf{-0{,}229}$<br>
              $\\dfrac{\\partial L}{\\partial w_{12}} = (-0{,}229) \\times x_2 = (-0{,}229) \\times 2 = \\mathbf{-0{,}458}$<br>
              $\\dfrac{\\partial L}{\\partial b_1} = (-0{,}229) \\times 1 = \\mathbf{-0{,}229}$<br><br>

              <b>Второй нейрон ($\\partial L/\\partial z_2 = +0{,}153$):</b><br>
              $\\dfrac{\\partial L}{\\partial w_{21}} = (+0{,}153) \\times x_1 = 0{,}153 \\times 1 = \\mathbf{+0{,}153}$<br>
              $\\dfrac{\\partial L}{\\partial w_{22}} = (+0{,}153) \\times x_2 = 0{,}153 \\times 2 = \\mathbf{+0{,}306}$<br>
              $\\dfrac{\\partial L}{\\partial b_2} = (+0{,}153) \\times 1 = \\mathbf{+0{,}153}$
            </div>
            <div class="why">Градиент по весу $w_{ij}$ = (градиент по pre-activation нейрона $i$) $\\times$ (вход $x_j$). Поэтому $w_{12}$ получает вдвое больший градиент, чем $w_{11}$: $x_2=2$ вносит больший вклад.</div>
          </div>

          <div class="step" data-step="7">
            <h4>Шаг 7. Обновляем ВСЕ 9 весов: $w \\gets w - \\eta \\cdot \\nabla$</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Параметр</th><th>Старое</th><th>Градиент</th><th>$-\\eta \\cdot$ grad</th><th>Новое</th></tr>
                <tr><td>$w_1^{(2)}$</td><td>0.600</td><td>−0.382</td><td>+0.038</td><td><b>0.638</b></td></tr>
                <tr><td>$w_2^{(2)}$</td><td>−0.400</td><td>−0.306</td><td>+0.031</td><td><b>−0.369</b></td></tr>
                <tr><td>$b^{(2)}$</td><td>0.200</td><td>−0.382</td><td>+0.038</td><td><b>0.238</b></td></tr>
                <tr><td>$w_{11}$</td><td>0.500</td><td>−0.229</td><td>+0.023</td><td><b>0.523</b></td></tr>
                <tr><td>$w_{12}$</td><td>0.200</td><td>−0.458</td><td>+0.046</td><td><b>0.246</b></td></tr>
                <tr><td>$w_{21}$</td><td>−0.300</td><td>+0.153</td><td>−0.015</td><td><b>−0.315</b></td></tr>
                <tr><td>$w_{22}$</td><td>0.800</td><td>+0.306</td><td>−0.031</td><td><b>0.769</b></td></tr>
                <tr><td>$b_1$</td><td>0.100</td><td>−0.229</td><td>+0.023</td><td><b>0.123</b></td></tr>
                <tr><td>$b_2$</td><td>−0.500</td><td>+0.153</td><td>−0.015</td><td><b>−0.515</b></td></tr>
              </table>
            </div>
            <div class="why">Правило: $w_{new} = w_{old} - \\eta \\cdot \\text{grad}$. Отрицательный градиент → вес увеличивается (мы хотим увеличить $\\hat{y}$). Положительный градиент → вес уменьшается.</div>
          </div>

          <div class="step" data-step="8">
            <h4>Шаг 8. Forward pass с новыми весами: loss стал меньше!</h4>
            <div class="calc">
              <b>Новый скрытый слой:</b><br>
              $z_1' = 0{,}523 \\times 1 + 0{,}246 \\times 2 + 0{,}123 = 0{,}523 + 0{,}492 + 0{,}123 = 1{,}138$<br>
              $a_1' = \\text{ReLU}(1{,}138) = 1{,}138$<br><br>
              $z_2' = (-0{,}315) \\times 1 + 0{,}769 \\times 2 + (-0{,}515) = -0{,}315 + 1{,}538 - 0{,}515 = 0{,}708$<br>
              $a_2' = \\text{ReLU}(0{,}708) = 0{,}708$<br><br>

              <b>Новый выход:</b><br>
              $z_{out}' = 0{,}638 \\times 1{,}138 + (-0{,}369) \\times 0{,}708 + 0{,}238$<br>
              $= 0{,}726 - 0{,}261 + 0{,}238 = 0{,}703$<br>
              $\\hat{y}' = \\sigma(0{,}703) = \\dfrac{1}{1+e^{-0{,}703}} = \\dfrac{1}{1+0{,}495} = 0{,}669$<br><br>

              <b>Новый loss:</b><br>
              $L' = -\\ln(0{,}669) = 0{,}402$
            </div>
            <div class="calc">
              <b>Улучшение:</b> Loss: $0{,}481 \\to 0{,}402$ (снижение на 16,4%)<br>
              $\\hat{y}$: $0{,}618 \\to 0{,}669$ (ближе к целевому 1.0)
            </div>
            <div class="why">Один шаг градиентного спуска: loss снизился с 0,481 до 0,402. Предсказание сдвинулось с 0,618 к 0,669 — ближе к цели $y=1$. Продолжая итерации, сеть будет приближаться всё точнее.</div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>Все 9 градиентов вычислены chain rule от выхода к входу. После одного шага с $\\eta=0{,}1$: $\\hat{y}$ вырос с 0,618 до 0,669, loss снизился с 0,481 до 0,402 (−16,4%). Backprop вычисляет все градиенты за $O(n)$ — так же быстро, как forward pass.</p>
          </div>

          <div class="lesson-box">
            <b>Правила backprop для повторения на бумаге:</b><br>
            1) Начать с $\\partial L / \\partial z_{out} = \\hat{y} - y$ (для BCE+sigmoid).<br>
            2) Градиент по весу = (grad по pre-activation) $\\times$ (вход этого веса).<br>
            3) Градиент к предыдущему слою = (grad по pre-activation) $\\times$ (вес ребра).<br>
            4) Через ReLU: умножить на 1 (если $z>0$) или 0 (если $z \\leq 0$).
          </div>
        `
      },
      {
        title: '1 vs 4 vs 16 нейронов',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Как число нейронов в скрытом слое влияет на <b>границу решений</b>? Сравниваем 1, 4, 16 нейронов на XOR-подобных данных. Покажем, что каждый ReLU-нейрон = одна «линия-разрез» пространства.</p>
          </div>

          <div class="example-data-table">
            <table>
              <tr><th>Архитектура</th><th>Параметров</th><th>Число линейных сегментов</th><th>Способность</th></tr>
              <tr><td>2→1→1</td><td>4</td><td>1 прямая</td><td>Только линейно разделимые</td></tr>
              <tr><td>2→4→1</td><td>17</td><td>до 4 линий → выпуклые области</td><td>XOR, простые кривые</td></tr>
              <tr><td>2→16→1</td><td>65</td><td>до 16 линий → сложные фигуры</td><td>Произвольные границы</td></tr>
            </table>
          </div>

          <div class="step" data-step="1">
            <h4>1 нейрон: одна прямая линия</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="max-width:200px;">
                <rect width="200" height="200" fill="#eff6ff"/>
                <rect x="0" y="0" width="200" height="100" fill="#fee2e2" opacity="0.5"/>
                <line x1="0" y1="100" x2="200" y2="100" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,3"/>
                <!-- Points: XOR pattern -->
                <circle cx="50" cy="50" r="6" fill="#ef4444"/>
                <circle cx="150" cy="50" r="6" fill="#3b82f6"/>
                <circle cx="50" cy="150" r="6" fill="#3b82f6"/>
                <circle cx="150" cy="150" r="6" fill="#ef4444"/>
                <text x="100" y="195" text-anchor="middle" font-size="10" fill="#64748b">1 нейрон: 1 прямая</text>
              </svg>
            </div>
            <div class="calc">
              $\\hat{y} = \\sigma(w_1 \\cdot \\text{ReLU}(v_1 x_1 + v_2 x_2 + c) + b)$<br>
              Один ReLU = одна «складка» пространства = одна прямая граница.<br>
              XOR невозможно разделить одной прямой → <b>ошибка ~50%</b> (случайное угадывание).
            </div>
            <div class="why">Один нейрон = один линейный разрез. Для задачи, где классы «переплетены» (как XOR), этого категорически недостаточно.</div>
          </div>

          <div class="step" data-step="2">
            <h4>4 нейрона: можно решить XOR!</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="max-width:200px;">
                <rect width="200" height="200" fill="#eff6ff"/>
                <!-- Two triangular red regions -->
                <polygon points="0,0 100,0 0,100" fill="#fee2e2" opacity="0.5"/>
                <polygon points="200,200 100,200 200,100" fill="#fee2e2" opacity="0.5"/>
                <line x1="0" y1="100" x2="100" y2="0" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>
                <line x1="100" y1="200" x2="200" y2="100" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>
                <!-- XOR points -->
                <circle cx="50" cy="50" r="6" fill="#ef4444"/>
                <circle cx="150" cy="50" r="6" fill="#3b82f6"/>
                <circle cx="50" cy="150" r="6" fill="#3b82f6"/>
                <circle cx="150" cy="150" r="6" fill="#ef4444"/>
                <text x="100" y="195" text-anchor="middle" font-size="10" fill="#64748b">4 нейрона: 2+ прямых</text>
              </svg>
            </div>
            <div class="calc">
              Каждый из 4 нейронов задаёт свою прямую: $v_j^T x + c_j = 0$.<br>
              ReLU «включает» нейрон с одной стороны, «выключает» с другой.<br>
              4 прямых могут огородить замкнутые области (выпуклые многоугольники).<br>
              XOR = 2 треугольных области → решается 4 нейронами!<br>
              <b>Ошибка: ~0%</b> на этих данных.
            </div>
            <div class="why">4 нейрона = 4 «разреза», которые могут формировать пересечения и создавать нелинейные (кусочно-линейные) границы. Этого достаточно для XOR.</div>
          </div>

          <div class="step" data-step="3">
            <h4>16 нейронов: произвольно сложные границы</h4>
            <div class="illustration bordered">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="max-width:200px;">
                <rect width="200" height="200" fill="#eff6ff"/>
                <!-- Complex curved-like boundary via many segments -->
                <path d="M0,100 Q30,60 60,80 Q80,95 100,70 Q120,45 140,65 Q160,85 180,55 Q190,40 200,50" fill="none" stroke="#ef4444" stroke-width="2"/>
                <path d="M0,100 Q30,60 60,80 Q80,95 100,70 Q120,45 140,65 Q160,85 180,55 Q190,40 200,50 L200,0 L0,0 Z" fill="#fee2e2" opacity="0.4"/>
                <!-- Many scattered points -->
                <circle cx="30" cy="40" r="4" fill="#ef4444"/>
                <circle cx="70" cy="30" r="4" fill="#ef4444"/>
                <circle cx="110" cy="45" r="4" fill="#ef4444"/>
                <circle cx="160" cy="35" r="4" fill="#ef4444"/>
                <circle cx="40" cy="130" r="4" fill="#3b82f6"/>
                <circle cx="90" cy="140" r="4" fill="#3b82f6"/>
                <circle cx="130" cy="120" r="4" fill="#3b82f6"/>
                <circle cx="170" cy="150" r="4" fill="#3b82f6"/>
                <text x="100" y="195" text-anchor="middle" font-size="10" fill="#64748b">16 нейронов: ~кривая</text>
              </svg>
            </div>
            <div class="calc">
              16 нейронов = 16 линейных разрезов пространства.<br>
              Кусочно-линейная граница с 16 сегментами выглядит почти как кривая.<br>
              Теорема (Universal Approximation): с достаточным числом нейронов один скрытый слой может аппроксимировать любую непрерывную функцию.<br><br>
              <b>Но:</b> 65 параметров при 20 точках данных → risk <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">overfitting</a>!<br>
              Train accuracy: 100%. Test accuracy: может быть 80-90%.
            </div>
            <div class="why">Больше нейронов = более гибкая граница. Но гибкость без данных = переобучение. Правило: следите за val loss, используйте dropout и early stopping.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Сводная таблица: bias-variance tradeoff</h4>
            <div class="example-data-table">
              <table>
                <tr><th>Нейронов</th><th>Train Acc</th><th>Test Acc</th><th>Bias</th><th>Variance</th><th>Диагноз</th></tr>
                <tr><td>1</td><td>50%</td><td>50%</td><td>Высокий</td><td>Низкий</td><td><a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">Underfitting</a></td></tr>
                <tr><td>4</td><td>98%</td><td>95%</td><td>Низкий</td><td>Низкий</td><td>Оптимум</td></tr>
                <tr><td>16</td><td>100%</td><td>88%</td><td>Нулевой</td><td>Высокий</td><td>Overfitting</td></tr>
              </table>
            </div>
          </div>

          <div class="answer-box">
            <div class="answer-label">Ответ</div>
            <p>1 нейрон = 1 прямая, не решает XOR. 4 нейрона = выпуклые области, решает XOR. 16 нейронов = сложные границы, но риск переобучения. Каждый ReLU-нейрон добавляет одну «складку» в пространстве признаков. Выбирайте по val loss, не по train accuracy.</p>
          </div>

          <div class="lesson-box">
            <b>Практическое правило:</b> начните с 2-4 нейронов, увеличивайте вдвое, пока val loss падает. Как только val loss стал расти — вы нашли оптимум. Или: берите большую сеть + dropout 0.2-0.5.
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
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Cross-entropy loss' } }, scales: { x: { title: { display: true, text: 'Эпоха' } }, y: { beginAtZero: true } } },
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

    python: `
      <h3>Нейронные сети на Python</h3>
      <p>Строим MLP на PyTorch через nn.Sequential с полным циклом обучения, а затем сравниваем с sklearn MLPClassifier.</p>

      <h4>1. PyTorch: MLP для классификации (nn.Sequential)</h4>
      <pre><code>import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np

# Данные: два полумесяца (нелинейно разделимые)
X, y = make_moons(n_samples=1000, noise=0.2, random_state=42)
X = StandardScaler().fit_transform(X)          # нормализация обязательна

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Преобразуем в тензоры PyTorch
X_tr = torch.FloatTensor(X_train)
y_tr = torch.LongTensor(y_train)
X_te = torch.FloatTensor(X_test)
y_te = torch.LongTensor(y_test)

# Архитектура: 2 → 64 → 32 → 2 (два класса)
model = nn.Sequential(
    nn.Linear(2, 64),    # входной слой
    nn.ReLU(),           # нелинейность
    nn.Linear(64, 32),   # скрытый слой
    nn.ReLU(),
    nn.Dropout(0.2),     # регуляризация: случайно отключаем нейроны
    nn.Linear(32, 2),    # выходной слой (логиты для 2 классов)
)

optimizer = optim.Adam(model.parameters(), lr=1e-3)
loss_fn   = nn.CrossEntropyLoss()              # для классификации

# Цикл обучения
for epoch in range(100):
    model.train()
    optimizer.zero_grad()
    logits = model(X_tr)
    loss   = loss_fn(logits, y_tr)
    loss.backward()
    optimizer.step()

    if epoch % 20 == 0:
        model.eval()
        with torch.no_grad():
            acc = (model(X_te).argmax(1) == y_te).float().mean()
        print(f"Epoch {epoch:3d}: loss={loss:.4f}, test_acc={acc:.2%}")
</code></pre>

      <h4>2. sklearn: MLPClassifier — один вызов fit()</h4>
      <pre><code>from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report

X, y = make_moons(n_samples=1000, noise=0.2, random_state=42)
X = StandardScaler().fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Архитектура: два скрытых слоя 64 и 32 нейрона
mlp = MLPClassifier(
    hidden_layer_sizes=(64, 32),  # скрытые слои
    activation='relu',            # функция активации
    solver='adam',                # оптимизатор
    max_iter=200,
    random_state=42
)
mlp.fit(X_train, y_train)

print(classification_report(y_test, mlp.predict(X_test)))
print(f"Количество итераций: {mlp.n_iter_}")
</code></pre>

      <h4>3. Визуализация границы решения MLP</h4>
      <pre><code>import numpy as np
import matplotlib.pyplot as plt
import torch

# Строим сетку для визуализации (используем обученную модель из блока 1)
xx, yy = np.meshgrid(np.linspace(-3, 3, 200), np.linspace(-3, 3, 200))
grid   = torch.FloatTensor(np.c_[xx.ravel(), yy.ravel()])

model.eval()
with torch.no_grad():
    Z = model(grid).argmax(1).numpy().reshape(xx.shape)

plt.figure(figsize=(8, 6))
plt.contourf(xx, yy, Z, alpha=0.4, cmap='RdBu')

# Данные тестовой выборки
X_np = X_test                             # numpy-массив
plt.scatter(X_np[y_test==0, 0], X_np[y_test==0, 1],
            c='red', label='Класс 0', edgecolors='k')
plt.scatter(X_np[y_test==1, 0], X_np[y_test==1, 1],
            c='blue', label='Класс 1', edgecolors='k')
plt.title('Нелинейная граница решения MLP')
plt.legend(); plt.show()
</code></pre>
    `,

    applications: `
      <h3>Где применяется</h3>
      <ul>
        <li><b>Tabular ML</b> — альтернатива бустингу на больших данных.</li>
        <li><b>Image recognition</b> — CNN (свёрточные сети).</li>
        <li><b>NLP</b> — RNN, LSTM, Transformer.</li>
        <li><b>Speech</b> — распознавание и синтез.</li>
        <li><b>Recommender systems</b> — neural collaborative filtering, <a class="glossary-link" onclick="App.selectTopic('glossary-embedding')">embeddings</a>.</li>
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
        <tr><td><a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">Недообучение</a></td><td>Train и Val высокие</td><td>Больше слоёв/нейронов</td></tr>
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
    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" target="_blank">3Blue1Brown: Neural Networks плейлист</a> — лучшая визуальная интуиция backprop и архитектуры MLP</li>
        <li><a href="https://www.youtube.com/watch?v=CqOfi41LfDw" target="_blank">StatQuest: Neural Networks</a> — пошаговое объяснение с числовыми примерами</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D0%BD%D0%BD%D1%8B%D0%B5%20%D1%81%D0%B5%D1%82%D0%B8%20backpropagation" target="_blank">Habr: Нейронные сети с нуля</a> — реализация MLP и backpropagation на Python</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html" target="_blank">PyTorch: Build the Neural Network</a> — официальный туториал по построению нейросети</li>
      </ul>
    `,
  },
});
