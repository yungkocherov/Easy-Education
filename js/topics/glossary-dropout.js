/* ==========================================================================
   Глоссарий: Dropout
   ========================================================================== */
App.registerTopic({
  id: 'glossary-dropout',
  category: 'glossary',
  title: 'Dropout',
  summary: 'Случайно «выключать» часть нейронов при обучении. Мощная регуляризация для нейросетей — превращает одну сеть в ансамбль.',

  tabs: {
    theory: `
      <div class="intuition">
        <div class="intuition-title">Аналогия</div>
        <p>Представь команду из 10 футболистов, которая всегда играет в одном и том же составе. Они так привыкают друг к другу, что если кого-то заменить — команда разваливается. Это <b>переобучение</b>: слишком много co-adaptation.</p>
        <p>А теперь представь, что тренер случайно отсылает на скамейку каждого третьего игрока <b>каждую тренировку</b>. Команда вынуждена играть разными составами, каждый должен уметь больше. В итоге получается <b>универсальная, устойчивая</b> команда.</p>
        <p>Dropout делает то же самое с нейронами: случайно «вырубает» часть из них при обучении. Нейроны не могут полагаться только друг на друга — каждый учится делать что-то полезное <b>сам по себе</b>.</p>
      </div>

      <h3>📐 Как работает</h3>
      <p>При обучении, для каждого forward pass и для каждого нейрона:</p>
      <ul>
        <li>С вероятностью $p$ (например, 0.5) умножь его выход на 0 («выключен»).</li>
        <li>С вероятностью $1-p$ умножь на $1/(1-p)$ (inverted dropout, компенсирует уменьшение суммы).</li>
      </ul>
      <p>На inference dropout <b>выключен</b>: используются все нейроны без масштабирования.</p>

      <h3>🔢 Формула</h3>
      <p>Обычный слой: $h = \\sigma(Wx + b)$.</p>
      <p>Dropout слой: $h = \\text{mask} \\odot \\sigma(Wx + b) / (1-p)$, где mask ~ Bernoulli($1-p$).</p>

      <h3>🎯 Типичные значения $p$</h3>
      <ul>
        <li><b>Входной слой</b>: $p = 0.1$-$0.2$ (низкий, не вырубай сразу много информации).</li>
        <li><b>Скрытые слои</b>: $p = 0.3$-$0.5$ (классика для FC-слоёв).</li>
        <li><b>Сверточные слои</b>: $p = 0.1$-$0.3$ (spatial dropout, или лучше просто BatchNorm).</li>
        <li><b>Embeddings (NLP)</b>: $p = 0.1$-$0.3$.</li>
      </ul>

      <h3>⚙️ Train vs inference</h3>
      <table>
        <tr><th>Режим</th><th>Что происходит</th></tr>
        <tr><td>Train</td><td>Вырубаем случайные нейроны, компенсируем 1/(1-p)</td></tr>
        <tr><td>Inference</td><td>Используем ВСЕ нейроны, без вырубания</td></tr>
      </table>
      <p>Частая ошибка: забыть переключить сеть в eval mode на инференсе (<code>model.eval()</code> в PyTorch). Тогда dropout продолжит работать, и предсказания будут случайными.</p>

      <h3>💡 Почему работает — интерпретации</h3>
      <ul>
        <li><b>Ансамбль</b>: обучая с dropout, ты неявно обучаешь $2^N$ разных подсетей (где $N$ — число нейронов). На инференсе получается «усреднение» этих подсетей.</li>
        <li><b>Бороться с co-adaptation</b>: нейроны не могут «делегировать» работу соседу, потому что сосед может быть выключен.</li>
        <li><b>Добавляет шум</b>: как любая регуляризация, увеличивает bias ↓ variance.</li>
        <li><b>Равносильно Gaussian-шуму</b> на активациях (в некоторых предельных случаях).</li>
      </ul>

      <h3>🔢 Пример: MLP с dropout</h3>
      <div class="calc">class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.drop1 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(256, 128)
        self.drop2 = nn.Dropout(0.3)
        self.fc3 = nn.Linear(128, 10)
    def forward(self, x):
        x = F.relu(self.fc1(x))
        x = self.drop1(x)
        x = F.relu(self.fc2(x))
        x = self.drop2(x)
        return self.fc3(x)

model.train()  # dropout активен
model.eval()   # dropout выключен</div>

      <h3>🎨 Варианты dropout</h3>
      <ul>
        <li><b>Standard Dropout</b>: независимо «вырубает» отдельные нейроны.</li>
        <li><b>Spatial Dropout (CNN)</b>: вырубает целые feature maps, сохраняя пространственные корреляции.</li>
        <li><b>DropConnect</b>: вырубает отдельные <b>веса</b>, а не нейроны.</li>
        <li><b>Variational Dropout</b>: одинаковая маска на все шаги RNN (для рекуррентных сетей).</li>
        <li><b>Scheduled Dropout</b>: увеличивает $p$ во время обучения.</li>
        <li><b>Stochastic Depth</b>: случайно «выключает» целые residual blocks.</li>
      </ul>

      <h3>⚠️ Dropout в современных архитектурах</h3>
      <ul>
        <li><b>CNN</b>: сегодня часто заменяется BatchNorm + data augmentation.</li>
        <li><b>Transformer</b>: dropout остался — в attention weights и в FFN блоках.</li>
        <li><b>LLM (GPT, BERT)</b>: используют dropout при pretraining, но на inference он не активен.</li>
        <li><b>ResNet</b>: dropout в основных блоках не используется (residual + BN достаточно).</li>
      </ul>

      <h3>📊 Эффект на accuracy</h3>
      <p>В классическом эксперименте Hinton et al. (2012) dropout улучшил ошибку MNIST с 1.62% до 1.35% — значительный прирост без изменения архитектуры. На ImageNet — прирост в ~2% top-5 accuracy.</p>

      <h3>🔗 Связанные темы</h3>
      <ul>
        <li><a onclick="App.selectTopic('regularization')">Регуляризация</a></li>
        <li><a onclick="App.selectTopic('glossary-overfitting')">Переобучение</a></li>
        <li><a onclick="App.selectTopic('neural-network')">Нейронные сети</a></li>
        <li><a onclick="App.selectTopic('glossary-batchnorm')">BatchNorm</a> — частично заменяет dropout</li>
      </ul>
    `,
    links: `
      <h3>📖 Ресурсы</h3>
      <ul>
        <li><a href="https://jmlr.org/papers/v15/srivastava14a.html" target="_blank">Srivastava et al. (2014): Dropout paper</a></li>
      </ul>
    `
  }
});
