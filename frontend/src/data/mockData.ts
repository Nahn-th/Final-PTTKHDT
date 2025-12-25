// src/data/mockData.ts
import { 
  Course, Schedule, Instructor, Subject, Group, 
  InstructorReport, SubjectReport, LabUsageReport,
  WeekSchedule, PublicationHistory, Activity, Student
} from '../types';

// ==================== COURSES DATA ====================
export const mockCourses: Course[] = [
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

// ==================== SCHEDULES DATA ====================
export const mockSchedules: Schedule[] = [
  {
    id: 1,
    subject: 'Cơ sở dữ liệu',
    subjectCode: 'IT002',
    color: 'blue',
    group: 'Nhóm 1',
    date: '2024-12-23',
    dayOfWeek: 'Thứ 2',
    time: '14:00 - 16:00',
    room: 'A102',
    instructor: 'ThS. Trần Thị B',
    session: 'Buổi 5',
    topic: 'Thiết kế cơ sở dữ liệu quan hệ',
    status: 'upcoming',
    myComputer: 'Máy 15',
    attendanceStatus: null
  },
  {
    id: 2,
    subject: 'Lập trình Web',
    subjectCode: 'IT005',
    color: 'purple',
    group: 'Nhóm 1',
    date: '2024-12-24',
    dayOfWeek: 'Thứ 3',
    time: '08:00 - 10:00',
    room: 'B203',
    instructor: 'ThS. Hoàng Thị E',
    session: 'Buổi 7',
    topic: 'React Hooks và State Management',
    status: 'upcoming',
    myComputer: 'Máy 08',
    attendanceStatus: null
  },
  {
    id: 3,
    subject: 'Lập trình OOP',
    subjectCode: 'IT001',
    color: 'green',
    group: 'Nhóm 3',
    date: '2024-12-25',
    dayOfWeek: 'Thứ 4',
    time: '15:00 - 17:00',
    room: 'C305',
    instructor: 'TS. Nguyễn Văn A',
    session: 'Buổi 6',
    topic: 'Kế thừa và Đa hình trong Java',
    status: 'upcoming',
    myComputer: 'Máy 22',
    attendanceStatus: null
  },
  {
    id: 4,
    subject: 'Cơ sở dữ liệu',
    subjectCode: 'IT002',
    color: 'blue',
    group: 'Nhóm 1',
    date: '2024-12-20',
    dayOfWeek: 'Thứ 6',
    time: '14:00 - 16:00',
    room: 'A102',
    instructor: 'ThS. Trần Thị B',
    session: 'Buổi 4',
    topic: 'SQL và truy vấn nâng cao',
    status: 'completed',
    myComputer: 'Máy 15',
    attendanceStatus: 'present'
  },
  {
    id: 5,
    subject: 'Mạng máy tính',
    subjectCode: 'IT004',
    color: 'orange',
    group: 'Nhóm 2',
    date: '2024-12-19',
    dayOfWeek: 'Thứ 5',
    time: '14:00 - 16:00',
    room: 'C305',
    instructor: 'TS. Phạm Văn D',
    session: 'Buổi 3',
    topic: 'Cấu hình Router và Switch',
    status: 'completed',
    myComputer: 'Máy 10',
    attendanceStatus: 'present'
  },
  {
    id: 6,
    subject: 'Lập trình Web',
    subjectCode: 'IT005',
    color: 'purple',
    group: 'Nhóm 1',
    date: '2024-12-17',
    dayOfWeek: 'Thứ 3',
    time: '08:00 - 10:00',
    room: 'B203',
    instructor: 'ThS. Hoàng Thị E',
    session: 'Buổi 6',
    topic: 'Component và Props trong React',
    status: 'completed',
    myComputer: 'Máy 08',
    attendanceStatus: 'absent'
  }
];

// ==================== SUBJECTS DATA ====================
export const mockSubjects: Subject[] = [
  { id: 'IT001', code: 'IT001', name: 'Lập trình hướng đối tượng', credits: 4, semester: 'HK1-2024' },
  { id: 'IT002', code: 'IT002', name: 'Cơ sở dữ liệu', credits: 4, semester: 'HK1-2024' },
  { id: 'IT003', code: 'IT003', name: 'Cấu trúc dữ liệu và giải thuật', credits: 4, semester: 'HK1-2024' },
  { id: 'IT004', code: 'IT004', name: 'Mạng máy tính', credits: 4, semester: 'HK1-2024' },
  { id: 'IT005', code: 'IT005', name: 'Lập trình Web', credits: 4, semester: 'HK1-2024' },
  { id: 'IT006', code: 'IT006', name: 'Trí tuệ nhân tạo', credits: 4, semester: 'HK1-2024' }
];

// ==================== INSTRUCTORS DATA ====================
export const mockInstructors: Instructor[] = [
  {
    id: 1,
    code: 'CB001',
    name: 'TS. Nguyễn Văn A',
    email: 'nva@uit.edu.vn',
    phone: '0901234567',
    specialization: 'Lập trình Web, OOP',
    assignedGroups: 4,
    totalHours: 32,
    maxHours: 40,
    subjects: [
      { code: 'IT001', name: 'Lập trình OOP', groups: 2, hours: 16 },
      { code: 'IT005', name: 'Lập trình Web', groups: 2, hours: 16 }
    ]
  },
  {
    id: 2,
    code: 'CB002',
    name: 'ThS. Trần Thị B',
    email: 'ttb@uit.edu.vn',
    phone: '0901234568',
    specialization: 'Cơ sở dữ liệu',
    assignedGroups: 3,
    totalHours: 24,
    maxHours: 40,
    subjects: [
      { code: 'IT002', name: 'Cơ sở dữ liệu', groups: 3, hours: 24 }
    ]
  },
  {
    id: 3,
    code: 'CB003',
    name: 'TS. Phạm Văn D',
    email: 'pvd@uit.edu.vn',
    phone: '0901234570',
    specialization: 'Mạng máy tính',
    assignedGroups: 2,
    totalHours: 16,
    maxHours: 40,
    subjects: [
      { code: 'IT004', name: 'Mạng máy tính', groups: 2, hours: 16 }
    ]
  },
  {
    id: 4,
    code: 'CB004',
    name: 'ThS. Hoàng Thị E',
    email: 'hte@uit.edu.vn',
    phone: '0901234571',
    specialization: 'Lập trình Web',
    assignedGroups: 2,
    totalHours: 16,
    maxHours: 40,
    subjects: [
      { code: 'IT005', name: 'Lập trình Web', groups: 2, hours: 16 }
    ]
  },
  {
    id: 5,
    code: 'CB005',
    name: 'TS. Lê Văn C',
    email: 'lvc@uit.edu.vn',
    phone: '0901234569',
    specialization: 'Trí tuệ nhân tạo',
    assignedGroups: 0,
    totalHours: 0,
    maxHours: 40,
    subjects: []
  }
];

// ==================== GROUPS DATA ====================
export const mockGroups: Group[] = [
  {
    id: 1,
    name: 'Nhóm 1',
    subjectId: 'IT002',
    subjectCode: 'IT002',
    capacity: 40,
    assigned: 38,
    status: 'active',
    instructor: 'ThS. Trần Thị B',
    students: [
      { id: 1, code: '21520001', name: 'Nguyễn Thị Mai', class: 'KHTN2021' },
      { id: 2, code: '21520002', name: 'Trần Văn Nam', class: 'KHTN2021' },
      { id: 3, code: '21520003', name: 'Lê Thị Hoa', class: 'KHTN2021' }
    ]
  },
  {
    id: 2,
    name: 'Nhóm 2',
    subjectId: 'IT002',
    subjectCode: 'IT002',
    capacity: 40,
    assigned: 40,
    status: 'full',
    instructor: 'ThS. Trần Thị B',
    students: [
      { id: 4, code: '21520004', name: 'Phạm Văn Đức', class: 'KHTN2021' },
      { id: 5, code: '21520005', name: 'Võ Thị Lan', class: 'KHTN2021' }
    ]
  },
  {
    id: 3,
    name: 'Nhóm 3',
    subjectId: 'IT002',
    subjectCode: 'IT002',
    capacity: 40,
    assigned: 37,
    status: 'active',
    instructor: 'ThS. Trần Thị B',
    students: [
      { id: 6, code: '21520006', name: 'Đặng Văn Khoa', class: 'KHTN2021' },
      { id: 7, code: '21520007', name: 'Bùi Thị Thu', class: 'KHTN2021' }
    ]
  }
];

// ==================== UNASSIGNED STUDENTS ====================
export const mockUnassignedStudents: Student[] = [
  { id: 8, code: '21520008', name: 'Huỳnh Văn Long', class: 'KHTN2021' },
  { id: 9, code: '21520009', name: 'Trương Thị Kim', class: 'KHTN2021' },
  { id: 10, code: '21520010', name: 'Ngô Văn Tài', class: 'KHTN2021' },
  { id: 11, code: '21520011', name: 'Phan Thị Nga', class: 'KHTN2021' },
  { id: 12, code: '21520012', name: 'Lý Văn Phong', class: 'KHTN2021' }
];

// ==================== INSTRUCTOR REPORTS ====================
export const mockInstructorReports: InstructorReport[] = [
  {
    id: 1,
    name: 'TS. Nguyễn Văn A',
    code: 'CB001',
    subjects: ['IT001', 'IT005'],
    groups: 4,
    sessions: 48,
    completed: 48,
    totalHours: 96,
    students: 152,
    avgAttendance: 94.2
  },
  {
    id: 2,
    name: 'ThS. Trần Thị B',
    code: 'CB002',
    subjects: ['IT002'],
    groups: 3,
    sessions: 36,
    completed: 36,
    totalHours: 72,
    students: 115,
    avgAttendance: 91.8
  },
  {
    id: 3,
    name: 'TS. Phạm Văn D',
    code: 'CB003',
    subjects: ['IT004'],
    groups: 2,
    sessions: 24,
    completed: 24,
    totalHours: 48,
    students: 86,
    avgAttendance: 89.5
  },
  {
    id: 4,
    name: 'ThS. Hoàng Thị E',
    code: 'CB004',
    subjects: ['IT005'],
    groups: 2,
    sessions: 24,
    completed: 24,
    totalHours: 48,
    students: 70,
    avgAttendance: 95.1
  }
];

// ==================== SUBJECT REPORTS ====================
export const mockSubjectReports: SubjectReport[] = [
  {
    id: 'IT001',
    code: 'IT001',
    name: 'Lập trình hướng đối tượng',
    groups: 3,
    students: 108,
    sessions: 36,
    completed: 36,
    instructors: ['TS. Nguyễn Văn A'],
    avgAttendance: 93.5,
    totalHours: 72
  },
  {
    id: 'IT002',
    code: 'IT002',
    name: 'Cơ sở dữ liệu',
    groups: 3,
    students: 115,
    sessions: 36,
    completed: 36,
    instructors: ['ThS. Trần Thị B'],
    avgAttendance: 91.8,
    totalHours: 72
  },
  {
    id: 'IT004',
    code: 'IT004',
    name: 'Mạng máy tính',
    groups: 2,
    students: 86,
    sessions: 24,
    completed: 24,
    instructors: ['TS. Phạm Văn D'],
    avgAttendance: 89.5,
    totalHours: 48
  },
  {
    id: 'IT005',
    code: 'IT005',
    name: 'Lập trình Web',
    groups: 4,
    students: 140,
    sessions: 48,
    completed: 48,
    instructors: ['TS. Nguyễn Văn A', 'ThS. Hoàng Thị E'],
    avgAttendance: 94.7,
    totalHours: 96
  }
];

// ==================== LAB USAGE REPORTS ====================
export const mockLabUsageReports: LabUsageReport[] = [
  { lab: 'Phòng A101', sessions: 96, hours: 192, utilization: 85 },
  { lab: 'Phòng A102', sessions: 84, hours: 168, utilization: 75 },
  { lab: 'Phòng B203', sessions: 108, hours: 216, utilization: 95 },
  { lab: 'Phòng C305', sessions: 72, hours: 144, utilization: 65 },
  { lab: 'Phòng C306', sessions: 60, hours: 120, utilization: 55 }
];

// ==================== WEEK SCHEDULES ====================
export const mockWeekSchedules: WeekSchedule[] = [
  {
    id: 5,
    week: 'Tuần 5',
    dateRange: '16/12 - 22/12/2024',
    status: 'published',
    publishDate: '15/12/2024 14:30',
    schedules: 15,
    notifiedStudents: 245,
    notifiedInstructors: 12
  },
  {
    id: 6,
    week: 'Tuần 6',
    dateRange: '23/12 - 29/12/2024',
    status: 'ready',
    publishDate: null,
    schedules: 18,
    notifiedStudents: 0,
    notifiedInstructors: 0
  },
  {
    id: 7,
    week: 'Tuần 7',
    dateRange: '30/12 - 05/01/2025',
    status: 'draft',
    publishDate: null,
    schedules: 12,
    notifiedStudents: 0,
    notifiedInstructors: 0
  }
];

// ==================== PUBLICATION HISTORY ====================
export const mockPublicationHistory: PublicationHistory[] = [
  {
    id: 1,
    week: 'Tuần 5',
    dateRange: '16/12 - 22/12/2024',
    publishedBy: 'Admin',
    publishDate: '15/12/2024 14:30',
    targets: ['Sinh viên', 'Giảng viên'],
    studentsNotified: 245,
    instructorsNotified: 12,
    status: 'completed'
  },
  {
    id: 2,
    week: 'Tuần 4',
    dateRange: '09/12 - 15/12/2024',
    publishedBy: 'Admin',
    publishDate: '08/12/2024 16:00',
    targets: ['Sinh viên', 'Giảng viên'],
    studentsNotified: 245,
    instructorsNotified: 12,
    status: 'completed'
  }
];

// ==================== ACTIVITIES ====================
export const mockActivities: Activity[] = [
  { id: 1, action: 'Phân nhóm mới', subject: 'Lập trình Web - 3 nhóm', time: '30 phút trước', user: 'Admin', type: 'group' },
  { id: 2, action: 'Xếp lịch', subject: 'Cơ sở dữ liệu - Tuần 5', time: '2 giờ trước', user: 'Trợ lý GV', type: 'schedule' },
  { id: 3, action: 'Phân công GV', subject: 'TS. Nguyễn Văn A - 4 nhóm', time: '5 giờ trước', user: 'Admin', type: 'assign' },
  { id: 4, action: 'Công bố lịch', subject: 'Lịch tuần 6 - HK1 2024', time: '1 ngày trước', user: 'Admin', type: 'publish' }
];
