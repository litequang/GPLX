export const STORAGE_KEY = 'gplx-progress-v1';
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
// Keep the version-1 backup format. Optional per-view positions are migrated on read.
export const emptyProgress = () => ({ version: 1, license: 'B', answers: {}, bookmarks: [], history: [], lastQuestion: 1, studyPositions: {} });
export const studyPositionKey = (license, route, category = '') => `${license}|${route}|${category || 'all'}`;
export function restoredStudyResponses(progress) {
  return Object.fromEntries(Object.entries(progress?.answers || {})
    .filter(([, answer]) => Number.isInteger(answer?.selected) && answer.selected >= 1 && answer.selected <= 4)
    .map(([id, answer]) => [id, answer.selected]));
}
export function parseProgress(text) {
  const p = JSON.parse(text);
  if (p?.version !== 1 || !p.answers || typeof p.answers !== 'object' || Array.isArray(p.answers) || !Array.isArray(p.bookmarks) || !Array.isArray(p.history)) throw new Error('Tệp tiến độ không đúng định dạng.');
  const safe = emptyProgress();
  safe.license = typeof p.license === 'string' ? p.license : 'B';
  safe.lastQuestion = Number.isInteger(p.lastQuestion) ? p.lastQuestion : 1;
  safe.bookmarks = [...new Set(p.bookmarks.filter(n => Number.isInteger(n) && n > 0 && n <= 600))];
  for (const [id, a] of Object.entries(p.answers)) {
    if (/^\d+$/.test(id) && Number(id) > 0 && Number(id) <= 600 && a && Number.isInteger(a.selected) && a.selected >= 0 && a.selected <= 4 && typeof a.correct === 'boolean') safe.answers[id] = { selected: a.selected, correct: a.correct, at: Number(a.at) || 0 };
  }
  safe.history = p.history.filter(h => h && typeof h.license === 'string' && Number.isFinite(h.correct) && Number.isFinite(h.total) && typeof h.passed === 'boolean' && Number.isFinite(h.at)).slice(0, 50);
  // Import old progress-v1 backups without studyPositions, and ignore malformed keys.
  if (p.studyPositions && typeof p.studyPositions === 'object' && !Array.isArray(p.studyPositions)) {
    for (const [key, id] of Object.entries(p.studyPositions)) {
      if (/^(A1|A|B1|B|C1|C|D1|D2|D|E)\\|(learn|critical|wrong|saved)\\|(all|[1-7])$/.test(key) &&
          Number.isInteger(id) && id >= 1 && id <= 600) safe.studyPositions[key] = id;
    }
  }
  return safe;
}
// Cong van 2262/CSGT-P5, 07/05/2025, Phu luc I/II/III: 20/30/60 critical IDs.
// The APK's 60 global flags must not be treated as motorcycle-specific flags.
export const MOTO_CRITICAL_2025 = Object.freeze([19,20,21,22,24,26,27,28,30,47,48,52,53,63,64,65,68,70,71,72]);
export const B1_CRITICAL_2025 = Object.freeze([19,20,21,22,24,26,27,28,30,47,48,52,53,63,64,65,68,70,71,72,73,74,87,89,90,91,92,215,254,255]);
const motoCritical = new Set(MOTO_CRITICAL_2025);
const b1Critical = new Set(B1_CRITICAL_2025);
export function poolFor(dataset, licenseName) {
  const license = dataset.licenses.find(l => l.name === licenseName) || dataset.licenses.find(l => l.name === 'B');
  const criticalIds = license.name === 'A1' || license.name === 'A' ? motoCritical : license.name === 'B1' ? b1Critical : null;
  return dataset.questions.filter(q => q.included[license.pool]).map(q => {
    if (!criticalIds) return q;
    const critical = criticalIds.has(q.id);
    // A global critical question outside the class-specific annex remains
    // a normal study/exam question; never mutate the shared raw dataset.
    return critical === q.critical ? q : { ...q, critical };
  });
}
export function validExamIds(dataset, licenseName, ids) {
  const license = dataset.licenses.find(l => l.name === licenseName);
  if (!license || !Array.isArray(ids) || ids.length !== license.count || new Set(ids).size !== ids.length) return false;
  const byId = new Map(poolFor(dataset, licenseName).map(q => [q.id, q]));
  const questions = ids.map(id => byId.get(id));
  return questions.every(Boolean) &&
    questions.filter(q => q.critical).length === 1 &&
    license.allocation.every(slot => questions.filter(q => !q.critical && q.category === slot.category).length === slot.count);
}
export function shuffled(items, random = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
export function generateExam(dataset, licenseName, random = Math.random) {
  const license = dataset.licenses.find(l => l.name === licenseName);
  if (!license) throw new Error('Không tìm thấy hạng bằng.');
  const pool = poolFor(dataset, licenseName);
  const critical = shuffled(pool.filter(q => q.critical), random)[0];
  if (!critical) throw new Error('Bộ dữ liệu thiếu câu điểm liệt.');
  const selected = [critical];
  for (const slot of license.allocation) {
    const candidates = shuffled(pool.filter(q => !q.critical && q.category === slot.category), random);
    if (candidates.length < slot.count) throw new Error(`Dữ liệu không đủ câu cho chủ đề ${slot.category}.`);
    selected.push(...candidates.slice(0, slot.count));
  }
  if (selected.length !== license.count || new Set(selected.map(q => q.id)).size !== selected.length) throw new Error('Cấu trúc đề trong dữ liệu không hợp lệ.');
  return shuffled(selected, random);
}
export function gradeExam(questions, answers, pass) {
  const correct = questions.filter(q => Number(answers[q.id]) === q.answer).length;
  const criticalFailed = questions.some(q => q.critical && Number(answers[q.id]) !== q.answer);
  return { correct, total: questions.length, unanswered: questions.filter(q => !answers[q.id]).length, criticalFailed, passed: correct >= pass && !criticalFailed };
}
