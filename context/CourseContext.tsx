import { createContext, useContext, useState, useEffect } from 'react';
import { CourseType } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

type CourseContextType = {
  enrollInCourse: (courseId: number) => void;
  unenrollFromCourse: (courseId: number) => void;
  isEnrolled: (courseId: number) => boolean;
  enrolledCourses: number[];
  courses: CourseType[];
  isLoading: boolean;
  error: string | null;
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('https://sharvest.vercel.app/api/courses');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { data } = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid API response format');
        }
        
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Load enrolled courses
  useEffect(() => {
    const loadEnrolledCourses = async () => {
      if (!user?.id) return;
      
      try {
        const stored = await AsyncStorage.getItem(`enrolledCourses_${user.id}`);
        if (stored) {
          setEnrolledCourses(JSON.parse(stored));
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
      enrolledCourses,
      courses,
      isLoading,
      error
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