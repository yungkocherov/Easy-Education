/* ==========================================================================
   Глоссарий: Residual / Skip Connections
   ========================================================================== */
App.registerTopic({
  id: 'glossary-residual',
  category: 'glossary',
  title: 'Residual Connections',
  summary: 'Добавить «обход» через слой: y = F(x) + x. Решает vanishing gradient в глубоких сетях. Основа ResNet, Transformer, U-Net.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Обычный слой нейросети: возьми вход $x$ и выдай $y = F(x)$. Проблема: в глубокой сети первые слои не могут напрямую «общаться» с последними — всё идёт через длинную цепочку преобразований, и градиенты затухают.</p>
        <p><b>Residual connection</b> (или <b>skip connection</b>) — это «обходной» путь: $y = F(x) + x$. Вместо того чтобы заменить $x$, слой <b>добавляет</b> к нему поправку. Если слой ничего не даёт (F = 0), вход просто проходит насквозь. Это открывает «информационную магистраль» сквозь всю сеть.</p>
      </div>

      <h3>📐 Формула</h3>
      <div class="math-block">$$y = F(x, W) + x$$</div>
      <p>где $F$ — обычный блок (свёртка, активация, BN), а $x$ — вход этого блока, добавленный напрямую к выходу. Если размерности не совпадают, $x$ пропускается через линейную проекцию.</p>
      <p>Ключевой момент: обучается не «преобразование $x \\to y$», а <b>«поправка»</b> (residual) $F(x) = y - x$. Отсюда название.</p>

      <h3>🎯 Почему работает</h3>
      <ul>
        <li><b>Градиент протекает без потерь</b>: $\\partial L / \\partial x = \\partial L / \\partial y \\cdot (1 + \\partial F / \\partial x)$. Единица гарантирует, что градиент не меньше градиента «сверху».</li>
        <li><b>Identity как дефолт</b>: если слой ничего полезного не выучил ($F \\approx 0$), он просто пропускает сигнал — не мешает, не портит.</li>
        <li><b>Представление суммируется</b>: каждый слой <b>добавляет</b> к представлению, не переписывая его. Это похоже на ансамблирование.</li>
      </ul>

      <h3>📜 ResNet (2015)</h3>
      <p>До ResNet сети глубиной >20 слоёв плохо обучались. Оказалось: проблема не в переобучении, а в <b>vanishing gradient</b> — градиенты не доходили до первых слоёв.</p>
      <p>ResNet-152 (152 слоя!) выиграл ImageNet 2015 с ошибкой 3.57% (лучше человека). Авторы: Kaiming He et al. Одна из самых влиятельных работ в DL.</p>
      <p>Сегодня ResNet-50 — стандартный backbone для computer vision задач.</p>

      <h3>🧱 Residual block в ResNet</h3>
      <div class="calc">x (вход)
 ├──────────────────────────┐
 ↓                          │
 Conv3×3 → BN → ReLU         │ skip
 ↓                          │
 Conv3×3 → BN                │
 ↓                          │
 (+) ← ← ← ← ← ← ← ← ← ← ← ←┘
 ↓
 ReLU → y</div>
      <p>Два слоя свёртки + skip connection + финальная ReLU. Вариации: bottleneck (3 свёртки с 1×1 для экономии), pre-activation (BN и ReLU перед свёрткой).</p>

      <h3>🎯 Использование в других архитектурах</h3>
      <ul>
        <li><b>Transformer</b>: каждый блок (attention и FFN) обёрнут в residual. Без них Transformer не обучается на >6 слоях.</li>
        <li><b>U-Net</b>: skip connections от encoder к decoder сохраняют пространственные детали для сегментации.</li>
        <li><b>DenseNet</b>: экстремальный вариант — каждый слой получает skip от <b>всех</b> предыдущих.</li>
        <li><b>LSTM</b>: cell state + forget gate работают похожим образом, пропуская градиенты через время.</li>
      </ul>

      <h3>💡 Highway Networks — предшественник</h3>
      <p>В 2015 Highway Networks предложили более общий вариант: $y = T(x) \\cdot F(x) + (1 - T(x)) \\cdot x$, где $T$ — обучаемая «дверь» (transform gate). ResNet — упрощение: $T = 1$ всегда. Оказалось, что простой вариант достаточен и работает лучше.</p>

      <h3>🔢 Effect на глубину</h3>
      <table>
        <tr><th>Сеть</th><th>Глубина</th><th>Top-5 err (ImageNet)</th></tr>
        <tr><td>AlexNet (2012)</td><td>8</td><td>15.3%</td></tr>
        <tr><td>VGG-16 (2014)</td><td>16</td><td>7.3%</td></tr>
        <tr><td>Inception v3 (2015)</td><td>42</td><td>5.6%</td></tr>
        <tr><td>ResNet-152 (2015)</td><td>152</td><td>3.57%</td></tr>
        <tr><td>DenseNet-201</td><td>201</td><td>3.16%</td></tr>
      </table>
      <p>Без residual connections такая глубина была бы невозможна.</p>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('glossary-vanishing-gradient')">Vanishing gradient</a> — проблема, которую решают residuals</li>
        <li><a onclick="App.selectTopic('cnn')">CNN</a></li>
        <li><a onclick="App.selectTopic('transformer')">Transformer</a> — активно использует residuals</li>
        <li><a onclick="App.selectTopic('glossary-batchnorm')">BatchNorm</a></li>
      </ul>
    `,
    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://arxiv.org/abs/1512.03385" target="_blank">ResNet paper (He et al., 2015)</a></li>
      </ul>
    `
  }
});
