# 🚀 Danh sách chức năng nâng cấp Chatify

Dưới đây là các ý tưởng nâng cấp trang web, được chia theo nhóm chức năng. Mỗi mục đều dựa trên kiến trúc hiện tại của dự án (Node.js + Express + Socket.IO + MongoDB ở backend, React + Vite + TypeScript + Zustand + Tailwind ở frontend) nên có thể triển khai được một cách thực tế.

---

## 1. 💬 Nhắn tin & trải nghiệm chat

- [x] **Gửi file đính kèm** (PDF, Word, ZIP...) bên cạnh ảnh — đã mở rộng `Message` model (`fileUrl`, `fileName`, `fileSize`, `fileType`), thêm endpoint upload file lên Cloudinary, cập nhật giao diện gửi/hiển thị file trong chat lẫn sidebar.
- [x] **Gửi tin nhắn thoại (voice message)** — thu âm bằng MediaRecorder API, upload lên Cloudinary rồi phát lại bằng HTML5 audio. Đã thêm endpoint `upload-audio`, mở rộng model + giao diện thu/phát/nút gửi.
- [ ] **Gọi video / thoại thời gian thực** — tích hợp WebRTC (peer-to-peer) song song với Socket.IO để trao đổi tín hiệu.
- [ ] **Thu hồi tin nhắn (unsend)** — xóa hoặc ẩn tin nhắn cho tất cả thành viên trong đoạn hội thoại.
- [ ] **Chỉnh sửa tin nhắn** — thêm cờ `isEdited` và lịch sử chỉnh sửa vào `Message`.
- [ ] **Trả lời / trích dẫn tin nhắn (reply)** — lưu `replyTo` để hiển thị bong bóng trả lời.
- [ ] **Phản ứng cảm xúc (reaction)** — thả ❤️ 👍 😂 lên từng tin nhắn, lưu mảng reactions.
- [ ] **Ghim tin nhắn (pin)** — ghim thông báo quan trọng trong nhóm.
- [ ] **Chia sẻ vị trí (location)** — sử dụng Geolocation API và hiển thị bản đồ.
- [ ] **Gửi sticker / GIF** — tích hợp GIPHY hoặc bộ sticker.
- [ ] **Đánh dấu đã gửi / đã đọc theo từng người** — hiện tại chỉ có cấp độ hội thoại, nâng cấp lên `readBy` theo từng thành viên.
- [ ] **Tin nhắn tự hủy (disappearing message)** — dùng TTL index trong MongoDB hoặc cron job xóa sau N giây.
- [ ] **Đồng bộ tin nhắn offline** — đảm bảo tin nhắn gửi khi mất kết nối sẽ được gửi lại khi online (queue + retry).
- [ ] **Đã soạn thảo (typing indicator)** — socket event `typing` / `stop-typing` hiển thị "đang nhập...".

## 2. 👥 Bạn bè & nhóm

- [ ] **Hủy kết bạn (unfriend)** — hiện mới có gửi/chấp nhận/từ chối lời mời.
- [ ] **Chặn người dùng (block)** — chặn nhắn tin và ẩn khỏi danh sách.
- [ ] **Phân quyền trong nhóm** — vai trò admin/trưởng nhóm, quyền thêm/xóa thành viên.
- [ ] **Đổi tên nhóm, ảnh đại diện nhóm** — mở rộng `group` sub-schema.
- [ ] **Rời nhóm (leave group)** và chuyển quyền trưởng nhóm.
- [ ] **Xem danh sách thành viên nhóm** và trạng thái online của từng người.
- [ ] **Tìm kiếm bạn bè theo số điện thoại / email**, không chỉ username.
- [ ] **Gợi ý kết bạn (mutual friends)** — dựa trên bạn chung.

## 3. 🔐 Xác thực & bảo mật

- [ ] **Xác minh email** — gửi link/OTP qua email khi đăng ký.
- [ ] **Quên mật khẩu / đặt lại mật khẩu** — qua email token.
- [ ] **Đăng nhập bằng Google / Facebook / GitHub (OAuth)** — dùng Passport.js.
- [ ] **Xác thực 2 lớp (2FA)** — OTP qua app autheticator (TOTP).
- [ ] **Mã hóa đầu cuối (E2E encryption)** — mã hóa nội dung tin nhắn phía client.
- [ ] **Giới hạn tốc độ (rate limiting)** — dùng `express-rate-limit` để chống brute-force.
- [ ] **Refresh token rotation & logout all devices** — thu hồi token khi cần.
- [ ] **Kiểm tra mật khẩu mạnh** — áp dụng chính sách độ phức tạp mật khẩu.
- [ ] **Ghi log hoạt động đăng nhập** — lịch sử thiết bị, IP, thời gian.

## 4. 🔔 Thông báo

- [ ] **Thông báo đẩy (Push Notification)** — dùng Web Push API (Service Worker) hoặc Firebase Cloud Messaging.
- [ ] **Thông báo trong ứng dụng** — chuông thông báo, đếm tin nhắn chưa đọc trên favicon/tab.
- [ ] **Âm thanh thông báo** khi có tin nhắn mới.
- [ ] **Thông báo qua email** khi có tin nhắn/lời mời khi người dùng offline.
- [ ] **Cài đặt tùy chỉnh thông báo** — tắt/bật âm thanh, mute từng hội thoại.

## 5. 👤 Hồ sơ & cá nhân hóa

