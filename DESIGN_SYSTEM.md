# Quy tắc giao diện

## Định hướng

Không gian học tập yên tĩnh, rõ ràng, tập trung vào câu hỏi. Chủ đạo xanh lá trầm, nền giấy sáng và điểm nhấn xanh chanh nhạt. Minh họa đường đi trong hero được vẽ bằng SVG gốc; không dùng ảnh ngoài, quảng cáo hoặc hình trang trí chen vào câu hỏi.

## Tokens

Tokens CSS ở `:root` trong styles.css:

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| --bg | #f6f7f5 | Nền ứng dụng |
| --surface | #ffffff | Card, ô trả lời |
| --ink | #17332f | Nội dung chính |
| --muted | #6f7d78 | Nội dung phụ |
| --line | #e4e9e4 | Border |
| --green | #14634f | Hành động chính |
| --green-dark | #0b3434 | Sidebar, theme PWA |
| --lime | #ddecaa | Menu đang chọn, CTA hero |
| --red | #be4545 | Nhấn lỗi khi cần |

Font hệ thống hỗ trợ tiếng Việt: Inter nếu máy có, rồi Segoe UI/Arial/sans-serif. Không tải font mạng. Cỡ chữ câu hỏi 20px desktop, 17px mobile; đáp án 14/13px. Chữ phụ nhỏ không dùng để chứa thông tin thiết yếu duy nhất.

## Bố cục

- Desktop: sidebar cố định, header, nội dung tối đa 1560px; dashboard chủ đề + mục tiêu.
- Màn hình học: câu hỏi rộng + bộ điều hướng câu; dưới 960px chuyển thành một cột.
- Dưới 700px: dùng thanh điều hướng dưới 5 mục, mục Thêm mở dialog; header sticky có safe-area, thống kê 2 cột, biển báo 2 cột.
- Nhịp khoảng cách chính: 8/12/16/24/32px; card bo 13–18px; nút 9–10px.
- Dữ liệu thật quyết định số đếm; không tạo tỷ lệ học, lịch sử hoặc thành tích giả.

## Quy tắc tương tác

- CTA chính rõ động từ: Bắt đầu học, Câu tiếp theo, Nộp bài. Mỗi ngữ cảnh chỉ một hành động nổi bật.
- Đáp án học: chọn một lần → chỉ rõ đúng/sai bằng **chữ + biểu tượng + màu** → giải thích → nút Làm lại.
- Đáp án khi làm đề có thể thay đổi; không lộ đáp án đúng trước khi nộp.
- Đánh dấu dùng aria-pressed, không đổi mất vị trí đang học.
- Tìm kiếm có nhãn rõ; kết quả trống có hướng dẫn xử lý.
- Tải offline có trạng thái idle/downloading/ready/error và cơ chế thử lại.
- Xóa tiến độ có xác nhận trong app và hướng dẫn xuất trước.
- Thời gian luyện đề dùng deadline, không “tạm dừng ngầm” khi tab nền.

## Accessibility

- HTML có lang=vi, landmarks, headings, skip link và nhãn nút icon.
- Focus bàn phím nhìn thấy; đảm bảo tìm kiếm cũng có focus-within.
- Hỗ trợ phím 1–4 và trái/phải ở màn hình câu hỏi, không bắt khi người dùng đang nhập hoặc mở modal.
- Tôn trọng prefers-reduced-motion; ảnh có alt theo câu/biển báo.
- Cần kiểm tra thực tế trình đọc màn hình, contrast và kích thước nút trên điện thoại trước khi khẳng định đạt WCAG. Các nút lưới số câu nhỏ hơn nút trả lời chính; đây là điểm cần kiểm tra usability thêm.

## Khi phát triển tiếp

Ưu tiên dùng component và token sẵn có. Nếu chuyển framework hoặc bổ sung thư viện (ví dụ shadcn/ui), tạo kế hoạch migration và giữ nguyên schema tiến độ/data; không cài dependency chỉ để thay màu hoặc bo góc. Ghi thay đổi thiết kế có chủ đích vào đây và kiểm tra lại mobile/offline.

## Glass chrome

Header và thanh dưới dùng nền sáng 78% opacity, blur 20–22px, viền sáng và bóng nhẹ. Active tab xanh chanh, giữ chữ tối. Cả header/menu cùng ẩn khi cuộn xuống, cùng hiện khi cuộn lên; không đổi chiều cao bố cục. Giữ khoảng trống dưới nội dung và safe-area cho thiết bị có tai thỏ/home indicator. Khi reduced-motion bật, vẫn ẩn/hiện nhưng không chuyển động.
