import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, ChevronRight, ChevronLeft, Filter, Download, Eye, CheckCircle, AlertCircle, FileText, Loader2 } from 'lucide-react';

// ==================== 1. MOCK API SERVICE ====================

const DB = {
  subjects: [
    { id: 'IT001', name: 'Lập trình OOP', color: 'blue' },
    { id: 'IT005', name: 'Lập trình Web', color: 'purple' }
  ],
  schedules: [
    {
      id: 1, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', color: 'blue', group: 'Nhóm 1',
      date: '2024-12-23', dayOfWeek: 'Thứ 2', time: '14:00 - 16:00', room: 'A101',
      session: 'Buổi 6', topic: 'Kế thừa và Đa hình trong Java', status: 'upcoming',
      students: 38, labAssistant: 'Lê Văn C'
    },
    {
      id: 2, subject: 'Lập trình Web', subjectCode: 'IT005', color: 'purple', group: 'Nhóm 2',
      date: '2024-12-24', dayOfWeek: 'Thứ 3', time: '08:00 - 10:00', room: 'B203',
      session: 'Buổi 7', topic: 'React Hooks và State Management', status: 'upcoming',
      students: 35, labAssistant: 'Phạm Thị D'
    },
    {
      id: 3, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', color: 'blue', group: 'Nhóm 2',
      date: '2024-12-25', dayOfWeek: 'Thứ 4', time: '15:00 - 17:00', room: 'C305',
      session: 'Buổi 6', topic: 'Kế thừa và Đa hình trong Java', status: 'upcoming',
      students: 36, labAssistant: 'Lê Văn C'
    },
    {
      id: 4, subject: 'Lập trình Web', subjectCode: 'IT005', color: 'purple', group: 'Nhóm 1',
      date: '2024-12-26', dayOfWeek: 'Thứ 5', time: '08:00 - 10:00', room: 'B203',
      session: 'Buổi 7', topic: 'React Hooks và State Management', status: 'upcoming',
      students: 43, labAssistant: 'Phạm Thị D'
    },
    {
      id: 5, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', color: 'blue', group: 'Nhóm 1',
      date: '2024-12-20', dayOfWeek: 'Thứ 6', time: '14:00 - 16:00', room: 'A101',
      session: 'Buổi 5', topic: 'Abstract Class và Interface', status: 'completed',
      students: 38, labAssistant: 'Lê Văn C', attendanceRate: 94.7, attended: 36, absent: 2
    },
    {
      id: 6, subject: 'Lập trình Web', subjectCode: 'IT005', color: 'purple', group: 'Nhóm 2',
      date: '2024-12-19', dayOfWeek: 'Thứ 5', time: '08:00 - 10:00', room: 'B203',
      session: 'Buổi 6', topic: 'Component và Props trong React', status: 'completed',
      students: 35, labAssistant: 'Phạm Thị D', attendanceRate: 97.1, attended: 34, absent: 1
    }
  ]
};

const api = {
  getScheduleData: async (week) => {
    // Tính toán date range từ week number
    const today = new Date();
    const from_date = new Date(today);
    from_date.setDate(today.getDate() - today.getDay() + (week - currentWeek) * 7);
    const to_date = new Date(from_date);
    to_date.setDate(from_date.getDate() + 6);
    
    const [subjects, schedules] = await Promise.all([
      fetch('http://localhost:8000/api/instructor/schedules/subjects/', {
        credentials: 'include'
      }).then(r => r.json()),
      
      fetch(`http://localhost:8000/api/instructor/schedules/?from_date=${from_date.toISOString().split('T')[0]}&to_date=${to_date.toISOString().split('T')[0]}`, {
        credentials: 'include'
      }).then(r => r.json())
    ]);
    
    return {
      subjects: subjects.map(s => ({
        id: s.mon_hoc__ma_mon,
        name: s.mon_hoc__ten_mon,
        color: 'blue' // Có thể hard-code hoặc generate
      })),
      schedules: schedules.results.map(s => ({
        id: s.id,
        subject: s.nhom_info.mon_hoc.ten_mon,
        subjectCode: s.nhom_info.mon_hoc.ma_mon,
        // ... format các field
      }))
    };
  }
};
// ==================== 2. HELPER COMPONENTS & FUNCTIONS ====================

const getColorClasses = (color) => {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500', icon: 'text-blue-500' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500', icon: 'text-purple-500' }
  };
  return colors[color] || colors.blue;
};

