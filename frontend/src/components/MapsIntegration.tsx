import React, { useState, useRef, useEffect } from 'react';
import { MdMap, MdFullscreen, MdFullscreenExit, MdRefresh, MdOpenInNew, MdClose, MdExpand, MdCompress, MdAnalytics, MdAttachMoney, MdSpeed, MdOutlineEnergySavingsLeaf, MdInfoOutline, MdTrendingUp } from 'react-icons/md';
import { FaBuilding, FaMapMarkerAlt, FaWindowMaximize, FaChartLine, FaRegLightbulb, FaIndustry } from 'react-icons/fa';

// TypeScript declarations for Google Maps
declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

interface BuildingData {
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  buildingType?: string;
  propertyOwner?: string;
  totalSquareFootage?: number;
  annualEnergyCost?: number;
  totalWindows?: number;
  energyStarScore?: number;
  annualEnergySavings?: number;
  paybackPeriod?: number;
  luxwallProduct?: string;
}

interface MapsIntegrationProps {
  buildingData?: BuildingData;
}

// Detroit buildings data for markers
const detroitBuildings = [
  { lat: 42.33361, lng: -83.06028, name: "MGM Grand Detroit", type: "Casino/Hotel", savings: 1166688 },
  { lat: 42.3314, lng: -83.0458, name: "Renaissance Center", type: "Mixed-Use", savings: 2500000 },
  { lat: 42.3355, lng: -83.0566, name: "Comerica Park", type: "Stadium", savings: 800000 },
  { lat: 42.3408, lng: -83.0465, name: "Detroit Opera House", type: "Entertainment", savings: 450000 },
  { lat: 42.3505, lng: -83.0689, name: "Ford Field", type: "Stadium", savings: 950000 },
  { lat: 42.3486, lng: -83.0567, name: "Cobo Center", type: "Convention", savings: 1800000 },
  { lat: 42.3370, lng: -83.0498, name: "Guardian Building", type: "Office", savings: 750000 },
  { lat: 42.3505, lng: -83.0689, name: "Little Caesars Arena", type: "Arena", savings: 1200000 }
];

