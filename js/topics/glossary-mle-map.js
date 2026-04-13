/* ==========================================================================
   Глоссарий: MLE и MAP (методы оценки параметров)
   ========================================================================== */
App.registerTopic({
  id: 'glossary-mle-map',
  category: 'glossary',
  title: 'MLE и MAP',
  summary: 'Два способа оценить параметры модели: MLE ищет параметр, наиболее «правдоподобный» в данных; MAP добавляет «приор» — предварительное убеждение.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>У тебя монета. Ты подбросил её 10 раз и получил 7 орлов. Какая вероятность орла $p$?</p>
        <ul>
          <li><b>MLE</b>: «Данные говорят сами за себя — 7/10. Значит $\\hat{p} = 0.7$.»</li>
          <li><b>MAP</b>: «Но я знаю, что монеты обычно честные (вероятность орла близка к 0.5). Учитывая это, реалистичная оценка $\\hat{p}$ где-то между 0.5 и 0.7 — скажем, 0.65.»</li>
        </ul>
        <p>MLE = «слушай только данные». MAP = «слушай данные, но с учётом предварительных знаний».</p>
      </div>

      <h3>📐 Правдоподобие (likelihood)</h3>
      <p><b>Likelihood</b> $L(\\theta | x)$ — это вероятность наблюдать данные $x$ при параметре $\\theta$:</p>
      <div class="math-block">$$L(\\theta | x) = P(x | \\theta)$$</div>
      <p>Важно: это <b>не</b> вероятность $\\theta$! Это функция от $\\theta$ при фиксированных данных. Мы спрашиваем: «для какого $\\theta$ эти данные наиболее вероятны?»</p>

      <h3>🎯 MLE — Maximum Likelihood Estimation</h3>
      <div class="math-block">$$\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_\\theta L(\\theta | x) = \\arg\\max_\\theta P(x | \\theta)$$</div>
      <p>На практике работают с <b>log-likelihood</b>: $\\log L$ превращает произведения в суммы и численно стабильнее:</p>
      <div class="math-block">$$\\hat{\\theta}_{\\text{MLE}} = \\arg\\max_\\theta \\sum_{i=1}^n \\log P(x_i | \\theta)$$</div>

      <h3>📊 Пример: MLE для Бернулли</h3>
      <div class="calc">10 подбрасываний монеты: 7 орлов, 3 решки.
Likelihood: L(p) = p⁷ × (1−p)³

Log-likelihood: log L = 7 log(p) + 3 log(1−p)

Производная по p:
d/dp [log L] = 7/p − 3/(1−p) = 0
→ 7(1−p) = 3p
→ p̂_MLE = <b>7/10 = 0.7</b></div>
      <p>Для Бернулли/Binomial MLE = пропорция успехов. Для нормального: MLE(μ) = выборочное среднее, MLE(σ²) = (1/n)Σ(x−x̄)² (смещённая оценка!).</p>

      <h3>🎯 MAP — Maximum A Posteriori</h3>
      <p>MAP использует теорему Байеса: объединяет likelihood с <b>prior</b> $P(\\theta)$ — предварительным убеждением о параметре:</p>
      <div class="math-block">$$\\hat{\\theta}_{\\text{MAP}} = \\arg\\max_\\theta P(\\theta | x) = \\arg\\max_\\theta P(x|\\theta) P(\\theta)$$</div>
      <p>В log-форме:</p>
      <div class="math-block">$$\\hat{\\theta}_{\\text{MAP}} = \\arg\\max_\\theta [\\log L(\\theta) + \\log P(\\theta)]$$</div>

      <h3>📊 Пример: MAP для монеты с prior Beta(2,2)</h3>
      <p>Beta(2,2) — «плавный» prior, пик на 0.5, допускающий отклонения. Интерпретация: «я видел 2 орла и 2 решки до эксперимента».</p>
      <div class="calc">Posterior после 7/10: Beta(2+7, 2+3) = Beta(9, 5)
Мода Beta(α,β) = (α−1)/(α+β−2) = 8/12 ≈ <b>0.667</b>

MLE = 0.700 (только данные)
MAP = 0.667 (с учётом prior «честной» монеты)

При небольших n prior «тянет» оценку к себе. С ростом n prior теряет влияние, и MAP → MLE.</div>

      <h3>💡 Связь с регуляризацией</h3>
      <p>Удивительно: многие классические методы ML можно переинтерпретировать как MAP:</p>
      <ul>
        <li><b>L2 регуляризация = Gaussian prior</b> на веса. $\\log N(w|0, \\sigma^2) = -\\lambda \\|w\\|^2$ — добавка к лосс-функции.</li>
        <li><b>L1 регуляризация = Laplace prior</b>. Лапласовское распределение у нуля — «верю, что многие веса = 0», отсюда sparsity.</li>
        <li><b>Dropout</b> можно показать эквивалентным MAP с определённым prior.</li>
      </ul>
      <p>Это значит: регуляризация — это «MAP с осмысленным prior». Подробнее в <a onclick="App.selectTopic('regularization')">регуляризации</a>.</p>

      <h3>⚖️ MLE vs MAP vs Full Bayesian</h3>
      <ul>
        <li><b>MLE</b>: одна точечная оценка. Игнорирует prior знания. Может переобучаться на малых выборках.</li>
        <li><b>MAP</b>: одна точечная оценка с учётом prior. Простая и быстрая «байесовщина».</li>
        <li><b>Полный Bayesian</b>: вычисляет всё posterior $P(\\theta|x)$, не только максимум. Даёт credible intervals и неопределённость, но дорого (MCMC/VI).</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('bayesian')">Байесовский вывод</a> — полный подход</li>
        <li><a onclick="App.selectTopic('logistic-regression')">Логистическая регрессия</a> — обучается через MLE</li>
        <li><a onclick="App.selectTopic('regularization')">Регуляризация</a> — MAP интерпретация</li>
        <li><a onclick="App.selectTopic('glossary-loss-functions')">Функции потерь</a> — многие = −log L</li>
      </ul>
    `,

    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Maximum_likelihood_estimation" target="_blank">Wikipedia: MLE</a></li>
        <li><a href="https://en.wikipedia.org/wiki/Maximum_a_posteriori_estimation" target="_blank">Wikipedia: MAP</a></li>
      </ul>
    `
  }
});
