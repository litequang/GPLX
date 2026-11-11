# Bản đồ dữ liệu và nguồn

## Nguồn đã lấy

- Android package: `com.vietauto.onthigiaypheplaixe.onthigplx600cau.gplxoto`.
- 5 file: `base.apk` (43.709.560 byte), `split_config.arm64_v8a.apk`, `split_config.en.apk`, `split_config.vi.apk`, `split_config.xxhdpi.apk`.
- Nội dung lấy từ `base.apk/assets/`, không cần dịch ngược mã Java để đọc SQLite này.
- Database: `assets/databases/600question.db` (1.114.112 byte).
- Ngày trích: 11/11/2026, Asia/Saigon. SHA-256 database nằm ở `dataset.source.databaseSha256`; dùng để xác nhận bản nguồn của lần xuất.
- Kho gốc có 668 asset được giải nén (gồm cả ảnh dư, icon và HTML mẹo). Web chỉ copy 645 đường dẫn ảnh được tham chiếu thực sự.
- Chưa trích tiến độ học, tài khoản hoặc dữ liệu riêng của người dùng trên điện thoại.

## Schema JSON

`dist/data/dataset.json` gồm:

| Trường | Nội dung |
| --- | --- |
| schemaVersion | `1` |
| source | package, extractedOn, databaseSha256, note |
| categories | 6 chủ đề có câu hỏi thực sự |
| licenses | 10 cấu hình hạng bằng theo DB |
| questions | 600 câu, ID gốc 1–600 |
| signs | 332 biển báo chưa bị đánh dấu xóa |
| signCategories | 5 nhóm biển báo |

### ZQUESTION → questions[]

| SQLite | JSON | Xử lý |
| --- | --- | --- |
| Z_PK | id | Giữ nguyên; khóa của tiến độ |
| ZQUESTIONCONTENT | text | Unicode NFC; riêng câu 1, 2, 600 được hiệu đính theo PDF Cục CSGT 2025 |
| ZOPTION1…4 | options[{id,text}] | Bỏ lựa chọn rỗng, giữ số đáp án gốc |
| ZANSWERS | answer | Số đáp án, **đánh số từ 1** |
| ZANSWERDESC | explanation | Giữ nội dung, xuống dòng |
| ZIMAGE | image | `assets/imageapp_600/<tên file>` hoặc null |
| ZQUESTIONTYPE | category | ID từ ZQUESTIONTYPE |
| ZQUESTIONDIE | critical | Cờ 60 câu toàn cục đúng khi nguồn là chuỗi `"1"`; khi hiển thị/ra đề mô tô, `poolFor` áp dụng danh sách 20/30 câu theo hạng |
| ZINCLUDE* | included | Object giữ hậu tố cột gốc và boolean |

ZLEARNED/ZMARKED/ZWRONG không được đưa vào nội dung web; tiến độ mới lưu trong trình duyệt. ZAWSA1 không có override không rỗng trong bản đã lấy. Không tự suy ra các override mới nếu chưa cập nhật nguồn.

### Chủ đề

| ID | Tên | Số câu |
| --- | --- | --- |
| 1 | Khái niệm và quy tắc | 180 |
| 3 | Văn hoá và đạo đức lái xe | 25 |
| 4 | Kỹ thuật lái xe | 58 |
| 5 | Cấu tạo và sửa chữa | 37 |
| 6 | Biển báo đường bộ | 185 |
| 7 | Sa hình | 115 |

ID 2 (Nghiệp vụ vận tải) không có câu trong ZQUESTION ở snapshot này, nên không hiện thẻ trống. ID 8 là nhóm tổng hợp điểm liệt, không phải giá trị category của câu; web dùng boolean critical.

### Hạng bằng

| Tên từ ZLICENSE | Pool included | Số câu trong pool | Đề | Phút | Ngưỡng đúng |
| --- | --- | --- | --- | --- | --- |
| A1 | A1 | 250 | 25 | 19 | 21 |
| A | A2 | 250 | 25 | 19 | 23 |
| B1 | B1 | 300 | 25 | 19 | 23 |
| B | B2 | 600 | 30 | 20 | 27 |
| C1 | C | 600 | 35 | 22 | 32 |
| C | C | 600 | 40 | 24 | 36 |
| D1 | DEF | 600 | 45 | 26 | 41 |
| D2 | DEF | 600 | 45 | 26 | 41 |
| D | DEF | 600 | 45 | 26 | 41 |
| E | DEF | 600 | 45 | 26 | 41 |

