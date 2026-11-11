# Biển cấm — đợt 1: 20 pending và điều tra ID 54/116

Ngày đối chiếu: 11/11/2026 (Asia/Saigon). Baseline: `6ecb1aa47d63ede5e600b985b48cfc86d14108eb`.
Chọn đúng 20 dòng category=1 có verification=pending theo ID tăng dần; 54/116 là hai điều tra bổ sung, không tính vào 20.

## Nguồn và cách đọc bằng chứng

- [Thông tư 51/2024/TT-BGTVT](https://vanban.chinhphu.vn/?classid=1&docid=211908&orggroupid=4&pageid=27160), hiệu lực 01/01/2025.
- [PDF QCVN 41:2024/BGTVT chính thức](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf), tải ngày 11/11/2026, 403 trang, SHA-256 `b6b99d0a0aeb13fe79072831857ece15bb254d8fb7817e80e4a2739a0d2145ce`.
- [Bản sao cổng pháp luật Hải Phòng](https://pbgdpl.haiphong.gov.vn/upload/phobienphapluat/product/2025/09-2025/000175499/51-bgtvt-kem-29797.pdf) tải độc lập có cùng hash. Chỉ dùng PDF quy chuẩn làm căn cứ, không dùng ảnh mạng.
- Trang PDF đếm từ 1, **trùng số in ở chân trang** với các trang 80–93 được viện dẫn ở đợt này; không cộng trang thông tư. Đọc văn bản và xem bản render màu các trang 80–84, 87–88, 92–93, so với PNG gốc.
- Mỗi dòng CSV có trang văn bản, trang hình, nhãn hình, diễn giải chứng cứ, quan sát ảnh và SHA-256 ảnh. Diễn giải là tóm lược, không thay thế toàn văn quy chuẩn; không thêm ngoại lệ khi khoản viện dẫn không nêu.
- `text-verified` xác nhận mã/tên/phạm vi và ngoại lệ trong bản tóm lược. 22 ảnh đã so ký hiệu/biến thể, nhưng **imageVerification=pending, imageReview=NEEDS_REVIEW** vì chưa kiểm định thông số thiết kế phụ lục M. Không thay hoặc vẽ lại ảnh nào.

## BEFORE / AFTER — đúng 20 bản ghi pending

Mọi ID, category, sourceUpdated và đường dẫn/byte ảnh giữ nguyên. Bảng ghi nguyên văn tên và mô tả; MATCH chỉ bổ sung metadata/bằng chứng.

| ID / mã | BEFORE: tên và ý nghĩa | AFTER: tên và ý nghĩa | Quyết định / nguồn |
| --- | --- | --- | --- |
| 3 / P.124a | Biển số P.124a "Cấm quay đầu xe"<br>Để báo cấm các loại xe quay đầu (theo kiểu chữ U). Chiều mũi tên phù hợp với chiều cấm quay đầu xe. Biển số P.124a có hiệu lực cấm các loại xe (cơ giới và thô sơ) trừ các xe được ưu tiên theo quy định. Biển không có giá trị cấm rẽ trái để đi sang hướng đường khác. | Biển số P.124a "Cấm quay đầu xe"<br>Để báo cấm các loại xe quay đầu (theo kiểu chữ U). Chiều mũi tên phù hợp với chiều cấm quay đầu xe. Biển số P.124a có hiệu lực cấm các loại xe (cơ giới và thô sơ) trừ các xe được ưu tiên theo quy định. Biển không có giá trị cấm rẽ trái để đi sang hướng đường khác. | MATCH; B.24; [PDF 87, 88](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=87); hình B.24(a), mẫu mũi tên bên phải trang 88 |
| 5 / P.105 | Biển số P.105 "Cấm xe ôtô và xe máy"<br>Để báo đường cấm các loại xe cơ giới và xe máy đi qua. | Biển số P.105 "Cấm xe ô tô và xe máy"<br>Báo đường cấm các loại xe cơ giới và xe máy đi qua, trừ các xe được ưu tiên theo quy định. | EDIT_TEXT; B.5; [PDF 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81); hình B.5 trang 81 |
| 35 / P.101 | Biển số P.101 "Đường cấm"<br>Để báo đường cấm các loại phương tiện đi lại cả hai hướng, trừ các xe được ưu tiên theo quy định. | Biển số P.101 "Đường cấm"<br>Báo đường cấm các loại phương tiện đi lại cả hai hướng, trừ các xe được ưu tiên theo quy định. Nếu đường cấm vì đường, cầu bị tắc thì cả xe được ưu tiên cũng không được đi vào; biển đặt ở giữa phần xe chạy kèm hàng rào chắn ngang trước phần xe chạy. Nếu cấm cả người đi bộ, đặt thêm P.112 trong khu đông dân cư hoặc kéo dài hàng rào chắn ngang suốt nền đường ngoài khu đông dân cư. | EDIT_TEXT; B.1; [PDF 80](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80); hình B.1 trang 80 |
| 36 / P.102 | Biển số P.102 "Cấm đi ngược chiều"<br>Để báo đường cấm các loại xe (cơ giới và thô sơ) đi vào theo chiều đặt biển, trừ các xe được ưu tiên theo quy định. Người đi bộ được phép đi trên vỉa hè hoặc lề đường.<br> | Biển số P.102 "Cấm đi ngược chiều"<br>Để báo đường cấm các loại xe (cơ giới và thô sơ) đi vào theo chiều đặt biển, trừ các xe được ưu tiên theo quy định. Người đi bộ được phép đi trên vỉa hè hoặc lề đường.<br> | MATCH; B.2; [PDF 80](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80); hình B.2 trang 80 |
| 37 / P.103a | Biển số P.103a "Cấm xe ôtô"<br>Để báo đường cấm các loại xe cơ giới kể cả xe máy 3 bánh có thùng đi qua, trừ xe máy 2 bánh, xe gắn máy và các xe được ưu tiên theo quy định.<br> | Biển số P.103a "Cấm xe ô tô"<br>Để báo đường cấm các loại xe cơ giới kể cả xe máy 3 bánh có thùng đi qua, trừ xe máy 2 bánh, xe gắn máy và các xe được ưu tiên theo quy định.<br> | EDIT_TEXT; B.3; [PDF 80, 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80); hình B.3(a) trang 81 |
| 38 / P.103b | Biển số P.103b "Cấm xe ôtô rẽ phải" <br>"Cấm xe ôtô rẽ phải". Để báo đường cấm các loại xe cơ giới kể cả xe máy 3 bánh có thùng rẽ phải  trừ xe máy 2 bánh, xe gắn máy và các xe được ưu tiên theo quy định. | Biển số P.103b "Cấm xe ô tô rẽ phải"<br>"Cấm xe ôtô rẽ phải". Để báo đường cấm các loại xe cơ giới kể cả xe máy 3 bánh có thùng rẽ phải  trừ xe máy 2 bánh, xe gắn máy và các xe được ưu tiên theo quy định. | EDIT_TEXT; B.3; [PDF 80, 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80); hình B.3(b) trang 81 |
| 39 / P.103c | Biển số P.103c "Cấm ôtô rẽ trái" <br>"Cấm xe ôtô rẽ trái" để báo đường cấm các loại xe cơ giới kể cả xe máy 3 bánh có thùng rẽ trái, trừ xe máy 2 bánh, xe gắn máy và các xe được ưu tiên theo quy định, <br> | Biển số P.103c "Cấm xe ô tô rẽ trái"<br>"Cấm xe ôtô rẽ trái" để báo đường cấm các loại xe cơ giới kể cả xe máy 3 bánh có thùng rẽ trái, trừ xe máy 2 bánh, xe gắn máy và các xe được ưu tiên theo quy định, <br> | EDIT_TEXT; B.3; [PDF 80, 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80); hình B.3(c) trang 81 |
| 40 / P.104 | Biển số P.104 "Cấm xe máy"<br>Để báo đường cấm các loại xe máy, trừ xe máy được ưu tiên theo quy định, phải đặt biển số P.104 "Cấm xe máy". Biển không có giá trị cấm những người dắt xe máy. | Biển số P.104 "Cấm xe máy"<br>Để báo đường cấm các loại xe máy, trừ xe máy được ưu tiên theo quy định, phải đặt biển số P.104 "Cấm xe máy". Biển không có giá trị cấm những người dắt xe máy. | MATCH; B.4; [PDF 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81); hình B.4 trang 81 |
| 42 / P.106a | Biển số P.106a "Cấm xe ôtô tải" <br>Để báo đường cấm các loại xe ôtô tải trừ các xe được ưu tiên theo quy định, phải đặt biển số P.106a "Cấm xe ôtô tải". Biển có hiệu lực cấm đối với cả máy kéo và các xe máy chuyên dùng đi vào đoạn đường đặt biển số P.106a. | Biển số P.106a "Cấm xe ô tô tải"<br>Để báo đường cấm các loại xe ôtô tải trừ các xe được ưu tiên theo quy định, phải đặt biển số P.106a "Cấm xe ôtô tải". Biển có hiệu lực cấm đối với cả máy kéo và các xe máy chuyên dùng đi vào đoạn đường đặt biển số P.106a. | EDIT_TEXT; B.6; [PDF 81, 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81); hình B.6(a) trang 82 |
| 43 / P.106b | Biển số P.106 b "Cấm xe ôtô tải" <br>Để báo đường cấm các loại xe ôtô tải có khối lượng chuyên chở (theo Giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường phương tiện giao thông cơ giới đường bộ) lớn hơn một giá trị nhất định, phải đặt biển số P.106b. Biển có hiệu lực cấm các xe ô tô tải có khối lượng chuyên chở (xác định theo Giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường phương tiện giao thông cơ giới đường bộ) lớn hơn giá trị chữ số ghi trong biển (chữ số tấn ghi bằng màu trắng trên hình vẽ xe). Biển có hiệu lực cấm đối với cả máy kéo và các xe máy chuyên dùng đi vào đoạn đường đặt biển. | Biển số P.106b "Cấm xe ô tô tải"<br>Để báo đường cấm các loại xe ôtô tải có khối lượng chuyên chở (theo Giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường phương tiện giao thông cơ giới đường bộ) lớn hơn một giá trị nhất định, phải đặt biển số P.106b. Biển có hiệu lực cấm các xe ô tô tải có khối lượng chuyên chở (xác định theo Giấy chứng nhận kiểm định an toàn kỹ thuật và bảo vệ môi trường phương tiện giao thông cơ giới đường bộ) lớn hơn giá trị chữ số ghi trong biển (chữ số tấn ghi bằng màu trắng trên hình vẽ xe). Biển có hiệu lực cấm đối với cả máy kéo và các xe máy chuyên dùng đi vào đoạn đường đặt biển. | EDIT_TEXT; B.6; [PDF 81, 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81); hình B.6(b) trang 82 |
| 44 / P.106c | Biển số P.106c "Cấm xe chở hàng nguy hiểm”<br>Để báo đường cấm các xe chở hàng nguy hiểm. | Biển số P.106c "Cấm các xe chở hàng nguy hiểm"<br>Để báo đường cấm các xe chở hàng nguy hiểm. | EDIT_TEXT; B.6; [PDF 81, 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81); hình B.6(c) trang 82 |
| 45 / P.107 | Biển số P.107 "Cấm xe ôtô khách và xe ôtô tải"<br>Để báo đường cấm xe ôtô chở khách và các loại xe ôtô tải kể cả các loại máy kéo và xe máy thi công chuyên dùng đi qua trừ các xe được ưu tiên theo quy định. | Biển số P.107 "Cấm xe ô tô khách và xe ô tô tải"<br>Báo đường cấm xe ô tô chở khách và các loại xe ô tô tải, kể cả máy kéo và xe máy chuyên dùng, trừ các xe được ưu tiên theo quy định. | EDIT_TEXT; B.7; [PDF 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=82); hình B.7 trang 82 |
| 46 / P.107a | Biển số P.107a "Cấm xe ôtô khách"<br>Để báo cấm ôtô chở khách đi qua trừ các xe ưu tiên theo quy định. Biển này không cấm xe buýt. | Biển số P.107a "Cấm xe ô tô khách"<br>Báo đường cấm ô tô chở khách đi qua, trừ các xe được ưu tiên theo quy định. Biển không cấm xe buýt. Nếu cấm xe khách theo số chỗ ngồi thì dùng biển phụ ghi số chỗ đối với xe cần cấm hoặc ghi số chỗ bằng chữ trắng vào biểu tượng xe. | EDIT_TEXT; B.7a; [PDF 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=82); hình B.7a trang 82 |
| 47 / P.107b | Biển số P.107b "Cấm xe ôtô taxi"<br>Để báo cấm xe ôtô taxi đi lại. Trường hợp cấm xe ôtô taxi theo giờ thì đặt biển phụ ghi giờ cấm. | Biển số P.107b "Cấm xe ô tô taxi"<br>Để báo cấm xe ôtô taxi đi lại. Trường hợp cấm xe ôtô taxi theo giờ thì đặt biển phụ ghi giờ cấm. | EDIT_TEXT; B.7b; [PDF 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=82); hình B.7b trang 82 |
| 48 / P.108 | Biển số P.108 " Cấm xe kéo rơ-moóc"<br>Để báo cấm các loại xe cơ giới kéo theo rơ-moóc kể cả xe máy, máy kéo, ôtô khách kéo theo rơ-moóc đi lại, trừ loại ôtô sơ-mi-rơ-moóc và các xe được ưu tiên (có kéo theo rơ-moóc) theo quy định. | Biển số P.108 "Cấm xe kéo rơ-moóc"<br>Để báo cấm các loại xe cơ giới kéo theo rơ-moóc kể cả xe máy, máy kéo, ôtô khách kéo theo rơ-moóc đi lại, trừ loại ôtô sơ-mi-rơ-moóc và các xe được ưu tiên (có kéo theo rơ-moóc) theo quy định. | EDIT_TEXT; B.8; [PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83); hình B.8 trang 83 |
| 49 / P.108a | Biển số P.108a "Cấm xe sơ-mi-rơ-moóc"<br>Để báo đường cấm các loại xe sơ-mi-rơ-moóc và các xe kéo rơ- moóc trừ các xe được ưu tiên (có dạng xe sơ-mi-rơ-moóc hoặc có kéo theo rơ-moóc) theo quy định. | Biển số P.108a "Cấm xe sơ-mi rơ-moóc"<br>Để báo đường cấm các loại xe sơ-mi-rơ-moóc và các xe kéo rơ- moóc trừ các xe được ưu tiên (có dạng xe sơ-mi-rơ-moóc hoặc có kéo theo rơ-moóc) theo quy định. | EDIT_TEXT; B.8a; [PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83); hình B.8a trang 83 |
| 50 / P.109 | Biển số P.109 "Cấm máy kéo"<br>Để báo đường cấm các loại máy kéo, kể cả máy kéo bánh hơi và bánh xích đi qua. | Biển số P.109 "Cấm máy kéo"<br>Để báo đường cấm các loại máy kéo, kể cả máy kéo bánh hơi và bánh xích đi qua. | MATCH; B.9; [PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83); hình B.9 trang 83 |
| 51 / P.110a | Biển số P.110a "Cấm xe đạp" <br>Để báo đường cấm xe đạp đi qua. Biển không có giá trị cấm những người dắt xe đạp. | Biển số P.110a "Cấm xe đạp"<br>Để báo đường cấm xe đạp đi qua. Biển không có giá trị cấm những người dắt xe đạp. | EDIT_TEXT; B.10; [PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83); hình B.10(a) trang 83 |
| 52 / P.110b | Biển số P.110b "Cấm xe đạp thồ"<br>Để báo đường cấm xe đạp thồ đi qua. Biển này không cấm người dắt loại xe này. | Biển số P.110b "Cấm xe đạp thồ"<br>Để báo đường cấm xe đạp thồ đi qua. Biển này không cấm người dắt loại xe này. | MATCH; B.10; [PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83); hình B.10(b) trang 83 |
| 53 / P.111a | Biển số P.111a "Cấm xe gắn máy"<br>Để báo đường cấm xe máy và xe gắn máy đi qua. | Biển số P.111a "Cấm xe gắn máy"<br>Báo đường cấm xe gắn máy đi qua. Biển không có giá trị đối với xe đạp. | EDIT_TEXT; B.11; [PDF 84](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=84); hình B.11(a) trang 84 |

## Chứng cứ từng quyết định và đối chiếu hình

### ID 3 — P.124a

[PDF 87, 88](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=87), mục **B.24**, hình **B.24(a), mẫu mũi tên bên phải**, trang hình **88**.

B.24(a),(g),(h): cấm quay đầu chữ U với xe cơ giới và thô sơ, trừ xe ưu tiên; không cấm rẽ trái; ngoài nút giao dùng S.503d.

Ảnh [assets/signal/P.124a2.png](../dist/assets/signal/P.124a2.png): Mũi tên chữ U có nhánh đi xuống bên phải, vòng đỏ và gạch chéo, khớp mẫu thứ hai; không nhầm mẫu ID 94.

SHA-256 ảnh: `2b311be2baba4926745161bcf71784f74e3a456184cb4a66b74be5191de1e5a8`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 5 — P.105

[PDF 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81), mục **B.5**, hình **B.5**, trang hình **81**.

B.5 cấm xe cơ giới và xe máy, có ngoại lệ xe được ưu tiên; mô tả nguồn bỏ sót ngoại lệ này.

Ảnh [assets/signal/P.105.png](../dist/assets/signal/P.105.png): Ô tô phía trên, người đi xe máy phía dưới, vòng đỏ và gạch chéo.

SHA-256 ảnh: `d7c8fd6a81a56599cb2668a8eea9c2bfb1daf8bc569cd1a5a238f707577016e9`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 35 — P.101

[PDF 80](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80), mục **B.1**, hình **B.1**, trang hình **80**.

B.1(a) cho ngoại lệ xe ưu tiên; B.1(b) loại cả xe ưu tiên khi đường, cầu bị tắc; B.1(c) quy định bổ sung báo cấm người đi bộ.

Ảnh [assets/signal/P.101.png](../dist/assets/signal/P.101.png): Vòng tròn đỏ, nền trắng, không có biểu tượng hoặc gạch chéo.

SHA-256 ảnh: `8399f2b0425eeb78ee4ec521dd293c326d1d6b5b5b890398c06f67e7d760f7aa`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 36 — P.102

[PDF 80](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80), mục **B.2**, hình **B.2**, trang hình **80**.

B.2(a) cấm xe cơ giới và thô sơ vào theo chiều đặt biển, trừ xe ưu tiên; người đi bộ được đi vỉa hè hoặc lề đường.

Ảnh [assets/signal/P.102.png](../dist/assets/signal/P.102.png): Đĩa đỏ với thanh trắng nằm ngang; không có mũi tên.

SHA-256 ảnh: `1b511358954d581c8068cbd64fdb20f0e159532450bf1cd69da6d054b7558de9`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 37 — P.103a

[PDF 80, 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80), mục **B.3**, hình **B.3(a)**, trang hình **81**.

B.3(a) gồm xe cơ giới và xe máy ba bánh có thùng; trừ xe máy hai bánh, xe gắn máy, xe ưu tiên.

Ảnh [assets/signal/P.103a.png](../dist/assets/signal/P.103a.png): Ô tô nhìn chính diện trong vòng đỏ có gạch chéo.

SHA-256 ảnh: `f466051cb7cf7a4a024818360fbac1d6b2aa40551f57aa96c00062fb12b693a1`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 38 — P.103b

[PDF 80, 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80), mục **B.3**, hình **B.3(b)**, trang hình **81**.

B.3(b) cấm rẽ phải với phạm vi xe như P.103a; giữ đủ ba nhóm ngoại lệ.

Ảnh [assets/signal/P.103b.png](../dist/assets/signal/P.103b.png): Mũi tên rẽ phải phía trên ô tô, vòng đỏ và gạch chéo; đúng hướng phải.

SHA-256 ảnh: `52c40d439029053ee89cf4fd8a780b8bcec83dd6027e46fdfda1cc2f501204cc`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 39 — P.103c

[PDF 80, 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=80), mục **B.3**, hình **B.3(c)**, trang hình **81**.

B.3(b) cấm rẽ trái với phạm vi xe như P.103a; giữ đủ ba nhóm ngoại lệ.

Ảnh [assets/signal/P.103c.png](../dist/assets/signal/P.103c.png): Mũi tên rẽ trái phía trên ô tô, vòng đỏ và gạch chéo; đúng hướng trái.

SHA-256 ảnh: `75bf5b63ba6cab034555279b7b9fca835c793f276b1f1f1a9c8b99e3363b133b`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 40 — P.104

[PDF 81](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81), mục **B.4**, hình **B.4**, trang hình **81**.

B.4 cấm xe máy trừ xe ưu tiên, không cấm người dắt xe máy; nội dung nguồn phù hợp.

Ảnh [assets/signal/P.104.png](../dist/assets/signal/P.104.png): Người điều khiển xe máy trong vòng đỏ có gạch chéo; khác xe gắn máy không người ở P.111a.

SHA-256 ảnh: `b856dbb3f8d5e86d8116afbee2f8d5650a6e987c0811baf67345eb74ef15e904`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 42 — P.106a

[PDF 81, 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81), mục **B.6**, hình **B.6(a)**, trang hình **82**.

B.6(a) cấm ô tô tải trừ xe ưu tiên, áp dụng cả máy kéo và xe máy chuyên dùng.

Ảnh [assets/signal/P.106a.png](../dist/assets/signal/P.106a.png): Hình xe tải đen không ghi số khối lượng, vòng đỏ và gạch chéo.

SHA-256 ảnh: `5ef52361e501dd30148b029e7299e7db9322e841b0a07e36f45edf8d32169651`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 43 — P.106b

[PDF 81, 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81), mục **B.6**, hình **B.6(b)**, trang hình **82**.

B.6(b) dùng khối lượng chuyên chở theo giấy chứng nhận kiểm định, lớn hơn trị số ghi trên biển; không phải khối lượng toàn bộ; áp dụng cả máy kéo và xe máy chuyên dùng.

Ảnh [assets/signal/P.106b.png](../dist/assets/signal/P.106b.png): Xe tải đen ghi 2,5 t bằng chữ trắng (asset dùng dấu chấm 2.5t); khớp giá trị và vị trí, chưa xác nhận kiểu chữ/dấu thập phân theo thiết kế.

SHA-256 ảnh: `186c7a8dca603fe0c046999adefbcc43619ff1370197a0e475d9c66d4ee64eaf`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 44 — P.106c

[PDF 81, 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=81), mục **B.6**, hình **B.6(c)**, trang hình **82**.

B.6(c) cấm xe chở hàng nguy hiểm; khoản này không nêu ngoại lệ riêng, không tự thêm ngoại lệ.

Ảnh [assets/signal/P.106c.png](../dist/assets/signal/P.106c.png): Thùng hàng màu cam trên xe, vòng đỏ có gạch chéo.

SHA-256 ảnh: `ca5141eeba7fe2efd37d5b69d602ac112bbe4e08312405157ea7fb835f4505ed`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 45 — P.107

[PDF 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=82), mục **B.7**, hình **B.7**, trang hình **82**.

B.7 cấm xe khách, xe tải, máy kéo và xe máy chuyên dùng, trừ xe ưu tiên; nguồn thu hẹp xe máy chuyên dùng thành xe máy thi công chuyên dùng.

Ảnh [assets/signal/P.107.png](../dist/assets/signal/P.107.png): Xe khách phía trên xe tải trong vòng đỏ có gạch chéo.

SHA-256 ảnh: `e7e6942c6e351676d29a2637bd08403b1c5ff9b920fa8a5419a49b95988ebd54`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 46 — P.107a

[PDF 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=82), mục **B.7a**, hình **B.7a**, trang hình **82**.

B.7a(a) trừ xe ưu tiên, không cấm xe buýt; B.7a(b) cho phép quy định theo số chỗ bằng biển phụ hoặc số trắng trên biểu tượng.

Ảnh [assets/signal/P.107a.png](../dist/assets/signal/P.107a.png): Xe khách nhìn ngang, không ghi số chỗ, vòng đỏ có gạch chéo.

SHA-256 ảnh: `5205222ef52d212e879e449562ce9166373f0d80a4a1dee4a61886c50d59680e`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 47 — P.107b

[PDF 82](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=82), mục **B.7b**, hình **B.7b**, trang hình **82**.

B.7b cấm taxi; nếu cấm theo giờ dùng biển phụ ghi giờ; khoản này không nêu ngoại lệ riêng.

Ảnh [assets/signal/P.107b.png](../dist/assets/signal/P.107b.png): Ô tô nhìn trước với chữ TAXI nền vàng phía trên, vòng đỏ có gạch chéo.

SHA-256 ảnh: `158afafee82abab4911386f9149ebeb8fd7db40f140881a8cf57e759bc8418e8`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 48 — P.108

[PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83), mục **B.8**, hình **B.8**, trang hình **83**.

B.8 cấm xe cơ giới kéo rơ-moóc, trừ ô tô sơ-mi rơ-moóc và xe ưu tiên có kéo rơ-moóc; giữ đúng ngoại lệ, dùng tên ở tiêu đề B.8.

Ảnh [assets/signal/P.108.png](../dist/assets/signal/P.108.png): Hai phần xe nối nhau bằng thanh kéo, vòng đỏ có gạch chéo; phân biệt sơ-mi rơ-moóc P.108a.

SHA-256 ảnh: `9ea7a937abc26d46205565e6ac10bd924593eda16992cf09be73753afe703275`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 49 — P.108a

[PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83), mục **B.8a**, hình **B.8a**, trang hình **83**.

B.8a cấm cả sơ-mi rơ-moóc và xe kéo rơ-moóc; trừ xe ưu tiên thuộc hai dạng này.

Ảnh [assets/signal/P.108a.png](../dist/assets/signal/P.108a.png): Đầu kéo và sơ-mi rơ-moóc, vòng đỏ có gạch chéo.

SHA-256 ảnh: `b7139ddb462b31d4cc2affde21caeffcc9475063cf2cc5aee42ce16c3812930a`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 50 — P.109

[PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83), mục **B.9**, hình **B.9**, trang hình **83**.

B.9 gồm máy kéo bánh hơi và bánh xích; khoản này không nêu ngoại lệ riêng.

Ảnh [assets/signal/P.109.png](../dist/assets/signal/P.109.png): Máy kéo có bánh sau lớn, vòng đỏ có gạch chéo.

SHA-256 ảnh: `7eb79257ba89104db03b3c23bce083012a83828ec9b1ab96d03629930ef2d349`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 51 — P.110a

[PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83), mục **B.10**, hình **B.10(a)**, trang hình **83**.

B.10(a) cấm xe đạp nhưng không cấm người dắt xe đạp.

Ảnh [assets/signal/P.110a.png](../dist/assets/signal/P.110a.png): Xe đạp không có thùng chở hàng, vòng đỏ có gạch chéo.

SHA-256 ảnh: `69f12fdadb1d23bc234bd8a828fafbf2579aaf04cd4526ed864e677e1878964a`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 52 — P.110b

[PDF 83](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=83), mục **B.10**, hình **B.10(b)**, trang hình **83**.

B.10(b) cấm xe đạp thồ nhưng không cấm người dắt loại xe này.

Ảnh [assets/signal/P.110b.png](../dist/assets/signal/P.110b.png): Xe đạp có phần hàng đen phía sau, vòng đỏ có gạch chéo.

SHA-256 ảnh: `bd443332db28c921fa2c5d7b928af23fe7b1cabf488e7df38cafe61785aaa185`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 53 — P.111a

[PDF 84](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=84), mục **B.11**, hình **B.11(a)**, trang hình **84**.

B.11(a) cấm xe gắn máy và không có giá trị với xe đạp; nguồn ghi thêm xe máy là sai phạm vi.

Ảnh [assets/signal/P.111a.png](../dist/assets/signal/P.111a.png): Xe gắn máy không có người lái, vòng đỏ có gạch chéo; khác P.104.

SHA-256 ảnh: `148545f23db7367d740080f0663ddf1064e754ba93ebe7cbd2cd8795cabe74a0`. NEEDS_REVIEW: Đã so trực quan ký hiệu/biến thể với phụ lục B; chưa kiểm định kích thước, tỷ lệ, màu và thiết kế theo phụ lục M. Giữ nguyên ảnh APK.

### ID 54 — DP.127a

[PDF 92, 93](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=92), mục **B.27d**, hình **B.27d, mẫu DP.127a**, trang hình **92**.

B.27d(a),(b) quy định nhóm DP.127; chú thích trang 92 định danh mẫu này DP.127a. B.27d là số mục, không phải mã biển. Hai ID dùng cùng asset, không gộp hoặc xóa ID.

Ảnh [assets/signal/P.127d1.png](../dist/assets/signal/P.127d1.png): Ba cột 60–50–50, hai vạch phân làn đứt, nhóm xe tương ứng và vạch xóa RIÊNG từng vòng tốc độ khớp DP.127a ở trang 92. DP.127b có mũi tên dọc; DP.127c trang 93 có một vạch xóa xuyên cả bảng, không phải ảnh này.

SHA-256 ảnh: `3300c521ab3fb8d0373d67d5a3c7d21ba3b26fd640d5c530a02f5a63872f89a3`. NEEDS_REVIEW: Đã xác định biến thể bằng ảnh; chưa kiểm định thiết kế theo phụ lục M. Chưa có SQLite/APK gốc trong checkout để xác nhận lịch sử hai dòng trùng; giữ cả hai ID và ảnh.

### ID 116 — DP.127a

[PDF 92, 93](https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/51-bgtvt-kem.pdf#page=92), mục **B.27d**, hình **B.27d, mẫu DP.127a**, trang hình **92**.

B.27d(a),(b) quy định nhóm DP.127; chú thích trang 92 định danh mẫu này DP.127a. B.27d là số mục, không phải mã biển. Hai ID dùng cùng asset, không gộp hoặc xóa ID.

Ảnh [assets/signal/P.127d1.png](../dist/assets/signal/P.127d1.png): Ba cột 60–50–50, hai vạch phân làn đứt, nhóm xe tương ứng và vạch xóa RIÊNG từng vòng tốc độ khớp DP.127a ở trang 92. DP.127b có mũi tên dọc; DP.127c trang 93 có một vạch xóa xuyên cả bảng, không phải ảnh này.

SHA-256 ảnh: `3300c521ab3fb8d0373d67d5a3c7d21ba3b26fd640d5c530a02f5a63872f89a3`. NEEDS_REVIEW: Đã xác định biến thể bằng ảnh; chưa kiểm định thiết kế theo phụ lục M. Chưa có SQLite/APK gốc trong checkout để xác nhận lịch sử hai dòng trùng; giữ cả hai ID và ảnh.

## Kết quả điều tra riêng ID 54 và 116

| ID | BEFORE: mã / tên / ý nghĩa | AFTER: mã / tên / ý nghĩa | Quyết định |
| --- | --- | --- | --- |
| 54 | P.127d; Biển số P.127d "Biển hết hạn chế tốc độ tối đa cho phép theo biển ghép"<br>Đến hết đoạn đường hạn chế tốc độ tối đa cho phép. | DP.127a; Biển số DP.127a "Biển hết tốc độ tối đa cho phép theo biển ghép"<br>Báo hết hiệu lực tốc độ tối đa cho phép theo biển ghép P.127b, P.127c, tương ứng với phương án tổ chức giao thông. Từ biển này, xe được chạy theo tốc độ tối đa do pháp luật quy định; trường hợp hết tất cả các lệnh cấm dùng DP.135. | REMAP_CODE; B.27d, PDF 92–93 |
| 116 | P.127d; Biển số B.27d "Biển hết hạn chế tốc độ tối đa cho phép theo biển ghép"<br>Đến hết đoạn đường hạn chế tốc độ tối đa cho phép. | DP.127a; Biển số DP.127a "Biển hết tốc độ tối đa cho phép theo biển ghép"<br>Báo hết hiệu lực tốc độ tối đa cho phép theo biển ghép P.127b, P.127c, tương ứng với phương án tổ chức giao thông. Từ biển này, xe được chạy theo tốc độ tối đa do pháp luật quy định; trường hợp hết tất cả các lệnh cấm dùng DP.135. | REMAP_CODE; B.27d, PDF 92–93 |

Cùng đường dẫn và cùng byte ảnh chứng minh đây là hai bản ghi trùng ảnh. B.27d là số mục; P.127d là tên nguồn cũ; chú thích dưới mẫu ở PDF 92 ghi DP.127a. Mẫu DP.127c ở PDF 93 có một vạch xóa chéo toàn bảng, khác ba vạch xóa riêng của ảnh gốc. Không suy ra biến thể chỉ từ tên file. Giữ cả hai ID để không làm hỏng tham chiếu cũ. Chưa xác minh được tại sao nguồn tạo hai dòng (thiếu SQLite/APK trong checkout).

## Còn NEEDS_REVIEW và rủi ro

- Cả 22 ảnh: chưa đo màu/tỷ lệ/kích thước theo phụ lục M hoặc xác nhận quyền tái xuất bản. ID 43: PDF ghi 2,5 t; PNG ghi 2.5t, cùng trị số nhưng khác dấu thập phân/khoảng cách. Chỉ xác nhận ký hiệu và cách đọc ngưỡng khối lượng chuyên chở, chưa công nhận ảnh đúng mọi thông số.
- ID 54/116: mã và biến thể đã xác định; lịch sử trùng dòng trong nguồn chưa rõ. Không gộp hoặc xóa.
- Còn 301 nội dung pending; 17 nội dung text-verified từ đợt trước chưa được nâng cấp bằng chứng trang ở đợt này. 340 ảnh vẫn chưa được chứng nhận thiết kế; 8 mục mới chưa có ảnh.
- Rủi ro dữ liệu thấp: không đổi 600 câu/đáp án hoặc các phần dataset ngoài signs và source.signAudit2024; không sửa logic/khóa lưu tiến độ. Fixture khóa hash toàn bộ questions, phần ngoài signs, 332 ID/asset và các biển ngoài phạm vi.
- Rủi ro nội dung còn lại: bản tóm lược không bao trùm mọi quy tắc bố trí biển; người học cần đọc khoản được dẫn. Việc đối chiếu ký hiệu không phải nghiệm thu hình kỹ thuật. PWA phải tải lại bộ dữ liệu ngoại tuyến khi revision thay đổi; không xóa localStorage/sessionStorage.

## Tái tạo và kiểm tra

`npm run audit:signs` cập nhật dataset, offline revision, CSV và báo cáo này từ script nguồn. `npm run audit:signs -- --check` kiểm tra không có file sinh bị lệch. Không cần APK/SQLite để áp lại vào checkout; `npm run extract` với nguồn gốc vẫn gọi cùng hàm cập nhật.

Kết quả kiểm thử thật và giới hạn QA ở [VALIDATION.md](../VALIDATION.md). Dừng ở PR, không merge hoặc triển khai hosting.
