import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Badge } from './UIComponents';
import { Course, ViewState } from '../types';
import { 
  ArrowLeft, 
  Play, 
  Users, 
  Star, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  FileText,
  HelpCircle,
  Video,
  ShieldCheck,
  Award,
  Globe,
  Share2,
  Heart,
  Sparkles
} from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  onNavigate: (view: ViewState | ViewState['type']) => void;
  onEnroll: () => void;
  isEnrolled?: boolean;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onNavigate, onEnroll, isEnrolled = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(course.curriculum[0]?.id || null);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const stats = [
    { label: 'Rating', value: `${course.rating} / 5`, icon: Star },
    { label: 'Students', value: `${(course.studentsCount/1000).toFixed(1)}k`, icon: Users },
    { label: 'Duration', value: course.duration, icon: Clock },
    { label: 'Level', value: course.level, icon: ShieldCheck },
  ];

  return (
    <div className="pb-32 relative">
      {/* Breadcrumb & Navigation */}
      <nav className="flex items-center justify-between mb-8">
        <button 
          onClick={() => onNavigate('course-catalog')}
          className="flex items-center gap-2 text-sm font-bold text-[#1D1D1D]/50 hover:text-[#1D1D1D] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>
        <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-full bg-white border border-[#E8E2D6]/50 hover:bg-[#F9F7F2] text-[#1D1D1D]/60 transition-all"><Share2 className="w-4 h-4" /></button>
            <button className="p-2.5 rounded-full bg-white border border-[#E8E2D6]/50 hover:bg-[#F9F7F2] text-[#1D1D1D]/60 transition-all"><Heart className="w-4 h-4" /></button>
        </div>
      </nav>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header Info */}
          <section>
            <div className="flex items-center gap-2 mb-4">
               <Badge variant="status">{course.category}</Badge>
               {course.isAI && <Badge variant="ai">AI GENERATED SUMMARY AVAILABLE</Badge>}
            </div>
            <h1 className="text-5xl font-serif font-medium leading-tight mb-6 text-[#1D1D1D]">{course.title}</h1>
            <p className="text-xl text-[#1D1D1D]/60 leading-relaxed mb-8">{course.description}</p>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#E8E2D6]/40">
                <img src={course.instructorAvatar} className="w-12 h-12 rounded-full" alt="" />
                <div className="text-[#1D1D1D]">
                   <p className="text-xs font-bold text-[#1D1D1D]/40 uppercase tracking-widest">Instructor</p>
                   <p className="font-bold">{course.instructor}</p>
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs font-bold text-[#1D1D1D]/40">
                   <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> English (CC)</span>
                   <span>Last Updated {course.lastUpdated}</span>
                </div>
            </div>
          </section>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {stats.map((stat, i) => (
                <Card key={i} className="p-5 flex flex-col items-center text-center">
                   <stat.icon className="w-5 h-5 text-[#AE5633] mb-2" />
                   <p className="text-xl font-bold font-serif text-[#1D1D1D]">{stat.value}</p>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[#1D1D1D]/40">{stat.label}</p>
                </Card>
             ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-[#E8E2D6]/40 flex gap-8">
            {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
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
                  <motion.div layoutId="tabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#AE5633] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
             {activeTab === 'overview' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-serif font-medium text-[#1D1D1D]">About this course</h3>
                    <p className="text-[#1D1D1D]/70 leading-relaxed text-lg">{course.longDescription}</p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-[24px] border border-[#E8E2D6]/40">
                    <h4 className="text-xl font-serif font-medium mb-6 text-[#1D1D1D]">What you'll learn</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {course.whatYouWillLearn.map((item, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-[#1D1D1D]/70">{item}</span>
                            </div>
                        ))}
                    </div>
                  </div>
               </motion.div>
             )}

             {activeTab === 'curriculum' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-2xl font-serif font-medium text-[#1D1D1D]">Course Content</h3>
                     <p className="text-xs font-bold text-[#1D1D1D]/50 uppercase">{course.lessonsCount} Lessons • {course.duration}</p>
                  </div>
                  <div className="space-y-3">
                     {course.curriculum.map((section) => {
                        const isExpanded = expandedSection === section.id;
                        return (
                           <div key={section.id} className="border border-[#E8E2D6]/40 rounded-2xl overflow-hidden bg-white">
                              <button 
                                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                                className="w-full flex items-center justify-between p-5 hover:bg-[#F9F7F2]/50 transition-all font-bold text-[#1D1D1D]"
                              >
                                 <div className="flex items-center gap-3">
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    <span>{section.title}</span>
                                 </div>
                                 <span className="text-xs opacity-40">{section.lessons.length} lessons</span>
                              </button>
                              <AnimatePresence>
                                {isExpanded && (
                                   <motion.div 
                                      initial={{ height: 0 }}
                                      animate={{ height: 'auto' }}
                                      exit={{ height: 0 }}
                                      className="overflow-hidden bg-[#F9F7F2]/30 border-t border-[#F9F7F2]"
                                   >
                                      {section.lessons.map((lesson) => (
                                         <div key={lesson.id} className="p-4 pl-12 flex items-center justify-between group hover:bg-[#F9F7F2] transition-all text-[#1D1D1D]">
                                            <div className="flex items-center gap-4">
                                               {lesson.type === 'video' && <Video className="w-4 h-4 text-[#1D1D1D]/40" />}
                                               {lesson.type === 'article' && <FileText className="w-4 h-4 text-[#1D1D1D]/40" />}
                                               {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4 text-[#1D1D1D]/40" />}
                                               <span className="text-sm font-medium">{lesson.title}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                               <span className="text-xs text-[#1D1D1D]/40">{lesson.duration}</span>
                                               {lesson.type === 'video' && <Play className="w-3 h-3 text-[#AE5633] opacity-0 group-hover:opacity-100 transition-all" />}
                                            </div>
                                         </div>
                                      ))}
                                   </motion.div>
                                )}
                              </AnimatePresence>
                           </div>
                        );
                     })}
                  </div>
               </motion.div>
             )}
          </div>
        </div>

        {/* Floating enrollment card (Sticky Sidebar) */}
        <div className="lg:col-span-1">
           <div className="sticky top-24">
              <Card elevate className="overflow-hidden border-none shadow-2xl">
                 <div 
                    onClick={() => setShowPromoModal(true)}
                    className="aspect-video relative group cursor-pointer" 
                    style={course.thumbnail.startsWith('linear-gradient') ? { background: course.thumbnail } : { backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                 >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur shadow-2xl flex items-center justify-center scale-100 group-hover:scale-110 transition-transform">
                           <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold text-center">Preview this course</div>
                 </div>
                 <div className="p-8 space-y-6 bg-white">
                    <div className="flex items-center gap-3 text-[#1D1D1D]">
                       <span className="text-4xl font-serif font-bold">{typeof course.price === 'number' ? `$${course.price.toFixed(2)}` : course.price}</span>
                       {typeof course.price === 'number' && (
                         <span className="text-lg text-[#1D1D1D]/30 line-through">${(course.price * 1.5).toFixed(2)}</span>
                       )}
                    </div>
                    
                    <div className="space-y-3">
                       <Button variant="primary" className="w-full py-4 text-lg" onClick={onEnroll}>
                          {isEnrolled ? 'Go to Course' : 'Enroll Now'}
                       </Button>
                       {!isEnrolled && <Button variant="secondary" className="w-full">Add to Wishlist</Button>}
                    </div>
                    
                    <p className="text-xs text-[#1D1D1D]/40 text-center font-medium">30-Day Money-Back Guarantee</p>
                    
                    <div className="space-y-4 pt-6 border-t border-[#F9F7F2]">
                       <p className="font-bold text-sm text-[#1D1D1D]">Course Includes:</p>
                       <ul className="space-y-3">
                          {[
                             { icon: Video, label: `${course.duration} video on-demand` },
                             { icon: FileText, label: `${course.lessonsCount} downloadable resources` },
                             { icon: Award, label: 'Certificate of completion' },
                             { icon: Globe, label: 'Full lifetime access' }
                          ].map((item, i) => (
                             <li key={i} className="flex items-center gap-3 text-sm text-[#1D1D1D]/60">
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                             </li>
                          ))}
                       </ul>
                    </div>

                    <div className="pt-6">
                        <Button variant="ai" className="w-full gap-2" icon={Sparkles}>
                           AI Course Summary
                        </Button>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </div>
      
      {/* Promo Video Modal */}
      <AnimatePresence>
        {showPromoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowPromoModal(false)}
          >
             <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.95, y: 20 }}
               className="bg-[#1D1D1D] rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative border border-white/10"
               onClick={(e) => e.stopPropagation()}
             >
                {/* Close Button */}
                <button 
                  onClick={() => setShowPromoModal(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 transition-all font-bold text-lg"
                >
                  ✕
                </button>
                <div className="aspect-video w-full bg-black">
                   <video 
                     key={course.curriculum[0]?.lessons[0]?.videoUrl || 'promo-video'}
                     src={course.curriculum[0]?.lessons[0]?.videoUrl || 'https://vjs.zencdn.net/v/oceans.mp4'} 
                     controls 
                     className="w-full h-full object-contain"
                   />
                </div>
                <div className="p-6 bg-[#1D1D1D] text-white font-sans">
                   <p className="text-xs font-bold text-[#AE5633] uppercase tracking-widest mb-1">Course Preview</p>
                   <h3 className="text-xl font-serif font-bold">{course.title}</h3>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetail;
