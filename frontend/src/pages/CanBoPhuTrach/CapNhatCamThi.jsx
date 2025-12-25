import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, Filter, Download, ChevronRight, BookOpen, CheckCircle, XCircle, Eye, Calendar, Users, Award, TrendingDown, Loader2 } from 'lucide-react';

// ==================== 1. MOCK API SERVICE ====================

const DB = {
  subjects: [
    { id: 'IT001', name: 'Lập trình OOP' },
    { id: 'IT002', name: 'Cơ sở dữ liệu' },
    { id: 'IT004', name: 'Mạng máy tính' },
    { id: 'IT005', name: 'Lập trình Web' }
  ],
  students: [
    {
      id: 1, code: '21520045', name: 'Nguyễn Văn X', class: 'KHTN2021', subject: 'IT001', subjectName: 'Lập trình OOP',
      group: 'Nhóm 1', totalSessions: 15, attended: 12, absent: 3, absentPercent: 20, status: 'warning', canTakeExam: true,
      history: [
        { date: '10/12/2024', session: 'Buổi 5', status: 'absent', reason: 'Không có phép' },
        { date: '03/12/2024', session: 'Buổi 4', status: 'absent', reason: 'Không có phép' },
        { date: '26/11/2024', session: 'Buổi 3', status: 'absent', reason: 'Không có phép' }
      ]
    },
    {
      id: 2, code: '21520078', name: 'Trần Thị Y', class: 'KHTN2021', subject: 'IT002', subjectName: 'Cơ sở dữ liệu',
      group: 'Nhóm 2', totalSessions: 15, attended: 11, absent: 4, absentPercent: 26.7, status: 'banned', canTakeExam: false,
      history: [
        { date: '12/12/2024', session: 'Buổi 6', status: 'absent', reason: 'Không có phép' },
        { date: '05/12/2024', session: 'Buổi 5', status: 'absent', reason: 'Không có phép' },
        { date: '28/11/2024', session: 'Buổi 4', status: 'absent', reason: 'Ốm - Có phép' },
        { date: '21/11/2024', session: 'Buổi 3', status: 'absent', reason: 'Không có phép' }
      ]
    },
    // ... thêm dữ liệu mẫu khác
    {
      id: 3, code: '21520092', name: 'Lê Văn Z', class: 'KHTN2021', subject: 'IT005', subjectName: 'Lập trình Web',
      group: 'Nhóm 1', totalSessions: 15, attended: 10, absent: 5, absentPercent: 33.3, status: 'banned', canTakeExam: false,
      history: []
    }
  ]
};

const api = {
  getInitialData: async () => {
    const [subjects, students] = await Promise.all([
      fetch('http://localhost:8000/api/lab-assistant/exam-ban/subjects/', {
        credentials: 'include'
      }).then(r => r.json()),
      
      fetch('http://localhost:8000/api/lab-assistant/exam-ban/', {
        credentials: 'include'
      }).then(r => r.json())
    ]);
    
    return {
      subjects: subjects,
      students: students.results.map(s => ({
        id: s.id,
        code: s.sinh_vien_info.code,
        name: s.sinh_vien_info.first_name + ' ' + s.sinh_vien_info.last_name,
        class: s.sinh_vien_info.class_name,
        subject: s.mon_hoc_info.ma_mon,
        subjectName: s.mon_hoc_info.ten_mon,
        group: s.nhom_info.ten_nhom,
        totalSessions: s.tong_so_buoi,
        attended: s.tong_so_buoi - s.so_buoi_vang,
        absent: s.so_buoi_vang,
        absentPercent: s.ty_le_vang,
        status: s.trang_thai,
        canTakeExam: s.co_the_thi,
        history: s.lich_su_vang
      }))
    };
  },

  toggleBanStatus: async (studentId) => {
    const response = await fetch(
      `http://localhost:8000/api/lab-assistant/exam-ban/${studentId}/toggle_ban/`,
      {
        method: 'POST',
        credentials: 'include'
      }
    );
    return await response.json();
  }
};
// ==================== 2. MAIN COMPONENT ====================

