import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, Calendar, CheckCircle, Clock, AlertCircle, ChevronRight, BookOpen, Eye, Mail, MessageSquare } from 'lucide-react';

// ==================== MOCK API SERVICE ====================

// 1. Dữ liệu giả lập (Database)
const DB = {
  weeks: [
    { id: 5, week: 'Tuần 5', dateRange: '16/12 - 22/12/2024', status: 'published', publishDate: '15/12/2024 14:30', schedules: 15, notifiedStudents: 245, notifiedInstructors: 12 },
    { id: 6, week: 'Tuần 6', dateRange: '23/12 - 29/12/2024', status: 'ready', publishDate: null, schedules: 18, notifiedStudents: 0, notifiedInstructors: 0 },
    { id: 7, week: 'Tuần 7', dateRange: '30/12 - 05/01/2025', status: 'draft', publishDate: null, schedules: 12, notifiedStudents: 0, notifiedInstructors: 0 }
  ],
  subjects: [
    { id: 'IT002', name: 'Cơ sở dữ liệu', code: 'IT002', groups: 3, schedules: 3, students: 115, instructors: ['ThS. Trần Thị B'] },
    { id: 'IT005', name: 'Lập trình Web', code: 'IT005', groups: 2, schedules: 2, students: 70, instructors: ['ThS. Hoàng Thị E'] },
    { id: 'IT001', name: 'Lập trình OOP', code: 'IT001', groups: 3, schedules: 3, students: 108, instructors: ['TS. Nguyễn Văn A'] },
    { id: 'IT004', name: 'Mạng máy tính', code: 'IT004', groups: 2, schedules: 2, students: 86, instructors: ['TS. Phạm Văn D'] }
  ],
  history: [
    { id: 1, week: 'Tuần 5', dateRange: '16/12 - 22/12/2024', publishedBy: 'Admin', publishDate: '15/12/2024 14:30', studentsNotified: 245, instructorsNotified: 12, status: 'completed' },
    { id: 2, week: 'Tuần 4', dateRange: '09/12 - 15/12/2024', publishedBy: 'Admin', publishDate: '08/12/2024 16:00', studentsNotified: 245, instructorsNotified: 12, status: 'completed' },
    { id: 3, week: 'Tuần 3', dateRange: '02/12 - 08/12/2024', publishedBy: 'Admin', publishDate: '01/12/2024 15:45', studentsNotified: 238, instructorsNotified: 12, status: 'completed' }
  ]
};

// 2. Các hàm API
const api = {
  getWeeks: async () => {
    await new Promise(r => setTimeout(r, 500));
    return DB.weeks;
  },

  getWeekDetails: async (weekId) => {
    await new Promise(r => setTimeout(r, 600));
    const week = DB.weeks.find(w => w.id === weekId);
    
    // Giả lập logic: Trả về danh sách môn học ngẫu nhiên hoặc cố định tùy tuần
    // Ở đây mình trả về cố định để demo
    const subjects = weekId === 7 ? DB.subjects.slice(0, 2) : DB.subjects;
    
    return {
      weekInfo: week,
      subjects: subjects,
      history: DB.history // Trong thực tế có thể filter history liên quan
    };
  },

  publishWeek: async (weekId, targets) => {
    console.log(`Publishing week ${weekId} to:`, targets);
    await new Promise(r => setTimeout(r, 1500)); // Delay lâu hơn chút để thấy loading spinner
    
    // Giả lập cập nhật DB
    const weekIndex = DB.weeks.findIndex(w => w.id === weekId);
    if (weekIndex !== -1) {
      DB.weeks[weekIndex].status = 'published';
      DB.weeks[weekIndex].publishDate = new Date().toLocaleString('vi-VN');
      DB.weeks[weekIndex].notifiedStudents = 379; // Mock số liệu sau khi công bố
      DB.weeks[weekIndex].notifiedInstructors = 15;
    }
    
    return { success: true, message: 'Đã công bố lịch thành công!' };
  }
};

// ==================== UTILITY COMPONENTS ====================

