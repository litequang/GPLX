import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

// Usage: npm run extract -- /absolute/path/to/extracted/assets
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = resolve(process.argv[2] || join(root, '../extracted/assets'));
const database = join(assets, 'databases/600question.db');
const db = new DatabaseSync(database, { readOnly: true });
const rows = table => db.prepare(`SELECT * FROM ${table}`).all();
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const dataDir = join(root, 'dist/data');
mkdirSync(dataDir, { recursive: true });
const copyAsset = (folder, filename) => {
  if (!filename) return null;
  if (filename !== basename(filename)) throw new Error(`Unsafe asset name: ${filename}`);
  const source = join(assets, folder, filename);
  if (!existsSync(source)) throw new Error(`Missing asset: ${source}`);
  const target = join(root, 'dist/assets', folder, filename);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
  return `assets/${folder}/${filename}`;
};
const questionRows = rows('ZQUESTION');
const questions = questionRows.map(q => ({
  id: q.Z_PK,
  text: q.ZQUESTIONCONTENT.normalize('NFC'),
  options: [1, 2, 3, 4].filter(n => q[`ZOPTION${n}`]?.trim()).map(n => ({ id: n, text: q[`ZOPTION${n}`].normalize('NFC') })),
  answer: q.ZANSWERS,
  explanation: (q.ZANSWERDESC || '').normalize('NFC'),
  image: copyAsset('imageapp_600', q.ZIMAGE),
  category: q.ZQUESTIONTYPE,
  critical: q.ZQUESTIONDIE === '1',
  // Preserve original column names for auditing; mapping documented in DATA_MAP.md.
  included: Object.fromEntries(['A1', 'A2', 'A34', 'B1', 'B2', 'C', 'DEF'].map(k => [k, q[`ZINCLUDE${k}`] === 1])),
}));
// Editorial corrections verified against the official 2025 CSGT 600-question PDF.
// Keep these changes reproducible whenever the source APK is re-extracted.
const officialTextCorrections = {
  "1": {
    "text": "Phần của đường bộ được sử dụng cho phương tiện giao thông đường bộ đi lại là gì?"
  },
  "2": {
    "text": "Làn đường là gì?",
    "options": {
      "2": "Là một phần của phần đường xe chạy được chia theo chiều dọc của đường, có đủ chiều rộng cho xe chạy an toàn.",
      "3": "Là đường cho xe ô tô chạy, dừng, đỗ an toàn."
    }
  },
  "600": {
    "text": "Trong tình huống dưới đây, xe đầu kéo kéo rơ moóc (xe container) đang rẽ phải, xe con màu xanh và xe máy phía sau xe container đi như thế nào để bảo đảm an toàn?",
    "options": {
      "2": "Giảm tốc độ chờ xe container rẽ xong rồi tiếp tục đi."
    }
  }
};
for (const question of questions) {
  const correction = officialTextCorrections[question.id];
  if (!correction) continue;
  if (correction.text) question.text = correction.text;
  for (const [id, text] of Object.entries(correction.options || {})) {
    const option = question.options.find(o => o.id === Number(id));
    if (!option) throw new Error(`CSGT correction missing option ${question.id}/${id}`);
    option.text = text;
  }
}
const categories = rows('ZQUESTIONTYPE').filter(c => questions.some(q => q.category === c.Z_PK)).map(c => ({ id: c.Z_PK, name: c.ZTYPE_NAME }));
const allocations = rows('ZNUMBERQUESTIONPERTYPE');
const pools = { A1: 'A1', A: 'A2', B1: 'B1', B: 'B2', C1: 'C', C: 'C', D1: 'DEF', D2: 'DEF', D: 'DEF', E: 'DEF' };
const licenses = rows('ZLICENSE').map(l => ({
  id: l.Z_PK, name: l.ZNAME, description: l.ZDESC,
  count: l.ZNUMBEROFQUESTION, pass: l.ZNUMBEROFCORRECTQUESTION, minutes: l.ZDURATION,
  pool: pools[l.ZNAME],
  allocation: allocations.filter(a => a.ZLICENSE === l.Z_PK).map(a => ({ category: a.ZQUESTIONTYPE, count: a.ZCOUNT })),
}));
const signs = rows('TABLE_NOTICE_BOARD').filter(s => !s.isDelete).map(s => ({
  id: s.ID, category: s.Type_ID, name: s.Name, detail: s.Detail || '', image: copyAsset('signal', s.Icon), sourceUpdated: s.UpdateDay,
}));
const signCategories = rows('TABLE_NOTICE_BOARD_TYPE').map(c => ({ id: c.Type_ID, name: c.Type_Name }));
const dataset = {
  schemaVersion: 1,
  source: { package: 'com.vietauto.onthigiaypheplaixe.onthigplx600cau.gplxoto', extractedOn: '2026-11-11', databaseSha256: hash(database), note: "Dữ liệu từ APK gốc; hiệu đính câu 1, 2, 600 theo PDF Cục CSGT 2025. Cờ điểm liệt theo hạng được hiệu chỉnh tại core.js theo Công văn 2262/CSGT-P5. Chưa đối chiếu đầy đủ toàn bộ câu chữ, đáp án và hình ảnh của 600 câu.", officialCorrections: {"authority":"Cục CSGT, bộ 600 câu 2025","questionIds":[1,2,600],"reference":"https://www.csgt.vn/upload/services/273963059_B%E1%BB%99%20600%20c%C3%A2u%20h%E1%BB%8Fi%20d%C3%B9ng%20cho%20s%C3%A1t%20h%E1%BA%A1ch%20l%C3%A1i%20xe%20c%C6%A1%20gi%E1%BB%9Bi%20%C4%91%C6%B0%E1%BB%9Dng%20b%E1%BB%99.pdf"} },
  categories, licenses, questions, signs, signCategories,
};
writeFileSync(join(dataDir, 'dataset.json'), JSON.stringify(dataset));
const urls = ['data/dataset.json', ...new Set([...questions, ...signs].map(q => q.image).filter(Boolean))];
const revision = createHash('sha256').update(JSON.stringify(dataset)).digest('hex').slice(0, 12);
writeFileSync(join(dataDir, 'offline.json'), JSON.stringify({ revision, urls }));
db.close();
console.log(JSON.stringify({ questions: questions.length, critical: questions.filter(q => q.critical).length, signs: signs.length, categories: categories.length, licenses: licenses.length, assets: urls.length - 1, revision }, null, 2));
