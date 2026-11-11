# Ôn thi GPLX — PWA

Ứng dụng ôn tập cá nhân từ dữ liệu ứng dụng Android **Ôn thi GPLX**, có 600 câu hỏi, 60 câu điểm liệt và 332 biển báo. Chạy bằng HTML/CSS/JavaScript thuần; không cần dịch vụ backend hoặc bước build.

**[Mở bản app đã triển khai](https://gplx-hoc-lai-xe-quang.quartzcello4.chatgpt.site)** — hosting riêng tư của chủ sở hữu. Trạng thái và commit runtime: [DEPLOYMENT.md](DEPLOYMENT.md).

## Chạy ngay

Yêu cầu Node.js 22.13 trở lên.

```sh
git clone https://github.com/litequang/GPLX.git
cd GPLX
npm start
```

Mở **http://localhost:4173**. Không cần `npm install` vì dự án không có dependency. Không mở `index.html` bằng `file://`: ES modules và service worker cần HTTP/HTTPS.

```sh
npm test                    # 21 nhóm kiểm thử, gồm 1.000 đề ngẫu nhiên
node --check dist/app.js
node --check dist/sw.js
npm run test:http           # Chạy trong terminal khác khi npm start đang hoạt động
npm run check:deploy        # Chặn ZIP/APK/DB và file >25 MiB trong dist
```

## Chức năng

- Tổng quan tiến độ, mục tiêu 30 câu/ngày và các chủ đề phù hợp với hạng bằng.
- Học từng câu, chọn đáp án, xem giải thích và ảnh gốc; tìm kiếm không dấu, lọc chủ đề.
- Ôn điểm liệt, câu sai gần nhất và câu đánh dấu.
- Thư viện biển báo có tìm kiếm và nội dung chi tiết.
- Sinh đề ngẫu nhiên cho 10 hạng trong dữ liệu nguồn, có đồng hồ, nộp bài, kiểm tra câu điểm liệt và xem lại đáp án.
- Bài đang làm lưu trong `sessionStorage`; tải lại tab vẫn tiếp tục với thời hạn cũ.
- Tiến độ lưu trong `localStorage`: khôi phục đáp án đúng/sai, giải thích, câu đang học theo hạng và mục học sau F5/chuyển tab; xuất/nhập JSON để sao lưu và chuyển thiết bị. Bản sao lưu v1 cũ được tự động hỗ trợ.
- Manifest PWA, biểu tượng 192/512, service worker, nút tải toàn bộ dữ liệu để học ngoại tuyến.
- CSS responsive, thanh điều hướng glass cùng ẩn/hiện với header theo chiều cuộn, điều hướng bàn phím, trạng thái đúng/sai có chữ và biểu tượng.

## Đọc tiếp theo thứ tự

1. [PROJECT_MAP.md](PROJECT_MAP.md): sơ đồ kiến trúc, thư mục, luồng hoạt động, bảng tìm nơi sửa.
2. [DATA_MAP.md](DATA_MAP.md): bảng nguồn → JSON, hạng bằng, cách sinh đề và nguồn dữ liệu.
3. [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md): màu sắc, chữ, bố cục và quy tắc UI/UX.
4. [VALIDATION.md](VALIDATION.md): bằng chứng đã kiểm tra và giới hạn kiểm tra.
5. [ROADMAP.md](ROADMAP.md): việc còn lại theo mức ưu tiên và điều kiện nghiệm thu.
6. [TIMELINE.md](TIMELINE.md): trạng thái các chặng triển khai.
7. [AGENTS.md](AGENTS.md): hướng dẫn cho AI/agent tiếp tục dự án.

## Dữ liệu và giới hạn

Dữ liệu trích ngày **11/11/2026**, package `com.vietauto.onthigiaypheplaixe.onthigplx600cau.gplxoto`. Nội dung chủ yếu giữ theo SQLite nguồn; riêng câu 1, 2 và 600 được hiệu đính theo PDF 600 câu của Cục CSGT 2025. Phạm vi câu điểm liệt theo hạng được đối chiếu với Công văn 2262/CSGT-P5. **Chưa đối chiếu đầy đủ văn bản, đáp án và hình ảnh của cả 600 câu**; không coi mọi đáp án đã được xác nhận độc lập. Đề luyện được sinh từ phân bổ trong SQLite; không khẳng định là đề thi chính thức hoặc bộ đề cố định của ứng dụng.

Đây là bản dựng mới của giao diện web. Không lấy mã giao diện, quảng cáo, tài khoản hay tiến độ cá nhân trên điện thoại. Không gán giấy phép mã nguồn mở cho nội dung và hình ảnh được trích từ bên thứ ba.

APK và SQLite gốc được giữ trong workspace máy thực hiện, bên ngoài repository; bản clone đã có đủ JSON và ảnh để chạy. Xem [DATA_MAP.md](DATA_MAP.md) để tái xuất dữ liệu.

## Ngoại tuyến và cài đặt

1. Mở ứng dụng qua HTTPS hoặc localhost.
2. Ở Tổng quan, chọn **Tải để học ngoại tuyến** và chờ thông báo hoàn tất.
3. Chọn **Cài ứng dụng** trên header. Nếu trình duyệt cho phép, cửa sổ cài PWA sẽ mở; nếu chưa hỗ trợ, ứng dụng hiện hướng dẫn (Safari iPhone/iPad: Chia sẻ → Thêm vào Màn hình chính). Nút cài ẩn khi đang chạy ở chế độ ứng dụng.

Cache lưu theo origin và trình duyệt; dữ liệu đã tải ở localhost không chuyển sang domain khác. Tiến độ cũng lưu riêng theo origin. Xóa dữ liệu trình duyệt có thể xóa cả tiến độ lẫn cache; dùng Xuất tiến độ để sao lưu. Website được bảo vệ đăng nhập có thể cần kết nối khi xác thực lại; khả năng offline đầy đủ của hosting đó cần được kiểm tra riêng.

## Triển khai

Toàn bộ thư mục **`dist/`** là đầu ra triển khai tĩnh, không cần build. Đường dẫn tương đối hỗ trợ cả `/` lẫn một thư mục con như `/GPLX/`.

Không đặt ZIP tải về hoặc APK/DB gốc trong `dist/`. Packager có thể đóng gói cả file bị Git ignore trong thư mục này; chạy `npm run check:deploy` trước khi đóng gói. Giới hạn hosting là 25 MiB **mỗi file**, không phải tổng toàn bộ ảnh. ZIP workspace từng vượt giới hạn đã được chuyển ra `.tools` ở ngoài checkout và không thay đổi ảnh gốc.

GitHub Actions kiểm thử bằng Node 22 trên mỗi push/pull request. Dự án không tự bật GitHub Pages hoặc đổi quyền truy cập repository. Hosting Sites có cấu hình trong `.openai/hosting.json`; không tạo Site mới nếu đã có `project_id`.

Khi sửa shell JS/CSS/HTML, tăng `APP_REVISION` trong `dist/sw.js` cùng query `?v=` của CSS/entry/imports trong `index.html`, `app.js` và danh sách `SHELL`, rồi chạy kiểm thử. Khi thay dữ liệu, chạy lại script xuất để cập nhật `data/offline.json`, đồng thời tăng revision shell.


## Thư viện biển báo QCVN 41:2024
- 340 mục, trong đó 332 hình từ nguồn APK cũ và 8 mục văn bản bổ sung theo QCVN 41:2024; hình cho 8 mục này **đang chờ kiểm duyệt** (không thay bằng hình suy đoán).
- Đã chỉnh 9 bản ghi có bằng chứng điều khoản; mã tra cứu và trạng thái kiểm tra được hiển thị trong chi tiết. **321 mục còn chờ review nội dung và 340 hình chưa được xác minh trực quan**.
- [Báo cáo tình trạng audit](docs/SIGN_2024_AUDIT_README.md) · [bảng CSV 340 mục](docs/SIGN_2024_AUDIT.csv).
