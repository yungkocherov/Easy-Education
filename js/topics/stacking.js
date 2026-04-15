/* ==========================================================================
   Stacking и Blending
   ========================================================================== */
App.registerTopic({
  id: 'stacking',
  category: 'ml-basics',
  title: 'Stacking и Blending',
  summary: 'Мета-ансамбли: модели первого уровня + мета-модель сверху.',

  tabs: {
    theory: `
      <div class="prerequisites">
        <b>Перед этой темой:</b>
        <a onclick="App.selectTopic('random-forest')">Random Forest</a> ·
        <a onclick="App.selectTopic('gradient-boosting')">Gradient Boosting</a> ·
        <a onclick="App.selectTopic('cross-validation')">Кросс-валидация</a>
      </div>
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь, что ты судишь конкурс. Есть три эксперта: врач, инженер и экономист. Каждый оценивает участника с точки зрения своей экспертизы. Затем есть <b>арбитр</b> — опытный менеджер, который знает, насколько можно доверять каждому эксперту и как правильно взвешивать их мнения.</p>
        <p>Это и есть stacking. <b>Эксперты — базовые модели (уровень 0)</b>: Random Forest, <a class="glossary-link" onclick="App.selectTopic('glossary-gradient')">Gradient</a> Boosting, Логистическая регрессия. <b>Арбитр — мета-модель (уровень 1)</b>: она обучается на предсказаниях базовых моделей и учится, кому и когда доверять.</p>
        <p>Ключевое отличие от простого голосования (Voting): мета-модель не просто усредняет, а <b>обучается</b> оптимально комбинировать — и может поставить вес 0.8 на Forest и 0.1 на SVM, если так лучше.</p>
      </div>

      <div class="illustration bordered">
        <svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" style="max-width:560px;">
          <text x="280" y="15" text-anchor="middle" font-size="12" font-weight="600" fill="#334155">Архитектура Stacking</text>

          <!-- Input data -->
          <rect x="5" y="25" width="90" height="60" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="50" y="48" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">Обучающие</text>
          <text x="50" y="63" text-anchor="middle" font-size="10" font-weight="600" fill="#92400e">данные X</text>
          <text x="50" y="76" text-anchor="middle" font-size="9" fill="#92400e">(X_train)</text>

          <!-- Arrow from data to models -->
          <line x1="95" y1="55" x2="145" y2="55" stroke="#64748b" stroke-width="1.5"/>
          <polygon points="141,51 149,55 141,59" fill="#64748b"/>

          <!-- Level 0 models -->
          <rect x="150" y="20" width="100" height="35" rx="6" fill="#dbeafe" stroke="#2563eb" stroke-width="1.5"/>
          <text x="200" y="36" text-anchor="middle" font-size="10" font-weight="600" fill="#1e40af">Random Forest</text>
          <text x="200" y="49" text-anchor="middle" font-size="9" fill="#1e40af">Модель 1</text>

          <rect x="150" y="68" width="100" height="35" rx="6" fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
          <text x="200" y="83" text-anchor="middle" font-size="10" font-weight="600" fill="#065f46">Grad. Boosting</text>
          <text x="200" y="96" text-anchor="middle" font-size="9" fill="#065f46">Модель 2</text>

          <rect x="150" y="116" width="100" height="35" rx="6" fill="#ede9fe" stroke="#7c3aed" stroke-width="1.5"/>
          <text x="200" y="131" text-anchor="middle" font-size="10" font-weight="600" fill="#5b21b6">SVM</text>
          <text x="200" y="144" text-anchor="middle" font-size="9" fill="#5b21b6">Модель 3</text>

          <!-- Lines from models to meta-features -->
          <path d="M250,37 C280,37 280,78 310,78" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4,3"/>
          <path d="M250,85 L310,90" fill="none" stroke="#059669" stroke-width="1.5" stroke-dasharray="4,3"/>
          <path d="M250,133 C280,133 280,105 310,105" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4,3"/>

          <!-- Level 0 predictions (meta-features) -->
          <rect x="310" y="65" width="90" height="55" rx="6" fill="#fef9c3" stroke="#ca8a04" stroke-width="1.5"/>
          <text x="355" y="83" text-anchor="middle" font-size="9" font-weight="600" fill="#92400e">Мета-признаки</text>
          <text x="355" y="97" text-anchor="middle" font-size="9" fill="#92400e">p1=0.72</text>
          <text x="355" y="109" text-anchor="middle" font-size="9" fill="#92400e">p2=0.68 p3=0.81</text>

          <!-- Arrow to meta-model -->
          <line x1="400" y1="92" x2="435" y2="92" stroke="#64748b" stroke-width="1.5"/>
          <polygon points="431,88 439,92 431,96" fill="#64748b"/>

          <!-- Meta-model -->
          <rect x="440" y="68" width="100" height="55" rx="6" fill="#fee2e2" stroke="#dc2626" stroke-width="1.5"/>
          <text x="490" y="87" text-anchor="middle" font-size="10" font-weight="600" fill="#991b1b">Мета-модель</text>
          <text x="490" y="101" text-anchor="middle" font-size="9" fill="#991b1b">LogReg / Ridge</text>
          <text x="490" y="113" text-anchor="middle" font-size="9" fill="#991b1b">(уровень 1)</text>

          <!-- Final prediction arrow -->
          <line x1="490" y1="123" x2="490" y2="155" stroke="#dc2626" stroke-width="1.5"/>
          <polygon points="486,151 490,159 494,151" fill="#dc2626"/>
          <rect x="440" y="158" width="100" height="30" rx="6" fill="#fca5a5" stroke="#dc2626" stroke-width="1.5"/>
          <text x="490" y="177" text-anchor="middle" font-size="10" font-weight="600" fill="#7f1d1d">Предсказание</text>

          <!-- CV annotation -->
          <rect x="150" y="165" width="145" height="40" rx="5" fill="#f0fdf4" stroke="#86efac" stroke-width="1"/>
          <text x="222" y="180" text-anchor="middle" font-size="9" fill="#166534">⟳ Out-of-Fold CV:</text>
          <text x="222" y="193" text-anchor="middle" font-size="9" fill="#166534">мета-признаки без утечки</text>
        </svg>
        <div class="caption">Stacking: базовые модели (уровень 0) предсказывают → мета-признаки → мета-модель (уровень 1) обучается их объединять. Критично: мета-признаки для train получают через CV.</div>
      </div>

      <h3>⚙️ Как работает Stacking: шаг за шагом</h3>
      <p>Главная сложность stacking — получить мета-признаки для обучающих данных без <span class="term" data-tip="Data leakage в stacking. Если мета-признаки для train получены из той же модели, что обучалась на train — мета-модель «видит ответы» и переобучается. Решение: Out-of-Fold предсказания.">утечки данных</span>.</p>

      <h4>Шаг 1: Out-of-Fold предсказания для train</h4>
      <ol>
        <li>Делим X_train на K фолдов (обычно K=5)</li>
        <li>Для каждого фолда k: обучаем каждую базовую модель на остальных K-1 фолдах, предсказываем для фолда k</li>
        <li>В результате каждая строка X_train получает предсказание, сделанное <em>моделью, которая её не видела</em></li>
        <li>Собираем эти предсказания в матрицу мета-признаков (n_train × n_base_models)</li>
      </ol>

      <h4>Шаг 2: Мета-признаки для test</h4>
      <p>Для test нет проблемы утечки, но нужна стабильность. Варианты:</p>
      <ul>
        <li>Переобучаем каждую базовую модель на <em>всём</em> X_train, предсказываем для X_test</li>
        <li>Или усредняем предсказания K моделей из каждого фолда (чуть лучше по дисперсии)</li>
      </ul>

      <h4>Шаг 3: Обучение мета-модели</h4>
      <p>Обучаем мета-модель на матрице мета-признаков (предсказания базовых моделей) и y_train. Предсказываем для test по мета-признакам test.</p>

      <div class="key-concept">
        <div class="kc-label">Почему Out-of-Fold, а не просто fit на train?</div>
        <p>Если базовая модель видела строку при обучении, её предсказание на этой строке будет <b>слишком уверенным</b> (переобученным). Мета-модель научится доверять «уверенным» предсказаниям — но на test такой уверенности не будет. OOF решает это: мета-модель обучается на «честных» предсказаниях.</p>
      </div>

      <h3>🔀 Blending: более простой вариант</h3>
      <p>Blending — упрощённая версия stacking без cross-validation. Алгоритм:</p>
      <ol>
        <li>Делим train на два набора: train_base (80%) и holdout (20%)</li>
        <li>Обучаем базовые модели на train_base</li>
        <li>Предсказываем для holdout → мета-признаки для мета-модели</li>
        <li>Обучаем мета-модель на предсказаниях holdout</li>
        <li>Предсказываем на test: сначала базовыми моделями, затем мета-моделью</li>
      </ol>
      <p><b>Плюсы blending:</b> проще, быстрее, нет риска утечки через CV.</p>
      <p><b>Минусы:</b> базовые модели не видели 20% holdout → меньше данных для обучения; мета-модель обучается только на holdout → тоже меньше данных.</p>

      <h3>🎯 Почему stacking работает</h3>
      <p>Разные модели ошибаются <em>по-разному</em>. RF хорошо работает там, где GB плохой — и наоборот. Мета-модель учится, на каком типе примеров каждому верить.</p>
      <ul>
        <li><b>Разнообразие базовых моделей</b> — главное условие успеха. RF + LR + SVM лучше, чем 3 RF.</li>
        <li><b>Простая мета-модель</b> — логистическая регрессия или Ridge лучше, чем сложная. Мета-признаков мало (3–10), риск <a class="glossary-link" onclick="App.selectTopic('glossary-overfitting')">переобучения</a> высок.</li>
        <li><b>Разные типы алгоритмов</b> — деревья + линейные + нейронные сети образуют хорошее трио.</li>
      </ul>

      <h3>🏆 Stacking vs Bagging vs Boosting</h3>
      <ul>
        <li><b>Bagging (RF):</b> параллельно обучает копии одной модели, усредняет. Снижает дисперсию.</li>
        <li><b>Boosting (GB):</b> последовательно обучает модели, каждая исправляет ошибки предыдущей. Снижает смещение.</li>
        <li><b>Stacking:</b> разные модели объединяются обученной мета-моделью. Снижает и дисперсию, и смещение — но сложнее в реализации.</li>
      </ul>

      <div class="deep-dive">
        <summary>Подробнее: многоуровневый stacking</summary>
        <div class="deep-dive-body">
          <p>Ничто не мешает добавить больше уровней. Уровень 2 = мета-модель над выходами уровня 1. На практике:</p>
          <ul>
            <li>2 уровня — стандарт на Kaggle</li>
            <li>3+ уровней — редко улучшает, почти всегда переобучение</li>
            <li>Каждый уровень уменьшает эффективный размер обучающих данных (CV становится сложнее)</li>
          </ul>
          <p>Классическое решение: Ensemble Selection (Caruana et al., 2004) — жадный алгоритм, который на каждом шаге добавляет модель, максимально улучшающую ансамбль. Каждую модель можно добавить несколько раз.</p>
        </div>
      </div>

      <div class="deep-dive">
        <summary>Подробнее: Stacking на Kaggle — победные решения</summary>
        <div class="deep-dive-body">
          <p>Stacking стал доминирующей техникой на Kaggle с 2014–2016 годов. Несколько паттернов из топ-решений:</p>
          <ul>
            <li><b>Netflix Prize (2009):</b> финальное решение было ансамблем 107 алгоритмов. Stacking играл ключевую роль.</li>
            <li><b>Типичное соревнование:</b> 5–15 базовых моделей разных типов → логрег мета-модель → +1–3% к метрике</li>
            <li><b>Правило Крозье (Krogh & Vedelsby):</b> gain от ансамбля ≈ среднее расхождение моделей на тест. Чем разнообразнее — тем лучше.</li>
          </ul>
          <p><b>Важно:</b> в продакшене stacking редко оправдан из-за сложности поддержки. Используйте когда прирост метрики значителен (&gt;1–2%) и обслуживание системы готово к сложности.</p>
        </div>
      </div>

      <h3>🔗 Как это связано с другими темами</h3>
      <ul>
        <li><b>Random Forest</b> — один из лучших кандидатов для уровня 0 stacking; хорошо калиброван, разнообразен</li>
        <li><b>Gradient Boosting</b> — обычно самая сильная модель в стеке; XGBoost, LightGBM, CatBoost</li>
        <li><b>Кросс-валидация</b> — OOF предсказания это KFold CV на уровне 0; понимание CV обязательно</li>
        <li><b>Feature Engineering</b> — мета-признаки это тоже своего рода feature engineering: преобразование X → предсказания моделей</li>
        <li><b>Регуляризация</b> — мета-модель (Ridge, Lasso) использует регуляризацию именно потому что мета-признаков мало</li>
      </ul>
    `,

    examples: [
      {
        title: '3 модели → мета-логрег',
        steps: [
          {
            title: 'Задача и базовые модели',
            content: `
              <p>Бинарная классификация: предсказываем одобрение кредита (1=одобрен, 0=отказ). 8 объектов в train.</p>
              <table class="data-table">
                <thead><tr><th>Клиент</th><th>доход</th><th>возраст</th><th>просрочки</th><th>Y (факт)</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>80k</td><td>35</td><td>0</td><td>1</td></tr>
                  <tr><td>2</td><td>40k</td><td>25</td><td>3</td><td>0</td></tr>
                  <tr><td>3</td><td>65k</td><td>42</td><td>1</td><td>1</td></tr>
                  <tr><td>4</td><td>30k</td><td>22</td><td>5</td><td>0</td></tr>
                  <tr><td>5</td><td>90k</td><td>50</td><td>0</td><td>1</td></tr>
                  <tr><td>6</td><td>55k</td><td>33</td><td>2</td><td>0</td></tr>
                  <tr><td>7</td><td>75k</td><td>45</td><td>0</td><td>1</td></tr>
                  <tr><td>8</td><td>35k</td><td>28</td><td>4</td><td>0</td></tr>
                </tbody>
              </table>
              <p>Базовые модели: <b>M1 = Random Forest</b>, <b>M2 = Gradient Boosting</b>, <b>M3 = SVM (RBF)</b>.</p>
            `
          },
          {
            title: 'Out-of-Fold предсказания (2-fold для простоты)',
            content: `
              <p>Делим train на 2 фолда: Фолд A (клиенты 1,3,5,7), Фолд B (клиенты 2,4,6,8).</p>
              <p><b>Итерация 1:</b> обучаем M1,M2,M3 на Фолде B, предсказываем для Фолда A:</p>
              <table class="data-table">
                <thead><tr><th>Клиент</th><th>Y</th><th>P(M1)</th><th>P(M2)</th><th>P(M3)</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>1</td><td>0.82</td><td>0.79</td><td>0.71</td></tr>
                  <tr><td>3</td><td>1</td><td>0.74</td><td>0.70</td><td>0.66</td></tr>
                  <tr><td>5</td><td>1</td><td>0.91</td><td>0.88</td><td>0.85</td></tr>
                  <tr><td>7</td><td>1</td><td>0.85</td><td>0.83</td><td>0.79</td></tr>
                </tbody>
              </table>
              <p><b>Итерация 2:</b> обучаем M1,M2,M3 на Фолде A, предсказываем для Фолда B:</p>
              <table class="data-table">
                <thead><tr><th>Клиент</th><th>Y</th><th>P(M1)</th><th>P(M2)</th><th>P(M3)</th></tr></thead>
                <tbody>
                  <tr><td>2</td><td>0</td><td>0.21</td><td>0.18</td><td>0.31</td></tr>
                  <tr><td>4</td><td>0</td><td>0.12</td><td>0.09</td><td>0.19</td></tr>
                  <tr><td>6</td><td>0</td><td>0.38</td><td>0.42</td><td>0.49</td></tr>
                  <tr><td>8</td><td>0</td><td>0.15</td><td>0.11</td><td>0.22</td></tr>
                </tbody>
              </table>
              <p>Теперь каждый клиент из train получил OOF-предсказания от модели, <em>не видевшей</em> его при обучении.</p>
            `
          },
          {
            title: 'Обучаем мета-модель',
            content: `
              <p>Матрица мета-признаков (X_meta) = предсказания базовых моделей по всем 8 клиентам:</p>
              <table class="data-table">
                <thead><tr><th>Клиент</th><th>P(M1) — RF</th><th>P(M2) — GB</th><th>P(M3) — SVM</th><th>Y</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>0.82</td><td>0.79</td><td>0.71</td><td>1</td></tr>
                  <tr><td>2</td><td>0.21</td><td>0.18</td><td>0.31</td><td>0</td></tr>
                  <tr><td>3</td><td>0.74</td><td>0.70</td><td>0.66</td><td>1</td></tr>
                  <tr><td>4</td><td>0.12</td><td>0.09</td><td>0.19</td><td>0</td></tr>
                  <tr><td>5</td><td>0.91</td><td>0.88</td><td>0.85</td><td>1</td></tr>
                  <tr><td>6</td><td>0.38</td><td>0.42</td><td>0.49</td><td>0</td></tr>
                  <tr><td>7</td><td>0.85</td><td>0.83</td><td>0.79</td><td>1</td></tr>
                  <tr><td>8</td><td>0.15</td><td>0.11</td><td>0.22</td><td>0</td></tr>
                </tbody>
              </table>
              <p>Логистическая регрессия на этих данных находит <b>оптимальные веса</b> для каждой базовой модели. Допустим, выучила: $P = \\sigma(1.8 \\cdot P_{RF} + 2.1 \\cdot P_{GB} + 0.6 \\cdot P_{SVM} - 0.9)$.</p>
              <p>SVM получил наименьший вес (0.6) — мета-модель поняла, что он менее точен на этих данных.</p>
            `
          }
        ]
      },
      {
        title: 'Blending vs Stacking',
        steps: [
          {
            title: 'Blending: схема',
            content: `
              <p>Blending проще: никакого CV, просто разбиваем train на две части.</p>
              <table class="data-table">
                <thead><tr><th>Набор</th><th>Использование</th><th>Размер</th></tr></thead>
                <tbody>
                  <tr><td><b>train_base</b></td><td>Обучение базовых моделей</td><td>80%</td></tr>
                  <tr><td><b>holdout</b></td><td>Генерация мета-признаков для мета-модели</td><td>20%</td></tr>
                  <tr><td><b>test</b></td><td>Финальное предсказание</td><td>–</td></tr>
                </tbody>
              </table>
              <p>Алгоритм:</p>
              <ol>
                <li>Обучаем M1, M2, M3 на <code>train_base</code></li>
                <li>Предсказываем для <code>holdout</code> → мета-признаки <code>X_hold_meta</code></li>
                <li>Обучаем мета-модель на <code>X_hold_meta</code> и <code>y_holdout</code></li>
                <li>Предсказываем для <code>test</code> базовыми моделями → <code>X_test_meta</code></li>
                <li>Финальное предсказание: <code>meta_model.predict(X_test_meta)</code></li>
              </ol>
            `
          },
          {
            title: 'Сравнение: Blending vs Stacking',
            content: `
              <p>На одинаковых данных (1000 строк, бинарная классификация, ROC-AUC метрика):</p>
              <table class="data-table">
                <thead><tr><th>Характеристика</th><th>Stacking (5-fold OOF)</th><th>Blending (80/20 split)</th></tr></thead>
                <tbody>
                  <tr><td>Данных для базовых моделей</td><td>100% (4/5 = 80% на каждый фолд)</td><td>80% (train_base)</td></tr>
                  <tr><td>Данных для мета-модели</td><td>100% (все OOF)</td><td>20% (holdout)</td></tr>
                  <tr><td>Время обучения</td><td>5× медленнее (5 обучений × n моделей)</td><td>1× быстрее</td></tr>
                  <tr><td>Стабильность</td><td>Выше (усредняется по 5 фолдам)</td><td>Ниже (зависит от random split)</td></tr>
                  <tr><td>ROC-AUC (пример)</td><td>0.876</td><td>0.862</td></tr>
                  <tr><td>Риск утечки</td><td>Нет (если правильно реализован)</td><td>Нет (holdout ≠ train_base)</td></tr>
                </tbody>
              </table>
              <p><b>Когда выбрать blending:</b> быстрый прототип, очень большие данные (CV слишком медленный), данных достаточно много что потеря 20% несущественна.</p>
              <p><b>Когда выбрать stacking:</b> мало данных, нужна максимальная метрика (Kaggle), стабильность важнее скорости.</p>
            `
          },
          {
            title: 'Практические советы по мета-признакам',
            content: `
              <p>Что включать в мета-признаки (входы мета-модели):</p>
              <ul>
                <li><b>Предсказания базовых моделей:</b> вероятности (predict_proba) лучше, чем бинарные (predict)</li>
                <li><b>Исходные признаки X:</b> иногда добавляют несколько важных признаков из X в мета-модель — помогает</li>
                <li><b>Несколько разных метрик базовых моделей:</b> P(класс 0) и P(класс 1) оба, или OOF и прогноз на test_fold</li>
              </ul>
              <p>Что НЕ включать:</p>
              <ul>
                <li>Все исходные признаки (мета-модель превращается в обычную модель)</li>
                <li>Предсказания, сделанные без OOF (утечка)</li>
              </ul>
              <table class="data-table">
                <thead><tr><th>Вариант мета-признаков</th><th>ROC-AUC</th></tr></thead>
                <tbody>
                  <tr><td>Только predict (0/1)</td><td>0.841</td></tr>
                  <tr><td>predict_proba P(1)</td><td>0.863</td></tr>
                  <tr><td>predict_proba P(0) и P(1)</td><td>0.868</td></tr>
                  <tr><td>proba + топ-3 исходных признака</td><td>0.876</td></tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      {
        title: 'Подбор мета-модели',
        steps: [
          {
            title: 'Простые мета-модели лучше',
            content: `
              <p>Мета-модель работает с небольшим числом сильно-коррелированных признаков (предсказаниями базовых моделей). Это идеальные условия для регуляризованных линейных моделей.</p>
              <table class="data-table">
                <thead><tr><th>Мета-модель</th><th>ROC-AUC</th><th>Риск переобучения</th><th>Интерпретируемость</th></tr></thead>
                <tbody>
                  <tr><td><b>LogisticRegression (C=0.1)</b></td><td>0.876</td><td>Низкий</td><td>Высокая (веса моделей)</td></tr>
                  <tr><td><b>Ridge Regression</b></td><td>0.874</td><td>Низкий</td><td>Высокая</td></tr>
                  <tr><td>Linear SVM</td><td>0.872</td><td>Низкий</td><td>Средняя</td></tr>
                  <tr><td>Random Forest (n=10)</td><td>0.861</td><td>Средний</td><td>Низкая</td></tr>
                  <tr><td>XGBoost</td><td>0.858</td><td>Высокий</td><td>Низкая</td></tr>
                  <tr><td>Neural Network</td><td>0.845</td><td>Очень высокий</td><td>Очень низкая</td></tr>
                </tbody>
              </table>
              <p>Вывод: чем проще мета-модель — тем надёжнее. LogisticRegression с малым C (сильная регуляризация) — золотой стандарт.</p>
            `
          },
          {
            title: 'Диверсификация базовых моделей',
            content: `
              <p>Эффект от stacking зависит от <b>разнообразия</b> базовых моделей. Сравним ансамбли:</p>
              <table class="data-table">
                <thead><tr><th>Состав стека</th><th>ROC-AUC одиночной</th><th>ROC-AUC стека</th><th>Прирост</th></tr></thead>
                <tbody>
                  <tr><td>3 × RandomForest (разные seed)</td><td>0.861</td><td>0.865</td><td>+0.004</td></tr>
                  <tr><td>RF + XGBoost + LogReg</td><td>0.872 (лучшая)</td><td>0.889</td><td>+0.017</td></tr>
                  <tr><td>RF + XGBoost + SVM + KNN + LR</td><td>0.872</td><td>0.894</td><td>+0.022</td></tr>
                  <tr><td>RF + XGBoost + SVM + NN + NaiveBayes</td><td>0.872</td><td>0.897</td><td>+0.025</td></tr>
                </tbody>
              </table>
              <p>Модели с разными принципами работы (деревья + линейные + ядерные + вероятностные) дают максимальный прирост.</p>
            `
          },
          {
            title: 'Когда stacking не помогает',
            content: `
              <p>Stacking — не серебряная пуля. Случаи, когда он не работает:</p>
              <table class="data-table">
                <thead><tr><th>Ситуация</th><th>Почему stacking не поможет</th><th>Что делать вместо</th></tr></thead>
                <tbody>
                  <tr><td>Все базовые модели похожи</td><td>Нет диверсификации → нечего объединять</td><td>Добавить принципиально разные алгоритмы</td></tr>
                  <tr><td>Мало данных (&lt;500 строк)</td><td>OOF-предсказания слишком зашумлены</td><td>Обычная модель с кросс-валидацией</td></tr>
                  <tr><td>Базовые модели уже отличные</td><td>Прирост минимален при высокой сложности</td><td>Оптимизация гиперпараметров лучшей модели</td></tr>
                  <tr><td>Продакшн с жёсткими требованиями к latency</td><td>N моделей → N× время инференса</td><td>Дистилляция знаний в одну модель</td></tr>
                </tbody>
              </table>
              <p>Практический совет: сначала попробуйте простой VotingClassifier (усреднение вероятностей). Если proba-averaging даёт +0.5% — stacking может дать ещё +0.5–1.0%. Если voting ничего не даёт — stacking тоже вряд ли поможет.</p>
            `
          }
        ]
      }
    ],

    simulation: {
      html: `
        <h3>Симуляция: как мета-модель взвешивает базовые</h3>
        <p>Три базовые модели работают на одних данных: <b>LR</b> (линейная граница), <b>Tree</b> (прямоугольники), <b>kNN</b> (локальная). Мета-модель (ridge logistic regression) обучается на их вероятностях и находит <b>веса</b> — сколько доверять каждой. Крути «порчу» каждой базовой модели: как только модель начинает предсказывать случайно, её вес в стеке падает почти до нуля.</p>
        <div class="sim-container">
          <div class="sim-controls" id="st-controls"></div>
          <div class="sim-buttons">
            <button class="btn" id="st-regen">🔄 Новые данные</button>
          </div>
          <div class="sim-output">
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
              <div><div style="font-weight:600;margin-bottom:4px;">LR</div><div class="sim-chart-wrap" style="height:180px;padding:0;"><canvas id="st-lr" class="sim-canvas"></canvas></div></div>
              <div><div style="font-weight:600;margin-bottom:4px;">Tree (d=3)</div><div class="sim-chart-wrap" style="height:180px;padding:0;"><canvas id="st-tr" class="sim-canvas"></canvas></div></div>
              <div><div style="font-weight:600;margin-bottom:4px;">kNN (k=9)</div><div class="sim-chart-wrap" style="height:180px;padding:0;"><canvas id="st-kn" class="sim-canvas"></canvas></div></div>
              <div><div style="font-weight:600;margin-bottom:4px;">Stacking</div><div class="sim-chart-wrap" style="height:180px;padding:0;"><canvas id="st-meta" class="sim-canvas"></canvas></div></div>
            </div>
            <div class="sim-chart-wrap" style="height:160px;"><canvas id="st-weights"></canvas></div>
            <div class="sim-stats" id="st-stats"></div>
          </div>
        </div>
      `,
      init(container) {
        const controls = container.querySelector('#st-controls');
        const cShape = App.makeControl('select', 'st-shape', 'Данные', {
          options: [
            { value: 'linear', label: 'Линейная граница' },
            { value: 'moons', label: 'Две луны' },
            { value: 'circle', label: 'Круг' },
            { value: 'xor', label: 'XOR' },
          ],
          value: 'moons',
        });
        const cCorruptLR = App.makeControl('range', 'st-cLR', 'Порча LR', { min: 0, max: 1, step: 0.05, value: 0 });
        const cCorruptTR = App.makeControl('range', 'st-cTR', 'Порча Tree', { min: 0, max: 1, step: 0.05, value: 0 });
        const cCorruptKN = App.makeControl('range', 'st-cKN', 'Порча kNN', { min: 0, max: 1, step: 0.05, value: 0 });
        [cShape, cCorruptLR, cCorruptTR, cCorruptKN].forEach(c => controls.appendChild(c.wrap));

        let points = [];
        let weightsChart = null;

        function genData() {
          const shape = cShape.input.value;
          points = [];
          for (let i = 0; i < 180; i++) {
            let x, y, cls;
            if (shape === 'linear') {
              x = Math.random(); y = Math.random();
              cls = y > 0.5 + 0.3 * (x - 0.5) ? 0 : 1;
              if (Math.random() < 0.05) cls = 1 - cls;
            } else if (shape === 'moons') {
              const t = Math.random() * Math.PI;
              if (Math.random() < 0.5) {
                x = 0.3 + 0.25 * Math.cos(t) + App.Util.randn(0, 0.03);
                y = 0.45 + 0.25 * Math.sin(t) + App.Util.randn(0, 0.03);
                cls = 0;
              } else {
                x = 0.55 + 0.25 * Math.cos(t + Math.PI) + App.Util.randn(0, 0.03);
                y = 0.55 - 0.25 * Math.sin(t + Math.PI) + App.Util.randn(0, 0.03);
                cls = 1;
              }
            } else if (shape === 'circle') {
              x = Math.random(); y = Math.random();
              const r = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);
              cls = r < 0.25 ? 0 : 1;
            } else {
              x = Math.random(); y = Math.random();
              cls = ((x > 0.5) ^ (y > 0.5)) ? 1 : 0;
              if (Math.random() < 0.05) cls = 1 - cls;
            }
            points.push({ x, y, cls });
          }
          update();
        }

        function trainLR(pts) {
          let w0 = 0, w1 = 0, b = 0;
          const lr = 0.5;
          for (let it = 0; it < 500; it++) {
            let g0 = 0, g1 = 0, gb = 0;
            for (const p of pts) {
              const z = w0 * p.x + w1 * p.y + b;
              const s = 1 / (1 + Math.exp(-z));
              const err = s - p.cls;
              g0 += err * p.x; g1 += err * p.y; gb += err;
            }
            g0 /= pts.length; g1 /= pts.length; gb /= pts.length;
            w0 -= lr * g0; w1 -= lr * g1; b -= lr * gb;
          }
          return { w0, w1, b };
        }
        function predLR(m, x, y) { return 1 / (1 + Math.exp(-(m.w0 * x + m.w1 * y + m.b))); }

        function gini(items) { if (items.length === 0) return 0; let c0 = 0; items.forEach(p => p.cls === 0 && c0++); const p0 = c0 / items.length; return 1 - p0 * p0 - (1 - p0) * (1 - p0); }
        function leafProb(items) { if (items.length === 0) return 0.5; let c1 = 0; items.forEach(p => p.cls === 1 && c1++); return c1 / items.length; }
        function buildTree(items, depth, maxDepth) {
          if (depth >= maxDepth || items.length < 2 || gini(items) < 1e-9) return { leaf: true, prob: leafProb(items) };
          let best = null;
          const base = gini(items);
          ['x', 'y'].forEach(feat => {
            const vals = items.map(p => p[feat]).sort((a, b) => a - b);
            for (let i = 1; i < vals.length; i++) {
              const thr = (vals[i - 1] + vals[i]) / 2;
              const L = items.filter(p => p[feat] < thr);
              const R = items.filter(p => p[feat] >= thr);
              if (!L.length || !R.length) continue;
              const w = (L.length * gini(L) + R.length * gini(R)) / items.length;
              const gain = base - w;
              if (!best || gain > best.gain) best = { feat, thr, gain, L, R };
            }
          });
          if (!best || best.gain < 1e-6) return { leaf: true, prob: leafProb(items) };
          return { leaf: false, feat: best.feat, thr: best.thr,
            left: buildTree(best.L, depth + 1, maxDepth),
            right: buildTree(best.R, depth + 1, maxDepth) };
        }
        function predTree(t, x, y) {
          if (t.leaf) return t.prob;
          const v = t.feat === 'x' ? x : y;
          return v < t.thr ? predTree(t.left, x, y) : predTree(t.right, x, y);
        }

        function predKNN(pts, x, y, k) {
          const dists = pts.map(p => ({ d: (p.x - x) ** 2 + (p.y - y) ** 2, cls: p.cls }));
          dists.sort((a, b) => a.d - b.d);
          let c1 = 0;
          for (let i = 0; i < k; i++) if (dists[i].cls === 1) c1++;
          return c1 / k;
        }

        function oof() {
          const n = points.length;
          const idx = points.map((_, i) => i);
          for (let i = idx.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [idx[i], idx[j]] = [idx[j], idx[i]];
          }
          const fold = idx.map((_, i) => i % 5);
          const oofLR = new Array(n), oofTR = new Array(n), oofKN = new Array(n);
          for (let f = 0; f < 5; f++) {
            const tr = [], val = [];
            idx.forEach((orig, pos) => { if (fold[pos] === f) val.push(orig); else tr.push(orig); });
            const trPts = tr.map(i => points[i]);
            const lrM = trainLR(trPts);
            const tree = buildTree(trPts, 0, 3);
            val.forEach(i => {
              oofLR[i] = predLR(lrM, points[i].x, points[i].y);
              oofTR[i] = predTree(tree, points[i].x, points[i].y);
              oofKN[i] = predKNN(trPts, points[i].x, points[i].y, 9);
            });
          }
          return { oofLR, oofTR, oofKN };
        }

        function corrupt(p, level) {
          if (level < 1e-6) return p;
          const noisy = 0.5 + (Math.random() - 0.5) * 0.8;
          return (1 - level) * p + level * noisy;
        }

        function trainMeta(feats, ys) {
          const d = 3;
          const w = [0, 0, 0];
          let b = 0;
          const lr = 0.8;
          const lambda = 0.05;
          for (let it = 0; it < 600; it++) {
            const g = [0, 0, 0]; let gb = 0;
            for (let i = 0; i < feats.length; i++) {
              let z = b; for (let k = 0; k < d; k++) z += w[k] * feats[i][k];
              const s = 1 / (1 + Math.exp(-z));
              const err = s - ys[i];
              for (let k = 0; k < d; k++) g[k] += err * feats[i][k];
              gb += err;
            }
            for (let k = 0; k < d; k++) {
              g[k] = g[k] / feats.length + lambda * w[k];
              w[k] -= lr * g[k];
            }
            b -= lr * (gb / feats.length);
          }
          return { w, b };
        }
        function predMeta(m, feat) {
          let z = m.b; for (let k = 0; k < 3; k++) z += m.w[k] * feat[k];
          return 1 / (1 + Math.exp(-z));
        }

        function drawModel(canvasId, predictFn) {
          const canvas = container.querySelector('#' + canvasId);
          const r = canvas.getBoundingClientRect();
          canvas.width = r.width; canvas.height = r.height;
          const ctx = canvas.getContext('2d');
          const W = canvas.width, H = canvas.height;
          ctx.clearRect(0, 0, W, H);
          const step = 6;
          for (let px = 0; px < W; px += step) {
            for (let py = 0; py < H; py += step) {
              const p = predictFn(px / W, py / H);
              ctx.fillStyle = `rgba(${Math.round(239 * (1 - p) + 59 * p)},${Math.round(68 * (1 - p) + 130 * p)},${Math.round(68 * (1 - p) + 246 * p)},0.28)`;
              ctx.fillRect(px, py, step, step);
            }
          }
          points.forEach(p => {
            ctx.fillStyle = p.cls === 0 ? '#ef4444' : '#3b82f6';
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, 2.2, 0, 2 * Math.PI);
            ctx.fill(); ctx.stroke();
          });
          let correct = 0;
          points.forEach(p => { if (Math.round(predictFn(p.x, p.y)) === p.cls) correct++; });
          return correct / points.length;
        }

        function update() {
          const lrFull = trainLR(points);
          const treeFull = buildTree(points, 0, 3);
          const { oofLR, oofTR, oofKN } = oof();

          const cLR = +cCorruptLR.input.value;
          const cTR = +cCorruptTR.input.value;
          const cKN = +cCorruptKN.input.value;

          const feats = [];
          const ys = [];
          for (let i = 0; i < points.length; i++) {
            feats.push([
              corrupt(oofLR[i], cLR),
              corrupt(oofTR[i], cTR),
              corrupt(oofKN[i], cKN),
            ]);
            ys.push(points[i].cls);
          }
          const meta = trainMeta(feats, ys);

          const rng = (seed => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; })(42);
          function cor(p, level) {
            if (level < 1e-6) return p;
            const r = 0.5 + (rng() - 0.5) * 0.8;
            return (1 - level) * p + level * r;
          }

          const accLR = drawModel('st-lr', (x, y) => cor(predLR(lrFull, x, y), cLR));
          const accTR = drawModel('st-tr', (x, y) => cor(predTree(treeFull, x, y), cTR));
          const accKN = drawModel('st-kn', (x, y) => cor(predKNN(points, x, y, 9), cKN));
          const accMeta = drawModel('st-meta', (x, y) => {
            const f = [
              cor(predLR(lrFull, x, y), cLR),
              cor(predTree(treeFull, x, y), cTR),
              cor(predKNN(points, x, y, 9), cKN),
            ];
            return predMeta(meta, f);
          });

          const ctx = container.querySelector('#st-weights').getContext('2d');
          if (weightsChart) weightsChart.destroy();
          weightsChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['LR', 'Tree', 'kNN'],
              datasets: [{
                label: 'Вес мета-модели',
                data: meta.w,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
              }],
            },
            options: {
              responsive: true, maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: { title: { display: true, text: 'Веса базовых моделей в стеке (коэффициенты LR-мета)' }, legend: { display: false } },
              scales: { x: { title: { display: true, text: 'коэффициент' } } },
            },
          });
          App.registerChart(weightsChart);

          container.querySelector('#st-stats').innerHTML = `
            <div class="stat-card"><div class="stat-label">LR acc</div><div class="stat-value">${(accLR * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Tree acc</div><div class="stat-value">${(accTR * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">kNN acc</div><div class="stat-value">${(accKN * 100).toFixed(1)}%</div></div>
            <div class="stat-card"><div class="stat-label">Stacking acc</div><div class="stat-value">${(accMeta * 100).toFixed(1)}%</div></div>
          `;
        }

        cShape.input.addEventListener('change', genData);
        [cCorruptLR, cCorruptTR, cCorruptKN].forEach(c => c.input.addEventListener('input', update));
        container.querySelector('#st-regen').onclick = genData;
        setTimeout(genData, 50);
        window.addEventListener('resize', update);
      },
    },

    python: `
      <h3>🐍 Stacking и Blending в Python</h3>

      <h4>StackingClassifier в sklearn (самое простое)</h4>
      <pre><code>from sklearn.ensemble import (
    StackingClassifier, RandomForestClassifier, GradientBoostingClassifier,
    VotingClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score

# Базовые модели (estimators)
estimators = [
    ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
    ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ('svm', SVC(probability=True, random_state=42))  # probability=True для predict_proba
]

# Мета-модель
meta_model = LogisticRegression(C=0.1)  # малый C = сильная регуляризация

# Stacking
stacking = StackingClassifier(
    estimators=estimators,
    final_estimator=meta_model,
    cv=5,                    # 5-fold OOF для мета-признаков
    stack_method='predict_proba',  # использовать вероятности (лучше чем predict)
    passthrough=False        # True = добавить исходные X к мета-признакам
)

# Сравниваем с одиночными моделями
for name, model in estimators + [('stacking', stacking)]:
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    print(f"{name}: {scores.mean():.4f} ± {scores.std():.4f}")</code></pre>

      <h4>Ручная реализация stacking с OOF</h4>
      <pre><code>import numpy as np
from sklearn.model_selection import KFold

def create_oof_features(models, X_train, y_train, X_test, n_folds=5):
    """
    Создаёт Out-of-Fold мета-признаки для train и усреднённые для test.
    Возвращает X_meta_train (n_train × n_models) и X_meta_test (n_test × n_models).
    """
    n_train, n_test = X_train.shape[0], X_test.shape[0]
    n_models = len(models)

    X_meta_train = np.zeros((n_train, n_models))
    X_meta_test = np.zeros((n_test, n_models))

    kf = KFold(n_splits=n_folds, shuffle=True, random_state=42)

    for j, (name, model) in enumerate(models):
        print(f"Обучаем базовую модель: {name}")
        test_preds = np.zeros((n_test, n_folds))

        for fold, (train_idx, val_idx) in enumerate(kf.split(X_train)):
            X_tr, X_val = X_train[train_idx], X_train[val_idx]
            y_tr = y_train[train_idx]

            model.fit(X_tr, y_tr)

            # OOF предсказания для train
            X_meta_train[val_idx, j] = model.predict_proba(X_val)[:, 1]

            # Предсказания для test (усредняем по фолдам)
            test_preds[:, fold] = model.predict_proba(X_test)[:, 1]

        X_meta_test[:, j] = test_preds.mean(axis=1)

    return X_meta_train, X_meta_test

# Использование:
models = [
    ('rf', RandomForestClassifier(n_estimators=100, random_state=42)),
    ('gb', GradientBoostingClassifier(n_estimators=100, random_state=42)),
    ('svm', SVC(probability=True, kernel='rbf', random_state=42))
]

X_meta_train, X_meta_test = create_oof_features(models, X_train, y_train, X_test)

# Обучаем мета-модель
meta = LogisticRegression(C=0.1)
meta.fit(X_meta_train, y_train)
y_pred = meta.predict_proba(X_meta_test)[:, 1]

print("Веса базовых моделей:", meta.coef_)</code></pre>

      <h4>Blending (проще, без CV)</h4>
      <pre><code">from sklearn.model_selection import train_test_split

# Делим train на train_base и holdout
X_base, X_hold, y_base, y_hold = train_test_split(
    X_train, y_train, test_size=0.2, random_state=42, stratify=y_train
)

# Обучаем базовые модели на train_base
rf = RandomForestClassifier(n_estimators=100).fit(X_base, y_base)
gb = GradientBoostingClassifier(n_estimators=100).fit(X_base, y_base)
svm = SVC(probability=True).fit(X_base, y_base)

base_models = [rf, gb, svm]

# Мета-признаки для holdout
X_hold_meta = np.column_stack([m.predict_proba(X_hold)[:, 1] for m in base_models])

# Мета-признаки для test
X_test_meta = np.column_stack([m.predict_proba(X_test)[:, 1] for m in base_models])

# Обучаем мета-модель на holdout
meta = LogisticRegression(C=0.1)
meta.fit(X_hold_meta, y_hold)

# Финальные предсказания
y_blend_pred = meta.predict_proba(X_test_meta)[:, 1]</code></pre>

      <h4>VotingClassifier — быстрый baseline перед stacking</h4>
      <pre><code>from sklearn.ensemble import VotingClassifier

# Soft voting = усреднение вероятностей (лучше hard voting)
voting = VotingClassifier(
    estimators=[('rf', rf), ('gb', gb), ('svm', svm)],
    voting='soft',   # 'hard' = большинство голосов, 'soft' = среднее вероятностей
    weights=[2, 3, 1]  # GB получает вес 3 (самая точная модель)
)
voting.fit(X_train, y_train)

# Сравниваем:
from sklearn.metrics import roc_auc_score
print("Voting AUC:", roc_auc_score(y_test, voting.predict_proba(X_test)[:, 1]))
print("Stacking AUC:", roc_auc_score(y_test, stacking.predict_proba(X_test)[:, 1]))</code></pre>
    `,

    applications: `
      <h3>🎯 Где применяется на практике</h3>
      <ul>
        <li><b>Kaggle и ML-соревнования — gold standard.</b> Большинство победных решений на соревнованиях по табличным данным — это stacking 5-20 моделей: XGBoost разных seed'ов, LightGBM с разными hyperparams, CatBoost, нейросети + мета-модель Ridge/LogisticRegression. Финальные 0.5-2% качества, за которые борются ради медали.</li>
        <li><b>Финансовый скоринг в больших банках.</b> Комбинация GBM (точность) + LR (интерпретируемость) + нейросеть (нелинейности) даёт устойчивость к dataset shift и снижает риск крупных ошибок. Для PD-моделей, где ошибка = миллионы убытков, сложность оправдана.</li>
        <li><b>Прогноз погоды и климатическое моделирование.</b> Ансамбли физических моделей (NWP) + ML-моделей — стандартная практика в метеослужбах. Каждая модель имеет свои систематические смещения, стек их компенсирует.</li>
        <li><b>Медицинская диагностика на мультимодальных данных.</b> Отдельная модель на снимках МРТ (CNN), отдельная на анализах (GBM), отдельная на анамнезе (LR) — мета-модель объединяет. Одна нейросеть на всех модальностях обычно хуже.</li>
        <li><b>Fraud detection и AML.</b> Цена ложноотрицательных — миллионы долларов и репутационные риски. Стекинг 10+ моделей с разными подходами (GBM на исторических фичах, графовая модель на связях, нейросеть на последовательностях) даёт запас прочности.</li>
        <li><b>Прогноз цен и спроса в ритейле высокого уровня.</b> Prophet + LightGBM + N-BEATS + sarima — разные семейства моделей улавливают разные структуры ряда; мета-модель делает финальную агрегацию.</li>
      </ul>

      <h3>✅ Сильные стороны — и почему они важны</h3>
      <p><b>Максимальное качество среди методов ансамблирования.</b> При разнообразии базовых моделей stacking почти всегда бьёт любой одиночный метод и обычно бьёт Voting/Blending на 0.3-1.5%. На Kaggle это разница между бронзой и золотом.</p>
      <p><b>Адаптивное взвешивание вместо ручного подбора.</b> Voting требует угадать веса; стек учит их на данных через мета-модель. Если одна из базовых моделей неожиданно плоха, мета-модель автоматически снизит её вклад — это устойчивее любой ручной эвристики.</p>
      <p><b>Использует разные сильные стороны моделей.</b> RF хорош на шумных точках, GBM на сложных паттернах, LR ловит линейные тренды, kNN ловит локальные эффекты. Мета-модель учится, какой базовой модели доверять на каком подмножестве признаков — это bias-variance трюк, недоступный одной модели.</p>
      <p><b>Универсальный метод.</b> Работает с классификацией, регрессией, мультиклассом, мульти-лейбл — с любой базовой моделью, у которой есть <code>predict_proba</code> или <code>predict</code>. Мета-модель выбирается независимо от базовых.</p>
      <p><b>Снижает variance через комбинацию ошибок.</b> Ошибки разных моделей частично некоррелированы — при усреднении через мета-модель они сокращаются, а «сигнал» сохраняется. Особенно заметно при разнородных базовых моделях (дерево + линейная + нейросеть).</p>
      <p><b>Дает «бесплатную» интерпретацию через коэффициенты мета-модели.</b> Если мета-модель — LogisticRegression или Ridge, её коэффициенты показывают «доверие» к каждой базовой модели. Это помогает понять, какие модели реально работают, а какие — балласт.</p>

      <h3>⚠️ Ограничения — и когда они реально бьют</h3>
      <p><b>Утечка через неправильные OOF-предсказания.</b> Если мета-признаки получены не out-of-fold, а на том же train — мета-модель увидит «чистые» предсказания и переобучится, на тесте будет хуже одиночных моделей. Это самая частая ошибка при реализации stacking вручную, и она даёт обманчиво хороший train-скор.</p>
      <p><b>Сложность реализации и стоимость ошибок.</b> При $K=5$ фолдов и $N=5$ базовых моделей — 25 обучений на train + 5 финальных fit на всём train + обучение мета-модели. Одна ошибка в индексах CV — и вся конструкция разваливается. Лучше использовать <code>sklearn.ensemble.StackingClassifier</code> или <code>mlxtend</code>, чем писать с нуля.</p>
      <p><b>Медленный инференс.</b> Каждый запрос проходит через все базовые модели плюс мета-модель. Если у тебя 10 базовых моделей с разной latency, итоговая латентность = сумма всех. Для real-time API с SLA &lt; 100 мс это часто неприемлемо без дистилляции.</p>
      <p><b>Сложность поддержки в продакшене.</b> При переобучении на новых данных нужно переобучить все $N+1$ моделей, протестировать каждую отдельно, потом стек. Мониторинг — на каждую модель свой. Типичная инженерная стоимость в 3-5 раз выше одиночной модели.</p>
      <p><b>Малый прирост при уже хороших базовых моделях.</b> Если твой одиночный LightGBM даёт 0.92 AUC, stacking даст 0.923-0.928 — то есть +0.3-0.8%. В продакшене это почти всегда не оправдывает 5х роста сложности. Stacking окупается либо на Kaggle, либо когда 0.5% = большие деньги.</p>
      <p><b>Низкая интерпретируемость.</b> Даже если мета-модель — LogisticRegression, объяснить конкретное предсказание клиенту практически невозможно: «смотрите, XGBoost сказал 0.7, CatBoost 0.65, а мета-модель дала вес 0.4 и 0.6». Для регуляторов (банки, медицина) это часто блокер.</p>

      <h3>🧭 Когда брать Stacking — и когда точно не стоит</h3>
      <table>
        <tr><th>✅ Бери Stacking когда</th><th>❌ НЕ бери когда</th></tr>
        <tr>
          <td>Kaggle или соревнование — последние 0.5-2% решают медаль</td>
          <td>Продакшен с жёстким SLA (&lt; 100 мс) без бюджета на дистилляцию</td>
        </tr>
        <tr>
          <td>Цена ошибки очень высока: fraud, медицина, критичные риски</td>
          <td>Регуляторные требования к объяснимости (банки, страхование)</td>
        </tr>
        <tr>
          <td>Базовые модели разнородны (дерево + линейная + нейросеть) и их ошибки некоррелированы</td>
          <td>Базовые модели почти одинаковы — прирост будет близок к нулю</td>
        </tr>
        <tr>
          <td>Достаточно данных (&gt; 5000 строк) для стабильного OOF</td>
          <td>Мало данных (&lt; 500 строк) — OOF слишком зашумлён, stacking проиграет одиночной модели</td>
        </tr>
        <tr>
          <td>Есть инженерный ресурс на поддержку множества моделей в продакшене</td>
          <td>MVP или быстрый прототип — сначала запусти одну модель и посмотри метрику</td>
        </tr>
        <tr>
          <td>Задача — мультимодальные данные (снимки + таблица + текст)</td>
          <td>Одиночный GBM уже даёт метрику, близкую к теоретическому максимуму</td>
        </tr>
        <tr>
          <td>Критична ROC-AUC или точность, latency и простота вторичны</td>
          <td>Задача online-обучения с непрерывным дообучением</td>
        </tr>
      </table>

      <h3>🔄 Альтернативы — что взять вместо и почему</h3>
      <ul>
        <li><b>Voting (Soft/Hard) Classifier</b> — если хочется быстрее: агрегация через среднее/голосование без обучения мета-модели. Легче в продакшене, почти вся выгода ансамблирования, без риска утечки через OOF. Типично даёт 70-90% прироста stacking.</li>
        <li><b>Blending (Holdout-based stacking)</b> — упрощённый stacking без CV: обучают базовые на одной части train, собирают мета-признаки на другой. Быстрее и проще stacking, но менее эффективно использует данные.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('gradient-boosting')">Один хорошо оттюненный GBM</a></b> (LightGBM/CatBoost) — если данных 5-500K строк и нет ресурса на поддержку множества моделей. Потеряешь 0.5-1.5% качества, сохранишь простоту.</li>
        <li><b>Model distillation</b> — обучить большой стек, потом дистиллировать в одну маленькую модель (LightGBM или MLP) через фит на soft labels. Получаешь 80-90% качества стека и latency одной модели.</li>
        <li><b><a class="glossary-link" onclick="App.selectTopic('random-forest')">Random Forest</a></b> — если нужен простой ансамбль без сложности stacking, данных мало и хочется устойчивости. Это уже ансамбль (bagging), просто менее мощный.</li>
      </ul>
    `,

    links: `
      <h3>📺 Видео</h3>
      <ul>
        <li><a href="https://www.youtube.com/watch?v=TuIgtitqJho" target="_blank">Ensemble Methods — stacking explained</a> — разбор stacking и OOF предсказаний</li>
      </ul>
      <h3>📖 Статьи</h3>
      <ul>
        <li><a href="https://habr.com/ru/search/?q=%D1%81%D1%82%D0%B5%D0%BA%D0%B8%D0%BD%D0%B3%20%D0%B0%D0%BD%D1%81%D0%B0%D0%BC%D0%B1%D0%BB%D1%8C%20%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D0%B5%D0%B9" target="_blank">Stacking на Habr</a> — практическое руководство по stacking с кодом</li>
        <li><a href="https://mlwave.com/kaggle-ensembling-guide/" target="_blank">Kaggle Ensembling Guide (MLWave)</a> — исчерпывающий гайд по ансамблированию для соревнований</li>
      </ul>
      <h3>📚 Документация</h3>
      <ul>
        <li><a href="https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.StackingClassifier.html" target="_blank">sklearn: StackingClassifier</a> — официальная документация по stacking в sklearn</li>
      </ul>
    `
  }
});
