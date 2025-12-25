import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, BookOpen, ChevronRight, ChevronLeft, Filter, Download, Eye, Grid } from 'lucide-react';

// ==================== 1. MOCK API SERVICE ====================

const DB = {
  schedules: [
    {
      id: 1, subject: 'Lập trình hướng đối tượng', subjectCode: 'IT001', group: 'Nhóm 1',
      date: '2024-12-23', dayOfWeek: 'Thứ 2', time: '14:00 - 16:00', room: 'A101',
      instructor: 'TS. Nguyễn Văn A', students: 38, status: 'upcoming'
    },
    {
      id: 2, subject: 'Lập trình Web', subjectCode: 'IT005', group: 'Nhóm 2',
      date: '2024-12-24', dayOfWeek: 'Thứ 3', time: '08:00 - 10:00', room: 'B203',
      instructor: 'ThS. Hoàng Thị E', students: 35, status: 'upcoming'
    },
    {
      id: 3, subject: 'Cơ sở dữ liệu', subjectCode: 'IT002', group: 'Nhóm 2',
      date: '2024-12-25', dayOfWeek: 'Thứ 4', time: '15:00 - 17:00', room: 'C305',
      instructor: 'ThS. Trần Thị B', students: 40, status: 'upcoming'
    },
    {
      id: 4, subject: 'Mạng máy tính', subjectCode: 'IT004', group: 'Nhóm 1',
      date: '2024-12-26', dayOfWeek: 'Thứ 5', time: '08:00 - 10:00', room: 'A101',
      instructor: 'TS. Phạm Văn D', students: 30, status: 'completed'
    }
  ]
};

const api = {
  getSchedules: async () => {
    await new Promise(r => setTimeout(r, 500));
    return DB.schedules;
  }
};

// ==================== 2. MAIN COMPONENT ====================

// --- LƯU Ý DÒNG NÀY: Phải có export default ---
export default function XemLichNhomTH() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getSchedules();
        setSchedules(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredSchedules = schedules.filter(s => 
    s.subject.toLowerCase().includes(filterText.toLowerCase()) ||
    s.subjectCode.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) {
    return <div className="p-10 text-center">Đang tải lịch...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-gray-500">Giáo vụ</span>
            <ChevronRight size={20} className="text-gray-400" />
            <span className="text-gray-600">Xem lịch nhóm thực hành</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={28} />
            </div>
            Lịch Nhóm Thực Hành
          </h1>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center">
            <div className="relative w-96">
                <input 
                    type="text" 
                    placeholder="Tìm theo môn học..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Download size={18} /> Xuất Excel
            </button>
        </div>

        {/* List */}
        <div className="space-y-4">
            {filteredSchedules.map(schedule => (
                <div key={schedule.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">{schedule.subjectCode}</span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">{schedule.group}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{schedule.subject}</h3>
                        <div className="flex gap-6 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-2"><Calendar size={16}/> {schedule.dayOfWeek}, {schedule.date}</span>
                            <span className="flex items-center gap-2"><Clock size={16}/> {schedule.time}</span>
                            <span className="flex items-center gap-2"><MapPin size={16}/> {schedule.room}</span>
                            <span className="flex items-center gap-2"><Users size={16}/> {schedule.students} SV</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">GV: {schedule.instructor}</p>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={20} />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
