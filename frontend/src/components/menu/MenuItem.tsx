import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';

interface MenuItemProps {
  item: {
    isLink: boolean;
    url?: string;
    icon: IconType;
    label: string;
    onClick?: () => void;
    colorScheme?: string;
  };
  isActive: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getColorScheme = () => {
    switch (item.colorScheme) {
      case 'purple':
        return {
          active: 'from-purple-500/40 to-violet-500/30',
          hover: 'from-purple-500/5 via-violet-500/3 to-purple-600/5',
          border: 'border-purple-500/10',
          text: 'text-purple-300/70',
          shadow: 'shadow-purple-500/10'
        };
      case 'green':
        return {
          active: 'from-green-500/40 to-emerald-500/30',
          hover: 'from-green-500/5 via-emerald-500/3 to-green-600/5',
          border: 'border-green-500/10',
          text: 'text-green-300/70',
          shadow: 'shadow-green-500/10'
        };
      default:
        return {
          active: 'from-green-500/40 to-emerald-500/30',
          hover: 'from-green-500/5 via-emerald-500/3 to-green-600/5',
          border: 'border-green-500/10',
          text: 'text-green-300/70',
          shadow: 'shadow-green-500/10'
        };
    }
  };

  const colors = getColorScheme();
  
  if (item.isLink) {
    return (
      <div 
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <NavLink
          to={item.url || '/'}
          className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isActive
              ? 'text-white'
              : 'text-white/60 hover:text-white/90'
          }`}
        >
          {/* Active state indicator */}
          {isActive && (
            <div className={`absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-r ${colors.active} rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.4)]`} />
          )}
          
          {/* Icon container */}
          <div className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ${
            isActive 
              ? `text-white bg-gradient-to-br ${colors.hover} shadow-inner ${colors.shadow} ${colors.border}` 
              : `text-white/80 hover:text-white hover:bg-gradient-to-br hover:${colors.hover} border border-transparent hover:${colors.border}`
          }`}>
            <div className="relative w-full h-full flex items-center justify-center">
              {isActive && (
                <>
                  <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${colors.active} to-transparent rounded-full blur-lg transform rotate-12`}></div>
                  <div className={`absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-tr ${colors.active} to-transparent rounded-full blur-lg transform -rotate-12`}></div>
                </>
              )}
              {React.createElement(item.icon, { 
                className: `text-2xl relative z-10 ${isActive ? 'text-white' : 'group-hover:text-white'}`
              })}
            </div>
          </div>
        </NavLink>
        
        {/* Tooltip */}
        {isHovered && (
          <div className={`absolute left-[calc(100%+1rem)] top-1/2 -translate-y-1/2 px-3 py-2 bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/60 to-[rgba(40,41,43,0.2)] backdrop-blur-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[120px] z-[9999] shadow-lg shadow-black/20 ${colors.border}`}>
            {/* Enhanced gradient effects for tooltip */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.hover} opacity-30 rounded-lg`}></div>
            <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${colors.active} to-transparent rounded-full blur-xl transform rotate-12`}></div>
            <div className={`absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-tr ${colors.active} to-transparent rounded-full blur-lg transform -rotate-12`}></div>
            
            {/* Arrow */}
            <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-br ${colors.hover} transform rotate-45 border-l border-t ${colors.border}`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <p className="text-white/90 text-sm whitespace-nowrap">{item.label}</p>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={item.onClick}
          className="block relative"
        >
          <div className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 
            text-slate-400 hover:text-white hover:bg-${colors.active}/5 border border-transparent hover:${colors.border}
          `}>
            <item.icon className={`text-2xl hover:${colors.text}`} />
          </div>
        </button>
        
        {/* Tooltip */}
        {isHovered && (
          <div className={`absolute left-16 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/60 to-[rgba(40,41,43,0.4)] text-white text-sm px-3 py-2 rounded-lg z-50 whitespace-nowrap pointer-events-none ${colors.border} shadow-lg backdrop-blur-xl`}>
            {/* Enhanced gradient effects */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.hover} opacity-30 rounded-lg`}></div>
            <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${colors.active} to-transparent rounded-full blur-xl transform rotate-12 opacity-90`}></div>
            <div className={`absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-tr ${colors.active} to-transparent rounded-full blur-lg transform -rotate-12 opacity-80`}></div>
            <span className="relative z-10">{item.label.replace('\n', ' ')}</span>
          </div>
        )}
      </div>
    );
  }
};

export default MenuItem;
