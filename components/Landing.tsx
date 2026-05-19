import React from 'react';
import { motion } from 'motion/react';
import { Button, Card, Badge } from './UIComponents';
import { CourseCard } from './CourseCard';
import { ViewState, Course } from '../types';
import { Play, Users, Star, Award, Shield, Globe, Sparkles, MessageSquare, BarChart3 } from 'lucide-react';
import logoImg from '../generated_logo.png';
import promoVideo from '../Video Project 13.mp4';

interface LandingProps {
  courses: Course[];
  onNavigate: (view: ViewState | ViewState['type']) => void;
  onEnroll?: (course: Course) => void;
}

const Landing: React.FC<LandingProps> = ({ courses, onNavigate, onEnroll }) => {
  return (
    <div className="relative overflow-hidden bg-[#F9F7F2]">
      {/* Subtle Background Accent */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div 
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#AE5633] to-[#E8E2D6] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
          }}
        />
      </div>

      {/* Navbar (Public) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#F9F7F2]/80 backdrop-blur-md border-b border-[#E8E2D6]/50 h-20 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
           <img src={logoImg} alt="LearnFlow Logo" className="w-10 h-10 object-contain" />
           <span className="text-2xl font-serif font-semibold tracking-tight text-[#1D1D1D]">LearnFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1D1D1D]/80">
          <a href="#features" className="hover:text-[#AE5633] transition-colors">Features</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('course-catalog'); }} className="hover:text-[#AE5633] transition-colors">Courses</a>
          <a href="#instructors" className="hover:text-[#AE5633] transition-colors">Become an Instructor</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate('login')}>Login</Button>
          <Button variant="primary" onClick={() => onNavigate('signup')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-[#E8E2D6] shadow-sm mb-6 text-xs font-semibold text-[#AE5633] gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    New: AI-Driven Learning Paths
                </div>
                <h1 className="text-6xl sm:text-7xl font-serif font-medium leading-tight mb-6">
                    Learn Smarter with <span className="text-[#AE5633]">AI-Powered</span> Courses
                </h1>
                <p className="text-xl text-[#1D1D1D]/60 leading-relaxed mb-10 max-w-lg">
                    Experience the future of education. Personalized paths, real-time AI assistance, and high-quality content from elite instructors.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button size="lg" onClick={() => onNavigate('signup')}>Start Learning Free</Button>
                    <Button variant="secondary" size="lg" icon={Play} onClick={() => onNavigate('course-catalog')}>Watch Preview</Button>
                </div>
                
                <div className="mt-12 flex items-center gap-6">
                    <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-[#F9F7F2]" alt="" />
                        ))}
                    </div>
                    <div className="text-sm">
                        <p className="font-bold">50k+ Happy Students</p>
                        <div className="flex text-amber-500 gap-0.5">
                            {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                            <span className="text-[#1D1D1D] ml-2 text-xs opacity-60">4.9/5 Average Rating</span>
                        </div>
                    </div>
                </div>
            </motion.div>


            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative"
            >
                <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                    <img 
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full object-cover aspect-[4/3] hover:scale-105 transition-transform duration-700" 
                        alt="Learning Environment" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                </div>
                
                {/* Floating Cards */}
                <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: -20 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3, ease: "easeInOut" }}
                    className="absolute -top-10 -right-8 z-20"
                >
                    <Card className="px-6 py-4 bg-white/90 backdrop-blur-md border-white/50 shadow-xl max-w-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Course Completed</p>
                                <p className="text-xs text-[#2C2A26]/50">Advanced Neural Networks</p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div 
                    initial={{ x: -20 }}
                    animate={{ x: 20 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 4, ease: "easeInOut" }}
                    className="absolute -bottom-6 -left-8 z-20"
                >
                    <Card className="px-6 py-4 bg-white/90 backdrop-blur-md border-white/50 shadow-xl">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-[#F9F7F2] rounded-full flex items-center justify-center text-[#AE5633] font-serif font-bold text-lg">78%</div>
                             <div>
                                <p className="text-sm font-bold text-[#1D1D1D]">Current Progress</p>
                                <div className="w-32 h-1.5 bg-[#F9F7F2] rounded-full mt-1 overflow-hidden">
                                    <div className="w-[78%] h-full bg-[#AE5633] rounded-full"></div>
                                </div>
                             </div>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
      </section>

      {/* Promotional Video Section */}
      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto">
        <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-[#AE5633]/10 aspect-video relative">
            <video 
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1544716270-ca5ca9844203?auto=format&fit=crop&q=80&w=1200"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={promoVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-serif font-bold">Discover LearnFlow</h3>
                <p className="text-white/80">See how we revolutionize online education</p>
            </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-[#E8E2D6]">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-12">
            {[
                { label: 'Courses', value: '1,200+' },
                { label: 'Students', value: '50k+' },
                { label: 'Rating', value: '4.9/5' },
                { label: 'Instructors', value: '250+' }
            ].map((stat, i) => (
                <div key={i} className="flex-1 min-w-[150px] text-center text-[#1D1D1D]">
                    <p className="text-4xl font-serif font-bold mb-2">{stat.value}</p>
                    <p className="text-sm uppercase tracking-widest text-[#1D1D1D]/50">{stat.label}</p>
                </div>
            ))}
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#E8E2D6]/20">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20 text-[#1D1D1D]">
            <h2 className="text-5xl font-serif font-medium mb-6">Why LearnFlow AI?</h2>
            <p className="text-xl text-[#1D1D1D]/60 max-w-2xl mx-auto">Traditional learning is broken. We rebuilt it from the ground up using intelligence and empathy.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {[
                { icon: Sparkles, title: 'AI Personalized Path', desc: 'Our algorithms adapt to your pace, strengths, and weaknesses dynamically.' },
                { icon: Globe, title: 'Global Community', desc: 'Learn with thousands of peers across 60+ countries. Collective wisdom at your fingertips.' },
                { icon: Award, title: 'Verified Certification', desc: 'Secure, blockchain-verified certificates that top tech companies actually trust.' },
                { icon: Shield, title: 'Expert Instruction', desc: 'Not just teachers, but masters. 100% of our curriculum is built by industry lead experts.' },
                { icon: MessageSquare, title: '24/7 AI Tutor', desc: 'Stuck on a concept? Our AI assistant is always ready to explain, clarify, and guide.' },
                { icon: BarChart3, title: 'Deep Analytics', desc: 'Track your growth with granular metrics. See exactly where your skills are improving.' }
            ].map((f, i) => (
                <Card key={i} className="p-8 hover:bg-white transition-colors duration-500 border-[#E8E2D6]/30">
                    <div className="w-12 h-12 bg-[#AE5633]/10 rounded-xl flex items-center justify-center text-[#AE5633] mb-6">
                        <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-medium mb-3 text-[#1D1D1D]">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-[#1D1D1D]/60">{f.desc}</p>
                </Card>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F9F7F2] pt-24 pb-12 px-6 sm:px-12 border-t border-[#E8E2D6]">
         <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-20">
                <div className="md:col-span-1">
                     <div className="flex items-center gap-2 mb-6">
                        <img src={logoImg} alt="LearnFlow Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-serif font-semibold tracking-tight text-[#1D1D1D]">LearnFlow AI</span>
                     </div>
                    <p className="text-sm text-[#1D1D1D]/50 leading-relaxed mb-6">
                        Empowering the next generation of builders, thinkers, and explorers.
                    </p>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#E8E2D6]/30 flex items-center justify-center cursor-pointer hover:bg-[#AE5633] hover:text-white transition-all">
                            <i className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div>
                   <h4 className="font-serif font-bold mb-6 text-[#1D1D1D]">Platform</h4>
                   <ul className="space-y-4 text-sm text-[#1D1D1D]/60 font-medium">
                      <li className="hover:text-[#AE5633] cursor-pointer" onClick={() => onNavigate('course-catalog')}>Courses</li>
                      <li className="hover:text-[#AE5633] cursor-pointer">Pricing</li>
                      <li className="hover:text-[#AE5633] cursor-pointer">Certificates</li>
                      <li className="hover:text-[#AE5633] cursor-pointer">Enterprise</li>
                   </ul>
                </div>
                <div>
                   <h4 className="font-serif font-bold mb-6 text-[#1D1D1D]">Support</h4>
                   <ul className="space-y-4 text-sm text-[#1D1D1D]/60 font-medium">
                      <li className="hover:text-[#AE5633] cursor-pointer">Help Center</li>
                      <li className="hover:text-[#AE5633] cursor-pointer">Terms of Service</li>
                      <li className="hover:text-[#AE5633] cursor-pointer">Privacy Policy</li>
                      <li className="hover:text-[#AE5633] cursor-pointer">Contact Us</li>
                   </ul>
                </div>
                <div>
                    <h4 className="font-serif font-bold mb-6 text-[#1D1D1D]">Newsletter</h4>
                    <p className="text-sm text-[#1D1D1D]/50 mb-4">Stay updated with the latest in AI and education.</p>
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 bg-white border border-[#E8E2D6] rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 ring-[#AE5633]/20" 
                            placeholder="Email address" 
                        />
                        <Button size="sm">Subscribe</Button>
                    </div>
                </div>
            </div>
            <div className="pt-8 border-t border-[#E8E2D6] flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-[#1D1D1D]/40">© 2024 LearnFlow AI Inc. All rights reserved.</p>
                <div className="flex gap-8 text-xs text-[#1D1D1D]/40 uppercase tracking-widest font-bold">
                    <span>Designed with ❤️ for Claude</span>
                </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
