import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineTrash, HiPlus, HiXMark } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { MdBusiness, MdLocationOn, MdOutlineEmail, MdOutlinePhone, MdStorage, MdCloud, MdSecurity, MdSettings, MdAnalytics, MdCode, MdSave, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoPath } from "d3-geo";

// Use a more reliable hosted GeoJSON source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map of regions with countries and colors (adjusted green shades for more contrast)
const regions: Record<string, { 
  countries: string[], 
  color: string, 
  center: [number, number], 
  zoom: number 
}> = {
  "North America": { 
    countries: ["United States of America", "Canada", "Mexico", "Guatemala", "Honduras", "Nicaragua", "Costa Rica", "Panama", "Belize", "El Salvador"], 
    color: "#047857", // emerald-700 - darker green
    center: [-100, 45],
    zoom: 2
  },
  "South America": {
    countries: ["Brazil", "Argentina", "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Bolivia", "Paraguay", "Uruguay", "Guyana", "Suriname"],
    color: "#10B981", // emerald-500 - medium green
    center: [-60, -20],
    zoom: 2
  },
  "Western Europe": { 
    countries: ["United Kingdom", "Germany", "France", "Italy", "Spain", "Portugal", "Switzerland", "Netherlands", "Belgium", "Austria", "Ireland", "Denmark", "Norway", "Sweden", "Finland", "Iceland"], 
    color: "#34D399", // emerald-400 - light green
    center: [10, 50],
    zoom: 3
  },
  "Eastern Europe": {
    countries: ["Poland", "Ukraine", "Romania", "Czech Republic", "Hungary", "Belarus", "Bulgaria", "Slovakia", "Moldova", "Croatia", "Lithuania", "Latvia", "Estonia", "Slovenia", "Bosnia and Herzegovina", "Albania", "North Macedonia", "Montenegro", "Serbia"],
    color: "#6EE7B7", // emerald-300 - lighter green
    center: [25, 50],
    zoom: 3
  },
  "Middle East": { 
    countries: ["Turkey", "Saudi Arabia", "Iran", "Israel", "United Arab Emirates", "Qatar", "Kuwait", "Oman", "Lebanon", "Jordan", "Iraq", "Syria", "Yemen", "Bahrain", "Cyprus"], 
    color: "#065F46", // emerald-800 - darkest green
    center: [45, 30],
    zoom: 3
  },
  "North Africa": {
    countries: ["Egypt", "Morocco", "Algeria", "Tunisia", "Libya", "Sudan", "Western Sahara"],
    color: "#0D9488", // teal-600 - teal variant
    center: [20, 25],
    zoom: 3
  },
  "Sub-Saharan Africa": {
    countries: ["Nigeria", "South Africa", "Ethiopia", "Kenya", "Tanzania", "Ghana", "Cameroon", "Ivory Coast", "Angola", "Senegal", "Mali", "Burkina Faso", "Zimbabwe", "Uganda", "South Sudan", "Zambia", "Chad", "Somalia", "Guinea", "Rwanda", "Benin", "Niger", "Mozambique", "Namibia", "Madagascar", "Botswana", "Gabon", "Congo", "Malawi", "Equatorial Guinea", "Eritrea", "Mauritania", "Gambia", "Swaziland", "Djibouti", "Lesotho", "Burundi", "Sierra Leone", "Togo", "Liberia"],
    color: "#064E3B", // emerald-900 - darkest green
    center: [20, 0],
    zoom: 2
  },
  "East Asia": {
    countries: ["China", "Japan", "South Korea", "North Korea", "Taiwan", "Mongolia"],
    color: "#059669", // emerald-600 - medium dark green
    center: [115, 35],
    zoom: 2.5
  },
  "South Asia": {
    countries: ["India", "Pakistan", "Bangladesh", "Afghanistan", "Nepal", "Sri Lanka", "Bhutan", "Maldives"],
    color: "#A7F3D0", // emerald-200 - very light green
    center: [80, 25],
    zoom: 3
  },
  "Southeast Asia": { 
    countries: ["Indonesia", "Thailand", "Vietnam", "Malaysia", "Philippines", "Myanmar", "Singapore", "Cambodia", "Laos", "Brunei", "Timor-Leste"], 
    color: "#14B8A6", // teal-500 - medium teal
    center: [110, 5],
    zoom: 3
  },
  "Oceania": {
    countries: ["Australia", "New Zealand", "Papua New Guinea", "Fiji", "Solomon Islands", "Vanuatu", "Samoa", "Kiribati", "Micronesia", "Tonga"],
    color: "#2DD4BF", // teal-400 - light teal
    center: [145, -25],
    zoom: 2.5
  },
  "Russia & Central Asia": {
    countries: ["Russia", "Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Georgia", "Armenia", "Azerbaijan"],
    color: "#0F766E", // teal-700 - dark teal
    center: [70, 55],
    zoom: 2
  }
};

