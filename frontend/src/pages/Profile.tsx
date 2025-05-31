import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { MdBusiness, MdLocationOn, MdOutlineEmail, MdOutlinePhone, MdStorage, MdCloud, MdSecurity, MdSettings, MdAnalytics, MdCode, MdZoomIn, MdZoomOut, MdFactory, MdAttachMoney, MdTrendingUp, MdWindow, MdScience, MdOpenInNew } from 'react-icons/md';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoPath } from "d3-geo";
import { 
  luxwallCompanyData, 
  regions, 
  findCountryRegion, 
  isInSelectedRegions,
  handleRegionToggle as regionToggle,
  handleCountryToggle as countryToggle,
  handleStateChange as stateChange
} from '../utils/profileHelpers';

// Use a more reliable hosted GeoJSON source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Profile = () => {
  const navigate = useNavigate();
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["North America"]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>(luxwallCompanyData.products[0].name);
  const [tooltipContent, setTooltipContent] = useState("");
  const [position, setPosition] = useState<{ coordinates: [number, number], zoom: number }>({
    coordinates: [0, 20],
    zoom: 1
  });
  const [hoveredCountry, setHoveredCountry] = useState("");
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [showStateSelect, setShowStateSelect] = useState(false);
  const [showRegionSelect, setShowRegionSelect] = useState(true);
  const [showProductSelect, setShowProductSelect] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    companyInfo: true, // Keep company info always expanded
    technology: false,
    products: false,
    regions: false,
    performance: false,
    markets: false,
    manufacturing: false,
    certifications: false
  });

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Log when the component mounts
  useEffect(() => {
    console.log("Profile component mounted");
    console.log("Using GeoJSON URL:", geoUrl);
    
    // Try to fetch the GeoJSON to verify it works
    fetch(geoUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch map data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("GeoJSON data loaded successfully");
      })
      .catch(error => {
        console.error("Error loading GeoJSON:", error);
        setMapError(error.message);
      });
  }, []);

  // Calculate optimal map position and zoom when selected regions change
  useEffect(() => {
    if (selectedRegions.length === 0) return;
    
    if (selectedRegions.length === 1) {
      // If only one region, use its center and zoom
      const region = selectedRegions[0];
      setPosition({
        coordinates: regions[region].center,
        zoom: regions[region].zoom
      });
    } else {
      // For multiple regions, calculate a centered view that includes all
      // This is a simplified approach - ideally would calculate actual bounding box
      setPosition({
        coordinates: [0, 20], // World centered view
        zoom: selectedRegions.length > 3 ? 1 : 1.5 // Zoom out more when more regions are selected
      });
    }
  }, [selectedRegions]);

  // Helper functions for handling user interactions
  const handleRegionToggle = (region: string) => {
    regionToggle(region, selectedRegions, setSelectedRegions);
  };

  const handleCountryToggle = (country: string) => {
    countryToggle(country, selectedCountries, setSelectedCountries);
  };

  const handleStateChange = (state: string) => {
    stateChange(state, setSelectedState);
  };

  // Check if a country is in selected regions
  const isInSelectedRegions = (countryName: string): boolean => {
    return selectedRegions.some(region => 
      regions[region].countries.includes(countryName)
    );
  };

  // Get selected product details
  const getSelectedProduct = () => {
    return luxwallCompanyData.products.find(product => product.name === selectedProduct) || luxwallCompanyData.products[0];
  };

  return (
    <div className="w-full px-24 py-12 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <div className="bg-gradient-to-br from-[#2a64f5] via-[#2a64f5] to-[#7a94b8] p-4 rounded-xl shadow-lg shadow-[#2a64f5]/20">
            <img 
              src="/images/Luxwall/Luxwall_Black_Horizontal_Tag-300x69.png" 
              alt="Luxwall Logo" 
              className="w-24 h-auto object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">Company Profile</h2>
        </div>
        <button
          onClick={() => navigate('/profile/edit')}
          className="btn bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white border-none hover:shadow-lg hover:shadow-blue-500/20"
        >
          <HiOutlinePencil className="text-lg" /> Edit Profile
        </button>
      </div>

      {/* Main Content with Centered Map */}
      <div className="relative w-full min-h-[1200px] flex items-start justify-center pt-4">
        {/* Central Interactive Map - Larger size */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-0">
          <div ref={mapRef} className="relative w-[1100px] h-[1100px] bg-[#020305]/50 backdrop-blur-md rounded-full">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Fallback div to ensure some content is visible */}
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-blue-500/50 p-4 text-center">
                {mapError && (
                  <div className="text-red-400 text-sm max-w-md">
                    Error loading map: {mapError}
                  </div>
                )}
              </div>
              
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 150,
                  center: [0, 0]
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent"
                }}
              >
                <ZoomableGroup
                  center={position.coordinates}
                  zoom={position.zoom}
                  onMoveEnd={(position) => setPosition(position)}
                  maxZoom={8}
                  minZoom={1}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        // For world-atlas TopoJSON format
                        const countryName = geo.properties.name || "";
                        const countryRegion = findCountryRegion(countryName);
                        const isSelected = selectedCountries.includes(countryName) || 
                                         (selectedCountries.length === 0 && isInSelectedRegions(countryName));
                        const fillColor = countryRegion 
                          ? regions[countryRegion].color 
                          : "#2A2A2A";
                        const isHovered = hoveredCountry === countryName;

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => countryRegion && handleCountryToggle(countryName)}
                            onMouseEnter={() => {
                              setTooltipContent(countryName);
                              setHoveredCountry(countryName);
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("");
                              setHoveredCountry("");
                            }}
                            style={{
                              default: {
                                fill: isSelected ? fillColor : "#2A2A2A",
                                stroke: "#1A1A1A",
                                strokeWidth: 0.5,
                                outline: "none",
                                opacity: countryRegion ? (isSelected ? 1 : 0.3) : 0.2
                              },
                              hover: {
                                fill: countryRegion ? fillColor : "#3A3A3A",
                                stroke: "#1A1A1A",
                                strokeWidth: 0.5,
                                outline: "none",
                                opacity: 1,
                                cursor: countryRegion ? "pointer" : "default"
                              },
                              pressed: {
                                fill: countryRegion ? fillColor : "#3A3A3A",
                                stroke: "#1A1A1A",
                                strokeWidth: 0.5,
                                outline: "none"
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </div>
            

            
            {/* Map tooltip */}
            {tooltipContent && (
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-[#28292b]/80 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm pointer-events-none border border-blue-500/20">
                {tooltipContent}
              </div>
            )}
            
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020305]/10 to-[#020305] opacity-30 pointer-events-none"></div>
          </div>
        </div>

        {/* Content Layout Container */}
        <div className="relative w-full h-full z-10 grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-1 space-y-6">
            {/* Company Info Card */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdBusiness className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white">{luxwallCompanyData.companyInfo.name}</h3>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <MdLocationOn className="text-blue-400" />
                  <span className="text-white/80">{luxwallCompanyData.companyInfo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlinePhone className="text-blue-400" />
                  <span className="text-white/80">{luxwallCompanyData.companyInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineEmail className="text-blue-400" />
                  <span className="text-white/80">{luxwallCompanyData.companyInfo.email}</span>
                </div>
                <div className="text-white/80 mt-2">
                  <span className="text-white/60">Website:</span>
                  <span className="ml-2">{luxwallCompanyData.companyInfo.website}</span>
                </div>
                <div className="text-white/80 mt-2">
                  <span className="text-white/60">Founded:</span>
                  <span className="ml-2">{luxwallCompanyData.companyInfo.founded} by {luxwallCompanyData.companyInfo.founder}</span>
                </div>
              </div>
            </div>

            {/* Technology */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-blue-500/5 p-2 rounded-lg transition-all duration-200"
                onClick={() => toggleSection('technology')}
              >
                <MdScience className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white flex-1">Technology</h3>
                <svg 
                  className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${expandedSections.technology ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {!expandedSections.technology && (
                <div className="text-sm text-white/70 px-2">
                  {luxwallCompanyData.technology.flagship} - Advanced electrochromic smart glass technology
                </div>
              )}
              
              {expandedSections.technology && (
                <div className="text-sm space-y-2 mb-4 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                  <div className="font-semibold text-white">{luxwallCompanyData.technology.flagship}</div>
                  <div className="text-white/80 text-xs">{luxwallCompanyData.technology.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {luxwallCompanyData.technology.keyFeatures.map((feature, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-blue-500/5 p-2 rounded-lg transition-all duration-200"
                onClick={() => toggleSection('products')}
              >
                <MdWindow className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white flex-1">Products</h3>
                <svg 
                  className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${expandedSections.products ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {!expandedSections.products && (
                <div className="text-sm text-white/70 px-2">
                  {getSelectedProduct().name} - {luxwallCompanyData.products.length} products available
                </div>
              )}
              
              {expandedSections.products && (
                <>
                  {/* Selected product display */}
                  <div className="text-sm space-y-2 mb-4 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white">Selected Product</div>
                      <button
                        onClick={() => window.open(getSelectedProduct().documentationUrl, '_blank')}
                        className="btn btn-xs bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-blue-700/20 text-blue-300 border border-blue-500/20 hover:bg-blue-500/30 transition-all duration-200"
                        title="View Product Documentation"
                      >
                        <MdOpenInNew className="text-sm" />
                        Docs
                      </button>
                    </div>
                    <div className="text-blue-300 text-sm">{getSelectedProduct().name}</div>
                    <div className="text-white/80 text-xs">{getSelectedProduct().description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getSelectedProduct().features.map((feature, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Product Selection */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowProductSelect(!showProductSelect)}
                      className="w-full px-3 py-2 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20 transition-all hover:bg-blue-500/20 flex justify-between items-center"
                    >
                      <span className="text-sm font-medium">Select Product</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${showProductSelect ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {showProductSelect && (
                      <div className="mt-2 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10 max-h-64 overflow-y-auto">
                        <div className="space-y-2">
                          {luxwallCompanyData.products.map((product) => (
                            <div
                              key={product.name}
                              className="group relative"
                            >
                              <div className="flex items-center gap-2">
                                <label 
                                  className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-lg hover:bg-blue-500/10 transition-all duration-200 border border-transparent hover:border-blue-500/20 flex-1"
                                  title={product.detailedDescription}
                                >
                                  <input 
                                    type="radio" 
                                    className="radio radio-xs radio-success bg-[#28292b]/60" 
                                    checked={selectedProduct === product.name}
                                    onChange={() => setSelectedProduct(product.name)}
                                    name="product-selection"
                                  />
                                  <div className="text-2xl">{product.icon}</div>
                                  <div className="flex-1">
                                    <div className="text-white/80 text-sm font-medium">{product.name}</div>
                                    <div className="text-white/60 text-xs mt-1">{product.description}</div>
                                  </div>
                                </label>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(product.documentationUrl, '_blank');
                                  }}
                                  className="btn btn-xs bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-blue-700/20 text-blue-300 border border-blue-500/20 hover:bg-blue-500/30 transition-all duration-200"
                                  title="View Documentation"
                                >
                                  <MdOpenInNew className="text-xs" />
                                </button>
                              </div>
                              
                              {/* Hover tooltip */}
                              <div className="absolute left-full top-0 ml-2 w-64 bg-[#28292b]/95 backdrop-blur-md rounded-lg p-3 border border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <div className="text-white font-medium text-sm mb-2">{product.name}</div>
                                <div className="text-white/80 text-xs mb-3">{product.detailedDescription}</div>
                                <div className="space-y-1">
                                  {Object.entries(product.specifications).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-xs">
                                      <span className="text-blue-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span className="text-white/80">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Global Regions - Keep exactly as it is */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-blue-500/5 p-2 rounded-lg transition-all duration-200"
                onClick={() => toggleSection('regions')}
              >
                <MdStorage className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white flex-1">Regions You Operate In</h3>
                <svg 
                  className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${expandedSections.regions ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {!expandedSections.regions && (
                <div className="text-sm text-white/70 px-2">
                  {selectedRegions.length} regions selected{selectedCountries.length > 0 && `, ${selectedCountries.length} countries`}
                </div>
              )}
              
              {expandedSections.regions && (
                <>
                  {/* Selected regions display */}
                  <div className="text-sm space-y-2 mb-4 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                    <div className="font-semibold text-white">Selected Regions</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedRegions.map((region) => (
                        <span 
                          key={region} 
                          className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20 flex items-center gap-1"
                        >
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ 
                              backgroundColor: regions[region].color,
                              boxShadow: `0 0 6px ${regions[region].color}`
                            }}
                          />
                          {region}
                        </span>
                      ))}
                      {selectedRegions.length === 0 && (
                        <span className="text-white/60 text-xs">No regions selected</span>
                      )}
                    </div>
                  </div>

                  {/* Region Selection - dropdown style matching countries */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowRegionSelect(!showRegionSelect)}
                      className="w-full px-3 py-2 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20 transition-all hover:bg-blue-500/20 flex justify-between items-center"
                    >
                      <span className="text-sm font-medium">Select Regions</span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${showRegionSelect ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    
                    {showRegionSelect && (
                      <div className="mt-2 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10 max-h-48 overflow-y-auto">
                        <div className="space-y-1">
                          {Object.keys(regions).map((region) => (
                            <label 
                              key={region} 
                              className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-blue-500/10"
                            >
                              <input 
                                type="checkbox" 
                                className="checkbox checkbox-xs checkbox-success bg-[#28292b]/60" 
                                checked={selectedRegions.includes(region)}
                                onChange={() => handleRegionToggle(region)}
                              />
                              <span className="text-white/80 text-sm">{region}</span>
                              <div 
                                className="ml-auto w-3 h-3 rounded-full" 
                                style={{ 
                                  backgroundColor: regions[region].color,
                                  boxShadow: selectedRegions.includes(region) ? `0 0 8px ${regions[region].color}` : 'none'
                                }}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected countries display */}
                  {selectedRegions.length > 0 && (
                    <div className="text-sm space-y-2 mt-4 pt-4 border-t border-blue-500/10 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                      <div className="font-semibold text-white">Selected Countries</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedCountries.length > 0 ? (
                          selectedCountries.map((country) => {
                            const countryRegion = findCountryRegion(country);
                            return (
                              <span 
                                key={country} 
                                className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20 flex items-center gap-1"
                              >
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ 
                                    backgroundColor: countryRegion ? regions[countryRegion].color : "#10B981",
                                    boxShadow: `0 0 6px ${countryRegion ? regions[countryRegion].color : "#10B981"}`
                                  }}
                                />
                                {country}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-white/60 text-xs">No countries selected</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Country Selection - toggle dropdown */}
                  {selectedRegions.length > 0 && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowCountrySelect(!showCountrySelect)}
                        className="w-full px-3 py-2 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20 transition-all hover:bg-blue-500/20 flex justify-between items-center"
                      >
                        <span className="text-sm font-medium">Select Countries</span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${showCountrySelect ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      
                      {showCountrySelect && (
                        <div className="mt-2 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10 max-h-48 overflow-y-auto">
                          <div className="space-y-1">
                            {selectedRegions.flatMap(regionName => 
                              regions[regionName].countries.map((country) => (
                                <label 
                                  key={`${regionName}-${country}`} 
                                  className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-blue-500/10"
                                >
                                  <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-xs checkbox-success bg-[#28292b]/60" 
                                    checked={selectedCountries.includes(country)}
                                    onChange={() => handleCountryToggle(country)}
                                  />
                                  <span className="text-white/80 text-sm">{country}</span>
                                  <div 
                                    className="ml-auto w-2 h-2 rounded-full" 
                                    style={{ 
                                      backgroundColor: regions[findCountryRegion(country) || ""].color,
                                      boxShadow: selectedCountries.includes(country) ? `0 0 6px ${regions[findCountryRegion(country) || ""].color}` : 'none'
                                    }}
                                  />
                                </label>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* State Selection - only for USA/UK */}
                  {selectedCountries.some(c => c === "United States of America" || c === "United Kingdom") && (
                    <div className="mt-3">
                      <button
                        onClick={() => setShowStateSelect(!showStateSelect)}
                        className="w-full px-3 py-2 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20 transition-all hover:bg-blue-500/20 flex justify-between items-center"
                      >
                        <span className="text-sm font-medium">Select States/Regions</span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${showStateSelect ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      
                      {showStateSelect && (
                        <div className="mt-2 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10 max-h-48 overflow-y-auto">
                          {selectedCountries.includes("United States of America") && (
                            <div>
                              <div className="font-medium text-white/80 mb-1 text-sm">United States of America</div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"].map((state) => (
                                  <div key={state} className="flex items-center">
                                    <label 
                                      className="flex items-center gap-2 cursor-pointer py-1 text-xs"
                                    >
                                      <input 
                                        type="radio" 
                                        className="radio radio-xs radio-success" 
                                        checked={selectedState === state}
                                        onChange={() => handleStateChange(state)}
                                        name="us-state"
                                      />
                                      <span className="text-white/80 text-xs">{state}</span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {selectedCountries.includes("United Kingdom") && (
                            <div className={selectedCountries.includes("United States of America") ? "mt-3" : ""}>
                              <div className="font-medium text-white/80 mb-1 text-sm">United Kingdom</div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {["England", "Scotland", "Wales", "Northern Ireland"].map((region) => (
                                  <div key={region} className="flex items-center">
                                    <label 
                                      className="flex items-center gap-2 cursor-pointer py-1 text-xs"
                                    >
                                      <input 
                                        type="radio" 
                                        className="radio radio-xs radio-success" 
                                        checked={selectedState === region}
                                        onChange={() => handleStateChange(region)}
                                        name="uk-region"
                                      />
                                      <span className="text-white/80 text-xs">{region}</span>
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Center Column - Empty for Map */}
          <div className="col-span-1"></div>

          {/* Right Column */}
          <div className="col-span-1 space-y-6">
            {/* Performance Metrics */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-blue-500/5 p-2 rounded-lg transition-all duration-200"
                onClick={() => toggleSection('performance')}
              >
                <MdTrendingUp className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white flex-1">Performance</h3>
                <svg 
                  className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${expandedSections.performance ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {!expandedSections.performance && (
                <div className="text-sm text-white/70 px-2">
                  {luxwallCompanyData.performance.energyCostReduction} energy reduction • {luxwallCompanyData.performance.averageROI} ROI
                </div>
              )}
              
              {expandedSections.performance && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-white/60 text-sm">Energy Reduction</p>
                    <p className="text-xl font-bold text-white">{luxwallCompanyData.performance.energyCostReduction}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Window Savings</p>
                    <p className="text-xl font-bold text-white">{luxwallCompanyData.performance.windowEnergyReduction}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Average ROI</p>
                    <p className="text-xl font-bold text-white">{luxwallCompanyData.performance.averageROI}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Fast ROI</p>
                    <p className="text-xl font-bold text-white">{luxwallCompanyData.performance.fastROI}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Target Markets */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div 
                className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-blue-500/5 p-2 rounded-lg transition-all duration-200"
                onClick={() => toggleSection('markets')}
              >
                <MdSettings className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white flex-1">Target Markets</h3>
                <svg 
                  className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${expandedSections.markets ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {!expandedSections.markets && (
                <div className="text-sm text-white/70 px-2">
                  {luxwallCompanyData.markets.primary.length} primary markets • Buildings {luxwallCompanyData.markets.buildingRequirements.optimalHeight}
                </div>
              )}
              
              {expandedSections.markets && (
                <>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {luxwallCompanyData.markets.primary.map((market, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded text-xs border border-blue-500/20">
                        {market}
                      </span>
                    ))}
                  </div>
                  
                  {/* Building Requirements */}
                  <div className="mt-6 pt-6 border-t border-blue-500/10">
                    <div className="flex items-center gap-3 mb-4">
                      <MdBusiness className="text-2xl text-blue-500" />
                      <h3 className="text-lg font-semibold text-white">Building Requirements</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                        <span className="text-white/90 font-medium">Optimal Height:</span>
                        <span className="text-white/80 ml-2">{luxwallCompanyData.markets.buildingRequirements.optimalHeight}</span>
                      </div>
                      <div className="text-sm bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                        <span className="text-white/90 font-medium">Window-Wall Ratio:</span>
                        <span className="text-white/80 ml-2">{luxwallCompanyData.markets.buildingRequirements.windowWallRatio}</span>
                      </div>
                      <div className="text-sm bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                        <span className="text-white/90 font-medium">Building Age:</span>
                        <span className="text-white/80 ml-2">{luxwallCompanyData.markets.buildingRequirements.buildingAge}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Manufacturing & Funding */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-blue-500/5 p-2 rounded-lg transition-all duration-200"
                onClick={() => toggleSection('manufacturing')}
              >
                <MdFactory className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white flex-1">Manufacturing</h3>
                <svg 
                  className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${expandedSections.manufacturing ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {!expandedSections.manufacturing && (
                <div className="text-sm text-white/70 px-2">
                  {luxwallCompanyData.manufacturing.facilities.length} facilities • {luxwallCompanyData.funding.seriesB} Series B
                </div>
              )}
              
              {expandedSections.manufacturing && (
                <>
                  <div>
                    {luxwallCompanyData.manufacturing.facilities.map((facility, index) => (
                      <div key={index} className="text-sm space-y-2 mb-4 last:mb-0 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                        <div className="font-semibold text-white">{facility.location}</div>
                        <div className="text-white/80 text-xs">Status: {facility.status}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {facility.investment && (
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20">
                              Investment: {facility.investment}
                            </span>
                          )}
                          {facility.funding && (
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20">
                              Funding: {facility.funding}
                            </span>
                          )}
                          {facility.jobs && (
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20">
                              Jobs: {facility.jobs}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Funding section */}
                  <div className="mt-6 pt-6 border-t border-blue-500/10">
                    <div className="flex items-center gap-3 mb-4">
                      <MdAttachMoney className="text-2xl text-blue-500" />
                      <h3 className="text-lg font-semibold text-white">Funding</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                        <span className="text-white/90 font-medium">Series B:</span>
                        <span className="text-white/80 ml-2">{luxwallCompanyData.funding.seriesB}</span>
                      </div>
                      <div className="text-sm bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                        <span className="text-white/90 font-medium">Valuation:</span>
                        <span className="text-white/80 ml-2">{luxwallCompanyData.funding.valuation}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {luxwallCompanyData.funding.keyInvestors.map((investor, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 rounded-sm text-xs border border-blue-500/20">
                            {investor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Certifications & Partnerships */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-blue-500/15 p-4">
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-blue-500/5 p-2 rounded-lg transition-all duration-200"
                onClick={() => toggleSection('certifications')}
              >
                <MdSecurity className="text-2xl text-blue-500" />
                <h3 className="text-lg font-semibold text-white flex-1">Certifications</h3>
                <svg 
                  className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${expandedSections.certifications ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {!expandedSections.certifications && (
                <div className="text-sm text-white/70 px-2">
                  {luxwallCompanyData.certifications.length} certifications • {luxwallCompanyData.partnerships.length} partnerships
                </div>
              )}
              
              {expandedSections.certifications && (
                <>
                  <div>
                    {luxwallCompanyData.certifications.map((cert, index) => (
                      <div key={index} className="text-sm mb-3 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                        <span className="text-white/90">{cert}</span>
                      </div>
                    ))}
                  </div>

                  {/* Partnerships section */}
                  <div className="mt-6 pt-6 border-t border-blue-500/10">
                    <div className="flex items-center gap-3 mb-4">
                      <MdCloud className="text-2xl text-blue-500" />
                      <h3 className="text-lg font-semibold text-white">Partnerships</h3>
                    </div>
                    <div>
                      {luxwallCompanyData.partnerships.map((partnership, index) => (
                        <div key={index} className="text-sm mb-3 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-blue-500/10">
                          <span className="text-white/90">{partnership}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
