import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import * as core from '../dist/core.js';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8').replace(/^import .+;\n/gm, '');
const chrome = readFileSync(new URL('../dist/chrome.js', import.meta.url), 'utf8').replace('export function', 'function');
const dataset = JSON.parse(readFileSync(new URL('../dist/data/dataset.json', import.meta.url), 'utf8'));
const element = () => ({
  innerHTML: '', textContent: '', hidden: false, open: false, inert: false,
  classList: { toggle() {}, add() {}, remove() {} },
  addEventListener() {}, contains() { return false; }, close() { this.open = false; },
  showModal() { this.open = true; }, scrollIntoView() {},
});
const store = map => ({
  getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, String(value)),
  removeItem: key => map.delete(key),
});
async function boot({ local = new Map(), hash = '#learn' } = {}) {
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m => [`#${m[1]}`, element()]));
  elements['.topbar'] = element();
  const events = {};
  const document = {
    body: element(), activeElement: null, documentElement: { scrollHeight: 2000 },
    querySelector: selector => elements[selector] || null,
    addEventListener(type, callback) { events[type] = callback; },
  };
  const media = { matches: false, addEventListener() {} };
  const context = {
    ...core, document, navigator: { onLine: true, userAgent: 'Chrome' },
    window: { scrollY: 0, innerWidth: 1200, scrollTo() {} }, innerHeight: 844,
    addEventListener() {}, matchMedia: () => media,
    localStorage: store(local), sessionStorage: store(new Map()), history: { replaceState() {} },
    location: { hash }, fetch: async () => ({ ok: true, json: async () => dataset }),
    AbortController, setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1,
    clearInterval() {}, requestAnimationFrame() {},
  };
  await vm.runInNewContext(`(async () => { ${chrome}\n${app}\nglobalThis.testApi = { go, handleAction }; })()`, context);
  return {
    local, elements, api: context.testApi,
    change: (id, value) => events.change({ target: { id, value } }),
  };
}
const answer = (h, option) => h.api.handleAction('answer', { dataset: { option: String(option) } });
const jump = (h, index) => h.api.handleAction('jump', { dataset: { index: String(index) } });

test('F5 restores saved wrong/correct choices, explanations and last question', async () => {
  const local = new Map();
  const h = await boot({ local });
  answer(h, 1); // Q1: wrong, correct answer is option 2.
  assert.match(h.elements['#main'].innerHTML, /Đáp án đúng là 2/);
  h.api.go('critical');
  h.api.go('learn'); // Switch back without losing marked correct/wrong feedback.
  assert.match(h.elements['#main'].innerHTML, /Đáp án đúng là 2/);
  jump(h, 1);
  answer(h, 2); // Q2: correct.
  assert.match(h.elements['#main'].innerHTML, /Chính xác/);
  const snapshot = JSON.parse(local.get(core.STORAGE_KEY));
  assert.equal(snapshot.answers[1].selected, 1);
  assert.equal(snapshot.answers[2].selected, 2);
  assert.equal(snapshot.studyPositions['B|learn|all'], 2);
  const fresh = await boot({ local });
  assert.match(fresh.elements['#main'].innerHTML, /CÂU 2/);
  assert.match(fresh.elements['#main'].innerHTML, /Chính xác/);
  jump(fresh, 0);
  assert.match(fresh.elements['#main'].innerHTML, /Đáp án đúng là 2/);
  fresh.api.handleAction('retry-question', { dataset: {} });
  assert.doesNotMatch(fresh.elements['#main'].innerHTML, /Đáp án đúng là 2/);
  const again = await boot({ local });
  jump(again, 0);
  assert.match(again.elements['#main'].innerHTML, /Đáp án đúng là 2/,
    'a refresh during retry must not erase the previous saved answer');
});

test('legacy progress-v1 restores selections after reload and topic/license navigation', async () => {
  const legacy = {
    version: 1, license: 'B', bookmarks: [1], lastQuestion: 1, history: [],
    answers: { 1: { selected: 2, correct: true, at: 100 } },
  };
  const local = new Map([[core.STORAGE_KEY, JSON.stringify(legacy)]]);
  const h = await boot({ local });
  assert.match(h.elements['#main'].innerHTML, /Chính xác/);
  await h.change('license', 'A1');
  assert.match(h.elements['#main'].innerHTML, /Chính xác/);
  await h.change('category', '6');
  await h.change('category', '');
  assert.match(h.elements['#main'].innerHTML, /Chính xác/);
  h.api.go('home');
  h.api.go('learn');
  assert.match(h.elements['#main'].innerHTML, /Chính xác/);
  assert.equal(JSON.parse(local.get(core.STORAGE_KEY)).answers[1].selected, 2);
});

test('wrong-answer revision view restores persisted feedback after tab switch', async () => {
  const local = new Map();
  const h = await boot({ local });
  answer(h, 1);
  h.api.go('wrong');
  assert.match(h.elements['#main'].innerHTML, /Đáp án đúng là 2/);
  h.api.go('home'); h.api.go('wrong');
  assert.match(h.elements['#main'].innerHTML, /Đáp án đúng là 2/);
  const fresh = await boot({ local, hash: '#wrong' });
  assert.match(fresh.elements['#main'].innerHTML, /Đáp án đúng là 2/);
});
