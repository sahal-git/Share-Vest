import { createContext, useContext, useState } from 'react';
import { CourseType } from '@/types';
import CourseList from '@/data/courses.json';

type CourseContextType = {
  enrollInCourse: (courseId: number) => void;
  unenrollFromCourse: (courseId: number) => void;
  isEnrolled: (courseId: number) => boolean;
  enrolledCourses: number[];
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>(
    CourseList.filter(course => course.enrolled).map(course => course.id)
  );

  const enrollInCourse = (courseId: number) => {
    setEnrolledCourses(prev => [...prev, courseId]);
  };

  const unenrollFromCourse = (courseId: number) => {
    setEnrolledCourses(prev => prev.filter(id => id !== courseId));
  };

  const isEnrolled = (courseId: number) => {
    return enrolledCourses.includes(courseId);
  };

  return (
    <CourseContext.Provider value={{ 
      enrollInCourse, 
      unenrollFromCourse, 
      isEnrolled,
      enrolledCourses 
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
} 