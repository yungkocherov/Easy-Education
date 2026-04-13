/* ==========================================================================
   Глоссарий: KL-дивергенция (Kullback-Leibler)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-kl-divergence',
  category: 'glossary',
  title: 'KL-дивергенция',
  summary: 'Мера «расхождения» двух вероятностных распределений. Несимметричное «расстояние». Фундамент VAE, t-SNE, cross-entropy и теоремы о мощности.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>У тебя есть реальное распределение прогноза погоды $P$ (например, 70% ясно, 30% дождь) и распределение предсказаний модели $Q$ (50% ясно, 50% дождь). Насколько $Q$ «отличается» от $P$?</p>
        <p><b>KL-дивергенция</b> — это число, измеряющее, сколько <b>лишней информации</b> нужно закодировать, если ты предполагаешь $Q$, а истина — $P$. Чем больше KL, тем хуже $Q$ приближает $P$. KL = 0 только когда распределения идентичны.</p>
      </div>

      <h3>📐 Формула</h3>
      <div class="math-block">$$D_{\\text{KL}}(P \\| Q) = \\sum_{x} P(x) \\log \\frac{P(x)}{Q(x)}$$</div>
      <p>Для непрерывных распределений — интеграл. Читается «KL-дивергенция P от Q». База логарифма: log₂ даёт биты, ln — наты (обычно в ML).</p>

      <h3>🎯 Свойства</h3>
      <ul>
        <li><b>$D_{KL}(P\\|Q) \\geq 0$</b> всегда, равенство 0 ⇔ $P = Q$ (неравенство Гиббса).</li>
        <li><b>Несимметрично</b>: $D_{KL}(P\\|Q) \\neq D_{KL}(Q\\|P)$ в общем случае. Поэтому формально KL — <b>не</b> метрика (не «расстояние» в строгом смысле).</li>
        <li><b>Неограничено</b>: может быть ∞ (если $Q(x) = 0$ где $P(x) > 0$).</li>
        <li><b>Непрерывно</b> при small изменениях.</li>
      </ul>

      <h3>🔢 Пример: две монеты</h3>
      <div class="calc">P = (0.7, 0.3)  — истинное
Q = (0.5, 0.5)  — приближение

D_KL(P || Q) = 0.7 × log(0.7/0.5) + 0.3 × log(0.3/0.5)
             = 0.7 × 0.336 + 0.3 × (−0.511)
             = 0.235 − 0.153 = <b>0.082</b> nats

D_KL(Q || P) = 0.5 × log(0.5/0.7) + 0.5 × log(0.5/0.3)
             = 0.5 × (−0.336) + 0.5 × 0.511
             = −0.168 + 0.256 = <b>0.088</b> nats

Видим: значения немного разные — КL асимметрична.</div>

      <h3>💡 Связь с cross-entropy</h3>
      <p>Cross-entropy между $P$ и $Q$:</p>
      <div class="math-block">$$H(P, Q) = -\\sum_x P(x) \\log Q(x)$$</div>
      <p>Раскладывается как:</p>
      <div class="math-block">$$H(P, Q) = H(P) + D_{\\text{KL}}(P \\| Q)$$</div>
      <p>где $H(P) = -\\sum P \\log P$ — <a onclick="App.selectTopic('glossary-entropy')">энтропия</a> самого $P$. Минимизация cross-entropy (классический loss классификации) эквивалентна минимизации KL, потому что $H(P)$ — константа (зависит только от данных). Вот почему cross-entropy loss так прекрасно работает: он напрямую сближает распределение модели $Q$ с истинным $P$.</p>

      <h3>🎯 Применения в ML</h3>
      <ul>
        <li><b>Cross-entropy loss</b> в классификации = KL от истинного one-hot к предсказанному.</li>
        <li><b>VAE (Variational Autoencoder)</b>: функция потерь = reconstruction loss + $D_{KL}(q(z|x) \\| p(z))$. Второй член «притягивает» латентное распределение к $N(0,1)$.</li>
        <li><b>t-SNE</b>: минимизирует KL между парными вероятностями в исходном и 2D-пространстве.</li>
        <li><b>Variational Inference</b>: приближаем сложный posterior $p(\\theta|D)$ простым $q(\\theta)$, минимизируя $D_{KL}(q \\| p)$.</li>
        <li><b>Knowledge distillation</b>: студент-модель учится через KL от своих выходов к выходам учителя.</li>
        <li><b>Reinforcement learning (PPO, TRPO)</b>: KL-штраф не даёт политике резко меняться.</li>
      </ul>

      <h3>⚖️ Forward vs Reverse KL</h3>
      <p>Асимметрия KL имеет важный практический смысл:</p>
      <ul>
        <li><b>Forward KL $D_{KL}(P\\|Q)$</b> («mean-seeking»): штрафует $Q$ за «забывание» мод $P$. $Q$ стремится покрыть все области, где $P > 0$. Обычно даёт «размытое» $Q$.</li>
        <li><b>Reverse KL $D_{KL}(Q\\|P)$</b> («mode-seeking»): штрафует $Q$ за попадание в места, где $P \\approx 0$. $Q$ концентрируется на одной моде $P$. Используется в VI.</li>
      </ul>
      <p>Это объясняет, почему VAE (reverse KL) часто даёт размытые изображения, а GAN (без явной KL, скорее mode-seeking) — резкие, но менее разнообразные.</p>

      <h3>🔄 Альтернативы KL</h3>
      <ul>
        <li><b>Jensen-Shannon divergence</b>: $\\frac{1}{2}(D_{KL}(P\\|M) + D_{KL}(Q\\|M))$, где $M = (P+Q)/2$. Симметрична, ограничена.</li>
        <li><b>Wasserstein distance</b>: «земляной сдвиг» между распределениями. Непрерывна даже когда KL = ∞. Используется в WGAN.</li>
        <li><b>Total variation</b>: $\\frac{1}{2}\\sum|P - Q|$. Простая, но часто недифференцируема.</li>
        <li><b>Bhattacharyya distance</b>: основана на $\\int \\sqrt{PQ}$. Симметрична.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('glossary-entropy')">Энтропия</a> — KL = cross-entropy − entropy</li>
        <li><a onclick="App.selectTopic('glossary-loss-functions')">Функции потерь</a> — cross-entropy как loss</li>
        <li><a onclick="App.selectTopic('generative-models')">Генеративные модели</a> — VAE, GAN, diffusion</li>
        <li><a onclick="App.selectTopic('tsne-umap')">t-SNE</a> — минимизирует KL</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence" target="_blank">Wikipedia: KL divergence</a></li>
        <li><a href="https://www.countbayesie.com/blog/2017/5/9/kullback-leibler-divergence-explained" target="_blank">KL divergence explained</a></li>
      </ul>
    `
  }
});
