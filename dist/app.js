import { initChrome } from './chrome.js?v=gplx-shell-v7';
import { STORAGE_KEY, normalize, emptyProgress, parseProgress, poolFor, generateExam, gradeExam, validExamIds, restoredStudyResponses, studyPositionKey } from './core.js?v=gplx-shell-v7';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const paths = {
  home: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Z"/><path d="M12 5v15"/>',
  shield: '<path d="M12 3 3 7v6c0 4 4 7 9 9 5-2 9-5 9-9V7Z"/><path d="M12 8v5m0 3v1"/>',
  exam: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 9h6m-6 4h6m-6 4h3"/>',
  sign: '<path d="m12 3 10 17H2L12 3Z"/><path d="M12 9v4m0 3v1"/>',
  wrong: '<path d="M4 7V3m0 4h4M4 7a9 9 0 1 1-1 8"/><path d="M9 9l6 6m0-6-6 6"/>',
  bookmark: '<path d="M6 3h12v19l-6-4-6 4Z"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r="1"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  car: '<path d="m5 9 2-5h10l2 5m-14 0h14l2 4v6H3v-6Z"/><path d="M3 16h18M6 19v2m12-2v2M6 12h2m8 0h2"/>',
  heart: '<path d="M12 21 3 12C-3 5 7-1 12 6c5-7 15-1 9 6Z"/>',
  tool: '<path d="m14 6 4 4 4-4a7 7 0 0 1-9 9l-7 7-4-4 7-7a7 7 0 0 1 9-9Z"/>',
  route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h8"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.book}</svg>`;
const navItems = [['home', 'Tổng quan', 'home'], ['learn', 'Học theo chủ đề', 'book'], ['critical', 'Câu điểm liệt', 'shield'], ['exams', 'Luyện đề', 'exam'], ['signs', 'Biển báo đường bộ', 'sign'], ['wrong', 'Câu cần ôn lại', 'wrong'], ['saved', 'Câu đã đánh dấu', 'bookmark']];
let dataset, progress, storageAvailable = true;
let state = { route: 'home', category: '', search: '', index: 0, list: [], responses: {}, signLimit: 32 };
let exam = null, examResult = null, timer, toastTimer;
let offline = { status: 'idle', completed: 0, total: 0 };
let serviceWorkerRegistration;

function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4000); }
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch { if (storageAvailable) toast('Bộ nhớ trình duyệt không khả dụng. Hãy xuất tiến độ để giữ kết quả.'); storageAvailable = false; }
}
function saveExam() { try { if (exam) sessionStorage.setItem('gplx-active-exam', JSON.stringify(exam)); else sessionStorage.removeItem('gplx-active-exam'); } catch {} }
const license = () => dataset.licenses.find(l => l.name === progress.license) || dataset.licenses.find(l => l.name === 'B');
const pool = () => poolFor(dataset, progress.license);
const answered = questions => questions.filter(q => progress.answers[q.id]?.selected > 0);
const correctCount = questions => questions.filter(q => progress.answers[q.id]?.correct).length;
const categoryName = id => dataset.categories.find(c => c.id === id)?.name || 'Tổng hợp';
const date = timestamp => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestamp);
function licenseSelect() { return `<div class="license-control"><label for="license">Hạng bằng</label><select id="license" aria-label="Chọn hạng bằng" ${exam ? 'disabled' : ''}>${dataset.licenses.map(l => `<option value="${escape(l.name)}" ${l.name === progress.license ? 'selected' : ''}>Hạng ${escape(l.name)}</option>`).join('')}</select></div>`; }
function heading(title, description, trailing = licenseSelect()) { return `<div class="page-heading"><div><p class="eyebrow">HỌC VỮNG · LÁI AN TÂM</p><h1>${title}</h1><p class="subtitle">${description}</p></div>${trailing}</div>`; }
function sourceNote() { return `<p class="source-note">Bộ dữ liệu trích từ ứng dụng Android ngày 11/11/2026. Đề luyện được tạo ngẫu nhiên theo ma trận 2025; điểm liệt theo hạng căn cứ Công văn 2262/CSGT-P5. Câu 1, 2, 600 được hiệu đính theo PDF Cục CSGT. <button class="text-button" data-action="about">Xem nguồn dữ liệu</button></p>`; }
function updateNav() {
  const p = pool();
  $('#nav').innerHTML = navItems.map(([route, label, symbol], i) => `${i === 5 ? '<div class="nav-separator"></div>' : ''}<a class="nav-item ${route === state.route ? 'active' : ''}" href="#${route}" ${route === state.route ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span>${route === 'critical' ? `<span class="count">${p.filter(q => q.critical).length}</span>` : route === 'wrong' ? `<span class="count">${p.filter(q => progress.answers[q.id]?.correct === false).length}</span>` : route === 'saved' ? `<span class="count">${p.filter(q => progress.bookmarks.includes(q.id)).length}</span>` : ''}</a>`).join('');
  $('#bottom-nav').innerHTML = [['home', 'Tổng quan', 'home'], ['learn', 'Học câu hỏi', 'book'], ['exams', 'Luyện đề', 'exam'], ['signs', 'Biển báo', 'sign']].map(([route, label, symbol]) => `<a class="bottom-item ${route === state.route ? 'active' : ''}" href="#${route}" ${route === state.route ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span></a>`).join('') + `<button class="bottom-item ${['critical', 'wrong', 'saved'].includes(state.route) ? 'active' : ''}" data-action="more-nav" aria-haspopup="dialog">${icon('bookmark')}<span>Thêm</span></button>`;
  $('#page-label').textContent = navItems.find(n => n[0] === state.route)?.[1] || 'Tổng quan';
}
function offlinePanel() {
  const messages = { idle: 'Tải câu hỏi và hình ảnh để học ngay cả khi mất mạng.', downloading: `Đang tải ${offline.completed}/${offline.total} mục. Bạn có thể tiếp tục học.`, ready: 'Đã lưu đầy đủ câu hỏi và hình ảnh trên trình duyệt này.', error: 'Tải chưa hoàn tất. Kiểm tra kết nối rồi thử lại.' };
  return `<div class="offline-panel">${icon('wifi')}<div><h3>Mang góc học tập đi mọi nơi</h3><p id="offline-message">${messages[offline.status]}</p></div><button class="secondary" data-action="offline" ${['ready', 'downloading'].includes(offline.status) ? 'disabled' : ''}>${offline.status === 'ready' ? 'Đã sẵn sàng ngoại tuyến ✓' : offline.status === 'downloading' ? 'Đang tải…' : 'Tải để học ngoại tuyến ↓'}</button></div>`;
}
function renderHome() {
  const p = pool(), seen = answered(p).length, correct = correctCount(p), critical = p.filter(q => q.critical);
  const today = new Date().toDateString(), daily = Object.values(progress.answers).filter(a => a.selected > 0 && new Date(a.at).toDateString() === today).length;
  const topicIcons = { 1: 'book', 3: 'heart', 4: 'car', 5: 'tool', 6: 'sign', 7: 'route' };
  $('#main').innerHTML = `${heading('Chào bạn, sẵn sàng học chưa?', 'Một chút tập trung mỗi ngày. Tự tin hơn trên mọi hành trình.')}
    <section class="hero" aria-label="Tiếp tục học"><div class="hero-copy"><p class="eyebrow">HÀNH TRÌNH CỦA BẠN</p><h2>Vững kiến thức.<br>An tâm cầm lái.</h2><p>Hiểu từng câu hỏi, nhớ từng biển báo.<br>Cùng bạn chuẩn bị cho chặng đường phía trước.</p><button class="primary" data-action="continue">${seen ? 'Tiếp tục hành trình' : 'Bắt đầu học ngay'} <span class="button-arrow">→</span></button></div><div class="hero-art" aria-hidden="true"><svg viewBox="0 0 450 280" fill="none"><circle cx="315" cy="118" r="136" fill="#205346"/><circle cx="315" cy="118" r="109" stroke="#37705a" stroke-width="1"/><circle cx="315" cy="118" r="75" stroke="#37705a" stroke-width="1"/><path d="M50 315v-82c0-38 23-54 65-54h120c50 0 51-63 2-63h-16c-53 0-53-64 0-64h155c34 0 47-15 47-52" stroke="#71916d" stroke-width="48"/><path d="M50 315v-82c0-38 23-54 65-54h120c50 0 51-63 2-63h-16c-53 0-53-64 0-64h155c34 0 47-15 47-52" stroke="#d8e2b1" stroke-width="2" stroke-dasharray="10 11"/><path d="M50 315v-82c0-38 23-54 65-54h120c50 0 51-63 2-63h-16c-53 0-53-64 0-64h155c34 0 47-15 47-52" stroke="#cddda2" stroke-width="43" stroke-opacity=".06"/><g transform="translate(150 159)"><rect width="45" height="24" rx="9" fill="#e3edb9"/><rect x="12" y="4" width="22" height="16" rx="5" fill="#315b48"/><path d="M22 4v16" stroke="#a1b487"/></g><circle cx="343" cy="220" r="7" fill="#7a9a6d"/><circle cx="360" cy="227" r="4" fill="#7a9a6d"/><circle cx="338" cy="237" r="4" fill="#7a9a6d"/><path d="m142 62 8-14 8 14Z" fill="#9bb77b"/><path d="M150 62v9" stroke="#9bb77b" stroke-width="2"/><circle cx="337" cy="124" r="12" stroke="#c1d2a0" stroke-width="2"/><path d="M337 116v16m-8-8h16" stroke="#c1d2a0" stroke-width="2"/></svg></div></section>
    <div class="stat-grid">${[
      ['Kho câu hỏi', p.length, 'câu', `Dành cho hạng ${progress.license}`, 'book'],
      ['Đã học', seen, `/ ${p.length}`, seen ? `${Math.round(seen / p.length * 100)}% hành trình đã hoàn thành` : 'Bắt đầu từ câu đầu tiên', 'check'],
      ['Tỷ lệ trả lời đúng', seen ? Math.round(correct / seen * 100) : '—', seen ? '%' : '', 'Theo lần trả lời gần nhất', 'target'],
      ['Câu điểm liệt', critical.length, 'câu', `${correctCount(critical)} câu đã trả lời đúng`, 'shield'],
    ].map(([label, value, unit, note, symbol]) => `<div class="stat"><div class="stat-top">${label}${icon(symbol)}</div><div class="stat-value">${value}<small>${unit}</small></div><div class="stat-note">${note}</div></div>`).join('')}</div>
    <div class="dashboard-lower"><section><div class="section-heading"><h2>Học theo chủ đề</h2><small>Từng bước nắm vững kiến thức</small></div><div class="topic-grid">${dataset.categories.filter(c => p.some(q => q.category === c.id)).map((c, i) => { const qs = p.filter(q => q.category === c.id), learned = answered(qs).length; return `<button class="topic-card" data-action="topic" data-id="${c.id}"><div class="topic-top"><span class="topic-icon">${icon(topicIcons[c.id])}</span><span class="topic-no">CHỦ ĐỀ ${String(i + 1).padStart(2, '0')}</span></div><h3>${escape(c.name)}</h3><div class="topic-bottom"><span>${qs.length} câu hỏi · ${learned} đã học</span><span>↗</span></div><div class="mini-track"><span style="width:${learned / qs.length * 100}%"></span></div></button>`; }).join('')}</div></section>
    <aside class="dashboard-aside"><div class="panel goal-panel"><div class="goal-top"><p class="eyebrow">MỤC TIÊU HÔM NAY</p>${icon('target')}</div><div class="goal-number">${Math.min(daily, 30)}<small> / 30 câu</small></div><p>${daily >= 30 ? 'Bạn đã hoàn thành mục tiêu hôm nay!' : 'Giữ nhịp học, mỗi ngày tiến một chút.'}</p><div class="mini-track"><span style="width:${Math.min(daily / 30 * 100, 100)}%"></span></div><button class="primary" data-action="route" data-route="exams">Thử sức một đề luyện <span>→</span></button></div><div class="panel critical-panel"><p class="eyebrow">ĐỪNG BỎ QUA</p><h3>Nhớ chắc từng<br>câu điểm liệt.</h3><p>Ôn kỹ các tình huống quan trọng để tránh mất điểm đáng tiếc.</p><button class="text-button" data-action="route" data-route="critical">Ôn ${critical.length} câu điểm liệt →</button></div></aside></div>${offlinePanel()}`;
}
function buildStudyList() {
  let list = pool();
  if (state.route === 'critical') list = list.filter(q => q.critical);
  if (state.route === 'wrong') list = list.filter(q => progress.answers[q.id]?.correct === false);
  if (state.route === 'saved') list = list.filter(q => progress.bookmarks.includes(q.id));
  if (state.category) list = list.filter(q => q.category === Number(state.category));
  const query = normalize(state.search).trim();
  if (query) list = list.filter(q => normalize(`${q.id} ${q.text} ${q.options.map(o => o.text).join(' ')}`).includes(query));
  state.list = list; state.index = Math.min(state.index, Math.max(0, list.length - 1));
}
function emptyState(title, description, symbol = 'book') { return `<div class="empty">${icon(symbol)}<h2>${title}</h2><p>${description}</p><button class="primary" data-action="route" data-route="learn">Mở bộ câu hỏi →</button></div>`; }
function toolbar(kind = 'questions') { return `<div class="toolbar"><label class="search-box">${icon('search')}<input id="search" type="search" placeholder="${kind === 'signs' ? 'Tìm tên hoặc nội dung biển báo…' : 'Tìm nội dung hoặc số câu hỏi…'}" aria-label="Tìm kiếm" value="${escape(state.search)}"></label><select id="category" class="filter-select" aria-label="Lọc chủ đề"><option value="">${kind === 'signs' ? 'Tất cả nhóm biển báo' : 'Tất cả chủ đề'}</option>${(kind === 'signs' ? dataset.signCategories : dataset.categories).map(c => `<option value="${c.id}" ${String(c.id) === state.category ? 'selected' : ''}>${escape(c.name)}</option>`).join('')}</select></div>`; }
function renderNumberGrid(questions, current, responses, examMode = false) {
  const page = Math.floor(current / 60), start = page * 60, visible = questions.slice(start, start + 60);
  return `<div class="panel question-nav"><h3>${examMode ? 'Phiếu trả lời' : 'Danh sách câu hỏi'}</h3><p class="nav-summary">${examMode ? Object.keys(responses).length : questions.filter(q => responses[q.id]).length} / ${questions.length} câu đã trả lời</p><div class="number-grid">${visible.map((q, offset) => { const response = responses[q.id]; const status = response ? examMode ? 'answered' : Number(response) === q.answer ? 'correct' : 'wrong' : ''; return `<button class="number-button ${current === start + offset ? 'current' : ''} ${status}" data-action="${examMode ? 'exam-jump' : 'jump'}" data-index="${start + offset}" aria-label="${examMode ? 'Vị trí ' + (start + offset + 1) + ', câu ' : 'Câu '}${q.id}${response ? ', đã trả lời' : ''}" ${current === start + offset ? 'aria-current="true"' : ''}>${examMode ? start + offset + 1 : q.id}</button>`; }).join('')}</div>${questions.length > 60 ? `<div class="grid-pagination"><button class="icon-button" data-action="jump" data-index="${Math.max(0, start - 60)}" ${page === 0 ? 'disabled' : ''} aria-label="Nhóm câu trước">‹</button><span>${start + 1}–${Math.min(start + 60, questions.length)} / ${questions.length}</span><button class="icon-button" data-action="jump" data-index="${start + 60}" ${start + 60 >= questions.length ? 'disabled' : ''} aria-label="Nhóm câu sau">›</button></div>` : ''}<div class="legend"><span>${examMode ? 'Đã chọn' : 'Trả lời đúng'}</span>${examMode ? '' : '<span class="legend-wrong">Cần ôn lại</span>'}</div>${examMode ? '<button class="primary" style="width:100%;margin-top:22px" data-action="submit-exam">Nộp bài</button>' : '<p class="kbd-hint">Phím 1–4: chọn đáp án · ← →: chuyển câu</p>'}</div>`;
}
function questionMarkup(q, response, examMode = false) {
  return `<article class="question-card"><div class="question-meta"><span class="question-number">CÂU ${q.id}</span><span class="tag">${escape(categoryName(q.category))}</span>${q.critical && !examMode ? '<span class="tag critical-tag">Điểm liệt</span>' : ''}<button class="icon-button ${progress.bookmarks.includes(q.id) ? 'bookmarked' : ''}" data-action="bookmark" data-id="${q.id}" aria-label="${progress.bookmarks.includes(q.id) ? 'Bỏ đánh dấu' : 'Đánh dấu câu này'}" aria-pressed="${progress.bookmarks.includes(q.id)}">${icon('bookmark')}</button></div><h2 class="question-text" id="question-text">${escape(q.text)}</h2>${q.image ? `<img class="question-image" src="${escape(q.image)}" alt="Hình minh họa câu hỏi ${q.id}" decoding="async">` : ''}<div class="answers" role="group" aria-labelledby="question-text">${q.options.map(o => { const chosen = Number(response) === o.id, show = response && !examMode; const style = show ? o.id === q.answer ? 'correct' : chosen ? 'wrong' : '' : chosen ? 'selected' : ''; return `<button class="answer ${style}" data-action="${examMode ? 'exam-answer' : 'answer'}" data-option="${o.id}" ${show ? 'disabled' : ''} aria-pressed="${chosen}"><span class="answer-number">${o.id}</span><span>${escape(o.text)}</span>${show && (o.id === q.answer || chosen) ? `<span class="choice-state" aria-label="${o.id === q.answer ? 'Đáp án đúng' : 'Bạn chọn sai'}">${o.id === q.answer ? '✓' : '×'}</span>` : ''}</button>`; }).join('')}</div>${response && !examMode ? `<div role="status" class="answer-feedback ${Number(response) === q.answer ? 'correct' : 'wrong'}">${Number(response) === q.answer ? '✓ Chính xác. Bạn đang tiến bộ từng câu!' : `Đáp án đúng là ${q.answer}. Cùng xem lại nhé.`}</div><section class="explanation"><h3>${icon('book')} Giải thích từ dữ liệu gốc</h3><p>${escape(q.explanation || 'Câu hỏi này chưa có phần giải thích trong dữ liệu gốc.')}</p></section>` : ''}<div class="question-actions"><button class="secondary" data-action="${examMode ? 'exam-jump' : 'jump'}" data-index="${(examMode ? exam.index : state.index) - 1}" ${(examMode ? exam.index : state.index) === 0 ? 'disabled' : ''}>← Câu trước</button>${!examMode && response ? '<button class="text-button" data-action="retry-question">Làm lại câu này</button>' : ''}<button class="primary" data-action="${examMode ? 'exam-jump' : 'jump'}" data-index="${(examMode ? exam.index : state.index) + 1}" ${(examMode ? exam.index === exam.ids.length - 1 : state.index === state.list.length - 1) ? 'disabled' : ''}>Câu tiếp theo →</button></div></article>`;
}
function renderStudy() {
  const labels = { learn: ['Học theo chủ đề', 'Đọc, hiểu và ghi nhớ. Học theo nhịp độ của chính bạn.'], critical: ['Ôn chắc câu điểm liệt', 'Tập trung vào những tình huống quan trọng.'], wrong: ['Câu cần ôn lại', 'Mỗi lần làm sai là một cơ hội để nhớ lâu hơn.'], saved: ['Câu đã đánh dấu', 'Giữ lại những câu bạn muốn dành thêm thời gian.'] };
  const [title, description] = labels[state.route];
  const q = state.list[state.index];
  $('#main').innerHTML = `${heading(title, description)}${toolbar()}${q ? `<div class="results-count">${state.list.length} câu hỏi · Hạng ${escape(progress.license)}</div><div class="study-layout">${questionMarkup(q, state.responses[q.id])}${renderNumberGrid(state.list, state.index, state.responses)}</div>` : emptyState(state.search || state.category ? 'Không tìm thấy câu hỏi' : state.route === 'wrong' ? 'Chưa có câu nào cần ôn lại' : state.route === 'saved' ? 'Góc ghi nhớ đang trống' : 'Chưa có câu hỏi', state.search || state.category ? 'Thử từ khóa khác hoặc bỏ bộ lọc chủ đề.' : state.route === 'saved' ? 'Bấm biểu tượng đánh dấu trên mỗi câu để lưu tại đây.' : 'Khi bạn trả lời sai, câu hỏi sẽ xuất hiện ở đây để ôn lại.', state.route === 'saved' ? 'bookmark' : 'check')}${sourceNote()}`;
}
function renderSigns() {
  const query = normalize(state.search).trim();
  const signs = dataset.signs.filter(s => (!state.category || s.category === Number(state.category)) && (!query || normalize(s.name + ' ' + s.detail).includes(query)));
  $('#main').innerHTML = `${heading('Nhận diện biển báo', 'Hiểu ý nghĩa của từng biển báo trên hành trình.', '')}${toolbar('signs')}<p class="results-count">${signs.length} biển báo${state.category ? ' trong nhóm đã chọn' : ' trong thư viện'}</p>${signs.length ? `<div class="sign-grid">${signs.slice(0, state.signLimit).map(s => `<button class="sign-card" data-action="sign" data-id="${s.id}"><img src="${escape(s.image)}" alt="${escape(s.name)}" loading="lazy" decoding="async"><h3>${escape(s.name)}</h3><small>Xem ý nghĩa →</small></button>`).join('')}</div>${signs.length > state.signLimit ? `<div class="show-more"><button class="secondary" data-action="more-signs">Xem thêm biển báo (${signs.length - state.signLimit} còn lại)</button></div>` : ''}` : emptyState('Không tìm thấy biển báo', 'Thử từ khóa ngắn hơn hoặc một nhóm biển báo khác.', 'sign')}${sourceNote()}`;
}
function renderExamSetup() {
  const l = license();
  $('#main').innerHTML = `${heading('Thử sức, tự tin hơn', 'Một khoảng thời gian tập trung. Một bước chuẩn bị vững vàng.')}<div class="exam-layout"><section class="panel exam-intro"><p class="eyebrow">ĐỀ LUYỆN NGẪU NHIÊN · HẠNG ${escape(l.name)}</p><h2>Sẵn sàng vào bài?</h2><p>Đề được tạo từ kho câu hỏi của bạn, có phân bổ theo chủ đề và một câu điểm liệt.</p><div class="exam-facts"><div><strong>${l.count}</strong><small>câu hỏi</small></div><div><strong>${l.minutes}</strong><small>phút làm bài</small></div><div><strong>${l.pass}/${l.count}</strong><small>ngưỡng đạt theo dữ liệu</small></div></div><p class="exam-note">Bạn có thể đổi đáp án trước khi nộp bài. <strong>Câu điểm liệt sai hoặc chưa trả lời sẽ làm bài luyện không đạt.</strong> Giải thích chỉ xuất hiện sau khi nộp.</p><button class="primary" data-action="start-exam" style="margin-top:23px">Bắt đầu làm bài <span>→</span></button>${sourceNote()}</section><aside class="panel"><div class="section-heading"><h3>Những lần thử sức</h3>${icon('exam')}</div>${progress.history.length ? progress.history.slice(0, 8).map(h => `<div class="history-item"><span class="history-badge ${h.passed ? '' : 'fail'}">${h.passed ? '✓' : '↻'}</span><div>Hạng ${escape(h.license)}<small>${date(h.at)}</small></div><strong>${h.correct}/${h.total}</strong></div>`).join('') : '<p class="subtitle">Chưa có bài luyện nào. Bắt đầu đề đầu tiên để theo dõi sự tiến bộ của bạn.</p>'}</aside></div>`;
}
function examQuestions() { const byId = new Map(poolFor(dataset, exam.license).map(q => [q.id, q])); return exam.ids.map(id => byId.get(id)); }
function renderActiveExam() {
  const questions = examQuestions(), q = questions[exam.index];
  $('#main').innerHTML = `${heading(`Bài luyện hạng ${escape(exam.license)}`, `Câu ${exam.index + 1} / ${exam.ids.length} · Đã chọn ${Object.keys(exam.answers).length} đáp án`, '<div class="clock" id="exam-clock" aria-label="Thời gian còn lại"></div>')}<div class="study-layout">${questionMarkup(q, exam.answers[q.id], true)}${renderNumberGrid(questions, exam.index, exam.answers, true)}</div><p class="source-note">Đồng hồ vẫn tiếp tục khi bạn chuyển màn hình. Khi hết giờ, bài được nộp tự động.</p>`;
  updateClock();
}
function renderExamResult() {
  const { questions, answers, result, license: l } = examResult;
  $('#main').innerHTML = `${heading('Một chặng đường vừa hoàn thành', 'Nhìn lại bài làm để biết mình cần tập trung vào đâu.', '')}<div class="result-banner ${result.passed ? '' : 'failed'}"><p class="eyebrow">${result.passed ? 'ĐẠT NGƯỠNG BÀI LUYỆN' : 'CÙNG ÔN THÊM MỘT CHÚT'}</p><div class="score">${result.correct} <span style="font-size:20px;font-weight:400">/ ${result.total}</span></div><p>${result.criticalFailed ? 'Câu điểm liệt chưa đúng hoặc chưa trả lời.' : result.passed ? 'Bạn đã trả lời đúng câu điểm liệt và đạt ngưỡng điểm của bài luyện.' : `Cần ít nhất ${l.pass} câu đúng theo cấu hình dữ liệu gốc.`} ${result.unanswered ? `Có ${result.unanswered} câu chưa trả lời.` : ''}</p><div class="result-actions"><button class="primary" data-action="new-exam">Luyện đề khác →</button><button class="secondary" data-action="route" data-route="wrong">Ôn câu trả lời sai</button></div></div><div class="section-heading"><h2>Xem lại từng câu</h2><small>${questions.length} câu hỏi</small></div><div class="review-list">${questions.map((q, i) => { const correct = Number(answers[q.id]) === q.answer; return `<details><summary><span class="review-label ${correct ? '' : 'wrong'}">${correct ? 'Đúng' : 'Cần ôn'}</span>${i + 1}. ${escape(q.text)}</summary>${q.image ? `<img src="${escape(q.image)}" alt="Hình câu ${q.id}" loading="lazy">` : ''}<p>Bạn chọn: ${answers[q.id] || 'Chưa chọn'} · Đáp án đúng: ${q.answer}${q.critical ? ' · Câu điểm liệt' : ''}</p>${q.options.map(o => `<p ${o.id === q.answer ? 'style="color:#286b48;font-weight:600"' : ''}>${o.id}. ${escape(o.text)}</p>`).join('')}<div class="explanation"><h3>Giải thích từ dữ liệu gốc</h3><p>${escape(q.explanation || 'Chưa có giải thích trong dữ liệu gốc.')}</p></div></details>`; }).join('')}</div>${sourceNote()}`;
}
function render() {
  updateNav();
  if (state.route === 'home') renderHome();
  else if (state.route === 'signs') renderSigns();
  else if (state.route === 'exams') { if (exam) renderActiveExam(); else if (examResult) renderExamResult(); else renderExamSetup(); }
  else renderStudy();
}
const studyRoutes = new Set(['learn', 'critical', 'wrong', 'saved']);
function rememberStudyPosition() {
  if (!studyRoutes.has(state.route) || !state.list[state.index]) return;
  const key = studyPositionKey(progress.license, state.route, state.category);
  const id = state.list[state.index].id;
  if (progress.studyPositions[key] !== id) { progress.studyPositions[key] = id; save(); }
}
function restoreStudyPosition(preferredId) {
  if (!studyRoutes.has(state.route)) return;
  const savedId = progress.studyPositions[studyPositionKey(progress.license, state.route, state.category)];
  const id = preferredId ?? savedId ?? (state.route === 'learn' && !state.category ? progress.lastQuestion : null);
  const index = state.list.findIndex(q => q.id === id);
  if (index >= 0) state.index = index;
}
function go(route, options = {}) {
  if (!navItems.some(n => n[0] === route)) route = 'home';
  rememberStudyPosition();
  state = { ...state, route, category: options.category || '', search: '', index: 0, list: [],
    responses: restoredStudyResponses(progress), signLimit: 32 };
  buildStudyList();
  restoreStudyPosition(options.id);
  history.replaceState(null, '', `#${route}`);
  if ($('#modal').open) $('#modal').close();
  chrome.show();
  render(); window.scrollTo({ top: 0, behavior: 'instant' });
}
function showModal(markup) { chrome.show(); $('#modal-content').innerHTML = markup; if (!$('#modal').open) $('#modal').showModal(); }
const modalHeading = title => `<div class="modal-heading"><h2>${title}</h2><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div>`;
function about() {
  showModal(`${modalHeading('Góc học tập của bạn')}<div class="modal-copy"><strong>Nguồn dữ liệu</strong><p>600 câu hỏi, 60 câu điểm liệt và 332 biển báo trích từ ứng dụng Android ngày 11/11/2026.</p><p><code>${escape(dataset.source.package)}</code></p><p>${escape(dataset.source.note)}</p><p>Hạng bằng, đáp án và ngưỡng đạt được giữ theo cơ sở dữ liệu nguồn. Đây là công cụ ôn tập cá nhân. Kết quả bài luyện không thay thế kết quả sát hạch.</p><hr class="modal-divider"><strong>Tiến độ trên thiết bị</strong><p>Câu đã học, đánh dấu và lịch sử luyện đề được lưu trong trình duyệt này. Xuất tệp để sao lưu hoặc chuyển sang thiết bị khác.</p></div><div class="modal-actions"><button class="secondary" data-action="export">Xuất tiến độ ↓</button><button class="secondary" data-action="import">Nhập tiến độ ↑</button><input id="import-file" type="file" accept="application/json,.json" hidden></div><hr class="modal-divider"><div class="modal-copy"><strong>Học ngoại tuyến & cài ứng dụng</strong><p>Bấm “Tải để học ngoại tuyến” ở trang tổng quan và chờ hoàn tất. Khi có kết nối, Chrome/Edge có thể cho phép cài ứng dụng. Trên Safari iPhone: Chia sẻ → Thêm vào Màn hình chính. Tiến độ lưu riêng theo trình duyệt và địa chỉ trang web.</p></div><div class="modal-actions"><button class="danger-button" data-action="reset-confirm">Xóa tiến độ trên thiết bị</button></div>`);
}
function recordAnswer(q, selected) {
  progress.answers[q.id] = { selected, correct: selected === q.answer, at: Date.now() };
  progress.lastQuestion = q.id;
  progress.studyPositions[studyPositionKey(progress.license, state.route, state.category)] = q.id;
  save();
}
function startExam() {
  try {
    const questions = generateExam(dataset, progress.license);
    exam = { license: progress.license, ids: questions.map(q => q.id), answers: {}, index: 0, deadline: Date.now() + license().minutes * 60000 };
    examResult = null; saveExam(); render();
  } catch (error) { toast(error.message); }
}
function finishExam() {
  if (!exam) return;
  if ($('#modal').open) $('#modal').close();
  const questions = examQuestions(), l = dataset.licenses.find(l => l.name === exam.license), result = gradeExam(questions, exam.answers, l.pass);
  // Unanswered exam questions count as wrong for subsequent revision.
  for (const q of questions) { const selected = Number(exam.answers[q.id]) || 0; progress.answers[q.id] = { selected, correct: selected === q.answer, at: Date.now() }; }
  progress.history.unshift({ license: exam.license, ...result, at: Date.now() }); progress.history = progress.history.slice(0, 50);
  examResult = { questions, answers: { ...exam.answers }, result, license: l }; exam = null; saveExam(); save(); go('exams');
}
function updateClock() {
  if (!exam) return;
  const remaining = Math.max(0, Math.ceil((exam.deadline - Date.now()) / 1000));
  const clock = $('#exam-clock');
  if (clock) { clock.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`; clock.classList.toggle('urgent', remaining <= 60); }
  if (remaining === 0) { finishExam(); toast('Đã hết giờ. Bài luyện đã được nộp.'); }
}
async function downloadOffline() {
  try {
    if (!('serviceWorker' in navigator)) throw new Error('Trình duyệt này chưa hỗ trợ ngoại tuyến.');
    const registration = serviceWorkerRegistration || await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (!worker) throw new Error('Chờ một chút rồi tải lại dữ liệu.');
    offline.status = 'downloading'; if (state.route === 'home') renderHome();
    await navigator.storage?.persist?.(); worker.postMessage({ type: 'download-offline' });
  } catch (error) { offline.status = 'error'; toast(error.message); if (state.route === 'home') renderHome(); }
}
function handleAction(action, button) {
  const id = Number(button.dataset.id), index = Number(button.dataset.index), q = state.list[state.index];
  switch (action) {
    case 'more-nav': showModal(`${modalHeading('Góc học tập')}<nav class="more-nav" aria-label="Các mục khác">${navItems.slice(2).filter(([route]) => !['exams', 'signs'].includes(route)).map(([route, label, symbol]) => `<a class="nav-item" href="#${route}" ${route === state.route ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span></a>`).join('')}</nav><button class="secondary" data-action="about">Nguồn dữ liệu & cài đặt</button>`); break;
    case 'route': go(button.dataset.route); break;
    case 'continue': go('learn', { id: pool().find(q => !progress.answers[q.id])?.id || progress.lastQuestion }); break;
    case 'topic': go('learn', { category: String(id) }); break;
    case 'answer': if (q && !state.responses[q.id]) { const selected = Number(button.dataset.option); state.responses[q.id] = selected; recordAnswer(q, selected); renderStudy(); updateNav(); } break;
    case 'retry-question': delete state.responses[q.id]; renderStudy(); break;
    case 'jump': if (index >= 0 && index < state.list.length) { state.index = index; rememberStudyPosition(); renderStudy(); if (window.innerWidth < 961) $('#main').scrollIntoView({ block: 'start' }); } break;
    case 'bookmark': { const at = progress.bookmarks.indexOf(id); if (at >= 0) progress.bookmarks.splice(at, 1); else progress.bookmarks.push(id); save(); render(); toast(at >= 0 ? 'Đã bỏ đánh dấu câu hỏi.' : 'Đã lưu vào câu đánh dấu.'); break; }
    case 'sign': { const sign = dataset.signs.find(s => s.id === id); showModal(`${modalHeading(escape(sign.name))}<img class="sign-detail-image" src="${escape(sign.image)}" alt="${escape(sign.name)}"><div class="sign-detail-text">${escape(sign.detail)}</div><p class="source-note">Nội dung giữ theo dữ liệu ứng dụng gốc.</p>`); break; }
    case 'more-signs': state.signLimit += 32; renderSigns(); break;
    case 'about': about(); break;
    case 'close-modal': $('#modal').close(); break;
    case 'start-exam': startExam(); break;
    case 'new-exam': examResult = null; renderExamSetup(); break;
    case 'exam-answer': if (exam) { const current = examQuestions()[exam.index]; exam.answers[current.id] = Number(button.dataset.option); saveExam(); renderActiveExam(); } break;
    case 'exam-jump': if (exam && index >= 0 && index < exam.ids.length) { exam.index = index; saveExam(); renderActiveExam(); if (window.innerWidth < 961) $('#main').scrollIntoView({ block: 'start' }); } break;
    case 'submit-exam': { const remaining = exam.ids.length - Object.keys(exam.answers).length; showModal(`${modalHeading('Nộp bài luyện?')}<p class="modal-copy">${remaining ? `Bạn còn ${remaining} câu chưa chọn đáp án. ` : 'Bạn đã chọn đáp án cho tất cả câu hỏi. '}Sau khi nộp, bạn sẽ xem được kết quả và giải thích.</p><div class="modal-actions"><button class="secondary" data-action="close-modal">Tiếp tục làm bài</button><button class="primary" data-action="finish-exam">Nộp và xem kết quả</button></div>`); break; }
    case 'finish-exam': $('#modal').close(); finishExam(); break;
    case 'offline': downloadOffline(); break;
    case 'export': { const url = URL.createObjectURL(new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'gplx-tien-do.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); break; }
    case 'import': $('#import-file').click(); break;
    case 'reset-confirm': showModal(`${modalHeading('Xóa tiến độ đã lưu?')}<p class="modal-copy">Thao tác sẽ xóa câu đã học, đánh dấu và lịch sử luyện đề trong trình duyệt này. Hãy xuất tiến độ trước nếu bạn cần giữ lại.</p><div class="modal-actions"><button class="secondary" data-action="close-modal">Giữ tiến độ</button><button class="danger-button" data-action="reset">Xóa toàn bộ tiến độ</button></div>`); break;
    case 'reset': progress = emptyProgress(); exam = null; examResult = null; save(); saveExam(); $('#modal').close(); go('home'); toast('Đã xóa tiến độ trên thiết bị.'); break;
  }
}

document.addEventListener('click', event => {
  const nav = event.target.closest('.nav-item, .bottom-item[href], .brand');
  if (nav) { event.preventDefault(); go(nav.hash.slice(1)); return; }
  const button = event.target.closest('[data-action]');
  if (button) handleAction(button.dataset.action, button);
  if (event.target === $('#modal')) $('#modal').close();
});
document.addEventListener('change', async event => {
  if (event.target.id === 'license') { rememberStudyPosition(); progress.license = event.target.value; state.index = 0; state.responses = restoredStudyResponses(progress); buildStudyList(); restoreStudyPosition(); save(); render(); }
  if (event.target.id === 'category') { rememberStudyPosition(); state.category = event.target.value; state.index = 0; state.signLimit = 32; buildStudyList(); restoreStudyPosition(); render(); }
  if (event.target.id === 'import-file' && event.target.files[0]) {
    try {
      if (event.target.files[0].size > 2e6) throw new Error('Tệp quá lớn. Chọn tệp tiến độ do ứng dụng xuất.');
      const imported = parseProgress(await event.target.files[0].text());
      for (const [id, answer] of Object.entries(imported.answers)) { const q = dataset.questions.find(q => q.id === Number(id)); if (q) answer.correct = answer.selected === q.answer; else delete imported.answers[id]; }
      if (!dataset.licenses.some(l => l.name === imported.license)) imported.license = 'B';
      progress = imported; save(); $('#modal').close(); go('home'); toast('Đã nhập tiến độ.');
    } catch (error) { toast(error.message); }
  }
});
document.addEventListener('input', event => {
  if (event.target.id !== 'search') return;
  const input = event.target, position = input.selectionStart; state.search = input.value; state.index = 0; state.signLimit = 32; buildStudyList();
  if (state.route === 'signs') renderSigns(); else renderStudy();
  $('#search').focus(); try { $('#search').setSelectionRange(position, position); } catch {}
});
document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || $('#modal').open || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
  const isExam = state.route === 'exams' && exam;
  if (!isExam && !['learn', 'critical', 'wrong', 'saved'].includes(state.route)) return;
  if (/^[1-4]$/.test(event.key)) { const button = document.querySelector(`[data-action="${isExam ? 'exam-answer' : 'answer'}"][data-option="${event.key}"]`); if (button && !button.disabled) { event.preventDefault(); button.click(); } }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { const target = (isExam ? exam.index : state.index) + (event.key === 'ArrowLeft' ? -1 : 1); event.preventDefault(); handleAction(isExam ? 'exam-jump' : 'jump', { dataset: { index: target } }); }
});
function updateConnection() { $('#connection-label').textContent = navigator.onLine ? 'Đang trực tuyến' : 'Đang ngoại tuyến'; }
addEventListener('online', updateConnection); addEventListener('offline', updateConnection); updateConnection();
addEventListener('hashchange', () => { if (dataset) go(location.hash.slice(1)); });

let chrome = { show() {} }; // Initialized inside the startup error boundary.

async function init() {
  try {
    chrome = initChrome({ showModal, modalHeading, toast });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('./data/dataset.json', { signal: controller.signal });
      if (!response.ok) throw new Error('Không tải được dữ liệu.');
      dataset = await response.json();
    } finally { clearTimeout(timeout); }
    try { progress = parseProgress(localStorage.getItem(STORAGE_KEY)); } catch { progress = emptyProgress(); }
    if (!dataset.licenses.some(l => l.name === progress.license)) progress.license = 'B';
    try {
      const saved = JSON.parse(sessionStorage.getItem('gplx-active-exam'));
      if (saved && dataset.licenses.some(l => l.name === saved.license) && Array.isArray(saved.ids) && saved.ids.length === dataset.licenses.find(l => l.name === saved.license).count && validExamIds(dataset, saved.license, saved.ids) && Number.isFinite(saved.deadline) && saved.answers && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < saved.ids.length) { exam = saved; progress.license = exam.license; }
    } catch {}
    // Discard an old invalid temporary exam session but keep all learning progress.
    if (!exam) { try { sessionStorage.removeItem('gplx-active-exam'); } catch {} }
    go(location.hash.slice(1) || (exam ? 'exams' : 'home')); timer = setInterval(updateClock, 1000); updateClock();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        const m = event.data;
        if (m.type === 'offline-progress') offline = { status: 'downloading', completed: m.completed, total: m.total };
        if (m.type === 'offline-done') { offline.status = 'ready'; toast('Đã tải đầy đủ dữ liệu. Bạn có thể học ngoại tuyến.'); }
        if (m.type === 'offline-error') { offline.status = 'error'; toast(m.message || 'Tải chưa hoàn tất. Bạn có thể thử lại.'); }
        if (state.route === 'home' && m.type.startsWith('offline-')) { const panel = document.querySelector('.offline-panel'); if (panel) panel.outerHTML = offlinePanel(); }
      });
      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(async registration => {
        serviceWorkerRegistration = registration;
        const dataCache = await caches.open('gplx-offline-data-v1');
        const ready = await dataCache.match(new URL('offline-ready', registration.scope));
        const manifest = await (await fetch('./data/offline.json')).json();
        if (ready && await ready.text() === manifest.revision) { offline.status = 'ready'; if (state.route === 'home') renderHome(); }
      }).catch(() => toast('Ngoại tuyến chưa sẵn sàng. Hãy mở bằng HTTPS hoặc localhost.'));
    }
  } catch (error) { $('#main').innerHTML = `<div class="empty"><h1>Chưa mở được bộ câu hỏi</h1><p>${escape(error.message)} Kiểm tra kết nối rồi tải lại trang.</p><button class="primary" onclick="location.reload()">Thử lại</button></div>`; }
}
await init();
