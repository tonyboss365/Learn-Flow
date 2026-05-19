import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, Input, Badge } from './UIComponents';
import { User as UserType, ViewState } from '../types';
import { 
  User as UserIcon, 
  Settings, 
  Bell, 
  Lock, 
  Camera
} from 'lucide-react';

interface SettingsViewProps {
  user: UserType;
  onNavigate: (view: ViewState | ViewState['type']) => void;
  onSave: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onNavigate, onSave }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <header>
        <h1 className="text-4xl font-serif font-medium mb-2 text-[#1D1D1D]">Settings</h1>
        <p className="text-[#1D1D1D]/50">Manage your account preferences and personalized learning experience.</p>
      </header>

      <div className="grid md:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <aside className="md:col-span-1">
           <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm
                    ${activeTab === tab.id ? 'bg-white text-[#AE5633] shadow-sm' : 'text-[#1D1D1D]/50 hover:bg-white hover:text-[#1D1D1D]'}
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
           </nav>
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3">
           <Card className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-6">
                       <div className="relative group">
                          <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-[#F9F7F2]" alt="" />
                          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                             <Camera className="w-6 h-6 text-white" />
                          </div>
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-[#1D1D1D]">{user.name}</h3>
                          <p className="text-sm text-[#1D1D1D]/50 font-medium">Joined {user.joinedDate}</p>
                          <div className="mt-2 flex gap-2">
                             <Badge variant="status">{user.role}</Badge>
                             <Badge variant="emerald">Verified Account</Badge>
                          </div>
                       </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                       <Input label="Full Name" defaultValue={user.name} />
                       <Input label="Username" defaultValue="@alexrivera" />
                       <Input label="Email Address" defaultValue={user.email} />
                       <Input label="Website" defaultValue="https://alexrivera.design" />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-[#1D1D1D]">Bio</label>
                       <textarea 
                          className="w-full h-32 p-4 bg-[#F9F7F2]/30 border border-[#E8E2D6] rounded-xl outline-none focus:ring-2 ring-[#AE5633]/10 focus:border-[#AE5633] transition-all resize-none font-medium text-sm text-[#1D1D1D]"
                          defaultValue="Full-stack developer and designer passionate about building minimalist, high-performance interfaces."
                       ></textarea>
                    </div>

                    <div className="pt-6 border-t border-[#F9F7F2] flex justify-end gap-4">
                       <Button variant="secondary">Reset</Button>
                       <Button onClick={onSave} variant="primary">Save Changes</Button>
                    </div>
                  </motion.div>
                )}

                  {activeTab === 'notifications' && (
                  <motion.div 
                    key="notifications"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                  >
                    <h3 className="text-xl font-serif font-medium text-[#1D1D1D]">Notification Preferences</h3>
                    <div className="space-y-6">
                       {[
                         { title: 'Email Notifications', desc: 'Receive important updates via email.' },
                         { title: 'Course Content Updates', desc: 'Know when a course you follow adds new lessons.' },
                         { title: 'Quiz & Certificate Alerts', desc: 'Get notified when you pass a quiz or earn a certificate.' },
                         { title: 'Marketing Messages', desc: 'Occasional news and special offers from LearnFlow.' }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between group">
                            <div className="max-w-md">
                               <p className="font-bold text-sm mb-1 text-[#1D1D1D]">{item.title}</p>
                               <p className="text-xs text-[#1D1D1D]/50">{item.desc}</p>
                            </div>
                            <button className={`w-12 h-6 rounded-full relative transition-all ${i < 3 ? 'bg-emerald-500' : 'bg-[#E8E2D6]'}`}>
                               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${i < 3 ? 'right-1' : 'left-1'}`} />
                            </button>
                         </div>
                       ))}
                    </div>
                    <div className="pt-6 border-t border-[#F9F7F2] flex justify-end">
                       <Button onClick={onSave} variant="primary">Save Preferences</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
