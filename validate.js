#!/usr/bin/env node
/* ==========================================================================
   Easy Education — sanity checker. Без npm, без зависимостей.
   Запуск: node validate.js
   Exit 0 — всё ок, exit 1 — есть ошибки.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT = __dirname;
const TOPICS_DIR = path.join(ROOT, 'js', 'topics');
const QUIZ_DIR = path.join(ROOT, 'js', 'quiz');
const INDEX_HTML = path.join(ROOT, 'index.html');

const VALID_CATEGORIES = new Set([
  'stats', 'ab', 'ml-basics', 'ml-reg', 'ml-cls', 'ml-unsup', 'dl', 'glossary',
]);
const REQUIRED_FIELDS = ['id', 'title', 'category', 'tabs'];
const VALID_TAB_KEYS = new Set([
  'theory', 'examples', 'simulation', 'python', 'applications', 'extra', 'links',
]);

const errors = [];
const warnings = [];
const topics = new Map();  // id → { file, category, title, tabs }

function err(file, msg)  { errors.push(`${file}: ${msg}`); }
function warn(file, msg) { warnings.push(`${file}: ${msg}`); }

/* ---------- 1. Парсим все топики через sandbox ---------- */

const topicFiles = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.js')).sort();

for (const file of topicFiles) {
  const filePath = path.join(TOPICS_DIR, file);
  const src = fs.readFileSync(filePath, 'utf8');

  // Шаг 1a: syntax check через node --check
  try {
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
  } catch (e) {
    const msg = (e.stderr || Buffer.from('')).toString().split('\n').slice(1, 3).join(' ').trim();
    err(file, `syntax error — ${msg.slice(0, 180)}`);
    continue;  // сломанный файл не стоит пытаться eval'ить
  }

  // Шаг 1b: выполняем в песочнице с фейковым App — ловим registerTopic
  const captured = [];
  const noop = () => {};
  const fakeApp = {
    registerTopic(topic) { captured.push(topic); },
    selectTopic: noop,
    registerChart: noop,
    destroyCharts: noop,
    Util: new Proxy({}, { get: () => () => [] }),
    makeControl: () => ({ wrap: {}, input: {} }),
  };
  const fakeDoc = new Proxy({}, { get: () => () => ({ appendChild: noop, querySelector: noop, getContext: () => ({}) }) });
  const sandbox = {
    App: fakeApp,
    Chart: function () { return {}; },
    document: fakeDoc,
    window: {},
    console: { log: noop, warn: noop, error: noop },
  };
  try {
    vm.runInNewContext(src, sandbox, { filename: file, timeout: 2000 });
  } catch (e) {
    warn(file, `couldn't execute in sandbox: ${e.message.slice(0, 140)}`);
    continue;
  }

  if (captured.length === 0) {
    warn(file, 'no App.registerTopic() call');
    continue;
  }
  if (captured.length > 1) {
    warn(file, `${captured.length} App.registerTopic() calls (expected 1)`);
  }

  for (const topic of captured) {
    for (const field of REQUIRED_FIELDS) {
      if (!topic[field]) err(file, `missing required field "${field}"`);
    }
    if (topic.id && topics.has(topic.id)) {
      err(file, `duplicate id "${topic.id}" (first seen in ${topics.get(topic.id).file})`);
    }
    if (topic.category && !VALID_CATEGORIES.has(topic.category)) {
      err(file, `invalid category "${topic.category}" — expected one of [${[...VALID_CATEGORIES].join(', ')}]`);
    }
    if (topic.tabs && typeof topic.tabs === 'object') {
      if (!topic.tabs.theory) warn(file, 'no theory tab');
      for (const key of Object.keys(topic.tabs)) {
        if (!VALID_TAB_KEYS.has(key)) {
          warn(file, `unknown tab key "${key}" — won't render (valid: ${[...VALID_TAB_KEYS].join(', ')})`);
        }
      }
    }
    if (topic.id) {
      topics.set(topic.id, { file, category: topic.category, title: topic.title, tabs: topic.tabs });
    }
  }
}

/* ---------- 2. Проверка подключения в index.html ---------- */

const indexHtml = fs.readFileSync(INDEX_HTML, 'utf8');
for (const file of topicFiles) {
  const needle = `js/topics/${file}`;
  if (!indexHtml.includes(needle)) {
    err(file, `not linked in index.html — add <script src="${needle}"></script>`);
  }
}

/* ---------- 3. Dead-link check: App.selectTopic('xxx') ---------- */

for (const file of topicFiles) {
  const src = fs.readFileSync(path.join(TOPICS_DIR, file), 'utf8');
  // Захватываем и одинарные, и двойные кавычки, и backticks
  const re = /App\.selectTopic\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  const dead = new Set();
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!topics.has(m[1]) && !dead.has(m[1])) {
      dead.add(m[1]);
      warn(file, `dead link: App.selectTopic('${m[1]}') — no such topic`);
    }
  }
}

