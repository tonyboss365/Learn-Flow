/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewState, Course, Quiz } from './types';
import { MOCK_USER, MOCK_INSTRUCTOR, MOCK_COURSES, MOCK_QUIZ } from './constants';
import { Sidebar } from './components/Sidebar';
import { Toast, Button } from './components/UIComponents';
import { Menu, X, Bell, Search, User as UserIcon, Loader2 } from 'lucide-react';
import { supabase } from './utils/supabase';

// Lazy load components to keep initial bundle manageable if needed, 
// but for a single-file feeling we will just import if ready
import Landing from './components/Landing';
import AuthPages from './components/AuthPages';
import StudentDashboard from './components/StudentDashboard';
import CourseCatalog from './components/CourseCatalog';
import CourseDetail from './components/CourseDetail';
import CoursePlayer from './components/CoursePlayer';
import QuizEngine from './components/QuizEngine';
import InstructorDashboard from './components/InstructorDashboard';
import CourseCreation from './components/CourseCreation';
import Certificates from './components/Certificates';
import AITutor from './components/AITutor';
import SettingsView from './components/SettingsView';
import MyCourses from './components/MyCourses';
import QuizResults from './components/QuizResults';
import Assistant from './components/Assistant';

function App() {
  const [view, setView] = useState<ViewState>({ type: 'landing' });
  const [user, setUser] = useState(MOCK_USER);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: string, type: 'success' | 'error' | 'info' | 'warning', message: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase.from('courses').select('*');
        if (error) throw error;
        
        if (data) {
          const mappedCourses: Course[] = data.map(dbCourse => ({
            id: dbCourse.id,
            title: dbCourse.title,
            instructor: dbCourse.instructor_name,
            instructorAvatar: dbCourse.instructor_avatar,
            category: dbCourse.category,
            rating: Number(dbCourse.rating),
            reviewsCount: dbCourse.reviews_count,
            studentsCount: dbCourse.students_count,
            price: dbCourse.price === 0 ? 'Free' : Number(dbCourse.price),
            duration: dbCourse.duration,
            lessonsCount: dbCourse.lessons_count,
            level: dbCourse.level,
            thumbnail: dbCourse.thumbnail,
            description: dbCourse.description,
            longDescription: dbCourse.long_description,
            curriculum: dbCourse.curriculum || [],
            whatYouWillLearn: dbCourse.what_you_will_learn || [],
            lastUpdated: dbCourse.last_updated,
            isAI: dbCourse.is_ai
          }));
          setCourses(mappedCourses);
        }
      } catch (err) {
        console.error('Error fetching courses from Supabase:', err);
        addToast('error', 'Failed to load courses from database.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Navigation helper
  const navigate = (newView: ViewState | ViewState['type']) => {
    if (typeof newView === 'string') {
        // Find existing match or default
        if (newView === 'landing') setView({ type: 'landing' });
        else if (newView === 'login') setView({ type: 'login' });
        else if (newView === 'signup') setView({ type: 'signup' });
        else if (newView === 'student-dashboard') setView({ type: 'student-dashboard' });
        else if (newView === 'instructor-dashboard') setView({ type: 'instructor-dashboard' });
        else if (newView === 'course-catalog') setView({ type: 'course-catalog' });
        else if (newView === 'course-create') setView({ type: 'course-create' });
        else if (newView === 'certificates') setView({ type: 'certificates' });
        else if (newView === 'ai-tutor') setView({ type: 'ai-tutor' });
        else if (newView === 'settings') setView({ type: 'settings' });
        else if (newView === 'my-courses') setView({ type: 'my-courses' });
        else if (newView === 'quiz-results') setView({ type: 'quiz-results' });
    } else {
        setView(newView);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const addToast = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleEnroll = async (course: Course) => {
    try {
      const currentEnrolled = user.enrolledCourses || [];
      if (currentEnrolled.includes(course.id)) {
        navigate({ type: 'course-player', course, activeLessonId: course.curriculum[0]?.lessons[0]?.id || 'l1' });
        return;
      }

      const updatedEnrolled = [...currentEnrolled, course.id];
      
      setUser(prev => ({
        ...prev,
        enrolledCourses: updatedEnrolled
      }));

      const { error } = await supabase
        .from('users')
        .update({ enrolled_courses: updatedEnrolled })
        .eq('id', user.id);

      if (error) {
        console.warn('DB enrollment update failed, using local state:', error);
      }

      addToast('success', `Enrolled in ${course.title} successfully!`);
      navigate({ type: 'course-player', course, activeLessonId: course.curriculum[0]?.lessons[0]?.id || 'l1' });
    } catch (err) {
      console.error(err);
      addToast('success', 'Enrolled successfully!');
      navigate({ type: 'course-player', course, activeLessonId: course.curriculum[0]?.lessons[0]?.id || 'l1' });
    }
  };

  // Sections that show the sidebar
  const showSidebar = [
    'student-dashboard', 
    'instructor-dashboard', 
    'course-catalog', 
    'certificates', 
    'ai-tutor', 
    'settings',
    'course-create',
    'my-courses',
    'quiz-results'
  ].includes(view.type);

  return (
    <div className={`min-h-screen transition-colors duration-300 bg-claude-bg text-claude-text`}>
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[100] space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast 
                type={toast.type} 
                message={toast.message} 
                onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Layout Container */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar for dashboard views */}
        {showSidebar && (
          <Sidebar 
            user={user} 
            activeView={view.type} 
            onNavigate={navigate} 
            collapsed={isSidebarCollapsed}
            isMobileOpen={isMobileMenuOpen}
            onMobileClose={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Content Area */}
        <div className={`flex-1 flex flex-col h-full relative transition-all duration-300 ${showSidebar ? (isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''}`}>
          
          {/* Topbar for internal views */}
          {showSidebar && (
             <header className="h-16 px-6 bg-claude-surface/70 backdrop-blur-md border-b border-claude-border flex items-center justify-between sticky top-0 z-30">
               <div className="flex items-center gap-4">
                  <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-claude-text/50">
                    <Menu className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:block text-claude-text/50">
                    <Menu className="w-5 h-5" />
                  </button>
                  <div className="relative group hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-claude-text/40" />
                    <input 
                      type="text" 
                      placeholder="Search courses..." 
                      className="pl-10 pr-4 py-1.5 bg-claude-bg rounded-full text-sm outline-none w-64 focus:w-80 transition-all focus:ring-2 ring-claude-accent/20"
                    />
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <button className="relative p-2 text-claude-text/60 hover:bg-claude-bg rounded-full transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="h-8 w-[1px] bg-claude-border mx-1"></div>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-[#F9F7F2] p-1 pr-3 rounded-full transition-all">
                    <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  </div>
               </div>
            </header>
          )}

          {/* View Router */}
          <main className={`flex-1 overflow-y-auto ${showSidebar ? 'p-6 md:p-10' : ''}`}>
            {isLoading ? (
               <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center text-claude-text/40">
                     <Loader2 className="w-8 h-8 animate-spin mb-4" />
                     <p>Loading database...</p>
                  </div>
               </div>
            ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={view.type + (view.type === 'course-detail' ? view.course.id : '')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="h-full"
              >
                {view.type === 'landing' && <Landing courses={courses} onNavigate={navigate} onEnroll={handleEnroll} />}
                {view.type === 'login' && <AuthPages type="login" onNavigate={navigate} onLogin={(u) => { setUser(u); navigate('student-dashboard'); addToast('success', `Welcome back, ${u.name}!`); }} />}
                {view.type === 'signup' && <AuthPages type="signup" onNavigate={navigate} onSignup={(u) => { setUser(u); navigate('student-dashboard'); addToast('success', 'Account created successfully!'); }} />}
                {view.type === 'student-dashboard' && <StudentDashboard user={user} courses={courses} onNavigate={navigate} />}
                {view.type === 'course-catalog' && <CourseCatalog courses={courses} user={user} onNavigate={navigate} onEnroll={handleEnroll} />}
                {view.type === 'course-detail' && <CourseDetail course={view.course} isEnrolled={(user.enrolledCourses || []).includes(view.course.id)} onNavigate={navigate} onEnroll={() => handleEnroll(view.course)} />}
                {view.type === 'course-player' && <CoursePlayer course={view.course} activeLessonId={view.activeLessonId} onNavigate={navigate} />}
                {view.type === 'quiz' && <QuizEngine quiz={view.quiz} onComplete={(score) => { addToast('info', `Quiz complete! Final Score: ${score}%`); navigate('student-dashboard'); }} onBack={() => navigate('student-dashboard')} />}
                {view.type === 'instructor-dashboard' && <InstructorDashboard user={user} courses={courses} onNavigate={navigate} />}
                {view.type === 'course-create' && <CourseCreation onNavigate={navigate} onFinish={(newCourse) => { setCourses(prev => [...prev, newCourse]); addToast('success', 'Course published successfully!'); navigate('instructor-dashboard'); }} />}
                {view.type === 'certificates' && <Certificates onNavigate={navigate} />}
                {view.type === 'ai-tutor' && <AITutor onNavigate={navigate} user={user} courses={courses} />}
                {view.type === 'settings' && <SettingsView user={user} onNavigate={navigate} onSave={() => addToast('success', 'Settings saved!')} />}
                {view.type === 'my-courses' && <MyCourses courses={courses} user={user} onNavigate={navigate} />}
                {view.type === 'quiz-results' && <QuizResults onNavigate={navigate} />}
              </motion.div>
            </AnimatePresence>
            )}
          </main>
        </div>
      </div>

      {/* Floating Demo Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90]">
        <div className="px-6 py-3 bg-white/60 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[90vw]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1D]/40 mr-2 border-r border-[#E8E2D6] pr-3">Switch View</span>
          {[
            { id: 'landing', label: 'Home' },
            { id: 'login', label: 'Auth' },
            { id: 'student-dashboard', label: 'Dashboard' },
            { id: 'course-catalog', label: 'Catalog' },
            { id: 'instructor-dashboard', label: 'Instructor' },
            { id: 'course-create', label: 'Wizard' },
            { id: 'ai-tutor', label: 'AI Tutor' },
          ].map(page => (
            <button
              key={page.id}
              onClick={() => navigate(page.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                view.type === page.id ? 'bg-[#AE5633] text-white' : 'hover:bg-[#F9F7F2]/80 text-[#1D1D1D]/60'
              }`}
            >
              {page.label}
            </button>
          ))}
          <div className="w-[1px] h-4 bg-[#E8E2D6] mx-1"></div>
          <button 
            onClick={() => setUser(user.role === 'student' ? MOCK_INSTRUCTOR : MOCK_USER)}
            className="px-3 py-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-all"
          >
            Role: {user.role}
          </button>
        </div>
      </div>
      
      {/* Floating AI Side Assistant */}
      <Assistant />
    </div>
  );
}

export default App;
