import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdInfo, MdLocationOn, MdOutlineEmail, MdOutlinePhone, MdDownload, MdArrowForward, MdAnalytics, MdFactory, MdSpeed, MdAttachMoney, MdContentCopy, MdTableChart, MdCheck, MdWarning, MdOutlineWarning, MdSearch, MdInfoOutline, MdClose, MdStorage, MdDeveloperBoard } from 'react-icons/md';
import { FaDatabase, FaMoneyBillWave, FaServer, FaChartLine, FaRegLightbulb, FaLayerGroup, FaRegClock, FaBuilding, FaIndustry, FaWarehouse } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { BsGlobe, BsServer, BsCloudDownload, BsGraphUp, BsShieldLock, BsDiagram3, BsCodeSlash, BsFileEarmarkCode } from 'react-icons/bs';
import { AiOutlineApi, AiOutlineNodeIndex, AiOutlineFileSearch, AiOutlineRobot } from 'react-icons/ai';
import { HiOutlineDatabase, HiOutlineDocumentSearch } from 'react-icons/hi';
import { TbWorldSearch } from 'react-icons/tb';

// Building interface based on CSV structure
interface Building {
  id: number;
  name: string;
  buildingIdAddress: string;
  address: string;
  coordinates: string;
  buildingType: string;
  propertyOwner: string;
  totalSquareFootage: string;
  squareFootage: string;
  estimatedAnnualKwh: string;
  annualEnergyUse: string;
  commercialElectricityRate: string;
  annualEnergyCost: string;
  totalWindows: string;
  averageWindowSize: string;
  windowToWallRatio: string;
  facadeOrientation: string;
  setPointTemperature: string;
  historicalTemperatures: string;
  temperatureDeltaSeries: string;
  annualTemperatureSwing: string;
  monthlySolarIrradiance: string;
  currentWindowRValue: string;
  energyStarScore: string;
  windowHeatLossCost: string;
  windowCoolingCost: string;
  totalWindowEnergyCost: string;
  luxwallProductRecommendation: string;
  rValue: string;
  efficiencyImprovement: string;
  replaceableWindows: string;
  postRetrofitEnergyCost: string;
  annualEnergySavings: string;
  energyCostReduction: string;
  installationCost: string;
  paybackRoiWithoutIncentives: string;
  roiInYearsWithoutIncentives: string;
  year: string;
  floors: string;
  status: string;
  drawings: string;
}

// Function to parse CSV data with proper handling of quoted fields and multi-line content
const parseCSV = (csvText: string): Building[] => {
  const buildings: Building[] = [];
  let currentRow = '';
  let inQuotes = false;
  let rowCount = 0;
  
  // Split by lines but handle multi-line quoted fields
  const lines = csvText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    currentRow += (currentRow ? '\n' : '') + line;
    
    // Count quotes to determine if we're inside a quoted field
    let quoteCount = 0;
    for (let j = 0; j < currentRow.length; j++) {
      if (currentRow[j] === '"') {
        quoteCount++;
      }
    }
    
    // If quote count is even, we're not inside a quoted field
    inQuotes = quoteCount % 2 !== 0;
    
    if (!inQuotes) {
      // Process the complete row
      if (rowCount === 0) {
        // Skip header row
        rowCount++;
        currentRow = '';
        continue;
      }
      
      if (currentRow.trim()) {
        const values = parseCSVRow(currentRow);
        
        if (values.length >= 39) {
          const building: Building = {
            id: rowCount,
            name: values[0] || '',
            buildingIdAddress: values[1] || '',
            address: values[2] || '',
            coordinates: values[3] || '',
            buildingType: values[4] || '',
            propertyOwner: values[5] || '',
            totalSquareFootage: values[6] || '',
            squareFootage: values[7] || '',
            estimatedAnnualKwh: values[8] || '',
            annualEnergyUse: values[9] || '',
            commercialElectricityRate: values[10] || '',
            annualEnergyCost: values[11] || '',
            totalWindows: values[12] || '',
            averageWindowSize: values[13] || '',
            windowToWallRatio: values[14] || '',
            facadeOrientation: values[15] || '',
            setPointTemperature: values[16] || '',
            historicalTemperatures: values[17] || '',
            temperatureDeltaSeries: values[18] || '',
            annualTemperatureSwing: values[19] || '',
            monthlySolarIrradiance: values[20] || '',
            currentWindowRValue: values[21] || '',
            energyStarScore: values[22] || '',
            windowHeatLossCost: values[23] || '',
            windowCoolingCost: values[24] || '',
            totalWindowEnergyCost: values[25] || '',
            luxwallProductRecommendation: values[26] || '',
            rValue: values[27] || '',
            efficiencyImprovement: values[28] || '',
            replaceableWindows: values[29] || '',
            postRetrofitEnergyCost: values[30] || '',
            annualEnergySavings: values[31] || '',
            energyCostReduction: values[32] || '',
            installationCost: values[33] || '',
            paybackRoiWithoutIncentives: values[34] || '',
            roiInYearsWithoutIncentives: values[35] || '',
            year: values[36] || '',
            floors: values[37] || '',
            status: values[38] || '',
            drawings: values[39] || ''
          };
          buildings.push(building);
        }
        rowCount++;
      }
      currentRow = '';
    }
  }

  console.log(`Parsed ${buildings.length} buildings from CSV`);
  return buildings;
};

