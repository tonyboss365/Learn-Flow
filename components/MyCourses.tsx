import React from 'react';
import { Card, Button, Badge } from './UIComponents';
import { CourseCard } from './CourseCard';
import { ViewState, Course, User } from '../types';
import { BookOpen, Search } from 'lucide-react';

interface MyCoursesProps {
  courses: Course[];
  user: User;
  onNavigate: (view: ViewState | ViewState['type']) => void;
}

const MyCourses: React.FC<MyCoursesProps> = ({ courses, user, onNavigate }) => {
  const enrolledCourses = courses.filter(course => user.enrolledCourses?.includes(course.id));

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <Badge variant="emerald">Enrolled</Badge>
           <h1 className="text-4xl font-serif font-medium mt-3 mb-2 text-[#1D1D1D]">My Courses</h1>
           <p className="text-[#1D1D1D]/50">Pick up right where you left off.</p>
        </div>
      </header>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <CourseCard 
                key={course.id}                
                course={course}
                onClick={() => onNavigate({ type: 'course-player', course, activeLessonId: course.curriculum[0]?.lessons[0]?.id || 'l1' })}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-[#E8E2D6]/20 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-[#1D1D1D]/20" />
             </div>
             <h3 className="text-2xl font-serif font-medium mb-2 text-[#1D1D1D]">No courses yet</h3>
             <p className="text-[#1D1D1D]/50 max-w-sm">You haven't enrolled in any courses yet. Start exploring the catalog!</p>
             <Button variant="primary" className="mt-6" onClick={() => onNavigate('course-catalog')}>Browse Courses</Button>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
