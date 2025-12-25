// src/types/index.ts

// ==================== USER & AUTH ====================
export interface User {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'instructor' | 'staff' | 'admin';
  class?: string;
  specialization?: string;
}

// ==================== SUBJECT ====================
export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  description?: string;
  semester: string;
}

// ==================== GROUP ====================
export interface Group {
  id: number;
  name: string;
  subjectId: string;
  subjectCode?: string;
  capacity: number;
  assigned: number;
  status: 'active' | 'full' | 'pending';
  instructorId?: string;
  instructor?: string;
  students?: Student[];
}

export interface Student {
  id: number;
  code: string;
  name: string;
  class: string;
  email?: string;
  phone?: string;
}

// ==================== COURSE (for registration) ====================
export interface CourseGroup {
  id: number;
  name: string;
  schedule: string;
  room: string;
  slots: number;
  registered: number;
  status: 'available' | 'full';
  registered_group?: boolean;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  groups: CourseGroup[];
}

// ==================== SCHEDULE ====================
export interface Schedule {
  id: number;
  subject: string;
  subjectCode: string;
  color: 'blue' | 'purple' | 'green' | 'orange';
  group: string;
  date: string;
  dayOfWeek: string;
  time: string;
  room: string;
  instructor: string;
  session: string;
  topic: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  myComputer?: string;
  attendanceStatus?: 'present' | 'absent' | null;
}

// ==================== LAB & COMPUTER ====================
export interface Lab {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  computers?: Computer[];
}

export interface Computer {
  id: string;
  labId: string;
  computerNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'broken';
  specs?: {
    cpu: string;
    ram: string;
    storage: string;
    gpu?: string;
  };
}

export interface SeatAssignment {
  id: string;
  scheduleId: string;
  studentId: string;
  computerId: string;
  position: string;
}

// ==================== INSTRUCTOR ASSIGNMENT ====================
export interface Instructor {
  id: number;
  code: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  assignedGroups: number;
  totalHours: number;
  maxHours: number;
  subjects: InstructorSubject[];
}

export interface InstructorSubject {
  code: string;
  name: string;
  groups: number;
  hours: number;
}

// ==================== REPORT ====================
export interface InstructorReport {
  id: number;
  name: string;
  code: string;
  subjects: string[];
  groups: number;
  sessions: number;
  completed: number;
  totalHours: number;
  students: number;
  avgAttendance: number;
}

export interface SubjectReport {
  id: string;
  code: string;
  name: string;
  groups: number;
  students: number;
  sessions: number;
  completed: number;
  instructors: string[];
  avgAttendance: number;
  totalHours: number;
}

export interface LabUsageReport {
  lab: string;
  sessions: number;
  hours: number;
  utilization: number;
}

// ==================== NOTIFICATION ====================
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

// ==================== ACTIVITY ====================
export interface Activity {
  id: number;
  action: string;
  subject: string;
  time: string;
  user?: string;
  type: 'group' | 'schedule' | 'assign' | 'publish' | 'attendance' | 'assignment' | 'report';
}

// ==================== PUBLICATION ====================
export interface WeekSchedule {
  id: number;
  week: string;
  dateRange: string;
  status: 'published' | 'ready' | 'draft';
  publishDate?: string | null;
  schedules: number;
  notifiedStudents: number;
  notifiedInstructors: number;
}

export interface PublicationHistory {
  id: number;
  week: string;
  dateRange: string;
  publishedBy: string;
  publishDate: string;
  targets: string[];
  studentsNotified: number;
  instructorsNotified: number;
  status: 'completed' | 'pending' | 'failed';
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

// ==================== REQUEST DTOs ====================
export interface RegisterCourseDTO {
  courseId: number;
  groupId: number;
}

export interface CreateGroupDTO {
  name: string;
  subjectId: string;
  capacity: number;
}

export interface UpdateGroupDTO {
  name?: string;
  capacity?: number;
  status?: Group['status'];
}

export interface AssignInstructorDTO {
  groupId: number;
  instructorId: number;
}

export interface CreateScheduleDTO {
  groupId: number;
  date: string;
  time: string;
  room: string;
  topic: string;
}

export interface PublishScheduleDTO {
  weekId: number;
  notifyStudents: boolean;
  notifyInstructors: boolean;
}

export interface AttendanceDTO {
  scheduleId: number;
  studentId: number;
  status: 'present' | 'absent' | 'late';
  note?: string;
}

// ==================== STATISTICS ====================
export interface DashboardStats {
  totalSubjects?: number;
  totalGroups?: number;
  totalSessions?: number;
  completedSessions?: number;
  totalStudents?: number;
  totalInstructors?: number;
  totalHours?: number;
  attendanceRate?: number;
  registeredCourses?: number;
  upcomingSessions?: number;
  totalCredits?: number;
}

// ==================== FILTER & SORT ====================
export interface FilterOptions {
  status?: string;
  subjectId?: string;
  instructorId?: string;
  semester?: string;
  searchTerm?: string;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}
