import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Filter, Calendar, Clock, Users, MapPin, CheckCircle, XCircle, AlertCircle, ChevronRight, BookOpen, User, Award } from 'lucide-react';

// ==================== DATA & API FUNCTIONS ====================
// TODO: Replace these with actual API calls

const fetchCourses = async () => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/student/courses/available');
  // return response.json();
  
  return [
    {
      id: 1,
      code: 'IT001',
      name: 'Lập trình hướng đối tượng',
      credits: 4,
      instructor: 'TS. Nguyễn Văn A',
      groups: [
        { id: 1, name: 'Nhóm 1', schedule: 'Thứ 2, 14:00-16:00', room: 'A101', slots: 40, registered: 35, status: 'available' },
        { id: 2, name: 'Nhóm 2', schedule: 'Thứ 4, 08:00-10:00', room: 'B203', slots: 40, registered: 40, status: 'full' },
        { id: 3, name: 'Nhóm 3', schedule: 'Thứ 6, 15:00-17:00', room: 'C305', slots: 35, registered: 28, status: 'available' }
      ]
    },
    {
      id: 2,
      code: 'IT002',
      name: 'Cơ sở dữ liệu',
      credits: 4,
      instructor: 'ThS. Trần Thị B',
      groups: [
        { id: 4, name: 'Nhóm 1', schedule: 'Thứ 3, 14:00-16:00', room: 'A102', slots: 40, registered: 30, status: 'available', registered_group: true },
      ]
    },
    {
      id: 3,
      code: 'IT003',
      name: 'Cấu trúc dữ liệu và giải thuật',
      credits: 4,
      instructor: 'PGS.TS. Lê Văn C',
      groups: [
        { id: 5, name: 'Nhóm 1', schedule: 'Thứ 2, 08:00-10:00', room: 'B201', slots: 45, registered: 42, status: 'available' },
        { id: 6, name: 'Nhóm 2', schedule: 'Thứ 5, 14:00-16:00', room: 'C306', slots: 45, registered: 45, status: 'full' }
      ]
    },
    {
      id: 4,
      code: 'IT004',
      name: 'Mạng máy tính',
      credits: 4,
      instructor: 'TS. Phạm Văn D',
      groups: [
        { id: 7, name: 'Nhóm 1', schedule: 'Thứ 4, 14:00-16:00', room: 'C305', slots: 35, registered: 20, status: 'available' },
        { id: 8, name: 'Nhóm 2', schedule: 'Thứ 6, 08:00-10:00', room: 'A101', slots: 35, registered: 25, status: 'available' }
      ]
    },
    {
      id: 5,
      code: 'IT005',
      name: 'Lập trình Web',
      credits: 4,
      instructor: 'ThS. Hoàng Thị E',
      groups: [
        { id: 9, name: 'Nhóm 1', schedule: 'Thứ 3, 08:00-10:00', room: 'B203', slots: 40, registered: 35, status: 'available', registered_group: true },
      ]
    },
    {
      id: 6,
      code: 'IT006',
      name: 'Trí tuệ nhân tạo',
      credits: 4,
      instructor: 'TS. Võ Văn F',
      groups: [
        { id: 10, name: 'Nhóm 1', schedule: 'Thứ 5, 08:00-10:00', room: 'C306', slots: 30, registered: 30, status: 'full' },
        { id: 11, name: 'Nhóm 2', schedule: 'Thứ 6, 14:00-16:00', room: 'A102', slots: 30, registered: 15, status: 'available' }
      ]
    }
  ];
};

const registerCourse = async (courseId, groupId) => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/student/courses/register', {
  //   method: 'POST',
  //   body: JSON.stringify({ courseId, groupId })
  // });
  // return response.json();
  
  console.log('Registering course:', courseId, 'group:', groupId);
  return { success: true, message: 'Đăng ký thành công' };
};

const unregisterCourse = async (courseId) => {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/student/courses/unregister/${courseId}`, {
  //   method: 'DELETE'
  // });
  // return response.json();
  
  console.log('Unregistering course:', courseId);
  return { success: true, message: 'Hủy đăng ký thành công' };
};

// ==================== CUSTOM HOOKS ====================

const useCourseRegistration = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([2, 5]); // Pre-registered courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null); // Track which button is loading

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleRegister = async (courseId, groupId) => {
    setProcessingId(courseId); // Start loading for this course
    try {
      const result = await registerCourse(courseId, groupId);
      if (result.success) {
        // 1. Update selected courses list
        setSelectedCourses(prev => [...prev, courseId]);
        
        // 2. OPTIMISTIC UI UPDATE - Update slots immediately
        setCourses(prevCourses => prevCourses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              groups: course.groups.map(g => 
                g.id === groupId 
                  ? { ...g, registered: g.registered + 1, registered_group: true }
                  : g
              )
            };
          }
          return course;
        }));
        
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Đăng ký thất bại' };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setProcessingId(null); // Stop loading
    }
  };

  const handleUnregister = async (courseId) => {
    try {
      const result = await unregisterCourse(courseId);
      if (result.success) {
        // 1. Remove from selected courses
        setSelectedCourses(prev => prev.filter(id => id !== courseId));
        
        // 2. UPDATE - Decrease slot count
        setCourses(prevCourses => prevCourses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              groups: course.groups.map(g => 
                g.registered_group 
                  ? { ...g, registered: g.registered - 1, registered_group: false }
                  : g
              )
            };
          }
          return course;
        }));
        
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || 'Hủy đăng ký thất bại' };
    } catch (err) {
      console.error('Error unregistering course:', err);
      return { success: false, message: err.message };
    }
  };

  return {
    courses,
    selectedCourses,
    loading,
    error,
    processingId,
    handleRegister,
    handleUnregister
  };
};

// ==================== UTILITY FUNCTIONS ====================

const getStatusBadge = (status) => {
  const config = {
    available: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Còn slot' },
    full: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Hết slot' },
    registered: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle, label: 'Đã đăng ký' }
  };
  const statusConfig = config[status] || config.available;
  const Icon = statusConfig.icon;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} flex items-center gap-1 w-fit`}>
      <Icon size={14} />
      {statusConfig.label}
    </span>
  );
};

