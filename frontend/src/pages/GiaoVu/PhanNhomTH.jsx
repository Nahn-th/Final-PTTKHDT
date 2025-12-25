import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Download, Upload, ChevronRight, BookOpen, UserPlus, Shuffle, CheckCircle, AlertCircle, Filter, Eye } from 'lucide-react';


const DB = {
  subjects: [
    { id: 'IT002', name: 'Cơ sở dữ liệu', students: 120, groups: 3, assigned: 115 },
    { id: 'IT005', name: 'Lập trình Web', students: 95, groups: 0, assigned: 0 },
    { id: 'IT001', name: 'Lập trình OOP', students: 108, groups: 3, assigned: 108 },
    { id: 'IT004', name: 'Mạng máy tính', students: 86, groups: 2, assigned: 86 }
  ],
  groups: [
    {
      id: 1, name: 'Nhóm 1', subjectId: 'IT002', capacity: 40, assigned: 38, status: 'active',
      students: [
        { id: 1, code: '21520001', name: 'Nguyễn Thị Mai', class: 'KHTN2021' },
        { id: 2, code: '21520002', name: 'Trần Văn Nam', class: 'KHTN2021' },
        { id: 3, code: '21520003', name: 'Lê Thị Hoa', class: 'KHTN2021' }
      ]
    },
    {
      id: 2, name: 'Nhóm 2', subjectId: 'IT002', capacity: 40, assigned: 40, status: 'full',
      students: [
        { id: 4, code: '21520004', name: 'Phạm Văn Đức', class: 'KHTN2021' },
        { id: 5, code: '21520005', name: 'Võ Thị Lan', class: 'KHTN2021' }
      ]
    },
    {
      id: 3, name: 'Nhóm 3', subjectId: 'IT002', capacity: 40, assigned: 37, status: 'active',
      students: [
        { id: 6, code: '21520006', name: 'Đặng Văn Khoa', class: 'KHTN2021' },
        { id: 7, code: '21520007', name: 'Bùi Thị Thu', class: 'KHTN2021' }
      ]
    }
  ],
  unassignedStudents: [
    { id: 8, code: '21520008', name: 'Huỳnh Văn Long', class: 'KHTN2021', selected: false },
    { id: 9, code: '21520009', name: 'Trương Thị Kim', class: 'KHTN2021', selected: false },
    { id: 10, code: '21520010', name: 'Ngô Văn Tài', class: 'KHTN2021', selected: false },
    { id: 11, code: '21520011', name: 'Phan Thị Nga', class: 'KHTN2021', selected: false },
    { id: 12, code: '21520012', name: 'Lý Văn Phong', class: 'KHTN2021', selected: false }
  ]
};

const api = {
  // Lấy danh sách môn học và sinh viên chưa phân nhóm
  getInitialData: async () => {
    await new Promise(r => setTimeout(r, 500)); // Giả lập độ trễ mạng
    return { 
      subjects: DB.subjects, 
      unassigned: DB.unassignedStudents 
    };
  },

  // Lấy danh sách nhóm theo môn học
  getGroupsBySubject: async (subjectId) => {
    await new Promise(r => setTimeout(r, 300));
    return DB.groups.filter(g => g.subjectId === subjectId);
  },

  // Tạo nhóm mới (POST)
  createGroup: async (newGroupData) => {
    await new Promise(r => setTimeout(r, 800));
    // Logic giả lập thêm vào DB
    const newId = DB.groups.length + 1;
    const newGroup = {
        id: newId,
        ...newGroupData,
        assigned: 0,
        status: 'active',
        students: []
    };
    DB.groups.push(newGroup);
    
    // Cập nhật số lượng nhóm trong môn học
    const subject = DB.subjects.find(s => s.id === newGroupData.subjectId);
    if(subject) subject.groups += 1;

    return { success: true, message: 'Tạo nhóm thành công' };
  },

  // Phân tự động (POST)
  autoAssign: async (subjectId) => {
    await new Promise(r => setTimeout(r, 1000));
    // Giả lập logic phân nhóm
    return { success: true, message: `Đã phân 5 sinh viên vào các nhóm của ${subjectId}` };
  }
};

// ==================== 2. MAIN COMPONENT ====================

