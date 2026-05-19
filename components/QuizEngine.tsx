import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Badge } from './UIComponents';
import { Quiz, QuizQuestion } from '../types';
import { 
  X, 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  XCircle,
  Trophy,
  RotateCcw,
  Layout,
  Flag,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizEngineProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ quiz, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'taking' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);
  const [isAnswered, setIsAnswered] = useState(false);
  const [flags, setFlags] = useState<boolean[]>(new Array(quiz.questions.length).fill(false));

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Reset isAnswered when question changes
  useEffect(() => {
    setIsAnswered(answers[currentQuestionIndex] !== -1);
  }, [currentQuestionIndex, answers]);

  useEffect(() => {
    let timer: any;
    if (currentStep === 'taking' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && currentStep === 'taking') {
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [currentStep, timeLeft]);

  const startQuiz = () => {
    setCurrentStep('taking');
    setTimeLeft(quiz.timeLimit * 60);
  };

  const handleSelect = (optionIndex: number) => {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const toggleFlag = () => {
    const newFlags = [...flags];
    newFlags[currentQuestionIndex] = !newFlags[currentQuestionIndex];
    setFlags(newFlags);
  };

  const finishQuiz = () => {
    setCurrentStep('results');
    const correctCount = answers.reduce((acc, current, idx) => {
      return current === quiz.questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    
    if (score >= 70) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreResults = () => {
    const correctCount = answers.reduce((acc, current, idx) => {
      return current === quiz.questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);
    return {
      correct: correctCount,
      incorrect: quiz.questions.length - correctCount,
      percent: Math.round((correctCount / quiz.questions.length) * 100)
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F7F2] flex flex-col p-6 sm:p-12 overflow-hidden">
      
      {/* Quiz Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-white border border-[#E8E2D6] rounded-xl flex items-center justify-center text-[#AE5633] shadow-sm">
              <HelpCircle className="w-6 h-6" />
           </div>
           <div>
              <h1 className="text-xl font-serif font-bold truncate max-w-[200px] sm:max-w-md text-[#1D1D1D]">{quiz.title}</h1>
              <p className="text-xs font-bold text-[#1D1D1D]/40 uppercase tracking-widest">{quiz.id}</p>
           </div>
        </div>
        <button onClick={onBack} className="p-2 border border-[#E8E2D6] rounded-xl hover:bg-white transition-all text-[#1D1D1D]/40">
           <X className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div 
               key="intro"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="flex-1 flex flex-col items-center justify-center text-center py-12"
            >
               <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 relative">
                   <HelpCircle className="w-16 h-16 text-[#AE5633]" />
                   <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 border-4 border-dashed border-[#AE5633]/20 rounded-full"
                   />
               </div>
               <h2 className="text-4xl font-serif font-medium mb-4 text-[#1D1D1D]">{quiz.title}</h2>
               <p className="max-w-lg text-[#1D1D1D]/60 text-lg mb-10 leading-relaxed">{quiz.description}</p>
               
               <div className="grid grid-cols-2 gap-6 mb-12 w-full max-w-md">
                 <Card className="p-6">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-[#AE5633]" />
                    <p className="text-sm font-bold text-[#1D1D1D]">{quiz.timeLimit} Minutes</p>
                    <p className="text-xs opacity-40 uppercase font-bold mt-1 tracking-widest">Time Limit</p>
                 </Card>
                 <Card className="p-6">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-[#AE5633]" />
                    <p className="text-sm font-bold text-[#1D1D1D]">{quiz.questions.length} Questions</p>
                    <p className="text-xs opacity-40 uppercase font-bold mt-1 tracking-widest">To Answer</p>
                 </Card>
               </div>

               <div className="space-y-4 w-full max-w-sm">
                  <Button size="lg" className="w-full" onClick={startQuiz} variant="primary">Start Quiz</Button>
                  <p className="text-xs text-[#1D1D1D]/40 font-medium italic">You need a score of 70% or higher to pass this module.</p>
               </div>
            </motion.div>
          )}

          {currentStep === 'taking' && (
            <motion.div 
               key="taking"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex-1 flex flex-col"
            >
               {/* Progress bar and Timer */}
               <div className="flex items-center gap-6 mb-10 text-[#1D1D1D]">
                  <div className="flex-1 flex items-center gap-4">
                     <span className="text-xs font-bold text-[#1D1D1D]/40 uppercase tracking-widest text-[#1D1D1D]">Question {currentQuestionIndex + 1}/{quiz.questions.length}</span>
                     <div className="flex-1 h-2 bg-[#E8E2D6]/30 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#AE5633]"
                          animate={{ width: `${progress}%` }}
                        />
                     </div>
                  </div>
                  <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-mono font-bold
                    ${timeLeft < 60 ? 'bg-rose-50 border-rose-200 text-rose-500 animate-pulse' : 'bg-white border-[#E8E2D6]/50 text-[#1D1D1D]/60'}
                  `}>
                     <Clock className="w-4 h-4" />
                     {formatTime(timeLeft)}
                  </div>
               </div>

               <div className="grid lg:grid-cols-4 gap-10 flex-1 overflow-hidden">
                  <div className="lg:col-span-3 overflow-y-auto pr-4 pb-8 no-scrollbar">
                     <h3 className="text-3xl font-serif font-medium leading-tight mb-12 text-[#1D1D1D]">{currentQuestion.text}</h3>
                     
                     <div className="space-y-4">
                         {currentQuestion.options.map((option, i) => {
                            const isSelected = answers[currentQuestionIndex] === i;
                            const isCorrect = i === currentQuestion.correctAnswer;
                            const showFeedback = isAnswered;
                            const labels = ['A', 'B', 'C', 'D'];
                            
                            let buttonStyle = 'bg-white border-[#E8E2D6]/30 hover:border-[#AE5633]/30';
                            if (showFeedback) {
                              if (isCorrect) buttonStyle = 'bg-emerald-50 border-emerald-500 shadow-sm';
                              else if (isSelected && !isCorrect) buttonStyle = 'bg-rose-50 border-rose-500 shadow-sm';
                              else buttonStyle = 'bg-white border-[#E8E2D6]/30 opacity-70';
                            } else if (isSelected) {
                              buttonStyle = 'bg-[#AE5633]/5 border-[#AE5633] shadow-md';
                            }

                            return (
                              <button
                                key={i}
                                onClick={() => handleSelect(i)}
                                disabled={isAnswered}
                                className={`
                                  w-full flex items-center p-6 rounded-2xl border-2 text-left transition-all group
                                  ${buttonStyle}
                                `}
                              >
                                 <div className={`
                                   w-10 h-10 rounded-xl flex items-center justify-center font-bold mr-6 transition-all
                                   ${isSelected && !showFeedback ? 'bg-[#AE5633] text-white' : 
                                     showFeedback && isCorrect ? 'bg-emerald-500 text-white' :
                                     showFeedback && isSelected && !isCorrect ? 'bg-rose-500 text-white' :
                                     'bg-[#F9F7F2] text-[#1D1D1D]/40 group-hover:bg-[#AE5633]/10 group-hover:text-[#AE5633]'}
                                 `}>
                                    {labels[i]}
                                 </div>
                                 <span className={`text-lg font-medium ${isSelected ? 'text-[#1D1D1D]' : 'text-[#1D1D1D]/70'}`}>{option}</span>
                                 {showFeedback && isCorrect && (
                                   <CheckCircle2 className="ml-auto w-6 h-6 text-emerald-500" />
                                 )}
                                 {showFeedback && isSelected && !isCorrect && (
                                   <XCircle className="ml-auto w-6 h-6 text-rose-500" />
                                 )}
                              </button>
                            );
                         })}
                      </div>

                      {/* Explanation */}
                      {isAnswered && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6 p-6 rounded-2xl bg-[#AE5633]/5 border border-[#AE5633]/20 flex gap-4"
                        >
                           <Sparkles className="w-6 h-6 text-[#AE5633] shrink-0" />
                           <div>
                              <p className="text-sm font-bold text-[#AE5633] mb-1">AI Explanation</p>
                              <p className="text-[#1D1D1D]/80 leading-relaxed">{currentQuestion.explanation}</p>
                           </div>
                        </motion.div>
                      )}
                  </div>

                  <div className="hidden lg:block space-y-8">
                     <div className="p-6 bg-white rounded-2xl border border-[#E8E2D6]/40">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/40 mb-4">Question Navigator</h4>
                        <div className="grid grid-cols-5 gap-2">
                           {quiz.questions.map((_, i) => (
                             <button
                               key={i}
                               onClick={() => setCurrentQuestionIndex(i)}
                               className={`
                                 w-full aspect-square rounded-lg text-xs font-bold transition-all relative
                                 ${currentQuestionIndex === i ? 'ring-2 ring-[#AE5633] ring-offset-2' : ''}
                                 ${answers[i] !== -1 ? 'bg-[#AE5633] text-white' : 'bg-[#F9F7F2] text-[#1D1D1D]/40 hover:bg-[#E8E2D6]/40'}
                               `}
                             >
                                {i + 1}
                                {flags[i] && <Flag className="w-2.5 h-2.5 text-rose-500 absolute -top-1 -right-1 fill-current" />}
                             </button>
                           ))}
                        </div>
                     </div>
                     <Button variant="secondary" className="w-full" icon={Flag} onClick={toggleFlag}>
                        {flags[currentQuestionIndex] ? 'Unflag Question' : 'Flag Question'}
                     </Button>
                  </div>
               </div>

               {/* Footer Nav */}
               <div className="pt-8 border-t border-[#E8E2D6]/40 flex items-center justify-between mt-auto bg-[#F9F7F2] pb-2 shrink-0">
                  <Button 
                    variant="ghost" 
                    icon={ChevronLeft} 
                    disabled={currentQuestionIndex === 0} 
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-4">
                     <Button variant="secondary" onClick={finishQuiz}>Review & Submit</Button>
                     <Button 
                        icon={isLastQuestion ? undefined : ChevronRight} 
                        disabled={answers[currentQuestionIndex] === -1}
                        onClick={nextQuestion}
                        variant="primary"
                     >
                        {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                     </Button>
                  </div>
               </div>
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div 
               key="results"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex-1 flex flex-col items-center justify-center text-center py-12"
            >
               {(() => {
                 const { percent, correct, incorrect } = scoreResults();
                 const passed = percent >= 70;
                 return (
                    <div className="w-full max-w-2xl px-4">
                      <div className="relative mx-auto w-48 h-48 mb-10">
                        <svg className="w-48 h-48 -rotate-90">
                           <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-[#E8E2D6]/30" />
                           <motion.circle 
                             cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                             className={passed ? 'text-emerald-500' : 'text-rose-500'}
                             strokeDasharray={2 * Math.PI * 88}
                             initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                             animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - percent/100) }}
                             transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-5xl font-serif font-bold text-[#1D1D1D]">{percent}%</span>
                           <span className="text-xs font-bold uppercase tracking-widest opacity-40 text-[#1D1D1D]">Score</span>
                        </div>
                      </div>

                      <div className="mb-10 text-[#1D1D1D]">
                         <h2 className="text-4xl font-serif font-medium mb-3">
                            {passed ? 'Congratulations! 🎉' : 'Keep Practicing! 📚'}
                         </h2>
                         <p className="text-lg text-[#1D1D1D]/60">
                            {passed ? "You've successfully mastered this module. Your certificate progress has been updated." : "Don't worry, you can retake the quiz after reviewing the materials."}
                         </p>
                      </div>

                      <div className="grid grid-cols-3 gap-8 w-full max-w-xl mx-auto mb-12">
                         <div className="text-center">
                            <p className="text-2xl font-serif font-bold text-emerald-500">{correct}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/40">Correct</p>
                         </div>
                         <div className="text-center">
                            <p className="text-2xl font-serif font-bold text-rose-500">{incorrect}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/40">Wrong</p>
                         </div>
                         <div className="text-center">
                            <p className="text-2xl font-serif font-bold text-[#AE5633]">{quiz.timeLimit - Math.floor(timeLeft/60)}m</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#1D1D1D]/40">Time Taken</p>
                         </div>
                      </div>

                      <div className="flex gap-4 w-full max-w-sm mx-auto">
                         <Button variant="secondary" className="flex-1" icon={RotateCcw} onClick={() => { setAnswers(new Array(quiz.questions.length).fill(-1)); setCurrentQuestionIndex(0); setTimeLeft(quiz.timeLimit * 60); setCurrentStep('taking'); }}>Retake Quiz</Button>
                         <Button className="flex-1" onClick={() => onComplete(percent)} variant="primary">Finish & Continue</Button>
                      </div>

                      {/* Incorrect Preview */}
                      {!passed && (
                        <div className="mt-12 w-full text-left space-y-4">
                           <h4 className="text-sm font-bold uppercase tracking-widest text-[#1D1D1D]/40">Review Areas for Improvement</h4>
                           {quiz.questions.map((q, i) => {
                             if (answers[i] !== q.correctAnswer) {
                               return (
                                 <Card key={i} className="p-4 border-rose-200 bg-rose-50/30">
                                    <div className="flex items-start gap-3">
                                       <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                       <div className="space-y-2">
                                          <p className="text-sm font-bold text-[#1D1D1D]">{q.text}</p>
                                          <div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg border border-[#AE5633]/10">
                                             <Sparkles className="w-4 h-4 text-[#AE5633]" />
                                             <p className="text-xs text-[#1D1D1D]/70 leading-relaxed font-medium"><span className="font-bold text-[#AE5633]">AI Explanation:</span> {q.explanation}</p>
                                          </div>
                                       </div>
                                    </div>
                                 </Card>
                               );
                             }
                             return null;
                           })}
                        </div>
                      )}
                    </div>
                 );
               })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

  );
};

export default QuizEngine;
