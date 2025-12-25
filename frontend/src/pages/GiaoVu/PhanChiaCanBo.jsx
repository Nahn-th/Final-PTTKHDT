import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Plus, Edit2, Trash2, ChevronRight, BookOpen, Users, Calendar, Award, CheckCircle, AlertCircle, X, Download, Upload, Filter } from 'lucide-react';

// ==================== MOCK API SERVICE ====================

const DB = {
  instructors: [
    { id: 1, code: 'CB001', name: 'TS. Nguyễn Văn A', email: 'nva@uit.edu.vn', specialization: 'Lập trình Web, OOP', assignedGroups: 4, totalHours: 60, maxHours: 100 },
    { id: 2, code: 'CB002', name: 'ThS. Trần Thị B', email: 'ttb@uit.edu.vn', specialization: 'Cơ sở dữ liệu', assignedGroups: 3, totalHours: 45, maxHours: 100 },
    { id: 3, code: 'CB003', name: 'TS. Phạm Văn D', email: 'pvd@uit.edu.vn', specialization: 'Mạng máy tính', assignedGroups: 2, totalHours: 30, maxHours: 100 },
    { id: 4, code: 'CB004', name: 'ThS. Hoàng Thị E', email: 'hte@uit.edu.vn', specialization: 'Lập trình Web', assignedGroups: 2, totalHours: 30, maxHours: 100 },
    { id: 5, code: 'CB005', name: 'TS. Lê Văn C', email: 'lvc@uit.edu.vn', specialization: 'Trí tuệ nhân tạo', assignedGroups: 0, totalHours: 0, maxHours: 100 }
  ],
  subjects: [
    {
      id: 'IT002', code: 'IT002', name: 'Cơ sở dữ liệu',
      groups: [
        { id: 1, name: 'Nhóm 1', students: 38, instructorId: 2, assigned: true },
        { id: 2, name: 'Nhóm 2', students: 40, instructorId: 2, assigned: true },
        { id: 3, name: 'Nhóm 3', students: 37, instructorId: 2, assigned: true }
      ]
    },
    {
      id: 'IT005', code: 'IT005', name: 'Lập trình Web',
      groups: [
        { id: 4, name: 'Nhóm 1', students: 35, instructorId: 4, assigned: true },
        { id: 5, name: 'Nhóm 2', students: 35, instructorId: 1, assigned: true }
      ]
    },
    {
      id: 'IT001', code: 'IT001', name: 'Lập trình OOP',
      groups: [
        { id: 6, name: 'Nhóm 1', students: 36, instructorId: 1, assigned: true },
        { id: 7, name: 'Nhóm 2', students: 36, instructorId: 1, assigned: true },
        { id: 8, name: 'Nhóm 3', students: 36, instructorId: null, assigned: false }
      ]
    },
    {
      id: 'IT004', code: 'IT004', name: 'Mạng máy tính',
      groups: [
        { id: 9, name: 'Nhóm 1', students: 43, instructorId: 3, assigned: true },
        { id: 10, name: 'Nhóm 2', students: 43, instructorId: null, assigned: false }
      ]
    }
  ]
};

const api = {
  getData: async () => {
    await new Promise(r => setTimeout(r, 600)); // Simulate network
    return { instructors: DB.instructors, subjects: DB.subjects };
  },
  
  assignInstructor: async (subjectId, groupId, instructorId) => {
    await new Promise(r => setTimeout(r, 800)); // Simulate processing
    // Logic cập nhật giả lập (Trong thực tế BE sẽ xử lý)
    const hoursPerGroup = 15; 
    
    // 1. Cập nhật Group
    const subject = DB.subjects.find(s => s.id === subjectId);
    const group = subject.groups.find(g => g.id === groupId);
    const oldInstructorId = group.instructorId;
    
    group.instructorId = parseInt(instructorId);
    group.assigned = true;

    // 2. Cập nhật Instructor (Tăng người mới)
    const newInstructor = DB.instructors.find(i => i.id === parseInt(instructorId));
    if (newInstructor) {
        newInstructor.assignedGroups += 1;
        newInstructor.totalHours += hoursPerGroup;
    }

    // 3. (Optional) Giảm người cũ nếu là Edit
    if (oldInstructorId) {
        const oldInstructor = DB.instructors.find(i => i.id === oldInstructorId);
        if (oldInstructor) {
            oldInstructor.assignedGroups -= 1;
            oldInstructor.totalHours -= hoursPerGroup;
        }
    }

    return { success: true, message: 'Phân công thành công' };
  }
};

