import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import * as core from '../dist/core.js';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8').replace(/^import .+;\n/gm, '');
const chrome = readFileSync(new URL('../dist/chrome.js', import.meta.url), 'utf8').replace('export function', 'function');
const dataset = JSON.parse(readFileSync(new URL('../dist/data/dataset.json', import.meta.url), 'utf8'));
async function boot({ legacyMedia = false, failChrome = false, failData = false } = {}) {
  const element = () => ({ innerHTML: '', textContent: '', hidden: false, classList: { toggle() {}, add() {}, remove() {} }, addEventListener() {}, contains() { return false; } });
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m => [`#${m[1]}`, element()]));
  elements['.topbar'] = element();
  const document = { body: element(), activeElement: null, documentElement: { scrollHeight: 2000 }, querySelector: s => elements[s] || null, addEventListener() {} };
  let fetches = 0;
  const storage = { getItem: () => null, setItem() {}, removeItem() {} };
  const context = { ...core, document, navigator: { onLine: true }, window: { scrollY: 0, scrollTo() {} }, innerHeight: 844,
    addEventListener() {}, matchMedia() { if (failChrome) throw new Error('chrome fixture failure'); return legacyMedia ? { matches: false, addListener() {} } : { matches: false, addEventListener() {} }; },
    localStorage: storage, sessionStorage: storage, history: { replaceState() {} }, location: { hash: '' },
    fetch: async () => { fetches++; if (failData) throw new Error('dataset fixture failure'); return { ok: true, json: async () => dataset }; },
    AbortController, setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {}, requestAnimationFrame() {},
  };
  await vm.runInNewContext(`(async () => { ${chrome}\n${app}\n })()`, context);
  return { elements, fetches };
}
test('actual app startup renders home and navigation against current shell IDs', async () => {
  const h = await boot();
  assert.equal(h.fetches, 1);
  assert.match(h.elements['#main'].innerHTML, /Vững kiến thức/);
  assert.match(h.elements['#bottom-nav'].innerHTML, /Học câu hỏi/);
});
test('startup works with legacy Safari MediaQueryList listeners', async () => {
  const h = await boot({ legacyMedia: true });
  assert.match(h.elements['#main'].innerHTML, /Vững kiến thức/);
});
test('chrome and dataset startup failures replace loading state with retry UI', async () => {
  for (const options of [{ failChrome: true }, { failData: true }]) {
    const h = await boot(options);
    assert.match(h.elements['#main'].innerHTML, /Chưa mở được bộ câu hỏi/);
    assert.match(h.elements['#main'].innerHTML, /Thử lại/);
  }
});