const EditProfile = () => {
  const navigate = useNavigate();
  const modalDelete = useRef<HTMLDialogElement>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["North America"]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState("");
  const [position, setPosition] = useState<{ coordinates: [number, number], zoom: number }>({
    coordinates: [0, 20],
    zoom: 1
  });
  const [hoveredCountry, setHoveredCountry] = useState("");
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [showStateSelect, setShowStateSelect] = useState(false);
  const [showRegionSelect, setShowRegionSelect] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Log when the component mounts
  useEffect(() => {
    console.log("EditProfile component mounted");
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

  // Check if a country belongs to any selected region
  const isInSelectedRegions = (countryName: string) => {
    return selectedRegions.some(regionName => 
      regions[regionName]?.countries.includes(countryName)
    );
  };

  // Find which region a country belongs to
  const findCountryRegion = (countryName: string): string | null => {
    for (const [region, data] of Object.entries(regions)) {
      if (data.countries.includes(countryName)) {
        return region;
      }
    }
    return null;
  };

  // Handle region selection/deselection
  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => {
      // If region is already selected, remove it, otherwise add it
      if (prev.includes(region)) {
        return prev.filter(r => r !== region);
      } else {
        return [...prev, region];
      }
    });
  };

  // Handle country selection
  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => {
      // If country is already selected, remove it, otherwise add it
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  // Handle state selection
  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };

  // Company Info State
  const [companyInfo, setCompanyInfo] = useState({
    name: "Imperium SAP Solutions",
    address: "118 South Montclair Avenue, Glen Ellyn, IL 60137",
    phone: "(630) 555-0123",
    email: "contact@imperiumsap.com",
    website: "www.imperiumsap.com"
  });

  // SAP Services State
  const [implementations, setImplementations] = useState([
    {
      name: "SAP S/4HANA Migration",
      description: "End-to-end migration services from legacy systems to SAP S/4HANA",
      features: ["System assessment", "Data migration", "Customization", "Testing", "Go-live support"]
    },
    {
      name: "SAP ECC Support",
      description: "Comprehensive support and maintenance for SAP ECC systems",
      features: ["24/7 monitoring", "Performance optimization", "Security updates", "User training"]
    }
  ]);

  // Solutions State
  const [solutions, setSolutions] = useState([
    {
      name: "SAP Business One",
      description: "Complete ERP solution for small and medium enterprises",
      features: ["Financial management", "Sales and CRM", "Inventory control", "Reporting"]
    },
    {
      name: "SAP Business ByDesign",
      description: "Cloud-based ERP solution for mid-market companies",
      features: ["Cloud deployment", "Multi-tenant architecture", "Built-in analytics", "Mobile access"]
    }
  ]);

  // Expertise State
  const [expertise, setExpertise] = useState({
    maxProjectSize: "Enterprise-wide",
    typicalProjectSize: "Department to Full Enterprise",
    serviceTypes: ["Implementation", "Migration", "Support", "Consulting", "Training"],
    certifications: ["SAP Gold Partner", "SAP Certified", "ISO 27001", "CMMI Level 5"],
    serviceArea: ["North America", "Europe", "Asia Pacific", "Middle East"]
  });

  // Performance Metrics State
  const [performance, setPerformance] = useState({
    completedProjects: 250,
    totalClients: 180,
    averageImplementation: "6-12 months",
    customerSatisfaction: 4.9
  });

  // Handlers for adding/removing items
  const addImplementation = () => {
    setImplementations([...implementations, {
      name: "",
      description: "",
      features: []
    }]);
  };

  const removeImplementation = (index: number) => {
    setImplementations(implementations.filter((_, i) => i !== index));
  };

  const addSolution = () => {
    setSolutions([...solutions, {
      name: "",
      description: "",
      features: []
    }]);
  };

  const removeSolution = (index: number) => {
    setSolutions(solutions.filter((_, i) => i !== index));
  };

  const addFeature = (type: 'implementation' | 'solution', index: number) => {
    if (type === 'implementation') {
      const newImplementations = [...implementations];
      newImplementations[index].features.push("");
      setImplementations(newImplementations);
    } else {
      const newSolutions = [...solutions];
      newSolutions[index].features.push("");
      setSolutions(newSolutions);
    }
  };

  const removeFeature = (type: 'implementation' | 'solution', index: number, featureIndex: number) => {
    if (type === 'implementation') {
      const newImplementations = [...implementations];
      newImplementations[index].features.splice(featureIndex, 1);
      setImplementations(newImplementations);
    } else {
      const newSolutions = [...solutions];
      newSolutions[index].features.splice(featureIndex, 1);
      setSolutions(newSolutions);
    }
  };

  const addServiceType = () => {
    setExpertise({
      ...expertise,
      serviceTypes: [...expertise.serviceTypes, ""]
    });
  };

  const removeServiceType = (index: number) => {
    setExpertise({
      ...expertise,
      serviceTypes: expertise.serviceTypes.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    setExpertise({
      ...expertise,
      certifications: [...expertise.certifications, ""]
    });
  };

  const removeCertification = (index: number) => {
    setExpertise({
      ...expertise,
      certifications: expertise.certifications.filter((_, i) => i !== index)
    });
  };

  const addServiceArea = () => {
    setExpertise({
      ...expertise,
      serviceArea: [...expertise.serviceArea, ""]
    });
  };

  const removeServiceArea = (index: number) => {
    setExpertise({
      ...expertise,
      serviceArea: expertise.serviceArea.filter((_, i) => i !== index)
    });
  };

  // Handler for saving changes
  const handleSave = () => {
    // Here you would typically make an API call to save the data
    toast.success('Profile updated successfully!');
    navigate('/profile');
  };

  return (
    <div className="w-full px-16 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">Edit Company Profile</h2>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="btn bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/60 to-[rgba(40,41,43,0.4)] text-white border border-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 text-white border-none hover:shadow-lg hover:shadow-emerald-500/20 gap-2"
          >
            <MdSave className="text-lg" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Content with Centered Map */}
      <div className="relative w-full min-h-[calc(100vh-12rem)] flex items-center justify-center">
        {/* Central Interactive Map - Larger size */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div ref={mapRef} className="relative w-[1100px] h-[1100px] bg-[#020305]/50 backdrop-blur-md rounded-full">
            {/* Fallback div to ensure some content is visible */}
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-emerald-500/50 p-4 text-center">
              {mapError && (
                <div className="text-red-400 text-sm max-w-md">
                  Error loading map: {mapError}
                </div>
              )}
            </div>
            
            {/* Map Content */}
            <div className="absolute inset-0 flex items-center justify-center">
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
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-[#28292b]/80 backdrop-blur-md text-white px-3 py-1 rounded-md text-sm pointer-events-none border border-emerald-500/20">
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
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdBusiness className="text-2xl text-emerald-500" />
                <h3 className="text-lg font-semibold text-white">Company Info</h3>
              </div>
              <div className="space-y-3">
                <div className="form-control">
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40"
                    placeholder="Company Name"
                  />
                </div>
                <div className="form-control">
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-emerald-400 min-w-[1rem]" />
                    <input
                      type="text"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Address"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <div className="flex items-center gap-2">
                    <MdOutlinePhone className="text-emerald-400 min-w-[1rem]" />
                    <input
                      type="text"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <div className="flex items-center gap-2">
                    <MdOutlineEmail className="text-emerald-400 min-w-[1rem]" />
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className="form-control mt-2">
                  <div className="flex items-start gap-2">
                    <span className="text-white/60 text-sm">Website:</span>
                    <input
                      type="text"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                      className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full"
                      placeholder="Website"
                    />
                </div>
              </div>
            </div>
          </div>

            {/* Implementations */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MdCode className="text-2xl text-emerald-500" />
                  <h3 className="text-lg font-semibold text-white">Implementations</h3>
                </div>
                <button
                  onClick={addImplementation}
                  className="btn btn-circle btn-xs bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/20"
                >
                  <HiPlus className="text-lg" />
                </button>
              </div>
              <div>
                {implementations.map((impl, index) => (
                  <div key={index} className="bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10 relative mb-3">
                    <button
                      onClick={() => removeImplementation(index)}
                      className="absolute -top-2 -right-2 btn btn-circle btn-xs bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                      <HiXMark />
                    </button>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        <input
                          type="text"
                          value={impl.name}
                          onChange={(e) => {
                            const newImpls = [...implementations];
                            newImpls[index].name = e.target.value;
                            setImplementations(newImpls);
                          }}
                          className="input input-sm w-full bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40"
                          placeholder="Implementation name"
                        />
                      </div>
                      <div>
                        <textarea
                          value={impl.description}
                          onChange={(e) => {
                            const newImpls = [...implementations];
                            newImpls[index].description = e.target.value;
                            setImplementations(newImpls);
                          }}
                          className="textarea textarea-sm w-full bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40"
                          placeholder="Description"
                          rows={2}
                        />
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">Features:</span>
                          <button
                            onClick={() => addFeature('implementation', index)}
                            className="btn btn-xs bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/20"
                          >
                            <HiPlus className="text-sm" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {impl.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-1 bg-emerald-500/10 rounded border border-emerald-500/20 pl-2 pr-1 py-1">
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => {
                                  const newImpls = [...implementations];
                                  newImpls[index].features[featureIndex] = e.target.value;
                                  setImplementations(newImpls);
                                }}
                                className="bg-transparent border-none text-emerald-300 text-xs w-24 focus:outline-none"
                                placeholder="Feature"
                              />
                              <button
                                onClick={() => removeFeature('implementation', index, featureIndex)}
                                className="text-emerald-300/60 hover:text-emerald-300"
                              >
                                <HiXMark className="text-xs" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Regions - Updated to match country selection style */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-4">
              <div className="flex items-center gap-3 mb-3">
                <MdStorage className="text-2xl text-emerald-500" />
                <h3 className="text-lg font-semibold text-white">Regions You Operate In</h3>
              </div>
              
              {/* Selected regions display */}
              <div className="text-sm space-y-2 mb-4 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10">
                <div className="font-semibold text-white">Selected Regions</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedRegions.map((region) => (
                    <span 
                      key={region} 
                      className="px-2 py-1 bg-emerald-500/10 text-emerald-300 rounded-sm text-xs border border-emerald-500/20 flex items-center gap-1"
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
                  className="w-full px-3 py-2 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 transition-all hover:bg-emerald-500/20 flex justify-between items-center"
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
                  <div className="mt-2 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10 max-h-48 overflow-y-auto">
                    <div className="space-y-1">
                      {Object.keys(regions).map((region) => (
                        <label 
                          key={region} 
                          className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-emerald-500/10"
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
                <div className="text-sm space-y-2 mt-4 pt-4 border-t border-emerald-500/10 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10">
                  <div className="font-semibold text-white">Selected Countries</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedCountries.length > 0 ? (
                      selectedCountries.map((country) => {
                        const countryRegion = findCountryRegion(country);
                        return (
                          <span 
                            key={country} 
                            className="px-2 py-1 bg-emerald-500/10 text-emerald-300 rounded-sm text-xs border border-emerald-500/20 flex items-center gap-1"
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
                    className="w-full px-3 py-2 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 transition-all hover:bg-emerald-500/20 flex justify-between items-center"
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
                    <div className="mt-2 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10 max-h-48 overflow-y-auto">
                      <div className="space-y-1">
                        {selectedRegions.flatMap(regionName => 
                          regions[regionName].countries.map((country) => (
                            <label 
                              key={`${regionName}-${country}`} 
                              className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded hover:bg-emerald-500/10"
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
                    className="w-full px-3 py-2 bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/20 transition-all hover:bg-emerald-500/20 flex justify-between items-center"
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
                    <div className="mt-2 bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10 max-h-48 overflow-y-auto">
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
            </div>
          </div>

          {/* Center Column - Empty for Map */}
          <div className="col-span-1"></div>

          {/* Right Column */}
          <div className="col-span-1 space-y-6">
            {/* Performance Metrics */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MdAnalytics className="text-2xl text-emerald-500" />
                <h3 className="text-lg font-semibold text-white">Performance</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-white/60 text-sm">Projects</p>
                      <input
                    type="number"
                    value={performance.completedProjects}
                    onChange={(e) => setPerformance({...performance, completedProjects: Number(e.target.value)})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full mt-1"
                      />
                    </div>
                <div>
                  <p className="text-white/60 text-sm">Total Clients</p>
                  <input
                    type="number"
                    value={performance.totalClients}
                    onChange={(e) => setPerformance({...performance, totalClients: Number(e.target.value)})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full mt-1"
                  />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Implementation</p>
                      <input
                        type="text"
                    value={performance.averageImplementation}
                    onChange={(e) => setPerformance({...performance, averageImplementation: e.target.value})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full mt-1"
                      />
                    </div>
                <div>
                  <p className="text-white/60 text-sm">Satisfaction</p>
                  <input
                    type="number"
                    value={performance.customerSatisfaction}
                    onChange={(e) => setPerformance({...performance, customerSatisfaction: Number(e.target.value)})}
                    className="input input-sm bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40 w-full mt-1"
                    step="0.1"
                    min="0"
                    max="5"
                  />
                  </div>
                </div>
          </div>

            {/* Service Types with Certifications */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MdSettings className="text-2xl text-emerald-500" />
                  <h3 className="text-lg font-semibold text-white">Service Types</h3>
                </div>
                    <button
                  onClick={addServiceType}
                  className="btn btn-circle btn-xs bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/20"
                    >
                  <HiPlus className="text-lg" />
                    </button>
                  </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {expertise.serviceTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-1 bg-emerald-500/10 rounded border border-emerald-500/20 pl-2 pr-1 py-1">
                        <input
                          type="text"
                          value={type}
                          onChange={(e) => {
                        const newTypes = [...expertise.serviceTypes];
                            newTypes[index] = e.target.value;
                        setExpertise({
                          ...expertise,
                          serviceTypes: newTypes
                            });
                          }}
                      className="bg-transparent border-none text-emerald-300 text-xs w-24 focus:outline-none"
                          placeholder="Type"
                        />
                        <button
                      onClick={() => removeServiceType(index)}
                      className="text-emerald-300/60 hover:text-emerald-300"
                        >
                          <HiXMark className="text-xs" />
                        </button>
                      </div>
                    ))}
          </div>

              {/* Certifications section inside service types */}
              <div className="mt-6 pt-6 border-t border-emerald-500/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MdSecurity className="text-2xl text-emerald-500" />
                    <h3 className="text-lg font-semibold text-white">Certifications</h3>
              </div>
                    <button
                      onClick={addCertification}
                    className="btn btn-circle btn-xs bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/20"
                    >
                    <HiPlus className="text-lg" />
                    </button>
                  </div>
                <div>
                  {expertise.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10 relative mb-3">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => {
                          const newCerts = [...expertise.certifications];
                            newCerts[index] = e.target.value;
                          setExpertise({
                            ...expertise,
                              certifications: newCerts
                            });
                          }}
                        className="bg-transparent border-none text-white/90 w-full focus:outline-none"
                        placeholder="Certification"
                        />
                        <button
                          onClick={() => removeCertification(index)}
                        className="absolute -top-2 -right-2 btn btn-circle btn-xs bg-red-500/20 text-red-400 border border-red-500/20"
                        >
                        <HiXMark />
                        </button>
                      </div>
                    ))}
                  </div>
            </div>
          </div>

            {/* Solutions */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-emerald-500/15 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <MdCloud className="text-2xl text-emerald-500" />
                  <h3 className="text-lg font-semibold text-white">Solutions</h3>
                </div>
                <button
                  onClick={addSolution}
                  className="btn btn-circle btn-xs bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/20"
                >
                  <HiPlus className="text-lg" />
                </button>
                </div>
                <div>
                {solutions.map((solution, index) => (
                  <div key={index} className="bg-[#28292b]/40 backdrop-blur-md rounded-lg p-3 border border-emerald-500/10 relative mb-3">
                    <button
                      onClick={() => removeSolution(index)}
                      className="absolute -top-2 -right-2 btn btn-circle btn-xs bg-red-500/20 text-red-400 border border-red-500/20"
                    >
                      <HiXMark />
                    </button>
                    <div className="space-y-2">
                      <div className="font-semibold">
                        <input
                          type="text"
                          value={solution.name}
                          onChange={(e) => {
                            const newSolutions = [...solutions];
                            newSolutions[index].name = e.target.value;
                            setSolutions(newSolutions);
                          }}
                          className="input input-sm w-full bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40"
                          placeholder="Solution name"
                        />
                      </div>
                      <div>
                        <textarea
                          value={solution.description}
                          onChange={(e) => {
                            const newSolutions = [...solutions];
                            newSolutions[index].description = e.target.value;
                            setSolutions(newSolutions);
                          }}
                          className="textarea textarea-sm w-full bg-[#28292b]/40 backdrop-blur-md border-emerald-500/20 text-white placeholder-white/40"
                          placeholder="Description"
                          rows={2}
                        />
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">Features:</span>
                          <button
                            onClick={() => addFeature('solution', index)}
                            className="btn btn-xs bg-gradient-to-br from-emerald-500/20 via-emerald-600/20 to-green-600/20 text-emerald-400 border border-emerald-500/20"
                    >
                      <HiPlus className="text-sm" />
                    </button>
                  </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {solution.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-1 bg-emerald-500/10 rounded border border-emerald-500/20 pl-2 pr-1 py-1">
                        <input
                          type="text"
                                value={feature}
                          onChange={(e) => {
                                  const newSolutions = [...solutions];
                                  newSolutions[index].features[featureIndex] = e.target.value;
                                  setSolutions(newSolutions);
                                }}
                                className="bg-transparent border-none text-emerald-300 text-xs w-24 focus:outline-none"
                                placeholder="Feature"
                        />
                        <button
                                onClick={() => removeFeature('solution', index, featureIndex)}
                                className="text-emerald-300/60 hover:text-emerald-300"
                        >
                          <HiXMark className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
                    ))}
          </div>
        </div>
              </div>
            </div>
          </div>

      {/* Danger Zone */}
      <div className="mt-8">
                    <button
          className="btn bg-gradient-to-br from-red-500/80 via-red-600/80 to-red-700/80 text-white border-none hover:shadow-lg hover:shadow-red-500/20"
          onClick={() => modalDelete.current?.showModal()}
                    >
          <HiOutlineTrash className="text-lg" />
          Delete Company Profile
                    </button>
        <dialog
          id="modal_delete"
          className="modal"
          ref={modalDelete}
        >
          <div className="modal-box bg-[#28292b] border border-emerald-500/15 backdrop-blur-xl">
            <h3 className="font-bold text-xl text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              Delete Confirmation
            </h3>
            <p className="py-4 text-white/80">
              Are you sure you want to delete your company profile? This action cannot be undone.
            </p>
            <div className="modal-action mx-0 flex-col items-stretch justify-stretch gap-3">
                    <button
                onClick={() =>
                  toast('Profile deletion is disabled in demo mode', {
                    icon: '⚠️',
                  })
                }
                className="btn bg-gradient-to-br from-red-500/80 via-red-600/80 to-red-700/80 text-white border-none hover:shadow-lg hover:shadow-red-500/20"
              >
                Yes, delete my profile
                    </button>
              <form method="dialog" className="m-0 w-full">
                <button className="btn bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/60 to-[rgba(40,41,43,0.4)] text-white border border-emerald-500/15 hover:shadow-lg hover:shadow-emerald-500/20 w-full">
                  No, keep my profile
                        </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default EditProfile;
