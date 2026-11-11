import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

// Contract tests in an in-memory worker environment. These do not assert real-browser installation.
const source = readFileSync(new URL('../dist/sw.js', import.meta.url), 'utf8');
function workerHarness() {
  const scope = 'https://example.test/GPLX/';
  const handlers = new Map(), stores = new Map(), messages = [];
  let disconnected = false, failingPath = null;
  const key = input => typeof input === 'string' ? new URL(input, scope).href : input instanceof URL ? input.href : input.url;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name);
      return { async put(input, response) { store.set(key(input), response.clone()); }, async match(input) { return store.get(key(input))?.clone(); } };
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(input) { for (const store of stores.values()) if (store.has(key(input))) return store.get(key(input)).clone(); },
  };
  const fetch = async input => {
    const url = new URL(key(input)).pathname;
    if (disconnected) throw new Error('Network unavailable');
    if (failingPath && url.endsWith(failingPath)) return new Response('failed', { status: 503 });
    if (url.endsWith('data/offline.json')) return Response.json({ revision: 'fixture-1', urls: ['data/dataset.json', 'assets/one.webp', 'assets/two.png'] });
    if (url.endsWith('.json') || url.endsWith('.webmanifest')) return Response.json({});
    const contentType = url.endsWith('.js') ? 'text/javascript' : url.endsWith('.css') ? 'text/css' : /\.(png|webp|svg)$/.test(url) ? 'image/png' : 'text/html';
    return new Response(contentType === 'text/html' ? '<html>offline shell</html>' : 'fixture', { headers: { 'content-type': contentType } });
  };
  const self = {
    registration: { scope },
    location: new URL('sw.js', scope),
    addEventListener(type, callback) { handlers.set(type, callback); },
    skipWaiting: async () => {},
    clients: { claim: async () => {}, matchAll: async () => [{ postMessage(message) { messages.push(message); } }] },
  };
  vm.runInNewContext(source, { self, caches, fetch, URL, Response, Promise, Error });
  return {
    caches, scope, messages,
    offline(value) { disconnected = value; },
    fail(path) { failingPath = path; },
    async dispatch(type, extras = {}) { let task; handlers.get(type)({ ...extras, waitUntil(p) { task = p; }, respondWith(p) { task = p; } }); return await task; },
  };
}
test('worker shell can serve navigation without network under a subdirectory', async () => {
  const h = workerHarness();
  await h.dispatch('install'); await h.dispatch('activate');
  h.offline(true);
  const response = await h.dispatch('fetch', { request: { url: h.scope, method: 'GET', mode: 'navigate' } });
  assert.equal(response.status, 200);
  assert.match(await response.text(), /offline shell/);
});
test('offline-ready appears only after all data assets finish, and downloaded images remain available offline', async () => {
  const h = workerHarness();
  await h.dispatch('install');
  await h.dispatch('message', { data: { type: 'download-offline' } });
  assert.equal(h.messages.at(-1).type, 'offline-done');
  const cache = await h.caches.open('gplx-offline-data-v1');
  assert.equal(await (await cache.match(new URL('offline-ready', h.scope))).text(), 'fixture-1');
  h.offline(true);
  const response = await h.dispatch('fetch', { request: { url: new URL('assets/two.png', h.scope).href, method: 'GET', mode: 'cors' } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^image\//);
});
test('a failed offline download has no ready marker and a subsequent retry completes', async () => {
  const h = workerHarness();
  h.fail('assets/two.png');
  await h.dispatch('message', { data: { type: 'download-offline' } });
  assert.equal(h.messages.at(-1).type, 'offline-error');
  const cache = await h.caches.open('gplx-offline-data-v1');
  assert.equal(await cache.match(new URL('offline-ready', h.scope)), undefined);
  h.fail(null);
  await h.dispatch('message', { data: { type: 'download-offline' } });
  assert.equal(h.messages.at(-1).type, 'offline-done');
  assert.ok(await cache.match(new URL('offline-ready', h.scope)));
});

// Reproduce the old worker's cache-first policy with an already cached v1 app.
test('versioned entry and imports bypass legacy shell cache and remain available offline', async () => {
  const h = workerHarness();
  const legacy = await h.caches.open('gplx-shell-v1');
  const oldApp = "document.querySelector('#menu-button').addEventListener('click', () => {});";
  await legacy.put(new URL('app.js', h.scope), new Response(oldApp));
  const request = path => ({ request: { url: new URL(path, h.scope).href, method: 'GET', mode: 'cors' } });
  assert.equal(await (await h.dispatch('fetch', request('app.js'))).text(), oldApp);
  // Old JS paired with the new HTML fails before init(), leaving its loading text.
  assert.throws(() => vm.runInNewContext(oldApp, { document: { querySelector: () => null } }), /addEventListener/);
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const entry = html.match(/import\('([^']+)'\)/)[1];
  assert.notEqual(await (await h.dispatch('fetch', request(entry))).text(), oldApp);
  await h.dispatch('install'); await h.dispatch('activate'); h.offline(true);
  const app = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
  const urls = [entry, html.match(/href="([^" ]+styles\.css[^" ]*)"/)[1], ...[...app.matchAll(/from '([^']+)'/g)].map(m => m[1])];
  for (const url of urls) {
    const response = await h.dispatch('fetch', request(url));
    assert.equal(response.status, 200, url);
    assert.match(response.headers.get('content-type'), /javascript|css/, url);
  }
  assert(!(await h.caches.keys()).includes('gplx-shell-v1'));
});
