# AUTO OLM — Free polished edition

## Triển khai giao diện online miễn phí (Netlify)
1. Giải nén ZIP.
2. Đưa toàn bộ thư mục vào một GitHub repository.
3. Netlify → Add new site → Import from Git.
4. Giữ cấu hình trong `netlify.toml`: Publish directory `public`, Functions `netlify/functions`.
5. Deploy. Giao diện sẽ chạy online; các chức năng API vẫn ở trạng thái chưa cấu hình cho đến khi có API OLM chính thức tương thích.

## Cấu trúc
- `public/index.html`: một trang, đúng 3 tab ngang: Hướng dẫn / Tự động làm bài / Lấy đáp án.
- `public/assets/video.mp4`: video gốc, tự phát không tiếng, lặp, không có điều khiển và không nhận thao tác chạm.
- `public/assets/css` và `public/assets/js`: tài nguyên giao diện.
- `netlify/functions`: các hàm backend hiện có.
- `netlify.toml`: định tuyến Netlify.

## Lưu ý bảo mật và API
- Không có cookie tài khoản thật trong ZIP tải lên; không tự trích xuất cookie từ trình duyệt.
- Không có API OLM chính thức/tài liệu API tương thích trong các tệp đầu vào. Không thể cam kết đăng nhập hoặc tải bài chạy được chỉ bằng đóng gói.
- `OLM_PANEL_BASE_URL` để trống mặc định. Không gửi mật khẩu/cookie đến `olm.shopntt.bond` hoặc máy chủ chưa xác minh.
- Backend hiện chỉ chấp nhận HTTPS trên `olm.vn` hoặc subdomain của `olm.vn`, nhưng endpoint `/login` và `/panel` vẫn cần được xác minh tương thích trước khi bật.
- Các endpoint tự động lấy đáp án riêng tư và tự động nộp bài bị vô hiệu hóa. Tab Lấy đáp án là khu vực ghi chú học tập, không scrape nội dung riêng tư.
- Việc xóa tên đăng nhập khỏi mã giao diện không xóa tài khoản OLM thật. Tài khoản thật chỉ có thể được quản lý qua OLM.

## Chi phí
Netlify có gói miễn phí với giới hạn sử dụng. “Miễn phí” không có nghĩa là không giới hạn và không bao gồm dịch vụ API trả phí bên ngoài.
