
import React from 'react';
import { motion } from 'motion/react';
import { Play, Star, Clock, Users } from 'lucide-react';
import { Card, Badge, Button } from './UIComponents';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  onEnroll?: () => void;
  showEnroll?: boolean;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, onEnroll, showEnroll = true, isEnrolled = false }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card elevate className="overflow-hidden h-full flex flex-col group cursor-pointer" onClick={onClick}>
        <div 
          className="h-56 relative overflow-hidden" 
          style={course.thumbnail.startsWith('linear-gradient') ? { background: course.thumbnail } : { backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
           {course.isAI && (
             <div className="absolute top-4 left-4 z-10">
                <Badge variant="ai">AI Powered</Badge>
             </div>
           )}
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur shadow-xl flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 <Play className="w-6 h-6 text-[#AE5633] fill-current ml-1" />
              </div>
           </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <img src={course.instructorAvatar} className="w-7 h-7 rounded-full shadow-sm" alt="" />
                <span className="text-xs font-semibold text-[#1D1D1D]/60">{course.instructor}</span>
            </div>
            <h3 className="text-xl font-serif font-medium mb-3 group-hover:text-[#AE5633] transition-colors line-clamp-2 text-[#1D1D1D]">{course.title}</h3>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#1D1D1D]/40 font-bold uppercase tracking-wider mb-6 mt-auto">
                <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[#1D1D1D]">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                </div>
                <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {(course.studentsCount/1000).toFixed(1)}k
                </div>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-[#F9F7F2] text-[#1D1D1D]">
                <p className="text-xl font-bold">{typeof course.price === 'number' ? `$${course.price.toFixed(2)}` : course.price}</p>
                <Button 
                  size="sm" 
                  variant={isEnrolled ? 'secondary' : (!showEnroll ? 'secondary' : (typeof course.price !== 'number' ? 'secondary' : 'primary'))}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEnrolled && onClick) {
                      onClick();
                    } else if (showEnroll && onEnroll) {
                      onEnroll();
                    } else if (onClick) {
                      onClick();
                    }
                  }}
                >
                  {isEnrolled ? 'Go to Course' : (showEnroll ? 'Enroll Now' : 'View Details')}
                </Button>
            </div>
        </div>
      </Card>
    </motion.div>
  );
};
