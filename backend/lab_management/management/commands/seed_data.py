# backend/lab_management/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from lab_management.models import (
    User, MonHoc, PhongMay, MayTinh, NhomThucHanh,
    SinhVien_NhomThucHanh, BuoiThucHanh
)


class Command(BaseCommand):
    help = 'Seed database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # 1. Tạo Users
        self.create_users()
        
        # 2. Tạo Môn học
        self.create_subjects()
        
        # 3. Tạo Phòng máy
        self.create_labs()
        
        # 4. Tạo Nhóm thực hành
        self.create_groups()
        
        # 5. Đăng ký sinh viên vào nhóm
        self.register_students()
        
        # 6. Tạo Buổi thực hành
        self.create_sessions()
        
        self.stdout.write(self.style.SUCCESS('✓ Seeding completed!'))

    def create_users(self):
        self.stdout.write('Creating users...')
        
        # Admin
        User.objects.create_superuser(
            username='admin',
            code='ADMIN001',
            email='admin@example.com',
            password='admin123',
            first_name='Admin',
            last_name='System',
            role='admin'
        )
        
        # Giảng viên
        gv_data = [
            ('nva', 'CB001', 'Nguyễn', 'Văn A', 'TS.', 'Lập trình Web, OOP'),
            ('ttb', 'CB002', 'Trần', 'Thị B', 'ThS.', 'Cơ sở dữ liệu'),
            ('pvd', 'CB003', 'Phạm', 'Văn D', 'TS.', 'Mạng máy tính'),
            ('hte', 'CB004', 'Hoàng', 'Thị E', 'ThS.', 'Lập trình Web'),
        ]
        
        for username, code, fn, ln, title, spec in gv_data:
            User.objects.create_user(
                username=username,
                code=code,
                email=f'{username}@example.com',
                password='password123',
                first_name=f'{title} {fn}',
                last_name=ln,
                role='instructor',
                specialization=spec
            )
        
        # Cán bộ phụ trách
        cbpt_data = [
            ('cbpt1', 'CBPT001', 'Lê', 'Văn C'),
            ('cbpt2', 'CBPT002', 'Phạm', 'Thị D'),
        ]
        
        for username, code, fn, ln in cbpt_data:
            User.objects.create_user(
                username=username,
                code=code,
                email=f'{username}@example.com',
                password='password123',
                first_name=fn,
                last_name=ln,
                role='lab_assistant'
            )
        
        # Sinh viên
        for i in range(1, 51):  # 50 sinh viên
            User.objects.create_user(
                username=f'sv{i:03d}',
                code=f'21520{i:03d}',
                email=f'sv{i:03d}@student.uit.edu.vn',
                password='password123',
                first_name=f'Sinh viên',
                last_name=f'{i}',
                role='student',
                class_name='KHTN2021'
            )
        
        self.stdout.write(self.style.SUCCESS('✓ Users created'))

    def create_subjects(self):
        self.stdout.write('Creating subjects...')
        
        subjects = [
            ('IT001', 'Lập trình hướng đối tượng', 4, 30),
            ('IT002', 'Cơ sở dữ liệu', 4, 30),
            ('IT004', 'Mạng máy tính', 4, 30),
            ('IT005', 'Lập trình Web', 4, 30),
        ]
        
        for code, name, credits, hours in subjects:
            MonHoc.objects.create(
                ma_mon=code,
                ten_mon=name,
                so_tin_chi=credits,
                so_tiet_th=hours,
                hoc_ky='HK1-2024'
            )
        
        self.stdout.write(self.style.SUCCESS('✓ Subjects created'))

    def create_labs(self):
        self.stdout.write('Creating labs...')
        
        cbpt1 = User.objects.get(code='CBPT001')
        cbpt2 = User.objects.get(code='CBPT002')
        
        labs_data = [
            ('A101', 'Phòng A101', 'Tòa A - Tầng 1', 40, 5, 8, cbpt1),
            ('A102', 'Phòng A102', 'Tòa A - Tầng 1', 40, 5, 8, cbpt1),
            ('B203', 'Phòng B203', 'Tòa B - Tầng 2', 40, 5, 8, cbpt2),
            ('C305', 'Phòng C305', 'Tòa C - Tầng 3', 35, 5, 7, cbpt2),
        ]
        
        for ma, ten, vi_tri, suc_chua, hang, cot, cbpt in labs_data:
            phong = PhongMay.objects.create(
                ma_phong=ma,
                ten_phong=ten,
                vi_tri=vi_tri,
                suc_chua=suc_chua,
                so_hang=hang,
                so_cot=cot,
                can_bo_phu_trach=cbpt
            )
            
            # Tạo máy tính cho phòng
            may_num = 1
            for h in range(1, hang + 1):
                for c in range(1, cot + 1):
                    if may_num <= suc_chua:
                        MayTinh.objects.create(
                            phong_may=phong,
                            so_may=f'Máy {may_num:02d}',
                            vi_tri_hang=h,
                            vi_tri_cot=c,
                            trang_thai='available',
                            cpu='Intel i5-10400',
                            ram='16GB',
                            storage='512GB SSD'
                        )
                        may_num += 1
        
        self.stdout.write(self.style.SUCCESS('✓ Labs and computers created'))

    def create_groups(self):
        self.stdout.write('Creating groups...')
        
        it001 = MonHoc.objects.get(ma_mon='IT001')
        it002 = MonHoc.objects.get(ma_mon='IT002')
        it004 = MonHoc.objects.get(ma_mon='IT004')
        it005 = MonHoc.objects.get(ma_mon='IT005')
        
        nva = User.objects.get(code='CB001')
        ttb = User.objects.get(code='CB002')
        pvd = User.objects.get(code='CB003')
        hte = User.objects.get(code='CB004')
        
        groups_data = [
            (it001, 'Nhóm 1', 40, nva),
            (it001, 'Nhóm 2', 40, nva),
            (it002, 'Nhóm 1', 40, ttb),
            (it002, 'Nhóm 2', 40, ttb),
            (it004, 'Nhóm 1', 35, pvd),
            (it005, 'Nhóm 1', 40, hte),
            (it005, 'Nhóm 2', 40, nva),
        ]
        
        for mon, ten, suc_chua, gv in groups_data:
            NhomThucHanh.objects.create(
                mon_hoc=mon,
                ten_nhom=ten,
                suc_chua=suc_chua,
                giang_vien=gv
            )
        
        self.stdout.write(self.style.SUCCESS('✓ Groups created'))

    def register_students(self):
        self.stdout.write('Registering students...')
        
        students = User.objects.filter(role='student')
        groups = NhomThucHanh.objects.all()
        
        # Phân sinh viên vào các nhóm
        sv_per_group = 38
        
        for idx, group in enumerate(groups):
            start = idx * sv_per_group
            end = start + sv_per_group
            group_students = students[start:end] if end <= len(students) else students[start:]
            
            for sv in group_students:
                SinhVien_NhomThucHanh.objects.create(
                    sinh_vien=sv,
                    nhom=group,
                    trang_thai='active'
                )
            
            # Cập nhật sĩ số
            group.si_so_hien_tai = len(group_students)
            group.save()
        
        self.stdout.write(self.style.SUCCESS('✓ Students registered'))

    def create_sessions(self):
        self.stdout.write('Creating sessions...')
        
        groups = NhomThucHanh.objects.all()
        labs = PhongMay.objects.all()
        
        # Tạo lịch cho 4 tuần (2 tuần trước + 2 tuần sau)
        base_date = timezone.now().date()
        start_week = base_date - timedelta(days=base_date.weekday() + 7)
        
        topics = [
            'Giới thiệu môn học',
            'Cài đặt môi trường',
            'Bài tập thực hành cơ bản',
            'Bài tập nâng cao',
            'Ôn tập kiến thức',
            'Thực hành dự án nhỏ',
            'Review và chữa bài',
            'Kiểm tra thực hành'
        ]
        
        for group_idx, group in enumerate(groups):
            lab = labs[group_idx % len(labs)]
            weekday = group_idx % 5  # 0=Monday, 4=Friday
            hour = 8 if group_idx % 2 == 0 else 14
            
            for week in range(4):
                for buoi in range(2):  # 2 buổi/tuần
                    ngay = start_week + timedelta(days=week*7 + weekday + buoi*2)
                    so_buoi = week * 2 + buoi + 1
                    
                    # Xác định trạng thái
                    if ngay < base_date:
                        trang_thai = 'completed'
                        da_diem_danh = True
                        da_bo_tri = True
                    elif ngay == base_date:
                        trang_thai = 'ongoing'
                        da_diem_danh = False
                        da_bo_tri = True
                    else:
                        trang_thai = 'upcoming'
                        da_diem_danh = False
                        da_bo_tri = False
                    
                    BuoiThucHanh.objects.create(
                        nhom=group,
                        phong_may=lab,
                        so_buoi=so_buoi,
                        ngay_thuc_hien=ngay,
                        gio_bat_dau=datetime.strptime(f'{hour}:00', '%H:%M').time(),
                        gio_ket_thuc=datetime.strptime(f'{hour+2}:00', '%H:%M').time(),
                        chu_de=topics[so_buoi % len(topics)],
                        noi_dung=f'Nội dung chi tiết buổi {so_buoi}',
                        trang_thai=trang_thai,
                        da_bo_tri_vi_tri=da_bo_tri,
                        da_diem_danh=da_diem_danh
                    )
        
        self.stdout.write(self.style.SUCCESS('✓ Sessions created'))
