/* ==========================================================================
   Глоссарий: Early Stopping
   ========================================================================== */
App.registerTopic({
  id: 'glossary-early-stopping',
  category: 'glossary',
  title: 'Early Stopping',
  summary: 'Остановка обучения, когда качество на валидации перестаёт улучшаться. Бесплатная регуляризация — защита от переобучения без дополнительных формул.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Ты учишь нейросеть 100 эпох. На графике train loss монотонно падает. Но на validation loss начинает расти после 30-й эпохи — модель переобучается, <b>заучивает шум</b> тренировочных данных.</p>
        <p><b>Early stopping</b> — это правило: «Следи за val loss. Если он перестал улучшаться N эпох подряд — остановись и откатись к лучшей версии». Просто как палка, но работает как мощная регуляризация.</p>
      </div>

      <h3>📐 Алгоритм</h3>
      <ol>
        <li>Разбей данные на train / val (обычно 80/20).</li>
        <li>Обучай модель, после каждой эпохи вычисляй val loss.</li>
        <li>Храни лучшую модель (best checkpoint) — веса на эпохе с минимальным val loss.</li>
        <li>Счётчик <b>patience</b>: сколько эпох подряд val loss не улучшается.</li>
        <li>Если patience превышен — остановить обучение, вернуть best checkpoint.</li>
      </ol>

      <h3>⚙️ Параметры</h3>
      <ul>
        <li><b>patience</b>: сколько «плохих» эпох терпеть. Типично 5-20.</li>
        <li><b>min_delta</b>: минимальное улучшение, считающееся значимым (например, 0.001). Предотвращает остановку из-за шума.</li>
        <li><b>monitor</b>: что отслеживать — val_loss, val_accuracy, val_f1.</li>
        <li><b>restore_best_weights</b>: вернуть ли веса лучшей эпохи (обычно да).</li>
      </ul>

      <h3>💡 Почему это регуляризация</h3>
      <p>Early stopping ограничивает <b>число итераций оптимизации</b>. Интуитивно: у модели не хватает «времени» выучить шум. Формально можно показать, что это эквивалентно L2 регуляризации при определённых условиях (для линейных моделей).</p>
      <p>Преимущества:</p>
      <ul>
        <li>Не требует тюнинга силы регуляризации ($\\lambda$).</li>
        <li>Автоматически адаптируется к сложности задачи.</li>
        <li>Бесплатно — просто перестали обучать.</li>
      </ul>

      <h3>📊 Типичная картина</h3>
      <div class="calc">Эпоха | Train Loss | Val Loss | Счётчик patience
  1   | 0.80       | 0.85     | —
  5   | 0.45       | 0.52     | —
 10   | 0.22       | 0.38     | 0  (новый best!)
 12   | 0.18       | 0.39     | 1  (не улучшилось)
 14   | 0.15       | 0.40     | 2
 16   | 0.12       | 0.42     | 3
 18   | 0.10       | 0.45     | 4
 20   | 0.08       | 0.48     | 5  ← patience=5 достигнут, стоп!

Восстанавливаем веса с эпохи 10, где был минимум val loss.</div>

      <h3>🎯 Использование в sklearn и ML-библиотеках</h3>

      <h4>XGBoost / LightGBM</h4>
      <div class="calc">model = xgb.XGBClassifier(n_estimators=10000)
model.fit(X_train, y_train,
          eval_set=[(X_val, y_val)],
          early_stopping_rounds=50)
# Модель остановится автоматически на оптимальном числе деревьев.</div>

      <h4>Keras / TensorFlow</h4>
      <div class="calc">callback = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True
)
model.fit(X_train, y_train, epochs=100,
          validation_data=(X_val, y_val),
          callbacks=[callback])</div>

      <h4>PyTorch (вручную)</h4>
      <div class="calc">best_loss, patience_counter = float('inf'), 0
for epoch in range(100):
    train(...)
    val_loss = validate(...)
    if val_loss < best_loss - 0.001:
        best_loss = val_loss
        patience_counter = 0
        torch.save(model.state_dict(), 'best.pt')
    else:
        patience_counter += 1
        if patience_counter >= 10:
            break
model.load_state_dict(torch.load('best.pt'))</div>

      <h3>⚠️ Частые ошибки</h3>
      <ul>
        <li><b>Использование test set для early stopping</b> → утечка информации. Используй отдельный val set.</li>
        <li><b>Слишком маленький patience</b> (2-3) → останавливаешься на случайном шуме до того, как модель реально сошлась.</li>
        <li><b>Нет min_delta</b> → много ложных «улучшений» на 0.0001.</li>
        <li><b>Не сохраняешь best weights</b> → на момент остановки loss уже выше, чем был в оптимуме.</li>
        <li><b>Мониторишь train loss</b> → он всегда падает, early stopping никогда не сработает.</li>
      </ul>

      <h3>🏆 Где особенно полезно</h3>
      <ul>
        <li><b>Gradient Boosting</b>: обычно ставят большое $n_\\text{estimators}$ + early stopping. Автоматически находит оптимальное число деревьев.</li>
        <li><b>Fine-tuning LLM</b>: предотвращает catastrophic forgetting и переобучение.</li>
        <li><b>Нейросети на малых датасетах</b>: легко переобучиться за 10 эпох.</li>
        <li><b>Любое обучение, где epoch-count — гиперпараметр</b>: вместо подбора сделай early stopping.</li>
      </ul>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('regularization')">Регуляризация</a> — early stopping как её разновидность</li>
        <li><a onclick="App.selectTopic('glossary-overfitting')">Переобучение</a></li>
        <li><a onclick="App.selectTopic('bias-variance')">Bias-variance</a> — где на U-кривой оптимум</li>
        <li><a onclick="App.selectTopic('cross-validation')">Cross-validation</a></li>
      </ul>
    `,
    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Early_stopping" target="_blank">Wikipedia: Early stopping</a></li>
      </ul>
    `
  }
});
