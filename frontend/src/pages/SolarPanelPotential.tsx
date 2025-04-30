import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdSolarPower, MdOutlineWbSunny, MdOutlineAttachMoney, MdArrowForward, MdArrowBack, MdEdit, MdRefresh, MdMap, MdOutlineCalculate, MdOutlineSettings } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FaSolarPanel, FaMoneyBillWave, FaLeaf, FaChartLine, FaRegCalendarAlt } from 'react-icons/fa';

// Define types for our data
interface SolarPanel {
  id: string;
  name: string;
  wattage: number;
  efficiency: number;
  dimensions: {
    width: number;
    height: number;
  };
  costPerPanel: number;
}

interface SolarPotential {
  calculated: boolean;
  maxPanels: number;
  selectedPanelType: string;
  annualProduction: number;
  installationCost: number;
  annualSavings: number;
  paybackPeriod: number;
  roi: number;
  monthlyProduction: Array<{
    month: string;
    production: number;
  }>;
  annualEnergyConsumption?: number;
  localEnergyRate?: number;
  systemSize?: number;
  costPerWatt?: number;
  solarIncentives?: number;
  currentAnnualEnergyCost?: number;
  remainingGridEnergy?: number;
  remainingCost?: number;
  firstYearSavings?: number;
  firstYearROI?: number;
}

interface Facility {
  id: number;
  name: string;
  industry: string;
  location: string;
  analysis: {
    facilityType: string;
    squareFootage: number;
    energyRate: number;
    roofArea: number;
  };
  energyEstimation: {
    annualUsage: number;
    annualCost: number;
  };
  solarPotential: SolarPotential;
}

