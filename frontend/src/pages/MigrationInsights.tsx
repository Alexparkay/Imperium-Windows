import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineStorage, MdOutlineBusiness, MdOutlineAttachMoney, MdArrowForward, MdArrowBack, MdEdit, MdRefresh, MdCloudUpload, MdOutlineCalculate, MdOutlineSettings, MdInfoOutline, MdClose, MdAccessTime, MdOutlineSavings, MdOutlineTimeline } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { FaServer, FaMoneyBillWave, FaDatabase, FaChartLine, FaRegCalendarAlt, FaWindowMaximize, FaCalculator, FaLightbulb, FaCheckCircle } from 'react-icons/fa';

// Define types for our data
interface WindowSystem {
  id: string;
  name: string;
  complexity: number;
  efficiency: number;
  windows: {
    standard: number;
    premium: number;
  };
  costPerWindow: number;
}

interface ReplacementPotential {
  calculated: boolean;
  totalWindows: number;
  selectedSystemType: string;
  annualSavings: number;
  replacementCost: number;
  energySavings: number;
  paybackPeriod: number;
  roi: number;
  monthlySavings: Array<{
    month: string;
    savings: number;
  }>;
}

interface Building {
  id: number;
  name: string;
  type: string;
  location: string;
  analysis: {
    buildingType: string;
    squareFootage: number;
    windowDensity: number;
    systemComplexity: number;
  };
  energyAssessment: {
    annualCost: number;
    annualMaintenance: number;
  };
  replacementPotential: ReplacementPotential;
}

// Section 179D calculation data
interface Section179DData {
  squareFootage: number;
  energySavingsPercent: number;
  baseRate: number;
  bonusRate: number;
  baseDeduction: number;
  bonusDeduction: number;
  totalDeduction: number;
  paybackReduction: number;
}

