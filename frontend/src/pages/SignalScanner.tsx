import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdInfo, MdLocationOn, MdOutlineEmail, MdOutlinePhone, MdDownload, MdArrowForward, MdAnalytics, MdFactory, MdSpeed, MdAttachMoney, MdContentCopy, MdTableChart, MdCheck, MdWarning, MdOutlineWarning, MdSearch, MdInfoOutline, MdClose, MdStorage, MdDeveloperBoard } from 'react-icons/md';
import { FaDatabase, FaMoneyBillWave, FaServer, FaChartLine, FaRegLightbulb, FaLayerGroup, FaRegClock, FaBuilding, FaIndustry, FaWarehouse } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { BsGlobe, BsServer, BsCloudDownload, BsGraphUp, BsShieldLock, BsDiagram3, BsCodeSlash, BsFileEarmarkCode } from 'react-icons/bs';
import { AiOutlineApi, AiOutlineNodeIndex, AiOutlineFileSearch, AiOutlineRobot } from 'react-icons/ai';
import { HiOutlineDatabase, HiOutlineDocumentSearch } from 'react-icons/hi';
import { TbWorldSearch } from 'react-icons/tb';

// Add a Company interface at the top of the file, after the imports
interface Company {
  id: number;
  name: string;
  jobTitle: string;
  company: string;
  emails: boolean;
  phoneNumbers: boolean;
  location: string;
  enriched: boolean;
  verified: boolean;
  employeeCount: number;
  industry: string;
  [key: string]: any; // Allow for additional properties
}

