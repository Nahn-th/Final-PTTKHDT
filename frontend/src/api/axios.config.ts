// src/api/axios.config.ts
import axios, { AxiosError } from 'axios';

// Base URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Courses (for student registration)
  COURSES: {
    LIST: '/courses',
    DETAIL: (id: number) => `/courses/${id}`,
    REGISTER: '/courses/register',
    UNREGISTER: (id: number) => `/courses/${id}/unregister`,
    MY_COURSES: '/courses/my-courses',
  },

  // Schedules
  SCHEDULES: {
    LIST: '/schedules',
    DETAIL: (id: number) => `/schedules/${id}`,
    MY_SCHEDULE: '/schedules/my-schedule',
    BY_WEEK: (weekId: number) => `/schedules/week/${weekId}`,
    BY_SUBJECT: (subjectId: string) => `/schedules/subject/${subjectId}`,
  },

  // Subjects
  SUBJECTS: {
    LIST: '/subjects',
    DETAIL: (id: string) => `/subjects/${id}`,
    GROUPS: (id: string) => `/subjects/${id}/groups`,
  },

  // Groups
  GROUPS: {
    LIST: '/groups',
    DETAIL: (id: number) => `/groups/${id}`,
    CREATE: '/groups',
    UPDATE: (id: number) => `/groups/${id}`,
    DELETE: (id: number) => `/groups/${id}`,
    ASSIGN_STUDENTS: (id: number) => `/groups/${id}/students`,
    REMOVE_STUDENT: (id: number, studentId: number) => `/groups/${id}/students/${studentId}`,
  },

  // Instructors
  INSTRUCTORS: {
    LIST: '/instructors',
    DETAIL: (id: number) => `/instructors/${id}`,
    ASSIGN: '/instructors/assign',
    UNASSIGN: (groupId: number) => `/instructors/unassign/${groupId}`,
  },

  // Students
  STUDENTS: {
    LIST: '/students',
    DETAIL: (id: number) => `/students/${id}`,
    UNASSIGNED: (subjectId: string) => `/students/unassigned/${subjectId}`,
  },

  // Reports
  REPORTS: {
    OVERVIEW: (semester: string) => `/reports/overview/${semester}`,
    BY_INSTRUCTOR: (semester: string) => `/reports/instructor/${semester}`,
    BY_SUBJECT: (semester: string) => `/reports/subject/${semester}`,
    LAB_USAGE: (semester: string) => `/reports/lab-usage/${semester}`,
    EXPORT_EXCEL: (semester: string, type: string) => `/reports/export/${semester}/${type}`,
    EXPORT_PDF: (semester: string, type: string) => `/reports/export-pdf/${semester}/${type}`,
  },

  // Publication
  PUBLICATION: {
    WEEKS: '/publication/weeks',
    WEEK_DETAIL: (weekId: number) => `/publication/weeks/${weekId}`,
    PUBLISH: '/publication/publish',
    HISTORY: '/publication/history',
  },

  // Attendance
  ATTENDANCE: {
    MARK: '/attendance/mark',
    SESSION: (scheduleId: number) => `/attendance/session/${scheduleId}`,
    STUDENT: (studentId: number) => `/attendance/student/${studentId}`,
  },

  // Labs
  LABS: {
    LIST: '/labs',
    DETAIL: (id: string) => `/labs/${id}`,
    COMPUTERS: (id: string) => `/labs/${id}/computers`,
  },

  // Seat Assignment
  SEATS: {
    ASSIGN: '/seats/assign',
    BY_SCHEDULE: (scheduleId: number) => `/seats/schedule/${scheduleId}`,
    BY_STUDENT: (studentId: number) => `/seats/student/${studentId}`,
  },

  // Dashboard/Statistics
  STATS: {
    STUDENT: '/stats/student',
    INSTRUCTOR: '/stats/instructor',
    ADMIN: '/stats/admin',
  },
};
