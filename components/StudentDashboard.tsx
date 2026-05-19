import React from 'react';
import { motion } from 'motion/react';
import { Card, Button, Badge } from './UIComponents';
import { MOCK_QUIZ } from '../constants';
import { ViewState, User, Course } from '../types';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  Trophy, 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Award,
  Sparkles,
  Calendar
} from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  courses: Course[];
  onNavigate: (view: ViewState | ViewState['type']) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, courses, onNavigate }) => {
  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Section */}
      <section>
        <div className="p-8 bg-[#3D3929] text-white overflow-hidden relative border-none rounded-[14px] shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-serif font-medium mb-3">Good morning, {user.name} 👋</h1>
            <p className="text-white/80 text-lg mb-6">You've completed 75% of your goal this week. Keep the momentum going!</p>
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => onNavigate('course-catalog')}>Find New Course</Button>
              <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20">View Goal</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Courses Enrolled', value: '12', icon: BookOpen, trend: '+2 this month', color: 'claude-accent' },
          { label: 'Hours Learned', value: '148', icon: Clock, trend: '+12h this week', color: 'claude-secondary' },
          { label: 'Quizzes Passed', value: '42', icon: CheckCircle2, trend: '98% avg score', color: 'emerald' },
          { label: 'Certificates', value: '4', icon: Award, trend: '1 pending', color: 'rose' }
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-[#AE5633]/10 text-[#AE5633]`}>
                <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-[#1D1D1D]/50 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-serif font-bold text-[#1D1D1D]">{stat.value}</h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
          </Card>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-medium text-[#1D1D1D]">Continue Learning</h2>
              <button className="text-sm font-bold text-[#AE5633] hover:underline flex items-center gap-1">
                All Enrolled <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {courses.slice(0, 2).map((course, i) => (
                <Card key={course.id} className="p-4 flex items-center group cursor-pointer hover:bg-[#F9F7F2]/50 transition-all border-[#E8E2D6]/50" onClick={() => onNavigate({ type: 'course-player', course, activeLessonId: 'l1' })}>
                  <div 
                    className="w-24 h-16 rounded-lg overflow-hidden relative shrink-0 mr-4" 
                    style={course.thumbnail.startsWith('linear-gradient') ? { background: course.thumbnail } : { backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                        <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pr-4 text-[#1D1D1D]">
                    <h4 className="font-bold text-sm truncate mb-1">{course.title}</h4>
                    <p className="text-xs text-[#1D1D1D]/50">Next: Lesson {i === 0 ? '4: CNNs and Vision Transformers' : '2: The Designer Mindset'}</p>
                    <div className="mt-2 flex items-center gap-4">
                        <div className="flex-1 h-1 bg-[#F9F7F2] rounded-full overflow-hidden">
                            <div className="bg-[#AE5633] h-full rounded-full" style={{ width: i === 0 ? '75%' : '32%' }}></div>
                        </div>
                        <span className="text-[10px] font-bold opacity-60 shrink-0">{i === 0 ? '75%' : '32%'}</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="hidden sm:flex group-hover:bg-[#AE5633] group-hover:text-white transition-all">Resume</Button>
                </Card>
              ))}
            </div>
          </section>

          {/* AI Personalized Suggestions */}
          <section>
             <h2 className="text-2xl font-serif font-medium text-[#1D1D1D] mb-6">AI Study Recommendations</h2>
             <div className="p-6 rounded-2xl bg-white border border-[#E8E2D6]/40">
                <p className="text-sm text-[#1D1D1D]/70 mb-4">Based on your recent quiz scores, we suggest reviewing these lessons to boost your understanding.</p>
                <div className="space-y-3">
                   <button className="w-full text-left p-3 rounded-xl bg-[#F9F7F2] hover:bg-[#E8E2D6]/50 transition-all font-bold text-sm text-[#1D1D1D]">Improvement: Backpropagation Visualized</button>
                   <button className="w-full text-left p-3 rounded-xl bg-[#F9F7F2] hover:bg-[#E8E2D6]/50 transition-all font-bold text-sm text-[#1D1D1D]">Deep Dive: CNN Activation Maps</button>
                </div>
             </div>
          </section>

          {/* Recommended AI */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-[#1D1D1D]">
              <h2 className="text-2xl font-serif font-medium">AI Recommended</h2>
              <Badge variant="ai">Personalized</Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                {[courses[2], courses[0]].filter(Boolean).map(course => (
                    <Card key={course.id} elevate className="overflow-hidden flex flex-col group cursor-pointer" onClick={() => onNavigate({ type: 'course-detail', course })}>
                        <div 
                          className="h-40 relative" 
                          style={course.thumbnail.startsWith('linear-gradient') ? { background: course.thumbnail } : { backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                           <div className="absolute top-3 right-3">
                              <Badge variant="ai">{(Math.random() * 20 + 75).toFixed(0)}% Match</Badge>
                           </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col text-[#1D1D1D]">
                            <h4 className="font-bold text-base line-clamp-1 mb-1">{course.title}</h4>
                            <p className="text-xs text-[#1D1D1D]/50 mb-4">{course.instructor}</p>
                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F9F7F2]">
                                <span className="text-sm font-bold">${typeof course.price === 'number' ? course.price : '0'}</span>
                                <Button size="sm" variant="ghost" onClick={() => onNavigate({ type: 'course-detail', course })}>Learn More</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-10">
          
          {/* Streak Widget */}
          <Card className="p-6 bg-white overflow-hidden relative">
            <div className="flex items-center justify-between mb-6 text-[#1D1D1D]">
                <h3 className="font-serif font-bold text-lg">Weekly Streak</h3>
                <div className="flex items-center gap-1 text-rose-500 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>7 Days</span>
                </div>
            </div>
            <div className="flex justify-between gap-2 overflow-x-auto pb-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-[#1D1D1D]/30">{day}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            i < 6 ? 'bg-[#AE5633] text-white shadow-sm' : 'bg-[#F9F7F2] text-[#1D1D1D]/30'
                        }`}>
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-[#1D1D1D]/50 text-center">You're doing great! One more day for a full week.</p>
          </Card>

          {/* Upcoming Events */}
          <section>
            <h3 className="font-serif font-bold text-lg mb-6 text-[#1D1D1D]">Upcoming</h3>
            <div className="space-y-4">
                {[
                    { title: 'AI Ethics Live Workshop', time: 'Today, 2:00 PM', icon: Play, color: 'claude-accent' },
                    { title: 'Neural Networks Quiz', time: 'Tomorrow, 10:00 AM', icon: Calendar, color: 'claude-secondary' }
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E8E2D6]/40">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#AE5633]/10 text-[#AE5633]`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div className="text-[#1D1D1D]">
                            <p className="text-sm font-bold">{item.title}</p>
                            <p className="text-xs text-[#1D1D1D]/50">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
          </section>

          {/* Quick AI Tutor */}
          <Card className="p-6 bg-[#3D3929] text-white border-none overflow-hidden relative group cursor-pointer" onClick={() => onNavigate('ai-tutor')}>
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-20 h-20" />
             </div>
             <h3 className="text-lg font-serif mb-2">Have a question?</h3>
             <p className="text-white/60 text-sm mb-4 leading-relaxed">Our AI tutor is online and ready to help you with anything.</p>
             <Button variant="primary" size="sm" className="w-full bg-[#AE5633]">Ask Anything</Button>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
