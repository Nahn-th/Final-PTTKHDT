# backend/lab_management/views_instructor.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    User, BuoiThucHanh, DiemDanh, NhomThucHanh, 
    BoTriViTriNgoi, CamThi
)
from .serializers import (
    BuoiThucHanhSerializer, DiemDanhSerializer, DiemDanhListSerializer,
    NhomThucHanhSerializer, InstructorStatsSerializer
)


class InstructorDashboardViewSet(viewsets.ViewSet):
    """Dashboard cho giảng viên"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Thống kê tổng quan"""
        user = request.user
        
        # Lấy các nhóm của giảng viên
        my_groups = NhomThucHanh.objects.filter(giang_vien=user)
        
        # Tổng số nhóm
        total_groups = my_groups.count()
        
        # Tổng số buổi
        all_sessions = BuoiThucHanh.objects.filter(nhom__in=my_groups)
        total_sessions = all_sessions.count()
        completed_sessions = all_sessions.filter(trang_thai='completed').count()
        upcoming_sessions = all_sessions.filter(trang_thai='upcoming').count()
        
        # Tổng số sinh viên
        total_students = my_groups.aggregate(
            total=Count('sinh_vien', distinct=True)
        )['total'] or 0
        
        # Tỷ lệ điểm danh trung bình
        diem_danh_stats = DiemDanh.objects.filter(
            buoi_th__nhom__in=my_groups
        ).aggregate(
            total=Count('id'),
            present=Count('id', filter=Q(trang_thai__in=['present', 'late']))
        )
        
        avg_attendance_rate = 0
        if diem_danh_stats['total'] > 0:
            avg_attendance_rate = (diem_danh_stats['present'] / diem_danh_stats['total']) * 100
        
        data = {
            'total_groups': total_groups,
            'total_sessions': total_sessions,
            'completed_sessions': completed_sessions,
            'upcoming_sessions': upcoming_sessions,
            'total_students': total_students,
            'avg_attendance_rate': round(avg_attendance_rate, 2)
        }
        
        serializer = InstructorStatsSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming_sessions(self, request):
        """Lấy các buổi học sắp tới"""
        user = request.user
        today = timezone.now().date()
        
        sessions = BuoiThucHanh.objects.filter(
            nhom__giang_vien=user,
            trang_thai='upcoming',
            ngay_thuc_hien__gte=today
        ).select_related(
            'nhom', 'nhom__mon_hoc', 'phong_may'
        ).order_by('ngay_thuc_hien', 'gio_bat_dau')[:5]
        
        serializer = BuoiThucHanhSerializer(sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_groups(self, request):
        """Lấy danh sách nhóm của giảng viên"""
        user = request.user
        groups = NhomThucHanh.objects.filter(
            giang_vien=user
        ).select_related('mon_hoc').annotate(
            so_buoi=Count('buoi_th'),
            so_buoi_hoan_thanh=Count('buoi_th', filter=Q(buoi_th__trang_thai='completed'))
        )
        
        # Thêm tỷ lệ điểm danh cho từng nhóm
        data = []
        for group in groups:
            group_data = NhomThucHanhSerializer(group).data
            
            # Tính attendance rate
            diem_danh = DiemDanh.objects.filter(buoi_th__nhom=group)
            total_dd = diem_danh.count()
            present_dd = diem_danh.filter(trang_thai__in=['present', 'late']).count()
            
            group_data['attendance_rate'] = 0
            if total_dd > 0:
                group_data['attendance_rate'] = round((present_dd / total_dd) * 100, 1)
            
            group_data['so_buoi'] = group.so_buoi
            group_data['so_buoi_hoan_thanh'] = group.so_buoi_hoan_thanh
            
            data.append(group_data)
        
        return Response(data)


class InstructorScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """Lịch dạy của giảng viên"""
    permission_classes = [IsAuthenticated]
    serializer_class = BuoiThucHanhSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = BuoiThucHanh.objects.filter(
            nhom__giang_vien=user
        ).select_related(
            'nhom', 'nhom__mon_hoc', 'phong_may', 'nhom__giang_vien'
        ).order_by('-ngay_thuc_hien', '-gio_bat_dau')
        
        # Filter by subject
        subject = self.request.query_params.get('subject', None)
        if subject:
            queryset = queryset.filter(nhom__mon_hoc__ma_mon=subject)
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(trang_thai=status_filter)
        
        # Filter by date range
        from_date = self.request.query_params.get('from_date', None)
        to_date = self.request.query_params.get('to_date', None)
        
        if from_date:
            queryset = queryset.filter(ngay_thuc_hien__gte=from_date)
        if to_date:
            queryset = queryset.filter(ngay_thuc_hien__lte=to_date)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def subjects(self, request):
        """Lấy danh sách môn học của giảng viên"""
        user = request.user
        subjects = NhomThucHanh.objects.filter(
            giang_vien=user
        ).values(
            'mon_hoc__id', 
            'mon_hoc__ma_mon', 
            'mon_hoc__ten_mon'
        ).distinct()
        
        return Response(subjects)


class InstructorAttendanceViewSet(viewsets.ModelViewSet):
    """Điểm danh của giảng viên"""
    permission_classes = [IsAuthenticated]
    serializer_class = DiemDanhSerializer
    
    def get_queryset(self):
        user = self.request.user
        return DiemDanh.objects.filter(
            buoi_th__nhom__giang_vien=user
        ).select_related(
            'buoi_th', 'sinh_vien', 'nguoi_diem_danh'
        )
    
    @action(detail=False, methods=['get'])
    def sessions(self, request):
        """Lấy danh sách buổi học để điểm danh"""
        user = request.user
        today = timezone.now().date()
        
        # Lấy các buổi trong tuần này và tuần trước
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=13)  # 2 tuần
        
        sessions = BuoiThucHanh.objects.filter(
            nhom__giang_vien=user,
            ngay_thuc_hien__range=[week_start, week_end]
        ).select_related(
            'nhom', 'nhom__mon_hoc', 'phong_may'
        ).order_by('-ngay_thuc_hien', '-gio_bat_dau')
        
        serializer = BuoiThucHanhSerializer(sessions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def session_detail(self, request):
        """Lấy danh sách sinh viên của một buổi học"""
        session_id = request.query_params.get('session_id')
        
        if not session_id:
            return Response(
                {'error': 'Thiếu session_id'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            buoi_th = BuoiThucHanh.objects.get(
                id=session_id,
                nhom__giang_vien=request.user
            )
        except BuoiThucHanh.DoesNotExist:
            return Response(
                {'error': 'Không tìm thấy buổi học'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Lấy danh sách sinh viên trong nhóm
        sinh_vien_list = User.objects.filter(
            dang_ky_nhom__nhom=buoi_th.nhom,
            dang_ky_nhom__trang_thai='active'
        ).order_by('code')
        
        # Lấy thông tin điểm danh (nếu đã có)
        diem_danh_dict = {}
        diem_danh_records = DiemDanh.objects.filter(buoi_th=buoi_th)
        for dd in diem_danh_records:
            diem_danh_dict[dd.sinh_vien_id] = {
                'id': dd.id,
                'trang_thai': dd.trang_thai,
                'ghi_chu': dd.ghi_chu
            }
        
        # Lấy thông tin vị trí ngồi
        vi_tri_dict = {}
        vi_tri_records = BoTriViTriNgoi.objects.filter(buoi_th=buoi_th).select_related('may_tinh')
        for vt in vi_tri_records:
            vi_tri_dict[vt.sinh_vien_id] = vt.may_tinh.so_may
        
        # Tổng hợp dữ liệu
        students_data = []
        for sv in sinh_vien_list:
            dd_info = diem_danh_dict.get(sv.id, {})
            students_data.append({
                'id': sv.id,
                'code': sv.code,
                'name': sv.get_full_name(),
                'class': sv.class_name,
                'computer': vi_tri_dict.get(sv.id, ''),
                'diem_danh_id': dd_info.get('id'),
                'status': dd_info.get('trang_thai', 'present'),  # Mặc định là present
                'note': dd_info.get('ghi_chu', '')
            })
        
        return Response({
            'buoi_th': BuoiThucHanhSerializer(buoi_th).data,
            'students': students_data,
            'total': len(students_data)
        })
    
    @action(detail=False, methods=['post'])
    def save_attendance(self, request):
        """Lưu điểm danh hàng loạt"""
        serializer = DiemDanhListSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        buoi_th_id = serializer.validated_data['buoi_th_id']
        attendance_list = serializer.validated_data['attendance_list']
        
        # Kiểm tra buổi học
        try:
            buoi_th = BuoiThucHanh.objects.get(
                id=buoi_th_id,
                nhom__giang_vien=request.user
            )
        except BuoiThucHanh.DoesNotExist:
            return Response(
                {'error': 'Không tìm thấy buổi học'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Lưu điểm danh
        created_count = 0
        updated_count = 0
        
        for item in attendance_list:
            sinh_vien_id = item['sinh_vien_id']
            trang_thai = item['trang_thai']
            ghi_chu = item.get('ghi_chu', '')
            
            dd, created = DiemDanh.objects.update_or_create(
                buoi_th=buoi_th,
                sinh_vien_id=sinh_vien_id,
                defaults={
                    'trang_thai': trang_thai,
                    'ghi_chu': ghi_chu,
                    'nguoi_diem_danh': request.user
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
        
        # Cập nhật trạng thái buổi học
        buoi_th.da_diem_danh = True
        if buoi_th.trang_thai == 'upcoming':
            buoi_th.trang_thai = 'completed'
        buoi_th.save()
        
        # Cập nhật cảnh báo cấm thi (nếu cần)
        self._update_exam_ban_status(buoi_th)
        
        return Response({
            'success': True,
            'message': f'Đã lưu điểm danh: {created_count} mới, {updated_count} cập nhật',
            'created': created_count,
            'updated': updated_count
        })
    
    def _update_exam_ban_status(self, buoi_th):
        """Cập nhật trạng thái cấm thi dựa trên điểm danh"""
        # Lấy tất cả sinh viên trong nhóm
        sinh_vien_list = User.objects.filter(
            dang_ky_nhom__nhom=buoi_th.nhom,
            dang_ky_nhom__trang_thai='active'
        )
        
        # Tổng số buổi đã diễn ra
        tong_buoi = BuoiThucHanh.objects.filter(
            nhom=buoi_th.nhom,
            trang_thai='completed'
        ).count()
        
        for sv in sinh_vien_list:
            # Đếm số buổi vắng
            so_buoi_vang = DiemDanh.objects.filter(
                buoi_th__nhom=buoi_th.nhom,
                buoi_th__trang_thai='completed',
                sinh_vien=sv,
                trang_thai='absent'
            ).count()
            
            ty_le_vang = (so_buoi_vang / tong_buoi * 100) if tong_buoi > 0 else 0
            
            # Cập nhật hoặc tạo bản ghi cấm thi
            if ty_le_vang >= 20:  # Ngưỡng cảnh báo: 20%
                trang_thai = 'banned' if ty_le_vang > 20 else 'warning'
                co_the_thi = ty_le_vang <= 20
                
                CamThi.objects.update_or_create(
                    sinh_vien=sv,
                    mon_hoc=buoi_th.nhom.mon_hoc,
                    nhom=buoi_th.nhom,
                    defaults={
                        'tong_so_buoi': tong_buoi,
                        'so_buoi_vang': so_buoi_vang,
                        'ty_le_vang': round(ty_le_vang, 1),
                        'ly_do': f'Vắng {so_buoi_vang}/{tong_buoi} buổi ({ty_le_vang:.1f}%)',
                        'trang_thai': trang_thai,
                        'co_the_thi': co_the_thi,
                        'nguoi_cap_nhat': self.request.user
                    }
                )