const StatusBadge = ({ status }) => {
  const config = {
    published: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Đã công bố' },
    ready: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock, label: 'Sẵn sàng' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-700', icon: AlertCircle, label: 'Nháp' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Hoàn thành' }
  };
  const c = config[status] || config.draft;
  const Icon = c.icon;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} flex items-center gap-1 w-fit`}>
      <Icon size={14} />
      {c.label}
    </span>
  );
};

// ==================== MAIN COMPONENT ====================

export default function CongBoLichTH() {
  // State
  const [weeks, setWeeks] = useState([]);
  const [selectedWeekId, setSelectedWeekId] = useState(6);
  const [detailData, setDetailData] = useState(null); // Chứa thông tin chi tiết của tuần đang chọn
  
  // Loading States
  const [loadingWeeks, setLoadingWeeks] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false); // Loading cho nút Publish
  
  // Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);

  // 1. Load danh sách tuần khi vào trang
  useEffect(() => {
    const loadWeeks = async () => {
      try {
        const data = await api.getWeeks();
        setWeeks(data);
        // Nếu tuần đang chọn (6) không có trong list thì fallback về tuần đầu tiên
        if (!data.find(w => w.id === selectedWeekId) && data.length > 0) {
            setSelectedWeekId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load weeks", error);
      } finally {
        setLoadingWeeks(false);
      }
    };
    loadWeeks();
  }, []);

  // 2. Load chi tiết khi thay đổi tuần (selectedWeekId)
  useEffect(() => {
    const loadDetail = async () => {
      setLoadingDetail(true);
      setDetailData(null); // Clear data cũ để hiện skeleton/loading
      try {
        const data = await api.getWeekDetails(selectedWeekId);
        setDetailData(data);
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoadingDetail(false);
      }
    };
    
    if (selectedWeekId) {
        loadDetail();
    }
  }, [selectedWeekId]);

  // 3. Xử lý hành động Công Bố
  const handlePublishConfirm = async () => {
    setIsPublishing(true);
    try {
      const result = await api.publishWeek(selectedWeekId, ['student', 'instructor']);
      if (result.success) {
        // Cập nhật lại UI Local sau khi thành công
        setDetailData(prev => ({
            ...prev,
            weekInfo: {
                ...prev.weekInfo,
                status: 'published',
                publishDate: new Date().toLocaleString('vi-VN'),
                notifiedStudents: 379, // Update số liệu giả
                notifiedInstructors: 15
            }
        }));
        
        // Cập nhật lại list weeks ở dropdown
        setWeeks(prev => prev.map(w => 
            w.id === selectedWeekId ? { ...w, status: 'published' } : w
        ));

        alert(result.message); // Có thể thay bằng Toast
        setShowPublishModal(false);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi công bố.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Tính toán tổng quan (Derived state)
  const currentWeek = detailData?.weekInfo;
  const schedulesBySubject = detailData?.subjects || [];
  const publicationHistory = detailData?.history || [];
  
  const totalStudents = schedulesBySubject.reduce((sum, s) => sum + s.students, 0);
  const totalInstructors = [...new Set(schedulesBySubject.flatMap(s => s.instructors))].length;

  if (loadingWeeks) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <a href="/admin" className="text-gray-500 hover:text-gray-700">
              <BookOpen size={20} />
            </a>
            <ChevronRight size={20} className="text-gray-400" />
            <span className="text-gray-600">Công bố lịch thực hành</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Bell className="text-white" size={28} />
            </div>
            Công bố lịch thực hành
          </h1>
          <p className="text-gray-600">Thông báo lịch học đến sinh viên và giảng viên</p>
        </div>

        {/* Loading State for Details */}
        {loadingDetail ? (
           <div className="p-12 text-center bg-white rounded-xl shadow-sm">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải thông tin tuần...</p>
           </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <p className="text-purple-100 text-sm mb-2">Tuần được chọn</p>
                <p className="text-3xl font-bold">{currentWeek?.week}</p>
                <p className="text-purple-100 text-sm mt-1">{currentWeek?.dateRange}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <p className="text-blue-100 text-sm mb-2">Tổng buổi TH</p>
                <p className="text-4xl font-bold">{currentWeek?.schedules || 0}</p>
                <p className="text-blue-100 text-sm mt-1">buổi trong tuần</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <p className="text-green-100 text-sm mb-2">Sinh viên</p>
                <p className="text-4xl font-bold">{totalStudents}</p>
                <p className="text-green-100 text-sm mt-1">sẽ được thông báo</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <p className="text-orange-100 text-sm mb-2">Giảng viên</p>
                <p className="text-4xl font-bold">{totalInstructors}</p>
                <p className="text-orange-100 text-sm mt-1">sẽ được thông báo</p>
              </div>
            </div>

            {/* Week Selection & Action */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-4 z-10 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Chọn tuần:</label>
                  <select
                    value={selectedWeekId}
                    onChange={(e) => setSelectedWeekId(Number(e.target.value))}
                    className="flex-1 lg:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    {weeks.map(week => (
                      <option key={week.id} value={week.id}>
                        {week.week} ({week.dateRange}) - {week.status === 'published' ? 'Đã công bố' : week.status === 'ready' ? 'Sẵn sàng' : 'Nháp'}
                      </option>
                    ))}
                  </select>
                </div>

                {currentWeek?.status !== 'published' && (
                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="w-full lg:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Công bố lịch tuần này
                  </button>
                )}
              </div>
            </div>

            {/* Current Week Status Details */}
            {currentWeek && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Trạng thái {currentWeek.week}</h3>
                  <StatusBadge status={currentWeek.status} />
                </div>

                {currentWeek.status === 'published' ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in duration-500">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-800 mb-2">Đã công bố thành công</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                          <div><span className="font-medium">Thời gian: </span>{currentWeek.publishDate}</div>
                          <div><span className="font-medium">Sinh viên: </span>{currentWeek.notifiedStudents} người</div>
                          <div><span className="font-medium">Giảng viên: </span>{currentWeek.notifiedInstructors} người</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentWeek.status === 'ready' ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-800 mb-2">Sẵn sàng công bố</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Lịch học đã được xếp đầy đủ và sẵn sàng để thông báo đến sinh viên và giảng viên.
                        </p>
                        <button
                          onClick={() => setShowPublishModal(true)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Send size={16} />
                          Công bố ngay
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-800 mb-2">Chưa sẵn sàng</h4>
                        <p className="text-sm text-yellow-700">
                          Lịch học vẫn đang trong quá trình xếp (Nháp). Vui lòng hoàn thành việc xếp lịch trước khi công bố.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Schedules by Subject */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Chi tiết lịch theo môn học</h3>
              <div className="space-y-3">
                {schedulesBySubject.map(subject => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
                            {subject.code}
                          </span>
                          <h4 className="font-bold text-gray-800">{subject.name}</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {subject.groups} nhóm • {subject.schedules} buổi
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={14} />
                            {subject.students} sinh viên
                          </div>
                          <div className="col-span-2">
                            GV: {subject.instructors.join(', ')}
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2 text-sm font-medium">
                        <Eye size={16} />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publication History */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-purple-600" size={24} />
                Lịch sử công bố
              </h3>
              <div className="space-y-3">
                {publicationHistory.map(history => (
                  <div key={history.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-gray-800">{history.week}</h4>
                          <span className="text-sm text-gray-500">{history.dateRange}</span>
                          <StatusBadge status={history.status} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Công bố: </span>
                            {history.publishDate}
                          </div>
                          <div>
                            <span className="font-medium">Người thực hiện: </span>
                            {history.publishedBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {history.studentsNotified} SV
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            {history.instructorsNotified} GV
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Publish Modal */}
        {showPublishModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 scale-in-95 animate-in">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Bell className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                Công bố lịch {currentWeek?.week}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Xác nhận công bố lịch thực hành {currentWeek?.dateRange}
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Đối tượng nhận thông báo:</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked disabled={isPublishing} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Sinh viên</p>
                      <p className="text-sm text-gray-600">{totalStudents} sinh viên sẽ nhận email và thông báo</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked disabled={isPublishing} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Giảng viên</p>
                      <p className="text-sm text-gray-600">{totalInstructors} giảng viên sẽ nhận email và thông báo</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-blue-700">
                    Sau khi công bố, lịch học sẽ được gửi qua email và hiển thị trên hệ thống. 
                    Sinh viên và giảng viên sẽ nhận được thông báo ngay lập tức.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPublishModal(false)}
                  disabled={isPublishing}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePublishConfirm}
                  disabled={isPublishing}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                >
                  {isPublishing ? (
                    <>
                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       Đang gửi...
                    </>
                  ) : (
                    <>
                        <Send size={18} />
                        Xác nhận công bố
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
