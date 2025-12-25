import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Cần cài react-router-dom
import { Calendar, Users, CheckCircle, FileText, Bell, Search, Menu, X, Clock, BookOpen, Award, TrendingUp, LogOut, Home } from 'lucide-react';
import '../../index.css';

// ==================== 1. MOCK API SERVICE ====================

const DB = {
  stats: [
    { icon: Calendar, label: 'Lịch TH tuần này', value: '6', color: 'bg-blue-500', detail: 'buổi' },
    { icon: Users, label: 'Tổng sinh viên', value: '152', color: 'bg-green-500', detail: '4 nhóm' },
    { icon: CheckCircle, label: 'Đã điểm danh', value: '94.5%', color: 'bg-purple-500', detail: 'tỷ lệ trung bình' },
    { icon: FileText, label: 'Giờ giảng', value: '24', color: 'bg-orange-500', detail: '/ 40 giờ trong kỳ' }
  ],
  upcomingSessions: [
    {
      id: 1, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', group: 'Nhóm 1',
      date: '23/12/2024', dayOfWeek: 'Thứ 2', time: '14:00 - 16:00', room: 'A101',
      session: 'Buổi 6', topic: 'Kế thừa và Đa hình trong Java', students: 38, status: 'upcoming'
    },
    {
      id: 2, subject: 'Lập trình Web', subjectCode: 'IT005', group: 'Nhóm 2',
      date: '24/12/2024', dayOfWeek: 'Thứ 3', time: '08:00 - 10:00', room: 'B203',
      session: 'Buổi 7', topic: 'React Hooks và State Management', students: 35, status: 'upcoming'
    },
    {
      id: 3, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', group: 'Nhóm 2',
      date: '25/12/2024', dayOfWeek: 'Thứ 4', time: '15:00 - 17:00', room: 'C305',
      session: 'Buổi 6', topic: 'Kế thừa và Đa hình trong Java', students: 36, status: 'upcoming'
    }
  ],
  recentActivities: [
    { id: 1, action: 'Điểm danh hoàn tất', subject: 'IT001 - Nhóm 1', time: '2 giờ trước', type: 'attendance' },
    { id: 2, action: 'Cập nhật ghi chú', subject: 'IT005 - Nhóm 2', time: '1 ngày trước', type: 'note' },
    { id: 3, action: 'Điểm danh hoàn tất', subject: 'IT001 - Nhóm 2', time: '2 ngày trước', type: 'attendance' },
    { id: 4, action: 'Lịch TH mới', subject: 'IT005 - Nhóm 1', time: '3 ngày trước', type: 'schedule' }
  ],
  myGroups: [
    { id: 1, subject: 'IT001 - Lập trình OOP', group: 'Nhóm 1', students: 38, sessions: 12, completed: 5, attendance: 95.2 },
    { id: 2, subject: 'IT001 - Lập trình OOP', group: 'Nhóm 2', students: 36, sessions: 12, completed: 5, attendance: 93.1 },
    { id: 3, subject: 'IT005 - Lập trình Web', group: 'Nhóm 1', students: 35, sessions: 12, completed: 6, attendance: 96.8 },
    { id: 4, subject: 'IT005 - Lập trình Web', group: 'Nhóm 2', students: 43, sessions: 12, completed: 6, attendance: 92.5 }
  ]
};

const api = {
  getDashboardData: async () => {
    const response = await fetch('http://localhost:8000/api/instructor/dashboard/stats/', {
      credentials: 'include'
    });
    return await response.json();
  },
  
  getUpcomingSessions: async () => {
    const response = await fetch('http://localhost:8000/api/instructor/dashboard/upcoming_sessions/', {
      credentials: 'include'
    });
    return await response.json();
  },
  
  getMyGroups: async () => {
    const response = await fetch('http://localhost:8000/api/instructor/dashboard/my_groups/', {
      credentials: 'include'
    });
    return await response.json();
  }
};

// ==================== 2. MAIN COMPONENT ====================