// ==================== MAIN COMPONENT ====================

export default function DK_monTH() {
  const [selectedSemester, setSelectedSemester] = useState('HK1-2024');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);

  const {
    courses,
    selectedCourses,
    loading,
    error,
    processingId,
    handleRegister: registerAction,
    handleUnregister: unregisterAction
  } = useCourseRegistration();

  const handleRegisterClick = (courseId, groupId) => {
    setPendingCourse({ courseId, groupId });
    setShowConfirmModal(true);
  };

  const confirmRegister = async () => {
    if (pendingCourse) {
      const result = await registerAction(pendingCourse.courseId, pendingCourse.groupId);
      if (result.success) {
        alert(result.message);
      } else {
        alert('Lỗi: ' + result.message);
      }
    }
    setShowConfirmModal(false);
    setPendingCourse(null);
  };

  const handleUnregisterClick = async (courseId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đăng ký môn học này?')) {
      const result = await unregisterAction(courseId);
      if (result.success) {
        alert(result.message);
      } else {
        alert('Lỗi: ' + result.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách môn học...</p>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const filteredCourses = courses.filter(course => 
    (filterStatus === 'all' || 
     (filterStatus === 'registered' && selectedCourses.includes(course.id)) ||
     (filterStatus === 'available' && !selectedCourses.includes(course.id))) &&
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     course.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const registeredCount = selectedCourses.length;
  const totalCredits = courses.filter(c => selectedCourses.includes(c.id)).reduce((sum, c) => sum + c.credits, 0);

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
            <span className="text-gray-600">Đăng ký môn thực hành</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <ClipboardList className="text-white" size={28} />
            </div>
            Đăng ký môn thực hành
          </h1>
          <p className="text-gray-600">Chọn môn học và nhóm thực hành phù hợp với lịch học của bạn</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">Môn đã đăng ký</p>
              <BookOpen size={24} className="text-blue-200" />
            </div>
            <p className="text-4xl font-bold">{registeredCount}</p>
            <p className="text-blue-100 text-sm mt-2">/ 8 môn tối đa</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm">Tổng tín chỉ TH</p>
              <Award size={24} className="text-purple-200" />
            </div>
            <p className="text-4xl font-bold">{totalCredits}</p>
            <p className="text-purple-100 text-sm mt-2">tín chỉ</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Học kỳ</p>
              <Calendar size={24} className="text-green-200" />
            </div>
            <p className="text-2xl font-bold">HK1 2024-2025</p>
            <p className="text-green-100 text-sm mt-2">Đang mở đăng ký</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm môn học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả môn học</option>
                <option value="registered">Đã đăng ký</option>
                <option value="available">Chưa đăng ký</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle size={16} />
              <span>Thời gian đăng ký: 01/12/2024 - 31/12/2024</span>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Course Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                        {course.code}
                      </span>
                      {selectedCourses.includes(course.id) && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
                          <CheckCircle size={14} />
                          Đã đăng ký
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User size={16} />
                        {course.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award size={16} />
                        {course.credits} tín chỉ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-gray-600 uppercase mb-4">Nhóm thực hành</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {course.groups.map(group => (
                    <div
                      key={group.id}
                      className={`border rounded-lg p-4 transition-all ${
                        group.registered_group
                          ? 'border-blue-300 bg-blue-50'
                          : group.status === 'full'
                          ? 'border-gray-200 bg-gray-50 opacity-60'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-1">{group.name}</h5>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              {group.schedule}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin size={14} />
                              {group.room}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(group.status)}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Số lượng:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                group.registered / group.slots > 0.8 ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(group.registered / group.slots) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {group.registered}/{group.slots}
                          </span>
                        </div>
                      </div>

                      {group.registered_group ? (
                        <button
                          onClick={() => handleUnregisterClick(course.id)}
                          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                          Hủy đăng ký
                        </button>
                      ) : group.status === 'full' ? (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                        >
                          Đã hết slot
                        </button>
                      ) : selectedCourses.includes(course.id) ? (
                        <button
                          disabled
                          className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium"
                        >
                          Đã đăng ký nhóm khác
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegisterClick(course.id, group.id)}
                          disabled={processingId === course.id}
                          className={`w-full px-4 py-2 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${
                            processingId === course.id 
                              ? 'bg-gray-400 cursor-wait' 
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                          }`}
                        >
                          {processingId === course.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Đang xử lý...
                            </>
                          ) : (
                            'Đăng ký ngay'
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <AlertCircle className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                Xác nhận đăng ký
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn đăng ký môn học này? Sau khi đăng ký, bạn sẽ không thể thay đổi nhóm thực hành.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmRegister}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
