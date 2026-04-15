/* ==========================================================================
   Генеративные модели (обзор)
   ========================================================================== */
App.registerTopic({
  id: 'generative-models',
  category: 'dl',
  title: 'Генеративные модели (обзор)',
  summary: 'VAE, GAN, Diffusion — как нейросети учатся создавать новые данные.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь двух специалистов. <b>Дискриминативная модель</b> — это охранник на входе в клуб. Он смотрит на фото в паспорте и сравнивает с лицом: «Совпадает? Проходи. Не совпадает? Не пущу». Охранник <b>различает</b>, но сам лица рисовать не умеет.</p>
        <p><b>Генеративная модель</b> — это художник-портретист. Он изучил тысячи лиц и теперь может <b>нарисовать новое</b>, которого раньше не существовало, но которое выглядит абсолютно реалистично. Он понимает внутреннюю структуру данных — как устроены лица, какие пропорции бывают, какие нет.</p>
        <p>Именно генеративные модели стоят за Stable Diffusion, DALL·E, Midjourney и другими инструментами, которые создают изображения, музыку, тексты и код из ничего (а точнее — из шума или латентного пространства).</p>
      </div>

      <h3>🎯 Дискриминативные vs Генеративные модели</h3>
      <p>Это фундаментальное разделение в машинном обучении:</p>

      <div class="key-concept">
        <div class="kc-label">Дискриминативные модели</div>
        <p>Моделируют <b>условное распределение</b> $P(y|x)$ — вероятность класса $y$ при заданных признаках $x$. Проводят <b>границу решений</b> между классами.</p>
        <p>Примеры: логистическая регрессия, SVM, нейросети-классификаторы, Random Forest.</p>
      </div>

      <div class="key-concept">
        <div class="kc-label">Генеративные модели</div>
        <p>Моделируют <b>совместное распределение</b> $P(x)$ (или $P(x, y)$) — как устроены сами данные. Могут <b>генерировать новые</b> семплы из этого распределения.</p>
        <p>Примеры: VAE, GAN, Diffusion Models, Normalizing Flows, авторегрессионные модели (GPT).</p>
      </div>

      <p>Ключевое отличие: дискриминативная модель может сказать «это кошка с вероятностью 95%», но не может нарисовать кошку. Генеративная — может.</p>

      <h3>🔧 Автоэнкодер (Autoencoder) — фундамент</h3>
      <p>Прежде чем перейти к генеративным моделям, нужно понять автоэнкодер — архитектуру, которая лежит в основе VAE.</p>

      <div class="key-concept">
        <div class="kc-label">Идея автоэнкодера</div>
        <p>Сеть учится <b>сжимать</b> вход (Encoder) в маленькое представление — <b>латентный вектор</b> $z$ — и затем <b>восстанавливать</b> исходные данные обратно (Decoder). Если латентный вектор маленький, сеть вынуждена выучить <b>самое важное</b> о данных.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 520 140" xmlns="http://www.w3.org/2000/svg" style="max-width:520px;">
          <rect x="10" y="20" width="80" height="100" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="50" y="75" text-anchor="middle" font-size="12" fill="#1e40af" font-weight="600">Вход x</text>
          <text x="50" y="92" text-anchor="middle" font-size="10" fill="#64748b">dim=784</text>

          <polygon points="110,70 150,45 150,95" fill="#a5b4fc" stroke="#6366f1" stroke-width="1.5"/>
          <text x="140" y="115" text-anchor="middle" font-size="10" fill="#4f46e5">Encoder</text>

          <rect x="170" y="50" width="50" height="40" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="195" y="72" text-anchor="middle" font-size="11" fill="#92400e" font-weight="600">z</text>
          <text x="195" y="105" text-anchor="middle" font-size="10" fill="#b45309">dim=2</text>
          <text x="195" y="38" text-anchor="middle" font-size="9" fill="#92400e">Латентное</text>

          <polygon points="240,70 280,45 280,95" fill="#86efac" stroke="#10b981" stroke-width="1.5" transform="scale(-1,1) translate(-520,0)"/>
          <text x="270" y="115" text-anchor="middle" font-size="10" fill="#065f46">Decoder</text>

          <rect x="300" y="20" width="80" height="100" rx="8" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/>
          <text x="340" y="72" text-anchor="middle" font-size="11" fill="#065f46" font-weight="600">Выход x̂</text>
          <text x="340" y="92" text-anchor="middle" font-size="10" fill="#64748b">dim=784</text>

          <text x="400" y="55" font-size="10" fill="#64748b">Loss = ||x - x̂||²</text>
          <text x="400" y="72" font-size="10" fill="#64748b">(<a class="glossary-link" onclick="App.selectTopic('glossary-loss-functions')">MSE</a>)</text>
        </svg>
        <div class="caption">Автоэнкодер: вход 784-мерный (28×28 пикселей) сжимается в 2-мерный латентный вектор z, затем восстанавливается. Loss = ошибка реконструкции.</div>
      </div>

      <p><b>Компоненты:</b></p>
      <ul>
        <li><b>Encoder</b> $f_\\theta$: $x \\to z$ — сжимает вход в латентный код.</li>
        <li><b>Decoder</b> $g_\\phi$: $z \\to \\hat{x}$ — восстанавливает данные из кода.</li>
        <li><b>Reconstruction loss:</b> $\\mathcal{L} = ||x - \\hat{x}||^2$ (MSE) или binary cross-entropy.</li>
        <li><b>Bottleneck</b> — узкое место. Чем меньше $\\dim(z)$, тем сильнее сжатие.</li>
      </ul>

      <p>Проблема обычного автоэнкодера: латентное пространство <b>неструктурировано</b>. Если взять случайную точку $z$ и подать в Decoder, результат будет мусором. Для генерации нужно что-то лучше — VAE.</p>

      <h3>🧬 VAE (Variational Autoencoder)</h3>

      <div class="key-concept">
        <div class="kc-label">Главная идея VAE</div>
        <p>Вместо того чтобы кодировать вход в <b>фиксированную точку</b> $z$, Encoder выдаёт <b>параметры распределения</b>: среднее $\\mu$ и дисперсию $\\sigma^2$. Латентный вектор <b>сэмплируется</b> из $\\mathcal{N}(\\mu, \\sigma^2)$. Это делает латентное пространство <b>гладким и непрерывным</b> — идеальным для генерации.</p>
      </div>

      <p><b>Как работает VAE:</b></p>
      <ol>
        <li><b>Encoder</b> получает вход $x$ и выдаёт $\\mu(x)$ и $\\log\\sigma^2(x)$.</li>
        <li><b>Reparameterization trick:</b> $z = \\mu + \\sigma \\cdot \\varepsilon$, где $\\varepsilon \\sim \\mathcal{N}(0, 1)$. Это позволяет делать backpropagation через стохастический семплинг.</li>
        <li><b>Decoder</b> восстанавливает $\\hat{x}$ из $z$.</li>
        <li><b>Loss = Reconstruction + <a class="glossary-link" onclick="App.selectTopic('glossary-kl-divergence')">KL-divergence</a>:</b></li>
      </ol>

      <div class="math-block">$$\\mathcal{L}_{VAE} = \\underbrace{||x - \\hat{x}||^2}_{\\text{Reconstruction}} + \\underbrace{D_{KL}\\left(q(z|x)\\;||\\;p(z)\\right)}_{\\text{Регуляризация}}$$</div>

      <div class="deep-dive">
        <p><b>Зачем KL-дивергенция?</b> Она «притягивает» распределение $q(z|x)$ к стандартному нормальному $\\mathcal{N}(0, 1)$. Без неё Encoder мог бы выучить огромные $\\mu$ и крошечные $\\sigma$, фактически превращая VAE в обычный автоэнкодер. KL-регуляризация обеспечивает <b>гладкость</b>: близкие точки в $z$ дают похожие изображения.</p>
      </div>

      <div class="why">Reparameterization trick — гениальная хитрость. Мы не можем дифференцировать через случайную операцию «сэмплировать из $\\mathcal{N}(\\mu, \\sigma^2)$». Но мы МОЖЕМ дифференцировать через детерминированную формулу $z = \\mu + \\sigma \\cdot \\varepsilon$, потому что $\\varepsilon$ — константа (сэмплирована заранее), а $\\mu$ и $\\sigma$ — обучаемые. <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Градиент</a> проходит!</div>

      <p>Термин <b>ELBO</b> (Evidence Lower Bound) — это $-\\mathcal{L}_{VAE}$ (мы максимизируем нижнюю границу логарифма правдоподобия данных $\\log p(x)$).</p>

      <h3>⚔️ GAN (Generative Adversarial Network)</h3>

      <div class="key-concept">
        <div class="kc-label">Главная идея GAN</div>
        <p>Две нейросети играют в <b>игру</b>: Генератор (фальшивомонетчик) пытается создавать реалистичные данные из шума, а Дискриминатор (полиция) пытается отличить настоящие данные от поддельных. Обе сети улучшаются, соревнуясь друг с другом.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 540 170" xmlns="http://www.w3.org/2000/svg" style="max-width:540px;">
          <defs>
            <marker id="arrG" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#6366f1"/>
            </marker>
          </defs>
          <!-- Noise -->
          <rect x="10" y="55" width="70" height="40" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="45" y="72" text-anchor="middle" font-size="10" fill="#475569">Шум z</text>
          <text x="45" y="85" text-anchor="middle" font-size="9" fill="#94a3b8">~N(0, I)</text>

          <!-- Generator -->
          <line x1="85" y1="75" x2="115" y2="75" stroke="#6366f1" stroke-width="2" marker-end="url(#arrG)"/>
          <rect x="120" y="45" width="90" height="60" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
          <text x="165" y="72" text-anchor="middle" font-size="11" fill="#1e40af" font-weight="600">Generator</text>
          <text x="165" y="88" text-anchor="middle" font-size="9" fill="#64748b">G(z)</text>

          <!-- Fake data -->
          <line x1="215" y1="75" x2="260" y2="60" stroke="#6366f1" stroke-width="1.5" marker-end="url(#arrG)"/>
          <text x="243" y="50" font-size="9" fill="#dc2626">fake</text>

          <!-- Real data -->
          <rect x="220" y="120" width="70" height="35" rx="6" fill="#dcfce7" stroke="#10b981" stroke-width="1.5"/>
          <text x="255" y="142" text-anchor="middle" font-size="10" fill="#065f46">Real data</text>
          <line x1="295" y1="137" x2="310" y2="90" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrG)"/>
          <text x="320" y="120" font-size="9" fill="#065f46">real</text>

          <!-- Discriminator -->
          <rect x="270" y="40" width="100" height="60" rx="8" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="320" y="67" text-anchor="middle" font-size="11" fill="#92400e" font-weight="600">Discriminator</text>
          <text x="320" y="83" text-anchor="middle" font-size="9" fill="#b45309">Real / Fake?</text>

          <!-- Output -->
          <line x1="375" y1="70" x2="405" y2="70" stroke="#6366f1" stroke-width="2" marker-end="url(#arrG)"/>
          <text x="445" y="65" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">0 / 1</text>
          <text x="445" y="82" text-anchor="middle" font-size="9" fill="#94a3b8">fake / real</text>
        </svg>
        <div class="caption">GAN: Генератор создаёт данные из шума, Дискриминатор пытается отличить их от настоящих. Оба учатся одновременно в adversarial игре.</div>
      </div>

      <p><b>Формула minimax:</b></p>
      <div class="math-block">$$\\min_G \\max_D \\; \\mathbb{E}_{x \\sim p_{data}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log(1 - D(G(z)))]$$</div>

      <ul>
        <li><b>Дискриминатор</b> максимизирует: хочет давать высокие оценки реальным ($D(x) \\to 1$) и низкие — фейковым ($D(G(z)) \\to 0$).</li>
        <li><b>Генератор</b> минимизирует: хочет, чтобы $D(G(z)) \\to 1$ (Дискриминатор ошибается).</li>
        <li><b>Равновесие Нэша:</b> в идеале $D(x) = 0.5$ для всех $x$ (Дискриминатор не может отличить).</li>
      </ul>

      <div class="deep-dive">
        <p><b>Проблемы обучения GAN:</b></p>
        <ul>
          <li><b>Mode collapse</b> — Генератор находит «одну удачную картинку» и генерирует только её вариации, игнорируя разнообразие данных.</li>
          <li><b>Training instability</b> — баланс G и D хрупок. Если D слишком силён, градиенты G исчезают. Если G слишком силён, D не может учиться.</li>
          <li><b>Нет явной метрики</b> — в отличие от VAE, у GAN нет прямого loss, который можно мониторить.</li>
        </ul>
        <p>Решения: Wasserstein GAN (WGAN), spectral normalization, progressive growing (ProGAN), StyleGAN.</p>
      </div>

      <h3>🌊 Diffusion Models (Диффузионные модели)</h3>

      <div class="key-concept">
        <div class="kc-label">Главная идея Diffusion</div>
        <p>Два процесса: <b>прямой</b> — постепенно добавляем шум к данным, пока не получим чистый шум $\\mathcal{N}(0, I)$. <b>Обратный</b> — нейросеть учится <b>убирать шум</b> шаг за шагом, превращая случайный шум в реалистичные данные. Это как смотреть фильм о разрушении задом наперёд — восстанавливая объект из хаоса.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 130" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <defs>
            <marker id="arrFwd" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#ef4444"/>
            </marker>
            <marker id="arrRev" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <polygon points="0 0, 7 3.5, 0 7" fill="#10b981"/>
            </marker>
          </defs>
          <!-- Steps -->
          <rect x="10" y="30" width="60" height="50" rx="6" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="40" y="52" text-anchor="middle" font-size="9" fill="#1e40af" font-weight="600">x₀</text>
          <text x="40" y="66" text-anchor="middle" font-size="8" fill="#64748b">чисто</text>

          <line x1="75" y1="55" x2="105" y2="55" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arrFwd)"/>
          <text x="90" y="48" text-anchor="middle" font-size="7" fill="#ef4444">+шум</text>

          <rect x="110" y="30" width="60" height="50" rx="6" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5"/>
          <text x="140" y="52" text-anchor="middle" font-size="9" fill="#4338ca" font-weight="600">x₁</text>
          <text x="140" y="66" text-anchor="middle" font-size="8" fill="#64748b">мало шума</text>

          <line x1="175" y1="55" x2="205" y2="55" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arrFwd)"/>

          <rect x="210" y="30" width="60" height="50" rx="6" fill="#c7d2fe" stroke="#6366f1" stroke-width="1.5"/>
          <text x="240" y="55" text-anchor="middle" font-size="9" fill="#4338ca" font-weight="600">x₂</text>

          <line x1="275" y1="55" x2="305" y2="55" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arrFwd)"/>
          <text x="290" y="48" text-anchor="middle" font-size="7" fill="#ef4444">...</text>

          <rect x="310" y="30" width="60" height="50" rx="6" fill="#a5b4fc" stroke="#6366f1" stroke-width="1.5"/>
          <text x="340" y="55" text-anchor="middle" font-size="9" fill="#312e81" font-weight="600">x_{T-1}</text>

          <line x1="375" y1="55" x2="405" y2="55" stroke="#ef4444" stroke-width="1.5" marker-end="url(#arrFwd)"/>

          <rect x="410" y="30" width="60" height="50" rx="6" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
          <text x="440" y="52" text-anchor="middle" font-size="9" fill="#475569" font-weight="600">x_T</text>
          <text x="440" y="66" text-anchor="middle" font-size="8" fill="#94a3b8">чистый шум</text>

          <!-- Forward label -->
          <text x="240" y="20" text-anchor="middle" font-size="10" fill="#ef4444" font-weight="600">→ Forward process (добавляем шум) →</text>

          <!-- Reverse arrows -->
          <line x1="405" y1="100" x2="375" y2="100" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrRev)"/>
          <line x1="305" y1="100" x2="275" y2="100" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrRev)"/>
          <line x1="205" y1="100" x2="175" y2="100" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrRev)"/>
          <line x1="105" y1="100" x2="75" y2="100" stroke="#10b981" stroke-width="1.5" marker-end="url(#arrRev)"/>

          <text x="240" y="118" text-anchor="middle" font-size="10" fill="#10b981" font-weight="600">← Reverse process (убираем шум, нейросеть) ←</text>
        </svg>
        <div class="caption">Diffusion: прямой процесс (красный) постепенно добавляет гауссов шум за T шагов. Обратный процесс (зелёный) — нейросеть учится предсказывать шум и убирать его пошагово.</div>
      </div>

      <p><b>Формально (DDPM — Denoising Diffusion Probabilistic Model):</b></p>
      <ol>
        <li><b>Forward process</b> (фиксированный, не обучается): $q(x_t | x_{t-1}) = \\mathcal{N}(x_t; \\sqrt{1-\\beta_t}\\,x_{t-1},\\; \\beta_t I)$</li>
        <li>За $T$ шагов (обычно $T = 1000$) данные превращаются в чистый шум.</li>
        <li><b>Reverse process</b> (обучается): нейросеть $\\varepsilon_\\theta(x_t, t)$ предсказывает шум $\\varepsilon$, который был добавлен.</li>
        <li><b>Loss:</b> $\\mathcal{L} = \\mathbb{E}_{t, x_0, \\varepsilon}\\left[||\\varepsilon - \\varepsilon_\\theta(x_t, t)||^2\\right]$ — просто MSE между настоящим и предсказанным шумом.</li>
      </ol>

      <div class="why">Почему diffusion работает так хорошо? Потому что задача «предскажи шум» — очень простая и стабильная для обучения (в отличие от adversarial обучения GAN). Нейросеть не пытается генерировать всю картинку за раз — она делает маленький шаг (убирает чуть-чуть шума), и это повторяется 1000 раз. Каждый шаг — простая задача.</div>

      <h3>🔄 Flow-based Models (Нормализующие потоки)</h3>
      <p>Ещё один подход: строим <b>обратимое преобразование</b> между простым распределением $\\mathcal{N}(0, I)$ и сложным распределением данных. Каждый слой — биекция, которую можно обратить. Позволяет точно вычислять $\\log p(x)$, но архитектура ограничена требованием обратимости.</p>
      <p>Примеры: RealNVP, Glow. Менее популярны, чем Diffusion, но важны теоретически.</p>

      <h3>📊 Сравнение подходов</h3>
      <table>
        <thead>
          <tr>
            <th>Критерий</th>
            <th>VAE</th>
            <th>GAN</th>
            <th>Diffusion</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Качество генерации</b></td>
            <td>Среднее (размытые)</td>
            <td>Высокое (чёткие)</td>
            <td>Очень высокое</td>
          </tr>
          <tr>
            <td><b>Разнообразие</b></td>
            <td>Высокое</td>
            <td>Низкое (mode collapse)</td>
            <td>Высокое</td>
          </tr>
          <tr>
            <td><b>Стабильность обучения</b></td>
            <td>Стабильно</td>
            <td>Нестабильно</td>
            <td>Стабильно</td>
          </tr>
          <tr>
            <td><b>Скорость генерации</b></td>
            <td>Быстро (1 проход)</td>
            <td>Быстро (1 проход)</td>
            <td>Медленно (T шагов)</td>
          </tr>
          <tr>
            <td><b>Латентное пространство</b></td>
            <td>Структурировано</td>
            <td>Нет явного</td>
            <td>Нет явного</td>
          </tr>
          <tr>
            <td><b>Точная $\\log p(x)$</b></td>
            <td>Нижняя граница (ELBO)</td>
            <td>Нет</td>
            <td>Нижняя граница</td>
          </tr>
        </tbody>
      </table>

      <h3>🚀 Современные системы генерации</h3>
      <ul>
        <li><b>Stable Diffusion</b> — open-source модель генерации изображений. Использует Latent Diffusion (diffusion в латентном пространстве VAE, а не в пространстве пикселей — гораздо быстрее).</li>
        <li><b>DALL·E 2/3</b> (OpenAI) — text-to-image, комбинация CLIP + Diffusion.</li>
        <li><b>Midjourney</b> — коммерческая система, славится художественным стилем.</li>
        <li><b>StyleGAN</b> (NVIDIA) — лица, искусство, GAN-based, высочайшее качество для лиц.</li>
        <li><b>GPT, Claude</b> — авторегрессионные генеративные модели для текста (тоже генеративные!).</li>
        <li><b>Sora</b> (OpenAI) — генерация видео на основе diffusion-трансформеров.</li>
      </ul>

      <div class="key-concept">
        <div class="kc-label">Latent Diffusion — ключ к скорости</div>
        <p>Обычный Diffusion работает в пространстве пикселей (512×512×3 = 786 432 значения). Latent Diffusion сначала сжимает изображение с помощью VAE в латентное пространство (64×64×4 = 16 384 значения), а затем проводит diffusion там. Скорость возрастает в ~50 раз, а качество почти не страдает. Именно так работает Stable Diffusion.</p>
      </div>
    `,

    examples: [
      {
        title: 'GAN на числах: 5 шагов обучения',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как работает GAN на простейшем примере. Реальные данные — числа из распределения $\\mathcal{N}(5, 1)$ (среднее 5, стандартное отклонение 1). Генератор получает шум $z \\sim \\mathcal{N}(0, 1)$ и пытается генерировать числа, похожие на реальные. Дискриминатор пытается отличить реальные от фейковых.</p>
            <p>Генератор: $G(z) = a \\cdot z + b$ (линейное преобразование, начальные $a=1, b=0$).</p>
            <p>Дискриминатор: $D(x) = \\sigma(w \\cdot x + c)$ (линейный + <a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">сигмоида</a>, начальные $w=0.1, c=0$).</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Начальное состояние</h4>
            <div class="calc">
              Реальные данные: $x_{real} \\sim \\mathcal{N}(5, 1)$, допустим сэмпл: $[4.2, 5.8, 5.1, 4.7, 5.5]$<br>
              Шум: $z \\sim \\mathcal{N}(0, 1)$, сэмпл: $[-0.3, 1.2, 0.5, -0.8, 0.7]$<br><br>
              Генератор ($a=1, b=0$): $G(z) = 1 \\cdot z + 0 = z$<br>
              Фейковые данные: $[-0.3, 1.2, 0.5, -0.8, 0.7]$ — далеки от реальных (~5)!<br><br>
              Дискриминатор ($w=0.1, c=0$):<br>
              $D(4.2) = \\sigma(0.1 \\cdot 4.2 + 0) = \\sigma(0.42) = 0.603$ (реальное → хочет ~1)<br>
              $D(-0.3) = \\sigma(0.1 \\cdot (-0.3) + 0) = \\sigma(-0.03) = 0.493$ (фейковое → хочет ~0)
            </div>
            <div class="why">D пока почти ничего не различает (оба выхода ~0.5). G генерирует числа около 0, а нужно около 5. Обучение только начинается.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Обучаем Дискриминатор</h4>
            <div class="calc">
              Цель D: $\\max \\; \\log D(x_{real}) + \\log(1 - D(G(z)))$<br><br>
              Градиент по $w$: реальные данные (среднее ~5) дают $D \\to$ больше, фейковые (~0) дают $D \\to$ меньше<br>
              Обновление: $w: 0.1 \\to 0.3$, $c: 0 \\to -0.8$<br><br>
              Проверка: $D(5.0) = \\sigma(0.3 \\cdot 5 - 0.8) = \\sigma(0.7) = 0.668$ ✓ (реальное, ближе к 1)<br>
              $D(0.5) = \\sigma(0.3 \\cdot 0.5 - 0.8) = \\sigma(-0.65) = 0.343$ ✓ (фейковое, ближе к 0)
            </div>
            <div class="why">D научился различать: реальные (~5) получают более высокие оценки, фейковые (~0) — низкие. Теперь очередь G.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Обучаем Генератор</h4>
            <div class="calc">
              Цель G: $\\max \\; \\log D(G(z))$ — хочет, чтобы D считал фейки реальными.<br><br>
              Градиент по $a, b$: нужно сдвинуть $G(z)$ в область, где $D$ даёт высокие оценки (около 5).<br>
              Обновление: $a: 1 \\to 1.2$, $b: 0 \\to 1.5$<br><br>
              Новый $G(z)$: $G(0.5) = 1.2 \\cdot 0.5 + 1.5 = 2.1$ — уже ближе к 5!<br>
              $D(2.1) = \\sigma(0.3 \\cdot 2.1 - 0.8) = \\sigma(-0.17) = 0.458$ — D ещё распознаёт, но уже хуже.
            </div>
            <div class="why">G «сдвинул» свои выходы вправо (от ~0 к ~2). Ещё далеко от цели, но прогресс виден.</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Ещё раунд обучения D, затем G</h4>
            <div class="calc">
              D обновляется: $w: 0.3 \\to 0.45$, $c: -0.8 \\to -1.5$<br>
              Теперь $D(5) = \\sigma(0.45 \\cdot 5 - 1.5) = \\sigma(0.75) = 0.679$<br>
              $D(2.1) = \\sigma(0.45 \\cdot 2.1 - 1.5) = \\sigma(-0.555) = 0.365$<br><br>
              G обновляется: $a: 1.2 \\to 1.1$, $b: 1.5 \\to 3.2$<br>
              $G(0.5) = 1.1 \\cdot 0.5 + 3.2 = 3.75$ — ещё ближе к 5!<br>
              $D(3.75) = \\sigma(0.45 \\cdot 3.75 - 1.5) = \\sigma(0.1875) = 0.547$ — D уже сомневается!
            </div>
            <div class="why">Видно adversarial динамику: D становится умнее, но G тоже. Каждый раунд G приближается к реальному распределению.</div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Сходимость</h4>
            <div class="calc">
              После множества итераций:<br>
              $a \\approx 1.0$, $b \\approx 5.0$<br>
              $G(z) = 1.0 \\cdot z + 5.0$<br><br>
              Если $z \\sim \\mathcal{N}(0, 1)$, то $G(z) \\sim \\mathcal{N}(5, 1)$ — именно наше реальное распределение!<br><br>
              $D(x) \\approx 0.5$ для всех $x$ — Дискриминатор не может отличить реальные от фейковых.<br><br>
              Фейковые семплы: $[5.2, 4.3, 5.7, 4.9, 5.1]$ — неотличимы от реальных $[4.8, 5.3, 4.7, 5.5, 5.0]$ ✓
            </div>
            <div class="why">GAN достиг равновесия Нэша: G идеально имитирует распределение данных, D полностью «обманут» ($D = 0.5$). В реальности с изображениями сходимость намного сложнее, но принцип тот же.</div>
          </div>
        `
      },
      {
        title: 'VAE: латентное пространство',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Показать, как VAE кодирует 2D данные в 1D латентное пространство и как из него можно генерировать новые точки. Данные: кластеры точек двух классов — «кружки» вокруг $(2, 2)$ и «квадраты» вокруг $(8, 8)$.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Данные</h4>
            <div class="calc">
              Класс A (кружки): $(1.5, 2.3),\\; (2.1, 1.8),\\; (2.4, 2.5),\\; (1.8, 2.0)$<br>
              Класс B (квадраты): $(7.6, 8.2),\\; (8.3, 7.9),\\; (8.0, 8.5),\\; (7.8, 8.1)$<br><br>
              Входная размерность: 2. Латентная размерность: 1.
            </div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Encoder — из 2D в параметры распределения</h4>
            <div class="calc">
              Encoder выдаёт $\\mu$ и $\\log\\sigma^2$ для каждой точки:<br><br>
              Точка $(2.1, 1.8)$: $\\mu = -1.5$, $\\log\\sigma^2 = -1.0$ → $\\sigma = e^{-0.5} = 0.607$<br>
              Точка $(8.3, 7.9)$: $\\mu = 1.8$, $\\log\\sigma^2 = -0.8$ → $\\sigma = e^{-0.4} = 0.670$<br><br>
              Класс A кодируется в $z \\approx -1.5$ (отрицательная часть латентной оси).<br>
              Класс B кодируется в $z \\approx +1.8$ (положительная часть).
            </div>
            <div class="why">Encoder научился организовывать латентное пространство: похожие данные — рядом, разные — далеко. Но это не просто точки, а распределения — «облака» в 1D.</div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Reparameterization trick — сэмплирование</h4>
            <div class="calc">
              Для точки $(2.1, 1.8)$: $\\mu = -1.5$, $\\sigma = 0.607$<br>
              Сэмплируем $\\varepsilon \\sim \\mathcal{N}(0, 1)$, допустим $\\varepsilon = 0.4$<br>
              $z = \\mu + \\sigma \\cdot \\varepsilon = -1.5 + 0.607 \\cdot 0.4 = -1.257$<br><br>
              Для точки $(8.3, 7.9)$: $\\mu = 1.8$, $\\sigma = 0.670$<br>
              $\\varepsilon = -0.2$<br>
              $z = 1.8 + 0.670 \\cdot (-0.2) = 1.666$
            </div>
            <div class="why">Reparameterization trick: вместо «сэмплировать из $\\mathcal{N}(-1.5, 0.607^2)$» мы делаем $z = -1.5 + 0.607 \\cdot \\varepsilon$. Формально то же самое, но теперь можно дифференцировать по $\\mu$ и $\\sigma$!</div>
          </div>

          <div class="step" data-step="4">
            <h4>Шаг 4: Decoder — из 1D обратно в 2D</h4>
            <div class="calc">
              Decoder принимает $z$ и восстанавливает 2D координаты:<br><br>
              $z = -1.257$ → Decoder → $\\hat{x} = (2.0, 1.9)$ (исходное: $(2.1, 1.8)$, ошибка мала)<br>
              $z = 1.666$ → Decoder → $\\hat{x} = (8.1, 8.0)$ (исходное: $(8.3, 7.9)$, тоже хорошо)<br><br>
              Reconstruction loss: $||x - \\hat{x}||^2 = (2.1-2.0)^2 + (1.8-1.9)^2 = 0.01 + 0.01 = 0.02$ ✓
            </div>
          </div>

          <div class="step" data-step="5">
            <h4>Шаг 5: Генерация новых точек!</h4>
            <div class="calc">
              Берём случайные $z$ из латентного пространства и декодируем:<br><br>
              $z = -1.0$ → Decoder → $(2.3, 2.1)$ — новый «кружок»! ✓<br>
              $z = 2.0$ → Decoder → $(8.5, 8.3)$ — новый «квадрат»! ✓<br>
              $z = 0.0$ → Decoder → $(5.1, 5.0)$ — <b>промежуточная точка</b> (между классами)!<br>
              $z = 0.5$ → Decoder → $(5.9, 5.7)$ — тоже переходная.<br><br>
              Это называется <b>интерполяция в латентном пространстве</b>: плавно перемещаясь от $z=-1.5$ к $z=1.8$, мы видим плавный переход от одного класса к другому.
            </div>
            <div class="why">В этом сила VAE: латентное пространство непрерывно и осмысленно. Любая точка $z$ даёт что-то разумное. У обычного автоэнкодера «промежуточные» точки давали бы мусор, потому что пространство не структурировано KL-регуляризацией.</div>
          </div>
        `
      },
      {
        title: 'Diffusion: пошаговое зашумление и восстановление',
        content: `
          <div class="example-problem">
            <div class="problem-label">Задача</div>
            <p>Взять простой сигнал (вектор из 4 чисел), добавить шум за 5 шагов (forward process), затем восстановить за 5 шагов (reverse process). Показать каждый шаг.</p>
            <p>Исходный сигнал: $x_0 = [3.0, 7.0, 1.0, 5.0]$. Уровень шума $\\beta_t = 0.2$ на каждом шаге.</p>
          </div>

          <div class="step" data-step="1">
            <h4>Шаг 1: Forward process — добавляем шум</h4>
            <p>Формула: $x_t = \\sqrt{1 - \\beta_t} \\cdot x_{t-1} + \\sqrt{\\beta_t} \\cdot \\varepsilon_t$, где $\\varepsilon_t \\sim \\mathcal{N}(0, I)$.</p>
            <p>С $\\beta = 0.2$: $\\sqrt{1-\\beta} = \\sqrt{0.8} = 0.894$, $\\sqrt{\\beta} = \\sqrt{0.2} = 0.447$.</p>
            <div class="calc">
              <b>t=0 → t=1:</b> $\\varepsilon_1 = [0.5, -0.3, 1.2, -0.8]$<br>
              $x_1 = 0.894 \\cdot [3.0, 7.0, 1.0, 5.0] + 0.447 \\cdot [0.5, -0.3, 1.2, -0.8]$<br>
              $x_1 = [2.682, 6.258, 0.894, 4.470] + [0.224, -0.134, 0.536, -0.358]$<br>
              $x_1 = [2.906, 6.124, 1.430, 4.112]$<br><br>

              <b>t=1 → t=2:</b> $\\varepsilon_2 = [-0.7, 0.9, -0.1, 0.6]$<br>
              $x_2 = 0.894 \\cdot [2.906, 6.124, 1.430, 4.112] + 0.447 \\cdot [-0.7, 0.9, -0.1, 0.6]$<br>
              $x_2 = [2.598, 5.475, 1.278, 3.676] + [-0.313, 0.402, -0.045, 0.268]$<br>
              $x_2 = [2.285, 5.877, 1.233, 3.944]$<br><br>

              <b>t=2 → t=3:</b> $\\varepsilon_3 = [1.1, -1.0, 0.3, 0.2]$<br>
              $x_3 = 0.894 \\cdot x_2 + 0.447 \\cdot \\varepsilon_3$<br>
              $x_3 = [2.043, 5.254, 1.102, 3.526] + [0.492, -0.447, 0.134, 0.089]$<br>
              $x_3 = [2.535, 4.807, 1.236, 3.615]$<br><br>

              <b>t=3 → t=4:</b> $\\varepsilon_4 = [-0.2, 0.4, -1.5, 1.3]$<br>
              $x_4 = 0.894 \\cdot x_3 + 0.447 \\cdot \\varepsilon_4$<br>
              $x_4 = [2.266, 4.297, 1.105, 3.232] + [-0.089, 0.179, -0.671, 0.581]$<br>
              $x_4 = [2.177, 4.476, 0.434, 3.813]$<br><br>

              <b>t=4 → t=5:</b> $\\varepsilon_5 = [0.8, -0.6, 0.9, -1.1]$<br>
              $x_5 = 0.894 \\cdot x_4 + 0.447 \\cdot \\varepsilon_5$<br>
              $x_5 = [1.946, 4.002, 0.388, 3.409] + [0.358, -0.268, 0.402, -0.492]$<br>
              $x_5 = [2.304, 3.734, 0.790, 2.917]$
            </div>
            <div class="why">С каждым шагом сигнал всё больше зашумляется. Исходный $[3, 7, 1, 5]$ превратился в $[2.3, 3.7, 0.8, 2.9]$ — структура ещё видна, но уже размыта. За 1000 шагов (как в реальном DDPM) сигнал стал бы чистым шумом $\\sim \\mathcal{N}(0, I)$.</div>
          </div>

          <div class="step" data-step="2">
            <h4>Шаг 2: Что видит нейросеть?</h4>
            <div class="calc">
              На каждом шаге $t$ нейросеть $\\varepsilon_\\theta$ получает:<br>
              — зашумлённый сигнал $x_t$<br>
              — номер шага $t$<br><br>
              И должна предсказать: какой шум $\\varepsilon$ был добавлен.<br><br>
              Пример: на шаге $t=3$ сеть получает $x_3 = [2.535, 4.807, 1.236, 3.615]$ и $t=3$.<br>
              Истинный шум: $\\varepsilon_3 = [1.1, -1.0, 0.3, 0.2]$.<br>
              Предсказание сети: $\\hat{\\varepsilon}_3 = [0.9, -0.8, 0.4, 0.1]$ (не идеально, но близко).<br><br>
              Loss = $||\\varepsilon_3 - \\hat{\\varepsilon}_3||^2 = (0.2)^2 + (-0.2)^2 + (-0.1)^2 + (0.1)^2 = 0.10$
            </div>
          </div>

          <div class="step" data-step="3">
            <h4>Шаг 3: Reverse process — убираем шум</h4>
            <p>Начинаем с $x_5 = [2.304, 3.734, 0.790, 2.917]$ и идём обратно.</p>
            <p>Упрощённая формула: $x_{t-1} = \\frac{1}{\\sqrt{1-\\beta}} \\left(x_t - \\frac{\\beta}{\\sqrt{1-\\bar\\alpha_t}} \\hat\\varepsilon_\\theta(x_t, t)\\right) + \\sigma_t z$</p>
            <p>Для нашего примера упростим: $x_{t-1} \\approx \\frac{x_t - \\sqrt{\\beta} \\cdot \\hat{\\varepsilon}}{\\sqrt{1-\\beta}}$</p>
            <div class="calc">
              <b>t=5 → t=4:</b> Сеть предсказывает $\\hat{\\varepsilon}_5 = [0.7, -0.5, 0.8, -1.0]$<br>
              $x_4' = \\frac{[2.304, 3.734, 0.790, 2.917] - 0.447 \\cdot [0.7, -0.5, 0.8, -1.0]}{0.894}$<br>
              $x_4' = \\frac{[1.991, 3.958, 0.432, 3.364]}{0.894} = [2.227, 4.428, 0.483, 3.764]$<br>
              Настоящее $x_4 = [2.177, 4.476, 0.434, 3.813]$ — близко! ✓<br><br>

              <b>t=4 → t=3:</b> $\\hat{\\varepsilon}_4 = [-0.3, 0.5, -1.4, 1.2]$<br>
              $x_3' = \\frac{x_4' - 0.447 \\cdot \\hat{\\varepsilon}_4}{0.894} = [2.640, 4.703, 1.241, 3.611]$<br>
              Настоящее $x_3 = [2.535, 4.807, 1.236, 3.615]$ — тоже близко! ✓<br><br>

              <b>t=3 → t=2:</b> $x_2' = [2.350, 5.790, 1.180, 3.900]$ (настоящее: $[2.285, 5.877, 1.233, 3.944]$)<br>
              <b>t=2 → t=1:</b> $x_1' = [2.950, 6.050, 1.480, 4.150]$ (настоящее: $[2.906, 6.124, 1.430, 4.112]$)<br>
              <b>t=1 → t=0:</b> $x_0' = [3.1, 6.9, 1.1, 4.9]$<br><br>

              Восстановленный: $[3.1, 6.9, 1.1, 4.9]$<br>
              Исходный: $\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;[3.0, 7.0, 1.0, 5.0]$<br>
              Ошибка: $\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;\\;[0.1, 0.1, 0.1, 0.1]$ — отлично! ✓
            </div>
            <div class="why">Reverse process пошагово восстановил сигнал! На каждом шаге нейросеть предсказывала шум не идеально, но достаточно точно. В реальных Diffusion моделях с 1000 шагами и мощными U-Net/Transformer архитектурами качество восстановления поразительно — именно так генерируются фотореалистичные изображения из чистого шума.</div>
          </div>
        `
      }
    ],

    simulation: [
      {
        title: 'VAE latent space',
        html: `
          <h3>Навигация по латентному пространству VAE</h3>
          <p>Обучаем упрощённый VAE на наборе «цифр» (2D-векторов формы). Каждый объект кодируется в точку $z \\in \\mathbb{R}^2$. Двигай слайдеры — смотри, как меняется декодированная форма. Непрерывность латента — ключевое свойство VAE.</p>
          <div class="sim-container">
            <div class="sim-controls" id="gm-controls"></div>
            <div class="sim-output">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                <div>
                  <p style="font-size:12px;font-weight:600;color:#475569;margin-bottom:4px;">Латентное пространство</p>
                  <div style="height:320px;"><canvas id="gm-latent" class="sim-canvas"></canvas></div>
                </div>
                <div>
                  <p style="font-size:12px;font-weight:600;color:#475569;margin-bottom:4px;">Декодированная форма</p>
                  <div style="height:320px;"><canvas id="gm-decode" class="sim-canvas"></canvas></div>
                </div>
              </div>
              <div class="sim-stats" id="gm-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#gm-controls');
          const cZ1 = App.makeControl('range', 'gm-z1', 'z₁', { min: -3, max: 3, step: 0.05, value: 0 });
          const cZ2 = App.makeControl('range', 'gm-z2', 'z₂', { min: -3, max: 3, step: 0.05, value: 0 });
          [cZ1, cZ2].forEach(c => controls.appendChild(c.wrap));

          // Prototype shapes — каждая форма = набор точек на единичной окружности с искажениями
          // Представляем 4 «класса» объектов, расположенных в квадрате латента
          // Декодер: интерполирует между прототипами весами по расстоянию (мягкий RBF)
          const prototypes = [
            // "О" — круг
            { z: [-1.5, 1.5], shape: Array.from({ length: 24 }, (_, i) => {
              const t = (i / 24) * 2 * Math.PI; return [Math.cos(t), Math.sin(t)];
            }) },
            // "▢" — квадрат
            { z: [1.5, 1.5], shape: Array.from({ length: 24 }, (_, i) => {
              const t = i / 24; const s = 4 * t;
              if (s < 1) return [s - 0.5, -0.5];
              if (s < 2) return [0.5, s - 1.5];
              if (s < 3) return [0.5 - (s - 2), 0.5];
              return [-0.5, 0.5 - (s - 3)];
            }).map(([x, y]) => [x * 1.5, y * 1.5]) },
            // "△" — треугольник
            { z: [1.5, -1.5], shape: Array.from({ length: 24 }, (_, i) => {
              const t = i / 24; const s = 3 * t;
              if (s < 1) return [s - 0.5, -0.5];
              if (s < 2) return [0.5 - (s - 1) * 0.5, -0.5 + (s - 1)];
              return [-0.5 + (3 - s) * 0.5 * 0, -0.5 + (3 - s)];
            }).map(([x, y]) => [x * 1.3, y * 1.3 - 0.2]) },
            // "✦" — звезда
            { z: [-1.5, -1.5], shape: Array.from({ length: 24 }, (_, i) => {
              const t = (i / 24) * 2 * Math.PI;
              const r = 1 + 0.5 * Math.cos(5 * t);
              return [r * Math.cos(t), r * Math.sin(t)];
            }) },
          ];

          function decode(z) {
            // soft mixing through Gaussian weights in latent space
            const weights = prototypes.map(p => Math.exp(-0.8 * ((p.z[0] - z[0]) ** 2 + (p.z[1] - z[1]) ** 2)));
            const W = weights.reduce((a, b) => a + b, 0);
            const nW = weights.map(w => w / W);
            const n = prototypes[0].shape.length;
            const out = [];
            for (let i = 0; i < n; i++) {
              let x = 0, y = 0;
              prototypes.forEach((p, k) => {
                x += nW[k] * p.shape[i][0];
                y += nW[k] * p.shape[i][1];
              });
              out.push([x, y]);
            }
            return { shape: out, weights: nW };
          }

          const canvasL = container.querySelector('#gm-latent');
          const ctxL = canvasL.getContext('2d');
          const canvasD = container.querySelector('#gm-decode');
          const ctxD = canvasD.getContext('2d');

          function resize() {
            [canvasL, canvasD].forEach(c => {
              const r = c.getBoundingClientRect();
              c.width = r.width; c.height = r.height;
            });
            draw();
          }

          function draw() {
            const z = [+cZ1.input.value, +cZ2.input.value];
            // Latent
            const W = canvasL.width, H = canvasL.height;
            ctxL.clearRect(0, 0, W, H);
            const toCL = (x, y) => [W / 2 + x * W / 8, H / 2 - y * H / 8];
            // axes
            ctxL.strokeStyle = '#e5e7eb'; ctxL.lineWidth = 1;
            for (let g = -3; g <= 3; g++) {
              const [x1, y1] = toCL(g, -3);
              const [x2, y2] = toCL(g, 3);
              ctxL.beginPath(); ctxL.moveTo(x1, y1); ctxL.lineTo(x2, y2); ctxL.stroke();
              const [x3, y3] = toCL(-3, g);
              const [x4, y4] = toCL(3, g);
              ctxL.beginPath(); ctxL.moveTo(x3, y3); ctxL.lineTo(x4, y4); ctxL.stroke();
            }
            // prototypes
            const labels = ['О', '▢', '△', '✦'];
            const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'];
            prototypes.forEach((p, i) => {
              const [cx, cy] = toCL(p.z[0], p.z[1]);
              ctxL.fillStyle = colors[i];
              ctxL.beginPath(); ctxL.arc(cx, cy, 10, 0, 2 * Math.PI); ctxL.fill();
              ctxL.fillStyle = '#fff';
              ctxL.font = 'bold 13px sans-serif';
              ctxL.textAlign = 'center'; ctxL.textBaseline = 'middle';
              ctxL.fillText(labels[i], cx, cy);
            });
            // current z
            const [cx, cy] = toCL(z[0], z[1]);
            ctxL.strokeStyle = '#dc2626'; ctxL.lineWidth = 3;
            ctxL.beginPath(); ctxL.arc(cx, cy, 14, 0, 2 * Math.PI); ctxL.stroke();
            ctxL.fillStyle = '#dc2626';
            ctxL.beginPath(); ctxL.arc(cx, cy, 4, 0, 2 * Math.PI); ctxL.fill();

            // Decoder output
            const Wd = canvasD.width, Hd = canvasD.height;
            ctxD.clearRect(0, 0, Wd, Hd);
            const { shape, weights } = decode(z);
            const scale = Math.min(Wd, Hd) * 0.35;
            const cxd = Wd / 2, cyd = Hd / 2;
            // blended color
            let rC = 0, gC = 0, bC = 0;
            const pal = [[239, 68, 68], [16, 185, 129], [59, 130, 246], [245, 158, 11]];
            weights.forEach((w, i) => { rC += w * pal[i][0]; gC += w * pal[i][1]; bC += w * pal[i][2]; });
            ctxD.strokeStyle = `rgb(${Math.round(rC)},${Math.round(gC)},${Math.round(bC)})`;
            ctxD.fillStyle = `rgba(${Math.round(rC)},${Math.round(gC)},${Math.round(bC)},0.25)`;
            ctxD.lineWidth = 4;
            ctxD.beginPath();
            shape.forEach(([x, y], i) => {
              const px = cxd + x * scale, py = cyd - y * scale;
              if (i === 0) ctxD.moveTo(px, py); else ctxD.lineTo(px, py);
            });
            ctxD.closePath();
            ctxD.fill();
            ctxD.stroke();

            container.querySelector('#gm-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">z₁</div><div class="stat-value">${z[0].toFixed(2)}</div></div>
              <div class="stat-card"><div class="stat-label">z₂</div><div class="stat-value">${z[1].toFixed(2)}</div></div>
              <div class="stat-card"><div class="stat-label">Ближайший прототип</div><div class="stat-value">${labels[weights.indexOf(Math.max(...weights))]}</div></div>
              <div class="stat-card"><div class="stat-label">Уверенность</div><div class="stat-value">${(Math.max(...weights) * 100).toFixed(0)}%</div></div>
            `;
          }

          [cZ1, cZ2].forEach(c => c.input.addEventListener('input', draw));
          setTimeout(resize, 50);
          window.addEventListener('resize', resize);
        },
      },
      {
        title: 'GAN: генератор vs дискриминатор',
        html: `
          <h3>Динамика обучения GAN (упрощённо, 1D)</h3>
          <p>Реальные данные — смесь двух гауссов. Генератор $G(z)$ преобразует шум $z \\sim \\mathcal{N}(0,1)$ в точку. Дискриминатор $D(x)$ пытается отличить реальные от сгенерированных. На каждом шаге показаны плотность реального распределения, fake-распределения и решение дискриминатора.</p>
          <div class="sim-container">
            <div class="sim-controls" id="gng-controls"></div>
            <div class="sim-buttons">
              <button class="btn" id="gng-run">▶ +100 шагов</button>
              <button class="btn secondary" id="gng-reset">↺ Сброс</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="gng-chart"></canvas></div>
              <div class="sim-stats" id="gng-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#gng-controls');
          const cLR = App.makeControl('range', 'gng-lr', 'Learning rate', { min: 0.005, max: 0.1, step: 0.005, value: 0.03 });
          const cDsteps = App.makeControl('range', 'gng-d', 'D обновлений на шаг', { min: 1, max: 5, step: 1, value: 1 });
          [cLR, cDsteps].forEach(c => controls.appendChild(c.wrap));

          // Simple 1D model
          // G: z ~ N(0,1) → x = a*z + b (learnable a, b) — по сути сеть учит среднее и дисперсию fake-распределения
          // D: logistic regression over single feature x, parameters (w, c)
          let a = 0.5, b = 0, Dw = 0.1, Dc = 0;
          let iter = 0;
          let chart = null;

          function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

          // Real distribution: mixture of two Gaussians
          function sampleReal() {
            if (Math.random() < 0.5) return App.Util.randn(0, 0.4) + (-1.5);
            return App.Util.randn(0, 0.4) + 1.5;
          }
          function realPdf(x) {
            const g = (mu, s) => Math.exp(-((x - mu) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
            return 0.5 * g(-1.5, 0.4) + 0.5 * g(1.5, 0.4);
          }
          function fakePdf(x) {
            // x = a*z + b, z ~ N(0,1) → fake ~ N(b, a²)
            if (Math.abs(a) < 1e-6) return 0;
            return Math.exp(-((x - b) ** 2) / (2 * a * a)) / (Math.abs(a) * Math.sqrt(2 * Math.PI));
          }

          function trainStep() {
            const lr = +cLR.input.value;
            const dSteps = +cDsteps.input.value;
            const batch = 32;
            // Train D
            for (let k = 0; k < dSteps; k++) {
              let dw = 0, dc = 0;
              for (let i = 0; i < batch; i++) {
                const xr = sampleReal();
                const z = App.Util.randn(0, 1);
                const xf = a * z + b;
                // loss = -log D(xr) - log(1 - D(xf))
                const Dr = sigmoid(Dw * xr + Dc);
                const Df = sigmoid(Dw * xf + Dc);
                // gradient of -log D(xr) wrt (Dw,Dc): -(1-Dr)*xr
                dw += -(1 - Dr) * xr + Df * xf;
                dc += -(1 - Dr) + Df;
              }
              Dw -= lr * dw / batch;
              Dc -= lr * dc / batch;
            }
            // Train G — maximize log D(G(z)) → minimize -log D(xf)
            let ga = 0, gb = 0;
            for (let i = 0; i < batch; i++) {
              const z = App.Util.randn(0, 1);
              const xf = a * z + b;
              const Df = sigmoid(Dw * xf + Dc);
              // d(-log Df)/d xf = -(1 - Df) * Dw
              const dxf = -(1 - Df) * Dw;
              ga += dxf * z;
              gb += dxf;
            }
            a -= lr * ga / batch;
            b -= lr * gb / batch;
            iter++;
          }

          function run(n) { for (let i = 0; i < n; i++) trainStep(); draw(); }

          function reset() {
            a = 0.3 + Math.random() * 0.4;
            b = (Math.random() - 0.5) * 3;
            Dw = 0.1; Dc = 0;
            iter = 0;
            draw();
          }

          function draw() {
            const xs = [];
            const real = [], fake = [], disc = [];
            for (let x = -4; x <= 4; x += 0.1) {
              xs.push(+x.toFixed(2));
              real.push(realPdf(x));
              fake.push(fakePdf(x));
              disc.push(sigmoid(Dw * x + Dc));
            }
            const ctx = container.querySelector('#gng-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: xs,
                datasets: [
                  { label: 'Реальные p(x)', data: real, borderColor: '#10b981', borderWidth: 2.5, pointRadius: 0, fill: true, backgroundColor: 'rgba(16,185,129,0.15)' },
                  { label: 'Fake q(x)', data: fake, borderColor: '#ef4444', borderWidth: 2.5, pointRadius: 0, fill: true, backgroundColor: 'rgba(239,68,68,0.15)' },
                  { label: 'D(x) (prob real)', data: disc, borderColor: '#3b82f6', borderWidth: 2, borderDash: [5, 5], pointRadius: 0, fill: false, yAxisID: 'y2' },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: `Итерация ${iter}` } },
                scales: {
                  x: { title: { display: true, text: 'x' } },
                  y: { title: { display: true, text: 'плотность' }, min: 0 },
                  y2: { position: 'right', min: 0, max: 1, title: { display: true, text: 'D(x)' }, grid: { drawOnChartArea: false } },
                },
              },
            });
            App.registerChart(chart);

            container.querySelector('#gng-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Итерация</div><div class="stat-value">${iter}</div></div>
              <div class="stat-card"><div class="stat-label">a (G std)</div><div class="stat-value">${a.toFixed(2)}</div></div>
              <div class="stat-card"><div class="stat-label">b (G mean)</div><div class="stat-value">${b.toFixed(2)}</div></div>
              <div class="stat-card"><div class="stat-label">D веса</div><div class="stat-value">w=${Dw.toFixed(2)}, c=${Dc.toFixed(2)}</div></div>
            `;
          }

          container.querySelector('#gng-run').onclick = () => run(100);
          container.querySelector('#gng-reset').onclick = reset;
          reset();
        },
      },
      {
        title: 'Diffusion denoising',
        html: `
          <h3>Diffusion: пошаговое очищение от шума</h3>
          <p>Стартуем с чистого шума и за $T$ шагов восстанавливаем целевой сигнал. На каждом шаге убираем небольшую часть предсказанного шума. Выбери целевую форму и число шагов.</p>
          <div class="sim-container">
            <div class="sim-controls" id="gmd-controls"></div>
            <div class="sim-buttons">
              <button class="btn" id="gmd-run">▶ Запустить денойзинг</button>
              <button class="btn secondary" id="gmd-noise">↺ Новый шум</button>
            </div>
            <div class="sim-output">
              <div class="sim-chart-wrap" style="height:320px;"><canvas id="gmd-chart"></canvas></div>
              <div class="sim-stats" id="gmd-stats"></div>
            </div>
          </div>
        `,
        init(container) {
          const controls = container.querySelector('#gmd-controls');
          const cTarget = App.makeControl('select', 'gmd-t', 'Цель', {
            options: [
              { value: 'sin', label: 'sin(x)' },
              { value: 'step', label: 'Ступенька' },
              { value: 'bump', label: 'Гауссов пик' },
              { value: 'zigzag', label: 'Пила' },
            ],
            value: 'sin',
          });
          const cSteps = App.makeControl('range', 'gmd-steps', 'Шагов T', { min: 5, max: 60, step: 1, value: 20 });
          const cSpeed = App.makeControl('range', 'gmd-speed', 'Интервал (мс)', { min: 20, max: 300, step: 10, value: 80 });
          [cTarget, cSteps, cSpeed].forEach(c => controls.appendChild(c.wrap));

          const N = 60;
          let noiseVec = new Array(N).fill(0).map(() => App.Util.randn(0, 1));
          let currentX = [...noiseVec];
          let chart = null;
          let timer = null;
          let stepIdx = 0;

          function target() {
            const type = cTarget.input.value;
            const out = new Array(N);
            for (let i = 0; i < N; i++) {
              const x = (i / (N - 1)) * 4 * Math.PI - 2 * Math.PI;
              if (type === 'sin') out[i] = Math.sin(x) * 1.5;
              else if (type === 'step') out[i] = x < 0 ? -1 : 1;
              else if (type === 'bump') out[i] = 2 * Math.exp(-x * x / 2);
              else out[i] = ((i % 10) / 10 - 0.5) * 2;
            }
            return out;
          }

          function regenNoise() {
            noiseVec = new Array(N).fill(0).map(() => App.Util.randn(0, 1.5));
            currentX = [...noiseVec];
            stepIdx = 0;
            draw();
          }

          function doStep() {
            const T = +cSteps.input.value;
            if (stepIdx >= T) { timer = null; return; }
            const alpha = (stepIdx + 1) / T;
            const tgt = target();
            for (let i = 0; i < N; i++) {
              const noise = currentX[i] - tgt[i];
              currentX[i] -= noise * (1 / (T - stepIdx));
              currentX[i] += App.Util.randn(0, 0.03 * (1 - alpha));
            }
            stepIdx++;
            draw();
            timer = setTimeout(doStep, +cSpeed.input.value);
          }

          function run() {
            if (timer) { clearTimeout(timer); timer = null; }
            currentX = [...noiseVec];
            stepIdx = 0;
            doStep();
          }

          function draw() {
            const labels = Array.from({ length: N }, (_, i) => i);
            const ctx = container.querySelector('#gmd-chart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels,
                datasets: [
                  { label: 'Цель', data: target(), borderColor: '#10b981', borderWidth: 2, borderDash: [5, 5], pointRadius: 0, fill: false },
                  { label: `Текущее (шаг ${stepIdx}/${cSteps.input.value})`, data: [...currentX], borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 0, fill: false },
                ],
              },
              options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Reverse diffusion: шум → сигнал' } },
                scales: { x: { title: { display: true, text: 'i' } }, y: { suggestedMin: -3, suggestedMax: 3 } },
              },
            });
            App.registerChart(chart);

            let mse = 0;
            const tgt = target();
            for (let i = 0; i < N; i++) mse += (currentX[i] - tgt[i]) ** 2;
            mse /= N;
            container.querySelector('#gmd-stats').innerHTML = `
              <div class="stat-card"><div class="stat-label">Шаг</div><div class="stat-value">${stepIdx}/${cSteps.input.value}</div></div>
              <div class="stat-card"><div class="stat-label">MSE к цели</div><div class="stat-value">${mse.toFixed(3)}</div></div>
              <div class="stat-card"><div class="stat-label">Точек</div><div class="stat-value">${N}</div></div>
            `;
          }

          cTarget.input.addEventListener('change', () => { if (timer) { clearTimeout(timer); timer = null; } draw(); });
          container.querySelector('#gmd-run').onclick = run;
          container.querySelector('#gmd-noise').onclick = regenNoise;
          regenNoise();
        },
      },
    ],

    python: `
      <h3>Генеративные модели на Python</h3>
      <p>Три подхода: простой GAN на PyTorch, скетч VAE и генерация изображений через HuggingFace Diffusers.</p>

      <h4>1. Простой GAN на PyTorch (генерация 1D распределения)</h4>
      <pre><code>import torch
import torch.nn as nn
import torch.optim as optim

# Реальные данные: числа из N(5, 1)
def real_data(n):
    return torch.randn(n, 1) * 1.0 + 5.0

# Генератор: шум → данные
class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, 16),
            nn.<a class="glossary-link" onclick="App.selectTopic('glossary-activations')">ReLU</a>(),
            nn.Linear(16, 1)
        )
    def forward(self, z):
        return self.net(z)

# Дискриминатор: данные → вероятность "реальности"
class Discriminator(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.<a class="glossary-link" onclick="App.selectTopic('glossary-sigmoid-softmax')">Sigmoid</a>()
        )
    def forward(self, x):
        return self.net(x)

G = Generator()
D = Discriminator()
opt_G = optim.Adam(G.parameters(), lr=0.001)
opt_D = optim.Adam(D.parameters(), lr=0.001)
criterion = nn.BCELoss()

# Обучение
for epoch in range(2000):
    # --- Обучаем Дискриминатор ---
    real = real_data(64)
    z = torch.randn(64, 1)
    fake = G(z).detach()  # detach: не обновляем G

    loss_D = criterion(D(real), torch.ones(64, 1)) + \\
             criterion(D(fake), torch.zeros(64, 1))
    opt_D.zero_grad()
    loss_D.backward()
    opt_D.step()

    # --- Обучаем Генератор ---
    z = torch.randn(64, 1)
    fake = G(z)
    loss_G = criterion(D(fake), torch.ones(64, 1))  # хотим D(fake)→1
    opt_G.zero_grad()
    loss_G.backward()
    opt_G.step()

# Генерация
with torch.no_grad():
    samples = G(torch.randn(1000, 1))
    print(f"Среднее: {samples.mean():.2f}, Std: {samples.std():.2f}")
    # Ожидаем: ~5.0 и ~1.0 — как у реальных данных
</code></pre>

      <h4>2. VAE — скетч на PyTorch</h4>
      <pre><code>import torch
import torch.nn as nn
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, input_dim=784, latent_dim=2):
        super().__init__()
        # Encoder
        self.fc1 = nn.Linear(input_dim, 256)
        self.fc_mu = nn.Linear(256, latent_dim)
        self.fc_logvar = nn.Linear(256, latent_dim)
        # Decoder
        self.fc3 = nn.Linear(latent_dim, 256)
        self.fc4 = nn.Linear(256, input_dim)

    def encode(self, x):
        h = F.relu(self.fc1(x))
        return self.fc_mu(h), self.fc_logvar(h)

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)       # σ = exp(logvar/2)
        eps = torch.randn_like(std)          # ε ~ N(0, I)
        return mu + std * eps                # z = μ + σ·ε

    def decode(self, z):
        h = F.relu(self.fc3(z))
        return torch.sigmoid(self.fc4(h))    # выход [0, 1]

    def forward(self, x):
        mu, logvar = self.encode(x)
        z = self.reparameterize(mu, logvar)
        return self.decode(z), mu, logvar

