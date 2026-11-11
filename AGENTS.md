# Hướng dẫn tiếp tục cho AI/agent

## Bắt đầu

Đọc README.md → PROJECT_MAP.md → DATA_MAP.md → VALIDATION.md → ROADMAP.md. Kiểm tra `git status` trước khi sửa. Người dùng muốn cập nhật tiến độ thường xuyên và duy trì sơ đồ bàn giao; cập nhật TIMELINE.md khi kết thúc một chặng.

## Quy tắc dự án

- Giữ giao diện tiếng Việt có dấu; không thay nội dung câu hỏi/đáp án để “sửa cho đúng” khi chưa có nguồn xác minh và quyết định của người dùng.
- `dist/` chứa **mã nguồn chạy trực tiếp**, không phải thư mục build có thể xóa. Không có framework, bundler hoặc dependency runtime.
- `dist/core.js` là logic thuần; `dist/app.js` là trạng thái/giao diện; `dist/sw.js` là cache. Xem PROJECT_MAP.md trước khi thêm chức năng.
- Dữ liệu nguồn được biên dịch thành `dist/data/dataset.json`. Dùng `scripts/extract-data.mjs` để tái xuất; không sửa JSON dung lượng lớn bằng tay.
- Nội dung có nguồn ngoài phải đi qua hàm escape khi đưa vào HTML; không dùng `innerHTML` với nội dung chưa escape.
- Mỗi đề có đúng một câu điểm liệt, không trùng ID và đúng phân bổ chủ đề. Câu điểm liệt chưa trả lời cũng làm bài không đạt.
- `ZINCLUDEB1` tương ứng bộ 300 câu B1 hiện có; `ZINCLUDEA34` là cột di sản và không dùng. Các tên cột nguồn không được tùy ý suy ra theo luật hiện hành.
- Không commit APK, database gốc, token, `.env`, ADB hoặc dữ liệu tiến độ thật. `.gitignore` có quy tắc tương ứng.
- Không áp giấy phép MIT hoặc giấy phép mở khác cho dữ liệu/ảnh trích từ ứng dụng khi chưa xác nhận quyền sử dụng.
- Bản Sources/hosting và GitHub có thể có các remote khác nhau; kiểm tra `git remote -v` trước khi push. Không force-push.

## Kiểm tra bắt buộc sau thay đổi liên quan

```sh
npm test
node --check dist/app.js
node --check dist/sw.js
```

Nếu sửa UI/PWA, chạy `npm start` và kiểm tra trình duyệt khi công cụ khả dụng: desktop, mobile 390px, chọn đáp án đúng/sai, đổi bộ lọc, sinh/nộp đề, tải lại tab giữa bài, tải offline rồi tắt server và mở lại. Không đánh dấu đã kiểm tra trực quan nếu chỉ đọc code hoặc chạy HTTP. Ghi kết quả thật trong VALIDATION.md.

Tăng `APP_REVISION` trong sw.js sau thay đổi shell. Không sửa dữ liệu/ảnh mà bỏ cập nhật manifest offline. Nếu thêm schema tiến độ, viết migration; không làm mất tiến độ v1.

## Khi bàn giao

Cập nhật PROJECT_MAP.md nếu di chuyển file/logic; DATA_MAP.md nếu đổi schema; ROADMAP.md nếu phát hiện giới hạn mới; TIMELINE.md theo trạng thái thật. Ghi commit, URL đã xác nhận và các bước chưa kiểm tra. Thông tin ngày tháng theo Asia/Saigon.
