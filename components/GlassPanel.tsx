import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/40 
        backdrop-blur-xl 
        border border-white/50 
        shadow-lg shadow-slate-200/50 
        rounded-2xl 
        ${onClick ? 'cursor-pointer transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl hover:border-white/80' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassPanel;