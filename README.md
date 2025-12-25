# HỆ THỐNG QUẢN LÝ PHÒNG THỰC HÀNH TIN HỌC

Đồ án môn học: Phân tích Thiết kế Hệ thống / Thực tập chuyên ngành.
Mô tả: Ứng dụng web hỗ trợ quản lý lịch thực hành, phòng máy, giảng viên và sinh viên.

## 1. CÔNG NGHỆ SỬ DỤNG

### Backend (Phía máy chủ)
- Ngôn ngữ: Python 3.13+
- Framework: Django, Django REST Framework (DRF)
- Cơ sở dữ liệu: SQLite (Mặc định)

### Frontend (Phía giao diện)
- Framework: ReactJS (Vite)
- Ngôn ngữ: JavaScript
- HTTP Client: Fetch API / Axios

---

## 2. YÊU CẦU HỆ THỐNG

Để chạy được dự án, máy tính cần cài đặt sẵn:
1. Python (phiên bản 3.10 trở lên)
2. Node.js (phiên bản 18 trở lên) & npm
3. Git

---

## 3. HƯỚNG DẪN CÀI ĐẶT

Dự án bao gồm 2 thư mục riêng biệt: "backend" và "frontend". Cần mở 2 cửa sổ Terminal để cài đặt và chạy song song.

### A. Cài đặt Backend (Django)

Bước 1: Di chuyển vào thư mục backend
   cd backend

Bước 2: Tạo môi trường ảo (Virtual Environment)
   - Đối với Windows:
     python -m venv venv
     venv\Scripts\activate
   
   - Đối với Linux/macOS:
     python3 -m venv venv
     source venv/bin/activate

Bước 3: Cài đặt các thư viện phụ thuộc
   pip install -r requirements.txt

Bước 4: Khởi tạo Cơ sở dữ liệu và Dữ liệu mẫu
   python manage.py migrate
   python manage.py seed_data

Bước 5: Khởi chạy Server
   python manage.py runserver

-> Kết quả: Backend sẽ chạy tại địa chỉ: http://127.0.0.1:8000

---

### B. Cài đặt Frontend (ReactJS + Vite)

Lưu ý: Mở một cửa sổ Terminal mới (giữ nguyên Terminal backend đang chạy).

Bước 1: Di chuyển vào thư mục frontend
   cd frontend

Bước 2: Cài đặt các gói thư viện (Node modules)
   npm install

Bước 3: Cấu hình biến môi trường
   Tạo file .env tại thư mục gốc của frontend (ngang hàng với file package.json) và thêm dòng sau:
   VITE_API_URL=http://127.0.0.1:8000/api

Bước 4: Khởi chạy Frontend
   npm run dev

-> Kết quả: Frontend sẽ chạy tại địa chỉ: http://localhost:5173

---

## 4. TÀI KHOẢN DEMO (DỮ LIỆU MẪU)

Sau khi chạy lệnh "python manage.py seed_data", hệ thống sẽ có các tài khoản mặc định sau:

1. Quản trị viên (Admin):
   - Tên đăng nhập: admin
   - Mật khẩu: (Mật khẩu mặc định được tạo trong file seed_data, thường là admin123)
---

## 5. MỘT SỐ LỖI THƯỜNG GẶP (TROUBLESHOOTING)

1. Lỗi "CORS policy" khi gọi API:
   - Nguyên nhân: Backend chưa cho phép Frontend truy cập.
   - Khắc phục: Kiểm tra cài đặt thư viện 'django-cors-headers' và cấu hình whitelist trong settings.py.

2. Lỗi "No such table":
   - Nguyên nhân: Chưa tạo bảng trong Cơ sở dữ liệu.
   - Khắc phục: Xóa file db.sqlite3 và chạy lại lệnh "python manage.py migrate".

3. Lỗi "Vite command not found":
   - Nguyên nhân: Chưa cài đặt thư viện cho Frontend.
   - Khắc phục: Chạy lại lệnh "npm install" trong thư mục frontend.
