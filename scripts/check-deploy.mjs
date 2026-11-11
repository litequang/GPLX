import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, join, relative } from 'node:path';
const root = fileURLToPath(new URL('../dist', import.meta.url));
const limit = 25 * 1024 * 1024;
let files = 0, bytes = 0, largest = 0;
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink in deploy output: ${relative(root, path)}`);
    if (entry.isDirectory()) { inspect(path); continue; }
    if (/\.(zip|apk|db|sqlite|tar|gz)$/i.test(entry.name) || entry.name.startsWith('.env')) throw new Error(`Keep archives, raw input and secrets outside dist: ${relative(root, path)}`);
    const size = statSync(path).size;
    if (size > limit) throw new Error(`File exceeds hosting 25 MiB limit: ${relative(root, path)}`);
    files++; bytes += size; largest = Math.max(largest, size);
  }
}
inspect(resolve(root));
console.log(JSON.stringify({ files, bytes, largestFileBytes: largest, withinPerFileLimit: true }, null, 2));