/* ---------- 4. Quiz files check ---------- */

const quizFiles = fs.existsSync(QUIZ_DIR)
  ? fs.readdirSync(QUIZ_DIR).filter(f => f.endsWith('.js')).sort()
  : [];
const quizzes = new Map(); // topicId → { file, count }

for (const file of quizFiles) {
  const filePath = path.join(QUIZ_DIR, file);
  const qFile = `quiz/${file}`;
  const src = fs.readFileSync(filePath, 'utf8');

  // syntax
  try {
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
  } catch (e) {
    const msg = (e.stderr || Buffer.from('')).toString().split('\n').slice(1, 3).join(' ').trim();
    err(qFile, `syntax error — ${msg.slice(0, 180)}`);
    continue;
  }

  // sandbox with fake App.registerQuiz
  const captured = [];
  const noop = () => {};
  const fakeApp = {
    registerQuiz(topicId, data) { captured.push({ topicId, data }); },
    registerTopic: noop,
    selectTopic: noop,
    registerChart: noop,
    destroyCharts: noop,
    Util: new Proxy({}, { get: () => () => [] }),
    QuizUtil: new Proxy({}, { get: () => () => '' }),
    makeControl: () => ({ wrap: {}, input: {} }),
    listTopics: () => [],
    listCategories: () => [],
  };
  const sandbox = {
    App: fakeApp,
    Chart: function () { return {}; },
    document: new Proxy({}, { get: () => () => ({ appendChild: noop, querySelector: noop }) }),
    window: {},
    console: { log: noop, warn: noop, error: noop },
  };
  try {
    vm.runInNewContext(src, sandbox, { filename: qFile, timeout: 2000 });
  } catch (e) {
    warn(qFile, `couldn't execute in sandbox: ${e.message.slice(0, 140)}`);
    continue;
  }

  if (captured.length === 0) {
    warn(qFile, 'no App.registerQuiz() call');
    continue;
  }

  for (const { topicId, data } of captured) {
    if (!topicId) { err(qFile, 'registerQuiz: empty topicId'); continue; }
    if (!topics.has(topicId)) {
      err(qFile, `registerQuiz("${topicId}") — no such topic`);
    }
    if (!data || !Array.isArray(data.questions)) {
      err(qFile, 'registerQuiz: missing "questions" array');
      continue;
    }
    if (data.questions.length === 0) {
      warn(qFile, 'registerQuiz: empty questions array');
    }
    data.questions.forEach((q, i) => {
      const tag = `q${i + 1}`;
      if (!q.prompt) err(qFile, `${tag}: missing "prompt"`);
      if (!Array.isArray(q.options) || q.options.length < 2) {
        err(qFile, `${tag}: need at least 2 options`);
        return;
      }
      const correct = q.options.filter((o) => o.correct).length;
      if (correct === 0) err(qFile, `${tag}: no option marked correct:true`);
      q.options.forEach((o, j) => {
        if (typeof o.text !== 'string' || !o.text.trim()) {
          err(qFile, `${tag}: option ${j + 1} missing "text"`);
        }
      });
    });
    quizzes.set(topicId, { file: qFile, count: data.questions.length });
  }

  // проверяем подключение в index.html
  if (!indexHtml.includes(`js/quiz/${file}`)) {
    err(qFile, `not linked in index.html — add <script src="js/quiz/${file}"></script>`);
  }
}

/* ---------- 5. Chart.js leak check ---------- */

for (const file of topicFiles) {
  const src = fs.readFileSync(path.join(TOPICS_DIR, file), 'utf8');
  const chartCalls = (src.match(/new Chart\s*\(/g) || []).length;
  const registerCalls = (src.match(/App\.registerChart\s*\(/g) || []).length;
  if (chartCalls > registerCalls) {
    warn(file, `${chartCalls} "new Chart()" but only ${registerCalls} "App.registerChart()" — canvas leak on topic switch`);
  }
}

/* ---------- 6. Отчёт ---------- */

const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);

console.log('');
console.log('=== Easy Education validator ===');
console.log(`  topic files:     ${topicFiles.length}`);
console.log(`  topics found:    ${topics.size}`);
console.log(`  quiz files:      ${quizFiles.length}`);
console.log(`  quizzes found:   ${quizzes.size}`);
console.log(`  quiz questions:  ${[...quizzes.values()].reduce((s, q) => s + q.count, 0)}`);
console.log(`  warnings:        ${warnings.length}`);
console.log(`  errors:          ${errors.length}`);
console.log('');

if (warnings.length > 0) {
  console.log(`--- ${warnings.length} warnings ---`);
  warnings.forEach(w => console.log('  ' + w));
  console.log('');
}
if (errors.length > 0) {
  console.log(`--- ${errors.length} errors ---`);
  errors.forEach(e => console.log('  ' + e));
  console.log('');
  console.log('✗ Validation failed.');
  process.exit(1);
}
console.log('✓ All checks passed.');
