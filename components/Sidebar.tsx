import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Compass, 
  HelpCircle, 
  Award, 
  MessageSquare, 
  Settings, 
  LogOut,
  Users,
  PlusCircle,
  BarChart3,
  Star
} from 'lucide-react';
import { User, ViewState } from '../types';
import logoImg from '../generated_logo.png';

interface SidebarProps {
  user: User;
  activeView: ViewState['type'];
  onNavigate: (view: ViewState['type']) => void;
  collapsed?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, activeView, onNavigate, collapsed, isMobileOpen, onMobileClose }) => {
  const isTeacher = user.role === 'teacher';

  const studentNav = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'course-catalog', label: 'Explore', icon: Compass },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'quiz-results', label: 'Quizzes', icon: HelpCircle },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'ai-tutor', label: 'AI Tutor', icon: MessageSquare },
  ];

  const teacherNav = [
    { id: 'instructor-dashboard', label: 'Instructor Hub', icon: LayoutDashboard },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'course-create', label: 'Create Course', icon: PlusCircle },
    { id: 'instructor-dashboard', label: 'Students', icon: Users },
    { id: 'instructor-dashboard', label: 'Revenue', icon: BarChart3 },
    { id: 'instructor-dashboard', label: 'Reviews', icon: Star },
  ];

  const navItems = isTeacher ? teacherNav : studentNav;

  return (
    <div className={`
      ${collapsed ? 'md:w-20' : 'md:w-64'} 
      ${isMobileOpen ? 'fixed inset-0 z-50 w-full' : 'hidden md:flex'}
      bg-white border-r border-[#E8E2D6] h-screen fixed left-0 top-0 transition-all duration-300 flex flex-col
    `}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
          <h1 className={`font-serif text-2xl font-semibold overflow-hidden whitespace-nowrap text-[#AE5633] ${collapsed && !isMobileOpen ? 'opacity-0' : 'opacity-100'}`}>
            LearnFlow
          </h1>
        </div>
        {isMobileOpen && (
            <button onClick={onMobileClose} className="p-2 md:hidden">
              <LogOut className="w-6 h-6 text-[#1D1D1D]/50" />
            </button>
        )}
        {!collapsed && !isMobileOpen && (
          <p className="mt-4 text-[10px] font-bold text-[#1D1D1D]/30 uppercase tracking-widest px-1">
             {isTeacher ? 'Instructor Portal' : 'Student Hub'}
          </p>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id as any);
                if (isMobileOpen) onMobileClose?.();
              }}
              className={`
                w-full flex items-center p-3 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-[#3D3929] text-white shadow-sm' : 'text-[#1D1D1D]/60 hover:bg-[#F9F7F2] hover:text-[#1D1D1D]'}
              `}
            >
              <item.icon className={`w-5 h-5 ${collapsed && !isMobileOpen ? 'mx-auto' : 'mr-3'}`} />
              {(!collapsed || isMobileOpen) && (
                <span className="font-medium">{item.label}</span>
              )}
              {isActive && (!collapsed || isMobileOpen) && (
                <motion.div 
                    layoutId="activeBar"
                    className="ml-auto w-1 h-4 bg-[#AE5633] rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#F9F7F2] space-y-1">
        <button 
           onClick={() => {
             onNavigate('settings');
             if (isMobileOpen) onMobileClose?.();
           }}
           className={`w-full flex items-center p-3 rounded-xl text-[#1D1D1D]/60 hover:bg-[#F9F7F2] hover:text-[#1D1D1D] transition-all`}
        >
          <Settings className={`w-5 h-5 ${collapsed && !isMobileOpen ? 'mx-auto' : 'mr-3'}`} />
          {(!collapsed || isMobileOpen) && <span className="font-medium">Settings</span>}
        </button>

        <button 
           onClick={() => {
             onNavigate('login');
             if (isMobileOpen) onMobileClose?.();
           }}
           className={`w-full flex items-center p-3 rounded-xl text-rose-500 hover:bg-rose-50/50 transition-all`}
        >
          <LogOut className={`w-5 h-5 ${collapsed && !isMobileOpen ? 'mx-auto' : 'mr-3'}`} />
          {(!collapsed || isMobileOpen) && <span className="font-medium">Log Out</span>}
        </button>
        
        <div className={`flex items-center ${collapsed && !isMobileOpen ? 'justify-center' : 'p-2 bg-[#F9F7F2] rounded-xl !mt-3'}`}>
          <img src={user.avatar} className="w-8 h-8 rounded-full border-2 border-white" alt="Avatar" />
          {(!collapsed || isMobileOpen) && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold truncate text-[#1D1D1D]">{user.name}</p>
              <p className="text-[10px] text-[#1D1D1D]/50 uppercase tracking-wider">{user.role}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
