# Kiểm kê 340 mục biển báo GPLX — QCVN 41:2024/BGTVT

Ngày rà soát: 11/11/2026. File chi tiết: [SIGN_2024_AUDIT.csv](./SIGN_2024_AUDIT.csv).

**Phạm vi đã thực hiện (không phải chứng nhận 100% hình và mô tả):**

| Trạng thái | Số mục |
|---|---:|
| Giữ nguyên ID và hình của nguồn APK cũ | 332 |
| Hiệu đính tên/mô tả theo khoản QCVN 41:2024 | 9 |
| Mã được bổ sung theo quy chuẩn, mới có văn bản, **chưa có hình** | 8 |
| Tổng thư viện sau cập nhật | 340 |
| `text-verified` (9 hiệu đính + 8 mã mới) | 17 |
| `pending` (chưa rà nội dung từng biển) | 321 |
| `needs-code-review` (mã cũ nhập mơ hồ) | 2 (ID 54, 116) |
| Hình chưa đối chiếu trực quan | 340 |

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

Không tạo ảnh biển theo suy đoán; UI dùng placeholder có nhãn rõ ràng, có link PDF chính thức. Ảnh minh họa cũ vẫn là ảnh từ APK, **chưa được xác minh 2024**.

## Cần kiểm tra tiếp để công bố “đã đối chiếu toàn bộ”
1. Đối chiếu **321 mô tả** chưa review với điều khoản và hình trong PDF.
2. Xác định mã chính xác cho ảnh nguồn **ID 54, 116** (tên nguồn P.127d/B.27d; quy chuẩn dùng **DP.127**); tránh tự đổi sang mã mới khi chưa xác định biến thể hình.
3. Trích đúng hình từ PDF, xác nhận biến thể cho 332 biển nguồn và 8 biển mới; tối ưu SVG/WebP theo đúng đồ họa, kiểm tra việc tái xuất bản.
4. So sánh tập mã đầy đủ toàn quy chuẩn để phát hiện các biển khác còn thiếu; 340 mục **không phải toàn bộ mã theo QCVN 41:2024**.
5. Trước khi mở rộng danh mục, thêm các kiểm thử kiểm tra asset có hash và đối chiếu trang nguồn theo từng biển.

## Hậu cần kỹ thuật
- `scripts/signs-2024.mjs`: nguồn cập nhật có thể áp lại khi trích xuất APK; không sửa bài thi 600 câu.
- `dist/data/dataset.json`: tích hợp mã chuẩn hóa, provenance, phân biệt tình trạng nội dung/hình.
- `dist/data/offline.json`: cập nhật SHA-256; 8 mục chưa có ảnh không được ghi thành URL `null`.
- Giữ nguyên 332 ID cũ, các tham chiếu tiến độ `gplx-progress-v1` và PWA shell v8.
