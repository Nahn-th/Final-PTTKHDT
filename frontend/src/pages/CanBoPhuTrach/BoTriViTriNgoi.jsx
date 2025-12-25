import React, { useState, useEffect } from 'react';
import { Grid, Monitor, Users, Save, ChevronRight, BookOpen, Shuffle, RotateCcw, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

// ==================== 1. MOCK API SERVICE ====================

const DB = {
  sessions: [
    {
      id: 1, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', group: 'Nhóm 1',
      date: '23/12/2024', time: '14:00 - 16:00', room: 'A101', studentsCount: 38, seatsAssigned: false
    },
    {
      id: 2, subject: 'Mạng máy tính', subjectCode: 'IT004', group: 'Nhóm 1',
      date: '26/12/2024', time: '08:00 - 10:00', room: 'A101', studentsCount: 30, seatsAssigned: false
    }
  ],
  // Dữ liệu chi tiết cho từng buổi (key là session_id)
  sessionDetails: {
    1: {
      students: [
        { id: 1, code: '21520001', name: 'Nguyễn Thị Mai', class: 'KHTN2021', assignedSeat: 1 },
        { id: 2, code: '21520002', name: 'Trần Văn Nam', class: 'KHTN2021', assignedSeat: 2 },
        { id: 3, code: '21520003', name: 'Lê Thị Hoa', class: 'KHTN2021', assignedSeat: 3 },
        { id: 4, code: '21520004', name: 'Phạm Văn Đức', class: 'KHTN2021', assignedSeat: 4 },
        { id: 5, code: '21520005', name: 'Võ Thị Lan', class: 'KHTN2021', assignedSeat: 5 },
        { id: 6, code: '21520006', name: 'Đặng Văn Khoa', class: 'KHTN2021', assignedSeat: 6 },
        { id: 7, code: '21520007', name: 'Bùi Thị Thu', class: 'KHTN2021', assignedSeat: 7 },
        { id: 8, code: '21520008', name: 'Huỳnh Văn Long', class: 'KHTN2021', assignedSeat: 8 }
        // ... thêm sinh viên nếu cần
      ],
      layoutConfig: { rows: 5, cols: 8 } // Cấu hình phòng máy
    },
    2: {
      students: [
        { id: 9, code: '21520009', name: 'Trương Thị Kim', class: 'KHTN2021', assignedSeat: null },
        { id: 10, code: '21520010', name: 'Ngô Văn Tài', class: 'KHTN2021', assignedSeat: null }
      ],
      layoutConfig: { rows: 5, cols: 8 }
    }
  }
};

const api = {
  // Lấy danh sách các buổi thực hành cần xếp chỗ
  getSessions: async () => {
    await new Promise(r => setTimeout(r, 500));
    return DB.sessions;
  },

  // Lấy chi tiết sinh viên và cấu hình phòng của 1 buổi
  getSessionDetail: async (sessionId) => {
    await new Promise(r => setTimeout(r, 600));
    return DB.sessionDetails[sessionId] || { students: [], layoutConfig: { rows: 5, cols: 8 } };
  },

  // Lưu sơ đồ chỗ ngồi
  saveSeatLayout: async (sessionId, layout) => {
    await new Promise(r => setTimeout(r, 1000));
    console.log(`Saved layout for session ${sessionId}`, layout);
    return { success: true, message: 'Đã lưu sơ đồ chỗ ngồi thành công!' };
  }
};

// ==================== 2. MAIN COMPONENT ====================

export default function BoTriViTriNgoi() {
  // --- Data State ---
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [layoutConfig, setLayoutConfig] = useState({ rows: 5, cols: 8 });
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  
  // --- UI State ---
  const [seatLayout, setSeatLayout] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 1. Load danh sách buổi học
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await api.getSessions();
        setSessions(data);
        if (data.length > 0) setSelectedSessionId(data[0].id);
      } catch (e) {
        console.error("Lỗi tải sessions", e);
      } finally {
        setLoadingSessions(false);
      }
    };
    loadSessions();
  }, []);

  // 2. Load chi tiết buổi học & Xây dựng layout ban đầu
  useEffect(() => {
    const loadDetail = async () => {
      if (!selectedSessionId) return;
      
      setLoadingDetail(true);
      try {
        const data = await api.getSessionDetail(selectedSessionId);
        setStudents(data.students);
        setLayoutConfig(data.layoutConfig);
        
        // Build initial layout based on student data
        const totalSeats = data.layoutConfig.rows * data.layoutConfig.cols;
        const layout = Array.from({ length: totalSeats }, (_, i) => {
            const student = data.students.find(s => s.assignedSeat === i + 1);
            return {
                id: i + 1,
                student: student || null,
                status: student ? 'assigned' : 'available'
            };
        });
        setSeatLayout(layout);

      } catch (e) {
        console.error("Lỗi tải chi tiết", e);
      } finally {
        setLoadingDetail(false);
      }
    };
    loadDetail();
  }, [selectedSessionId]);

  // --- Handlers ---

  const handleAutoAssign = () => {
    // Logic: Tìm những SV chưa có chỗ và những ghế còn trống để điền vào
    const unassignedStudents = students.filter(s => !seatLayout.some(seat => seat.student?.id === s.id));
    const availableSeats = seatLayout.filter(seat => seat.status === 'available');
    
    if (unassignedStudents.length === 0) {
        alert("Tất cả sinh viên đã có chỗ ngồi!");
        return;
    }

    const newLayout = [...seatLayout];
    unassignedStudents.forEach((student, index) => {
      if (availableSeats[index]) {
        const seatIndex = newLayout.findIndex(s => s.id === availableSeats[index].id);
        newLayout[seatIndex] = {
          ...newLayout[seatIndex],
          student: student,
          status: 'assigned'
        };
      }
    });
    setSeatLayout(newLayout);
  };

  const handleResetSeats = () => {
    const totalSeats = layoutConfig.rows * layoutConfig.cols;
    setSeatLayout(
      Array.from({ length: totalSeats }, (_, i) => ({
        id: i + 1,
        student: null,
        status: 'available'
      }))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        // Chỉ gửi về server danh sách mapping: { studentId: 1, seatId: 5 }, ...
        const mapping = seatLayout
            .filter(seat => seat.student)
            .map(seat => ({ studentId: seat.student.id, seatId: seat.id }));
            
        const res = await api.saveSeatLayout(selectedSessionId, mapping);
        if(res.success) {
            setShowSaveConfirm(false);
            alert(res.message);
        }
    } catch (e) {
        alert("Lỗi khi lưu");
    } finally {
        setIsSaving(false);
    }
  };

  // --- Derived State ---
  const currentSession = sessions.find(s => s.id === selectedSessionId);
  const assignedCount = seatLayout.filter(seat => seat.status === 'assigned').length;
  const availableCount = seatLayout.filter(seat => seat.status === 'available').length;
  const totalSeats = layoutConfig.rows * layoutConfig.cols;

  const getSeatColor = (seat) => {
    if (seat.status === 'assigned') return 'bg-green-500 hover:bg-green-600 text-white';
    if (seat.status === 'broken') return 'bg-red-200 cursor-not-allowed';
    return 'bg-gray-100 hover:bg-blue-100 border-2 border-dashed border-gray-300';
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
            <a href="/lab-assistant" className="text-gray-500 hover:text-gray-700">
              <BookOpen size={20} />
            </a>
            <ChevronRight size={20} className="text-gray-400" />
            <span className="text-gray-600">Bố trí vị trí ngồi</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Grid className="text-white" size={28} />
            </div>
            Bố trí vị trí ngồi
          </h1>
          <p className="text-gray-600">Phân chia vị trí máy tính cho sinh viên trong buổi thực hành</p>
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
                {session.subjectCode} - {session.group} | {session.date} | {session.time} | {session.room}
              </option>
            ))}
          </select>
        </div>

        {/* Loading Overlay */}
        {loadingDetail ? (
           <div className="p-12 text-center bg-white rounded-xl shadow-sm mb-6">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Đang tải sơ đồ phòng máy...</p>
           </div>
        ) : (
          <>
            {/* Session Info */}
            {currentSession && (
              <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-6 text-white mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-sm font-semibold">
                        {currentSession.subjectCode}
                      </span>
                      <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-sm font-semibold">
                        {currentSession.group}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{currentSession.subject}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-green-100">
                      <span>{currentSession.date}</span>
                      <span>{currentSession.time}</span>
                      <span>{currentSession.room}</span>
                      <span>{currentSession.studentsCount} sinh viên</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Tổng số máy</p>
                  <Monitor className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{totalSeats}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Đã phân</p>
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-green-600">{assignedCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm">Còn trống</p>
                  <Grid className="text-gray-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-600">{availableCount}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                    <span>Đã phân</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-6 h-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded"></div>
                    <span>Trống</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-6 h-6 bg-red-200 rounded"></div>
                    <span>Hỏng</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                  <button
                    onClick={handleAutoAssign}
                    className="flex-1 lg:flex-none px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Shuffle size={18} />
                    Phân tự động
                  </button>
                  <button
                    onClick={handleResetSeats}
                    className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Đặt lại
                  </button>
                  <button className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Download size={18} />
                    Xuất sơ đồ
                  </button>
                  <button
                    onClick={() => setShowSaveConfirm(true)}
                    className="flex-1 lg:flex-none px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Lưu bố trí
                  </button>
                </div>
              </div>
            </div>

            {/* Seat Layout */}
            <div className="bg-white rounded-xl shadow-sm p-8 overflow-x-auto">
              <div className="mb-6 text-center min-w-[600px]">
                <div className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold w-1/2">
                  🖥️ Bảng / Máy Giảng viên
                </div>
              </div>

              <div 
                className="grid gap-3 min-w-[600px]" 
                style={{ gridTemplateColumns: `repeat(${layoutConfig.cols}, minmax(0, 1fr))` }}
              >
                {seatLayout.map((seat) => (
                  <div
                    key={seat.id}
                    className={`aspect-square rounded-lg ${getSeatColor(seat)} transition-all cursor-pointer flex flex-col items-center justify-center p-2 text-center relative group`}
                  >
                    <div className="text-xs font-semibold mb-1">
                      Máy {seat.id}
                    </div>
                    {seat.student && (
                      <div className="text-xs truncate w-full px-1">
                        <div className="font-medium">{seat.student.name.split(' ').pop()}</div>
                        <div className="text-[10px] opacity-80">{seat.student.code}</div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-800 text-white text-xs rounded p-2 hidden group-hover:block z-10">
                            {seat.student.name}<br/>{seat.student.code}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                Tổng: {layoutConfig.rows} hàng × {layoutConfig.cols} cột = {totalSeats} máy
              </div>
            </div>

            {/* Student List (Optional View) */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Users className="mr-2 text-green-600" size={24} />
                Danh sách sinh viên ({students.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {students.map((student) => {
                  const seat = seatLayout.find(s => s.student?.id === student.id);
                  return (
                    <div
                      key={student.id}
                      className={`border rounded-lg p-3 ${
                        seat ? 'border-green-300 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.code} - {student.class}</p>
                        </div>
                        {seat ? (
                          <div className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">
                            Máy {seat.id}
                          </div>
                        ) : (
                            <div className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                            Chưa xếp
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                Xác nhận lưu bố trí
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn lưu bố trí vị trí ngồi này? Sinh viên sẽ nhận được thông báo về vị trí máy của mình.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{assignedCount}</p>
                    <p className="text-xs text-gray-600">Đã phân</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">{availableCount}</p>
                    <p className="text-xs text-gray-600">Còn trống</p>
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
                        <Loader2 className="w-5 h-5 animate-spin" /> Đang lưu...
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
