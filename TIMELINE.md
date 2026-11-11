# Tiến độ thực hiện

Ngày thực hiện: 11/11/2026 (Asia/Saigon).

| Chặng | Trạng thái | Kết quả / điều kiện hoàn thành |
| --- | --- | --- |
| 1. Lấy ứng dụng qua USB | Hoàn thành | 5 APK lưu ở thư mục workspace `../source-apk`, không đưa APK vào Git |
| 2. Trích dữ liệu | Hoàn thành | SQLite: 600 câu, 60 điểm liệt, 332 biển báo; kiểm tra mọi ảnh được tham chiếu |
| 3. Tạo PWA | Hoàn thành mã | Responsive CSS, học, câu sai/đánh dấu, luyện đề, biển báo, lưu tiến độ, worker offline |
| 4. Kiểm thử | Tự động/HTTP đã qua; UI còn chờ | Xem VALIDATION.md: không tuyên bố đã kiểm tra browser do Computer Use dừng |
| 5. Bàn giao | Hoàn thành tài liệu | README, AGENTS.md, PROJECT_MAP.md, DATA_MAP.md, DESIGN_SYSTEM.md, VALIDATION.md, ROADMAP.md |
| 6. Đẩy GitHub | Hoàn thành | Nhánh main tại https://github.com/litequang/GPLX; bản đầu 64e6b58; xem commit mới nhất để lấy bàn giao hiện tại |
| 7. Hosting riêng tư | Hoàn thành | Công cụ trả succeeded kèm URL; xem DEPLOYMENT.md. QA trực quan vẫn nằm trong ROADMAP |

Cập nhật trạng thái sau mỗi chặng. Phần chưa hoàn thành phải ghi rõ ở ROADMAP.md; không đánh dấu hoàn thành khi chưa kiểm tra.

## 11/11/2026 — Điều hướng glass và nút cài PWA

Hoàn thành mã: thanh dưới 5 mục, menu phụ, header/menu đồng bộ cuộn, safe-area và giảm chuyển động, cài PWA với hướng dẫn dự phòng iPhone/iPad. Tăng shell v2; không đổi dữ liệu/tiến độ. 14 test PASS, kiểm tra cú pháp/deploy/HTTP PASS. QA trực quan và cài thiết bị thật còn chờ do lỗi môi trường trình duyệt (VALIDATION.md). Commit bàn giao mang tên `Add synchronized glass navigation and PWA install flow`; không phát hành lại hosting.

## 11/11/2026 — Vá lỗi “Đang mở bộ câu hỏi…”

Tái hiện lỗi trộn HTML mới và app v1 trong cache, sửa bằng shell v3 có URL version hóa và bootstrap tự báo lỗi/cập nhật worker. Bổ sung test khởi động thực thi code với dataset thật trong DOM mô phỏng, kiểm cache upgrade/offline; 18/18 PASS. Commit: `Fix startup hang caused by mixed PWA shell versions`. Cần tải lại toàn bộ dist lên hosting; giữ nguyên tiến độ người dùng.

## 11/11/2026 — Cài PWA nhanh Android

Capture beforeinstallprompt/appinstalled ngay trong head trước module bất đồng bộ. Android đủ điều kiện: Cài ngay → hộp xác nhận native, không modal trung gian; chặn bấm lặp và không tái dùng prompt đã tiêu thụ. Shell v4. 21/21 test PASS, 659 URL HTTP PASS, syntax/deploy PASS. Chưa cài trên thiết bị Android thật; chưa redeploy hosting.


## 11/11/2026 — Tinh gọn biển báo và chân trang

Bỏ ghi chú dữ liệu ứng dụng gốc khỏi màn hình biển báo và nút “Nguồn dữ liệu & cài đặt” ở footer theo yêu cầu. Shell v10; giữ dataset, ảnh và tiến độ. 39/39 test PASS, syntax/deploy PASS, Chromium desktop/mobile smoke PASS. Thay đổi giao diện đưa riêng lên main; PR audit #1 giữ riêng chờ duyệt, không phát hành hosting.
