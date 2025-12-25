import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, Save, ChevronRight, BookOpen, Users, Calendar, MapPin, AlertCircle, Download, Filter, Loader2 } from 'lucide-react';

// ==================== 1. MOCK API SERVICE ====================

const DB = {
  sessions: [
    {
      id: 1, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', group: 'Nhóm 1',
      date: '23/12/2024', dayOfWeek: 'Thứ 2', time: '14:00 - 16:00', room: 'A101',
      session: 'Buổi 6', topic: 'Kế thừa và Đa hình trong Java', studentsCount: 38, status: 'ongoing'
    },
    {
      id: 2, subject: 'Lập trình Web', subjectCode: 'IT005', group: 'Nhóm 2',
      date: '24/12/2024', dayOfWeek: 'Thứ 3', time: '08:00 - 10:00', room: 'B203',
      session: 'Buổi 7', topic: 'React Hooks và State Management', studentsCount: 35, status: 'upcoming'
    }
  ],
  // Dữ liệu điểm danh chi tiết cho từng buổi (key là session_id)
  attendanceDetails: {
    1: [
      { id: 1, code: '21520001', name: 'Nguyễn Thị Mai', class: 'KHTN2021', computer: 'Máy 01', status: 'present', note: '' },
      { id: 2, code: '21520002', name: 'Trần Văn Nam', class: 'KHTN2021', computer: 'Máy 02', status: 'present', note: '' },
      { id: 3, code: '21520003', name: 'Lê Thị Hoa', class: 'KHTN2021', computer: 'Máy 03', status: 'present', note: '' },
      { id: 4, code: '21520004', name: 'Phạm Văn Đức', class: 'KHTN2021', computer: 'Máy 04', status: 'absent', note: 'Không có phép' },
      { id: 5, code: '21520005', name: 'Võ Thị Lan', class: 'KHTN2021', computer: 'Máy 05', status: 'present', note: '' },
      { id: 6, code: '21520006', name: 'Đặng Văn Khoa', class: 'KHTN2021', computer: 'Máy 06', status: 'late', note: 'Đến muộn 15 phút' },
      { id: 7, code: '21520007', name: 'Bùi Thị Thu', class: 'KHTN2021', computer: 'Máy 07', status: 'present', note: '' },
      { id: 8, code: '21520008', name: 'Huỳnh Văn Long', class: 'KHTN2021', computer: 'Máy 08', status: 'present', note: '' },
      { id: 9, code: '21520009', name: 'Trương Thị Kim', class: 'KHTN2021', computer: 'Máy 09', status: 'present', note: '' },
      { id: 10, code: '21520010', name: 'Ngô Văn Tài', class: 'KHTN2021', computer: 'Máy 10', status: 'absent', note: 'Có phép - Ốm' }
    ],
    2: [
      { id: 11, code: '21520011', name: 'Phan Thị Nga', class: 'KHTN2021', computer: 'Máy 01', status: 'present', note: '' },
      { id: 12, code: '21520012', name: 'Lý Văn Phong', class: 'KHTN2021', computer: 'Máy 02', status: 'absent', note: '' }
      // ... thêm dữ liệu giả cho buổi 2 nếu cần
    ]
  }
};

const api = {
  // Lấy danh sách các buổi dạy
  getSessions: async () => {
    await new Promise(r => setTimeout(r, 500));
    return DB.sessions;
  },

  // Lấy danh sách sinh viên của 1 buổi cụ thể
  getAttendanceList: async (sessionId) => {
    await new Promise(r => setTimeout(r, 600)); // Giả lập mạng chậm khi chuyển buổi
    return DB.attendanceDetails[sessionId] || [];
  },

  // Lưu kết quả điểm danh
  saveAttendance: async (sessionId, data) => {
    await new Promise(r => setTimeout(r, 1000)); // Giả lập xử lý lưu
    console.log(`Saved attendance for session ${sessionId}:`, data);
    return { success: true, message: 'Đã lưu điểm danh thành công!' };
  }
};

// ==================== 2. MAIN COMPONENT ====================

