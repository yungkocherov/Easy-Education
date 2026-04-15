/* ==========================================================================
   Глоссарий: Vanishing / Exploding Gradients
   ========================================================================== */
App.registerTopic({
  id: 'glossary-vanishing-gradient',
  category: 'glossary',
  title: 'Vanishing / Exploding Gradients',
  summary: 'Градиент исчезает или взрывается при backprop через глубокие сети. Главная проблема обучения глубоких моделей — решается ReLU, BatchNorm, residual connections и gradient clipping.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь длинную цепочку шестерёнок. Ты крутишь последнюю, и движение должно передаться первой. Но каждая шестерёнка немного «теряет» энергию: если передача = 0.9, после 20 шестерёнок сигнал = $0.9^{20} ≈ 0.12$ — в 8 раз слабее. После 100 — практически 0.</p>
        <p>При обучении нейронной сети происходит то же самое. Градиент от функции потерь через <b>цепное правило</b> умножается на производные каждого слоя. Если эти производные < 1 — градиент <b>исчезает</b> (vanishing). Если > 1 — <b>взрывается</b> (exploding). В обоих случаях обучение ломается.</p>
      </div>

      <h3>📐 Откуда берётся</h3>
      <p>По цепному правилу, градиент функции потерь $L$ по весам первого слоя в сети с $k$ слоями:</p>
      <div class="math-block">$$\\frac{\\partial L}{\\partial w_1} = \\frac{\\partial L}{\\partial h_k} \\cdot \\frac{\\partial h_k}{\\partial h_{k-1}} \\cdot \\frac{\\partial h_{k-1}}{\\partial h_{k-2}} \\cdots \\frac{\\partial h_2}{\\partial h_1} \\cdot \\frac{\\partial h_1}{\\partial w_1}$$</div>
      <p>Это произведение $k$ якобианов. Если каждый имеет норму ~0.5, то общая норма ~$0.5^k$ — экспоненциально мала. Если ~2, то ~$2^k$ — экспоненциально велика.</p>

      <h3>⚠️ Vanishing gradient (исчезающий)</h3>
      <p>Симптомы:</p>
      <ul>
        <li>Loss практически не падает, или падает только у последних слоёв.</li>
        <li>Градиенты первых слоёв близки к 0, веса почти не обновляются.</li>
        <li>Сеть «учится с хвоста»: глубокие части застревают в случайной инициализации.</li>
      </ul>
      <p><b>Причины</b>:</p>
      <ul>
        <li>Активация <b>sigmoid</b> имеет максимальную производную 0.25; после 10 слоёв градиент умножается максимум на $0.25^{10} \\approx 10^{-6}$.</li>
        <li><b>tanh</b> получше (max производная 1), но тоже насыщается в крайних значениях.</li>
        <li>Плохая инициализация весов.</li>
        <li>Глубокие RNN — ещё хуже: один якобиан повторяется $T$ раз во времени.</li>
      </ul>

      <h3>🔥 Exploding gradient (взрывающийся)</h3>
      <p>Симптомы:</p>
      <ul>
        <li>Loss внезапно становится NaN.</li>
        <li>Градиенты огромные, веса обновляются на огромные значения.</li>
        <li>Часто случается с RNN, плохой инициализацией, слишком большим learning rate.</li>
      </ul>
      <p>Менее опасен, чем vanishing (легко обнаружить и починить gradient clipping'ом), но тоже критичен.</p>

      <h3>💡 Решения</h3>

      <h4>1. ReLU вместо sigmoid/tanh</h4>
      <p>Производная ReLU = 1 (для положительных) или 0. Нет затухания в активной области. Вариации: Leaky ReLU, ELU, GELU. Это одна из причин, почему глубокое обучение «взлетело» после 2012.</p>

      <h4>2. Xavier / He initialization</h4>
      <p>Умная инициализация весов так, чтобы дисперсия сигналов оставалась постоянной между слоями:</p>
      <ul>
        <li><b>Xavier (Glorot)</b>: $\\sigma^2 = 1/n_{in}$ — для sigmoid/tanh.</li>
        <li><b>He (Kaiming)</b>: $\\sigma^2 = 2/n_{in}$ — для ReLU.</li>
      </ul>
      <p>Правильная инициализация — половина успеха при обучении глубоких сетей.</p>

      <h4>3. Batch Normalization / Layer Normalization</h4>
      <p>Нормализует активации между слоями, не давая им «съезжать» в насыщение. См. <a onclick="App.selectTopic('glossary-batchnorm')">BatchNorm</a>.</p>

      <h4>4. Residual (skip) connections</h4>
      <p>Добавить «обход» слоя: $y = F(x) + x$. Градиент может «протекать» напрямую через identity-часть, минуя нелинейность. Это позволило обучать ResNet-152 и глубже. См. <a onclick="App.selectTopic('glossary-residual')">Residual connections</a>.</p>

      <h4>5. Gradient Clipping (против exploding)</h4>
      <p>Ограничить норму градиента: если $\\|g\\| > \\tau$, то $g \\leftarrow g \\cdot \\tau / \\|g\\|$. Простой и эффективный приём, особенно для RNN. PyTorch: <code>torch.nn.utils.clip_grad_norm_</code>.</p>

      <h4>6. LSTM/GRU (для RNN)</h4>
      <p>Механизм ворот позволяет информации «проходить» через много шагов без затухания градиента. Специально разработан для решения vanishing gradient в рекуррентных сетях.</p>

      <h4>7. Более короткие backprop paths</h4>
      <p>Transformer использует self-attention с коротким путём от любого токена к любому другому — одним умножением матриц, без длинной цепочки рекуррентных шагов. Это одна из причин, почему Transformer победил RNN.</p>

      <h3>🔢 Пример: sigmoid в глубокой сети</h3>
      <div class="calc">Предположим сеть с 20 слоями на sigmoid активациях.
Худший случай: каждая производная ≈ 0.1 (в насыщении sigmoid).
Градиент первого слоя ~ 0.1²⁰ = 10⁻²⁰.

Learning rate = 0.01. Обновление веса:
Δw = 0.01 × 10⁻²⁰ = 10⁻²² — по сути ноль.
Веса первого слоя НЕ меняются за тысячи эпох.

С ReLU и He init: градиент порядка 1, обновления нормальные.</div>

      <h3>📊 Как диагностировать</h3>
      <ul>
        <li>Строй <b>gradient norm</b> для каждого слоя во время обучения. Если разница на порядки — проблема.</li>
        <li>Смотри на распределение активаций: много нулей у ReLU → dying ReLU; насыщение у sigmoid → vanishing.</li>
        <li>Экспериментируй с глубиной: если 5 слоёв учатся, а 20 нет — скорее всего vanishing.</li>
        <li>Для RNN: backprop through time (BPTT) → явно подвержено обеим проблемам.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('glossary-activations')">Активационные функции</a> — ReLU решает большую часть vanishing</li>
        <li><a onclick="App.selectTopic('glossary-batchnorm')">BatchNorm</a></li>
        <li><a onclick="App.selectTopic('glossary-residual')">Residual connections</a></li>
        <li><a onclick="App.selectTopic('glossary-gradient')">Градиент</a></li>
        <li><a onclick="App.selectTopic('rnn-lstm')">RNN / LSTM</a> — LSTM как решение vanishing в RNN</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Vanishing_gradient_problem" target="_blank">Wikipedia: Vanishing gradient</a></li>
      </ul>
    `
  }
});
