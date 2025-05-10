import React from 'react';
import { menu } from './data';
import MenuItem from './MenuItem';
import { Link, useLocation } from 'react-router-dom';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import { FaDatabase, FaServer, FaCloudUploadAlt } from 'react-icons/fa';
import ChangeThemes from '../ChangesThemes';

// Group the menu items as specified
const groupMenuItems = () => {
  const mainItems = menu.find(item => item.catalog === 'main')?.listItems || [];
  const workflowItems = menu.find(item => item.catalog === 'imperium sap workflow')?.listItems || [];
  
  // Create the groups with color schemes
  const groups = [
    { name: 'main', items: mainItems },
    { 
      name: 'facilities', 
      items: workflowItems.slice(0, 2).map(item => ({ ...item, colorScheme: 'green' }))
    },
    { 
      name: 'energy', 
      items: workflowItems.slice(2, 4).map(item => ({ ...item, colorScheme: 'green' }))
    },
    { 
      name: 'outreach', 
      items: workflowItems.slice(4, 6).map(item => ({ ...item, colorScheme: 'green' }))
    }
  ];
  
  return groups;
};

const Menu: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const element = document.getElementById('root');
  const location = useLocation();
  const menuGroups = groupMenuItems();

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  React.useEffect(() => {
    // Check if the document is already in fullscreen mode
    const isDocumentFullScreen = !!document.fullscreenElement;
    
    if (isFullScreen && !isDocumentFullScreen) {
      // Enter fullscreen
      try {
        if (element && element.requestFullscreen) {
          element.requestFullscreen({ navigationUI: 'auto' }).catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        }
      } catch (error) {
        console.error("Error entering fullscreen:", error);
      }
    } else if (!isFullScreen && isDocumentFullScreen) {
      // Exit fullscreen
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(err => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`);
          });
        }
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    }
  }, [element, isFullScreen]);

  return (
    <div className="fixed left-0 top-0 h-screen flex flex-col justify-between py-6 px-4 bg-gradient-to-b from-[#28292b]/90 via-[#28292b]/60 to-[rgba(40,41,43,0.2)] backdrop-blur-xl rounded-r-2xl w-[110px] overflow-visible z-50 shadow-[0_0_25px_rgba(0,0,0,0.3)] border-r border-emerald-500/20">
      {/* Enhanced green gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-emerald-600/20 opacity-30"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-emerald-500/60 to-transparent rounded-full blur-3xl transform rotate-12 opacity-90"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-emerald-600/50 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-80"></div>
      <div className="absolute top-1/3 -right-12 w-32 h-32 bg-gradient-to-bl from-emerald-500/40 to-transparent rounded-full blur-2xl transform rotate-45 opacity-70"></div>
      <div className="absolute bottom-1/4 -left-8 w-40 h-40 bg-gradient-to-tr from-emerald-500/30 to-transparent rounded-full blur-2xl transform -rotate-45 opacity-70"></div>

      {/* Logo */}
      <div className="flex items-center justify-center mb-10 relative">
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-emerald-500/60 via-emerald-500/40 to-transparent rounded-full blur-xl transform rotate-12 pointer-events-none"></div>
        <Link to={'/'} className="flex flex-col items-center justify-center">
          <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-500 to-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <FaDatabase className="text-white text-2xl" />
          </div>
        </Link>
      </div>

      {/* Grouped Menu Items */}
      <div className="flex-grow flex flex-col items-center">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8 last:mb-0 relative">
            {groupIndex > 0 && <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent absolute -top-4 left-1/2 transform -translate-x-1/2"></div>}
            <div className="space-y-1.5">
              {group.items.map((item, itemIndex) => (
                <MenuItem 
                  key={`${groupIndex}-${itemIndex}`}
                  item={item}
                  isActive={location.pathname === (item.url || '/')}
                  tooltip={item.label}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div className="mt-auto flex justify-center pt-8">
        <div className="dropdown dropdown-top w-full flex justify-center">
          <div
            tabIndex={0}
            role="button"
            className="relative cursor-pointer group w-14 h-14 rounded-full bg-[#033636] flex items-center justify-center text-white font-semibold shadow-lg shadow-black/30 hover:shadow-black/50 transition-all duration-300 overflow-hidden border border-white/10"
          >
            <img 
              src="/images/SAP/Imperium_logo.png" 
              alt="Imperium Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></div>
          </div>
          
          <ul
            tabIndex={0}
            className="dropdown-content z-[9999] menu p-2 shadow-lg bg-gradient-to-b from-[#28292b]/90 via-[#28292b]/60 to-[rgba(40,41,43,0.2)] backdrop-blur-xl rounded-lg w-48 border border-emerald-500/20"
            style={{ 
              position: 'fixed', 
              bottom: '7rem', 
              left: '110px',
            }}
          >
            {/* Enhanced gradient effect for dropdown */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-emerald-600/20 opacity-30 rounded-lg pointer-events-none"></div>
            <li>
              <a href="/profile" className="text-white hover:bg-white/10 text-sm py-2">My Profile</a>
            </li>
            <li>
              <a href="/pricing" className="text-white hover:bg-white/10 text-sm py-2">Pricing</a>
            </li>
            <li>
              <div className="flex items-center justify-between hover:bg-white/10 p-2 text-white">
                <span className="text-sm">Theme</span>
                <ChangeThemes />
              </div>
            </li>
            <li>
              <button onClick={toggleFullScreen} className="justify-between text-white hover:bg-white/10 text-sm py-2 w-full text-left flex items-center">
                <span>Fullscreen</span>
                {isFullScreen ? (
                  <RxExitFullScreen className="text-lg" />
                ) : (
                  <RxEnterFullScreen className="text-lg" />
                )}
              </button>
            </li>
            <li>
              <a href="/login" className="text-white hover:bg-white/10 text-sm py-2">Log Out</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