// ==================== MAIN COMPONENT ====================

export default function PhanChiaCanBo() {
  // --- State ---
  const [data, setData] = useState({ instructors: [], subjects: [] });
  const [loading, setLoading] = useState(true);
  
  const [filterSubject, setFilterSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedInstructorDetail, setSelectedInstructorDetail] = useState(null); // Để xem chi tiết GV
  const [assigningGroup, setAssigningGroup] = useState(null); // Group đang được chọn để phân công
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading khi bấm nút Assign

  // --- Load Data ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await api.getData();
    setData(res);
    setLoading(false);
  };

  // --- Handlers ---
  const handleOpenAssignModal = (subjectId, group) => {
    setAssigningGroup({ ...group, subjectId });
  };

  const handleConfirmAssign = async (instructorId) => {
    if (!assigningGroup || !instructorId) return;
    
    setIsSubmitting(true);
    try {
        await api.assignInstructor(assigningGroup.subjectId, assigningGroup.id, instructorId);
        await loadData(); // Reload data để cập nhật giao diện
        setAssigningGroup(null); // Đóng modal
    } catch (error) {
        alert('Có lỗi xảy ra');
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- Derived State (Tính toán hiển thị) ---
  const filteredSubjects = filterSubject === 'all' 
    ? data.subjects 
    : data.subjects.filter(s => s.id === filterSubject);

  const filteredInstructors = data.instructors.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInstructors = data.instructors.length;
  const assignedInstructors = data.instructors.filter(i => i.assignedGroups > 0).length;
  const totalGroups = data.subjects.reduce((sum, s) => sum + s.groups.length, 0);
  const assignedGroupsCount = data.subjects.reduce((sum, s) => sum + s.groups.filter(g => g.assigned).length, 0);

  // Helper tìm tên GV theo ID
  const getInstructorName = (id) => {
      const ins = data.instructors.find(i => i.id === id);
      return ins ? ins.name : 'Chưa phân công';
  };

  const getWorkloadColor = (current, max) => {
    const p = (current / max) * 100;
    if (p >= 80) return 'bg-red-500';
    if (p >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
            <span className="text-gray-600">Phân chia cán bộ giảng dạy</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <UserCheck className="text-white" size={28} />
            </div>
            Phân chia cán bộ giảng dạy
          </h1>
          <p className="text-gray-600">Phân công giảng viên hướng dẫn cho các nhóm thực hành</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm mb-2">Tổng giảng viên</p>
            <p className="text-4xl font-bold">{totalInstructors}</p>
            <p className="text-blue-100 text-sm mt-1">{assignedInstructors} đã phân công</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-green-100 text-sm mb-2">Nhóm đã phân</p>
            <p className="text-4xl font-bold">{assignedGroupsCount}</p>
            <p className="text-green-100 text-sm mt-1">/ {totalGroups} nhóm</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-orange-100 text-sm mb-2">Nhóm chưa phân</p>
            <p className="text-4xl font-bold">{totalGroups - assignedGroupsCount}</p>
            <p className="text-orange-100 text-sm mt-1">cần xử lý</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-purple-100 text-sm mb-2">Tổng giờ giảng</p>
            <p className="text-4xl font-bold">{data.instructors.reduce((sum, i) => sum + i.totalHours, 0)}</p>
            <p className="text-purple-100 text-sm mt-1">giờ quy đổi</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-4 z-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap"><Filter size={16} className="inline mr-1"/>Lọc môn:</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="flex-1 lg:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="all">Tất cả môn học</option>
                {data.subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <button className="flex-1 lg:flex-none px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Xuất Excel
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Instructors List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col h-[calc(100vh-300px)] sticky top-24">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Danh sách giảng viên</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm giảng viên..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {filteredInstructors.map(instructor => (
                        <div
                        key={instructor.id}
                        className="bg-gray-50 rounded-lg p-3 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all cursor-pointer group"
                        onClick={() => setSelectedInstructorDetail(instructor)}
                        >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {instructor.name.split(' ').pop().charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm truncate">{instructor.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{instructor.specialization}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Nhóm: {instructor.assignedGroups}</span>
                                <span className="font-semibold text-gray-700">{instructor.totalHours}/{instructor.maxHours}h</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${getWorkloadColor(instructor.totalHours, instructor.maxHours)}`}
                                    style={{ width: `${Math.min((instructor.totalHours / instructor.maxHours) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Right: Groups Assignment */}
          <div className="lg:col-span-2 space-y-4">
            {filteredSubjects.map(subject => (
              <div key={subject.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-semibold">
                      {subject.code}
                    </span>
                    <div>
                        <h4 className="font-bold text-gray-800">{subject.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{subject.groups.length} nhóm thực hành</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {subject.groups.map(group => (
                    <div
                      key={group.id}
                      className={`border rounded-lg p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        group.assigned
                          ? 'border-green-200 bg-green-50/50'
                          : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h5 className="font-semibold text-gray-800">{group.name}</h5>
                          {group.assigned ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                              <CheckCircle size={10} /> Đã phân
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium flex items-center gap-1">
                              <AlertCircle size={10} /> Chưa phân
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><Users size={14}/> {group.students} SV</span>
                            {group.instructorId && (
                                <span className="flex items-center gap-1 font-medium text-gray-800">
                                    <UserCheck size={14} className="text-orange-500"/> 
                                    {getInstructorName(group.instructorId)}
                                </span>
                            )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {group.assigned ? (
                          <button 
                            onClick={() => handleOpenAssignModal(subject.id, group)}
                            className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:border-orange-300 hover:text-orange-600 text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <Edit2 size={14} /> Thay đổi
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenAssignModal(subject.id, group)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
                          >
                            <Plus size={16} />
                            Phân công
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Instructor Details */}
        {selectedInstructorDetail && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setSelectedInstructorDetail(null)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-3">
                  {selectedInstructorDetail.name.split(' ').pop().charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{selectedInstructorDetail.name}</h3>
                <p className="text-gray-500">{selectedInstructorDetail.code}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {selectedInstructorDetail.specialization}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-100">
                  <p className="text-xs text-gray-500 mb-1">Nhóm phụ trách</p>
                  <p className="text-2xl font-bold text-orange-700">{selectedInstructorDetail.assignedGroups}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">Giờ giảng</p>
                  <p className="text-2xl font-bold text-blue-700">{selectedInstructorDetail.totalHours}h</p>
                </div>
              </div>

              <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Thông tin liên hệ:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex justify-between border-b border-gray-100 pb-2">
                          <span>Email:</span> <span className="font-medium text-gray-800">{selectedInstructorDetail.email}</span>
                      </p>
                      <p className="flex justify-between pt-1">
                          <span>Điện thoại:</span> <span className="font-medium text-gray-800">0909 123 456</span>
                      </p>
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Assign Instructor */}
        {assigningGroup && (
            <AssignModal 
                group={assigningGroup}
                instructors={data.instructors}
                onClose={() => setAssigningGroup(null)}
                onConfirm={handleConfirmAssign}
                isSubmitting={isSubmitting}
            />
        )}

      </div>
    </div>
  );
}

// Tách Modal ra component con để code gọn hơn
function AssignModal({ group, instructors, onClose, onConfirm, isSubmitting }) {
    const [selectedId, setSelectedId] = useState('');

    // Sắp xếp GV: Ưu tiên người ít giờ dạy lên đầu
    const sortedInstructors = [...instructors].sort((a, b) => a.totalHours - b.totalHours);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 scale-in-95 animate-in">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Phân công giảng viên</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Cho nhóm: <span className="font-semibold text-orange-600">{group.name}</span>
                </p>

                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chọn giảng viên</label>
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                        {sortedInstructors.map(ins => (
                            <label 
                                key={ins.id} 
                                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors ${selectedId == ins.id ? 'bg-orange-50' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="radio" 
                                        name="instructor" 
                                        value={ins.id}
                                        checked={selectedId == ins.id}
                                        onChange={(e) => setSelectedId(e.target.value)}
                                        className="text-orange-600 focus:ring-orange-500"
                                    />
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">{ins.name}</p>
                                        <p className="text-xs text-gray-500">{ins.specialization}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                        (ins.totalHours/ins.maxHours) >= 0.8 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {ins.totalHours}h
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
                </div>

                <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                    Hủy
                </button>
                <button
                    onClick={() => onConfirm(selectedId)}
                    disabled={!selectedId || isSubmitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <CheckCircle size={18} />
                    )}
                    Xác nhận
                </button>
                </div>
            </div>
        </div>
    );
}
