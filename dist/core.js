export const STORAGE_KEY = 'gplx-progress-v1';
export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
export const emptyProgress = () => ({ version: 1, license: 'B', answers: {}, bookmarks: [], history: [], lastQuestion: 1 });
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
  return safe;
}
export function poolFor(dataset, licenseName) {
  const license = dataset.licenses.find(l => l.name === licenseName) || dataset.licenses.find(l => l.name === 'B');
  return dataset.questions.filter(q => q.included[license.pool]);
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