Mapping pool được cấu hình rõ trong script xuất; **tập 250 ID A1/A và 300 ID B1 đã đối chiếu khớp Phụ lục I/II Công văn 2262/CSGT-P5 (2025)**. Chưa đối chiếu với mã chạy của app Android nguồn; chưa xác nhận toàn bộ đáp án. Không dùng `ZINCLUDEA34` (cột di sản chứa 600 câu) cho B1. Hạng `E` là nhãn gộp trong dữ liệu, mô tả gốc gồm BE/C1E/CE/D1E/D2E/DE; web giữ nhãn nguồn.

### Sinh đề

1. Lấy pool theo hạng.
2. Chọn ngẫu nhiên đúng một câu critical trong pool.
3. Với từng dòng `ZNUMBERQUESTIONPERTYPE` của hạng, lấy số câu **không critical** đúng category.
4. Tổng phân bổ trong bảng là `số câu đề - 1`; thêm câu critical là đủ.
5. Trộn câu bằng Fisher–Yates, kiểm tra đủ số và không trùng ID. Thiếu dữ liệu thì báo lỗi, không lấp câu tùy ý.
6. Chấm đạt khi đạt ngưỡng đúng từ ZLICENSE **và** không sai/bỏ trống câu critical.

Đây là đề **luyện ngẫu nhiên** được xây từ cấu hình DB, không phải các đề cố định gốc trong ứng dụng. ZTEST/ZTESTQUEST là bảng tiến độ/phiên thi, không dùng làm bộ đề phát hành.

### Biển báo

`TABLE_NOTICE_BOARD`: ID → id; Type_ID → category; Name → name; Detail → detail; Icon → ảnh `assets/signal`; UpdateDay → sourceUpdated. Chỉ lấy `isDelete == 0`. `TABLE_NOTICE_BOARD_TYPE` cung cấp tên 5 nhóm. Có ngày cập nhật cũ trong nguồn; không diễn giải là dữ liệu đã cập nhật vào ngày trích.

## Tái xuất

Nếu đã có thư mục assets giải nén:

```sh
npm run extract -- /absolute/path/to/extracted/assets
npm test
```

Trên workspace Windows đầu tiên:

```powershell
npm run extract -- 'E:\CODE\GPLX\extracted\assets'
```

Nếu cần lấy lại APK, dùng `scripts/pull-apk.ps1` với ADB và điện thoại đã cho phép gỡ lỗi. APK là ZIP; giải nén các thư mục assets/databases, imageapp_600, signal để tái xuất. Không đưa toàn bộ APK vào thư mục deploy.

Script kiểm tra tên asset, sự tồn tại ảnh, giữ ID và ghi manifest offline. Sau thay dữ liệu, xem diff thống kê, kiểm tra ngưỡng/nhãn nguồn, tăng APP_REVISION và kiểm thử ngoại tuyến với cache cũ. Nguồn đầu vào khác schema phải được xử lý bằng adapter mới; không dùng câu SQL đoán cột rồi bỏ qua lỗi.


