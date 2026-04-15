# Easy Education — памятка для Claude

Интерактивный учебник по DS/ML/DL на русском. Vanilla JS, без сборки, без npm. Всё грузится через `<script src>` в `index.html`.

**Прод:** https://yungkocherov.github.io/Easy-Education/ (GitHub Pages, деплой из `main`).

## Архитектура

- `index.html` — SPA, единая точка входа. Явно перечисляет все топики в `<script src="js/topics/...">` теги (порядок = порядок отображения в навигации).
- `js/app.js` — ядро: `App.registerTopic()`, навигация, рендер вкладок, утилиты.
- `js/topics/*.js` — по одному файлу на тему. Каждый файл вызывает `App.registerTopic({...})` при загрузке.
- `css/styles.css` — все стили.

Нет сборки, нет фреймворков. Любая синтаксическая ошибка в топик-файле убивает загрузку темы целиком. Проверять через `node --check js/topics/<file>.js`.

## Структура топика

```js
App.registerTopic({
  id: 'my-topic',              // kebab-case, используется в URL и App.selectTopic('my-topic')
  category: 'ml-cls',          // см. список ниже
  title: 'Название',
  summary: 'Одна строка для шапки.',
  tabs: {
    theory:       `<h3>...</h3>`,                          // string (HTML)
    examples:     [{ title: '...', content: `...` }, ...], // array (подвкладки)
    simulation:   { html: `...`, init(container) { ... } },
    python:       `<pre><code>...</code></pre>`,
    applications: `<h3>🎯 Где применяется...</h3>`,
    extra:        `<h3>...</h3>`,
    links:        `<h3>...</h3>`,
  },
});
```

**Категории** (`js/app.js:8`): `stats`, `ab`, `ml-basics`, `ml-reg`, `ml-cls`, `ml-unsup`, `dl`, `glossary`.

**Порядок вкладок** фиксирован в [js/app.js:77-85](js/app.js#L77-L85) (`tabLabels`). Ключи, которых нет в `topic.tabs`, не отображаются.

**Вкладка "Применение"** объединяет 5 блоков: `🎯 Где применяется / ✅ Сильные стороны / ⚠️ Ограничения / 🧭 Когда применять — когда не стоит (таблица) / 🔄 Альтернативы`. Старой вкладки `proscons` больше нет — она была слита в `applications` (см. коммит `c26d70e`).

## Симуляции

Симуляция — одна из ключевых частей проекта. Цель: визуально объяснить концепцию через интерактив.

```js
simulation: {
  html: `
    <div class="sim-container">
      <div class="sim-controls" id="mysim-controls"></div>
      <div class="sim-output">
        <div class="sim-chart-wrap"><canvas id="mysim-chart"></canvas></div>
        <div class="sim-stats" id="mysim-stats"></div>
      </div>
    </div>
  `,
  init(container) {
    const controls = container.querySelector('#mysim-controls');
    const cParam = App.makeControl('range', 'mysim-param', 'Параметр', { min: 0, max: 10, step: 0.1, value: 5 });
    controls.appendChild(cParam.wrap);

    const chart = new Chart(container.querySelector('#mysim-chart'), { /* ... */ });
    App.registerChart(chart);  // ОБЯЗАТЕЛЬНО — иначе утечёт при смене темы

    cParam.input.addEventListener('input', () => { /* update */ });
  },
}
```

**Инструменты:**
- **Chart.js** — предпочтительно для графиков. Всегда вызывать `App.registerChart(chart)` после создания, иначе canvas утекает при смене темы (`app.js:190`).
- **Canvas 2D** — для кастомных симуляций (K-Means, DBSCAN, Perceptron).
- **SVG** — для статичных иллюстраций в теории; для симуляций редко.
- **`App.makeControl(type, id, label, opts)`** — создаёт стандартный слайдер/select (`app.js:543`). Возвращает `{wrap, input}`.
- **`App.Util`** — `linspace`, `randn`, `normalSample`, `mean`, `std`, `quantile`, `histogram`, `normalPDF`, генераторы SVG-path для Normal/Exponential/LogNormal/Beta/t-распределений.

**Качество симуляции:** должна давать интуицию, которую нельзя получить чтением. Если симуляция просто показывает статичный график без интерактива — это уже не симуляция. Слайдеры должны менять *концептуально важный* параметр (k в K-Means, α в L1/L2, bin-size в гистограмме), а не косметику.

## Ссылки между темами

Внутренние ссылки — через `onclick="App.selectTopic('topic-id')"`. Для подсветки в стиле "термин глоссария":

```html
<a class="glossary-link" onclick="App.selectTopic('glossary-attention')">attention</a>
```

## Грабли

1. **Одинарные кавычки в `summary:` / `title:`.** Нельзя писать `summary: 'text with <a onclick="App.selectTopic('id')">link</a>'` — внутренние `'` ломают строку. Либо экранировать (`\'`), либо использовать backticks: `` summary: `...` ``.

2. **Backticks внутри template literal.** Если в `theory:` или `simulation:` (которые обёрнуты в `` ` ``) нужна подстрока типа `` `auto_arima` `` — экранируй как `\``, или используй `<code>auto_arima</code>`. Сырой backtick закрывает template literal.

3. **LaTeX внутри template literal.** Нужно двойное экранирование: `$\\alpha$`, `$\\sigma^2$`, `$\\to$`. Одинарный `\` съедается JS-парсером.

4. **HTML-спецсимволы внутри `<pre>` или кода.** `<`, `>`, `&` → `&lt;`, `&gt;`, `&amp;`.

5. **Chart.js без регистрации.** Забыл `App.registerChart(chart)` → при смене темы canvas не убьётся, Chart.js выкинет ошибку `Canvas is already in use`.

6. **`<script>` внутри HTML-строки вкладки.** Инлайн `<script>` выполняется через `executeInlineScripts` (`app.js:112`), но это дорого и неудобно. Лучше всегда использовать `simulation: { init(container) { ... } }`.

## Проверка перед коммитом

```bash
# Синтаксис всех топиков
for f in js/topics/*.js; do node --check "$f" 2>&1 | grep -q SyntaxError && echo "BROKEN: $f"; done

# Проверка, что файл подключён в index.html
grep 'topics/my-topic.js' index.html
```

Нет тестов, нет линтера — визуально проверять в браузере (`python -m http.server 8000` или `start.bat`).

## Стиль коммитов

Смотри `git log` — короткий императив, часто на русском, без префиксов `feat:`/`fix:`. Пример: `Fix 10 broken example charts with smooth computed curves`.

## Язык

Весь пользовательский контент — на русском. Код, комментарии, идентификаторы — английские. Тон образовательный, casual-technical: "Разбиение идёт по порогам, а не по расстояниям. Можно смешивать цену в рублях и возраст — дереву всё равно."
