import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, Users, Calendar, Award, ChevronRight, BookOpen, Filter, Eye, CheckCircle, Clock, BarChart3, PieChart } from 'lucide-react';

// ==================== MOCK API SERVICES (Thay thế bằng BE thật sau này) ====================

// 1. Giả lập API lấy danh sách học kỳ
const fetchSemesters = async () => {
  // const res = await axios.get('/api/semesters'); return res.data;
  return [
    { id: 'hk1-2024', name: 'Học kỳ 1 2024-2025' },
    { id: 'hk2-2023', name: 'Học kỳ 2 2023-2024' },
    { id: 'hk1-2023', name: 'Học kỳ 1 2023-2024' },
  ];
};

// 2. Giả lập API lấy dữ liệu báo cáo
const fetchReportData = async (semesterId, type) => {
  console.log(`Fetching report: Semester ${semesterId}, Type: ${type}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Dữ liệu giả lập trả về tùy theo loại báo cáo (type)
  const mockData = {
    overview: {
      totalSubjects: 45,
      totalGroups: 120,
      totalSessions: 1200,
      completedSessions: 850,
      totalStudents: 3500,
      attendanceRate: 92,
      totalInstructors: 25,
      totalHours: 4500,
    },
    instructor: [
      { id: 1, name: 'TS. Nguyễn Văn A', code: 'GV001', subjects: ['IT001', 'IT002'], groups: 5, sessions: 50, completed: 45, totalHours: 150, students: 200, avgAttendance: 95 },
      { id: 2, name: 'ThS. Trần Thị B', code: 'GV002', subjects: ['IT003'], groups: 3, sessions: 30, completed: 30, totalHours: 90, students: 120, avgAttendance: 88 },
      { id: 3, name: 'PGS.TS. Lê Văn C', code: 'GV003', subjects: ['IT004', 'IT005'], groups: 4, sessions: 40, completed: 35, totalHours: 120, students: 160, avgAttendance: 91 },
    ],
    subject: [
      { id: 1, code: 'IT001', name: 'Lập trình hướng đối tượng', instructors: ['GV A', 'GV B'], groups: 10, students: 400, sessions: 100, completed: 80, totalHours: 300, avgAttendance: 90 },
      { id: 2, code: 'IT002', name: 'Cấu trúc dữ liệu', instructors: ['GV C'], groups: 8, students: 350, sessions: 80, completed: 70, totalHours: 240, avgAttendance: 85 },
    ],
    lab: [
      { id: 1, lab: 'Phòng máy A101', sessions: 50, hours: 150, utilization: 85 },
      { id: 2, lab: 'Phòng máy B203', sessions: 40, hours: 120, utilization: 65 },
      { id: 3, lab: 'Phòng máy C305', sessions: 20, hours: 60, utilization: 40 },
    ]
  };

  // Trả về đúng phần dữ liệu frontend đang cần
  return mockData[type] || null;
};

// ==================== MAIN COMPONENT ====================

export default function BaoCaoCuoiKy() {
  // State quản lý Filters
  const [selectedSemester, setSelectedSemester] = useState('hk1-2024');
  const [selectedReportType, setSelectedReportType] = useState('overview');
  
  // State quản lý Data
  const [semesters, setSemesters] = useState([]);
  const [reportData, setReportData] = useState(null); // Lưu dữ liệu trả về từ API (dynamic theo type)
  
  // State quản lý UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Load danh sách học kỳ khi component mount
  useEffect(() => {
    const loadSemesters = async () => {
      try {
        const data = await fetchSemesters();
        setSemesters(data);
      } catch (err) {
        console.error("Lỗi tải học kỳ:", err);
      }
    };
    loadSemesters();
  }, []);

  // 2. Load dữ liệu báo cáo khi Filter thay đổi
  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);
        setReportData(null); // Reset data cũ để tránh hiển thị nhầm

        const data = await fetchReportData(selectedSemester, selectedReportType);
        setReportData(data);
      } catch (err) {
        setError('Không thể tải dữ liệu báo cáo. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedSemester, selectedReportType]);

  /* =====================
     Render UI
     ===================== */
  
  // Component con: Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tổng hợp dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Component con: Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-red-600 text-lg font-bold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
            Tải lại trang
          </button>
        </div>
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
            <span className="text-gray-600">Báo cáo cuối kỳ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={28} />
            </div>
            Báo cáo công tác giảng dạy cuối kỳ
          </h1>
          <p className="text-gray-600">Tổng hợp và thống kê các hoạt động thực hành trong học kỳ</p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-4 z-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Select Semester */}
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id}>{sem.name}</option>
                ))}
              </select>

              {/* Select Report Type */}
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
              >
                <option value="overview">Tổng quan</option>
                <option value="instructor">Theo giảng viên</option>
                <option value="subject">Theo môn học</option>
                <option value="lab">Sử dụng phòng máy</option>
              </select>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Download size={18} />
                Xuất Excel
              </button>
              <button className="flex-1 lg:flex-none px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Download size={18} />
                Xuất PDF
              </button>
            </div>
          </div>
        </div>

        {/* ================= REPORT CONTENT ================= */}
        
        {/* 1. OVERVIEW REPORT */}
        {selectedReportType === 'overview' && reportData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard 
                title="Tổng môn học" 
                value={reportData.totalSubjects} 
                subtext={`${reportData.totalGroups} nhóm TH`}
                icon={BookOpen} 
                color="blue" 
              />
              <StatsCard 
                title="Buổi TH" 
                value={reportData.completedSessions} 
                subtext={`/ ${reportData.totalSessions} buổi`}
                icon={Calendar} 
                color="green" 
              />
              <StatsCard 
                title="Sinh viên" 
                value={reportData.totalStudents} 
                subtext="tham gia TH"
                icon={Users} 
                color="purple" 
              />
              <StatsCard 
                title="Tỷ lệ điểm danh" 
                value={`${reportData.attendanceRate}%`} 
                subtext="trung bình"
                icon={Award} 
                color="orange" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={24} />
                  Thống kê giảng viên
                </h3>
                <div className="space-y-4">
                  <SummaryRow label="Tổng số giảng viên" value={reportData.totalInstructors} />
                  <SummaryRow label="Tổng giờ giảng" value={`${reportData.totalHours}h`} />
                  <SummaryRow label="Trung bình/GV" value={`${(reportData.totalHours / reportData.totalInstructors).toFixed(1)}h`} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart className="text-green-600" size={24} />
                  Thống kê sinh viên
                </h3>
                <div className="space-y-4">
                  <SummaryRow label="Tổng sinh viên" value={reportData.totalStudents} />
                  <SummaryRow label="Trung bình/nhóm" value={`${(reportData.totalStudents / reportData.totalGroups).toFixed(0)} SV`} />
                  <SummaryRow label="Tỷ lệ đạt điểm danh" value={`${reportData.attendanceRate}%`} highlight="green" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* 2. INSTRUCTOR REPORT */}
        {selectedReportType === 'instructor' && Array.isArray(reportData) && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Báo cáo chi tiết theo giảng viên</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Giảng viên</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Môn học</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Số nhóm</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Tiến độ</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Giờ giảng</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Điểm danh</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.map(instructor => (
                    <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{instructor.name}</p>
                          <p className="text-xs text-gray-500">{instructor.code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {instructor.subjects.map((subject, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-100">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-800">{instructor.groups}</td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex flex-col items-center">
                            <span className="font-medium text-sm">{instructor.completed}/{instructor.sessions}</span>
                            <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                                <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${(instructor.completed/instructor.sessions)*100}%`}}></div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-800">{instructor.totalHours}h</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${instructor.avgAttendance >= 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {instructor.avgAttendance}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. SUBJECT REPORT */}
        {selectedReportType === 'subject' && Array.isArray(reportData) && (
          <div className="space-y-4">
            {reportData.map(subject => (
              <div key={subject.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-100">
                        {subject.code}
                      </span>
                      <h4 className="text-lg font-bold text-gray-800">{subject.name}</h4>
                    </div>
                    <div className="text-sm text-gray-600">
                      GV phụ trách: <span className="font-medium">{subject.instructors.join(', ')}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium">
                    <Eye size={16} />
                    Chi tiết
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <MetricBox label="Số nhóm" value={subject.groups} />
                  <MetricBox label="Sinh viên" value={subject.students} />
                  <MetricBox label="Tiến độ" value={`${subject.completed}/${subject.sessions}`} color="text-green-600" />
                  <MetricBox label="Giờ giảng" value={`${subject.totalHours}h`} />
                  <MetricBox label="Điểm danh" value={`${subject.avgAttendance}%`} color={subject.avgAttendance >= 90 ? "text-green-600" : "text-yellow-600"} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. LAB REPORT */}
        {selectedReportType === 'lab' && Array.isArray(reportData) && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
             <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Báo cáo hiệu suất sử dụng phòng máy</h3>
            </div>
            <div className="p-6 grid gap-4">
              {reportData.map((lab, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800 text-lg">{lab.lab}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lab.utilization >= 80 ? 'bg-green-100 text-green-700' :
                      lab.utilization >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {lab.utilization}% công suất
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Số buổi</p>
                      <p className="font-bold text-gray-800">{lab.sessions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Tổng giờ</p>
                      <p className="font-bold text-gray-800">{lab.hours}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Trung bình/tuần</p>
                      <p className="font-bold text-gray-800">{(lab.sessions / 16).toFixed(1)} buổi</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        lab.utilization >= 80 ? 'bg-green-500' :
                        lab.utilization >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${lab.utilization}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENTS (Cho gọn Code) ====================

const StatsCard = ({ title, value, subtext, icon: Icon, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600 text-blue-100',
    green: 'from-emerald-500 to-emerald-600 text-emerald-100',
    purple: 'from-purple-500 to-purple-600 text-purple-100',
    orange: 'from-orange-500 to-orange-600 text-orange-100',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <p className="opacity-90 text-sm font-medium">{title}</p>
        <Icon size={24} className="opacity-80" />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="opacity-80 text-sm mt-1">{subtext}</p>
    </div>
  );
};

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-600">{label}</span>
    <span className={`font-bold ${highlight === 'green' ? 'text-green-600' : 'text-gray-800'}`}>
      {value}
    </span>
  </div>
);

const MetricBox = ({ label, value, color = "text-gray-800" }) => (
  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);