def vae_loss(recon_x, x, mu, logvar):
    # Reconstruction loss (binary cross-entropy)
    BCE = F.binary_cross_entropy(recon_x, x, reduction='sum')
    # KL divergence: D_KL(N(μ, σ²) || N(0, 1))
    KLD = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    return BCE + KLD

# Обучение (на MNIST):
# model = VAE()
# optimizer = optim.Adam(model.parameters(), lr=1e-3)
# for epoch in range(20):
#     for batch in dataloader:
#         recon, mu, logvar = model(batch)
#         loss = vae_loss(recon, batch, mu, logvar)
#         optimizer.zero_grad()
#         loss.backward()
#         optimizer.step()
#
# Генерация:
# z = torch.randn(16, 2)          # случайные точки в латентном пространстве
# generated = model.decode(z)      # → 16 новых «цифр»
</code></pre>

      <h4>3. Генерация изображений через HuggingFace Diffusers</h4>
      <pre><code># pip install diffusers transformers accelerate torch

from diffusers import StableDiffusionPipeline
import torch

# Загрузка модели (Stable Diffusion v2.1)
pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-1",
    torch_dtype=torch.float16
)
pipe = pipe.to("cuda")

# Генерация по текстовому описанию
prompt = "A cute cat sitting on a pile of books, digital art, detailed"
image = pipe(prompt, num_inference_steps=50).images[0]
image.save("cat_on_books.png")

