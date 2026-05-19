import React from 'react';
import { Card, Button, Badge } from './UIComponents';
import { ViewState } from '../types';
import { CheckCircle2, Clock, Trophy, Award } from 'lucide-react';
import { MOCK_QUIZ } from '../constants';

interface QuizResultsProps {
  onNavigate: (view: ViewState | ViewState['type']) => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <Badge variant="emerald">Assessments</Badge>
           <h1 className="text-4xl font-serif font-medium mt-3 mb-2 text-[#1D1D1D]">My Quizzes</h1>
           <p className="text-[#1D1D1D]/50">Review your past performance and retake quizzes.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <Card className="p-6">
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="font-serif font-medium text-lg text-[#1D1D1D]">{MOCK_QUIZ.title}</h3>
                        <p className="text-sm text-[#1D1D1D]/50 mt-1">Course: Advanced Neural Networks</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-bold text-[#1D1D1D]">92%</p>
                     <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Passed</p>
                  </div>
               </div>
               <div className="mt-6 pt-6 border-t border-[#E8E2D6]/40 flex gap-4">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate({ type: 'quiz', quiz: MOCK_QUIZ })}>Retake Quiz</Button>
               </div>
           </Card>
        </div>
        
        <div className="space-y-6">
           <Card className="p-6 bg-[#3D3929] text-white border-none relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Trophy className="w-24 h-24" />
               </div>
               <h3 className="text-lg font-serif mb-4">Quiz Stats</h3>
               <div className="space-y-4 relative z-10">
                   <div className="flex justify-between items-center">
                       <span className="text-white/60 text-sm">Average Score</span>
                       <span className="font-bold">88%</span>
                   </div>
                   <div className="flex justify-between items-center">
                       <span className="text-white/60 text-sm">Quizzes Taken</span>
                       <span className="font-bold">12</span>
                   </div>
                   <div className="flex justify-between items-center">
                       <span className="text-white/60 text-sm">Certificates Earned</span>
                       <span className="font-bold">4</span>
                   </div>
               </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
