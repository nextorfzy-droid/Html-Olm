# AUTO OLM — merged edition

Bản hợp nhất: backend Netlify Functions từ File 1, giao diện index tinh tế từ bản HTML được cung cấp,
CSS/JS và video.mp4 từ File 2. Các route API hiện có được giữ lại.

## Deploy miễn phí
1. Giải nén ZIP.
2. Tạo repository GitHub và upload toàn bộ thư mục.
3. Trên Netlify, Add new site > Import from GitHub.
4. Build command để trống; Publish directory: `public`; Functions directory: `netlify/functions`.
   (netlify.toml đã cấu hình.)
5. Cấu hình biến môi trường theo `.env.example` và README/backend trước khi sử dụng.

Netlify có gói miễn phí với giới hạn; miễn phí không đồng nghĩa không giới hạn. API OLM bên ngoài
có thể cần quyền truy cập, cấu hình URL hoặc thay đổi giao thức. Không đưa mật khẩu/secret vào HTML.

## Nội dung
- `public/index.html`: giao diện trang chính và form đăng nhập.
- `public/assets/css/style.css`, `public/assets/js/*`: giao diện và module.
- `public/assets/video.mp4`: video từ File 2.
- `netlify/functions/*`: API/backend từ File 1.
- `netlify.toml`: routes Netlify.


Dashmenu cập nhật: `public/dashboard.html` theo phong cách OLM.VN, khung video, danh sách bài qua API khi tương thích và công cụ ghi chú. Các endpoint tự động lấy đáp án/nộp bài đã tắt. Cookie phiên chỉ được xử lý ở backend HttpOnly.