// Add more companies from the MarketDatabase to enrichedEnterprises
const enrichedEnterprises = [
  {
    id: 2,
    name: "Kyle Flynn-Kasaba",
    jobTitle: "Head of IT Infrastructure and Operations",
    company: "Wood",
    emails: true,
    phoneNumbers: true,
    location: "Houston, Texas",
    enriched: true,
    verified: true,
    email: "k.flynn-kasaba@example.com",
    phone: "(713) 555-6789",
    systemType: "ERP System",
    userCount: 36000,
    implementationYear: 2019,
    serverCount: 2300,
    annualTransactions: 34250000,
    licenseRate: 0.095, // $ per transaction
    peakLoad: 8450, // transactions per second
    industryAvg: {
      transactionVolume: 28, // per user
      sapAdoption: 8, // percentage
      costPerUser: 215, // $
      implementationTime: 9.8, // months
    },
    sapMetrics: {
      maxThroughput: 9850, // transactions per second
      annualProcessing: 39750000, // transactions
      systemCoverage: 44.1, // percentage
      implementationCost: 7740000, // $
      totalCost: 5418000, // $ after optimizations
      savings: 2322000, // $
      costWithoutOptimization: 3253750, // $ per year
      costWithOptimization: 1771790, // $ per year
      annualSavings: 1481960, // $ per year
      monthlySavings: 123497, // $ per month
      optimizationTime: 11.8, // months
      roi: 8.5, // percentage
      performanceImprovement: 261, // percentage
    },
    industry: "Professional Training & Coaching"
  },
  {
    id: 3,
    name: "Wells Shammout",
    jobTitle: "Vice President, Head of Information Technology",
    company: "IPS",
    emails: true,
    phoneNumbers: true,
    location: "Rutherford, New Jersey",
    enriched: true,
    verified: true,
    email: "w.shammout@example.com",
    phone: "(201) 555-9012",
    systemType: "ERP System",
    userCount: 3400,
    implementationYear: 2016,
    serverCount: 320,
    annualTransactions: 9250000,
    licenseRate: 0.112, // $ per transaction
    peakLoad: 980, // transactions per second
    industryAvg: {
      transactionVolume: 32, // per user
      sapAdoption: 21, // percentage
      costPerUser: 228, // $
      implementationTime: 10.1, // months
    },
    sapMetrics: {
      maxThroughput: 1250, // transactions per second
      annualProcessing: 4750000, // transactions
      systemCoverage: 51.3, // percentage
      implementationCost: 3887500, // $
      totalCost: 2721250, // $ after optimizations
      savings: 1166250, // $
      costWithoutOptimization: 1036000, // $ per year
      costWithOptimization: 503960, // $ per year
      annualSavings: 532040, // $ per year
      monthlySavings: 44337, // $ per month
      optimizationTime: 6.1, // months
      roi: 19.6, // percentage
      performanceImprovement: 75.8, // percentage
    },
    industry: "Information Services"
  },
  {
    id: 4,
    name: "Sanjeev Sharma",
    jobTitle: "Head of Information Technology - Info",
    company: "IPG Photonics",
    emails: true,
    phoneNumbers: true,
    location: "Framingham, Massachusetts",
    enriched: true,
    verified: true,
    email: "s.sharma@example.com",
    phone: "(508) 555-3456",
    systemType: "Manufacturing System",
    userCount: 1600,
    implementationYear: 2014,
    serverCount: 95,
    annualTransactions: 3250000,
    licenseRate: 0.145, // $ per transaction
    peakLoad: 680, // transactions per second
    industryAvg: {
      transactionVolume: 18, // per user
      sapAdoption: 12, // percentage
      costPerUser: 225, // $
      implementationTime: 8.5, // months
    },
    sapMetrics: {
      maxThroughput: 850, // transactions per second
      annualProcessing: 2750000, // transactions
      systemCoverage: 84.6, // percentage
      implementationCost: 2937500, // $
      totalCost: 2056250, // $ after optimizations
      savings: 881250, // $
      costWithoutOptimization: 471250, // $ per year
      costWithOptimization: 242088, // $ per year
      annualSavings: 229162, // $ per year
      monthlySavings: 19097, // $ per month
      optimizationTime: 8.8, // months
      roi: 11.1, // percentage
      performanceImprovement: 48.6, // percentage
    },
    industry: "Electrical/Electronic Manufacturing"
  },
  {
    id: 5,
    name: "Leah Sullivan",
    jobTitle: "Head of IT application Engineering",
    company: "Henkel",
    emails: true,
    phoneNumbers: true,
    location: "Watchung, New Jersey",
    enriched: true,
    verified: true,
    email: "l.sullivan@example.com",
    phone: "(908) 555-7890",
    systemType: "ERP System",
    userCount: 48000,
    implementationYear: 2020,
    serverCount: 1820,
    annualTransactions: 25650000,
    licenseRate: 0.102, // $ per transaction
    peakLoad: 4250, // transactions per second
    industryAvg: {
      transactionVolume: 32, // per user
      sapAdoption: 9, // percentage
      costPerUser: 318, // $
      implementationTime: 6.3, // months
    },
    sapMetrics: {
      maxThroughput: 5620, // transactions per second
      annualProcessing: 29750000, // transactions
      systemCoverage: 67.5, // percentage
      implementationCost: 15275000, // $
      totalCost: 10692500, // $ after optimizations
      savings: 4582500, // $
      costWithoutOptimization: 2616300, // $ per year
      costWithOptimization: 1308150, // $ per year
      annualSavings: 1308150, // $ per year
      monthlySavings: 109013, // $ per month
      optimizationTime: 9.4, // months
      roi: 10.7, // percentage
      performanceImprovement: 63.2, // percentage
    },
    industry: "Mechanical Or Industrial Engineering"
  },
  {
    id: 6,
    name: "Benjamin Partout",
    jobTitle: "Head of Information Technology",
    company: "Strive",
    emails: true,
    phoneNumbers: true,
    location: "Denver, Colorado",
    enriched: true,
    verified: true,
    email: "b.partout@example.com",
    phone: "(720) 555-0123",
    systemType: "ERP System",
    userCount: 160,
    implementationYear: 2019,
    serverCount: 22,
    annualTransactions: 950000,
    licenseRate: 0.108, // $ per transaction
    peakLoad: 280, // transactions per second
    industryAvg: {
      transactionVolume: 12, // per user
      sapAdoption: 10, // percentage
      costPerUser: 322, // $
      implementationTime: 5.8, // months
    },
    sapMetrics: {
      maxThroughput: 430, // transactions per second
      annualProcessing: 1372000, // transactions
      systemCoverage: 144.4, // percentage
      implementationCost: 875600, // $
      totalCost: 612920, // $ after optimizations
      savings: 262680, // $
      costWithoutOptimization: 102600, // $ per year
      costWithOptimization: 33816, // $ per year
      annualSavings: 68784, // $ per year
      monthlySavings: 5732, // $ per month
      optimizationTime: 8.9, // months
      roi: 11.2, // percentage
      performanceImprovement: 67.0, // percentage
    },
    industry: "Chemicals - Research"
  },
  {
    id: 7,
    name: "Henry Ifiuscati",
    jobTitle: "Head of Information Technology",
    company: "Liberty Mutual Insurance",
    emails: true,
    phoneNumbers: true,
    location: "Boston, Massachusetts",
    enriched: true,
    verified: true,
    email: "h.ifiuscati@example.com",
    phone: "(617) 555-4567",
    systemType: "Finance System",
    userCount: 45000,
    implementationYear: 2015,
    serverCount: 3580,
    annualTransactions: 41250000,
    licenseRate: 0.115, // $ per transaction
    peakLoad: 9800, // transactions per second
    industryAvg: {
      transactionVolume: 21, // per user
      sapAdoption: 14, // percentage
      costPerUser: 229, // $
      implementationTime: 12.7, // months
    },
    sapMetrics: {
      maxThroughput: 11300, // transactions per second
      annualProcessing: 57250000, // transactions
      systemCoverage: 122.7, // percentage
      implementationCost: 10325000, // $
      totalCost: 7227500, // $ after optimizations
      savings: 3097500, // $
      costWithoutOptimization: 4743750, // $ per year
      costWithOptimization: 1895500, // $ per year
      annualSavings: 2848250, // $ per year
      monthlySavings: 237354, // $ per month
      optimizationTime: 3.8, // months
      roi: 26.1, // percentage
      performanceImprovement: 67.5, // percentage
    },
    industry: "Insurance - Financial Services"
  },
  {
    id: 8,
    name: "Brandon Thielen",
    jobTitle: "Head of Information Technology",
    company: "Fives Cinetic Corp.",
    emails: true,
    phoneNumbers: true,
    location: "Farmington, Michigan",
    enriched: true,
    verified: true,
    email: "b.thielen@example.com",
    phone: "(248) 555-8901",
    systemType: "Manufacturing System",
    userCount: 2600,
    implementationYear: 2017,
    serverCount: 270,
    annualTransactions: 6500000,
    licenseRate: 0.121, // $ per transaction
    peakLoad: 1120, // transactions per second
    industryAvg: {
      transactionVolume: 18, // per user
      sapAdoption: 13, // percentage
      costPerUser: 245, // $
      implementationTime: 10.1, // months
    },
    sapMetrics: {
      maxThroughput: 1850, // transactions per second
      annualProcessing: 8740000, // transactions
      systemCoverage: 134.5, // percentage
      implementationCost: 3900000, // $
      totalCost: 2730000, // $ after optimizations
      savings: 1170000, // $
      costWithoutOptimization: 786500, // $ per year
      costWithOptimization: 327590, // $ per year
      annualSavings: 458910, // $ per year
      monthlySavings: 38243, // $ per month
      optimizationTime: 7.1, // months
      roi: 14.2, // percentage
      performanceImprovement: 65.1, // percentage
    },
    industry: "Machinery"
  },
  {
    id: 9,
    name: "Tayo Oshoei",
    jobTitle: "Head of Information Technology",
    company: "Holcim",
    emails: true,
    phoneNumbers: true,
    location: "Washington, District of Columbia",
    enriched: true,
    verified: true,
    email: "t.oshoei@example.com",
    phone: "(202) 555-2345",
    systemType: "ERP System",
    userCount: 10100,
    implementationYear: 2016,
    serverCount: 825,
    annualTransactions: 19750000,
    licenseRate: 0.118, // $ per transaction
    peakLoad: 3750, // transactions per second
    industryAvg: {
      transactionVolume: 24, // per user
      sapAdoption: 16, // percentage
      costPerUser: 212, // $
      implementationTime: 13.5, // months
    },
    sapMetrics: {
      maxThroughput: 4950, // transactions per second
      annualProcessing: 26780000, // transactions
      systemCoverage: 126.1, // percentage
      implementationCost: 6060000, // $
      totalCost: 4242000, // $ after optimizations
      savings: 1818000, // $
      costWithoutOptimization: 2330500, // $ per year
      costWithOptimization: 889130, // $ per year
      annualSavings: 1441370, // $ per year
      monthlySavings: 120114, // $ per month
      optimizationTime: 5.2, // months
      roi: 19.3, // percentage
      performanceImprovement: 32.0, // percentage
    },
    industry: "Building Materials"
  },
  {
    id: 10,
    name: "Rahul Chaudhary",
    jobTitle: "Head of Information Technology",
    company: "TEK Inspirations LLC",
    emails: true,
    phoneNumbers: true,
    location: "Frisco, Texas",
    enriched: true,
    verified: true,
    email: "r.chaudhary@example.com",
    phone: "(469) 555-6789",
    systemType: "ERP System",
    userCount: 440,
    implementationYear: 2020,
    serverCount: 45,
    annualTransactions: 1850000,
    licenseRate: 0.135, // $ per transaction
    peakLoad: 380, // transactions per second
    industryAvg: {
      transactionVolume: 17, // per user
      sapAdoption: 12, // percentage
      costPerUser: 198, // $
      implementationTime: 5.8, // months
    },
    sapMetrics: {
      maxThroughput: 540, // transactions per second
      annualProcessing: 2240000, // transactions
      systemCoverage: 121.1, // percentage
      implementationCost: 1320000, // $
      totalCost: 924000, // $ after optimizations
      savings: 396000, // $
      costWithoutOptimization: 249750, // $ per year
      costWithOptimization: 104895, // $ per year
      annualSavings: 144855, // $ per year
      monthlySavings: 12071, // $ per month
      optimizationTime: 6.8, // months
      roi: 14.7, // percentage
      performanceImprovement: 42.1, // percentage
    },
    industry: "Information Technology & Services"
  }
];

