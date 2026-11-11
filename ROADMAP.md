# Công việc tiếp theo

## P0 — trước khi tuyên bố đã kiểm tra đầy đủ

- [ ] Kiểm tra trực quan desktop và viewport mobile 390px. Công cụ Computer Use đã từ chối thao tác Chrome vì không xác định URL đủ tin cậy; chưa có screenshot/QA trình duyệt xác nhận.
- [ ] Kiểm thử luồng thực tế: chọn đúng/sai → giải thích → đánh dấu → ôn câu sai → đổi hạng/chủ đề/tìm không dấu.
- [ ] Kiểm thử bài làm thực tế: đổi đáp án, chuyển route trong khi đồng hồ chạy, reload tab, nộp sớm và tự nộp khi hết giờ.
- [ ] Kiểm thử ngoại tuyến thực tế: tải đủ ảnh → chờ marker ready → tắt preview server/mạng → reload → mở câu có ảnh chưa xem → biển báo. Bật lại mạng và thử cập nhật cache từ phiên bản cũ.
- [ ] Kiểm thử cài PWA trên Chrome Android và hành vi hosting có đăng nhập riêng. Người dùng đã rút điện thoại sau khi lấy APK; chưa kiểm tra cài PWA trên thiết bị đó.
- [ ] Đối chiếu bộ đề/đáp án/cấu trúc hạng bằng với nguồn chính thức hiện hành nếu cần phát hành như tài liệu ôn thi cập nhật. Hiện ứng dụng ghi rõ snapshot từ app gốc.
- [ ] Nếu cần khẳng định mô phỏng chính xác ứng dụng nguồn: đối chiếu mapping pool và cách ra đề với mã/behavior của app Android; hiện dựa vào DB, không decompile Java.

## P1 — cải thiện trải nghiệm

- [ ] Lưu chi tiết các bài đã nộp để mở lại lịch sử; hiện chỉ lưu tóm tắt và giữ chi tiết bài mới nhất trong bộ nhớ.
- [ ] Thêm chọn “chỉ câu chưa học” và ôn theo lịch (spaced repetition), kèm migration schema tiến độ.
- [ ] Kiểm thử với screen reader và công cụ contrast/accessibility; không tự gắn nhãn đạt WCAG.
- [ ] Tăng vùng bấm số câu trên mobile nếu kiểm tra usability cho thấy quá nhỏ.
- [ ] Hiển thị thông báo có bản cập nhật service worker, lựa chọn tải lại vào lúc không đang làm bài.
- [ ] Cung cấp xóa riêng cache ngoại tuyến mà vẫn giữ tiến độ, cùng ước lượng dung lượng tải.
- [ ] Kiểm tra data-extraction adapter khi ứng dụng Android nâng version/schema, lưu thêm versionName/versionCode nếu có công cụ đọc manifest.

## P2 — chỉ làm khi người dùng yêu cầu

- [ ] Đồng bộ nhiều thiết bị / tài khoản / backend. Cần lựa chọn lưu trữ và chính sách dữ liệu trước khi triển khai.
- [ ] Bổ sung video mô phỏng, bài thực hành hoặc mẹo học. Không có các dữ liệu này trong dataset web hiện tại.
- [ ] Tách câu hỏi/ảnh thành bộ tải theo hạng để giảm dung lượng tải lần đầu.
- [ ] Thêm GitHub Pages hoặc domain công khai. Hiện không tự đổi repo visibility hay quyền hosting.

## Hoàn thành ở phiên bản đầu

- [x] Lấy đủ APK, trích SQLite và ảnh tham chiếu.
- [x] 600 câu, 60 critical, 332 biển báo; kiểm tra ID/đáp án/đường dẫn ảnh.
- [x] Các màn hình học, đánh dấu, ôn sai, tìm kiếm, biển báo, luyện đề.
- [x] Local progress, export/import, session restore, manifest và worker tải ngoại tuyến.
- [x] 9 nhóm kiểm thử tự động, trong đó 100 đề × 10 hạng và worker mô phỏng.
- [x] Sơ đồ kiến trúc, bảng dữ liệu, quy tắc thiết kế và hướng dẫn AI tiếp tục.


## Theo dõi kiểm định CSGT 2025 (11/11/2026)
- [x] Đối chiếu chính xác 250/300 ID trong hai phụ lục mô tô, 60 ID điểm liệt toàn cục.
- [x] Sửa 20/30/60 câu liệt theo hạng trong màn hình học, luyện đề, chấm và phục hồi session; kiểm thử hồi quy.
- [x] Hiệu đính câu 1, 2, 600 từ văn bản CSGT chính thức, giữ nguồn trong extractor.
- [ ] Đối chiếu 600/600 câu chữ, lựa chọn, đáp án có gạch chân và từng hình ảnh theo số câu trước khi khẳng định 100% chính xác.
- [ ] Kiểm chứng trên điện thoại và PWA đã được nâng cache lên v6.


## Kế hoạch 11/11/2026 — tiến độ học và biển báo
- [x] Khôi phục đáp án đã lưu, trạng thái đúng/sai, giải thích và vị trí câu theo hạng/mục học sau F5/chuyển tab.
- [x] Giữ tương thích backup `gplx-progress-v1`, bổ sung kiểm thử chuyển màn hình/reload, cache PWA shell v7.
- [ ] QA trực tiếp học → đổi tab → F5 trên trình duyệt Android/iOS và PWA.
- [ ] Cập nhật thư viện 332 biển báo theo **QCVN 41:2024/BGTVT**, bắt đầu từ kiểm kê/đối chiếu theo phụ lục B–F, theo quy trình `docs/QCVN41_2024_SIGN_UPDATE_PLAN.md`.
- [ ] Kiểm tra riêng vạch kẻ đường, tín hiệu đèn và báo hiệu trên cao tốc trước khi bổ sung thành mục học mở rộng.
