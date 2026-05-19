import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Send, X, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/openRouterService';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: 'Welcome to LearnFlow AI! I am your companion concierge tutor. I am here to help you navigate your courses, explain curriculum concepts, or guide your learning path. How can I help you today?', 
      timestamp: Date.now() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendChatMessage(history, userMsg.text);
      
      const aiMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="bg-white rounded-[24px] shadow-2xl shadow-[#3D3929]/15 w-[90vw] sm:w-[380px] h-[550px] mb-6 flex flex-col overflow-hidden border border-[#E8E2D6] z-50"
          >
            {/* Header */}
            <div className="bg-[#3D3929] text-white p-5 flex justify-between items-center relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-32 h-32 text-white" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#AE5633] flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">LearnFlow AI</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online Tutor
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/60 hover:text-white transition-colors relative z-10 p-1.5 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#F9F7F2]/30 scrollbar-thin" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] px-4 py-3 rounded-[18px] text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#AE5633] text-white rounded-tr-none' 
                        : 'bg-white border border-[#E8E2D6]/65 text-[#1D1D1D]/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                 <div className="flex justify-start">
                   <div className="bg-white border border-[#E8E2D6]/65 px-4 py-3 rounded-[18px] rounded-tl-none flex gap-1 items-center shadow-sm">
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-[#AE5633] rounded-full"></motion.div>
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#AE5633] rounded-full"></motion.div>
                     <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#AE5633] rounded-full"></motion.div>
                   </div>
                 </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#E8E2D6]/40 shrink-0">
              <div className="flex gap-2 relative items-center">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask your companion AI tutor..." 
                  className="flex-1 bg-[#F9F7F2] border border-[#E8E2D6] focus:border-[#AE5633] px-4 py-2.5 text-sm outline-none transition-colors placeholder-[#1D1D1D]/30 text-[#1D1D1D] rounded-full focus:ring-2 focus:ring-[#AE5633]/15"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isThinking}
                  className="bg-[#AE5633] text-white p-2.5 rounded-full hover:bg-[#964a2c] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#AE5633] text-white w-14 h-14 flex items-center justify-center rounded-full shadow-2xl hover:scale-105 active:scale-95 hover:shadow-3xl hover:bg-[#964a2c] transition-all duration-300 z-50 group border border-white/10"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#AE5633]"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default Assistant;