## Đối chiếu pháp lý 2025 — cập nhật 11/11/2026
- Nguồn: [Công văn 2262/CSGT-P5, Phụ lục I–III](https://cuccsgt.bocongan.gov.vn/upload/services/2071319603_H%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn%20s%E1%BB%AD%20d%E1%BB%A5ng%20b%E1%BB%99%20c%C3%A2u%20h%E1%BB%8Fi%20s%C3%A1t%20h%E1%BA%A1ch%20GPLX%20%28CV%202262.07.5.2025%29.pdf); [PDF bộ 600 câu Cục CSGT](https://www.csgt.vn/upload/services/273963059_B%E1%BB%99%20600%20c%C3%A2u%20h%E1%BB%8Fi%20d%C3%B9ng%20cho%20s%C3%A1t%20h%E1%BA%A1ch%20l%C3%A1i%20xe%20c%C6%A1%20gi%E1%BB%9Bi%20%C4%91%C6%B0%E1%BB%9Dng%20b%E1%BB%99.pdf).
- Tập ID hạng **A1/A: 250/250**, **B1: 300/300** khớp chính xác phụ lục. Danh sách **60/60 ID điểm liệt toàn cục** khớp Phụ lục III.
- `questions[].critical` từ SQLite vẫn giữ cờ 60 câu **toàn cục**; `poolFor(dataset, license)` tạo cờ theo hạng A1/A **20**, B1 **30**, ô tô **60**. Câu có cờ toàn cục nhưng không thuộc điểm liệt của hạng mô tô trở thành câu thường hợp lệ; không bị xóa.
- `examQuestions()` lấy câu hỏi theo hạng để chấm đúng; `validExamIds()` không khôi phục đề từ phiên cũ có cấu trúc sai. Tiến độ `gplx-progress-v1` giữ nguyên.
- Câu **1, 2, 600** hiệu đính văn bản đã kiểm tra theo PDF chính thức; đáp án, ID, category và ảnh không đổi. Script trích xuất giữ các hiệu đính để tái tạo dữ liệu nhất quán.
- **Chưa hoàn thành xác minh 600/600 câu chữ, lựa chọn, đáp án có gạch chân và hình ảnh**; xem `docs/OFFICIAL_2025_STEP1_AUDIT.md`.


## Tiến độ học cá nhân — bổ sung từ shell v7
- `STORAGE_KEY='gplx-progress-v1'` không đổi: vẫn giữ `answers`, `bookmarks`, `history`, `license`, `lastQuestion`.
- `studyPositions` tùy chọn ánh xạ `hạng|mục học|chủ đề` → ID câu cuối; ví dụ `B|learn|all`, `A1|critical|all`, `B|learn|6`. Backup cũ vẫn nhập được.
- `restoredStudyResponses()` lấy đáp án đã lưu (`selected=1..4`) vào trạng thái học khi vào màn hình, loại câu bỏ trống (`selected=0`), không dùng để tự điền đáp án trong bài thi mới.
- Bấm `Làm lại câu này` tạm ẩn phần phản hồi hiện tại, chỉ ghi đè record khi trả lời lại; F5 trước khi chọn sẽ vẫn khôi phục câu trả lời đã lưu.
- `answers` đang lưu **lần trả lời gần nhất** cho mỗi câu, không phải nhật ký không giới hạn các lần thử. `history` bài thi là tóm tắt, chưa lưu chi tiết từng đề đã nộp.


## Audit biển cấm đợt 1 — QCVN 41:2024 (11/11/2026)

- `signs[].qcvn2024` giữ `annex`, `clause`, `verification`, `imageVerification`. Thêm `audit` tùy chọn cho 22 bản ghi: `batch`, `decision` (MATCH/EDIT_TEXT/REMAP_CODE), `pdfPages` (1-based), `figurePage`, `figure`, `evidence`, `imageComparison`, `imageSha256`, `imageReview`, `imageReviewReason`.
- `text-verified` xác nhận bản tóm lược văn bản; `imageComparison` chỉ so ký hiệu/biến thể, không đồng nghĩa nghiệm thu hình. `imageReview=NEEDS_REVIEW` và `imageVerification=pending` còn giữ cho thông số thiết kế phụ lục M. 318 ảnh chưa có đối chiếu trực quan.
- `source.signAudit2024.standard` thêm `pdfSha256` và `pdfPageCount`; `source.signAudit2024.imageVisuallyCompared=22`. Tổng 340, 39 text-verified, 301 pending, 0 needs-code-review, 340 hình chưa nghiệm thu.
- ID 54 và 116 cùng asset cũ `P.127d1.png`, nay mã DP.127a theo chú thích PDF 92; không gộp, xóa hoặc đổi ID. Tên nguồn P.127d/B.27d lưu tại `docs/SIGN_2024_BATCH1_BASELINE.json`; B.27d là số mục, không phải mã biển.
- `scripts/signs-2024-batch1.json` là nguồn quyết định. `npm run audit:signs` áp lại từ dataset có sẵn và xuất đồng bộ JSON/CSV/báo cáo, không cần SQLite riêng; sau khi tái trích APK, chạy lệnh này để làm mới tài liệu audit. Dùng `-- --check` cho CI. Baseline lưu 22 BEFORE, hash toàn bộ questions/phần không đổi, danh sách 332 ID/đường dẫn/hash ảnh.
- SchemaVersion dataset và tiến độ v1 giữ nguyên vì chỉ thêm metadata tùy chọn; không sửa câu hỏi/đáp án, khóa lưu trữ hoặc migration. Offline manifest tăng revision theo byte dataset; PWA shell v9 đồng bộ URL để cập nhật dữ liệu cache.
