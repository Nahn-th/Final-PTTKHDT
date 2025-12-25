// src/api/services/index.ts
import { apiClient, API_ENDPOINTS } from '../axios.config';
import {
  Course, Schedule, Subject, Group, Instructor, Student,
  InstructorReport, SubjectReport, LabUsageReport,
  WeekSchedule, PublicationHistory, DashboardStats,
  RegisterCourseDTO, CreateGroupDTO, UpdateGroupDTO,
  AssignInstructorDTO, PublishScheduleDTO, ApiResponse
} from '../../types';

// ==================== COURSE SERVICE ====================
export const courseService = {
  async getAll(): Promise<Course[]> {
    const response = await apiClient.get<ApiResponse<Course[]>>(API_ENDPOINTS.COURSES.LIST);
    return response.data.data;
  },

  async getById(id: number): Promise<Course> {
    const response = await apiClient.get<ApiResponse<Course>>(API_ENDPOINTS.COURSES.DETAIL(id));
    return response.data.data;
  },

  async register(data: RegisterCourseDTO): Promise<void> {
    await apiClient.post(API_ENDPOINTS.COURSES.REGISTER, data);
  },

  async unregister(courseId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COURSES.UNREGISTER(courseId));
  },

  async getMyCourses(): Promise<Course[]> {
    const response = await apiClient.get<ApiResponse<Course[]>>(API_ENDPOINTS.COURSES.MY_COURSES);
    return response.data.data;
  },
};

// ==================== SCHEDULE SERVICE ====================
export const scheduleService = {
  async getAll(): Promise<Schedule[]> {
    const response = await apiClient.get<ApiResponse<Schedule[]>>(API_ENDPOINTS.SCHEDULES.LIST);
    return response.data.data;
  },

  async getById(id: number): Promise<Schedule> {
    const response = await apiClient.get<ApiResponse<Schedule>>(
      API_ENDPOINTS.SCHEDULES.DETAIL(id)
    );
    return response.data.data;
  },

  async getMySchedule(): Promise<Schedule[]> {
    const response = await apiClient.get<ApiResponse<Schedule[]>>(
      API_ENDPOINTS.SCHEDULES.MY_SCHEDULE
    );
    return response.data.data;
  },

  async getByWeek(weekId: number): Promise<Schedule[]> {
    const response = await apiClient.get<ApiResponse<Schedule[]>>(
      API_ENDPOINTS.SCHEDULES.BY_WEEK(weekId)
    );
    return response.data.data;
  },

  async getBySubject(subjectId: string): Promise<Schedule[]> {
    const response = await apiClient.get<ApiResponse<Schedule[]>>(
      API_ENDPOINTS.SCHEDULES.BY_SUBJECT(subjectId)
    );
    return response.data.data;
  },
};

// ==================== SUBJECT SERVICE ====================
export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const response = await apiClient.get<ApiResponse<Subject[]>>(API_ENDPOINTS.SUBJECTS.LIST);
    return response.data.data;
  },

  async getById(id: string): Promise<Subject> {
    const response = await apiClient.get<ApiResponse<Subject>>(
      API_ENDPOINTS.SUBJECTS.DETAIL(id)
    );
    return response.data.data;
  },

  async getGroups(id: string): Promise<Group[]> {
    const response = await apiClient.get<ApiResponse<Group[]>>(
      API_ENDPOINTS.SUBJECTS.GROUPS(id)
    );
    return response.data.data;
  },
};

// ==================== GROUP SERVICE ====================
export const groupService = {
  async getAll(): Promise<Group[]> {
    const response = await apiClient.get<ApiResponse<Group[]>>(API_ENDPOINTS.GROUPS.LIST);
    return response.data.data;
  },

  async getById(id: number): Promise<Group> {
    const response = await apiClient.get<ApiResponse<Group>>(API_ENDPOINTS.GROUPS.DETAIL(id));
    return response.data.data;
  },

  async create(data: CreateGroupDTO): Promise<Group> {
    const response = await apiClient.post<ApiResponse<Group>>(API_ENDPOINTS.GROUPS.CREATE, data);
    return response.data.data;
  },

  async update(id: number, data: UpdateGroupDTO): Promise<Group> {
    const response = await apiClient.put<ApiResponse<Group>>(
      API_ENDPOINTS.GROUPS.UPDATE(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.GROUPS.DELETE(id));
  },

  async assignStudents(id: number, studentIds: number[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.GROUPS.ASSIGN_STUDENTS(id), { studentIds });
  },

  async removeStudent(groupId: number, studentId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.GROUPS.REMOVE_STUDENT(groupId, studentId));
  },
};

