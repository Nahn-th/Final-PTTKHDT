# ====================  backend/lab_management/urls.py ====================
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_instructor import (
    InstructorDashboardViewSet, 
    InstructorScheduleViewSet,
    InstructorAttendanceViewSet
)
from .views_lab_assistant import (
    LabAssistantDashboardViewSet,
    LabAssistantScheduleViewSet,
    SeatAssignmentViewSet,
    ExamBanViewSet
)

# Router for ViewSets
router = DefaultRouter()

# Instructor routes
router.register(r'instructor/dashboard', InstructorDashboardViewSet, basename='instructor-dashboard')
router.register(r'instructor/schedules', InstructorScheduleViewSet, basename='instructor-schedules')
router.register(r'instructor/attendance', InstructorAttendanceViewSet, basename='instructor-attendance')

# Lab Assistant routes
router.register(r'lab-assistant/dashboard', LabAssistantDashboardViewSet, basename='lab-assistant-dashboard')
router.register(r'lab-assistant/schedules', LabAssistantScheduleViewSet, basename='lab-assistant-schedules')
router.register(r'lab-assistant/seats', SeatAssignmentViewSet, basename='seat-assignment')
router.register(r'lab-assistant/exam-ban', ExamBanViewSet, basename='exam-ban')

urlpatterns = [
    path('', include(router.urls)),
]


# ==================== backend/config/settings.py (snippet) ====================
"""
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'lab_management',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Add this
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DATETIME_FORMAT': '%d/%m/%Y %H:%M',
    'DATE_FORMAT': '%d/%m/%Y',
    'TIME_FORMAT': '%H:%M',
}

# Custom User Model
AUTH_USER_MODEL = 'lab_management.User'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
"""


# ==================== backend/config/urls.py (main) ====================
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('lab_management.urls')),
]
"""


# ==================== requirements.txt ====================
"""
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-decouple==3.8
"""


# ==================== .env.example ====================
"""
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
"""


# ==================== backend/lab_management/admin.py ====================
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, MonHoc, PhongMay, MayTinh, NhomThucHanh,
    SinhVien_NhomThucHanh, BuoiThucHanh, BoTriViTriNgoi,
    DiemDanh, CamThi
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'code', 'get_full_name', 'email', 'role']
    list_filter = ['role', 'is_staff', 'is_active']
    search_fields = ['username', 'code', 'first_name', 'last_name', 'email']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Thông tin bổ sung', {
            'fields': ('code', 'role', 'phone', 'class_name', 'specialization')
        }),
    )


@admin.register(MonHoc)
class MonHocAdmin(admin.ModelAdmin):
    list_display = ['ma_mon', 'ten_mon', 'so_tin_chi', 'hoc_ky']
    search_fields = ['ma_mon', 'ten_mon']
    list_filter = ['hoc_ky']


@admin.register(PhongMay)
class PhongMayAdmin(admin.ModelAdmin):
    list_display = ['ma_phong', 'ten_phong', 'suc_chua', 'trang_thai', 'can_bo_phu_trach']
    list_filter = ['trang_thai']
    search_fields = ['ma_phong', 'ten_phong']


@admin.register(MayTinh)
class MayTinhAdmin(admin.ModelAdmin):
    list_display = ['phong_may', 'so_may', 'vi_tri_hang', 'vi_tri_cot', 'trang_thai']
    list_filter = ['phong_may', 'trang_thai']
    search_fields = ['so_may']


@admin.register(NhomThucHanh)
class NhomThucHanhAdmin(admin.ModelAdmin):
    list_display = ['mon_hoc', 'ten_nhom', 'suc_chua', 'si_so_hien_tai', 'giang_vien']
    list_filter = ['mon_hoc', 'trang_thai']
    search_fields = ['ten_nhom']


@admin.register(SinhVien_NhomThucHanh)
class SinhVienNhomAdmin(admin.ModelAdmin):
    list_display = ['sinh_vien', 'nhom', 'ngay_dang_ky', 'trang_thai']
    list_filter = ['trang_thai', 'nhom__mon_hoc']
    search_fields = ['sinh_vien__code', 'sinh_vien__first_name', 'sinh_vien__last_name']


@admin.register(BuoiThucHanh)
class BuoiThucHanhAdmin(admin.ModelAdmin):
    list_display = ['nhom', 'so_buoi', 'ngay_thuc_hien', 'gio_bat_dau', 'phong_may', 'trang_thai']
    list_filter = ['trang_thai', 'ngay_thuc_hien', 'phong_may']
    search_fields = ['nhom__ten_nhom', 'chu_de']
    date_hierarchy = 'ngay_thuc_hien'


@admin.register(BoTriViTriNgoi)
class BoTriAdmin(admin.ModelAdmin):
    list_display = ['buoi_th', 'sinh_vien', 'may_tinh', 'ngay_phan_cong']
    list_filter = ['buoi_th__ngay_thuc_hien']
    search_fields = ['sinh_vien__code', 'may_tinh__so_may']


@admin.register(DiemDanh)
class DiemDanhAdmin(admin.ModelAdmin):
    list_display = ['buoi_th', 'sinh_vien', 'trang_thai', 'thoi_gian_diem_danh', 'nguoi_diem_danh']
    list_filter = ['trang_thai', 'buoi_th__ngay_thuc_hien']
    search_fields = ['sinh_vien__code', 'sinh_vien__first_name', 'sinh_vien__last_name']


@admin.register(CamThi)
class CamThiAdmin(admin.ModelAdmin):
    list_display = ['sinh_vien', 'mon_hoc', 'ty_le_vang', 'trang_thai', 'co_the_thi']
    list_filter = ['trang_thai', 'co_the_thi', 'mon_hoc']
    search_fields = ['sinh_vien__code', 'sinh_vien__first_name', 'sinh_vien__last_name']
"""
