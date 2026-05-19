import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, Input } from './UIComponents';
import { User as UserType, ViewState } from '../types';
import { MOCK_USER, MOCK_INSTRUCTOR } from '../constants';
import { Sparkles, ArrowLeft, Code, Globe, ChevronRight, User as UserIcon, GraduationCap } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface AuthPagesProps {
  type: 'login' | 'signup';
  onNavigate: (view: ViewState | ViewState['type']) => void;
  onLogin: (user: UserType) => void;
  onSignup: (user: UserType) => void;
}

const AuthPages: React.FC<AuthPagesProps> = ({ type, onNavigate, onLogin, onSignup }) => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    let newErrors: Record<string, string> = {};
    if (type === 'signup') {
      if (!formData.name) newErrors.name = 'Full name is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email address';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      if (type === 'signup') {
        const newUser = {
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role,
          avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.email}`,
          joined_date: new Date().toISOString(),
          enrolled_courses: []
        };

        const { data, error } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (error) {
          console.error('Database Profile Creation Error:', error);
          if (error.code === '23505') {
            setErrors({ email: 'This email is already registered.' });
          } else if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch') || error.message?.includes('NetworkError')) {
            setErrors({ email: 'Vite server restart required! Please stop your terminal (Ctrl+C) and run "npm run dev" again so the server loads your new .env.local Supabase keys.' });
          } else {
            setErrors({ email: `Failed to create profile. Ensure you ran the SQL editor commands in Supabase: ${error.message}` });
          }
          return;
        }

        if (data) {
          const u: UserType = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role as 'student' | 'teacher',
            avatar: data.avatar,
            bio: data.bio,
            joinedDate: data.joined_date,
            enrolledCourses: data.enrolled_courses || []
          };
          onSignup(u);
        }
      } else {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', formData.email.toLowerCase())
          .eq('password', formData.password)
          .maybeSingle();

        if (error) {
          if (error.message?.includes('Failed to fetch') || error.message?.includes('fetch') || error.message?.includes('NetworkError')) {
            setErrors({ email: 'Vite server restart required! Please stop your terminal (Ctrl+C) and run "npm run dev" again so the server loads your new .env.local Supabase keys.' });
          } else {
            setErrors({ email: `Login failed: ${error.message}` });
          }
          return;
        }

        if (!data) {
          setErrors({ email: 'Invalid email or password.' });
          return;
        }

        const u: UserType = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role as 'student' | 'teacher',
            avatar: data.avatar,
            bio: data.bio,
            joinedDate: data.joined_date,
            enrolledCourses: data.enrolled_courses || []
        };
        onLogin(u);
      }
    } catch (error) {
      setErrors({ email: 'An unexpected error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) {
        setErrors({ email: `Failed to login with ${provider}` });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-12 bg-[#F9F7F2]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl h-[600px] bg-white rounded-[32px] overflow-hidden shadow-2xl flex border border-[#E8E2D6]"
      >
        {/* Left Side: Animated Brand Area */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#3D3929] relative overflow-hidden p-12 flex-col justify-between">
           <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-gradient-to-br from-[#AE5633]/20 to-transparent blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-gradient-to-tr from-[#AE5633]/10 to-transparent blur-3xl animate-pulse delay-700"></div>
           </div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-12 text-white">
                <div className="w-8 h-8 bg-[#AE5633] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xl font-serif font-semibold">LearnFlow AI</span>
              </div>
              <h2 className="text-5xl font-serif text-white font-medium leading-tight mb-6">
                Start your <span className="text-[#AE5633]">AI-enhanced</span> learning journey.
              </h2>
              <p className="text-white/60 text-lg max-w-sm">
                Join 50,000+ students building the future of technology and design.
              </p>
           </div>

           <div className="relative z-10 text-white/40 text-sm font-medium">
             © 2024 LearnFlow AI Inc.
           </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative bg-white">
          <button 
            onClick={() => onNavigate('landing')}
            className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-[#1D1D1D]/40 hover:text-[#1D1D1D] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="max-w-sm mx-auto w-full mt-16">
            <h1 className="text-3xl font-serif font-medium mb-2 text-[#1D1D1D]">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-[#1D1D1D]/50 text-sm mb-8">
              {type === 'login' ? 'Please enter your details to sign in.' : 'Choose how you want to use LearnFlow.'}
            </p>

            {type === 'signup' && (
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setRole('student')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                    role === 'student' ? 'border-[#AE5633] bg-[#AE5633]/5 text-[#AE5633]' : 'border-[#E8E2D6] text-[#1D1D1D]/50 hover:bg-[#F9F7F2]'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-wider">Student</span>
                </button>
                <button 
                  onClick={() => setRole('teacher')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                    role === 'teacher' ? 'border-[#AE5633] bg-[#AE5633]/5 text-[#AE5633]' : 'border-[#E8E2D6] text-[#1D1D1D]/50 hover:bg-[#F9F7F2]'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-wider">Teacher</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {type === 'signup' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Input 
                        label="Full Name" 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        error={errors.name}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <Input 
                  label="Email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  error={errors.email}
              />
              <div className="space-y-1">
                <Input 
                    label="Password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    error={errors.password}
                />
                {type === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs font-semibold text-[#AE5633] hover:underline">Forgot password?</button>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {type === 'signup' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Input 
                      label="Confirm Password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      error={errors.confirmPassword}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full" loading={isLoading} size="lg">
                {type === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>


            <p className="text-center mt-8 text-sm text-[#1D1D1D]/50">
              {type === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button 
                 onClick={() => onNavigate(type === 'login' ? 'signup' : 'login')}
                 className="ml-2 font-bold text-[#1D1D1D] hover:text-[#AE5633] transition-all"
              >
                {type === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPages;
