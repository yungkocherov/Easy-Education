/* ==========================================================================
   Тест: k-Nearest Neighbors
   ========================================================================== */
App.registerQuiz('knn', {
  questions: [
    {
      prompt: `Две границы решения на одних и тех же данных. У одной k=1, у другой k=50. Сопоставь:`,
      figure: `
        <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
          <svg viewBox="0 0 240 200" style="max-width:240px;width:100%;">
            <text x="120" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Граница А</text>
            <rect x="10" y="20" width="220" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
            <path d="M230 38 L200 50 L210 70 L180 78 L195 95 L170 110 L185 125 L155 135 L175 155 L145 165 L160 180 L130 188 Z L130 188 L10 188 L10 38 Z" fill="#eef2ff" opacity="0.7"/>
            <path d="M230 38 L200 50 L210 70 L180 78 L195 95 L170 110 L185 125 L155 135 L175 155 L145 165 L160 180 L130 188" fill="none" stroke="#6366f1" stroke-width="1.8" stroke-linejoin="round"/>
            <!-- blue class points -->
            <circle cx="40" cy="60" r="5" fill="#6366f1"/>
            <circle cx="65" cy="95" r="5" fill="#6366f1"/>
            <circle cx="50" cy="140" r="5" fill="#6366f1"/>
            <circle cx="95" cy="75" r="5" fill="#6366f1"/>
            <circle cx="105" cy="125" r="5" fill="#6366f1"/>
            <circle cx="80" cy="170" r="5" fill="#6366f1"/>
            <circle cx="150" cy="155" r="5" fill="#6366f1"/>
            <!-- amber class points -->
            <circle cx="195" cy="50" r="5" fill="#f59e0b"/>
            <circle cx="175" cy="85" r="5" fill="#f59e0b"/>
            <circle cx="215" cy="110" r="5" fill="#f59e0b"/>
            <circle cx="165" cy="125" r="5" fill="#f59e0b"/>
            <circle cx="200" cy="155" r="5" fill="#f59e0b"/>
            <circle cx="180" cy="175" r="5" fill="#f59e0b"/>
            <circle cx="130" cy="60" r="5" fill="#f59e0b"/>
          </svg>
          <svg viewBox="0 0 240 200" style="max-width:240px;width:100%;">
            <text x="120" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Граница Б</text>
            <rect x="10" y="20" width="220" height="170" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
            <path d="M140 20 C 135 80, 130 130, 125 190 L10 190 L10 20 Z" fill="#eef2ff" opacity="0.7"/>
            <path d="M140 20 C 135 80, 130 130, 125 190" fill="none" stroke="#6366f1" stroke-width="1.8"/>
            <!-- same class points -->
            <circle cx="40" cy="60" r="5" fill="#6366f1"/>
            <circle cx="65" cy="95" r="5" fill="#6366f1"/>
            <circle cx="50" cy="140" r="5" fill="#6366f1"/>
            <circle cx="95" cy="75" r="5" fill="#6366f1"/>
            <circle cx="105" cy="125" r="5" fill="#6366f1"/>
            <circle cx="80" cy="170" r="5" fill="#6366f1"/>
            <circle cx="150" cy="155" r="5" fill="#f59e0b"/>
            <circle cx="195" cy="50" r="5" fill="#f59e0b"/>
            <circle cx="175" cy="85" r="5" fill="#f59e0b"/>
            <circle cx="215" cy="110" r="5" fill="#f59e0b"/>
            <circle cx="165" cy="125" r="5" fill="#f59e0b"/>
            <circle cx="200" cy="155" r="5" fill="#f59e0b"/>
            <circle cx="180" cy="175" r="5" fill="#f59e0b"/>
            <circle cx="130" cy="60" r="5" fill="#f59e0b"/>
          </svg>
        </div>
      `,
      options: [
        { text: 'А — k=1, Б — k=50', correct: true },
        { text: 'А — k=50, Б — k=1' },
        { text: 'Обе с одинаковым k, разница случайная' },
        { text: 'По границе нельзя понять k' },
      ],
      explain: `Маленькое <b>k=1</b> делает границу шумной и извилистой — каждая точка «тащит» её к себе. Большое k (например, 50) усредняет голоса многих соседей и даёт гладкую границу, близкую к линейной. Это классическая иллюстрация bias-variance: малое k = мало bias, много variance; большое k — наоборот.`,
    },

    {
      prompt: `Какая точность у kNN с <b>k=1</b> на обучающей выборке (train accuracy)?`,
      options: [
        { text: '100%', correct: true, explain: 'Каждая точка — свой единственный ближайший сосед (расстояние 0), значит предсказывает сама себя.' },
        { text: 'Зависит от данных' },
        { text: '~70–80%' },
        { text: '50%' },
      ],
      explain: `Поэтому <b>train accuracy у k=1 не говорит ни о чём</b> — она всегда идеальная. Смотреть надо на валидацию. Это хороший пример, почему нельзя оценивать модель по обучающим данным.`,
    },

    {
      prompt: `У тебя признаки: <code>рост</code> (1.5–2.0 м) и <code>зарплата</code> (30000–300000 ₽). Ты применяешь kNN без предобработки. Что произойдёт?`,
      options: [
        { text: 'Зарплата полностью задавит рост — расстояния определяются только ей', correct: true },
        { text: 'Модель нормализует признаки сама' },
        { text: 'Ничего, kNN инвариантен к масштабу' },
        { text: 'Поделится на NaN и упадёт' },
      ],
      explain: `kNN считает <b>евклидово расстояние</b>: разница в зарплате между двумя людьми (скажем, 20 000 ₽) вносит в расстояние вклад ~20 000², а разница в росте (0.1 м) — 0.01. Рост просто исчезает. Всегда масштабируй признаки перед kNN — StandardScaler или MinMaxScaler.`,
    },

    {
      prompt: `Зелёная точка «?» — новый объект. Для неё ближайший сосед — оранжевый <b>выброс</b>. Что изменится, если перейти с <b>k=1</b> на <b>k=5</b>?`,
      figure: `
        <svg viewBox="0 0 360 240" style="max-width:360px;width:100%;">
          <rect x="20" y="20" width="320" height="210" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
          <!-- amber cluster far right -->
          <circle cx="290" cy="60" r="6" fill="#f59e0b"/>
          <circle cx="310" cy="85" r="6" fill="#f59e0b"/>
          <circle cx="275" cy="100" r="6" fill="#f59e0b"/>
          <circle cx="305" cy="140" r="6" fill="#f59e0b"/>
          <circle cx="280" cy="180" r="6" fill="#f59e0b"/>
          <circle cx="315" cy="200" r="6" fill="#f59e0b"/>
          <!-- blue cluster around query -->
          <circle cx="110" cy="90" r="6" fill="#6366f1"/>
          <circle cx="135" cy="115" r="6" fill="#6366f1"/>
          <circle cx="90" cy="135" r="6" fill="#6366f1"/>
          <circle cx="130" cy="165" r="6" fill="#6366f1"/>
          <circle cx="170" cy="130" r="6" fill="#6366f1"/>
          <!-- amber OUTLIER inside blue region -->
          <circle cx="155" cy="145" r="6" fill="#f59e0b" stroke="#7c2d12" stroke-width="1.5"/>
          <text x="168" y="140" font-size="10" fill="#7c2d12" font-weight="600">выброс</text>
          <!-- query ? -->
          <circle cx="140" cy="135" r="9" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
          <text x="140" y="139" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">?</text>
        </svg>
      `,
      options: [
        { text: 'k=5 учтёт 4 синих + 1 выброс → класс синий. Модель устойчивее к шуму.', correct: true },
        { text: 'k=5 всё равно предскажет оранжевый — ближайший сосед всегда побеждает' },
        { text: 'k=5 ничего не изменит — голосование будет случайным' },
        { text: 'k=5 уменьшит точность, всегда хуже k=1' },
      ],
      explain: `Это основной плюс «k побольше»: одиночные выбросы тонут в большинстве. Но платим мы <b>смазанной границей</b> — слишком большое k теряет локальные детали. Поэтому k обычно подбирают по кросс-валидации.`,
    },

    {
      prompt: `В документации говорят: «kNN обучается мгновенно, а предсказывает медленно». Почему?`,
      options: [
        { text: '«Обучение» — это просто запоминание точек. На предсказании приходится каждый раз искать ближайших среди всех обучающих объектов.', correct: true },
        { text: 'Потому что kNN использует градиентный спуск, который сходится медленно' },
        { text: 'Потому что kNN обучает нейросеть под капотом' },
        { text: 'Это ошибка — kNN обучается долго и предсказывает быстро' },
      ],
      explain: `kNN — <b>lazy learner</b>: нет ни весов, ни параметров. Фаза «обучения» = сохранение датасета. Каждое предсказание требует O(N·d) операций (или O(log N) с KD-tree на небольших d). На миллионах точек это становится проблемой.`,
    },

    {
      prompt: `В пространстве <b>100 признаков</b> все точки оказываются почти на одинаковом расстоянии от любой заданной. Это явление называют «проклятие размерности». Как оно влияет на kNN?`,
      figure: `
        <svg viewBox="0 0 420 180" style="max-width:420px;width:100%;">
          <text x="105" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">d = 2: есть ближние и дальние</text>
          <text x="315" y="16" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">d = 100: все «одинаково далеко»</text>
          <!-- Left: 2D scatter, query center -->
          <rect x="10" y="25" width="190" height="140" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
          <circle cx="105" cy="95" r="8" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>
          <text x="105" y="99" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">?</text>
          <circle cx="60" cy="55" r="5" fill="#6366f1"/>
          <circle cx="145" cy="50" r="5" fill="#6366f1"/>
          <circle cx="40" cy="140" r="5" fill="#f59e0b"/>
          <circle cx="170" cy="130" r="5" fill="#f59e0b"/>
          <circle cx="90" cy="65" r="5" fill="#6366f1"/>
          <line x1="105" y1="95" x2="90" y2="65" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3,2"/>
          <line x1="105" y1="95" x2="40" y2="140" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="3,2"/>
          <text x="70" y="80" font-size="9" fill="#10b981" font-weight="600">ближе</text>
          <text x="45" y="125" font-size="9" fill="#ef4444" font-weight="600">дальше</text>
          <!-- Right: distance histogram -->
          <rect x="220" y="25" width="190" height="140" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
          <line x1="235" y1="150" x2="400" y2="150" stroke="#94a3b8" stroke-width="1"/>
          <text x="315" y="162" text-anchor="middle" font-size="9" fill="#64748b">расстояние</text>
          <!-- tight bell -->
          <rect x="300" y="100" width="8" height="50" fill="#ef4444" opacity="0.75"/>
          <rect x="308" y="75" width="8" height="75" fill="#ef4444" opacity="0.85"/>
          <rect x="316" y="60" width="8" height="90" fill="#ef4444" opacity="0.95"/>
          <rect x="324" y="80" width="8" height="70" fill="#ef4444" opacity="0.85"/>
          <rect x="332" y="105" width="8" height="45" fill="#ef4444" opacity="0.75"/>
          <text x="320" y="52" text-anchor="middle" font-size="9" fill="#7f1d1d" font-weight="600">всё здесь</text>
        </svg>
      `,
      options: [
        { text: 'Плохо: kNN опирается на разницу «близко / далеко». Если все соседи равноудалены — нет смысла спрашивать именно ближайших.', correct: true },
        { text: 'Хорошо: больше признаков → больше информации → точнее работает' },
        { text: 'Никак не влияет — kNN устойчив к размерности' },
        { text: 'Только замедляет, но точность не падает' },
      ],
      explain: `В высокой размерности евклидовы расстояния <b>концентрируются</b>: относительная разница между ближайшим и дальнейшим соседом стремится к нулю. Соседство перестаёт быть информативным. Лекарство: снижать размерность (PCA/UMAP), использовать специализированные метрики или другие модели.`,
    },

    {
      prompt: `Когда kNN точно <b>не</b> твой первый выбор?`,
      options: [
        { text: 'Датасет — 50 млн объектов, латентность предсказания должна быть &lt;50 мс', correct: true },
        { text: 'Ты не знаешь, как устроены границы классов' },
        { text: 'Нужно быстрое прототипирование на маленьком датасете' },
        { text: 'Признаков мало (2–10), выборка тоже небольшая' },
      ],
      explain: `kNN для каждого запроса обходит всю выборку. На больших данных + жёстких требованиях по задержке это смерть. Варианты: ANN-индексы (FAISS, Annoy), либо просто другую модель (логрег, бустинг). А для маленьких данных с неизвестной структурой kNN как раз хорош — работает «из коробки» без обучения.`,
    },
  ],
});
