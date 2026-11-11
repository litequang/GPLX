// Bump APP_REVISION after changing shell files. Offline data revision comes from offline.json.
const APP_REVISION = 'gplx-shell-v2';
const DATA_CACHE = 'gplx-offline-data-v1';
const SHELL = ['./', './index.html', './styles.css', './app.js', './core.js', './chrome.js', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './data/dataset.json', './data/offline.json'];
let downloadTask;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_REVISION);
    for (const path of SHELL) {
      const url = new URL(path, self.registration.scope);
      const response = await fetch(url, { cache: 'reload' });
      const expected = path.endsWith('.js') ? /javascript/ : path.endsWith('.css') ? /text\/css/ : path.endsWith('.json') ? /json/ : path.endsWith('.webmanifest') ? /json|manifest/ : path.includes('/icons/') ? /^image\// : /text\/html/;
      if (!response.ok || response.redirected || !expected.test(response.headers.get('content-type') || '')) throw new Error(`Invalid shell response: ${path}`);
      await cache.put(url, response);
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('gplx-shell-') && key !== APP_REVISION) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Never cache a hosting authentication page or a failed asset response.
  const safe = response => response.ok && !response.redirected && response.type !== 'opaque';
  event.respondWith((async () => {
    if (event.request.mode === 'navigate') {
      try { const response = await fetch(event.request); if (safe(response)) return response; } catch {}
      return (await caches.match(new URL('./index.html', self.registration.scope))) || Response.error();
    }
    const cached = await caches.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (safe(response) && url.pathname.includes('/assets/')) await (await caches.open(DATA_CACHE)).put(event.request, response.clone());
    return response;
  })());
});
async function broadcast(message) { for (const client of await self.clients.matchAll()) client.postMessage(message); }
async function cacheDataset() {
  const manifestResponse = await fetch(new URL('data/offline.json', self.registration.scope), { cache: 'no-store' });
  if (!manifestResponse.ok || manifestResponse.redirected) throw new Error('Không tải được danh sách dữ liệu.');
  const manifest = await manifestResponse.json();
  const cache = await caches.open(DATA_CACHE);
  let completed = 0;
  await broadcast({ type: 'offline-progress', completed, total: manifest.urls.length });
  // Small batches avoid flooding mobile connections and permit retry after interruption.
  for (let index = 0; index < manifest.urls.length; index += 6) {
    await Promise.all(manifest.urls.slice(index, index + 6).map(async path => {
      const url = new URL(path, self.registration.scope);
      if (!await cache.match(url)) {
        const response = await fetch(url);
        if (!response.ok || response.redirected || (path !== 'data/dataset.json' && !response.headers.get('content-type')?.startsWith('image/'))) throw new Error(`Không tải được ${path}`);
        await cache.put(url, response);
      }
      completed++;
    }));
    await broadcast({ type: 'offline-progress', completed, total: manifest.urls.length });
  }
  await cache.put(new URL('offline-ready', self.registration.scope), new Response(manifest.revision));
  await broadcast({ type: 'offline-done', total: completed });
}
self.addEventListener('message', event => {
  if (event.data?.type !== 'download-offline') return;
  if (!downloadTask) downloadTask = cacheDataset().catch(error => broadcast({ type: 'offline-error', message: error.message })).finally(() => { downloadTask = null; });
  event.waitUntil(downloadTask);
});
