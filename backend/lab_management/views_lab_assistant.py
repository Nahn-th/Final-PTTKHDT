# backend/lab_management/views_lab_assistant.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    User, BuoiThucHanh, BoTriViTriNgoi, MayTinh, PhongMay,
    CamThi, DiemDanh, NhomThucHanh
)
from .serializers import (
    BuoiThucHanhSerializer, BoTriViTriNgoiSerializer, BoTriViTriCreateSerializer,
    CamThiSerializer, PhongMayDetailSerializer, LabAssistantStatsSerializer,
    MayTinhSerializer, UserDetailSerializer
)


class LabAssistantDashboardViewSet(viewsets.ViewSet):
    """Dashboard cho cán bộ phụ trách"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Thống kê tổng quan"""
        user = request.user
        today = timezone.now().date()
        
        # Lấy phòng máy mà CBPT phụ trách
        my_labs = PhongMay.objects.filter(can_bo_phu_trach=user)
        
        # Các buổi TH hôm nay
        sessions_today = BuoiThucHanh.objects.filter(
            phong_may__in=my_labs,
            ngay_thuc_hien=today
        ).count()
        
        # Tổng số sinh viên
        total_students = User.objects.filter(
            role='student',
            dang_ky_nhom__nhom__buoi_th__phong_may__in=my_labs,
            dang_ky_nhom__trang_thai='active'
        ).distinct().count()
        
        # Số buổi đã bố trí vị trí
        seats_assigned = BuoiThucHanh.objects.filter(
            phong_may__in=my_labs,
            ngay_thuc_hien=today,
            da_bo_tri_vi_tri=True
        ).count()
        
        # Số sinh viên bị cấm thi
        banned_students = CamThi.objects.filter(
            mon_hoc__nhom_th__buoi_th__phong_may__in=my_labs,
            co_the_thi=False
        ).values('sinh_vien').distinct().count()
        
        data = {
            'sessions_today': sessions_today,
            'total_students': total_students,
            'seats_assigned': seats_assigned,
            'banned_students': banned_students
        }
        
        serializer = LabAssistantStatsSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def today_sessions(self, request):
        """Lấy các buổi học hôm nay"""
        user = request.user
        today = timezone.now().date()
        
        sessions = BuoiThucHanh.objects.filter(
            phong_may__can_bo_phu_trach=user,
            ngay_thuc_hien=today
        ).select_related(
            'nhom', 'nhom__mon_hoc', 'phong_may', 'nhom__giang_vien'
        ).order_by('gio_bat_dau')
        
        serializer = BuoiThucHanhSerializer(sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def banned_students(self, request):
        """Danh sách sinh viên bị cấm thi"""
        user = request.user
        my_labs = PhongMay.objects.filter(can_bo_phu_trach=user)
        
        banned = CamThi.objects.filter(
            nhom__buoi_th__phong_may__in=my_labs
        ).select_related(
            'sinh_vien', 'mon_hoc', 'nhom'
        ).distinct()[:10]  # Top 10
        
        serializer = CamThiSerializer(banned, many=True)
        return Response(serializer.data)


class LabAssistantScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """Lịch trực phòng của cán bộ phụ trách"""
    permission_classes = [IsAuthenticated]
    serializer_class = BuoiThucHanhSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = BuoiThucHanh.objects.filter(
            phong_may__can_bo_phu_trach=user
        ).select_related(
            'nhom', 'nhom__mon_hoc', 'phong_may', 'nhom__giang_vien'
        ).order_by('ngay_thuc_hien', 'gio_bat_dau')
        
        # Filter by date range
        from_date = self.request.query_params.get('from_date', None)
        to_date = self.request.query_params.get('to_date', None)
        
        if from_date:
            queryset = queryset.filter(ngay_thuc_hien__gte=from_date)
        if to_date:
            queryset = queryset.filter(ngay_thuc_hien__lte=to_date)
        
        return queryset


class SeatAssignmentViewSet(viewsets.ModelViewSet):
    """Bố trí vị trí ngồi"""
    permission_classes = [IsAuthenticated]
    serializer_class = BoTriViTriNgoiSerializer
    
    def get_queryset(self):
        user = self.request.user
        return BoTriViTriNgoi.objects.filter(
            buoi_th__phong_may__can_bo_phu_trach=user
        ).select_related('buoi_th', 'sinh_vien', 'may_tinh')
    
    @action(detail=False, methods=['get'])
    def sessions(self, request):
        """Lấy danh sách buổi học cần bố trí"""
        user = request.user
        today = timezone.now().date()
        week_end = today + timedelta(days=7)
        
        sessions = BuoiThucHanh.objects.filter(
            phong_may__can_bo_phu_trach=user,
            ngay_thuc_hien__range=[today, week_end],
            trang_thai='upcoming'
        ).select_related(
            'nhom', 'nhom__mon_hoc', 'phong_may'
        ).order_by('ngay_thuc_hien', 'gio_bat_dau')
        
        serializer = BuoiThucHanhSerializer(sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def session_detail(self, request):
        """Lấy chi tiết buổi học và danh sách sinh viên"""
        session_id = request.query_params.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'Thiếu session_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            buoi_th = BuoiThucHanh.objects.get(
                id=session_id,
                phong_may__can_bo_phu_trach=request.user
            )
        except BuoiThucHanh.DoesNotExist:
            return Response(
                {'error': 'Không tìm thấy buổi học'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Lấy cấu hình phòng máy
        phong = buoi_th.phong_may
        may_tinh_list = MayTinh.objects.filter(
            phong_may=phong,
            trang_thai__in=['available', 'in_use']
        ).order_by('vi_tri_hang', 'vi_tri_cot')
        
        # Lấy danh sách sinh viên
        sinh_vien_list = User.objects.filter(
            dang_ky_nhom__nhom=buoi_th.nhom,
            dang_ky_nhom__trang_thai='active'
        ).order_by('code')
        
        # Lấy bố trí hiện tại (nếu có)
        bo_tri_dict = {}
        bo_tri_records = BoTriViTriNgoi.objects.filter(buoi_th=buoi_th)
        for bt in bo_tri_records:
            bo_tri_dict[bt.sinh_vien_id] = bt.may_tinh_id
        
        # Tạo layout phòng máy
        layout = []
        for may in may_tinh_list:
            # Tìm sinh viên đang ngồi ở máy này
            sinh_vien_id = None
            for sv_id, mt_id in bo_tri_dict.items():
                if mt_id == may.id:
                    sinh_vien_id = sv_id
                    break
            
            layout.append({
                'id': may.id,
                'so_may': may.so_may,
                'vi_tri_hang': may.vi_tri_hang,
                'vi_tri_cot': may.vi_tri_cot,
                'trang_thai': may.trang_thai,
                'sinh_vien_id': sinh_vien_id,
                'student': UserDetailSerializer(
                    User.objects.get(id=sinh_vien_id)
                ).data if sinh_vien_id else None
            })
        
        # Danh sách sinh viên chưa có chỗ
        unassigned_students = []
        for sv in sinh_vien_list:
            if sv.id not in bo_tri_dict:
                unassigned_students.append(UserDetailSerializer(sv).data)
        
        return Response({
            'buoi_th': BuoiThucHanhSerializer(buoi_th).data,
            'layout_config': {
                'rows': phong.so_hang,
                'cols': phong.so_cot
            },
            'seat_layout': layout,
            'students': UserDetailSerializer(sinh_vien_list, many=True).data,
            'unassigned_students': unassigned_students,
            'assigned_count': len(bo_tri_dict),
            'total_students': sinh_vien_list.count()
        })
    
    @action(detail=False, methods=['post'])
    def save_layout(self, request):
        """Lưu sơ đồ bố trí chỗ ngồi"""
        serializer = BoTriViTriCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        buoi_th_id = serializer.validated_data['buoi_th_id']
        assignments = serializer.validated_data['assignments']
        
        # Kiểm tra buổi học
        try:
            buoi_th = BuoiThucHanh.objects.get(
                id=buoi_th_id,
                phong_may__can_bo_phu_trach=request.user
            )
        except BuoiThucHanh.DoesNotExist:
            return Response(
                {'error': 'Không tìm thấy buổi học'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Xóa bố trí cũ
        BoTriViTriNgoi.objects.filter(buoi_th=buoi_th).delete()
        
        # Tạo bố trí mới
        bo_tri_list = []
        for assignment in assignments:
            sinh_vien_id = assignment['sinh_vien_id']
            may_tinh_id = assignment['may_tinh_id']
            
            bo_tri_list.append(BoTriViTriNgoi(
                buoi_th=buoi_th,
                sinh_vien_id=sinh_vien_id,
                may_tinh_id=may_tinh_id
            ))
        
        BoTriViTriNgoi.objects.bulk_create(bo_tri_list)
        
        # Cập nhật trạng thái buổi học
        buoi_th.da_bo_tri_vi_tri = True
        buoi_th.save()
        
        return Response({
            'success': True,
            'message': f'Đã bố trí {len(bo_tri_list)} vị trí ngồi',
            'assigned_count': len(bo_tri_list)
        })
    
    @action(detail=False, methods=['post'])
    def auto_assign(self, request):
        """Tự động phân chỗ ngồi"""
        session_id = request.data.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'Thiếu session_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            buoi_th = BuoiThucHanh.objects.get(
                id=session_id,
                phong_may__can_bo_phu_trach=request.user
            )
        except BuoiThucHanh.DoesNotExist:
            return Response(
                {'error': 'Không tìm thấy buổi học'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Lấy sinh viên chưa có chỗ
        sinh_vien_da_co = BoTriViTriNgoi.objects.filter(
            buoi_th=buoi_th
        ).values_list('sinh_vien_id', flat=True)
        
        sinh_vien_chua_co = User.objects.filter(
            dang_ky_nhom__nhom=buoi_th.nhom,
            dang_ky_nhom__trang_thai='active'
        ).exclude(id__in=sinh_vien_da_co).order_by('code')
        
        # Lấy máy còn trống
        may_da_co = BoTriViTriNgoi.objects.filter(
            buoi_th=buoi_th
        ).values_list('may_tinh_id', flat=True)
        
        may_trong = MayTinh.objects.filter(
            phong_may=buoi_th.phong_may,
            trang_thai__in=['available', 'in_use']
        ).exclude(id__in=may_da_co).order_by('vi_tri_hang', 'vi_tri_cot')
        
        # Phân chỗ tự động
        bo_tri_list = []
        for sv, may in zip(sinh_vien_chua_co, may_trong):
            bo_tri_list.append(BoTriViTriNgoi(
                buoi_th=buoi_th,
                sinh_vien=sv,
                may_tinh=may
            ))
        
        if bo_tri_list:
            BoTriViTriNgoi.objects.bulk_create(bo_tri_list)
            buoi_th.da_bo_tri_vi_tri = True
            buoi_th.save()
        
        return Response({
            'success': True,
            'message': f'Đã phân {len(bo_tri_list)} chỗ ngồi tự động',
            'assigned_count': len(bo_tri_list)
        })


class ExamBanViewSet(viewsets.ModelViewSet):
    """Quản lý cấm thi"""
    permission_classes = [IsAuthenticated]
    serializer_class = CamThiSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = CamThi.objects.filter(
            nhom__buoi_th__phong_may__can_bo_phu_trach=user
        ).select_related(
            'sinh_vien', 'mon_hoc', 'nhom', 'nguoi_cap_nhat'
        ).distinct()
        
        # Filter by subject
        subject = self.request.query_params.get('subject', None)
        if subject:
            queryset = queryset.filter(mon_hoc__ma_mon=subject)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(trang_thai=status_filter)
        
        # Search
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(sinh_vien__code__icontains=search) |
                Q(sinh_vien__first_name__icontains=search) |
                Q(sinh_vien__last_name__icontains=search)
            )
        
        return queryset.order_by('-ty_le_vang')
    
    @action(detail=True, methods=['post'])
    def toggle_ban(self, request, pk=None):
        """Bật/tắt cấm thi thủ công"""
        cam_thi = self.get_object()
        
        # Toggle trạng thái
        cam_thi.co_the_thi = not cam_thi.co_the_thi
        cam_thi.trang_thai = 'warning' if cam_thi.co_the_thi else 'banned'
        cam_thi.nguoi_cap_nhat = request.user
        cam_thi.save()
        
        return Response({
            'success': True,
            'message': f"Đã {'cho phép' if cam_thi.co_the_thi else 'cấm'} thi",
            'can_take_exam': cam_thi.co_the_thi
        })
    
    @action(detail=False, methods=['get'])
    def subjects(self, request):
        """Danh sách môn học có sinh viên cấm thi"""
        user = request.user
        subjects = CamThi.objects.filter(
            nhom__buoi_th__phong_may__can_bo_phu_trach=user
        ).values(
            'mon_hoc__id',
            'mon_hoc__ma_mon',
            'mon_hoc__ten_mon'
        ).distinct()
        
        return Response(subjects)
