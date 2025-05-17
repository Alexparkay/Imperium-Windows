import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  primary?: boolean;
  secondary?: boolean;
  outlined?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  className = '',
  primary = false,
  secondary = false,
  outlined = false,
  disabled = false,
  type = 'button',
  icon,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      return 'bg-[#2A2A2A]/50 text-white/30 cursor-not-allowed';
    }
    
    if (outlined) {
      return 'bg-transparent border border-[#10ba82] text-[#10ba82] hover:bg-[#10ba82]/10';
    }
    
    if (secondary) {
      return 'bg-gradient-to-r from-[#10ba82]/10 to-[#0c9a6c]/20 text-white hover:brightness-125';
    }
    
    if (primary) {
      return 'bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] text-white hover:brightness-110';
    }
    
    return 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getButtonStyle()}
        ${fullWidth ? 'w-full' : ''}
        px-4 py-2
        rounded-lg
        font-medium
        transition-all duration-300
        flex items-center justify-center gap-2
        shadow-md hover:shadow-lg
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default GlassButton; 