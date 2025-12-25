
## backend/lab_management/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

# ==================== USER MODEL ====================
class User(AbstractUser):
    """Extended User model"""
    ROLE_CHOICES = [
        ('student', 'Sinh viên'),
        ('instructor', 'Giảng viên'),
        ('lab_assistant', 'Cán bộ phụ trách'),
        ('admin', 'Giáo vụ'),
    ]
    
    code = models.CharField(max_length=20, unique=True, verbose_name="Mã")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)
    class_name = models.CharField(max_length=50, blank=True, null=True, verbose_name="Lớp")
    specialization = models.CharField(max_length=100, blank=True, null=True, verbose_name="Chuyên môn")
    
    class Meta:
        db_table = 'users'
        verbose_name = 'Người dùng'
        verbose_name_plural = 'Người dùng'
    
    def __str__(self):
        return f"{self.code} - {self.get_full_name()}"


# ==================== MON HOC (SUBJECT) ====================
class MonHoc(models.Model):
    """Môn học - Subject"""
    ma_mon = models.CharField(max_length=10, unique=True, verbose_name="Mã môn")
    ten_mon = models.CharField(max_length=200, verbose_name="Tên môn")
    so_tin_chi = models.IntegerField(default=4, verbose_name="Số tín chỉ")
    so_tiet_th = models.IntegerField(default=30, verbose_name="Số tiết TH")
    hoc_ky = models.CharField(max_length=20, default='HK1-2024', verbose_name="Học kỳ")
    mo_ta = models.TextField(blank=True, null=True, verbose_name="Mô tả")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'mon_hoc'
        verbose_name = 'Môn học'
        verbose_name_plural = 'Môn học'
        ordering = ['ma_mon']
    
    def __str__(self):
        return f"{self.ma_mon} - {self.ten_mon}"


# ==================== PHONG MAY (LAB) ====================
class PhongMay(models.Model):
    """Phòng máy - Computer Lab"""
    STATUS_CHOICES = [
        ('available', 'Sẵn sàng'),
        ('occupied', 'Đang sử dụng'),
        ('maintenance', 'Bảo trì'),
    ]
    
    ma_phong = models.CharField(max_length=10, unique=True, verbose_name="Mã phòng")
    ten_phong = models.CharField(max_length=100, verbose_name="Tên phòng")
    vi_tri = models.CharField(max_length=200, verbose_name="Vị trí")
    suc_chua = models.IntegerField(verbose_name="Sức chứa")
    so_hang = models.IntegerField(default=5, verbose_name="Số hàng")
    so_cot = models.IntegerField(default=8, verbose_name="Số cột")
    trang_thai = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Cán bộ phụ trách
    can_bo_phu_trach = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='phong_phu_trach',
        limit_choices_to={'role': 'lab_assistant'}
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'phong_may'
        verbose_name = 'Phòng máy'
        verbose_name_plural = 'Phòng máy'
        ordering = ['ma_phong']
    
    def __str__(self):
        return f"{self.ma_phong} - {self.ten_phong}"


# ==================== MAY TINH (COMPUTER) ====================
class MayTinh(models.Model):
    """Máy tính"""
    STATUS_CHOICES = [
        ('available', 'Sẵn sàng'),
        ('in_use', 'Đang sử dụng'),
        ('maintenance', 'Bảo trì'),
        ('broken', 'Hỏng'),
    ]
    
    phong_may = models.ForeignKey(PhongMay, on_delete=models.CASCADE, related_name='may_tinh')
    so_may = models.CharField(max_length=10, verbose_name="Số máy")
    vi_tri_hang = models.IntegerField(verbose_name="Vị trí hàng")
    vi_tri_cot = models.IntegerField(verbose_name="Vị trí cột")
    trang_thai = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Cấu hình
    cpu = models.CharField(max_length=100, blank=True, null=True)
    ram = models.CharField(max_length=50, blank=True, null=True)
    storage = models.CharField(max_length=50, blank=True, null=True)
    gpu = models.CharField(max_length=100, blank=True, null=True)
    
    ngay_bao_tri_cuoi = models.DateField(blank=True, null=True)
    ghi_chu = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'may_tinh'
        verbose_name = 'Máy tính'
        verbose_name_plural = 'Máy tính'
        unique_together = ['phong_may', 'so_may']
        ordering = ['phong_may', 'vi_tri_hang', 'vi_tri_cot']
    
    def __str__(self):
        return f"{self.phong_may.ma_phong} - {self.so_may}"


