import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Badge } from './UIComponents';
import { CourseCard } from './CourseCard';
import { ViewState, Course, User as UserType } from '../types';
import { 
  Filter, 
  Search, 
  Star, 
  Users, 
  Clock, 
  ChevronDown, 
  X,
  Play
} from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  user?: UserType;
  onNavigate: (view: ViewState | ViewState['type']) => void;
  onEnroll?: (course: Course) => void;
}

const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses, user, onNavigate, onEnroll }) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState('popular');

  // Simulate skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['All', 'AI / ML', 'Design', 'Development', 'Business', 'Marketing'];
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <Badge variant="status">Course Library</Badge>
           <h1 className="text-4xl font-serif font-medium mt-3 mb-2 text-[#1D1D1D]">Explore Your Potential</h1>
           <p className="text-[#1D1D1D]/50">Choose from thousands of AI-curated and human-mastered courses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1D1D1D]/40" />
            <input 
              type="text" 
              placeholder="Search concepts, skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-[#E8E2D6] rounded-xl text-sm outline-none w-64 focus:ring-2 ring-[#AE5633]/10 focus:border-[#AE5633] transition-all text-[#1D1D1D]"
            />
          </div>
          <Button variant="secondary" className="px-4" icon={Filter}>Filters</Button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${selectedCategory === cat ? 'bg-[#3D3929] text-white' : 'bg-white border border-[#E8E2D6] text-[#1D1D1D]/60 hover:bg-[#F9F7F2]'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Filters */}
      {(selectedCategory !== 'All' || searchQuery) && (
        <div className="flex items-center gap-2">
           <span className="text-xs font-bold text-[#1D1D1D]/40 uppercase tracking-widest mr-2">Active:</span>
           {selectedCategory !== 'All' && (
             <Badge variant="status">
                {selectedCategory}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory('All')} />
             </Badge>
           )}
           {searchQuery && (
             <Badge variant="status">
                "{searchQuery}"
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchQuery('')} />
             </Badge>
           )}
        </div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {loading ? (
          // Skeleton Screen
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="h-48 bg-[#E8E2D6]/30 rounded-[14px]"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#E8E2D6]/30 rounded w-1/4"></div>
                <div className="h-6 bg-[#E8E2D6]/30 rounded w-3/4"></div>
                <div className="h-4 bg-[#E8E2D6]/30 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard 
                key={course.id}                
                course={course}
                isEnrolled={(user?.enrolledCourses || []).includes(course.id)}
                onClick={() => onNavigate({ type: 'course-detail', course })}
                onEnroll={() => onEnroll && onEnroll(course)}
            />
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-[#E8E2D6]/20 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-[#1D1D1D]/20" />
             </div>
             <h3 className="text-2xl font-serif font-medium mb-2 text-[#1D1D1D]">No courses found</h3>
             <p className="text-[#1D1D1D]/50 max-w-sm">We couldn't find any courses matching your search criteria. Try different keywords or filters.</p>
             <Button variant="ghost" className="mt-6" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;
