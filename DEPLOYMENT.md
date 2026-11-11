# Bản triển khai đã xác nhận

Ngày: 11/11/2026 (Asia/Saigon).

| Mục | Giá trị |
| --- | --- |
| URL app | https://gplx-hoc-lai-xe-quang.quartzcello4.chatgpt.site |
| Trạng thái công cụ hosting | **succeeded** |
| Quyền truy cập | Riêng tư theo tài khoản chủ sở hữu; không đổi sang công khai |
| Mã nguồn runtime đã triển khai | `a2efca0923679bb8fab1c7ec8a81f591043a1c90` |
| Repository bàn giao | https://github.com/litequang/GPLX, nhánh main |
| Project ID | `appgprj_6af3c65547cc81919fc59b0f69ea76f3` |
| Deployment ID thành công | `appgdep_6af3ce07cd8c819182701777fc8d0b25` |
| Version ID | `appgprj_6af3c65547cc81919fc59b0f69ea76f3~appgver_05529c4f01508191bd42a99c44ff49ef` |

Commit bổ sung báo cáo bàn giao này chỉ thay tài liệu; runtime tại URL dùng commit a2efca0. Các thay đổi runtime tiếp theo cần kiểm tra, đồng bộ source và triển khai phiên bản mới.

## Bằng chứng và giới hạn

- GitHub đã xác nhận main trỏ tới commit runtime trước khi ghi báo cáo này; commit tài liệu sau đó được push riêng, không force-push.
- 9 nhóm kiểm thử tự động đã qua, gồm 1.000 đề và worker mô phỏng.
- 657 URL local trả HTTP 200; 656 file deploy đều trong giới hạn, file lớn nhất 577.405 byte.
- Công cụ hosting trả `status: succeeded` kèm URL. Không dùng một lần gọi status bổ sung để lặp lại kết quả đã hoàn tất.
- Chưa kiểm thử trực quan browser/điện thoại, cài PWA hoặc offline thực tế do công cụ Computer Use đã dừng vì không xác minh URL Chrome. Xem VALIDATION.md và ROADMAP.md trước khi khẳng định đạt QA đầy đủ.

## Vấn đề triển khai đã xử lý

Lần đầu thất bại do một ZIP không được track trong Git nằm trong dist, kích thước 27.804.230 byte. File được chuyển giữ lại tại `E:\CODE\GPLX\.tools\gplx-pwa-download-preserved.zip`; ảnh gốc không bị thay đổi. Bản đóng gói mới không chứa ZIP đó và đã triển khai thành công. `npm run check:deploy` chặn lỗi tương tự trước khi đóng gói.

Không đặt file archive, APK, DB hoặc secrets trong dist dù đã bị Git ignore, vì packager có thể lấy cả file ignored trong thư mục output.