# ==================== NHOM THUC HANH (GROUP) ====================
class NhomThucHanh(models.Model):
    """Nhóm thực hành"""
    STATUS_CHOICES = [
        ('active', 'Hoạt động'),
        ('full', 'Đã đủ'),
        ('closed', 'Đã đóng'),
    ]
    
    mon_hoc = models.ForeignKey(MonHoc, on_delete=models.CASCADE, related_name='nhom_th')
    ten_nhom = models.CharField(max_length=50, verbose_name="Tên nhóm")
    suc_chua = models.IntegerField(default=40, verbose_name="Sức chứa")
    si_so_hien_tai = models.IntegerField(default=0, verbose_name="Sĩ số hiện tại")
    trang_thai = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Giảng viên hướng dẫn
    giang_vien = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='nhom_giang_day',
        limit_choices_to={'role': 'instructor'}
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'nhom_thuc_hanh'
        verbose_name = 'Nhóm thực hành'
        verbose_name_plural = 'Nhóm thực hành'
        unique_together = ['mon_hoc', 'ten_nhom']
        ordering = ['mon_hoc', 'ten_nhom']
    
    def __str__(self):
        return f"{self.mon_hoc.ma_mon} - {self.ten_nhom}"
    
    def is_full(self):
        return self.si_so_hien_tai >= self.suc_chua


# ==================== SINH VIEN - NHOM (REGISTRATION) ====================
class SinhVien_NhomThucHanh(models.Model):
    """Đăng ký nhóm thực hành"""
    sinh_vien = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='dang_ky_nhom',
        limit_choices_to={'role': 'student'}
    )
    nhom = models.ForeignKey(NhomThucHanh, on_delete=models.CASCADE, related_name='sinh_vien')
    ngay_dang_ky = models.DateTimeField(auto_now_add=True)
    trang_thai = models.CharField(
        max_length=20, 
        choices=[('active', 'Đang học'), ('dropped', 'Đã hủy')],
        default='active'
    )
    
    class Meta:
        db_table = 'sinh_vien_nhom'
        verbose_name = 'Đăng ký nhóm'
        verbose_name_plural = 'Đăng ký nhóm'
        unique_together = ['sinh_vien', 'nhom']
    
    def __str__(self):
        return f"{self.sinh_vien.code} - {self.nhom}"


# ==================== BUOI THUC HANH (SESSION) ====================
class BuoiThucHanh(models.Model):
    """Buổi thực hành"""
    STATUS_CHOICES = [
        ('upcoming', 'Sắp diễn ra'),
        ('ongoing', 'Đang diễn ra'),
        ('completed', 'Đã hoàn thành'),
        ('cancelled', 'Đã hủy'),
    ]
    
    nhom = models.ForeignKey(NhomThucHanh, on_delete=models.CASCADE, related_name='buoi_th')
    phong_may = models.ForeignKey(PhongMay, on_delete=models.CASCADE, related_name='buoi_th')
    
    so_buoi = models.IntegerField(verbose_name="Số buổi")
    ngay_thuc_hien = models.DateField(verbose_name="Ngày thực hiện")
    gio_bat_dau = models.TimeField(verbose_name="Giờ bắt đầu")
    gio_ket_thuc = models.TimeField(verbose_name="Giờ kết thúc")
    
    chu_de = models.CharField(max_length=200, verbose_name="Chủ đề")
    noi_dung = models.TextField(blank=True, null=True, verbose_name="Nội dung")
    trang_thai = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    
    # Đã bố trí vị trí ngồi chưa
    da_bo_tri_vi_tri = models.BooleanField(default=False)
    # Đã điểm danh chưa
    da_diem_danh = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'buoi_thuc_hanh'
        verbose_name = 'Buổi thực hành'
        verbose_name_plural = 'Buổi thực hành'
        unique_together = ['nhom', 'so_buoi']
        ordering = ['-ngay_thuc_hien', '-gio_bat_dau']
    
    def __str__(self):
        return f"{self.nhom} - Buổi {self.so_buoi}"
    
    @property
    def thoi_gian(self):
        return f"{self.gio_bat_dau.strftime('%H:%M')} - {self.gio_ket_thuc.strftime('%H:%M')}"