export default function CapNhatCamThi() {
  // --- Data State ---
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  // --- UI State ---
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null); // Loading cho từng nút Action
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. Load Data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        const res = await api.getInitialData();
        setSubjects(res.subjects);
        setStudents(res.students);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  // 2. Handle Actions
  const handleToggleBan = async (studentId) => {
    setProcessingId(studentId);
    try {
        const student = students.find(s => s.id === studentId);
        await api.toggleBanStatus(studentId, student.canTakeExam);
        
        // Optimistic Update: Cập nhật UI ngay lập tức
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                const newCanTakeExam = !s.canTakeExam;
                return {
                    ...s,
                    canTakeExam: newCanTakeExam,
                    status: !newCanTakeExam ? 'banned' : (s.absentPercent >= 20 ? 'warning' : 'normal')
                };
            }
            return s;
        }));
        
        // Cập nhật modal nếu đang mở
        if (selectedStudent && selectedStudent.id === studentId) {
             setSelectedStudent(prev => ({
                ...prev,
                canTakeExam: !prev.canTakeExam
             }));
        }

    } catch (e) {
        alert("Lỗi cập nhật");
    } finally {
        setProcessingId(null);
    }
  };

  // --- Derived State ---
  const filteredStudents = students.filter(student => 
    (filterSubject === 'all' || student.subject === filterSubject) &&
    (filterStatus === 'all' || student.status === filterStatus) &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     student.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalStudents = students.length;
  const bannedCount = students.filter(s => !s.canTakeExam).length;
  const warningCount = students.filter(s => s.status === 'warning' && s.canTakeExam).length;

  const getStatusBadge = (status, canTakeExam) => {
    if (status === 'banned' || !canTakeExam) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1 w-fit mx-auto">
          <XCircle size={14} /> Cấm thi
        </span>
      );
    }
    if (status === 'warning') {
        return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit mx-auto">
            <AlertTriangle size={14} /> Cảnh báo
            </span>
        );
    }
    return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit mx-auto">
        <CheckCircle size={14} /> Đủ điều kiện
        </span>
    );
  };

  if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
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
            <span className="text-gray-600">Cập nhật trạng thái cấm thi</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-white" size={28} />
            </div>
            Cập nhật trạng thái cấm thi
          </h1>
          <p className="text-gray-600">Kiểm tra điều kiện dự thi và cập nhật trạng thái cấm thi cho sinh viên</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">Tổng sinh viên</p>
              <Users size={24} className="text-blue-200" />
            </div>
            <p className="text-4xl font-bold">{totalStudents}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-red-100 text-sm">Cấm thi</p>
              <XCircle size={24} className="text-red-200" />
            </div>
            <p className="text-4xl font-bold">{bannedCount}</p>
            <p className="text-red-100 text-sm mt-1">vắng &gt; 20%</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-yellow-100 text-sm">Cảnh báo</p>
              <AlertTriangle size={24} className="text-yellow-200" />
            </div>
            <p className="text-4xl font-bold">{warningCount}</p>
            <p className="text-yellow-100 text-sm mt-1">vắng = 20%</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Đủ điều kiện</p>
              <CheckCircle size={24} className="text-green-200" />
            </div>
            <p className="text-4xl font-bold">{totalStudents - bannedCount}</p>
            <p className="text-green-100 text-sm mt-1">sinh viên</p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium mb-1">Quy chế thi:</p>
                <p className="text-sm text-blue-700">
                Sinh viên phải có mặt <span className="font-semibold">ít nhất 80%</span> số buổi thực hành (tối đa vắng 20%). 
                Nếu vắng quá 20%, sinh viên sẽ bị <span className="font-semibold text-red-600">cấm thi</span> môn học đó.
                </p>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-4 z-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm sinh viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">Tất cả môn học</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.id} - {subject.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="banned">Cấm thi</option>
                <option value="warning">Cảnh báo</option>
              </select>
            </div>

            <button className="w-full lg:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <Download size={18} />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">MSSV</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Họ và tên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Môn học</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Điểm danh</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Tỷ lệ vắng</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className={`hover:bg-gray-50 transition-colors ${!student.canTakeExam ? 'bg-red-50/50' : ''}`}>
                    <td className="px-6 py-4 font-semibold text-gray-800">{student.code}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.class} - {student.group}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{student.subject}</p>
                        <p className="text-xs text-gray-500">{student.subjectName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-600 font-semibold">{student.attended}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">{student.totalSessions}</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1 font-medium">Vắng: {student.absent}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${student.absentPercent > 20 ? 'bg-red-500' : 'bg-yellow-500'}`}
                            style={{ width: `${Math.min(student.absentPercent * 2, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-bold ${student.absentPercent > 20 ? 'text-red-600' : 'text-yellow-600'}`}>
                          {student.absentPercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(student.status, student.canTakeExam)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedStudent(student); setShowDetailModal(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleBan(student.id)}
                          disabled={processingId === student.id}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 w-20 ${
                            student.canTakeExam
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {processingId === student.id ? (
                             <Loader2 size={12} className="animate-spin" />
                          ) : (
                             student.canTakeExam ? 'Cấm thi' : 'Bỏ cấm'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 scale-in-95 animate-in max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-600">{selectedStudent.code} - {selectedStudent.class}</p>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Stats Cards */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Môn học</p>
                    <p className="font-semibold text-gray-800">{selectedStudent.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vắng</p>
                    <p className="text-2xl font-bold text-red-600">{selectedStudent.absent} <span className="text-sm font-normal text-gray-500">({selectedStudent.absentPercent.toFixed(1)}%)</span></p>
                  </div>
                </div>
              </div>

              {/* Attendance History */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingDown className="text-red-600" size={20} />
                  Lịch sử vắng mặt ({selectedStudent.history.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedStudent.history.map((record, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-semibold text-gray-800">{record.session}</span>
                          <span className="text-xs text-gray-500">{record.date}</span>
                        </div>
                        <p className="text-xs text-gray-600">{record.reason}</p>
                      </div>
                      <XCircle className="text-red-500" size={16} />
                    </div>
                  ))}
                  {selectedStudent.history.length === 0 && <p className="text-sm text-gray-500 text-center py-2">Không có dữ liệu vắng</p>}
                </div>
              </div>

              {/* Status Alert */}
              <div className={`p-4 rounded-lg border ${
                !selectedStudent.canTakeExam ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}>
                <p className="text-sm font-medium">
                  {!selectedStudent.canTakeExam 
                    ? '🚫 Sinh viên đã vắng quá 20% và bị cấm thi môn học này.' 
                    : '⚠️ Sinh viên đang ở mức cảnh báo.'
                  }
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                 <button
                    onClick={() => handleToggleBan(selectedStudent.id)}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                        selectedStudent.canTakeExam ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                 >
                    {selectedStudent.canTakeExam ? 'Xác nhận cấm thi' : 'Gỡ bỏ cấm thi'}
                 </button>
                 <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Đóng
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
