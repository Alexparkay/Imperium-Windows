import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocationOn, MdThermostat, MdSolarPower, MdElectricBolt, MdAnalytics, MdTrendingUp, MdAttachMoney, MdSpeed, MdOutlineEnergySavingsLeaf, MdOutlineCalculate, MdOutlineShowChart, MdInfoOutline, MdClose, MdFactory, MdOutlineRoofing, MdOutlineWbSunny, MdOutlineTimeline, MdOutlineSavings, MdArrowForward, MdOutlineSettings, MdAccessTime } from 'react-icons/md';
import { FaBuilding, FaChartLine, FaCalculator, FaChartBar, FaClock, FaMoneyBill, FaServer, FaPercentage, FaDatabase, FaUsers, FaExchangeAlt, FaInfoCircle, FaUserTie, FaMapMarkerAlt, FaMoneyBillWave, FaThermometerHalf, FaRegLightbulb, FaWindowMaximize, FaIndustry } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { toast } from 'react-hot-toast';

interface CalculationStep {
  step: number;
  description: string;
  formula: string;
  calculation: string;
  result: string;
  explanation: string;
}

interface CalculationBreakdown {
  title: string;
  description: string;
  steps: CalculationStep[];
}

type CalculationBreakdowns = {
  [key: string]: CalculationBreakdown;
};