const SignalScanner = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEnriching, setIsEnriching] = useState(true);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [selectedEnterprises, setSelectedEnterprises] = useState<any[]>([]);
  const [showEnriched, setShowEnriched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVisualizationToast, setShowVisualizationToast] = useState(false);
  const [selectedEnterpriseForModal, setSelectedEnterpriseForModal] = useState<any>(null);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const [enrichedData, setEnrichedData] = useState(false);
  
  // Total enterprises in the database (showing 2,300 to match MarketDatabase)
  const totalEnterprisesInDatabase = 2300;
  
  // SAP system data
  const sapData = {
    yearlyTransactions: '24,908,730',
    yearlyCost: '$772,170.80',
    systemSize: '155.7 TB',
    processesCovered: '82%',
    monthlyAverage: '$39,910.10',
    firstYear: '$478,920.00',
    tenYearTotal: '$4,286,000.00',
    costWithoutOptimization: '$613,052.90',
    costWithOptimization: '$215,718.36',
    totalLifetimeSavings: '$5,544,130.70',
    breakEven: '26 months',
    location: '303 S Technology Ct, Broomfield, CO',
    region: 'AMERICAS',
    systemId: 'PRD-SAP-001',
    licenseRate: '$0.31/transaction',
    monthlyMaintenance: '$30,000.00',
    moduleCount: '12 modules',
    sapSupport: '$70,000.00/yr',
    implementationCost: '$4.00M',
    systemCapacity: '250 TB'
  };

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
    `;
    document.head.appendChild(style);
    
    // Clean up function to remove the style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Simulate API call to get enterprise data
    setIsLoading(true);
    setTimeout(() => {
      // Try to get filtered companies from localStorage (set by MarketDatabase page)
      try {
        const filteredCompaniesString = localStorage.getItem('filteredCompanies');
        if (filteredCompaniesString) {
          const marketDatabaseCompanies = JSON.parse(filteredCompaniesString);
          
          // Enrich the companies with SAP metrics for visualization
          const enrichedMarketCompanies = marketDatabaseCompanies.map((company: Company) => {
            // Find if we have any existing enriched data for this company
            const existingEnriched = enrichedEnterprises.find(e => 
              e.company.toLowerCase() === company.company.toLowerCase() || 
              e.name.toLowerCase() === company.name.toLowerCase()
            );
            
            // Use existing enriched data or generate some default values
            return {
              ...company,
              systemType: existingEnriched?.systemType || "ERP System",
              userCount: company.employeeCount || 100,
              implementationYear: existingEnriched?.implementationYear || 2019,
              serverCount: existingEnriched?.serverCount || Math.round((company.employeeCount || 100) * 0.15),
              annualTransactions: existingEnriched?.annualTransactions || Math.round((company.employeeCount || 100) * 2500),
              licenseRate: existingEnriched?.licenseRate || 0.115,
              peakLoad: existingEnriched?.peakLoad || Math.round((company.employeeCount || 100) * 0.5),
              industryAvg: existingEnriched?.industryAvg || {
                transactionVolume: 22,
                sapAdoption: 15,
                costPerUser: 235,
                implementationTime: 8.2,
              },
              sapMetrics: existingEnriched?.sapMetrics || {
                maxThroughput: Math.round((company.employeeCount || 100) * 0.7),
                annualProcessing: Math.round((company.employeeCount || 100) * 2000),
                systemCoverage: Math.round(65 + Math.random() * 30),
                implementationCost: Math.round((company.employeeCount || 100) * 1500),
                totalCost: Math.round((company.employeeCount || 100) * 1050),
                savings: Math.round((company.employeeCount || 100) * 450),
                costWithoutOptimization: Math.round((company.employeeCount || 100) * 280),
                costWithOptimization: Math.round((company.employeeCount || 100) * 150),
                annualSavings: Math.round((company.employeeCount || 100) * 130),
                monthlySavings: Math.round((company.employeeCount || 100) * 10.8),
                optimizationTime: Math.round(6 + Math.random() * 6),
                roi: Math.round(10 + Math.random() * 15),
                performanceImprovement: Math.round(45 + Math.random() * 50),
              }
            };
          });
          
          // If we have companies from MarketDatabase, use those
          if (enrichedMarketCompanies.length > 0) {
            setSelectedEnterprises(enrichedMarketCompanies);
            setEnterprise(enrichedMarketCompanies[0]);
          } else {
            // Fallback to default enriched enterprises
            setSelectedEnterprises(enrichedEnterprises);
            setEnterprise(enrichedEnterprises[0]);
          }
        } else {
          // If no specific facilityId and no localStorage data, default to enrichedEnterprises
          if (facilityId) {
            const foundEnterprise = enrichedEnterprises.find(f => f.id === parseInt(facilityId));
            if (foundEnterprise) {
              setEnterprise(foundEnterprise);
              setSelectedEnterprises([foundEnterprise]);
            } else {
              setSelectedEnterprises(enrichedEnterprises);
            }
          } else {
            setSelectedEnterprises(enrichedEnterprises);
            setEnterprise(enrichedEnterprises[0]);
          }
        }
      } catch (error) {
        console.error('Error loading filtered companies from localStorage', error);
        // Fallback to default enriched enterprises
        if (facilityId) {
          const foundEnterprise = enrichedEnterprises.find(f => f.id === parseInt(facilityId));
          if (foundEnterprise) {
            setEnterprise(foundEnterprise);
            setSelectedEnterprises([foundEnterprise]);
          } else {
            setSelectedEnterprises(enrichedEnterprises);
          }
        } else {
          setSelectedEnterprises(enrichedEnterprises);
          setEnterprise(enrichedEnterprises[0]);
        }
      }
      
      setIsLoading(false);
      
      // Simulate data enrichment processing
      setTimeout(() => {
        setIsEnriching(false);
      }, 3000);
    }, 1500);
  }, [facilityId]);

  const handleDownloadReport = () => {
    toast.success('Enriched enterprise data exported successfully');
  };
  
  const handleContinueToSystemAnalysis = () => {
    if (!showEnriched) {
      toast.error("Please enrich the data first by clicking 'Show Enriched Data'");
      return;
    }
    
    navigate('/data-enrichment');
    toast.success("Proceeding to detailed system analysis");
  };

  // Handle toggle enriched data with popup
  const handleToggleEnriched = () => {
    if (!enrichedData && !showEnriched) {
      // First time showing enriched data - simulate loading/processing
      setIsEnriching(true);
      setShowLoadingAnimation(true);
      
      // Simulate API call delay - 5 seconds as requested
      setTimeout(() => {
        setIsEnriching(false);
        setShowLoadingAnimation(false);
        setShowEnriched(true);
        setEnrichedData(true);
        toast.success("SAP system data enrichment complete!");
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
  const handleViewEnterprise = (enterpriseId: number) => {
    const enterpriseToView = selectedEnterprises.find(f => f.id === enterpriseId);
    setSelectedEnterpriseForModal(enterpriseToView);
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
    navigate('/data-enrichment');
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="loading loading-spinner loading-lg text-green-500 relative"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Loading SAP System Data</h2>
            <p className="text-gray-400">Preparing comprehensive system analysis and performance metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to update the existing card class names to match Home page styling
  const cardBaseClass = "backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/80 via-[#28292b]/50 to-[rgba(40,41,43,0.2)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 border border-green-500/15 group relative overflow-hidden";

  return (
    <div className="w-full px-32 py-2 bg-[#020305] min-h-screen min-w-full relative">
      {/* Background gradient orbs */}
      <div className="fixed top-20 right-40 w-96 h-96 bg-gradient-to-br from-[#10ba82]/5 to-transparent rounded-full blur-3xl transform rotate-12 opacity-70 pointer-events-none"></div>
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-gradient-to-tr from-[#10ba82]/5 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-60 pointer-events-none"></div>

      {/* Loading Animation Modal */}
      {showLoadingAnimation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="relative bg-[#1e222b]/90 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-xl max-w-4xl w-full mx-4 animate-fadeIn">
            {/* Animated gradient background for the modal */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#10ba82]/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#10ba82]/30 to-transparent rounded-full blur-3xl animate-pulse delay-700"></div>
              <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-gradient-to-br from-[#10ba82]/20 to-transparent rounded-full blur-2xl animate-pulse delay-300"></div>
            </div>
            
            {/* Floating data points and connection lines - enhanced visual effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-[#10ba82]/30 border border-[#10ba82]/50"
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
                    stroke="#10ba82"
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
                <div className="bg-gradient-to-br from-[#10ba82] to-[#0c9a6c] p-2 rounded-lg shadow">
                  <AiOutlineRobot className="text-xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">AI System Analysis</h3>
              </div>
              <p className="text-white/70 mb-6">Processing enterprise data from multiple sources...</p>
              
              {/* Real-time activity log */}
              <div className="mb-6 bg-black/20 rounded-xl p-4 border border-white/10 h-64 overflow-y-auto font-mono text-sm">
                <div className="space-y-2">
                  <div className="text-[#10ba82] animate-fadeIn">
                    <span className="text-white/50">[00:00.12]</span> Initializing AI data extraction modules...
                  </div>
                  <div className="text-[#10ba82] animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <span className="text-white/50">[00:00.35]</span> Establishing secure connection to SAP databases <BsShieldLock className="inline" />
                  </div>
                  <div className="text-[#10ba82] animate-fadeIn" style={{ animationDelay: '800ms' }}>
                    <span className="text-white/50">[00:01.08]</span> Scraping enterprise profile data from <TbWorldSearch className="inline" /> market intelligence APIs
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '1200ms' }}>
                    <span className="text-white/50">[00:01.45]</span> <BsGlobe className="inline" /> Accessing transaction history records (473,829 entries)
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '1600ms' }}>
                    <span className="text-white/50">[00:01.89]</span> <HiOutlineDatabase className="inline" /> Analyzing system infrastructure metrics...
                  </div>
                  <div className="text-yellow-400 animate-fadeIn" style={{ animationDelay: '2000ms' }}>
                    <span className="text-white/50">[00:02.13]</span> <AiOutlineApi className="inline" /> Accessing third-party financial analysis systems
                  </div>
                  <div className="text-purple-400 animate-fadeIn" style={{ animationDelay: '2400ms' }}>
                    <span className="text-white/50">[00:02.55]</span> <BsCodeSlash className="inline" /> Extracting system architecture and module dependencies
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '2800ms' }}>
                    <span className="text-white/50">[00:03.02]</span> <AiOutlineFileSearch className="inline" /> Cross-referencing with industry performance benchmarks
                  </div>
                  <div className="text-purple-400 animate-fadeIn" style={{ animationDelay: '3200ms' }}>
                    <span className="text-white/50">[00:03.45]</span> <AiOutlineNodeIndex className="inline" /> Building dependency graph for optimization calculations
                  </div>
                  <div className="text-green-400 animate-fadeIn" style={{ animationDelay: '3600ms' }}>
                    <span className="text-white/50">[00:03.98]</span> <BsGraphUp className="inline" /> Generating performance improvement projection models
                  </div>
                  <div className="text-yellow-400 animate-fadeIn" style={{ animationDelay: '4000ms' }}>
                    <span className="text-white/50">[00:04.32]</span> <BsDiagram3 className="inline" /> Creating optimization opportunity map by module
                  </div>
                  <div className="text-blue-400 animate-fadeIn" style={{ animationDelay: '4400ms' }}>
                    <span className="text-white/50">[00:04.75]</span> <BsCloudDownload className="inline" /> Finalizing data compilation and enrichment
                  </div>
                  <div className="text-[#10ba82] animate-fadeIn" style={{ animationDelay: '4800ms' }}>
                    <span className="text-white/50">[00:04.98]</span> Analysis complete! Found <span className="text-white font-bold">{selectedEnterprises ? selectedEnterprises.length : 0}</span> optimization opportunities
                  </div>
                </div>
              </div>
              
              {/* Enhanced Data stream visualization with dots and labels */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-white/70">API Connections</span>
                    <span className="text-xs text-[#10ba82]">Active</span>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="relative">
                        <div className="flex justify-between text-xs text-white/50 mb-1">
                          <span>{['SAP API', 'Financial Data', 'Market Intel', 'System Metrics'][i]}</span>
                          <span className="text-[#10ba82]">
                            {Math.floor(Math.random() * 1000)} req/s
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] rounded-full relative"
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
                    <span className="text-xs text-[#10ba82]">2.3TB</span>
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
                          <stop offset="0%" stopColor="#10ba82" />
                          <stop offset="100%" stopColor="#0c9a6c" />
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
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] h-2 rounded-full w-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>System Analysis</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] h-2 rounded-full w-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-1">
                    <span>Optimization Mapping</span>
                    <span>80%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] h-2 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-3 text-white/70">
                <div className="w-3 h-3 rounded-full bg-[#10ba82] animate-ping"></div>
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
              <MdTableChart className="text-2xl text-[#10ba82]" />
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
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#10ba82]/40 to-transparent rounded-full blur-2xl opacity-90"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Total Systems</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">2.3K</h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#10ba82] via-[#0c9a6c] to-[#0a8a5c] shadow-lg shadow-[#10ba82]/20 backdrop-blur-md border border-white/20">
                        <FaDatabase className="text-white text-xl" />
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
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#10ba82]/40 to-transparent rounded-full blur-2xl opacity-90"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Avg. User Count</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          {Math.round(selectedEnterprises.reduce((sum, enterprise) => sum + enterprise.userCount, 0) / selectedEnterprises.length).toLocaleString()}
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#10ba82] via-[#0c9a6c] to-[#0a8a5c] shadow-lg shadow-[#10ba82]/20 backdrop-blur-md border border-white/20">
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
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#10ba82]/40 to-transparent rounded-full blur-2xl opacity-90"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Avg. SAP ROI</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          {(selectedEnterprises.reduce((sum, enterprise) => sum + enterprise.sapMetrics.roi, 0) / selectedEnterprises.length).toFixed(1)}%
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#10ba82] via-[#0c9a6c] to-[#0a8a5c] shadow-lg shadow-[#10ba82]/20 backdrop-blur-md border border-white/20">
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
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#10ba82]/40 to-transparent rounded-full blur-2xl opacity-90"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Total Transactions</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          {(selectedEnterprises.reduce((sum, enterprise) => sum + enterprise.annualTransactions, 0) / 1000000).toFixed(1)}M
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#10ba82] via-[#0c9a6c] to-[#0a8a5c] shadow-lg shadow-[#10ba82]/20 backdrop-blur-md border border-white/20">
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
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#10ba82]/40 to-transparent rounded-full blur-2xl opacity-90"></div>
                  
                  <div className="relative z-10 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-white/90 mb-1">Total Savings</p>
                        <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                          ${(selectedEnterprises.reduce((sum, enterprise) => sum + enterprise.sapMetrics.annualSavings, 0) / 1000).toFixed(0)}K/yr
                        </h3>
                      </div>
                      <div className="rounded-2xl p-3 bg-gradient-to-br from-[#10ba82] via-[#0c9a6c] to-[#0a8a5c] shadow-lg shadow-[#10ba82]/20 backdrop-blur-md border border-white/20">
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
                        placeholder="Search systems..."
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
                            ? 'bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] text-white shadow-lg shadow-green-500/20' 
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
              
              {/* Enriched Enterprises Table - Fit on one page without horizontal scroll */}
              <div className={`${cardBaseClass}`}>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full table-auto text-sm">
                    <thead>
                      <tr className="text-left border-b border-white/10">
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">System Admin</th>
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">Company</th>
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">Location</th>
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">Type</th>
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">Users</th>
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">Transactions</th>
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">License Rate</th>
                        {showEnriched && (
                          <>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">Throughput</th>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">Efficiency</th>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">Current Cost</th>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">Optimized Cost</th>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">Savings/yr</th>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">ROI</th>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">Payback</th>
                            <th className="px-2 py-3 text-xs font-semibold text-white/70">Performance</th>
                          </>
                        )}
                        <th className="px-2 py-3 text-xs font-semibold text-white/70">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEnterprises
                        .filter(f => 
                          searchTerm ? 
                            f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            f.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.systemType.toLowerCase().includes(searchTerm.toLowerCase())
                            : true
                        )
                        .map((enterprise, index) => (
                          <tr 
                            key={enterprise.id} 
                            className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                          >
                            <td className="px-2 py-2 text-white text-xs">
                              <div className="flex items-center">
                                <div>
                                  <div className="font-medium">{enterprise.name}</div>
                                  <div className="text-xs text-white/50">{enterprise.jobTitle}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-2 text-white text-xs">{enterprise.company}</td>
                            <td className="px-2 py-2 text-white text-xs">{enterprise.location}</td>
                            <td className="px-2 py-2 text-white text-xs">{enterprise.systemType}</td>
                            <td className="px-2 py-2 text-white text-xs">{enterprise.userCount.toLocaleString()}</td>
                            <td className="px-2 py-2 text-white text-xs">{(enterprise.annualTransactions/1000000).toFixed(2)}M</td>
                            <td className="px-2 py-2 text-white text-xs">${enterprise.licenseRate.toFixed(3)}</td>
                            
                            {showEnriched ? (
                              <>
                                <td className="px-2 py-2 text-white text-xs">{enterprise.sapMetrics.maxThroughput} tps</td>
                                <td className="px-2 py-2 text-xs">
                                  <div className="flex items-center">
                                    <div className="w-8 bg-gray-200 rounded-full h-1.5 mr-1">
                                      <div className="bg-[#10ba82] h-1.5 rounded-full" style={{ width: `${Math.min(100, enterprise.sapMetrics.systemCoverage)}%` }}></div>
                                    </div>
                                    <span className="text-white">{enterprise.sapMetrics.systemCoverage.toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td className="px-2 py-2 text-white text-xs">${(enterprise.sapMetrics.costWithoutOptimization/1000).toFixed(0)}K</td>
                                <td className="px-2 py-2 text-white text-xs">${(enterprise.sapMetrics.costWithOptimization/1000).toFixed(0)}K</td>
                                <td className="px-2 py-2 text-[#10ba82] text-xs">${(enterprise.sapMetrics.annualSavings/1000).toFixed(0)}K</td>
                                <td className="px-2 py-2 text-white text-xs">{enterprise.sapMetrics.roi.toFixed(1)}%</td>
                                <td className="px-2 py-2 text-white text-xs">{enterprise.sapMetrics.optimizationTime.toFixed(1)} mo</td>
                                <td className="px-2 py-2 text-white text-xs">{enterprise.sapMetrics.performanceImprovement}%</td>
                                <td className="px-2 py-2 text-xs">
                                  <button 
                                    className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] text-white rounded-lg px-2 py-1 text-xs font-medium hover:from-[#0c9a6c] hover:to-[#0a8a5c] transition-all"
                                    onClick={() => handleViewEnterprise(enterprise.id)}
                                  >
                                    View
                                  </button>
                                </td>
                              </>
                            ) : (
                              <td colSpan={9} className="px-2 py-2 text-white/50 text-xs">
                                <div className="flex items-center gap-1">
                                  <MdOutlineWarning size={12} />
                                  <span>SAP system analysis data not yet displayed</span>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add pagination */}
              <div className="flex justify-between items-center mt-6 mb-8">
                <div className="text-white/70">
                  Showing <span className="text-white">1-{selectedEnterprises.length}</span> of <span className="text-white">{totalEnterprisesInDatabase.toLocaleString()}</span> systems
                </div>
                <div className="flex gap-1">
                  <button className="bg-white/10 text-white/70 px-3 py-1 rounded-md hover:bg-white/20 transition-all">Previous</button>
                  <button className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] text-white px-3 py-1 rounded-md hover:from-[#0c9a6c] hover:to-[#0a8a5c] transition-all">1</button>
                  <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">2</button>
                  <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">3</button>
                  <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">...</button>
                  <button className="bg-white/10 text-white px-3 py-1 rounded-md hover:bg-white/20 transition-all">385</button>
                  <button className="bg-white/10 text-white/70 px-3 py-1 rounded-md hover:bg-white/20 transition-all">Next</button>
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
                  className="bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] hover:from-[#0c9a6c] hover:to-[#0a8a5c] text-white transition-colors px-6 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                >
                  Continue to System Analysis
                  <MdArrowForward size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Visualization Modal */}
      <dialog id="visualization-modal" className="modal modal-bottom sm:modal-middle bg-transparent">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-[#28292b]/90 via-[#28292b]/80 to-[rgba(40,41,43,0.7)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#10ba82]/15 p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">SAP System Analysis</h3>
            <button 
              onClick={closeModal}
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          {selectedEnterpriseForModal && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h4 className="text-lg font-medium text-white mb-2">{selectedEnterpriseForModal.name}</h4>
                    <p className="text-white/70 text-sm mb-1">{selectedEnterpriseForModal.company}</p>
                    <p className="text-white/70 text-sm mb-3">
                      <span className="inline-flex items-center gap-1">
                        <MdLocationOn className="text-[#10ba82]" size={14} />
                        {selectedEnterpriseForModal.location}
                      </span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-xs text-white/50">System Type</p>
                        <p className="text-sm text-white">{selectedEnterpriseForModal.systemType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">User Count</p>
                        <p className="text-sm text-white">{selectedEnterpriseForModal.userCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Transactions</p>
                        <p className="text-sm text-white">{(selectedEnterpriseForModal.annualTransactions/1000000).toFixed(2)}M</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">Throughput</p>
                        <p className="text-sm text-white">{selectedEnterpriseForModal.sapMetrics.maxThroughput} tps</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-white/5 p-4 rounded-xl h-full flex flex-col">
                    <h4 className="text-lg font-medium text-white mb-2">Available Data Visualizations</h4>
                    <ul className="space-y-2 text-white/70 text-sm flex-1">
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#10ba82]">•</div>
                        <span>Transaction Performance Analysis: See how SAP processes your workload across different modules and components</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#10ba82]">•</div>
                        <span>ROI Calculation Graph: Interactive visualization showing potential cost savings over time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#10ba82]">•</div>
                        <span>System Efficiency Dashboard: Compare current vs. optimized performance metrics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-[20px] mt-0.5 text-[#10ba82]">•</div>
                        <span>Cost Breakdown Charts: See where your SAP budget is going and how to optimize it</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-[#10ba82]/20 to-[#0c9a6c]/20 p-4 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="text-[#10ba82] mt-1">
                    <MdInfoOutline size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">See Behind the Scenes Data for {selectedEnterpriseForModal.name}</p>
                    <p className="text-white/70 text-sm mt-1">
                      Go deeper into how we collected and analyzed performance metrics specifically for {selectedEnterpriseForModal.company}. Our visualizations reveal the exact data sources, analysis methods, and optimization potential we've identified for this system.
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
                  className="px-6 py-2 bg-gradient-to-r from-[#10ba82] to-[#0c9a6c] text-white rounded-lg hover:from-[#0c9a6c] hover:to-[#0a8a5c] transition-all flex items-center gap-2"
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