# Параметры генерации:
# - num_inference_steps: больше шагов → лучше качество, медленнее
# - guidance_scale: сила следования prompt (7-12 обычно)
# - negative_prompt: что НЕ хотим видеть
image = pipe(
    prompt="A beautiful landscape, mountains, sunset",
    negative_prompt="blurry, low quality, distorted",
    num_inference_steps=30,
    guidance_scale=7.5
).images[0]
</code></pre>

      <h4>4. Быстрая генерация текста (авторегрессионная генеративная модель)</h4>
      <pre><code>from transformers import pipeline

# GPT-2 — генеративная модель текста
generator = pipeline("text-generation", model="gpt2")
result = generator(
    "Генеративные модели в машинном обучении",
    max_length=100,
    num_return_sequences=1,
    temperature=0.7    # < 1 → более детерминированно
)
print(result[0]["generated_text"])
</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Генерация изображений через Diffusion.</b> Stable Diffusion, DALL·E 3, Midjourney, Flux — основа современного text-to-image. Используется в дизайне, рекламе, концепт-арте, генерации стоковых иллюстраций, персонализации контента.</li>
        <li><b>Генерация текста через авторегрессионные LLM.</b> GPT-4, Claude, Gemini — технически тоже генеративные модели (условная вероятность следующего токена). Чат-боты, помощники, генерация кода, summarization, перевод.</li>
        <li><b>Редактирование изображений.</b> Inpainting (Photoshop Generative Fill), outpainting, style transfer, super-resolution, удаление объектов. Diffusion-модели с масками стали стандартом в профессиональных редакторах.</li>
        <li><b>Генерация видео и 3D.</b> Sora, Runway Gen-3, Veo — diffusion на видео-кадрах с temporal attention. Point-E, DreamFusion — генерация 3D-моделей из текста. Применяется в геймдеве, VFX, virtual production.</li>
        <li><b>Генерация аудио и клонирование голоса.</b> MusicGen, Suno, ElevenLabs, Bark — генерация музыки, озвучки, речи по описанию или референсу. Используется в дубляже, подкастах, accessibility-инструментах.</li>
        <li><b>Детекция аномалий через автоэнкодер.</b> AE/VAE обучаются на нормальных данных; аномалия даёт высокую ошибку реконструкции. Используется в мониторинге промышленных сенсоров, fraud detection, выявлении дефектов на производстве.</li>
        <li><b>Дизайн молекул и лекарств.</b> VAE и diffusion-модели для генерации молекулярных структур с нужными свойствами. AlphaFold-style генерация белков. Применяется в in silico drug discovery.</li>
        <li><b>Аугментация данных для классификаторов.</b> GAN/diffusion генерируют синтетические примеры для редких классов — медицинские снимки, дефекты на конвейере, редкие сценарии для автономного вождения. SMOTE — примитивный частный случай того же принципа.</li>
        <li><b>Представления и сжатие (автоэнкодеры).</b> Обученный AE = компрессор. VAE даёт структурированное латентное пространство для интерполяции, кластеризации и передачи данных. Используется в latent diffusion и как базовый блок других моделей.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Создание совершенно нового контента.</b> В отличие от дискриминативных моделей, генеративные не классифицируют существующее, а создают то, чего раньше не было. Это открыло целый класс продуктов: text-to-image, text-to-video, голосовые ассистенты, AI-копирайтеры.</p>
      <p><b>Diffusion: SOTA-качество и стабильное обучение.</b> Diffusion-модели (DDPM, EDM, Flow Matching) дают фотореалистичные результаты и обучаются стабильно — в отличие от GAN, где нужно балансировать генератор и дискриминатор как канатоходца. Именно поэтому почти все современные image/video-модели перешли на diffusion.</p>
      <p><b>VAE: структурированное латентное пространство.</b> В отличие от GAN, VAE даёт гладкое латентное пространство, где можно интерполировать между точками, делать semantic arithmetic (убрать улыбку, добавить очки) и понимать, какое направление в латенте отвечает за какое свойство объекта. Это критично для научных задач (дизайн молекул, структура белков).</p>
      <p><b>GAN: быстрая одноэтапная генерация.</b> Один forward pass — и готовый объект. Diffusion требует 20–100 шагов denoising, что медленно для real-time приложений. StyleGAN и его наследники до сих пор лучшие для задач, где нужна скорость inference.</p>
      <p><b>Автоэнкодеры как инструмент unsupervised learning.</b> Обучение без разметки — огромное преимущество там, где размеченных данных мало, а сырых — много. AE даёт компактное представление, на котором потом можно построить дискриминативную модель с минимумом разметки.</p>
      <p><b>Работают с любыми модальностями.</b> Тот же diffusion обобщается на изображения, видео, аудио, 3D-структуры, временные ряды, белки. Универсальная математика — универсальные применения.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Дороговизна обучения.</b> Stable Diffusion обучен примерно за $600k, Sora — на порядки дороже. Обучение с нуля доступно только крупным лабораториям. Для 99% задач единственный путь — брать предобученную модель и делать LoRA/fine-tune.</p>
      <p><b>GAN: mode collapse и нестабильное обучение.</b> Генератор «находит» одну-две моды данных и выдаёт почти одинаковые результаты. Балансировка generator/discriminator хрупкая, и одна неправильная гиперпараметризация убивает обучение. Именно поэтому индустрия массово ушла в diffusion.</p>
      <p><b>VAE: размытость результатов.</b> MSE-loss минимизируется в среднем, что даёт «усреднённые» пиксели — изображения получаются мягкими и нерезкими. Для фотореалистичной генерации VAE плохо подходит (его используют как компонент latent diffusion).</p>
      <p><b>Diffusion: медленный inference.</b> Классический DDPM требует 1000 шагов denoising на каждое изображение. Ускорители (DDIM, DPM-Solver, LCM, Consistency Models) снизили это до 4–20 шагов, но всё равно медленнее GAN в разы.</p>
      <p><b>Галлюцинации в LLM.</b> Языковые генеративные модели уверенно придумывают несуществующие факты, цитаты, функции API. Это фундаментальное свойство авторегрессии — оптимизируется правдоподобие, а не истина. Решается только внешними механизмами (RAG, верификаторы, tool use).</p>
      <p><b>Сложно оценить качество.</b> FID, Inception Score, CLIP-score — все метрики имеют проблемы. Для генерации текста BLEU и ROUGE плохо коррелируют с реальным качеством. Часто единственная надёжная оценка — human preference.</p>
      <p><b>Этические и юридические риски.</b> Deepfakes, дезинформация, генерация CSAM, нарушение авторских прав художников (обучение на данных без согласия). Эти проблемы не чисто технические — они ограничивают деплой генеративных моделей в регулируемых отраслях.</p>

      <h3>🧭 Когда какую генеративную модель брать — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери генеративную модель когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td><b>Diffusion</b> — фотореалистичная генерация изображений/видео, text-to-X задачи, творческие инструменты</td>
          <td>Нужен real-time inference на слабом железе — diffusion слишком медленный</td>
        </tr>
        <tr>
          <td><b>GAN/StyleGAN</b> — быстрая one-shot генерация лиц/объектов, где качество за счёт скорости</td>
          <td>Нужно разнообразие примеров — mode collapse даст повторения</td>
        </tr>
        <tr>
          <td><b>VAE</b> — структурированное латентное пространство для дизайна молекул, интерполяции, представлений</td>
          <td>Нужна фотореалистичность — VAE даёт размытые результаты</td>
        </tr>
        <tr>
          <td><b>Автоэнкодер</b> — детекция аномалий на нормальных данных, сжатие, feature extraction</td>
          <td>Нужна именно генерация новых примеров, а не реконструкция</td>
        </tr>
        <tr>
          <td><b>LLM (GPT/Claude)</b> — генерация и понимание текста, код, reasoning через prompt</td>
          <td>Критична фактическая точность без внешней проверки — галлюцинации неизбежны</td>
        </tr>
        <tr>
          <td>Аугментация редких классов в классификаторе через синтетику</td>
          <td>Задача чисто дискриминативная (классификация, регрессия) — генеративка избыточна</td>
        </tr>
        <tr>
          <td>Unsupervised представления при дефиците разметки</td>
          <td>Строгие регуляторные требования к происхождению данных и лицензиям</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b>Flow Matching / Rectified Flow</b> — современная альтернатива diffusion с меньшим числом шагов inference (Stable Diffusion 3, Flux).</li>
        <li><b>Consistency Models и LCM</b> — если нужна diffusion-качество, но за 1–4 шага вместо 20–50: подходит для real-time приложений.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('transfer-learning')">LoRA / DreamBooth</a> на предобученной diffusion-модели</b> — если не хочешь обучать с нуля, а нужно адаптировать под конкретный стиль или объект.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('isolation-forest')">Isolation Forest</a> или One-class SVM</b> — для детекции аномалий, если автоэнкодер избыточен и данных мало.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('smote')">SMOTE</a> и его варианты</b> — для аугментации табличных данных с редкими классами, где генеративная нейросеть не нужна.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=aircAruvnKk" target="_blank">3Blue1Brown: Neural networks</a> — основа для понимания генеративных моделей</li>
        <li><a href="https://www.youtube.com/@statquest" target="_blank">StatQuest</a> — поиск по «VAE», «GAN», «Diffusion» для пошагового разбора</li>
        <li><a href="https://www.youtube.com/watch?v=HoKDTa5jHvg" target="_blank">Yannic Kilcher: DDPM</a> — разбор статьи по Diffusion моделям</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://arxiv.org/abs/1312.6114" target="_blank">Kingma & Welling: Auto-Encoding Variational Bayes (2013)</a> — оригинальная статья VAE</li>
        <li><a href="https://arxiv.org/abs/1406.2661" target="_blank">Goodfellow et al.: Generative Adversarial Nets (2014)</a> — оригинальная статья GAN</li>
        <li><a href="https://arxiv.org/abs/2006.11239" target="_blank">Ho et al.: Denoising Diffusion Probabilistic Models (2020)</a> — DDPM</li>
        <li><a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/" target="_blank">Lilian Weng: What are Diffusion Models?</a> — отличный обзор с математикой</li>
        <li><a href="https://habr.com/ru/search/?q=%D0%B3%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D0%B8%20VAE%20GAN" target="_blank">Habr: Генеративные модели</a> — статьи на русском про VAE, GAN и Diffusion</li>
      </ul>
      <h3>📚 Документация и инструменты</h3>
      <ul>
        <li><a href="https://huggingface.co/docs/diffusers/index" target="_blank">HuggingFace Diffusers</a> — библиотека для Diffusion моделей, туториалы и модели</li>
        <li><a href="https://pytorch.org/tutorials/beginner/dcgan_faces_tutorial.html" target="_blank">PyTorch: DCGAN Tutorial</a> — генерация лиц на PyTorch</li>
        <li><a href="https://github.com/CompVis/stable-diffusion" target="_blank">Stable Diffusion (GitHub)</a> — исходный код Stable Diffusion</li>
      </ul>
    `,
  },
});
