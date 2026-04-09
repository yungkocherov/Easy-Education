<p align="center">
  <img src="https://img.shields.io/badge/topics-57-blue?style=for-the-badge" alt="57 topics"/>
  <img src="https://img.shields.io/badge/language-Russian-green?style=for-the-badge" alt="Russian"/>
  <img src="https://img.shields.io/badge/no_build-vanilla_JS-orange?style=for-the-badge" alt="Vanilla JS"/>
</p>

# Easy Education — DS / ML / DL

**Интерактивный учебник** по Data Science, Machine Learning и Deep Learning.  
57 тем с теорией, пошаговыми примерами, интерактивными симуляциями и Python-кодом — прямо в браузере, без установки.

> **[Открыть учебник онлайн](https://yungkocherov.github.io/Easy-Education/)**

---

## Что делает этот проект особенным

- **Аналогии для каждой темы** — сначала интуиция, потом формулы
- **Пошаговые примеры с конкретными числами** — не абстрактные "пусть X", а "8 квартир с площадью 45, 52, 68..."
- **Интерактивные симуляции** — двигай слайдеры, смотри как меняется результат
- **Python-код** — готовые примеры на sklearn, PyTorch, statsmodels
- **Математика** — формулы в KaTeX, красиво и понятно
- **Маршруты обучения** — 3 пути для разных целей (аналитик / ML / DL)
- **Prerequisites** — каждая сложная тема подсказывает, что стоит прочитать перед ней

---

## 57 тем в 7 категориях

### Статистика (7 тем)
Описательная статистика · Теория вероятности · Распределения · ЦПТ · Проверка гипотез · Корреляция · Временные ряды

### A/B тесты и аналитика (9 тем)
Введение в A/B · Z-тест · T-тест · Хи-квадрат · Манн-Уитни · Байесовский A/B · Множественные сравнения · Причинный вывод · Product Analytics

### Основы ML (12 тем)
Что такое ML · Feature Engineering · Обработка пропусков · Метрики классификации · ROC-AUC · SHAP · Кросс-валидация · Stacking · Bias-Variance · Регуляризация · SMOTE · Подбор гиперпараметров · Рекомендательные системы

### Регрессия (6 тем)
Линейная · KNN · Решающее дерево · Random Forest · Gradient Boosting · SVR

### Классификация (8 тем)
Логистическая регрессия · KNN · Решающее дерево · Random Forest · Gradient Boosting · SVM · Наивный Байес · XGBoost / LightGBM / CatBoost

### Кластеризация и снижение размерности (5 тем)
K-Means · DBSCAN · PCA · t-SNE / UMAP · Isolation Forest

### Нейронные сети (9 тем)
Градиентный спуск · Перцептрон · MLP · CNN · Основы NLP · RNN / LSTM · Transformer · Transfer Learning · Генеративные модели

---

## Маршруты обучения

| Маршрут | Для кого | Ключевые темы |
|---------|----------|---------------|
| **Аналитик данных** | Аналитики, продакт-менеджеры | Статистика → A/B тесты → Product Analytics |
| **ML-инженер** | Data Scientists, ML-инженеры | Основы ML → Регрессия → Классификация → Кластеризация |
| **DL-инженер** | Разработчики нейросетей | Gradient Descent → Перцептрон → MLP → CNN → RNN → Transformer |

---

## Что внутри каждой темы

| Вкладка | Описание |
|---------|----------|
| **Теория** | Аналогия → интуиция → объяснение → формулы |
| **Примеры** | Пошаговые расчёты на конкретных данных |
| **Симуляция** | Интерактивные слайдеры и графики |
| **Python** | Готовый код (sklearn, PyTorch, statsmodels) |
| **Применение** | Где используется на практике |
| **Плюсы / Минусы** | Когда работает, когда нет |
| **Математика** | Формулы и доказательства |
| **Дополнительно** | Deep-dive в продвинутые аспекты |
| **Ссылки** | Внешние ресурсы для углубления |

---

## Быстрый старт

### Онлайн
Просто откройте: **[yungkocherov.github.io/Easy-Education](https://yungkocherov.github.io/Easy-Education/)**

### Локально
```bash
git clone https://github.com/yungkocherov/Easy-Education.git
cd Easy-Education
python -m http.server 8000
# Открыть http://localhost:8000
```

Или на Windows: запустите `start.bat`.

---

## Технологии

| Технология | Назначение |
|-----------|-----------|
| Vanilla JavaScript | Ядро приложения, навигация, симуляции |
| [KaTeX](https://katex.org/) | Рендеринг математических формул |
| [Chart.js](https://www.chartjs.org/) | Графики и визуализации |
| Canvas API | Кастомные интерактивные симуляции |
| CSS Grid | Адаптивный layout |
| GitHub Pages | Хостинг |

Без сборки, без npm, без фреймворков. Открыл — работает.

---

## Структура проекта

```
Easy-Education/
├── index.html              # Единая точка входа (SPA)
├── start.bat               # Запуск локального сервера (Windows)
├── css/
│   └── styles.css          # Все стили
└── js/
    ├── app.js              # Ядро: навигация, табы, утилиты, Chart.js менеджер
    └── topics/             # 57 файлов — по одному на тему
        ├── intro-ml.js
        ├── descriptive-stats.js
        ├── ...
        └── generative-models.js
```

---

## Как добавить новую тему

1. Создайте `js/topics/my-topic.js`:

```javascript
App.registerTopic({
  id: 'my-topic',
  category: 'ml-basics',  // stats | ab | ml-basics | ml-reg | ml-cls | ml-unsup | dl
  title: 'Название темы',
  summary: 'Краткое описание в одну строку.',
  tabs: {
    theory: `<div class="intuition">...</div> <h3>...</h3>`,
    examples: [
      { title: 'Пример 1', content: `<h4>Задача</h4>...` },
    ],
    simulation: { html: `<div>...</div>`, init(container) { /* JS */ } },
    python: `<pre><code>...</code></pre>`,
    applications: `<h3>Применение</h3>...`,
    proscons: `<h3>Плюсы</h3>...<h3>Минусы</h3>...`,
    links: `<h3>Ссылки</h3><ul>...</ul>`,
  },
});
```

2. Добавьте `<script src="js/topics/my-topic.js"></script>` в `index.html`.
3. Готово — тема появится в навигации.

---

## Автор

**Иван Кочеров** — [@yan_kocherov](https://t.me/yan_kocherov)

Контент создан с помощью AI (Claude, Anthropic) и тщательно проверен.

---

## Лицензия

MIT — используйте как хотите. Если проект оказался полезен, поставьте звёздочку.
