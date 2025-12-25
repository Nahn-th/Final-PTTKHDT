import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, ChevronRight, ChevronLeft, Filter, Download, Eye, CheckCircle, AlertCircle, Grid } from 'lucide-react';

// ==================== 1. API SERVICE ====================

const api = {
  // Thêm tham số currentWeek vào hàm
  getScheduleData: async (week, currentWeek) => {
    
    // --- 1. Logic tính ngày (giữ nguyên như ý bạn) ---
    const today = new Date();
    // Tìm ngày thứ 2 của tuần hiện tại (để làm mốc)
    const currentDay = today.getDay(); // 0 là Chủ nhật
    const diffToMonday = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const startOfCurrentWeek = new Date(today.setDate(diffToMonday));

    // Tính ngày bắt đầu của tuần được chọn (selected week)
    // Công thức: Mốc + (Tuần chọn - Tuần hiện tại) * 7 ngày
    const from_date = new Date(startOfCurrentWeek);
    from_date.setDate(startOfCurrentWeek.getDate() + (week - currentWeek) * 7);
    
    const to_date = new Date(from_date);
    to_date.setDate(from_date.getDate() + 6); // +6 ngày để đến Chủ nhật

    const fromStr = from_date.toISOString().split('T')[0];
    const toStr = to_date.toISOString().split('T')[0];
    
    // --- 2. Gọi API (Đổi sang endpoint lab-assistant) ---
    // Lưu ý: Lab Assistant có thể không cần lấy list subjects riêng, 
    // nhưng mình vẫn giữ cấu trúc Promise.all như mẫu của bạn.
    const [subjects, schedules] = await Promise.all([
      // Endpoint lấy danh sách môn (nếu KTV cần lọc) - nếu không có thì bỏ dòng này
      fetch('http://localhost:8000/api/lab-assistant/schedules/subjects/', {
        credentials: 'include'
      }).then(r => r.json()).catch(() => []), // Catch lỗi để không crash nếu API này chưa có
      
      // Endpoint chính: Lịch thực hành
      fetch(`http://localhost:8000/api/lab-assistant/schedules/?from_date=${fromStr}&to_date=${toStr}`, {
        credentials: 'include'
      }).then(r => r.json())
    ]);
    
    // --- 3. Mapping dữ liệu (Quan trọng: Map đúng field cho KTV) ---
    return {
      subjects: subjects.map(s => ({
        id: s.mon_hoc__ma_mon,
        name: s.mon_hoc__ten_mon,
        color: 'blue' 
      })),
      
      schedules: (schedules.results || []).map(s => {
        // Logic tính status frontend (nếu BE chưa trả về)
        const sessionDate = new Date(s.ngay_thuc_hien);
        const now = new Date();
        const isCompleted = sessionDate < now && sessionDate.getDate() !== now.getDate();

        return {
            id: s.id,
            subject: s.nhom_info?.mon_hoc?.ten_mon,
            subjectCode: s.nhom_info?.mon_hoc?.ma_mon,
            group: s.nhom_info?.ten_nhom,
            date: s.ngay_thuc_hien,
            dayOfWeek: s.thu,
            time: s.thoi_gian,
            room: s.phong_may_info?.ma_phong,
            session: `Buổi ${s.so_thu_tu_buoi}`,
            topic: s.bai_thuc_hanh?.ten_bai || 'Chưa cập nhật',
            
            // --- CÁC FIELD RIÊNG CHO KỸ THUẬT VIÊN ---
            instructor: s.giang_vien_info?.ho_ten || 'Chưa phân công',
            students: s.nhom_info?.si_so || 0,
            
            status: isCompleted ? 'completed' : 'upcoming',
            
            // Map từ field backend (vd: da_xep_so_do, da_diem_danh)
            seatsAssigned: s.da_xep_so_do || false, 
            attendanceDone: s.da_diem_danh || false 
        };
      })
    };
  }
};

