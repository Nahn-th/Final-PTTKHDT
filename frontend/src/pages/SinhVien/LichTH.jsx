import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, ChevronRight, ChevronLeft, Filter, Download, CheckCircle, XCircle, AlertCircle, Users, Award } from 'lucide-react';

// ==================== DATA & API FUNCTIONS ====================
// TODO: Replace these with actual API calls

const fetchSubjects = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/student/subjects');
  // return response.json();
  
  return [
    { id: 1, code: 'IT002', name: 'Cơ sở dữ liệu', color: 'blue' },
    { id: 2, code: 'IT005', name: 'Lập trình Web', color: 'purple' },
    { id: 3, code: 'IT001', name: 'Lập trình OOP', color: 'green' },
    { id: 4, code: 'IT004', name: 'Mạng máy tính', color: 'orange' }
  ];
};

const fetchScheduleData = async (subjectFilter = 'all', weekOffset = 0) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/student/schedule?subject=${subjectFilter}&week=${weekOffset}`);
  // return response.json();
  
  return [
    {
      id: 1,
      subject: 'Cơ sở dữ liệu',
      subjectCode: 'IT002',
      color: 'blue',
      group: 'Nhóm 1',
      date: '2024-12-23',
      dayOfWeek: 'Thứ 2',
      time: '14:00 - 16:00',
      room: 'A102',
      instructor: 'ThS. Trần Thị B',
      session: 'Buổi 5',
      topic: 'Thiết kế cơ sở dữ liệu quan hệ',
      status: 'upcoming',
      myComputer: 'Máy 15',
      attendanceStatus: null
    },
    {
      id: 2,
      subject: 'Lập trình Web',
      subjectCode: 'IT005',
      color: 'purple',
      group: 'Nhóm 1',
      date: '2024-12-24',
      dayOfWeek: 'Thứ 3',
      time: '08:00 - 10:00',
      room: 'B203',
      instructor: 'ThS. Hoàng Thị E',
      session: 'Buổi 7',
      topic: 'React Hooks và State Management',
      status: 'upcoming',
      myComputer: 'Máy 08',
      attendanceStatus: null
    },
    {
      id: 3,
      subject: 'Lập trình OOP',
      subjectCode: 'IT001',
      color: 'green',
      group: 'Nhóm 3',
      date: '2024-12-25',
      dayOfWeek: 'Thứ 4',
      time: '15:00 - 17:00',
      room: 'C305',
      instructor: 'TS. Nguyễn Văn A',
      session: 'Buổi 6',
      topic: 'Kế thừa và Đa hình trong Java',
      status: 'upcoming',
      myComputer: 'Máy 22',
      attendanceStatus: null
    },
    {
      id: 4,
      subject: 'Cơ sở dữ liệu',
      subjectCode: 'IT002',
      color: 'blue',
      group: 'Nhóm 1',
      date: '2024-12-20',
      dayOfWeek: 'Thứ 6',
      time: '14:00 - 16:00',
      room: 'A102',
      instructor: 'ThS. Trần Thị B',
      session: 'Buổi 4',
      topic: 'SQL và truy vấn nâng cao',
      status: 'completed',
      myComputer: 'Máy 15',
      attendanceStatus: 'present'
    },
    {
      id: 5,
      subject: 'Mạng máy tính',
      subjectCode: 'IT004',
      color: 'orange',
      group: 'Nhóm 2',
      date: '2024-12-19',
      dayOfWeek: 'Thứ 5',
      time: '14:00 - 16:00',
      room: 'C305',
      instructor: 'TS. Phạm Văn D',
      session: 'Buổi 3',
      topic: 'Cấu hình Router và Switch',
      status: 'completed',
      myComputer: 'Máy 10',
      attendanceStatus: 'present'
    },
    {
      id: 6,
      subject: 'Lập trình Web',
      subjectCode: 'IT005',
      color: 'purple',
      group: 'Nhóm 1',
      date: '2024-12-17',
      dayOfWeek: 'Thứ 3',
      time: '08:00 - 10:00',
      room: 'B203',
      instructor: 'ThS. Hoàng Thị E',
      session: 'Buổi 6',
      topic: 'Component và Props trong React',
      status: 'completed',
      myComputer: 'Máy 08',
      attendanceStatus: 'absent'
    }
  ];
};

const exportSchedule = async (scheduleData, format = 'pdf') => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/student/schedule/export', {
  //   method: 'POST',
  //   body: JSON.stringify({ data: scheduleData, format })
  // });
  // return response.blob();
  
  console.log('Exporting schedule:', format);
  alert(`Xuất lịch ${format.toUpperCase()} - Chức năng sẽ được tích hợp với backend`);
};

// ==================== CUSTOM HOOKS ====================

const useScheduleData = () => {
  const [subjects, setSubjects] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSubject, setFilterSubject] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [subjectsData, scheduleDataResponse] = await Promise.all([
          fetchSubjects(),
          fetchScheduleData(filterSubject, currentWeek)
        ]);
        
        setSubjects(subjectsData);
        setScheduleData(scheduleDataResponse);
      } catch (err) {
        setError(err.message);
        console.error('Error loading schedule data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filterSubject, currentWeek]);

  const refreshSchedule = async () => {
    try {
      const scheduleDataResponse = await fetchScheduleData(filterSubject, currentWeek);
      setScheduleData(scheduleDataResponse);
    } catch (err) {
      setError(err.message);
    }
  };

  return { 
    subjects, 
    scheduleData, 
    loading, 
    error,
    filterSubject,
    setFilterSubject,
    currentWeek,
    setCurrentWeek,
    refreshSchedule
  };
};

// ==================== UTILITY FUNCTIONS ====================

const getColorClasses = (color, type = 'bg') => {
  const colors = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', gradient: 'from-blue-500 to-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', gradient: 'from-purple-500 to-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', gradient: 'from-green-500 to-green-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', gradient: 'from-orange-500 to-orange-600' }
  };
  return colors[color] || colors.blue;
};

const getStatusBadge = (status, attendanceStatus) => {
  if (status === 'completed') {
    if (attendanceStatus === 'present') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle size={14} />
          Đã điểm danh
        </span>
      );
    } else if (attendanceStatus === 'absent') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
          <XCircle size={14} />
          Vắng mặt
        </span>
      );
    }
  }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
      <Clock size={14} />
      Sắp diễn ra
    </span>
  );
};

// ==================== MAIN COMPONENT ====================

export default function LichTH() {
  const [viewMode, setViewMode] = useState('week');
  
  const { 
    subjects, 
    scheduleData, 
    loading, 
    error,
    filterSubject,
    setFilterSubject,
    currentWeek,
    setCurrentWeek,
    refreshSchedule
  } = useScheduleData();

  const handleExport = () => {
    exportSchedule(filteredSchedule, 'pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Có lỗi xảy ra: {error}</p>
          <button 
            onClick={refreshSchedule}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const filteredSchedule = filterSubject === 'all' 
    ? scheduleData 
    : scheduleData.filter(item => item.subjectCode === filterSubject);

  const upcomingSessions = filteredSchedule.filter(s => s.status === 'upcoming').length;
  const completedSessions = filteredSchedule.filter(s => s.status === 'completed').length;
  const attendanceRate = completedSessions > 0 
    ? ((filteredSchedule.filter(s => s.attendanceStatus === 'present').length / completedSessions) * 100).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <a href="/" className="text-gray-500 hover:text-gray-700">
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
          <p className="text-gray-600">Xem lịch học, phòng máy và vị trí máy được phân công</p>
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
              <p className="text-purple-100 text-sm">Tỷ lệ điểm danh</p>
              <Award size={24} className="text-purple-200" />
            </div>
            <p className="text-4xl font-bold">{attendanceRate}%</p>
            <p className="text-purple-100 text-sm mt-2">có mặt/tổng buổi</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm">Môn đang học</p>
              <BookOpen size={24} className="text-orange-200" />
            </div>
            <p className="text-4xl font-bold">{subjects.length}</p>
            <p className="text-orange-100 text-sm mt-2">môn thực hành</p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả môn học</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.code}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>

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
              <button 
                onClick={() => setCurrentWeek(prev => prev - 1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium text-gray-700 min-w-[200px] text-center">
                Tuần 16/12 - 22/12/2024
              </span>
              <button 
                onClick={() => setCurrentWeek(prev => prev + 1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Xuất lịch
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {/* Upcoming Sessions */}
          {filteredSchedule.some(s => s.status === 'upcoming') && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" size={24} />
                Buổi sắp tới
              </h2>
              <div className="space-y-4">
                {filteredSchedule
                  .filter(session => session.status === 'upcoming')
                  .map(session => {
                    const colorClasses = getColorClasses(session.color);
                    return (
                      <div
                        key={session.id}
                        className={`bg-white border-l-4 ${colorClasses.border} rounded-lg shadow-sm hover:shadow-md transition-all p-6`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className={`px-3 py-1 ${colorClasses.bg} ${colorClasses.text} rounded-lg text-sm font-semibold`}>
                                {session.subjectCode}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                {session.group}
                              </span>
                              {getStatusBadge(session.status, session.attendanceStatus)}
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
                                <span>Phòng {session.room}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <User size={16} className="text-gray-400" />
                                <span>{session.instructor}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-3 lg:items-end">
                            <div className={`px-6 py-4 bg-gradient-to-br ${colorClasses.gradient} rounded-xl text-white text-center min-w-[120px]`}>
                              <p className="text-xs opacity-90 mb-1">Vị trí của bạn</p>
                              <p className="text-2xl font-bold">{session.myComputer}</p>
                            </div>
                            <button className="px-6 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium whitespace-nowrap">
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Completed Sessions */}
          {filteredSchedule.some(s => s.status === 'completed') && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={24} />
                Buổi đã hoàn thành
              </h2>
              <div className="space-y-4">
                {filteredSchedule
                  .filter(session => session.status === 'completed')
                  .map(session => {
                    const colorClasses = getColorClasses(session.color);
                    return (
                      <div
                        key={session.id}
                        className="bg-white border-l-4 border-gray-300 rounded-lg shadow-sm p-6 opacity-75 hover:opacity-100 transition-all"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className={`px-3 py-1 ${colorClasses.bg} ${colorClasses.text} rounded-lg text-sm font-semibold`}>
                                {session.subjectCode}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                {session.group}
                              </span>
                              {getStatusBadge(session.status, session.attendanceStatus)}
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
                                <span>Phòng {session.room}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <User size={16} className="text-gray-400" />
                                <span>{session.instructor}</span>
                              </div>
                            </div>
                          </div>

                          <button className="lg:self-start px-6 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium whitespace-nowrap">
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredSchedule.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Không có lịch thực hành</h3>
            <p className="text-gray-600 mb-6">
              {filterSubject === 'all' 
                ? 'Bạn chưa có lịch thực hành nào trong khoảng thời gian này.'
                : 'Không có lịch thực hành cho môn học được chọn.'}
            </p>
            <a
              href="/dang-ky-mon"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <BookOpen size={18} />
              Đăng ký môn học
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