export default function CBGD_Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Data
  useEffect(() => {
  const loadData = async () => {
    try {
      const [stats, sessions, groups] = await Promise.all([
        api.getDashboardData(),
        api.getUpcomingSessions(),
        api.getMyGroups()
      ]);
      
      setData({
        stats: [
          { icon: Calendar, label: 'Lịch TH tuần này', value: stats.upcoming_sessions },
          { icon: Users, label: 'Tổng sinh viên', value: stats.total_students },
          // ... format lại theo UI
        ],
        upcomingSessions: sessions.map(s => ({
          id: s.id,
          subject: s.nhom_info.mon_hoc.ten_mon,
          subjectCode: s.nhom_info.mon_hoc.ma_mon,
          group: s.nhom_info.ten_nhom,
          date: s.ngay_thuc_hien_formatted,
          dayOfWeek: s.thu,
          time: s.thoi_gian,
          room: s.phong_may_info.ma_phong,
          // ... map các field khác
        })),
        myGroups: groups // format tương tự
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);
  // Menu items cho Sidebar
  const menuItems = [
    { icon: Home, label: 'Dashboard', link: '/' },
    { icon: Calendar, label: 'Lịch dạy', link: '/instructor/schedule' },
    { icon: CheckCircle, label: 'Điểm danh', link: '/instructor/attendance' },
    { icon: Users, label: 'Quản lý nhóm', link: '/instructor/groups' },
    { icon: FileText, label: 'Báo cáo', link: '/instructor/report' },
  ];

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  const { stats, upcomingSessions, recentActivities, myGroups } = data;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-gray-800">IT Instructor</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Link 
                        key={index} 
                        to={item.link} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                            index === 0 ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Icon size={20} /> {item.label}
                    </Link>
                )
            })}
          </nav>

          <div className="p-4 border-t">
            <button className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} /> Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Giảng viên Dashboard</h2>
            </div>

            <div className="flex items-center space-x-4">
               <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
                <Search size={18} className="text-gray-400 mr-2" />
                <input type="text" placeholder="Tìm kiếm..." className="bg-transparent outline-none text-sm w-full" />
              </div>

              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-800">TS. Nguyễn Văn A</p>
                  <p className="text-xs text-gray-500">Giảng viên</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-sm">
                  NV
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Xin chào, TS. Nguyễn Văn A 👋</h1>
            <p className="text-gray-500 mt-1">Chúc thầy một ngày làm việc hiệu quả!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{stat.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Calendar, label: 'Xem lịch TH', link: '/instructor/schedule', color: 'text-blue-600' },
                    { icon: CheckCircle, label: 'Điểm danh', link: '/instructor/attendance', color: 'text-green-600' },
                    { icon: Users, label: 'Nhóm của tôi', link: '/instructor/groups', color: 'text-purple-600' },
                    { icon: FileText, label: 'Báo cáo', link: '/instructor/report', color: 'text-orange-600' }
                ].map((action, idx) => {
                    const Icon = action.icon;
                    return (
                        <Link key={idx} to={action.link} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group text-center block">
                            <Icon className={`mx-auto mb-3 ${action.color} group-hover:scale-110 transition-transform`} size={32} />
                            <p className="font-medium text-gray-800">{action.label}</p>
                        </Link>
                    )
                })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Column: Upcoming Sessions */}
            <div className="xl:col-span-2 space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={20} className="text-blue-600" /> Lịch dạy sắp tới
                    </h3>
                    <Link to="/instructor/schedule" className="text-sm text-blue-600 hover:underline">Xem tất cả</Link>
                 </div>
                 <div className="p-4 space-y-4">
                    {upcomingSessions.map((session) => (
                        <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">{session.subjectCode}</span>
                                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{session.group}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">{session.subject} <span className="font-normal text-gray-500">- {session.session}</span></h4>
                                    <p className="text-sm text-gray-600 mb-3 italic">{session.topic}</p>
                                    
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><Calendar size={14}/> {session.dayOfWeek}, {session.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={14}/> {session.time}</span>
                                        <span className="flex items-center gap-1"><Users size={14}/> Phòng {session.room} ({session.students} SV)</span>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-2 min-w-[120px]">
                                    <Link to="/instructor/attendance" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium">
                                        Điểm danh
                                    </Link>
                                    <Link to="/instructor/schedule" className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-center text-sm font-medium">
                                        Chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
               </div>

               {/* My Groups Overview */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Users size={20} className="text-green-600" /> Nhóm thực hành của tôi
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myGroups.map((group) => (
                            <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all bg-gray-50">
                                <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{group.subject}</h4>
                                <p className="text-xs text-gray-500 mb-3">{group.group}</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Sĩ số:</span>
                                        <span className="font-medium text-gray-800">{group.students} SV</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tiến độ:</span>
                                        <span className="font-medium text-gray-800">{group.completed}/{group.sessions} buổi</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${(group.completed/group.sessions)*100}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
               </div>
            </div>

            {/* Right Column: Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp size={20} className="text-purple-600" /> Hoạt động gần đây
                    </h3>
                </div>
                <div className="p-6">
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                        {recentActivities.map((activity, idx) => (
                            <div key={activity.id} className="relative">
                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm
                                    ${activity.type === 'attendance' ? 'bg-green-500' : 
                                      activity.type === 'note' ? 'bg-orange-500' : 'bg-blue-500'}
                                `}></div>
                                <p className="text-xs text-gray-400 mb-0.5">{activity.time}</p>
                                <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
                                <p className="text-xs text-gray-500 mt-1">{activity.subject}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