export default function DiemDanhSV() {
  // --- Data State ---
  const [sessions, setSessions] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // --- UI State ---
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 1. Load danh sách buổi học khi vào trang
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await api.getSessions();
        setSessions(data);
        if (data.length > 0) {
          setSelectedSessionId(data[0].id); // Mặc định chọn buổi đầu tiên
        }
      } catch (error) {
        console.error("Lỗi tải danh sách buổi:", error);
      } finally {
        setLoadingSessions(false);
      }
    };
    loadSessions();
  }, []);

  // 2. Load danh sách sinh viên khi chọn buổi học khác
  useEffect(() => {
    const loadAttendance = async () => {
      if (!selectedSessionId) return;
      
      setLoadingAttendance(true);
      try {
        const data = await api.getAttendanceList(selectedSessionId);
        setAttendanceData(data);
      } catch (error) {
        console.error("Lỗi tải danh sách sinh viên:", error);
      } finally {
        setLoadingAttendance(false);
      }
    };
    loadAttendance();
  }, [selectedSessionId]);

  // --- Handlers ---

  const handleToggleAttendance = (studentId, newStatus) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const handleUpdateNote = (studentId, note) => {
    setAttendanceData(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, note } : student
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.saveAttendance(selectedSessionId, attendanceData);
      if(res.success) {
        setShowSaveConfirm(false);
        // Có thể thêm Toast notification ở đây
        alert(res.message);
      }
    } catch (error) {
      alert("Lỗi khi lưu dữ liệu");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkAction = (status) => {
    setAttendanceData(prev => prev.map(s => ({ ...s, status: status })));
  };

  // --- Derived State (Tính toán) ---
  const currentSession = sessions.find(s => s.id === selectedSessionId);

  const filteredStudents = attendanceData.filter(student => 
    (filterStatus === 'all' || student.status === filterStatus) &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     student.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const presentCount = attendanceData.filter(s => s.status === 'present').length;
  const absentCount = attendanceData.filter(s => s.status === 'absent').length;
  const lateCount = attendanceData.filter(s => s.status === 'late').length;
  const attendanceRate = attendanceData.length > 0 
    ? ((presentCount + lateCount) / attendanceData.length * 100).toFixed(1) 
    : 0;

  const getStatusBadge = (status) => {
    const config = {
      present: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Có mặt' },
      absent: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Vắng' },
      late: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Muộn' }
    };
    const c = config[status];
    const Icon = c.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} flex items-center gap-1 w-fit`}>
        <Icon size={14} />
        {c.label}
      </span>
    );
  };

  if (loadingSessions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
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
            <span className="text-gray-600">Điểm danh sinh viên</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-white" size={28} />
            </div>
            Điểm danh sinh viên
          </h1>
          <p className="text-gray-600">Ghi nhận sự hiện diện của sinh viên trong buổi thực hành</p>
        </div>

        {/* Session Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Chọn buổi thực hành:</label>
          <select
            value={selectedSessionId || ''}
            onChange={(e) => setSelectedSessionId(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            {sessions.map(session => (
              <option key={session.id} value={session.id}>
                {session.subjectCode} - {session.group} | {session.dayOfWeek}, {session.date} | {session.time} | Phòng {session.room}
              </option>
            ))}
          </select>
        </div>

        {/* Session Info Card */}
        {currentSession && (
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-sm font-semibold">
                    {currentSession.subjectCode}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-sm font-semibold">
                    {currentSession.group}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{currentSession.subject} - {currentSession.session}</h3>
                <p className="text-green-100 mb-3">{currentSession.topic}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {currentSession.dayOfWeek}, {currentSession.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {currentSession.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    Phòng {currentSession.room}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users size={16} />
                    {currentSession.studentsCount} sinh viên
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay or Content */}
        {loadingAttendance ? (
           <div className="p-12 text-center bg-white rounded-xl shadow-sm mb-6">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Đang tải danh sách sinh viên...</p>
           </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Tổng sinh viên</p>
                  <Users className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{attendanceData.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Có mặt</p>
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-green-600">{presentCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Vắng mặt</p>
                  <XCircle className="text-red-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-red-600">{absentCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Tỷ lệ</p>
                  <CheckCircle className="text-purple-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-purple-600">{attendanceRate}%</p>
              </div>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Tìm sinh viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="present">Có mặt</option>
                    <option value="absent">Vắng</option>
                    <option value="late">Muộn</option>
                  </select>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                  <button className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    Xuất Excel
                  </button>
                  <button
                    onClick={() => setShowSaveConfirm(true)}
                    className="flex-1 lg:flex-none px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Lưu điểm danh
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium mb-2">Thao tác nhanh:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleBulkAction('present')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Điểm danh tất cả
                    </button>
                    <button
                      onClick={() => handleBulkAction('absent')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Vắng tất cả
                    </button>
                    <button
                      onClick={() => setAttendanceData(prev => prev.map(s => ({ ...s, status: 'present', note: '' })))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Đặt lại
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">MSSV</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Họ và tên</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lớp</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Máy</th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-800">{student.code}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {student.name.split(' ').pop().charAt(0)}
                            </div>
                            <span className="font-medium text-gray-800">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{student.class}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                            {student.computer}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleAttendance(student.id, 'present')}
                              className={`p-2 rounded-lg transition-colors ${
                                student.status === 'present'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                              }`}
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              onClick={() => handleToggleAttendance(student.id, 'late')}
                              className={`p-2 rounded-lg transition-colors ${
                                student.status === 'late'
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'
                              }`}
                            >
                              <Clock size={20} />
                            </button>
                            <button
                              onClick={() => handleToggleAttendance(student.id, 'absent')}
                              className={`p-2 rounded-lg transition-colors ${
                                student.status === 'absent'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                              }`}
                            >
                              <XCircle size={20} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={student.note}
                            onChange={(e) => handleUpdateNote(student.id, e.target.value)}
                            placeholder="Thêm ghi chú..."
                            className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Save Confirmation Modal */}
        {showSaveConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 scale-in-95 animate-in">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Save className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                Xác nhận lưu điểm danh
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn lưu kết quả điểm danh này? Sau khi lưu, dữ liệu sẽ được ghi nhận vào hệ thống.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                    <p className="text-xs text-gray-600">Có mặt</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
                    <p className="text-xs text-gray-600">Muộn</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                    <p className="text-xs text-gray-600">Vắng</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveConfirm(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Đang lưu...
                    </>
                  ) : (
                    'Xác nhận lưu'
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
