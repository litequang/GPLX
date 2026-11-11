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

## Bổ sung điều hướng glass/PWA — 11/11/2026

- Node v24.22.1: `npm test` **14/14 PASS** (9 nhóm cũ + 5 nhóm chrome/PWA).
- Mô phỏng xác nhận: ẩn/hiện đồng bộ, ngưỡng chống rung, overscroll, modal/focus bàn phím, focus do chạm không giữ thanh cố định, iOS fallback, standalone, prompt dùng một lần/chặn bấm lặp, dismiss/error/appinstalled. Đây không phải test trình duyệt thật.
- `node --check` cho app.js, chrome.js, sw.js: PASS. `git diff --check`: PASS.
- `npm run check:deploy`: PASS, 657 file; file lớn nhất 577.405 byte.
- HTTP preview và check-http chạy trong cùng tiến trình kiểm tra: **657 URL trả 200**. Không có bước build vì dist là source runtime.
- Đã thử Playwright Chromium: không khởi chạy được vì `socket() failed: Operation not permitted` (process singleton). Shared browser không truy cập được preview (`ERR_CONNECTION_REFUSED`). Vì vậy chưa xác nhận trực quan 390px/desktop, thao tác học/luyện đề, cuộn trên thiết bị, offline/cài PWA thật. Các mục QA thực tế vẫn mở trong ROADMAP.
- Shell tăng v2 và precache chrome.js. Không triển khai lại hosting trong thay đổi này; phạm vi là mã GitHub.

## Bản vá treo khởi động — 11/11/2026

Tái hiện bằng mô phỏng: worker cache-first trả app v1 tại URL không version trong khi HTML mới không còn #menu-button; listener cũ throw trước init. Đây là nguyên nhân tái hiện được, chưa đọc console của máy người dùng. Bản v3 version hóa JS/CSS và imports, đăng ký worker độc lập với app, hiển thị retry khi lỗi module/khởi động, timeout tải dataset và hỗ trợ MediaQueryList.addListener trên Safari cũ.

`npm test`: **18/18 PASS**. Bổ sung kiểm thử thực thi app + chrome trong DOM mô phỏng với dataset thật (render home/menu, legacy media API, lỗi init/dataset), worker với cache v1 và URL v3, precache/offline đầy đủ các import và CSS. Không coi đây là browser E2E. Cập nhật check-http để lấy danh sách SHELL thực tế và kiểm MIME JavaScript, bao gồm chrome.js/versioned URLs (lần kiểm tra trước dùng danh sách cố định nên chưa kiểm module chrome.js). Kiểm tra cú pháp app/chrome/SW, check:deploy và diff --check PASS. QA thiết bị thật vẫn chờ; hosting không tự triển khai trong bản vá GitHub này.

HTTP bản vá v3: 659 URL trả 200, bao gồm entry/import/CSS có query version và MIME JS đúng; tổng 27,8 MiB do dataset có cả URL ./data và data trong danh sách kiểm tra.

## Cài nhanh Android — shell v4

21/21 test PASS: bổ sung capture sự kiện trước khi module chạy, gọi prompt đồng bộ trong click đầu tiên, trạng thái chưa đủ điều kiện → có prompt, appinstalled trước UI. 659 URL HTTP 200; kiểm tra cú pháp app/chrome/SW, check:deploy và diff --check PASS. Đây là mô phỏng; chưa xác nhận cài thực tế trên Android. Trình duyệt quyết định khi nào phát beforeinstallprompt, website không ép phát hay tự xác nhận cài.

## Bản vá giữ trạng thái thanh điều hướng khi cuộn — shell v5

- Nguyên nhân: event `resize` gọi `show()`; Chrome Android có thể thay đổi chiều cao viewport khi thanh địa chỉ co/giãn, làm thanh header và bottom navigation tự hiện sau khi đã cuộn xuống.
- Sửa trong `dist/chrome.js`: `resize` chỉ đồng bộ mốc scroll và xóa quãng đường tích lũy, không thay đổi class `chrome-hidden`; cả hai thanh vẫn dùng cùng trạng thái; chỉ cuộn lên vượt ngưỡng 14px mới hiện lại (ngoại lệ điều hướng bàn phím, modal, về đầu trang, chuyển màn hình/breakpoint).
- Bổ sung 2 kiểm thử mô phỏng: cuộn xuống → ẩn → resize → đứng yên/tiếp tục cuộn xuống vẫn ẩn → cuộn lên mới hiện; resize không giữ lại delta ngược chiều cũ.
- Đã cập nhật version query, imports và precache lên `gplx-shell-v5` để tránh trộn phiên bản shell cũ. QA trên Android thật vẫn chưa được xác nhận riêng.


