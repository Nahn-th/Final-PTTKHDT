import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Users, CheckCircle, AlertTriangle, Bell, Search, Menu, X, Clock, TrendingUp, MapPin, Calendar, Grid, LogOut, Home } from 'lucide-react';

// ==================== 1. MOCK API SERVICE ====================

const DB = {
  stats: [
    { icon: Calendar, label: 'Buổi TH hôm nay', value: '4', color: 'bg-blue-500', detail: 'buổi' },
    { icon: Users, label: 'Sinh viên', value: '152', color: 'bg-green-500', detail: 'tổng số SV' },
    { icon: CheckCircle, label: 'Đã phân vị trí', value: '3', color: 'bg-purple-500', detail: '/ 4 buổi' },
    { icon: AlertTriangle, label: 'Cấm thi', value: '5', color: 'bg-orange-500', detail: 'sinh viên' }
  ],
  todaySessions: [
    {
      id: 1, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', group: 'Nhóm 1',
      time: '14:00 - 16:00', room: 'A101', instructor: 'TS. Nguyễn Văn A',
      students: 38, status: 'upcoming', seatsAssigned: true, attendanceDone: false
    },
    {
      id: 2, subject: 'Lập trình Web', subjectCode: 'IT005', group: 'Nhóm 2',
      time: '08:00 - 10:00', room: 'A101', instructor: 'ThS. Hoàng Thị E',
      students: 35, status: 'completed', seatsAssigned: true, attendanceDone: true
    },
    {
      id: 3, subject: 'Cơ sở dữ liệu', subjectCode: 'IT002', group: 'Nhóm 2',
      time: '15:00 - 17:00', room: 'A101', instructor: 'ThS. Trần Thị B',
      students: 40, status: 'upcoming', seatsAssigned: true, attendanceDone: false
    },
    {
      id: 4, subject: 'Mạng máy tính', subjectCode: 'IT004', group: 'Nhóm 1',
      time: '08:00 - 10:00', room: 'A101', instructor: 'TS. Phạm Văn D',
      students: 30, status: 'upcoming', seatsAssigned: false, attendanceDone: false
    }
  ],
  recentActivities: [
    { id: 1, action: 'Bố trí vị trí ngồi', subject: 'IT001 - Nhóm 1', time: '1 giờ trước', type: 'seats' },
    { id: 2, action: 'Điểm danh hoàn tất', subject: 'IT005 - Nhóm 2', time: '2 giờ trước', type: 'attendance' },
    { id: 3, action: 'Cập nhật cấm thi', subject: 'SV: 21520045', time: '5 giờ trước', type: 'ban' },
    { id: 4, action: 'Bố trí vị trí ngồi', subject: 'IT002 - Nhóm 2', time: '1 ngày trước', type: 'seats' }
  ],
  bannedStudents: [
    { id: 1, code: '21520045', name: 'Nguyễn Văn X', reason: 'Vắng > 20%', sessions: '12/15', percentage: 80, subject: 'IT001' },
    { id: 2, code: '21520078', name: 'Trần Thị Y', reason: 'Vắng > 20%', sessions: '11/15', percentage: 73.3, subject: 'IT002' },
    { id: 3, code: '21520092', name: 'Lê Văn Z', reason: 'Vắng > 20%', sessions: '10/15', percentage: 66.7, subject: 'IT005' }
  ]
};

const api = {
  getDashboardData: async () => {
    await new Promise(r => setTimeout(r, 600)); // Simulate delay
    return DB;
  }
};

// ==================== 2. MAIN COMPONENT ====================