- [ ] **Thay đổi mật khẩu, username, email, số điện thoại** trong phần cài đặt.
- [ ] **Cập nhật thông tin profile** — ngày sinh, giới tính, địa chỉ.
- [ ] **Trạng thái tùy chỉnh (custom status)** — "Đang bận", "Đang ở trường"... bên cạnh online/offline.
- [ ] **Last seen** — hiển thị thời gian online gần nhất.
- [ ] **Ảnh bìa (cover photo)** cho profile.
- [ ] **Chủ đề màu / ảnh nền chat** — tùy chỉnh giao diện chat.

## 6. 📷 Media & lưu trữ

- [ ] **Xem trước ảnh dạng gallery / lightbox**.
- [ ] **Nén ảnh trước khi upload** để giảm dung lượng (dùng `browser-image-compression`).
- [ ] **Upload nhiều ảnh cùng lúc** trong một tin nhắn.
- [ ] **Gửi video ngắn** bên cạnh ảnh.
- [ ] **Quản lý dung lượng upload** — giới hạn kích thước, định dạng cho phép.
- [ ] **Lưu trữ media trên AWS S3 / Cloudflare R2** thay thế hoặc bổ sung Cloudinary.

## 7. 🔍 Tìm kiếm & tổ chức

- [ ] **Tìm kiếm trong hội thoại** — tìm theo nội dung tin nhắn.
- [ ] **Lọc tin nhắn theo ngày / loại (ảnh, file)**.
- [ ] **Lưu trữ / archive hội thoại**.
- [ ] **Ghim hội thoại quan trọng lên đầu danh sách**.
- [ ] **Đánh dấu hội thoại là chưa đọc / đã đọc thủ công**.
- [ ] **Nhóm hội thoại theo tag / danh mục**.
- [ ] **Xóa hội thoại** (ẩn khỏi danh sách, không xóa dữ liệu thật).

## 8. ⚡ Hiệu năng & kiến trúc

- [ ] **Phân trang tin nhắn phía server hiệu quả** — dùng cursor-based pagination thay vì page number.
- [ ] **Tối ưu index MongoDB** — xem lại index trên `Message`, `Conversation`, `User`.
- [ ] **Caching bằng Redis** — cache session, danh sách hội thoại, online users.
- [ ] **Rate limit trên Socket.IO** — chống spam tin nhắn.
- [ ] **Chia nhỏ code (code-splitting) & lazy-load** ở frontend.
- [ ] **PWA (Progressive Web App)** — cài đặt lên máy, hoạt động offline một phần.
- [ ] **WebSocket reconnect & heartbeat** — cải thiện độ ổn định kết nối.
- [ ] **Dùng message queue (BullMQ/RabbitMQ)** cho các tác vụ nặng như gửi email, xử lý ảnh.
- [ ] **Horizontal scaling** — dùng Redis adapter cho Socket.IO khi chạy nhiều instance.

## 9. 🧪 Kiểm thử & chất lượng

- [ ] **Unit test backend** — dùng Jest/Mocha cho controllers, services.
- [ ] **Integration test API** — dùng Supertest.
- [ ] **Test Socket.IO** — kiểm tra các sự kiện real-time.
- [ ] **Unit/component test frontend** — dùng Vitest + React Testing Library.
- [ ] **End-to-end test** — dùng Playwright/Cypress cho luồng chính.
- [ ] **CI/CD pipeline** — GitHub Actions chạy test và deploy tự động.
- [ ] **Logging** — dùng Winston/Pino, lưu log có cấu trúc.
- [ ] **Error tracking** — tích hợp Sentry.

## 10. 📊 Phân tích & vận hành

- [ ] **Trang quản trị (admin dashboard)** — quản lý người dùng, hội thoại, báo cáo vi phạm.
- [ ] **Thống kê người dùng** — số người đăng ký, hoạt động theo ngày.
- [ ] **Phân tích hành vi** — tích hợp Google Analytics / PostHog.
- [ ] **Báo cáo vi phạm (report)** — cho phép người dùng tố cáo tin nhắn/người dùng.
- [ ] **Kiểm duyệt nội dung** — lọc từ ngữ nhạy cảm, chống spam.

## 11. 🌍 Đa nền tảng & trải nghiệm người dùng

- [ ] **Ứng dụng mobile** — dùng React Native / Flutter dùng chung backend API.
- [ ] **Ứng dụng desktop** — đóng gói bằng Electron/Tauri.
- [ ] **Đa ngôn ngữ (i18n)** — hỗ trợ tiếng Việt/Anh, dùng `react-i18next`.
- [ ] **Hỗ trợ trợ năng (accessibility)** — ARIA, điều hướng bàn phím, đọc màn hình.
- [ ] **Chế độ tiết kiệm dữ liệu** — hạn chế tải ảnh/video khi dùng mạng di động.
- [ ] **Hiệu ứng chuyển động tinh tế** — dùng Framer Motion.

---

## 📌 Gợi ý thứ tự ưu tiên triển khai

1. **Nhóm tạo giá trị nhanh, ảnh hưởng lớn tới trải nghiệm:**
   - Thu hồi/chỉnh sửa tin nhắn, phản ứng cảm xúc, typing indicator, gửi file.
   - Thông báo trong ứng dụng + âm thanh.
   - Last seen, trạng thái tùy chỉnh, cài đặt hồ sơ.

2. **Nhóm củng cố độ tin cậy & bảo mật:**
   - Rate limiting, xác minh email, quên mật khẩu, OAuth, 2FA.

3. **Nhóm nâng cao & tối ưu hệ thống:**
   - PWA, Redis cache, cursor pagination, message queue, push notification, WebRTC call.

> Có thể dùng file này như một backlog, đánh dấu `[x]` khi hoàn thành từng mục để theo dõi tiến độ nâng cấp trang web.