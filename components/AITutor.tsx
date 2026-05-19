import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Badge } from './UIComponents';
import { ViewState, Course, User as UserType } from '../types';
import { sendChatMessage } from '../services/openRouterService';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  MoreHorizontal, 
  Trash2, 
  MessageCircle,
  Clock,
  ChevronRight,
  Code,
  BookOpen,
  Brain,
  User
} from 'lucide-react';

interface AITutorProps {
  onNavigate: (view: ViewState | ViewState['type']) => void;
  user: UserType;
  courses: Course[];
}

const AITutor: React.FC<AITutorProps> = ({ onNavigate, user, courses }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, time: string }[]>([
    { role: 'ai', text: "Hello! I'm your LearnFlow AI assistant. I can explain complex topics, summarize your lessons, or even quiz you on what you've learned. What's on your mind today?", time: 'Just now' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = { role: 'user' as const, text: inputText, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      let contextStr = '';
      if (selectedCourse) {
        contextStr = `Course Title: ${selectedCourse.title}\nCategory: ${selectedCourse.category}\nLevel: ${selectedCourse.level}\nDescription: ${selectedCourse.description}\nSyllabus:\n${selectedCourse.curriculum.map(s => `- Section: ${s.title}\n  Lessons: ${s.lessons.map(l => l.title).join(', ')}`).join('\n')}`;
      }
      const responseText = await sendChatMessage(history, userMsg.text, contextStr || undefined);
      
      const aiMsg = { 
        role: 'ai' as const, 
        text: responseText, 
        time: 'Just now' 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
       // Error handled gracefully in service which returns a fallback string
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 pb-10">
      
      {/* Search & History Sidebar (Left) */}
      <div className="w-full md:w-80 flex flex-col gap-6 shrink-0 h-full overflow-hidden">
        <h1 className="text-3xl font-serif font-medium text-[#1D1D1D]">AI Tutor</h1>
        
        <div className="relative">
           <div className="absolute inset-0 bg-[#AE5633]/20 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
           <Card className="p-6 relative bg-white border-none shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-[#AE5633] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Brain className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="font-bold text-[#1D1D1D]">Personalized Agent</p>
                    <p className="text-[10px] text-[#1D1D1D]/40 uppercase tracking-widest">Always active</p>
                 </div>
              </div>
              <p className="text-xs text-[#1D1D1D]/60 leading-relaxed">
                Connect your course notes to enable granular concept analysis.
              </p>
              {courses.length > 0 ? (
                <div className="space-y-2 mt-4 text-left">
                   <label className="text-[9px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest block">Active Course Context</label>
                   <select 
                      value={selectedCourse?.id || ''}
                      onChange={(e) => {
                        const course = courses.find(c => c.id === e.target.value);
                        setSelectedCourse(course || null);
                        if (course) {
                          setMessages(prev => [...prev, {
                            role: 'ai',
                            text: `I have connected to your course: "${course.title}". Ask me any questions about the curriculum, lessons, or concepts!`,
                            time: 'Just now'
                          }]);
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-[#F9F7F2] border border-[#E8E2D6] rounded-xl text-xs font-bold text-[#1D1D1D]/80 outline-none focus:border-[#AE5633] transition-all cursor-pointer"
                   >
                      <option value="">No Course Connected</option>
                      {courses.map(c => {
                        const isEnrolled = user.enrolledCourses?.includes(c.id);
                        return (
                          <option key={c.id} value={c.id}>
                            {c.title}{isEnrolled ? ' (Enrolled)' : ''}
                          </option>
                        );
                      })}
                   </select>
                </div>
              ) : (
                <Button size="sm" className="w-full mt-4" variant="secondary" onClick={() => onNavigate('course-catalog')}>
                   Browse Catalog
                </Button>
              )}
           </Card>
        </div>

        <section className="flex-1 overflow-y-auto space-y-2 pr-2 no-scrollbar">
           <h3 className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-[0.2em] mb-4">Conversations</h3>
           {[
             'Explain Vector Embeddings',
             'Figma components vs layers',
             'Calculus recap for DL',
             'Next.js 14 Server Actions'
           ].map((conv, i) => (
             <button 
                key={i} 
                className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                    ${i === 0 ? 'bg-[#AE5633]/5 text-[#AE5633] border border-[#AE5633]/10' : 'text-[#1D1D1D]/60 hover:bg-white'}
                `}
             >
                <MessageCircle className="w-4 h-4 opacity-40 shrink-0" />
                <span className="text-xs font-medium truncate">{conv}</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-20" />
             </button>
           ))}
        </section>

        <Button variant="ghost" className="w-full justify-start text-rose-500 hover:text-rose-600" icon={Trash2}>
           Clear all history
        </Button>
      </div>

      {/* Main Chat Interface (Right) */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-white/70 backdrop-blur-xl border border-white relative">
         <div className="p-4 border-b border-[#F9F7F2] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px] font-bold">LIVE</div>
               <h2 className="text-sm font-bold text-[#1D1D1D] truncate max-w-[200px] sm:max-w-[400px]">
                  {selectedCourse ? `Context: ${selectedCourse.title}` : 'Explain Vector Embeddings'}
               </h2>
            </div>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-[#F9F7F2] rounded-lg transition-all text-[#1D1D1D]/40"><Paperclip className="w-4 h-4" /></button>
               <button className="p-2 hover:bg-[#F9F7F2] rounded-lg transition-all text-[#1D1D1D]/40"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
         </div>

         {/* Chat Area */}
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-[#F9F7F2]/20">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                 <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${
                    msg.role === 'ai' ? 'bg-[#AE5633] text-white border-transparent' : 'bg-white text-[#1D1D1D] border-[#E8E2D6]'
                 }`}>
                    {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                 </div>
                 <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                    <Card className={`p-5 rounded-[24px] ${
                        msg.role === 'ai' ? 'bg-claude-surface rounded-tl-none' : 'bg-claude-accent/5 text-claude-text border-claude-accent/20 rounded-tr-none'
                    }`}>
                       <p className="text-sm leading-relaxed">{msg.text}</p>
                       {msg.role === 'ai' && i === 1 && (
                         <div className="mt-4 p-4 bg-[#3D3929] rounded-xl text-xs font-mono text-white/80 overflow-x-auto">
                            <div className="flex items-center justify-between mb-2 opacity-40">
                               <span>ChainRule.py</span>
                               <Code className="w-3 h-3" />
                            </div>
                            <code className="whitespace-pre">
{`def backward(self, grad_output):
    grad_input = grad_output * self.derivative()
    return grad_input`}
                            </code>
                         </div>
                       )}
                    </Card>
                    <span className="text-[10px] font-bold text-[#1D1D1D]/30 uppercase tracking-widest">{msg.time}</span>
                 </div>
              </motion.div>
            ))}

            {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#AE5633] text-white shrink-0 flex items-center justify-center"><Sparkles className="w-4 h-4 animate-pulse" /></div>
                  <div className="p-5 bg-white rounded-[24px] rounded-tl-none shadow-sm flex gap-1">
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-[#AE5633] rounded-full"></motion.div>
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#AE5633] rounded-full"></motion.div>
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#AE5633] rounded-full"></motion.div>
                  </div>
                </div>
            )}
         </div>

         {/* Input Box */}
         <div className="p-6 bg-white border-t border-[#F9F7F2] shrink-0">
            <div className="flex flex-wrap gap-2 mb-4">
               {["Explain this concept", "Give me practice questions", "Summarize this lesson"].map((chip, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInputText(chip)}
                    className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-[#F9F7F2] rounded-full text-[#1D1D1D]/50 hover:bg-[#AE5633]/10 hover:text-[#AE5633] transition-all border border-transparent hover:border-[#AE5633]/30"
                  >
                     {chip}
                  </button>
               ))}
            </div>
            <div className="relative text-[#1D1D1D]">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  placeholder="Type your message here..."
                  className="w-full p-4 pr-32 bg-[#F9F7F2] border border-[#E8E2D6]/30 rounded-2xl text-sm outline-none focus:border-[#AE5633] transition-all resize-none min-h-[56px] h-[56px] overflow-hidden leading-[38px] font-medium"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                   <Button size="sm" className="rounded-xl h-10 px-4" onClick={handleSend} disabled={!inputText.trim()} variant="primary">
                      Send <Send className="w-4 h-4 ml-2" />
                   </Button>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1D1D1D]/30 uppercase tracking-[0.2em]">
                   <Sparkles className="w-3 h-3" /> AI Powered by DeepSeek
                </div>
                <div className="w-[1px] h-3 bg-[#E8E2D6]/50"></div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1D1D1D]/30 uppercase tracking-[0.2em]">
                   <Clock className="w-3 h-3" /> Average response 2s
                </div>
            </div>
         </div>

      </Card>
    </div>
  );
};

export default AITutor;