// Helper function to parse a single CSV row
const parseCSVRow = (row: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < row.length) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < row.length && row[i + 1] === '"') {
        // Handle escaped quotes ("")
        currentValue += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(currentValue.trim());
      currentValue = '';
      i++;
    } else {
      currentValue += char;
      i++;
    }
  }
  
  // Add the last value
  values.push(currentValue.trim());
  
  // Clean up quoted values
  return values.map(value => value.replace(/^"|"$/g, ''));
};

// Helper function to extract numeric value from string
const extractNumericValue = (value: string): number => {
  if (!value) return 0;
  const match = value.match(/[\d,]+\.?\d*/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }
  return 0;
};

// Helper function to format currency
const formatCurrency = (value: string): string => {
  const num = extractNumericValue(value);
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toFixed(0)}`;
};

// Helper function to format square footage (no dollar sign)
const formatSquareFootage = (value: string): string => {
  const num = extractNumericValue(value);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M sq ft`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K sq ft`;
  }
  return `${num.toFixed(0)} sq ft`;
};

const SignalScanner = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEnriching, setIsEnriching] = useState(true);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildings, setSelectedBuildings] = useState<Building[]>([]);
  const [showEnriched, setShowEnriched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisualizationToast, setShowVisualizationToast] = useState(false);
  const [selectedBuildingForModal, setSelectedBuildingForModal] = useState<Building | null>(null);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [enrichedData, setEnrichedData] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCell, setExpandedCell] = useState<string | null>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const buildingsPerPage = 12;
  
  // Total buildings in the database
  const totalBuildingsInDatabase = 851;

  // Update the CSS animations in the useEffect to include the new animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes dataStream {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(500%); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-in-out forwards;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-8px) translateX(8px); }
        50% { transform: translateY(5px) translateX(-5px); }
        75% { transform: translateY(-3px) translateX(3px); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      @keyframes animatePath {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: 400; }
      }
      
      @keyframes scrollHint {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(3px); }
      }
      
      @keyframes scrollHintLeft {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(-3px); }
      }
      
      .scroll-hint-right {
        animation: scrollHint 2s ease-in-out infinite;
      }
      
      .scroll-hint-left {
        animation: scrollHintLeft 2s ease-in-out infinite;
      }
      
      @keyframes fadeInOut {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      
      .scroll-indicator-fade {
        animation: fadeInOut 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    // Clean up function to remove the style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Load CSV data
    setIsLoading(true);
    
    const loadCSVData = async () => {
      try {
        console.log('Starting CSV data load...');
        const response = await fetch('/Spreadsheet/LuxWall - High rise Buildings - Detroit Michigan - Complete_Detroit_Highrise_Database-Default-view-export-1747802457903 (1).csv');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('CSV text length:', csvText.length);
        console.log('First 200 characters:', csvText.substring(0, 200));
        
        const parsedBuildings = parseCSV(csvText);
        console.log('Parsed buildings:', parsedBuildings.length);
        console.log('First building:', parsedBuildings[0]);
        
        setBuildings(parsedBuildings);
        setSelectedBuildings(parsedBuildings); // Show all buildings
        setIsLoading(false);
        
        // Simulate data enrichment processing
        setTimeout(() => {
          setIsEnriching(false);
        }, 3000);
      } catch (error) {
        console.error('Error loading CSV data:', error);
        
        // Fallback sample data for testing
        const sampleBuildings: Building[] = [
          {
            id: 1,
            name: "MGM Grand Detroit Hotel & Casino",
            buildingIdAddress: "1777 3rd Ave, Detroit, MI 48226",
            address: "1777 3rd Ave, Detroit, MI 48226",
            coordinates: "42.33361, -83.06028",
            buildingType: "mixed-use",
            propertyOwner: "Vici Properties and MGM Resorts International",
            totalSquareFootage: "1650000 sq ft",
            squareFootage: "1650000 sq ft",
            estimatedAnnualKwh: "16080000",
            annualEnergyUse: "16080000",
            commercialElectricityRate: "0.1528 $/kWh",
            annualEnergyCost: "2450000 USD",
            totalWindows: "600",
            averageWindowSize: "Average window size: 1.5 m × 1.2 m",
            windowToWallRatio: "0.34",
            facadeOrientation: "north/south",
            setPointTemperature: "70 °F / 21 °C",
            historicalTemperatures: "January: 0°C / -6°C",
            temperatureDeltaSeries: "January: 11°C",
            annualTemperatureSwing: "34",
            monthlySolarIrradiance: "January: 2.98",
            currentWindowRValue: "2",
            energyStarScore: "65",
            windowHeatLossCost: "142151 USD",
            windowCoolingCost: "1154168 USD",
            totalWindowEnergyCost: "1296319 USD",
            luxwallProductRecommendation: "LuxWall Enthermal Plus™",
            rValue: "20",
            efficiencyImprovement: "90%",
            replaceableWindows: "100%",
            postRetrofitEnergyCost: "129631 USD",
            annualEnergySavings: "1166688 USD",
            energyCostReduction: "47%",
            installationCost: "972000 USD",
            paybackRoiWithoutIncentives: "0.83333",
            roiInYearsWithoutIncentives: "0.83333",
            year: "2008",
            floors: "17",
            status: "built",
            drawings: "0"
          },
          {
            id: 2,
            name: "Jeffersonian Apartments",
            buildingIdAddress: "9000 East Jefferson Avenue, Detroit, Michigan 48214",
            address: "9000 East Jefferson Avenue, Detroit, Michigan 48214",
            coordinates: "42.3558, -82.9867",
            buildingType: "residential high-rise",
            propertyOwner: "DC CAP Hotelier",
            totalSquareFootage: "870813 sq ft",
            squareFootage: "870813 sq ft",
            estimatedAnnualKwh: "63975571",
            annualEnergyUse: "63975571",
            commercialElectricityRate: "0.1592 $/kWh",
            annualEnergyCost: "10105290 USD",
            totalWindows: "1236",
            averageWindowSize: "Average window size: 1.5 m × 1.5 m",
            windowToWallRatio: "0.55",
            facadeOrientation: "north/south",
            setPointTemperature: "72 °F / 22 °C",
            historicalTemperatures: "January: 0°C / -6°C",
            temperatureDeltaSeries: "January: 11°C",
            annualTemperatureSwing: "34",
            monthlySolarIrradiance: "January: 2.98",
            currentWindowRValue: "1",
            energyStarScore: "59",
            windowHeatLossCost: "570540 USD",
            windowCoolingCost: "1720004 USD",
            totalWindowEnergyCost: "2290544 USD",
            luxwallProductRecommendation: "LuxWall Enthermal™",
            rValue: "19",
            efficiencyImprovement: "91%",
            replaceableWindows: "100%",
            postRetrofitEnergyCost: "204368 USD",
            annualEnergySavings: "2086176 USD",
            energyCostReduction: "20%",
            installationCost: "2224800 USD",
            paybackRoiWithoutIncentives: "1",
            roiInYearsWithoutIncentives: "1",
            year: "1965",
            floors: "30",
            status: "built",
            drawings: "2"
          }
        ];
        
        setBuildings(sampleBuildings);
        setSelectedBuildings(sampleBuildings);
        setIsLoading(false);
        setIsEnriching(false);
        toast.error('Failed to load CSV data - showing sample data');
      }
    };

    loadCSVData();
  }, [facilityId]);

  // Handle scroll detection for table
  useEffect(() => {
    const handleScroll = () => {
      const tableContainer = document.getElementById('table-container');
      if (tableContainer && showEnriched) {
        const { scrollLeft, scrollWidth, clientWidth } = tableContainer;
        
        // Show left scroll indicator if scrolled right
        setShowLeftScroll(scrollLeft > 10);
        
        // Show right scroll indicator if not at the far right
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const tableContainer = document.getElementById('table-container');
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [showEnriched, selectedBuildings]);

  // Reset scroll indicators when enriched data changes
  useEffect(() => {
    if (showEnriched) {
      setTimeout(() => {
        const tableContainer = document.getElementById('table-container');
        if (tableContainer) {
          const { scrollWidth, clientWidth } = tableContainer;
          setShowRightScroll(scrollWidth > clientWidth);
          setShowLeftScroll(false);
        }
      }, 100);
    } else {
      setShowLeftScroll(false);
      setShowRightScroll(false);
    }
  }, [showEnriched]);

  const handleDownloadReport = async () => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Preparing building energy data for download...');
      
      // Fetch the CSV file
      const response = await fetch('/Spreadsheet/LuxWall - High rise Buildings - Detroit Michigan - Complete_Detroit_Highrise_Database-Default-view-export-1747802457903 (1).csv');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Detroit_Building_Energy_Data_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Success toast
      toast.dismiss(loadingToast);
      toast.success('Building energy data downloaded successfully!');
      
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download building data. Please try again.');
    }
  };
  
  const handleContinueToSystemAnalysis = () => {
    if (!showEnriched) {
      toast.error("Please enrich the data first by clicking 'Show Enriched Data'");
      return;
    }
    
    navigate('/data-analytics');
    toast.success("Proceeding to detailed energy analysis");
  };

  // Handle toggle enriched data with popup
  const handleToggleEnriched = () => {
    if (!enrichedData && !showEnriched) {
      // First time showing enriched data - simulate loading/processing
      setIsEnriching(true);
      setShowLoadingAnimation(true);
      setLoadingProgress(0);
      
      // Animate progress over 5 seconds
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2; // Increment by 2% every 100ms (5 seconds total)
        });
      }, 100);
      
      // Simulate API call delay - 5 seconds as requested
      setTimeout(() => {
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setIsEnriching(false);
        setShowLoadingAnimation(false);
        setShowEnriched(true);
        setEnrichedData(true);
        toast.success("Building energy data enrichment complete!");
      }, 5000);
    } else {
      // Toggle visibility of already-enriched data
      setShowEnriched(!showEnriched);
    }
  };

  // Fix the modal showModal calls with null checks
  const showModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId);
    if (modalElement && 'showModal' in modalElement) {
      // @ts-ignore - Adding this to bypass TypeScript error with showModal
      modalElement.showModal();
    }
  };
  
  // Handle view button click to show modal first, then navigate
  const handleViewBuilding = (buildingId: number) => {
    const buildingToView = selectedBuildings.find(b => b.id === buildingId);
    setSelectedBuildingForModal(buildingToView || null);
    const modalElement = document.getElementById('visualization-modal');
    if (modalElement && 'showModal' in modalElement) {
      // @ts-ignore - Adding this to bypass TypeScript error with showModal
      modalElement.showModal();
    }
  };

  const closeModal = () => {
    const modalElement = document.getElementById('visualization-modal');
    if (modalElement && 'close' in modalElement) {
      // @ts-ignore - Adding this to bypass TypeScript error with close
      modalElement.close();
    }
  };
  
  const goToSystemAnalysis = () => {
    closeModal();
    navigate('/data-analytics');
  };

  // Helper function to create expandable text cells
  const ExpandableCell = ({ content, cellId, maxLength = 50 }: { content: string; cellId: string; maxLength?: number }) => {
    const isExpanded = expandedCell === cellId;
    const shouldTruncate = content.length > maxLength;
    
    return (
      <div 
        className={`cursor-pointer transition-all duration-200 ${shouldTruncate ? 'hover:bg-white/10 rounded p-1' : ''}`}
        onClick={() => shouldTruncate ? setExpandedCell(isExpanded ? null : cellId) : null}
      >
        {isExpanded || !shouldTruncate ? (
          <span className="whitespace-pre-wrap">{content}</span>
        ) : (
          <span>{content.substring(0, maxLength)}...</span>
        )}
        {shouldTruncate && (
          <span className="text-[#2a64f5] ml-1 text-xs">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>
    );
  };

  // Pagination functions
  const totalPages = Math.ceil(selectedBuildings.filter(building => 
    searchTerm ? 
      building.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      building.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.buildingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.propertyOwner.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  ).length / buildingsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    setExpandedCell(null); // Close any expanded cells when changing pages
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020305] flex items-center justify-center relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" 
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #ffffff 20px, #ffffff 22px)',
              backgroundSize: '30px 30px'
            }}
          ></div>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-blue-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Loading Building Energy Data</h2>
            <p className="text-gray-400">Preparing comprehensive energy analysis and performance metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to update the existing card class names to match Home page styling
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-blue-500/15 group relative overflow-hidden";

  return (
    <div className="w-full px-32 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-[#2a64f5]/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-[#2a64f5]/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Loading Animation Modal */}
      {showLoadingAnimation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="relative bg-[#1e222b]/90 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-xl max-w-4xl w-full mx-4 animate-fadeIn">
            {/* Animated gradient background for the modal */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#2a64f5]/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#2a64f5]/30 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
              <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-gradient-to-br from-[#2a64f5]/20 to-transparent rounded-full blur-2xl animate-pulse delay-300"></div>
            </div>
            
            {/* Floating data points and connection lines - enhanced visual effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-[#2a64f5]/30 border border-[#2a64f5]/50"
                  style={{
                    width: `${6 + Math.random() * 12}px`,
                    height: `${6 + Math.random() * 12}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 10}s linear infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
              
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <line 
                    key={i}
                    x1={`${Math.random() * 100}%`}
                    y1={`${Math.random() * 100}%`}
                    x2={`${Math.random() * 100}%`}
                    y2={`${Math.random() * 100}%`}
                    stroke="#2a64f5"
                    strokeWidth="1"
                    style={{ 
                      animation: `pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
              </svg>
            </div>
            
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowLoadingAnimation(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all rounded-full p-1"
              >
                <MdClose size={20} />
              </button>
            </div>
            
                          <div className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-[#2a64f5] to-[#7a94b8] p-2 rounded-lg shadow animate-pulse">
                  <AiOutlineRobot className="text-xl text-white animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI Energy Analysis</h3>
                <div className="flex gap-1 ml-2">
                  <div className="w-2 h-2 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
              <p className="text-white/70 mb-6">Processing building energy data from multiple sources...</p>
              
              {/* Real-time activity log */}
              <div className="mb-6 bg-black/20 rounded-xl p-4 border border-white/10 h-64 overflow-y-auto font-mono text-sm">
                <div className="space-y-2">
                  <div className="text-[#2a64f5] animate-fadeIn">
                    <span className="text-white/50">[00:00.12]</span> Initializing AI energy data extraction modules...
                  </div>
                  <div className="text-[#2a64f5] animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <span className="text-white/50">[00:00.35]</span> Establishing secure connection to building databases <BsShieldLock className="inline" />
                  </div>
                  <div className="text-[#2a64f5] animate-fadeIn" style={{ animationDelay: '800ms' }}>
                    <span className="text-white/50">[00:01.08]</span> Scraping building energy profile data from <TbWorldSearch className="inline" /> market intelligence APIs
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '1200ms' }}>
                    <span className="text-white/50">[00:01.45]</span> <BsGlobe className="inline" /> Accessing energy consumption history records (851 buildings)
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '1600ms' }}>
                    <span className="text-white/50">[00:01.89]</span> <HiOutlineDatabase className="inline" /> Analyzing window efficiency metrics...
                  </div>
                  <div className="text-yellow-400 animate-fadeIn" style={{ animationDelay: '2000ms' }}>
                    <span className="text-white/50">[00:02.13]</span> <AiOutlineApi className="inline" /> Accessing third-party energy analysis systems
                  </div>
                  <div className="text-purple-400 animate-fadeIn" style={{ animationDelay: '2400ms' }}>
                    <span className="text-white/50">[00:02.55]</span> <BsCodeSlash className="inline" /> Extracting building architecture and energy dependencies
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '2800ms' }}>
                    <span className="text-white/50">[00:03.02]</span> <AiOutlineFileSearch className="inline" /> Cross-referencing with industry energy benchmarks
                  </div>
                  <div className="text-purple-400 animate-fadeIn" style={{ animationDelay: '3200ms' }}>
                    <span className="text-white/50">[00:03.45]</span> <AiOutlineNodeIndex className="inline" /> Building energy dependency graph for optimization calculations
                  </div>
                  <div className="text-green-400 animate-fadeIn" style={{ animationDelay: '3600ms' }}>
                    <span className="text-white/50">[00:03.98]</span> <BsGraphUp className="inline" /> Generating energy efficiency improvement projection models
                  </div>
                  <div className="text-yellow-400 animate-fadeIn" style={{ animationDelay: '4000ms' }}>
                    <span className="text-white/50">[00:04.32]</span> <BsDiagram3 className="inline" /> Creating optimization opportunity map by building type
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '4400ms' }}>
                    <span className="text-white/50">[00:04.75]</span> <BsCloudDownload className="inline" /> Finalizing data compilation and enrichment
                  </div>
                  <div className="text-[#2a64f5] animate-fadeIn" style={{ animationDelay: '4800ms' }}>
                    <span className="text-white/50">[00:04.98]</span> Analysis complete! Found <span className="text-white font-bold">{selectedBuildings ? selectedBuildings.length : 0}</span> optimization opportunities
                  </div>
                </div>
              </div>
              
              {/* Enhanced Data stream visualization with dots and labels */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/70">API Connections</span>
                    <span className="text-xs text-[#2a64f5]">Active</span>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="relative">
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                          <span>{['Building API', 'Energy Data', 'Market Intel', 'Window Metrics'][i]}</span>
                          <span className="text-[#2a64f5]">
                            {Math.floor(Math.random() * 1000)} req/s
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] rounded-full relative"
                            style={{ width: `${60 + Math.random() * 40}%` }}
                          >
                            <div 
                              className="absolute inset-0 overflow-hidden"
                              style={{ 
                                backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite',
                                width: '100%'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/70">Data Processing</span>
                    <span className="text-xs text-[#2a64f5]">2.3TB</span>
                  </div>
                  
                  {/* Animated graph */}
                  <div className="h-[80px] relative">
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20"></div>
                    <svg
                      className="w-full h-full"
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0,50 Q10,30 20,45 T40,40 T60,60 T80,30 T100,50"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray="200"
                        strokeDashoffset="0"
                        style={{
                          animation: 'animatePath 5s linear infinite',
                        }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2a64f5" />
                          <stop offset="100%" stopColor="#7a94b8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Progress indicators */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Data Extraction</span>
                    <span>{Math.min(100, Math.max(0, loadingProgress)).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, loadingProgress))}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Energy Analysis</span>
                    <span>{Math.min(100, Math.max(0, loadingProgress - 10)).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, loadingProgress - 10))}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Optimization Mapping</span>
                    <span>{Math.min(100, Math.max(0, loadingProgress - 20)).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, loadingProgress - 20))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-3 text-white/70">
                <div className="w-3 h-3 rounded-full bg-[#2a64f5] animate-ping"></div>
                <p className="text-sm">Preparing visualization components...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* Simple header without box */}
          <div className="py-4">
            <div className="flex items-center gap-3">
              <MdTableChart className="text-2xl text-[#2a64f5]" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">Signal Scanner</h1>
            </div>
          </div>

          {isEnriching ? (
            <div className={cardBaseClass}>
              {/* Loading state content stays the same */}
              {/* ... existing loading state code ... */}
            </div>
          ) : (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className={cardBaseClass}>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Total Buildings</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{totalBuildingsInDatabase}</h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#2a64f5] to-[#2a64f5] shadow-lg shadow-[#2a64f5]/20 backdrop-blur-md border border-white/20">
                        <FaBuilding className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={cardBaseClass}>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Avg. Square Footage</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          {selectedBuildings.length > 0 ? Math.round(selectedBuildings.reduce((sum, building) => sum + extractNumericValue(building.squareFootage), 0) / selectedBuildings.length / 1000) : 0}K sq ft
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#2a64f5] to-[#2a64f5] shadow-lg shadow-[#2a64f5]/20 backdrop-blur-md border border-white/20">
                        <MdFactory className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={cardBaseClass}>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Avg. Energy Cost</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          {selectedBuildings.length > 0 ? formatCurrency((selectedBuildings.reduce((sum, building) => sum + extractNumericValue(building.annualEnergyCost), 0) / selectedBuildings.length).toString()) : '$0'}
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#2a64f5] to-[#2a64f5] shadow-lg shadow-[#2a64f5]/20 backdrop-blur-md border border-white/20">
                        <MdAttachMoney className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={cardBaseClass}>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Total Windows</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          {selectedBuildings.length > 0 ? (selectedBuildings.reduce((sum, building) => sum + extractNumericValue(building.totalWindows), 0) / 1000).toFixed(1) : '0.0'}K
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#2a64f5] to-[#2a64f5] shadow-lg shadow-[#2a64f5]/20 backdrop-blur-md border border-white/20">
                        <MdSpeed className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={cardBaseClass}>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Potential Savings</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          {selectedBuildings.length > 0 ? formatCurrency((selectedBuildings.reduce((sum, building) => sum + extractNumericValue(building.annualEnergySavings), 0)).toString()) : '$0'}
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#2a64f5] to-[#2a64f5] shadow-lg shadow-[#2a64f5]/20 backdrop-blur-md border border-white/20">
                        <MdAnalytics className="text-white text-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Search and Filter Controls */}
              <div className={`${cardBaseClass} mb-6`}>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                      <input
                        type="text"
                        placeholder="Search buildings..."
                        className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute right-3 top-2.5 text-white/50">
                        <MdSearch size={20} />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button 
                        className={`${
                          showEnriched 
                            ? 'bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        } backdrop-blur-md rounded-full px-4 py-2 transition-all duration-500 text-sm font-medium border border-white/10 flex items-center gap-2`}
                        onClick={handleToggleEnriched}
                      >
                        Show Enriched Data
                        {showEnriched && <MdCheck className="text-white" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Buildings Table */}
              <div className={`${cardBaseClass}`}>
                {/* Scroll Indicator */}
                <div className="px-6 pt-4 pb-2 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white/70 text-sm">Building Data Table</span>
                      {showEnriched && (
                        <div className="flex items-center gap-3 text-white/50 text-xs">
                          <span>Scroll horizontally to see all data</span>
                          <div className="flex items-center gap-2">
                            {/* Left scroll indicator */}
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-[#2a64f5] animate-pulse scroll-hint-left" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              <div className="flex gap-0.5">
                                <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                                <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                              </div>
                            </div>
                            
                            {/* Mouse scroll icon */}
                            <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5 relative">
                              <div className="w-1 h-2 bg-[#2a64f5] rounded-full animate-bounce"></div>
                              <div className="absolute -bottom-1 text-[8px] text-white/30">scroll</div>
                            </div>
                            
                            {/* Right scroll indicator */}
                            <div className="flex items-center gap-1">
                              <div className="flex gap-0.5">
                                <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                                <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                                <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              </div>
                              <svg className="w-4 h-4 text-[#2a64f5] animate-pulse scroll-hint-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-white/50 text-xs">
                      {selectedBuildings.length} buildings loaded
                    </div>
                  </div>
                </div>
                <div className="p-6 overflow-x-auto relative" id="table-container">
                  {/* Left side scroll indicator */}
                  {showLeftScroll && (
                    <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none z-10 scroll-indicator-fade">
                      <div className="h-full bg-gradient-to-r from-[#2a64f5]/30 via-[#2a64f5]/15 to-transparent flex items-center justify-start pl-2">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-[#2a64f5] scroll-hint-left" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <div className="flex gap-0.5">
                              <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                              <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                              <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            </div>
                          </div>
                          <div className="text-[#2a64f5] text-[10px] font-medium transform rotate-90 whitespace-nowrap">
                            ← scroll
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Right side scroll indicator */}
                  {showRightScroll && (
                    <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none z-10 scroll-indicator-fade">
                      <div className="h-full bg-gradient-to-l from-[#2a64f5]/30 via-[#2a64f5]/15 to-transparent flex items-center justify-end pr-2">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="flex gap-0.5">
                              <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                              <div className="w-1 h-1 bg-[#2a64f5] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                            </div>
                            <svg className="w-5 h-5 text-[#2a64f5] scroll-hint-right" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <div className="text-[#2a64f5] text-[10px] font-medium transform rotate-90 whitespace-nowrap">
                            scroll →
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <table className="w-full table-auto text-sm">
                    <thead>
                      <tr className="text-left border-b-2 border-white/20">
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Building Name</th>
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Address</th>
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Type</th>
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Owner</th>
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Square Footage</th>
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Annual Energy Cost</th>
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Total Windows</th>
                        {showEnriched && (
                          <>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Annual kWh</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Electricity Rate</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Window Size</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Wall Ratio</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Orientation</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Temperature</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">R-Value</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">ENERGY STAR</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Heat Loss Cost</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Cooling Cost</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Window Energy Cost</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">LuxWall Product</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">New R-value</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Efficiency %</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Replaceable %</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Retrofit Cost</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Annual Savings</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Reduction %</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Install Cost</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Payback</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">ROI Years</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Year</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Floors</th>
                            <th className="px-3 py-4 text-xs font-semibold text-white/80 bg-white/5">Status</th>
                          </>
                        )}
                        <th className="px-4 py-4 text-sm font-semibold text-white/90 bg-white/5">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBuildings.length === 0 ? (
                        <tr>
                          <td colSpan={showEnriched ? 32 : 8} className="px-4 py-8 text-center text-white/50">
                            <div className="flex flex-col items-center gap-2">
                              <MdOutlineWarning size={24} />
                              <span>No building data available. Loading CSV...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        selectedBuildings
                          .filter(building => 
                            searchTerm ? 
                              building.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              building.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              building.buildingType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              building.propertyOwner.toLowerCase().includes(searchTerm.toLowerCase())
                              : true
                          )
                          .slice((currentPage - 1) * buildingsPerPage, currentPage * buildingsPerPage)
                          .map((building, index) => (
                          <tr 
                            key={building.id} 
                            className={`border-b border-white/10 hover:bg-white/5 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                          >
                            <td className="px-4 py-4 text-white text-sm">
                              <div className="font-medium">
                                <ExpandableCell 
                                  content={building.name} 
                                  cellId={`name-${building.id}`} 
                                  maxLength={30}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-4 text-white text-sm">
                              <ExpandableCell 
                                content={building.address} 
                                cellId={`address-${building.id}`} 
                                maxLength={40}
                              />
                            </td>
                            <td className="px-4 py-4 text-white text-sm">{building.buildingType}</td>
                            <td className="px-4 py-4 text-white text-sm">
                              <ExpandableCell 
                                content={building.propertyOwner} 
                                cellId={`owner-${building.id}`} 
                                maxLength={25}
                              />
                            </td>
                            <td className="px-4 py-4 text-white text-sm font-medium">{formatSquareFootage(building.squareFootage)}</td>
                            <td className="px-4 py-4 text-[#2a64f5] text-sm font-medium">{formatCurrency(building.annualEnergyCost)}</td>
                            <td className="px-4 py-4 text-white text-sm">{extractNumericValue(building.totalWindows).toLocaleString()}</td>
                            
                            {showEnriched ? (
                              <>
                                <td className="px-3 py-4 text-white text-xs">{extractNumericValue(building.estimatedAnnualKwh).toLocaleString()}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.commercialElectricityRate}</td>
                                <td className="px-3 py-4 text-white text-xs">
                                  <ExpandableCell 
                                    content={building.averageWindowSize} 
                                    cellId={`windowSize-${building.id}`} 
                                    maxLength={20}
                                  />
                                </td>
                                <td className="px-3 py-4 text-white text-xs">{building.windowToWallRatio}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.facadeOrientation}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.setPointTemperature}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.currentWindowRValue}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.energyStarScore}</td>
                                <td className="px-3 py-4 text-orange-400 text-xs font-medium">{formatCurrency(building.windowHeatLossCost)}</td>
                                <td className="px-3 py-4 text-orange-400 text-xs font-medium">{formatCurrency(building.windowCoolingCost)}</td>
                                <td className="px-3 py-4 text-red-400 text-xs font-medium">{formatCurrency(building.totalWindowEnergyCost)}</td>
                                <td className="px-3 py-4 text-white text-xs">
                                  <ExpandableCell 
                                    content={building.luxwallProductRecommendation} 
                                    cellId={`product-${building.id}`} 
                                    maxLength={15}
                                  />
                                </td>
                                <td className="px-3 py-4 text-green-400 text-xs font-medium">{building.rValue}</td>
                                <td className="px-3 py-4 text-green-400 text-xs font-bold">{building.efficiencyImprovement}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.replaceableWindows}</td>
                                <td className="px-3 py-4 text-green-400 text-xs font-medium">{formatCurrency(building.postRetrofitEnergyCost)}</td>
                                <td className="px-3 py-4 text-green-400 text-xs font-bold">{formatCurrency(building.annualEnergySavings)}</td>
                                <td className="px-3 py-4 text-green-400 text-xs font-medium">{building.energyCostReduction}</td>
                                <td className="px-3 py-4 text-blue-400 text-xs font-medium">{formatCurrency(building.installationCost)}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.paybackRoiWithoutIncentives}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.roiInYearsWithoutIncentives}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.year}</td>
                                <td className="px-3 py-4 text-white text-xs">{building.floors}</td>
                                <td className="px-3 py-4 text-white text-xs">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    building.status === 'built' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                    {building.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <button 
                                    className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] text-white rounded-lg px-3 py-2 text-xs font-medium hover:from-[#7a94b8] hover:to-[#0a8a5c] transition-all shadow-lg"
                                    onClick={() => handleViewBuilding(building.id)}
                                  >
                                    View
                                  </button>
                                </td>
                              </>
                            ) : (
                              <td colSpan={25} className="px-4 py-4 text-white/50 text-xs">
                                <div className="flex items-center gap-1">
                                  <MdOutlineWarning size={12} />
                                  <span>Building energy analysis data not yet displayed - click "Show Enriched Data" to process</span>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6 mb-8">
                <div className="text-white/70">
                  Showing <span className="text-white">{((currentPage - 1) * buildingsPerPage) + 1}-{Math.min(currentPage * buildingsPerPage, selectedBuildings.length)}</span> of <span className="text-white">{selectedBuildings.length.toLocaleString()}</span> buildings
                </div>
                <div className="flex gap-2">
                  <button 
                    className="bg-white/10 text-white/70 px-4 py-2 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button 
                        key={pageNum}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          currentPage === pageNum 
                            ? 'bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] text-white shadow-lg' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-white/50 px-2 py-2">...</span>
                      <button 
                        className="bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all"
                        onClick={() => goToPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="bg-white/10 text-white/70 px-4 py-2 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end items-center gap-4 mt-6 mb-4">
                <button
                  onClick={handleDownloadReport}
                  className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                >
                  <MdDownload size={20} />
                  Download Report
                </button>

                <button
                  onClick={handleContinueToSystemAnalysis}
                  className="bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] hover:from-[#7a94b8] hover:to-[#0a8a5c] text-white transition-colors px-6 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                >
                  Continue to Energy Analysis
                  <MdArrowForward size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Visualization Modal */}
      <dialog id="visualization-modal" className="modal modal-bottom sm:modal-middle bg-transparent">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/80 to-[rgba(40,41,43,0.7)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#2a64f5]/15 p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">Building Energy Analysis</h3>
            <button 
              onClick={closeModal}
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {selectedBuildingForModal && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="text-lg font-medium text-white mb-2">{selectedBuildingForModal.name}</h4>
                    <p className="text-white/70 text-sm mb-1">{selectedBuildingForModal.propertyOwner}</p>
                    <p className="text-white/70 text-sm mb-3">
                      <span className="inline-flex items-center gap-1">
                        <MdLocationOn className="text-[#2a64f5]" size={14} />
                        {selectedBuildingForModal.address}
                      </span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-xs text-white/50">Building Type</p>
                        <p className="text-sm text-white">{selectedBuildingForModal.buildingType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Square Footage</p>
                        <p className="text-sm text-white">{formatSquareFootage(selectedBuildingForModal.squareFootage)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Annual Energy Cost</p>
                        <p className="text-sm text-white">{formatCurrency(selectedBuildingForModal.annualEnergyCost)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Total Windows</p>
                        <p className="text-sm text-white">{extractNumericValue(selectedBuildingForModal.totalWindows).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-white/5 p-4 rounded-xl h-full flex flex-col">
                    <h4 className="text-lg font-medium text-white mb-2">Available Energy Visualizations</h4>
                    <ul className="space-y-2 text-white/70 text-sm flex-1">
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#2a64f5]">•</div>
                        <span>Energy Performance Analysis: See how your building's energy consumption compares to similar buildings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#2a64f5]">•</div>
                        <span>Window Efficiency Dashboard: Interactive visualization showing potential energy savings with LuxWall products</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#2a64f5]">•</div>
                        <span>ROI Calculation Graph: Compare current vs. optimized energy costs over time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#2a64f5]">•</div>
                        <span>Cost Breakdown Charts: See where your energy budget is going and how to optimize it</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-[#2a64f5]/20 to-[#7a94b8]/20 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="text-[#2a64f5] mt-1">
                    <MdInfoOutline size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">See Behind the Scenes Data for {selectedBuildingForModal.name}</p>
                    <p className="text-white/70 text-sm mt-1">
                      Go deeper into how we collected and analyzed energy performance metrics specifically for {selectedBuildingForModal.name}. Our visualizations reveal the exact data sources, analysis methods, and optimization potential we've identified for this building.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={goToSystemAnalysis}
                  className="px-6 py-2 bg-gradient-to-r from-[#2a64f5] to-[#7a94b8] text-white rounded-lg hover:from-[#7a94b8] hover:to-[#0a8a5c] transition-all flex items-center gap-2"
                >
                  <span>View Behind the Scenes Data</span>
                  <MdArrowForward />
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default SignalScanner; 
