import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Sparkles, Loader2, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none rounded-[10px]";
  
  const variants = {
    primary: "bg-[#AE5633] text-white shadow-sm hover:bg-[#964a2c]",
    secondary: "bg-white border border-[#E8E2D6] text-[#1D1D1D] hover:bg-[#F9F7F2]",
    ghost: "bg-transparent text-[#1D1D1D] hover:underline",
    danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
    ai: "bg-[#3D3929] text-white shadow-sm hover:bg-[#2D2A1E]"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : Icon && (
        <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />
      )}
      {children}
      {variant === 'ai' && !loading && (
        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-white animate-pulse" />
      )}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, glass?: boolean, elevate?: boolean, onClick?: () => void }> = ({ 
    children, 
    className = '', 
    glass = false,
    elevate = false,
    onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        rounded-[14px] 
        ${glass ? 'bg-white/70 backdrop-blur-[20px] border border-white/20' : (!className.includes('bg-') ? 'bg-white border border-[#E8E2D6]' : 'border border-[#E8E2D6]')}
        ${elevate ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, variant?: 'default' | 'status' | 'new' | 'ai' | 'emerald' | 'amber' | 'rose' }> = ({ 
    children, 
    variant = 'default' 
}) => {
  const styles = {
    default: "bg-[#F9F7F2] text-[#1D1D1D]",
    status: "bg-[#AE5633]/10 text-[#AE5633]",
    new: "bg-[#AE5633] text-white",
    ai: "bg-[#3D3929] text-white",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {variant === 'ai' && <Sparkles className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }> = ({ 
    label, 
    error, 
    className = '', 
    ...props 
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-[#1D1D1D]">{label}</label>}
      <input 
        className={`
          w-full h-[42px] px-4 rounded-[12px] border bg-white outline-none transition-all duration-200
          focus:ring-[3px] focus:ring-[#AE5633]/10 focus:border-[#AE5633]
          ${error ? 'border-rose-500 bg-rose-50' : 'border-[#E8E2D6]'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-rose-500 font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export const Modal: React.FC<{ isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }> = ({ 
    isOpen, 
    onClose, 
    title, 
    children 
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1D]/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[20px] shadow-2xl w-full max-w-lg overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-[#F9F7F2] flex items-center justify-between">
                    <h3 className="text-xl font-serif font-medium">{title}</h3>
                    <button onClick={onClose} className="text-[#1D1D1D]/50 hover:text-[#1D1D1D]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export const Toast: React.FC<{ type: 'success' | 'error' | 'info' | 'warning', message: string, onClose: () => void }> = ({ 
    type, 
    message, 
    onClose 
}) => {
    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500" />,
        info: <Info className="w-5 h-5 text-[#AE5633]" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-[#F9F7F2] space-x-3 min-w-[300px]"
        >
            {icons[type]}
            <p className="flex-1 text-sm font-medium text-[#1D1D1D]">{message}</p>
            <button onClick={onClose} className="text-[#1D1D1D]/30 hover:text-[#1D1D1D]/60">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </motion.div>
    );
};
