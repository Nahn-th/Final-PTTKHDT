# HE THONG QUAN LY PHONG THUC HANH TIN HOC

Do an mon: Phan tich Thiet ke He thong / Thuc tap chuyen nganh.
Ung dung web ho tro quan ly lich thuc hanh, phong may, giang vien va sinh vien.

## 1. CONG NGHE SU DUNG

### Backend
- Ngon ngu: Python 3.13+
- Framework: Django, Django REST Framework (DRF)
- Co so du lieu: SQLite (Mac dinh)

### Frontend
- Framework: ReactJS (Vite)
- Ngon ngu: JavaScript
- HTTP Client: Fetch API / Axios

---

## 2. YEU CAU HE THONG

De chay duoc du an, may tinh can cai dat san:
1. Python (phien ban 3.10 tro len)
2. Node.js (phien ban 18 tro len) & npm
3. Git

---

## 3. HUONG DAN CAI DAT

Du an gom 2 thu muc rieng biet: "backend" va "frontend". Can mo 2 cua so Terminal de cai dat va chay song song.

### A. Cai dat Backend (Django)

Buoc 1: Di chuyen vao thu muc backend
   cd backend

Buoc 2: Tao moi truong ao (Virtual Environment)
   - Windows:
     python -m venv venv
     venv\Scripts\activate
   
   - Linux/macOS:
     python3 -m venv venv
     source venv/bin/activate

Buoc 3: Cai dat cac thu vien phu thuoc
   pip install -r requirements.txt

Buoc 4: Khoi tao Co so du lieu va Du lieu mau
   python manage.py migrate
   python manage.py seed_data

Buoc 5: Khoi chay Server
   python manage.py runserver

-> Backend se chay tai dia chi: http://127.0.0.1:8000

---

### B. Cai dat Frontend (ReactJS + Vite)

Luu y: Mo mot Terminal moi (giu nguyen Terminal backend dang chay).

Buoc 1: Di chuyen vao thu muc frontend
   cd frontend

Buoc 2: Cai dat cac goi Node modules
   npm install

Buoc 3: Cau hinh bien moi truong
   Tao file .env tai thu muc goc cua frontend (ngang hang voi package.json) va them dong sau:
   VITE_API_URL=http://127.0.0.1:8000/api

Buoc 4: Khoi chay Frontend
   npm run dev

-> Frontend se chay tai dia chi: http://localhost:5173

---

## 4. TAI KHOAN DEMO (DU LIEU MAU)

Sau khi chay lenh seed_data, he thong se co cac tai khoan mac dinh sau:

1. Quan tri vien (Admin):
   - Username: admin
   - Password: (Mat khau mac dinh trong seed_data hoac 123456)

2. Giang vien:
   - Username: gv001
   - Password: (Mat khau mac dinh)

---

## 5. MOT SO LOI THUONG GAP (TROUBLESHOOTING)

1. Loi "CORS policy" khi goi API:
   - Nguyen nhan: Backend chua cho phep Frontend truy cap.
   - Khac phuc: Kiem tra cai dat 'django-cors-headers' trong settings.py.

2. Loi "No such table":
   - Nguyen nhan: Chua tao bang trong CSDL.
   - Khac phuc: Xoa file db.sqlite3 va chay lai lenh "python manage.py migrate".

3. Loi "Vite command not found":
   - Nguyen nhan: Chua cai dat thu vien Frontend.
   - Khac phuc: Chay lai lenh "npm install".
