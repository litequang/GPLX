# Kiểm kê 340 mục biển báo GPLX — QCVN 41:2024/BGTVT

Ngày rà soát: 11/11/2026. File chi tiết: [SIGN_2024_AUDIT.csv](./SIGN_2024_AUDIT.csv).

**Phạm vi đã thực hiện (không phải chứng nhận 100% hình và mô tả):**

| Trạng thái | Số mục |
|---|---:|
| Giữ nguyên ID và hình của nguồn APK cũ | 332 |
| Bản ghi có tên/mô tả được hiệu đính qua hai đợt | 26 (9 trước + 15 đợt này + 2 đổi mã) |
| Mã được bổ sung theo quy chuẩn, mới có văn bản, **chưa có hình** | 8 |
| Tổng thư viện sau cập nhật | 340 |
| `text-verified` (17 trước + 20 pending + 2 điều tra) | 39 |
| `pending` (chưa rà nội dung từng biển) | 301 |
| `needs-code-review` | 0 (54/116 đã xác định DP.127a) |
| Hình đã so trực quan ký hiệu/biến thể | 22 |
| Hình chưa so trực quan | 318 |
| Hình chưa nghiệm thu thông số thiết kế (`pending`) | 340 |

**Nguồn chuẩn:** Thông tư 51/2024/TT-BGTVT, Quy chuẩn QCVN 41:2024/BGTVT, hiệu lực 01/01/2025: [Cổng Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=211908&orggroupid=4&pageid=27160); [PDF quy chuẩn](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf).

## Sửa nội dung có bằng chứng quy chuẩn
- P.124b (ID 41, 95): tên “Cấm ô tô quay đầu xe”, **B.24**.
- P.114 (ID 61): tên “Cấm xe vật nuôi kéo”, **B.14**.
- DP.134 (ID 143): tên và ý nghĩa hết tốc độ tối đa, **B.34**.
- R.412o (ID 171): bỏ từ lặp “xe xe máy”, **D.14**.
- I.434b (ID 297): **bến xe tải**; sửa mô tả cũ nhầm sang xe buýt, **E.37**.
- I.446 (ID 328): sửa thành người **khuyết tật**, **E.49**.
- S.510a (ID 25): chỉnh mã S.510 -> S.510a, **F.12**.
- S.G,12b (ID 33): chuẩn hóa mã, **F.16**.

## Bổ sung 8 mã có căn cứ nội dung
- **D.11:** R.403g, R.403h, R.403k — đường dành cho từng nhóm xe bốn bánh gắn động cơ.
- **D.12:** R.404g, R.404h, R.404k — hết đoạn đường dành riêng cho nhóm xe tương ứng.
- **E.40:** I.437 — bắt đầu đường cao tốc.
- **F.12:** S.510b — chú ý đường sắt khi rẽ vào nhánh có giao cắt đường sắt dưới 100 m.

Không tạo ảnh biển theo suy đoán; UI dùng placeholder có nhãn rõ ràng, có link PDF chính thức. Ảnh minh họa cũ vẫn là ảnh từ APK. 22 bản ghi đã so ký hiệu/biến thể với phụ lục B; **chưa nghiệm thu thiết kế theo phụ lục M**, không thay ảnh nào.

## Cần kiểm tra tiếp để công bố “đã đối chiếu toàn bộ”
1. Đối chiếu **301 mô tả** chưa review với điều khoản và hình trong PDF.
2. ID **54/116**: đã xác định **DP.127a** theo B.27d, PDF 92 (khác DP.127c trang 93). Còn xác minh lịch sử hai dòng trùng ảnh trong SQLite/APK; giữ cả hai ID.
3. Trích đúng hình từ PDF, xác nhận biến thể cho 332 biển nguồn và 8 biển mới; tối ưu SVG/WebP theo đúng đồ họa, kiểm tra việc tái xuất bản.
4. So sánh tập mã đầy đủ toàn quy chuẩn để phát hiện các biển khác còn thiếu; 340 mục **không phải toàn bộ mã theo QCVN 41:2024**.
5. Trước khi mở rộng danh mục, thêm các kiểm thử kiểm tra asset có hash và đối chiếu trang nguồn theo từng biển.

## Hậu cần kỹ thuật
- `scripts/signs-2024.mjs`: nguồn cập nhật có thể áp lại khi trích xuất APK; không sửa bài thi 600 câu.
- `dist/data/dataset.json`: tích hợp mã chuẩn hóa, provenance, phân biệt tình trạng nội dung/hình.
- `dist/data/offline.json`: cập nhật SHA-256; 8 mục chưa có ảnh không được ghi thành URL `null`.
- Giữ nguyên 332 ID cũ, các tham chiếu tiến độ `gplx-progress-v1` và khóa tiến độ v1; PWA shell tăng v9 để cập nhật dữ liệu.

## Đợt 1 — 20 biển cấm pending + điều tra hai ID

- [Bảng BEFORE/AFTER, nguồn theo trang và đánh giá rủi ro](./SIGN_2024_PROHIBITION_BATCH1.md): 20 ID **3, 5, 35–40, 42–53**; không tính ID 41 đã được review trước đó. Kết quả: **5 MATCH, 15 EDIT_TEXT**; thêm **2 REMAP_CODE** cho ID 54/116.
- Bằng chứng: PDF Chính phủ 403 trang, SHA-256 `b6b99d0a0aeb13fe79072831857ece15bb254d8fb7817e80e4a2739a0d2145ce`; trang PDF 80–84, 87–88, 92–93 (trùng số in). CSV có trang văn bản/hình, nhãn hình, diễn giải chứng cứ và hash ảnh từng bản ghi.
- P.105: bổ sung ngoại lệ xe ưu tiên. P.101: bổ sung trường hợp đường/cầu bị tắc và cấm người đi bộ. P.107: đúng phạm vi xe máy chuyên dùng. P.107a: thêm cách hạn chế theo số chỗ. P.111a: bỏ phạm vi xe máy sai, bổ sung xe đạp không thuộc hiệu lực.
- `NEEDS_REVIEW` còn áp dụng **thiết kế 22 ảnh**, đặc biệt ID 43 dùng “2.5t” thay “2,5 t”; lịch sử trùng nguồn 54/116 chưa rõ. Mã/biến thể của 54/116 đã xác minh, không còn treo mã chỉ vì thiếu lịch sử nguồn.
- Nguồn: `scripts/signs-2024.mjs` + `scripts/signs-2024-batch1.json`. Chạy `npm run audit:signs` để sinh dataset, offline revision, CSV và báo cáo; `npm run audit:signs -- --check` kiểm tra đồng bộ. `SIGN_2024_BATCH1_BASELINE.json` lưu BEFORE và khóa hash phạm vi không được thay đổi.
- Kiểm thử: xem [VALIDATION.md](../VALIDATION.md). Chưa merge, chưa redeploy hosting.
