import React, { ReactNode } from 'react';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface GlassCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: string | number;
    positive?: boolean;
  };
  className?: string;
  footnote?: string;
  loading?: boolean;
  accentColor?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
  footnote,
  loading = false,
  accentColor = 'bg-accent-primary',
  onClick,
}) => {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative 
        bg-[rgba(26,26,26,0.7)] 
        backdrop-blur-md 
        border border-white/10 
        rounded-xl 
        p-5
        overflow-hidden
        transition-all duration-300
        group
        ${onClick ? 'cursor-pointer hover:border-accent-primary/30 hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {/* Accent glow */}
      <div className={`absolute top-0 left-0 w-[5px] h-full ${accentColor} opacity-80`}></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          {icon && (
            <div className={`${accentColor} bg-opacity-20 p-2 rounded-lg text-white`}>
              {icon}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="h-8 w-2/3 bg-white/10 animate-pulse rounded"></div>
        ) : (
          <div className="flex flex-col">
            <span className="text-2xl font-semibold text-text-primary">
              {formattedValue}
            </span>
            
            {change && (
              <div className="flex items-center mt-1">
                <span 
                  className={`
                    flex items-center text-sm
                    ${change.positive ? 'text-accent-primary' : 'text-accent-warning'}
                  `}
                >
                  {change.positive ? <MdTrendingUp className="mr-1" /> : <MdTrendingDown className="mr-1" />}
                  {change.value}
                </span>
              </div>
            )}
          </div>
        )}
        
        {footnote && (
          <p className="mt-3 text-text-muted text-xs">{footnote}</p>
        )}
      </div>
    </div>
  );
};

export default GlassCard; 