# ==================== BO TRI VI TRI NGOI (SEAT ASSIGNMENT) ====================
class BoTriViTriNgoi(models.Model):
    """Bố trí vị trí ngồi"""
    buoi_th = models.ForeignKey(BuoiThucHanh, on_delete=models.CASCADE, related_name='bo_tri_vi_tri')
    sinh_vien = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='vi_tri_ngoi',
        limit_choices_to={'role': 'student'}
    )
    may_tinh = models.ForeignKey(MayTinh, on_delete=models.CASCADE, related_name='phan_cong')
    
    ngay_phan_cong = models.DateTimeField(auto_now_add=True)
    ghi_chu = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'bo_tri_vi_tri_ngoi'
        verbose_name = 'Bố trí vị trí ngồi'
        verbose_name_plural = 'Bố trí vị trí ngồi'
        unique_together = ['buoi_th', 'sinh_vien']
    
    def __str__(self):
        return f"{self.buoi_th} - {self.sinh_vien.code} - {self.may_tinh.so_may}"


# ==================== DIEM DANH (ATTENDANCE) ====================
class DiemDanh(models.Model):
    """Điểm danh"""
    STATUS_CHOICES = [
        ('present', 'Có mặt'),
        ('absent', 'Vắng'),
        ('late', 'Muộn'),
        ('excused', 'Có phép'),
    ]
    
    buoi_th = models.ForeignKey(BuoiThucHanh, on_delete=models.CASCADE, related_name='diem_danh')
    sinh_vien = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='diem_danh',
        limit_choices_to={'role': 'student'}
    )
    
    trang_thai = models.CharField(max_length=20, choices=STATUS_CHOICES)
    thoi_gian_diem_danh = models.DateTimeField(auto_now_add=True)
    ghi_chu = models.TextField(blank=True, null=True)
    
    # Người điểm danh
    nguoi_diem_danh = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='diem_danh_thuc_hien',
        limit_choices_to={'role__in': ['instructor', 'lab_assistant']}
    )
    
    class Meta:
        db_table = 'diem_danh'
        verbose_name = 'Điểm danh'
        verbose_name_plural = 'Điểm danh'
        unique_together = ['buoi_th', 'sinh_vien']
    
    def __str__(self):
        return f"{self.buoi_th} - {self.sinh_vien.code} - {self.get_trang_thai_display()}"


# ==================== CAM THI (EXAM BAN) ====================
class CamThi(models.Model):
    """Cấm thi"""
    sinh_vien = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='cam_thi',
        limit_choices_to={'role': 'student'}
    )
    mon_hoc = models.ForeignKey(MonHoc, on_delete=models.CASCADE, related_name='cam_thi')
    nhom = models.ForeignKey(NhomThucHanh, on_delete=models.CASCADE, related_name='cam_thi')
    
    # Thống kê
    tong_so_buoi = models.IntegerField(verbose_name="Tổng số buổi")
    so_buoi_vang = models.IntegerField(verbose_name="Số buổi vắng")
    ty_le_vang = models.FloatField(verbose_name="Tỷ lệ vắng (%)")
    
    ly_do = models.TextField(verbose_name="Lý do")
    trang_thai = models.CharField(
        max_length=20,
        choices=[('warning', 'Cảnh báo'), ('banned', 'Cấm thi')],
        default='warning'
    )
    co_the_thi = models.BooleanField(default=True, verbose_name="Có thể thi")
    
    # Người cập nhật
    nguoi_cap_nhat = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='cam_thi_cap_nhat'
    )
    
    ngay_cap_nhat = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cam_thi'
        verbose_name = 'Cấm thi'
        verbose_name_plural = 'Cấm thi'
        unique_together = ['sinh_vien', 'mon_hoc', 'nhom']
    
    def __str__(self):
        return f"{self.sinh_vien.code} - {self.mon_hoc.ma_mon} - {self.get_trang_thai_display()}" 
