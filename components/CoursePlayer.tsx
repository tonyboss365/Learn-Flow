import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Badge } from './UIComponents';
import { Course, ViewState } from '../types';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  X,
  Play,
  CheckCircle2,
  Video,
  FileText,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Download,
  Share2,
  Maximize2,
  Settings
} from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  activeLessonId: string;
  onNavigate: (view: ViewState | ViewState['type']) => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, activeLessonId, onNavigate }) => {
  const [currentLessonId, setCurrentLessonId] = useState(activeLessonId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'q&a' | 'transcript'>('notes');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  // Flatten curriculum for easier navigation
  const allLessons = course.curriculum.flatMap(s => s.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === currentLessonId);
  const currentLesson = allLessons[currentLessonIndex] || allLessons[0];
  
  const progress = Math.round(((completedLessonIds.size) / allLessons.length) * 100);

  const toggleLessonCompletion = (lessonId: string) => {
    setCompletedLessonIds(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const nextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
        setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  const prevLesson = () => {
    if (currentLessonIndex > 0) {
        setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F2] flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar - Curriculum */}
      <motion.div 
        initial={false}
        animate={{ width: isSidebarOpen ? 320 : 0 }}
        className="h-full bg-white border-r border-[#E8E2D6] overflow-hidden flex flex-col z-10"
      >
        <div className="p-6 border-b border-[#F9F7F2] flex items-center justify-between shrink-0">
          <h2 className="font-serif font-bold truncate pr-4 text-[#1D1D1D]">{course.title}</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-[#1D1D1D]/40 hover:text-[#1D1D1D]"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 bg-[#F9F7F2]/30 shrink-0">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold uppercase tracking-wider text-[#1D1D1D]/40">Your Progress</span>
             <span className="text-xs font-bold text-[#AE5633]">{progress}%</span>
           </div>
           <div className="w-full h-1.5 bg-[#F9F7F2] rounded-full overflow-hidden">
             <div className="h-full bg-[#AE5633] transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {course.curriculum.map((section, si) => (
             <div key={section.id}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1D1D1D]/30 mb-4 px-2">{section.title}</h3>
                <div className="space-y-1">
                   {section.lessons.map((lesson, li) => {
                      const isActive = lesson.id === currentLessonId;
                      const isCompleted = completedLessonIds.has(lesson.id);
                      return (
                        <button 
                          key={lesson.id}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={`
                            w-full flex items-center p-3 rounded-xl transition-all text-left group
                            ${isActive ? 'bg-[#AE5633]/5 text-[#AE5633]' : 'hover:bg-[#F9F7F2] text-[#1D1D1D]/60'}
                          `}
                        >
                          <div className="relative mr-3 flex-shrink-0">
                             {isCompleted ? (
                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                             ) : (
                               lesson.type === 'video' ? <Video className="w-4 h-4 opacity-40" /> : 
                               lesson.type === 'quiz' ? <HelpCircle className="w-4 h-4 opacity-40" /> : 
                               <FileText className="w-4 h-4 opacity-40" />
                             )}
                          </div>
                          <div className="flex-1 min-w-0 font-medium">
                             <p className={`text-xs font-medium truncate ${isActive ? 'font-bold' : ''}`}>{lesson.title}</p>
                             <p className="text-[10px] opacity-50 mt-0.5">{lesson.duration}</p>
                          </div>
                          {isActive && <div className="w-1.5 h-1.5 bg-[#AE5633] rounded-full"></div>}
                        </button>
                      );
                   })}
                </div>
             </div>
           ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top bar */}
        <header className="h-16 px-6 bg-white/70 backdrop-blur-md border-b border-[#E8E2D6] flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-[#1D1D1D]/60 hover:bg-[#F9F7F2] rounded-full">
                   <Menu className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => onNavigate('course-catalog')}
                className="flex items-center gap-2 text-sm font-bold text-[#1D1D1D]/50 hover:text-[#1D1D1D] transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Course</span>
              </button>
              <div className="h-6 w-[1px] bg-[#E8E2D6] hidden sm:block"></div>
              <h1 className="text-sm font-serif font-bold truncate max-w-[200px] sm:max-w-md text-[#1D1D1D]">{currentLesson.title}</h1>
           </div>

           <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="hidden sm:flex" icon={Share2}>Share</Button>
              <Button variant="secondary" size="sm" icon={MessageSquare}>Q&A</Button>
           </div>
        </header>

        {/* Player & Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
           
           {/* Video / Content Area */}
           <div className="w-full aspect-video bg-black relative group overflow-hidden">
                             {currentLesson.type === 'video' ? (
                 <video 
                   key={currentLessonId}
                   src={currentLesson.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4'} 
                   controls 
                   autoPlay
                   className="w-full h-full object-contain"
                   poster={course.thumbnail.startsWith('linear-gradient') ? undefined : course.thumbnail}
                 />
               ) : currentLesson.type === 'quiz' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur p-8 text-center text-[#1D1D1D]">
                   <HelpCircle className="w-20 h-20 text-[#AE5633] mb-6 animate-bounce" />
                   <h2 className="text-3xl font-serif font-medium mb-4">Module Checkpoint</h2>
                   <p className="max-w-md text-[#1D1D1D]/60 mb-8 font-medium">Ready to test what you've learned in this section? This quiz will contribute to your certificate final score.</p>
                   <Button size="lg" onClick={() => onNavigate({ type: 'quiz', quiz: course.curriculum[0].lessons.find(l => l.type === 'quiz') as any || {} as any, courseId: course.id })}>Start Quiz Now</Button>
                </div>
              ) : (
                <div className="flex-1 bg-white p-10 overflow-y-auto">
                   <h1 className="text-4xl font-serif mb-8 text-[#1D1D1D]">{currentLesson.title}</h1>
                   <div className="prose prose-stone max-w-none text-[#1D1D1D]/70 leading-loose text-lg">
                      <p className="mb-6">{currentLesson.content || 'No content provided for this lesson.'}</p>
                      <p>Exploring the core concepts of this module allows us to understand the fundamental architecture of modern workflows. Whether you are dealing with complex data structures or creative design processes, the underlying principles remain consistent: clarity, efficiency, and empathy.</p>
                   </div>
                </div>
              )}
              
              
           </div>

           {/* Lesson Info Tabs */}
           <div className="max-w-4xl mx-auto w-full px-6 py-12 space-y-10">
              <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-3xl font-serif font-medium mb-2 text-[#1D1D1D]">{currentLesson.title}</h2>
                    <p className="text-sm font-bold text-[#1D1D1D]/40 uppercase tracking-widest">{currentLesson.duration} • Published in {course.lastUpdated}</p>
                 </div>
                 <div className="flex gap-3">
                    <button 
                        onClick={prevLesson}
                        disabled={currentLessonIndex === 0}
                        className="p-3 rounded-xl bg-white border border-[#E8E2D6]/50 hover:bg-[#F9F7F2] disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextLesson}
                        disabled={currentLessonIndex === allLessons.length - 1}
                        className="px-6 py-3 rounded-xl bg-[#3D3929] text-white font-bold hover:brightness-110 flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        Next Lesson <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              <div className="border-b border-[#E8E2D6]/40 flex gap-8">
                 {['notes', 'resources', 'q&a', 'transcript'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`
                            pb-4 text-sm font-bold uppercase tracking-widest transition-all relative
                            ${activeTab === tab ? 'text-[#AE5633]' : 'text-[#1D1D1D]/40 hover:text-[#1D1D1D]'}
                        `}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="playerTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#AE5633] rounded-t-full" />
                        )}
                    </button>
                 ))}
              </div>

              <div className="min-h-[200px]">
                 {activeTab === 'notes' && (
                    <div className="space-y-6">
                        <textarea 
                            placeholder="Type a new note..."
                            className="w-full h-32 p-4 bg-white border border-[#E8E2D6]/50 rounded-2xl outline-none focus:ring-2 ring-[#AE5633]/10 focus:border-[#AE5633] transition-all resize-none font-medium text-[#1D1D1D]"
                        ></textarea>
                        <div className="flex justify-between items-center">
                           <p className="text-xs text-[#1D1D1D]/40 font-medium">Notes are automatically saved to your dashboard.</p>
                           <Button size="sm">Save Note</Button>
                        </div>
                    </div>
                 )}
                 {activeTab === 'resources' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {[
                         { name: 'Lecture Slides (PDF)', size: '2.4 MB' },
                         { name: 'Practice Dataset (CSV)', size: '1.8 MB' },
                         { name: 'Coding Template (ZIP)', size: '542 KB' }
                       ].map((res, i) => (
                         <div key={i} className="p-4 bg-white border border-[#E8E2D6]/40 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-[#AE5633] hover:text-white transition-all">
                            <div className="flex items-center gap-3">
                               <Download className="w-5 h-5 text-[#AE5633] group-hover:text-white" />
                               <div>
                                  <p className="text-sm font-bold">{res.name}</p>
                                  <p className="text-[10px] opacity-60 uppercase">{res.size}</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-40" />
                         </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* AI Assistant Drawer Toggle */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
            className={`
                w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white relative
                ${isAIChatOpen ? 'bg-[#3D3929]' : 'bg-[#AE5633]'}
            `}
        >
            {isAIChatOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
            {!isAIChatOpen && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#F9F7F2]">
                    AI
                </div>
            )}
        </motion.button>
      </div>

      {/* AI Chat Drawer */}
      <AnimatePresence>
        {isAIChatOpen && (
           <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[55] flex flex-col"
           >
              <div className="p-6 bg-[#AE5633] text-white shrink-0">
                 <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-serif font-bold text-lg">LearnFlow AI Tutor</h3>
                 </div>
                 <p className="text-white/70 text-xs">Ask me anything about: "{currentLesson.title}"</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9F7F2]/30">
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#AE5633] flex items-center justify-center text-white shrink-0"><Sparkles className="w-4 h-4" /></div>
                    <div className="p-4 bg-white rounded-[20px] rounded-tl-none shadow-sm text-sm text-[#1D1D1D]/70 leading-relaxed border border-[#E8E2D6]/30">
                       Hello! I'm your AI tutor. I've analyzed this lesson and the course materials. How can I help you today?
                    </div>
                 </div>

                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest pl-1">Suggested Questions</p>
                    <div className="flex flex-wrap gap-2">
                       {["Explain the main core points", "Give me a practice example", "Summarize this video"].map((q, i) => (
                          <button key={i} className="text-xs px-3 py-2 bg-white border border-[#E8E2D6]/40 rounded-full hover:border-[#AE5633] hover:text-[#AE5633] transition-all text-[#1D1D1D]/70">
                             {q}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-[#F9F7F2] bg-white">
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask a question..." 
                      className="w-full pl-4 pr-12 py-3 bg-[#F9F7F2] rounded-2xl text-sm outline-none border focus:border-[#AE5633] transition-all text-[#1D1D1D]"
                    />
                    <button className="absolute right-2 top-2 p-1.5 bg-[#AE5633] text-white rounded-xl shadow-lg">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default CoursePlayer;
