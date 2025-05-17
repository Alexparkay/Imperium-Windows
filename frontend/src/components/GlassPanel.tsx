import React, { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  borderAccent?: boolean;
  noPadding?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  borderAccent = false,
  noPadding = false
}) => {
  return (
    <div 
      className={`
        bg-[rgba(26,26,26,0.7)]
        backdrop-blur-md
        border
        ${borderAccent ? 'border-[#10ba82]/20' : 'border-white/10'}
        rounded-xl
        shadow-lg
        shadow-black/20
        ${hoverEffect ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#10ba82]/20' : ''}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassPanel; 