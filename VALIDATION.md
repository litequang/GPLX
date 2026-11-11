# Kết quả kiểm tra

Ngày thực hiện: 11/11/2026, Asia/Saigon. Cập nhật khi có bằng chứng kiểm tra mới.

## Đã chạy thành công

| Kiểm tra | Kết quả |
| --- | --- |
| `npm test` | 9 nhóm pass, 0 fail |
| Nội dung | 600 câu, đúng ID 1–600, 60 critical, 332 biển báo |
| Đáp án/ảnh | Mọi đáp án có lựa chọn tương ứng; mọi ảnh được tham chiếu tồn tại |
| Sinh đề | 100 đề × 10 hạng, tổng 1.000 đề: đúng số câu, không trùng, một critical, đúng phân bổ non-critical |
| Chấm điểm | Đủ điểm và critical đúng mới đạt; bỏ trống critical vẫn trượt dù tổng điểm cao |
| Tiến độ | Roundtrip export/import, bảo toàn câu bỏ trống cần ôn, loại input không hợp lệ |
| Tìm kiếm | Chuẩn hóa tiếng Việt và ký tự đ |
| Manifest offline | Đủ URL dataset + 645 ảnh; không trùng URL; icon PNG đúng kích thước |
| Cú pháp | `node --check dist/app.js` và `node --check dist/sw.js` thành công |
| Worker mô phỏng | Shell/navigate offline ở subpath; marker chỉ sau khi đủ ảnh; lỗi tải không ghi ready và có thể thử lại |

## Kiểm tra HTTP

Preview dùng `npm start` tại http://localhost:4173. Đã tải **657 URL qua HTTP** (gồm root và index.html), tất cả trả 200, không rỗng, MIME ảnh hợp lệ; tổng khoảng 27,3 MiB. Đây chỉ kiểm tra tài nguyên phục vụ được, không thay thế thực thi trong trình duyệt.

Lần triển khai đầu bị từ chối do `dist/index.zip` 27.804.230 byte vượt giới hạn 25 MiB mỗi file. ZIP không thuộc source Git, được giữ lại ngoài checkout trong `.tools`; không xóa hoặc thay đổi ảnh dữ liệu. `npm run check:deploy` kiểm tra lại toàn bộ output trước khi đóng gói để tránh mang theo ZIP/raw/secrets hoặc file vượt giới hạn.

## Chưa xác nhận trực tiếp

Công cụ Computer Use báo: **could not determine the current browser URL on Windows with enough confidence to enforce policy** và dừng trước khi thao tác mở preview trong Chrome. Không có kết quả kiểm thử trực quan hoặc end-to-end trình duyệt ở phiên này. Không dùng đường điều khiển trình duyệt khác để vượt chặn.

Vì vậy chưa khẳng định: layout đẹp/không tràn ở mọi viewport, service worker cài thành công trong browser thật, tải offline đầy đủ, cài PWA trên Android, keyboard/screen reader hoạt động hoàn chỉnh hoặc hosting riêng tư vẫn mở được sau khi mất mạng. Xem checklist P0 trong ROADMAP.md.

## Cách kiểm tra thủ công tiếp

1. `npm start`, mở http://localhost:4173 bằng Chrome; xem desktop và Device Toolbar 390px.
2. Học câu 1: chọn đáp án 1 để thấy sai, làm lại chọn 2 để thấy đúng; kiểm tra sidebar Câu cần ôn và tiến độ khi reload.
3. Đánh dấu câu; vào route đánh dấu; bỏ đánh dấu rồi vào lại để kiểm tra snapshot được cập nhật.
4. Đổi hạng A1 và B1; kiểm tra lần lượt pool 250/300 câu. Gõ từ khóa không dấu; đổi chủ đề.
5. Mở biển báo, tìm “cam quay dau”, xem ảnh và modal nội dung.
6. Tạo đề; chọn vài câu rồi reload tab. Deadline giữ nguyên, đáp án và vị trí còn. Nộp sớm; kiểm tra câu bỏ trống và câu critical. Bài mới dùng dữ liệu ngẫu nhiên mới.
7. Xuất tiến độ, nhập lại và đối chiếu; sao lưu trước khi kiểm tra reset.
8. Tải offline chờ đủ mục; tắt server, reload và mở ảnh/biển chưa xem. Kiểm tra báo lỗi rồi thử lại khi tải gián đoạn.
9. Kiểm tra cài PWA và cập nhật revision từ bản cũ. Nếu chạy trên origin mới, nhập lại progress đã xuất.

Không đánh dấu các mục trên đã hoàn thành cho tới khi thực hiện và ghi kết quả.
