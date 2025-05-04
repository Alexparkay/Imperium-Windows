import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

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
  tooltip?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, isActive, tooltip }) => {
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
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[#0A0A0A] text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {tooltip}
          </motion.div>
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
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[#0A0A0A] text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {tooltip}
          </motion.div>
        )}
      </div>
    );
  }
};

export default MenuItem;
