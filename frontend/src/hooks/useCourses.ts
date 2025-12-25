// src/hooks/useCourses.ts
import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../api/services';
import { Course, RegisterCourseDTO } from '../types';
import { mockCourses } from '../data/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setCourses(mockCourses);
      } else {
        const data = await courseService.getAll();
        setCourses(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerCourse = async (data: RegisterCourseDTO) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock registration logic
      } else {
        await courseService.register(data);
      }
      
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unregisterCourse = async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock unregister logic
      } else {
        await courseService.unregister(courseId);
      }
      
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unregister course');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    registerCourse,
    unregisterCourse,
  };
};

// ==================== USE SCHEDULES HOOK ====================
// src/hooks/useSchedules.ts
import { scheduleService } from '../api/services';
import { Schedule } from '../types';
import { mockSchedules } from '../data/mockData';

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setSchedules(mockSchedules);
      } else {
        const data = await scheduleService.getMySchedule();
        setSchedules(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
  };
};

// ==================== USE GROUPS HOOK ====================
// src/hooks/useGroups.ts
import { groupService, studentService } from '../api/services';
import { Group, Student, CreateGroupDTO, UpdateGroupDTO } from '../types';
import { mockGroups, mockUnassignedStudents } from '../data/mockData';

export const useGroups = (subjectId?: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setGroups(mockGroups);
      } else {
        const data = await groupService.getAll();
        setGroups(subjectId ? data.filter(g => g.subjectId === subjectId) : data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  const fetchUnassignedStudents = useCallback(async () => {
    if (!subjectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUnassignedStudents(mockUnassignedStudents);
      } else {
        const data = await studentService.getUnassigned(subjectId);
        setUnassignedStudents(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch unassigned students');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  const createGroup = async (data: CreateGroupDTO) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock create logic
      } else {
        await groupService.create(data);
      }
      
      await fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGroup = async (id: number, data: UpdateGroupDTO) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock update logic
      } else {
        await groupService.update(id, data);
      }
      
      await fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock delete logic
      } else {
        await groupService.delete(id);
      }
      
      await fetchGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignStudents = async (groupId: number, studentIds: number[]) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock assign logic
      } else {
        await groupService.assignStudents(groupId, studentIds);
      }
      
      await fetchGroups();
      await fetchUnassignedStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign students');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    if (subjectId) {
      fetchUnassignedStudents();
    }
  }, [fetchGroups, fetchUnassignedStudents, subjectId]);

  return {
    groups,
    unassignedStudents,
    loading,
    error,
    fetchGroups,
    fetchUnassignedStudents,
    createGroup,
    updateGroup,
    deleteGroup,
    assignStudents,
  };
};

// ==================== USE INSTRUCTORS HOOK ====================
// src/hooks/useInstructors.ts
import { instructorService } from '../api/services';
import { Instructor, AssignInstructorDTO } from '../types';
import { mockInstructors } from '../data/mockData';

export const useInstructors = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setInstructors(mockInstructors);
      } else {
        const data = await instructorService.getAll();
        setInstructors(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  }, []);

  const assignInstructor = async (data: AssignInstructorDTO) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock assign logic
      } else {
        await instructorService.assign(data);
      }
      
      await fetchInstructors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign instructor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unassignInstructor = async (groupId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Mock unassign logic
      } else {
        await instructorService.unassign(groupId);
      }
      
      await fetchInstructors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unassign instructor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  return {
    instructors,
    loading,
    error,
    fetchInstructors,
    assignInstructor,
    unassignInstructor,
  };
};

// ==================== USE REPORTS HOOK ====================
// src/hooks/useReports.ts
import { reportService } from '../api/services';
import { InstructorReport, SubjectReport, LabUsageReport } from '../types';
import { mockInstructorReports, mockSubjectReports, mockLabUsageReports } from '../data/mockData';

export const useReports = (semester: string) => {
  const [instructorReports, setInstructorReports] = useState<InstructorReport[]>([]);
  const [subjectReports, setSubjectReports] = useState<SubjectReport[]>([]);
  const [labUsageReports, setLabUsageReports] = useState<LabUsageReport[]>([]);
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (type: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        switch (type) {
          case 'instructor':
            setInstructorReports(mockInstructorReports);
            break;
          case 'subject':
            setSubjectReports(mockSubjectReports);
            break;
          case 'lab':
            setLabUsageReports(mockLabUsageReports);
            break;
          case 'overview':
            setOverviewData({
              totalSubjects: 12,
              totalGroups: 48,
              totalSessions: 576,
              completedSessions: 545,
              totalStudents: 1240,
              totalInstructors: 24,
              totalHours: 1152,
              attendanceRate: 92.5
            });
            break;
        }
      } else {
        switch (type) {
          case 'instructor':
            const instructorData = await reportService.getInstructorReports(semester);
            setInstructorReports(instructorData);
            break;
          case 'subject':
            const subjectData = await reportService.getSubjectReports(semester);
            setSubjectReports(subjectData);
            break;
          case 'lab':
            const labData = await reportService.getLabUsageReports(semester);
            setLabUsageReports(labData);
            break;
          case 'overview':
            const overview = await reportService.getOverview(semester);
            setOverviewData(overview);
            break;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, [semester]);

  return {
    instructorReports,
    subjectReports,
    labUsageReports,
    overviewData,
    loading,
    error,
    fetchReports,
  };
};
