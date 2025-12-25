import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Users, Award, Bell, Search, Menu, X, Clock, TrendingUp, FileText, Settings, ClipboardList } from 'lucide-react';

// ==================== DATA & API FUNCTIONS ====================
// TODO: Replace these with actual API calls

const fetchDashboardStats = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/student/dashboard/stats');
  // return response.json();
  
  return {
    totalSubjects: 12,
    totalStudents: 245,
    totalRooms: 8,
    weekSessions: 24
  };
};

const fetchUpcomingSessions = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/student/sessions/upcoming');
  // return response.json();
  
  return [
    { 
      id: 1, 
      subject: 'Lập trình Web', 
      room: 'Phòng A101 - Máy 05', 
      time: '14:00 - 16:00', 
      date: '23/12/2024', 
      status: 'upcoming', 
      teacher: 'TS. Nguyễn Văn A' 
    },
    { 
      id: 2, 
      subject: 'Cơ sở dữ liệu', 
      room: 'Phòng B203 - Máy 12', 
      time: '08:00 - 10:00', 
      date: '24/12/2024', 
      status: 'upcoming', 
      teacher: 'ThS. Trần Thị B' 
    },
    { 
      id: 3, 
      subject: 'Mạng máy tính', 
      room: 'Phòng C305 - Máy 20', 
      time: '15:00 - 17:00', 
      date: '24/12/2024', 
      status: 'scheduled', 
      teacher: 'TS. Lê Văn C' 
    }
  ];
};

const fetchRecentActivities = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/student/activities/recent');
  // return response.json();
  
  return [
    { id: 1, action: 'Điểm danh', subject: 'Lập trình hướng đối tượng - Nhóm 2', time: '2 giờ trước', type: 'attendance' },
    { id: 2, action: 'Phân máy mới', subject: 'Phòng A101 - Nhóm 5', time: '5 giờ trước', type: 'assignment' },
    { id: 3, action: 'Thay đổi lịch', subject: 'Cấu trúc dữ liệu - Buổi 8', time: '1 ngày trước', type: 'schedule' },
    { id: 4, action: 'Báo cáo máy hỏng', subject: 'Phòng B203 - Máy 15', time: '2 ngày trước', type: 'report' }
  ];
};

// ==================== CUSTOM HOOKS ====================

const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, sessionsData, activitiesData] = await Promise.all([
          fetchDashboardStats(),
          fetchUpcomingSessions(),
          fetchRecentActivities()
        ]);
        
        setStats(statsData);
        setUpcomingSessions(sessionsData);
        setRecentActivities(activitiesData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { stats, upcomingSessions, recentActivities, loading, error };
};

// ==================== MAIN COMPONENT ====================

export default function SV_home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  const { stats, upcomingSessions, recentActivities, loading, error } = useDashboardData();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Có lỗi xảy ra: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const statsConfig = [
    { icon: BookOpen, label: 'Môn học TH', value: stats?.totalSubjects || '0', color: 'bg-blue-500' },
    { icon: Users, label: 'Sinh viên', value: stats?.totalStudents || '0', color: 'bg-green-500' },
    { icon: Calendar, label: 'Phòng máy', value: stats?.totalRooms || '0', color: 'bg-purple-500' },
    { icon: Award, label: 'Buổi TH tuần này', value: stats?.weekSessions || '0', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">IT Practice</h1>
                  <p className="text-xs text-gray-500">Khoa CNTT</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>

              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={22} className="text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  NV
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Xin chào, Nguyễn Văn A 👋</h2>
          <p className="text-gray-600">Hôm nay là thứ Hai, ngày 22 tháng 12 năm 2024 • Vai trò: Sinh viên</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <Calendar className="mr-2 text-blue-600" size={24} />
                Lịch thực hành sắp tới
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả →
              </button>
            </div>

            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">{session.subject}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {session.time}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          {session.date}
                        </span>
                        <span className="flex items-center">
                          <Users size={16} className="mr-1" />
                          {session.room}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">GV: {session.teacher}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === 'upcoming'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {session.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã lên lịch'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="mr-2 text-purple-600" size={24} />
              Hoạt động gần đây
            </h3>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{activity.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-center backdrop-blur-sm">
              <Calendar className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">Lịch TH</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-center backdrop-blur-sm">
              <Users className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">Điểm danh</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-center backdrop-blur-sm">
              <BookOpen className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">Phòng máy</span>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-center backdrop-blur-sm">
              <FileText className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">Báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
