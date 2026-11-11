import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateExam, gradeExam, poolFor, normalize, emptyProgress, parseProgress, validExamIds, MOTO_CRITICAL_2025, B1_CRITICAL_2025, restoredStudyResponses, studyPositionKey } from '../dist/core.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dataset = JSON.parse(readFileSync(resolve(root, 'dist/data/dataset.json')));

test('full dataset preserves question IDs, valid answers, explanations and every referenced image', () => {
  assert.equal(dataset.questions.length, 600);
  assert.equal(dataset.questions.filter(q => q.critical).length, 60);
  assert.equal(dataset.signs.length, 332);
  assert.deepEqual(dataset.questions.map(q => q.id).sort((a, b) => a - b), Array.from({ length: 600 }, (_, i) => i + 1));
  for (const q of dataset.questions) {
    assert.ok(q.text.trim(), `question ${q.id}`);
    assert.ok(q.options.some(o => o.id === q.answer), `answer ${q.id}`);
    assert.ok(dataset.categories.some(c => c.id === q.category));
    if (q.image) assert.ok(existsSync(resolve(root, 'dist', q.image)), q.image);
  }
  for (const sign of dataset.signs) assert.ok(existsSync(resolve(root, 'dist', sign.image)), sign.image);
});
test('every license generates 100 complete, unique exams matching source allocation and exactly one critical question', () => {
  for (const l of dataset.licenses) {
    const allowed = new Set(poolFor(dataset, l.name).map(q => q.id));
    assert.equal(l.allocation.reduce((n, slot) => n + slot.count, 1), l.count);
    for (let run = 0; run < 100; run++) {
      const questions = generateExam(dataset, l.name);
      assert.equal(questions.length, l.count, l.name);
      assert.equal(new Set(questions.map(q => q.id)).size, l.count);
      assert.equal(questions.filter(q => q.critical).length, 1);
      assert.ok(questions.every(q => allowed.has(q.id)));
      for (const slot of l.allocation) assert.equal(questions.filter(q => !q.critical && q.category === slot.category).length, slot.count, `${l.name} topic ${slot.category}`);
    }
  }
});
test('grading requires threshold and critical answer; unanswered questions remain unanswered', () => {
  const l = dataset.licenses.find(l => l.name === 'B');
  const questions = generateExam(dataset, l.name);
  const answers = Object.fromEntries(questions.map(q => [q.id, q.answer]));
  assert.equal(gradeExam(questions, answers, l.pass).passed, true);
  const critical = questions.find(q => q.critical);
  delete answers[critical.id];
  const failed = gradeExam(questions, answers, l.pass);
  assert.equal(failed.correct, l.count - 1);
  assert.equal(failed.unanswered, 1);
  assert.equal(failed.criticalFailed, true);
  assert.equal(failed.passed, false);
  assert.equal(gradeExam(questions, {}, l.pass).correct, 0);
});
test('progress export/import preserves skipped questions and rejects malformed input', () => {
  const progress = emptyProgress();
  progress.answers[1] = { selected: 0, correct: false, at: Date.now() };
  progress.answers[2] = { selected: 2, correct: true, at: Date.now() };
  progress.bookmarks = [1, 10];
  assert.deepEqual(parseProgress(JSON.stringify(progress)), progress);
  assert.throws(() => parseProgress('{}'));
  assert.throws(() => parseProgress('null'));
  assert.throws(() => parseProgress('{'));
  const noisy = { ...progress, bookmarks: [1, 1, -1, 800, '3'], answers: { evil: {}, 10: { selected: 99, correct: true } } };
  assert.deepEqual(parseProgress(JSON.stringify(noisy)).bookmarks, [1]);
  assert.equal(Object.keys(parseProgress(JSON.stringify(noisy)).answers).length, 0);
});
test('Vietnamese search ignores accent marks and d-stroke', () => {
  assert.equal(normalize('Đường bộ'), 'duong bo');
  assert.ok(normalize('Biển số P.124a Cấm quay đầu xe').includes(normalize('cam quay dau')));
});
test('offline manifest lists precisely all referenced assets and valid PWA icons', () => {
  const offline = JSON.parse(readFileSync(resolve(root, 'dist/data/offline.json')));
  const urls = new Set(offline.urls);
  assert.equal(urls.size, offline.urls.length);
  for (const q of [...dataset.questions, ...dataset.signs]) if (q.image) assert.ok(urls.has(q.image));
  for (const path of urls) assert.ok(existsSync(resolve(root, 'dist', path)));
  const manifest = JSON.parse(readFileSync(resolve(root, 'dist/manifest.webmanifest')));
  assert.equal(manifest.display, 'standalone');
  for (const icon of manifest.icons) {
    const bytes = readFileSync(resolve(root, 'dist', icon.src));
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    const [width, height] = icon.sizes.split('x').map(Number);
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), height);
  }
});