export default function PhanNhomTH() {
  // --- State Management ---
  const [subjects, setSubjects] = useState([]);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  
  const [selectedSubjectId, setSelectedSubjectId] = useState('IT002');
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [autoAssignModal, setAutoAssignModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading cho nút bấm

  // --- Effects (Gọi API) ---
  
  // 1. Load dữ liệu ban đầu
  useEffect(() => {
    const loadInit = async () => {
        try {
            const data = await api.getInitialData();
            setSubjects(data.subjects);
            setUnassignedStudents(data.unassigned);
        } catch (e) {
            console.error("Lỗi tải data:", e);
        } finally {
            setLoading(false);
        }
    };
    loadInit();
  }, []);

  // 2. Load Groups khi chọn môn khác
  useEffect(() => {
    const loadGroups = async () => {
        if (!selectedSubjectId) return;
        const data = await api.getGroupsBySubject(selectedSubjectId);
        setGroups(data);
    };
    loadGroups();
  }, [selectedSubjectId]);

  // --- Handlers (Xử lý hành động) ---

  const handleCreateGroup = async (groupData) => {
    setIsSubmitting(true);
    try {
        const res = await api.createGroup({ ...groupData, subjectId: selectedSubjectId });
        if(res.success) {
            // Reload lại danh sách nhóm
            const newGroups = await api.getGroupsBySubject(selectedSubjectId);
            setGroups(newGroups);
            setShowCreateModal(false);
        }
    } catch (e) {
        alert("Lỗi tạo nhóm");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleAutoAssign = async () => {
      setIsSubmitting(true);
      try {
          const res = await api.autoAssign(selectedSubjectId);
          if(res.success) {
              alert(res.message);
              // Ở đây thực tế sẽ cần reload lại groups và unassignedStudents
              setAutoAssignModal(false);
          }
      } catch (e) {
          alert("Lỗi phân nhóm");
      } finally {
          setIsSubmitting(false);
      }
  }

  // --- Derived State ---
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  
  const getStatusBadge = (status) => {
    const config = {
      active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Còn slot' },
      full: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã đủ' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ xử lý' }
    };
    const c = config[status] || config.active;
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
            <span className="text-gray-600">Phân nhóm thực hành</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={28} />
            </div>
            Phân nhóm thực hành
          </h1>
          <p className="text-gray-600">Chia sinh viên thành các nhóm thực hành theo môn học</p>
        </div>

        {/* Subject Selection */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Chọn môn học:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="flex-1 lg:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.id} - {subject.name} ({subject.assigned}/{subject.students} SV)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <button
                onClick={() => setAutoAssignModal(true)}
                className="flex-1 lg:flex-none px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
              >
                <Shuffle size={18} />
                Phân tự động
              </button>
              <button className="flex-1 lg:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Upload size={18} />
                Nhập Excel
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 lg:flex-none px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Tạo nhóm mới
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {currentSubject && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-blue-100 text-sm mb-2">Tổng sinh viên</p>
              <p className="text-4xl font-bold">{currentSubject.students}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-green-100 text-sm mb-2">Đã phân nhóm</p>
              <p className="text-4xl font-bold">{currentSubject.assigned}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm mb-2">Số nhóm</p>
              <p className="text-4xl font-bold">{currentSubject.groups}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <p className="text-orange-100 text-sm mb-2">Chưa phân</p>
              <p className="text-4xl font-bold">{currentSubject.students - currentSubject.assigned}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Danh sách nhóm</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                <Download size={16} />
                Xuất danh sách
              </button>
            </div>

            {groups.length > 0 ? (
              groups.map(group => (
                <div key={group.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-800">{group.name}</h4>
                        {getStatusBadge(group.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Sĩ số: {group.assigned}/{group.capacity}</span>
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${group.assigned >= group.capacity ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${(group.assigned / group.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Student Preview */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Sinh viên trong nhóm:</p>
                    <div className="space-y-2">
                      {group.students.slice(0, 3).map(student => (
                        <div key={student.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-semibold">
                              {student.name.split(' ').pop().charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.code} - {student.class}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {group.assigned > 3 && (
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Xem thêm {group.assigned - 3} sinh viên →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-gray-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có nhóm nào</h3>
                <p className="text-gray-600 mb-6">Bắt đầu bằng cách tạo nhóm mới hoặc phân tự động</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Tạo nhóm đầu tiên
                </button>
              </div>
            )}
          </div>

          {/* Unassigned Students */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-600" size={20} />
              Chưa phân nhóm ({unassignedStudents.length})
            </h3>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm sinh viên..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {unassignedStudents.map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-xs font-semibold flex-shrink-0 group-hover:bg-white">
                      {student.name.split(' ').pop().charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{student.name}</p>
                      <p className="text-xs text-gray-500 truncate">{student.code}</p>
                    </div>
                  </div>
                  <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors flex-shrink-0">
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Phân vào nhóm đã chọn
              </button>
            </div>
          </div>
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <CreateGroupModal 
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateGroup}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Auto Assign Modal */}
        {autoAssignModal && (
           <AutoAssignModal 
             count={unassignedStudents.length}
             onClose={() => setAutoAssignModal(false)}
             onConfirm={handleAutoAssign}
             isSubmitting={isSubmitting}
           />
        )}
      </div>
    </div>
  );
}

// ==================== 3. MODAL COMPONENTS (Tách ra cho gọn) ====================

function CreateGroupModal({ onClose, onSubmit, isSubmitting }) {
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(40);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 scale-in-95 animate-in">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tạo nhóm mới</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhóm</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nhóm 4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sức chứa</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                  onClick={() => onSubmit({ name, capacity })}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                   {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Plus size={18} />}
                   Tạo nhóm
                </button>
              </div>
            </div>
        </div>
    )
}

function AutoAssignModal({ count, onClose, onConfirm, isSubmitting }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 scale-in-95 animate-in">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Shuffle className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Phân nhóm tự động</h3>
              <p className="text-gray-600 text-center mb-6">
                Hệ thống sẽ tự động chia <strong>{count}</strong> sinh viên chưa có nhóm vào các nhóm hiện có một cách đồng đều.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                   {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
                  Xác nhận phân
                </button>
              </div>
            </div>
        </div>
    )
}
