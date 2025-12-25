# backend/lab_management/serializers.py
from rest_framework import serializers
from .models import (
    User, MonHoc, PhongMay, MayTinh, NhomThucHanh, 
    SinhVien_NhomThucHanh, BuoiThucHanh, BoTriViTriNgoi, 
    DiemDanh, CamThi
)

# ==================== USER SERIALIZERS ====================
class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user info"""
    class Meta:
        model = User
        fields = ['id', 'code', 'username', 'first_name', 'last_name', 'email', 'role']

class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed user info"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'code', 'username', 'first_name', 'last_name', 'full_name',
                  'email', 'phone', 'role', 'class_name', 'specialization']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


# ==================== MON HOC SERIALIZERS ====================
class MonHocSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonHoc
        fields = '__all__'


# ==================== PHONG MAY SERIALIZERS ====================
class MayTinhSerializer(serializers.ModelSerializer):
    class Meta:
        model = MayTinh
        fields = '__all__'

class PhongMaySerializer(serializers.ModelSerializer):
    can_bo_phu_trach_info = UserBasicSerializer(source='can_bo_phu_trach', read_only=True)
    so_may_tinh = serializers.SerializerMethodField()
    
    class Meta:
        model = PhongMay
        fields = '__all__'
    
    def get_so_may_tinh(self, obj):
        return obj.may_tinh.count()

class PhongMayDetailSerializer(serializers.ModelSerializer):
    can_bo_phu_trach_info = UserBasicSerializer(source='can_bo_phu_trach', read_only=True)
    may_tinh = MayTinhSerializer(many=True, read_only=True)
    
    class Meta:
        model = PhongMay
        fields = '__all__'


# ==================== NHOM THUC HANH SERIALIZERS ====================
class NhomThucHanhSerializer(serializers.ModelSerializer):
    mon_hoc_info = MonHocSerializer(source='mon_hoc', read_only=True)
    giang_vien_info = UserBasicSerializer(source='giang_vien', read_only=True)
    so_cho_con = serializers.SerializerMethodField()
    
    class Meta:
        model = NhomThucHanh
        fields = '__all__'
    
    def get_so_cho_con(self, obj):
        return obj.suc_chua - obj.si_so_hien_tai


# ==================== BUOI THUC HANH SERIALIZERS ====================
class BuoiThucHanhSerializer(serializers.ModelSerializer):
    nhom_info = serializers.SerializerMethodField()
    phong_may_info = PhongMaySerializer(source='phong_may', read_only=True)
    giang_vien_info = serializers.SerializerMethodField()
    thoi_gian = serializers.SerializerMethodField()
    ngay_thuc_hien_formatted = serializers.SerializerMethodField()
    thu = serializers.SerializerMethodField()
    
    class Meta:
        model = BuoiThucHanh
        fields = '__all__'
    
    def get_nhom_info(self, obj):
        return {
            'id': obj.nhom.id,
            'ten_nhom': obj.nhom.ten_nhom,
            'mon_hoc': {
                'ma_mon': obj.nhom.mon_hoc.ma_mon,
                'ten_mon': obj.nhom.mon_hoc.ten_mon
            }
        }
    
    def get_giang_vien_info(self, obj):
        if obj.nhom.giang_vien:
            return UserBasicSerializer(obj.nhom.giang_vien).data
        return None
    
    def get_thoi_gian(self, obj):
        return obj.thoi_gian
    
    def get_ngay_thuc_hien_formatted(self, obj):
        return obj.ngay_thuc_hien.strftime('%d/%m/%Y')
    
    def get_thu(self, obj):
        days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
        return days[obj.ngay_thuc_hien.weekday()]


# ==================== BO TRI VI TRI SERIALIZERS ====================
class BoTriViTriNgoiSerializer(serializers.ModelSerializer):
    sinh_vien_info = UserDetailSerializer(source='sinh_vien', read_only=True)
    may_tinh_info = MayTinhSerializer(source='may_tinh', read_only=True)
    
    class Meta:
        model = BoTriViTriNgoi
        fields = '__all__'

class BoTriViTriCreateSerializer(serializers.Serializer):
    """Serializer cho việc tạo nhiều bố trí cùng lúc"""
    buoi_th_id = serializers.IntegerField()
    assignments = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )
    
    def validate_assignments(self, value):
        """
        Validate format: [{'sinh_vien_id': 1, 'may_tinh_id': 5}, ...]
        """
        for item in value:
            if 'sinh_vien_id' not in item or 'may_tinh_id' not in item:
                raise serializers.ValidationError("Mỗi assignment cần có sinh_vien_id và may_tinh_id")
        return value


# ==================== DIEM DANH SERIALIZERS ====================
class DiemDanhSerializer(serializers.ModelSerializer):
    sinh_vien_info = UserDetailSerializer(source='sinh_vien', read_only=True)
    may_tinh = serializers.SerializerMethodField()
    
    class Meta:
        model = DiemDanh
        fields = '__all__'
    
    def get_may_tinh(self, obj):
        """Lấy thông tin máy tính được phân công"""
        try:
            bo_tri = BoTriViTriNgoi.objects.get(
                buoi_th=obj.buoi_th,
                sinh_vien=obj.sinh_vien
            )
            return bo_tri.may_tinh.so_may
        except BoTriViTriNgoi.DoesNotExist:
            return None

class DiemDanhListSerializer(serializers.Serializer):
    """Serializer cho việc điểm danh hàng loạt"""
    buoi_th_id = serializers.IntegerField()
    attendance_list = serializers.ListField(
        child=serializers.DictField()
    )
    
    def validate_attendance_list(self, value):
        """
        Validate format: [
            {'sinh_vien_id': 1, 'trang_thai': 'present', 'ghi_chu': ''},
            ...
        ]
        """
        valid_statuses = ['present', 'absent', 'late', 'excused']
        for item in value:
            if 'sinh_vien_id' not in item or 'trang_thai' not in item:
                raise serializers.ValidationError(
                    "Mỗi record cần có sinh_vien_id và trang_thai"
                )
            if item['trang_thai'] not in valid_statuses:
                raise serializers.ValidationError(
                    f"Trạng thái không hợp lệ. Chọn từ: {valid_statuses}"
                )
        return value


# ==================== CAM THI SERIALIZERS ====================
class CamThiSerializer(serializers.ModelSerializer):
    sinh_vien_info = UserDetailSerializer(source='sinh_vien', read_only=True)
    mon_hoc_info = MonHocSerializer(source='mon_hoc', read_only=True)
    nhom_info = serializers.SerializerMethodField()
    lich_su_vang = serializers.SerializerMethodField()
    
    class Meta:
        model = CamThi
        fields = '__all__'
    
    def get_nhom_info(self, obj):
        return {
            'id': obj.nhom.id,
            'ten_nhom': obj.nhom.ten_nhom
        }
    
    def get_lich_su_vang(self, obj):
        """Lấy lịch sử các buổi vắng"""
        diem_danh = DiemDanh.objects.filter(
            sinh_vien=obj.sinh_vien,
            buoi_th__nhom=obj.nhom,
            trang_thai__in=['absent']
        ).select_related('buoi_th')
        
        return [{
            'ngay': dd.buoi_th.ngay_thuc_hien.strftime('%d/%m/%Y'),
            'buoi': f"Buổi {dd.buoi_th.so_buoi}",
            'trang_thai': dd.get_trang_thai_display(),
            'ghi_chu': dd.ghi_chu or ''
        } for dd in diem_danh]


# ==================== STATISTICS SERIALIZERS ====================
class InstructorStatsSerializer(serializers.Serializer):
    """Thống kê cho giảng viên"""
    total_groups = serializers.IntegerField()
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    upcoming_sessions = serializers.IntegerField()
    total_students = serializers.IntegerField()
    avg_attendance_rate = serializers.FloatField()

class LabAssistantStatsSerializer(serializers.Serializer):
    """Thống kê cho cán bộ phụ trách"""
    sessions_today = serializers.IntegerField()
    total_students = serializers.IntegerField()
    seats_assigned = serializers.IntegerField()
    banned_students = serializers.IntegerField()