export default function CBPT_Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const res = await api.getDashboardData();
            setData(res);
        } catch (e) {
            console.error("Lỗi tải data", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const getStatusBadge = (status) => {
    const config = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sắp diễn ra' },
      ongoing: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đang diễn ra' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Hoàn thành' }
    };
    const c = config[status] || config.upcoming;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  // --- PHẦN BỊ THIẾU ĐÃ ĐƯỢC THÊM VÀO ĐÂY ---
  const menuItems = [
    { icon: Home, label: 'Dashboard', link: '/lab-assistant' },
    { icon: Calendar, label: 'Lịch trực', link: '/lab-assistant/schedule' },
    { icon: Grid, label: 'Bố trí chỗ ngồi', link: '/lab-assistant/assign-seats' },
    { icon: CheckCircle, label: 'Điểm danh', link: '/lab-assistant/attendance' },
    { icon: AlertTriangle, label: 'Cấm thi', link: '/lab-assistant/exam-ban' },
  ];
  // ------------------------------------------

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  const { stats, todaySessions, recentActivities, bannedStudents } = data;

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
                <Monitor className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-gray-800">IT Lab Staff</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* SỬ DỤNG BIẾN menuItems Ở ĐÂY */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Link 
                        key={index} 
                        to={item.link} 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                            // Highlight dòng đầu tiên (Dashboard)
                            window.location.pathname === item.link ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <Icon size={20} /> {item.label}
                    </Link>
                )
            })}
          </nav>

          <div className="p-4 border-t">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} /> Đăng xuất
            </Link>
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
              <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Cán bộ PT Dashboard</h2>
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
                  <p className="text-sm font-medium text-gray-800">Lê Văn C</p>
                  <p className="text-xs text-gray-500">Cán bộ PT</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-sm">
                  CB
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Xin chào, Lê Văn C 👋</h1>
            <p className="text-gray-500 mt-1">Phòng máy phụ trách hôm nay: <strong>A101</strong></p>
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
                    { icon: Calendar, label: 'Xem lịch TH', link: '/lab-assistant/schedule', color: 'text-blue-600' },
                    { icon: Grid, label: 'Bố trí chỗ ngồi', link: '/lab-assistant/assign-seats', color: 'text-green-600' },
                    { icon: CheckCircle, label: 'Điểm danh', link: '/lab-assistant/attendance', color: 'text-purple-600' },
                    { icon: AlertTriangle, label: 'Xử lý cấm thi', link: '/lab-assistant/exam-ban', color: 'text-orange-600' }
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
            
            {/* Left Column: Today Sessions */}
            <div className="xl:col-span-2 space-y-6">
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Clock size={20} className="text-blue-600" /> Lịch trực hôm nay
                    </h3>
                 </div>
                 <div className="p-4 space-y-4">
                    {todaySessions.map((session) => (
                        <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">{session.subjectCode}</span>
                                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{session.group}</span>
                                        {getStatusBadge(session.status)}
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">{session.subject}</h4>
                                    
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
                                        <span className="flex items-center gap-1"><Clock size={14}/> {session.time}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14}/> {session.room}</span>
                                        <span className="flex items-center gap-1"><Users size={14}/> {session.students} SV</span>
                                    </div>

                                    <div className="mt-3 flex gap-3 text-xs">
                                        {session.seatsAssigned ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Đã xếp chỗ</span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={12}/> Chưa xếp chỗ</span>
                                        )}
                                        {session.attendanceDone && (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Đã điểm danh</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-2 min-w-[140px]">
                                    {!session.seatsAssigned && (
                                        <Link to="/lab-assistant/assign-seats" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium">
                                            Xếp chỗ ngay
                                        </Link>
                                    )}
                                    {!session.attendanceDone && session.status !== 'completed' && (
                                        <Link to="/lab-assistant/attendance" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium">
                                            Điểm danh
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* Right Column: Activities & Bans */}
            <div className="space-y-6">
                
                {/* Recent Activities */}
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
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-blue-500`}></div>
                                    <p className="text-xs text-gray-400 mb-0.5">{activity.time}</p>
                                    <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{activity.subject}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Banned Students */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-600" /> SV Cấm thi
                        </h3>
                    </div>
                    <div className="p-4 space-y-3">
                        {bannedStudents.map(student => (
                            <div key={student.id} className="bg-red-50 border border-red-100 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{student.name}</p>
                                        <p className="text-xs text-gray-500">{student.code}</p>
                                    </div>
                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded">Cấm thi</span>
                                </div>
                                <p className="text-xs text-red-700 mt-2">
                                    {student.subject}: {student.sessions} ({student.percentage}%)
                                </p>
                            </div>
                        ))}
                        <Link to="/lab-assistant/exam-ban" className="block text-center text-sm text-blue-600 hover:underline mt-2">Xem tất cả</Link>
                    </div>
                </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
