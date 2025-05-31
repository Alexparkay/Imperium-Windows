import React, { useState, useRef, useEffect } from 'react';
import { MdClose, MdMinimize, MdCropFree, MdFullscreen, MdFullscreenExit, MdRefresh, MdOpenInNew } from 'react-icons/md';

interface ExternalSoftwareWindowProps {
  title: string;
  src?: string;
  width?: number;
  height?: number;
  isVisible: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  children?: React.ReactNode;
  allowFullscreen?: boolean;
  refreshable?: boolean;
  localPath?: string;
}

const ExternalSoftwareWindow: React.FC<ExternalSoftwareWindowProps> = ({
  title,
  src,
  width = 1000,
  height = 700,
  isVisible,
  onClose,
  onMinimize,
  children,
  allowFullscreen = true,
  refreshable = true,
  localPath
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [windowSize, setWindowSize] = useState({ width, height });
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const windowRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Determine the source URL
  const getSourceUrl = () => {
    if (localPath) {
      // For local development, use the proxy
      return `/external-maps/`;
    }
    return src || 'about:blank';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isFullscreen) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - windowSize.width, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
        });
      }
      
      if (isResizing && !isFullscreen) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
          setWindowSize({
            width: Math.max(400, Math.min(window.innerWidth - position.x, e.clientX - rect.left)),
            height: Math.max(300, Math.min(window.innerHeight - position.y, e.clientY - rect.top))
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, isFullscreen, position, windowSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen) return;
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isFullscreen) {
      setIsResizing(true);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) {
      onMinimize();
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setIsLoading(true);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const openInNewTab = () => {
    window.open('/external-maps/', '_blank');
  };

  if (!isVisible) return null;

  const windowStyle = isFullscreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }
    : {
        position: 'fixed' as const,
        left: position.x,
        top: position.y,
        width: windowSize.width,
        height: isMinimized ? 'auto' : windowSize.height,
        zIndex: 1000
      };

  return (
    <div
      ref={windowRef}
      className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/95 via-[#28292b]/90 to-[rgba(40,41,43,0.8)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-blue-500/20 overflow-hidden"
      style={windowStyle}
    >
      {/* Window Header */}
      <div
        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600/20 to-blue-500/10 border-b border-blue-500/20 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors" onClick={onClose}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer transition-colors" onClick={handleMinimize}></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer transition-colors" onClick={toggleFullscreen}></div>
          </div>
          <h3 className="text-white font-medium text-sm">{title}</h3>
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-400 text-xs">
              <div className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              Loading...
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={openInNewTab}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Open in New Tab"
          >
            <MdOpenInNew className="text-white/70 hover:text-white text-sm" />
          </button>
          
          {refreshable && (
            <button
              onClick={handleRefresh}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <MdRefresh className="text-white/70 hover:text-white text-sm" />
            </button>
          )}
          
          <button
            onClick={handleMinimize}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Minimize"
          >
            <MdMinimize className="text-white/70 hover:text-white text-sm" />
          </button>
          
          {allowFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <MdFullscreenExit className="text-white/70 hover:text-white text-sm" />
              ) : (
                <MdFullscreen className="text-white/70 hover:text-white text-sm" />
              )}
            </button>
          )}
          
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-500/20 transition-colors"
            title="Close"
          >
            <MdClose className="text-white/70 hover:text-red-400 text-sm" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      {!isMinimized && (
        <div className="relative w-full h-full">
          {src || localPath ? (
            <iframe
              key={refreshKey}
              ref={iframeRef}
              src={getSourceUrl()}
              className="w-full h-full border-none bg-white"
              title={title}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
              loading="lazy"
              onLoad={handleIframeLoad}
              style={{ 
                height: isFullscreen ? '100vh' : `${windowSize.height - 60}px`,
                minHeight: '300px'
              }}
            />
          ) : (
            <div className="w-full h-full p-4 overflow-auto">
              {children}
            </div>
          )}
          
          {/* Resize Handle */}
          {!isFullscreen && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
              onMouseDown={handleResizeMouseDown}
            >
              <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-white/50"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExternalSoftwareWindow; 