## Kiểm định Cục CSGT 2025 — bước 1 (11/11/2026)
- Đối chiếu toàn bộ ID Phụ lục I (A1/A 250 câu), Phụ lục II (B1 300 câu) và Phụ lục III (60 câu điểm liệt) theo Công văn 2262/CSGT-P5: **khớp chính xác ID**.
- Mã nguồn: phân loại 20/30/60 câu điểm liệt theo hạng, không thay cờ 60 câu toàn cục nguồn; kiểm tra hồi quy sinh 100 đề × 10 hạng, phân bổ chủ đề, chấm điểm, kiểm tra khôi phục đề.
- Hiệu đính văn bản câu 1, 2, 600 theo PDF Cục CSGT. Câu 466, 474, 475 tiếp tục thiếu giải thích nguồn.
- Cần phân biệt **đã xác minh ID** với **chưa xác minh đầy đủ 600/600 câu chữ/đáp án/ảnh**. Chưa chỉnh các đáp án vì PDF dùng định dạng gạch chân cần kiểm tra trực quan.
- Nguồn: https://cuccsgt.bocongan.gov.vn/upload/services/2071319603_H%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn%20s%E1%BB%AD%20d%E1%BB%A5ng%20b%E1%BB%99%20c%C3%A2u%20h%E1%BB%8Fi%20s%C3%A1t%20h%E1%BA%A1ch%20GPLX%20%28CV%202262.07.5.2025%29.pdf


## Khôi phục tiến độ học — PWA shell v7 (11/11/2026)
- Khắc phục việc `state.responses` bị xóa khi `go()` hoặc F5: đọc lại `progress.answers` đã lưu trong `localStorage`, giữ đúng/sai/giải thích.
- Bổ sung `studyPositions` tùy chọn theo `license|route|category` trong schema backup v1, không nâng version hay xóa dữ liệu cũ. `parseProgress` xử lý backup cũ thiếu trường này, lọc khóa/vị trí không hợp lệ.
- Tích hợp lưu vị trí khi chuyển câu, trả lời, chuyển mục học; `retry-question` chỉ mở lại UI tạm, không hủy đáp án cũ tới khi người học trả lời lại.
- Test trong `tests/study-progress.test.mjs`: trả lời sai/đúng → chuyển tab → F5 → khôi phục vị trí, xem lại giải thích, legacy backup, nhóm câu cần ôn; cộng thêm test lõi migration.
- Nút Xóa tiến độ không mang lại vị trí cũ khi reset; nhập backup không bị trộn vị trí phiên trước.
- CI Node mô phỏng không thay thế xác nhận trực tiếp Android/iPhone và trình duyệt thật.


## Audit biển báo QCVN 41:2024/BGTVT — 11/11/2026
- Giữ 332 ID cũ; thêm 8 mã dưới dạng văn bản (`image: null`); tổng 340.
- 9 hiệu đính văn bản được gắn điều khoản trong phụ lục B/D/E/F; không chỉnh ảnh chưa có bằng chứng.
- Toàn bộ bản ghi có mã chuẩn hóa, phụ lục và trạng thái `qcvn2024.verification`; hai mục nguồn mơ hồ 54 và 116 có `needs-code-review`.
- Tình trạng 17 nội dung đã đối chiếu, 321 còn chưa review, 2 cần review mã, **340 hình chưa so trực quan**. Không nhận định toàn bộ biển đã chuẩn.
- `tests/signs-2024.test.mjs`: tính tái lập từ script, 340 ID, hình cũ và offline manifest, UI 8 hình placeholder, link nguồn và import câu học không ảnh hưởng.
- CSV từng mục tại `docs/SIGN_2024_AUDIT.csv`; xem `docs/SIGN_2024_AUDIT_README.md`.


## Bỏ ghi chú nguồn ở biển báo và nút cài đặt chân trang — 11/11/2026

- Bỏ khối ghi chú chung về dữ liệu ứng dụng gốc ở màn hình biển báo; bỏ nút “Nguồn dữ liệu & cài đặt” trong footer. Nguồn QCVN/trạng thái từng biển vẫn có trong chi tiết; các chức năng tiến độ/cài đặt vẫn truy cập qua menu Thêm.
- Shell `gplx-shell-v10` đồng bộ HTML, imports và precache; không đổi dataset, ảnh hoặc khóa tiến độ. Tách khỏi PR audit #1 chưa được duyệt.
- `npm test`: **39/39 PASS**; cú pháp app/SW, `npm run check:deploy` (657 file, lớn nhất 638.492 byte), `git diff --check`: PASS.
- Chromium desktop 1440×1000 và mobile 390×844: không còn ghi chú nguồn chung trong biển báo hoặc nút cài đặt footer; modal biển P.124a hoạt động, không tràn ngang, 0 pageerror. Chỉ smoke test phạm vi thay đổi; chưa QA lại cài PWA/ngoại tuyến thiết bị thật. Chỉ cập nhật GitHub main theo yêu cầu, chưa triển khai lại hosting.
