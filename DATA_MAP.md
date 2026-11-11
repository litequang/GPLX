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
| ZQUESTIONCONTENT | text | Unicode NFC, không biên tập lại |
| ZOPTION1…4 | options[{id,text}] | Bỏ lựa chọn rỗng, giữ số đáp án gốc |
| ZANSWERS | answer | Số đáp án, **đánh số từ 1** |
| ZANSWERDESC | explanation | Giữ nội dung, xuống dòng |
| ZIMAGE | image | `assets/imageapp_600/<tên file>` hoặc null |
| ZQUESTIONTYPE | category | ID từ ZQUESTIONTYPE |
| ZQUESTIONDIE | critical | Đúng khi nguồn là chuỗi `"1"` |
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

Mapping pool được cấu hình rõ trong script xuất, dựa trên cột nguồn và số lượng bộ câu; **chưa kiểm tra đối chiếu với mã chạy của ứng dụng hoặc quy định hiện hành**. Không dùng `ZINCLUDEA34` (cột di sản chứa 600 câu) cho B1. Hạng `E` là nhãn gộp trong dữ liệu, mô tả gốc gồm BE/C1E/CE/D1E/D2E/DE; web giữ nhãn nguồn.

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
