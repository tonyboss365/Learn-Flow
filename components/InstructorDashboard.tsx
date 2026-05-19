import React from 'react';
import { motion } from 'motion/react';
import { Card, Button, Badge } from './UIComponents';
import { User, ViewState, Course } from '../types';
import { 
  Users, 
  DollarSign, 
  Heart, 
  BarChart3, 
  PlusCircle, 
  ArrowUpRight, 
  Play, 
  Star,
  MoreVertical,
  MessageSquare,
  FileText
} from 'lucide-react';

interface InstructorDashboardProps {
  user: User;
  courses: Course[];
  onNavigate: (view: ViewState | ViewState['type']) => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ user, courses, onNavigate }) => {
  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="text-[#1D1D1D]">
           <Badge variant="status">Instructor Dashboard</Badge>
           <h1 className="text-4xl font-serif font-medium mt-3 mb-2">Creator Hub</h1>
           <p className="text-[#1D1D1D]/50">Manage your students, earnings, and course portfolio.</p>
        </div>
        <Button size="lg" icon={PlusCircle} onClick={() => onNavigate('course-create')} variant="primary">Create New Course</Button>
      </header>

      {/* Revenue Section */}
      <section>
        <Card className="p-8 bg-[#3D3929] text-white border-none relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5">
              <DollarSign className="w-64 h-64" />
           </div>
           <div className="relative z-10 grid md:grid-cols-3 gap-12 items-center">
              <div className="md:col-span-1">
                 <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Total Earnings</p>
                 <h2 className="text-5xl font-serif font-bold mb-4 font-serif">$12,480.00</h2>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                    <ArrowUpRight className="w-3 h-3" />
                    +15.4% this month
                 </div>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-8">
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Active Students</p>
                    <h3 className="text-3xl font-serif font-bold">2,450</h3>
                 </div>
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Avg. Course Rating</p>
                    <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-serif font-bold">4.9</h3>
                        <div className="flex text-amber-400">
                           {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </Card>
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Course Performance */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-medium text-[#1D1D1D]">Your Courses</h2>
              <button className="text-sm font-bold text-[#AE5633] hover:underline">View All Portfolio</button>
           </div>
           <div className="grid sm:grid-cols-2 gap-6">
              {courses.slice(0, 2).map((course) => (
                <Card key={course.id} elevate className="overflow-hidden group cursor-pointer flex flex-col">
                   <div className="h-40 relative" style={course.thumbnail.startsWith('linear-gradient') ? { background: course.thumbnail } : { backgroundImage: `url(${course.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                      <div className="absolute top-3 right-3">
                         <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <MoreVertical className="w-4 h-4 text-white" />
                         </div>
                      </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                      <h4 className="font-bold text-lg mb-4 line-clamp-1 group-hover:text-[#AE5633] transition-colors text-[#1D1D1D]">{course.title}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-auto">
                         <div className="p-3 bg-[#F9F7F2] rounded-xl text-[#1D1D1D]">
                            <p className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest mb-1">Students</p>
                            <p className="font-serif font-bold text-lg">{(course.studentsCount/1000).toFixed(1)}k</p>
                         </div>
                         <div className="p-3 bg-[#F9F7F2] rounded-xl text-[#1D1D1D]">
                            <p className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest mb-1">Revenue</p>
                            <p className="font-serif font-bold text-lg font-serif">${(course.price as number * course.studentsCount / 1000).toFixed(0)}k</p>
                         </div>
                      </div>
                   </div>
                </Card>
              ))}
           </div>

           {/* Sales Chart Mock */}
           <section className="space-y-6">
              <h2 className="text-2xl font-serif font-medium text-[#1D1D1D]">Revenue Trends</h2>
              <Card className="p-8">
                 <div className="h-64 flex items-end justify-between gap-4">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                       <div key={i} className="flex-1 flex flex-col items-center gap-4">
                          <div className="text-[10px] font-bold opacity-0 hover:opacity-100 transition-opacity bg-[#3D3929] text-white px-2 py-1 rounded-md mb-2">
                             ${height * 10}
                          </div>
                          <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${height}%` }}
                             transition={{ duration: 1, delay: i * 0.1 }}
                             className={`w-full max-w-[40px] rounded-t-lg bg-gradient-to-t ${i === 5 ? 'from-[#AE5633] to-[#BC7455]' : 'from-[#E8E2D6] to-[#F1EDE5]'}`}
                          />
                          <span className="text-[10px] font-bold text-[#1D1D1D]/30 uppercase tracking-widest">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                       </div>
                    ))}
                 </div>
              </Card>
           </section>
        </div>

        {/* Sidebar Widgets - Instructor */}
        <div className="space-y-10">
           
           {/* Quick Stats */}
           <section className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#1D1D1D]">Next Steps</h3>
              <div className="space-y-3">
                 {[
                    { label: 'New Students Joined', value: '18', icon: Users, color: 'emerald' },
                    { label: 'Unread Reviews', value: '12', icon: Star, color: 'amber' },
                    { label: 'Questions to Answer', value: '5', icon: MessageSquare, color: 'rose' }
                 ].map((action, i) => (
                    <button key={i} className="w-full text-left p-4 rounded-2xl bg-white border border-[#E8E2D6]/40 flex items-center justify-between group hover:scale-[1.02] transition-all">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${action.color}-50 text-${action.color}-600`}>
                             <action.icon className="w-5 h-5" />
                          </div>
                          <div className="text-[#1D1D1D]">
                             <p className="text-sm font-bold">{action.label}</p>
                             <p className="text-xs text-[#1D1D1D]/50">Check performance</p>
                          </div>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-[#F9F7F2] flex items-center justify-center text-sm font-bold text-[#1D1D1D]">
                          {action.value}
                       </div>
                    </button>
                 ))}
              </div>
           </section>

           {/* Quick Actions */}
           <section className="space-y-4 text-[#1D1D1D]">
              <h3 className="font-serif font-bold text-lg">Shortcuts</h3>
              <div className="grid grid-cols-2 gap-4">
                 <button className="flex flex-col items-center gap-3 p-6 rounded-[20px] bg-white border border-[#E8E2D6]/40 hover:bg-[#F9F7F2]/50 transition-all group">
                    <FileText className="w-6 h-6 text-[#1D1D1D]/40 group-hover:text-[#AE5633] transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/40 group-hover:text-[#1D1D1D] transition-colors">Reports</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 p-6 rounded-[20px] bg-white border border-[#E8E2D6]/40 hover:bg-[#F9F7F2]/50 transition-all group">
                    <BarChart3 className="w-6 h-6 text-[#1D1D1D]/40 group-hover:text-[#AE5633] transition-colors" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/40 group-hover:text-[#1D1D1D] transition-colors">Analytics</span>
                 </button>
              </div>
           </section>

           {/* Feedback Shout-out */}
           <Card className="p-6 bg-gradient-to-tr from-[#AE5633] to-[#BC7455] text-white border-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                 <Star className="w-24 h-24" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-4">Top Review This Week</p>
              <div className="flex text-amber-300 mb-4">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-sm font-serif italic mb-6 leading-relaxed">
                 "Sarah's AI architecture course is the most granular and practical guide I've ever found. Truly elite instruction."
              </p>
              <div className="flex items-center gap-3">
                 <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full border border-white/20" alt="" />
                 <p className="text-xs font-bold">— Marcus Thorne</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
