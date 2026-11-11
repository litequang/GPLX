// Evidence-backed, reversible sign-library update for QCVN 41:2024/BGTVT.
// This does NOT claim all legacy texts or images are fully verified.
// Source: Ministry of Transport Circular 51/2024/TT-BGTVT, effective 2025-01-01.
export const SIGN_STANDARD_2024 = Object.freeze({
  code: 'QCVN 41:2024/BGTVT',
  circular: '51/2024/TT-BGTVT',
  effectiveFrom: '2025-01-01',
  officialPdf: 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf',
  governmentRecord: 'https://vanban.chinhphu.vn/?classid=1&docid=211908&orggroupid=4&pageid=27160',
  reviewedOn: '2026-11-11',
});
const corrections = Object.freeze({
  25: { code: 'S.510a', name: 'Biển số S.510a "Chú ý đường trơn có băng tuyết"', detail: 'Cảnh báo đường trơn, có tuyết trong những ngày trời có tuyết.', clause: 'F.12' },
  33: { code: 'S.G,12b', name: 'Biển số S.G,12b "Làn đường không lưu thông"', clause: 'F.16' },
  41: { name: 'Biển số P.124b "Cấm ô tô quay đầu xe"', clause: 'B.24' },
  61: { name: 'Biển số P.114 "Cấm xe vật nuôi kéo"', clause: 'B.14' },
  95: { name: 'Biển số P.124b "Cấm ô tô quay đầu xe"', clause: 'B.24' },
  143: { name: 'Biển số DP.134 "Hết tốc độ tối đa cho phép"', detail: 'Báo hiệu hết hiệu lực của biển P.127 "Tốc độ tối đa cho phép"; sau biển này xe được đi theo tốc độ tối đa do pháp luật quy định.', clause: 'B.34' },
  171: { name: 'Biển số R.412o "Kết thúc làn đường dành cho xe máy và xe đạp"', detail: 'Báo hiệu kết thúc làn đường dành cho xe máy và xe đạp.', clause: 'D.14' },
  297: { detail: 'Chỉ dẫn khu vực đỗ xe tải để nhận và trả hàng hóa. Nếu không phải bến xe tải theo quy định thì thay dòng chữ trên biển thành "Điểm dừng xe tải".', clause: 'E.37' },
  328: { name: 'Biển số I.446 "Nơi đỗ xe dành cho người khuyết tật"', detail: 'Báo hiệu nơi đỗ xe dành cho người khuyết tật; có thể kết hợp với biển P.131a hoặc I.408 khi phù hợp.', clause: 'E.49' },
});
const additions = Object.freeze([
  { code: 'R.403g', category: 2, clause: 'D.11', name: 'Đường dành cho xe chở hàng bốn bánh gắn động cơ', detail: 'Báo hiệu bắt đầu đoạn đường dành cho xe chở hàng bốn bánh gắn động cơ; các loại phương tiện khác không được đi vào đoạn đường theo hiệu lệnh của biển.' },
  { code: 'R.403h', category: 2, clause: 'D.11', name: 'Đường dành cho xe chở người bốn bánh gắn động cơ', detail: 'Báo hiệu bắt đầu đoạn đường dành cho xe chở người bốn bánh gắn động cơ; các loại phương tiện khác không được đi vào đoạn đường theo hiệu lệnh của biển.' },
  { code: 'R.403k', category: 2, clause: 'D.11', name: 'Đường dành cho xe chở hàng, xe chở người bốn bánh gắn động cơ', detail: 'Báo hiệu bắt đầu đoạn đường dành cho nhóm xe chở hàng và xe chở người bốn bánh gắn động cơ.' },
  { code: 'R.404g', category: 2, clause: 'D.12', name: 'Hết đoạn đường dành cho xe chở hàng bốn bánh gắn động cơ', detail: 'Báo hiệu hết đoạn đường dành cho xe chở hàng bốn bánh gắn động cơ.' },
  { code: 'R.404h', category: 2, clause: 'D.12', name: 'Hết đoạn đường dành cho xe chở người bốn bánh gắn động cơ', detail: 'Báo hiệu hết đoạn đường dành cho xe chở người bốn bánh gắn động cơ.' },
  { code: 'R.404k', category: 2, clause: 'D.12', name: 'Hết đoạn đường dành cho xe chở hàng, xe chở người bốn bánh gắn động cơ', detail: 'Báo hiệu hết đoạn đường dành cho xe chở hàng và xe chở người bốn bánh gắn động cơ.' },
  { code: 'I.437', category: 3, clause: 'E.40', name: 'Đường cao tốc', detail: 'Chỉ dẫn vị trí bắt đầu đường cao tốc.' },
  { code: 'S.510b', category: 5, clause: 'F.12', name: 'Chú ý đường sắt', detail: 'Cảnh báo khi rẽ vào đường nhánh sẽ có giao cắt với đường sắt cách vị trí đặt biển dưới 100 m.' },
]);
const annexFor = category => ({1:'B',4:'C',2:'D',3:'E',5:'F'})[category];
export function extractSignCode(sign) {
  // Preserve GMS comma codes (R.E,9a; S.G,11a), unlike ordinary P/W/R/I code strings.
  const match = sign.name.match(/((?:DP|P|W|R|I|S)\.(?:(?:E|G|H)[,.])?\s*\d+\s*[a-z]?)/i);
  const fallback = sign.image?.match(/((?:DP|P|W|R|I|S)\.(?:(?:E|G|H)[,.])?\s*\d+\s*[a-z]?)/i);
  if (!match && !fallback) return null;
  return (match?.[1] || fallback?.[1]).replace(/\s+/g, '').replace(/^([RS]\.[EGH])\./,'$1,');
}
export function applySign2024Updates(legacySigns) {
  if (!Array.isArray(legacySigns)) throw new TypeError('Sign list required');
  // Source-ID 54 and 116 use old ambiguous P.127d/B.27d naming.
  // QCVN 2024 now uses DP.127; do not reassign either old image blindly.
  const mapped = legacySigns.map(sign => {
    const update = corrections[sign.id];
    const { code: overrideCode, clause = null, ...fields } = update || {};
    const code = overrideCode || extractSignCode(sign);
    const needsCodeReview = sign.id === 54 || sign.id === 116;
    const annex = annexFor(sign.category);
    return {
      ...sign, ...fields, code,
      legacy: { sourceId: sign.id, sourceUpdated: sign.sourceUpdated },
      qcvn2024: {
        annex, clause,
        verification: needsCodeReview ? 'needs-code-review' : update ? 'text-verified' : 'pending',
        imageVerification: 'pending',
      },
    };
  });
  const existingCodes = new Set(mapped.map(sign => sign.code));
  let nextId = Math.max(...mapped.map(sign => sign.id)) + 1;
  for (const item of additions) {
    if (existingCodes.has(item.code)) continue;
    mapped.push({
      id: nextId++, category: item.category, code: item.code,
      name: 'Biển số ' + item.code + ' "' + item.name + '"',
      detail: item.detail, image: null, sourceUpdated: '20261111',
      legacy: null,
      qcvn2024: { annex: annexFor(item.category), clause: item.clause,
        verification: 'text-verified', imageVerification: 'pending' },
    });
  }
  return mapped;
}
export function sign2024AuditSummary(signs) {
  return {
    standard: SIGN_STANDARD_2024,
    total: signs.length,
    textVerified: signs.filter(s => s.qcvn2024?.verification === 'text-verified').length,
    pendingText: signs.filter(s => s.qcvn2024?.verification === 'pending').length,
    needsCodeReview: signs.filter(s => s.qcvn2024?.verification === 'needs-code-review').map(s => s.id),
    imageVerificationPending: signs.filter(s => s.qcvn2024?.imageVerification === 'pending').length,
    noImage: signs.filter(s => !s.image).map(s => s.code),
    preserveLegacyIds: 332,
  };
}
