import React from 'react';
import { menu } from './data';
import MenuItem from './MenuItem';
import { Link, useLocation } from 'react-router-dom';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import { FaDatabase } from 'react-icons/fa';
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
      items: workflowItems.slice(0, 2).map(item => ({ ...item, colorScheme: 'accent-primary' }))
    },
    { 
      name: 'energy', 
      items: workflowItems.slice(2, 4).map(item => ({ ...item, colorScheme: 'accent-primary' }))
    },
    { 
      name: 'outreach', 
      items: workflowItems.slice(4, 6).map(item => ({ ...item, colorScheme: 'accent-primary' }))
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
    <aside className="fixed left-0 top-0 h-screen flex flex-col justify-between py-6 px-4 
                     bg-[rgba(26,26,26,0.7)]
                     backdrop-blur-xl
                     border-r border-white/10
                     rounded-r-2xl
                     w-[110px]
                     overflow-visible
                     z-50
                     shadow-lg shadow-black/30">
      {/* Glassmorphic effects */}
      <div className="absolute -top-[30%] -right-[30%] w-[80%] h-[80%] rounded-full bg-accent-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 -left-8 w-24 h-24 rounded-full bg-accent-primary/10 blur-[60px] pointer-events-none"></div>

      {/* Logo */}
      <div className="flex items-center justify-center mb-10 relative">
        <Link to={'/'} className="flex flex-col items-center justify-center">
          <div className="relative bg-gradient-to-br from-[#10ba82] via-[#10ba82] to-[#0c9a6c] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-[#10ba82]/20">
            <FaDatabase className="text-white text-2xl" />
          </div>
        </Link>
      </div>

      {/* Grouped Menu Items */}
      <div className="flex-grow flex flex-col items-center">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-8 last:mb-0 relative">
            {groupIndex > 0 && (
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#10ba82]/20 to-transparent absolute -top-4 left-1/2 transform -translate-x-1/2"></div>
            )}
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
            className="relative cursor-pointer group w-14 h-14 rounded-full bg-background-secondary flex items-center justify-center text-white font-semibold shadow-md shadow-black/20 hover:shadow-lg hover:shadow-[#10ba82]/20 transition-all duration-300 overflow-hidden border border-white/10"
          >
            <img 
              src="/images/SAP/Imperium_logo.png" 
              alt="Imperium Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-[#10ba82]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          
          <ul
            tabIndex={0}
            className="dropdown-content z-[9999] menu p-2 shadow-lg 
                     bg-[rgba(26,26,26,0.85)]
                     backdrop-blur-xl
                     rounded-lg
                     w-48
                     border border-white/10"
            style={{ 
              position: 'fixed', 
              bottom: '7rem', 
              left: '110px',
            }}
          >
            <li>
              <a href="/profile" className="text-white hover:bg-[#10ba82]/10 text-sm py-2 rounded-md">My Profile</a>
            </li>
            <li>
              <a href="/pricing" className="text-white hover:bg-[#10ba82]/10 text-sm py-2 rounded-md">Pricing</a>
            </li>
            <li>
              <div className="flex items-center justify-between hover:bg-[#10ba82]/10 p-2 text-white rounded-md">
                <span className="text-sm">Theme</span>
                <ChangeThemes />
              </div>
            </li>
            <li>
              <button onClick={toggleFullScreen} className="justify-between text-white hover:bg-[#10ba82]/10 text-sm py-2 w-full text-left flex items-center rounded-md">
                <span>Fullscreen</span>
                {isFullScreen ? (
                  <RxExitFullScreen className="text-lg" />
                ) : (
                  <RxEnterFullScreen className="text-lg" />
                )}
              </button>
            </li>
            <li>
              <a href="/login" className="text-white hover:bg-[#10ba82]/10 text-sm py-2 rounded-md">Log Out</a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Menu;
