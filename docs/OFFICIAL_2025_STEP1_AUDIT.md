# GPLX — Báo cáo triển khai Bước 1: đối chiếu bộ 600 câu CSGT

Ngày kiểm tra: 11/11/2026. Repository: https://github.com/litequang/GPLX

## Nguồn cơ quan nhà nước
- Công văn 2262/CSGT-P5, ban hành 07/05/2025, có Phụ lục I/II/III: https://cuccsgt.bocongan.gov.vn/upload/services/2071319603_H%C6%B0%E1%BB%9Bng%20d%E1%BA%ABn%20s%E1%BB%AD%20d%E1%BB%A5ng%20b%E1%BB%99%20c%C3%A2u%20h%E1%BB%8Fi%20s%C3%A1t%20h%E1%BA%A1ch%20GPLX%20%28CV%202262.07.5.2025%29.pdf
- Bộ 600 câu hỏi dùng cho sát hạch lái xe cơ giới đường bộ do Cục CSGT xuất bản (2025): https://www.csgt.vn/upload/services/273963059_B%E1%BB%99%20600%20c%C3%A2u%20h%E1%BB%8Fi%20d%C3%B9ng%20cho%20s%C3%A1t%20h%E1%BA%A1ch%20l%C3%A1i%20xe%20c%C6%A1%20gi%E1%BB%9Bi%20%C4%91%C6%B0%E1%BB%9Dng%20b%E1%BB%99.pdf

## Hạng mục đã đối chiếu xong
| Hạng mục | Dữ liệu app | Tài liệu chính thức | Kết quả |
| --- | ---: | ---: | --- |
| Tập ID câu A1/A | 250 | 250 | 250 ID trùng tuyệt đối |
| Tập ID câu B1 | 300 | 300 | 300 ID trùng tuyệt đối |
| 60 câu điểm liệt toàn cục | 60 | 60 | 60 ID trùng tuyệt đối |
| Điểm liệt được tính cho A1/A | 43 cờ từ SQLite trong pool | 20 | Sửa runtime theo đúng 20 ID |
| Điểm liệt được tính cho B1 | 46 cờ từ SQLite trong pool | 30 | Sửa runtime theo đúng 30 ID |

- Chính sách điểm liệt theo hạng được dùng nhất quán ở màn hình học, số lượng bài cần ôn, tạo đề, chấm điểm và xem lại; dữ liệu raw `questions[].critical` không bị ghi đè.
- Bài thi tạm thời được lưu từ shell cũ, nếu không còn khớp cấu trúc hiện hành thì sẽ không khôi phục; **không xóa tiến độ đã học hoặc lịch sử bài đã nộp**.
- Câu 1, 2, 600 đã được sửa câu chữ và một số lựa chọn theo văn bản PDF. **Không thay đáp án đúng**; dữ liệu ảnh, id, category và các trường tiến độ vẫn giữ nguyên.
- Script `scripts/extract-data.mjs` tái áp các hiệu đính và sinh revision dữ liệu; service worker và các imports có cùng shell version v6.
- Các fixture so khớp ID tường minh ở `tests/official-2025.test.mjs` để ngăn hồi quy.

## Giới hạn kiểm chứng — chưa đủ căn cứ nói đã kiểm tra toàn bộ 600 đáp án
1. Mới kiểm chứng chính xác **danh sách ID**, số lượng các nhóm và ba câu có nội dung lệch PDF; chưa thực hiện so khớp tự động từng ký tự của đủ 600 câu và phương án.
2. PDF chính thức thể hiện đáp án đúng bằng **gạch chân**; bản trích text có thể không giữ định dạng đó. Cần trích nguồn đảm bảo giữ underline và kiểm tra trang/hình tương ứng trước khi thay đáp án.
3. Hình ảnh biển báo trong thư viện độc lập (332 biển, ngày nguồn 2019–2020) chưa thuộc giai đoạn này; các giải thích câu 466, 474, 475 còn trống trong APK.
4. Sát hạch theo quy chế áp dụng từ 01/03/2027 cần dữ liệu/ma trận riêng; không nâng số câu trong app và gắn nhãn chính thức khi chưa có nguồn.

## Việc tiếp theo để hoàn tất đối chiếu 600/600
- Thu bản PDF gốc dạng có thể phân tích câu theo ID, câu trả lời, underline và hình ảnh; tạo bảng so sánh `id/text/options/answer/image`.
- Gắn nhãn cho từng mục `MATCH / DIFFERENT / NEEDS_VISUAL_CHECK`, link đúng trang PDF, review và kiểm chứng đáp án có thay đổi.
- Chỉ sửa nội dung khi có bằng chứng cụ thể từ tài liệu gốc; không tự suy đoán.
