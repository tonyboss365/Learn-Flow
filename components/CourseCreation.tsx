import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Input, Badge, Modal } from './UIComponents';
import { ViewState, Course } from '../types';
import { generateCourseDescription } from '../services/openRouterService';
import { supabase } from '../utils/supabase';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Plus, 
  Trash2, 
  GripVertical, 
  Sparkles, 
  Upload, 
  Award,
  Image as ImageIcon,
  Video,
  FileText,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface CourseCreationProps {
  onNavigate: (view: ViewState | ViewState['type']) => void;
  onFinish: (course: Course) => void;
}

const CourseCreation: React.FC<CourseCreationProps> = ({ onNavigate, onFinish }) => {
  const [step, setStep] = useState(1);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [sections, setSections] = useState([
    { id: 's1', title: 'Course Foundations', lessons: [{ id: 'l1', title: 'Course Overview', type: 'video' }] }
  ]);
  const [thumbnailFile, setThumbnailFile] = useState<string>('');
  const [videoFile, setVideoFile] = useState<string>('');
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const [priceType, setPriceType] = useState<'Free' | 'Paid' | 'Subscription'>('Paid');
  const [priceVal, setPriceVal] = useState<number>(99.00);

  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 450): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6)); // Compress to 60% quality JPEG
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setThumbnailFile(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local blob URL for instant lag-free browser video playing preview
      const localUrl = URL.createObjectURL(file);
      setVideoFile(localUrl);
    }
  };

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Structure' },
    { num: 3, label: 'Media' },
    { num: 4, label: 'Pricing' },
    { num: 5, label: 'Publish' }
  ];

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), title: 'New Section', lessons: [] }]);
  };

  const handleGenerateDescription = async () => {
    if (!title) return;
    setIsGeneratingDesc(true);
    const generated = await generateCourseDescription(title, category || 'General', level);
    if (generated) {
      setDescription(generated);
    }
    setIsGeneratingDesc(false);
  };

  const addLesson = (sectionId: string) => {
    setSections(sections.map(s => {
        if (s.id === sectionId) {
            return { ...s, lessons: [...s.lessons, { id: Date.now().toString(), title: 'New Lesson', type: 'video' }] };
        }
        return s;
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    // We map to snake_case for the database
    const dbCourse = {
      title: title || 'New Unpublished Course',
      // We will hardcode this instructor name for the demo
      instructor_name: 'Dr. Sarah Chen',
      instructor_avatar: 'https://i.pravatar.cc/150?img=47',
      thumbnail: thumbnailFile || 'linear-gradient(135deg, #AE5633 0%, #3D3929 100%)',
      rating: 0,
      students_count: 0,
      reviews_count: 0,
      duration: '50h 0m',
      lessons_count: sections.reduce((acc, curr) => acc + curr.lessons.length, 0),
      level: level as 'Beginner' | 'Intermediate' | 'Advanced',
      price: priceType === 'Free' ? 0 : priceVal,
      description: description,
      long_description: description,
      category: category || 'General',
      what_you_will_learn: ['Master concepts', 'Build projects'],
      last_updated: new Date().toISOString().split('T')[0],
      is_ai: false,
      curriculum: sections.map((s, sIdx) => ({
        title: s.title,
        lessons: s.lessons.map((l, lIdx) => ({
          id: l.id,
          title: l.title,
          type: l.type as 'video' | 'article',
          duration: '10:00',
          completed: false,
          videoUrl: sIdx === 0 && lIdx === 0 ? (videoFile.startsWith('blob:') ? 'https://vjs.zencdn.net/v/oceans.mp4' : videoFile) : undefined
        }))
      }))
    };

    const { data, error } = await supabase
      .from('courses')
      .insert([dbCourse])
      .select()
      .single();

    if (error || !data) {
      console.error('Error saving course:', error);
      alert('Failed to publish course. Please try again.');
      return;
    }

    const newCourse: Course = {
      id: data.id,
      title: data.title,
      instructor: data.instructor_name,
      instructorAvatar: data.instructor_avatar,
      thumbnail: data.thumbnail,
      rating: Number(data.rating),
      studentsCount: data.students_count,
      reviewsCount: data.reviews_count,
      duration: data.duration,
      lessonsCount: data.lessons_count,
      level: data.level,
      price: data.price === 0 ? 'Free' : Number(data.price),
      description: data.description,
      longDescription: data.long_description,
      category: data.category,
      whatYouWillLearn: data.what_you_will_learn,
      lastUpdated: data.last_updated,
      isAI: data.is_ai,
      curriculum: data.curriculum.map((s: any, sIdx: number) => ({
        ...s,
        lessons: s.lessons.map((l: any, lIdx: number) => ({
          ...l,
          videoUrl: sIdx === 0 && lIdx === 0 && videoFile ? videoFile : l.videoUrl
        }))
      }))
    };
    
    onFinish(newCourse);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-medium mb-8 text-[#1D1D1D]">Create New Course</h1>
        
        {/* Stepper */}
        <div className="flex items-center justify-between relative px-2">
           <div className="absolute top-[21px] left-0 right-0 h-[2px] bg-[#E8E2D6]/30 -z-10"></div>
           {steps.map((s) => (
             <div key={s.num} className="flex flex-col items-center gap-3">
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500
                    ${step > s.num ? 'bg-emerald-500 text-white shadow-xl' : step === s.num ? 'bg-[#3D3929] text-white shadow-lg ring-4 ring-[#AE5633]/10' : 'bg-white border-2 border-[#E8E2D6] text-[#1D1D1D]/30'}
                `}>
                   {step > s.num ? <Check className="w-6 h-6" /> : s.num}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step === s.num ? 'text-[#AE5633]' : 'text-[#1D1D1D]/40'}`}>
                   {s.label}
                </span>
             </div>
           ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="min-h-[500px]"
        >
          {step === 1 && (
            <div className="space-y-8">
               <h2 className="text-2xl font-serif font-medium text-[#1D1D1D]">Fundamental Information</h2>
               <div className="space-y-6">
                  <Input label="Course Title" placeholder="e.g. Mastering Neural Networks" maxLength={60} value={title} onChange={(e) => setTitle(e.target.value)} />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-[#1D1D1D]">Full Description</label>
                    <textarea 
                        className="w-full h-48 px-4 py-3 rounded-[12px] border border-[#E8E2D6] outline-none transition-all duration-200 focus:ring-[3px] focus:ring-[#AE5633]/10 focus:border-[#AE5633] resize-none text-[#1D1D1D]"
                        placeholder="Explain what students will learn in this course..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end p-2">
                        <button onClick={handleGenerateDescription} disabled={isGeneratingDesc || !title} className="flex items-center gap-1.5 text-xs font-bold text-[#AE5633] hover:brightness-90 transition-all uppercase tracking-widest disabled:opacity-50">
                            <Sparkles className={`w-3 h-3 ${isGeneratingDesc ? 'animate-spin' : ''}`} />
                            {isGeneratingDesc ? 'Generating...' : 'Help me improve with AI'}
                        </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <Input label="Category" placeholder="e.g. AI / ML" value={category} onChange={(e) => setCategory(e.target.value)} />
                     <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-[#1D1D1D]">Level</label>
                        <div className="flex items-center gap-2">
                           {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                             <button key={l} onClick={() => setLevel(l)} className={`flex-1 px-4 py-2 bg-white border ${level === l ? 'border-[#AE5633] text-[#AE5633]' : 'border-[#E8E2D6] text-[#1D1D1D] hover:border-[#AE5633] hover:text-[#AE5633]'} rounded-xl text-xs font-bold transition-all`}>{l}</button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif font-medium text-[#1D1D1D]">Curriculum Structure</h2>
                  <Button variant="secondary" size="sm" icon={Plus} onClick={addSection}>Add Section</Button>
               </div>
               
               <div className="space-y-6">
                  {sections.map((section, idx) => (
                    <Card key={section.id} className="p-6 overflow-hidden">
                       <div className="flex items-center gap-4 mb-6">
                          <GripVertical className="w-5 h-5 text-[#1D1D1D]/20 cursor-move" />
                          <input 
                            className="text-xl font-serif font-medium bg-transparent border-none outline-none focus:text-[#AE5633] transition-all text-[#1D1D1D]"
                            defaultValue={section.title}
                          />
                          <button className="ml-auto text-rose-500 hover:text-rose-600 transition-all">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       
                       <div className="space-y-3 pl-8">
                          {section.lessons.map((lesson) => (
                            <div key={lesson.id} className="p-4 bg-[#F9F7F2]/50 rounded-xl border border-[#E8E2D6]/30 flex items-center justify-between group">
                               <div className="flex items-center gap-3">
                                  {lesson.type === 'video' ? <Video className="w-4 h-4 text-[#AE5633]" /> : <FileText className="w-4 h-4 text-emerald-500" />}
                                  <input 
                                    className="text-sm font-medium bg-transparent border-none outline-none focus:text-[#AE5633] transition-all text-[#1D1D1D]/80"
                                    defaultValue={lesson.title}
                                  />
                               </div>
                               <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-widest"><Clock className="w-3 h-3" /> 10:00</div>
                                  <button className="text-rose-500"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => addLesson(section.id)}
                            className="w-full py-3 border-2 border-dashed border-[#E8E2D6] rounded-xl text-xs font-bold text-[#1D1D1D]/40 hover:bg-[#F9F7F2]/50 hover:border-[#AE5633]/30 transition-all flex items-center justify-center gap-2"
                          >
                             <Plus className="w-4 h-4" /> Add Lesson
                          </button>
                       </div>
                    </Card>
                  ))}
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10">
               <h2 className="text-2xl font-serif font-medium text-[#1D1D1D]">Visual Identity</h2>
               
               <input 
                 type="file" 
                 ref={thumbnailInputRef} 
                 onChange={handleImageUpload} 
                 accept="image/*" 
                 className="hidden" 
               />
               <input 
                 type="file" 
                 ref={videoInputRef} 
                 onChange={handleVideoUpload} 
                 accept="video/*" 
                 className="hidden" 
               />

               <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <p className="text-sm font-bold text-[#1D1D1D]">Course Thumbnail</p>
                     <div 
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="aspect-video rounded-3xl border-2 border-dashed border-[#E8E2D6] bg-[#F9F7F2]/30 flex flex-col items-center justify-center overflow-hidden text-center hover:border-[#AE5633]/30 transition-all group cursor-pointer"
                     >
                        {thumbnailFile ? (
                          <img src={thumbnailFile} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="p-8">
                             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-4 mx-auto group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-[#1D1D1D]/40" />
                             </div>
                             <p className="text-sm font-bold mb-1 text-[#1D1D1D]">Upload Photo</p>
                             <p className="text-xs text-[#1D1D1D]/40">16:9 ratio. High resolution suggested (2560x1440)</p>
                          </div>
                        )}
                     </div>
                     <Button 
                        variant="ai" 
                        className="w-full gap-2" 
                        icon={Sparkles} 
                        onClick={() => setIsGeneratingThumbnail(true)}
                     >
                        Generate with LearnFlow AI
                     </Button>
                  </div>
                  
                  <div className="space-y-6">
                     <p className="text-sm font-bold text-[#1D1D1D]">Intro Video</p>
                     <div 
                        onClick={() => videoInputRef.current?.click()}
                        className="aspect-video rounded-3xl border-2 border-dashed border-[#E8E2D6] bg-[#F9F7F2]/30 flex flex-col items-center justify-center overflow-hidden text-center hover:border-emerald-500/30 transition-all group cursor-pointer"
                     >
                        {videoFile ? (
                          <video src={videoFile} controls onClick={(e) => e.stopPropagation()} className="w-full h-full object-cover" />
                        ) : (
                          <div className="p-8">
                             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-4 mx-auto group-hover:scale-110 transition-transform">
                                <Video className="w-6 h-6 text-[#1D1D1D]/40" />
                             </div>
                             <p className="text-sm font-bold mb-1 text-[#1D1D1D]">Upload Intro Trailer</p>
                             <p className="text-xs text-[#1D1D1D]/40">Help students decide to enroll.</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10">
               <h2 className="text-2xl font-serif font-medium text-[#1D1D1D]">Pricing & Revenue</h2>
               
               <div className="grid md:grid-cols-3 gap-6">
                  {['Free', 'Paid', 'Subscription'].map(pType => (
                    <Card 
                       key={pType} 
                       onClick={() => {
                         setPriceType(pType as any);
                         if (pType === 'Free') {
                           setPriceVal(0);
                         } else if (pType === 'Paid' && priceVal === 0) {
                           setPriceVal(99.00);
                         }
                       }}
                       className={`p-6 cursor-pointer border-2 transition-all ${priceType === pType ? 'border-[#AE5633] bg-[#AE5633]/5' : 'border-transparent'}`}
                    >
                       <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${priceType === pType ? 'bg-[#AE5633] text-white' : 'bg-[#F9F7F2]'}`}>
                          {pType === 'Free' ? <Check className="w-5 h-5 text-emerald-500" /> : pType === 'Paid' ? <Award className="w-5 h-5" /> : <Clock className="w-5 h-5 text-[#AE5633]" />}
                       </div>
                       <h3 className="font-bold mb-2 text-[#1D1D1D]">{pType}</h3>
                       <p className="text-xs text-[#1D1D1D]/50">
                         {pType === 'Free' ? 'Make the course open and accessible to all students.' : pType === 'Paid' ? 'The most popular choice for long-form masterclasses.' : 'Create ongoing recurring subscription revenue.'}
                       </p>
                    </Card>
                  ))}
               </div>

               <div className="max-w-md space-y-6">
                  {priceType !== 'Free' && (
                     <Input 
                        label={priceType === 'Subscription' ? "Set Monthly Fee ($ USD)" : "Set Price ($ USD)"} 
                        placeholder="99.00" 
                        type="number" 
                        value={priceVal}
                        onChange={(e) => setPriceVal(Math.max(0, Number(e.target.value)))}
                     />
                  )}
                  
                  <Card className="p-6 bg-[#F9F7F2] border-[#E8E2D6]/40">
                     <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-[#AE5633] uppercase tracking-widest">Revenue Split</p>
                        <Badge variant="status">Standard Tier</Badge>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-[#1D1D1D]/60">Instructor Share (70%)</span>
                           <span className="font-bold text-[#AE5633]">${(priceVal * 0.7).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-[#1D1D1D]/60">Platform Fee (30%)</span>
                           <span className="font-bold text-[#AE5633]">${(priceVal * 0.3).toFixed(2)}</span>
                        </div>
                        <div className="h-[1px] bg-[#E8E2D6]/40 my-2"></div>
                        <div className="flex justify-between items-center text-lg font-bold text-[#1D1D1D]">
                           <span>Total Received</span>
                           <span className="text-[#AE5633] font-serif">${(priceVal * 0.7).toFixed(2)}</span>
                        </div>
                     </div>
                  </Card>
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-12">
               <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                     <Check className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-serif font-medium mb-4 text-[#1D1D1D]">You're All Set!</h2>
                  <p className="text-lg text-[#1D1D1D]/60 max-w-lg mx-auto leading-relaxed">Review your details and publish your course. Our review team will verify the content within 24-48 hours.</p>
               </div>

               <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-[#1D1D1D]/40 uppercase tracking-[0.2em]">Validation Checklist</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                     {[
                        'Course Title & Description',
                        'Curriculum Structure (5+ Lessons)',
                        'Visual Brand Assets',
                        'Intro Trailer Uploaded',
                        'Pricing Tier Selected',
                        'Identity Verified'
                     ].map((check, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white border border-emerald-50 rounded-2xl shadow-sm">
                           <div className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center p-1"><Check className="w-4 h-4" /></div>
                           <span className="text-sm font-bold text-[#1D1D1D]/70">{check}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="p-8 bg-[#3D3929] text-white rounded-[24px] flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-xl mb-1">Estimated Review Time</h4>
                    <p className="text-sm text-emerald-400">Expected to be live by Wednesday, May 20th.</p>
                  </div>
                  <Button variant="ghost" icon={ChevronRight} className="text-white hover:text-white/80">View Policies</Button>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 pt-8 border-t border-[#E8E2D6]/30 flex justify-between items-center">
         <Button variant="ghost" icon={ChevronLeft} onClick={prevStep} disabled={step === 1}>Back</Button>
         <div className="flex gap-4">
            <Button variant="secondary" onClick={() => onNavigate('instructor-dashboard')}>Save as Draft</Button>
            {step === 5 ? (
               <Button size="lg" onClick={handleFinish} variant="primary">Submit for Review</Button>
            ) : (
               <Button size="lg" onClick={nextStep} icon={ChevronRight} variant="primary">Continue</Button>
            )}
         </div>
      </div>

      {/* AI Thumbnail Generator Modal */}
      <Modal 
        isOpen={isGeneratingThumbnail} 
        onClose={() => setIsGeneratingThumbnail(false)}
        title="AI Thumbnail Generator"
      >
        <div className="space-y-6">
           <div className="space-y-1.5">
              <label className="text-sm font-bold text-[#1D1D1D]/60 uppercase tracking-widest">Design Style</label>
              <div className="flex gap-2">
                 {['Minimal', 'Futuristic', 'Warm', 'Abstract'].map(s => (
                   <button key={s} className="px-3 py-1.5 rounded-lg border border-[#E8E2D6] text-xs font-bold hover:bg-[#AE5633] hover:text-white transition-all text-[#1D1D1D]">{s}</button>
                 ))}
              </div>
           </div>
           <Input label="Prompt Keywords" placeholder="Neural networks, nodes, glowing silk lines..." />
           <Button variant="ai" className="w-full" onClick={() => setIsGeneratingThumbnail(false)}>Generate variations</Button>
           <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-video bg-[#F9F7F2] rounded-xl border border-[#E8E2D6]/30 flex flex-col items-center justify-center p-4 hover:border-[#AE5633] transition-all cursor-pointer group">
                  <ImageIcon className="w-8 h-8 text-[#AE5633]/40 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-[#1D1D1D]/20 uppercase tracking-widest">Variation {i}</span>
                </div>
              ))}
           </div>
        </div>
      </Modal>
    </div>

  );
};

export default CourseCreation;