const SolarPanelPotential = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(true);
  const [currentFacilityIndex, setCurrentFacilityIndex] = useState(0);
  const [selectedPanelType, setSelectedPanelType] = useState('standard');
  const [iframeKey, setIframeKey] = useState(1);
  // Set iframe loaded to true by default
  const [iframeLoaded, setIframeLoaded] = useState(true);
  
  // Available solar panel types
  const panelTypes: SolarPanel[] = [
    {
      id: 'standard',
      name: 'Standard Efficiency',
      wattage: 350,
      efficiency: 0.18,
      dimensions: {
        width: 1.7,
        height: 1.0
      },
      costPerPanel: 250
    },
    {
      id: 'premium',
      name: 'Premium Efficiency',
      wattage: 400,
      efficiency: 0.22,
      dimensions: {
        width: 1.7,
        height: 1.0
      },
      costPerPanel: 350
    },
    {
      id: 'highend',
      name: 'High-End Performance',
      wattage: 450,
      efficiency: 0.24,
      dimensions: {
        width: 1.7,
        height: 1.0
      },
      costPerPanel: 450
    }
  ];
  
  // Sample facilities data with analysis and energy estimation results
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: 1,
      name: "Apple Distribution Center",
      industry: "Technology",
      location: "Atlanta, GA",
      analysis: {
        facilityType: "Office/Warehouse",
        squareFootage: 250000,
        energyRate: 0.12,
        roofArea: 212500
      },
      energyEstimation: {
        annualUsage: 3500000,
        annualCost: 420000
      },
      solarPotential: {
        calculated: false,
        maxPanels: 0,
        selectedPanelType: '',
        annualProduction: 0,
        installationCost: 0,
        annualSavings: 0,
        paybackPeriod: 0,
        roi: 0,
        monthlyProduction: []
      }
    },
    {
      id: 2,
      name: "Honeywell Manufacturing Plant",
      industry: "Manufacturing",
      location: "Kansas City, MO",
      analysis: {
        facilityType: "Manufacturing",
        squareFootage: 180000,
        energyRate: 0.11,
        roofArea: 153000
      },
      energyEstimation: {
        annualUsage: 4500000,
        annualCost: 495000
      },
      solarPotential: {
        calculated: false,
        maxPanels: 0,
        selectedPanelType: '',
        annualProduction: 0,
        installationCost: 0,
        annualSavings: 0,
        paybackPeriod: 0,
        roi: 0,
        monthlyProduction: []
      }
    },
    {
      id: 3,
      name: "Apple Research Campus",
      industry: "Technology",
      location: "Denver, CO",
      analysis: {
        facilityType: "Office/Research",
        squareFootage: 120000,
        energyRate: 0.13,
        roofArea: 102000
      },
      energyEstimation: {
        annualUsage: 2160000,
        annualCost: 280800
      },
      solarPotential: {
        calculated: false,
        maxPanels: 0,
        selectedPanelType: '',
        annualProduction: 0,
        installationCost: 0,
        annualSavings: 0,
        paybackPeriod: 0,
        roi: 0,
        monthlyProduction: []
      }
    }
  ]);

  const currentFacility = facilities[currentFacilityIndex];
  const selectedPanel = panelTypes.find(panel => panel.id === selectedPanelType)!;

  // Solar panel data
  const solarData = {
    yearlyEnergy: '527,869.4 kWh/year',
    yearlyCost: '$69,678.76',
    installationSize: '377.2 kW',
    energyCovered: '82.4%',
    monthlyAverage: '$3,991.01',
    firstYear: '$47,892.14',
    tenYearTotal: '$433,761.89',
    costWithoutSolar: '$61,305.29',
    costWithSolar: '$827,973.05',
    totalLifetimeSavings: '$-766,667.76',
    breakEven: 'Not reached',
    address: '303 S Technology Ct, Broomfield, CO',
    state: 'CO',
    zipCode: '80021',
    energyRate: '$0.310/kWh',
    monthlyBill: '$5,806.56',
    panelsCount: '943 panels',
    solarIncentives: '$7,000.00',
    installationCost: '$4.00 per Watt',
    totalInstallationCost: '$1,075,020.00',
    panelCapacity: '400 Watts',
    roofArea: '45,000 sq ft',
    usableRoofArea: '32,000 sq ft',
    annualSunHours: '2,200 hours',
    co2Reduction: '176 tons/year',
    treeEquivalent: '4,100 trees',
    annualProduction: '435,383.1 kWh',
    remainingGridEnergy: '92,486.3 kWh',
    remainingCost: '$28,670.75',
    firstYearROI: '4.48%'
  };

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate calculation process
      setTimeout(() => {
        setIsCalculating(false);
      }, 3000);
    }, 1000);
  }, []);

  // Add a new useEffect to handle iframe safety
  useEffect(() => {
    // Prevent the iframe from navigating to the "Are you lost?" page
    const preventNavigation = (e: MessageEvent) => {
      if (e.data && e.data.type === 'navigation') {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('message', preventNavigation);
    
    return () => {
      window.removeEventListener('message', preventNavigation);
    };
  }, []);

  // Add this useEffect to prevent the "Are you lost?" page from showing
  useEffect(() => {
    // Check if URL has changed to include #ru (the "Are you lost?" page marker)
    const checkUrl = () => {
      if (window.location.href.includes('#ru')) {
        console.log('Detected unwanted navigation, resetting URL');
        // Reset the URL without causing a page reload
        window.history.pushState(null, '', window.location.pathname);
        
        // Reload the iframe to restore functionality
        setIframeKey(prev => prev + 1);
        
        // Show a toast to inform the user
        toast('Prevented unwanted navigation', {
          icon: '👍',
          duration: 2000
        });
      }
    };

    // Set up interval to periodically check the URL
    const urlCheckInterval = setInterval(checkUrl, 1000);
    
    // Also check on hash change events
    const hashChangeHandler = () => {
      checkUrl();
    };
    
    window.addEventListener('hashchange', hashChangeHandler);
    
    // Clean up
    return () => {
      clearInterval(urlCheckInterval);
      window.removeEventListener('hashchange', hashChangeHandler);
    };
  }, []);

  const calculateSolarPotential = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Calculate how many panels can fit on the roof
      const panelArea = selectedPanel.dimensions.width * selectedPanel.dimensions.height;
      const usableRoofArea = currentFacility.analysis.roofArea * 0.7; // Assuming 70% of roof is usable
      const maxPanels = Math.floor(usableRoofArea / panelArea);
      
      // Calculate annual production based on location and panel efficiency
      let sunshineHoursPerYear = 0;
      if (currentFacility.location.includes("Atlanta")) {
        sunshineHoursPerYear = 2600;
      } else if (currentFacility.location.includes("Kansas City")) {
        sunshineHoursPerYear = 2400;
      } else if (currentFacility.location.includes("Denver")) {
        sunshineHoursPerYear = 3000;
      } else {
        sunshineHoursPerYear = 2500; // Default
      }
      
      const annualProduction = Math.round(maxPanels * selectedPanel.wattage * sunshineHoursPerYear * 0.75 / 1000); // kWh, with 75% efficiency factor
      
      // Calculate costs and savings
      const installationCost = Math.round(maxPanels * selectedPanel.costPerPanel + 50000); // Panel cost plus $50k base cost
      const annualSavings = Math.round(annualProduction * currentFacility.analysis.energyRate);
      const paybackPeriod = parseFloat((installationCost / annualSavings).toFixed(1));
      const roi = parseFloat(((annualSavings * 25 - installationCost) / installationCost * 100).toFixed(1)); // 25 year lifespan
      
      // Generate monthly production data based on seasonal variations
      const monthlyFactors = [0.06, 0.07, 0.08, 0.09, 0.10, 0.11, 0.11, 0.10, 0.09, 0.08, 0.06, 0.05];
      const monthlyProduction = [
        { month: 'Jan', production: Math.round(annualProduction * monthlyFactors[0]) },
        { month: 'Feb', production: Math.round(annualProduction * monthlyFactors[1]) },
        { month: 'Mar', production: Math.round(annualProduction * monthlyFactors[2]) },
        { month: 'Apr', production: Math.round(annualProduction * monthlyFactors[3]) },
        { month: 'May', production: Math.round(annualProduction * monthlyFactors[4]) },
        { month: 'Jun', production: Math.round(annualProduction * monthlyFactors[5]) },
        { month: 'Jul', production: Math.round(annualProduction * monthlyFactors[6]) },
        { month: 'Aug', production: Math.round(annualProduction * monthlyFactors[7]) },
        { month: 'Sep', production: Math.round(annualProduction * monthlyFactors[8]) },
        { month: 'Oct', production: Math.round(annualProduction * monthlyFactors[9]) },
        { month: 'Nov', production: Math.round(annualProduction * monthlyFactors[10]) },
        { month: 'Dec', production: Math.round(annualProduction * monthlyFactors[11]) }
      ];
      
      // Update the current facility with solar potential data
      const updatedFacilities = [...facilities];
      updatedFacilities[currentFacilityIndex] = {
        ...currentFacility,
        solarPotential: {
          calculated: true,
          maxPanels,
          selectedPanelType: selectedPanel.id,
          annualProduction,
          installationCost,
          annualSavings,
          paybackPeriod,
          roi,
          monthlyProduction
        }
      };
      
      setFacilities(updatedFacilities);
      toast.success('Solar potential calculation complete');
    }, 2000);
  };

  const handleNext = () => {
    if (currentFacilityIndex < facilities.length - 1) {
      setCurrentFacilityIndex(currentFacilityIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentFacilityIndex > 0) {
      setCurrentFacilityIndex(currentFacilityIndex - 1);
    }
  };

  const handleContinue = () => {
    // Only navigate when this function is explicitly called
    navigate('/email-automation');
  };

  const handlePanelTypeChange = (panelId: string) => {
    setSelectedPanelType(panelId);
    
    // If we already have calculations, recalculate with the new panel type
    if (currentFacility.solarPotential.calculated) {
      calculateSolarPotential();
    }
  };

  // Calculate percentage of energy that can be offset by solar
  const calculateEnergyOffset = () => {
    if (!currentFacility.solarPotential.calculated) return 0;
    
    return Math.min(100, Math.round((currentFacility.solarPotential.annualProduction / currentFacility.energyEstimation.annualUsage) * 100));
  };

  // Data for the energy offset pie chart
  const energyOffsetData = [
    { name: 'Solar Energy', value: calculateEnergyOffset() },
    { name: 'Grid Energy', value: 100 - calculateEnergyOffset() }
  ];
  
  const COLORS = ['#4ade80', '#94a3b8'];

  // Safe function to show modals
  const showModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement | null;
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  };

  // Add a scroll event listener to prevent unwanted navigation
  useEffect(() => {
    // Prevent any automatic navigation on scroll
    const handleScroll = (e: Event) => {
      // This empty handler overrides any other scroll handlers that might navigate
      e.stopPropagation();
    };

    window.addEventListener('scroll', handleScroll, { capture: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  // Enhanced scroll prevention by adding multiple levels of protection
  useEffect(() => {
    // Comprehensive set of measures to prevent the "Are you lost" page from showing

    // 1. Prevent default behavior for various scroll events
    const preventDefaultScroll = (e: Event) => {
      // Don't prevent all scrolling, just specific behaviors that might trigger navigation
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        // Only prevent if this is a link that might navigate
        if (!e.defaultPrevented) {
          e.preventDefault();
        }
      }
    };

    // 2. Prevent any history navigation on scroll
    const preventNavigation = (e: Event) => {
      e.stopPropagation();
      if (e.target instanceof HTMLElement && e.target.tagName === 'A') {
        e.preventDefault();
      }
    };

    // 3. Block any hashchange events that aren't explicitly triggered by user clicks
    const preventHashChange = (e: HashChangeEvent) => {
      // We can't always prevent the hash change, but we can navigate back if it wasn't wanted
      if (e.newURL.includes('#ru')) {
        window.history.back();
      }
    };

    // 4. Block popstate events that might be related to unwanted navigation
    const preventPopState = (e: PopStateEvent) => {
      // Check if this might be the "Are you lost" page
      if (typeof window.location.href === 'string' && window.location.href.includes('#ru')) {
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    // Handle touch events to prevent swipe navigation
    const preventSwipeNavigation = (e: TouchEvent) => {
      // Only needed for browsers that might interpret horizontal swipes as navigation
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add the event listeners
    window.addEventListener('scroll', preventDefaultScroll, { passive: false });
    window.addEventListener('wheel', preventNavigation, { capture: true });
    window.addEventListener('touchmove', preventSwipeNavigation, { passive: false });
    window.addEventListener('hashchange', preventHashChange);
    window.addEventListener('popstate', preventPopState);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', preventDefaultScroll);
      window.removeEventListener('wheel', preventNavigation, { capture: true });
      window.removeEventListener('touchmove', preventSwipeNavigation);
      window.removeEventListener('hashchange', preventHashChange);
      window.removeEventListener('popstate', preventPopState);
    };
  }, []);

  // Fix the tooltip content function to handle undefined values
  const safeTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length && payload[0] && payload[1]) {
      return (
        <div className="bg-[#1e222b] p-4 rounded-lg shadow-lg border border-[#1e222b]/30">
          <h4 className="text-white font-medium mb-2">{label || 'N/A'}</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">Production:</span>
              <span className="text-white font-medium">{payload[0].value || 0} kWh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-gray-300">Baseline:</span>
              <span className="text-white font-medium">{payload[1].value || 0} kWh</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ${Math.round(Number(payload[0]?.value || 0) * 0.125).toLocaleString()}/month
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* GIF Container */}
          <div className="relative group">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* GIF box with glass effect */}
            <div className="relative backdrop-blur-sm bg-black/20 p-1 rounded-3xl border border-white/10">
              <img 
                src="/images/solar/lq6qgs6wvqjt-6ULtn4qBpracPzH2BdC2Rw-5690767d955f9db839aa2b65243ec315-Untitled_1_0Xe3O7f.gif"
                alt="Solar Analysis"
                className="w-[500px] h-[500px] object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Calculating Solar Potential</h2>
            <p className="text-gray-400 mb-8">Analyzing roof geometry and solar exposure patterns...</p>
            
            {/* Progress bars */}
            <div className="w-[500px] space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Analyzing roof geometry</span>
                  <span className="text-orange-500 font-medium">100%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Calculating sun exposure</span>
                  <span className="text-orange-500 font-medium">95%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Determining optimal panel placement</span>
                  <span className="text-orange-500 font-medium">80%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Estimating energy production</span>
                  <span className="text-orange-500 font-medium">60%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Define base classes for cards to match the Home page styling
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-emerald-500/15 group relative overflow-hidden";

  return (
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-orange-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Simple title without a box - left aligned */}
          <div className="flex items-center justify-start py-4">
            <div className="flex items-center gap-3">
              <MdSolarPower size={28} className="text-orange-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Solar Panel Potential
              </h1>
            </div>
          </div>
          
          {isCalculating ? (
            <div className={cardBaseClass}>
              {/* Decorative patterns */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" 
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                    backgroundSize: '30px 30px'
                  }}
                ></div>
              </div>
              
              {/* Gradient orbs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
              
              <div className="card-body flex flex-col items-center justify-center py-16 relative z-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="loading loading-spinner loading-lg text-orange-500 relative"></div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                  Calculating Solar Potential
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                  Our AI is analyzing roof area, sun exposure, and energy requirements to determine optimal solar installation...
                </p>
                <div className="w-full max-w-md space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Analyzing roof geometry</span>
                      <span className="text-emerald-500 font-medium">100%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Calculating sun exposure</span>
                      <span className="text-emerald-500 font-medium">95%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Determining optimal panel placement</span>
                      <span className="text-emerald-500 font-medium">80%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                      <div className="h-full w-[80%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Estimating energy production</span>
                      <span className="text-orange-500 font-medium">60%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                      <div className="h-full w-[60%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Statistics Grid with Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Installation Details Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl">
                  {/* Full-width image container */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/solar/unnamed2.png" 
                      alt="Installation Details" 
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Stronger vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[45%] p-6 flex flex-col justify-center">
                    {/* Combined icon and heading box */}
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
                          <FaSolarPanel className="text-lg text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Installation Details</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/30 rounded-2xl p-5 border border-white/10">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Installation Size</span>
                        <span className="text-sm font-semibold text-white">378.6 kW</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Panel Count</span>
                        <span className="text-sm font-semibold text-white">946 panels</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Panel Capacity</span>
                        <span className="text-sm font-semibold text-white">405 Watts</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Installation Cost</span>
                        <span className="text-sm font-semibold text-white">$3.97/W</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Benefits Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl">
                  {/* Full-width image container */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/solar/unnamed4.png" 
                      alt="Financial Benefits" 
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Stronger vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[45%] p-6 flex flex-col justify-center">
                    {/* Combined icon and heading box */}
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                          <FaMoneyBillWave className="text-lg text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Financial Benefits</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/30 rounded-2xl p-5 border border-white/10">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Yearly Savings</span>
                        <span className="text-sm font-semibold text-white">$69,842</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Monthly Average</span>
                        <span className="text-sm font-semibold text-white">$5,820</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">First Year</span>
                        <span className="text-sm font-semibold text-white">$64,973</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Solar Incentives</span>
                        <span className="text-sm font-semibold text-white">$12,678</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solar Potential Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl">
                  {/* Full-width image container */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/solar/unnamed6.png" 
                      alt="Solar Potential" 
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Stronger vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[45%] p-6 flex flex-col justify-center">
                    {/* Combined icon and heading box */}
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-3 rounded-xl shadow-lg">
                          <MdOutlineWbSunny className="text-lg text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Solar Potential</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/30 rounded-2xl p-5 border border-white/10">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Roof Area</span>
                        <span className="text-sm font-semibold text-white">45,324 sq ft</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Usable Area</span>
                        <span className="text-sm font-semibold text-white">32,451 sq ft</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Annual Sun Hours</span>
                        <span className="text-sm font-semibold text-white">2,243 hrs</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Energy Covered</span>
                        <span className="text-sm font-semibold text-white">83.7%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Environmental Impact Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl">
                  {/* Full-width image container with increased right offset */}
                  <div className="absolute inset-0 translate-x-[20%]">
                    <img 
                      src="/images/solar/unnamed.png" 
                      alt="Environmental Impact" 
                      className="w-[115%] h-full object-cover object-left scale-95"
                    />
                    {/* Simple gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[45%] p-6 flex flex-col justify-center">
                    {/* Combined icon and heading box */}
                    <div className="bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/10 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-3 rounded-xl shadow-lg">
                          <FaLeaf className="text-lg text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Environmental Impact</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/30 rounded-2xl p-5 border border-white/10">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">CO2 Reduction</span>
                        <span className="text-sm font-semibold text-white">177.8 tons/yr</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Tree Equivalent</span>
                        <span className="text-sm font-semibold text-white">4,137 trees</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Yearly Energy</span>
                        <span className="text-sm font-semibold text-white">528,413 kWh</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Energy Rate</span>
                        <span className="text-sm font-semibold text-white">$0.314/kWh</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solar Window Integration */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Interactive Solar Window</h2>
                <div className="bg-white dark:bg-[#1e222b]/50 rounded-xl shadow-lg backdrop-blur-lg border border-white/10 overflow-hidden">
                  <div className="relative w-full" style={{ height: '650px' }}>
                    {iframeLoaded ? (
                      <iframe 
                        key={iframeKey}
                        src="http://localhost:5174" 
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 'none' }}
                        title="Solar Window"
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        onError={(e) => {
                          console.error("Solar Window iframe error:", e);
                          toast.error("Solar Window connection error. Showing fallback content.");
                          setIframeLoaded(false);
                        }}
                        onLoad={(e) => {
                          console.log("Solar Window iframe loaded successfully");
                          setIframeLoaded(true);
                          
                          // Prevent navigation by intercepting beforeunload events
                          window.addEventListener('beforeunload', (event) => {
                            const currentHref = window.location.href;
                            if (currentHref.includes('#ru')) {
                              event.preventDefault();
                              window.history.pushState(null, '', window.location.pathname);
                              return '';
                            }
                          });
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e222b] p-8">
                        <MdSolarPower size={64} className="text-orange-500 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">Solar Panel Visualization</h3>
                        <p className="text-gray-300 text-center mb-6 max-w-2xl">
                          This interactive visualization shows the optimal placement of solar panels on your facility's roof,
                          taking into account orientation, shading, and other factors to maximize energy production.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                          <div className="bg-[#1e222b] p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-2">Optimal Panel Count</h4>
                            <p className="text-3xl font-bold text-orange-500">946</p>
                            <p className="text-sm text-gray-400 mt-1">panels</p>
                          </div>
                          <div className="bg-[#1e222b] p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-2">Energy Production</h4>
                            <p className="text-3xl font-bold text-orange-500">528,413</p>
                            <p className="text-sm text-gray-400 mt-1">kWh/year</p>
                          </div>
                          <div className="bg-[#1e222b] p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-2">CO₂ Reduction</h4>
                            <p className="text-3xl font-bold text-orange-500">177.8</p>
                            <p className="text-sm text-gray-400 mt-1">tons/year</p>
                          </div>
                        </div>
                        <button 
                          className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          onClick={() => {
                            setIframeKey(prev => prev + 1);
                            setIframeLoaded(true);
                          }}
                        >
                          Try Loading Interactive View
                        </button>
                      </div>
                    )}
                    {/* Fallback trigger button always available */}
                    <div className="absolute top-4 right-4 z-20">
                      <button 
                        className="p-2 bg-[#1e222b]/50 backdrop-blur-sm rounded-full hover:bg-[#1e222b]/70 transition-colors"
                        onClick={() => {
                          setIframeLoaded(!iframeLoaded);
                          if (iframeLoaded) {
                            setIframeKey(prev => prev + 1);
                          }
                        }}
                        title={iframeLoaded ? "Switch to Static View" : "Try Interactive View"}
                      >
                        {iframeLoaded ? 
                          <MdOutlineSettings className="text-white text-xl" /> : 
                          <MdRefresh className="text-white text-xl" />
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Energy Production Chart */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Monthly Energy Production</h2>
                <div className="bg-white dark:bg-[#1e222b]/50 rounded-xl shadow-lg p-6 backdrop-blur-lg border border-white/10">
                  <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2">Estimated Production (kWh)</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Based on historical weather data, panel orientation, and system size
                        </p>
                      </div>
                      
                      {/* Seasonal indicators */}
                      <div className="flex justify-between mb-2 text-xs font-medium">
                        <div className="text-blue-400">Winter</div>
                        <div className="text-green-400">Spring</div>
                        <div className="text-orange-400">Summer</div>
                        <div className="text-amber-400">Fall</div>
                      </div>
                      
                      {/* Chart area */}
                      <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { month: 'Jan', kwh: 458, baseline: 500 },
                              { month: 'Feb', kwh: 532, baseline: 550 },
                              { month: 'Mar', kwh: 672, baseline: 650 },
                              { month: 'Apr', kwh: 798, baseline: 775 },
                              { month: 'May', kwh: 845, baseline: 825 },
                              { month: 'Jun', kwh: 915, baseline: 900 },
                              { month: 'Jul', kwh: 932, baseline: 925 },
                              { month: 'Aug', kwh: 921, baseline: 910 },
                              { month: 'Sep', kwh: 854, baseline: 840 },
                              { month: 'Oct', kwh: 756, baseline: 735 },
                              { month: 'Nov', kwh: 605, baseline: 585 },
                              { month: 'Dec', kwh: 438, baseline: 470 }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis 
                              dataKey="month" 
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tick={{ fill: '#94a3b8', fontSize: 12 }}
                              tickFormatter={(value) => `${value} kWh`}
                            />
                            <Tooltip 
                              formatter={(value: number, name: string) => {
                                return [
                                  `${value} kWh`, 
                                  name === "kwh" ? "Production" : "Baseline"
                                ];
                              }}
                              content={safeTooltipContent}
                            />
                            <Legend
                              align="right"
                              verticalAlign="top"
                              wrapperStyle={{ paddingBottom: '20px' }}
                            />
                            <defs>
                              <linearGradient id="winterGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="springGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="summerGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#F97316" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="fallGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <Bar 
                              dataKey="kwh" 
                              name="Production" 
                              radius={[4, 4, 0, 0]}
                              barSize={36}
                            >
                              {/* Winter months */}
                              <Cell fill="url(#winterGradient)" stroke="#3B82F6" strokeWidth={1} />
                              <Cell fill="url(#winterGradient)" stroke="#3B82F6" strokeWidth={1} />
                              {/* Spring months */}
                              <Cell fill="url(#springGradient)" stroke="#22C55E" strokeWidth={1} />
                              <Cell fill="url(#springGradient)" stroke="#22C55E" strokeWidth={1} />
                              <Cell fill="url(#springGradient)" stroke="#22C55E" strokeWidth={1} />
                              {/* Summer months */}
                              <Cell fill="url(#summerGradient)" stroke="#F97316" strokeWidth={1} />
                              <Cell fill="url(#summerGradient)" stroke="#F97316" strokeWidth={1} />
                              <Cell fill="url(#summerGradient)" stroke="#F97316" strokeWidth={1} />
                              {/* Fall months */}
                              <Cell fill="url(#fallGradient)" stroke="#F59E0B" strokeWidth={1} />
                              <Cell fill="url(#fallGradient)" stroke="#F59E0B" strokeWidth={1} />
                              <Cell fill="url(#fallGradient)" stroke="#F59E0B" strokeWidth={1} />
                              {/* Winter month */}
                              <Cell fill="url(#winterGradient)" stroke="#3B82F6" strokeWidth={1} />
                            </Bar>
                            <Line 
                              type="monotone" 
                              dataKey="baseline" 
                              name="Baseline"
                              stroke="#94a3b8" 
                              strokeWidth={2}
                              dot={{ r: 4, strokeWidth: 2, fill: "#1e293b" }}
                              activeDot={{ r: 6, strokeWidth: 2, fill: "#1e293b" }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Annual totals */}
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Annual Production</div>
                          <div className="text-2xl font-bold mt-1">8,726 kWh</div>
                          <div className="text-sm text-green-500 mt-1">+3% from estimate</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Estimated Savings</div>
                          <div className="text-2xl font-bold mt-1">$1,090.75/yr</div>
                          <div className="text-sm text-green-500 mt-1">$90.90/month avg</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-72 mt-6 md:mt-0">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Production vs. Usage</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Your solar system will provide 83.7% of your energy needs
                        </p>
                        
                        {/* Solar vs Grid visualization */}
                        <div className="relative h-36 bg-gray-100 dark:bg-[#1e222b] rounded-lg overflow-hidden mt-4">
                          <div className="absolute inset-0 flex items-end">
                            <div 
                              className="h-[83.7%] w-full bg-gradient-to-t from-orange-500 to-yellow-400 opacity-80"
                              style={{ borderTopRightRadius: '100px' }}
                            >
                              <div className="absolute top-2 left-4 text-white text-sm font-medium drop-shadow-md">
                                Solar Production
                              </div>
                              <div className="absolute bottom-2 left-4 text-white text-sm font-medium drop-shadow-md">
                                83.7%
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-4 text-gray-600 dark:text-gray-300 text-sm font-medium">
                            Grid Supply
                          </div>
                          <div className="absolute bottom-2 right-4 text-gray-600 dark:text-gray-300 text-sm font-medium">
                            16.3%
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#1e222b]/70 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Performance Factors</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                            <span>Panel efficiency: 21.7%</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                            <span>Shading: Minimal (4%)</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                            <span>Weather adjusted</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                            <span>System degradation: 0.5%/yr</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-4 p-3 bg-gray-100 dark:bg-[#1e222b]/40 rounded-lg border-l-4 border-yellow-500">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Note:</span> Production estimates reflect typical 
                          meteorological year data. Actual results may vary based on weather conditions,
                          system maintenance, and other factors.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ROI Analysis */}
              <div className={cardBaseClass}>
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                      backgroundSize: '30px 30px'
                    }}
                  ></div>
                </div>
                
                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
                
                <div className="card-body relative z-10">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <MdOutlineCalculate size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Return on Investment Analysis
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Detailed financial analysis over a 25-year period
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col md:flex-row gap-6">
                    {/* ROI Table - Left Half */}
                    <div className="w-full md:w-1/2">
                      <div className="bg-gradient-to-br from-[#1e222b]/80 to-[#1e222b]/70 backdrop-blur-md rounded-xl p-5 shadow-xl h-full border border-[#1e222b]/30">
                        <div className="mb-3">
                          <h4 className="text-white font-semibold mb-2">Solar Investment ROI</h4>
                          <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700/50">
                                <th className="py-3 px-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Year</th>
                                <th className="py-3 px-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Production</th>
                                <th className="py-3 px-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Savings</th>
                                <th className="py-3 px-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ROI</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/30">
                              {[1, 5, 10, 15, 20, 25].map(year => {
                                // Calculate values based on year
                                const degradation = 1 - (year * 0.005); // 0.5% degradation per year
                                const production = Math.round(249087 * degradation);
                                const savings = Math.round(77217 * degradation);
                                const cumulative = savings * year;
                                const installationCost = 622500; // 622 panels * 250W * $4/W
                                const roi = ((cumulative / installationCost) * 100).toFixed(1);
                                
                                // Define classes based on year
                                const rowClass = year === 1 
                                  ? "bg-gradient-to-r from-orange-500/10 to-transparent" 
                                  : year === 25 
                                    ? "bg-gradient-to-r from-green-500/10 to-transparent" 
                                    : "";
                                
                                return (
                                  <tr key={year} className={`${rowClass} hover:bg-white/5 transition-colors duration-150`}>
                                    <td className="py-3 px-2 font-medium text-sm text-white">{year}</td>
                                    <td className="py-3 px-2 text-sm text-gray-300">{Math.round(production/1000)}k kWh</td>
                                    <td className="py-3 px-2 text-sm text-gray-300">${Math.round(cumulative/1000)}k</td>
                                    <td className="py-3 px-2 text-sm font-medium">
                                      <span className={`${parseFloat(roi) > 100 ? 'text-green-400' : 'text-amber-400'}`}>
                                        {roi}%
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Key Financial Metrics */}
                        <div className="grid grid-cols-2 gap-3 mt-5">
                          <div className="bg-gradient-to-br from-[#1e222b]/80 to-[#1e222b]/70 p-3 rounded-lg border border-[#1e222b]/20">
                            <div className="text-xs text-gray-400 mb-1">Break-even Point</div>
                            <div className="font-semibold text-lg text-white">8.1 years</div>
                          </div>
                          <div className="bg-gradient-to-br from-[#1e222b]/80 to-[#1e222b]/70 p-3 rounded-lg border border-[#1e222b]/20">
                            <div className="text-xs text-gray-400 mb-1">25-Year ROI</div>
                            <div className="font-semibold text-lg text-green-400">310.4%</div>
                          </div>
                          <div className="bg-gradient-to-br from-[#1e222b]/80 to-[#1e222b]/70 p-3 rounded-lg border border-[#1e222b]/20">
                            <div className="text-xs text-gray-400 mb-1">Total Investment</div>
                            <div className="font-semibold text-lg text-white">$622,500</div>
                          </div>
                          <div className="bg-gradient-to-br from-[#1e222b]/80 to-[#1e222b]/70 p-3 rounded-lg border border-[#1e222b]/20">
                            <div className="text-xs text-gray-400 mb-1">Annual Savings</div>
                            <div className="font-semibold text-lg text-green-400">$77,217</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Energy Today Panel - Right Half */}
                    <div className="w-full md:w-1/2">
                      <div className="bg-[#1e222b] rounded-xl h-full overflow-hidden relative shadow-lg border border-[#1e222b]">
                        {/* Image with direct text overlay instead of a separate overlay box */}
                        <div className="relative h-full">
                          <img 
                            src="/images/solar/Energy_today.png" 
                            alt="Energy Today Monitor" 
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Directly overlay minimal text on the image */}
                          <div className="absolute top-5 left-5 flex flex-col gap-2">
                            <div className="inline-flex items-center bg-transparent backdrop-blur-sm py-1 px-2 rounded text-white/90 text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                Peak: 4.2 kW
                              </span>
                            </div>
                            
                            <div className="inline-flex items-center bg-transparent backdrop-blur-sm py-1 px-2 rounded text-white/90 text-sm font-medium">
                              <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Daily: 5.8 kWh
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installation Timeline */}
              <div className={cardBaseClass}>
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" 
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000000 20px, #000000 22px)',
                      backgroundSize: '30px 30px'
                    }}
                  ></div>
                </div>
                
                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
                
                <div className="card-body relative z-10">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <FaRegCalendarAlt size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Installation Timeline
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Comprehensive timeline for the commercial solar installation process (6-9 months)
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="bg-gray-50 dark:bg-[#1e222b]/50 rounded-xl p-6 backdrop-blur-sm">
                      {/* Gantt Chart Header */}
                      <div className="flex border-b border-gray-200 dark:border-[#1e222b] pb-2 mb-4">
                        <div className="w-56 flex-shrink-0 font-semibold">Project Phase</div>
                        <div className="flex-1 flex">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="flex-1 text-center text-sm font-medium">
                              Month {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Gantt Chart Rows */}
                      <div className="space-y-8">
                        {/* Initial Assessment */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Initial Assessment</div>
                            <div className="text-xs text-gray-500">4-6 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md"
                              style={{ width: '22%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Site Assessment & Engineering
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Detailed Design */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Detailed Design</div>
                            <div className="text-xs text-gray-500">4-8 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[15%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-90"
                              style={{ width: '25%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Engineering & System Design
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Permitting & Approvals */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Permitting & Approvals</div>
                            <div className="text-xs text-gray-500">2-3 months</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[30%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-80"
                              style={{ width: '33.33%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Local Permits, Utility Approvals, Incentive Applications
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Procurement */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Procurement</div>
                            <div className="text-xs text-gray-500">6-10 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[40%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-70"
                              style={{ width: '25%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Equipment Ordering & Delivery
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Site Preparation */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Site Preparation</div>
                            <div className="text-xs text-gray-500">2-4 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[55%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-85"
                              style={{ width: '15%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Roof Prep & Structural Work
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Installation */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Installation</div>
                            <div className="text-xs text-gray-500">4-8 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[60%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-95"
                              style={{ width: '25%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Racking, Panel Mounting, Electrical Wiring
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Commissioning */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Commissioning</div>
                            <div className="text-xs text-gray-500">2-3 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[82%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md"
                              style={{ width: '10%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                System Testing & Activation
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Utility Interconnection */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Utility Interconnection</div>
                            <div className="text-xs text-gray-500">2-4 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[88%] h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md opacity-90"
                              style={{ width: '12%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Final Inspection & Grid Connection
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Milestones */}
                      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-emerald-500 font-semibold mb-2">Key Milestones</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                              <span>Site Assessment Completion</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500 opacity-80"></div>
                              <span>All Permits Approved</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500 opacity-90"></div>
                              <span>Installation Complete</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                              <span>System Operational</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-orange-500 font-semibold mb-2">Critical Dependencies</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Structural Engineering Approval</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Local Building Permits</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Utility Interconnection Agreement</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Equipment Delivery Schedules</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-orange-500 font-semibold mb-2">Potential Delays</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Weather Conditions</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Supply Chain Issues</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Permitting Delays</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Utility Inspection Schedules</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className={cardBaseClass}>
                <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/30 via-orange-500/20 to-orange-500/25 opacity-25"></div>
                <div className="card-body relative z-10">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="bg-white/10 p-6 rounded-xl text-white shadow-lg backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
                      <FaSolarPanel size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">Next Steps</h3>
                      <p className="text-white/90 text-lg leading-relaxed">
                        Based on our comprehensive analysis, this facility is an excellent candidate for solar installation. 
                        The next step is to reach out to the facility manager to discuss this opportunity and schedule a site visit.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all backdrop-blur-sm transform hover:scale-105">
                      Contact Facility Manager
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-white hover:bg-[#1e222b]/10 text-orange-600 font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      Generate Proposal
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Continue Button */}
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleContinue}
                  className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-600 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3 group relative overflow-hidden"
                >
                  {/* Decorative patterns */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" 
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 22px)',
                        backgroundSize: '30px 30px'
                      }}
                    ></div>
                  </div>
                  
                  {/* Gradient orbs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full"></div>
                  
                  <span className="relative z-10 text-lg">Continue to Email Automation</span>
                  <MdArrowForward className="relative z-10 text-2xl group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarPanelPotential; 