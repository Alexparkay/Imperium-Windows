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
      case 'accent-primary':
        return {
          active: 'from-[#89a3c2]/40 to-[#7a94b8]/30',
          hover: 'from-[#89a3c2]/5 via-[#7a94b8]/3 to-[#7a94b8]/5',
          border: 'border-[#89a3c2]/10',
          text: 'text-[#89a3c2]',
          shadow: 'shadow-[#89a3c2]/10'
        };
      case 'purple':
        return {
          active: 'from-purple-500/40 to-violet-500/30',
          hover: 'from-purple-500/5 via-violet-500/3 to-purple-600/5',
          border: 'border-purple-500/10',
          text: 'text-purple-300/70',
          shadow: 'shadow-purple-500/10'
        };
      default:
        return {
          active: 'from-[#89a3c2]/40 to-[#7a94b8]/30',
          hover: 'from-[#89a3c2]/5 via-[#7a94b8]/3 to-[#7a94b8]/5',
          border: 'border-[#89a3c2]/10',
          text: 'text-[#89a3c2]',
          shadow: 'shadow-[#89a3c2]/10'
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
                            <div className={`absolute -left-4 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-gradient-to-r ${colors.active} rounded-r-full shadow-md`} />
          )}
          
          {/* Icon container */}
          <div className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 ${
            isActive 
              ? `text-white bg-[rgba(26,26,26,0.8)] backdrop-blur-sm shadow-lg ${colors.shadow} border ${colors.border}` 
              : `text-white/70 hover:text-white bg-[rgba(26,26,26,0.4)] hover:bg-[rgba(26,26,26,0.7)] border border-transparent hover:${colors.border}`
          }`}>
            <div className="relative w-full h-full flex items-center justify-center">
              {isActive && (
                <>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#10ba82]/5 rounded-full blur-xl`}></div>
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
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[rgba(26,26,26,0.9)] backdrop-blur-md border border-white/10 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {tooltip || item.label}
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
          <div className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-300 
            bg-[rgba(26,26,26,0.4)] text-white/70 hover:text-white hover:bg-[rgba(26,26,26,0.7)] border border-transparent hover:${colors.border}
          `}>
            <item.icon className="text-2xl" />
          </div>
        </button>
        
        {/* Tooltip */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-[rgba(26,26,26,0.9)] backdrop-blur-md border border-white/10 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {tooltip || item.label}
          </motion.div>
        )}
      </div>
    );
  }
};

export default MenuItem;
