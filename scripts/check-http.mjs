import { readFileSync } from 'node:fs';
const base = process.env.PREVIEW_URL || 'http://localhost:4173/';
const manifest = JSON.parse(readFileSync(new URL('../dist/data/offline.json', import.meta.url)));
// Read the actual precache URLs so new modules/versioned requests cannot be missed.
const worker = readFileSync(new URL('../dist/sw.js', import.meta.url), 'utf8');
const shell = JSON.parse(worker.match(/const SHELL = (\[[^;]+\]);/)[1].replaceAll("'", '"'));
const paths = [...new Set([...shell, './sw.js', ...manifest.urls])];
let count = 0, bytes = 0;
for (let index = 0; index < paths.length; index += 12) {
  await Promise.all(paths.slice(index, index + 12).map(async path => {
    const response = await fetch(new URL(path, base));
    if (!response.ok || response.redirected) throw new Error(`${path}: HTTP ${response.status}, redirected=${response.redirected}`);
    const pathname = new URL(path, base).pathname;
    if (pathname.endsWith('.js') && !/javascript/.test(response.headers.get('content-type') || '')) throw new Error(`Invalid JavaScript MIME: ${path}`);
    const body = await response.arrayBuffer();
    if (!body.byteLength) throw new Error(`Empty response: ${path}`);
    if (path.includes('assets/') && !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Invalid image MIME: ${path}`);
    bytes += body.byteLength; count++;
  }));
}
console.log(JSON.stringify({ httpResources: count, allStatus200: true, bytes, mebibytes: (bytes / 1024 / 1024).toFixed(1) }, null, 2));