test('2025 CSGT annexes define exactly 20 A1/A, 30 B1 and 60 global critical questions', () => {
  const actual = name => poolFor(dataset, name).filter(q => q.critical).map(q => q.id).sort((a,b)=>a-b);
  const ordered = ids => [...ids].sort((a,b)=>a-b);
  assert.deepEqual(actual('A1'), ordered(MOTO_CRITICAL_2025));
  assert.deepEqual(actual('A'), ordered(MOTO_CRITICAL_2025));
  assert.deepEqual(actual('B1'), ordered(B1_CRITICAL_2025));
  for (const name of ['B','C1','C','D1','D2','D','E']) assert.equal(actual(name).length, 60);
  // IDs 32 and 215 are globally critical, but not A1/A-critical.
  assert.equal(dataset.questions.find(q => q.id === 32).critical, true);
  assert.equal(poolFor(dataset,'A1').find(q => q.id === 32).critical, false);
  assert.equal(poolFor(dataset,'B1').find(q => q.id === 32).critical, false);
  assert.equal(poolFor(dataset,'A').find(q => q.id === 215).critical, false);
  assert.equal(poolFor(dataset,'B1').find(q => q.id === 215).critical, true);
});
test('exam validity and grading use class-specific critical status, preserving learning IDs', () => {
  for (const license of dataset.licenses) {
    const questions = generateExam(dataset, license.name);
    assert.equal(validExamIds(dataset, license.name, questions.map(q=>q.id)), true);
    assert.equal(validExamIds(dataset, license.name, [...questions.slice(1).map(q=>q.id), questions[1].id]), false);
  }
  const pool = poolFor(dataset, 'A1');
  const official = pool.find(q=>q.id===19);
  const extra = pool.find(q=>q.id===32);
  assert.equal(gradeExam([official,extra], {[official.id]:official.answer,[extra.id]:0}, 1).passed, true);
  assert.equal(gradeExam([official,extra], {[official.id]:0,[extra.id]:extra.answer}, 1).criticalFailed, true);
});
test('verified CSGT 2025 source text corrections remain in dataset', () => {
  const q = id => dataset.questions.find(x=>x.id===id);
  assert.equal(q(1).text, 'Phần của đường bộ được sử dụng cho phương tiện giao thông đường bộ đi lại là gì?');
  assert.equal(q(2).text, 'Làn đường là gì?');
  assert.equal(q(2).options.find(o=>o.id===2).text, 'Là một phần của phần đường xe chạy được chia theo chiều dọc của đường, có đủ chiều rộng cho xe chạy an toàn.');
  assert.equal(q(600).text, 'Trong tình huống dưới đây, xe đầu kéo kéo rơ moóc (xe container) đang rẽ phải, xe con màu xanh và xe máy phía sau xe container đi như thế nào để bảo đảm an toàn?');
  assert.equal(q(600).options.find(o=>o.id===2).text, 'Giảm tốc độ chờ xe container rẽ xong rồi tiếp tục đi.');
  assert.equal(q(1).answer, 2); assert.equal(q(2).answer, 2); assert.equal(q(600).answer, 2);
});

test('study progress restores saved selections and per-view locations, including old v1 backups', () => {
  const saved = emptyProgress();
  saved.answers[1] = { selected: 1, correct: false, at: 123 };
  saved.answers[2] = { selected: 2, correct: true, at: 456 };
  saved.answers[3] = { selected: 0, correct: false, at: 789 };
  saved.studyPositions[studyPositionKey('B', 'learn')] = 2;
  saved.studyPositions[studyPositionKey('B', 'critical', '1')] = 19;
  const parsed = parseProgress(JSON.stringify(saved));
  assert.deepEqual(parsed, saved);
  assert.deepEqual(restoredStudyResponses(parsed), { 1: 1, 2: 2 });
  const legacy = { version: 1, license: 'B', answers: saved.answers, bookmarks: [], history: [], lastQuestion: 2 };
  assert.deepEqual(parseProgress(JSON.stringify(legacy)).studyPositions, {});
  assert.deepEqual(restoredStudyResponses(parseProgress(JSON.stringify(legacy))), { 1: 1, 2: 2 });
  legacy.studyPositions = { 'B|learn|all': 2, 'B|wrong|all': 1, 'INVALID': 999, 'B|learn|1': 999 };
  assert.deepEqual(parseProgress(JSON.stringify(legacy)).studyPositions, { 'B|learn|all': 2, 'B|wrong|all': 1 });
});
