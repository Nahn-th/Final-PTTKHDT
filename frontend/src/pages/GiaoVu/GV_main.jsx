import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Users, Calendar, UserCheck, FileText, Bell, Search, Menu, X, Clock, TrendingUp, AlertCircle, CheckCircle, BookOpen, Settings, LogOut, Home } from 'lucide-react';

export default function GV_Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(5);

  // --- Dữ liệu Mock ---
  const stats = [
    { icon: Users, label: 'Tổng nhóm TH', value: '48', color: 'bg-blue-500', detail: 'Học kỳ 1 2024-2025' },
    { icon: Calendar, label: 'Lịch TH đã xếp', value: '156', color: 'bg-green-500', detail: 'buổi trong kỳ' },
    { icon: UserCheck, label: 'Cán bộ phân công', value: '24', color: 'bg-purple-500', detail: 'giảng viên' },
    { icon: FileText, label: 'Báo cáo chờ duyệt', value: '3', color: 'bg-orange-500', detail: 'báo cáo cuối kỳ' }
  ];

  const quickActions = [
    { id: 1, title: 'Phân nhóm thực hành', icon: Users, color: 'from-blue-500 to-blue-600', link: '/academic-affairs/group-assign', description: 'Chia sinh viên thành các nhóm TH' },
    { id: 2, title: 'Xếp lịch nhóm TH', icon: Calendar, color: 'from-green-500 to-green-600', link: '/academic-affairs/view-schedule', description: 'Sắp xếp thời gian và phòng máy' },
    { id: 3, title: 'Công bố lịch TH', icon: Bell, color: 'from-purple-500 to-purple-600', link: '/academic-affairs/publish-schedule', description: 'Thông báo lịch cho SV và GV' },
    { id: 4, title: 'Phân chia cán bộ', icon: UserCheck, color: 'from-orange-500 to-orange-600', link: '/academic-affairs/assign-instructor', description: 'Phân công giảng viên hướng dẫn' },
    { id: 5, title: 'Báo cáo cuối kỳ', icon: FileText, color: 'from-red-500 to-red-600', link: '/academic-affairs/report', description: 'Tổng hợp giờ giảng và công tác' }
  ];

  const recentActivities = [
    { id: 1, action: 'Phân nhóm mới', subject: 'Lập trình Web - 3 nhóm', time: '30 phút trước', type: 'group' },
    { id: 2, action: 'Xếp lịch', subject: 'Cơ sở dữ liệu - Tuần 5', time: '2 giờ trước', type: 'schedule' },
    { id: 3, action: 'Phân công GV', subject: 'TS. Nguyễn Văn A - 4 nhóm', time: '5 giờ trước', type: 'assign' },
    { id: 4, action: 'Công bố lịch', subject: 'Lịch tuần 6 - HK1 2024', time: '1 ngày trước', type: 'publish' }
  ];

  const pendingTasks = [
    { id: 1, task: 'Phân nhóm môn Mạng máy tính', deadline: '25/12/2024', priority: 'high', status: 'pending' },
    { id: 2, task: 'Xếp lịch tuần 7 cho tất cả môn', deadline: '26/12/2024', priority: 'high', status: 'pending' },
    { id: 3, task: 'Kiểm tra phân công CB phòng B203', deadline: '27/12/2024', priority: 'medium', status: 'in-progress' },
    { id: 4, task: 'Chuẩn bị báo cáo tháng 12', deadline: '30/12/2024', priority: 'medium', status: 'pending' }
  ];

  const upcomingSchedules = [
    { id: 1, subject: 'Lập trình Web', groups: 3, date: '23/12/2024', sessions: 3, status: 'confirmed' },
    { id: 2, subject: 'Cơ sở dữ liệu', groups: 4, date: '24/12/2024', sessions: 4, status: 'confirmed' },
    { id: 3, subject: 'Mạng máy tính', groups: 2, date: '25/12/2024', sessions: 2, status: 'pending' }
  ];

  // --- Helper Functions ---
  const getPriorityBadge = (priority) => {
    const config = {
      high: { bg: 'bg-red-100', text: 'text-red-700', label: 'Ưu tiên cao' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Trung bình' },
      low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Thấp' }
    };
    const c = config[priority] || config.medium;
    return <span className={`px-2 py-1 rounded text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Chờ xử lý' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang xử lý' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã xác nhận' }
    };
    const c = config[status] || config.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
  };

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
                <LayoutGrid className="text-white" size={20} />
              </div>
              <span className="font-bold text-xl text-gray-800">IT Practice</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
              <Home size={20} /> Dashboard
            </Link>
            {quickActions.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.id} to={item.link} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Icon size={20} /> {item.title}
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
              <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Dashboard</h2>
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
                  <p className="text-sm font-medium text-gray-800">Trợ lý Giáo vụ</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-sm">
                  GV
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Chào mừng trở lại! 👋</h1>
            <p className="text-gray-500 mt-1">Tổng quan tình hình thực hành Khoa CNTT hôm nay.</p>
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
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">HK1 24-25</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-8">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Truy cập nhanh</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {quickActions.map(action => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.id} to={action.link} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm">{action.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{action.description}</p>
                    </Link>
                  )
                })}
             </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column (Tasks & Activities) */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Pending Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <AlertCircle size={20} className="text-orange-500" /> Công việc cần xử lý
                  </h3>
                  <button className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
                </div>
                <div className="divide-y divide-gray-100">
                  {pendingTasks.map(task => (
                    <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900 text-sm">{task.task}</h4>
                          {getStatusBadge(task.status)}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={12}/> Hạn: {task.deadline}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

               {/* Upcoming Schedules */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-500" /> Lịch thực hành tuần này
                  </h3>
                </div>
                <div className="p-4 grid gap-4">
                  {upcomingSchedules.map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex flex-col items-center justify-center text-xs font-bold text-gray-700 shadow-sm border">
                            <span>T2</span>
                            <span className="text-blue-600">23</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{schedule.subject}</h4>
                            <p className="text-xs text-gray-500">{schedule.groups} nhóm • {schedule.sessions} buổi</p>
                          </div>
                       </div>
                       {getStatusBadge(schedule.status)}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Activities) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-green-500" /> Hoạt động gần đây
                </h3>
              </div>
              <div className="p-6">
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                  {recentActivities.map((activity, idx) => (
                    <div key={activity.id} className="relative">
                      <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm
                        ${activity.type === 'publish' ? 'bg-green-500' : 'bg-blue-500'}
                      `}></div>
                      <p className="text-xs text-gray-400 mb-0.5">{activity.time}</p>
                      <h4 className="text-sm font-medium text-gray-900">{activity.action}</h4>
                      <p className="text-xs text-gray-500 mt-1">{activity.subject}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  Xem lịch sử hoạt động
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