const StatusBadge = ({ status, attendanceRate }) => {
  if (status === 'completed') {
    const isHigh = attendanceRate >= 90;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
        isHigh ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {isHigh ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
        Hoàn thành ({attendanceRate}%)
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

// ==================== 3. MAIN COMPONENT ====================

export default function XemLichTH() {
  const [currentWeek, setCurrentWeek] = useState(5);
  const [viewMode, setViewMode] = useState('week');
  const [filterSubject, setFilterSubject] = useState('all');
  
  const [data, setData] = useState({ subjects: [], schedules: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.getScheduleData(currentWeek);
            setData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [currentWeek]); // Reload khi đổi tuần

  // --- Filter Logic ---
  const filteredSchedule = filterSubject === 'all' 
    ? data.schedules 
    : data.schedules.filter(item => item.subjectCode === filterSubject);

  const upcomingCount = filteredSchedule.filter(s => s.status === 'upcoming').length;
  const completedCount = filteredSchedule.filter(s => s.status === 'completed').length;
  
  // Tính tổng sinh viên trung bình
  const totalStudents = filteredSchedule.length > 0 
    ? Math.round(filteredSchedule.reduce((sum, s) => sum + (s.students || 0), 0) / filteredSchedule.length) 
    : 0;

  if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <a href="/instructor" className="text-gray-500 hover:text-gray-700">
              <BookOpen size={20} />
            </a>
            <ChevronRight size={20} className="text-gray-400" />
            <span className="text-gray-600">Lịch thực hành</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={28} />
            </div>
            Lịch thực hành của tôi
          </h1>
          <p className="text-gray-600">Xem lịch giảng dạy, phòng máy và cán bộ phụ trách</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">Buổi sắp tới</p>
              <Clock size={24} className="text-blue-200" />
            </div>
            <p className="text-4xl font-bold">{upcomingCount}</p>
            <p className="text-blue-100 text-sm mt-2">buổi trong tuần này</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Đã hoàn thành</p>
              <CheckCircle size={24} className="text-green-200" />
            </div>
            <p className="text-4xl font-bold">{completedCount}</p>
            <p className="text-green-100 text-sm mt-2">buổi trong kỳ</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm">TB Sinh viên</p>
              <Users size={24} className="text-purple-200" />
            </div>
            <p className="text-4xl font-bold">{totalStudents}</p>
            <p className="text-purple-100 text-sm mt-2">/ buổi</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm">Môn giảng dạy</p>
              <BookOpen size={24} className="text-orange-200" />
            </div>
            <p className="text-4xl font-bold">{data.subjects.length}</p>
            <p className="text-orange-100 text-sm mt-2">môn thực hành</p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-4 z-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Tất cả môn học</option>
                {data.subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.id} - {subject.name}
                  </option>
                ))}
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
                    viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tuần
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
                    viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tháng
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1">
              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setCurrentWeek(c => Math.max(1, c - 1))}>
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <span className="font-medium text-gray-700 min-w-[180px] text-center text-sm">
                Tuần 16/12 - 22/12/2024
              </span>
              <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors" onClick={() => setCurrentWeek(c => c + 1)}>
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
              <Download size={16} />
              Xuất lịch
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-8">
          
          {/* Upcoming Sessions */}
          {filteredSchedule.some(s => s.status === 'upcoming') && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" size={20} />
                Buổi sắp tới
              </h2>
              <div className="space-y-4">
                {filteredSchedule
                  .filter(session => session.status === 'upcoming')
                  .map(session => (
                    <ScheduleCard key={session.id} session={session} />
                  ))}
              </div>
            </div>
          )}

          {/* Completed Sessions */}
          {filteredSchedule.some(s => s.status === 'completed') && (
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                Đã hoàn thành
              </h2>
              <div className="space-y-4">
                {filteredSchedule
                  .filter(session => session.status === 'completed')
                  .map(session => (
                    <ScheduleCard key={session.id} session={session} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== 4. SUB-COMPONENT ====================

function ScheduleCard({ session }) {
    const colorClasses = getColorClasses(session.color);
    
    return (
        <div className={`bg-white border-l-4 ${colorClasses.border} rounded-lg shadow-sm hover:shadow-md transition-all p-5`}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 ${colorClasses.bg} ${colorClasses.text} rounded text-xs font-bold uppercase`}>
                            {session.subjectCode}
                        </span>
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {session.group}
                        </span>
                        <StatusBadge status={session.status} attendanceRate={session.attendanceRate} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {session.subject} <span className="font-normal text-gray-500">- {session.session}</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 italic">{session.topic}</p>

                    {/* Meta Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
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
                            <span>Phòng {session.room}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users size={16} className="text-gray-400" />
                            <span>{session.students} SV</span>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>Cán bộ trực: <span className="font-medium text-gray-700">{session.labAssistant}</span></span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 min-w-[140px]">
                    {session.status === 'upcoming' ? (
                        <a href="/instructor/attendance" className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all text-center text-sm font-medium">
                            Điểm danh
                        </a>
                    ) : (
                        <button className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-center text-sm font-medium flex items-center justify-center gap-2">
                            <FileText size={14} /> Xem báo cáo
                        </button>
                    )}
                    <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-center text-sm font-medium flex items-center justify-center gap-2">
                        <Eye size={14} /> Chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}
