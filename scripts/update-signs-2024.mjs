// Reapply sign-only corrections to a published checkout without the private APK/SQLite.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { applySign2024Updates, sign2024AuditSummary, sign2024AuditCsv, SIGN_STANDARD_2024 } from './signs-2024.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
const check = process.argv.includes('--check');
function output(path, text) {
  if (check) {
    if (readFileSync(resolve(root, path), 'utf8') !== text) throw new Error(`Out of date: ${path}`);
  } else writeFileSync(resolve(root, path), text);
}
const dataset = read('dist/data/dataset.json');
dataset.signs = applySign2024Updates(dataset.signs.filter(sign => sign.legacy));
dataset.source.signAudit2024 = sign2024AuditSummary(dataset.signs);
const bytes = JSON.stringify(dataset);
output('dist/data/dataset.json', bytes);
const manifest = read('dist/data/offline.json');
manifest.revision = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
output('dist/data/offline.json', JSON.stringify(manifest));
output('docs/SIGN_2024_AUDIT.csv', sign2024AuditCsv(dataset.signs));

const baseline = read('docs/SIGN_2024_BATCH1_BASELINE.json');
const before = new Map(baseline.before.map(sign => [sign.id, sign]));
const after = new Map(dataset.signs.map(sign => [sign.id, sign]));
const cell = text => String(text).replaceAll('|', '\\|').replaceAll('\n', '<br>');
const content = sign => cell(`${sign.name}\n${sign.detail}`);
const source = (pages, label) => `[${label || 'PDF ' + pages.join(', ')}](${SIGN_STANDARD_2024.officialPdf}#page=${pages[0]})`;
let report = `# Biển cấm — đợt 1: 20 pending và điều tra ID 54/116

Ngày đối chiếu: 11/11/2026 (Asia/Saigon). Baseline: \`${baseline.baseCommit}\`.
Chọn đúng 20 dòng category=1 có verification=pending theo ID tăng dần; 54/116 là hai điều tra bổ sung, không tính vào 20.

## Nguồn và cách đọc bằng chứng

- [Thông tư 51/2024/TT-BGTVT](${SIGN_STANDARD_2024.governmentRecord}), hiệu lực 01/01/2025.
- [PDF QCVN 41:2024/BGTVT chính thức](${SIGN_STANDARD_2024.officialPdf}), tải ngày 11/11/2026, 403 trang, SHA-256 \`${SIGN_STANDARD_2024.pdfSha256}\`.
- [Bản sao cổng pháp luật Hải Phòng](https://pbgdpl.haiphong.gov.vn/upload/phobienphapluat/product/2025/09-2025/000175499/51-bgtvt-kem-29797.pdf) tải độc lập có cùng hash. Chỉ dùng PDF quy chuẩn làm căn cứ, không dùng ảnh mạng.
- Trang PDF đếm từ 1, **trùng số in ở chân trang** với các trang 80–93 được viện dẫn ở đợt này; không cộng trang thông tư. Đọc văn bản và xem bản render màu các trang 80–84, 87–88, 92–93, so với PNG gốc.
- Mỗi dòng CSV có trang văn bản, trang hình, nhãn hình, diễn giải chứng cứ, quan sát ảnh và SHA-256 ảnh. Diễn giải là tóm lược, không thay thế toàn văn quy chuẩn; không thêm ngoại lệ khi khoản viện dẫn không nêu.
- \`text-verified\` xác nhận mã/tên/phạm vi và ngoại lệ trong bản tóm lược. 22 ảnh đã so ký hiệu/biến thể, nhưng **imageVerification=pending, imageReview=NEEDS_REVIEW** vì chưa kiểm định thông số thiết kế phụ lục M. Không thay hoặc vẽ lại ảnh nào.

## BEFORE / AFTER — đúng 20 bản ghi pending

Mọi ID, category, sourceUpdated và đường dẫn/byte ảnh giữ nguyên. Bảng ghi nguyên văn tên và mô tả; MATCH chỉ bổ sung metadata/bằng chứng.

| ID / mã | BEFORE: tên và ý nghĩa | AFTER: tên và ý nghĩa | Quyết định / nguồn |
| --- | --- | --- | --- |
`;
for (const id of baseline.selectedIds) {
  const old = before.get(id), sign = after.get(id), a = sign.qcvn2024.audit;
  report += `| ${id} / ${sign.code} | ${content(old)} | ${content(sign)} | ${a.decision}; ${sign.qcvn2024.clause}; ${source(a.pdfPages)}; hình ${a.figure} trang ${a.figurePage} |\n`;
}
report += '\n## Chứng cứ từng quyết định và đối chiếu hình\n\n';
for (const id of [...baseline.selectedIds, 54, 116]) {
  const sign = after.get(id), a = sign.qcvn2024.audit;
  report += `### ID ${id} — ${sign.code}\n\n${source(a.pdfPages)}, mục **${sign.qcvn2024.clause}**, hình **${a.figure}**, trang hình **${a.figurePage}**.\n\n${a.evidence}\n\nẢnh [${sign.image}](../dist/${sign.image}): ${a.imageComparison}\n\nSHA-256 ảnh: \`${a.imageSha256}\`. ${a.imageReview}: ${a.imageReviewReason}\n\n`;
}
report += '## Kết quả điều tra riêng ID 54 và 116\n\n| ID | BEFORE: mã / tên / ý nghĩa | AFTER: mã / tên / ý nghĩa | Quyết định |\n| --- | --- | --- | --- |\n';
for (const id of [54,116]) report += `| ${id} | ${before.get(id).code}; ${content(before.get(id))} | ${after.get(id).code}; ${content(after.get(id))} | REMAP_CODE; B.27d, PDF 92–93 |\n`;
report += `
Cùng đường dẫn và cùng byte ảnh chứng minh đây là hai bản ghi trùng ảnh. B.27d là số mục; P.127d là tên nguồn cũ; chú thích dưới mẫu ở PDF 92 ghi DP.127a. Mẫu DP.127c ở PDF 93 có một vạch xóa chéo toàn bảng, khác ba vạch xóa riêng của ảnh gốc. Không suy ra biến thể chỉ từ tên file. Giữ cả hai ID để không làm hỏng tham chiếu cũ. Chưa xác minh được tại sao nguồn tạo hai dòng (thiếu SQLite/APK trong checkout).

## Còn NEEDS_REVIEW và rủi ro

- Cả 22 ảnh: chưa đo màu/tỷ lệ/kích thước theo phụ lục M hoặc xác nhận quyền tái xuất bản. ID 43: PDF ghi 2,5 t; PNG ghi 2.5t, cùng trị số nhưng khác dấu thập phân/khoảng cách. Chỉ xác nhận ký hiệu và cách đọc ngưỡng khối lượng chuyên chở, chưa công nhận ảnh đúng mọi thông số.
- ID 54/116: mã và biến thể đã xác định; lịch sử trùng dòng trong nguồn chưa rõ. Không gộp hoặc xóa.
- Còn 301 nội dung pending; 17 nội dung text-verified từ đợt trước chưa được nâng cấp bằng chứng trang ở đợt này. 340 ảnh vẫn chưa được chứng nhận thiết kế; 8 mục mới chưa có ảnh.
- Rủi ro dữ liệu thấp: không đổi 600 câu/đáp án hoặc các phần dataset ngoài signs và source.signAudit2024; không sửa logic/khóa lưu tiến độ. Fixture khóa hash toàn bộ questions, phần ngoài signs, 332 ID/asset và các biển ngoài phạm vi.
- Rủi ro nội dung còn lại: bản tóm lược không bao trùm mọi quy tắc bố trí biển; người học cần đọc khoản được dẫn. Việc đối chiếu ký hiệu không phải nghiệm thu hình kỹ thuật. PWA phải tải lại bộ dữ liệu ngoại tuyến khi revision thay đổi; không xóa localStorage/sessionStorage.

## Tái tạo và kiểm tra

\`npm run audit:signs\` cập nhật dataset, offline revision, CSV và báo cáo này từ script nguồn. \`npm run audit:signs -- --check\` kiểm tra không có file sinh bị lệch. Không cần APK/SQLite để áp lại vào checkout; \`npm run extract\` với nguồn gốc vẫn gọi cùng hàm cập nhật.

Kết quả kiểm thử thật và giới hạn QA ở [VALIDATION.md](../VALIDATION.md). Dừng ở PR, không merge hoặc triển khai hosting.
`;
output('docs/SIGN_2024_PROHIBITION_BATCH1.md', report);
console.log(`${check ? 'Checked' : 'Updated'} sign-only dataset, offline revision, CSV and batch report.`);