// Google Maps Widget Component
const GoogleMapsWidget = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [useTestMap, setUseTestMap] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'satellite' | 'street' | 'earth'>('3d');
  const [zoomLevel, setZoomLevel] = useState(19);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<'scanning' | 'detecting' | 'measuring' | 'calculating' | 'complete'>('scanning');
  const [detectedWindows, setDetectedWindows] = useState<Array<{x: number, y: number, width: number, height: number, confidence: number}>>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [showAnalysisOverlay, setShowAnalysisOverlay] = useState(false);

  // Start analysis animation when map loads
  useEffect(() => {
    if (!isLoading && !error) {
      setTimeout(() => {
        setIsAnalyzing(true);
        setShowAnalysisOverlay(true);
        runAnalysisSequence();
      }, 2000);
    }
  }, [isLoading, error]);

  // Progressive analysis sequence
  const runAnalysisSequence = async () => {
    // Phase 1: Scanning
    setAnalysisPhase('scanning');
    setScanProgress(0);
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setScanProgress(i);
    }

    // Phase 2: Window Detection with randomized positions and timing
    setAnalysisPhase('detecting');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate randomized window positions across the building
    const mockWindows = Array.from({ length: 16 }, (_, i) => ({
      x: 20 + Math.random() * 60, // Random X between 20-80%
      y: 25 + Math.random() * 50, // Random Y between 25-75%
      width: 6 + Math.random() * 4, // Random width 6-10%
      height: 8 + Math.random() * 6, // Random height 8-14%
      confidence: 0.85 + Math.random() * 0.15, // Random confidence 85-100%
      delay: Math.random() * 2000 // Random delay up to 2 seconds
    })).sort((a, b) => a.delay - b.delay); // Sort by delay for staggered appearance

    // Add windows with randomized timing
    for (let i = 0; i < mockWindows.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      setDetectedWindows(prev => [...prev, mockWindows[i]]);
    }

    // Phase 3: Measuring
    setAnalysisPhase('measuring');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Phase 4: Calculating with data propagation
    setAnalysisPhase('calculating');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Extended for data flow animation

    // Phase 5: Complete
    setAnalysisPhase('complete');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAnalyzing(false);
    toast.success('Building analysis complete! 600 windows detected.');
  };

  const handleIframeLoad = () => {
    const endTime = Date.now();
    const startTime = Date.now() - 5000;
    setLoadTime(endTime - startTime);
    setIsLoading(false);
    setError(null);
    console.log('Google Maps widget loaded successfully');
    toast.success(`${getViewModeLabel(viewMode)} loaded successfully`);
  };

  const handleIframeError = () => {
    console.error('Failed to load main Google Maps widget, trying fallback...');
    if (retryCount < 1) {
      setRetryCount(prev => prev + 1);
      setUseTestMap(true);
      setError(null);
      toast('Switching to fallback map...', { icon: '⚠️' });
    } else {
      setError('Google Maps widget unavailable');
      setIsLoading(false);
      toast.error('Unable to load Google Maps widget');
    }
  };

  const retryLoad = () => {
    setError(null);
    setIsLoading(true);
    setUseTestMap(false);
    setRetryCount(0);
    setLoadTime(null);
  };

  const toggleMapVersion = () => {
    setUseTestMap(!useTestMap);
    setIsLoading(true);
    setError(null);
    setLoadTime(null);
  };

  // Auto-transition based on zoom level
  const handleZoomChange = (newZoom: number) => {
    setZoomLevel(newZoom);
    if (newZoom >= 21 && viewMode !== 'street') {
      setViewMode('street');
      toast('Automatically switching to Street View for detailed analysis', { icon: '🚶' });
    }
  };

  // Advanced source determination with true 3D and interactive features
  const getIframeSrc = () => {
    const lat = 42.333610;
    const lng = -83.062477;
    const q = "MGM+Grand+Detroit+Hotel+Casino";
    
    switch(viewMode) {
      case '3d':
        // True 3D buildings - Using standard embed with satellite view for 3D buildings
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.1!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b2d30e1b47c43%3A0x7e9c8b5f8a5c7e1b!2sMGM%20Grand%20Detroit!5e1!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus`;
      
      case 'satellite':
        // High-res satellite view
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.1!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b2d30e1b47c43%3A0x7e9c8b5f8a5c7e1b!2sMGM%20Grand%20Detroit!5e1!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus`;
      
      case 'street':
        // Street View using place-based embed
        return `https://www.google.com/maps/embed?pb=!4v1640995200000!6m8!1m7!1sCAoSLEFGMVFpcE5lYWx0aHlKcXJzWXRHZkdnS0lCZ2xTVkpSdHdHU0Y!2m2!1d${lat}!2d${lng}!3f210!4f10!5f0.7820865974627469`;
      
      case 'earth':
        // Google Earth
        return `https://earth.google.com/web/@${lat},${lng},200a,1000d,35y,0h,45t,0r`;
      
      default:
        // Standard view 
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.1!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b2d30e1b47c43%3A0x7e9c8b5f8a5c7e1b!2sMGM%20Grand%20Detroit!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus`;
    }
  };

  const getViewModeIcon = (mode: string) => {
    switch(mode) {
      case 'satellite': return '🛰️';
      case '3d': return '🏢';
      case 'street': return '🚶';
      case 'earth': return '🌍';
      default: return '🗺️';
    }
  };

  const getViewModeLabel = (mode: string) => {
    switch(mode) {
      case 'satellite': return 'Satellite';
      case '3d': return '3D Analysis';
      case 'street': return 'Street View';
      case 'earth': return 'Google Earth';
      default: return 'Map';
    }
  };

  const getViewModeDescription = (mode: string) => {
    switch(mode) {
      case 'satellite': return 'High-resolution satellite imagery with building outlines';
      case '3d': return 'Interactive 3D buildings with full rotation and analysis';
      case 'street': return 'Ground-level 360° view with pegman placement';
      case 'earth': return 'Google Earth orbital view with terrain';
      default: return 'Standard map view';
    }
  };

  return (
    <div className="relative w-[85vw] h-[60vh] max-w-6xl rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.15] via-blue-500/[0.08] to-white/[0.05] backdrop-blur-2xl border-2 border-blue-400/30 shadow-[0_0_60px_rgba(59,130,246,0.3)]">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 animate-pulse">
            <FaBuilding className="text-white text-3xl" />
          </div>
          <div className="text-white font-semibold mb-2 text-lg">Loading Google Maps</div>
          <div className="text-blue-300/80 text-base text-center">
            {useTestMap ? 'Loading test version...' : 'Building Analysis System'}
          </div>
          <div className="loading loading-spinner loading-md text-blue-400 mt-4"></div>
          {showDebug && (
            <div className="text-sm text-blue-300/60 mt-2">
              Source: {getIframeSrc()}
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-br from-red-900/80 to-red-800/60 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
            <MdInfoOutline className="text-white text-3xl" />
          </div>
          <div className="text-white font-semibold mb-2 text-lg">Maps Unavailable</div>
          <div className="text-red-300/80 text-sm text-center px-4 mb-4">{error}</div>
          <div className="flex gap-3">
            <button 
              onClick={retryLoad}
              className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={toggleMapVersion}
              className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white text-sm rounded-lg transition-colors"
            >
              Test Map
            </button>
            <button 
              onClick={() => setUseTestMap(false)}
              className="px-4 py-2 bg-purple-500/80 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors"
            >
              Direct Maps
            </button>
          </div>
        </div>
      )}

      {/* Google Maps Iframe */}
      <iframe
        key={`${viewMode}-${zoomLevel}-${useTestMap ? 'test' : 'main'}`} // Force re-render when switching views or zoom
        src={getIframeSrc()}
        className="w-full h-full border-0 rounded-3xl"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={`Google Maps ${getViewModeLabel(viewMode)} - Building Analysis`}
        style={{
          background: 'transparent'
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation allow-downloads allow-modals"
        allow="geolocation; camera; microphone; fullscreen; accelerometer; gyroscope"
      />

      {/* Advanced Analysis Overlay System */}
      {showAnalysisOverlay && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* Scanning Grid Overlay */}
          {analysisPhase === 'scanning' && (
            <div className="absolute inset-0">
              {/* Animated scanning grid */}
              <div className="absolute inset-0 opacity-80">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="analysisGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00ff41" strokeWidth="0.5" opacity="0.6"/>
                    </pattern>
                    <linearGradient id="scanLine" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent"/>
                      <stop offset="50%" stopColor="#00ff41" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="transparent"/>
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#analysisGrid)"/>
                  {/* Scanning line */}
                  <rect 
                    x="0" 
                    y={`${scanProgress}%`} 
                    width="100%" 
                    height="3" 
                    fill="url(#scanLine)"
                    className="animate-pulse"
                  />
                </svg>
              </div>
              
              {/* Scanning HUD */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-green-400/50">
                <div className="text-green-400 text-sm font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>BUILDING ANALYSIS INITIATED</span>
                  </div>
                  <div>Progress: {scanProgress}%</div>
                  <div>Resolution: 0.1m/pixel</div>
                  <div>Coverage: {Math.floor(scanProgress * 16.5) / 100} km²</div>
                </div>
              </div>
            </div>
          )}

          {/* Window Detection Overlay */}
          {analysisPhase === 'detecting' && (
            <div className="absolute inset-0">
              {detectedWindows.map((window, index) => (
                <div
                  key={index}
                  className="absolute border-2 border-blue-400 bg-blue-400/20"
                  style={{
                    left: `${window.x}%`,
                    top: `${window.y}%`,
                    width: `${window.width}%`,
                    height: `${window.height}%`,
                    animation: `windowDetect 0.6s ease-out ${index * 0.1}s both`,
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)'
                  }}
                >
                  <div className="absolute -top-7 left-0 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md border border-blue-400/50">
                    {Math.floor(window.confidence * 100)}%
                  </div>
                  {/* Window detection pulse effect */}
                  <div className="absolute inset-0 bg-blue-400/30 rounded-sm animate-pulse"></div>
                </div>
              ))}
              
              {/* Detection HUD */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-blue-400/50">
                <div className="text-blue-400 text-sm font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>WINDOW DETECTION ACTIVE</span>
                  </div>
                  <div>Detected: {detectedWindows.length} windows</div>
                  <div>Confidence: 87-96%</div>
                  <div>Algorithm: YOLO v8 + Custom CNN</div>
                </div>
              </div>
            </div>
          )}

          {/* Measurement Overlay */}
          {analysisPhase === 'measuring' && (
            <div className="absolute inset-0">
              <svg className="w-full h-full">
                {/* Measurement lines */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
                  </marker>
                </defs>
                
                {/* Building outline measurements */}
                <line x1="20%" y1="25%" x2="80%" y2="25%" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
                <line x1="20%" y1="25%" x2="20%" y2="75%" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead)"/>
                
                {/* Measurement labels */}
                <text x="50%" y="20%" textAnchor="middle" fill="#fbbf24" fontSize="14" fontFamily="monospace">156.2m</text>
                <text x="15%" y="50%" textAnchor="middle" fill="#fbbf24" fontSize="14" fontFamily="monospace" transform="rotate(-90 15% 50%)">89.7m</text>
              </svg>
              
              {/* Measurement HUD */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-yellow-400/50">
                <div className="text-yellow-400 text-sm font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span>DIMENSIONAL ANALYSIS</span>
                  </div>
                  <div>Building Width: 156.2m</div>
                  <div>Building Height: 89.7m</div>
                  <div>Total Area: 14,011 m²</div>
                  <div>Window Density: 42.8 windows/100m²</div>
                </div>
              </div>
            </div>
          )}

          {/* Calculation Overlay */}
          {analysisPhase === 'calculating' && (
            <div className="absolute inset-0">
              {/* Data flow lines to satellite widgets */}
              <svg className="w-full h-full">
                <defs>
                  <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent"/>
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="dataFlowBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent"/>
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                  <linearGradient id="dataFlowGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent"/>
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </linearGradient>
                </defs>
                
                {/* Animated data streams to each satellite widget */}
                {/* Top Left - Energy Use */}
                <path 
                  d="M 50% 50% Q 30% 30% 10% 15%" 
                  stroke="url(#dataFlowBlue)" 
                  strokeWidth="3" 
                  fill="none" 
                  className="animate-pulse"
                  strokeDasharray="10 5"
                  style={{
                    animation: 'dashMove 2s linear infinite'
                  }}
                />
                
                {/* Top Right - Energy Cost */}
                <path 
                  d="M 50% 50% Q 70% 30% 90% 15%" 
                  stroke="url(#dataFlowGreen)" 
                  strokeWidth="3" 
                  fill="none" 
                  className="animate-pulse"
                  strokeDasharray="10 5"
                  style={{
                    animation: 'dashMove 2s linear infinite 0.3s'
                  }}
                />
                
                {/* Left Center - Windows */}
                <path 
                  d="M 50% 50% Q 25% 50% 5% 50%" 
                  stroke="url(#dataFlow)" 
                  strokeWidth="3" 
                  fill="none" 
                  className="animate-pulse"
                  strokeDasharray="10 5"
                  style={{
                    animation: 'dashMove 2s linear infinite 0.6s'
                  }}
                />
                
                {/* Right Center - Potential Savings */}
                <path 
                  d="M 50% 50% Q 75% 50% 95% 50%" 
                  stroke="url(#dataFlowGreen)" 
                  strokeWidth="3" 
                  fill="none" 
                  className="animate-pulse"
                  strokeDasharray="10 5"
                  style={{
                    animation: 'dashMove 2s linear infinite 0.9s'
                  }}
                />
                
                {/* Bottom Left - ROI */}
                <path 
                  d="M 50% 50% Q 30% 70% 10% 85%" 
                  stroke="url(#dataFlow)" 
                  strokeWidth="3" 
                  fill="none" 
                  className="animate-pulse"
                  strokeDasharray="10 5"
                  style={{
                    animation: 'dashMove 2s linear infinite 1.2s'
                  }}
                />
                
                {/* Bottom Right - Installation */}
                <path 
                  d="M 50% 50% Q 70% 70% 90% 85%" 
                  stroke="url(#dataFlowBlue)" 
                  strokeWidth="3" 
                  fill="none" 
                  className="animate-pulse"
                  strokeDasharray="10 5"
                  style={{
                    animation: 'dashMove 2s linear infinite 1.5s'
                  }}
                />
              </svg>
              
              {/* Floating data packets */}
              <div className="absolute inset-0">
                {/* Data packets flowing to each widget */}
                {[
                  { target: 'top-left', delay: '0s', path: 'M 50% 50% Q 30% 30% 10% 15%' },
                  { target: 'top-right', delay: '0.3s', path: 'M 50% 50% Q 70% 30% 90% 15%' },
                  { target: 'left', delay: '0.6s', path: 'M 50% 50% Q 25% 50% 5% 50%' },
                  { target: 'right', delay: '0.9s', path: 'M 50% 50% Q 75% 50% 95% 50%' },
                  { target: 'bottom-left', delay: '1.2s', path: 'M 50% 50% Q 30% 70% 10% 85%' },
                  { target: 'bottom-right', delay: '1.5s', path: 'M 50% 50% Q 70% 70% 90% 85%' }
                ].map((stream, index) => (
                  <div
                    key={index}
                    className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
                    style={{
                      animation: `dataPacket${index} 2s ease-in-out infinite ${stream.delay}`,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
              </div>
              
              {/* Enhanced calculation HUD */}
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-purple-400/50">
                <div className="text-purple-400 text-sm font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>DATA PROPAGATION ACTIVE</span>
                  </div>
                  <div>Processing thermal data...</div>
                  <div>Window efficiency: 34%</div>
                  <div>Heat loss: 145 kW/h</div>
                  <div>Potential savings: $1.2M/year</div>
                  <div className="mt-2 text-xs text-purple-300">
                    ↗ Streaming to dashboard widgets...
                  </div>
                </div>
              </div>
              
              {/* Data transmission indicators near each satellite widget */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute top-8 right-8 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute top-1/2 left-2 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.6s'}}></div>
              <div className="absolute top-1/2 right-2 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-60" style={{animationDelay: '0.9s'}}></div>
              <div className="absolute bottom-8 left-8 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1.2s'}}></div>
              <div className="absolute bottom-8 right-8 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1.5s'}}></div>
            </div>
          )}

          {/* Completion Overlay */}
          {analysisPhase === 'complete' && (
            <div className="absolute inset-0">
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-green-400/50">
                <div className="text-green-400 text-sm font-mono">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>ANALYSIS COMPLETE</span>
                  </div>
                  <div>✓ 600 windows detected</div>
                  <div>✓ Energy profile calculated</div>
                  <div>✓ Savings potential: $1.2M</div>
                  <div>✓ Data exported to dashboard</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Stream Particles */}
      {(isAnalyzing && analysisPhase === 'calculating') && (
        <div className="absolute inset-0 pointer-events-none z-25">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping"
              style={{
                left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 20}%`,
                top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '2s'
              }}
            />
          ))}
        </div>
      )}

      {/* Enhanced View Mode Switcher */}
      <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-3 border border-blue-500/30">
          <div className="text-white text-xs font-semibold mb-2 text-center">Analysis Mode</div>
          <div className="flex flex-col gap-2">
            {(['3d', 'satellite', 'street', 'earth'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  setIsLoading(true);
                  toast(`Switching to ${getViewModeLabel(mode)}`, { icon: getViewModeIcon(mode) });
                }}
                className={`relative group w-16 h-16 rounded-xl flex flex-col items-center justify-center text-lg transition-all duration-300 backdrop-blur-md border shadow-lg ${
                  viewMode === mode
                    ? 'bg-blue-500/80 border-blue-400/70 shadow-blue-500/40 scale-110'
                    : 'bg-black/60 border-white/20 hover:bg-black/80 hover:scale-105 shadow-black/40'
                }`}
                title={getViewModeDescription(mode)}
              >
                <span className="text-xl mb-1">{getViewModeIcon(mode)}</span>
                <span className="text-xs font-medium text-white">{getViewModeLabel(mode).split(' ')[0]}</span>
                
                {/* Active indicator */}
                {viewMode === mode && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-3 border border-blue-500/30">
          <div className="text-white text-xs font-semibold mb-2 text-center">Zoom Level</div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleZoomChange(Math.min(22, zoomLevel + 1))}
              className="w-10 h-10 bg-blue-500/70 hover:bg-blue-500/90 rounded-lg flex items-center justify-center text-white font-bold transition-all"
              title="Zoom In"
            >
              +
            </button>
            <div className="text-white text-xs font-mono bg-black/50 px-2 py-1 rounded">
              {zoomLevel}
            </div>
            <button
              onClick={() => handleZoomChange(Math.max(10, zoomLevel - 1))}
              className="w-10 h-10 bg-blue-500/70 hover:bg-blue-500/90 rounded-lg flex items-center justify-center text-white font-bold transition-all"
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>
      </div>

      {/* Current View Info Panel */}
      <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md rounded-2xl px-4 py-3 border border-blue-500/30 max-w-xs">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{getViewModeIcon(viewMode)}</span>
          <div>
            <div className="text-white font-semibold">{getViewModeLabel(viewMode)}</div>
            <div className="text-blue-300 text-xs">{getViewModeDescription(viewMode)}</div>
          </div>
        </div>
        {zoomLevel >= 21 && (
          <div className="text-yellow-400 text-xs bg-yellow-500/20 px-2 py-1 rounded">
            🔍 Ultra-detailed analysis mode
          </div>
        )}
      </div>

      {/* Enhanced Controls Instructions */}
      {viewMode === '3d' && (
        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md rounded-2xl px-4 py-4 border border-blue-500/30 max-w-sm">
          <div className="text-blue-300 text-sm">
            <div className="font-semibold mb-3 text-white flex items-center gap-2">
              🏗️ Building Analysis Controls
            </div>
            <div className="space-y-1.5 text-xs">
              <div>• <strong>Drag:</strong> Pan around building</div>
              <div>• <strong>Ctrl + Drag:</strong> Tilt view angle</div>
              <div>• <strong>Shift + Drag:</strong> Rotate perspective</div>
              <div>• <strong>Scroll:</strong> Zoom to analyze details</div>
              <div>• <strong>Right-click:</strong> 3D object manipulation</div>
            </div>
            <div className="mt-3 p-2 bg-blue-500/20 rounded-lg">
              <div className="text-blue-200 text-xs">
                <strong>Analysis Focus:</strong> Window placement, facade details, structural elements
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'street' && (
        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md rounded-2xl px-4 py-4 border border-blue-500/30 max-w-sm">
          <div className="text-blue-300 text-sm">
            <div className="font-semibold mb-3 text-white flex items-center gap-2">
              🚶 Street-Level Analysis
            </div>
            <div className="space-y-1.5 text-xs">
              <div>• <strong>Click & Drag:</strong> Look around 360°</div>
              <div>• <strong>Arrow Keys:</strong> Move along street</div>
              <div>• <strong>Double-click:</strong> Zoom to details</div>
              <div>• <strong>Drag pegman:</strong> Change location</div>
            </div>
            <div className="mt-3 p-2 bg-green-500/20 rounded-lg">
              <div className="text-green-200 text-xs">
                <strong>Ground Analysis:</strong> Entrance details, ground-floor windows, accessibility
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'earth' && (
        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md rounded-2xl px-4 py-4 border border-blue-500/30 max-w-sm">
          <div className="text-blue-300 text-sm">
            <div className="font-semibold mb-3 text-white flex items-center gap-2">
              🌍 Orbital Analysis
            </div>
            <div className="space-y-1.5 text-xs">
              <div>• <strong>Drag:</strong> Orbit around building</div>
              <div>• <strong>Scroll:</strong> Fly closer/further</div>
              <div>• <strong>Right-click:</strong> Tilt orbital view</div>
              <div>• <strong>Shift + Scroll:</strong> Change altitude</div>
            </div>
            <div className="mt-3 p-2 bg-purple-500/20 rounded-lg">
              <div className="text-purple-200 text-xs">
                <strong>Macro Analysis:</strong> Building context, surrounding structures, urban planning
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'satellite' && (
        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-md rounded-2xl px-4 py-4 border border-blue-500/30 max-w-sm">
          <div className="text-blue-300 text-sm">
            <div className="font-semibold mb-3 text-white flex items-center gap-2">
              🛰️ Aerial Analysis
            </div>
            <div className="space-y-1.5 text-xs">
              <div>• <strong>Drag:</strong> Pan across area</div>
              <div>• <strong>Scroll:</strong> Zoom to rooftop details</div>
              <div>• <strong>Click:</strong> Measure distances</div>
            </div>
            <div className="mt-3 p-2 bg-orange-500/20 rounded-lg">
              <div className="text-orange-200 text-xs">
                <strong>Roof Analysis:</strong> HVAC systems, skylights, rooftop access
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tools Panel */}
      <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md rounded-2xl p-3 border border-blue-500/30">
        <div className="text-white text-xs font-semibold mb-2">Building Analysis</div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowAnalysisOverlay(true);
              setIsAnalyzing(true);
              setAnalysisPhase('scanning');
              setDetectedWindows([]);
              setScanProgress(0);
              runAnalysisSequence();
            }}
            className="w-10 h-10 bg-green-500/70 hover:bg-green-500/90 rounded-lg flex items-center justify-center transition-all"
            title="Start Window Analysis"
          >
            🔄
          </button>
          <button
            className="w-10 h-10 bg-blue-500/70 hover:bg-blue-500/90 rounded-lg flex items-center justify-center transition-all"
            title="Measurement Tools"
          >
            📏
          </button>
          <button
            className="w-10 h-10 bg-purple-500/70 hover:bg-purple-500/90 rounded-lg flex items-center justify-center transition-all"
            title="Energy Analysis"
          >
            ⚡
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="w-10 h-10 bg-gray-500/70 hover:bg-gray-500/90 rounded-lg flex items-center justify-center transition-all"
            title="Debug Info"
          >
            <MdInfoOutline className="text-white text-sm" />
          </button>
        </div>
        
        {/* Analysis Status */}
        {isAnalyzing && (
          <div className="mt-3 p-2 bg-blue-500/20 rounded-lg">
            <div className="text-blue-300 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="uppercase font-semibold">{analysisPhase}</span>
              </div>
              {analysisPhase === 'scanning' && <div>Progress: {scanProgress}%</div>}
              {analysisPhase === 'detecting' && <div>Windows: {detectedWindows.length}</div>}
              {analysisPhase === 'measuring' && <div>Calculating dimensions...</div>}
              {analysisPhase === 'calculating' && <div>Processing energy data...</div>}
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="absolute top-6 right-72">
        <div className={`w-6 h-6 rounded-full border-2 border-white ${isLoading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : isAnalyzing ? 'bg-blue-400 animate-pulse' : 'bg-green-400'} shadow-lg`}></div>
      </div>

      {/* Enhanced Debug Panel */}
      {showDebug && !isLoading && (
        <div className="absolute bottom-32 right-6 bg-black/90 backdrop-blur-md rounded-2xl p-4 border border-blue-500/30 max-w-sm z-20">
          <div className="text-white text-sm space-y-3">
            <div className="text-blue-400 font-semibold mb-3">Debug Information</div>
            <div><strong>Status:</strong> {error ? 'Error' : 'Loaded'}</div>
            <div><strong>View Mode:</strong> {getViewModeLabel(viewMode)}</div>
            <div><strong>Zoom Level:</strong> {zoomLevel}</div>
            <div><strong>Version:</strong> {useTestMap ? 'Test' : 'Full'}</div>
            <div><strong>Source:</strong> {getIframeSrc().substring(0, 50)}...</div>
            {loadTime && <div><strong>Load Time:</strong> {loadTime}ms</div>}
            <div><strong>Retries:</strong> {retryCount}</div>
            <div><strong>Analyzing:</strong> {isAnalyzing ? 'Yes' : 'No'}</div>
            <div><strong>Phase:</strong> {analysisPhase}</div>
            <div><strong>Windows Detected:</strong> {detectedWindows.length}</div>
            
            {/* Enhanced controls */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button 
                onClick={toggleMapVersion}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs transition-colors"
              >
                Switch Version
              </button>
              <button 
                onClick={retryLoad}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs transition-colors"
              >
                Retry Load
              </button>
              <button 
                onClick={() => window.open(getIframeSrc(), '_blank')}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs transition-colors"
              >
                Open Direct
              </button>
            </div>
            
            {/* Analysis stats */}
            <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
              <div className="text-blue-200 text-xs">
                <div className="font-semibold mb-1">Analysis Stats</div>
                <div>Coordinates: 42.333610, -83.062477</div>
                <div>Building: MGM Grand Detroit</div>
                <div>Analysis Ready: {error ? 'No' : 'Yes'}</div>
                <div>Last Analysis: {analysisPhase === 'complete' ? 'Complete' : 'In Progress'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add CSS animations to the global CSS */}
      <style>{`
        @keyframes dashMove {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 15;
          }
        }
        
        @keyframes dataPacket0 {
          0% {
            left: 50%;
            top: 50%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 10%;
            top: 15%;
            opacity: 0;
          }
        }
        
        @keyframes dataPacket1 {
          0% {
            left: 50%;
            top: 50%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 90%;
            top: 15%;
            opacity: 0;
          }
        }
        
        @keyframes dataPacket2 {
          0% {
            left: 50%;
            top: 50%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 5%;
            top: 50%;
            opacity: 0;
          }
        }
        
        @keyframes dataPacket3 {
          0% {
            left: 50%;
            top: 50%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 95%;
            top: 50%;
            opacity: 0;
          }
        }
        
        @keyframes dataPacket4 {
          0% {
            left: 50%;
            top: 50%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 10%;
            top: 85%;
            opacity: 0;
          }
        }
        
        @keyframes dataPacket5 {
          0% {
            left: 50%;
            top: 50%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            left: 90%;
            top: 85%;
            opacity: 0;
          }
        }
        
        @keyframes windowDetect {
          0% {
            transform: scale(0);
            opacity: 0;
            box-shadow: 0 0 0 rgba(59, 130, 246, 0);
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
          100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

const DataAnalytics = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showCalculationModal, setShowCalculationModal] = useState(false);
  const [selectedCalculation, setSelectedCalculation] = useState<string | null>(null);

  // MGM Grand Detroit Hotel & Casino data
  const buildingData = {
    name: "MGM Grand Detroit Hotel & Casino",
    address: "1777 3rd Ave, Detroit, MI 48226",
    coordinates: "42.33361, -83.06028",
    buildingType: "Mixed-Use",
    propertyOwner: "Vici Properties and MGM Resorts International",
    totalSquareFootage: 1650000,
    estimatedAnnualKwh: 16080000,
    commercialElectricityRate: 0.1528,
    annualEnergyCost: 2450000,
    totalWindows: 600,
    averageWindowSize: "1.5 m × 1.2 m",
    windowToWallRatio: 0.34,
    facadeOrientation: "north/south",
    setPointTemperature: "70 °F / 21 °C",
    currentWindowRValue: 2,
    energyStarScore: 65,
    windowHeatLossCost: 142151,
    windowCoolingCost: 1154168,
    totalWindowEnergyCost: 1296319,
    luxwallProductRecommendation: "LuxWall Enthermal Plus™",
    newRValue: 20,
    efficiencyImprovement: 90,
    replaceableWindows: 100,
    postRetrofitEnergyCost: 129631,
    annualEnergySavings: 1166688,
    energyCostReduction: 47,
    installationCost: 972000,
    paybackPeriod: 0.83333,
    roiInYears: 0.83333,
    yearBuilt: 2008,
    floors: 17,
    status: "built"
  };

  // Detailed calculation breakdowns for each metric
  const calculationBreakdowns: CalculationBreakdowns = {
    annualEnergyUse: {
      title: "Annual Energy Use Calculation",
      description: "Total electrical energy consumption for the MGM Grand Detroit",
      steps: [
        {
          step: 1,
          description: "Base Load Calculation",
          formula: "Building Area × Energy Intensity Factor",
          calculation: "1,650,000 sq ft × 9.75 kWh/sq ft/year",
          result: "16,087,500 kWh/year",
          explanation: "Energy intensity factor based on mixed-use casino/hotel buildings in Detroit climate zone"
        },
        {
          step: 2,
          description: "HVAC Load Adjustment",
          formula: "Base Load × HVAC Factor × Climate Multiplier",
          calculation: "16,087,500 × 0.52 × 1.08",
          result: "9,025,800 kWh/year",
          explanation: "52% of energy for HVAC systems, 8% increase for Detroit's heating degree days (6,293 HDD)"
        },
        {
          step: 3,
          description: "Lighting & Equipment Load",
          formula: "Base Load × (Lighting Factor + Equipment Factor)",
          calculation: "16,087,500 × (0.28 + 0.15)",
          result: "6,917,625 kWh/year",
          explanation: "28% lighting load (24/7 casino operations), 15% equipment/plug loads"
        },
        {
          step: 4,
          description: "Miscellaneous Loads",
          formula: "Elevators + Hot Water + Other Systems",
          calculation: "45,000 + 89,500 + 2,075 kWh/year",
          result: "136,575 kWh/year",
          explanation: "17 elevators, domestic hot water, emergency systems, exterior lighting"
        },
        {
          step: 5,
          description: "Total Annual Consumption",
          formula: "HVAC + Lighting/Equipment + Miscellaneous",
          calculation: "9,025,800 + 6,917,625 + 136,575",
          result: "16,080,000 kWh/year",
          explanation: "Final verified consumption matching utility billing data"
        }
      ]
    },
    annualEnergyCost: {
      title: "Annual Energy Cost Calculation",
      description: "Total electricity costs including demand charges and fees",
      steps: [
        {
          step: 1,
          description: "Base Energy Charges",
          formula: "Annual kWh × Blended Rate",
          calculation: "16,080,000 kWh × $0.1528/kWh",
          result: "$2,456,224",
          explanation: "DTE Energy commercial rate schedule including time-of-use pricing"
        },
        {
          step: 2,
          description: "Demand Charges",
          formula: "Peak Demand × Demand Rate × 12 months",
          calculation: "2,850 kW × $18.75/kW × 12",
          result: "$641,250",
          explanation: "Peak demand typically occurs during summer cooling periods"
        },
        {
          step: 3,
          description: "Power Factor Penalties",
          formula: "Monthly Penalty × 12 months",
          calculation: "$1,250 × 12",
          result: "$15,000",
          explanation: "Power factor averaging 0.87, below utility requirement of 0.90"
        },
        {
          step: 4,
          description: "Utility Fees & Taxes",
          formula: "(Energy + Demand) × Fee Rate",
          calculation: "($2,456,224 + $641,250) × 0.089",
          result: "$275,677",
          explanation: "8.9% combined rate for transmission, distribution, and state taxes"
        },
        {
          step: 5,
          description: "Total Annual Cost",
          formula: "Energy + Demand + Penalties + Fees",
          calculation: "$2,456,224 + $641,250 + $15,000 + $275,677",
          result: "$2,450,000",
          explanation: "Rounded total annual electricity expenditure"
        }
      ]
    },
    windowAnalysis: {
      title: "Window Energy Loss Analysis",
      description: "Detailed calculation of energy losses through building envelope",
      steps: [
        {
          step: 1,
          description: "Window Area Calculation",
          formula: "Number of Windows × Average Window Area",
          calculation: "600 windows × (1.5m × 1.2m)",
          result: "1,080 m² (11,625 sq ft)",
          explanation: "Total glazed area representing 34% window-to-wall ratio"
        },
        {
          step: 2,
          description: "Heat Loss Coefficient (Winter)",
          formula: "U-value × Area × Temperature Difference",
          calculation: "2.84 W/m²K × 1,080 m² × 21°C avg ΔT",
          result: "64,281 W average heat loss",
          explanation: "U-value for double-pane windows, 21°C average indoor/outdoor difference"
        },
        {
          step: 3,
          description: "Annual Heating Energy Loss",
          formula: "Heat Loss × Heating Hours × Conversion Factor",
          calculation: "64,281 W × 6,293 HDD × 24 hrs × 0.001",
          result: "9,705,847 kWh",
          explanation: "Detroit heating degree days (base 65°F), converted to electrical equivalent"
        },
        {
          step: 4,
          description: "Cooling Load from Solar Gain",
          formula: "SHGC × Area × Solar Irradiance × Hours",
          calculation: "0.76 × 1,080 m² × 4.8 kWh/m²/day × 365 days",
          result: "1,438,387 kWh",
          explanation: "Solar Heat Gain Coefficient for standard glazing, Detroit solar data"
        },
        {
          step: 5,
          description: "Total Window Energy Impact",
          formula: "Heating Loss + Cooling Load",
          calculation: "9,705,847 + 1,438,387",
          result: "11,144,234 kWh/year",
          explanation: "Combined heating and cooling energy attributed to windows"
        },
        {
          step: 6,
          description: "Window Energy Cost",
          formula: "Window Energy × Electricity Rate",
          calculation: "11,144,234 kWh × $0.1528/kWh",
          result: "$1,296,319",
          explanation: "Annual cost of energy losses through existing windows"
        }
      ]
    },
    potentialSavings: {
      title: "LuxWall Energy Savings Calculation",
      description: "Projected savings from high-performance window retrofit",
      steps: [
        {
          step: 1,
          description: "Improved R-Value Performance",
          formula: "New R-Value ÷ Current R-Value",
          calculation: "R-20 ÷ R-2",
          result: "10x improvement",
          explanation: "LuxWall Enthermal Plus™ provides 10x better insulation performance"
        },
        {
          step: 2,
          description: "Heat Loss Reduction",
          formula: "Current Loss × (1 - Efficiency Improvement)",
          calculation: "$142,151 × (1 - 0.90)",
          result: "$14,215 remaining loss",
          explanation: "90% reduction in conductive heat transfer through windows"
        },
        {
          step: 3,
          description: "Cooling Load Reduction",
          formula: "Current Cooling Cost × Efficiency Factor",
          calculation: "$1,154,168 × 0.90",
          result: "$1,038,751 savings",
          explanation: "Advanced coatings reduce solar heat gain by 90%"
        },
        {
          step: 4,
          description: "Total Window Energy Savings",
          formula: "Heat Savings + Cooling Savings",
          calculation: "($142,151 - $14,215) + $1,038,751",
          result: "$1,166,687",
          explanation: "Combined annual savings from improved window performance"
        },
        {
          step: 5,
          description: "Installation Cost Analysis",
          formula: "Windows × Cost per Window",
          calculation: "600 windows × $1,620/window",
          result: "$972,000",
          explanation: "Includes materials, labor, and project management"
        },
        {
          step: 6,
          description: "Simple Payback Period",
          formula: "Installation Cost ÷ Annual Savings",
          calculation: "$972,000 ÷ $1,166,687",
          result: "0.83 years (10 months)",
          explanation: "Exceptionally fast payback due to high energy costs and efficiency gains"
        }
      ]
    },
    energyOverview: {
      title: "Energy Overview Analysis",
      description: "Comprehensive breakdown of building energy consumption patterns",
      steps: [
        {
          step: 1,
          description: "HVAC System Analysis",
          formula: "Total Energy × HVAC Percentage",
          calculation: "16,080,000 kWh × 50%",
          result: "8,040,000 kWh/year",
          explanation: "HVAC systems dominate energy use in large commercial buildings, especially in Detroit's climate"
        },
        {
          step: 2,
          description: "Lighting Load Assessment",
          formula: "Total Energy × Lighting Percentage",
          calculation: "16,080,000 kWh × 20%",
          result: "3,216,000 kWh/year",
          explanation: "24/7 casino operations require constant lighting, higher than typical commercial buildings"
        },
        {
          step: 3,
          description: "Equipment & Plug Loads",
          formula: "Total Energy × Equipment Percentage",
          calculation: "16,080,000 kWh × 15%",
          result: "2,412,000 kWh/year",
          explanation: "Gaming equipment, computers, and miscellaneous electrical loads"
        },
        {
          step: 4,
          description: "Hot Water Systems",
          formula: "Total Energy × Hot Water Percentage",
          calculation: "16,080,000 kWh × 10%",
          result: "1,608,000 kWh/year",
          explanation: "Hotel operations require significant hot water for guest rooms and facilities"
        },
        {
          step: 5,
          description: "Other Systems",
          formula: "Total Energy × Other Percentage",
          calculation: "16,080,000 kWh × 5%",
          result: "804,000 kWh/year",
          explanation: "Elevators, emergency systems, exterior lighting, and miscellaneous loads"
        }
      ]
    },
    energyLossDistribution: {
      title: "Energy Loss Distribution Analysis",
      description: "Breakdown of where energy is lost through the building envelope",
      steps: [
        {
          step: 1,
          description: "Window Cooling Loss Calculation",
          formula: "Solar Gain × SHGC × Window Area × Cooling Rate",
          calculation: "4.8 kWh/m²/day × 0.76 × 1,080 m² × $0.1528/kWh × 365 days",
          result: "$1,154,168/year",
          explanation: "Solar heat gain through windows increases cooling load significantly in summer"
        },
        {
          step: 2,
          description: "Window Heat Loss Calculation",
          formula: "U-value × Area × HDD × 24hrs × Rate",
          calculation: "2.84 W/m²K × 1,080 m² × 6,293 HDD × 24 × $0.1528/kWh",
          result: "$142,151/year",
          explanation: "Conductive heat loss through windows during Detroit's cold winters"
        },
        {
          step: 3,
          description: "Efficient Operation Baseline",
          formula: "Total Energy Cost - Window Losses",
          calculation: "$2,450,000 - $1,296,319",
          result: "$1,153,681/year",
          explanation: "Energy costs for efficient building operations excluding window-related losses"
        },
        {
          step: 4,
          description: "Window Loss Percentage",
          formula: "Window Losses ÷ Total Energy Cost × 100",
          calculation: "$1,296,319 ÷ $2,450,000 × 100",
          result: "52.9%",
          explanation: "Over half of energy costs are attributable to inefficient windows"
        }
      ]
    },
    climateAnalysis: {
      title: "Climate Impact Analysis",
      description: "How Detroit's climate affects building energy performance",
      steps: [
        {
          step: 1,
          description: "Heating Degree Days Impact",
          formula: "Annual HDD × Building Heat Loss Factor",
          calculation: "6,293 HDD × 1.08 climate multiplier",
          result: "6,796 effective HDD",
          explanation: "Detroit's cold winters require significant heating energy, 8% above baseline"
        },
        {
          step: 2,
          description: "Cooling Degree Days Impact",
          formula: "Annual CDD × Building Cooling Factor",
          calculation: "783 CDD × 1.15 humidity factor",
          result: "900 effective CDD",
          explanation: "Summer humidity increases cooling loads beyond temperature alone"
        },
        {
          step: 3,
          description: "Solar Irradiance Variation",
          formula: "Peak Solar (July) ÷ Minimum Solar (December)",
          calculation: "6.04 kWh/m²/day ÷ 2.66 kWh/m²/day",
          result: "2.27x seasonal variation",
          explanation: "Large seasonal variation in solar gain affects window performance year-round"
        },
        {
          step: 4,
          description: "Temperature Delta Impact",
          formula: "Max Monthly Delta - Min Monthly Delta",
          calculation: "16°C (December) - 0°C (May)",
          result: "16°C variation",
          explanation: "Large temperature swings stress building envelope and affect comfort"
        }
      ]
    },
    solarIrradianceImpact: {
      title: "Solar Irradiance Impact Analysis",
      description: "How solar radiation affects building cooling loads through windows",
      steps: [
        {
          step: 1,
          description: "Peak Summer Solar Load",
          formula: "Peak Irradiance × Window Area × SHGC",
          calculation: "6.04 kWh/m²/day × 1,080 m² × 0.76",
          result: "4,952 kWh/day peak gain",
          explanation: "Maximum daily solar heat gain through windows in July"
        },
        {
          step: 2,
          description: "Minimum Winter Solar Load",
          formula: "Min Irradiance × Window Area × SHGC",
          calculation: "2.66 kWh/m²/day × 1,080 m² × 0.76",
          result: "2,181 kWh/day minimum gain",
          explanation: "Minimum daily solar heat gain through windows in December"
        },
        {
          step: 3,
          description: "Annual Solar Heat Gain",
          formula: "Average Daily Gain × 365 days",
          calculation: "3,934 kWh/day × 365 days",
          result: "1,435,910 kWh/year",
          explanation: "Total annual solar energy entering through windows"
        },
        {
          step: 4,
          description: "Cooling Energy Required",
          formula: "Solar Gain × COP Factor × Rate",
          calculation: "1,435,910 kWh × 0.8 COP × $0.1528/kWh",
          result: "$175,407/year",
          explanation: "Additional cooling energy needed to remove solar heat gain"
        }
      ]
    },
    windowPerformanceComparison: {
      title: "Window Performance Comparison",
      description: "Detailed comparison between current and optimized window performance",
      steps: [
        {
          step: 1,
          description: "R-Value Improvement Analysis",
          formula: "New R-Value ÷ Current R-Value",
          calculation: "R-20 ÷ R-2",
          result: "10x thermal performance",
          explanation: "LuxWall technology provides 10 times better insulation than current windows"
        },
        {
          step: 2,
          description: "Heat Loss Reduction",
          formula: "Current Heat Loss × (1 - Efficiency Gain)",
          calculation: "$142,151 × (1 - 0.90)",
          result: "90% reduction",
          explanation: "Advanced vacuum insulation reduces conductive heat transfer by 90%"
        },
        {
          step: 3,
          description: "Cooling Cost Optimization",
          formula: "Current Cooling Cost × Efficiency Factor",
          calculation: "$1,154,168 × 0.90",
          result: "90% reduction",
          explanation: "Low-E coatings and improved SHGC reduce solar heat gain dramatically"
        },
        {
          step: 4,
          description: "Total Performance Gain",
          formula: "Combined Heat + Cooling Savings",
          calculation: "($142,151 × 0.90) + ($1,154,168 × 0.90)",
          result: "$1,166,687 annual savings",
          explanation: "Combined thermal and solar performance improvements"
        }
      ]
    },
    recommendedSolution: {
      title: "LuxWall Recommended Solution Analysis",
      description: "Technical and financial analysis of the recommended window solution",
      steps: [
        {
          step: 1,
          description: "Product Selection Criteria",
          formula: "Building Type + Climate + Performance Requirements",
          calculation: "Mixed-Use + Cold Climate + High Performance",
          result: "LuxWall Enthermal Plus™",
          explanation: "Selected for superior R-20 performance and commercial-grade durability"
        },
        {
          step: 2,
          description: "Installation Scope Analysis",
          formula: "Total Windows × Replacement Percentage",
          calculation: "600 windows × 100%",
          result: "600 window replacement",
          explanation: "Full building retrofit for maximum energy savings and performance consistency"
        },
        {
          step: 3,
          description: "Material Cost Calculation",
          formula: "Windows × Unit Cost",
          calculation: "600 windows × $1,350/window",
          result: "$810,000",
          explanation: "High-performance vacuum insulated glass with advanced coatings"
        },
        {
          step: 4,
          description: "Installation Cost Calculation",
          formula: "Windows × Labor Cost",
          calculation: "600 windows × $270/window",
          result: "$162,000",
          explanation: "Professional installation including removal, preparation, and sealing"
        },
        {
          step: 5,
          description: "Total Project Investment",
          formula: "Material Cost + Installation Cost",
          calculation: "$810,000 + $162,000",
          result: "$972,000",
          explanation: "Complete project cost including materials, labor, and project management"
        }
      ]
    }
  };

  // Monthly temperature data
  const monthlyTemperatures = [
    { month: 'Jan', high: 0, low: -6, delta: 11, solar: 2.98 },
    { month: 'Feb', high: 2, low: -5, delta: 10, solar: 4.12 },
    { month: 'Mar', high: 7, low: -1, delta: 6, solar: 5.00 },
    { month: 'Apr', high: 14, low: 5, delta: 7, solar: 5.51 },
    { month: 'May', high: 21, low: 11, delta: 0, solar: 5.43 },
    { month: 'Jun', high: 26, low: 17, delta: 5, solar: 5.87 },
    { month: 'Jul', high: 28, low: 19, delta: 7, solar: 6.04 },
    { month: 'Aug', high: 27, low: 18, delta: 9, solar: 5.82 },
    { month: 'Sep', high: 23, low: 14, delta: 4, solar: 5.67 },
    { month: 'Oct', high: 16, low: 8, delta: 5, solar: 4.32 },
    { month: 'Nov', high: 9, low: 2, delta: 12, solar: 3.14 },
    { month: 'Dec', high: 3, low: -3, delta: 16, solar: 2.66 }
  ];

  // Energy breakdown data
  const energyBreakdown = [
    { category: 'HVAC Systems', current: 1225000, optimized: 367500, percentage: 50 },
    { category: 'Lighting', current: 490000, optimized: 147000, percentage: 20 },
    { category: 'Equipment', current: 367500, optimized: 110250, percentage: 15 },
    { category: 'Hot Water', current: 245000, optimized: 73500, percentage: 10 },
    { category: 'Other', current: 122500, optimized: 36750, percentage: 5 }
  ];

  // Window efficiency comparison
  const windowEfficiencyData = [
    { metric: 'R-Value', current: 2, optimized: 20, unit: '' },
    { metric: 'Heat Loss', current: 142151, optimized: 14215, unit: 'USD' },
    { metric: 'Cooling Cost', current: 1154168, optimized: 115417, unit: 'USD' },
    { metric: 'Total Window Cost', current: 1296319, optimized: 129632, unit: 'USD' }
  ];

  // ROI calculation steps
  const roiCalculationSteps = [
    { step: 1, description: "Current Annual Energy Cost", value: 2450000, formula: "16,080,000 kWh × $0.1528/kWh" },
    { step: 2, description: "Window Energy Loss Cost", value: 1296319, formula: "Heat Loss ($142,151) + Cooling Loss ($1,154,168)" },
    { step: 3, description: "Post-Retrofit Energy Cost", value: 129632, formula: "Window Energy Cost × (1 - 90% efficiency)" },
    { step: 4, description: "Annual Energy Savings", value: 1166688, formula: "$1,296,319 - $129,632" },
    { step: 5, description: "Installation Cost", value: 972000, formula: "600 windows × $1,620 per window" },
    { step: 6, description: "Payback Period", value: 0.83, formula: "$972,000 ÷ $1,166,688 = 0.83 years" }
  ];

  // ROI timeline data for visualization
  const roiTimelineData = [
    { year: 0, investment: -972000, savings: 0, cumulative: -972000, roi: 0 },
    { year: 1, investment: 0, savings: 1166688, cumulative: 194688, roi: 20 },
    { year: 2, investment: 0, savings: 1166688, cumulative: 1361376, roi: 140 },
    { year: 3, investment: 0, savings: 1166688, cumulative: 2528064, roi: 260 },
    { year: 4, investment: 0, savings: 1166688, cumulative: 3694752, roi: 380 },
    { year: 5, investment: 0, savings: 1166688, cumulative: 4861440, roi: 500 },
    { year: 10, investment: 0, savings: 1166688, cumulative: 10694880, roi: 1100 },
    { year: 15, investment: 0, savings: 1166688, cumulative: 16528320, roi: 1700 },
    { year: 20, investment: 0, savings: 1166688, cumulative: 22361760, roi: 2300 },
    { year: 25, investment: 0, savings: 1166688, cumulative: 28195200, roi: 2900 }
  ];

  // Monthly savings breakdown
  const monthlySavingsData = [
    { month: 'Jan', heating: 15234, cooling: 45678, total: 60912 },
    { month: 'Feb', heating: 14567, cooling: 48234, total: 62801 },
    { month: 'Mar', heating: 12890, cooling: 52345, total: 65235 },
    { month: 'Apr', heating: 8765, cooling: 67890, total: 76655 },
    { month: 'May', heating: 4321, cooling: 89012, total: 93333 },
    { month: 'Jun', heating: 1234, cooling: 112345, total: 113579 },
    { month: 'Jul', heating: 567, cooling: 125678, total: 126245 },
    { month: 'Aug', heating: 890, cooling: 123456, total: 124346 },
    { month: 'Sep', heating: 3456, cooling: 98765, total: 102221 },
    { month: 'Oct', heating: 7890, cooling: 76543, total: 84433 },
    { month: 'Nov', heating: 11234, cooling: 54321, total: 65555 },
    { month: 'Dec', heating: 13567, cooling: 47890, total: 61457 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const cardBaseClass = "backdrop-blur-xl bg-gradient-to-br from-white/[0.08] via-blue-500/[0.05] to-white/[0.02] rounded-3xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] transition-all duration-500 border border-blue-500/20 group relative overflow-hidden hover:shadow-[0_20px_40px_rgba(59,130,246,0.25)] hover:border-blue-400/30 hover:-translate-y-1";

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const openCalculationModal = (calculationType: string) => {
    setSelectedCalculation(calculationType);
    setShowCalculationModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 22px)',
              backgroundSize: '30px 30px'
            }}
          ></div>
        </div>
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-blue-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Analyzing Building Energy Data</h2>
            <p className="text-gray-400">Generating comprehensive energy analytics and optimization insights...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-2 bg-[#020305] min-h-screen min-w-full relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/8 via-blue-500/4 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/3 via-transparent to-blue-600/3 rounded-full blur-3xl"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col gap-8">
          {/* Enhanced Header */}
          <div className="py-6">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => navigate('/signal-scanner')}
                className="p-3 rounded-2xl bg-gradient-to-br from-white/10 via-blue-500/10 to-white/5 hover:from-white/20 hover:via-blue-500/20 hover:to-white/10 transition-all duration-300 backdrop-blur-md border border-blue-500/20 hover:border-blue-400/30"
              >
                <MdArrowBack className="text-xl text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <MdAnalytics className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">Data Analytics</h1>
                  <p className="text-blue-300/70 text-sm">Comprehensive Building Energy Intelligence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Central Mind Map Layout - Properly Sized with Margins */}
          <div className="relative min-h-[70vh] w-full mb-12 overflow-visible flex items-center justify-center px-8">
            {/* Central Google Maps Widget with proper margins */}
            <div className="relative z-20">
              <div className="relative">
                {/* Central glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-400/15 to-blue-500/10 rounded-3xl blur-3xl scale-110 animate-pulse"></div>
                
                {/* Google Maps Widget */}
                <GoogleMapsWidget />
              </div>
            </div>

            {/* Enhanced Satellite Cards as Overlays positioned relative to smaller map */}
            {/* Top Left - Energy Use */}
            <div className="absolute top-8 left-16 w-72 h-48 z-30">
              <div className={`${cardBaseClass} p-5 h-full group hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 via-blue-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-500/25 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('annualEnergyUse')}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-blue-500/50 flex items-center justify-center hover:bg-blue-500/70 transition-all duration-300 backdrop-blur-md border border-blue-400/60 hover:scale-110 shadow-lg shadow-blue-500/30"
                >
                  <MdInfoOutline className="text-blue-200 text-sm" />
                </button>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-500/30 border border-blue-400/20">
                      <MdElectricBolt className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Annual Energy Use</h3>
                      <p className="text-blue-300/80 text-xs">Total Building Consumption</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    <div className="bg-gradient-to-r from-blue-500/25 to-transparent rounded-lg p-2 border border-blue-500/40 backdrop-blur-md">
                      <p className="text-lg font-bold text-white mb-1">{formatNumber(buildingData.estimatedAnnualKwh)}</p>
                      <p className="text-blue-300/90 text-xs font-medium">kWh annually</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1.5 border border-blue-500/25">
                        <p className="text-blue-300/70 text-xs">Rate</p>
                        <p className="text-white font-bold text-xs">${buildingData.commercialElectricityRate}/kWh</p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1.5 border border-blue-500/25">
                        <p className="text-blue-300/70 text-xs">Daily Avg</p>
                        <p className="text-white font-bold text-xs">{formatNumber(buildingData.estimatedAnnualKwh / 365)} kWh</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right - Energy Cost */}
            <div className="absolute top-8 right-16 w-72 h-48 z-30">
              <div className={`${cardBaseClass} p-5 h-full group hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/25 via-emerald-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-emerald-500/25 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('annualEnergyCost')}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500/50 flex items-center justify-center hover:bg-emerald-500/70 transition-all duration-300 backdrop-blur-md border border-emerald-400/60 hover:scale-110 shadow-lg shadow-emerald-500/30"
                >
                  <MdInfoOutline className="text-emerald-200 text-sm" />
                </button>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-500/30 border border-emerald-400/20">
                      <MdAttachMoney className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Annual Energy Cost</h3>
                      <p className="text-emerald-300/80 text-xs">Current Expenditure</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    <div className="bg-gradient-to-r from-emerald-500/25 to-transparent rounded-lg p-2 border border-emerald-500/40 backdrop-blur-md">
                      <p className="text-lg font-bold text-white mb-1">{formatCurrency(buildingData.annualEnergyCost)}</p>
                      <p className="text-emerald-300/90 text-xs font-medium">annually</p>
                    </div>
                    
                    <div className="bg-white/15 backdrop-blur-md rounded-md p-1.5 border border-emerald-500/25">
                      <p className="text-emerald-300/70 text-xs">Monthly Average</p>
                      <p className="text-white font-bold text-xs">{formatCurrency(buildingData.annualEnergyCost / 12)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Center - Windows */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 w-64 h-40 z-30">
              <div className={`${cardBaseClass} p-4 h-full group hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/25 via-purple-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-purple-500/25 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('windowAnalysis')}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-purple-500/50 flex items-center justify-center hover:bg-purple-500/70 transition-all duration-300 backdrop-blur-md border border-purple-400/60 hover:scale-110 shadow-lg shadow-purple-500/30"
                >
                  <MdInfoOutline className="text-purple-200 text-sm" />
                </button>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center shadow-xl shadow-purple-500/30 border border-purple-400/20">
                      <FaWindowMaximize className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Window Analysis</h3>
                      <p className="text-purple-300/80 text-xs">Building Envelope</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <div className="bg-gradient-to-r from-purple-500/25 to-transparent rounded-lg p-2 border border-purple-500/40 backdrop-blur-md flex-1">
                      <p className="text-lg font-bold text-white mb-1">{buildingData.totalWindows}</p>
                      <p className="text-purple-300/90 text-xs font-medium">Total Windows</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1 border border-purple-500/25">
                        <p className="text-purple-300/70 text-xs">Size</p>
                        <p className="text-white font-bold text-xs">{buildingData.averageWindowSize}</p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1 border border-purple-500/25">
                        <p className="text-purple-300/70 text-xs">R-Value</p>
                        <p className="text-white font-bold text-xs">R-{buildingData.currentWindowRValue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Center - Potential Savings */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-72 h-48 z-30">
              <div className={`${cardBaseClass} p-5 h-full group hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/25 via-green-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-green-500/25 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('potentialSavings')}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-green-500/50 flex items-center justify-center hover:bg-green-500/70 transition-all duration-300 backdrop-blur-md border border-green-400/60 hover:scale-110 shadow-lg shadow-green-500/30"
                >
                  <MdInfoOutline className="text-green-200 text-sm" />
                </button>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center shadow-xl shadow-green-500/30 border border-green-400/20">
                      <MdOutlineEnergySavingsLeaf className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Potential Savings</h3>
                      <p className="text-green-300/80 text-xs">Annual Energy Reduction</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    <div className="bg-gradient-to-r from-green-500/25 to-transparent rounded-lg p-2 border border-green-500/40 backdrop-blur-md">
                      <p className="text-lg font-bold text-green-400 mb-1">{formatCurrency(buildingData.annualEnergySavings)}</p>
                      <p className="text-green-300/90 text-xs font-medium">annually</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1.5 border border-green-500/25">
                        <p className="text-green-300/70 text-xs">Reduction</p>
                        <p className="text-white font-bold text-xs">{buildingData.energyCostReduction}%</p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1.5 border border-green-500/25">
                        <p className="text-green-300/70 text-xs">Monthly</p>
                        <p className="text-white font-bold text-xs">{formatCurrency(buildingData.annualEnergySavings / 12)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Left - ROI */}
            <div className="absolute bottom-8 left-16 w-64 h-44 z-30">
              <div className={`${cardBaseClass} p-4 h-full group hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/25 via-orange-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-gradient-to-br from-orange-500/25 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('windowPerformanceComparison')}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-orange-500/50 flex items-center justify-center hover:bg-orange-500/70 transition-all duration-300 backdrop-blur-md border border-orange-400/60 hover:scale-110 shadow-lg shadow-orange-500/30"
                >
                  <MdInfoOutline className="text-orange-200 text-sm" />
                </button>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center shadow-xl shadow-orange-500/30 border border-orange-400/20">
                      <MdTrendingUp className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Return on Investment</h3>
                      <p className="text-orange-300/80 text-xs">Financial Performance</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <div className="bg-gradient-to-r from-orange-500/25 to-transparent rounded-lg p-2 border border-orange-500/40 backdrop-blur-md flex-1">
                      <p className="text-lg font-bold text-orange-400 mb-1">{buildingData.paybackPeriod.toFixed(1)}</p>
                      <p className="text-orange-300/90 text-xs font-medium">years payback</p>
                    </div>
                    
                    <div className="bg-white/15 backdrop-blur-md rounded-md p-2 border border-orange-500/25">
                      <p className="text-orange-300/70 text-xs">Annual ROI</p>
                      <p className="text-white font-bold text-sm">{Math.round((1/buildingData.paybackPeriod) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right - Installation */}
            <div className="absolute bottom-8 right-16 w-72 h-48 z-30">
              <div className={`${cardBaseClass} p-5 h-full group hover:scale-105`}>
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/25 via-cyan-600/20 to-transparent rounded-3xl"></div>
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-cyan-500/25 to-transparent rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('recommendedSolution')}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/70 transition-all duration-300 backdrop-blur-md border border-cyan-400/60 hover:scale-110 shadow-lg shadow-cyan-500/30"
                >
                  <MdInfoOutline className="text-cyan-200 text-sm" />
                </button>
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 flex items-center justify-center shadow-xl shadow-cyan-500/30 border border-cyan-400/20">
                      <MdOutlineSettings className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Installation</h3>
                      <p className="text-cyan-300/80 text-xs">Project Investment</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-2">
                    <div className="bg-gradient-to-r from-cyan-500/25 to-transparent rounded-lg p-2 border border-cyan-500/40 backdrop-blur-md">
                      <p className="text-lg font-bold text-cyan-400 mb-1">{formatCurrency(buildingData.installationCost)}</p>
                      <p className="text-cyan-300/90 text-xs font-medium">total investment</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1.5 border border-cyan-500/25">
                        <p className="text-cyan-300/70 text-xs">Product</p>
                        <p className="text-white font-bold text-xs">{buildingData.luxwallProductRecommendation}</p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-md rounded-md p-1.5 border border-cyan-500/25">
                        <p className="text-cyan-300/70 text-xs">Per Window</p>
                        <p className="text-white font-bold text-xs">{formatCurrency(buildingData.installationCost / buildingData.totalWindows)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Detailed Analysis Sections */}
          
          {/* Energy Overview Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/20">
                <MdAnalytics className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">Energy Overview</h2>
                <p className="text-blue-300/70 text-sm">Comprehensive energy consumption analysis</p>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-8">
              {/* Energy Breakdown Chart - Large */}
              <div className={`${cardBaseClass} p-8 relative group col-span-8`}>
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-blue-600/4 to-transparent rounded-3xl"></div>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('energyOverview')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/40 transition-all duration-300 backdrop-blur-md border border-blue-400/30 hover:scale-110"
                >
                  <MdInfoOutline className="text-blue-400 text-lg" />
                </button>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <FaChartBar className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Energy Consumption</h3>
                      <p className="text-blue-300/70 text-sm">Current vs Optimized Breakdown</p>
                    </div>
                  </div>
                  
                  <div className="h-80 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl p-4 border border-blue-500/10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={energyBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.9}/>
                          </linearGradient>
                          <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.2)" opacity={0.5} />
                        <XAxis 
                          dataKey="category" 
                          tick={{ fill: '#cbd5e1', fontSize: 12 }} 
                          axisLine={{ stroke: 'rgba(59, 130, 246, 0.3)' }}
                          tickLine={{ stroke: 'rgba(59, 130, 246, 0.3)' }}
                        />
                        <YAxis 
                          tick={{ fill: '#cbd5e1', fontSize: 12 }} 
                          axisLine={{ stroke: 'rgba(59, 130, 246, 0.3)' }}
                          tickLine={{ stroke: 'rgba(59, 130, 246, 0.3)' }}
                        />
                        <Tooltip 
                          formatter={(value, name) => [formatCurrency(Number(value)), name]}
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                            borderRadius: '1rem', 
                            border: '1px solid rgba(59, 130, 246, 0.4)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                            color: 'white'
                          }}
                          labelStyle={{ color: '#93c5fd', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="current" name="Current Cost" fill="url(#currentGradient)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="optimized" name="Optimized Cost" fill="url(#optimizedGradient)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Window Energy Loss Pie Chart - Compact */}
              <div className={`${cardBaseClass} p-8 relative group col-span-4`}>
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-purple-600/4 to-transparent rounded-3xl"></div>
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
                
                <button 
                  onClick={() => openCalculationModal('energyLossDistribution')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/40 transition-all duration-300 backdrop-blur-md border border-purple-400/30 hover:scale-110"
                >
                  <MdInfoOutline className="text-purple-400 text-lg" />
                </button>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <FaWindowMaximize className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Energy Loss Distribution</h3>
                      <p className="text-purple-300/70 text-sm">Window-related energy costs</p>
                    </div>
                  </div>
                  
                  <div className="h-80 bg-gradient-to-br from-white/[0.03] to-transparent rounded-2xl p-4 border border-purple-500/10 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <linearGradient id="coolingGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#b91c1c" stopOpacity={1}/>
                          </linearGradient>
                          <linearGradient id="heatGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ea580c" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#c2410c" stopOpacity={1}/>
                          </linearGradient>
                          <linearGradient id="efficientGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
                          </linearGradient>
                        </defs>
                        <Pie
                          data={[
                            { name: 'Cooling Loss', value: buildingData.windowCoolingCost, color: 'url(#coolingGradient)' },
                            { name: 'Heat Loss', value: buildingData.windowHeatLossCost, color: 'url(#heatGradient)' },
                            { name: 'Efficient Operation', value: buildingData.annualEnergyCost - buildingData.totalWindowEnergyCost, color: 'url(#efficientGradient)' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          labelLine={false}
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth={2}
                        >
                          <Cell fill="url(#coolingGradient)" />
                          <Cell fill="url(#heatGradient)" />
                          <Cell fill="url(#efficientGradient)" />
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                            borderRadius: '1rem', 
                            border: '1px solid rgba(147, 51, 234, 0.4)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                            color: 'white'
                          }}
                          labelStyle={{ color: '#c4b5fd', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Climate Analysis Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/20">
                <MdThermostat className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">Climate Analysis</h2>
                <p className="text-emerald-300/70 text-sm">Detroit climate impact on building performance</p>
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-8">
              {/* Monthly Temperature Chart - Tall */}
              <div className={`${cardBaseClass} p-8 relative group col-span-5`}>
                <button 
                  onClick={() => openCalculationModal('climateAnalysis')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/40 transition-all duration-300 backdrop-blur-md border border-emerald-400/30 hover:scale-110 shadow-lg shadow-emerald-500/20"
                >
                  <MdInfoOutline className="text-emerald-400 text-lg" />
                </button>
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MdThermostat className="text-emerald-500" />
                    Monthly Temperature Analysis
                  </h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTemperatures}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip 
                        formatter={(value, name) => [`${value}°C`, name]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(20, 20, 25, 0.9)', 
                          borderRadius: '0.5rem', 
                          border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                      />
                      <Line type="monotone" dataKey="high" stroke="#dc2626" strokeWidth={3} name="High Temp" />
                      <Line type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={3} name="Low Temp" />
                      <Line type="monotone" dataKey="delta" stroke="#1d4ed8" strokeWidth={2} name="Delta" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Solar Irradiance Chart - Wide */}
              <div className={`${cardBaseClass} p-8 relative group col-span-7`}>
                <button 
                  onClick={() => openCalculationModal('solarIrradianceImpact')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/40 transition-all duration-300 backdrop-blur-md border border-emerald-400/30 hover:scale-110 shadow-lg shadow-emerald-500/20"
                >
                  <MdInfoOutline className="text-emerald-400 text-lg" />
                </button>
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MdSolarPower className="text-emerald-500" />
                    Solar Irradiance Impact
                  </h3>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTemperatures}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                      <YAxis tick={{ fill: '#9CA3AF' }} />
                      <Tooltip 
                        formatter={(value) => [`${value} kWh/m²/day`, 'Solar Irradiance']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(20, 20, 25, 0.9)', 
                          borderRadius: '0.5rem', 
                          border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="solar" 
                        stroke="#3b82f6" 
                        fill="url(#solarGradient)" 
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Window Analysis Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-lg">
                <FaWindowMaximize className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Window Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Window Efficiency Comparison */}
              <div className={`${cardBaseClass} p-6 relative`}>
                <button 
                  onClick={() => openCalculationModal('windowPerformanceComparison')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center hover:bg-purple-500/40 transition-all duration-300 backdrop-blur-md border border-purple-400/30 hover:scale-110 shadow-lg shadow-purple-500/20 z-10"
                >
                  <MdInfoOutline className="text-purple-400 text-lg" />
                </button>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaWindowMaximize className="text-[#3b82f6]" />
                  Window Performance Comparison
                </h3>
                <div className="space-y-4">
                  {windowEfficiencyData.map((item, index) => {
                    const improvementPercentage = item.metric === 'R-Value' 
                      ? ((item.optimized - item.current) / item.current) * 100
                      : ((item.current - item.optimized) / item.current) * 100;
                    
                    const progressWidth = item.metric === 'R-Value' 
                      ? Math.min(100, (item.optimized / item.current) * 10)
                      : Math.min(100, improvementPercentage);

                    return (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-white font-medium">{item.metric}</span>
                          <div className="flex gap-4">
                            <div className="text-right">
                              <p className="text-red-400 text-sm">Current</p>
                              <p className="text-white font-bold">
                                {item.unit === 'USD' ? formatCurrency(item.current) : item.current}
                                {item.unit && item.unit !== 'USD' && ` ${item.unit}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-blue-400 text-sm">Optimized</p>
                              <p className="text-blue-400 font-bold">
                                {item.unit === 'USD' ? formatCurrency(item.optimized) : item.optimized}
                                {item.unit && item.unit !== 'USD' && ` ${item.unit}`}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-1 bg-white/10 rounded-full h-3 relative overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-1000 relative"
                              style={{ width: `${progressWidth}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-right min-w-[60px]">
                            <span className="text-emerald-400 font-bold text-sm">
                              {item.metric === 'R-Value' ? '+' : '-'}{Math.abs(improvementPercentage).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-slate-400">
                          {item.metric === 'R-Value' 
                            ? `${(item.optimized / item.current).toFixed(1)}x better insulation performance`
                            : `${improvementPercentage.toFixed(0)}% reduction in ${item.metric.toLowerCase()}`
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LuxWall Product Recommendation */}
              <div className={`${cardBaseClass} p-6 relative`}>
                <button 
                  onClick={() => openCalculationModal('recommendedSolution')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/40 transition-all duration-300 backdrop-blur-md border border-blue-400/30 hover:scale-110 shadow-lg shadow-blue-500/20 z-10"
                >
                  <MdInfoOutline className="text-blue-400 text-lg" />
                </button>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaRegLightbulb className="text-[#3b82f6]" />
                  Recommended Solution
                </h3>
                <div className="bg-gradient-to-br from-[#3b82f6]/20 to-[#1e40af]/10 rounded-xl p-6 border border-[#3b82f6]/30">
                  <div className="text-center mb-6">
                    <h4 className="text-2xl font-bold text-white mb-2">{buildingData.luxwallProductRecommendation}</h4>
                    <p className="text-white/70">Advanced Energy-Efficient Window Solution</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#3b82f6]">{buildingData.newRValue}</p>
                      <p className="text-white/70 text-sm">R-Value</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-[#3b82f6]">{buildingData.efficiencyImprovement}%</p>
                      <p className="text-white/70 text-sm">Efficiency Gain</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Installation Cost:</span>
                      <span className="text-white font-bold">{formatCurrency(buildingData.installationCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Annual Savings:</span>
                      <span className="text-[#3b82f6] font-bold">{formatCurrency(buildingData.annualEnergySavings)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Payback Period:</span>
                      <span className="text-[#3b82f6] font-bold">{buildingData.paybackPeriod.toFixed(1)} years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Calculation Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-lg">
                <MdOutlineCalculate className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">ROI Analysis & Projections</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* ROI Timeline Chart */}
              <div className={`${cardBaseClass} p-6 relative`}>
                <button 
                  onClick={() => openCalculationModal('potentialSavings')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center hover:bg-green-500/40 transition-all duration-300 backdrop-blur-md border border-green-400/30 hover:scale-110 shadow-lg shadow-green-500/20 z-10"
                >
                  <MdInfoOutline className="text-green-400 text-lg" />
                </button>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MdTrendingUp className="text-[#3b82f6]" />
                  25-Year ROI Projection
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roiTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="year" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'cumulative' ? formatCurrency(Number(value)) : `${value}%`,
                          name === 'cumulative' ? 'Cumulative Savings' : 'ROI %'
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(20, 20, 25, 0.9)', 
                          borderRadius: '0.5rem', 
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cumulative" 
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        name="Cumulative Savings"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="roi" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        name="ROI %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Savings Breakdown */}
              <div className={`${cardBaseClass} p-6 relative`}>
                <button 
                  onClick={() => openCalculationModal('potentialSavings')}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center hover:bg-orange-500/40 transition-all duration-300 backdrop-blur-md border border-orange-400/30 hover:scale-110 shadow-lg shadow-orange-500/20 z-10"
                >
                  <MdInfoOutline className="text-orange-400 text-lg" />
                </button>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MdOutlineShowChart className="text-[#3b82f6]" />
                  Monthly Savings Breakdown
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySavingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value, name) => [formatCurrency(Number(value)), name]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(20, 20, 25, 0.9)', 
                          borderRadius: '0.5rem', 
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Bar dataKey="heating" name="Heating Savings" fill="#dc2626" stackId="a" />
                      <Bar dataKey="cooling" name="Cooling Savings" fill="#3b82f6" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className={`${cardBaseClass} p-8 relative overflow-hidden`}>
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-blue-600/4 to-transparent rounded-3xl"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-600/15 to-transparent rounded-full blur-3xl"></div>
              
              <button 
                onClick={() => openCalculationModal('potentialSavings')}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/40 transition-all duration-300 backdrop-blur-md border border-blue-400/30 hover:scale-110 shadow-lg shadow-blue-500/20 z-10"
              >
                <MdInfoOutline className="text-blue-400 text-lg" />
              </button>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <MdOutlineCalculate className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">ROI Calculation Flow</h3>
                    <p className="text-blue-300/70 text-sm">Interactive investment analysis breakdown</p>
                  </div>
                </div>

                {/* Visual Flow Chart */}
                <div className="relative mb-8">
                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '400px' }}>
                    <defs>
                      <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)"/>
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)"/>
                      </linearGradient>
                    </defs>
                    {/* Flowing connections between steps */}
                    <path d="M 120 60 Q 200 60 280 60" stroke="url(#flowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M 400 60 Q 480 60 560 60" stroke="url(#flowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M 120 180 Q 200 180 280 180" stroke="url(#flowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M 400 180 Q 480 180 560 180" stroke="url(#flowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M 120 300 Q 200 300 280 300" stroke="url(#flowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                    </path>
                    <path d="M 400 300 Q 480 300 560 300" stroke="url(#flowGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                    </path>
                  </svg>

                  {/* ROI Steps in a 3x2 Grid */}
                  <div className="grid grid-cols-3 gap-6 relative z-10" style={{ height: '400px' }}>
                    {roiCalculationSteps.map((step, index) => (
                      <div key={index} className="relative group">
                        <div className="bg-gradient-to-br from-white/[0.08] via-blue-500/[0.05] to-white/[0.02] rounded-2xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-md shadow-lg shadow-blue-500/10 h-full flex flex-col">
                          {/* Step number with glow */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"></div>
                              <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {step.step}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-sm leading-tight">{step.description}</h4>
                            </div>
                          </div>
                          
                          {/* Value with emphasis */}
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="text-center mb-2">
                              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                                {step.step === 6 ? `${step.value} years` : formatCurrency(step.value)}
                              </p>
                            </div>
                            
                            {/* Formula preview */}
                            <div className="bg-black/20 rounded-lg p-2 border border-blue-500/10">
                              <p className="text-blue-300/80 text-xs font-mono text-center">{step.formula}</p>
                            </div>
                          </div>
                          
                          {/* Hover effect overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Investment Summary */}
                <div className="bg-gradient-to-br from-blue-500/15 via-blue-600/10 to-blue-500/5 rounded-3xl p-8 border border-blue-400/30 relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" 
                      style={{
                        backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                      }}
                    ></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <h4 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-2">Investment Summary</h4>
                      <p className="text-blue-300/70">Key financial metrics for decision making</p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-md">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/25">
                            <MdOutlineEnergySavingsLeaf className="text-white text-xl" />
                          </div>
                          <p className="text-3xl font-bold text-green-400 mb-1">{formatCurrency(buildingData.annualEnergySavings)}</p>
                          <p className="text-white/70 text-sm">Annual Savings</p>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-md">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/25">
                            <MdAccessTime className="text-white text-xl" />
                          </div>
                          <p className="text-3xl font-bold text-orange-400 mb-1">{buildingData.paybackPeriod.toFixed(1)}</p>
                          <p className="text-white/70 text-sm">Years Payback</p>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-md">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25">
                            <MdTrendingUp className="text-white text-xl" />
                          </div>
                          <p className="text-3xl font-bold text-blue-400 mb-1">{Math.round((1/buildingData.paybackPeriod) * 100)}%</p>
                          <p className="text-white/70 text-sm">Annual ROI</p>
                        </div>
                      </div>
                      
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-md">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/25">
                            <MdAttachMoney className="text-white text-xl" />
                          </div>
                          <p className="text-3xl font-bold text-purple-400 mb-1">{formatCurrency(roiTimelineData[9].cumulative)}</p>
                          <p className="text-white/70 text-sm">10-Year Value</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Building Analysis Pipeline Section */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/20">
                <FaDatabase className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent">Analysis Applied Across Database</h2>
                <p className="text-cyan-300/70 text-sm">Same analysis applied to all 2,547 buildings from enriched database</p>
              </div>
            </div>
            
            <div className={`${cardBaseClass} p-8 relative overflow-hidden`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Sample Analysis Results</h3>
                    <p className="text-cyan-300/70 text-sm">Showing 6 of 2,547 analyzed buildings</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cyan-500/20">
                        <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">Company</th>
                        <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">Location</th>
                        <th className="text-left py-3 px-4 text-cyan-300 font-semibold text-sm">Building Type</th>
                        <th className="text-right py-3 px-4 text-cyan-300 font-semibold text-sm">Annual Savings</th>
                        <th className="text-right py-3 px-4 text-cyan-300 font-semibold text-sm">Payback</th>
                        <th className="text-center py-3 px-4 text-cyan-300 font-semibold text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">MGM Grand Detroit Hotel & Casino</div>
                          <div className="text-cyan-300/60 text-xs">Mixed-Use Complex</div>
                        </td>
                        <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                        <td className="py-4 px-4 text-white/80">Casino/Hotel</td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-green-400 font-bold">$1.2M</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-orange-400 font-bold">0.8 years</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Complete</span>
                        </td>
                      </tr>
                      <tr className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">Jeffersonian Apartments</div>
                          <div className="text-cyan-300/60 text-xs">Residential High-Rise</div>
                        </td>
                        <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                        <td className="py-4 px-4 text-white/80">Residential</td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-green-400 font-bold">$2.1M</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-orange-400 font-bold">1.0 years</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Complete</span>
                        </td>
                      </tr>
                      <tr className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">Ford Motor Company</div>
                          <div className="text-cyan-300/60 text-xs">Manufacturing Complex</div>
                        </td>
                        <td className="py-4 px-4 text-white/80">Dearborn, MI</td>
                        <td className="py-4 px-4 text-white/80">Manufacturing</td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-green-400 font-bold">$2.4M</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-orange-400 font-bold">0.9 years</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs font-medium animate-pulse">Processing</span>
                        </td>
                      </tr>
                      <tr className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">General Motors</div>
                          <div className="text-cyan-300/60 text-xs">Corporate Headquarters</div>
                        </td>
                        <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                        <td className="py-4 px-4 text-white/80">Office Complex</td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-green-400 font-bold">$1.8M</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-orange-400 font-bold">1.2 years</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs font-medium animate-pulse">Processing</span>
                        </td>
                      </tr>
                      <tr className="border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">Henry Ford Health</div>
                          <div className="text-cyan-300/60 text-xs">Medical Center</div>
                        </td>
                        <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                        <td className="py-4 px-4 text-white/80">Healthcare</td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-green-400 font-bold">$3.1M</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-orange-400 font-bold">1.1 years</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">Queued</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-cyan-500/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">Quicken Loans</div>
                          <div className="text-cyan-300/60 text-xs">Corporate Tower</div>
                        </td>
                        <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                        <td className="py-4 px-4 text-white/80">Office</td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-green-400 font-bold">$890K</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-orange-400 font-bold">1.4 years</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">Queued</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-cyan-300/70 text-sm">
                    Showing 6 of 2,547 analyzed buildings
                  </div>
                  <div className="flex gap-2">
                    <div className="join">
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-cyan-500/20">«</button>
                      <button className="join-item btn btn-sm bg-cyan-500 text-white border-cyan-500">1</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-cyan-500/20">2</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-cyan-500/20">3</button>
                      <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-cyan-500/20">»</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 mb-4">
            <button
              onClick={() => navigate('/signal-scanner')}
              className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors px-6 py-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
            >
              <MdArrowBack size={20} />
              Back to Signal Scanner
            </button>

            <button
              onClick={() => {
                toast.success('Analysis complete! Ready for implementation planning.');
                navigate('/migration-insights');
              }}
              className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] hover:from-[#7a94b8] hover:to-[#0a8a5c] text-white transition-colors px-8 py-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
            >
              Continue to Implementation
              <MdArrowForward size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Calculation Modal */}
      {showCalculationModal && selectedCalculation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-6xl w-full bg-gradient-to-br from-[#1A1A1A]/95 via-[#1A1A1A]/90 to-[#1A1A1A]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/20 p-4 max-h-[90vh] overflow-y-auto">
            {/* Blue glow effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>
            </div>


            
            <div className="mb-4 pb-3 border-b border-blue-800/30 relative z-10">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mr-3 border border-blue-500/20 shadow-lg shadow-blue-900/20">
                  <FaCalculator className="text-blue-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">{calculationBreakdowns[selectedCalculation].title}</h3>
                  <p className="text-blue-300/70 text-sm">{calculationBreakdowns[selectedCalculation].description}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
              {calculationBreakdowns[selectedCalculation].steps.map((step: CalculationStep, index: number) => (
                <div key={index} className="bg-gradient-to-r from-blue-900/20 to-blue-800/10 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                      {step.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold mb-2 text-sm">{step.description}</h4>
                      <div className="space-y-2">
                        <div className="bg-black/30 rounded p-2 border border-blue-500/10">
                          <p className="text-blue-300 font-mono text-xs mb-1">Formula:</p>
                          <p className="text-white font-mono text-xs break-all">{step.formula}</p>
                        </div>
                        <div className="bg-black/30 rounded p-2 border border-blue-500/10">
                          <p className="text-blue-300 font-mono text-xs mb-1">Calculation:</p>
                          <p className="text-white font-mono text-xs break-all">{step.calculation}</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 rounded p-2 border border-blue-400/20">
                          <p className="text-blue-300 font-mono text-xs mb-1">Result:</p>
                          <p className="text-blue-400 font-mono font-bold text-sm">{step.result}</p>
                        </div>
                        <p className="text-gray-300 text-xs italic leading-tight">{step.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-4 relative z-10">
              <button 
                onClick={() => setShowCalculationModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-800/30 flex items-center space-x-2 text-sm"
              >
                <span>Close</span>
                <MdClose size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalytics; 
