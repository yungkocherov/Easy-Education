# Easy Education — DS / ML / DL

Интерактивный учебный сервис по Data Science, Machine Learning и Deep Learning с наглядными симуляциями прямо в браузере.

## Что внутри

**30 тем** в 4 категориях:

### Статистика
- Описательная статистика
- Распределения (Normal, Binomial, Poisson, Exp, Uniform)
- Центральная предельная теорема
- Проверка гипотез
- Корреляция и ковариация

### Основы ML
- Метрики классификации (Precision, Recall, F1)
- ROC-AUC и PR-AUC
- Кросс-валидация
- Bias-Variance Tradeoff
- Регуляризация (L1, L2, ElasticNet)
- Дисбаланс классов и SMOTE

### Модели ML
- Линейная регрессия
- Логистическая регрессия
- k-Nearest Neighbors
- Решающее дерево
- Random Forest
- Gradient Boosting
- SVM (с разными ядрами)
- Байесовские модели (Naive Bayes, posterior updating)
- K-Means
- DBSCAN
- PCA
- Isolation Forest

### Нейронные сети
- Градиентный спуск
- Перцептрон
- MLP (с настоящим backprop в браузере)
- CNN (свёртки)
- RNN / LSTM
- Transformer (attention heatmap)

## Что в каждой теме

7 вкладок:
1. **Теория** — объяснение идеи
2. **Примеры** — задачи на цифрах
3. **Симуляция** — интерактив с настраиваемыми параметрами
4. **Применение** — где используется
5. **Плюсы / Минусы** — когда работает, когда нет
6. **Математика** — формулы
7. **Дополнительно** — тонкости, ловушки, связи с другими темами

## Как запустить

Просто открыть `index.html` в браузере. Либо через локальный сервер:

```bash
python -m http.server 8000
```
И открыть http://localhost:8000

## Технологии

- Чистый HTML/CSS/JavaScript (без сборки)
- [KaTeX](https://katex.org/) для формул
- [Chart.js](https://www.chartjs.org/) для графиков
- Canvas API для кастомных симуляций

## Структура

```
.
├── index.html
├── css/styles.css
├── js/
│   ├── app.js               # ядро (навигация, табы, утилиты)
│   └── topics/              # по файлу на тему
└── README.md
```

## Как добавить новую тему

Создай `js/topics/my-topic.js`:
```js
App.registerTopic({
  id: 'my-topic',
  category: 'ml',  // stats | ml-basics | ml | dl
  title: 'Название',
  summary: 'Краткое описание',
  tabs: {
    theory: `<h3>...</h3>`,
    examples: `...`,
    simulation: { html: `...`, init(container) { /* ... */ } },
    applications: `...`,
    proscons: `...`,
    math: `...`,
    extra: `...`,
  },
});
```
И добавь `<script>` в `index.html`.