// ==================== INSTRUCTOR SERVICE ====================
export const instructorService = {
  async getAll(): Promise<Instructor[]> {
    const response = await apiClient.get<ApiResponse<Instructor[]>>(
      API_ENDPOINTS.INSTRUCTORS.LIST
    );
    return response.data.data;
  },

  async getById(id: number): Promise<Instructor> {
    const response = await apiClient.get<ApiResponse<Instructor>>(
      API_ENDPOINTS.INSTRUCTORS.DETAIL(id)
    );
    return response.data.data;
  },

  async assign(data: AssignInstructorDTO): Promise<void> {
    await apiClient.post(API_ENDPOINTS.INSTRUCTORS.ASSIGN, data);
  },

  async unassign(groupId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.INSTRUCTORS.UNASSIGN(groupId));
  },
};

// ==================== STUDENT SERVICE ====================
export const studentService = {
  async getAll(): Promise<Student[]> {
    const response = await apiClient.get<ApiResponse<Student[]>>(API_ENDPOINTS.STUDENTS.LIST);
    return response.data.data;
  },

  async getById(id: number): Promise<Student> {
    const response = await apiClient.get<ApiResponse<Student>>(
      API_ENDPOINTS.STUDENTS.DETAIL(id)
    );
    return response.data.data;
  },

  async getUnassigned(subjectId: string): Promise<Student[]> {
    const response = await apiClient.get<ApiResponse<Student[]>>(
      API_ENDPOINTS.STUDENTS.UNASSIGNED(subjectId)
    );
    return response.data.data;
  },
};

// ==================== REPORT SERVICE ====================
export const reportService = {
  async getOverview(semester: string): Promise<any> {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.REPORTS.OVERVIEW(semester)
    );
    return response.data.data;
  },

  async getInstructorReports(semester: string): Promise<InstructorReport[]> {
    const response = await apiClient.get<ApiResponse<InstructorReport[]>>(
      API_ENDPOINTS.REPORTS.BY_INSTRUCTOR(semester)
    );
    return response.data.data;
  },

  async getSubjectReports(semester: string): Promise<SubjectReport[]> {
    const response = await apiClient.get<ApiResponse<SubjectReport[]>>(
      API_ENDPOINTS.REPORTS.BY_SUBJECT(semester)
    );
    return response.data.data;
  },

  async getLabUsageReports(semester: string): Promise<LabUsageReport[]> {
    const response = await apiClient.get<ApiResponse<LabUsageReport[]>>(
      API_ENDPOINTS.REPORTS.LAB_USAGE(semester)
    );
    return response.data.data;
  },

  async exportExcel(semester: string, type: string): Promise<Blob> {
    const response = await apiClient.get(
      API_ENDPOINTS.REPORTS.EXPORT_EXCEL(semester, type),
      { responseType: 'blob' }
    );
    return response.data;
  },

  async exportPDF(semester: string, type: string): Promise<Blob> {
    const response = await apiClient.get(
      API_ENDPOINTS.REPORTS.EXPORT_PDF(semester, type),
      { responseType: 'blob' }
    );
    return response.data;
  },
};

// ==================== PUBLICATION SERVICE ====================
export const publicationService = {
  async getWeeks(): Promise<WeekSchedule[]> {
    const response = await apiClient.get<ApiResponse<WeekSchedule[]>>(
      API_ENDPOINTS.PUBLICATION.WEEKS
    );
    return response.data.data;
  },

  async getWeekDetail(weekId: number): Promise<WeekSchedule> {
    const response = await apiClient.get<ApiResponse<WeekSchedule>>(
      API_ENDPOINTS.PUBLICATION.WEEK_DETAIL(weekId)
    );
    return response.data.data;
  },

  async publish(data: PublishScheduleDTO): Promise<void> {
    await apiClient.post(API_ENDPOINTS.PUBLICATION.PUBLISH, data);
  },

  async getHistory(): Promise<PublicationHistory[]> {
    const response = await apiClient.get<ApiResponse<PublicationHistory[]>>(
      API_ENDPOINTS.PUBLICATION.HISTORY
    );
    return response.data.data;
  },
};

// ==================== STATS SERVICE ====================
export const statsService = {
  async getStudentStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.STATS.STUDENT
    );
    return response.data.data;
  },

  async getInstructorStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.STATS.INSTRUCTOR
    );
    return response.data.data;
  },

  async getAdminStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      API_ENDPOINTS.STATS.ADMIN
    );
    return response.data.data;
  },
};

// Export all services
export default {
  course: courseService,
  schedule: scheduleService,
  subject: subjectService,
  group: groupService,
  instructor: instructorService,
  student: studentService,
  report: reportService,
  publication: publicationService,
  stats: statsService,
};
