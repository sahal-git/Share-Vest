import { createContext, useContext, useState, useEffect } from 'react';
import { CourseType } from '@/types';
import CourseList from '@/data/courses.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

type CourseContextType = {
  enrollInCourse: (courseId: number) => void;
  unenrollFromCourse: (courseId: number) => void;
  isEnrolled: (courseId: number) => boolean;
  enrolledCourses: number[];
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const { user } = useAuth();

  // Load enrolled courses from AsyncStorage when component mounts or user changes
  useEffect(() => {
    const loadEnrolledCourses = async () => {
      if (!user?.id) return;
      
      try {
        const stored = await AsyncStorage.getItem(`enrolledCourses_${user.id}`);
        if (stored) {
          setEnrolledCourses(JSON.parse(stored));
        } else {
          // Initialize with courses marked as enrolled in CourseList
          const initialEnrolled = CourseList.filter(course => course.enrolled).map(course => course.id);
          setEnrolledCourses(initialEnrolled);
          await AsyncStorage.setItem(`enrolledCourses_${user.id}`, JSON.stringify(initialEnrolled));
        }
      } catch (error) {
        console.error('Error loading enrolled courses:', error);
      }
    };

    loadEnrolledCourses();
  }, [user?.id]);

  const enrollInCourse = async (courseId: number) => {
    if (!user?.id) return;

    try {
      const newEnrolledCourses = [...enrolledCourses, courseId];
      setEnrolledCourses(newEnrolledCourses);
      await AsyncStorage.setItem(
        `enrolledCourses_${user.id}`,
        JSON.stringify(newEnrolledCourses)
      );
    } catch (error) {
      console.error('Error saving enrolled course:', error);
    }
  };

  const unenrollFromCourse = async (courseId: number) => {
    if (!user?.id) return;

    try {
      const newEnrolledCourses = enrolledCourses.filter(id => id !== courseId);
      setEnrolledCourses(newEnrolledCourses);
      await AsyncStorage.setItem(
        `enrolledCourses_${user.id}`,
        JSON.stringify(newEnrolledCourses)
      );
    } catch (error) {
      console.error('Error removing enrolled course:', error);
    }
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