export default function XemLichTH() {
  const [currentWeek, setCurrentWeek] = useState(5);
  const [viewMode, setViewMode] = useState('week');

  const myLab = { id: 'A101', name: 'Phòng A101', capacity: 40 };

  const scheduleData = [
    {
      id: 1,
      subject: 'Lập trình hướng đối tượng',
      subjectCode: 'IT001',
      group: 'Nhóm 1',
      date: '2024-12-23',
      dayOfWeek: 'Thứ 2',
      time: '14:00 - 16:00',
      room: 'A101',
      session: 'Buổi 6',
      topic: 'Kế thừa và Đa hình trong Java',
      instructor: 'TS. Nguyễn Văn A',
      students: 38,
      status: 'upcoming',
      seatsAssigned: true,
      attendanceDone: false
    },
    {
      id: 2,
      subject: 'Lập trình Web',
      subjectCode: 'IT005',
      group: 'Nhóm 2',
      date: '2024-12-24',
      dayOfWeek: 'Thứ 3',
      time: '08:00 - 10:00',
      room: 'A101',
      session: 'Buổi 7',
      topic: 'React Hooks và State Management',
      instructor: 'ThS. Hoàng Thị E',
      students: 35,
      status: 'upcoming',
      seatsAssigned: true,
      attendanceDone: false
    },
    {
      id: 3,
      subject: 'Cơ sở dữ liệu',
      subjectCode: 'IT002',
      group: 'Nhóm 2',
      date: '2024-12-25',
      dayOfWeek: 'Thứ 4',
      time: '15:00 - 17:00',
      room: 'A101',
      session: 'Buổi 5',
      topic: 'SQL và Truy vấn nâng cao',
      instructor: 'ThS. Trần Thị B',
      students: 40,
      status: 'upcoming',
      seatsAssigned: true,
      attendanceDone: false
    },
    {
      id: 4,
      subject: 'Mạng máy tính',
      subjectCode: 'IT004',
      group: 'Nhóm 1',
      date: '2024-12-26',
      dayOfWeek: 'Thứ 5',
      time: '08:00 - 10:00',
      room: 'A101',
      session: 'Buổi 4',
      topic: 'Cấu hình Router và Switch',
      instructor: 'TS. Phạm Văn D',
      students: 30,
      status: 'upcoming',
      seatsAssigned: false,
      attendanceDone: false
    },
    {
      id: 5,
      subject: 'Lập trình Web',
      subjectCode: 'IT005',
      group: 'Nhóm 1',
      date: '2024-12-20',
      dayOfWeek: 'Thứ 6',
      time: '08:00 - 10:00',
      room: 'A101',
      session: 'Buổi 6',
      topic: 'Component và Props trong React',
      instructor: 'ThS. Hoàng Thị E',
      students: 43,
      status: 'completed',
      seatsAssigned: true,
      attendanceDone: true
    },
    {
      id: 6,
      subject: 'Lập trình hướng đối tượng',
      subjectCode: 'IT001',
      group: 'Nhóm 2',
      date: '2024-12-19',
      dayOfWeek: 'Thứ 5',
      time: '15:00 - 17:00',
      room: 'A101',
      session: 'Buổi 5',
      topic: 'Abstract Class và Interface',
      instructor: 'TS. Nguyễn Văn A',
      students: 36,
      status: 'completed',
      seatsAssigned: true,
      attendanceDone: true
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
          <CheckCircle size={14} />
          Hoàn thành
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
        <Clock size={14} />
        Sắp diễn ra
      </span>
    );
  };

  const upcomingSessions = scheduleData.filter(s => s.status === 'upcoming').length;
  const completedSessions = scheduleData.filter(s => s.status === 'completed').length;
  const needSeatsAssignment = scheduleData.filter(s => !s.seatsAssigned && s.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <a href="/lab-assistant" className="text-gray-500 hover:text-gray-700">
              <BookOpen size={20} />
            </a>
            <ChevronRight size={20} className="text-gray-400" />
            <span className="text-gray-600">Lịch thực hành</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={28} />
            </div>
            Lịch thực hành - {myLab.name}
          </h1>
          <p className="text-gray-600">Xem lịch học và chuẩn bị cho các buổi thực hành</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">Buổi sắp tới</p>
              <Clock size={24} className="text-blue-200" />
            </div>
            <p className="text-4xl font-bold">{upcomingSessions}</p>
            <p className="text-blue-100 text-sm mt-2">buổi trong tuần này</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Đã hoàn thành</p>
              <CheckCircle size={24} className="text-green-200" />
            </div>
            <p className="text-4xl font-bold">{completedSessions}</p>
            <p className="text-green-100 text-sm mt-2">buổi trong kỳ</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm">Phòng phụ trách</p>
              <MapPin size={24} className="text-purple-200" />
            </div>
            <p className="text-4xl font-bold">1</p>
            <p className="text-purple-100 text-sm mt-2">{myLab.name}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm">Cần bố trí vị trí</p>
              <AlertCircle size={24} className="text-orange-200" />
            </div>
            <p className="text-4xl font-bold">{needSeatsAssignment}</p>
            <p className="text-orange-100 text-sm mt-2">buổi chưa phân</p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'week'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'month'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tháng
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium text-gray-700 min-w-[200px] text-center">
                Tuần 16/12 - 22/12/2024
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Download size={18} />
              Xuất lịch
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {/* Upcoming Sessions */}
          {scheduleData.some(s => s.status === 'upcoming') && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" size={24} />
                Buổi sắp tới
              </h2>
              <div className="space-y-4">
                {scheduleData
                  .filter(session => session.status === 'upcoming')
                  .map(session => (
                    <div
                      key={session.id}
                      className="bg-white border-l-4 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition-all p-6"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                              {session.subjectCode}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                              {session.group}
                            </span>
                            {getStatusBadge(session.status)}
                            {session.seatsAssigned ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                                <CheckCircle size={12} />
                                Đã bố trí vị trí
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium flex items-center gap-1">
                                <AlertCircle size={12} />
                                Chưa bố trí
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {session.subject} - {session.session}
                          </h3>
                          <p className="text-gray-600 mb-3">{session.topic}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={16} className="text-gray-400" />
                              <span>{session.dayOfWeek}, {session.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} className="text-gray-400" />
                              <span>{session.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} className="text-gray-400" />
                              <span>{session.room}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users size={16} className="text-gray-400" />
                              <span>{session.students} sinh viên</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Giảng viên:</span> {session.instructor}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:w-48">
                          {!session.seatsAssigned ? (
                            <a
                              href="/lab-assistant/assign-seats"
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-center flex items-center justify-center gap-2"
                            >
                              <Grid size={16} />
                              Bố trí vị trí
                            </a>
                          ) : !session.attendanceDone ? (
                            <a
                              href="/lab-assistant/attendance"
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-center flex items-center justify-center gap-2"
                            >
                              <CheckCircle size={16} />
                              Điểm danh
                            </a>
                          ) : null}
                          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2">
                            <Eye size={16} />
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Completed Sessions */}
          {scheduleData.some(s => s.status === 'completed') && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                Buổi đã hoàn thành
              </h2>
              <div className="space-y-4">
                {scheduleData
                  .filter(session => session.status === 'completed')
                  .map(session => (
                    <div
                      key={session.id}
                      className="bg-white border-l-4 border-gray-300 rounded-lg shadow-sm p-6 opacity-75"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                              {session.subjectCode}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                              {session.group}
                            </span>
                            {getStatusBadge(session.status)}
                          </div>

                          <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {session.subject} - {session.session}
                          </h3>
                          <p className="text-gray-600 mb-3">{session.topic}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar size={16} className="text-gray-400" />
                              <span>{session.dayOfWeek}, {session.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} className="text-gray-400" />
                              <span>{session.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={16} className="text-gray-400" />
                              <span>{session.room}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users size={16} className="text-gray-400" />
                              <span>{session.students} sinh viên</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Giảng viên:</span> {session.instructor}
                            </p>
                          </div>
                        </div>

                        <button className="lg:self-start px-6 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium whitespace-nowrap flex items-center gap-2">
                          <Eye size={16} />
                          Xem báo cáo
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