const WindowReplacementInsights = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(true);
  const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0);
  const [selectedSystemType, setSelectedSystemType] = useState('standard');
  const [iframeKey, setIframeKey] = useState(1);
  const [iframeLoaded, setIframeLoaded] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Available window system types
  const systemTypes: WindowSystem[] = [
    {
      id: 'standard',
      name: 'Luxwall Enthermal™ Glass',
      complexity: 2,
      efficiency: 0.75,
      windows: {
        standard: 500,
        premium: 200
      },
      costPerWindow: 650
    },
    {
      id: 'premium',
      name: 'Luxwall Premium Series',
      complexity: 3,
      efficiency: 0.85,
      windows: {
        standard: 1000,
        premium: 500
      },
      costPerWindow: 850
    },
    {
      id: 'enterprise',
      name: 'Luxwall Enterprise Solution',
      complexity: 4,
      efficiency: 0.95,
      windows: {
        standard: 5000,
        premium: 2000
      },
      costPerWindow: 1200
    }
  ];
  
  // Sample buildings data with analysis and energy assessment results
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: 1,
      name: "Global Manufacturing Complex",
      type: "Manufacturing",
      location: "Chicago, IL",
      analysis: {
        buildingType: "Manufacturing",
        squareFootage: 500000,
        windowDensity: 0.25,
        systemComplexity: 3.5
      },
      energyAssessment: {
        annualCost: 285000,
        annualMaintenance: 72000
      },
      replacementPotential: {
        calculated: false,
        totalWindows: 0,
        selectedSystemType: '',
        annualSavings: 0,
        replacementCost: 0,
        energySavings: 0,
        paybackPeriod: 0,
        roi: 0,
        monthlySavings: []
      }
    },
    {
      id: 2,
      name: "Midwest Retail Center",
      type: "Retail",
      location: "Minneapolis, MN",
      analysis: {
        buildingType: "Retail/Commercial",
        squareFootage: 320000,
        windowDensity: 0.18,
        systemComplexity: 2.8
      },
      energyAssessment: {
        annualCost: 185000,
        annualMaintenance: 49000
      },
      replacementPotential: {
        calculated: false,
        totalWindows: 0,
        selectedSystemType: '',
        annualSavings: 0,
        replacementCost: 0,
        energySavings: 0,
        paybackPeriod: 0,
        roi: 0,
        monthlySavings: []
      }
    },
    {
      id: 3,
      name: "Western Healthcare Campus",
      type: "Healthcare",
      location: "Denver, CO",
      analysis: {
        buildingType: "Healthcare",
        squareFootage: 780000,
        windowDensity: 0.14,
        systemComplexity: 4.2
      },
      energyAssessment: {
        annualCost: 325000,
        annualMaintenance: 87000
      },
      replacementPotential: {
        calculated: false,
        totalWindows: 0,
        selectedSystemType: '',
        annualSavings: 0,
        replacementCost: 0,
        energySavings: 0,
        paybackPeriod: 0,
        roi: 0,
        monthlySavings: []
      }
    }
  ]);

  const currentBuilding = buildings[currentBuildingIndex];
  const selectedSystem = systemTypes.find(system => system.id === selectedSystemType)!;

  // Calculate Section 179D tax benefits
  const calculate179D = (squareFootage: number, energySavingsPercent: number = 40): Section179DData => {
    const baseRate = 0.50 + (energySavingsPercent - 25) * 0.02; // $0.50-$1.00 for 25%-50% savings
    const bonusRate = 2.50 + (energySavingsPercent - 25) * 0.10; // $2.50-$5.00 with prevailing wage
    
    const baseDeduction = Math.round(squareFootage * baseRate);
    const bonusDeduction = Math.round(squareFootage * bonusRate);
    const totalDeduction = bonusDeduction; // Assuming prevailing wage requirements are met
    
    return {
      squareFootage,
      energySavingsPercent,
      baseRate,
      bonusRate,
      baseDeduction,
      bonusDeduction,
      totalDeduction,
      paybackReduction: Math.round(totalDeduction * 0.35) // Assuming 35% tax rate
    };
  };

  const section179DData = calculate179D(currentBuilding.analysis.squareFootage, 42);

  // Modal content data
  const modalContent = {
    section179D: {
      title: "Section 179D Tax Deduction",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 p-6 rounded-xl border border-blue-500/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCalculator className="text-blue-400" />
              Why Luxwall is the Smart Choice
            </h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              The Section 179D tax deduction significantly enhances the financial appeal of Luxwall's energy-efficient glass solutions. 
              With Luxwall's Enthermal™ glass achieving 40-45% HVAC energy cost reduction, your project qualifies for maximum deductions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-blue-400 font-semibold">Base Deduction</div>
                <div className="text-2xl font-bold text-white">${section179DData.baseDeduction.toLocaleString()}</div>
                <div className="text-sm text-gray-400">${section179DData.baseRate.toFixed(2)}/sq ft</div>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <div className="text-green-400 font-semibold">Bonus Deduction</div>
                <div className="text-2xl font-bold text-white">${section179DData.bonusDeduction.toLocaleString()}</div>
                <div className="text-sm text-gray-400">${section179DData.bonusRate.toFixed(2)}/sq ft</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white">Key Benefits:</h5>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Immediate Tax Savings</div>
                  <div className="text-gray-400 text-sm">Up to ${section179DData.paybackReduction.toLocaleString()} in immediate tax benefits</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Recurring Benefits</div>
                  <div className="text-gray-400 text-sm">Deduction can be claimed every 4 years for new upgrades</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Enhanced ROI</div>
                  <div className="text-gray-400 text-sm">2-7 year payback with up to 50% lower installation costs</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    energyEfficiency: {
      title: "Luxwall Energy Efficiency Advantage",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 rounded-xl border border-green-500/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaLightbulb className="text-yellow-400" />
              Superior Performance Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">R-18 to R-21</div>
                <div className="text-sm text-gray-400">Insulation Value</div>
                <div className="text-xs text-gray-500">vs standard R-3 to R-7</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">40-45%</div>
                <div className="text-sm text-gray-400">HVAC Reduction</div>
                <div className="text-xs text-gray-500">Heating & Cooling</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">50%</div>
                <div className="text-sm text-gray-400">Lower Install Cost</div>
                <div className="text-xs text-gray-500">vs full replacement</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white">Why This Matters:</h5>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Qualifies for Higher 179D Tiers</div>
                  <div className="text-gray-400 text-sm">40%+ energy savings pushes you into maximum deduction categories</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Addresses Multiple Systems</div>
                  <div className="text-gray-400 text-sm">Building envelope, HVAC load reduction, and lighting optimization</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium">Avoids Full Facade Replacement</div>
                  <div className="text-gray-400 text-sm">Retrofit existing windows without structural changes</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    financialBenefits: {
      title: "Complete Financial Picture",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-green-500/10 p-6 rounded-xl border border-purple-500/20">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-400" />
              Total Cost Offset Analysis
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-gray-300">Section 179D Tax Deduction</span>
                <span className="text-green-400 font-bold">${section179DData.totalDeduction.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-gray-300">Annual Energy Savings</span>
                <span className="text-green-400 font-bold">$89,425</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                <span className="text-gray-300">Maintenance Reduction</span>
                <span className="text-green-400 font-bold">$61,200</span>
              </div>
              <div className="border-t border-gray-600 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total First Year Benefit</span>
                  <span className="text-green-400 font-bold text-xl">${(section179DData.totalDeduction + 89425 + 61200).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
            <h5 className="text-white font-semibold mb-2">Strategic Positioning</h5>
            <p className="text-gray-300 text-sm">
              This combination of immediate tax benefits and long-term operational savings makes Luxwall particularly attractive for 
              NYC Local Law 97 compliance, REITs seeking ESG investments, and government building retrofits.
            </p>
          </div>
        </div>
      )
    }
  };

  // Window replacement data
  const replacementData = {
    yearlyEnergySavings: '$89,425/year',
    yearlyCost: '$32,375',
    systemSize: '1,250 windows',
    costsReduced: '73.5%',
    monthlyAverage: '$7,452',
    firstYear: '$57,050',
    threeYearTotal: '$268,275',
    costWithoutReplacement: '$412,500',
    costWithReplacement: '$144,225',
    totalLifetimeSavings: '$268,275',
    breakEven: '14 months',
    address: '303 S Technology Ct, Broomfield, CO',
    state: 'CO',
    zipCode: '80021',
    currentCostPerWindow: '$275/year',
    monthlyOpex: '$34,375',
    totalWindows: '1,250 windows',
    energyIncentives: '$12,500',
    replacementCost: '$750,000 total',
    implementationTime: '9 months',
    totalReplacementCost: '$875,000',
    windowCost: '$950 per window',
    totalBuildings: '42 buildings',
    totalFloors: '18 floors',
    annualMaintenanceHours: '1,280 hours',
    co2Reduction: '185 tons/year',
    energyEfficiency: '86% improved',
    annualSavings: '$89,425',
    remainingEnergyCost: '$23,075',
    remainingCost: '$1,923/month',
    firstYearROI: '65.2%'
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

  const calculateReplacementPotential = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Calculate how many windows will be replaced
      const windowCount = Math.round(currentBuilding.analysis.squareFootage * currentBuilding.analysis.windowDensity / 100);
      const totalWindows = windowCount;
      
      // Calculate annual savings based on system type and complexity
      let efficiencyFactor = 0;
      if (currentBuilding.type.includes("Manufacturing")) {
        efficiencyFactor = 0.68;
      } else if (currentBuilding.type.includes("Retail")) {
        efficiencyFactor = 0.72;
      } else if (currentBuilding.type.includes("Healthcare")) {
        efficiencyFactor = 0.65;
      } else {
        efficiencyFactor = 0.70; // Default
      }
      
      const annualSavings = Math.round(currentBuilding.energyAssessment.annualCost * selectedSystem.efficiency * efficiencyFactor);
      
      // Calculate costs and savings
      const replacementCost = Math.round(totalWindows * selectedSystem.costPerWindow + 100000); // Cost per window plus $100k base cost
      const energySavings = Math.round(currentBuilding.energyAssessment.annualMaintenance * 0.85); // 85% maintenance cost reduction
      const paybackPeriod = parseFloat(((replacementCost) / (annualSavings + energySavings)).toFixed(1));
      const roi = parseFloat((((annualSavings + energySavings) * 3 - replacementCost) / replacementCost * 100).toFixed(1)); // 3-year ROI
      
      // Generate monthly savings data based on implementation phases
      const monthlySavingsRamp = [0.05, 0.10, 0.20, 0.30, 0.45, 0.60, 0.75, 0.90, 1.0, 1.0, 1.0, 1.0];
      const monthlySavings = [
        { month: 'Jan', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[0]) },
        { month: 'Feb', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[1]) },
        { month: 'Mar', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[2]) },
        { month: 'Apr', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[3]) },
        { month: 'May', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[4]) },
        { month: 'Jun', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[5]) },
        { month: 'Jul', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[6]) },
        { month: 'Aug', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[7]) },
        { month: 'Sep', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[8]) },
        { month: 'Oct', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[9]) },
        { month: 'Nov', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[10]) },
        { month: 'Dec', savings: Math.round((annualSavings / 12) * monthlySavingsRamp[11]) }
      ];
      
      // Update the current building with replacement potential data
      const updatedBuildings = [...buildings];
      updatedBuildings[currentBuildingIndex] = {
        ...currentBuilding,
        replacementPotential: {
          calculated: true,
          totalWindows,
          selectedSystemType: selectedSystem.id,
          annualSavings,
          replacementCost,
          energySavings,
          paybackPeriod,
          roi,
          monthlySavings
        }
      };
      
      setBuildings(updatedBuildings);
      toast.success('Window replacement potential calculation complete');
    }, 2000);
  };

  const handleNext = () => {
    if (currentBuildingIndex < buildings.length - 1) {
      setCurrentBuildingIndex(currentBuildingIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentBuildingIndex > 0) {
      setCurrentBuildingIndex(currentBuildingIndex - 1);
    }
  };

  const handleContinue = () => {
    // Only navigate when this function is explicitly called
    navigate('/outreach');
  };

  const handleSystemTypeChange = (systemId: string) => {
    setSelectedSystemType(systemId);
    
    // If we already have calculations, recalculate with the new system type
    if (currentBuilding.replacementPotential.calculated) {
      calculateReplacementPotential();
    }
  };

  // Calculate percentage of costs that can be reduced by window replacement
  const calculateCostReduction = () => {
    if (!currentBuilding.replacementPotential.calculated) return 0;
    
    return Math.min(100, Math.round(((currentBuilding.replacementPotential.annualSavings + currentBuilding.replacementPotential.energySavings) / (currentBuilding.energyAssessment.annualCost + currentBuilding.energyAssessment.annualMaintenance)) * 100));
  };

  // Data for the cost reduction pie chart
  const costReductionData = [
    { name: 'Cost Reduction', value: calculateCostReduction() },
    { name: 'Remaining Cost', value: 100 - calculateCostReduction() }
  ];
  
  const COLORS = ['#89a3c2', '#94a3b8'];

  // Modal functions
  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Modal component
  const Modal = ({ isOpen, onClose, title, children }: { 
    isOpen: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode; 
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <MdClose className="text-white text-xl" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
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
              <span className="text-gray-300">Savings:</span>
              <span className="text-white font-medium">${(payload[0].value || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-gray-300">Baseline:</span>
              <span className="text-white font-medium">${(payload[1].value || 0).toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              ${Math.round(Number(payload[0]?.value || 0) * 0.08).toLocaleString()} operational savings
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
        <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none animate-pulse"></div>
        <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating data particles */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-400/40 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/35 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-8 w-[700px]">
          {/* Financial Calculations Display */}
          <div className="relative group w-full">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Luxwall Financial Analysis with glass effect */}
            <div className="relative backdrop-blur-md bg-black/40 p-6 rounded-3xl border border-white/10">
              {/* Scanning line effect */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse"></div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Energy Costs (Annual)</span>
                      <span className="text-white font-mono transition-all duration-300">$285,000</span>
                    </div>
                    <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-red-400/50 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Post-Luxwall Energy Costs</span>
                      <span className="text-white font-mono transition-all duration-300">$165,575</span>
                    </div>
                    <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full w-[58%] bg-emerald-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Luxwall Implementation</span>
                      <span className="text-white font-mono transition-all duration-300">$875,000</span>
                    </div>
                    <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full w-[26%] bg-blue-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Section 179D Tax Benefit</span>
                      <span className="text-white font-mono transition-all duration-300">$1,950,000</span>
                    </div>
                    <div className="h-1 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-green-400/50 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e222b]/70 backdrop-blur-md rounded-xl p-3 mt-4 border border-white/5">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Enhanced Payback Period</div>
                    <div className="text-2xl font-mono text-white">2.1 <span className="text-sm">years</span></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Animated calculation figures */}
                  <div className="bg-[#1e222b]/60 p-3 rounded-xl border border-white/5">
                    <div className="font-mono text-xs text-gray-400 mb-1">Window System Analysis</div>
                    <div className="font-mono text-sm text-emerald-400">
                      <div className="flex justify-between mb-1">
                        <span>Window Units:</span>
                        <span className="animate-pulse">1,250</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Enthermal™ Glass:</span>
                        <span>R-18 to R-21</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>HVAC Reduction:</span>
                        <span className="animate-pulse">42%</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Installation:</span>
                        <span>9 months</span>
                      </div>
                      <div className="mt-1 pt-1 border-t border-white/10 flex justify-between">
                        <span>Total Investment:</span>
                        <span className="animate-pulse">$875,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#1e222b]/60 p-3 rounded-xl border border-white/5">
                    <div className="font-mono text-xs text-gray-400 mb-1">Annual Savings Projection</div>
                    <div className="font-mono text-sm text-emerald-400">
                      <div className="flex justify-between mb-1">
                        <span>Energy Savings:</span>
                        <span className="animate-pulse">$89,425</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Maintenance Reduction:</span>
                        <span>$61,200</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>CO₂ Reduction:</span>
                        <span className="animate-pulse">185 tons</span>
                      </div>
                      <div className="mt-1 pt-1 border-t border-white/10 flex justify-between">
                        <span>Total Annual:</span>
                        <span className="animate-pulse">$150,625</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 bg-[#1e222b]/60 p-3 rounded-xl border border-white/5 font-mono">
                      <div className="text-xs text-gray-400 mb-1">Net Present Value</div>
                      <div className="text-lg text-emerald-400 animate-pulse">$2.1M</div>
                    </div>
                    <div className="flex-1 bg-[#1e222b]/60 p-3 rounded-xl border border-white/5 font-mono">
                      <div className="text-xs text-gray-400 mb-1">Enhanced ROI</div>
                      <div className="text-lg text-emerald-400 animate-pulse">285%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Analyzing Luxwall Implementation Potential</h2>
            <p className="text-gray-400 mb-8 animate-pulse" style={{ animationDelay: '0.5s' }}>Evaluating building envelope efficiency, energy performance metrics, and Section 179D tax optimization...</p>
            
            {/* Enhanced Progress bars with staggered animations */}
            <div className="w-full space-y-6">
              <div className="transform transition-all duration-500 hover:scale-105">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 animate-pulse">Analyzing building envelope performance</span>
                  <span className="text-blue-500 font-medium animate-pulse">100%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-500/20"></div>
                </div>
              </div>
              
              <div className="transform transition-all duration-500 hover:scale-105" style={{ transitionDelay: '0.1s' }}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 animate-pulse" style={{ animationDelay: '0.2s' }}>Evaluating Enthermal™ glass compatibility</span>
                  <span className="text-blue-500 font-medium animate-pulse" style={{ animationDelay: '0.2s' }}>95%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-500/20" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              
              <div className="transform transition-all duration-500 hover:scale-105" style={{ transitionDelay: '0.2s' }}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 animate-pulse" style={{ animationDelay: '0.4s' }}>Calculating Section 179D tax benefits</span>
                  <span className="text-green-500 font-medium animate-pulse" style={{ animationDelay: '0.4s' }}>90%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/20" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
              
              <div className="transform transition-all duration-500 hover:scale-105" style={{ transitionDelay: '0.3s' }}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 animate-pulse" style={{ animationDelay: '0.6s' }}>Projecting HVAC energy savings</span>
                  <span className="text-emerald-500 font-medium animate-pulse" style={{ animationDelay: '0.6s' }}>85%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/20" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>
              
              <div className="transform transition-all duration-500 hover:scale-105" style={{ transitionDelay: '0.4s' }}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300 animate-pulse" style={{ animationDelay: '0.8s' }}>Optimizing installation timeline</span>
                  <span className="text-cyan-500 font-medium animate-pulse" style={{ animationDelay: '0.8s' }}>75%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/20" style={{ animationDelay: '0.8s' }}></div>
                </div>
              </div>
            </div>
            
            {/* Processing indicator with animated dots */}
            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="ml-3 text-gray-400 animate-pulse">Processing advanced analytics...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Define base classes for cards to match the Home page styling
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#1e222b]/80 via-[#1e222b]/50 to-[rgba(30,34,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/15 group relative overflow-hidden";

  return (
    <div className="w-full px-1 py-2 bg-[#020305] min-h-screen min-w-full relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-40 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/8 via-cyan-500/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-cyan-500/3 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Glassmorphic grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
              <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col gap-6">
          {/* Enhanced title section */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                <FaWindowMaximize size={32} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Luxwall Window Replacement Analytics
                </h1>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  Powered by Section 179D Tax Benefits
                  <button
                    onClick={() => openModal('section179D')}
                    className="p-1 rounded-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors"
                  >
                    <MdInfoOutline className="text-blue-400 text-sm" />
                  </button>
                </p>
              </div>
            </div>
            
            {/* Section 179D highlight badge */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
                <div className="text-green-400 font-semibold text-sm">Section 179D Eligible</div>
                <div className="text-white font-bold text-xl">${section179DData.totalDeduction.toLocaleString()}</div>
                <div className="text-gray-400 text-xs">Tax Deduction Available</div>
              </div>
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
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
              
              <div className="card-body flex flex-col items-center justify-center py-16 relative z-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="loading loading-spinner loading-lg text-blue-500 relative"></div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-4">
                  Calculating Window Replacement Potential
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
                  Our AI is analyzing system architecture, database complexity, and operational costs to determine optimal window replacement strategy...
                </p>
                <div className="w-full max-w-md space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Analyzing system architecture</span>
                      <span className="text-blue-500 font-medium">100%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                                              <div className="h-full w-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Evaluating databases</span>
                      <span className="text-blue-500 font-medium">95%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                                              <div className="h-full w-[95%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Calculating migration requirements</span>
                      <span className="text-blue-500 font-medium">80%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                                              <div className="h-full w-[80%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Estimating cost savings</span>
                      <span className="text-blue-500 font-medium">60%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-[#1e222b] rounded-full overflow-hidden">
                      <div className="h-full w-[60%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Statistics Grid with Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Enhanced Implementation Details Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl group">
                  {/* Full-width image container */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/SAP/9f8d193c67c44ea39fb7ebbbc251526f.jpg" 
                      alt="Luxwall Implementation" 
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Enhanced glassmorphic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent backdrop-blur-sm"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                    {/* Header with info icon */}
                    <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-blue-500/40 to-blue-600/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-blue-500/30">
                            <FaWindowMaximize className="text-lg text-blue-300" />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            Luxwall Implementation
                          </h3>
                        </div>
                        <button
                          onClick={() => openModal('energyEfficiency')}
                          className="p-2 rounded-full bg-blue-500/30 hover:bg-blue-500/50 transition-colors border border-blue-500/40"
                        >
                          <MdInfoOutline className="text-blue-300" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">System Scale</span>
                        <span className="text-sm font-semibold text-white">1,250 windows</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Implementation Time</span>
                        <span className="text-sm font-semibold text-white">9 months</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Cost per Window</span>
                        <span className="text-sm font-semibold text-white">$700/window</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Total Investment</span>
                        <span className="text-sm font-semibold text-white">$875,000</span>
                      </div>
                    </div>
                    
                    {/* Section 179D highlight */}
                    <div className="mt-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-500/30">
                      <div className="text-green-400 font-semibold text-xs">Section 179D Benefit</div>
                      <div className="text-white font-bold">${section179DData.totalDeduction.toLocaleString()} Tax Deduction</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Financial Benefits Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl group">
                  {/* Full-width image container */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/SAP/eeec8cab190002a2ebdb955a175312a0.jpg" 
                      alt="Financial Benefits" 
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Enhanced glassmorphic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent backdrop-blur-sm"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                    {/* Header with info icon */}
                    <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-green-500/40 to-blue-500/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-green-500/30">
                            <FaMoneyBillWave className="text-lg text-green-300" />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            Financial Benefits
                          </h3>
                        </div>
                        <button
                          onClick={() => openModal('financialBenefits')}
                          className="p-2 rounded-full bg-green-500/30 hover:bg-green-500/50 transition-colors border border-green-500/40"
                        >
                          <MdInfoOutline className="text-green-300" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Annual Energy Savings</span>
                        <span className="text-sm font-semibold text-white">$89,425</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Monthly Average</span>
                        <span className="text-sm font-semibold text-white">$7,452</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Maintenance Reduction</span>
                        <span className="text-sm font-semibold text-white">$61,200</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Section 179D Deduction</span>
                        <span className="text-sm font-semibold text-green-400">${section179DData.totalDeduction.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Total benefit highlight */}
                    <div className="mt-4 bg-gradient-to-r from-green-500/30 to-blue-500/30 backdrop-blur-sm rounded-xl p-3 border border-green-500/40">
                      <div className="text-green-400 font-semibold text-xs">Total First Year Benefit</div>
                      <div className="text-white font-bold text-lg">${(section179DData.totalDeduction + 89425 + 61200).toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Energy Assessment Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl group">
                  {/* Full-width image container */}
                  <div className="absolute inset-0">
                    <img 
                      src="/images/SAP/d2e31c8edf938cb0e91610502f699f6c.jpg" 
                      alt="Energy Assessment" 
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Enhanced glassmorphic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent backdrop-blur-sm"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                    {/* Header with info icon */}
                    <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-purple-500/40 to-blue-500/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-purple-500/30">
                            <MdOutlineBusiness className="text-lg text-purple-300" />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            Energy Assessment
                          </h3>
                        </div>
                        <button
                          onClick={() => openModal('energyEfficiency')}
                          className="p-2 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-colors border border-purple-500/40"
                        >
                          <MdInfoOutline className="text-purple-300" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Current System</span>
                        <span className="text-sm font-semibold text-white">Standard Windows</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Luxwall Solution</span>
                        <span className="text-sm font-semibold text-white">Enthermal™ Glass</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Energy Savings</span>
                        <span className="text-sm font-semibold text-white">42% HVAC Reduction</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Insulation Value</span>
                        <span className="text-sm font-semibold text-white">R-18 to R-21</span>
                      </div>
                    </div>
                    
                    {/* 179D qualification highlight */}
                    <div className="mt-4 bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30">
                      <div className="text-blue-400 font-semibold text-xs">179D Qualified Systems</div>
                      <div className="text-white font-bold text-sm">Building Envelope + HVAC + Lighting</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Performance Metrics Card */}
                <div className="relative h-[400px] overflow-hidden rounded-3xl group">
                  {/* Full-width image container with increased right offset */}
                  <div className="absolute inset-0 translate-x-[20%]">
                    <img 
                      src="/images/SAP/ef752e7a0381c7ef856d5c4b3b627c13.jpg" 
                      alt="Performance Metrics" 
                      className="w-[115%] h-full object-cover object-left scale-95"
                    />
                    {/* Enhanced glassmorphic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent backdrop-blur-sm"></div>
                  </div>

                  {/* Content container */}
                  <div className="relative z-10 h-full w-[50%] p-6 flex flex-col justify-center">
                    {/* Header with info icon */}
                    <div className="bg-black/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-cyan-500/40 to-green-500/40 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-cyan-500/30">
                            <FaCalculator className="text-lg text-cyan-300" />
                          </div>
                          <h3 className="text-lg font-bold text-white">
                            Performance Metrics
                          </h3>
                        </div>
                        <button
                          onClick={() => openModal('section179D')}
                          className="p-2 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 transition-colors border border-cyan-500/40"
                        >
                          <MdInfoOutline className="text-cyan-300" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-black/40 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Building Size</span>
                        <span className="text-sm font-semibold text-white">{currentBuilding.analysis.squareFootage.toLocaleString()} sq ft</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">Window Count</span>
                        <span className="text-sm font-semibold text-white">1,250 windows</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/20">
                        <span className="text-sm text-gray-300">CO₂ Reduction</span>
                        <span className="text-sm font-semibold text-white">185 tons/year</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-300">Payback Period</span>
                        <span className="text-sm font-semibold text-white">2-7 years</span>
                      </div>
                    </div>
                    
                    {/* ROI highlight */}
                    <div className="mt-4 bg-gradient-to-r from-green-500/30 to-cyan-500/30 backdrop-blur-sm rounded-xl p-3 border border-green-500/40">
                      <div className="text-green-400 font-semibold text-xs">Enhanced ROI with 179D</div>
                      <div className="text-white font-bold text-sm">Up to 50% faster payback</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Section 179D Analytics Section */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                      Luxwall Analytics & Section 179D Benefits
                    </h2>
                    <button
                      onClick={() => openModal('section179D')}
                      className="p-2 rounded-full bg-blue-500/15 hover:bg-blue-500/25 transition-colors border border-blue-500/20"
                    >
                      <MdInfoOutline className="text-blue-400" />
                    </button>
                  </div>
                  
                  {/* Quick 179D summary */}
                  <div className="hidden lg:block bg-gradient-to-r from-blue-500/12 to-cyan-500/8 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3">
                    <div className="text-blue-400 font-semibold text-sm">Immediate Tax Benefit</div>
                    <div className="text-white font-bold text-lg">${section179DData.paybackReduction.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">35% of ${section179DData.totalDeduction.toLocaleString()} deduction</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Left side - Radar chart for system complexity */}
                    <div className="relative bg-gradient-to-br from-blue-500/8 via-blue-400/4 to-cyan-500/6 backdrop-blur-xl rounded-xl p-6 h-[500px] border border-white/10 overflow-hidden">
                      {/* Subtle animated background pattern */}
                      <div className="absolute inset-0 opacity-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-transparent animate-pulse"></div>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FaChartLine className="text-blue-400" />
                          System Complexity Analysis
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                          <RadarChart cx="50%" cy="50%" outerRadius={120} data={[
                            { subject: 'Window Size', A: 120, B: 110, fullMark: 150 },
                            { subject: 'Custom Code', A: 98, B: 130, fullMark: 150 },
                            { subject: 'Interfaces', A: 86, B: 130, fullMark: 150 },
                            { subject: 'Window Count', A: 99, B: 100, fullMark: 150 },
                            { subject: 'Transactions', A: 85, B: 90, fullMark: 150 },
                            { subject: 'Modules', A: 65, B: 85, fullMark: 150 },
                          ]}>
                            <PolarGrid stroke="rgba(255,255,255,0.2)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                            <Radar name="Legacy System" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} strokeWidth={2} />
                            <Radar name="Smart Windows" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
                            <Legend wrapperStyle={{ color: '#94a3b8' }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Right side - Cost comparison area chart */}
                    <div className="relative bg-gradient-to-br from-blue-500/8 via-cyan-500/4 to-blue-400/6 backdrop-blur-xl rounded-xl p-6 h-[500px] border border-white/10 overflow-hidden">
                      {/* Subtle animated background pattern */}
                      <div className="absolute inset-0 opacity-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/15 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FaMoneyBillWave className="text-blue-400" />
                          5-Year TCO Comparison
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                          <AreaChart
                            data={[
                              { year: 'Year 1', legacy: 1250000, cloud: 1025000 },
                              { year: 'Year 2', legacy: 1312500, cloud: 875000 },
                              { year: 'Year 3', legacy: 1378125, cloud: 918750 },
                              { year: 'Year 4', legacy: 1447031, cloud: 964688 },
                              { year: 'Year 5', legacy: 1519383, cloud: 1012922 },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                            <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${(value/1000000).toFixed(1)}M`} />
                            <Tooltip 
                              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                              contentStyle={{ 
                                backgroundColor: '#1e222b', 
                                borderColor: '#374151', 
                                color: '#fff',
                                borderRadius: '8px',
                                border: '1px solid #374151'
                              }}
                            />
                            <Legend wrapperStyle={{ color: '#94a3b8' }} />
                            <defs>
                              <linearGradient id="legacyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="legacy" name="Legacy System" stroke="#ef4444" fill="url(#legacyGradient)" strokeWidth={2} />
                            <Area type="monotone" dataKey="cloud" name="Smart Windows" stroke="#10b981" fill="url(#cloudGradient)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bottom row with statistics */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-br from-blue-500/12 to-blue-400/8 backdrop-blur-xl rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/30 transition-colors group">
                        <div className="text-xs text-blue-300 mb-1 font-medium">Energy Cost Reduction</div>
                        <div className="font-bold text-2xl text-white group-hover:text-blue-200 transition-colors">42%</div>
                        <div className="text-xs text-gray-400 mt-2">HVAC Savings with Luxwall</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/12 to-cyan-500/8 backdrop-blur-xl rounded-xl p-5 border border-blue-500/20 hover:border-cyan-500/30 transition-colors group">
                        <div className="text-xs text-cyan-300 mb-1 font-medium">Section 179D Deduction</div>
                        <div className="font-bold text-2xl text-white group-hover:text-cyan-200 transition-colors">${(section179DData.totalDeduction / 1000000).toFixed(1)}M</div>
                        <div className="text-xs text-gray-400 mt-2">Immediate Tax Benefit</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-400/12 to-blue-500/8 backdrop-blur-xl rounded-xl p-5 border border-blue-400/20 hover:border-blue-400/30 transition-colors group">
                        <div className="text-xs text-blue-300 mb-1 font-medium">Implementation Time</div>
                        <div className="font-bold text-2xl text-white group-hover:text-blue-200 transition-colors">9 months</div>
                        <div className="text-xs text-gray-400 mt-2">Full Deployment</div>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-500/12 to-blue-500/8 backdrop-blur-xl rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-500/30 transition-colors group">
                        <div className="text-xs text-cyan-300 mb-1 font-medium">Enhanced ROI</div>
                        <div className="font-bold text-2xl text-white group-hover:text-cyan-200 transition-colors">2-7 years</div>
                        <div className="text-xs text-gray-400 mt-2">Payback with 179D</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Enhanced Monthly Savings Chart */}
              <section className="mb-8">
                                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                      Monthly Cost Savings Analysis
                    </h2>
                    <button
                      onClick={() => openModal('financialBenefits')}
                      className="p-2 rounded-full bg-blue-500/15 hover:bg-blue-500/25 transition-colors border border-blue-500/20"
                    >
                      <MdInfoOutline className="text-blue-400" />
                    </button>
                  </div>
                <div className="relative bg-gradient-to-br from-blue-500/6 via-white/3 to-cyan-500/4 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                  {/* Subtle animated background pattern */}
                  <div className="absolute inset-0 opacity-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/8 animate-pulse"></div>
                  </div>
                  <div className="relative z-10 p-6">
                  <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2">Smart Windows Cost Savings ($)</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Based on implementation timeline, infrastructure consolidation, and maintenance reductions
                        </p>
                      </div>
                      
                      {/* Phase indicators */}
                      <div className="flex justify-between mb-2 text-xs font-medium">
                        <div className="text-blue-400">Planning</div>
                        <div className="text-emerald-400">Implementation</div>
                        <div className="text-green-400">Optimization</div>
                        <div className="text-teal-400">Full Operation</div>
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
                              tickFormatter={(value) => `$${value}k`}
                            />
                            <Tooltip 
                              formatter={(value: number, name: string) => {
                                return [
                                  `$${value}k`, 
                                  name === "kwh" ? "Savings" : "Baseline"
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
                              <linearGradient id="planningGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="implementationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="optimizationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0.2}/>
                              </linearGradient>
                              <linearGradient id="operationGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.2}/>
                              </linearGradient>
                            </defs>
                            <Bar 
                              dataKey="kwh" 
                              name="Savings" 
                              radius={[4, 4, 0, 0]}
                              barSize={36}
                            >
                              {/* Planning months */}
                              <Cell fill="url(#planningGradient)" stroke="#3B82F6" strokeWidth={1} />
                              <Cell fill="url(#planningGradient)" stroke="#3B82F6" strokeWidth={1} />
                              <Cell fill="url(#planningGradient)" stroke="#3B82F6" strokeWidth={1} />
                              {/* Implementation months */}
                              <Cell fill="url(#implementationGradient)" stroke="#10B981" strokeWidth={1} />
                              <Cell fill="url(#implementationGradient)" stroke="#10B981" strokeWidth={1} />
                              <Cell fill="url(#implementationGradient)" stroke="#10B981" strokeWidth={1} />
                              {/* Optimization months */}
                              <Cell fill="url(#optimizationGradient)" stroke="#22C55E" strokeWidth={1} />
                              <Cell fill="url(#optimizationGradient)" stroke="#22C55E" strokeWidth={1} />
                              <Cell fill="url(#optimizationGradient)" stroke="#22C55E" strokeWidth={1} />
                              {/* Operation months */}
                              <Cell fill="url(#operationGradient)" stroke="#14B8A6" strokeWidth={1} />
                              <Cell fill="url(#operationGradient)" stroke="#14B8A6" strokeWidth={1} />
                              <Cell fill="url(#operationGradient)" stroke="#14B8A6" strokeWidth={1} />
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
                          <div className="text-sm text-gray-500 dark:text-gray-400">Annual Savings</div>
                          <div className="text-2xl font-bold mt-1">$89,425</div>
                          <div className="text-sm text-green-500 mt-1">+3% from estimate</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/70 rounded-lg p-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Monthly Average</div>
                          <div className="text-2xl font-bold mt-1">$7,452</div>
                          <div className="text-sm text-green-500 mt-1">After full replacement</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-72 mt-6 md:mt-0">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Savings vs. Costs</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Your window replacement will save 73.5% of your operational costs
                        </p>
                        
                        {/* SAP Savings visualization - Update to green */}
                        <div className="relative h-36 bg-gray-100 dark:bg-[#1e222b] rounded-lg overflow-hidden mt-4">
                          <div className="absolute inset-0 flex items-end">
                            <div 
                              className="h-[73.5%] w-full bg-gradient-to-t from-blue-500 to-blue-400 opacity-80"
                              style={{ borderTopRightRadius: '100px' }}
                            >
                              <div className="absolute top-2 left-4 text-white text-sm font-medium drop-shadow-md">
                                Energy Savings
                              </div>
                              <div className="absolute bottom-2 left-4 text-white text-sm font-medium drop-shadow-md">
                                73.5%
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-2 right-4 text-gray-600 dark:text-gray-300 text-sm font-medium">
                            Energy Costs
                          </div>
                          <div className="absolute bottom-2 right-4 text-gray-600 dark:text-gray-300 text-sm font-medium">
                            26.5%
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-[#1e222b]/70 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-2">Performance Factors</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>System efficiency: 75%</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Window count: 1,250</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Building reduction: 84%</span>
                          </li>
                          <li className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                            <span>Support cost: -65%/yr</span>
                          </li>
                        </ul>
                      </div>
                      
                                              <div className="mt-4 p-3 bg-gray-100 dark:bg-[#1e222b]/40 rounded-lg border-l-4 border-blue-500">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-medium">Note:</span> Savings estimates reflect typical 
                          operational year data. Actual results may vary based on system performance,
                          window count, and other factors.
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </section>

              {/* Enhanced Migration Timeline */}
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
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full"></div>
                
                <div className="card-body relative z-10">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <FaRegCalendarAlt size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        Replacement Timeline
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Comprehensive timeline for the Smart Windows replacement process (9 months)
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="relative bg-gradient-to-br from-blue-500/6 via-blue-400/3 to-cyan-500/4 backdrop-blur-xl rounded-xl p-6 border border-white/10 overflow-hidden">
                      {/* Subtle animated background pattern */}
                      <div className="absolute inset-0 opacity-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/8 to-transparent animate-pulse"></div>
                      </div>
                      <div className="relative z-10">
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
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md"
                              style={{ width: '18%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                System Assessment & Analysis
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Strategy & Planning */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Strategy & Planning</div>
                            <div className="text-xs text-gray-500">4-8 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[12%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-90"
                              style={{ width: '22%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Solution Design & Roadmap
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Development Environment */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Development Environment</div>
                            <div className="text-xs text-gray-500">4-6 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[25%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-80"
                              style={{ width: '22%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Environment Setup & Configuration
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Data Migration */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Window Installation</div>
                            <div className="text-xs text-gray-500">8-12 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[40%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-70"
                              style={{ width: '33%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Window Removal, Installation & Configuration
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Integration & Testing */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Integration & Testing</div>
                            <div className="text-xs text-gray-500">6-8 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[55%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-85"
                              style={{ width: '26%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                System Integration & User Acceptance Testing
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Training */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">User Training</div>
                            <div className="text-xs text-gray-500">3-4 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[75%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-95"
                              style={{ width: '15%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                User Training & Knowledge Transfer
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Go-Live & Support */}
                        <div className="flex items-center">
                          <div className="w-56 flex-shrink-0 pr-4">
                            <div className="font-semibold mb-1">Go-Live & Support</div>
                            <div className="text-xs text-gray-500">2-4 weeks</div>
                          </div>
                          <div className="flex-1 relative h-12">
                            <div 
                              className="absolute top-0 left-[88%] h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md opacity-90"
                              style={{ width: '12%' }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white px-2">
                                Final Deployment & Support
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Milestones */}
                      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-blue-500 font-semibold mb-2">Key Milestones</div>
                          <ul className="space-y-2 text-sm">
                                                          <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span>Assessment Completion</span>
                            </li>
                                                          <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500 opacity-80"></div>
                                <span>Design Approval</span>
                            </li>
                                                          <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500 opacity-90"></div>
                                <span>Installation Complete</span>
                            </li>
                                                          <li className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                <span>System Operational</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-blue-500 font-semibold mb-2">Critical Dependencies</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>System Design Approval</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Window Installation Quality</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>Interface Testing</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                              <span>User Acceptance</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1e222b]/60 rounded-lg p-4">
                          <div className="text-blue-500 font-semibold mb-2">Potential Delays</div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Window Quality Issues</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Custom Window Configuration</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>Interface Complexity</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span>User Training Delays</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Continue button to green */}
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleContinue}
                  className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-3 group relative overflow-hidden"
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

              {/* Enhanced Next Steps */}
              <div className={cardBaseClass}>
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/30 via-blue-500/20 to-blue-500/25 opacity-25"></div>
                <div className="card-body relative z-10">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/15 p-6 rounded-xl text-white shadow-lg backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300 border border-white/10">
                      <FaLightbulb size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4">
                        AI-Powered Lead Conversion
                      </h3>
                      <div className="space-y-4">
                        <p className="text-white/90 text-lg leading-relaxed">
                          Our advanced AI algorithms have successfully analyzed this enterprise's energy profile, financial position, and Section 179D eligibility. 
                          The comprehensive data shows exceptional potential for Luxwall implementation with immediate tax benefits and long-term savings.
                        </p>
                        <p className="text-white/80 leading-relaxed">
                          <span className="font-semibold text-blue-400">Next Phase:</span> Convert this qualified prospect into an active customer through targeted outreach, 
                          personalized proposals, and strategic follow-up campaigns. Our system has identified the optimal contact strategy and timing 
                          for maximum conversion probability.
                        </p>
                                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                              <div className="text-blue-400 font-semibold text-sm">Qualification Score</div>
                              <div className="text-2xl font-bold text-white">94%</div>
                              <div className="text-xs text-gray-400">High-value prospect</div>
                            </div>
                            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                              <div className="text-cyan-400 font-semibold text-sm">Conversion Probability</div>
                              <div className="text-2xl font-bold text-white">87%</div>
                              <div className="text-xs text-gray-400">Based on profile analysis</div>
                            </div>
                            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                              <div className="text-blue-300 font-semibold text-sm">Revenue Potential</div>
                              <div className="text-2xl font-bold text-white">$875K</div>
                              <div className="text-xs text-gray-400">Project value</div>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all backdrop-blur-sm transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3">
                      <FaServer className="text-lg" />
                      Initiate Customer Conversion Process
                      <MdArrowForward className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Multi-Building Implementation Pipeline Section */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-400/20">
                    <FaDatabase className="text-white text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">Implementation Applied Across Database</h2>
                    <p className="text-emerald-300/70 text-sm">Same implementation planning applied to all 2,547 buildings from enriched database</p>
                  </div>
                </div>
                
                <div className={`${cardBaseClass} p-8 relative overflow-hidden`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Sample Implementation Results</h3>
                        <p className="text-emerald-300/70 text-sm">Showing 6 of 2,547 implementation-ready buildings</p>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-emerald-500/20">
                            <th className="text-left py-3 px-4 text-emerald-300 font-semibold text-sm">Company</th>
                            <th className="text-left py-3 px-4 text-emerald-300 font-semibold text-sm">Location</th>
                            <th className="text-left py-3 px-4 text-emerald-300 font-semibold text-sm">Building Type</th>
                            <th className="text-right py-3 px-4 text-emerald-300 font-semibold text-sm">Project Value</th>
                            <th className="text-right py-3 px-4 text-emerald-300 font-semibold text-sm">Timeline</th>
                            <th className="text-center py-3 px-4 text-emerald-300 font-semibold text-sm">Phase</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">MGM Grand Detroit Hotel & Casino</div>
                              <div className="text-emerald-300/60 text-xs">Mixed-Use Complex</div>
                            </td>
                            <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                            <td className="py-4 px-4 text-white/80">Casino/Hotel</td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-green-400 font-bold">$972K</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-orange-400 font-bold">8 months</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Planning</span>
                            </td>
                          </tr>
                          <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">Jeffersonian Apartments</div>
                              <div className="text-emerald-300/60 text-xs">Residential High-Rise</div>
                            </td>
                            <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                            <td className="py-4 px-4 text-white/80">Residential</td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-green-400 font-bold">$2.2M</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-orange-400 font-bold">12 months</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium animate-pulse">Design</span>
                            </td>
                          </tr>
                          <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">Ford Motor Company</div>
                              <div className="text-emerald-300/60 text-xs">Manufacturing Complex</div>
                            </td>
                            <td className="py-4 px-4 text-white/80">Dearborn, MI</td>
                            <td className="py-4 px-4 text-white/80">Manufacturing</td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-green-400 font-bold">$3.8M</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-orange-400 font-bold">7 months</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">Planning</span>
                            </td>
                          </tr>
                          <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">General Motors</div>
                              <div className="text-emerald-300/60 text-xs">Corporate Headquarters</div>
                            </td>
                            <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                            <td className="py-4 px-4 text-white/80">Office Complex</td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-green-400 font-bold">$2.9M</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-orange-400 font-bold">9 months</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium animate-pulse">Design</span>
                            </td>
                          </tr>
                          <tr className="border-b border-emerald-500/10 hover:bg-emerald-500/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">Henry Ford Health</div>
                              <div className="text-emerald-300/60 text-xs">Medical Center</div>
                            </td>
                            <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                            <td className="py-4 px-4 text-white/80">Healthcare</td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-green-400 font-bold">$4.7M</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-orange-400 font-bold">11 months</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium">Approval</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-emerald-500/5 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">Quicken Loans</div>
                              <div className="text-emerald-300/60 text-xs">Corporate Tower</div>
                            </td>
                            <td className="py-4 px-4 text-white/80">Detroit, MI</td>
                            <td className="py-4 px-4 text-white/80">Office</td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-green-400 font-bold">$1.8M</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-orange-400 font-bold">6 months</span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">Installation</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-emerald-300/70 text-sm">
                        Showing 6 of 2,547 implementation-ready buildings
                      </div>
                      <div className="flex gap-2">
                        <div className="join">
                          <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">«</button>
                          <button className="join-item btn btn-sm bg-emerald-500 text-white border-emerald-500">1</button>
                          <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">2</button>
                          <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">3</button>
                          <button className="join-item btn btn-sm bg-[#28292b]/80 hover:bg-[#28292b] text-white border-emerald-500/20">»</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <Modal
        isOpen={activeModal === 'section179D'}
        onClose={closeModal}
        title={modalContent.section179D.title}
      >
        {modalContent.section179D.content}
      </Modal>
      
      <Modal
        isOpen={activeModal === 'energyEfficiency'}
        onClose={closeModal}
        title={modalContent.energyEfficiency.title}
      >
        {modalContent.energyEfficiency.content}
      </Modal>
      
      <Modal
        isOpen={activeModal === 'financialBenefits'}
        onClose={closeModal}
        title={modalContent.financialBenefits.title}
      >
        {modalContent.financialBenefits.content}
      </Modal>
    </div>
  );
};

export default WindowReplacementInsights; 