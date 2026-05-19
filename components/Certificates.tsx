import React from 'react';
import { motion } from 'motion/react';
import { Card, Button, Badge, Input } from './UIComponents';
import { ViewState } from '../types';
import { MOCK_CERTIFICATES } from '../constants';
import { 
  Download, 
  Share2, 
  ExternalLink, 
  Award, 
  CheckCircle2, 
  Sparkles,
  Search,
  BookOpen
} from 'lucide-react';

interface CertificatesProps {
  onNavigate: (view: ViewState | ViewState['type']) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="text-[#1D1D1D]">
           <Badge variant="status">Achievements</Badge>
           <h1 className="text-4xl font-serif font-medium mt-3 mb-2">Verified Skillset</h1>
           <p className="text-[#1D1D1D]/50">Every certificate is blockchain-verified and recognized globally.</p>
        </div>
        <Button variant="secondary" icon={ExternalLink}>LinkedIn Verification</Button>
      </header>

      {MOCK_CERTIFICATES.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
           {MOCK_CERTIFICATES.map((cert) => (
             <motion.div
                key={cert.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
             >
                <Card className="overflow-hidden flex flex-col items-center group border-[#E8E2D6]/40">
                   {/* Certificate Visual Part */}
                   <div className="w-full aspect-[1.4/1] p-10 bg-white relative overflow-hidden flex flex-col items-center justify-center text-center border-b border-[#F9F7F2]">
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                         <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#AE5633_2px,_transparent_2px)] [background-size:24px_24px]"></div>
                      </div>
                      <div className="w-16 h-16 bg-[#AE5633] rounded-xl flex items-center justify-center text-white mb-6 relative z-10 shadow-xl group-hover:rotate-[360deg] transition-transform duration-700">
                         <Sparkles className="w-8 h-8" />
                      </div>
                      <h4 className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-[0.4em] mb-4 relative z-10">Certificate of Completion</h4>
                      <h2 className="text-3xl font-serif font-medium mb-6 relative z-10 text-[#1D1D1D]">{cert.courseTitle}</h2>
                      <div className="h-[1px] w-32 bg-[#E8E2D6]/30 mb-6 relative z-10"></div>
                      <p className="text-sm font-serif italic text-[#1D1D1D]/50 mb-1 relative z-10">This certifies that</p>
                      <p className="text-xl font-bold mb-8 relative z-10 text-[#1D1D1D]">{cert.studentName}</p>
                      <div className="flex items-center gap-10 relative z-10 text-[#1D1D1D]">
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-[#1D1D1D]/30 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-xs font-bold">{cert.date}</p>
                         </div>
                         <div className="text-center">
                            <p className="text-[10px] font-bold text-[#1D1D1D]/30 uppercase tracking-widest mb-1">Verify</p>
                            <p className="text-xs font-bold">{cert.verificationCode}</p>
                         </div>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-30">
                         <Badge variant="status">LearnFlow Verified</Badge>
                      </div>
                   </div>
                   
                   {/* Actions */}
                   <div className="p-6 w-full flex items-center gap-4 bg-[#F9F7F2]/30">
                      <Button className="flex-1" icon={Download} variant="primary">Download PDF</Button>
                      <Button variant="secondary" className="flex-1" icon={Share2}>Share</Button>
                   </div>
                </Card>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center text-center">
           <div className="w-32 h-32 bg-[#E8E2D6]/20 rounded-full flex items-center justify-center mb-8">
              <Award className="w-16 h-16 text-[#1D1D1D]/10" />
           </div>
           <h2 className="text-3xl font-serif font-medium mb-4 text-[#1D1D1D]">No certificates earned yet</h2>
           <p className="text-[#1D1D1D]/50 max-w-sm mb-10 leading-relaxed">
             Complete courses and pass quizzes to unlock your professional certifications. 
             Every achievement is a step towards your goal.
           </p>
           <Button size="lg" icon={BookOpen} onClick={() => onNavigate('course-catalog')} variant="primary">Explore New Courses</Button>
        </div>
      )}

      {/* Verification Widget */}
      <section className="pt-20">
         <Card className="p-8 border-2 border-dashed border-[#AE5633]/20 bg-[#F9F7F2]/50 rounded-[32px] overflow-hidden relative">
            <div className="absolute -top-12 -right-12 p-8 opacity-10">
               <ShieldCheck className="w-64 h-64 text-[#AE5633]" />
            </div>
            <div className="relative z-10 max-w-lg text-[#1D1D1D]">
               <h3 className="text-2xl font-serif font-medium mb-4">Certificate Verification</h3>
               <p className="text-[#1D1D1D]/60 mb-8">Employing companies can verify LearnFlow certificates using the unique code found on each document.</p>
               <div className="flex gap-4">
                  <Input placeholder="Enter verification code (e.g. LF-XXXX-XXXX)" className="flex-1" />
                  <Button className="shrink-0" icon={Search} variant="primary">Verify</Button>
               </div>
            </div>
         </Card>
      </section>
    </div>
  );
};

// Mock ShieldIcon as it's not in lucide-react (it's ShieldCheck)
const ShieldCheck = ({ className }: { className?: string }) => <Award className={className} />;

export default Certificates;
