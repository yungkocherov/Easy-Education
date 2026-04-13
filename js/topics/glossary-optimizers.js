/* ==========================================================================
   Глоссарий: Оптимизаторы (SGD, Momentum, Adam, etc.)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-optimizers',
  category: 'glossary',
  title: 'Оптимизаторы (SGD, Adam)',
  summary: 'Алгоритмы, которые обновляют веса нейросети по градиенту. От простого SGD до адаптивного Adam — каждый со своими плюсами.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Градиентный спуск — это спуск с горы. Но есть разные стратегии:</p>
        <ul>
          <li><b>SGD</b> — иди по направлению уклона, шагами фиксированной длины. Просто, но медленно.</li>
          <li><b>Momentum</b> — если долго катишься вниз, наберёшь скорость. Быстрее преодолевает плато.</li>
          <li><b>Adam</b> — иди быстро там, где направление однородно, и осторожно, где «шатает». Адаптивный шаг для каждого веса.</li>
        </ul>
      </div>

      <h3>📐 SGD — Stochastic Gradient Descent</h3>
      <p>Самый простой оптимизатор: обновляет веса по градиенту, вычисленному на одном мини-батче:</p>
      <div class="math-block">$$w_{t+1} = w_t - \\eta \\cdot \\nabla L(w_t)$$</div>
      <p>где $\\eta$ — learning rate. «Stochastic» — потому что градиент шумный (считается по подвыборке, а не по всему датасету). Этот шум на самом деле помогает — не застревать в локальных минимумах.</p>

      <h3>🚀 SGD + Momentum</h3>
      <p>Копит «инерцию» — если несколько последних шагов шли в одном направлении, продолжай в том же:</p>
      <div class="math-block">$$v_{t+1} = \\beta v_t + \\nabla L(w_t), \\quad w_{t+1} = w_t - \\eta v_{t+1}$$</div>
      <p>Обычно $\\beta = 0.9$. Эффекты:</p>
      <ul>
        <li>Ускоряет движение в «долинах» с однородным направлением.</li>
        <li>Сглаживает шум стохастического градиента.</li>
        <li>Преодолевает мелкие локальные минимумы и седловые точки.</li>
      </ul>

      <h3>🎯 Nesterov Momentum</h3>
      <p>Улучшенная версия momentum: сначала «делает шаг», потом смотрит градиент в новой точке:</p>
      <div class="math-block">$$v_{t+1} = \\beta v_t + \\nabla L(w_t - \\eta \\beta v_t)$$</div>
      <p>Это «предсказание следующего шага» немного уменьшает колебания. В PyTorch `SGD(momentum=0.9, nesterov=True)`.</p>

      <h3>📊 AdaGrad (2011)</h3>
      <p>Идея: каждому параметру — свой learning rate, зависящий от истории градиентов:</p>
      <div class="math-block">$$w_{t+1,i} = w_{t,i} - \\frac{\\eta}{\\sqrt{G_{t,i} + \\varepsilon}} \\cdot g_{t,i}, \\quad G_{t,i} = \\sum_{s=1}^t g_{s,i}^2$$</div>
      <p>Часто обновляемые параметры получают меньший lr, редко обновляемые — больший. Хорошо для разреженных данных (NLP, реклама). <b>Проблема</b>: lr монотонно уменьшается, обучение может остановиться.</p>

      <h3>📊 RMSprop (2012)</h3>
      <p>Тот же принцип, но вместо суммы квадратов — <b>экспоненциальное скользящее среднее</b>:</p>
      <div class="math-block">$$G_{t,i} = \\rho G_{t-1,i} + (1-\\rho) g_{t,i}^2$$</div>
      <p>$\\rho = 0.9$. Не «забывает» навсегда, lr не падает до нуля. Отлично работает для RNN.</p>

      <h3>⭐ Adam (2014)</h3>
      <p>Комбинация momentum + RMSprop. На сегодня — <b>default оптимизатор</b> для большинства задач.</p>
      <div class="math-block">$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t$$</div>
      <div class="math-block">$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2$$</div>
      <div class="math-block">$$\\hat{m}_t = \\frac{m_t}{1 - \\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1 - \\beta_2^t}$$</div>
      <div class="math-block">$$w_{t+1} = w_t - \\frac{\\eta \\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\varepsilon}$$</div>
      <p>По умолчанию: $\\beta_1 = 0.9, \\beta_2 = 0.999, \\varepsilon = 10^{-8}$. Bias correction ($\\hat{m}, \\hat{v}$) компенсирует, что оценки $m, v$ на старте занижены (инициализированы нулями).</p>

      <h3>⭐ AdamW (2017)</h3>
      <p>Исправление бага в Adam: оригинальный Adam неправильно применяет weight decay. AdamW делает это корректно — декрементирует веса отдельно, вне основного обновления:</p>
      <div class="math-block">$$w_{t+1} = w_t - \\frac{\\eta \\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\varepsilon} - \\eta \\lambda w_t$$</div>
      <p>Результат: лучшее обобщение, чем у оригинального Adam. Используется в почти всех современных LLM (GPT, BERT, LLaMA).</p>

      <h3>🎯 Learning Rate Schedule</h3>
      <p>Вместо постоянного $\\eta$ его часто меняют со временем:</p>
      <ul>
        <li><b>Step decay</b>: $\\eta \\to \\eta \\cdot 0.1$ каждые N эпох.</li>
        <li><b>Exponential decay</b>: $\\eta_t = \\eta_0 \\cdot \\gamma^t$.</li>
        <li><b>Cosine annealing</b>: $\\eta$ плавно падает по косинусу от $\\eta_0$ до ~0.</li>
        <li><b>Warmup</b>: $\\eta$ растёт от 0 до $\\eta_0$ в первые ~5% шагов (стабилизирует старт Adam).</li>
        <li><b>One-cycle</b> (Leslie Smith): растёт, затем падает. Работает на удивление хорошо.</li>
      </ul>

      <h3>⚖️ Какой оптимизатор выбрать</h3>
      <table>
        <tr><th>Задача</th><th>Рекомендация</th></tr>
        <tr><td>Default для всего</td><td>Adam / AdamW</td></tr>
        <tr><td>Transformer, LLM</td><td>AdamW + warmup + cosine</td></tr>
        <tr><td>Computer vision, max accuracy</td><td>SGD + momentum + step decay (часто лучше обобщает)</td></tr>
        <tr><td>RNN</td><td>Adam / RMSprop</td></tr>
        <tr><td>Разреженные данные (NLP)</td><td>AdaGrad / Adam</td></tr>
        <tr><td>Reinforcement Learning</td><td>Adam</td></tr>
      </table>
      <p>Правило: <b>начни с Adam, потом попробуй SGD+momentum</b>. Для RL — только Adam.</p>

      <h3>🔢 Пример: эффект momentum</h3>
      <div class="calc">Loss: L(w) = w², старт w=5, lr=0.3

SGD:
  w₁ = 5 - 0.3·10 = 2.0
  w₂ = 2.0 - 0.3·4 = 0.8
  w₃ = 0.8 - 0.3·1.6 = 0.32
  ...

SGD + momentum β=0.9:
  v₁ = 0.9·0 + 10 = 10 → w₁ = 5 - 0.3·10 = 2.0
  v₂ = 0.9·10 + 4 = 13 → w₂ = 2 - 0.3·13 = -1.9
  ← «пролетел» минимум из-за инерции!

Momentum ускоряет, но может «промахнуться» — нужна хорошая настройка.</div>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('gradient-descent')">Градиентный спуск</a></li>
        <li><a onclick="App.selectTopic('glossary-gradient')">Градиент</a></li>
        <li><a onclick="App.selectTopic('neural-network')">Нейронные сети</a></li>
      </ul>
    `,
    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://arxiv.org/abs/1412.6980" target="_blank">Adam paper</a></li>
        <li><a href="https://www.ruder.io/optimizing-gradient-descent/" target="_blank">Sebastian Ruder: overview of optimizers</a></li>
      </ul>
    `
  }
});