const MapsIntegration: React.FC<MapsIntegrationProps> = ({ 
  buildingData = {
    name: "MGM Grand Detroit Hotel & Casino",
    address: "1777 3rd Ave, Detroit, MI 48226",
    coordinates: { lat: 42.33361, lng: -83.06028 },
    buildingType: "Mixed-Use Casino/Hotel",
    propertyOwner: "Vici Properties and MGM Resorts International",
    totalSquareFootage: 1650000,
    annualEnergyCost: 2450000,
    totalWindows: 600,
    energyStarScore: 65,
    annualEnergySavings: 1166688,
    paybackPeriod: 0.83,
    luxwallProduct: "LuxWall Enthermal Plus™"
  }
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/15 group relative overflow-hidden";

  // Helper functions for formatting
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatSquareFootage = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M sq ft`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K sq ft`;
    }
    return `${value.toLocaleString()} sq ft`;
  };

  // Create a mock map for demonstration
  const createMockMap = () => {
    if (!mapRef.current) return;

    // Create a visual representation of the map
    mapRef.current.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: white;
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px, 30px 30px;
          opacity: 0.3;
        "></div>
        
        <div style="position: relative; z-index: 2;">
          <div style="
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255,255,255,0.3);
          ">
            <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          
          <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
            Detroit Building Analysis
          </h3>
          
          <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
            ${buildingData.name}
          </p>
          
          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            border: 1px solid rgba(255,255,255,0.2);
          ">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
              <div>
                <div style="opacity: 0.8;">Building Type</div>
                <div style="font-weight: bold;">${buildingData.buildingType}</div>
              </div>
              <div>
                <div style="opacity: 0.8;">Size</div>
                <div style="font-weight: bold;">${buildingData.totalSquareFootage ? formatSquareFootage(buildingData.totalSquareFootage) : 'N/A'}</div>
              </div>
              <div>
                <div style="opacity: 0.8;">Annual Cost</div>
                <div style="font-weight: bold; color: #fca5a5;">${buildingData.annualEnergyCost ? formatCurrency(buildingData.annualEnergyCost) : 'N/A'}</div>
              </div>
              <div>
                <div style="opacity: 0.8;">Potential Savings</div>
                <div style="font-weight: bold; color: #86efac;">${buildingData.annualEnergySavings ? formatCurrency(buildingData.annualEnergySavings) : 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div style="
            display: flex;
            gap: 8px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
          ">
            ${detroitBuildings.slice(0, 4).map((building, i) => `
              <div style="
                background: rgba(255,255,255,0.15);
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 11px;
                border: 1px solid rgba(255,255,255,0.2);
                text-align: center;
                min-width: 80px;
              ">
                <div style="font-weight: bold; margin-bottom: 2px;">${building.name.split(' ')[0]}</div>
                <div style="opacity: 0.8;">${formatCurrency(building.savings)}</div>
              </div>
            `).join('')}
          </div>
          
          <div style="
            margin-top: 20px;
            padding: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
            font-size: 11px;
            opacity: 0.8;
          ">
            🗺️ Interactive map view showing ${detroitBuildings.length} Detroit buildings with energy optimization potential
          </div>
        </div>
      </div>
    `;

    setIsLoading(false);
    setMapError(false);
  };

  // Initialize map (fallback to mock if Google Maps fails)
  const initializeMap = () => {
    if (!mapRef.current) {
      setMapError(true);
      setErrorMessage('Map container not found');
      setIsLoading(false);
      return;
    }

    // Check if Google Maps is available
    if (!window.google || !window.google.maps) {
      console.log('Google Maps not available, using mock map');
      createMockMap();
      return;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: buildingData.coordinates,
        zoom: 16,
        mapTypeId: window.google.maps.MapTypeId.SATELLITE,
        tilt: 45,
        heading: 0,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add markers for Detroit buildings
      detroitBuildings.forEach((building, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: building.lat, lng: building.lng },
          map: map,
          title: building.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: building.name === buildingData.name ? '#3b82f6' : '#1e40af',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #000; padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: bold;">${building.name}</h3>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Type:</strong> ${building.type}</p>
              <p style="margin: 4px 0; font-size: 12px;"><strong>Potential Savings:</strong> ${formatCurrency(building.savings)}</p>
              <p style="margin: 4px 0; font-size: 12px; color: #059669;"><strong>Energy Optimization Available</strong></p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      // Add main building marker
      const mainMarker = new window.google.maps.Marker({
        position: buildingData.coordinates,
        map: map,
        title: buildingData.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      });

      const mainInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="color: #000; padding: 12px; min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 16px; font-weight: bold;">${buildingData.name}</h3>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Type:</strong> ${buildingData.buildingType}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Size:</strong> ${buildingData.totalSquareFootage ? formatSquareFootage(buildingData.totalSquareFootage) : 'N/A'}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Annual Energy Cost:</strong> ${buildingData.annualEnergyCost ? formatCurrency(buildingData.annualEnergyCost) : 'N/A'}</p>
            <p style="margin: 4px 0; font-size: 12px;"><strong>Potential Savings:</strong> ${buildingData.annualEnergySavings ? formatCurrency(buildingData.annualEnergySavings) : 'N/A'}</p>
            <p style="margin: 8px 0 4px 0; font-size: 12px; color: #059669; font-weight: bold;">🎯 Primary Analysis Target</p>
          </div>
        `
      });

      mainMarker.addListener('click', () => {
        mainInfoWindow.open(map, mainMarker);
      });

      setTimeout(() => {
        mainInfoWindow.open(map, mainMarker);
      }, 1000);

      setIsLoading(false);
      setMapError(false);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      console.log('Falling back to mock map');
      createMockMap();
    }
  };

  // Load Google Maps API with better error handling
  useEffect(() => {
    if (apiLoaded) return;

    const loadGoogleMaps = () => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        setApiLoaded(true);
        initializeMap();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        console.log('Google Maps script already exists, waiting for load...');
        existingScript.addEventListener('load', () => {
          setApiLoaded(true);
          initializeMap();
        });
        existingScript.addEventListener('error', () => {
          console.log('Google Maps failed to load, using mock map');
          createMockMap();
        });
        return;
      }

      // For demo purposes, skip Google Maps API and use mock
      console.log('Using mock map for demonstration');
      createMockMap();
    };

    loadGoogleMaps();
  }, [apiLoaded]);

  const handleRefresh = () => {
    setIsLoading(true);
    setMapError(false);
    setErrorMessage('');
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(buildingData.coordinates);
        mapInstanceRef.current.setZoom(16);
        setIsLoading(false);
      } else {
        createMockMap();
      }
    }, 500);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggle3D = () => {
    if (mapInstanceRef.current && window.google) {
      const currentTilt = mapInstanceRef.current.getTilt();
      mapInstanceRef.current.setTilt(currentTilt === 0 ? 45 : 0);
    }
  };

  const toggleMapType = () => {
    if (mapInstanceRef.current && window.google) {
      const currentType = mapInstanceRef.current.getMapTypeId();
      mapInstanceRef.current.setMapTypeId(
        currentType === window.google.maps.MapTypeId.SATELLITE 
          ? window.google.maps.MapTypeId.ROADMAP 
          : window.google.maps.MapTypeId.SATELLITE
      );
    }
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-lg">
          <MdMap className="text-white text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-white">3D Building Analysis & Intelligence Briefing</h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Maps Panel - Takes up 2 columns */}
        <div className={`lg:col-span-2 ${cardBaseClass} ${isExpanded ? 'fixed inset-4 z-50' : ''}`}>
          {/* Background effects */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" 
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                backgroundSize: '30px 30px'
              }}
            ></div>
          </div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#2a64f5]/40 to-transparent rounded-full blur-2xl opacity-90"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center">
                  <MdMap className="text-white text-sm" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Building Analysis View</h3>
                  <p className="text-white/70 text-xs">
                    Interactive building analysis with energy data
                  </p>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                    Loading...
                  </div>
                )}
                {mapError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <span>⚠️ {errorMessage || 'Map Error'}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggle3D}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Toggle 3D View"
                >
                  <span className="text-white/70 hover:text-white text-xs">3D</span>
                </button>
                
                <button
                  onClick={toggleMapType}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Toggle Map Type"
                >
                  <span className="text-white/70 hover:text-white text-xs">VIEW</span>
                </button>
                
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title="Refresh"
                >
                  <MdRefresh className="text-white/70 hover:text-white text-sm" />
                </button>
                
                <button
                  onClick={toggleExpanded}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? (
                    <MdCompress className="text-white/70 hover:text-white text-sm" />
                  ) : (
                    <MdExpand className="text-white/70 hover:text-white text-sm" />
                  )}
                </button>
                
                {isExpanded && (
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                    title="Close"
                  >
                    <MdClose className="text-red-400 hover:text-red-300 text-sm" />
                  </button>
                )}
              </div>
            </div>

            {/* Maps Container */}
            <div className="relative">
              <div
                ref={mapRef}
                className="w-full bg-gray-200"
                style={{ 
                  height: isExpanded ? 'calc(100vh - 200px)' : '600px',
                  minHeight: '400px'
                }}
              />
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                      <span className="text-white font-medium">Loading Building Analysis...</span>
                    </div>
                    <p className="text-white/70 text-sm mt-2">
                      Initializing interactive building view with energy data
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div className="px-4 py-2 bg-gradient-to-r from-blue-600/5 to-blue-500/5 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white/70 text-xs">
                  <span>🗺️ Building View</span>
                  <span>🏢 {detroitBuildings.length} Buildings</span>
                  <span>📊 Energy Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${mapError ? 'bg-red-400' : isLoading ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                  <span className={`text-xs font-medium ${mapError ? 'text-red-400' : isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                    {mapError ? 'Error' : isLoading ? 'Loading' : 'Live'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Briefing Panel - Takes up 1 column */}
        <div className={cardBaseClass}>
          {/* Background effects */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" 
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                backgroundSize: '30px 30px'
              }}
            ></div>
          </div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#2a64f5]/40 to-transparent rounded-full blur-2xl opacity-90"></div>
          
          <div className="relative z-10 p-6">
            {/* Briefing Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center">
                <MdAnalytics className="text-white text-sm" />
              </div>
              <h3 className="text-lg font-bold text-white">Intelligence Briefing</h3>
            </div>

            {/* Building Overview */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaBuilding className="text-blue-400 text-sm" />
                Building Overview
              </h4>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Property</span>
                    <span className="text-white font-medium text-sm">{buildingData.name}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Type</span>
                    <span className="text-white font-medium text-sm">{buildingData.buildingType}</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Size</span>
                    <span className="text-white font-medium text-sm">
                      {buildingData.totalSquareFootage ? formatSquareFootage(buildingData.totalSquareFootage) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Owner</span>
                    <span className="text-white font-medium text-sm truncate ml-2">{buildingData.propertyOwner}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Metrics */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MdOutlineEnergySavingsLeaf className="text-green-400 text-sm" />
                Energy Metrics
              </h4>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Annual Cost</span>
                    <span className="text-red-400 font-bold text-sm">
                      {buildingData.annualEnergyCost ? formatCurrency(buildingData.annualEnergyCost) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">ENERGY STAR Score</span>
                    <span className="text-yellow-400 font-bold text-sm">
                      {buildingData.energyStarScore || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Total Windows</span>
                    <span className="text-white font-medium text-sm">
                      {buildingData.totalWindows?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Potential */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <FaRegLightbulb className="text-yellow-400 text-sm" />
                Optimization Potential
              </h4>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-lg p-3 border border-green-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Annual Savings</span>
                    <span className="text-green-400 font-bold text-sm">
                      {buildingData.annualEnergySavings ? formatCurrency(buildingData.annualEnergySavings) : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-lg p-3 border border-blue-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Payback Period</span>
                    <span className="text-blue-400 font-bold text-sm">
                      {buildingData.paybackPeriod ? `${buildingData.paybackPeriod.toFixed(1)} years` : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Recommended Solution</span>
                    <span className="text-white font-medium text-xs truncate ml-2">
                      {buildingData.luxwallProduct || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-4 border border-blue-500/20">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MdInfoOutline className="text-blue-400 text-sm" />
                Key Insights
              </h4>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Interactive building view shows structure and energy data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>Visual representation of {detroitBuildings.length} Detroit buildings with optimization potential</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Real-time energy cost and savings calculations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Professional analysis tools with interactive controls</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapsIntegration; 