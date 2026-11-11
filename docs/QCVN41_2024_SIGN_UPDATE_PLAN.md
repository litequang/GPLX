# Kế hoạch kiểm định và cập nhật thư viện biển báo — GPLX

Ngày lập: 11/11/2026. Phạm vi: tài liệu nghiên cứu/kế hoạch, **chưa thay nội dung 332 biển báo trong app**.

## 1. Nguồn chính, thứ tự ưu tiên

1. **Thông tư 51/2024/TT-BGTVT** ngày 15/11/2024, hiệu lực từ **01/01/2025**, thay thế Thông tư 54/2019/TT-BGTVT: [Cổng văn bản Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=211908&orggroupid=4&pageid=27160).
2. **QCVN 41:2024/BGTVT**, PDF bản gốc đi kèm thông tư (có bản vẽ hình biển): [tải PDF chính thức](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf). Nguồn định nghĩa/nội dung chính.
3. **Công báo Chính phủ**: [bản công bố chính thức](https://congbao.chinhphu.vn/van-ban/thong-tu-so-51-2024-tt-bgtvt-43387/53155.htm); dùng để đối chiếu phiên bản PDF khi cần.
4. **Cơ sở dữ liệu quy chuẩn của VSQI**: [tra cứu tình trạng hiệu lực](https://tieuchuanxaydung.vsqi.gov.vn/quychuan/view?sohieu=QCVN%C2%A041%3A2024%2FBGTVT); đã hiển thị còn hiệu lực tại thời điểm rà soát 11/11/2026.
5. Ứng dụng APK cũ **chỉ là nguồn baseline để so khác biệt**, không dùng làm thẩm quyền xác định quy tắc hiện hành. Website/blog/ảnh mạng chỉ để tham khảo, không tự động nhập vào bộ chính thức.

Không coi một thư viện hình ảnh bên thứ ba là nguồn pháp lý, và không suy đoán "quy chuẩn đã đầy đủ" chỉ từ ngày trích APK.

## 2. Hiện trạng dữ liệu GPLX

- Dữ liệu: `dist/data/dataset.json` có **332 biển báo** từ SQLite `TABLE_NOTICE_BOARD`, chia **5 nhóm**.
- Metadata `sourceUpdated` ghi **330 bản ghi 2019**, **2 bản ghi 2020**; đây là ngày trong nguồn APK, **không phải xác nhận rằng mọi biển đều theo đúng QCVN 41:2019**.
- Mỗi biển có ID SQLite, category, name, detail, image, sourceUpdated. **Chưa có mã biển chuẩn hóa và trích dẫn điều/phụ lục/trang quy chuẩn**, chưa có trạng thái kiểm chứng.
- Hình biển độc lập nằm ở `dist/assets/signal`; câu hỏi trắc nghiệm ảnh thuộc `dist/assets/imageapp_600` là nguồn khác, tuyệt đối không tự đồng nhất hai nhóm.
- Cần kiểm chứng bằng hình thực tế của bản quy chuẩn mới; **không được tuyên bố 332 biển đã sai**, cũng không được giả định có đúng 332 mã biển trong quy chuẩn.

## 3. Phạm vi tài liệu chính thức cần đọc

- **Chương 3–9**: quy tắc biển báo, biển cấm, nguy hiểm/cảnh báo, hiệu lệnh, chỉ dẫn, biển phụ, biển cao tốc.
- **Phụ lục B**: ý nghĩa/cách sử dụng biển báo cấm.
- **Phụ lục C**: biển nguy hiểm và cảnh báo.
- **Phụ lục D**: biển hiệu lệnh.
- **Phụ lục E**: biển chỉ dẫn.
- **Phụ lục F**: biển phụ.
- **Phụ lục M/P**: thông số thiết kế và thiết kế biển chỉ dẫn trên cao tốc; dùng khi kiểm chứng/redraw hình.
- **Phụ lục G**: vạch kẻ đường. Đây là nhóm kiến thức báo hiệu mở rộng, **không đếm chung tùy tiện vào 332 biển báo**.
- **Phụ lục A**: đèn tín hiệu; triển khai như mục học báo hiệu riêng nếu mở rộng phạm vi.

## 4. Quy trình triển khai

### P0 — Khóa nguồn và kiểm kê bản gốc
- [ ] Ghi SHA-256/URL/ngày truy cập của văn bản Thông tư 51/2024 và PDF QCVN 41:2024. Kiểm tra tình trạng hiệu lực trước lúc đóng gói.
- [ ] Xuất bảng kiểm kê **332 dòng** từ `dataset.signs`: source ID, name, category, image, sourceUpdated, mã trích được từ tên (ví dụ P.124a), hash hình.
- [ ] Soát tên/mã nhập sai, mã trùng nhưng hình hoặc biến thể khác, tên không mã, hình không tồn tại, mô tả rỗng; không sửa dữ liệu lúc kiểm kê.
- [ ] Giữ snapshot bất biến `legacySigns` để so sánh và rollback khi phát hiện sai khác.

### P1 — Xây danh mục chuẩn từ QCVN 41:2024
- [ ] Trích danh sách biển/các biến thể trực tiếp từ phụ lục B/C/D/E/F; đối chiếu thủ công hình/ý nghĩa với PDF nguồn (đặc biệt phần vẽ/scan), không chỉ regex OCR/text.
- [ ] Mỗi record chuẩn gồm `code`, `variant`, `category`, `name`, `meaning`, `scope/exceptions`, `source.version`, `source.annex`, `source.page`, `effectiveFrom`, `reviewStatus`.
- [ ] Chuẩn hóa mã và biến thể, phân biệt biển cùng tên nhưng mã khác, không tự gộp/loại biến thể.
- [ ] Bảng kết quả so khớp 332 bản ghi: `MATCH`, `EDIT_TEXT`, `EDIT_IMAGE`, `REMAP_CODE`, `RETIRED`, `ADD_NEW`, `NEEDS_REVIEW`. Với `ADD_NEW` ghi theo danh mục chuẩn ngoài 332.
- [ ] Với từng khác biệt, đính kèm **mã biển + trang/điều/phụ lục + trích đoạn ngắn + bản duyệt**. Không xuất bản mục thiếu căn cứ.

### P2 — Ảnh biển báo và tài nguyên
- [ ] Dùng hình/bản vẽ kỹ thuật từ **PDF quy chuẩn chính thức** làm tiêu chuẩn hình dạng, màu, tỷ lệ; chỉ tạo asset SVG/WebP chất lượng cao sau đối chiếu trực quan, có bước kiểm tra điều kiện sử dụng/tái xuất bản hình.
- [ ] Đối chiếu ảnh gốc với asset mới ở kích thước mobile, kiểm viền, số, ký hiệu, mũi tên/biến thể.
- [ ] Đặt tên asset theo mã biển có biến thể; xuất manifest và đánh SHA, chống trùng lỗi/hình bị đảo.
- [ ] Không tự thay hình trong câu hỏi 600 câu sát hạch: cần đối chiếu bộ câu hỏi Cục CSGT riêng trước khi sửa ảnh trắc nghiệm.

### P3 — Tích hợp an toàn với tiến độ đang học
- [ ] Giữ nguyên ID nguồn/mapping cho những biển đã tồn tại; nếu cần tạo stable `signKey`, có bảng đối chiếu `legacyId -> signKey`.
- [ ] Dữ liệu mới nên bổ sung metadata `sourceVersion`, `effectiveFrom`, `verifiedAt`, `reviewStatus`; giao diện hiển thị **QCVN 41:2024** và nguồn/nhóm.
- [ ] Xem biển theo nhóm, mã, tên, từ khóa không dấu; giải thích trường hợp áp dụng/ngoại lệ bằng trích dẫn nguồn.
- [ ] Version hóa dữ liệu + cập nhật manifest cache ngoại tuyến/SW, không reset `gplx-progress-v1`; hỗ trợ cache cũ nâng version.
- [ ] Tránh áp kết luận biển mới cho dữ liệu 600 câu nếu hai nguồn chưa đối chiếu.

### P4 — Tiêu chí nghiệm thu và phát hành
- [ ] **100% của 332 bản ghi cũ** có kết quả audit (không còn `NEEDS_REVIEW` trong các mục dự kiến công bố).
- [ ] **100% mã/biến thể sẽ xuất bản** có điều/phụ lục/trang QCVN, hình hợp lệ, giải thích đã đối chiếu; kiểm tra thiếu/trùng.
- [ ] Test tự động: schema, uniqueness khóa `code+variant`, tồn tại/định dạng asset, hash manifest offline, tìm kiếm theo mã/từ không dấu, không sửa đáp án trắc nghiệm, import/export progress không hỏng.
- [ ] Spot-check thủ công trên hình PDF gốc theo từng nhóm, kiểm hình trên mobile và offline thật.
- [ ] Triển khai qua branch + CI xanh + nghiệm thu dữ liệu; không sửa trực tiếp `main` bằng import mù.
- [ ] Thêm ngày cập nhật nguồn và lịch kiểm tra hiệu lực để theo dõi các thay đổi quy chuẩn sau 2024.

## 5. Sản phẩm bàn giao dự kiến

1. `docs/QCVN41_SIGN_AUDIT.md`: mỗi biển cũ ghi nhận trạng thái và bằng chứng quy chuẩn.
2. `data/sign-audit.csv`: bảng đối chiếu nguồn cũ -> mã/biến thể QCVN 41:2024.
3. `dist/data/signs-v2024.json` hoặc phiên bản hóa `dataset.json` theo schema có provenance.
4. `dist/assets/signal-2024/`: hình đã kiểm duyệt và tối ưu cho PWA.
5. CI audit/QA + kế hoạch rollback + tài liệu hướng dẫn người học.

**Điều kiện khởi động cập nhật nội dung**: hoàn thành P0/P1 ít nhất cho nhóm định cập nhật, có hình và trích dẫn theo mã biển. Kế hoạch này **không** tự xác nhận tất cả 332 biển đã được kiểm duyệt.


## Triển khai bước kiểm kê và hiệu đính 11/11/2026
Đã triển khai giai đoạn metadata và một phần P1/P3: chuẩn hóa mã và phụ lục cho 332 bản ghi cũ, 9 hiệu đính văn bản có căn cứ, bổ sung 8 mục text-only, giữ nguyên ảnh cũ và trạng thái kiểm tra. **Chưa hoàn thành P2 và nghiệm thu 100% P4.** Báo cáo tại `docs/SIGN_2024_AUDIT_README.md` và CSV kiểm kê 340 mục.


## Đợt 1 biển cấm — 11/11/2026 (chờ duyệt PR)

- Hoàn thành P0/P1 trong phạm vi **20 pending nhóm cấm** và điều tra riêng **54/116**: khóa PDF Chính phủ (403 trang, SHA-256 trong metadata), snapshot BEFORE, hash ảnh và trang nguồn từng quyết định.
- [BEFORE/AFTER, dẫn nguồn và phần chưa chắc chắn](./SIGN_2024_PROHIBITION_BATCH1.md): 5 MATCH, 15 EDIT_TEXT, 2 REMAP_CODE thành DP.127a. Trang PDF 80–84, 87–88, 92–93 trùng số in. Không đổi ID hoặc byte ảnh.
- P2 mới so ký hiệu/biến thể **22 ảnh**, chưa nghiệm thu thiết kế phụ lục M; `imageReview=NEEDS_REVIEW`. Không thay hình hoặc suy đoán hình mới. ID 43 có khác dấu thập phân; 54/116 chưa rõ lịch sử trùng dòng.
- 39 text-verified, 301 pending; 340 ảnh chưa được chứng nhận thông số thiết kế. P4 toàn thư viện **chưa hoàn thành**. Kết quả test tại VALIDATION.md; dừng ở PR, không merge/triển khai.
