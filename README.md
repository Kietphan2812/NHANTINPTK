# 💬 ZaloChat Web - Ứng Dụng Nhắn Tin Thời Gian Thực

Một ứng dụng web nhắn tin thời gian thực hoàn chỉnh với giao diện hiện đại phong cách **Zalo & Messenger**, hỗ trợ chat 1-1, chat nhóm cộng đồng, gửi ảnh, thả cảm xúc (reactions), trạng thái đang gõ (typing), và thông báo âm thanh.

---

## 🌟 Tính Năng Nổi Bật

1. **Nhắn tin thời gian thực (Real-time Messaging)**:
   - Sử dụng **Socket.IO** truyền tải tin nhắn tức thì, độ trễ cực thấp.
   - Hỗ trợ trò chuyện nhóm chung và chat riêng tư 1-1 giữa các thành viên.
   - Trạng thái trực tuyến (Online/Offline) cập nhật theo thời gian thực.
   - Hiển thị người đối diện đang soạn tin nhắn (*"Hà Linh đang soạn tin..."*).

2. **Tương tác đa dạng như Zalo & Messenger**:
   - **Thả cảm xúc (Reactions)**: ❤️ Yêu thích, 👍 Thích, 😂 Haha, 😮 Wow, 😢 Buồn, 🔥 Tuyệt vời.
   - **Gửi hình ảnh**: Chọn ảnh từ máy tính tải lên, xem trước ảnh thumbnail, bấm phóng to toàn màn hình (Lightbox).
   - **Trả lời tin nhắn (Reply)**: Bấm trả lời trích dẫn tin nhắn trước đó.
   - **Thu hồi tin nhắn (Recall)**: Người gửi có thể thu hồi tin nhắn bất kỳ lúc nào.
   - **Âm thanh thông báo**: Chuông ding tinh tế khi có tin nhắn mới (sử dụng Web Audio API không phụ thuộc file ngoài).
   - **Mô phỏng gọi thoại & gọi video**: Có chuông đổ và giao diện gọi điện sinh động.

3. **Giao diện & Trải nghiệm (UI/UX)**:
   - Phong cách Glassmorphism hiện đại, bóng mờ ambient glow, chuyển động mượt mà.
   - Chế độ **Sáng / Tối (Dark / Light mode)** linh hoạt.
   - Tìm kiếm bạn bè và cuộc hội thoại nhanh chóng.
   - Tối ưu hiển thị responsive trên cả máy tính lẫn điện thoại.

4. **Kiểm tra đa tài khoản tiện lợi**:
   - Cung cấp sẵn các tài khoản mẫu (*Minh Quân, Hà Linh, Tuấn Anh, Bảo Ngọc*) hoặc tự nhập tên riêng.
   - Cho phép mở **2 hoặc nhiều tab trình duyệt cùng lúc** để thử nghiệm nhắn tin qua lại trực tiếp ngay lập tức!

---

## 🚀 Hướng Dẫn Khởi Động & Trải Nghiệm

### 1. Khởi động máy chủ (Server)
Mở cửa sổ dòng lệnh tại thư mục dự án và chạy:
```bash
npm start
```
*(Hoặc `node server.js`)*

### 2. Mở trình duyệt để chat
Mở trình duyệt web của bạn và truy cập:
👉 **[http://localhost:3000](http://localhost:3000)**

### 💡 Mẹo thử nghiệm chat giữa 2 người:
- **Tab 1**: Mở `http://localhost:3000`, chọn tài khoản **"Minh Quân"**.
- **Tab 2**: Mở thêm một tab mới (hoặc tab ẩn danh), vào `http://localhost:3000`, chọn tài khoản **"Hà Linh"**.
- Giờ bạn có thể đặt 2 cửa sổ cạnh nhau và nhắn tin, gửi ảnh, thả cảm xúc qua lại trong thời gian thực!
